// Hand-authored: modals / deduction / might-present (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): might + base verb for an UNCERTAIN guess
// about the present (She isn't answering. She might be busy.).
// Triage: kept, B1 side of the A2 topic might-possibility (A2 = might / might not
// for a possibility, mostly future). Here the learner chooses the strength of a
// guess about NOW: every line says the speaker is not sure (I'm not sure / I don't
// know / or …), so must and can't are wrong. could and may are never offered.
// Choose: might / must / can't / mustn't.
// Build: might (+ not) and the verb in brackets; no source prints "might".
// Transform: 5 perhaps / maybe → might / 5 correct the mistake / 5 perhaps … -ing →
// might be -ing.
//
// Run: node tools/grammar-practice/authored/modals.deduction.might-present.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "deduction", topic: "might-present", level: "B1", pv: "2.5" };
const NAME = ["Feruza", "Otabek", "Dilnoza", "Sardor"]; // listener names: never printed in a sentence (audit 20 Nov)
const WHY = "The speaker is not sure: might + base verb (must = sure, can't = sure it is not true).";
const OPTS = ["might", "must", "can't", "mustn't"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["She isn't answering her phone. I'm not sure why, {name}. She ______ be busy at the {place}.", { place: ["office", "hospital", "bank", "school"], name: NAME }],
  ["I don't know where Timur is. He ______ be at the {place}, or at home, {name}.", { place: ["gym", "library", "bazaar", "café"], name: NAME }],
  ["The {shop} looks dark. I'm not sure, but it ______ be closed today, {name}.", { shop: ["bakery", "pharmacy", "post office", "bookshop"], name: NAME }],
  ["I don't know this man. He ______ be a new teacher, or a {who}, {name}.", { who: ["parent", "visitor", "driver", "doctor"], name: NAME }],
  ["Lola is very quiet in the {class} today. I don't know why. She ______ be tired, {name}.", { class: ["lesson", "meeting", "class", "group"], name: NAME }],
  ["Is that Aziz's {thing}? I'm not sure. It ______ be his brother's, {name}.", { thing: ["bike", "coat", "bag", "phone"], name: NAME }],
  ["The door of his {room} is closed. He ______ be asleep, but I'm not sure, {name}.", { room: ["room", "bedroom", "office", "flat"], name: NAME }],
  ["I can't see the {thing}. It ______ be in the car, or in the kitchen, {name}.", { thing: ["key", "shopping bag", "phone", "map"], name: NAME }],
  ["Olga isn't at the {event}. Nobody knows why. She ______ be ill, {name}.", { event: ["lesson", "meeting", "party", "match"], name: NAME }],
  ["I can hear a noise in the {room}. It ______ be the cat. I'm not sure, {name}.", { room: ["kitchen", "garden", "attic", "hall"], name: NAME }],
  ["Ask Madina about the {q}. I'm not sure, but she ______ know the answer, {name}.", { q: ["question", "puzzle", "riddle", "maths problem"], name: NAME }],
  ["There's a {car} outside. It ______ be our taxi, but I can't see the number, {name}.", { car: ["white car", "black car", "yellow car", "small car"], name: NAME }],
  ["I'm not sure who is calling. It ______ be my {who}, {name}.", { who: ["aunt", "uncle", "cousin", "boss"], name: NAME }],
  ["Nobody knows where the {pet} is. It ______ be under the bed, {name}.", { pet: ["cat", "kitten", "puppy", "rabbit"], name: NAME }],
  ["The man at the {place} looks very young. He ______ be a student. I don't know, {name}.", { place: ["front desk", "door", "counter", "bus stop"], name: NAME }],
  ["I don't know why the {bus} is late. There ______ be a lot of traffic, {name}.", { bus: ["bus", "train", "tram", "taxi"], name: NAME }],
  ["This {food} tastes strange. I'm not sure why. It ______ need more salt, {name}.", { food: ["soup", "plov", "sauce", "salad"], name: NAME }],
  ["Timur is laughing at his phone. I don't know why. He ______ be watching a funny {video}, {name}.", { video: ["video", "film", "cartoon", "show"], name: NAME }],
  ["I don't know where my {book} is. My sister ______ have it, {name}.", { book: ["dictionary", "notebook", "charger", "umbrella"], name: NAME }],
  ["The {who} isn't in her office. She ______ be at lunch. I'm not sure, {name}.", { who: ["director", "teacher", "manager", "doctor"], name: NAME }],
].map(([prompt, slots], i) => {
  const options = OPTS.map((_, j) => OPTS[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf("might"), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "The speaker is not sure. Complete with might (or might not) and the verb in brackets.";
const BUILD = [
  ["might be", "I don't know where Aziz is. He ______ (be) at the {place}, {name}.", { place: ["gym", "library", "bazaar", "café"], name: NAME }],
  ["might be", "The {shop} looks dark. It ______ (be) closed today, {name}.", { shop: ["bakery", "pharmacy", "post office", "bookshop"], name: NAME }],
  ["might know", "Ask Olga about the {q}. She ______ (know) the answer, {name}.", { q: ["question", "test", "homework", "timetable"], name: NAME }],
  ["might be", "I'm not sure who that is at the {place}. It ______ (be) our new neighbour, {name}.", { place: ["door", "gate", "window", "bus stop"], name: NAME }],
  ["might need", "Your {plant} looks dry. It ______ (need) more water, {name}.", { plant: ["plant", "tree", "flower", "garden"], name: NAME }],
  ["might have", "I can't find my {book}. My brother ______ (have) it, {name}.", { book: ["dictionary", "notebook", "charger", "umbrella"], name: NAME }],
  ["might be", "The {bus} is late. There ______ (be) a lot of traffic, {name}.", { bus: ["bus", "train", "tram", "taxi"], name: NAME }],
  ["might like", "Buy her a {gift}. I'm not sure, but she ______ (like) it, {name}.", { gift: ["book", "scarf", "cake", "plant"], name: NAME }],
  ["might be", "Lola isn't at the {event}. She ______ (be) ill, {name}.", { event: ["lesson", "meeting", "party", "match"], name: NAME }],
  ["might be", "That noise in the {room} ______ (be) the cat, {name}.", { room: ["kitchen", "garden", "attic", "hall"], name: NAME }],
  ["might not be", "Call before you go to the {shop}. It ______ (not / be) open today, {name}.", { shop: ["bank", "pharmacy", "post office", "museum"], name: NAME }],
  ["might not know", "Don't ask Timur about the {topic}. He ______ (not / know), {name}.", { topic: ["test", "party", "plan", "prices"], name: NAME }],
  ["might not be", "Take some food to the {place}. There ______ (not / be) a café there, {name}.", { place: ["mountains", "lake", "beach", "village"], name: NAME }],
  ["might not have", "Bring your own {thing}. The hotel ______ (not / have) one, {name}.", { thing: ["towel", "hairdryer", "charger", "umbrella"], name: NAME }],
  ["might not be", "Don't wait for Madina at the {place}. She ______ (not / be) free today, {name}.", { place: ["station", "gate", "café", "library"], name: NAME }],
  ["might be", "The {who} isn't in her office. She ______ (be) at lunch, {name}.", { who: ["director", "teacher", "manager", "doctor"], name: NAME }],
  ["might want", "Ask your {who} first. He ______ (want) to come too, {name}.", { who: ["brother", "cousin", "father", "friend"], name: NAME }],
  ["might be", "Your {thing} is very quiet. The battery ______ (be) dead, {name}.", { thing: ["phone", "radio", "speaker", "tablet"], name: NAME }],
  ["might live", "That family from the {place} ______ (live) near us. I'm not sure, {name}.", { place: ["wedding", "party", "school", "bazaar"], name: NAME }],
  ["might be", "Timur is laughing at his {thing}. He ______ (be) watching a funny video, {name}.", { thing: ["phone", "laptop", "tablet", "TV"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PERH = "Rewrite with might (or might not).";
const FIX = "Correct the mistake.";
const ING = "Rewrite with might be + -ing.";
const WHY_ING = "A guess, not sure, about something happening now: might be + -ing.";
const TRANSFORM = [
  [PERH, "Perhaps she is busy at the {place}, {name}.", "She ______ busy at the {place}, {name}.", "might be", { place: ["office", "hospital", "bank", "school"], name: NAME }],
  [PERH, "Maybe he knows the way to the {place}, {name}.", "He ______ the way to the {place}, {name}.", "might know", { place: ["station", "museum", "stadium", "hotel"], name: NAME }],
  [PERH, "Perhaps the {shop} is closed, {name}.", "The {shop} ______ closed, {name}.", "might be", { shop: ["bakery", "pharmacy", "post office", "bookshop"], name: NAME }],
  [PERH, "Maybe your {thing} is in the car, {name}.", "Your {thing} ______ in the car, {name}.", "might be", { thing: ["phone", "bag", "key", "wallet"], name: NAME }],
  [PERH, "Perhaps it isn't true, {name}. Ask the {who}.", "It ______ true, {name}. Ask the {who}.", "might not be", { who: ["teacher", "boss", "director", "coach"], name: NAME }],
  [FIX, "She might to be at the {place}, {name}.", "She ______ at the {place}, {name}.", "might be", { place: ["gym", "library", "bazaar", "café"], name: NAME }],
  [FIX, "He might is ill. He isn't at the {event}, {name}.", "He ______ ill. He isn't at the {event}, {name}.", "might be", { event: ["lesson", "meeting", "party", "match"], name: NAME }],
  [FIX, "It mights be the cat in the {room}, {name}.", "It ______ the cat in the {room}, {name}.", "might be", { room: ["kitchen", "garden", "attic", "hall"], name: NAME }],
  [FIX, "They might knowing the answer to the {q}, {name}.", "They ______ the answer to the {q}, {name}.", "might know", { q: ["question", "puzzle", "riddle", "maths problem"], name: NAME }],
  [FIX, "She doesn't might be at home. Her {car} isn't outside, {name}.", "She ______ at home. Her {car} isn't outside, {name}.", "might not be", { car: ["car", "bike", "scooter", "van"], name: NAME }],
  [ING, "Perhaps he is sleeping. The {room} is quiet, {name}.", "He ______. The {room} is quiet, {name}.", "might be sleeping", { room: ["flat", "bedroom", "house", "tent"], name: NAME }],
  [ING, "Maybe she is working late at the {place}, {name}.", "She ______ late at the {place}, {name}.", "might be working", { place: ["hospital", "bank", "school", "shop"], name: NAME }],
  [ING, "Perhaps they are waiting for us at the {place}, {name}.", "They ______ for us at the {place}, {name}.", "might be waiting", { place: ["station", "gate", "café", "bus stop"], name: NAME }],
  [ING, "Maybe it is raining in {city} now, {name}.", "It ______ in {city} now, {name}.", "might be raining", { city: ["London", "Moscow", "Tashkent", "Fergana"], name: NAME }],
  [ING, "Perhaps he is driving to {city}, so he can't answer, {name}.", "He ______ to {city}, so he can't answer, {name}.", "might be driving", { city: ["Samarkand", "Bukhara", "Namangan", "Khiva"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: instr === ING ? WHY_ING : WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your friend is late and isn't answering. Write one sentence with might.", "might be …", ["exactly one sentence", "might + base verb", "a guess about now"]],
  ["You can't find your keys. Write one sentence about where they might be.", "They might be …", ["exactly one sentence", "might be", "a place"]],
  ["Someone is at the door. Write one sentence guessing who it is. Use might.", "It might be …", ["exactly one sentence", "might", "not sure"]],
  ["Write one sentence with might not about a shop or a café.", "might not be open", ["exactly one sentence", "might not + base verb", "present"]],
  ["Your neighbour is very happy today. Write one sentence with might be + -ing or might + verb.", "might be / might have", ["exactly one sentence", "might", "a reason"]],
  ["Write one sentence with must and one with might about the same person.", "must vs might", ["exactly two sentences", "must = sure", "might = not sure"]],
  ["Write one sentence with might be + -ing about what a friend is doing now.", "might be + -ing", ["exactly one sentence", "might be + -ing", "now"]],
  ["Your teacher isn't in class. Write one sentence guessing why. Use might.", "She might be ill / busy", ["exactly one sentence", "might", "a guess"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["A friend didn't come to a party. Write three or four sentences guessing why. Use might and might not.", "might / might not for present guesses", ["might", "might not", "three or four sentences"]],
  ["Look at a stranger in a café (in your mind). Write three or four guesses about him or her. Use might.", "might + base verb", ["might", "might be + -ing", "three or four sentences"]],
  ["Your phone is ringing and you don't know the number. Write three or four sentences: who might it be?", "It might be …", ["might", "different guesses", "three or four sentences"]],
  ["Write three or four sentences about a lost pet. Where might it be?", "might be + place", ["might", "might not", "three or four sentences"]],
  ["Write three or four sentences comparing guesses: one with must, one with might, one with can't.", "must / might / can't", ["must", "might", "can't"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.deduction.might-present.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "\"I'm not sure why\": only a possible reason: might.",
   "\"or at home\": two possibilities: might.",
   "\"I'm not sure, but\": a possibility: might.",
   "\"or a …\": he could be one of two things: might.",
   "\"I don't know why\": one possible reason: might.",
   "\"I'm not sure\": it could be his brother's: might.",
   "\"but I'm not sure\": a guess, not certain: might.",
   "\"or in the kitchen\": two possible places: might.",
   "\"Nobody knows why\": a possible reason: might.",
   "\"I'm not sure\": the cat is one possibility: might.",
   "\"I'm not sure, but\": she possibly knows: might.",
   "\"I can't see the number\": only possible: might.",
   "\"I'm not sure who\": a possibility: might.",
   "\"Nobody knows where\": one possible place: might.",
   "\"I don't know\": a student is one possibility: might.",
   "\"I don't know why\": traffic is a possible reason: might.",
   "\"I'm not sure why\": a possible reason: might.",
   "\"I don't know why\": a possible reason: might be watching.",
   "Not sure where it is: maybe she has it: might.",
   "\"I'm not sure\": lunch is one possibility: might."
  ],
  "build": [
   "\"I don't know where\": a possibility: might be.",
   "\"looks dark\": possibly closed: might be.",
   "She possibly knows: might know.",
   "\"I'm not sure who\": might be.",
   "\"looks dry\": possibly needs water: might need.",
   "\"I can't find\": maybe he has it: might have.",
   "A possible reason for the delay: might be.",
   "\"I'm not sure, but\": might like.",
   "Possibly ill: might be.",
   "The cat is one possibility: might be.",
   "\"Call before you go\": possibly not open: might not be.",
   "\"Don't ask\": possibly he doesn't know: might not know.",
   "\"Take some food\": possibly no café: might not be.",
   "\"Bring your own\": possibly they don't have one: might not have.",
   "\"Don't wait\": possibly not free: might not be.",
   "Lunch is one possibility: might be.",
   "\"Ask … first\": possibly he wants to come: might want.",
   "\"very quiet\": possibly a dead battery: might be.",
   "\"I'm not sure\": might live.",
   "A possible reason for the laughing: might be watching."
  ],
  "transform": [
   "Perhaps she is → she might be.",
   "Maybe he knows → he might know.",
   "Perhaps it is → it might be.",
   "Maybe it is → it might be.",
   "Perhaps it isn't → it might not be.",
   "might + base verb, no to: might be.",
   "might + base verb, not is: might be.",
   "might never takes -s: might be.",
   "might + base verb, not -ing: might know.",
   "Negative: might not, never doesn't might.",
   "Perhaps he is sleeping now → might be sleeping.",
   "Maybe she is working now → might be working.",
   "Perhaps they are waiting now → might be waiting.",
   "Maybe it is raining now → might be raining.",
   "Perhaps he is driving now → might be driving."
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
