// Hand-authored: pronouns / demonstrative / that-those-far (A1).
// Path fill P5 (2026-11-14, Base44 AI, branch grammar-path-fill-base44).
//
// Placement focus: those for plural far objects (______ are my shoes over
// there), and those as a pronoun (I don't like these shoes. I prefer ______
// over there). Rule 14 (course audit): cover singular THAT as well as plural
// THOSE, so every stage is about half that, half those.
// Every sentence carries a fixed, never-slotted FAR marker (over there, across
// the street, far away, up there in the sky, at the end of the street, on the
// top shelf over there), so this / these are wrong on distance and the noun's
// number rules out the other far form. Only distance meaning: no "That's a
// good idea" or "that day", where this can be right too.
// Build: "Write that or those" (closed class, choice in instr). Transform:
// 5 singular -> plural / 5 correct a mistake / 5 move the thing from near to
// far. this / these are never the key (this-these-near is P4).
//
// Run: node tools/grammar-practice/authored/pronouns.demonstrative.that-those-far.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "demonstrative", topic: "that-those-far", level: "A1", pv: "2.5" };

const UP = { s: ["That", "Those", "This", "These"], p: ["Those", "That", "These", "This"] };
const LO = { s: ["that", "those", "this", "these"], p: ["those", "that", "these", "this"] };
const WS = (far) => `One thing, and it is far from you (${far}), so use that. Those is for more than one; this and these are for things near you.`;
const WP = (far) => `More than one, and they are far from you (${far}), so use those. That is for one thing; this and these are for things near you.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [UP.s, WS("over there"), "Look, {name}! ______ is my school over there, behind the {place}.",
    { name: ["Mum", "Aziz", "Olga", "Grandpa"], place: ["park", "big shop", "stadium", "hospital"] }],
  [UP.p, WP("over there by the door"), "______ are my shoes over there by the {place}. Can you bring them, {name}?",
    { place: ["door", "sofa", "window", "bed"], name: ["Mum", "Aziz", "Lola", "Dad"] }],
  [LO.p, WP("over there"), "I don't like these {item}, {name}. I prefer ______ over there.",
    { item: ["shoes", "jeans", "boots", "trainers"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  [LO.s, WS("over there near the gate"), "Who is ______ man over there near the {place}? He is looking at {who}.",
    { place: ["gate", "bus stop", "car", "door"], who: ["us", "you", "Dad", "me"] }],
  [LO.p, WP("far away"), "Can you see ______ mountains far away, {name}? They are very {adj}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["high", "beautiful", "big", "tall"] }],
  [UP.s, WS("across the street"), "______ house across the street is {who}'s. It has a {feature}.",
    { who: ["Aziz", "my aunt", "our teacher", "Mr Karimov"], feature: ["blue gate", "big garden", "red roof", "tall tree"] }],
  [LO.p, WP("up there in the sky"), "Look at ______ birds up there in the sky, {name}! They are flying to the {place}.",
    { name: ["Aziz", "Olga", "Grandpa", "Lola"], place: ["river", "mountains", "south", "lake"] }],
  [LO.s, WS("at the end of the street"), "{name}, what is ______ big building at the end of the {street}?",
    { name: ["Dad", "Aziz", "Olga", "Mum"], street: ["street", "road", "park", "square"] }],
  [UP.p, WP("over there on the top shelf"), "______ apples over there on the top shelf are {adj}. Let's buy some {other} too.",
    { adj: ["cheap", "very red", "sweet", "from Fergana"], other: ["pears", "grapes", "melons", "peaches"] }],
  [LO.s, WS("over there by the gate"), "Is ______ your bike over there by the {place}, {name}?",
    { place: ["gate", "wall", "tree", "shop"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [UP.p, WP("across the road"), "______ girls across the road are my {who}. They live on {street}.",
    { who: ["classmates", "cousins", "neighbours", "friends"], street: ["our street", "Navoi Street", "the next street", "the corner"] }],
  [LO.s, WS("on the other side of the street"), "Do you see ______ car on the other side of the {place}? It's my {who}'s.",
    { place: ["street", "road", "square", "market"], who: ["uncle", "dad", "neighbour", "teacher"] }],
  [UP.p, WP("over the hills, far away"), "______ clouds over the {place} far away are very dark. Take your {thing}.",
    { place: ["hills", "mountains", "city", "river"], thing: ["umbrella", "coat", "raincoat", "jacket"] }],
  [LO.s, WS("on the top shelf over there"), "Excuse me, how much is ______ {colour} hat on the {where} over there?",
    { colour: ["blue", "black", "red", "white"], where: ["top shelf", "wall", "window", "table"] }],
  [UP.p, WP("over there in the yard"), "______ boys over there in the yard are playing {game} with my {who}.",
    { game: ["football", "tag", "basketball", "volleyball"], who: ["brother", "cousin", "friend", "neighbour"] }],
  [LO.s, WS("in the window over there"), "I want ______ cake in the window over there, {name}. The one with {topping}.",
    { name: ["Mum", "Dad", "Grandma", "Aunt Lola"], topping: ["strawberries", "chocolate", "cream", "fruit"] }],
  [UP.p, WP("far away near the river"), "______ trees far away near the {place} are very {adj}.",
    { place: ["river", "road", "school", "mountains"], adj: ["old", "tall", "green", "big"] }],
  [LO.s, WS("over there on the chair"), "{name}, can you bring me ______ bag over there on the {place}?",
    { name: ["Mum", "Aziz", "Olga", "Timur"], place: ["chair", "table", "floor", "sofa"] }],
  [LO.p, WP("over there at the bus stop"), "{name}, ______ people over there at the bus stop are waiting for the {bus}.",
    { name: ["Look", "Mum", "Aziz", "Dad"], bus: ["number 5 bus", "airport bus", "school bus", "minibus"] }],
  [LO.s, WS("over there"), "Which phone do you want, this {adj} one or ______ one over there, {name}?",
    { adj: ["black", "blue", "small", "cheap"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "The things are far from you. Write that or those.";
const BS = (n) => `${n} is one thing, so use that.`;
const BP = (n) => `${n} are more than one, so use those.`;
const BUILD = [
  ["That", BS("House"), "______ house over there is my {who}'s, {name}.",
    { who: ["aunt", "uncle", "teacher", "friend"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["Those", BP("Cows"), "______ cows over there in the {place} are ours, {name}.",
    { place: ["field", "yard", "village", "valley"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["those", BP("People"), "Who are ______ people across the {place}, {name}?",
    { place: ["street", "road", "square", "yard"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["that", BS("Tower"), "Can you see ______ tower far away, {name}? It is {adj}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["very tall", "old", "famous", "beautiful"] }],
  ["Those", BP("Shoes"), "______ shoes on the top shelf over there are too {adj}, {name}.",
    { adj: ["big", "small", "expensive", "high"], name: ["Mum", "Grandma", "Dad", "Aunt Lola"] }],
  ["that", BS("Cat"), "Is ______ your cat on the {place} over there, {name}?",
    { place: ["roof", "wall", "car", "gate"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["Those", BP("Students"), "______ students over there are from {city}. They are {adj}.",
    { city: ["Nukus", "Termez", "Kazan", "Almaty"], adj: ["new", "on a trip", "very friendly", "in my class"] }],
  ["that", BS("Shop"), "What is ______ shop at the end of the {street}, {name}?",
    { street: ["street", "road", "square", "park"], name: ["Dad", "Aziz", "Olga", "Mum"] }],
  ["those", BP("Flowers"), "I like ______ flowers in the garden over there. They are {adj}, {name}.",
    { adj: ["red", "beautiful", "tall", "white"], name: ["Mum", "Grandma", "Aziz", "Lola"] }],
  ["That", BS("Boy"), "______ boy over there is my {who}, {name}.",
    { who: ["brother", "cousin", "classmate", "neighbour"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["those", BP("Bags"), "Do you want this {colour} bag or ______ bags over there, {name}?",
    { colour: ["blue", "black", "red", "brown"], name: ["Aziz", "Olga", "Mum", "Lola"] }],
  ["That", BS("Man"), "______ man over there sells {thing} at the {place}.",
    { thing: ["bread", "fruit", "ice cream", "newspapers"], place: ["market", "corner", "station", "park"] }],
  ["those", BP("Buildings"), "{name}, ______ buildings far away near the {place} are new.",
    { name: ["Look", "Mum", "Aziz", "Dad"], place: ["river", "airport", "park", "station"] }],
  ["that", BS("Car"), "Look at ______ car across the road, {name}! It is {adj}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["so old", "beautiful", "very big", "bright red"] }],
  ["Those", BP("Children"), "______ children at the other end of the {place} are playing {game}.",
    { place: ["park", "yard", "street", "field"], game: ["football", "tag", "hide and seek", "volleyball"] }],
  ["that", BS("Window"), "Can you open ______ window over there, {name}? It's {adj} in here.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["hot", "warm", "too warm", "very hot"] }],
  ["Those", BP("Birds"), "______ birds on the {place} over there are very {adj}.",
    { place: ["roof", "tree", "wall", "fence"], adj: ["noisy", "small", "beautiful", "loud"] }],
  ["that", BS("House"), "Who lives in ______ big house on the {place} over there?",
    { place: ["hill", "corner", "next street", "other side of the river"] }],
  ["those", BP("Grandparents"), "{name}, ______ are my grandparents over there by the {place}.",
    { name: ["Look", "Aziz", "Olga", "Timur"], place: ["car", "gate", "door", "bench"] }],
  ["That", BS("School"), "______ is my old school over there, next to the {place}.",
    { place: ["park", "hospital", "stadium", "river"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PL = "Make it plural (more than one).";
const COR = "Correct the mistake.";
const FAR = "Now the thing is far from you, over there. Rewrite the sentence.";
const TRANSFORM = [
  // singular -> plural (5)
  [PL, "Those", "That boy over there is in my {group}, {name}.", "______ boys over there are in my {group}, {name}.",
    "Boys is more than one, so that changes to those.", { group: ["class", "team", "club", "group"], name: ["Mum", "Dad", "Grandpa", "Aunt Lola"] }],
  [PL, "Those", "That dog across the street is {adj}, {name}.", "______ dogs across the street are {adj}, {name}.",
    "Dogs is more than one, so that changes to those.", { adj: ["big", "noisy", "friendly", "hungry"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [PL, "Those", "That car over there is my {who}'s.", "______ cars over there are my {who}'s.",
    "Cars is more than one, so that changes to those.", { who: ["uncle", "neighbour", "dad", "cousin"] }],
  [PL, "Those", "That is my friend {name} over there.", "______ are my friends {name} and {name2} over there.",
    "Two friends are more than one, so That is changes to Those are.", { name: ["Aziz", "Lola", "Bobur", "Madina"], name2: ["Kamila", "Sardor", "Nodira", "Jasur"] }],
  [PL, "Those", "That tree near the {place} is very {adj}.", "______ trees near the {place} are very {adj}.",
    "Trees is more than one, so that changes to those.", { place: ["river", "gate", "school", "road"], adj: ["old", "tall", "big", "green"] }],
  // correct the mistake (5)
  [COR, "Those", "That shoes over there are {adj}, {name}.", "______ shoes over there are {adj}, {name}.",
    "Shoes is plural, so use those, not that.", { adj: ["mine", "new", "too big", "my sister's"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  [COR, "That", "Those house across the {place} is very {adj}.", "______ house across the {place} is very {adj}.",
    "House is one thing, so use that, not those.", { place: ["street", "road", "river", "square"], adj: ["old", "big", "beautiful", "small"] }],
  [COR, "That", "This bag over there on the {place} is {who}'s.", "______ bag over there on the {place} is {who}'s.",
    "The bag is over there, far from you, so use that, not this.", { place: ["chair", "table", "floor", "sofa"], who: ["Aziz", "Mum", "my sister", "the teacher"] }],
  [COR, "Those", "These birds up there in the sky are flying to the {place}, {name}.", "______ birds up there in the sky are flying to the {place}, {name}.",
    "The birds are far away in the sky, so use those, not these.", { place: ["river", "lake", "mountains", "south"], name: ["Aziz", "Olga", "Grandpa", "Lola"] }],
  [COR, "That", "Those water in the {place} over there is very {adj}.", "______ water in the {place} over there is very {adj}.",
    "Water has no plural, so use that, not those.", { place: ["river", "lake", "canal", "pool"], adj: ["cold", "clean", "deep", "dirty"] }],
  // near -> far (5)
  [FAR, "that", "{name}, this bag here is {adj}.", "{name}, ______ bag over there is {adj}.",
    "The bag is far now and it is one thing, so this changes to that.", { name: ["Aziz", "Olga", "Mum", "Dad"], adj: ["heavy", "mine", "open", "new"] }],
  [FAR, "Those", "These girls here are my {who}, {name}.", "______ girls over there are my {who}, {name}.",
    "The girls are far now and there are more than one, so these changes to those.", { who: ["classmates", "cousins", "friends", "neighbours"], name: ["Mum", "Dad", "Grandpa", "Aunt Lola"] }],
  [FAR, "that", "Is this your {thing} here, {name}?", "Is ______ your {thing} over there, {name}?",
    "The thing is far now and it is one thing, so this changes to that.", { thing: ["phone", "jacket", "ball", "umbrella"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [FAR, "Those", "These apples in my hand are {adj}, {name}.", "______ apples on the tree over there are {adj}, {name}.",
    "The apples are far now, on the tree, so these changes to those.", { adj: ["sweet", "red", "big", "green"], name: ["Mum", "Grandma", "Aziz", "Lola"] }],
  [FAR, "That", "This chair next to me is {adj}, {name}.", "______ chair by the door over there is {adj}, {name}.",
    "The chair is far now and it is one thing, so this changes to that.", { adj: ["free", "broken", "new", "very old"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([instr, key, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Look out of your window. Write one sentence about one thing you can see far away. Use That.", "That + is", ["exactly one sentence", "must start with That", "is, not are"]],
  ["Look out of your window. Write one sentence about some things you can see far away. Use Those.", "Those + are", ["exactly one sentence", "must start with Those", "a plural noun or are"]],
  ["You are in a shop. Ask about the price of one thing on a shelf far from you.", "How much is that …?", ["exactly one question", "must use that", "must end with a question mark"]],
  ["You are in the street with a friend. Ask who some people over there are.", "Who are those …?", ["exactly one question", "must use those", "must end with a question mark"]],
  ["Write one sentence about a building in your town that you can see from your home.", "that + noun", ["exactly one sentence", "must use that", "must name the building"]],
  ["A friend shows you two bags: one in their hand, some over there. Say which you like.", "this one / those", ["exactly one sentence", "must use those", "must say what you like"]],
  ["Write one sentence about the mountains, hills or trees far from your town.", "those + plural noun", ["exactly one sentence", "must use those", "a far word: far away, over there"]],
  ["Write two sentences about things you can see from your school: one with that, one with those.", "that + singular / those + plural", ["exactly two sentences", "one that, one those", "is after that, are after those"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are on a high building in your town with a visitor. Tell them what they can see far away.",
    "that / those for far things", ["That is …", "Those are …", "over there / far away"]],
  ["You are at the market. Ask the seller about some things that are far from you, and say what you want.",
    "that / those + noun", ["How much is that …?", "those + plural noun", "I want …"]],
  ["Describe what you can see from your window: near things and far things.",
    "this / these and that / those", ["this or these for near things", "that or those for far things", "is / are after each one"]],
  ["You are in the school yard with a new student. Tell them who the people over there are.",
    "That is … / Those are …", ["That is my …", "Those are my …", "names and family or school words"]],
  ["Write a short message about a photo of a place in Uzbekistan you like. Point out things far away in it.",
    "that / those", ["that + one thing", "those + plural", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.demonstrative.that-those-far.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);