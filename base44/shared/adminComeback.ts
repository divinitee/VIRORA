// Admin Console, Comeback section (Comeback Revamp, Phase 1, 2026-11-09).
//
// Answers one question: who used VIRORA one day and came back the next?
// Read-only. Owned by Tee's admin view now; the student-facing streak will
// later read the SAME day log, so both always agree.
//
// What counts as a day ("learned"): the student FINISHED something real that
// day (Tashkent calendar day, UTC+5):
//   - a completed round (RoundReceipt status=done: Skill Hub games, grammar,
//     coach rounds), or
//   - a Learning Path lesson answer (AssessmentResult).
// Just opening the app does NOT count. It is shown separately as "opened"
// (ActivitySession) so Tee can see who looked but didn't do anything.
//
// Who is a student: every account that is not an admin and not an approved or
// pending teacher.

import { pageAll } from './adminStudents.ts';
import { displayName } from './adminOverviewCore.ts';

const DAY_MS = 24 * 60 * 60 * 1000;
const TZ_OFFSET_MS = 5 * 60 * 60 * 1000; // Asia/Tashkent, no DST
const WINDOWS = [7, 14, 30];
const normEmail = (e: unknown) => String(e || '').trim().toLowerCase();

// YYYY-MM-DD of the Tashkent calendar day an instant falls on.
export const dayKey = (ms: number) => new Date(ms + TZ_OFFSET_MS).toISOString().slice(0, 10);
const addDays = (key: string, n: number) => new Date(Date.parse(key + 'T00:00:00Z') + n * DAY_MS).toISOString().slice(0, 10);
// The instant a Tashkent day starts.
const dayStartMs = (key: string) => Date.parse(key + 'T00:00:00Z') - TZ_OFFSET_MS;

const isStudent = (u: any) => (u.role || 'user') !== 'admin' && u.teacher_status !== 'approved' && u.teacher_status !== 'pending';

function mark(map: Map<string, Set<string>>, email: unknown, ms: number) {
  const e = normEmail(email);
  if (!e || !Number.isFinite(ms) || ms <= 0) return;
  if (!map.has(e)) map.set(e, new Set());
  map.get(e)!.add(dayKey(ms));
}

// Consecutive learned days ending today. A streak isn't broken until today
// is over, so if today isn't done yet it counts back from yesterday.
export function currentStreak(learned: Set<string>, today: string) {
  let d = learned.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (learned.has(d)) { n++; d = addDays(d, -1); }
  return n;
}

function bestStreak(days: string[], learned: Set<string>) {
  let best = 0, run = 0;
  for (const d of days) { run = learned.has(d) ? run + 1 : 0; if (run > best) best = run; }
  return best;
}

export function computeComeback({ users, receipts, assessments, sessions, now, windowDays }: {
  users: any[]; receipts: any[]; assessments: any[]; sessions: any[]; now: number; windowDays: number;
}) {
  const today = dayKey(now);
  const days: string[] = [];
  for (let i = windowDays - 1; i >= 0; i--) days.push(addDays(today, -i));

  const learned = new Map<string, Set<string>>();
  const opened = new Map<string, Set<string>>();
  for (const r of receipts) mark(learned, r.user_email, Date.parse(r.round_at || r.created_date || ''));
  for (const a of assessments) mark(learned, a.user_email, Date.parse(a.created_date || ''));
  for (const s of sessions) mark(opened, s.student_email, Date.parse(s.started_at || s.created_date || ''));

  const empty = new Set<string>();
  const rows = users.filter(isStudent).map((u: any) => {
    const e = normEmail(u.email);
    const L = learned.get(e) || empty;
    const O = opened.get(e) || empty;
    const inWindow = days.filter((d) => L.has(d));
    const lastLearned = [...L].sort().pop() || null;
    return {
      user_id: u.id,
      name: displayName(u),
      email: u.email || '',
      joined_at: u.created_date || '',
      // one code per day, oldest first: L = learned, O = opened only, '' = nothing
      days: days.map((d) => (L.has(d) ? 'L' : O.has(d) ? 'O' : '')),
      learned_days: inWindow.length,
      current_streak: currentStreak(L, today),
      best_streak: bestStreak(days, L),
      today_done: L.has(today),
      last_learned_day: lastLearned,
    };
  });

  // Next-day return inside the window: every (student, day) where they
  // learned is one chance; it's a return if they learned the next day too.
  // Today has no "next day" yet, so it is never a chance.
  let chances = 0, returns = 0;
  const perDay = days.slice(0, -1).map((d, i) => {
    let active = 0, back = 0;
    for (const r of rows) {
      if (r.days[i] !== 'L') continue;
      active++;
      if (r.days[i + 1] === 'L') back++;
    }
    chances += active; returns += back;
    return { day: d, active, came_back: back };
  });

  const yesterday = perDay[perDay.length - 1] || { day: addDays(today, -1), active: 0, came_back: 0 };
  const activeStudents = rows.filter((r) => r.learned_days > 0).length;
  const openedOnly = rows.filter((r) => r.learned_days === 0 && r.days.includes('O')).length;

  return {
    today,
    days,
    window_days: windowDays,
    summary: {
      students: rows.length,
      learned_today: rows.filter((r) => r.today_done).length,
      yesterday_active: yesterday.active,
      yesterday_back_today: rows.filter((r) => r.days[days.length - 2] === 'L' && r.today_done).length,
      next_day_chances: chances,
      next_day_returns: returns,
      next_day_rate: chances ? Math.round((returns / chances) * 100) : null,
      active_students: activeStudents,
      opened_only_students: openedOnly,
      on_streak: rows.filter((r) => r.current_streak >= 2).length,
    },
    per_day: perDay,
    rows: rows.sort((a, b) =>
      b.current_streak - a.current_streak || b.learned_days - a.learned_days ||
      String(b.last_learned_day || '').localeCompare(String(a.last_learned_day || '')) || a.name.localeCompare(b.name)),
  };
}

export async function comebackReport(ctx: any) {
  const requested = Number(ctx.body?.days);
  const windowDays = WINDOWS.includes(requested) ? requested : 14;
  // Load from the start of the window's first Tashkent day.
  const firstDay = addDays(dayKey(ctx.now), -(windowDays - 1));
  const since = new Date(dayStartMs(firstDay)).toISOString();

  const [users, receipts, assessments, sessions] = await Promise.all([
    pageAll(ctx.svc.User),
    pageAll(ctx.svc.RoundReceipt, { status: 'done', round_at: { $gte: since } }),
    pageAll(ctx.svc.AssessmentResult, { created_date: { $gte: since } }),
    pageAll(ctx.svc.ActivitySession, { started_at: { $gte: since } }),
  ]);

  await ctx.audit({ action: 'comeback_view', details: `${windowDays}-day window` });
  return { ...computeComeback({ users, receipts, assessments, sessions, now: ctx.now, windowDays }), as_of: new Date(ctx.now).toISOString() };
}
