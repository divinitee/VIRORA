// Hand-authored: verb-patterns / have-got / have-has (A1).
// Path fill P21 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement foci: have with I (I ______ a new phone: has / have / having /
// am have), has with he / she (She ______ a small dog), has got for the third
// person (My brother ______ two bicycles).
// Sibling scope: positive statements ONLY. Questions (Have you got …?) are
// P22, negatives (haven't got / hasn't got) are P23; neither form appears.
// Meaning is kept to possession, family, body and illness (a cold, long
// hair), never actions like have breakfast, where "is having" can be right.
// No collective subjects (family, team, class), which can take have or has.
// Choose: 10 have (I / you / we / they / plural nouns), 10 has (he / she /
// it / one person or thing); distractors are the other form, having and
// am / is have.
// Build: "Write have or has."; 6 sources print "got" after the blank
// (have got / has got), so the key is always one word.
// Transform: 5 change to one person (→ has) / 5 change to more people
// (→ have) / 5 correct the mistake.
//
// Run: node tools/grammar-practice/authored/verb-patterns.have-got.have-has.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "have-got", topic: "have-has", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const COLOR = ["white", "red", "blue", "black"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const O_HAVE = ["have", "has", "having", "am have"];
const O_HAVE2 = ["have", "has", "having", "are have"];
const O_HAS = ["has", "have", "having", "is have"];
const W = {
  i: "With I, use have: I have …",
  you: "With you, use have: you have …",
  we: "With we, use have: we have …",
  they: "With they or more than one person or thing, use have.",
  has: "With he, she, it or one person or thing, use has.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O_HAVE, W.i, "I ______ a new {thing}, {name}.", { thing: ["phone", "bag", "bike", "watch"], name: NAME }],
  [O_HAS, W.has, "{name} ______ a small {pet}.", { name: NAME, pet: ["dog", "cat", "parrot", "rabbit"] }],
  [O_HAVE2, W.we, "We ______ a big {room} in our flat.", { room: ["kitchen", "balcony", "living room", "bathroom"] }],
  [O_HAS, W.has, "My grandma ______ a garden with {fruit} trees.", { fruit: ["apple", "cherry", "apricot", "peach"] }],
  [O_HAVE2, W.they, "My cousins ______ {n} cats.", { n: ["two", "three", "four", "five"] }],
  [O_HAS, W.has, "Our flat ______ {n} bedrooms.", { n: ["two", "three", "four", "five"] }],
  [O_HAVE2, W.you, "You ______ a nice {thing}, {name}!", { thing: ["jacket", "bag", "room", "bike"], name: NAME }],
  [O_HAS, W.has, "My brother ______ a {thing} in his room.", { thing: ["computer", "guitar", "TV", "desk"] }],
  [O_HAVE2, W.they, "They ______ a house near the {place}.", { place: ["river", "park", "bazaar", "school"] }],
  [O_HAS, W.has, "{name} ______ long hair and brown eyes.", { name: SHE }],
  [O_HAVE2, W.they, "My parents ______ a {color} car.", { color: COLOR }],
  [O_HAS, W.has, "Our school ______ a big {place}.", { place: ["library", "gym", "garden", "canteen"] }],
  [O_HAVE, W.i, "I ______ {n} brothers and one sister.", { n: ["two", "three", "four", "five"] }],
  [O_HAS, W.has, "The cat ______ a little bed by the {place}.", { place: ["window", "door", "sofa", "heater"] }],
  [O_HAVE2, W.they, "Aziz and Lola ______ a new {pet}.", { pet: ["puppy", "kitten", "parrot", "rabbit"] }],
  [O_HAS, W.has, "My uncle ______ a shop in {city}.", { city: ["Samarkand", "Bukhara", "Tashkent", "Fergana"] }],
  [O_HAVE2, W.we, "We ______ a lot of {thing} at home, {name}.", { thing: ["books", "plants", "photos", "toys"], name: NAME }],
  [O_HAS, W.has, "{name} ______ a cold, so he is at home today.", { name: HE }],
  [O_HAVE2, W.they, "My friends ______ a {thing} in their garden.", { thing: ["big table", "swing", "small pool", "tree house"] }],
  [O_HAS, W.has, "This room ______ two {thing}.", { thing: ["windows", "doors", "lamps", "beds"] }],
].map(([base, why, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write have or has.";
const BUILD = [
  ["has", "My sister ______ a new {thing}.", { thing: ["laptop", "phone", "bike", "dress"] }],
  ["have", "I ______ got a {pet} called {pn}.", { pet: ["dog", "cat", "rabbit", "parrot"], pn: ["Bars", "Max", "Luna", "Snow"] }],
  ["has", "{name} ______ a big family.", { name: NAME }],
  ["have", "We ______ got two {thing} in our living room.", { thing: ["sofas", "lamps", "carpets", "TVs"] }],
  ["has", "Our teacher ______ a {color} car.", { color: COLOR }],
  ["have", "They ______ a flat on the {floor} floor.", { floor: ["second", "third", "fifth", "top"] }],
  ["has", "My dad ______ got a {thing} in the garage.", { thing: ["bike", "car", "motorbike", "toolbox"] }],
  ["have", "You ______ a lot of {thing}, {name}!", { thing: ["books", "friends", "toys", "plants"], name: NAME }],
  ["has", "The kitchen ______ a big {thing}.", { thing: ["fridge", "window", "table", "cooker"] }],
  ["have", "My grandparents ______ a {animal} on their farm.", { animal: ["cow", "horse", "donkey", "goat"] }],
  ["has", "{name} ______ got {colour} eyes.", { name: SHE, colour: ["brown", "green", "blue", "dark"] }],
  ["have", "I ______ {n} cousins in {city}.", { n: ["four", "five", "six", "ten"], city: ["Tashkent", "Bukhara", "Khiva", "Fergana"] }],
  ["has", "Our street ______ a small {place}.", { place: ["park", "shop", "café", "bakery"] }],
  ["have", "Timur and his brother ______ a {thing} in their room.", { thing: ["computer", "TV", "bunk bed", "desk"] }],
  ["has", "My phone ______ a {color} case.", { color: ["red", "blue", "black", "pink"] }],
  ["have", "We ______ got a new {thing} in the kitchen.", { thing: ["fridge", "table", "cooker", "kettle"] }],
  ["has", "{name} ______ a headache today.", { name: NAME }],
  ["have", "My neighbours ______ two {pet}.", { pet: ["dogs", "cats", "parrots", "rabbits"] }],
  ["has", "Our flat ______ got a balcony with {thing}.", { thing: ["flowers", "plants", "two chairs", "a small table"] }],
  ["have", "The children ______ a lot of {thing} in their room.", { thing: ["toys", "books", "games", "posters"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "has" ? W.has : W.they.replace("With they or", "With I, you, we, they and"), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ONE = "Rewrite the sentence about one person. Use has.";
const MORE = "Rewrite the sentence about more people. Use have.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // -> has (5)
  [ONE, "I have a new bike.", "{name} ______ a new bike.", "has", "One person (he / she) → has.", { name: NAME }],
  [ONE, "We have a small garden.", "Our neighbour ______ a small garden.", "has", "One person → has.", {}],
  [ONE, "My brothers have a {thing}.", "My brother ______ a {thing}.", "has", "One brother → has.", { thing: ["guitar", "computer", "bike", "camera"] }],
  [ONE, "They have got a {color} car.", "Our teacher ______ got a {color} car.", "has", "One person → has got.", { color: COLOR }],
  [ONE, "My friends have a {pet}.", "My friend ______ a {pet}.", "has", "One friend → has.", { pet: ["dog", "cat", "parrot", "rabbit"] }],
  // -> have (5)
  [MORE, "She has two {thing}.", "They ______ two {thing}.", "have", "They → have.", { thing: ["cats", "bikes", "phones", "rooms"] }],
  [MORE, "My sister has long hair.", "My sisters ______ long hair.", "have", "More than one sister → have.", {}],
  [MORE, "He has got a cold.", "I ______ got a cold.", "have", "I → have got.", {}],
  [MORE, "My cousin has a flat in {city}.", "My cousins ______ a flat in {city}.", "have", "More than one cousin → have.", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  [MORE, "Lola has a new {thing}.", "Lola and Olga ______ a new {thing}.", "have", "Two people → have.", { thing: ["bag", "phone", "dress", "bike"] }],
  // correct the mistake (5)
  [COR, "She have a {pet}.", "She ______ a {pet}.", "has", "She → has, not have.", { pet: ["dog", "cat", "parrot", "rabbit"] }],
  [COR, "I has two {sib}.", "I ______ two {sib}.", "have", "I → have, not has.", { sib: ["sisters", "brothers", "cousins", "aunts"] }],
  [COR, "My parents has a {color} car.", "My parents ______ a {color} car.", "have", "Parents is plural → have.", { color: COLOR }],
  [COR, "{name} have got a new {thing}.", "{name} ______ got a new {thing}.", "has", "One person → has got.", { name: NAME, thing: ["phone", "bike", "watch", "bag"] }],
  [COR, "Our flat have {n} rooms.", "Our flat ______ {n} rooms.", "has", "Our flat is one thing → has.", { n: ["two", "three", "four", "five"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a thing you have in your room.", "I have / I've got", ["exactly one sentence", "start with I have or I've got", "a thing word"]],
  ["Write one sentence about a pet you or a friend has.", "have / has + a pet", ["exactly one sentence", "have or has", "an animal word"]],
  ["Write one sentence about your brother, sister or cousin. What has he or she got?", "he / she has", ["exactly one sentence", "has or has got", "a family word"]],
  ["Write one sentence about your flat or house. How many rooms has it got?", "it has / our flat has", ["exactly one sentence", "has", "a number"]],
  ["Write one sentence about your best friend's hair or eyes.", "he / she has", ["exactly one sentence", "has", "a colour word"]],
  ["Write one sentence about your school. What has it got?", "our school has", ["exactly one sentence", "has", "a place word"]],
  ["Write one sentence about your grandparents' home.", "they have", ["exactly one sentence", "have", "a home word"]],
  ["Write two sentences: one thing you have and one thing your friend has.", "I have / he or she has", ["exactly two sentences", "have once", "has once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your family. Who is in it, and what have they got?", "have / has", ["have", "has", "three or four sentences"]],
  ["Describe your room. What have you got in it?", "I have / I've got", ["I have", "a furniture word", "three or four sentences"]],
  ["Describe your flat or house for a new friend.", "it has / we have", ["has", "have", "three or four sentences"]],
  ["Describe your best friend: hair, eyes, pets and things.", "he / she has", ["has twice", "a colour word", "three or four sentences"]],
  ["Describe a relative in another town or village. What has he or she got there?", "he / she has", ["has", "a place word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.have-got.have-has.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);