// Comeback core tests (Claude 2026-11-10). Run: deno test -A tools/comeback-tests/
import { comebackState, learnedDays, currentStreak, bestStreak, dayKey, missionRoundId } from '../../base44/shared/comebackCore.js';
import { computeComeback } from '../../base44/shared/adminComeback.ts';

const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); };
const NOW = Date.parse('2026-11-10T13:00:00Z'); // 18:00 Tashkent
const ev = (iso, extra = {}) => ({ kind: 'evidence', status: 'done', round_at: iso, items_total: 10, items_credit: 8, ...extra });

Deno.test('tashkent day boundary', () => {
  eq(dayKey(Date.parse('2026-11-09T18:59:59Z')), '2026-11-09', 'before midnight');
  eq(dayKey(Date.parse('2026-11-09T19:00:00Z')), '2026-11-10', 'after midnight');
});

Deno.test('streak alive until end of today, broken by a gap', () => {
  const L = learnedDays([ev('2026-11-08T10:00:00Z'), ev('2026-11-09T10:00:00Z')]);
  eq(currentStreak(L, '2026-11-10'), 2, 'today not done yet keeps yesterday streak');
  const L2 = learnedDays([ev('2026-11-07T10:00:00Z')]);
  eq(currentStreak(L2, '2026-11-10'), 0, 'gap breaks it');
  eq(bestStreak(learnedDays([ev('2026-11-01T10:00:00Z'), ev('2026-11-02T10:00:00Z'), ev('2026-11-03T10:00:00Z'), ev('2026-11-05T10:00:00Z')])), 3, 'best');
});

Deno.test('mission claims and unfinished rounds never count as a day', () => {
  const L = learnedDays([
    { kind: 'reward', status: 'done', game: 'mission', round_id: missionRoundId('2026-11-10', 'show_up'), round_at: '2026-11-10T10:00:00Z' },
    ev('2026-11-10T10:00:00Z', { status: 'claimed' }),
  ]);
  eq(L.size, 0, 'no learned days');
});

Deno.test('missions: progress, done, claimed', () => {
  const receipts = [
    ev('2026-11-10T08:00:00Z', { items_total: 10, items_credit: 9 }),
    ev('2026-11-10T09:00:00Z', { items_total: 10, items_credit: 6 }),
    { kind: 'reward', status: 'done', round_id: 'r2', round_at: '2026-11-10T09:00:00Z' },
    { kind: 'reward', status: 'done', game: 'mission', round_id: missionRoundId('2026-11-10', 'show_up'), round_at: '2026-11-10T09:05:00Z' },
    // yesterday's claim must not mark today's mission claimed
    { kind: 'reward', status: 'done', game: 'mission', round_id: missionRoundId('2026-11-09', 'score_80'), round_at: '2026-11-09T09:05:00Z' },
    ev('2026-11-09T07:00:00Z', { items_credit: 10 }), // yesterday: not today's progress
  ];
  const s = comebackState({ receipts, now: NOW });
  eq(s.streak, { current: 2, best: 2, today_done: true }, 'streak');
  const m = Object.fromEntries(s.missions.map((x) => [x.id, x]));
  eq([m.show_up.done, m.show_up.claimed], [true, true], 'show_up');
  eq([m.correct_20.progress, m.correct_20.done], [15, false], 'correct_20 = 9+6');
  eq([m.score_80.progress, m.score_80.done, m.score_80.claimed], [80, true, false], 'score_80 capped, not claimed today');
  eq(s.week.map((d) => d.learned), [false, false, false, false, false, true, true], 'week strip');
});

Deno.test('lesson answers count as a day', () => {
  const s = comebackState({ assessments: [{ created_date: '2026-11-10T05:00:00.000' }], now: NOW });
  eq(s.streak.today_done, true, 'assessment day');
  eq(s.missions[0].done, true, 'show_up done by a lesson');
});

Deno.test('admin tracker ignores mission claims', () => {
  const users = [{ id: '1', email: 'a@x', full_name: 'Ann', role: 'user' }];
  const receipts = [{ user_email: 'a@x', round_at: '2026-11-10T10:00:00Z', game: 'mission', round_id: missionRoundId('2026-11-10', 'show_up') }];
  const r = computeComeback({ users, receipts, assessments: [], sessions: [], now: NOW, windowDays: 7 });
  eq(r.summary.learned_today, 0, 'claim is not learning');
});
