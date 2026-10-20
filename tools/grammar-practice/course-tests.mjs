// Gate for src/lib/grammarCourse.js (the Foundational Path).
// The course is a navigation view over immutable topic keys, so the one thing
// that must never drift is coverage: every A1–A2 topic in the worklist sits in
// exactly one unit, and nothing else does.
//   node tools/grammar-practice/course-tests.mjs
import fs from "fs";
import { UNITS, TOPIC_LABELS, COURSE_TOPIC_KEYS, topicLabel, unitForTopic } from "../../src/lib/grammarCourse.js";

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name}${extra && !cond ? " -> " + extra : ""}`);
};

const worklist = fs.readFileSync(new URL("../../grammar-run/WORKLIST.tsv", import.meta.url), "utf8")
  .trim().split("\n").slice(1).map((l) => l.split("\t"));
const foundational = new Set(worklist.filter((r) => r[3] === "A1" || r[3] === "A2").map((r) => r[2]));

console.log("=== structure ===");
ok("13 units", UNITS.length === 13, String(UNITS.length));
ok("unit ids unique", new Set(UNITS.map((u) => u.id)).size === UNITS.length);
ok("every unit has en/uz/ru name and can-do",
  UNITS.every((u) => ["en", "uz", "ru"].every((l) => u.name?.[l] && u.canDo?.[l])));
ok("every unit has 4–12 topics", UNITS.every((u) => u.topics.length >= 4 && u.topics.length <= 12),
  UNITS.map((u) => `${u.id}:${u.topics.length}`).join(" "));

console.log("=== coverage ===");
const dupes = COURSE_TOPIC_KEYS.filter((k, i) => COURSE_TOPIC_KEYS.indexOf(k) !== i);
ok("no topic appears twice", dupes.length === 0, dupes.join(", "));
const missing = [...foundational].filter((k) => !COURSE_TOPIC_KEYS.includes(k));
ok("every A1–A2 worklist topic is in a unit", missing.length === 0, missing.join(", "));
const extra = COURSE_TOPIC_KEYS.filter((k) => !foundational.has(k));
ok("no non-A1–A2 or unknown key in the course", extra.length === 0, extra.join(", "));

console.log("=== labels ===");
const unlabelled = COURSE_TOPIC_KEYS.filter((k) => !["en", "uz", "ru"].every((l) => TOPIC_LABELS[k]?.[l]));
ok("every topic has en/uz/ru labels", unlabelled.length === 0, unlabelled.join(", "));
ok("label falls back to English", topicLabel("tenses.present.third-person-s", "xx") === TOPIC_LABELS["tenses.present.third-person-s"].en);
ok("unknown key falls back to the key", topicLabel("nope.nope.nope") === "nope.nope.nope");
ok("unitForTopic resolves", unitForTopic("tenses.past.irregular-past") === "yesterday");

console.log("=== optional preview ===");
const optional = UNITS.flatMap((u) => u.topics.filter((t) => t.optional).map((t) => t.key));
ok("exactly the 3 passive topics are optional",
  optional.length === 3 && optional.every((k) => k.startsWith("passive-causative.")), optional.join(", "));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
