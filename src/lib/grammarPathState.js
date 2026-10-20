// Path state for the Foundational course (src/lib/grammarCourse.js).
//
// DISPLAY ONLY. Statuses are derived on the fly from the student's own
// GrammarAttempt rows (server-graded evidence, readable by the student under
// RLS). Nothing here is persisted and nothing here is "mastery" — when
// server-side topic mastery lands, swap topicStatuses() for its output and the
// UI keeps working. Thresholds are provisional (GPT/Claude audit, Oct 2026):
// one placement item or one good round never makes a topic Secure.
import { UNITS } from "@/lib/grammarCourse";

export const STATUS = { NEW: "new", PRACTISING: "practising", REVIEW: "review", SECURE: "secure" };

const DAY = 86400000;
const SECURE_MIN_ITEMS = 20;
const SECURE_MIN_ACCURACY = 0.85;
const SECURE_MIN_DAYS = 2;   // two separate days, so one lucky sitting isn't "secure"
const STALE_AFTER = 7 * DAY;  // untouched for a week -> due for review

/** attempts: [{ grammar_topic, correct, round_at|created_date }] -> { [topicKey]: status } */
export function topicStatuses(attempts = [], now = Date.now()) {
  const by = {};
  for (const a of attempts) {
    const key = a?.grammar_topic;
    if (!key) continue;
    const t = (by[key] ??= { n: 0, ok: 0, days: new Set(), last: 0 });
    t.n += 1;
    if (a.correct) t.ok += 1;
    const ts = Date.parse(a.round_at || a.created_date || "") || 0;
    if (ts) { t.last = Math.max(t.last, ts); t.days.add(new Date(ts).toISOString().slice(0, 10)); }
  }
  const out = {};
  for (const [key, t] of Object.entries(by)) {
    const secure = t.n >= SECURE_MIN_ITEMS && t.ok / t.n >= SECURE_MIN_ACCURACY && t.days.size >= SECURE_MIN_DAYS;
    const stale = t.last > 0 && now - t.last > STALE_AFTER;
    out[key] = stale ? STATUS.REVIEW : secure ? STATUS.SECURE : STATUS.PRACTISING;
  }
  return out;
}

const statusOf = (statuses, key) => statuses[key] || STATUS.NEW;

/**
 * The recommended next topic: the first non-optional topic, in course order,
 * that has practice content and isn't Secure. Soft recommendation only —
 * nothing is locked.
 */
export function nextTopic(statuses, available) {
  for (const u of UNITS) {
    for (const t of u.topics) {
      if (t.optional || !available.has(t.key)) continue;
      if (statusOf(statuses, t.key) !== STATUS.SECURE) return { unitId: u.id, key: t.key };
    }
  }
  return null;
}

/** Per-unit progress over the topics that count (optional previews excluded). */
export function unitProgress(unit, statuses, available) {
  const counted = unit.topics.filter((t) => !t.optional);
  return {
    total: counted.length,
    secure: counted.filter((t) => statusOf(statuses, t.key) === STATUS.SECURE).length,
    started: counted.filter((t) => statusOf(statuses, t.key) !== STATUS.NEW).length,
    playable: unit.topics.filter((t) => available.has(t.key)).length,
  };
}

export const reviewKeys = (statuses) =>
  Object.entries(statuses).filter(([, s]) => s === STATUS.REVIEW).map(([k]) => k);

export { statusOf };
