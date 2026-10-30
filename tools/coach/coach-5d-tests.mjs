// VT-40 5d: the spelling prompt never repeats a definition the same word check already showed.
// node tools/coach/coach-5d-tests.mjs
import { buildWordQuestions } from "../../src/lib/coach/wordCheck.js";

let pass = 0, fail = 0;
const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${n}${c || !x ? "" : `  -> ${x}`}`); };
let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const D = (b) => ({ def_a2: `simple: ${b}`, def_b1: `b1: ${b}`, def_b2: `b2: ${b}`, def_c1: `c1: ${b}`, english_definition: `word: ${b}` });
const word = { id: "w", english: "success", uzbek: "muvaffaqiyat", russian: "успех", cefr: "B1", ...D("a good result you wanted"), example_en: "Hard work is the key to success.", description: "Her success came after years of work." };
const others = ["pear", "bread", "water", "milk", "book", "house", "pen", "table"].map((e, i) => ({ id: `o${i}`, english: e, uzbek: `u${i}`, russian: `р${i}`, cefr: "B1", ...D(`thing ${i}`), example_en: `x ${i}` }));
const pool = [word, ...others];
const shownDefs = (qs) => new Set(qs.filter((q) => q.type === "definition_choice").map((q) => q.correct).concat(qs.filter((q) => q.type === "definition").map((q) => q.prompt)));

console.log("The 30 Oct play-test case (B1/EN, practice: definition_choice ... spelling)");
for (let i = 0; i < 30; i++) {
  const qs = buildWordQuestions(word, pool, { depth: "practice", lang: "en", learnerLevel: "B1", sessionId: `s${i}`, rnd });
  const sp = qs.find((q) => q.type === "spelling");
  if (!sp || shownDefs(qs).has(sp.prompt)) { ok("spelling never repeats the definition just shown", false, JSON.stringify(qs.map((q) => [q.type, q.prompt]))); break; }
  if (i === 29) ok("spelling never repeats the definition just shown (30 sessions)", true);
}
ok("with an alternative sentence available, spelling uses it", buildWordQuestions(word, pool, { depth: "practice", lang: "en", learnerLevel: "B1", sessionId: "s", rnd }).find((q) => q.type === "spelling").promptForm === "sentence");

console.log("No alternative sentence: another definition text, never the same one");
const noAlt = { ...word, description: "" };
const qs2 = buildWordQuestions(noAlt, [noAlt, ...others], { depth: "practice", lang: "en", learnerLevel: "B1", sessionId: "s", rnd });
const sp2 = qs2.find((q) => q.type === "spelling");
ok("falls back to a different definition (here english_definition), definition form", sp2.promptForm === "definition" && sp2.prompt !== noAlt.def_b1 && !shownDefs(qs2).has(sp2.prompt), sp2.prompt);
ok("the fallback never reveals the word", !/success/i.test(sp2.prompt));

console.log("Only one usable definition and no sentence: kept (rare), not dropped");
const onlyOne = { id: "w1", english: "success", uzbek: "m", russian: "у", cefr: "B1", def_b1: "the one text", example_en: "Hard work is the key to success." };
const qs3 = buildWordQuestions(onlyOne, [onlyOne, ...others], { depth: "practice", lang: "en", learnerLevel: "B1", sessionId: "s", rnd });
ok("spelling still asked", qs3.some((q) => q.type === "spelling"));

console.log("Nothing shown before spelling: the hash still decides (unchanged)");
const brush = buildWordQuestions(word, pool, { depth: "brushup", lang: "en", learnerLevel: "B2", sessionId: "s", definitionChoice: false, rnd }).find((q) => q.type === "spelling");
ok("brushup without definition_choice keeps the hashed form", ["sentence", "definition"].includes(brush.promptForm));

console.log("A1 + uz: translation prompt untouched");
ok("A1/UZ spelling prompt is the translation", buildWordQuestions(word, pool, { depth: "practice", lang: "uz", learnerLevel: "A1", sessionId: "s", rnd }).find((q) => q.type === "spelling").prompt === "muvaffaqiyat");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
