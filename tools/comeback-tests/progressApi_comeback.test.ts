// Loads the REAL progressApi entry with the SDK mocked (import_map.json) and
// checks getComeback / claimMission end to end: server-side done check,
// exactly-once XP, and that a claim never counts as a learned day.
//   deno test -A --no-check --import-map=tools/comeback-tests/import_map.json tools/comeback-tests/progressApi_comeback.test.ts
import { world } from './mock_sdk.ts';
import { dayKey } from '../../base44/shared/comebackCore.js';
const handler = (await import('../../base44/functions/progressApi/entry.ts')).default;
const E = world.entities;
const call = async (action: string, body: any = {}) => (await handler(new Request('http://x', { method: 'POST', body: JSON.stringify({ action, ...body }) }))).json();
const eq = (a: any, b: any, m: string) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); };

world.me = { id: 'u1', email: 's@x', role: 'user', full_name: 'S' };
const nowIso = new Date().toISOString();
const yIso = new Date(Date.now() - 86400000).toISOString();

Deno.test('fresh student: no streak, nothing claimable, claim refused', async () => {
  const s = await call('getComeback');
  eq([s.ok, s.streak.current, s.streak.today_done, s.xp], [true, 0, false, 0], 'empty');
  const c = await call('claimMission', { mission_id: 'show_up' });
  eq([c.ok, c.code], [false, 'mission_not_done'], 'not done yet');
  const bad = await call('claimMission', { mission_id: 'free_money' });
  eq(bad.code, 'unknown_mission', 'unknown');
});

Deno.test('after learning yesterday + today: streak 2, claim pays once', async () => {
  E.UserCoins.rows.push({ id: 'c1', user_id: 'u1', email: 's@x', coins: 100, total_correct: 10 });
  for (const at of [yIso, nowIso]) {
    await E.RoundReceipt.create({ receipt_key: `s@x|r-${at}|evidence`, user_email: 's@x', round_id: `r-${at}`, kind: 'evidence', status: 'done', round_at: at, items_total: 10, items_credit: 9 });
  }
  const s = await call('getComeback');
  eq([s.streak.current, s.streak.today_done, s.today], [2, true, dayKey(Date.now())], 'streak');
  const m = Object.fromEntries(s.missions.map((x: any) => [x.id, x]));
  eq([m.show_up.done, m.answer_20.done, m.correct_15.done, m.correct_15.progress], [true, false, false, 9], 'missions');
  eq([s.bonuses.map((b: any) => b.id), s.next_bonus.day], [['streak_2'], 3], 'day-2 bonus is waiting');

  const c1 = await call('claimMission', { mission_id: 'show_up' });
  eq([c1.ok, c1.amount, c1.duplicate, c1.xp], [true, 50, false, 150], 'paid 50');
  const c2 = await call('claimMission', { mission_id: 'show_up' });
  eq([c2.ok, c2.amount, c2.duplicate, c2.xp], [true, 0, true, 150], 'second claim pays nothing');
  // racing claims: only one pays
  const [a, b] = await Promise.all([call('claimMission', { mission_id: 'streak_2' }), call('claimMission', { mission_id: 'streak_2' })]);
  eq([a.amount + b.amount], [100], 'streak bonus race pays once');
  const early = await call('claimMission', { mission_id: 'streak_3' });
  eq(early.code, 'mission_not_done', 'day-3 bonus not reached yet');
  const after = await call('getComeback');
  eq(after.xp, 250, 'balance 100 + 50 + 100');
  eq(E.RewardEvent.rows.filter((r) => r.game === 'mission').length, 2, 'two mission ledger rows');
  eq(E.RewardEvent.rows.every((r) => r.coins_state === 'applied' && r.ledger_version === 2), true, 'ledger rows applied, v2');
  eq(after.streak.current, 2, 'claims did not change the streak');
  eq(after.missions.find((x: any) => x.id === 'correct_15').claimed, false, 'unfinished mission unclaimed');
  eq(after.bonuses.length, 0, 'claimed bonus is gone');
});

Deno.test('soft landing: two low rounds switch ease on, two good rounds switch it off', async () => {
  world.me = { id: 'u2', email: 'weak@x', role: 'user' };
  const add = (credit: number, minsAgo: number) => E.RoundReceipt.create({ user_email: 'weak@x', round_id: `w-${minsAgo}`, kind: 'evidence', status: 'done', round_at: new Date(Date.now() - minsAgo * 60000).toISOString(), items_total: 12, items_credit: credit });
  await add(4, 50);
  eq((await call('getSkillState')).ease.on, false, 'one low round: not yet');
  await add(3, 40);
  eq((await call('getSkillState')).ease.on, true, 'two low rounds: eased');
  await add(10, 30);
  eq((await call('getSkillState')).ease.on, true, 'one good round: still eased');
  await add(9, 20);
  eq((await call('getSkillState')).ease.on, false, 'two good rounds: back to normal');
});
