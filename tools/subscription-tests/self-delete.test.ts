// VT-1.1.2 tests: what a student's own "delete account" may remove.
//   deno test tools/subscription-tests/self-delete.test.ts
import { assertEquals } from 'jsr:@std/assert@1';
import { selfDeletePlan } from '../../base44/shared/subscriptionCore.js';

Deno.test('admin-paused or cancelled rows are kept (no self-unpause via re-onboarding)', () => {
  const p = selfDeletePlan([{ id: 'a', status: 'paused' }, { id: 'b', status: 'cancelled' }]);
  assertEquals(p.remove, []);
  assertEquals(p.kept.map((k) => k.reason), ['on_hold', 'on_hold']);
});

Deno.test('a live card row is kept (deleting it would not stop the card)', () => {
  const p = selfDeletePlan([{ id: 'c', status: 'active', provider: 'dodo', plan: 'Learner Plan' }]);
  assertEquals(p, { remove: [], kept: [{ id: 'c', reason: 'active_card' }] });
});

Deno.test('free plan, trial, lapsed, QR and card-cancel-scheduled rows are removable', () => {
  const rows = [
    { id: '1', status: 'active', plan: 'Free Plan' },
    { id: '2', status: 'active', is_trial: true, plan: 'Learner Plan' },
    { id: '3', status: 'inactive' },
    { id: '4', status: 'active', provider: 'manual', plan: 'VIP Plan' },
    { id: '5', status: 'active', provider: 'dodo', cancelled_at: '2026-11-01', plan: 'Learner Plan' },
  ];
  assertEquals(selfDeletePlan(rows).remove, ['1', '2', '3', '4', '5']);
});

Deno.test('empty / missing input', () => {
  assertEquals(selfDeletePlan([]), { remove: [], kept: [] });
  assertEquals(selfDeletePlan(undefined as unknown as []), { remove: [], kept: [] });
});
