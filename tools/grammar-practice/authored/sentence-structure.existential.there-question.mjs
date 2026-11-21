// Hand-authored: sentence-structure / existential / there-question (A1).
// Path fill P20 (2026-11-14, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: "Is there ...? with an uncountable noun" (______ any milk
// in the fridge?: Is there / Are there / There is / There are).
// Triage: kept, separate from there-is-are (statements only) and
// there-was-were (past statements): every item here is a present question
// or its short answer. The noun after the blank decides the key and is
// NEVER slotted.
// Choose, three kinds: 8 Is there any + uncountable (milk, bread, homework,
// news …), 6 Are there any + plural, 6 short answers (Yes, there is / No,
// there aren't vs it is / they aren't, the wrong number, and question order).
// Every question item has "any" after the blank, so "There is / There are"
// can never be read as a spoken echo question ("There's a bank here?").
// Singular a / an questions are tested in build, where the choice is only
// Is there / Are there (closed class, listed in instr).
// Build: "Write Is there or Are there." 7 uncountable, 6 a / an, 7 plural.
// No source prints "there" anywhere else, so the typed key is never echoed.
// Transform: 5 statement with some → question with any / 5 correct the
// mistake / 5 write the question for the answer.
//
// Run: node tools/grammar-practice/authored/sentence-structure.existential.there-question.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "existential", topic: "there-question", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const UNC = ["Is there", "Are there", "There is", "There are"];
const PLU = ["Are there", "Is there", "There are", "There is"];
const YES_IS = ["there is", "it is", "there are", "is there"];
const YES_ARE = ["there are", "they are", "there is", "are there"];
const NO_ISNT = ["there isn't", "it isn't", "there aren't", "isn't there"];
const NO_ARENT = ["there aren't", "they aren't", "there isn't", "aren't there"];
const W_U = (n) => `${n[0].toUpperCase() + n.slice(1)} is uncountable, so the question is Is there any ${n} …? The verb comes before there.`;
const W_P = (n) => `${n[0].toUpperCase() + n.slice(1)} is plural, so the question is Are there any ${n} …? The verb comes before there.`;
const W_S = {
  yi: "The question is Is there …?, so the short answer is Yes, there is. Not it is.",
  ya: "The question is Are there …?, so the short answer is Yes, there are. Not they are.",
  ni: "The question is Is there …?, so the short answer is No, there isn't. Not it isn't.",
  na: "The question is Are there …?, so the short answer is No, there aren't. Not they aren't.",
};

