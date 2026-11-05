// Lease expiry with two handlers really overlapping (GPT re-review, 2 Nov 2026, P2).
//
//   deno test --allow-read tools/legal-consent-tests/lease.test.ts
//
// Handler A takes the lock and is frozen mid-request (a hook parks one of its
// entity calls on a gate). The fake clock is moved past A's lease, handler B
// runs for real against the same lock row, then A is released. These are
// genuine interleavings of two handler invocations, not injected rows.

import { assert, assertEquals } from 'jsr:@std/assert@1';
import { CODE, EVENT } from '../../base44/shared/legalCore.js';
import { FENCE_MARGIN_MS, LEASE_MS, shardFor } from '../../base44/shared/consentLock.js';
import { ALL_ACTIONS, acceptAll, draftBody, makeWorld, publish } from './world.ts';

const rows = (w: any) => w.entities.ConsentRecord.rows;
const byType = (w: any, t: string) => rows(w).filter((r: any) => r.event_type === t);
const lockRow = (w: any, uid = 'u_ana') => w.entities.ConsentWriteLock.rows.find((r: any) => r.shard === shardFor(uid));

function gate() {
  let open!: () => void;
  const p = new Promise<void>((r) => { open = r; });
  return { p, open };
}
// Park the NEXT call of `name` (optionally matching `when`) until released.
function parkNext(w: any, name: string, when: (...a: any[]) => boolean = () => true) {
  const g = gate();
  const reached = gate();
  let armed = true;
  w.hooks[name] = async (...a: any[]) => {
    if (armed && when(...a)) { armed = false; reached.open(); await g.p; }
  };
  return { release: g.open, reached: reached.p };
}

async function req(w: any, who: string, key: string) {
  const st = await w.call(who, 'getConsentStatus', { locale: 'uz' });
  return { actions: ALL_ACTIONS, release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: key, origin_route: 'app-gate' };
}

Deno.test('lease: A stalls past its lease before appending, B claims the expired lock and writes → A aborts (LEGAL_WRITE_BUSY), writes nothing', async () => {
  const w = makeWorld();
  await publish(w);
  const body = await req(w, 'ana', 'key-lease-same-1');
  const park = parkNext(w, 'after:ConsentRecord.count'); // A has read its (empty) history, inside the lock
  const a = w.call('ana', 'recordConsent', body);
  await park.reached;
  const aToken = lockRow(w).holder;
  assert(aToken, 'A holds the lock while parked');
  w.advance(LEASE_MS + 1);
  const b = await w.call('ana', 'recordConsent', body); // same key, a retry from another tab
  assert(b.ok && b.allowed, JSON.stringify(b));
  assertEquals(rows(w).length, 2);
  park.release();
  const ra = await a;
  assertEquals([ra.status, ra.code], [503, CODE.LEGAL_WRITE_BUSY]);
  assertEquals(rows(w).length, 2, 'A wrote nothing after losing the lease');
  // A's client retries with the same key: gets B's rows, appends nothing.
  const retry = await w.call('ana', 'recordConsent', body);
  assert(retry.ok);
  assertEquals(new Set(retry.records.map((r: any) => r.record_id)), new Set(rows(w).map((r: any) => r.id)));
  assertEquals(rows(w).length, 2);
});

Deno.test('lease: A stalls past its lease and B is still mid-write → A aborts and does NOT release B\'s lock', async () => {
  const w = makeWorld();
  await publish(w);
  const body = await req(w, 'ana', 'key-lease-same-2');
  const parkA = parkNext(w, 'ConsentRecord.filter');
  const a = w.call('ana', 'recordConsent', body);
  await parkA.reached;
  w.advance(LEASE_MS + 1);
  const parkB = parkNext(w, 'ConsentRecord.filter');
  const b = w.call('ana', 'recordConsent', body);
  await parkB.reached;
  const bToken = lockRow(w).holder;
  parkA.release();
  const ra = await a;
  assertEquals(ra.code, CODE.LEGAL_WRITE_BUSY);
  assertEquals(lockRow(w).holder, bToken, 'A\'s release is conditioned on its own token');
  parkB.release();
  assert((await b).allowed);
  assertEquals(rows(w).length, 2);
  assertEquals(lockRow(w).holder, '', 'B released at the end');
});

Deno.test('lease: two tabs withdraw one grant with different keys, A stalls past its lease → exactly one withdrawal', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  const grant = (await w.call('ana', 'listMyConsents')).records.find((r: any) => r.active_grant);
  const park = parkNext(w, 'after:ConsentRecord.count'); // A saw the grant as active
  const a = w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-tab-a-0001' });
  await park.reached;
  w.advance(LEASE_MS + 1);
  const b = await w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-tab-b-0001' });
  assert(b.ok);
  park.release();
  const ra = await a;
  assertEquals(ra.code, CODE.LEGAL_WRITE_BUSY);
  assertEquals(byType(w, EVENT.DP_WITHDRAWN).length, 1);
});

