// Hand-authored: nouns-articles / plurals-agreement / irregular-plural (A1).
//
// Tests ONE point: irregular plurals (children, men, women, people, teeth,
// feet, mice, sheep, geese). A number, "many" or "are" forces the plural.
//
// Choose options: correct plural, base + s (childs, mans), double plural
// (childrens, mens), and the singular (L1 transfer: Uzbek keeps the singular
// after numbers). "persons" is never an option: it is a correct formal plural.
//
// Run: node tools/grammar-practice/authored/nouns-articles.plurals-agreement.irregular-plural.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "plurals-agreement", topic: "irregular-plural", level: "A1", pv: "2.5" };
const PL = { child: "children", man: "men", woman: "women", person: "people", tooth: "teeth", foot: "feet", mouse: "mice", sheep: "sheep", goose: "geese" };
const OPTS = {
  child: ["children", "childs", "childrens", "child"],
  man: ["men", "mans", "mens", "man"],
  woman: ["women", "womans", "womens", "woman"],
  person: ["people", "peoples", "persones", "person"],
  tooth: ["teeth", "tooths", "teeths", "tooth"],
  foot: ["feet", "foots", "feets", "foot"],
  mouse: ["mice", "mouses", "mices", "mouse"],
  sheep: ["sheep", "sheeps", "sheepes", "a sheep"],
  goose: ["geese", "gooses", "geeses", "goose"],
};
const why = (n) => n === "sheep"
  ? "Sheep does not change: one sheep, two sheep. Never add -s."
  : `${n} has an irregular plural: one ${n}, two ${PL[n]}. Don't add -s.`;

const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];

// [noun, sentence with ______, slots]; build adds "(noun)" after the blank
const ROWS = [
  ["child", "There are twenty ______ in {name}'s {group}.", { name: NAME, group: ["class", "group", "school bus", "team"] }],
  ["child", "My {person} has three ______ and lives in {city}.", { person: ["aunt", "uncle", "cousin", "neighbour"], city: CITY }],
  ["child", "The ______ are playing in the {place} with {name}.", { place: ["yard", "park", "garden", "street"], name: NAME }],
  ["man", "Two ______ are fixing the {thing} at our {place}.", { thing: ["roof", "window", "door", "gate"], place: ["house", "school", "office", "building"] }],
  ["man", "Three ______ from {city} work at the {place}.", { city: CITY, place: ["factory", "market", "station", "bank"] }],
  ["woman", "Four ______ are waiting at the {place} in {city}.", { place: ["bus stop", "station", "clinic", "bank"], city: CITY }],
  ["woman", "The ______ in my {group} play {sport} every Sunday.", { group: ["family", "team", "class", "office"], sport: ["volleyball", "tennis", "chess", "basketball"] }],
  ["person", "There are five ______ in {name}'s family in {city}.", { name: NAME, city: CITY }],
  ["person", "Many ______ visit {city} in {month}.", { city: ["Samarkand", "Bukhara", "Khiva", "Shakhrisabz"], month: ["May", "April", "September", "October"] }],
  ["person", "How many ______ are there in the {place}, {name}?", { place: ["room", "café", "bus", "queue"], name: NAME }],
  ["tooth", "{name}'s little {who} has six new ______.", { name: NAME, who: ["brother", "sister", "cousin", "son"] }],
  ["tooth", "The dentist checked all my ______ at the {place} on {day}.", { place: ["clinic", "hospital", "centre", "dentist's"], day: ["Monday", "Friday", "Tuesday", "Saturday"] }],
  ["foot", "My ______ are cold after the {activity}, {name}.", { activity: ["walk", "game", "run", "swim"], name: NAME }],
  ["foot", "Wash your hands and ______ before {meal}, {name}.", { meal: ["dinner", "bed", "lunch", "sleep"], name: NAME }],
  ["mouse", "There are two ______ in {name}'s {place}!", { name: NAME, place: ["kitchen", "garage", "cupboard", "barn"] }],
  ["mouse", "Our cat caught three ______ in the {place} last {time}.", { place: ["garden", "yard", "garage", "kitchen"], time: ["week", "night", "month", "Sunday"] }],
  ["sheep", "{who} has fifty ______ on the farm near {city}.", { who: ["My grandfather", "My uncle", "Our neighbour", "Aziz's father"], city: ["Jizzakh", "Nurata", "Karshi", "Navoi"] }],
  ["sheep", "We saw many ______ on the road to {city} with {name}.", { city: ["Jizzakh", "Nurata", "Karshi", "Navoi"], name: NAME }],
  ["goose", "There are six ______ near the {place} in {where}.", { place: ["lake", "river", "pond", "farm"], where: ["our village", "Parkent", "Chimgan", "the mountains"] }],
  ["goose", "{name}'s grandma has ten ______ and five {animals}.", { name: NAME, animals: ["hens", "ducks", "rabbits", "goats"] }],
];

