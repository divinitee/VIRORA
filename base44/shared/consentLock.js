// Write lock for consent evidence (GPT code audit + re-review, 2 Nov 2026).
//
// Problem: recordConsent / withdrawConsent do read-history → check → append.
// Two simultaneous requests with the same idempotency key could both pass the
// check and both append. Base44 has no unique constraints, no transactions
// and no conditional create, so the evidence table itself cannot refuse the
// second row.
//
// The primitive: updateMany() with a query naming a single record's id is an
// atomic conditional write ("claim a record" / "save only if unchanged" in
// the SDK 0.8.57 docs and docs.base44.com entity-schemas#concurrent-updates).
// Verified LIVE on this app (2 Nov 2026, probe task VT-47.1): 6 rounds of
// 9–20 simultaneous updateMany({id, field: v}, {$inc}) calls → exactly one
// `updated: 1` per round, all others `updated: 0`, counter advanced by
// exactly 1 each round; a naive read-then-write control with 30 callers
// lost 29 of 30 updates, so the requests really did overlap.
//
// Mechanism:
// - One lock per user, hashed onto LOCK_SHARDS fixed rows of ConsentWriteLock.
// - Claim: updateMany({ id, version }, { $set: { holder, lease_until }, $inc: { version: 1 } }),
//   held iff `updated === 1`.
// - Stale-holder fence, BEFORE EVERY APPEND: the holder may append only while
//   its own lease is still valid with a safety margin
//   (now < claimed_at + LEASE_MS − FENCE_MARGIN_MS). Another handler can take
//   the row only after lease_until has passed, so a holder that passes the
//   fence cannot overlap one that claimed after expiry, provided the append
//   finishes within the margin and instance clocks agree to within it. A
//   holder that stalled past the fence aborts with LEGAL_WRITE_BUSY and
//   writes nothing; the client retries with the same idempotency key. The
//   fence costs no API call, which matters: Base44 allows 50 bulk updates per
//   60 s per caller, and legalApi's service token is ONE caller for the whole
//   app (shared with progressApi's coin rewards).
// - Release in finally, conditioned on our holder token.
// - 429 / errors while claiming: back off (honouring Retry-After within the
//   wait budget), then LEGAL_WRITE_BUSY. Nothing is ever written without the
//   lock.
// - Rows are seeded at draft time (before any release, so before any consent)
//   and lazily if missing; duplicate seed rows resolve to the oldest.
// - Holder is a random token: no user id or personal data here.
// - ConsentRecord stays append-only: this module never touches it.
//
// Residual (documented, not silent): an append that is still in flight longer
// than FENCE_MARGIN_MS after passing the fence, or instance clock skew beyond
// the margin. Readers then collapse rows sharing an idempotency key
// (legalCore.collapseDuplicates), so even that cannot change status, receipts
// or retries.

import { CODE, LegalError } from './legalCore.js';

export const LOCK_SHARDS = 16;
export const LEASE_MS = 30_000;
export const FENCE_MARGIN_MS = 15_000;
const WAIT_MS = 6_000;
const EPOCH = new Date(0).toISOString();