/* ---------------- choose: 20 mcq ---------------- */
// [options, why, prompt, slots]
const CHOOSE = [
  // Is there any + uncountable (8)
  [UNC, W_U("milk"), "______ any milk in the {place}, {name}?",
    { place: ["fridge", "jug", "bottle", "kitchen"], name: NAME }],
  [UNC, W_U("bread"), "______ any bread on the {surface}, {name}?",
    { surface: ["table", "plate", "shelf", "tray"], name: NAME }],
  [UNC, W_U("sugar"), "______ any sugar in my {drink}, {name}?",
    { drink: ["tea", "coffee", "cup", "cocoa"], name: NAME }],
  [UNC, W_U("rice"), "______ any rice left in the {pot}, {name}?",
    { pot: ["pot", "pan", "bowl", "bag"], name: NAME }],
  [UNC, W_U("homework"), "______ any homework for {day}, {name}?",
    { day: ["Monday", "tomorrow", "the weekend", "Friday"], name: NAME }],
  [UNC, W_U("water"), "______ any water in the {container}, {who}?",
    { container: ["bottle", "kettle", "jug", "glass"], who: ["Mum", "Dad", "Aziz", "Olga"] }],
  [UNC, W_U("news"), "______ any news about the {event}, {name}?",
    { event: ["match", "trip", "test", "concert"], name: NAME }],
  [UNC, W_U("cheese"), "______ any cheese in the {place}, {name}?",
    { place: ["fridge", "shop", "bag", "kitchen"], name: NAME }],
  // Are there any + plural (6)
  [PLU, W_P("eggs"), "______ any eggs in the {container}, {name}?",
    { container: ["fridge", "box", "basket", "bag"], name: NAME }],
  [PLU, W_P("cafés"), "______ any good cafés near the {place}, {name}?",
    { place: ["station", "bazaar", "park", "school"], name: NAME }],
  [PLU, W_P("students"), "______ any students in the {room} now, {name}?",
    { room: ["classroom", "library", "gym", "canteen"], name: NAME }],
  [PLU, W_P("buses"), "______ any buses to {city} today, {name}?",
    { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], name: NAME }],
  [PLU, W_P("apples"), "______ any apples on the trees in your {place}, {name}?",
    { place: ["garden", "village", "yard", "street"], name: NAME }],
  [PLU, W_P("chairs"), "______ any chairs in the {room}, {name}?",
    { room: ["kitchen", "hall", "garden", "office"], name: NAME }],
  // short answers (6)
  [YES_IS, W_S.yi, "Is there any juice in the {container}, {name}? – Yes, ______.",
    { container: ["fridge", "jug", "bottle", "glass"], name: NAME }],
  [YES_IS, W_S.yi, "Is there a park near your {home}, {name}? – Yes, ______.",
    { home: ["flat", "house", "school", "office"], name: NAME }],
  [YES_ARE, W_S.ya, "Are there any shops in your {area}, {name}? – Yes, ______.",
    { area: ["street", "village", "building", "area"], name: NAME }],
  [NO_ISNT, W_S.ni, "Is there any soup in the {pot}, {name}? – No, ______.",
    { pot: ["pot", "pan", "bowl", "fridge"], name: NAME }],
  [NO_ARENT, W_S.na, "Are there any tickets for the {event}, {name}? – No, ______.",
    { event: ["concert", "film", "match", "show"], name: NAME }],
  [NO_ISNT, W_S.ni, "Is there a lift in your {building}, {name}? – No, ______.",
    { building: ["building", "school", "block", "office"], name: NAME }],
].map(([base, why, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write Is there or Are there.";
const WB = {
  u: (n) => `${n[0].toUpperCase() + n.slice(1)} is uncountable, so ask Is there …?`,
  a: (n) => `${n} is one thing, so ask Is there …?`,
  p: (n) => `${n[0].toUpperCase() + n.slice(1)} is plural, so ask Are there …?`,
};
const BUILD = [
  // Is there + uncountable (7)
  ["u", "juice", "______ any juice in the {place}, {name}?", { place: ["fridge", "jug", "bottle", "glass"], name: NAME }],
  ["u", "salt", "______ any salt in the {dish}, {name}?", { dish: ["soup", "salad", "plov", "sauce"], name: NAME }],
  ["u", "snow", "______ any snow in {city} today, {name}?", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], name: NAME }],
  ["u", "free time", "______ any free time in your {plan}, {name}?", { plan: ["timetable", "week", "day", "plans"], name: NAME }],
  ["u", "money", "______ any money in your {thing}, {name}?", { thing: ["bag", "pocket", "wallet", "purse"], name: NAME }],
  ["u", "information", "______ any information about the {event} on the website, {name}?", { event: ["trip", "concert", "test", "course"], name: NAME }],
  ["u", "tea", "______ any tea in the {pot}, {who}?", { pot: ["teapot", "cup", "flask", "pot"], who: ["Mum", "Grandma", "Aziz", "Olga"] }],
  // Is there + a / an (6)
  ["a", "A bank", "______ a bank near the {place}, {name}?", { place: ["station", "bazaar", "hotel", "park"], name: NAME }],
  ["a", "A bus stop", "______ a bus stop near your {home}, {name}?", { home: ["flat", "house", "school", "office"], name: NAME }],
  ["a", "An English club", "______ an English club at your {place}, {name}?", { place: ["school", "college", "library", "centre"], name: NAME }],
  ["a", "A doctor", "______ a doctor in the {place}, {name}?", { place: ["building", "hotel", "village", "office"], name: NAME }],
  ["a", "A cinema", "______ a cinema in your {town}, {name}?", { town: ["town", "village", "area", "district"], name: NAME }],
  ["a", "A test", "______ a test on {day}, {who}?", { day: ["Monday", "Friday", "Wednesday", "Thursday"], who: ["Ms Ivanova", "Mr Karimov", "teacher", "Mrs Karimova"] }],
  // Are there + plural (7)
  ["p", "oranges", "______ any oranges in the {container}, {name}?", { container: ["basket", "box", "bag", "fridge"], name: NAME }],
  ["p", "films", "______ any good films on TV {when}, {name}?", { when: ["tonight", "today", "this evening", "tomorrow"], name: NAME }],
  ["p", "girls", "______ any girls in your {team}, {name}?", { team: ["team", "club", "group", "class"], name: NAME }],
  ["p", "people", "______ many people at the {place}, {name}?", { place: ["bazaar", "park", "stadium", "station"], name: NAME }],
  ["p", "trains", "______ any trains to {city} at night, {name}?", { city: ["Khiva", "Bukhara", "Termez", "Samarkand"], name: NAME }],
  ["p", "mistakes", "______ any mistakes in my {text}, {who}?", { text: ["essay", "letter", "homework", "test"], who: ["Ms Ivanova", "Mr Karimov", "Mum", "Dad"] }],
  ["p", "bedrooms", "______ two bedrooms in your {home}, {name}?", { home: ["flat", "house", "new flat", "new house"], name: NAME }],
].map(([k, n, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: k === "p" ? "Are there" : "Is there", why: WB[k](n), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const Q = "Make a question. Use any.";
const COR = "Correct the mistake.";
const ANS = "Write the question for this answer.";
const TRANSFORM = [
  // statement with some -> question with any (5)
  [Q, "There is some milk in the {place}.", "______ milk in the {place}, {name}?", "Is there any",
    "Milk is uncountable: Is there any milk …? In questions, some becomes any.", { place: ["fridge", "jug", "kitchen", "bottle"], name: NAME }],
  [Q, "There are some eggs in the {container}.", "______ eggs in the {container}, {name}?", "Are there any",
    "Eggs is plural: Are there any eggs …? In questions, some becomes any.", { container: ["basket", "box", "bag", "fridge"], name: NAME }],
  [Q, "There is some homework for {day}.", "______ homework for {day}, {name}?", "Is there any",
    "Homework is uncountable: Is there any homework …?", { day: ["Monday", "Friday", "tomorrow", "the weekend"], name: NAME }],
  [Q, "There are some shops near the {place}.", "______ shops near the {place}, {name}?", "Are there any",
    "Shops is plural: Are there any shops …?", { place: ["station", "park", "school", "bazaar"], name: NAME }],
  [Q, "There is some bread on the {surface}.", "______ bread on the {surface}, {name}?", "Is there any",
    "Bread is uncountable: Is there any bread …?", { surface: ["table", "shelf", "plate", "tray"], name: NAME }],
  // correct the mistake (5)
  [COR, "Are there any water in the {container}, {name}?", "______ any water in the {container}, {name}?", "Is there",
    "Water is uncountable, so use Is there, not Are there.", { container: ["bottle", "glass", "jug", "kettle"], name: NAME }],
  [COR, "Is there any apples in the {container}, {name}?", "______ any apples in the {container}, {name}?", "Are there",
    "Apples is plural, so use Are there, not Is there.", { container: ["bag", "box", "basket", "fridge"], name: NAME }],
  [COR, "There is any cheese in the {place}, {name}?", "______ any cheese in the {place}, {name}?", "Is there",
    "In a question, the verb comes first: Is there …?", { place: ["fridge", "shop", "bag", "kitchen"], name: NAME }],
  [COR, "Is any sugar in the {thing}, {name}?", "______ any sugar in the {thing}, {name}?", "Is there",
    "The question needs there: Is there any sugar …?", { thing: ["tea", "cupboard", "bowl", "jar"], name: NAME }],
  [COR, "There are any chairs in the {room}, {name}?", "______ any chairs in the {room}, {name}?", "Are there",
    "In a question, the verb comes first: Are there …?", { room: ["kitchen", "hall", "garden", "office"], name: NAME }],
  // write the question for the answer (5)
  [ANS, "Yes, there are three cafés on our {street}.", "______ any cafés on your {street}, {name}?", "Are there",
    "The answer is there are + plural, so ask Are there …?", { street: ["street", "road", "main street", "avenue"], name: NAME }],
  [ANS, "No, there isn't any juice. I drank it {when}.", "______ any juice in the fridge, {name}?", "Is there",
    "The answer is there isn't, so ask Is there …?", { when: ["yesterday", "this morning", "at lunch", "last night"], name: NAME }],
  [ANS, "Yes, there is a pharmacy near the {place}.", "______ a pharmacy near the {place}, {name}?", "Is there",
    "A pharmacy is one thing, so ask Is there a …?", { place: ["station", "bank", "park", "school"], name: NAME }],
  [ANS, "No, there aren't any buses after {time}.", "______ any buses after {time}, {name}?", "Are there",
    "Buses is plural, so ask Are there any …?", { time: ["ten", "eleven", "midnight", "half past ten"], name: NAME }],
  [ANS, "Yes, there is some soup in the {pot}.", "______ any soup in the {pot}, {name}?", "Is there",
    "Soup is uncountable, so ask Is there any soup …?", { pot: ["pot", "pan", "fridge", "kitchen"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one question about food in your fridge.", "Is there any … ? / Are there any … ?", ["exactly one question", "start with Is there or Are there", "a food word"]],
  ["Ask a friend one question about their street.", "Is there a … ? / Are there any … ?", ["exactly one question", "start with Is there or Are there", "a place word"]],
  ["Ask one question about your school with Is there a … ?", "Is there a … ?", ["exactly one question", "start with Is there a", "a school word"]],
  ["Ask one question about homework or a test.", "Is there any … ? / Is there a … ?", ["exactly one question", "start with Is there", "a school word"]],
  ["Ask a tourist information office one question about your town.", "Are there any … ?", ["exactly one question", "start with Are there any", "a plural noun"]],
  ["Write one question about a friend's flat or house and its short answer.", "Is there … ? – Yes, there is. / No, there isn't.", ["one question and one short answer", "Is there or Are there", "a room word"]],
  ["Ask one question about transport from your town to another city.", "Are there any buses / trains … ?", ["exactly one question", "start with Are there any", "a city name"]],
  ["Write two questions for a new classmate: one with Is there and one with Are there.", "Is there … ? / Are there … ?", ["exactly two questions", "Is there once", "Are there once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["A friend from another city wants to visit your town. Write three or four questions they could ask you about it, and answer one.", "Is there … ? / Are there … ?", ["Is there", "Are there", "a short answer"]],
  ["You are going to cook dinner. Ask your family three or four questions about what is in the kitchen.", "Is there any … ? / Are there any … ?", ["Is there any + uncountable", "Are there any + plural", "three or four questions"]],
  ["You want to rent a flat. Write three or four questions for the owner.", "Is there … ? / Are there … ?", ["Is there a", "Are there any", "three or four questions"]],
  ["Describe your street for a new neighbour. Start with a question they might ask, then answer it.", "Is there … ? + there is / there are", ["one Is there or Are there question", "there is / there are", "three or four sentences"]],
  ["You are starting at a new school. Write three or four questions about it for a student there.", "Is there … ? / Are there … ?", ["Is there", "Are there", "a school word"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.existential.there-question.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);