// Comeback core (Comeback Revamp Phase 1, Claude 2026-11-10). Plain JS so
// node/deno tests can import it.
//
// ONE day log for everything: the admin Comeback tracker (adminComeback.ts),
// the student streak, the daily missions, the streak bonuses and the reminder
// email all read learned days from here, so the numbers Tee sees and the
// numbers students see always agree.
//
// A "learned day" = a Tashkent calendar day (UTC+5) on which the student
// FINISHED something real:
//   - a completed round (RoundReceipt status=done), except reward claims, or
//   - a Learning Path lesson answer (AssessmentResult).
// Opening the app alone never counts.

export const DAY_MS = 24 * 60 * 60 * 1000;
export const TZ_OFFSET_MS = 5 * 60 * 60 * 1000; // Asia/Tashkent, no DST
export const MISSION_GAME = 'mission';

export const dayKey = (ms) => new Date(ms + TZ_OFFSET_MS).toISOString().slice(0, 10);
export const addDays = (key, n) => new Date(Date.parse(key + 'T00:00:00Z') + n * DAY_MS).toISOString().slice(0, 10);
export const dayStartMs = (key) => Date.parse(key + 'T00:00:00Z') - TZ_OFFSET_MS;

const ms = (v) => {
  const t = Date.parse(v || '');
  return Number.isFinite(t) && t > 0 ? t : null;
};

// Mission and streak-bonus claims are rewards, not learning.
export const isMissionReceipt = (r) => {
  const id = String(r?.round_id || '');
  return r?.game === MISSION_GAME || id.startsWith('mission:') || id.startsWith('streak:');
};

/** Set of learned day keys from one learner's (or anyone's) rows. */
export function learnedDays(receipts = [], assessments = []) {
  const days = new Set();
  for (const r of receipts) {
    if (r?.status && r.status !== 'done') continue;
    if (isMissionReceipt(r)) continue;
    const t = ms(r.round_at) ?? ms(r.created_date);
    if (t) days.add(dayKey(t));
  }
  for (const a of assessments) {
    const t = ms(a.created_date);
    if (t) days.add(dayKey(t));
  }
  return days;
}

// Consecutive learned days ending today. A streak isn't broken until today is
// over, so if today isn't done yet it counts back from yesterday.
export function currentStreak(learned, today) {
  let d = learned.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (learned.has(d)) { n++; d = addDays(d, -1); }
  return n;
}

export function bestStreak(learned) {
  const days = [...learned].sort();
  let best = 0, run = 0, prev = null;
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    if (run > best) best = run;
    prev = d;
  }
  return best;
}

// ---- Daily missions --------------------------------------------------------
// Calibrated on real data (Nov 2026): the students who drop off score 3-5 out
// of 12, so a "score 80%" or "20 correct" mission is out of reach for exactly
// the people this is for. Missions therefore reward EFFORT first:
//   show_up     finish one practice            (keeps the streak)
//   answer_20   answer 20 questions, right or wrong
//   correct_15  get 15 right                   (the stretch)
// 10 XP = one correct answer in a game, so 50 XP is a weak student's whole round.
export const MISSIONS = [
  { id: 'show_up', target: 1, reward: 50 },
  { id: 'answer_20', target: 20, reward: 50 },
  { id: 'correct_15', target: 15, reward: 100 },
];
export const missionRoundId = (day, id) => `mission:${day}:${id}`;

export function missionsFor({ today, todayDone, todayEvidence = [], claimedRounds = new Set() }) {
  const answered = todayEvidence.reduce((s, r) => s + (Number(r.items_total) || 0), 0);
  const correct = todayEvidence.reduce((s, r) => s + (Number(r.items_credit) || 0), 0);
  const value = { show_up: todayDone ? 1 : 0, answer_20: Math.floor(answered), correct_15: Math.floor(correct) };
  return MISSIONS.map((m) => {
    const progress = Math.min(value[m.id] || 0, m.target);
    return { id: m.id, target: m.target, reward: m.reward, progress, done: progress >= m.target, claimed: claimedRounds.has(missionRoundId(today, m.id)) };
  });
}

