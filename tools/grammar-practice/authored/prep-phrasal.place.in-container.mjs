// Hand-authored: prep-phrasal / place / in-container (A1).
// Path fill P25 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: in for a container (The milk is ______ the fridge).
// Sibling scope: every key is IN for something inside a container or a
// room (fridge, bag, pocket, box, bottle, drawer, kitchen, garden, bed).
// No surfaces (on-surface, P26), no between (P27), no areas like cities or
// countries (in-area, P30), no at + place.
// One right answer: every container is one where on and at are clearly
// wrong (nothing can sit "on a pocket" or "at a bottle"). Cut while
// drafting: the car (on the roof), the oven (on the cooker), the pool
// (at the pool), the bus (on / in the bus), the grass, the door (keys in /
// on the door), and "works at / in an office".
// Choose options in / on / at / to, rotated.
// Build: "Write in, on or at." All keys are in.
// Transform: 5 answer a Where …? question (key "in the" / "in your") / 5
// correct the mistake / 5 inside → in.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.place.in-container.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "place", topic: "in-container", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const ADULT = ["Mum", "Dad", "Grandma", "Aziz"];
const KIDS = ["children", "boys", "girls", "twins"];
const OPT = ["in", "on", "at", "to"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  c: "The thing is inside a container, so use in.",
  r: "The person is inside a room or a garden, so use in.",
  bed: "We say in bed: the person is under the blanket.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["c", "The {food} is ______ the fridge. It's nice and cold, {name}.", { food: ["milk", "juice", "butter", "cheese"], name: NAME }],
  ["c", "My {thing} is ______ my pocket, {name}.", { thing: ["phone", "key", "ticket", "pen"], name: NAME }],
  ["r", "{who} is ______ the kitchen. She's cooking {food}.", { who: ["Mum", "Grandma", "My aunt", "My sister"], food: ["plov", "soup", "dinner", "rice"] }],
  ["c", "Your {things} are ______ my bag, {name}. Here they are.", { things: ["books", "pens", "keys", "glasses"], name: NAME }],
  ["c", "There's some {drink} ______ the bottle, {name}.", { drink: ["water", "juice", "milk", "lemonade"], name: NAME }],
  ["c", "The {things} are ______ the drawer. Open it, {name}.", { things: ["spoons", "forks", "knives", "scissors"], name: NAME }],
  ["r", "The {kids} are ______ the {room}. They're watching TV.", { kids: KIDS, room: ["living room", "bedroom", "other room", "small room"] }],
  ["c", "There's a lot of sugar ______ my {drink}, {name}.", { drink: ["tea", "coffee", "juice", "cocoa"], name: NAME }],
  ["c", "My {thing} is ______ the wardrobe. Can you open the door, {name}?", { thing: ["coat", "dress", "jacket", "shirt"], name: NAME }],
  ["c", "The {animal} is ______ the box. Only its {part} is outside.", { animal: ["cat", "kitten", "puppy", "rabbit"], part: ["head", "tail", "nose", "face"] }],
  ["r", "{who} is ______ the garden. She is picking {fruit}.", { who: ["Grandma", "My aunt", "Mum", "My sister"], fruit: ["apples", "cherries", "apricots", "grapes"] }],
  ["c", "There are {n} apples ______ the bowl, {name}.", { n: ["two", "three", "four", "five"], name: NAME }],
  ["r", "{t} is ______ the classroom with the {kids}.", { t: ["Ms Ivanova", "Mr Karimov", "Mrs Karimova", "Our teacher"], kids: ["students", "children", "boys", "girls"] }],
  ["c", "There's no {drink} ______ the glass, {name}. It's empty.", { drink: ["water", "juice", "milk", "tea"], name: NAME }],
  ["r", "My {sib} is ______ the bathroom. Please wait, {name}.", { sib: ["brother", "sister", "cousin", "dad"], name: NAME }],
  ["c", "There's some {food} ______ the pot. It's still hot, {name}.", { food: ["soup", "rice", "plov", "tea"], name: NAME }],
  ["c", "My {thing} is ______ my backpack, next to my books, {name}.", { thing: ["phone", "pencil case", "lunch box", "water bottle"], name: NAME }],
  ["c", "The fish are ______ the {tank}. They're swimming, {name}.", { tank: ["tank", "pond", "bowl", "aquarium"], name: NAME }],
  ["r", "{name} is ______ his room. He's doing his {task}.", { name: HE, task: ["homework", "project", "English homework", "maths homework"] }],
  ["c", "There's something ______ this {box}. Can you guess what it is, {name}?", { box: ["box", "bag", "envelope", "parcel"], name: NAME }],
].map(([w, prompt, slots], i) => {
  const options = rot(OPT, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf("in"), why: W[w], slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write in, on or at.";
const BUILD = [
  ["c", "There's some {drink} ______ the jug, {name}.", { drink: ["water", "juice", "milk", "lemonade"], name: NAME }],
  ["r", "My {sib} is ______ the shower. Please wait, {name}.", { sib: ["brother", "sister", "cousin", "dad"], name: NAME }],
  ["r", "The {kids} are ______ the garden. They are playing {game}.", { kids: KIDS, game: ["football", "tag", "hide and seek", "with the dog"] }],
  ["c", "I keep my {things} ______ a box under my bed, {name}.", { things: ["photos", "toys", "letters", "old books"], name: NAME }],
  ["c", "Your {thing} is ______ the washing machine, {name}!", { thing: ["shirt", "scarf", "jacket", "hat"], name: NAME }],
  ["c", "The {food} is ______ the cupboard, next to the {food2}.", { food: ["sugar", "rice", "tea", "salt"], food2: ["flour", "pasta", "coffee", "jam"] }],
  ["r", "We are ______ the {room}. Come and join us, {name}.", { room: ["kitchen", "living room", "garden", "classroom"], name: NAME }],
  ["c", "Put your {thing} ______ your bag, {name}. It's raining.", { thing: ["phone", "book", "ticket", "notebook"], name: NAME }],
  ["c", "There's too much milk ______ my {drink}, {name}.", { drink: ["tea", "coffee", "cocoa", "cup"], name: NAME }],
  ["c", "The {animal} is ______ its cage. It's sleeping, {name}.", { animal: ["bird", "parrot", "hamster", "rabbit"], name: NAME }],
  ["r", "There are {n} students ______ our class, {name}.", { n: ["twenty", "twenty-five", "thirty", "eighteen"], name: NAME }],
  ["c", "The {thing} is ______ my wallet, {name}.", { thing: ["money", "card", "ticket", "photo"], name: NAME }],
  ["bed", "{name} is still ______ bed. She is {state}.", { name: SHE, state: ["very tired", "ill", "sleepy", "not well"] }],
  ["c", "There's some {food} ______ the bowl, {name}.", { food: ["soup", "rice", "fruit", "salad"], name: NAME }],
  ["c", "The books are ______ the {box}. Can you carry it, {name}?", { box: ["box", "bag", "suitcase", "backpack"], name: NAME }],
  ["r", "There's a mouse ______ the kitchen, {who}!", { who: ADULT }],
  ["r", "My grandparents are ______ the {room} now. They are having tea, {name}.", { room: ["kitchen", "living room", "garden", "dining room"], name: NAME }],
  ["c", "The {things} are ______ the drawer by the {place}.", { things: ["forks", "spoons", "knives", "pens"], place: ["sink", "window", "door", "cooker"] }],
  ["c", "Is there any {drink} ______ the bottle, {name}?", { drink: ["water", "juice", "milk", "oil"], name: NAME }],
  ["r", "Your {thing} is ______ the hall, {name}.", { thing: ["bag", "coat", "umbrella", "scarf"], name: NAME }],
].map(([w, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "in", why: W[w], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ANS = "Answer the question. Use in.";
const COR = "Correct the mistake.";
const INS = "Rewrite the sentence with in.";
const TRANSFORM = [
  // Where …? (5)
  ["Answer the question. Use in and the fridge.", "Where's the {food}?", "It's ______ fridge, {name}.", "in the", "The fridge is a container: in the fridge.", { food: ["milk", "butter", "cheese", "juice"], name: NAME }],
  ["Answer the question. Use in and the garden.", "Where are the {kids}?", "They're ______ garden, {name}.", "in the", "A garden has walls or a fence around it: in the garden.", { kids: KIDS, name: NAME }],
  ["Answer the question. Use in and your bag.", "Where's my {thing}?", "It's ______ bag, {name}.", "in your", "A bag is a container: in your bag.", { thing: ["phone", "pen", "ticket", "book"], name: NAME }],
  ["Answer the question. Use in and the kitchen.", "Where's {who}?", "She's ______ kitchen, {name}.", "in the", "A kitchen is a room: in the kitchen.", { who: ["Mum", "Grandma", "your aunt", "your sister"], name: NAME }],
  ["Answer the question. Use in and the drawer.", "Where are the {things}?", "They're ______ drawer, {name}.", "in the", "A drawer is a container: in the drawer.", { things: ["spoons", "forks", "knives", "scissors"], name: NAME }],
  // correct the mistake (5)
  [COR, "{who} is at the kitchen, {name}.", "{who} is ______ the kitchen, {name}.", "in", "A kitchen is a room, so use in, not at.", { who: ["Mum", "Grandma", "My aunt", "Dad"], name: NAME }],
  [COR, "My {thing} is on my pocket, {name}.", "My {thing} is ______ my pocket, {name}.", "in", "A pocket is a container, so use in, not on.", { thing: ["phone", "key", "ticket", "pen"], name: NAME }],
  [COR, "There's some {drink} at the bottle, {name}.", "There's some {drink} ______ the bottle, {name}.", "in", "A bottle is a container, so use in, not at.", { drink: ["water", "juice", "milk", "lemonade"], name: NAME }],
  [COR, "The {kids} are on the classroom, {name}.", "The {kids} are ______ the classroom, {name}.", "in", "A classroom is a room, so use in, not on.", { kids: ["students", "children", "boys", "girls"], name: NAME }],
  [COR, "{name} is still on bed. She's {state}.", "{name} is still ______ bed. She's {state}.", "in", "We say in bed, not on bed.", { name: SHE, state: ["very tired", "ill", "sleepy", "not well"] }],
  // inside -> in (5)
  [INS, "The {thing} is inside the box, {name}.", "The {thing} is ______ the box, {name}.", "in", "Inside a container = in it.", { thing: ["present", "cake", "toy", "watch"], name: NAME }],
  [INS, "There's some {drink} inside the {container}.", "There's some {drink} ______ the {container}.", "in", "Inside a container = in it.", { drink: ["water", "juice", "milk", "tea"], container: ["bottle", "jug", "cup", "glass"] }],
  [INS, "The children are inside the {room}, {name}.", "The children are ______ the {room}, {name}.", "in", "Inside a building or a room = in it.", { room: ["house", "school", "classroom", "museum"], name: NAME }],
  [INS, "My {thing} is inside my {bag}, {name}.", "My {thing} is ______ my {bag}, {name}.", "in", "Inside a bag = in it.", { thing: ["phone", "book", "key", "pen"], bag: ["bag", "backpack", "school bag", "handbag"], name: NAME }],
  [INS, "The {animal} is inside the {room}.", "The {animal} is ______ the {room}.", "in", "Inside a building or a room = in it.", { animal: ["bird", "cat", "hamster", "rabbit"], room: ["house", "kitchen", "garage", "shed"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something in your bag today.", "There's a … in my bag.", ["exactly one sentence", "in my bag", "a thing word"]],
  ["Write one sentence about food in your fridge.", "There's some … in the fridge.", ["exactly one sentence", "in the fridge", "a food word"]],
  ["Write one sentence about where your mum or dad is now.", "She's / He's in the …", ["exactly one sentence", "in the", "a room word"]],
  ["Write one sentence about something in your pocket.", "My … is in my pocket.", ["exactly one sentence", "in my pocket", "a thing word"]],
  ["Write one sentence about what you keep in a box at home.", "I keep my … in a box.", ["exactly one sentence", "in a box", "a thing word"]],
  ["A friend can't find his phone. Write one sentence to help him.", "It's in your …", ["exactly one sentence", "in your", "a container word"]],
  ["Write one sentence about where your pet sleeps.", "It sleeps in …", ["exactly one sentence", "in", "an animal word"]],
  ["Write two sentences: one about a thing in your bag and one about a person in a room.", "… in my bag. / … in the kitchen.", ["exactly two sentences", "in my bag", "in the + room"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe what is in your school bag today.", "in my bag / in my pencil case", ["in", "a school word", "three or four sentences"]],
  ["You are at a friend's flat. Ask where three things are, and write the answers.", "Where's the …? – It's in the …", ["in the", "a container or room word", "three or four lines"]],
  ["Describe your kitchen: what is in the fridge, the cupboard and the drawers?", "There's … in the …", ["in the fridge", "in the cupboard or drawer", "three or four sentences"]],
  ["Write a note for your brother: tell him where his things are.", "Your … is in the …", ["in", "a thing word", "three or four sentences"]],
  ["It's Saturday morning. Say where everyone in your family is now.", "Mum is in the kitchen. Dad is in the garden.", ["in the + room", "a family word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.place.in-container.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);