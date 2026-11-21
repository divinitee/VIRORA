// Hand-authored: sentence-structure / word-order / indirect-object-to (B1).
// Wave C, C12 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: S + V + direct object + to / for + person ("She sent the
// report to the manager"). Sibling double-object (A2) tests "gave my sister a
// present"; this topic keeps to the to / for pattern only:
//   - explain / describe / say / suggest / introduce take ONLY to + person
//     ("explain it to me", never "explain me it": the Russian "объясни мне"
//     / Uzbek "menga tushuntir" calque);
//   - a pronoun object goes before to / for ("lent it to him");
//   - to for give / lend / pass / show / hand; for for buy / cook / make /
//     find / carry / book.
// Choose: 6 explain-type frames, 2 pronoun frames, 6 to gaps, 6 for gaps.
// Never offered as wrong: "gave her it" / "send them you" (disputed), "for"
// after send / write / sell / read / suggest (on someone's behalf is right),
// "open the door to", "get it to me". Gap distractors: to / for / at / with / –.
// Build: "Write to or for." Transform: 5 double object → pronoun + to / for
// (two gaps) / 5 correct "explain me" order / 5 correct to ↔ for.
//
// Run: node tools/grammar-practice/authored/sentence-structure.word-order.indirect-object-to.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "word-order", topic: "indirect-object-to", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAMEF = ["Olga", "Lola", "Madina", "Kamila"];
const NAMEM = ["Aziz", "Timur", "Bekzod", "Rustam"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const EVENT = ["party", "wedding", "concert", "meeting"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const WX = "Explain, describe, say, suggest and introduce never take the person straight after the verb: the thing first, then to + person.";
const WP = "With it / them as the object: verb + it / them + to (or for) + person.";
const WT = "Give, lend, pass, show and hand: the thing, then to + the person who gets it.";
const WF = "Buy, cook, make, find, carry and book: the thing, then for + the person it helps.";
const frame = (v, dobj, io) => [`${v} ${dobj} to ${io}`, `${v} ${io} ${dobj}`, `${v} ${dobj} ${io}`, `${v} for ${io} ${dobj}`];
const pron = (v, it, io) => [`${v} ${it} to ${io}`, `${v} to ${io} ${it}`, `${v} ${it} at ${io}`, `${v} at ${io} ${it}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [WX, frame("explained", "the rule", "us"), "The {who} ______ again, {name}.", { who: ["teacher", "coach", "tutor", "trainer"], name: NAME }],
  [WX, frame("described", "the hotel", "me"), "{name} ______ {when}. It sounds lovely.", { name: NAME, when: PAST }],
  [WX, frame("explain", "this word", "me"), "Can you ______, {name}? I don't understand the {thing}.", { name: NAME, thing: ["text", "story", "question", "song"] }],
  [WX, frame("introduced", "his friend", "me"), "My brother ______ at the {event}, {name}.", { event: EVENT, name: NAME }],
  [WX, frame("said", "goodbye", "everyone"), "She ______ before the {event} ended, {name}.", { event: EVENT, name: NAME }],
  [WX, frame("suggested", "a dish", "us"), "The waiter ______, {name}. It was {adj}.", { name: NAME, adj: ["delicious", "very spicy", "great", "too salty"] }],
  [WP, pron("lent", "it", "him"), "{name} needed a {thing}, so I ______.", { name: NAMEM, thing: ["pen", "bike", "laptop", "jacket"] }],
  [WP, pron("showed", "them", "her"), "My grandma wanted to see the {photo}, so I ______, {name}.", { photo: ["photos", "pictures", "videos", "drawings"], name: NAME }],
  [WT, ["to", "at", "with", "–"], "Can you pass the {thing} ______ me, {name}?", { thing: ["salt", "bread", "water", "sugar"], name: NAME }],
  [WT, ["to", "at", "with", "–"], "I lent my {thing} ______ {name} last week.", { thing: ["bike", "camera", "laptop", "tent"], name: NAME }],
  [WT, ["to", "at", "with", "–"], "She showed her {photos} ______ the whole class, {name}.", { photos: ["photos", "drawings", "stamps", "medals"], name: NAME }],
  [WT, ["to", "at", "with", "–"], "Please give this {thing} ______ your teacher, {name}.", { thing: ["letter", "note", "book", "form"], name: NAME }],
  [WT, ["to", "at", "with", "–"], "Mum handed the {thing} ______ the waiter, {name}.", { thing: ["money", "menu", "card", "plates"], name: NAME }],
  [WX, ["to", "at", "with", "–"], "Grandpa explained the rules of {game} ______ the children, {name}.", { game: ["chess", "backgammon", "the game", "football"], name: NAME }],
  [WF, ["for", "to", "at", "–"], "I bought a {thing} ______ my mum, {name}.", { thing: ["scarf", "cake", "bag", "plant"], name: NAME }],
  [WF, ["for", "to", "at", "–"], "Dad cooked {food} ______ all of us {when}.", { food: ["plov", "soup", "dinner", "breakfast"], when: PAST }],
  [WF, ["for", "to", "at", "–"], "{name} made a {cake} ______ her grandmother.", { name: NAMEF, cake: ["cake", "card", "scarf", "pie"] }],
  [WF, ["for", "to", "at", "–"], "Can you find a seat ______ my grandmother, {name}? She's {age}.", { name: NAME, age: ["eighty", "ninety", "very old", "tired"] }],
  [WF, ["for", "to", "at", "–"], "My aunt booked a room ______ us at the {place}, {name}.", { place: ["hotel", "guesthouse", "hostel", "resort"], name: NAME }],
  [WF, ["for", "to", "at", "–"], "I'll keep a seat ______ you, {name}. The {event} starts at {time}.", { name: NAME, event: ["film", "concert", "match", "show"], time: ["six", "seven", "eight", "nine"] }],
].map(([why, opts, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write to or for.";
const BUILD = [
  ["to", WT, "Please lend your {thing} ______ me {when}, {name}.", { thing: ["notes", "pen", "umbrella", "charger"], when: ["today", "tonight", "for a day", "now"], name: NAME }],
  ["to", WX, "I explained the problem ______ my {who}, {name}.", { who: ["boss", "teacher", "parents", "neighbour"], name: NAME }],
  ["to", WX, "She described her new {place} ______ us, {name}.", { place: ["flat", "school", "office", "village"], name: NAME }],
  ["to", WT, "Pass this {thing} ______ the person on your left, {name}.", { thing: ["paper", "list", "book", "plate"], name: NAME }],
  ["to", WX, "{name} said sorry ______ his {who}.", { name: NAMEM, who: ["brother", "teacher", "neighbour", "friend"] }],
  ["to", WT, "Show your {thing} ______ the driver, {name}.", { thing: ["ticket", "pass", "card", "passport"], name: NAME }],
  ["to", WX, "I introduced my cousin ______ my friends at the {event}, {name}.", { event: EVENT, name: NAME }],
  ["to", WT, "He lent his {thing} ______ me {when}.", { thing: ["car", "bike", "camera", "laptop"], when: PAST }],
  ["to", WT, "Pass the {thing} ______ {name}, please!", { thing: ["ball", "salt", "bread", "pen"], name: NAME }],
  ["to", WT, "Mum handed the {thing} ______ the waiter, {name}.", { thing: ["money", "menu", "card", "plates"], name: NAME }],
  ["for", WF, "I bought a {thing} ______ my little sister, {name}.", { thing: ["doll", "book", "kite", "ball"], name: NAME }],
  ["for", WF, "Dad cooked {food} ______ the guests {when}.", { food: ["plov", "soup", "dinner", "shashlik"], when: PAST }],
  ["for", WF, "{name} made a {card} ______ her teacher.", { name: NAMEF, card: ["card", "cake", "poster", "scarf"] }],
  ["for", WF, "Can you open the {thing} ______ me, {name}?", { thing: ["jar", "bottle", "box", "tin"], name: NAME }],
  ["for", WF, "I'll carry your {thing} ______ you, {name}.", { thing: ["bag", "suitcase", "box", "books"], name: NAME }],
  ["for", WF, "My aunt found a good {who} ______ us, {name}.", { who: ["doctor", "flat", "tutor", "school"], name: NAME }],
  ["for", WF, "Could you hold this {thing} ______ me, {name}? My hands are full.", { thing: ["bag", "box", "coat", "umbrella"], name: NAME }],
  ["for", WF, "We booked a table ______ {n} people at the {place}.", { n: ["six", "eight", "ten", "twelve"], place: ["restaurant", "café", "hotel", "chaikhana"] }],
  ["for", WF, "Can you buy some {thing} ______ Grandma, {name}?", { thing: ["bread", "milk", "fruit", "medicine"], name: NAME }],
  ["for", WF, "I'll save a seat ______ you at the {event}, {name}.", { event: ["concert", "match", "show", "meeting"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PR = "Rewrite with it or them and to or for.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // double object -> pronoun + to / for (5)
  [PR, "I gave my sister the {thing}, {name}.", "I gave ______ ______ my sister, {name}.", ["it", "to"], WP, { thing: ["scarf", "book", "bag", "watch"], name: NAME }],
  [PR, "Dad bought Mum the {thing}, {name}.", "Dad bought ______ ______ Mum, {name}.", ["them", "for"], WP, { thing: ["flowers", "tickets", "shoes", "earrings"], name: NAME }],
  [PR, "Can you show me the {thing}, {name}?", "Can you show ______ ______ me, {name}?", ["them", "to"], WP, { thing: ["photos", "pictures", "videos", "drawings"], name: NAME }],
  [PR, "{name} made her brother the {thing}.", "{name} made ______ ______ her brother.", ["it", "for"], WP, { name: NAMEF, thing: ["cake", "pie", "card", "kite"] }],
  [PR, "Please send your teacher the {thing}, {name}.", "Please send ______ ______ your teacher, {name}.", ["it", "to"], WP, { thing: ["file", "essay", "photo", "form"], name: NAME }],
  // explain me -> explain it to me (5)
  [COR, "Can you explain me the {thing}, {name}?", "Can you explain the {thing} ______, {name}?", "to me", WX, { thing: ["rule", "homework", "plan", "problem"], name: NAME }, []],
  [COR, "She described us her {place}, {name}.", "She described her {place} ______, {name}.", "to us", WX, { place: ["new flat", "school", "village", "office"], name: NAME }, []],
  [COR, "He said me hello at the {event}, {name}.", "He said hello ______ at the {event}, {name}.", "to me", WX, { event: EVENT, name: NAME }, []],
  [COR, "Let me introduce you my {who}, {name}.", "Let me introduce my {who} ______, {name}.", "to you", WX, { who: ["sister", "cousin", "best friend", "neighbour"], name: NAME }, []],
  [COR, "The doctor suggested me a new {thing}, {name}.", "The doctor suggested a new {thing} ______, {name}.", "to me", WX, { thing: ["diet", "exercise plan", "medicine", "routine"], name: NAME }, ["for me"]],
  // to <-> for (5)
  [COR, "I bought a {thing} to my mum, {name}.", "I bought a {thing} ______ my mum, {name}.", "for", WF, { thing: ["scarf", "cake", "bag", "plant"], name: NAME }, []],
  [COR, "Dad cooked {food} to us {when}.", "Dad cooked {food} ______ us {when}.", "for", WF, { food: ["plov", "soup", "dinner", "breakfast"], when: PAST }, []],
  [COR, "Please give this {thing} for your teacher, {name}.", "Please give this {thing} ______ your teacher, {name}.", "to", WT, { thing: ["letter", "note", "book", "form"], name: NAME }, []],
  [COR, "She lent her {thing} for me {when}.", "She lent her {thing} ______ me {when}.", "to", WT, { thing: ["bike", "camera", "dress", "laptop"], when: PAST }, []],
  [COR, "Can you find a seat to my grandmother, {name}? She's {age}.", "Can you find a seat ______ my grandmother, {name}? She's {age}.", "for", WF, { name: NAME, age: ["eighty", "ninety", "very old", "tired"] }, []],
].map(([instr, source, hint, key, why, slots, acceptable = []]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence asking a teacher to explain something to you.", "Could you explain … to me?", ["exactly one sentence", "explain + thing + to me", "no explain me"]],
  ["Write one sentence about a present you bought for someone.", "I bought … for my …", ["exactly one sentence", "bought + thing + for + person", "a past verb"]],
  ["Write one sentence about something you lent to a friend. Use it.", "I lent it to …", ["exactly one sentence", "lent it to", "a person"]],
  ["Write one sentence about introducing a friend to your family.", "I introduced … to my …", ["exactly one sentence", "introduce + person + to", "a past verb"]],
  ["Write one sentence about food someone cooked for you.", "My … cooked … for me.", ["exactly one sentence", "cooked + food + for", "a person"]],
  ["Write one sentence describing your town to a new friend.", "Let me describe my town to you: …", ["exactly one sentence", "describe + thing + to", "a place"]],
  ["Write one sentence about photos you showed someone. Use them.", "I showed them to …", ["exactly one sentence", "showed them to", "a person"]],
  ["Write two sentences: one with to + person and one with for + person.", "I gave … to … / I made … for …", ["exactly two sentences", "to + person", "for + person"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a family birthday: what people bought, made or gave for the birthday person.", "We bought … for her. My brother gave … to her.", ["to and for", "past verbs", "three or four sentences"]],
  ["Write a message to a classmate asking them to explain a lesson to you.", "Could you explain … to me? Can you send … to me?", ["explain … to me", "to + person", "three or four sentences"]],
  ["Describe how you helped a guest who came to your town.", "I showed the old town to her. I found a hotel for her.", ["to and for", "past verbs", "three or four sentences"]],
  ["Describe things you lent or gave to friends this year.", "I lent my … to … / I gave it to …", ["to + person", "it or them", "three or four sentences"]],
  ["Write about a meal you cooked for your family or friends.", "I cooked … for … and gave … to …", ["to and for", "past verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.word-order.indirect-object-to.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "explain + the thing + to + person: explained the rule to us.",
   "describe + the thing + to + person: described the hotel to me.",
   "explain + the thing + to + person, never explain me.",
   "introduce + the friend + to + person.",
   "say goodbye to someone, never say someone goodbye.",
   "suggest + the thing + to + person, never suggest us.",
   "With it, use to: lent it to him.",
   "With them, use to: showed them to her.",
   "pass the thing to the person: to.",
   "lend the thing to the person: to.",
   "show the thing to the people: to.",
   "give the thing to the person: to.",
   "hand the thing to the person: to.",
   "explain the thing to the people: to.",
   "A present that helps her: buy … for.",
   "Cooking that helps us: cook … for.",
   "A cake made to please her: make … for.",
   "Finding something to help her: find … for.",
   "Booking to help us: book … for.",
   "Keeping it to help you: keep … for."
  ],
  "build": [
   "lend, the thing goes to me: to.",
   "explain, the problem goes to them: to.",
   "describe, the place goes to us: to.",
   "pass, the thing goes to the person: to.",
   "say sorry to someone: to.",
   "show, the thing goes to the driver: to.",
   "introduce someone to someone: to.",
   "lend, the thing goes to me: to.",
   "pass, the thing goes to …: to.",
   "hand, the thing goes to the waiter: to.",
   "buy, as a present that helps her: for.",
   "cook, to help the guests: for.",
   "make, as a present for her: for.",
   "open, to help me: for.",
   "carry, to help you: for.",
   "find, to help us: for.",
   "\"My hands are full\": hold, to help me: for.",
   "book a table, for the people who will sit: for.",
   "buy, to help Grandma: for.",
   "save a seat, to help you: for."
  ],
  "transform": [
   "With it at the end: gave it to.",
   "With them, buy uses for: bought them for.",
   "With them, show uses to: show them to.",
   "With it, make uses for: made it for.",
   "With it, send uses to: send it to.",
   "Never explain me: explain the … to me.",
   "Never described us: described … to us.",
   "Never said me hello: said hello to me.",
   "Never introduce you my …: introduce … to you.",
   "Never suggested me: suggested … to me.",
   "buy helps someone: for, not to.",
   "cook helps someone: for, not to.",
   "give goes to someone: to, not for.",
   "lend goes to someone: to, not for.",
   "find helps someone: for, not to."
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
console.log(`wrote ${out} — ${items.length} items`);