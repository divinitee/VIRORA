// Hand-authored: nouns-articles / plurals-agreement / es-plural (A1).
//
// Tests ONE point: -es plural after -s, -ss, -sh, -ch and -x (boxes, buses,
// glasses, dishes, watches). Rule 14 (course audit): no topic teaches the
// regular -s plural, so each stage OPENS with regular -s nouns (books, pens,
// apples, cats, bags) before the -es nouns.
// The number or "many" before the blank forces a plural.
//
// Choose options: correct plural, the wrong ending (-s vs -es), the singular
// (L1 transfer: Uzbek uses the singular after numbers), and an apostrophe
// form ("box's"), a very common written error.
//
// Run: node tools/grammar-practice/authored/nouns-articles.plurals-agreement.es-plural.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "plurals-agreement", topic: "es-plural", level: "A1", pv: "2.5" };
const REG = new Set(["book", "pen", "apple", "cat", "bag"]);
const PL = (n) => (REG.has(n) ? n + "s" : n + "es");
const opts = (n) => (REG.has(n) ? [n + "s", n + "es", n, n + "'s"] : [n + "es", n + "s", n, n + "'s"]);
const why = (n) => {
  if (REG.has(n)) return `Most nouns just add -s for more than one: ${n} → ${n}s.`;
  const end = n.endsWith("x") ? "-x" : n.endsWith("ch") ? "-ch" : n.endsWith("sh") ? "-sh" : n.endsWith("ss") ? "-ss" : "-s";
  return `${n} ends in ${end}, so add -es: ${n} → ${n}es.`;
};

const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const SHOP = ["market", "shop", "bazaar", "supermarket"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];

// [noun, choose prompt, build source, slots]  (regular -s nouns first, rule 14)
const ROWS = [
  ["book", "I have three ______ about {topic} in my {bag}.", "I have three ______ (book) about {topic} in my {bag}.",
    { topic: ["animals", "space", "football", "history"], bag: ["bag", "room", "backpack", "desk"] }],
  ["pen", "There are two ______ on {name}'s {furniture}.", "There are two ______ (pen) on {name}'s {furniture}.",
    { name: NAME, furniture: ["desk", "table", "bed", "chair"] }],
  ["apple", "{name}'s mum bought five ______ at the {shop}.", "{name}'s mum bought five ______ (apple) at the {shop}.", { name: NAME, shop: SHOP }],
  ["cat", "My {person} in {city} has two ______ and a dog.", "My {person} in {city} has two ______ (cat) and a dog.",
    { person: ["aunt", "grandmother", "cousin", "neighbour"], city: CITY }],
  ["bag", "We have four ______ for the trip to {city} with {who}.", "We have four ______ (bag) for the trip to {city} with {who}.",
    { city: CITY, who: ["Grandma", "our cousins", "Dad", "the kids"] }],
  ["box", "There are three ______ in the {room} for {name}.", "There are three ______ (box) in the {room} for {name}.",
    { room: ["hall", "kitchen", "office", "garage"], name: NAME }],
  ["bus", "Two ______ go to the {place} from our street.", "Two ______ (bus) go to the {place} from our street.",
    { place: ["market", "airport", "centre", "station"] }],
  ["glass", "Can you bring two ______ of {drink}, {name}?", "Can you bring two ______ (glass) of {drink}, {name}?",
    { drink: ["water", "juice", "milk", "tea"], name: NAME }],
  ["dress", "My sister has three new ______ for the {event}.", "My sister has three new ______ (dress) for the {event}.",
    { event: ["wedding", "party", "holiday", "concert"] }],
  ["watch", "Dad has two ______, a black one and a {colour} one.", "Dad has two ______ (watch), a black one and a {colour} one.",
    { colour: ["white", "silver", "blue", "brown"] }],
  ["dish", "There are many dirty ______ in the {place}.", "There are many dirty ______ (dish) in the {place}.",
    { place: ["sink", "kitchen", "café", "canteen"] }],
  ["class", "{name} and I have four English ______ every week.", "{name} and I have four English ______ (class) every week.", { name: NAME }],
  ["sandwich", "I made two ______ with {filling} for {meal}.", "I made two ______ (sandwich) with {filling} for {meal}.",
    { filling: ["cheese", "egg", "chicken", "tomato"], meal: ["lunch", "school", "the trip", "breakfast"] }],
  ["fox", "We saw two ______ in the {place} near {where}.", "We saw two ______ (fox) in the {place} near {where}.",
    { place: ["forest", "field", "mountains", "hills"], where: ["the village", "our dacha", "Chimgan", "the lake"] }],
  ["match", "{team} plays two ______ in {month}.", "{team} plays two ______ (match) in {month}.",
    { team: ["Our team", "My brother's team", "The school team", "Our club"], month: ["May", "June", "April", "March"] }],
  ["peach", "Grandma gave us six ______ from her {place}.", "Grandma gave us six ______ (peach) from her {place}.",
    { place: ["garden", "tree", "dacha", "village"] }],
  ["brush", "I need two ______ for my {subject} lesson.", "I need two ______ (brush) for my {subject} lesson.",
    { subject: ["art", "painting", "drawing", "craft"] }],
  ["beach", "There are many beautiful ______ in {country}.", "There are many beautiful ______ (beach) in {country}.",
    { country: ["Turkey", "Georgia", "Spain", "Thailand"] }],
  ["bench", "There are five ______ in the {place} near our {home}.", "There are five ______ (bench) in the {place} near our {home}.",
    { place: ["park", "yard", "square", "garden"], home: ["house", "flat", "school", "college"] }],
  ["lunch", "Mum makes three ______ every morning for {who}.", "Mum makes three ______ (lunch) every morning for {who}.",
    { who: ["us", "my brothers", "the family", "the kids"] }],
];