Deno.test('lease: inside the safe window A keeps the lock — B waits, then sees A\'s rows (no duplicate, no abort)', async () => {
  const w = makeWorld();
  await publish(w);
  const body = await req(w, 'ana', 'key-lease-safe-1');
  const park = parkNext(w, 'ConsentRecord.filter');
  const a = w.call('ana', 'recordConsent', body);
  await park.reached;
  w.advance(LEASE_MS - FENCE_MARGIN_MS - 1000); // still inside the fence
  const b = w.call('ana', 'recordConsent', body); // must wait for A
  await new Promise((r) => setTimeout(r, 30));
  assertEquals(rows(w).length, 0, 'B did not write while A held a valid lease');
  park.release();
  const [ra, rb] = await Promise.all([a, b]);
  assert(ra.ok && ra.allowed, JSON.stringify(ra));
  assert(rb.ok && rb.allowed, JSON.stringify(rb));
  assertEquals(rows(w).length, 2);
});

Deno.test('lease: stalled past the fence but before expiry → A aborts even though nobody else claimed (fail safe)', async () => {
  const w = makeWorld();
  await publish(w);
  const body = await req(w, 'ana', 'key-lease-fence-1');
  const park = parkNext(w, 'ConsentRecord.filter');
  const a = w.call('ana', 'recordConsent', body);
  await park.reached;
  w.advance(LEASE_MS - FENCE_MARGIN_MS + 1);
  park.release();
  const ra = await a;
  assertEquals(ra.code, CODE.LEGAL_WRITE_BUSY);
  assertEquals(rows(w).length, 0);
  assertEquals(lockRow(w).holder, '', 'released');
  const again = await w.call('ana', 'recordConsent', body);
  assert(again.allowed);
});

Deno.test('lease: the fence is checked before EVERY append — a stall between the two appends stops the second', async () => {
  const w = makeWorld();
  await publish(w);
  const body = await req(w, 'ana', 'key-lease-mid-1');
  // Park A's FIRST create (terms) after it passed the fence; advance past
  // the fence; A must not write the second (grant).
  const park = parkNext(w, 'ConsentRecord.create');
  const a = w.call('ana', 'recordConsent', body);
  await park.reached;
  w.advance(LEASE_MS - FENCE_MARGIN_MS + 1);
  park.release();
  const ra = await a;
  assertEquals(ra.code, CODE.LEGAL_WRITE_BUSY);
  assertEquals(rows(w).map((r: any) => r.event_type), [EVENT.TERMS_ACCEPTED], 'only the append that passed the fence landed');
  // Retry completes the partial attempt (idempotent), still no duplicates.
  const again = await w.call('ana', 'recordConsent', body);
  assert(again.allowed);
  assertEquals(byType(w, EVENT.TERMS_ACCEPTED).length, 1);
  assertEquals(byType(w, EVENT.DP_GRANTED).length, 1);
});

Deno.test('lease: A stalls past its lease BEFORE reading, B writes → A reads B\'s rows and appends nothing (same key) / finds no active grant (other key)', async () => {
  const w = makeWorld();
  await publish(w);
  const body = await req(w, 'ana', 'key-lease-before-1');
  let park = parkNext(w, 'ConsentRecord.filter');
  let a = w.call('ana', 'recordConsent', body);
  await park.reached;
  w.advance(LEASE_MS + 1);
  assert((await w.call('ana', 'recordConsent', body)).allowed);
  park.release();
  const ra = await a;
  assert(ra.ok && ra.allowed, JSON.stringify(ra));
  assertEquals(rows(w).length, 2);
  const grant = rows(w).find((r: any) => r.event_type === EVENT.DP_GRANTED);
  park = parkNext(w, 'ConsentRecord.filter');
  a = w.call('ana', 'withdrawConsent', { related_record_id: grant.id, idempotency_key: 'key-before-wd-a' });
  await park.reached;
  w.advance(LEASE_MS + 1);
  assert((await w.call('ana', 'withdrawConsent', { related_record_id: grant.id, idempotency_key: 'key-before-wd-b' })).ok);
  park.release();
  assertEquals((await a).code, CODE.NOT_FOUND);
  assertEquals(byType(w, EVENT.DP_WITHDRAWN).length, 1);
});

