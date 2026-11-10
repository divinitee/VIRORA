// Soft landing rules. Run: deno test -A --no-check tools/comeback-tests/easeCore.test.mjs
import { easeFrom } from '../../base44/shared/easeCore.js';
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); };
// rounds given OLDEST first as [credit, total]; easeFrom wants newest first
const on = (...rounds) => easeFrom(rounds.map(([c, t]) => ({ items_credit: c, items_total: t, status: 'done' })).reverse()).on;

Deno.test('the real students who quit would have been eased', () => {
  eq(on([4, 12], [3, 12]), true, 'Xabibullayev after round 2 (his 3rd round would have been easier)');
  eq(on([3, 12], [4, 12]), true, 'Dinora, on her next visit');
  eq(on([4, 10]), false, 'one bad round is not a pattern');
});

Deno.test('a strong student is never eased', () => {
  eq(on([22, 24], [24, 29], [44, 48], [13, 18]), false, 'Maxiii');
  eq(on([10, 12], [4, 12], [10, 12], [4, 12]), false, 'lows must be consecutive');
});

Deno.test('stays eased until two good rounds in a row; a middling round resets the count', () => {
  eq(on([3, 12], [4, 12], [10, 12]), true, 'one good round is not enough');
  eq(on([3, 12], [4, 12], [10, 12], [6, 12], [10, 12]), true, 'good, middling, good: still eased');
  eq(on([3, 12], [4, 12], [10, 12], [9, 12]), false, 'two good in a row: normal again');
  eq(on([3, 12], [4, 12], [10, 12], [9, 12], [2, 12]), false, 'one slip after recovery does not re-ease');
});

Deno.test('tiny rounds and reward claims are ignored', () => {
  eq(on([0, 2], [0, 3]), false, 'rounds under 5 items');
  eq(easeFrom([{ game: 'mission', round_id: 'mission:2026-11-10:show_up', items_total: 0 }, { items_credit: 3, items_total: 12 }, { round_id: 'streak:2026-11-09:2' }, { items_credit: 4, items_total: 12 }]).on, true, 'claims between rounds do not break the pair');
});
