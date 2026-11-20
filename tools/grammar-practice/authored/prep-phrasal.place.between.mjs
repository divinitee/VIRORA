// Hand-authored: prep-phrasal / place / between (A1).
// Path fill P27 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: between two named places (The bank is ______ the
// supermarket and the café: under / between / in / on).
// Sibling scope: every key is BETWEEN (or the AND that goes with it) for a
// place with two reference points. No containers (P25), surfaces (P26), time
// (between 9 and 10) or among. The two reference points are always people,
// buildings or furniture where under / in / on make no sense, so between is
// the only right answer; the two slots of a pair come from different lists,
// so a place is never "between the café and the café".
// Choose, two kinds: 14 between vs under / in / on (the placement's own
// options); 6 the word after "between A": and vs with / to / or (common
// errors: between A with B, between Monday to Friday, between A or B).
// Build: 10 one blank (between) / 10 two blanks: ______ A ______ B →
// ["between", "and"]. No source prints the key word anywhere else.
// Transform: 5 join two "next to" sentences / 5 correct the mistake /
// 5 answer Where …? from a row of places (Look: the bank, the café, the park).
//
// Run: node tools/grammar-practice/authored/prep-phrasal.place.between.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "place", topic: "between", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const BOY = ["Aziz", "Timur", "Bobur", "Rustam"];
const GIRL = ["Lola", "Olga", "Madina", "Kamila"];
const BOY2 = ["Sardor", "Jamshid", "Dima", "Ilyos"];
const ADULT = ["Mum", "Dad", "Grandma", "Grandpa"];
const SHOP_A = ["supermarket", "bakery", "pharmacy", "post office"];
const SHOP_B = ["café", "school", "park", "hospital"];
const SHOP_C = ["bank", "phone shop", "flower shop", "shoe shop"];
const FAM_A = ["mum", "grandma", "aunt", "sister"];
const FAM_B = ["dad", "grandpa", "uncle", "brother"];
const ROOM_B = ["door", "wardrobe", "bed", "bookcase"];
const VEH = ["buses", "vans", "lorries", "minibuses"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const O_BET = ["between", "under", "in", "on"];
const O_AND = ["and", "with", "to", "or"];
const W_BET = "There are two places or people, one on each side, so use between.";
const W_AND = "Between always goes with and: between A and B.";
const W_BOTH = "Two places or people, one on each side: between A and B.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  // between vs under / in / on (14)
  ["b", "The bank is ______ the {a} and the {b}, {name}.", { a: SHOP_A, b: SHOP_B, name: NAME }],
  ["b", "In class, I sit ______ {a} and {b}.", { a: BOY, b: GIRL }],
  ["b", "Our flat is ______ my aunt's flat and the {who}'s flat.", { who: ["teacher", "doctor", "driver", "baker"] }],
  ["b", "Dad's car is parked ______ two big {veh}, {name}.", { veh: VEH, name: NAME }],
  ["b", "My house is ______ the {a} and the river.", { a: ["bazaar", "school", "hospital", "stadium"] }],
  ["b", "Stand ______ {a} and {b} for the photo, {who}.", { a: BOY, b: GIRL, who: ADULT }],
  ["b", "The pharmacy is ______ the {a} and the {b}. You can't miss it, {name}.", { a: SHOP_C, b: SHOP_B, name: NAME }],
  ["b", "Our school is ______ two {b}, {name}.", { b: ["parks", "shops", "banks", "cafés"], name: NAME }],
  ["b", "My little {sib} sits ______ Mum and Dad in the {place}.", { sib: ["brother", "sister", "cousin", "nephew"], place: ["car", "taxi", "cinema", "theatre"] }],
  ["b", "The bus stop is ______ the {a} and the {b}.", { a: SHOP_A, b: SHOP_B }],
  ["b", "There's a small table ______ the two beds in my {room}.", { room: ["bedroom", "room", "grandma's room", "hotel room"] }],
  ["b", "{name} is standing ______ his two {who} in the photo.", { name: BOY, who: ["brothers", "cousins", "friends", "uncles"] }],
  ["b", "Our café is ______ a bakery and a {b}, {name}.", { b: SHOP_C, name: NAME }],
  ["b", "Sit ______ your two {who}, {name}.", { who: ["cousins", "aunts", "uncles", "grandparents"], name: NAME }],
  // and vs with / to / or (6)
  ["a", "The bank is between the {a} ______ the {b}.", { a: SHOP_A, b: SHOP_B }],
  ["a", "I sit between {a} ______ {b} in class.", { a: BOY, b: GIRL }],
  ["a", "Our flat is between the {a} ______ the {b}, {name}.", { a: SHOP_A, b: SHOP_C, name: NAME }],
  ["a", "The bus stop is between the {a} ______ the {b}.", { a: SHOP_C, b: SHOP_B }],
  ["a", "Stand between {a} ______ {b}, {who}.", { a: BOY, b: GIRL, who: ADULT }],
  ["a", "My desk is between the window ______ the {b}, {name}.", { b: ROOM_B, name: NAME }],
].map(([k, prompt, slots], i) => {
  const base = k === "b" ? O_BET : O_AND;
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: k === "b" ? W_BET : W_AND, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_1 = "Write between, under, in or on.";
const INSTR_2 = "Write between in the first gap and the word that goes with it in the second gap.";
const BUILD_1 = [
  ["The bank is ______ the {a} and the {b}, {name}.", { a: SHOP_A, b: SHOP_B, name: NAME }],
  ["I sit ______ {a} and {b} in class.", { a: BOY, b: GIRL }],
  ["Our house is ______ a bakery and a {b}.", { b: SHOP_C }],
  ["Stand ______ your two {who}, {name}.", { who: ["cousins", "brothers", "sisters", "friends"], name: NAME }],
  ["There's a lamp ______ the two beds in my {room}.", { room: ["bedroom", "room", "grandma's room", "hotel room"] }],
  ["{name}'s desk is ______ the window and the {b}.", { name: NAME, b: ROOM_B }],
  ["The car is parked ______ two big {veh}, {name}.", { veh: VEH, name: NAME }],
  ["My little {sib} sits ______ Mum and Dad at dinner.", { sib: ["brother", "sister", "cousin", "nephew"] }],
  ["The phone shop is ______ the {a} and the {b}.", { a: SHOP_A, b: SHOP_B }],
  ["In the photo, {name} is ______ his two {who}.", { name: BOY, who: ["brothers", "cousins", "friends", "uncles"] }],
].map(([source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_1, source, key: "between", why: W_BET, slots }));
const BUILD_2 = [
  ["The cinema is ______ the {a} ______ the {b}, {name}.", { a: SHOP_A, b: SHOP_B, name: NAME }],
  ["I sit ______ {a} ______ {b} in English class.", { a: BOY, b: GIRL }],
  ["Our flat is ______ my aunt's flat ______ the {who}'s flat.", { who: ["teacher", "doctor", "driver", "baker"] }],
  ["The bus stop is ______ the {a} ______ the {b}.", { a: SHOP_C, b: SHOP_B }],
  ["My bed is ______ the window ______ the {b}.", { b: ROOM_B }],
  ["Stand ______ {a} ______ {b} for the photo, {who}.", { a: BOY, b: GIRL, who: ADULT }],
  ["The pharmacy is ______ a {a} ______ a {b}.", { a: SHOP_C, b: ["school", "bus stop", "park", "café"] }],
  ["The big tree is ______ our house ______ the {b}.", { b: ["road", "garage", "school", "shop"] }],
  ["{name} is sitting ______ his {a} ______ his {b} on the sofa.", { name: BOY, a: FAM_A, b: FAM_B }],
  ["The library is ______ the {a} ______ the {b} on our street.", { a: SHOP_A, b: SHOP_C }],
].map(([source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_2, source, key: ["between", "and"], why: W_BOTH, slots }));
const BUILD = [...BUILD_1, ...BUILD_2];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Make one sentence with between.";
const COR = "Correct the mistake.";
const WHERE = "Answer the question with between.";
const TRANSFORM = [
  // join (5)
  [JOIN, "The bank is next to the {a}. It's also next to the {b}.", "The bank is ______ the {a} and the {b}.", "between", "Next to A and next to B → between A and B.", { a: SHOP_A, b: SHOP_B }],
  [JOIN, "On my left is {a}. On my right is {b}.", "I'm sitting ______ {a} and {b}.", "between", "One person on each side → between.", { a: BOY, b: GIRL }],
  [JOIN, "Our house is next to a {a}. It's also next to a {b}.", "Our house is ______ a {a} and a {b}.", "between", "Next to A and next to B → between A and B.", { a: SHOP_A, b: SHOP_C }],
  [JOIN, "My bed is next to the window. It's also next to the {b}.", "My bed is ______ the window and the {b}.", "between", "Next to A and next to B → between A and B.", { b: ROOM_B }],
  [JOIN, "{name} is next to his {a}. He's also next to his {b}.", "{name} is ______ his {a} and his {b}.", "between", "One person on each side → between.", { name: BOY, a: FAM_A, b: FAM_B }],
  // correct the mistake (5)
  [COR, "The bank is between the {a} with the {b}.", "The bank is between the {a} ______ the {b}.", "and", "Between A and B, not between A with B.", { a: SHOP_A, b: SHOP_B }],
  [COR, "I sit between {a} or {b} in class.", "I sit between {a} ______ {b} in class.", "and", "Between A and B, not between A or B.", { a: BOY, b: GIRL }],
  [COR, "The café is in the middle of the {a} and the {b}.", "The café is ______ the {a} and the {b}.", "between", "Two places, one on each side → between, not in the middle of.", { a: SHOP_A, b: SHOP_C }],
  [COR, "The pharmacy is between the {a} to the {b}.", "The pharmacy is between the {a} ______ the {b}.", "and", "Between A and B, not between A to B.", { a: SHOP_C, b: SHOP_B }],
  [COR, "Stand between of {a} and {b}, {who}.", "Stand ______ {a} and {b}, {who}.", "between", "No of after between: between A and B.", { a: BOY, b: GIRL, who: ADULT }],
  // where? (5)
  [WHERE, "Where's the bus stop? Look: the {a}, the bus stop, the {b}.", "It's ______ the {a} and the {b}.", "between", "The bus stop has one place on each side → between.", { a: SHOP_A, b: SHOP_B }],
  [WHERE, "Where does {name} sit? Look: {a}, {name}, {b}.", "He sits ______ {a} and {b}.", "between", "One person on each side → between.", { name: BOY2, a: BOY, b: GIRL }],
  [WHERE, "Where's the lamp? Look: my bed, the lamp, my {b}.", "It's ______ my bed and my {b}.", "between", "The lamp has one thing on each side → between.", { b: ["desk", "wardrobe", "sister's bed", "chair"] }],
  [WHERE, "Where's the café? Look: the {a}, the café, the {b}.", "It's ______ the {a} and the {b}.", "between", "The café has one place on each side → between.", { a: SHOP_C, b: SHOP_A }],
  [WHERE, "Where is {name} in the photo? Look: his {a}, {name}, his {b}.", "He's ______ his {a} and his {b}.", "between", "One person on each side → between.", { name: BOY, a: FAM_A, b: FAM_B }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about where you sit in class.", "I sit between … and …", ["exactly one sentence", "between … and", "two names"]],
  ["Write one sentence about where your house or flat is on your street.", "It's between the … and the …", ["exactly one sentence", "between … and", "two place words"]],
  ["Write one sentence about a shop near your home.", "The … is between the … and the …", ["exactly one sentence", "between … and", "a shop word"]],
  ["Write one sentence about where your bed or desk is in your room.", "My bed is between the … and the …", ["exactly one sentence", "between … and", "a furniture word"]],
  ["Write one sentence about a family photo: who is in the middle?", "… is between … and …", ["exactly one sentence", "between … and", "family words"]],
  ["A friend is looking for the bus stop near your school. Write one sentence to help.", "It's between the … and the …", ["exactly one sentence", "between … and", "two place words"]],
  ["Write one sentence about where you sit at dinner at home.", "I sit between … and …", ["exactly one sentence", "between … and", "family words"]],
  ["Write two sentences about two places on your street. Use between in both.", "The … is between … and …", ["exactly two sentences", "between twice", "and twice"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your street for a visitor: what is between what?", "The … is between the … and the …", ["between … and", "a shop word", "three or four sentences"]],
  ["Describe your classroom: where do you and your friends sit?", "I sit between … and …", ["between … and", "names", "three or four sentences"]],
  ["Describe your room: where is your bed, your desk and your wardrobe?", "My desk is between …", ["between … and", "a furniture word", "three or four sentences"]],
  ["Describe a family photo: who is standing where?", "My … is between … and …", ["between … and", "family words", "three or four sentences"]],
  ["Tell a new friend how to find your house from the bus stop.", "It's between the … and the …", ["between … and", "a place word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.place.between.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);