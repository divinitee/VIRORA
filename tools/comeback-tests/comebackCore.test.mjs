// Comeback core tests (Claude 2026-11-10). Run: deno test -A --no-check tools/comeback-tests/comebackCore.test.mjs
import { comebackState, claimTarget, learnedDays, currentStreak, bestStreak, dayKey, missionRoundId, bonusRoundId, reminderFor } from '../../base44/shared/comebackCore.js';
import { buildReminders } from '../../base44/shared/comebackReminder.js';
import { computeComeback } from '../../base44/shared/adminComeback.ts';

const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); };
const NOW = Date.parse('2026-11-10T13:00:00Z'); // 18:00 Tashkent
const ev = (iso, extra = {}) => ({ kind: 'evidence', status: 'done', round_at: iso, items_total: 10, items_credit: 8, ...extra });
const claim = (round_id, iso) => ({ kind: 'reward', status: 'done', game: 'mission', round_id, round_at: iso });

Deno.test('tashkent day boundary', () => {
  eq(dayKey(Date.parse('2026-11-09T18:59:59Z')), '2026-11-09', 'before midnight');
  eq(dayKey(Date.parse('2026-11-09T19:00:00Z')), '2026-11-10', 'after midnight');
});

Deno.test('streak alive until end of today, broken by a gap', () => {
  const L = learnedDays([ev('2026-11-08T10:00:00Z'), ev('2026-11-09T10:00:00Z')]);
  eq(currentStreak(L, '2026-11-10'), 2, 'today not done yet keeps yesterday streak');
  eq(currentStreak(learnedDays([ev('2026-11-07T10:00:00Z')]), '2026-11-10'), 0, 'gap breaks it');
  eq(bestStreak(learnedDays([ev('2026-11-01T10:00:00Z'), ev('2026-11-02T10:00:00Z'), ev('2026-11-03T10:00:00Z'), ev('2026-11-05T10:00:00Z')])), 3, 'best');
});

Deno.test('reward claims and unfinished rounds never count as a day', () => {
  const L = learnedDays([
    claim(missionRoundId('2026-11-10', 'show_up'), '2026-11-10T10:00:00Z'),
    { kind: 'reward', status: 'done', round_id: bonusRoundId('2026-11-09', 2), round_at: '2026-11-10T10:00:00Z' },
    ev('2026-11-10T10:00:00Z', { status: 'claimed' }),
  ]);
  eq(L.size, 0, 'no learned days');
});

Deno.test('missions reward effort: a weak student (4/12 rounds) can finish two of three', () => {
  const receipts = [ev('2026-11-10T08:00:00Z', { items_total: 12, items_credit: 4 }), ev('2026-11-10T08:10:00Z', { items_total: 12, items_credit: 3 })];
  const s = comebackState({ receipts, now: NOW });
  const m = Object.fromEntries(s.missions.map((x) => [x.id, x]));
  eq([m.show_up.done, m.answer_20.done, m.answer_20.progress, m.correct_15.done, m.correct_15.progress], [true, true, 20, false, 7], 'weak student');
});

Deno.test('missions: claimed is per day', () => {
  const receipts = [
    ev('2026-11-10T08:00:00Z', { items_total: 30, items_credit: 20 }),
    ev('2026-11-09T07:00:00Z'),
    claim(missionRoundId('2026-11-10', 'show_up'), '2026-11-10T09:05:00Z'),
    claim(missionRoundId('2026-11-09', 'correct_15'), '2026-11-09T09:05:00Z'), // yesterday's claim
  ];
  const s = comebackState({ receipts, now: NOW });
  const m = Object.fromEntries(s.missions.map((x) => [x.id, x]));
  eq([m.show_up.claimed, m.correct_15.done, m.correct_15.claimed], [true, true, false], 'per day');
  eq(s.week.map((d) => d.learned), [false, false, false, false, false, true, true], 'week strip');
});

