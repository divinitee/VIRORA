// Hand-authored: verb-patterns / have-got / have-got-negative (A1).
// Path fill P23 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: haven't got / hasn't got (They haven't ______ any money:
// got / gets / getting / have).
// Sibling scope: negative statements ONLY. Positive statements are P21,
// questions and short answers P22. No "don't have" keys: "I don't have a
// pen" is correct English, so don't / doesn't are offered only before
// "got", where they are always wrong.
// Choose, two kinds: 12 pick the word after haven't / hasn't (got vs gets /
// getting / have or has: the placement's own options); 8 pick the negative
// auxiliary before a printed "got" (hasn't / haven't vs doesn't / don't and
// isn't / aren't / am not). The second clause of every aux item gives a
// reason (She walks to school) so the sentence reads naturally.
// Build: "Write haven't got or hasn't got." 10 each; no source prints got.
// Transform: 5 positive → negative / 5 correct the mistake / 5 don't have /
// doesn't have → haven't got / hasn't got.
//
// Run: node tools/grammar-practice/authored/verb-patterns.have-got.have-got-negative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "have-got", topic: "have-got-negative", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const COLOR = ["white", "red", "blue", "black"];
const CITY = ["Samarkand", "Bukhara", "Tashkent", "Fergana"];
const PET = ["dog", "cat", "parrot", "rabbit"];
const PETS = ["cats", "dogs", "birds", "rabbits"];
const PN = ["Bars", "Max", "Luna", "Snow"];
const SIB = ["brothers", "sisters", "cousins", "aunts"];
const ADULT = ["Mum", "Dad", "Grandma", "Aziz"];
const TEACH = ["Ms Ivanova", "Mr Karimov", "teacher", "Mrs Karimova"];
const BUS = ["bus", "metro", "minibus", "tram"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const G_HAVE = ["got", "gets", "getting", "have"];
const G_HAS = ["got", "gets", "getting", "has"];
const A_HASNT = ["hasn't", "haven't", "doesn't", "isn't"];
const A_HAVENT = ["haven't", "hasn't", "don't", "aren't"];
const A_HAVENT_I = ["haven't", "hasn't", "don't", "am not"];
const W_G = "The negative is haven't got or hasn't got: got never changes.";
const W_HASNT = "With he, she, it or one person or thing, the negative is hasn't got.";
const W_HAVENT = "With I, you, we, they or more than one person, the negative is haven't got.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  // the word after haven't / hasn't (12)
  [G_HAVE, W_G, "They haven't ______ any money for the {thing}, {name}.", { thing: ["bus", "tickets", "cinema", "taxi"], name: NAME }],
  [G_HAVE, W_G, "I haven't ______ a {thing} today, {name}.", { thing: ["pen", "ruler", "pencil", "charger"], name: NAME }],
  [G_HAS, W_G, "{name} hasn't ______ a {pet}.", { name: NAME, pet: PET }],
  [G_HAVE, W_G, "We haven't ______ any {food} at home, {who}.", { food: ["milk", "bread", "eggs", "sugar"], who: ADULT }],
  [G_HAS, W_G, "Our {home} hasn't ______ a {thing}.", { home: ["flat", "house", "new flat", "old house"], thing: ["balcony", "lift", "garden", "garage"] }],
  [G_HAVE, W_G, "My grandparents haven't ______ a {thing} in their {place}.", { thing: ["TV", "computer", "microwave", "washing machine"], place: ["flat", "house", "village house", "old house"] }],
  [G_HAS, W_G, "{who} hasn't ______ a {thing}, so he uses mine.", { who: ["My brother", "My cousin", "Aziz", "Timur"], thing: ["phone", "laptop", "bike", "camera"] }],
  [G_HAVE, W_G, "You haven't ______ your {thing}, {name}! Go back and get it.", { thing: ["bag", "phone", "ticket", "coat"], name: NAME }],
  [G_HAS, W_G, "This {room} hasn't ______ a {thing}.", { room: ["room", "classroom", "kitchen", "bedroom"], thing: ["window", "clock", "lamp", "table"] }],
  [G_HAVE, W_G, "Sorry, I haven't ______ time {when}, {name}.", { when: ["today", "now", "this evening", "on Saturday"], name: NAME }],
  [G_HAS, W_G, "{name} hasn't ______ any {sib}.", { name: NAME, sib: SIB }],
  [G_HAVE, W_G, "The children haven't ______ their {thing} with them, {who}.", { thing: ["books", "pens", "coats", "hats"], who: TEACH }],
  // the auxiliary (8)
  [A_HASNT, W_HASNT, "{name} ______ got a {thing}. She takes the bus.", { name: SHE, thing: ["bike", "car", "scooter", "motorbike"] }],
  [A_HAVENT, W_HAVENT, "We ______ got a car, so we take the {bus} to {place}.", { bus: BUS, place: ["work", "school", "the bazaar", "the park"] }],
  [A_HASNT, W_HASNT, "My {who} ______ got a garden. He lives in a flat in {city}.", { who: ["uncle", "grandpa", "cousin", "brother"], city: CITY }],
  [A_HAVENT_I, W_HAVENT, "I ______ got any {food}. Can I have some of yours, {name}?", { food: ["water", "juice", "bread", "tea"], name: NAME }],
  [A_HASNT, W_HASNT, "Our {school} ______ got a pool, but it has a big {place}.", { school: ["school", "college", "new school", "old school"], place: ["gym", "garden", "library", "football pitch"] }],
  [A_HAVENT, W_HAVENT, "They ______ got any {pets}. They live in a small {home}.", { pets: PETS, home: ["flat", "room", "house", "flat in the city"] }],
  [A_HASNT, W_HASNT, "The {room} ______ got a window. It's very dark, {name}.", { room: ["bathroom", "hall", "storeroom", "basement"], name: NAME }],
  [A_HAVENT, W_HAVENT, "My {who} ______ got a car. They walk to {place}.", { who: ["parents", "grandparents", "neighbours", "cousins"], place: ["work", "the bazaar", "the park", "the shops"] }],
].map(([base, why, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write haven't got or hasn't got.";
const BUILD = [
  // haven't got (10)
  ["v", "I ______ a {thing} with me, {name}.", { thing: ["pen", "ruler", "phone", "charger"], name: NAME }],
  ["v", "We ______ any {food} in the fridge, {who}.", { food: ["milk", "eggs", "cheese", "juice"], who: ADULT }],
  ["v", "They ______ a car, so they take the {bus} to {place}.", { bus: BUS, place: ["work", "school", "the bazaar", "the park"] }],
  ["v", "My {who} ______ a TV in their {room}.", { who: ["parents", "grandparents", "cousins", "neighbours"], room: ["bedroom", "flat", "kitchen", "house"] }],
  ["v", "You ______ much time, {name}. The {bus} leaves soon.", { name: NAME, bus: ["bus", "train", "minibus", "tram"] }],
  ["v", "The twins ______ their {thing} today, {who}.", { thing: ["books", "pens", "bags", "coats"], who: TEACH }],
  ["v", "I ______ any {sib}, {name}.", { sib: SIB, name: NAME }],
  ["v", "Sorry, we ______ any {food} today, {name}.", { food: ["bread", "milk", "apples", "eggs"], name: NAME }],
  ["v", "My friends ______ a {pet}. Their {home} is very small.", { pet: PET, home: ["flat", "room", "house", "garden"] }],
  ["v", "We ______ English on {day}, {name}.", { day: ["Mondays", "Fridays", "Wednesdays", "Saturdays"], name: NAME }],
  // hasn't got (10)
  ["s", "{name} ______ a {thing}. She uses her {who}'s.", { name: SHE, thing: ["laptop", "bike", "phone", "camera"], who: ["mum", "sister", "aunt", "friend"] }],
  ["s", "Our {home} ______ a {thing}.", { home: ["flat", "house", "new flat", "old house"], thing: ["balcony", "garden", "lift", "garage"] }],
  ["s", "My {who} ______ a car. He takes the {bus}.", { who: ["uncle", "grandpa", "brother", "dad"], bus: BUS }],
  ["s", "This {room} ______ a {thing}.", { room: ["classroom", "room", "kitchen", "hall"], thing: ["clock", "lamp", "window", "TV"] }],
  ["s", "{name} ______ any {sib}.", { name: NAME, sib: SIB }],
  ["s", "Our {area} ______ a {place}.", { area: ["village", "street", "area", "town"], place: ["hospital", "cinema", "bank", "library"] }],
  ["s", "My {dev} ______ a {thing}.", { dev: ["phone", "laptop", "tablet", "computer"], thing: ["camera", "case", "charger", "keyboard"] }],
  ["s", "{name} ______ a {ill} today. He feels fine.", { name: HE, ill: ["cold", "temperature", "headache", "cough"] }],
  ["s", "Our {subj} teacher ______ a car. She comes by {bus}.", { subj: ["English", "maths", "art", "music"], bus: BUS }],
  ["s", "The cat ______ a {thing}. It sleeps on the {place}.", { thing: ["bed", "basket", "box", "blanket"], place: ["sofa", "floor", "chair", "carpet"] }],
].map(([k, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: k === "s" ? "hasn't got" : "haven't got", why: k === "s" ? W_HASNT : W_HAVENT, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NEG = "Make the sentence negative.";
const COR = "Correct the mistake.";
const DONT = "Rewrite with haven't got or hasn't got.";
const TRANSFORM = [
  // positive -> negative (5)
  [NEG, "She has got a {pet} called {pn}.", "She ______ a {pet} called {pn}.", "hasn't got", "She → hasn't got.", { pet: PET, pn: PN }],
  [NEG, "We have got some {food} at home, {who}.", "We ______ any {food} at home, {who}.", "haven't got", "We → haven't got. In negatives, some becomes any.", { food: ["milk", "bread", "eggs", "sugar"], who: ADULT }],
  [NEG, "My {who} has got a {color} car.", "My {who} ______ a {color} car.", "hasn't got", "One person → hasn't got.", { who: ["uncle", "aunt", "brother", "sister"], color: COLOR }],
  [NEG, "I have got a {thing} for you, {name}.", "I ______ a {thing} for you, {name}.", "haven't got", "I → haven't got.", { thing: ["present", "letter", "book", "ticket"], name: NAME }],
  [NEG, "Our {home} has got a {thing}.", "Our {home} ______ a {thing}.", "hasn't got", "Our flat or house is one thing → hasn't got.", { home: ["flat", "house", "new flat", "old house"], thing: ["balcony", "garden", "lift", "garage"] }],
  // correct the mistake (5)
  [COR, "She haven't got a {thing}, {name}.", "She ______ a {thing}, {name}.", "hasn't got", "She → hasn't got, not haven't got.", { thing: ["bike", "phone", "laptop", "camera"], name: NAME }],
  [COR, "I don't got a {thing}, {name}.", "I ______ a {thing}, {name}.", "haven't got", "With got, the negative is haven't got, not don't got.", { thing: ["pen", "ruler", "pencil", "charger"], name: NAME }],
  [COR, "{name} hasn't get any {sib}.", "{name} ______ any {sib}.", "hasn't got", "Got never changes: hasn't got, not hasn't get.", { name: NAME, sib: SIB }],
  [COR, "They hasn't got a {pet} in their {home}.", "They ______ a {pet} in their {home}.", "haven't got", "They → haven't got, not hasn't got.", { pet: PET, home: ["flat", "house", "room", "garden"] }],
  [COR, "We haven't have any {food}, {who}.", "We ______ any {food}, {who}.", "haven't got", "The negative is haven't got, not haven't have.", { food: ["milk", "bread", "juice", "rice"], who: ADULT }],
  // don't have -> haven't got (5)
  [DONT, "I don't have a {thing}, {name}.", "I ______ a {thing}, {name}.", "haven't got", "I don't have = I haven't got.", { thing: ["pen", "bike", "phone", "watch"], name: NAME }],
  [DONT, "{name} doesn't have a {pet}.", "{name} ______ a {pet}.", "hasn't got", "He doesn't have = he hasn't got.", { name: HE, pet: PET }],
  [DONT, "We don't have any {food} in the fridge, {who}.", "We ______ any {food} in the fridge, {who}.", "haven't got", "We don't have = we haven't got.", { food: ["milk", "eggs", "cheese", "juice"], who: ADULT }],
  [DONT, "Our {home} doesn't have a {thing}.", "Our {home} ______ a {thing}.", "hasn't got", "It doesn't have = it hasn't got.", { home: ["flat", "house", "new flat", "old house"], thing: ["balcony", "garden", "lift", "garage"] }],
  [DONT, "My {who} don't have a car in {city}.", "My {who} ______ a car in {city}.", "haven't got", "They don't have = they haven't got.", { who: ["parents", "grandparents", "cousins", "neighbours"], city: CITY }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a thing you haven't got but want.", "I haven't got …", ["exactly one sentence", "I haven't got", "a thing word"]],
  ["Write one sentence about a pet your friend hasn't got.", "He / She hasn't got …", ["exactly one sentence", "hasn't got", "an animal word"]],
  ["Write one sentence about something your flat or house hasn't got.", "Our flat / house hasn't got …", ["exactly one sentence", "hasn't got", "a home word"]],
  ["Write one sentence about food your family hasn't got at home today.", "We haven't got any …", ["exactly one sentence", "haven't got any", "a food word"]],
  ["Write one sentence about something your town or village hasn't got.", "Our town hasn't got a …", ["exactly one sentence", "hasn't got", "a place word"]],
  ["Write one sentence about a thing you haven't got with you today.", "I haven't got my …", ["exactly one sentence", "I haven't got", "a school word"]],
  ["Write one sentence about your grandparents: what haven't they got?", "They haven't got …", ["exactly one sentence", "haven't got", "a thing word"]],
  ["Write two sentences: one thing you have got and one thing you haven't got.", "I've got … / I haven't got …", ["exactly two sentences", "have got once", "haven't got once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your room: what have you got in it, and what haven't you got?", "I've got … / I haven't got …", ["haven't got", "have got", "three or four sentences"]],
  ["Describe your town or village for a visitor: what has it got, and what hasn't it got?", "It has got … / It hasn't got …", ["hasn't got", "has got", "three or four sentences"]],
  ["You are going to school, but you forgot some things. Write a message to a friend.", "I haven't got my …", ["haven't got", "a school word", "three or four sentences"]],
  ["Compare your family with a friend's family: brothers, sisters, pets.", "We've got … / They haven't got …", ["haven't got or hasn't got", "have got or has got", "three or four sentences"]],
  ["You want to cook dinner, but the fridge is almost empty. Write what you haven't got and what you need to buy.", "We haven't got any …", ["haven't got any", "a food word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.have-got.have-got-negative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);