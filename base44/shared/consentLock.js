// Write lock for consent evidence (GPT code audit, 2 Nov 2026, P2).
//
// Problem: recordConsent / withdrawConsent do read-key → check → create. Two
// simultaneous requests with the same idempotency key can both pass the
// check and both append. Base44 has no unique constraints, no transactions
// and no conditional create, so the evidence table itself cannot refuse the
// second row.
//
// What Base44 DOES guarantee: updateMany() re-checks its conditions at the
// moment of the write when the query names a single record's id (the
// documented "claim a record" / "save only if unchanged" pattern). So the
// lock is a small, fixed set of rows in ConsentWriteLock, each claimed with
//   updateMany({ id, version }, { $set: { holder, lease_until }, $inc: { version: 1 } })
// and held only while the caller reads its prior records and appends.
//
// - One lock per user (hashed onto LOCK_SHARDS rows), so the same user's
//   record and withdraw calls are serialised; different users rarely wait.
// - The rows are seeded when a publisher creates a draft (before any release,
//   and so any consent, can exist) and lazily if missing. If seeding ever
//   produced two rows for a shard, every caller picks the same canonical one
//   (oldest created_date, then id).
// - A lease, not a forever lock: a crashed holder blocks for at most LEASE_MS.
// - Holder is a random token. No user id or personal data is stored here.
// - ConsentRecord stays append-only: this module never touches it.
//
// Backstop: if a lease ever expires mid-write, readers still collapse rows
// sharing an idempotency key (legalCore.collapseDuplicates), so a duplicate
// can never change status, receipts or which record a retry returns.

import { CODE, LegalError } from './legalCore.js';

export const LOCK_SHARDS = 16;
export const LEASE_MS = 15_000;
const WAIT_MS = 4_000;
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

// Runs fn() while holding the caller's lock. Throws LEGAL_WRITE_BUSY (503)
// if the lock can't be had within WAIT_MS; the client retries with the SAME
// idempotency key, so nothing is lost or doubled.
export async function withConsentLock(svc, userId, fn, { now = () => Date.now(), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), waitMs = WAIT_MS } = {}) {
  const shard = shardFor(userId);
  const mine = token();
  const started = Date.now();
  let row = null;
  for (let attempt = 0; ; attempt++) {
    row = await shardRow(svc, shard);
    const t = now();
    const free = !row.holder || Date.parse(row.lease_until || EPOCH) <= t;
    if (free) {
      const res = await svc.ConsentWriteLock.updateMany(
        { id: row.id, version: row.version },
        { $set: { holder: mine, lease_until: new Date(t + LEASE_MS).toISOString() }, $inc: { version: 1 } },
      );
      if (res?.updated === 1) break;
    }
    if (Date.now() - started >= waitMs) throw new LegalError(CODE.LEGAL_WRITE_BUSY, 503, 'consent write busy, retry with the same idempotency_key');
    await sleep(Math.min(250, 40 + attempt * 30));
  }
  try {
    return await fn();
  } finally {
    // Release only if still ours (a lease that expired and was re-claimed is
    // left to its new holder).
    await svc.ConsentWriteLock.updateMany(
      { id: row.id, holder: mine },
      { $set: { holder: '', lease_until: EPOCH }, $inc: { version: 1 } },
    ).catch((e) => console.error('consent lock release failed:', e?.message || e));
  }
}
