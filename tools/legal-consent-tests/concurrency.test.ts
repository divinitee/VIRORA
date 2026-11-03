// Concurrent idempotency (GPT code audit, 2 Nov 2026, P2).
//
//   deno test --allow-read tools/legal-consent-tests/concurrency.test.ts
//
// world.concurrent = true makes every entity call yield first, so requests
// fired together with Promise.all really interleave between "read prior
// records" and "append". Without the write lock these tests produce
// duplicate rows (see the "broken lock" test at the end, which proves the
// tests can see duplicates at all).

import { assert, assertEquals } from 'jsr:@std/assert@1';
import { CODE, EVENT, collapseDuplicates, deriveStatus } from '../../base44/shared/legalCore.js';
import { LEASE_MS, LOCK_SHARDS, shardFor, withConsentLock } from '../../base44/shared/consentLock.js';
import { ALL_ACTIONS, acceptAll, makeWorld, publish } from './world.ts';

const N = 6;
const rows = (w: any) => w.entities.ConsentRecord.rows;
const byType = (w: any, t: string) => rows(w).filter((r: any) => r.event_type === t);

async function statusReq(w: any, who: string, key: string) {
  const st = await w.call(who, 'getConsentStatus', { locale: 'uz' });
  return { actions: ALL_ACTIONS, release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: key, origin_route: 'app-gate' };
}

Deno.test('concurrency: N simultaneous recordConsent with the SAME key → exactly one row per requirement', async () => {
  for (let round = 0; round < 10; round++) {
    const w = makeWorld();
    await publish(w);
    const req = await statusReq(w, 'ana', 'key-concurrent-' + round);
    w.concurrent = true;
    const res = await Promise.all(Array.from({ length: N }, () => w.call('ana', 'recordConsent', req)));
    w.concurrent = false;
    for (const r of res) assertEquals([r.status, r.ok, r.allowed], [200, true, true], JSON.stringify(r));
    assertEquals(byType(w, EVENT.TERMS_ACCEPTED).length, 1, `round ${round}: terms rows`);
    assertEquals(byType(w, EVENT.DP_GRANTED).length, 1, `round ${round}: grant rows`);
    // Every response points at the same two evidence rows.
    const ids = new Set(res.flatMap((r: any) => r.records.map((x: any) => x.record_id)));
    assertEquals(ids.size, 2);
  }
});

Deno.test('concurrency: N simultaneous withdrawConsent with the SAME key → exactly one withdrawal row', async () => {
  for (let round = 0; round < 10; round++) {
    const w = makeWorld();
    await publish(w);
    await acceptAll(w, 'ana');
    const grant = (await w.call('ana', 'listMyConsents')).records.find((r: any) => r.active_grant);
    w.concurrent = true;
    const res = await Promise.all(Array.from({ length: N }, () =>
      w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-wd-conc-' + round })));
    w.concurrent = false;
    for (const r of res) assert(r.ok, JSON.stringify(r));
    assertEquals(byType(w, EVENT.DP_WITHDRAWN).length, 1, `round ${round}: withdrawal rows`);
    assertEquals(new Set(res.map((r: any) => r.withdrawn.record_id)).size, 1, 'all callers get the same record');
  }
});

Deno.test('concurrency: simultaneous withdrawals of one grant with DIFFERENT keys → one succeeds, the rest find no active grant', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  const grant = (await w.call('ana', 'listMyConsents')).records.find((r: any) => r.active_grant);
  w.concurrent = true;
  const res = await Promise.all(Array.from({ length: N }, (_, i) =>
    w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: `key-wd-tab-0${i}` })));
  w.concurrent = false;
  assertEquals(res.filter((r: any) => r.ok).length, 1);
  assert(res.filter((r: any) => !r.ok).every((r: any) => r.status === 404 && r.code === CODE.NOT_FOUND));
  assertEquals(byType(w, EVENT.DP_WITHDRAWN).length, 1);
});

