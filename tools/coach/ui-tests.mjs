// Stage 3 pure UI helpers: node --experimental-strip-types tools/coach/ui-tests.mjs
import { buildWordQuestions, evidenceItem, grammarPath, stageForDepth, WORD_QUESTIONS, definitionFor, contextFor, spellingHint, wordCard, showsWordCard } from "../../src/lib/coach/wordCheck.js";
import { coachT, labelKey, reasonKey, goalLabel, minutesWord } from "../../src/lib/coach/coachCopy.js";
import { GOALS } from "../../base44/shared/coachGraph.js";
import { DEPTHS } from "../../base44/shared/coachPlan.js";
import { OUTCOME, summarise, afterRunView } from "../../src/lib/coach/sessionOutcome.js";
import { packByWord, roundsFor, createAnswerSender, finishWithSave, MAX_ROUND_ITEMS } from "../../src/lib/coach/answerBatches.js";
import { LIVE_GRAMMAR_TOPICS } from "../../base44/shared/coachGraph.js";
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${n}`); };
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const W = (id, en, uz, ru) => ({ id, english: en, uzbek: uz, russian: ru });
const target = W("t", "apple", "olma", "яблоко");
const pool = [target, W("a", "pear", "nok", "груша"), W("b", "bread", "non", "хлеб"), W("c", "water", "suv", "вода"), W("d", "milk", "sut", "молоко")];
for (const depth of Object.keys(DEPTHS)) ok(`every plan depth has a word question count (${depth})`, WORD_QUESTIONS[depth] >= 1);
const qs = buildWordQuestions(target, pool, { depth: "remediation", lang: "uz", rnd });
ok("remediation word -> 5 questions: meaning, recall, ... spelling last", qs.length === 5 && qs[0].type === "multiple_choice" && qs[1].type === "translation" && qs[4].type === "spelling");
ok("each option question has the correct answer exactly once and 4 unique options", qs.filter((q) => q.type !== "spelling").every((q) => q.options.filter((o) => o === q.correct).length === 1 && new Set(q.options).size === q.options.length && q.options.length === 4));
ok("multiple_choice answer = native (uz), translation answer = english", qs[0].correct === "olma" && qs[1].correct === "apple");
ok("ru learners get russian", buildWordQuestions(target, pool, { depth: "probe", lang: "ru", rnd })[0].correct === "яблоко");
ok("no translation -> no questions (never fake evidence)", buildWordQuestions(W("x", "zzz", "", ""), pool, { depth: "probe", lang: "uz" }).length === 0);
ok("too few distractors -> no questions", buildWordQuestions(target, [target, pool[1]], { depth: "probe", lang: "uz" }).length === 0);
const dupPool = [target, pool[1], pool[1], { ...pool[2], id: "b2" }, pool[2], pool[3], pool[4]]; // same id twice + same text under two ids
const dq = buildWordQuestions(target, dupPool, { depth: "remediation", lang: "uz", rnd });
ok("distractors are distinct even when the pool repeats words (no duplicate options)", dq.length === 5 && dq.filter((q) => q.options).every((q) => new Set(q.options).size === 4));
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
  ok("ru learner: every meaning option is Russian (distractors without Russian are skipped, no mixed languages)", ruQs.length === 5 && ruQs.filter((q) => q.type === "multiple_choice").every((q) => q.options.every((o) => cyr.test(o))), JSON.stringify(ruQs.map((q) => q.options)));
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
  ok("options are distinct ignoring case and spaces", caseDup.filter((q) => q.options).every((q) => new Set(q.options.map((o) => o.toLowerCase().trim())).size === q.options.length));
  // Review of the bundle on live rows: senses, qualifiers and the other script.
  const confident = W("cf", "confident", "ishonchli", "уверенный");
  const senseMix = [confident, W("ce", "certain", "aniq; ishonchli", "уверенный; определённый"), W("tr", "tree", "daraxt (yog'och)", "дерево"), W("wd", "wood", "yog'och", "дерево (материал)"),
    W("cd", "on CD/DVD/video", "CD/DVD/videoda", "на CD/DVD/видео"), W("cb", "carbon footprint", "karbon izи", "углеродный след"), pool[1], pool[2], pool[3], pool[4]];
  let secondRight = 0, latinRu = 0, cyrUz = 0, treeDup = 0;
  for (let i = 0; i < 300; i++) {
    for (const q of buildWordQuestions(confident, senseMix, { depth: "remediation", lang: "ru", rnd })) {
      if (q.type === "translation" && q.options.includes("certain")) secondRight++;
      if (q.type === "multiple_choice" && q.options.some((o) => o !== q.correct && /уверенный/.test(o))) secondRight++;
      if (q.type === "multiple_choice" && q.options.some((o) => /[A-Za-z]/.test(o))) latinRu++;
    }
    for (const q of buildWordQuestions(senseMix[2], senseMix, { depth: "remediation", lang: "ru", rnd })) if (q.type === "multiple_choice" && q.options.filter((o) => /дерево/.test(o)).length > 1) treeDup++;
    for (const q of buildWordQuestions(confident, senseMix, { depth: "remediation", lang: "uz", rnd })) if (q.type === "multiple_choice" && q.options.some((o) => /[Ѐ-ӿ]/.test(o))) cyrUz++;
  }
  ok("a word whose meanings include the target's (\"уверенный; определённый\") is never offered", secondRight === 0, String(secondRight));
  ok("\"дерево\" and \"дерево (материал)\" never appear together", treeDup === 0, String(treeDup));
  ok("ru: no distractor with Latin letters (\"на CD/DVD/видео\"); uz: no distractor with Cyrillic letters", latinRu === 0 && cyrUz === 0, `${latinRu}/${cyrUz}`);
  ok("a target written with Latin letters in Russian is still playable (only distractors are filtered)", buildWordQuestions(senseMix[4], senseMix, { depth: "probe", lang: "ru", rnd })[0]?.correct === "на CD/DVD/видео");
}
console.log("\n=== Word workout: meaning, recall, definition, context, spelling (2026-10-14) ===");
{
  const env = { id: "e", english: "environment", uzbek: "atrof-muhit", russian: "окружающая среда", cefr: "B1", def_b1: "the air, water, and land where all animals and plants live", english_definition: "The world around us where we live.", example_en: "We must protect our natural environment." };
  const P = [env, ...pool.slice(1)];
  const kinds = (d) => buildWordQuestions(env, P, { depth: d, lang: "uz", rnd }).map((q) => q.kind).join();
  ok("probe = meaning, definition, context", kinds("probe") === "meaning,definition,context", kinds("probe"));
  ok("practice = meaning, definition, context, spelling", kinds("practice") === "meaning,definition,context,spelling", kinds("practice"));
  ok("brushup = context, spelling, recall", kinds("brushup") === "context,spelling,recall", kinds("brushup"));
  ok("remediation trains all five", kinds("remediation") === "meaning,recall,definition,context,spelling", kinds("remediation"));
  const qq = buildWordQuestions(env, P, { depth: "remediation", lang: "uz", rnd });
  const ctx = qq.find((q) => q.kind === "context"), def = qq.find((q) => q.kind === "definition"), sp = qq.find((q) => q.kind === "spelling");
  ok("context: the word is blanked, never shown; answer is an option", ctx.prompt.includes("_____") && !/environment/i.test(ctx.prompt) && ctx.correct === "environment" && ctx.options.includes("environment") && ctx.type === "context");
  ok("definition: level-appropriate (B1 learner word -> def_b1)", def.prompt === env.def_b1 && def.type === "definition");
  ok("a definition containing the word (or a form of it) is never used", definitionFor({ english: "environment", cefr: "A2", def_a2: "Environmental things.", english_definition: "The world around us." }) === "The world around us.");
  ok("spelling: native prompt, letter-count hint, no options", sp.prompt === "atrof-muhit" && sp.hint === "e__________" && !sp.options && sp.type === "spelling");
  ok("spelling evidence is graded like the server (letters only, any case)", evidenceItem(env, sp, " Environment").correct === true && evidenceItem(env, sp, "enviroment").correct === false && evidenceItem(env, sp, "x").type === "spelling");
  ok("no definition/example -> meaning/recall fill in, never empty", buildWordQuestions(target, pool, { depth: "probe", lang: "uz", rnd }).map((q) => q.kind).join() === "meaning,recall,meaning");
  ok("the word twice in the example -> no context question", contextFor({ english: "go", example_en: "Go, go now." }) === "");
  ok("inflected only (exploded) -> no context question", contextFor({ english: "explode", example_en: "The old factory exploded at night." }) === "");
  ok("not typeable (etc.) -> no spelling; multiword hint keeps the space", spellingHint("etc.") === "" && spellingHint("carbon footprint") === "c_____ f________");
  const card = wordCard(env, "ru");
  ok("weak-word card: word, learner's translation, definition, example", card.english === "environment" && card.native === "окружающая среда" && !!card.definition && !!card.example);
  for (const lang of ["en", "uz", "ru"]) { const t = coachT(lang, "vira"); ok(`copy for the new question types (${lang})`, ["q_definition", "q_context", "q_spelling", "check", "answer", "word_card", "got_it", "min_short"].every((k) => t(k) && t(k) !== k)); }
}
console.log("\n=== Answer batching: <= 50 per round, one word per round, failed rounds retried (audit finding 1) ===");
{
  // 30 words x 4 answers = 120 answers, like a long Velvet/VI session.
  const entries = [];
  for (let w = 0; w < 30; w++) for (let q = 0; q < 4; q++) entries.push({ key: `word:w${w}:0`, ev: { word_id: `w${w}`, q } });
  const chunks = packByWord(entries);
  ok("every answer is kept (120 in, 120 out)", chunks.flat().length === 120);
  ok("no round over 50 answers", MAX_ROUND_ITEMS === 50 && chunks.every((c) => c.length <= 50), chunks.map((c) => c.length).join());
  ok("one word's answers never split across rounds", [...new Set(entries.map((e) => e.key))].every((k) => chunks.filter((c) => c.some((e) => e.key === k)).length === 1));
  ok("order kept", JSON.stringify(chunks.flat()) === JSON.stringify(entries));
  ok("a single word above the limit is split rather than dropped", packByWord(Array.from({ length: 60 }, (_, i) => ({ key: "word:big:0", ev: i }))).map((c) => c.length).join() === "50,10");
  let n = 0;
  const rounds = roundsFor([...entries, { key: "word:left:0", ev: { word_id: "left" } }], { completed: new Set(entries.map((e) => e.key)), sessionKey: "2026-10-14:today:0", newRoundId: () => `r${++n}` });
  ok("finished words carry the session_key; a word left part-way goes untagged in its own round", rounds.slice(0, -1).every((r) => r.coach?.session_key === "2026-10-14:today:0") && !rounds[rounds.length - 1].coach && rounds[rounds.length - 1].items.length === 1);
  ok("each round has its own id and the quiz contract", new Set(rounds.map((r) => r.round_id)).size === rounds.length && rounds.every((r) => r.game === "quiz" && r.items.length <= 50));

  // Sender: a failed round is kept with its round_id and resent by the next flush.
  const sent = [];
  let failNext = 1;
  const sender = createAnswerSender(async (email, payload) => { sent.push(payload.round_id); if (failNext > 0 && sent.length === 2) { failNext--; return null; } return { ok: true }; });
  let id = 0;
  const first = await sender.flush({ email: "a@x", entries: entries.slice(), completed: new Set(entries.map((e) => e.key)), sessionKey: "k", newRoundId: () => `s${++id}` });
  ok("a failed save -> flush reports false and keeps that round", first === false && sender.unsentCount("a@x") === 1);
  const second = await sender.flush({ email: "a@x", entries: [], completed: new Set(), sessionKey: "k", newRoundId: () => `s${++id}` });
  ok("the next flush resends the SAME round_id (server dedupes a round that did land)", second === true && sender.unsentCount("a@x") === 0 && sent[sent.length - 1] === sent[1]);
  ok("a thrown error counts as a failed save (kept, not lost)", await (async () => { const s2 = createAnswerSender(async () => { throw new Error("offline"); }); const r = await s2.flush({ email: "b@x", entries: entries.slice(0, 4), completed: new Set(["word:w0:0"]), sessionKey: "k", newRoundId: () => "t1" }); return r === false && s2.unsentCount("b@x") === 1; })());
  ok("rounds are only ever resent for the same account", await (async () => { const got = []; const s3 = createAnswerSender(async (email, p) => { got.push(email); return email === "c@x" ? null : { ok: true }; }); await s3.flush({ email: "c@x", entries: entries.slice(0, 4), completed: new Set(["word:w0:0"]), sessionKey: "k", newRoundId: () => "u1" }); await s3.flush({ email: "d@x", entries: [], completed: new Set(), sessionKey: "k", newRoundId: () => "u2" }); return got.join() === "c@x" && s3.unsentCount("c@x") === 1; })());
  ok("a ready-made round (grammar) is queued as-is and resent with ITS round_id after a failure", await (async () => {
    const ids = []; let fail = true;
    const sg = createAnswerSender(async (email, p) => { ids.push(p.round_id); if (fail) { fail = false; return null; } return { ok: true }; });
    const g = { game: "grammar_practice", round_id: "g-1", grammar_topic: "t", items: [{ item_id: "x", given: "y" }], coach: { session_key: "k" } };
    const r1 = await sg.flush({ email: "g@x", rounds: [g] });
    const r2 = await sg.flush({ email: "g@x" });
    return r1 === false && r2 === true && ids.join() === "g-1,g-1" && sg.unsentCount("g@x") === 0;
  })());
  ok("no email -> nothing sent, nothing consumed", (await createAnswerSender(async () => ({ ok: true })).flush({ email: null, entries })) === false);
  // Concurrent flushes (Back while a grammar step flushes) run one after another, never sending twice.
  const seen = [];
  const slow = createAnswerSender(async (email, p) => { await new Promise((r) => setTimeout(r, 5)); seen.push(p.round_id); return { ok: true }; });
  let m = 0;
  const [a1, a2] = await Promise.all([
    slow.flush({ email: "e@x", entries: entries.slice(0, 60), completed: new Set(entries.map((e) => e.key)), sessionKey: "k", newRoundId: () => `v${++m}` }),
    slow.flush({ email: "e@x", entries: entries.slice(60), completed: new Set(entries.map((e) => e.key)), sessionKey: "k", newRoundId: () => `v${++m}` }),
  ]);
  ok("concurrent flushes: every round sent exactly once", a1 && a2 && seen.length === new Set(seen).size && seen.length === m, seen.join());
}
console.log("\n=== Weak-word card = hint (14 Oct audit) ===");
{
  ok("only a weak word (remediation) opens with the word card", showsWordCard("remediation") && !showsWordCard("probe") && !showsWordCard("practice") && !showsWordCard("brushup"));
  const q0 = buildWordQuestions(target, pool, { depth: "remediation", lang: "uz", rnd })[0];
  const hinted = evidenceItem(target, q0, q0.correct, { support: "hint" });
  ok("answers after the card carry support: \"hint\" (server: weight x0.5, FSRS at most Good)", hinted.support === "hint" && hinted.correct === true);
  ok("answers without the card carry no support field (unchanged contract)", !("support" in evidenceItem(target, q0, q0.correct)));
}
console.log("\n=== End of session: Done only after every answer is saved (15 Oct) ===");
{
  const run = async (results) => {
    const r = [...results]; const waits = []; let done = 0;
    const out = await finishWithSave({ flush: async () => { const v = r.shift(); if (v instanceof Error) throw v; return v; }, onDone: () => { done++; }, wait: async (ms) => { waits.push(ms); } });
    return { out, done, waits };
  };
  const a = await run([true]);
  ok("saved first time -> Done once, no wait", a.out === "done" && a.done === 1 && a.waits.length === 0);
  const b = await run([false, true]);
  ok("first save fails, automatic retry after 1.5 s succeeds -> Done once", b.out === "done" && b.done === 1 && b.waits.join() === "1500");
  const c = await run([false, false]);
  ok("both attempts fail -> \"failed\" and Done is NOT shown", c.out === "failed" && c.done === 0);
  const d = await run([new Error("offline"), new Error("offline")]);
  ok("a thrown error counts as a failed save (no crash, no Done)", d.out === "failed" && d.done === 0);
  for (const lang of ["en", "uz", "ru"]) { const t = coachT(lang, "vira"); ok(`save-error copy (${lang})`, ["save_pending", "save_failed", "save_failed_sub", "retry"].every((k) => t(k) && t(k) !== k)); }
}
console.log(`\n${pass} passed, ${fail} failed`);

if (fail) process.exit(1);
