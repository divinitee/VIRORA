// Writes at the PRODUCTION history cap (GPT review of f845916, P2).
//
//   deno test --allow-read tools/legal-consent-tests/cap.test.ts
//
// Before: appendConsent read a history at the cap, appended, and only then
// re-read. 19,999 rows + 2 new events = 20,001 → the post-write read failed
// closed, the rows persisted, and every retry failed before reaching the
// idempotency check. Now consent-giving writes are preflighted under the lock
// (rows + new rows + active grants afterwards <= RECORD_MAX) and refused with
// NOTHING written; withdrawals are never blocked by the cap.
//
// These tests use the real RECORD_MAX (20,000) and the real legalApi handler.

import { assert, assertEquals } from 'jsr:@std/assert@1';
import { CODE, EVENT } from '../../base44/shared/legalCore.js';
import { RECORD_MAX, assertRoomFor, checkConsent, consentDenial } from '../../base44/shared/consentGuard.js';
import { ALL_ACTIONS, acceptAll, makeWorld, publish } from './world.ts';

const rows = (w: any) => w.entities.ConsentRecord.rows;
const mine = (w: any) => rows(w).filter((r: any) => r.subject_user_id === 'u_ana').length;

// n old rows for Ana that satisfy nothing in the live release (bogus release),
// written straight into the store and dated before everything else.
function pad(w: any, n: number) {
  const base = Date.parse('2023-01-01T00:00:00Z');
  for (let i = 0; i < n; i++) {
    const t = new Date(base + i).toISOString();
    rows(w).push({
      id: `pad_${i}`, created_date: t, subject_user_id: 'u_ana', event_type: EVENT.TERMS_ACCEPTED,
      release_id: 'r-old', document_id: 'public_offer:0.9:uz', document_version: '0.9', document_locale: 'uz',
      document_sha256: '0'.repeat(64), occurred_at: t, recorded_at: t, idempotency_key: `pad-${i}`,
    });
  }
}

async function submission(w: any, key: string) {
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals(st.status, 200, 'history is readable before the write');
  return { actions: ALL_ACTIONS, release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: key, origin_route: 'app-gate' };
}

Deno.test(`cap: ${RECORD_MAX - 1} rows + a 2-event submission → refused with NOTHING written; the retry is refused the same way; status stays readable`, async () => {
  assertEquals(RECORD_MAX, 20_000);
  const w = makeWorld();
  await publish(w);
  pad(w, RECORD_MAX - 1);
  const body = await submission(w, 'key-cap-over-01');
  const r = await w.call('ana', 'recordConsent', body);
  assertEquals([r.status, r.code], [503, CODE.CONSENT_CHECK_UNAVAILABLE]);
  assertEquals(mine(w), RECORD_MAX - 1, 'no new records');
  const again = await w.call('ana', 'recordConsent', body);
  assertEquals([again.status, again.code], [503, CODE.CONSENT_CHECK_UNAVAILABLE]);
  assertEquals(mine(w), RECORD_MAX - 1, 'retry wrote nothing either');
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([st.status, st.allowed], [200, false], 'the user is not locked out of reading their status');
  assertEquals((await w.call('ana', 'listMyConsents')).status, 200, 'receipts still readable');
});

Deno.test(`cap: the largest submission that fits (${RECORD_MAX - 3} rows + 2 events + 1 reserved withdrawal slot) succeeds; its retry is idempotent`, async () => {
  const w = makeWorld();
  await publish(w);
  pad(w, RECORD_MAX - 3);
  const body = await submission(w, 'key-cap-fit-001');
  const r = await w.call('ana', 'recordConsent', body);
  assert(r.ok && r.allowed, JSON.stringify(r).slice(0, 300));
  assertEquals(mine(w), RECORD_MAX - 1);
  const again = await w.call('ana', 'recordConsent', body);
  assert(again.ok && again.allowed);
  assertEquals(mine(w), RECORD_MAX - 1, 'idempotent at the cap: nothing appended');
  assertEquals(new Set(again.records.map((x: any) => x.record_id)), new Set(r.records.map((x: any) => x.record_id)));
});

Deno.test('cap: the reserved slot means a grant at the cap can ALWAYS be withdrawn; afterwards the history is exactly at the cap and still readable', async () => {
  const w = makeWorld();
  await publish(w);
  pad(w, RECORD_MAX - 3);
  assert((await w.call('ana', 'recordConsent', await submission(w, 'key-cap-wd-acc'))).allowed);
  const grant = (await w.call('ana', 'listMyConsents')).records.find((x: any) => x.active_grant);
  const wd = await w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-cap-wd-0001' });
  assert(wd.ok, JSON.stringify(wd));
  assertEquals(mine(w), RECORD_MAX);
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([st.status, st.allowed], [200, false], 'exactly at the cap: readable, consent withdrawn');
  // Same withdrawal retried: idempotent, nothing written.
  assert((await w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-cap-wd-0001' })).ok);
  assertEquals(mine(w), RECORD_MAX);
  // A new grant no longer fits (it would need its own withdrawal slot): refused, nothing written.
  const re = await w.call('ana', 'recordConsent', await submission(w, 'key-cap-regrant'));
  assertEquals([re.status, re.code], [503, CODE.CONSENT_CHECK_UNAVAILABLE]);
  assertEquals(mine(w), RECORD_MAX);
  // Fail-closed for processing: consent is not given.
  assertEquals((await checkConsent(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() })).allowed, false);
});

Deno.test('cap: a withdrawal is never refused for space, even if the history was somehow already full; processing then fails closed', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana', 'key-cap-broken-1');
  pad(w, RECORD_MAX - mine(w)); // full, with an active grant (invariant broken from outside legalApi)
  assertEquals(mine(w), RECORD_MAX);
  const grant = (await w.call('ana', 'listMyConsents')).records.find((x: any) => x.active_grant);
  assert(grant, 'grant visible at exactly the cap');
  const wd = await w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-cap-broken-wd' });
  assert(wd.ok, 'the user can always withdraw');
  assertEquals(mine(w), RECORD_MAX + 1);
  const denied = await consentDenial(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() });
  assertEquals(denied?.status, 503, 'over the cap → protected functions deny');
});

Deno.test('assertRoomFor: one reserved slot per grant that will be active (multi-scope)', () => {
  const h = { physical: 95, max: 100 };
  assertRoomFor(h, 2, 3, 'u'); // 95 + 2 + 3 = 100 fits
  try { assertRoomFor(h, 2, 4, 'u'); throw new Error('expected refusal'); } catch (e) { assertEquals((e as any).code, CODE.CONSENT_CHECK_UNAVAILABLE); }
  assertRoomFor({ physical: 100, max: 100 }, 0, 5, 'u'); // nothing to add: never refused
});
