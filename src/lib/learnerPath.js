// The ONE learner path (Tee's whiteboard, 14 Nov 2026).
//
// Before this, the app had two paths with two "Continue" buttons: the Lesson
// Path (Lesson Runner, one lesson so far) and the Grammar Path (13 units).
// Now there is one ordered list of STOPS and one "next stop", and every
// Continue button in the app reads it from here:
//
//   Home  ->  Continue  =  next stop on the path
//   stop done  ->  continue the path, suggested practice (the Coach), or free roam
//
// Two kinds of stop:
//   lesson   a Lesson Runner lesson. It TEACHES (in the student's language).
//   grammar  a grammar practice topic. It DRILLS what was taught.
// A lesson names the grammar topics it teaches (LESSON_STOPS[].grammar); when the
// lesson is done the app sends the student to practise exactly those ("once done
// -> grammar" on the whiteboard). The grammar stops follow the Foundational
// course order (src/lib/grammarCourse.js), which is unchanged.
//
// Display + navigation only. Nothing here is stored: the state is derived from
// the student's own GrammarAttempt rows and StudentProgress row. It does not
// replace "Secure" (grammarPathState.js), which stays the mastery badge.
//
// Pure: no React, no API client, relative imports only, so node can test it
// (tools/grammar-practice/path-tests.mjs).

import { UNITS, topicLabel, unitById } from "./grammarCourse.js";
import { FREE_LESSON_ID } from "./freeLesson.js";

// A grammar stop is PASSED when one round has at least 8 graded answers and at
// least 80% of them right ("score 8/10 to move on"). Deliberately lighter than
// Secure (20 answers, 85%, two separate days): Secure says "you own this",
// passed only says "the path can move on". A student is never stuck for a day.
export const PASS_MIN_ITEMS = 8;
export const PASS_MIN_ACCURACY = 0.8;

// Lessons on the path, in order. `grammar` = the topics the lesson teaches.
// When Lesson 2+ exist, add them here (and give them `beforeTopic` if they
// should sit inside a unit; today's single lesson opens the path).
export const LESSON_STOPS = [
  {
    lessonId: FREE_LESSON_ID,
    title: { en: "Talking About Your Day", uz: "Kuningiz haqida gapirish", ru: "Рассказываем о своём дне" },
    grammar: ["tenses.present.simple-routine", "tenses.present.third-person-s", "tenses.present.simple-vs-continuous"],
  },
];

/** GrammarAttempt rows -> Set of topic keys with at least one passing round. */
export function passedTopics(attempts = []) {
  const rounds = new Map();
  for (const a of attempts) {
    const key = a?.grammar_topic;
    if (!key) continue;
    const id = `${key}::${a.round_id || a.round_at || a.created_date || "?"}`;
    let r = rounds.get(id);
    if (!r) { r = { key, n: 0, ok: 0 }; rounds.set(id, r); }
    r.n += 1;
    if (a.correct) r.ok += 1;
  }
  const out = new Set();
  for (const r of rounds.values()) {
    if (r.n >= PASS_MIN_ITEMS && r.ok / r.n >= PASS_MIN_ACCURACY) out.add(r.key);
  }
  return out;
}

/** StudentProgress rows -> how many lessons this student has completed. */
export const lessonsCompleted = (progressRows = []) =>
  progressRows.reduce((m, r) => Math.max(m, Number(r?.lessons_completed_count) || 0), 0);

/**
 * The whole path, in order, with each stop's state.
 *   available     Set of topic keys that have a practice bank
 *   passed        Set from passedTopics()
 *   lessonsDone   number from lessonsCompleted()
 * A stop COUNTS (can be "next", is in the totals) when a student can actually do
 * it: every lesson, and every grammar topic that has a bank and is not an
 * optional preview. Topics still being written are listed but never block.
 */
export function buildPath({ available = new Set(), passed = new Set(), lessonsDone = 0 } = {}) {
  const stops = [];
  LESSON_STOPS.forEach((l, i) => {
    stops.push({ id: `lesson:${l.lessonId}`, kind: "lesson", lessonId: l.lessonId, unitId: null, counts: true, done: lessonsDone > i });
  });
  for (const u of UNITS) {
    for (const t of u.topics) {
      const playable = available.has(t.key);
      stops.push({
        id: `grammar:${t.key}`, kind: "grammar", key: t.key, unitId: u.id,
        playable, optional: !!t.optional, counts: playable && !t.optional, done: passed.has(t.key),
      });
    }
  }
  return stops;
}

/** { stops, next, total, done, unit } — `next` is null when the path is finished. */
export function pathState(input = {}) {
  const stops = buildPath(input);
  const counted = stops.filter((s) => s.counts);
  const next = counted.find((s) => !s.done) || null;
  let unit = null;
  if (next?.unitId) {
    const inUnit = counted.filter((s) => s.unitId === next.unitId);
    unit = {
      id: next.unitId,
      index: UNITS.findIndex((u) => u.id === next.unitId),
      total: inUnit.length,
      done: inUnit.filter((s) => s.done).length,
    };
  }
  return { stops, next, total: counted.length, done: counted.filter((s) => s.done).length, unit };
}

