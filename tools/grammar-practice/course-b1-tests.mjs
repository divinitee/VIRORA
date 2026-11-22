// Gate for src/lib/grammarCourseB1.js (the B1 part of the learner path, 21 Nov 2026).
// Like course-tests.mjs for the Foundational course: every B1 topic in the
// worklist sits in exactly one B1 unit, and nothing else does.
//   node tools/grammar-practice/course-b1-tests.mjs
import fs from "fs";
import { UNITS_B1, TOPIC_LABELS_B1, COURSE_B1_TOPIC_KEYS } from "../../src/lib/grammarCourseB1.js";
import { UNITS, PATH_UNITS, COURSE_TOPIC_KEYS, topicLabel, unitForTopic, unitById } from "../../src/lib/grammarCourse.js";

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${extra && !cond ? " -> " + extra : ""}`);
};

const worklist = fs.readFileSync(new URL("../../grammar-run/WORKLIST.tsv", import.meta.url), "utf8")
  .trim().split("\n").slice(1).map((l) => l.split("\t"));
const b1 = new Set(worklist.filter((r) => r[3] === "B1").map((r) => r[2]));

console.log("=== structure ===");
ok("11 B1 units", UNITS_B1.length === 11, String(UNITS_B1.length));
ok("unit ids unique across the whole path", new Set(PATH_UNITS.map((u) => u.id)).size === PATH_UNITS.length);
ok("every B1 unit is marked level B1", UNITS_B1.every((u) => u.level === "B1"));
ok("every unit has en/uz/ru name and can-do", UNITS_B1.every((u) => ["en", "uz", "ru"].every((l) => u.name?.[l] && u.canDo?.[l])));
ok("every unit has 4–12 topics", UNITS_B1.every((u) => u.topics.length >= 4 && u.topics.length <= 12),
  UNITS_B1.map((u) => `${u.id}:${u.topics.length}`).join(" "));
ok("no optional previews in B1", UNITS_B1.every((u) => u.topics.every((t) => !t.optional)));

console.log("=== coverage ===");
const dupes = COURSE_B1_TOPIC_KEYS.filter((k, i) => COURSE_B1_TOPIC_KEYS.indexOf(k) !== i);
ok("no topic appears twice", dupes.length === 0, dupes.join(", "));
const missing = [...b1].filter((k) => !COURSE_B1_TOPIC_KEYS.includes(k));
ok("every B1 worklist topic is in a unit", missing.length === 0, missing.join(", "));
const extra = COURSE_B1_TOPIC_KEYS.filter((k) => !b1.has(k));
ok("no non-B1 or unknown key in the B1 course", extra.length === 0, extra.join(", "));
ok("no overlap with the Foundational course", COURSE_B1_TOPIC_KEYS.every((k) => !COURSE_TOPIC_KEYS.includes(k)));
const banks = new Set(fs.readdirSync(new URL("../../src/lib/grammarPractice/bank/", import.meta.url)).map((f) => f.replace(/\.js$/, "")));
const noBank = COURSE_B1_TOPIC_KEYS.filter((k) => !banks.has(k));
ok("every B1 course topic has a practice bank", noBank.length === 0, noBank.join(", "));

console.log("=== path order ===");
ok("the path is Foundational units, then B1 units", JSON.stringify(PATH_UNITS.map((u) => u.id)) === JSON.stringify([...UNITS, ...UNITS_B1].map((u) => u.id)));

console.log("=== labels ===");
const unlabelled = COURSE_B1_TOPIC_KEYS.filter((k) => !["en", "uz", "ru"].every((l) => TOPIC_LABELS_B1[k]?.[l]));
ok("every topic has en/uz/ru labels", unlabelled.length === 0, unlabelled.join(", "));
ok("topicLabel finds B1 labels", topicLabel("prep-phrasal.time.by-until", "uz") === TOPIC_LABELS_B1["prep-phrasal.time.by-until"].uz);
ok("unitForTopic resolves a B1 topic", unitForTopic("reported-speech.statements.say-tell") === "b1-reported");
ok("unitById resolves a B1 unit", unitById("b1-passive")?.level === "B1");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
