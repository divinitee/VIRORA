// Admin Console bulk actions on students (Tee, 11 Nov 2026): select accounts,
// then Delete / Ban / Unban / Nudge. Replaces typing emails one by one on the
// old /admin page.
//
//   delete  server-side data sweep over every user-data entity
//           (shared/userDataMap.js, same list as the old wipe; retained
//           entities such as ManualPayment and AccountBan are kept), then the
//           User row itself. Deleted rows go to Base44's "Recently deleted".
//   ban     AccountBan row: every learner function refuses the account
//           (shared/banCore.ts). Survives deletion, so the email stays banned.
//   unban   removes the AccountBan rows.
//   nudge   one email now, chosen by shared/comebackReminder.nudgeFor
//           (streak at risk / come back after N days / never started).
//           Skips anyone who already practised today, and anyone nudged in
//           the last 20 hours.
//
// Guards (server-side, whatever the browser sends): never yourself, never an
// admin, at most 50 accounts per call, and `confirm` must repeat the op (the
// console's "Are you sure?" step). Every account gets its own audit row.

import { USER_DATA_ENTITIES } from './userDataMap.js';
import { pageAll } from './adminStudents.ts';
import { AuthError } from './adminAuthCore.ts';
import { learnedDays, isMissionReceipt, addDays, dayKey, dayStartMs } from './comebackCore.js';
import { nudgeFor, reminderEmail } from './comebackReminder.js';

export const BULK_OPS = ['delete', 'ban', 'unban', 'nudge'];
export const BULK_MAX = 50;
const NUDGE_COOLDOWN_MS = 20 * 60 * 60 * 1000;
const norm = (e: unknown) => String(e || '').trim().toLowerCase();

/** Pure: which targets may this op touch? Returns { ok: user[], refused: [{user_id, reason}] }. */
export function screenTargets(ids: string[], users: any[], me: any) {
  const byId = new Map(users.map((u: any) => [u.id, u]));
  const ok: any[] = [];
  const refused: any[] = [];
  for (const id of [...new Set(ids)]) {
    const u = byId.get(id);
    if (!u) refused.push({ user_id: id, reason: 'not_found' });
    else if (u.id === me.id) refused.push({ user_id: id, email: u.email, reason: 'self' });
    else if (u.role === 'admin') refused.push({ user_id: id, email: u.email, reason: 'admin' });
    else ok.push(u);
  }
  return { ok, refused };
}

// Delete every row matching q in one entity. deleteMany when the SDK has it,
// otherwise page + delete one by one.
async function deleteWhere(ent: any, q: any): Promise<number> {
  if (typeof ent.deleteMany === 'function') {
    let total = 0;
    for (let i = 0; i < 20; i++) {
      const r = await ent.deleteMany(q);
      const n = Number(r?.deleted) || 0;
      total += n;
      if (!n) break;
    }
    return total;
  }
  let total = 0;
  for (let i = 0; i < 20; i++) {
    const rows = (await ent.filter(q, 'created_date', 200)) || [];
    if (!rows.length) break;
    for (const r of rows) { await ent.delete(r.id); total++; }
    if (rows.length < 200) break;
  }
  return total;
}

export async function sweepUser(svc: any, u: any) {
  const results: any[] = [];
  const jobs = USER_DATA_ENTITIES.filter((e: any) => !e.retain).map((e: any) => async () => {
    const ent = svc[e.name];
    if (!ent) return { name: e.name, deleted: 0, error: 'missing_entity' };
    const queries = [
      ...(u.email ? e.emailFields.map((f: string) => ({ [f]: u.email })) : []),
      ...(u.id ? (e.idFields || []).map((f: string) => ({ [f]: u.id })) : []),
      ...(u.id ? [{ created_by_id: u.id }] : []),
    ];
    let deleted = 0, error = null;
    for (const q of queries) {
      try { deleted += await deleteWhere(ent, q); }
      catch (err) { if (!error) error = (err as any)?.message || String(err); }
    }
    return { name: e.name, deleted, error };
  });
  // A few entities at a time: fast, but kind to the platform's rate limits.
  for (let i = 0; i < jobs.length; i += 6) results.push(...(await Promise.all(jobs.slice(i, i + 6).map((j) => j()))));
  return results;
}

