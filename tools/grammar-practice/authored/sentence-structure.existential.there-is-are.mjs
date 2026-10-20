// Hand-authored: sentence-structure / existential / there-is-are (A1).
//
// Placement foci: There is + singular (and uncountable), There are + plural.
// The noun after the gap is never slotted (it decides the key). Choose: 10 is,
// 10 are; distractors the other form, has/have (the "X has Y" transfer) and
// bare be. Build: cue (be). Transform kinds: singular → plural (5), plural →
// singular (5), "X has Y" → "There is/are Y in X" (5).
//
// Run: node tools/grammar-practice/authored/sentence-structure.existential.there-is-are.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "existential", topic: "there-is-are", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const W = {
  is: "The noun after the gap is singular or uncountable, so use There is.",
  are: "The noun after the gap is plural, so use There are.",
};
const O = { is: ["is", "are", "has", "be"], are: ["are", "is", "have", "be"] };

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["is", "There ______ a bank near the {place}, {name}.", { place: ["bazaar", "station", "park", "school"], name: NAME }],
  ["is", "There ______ a cat under the {furniture}, {name}.", { furniture: ["bed", "table", "sofa", "car"], name: NAME }],
  ["is", "There ______ some milk in the {container}, {name}.", { container: ["fridge", "cup", "bottle", "jug"], name: NAME }],
  ["is", "There ______ a new student in our {group}, {name}.", { group: ["class", "group", "team", "club"], name: NAME }],
  ["is", "There ______ a big park in {city}, {name}.", { city: CITY, name: NAME }],
  ["is", "There ______ an apple in my {bag}, {name}.", { bag: ["bag", "lunchbox", "pocket", "backpack"], name: NAME }],
  ["is", "There ______ a lot of snow in {city} today, {name}.", { city: CITY, name: NAME }],
  ["is", "There ______ a problem with my {thing}, {name}.", { thing: ["phone", "laptop", "bike", "car"], name: NAME }],
  ["is", "There ______ a bus stop opposite the {place}, {name}.", { place: ["hospital", "bank", "hotel", "library"], name: NAME }],
  ["is", "There ______ some bread on the {surface}, {name}.", { surface: ["table", "shelf", "plate", "tray"], name: NAME }],
  ["are", "There ______ three bedrooms in our {home}, {name}.", { home: ["flat", "house", "new flat", "dacha"], name: NAME }],
  ["are", "There ______ twenty students in my {group}, {name}.", { group: ["class", "group", "course", "English class"], name: NAME }],
  ["are", "There ______ a lot of people at the {place}, {name}.", { place: ["bazaar", "station", "stadium", "beach"], name: NAME }],
  ["are", "There ______ some eggs in the {container}, {name}.", { container: ["fridge", "box", "basket", "bag"], name: NAME }],
  ["are", "There ______ many trees in {city}, {name}.", { city: CITY, name: NAME }],
  ["are", "There ______ two cafés in our {area}, {name}.", { area: ["street", "area", "building", "village"], name: NAME }],
  ["are", "There ______ some books on the {furniture}, {name}.", { furniture: ["desk", "shelf", "floor", "table"], name: NAME }],
  ["are", "There ______ five people in my family, {name}. We live in {city}.", { city: CITY, name: NAME }],
  ["are", "There ______ new chairs in the {room}, {name}.", { room: ["classroom", "kitchen", "office", "library"], name: NAME }],
  ["are", "There ______ lots of shops in the {place}, {name}.", { place: ["city centre", "old town", "new mall", "station"], name: NAME }],
].map(([k, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: O[k], key: 0, why: W[k], slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write is or are.";
const BUILD = [
  ["is", "There ______ (be) a letter on your {furniture}, {name}.", { furniture: ["desk", "bed", "chair", "table"], name: NAME }],
  ["is", "There ______ (be) a pharmacy next to the {place}, {name}.", { place: ["bank", "school", "park", "bazaar"], name: NAME }],
  ["is", "There ______ (be) some juice in the {container}, {name}.", { container: ["fridge", "bottle", "jug", "glass"], name: NAME }],
  ["is", "There ______ (be) a man at the {place}, {name}.", { place: ["door", "gate", "window", "desk"], name: NAME }],
  ["is", "There ______ (be) a good café in {city}, {name}.", { city: CITY, name: NAME }],
  ["is", "There ______ (be) an old photo in my {thing}, {name}.", { thing: ["wallet", "bag", "book", "phone"], name: NAME }],
  ["is", "There ______ (be) a lot of traffic in {city} today, {name}.", { city: CITY, name: NAME }],
  ["is", "There ______ (be) a swimming pool in our {place}, {name}.", { place: ["school", "college", "hotel", "gym"], name: NAME }],
  ["is", "There ______ (be) a TV in the {room}, {name}.", { room: ["kitchen", "bedroom", "living room", "classroom"], name: NAME }],
  ["is", "There ______ (be) a lot of water on the {surface}, {name}.", { surface: ["floor", "table", "road", "path"], name: NAME }],
  ["are", "There ______ (be) two windows in the {room}, {name}.", { room: ["kitchen", "bedroom", "classroom", "office"], name: NAME }],
  ["are", "There ______ (be) some apples on the {surface}, {name}.", { surface: ["table", "plate", "tray", "shelf"], name: NAME }],
  ["are", "There ______ (be) many students at the {place} today, {name}.", { place: ["library", "canteen", "gym", "bus stop"], name: NAME }],
  ["are", "There ______ (be) some cats in the {place}, {name}.", { place: ["yard", "garden", "street", "park"], name: NAME }],
  ["are", "There ______ (be) lots of cars on the {road}, {name}.", { road: ["road", "street", "bridge", "motorway"], name: NAME }],
  ["are", "There ______ (be) thirty pages in this {book}, {name}.", { book: ["book", "notebook", "magazine", "report"], name: NAME }],
  ["are", "There ______ (be) two bags under the {furniture}, {name}.", { furniture: ["bed", "table", "desk", "chair"], name: NAME }],
  ["are", "There ______ (be) some children in the {place}, {name}.", { place: ["pool", "park", "yard", "garden"], name: NAME }],
  ["are", "There ______ (be) three bus stops on our {road}, {name}.", { road: ["street", "road", "route", "avenue"], name: NAME }],
  ["are", "There ______ (be) new computers in our {room}, {name}.", { room: ["classroom", "library", "office", "lab"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W[key], slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_PL = "Write the sentence with the new number. Write one word in the gap.";
const T_HAS = "Write the same idea with There is or There are. Write one word in the gap.";
const TRANSFORM = [
  [T_PL, "There is a book on the {furniture}, {name}.", "There ______ two books on the {furniture}, {name}.", "are", { furniture: ["shelf", "desk", "table", "bed"], name: NAME }],
  [T_PL, "There is a cat in the {place}, {name}.", "There ______ three cats in the {place}, {name}.", "are", { place: ["yard", "garden", "kitchen", "street"], name: NAME }],
  [T_PL, "There is one student in the {room}, {name}.", "There ______ ten students in the {room}, {name}.", "are", { room: ["classroom", "library", "canteen", "gym"], name: NAME }],
  [T_PL, "There is a bus at the {place}, {name}.", "There ______ two buses at the {place}, {name}.", "are", { place: ["station", "bus stop", "gate", "corner"], name: NAME }],
  [T_PL, "There is an egg in the {container}, {name}.", "There ______ six eggs in the {container}, {name}.", "are", { container: ["fridge", "box", "basket", "bag"], name: NAME }],
  [T_PL, "There are two shops near my {place}, {name}.", "There ______ one shop near my {place}, {name}.", "is", { place: ["house", "school", "flat", "office"], name: NAME }],
  [T_PL, "There are some apples on the {surface}, {name}.", "There ______ an apple on the {surface}, {name}.", "is", { surface: ["table", "plate", "tray", "shelf"], name: NAME }],
  [T_PL, "There are two parks in {city}, {name}.", "There ______ one park in {city}, {name}.", "is", { city: CITY, name: NAME }],
  [T_PL, "There are many people in the {place}, {name}.", "There ______ one person in the {place}, {name}.", "is", { place: ["room", "queue", "car", "lift"], name: NAME }],
  [T_PL, "There are some letters for you at the {place}, {name}.", "There ______ a letter for you at the {place}, {name}.", "is", { place: ["desk", "door", "office", "post office"], name: NAME }],
  [T_HAS, "Our {home} has three bedrooms, {name}.", "There ______ three bedrooms in our {home}, {name}.", "are", { home: ["flat", "house", "dacha", "new flat"], name: NAME }],
  [T_HAS, "{city} has a big airport, {name}.", "There ______ a big airport in {city}, {name}.", "is", { city: CITY, name: NAME }],
  [T_HAS, "The {room} has a big window, {name}.", "There ______ a big window in the {room}, {name}.", "is", { room: ["kitchen", "bedroom", "classroom", "office"], name: NAME }],
  [T_HAS, "Our {place} has a new gym, {name}.", "There ______ a new gym in our {place}, {name}.", "is", { place: ["school", "college", "hotel", "building"], name: NAME }],
  [T_HAS, "Our {road} has two cafés, {name}.", "There ______ two cafés on our {road}, {name}.", "are", { road: ["street", "road", "avenue", "block"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: W[key] + (instr === T_HAS ? " Don't use has after There." : ""), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write about one thing in your bag. Use There is.", "There is", ["exactly one sentence", "singular noun"]],
  ["Write about the people in your family. Use There are.", "There are", ["exactly one sentence", "plural noun"]],
  ["Write about your street. Use There is and There are.", "There is / There are", ["exactly two sentences", "must use is and are"]],
  ["Write about food in your fridge. Use There is some.", "There is some", ["exactly one sentence", "uncountable noun"]],
  ["Write about your classroom. Use There are.", "There are", ["exactly one sentence", "must use are"]],
  ["Write about a park in your town. Use There is.", "There is", ["exactly one sentence", "must use is"]],
  ["Write about your room. Use There are two ….", "There are two", ["exactly one sentence", "plural noun"]],
  ["Write about your town: one thing it has. Use There is, not has.", "There is", ["exactly one sentence", "no has"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your bedroom.", "There is / There are", ["There is", "There are"]],
  ["Describe your town for a visitor.", "There is / There are", ["There is a", "There are"]],
  ["Describe your school.", "There is / There are", ["There is", "There are"]],
  ["Describe your kitchen: what food and things are there?", "There is / There are", ["There is some", "There are"]],
  ["Describe a photo of a street.", "There is / There are", ["There is", "There are"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/sentence-structure.existential.there-is-are.json", JSON.stringify(items, null, 1) + "\n");