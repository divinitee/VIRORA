// VT-40 5d: the spelling prompt never repeats a definition the same word check already showed.
// node tools/coach/coach-5d-tests.mjs
import { buildWordQuestions } from "../../src/lib/coach/wordCheck.js";
import { resumeState } from "../../src/lib/coach/sessionOutcome.js";

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

console.log("GPT audit 31 Oct: alternatives stay inside the learner's locked 5c rules");
const allowedText = (lvl) => ({ A1: ["def_a2", "english_definition"], A2: ["def_a2", "english_definition"], B1: ["def_b1", "def_a2", "english_definition"] }[lvl]).map((f) => word[f]);
for (const [lvl, lang] of [["A1", "en"], ["A2", "uz"], ["A2", "en"], ["A2", "ru"]]) {
  let bad = null;
  for (let i = 0; i < 20 && !bad; i++) {
    const qs = buildWordQuestions(word, pool, { depth: "remediation", lang, learnerLevel: lvl, sessionId: `s${i}`, rnd });
    const sp = qs.find((q) => q.type === "spelling");
    if (sp && (sp.promptForm !== "definition" || !allowedText(lvl).includes(sp.prompt) || shownDefs(qs).has(sp.prompt))) bad = JSON.stringify([sp.promptForm, sp.prompt]);
  }
  ok(`${lvl}/${lang.toUpperCase()}: spelling stays a definition (never a sentence), from ${lvl}'s chain, never the one just shown`, !bad, bad || "");
}
const onlyA2 = { ...word, def_b1: "", def_b2: "", def_c1: "", english_definition: "" };
const a2only = buildWordQuestions(onlyA2, [onlyA2, ...others], { depth: "remediation", lang: "en", learnerLevel: "A2", sessionId: "s", rnd });
const spA2 = a2only.find((q) => q.type === "spelling");
ok("A2 with only def_a2 and no other permitted definition: keeps it (never borrows def_b1/def_c1 or a sentence)", !spA2 || (spA2.promptForm === "definition" && spA2.prompt === onlyA2.def_a2));
ok("B1 may switch to the sentence form", buildWordQuestions(word, pool, { depth: "practice", lang: "en", learnerLevel: "B1", sessionId: "s", rnd }).find((q) => q.type === "spelling").promptForm === "sentence");
const b1NoAlt = buildWordQuestions({ ...word, description: "" }, [{ ...word, description: "" }, ...others], { depth: "practice", lang: "en", learnerLevel: "B1", sessionId: "s", rnd }).find((q) => q.type === "spelling");
ok("B1 without a sentence: another definition from B1's own chain only", allowedText("B1").includes(b1NoAlt.prompt) && b1NoAlt.prompt !== word.def_b1, b1NoAlt.prompt);

console.log("GPT audit 31 Oct: resume decided on the RAW persisted minutes");
ok("0.3 min saved, not complete -> resuming (rounding used to hide Continue)", resumeState({ spent_minutes: 0.3, remaining_minutes: 9.7, complete: false }).resuming === true);
ok("...and it shows '1 min done', never 0", resumeState({ spent_minutes: 0.3, remaining_minutes: 9.7 }).done === 1);
ok("0 min saved -> Start", resumeState({ spent_minutes: 0, remaining_minutes: 10 }).resuming === false);
ok("complete session -> not resuming", resumeState({ spent_minutes: 12, remaining_minutes: 0, complete: true }).resuming === false);
ok("missing / garbage spent_minutes -> Start", resumeState({}).resuming === false && resumeState({ spent_minutes: "x" }).resuming === false && resumeState(null).resuming === false);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