const CHOOSE = ROWS.map(([n, prompt, , slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(n), key: 0, why: why(n), slots }));
const BUILD = ROWS.map(([n, , source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill",
  instr: "Write the plural of the word in brackets.", source, key: PL(n), why: why(n), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_MANY = "Read the first sentence. Now there are more. Complete the second sentence with the plural noun.";
const T_ARE = "Read the first sentence. Change is to are. Complete the second sentence with the plural noun.";
const T_FIX = "The first sentence has a mistake. Complete the correct sentence.";
const TRANSFORM = [
  // kind 1: one -> many (regular -s first, rule 14)
  [T_MANY, "book", "{name} has one book about {topic}.", "{name}'s brother has four ______ about {topic}.", { name: NAME, topic: ["animals", "space", "football", "cars"] }],
  [T_MANY, "box", "There is one box in the {room} for {name}.", "Now there are six ______ in the {room} for {name}.", { room: ["hall", "kitchen", "garage", "office"], name: NAME }],
  [T_MANY, "fox", "We saw a fox near {where} with {name}.", "The next day we saw three ______ near {where} with {name}.", { where: ["the village", "our dacha", "the river", "the forest"], name: NAME }],
  [T_MANY, "watch", "{name} has one {colour} watch.", "{name}'s father has three {colour} ______.", { name: NAME, colour: ["black", "silver", "white", "brown"] }],
  [T_MANY, "sandwich", "{name} wants one sandwich for {meal}.", "{name}'s brother wants two ______ for {meal}.", { name: NAME, meal: ["lunch", "breakfast", "the trip", "school"] }],
  // kind 2: there is ... -> there are ...
  [T_ARE, "cat", "There is a cat in our {place}, {name}.", "There are two ______ in our {place} now, {name}.", { place: ["yard", "garden", "building", "street"], name: NAME }],
  [T_ARE, "bus", "There is a bus at the {place} in {city}.", "There are two ______ at the {place} in {city} now.", { place: ["bus stop", "station", "school", "market"], city: CITY }],
  [T_ARE, "glass", "There is a glass of {drink} on the table.", "There are four ______ of {drink} on the {furniture}.", { drink: ["water", "juice", "milk", "tea"], furniture: ["table", "shelf", "tray", "desk"] }],
  [T_ARE, "bench", "There is a bench in the {place} near {home}.", "There are many ______ in the {place} near {home}.", { place: ["park", "yard", "square", "garden"], home: ["our house", "our flat", "my school", "the college"] }],
  [T_ARE, "dish", "There is a dish in the {place}, {name}.", "There are ten ______ in the {place}, {name}.", { place: ["sink", "kitchen", "cupboard", "canteen"], name: NAME }],
  // kind 3: fix the mistake
  [T_FIX, "apple", "{name} bought three apple at the {shop}.", "{name} bought three ______ at the {shop}.", { name: NAME, shop: SHOP }],
  [T_FIX, "box", "We need two boxs for the {thing}, {name}.", "We need two ______ for the {thing}, {name}.", { thing: ["books", "toys", "shoes", "plates"], name: NAME }],
  [T_FIX, "dress", "My sister has five dresss for {event} in {city}.", "My sister has five ______ for {event} in {city}.", { event: ["the wedding", "the party", "summer", "school"], city: CITY }],
  [T_FIX, "peach", "Grandma gave {who} two peach's from her {place}.", "Grandma gave {who} two ______ from her {place}.", { who: ["me", "us", "Aziz", "my sister"], place: ["garden", "tree", "dacha", "village"] }],
  [T_FIX, "class", "{name} has three {subject} class today.", "{name} has three {subject} ______ today.", { name: NAME, subject: ["English", "maths", "music", "art"] }],
].map(([instr, n, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: PL(n), why: why(n), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about things in your bag. Use a number and a plural with -s.", "plural -s", ["exactly one sentence", "must use a number", "must use a plural with -s"]],
  ["Write one sentence with boxes.", "boxes", ["exactly one sentence", "must use boxes"]],
  ["Write one sentence about your classes this week.", "classes", ["exactly one sentence", "must use classes"]],
  ["Write one sentence about food in your kitchen. Use sandwiches or peaches.", "-es plural", ["exactly one sentence", "must use sandwiches or peaches"]],
  ["Write one sentence about the buses in your town.", "buses", ["exactly one sentence", "must use buses"]],
  ["Write one sentence with watches or glasses.", "-es plural", ["exactly one sentence", "must use watches or glasses"]],
  ["Write one sentence with a plural with -s and one with a plural with -es.", "-s / -es", ["exactly two sentences", "one plural with -s", "one plural with -es"]],
  ["Write one sentence about dirty dishes.", "dishes", ["exactly one sentence", "must use dishes"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your kitchen. Write three or four sentences with numbers.", "-s / -es plurals", ["a plural with -s", "dishes or glasses", "There are"]],
  ["Describe your school week. Write three or four sentences.", "-s / -es plurals", ["classes", "a plural with -s", "a number"]],
  ["Write a shopping list and a sentence about it. Use numbers.", "-s / -es plurals", ["apples or books", "peaches or sandwiches", "a number"]],
  ["Describe your street or your park. Write three or four sentences.", "-es plurals", ["buses or benches", "There are", "a number"]],
  ["You are moving to a new flat. Write three or four sentences about what you need.", "-es plurals", ["boxes", "a plural with -s", "need"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.plurals-agreement.es-plural.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.plurals-agreement.es-plural.json`);