async function doDelete(ctx: any, u: any) {
  const sweep = await sweepUser(ctx.svc, u);
  const rows = sweep.reduce((s, r) => s + r.deleted, 0);
  const errors = sweep.filter((r) => r.error && r.error !== 'missing_entity').map((r) => r.name);
  let account = false;
  try { await ctx.svc.User.delete(u.id); account = true; } catch (e) { console.error('user delete failed', u.id, (e as any)?.message); }
  return { ok: account && !errors.length, note: `${rows} data rows removed${account ? ', account deleted' : ', ACCOUNT ROW NOT DELETED'}${errors.length ? `; errors in ${errors.join(', ')}` : ''}` };
}

async function doBan(ctx: any, u: any, reason: string) {
  const email = norm(u.email);
  const existing = (await ctx.svc.AccountBan.filter({ email }, '-created_date', 1)) || [];
  if (existing.length) return { ok: true, note: 'already banned' };
  await ctx.svc.AccountBan.create({ email, user_id: u.id, reason: reason || '', banned_at: new Date(ctx.now).toISOString(), banned_by: ctx.me.email || '' });
  return { ok: true, note: 'banned' };
}

async function doUnban(ctx: any, u: any) {
  const n = (await deleteWhere(ctx.svc.AccountBan, { email: norm(u.email) })) + (await deleteWhere(ctx.svc.AccountBan, { user_id: u.id }));
  return { ok: true, note: n ? 'unbanned' : 'was not banned' };
}

async function doNudge(ctx: any, u: any, since: string) {
  const recent = (await ctx.svc.AdminAuditLog.filter({ action: 'bulk_nudge', target_id: u.id, outcome: 'ok' }, '-ts', 1)) || [];
  if (recent[0]?.ts && ctx.now - Date.parse(recent[0].ts) < NUDGE_COOLDOWN_MS) return { ok: false, skipped: true, note: 'nudged less than 20 h ago' };
  const [receipts, assessments] = await Promise.all([
    pageAll(ctx.svc.RoundReceipt, { user_email: u.email, status: 'done', round_at: { $gte: since } }),
    pageAll(ctx.svc.AssessmentResult, { user_email: u.email, created_date: { $gte: since } }),
  ]);
  const r = nudgeFor(learnedDays(receipts.filter((x: any) => !isMissionReceipt(x)), assessments), ctx.now);
  if (!r) return { ok: false, skipped: true, note: 'already practised today' };
  const mail = reminderEmail(u, r);
  await ctx.integrations.Core.SendEmail({ to: u.email, subject: mail.subject, body: mail.body });
  return { ok: true, note: `emailed (${r.kind})` };
}

export async function studentsBulk(ctx: any) {
  const op = String(ctx.body?.op || '');
  if (!BULK_OPS.includes(op)) throw new AuthError(400, 'invalid_input', { field: 'op' });
  if (ctx.body?.confirm !== op) throw new AuthError(400, 'invalid_input', { field: 'confirm' });
  const ids = Array.isArray(ctx.body?.user_ids) ? ctx.body.user_ids.map(String).filter(Boolean) : [];
  if (!ids.length) throw new AuthError(400, 'invalid_input', { field: 'user_ids' });
  if (ids.length > BULK_MAX) throw new AuthError(400, 'invalid_input', { field: 'user_ids', detail: `max ${BULK_MAX}` });
  if (op === 'nudge' && !ctx.integrations?.Core?.SendEmail) throw new AuthError(503, 'not_configured', { detail: 'email_unavailable' });

  const users = await pageAll(ctx.svc.User);
  const { ok, refused } = screenTargets(ids, users, ctx.me);
  const reason = String(ctx.body?.note || '').slice(0, 300);
  const since = new Date(dayStartMs(addDays(dayKey(ctx.now), -60))).toISOString();

  const results: any[] = refused.map((r) => ({ ...r, ok: false, note: `refused: ${r.reason}` }));
  for (const u of ok) {
    let res: any;
    try {
      res = op === 'delete' ? await doDelete(ctx, u)
        : op === 'ban' ? await doBan(ctx, u, reason)
        : op === 'unban' ? await doUnban(ctx, u)
        : await doNudge(ctx, u, since);
    } catch (e) {
      res = { ok: false, note: `error: ${(e as any)?.message || e}` };
    }
    results.push({ user_id: u.id, email: u.email, ...res });
    await ctx.audit({
      action: `bulk_${op}`, outcome: res.ok ? 'ok' : res.skipped ? 'refused' : 'error',
      target_type: 'user', target_id: u.id, details: `${u.email}: ${res.note}${reason ? ` | note: ${reason}` : ''}`,
    });
  }
  return {
    op,
    done: results.filter((r) => r.ok).length,
    skipped: results.filter((r) => r.skipped).length,
    failed: results.filter((r) => !r.ok && !r.skipped).length,
    results,
  };
}