Deno.test('concurrency: different users do not block each other; every user gets their own two rows', async () => {
  const w = makeWorld();
  await publish(w);
  const reqs = await Promise.all(['ana', 'bob'].map((u) => statusReq(w, u, 'key-multi-' + u)));
  w.concurrent = true;
  const res = await Promise.all([
    ...Array.from({ length: 3 }, () => w.call('ana', 'recordConsent', reqs[0])),
    ...Array.from({ length: 3 }, () => w.call('bob', 'recordConsent', reqs[1])),
  ]);
  w.concurrent = false;
  assert(res.every((r: any) => r.ok && r.allowed));
  for (const u of ['u_ana', 'u_bob']) assertEquals(rows(w).filter((r: any) => r.subject_user_id === u).length, 2);
});

Deno.test('lock: a held lease makes the write wait, then answer LEGAL_WRITE_BUSY (503) with nothing written', async () => {
  const w = makeWorld();
  await publish(w);
  const req = await statusReq(w, 'ana', 'key-busy-0001');
  const lock = w.entities.ConsentWriteLock.rows.find((r: any) => r.shard === shardFor('u_ana'));
  lock.holder = 'lk_someone_else';
  lock.lease_until = new Date(w.now() + LEASE_MS).toISOString();
  w.lockOpts.waitMs = 60;
  const r = await w.call('ana', 'recordConsent', req);
  assertEquals([r.status, r.code], [503, CODE.LEGAL_WRITE_BUSY]);
  assertEquals(rows(w).length, 0);
  // The holder crashed: once its lease runs out, the SAME key goes through.
  w.advance(LEASE_MS + 1);
  const r2 = await w.call('ana', 'recordConsent', req);
  assert(r2.ok && r2.allowed);
  assertEquals(rows(w).length, 2);
});

Deno.test('lock: released after success AND after a failed write (no lock left behind)', async () => {
  const w = makeWorld();
  await publish(w);
  const req = await statusReq(w, 'ana', 'key-release-01');
  w.failCreate = true;
  const bad = await w.call('ana', 'recordConsent', req);
  assertEquals(bad.ok, false);
  const lock = () => w.entities.ConsentWriteLock.rows.find((r: any) => r.shard === shardFor('u_ana'));
  assertEquals(lock().holder, '');
  w.failCreate = false;
  w.lockOpts.waitMs = 60;
  const good = await w.call('ana', 'recordConsent', req);
  assert(good.ok && good.allowed);
  assertEquals(lock().holder, '');
});

Deno.test('lock: rows are seeded when a draft is created, hold no personal data, and duplicates resolve to one canonical row', async () => {
  const w = makeWorld();
  await publish(w);
  const locks = w.entities.ConsentWriteLock.rows;
  assertEquals(locks.length, LOCK_SHARDS);
  assertEquals(new Set(locks.map((r: any) => r.shard)).size, LOCK_SHARDS);
  for (const r of locks) for (const v of Object.values(r)) assert(!String(v).includes('u_ana') && !String(v).includes('@'));
  // Seeding race left a second row for one shard: everyone still uses the oldest.
  const s = shardFor('u_ana');
  await w.entities.ConsentWriteLock.create({ shard: s, version: 0, holder: '', lease_until: new Date(0).toISOString() });
  const req = await statusReq(w, 'ana', 'key-canon-0001');
  w.concurrent = true;
  const res = await Promise.all(Array.from({ length: N }, () => w.call('ana', 'recordConsent', req)));
  w.concurrent = false;
  assert(res.every((r: any) => r.ok));
  assertEquals(rows(w).length, 2);
});

Deno.test('lock: lazily creates a missing shard row (no draft ever ran in this world)', async () => {
  const w = makeWorld();
  const svc = w.entities;
  let ran = 0;
  await withConsentLock(svc, 'u_x', async () => { ran++; }, { now: w.now });
  assertEquals(ran, 1);
  assertEquals(svc.ConsentWriteLock.rows.length, 1);
  assertEquals(svc.ConsentWriteLock.rows[0].holder, '');
});

