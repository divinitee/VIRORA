// Hand-authored: reported-speech / statements / say-tell (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): TELL needs a person after it (told me / told
// us / told her), SAY does not (said that …, said hello). "said me" and "told to
// me" are the errors (Uzbek / Russian "menga aytdi / сказал мне").
// Triage: kept. tell + object + to-infinitive (told me to wait) is the sibling
// tell-sb-to and is not used here.
// One right answer: "said to me" is English, so "said to" is never offered; every
// told line has a person straight after the gap, every said line has none.
// Choose: 10 said / told / said me / told to; 10 told / said / told to / talked
// (2 base forms: say / tell).
// Build: "Write said or told" (or say / tell).
// Transform: 5 correct the mistake / 5 said to me → told me / 5 told me → said.
//
// Run: node tools/grammar-practice/authored/reported-speech.statements.say-tell.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "reported-speech", branch: "statements", topic: "say-tell", level: "B1", pv: "2.5" };
const M = ["Aziz", "Timur", "Bekzod", "Rustam"];
const F = ["Olga", "Lola", "Madina", "Sevara"];
const WHY_S = "No person after the verb: say (said that …, said hello).";
const WHY_T = "A person comes straight after the verb: tell (told me, told us, told her).";
const S = ["said", "told", "said me", "told to"];
const S0 = ["say", "tell", "say me", "tell to"];
const T = ["told", "said", "told to", "talked"];
const T0 = ["tell", "say", "tell to", "talk"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [S, "{m} ______ that the {event} had been cancelled.", { m: M, event: ["match", "concert", "meeting", "trip"] }],
  [S, "{f} ______ she was tired after the {trip}.", { f: F, trip: ["flight", "walk", "match", "exam"] }],
  [S, "The {who} ______ that the {shop} was closed.", { who: ["man", "guard", "woman", "driver"], shop: ["bank", "museum", "pharmacy", "post office"] }],
  [S, "My {who} ______ it would rain {when}.", { who: ["dad", "mum", "uncle", "grandma"], when: ["that night", "at the weekend", "the next day", "in the afternoon"] }],
  [S, "{m} ______, 'I'm hungry,' and opened the {thing}.", { m: M, thing: ["fridge", "bag", "box", "cupboard"] }],
  [S, "Everyone ______ the {food} was delicious, {m}.", { food: ["plov", "cake", "soup", "bread"], m: M }],
  [S, "The teacher ______ that we had a test on {day}, {f}.", { day: ["Monday", "Friday", "Tuesday", "Thursday"], f: F }],
  [S, "{f} ______ hello and sat down next to me on the {place}.", { f: F, place: ["bus", "bench", "plane", "train"] }],
  [S0, "What did the {who} ______ about the {thing}?", { who: ["doctor", "teacher", "boss", "mechanic"], thing: ["test", "results", "car", "plan"] }],
  [S, "{m} ______ goodbye and left the {place}.", { m: M, place: ["party", "office", "room", "café"] }],
  [T, "{f} ______ me that she was moving to {city}.", { f: F, city: ["Tashkent", "Moscow", "Seoul", "Istanbul"] }],
  [T, "{m} ______ us a funny story about his {who}.", { m: M, who: ["grandfather", "dog", "teacher", "boss"] }],
  [T, "The doctor ______ my {who} that he was fine, {f}.", { who: ["dad", "brother", "uncle", "grandpa"], f: F }],
  [T, "Who ______ you about the {event}, {m}?", { event: ["party", "wedding", "test", "trip"], m: M }],
  [T, "{f} ______ her {who} the truth.", { f: F, who: ["mother", "boss", "teacher", "friend"] }],
  [T, "My {who} ______ me a secret {when}.", { who: ["sister", "friend", "cousin", "brother"], when: ["yesterday", "last night", "at school", "at the party"] }],
  [T, "The {who} ______ the children a {story} before bed.", { who: ["teacher", "grandmother", "nanny", "mother"], story: ["story", "fairy tale", "joke", "legend"] }],
  [T, "{m} ______ me he would be late for the {event}.", { m: M, event: ["meeting", "lesson", "match", "dinner"] }],
  [T0, "Did you ______ {who} about the party, {f}?", { who: ["Timur", "your mum", "the teacher", "everyone"], f: F }],
  [T, "I ______ him the way to the {place}, {m}.", { place: ["station", "museum", "bazaar", "hotel"], m: M }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: o === S || o === S0 ? WHY_S : WHY_T, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write said or told (or say / tell).";
const BUILD = [
  ["said", "{m} ______ that he was busy on {day}.", { m: M, day: ["Monday", "Friday", "Saturday", "Sunday"] }],
  ["said", "{f} ______ the {thing} was too expensive.", { f: F, thing: ["dress", "phone", "hotel", "car"] }],
  ["said", "The {who} ______ that the {bus} was late.", { who: ["driver", "guard", "woman", "man"], bus: ["train", "bus", "plane", "ferry"] }],
  ["said", "My {who} ______ the {plan} was a good idea.", { who: ["dad", "mum", "uncle", "grandma"], plan: ["trip", "party", "plan", "game"] }],
  ["said", "Everyone ______ the {event} was great, {m}.", { event: ["wedding", "concert", "party", "match"], m: M }],
  ["said", "{m} ______ sorry and helped me with the {thing}.", { m: M, thing: ["bags", "boxes", "chairs", "books"] }],
  ["said", "{f} ______ she liked {food}.", { f: F, food: ["plov", "fish", "soup", "cake"] }],
  ["said", "The {who} ______, 'Please sit down, {m}.'", { who: ["teacher", "doctor", "manager", "waiter"], m: M }],
  ["say", "What did {f} ______ about the {thing}?", { f: F, thing: ["test", "film", "trip", "food"] }],
  ["said", "Nobody ______ anything about the {event}, {m}.", { event: ["party", "test", "meeting", "change"], m: M }],
  ["told", "{f} ______ me she was moving to {city}.", { f: F, city: ["Tashkent", "Moscow", "Seoul", "Istanbul"] }],
  ["told", "{m} ______ us about his trip to {city}.", { m: M, city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  ["told", "My {who} ______ me a funny joke at the {event}.", { who: ["sister", "friend", "cousin", "brother"], event: ["party", "wedding", "dinner", "match"] }],
  ["told", "Who ______ you about the {event}, {m}?", { event: ["party", "wedding", "test", "trip"], m: M }],
  ["told", "{f} ______ her {who} the truth.", { f: F, who: ["mother", "boss", "teacher", "friend"] }],
  ["told", "The {who} ______ the class a story about the {topic}.", { who: ["teacher", "guide", "writer", "visitor"], topic: ["sea", "mountains", "old city", "desert"] }],
  ["tell", "Did you ______ {who} the news, {f}?", { who: ["Timur", "your mum", "the teacher", "everyone"], f: F }],
  ["told", "{m} ______ me he would be late for the {event}.", { m: M, event: ["meeting", "lesson", "match", "dinner"] }],
  ["told", "I ______ the {who} my name and address, {f}.", { who: ["receptionist", "nurse", "teacher", "manager"], f: F }],
  ["tell", "Please ______ me the time of the {event}, {m}.", { event: ["match", "film", "concert", "meeting"], m: M }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: key.startsWith("s") ? WHY_S : WHY_T, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const TOLD = "Rewrite with told.";
const SAID = "Rewrite with said.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [FIX, "{f} said me that she was tired after the {trip}.", "{f} ______ me that she was tired after the {trip}.", "told", { f: F, trip: ["flight", "walk", "match", "exam"] }],
  [FIX, "{m} told that he was busy on {day}.", "{m} ______ that he was busy on {day}.", "said", { m: M, day: ["Monday", "Friday", "Saturday", "Sunday"] }],
  [FIX, "The {who} said us a story about the {topic}.", "The {who} ______ us a story about the {topic}.", "told", { who: ["teacher", "guide", "writer", "visitor"], topic: ["sea", "mountains", "old city", "desert"] }],
  [FIX, "{f} told to me the truth about the {thing}.", "{f} ______ me the truth about the {thing}.", "told", { f: F, thing: ["party", "money", "test", "accident"] }],
  [FIX, "My {who} told it was going to rain {when}.", "My {who} ______ it was going to rain {when}.", "said", { who: ["dad", "mum", "uncle", "grandma"], when: ["that night", "at the weekend", "the next day", "in the afternoon"] }],
  [TOLD, "{m} said to me that he was hungry after the {event}.", "{m} ______ that he was hungry after the {event}.", "told me", { m: M, event: ["match", "lesson", "walk", "trip"] }],
  [TOLD, "{f} said to us that the {event} was at six.", "{f} ______ that the {event} was at six.", "told us", { f: F, event: ["concert", "meeting", "match", "party"] }],
  [TOLD, "The {who} said to the students that the test was easy.", "The {who} ______ the students that the test was easy.", "told", { who: ["teacher", "director", "tutor", "assistant"], x: [] }],
  [TOLD, "{m} said to his {who} that he was sorry.", "{m} ______ his {who} that he was sorry.", "told", { m: M, who: ["mother", "boss", "teacher", "friend"] }],
  [TOLD, "My {who} said to me, 'Dinner is ready, {m}.'", "My {who} ______ that dinner was ready.", "told me", { who: ["mother", "father", "aunt", "grandmother"], m: M }],
  [SAID, "{m} told me that he was tired after the {event}.", "{m} ______ that he was tired after the {event}.", "said", { m: M, event: ["match", "lesson", "walk", "trip"] }],
  [SAID, "{f} told us that the {place} was closed.", "{f} ______ that the {place} was closed.", "said", { f: F, place: ["bank", "museum", "pharmacy", "post office"] }],
  [SAID, "The {who} told me the {thing} was ready.", "The {who} ______ the {thing} was ready.", "said", { who: ["waiter", "mechanic", "tailor", "baker"], thing: ["table", "car", "suit", "bread"] }],
  [SAID, "{m} told everyone at the {event} that he was getting married.", "At the {event}, {m} ______ that he was getting married.", "said", { m: M, event: ["party", "dinner", "meeting", "wedding"] }],
  [SAID, "{f} told her {who} that she was sorry.", "{f} ______ that she was sorry.", "said", { f: F, who: ["mother", "boss", "teacher", "friend"] }],
].map(([instr, source, hint, key, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: key.startsWith("s") ? WHY_S : WHY_T, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with said that.", "… said that …", ["exactly one sentence", "said", "no person after said"]],
  ["Write one sentence with told me.", "… told me (that) …", ["exactly one sentence", "told + person", "past"]],
  ["Write one sentence about a story someone told you.", "… told me a story about …", ["exactly one sentence", "told", "a person after told"]],
  ["Write two sentences about the same news: one with said, one with told.", "said vs told", ["exactly two sentences", "said that", "told + person"]],
  ["Write one question with tell.", "Did you tell …?", ["exactly one question", "tell + person", "a question mark"]],
  ["Write one sentence with said hello or said goodbye.", "said hello / goodbye", ["exactly one sentence", "said", "hello or goodbye"]],
  ["Write one sentence with told the truth or told a lie.", "told the truth / a lie", ["exactly one sentence", "told", "the truth / a lie"]],
  ["Write one sentence about what a doctor or teacher said.", "… said (that) …", ["exactly one sentence", "said", "reported speech"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Report a conversation with a friend. Write three or four sentences with said and told.", "said vs told", ["said", "told + person", "three or four sentences"]],
  ["What did your teacher say and tell your class this week? Write three or four sentences.", "say / tell in reported speech", ["said", "told us", "three or four sentences"]],
  ["Report the news a family member told you. Write three or four sentences.", "told me / said", ["told me", "said", "three or four sentences"]],
  ["Write three or four sentences about a time someone told you a secret.", "told + person", ["told", "said", "three or four sentences"]],
  ["A tourist asked you for help. Report what he said and what you told him. Write three or four sentences.", "said / told", ["he said", "I told him", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/reported-speech.statements.say-tell.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "No listener after the gap, just that: said.",
   "No listener after the gap: said she was tired.",
   "No listener, just that: said.",
   "No listener, just it would rain: said.",
   "Before the exact words 'I'm hungry': said.",
   "No listener after the gap: said the … was.",
   "No listener, just that: said.",
   "Fixed phrase say hello: said hello.",
   "After did, base form, no listener: say.",
   "Fixed phrase say goodbye: said goodbye.",
   "A listener (me) after the gap: told me.",
   "tell a story: told us a story.",
   "A listener (my …) after the gap: told.",
   "A listener (you) after the gap: told you.",
   "Fixed phrase tell the truth: told.",
   "tell a secret, with a listener (me): told.",
   "tell a story, with a listener (the children): told.",
   "A listener (me) after the gap: told me.",
   "After did, base form, a listener follows: tell.",
   "tell someone the way: told him the way."
  ],
  "build": [
   "No person after the gap, just that: said.",
   "No person after the gap: said the … was.",
   "No person, just that: said.",
   "No person after the gap: said the … was.",
   "No person after the gap: everyone said.",
   "Fixed phrase say sorry: said.",
   "No person after the gap: said she liked.",
   "Before exact words in quotes: said.",
   "After did, base form, no person: say.",
   "say anything, no person: said.",
   "A person (me) after the gap: told.",
   "tell someone about something: told us about.",
   "tell a joke, with a person (me): told.",
   "A person (you) after the gap: told.",
   "Fixed phrase tell the truth: told.",
   "tell a story to the class: told.",
   "After did, base form, a person follows: tell.",
   "A person (me) after the gap: told.",
   "tell someone your name: told.",
   "Please + base form, a person follows: tell."
  ],
  "transform": [
   "say has no listener after it: told me.",
   "tell needs a listener: said that.",
   "A story with us: told us a story.",
   "tell + person, no to: told me.",
   "No listener after the gap: said.",
   "said to me = told me.",
   "said to us = told us.",
   "said to the students = told the students.",
   "said to his … = told his ….",
   "said to me = told me.",
   "Remove the listener: said.",
   "Remove us: said.",
   "Remove me: said.",
   "No listener now: said.",
   "Remove her …: said."
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
