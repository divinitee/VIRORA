// Comeback core (Comeback Revamp Phase 1, Claude 2026-11-10). Plain JS so
// node/deno tests can import it.
//
// ONE day log for everything: the admin Comeback tracker (adminComeback.ts),
// the student streak and the daily missions all read learned days from here,
// so the numbers Tee sees and the numbers students see always agree.
//
// A "learned day" = a Tashkent calendar day (UTC+5) on which the student
// FINISHED something real:
//   - a completed round (RoundReceipt status=done), except mission claims, or
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

export const isMissionReceipt = (r) => r?.game === MISSION_GAME || String(r?.round_id || '').startsWith('mission:');

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

// Daily missions. Small on purpose: every one pushes into real learning
// (never "open the app"). Rewards are XP, paid once per mission per day by
// progressApi.claimMission. Tune targets/rewards here only.
export const MISSIONS = [
  { id: 'show_up', target: 1, reward: 50 },   // finish one round or lesson answer (keeps the streak)
  { id: 'correct_20', target: 20, reward: 50 }, // 20 correct answers in rounds today
  { id: 'score_80', target: 80, reward: 50 },   // one round at 80%+
];
export const MISSION_IDS = MISSIONS.map((m) => m.id);
export const missionRoundId = (day, id) => `mission:${day}:${id}`;

/**
 * Today's missions from today's rows.
 * todayEvidence: RoundReceipt kind=evidence status=done since today's start.
 * claimedIds: Set of mission ids already claimed today.
 */
export function missionsFor({ todayDone, todayEvidence = [], claimedIds = new Set() }) {
  const correct = todayEvidence.reduce((s, r) => s + (Number(r.items_credit) || 0), 0);
  const best = todayEvidence.reduce((m, r) => Math.max(m, r.items_total ? Math.round((100 * (Number(r.items_credit) || 0)) / r.items_total) : 0), 0);
  const value = { show_up: todayDone ? 1 : 0, correct_20: Math.floor(correct), score_80: best };
  return MISSIONS.map((m) => {
    const progress = Math.min(value[m.id] || 0, m.target);
    return { id: m.id, target: m.target, reward: m.reward, progress, done: progress >= m.target, claimed: claimedIds.has(m.id) };
  });
}

/** The whole student-facing state, from one learner's rows. Pure. */
export function comebackState({ receipts = [], assessments = [], now = Date.now() }) {
  const today = dayKey(now);
  const learned = learnedDays(receipts, assessments);
  const todayStart = dayStartMs(today);
  const todayEvidence = receipts.filter((r) => r.kind === 'evidence' && r.status === 'done' && !isMissionReceipt(r) && (ms(r.round_at) ?? 0) >= todayStart);
  const claimedIds = new Set(
    receipts
      .filter((r) => r.kind === 'reward' && isMissionReceipt(r) && String(r.round_id).startsWith(`mission:${today}:`))
      .map((r) => String(r.round_id).split(':')[2]),
  );
  const week = [];
  for (let i = 6; i >= 0; i--) { const d = addDays(today, -i); week.push({ day: d, learned: learned.has(d) }); }
  const todayDone = learned.has(today);
  return {
    today,
    streak: { current: currentStreak(learned, today), best: bestStreak(learned), today_done: todayDone },
    week,
    missions: missionsFor({ todayDone, todayEvidence, claimedIds }),
  };
}