Deno.test('residual (documented): an append still in flight beyond the margin can overlap B — readers collapse it', async () => {
  const w = makeWorld();
  await publish(w);
  const body = await req(w, 'ana', 'key-residual-01');
  // A passes the fence for its first append, then that create hangs past the
  // whole lease while B claims, reads (no A rows yet) and writes both rows.
  const park = parkNext(w, 'ConsentRecord.create');
  const a = w.call('ana', 'recordConsent', body);
  await park.reached;
  w.advance(LEASE_MS + 1);
  const b = await w.call('ana', 'recordConsent', body);
  assert(b.allowed);
  park.release();
  await a; // A's in-flight create lands, then its fence stops the second append
  assertEquals(byType(w, EVENT.TERMS_ACCEPTED).length, 2, 'the one physical duplicate the fence cannot prevent');
  assertEquals(byType(w, EVENT.DP_GRANTED).length, 1);
  const list = await w.call('ana', 'listMyConsents');
  assertEquals(list.records.length, 2, 'receipts show each action once');
  assertEquals((await w.call('ana', 'getConsentStatus', { locale: 'uz' })).allowed, true);
});

Deno.test('rate limit: 429 while claiming → back off and acquire; persistent 429 → LEGAL_WRITE_BUSY with nothing written', async () => {
  const w = makeWorld();
  await publish(w);
  const real = w.entities.ConsentWriteLock.updateMany;
  let limited = 3;
  const tooMany = () => Object.assign(new Error('Rate limit exceeded'), { response: { status: 429, headers: { 'retry-after': '0' } } });
  w.entities.ConsentWriteLock.updateMany = async (q: any, d: any) => {
    if (d.$set?.holder && limited-- > 0) throw tooMany();
    return real(q, d);
  };
  const ok = await w.call('ana', 'recordConsent', await req(w, 'ana', 'key-429-ok-001'));
  assert(ok.allowed, JSON.stringify(ok));
  assertEquals(rows(w).length, 2);

  const w2 = makeWorld();
  await publish(w2);
  const real2 = w2.entities.ConsentWriteLock.updateMany;
  w2.entities.ConsentWriteLock.updateMany = async (q: any, d: any) => { if (d.$set?.holder) throw tooMany(); return real2(q, d); };
  w2.lockOpts.waitMs = 80;
  const bad = await w2.call('ana', 'recordConsent', await req(w2, 'ana', 'key-429-bad-01'));
  assertEquals([bad.status, bad.code], [503, CODE.LEGAL_WRITE_BUSY]);
  assertEquals(rows(w2).length, 0);
});

// ---------------------------------------------------------------------------
// Residual window with a DIFFERENT idempotency key (GPT second re-review).
// Event order is decided by the server acceptance time stamped BEFORE the
// fence (occurred_at, then recorded_at), never by when a delayed write lands.
// So a late-landing append cannot overturn a later user action.

async function publishV14(w: any) {
  w.advance(60_000);
  const body = draftBody('r-1.4');
  body.documents = body.documents.map((d: any) => ({ ...d, version: '1.4', canonical_content: d.canonical_content + '\n\nv1.4' }));
  assert((await w.call('tee', 'adminCreateDraft', body)).ok);
  assert((await w.call('tee', 'adminPublishRelease', { release_id: 'r-1.4', approval_reference: 'LAWYER-2026-11-yy' })).ok);
  w.advance(1000);
}

Deno.test('residual, different key: A\'s re-consent grant lands late AFTER the user withdrew in another tab → the withdrawal still wins (status required)', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana', 'key-v13-accept'); // G0 for r-1.3
  await publishV14(w); // r-1.4 needs a fresh grant → gate
  const body = await req(w, 'ana', 'key-v14-accept');
  // A: re-consent for r-1.4. Its GRANT append passes the fence, then hangs past the lease.
  const park = parkNext(w, 'ConsentRecord.create', (d: any) => d?.event_type === EVENT.DP_GRANTED && d?.idempotency_key === 'key-v14-accept');
  const a = w.call('ana', 'recordConsent', body);
  await park.reached;
  w.advance(LEASE_MS + 1);
  // B: the user withdraws in another tab (different key). G0 is the active grant B sees.
  const active = (await w.call('ana', 'listMyConsents')).records.find((r: any) => r.active_grant);
  const b = await w.call('ana', 'withdrawConsent', { related_record_id: active.record_id, idempotency_key: 'key-tab-withdraw' });
  assert(b.ok, JSON.stringify(b));
  park.release();
  await a; // A's grant lands now, physically after B's withdrawal
  const grantA = rows(w).find((r: any) => r.idempotency_key === 'key-v14-accept' && r.event_type === EVENT.DP_GRANTED);
  const withdrawB = rows(w).find((r: any) => r.idempotency_key === 'key-tab-withdraw');
  assert(rows(w).indexOf(grantA) > rows(w).indexOf(withdrawB), 'A\'s grant really was written after B\'s withdrawal');
  assert(Date.parse(grantA.occurred_at) < Date.parse(withdrawB.occurred_at), 'but it was ACCEPTED earlier');
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals(st.allowed, false, 'the user\'s later withdrawal wins');
  assertEquals((await w.call('ana', 'listMyConsents')).records.filter((r: any) => r.active_grant).length, 0);
});