Deno.test('backstop: duplicate rows sharing a key (a lease that expired mid-write) never change status, receipts or retries', async () => {
  const w = makeWorld();
  await publish(w);
  const first = await statusReq(w, 'ana', 'key-dup-00001');
  assert((await w.call('ana', 'recordConsent', first)).allowed);
  // Simulate the residual case: the same action appended twice.
  const [terms, grant] = rows(w);
  await w.entities.ConsentRecord.create({ ...terms, id: undefined });
  await w.entities.ConsentRecord.create({ ...grant, id: undefined });
  assertEquals(rows(w).length, 4);
  const list = await w.call('ana', 'listMyConsents');
  assertEquals(list.records.length, 2, 'receipts show each action once');
  assertEquals(list.records.map((r: any) => r.record_id), [terms.id, grant.id], 'canonical = earliest');
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals(st.allowed, true);
  const again = await w.call('ana', 'recordConsent', first); // a late retry of the first submission
  assertEquals(new Set(again.records.map((r: any) => r.record_id)), new Set([terms.id, grant.id]));
  assertEquals(rows(w).length, 4, 'retry appended nothing');
  // Withdrawal targets the canonical grant and is itself written once.
  const wd = await w.call('ana', 'withdrawConsent', { related_record_id: grant.id, idempotency_key: 'key-dup-wd-01' });
  assert(wd.ok);
  const after = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals(after.allowed, false);
});

Deno.test('backstop: collapseDuplicates keeps the earliest row per key + event + scope and leaves keyless rows alone', () => {
  const recs = [
    { id: 'b', idempotency_key: 'k1', event_type: EVENT.TERMS_ACCEPTED, occurred_at: '2026-11-01T10:00:01Z' },
    { id: 'a', idempotency_key: 'k1', event_type: EVENT.TERMS_ACCEPTED, occurred_at: '2026-11-01T10:00:00Z' },
    { id: 'c', idempotency_key: 'k1', event_type: EVENT.DP_GRANTED, purpose_scope_id: 's', occurred_at: '2026-11-01T10:00:02Z' },
    { id: 'd', event_type: EVENT.TERMS_ACCEPTED, occurred_at: '2026-11-01T10:00:03Z' },
    { id: 'e', event_type: EVENT.TERMS_ACCEPTED, occurred_at: '2026-11-01T10:00:04Z' },
  ];
  assertEquals(collapseDuplicates(recs).map((r: any) => r.id), ['a', 'c', 'd', 'e']);
  assertEquals(deriveStatus({ required_events_and_scopes: [] }, collapseDuplicates(recs)).allowed, true);
});

Deno.test('control: with a BROKEN lock (every claim "succeeds") the same race does write duplicates — the tests can see them', async () => {
  let dupes = 0;
  for (let round = 0; round < 10 && !dupes; round++) {
    const w = makeWorld();
    await publish(w);
    const req = await statusReq(w, 'ana', 'key-broken-0' + round);
    const real = w.entities.ConsentWriteLock.updateMany;
    w.entities.ConsentWriteLock.updateMany = async (...a: any[]) => { await real(...a); return { success: true, updated: 1, has_more: false }; };
    for (const r of w.entities.ConsentWriteLock.rows) { r.holder = ''; }
    w.concurrent = true;
    await Promise.all(Array.from({ length: N }, () => w.call('ana', 'recordConsent', req)));
    w.concurrent = false;
    if (rows(w).length > 2) dupes++;
    // Even then, readers collapse them.
    const list = await w.call('ana', 'listMyConsents');
    assertEquals(list.records.length, 2);
  }
  assert(dupes > 0, 'expected the unprotected race to produce duplicate rows');
});

