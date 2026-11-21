// Hand-authored: reported-speech / questions / reported-wh-question (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): a reported wh-question has STATEMENT order and
// no do / did, and the verb moves back after asked ('Where do you live?' she asked.
// → She asked me where I lived.).
// Triage: kept. Sibling questions-negation.indirect-questions.embedded-order (Base44
// lane) owns "Can you tell me where the station is?" (present, no backshift); here
// it is always asked / wanted to know + backshift. reported-yes-no owns if / whether.
// One right answer: "She asked me where I live" can be English when it is still true,
// so the present statement order is never offered in choose (typed keys accept it
// where the fact may still be true). who / what + be + noun ("what my name was /
// what was my name") is not used: both orders are heard.
// Choose: statement order + past / question order + past (did I live) / question
// order + present (do I live) / broken order (lived I).
// Build: the subject + verb part, from the direct question printed before it.
// Transform: 5 report the question (wh-word + clause) / 5 correct the mistake /
// 5 He wanted to know … .
//
// Run: node tools/grammar-practice/authored/reported-speech.questions.reported-wh-question.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "reported-speech", branch: "questions", topic: "reported-wh-question", level: "B1", pv: "2.5" };
const M = ["Aziz", "Timur", "Bekzod", "Rustam"];
const F = ["Olga", "Lola", "Madina", "Sevara"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Tashkent"];
const WHY = "A reported question has statement order (subject + verb), no do / did, and the verb moves back.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [["I lived", "did I live", "do I live", "lived I"], "'Where do you live in {city}?' {f} asked me. She asked me where ______ in {city}.", { f: F, city: CITY }],
  [["I was reading", "was I reading", "am I reading", "did I read"], "'What are you reading?' {m} asked me on the {place}. He asked me what ______.", { m: M, place: ["bus", "train", "plane", "bench"] }],
  [["he was", "was he", "is he", "did he be"], "'Why are you late?' the {who} asked {m}. She asked him why ______ late.", { who: ["teacher", "coach", "manager", "director"], m: M }],
  [["it started", "did it start", "does it start", "started it"], "'When does it start?' I asked about the {event}. I asked when ______, {f}.", { event: ["film", "match", "concert", "lesson"], f: F }],
  [["I was", "was I", "am I", "did I be"], "'How old are you?' the {who} at the {place} asked me. He asked me how old ______.", { who: ["man", "doctor", "guard", "driver"], place: ["gym", "pool", "club", "museum"] }],
  [["she wanted", "did she want", "does she want", "wanted she"], "'What do you want for {event}?' {m} asked his {who}. He asked her what ______ for {event}.", { m: M, event: ["Navruz", "New Year", "dinner", "the holiday"], who: ["sister", "mother", "wife", "daughter"] }],
  [["I had bought", "did I buy", "I did buy", "had I bought"], "'Where did you buy your {thing}?' {f} asked me. She asked me where ______ my {thing}.", { f: F, thing: ["coat", "phone", "bag", "shoes"] }],
  [["it cost", "did it cost", "does it cost", "cost it"], "'How much does the {thing} cost?' I asked the {who}. I asked how much ______.", { thing: ["melon", "bag", "carpet", "scarf"], who: ["seller", "shop assistant", "woman", "man"] }],
  [["I was going", "was I going", "am I going", "did I go"], "'Where are you going?' my {who} asked me at the {place}. She asked me where ______.", { who: ["mum", "sister", "aunt", "grandma"], place: ["door", "gate", "bus stop", "corner"] }],
  [["it was", "was it", "is it", "did it be"], "'What time is it?' a {who} at the {place} asked me. He asked me what time ______.", { who: ["man", "tourist", "boy", "driver"], place: ["station", "bus stop", "bazaar", "park"] }],
  [["he had left", "did he leave", "he did leave", "had he left"], "'Why did you leave?' {f} asked {m}. She asked him why ______.", { f: F, m: M }],
  [["she could", "could she", "can she", "did she can"], "'How can I help you?' the {who} asked {m}. She asked him how ______ help him.", { who: ["receptionist", "nurse", "assistant", "waitress"], m: M }],
  [["it was", "was it", "is it", "did it be"], "'Where is it?' a tourist asked me about the {place}. He asked me where ______, {f}.", { place: ["museum", "station", "old town", "bazaar"], f: F }],
  [["he had eaten", "did he eat", "he did eat", "had he eaten"], "'What did you eat at the {event}?' the doctor asked {m}. She asked him what ______ at the {event}.", { event: ["wedding", "party", "picnic", "café"], m: M }],
  [["I would come", "would I come", "will I come", "did I come"], "'When will you come back from {city}?' my {who} asked me. She asked me when ______ back from {city}.", { who: ["mum", "sister", "aunt", "grandma"], city: CITY }],
  [["I knew", "did I know", "do I know", "knew I"], "'How do you know {m}?' {f} asked me. She asked me how ______ him.", { m: M, f: F }],
  [["I took", "did I take", "do I take", "took I"], "'Which bus do you take to the {place}?' the {who} asked me. He asked me which bus ______ to the {place}.", { place: ["airport", "station", "bazaar", "university"], who: ["driver", "guard", "man", "teacher"] }],
  [["it was", "was it", "is it", "did it be"], "'Why is the {shop} closed?' {m} asked. He asked why ______ closed, {f}.", { shop: ["bank", "bakery", "pharmacy", "post office"], m: M, f: F }],
  [["I had been", "had I been", "have I been", "did I be"], "'Where have you been all {time}?' my {who} asked me. He asked me where ______ all {time}.", { time: ["day", "night", "morning", "evening"], who: ["dad", "brother", "uncle", "grandpa"] }],
  [["I was doing", "was I doing", "am I doing", "did I do"], "'What are you doing in {city}?' {f} asked me. She asked me what ______ in {city}.", { f: F, city: CITY }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Report the question. Write the subject and the verb in statement order, one step into the past (the words in brackets are the original question).";
// [key, acceptable, source, slots]
const BUILD = [
  ["I lived", ["I live"], "'Where do you live in {city}?' {f} asked me. She asked me where ______ in {city}.", { f: F, city: CITY }],
  ["I was reading", [], "{m} asked me what ______ (I / am reading) on the {place}.", { m: M, place: ["bus", "train", "plane", "bench"] }],
  ["he was", [], "'Why are you late for the {event}?' the {who} asked {m}. She asked him why ______ late for the {event}.", { event: ["lesson", "meeting", "match", "rehearsal"], who: ["teacher", "coach", "manager", "director"], m: M }],
  ["it started", [], "'When does the {event} start?' I asked {f}. I asked her when ______.", { event: ["film", "match", "concert", "lesson"], f: F }],
  ["I was", [], "'How old are you?' the {who} at the {place} asked me. He asked me how old ______.", { who: ["man", "doctor", "guard", "driver"], place: ["gym", "pool", "club", "museum"] }],
  ["she wanted", [], "'What do you want for {event}?' {m} asked his {who}. He asked her what ______ for {event}.", { m: M, event: ["Navruz", "New Year", "dinner", "the holiday"], who: ["sister", "mother", "wife", "daughter"] }],
  ["I had bought", ["I bought"], "'Where did you buy your {thing}?' {f} asked me. She asked me where ______ my {thing}.", { f: F, thing: ["coat", "phone", "bag", "shoes"] }],
  ["cost", ["costs"], "I asked the {who} how much the {thing} ______ (cost).", { thing: ["melon", "bag", "carpet", "scarf"], who: ["seller", "shop assistant", "woman", "man"] }],
  ["I was going", [], "At the {place}, my {who} asked me where ______ (I / am going).", { who: ["mum", "sister", "aunt", "grandma"], place: ["door", "gate", "bus stop", "corner"] }],
  ["it was", [], "A {who} at the {place} asked me what time ______ (it / is).", { who: ["man", "tourist", "boy", "driver"], place: ["station", "bus stop", "bazaar", "park"] }],
  ["he had left", ["he left"], "'Why did you leave the {event}?' {f} asked {m}. She asked him why ______ the {event}.", { f: F, m: M, event: ["party", "meeting", "wedding", "match"] }],
  ["she could", [], "'How can I help you?' The {who} asked {m} how ______ help him.", { who: ["receptionist", "nurse", "assistant", "waitress"], m: M }],
  ["was", ["is"], "'Where is the {place}?' a tourist asked me. He asked me where the {place} ______, {f}.", { place: ["museum", "station", "old town", "bazaar"], f: F }],
  ["he had eaten", ["he ate"], "'What did you eat at the {event}?' the doctor asked {m}. She asked him what ______ at the {event}.", { event: ["wedding", "party", "picnic", "café"], m: M }],
  ["I would come", [], "My {who} asked me when ______ (I / will come) back from {city}.", { who: ["mum", "sister", "aunt", "grandma"], city: CITY }],
  ["I knew", ["I know"], "'How do you know {m}?' {f} asked me. She asked me how ______ him.", { m: M, f: F }],
  ["I took", ["I take"], "'Which bus do you take to the {place}?' the {who} asked me. He asked me which bus ______ to the {place}.", { place: ["airport", "station", "bazaar", "university"], who: ["driver", "guard", "man", "teacher"] }],
  ["was", [], "'Why is the {shop} closed?' {m} asked. He asked why the {shop} ______ closed, {f}.", { shop: ["bank", "bakery", "pharmacy", "post office"], m: M, f: F }],
  ["I had been", [], "My {who} asked me where ______ (I / have been) all {time}.", { time: ["day", "night", "morning", "evening"], who: ["dad", "brother", "uncle", "grandpa"] }],
  ["I was doing", [], "{f} asked me what ______ (I / am doing) in {city}.", { f: F, city: CITY }],
].map(([key, acceptable, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, ...(acceptable.length ? { acceptable } : {}), why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REP = "Report the question. Start with the words given.";
const FIX = "Correct the mistake.";
const KNOW = "Report the question with wanted to know.";
// [instr, source, hint, key, acceptable, slots]
const TRANSFORM = [
  [REP, "'Where do you work?' {f} asked me.", "{f} asked me ______.", "where I worked", ["where I work"], { f: F, x: [] }],
  [REP, "'What are you cooking?' my {who} asked me.", "My {who} asked me ______.", "what I was cooking", [], { who: ["sister", "brother", "friend", "cousin"], x: [] }],
  [REP, "'Why are you so tired?' the {who} asked {m}.", "The {who} asked {m} ______.", "why he was so tired", [], { who: ["teacher", "coach", "doctor", "nurse"], m: M }],
  [REP, "'When did you arrive in {city}?' {f} asked me.", "{f} asked me ______ in {city}.", "when I had arrived", ["when I arrived"], { f: F, city: CITY }],
  [REP, "'How do you get to the {place}?' a tourist asked {m}.", "A tourist asked {m} ______ to the {place}.", "how he got", ["how to get"], { m: M, place: ["museum", "station", "old town", "bazaar"] }],
  [FIX, "{f} asked me where did I live.", "{f} asked me where ______.", "I lived", ["I live"], { f: F, x: [] }],
  [FIX, "{m} asked me what was I doing in {city}.", "{m} asked me what ______ in {city}.", "I was doing", [], { m: M, city: CITY }],
  [FIX, "The {who} asked us why were we late.", "The {who} asked us why ______ late.", "we were", [], { who: ["teacher", "coach", "manager", "director"], x: [] }],
  [FIX, "{f} asked {m} when does the {event} start.", "{f} asked {m} when the {event} ______.", "started", [], { f: F, m: M, event: ["film", "match", "concert", "lesson"] }],
  [FIX, "My {who} asked me where I have been.", "My {who} asked me where ______.", "I had been", [], { who: ["dad", "brother", "uncle", "grandpa"], x: [] }],
  [KNOW, "'What time does the {bus} leave?' {m} asked.", "{m} wanted to know what time the {bus} ______.", "left", ["leaves"], { m: M, bus: ["bus", "train", "plane", "ferry"] }],
  [KNOW, "'Where are you from?' the {who} asked me.", "The {who} wanted to know ______.", "where I was from", ["where I am from"], { who: ["driver", "guide", "teacher", "waiter"], x: [] }],
  [KNOW, "'How much did you pay for the {thing}?' {f} asked me.", "{f} wanted to know how much ______ for the {thing}.", "I had paid", ["I paid"], { f: F, thing: ["car", "phone", "carpet", "dress"] }],
  [KNOW, "'Who are you waiting for?' the {who} asked {m}.", "The {who} wanted to know who ______ for.", "he was waiting", [], { who: ["guard", "receptionist", "teacher", "manager"], m: M }],
  [KNOW, "'Why did you choose {city}?' {f} asked me.", "{f} wanted to know why ______ {city}.", "I had chosen", ["I chose"], { f: F, city: CITY }],
].map(([instr, source, hint, key, acceptable, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why: WHY, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["A new neighbour asked you: 'Where do you work?' Report the question.", "He / She asked me where I worked", ["exactly one sentence", "asked me where", "statement order"]],
  ["Your teacher asked: 'Why are you late?' Report it.", "She asked me why I was late", ["exactly one sentence", "why + subject + verb", "past"]],
  ["Report a question a tourist asked you.", "… asked me how / where …", ["exactly one sentence", "statement order", "no do / did"]],
  ["Write the direct question and then the reported question.", "direct → reported wh-question", ["exactly two sentences", "a question mark in the first", "statement order in the second"]],
  ["Your mum asked: 'What are you doing?' Report it.", "She asked me what I was doing", ["exactly one sentence", "was + -ing", "statement order"]],
  ["Report a question with wanted to know.", "… wanted to know …", ["exactly one sentence", "wanted to know", "wh-word + subject + verb"]],
  ["A friend asked: 'When did you come back?' Report it.", "… asked me when I had come back", ["exactly one sentence", "had + past participle", "no did"]],
  ["Report a question someone asked you in a job interview.", "… asked me why / what …", ["exactly one sentence", "statement order", "past"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You had a job interview yesterday. Report three or four questions they asked you.", "reported wh-questions", ["asked me", "statement order", "three or four sentences"]],
  ["A tourist stopped you in the street. Report three or four of his questions.", "reported wh-questions", ["asked", "wanted to know", "three or four sentences"]],
  ["Your grandparents asked you lots of questions at dinner. Report three or four of them.", "statement order + backshift", ["asked me", "where / what / why", "three or four sentences"]],
  ["Report the questions a doctor asked you. Write three or four sentences.", "reported questions", ["asked", "statement order", "three or four sentences"]],
  ["A new classmate asked you about your town. Report three or four questions.", "reported wh-questions", ["asked me", "wanted to know", "three or four sentences"]],
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
const out = "content/grammar-practice/reported-speech.questions.reported-wh-question.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "'Where do you live?' → where + I lived, no do.",
   "'What are you reading?' → what + I was reading.",
   "'Why are you late?' → why + he was.",
   "'When does it start?' → when + it started.",
   "'How old are you?' → how old + I was.",
   "'What do you want?' → what + she wanted.",
   "'Where did you buy?' → where + I had bought.",
   "'How much does it cost?' → how much + it cost.",
   "'Where are you going?' → where + I was going.",
   "'What time is it?' → what time + it was.",
   "'Why did you leave?' → why + he had left.",
   "'How can I help?' → how + she could.",
   "'Where is it?' → where + it was.",
   "'What did you eat?' → what + he had eaten.",
   "'When will you come?' → when + I would come.",
   "'How do you know him?' → how + I knew.",
   "'Which bus do you take?' → which bus + I took.",
   "'Why is the … closed?' → why + it was.",
   "'Where have you been?' → where + I had been.",
   "'What are you doing?' → what + I was doing."
  ],
  "build": [
   "do you live → I lived (statement order, past).",
   "I am reading → I was reading.",
   "are you → he was (statement order).",
   "does … start → it started.",
   "are you → I was.",
   "do you want → she wanted.",
   "did you buy → I had bought.",
   "cost after the subject, past: cost (same form).",
   "I am going → I was going.",
   "it is → it was.",
   "did you leave → he had left.",
   "can I → she could.",
   "is the … → the … was.",
   "did you eat → he had eaten.",
   "I will come → I would come.",
   "do you know → I knew.",
   "do you take → I took.",
   "is the … closed → the … was closed.",
   "I have been → I had been.",
   "I am doing → I was doing."
  ],
  "transform": [
   "Where do you work? → where I worked.",
   "What are you cooking? → what I was cooking.",
   "Why are you so tired? → why he was so tired.",
   "When did you arrive? → when I had arrived.",
   "How do you get? → how he got.",
   "No did in a report: where I lived.",
   "Subject first: what I was doing.",
   "Subject first: why we were.",
   "No does in a report: the … started.",
   "Past report: have been → had been.",
   "What time does … leave? → the … left.",
   "Where are you from? → where I was from.",
   "How much did you pay? → I had paid.",
   "Who are you waiting for? → he was waiting.",
   "Why did you choose? → I had chosen."
  ]
 },
 "slot": [
  [
   "transform",
   8,
   "late",
   "adj",
   [
    "late",
    "so quiet",
    "tired",
    "angry"
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