Deno.test('residual, different key: two gate submissions from two tabs, one landing late → two genuine acceptance events, status allowed, both receipts shown', async () => {
  const w = makeWorld();
  await publish(w);
  const bodyA = await req(w, 'ana', 'key-tab-a-accept');
  const park = parkNext(w, 'ConsentRecord.create', (d: any) => d?.event_type === EVENT.DP_GRANTED && d?.idempotency_key === 'key-tab-a-accept');
  const a = w.call('ana', 'recordConsent', bodyA);
  await park.reached;
  w.advance(LEASE_MS + 1);
  const bodyB = { ...bodyA, idempotency_key: 'key-tab-b-accept' }; // same presentation, second tab
  const b = await w.call('ana', 'recordConsent', bodyB);
  assert(b.allowed, JSON.stringify(b));
  park.release();
  await a;
  // Different keys = two submissions the user really made; nothing collapses them.
  assertEquals(byType(w, EVENT.TERMS_ACCEPTED).length, 2);
  assertEquals(byType(w, EVENT.DP_GRANTED).length, 2);
  assertEquals((await w.call('ana', 'listMyConsents')).records.length, 4);
  assertEquals((await w.call('ana', 'getConsentStatus', { locale: 'uz' })).allowed, true);
  // One withdrawal still revokes the scope, whichever grant it names.
  const active = (await w.call('ana', 'listMyConsents')).records.find((r: any) => r.active_grant);
  assert((await w.call('ana', 'withdrawConsent', { related_record_id: active.record_id, idempotency_key: 'key-after-two-tabs' })).ok);
  assertEquals((await w.call('ana', 'getConsentStatus', { locale: 'uz' })).allowed, false);
});

Deno.test('residual, different key: two withdrawals of one grant, one landing late → status withdrawn; both events kept as evidence', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  const grant = (await w.call('ana', 'listMyConsents')).records.find((r: any) => r.active_grant);
  const park = parkNext(w, 'ConsentRecord.create', (d: any) => d?.idempotency_key === 'key-wd-late-a');
  const a = w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-wd-late-a' });
  await park.reached;
  w.advance(LEASE_MS + 1);
  assert((await w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-wd-late-b' })).ok);
  park.release();
  assert((await a).ok);
  assertEquals(byType(w, EVENT.DP_WITHDRAWN).length, 2);
  assertEquals((await w.call('ana', 'getConsentStatus', { locale: 'uz' })).allowed, false);
  // Re-granting afterwards is the latest event and wins.
  assertEquals((await acceptAll(w, 'ana', 'key-regrant-after-wd')).allowed, true);
});

Deno.test('monitoring: every LEGAL_WRITE_BUSY logs one legal_write_busy line with its reason (rate_limited / contended / fenced)', async () => {
  const logs: any[] = [];
  const warn = console.warn;
  console.warn = (m: string) => { try { logs.push(JSON.parse(String(m))); } catch { /* other output */ } };
  try {
    // rate_limited
    const w = makeWorld();
    await publish(w);
    const real = w.entities.ConsentWriteLock.updateMany;
    w.entities.ConsentWriteLock.updateMany = async (q: any, d: any) => {
      if (d.$set?.holder) throw Object.assign(new Error('429'), { response: { status: 429, headers: {} } });
      return real(q, d);
    };
    w.lockOpts.waitMs = 60;
    await w.call('ana', 'recordConsent', await req(w, 'ana', 'key-mon-429-01'));
    // contended
    const w2 = makeWorld();
    await publish(w2);
    const body2 = await req(w2, 'ana', 'key-mon-cont-1');
    const l = lockRow(w2);
    l.holder = 'lk_other'; l.lease_until = new Date(w2.now() + LEASE_MS).toISOString();
    w2.lockOpts.waitMs = 60;
    await w2.call('ana', 'recordConsent', body2);
    // fenced
    const w3 = makeWorld();
    await publish(w3);
    const body3 = await req(w3, 'ana', 'key-mon-fence-1');
    const park = parkNext(w3, 'after:ConsentRecord.count');
    const a = w3.call('ana', 'recordConsent', body3);
    await park.reached;
    w3.advance(LEASE_MS);
    park.release();
    await a;
  } finally { console.warn = warn; }
  const reasons = logs.filter((e) => e.event === 'legal_write_busy').map((e) => e.reason);
  assertEquals(reasons, ['rate_limited', 'contended', 'fenced']);
  assert(logs.filter((e) => e.event === 'legal_write_busy').every((e) => typeof e.shard === 'number' && !('subject_user_id' in e)), 'lock logs carry no user id');
});
