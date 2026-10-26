// VT-40 Stage 5c: Coach word questions follow the learner's level + app language.
// node tools/coach/coach-5c-tests.mjs
import { buildWordQuestions, wordCard, evidenceItem, altSentenceFor } from "../../src/lib/coach/wordCheck.js";
import { gradeTranslation } from "../../base44/shared/progressCore.js";
import { coachT } from "../../src/lib/coach/coachCopy.js";

let pass = 0, fail = 0;
const ok = (n, c, extra = "") => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${n}${c || !extra ? "" : `  -> ${extra}`}`); };
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const UZ = /vazn|og'irlik|olma|nok|non|suv|sut|kitob|uy|qalam|stol|eshik/i, CYR = /[Ѐ-ӿ]/;
const leaks = (x) => UZ.test(JSON.stringify(x)) || CYR.test(JSON.stringify(x));

const D = (base) => ({ def_a2: `simple: ${base}`, def_b1: `b1: ${base}`, def_b2: `b2: ${base}`, def_c1: `c1: ${base}`, english_definition: `word: ${base}` });
const word = { id: "w", english: "weight", cefr: "A1", uzbek: "vazn, og'irlik", russian: "вес", ...D("how heavy something is"), example_en: "I checked my weight on the scale.", description: "Her weight went down after the long illness." };
const others = [
  ["pear", "nok", "груша", "a sweet green fruit"], ["bread", "non", "хлеб", "food baked from flour"], ["water", "suv", "вода", "the clear liquid we drink"],
  ["milk", "sut", "молоко", "a white drink from cows"], ["book", "kitob", "книга", "pages you read"], ["house", "uy", "дом", "a building people live in"],
  ["pen", "qalam", "ручка", "a tool for writing with ink"], ["table", "stol", "стол", "furniture with a flat top"], ["door", "eshik", "дверь", "you open it to go in"],
].map(([en, uz, ru, d], i) => ({ id: `o${i}`, english: en, uzbek: uz, russian: ru, cefr: "A1", ...D(d), example_en: `x ${i}` }));
const pool = [word, ...others];
const run = (learnerLevel, lang, depth = "remediation", extra = {}) => buildWordQuestions(word, pool, { depth, lang, learnerLevel, sessionId: "2026-10-26:today:0", rnd, ...extra });

console.log("B1 learner, app in English (the 26 Oct live case; the word itself is A1)");
const b1 = run("B1", "en");
ok("zero Uzbek/Russian in every B1/EN question", b1.length > 0 && !leaks(b1), JSON.stringify(b1));
ok("zero Uzbek/Russian on the B1/EN weak-word card", !leaks(wordCard(word, "en", "B1")));
ok("B1/UZ (Uzbek app) is just as translation-free", !leaks(run("B1", "uz")) && !leaks(wordCard(word, "uz", "B1")));
const m = b1.find((q) => q.kind === "meaning");
ok("'What does it mean?' is definition_choice with the B1 definition as the key", m?.type === "definition_choice" && m.correct === word.def_b1 && m.prompt === "weight");
ok("exactly 4 definition options, all from the SAME tier (def_b1), no duplicates", m.options.length === 4 && new Set(m.options).size === 4 && m.options.every((o) => o.startsWith("b1: ")));
ok("no word gets both definition_choice and match-the-definition", !(b1.some((q) => q.type === "definition_choice") && b1.some((q) => q.type === "definition")));
ok("no translation-recall question at B1", !b1.some((q) => q.type === "translation"));

console.log("Client key == server grade (same frozen level)");
for (const lvl of ["A2", "B1", "B2", "C1", "unplaced"]) {
  const q = run(lvl, "en").find((x) => x.type === "definition_choice");
  const serverLevel = lvl === "unplaced" ? null : lvl;
  ok(`${lvl}: the option the client marks right is the one the server grades right`, !!q && gradeTranslation(word, "definition_choice", q.correct, { learnerLevel: serverLevel }) === true && q.options.filter((o) => gradeTranslation(word, "definition_choice", o, { learnerLevel: serverLevel })).length === 1);
}

console.log("A1 + Uzbek: translations");
const a1 = run("A1", "uz");
ok("A1/UZ meaning = multiple_choice translations", a1.find((q) => q.kind === "meaning")?.type === "multiple_choice" && a1.find((q) => q.kind === "meaning").correct === "vazn, og'irlik");
ok("A1/UZ spelling prompt is the translation, with first letter", (() => { const s = a1.find((q) => q.type === "spelling"); return s.prompt === "vazn, og'irlik" && s.hint === "w_____"; })());
ok("A1/UZ context shows the meaning inline", a1.find((q) => q.kind === "context")?.meaning === "vazn, og'irlik");
ok("A1/UZ weak-word card shows the translation inline", wordCard(word, "uz", "A1").native === "vazn, og'irlik");
ok("A1 with the app in ENGLISH: no translation anywhere", !leaks(run("A1", "en")) && !leaks(wordCard(word, "en", "A1")));

console.log("A2 + Uzbek: definitions, translation only behind a tap");
const a2 = run("A2", "uz");
ok("A2/UZ meaning = definition_choice on def_a2", (() => { const q = a2.find((x) => x.kind === "meaning"); return q?.type === "definition_choice" && q.correct === word.def_a2; })());
ok("A2/UZ: the translation is never in a prompt, option or inline hint", a2.every((q) => !UZ.test(q.prompt) && !(q.options || []).some((o) => UZ.test(o)) && !("meaning" in q)));
ok("A2/UZ: it is available as tapNative (hidden until tapped)", a2.some((q) => q.tapNative === "vazn, og'irlik"));
ok("A2/UZ weak-word card: tap only, not inline", wordCard(word, "uz", "A2").tapNative === "vazn, og'irlik" && !("native" in wordCard(word, "uz", "A2")));
ok("A2/UZ spelling prompt = def_a2 (English)", a2.find((q) => q.type === "spelling")?.prompt === word.def_a2);
ok("a tapped answer is tagged as hinted", evidenceItem(word, a2[0], a2[0].correct, { support: "hint" }).support === "hint");

console.log("B1+ spelling: mixed definition / sentence, stable on reload, C1 no first letter");
ok("alternative sentence: from `description`, blanked, not the context sentence", altSentenceFor(word) === "Her _____ went down after the long illness.");
ok("no alternative sentence when description == example_en", altSentenceFor({ ...word, description: word.example_en }) === "");
ok("no alternative sentence when the headword appears twice", altSentenceFor({ ...word, description: "weight and weight again" }) === "");
const forms = new Set();
for (let i = 0; i < 40; i++) {
  const s = buildWordQuestions(word, pool, { depth: "brushup", lang: "en", learnerLevel: "B2", sessionId: `sess-${i}`, rnd }).find((q) => q.type === "spelling");
  forms.add(s.promptForm);
  const again = buildWordQuestions(word, pool, { depth: "brushup", lang: "en", learnerLevel: "B2", sessionId: `sess-${i}`, rnd }).find((q) => q.type === "spelling");
  if (again.promptForm !== s.promptForm || again.prompt !== s.prompt) forms.add("UNSTABLE");
}
ok("both forms appear across sessions; never changes on reload", forms.has("sentence") && forms.has("definition") && !forms.has("UNSTABLE"), [...forms].join());
ok("sentence-form prompt never shows the word", (() => { for (let i = 0; i < 40; i++) { const s = buildWordQuestions(word, pool, { depth: "brushup", lang: "en", learnerLevel: "B1", sessionId: `x${i}`, rnd }).find((q) => q.type === "spelling"); if (s.promptForm === "sentence") return !/weight/i.test(s.prompt) && s.prompt.includes("_____"); } return false; })());
ok("C1: no first-letter hint; B2: has one", run("C1", "en", "brushup").find((q) => q.type === "spelling").hint === "" && run("B2", "en", "brushup").find((q) => q.type === "spelling").hint === "w_____");

console.log("Four valid options or a safe skip");
const thinPool = [word, others[0], others[1]]; // only 2 distractors
const thin = buildWordQuestions(word, thinPool, { depth: "practice", lang: "en", learnerLevel: "B1", sessionId: "s", rnd });
ok("too few distractors -> no option question with <4 options (word is skipped or only spelling remains)", thin.every((q) => !q.options || q.options.length === 4), JSON.stringify(thin.map((q) => [q.type, q.options?.length])));
const mixedTier = [word, ...others.map((o, i) => (i < 6 ? { ...o, def_b1: "" } : o))]; // only 3 others have def_b1
const mt = buildWordQuestions(word, mixedTier, { depth: "probe", lang: "en", learnerLevel: "B1", sessionId: "s", rnd }).find((q) => q.type === "definition_choice");
ok("definition options never mix tiers (other words falling back to def_a2/english_definition are not used)", !!mt && mt.options.every((o) => o.startsWith("b1: ")));
const tooFewTier = [word, ...others.map((o, i) => (i < 7 ? { ...o, def_b1: "" } : o))]; // only 2 others have def_b1
const tf = buildWordQuestions(word, tooFewTier, { depth: "probe", lang: "en", learnerLevel: "B1", sessionId: "s", rnd });
ok("fewer than 3 same-tier distractors -> no definition_choice (falls back to match-the-definition)", !tf.some((q) => q.type === "definition_choice") && tf.some((q) => q.type === "definition"), JSON.stringify(tf.map((q) => q.type)));

console.log("Legacy session (no level snapshot)");
const legacy = run(null, "uz", "remediation", { definitionChoice: false });
ok("no definition_choice offered (the server would reject it)", !legacy.some((q) => q.type === "definition_choice"));
ok("treated as unplaced: English only, no translation", legacy.length > 0 && !leaks(legacy));

console.log("Copy");
ok("new UI strings exist in en/uz/ru", ["en", "uz", "ru"].every((l) => ["pick_definition", "show_translation", "q_spelling_sentence"].every((k) => { const t = coachT(l, "vira")(k); return t && t !== k; })));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
