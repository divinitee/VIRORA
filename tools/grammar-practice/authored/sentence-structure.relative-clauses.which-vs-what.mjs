// Hand-authored: sentence-structure / relative-clauses / which-vs-what (B1).
// Wave C, C14 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: which (relative pronoun) after a noun vs what, which is
// NOT a relative pronoun: what = "the thing(s) that" and has no noun before it.
// Learners write "the file what you sent" (Russian "то, что" / Uzbek "-gan
// narsa" both map to what) and ", what surprised everyone" for a comment on a
// whole clause.
// Choose: 9 which after a noun, 3 ", which" commenting on a whole clause,
// 8 what with no noun. Options:
//   which keys:  which / what / who / where (where never after a thing you
//                saw or bought; "that" is never offered, it would be right)
//   what keys:   what / which / that / who (frames chosen so interrogative
//                "which" can't work: after say / did / need / ordered, never
//                "I don't know ___ you want")
// Build: "Write which or what"; defining which accepts that, ", which" and
// what accept nothing else.
// Transform: 5 correct what → which / 5 correct which / that → what /
// 5 rewrite "the thing that" → what.
//
// Run: node tools/grammar-practice/authored/sentence-structure.relative-clauses.which-vs-what.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "relative-clauses", topic: "which-vs-what", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAMEM = ["Aziz", "Timur", "Bekzod", "Rustam"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_WHICH = "A noun comes just before the gap, so use which (or that). What can't follow a noun.";
const W_COMMA = "After a comma, which can talk about the whole idea before it. What can't do this.";
const W_WHAT = "There is no noun before the gap: what means 'the thing that'. Which and that need a noun before them.";
const OPT_WHICH = ["which", "what", "who", "where"];
const OPT_WHAT = ["what", "which", "that", "who"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["w", "I couldn't find the {thing} ______ you sent me, {name}.", { thing: ["file", "email", "link", "photo"], name: NAME }],
  ["w", "The {thing} ______ I bought {when} has already broken.", { thing: ["phone", "lamp", "kettle", "umbrella"], when: PAST }],
  ["w", "Do you still have the {thing} ______ Grandma gave you, {name}?", { thing: ["ring", "scarf", "book", "watch"], name: NAME }],
  ["w", "This is the {food} ______ my mum makes every {day}.", { food: ["soup", "plov", "cake", "bread"], day: ["Friday", "Sunday", "weekend", "holiday"] }],
  ["w", "We watched a {film} ______ made everyone cry, {name}.", { film: ["film", "cartoon", "video", "play"], name: NAME }],
  ["w", "The bus ______ goes to {city} leaves at {time}.", { city: CITY, time: ["six", "seven", "eight", "nine"] }],
  ["w", "I've lost the {thing} ______ you lent me, {name}. I'm so sorry!", { thing: ["pen", "charger", "book", "umbrella"], name: NAME }],
  ["w", "The {shop} ______ opened near us sells {thing}.", { shop: ["shop", "café", "kiosk", "market"], thing: ["great coffee", "cheap shoes", "fresh bread", "old books"] }],
  ["w", "Is this the {thing} ______ you wanted, {name}?", { thing: ["bag", "jacket", "game", "book"], name: NAME }],
  ["c", "{name} passed the {test}, ______ surprised everyone.", { name: NAMEM, test: ["exam", "driving test", "final test", "interview"] }],
  ["c", "It rained all {time}, ______ meant we stayed at home, {name}.", { time: ["day", "weekend", "morning", "afternoon"], name: NAME }],
  ["c", "My brother cooked dinner {when}, ______ was a nice surprise.", { when: PAST }],
  ["t", "I didn't hear ______ the teacher said, {name}.", { name: NAME }],
  ["t", "Thank you for ______ you did for us {when}, {name}.", { when: PAST, name: NAME }],
  ["t", "______ I need now is a long {rest}.", { rest: ["holiday", "sleep", "walk", "break"] }],
  ["t", "That's not ______ I ordered, {name}. I asked for {food}.", { name: NAME, food: ["tea", "soup", "a salad", "fish"] }],
  ["t", "This {thing} is exactly ______ I wanted, {name}!", { thing: ["phone", "bike", "dress", "game"], name: NAME }],
  ["t", "I can't believe ______ he did at the {event}.", { event: ["party", "wedding", "match", "meeting"] }],
  ["t", "Did you understand ______ she said in {lang}, {name}?", { lang: ["Russian", "Korean", "Turkish", "Chinese"], name: NAME }],
  ["t", "______ we ate in {city} was amazing.", { city: CITY }],
].map(([k, prompt, slots], i) => {
  const base = k === "t" ? OPT_WHAT : OPT_WHICH;
  const opts = prompt.startsWith("______") ? base.map(cap) : base;
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: k === "w" ? W_WHICH : k === "c" ? W_COMMA : W_WHAT, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write which or what.";
const BUILD = [
  ["w", "The {thing} ______ you gave me is lovely, {name}.", { thing: ["scarf", "card", "book", "plant"], name: NAME }],
  ["w", "I read the {thing} ______ you sent me {when}.", { thing: ["email", "message", "letter", "report"], when: PAST }],
  ["w", "The {thing} ______ stopped working {when} was new, {name}.", { thing: ["printer", "laptop", "fridge", "phone"], when: PAST, name: NAME }],
  ["w", "We stayed in a hotel ______ had a big {thing}, {name}.", { thing: ["pool", "garden", "terrace", "restaurant"], name: NAME }],
  ["w", "Where is the {thing} ______ was on the table, {name}?", { thing: ["cake", "bread", "money", "key"], name: NAME }],
  ["w", "The {film} ______ we saw in {city} was boring.", { film: ["film", "play", "show", "concert"], city: CITY }],
  ["w", "Can I borrow the {thing} ______ you bought {when}, {name}?", { thing: ["drill", "tent", "ladder", "camera"], when: PAST, name: NAME }],
  ["w", "I like songs ______ make me {feel}, {name}.", { feel: ["dance", "smile", "happy", "think"], name: NAME }],
  ["c", "{name} forgot my birthday, ______ made me sad.", { name: NAMEM }],
  ["c", "The train was late {when}, ______ was a problem for everyone, {name}.", { when: ["again", "today", "this morning", "on Monday"], name: NAME }],
  ["c", "We won the {game}, ______ nobody expected, {name}.", { game: ["match", "final", "quiz", "game"], name: NAME }],
  ["c", "She helped me with my {work}, ______ was very kind of her.", { work: ["homework", "essay", "project", "move"] }],
  ["t", "Tell me ______ happened at the {event}, {name}.", { event: ["party", "wedding", "match", "meeting"], name: NAME }],
  ["t", "______ I like most about {city} is the food.", { city: CITY }],
  ["t", "I don't remember ______ he said {when}, {name}.", { when: PAST, name: NAME }],
  ["t", "Please show me ______ you bought at the {place}, {name}.", { place: ["bazaar", "mall", "market", "shop"], name: NAME }],
  ["t", "______ you need is a good {thing}, {name}.", { thing: ["sleep", "breakfast", "coat", "map"], name: NAME }],
  ["t", "We can't change ______ happened {when}, {name}.", { when: PAST, name: NAME }],
  ["t", "Is this ______ you were looking for, {name}?", { name: NAME }],
  ["t", "I'll do ______ I can to help you with the {work}.", { work: ["move", "party", "project", "garden"] }],
].map(([k, source, slots]) => {
  const start = source.startsWith("______");
  const word = k === "t" ? "what" : "which";
  const key = start ? cap(word) : word;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(k === "w" ? { acceptable: ["that"] } : {}), why: k === "w" ? W_WHICH : k === "c" ? W_COMMA : W_WHAT, slots: pick(source, slots) };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const REW = "Rewrite with what.";
const TRANSFORM = [
  // what -> which after a noun (5)
  [COR, "The {thing} what you sent me is broken, {name}.", "The {thing} ______ you sent me is broken, {name}.", "which", W_WHICH, { thing: ["link", "file", "parcel", "toy"], name: NAME }, ["that"]],
  [COR, "I liked the {food} what your mum cooked {when}.", "I liked the {food} ______ your mum cooked {when}.", "which", W_WHICH, { food: ["plov", "soup", "cake", "samsa"], when: PAST }, ["that"]],
  [COR, "This is the {thing} what I told you about, {name}.", "This is the {thing} ______ I told you about, {name}.", "which", W_WHICH, { thing: ["book", "café", "film", "game"], name: NAME }, ["that"]],
  [COR, "{name} lost his {thing}, what was a big problem.", "{name} lost his {thing}, ______ was a big problem.", "which", W_COMMA, { name: NAMEM, thing: ["keys", "phone", "wallet", "passport"] }, []],
  [COR, "It snowed all {time}, what was beautiful, {name}.", "It snowed all {time}, ______ was beautiful, {name}.", "which", W_COMMA, { time: ["night", "day", "morning", "week"], name: NAME }, []],
  // which / that -> what (5)
  [COR, "I don't understand that you said {when}, {name}.", "I don't understand ______ you said {when}, {name}.", "what", W_WHAT, { when: ["just now", "in class", "on the phone", "at lunch"], name: NAME }, []],
  [COR, "Which I need is a new {thing}, {name}.", "______ I need is a new {thing}, {name}.", "What", W_WHAT, { thing: ["phone", "laptop", "bike", "job"], name: NAME }, []],
  [COR, "Thank you for that you did {when}, {name}.", "Thank you for ______ you did {when}, {name}.", "what", W_WHAT, { when: PAST, name: NAME }, []],
  [COR, "That's exactly which I wanted for my {day}, {name}!", "That's exactly ______ I wanted for my {day}, {name}!", "what", W_WHAT, { day: ["birthday", "trip", "room", "kitchen"], name: NAME }, []],
  [COR, "Tell me which happened in {city}, {name}.", "Tell me ______ happened in {city}, {name}.", "what", W_WHAT, { city: CITY, name: NAME }, []],
  // the thing that -> what (5)
  [REW, "The thing that I need is a long {rest}, {name}.", "______ I need is a long {rest}, {name}.", "What", W_WHAT, { rest: ["holiday", "sleep", "walk", "break"], name: NAME }, []],
  [REW, "I didn't hear the thing that you said {when}, {name}.", "I didn't hear ______ you said {when}, {name}.", "what", W_WHAT, { when: ["just now", "in class", "on the phone", "at lunch"], name: NAME }, []],
  [REW, "The things that we saw in {city} were amazing, {name}.", "______ we saw in {city} was amazing, {name}.", "What", W_WHAT, { city: CITY, name: NAME }, []],
  [REW, "Show me the things that you bought at the {place}, {name}.", "Show me ______ you bought at the {place}, {name}.", "what", W_WHAT, { place: ["bazaar", "mall", "market", "shop"], name: NAME }, []],
  [REW, "The thing that I like about my {place} is the view, {name}.", "______ I like about my {place} is the view, {name}.", "What", W_WHAT, { place: ["flat", "office", "room", "school"], name: NAME }, []],
].map(([instr, source, hint, key, why, slots, acceptable = []]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a present you got, with which after the noun.", "The … which my … gave me is …", ["exactly one sentence", "noun + which", "no what after the noun"]],
  ["Write one sentence that starts with What I need.", "What I need is …", ["exactly one sentence", "What at the start", "no noun before what"]],
  ["Write one sentence about a film, with which after the word film.", "The film which we saw …", ["exactly one sentence", "film + which", "a past verb"]],
  ["Write one sentence saying you didn't hear something.", "I didn't hear what …", ["exactly one sentence", "what + subject + verb", "no that / which"]],
  ["Write one sentence about some good news, then comment on it with , which.", "… passed the exam, which was great.", ["exactly one sentence", "a comma before which", "which talks about the whole idea"]],
  ["Write one sentence thanking someone for their help, with what.", "Thank you for what you …", ["exactly one sentence", "for what", "a past verb"]],
  ["Write one sentence about a shop near you, with which.", "The shop which … sells …", ["exactly one sentence", "noun + which", "present simple"]],
  ["Write two sentences: one with which after a noun and one with what.", "The book which … / What I like …", ["exactly two sentences", "which after a noun", "what with no noun before it"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about your favourite day of the year: what you like about it and the food you eat.", "What I like most is … The food which my mum makes …", ["which after a noun", "what with no noun", "three or four sentences"]],
  ["Write a short review of a café or shop.", "The coffee which they sell … What I didn't like was …", ["which and what", "present or past verbs", "three or four sentences"]],
  ["Describe a surprise that happened to you.", "My friend came home, which … I didn't know what …", ["which after a comma", "what", "three or four sentences"]],
  ["Write a message to a friend thanking them for a present.", "Thank you for what you sent. The scarf which …", ["which and what", "past verbs", "three or four sentences"]],
  ["Describe a trip and the things you saw.", "What we saw was … The museum which we visited …", ["which after a noun", "what at the start of a sentence", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.relative-clauses.which-vs-what.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);