// ---- Streak bonuses --------------------------------------------------------
// The day-2 bonus is the point of the whole revamp: a concrete reason to open
// the app TOMORROW, shown the moment today's practice ends. Paid once per
// streak run, so a student who breaks a streak can earn the comeback bonus
// again by coming back two days in a row.
export const STREAK_BONUSES = [
  { day: 2, reward: 100 },
  { day: 3, reward: 100 },
  { day: 5, reward: 150 },
  { day: 7, reward: 300 },
  { day: 14, reward: 500 },
  { day: 30, reward: 1000 },
];
export const bonusId = (day) => `streak_${day}`;
export const bonusRoundId = (runStart, day) => `streak:${runStart}:${day}`;

export function bonusesFor({ current, runStart, claimedRounds = new Set() }) {
  if (!current || !runStart) return [];
  return STREAK_BONUSES.filter((b) => b.day <= current).map((b) => ({
    id: bonusId(b.day), day: b.day, reward: b.reward, done: true, claimed: claimedRounds.has(bonusRoundId(runStart, b.day)),
  }));
}

/** The whole student-facing state, from one learner's rows. Pure. */
export function comebackState({ receipts = [], assessments = [], now = Date.now() }) {
  const today = dayKey(now);
  const learned = learnedDays(receipts, assessments);
  const todayStart = dayStartMs(today);
  const todayEvidence = receipts.filter((r) => r.kind === 'evidence' && r.status === 'done' && !isMissionReceipt(r) && (ms(r.round_at) ?? 0) >= todayStart);
  const claimedRounds = new Set(receipts.filter((r) => r.kind === 'reward' && isMissionReceipt(r)).map((r) => String(r.round_id)));
  const week = [];
  for (let i = 6; i >= 0; i--) { const d = addDays(today, -i); week.push({ day: d, learned: learned.has(d) }); }
  const todayDone = learned.has(today);
  const current = currentStreak(learned, today);
  const lastDay = todayDone ? today : addDays(today, -1);
  const runStart = current ? addDays(lastDay, -(current - 1)) : null;
  const nextBonus = STREAK_BONUSES.find((b) => b.day > current) || null;
  return {
    today,
    streak: { current, best: bestStreak(learned), today_done: todayDone, run_start: runStart },
    week,
    missions: missionsFor({ today, todayDone, todayEvidence, claimedRounds }),
    // Only unclaimed bonuses are shown; a claimed one has done its job.
    bonuses: bonusesFor({ current, runStart, claimedRounds }).filter((b) => !b.claimed),
    // What the next practice day earns. days_left counts learning days still
    // needed: 1 = "today" if today isn't done yet, otherwise "tomorrow".
    next_bonus: nextBonus ? { day: nextBonus.day, reward: nextBonus.reward, days_left: nextBonus.day - current } : null,
  };
}

/** Resolve a claim id against a state: { reward, round_id, done, claimed } or null. */
export function claimTarget(state, id) {
  const m = state.missions.find((x) => x.id === id);
  if (m) return { reward: m.reward, round_id: missionRoundId(state.today, m.id), done: m.done, claimed: m.claimed };
  const b = STREAK_BONUSES.find((x) => bonusId(x.day) === id);
  if (!b) return null;
  const reached = !!state.streak.run_start && state.streak.current >= b.day;
  const open = state.bonuses.some((x) => x.id === id);
  return { reward: b.reward, round_id: reached ? bonusRoundId(state.streak.run_start, b.day) : null, done: reached, claimed: reached && !open };
}

// ---- Reminder email --------------------------------------------------------
// Who gets a nudge today, and which one. Nobody is nagged daily:
//   at_risk   learned yesterday, not yet today  -> "keep your N-day streak"
//   lapsed    last learned exactly 2 or 6 days ago -> one "come back" each
//   null      learned today, never learned, or lapsed on any other day
export function reminderFor(learned, now = Date.now()) {
  const today = dayKey(now);
  if (learned.has(today)) return null;
  const streak = currentStreak(learned, today);
  if (streak > 0) {
    const next = STREAK_BONUSES.find((b) => b.day === streak + 1);
    return { kind: 'at_risk', streak, bonus: next ? next.reward : 0 };
  }
  const last = [...learned].sort().pop();
  if (!last) return null;
  const gap = Math.round((Date.parse(today + 'T00:00:00Z') - Date.parse(last + 'T00:00:00Z')) / DAY_MS);
  return gap === 2 || gap === 6 ? { kind: 'lapsed', gap } : null;
}
