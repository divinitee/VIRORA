// Hand-authored: verb-patterns / have-got / have-got-question (A1).
// Path fill P22 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: Has … got question form (______ he got a car?: Have / Has
// / Is / Does).
// Sibling scope: questions and their short answers ONLY. Positive statements
// are P21 (have-has), negatives are P23 (have-got-negative); the short
// answer "No, he hasn't." is the only negative form here, and it is part of
// answering the question.
// Every question has "got" printed after the subject, so Do / Does can never
// be right (no "Do you have …?" items). Choose distractors: the other
// auxiliary, Is / Are and Does / Do; short-answer distractors: does / is /
// got and "hasn't got" (Yes, he got. / No, she hasn't got.), the Uzbek and
// Russian learners' usual mistakes.
// Build: "Write Have or Has."; no source prints have or has elsewhere.
// Transform: 5 statement → question / 5 correct the mistake / 5 write the
// question for the answer.
//
// Run: node tools/grammar-practice/authored/verb-patterns.have-got.have-got-question.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "have-got", topic: "have-got-question", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const COLOR = ["white", "red", "blue", "black"];
const CITY = ["Samarkand", "Bukhara", "Tashkent", "Fergana"];
const PET = ["dog", "cat", "parrot", "rabbit"];
const PN = ["Bars", "Max", "Luna", "Snow"];
const SIB = ["brothers", "sisters", "cousins", "aunts"];
const ADULT = ["Mum", "Dad", "Grandma", "Aziz"];
const TEACH = ["Ms Ivanova", "Mr Karimov", "teacher", "Mrs Karimova"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const Q_HAS = ["Has", "Have", "Is", "Does"];
const Q_HAVE = ["Have", "Has", "Are", "Do"];
const W_HAS = "With he, she, it or one person or thing, the question is Has … got …?";
const W_HAVE = "With I, you, we, they or more than one person, the question is Have … got …?";
const SHORT = (s, aux) => [`${s} ${aux}`, `${s} ${aux === "has" ? "does" : "do"}`, `${s} ${aux === "has" ? "is" : s === "I" ? "am" : "are"}`, `${s} got`];
const SHORTN = (s, aux) => [`${s} ${aux}n't`, `${s} ${aux === "has" ? "doesn't" : "don't"}`, `${s} ${aux === "has" ? "isn't" : "aren't"}`, `${s} ${aux}n't got`];
const W_SY = (s, aux) => `The question is ${aux === "has" ? "Has" : "Have"} … got …?, so the short answer is Yes, ${s} ${aux}. No got, no do.`;
const W_SN = (s, aux) => `The question is ${aux === "has" ? "Has" : "Have"} … got …?, so the short answer is No, ${s} ${aux}n't. No got at the end.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  // Has … got? (7)
  [Q_HAS, W_HAS, "______ {name} got a {pet}?", { name: NAME, pet: PET }],
  [Q_HAS, W_HAS, "______ your {who} got a car, {name}?", { who: ["brother", "sister", "dad", "uncle"], name: NAME }],
  [Q_HAS, W_HAS, "______ your school got a {place}, {name}?", { place: ["library", "gym", "canteen", "garden"], name: NAME }],
  [Q_HAS, W_HAS, "______ he got a {thing} for the {lesson} lesson?", { thing: ["pen", "pencil", "ruler", "notebook"], lesson: ["English", "maths", "art", "music"] }],
  [Q_HAS, W_HAS, "______ your flat got a {thing}, {name}?", { thing: ["balcony", "lift", "garden", "big kitchen"], name: NAME }],
  [Q_HAS, W_HAS, "______ she got any {sib}, {name}?", { sib: SIB, name: NAME }],
  [Q_HAS, W_HAS, "______ the {room} got a {thing}?", { room: ["kitchen", "classroom", "hotel room", "bedroom"], thing: ["window", "TV", "clock", "table"] }],
  // Have … got? (7)
  [Q_HAVE, W_HAVE, "______ you got a {thing}, {name}?", { thing: ["pen", "pencil", "ruler", "charger"], name: NAME }],
  [Q_HAVE, W_HAVE, "______ your parents got a {color} car, {name}?", { color: COLOR, name: NAME }],
  [Q_HAVE, W_HAVE, "______ they got a house in {city}, {name}?", { city: CITY, name: NAME }],
  [Q_HAVE, W_HAVE, "______ we got any {food} at home, {who}?", { food: ["milk", "bread", "eggs", "tea"], who: ADULT }],
  [Q_HAVE, W_HAVE, "______ you got any {sib}, {name}?", { sib: SIB, name: NAME }],
  [Q_HAVE, W_HAVE, "______ your cousins got a {pet}, {name}?", { pet: PET, name: NAME }],
  [Q_HAVE, W_HAVE, "______ I got {thing} on my {part}?", { thing: ["paint", "ink", "chalk", "jam"], part: ["face", "shirt", "hands", "nose"] }],
  // short answers (6)
  [SHORT("he", "has"), W_SY("he", "has"), "Has {name} got a {thing}? – Yes, ______.", { name: HE, thing: ["bike", "phone", "laptop", "watch"] }],
  [SHORT("I", "have"), W_SY("I", "have"), "Have you got a {thing}, {name}? – Yes, ______.", { thing: ["pen", "ruler", "charger", "pencil"], name: NAME }],
  [SHORTN("she", "has"), W_SN("she", "has"), "Has your {who} got a car, {name}? – No, ______.", { who: ["sister", "mum", "aunt", "grandma"], name: NAME }],
  [SHORTN("they", "have"), W_SN("they", "have"), "Have they got a {pet}, {name}? – No, ______.", { pet: PET, name: NAME }],
  [SHORT("it", "has"), W_SY("it", "has"), "Has your flat got a {thing}, {name}? – Yes, ______.", { thing: ["balcony", "lift", "big kitchen", "garden"], name: NAME }],
  [SHORTN("we", "have"), W_SN("we", "have"), "Have we got any {food}, {who}? – No, ______.", { food: ["milk", "bread", "eggs", "sugar"], who: ADULT }],
].map(([base, why, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write Have or Has.";
const BUILD = [
  // Has (10)
  ["Has", "______ {name} got a {color} bike?", { name: NAME, color: COLOR }],
  ["Has", "______ your {who} got a job in {city}?", { who: ["brother", "sister", "uncle", "aunt"], city: CITY }],
  ["Has", "______ the {room} got a big window, {name}?", { room: ["kitchen", "living room", "classroom", "bedroom"], name: NAME }],
  ["Has", "______ she got a {pet} at home, {name}?", { pet: PET, name: NAME }],
  ["Has", "______ your teacher got a {thing}, {name}?", { thing: ["car", "bike", "dog", "garden"], name: NAME }],
  ["Has", "______ this {place} got free Wi-Fi, {name}?", { place: ["café", "hotel", "library", "bus"], name: NAME }],
  ["Has", "______ Grandma got any {food} for us, {name}?", { food: ["apples", "sweets", "bread", "cake"], name: NAME }],
  ["Has", "______ your village got a {place}, {name}?", { place: ["school", "hospital", "shop", "park"], name: NAME }],
  ["Has", "______ he got a {ill}, {who}?", { ill: ["cold", "temperature", "headache", "cough"], who: ["Doctor", "Mum", "Dad", "Nurse"] }],
  ["Has", "______ your phone got a good {thing}, {name}?", { thing: ["camera", "battery", "screen", "case"], name: NAME }],
  // Have (10)
  ["Have", "______ you got a {thing} for me, {name}?", { thing: ["pen", "pencil", "ruler", "charger"], name: NAME }],
  ["Have", "______ they got any {kids}, {name}?", { kids: ["children", "grandchildren", "pets", "cousins"], name: NAME }],
  ["Have", "______ we got {thing} for the {event}, {name}?", { thing: ["tickets", "plates", "chairs", "presents"], event: ["concert", "party", "picnic", "match"], name: NAME }],
  ["Have", "______ your grandparents got a {animal}, {name}?", { animal: ["cow", "horse", "donkey", "goat"], name: NAME }],
  ["Have", "______ you got time {when}, {name}?", { when: ["today", "tomorrow", "after school", "on Sunday"], name: NAME }],
  ["Have", "______ the students got their {thing}, {who}?", { thing: ["books", "pens", "notebooks", "dictionaries"], who: TEACH }],
  ["Have", "______ your friends got a {thing} for the trip to {city}?", { thing: ["car", "map", "tent", "camera"], city: CITY }],
  ["Have", "______ I got any {msg} today, {name}?", { msg: ["messages", "letters", "emails", "calls"], name: NAME }],
  ["Have", "______ you got any {food} in the {place}, {name}?", { food: ["milk", "juice", "cheese", "eggs"], place: ["fridge", "kitchen", "bag", "shop"] }],
  ["Have", "______ your cousins got a flat in {city}, {name}?", { city: CITY, name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "Has" ? W_HAS : W_HAVE, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const Q = "Make a question.";
const COR = "Correct the mistake.";
const ANS = "Write the question for this answer.";
const TRANSFORM = [
  // statement -> question (5)
  [Q, "She has got a {color} bike, {name}.", "______ a {color} bike, {name}?", "Has she got",
    "Put has before she, and got after she: Has she got …?", { color: COLOR, name: NAME }],
  [Q, "They have got a {pet} called {pn}.", "______ a {pet} called {pn}?", "Have they got",
    "Put have before they, and got after they: Have they got …?", { pet: PET, pn: PN }],
  [Q, "Your brother has got a {thing}, {name}.", "______ a {thing}, {name}?", "Has your brother got",
    "Has comes first, then the person, then got: Has your brother got …?", { thing: ["guitar", "laptop", "camera", "motorbike"], name: NAME }],
  [Q, "You have got a {thing} in your bag, {name}.", "______ a {thing} in your bag, {name}?", "Have you got",
    "Have comes first, then you, then got: Have you got …?", { thing: ["pen", "ruler", "charger", "phone"], name: NAME }],
  [Q, "The flat has got a {thing}, {name}.", "______ a {thing}, {name}?", "Has the flat got",
    "Has comes first, then the flat, then got: Has the flat got …?", { thing: ["balcony", "lift", "garden", "big kitchen"], name: NAME }],
  // correct the mistake (5)
  [COR, "Does she got a {pet}, {name}?", "______ she got a {pet}, {name}?", "Has",
    "With got, the question starts with Has, not Does.", { pet: PET, name: NAME }],
  [COR, "Have he got a {thing}, {name}?", "______ he got a {thing}, {name}?", "Has",
    "He → Has he got …?, not Have.", { thing: ["bike", "phone", "watch", "laptop"], name: NAME }],
  [COR, "Has they got a {color} car, {name}?", "______ they got a {color} car, {name}?", "Have",
    "They → Have they got …?, not Has.", { color: COLOR, name: NAME }],
  [COR, "Is your sister got a {thing}, {name}?", "______ your sister got a {thing}, {name}?", "Has",
    "The question with got starts with Has, not Is.", { thing: ["bike", "phone", "car", "camera"], name: NAME }],
  [COR, "Have got you a {thing}, {name}?", "______ a {thing}, {name}?", "Have you got",
    "The order is Have + you + got: Have you got …?", { thing: ["pen", "ruler", "pencil", "charger"], name: NAME }],
  // write the question for the answer (5)
  [ANS, "Yes, she has. She's got a {pet} called {pn}.", "______ she got a pet, {name}?", "Has",
    "The answer is Yes, she has, so the question is Has she got …?", { pet: PET, pn: PN, name: NAME }],
  [ANS, "No, they haven't. They walk to {place}.", "______ they got a car, {name}?", "Have",
    "The answer is No, they haven't, so the question is Have they got …?", { place: ["work", "school", "the bazaar", "the park"], name: NAME }],
  [ANS, "Yes, I have. I've got two {sib}.", "______ you got any brothers or sisters, {name}?", "Have",
    "The answer is Yes, I have, so the question is Have you got …?", { sib: ["brothers", "sisters", "little sisters", "big brothers"], name: NAME }],
  [ANS, "Yes, it has. It's got a big {room}.", "______ your flat got a big {room}, {name}?", "Has",
    "The answer is Yes, it has, so the question is Has your flat got …?", { room: ["kitchen", "balcony", "living room", "bathroom"], name: NAME }],
  [ANS, "No, he hasn't. His {thing} is at home.", "______ he got his {thing}, {name}?", "Has",
    "The answer is No, he hasn't, so the question is Has he got …?", { thing: ["ticket", "passport", "phone", "bag"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a new classmate one question with Have you got … ?", "Have you got … ?", ["exactly one question", "start with Have you got", "a thing word"]],
  ["Ask a friend one question about his or her brother or sister.", "Has he / she got … ?", ["exactly one question", "start with Has", "got"]],
  ["Ask one question about a friend's flat or house.", "Has your flat / house got … ?", ["exactly one question", "start with Has", "a room word"]],
  ["You are in a shop. Ask the shop assistant one question.", "Have you got any … ?", ["exactly one question", "Have you got any", "a food or thing word"]],
  ["Ask a friend one question about pets, then write his or her short answer.", "Have you got … ? – Yes, I have. / No, I haven't.", ["one question and one short answer", "Have you got", "Yes, I have or No, I haven't"]],
  ["Ask one question about your town or village with Has … got … ?", "Has our town got … ?", ["exactly one question", "start with Has", "a place word"]],
  ["Ask your teacher one question about the lesson.", "Have we got … ?", ["exactly one question", "start with Have we got", "a school word"]],
  ["Write two questions for a new friend: one with Have you got and one with Has your … got.", "Have you got … ? / Has your … got … ?", ["exactly two questions", "Have you got once", "Has your once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You want to know a new classmate. Write three or four questions with Have you got … ? and answer one of them.", "Have you got … ?", ["Have you got", "a short answer", "three or four questions"]],
  ["Your friend is moving to a new flat. Ask three or four questions about it.", "Has it got … ?", ["Has it got / Has the flat got", "a room word", "three or four questions"]],
  ["You are going on a picnic with friends. Ask three or four questions to check what you have got.", "Have we got … ? / Has … got … ?", ["Have we got", "Has … got once", "three or four questions"]],
  ["Ask a friend about his or her family: brothers, sisters, cousins and pets.", "Have you got … ? / Has he / she got … ?", ["Have you got", "Has he or she got", "three or four questions"]],
  ["Write a short dialogue in a shop: you ask about three things, and the assistant answers.", "Have you got any … ? – Yes, we have. / No, we haven't.", ["Have you got any", "a short answer", "three or four lines"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.have-got.have-got-question.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);