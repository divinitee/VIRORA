// VT-32.1 tests: QR-paid days are never shortened or cut by a Dodo card event.
//   deno test tools/subscription-tests/qr-guard.test.ts
// Added by Claude, 2026-11-03.

import { assertEquals } from 'jsr:@std/assert@1';
import { guardQrDays } from '../../base44/shared/subscriptionCore.js';

const TODAY = '2026-11-03';
// QR approved on a row that had a scheduled card cancel: paid by QR to 3 Dec.
const qrRow = { status: 'active', provider: 'manual', plan: 'Learner Plan', is_trial: false, expires_at: '2026-12-03', dodo_subscription_id: 'sub_1' };
const ids = { provider: 'dodo', last_dodo_event_id: 'evt_9', dodo_subscription_id: 'sub_1' };

Deno.test('card cancel undone → renewal to an EARLIER date is held (QR end kept)', () => {
  const patch = { ...ids, status: 'active', is_trial: false, plan: 'Learner Plan', cancelled_at: '', expires_at: '2026-11-20' };
  const g = guardQrDays(qrRow, patch, TODAY);
  assertEquals(g.held, true);
  assertEquals(g.overlap, true); // card is charging while QR days run → double payment
  assertEquals(g.patch, { last_dodo_event_id: 'evt_9', dodo_subscription_id: 'sub_1' });
});

Deno.test('card period ends (subscription.expired) → QR student keeps access', () => {
  const g = guardQrDays(qrRow, { ...ids, status: 'cancelled' }, TODAY);
  assertEquals(g.held, true);
  assertEquals(g.overlap, false);
  assertEquals('status' in g.patch, false);
});

Deno.test('card cancelled / on_hold / failed never cut QR days', () => {
  for (const p of [
    { ...ids, status: 'active', cancelled_at: TODAY, expires_at: '2026-11-20' }, // cancelled with period left
    { ...ids, status: 'paused', paused_at: TODAY },                               // on_hold
    { ...ids, status: 'inactive' },                                              // failed
  ]) {
    const g = guardQrDays(qrRow, p, TODAY);
    assertEquals(g.held, true);
    assertEquals(Object.keys(g.patch).sort(), ['dodo_subscription_id', 'last_dodo_event_id']);
  }
});

Deno.test('card renews PAST the QR end → card takes the row over normally', () => {
  const patch = { ...ids, status: 'active', cancelled_at: '', expires_at: '2027-01-03' };
  const g = guardQrDays(qrRow, patch, TODAY);
  assertEquals(g.held, false);
  assertEquals(g.patch, patch);
});

Deno.test('normal card rows are never touched by the guard', () => {
  const cardRow = { ...qrRow, provider: 'dodo' };
  const patch = { ...ids, status: 'cancelled' };
  assertEquals(guardQrDays(cardRow, patch, TODAY), { patch, held: false, overlap: false });
});

Deno.test('QR days already used up → Dodo event applies as normal', () => {
  const used = { ...qrRow, expires_at: '2026-11-03' }; // ends today, nothing ahead
  const patch = { ...ids, status: 'cancelled' };
  assertEquals(guardQrDays(used, patch, TODAY).held, false);
});

Deno.test('trial, free plan, paused or missing rows are never held', () => {
  const patch = { ...ids, status: 'cancelled' };
  for (const row of [
    { ...qrRow, is_trial: true }, { ...qrRow, plan: 'Free Plan' }, { ...qrRow, status: 'paused' }, null,
  ]) assertEquals(guardQrDays(row, patch, TODAY).held, false);
});

Deno.test('renewal with no next_billing_date while QR days run → held, flagged', () => {
  const g = guardQrDays(qrRow, { ...ids, status: 'active', cancelled_at: '' }, TODAY);
  assertEquals([g.held, g.overlap], [true, true]);
});