export function shardFor(userId) {
  // FNV-1a, 32-bit: stable, no dependencies.
  let h = 0x811c9dc5;
  for (const ch of String(userId)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h % LOCK_SHARDS;
}

const canonical = (rows) =>
  [...rows].sort((a, b) => String(a.created_date || '').localeCompare(String(b.created_date || '')) || String(a.id).localeCompare(String(b.id)))[0];

async function shardRow(svc, shard) {
  let rows = await svc.ConsentWriteLock.filter({ shard }, 'created_date', 10);
  if (!rows.length) {
    await svc.ConsentWriteLock.create({ shard, version: 0, holder: '', lease_until: EPOCH });
    rows = await svc.ConsentWriteLock.filter({ shard }, 'created_date', 10);
  }
  return canonical(rows);
}

// Publisher setup: make sure every shard row exists.
export async function seedConsentLocks(svc) {
  for (let s = 0; s < LOCK_SHARDS; s++) await shardRow(svc, s);
}

const token = () => 'lk_' + (globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random()}`).replace(/[^A-Za-z0-9]/g, '');
const busy = (why) => new LegalError(CODE.LEGAL_WRITE_BUSY, 503, `${why}; retry with the same idempotency_key`);
// One structured line per refusal, for monitoring (search the legalApi
// function logs for "legal_write_busy"). See README "Operations".
const report = (reason, extra) => console.warn(JSON.stringify({ event: 'legal_write_busy', reason, ...extra }));
const retryAfterMs = (e) => {
  const s = Number(e?.response?.headers?.['retry-after'] ?? e?.headers?.get?.('retry-after'));
  return Number.isFinite(s) && s > 0 ? s * 1000 : null;
};

// Runs fn(fence) while holding the caller's lock. fn MUST call fence()
// immediately before every append; fence() throws LEGAL_WRITE_BUSY once the
// lease is no longer safely ours.
export async function withConsentLock(svc, userId, fn, {
  now = () => Date.now(),
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  waitMs = WAIT_MS,
  leaseMs = LEASE_MS,
  marginMs = FENCE_MARGIN_MS,
} = {}) {
  const shard = shardFor(userId);
  const mine = token();
  const started = Date.now();
  let row = null;
  let claimedAt = 0;
  let reason = 'contended';
  for (let attempt = 0; ; attempt++) {
    let pause = Math.min(250, 40 + attempt * 30);
    try {
      row = await shardRow(svc, shard);
      const t = now();
      const free = !row.holder || Date.parse(row.lease_until || EPOCH) <= t;
      if (free) {
        const res = await svc.ConsentWriteLock.updateMany(
          { id: row.id, version: row.version },
          { $set: { holder: mine, lease_until: new Date(t + leaseMs).toISOString() }, $inc: { version: 1 } },
        );
        if (res?.updated === 1) { claimedAt = t; break; }
      }
      reason = 'contended';
    } catch (e) {
      // Rate limit (429) or a transient error: not acquired. Never write.
      reason = (e?.response?.status ?? e?.status) === 429 ? 'rate_limited' : 'error';
      pause = Math.max(pause, retryAfterMs(e) ?? 0);
    }
    if (Date.now() - started + pause > waitMs) {
      report(reason, { shard, attempts: attempt + 1, waited_ms: Date.now() - started });
      throw busy('consent write busy');
    }
    await sleep(pause);
  }
  const fence = () => {
    if (now() >= claimedAt + leaseMs - marginMs) {
      report('fenced', { shard, held_ms: now() - claimedAt });
      throw busy('consent write lock lease no longer safe');
    }
  };
  try {
    return await fn(fence);
  } finally {
    // Release only if still ours (a lease that expired and was re-claimed is
    // left to its new holder). A failed release just lets the lease expire.
    await svc.ConsentWriteLock.updateMany(
      { id: row.id, holder: mine },
      { $set: { holder: '', lease_until: EPOCH }, $inc: { version: 1 } },
    ).catch((e) => console.error('consent lock release failed:', e?.message || e));
  }
}

// Canary self-test (publisher-only, via legalApi adminLockSelfTest): the same
// race as the live Task probe, but on ConsentWriteLock itself through the
// service-role client — the exact path consent writes use. Uses a reserved
// shard (SELFTEST_SHARD), never a user's lock, and touches no evidence.
// Budget: rounds × (parallel + 1) bulk calls; the defaults stay under
// Base44's 50 per 60 s per caller. 429s are counted, not hidden.
export const SELFTEST_SHARD = 1000;
// Verdict (GPT catch-up, 3 Nov 2026): ATOMIC only if EVERY requested round
// completed cleanly — no 429, no error, no round that failed to run — with
// exactly one winner, everyone else updated:0, the version advanced by
// exactly 1, and the stored holder being that winner's own token. A partial
// run (e.g. 1 clean round and 3 rate-limited) is NOT_PROVEN, never ATOMIC.
export async function claimSelfTest(svc, { rounds = 4, parallel = 9 } = {}) {
  const out = [];
  for (let r = 0; r < rounds; r++) {
    try {
      const row = await shardRow(svc, SELFTEST_SHARD);
      const tokens = Array.from({ length: parallel }, () => token());
      const res = await Promise.all(tokens.map((holder) =>
        svc.ConsentWriteLock.updateMany(
          { id: row.id, version: row.version },
          { $set: { holder, lease_until: new Date(Date.now() + LEASE_MS).toISOString() }, $inc: { version: 1 } },
        ).then((x) => ({ updated: x?.updated }), (e) => ({ error: (e?.response?.status ?? e?.status) === 429 ? 429 : 'error' }))));
      const after = await shardRow(svc, SELFTEST_SHARD);
      const winnerIdx = res.map((x, i) => (x.updated === 1 ? i : -1)).filter((i) => i >= 0);
      out.push({
        round: r + 1, winners: winnerIdx.length, lost: res.filter((x) => x.updated === 0).length,
        rate_limited: res.filter((x) => x.error === 429).length, errors: res.filter((x) => x.error === 'error').length,
        version_advanced_by: (after.version ?? 0) - (row.version ?? 0),
        holder_is_the_winner: winnerIdx.length === 1 && after.holder === tokens[winnerIdx[0]],
      });
      await svc.ConsentWriteLock.updateMany({ id: row.id, holder: after.holder }, { $set: { holder: '', lease_until: EPOCH }, $inc: { version: 1 } });
    } catch (e) {
      out.push({ round: r + 1, failed: true, reason: (e?.response?.status ?? e?.status) === 429 ? 'rate_limited' : 'error' });
    }
  }
  const proven = (x) => !x.failed && x.rate_limited === 0 && x.errors === 0 && x.winners === 1
    && x.lost === parallel - 1 && x.version_advanced_by === 1 && x.holder_is_the_winner;
  return {
    rounds: out,
    verdict: out.length === rounds && out.every(proven) ? 'ATOMIC' : 'NOT_PROVEN',
  };
}
