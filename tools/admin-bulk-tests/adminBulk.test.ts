// Bulk select (delete / ban / unban / nudge) + ban guard.
//   deno test -A --no-check tools/admin-bulk-tests/adminBulk.test.ts
import { Ent } from '../comeback-tests/mock_sdk.ts';
import { studentsBulk, screenTargets } from '../../base44/shared/adminBulk.ts';
import { banGuard } from '../../base44/shared/banCore.ts';
import { USER_DATA_ENTITIES } from '../../base44/shared/userDataMap.js';

const eq = (a: any, b: any, m: string) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); };
const NOW = Date.parse('2026-11-12T13:00:00Z');

function world() {
  const names = new Set(['User', 'AdminAuditLog', ...USER_DATA_ENTITIES.map((e: any) => e.name)]);
  const svc: any = {};
  for (const n of names) svc[n] = new Ent(n);
  // mock_sdk's Ent has no deleteMany: exercises the page+delete fallback too
  svc.User.rows.push(
    { id: 'me', email: 'tee@x', role: 'admin' },
    { id: 'a2', email: 'other-admin@x', role: 'admin' },
    { id: 't1', email: 'test1@x', role: 'user' },
    { id: 't2', email: 'test2@x', role: 'user' },
    { id: 's1', email: 'student@x', role: 'user', full_name: 'Aziz Karimov' },
    { id: 's2', email: 'fresh@x', role: 'user' },
  );
  const sent: any[] = [];
  const audits: any[] = [];
  const ctx = (body: any) => ({
    svc, me: { id: 'me', email: 'tee@x', role: 'admin' }, body, now: NOW,
    audit: async (e: any) => { audits.push(e); await svc.AdminAuditLog.create({ ...e, ts: new Date(NOW).toISOString(), outcome: e.outcome || 'ok' }); },
    integrations: { Core: { SendEmail: async (m: any) => { sent.push(m); } } },
  });
  return { svc, ctx, sent, audits };
}

Deno.test('guards: never yourself, never an admin, unknown ids reported', () => {
  const users = [{ id: 'me', role: 'admin' }, { id: 'a2', role: 'admin' }, { id: 'x', role: 'user' }];
  const r = screenTargets(['me', 'a2', 'x', 'x', 'ghost'], users, { id: 'me' });
  eq(r.ok.map((u: any) => u.id), ['x'], 'only the student, once');
  eq(r.refused.map((x: any) => x.reason), ['self', 'admin', 'not_found'], 'refusals');
});

Deno.test('confirm token and limits are enforced server-side', async () => {
  const { ctx } = world();
  for (const [body, field] of [
    [{ op: 'delete', user_ids: ['t1'] }, 'confirm'],
    [{ op: 'delete', confirm: 'ban', user_ids: ['t1'] }, 'confirm'],
    [{ op: 'nuke', confirm: 'nuke', user_ids: ['t1'] }, 'op'],
    [{ op: 'ban', confirm: 'ban', user_ids: [] }, 'user_ids'],
    [{ op: 'ban', confirm: 'ban', user_ids: Array.from({ length: 51 }, (_, i) => `u${i}`) }, 'user_ids'],
  ] as const) {
    let threw: any = null;
    try { await studentsBulk(ctx(body)); } catch (e) { threw = e; }
    if (!threw) throw new Error('should refuse ' + JSON.stringify(body));
    if (!JSON.stringify(threw).includes(field) && !String(threw?.detail?.field || threw?.extra?.field || threw?.message).includes(field)) {
      // AuthError shape varies; at least the code must be invalid_input
      if (threw.code !== 'invalid_input') throw threw;
    }
  }
});

