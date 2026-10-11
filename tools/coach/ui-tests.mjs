// Stage 3 pure UI helpers: node --experimental-strip-types tools/coach/ui-tests.mjs
import { buildWordQuestions, evidenceItem, grammarPath, stageForDepth, WORD_QUESTIONS } from "../../src/lib/coach/wordCheck.js";
import { coachT, labelKey, reasonKey, goalLabel, minutesWord } from "../../src/lib/coach/coachCopy.js";
import { GOALS } from "../../base44/shared/coachGraph.js";
import { DEPTHS } from "../../base44/shared/coachPlan.js";
import { OUTCOME, summarise, afterRunView } from "../../src/lib/coach/sessionOutcome.js";
import { LIVE_GRAMMAR_TOPICS } from "../../base44/shared/coachGraph.js";
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${n}`); };
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const W = (id, en, uz, ru) => ({ id, english: en, uzbek: uz, russian: ru });
const target = W("t", "apple", "olma", "яблоко");
const pool = [target, W("a", "pear", "nok", "груша"), W("b", "bread", "non", "хлеб"), W("c", "water", "suv", "вода"), W("d", "milk", "sut", "молоко")];
for (const depth of Object.keys(DEPTHS)) ok(`every plan depth has a word question count (${depth})`, WORD_QUESTIONS[depth] >= 1);
const qs = buildWordQuestions(target, pool, { depth: "remediation", lang: "uz", rnd });
ok("remediation word -> 3 questions, alternating types", qs.length === 3 && qs[0].type === "multiple_choice" && qs[1].type === "translation");
ok("each question has the correct answer exactly once and 4 unique options", qs.every((q) => q.options.filter((o) => o === q.correct).length === 1 && new Set(q.options).size === q.options.length && q.options.length === 4));
ok("multiple_choice answer = native (uz), translation answer = english", qs[0].correct === "olma" && qs[1].correct === "apple");
ok("ru learners get russian", buildWordQuestions(target, pool, { depth: "probe", lang: "ru", rnd })[0].correct === "яблоко");
ok("no translation -> no questions (never fake evidence)", buildWordQuestions(W("x", "zzz", "", ""), pool, { depth: "probe", lang: "uz" }).length === 0);
ok("too few distractors -> no questions", buildWordQuestions(target, [target, pool[1]], { depth: "probe", lang: "uz" }).length === 0);
const dupPool = [target, pool[1], pool[1], { ...pool[2], id: "b2" }, pool[2], pool[3], pool[4]]; // same id twice + same text under two ids
const dq = buildWordQuestions(target, dupPool, { depth: "remediation", lang: "uz", rnd });
ok("distractors are distinct even when the pool repeats words (no duplicate options)", dq.length === 3 && dq.every((q) => new Set(q.options).size === 4));
const ev = evidenceItem(target, qs[0], "olma");
ok("evidence item matches the server's quiz grading contract", ev.word_id === "t" && ev.type === "multiple_choice" && ev.given === "olma" && ev.correct === true);
ok("every live grammar topic maps to a bank path", LIVE_GRAMMAR_TOPICS.every((k) => { const p = grammarPath(`grammar:${k}`); return p && p.join(".") === k; }));
ok("hub items never map to a practice bank", grammarPath("grammar:hub.articles") === null);
ok("weak/new grammar starts at choose; practice -> build", stageForDepth("remediation") === "choose" && stageForDepth("probe") === "choose" && stageForDepth("practice") === "build" && stageForDepth("brushup") === "transform");
for (const lang of ["en", "uz", "ru"]) for (const p of ["vira", "velvet", "vi"]) {
  const t = coachT(lang, p);
  ok(`copy complete: ${lang}/${p}`, ["today_title", "start", "keep_going", "done_title", "hello", "map_title", "nothing_title", "label_weak"].every((k) => t(k, { n: 10 }) && t(k, { n: 10 }) !== k && !/\bround/i.test(t(k, { n: 10 }))));
}
ok("server labels map to localized keys", ["New", "Needs work", "Practising", "Strong"].map(labelKey).join() === "label_new,label_weak,label_learning,label_solid");
ok("server short reasons map", reasonKey("Due") === "review_due" && reasonKey("Needs work") === "reason_weak" && reasonKey("New") === "reason_new" && reasonKey("Practice") === "reason_practice");

// --- Correction A (2026-10-09): completed vs unavailable vs left ---------------
const I = (k) => ({ item_key: k });
const U = OUTCOME.UNAVAILABLE, Cc = OUTCOME.COMPLETED, Lf = OUTCOME.LEFT;
const allSkipped = summarise({ "word:a:0": U, "grammar:x": U });
ok("summary counts all-skipped run (0 completed, 2 unavailable)", allSkipped.completed === 0 && allSkipped.unavailable === 2 && allSkipped.unavailableKeys.length === 2);
ok("all items skipped -> 'unavailable' (never 'done')", afterRunView({ session: { complete: false }, items: [I("word:a:0"), I("grammar:x")], summary: allSkipped }) === "unavailable");
const part = summarise({ "word:a:0": Cc, "grammar:x": U });
ok("partly skipped, only the skipped item remains -> 'done_partial' (count 1)", afterRunView({ session: { complete: false }, items: [I("grammar:x")], summary: part }) === "done_partial" && part.unavailable === 1 && part.completed === 1);
ok("partly skipped but other playable items remain -> 'plan'", afterRunView({ session: { complete: false }, items: [I("grammar:x"), I("word:b:0")], summary: part }) === "plan");
ok("server says complete -> 'done' regardless of client outcomes", afterRunView({ session: { complete: true }, items: [], summary: allSkipped }) === "done");
const left = summarise({ "grammar:x": Lf });
ok("left part-way -> item still playable -> 'plan' (not done, not unavailable)", afterRunView({ session: { complete: false }, items: [I("grammar:x")], summary: left }) === "plan" && left.left === 1 && left.completed === 0);
ok("everything completed but a save failed (server still lists it) -> 'plan', never a false 'done'", afterRunView({ session: { complete: false }, items: [I("word:a:0")], summary: summarise({ "word:a:0": Cc }) }) === "plan");
ok("nothing left and not complete -> 'plan' (shows 'nothing urgent')", afterRunView({ session: { complete: false }, items: [], summary: summarise({}) }) === "plan");
for (const lang of ["en", "uz", "ru"]) {
  const t = coachT(lang, "velvet");
  ok(`correction copy present: ${lang}`, ["today_sub_plain", "unavailable_title", "unavailable_sub"].every((k) => t(k) !== k) && t("partial_note", { n: 2 }).includes("2"));
}

{
  const fs = await import("node:fs");
  const missing = LIVE_GRAMMAR_TOPICS.filter((k) => !fs.existsSync(new URL(`../../src/lib/grammarPractice/bank/${k}.js`, import.meta.url)));
  ok("every live grammar topic (server hasContent) has a practice bank file (no unplayable grammar)", missing.length === 0, missing.join(","));
}

// --- Russian gap (GPT conditional approval, 2026-10-10) --------------------------
{
  const score = W("s", "score", "hisob", "");                 // the real corpus row: no Russian
  const mixedPool = [score, pool[1], W("u1", "milk2", "sut2", ""), pool[2], pool[3], pool[4]]; // one distractor without Russian
  ok("ru learner + target without Russian -> NO questions (no Uzbek fallback)", buildWordQuestions(score, mixedPool, { depth: "remediation", lang: "ru", rnd }).length === 0);
  ok("uz learner + same word -> playable in Uzbek", buildWordQuestions(score, mixedPool, { depth: "probe", lang: "uz", rnd })[0]?.correct === "hisob");
  const ruQs = buildWordQuestions(target, mixedPool, { depth: "remediation", lang: "ru", rnd });
  const cyr = /^[Ѐ-ӿ\s-]+$/;
  ok("ru learner: every meaning option is Russian (distractors without Russian are skipped, no mixed languages)", ruQs.length === 3 && ruQs.filter((q) => q.type === "multiple_choice").every((q) => q.options.every((o) => cyr.test(o))), JSON.stringify(ruQs.map((q) => q.options)));
}
// --- Post-publish corrections (2026-10-11) ----------------------------------------
{
  const goals = Object.values(GOALS);
  const cyr = /^[Ѐ-ӿ\s:,.-]+$/;
  ok("ru: every goal name is Russian", goals.every((g) => cyr.test(goalLabel(coachT("ru", "vira"), g))), goals.map((g) => goalLabel(coachT("ru", "vira"), g)).join(" | "));
  ok("uz: every goal name is translated (not the English objective)", goals.every((g) => { const s = goalLabel(coachT("uz", "vira"), g); return s && s !== g.objective && s !== `goal_${g.id}`; }));
  ok("en: goal names are the server's objective text", goals.every((g) => goalLabel(coachT("en", "vira"), g) === g.objective));
  ok("unknown goal falls back to its objective", goalLabel(coachT("ru", "vira"), { id: "nope", objective: "X" }) === "X");
  ok("ru minutes agree with the number (accusative)", [1, 2, 4, 5, 11, 12, 14, 20, 21, 22, 25].map((n) => minutesWord("ru", n)).join() === "минуту,минуты,минуты,минут,минут,минут,минут,минут,минуту,минуты,минут");
  ok("en minutes agree with the number", minutesWord("en", 1) === "minute" && minutesWord("en", 4) === "minutes");
  ok("Vira greeting reads right for planned minutes", coachT("en", "vira")("hello", { n: 1 }).includes("1 minute and") && coachT("en", "vira")("hello", { n: 4 }).includes("4 minutes") && coachT("ru", "vira")("hello", { n: 4 }).includes("4 минуты") && coachT("ru", "vira")("hello", { n: 20 }).includes("20 минут,") && coachT("uz", "vira")("hello", { n: 4 }).includes("4 daqiqa"));
  ok("no placeholder left in any greeting", ["en", "uz", "ru"].every((l) => ["vira", "velvet", "vi"].every((p) => !/\{\w+\}/.test(coachT(l, p)("hello", { n: 7 })))));
  ok("Done copy with Keep going exists in every language", ["en", "uz", "ru"].every((l) => { const s = coachT(l, "vira")("done_sub_more"); return s !== "done_sub_more" && s !== coachT(l, "vira")("done_sub") && !/\bround/i.test(s); }));

  const bill = W("bill", "bill", "hisob", "счет");
  const near = [bill, W("acc1", "account", "hisob raqam", "счёт"), W("acc2", "account", "akkaunt", "аккаунт"), W("p", "pear", "nok", "груша"), W("q", "bread", "non", "хлеб"), W("r", "water", "suv", "вода"), W("s2", "milk", "sut", "молоко")];
  let nearHits = 0;
  for (let i = 0; i < 200; i++) for (const q of buildWordQuestions(bill, near, { depth: "remediation", lang: "ru", rnd })) {
    if (q.type === "multiple_choice" && q.options.some((o) => o !== q.correct && o.replace(/ё/g, "е") === q.correct.replace(/ё/g, "е"))) nearHits++;
    if (q.type === "translation" && q.options.includes("account")) nearHits++;
  }
  ok("ru: \"счёт\" is never offered next to the correct \"счет\", and a headword meaning the same is never an option", nearHits === 0);
  const caseDup = buildWordQuestions(target, [target, W("x1", "Pear", "Nok ", "Груша"), pool[1], pool[2], pool[3], pool[4]], { depth: "remediation", lang: "ru", rnd });
  ok("options are distinct ignoring case and spaces", caseDup.every((q) => new Set(q.options.map((o) => o.toLowerCase().trim())).size === q.options.length));
}
console.log(`\n${pass} passed, ${fail} failed`);
