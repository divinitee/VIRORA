// Hand-authored: modals / semi-modals / have-to-past (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): past obligation is HAD TO (must has no past
// form): "Yesterday I must stay late" → "Yesterday I had to stay late".
// Triage: kept. A2 have-to owns present have to / has to; this topic is the past:
// had to, and didn't have to (= it wasn't necessary). Every line has a clear past
// time word or a past verb, so have to and must are wrong.
// Choose: 14 had to / must / have to / musted; 6 didn't have to / mustn't /
// didn't had to / don't have to.
// Build: had to / didn't have to + the verb in brackets. No source prints "to"
// or "had" (the key would repeat them).
// Transform: 5 correct must in the past / 5 it was necessary for … to → had to /
// 5 it wasn't necessary → didn't have to.
//
// Run: node tools/grammar-practice/authored/modals.semi-modals.have-to-past.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "semi-modals", topic: "have-to-past", level: "B1", pv: "2.5" };
const NAME = ["Gulnora", "Jamshid", "Malika", "Ulugbek"]; // listener names: never printed in a sentence (audit 20 Nov)
const WHY = "Past obligation: had to + base verb (must has no past form).";
const WHY_NOT = "It wasn't necessary in the past: didn't have to + base verb.";
const POS = ["had to", "must", "have to", "musted"];
const NEG = ["didn't have to", "mustn't", "didn't had to", "don't have to"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [POS, "Yesterday I ______ stay late at work, {name}. My {who} asked me.", { who: ["boss", "manager", "director", "team leader"], name: NAME }],
  [POS, "When I was a child, I ______ help my mother in the {place}, {name}.", { place: ["kitchen", "garden", "shop", "yard"], name: NAME }],
  [POS, "The {bus} was late, so we ______ take a taxi, {name}.", { bus: ["bus", "train", "metro", "tram"], name: NAME }],
  [POS, "Last {day}, Aziz ______ get up at five o'clock, {name}.", { day: ["Monday", "Friday", "week", "Saturday"], name: NAME }],
  [POS, "My car broke down {when}, so I ______ walk home, {name}.", { when: ["yesterday", "last night", "on Friday", "last week"], name: NAME }],
  [POS, "At my old school, we ______ wear a {uniform}, {name}.", { uniform: ["uniform", "white shirt", "tie", "blue jacket"], name: NAME }],
  [POS, "The {shop} was closed, so she ______ come back the next day, {name}.", { shop: ["bank", "post office", "pharmacy", "bakery"], name: NAME }],
  [POS, "I lost my {thing} last week and ______ buy a new one, {name}.", { thing: ["phone", "key", "wallet", "umbrella"], name: NAME }],
  [POS, "We ______ wait two hours at the {place} yesterday, {name}.", { place: ["airport", "hospital", "bank", "post office"], name: NAME }],
  [POS, "At sports school, my grandfather ______ run {dist} every morning, {name}.", { dist: ["five kilometres", "ten kilometres", "three miles", "for an hour"], name: NAME }],
  [POS, "Timur was ill {when}, so he ______ stay in bed, {name}.", { when: ["last week", "on Monday", "yesterday", "all weekend"], name: NAME }],
  [POS, "It was raining, so the children ______ play inside the {place}, {name}.", { place: ["school", "house", "gym", "hall"], name: NAME }],
  [POS, "The {test} was hard. I ______ read the questions twice, {name}.", { test: ["exam", "test", "quiz", "driving test"], name: NAME }],
  [POS, "Olga ______ leave the {event} early because her baby was ill, {name}.", { event: ["party", "wedding", "meeting", "concert"], name: NAME }],
  [NEG, "Yesterday was {hol}, so I ______ go to work, {name}.", { hol: ["a holiday", "Navruz", "Sunday", "my day off"], name: NAME }],
  [NEG, "The {test} was easy. We ______ study much, {name}.", { test: ["exam", "test", "quiz", "homework"], name: NAME }],
  [NEG, "My uncle drove us, so we ______ take the {bus}, {name}.", { bus: ["bus", "train", "metro", "tram"], name: NAME }],
  [NEG, "The {museum} was free. We ______ pay, {name}.", { museum: ["museum", "concert", "park", "zoo"], name: NAME }],
  [NEG, "She ______ cook dinner last night. We ate at the {place}, {name}.", { place: ["café", "restaurant", "chaikhana", "wedding"], name: NAME }],
  [NEG, "I ______ wait long at the {place} {when}.", { place: ["bank", "doctor's", "post office", "bus stop"], when: ["this morning", "yesterday", "on Friday", "last week"] }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: o === NEG ? WHY_NOT : WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "It is the past. Complete with had to (or didn't have to) and the verb in brackets.";
// no source prints "to" or "had"
const BUILD = [
  ["stay", 0, "Yesterday I ______ (stay) late at work, {name}. My {who} asked me.", { who: ["boss", "manager", "director", "team leader"], name: NAME }],
  ["help", 0, "As a child, I ______ (help) my mother in the {place}, {name}.", { place: ["kitchen", "garden", "shop", "yard"], name: NAME }],
  ["take", 0, "The {bus} was late, so we ______ (take) a taxi, {name}.", { bus: ["bus", "train", "metro", "tram"], name: NAME }],
  ["get", 0, "Last {day}, Aziz ______ (get) up at five, {name}.", { day: ["Monday", "Friday", "week", "Saturday"], name: NAME }],
  ["walk", 0, "My car broke down {when}, so I ______ (walk) home, {name}.", { when: ["yesterday", "last night", "on Friday", "last week"], name: NAME }],
  ["wear", 0, "At my old school, we ______ (wear) a {uniform}, {name}.", { uniform: ["uniform", "white shirt", "tie", "blue jacket"], name: NAME }],
  ["come", 0, "The {shop} was closed, so she ______ (come) back the next day, {name}.", { shop: ["bank", "post office", "pharmacy", "bakery"], name: NAME }],
  ["buy", 0, "I lost my {thing}, so I ______ (buy) a new one, {name}.", { thing: ["phone", "key", "wallet", "umbrella"], name: NAME }],
  ["wait", 0, "We ______ (wait) two hours at the {place} yesterday, {name}.", { place: ["airport", "hospital", "bank", "post office"], name: NAME }],
  ["stay", 0, "Timur was ill {when}, so he ______ (stay) in bed, {name}.", { when: ["last week", "on Monday", "yesterday", "all weekend"], name: NAME }],
  ["play", 0, "It was raining, so the children ______ (play) inside the {place}, {name}.", { place: ["school", "house", "gym", "hall"], name: NAME }],
  ["leave", 0, "Olga ______ (leave) the {event} early. Her baby was ill, {name}.", { event: ["party", "wedding", "meeting", "concert"], name: NAME }],
  ["pay", 0, "Parking at the {place} wasn't free. We ______ (pay) ten thousand sum, {name}.", { place: ["airport", "hospital", "bazaar", "stadium"], name: NAME }],
  ["call", 0, "Nobody answered the door, so I ______ (call) my {who}, {name}.", { who: ["brother", "landlord", "neighbour", "sister"], name: NAME }],
  ["work", 1, "Yesterday was {hol}, so I ______ (not / work), {name}.", { hol: ["a holiday", "Navruz", "Sunday", "my day off"], name: NAME }],
  ["study", 1, "The {test} was easy. We ______ (not / study) much, {name}.", { test: ["exam", "test", "quiz", "homework"], name: NAME }],
  ["take", 1, "My uncle drove us, so we ______ (not / take) the {bus}, {name}.", { bus: ["bus", "train", "metro", "tram"], name: NAME }],
  ["pay", 1, "The {museum} was free. We ______ (not / pay), {name}.", { museum: ["museum", "concert", "park", "zoo"], name: NAME }],
  ["cook", 1, "She ______ (not / cook) last night. We ate at the {place}, {name}.", { place: ["café", "restaurant", "chaikhana", "wedding"], name: NAME }],
  ["wait", 1, "I ______ (not / wait) long at the {place} {when}.", { place: ["bank", "doctor's", "post office", "bus stop"], when: ["this morning", "yesterday", "on Friday", "last week"] }],
].map(([v, neg, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `${neg ? "didn't have" : "had"} to ${v}`, why: neg ? WHY_NOT : WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const NEC = "Rewrite with had to.";
const NOT = "Rewrite with didn't have to.";
// [instr, source, hint, verb, negative?, slots]
const TRANSFORM = [
  [FIX, "Yesterday I must stay late at the {place}, {name}.", "Yesterday I ______ late at the {place}, {name}.", "stay", 0, { place: ["office", "shop", "hospital", "bank"], name: NAME }],
  [FIX, "Last {day}, we must get up at five, {name}.", "Last {day}, we ______ up at five, {name}.", "get", 0, { day: ["Monday", "Friday", "week", "Saturday"], name: NAME }],
  [FIX, "When I was at school, I must wear a {uniform}, {name}.", "When I was at school, I ______ a {uniform}, {name}.", "wear", 0, { uniform: ["uniform", "white shirt", "tie", "blue jacket"], name: NAME }],
  [FIX, "The {bus} was late, so we must take a taxi, {name}.", "The {bus} was late, so we ______ a taxi, {name}.", "take", 0, { bus: ["bus", "train", "metro", "tram"], name: NAME }],
  [FIX, "She musted leave the {event} early, {name}.", "She ______ the {event} early, {name}.", "leave", 0, { event: ["party", "wedding", "meeting", "concert"], name: NAME }],
  [NEC, "At the {place}, they made us wait for hours, {name}.", "We ______ at the {place}, {name}.", "wait", 0, { place: ["airport", "hospital", "bank", "post office"], name: NAME }],
  [NEC, "The doctor told him to stay in bed {when}, {name}.", "He ______ in bed {when}, {name}.", "stay", 0, { when: ["last week", "on Monday", "yesterday", "all weekend"], name: NAME }],
  [NEC, "I needed to call the {who}, {name}. There was no other way.", "I ______ the {who}, {name}. There was no other way.", "call", 0, { who: ["doctor", "plumber", "landlord", "teacher"], name: NAME }],
  [NEC, "There were no taxis, so walking home from the {place} was necessary for them, {name}.", "There were no taxis, so they ______ home from the {place}, {name}.", "walk", 0, { place: ["station", "bazaar", "stadium", "party"], name: NAME }],
  [NEC, "Her boss made Olga work on {day}, {name}.", "Her boss said Olga ______ on {day}, {name}.", "work", 0, { day: ["Sunday", "Saturday", "Navruz", "her birthday"], name: NAME }],
  [NOT, "Paying at the {museum} wasn't necessary for me, {name}.", "I ______ at the {museum}, {name}.", "pay", 1, { museum: ["museum", "concert", "park", "zoo"], name: NAME }],
  [NOT, "There was no need for us to take the {bus}, {name}.", "We ______ the {bus}, {name}.", "take", 1, { bus: ["bus", "train", "metro", "tram"], name: NAME }],
  [NOT, "Cooking {when} wasn't necessary for her, {name}.", "She ______ {when}, {name}.", "cook", 1, { when: ["last night", "yesterday", "on Sunday", "at the weekend"], name: NAME }],
  [NOT, "He didn't need to wait long at the {place}, {name}.", "He ______ long at the {place}, {name}.", "wait", 1, { place: ["bank", "doctor's", "post office", "bus stop"], name: NAME }],
  [NOT, "The {test} was easy, so studying much wasn't necessary for them, {name}.", "The {test} was easy, so they ______ much, {name}.", "study", 1, { test: ["exam", "test", "quiz", "interview"], name: NAME }],
].map(([instr, source, hint, v, neg, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `${neg ? "didn't have" : "had"} to ${v}`, why: neg ? WHY_NOT : WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a rule at your old school. Use had to.", "We had to wear …", ["exactly one sentence", "had to + base verb", "past"]],
  ["Write one sentence about something you had to do yesterday.", "I had to …", ["exactly one sentence", "had to", "a past time word"]],
  ["Write one sentence about something that wasn't necessary last weekend. Use didn't have to.", "I didn't have to …", ["exactly one sentence", "didn't have to + base verb", "past"]],
  ["Write one question about the past with Did … have to …?", "Did you have to …?", ["exactly one question", "Did + have to", "a question mark"]],
  ["Write one sentence about a job a grandparent did. Use had to.", "He had to get up early", ["exactly one sentence", "had to", "past"]],
  ["Write one sentence with have to (now) and one with had to (the past).", "have to vs had to", ["exactly two sentences", "have to / has to", "had to"]],
  ["Write two sentences about a trip: one with had to, one with didn't have to.", "had to / didn't have to", ["exactly two sentences", "had to", "didn't have to"]],
  ["Write one sentence about a problem and what you had to do.", "…, so I had to …", ["exactly one sentence", "so", "had to"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your first school. Write three or four sentences about the rules. Use had to and didn't have to.", "had to / didn't have to", ["had to", "didn't have to", "three or four sentences"]],
  ["Describe a difficult day last week. Write three or four sentences about what you had to do.", "had to for past obligation", ["had to", "past simple", "three or four sentences"]],
  ["Ask a grandparent about life when they were young (in your mind). Write three or four sentences with had to.", "had to + base verb", ["had to", "didn't have to", "three or four sentences"]],
  ["Describe a trip that went wrong. Write three or four sentences with had to.", "had to for past problems", ["had to", "so", "three or four sentences"]],
  ["Compare your life now and five years ago. Write three or four sentences with have to and had to.", "have to vs had to", ["have to", "had to", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.semi-modals.have-to-past.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "\"Yesterday\" + \"My … asked me\": a past obligation: had to.",
   "\"When I was a child\": a past duty: had to.",
   "\"The … was late, so\": no choice then: had to.",
   "\"Last …\": a past obligation: had to.",
   "\"My car broke down … so\": no choice: had to walk.",
   "\"At my old school\": a past rule: had to.",
   "\"was closed, so\": no choice: had to come back.",
   "\"I lost my …\": it was necessary: had to buy.",
   "\"yesterday\": no choice but to wait: had to.",
   "\"At sports school … every morning\": a past rule: had to.",
   "\"was ill … so\": necessary: had to stay.",
   "\"It was raining, so\": no choice: had to play inside.",
   "\"The … was hard\": necessary to read twice: had to.",
   "\"because her baby was ill\": necessary: had to leave.",
   "A holiday: work was not necessary: didn't have to.",
   "\"was easy\": study was not necessary: didn't have to.",
   "\"My uncle drove us\": no need for the bus: didn't have to.",
   "\"was free\": no need to pay: didn't have to.",
   "\"We ate at the …\": no need to cook: didn't have to.",
   "No long wait was needed: didn't have to."
  ],
  "build": [
   "\"Yesterday … asked me\": had to stay.",
   "\"As a child\": had to help.",
   "\"late, so\": had to take.",
   "\"Last …\": had to get up.",
   "\"broke down … so\": had to walk.",
   "\"At my old school\": had to wear.",
   "\"was closed, so\": had to come.",
   "\"I lost my …, so\": had to buy.",
   "\"two hours … yesterday\": had to wait.",
   "\"was ill … so\": had to stay.",
   "\"It was raining, so\": had to play.",
   "\"Her baby was ill\": had to leave.",
   "\"wasn't free\": had to pay.",
   "\"Nobody answered the door, so\": had to call.",
   "A holiday yesterday: didn't have to work.",
   "\"was easy\": didn't have to study.",
   "\"My uncle drove us\": didn't have to take.",
   "\"was free\": didn't have to pay.",
   "\"We ate at the …\": didn't have to cook.",
   "No long wait: didn't have to wait."
  ],
  "transform": [
   "must has no past form: Yesterday → had to stay.",
   "Last … is past: had to get.",
   "At school (in the past): had to wear.",
   "In the past, so not must: had to take.",
   "No musted: the past is had to leave.",
   "They made us wait → we had to wait.",
   "The doctor told him to → he had to stay.",
   "needed to = had to: had to call.",
   "was necessary → had to walk.",
   "Her boss made her → she had to work.",
   "wasn't necessary → didn't have to pay.",
   "no need → didn't have to take.",
   "wasn't necessary → didn't have to cook.",
   "didn't need to = didn't have to wait.",
   "wasn't necessary → didn't have to study."
  ]
 }
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
