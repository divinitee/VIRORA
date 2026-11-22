// Hand-authored: reported-speech / questions / reported-yes-no (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): a reported yes / no question uses IF (or
// whether) + statement order, with backshift ('Are you hungry?' my mother asked.
// → My mother asked if I was hungry.).
// Triage: kept. Sibling reported-wh-question owns wh-words. whether is accepted in
// every typed key but never offered in choose next to if (both would be right).
// Errors offered: question order (was I), that instead of if, if + question order
// (if was I), did kept (did I like).
// Choose: if + subject + verb / question order / that + subject + verb / if + question order.
// Build: if + subject + verb. Sources print the direct question but never the
// pronoun or the past form the key uses.
// Transform: 5 report the question / 5 correct the mistake / 5 wanted to know if.
//
// Run: node tools/grammar-practice/authored/reported-speech.questions.reported-yes-no.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "reported-speech", branch: "questions", topic: "reported-yes-no", level: "B1", pv: "2.5" };
const M = ["Aziz", "Timur", "Bekzod", "Rustam"];
const F = ["Olga", "Lola", "Madina", "Sevara"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const WHY = "A reported yes / no question: if (or whether) + subject + verb, one step into the past.";
// subject s, past verb v, inverted question q
const be = (s, v) => [`if ${s} ${v}`, `${v} ${s}`, `that ${s} ${v}`, `if ${v} ${s}`];
const dv = (s, v, base) => [`if ${s} ${v}`, `did ${s} ${base}`, `that ${s} ${v}`, `if did ${s} ${base}`];
const pf = (s, pp, base) => [`if ${s} had ${pp}`, `had ${s} ${pp}`, `that ${s} had ${pp}`, `if did ${s} ${base}`];
const acc = (k) => [k.replace(/^if /, "whether ")];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [be("I", "was"), "'Are you hungry after the {trip}?' my {who} asked. She asked me ______ hungry after the {trip}.", { trip: ["walk", "match", "flight", "lesson"], who: ["mum", "grandma", "aunt", "sister"] }],
  [dv("I", "liked", "like"), "'Do you like {food}?' {f} asked me. She asked me ______ {food}.", { food: ["plov", "fish", "spicy food", "green tea"], f: F }],
  [be("he", "could"), "'Can you swim?' the {who} asked {m}. The {who} asked {m} ______ swim.", { who: ["coach", "teacher", "instructor", "guard"], m: M }],
  [be("it", "was"), "'Is the {shop} open?' I asked a {who}. I asked ______ open.", { shop: ["bank", "pharmacy", "bakery", "museum"], who: ["man", "woman", "guard", "boy"] }],
  [pf("we", "finished", "finish"), "'Have you finished the {work}?' the {who} asked us. She asked us ______ the {work}.", { work: ["test", "soup", "task", "project"], who: ["teacher", "waiter", "manager", "nurse"] }],
  [pf("I", "seen", "see"), "'Did you see the {film}?' {m} asked me. He asked me ______ the {film}.", { film: ["film", "match", "show", "final"], m: M }],
  [be("he", "would"), "'Will you come to the {event}?' {f} asked {m}. She asked him ______ come to the {event}.", { event: ["party", "wedding", "match", "concert"], f: F, m: M }],
  [be("I", "was"), "'Are you from {city}?' the {who} asked me. He asked me ______ from {city}.", { city: CITY, who: ["driver", "guide", "waiter", "man"] }],
  [dv("I", "needed", "need"), "'Do you need help with the {thing}?' my {who} asked me. He asked me ______ help with the {thing}.", { thing: ["bags", "car", "homework", "boxes"], who: ["neighbour", "brother", "uncle", "dad"] }],
  [be("it", "was"), "'Is it far to the {place}?' {f} asked me. She asked me ______ far to the {place}.", { place: ["station", "museum", "airport", "lake"], f: F }],
  [dv("they", "spoke", "speak"), "'Do your parents speak {lang}?' {m} asked me. He asked me ______ {lang}.", { lang: ["Russian", "English", "Korean", "Tajik"], m: M }],
  [be("she", "was"), "'Are you married?' the {who} asked {f}. He asked her ______ married.", { who: ["man", "clerk", "doctor", "receptionist"], f: F }],
  [be("he", "could"), "'Can I sit here?' a {who} asked me on the {place}. He asked me ______ sit there.", { who: ["man", "boy", "student", "young man"], place: ["bus", "train", "bench", "plane"] }],
  [be("she", "was"), "'Is your {who} at home?' {m} asked me. He asked me ______ at home.", { who: ["sister", "mother", "aunt", "wife"], m: M }],
  [pf("I", "locked", "lock"), "'Did you lock the {door}?' my {who} asked me. She asked me ______ the {door}.", { door: ["door", "car", "gate", "window"], who: ["mum", "sister", "wife", "grandma"] }],
  [dv("we", "wanted", "want"), "'Do you want some {food}?' {f} asked us. She asked us ______ some {food}.", { food: ["tea", "cake", "soup", "bread"], f: F }],
  [be("they", "were"), "'Are your cousins coming to the {event}?' I asked {f}. I asked her ______ coming to the {event}.", { event: ["wedding", "party", "picnic", "dinner"], f: F }],
  [be("it", "had"), "'Has the {bus} left?' {m} asked the {who}. He asked ______ left.", { bus: ["bus", "train", "ferry", "last bus"], m: M, who: ["guard", "driver", "woman", "man"] }],
  [be("it", "would"), "'Will it rain in {city} tomorrow?' {f} asked me. She asked me ______ rain in {city} the next day.", { city: CITY, f: F }],
  [be("I", "could"), "'Can you help me with the {thing}?' {m} asked me. He asked me ______ help him with the {thing}.", { thing: ["bags", "car", "homework", "boxes"], m: M }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Report the yes / no question. Write if + the subject + the verb, one step into the past.";
// [key, extra acceptable, source, slots]
const BUILD = [
  ["if I was", [], "'Are you hungry after the {trip}?' my {who} asked. She asked me ______ hungry after the {trip}.", { trip: ["walk", "match", "flight", "lesson"], who: ["mum", "grandma", "aunt", "sister"] }],
  ["if I liked", [], "'Do you like {food}?' {f} asked me. She asked me ______ {food}.", { food: ["plov", "fish", "spicy food", "green tea"], f: F }],
  ["if he could", [], "'Can you swim?' the {who} asked {m}. The {who} asked {m} ______ swim.", { who: ["coach", "teacher", "instructor", "guard"], m: M }],
  ["if it was", [], "'Is the {shop} open?' I asked a {who}. I asked ______ open.", { shop: ["bank", "pharmacy", "bakery", "museum"], who: ["man", "woman", "guard", "boy"] }],
  ["if we had", [], "'Have you done the {work}?' the {who} asked us. She asked us ______ done the {work}.", { work: ["test", "homework", "task", "project"], who: ["teacher", "waiter", "manager", "nurse"] }],
  ["if I had seen", ["if I saw", "whether I saw"], "'Did you see the {film}?' {m} asked me. He asked me ______ the {film}.", { film: ["film", "match", "show", "final"], m: M }],
  ["if he would", [], "'Will you come to the {event}?' {f} asked {m}. She asked him ______ come to the {event}.", { event: ["party", "wedding", "match", "concert"], f: F, m: M }],
  ["if I was", [], "'Are you from {city}?' the {who} asked me. He asked me ______ from {city}.", { city: CITY, who: ["driver", "guide", "waiter", "man"] }],
  ["if I needed", [], "'Do you need help with the {thing}?' my {who} asked me. He asked me ______ help with the {thing}.", { thing: ["bags", "car", "homework", "boxes"], who: ["neighbour", "brother", "uncle", "dad"] }],
  ["if it was", [], "'Is the {place} far?' {f} asked me. She asked me ______ far.", { place: ["station", "museum", "airport", "lake"], f: F }],
  ["if they spoke", [], "'Do your parents speak {lang}?' {m} asked me. He asked me ______ {lang}.", { lang: ["Russian", "English", "Korean", "Tajik"], m: M }],
  ["if she was", [], "'Are you married?' the {who} asked {f}. He asked her ______ married.", { who: ["man", "clerk", "doctor", "receptionist"], f: F }],
  ["if he could", [], "'Can I sit here?' a {who} asked me on the {place}. The {who} asked me ______ sit there.", { who: ["man", "boy", "student", "young man"], place: ["bus", "train", "bench", "plane"] }],
  ["if she was", [], "'Is your {who} at home?' {m} asked me. He asked me ______ at home.", { who: ["sister", "mother", "aunt", "wife"], m: M }],
  ["if I had locked", ["if I locked", "whether I locked"], "'Did you lock the {door}?' my {who} asked me. She asked me ______ the {door}.", { door: ["door", "car", "gate", "window"], who: ["mum", "sister", "wife", "grandma"] }],
  ["if we wanted", [], "'Do you want some {food}?' {f} asked us. She asked us ______ some {food}.", { food: ["tea", "cake", "soup", "bread"], f: F }],
  ["if they were", [], "'Are your cousins coming to the {event}?' I asked {f}. I asked her ______ coming to the {event}.", { event: ["wedding", "party", "picnic", "dinner"], f: F }],
  ["if it had", [], "'Has the {bus} left?' {m} asked the {who}. He asked ______ left.", { bus: ["bus", "train", "ferry", "last bus"], m: M, who: ["guard", "driver", "woman", "man"] }],
  ["if he could", [], "'Can you fix the {thing}?' I asked the {who}. I asked him ______ fix the {thing}.", { thing: ["car", "heater", "TV", "lock"], who: ["mechanic", "neighbour", "plumber", "man"] }],
  ["if I could", [], "'Can you help me with the {thing}?' {m} asked me. He asked me ______ help him with the {thing}.", { thing: ["bags", "car", "homework", "boxes"], m: M }],
].map(([key, extra, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, acceptable: [...acc(key), ...extra], why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REP = "Report the question with if. Start with the words given.";
const FIX = "Correct the mistake.";
const KNOW = "Report the question with wanted to know if.";
// [instr, source, hint, key, extra, slots]
const TRANSFORM = [
  [REP, "'Are you tired?' {m} asked me after the {event}.", "After the {event}, {m} asked me ______.", "if I was tired", [], { m: M, event: ["match", "walk", "lesson", "trip"] }],
  [REP, "'Do you live near the {place}?' {f} asked me.", "{f} asked me ______ the {place}.", "if I lived near", ["if I live near", "whether I live near"], { f: F, place: ["park", "station", "bazaar", "river"] }],
  [REP, "'Can you drive?' the {who} asked {m}.", "The {who} asked {m} ______.", "if he could drive", [], { who: ["manager", "boss", "teacher", "director"], m: M }],
  [REP, "'Have you been to {city}?' {f} asked us.", "{f} asked us ______ to {city}.", "if we had been", [], { f: F, city: CITY }],
  [REP, "'Will you be at home tonight?' my {who} asked me.", "My {who} asked me ______ at home that night.", "if I would be", [], { who: ["mum", "dad", "sister", "uncle"], x: [] }],
  [FIX, "{f} asked me was I hungry after the {trip}.", "{f} asked me ______ hungry after the {trip}.", "if I was", [], { f: F, trip: ["walk", "match", "flight", "lesson"] }],
  [FIX, "{m} asked me that I liked {food}.", "{m} asked me ______ {food}.", "if I liked", [], { m: M, food: ["plov", "fish", "spicy food", "green tea"] }],
  [FIX, "The {who} asked us if had we finished.", "The {who} asked us ______ finished.", "if we had", [], { who: ["teacher", "waiter", "manager", "nurse"], x: [] }],
  [FIX, "{f} asked {m} if did he want some {food}.", "{f} asked {m} ______ some {food}.", "if he wanted", [], { f: F, m: M, food: ["tea", "cake", "soup", "bread"] }],
  [FIX, "I asked the {who} could he help me.", "I asked the {who} ______ help me.", "if he could", [], { who: ["mechanic", "neighbour", "driver", "man"], x: [] }],
  [KNOW, "'Is the {place} open on Mondays?' {f} asked.", "{f} wanted to know ______ open on Mondays.", "if it was", ["if it is", "whether it is"], { f: F, place: ["museum", "bank", "library", "pool"] }],
  [KNOW, "'Do you have a car?' the {who} asked {m}.", "The {who} wanted to know ______ a car.", "if he had", [], { who: ["manager", "boss", "landlord", "teacher"], m: M }],
  [KNOW, "'Did you pay for the {thing}?' {f} asked me.", "{f} wanted to know ______ for the {thing}.", "if I had paid", ["if I paid", "whether I paid"], { f: F, thing: ["tickets", "food", "taxi", "room"] }],
  [KNOW, "'Are the {who} ready?' the driver asked.", "The driver wanted to know ______ ready.", "if they were", [], { who: ["children", "guests", "players", "tourists"], x: [] }],
  [KNOW, "'Can we park here?' {m} asked the {who}.", "{m} wanted to know ______ park there.", "if they could", ["if we could", "whether we could"], { m: M, who: ["guard", "man", "woman", "driver"] }],
].map(([instr, source, hint, key, extra, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, acceptable: [...acc(key), ...extra], why: WHY, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your teacher asked: 'Are you ready?' Report the question.", "She asked if we were ready", ["exactly one sentence", "if + subject + verb", "past"]],
  ["A friend asked: 'Do you like football?' Report it.", "He asked me if I liked football", ["exactly one sentence", "if", "no do / did"]],
  ["Report a yes / no question someone asked you today.", "… asked me if …", ["exactly one sentence", "if or whether", "statement order"]],
  ["Write the direct yes / no question and then report it.", "direct → if-question", ["exactly two sentences", "a question mark in the first", "if in the second"]],
  ["Someone asked you: 'Can you help me?' Report it.", "… asked me if I could help …", ["exactly one sentence", "could", "if"]],
  ["Report a question with wanted to know if.", "… wanted to know if …", ["exactly one sentence", "wanted to know", "if + statement order"]],
  ["A tourist asked: 'Is this the way to the museum?' Report it.", "… asked if it was the way …", ["exactly one sentence", "if", "was"]],
  ["Report a yes / no question with whether.", "… asked whether …", ["exactly one sentence", "whether", "statement order"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["A hotel receptionist asked you some questions. Report three or four of them with if.", "reported yes / no questions", ["asked me if", "statement order", "three or four sentences"]],
  ["Your mum asked you lots of questions before your trip. Report three or four of them.", "if + statement order", ["asked if", "past", "three or four sentences"]],
  ["Report three or four questions from a job interview: some with if, some with a wh-word.", "if vs wh-word", ["if", "where / what / why", "three or four sentences"]],
  ["A new neighbour asked you about your town. Report three or four yes / no questions.", "reported yes / no questions", ["asked me if", "wanted to know if", "three or four sentences"]],
  ["Write three or four sentences reporting questions a doctor asked you.", "if / whether + statement order", ["if", "whether", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
// Audit 21 Nov: accept 'd contractions (he'd left, I'd come, if I'd seen); grading does not expand 'd.
const CONTR = (t) => t.replace(/\b(I|he|she|we|they|you) (had|would) (?=\w)/gi, (_, p) => `${p}'d `);
for (const it of items) {
  if (typeof it.key !== "string") continue;
  const all = [it.key, ...(it.acceptable || [])];
  const extra = [...new Set(all.map(CONTR))].filter((x) => !all.includes(x));
  if (extra.length) it.acceptable = [...(it.acceptable || []), ...extra];
}
const out = "content/grammar-practice/reported-speech.questions.reported-yes-no.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "'Are you…?' → if + I was (statement order).",
   "'Do you like…?' → if + I liked, no do.",
   "'Can you…?' → if + he could.",
   "'Is the … open?' → if + it was.",
   "'Have you finished…?' → if + we had finished.",
   "'Did you see…?' → if + I had seen.",
   "'Will you come…?' → if + he would.",
   "'Are you from…?' → if + I was.",
   "'Do you need…?' → if + I needed.",
   "'Is it far…?' → if + it was.",
   "'Do your parents speak…?' → if + they spoke.",
   "'Are you married?' → if + she was.",
   "'Can I sit…?' → if + he could.",
   "'Is your … at home?' → if + she was.",
   "'Did you lock…?' → if + I had locked.",
   "'Do you want…?' → if + we wanted.",
   "'Are your cousins coming?' → if + they were.",
   "'Has the … left?' → if + it had.",
   "'Will it rain…?' → if + it would.",
   "'Can you help me?' → if + I could."
  ],
  "build": [
   "Question are → if, then subject I + was.",
   "Question do → if, then I + liked (past).",
   "Question can → if, then he + could.",
   "Question is → if, then it + was.",
   "Question have done → if, then we + had.",
   "Question did see → if, then I + had seen.",
   "Question will → if, then he + would.",
   "Question are from → if, then I + was.",
   "Question do need → if, then I + needed.",
   "Question is far → if, then it + was.",
   "Question do speak → if, then they + spoke.",
   "Question are (to her) → if, then she + was.",
   "Question can I → if, then he + could.",
   "Question is (your …) → if, then she + was.",
   "Question did lock → if, then I + had locked.",
   "Question do want → if, then we + wanted.",
   "Question are coming → if, then they + were.",
   "Question has left → if, then it + had.",
   "Question can you fix → if, then he + could.",
   "Question can you help → if, then I + could."
  ],
  "transform": [
   "Are you tired? → if I was tired.",
   "Do you live? → if I lived.",
   "Can you drive? → if he could drive.",
   "Have you been? → if we had been.",
   "Will you be? → if I would be.",
   "Add if and use statement order: if I was.",
   "A yes/no question needs if, not that.",
   "After if, subject first: if we had.",
   "After if, no did: if he wanted.",
   "Add if; subject before could.",
   "wanted to know + if: if it was.",
   "Do you have? → if he had.",
   "Did you pay? → if I had paid.",
   "Are they ready? → if they were.",
   "Can we park? → if they could."
  ]
 },
 "slot": [
  [
   "transform",
   8,
   "finished",
   "verb",
   [
    "finished",
    "eaten",
    "started",
    "left"
   ]
  ],
  [
   "transform",
   10,
   "help",
   "verb",
   [
    "help",
    "call",
    "meet",
    "drive"
   ]
  ],
  [
   "transform",
   14,
   "driver",
   "boss",
   [
    "driver",
    "guide",
    "teacher",
    "coach"
   ]
  ]
 ]
};
{
  const byStage = (st) => items.filter((it) => it.stage === st);
  for (const [st, list] of Object.entries(VARIETY.why || {})) {
    if (list.length !== byStage(st).length) throw new Error(`VARIETY: ${st} has ${byStage(st).length} items, ${list.length} whys`);
    byStage(st).forEach((it, i) => { if (list[i]) it.why = list[i]; });
  }
  for (const [st, n, word, name, vals] of VARIETY.slot || []) {
    const it = byStage(st)[n - 1];
    if (!word) { if (!it?.slots?.[name]) throw new Error(`VARIETY: no slot ${name} in ${st} ${n}`); it.slots[name] = [...new Set([...it.slots[name], ...vals])]; continue; }
    const re = new RegExp(`(?<![\\w{])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w}])`, "g");
    let hit = false;
    for (const f of ["prompt", "source", "hint"]) if (it?.[f] && re.test(it[f])) { it[f] = it[f].replace(re, `{${name}}`); hit = true; re.lastIndex = 0; }
    if (!hit) throw new Error(`VARIETY: "${word}" not found in ${st} ${n}`);
    it.slots = { ...(it.slots || {}), [name]: vals };
  }
}
// end variety
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
