// Hand-authored: sentence-structure / relative-clauses / where-place (A2).
// Path fill P51 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: where for a place + a complete clause (That is the
// restaurant ______ we had dinner: who / where / which / whose).
// Sibling scope: the last of P49-P51. WHERE after a place noun (town, city,
// village, house, flat, room, school, café, park, shop, street, hotel,
// beach) when the clause after it is COMPLETE (we had dinner, I was born,
// my uncle works). People (who) are P49, things (that / which) P50.
// One right answer: the clause never has an object gap and never ends in a
// preposition that could belong to the noun ("the hotel which we stayed in"
// is right, so no "stayed in / at" after the blank), so which / that are
// wrong. that, when and "in which" are never offered; whose never offered.
// Choose: 14 where vs which / who / what; 6 the whole clause: "where I live"
// vs "where I live there" (the resumptive "there" Uzbek / Russian learners
// add), "which I live", "where do I live" (question order).
// Build: "Write where or which." 12 where (complete clause) / 8 which (the
// clause needs an object: the house which my dad built); which keys accept
// that.
// Transform: 5 join "This is the café. We meet there." / 5 correct the
// mistake / 5 "in which" / "at which" → where. Keys are where only.
//
// Run: node tools/grammar-practice/authored/sentence-structure.relative-clauses.where-place.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "relative-clauses", topic: "where-place", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];
const DAY = ["Fridays", "Sundays", "Saturdays", "Mondays"];
const LAST = ["summer", "spring", "year", "month"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const W = {
  a: "A place + a full sentence after it (we had dinner, I was born): use where.",
  b: "where already means 'in that place', so don't add there, and keep normal order: where I live.",
  where: "A place + a full sentence after it: where.",
  which: "The verb after the gap needs an object (built what?), so use which or that, not where.",
};
const A = ["where", "which", "who", "what"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE_A = [
  ["That is the restaurant ______ we had dinner {when}, {name}.", { when: ["last night", "on Friday", "for my birthday", "last week"], name: NAME }],
  ["This is the house ______ my grandparents live, {name}. It's near the {place}.", { name: NAME, place: ["river", "park", "library", "school"] }],
  ["{city} is the city ______ I was born, {name}.", { city: CITY, name: NAME }],
  ["Do you know a shop ______ I can buy cheap {thing}, {name}?", { thing: ["shoes", "books", "phones", "toys"], name: NAME }],
  ["The park ______ we play football is near the {place}, {name}.", { place: ["school", "river", "bazaar", "station"], name: NAME }],
  ["This is the café ______ we meet on {day}, {name}.", { day: DAY, name: NAME }],
  ["The village ______ my dad grew up is very {adj}, {name}.", { adj: ["small", "quiet", "beautiful", "old"], name: NAME }],
  ["Is this the room ______ the meeting is {when}, {name}?", { when: ["today", "at ten", "this afternoon", "on Friday"], name: NAME }],
  ["The hotel ______ we stayed last {when} was very nice, {name}.", { when: LAST, name: NAME }],
  ["I miss the town ______ I spent my {time}, {name}.", { time: ["childhood", "summers", "holidays", "school years"], name: NAME }],
  ["The bank ______ my aunt works is on {street} Street, {name}.", { street: ["Navoi", "Amir Temur", "Bobur", "Mustaqillik"], name: NAME }],
  ["We went back to the beach ______ we swam {when}, {name}.", { when: ["last summer", "two years ago", "as children", "every year"], name: NAME }],
  ["The school ______ my mum teaches has a big {place}, {name}.", { place: ["garden", "gym", "library", "yard"], name: NAME }],
  ["Show me the street ______ you live, {name}. Is it far from the {place}?", { name: NAME, place: ["centre", "park", "station", "bazaar"] }],
];
const CHOOSE_B = [
  [["where I live", "where I live there", "which I live", "where do I live"], "This is the flat ______, {name}. It's on the {floor} floor.", { name: NAME, floor: ["second", "third", "fifth", "top"] }],
  [["where we stayed", "where we stayed there", "which we stayed", "where did we stay"], "That's the hotel ______ last {when}, {name}.", { when: LAST, name: NAME }],
  [["where my uncle works", "where my uncle works there", "which my uncle works", "where does my uncle work"], "This is the {place} ______, {name}.", { place: ["hospital", "bank", "factory", "airport"], name: NAME }],
  [["where she was born", "where she was born there", "which she was born", "where was she born"], "{city} is the city ______. She loves it, {name}.", { city: CITY, name: NAME }],
  [["where we eat", "where we eat there", "which we eat", "where do we eat"], "The kitchen is the room ______ on {day}, {name}.", { day: ["weekdays", "school days", "busy days", "cold days"], name: NAME }],
  [["where they play", "where they play there", "which they play", "where do they play"], "The yard is the place ______ after {time}, {name}.", { time: ["school", "lunch", "dinner", "lessons"], name: NAME }],
];
const CHOOSE = [
  ...CHOOSE_A.map(([p, s]) => [A, "a", p, s]),
  ...CHOOSE_B.map(([o, p, s]) => [o, "b", p, s]),
].map(([base, w, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[w], slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write where or which.";
const BUILD = [
  // where (12)
  ["where", "This is the house ______ I grew up, {name}. It's near the {place}.", { name: NAME, place: ["river", "park", "library", "school"] }],
  ["where", "{city} is the city ______ my parents met, {name}.", { city: CITY, name: NAME }],
  ["where", "Is there a shop near here ______ I can buy {thing}, {name}?", { thing: ["bread", "milk", "stamps", "batteries"], name: NAME }],
  ["where", "The café ______ we had lunch {when} was very busy, {name}.", { when: ["today", "yesterday", "on Sunday", "last week"], name: NAME }],
  ["where", "This is the room ______ my brother sleeps, {name}. Be quiet in the {time}.", { name: NAME, time: ["morning", "afternoon", "evening", "night"] }],
  ["where", "The park ______ we run every {day} is very big, {name}.", { day: ["morning", "evening", "Sunday", "weekend"], name: NAME }],
  ["where", "I visited the school ______ my dad studied, {name}. It's in {city}.", { name: NAME, city: CITY }],
  ["where", "The village ______ my grandma lives has a small {place}, {name}.", { place: ["shop", "school", "bakery", "café"], name: NAME }],
  ["where", "This is the beach ______ we swam {when}, {name}.", { when: ["last summer", "every day", "as children", "two years ago"], name: NAME }],
  ["where", "The office ______ my mum works is on the {floor} floor, {name}.", { floor: ["second", "third", "fifth", "top"], name: NAME }],
  ["where", "That's the stadium ______ the big match is {when}, {name}.", { when: ["on Saturday", "tomorrow", "next week", "tonight"], name: NAME }],
  ["where", "The hotel ______ we stayed last {when} had a pool, {name}.", { when: LAST, name: NAME }],
  // which (8)
  ["which", "This is the house ______ my dad built {when}, {name}.", { when: ["in 2010", "ten years ago", "with his brothers", "himself"], name: NAME }],
  ["which", "The town ______ we visited {when} was very old, {name}.", { when: ["last summer", "on Sunday", "in May", "last year"], name: NAME }],
  ["which", "{city} is a city ______ my grandparents love, {name}.", { city: CITY, name: NAME }],
  ["which", "The café ______ my uncle opened {when} is very popular, {name}.", { when: ["last year", "in March", "two years ago", "in 2020"], name: NAME }],
  ["which", "The flat ______ they bought has {n} rooms, {name}.", { n: ["two", "three", "four", "five"], name: NAME }],
  ["which", "The park ______ the city built {when} is beautiful, {name}.", { when: ["last year", "near the river", "in the centre", "for children"], name: NAME }],
  ["which", "The museum ______ we saw in {city} was full of old carpets, {name}.", { city: CITY, name: NAME }],
  ["which", "The shop ______ my aunt runs sells {thing}, {name}.", { thing: ["fruit", "bread", "clothes", "toys"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(key === "which" ? { acceptable: ["that"] } : {}), why: W[key], slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with where.";
const COR = "Correct the mistake.";
const INW = "Rewrite the sentence with where.";
const TRANSFORM = [
  // join (5)
  [JOIN, "This is the café, {name}. We meet there on {day}.", "This is the café ______ we meet on {day}, {name}.", { name: NAME, day: DAY }],
  [JOIN, "{city} is a beautiful city, {name}. My cousins live there.", "{city} is a beautiful city ______ my cousins live, {name}.", { city: CITY, name: NAME }],
  [JOIN, "That's the park, {name}. We played there as {who}.", "That's the park ______ we played as {who}, {name}.", { name: NAME, who: ["children", "kids", "little boys", "little girls"] }],
  [JOIN, "I know a shop, {name}. You can buy cheap {thing} there.", "I know a shop ______ you can buy cheap {thing}, {name}.", { name: NAME, thing: ["shoes", "books", "phones", "toys"] }],
  [JOIN, "This is the {place}, {name}. My dad works there.", "This is the {place} ______ my dad works, {name}.", { place: ["hospital", "bank", "factory", "airport"], name: NAME }],
  // correct (5)
  [COR, "That's the restaurant which we had dinner {when}, {name}.", "That's the restaurant ______ we had dinner {when}, {name}.", { when: ["last night", "on Friday", "for my birthday", "last week"], name: NAME }],
  [COR, "The village what my grandpa lives is very {adj}, {name}.", "The village ______ my grandpa lives is very {adj}, {name}.", { adj: ["small", "quiet", "beautiful", "old"], name: NAME }],
  [COR, "{city} is the city who I was born, {name}.", "{city} is the city ______ I was born, {name}.", { city: CITY, name: NAME }],
  [COR, "This is the school in where my {who} studies, {name}.", "This is the school ______ my {who} studies, {name}.", { who: ["sister", "brother", "cousin", "friend"], name: NAME }],
  [COR, "The hotel which we stayed last {when} was cheap, {name}.", "The hotel ______ we stayed last {when} was cheap, {name}.", { when: LAST, name: NAME }],
  // in which / at which -> where (5)
  [INW, "This is the {room} in which I do my homework, {name}.", "This is the {room} ______ I do my homework, {name}.", { room: ["room", "bedroom", "kitchen", "library"], name: NAME }],
  [INW, "{city} is the city in which my parents met, {name}.", "{city} is the city ______ my parents met, {name}.", { city: CITY, name: NAME }],
  [INW, "That's the house in which my {who} lives, {name}.", "That's the house ______ my {who} lives, {name}.", { who: ["grandma", "grandpa", "aunt", "uncle"], name: NAME }],
  [INW, "The park in which we run every {day} is near the {place}.", "The park ______ we run every {day} is near the {place}.", { day: ["morning", "evening", "Sunday", "weekend"], place: ["river", "school", "bazaar", "station"] }],
  [INW, "The café at which we had lunch {when} was busy, {name}.", "The café ______ we had lunch {when} was busy, {name}.", { when: ["today", "yesterday", "on Sunday", "last week"], name: NAME }],
].map(([instr, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: "where", why: W.where, slots: fix(slots, source + hint) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the town or city where you were born.", "… is the city where I was born.", ["exactly one sentence", "where", "a place name"]],
  ["Write one sentence about a café or restaurant where you like to eat.", "… is a café where …", ["exactly one sentence", "where", "a food word"]],
  ["Write one sentence about the room where you do your homework.", "The room where I …", ["exactly one sentence", "where", "a room word"]],
  ["Write one sentence about a shop where you buy clothes or food.", "… is a shop where I buy …", ["exactly one sentence", "where", "a thing word"]],
  ["Write one sentence about a place where you meet your friends.", "… is the place where we meet.", ["exactly one sentence", "where", "a time word"]],
  ["Write one sentence about the school where you study or studied.", "The school where I …", ["exactly one sentence", "where", "a past or present verb"]],
  ["Write one sentence about a place where you had a great holiday.", "… is the place where we …", ["exactly one sentence", "where", "a holiday word"]],
  ["Write two sentences: one with where (a place) and one with which (a thing).", "… where … / … which …", ["exactly two sentences", "where once", "which once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your home town: the street where you live, a shop where you go and a park where you play.", "the street where I live …", ["where three times", "a place word", "three or four sentences"]],
  ["Write a tour of your school for a new student: the rooms and places and what happens there.", "This is the room where we …", ["where", "a room word", "three or four sentences"]],
  ["Describe a city you visited. Write about the hotel where you stayed and a place where you ate.", "the hotel where we stayed …", ["where twice", "a city name", "three or four sentences"]],
  ["Describe your grandparents' village or flat and the places there that you like.", "the village where my grandparents live …", ["where", "a family word", "three or four sentences"]],
  ["Describe your favourite place in your town and why you like it.", "… is the place where I …", ["where", "a reason", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.relative-clauses.where-place.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);