Deno.test('bulk delete removes accounts and their data, keeps payments and bans, refuses admins', async () => {
  const { svc, ctx, audits } = world();
  svc.RoundReceipt.rows.push({ id: 'r1', user_email: 'test1@x' }, { id: 'r2', user_email: 'test2@x' }, { id: 'r3', user_email: 'student@x' });
  svc.UserCoins.rows.push({ id: 'c1', user_id: 't1', email: 'test1@x' });
  svc.ManualPayment.rows.push({ id: 'p1', user_email: 'test1@x', user_id: 't1' });
  svc.AccountBan.rows.push({ id: 'b1', email: 'test2@x', user_id: 't2' });
  const res = await studentsBulk(ctx({ op: 'delete', confirm: 'delete', user_ids: ['t1', 't2', 'a2', 'me'] }));
  eq([res.done, res.failed], [2, 2], 'two deleted, two refused');
  eq(svc.User.rows.map((u: any) => u.id).sort(), ['a2', 'me', 's1', 's2'], 'admins and the real student remain');
  eq(svc.RoundReceipt.rows.map((r: any) => r.id), ['r3'], 'only the real student keeps receipts');
  eq(svc.UserCoins.rows.length, 0, 'coins gone');
  eq([svc.ManualPayment.rows.length, svc.AccountBan.rows.length], [1, 1], 'payment record and ban retained');
  eq(audits.filter((a) => a.action === 'bulk_delete').length, 2, 'one audit row per deleted account');
});

Deno.test('ban -> learner APIs refuse; unban -> allowed again; admins never refused', async () => {
  const { svc, ctx } = world();
  const r1 = await studentsBulk(ctx({ op: 'ban', confirm: 'ban', user_ids: ['s1'], note: 'trial farming' }));
  eq([r1.done, svc.AccountBan.rows.length, svc.AccountBan.rows[0].reason], [1, 1, 'trial farming'], 'banned with reason');
  const again = await studentsBulk(ctx({ op: 'ban', confirm: 'ban', user_ids: ['s1'] }));
  eq([again.results[0].note, svc.AccountBan.rows.length], ['already banned', 1], 'idempotent');
  const g = await banGuard(svc, { id: 's1', email: 'Student@X', role: 'user' });
  eq([g?.status, (await g?.json())?.code], [403, 'account_banned'], 'refused (email match is case-insensitive)');
  eq(await banGuard(svc, { id: 'me', email: 'student@x', role: 'admin' }), null, 'admin never refused');
  eq(await banGuard(svc, { id: 's2', email: 'fresh@x', role: 'user' }), null, 'others unaffected');
  await studentsBulk(ctx({ op: 'unban', confirm: 'unban', user_ids: ['s1'] }));
  eq([svc.AccountBan.rows.length, await banGuard(svc, { id: 's1', email: 'student@x', role: 'user' })], [0, null], 'unbanned');
});

Deno.test('ban guard fails open on a lookup error', async () => {
  const broken = { AccountBan: { filter: async () => { throw new Error('db down'); } } };
  eq(await banGuard(broken, { id: 'x', email: 'x@x', role: 'user' }), null, 'allowed');
});

Deno.test('nudge: right email per student, skips today-practisers, 20 h cooldown', async () => {
  const { svc, ctx, sent } = world();
  // s1 practised yesterday (Tashkent) -> streak at risk; s2 never practised -> start
  svc.RoundReceipt.rows.push({ id: 'y', user_email: 'student@x', status: 'done', kind: 'evidence', round_at: '2026-11-11T10:00:00Z' });
  // t1 practised today -> skipped
  svc.RoundReceipt.rows.push({ id: 't', user_email: 'test1@x', status: 'done', kind: 'evidence', round_at: '2026-11-12T08:00:00Z' });
  const res = await studentsBulk(ctx({ op: 'nudge', confirm: 'nudge', user_ids: ['s1', 's2', 't1'] }));
  eq([res.done, res.skipped], [2, 1], 'two emailed, one skipped');
  eq(sent.map((m) => m.to), ['student@x', 'fresh@x'], 'recipients');
  if (!sent[0].body.includes('Salom, Aziz!') || !sent[0].subject.includes('1 kunlik')) throw new Error('at-risk email: ' + sent[0].subject);
  if (!sent[1].body.includes('birinchi mashg')) throw new Error('start email: ' + sent[1].body);
  const second = await studentsBulk(ctx({ op: 'nudge', confirm: 'nudge', user_ids: ['s1'] }));
  eq([second.done, second.skipped, sent.length], [0, 1, 2], 'cooldown: no second email');
});
