// VT-36 tests: trial / plan expiry rules shared by studentApi.refresh and the
// daily sweep (expireSubscriptions). Pure functions only, no database.
//   deno test tools/subscription-tests/expiry.test.ts
// Added by Claude, 2026-11-02 (autonomous session).

import { assert, assertEquals } from 'jsr:@std/assert@1';
import {
  endInstant, isPastEnd, expiryPatch, subscriptionKind, isLiveCardSub,
} from '../../base44/shared/subscriptionCore.js';

// expires_at "2026-11-05" → access runs to end of that day in Tashkent
// = 2026-11-05T19:00:00Z.
const END = Date.parse('2026-11-05T19:00:00Z');
const trial = { status: 'active', plan: 'Learner Plan', is_trial: true, expires_at: '2026-11-05' };

Deno.test('endInstant = end of the day in Tashkent (19:00 UTC)', () => {
  assertEquals(endInstant(trial), END);
  assertEquals(endInstant({ expires_at: '' }), null);
  assertEquals(endInstant({ expires_at: 'not-a-date' }), null);
});

Deno.test('boundary: 1 ms before end is live, at end is past', () => {
  assertEquals(isPastEnd(trial, END - 1), false);
  assertEquals(isPastEnd(trial, END), true);
  assertEquals(expiryPatch(trial, END - 1), null);
});

Deno.test('expired trial → permanent Free Plan', () => {
  assertEquals(expiryPatch(trial, END), { status: 'active', plan: 'Free Plan', is_trial: false, expires_at: '' });
});

Deno.test('scheduled cancel past its end → cancelled', () => {
  const s = { status: 'active', plan: 'Learner Plan', expires_at: '2026-11-05', cancelled_at: '2026-10-20', provider: 'manual' };
  assertEquals(expiryPatch(s, END), { status: 'cancelled' });
});

Deno.test('paid manual / QR plan past its end → inactive', () => {
  for (const provider of ['manual', 'qr']) {
    const s = { status: 'active', plan: 'VIP Plan', expires_at: '2026-11-05', provider };
    assertEquals(expiryPatch(s, END), { status: 'inactive' });
  }
});

Deno.test('non-active rows and permanent Free Plan are never touched', () => {
  for (const status of ['paused', 'cancelled', 'inactive', 'pending']) {
    assertEquals(expiryPatch({ ...trial, status }, END + 1e9), null);
  }
  assertEquals(expiryPatch({ status: 'active', plan: 'Free Plan', expires_at: '' }, END + 1e9), null);
});

Deno.test('idempotent: applying the patch twice changes nothing more', () => {
  const once = { ...trial, ...expiryPatch(trial, END) };
  assertEquals(expiryPatch(once, END + 1e9), null);
});

Deno.test('read-time truth: subscriptionKind sees an ended trial as free', () => {
  assertEquals(subscriptionKind(trial, END - 1), 'trial');
  assertEquals(subscriptionKind(trial, END), 'free');
  assertEquals(subscriptionKind(trial, null as unknown as number), 'trial'); // raw stored state
});

Deno.test('live Dodo card rows are not reclassified (webhooks own them)', () => {
  const card = { status: 'active', plan: 'Learner Plan', provider: 'dodo', expires_at: '2026-11-05' };
  assert(isLiveCardSub(card));
  assertEquals(subscriptionKind(card, END + 1e9), 'paid');
});
