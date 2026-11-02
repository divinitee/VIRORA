// Complete consent history (GPT re-review, 2 Nov 2026, P1).
//
//   deno test --allow-read tools/legal-consent-tests/history.test.ts
//
// Before: loadRecords read ONE page of 1,000 rows sorted oldest-first, so a
// withdrawal recorded after a user's 1,000th row was invisible and an older
// grant still unlocked protected functions. Now the history is paged to the
// end, deduplicated by id, confirmed against count(), and anything it can't
// read completely fails closed.

import { assert, assertEquals } from 'jsr:@std/assert@1';
import { CODE, EVENT, LegalError } from '../../base44/shared/legalCore.js';
import { checkConsent, consentDenial, loadRecords } from '../../base44/shared/consentGuard.js';
import { acceptAll, makeWorld, publish } from './world.ts';

const rows = (w: any) => w.entities.ConsentRecord.rows;

// Pad Ana's history with `n` alternating withdraw/grant events for her scope
// (valid evidence for the live release), ending on a GRANT.
async function padHistory(w: any, n: number) {
  const grant = rows(w).find((r: any) => r.event_type === EVENT.DP_GRANTED);
  let t = Date.parse(grant.occurred_at);
  for (let i = 0; i < n; i++) {
    const withdraw = (n - i) % 2 === 0; // last one (i = n-1) is a grant
    t += 1000;
    await w.entities.ConsentRecord.create({
      ...grant, id: undefined, created_date: undefined,
      event_type: withdraw ? EVENT.DP_WITHDRAWN : EVENT.DP_GRANTED,
      related_record_id: withdraw ? grant.id : undefined,
      idempotency_key: `pad-${String(i).padStart(5, '0')}`,
      occurred_at: new Date(t).toISOString(), recorded_at: new Date(t).toISOString(),
    });
  }
  w.advance(n * 1000 + 60_000);
}

Deno.test('history: a withdrawal recorded after more than 1,000 rows is seen — status required, protected calls denied', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  await padHistory(w, 1201); // 1,203 rows, the last a grant
  assert(rows(w).length > 1200);
  assertEquals((await w.call('ana', 'getConsentStatus', { locale: 'uz' })).allowed, true, 'last event is a grant');
  const active = (await w.call('ana', 'listMyConsents')).records.filter((r: any) => r.active_grant);
  assertEquals(active.length, 1);
  assertEquals(active[0].record_id, rows(w).at(-1).id, 'the active grant is the NEWEST row, beyond the old cap');
  const wd = await w.call('ana', 'withdrawConsent', { related_record_id: active[0].record_id, idempotency_key: 'key-late-withdraw' });
  assert(wd.ok, JSON.stringify(wd));
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([st.allowed, st.required_actions.map((a: any) => a.event_type)], [false, [EVENT.DP_GRANTED]]);
  const denied = await consentDenial(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() });
  assertEquals(denied?.status, 403);
  assertEquals((await denied!.json()).code, CODE.CONSENT_REQUIRED);
});

Deno.test('history: a re-grant recorded after more than 1,000 rows is seen too (no false lock-out)', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  await padHistory(w, 1101); // newest is a grant
  const active = (await w.call('ana', 'listMyConsents')).records.find((r: any) => r.active_grant);
  assert((await w.call('ana', 'withdrawConsent', { related_record_id: active.record_id, idempotency_key: 'key-wd-before-regrant' })).ok);
  assertEquals((await w.call('ana', 'getConsentStatus', { locale: 'uz' })).allowed, false, 'withdrawal at row 1,104 is seen');
  const re = await acceptAll(w, 'ana', 'key-regrant-after-1100');
  assertEquals(re.allowed, true, JSON.stringify(re).slice(0, 300));
  assertEquals(rows(w).at(-1).event_type, EVENT.DP_GRANTED);
  assertEquals((await checkConsent(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() })).allowed, true, 're-grant at row 1,105 is seen');
});

Deno.test('history: count() disagreeing with the rows read → re-read once, then fail closed (503, denied)', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  const realCount = w.entities.ConsentRecord.count;
  w.entities.ConsentRecord.count = async (...a: any[]) => (await realCount(...a)) + 1;
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([st.status, st.code], [503, CODE.CONSENT_CHECK_UNAVAILABLE]);
  const r = await checkConsent(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() });
  assertEquals([r.allowed, r.code], [false, CODE.CONSENT_CHECK_UNAVAILABLE]);
  const wd = await w.call('ana', 'listMyConsents');
  assertEquals(wd.status, 503);
});

Deno.test('history: rows appended while paging → first read is inconsistent, the re-read is complete', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  await padHistory(w, 30);
  let injected = false;
  w.hooks['ConsentRecord.filter'] = async (_q: any, _s: any, _l: any, skip: number) => {
    if (!injected && skip === 10) {
      injected = true;
      const g = rows(w).find((r: any) => r.event_type === EVENT.DP_GRANTED);
      await w.entities.ConsentRecord.create({ ...g, id: undefined, created_date: undefined, event_type: EVENT.DP_WITHDRAWN, idempotency_key: 'mid-read-01', occurred_at: new Date(w.now()).toISOString() });
    }
  };
  const recs = await loadRecords(w.entities, 'u_ana', { page: 10 });
  assert(injected);
  assertEquals(recs.length, rows(w).length, 'every row, including the one appended mid-read');
});

Deno.test('history: past the hard maximum → fail closed, never a truncated evaluation', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  await padHistory(w, 60);
  try {
    await loadRecords(w.entities, 'u_ana', { page: 10, max: 50 });
    throw new Error('expected failure');
  } catch (e) {
    assert(e instanceof LegalError);
    assertEquals((e as LegalError).code, CODE.CONSENT_CHECK_UNAVAILABLE);
  }
  // Exactly at a page boundary under the max still reads completely.
  assertEquals((await loadRecords(w.entities, 'u_ana', { page: 31 })).length, rows(w).length);
});