/** The stop after `stopId`, among stops a student can do and hasn't finished. */
export function stopAfter(state, stopId) {
  const counted = state.stops.filter((s) => s.counts);
  const i = counted.findIndex((s) => s.id === stopId);
  return counted.slice(i + 1).find((s) => !s.done) || null;
}

/** Where a stop opens. Grammar stops start a Choose round straight away. */
export function stopHref(stop) {
  if (!stop) return "/";
  if (stop.kind === "lesson") return `/lesson/${stop.lessonId}`;
  return `/grammar?topic=${encodeURIComponent(stop.key)}&stage=choose`;
}

export function stopLabel(stop, lang = "en") {
  if (!stop) return "";
  if (stop.kind === "lesson") {
    const l = LESSON_STOPS.find((x) => x.lessonId === stop.lessonId);
    return l?.title?.[lang] || l?.title?.en || "";
  }
  return topicLabel(stop.key, lang);
}

export function unitName(unitId, lang = "en") {
  const u = unitById(unitId);
  return u ? (u.name[lang] || u.name.en) : "";
}

/**
 * "Once done -> grammar": the topic to practise right after a lesson. The first
 * of the lesson's topics that has a bank and isn't passed yet (or the first
 * with a bank, so a returning student can still review). null if none exist.
 */
export function grammarAfterLesson(lessonId, { available = new Set(), passed = new Set() } = {}) {
  const l = LESSON_STOPS.find((x) => x.lessonId === lessonId);
  if (!l) return null;
  const ready = l.grammar.filter((k) => available.has(k));
  return ready.find((k) => !passed.has(k)) || ready[0] || null;
}

// uz / ru are first drafts: need a native check.
export const PATH_COPY = {
  en: {
    cont: "Continue",
    contTo: (name) => `Continue: ${name}`,
    hint: "The next step on your path",
    yourPath: "Your path",
    lesson: "Lesson",
    practice: "Grammar practice",
    unit: (n) => `Unit ${n}`,
    stops: (a, b) => `${a} of ${b} steps done`,
    seeAll: "See the whole path",
    suggested: "Today's practice",
    suggestedSub: (coach) => `Picked by ${coach}`,
    free: "Free roam",
    freeSub: "Any game or topic",
    or: "Or choose:",
    passed: "Step done! The path moves on.",
    notYet: "Score 8 out of 10 to finish this step.",
    next: "Next step",
    lessonDoneCta: "Practise this grammar",
    backHome: "Back to home",
    allDone: "You've finished every step that's ready. New ones are on the way.",
    freeMapNeedsTest: "The free map needs a short level test first.",
    takeTest: "Take the test",
  },
  uz: {
    cont: "Davom etish",
    contTo: (name) => `Davom etish: ${name}`,
    hint: "Yo'lingizdagi keyingi qadam",
    yourPath: "Sizning yo'lingiz",
    lesson: "Dars",
    practice: "Grammatika mashqi",
    unit: (n) => `${n}-bo'lim`,
    stops: (a, b) => `${b} ta qadamdan ${a} tasi bajarildi`,
    seeAll: "Butun yo'lni ko'rish",
    suggested: "Bugungi mashg'ulot",
    suggestedSub: (coach) => `${coach} tanladi`,
    free: "Erkin mashq",
    freeSub: "Istalgan o'yin yoki mavzu",
    or: "Yoki tanlang:",
    passed: "Qadam bajarildi! Yo'l davom etadi.",
    notYet: "Bu qadamni tugatish uchun 10 tadan 8 ta to'g'ri javob bering.",
    next: "Keyingi qadam",
    lessonDoneCta: "Shu grammatikani mashq qilish",
    backHome: "Bosh sahifaga",
    allDone: "Tayyor bo'lgan barcha qadamlarni tugatdingiz. Yangilari tez orada.",
    freeMapNeedsTest: "Erkin xarita uchun avval qisqa daraja testi kerak.",
    takeTest: "Testni topshirish",
  },
  ru: {
    cont: "Продолжить",
    contTo: (name) => `Продолжить: ${name}`,
    hint: "Следующий шаг на вашем пути",
    yourPath: "Ваш путь",
    lesson: "Урок",
    practice: "Практика грамматики",
    unit: (n) => `Раздел ${n}`,
    stops: (a, b) => `Пройдено шагов: ${a} из ${b}`,
    seeAll: "Посмотреть весь путь",
    suggested: "Практика на сегодня",
    suggestedSub: (coach) => `Подобрала ${coach}`,
    free: "Свободная практика",
    freeSub: "Любая игра или тема",
    or: "Или выберите:",
    passed: "Шаг пройден! Путь продолжается.",
    notYet: "Чтобы пройти этот шаг, ответьте правильно на 8 из 10.",
    next: "Следующий шаг",
    lessonDoneCta: "Потренировать эту грамматику",
    backHome: "На главную",
    allDone: "Вы прошли все готовые шаги. Новые скоро появятся.",
    freeMapNeedsTest: "Для свободной карты сначала нужен короткий тест уровня.",
    takeTest: "Пройти тест",
  },
};
export const pathCopy = (lang) => PATH_COPY[lang] || PATH_COPY.en;
