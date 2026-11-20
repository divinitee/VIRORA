// Hand-authored: conditionals-wishes / second / second-if-clause (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): the IF-half of the second conditional takes the
// PAST SIMPLE for an imagined present or future (What would you do if you won …?).
// Triage with sibling if-i-were-you: that topic owns the result half (would + base)
// in the advice frame. Here "would" is printed in the other half, and 5 build items
// ask for both halves (the placement gap item).
// One right answer: "was / were" is never a choice. be appears only with you / we /
// they (were), so was is never right or wrong here.
// Choose: past simple / present / will + base / would + base (can → could / can /
// will can / would can).
// Build: 15 past simple of the verb in brackets; 5 both halves with an array key.
// Transform: 5 the real situation → If … (past simple) / 5 correct the mistake /
// 5 Imagine: … → If … (past simple).
//
// Run: node tools/grammar-practice/authored/conditionals-wishes.second.second-if-clause.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "conditionals-wishes", branch: "second", topic: "second-if-clause", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const PAST = { win: "won", have: "had", live: "lived", know: "knew", can: "could", speak: "spoke", be: "were", find: "found", lose: "lost", get: "got", meet: "met", go: "went", study: "studied", work: "worked", own: "owned", eat: "ate", need: "needed" };
const PRES = { be: "are" };
const WHY = "Imagined situation: if + past simple, … would + base verb.";
const opts = (v) => [PAST[v], PRES[v] || v, `will ${v}`, `would ${v}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["win", "What would you do if you ______ the {prize}, {name}?", { prize: ["lottery", "big prize", "cup", "competition"], name: NAME }],
  ["have", "If I ______ more free time, I would learn the {instr}, {name}.", { instr: ["piano", "guitar", "violin", "dutar"], name: NAME }],
  ["live", "If we ______ in {city}, we would visit the old town every day, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Rome"], name: NAME }],
  ["know", "If I ______ the answer to the {q}, I would tell you, {name}.", { q: ["question", "puzzle", "riddle", "maths problem"], name: NAME }],
  ["can", "If I ______ fly, I would go to {country} every weekend, {name}.", { country: ["Japan", "Italy", "Turkey", "Korea"], name: NAME }],
  ["speak", "If you ______ {lang}, you would understand the film, {name}.", { lang: ["Korean", "Turkish", "French", "Hindi"], name: NAME }],
  ["be", "If you ______ taller, you could play basketball for the {team}, {name}.", { team: ["school", "city", "college", "club"], name: NAME }],
  ["have", "If we ______ a car, we would drive to the {place} on Sundays, {name}.", { place: ["mountains", "lake", "sea", "village"], name: NAME }],
  ["find", "If I ______ a wallet in the {place}, I would look for the owner, {name}.", { place: ["street", "park", "bus", "café"], name: NAME }],
  ["lose", "If I ______ my {thing}, my mum would be very angry, {name}.", { thing: ["passport", "phone", "keys", "bag"], name: NAME }],
  ["get", "If she ______ the job at the {place}, she would move to {city}.", { place: ["bank", "airport", "hotel", "university"], city: ["Tashkent", "Moscow", "Dubai", "Seoul"] }],
  ["meet", "If you ______ a famous {who}, what would you say, {name}?", { who: ["singer", "footballer", "actor", "writer"], name: NAME }],
  ["go", "If we ______ to {city} by train, it would be cheaper, {name}.", { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"], name: NAME }],
  ["study", "If he ______ harder, he would pass the {test}, {name}.", { test: ["exam", "test", "driving test", "IELTS exam"], name: NAME }],
  ["work", "If my {who} ______ less, he would be happier, {name}.", { who: ["dad", "uncle", "brother", "grandfather"], name: NAME }],
  ["be", "If they ______ here, they would help us with the {work}, {name}.", { work: ["move", "garden", "party", "cooking"], name: NAME }],
  ["own", "If I ______ a big house, I would invite all my {who}, {name}.", { who: ["friends", "cousins", "classmates", "neighbours"], name: NAME }],
  ["eat", "If you ______ less {food}, you would feel better, {name}.", { food: ["sugar", "bread", "fast food", "sweets"], name: NAME }],
  ["need", "If you ever ______ help with the {work}, I would help you, {name}.", { work: ["move", "homework", "garden", "car"], name: NAME }],
  ["can", "If we ______ choose, we would go to {country} for our holiday, {name}.", { country: ["Japan", "Italy", "Turkey", "Korea"], name: NAME }],
].map(([v, prompt, slots], i) => {
  const o = opts(v);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots };
});

/* ---------------- build: 15 single + 5 both halves ---------------- */
const INSTR = "Imagine. Complete the if-part with the past simple of the verb in brackets.";
const INSTR2 = "Complete both halves: the past simple in the if-part, would + the verb in the other part.";
const BUILD = [
  [INSTR, "had", "If I ______ (have) more money, I would buy a {thing}, {name}.", { thing: ["car", "laptop", "bike", "camera"], name: NAME }],
  [INSTR, "lived", "If we ______ (live) near the {place}, we would swim every day, {name}.", { place: ["sea", "lake", "river", "pool"], name: NAME }],
  [INSTR, "knew", "If I ______ (know) the way to the {place}, I would take you, {name}.", { place: ["museum", "station", "stadium", "old town"], name: NAME }],
  [INSTR, "won", "If our team ______ (win) the {cup}, the whole city would celebrate, {name}.", { cup: ["cup", "final", "league", "match"], name: NAME }],
  [INSTR, "spoke", "If she ______ (speak) {lang}, she would get the job, {name}.", { lang: ["English", "Korean", "German", "Chinese"], name: NAME }],
  [INSTR, "could", "If I ______ (can) cook like my {who}, I would open a café, {name}.", { who: ["grandmother", "mother", "aunt", "uncle"], name: NAME }],
  [INSTR, "were", "If we ______ (be) rich, we would travel round {place}, {name}.", { place: ["the world", "Europe", "Asia", "Africa"], name: NAME }],
  [INSTR, "got", "If he ______ (get) up earlier, he wouldn't be late for {event}, {name}.", { event: ["school", "work", "class", "training"], name: NAME }],
  [INSTR, "found", "If you ______ (find) a {thing} in the street, what would you do, {name}?", { thing: ["wallet", "phone", "ring", "bag"], name: NAME }],
  [INSTR, "studied", "If Timur ______ (study) more, he would get better marks in {subject}, {name}.", { subject: ["maths", "English", "physics", "history"], name: NAME }],
  [INSTR, "ate", "If you ______ (eat) more {food}, you would be healthier, {name}.", { food: ["fruit", "vegetables", "fish", "salad"], name: NAME }],
  [INSTR, "went", "If they ______ (go) by plane, they would arrive in {city} in two hours, {name}.", { city: ["Moscow", "Istanbul", "Dubai", "Almaty"], name: NAME }],
  [INSTR, "owned", "If I ______ (own) a {shop}, I would sell fresh bread, {name}.", { shop: ["bakery", "café", "shop", "market stall"], name: NAME }],
  [INSTR, "met", "If I ______ (meet) a famous {who}, I would ask for a photo, {name}.", { who: ["singer", "footballer", "actor", "writer"], name: NAME }],
  [INSTR, "worked", "If my {who} ______ (work) less, he would have more time for us, {name}.", { who: ["dad", "uncle", "brother", "grandfather"], name: NAME }],
  [INSTR2, ["had", "would learn"], "If I ______ (have) more free time, I ______ (learn) the {instr}, {name}.", { instr: ["piano", "guitar", "violin", "dutar"], name: NAME }],
  [INSTR2, ["lived", "would visit"], "If we ______ (live) in {city}, we ______ (visit) the old town every weekend.", { city: ["Samarkand", "Bukhara", "Khiva", "Rome"], x: ["", "", "", ""] }],
  [INSTR2, ["were", "would play"], "If you ______ (be) taller, you ______ (play) for the {team}, {name}.", { team: ["school team", "city team", "college team", "club"], name: NAME }],
  [INSTR2, ["knew", "would come"], "If she ______ (know) about the {event}, she ______ (come), {name}.", { event: ["party", "wedding", "concert", "meeting"], name: NAME }],
  [INSTR2, ["won", "would buy"], "If I ______ (win) the {prize}, I ______ (buy) a house for my parents, {name}.", { prize: ["lottery", "big prize", "competition", "cup"], name: NAME }],
].map(([instr, key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr, source, key, why: WHY, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REAL = "Imagine it is different. Complete the if-part with the past simple.";
const FIX = "Correct the mistake.";
const IMAG = "Rewrite as one sentence with if + past simple.";
// [instr, source, hint, verb, slots]
const TRANSFORM = [
  [REAL, "I don't have a car, so I can't drive you to the {place}, {name}.", "If I ______ a car, I would drive you to the {place}, {name}.", "have", { place: ["airport", "station", "wedding", "hospital"], name: NAME }],
  [REAL, "We don't live near the {place}, so we don't go often, {name}.", "If we ______ near the {place}, we would go often, {name}.", "live", { place: ["sea", "lake", "river", "pool"], name: NAME }],
  [REAL, "I don't know the answer to the {q}, so I can't tell you, {name}.", "If I ______ the answer to the {q}, I would tell you, {name}.", "know", { q: ["question", "puzzle", "riddle", "maths problem"], name: NAME }],
  [REAL, "She doesn't speak {lang}, so she can't work in {city}.", "If she ______ {lang}, she could work in {city}.", "speak", { lang: ["Korean", "German", "Turkish", "Chinese"], city: ["Seoul", "Berlin", "Istanbul", "Beijing"] }],
  [REAL, "He can't swim, so he never goes to the {place}, {name}.", "If he ______ swim, he would go to the {place}, {name}.", "can", { place: ["pool", "beach", "lake", "sea"], name: NAME }],
  [FIX, "If I would have more money, I would buy a {thing}, {name}.", "If I ______ more money, I would buy a {thing}, {name}.", "have", { thing: ["car", "laptop", "bike", "camera"], name: NAME }],
  [FIX, "If we live in {city}, we would visit the museums every week, {name}.", "If we ______ in {city}, we would visit the museums every week, {name}.", "live", { city: ["Samarkand", "Bukhara", "Khiva", "Rome"], name: NAME }],
  [FIX, "What would you do if you will win the {prize}, {name}?", "What would you do if you ______ the {prize}, {name}?", "win", { prize: ["lottery", "big prize", "cup", "competition"], name: NAME }],
  [FIX, "If she knows his number, she would call him from the {place}, {name}.", "If she ______ his number, she would call him from the {place}, {name}.", "know", { place: ["office", "station", "airport", "hotel"], name: NAME }],
  [FIX, "If I can fly, I would visit {country} every day, {name}.", "If I ______ fly, I would visit {country} every day, {name}.", "can", { country: ["Japan", "Italy", "Turkey", "Korea"], name: NAME }],
  [IMAG, "Imagine: you win the {prize}. You buy a house, {name}.", "If you ______ the {prize}, you would buy a house, {name}.", "win", { prize: ["lottery", "big prize", "cup", "competition"], name: NAME }],
  [IMAG, "Just imagine you live in {city}. You walk to the old town every day, {name}.", "If you ______ in {city}, you would walk to the old town every day, {name}.", "live", { city: ["Samarkand", "Bukhara", "Khiva", "Rome"], name: NAME }],
  [IMAG, "Picture this: I meet a famous {who}. I ask for a photo, {name}.", "If I ______ a famous {who}, I would ask for a photo, {name}.", "meet", { who: ["singer", "footballer", "actor", "writer"], name: NAME }],
  [IMAG, "Let's imagine we have a big garden. We grow {food}, {name}.", "If we ______ a big garden, we would grow {food}, {name}.", "have", { food: ["tomatoes", "melons", "grapes", "apples"], name: NAME }],
  [IMAG, "Imagine this: you find a {thing} on the bus. You give it to the driver, {name}.", "If you ______ a {thing} on the bus, you would give it to the driver, {name}.", "find", { thing: ["wallet", "phone", "ring", "bag"], name: NAME }],
].map(([instr, source, hint, v, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: PAST[v], why: WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what you would do if you won a lot of money.", "If I won …, I would …", ["exactly one sentence", "if + past simple", "would + base verb"]],
  ["Write one sentence about where you would live if you could choose.", "If I could …, I would live …", ["exactly one sentence", "if + could", "would"]],
  ["Write one question: What would you do if …?", "What would you do if + past simple?", ["exactly one question", "past simple after if", "a question mark"]],
  ["Write one sentence about a language you would learn if you had time.", "If I had time, I would learn …", ["exactly one sentence", "had", "would"]],
  ["Write one sentence with the would-part first and the if-part second.", "I would … if I + past simple", ["exactly one sentence", "would first", "if + past simple second"]],
  ["Write one sentence about what your town would be like if it had a metro.", "If our town had …, …would …", ["exactly one sentence", "if + past simple", "would"]],
  ["Write one sentence about a famous person you would like to meet and what you would do.", "If I met …, I would …", ["exactly one sentence", "met", "would"]],
  ["Write two sentences: one first conditional (will) and one second conditional (would).", "if + present / if + past", ["exactly two sentences", "if + present, will", "if + past, would"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What would you do if you were the head of your school or company for one day? Write three or four sentences.", "second conditional", ["if + past simple", "would + base verb", "three or four sentences"]],
  ["Imagine you could live in any country. Write three or four sentences about your life there.", "If I could / lived …, I would …", ["if + past simple", "would", "three or four sentences"]],
  ["What would your perfect weekend be like if you had no work or school? Write three or four sentences.", "second conditional", ["if + past simple", "would", "three or four sentences"]],
  ["Imagine you found a magic lamp. Write three or four sentences about your three wishes.", "If I found …, I would …", ["if + past simple", "would", "three or four sentences"]],
  ["What would happen if there were no phones? Write three or four sentences.", "If there were no …, people would …", ["if + past simple", "would", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/conditionals-wishes.second.second-if-clause.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
