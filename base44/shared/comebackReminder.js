// Streak-aware reminder emails (Comeback Revamp Phase 1, Claude 2026-11-10).
// Pure: decides WHO gets WHICH email. sendDailyReminder does the sending.
//
// Replaces the old "email every registered user the same text every morning"
// (which also went to teachers and admins and was signed "Vocabulary Master").
// Rules (comebackCore.reminderFor):
//   - learned today            -> nothing (never nag someone who showed up)
//   - learned yesterday        -> "keep your N-day streak" (+ the bonus today earns)
//   - last learned 2 or 6 days ago -> one "start a new streak" each
//   - never learned, or lapsed on other days -> nothing
// Students only. uz copy is a first draft: needs a native check.

import { learnedDays, reminderFor, isMissionReceipt, STREAK_BONUSES, dayKey, currentStreak, DAY_MS } from './comebackCore.js';

const SITE = 'https://virora.space';
const norm = (e) => String(e || '').trim().toLowerCase();
const isStudent = (u) => (u.role || 'user') !== 'admin' && u.teacher_status !== 'approved' && u.teacher_status !== 'pending';

function firstName(u) {
  const n = String(u.display_name || u.full_name || '').trim();
  // Base44 fills full_name from the email when no name was collected.
  if (!n || n.includes('@') || n.toLowerCase() === norm(u.email).split('@')[0]) return '';
  return n.split(/\s+/)[0];
}

// Admin "Nudge" (console bulk action): like the daily rules, but for any
// gap, and it also covers students who signed up and never practised.
// null = they already practised today (nothing to nudge).
export function nudgeFor(learned, now = Date.now()) {
  const today = dayKey(now);
  if (learned.has(today)) return null;
  const r = reminderFor(learned, now);
  if (r?.kind === 'at_risk') return r;
  const last = [...learned].sort().pop();
  if (!last) return { kind: 'start' };
  const gap = Math.round((Date.parse(today + 'T00:00:00Z') - Date.parse(last + 'T00:00:00Z')) / DAY_MS);
  return { kind: 'lapsed', gap, streak: currentStreak(learned, today) };
}

export function reminderEmail(u, r) {
  const hi = firstName(u) ? `Salom, ${firstName(u)}!` : 'Salom!';
  if (r.kind === 'start') {
    return {
      subject: "VIRORA'dagi birinchi mashg'ulotingiz sizni kutmoqda",
      body: `${hi}\n\nSiz VIRORA'da ro'yxatdan o'tdingiz, lekin hali birinchi mashg'ulotni boshlamadingiz. Bitta savolga javob bering va 10 daqiqalik birinchi mashqingiz tayyor.\n\nBoshlash: ${SITE}\n\nVIRORA`,
    };
  }
  if (r.kind === 'at_risk') {
    return {
      subject: `🔥 ${r.streak} kunlik streakingizni bugun saqlab qoling`,
      body: `${hi}\n\nSizda ${r.streak} kunlik streak bor. Uni saqlash uchun bugun bitta qisqa mashq yetarli (5-10 daqiqa).${r.bonus ? `\n\nBugun mashq qilsangiz: ${r.streak + 1} kunlik streak uchun +${r.bonus} XP bonus.` : ''}\n\nBoshlash: ${SITE}\n\nVIRORA`,
    };
  }
  const day2 = STREAK_BONUSES.find((b) => b.day === 2);
  return {
    subject: "VIRORA'da yangi streak sizni kutmoqda",
    body: `${hi}\n\nOxirgi mashqingizdan beri ${r.gap} kun o'tdi. Bugun bitta qisqa mashq bilan yangi streak boshlang.${day2 ? ` Ikki kun ketma-ket mashq qilsangiz, +${day2.reward} XP bonus olasiz.` : ''}\n\nBoshlash: ${SITE}\n\nVIRORA`,
  };
}

/** [{ email, kind, subject, body }] for everyone who should be emailed now. */
export function buildReminders({ users = [], receipts = [], assessments = [], now = Date.now() }) {
  const byEmail = new Map();
  const push = (email, kind, row) => {
    const e = norm(email);
    if (!e) return;
    if (!byEmail.has(e)) byEmail.set(e, { receipts: [], assessments: [] });
    byEmail.get(e)[kind].push(row);
  };
  for (const r of receipts) if (!isMissionReceipt(r)) push(r.user_email, 'receipts', r);
  for (const a of assessments) push(a.user_email, 'assessments', a);

  const out = [];
  for (const u of users) {
    if (!u?.email || !isStudent(u) || u.notifications_enabled === false) continue;
    const rows = byEmail.get(norm(u.email));
    if (!rows) continue; // never learned: the class relaunch reaches them, not email
    const r = reminderFor(learnedDays(rows.receipts, rows.assessments), now);
    if (!r) continue;
    out.push({ email: u.email, kind: r.kind, ...reminderEmail(u, r) });
  }
  return out;
}