const CHOOSE = ROWS.map(([n, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS[n], key: 0, why: why(n), slots }));
const BUILD = ROWS.map(([n, s, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: "Write the plural of the word in brackets.",
  source: s.replace("______", `______ (${n})`), key: PL[n], why: why(n), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_MANY = "Read the first sentence. Now there are more. Complete the second sentence with the plural noun.";
const T_FIX = "The first sentence has a mistake. Complete the correct sentence.";
const T_ANS = "Answer the question. Use the noun and the number in brackets.";
const TRANSFORM = [
  // kind 1: one -> many
  [T_MANY, "child", "{name} has one child in {city}.", "{name}'s sister has three ______ in {city}.", { name: NAME, city: CITY }],
  [T_MANY, "man", "One man works at the {place} with {name}.", "Now five ______ work at the {place} with {name}.", { place: ["factory", "market", "station", "bank"], name: NAME }],
  [T_MANY, "mouse", "There is one mouse in the {place}, {name}.", "Now there are four ______ in the {place}, {name}.", { place: ["kitchen", "garage", "cupboard", "barn"], name: NAME }],
  [T_MANY, "tooth", "{name}'s baby has one {adj} tooth.", "Now she has four {adj} ______.", { name: NAME, adj: ["new", "small", "white", "little"] }],
  [T_MANY, "goose", "We have one goose at our {place} in {where}.", "Our neighbours have six ______ at their {place} in {where}.", { place: ["farm", "dacha", "house", "garden"], where: ["Chirchiq", "the village", "Parkent", "Bostanliq"] }],
  // kind 2: fix the mistake
  [T_FIX, "woman", "Three womans work in {name}'s {place}.", "Three ______ work in {name}'s {place}.", { name: NAME, place: ["shop", "office", "café", "bakery"] }],
  [T_FIX, "person", "Ten peoples live in our {building} in {city}.", "Ten ______ live in our {building} in {city}.", { building: ["building", "block", "house", "street"], city: CITY }],
  [T_FIX, "foot", "My foots are wet after the {weather}, {name}.", "My ______ are wet after the {weather}, {name}.", { weather: ["rain", "snow", "storm", "walk"], name: NAME }],
  [T_FIX, "sheep", "{who} has twenty sheeps near {city}.", "{who} has twenty ______ near {city}.", { who: ["My grandfather", "My uncle", "Our neighbour", "Aziz's father"], city: ["Jizzakh", "Nurata", "Karshi", "Navoi"] }],
  [T_FIX, "child", "The childrens are in the {place} with {name}.", "The ______ are in the {place} with {name}.", { place: ["yard", "park", "garden", "kitchen"], name: NAME }],
  // kind 3: answer with the noun and number in brackets
  [T_ANS, "person", "(person, 12) How many are in your {group}, {name}?", "There are twelve ______ in my {group}.", { group: ["class", "group", "team", "family"], name: NAME }],
  [T_ANS, "sheep", "(sheep, 30) How many are on the farm in {where}, {name}?", "There are thirty ______ on the farm in {where}.", { where: ["Nurata", "the village", "Jizzakh", "the mountains"], name: NAME }],
  [T_ANS, "man", "(man, 6) How many are in your {team}, {name}?", "There are six ______ in my {team}.", { team: ["team", "office", "band", "group"], name: NAME }],
  [T_ANS, "woman", "(woman, 4) How many are at the {place} in {city}?", "There are four ______ at the {place}.", { place: ["bus stop", "station", "clinic", "bank"], city: CITY }],
  [T_ANS, "child", "(child, 2) How many does {name}'s aunt in {city} have?", "She has two ______.", { name: NAME, city: CITY }],
].map(([instr, n, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: PL[n], why: why(n), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the children in your family.", "children", ["exactly one sentence", "must use children"]],
  ["Write one sentence about how many people live in your home.", "people", ["exactly one sentence", "must use people", "must use a number"]],
  ["Write one sentence about the men and women in your street or office.", "men / women", ["exactly one sentence", "must use men", "must use women"]],
  ["Write one sentence about your teeth.", "teeth", ["exactly one sentence", "must use teeth"]],
  ["Write one sentence about your feet after a long walk.", "feet", ["exactly one sentence", "must use feet"]],
  ["Write one sentence about animals on a farm. Use sheep.", "sheep", ["exactly one sentence", "must use sheep", "must use a number"]],
  ["Write one sentence about mice or geese.", "mice / geese", ["exactly one sentence", "must use mice or geese"]],
  ["Write two sentences: one with children and one with people.", "children / people", ["exactly two sentences", "must use children", "must use people"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your family. Write three or four sentences.", "irregular plurals", ["people", "children", "a number"]],
  ["Describe a busy bus stop or market. Write three or four sentences.", "irregular plurals", ["people", "men or women", "There are"]],
  ["Describe a farm in a village. Write three or four sentences.", "irregular plurals", ["sheep", "geese or mice", "a number"]],
  ["Write about a visit to the dentist. Write three or four sentences.", "teeth", ["teeth", "the dentist", "two sentences or more"]],
  ["Write about your class or team. Write three or four sentences.", "irregular plurals", ["people", "men, women or children", "How many"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.plurals-agreement.irregular-plural.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.plurals-agreement.irregular-plural.json`);