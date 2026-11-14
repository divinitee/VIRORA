// Tests for src/lib/learnerPath.js (the one learner path, 14 Nov 2026).
//   node tools/grammar-practice/path-tests.mjs
import {
  LESSON_STOPS, PATH_COPY, PASS_MIN_ITEMS, passedTopics, lessonsCompleted, buildPath, pathState,
  stopAfter, stopHref, stopLabel, grammarAfterLesson,
} from "../../src/lib/learnerPath.js";
import { UNITS, COURSE_TOPIC_KEYS } from "../../src/lib/grammarCourse.js";

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${extra && !cond ? " -> " + extra : ""}`);
};

// n answers in one round, `right` of them correct
const round = (topic, id, n, right) =>
  Array.from({ length: n }, (_, i) => ({ grammar_topic: topic, round_id: id, correct: i < right }));

const A = "sentence-structure.predication.be-am-is-are";
const B = "sentence-structure.predication.be-question";
const C = "nouns-articles.articles.a-an";
const LESSON = LESSON_STOPS[0];

console.log("=== pass rule ===");
ok("8/10 in one round passes", passedTopics(round(A, "r1", 10, 8)).has(A));
ok("7/10 does not pass", !passedTopics(round(A, "r1", 10, 7)).has(A));
ok("a short round never passes (5/5)", !passedTopics(round(A, "r1", PASS_MIN_ITEMS - 3, PASS_MIN_ITEMS - 3)).has(A));
ok("two weak rounds don't add up to a pass (5/10 + 5/10)",
  !passedTopics([...round(A, "r1", 10, 5), ...round(A, "r2", 10, 5)]).has(A));
ok("one good round after a bad one passes (4/10 then 9/10)",
  passedTopics([...round(A, "r1", 10, 4), ...round(A, "r2", 10, 9)]).has(A));
ok("a pass is per topic", (() => { const p = passedTopics([...round(A, "r1", 10, 10), ...round(B, "r2", 10, 3)]); return p.has(A) && !p.has(B); })());
ok("rows without a topic are ignored", passedTopics([{ correct: true }, null, undefined].filter(Boolean)).size === 0);
ok("lessonsCompleted reads the highest count", lessonsCompleted([{ lessons_completed_count: 0 }, { lessons_completed_count: 2 }]) === 2);
ok("lessonsCompleted of nothing is 0", lessonsCompleted([]) === 0 && lessonsCompleted() === 0);

console.log("=== path shape ===");
const available = new Set([A, B, C, "tenses.present.simple-routine", "tenses.present.third-person-s"]);
const fresh = pathState({ available, passed: new Set(), lessonsDone: 0 });
ok("the path opens with the lesson", fresh.stops[0].kind === "lesson" && fresh.stops[0].lessonId === LESSON.lessonId);
ok("every course topic is on the path exactly once",
  COURSE_TOPIC_KEYS.every((k) => fresh.stops.filter((s) => s.key === k).length === 1));
ok("grammar stops keep the course order",
  JSON.stringify(fresh.stops.filter((s) => s.kind === "grammar").map((s) => s.key)) === JSON.stringify(COURSE_TOPIC_KEYS));
ok("totals count the lesson + topics that have a bank", fresh.total === 1 + available.size, String(fresh.total));
ok("a topic with no bank never counts", fresh.stops.filter((s) => s.kind === "grammar" && !s.playable).every((s) => !s.counts));
const optionalKey = UNITS.flatMap((u) => u.topics).find((t) => t.optional)?.key;
ok("an optional preview never counts, even with a bank",
  !!optionalKey && !buildPath({ available: new Set([optionalKey]) }).find((s) => s.key === optionalKey).counts);

console.log("=== next stop ===");
ok("a new student's next stop is the lesson", fresh.next?.kind === "lesson");
const afterLesson = pathState({ available, passed: new Set(), lessonsDone: 1 });
ok("after the lesson, next is the first topic with a bank, in course order", afterLesson.next?.key === A, afterLesson.next?.key);
ok("the unit block describes that topic's unit", afterLesson.unit?.id === "meet-describe" && afterLesson.unit.index === 0 && afterLesson.unit.done === 0);
const oneDone = pathState({ available, passed: new Set([A]), lessonsDone: 1 });
ok("passing a stop moves next forward", oneDone.next?.key === B && oneDone.done === 2);
ok("topics with no bank are skipped, not blocking",
  pathState({ available: new Set([C]), passed: new Set(), lessonsDone: 1 }).next?.key === C);
const skipAhead = pathState({ available, passed: new Set([B]), lessonsDone: 1 });
ok("a topic passed out of order is not asked again", skipAhead.next?.key === A && stopAfter(skipAhead, `grammar:${A}`)?.key === C);
const all = pathState({ available, passed: new Set(available), lessonsDone: 1 });
ok("next is null when everything ready is done", all.next === null && all.done === all.total);
ok("stopAfter the last stop is null", stopAfter(all, all.stops.filter((s) => s.counts).at(-1).id) === null);

console.log("=== links and labels ===");
ok("a lesson stop opens the Lesson Runner", stopHref(fresh.next) === `/lesson/${LESSON.lessonId}`);
ok("a grammar stop opens a Choose round", stopHref(afterLesson.next) === `/grammar?topic=${A}&stage=choose`);
ok("no stop -> home", stopHref(null) === "/");
ok("labels exist in en/uz/ru for both kinds",
  ["en", "uz", "ru"].every((l) => stopLabel(fresh.next, l) && stopLabel(afterLesson.next, l)));
ok("unknown language falls back to English", stopLabel(fresh.next, "xx") === LESSON.title.en);

console.log("=== lesson -> grammar ===");
ok("every lesson's grammar topics are course topics", LESSON_STOPS.every((l) => l.grammar.every((k) => COURSE_TOPIC_KEYS.includes(k))));
ok("after the lesson: its first topic that has a bank", grammarAfterLesson(LESSON.lessonId, { available, passed: new Set() }) === LESSON.grammar[0]);
ok("after the lesson: skips a topic already passed",
  grammarAfterLesson(LESSON.lessonId, { available, passed: new Set([LESSON.grammar[0]]) }) === LESSON.grammar[1]);
ok("after the lesson: all passed -> still offers the first for review",
  grammarAfterLesson(LESSON.lessonId, { available, passed: new Set(LESSON.grammar) }) === LESSON.grammar[0]);
ok("after the lesson: none written -> null", grammarAfterLesson(LESSON.lessonId, { available: new Set() }) === null);
ok("unknown lesson -> null", grammarAfterLesson("nope", { available }) === null);

console.log("=== copy ===");
const keys = Object.keys(PATH_COPY.en);
ok("uz and ru have every string en has",
  ["uz", "ru"].every((l) => keys.every((k) => typeof PATH_COPY[l][k] === typeof PATH_COPY.en[k])),
  keys.filter((k) => typeof PATH_COPY.uz[k] !== typeof PATH_COPY.en[k] || typeof PATH_COPY.ru[k] !== typeof PATH_COPY.en[k]).join(", "));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
