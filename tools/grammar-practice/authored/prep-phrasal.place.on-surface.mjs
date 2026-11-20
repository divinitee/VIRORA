// Hand-authored: prep-phrasal / place / on-surface (A1).
// Path fill P26 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement foci: on for a surface (The keys are ______ the table); on the
// wall (a vertical surface).
// Sibling scope: every key is ON for something touching a surface (table,
// floor, shelf, plate, wall, door, board, roof, page, screen, fridge door).
// No containers (in-container, P25), no between (P27), no at + place.
// One right answer: only surfaces where in and at are clearly wrong. Cut
// while drafting: the bus (in / on), the grass (in long grass), "at the
// window" (a bird at the window is right), "write at the board", the
// fridge door (in the door = its shelves), the street (in the street).
// "in the plate" (a common learner error) is a distractor, never a key.
// Choose options on / in / at / to, rotated.
// Build: "Write in, on or at." All keys are on.
// Transform: 5 answer a Where …? question (keys "on the" / "on your") / 5
// correct the mistake / 5 on top of → on.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.place.on-surface.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "place", topic: "on-surface", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const PET = ["cat", "dog", "puppy", "kitten"];
const PIC = ["map", "clock", "mirror", "picture"];
const OPT = ["on", "in", "at", "to"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  s: "The thing touches the top of a surface, so use on.",
  w: "A wall or a door is a surface too, so use on the wall / on the door.",
  p: "We say on a page and on a screen: the words or picture are on the surface.",
  plate: "Food is on a plate (a flat surface), not in a plate.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["s", "The keys are ______ the table, next to the {thing}, {name}.", { thing: ["phone", "lamp", "books", "bread"], name: NAME }],
  ["w", "There's a picture of {what} ______ the wall of my {room}.", { what: ["my grandparents", "a horse", "Samarkand", "the sea"], room: ["room", "bedroom", "classroom", "kitchen"] }],
  ["s", "Your {thing} is ______ the floor, {name}. Pick it up!", { thing: ["pen", "bag", "sock", "book"], name: NAME }],
  ["plate", "The {food} is ______ the plate. Eat it, {name}.", { food: ["bread", "rice", "cake", "chicken"], name: NAME }],
  ["s", "There are some books ______ the shelf above my {thing}, {name}.", { thing: ["bed", "desk", "sofa", "table"], name: NAME }],
  ["s", "The {pet} is sleeping ______ the sofa, {name}.", { pet: PET, name: NAME }],
  ["w", "Look! The {what} are ______ the board, {name}.", { what: ["answers", "new words", "homework tasks", "dates"], name: NAME }],
  ["w", "There's a {thing} ______ the door. It says 'Please knock', {name}.", { thing: ["sign", "note", "poster", "card"], name: NAME }],
  ["s", "My phone is ______ my desk, next to my {thing}, {name}.", { thing: ["laptop", "books", "lamp", "cup"], name: NAME }],
  ["s", "There's some {food} ______ your {clothes}, {name}.", { food: ["juice", "ice cream", "tea", "soup"], clothes: ["T-shirt", "shirt", "jacket", "dress"], name: NAME }],
  ["s", "There are {n} photos ______ our fridge, {name}.", { n: ["two", "three", "four", "five"], name: NAME }],
  ["s", "The {thing} is ______ the roof, {name}!", { thing: ["cat", "ball", "kite", "football"], name: NAME }],
  ["s", "Put the cups ______ the {surface}, please, {name}.", { surface: ["tray", "table", "shelf", "counter"], name: NAME }],
  ["p", "Look at the map ______ page {n}, {name}.", { n: ["12", "20", "35", "48"], name: NAME }],
  ["s", "Your {thing} is ______ the chair, {name}.", { thing: ["bag", "jacket", "book", "scarf"], name: NAME }],
  ["s", "There's snow ______ the {thing} this morning, {name}.", { thing: ["roof", "car", "bench", "ground"], name: NAME }],
  ["s", "There's a {thing} ______ the ceiling, {name}!", { thing: ["spider", "fly", "lamp", "big light"], name: NAME }],
  ["p", "There's a photo of my {who} ______ my phone screen, {name}.", { who: ["cat", "family", "dog", "sister"], name: NAME }],
  ["s", "Your {things} are ______ the teacher's desk, {kids}.", { things: ["notebooks", "tests", "essays", "books"], kids: ["class", "students", "boys", "girls"] }],
  ["s", "The {thing} is ______ the balcony, {name}.", { thing: ["bike", "cat", "table", "plant"], name: NAME }],
].map(([w, prompt, slots], i) => {
  const options = rot(OPT, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf("on"), why: W[w], slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write in, on or at.";
const BUILD = [
  ["w", "There's a {pic} ______ the wall of the {room}.", { pic: PIC, room: ["kitchen", "hall", "classroom", "living room"] }],
  ["s", "Your {thing} is ______ the floor, {name}.", { thing: ["pen", "sock", "ball", "bag"], name: NAME }],
  ["plate", "Put the {food} ______ a plate, {name}.", { food: ["bread", "cake", "fruit", "cheese"], name: NAME }],
  ["s", "The {pet} is lying ______ the carpet, {name}.", { pet: PET, name: NAME }],
  ["s", "There are {n} books ______ the shelf, {name}.", { n: ["ten", "twenty", "fifty", "a hundred"], name: NAME }],
  ["s", "The {things} are ______ the table, next to the bread, {name}.", { things: ["plates", "cups", "knives", "spoons"], name: NAME }],
  ["p", "Write the answers ______ page {n}, {name}.", { n: ["12", "20", "35", "48"], name: NAME }],
  ["p", "There's a picture of {what} ______ my laptop screen, {name}.", { what: ["my dog", "my family", "the sea", "Bukhara"], name: NAME }],
  ["s", "There's a {color} sticker ______ my laptop, {name}.", { color: ["red", "blue", "yellow", "green"], name: NAME }],
  ["s", "The cat is sitting ______ the {surface}, {name}.", { surface: ["chair", "sofa", "table", "roof"], name: NAME }],
  ["s", "Your keys are ______ the {surface} by the door, {name}.", { surface: ["shelf", "table", "chair", "stool"], name: NAME }],
  ["w", "There's a {thing} ______ the door of our classroom, {name}.", { thing: ["sign", "note", "poster", "timetable"], name: NAME }],
  ["s", "The {thing} is ______ my desk, {name}.", { thing: ["lamp", "computer", "phone", "notebook"], name: NAME }],
  ["s", "There's snow ______ the {thing} this morning, {name}.", { thing: ["roof", "cars", "ground", "benches"], name: NAME }],
  ["s", "My {thing} is ______ the chair by the {place}.", { thing: ["bag", "coat", "jacket", "book"], place: ["window", "door", "bed", "desk"] }],
  ["s", "There's a fly ______ your {part}, {name}!", { part: ["nose", "head", "arm", "hand"], name: NAME }],
  ["s", "Put your {things} ______ the teacher's desk, {kids}.", { things: ["notebooks", "tests", "essays", "books"], kids: ["class", "students", "boys", "girls"] }],
  ["s", "The {things} are ______ the top shelf, {name}.", { things: ["plates", "cups", "glasses", "bowls"], name: NAME }],
  ["w", "There's a poster of {star} ______ my bedroom wall, {name}.", { star: ["a footballer", "a singer", "a cat", "the moon"], name: NAME }],
  ["s", "Our {thing} is ______ the balcony, {name}.", { thing: ["bike", "table", "plant", "washing machine"], name: NAME }],
].map(([w, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "on", why: W[w], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const TOP = "Rewrite the sentence with on.";
const TRANSFORM = [
  // Where …? (5)
  ["Answer the question. Use on and the table.", "Where's my {thing}?", "It's ______ table, {name}.", "on the", "A table is a surface: on the table.", { thing: ["phone", "pen", "book", "key"], name: NAME }],
  ["Answer the question. Use on and the wall.", "Where's the {pic}?", "It's ______ wall, {name}.", "on the", "A wall is a surface too: on the wall.", { pic: PIC, name: NAME }],
  ["Answer the question. Use on and the shelf.", "Where are the {things}?", "They're ______ shelf, {name}.", "on the", "A shelf is a surface: on the shelf.", { things: ["books", "cups", "plates", "photos"], name: NAME }],
  ["Answer the question. Use on and the sofa.", "Where's the {pet}?", "It's ______ sofa, {name}.", "on the", "The animal is on top of the sofa: on the sofa.", { pet: PET, name: NAME }],
  ["Answer the question. Use on and your plate.", "Where's the {food}?", "It's ______ plate, {name}.", "on your", "Food is on a plate: on your plate.", { food: ["bread", "cake", "rice", "chicken"], name: NAME }],
  // correct the mistake (5)
  [COR, "The {pic} is in the wall, {name}.", "The {pic} is ______ the wall, {name}.", "on", "A wall is a surface, so use on, not in.", { pic: PIC, name: NAME }],
  [COR, "Your {thing} is at the floor, {name}.", "Your {thing} is ______ the floor, {name}.", "on", "The floor is a surface, so use on, not at.", { thing: ["pen", "sock", "ball", "bag"], name: NAME }],
  [COR, "The {food} is in the plate, {name}.", "The {food} is ______ the plate, {name}.", "on", "Food is on a plate, not in a plate.", { food: ["bread", "cake", "rice", "chicken"], name: NAME }],
  [COR, "There are {n} books in the shelf, {name}.", "There are {n} books ______ the shelf, {name}.", "on", "A shelf is a surface, so use on, not in.", { n: ["two", "five", "ten", "twenty"], name: NAME }],
  [COR, "Look at the photo in page {n}, {name}.", "Look at the photo ______ page {n}, {name}.", "on", "We say on page 12, not in page 12.", { n: ["12", "20", "35", "48"], name: NAME }],
  // on top of -> on (5)
  [TOP, "The {thing} is on top of the fridge, {name}.", "The {thing} is ______ the fridge, {name}.", "on", "On top of a surface = on it.", { thing: ["bread", "box", "radio", "bag"], name: NAME }],
  [TOP, "The cat is on top of the {surface}, {name}.", "The cat is ______ the {surface}, {name}.", "on", "On top of a surface = on it.", { surface: ["table", "sofa", "chair", "bed"], name: NAME }],
  [TOP, "Your {thing} is on top of the {surface}, {name}.", "Your {thing} is ______ the {surface}, {name}.", "on", "On top of a surface = on it.", { thing: ["phone", "book", "key", "pen"], surface: ["table", "desk", "shelf", "TV"], name: NAME }],
  [TOP, "There's a {thing} on top of the cupboard, {name}.", "There's a {thing} ______ the cupboard, {name}.", "on", "On top of a surface = on it.", { thing: ["box", "bag", "clock", "lamp"], name: NAME }],
  [TOP, "There are {n} books on top of the {furniture}.", "There are {n} books ______ the {furniture}.", "on", "On top of a surface = on it.", { n: ["two", "three", "five", "ten"], furniture: ["desk", "table", "piano", "chair"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something on your desk.", "There's a … on my desk.", ["exactly one sentence", "on my desk", "a thing word"]],
  ["Write one sentence about a picture or poster on a wall at home.", "There's a … on the wall.", ["exactly one sentence", "on the wall", "a room word"]],
  ["Write one sentence about food on your plate today.", "There's … on my plate.", ["exactly one sentence", "on my plate", "a food word"]],
  ["Write one sentence about where your pet or a friend's pet likes to sleep.", "It sleeps on the …", ["exactly one sentence", "on the", "an animal word"]],
  ["Write one sentence about something on a shelf in your room.", "There are … on the shelf.", ["exactly one sentence", "on the shelf", "a thing word"]],
  ["Write one sentence about what is on the board in your classroom.", "There are … on the board.", ["exactly one sentence", "on the board", "a school word"]],
  ["A friend can't find her keys. Write one sentence to help her.", "They're on the …", ["exactly one sentence", "on the", "a furniture word"]],
  ["Write two sentences: one about a thing on a table and one about a thing on a wall.", "… on the table. / … on the wall.", ["exactly two sentences", "on the table", "on the wall"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your desk: what is on it now?", "There's a … on my desk.", ["on", "a thing word", "three or four sentences"]],
  ["Describe the walls of your room: what pictures, posters or clocks are on them?", "There's a … on the wall.", ["on the wall", "a room word", "three or four sentences"]],
  ["Describe the table before dinner at home.", "There are … on the table.", ["on the table", "a food or kitchen word", "three or four sentences"]],
  ["Your friend is looking for things in your flat. Tell her where they are.", "Your … is on the …", ["on the", "a furniture word", "three or four sentences"]],
  ["Describe your classroom: what is on the board, the walls and the desks?", "There are … on the board.", ["on the board", "on the wall", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.place.on-surface.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);