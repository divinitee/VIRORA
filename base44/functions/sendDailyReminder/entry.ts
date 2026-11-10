import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { buildReminders } from '../../shared/comebackReminder.js';
import { dayKey, addDays, dayStartMs } from '../../shared/comebackCore.js';

// Streak-aware reminder (Comeback Revamp Phase 1, 2026-11-10). Who gets what
// is decided in shared/comebackReminder.js: students only, never anyone who
// already practised today, and lapsed students at most twice.
//
// Runs from the daily schedule (admin identity) or an admin; nobody else may
// trigger a mass email. The schedule ("Kunlik eslatma email") is OFF and only
// Tee turns it on. Best time: evening (19:00 Tashkent = cron "0 14 * * *"),
// when a streak is actually at risk.
//
// Admin preview without sending anything: POST { "dry_run": true }.

const PAGE = 500;
const LOOKBACK_DAYS = 45;

async function pageAll(ent: any, q: any) {
  const out: any[] = [];
  for (let skip = 0; ; skip += PAGE) {
    const page = (await ent.filter(q, 'created_date', PAGE, skip)) || [];
    out.push(...page);
    if (page.length < PAGE) break;
  }
  return out;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const caller = await base44.auth.me();
    if (!caller || caller.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json().catch(() => ({}));
    const dryRun = body?.dry_run === true;

    const svc = base44.asServiceRole.entities;
    const now = Date.now();
    const since = new Date(dayStartMs(addDays(dayKey(now), -LOOKBACK_DAYS))).toISOString();
    const [users, receipts, assessments] = await Promise.all([
      pageAll(svc.User, {}),
      pageAll(svc.RoundReceipt, { status: 'done', round_at: { $gte: since } }),
      pageAll(svc.AssessmentResult, { created_date: { $gte: since } }),
    ]);

    const reminders = buildReminders({ users, receipts, assessments, now });
    const summary = {
      at_risk: reminders.filter((r) => r.kind === 'at_risk').length,
      lapsed: reminders.filter((r) => r.kind === 'lapsed').length,
    };
    if (dryRun) return Response.json({ success: true, dry_run: true, ...summary, reminders });

    let sent = 0, failed = 0;
    for (const r of reminders) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({ to: r.email, subject: r.subject, body: r.body });
        sent++;
      } catch (e) {
        failed++;
        console.error('reminder email failed', r.email, (e as any)?.message);
      }
    }
    return Response.json({ success: true, sent, failed, ...summary, total_students_checked: users.length });
  } catch (error) {
    return Response.json({ error: (error as any).message }, { status: 500 });
  }
});
