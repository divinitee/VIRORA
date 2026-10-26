// VT-40 Stage 5b server grading tests: node tools/coach/grading-5b-tests.mjs
// definition_choice = English word shown, pick its English definition. The server
// derives the right option from the stored word + the learner's STORED level.
import { gradeTranslation, gradeWordItem, snapshotLevel, sessionLevel, UNPLACED } from "../../base44/shared/progressCore.js";
import { definitionForLearner } from "../../base44/shared/languageGate.js";
import { definitionForLearner as clientDef } from "../../src/lib/coach/languageGate.js";

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${n}`); };

const word = {
  id: "w1", english: "weight", cefr: "A2",
  uzbek: "vazn, og'irlik", russian: "вес",
  def_a2: "how heavy something is",
  def_b1: "how heavy a person or thing is when measured",
  def_b2: "the heaviness of a person or object, measured on a scale",
  def_c1: "the measurable heaviness of a body; also importance or influence",
  english_definition: "how much a thing weighs when you put it on a scale",
};
const B1 = word.def_b1;
const quiz = (item, learnerLevel) => gradeWordItem({ game: "quiz", skill: "vocabulary", word, item, learnerLevel });

console.log("Client and server agree");
ok("client re-export and server module are the same function", clientDef === definitionForLearner);
for (const l of ["A1", "A2", "B1", "B2", "C1", null]) ok(`same key for ${l ?? "unplaced"}`, definitionForLearner(word, l).text === clientDef(word, l).text);

console.log("Correct / incorrect");
ok("B1 learner picks the B1 definition -> correct", gradeTranslation(word, "definition_choice", B1, { learnerLevel: "B1" }) === true);
ok("surrounding whitespace is tolerated", gradeTranslation(word, "definition_choice", `  ${B1} `, { learnerLevel: "B1" }) === true);
ok("B1 learner picks another word's definition -> wrong", gradeTranslation(word, "definition_choice", "a large vehicle that carries passengers", { learnerLevel: "B1" }) === false);
ok("each level is graded against its own tier", ["A2", "B2", "C1"].every((l) => gradeTranslation(word, "definition_choice", definitionForLearner(word, l).text, { learnerLevel: l }) === true));
ok("unplaced learner -> word's english_definition is the key", gradeTranslation(word, "definition_choice", word.english_definition, { learnerLevel: null }) === true);

console.log("Tampered submissions");
ok("a DIFFERENT tier's definition is rejected (B1 learner sends the A2 text)", gradeTranslation(word, "definition_choice", word.def_a2, { learnerLevel: "B1" }) === false);
ok("the translation is rejected as a definition answer", gradeTranslation(word, "definition_choice", word.uzbek, { learnerLevel: "B1" }) === false);
ok("the headword itself is rejected", gradeTranslation(word, "definition_choice", "weight", { learnerLevel: "B1" }) === false);
ok("client 'correct: true' with a wrong answer -> still false (server decides)", quiz({ type: "definition_choice", given: "wrong", correct: true }, "B1") === false);
ok("client-supplied level on the item is ignored (stored B1 wins over item A2)", quiz({ type: "definition_choice", given: word.def_a2, level: "A2", learnerLevel: "A2" }, "B1") === false);
ok("client-supplied answer key on the item is ignored", quiz({ type: "definition_choice", given: "anything", answer: "anything", key: "anything" }, "B1") === false);
ok("non-string answer -> not gradable here (the round guard below rejects it)", gradeTranslation(word, "definition_choice", 42, { learnerLevel: "B1" }) === null);
ok("empty key never matches an empty answer", gradeTranslation({ id: "x", english: "x" }, "definition_choice", "", { learnerLevel: "B1" }) === false);

console.log("Round guard (mirror of progressApi/entry.ts)");
const rejects = (it, w) => it?.type === "definition_choice" && (!w || typeof it?.given !== "string");
ok("definition_choice with no stored word -> round rejected (never client-attested)", rejects({ type: "definition_choice", given: B1, correct: true }, null));
ok("definition_choice with a non-text answer -> round rejected", rejects({ type: "definition_choice", given: 42, correct: true }, word));
ok("a well-formed definition_choice item passes the guard", !rejects({ type: "definition_choice", given: B1 }, word));

console.log("Session level snapshot (PlanLog.learner_level)");
ok("snapshot written: B1 -> 'B1', 'b1+' -> 'B1', none -> 'unplaced'", snapshotLevel("B1") === "B1" && snapshotLevel("b1+") === "B1" && snapshotLevel(null) === UNPLACED && snapshotLevel("Starter") === UNPLACED);
ok("grading reads the frozen level", JSON.stringify(sessionLevel({ learner_level: "B1" })) === JSON.stringify({ ok: true, level: "B1" }));
ok("'unplaced' snapshot grades as unplaced (english_definition key)", sessionLevel({ learner_level: "unplaced" }).ok && sessionLevel({ learner_level: "unplaced" }).level === null);
ok("no session row -> fail closed", sessionLevel(null).ok === false && sessionLevel(undefined).ok === false);
ok("legacy session row without a snapshot -> fail closed", sessionLevel({ session_key: "2026-10-25:today:0" }).ok === false);
ok("garbage snapshot value -> fail closed", sessionLevel({ learner_level: "Z9" }).ok === false && sessionLevel({ learner_level: 3 }).ok === false);
const frozen = sessionLevel({ learner_level: "B1" }).level;
ok("drift: learner promoted to B2 after planning -> B1 answer still correct, B2 text not", gradeTranslation(word, "definition_choice", word.def_b1, { learnerLevel: frozen }) === true && gradeTranslation(word, "definition_choice", word.def_b2, { learnerLevel: frozen }) === false);

console.log("Existing contract unchanged");
ok("multiple_choice still grades against uz/ru", gradeTranslation(word, "multiple_choice", "vazn, og'irlik") === true && gradeTranslation(word, "multiple_choice", "вес") === true);
ok("translation / definition / context still grade against the English headword", ["translation", "definition", "context"].every((t) => gradeTranslation(word, t, "weight") === true && gradeTranslation(word, t, "height") === false));
ok("spelling unchanged", gradeTranslation(word, "spelling", "Weight") === true && gradeTranslation(word, "spelling", "wieght") === false);
ok("gradeWordItem without learnerLevel still works for old types", gradeWordItem({ game: "quiz", skill: "vocabulary", word, item: { type: "translation", given: "weight" } }) === true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