Deno.test('self-test (canary action): publisher-only; reports ATOMIC on an atomic store and NOT_PROVEN on a broken one; touches only the reserved shard', async () => {
  const w = makeWorld();
  await publish(w);
  const evidenceBefore = rows(w).length;
  const denied = await w.call('ana', 'adminLockSelfTest', {});
  assertEquals([denied.status, denied.code], [403, CODE.FORBIDDEN]);
  w.concurrent = true;
  const ok = await w.call('tee', 'adminLockSelfTest', {});
  w.concurrent = false;
  assertEquals(ok.self_test.verdict, 'ATOMIC', JSON.stringify(ok));
  assertEquals(ok.self_test.rounds.length, 4);
  assert(ok.self_test.rounds.every((r: any) => r.winners === 1 && r.lost === 8));
  assertEquals(rows(w).length, evidenceBefore, 'no consent evidence written');
  const testRows = w.entities.ConsentWriteLock.rows.filter((r: any) => r.shard === 1000);
  assertEquals(testRows.length, 1);
  assertEquals(testRows[0].holder, '', 'released');
  // A store where every conditional write "succeeds" is caught.
  const real = w.entities.ConsentWriteLock.updateMany;
  w.entities.ConsentWriteLock.updateMany = async (q: any, d: any) => { await real({ id: q.id }, d); return { success: true, updated: 1, has_more: false }; };
  const bad = await w.call('tee', 'adminLockSelfTest', { rounds: 2 });
  assertEquals(bad.self_test.verdict, 'NOT_PROVEN');
});

Deno.test('self-test verdict: ANY rate-limited, errored or failed round → NOT_PROVEN, even if the clean rounds were perfect', async () => {
  const tooMany = () => Object.assign(new Error('429'), { response: { status: 429, headers: {} } });
  const run = async (sabotage: (w: any) => void, rounds = 4) => {
    const w = makeWorld();
    await publish(w);
    sabotage(w);
    return (await w.call('tee', 'adminLockSelfTest', { rounds })).self_test;
  };
  // 1. One claim in round 2 rate-limited (the other 3 rounds perfect).
  let r = await run((w) => {
    const real = w.entities.ConsentWriteLock.updateMany; let n = 0;
    w.entities.ConsentWriteLock.updateMany = async (q: any, d: any) => { if (d.$set?.holder && ++n === 12) throw tooMany(); return real(q, d); };
  });
  assertEquals(r.verdict, 'NOT_PROVEN');
  assertEquals(r.rounds.filter((x: any) => x.rate_limited > 0).length, 1);
  assertEquals(r.rounds.filter((x: any) => x.rate_limited === 0 && x.winners === 1).length, 3, 'the other rounds were clean');
  // 2. A non-429 error on one claim.
  r = await run((w) => {
    const real = w.entities.ConsentWriteLock.updateMany; let n = 0;
    w.entities.ConsentWriteLock.updateMany = async (q: any, d: any) => { if (d.$set?.holder && ++n === 3) throw new Error('boom'); return real(q, d); };
  });
  assertEquals(r.verdict, 'NOT_PROVEN');
  assertEquals(r.rounds[0].errors, 1);
  // 3. A round that cannot run at all (reading the shard row fails) → reported as failed, verdict NOT_PROVEN.
  r = await run((w) => {
    const real = w.entities.ConsentWriteLock.filter; let n = 0;
    w.entities.ConsentWriteLock.filter = async (...a: any[]) => { if (++n === 3) throw tooMany(); return real(...a); };
  });
  assertEquals(r.verdict, 'NOT_PROVEN');
  assert(r.rounds.some((x: any) => x.failed && x.reason === 'rate_limited'));
  assertEquals(r.rounds.length, 4, 'every requested round is reported');
  // 4. Holder must be the winner's own token, not just any token from the round.
  r = await run((w) => {
    const real = w.entities.ConsentWriteLock.updateMany;
    w.entities.ConsentWriteLock.updateMany = async (q: any, d: any) => {
      const out = await real(q, d);
      if (d.$set?.holder && out.updated === 1) { const row = w.entities.ConsentWriteLock.rows.find((x: any) => x.id === q.id); row.holder = 'lk_not_the_winner'; }
      return out;
    };
  }, 1);
  assertEquals(r.verdict, 'NOT_PROVEN');
  assertEquals(r.rounds[0].holder_is_the_winner, false);
  // Control: all clean → ATOMIC.
  r = await run(() => {});
  assertEquals(r.verdict, 'ATOMIC');
  assert(r.rounds.every((x: any) => x.winners === 1 && x.lost === 8 && x.holder_is_the_winner));
});
