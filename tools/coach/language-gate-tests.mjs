// VT-40 Stage 5a resolver tests: node tools/coach/language-gate-tests.mjs
import { normLevel, supportKey, translationMode, translationFor, definitionForLearner, spellingPromptForm, showsFirstLetter, resolveWordContent } from "../../src/lib/coach/languageGate.js";

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
const UZ_RE = /vazn|og'irlik/i, RU_RE = /[Ѐ-ӿ]/;
const showsNative = (r) => UZ_RE.test(JSON.stringify(r)) || RU_RE.test(JSON.stringify(r));

console.log("Gates");
ok("level parsing: b1 / B1+ / junk", normLevel("b1") === "B1" && normLevel("B1+") === "B1" && normLevel("x") === null);
ok("English app language has NO support field (was: uzbek)", supportKey("en") === null && supportKey("uz") === "uzbek" && supportKey("ru") === "russian");
ok("A1/UZ -> main", translationMode("A1", "uz") === "main");
ok("A1/EN -> none", translationMode("A1", "en") === "none");
ok("A2/UZ -> tap", translationMode("A2", "uz") === "tap");
ok("A2/RU -> tap", translationMode("A2", "ru") === "tap");
for (const l of ["B1", "B2", "C1"]) for (const g of ["uz", "ru", "en"]) ok(`${l}/${g.toUpperCase()} -> none`, translationMode(l, g) === "none");
ok("unknown level + uz -> tap (cautious), + en -> none", translationMode(null, "uz") === "tap" && translationMode(undefined, "en") === "none");

console.log("The 26 Oct live case: B1 learner, app in English");
const b1en = resolveWordContent(word, { learnerLevel: "B1", lang: "en" });
ok("B1/EN shows zero Uzbek/Russian anywhere in the resolved content", !showsNative(b1en));
ok("B1/EN gets the B1 definition, not the A2 one keyed on the WORD's level", b1en.definitionSource === "def_b1");
ok("B1/UZ also shows no translation (level gate)", !showsNative(resolveWordContent(word, { learnerLevel: "B1", lang: "uz" })));

console.log("Per level");
const a1uz = resolveWordContent(word, { learnerLevel: "A1", lang: "uz" });
ok("A1/UZ: translation present, mode main, def_a2", a1uz.translation === "vazn, og'irlik" && a1uz.mode === "main" && a1uz.definitionSource === "def_a2");
const a1en = resolveWordContent(word, { learnerLevel: "A1", lang: "en" });
ok("A1/EN: no translation, falls through to def_a2", !showsNative(a1en) && a1en.definitionSource === "def_a2" && a1en.available);
const a2uz = resolveWordContent(word, { learnerLevel: "A2", lang: "uz" });
ok("A2/UZ: tap mode, translation carried for the tap, def_a2", a2uz.mode === "tap" && a2uz.translation === "vazn, og'irlik" && a2uz.definitionSource === "def_a2");
ok("B2 -> def_b2", resolveWordContent(word, { learnerLevel: "B2", lang: "en" }).definitionSource === "def_b2");
ok("C1 -> def_c1", resolveWordContent(word, { learnerLevel: "C1", lang: "en" }).definitionSource === "def_c1");

console.log("Fallbacks");
const sparse = { ...word, def_a2: "", def_b1: "", def_b2: "", def_c1: "" };
ok("B1 with no def_b1/def_a2 -> english_definition", definitionForLearner(sparse, "B1").source === "english_definition");
ok("C1 with no def_c1 -> def_b2 (one tier below)", definitionForLearner({ ...word, def_c1: "" }, "C1").source === "def_b2");
ok("B2 with no def_b2 -> def_b1", definitionForLearner({ ...word, def_b2: "" }, "B2").source === "def_b1");
ok("A2 has no lower tier -> english_definition", definitionForLearner({ ...word, def_a2: "" }, "A2").source === "english_definition");
ok("a definition containing the headword is skipped", definitionForLearner({ ...word, def_b1: "the weight of a thing" }, "B1").source === "def_a2");
ok("never falls back to a translation: no definitions at all -> unavailable", (() => { const r = resolveWordContent({ ...sparse, english_definition: "" }, { learnerLevel: "B1", lang: "uz" }); return !r.available && !showsNative(r); })());

console.log("Russian missing");
const noRu = { ...word, russian: "" };
const a1ru = resolveWordContent(noRu, { learnerLevel: "A1", lang: "ru" });
ok("A1/RU with no Russian -> unavailable, never Uzbek", !a1ru.available && !UZ_RE.test(JSON.stringify(a1ru)));
const a2ru = resolveWordContent(noRu, { learnerLevel: "A2", lang: "ru" });
ok("A2/RU with no Russian -> no Uzbek in the tap; definition still usable", !UZ_RE.test(JSON.stringify(a2ru)) && !a2ru.translation && a2ru.available);
ok("translationFor never crosses languages", translationFor(noRu, "ru") === "" && translationFor(word, "en") === "");

console.log("Spelling prompt form");
ok("A1/UZ -> translation", spellingPromptForm({ learnerLevel: "A1", lang: "uz", sessionId: "s", wordId: "w", sentenceOk: true }) === "translation");
ok("A1/EN -> definition", spellingPromptForm({ learnerLevel: "A1", lang: "en", sessionId: "s", wordId: "w", sentenceOk: true }) === "definition");
ok("A2/UZ -> definition", spellingPromptForm({ learnerLevel: "A2", lang: "uz", sessionId: "s", wordId: "w", sentenceOk: true }) === "definition");
ok("B1+ with no valid sentence -> definition", spellingPromptForm({ learnerLevel: "B2", lang: "en", sessionId: "s", wordId: "w", sentenceOk: false }) === "definition");
const forms = Array.from({ length: 200 }, (_, i) => spellingPromptForm({ learnerLevel: "B1", lang: "en", sessionId: "sess-26oct", wordId: `w${i}`, sentenceOk: true }));
const sentences = forms.filter((f) => f === "sentence").length;
ok(`B1+ mixes both forms across a session (${sentences}/200 sentence)`, sentences > 60 && sentences < 140);
ok("deterministic: same session + word -> same form on reload", forms.every((f, i) => f === spellingPromptForm({ learnerLevel: "B1", lang: "en", sessionId: "sess-26oct", wordId: `w${i}`, sentenceOk: true })));
ok("first-letter hint at every level except C1", ["A1", "A2", "B1", "B2"].every(showsFirstLetter) && !showsFirstLetter("C1"));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