Deno.test('streak bonuses: day 2 is the comeback bonus, once per run', () => {
  // learned yesterday only, today not done: nothing claimable, today earns the bonus
  let s = comebackState({ receipts: [ev('2026-11-09T10:00:00Z')], now: NOW });
  eq([s.streak.current, s.bonuses.length, s.next_bonus], [1, 0, { day: 2, reward: 100, days_left: 1 }], 'at risk');
  eq(claimTarget(s, 'streak_2').done, false, 'not reached');
  // day 2 done: bonus claimable, next is day 3 tomorrow
  const two = [ev('2026-11-09T10:00:00Z'), ev('2026-11-10T10:00:00Z')];
  s = comebackState({ receipts: two, now: NOW });
  eq([s.bonuses.map((b) => b.id), s.next_bonus.day, s.next_bonus.days_left, s.streak.run_start], [['streak_2'], 3, 1, '2026-11-09'], 'reached');
  const t = claimTarget(s, 'streak_2');
  eq([t.done, t.claimed, t.round_id, t.reward], [true, false, 'streak:2026-11-09:2', 100], 'target');
  // claimed: gone from the list, claimTarget says claimed
  s = comebackState({ receipts: [...two, claim('streak:2026-11-09:2', '2026-11-10T10:05:00Z')], now: NOW });
  eq([s.bonuses.length, claimTarget(s, 'streak_2').claimed, s.streak.current], [0, true, 2], 'claimed once');
  // a NEW run after a break can earn it again
  const again = [ev('2026-11-05T10:00:00Z'), ev('2026-11-06T10:00:00Z'), claim('streak:2026-11-05:2', '2026-11-06T10:05:00Z'), ev('2026-11-09T10:00:00Z'), ev('2026-11-10T10:00:00Z')];
  s = comebackState({ receipts: again, now: NOW });
  eq(s.bonuses.map((b) => b.id), ['streak_2'], 'new run, new bonus');
  eq(claimTarget(s, 'streak_99'), null, 'unknown bonus');
  // a long existing streak gets every bonus it already earned
  const ten = Array.from({ length: 10 }, (_, i) => ev(`2026-11-${String(i + 1).padStart(2, '0')}T10:00:00Z`));
  s = comebackState({ receipts: ten, now: NOW });
  eq([s.streak.current, s.bonuses.map((b) => b.day), s.next_bonus.day, s.next_bonus.days_left], [10, [2, 3, 5, 7], 14, 4], 'loyal student');
});

Deno.test('fresh student: nothing claimable, 2 days to the first bonus', () => {
  const s = comebackState({ now: NOW });
  eq([s.streak.current, s.streak.run_start, s.bonuses, s.next_bonus], [0, null, [], { day: 2, reward: 100, days_left: 2 }], 'fresh');
});

Deno.test('lesson answers count as a day', () => {
  const s = comebackState({ assessments: [{ created_date: '2026-11-10T05:00:00.000' }], now: NOW });
  eq([s.streak.today_done, s.missions[0].done], [true, true], 'assessment day');
});

Deno.test('admin tracker ignores reward claims', () => {
  const users = [{ id: '1', email: 'a@x', full_name: 'Ann', role: 'user' }];
  const receipts = [
    { user_email: 'a@x', round_at: '2026-11-10T10:00:00Z', game: 'mission', round_id: missionRoundId('2026-11-10', 'show_up') },
    { user_email: 'a@x', round_at: '2026-11-10T10:00:00Z', round_id: bonusRoundId('2026-11-09', 2) },
  ];
  eq(computeComeback({ users, receipts, assessments: [], sessions: [], now: NOW, windowDays: 7 }).summary.learned_today, 0, 'claim is not learning');
});

Deno.test('reminders: who gets which email', () => {
  const L = (...days) => new Set(days);
  eq(reminderFor(L('2026-11-10'), NOW), null, 'learned today: no email');
  eq(reminderFor(L('2026-11-08', '2026-11-09'), NOW), { kind: 'at_risk', streak: 2, bonus: 100 }, 'at risk, day 3 bonus');
  eq(reminderFor(L('2026-11-09', '2026-11-08', '2026-11-07', '2026-11-06'), NOW), { kind: 'at_risk', streak: 4, bonus: 150 }, 'day 5 bonus');
  eq(reminderFor(L('2026-11-08'), NOW), { kind: 'lapsed', gap: 2 }, 'lapsed 2 days');
  eq(reminderFor(L('2026-11-07'), NOW), null, 'lapsed 3 days: silent');
  eq(reminderFor(L('2026-11-04'), NOW), { kind: 'lapsed', gap: 6 }, 'lapsed 6 days');
  eq(reminderFor(L(), NOW), null, 'never learned: silent');

  const users = [
    { email: 'risk@x', full_name: 'Aziz Karimov', role: 'user' },
    { email: 'Done@x', full_name: 'done', role: 'user' },
    { email: 'teacher@x', full_name: 'T', role: 'user', teacher_status: 'approved' },
    { email: 'admin@x', role: 'admin' },
    { email: 'never@x', role: 'user' },
    { email: 'off@x', role: 'user', notifications_enabled: false },
  ];
  const y = '2026-11-09T10:00:00Z', t = '2026-11-10T10:00:00Z';
  const receipts = [
    { user_email: 'risk@x', status: 'done', round_at: y }, { user_email: 'done@x', status: 'done', round_at: t },
    { user_email: 'teacher@x', status: 'done', round_at: y }, { user_email: 'admin@x', status: 'done', round_at: y },
    { user_email: 'off@x', status: 'done', round_at: y },
  ];
  const out = buildReminders({ users, receipts, now: NOW });
  eq(out.map((r) => [r.email, r.kind]), [['risk@x', 'at_risk']], 'only the at-risk student');
  if (!out[0].body.includes('Salom, Aziz!') || !out[0].body.includes('+100 XP') || !out[0].body.includes('https://virora.space')) throw new Error('email body: ' + out[0].body);
  if (/Vocabulary Master/.test(out[0].body)) throw new Error('old brand');
});
