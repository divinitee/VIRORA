// Hand-authored: pronouns / substitution / one-ones (A2).
// Path fill P36 (Claude lane, branch grammar-path-fill-claude, 16 Nov 2026).
//
// Tests the placement bank's two A2 points: one stands for a singular
// countable noun already named ("Which jacket? The black one"), and ones
// stands for a plural noun ("The green ones are cheaper"). The bank's third
// item (formal "those of") is C1 and is not touched.
//
// The number is always fixed by a noun printed earlier in the sentence, and
// that noun is the slot, so every filler of one item has the same number.
// Frames: the + adjective + one(s), a + adjective + one, this / that / the
// other / another one, which one. Not used: "your one", "these ones"
// (disputed), uncountable nouns (no one after water / bread).
// Typed stages never print one or ones anywhere else in the sentence: a key
// may not repeat a printed word.
//
// Run: node tools/grammar-practice/authored/pronouns.substitution.one-ones.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "substitution", topic: "one-ones", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const ANY = ["Aziz", "Lola", "Madina", "Timur"];
const W1 = "One stands for a singular noun that was already named, so you do not repeat the noun.";
const WS = "Ones stands for a plural noun that was already named, so you do not repeat the noun.";

/* ---------------- choose: 20 mcq ---------------- */
const c1 = (prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: ["one", "ones", "it", "them"], key: 0, why: W1, slots });
const cs = (prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: ["ones", "one", "them", "it"], key: 0, why: WS, slots });
const CHOOSE = [
  c1("Which {item} do you want, {name}? The {colour} ______?",
    { item: ["jacket", "bag", "cup", "hat"], name: N4, colour: ["black", "blue", "red", "green"] }),
  c1("My {thing} is very old. I need a new ______, {name}.",
    { thing: ["phone", "laptop", "bike", "bag"], name: P4 }),
  c1("This {thing} is broken. Can I have another ______, {name}?",
    { thing: ["pen", "chair", "cup", "plate"], name: N4 }),
  c1("I like this {item}, but that ______ is cheaper, {name}.",
    { item: ["shirt", "watch", "lamp", "phone"], name: P4 }),
  c1("There are two {things}. Do you want the big ______, {name}?",
    { things: ["cakes", "apples", "boxes", "bags"], name: N4 }),
  c1("{name}, our car is the white ______ next to the {place}.",
    { name: N4, place: ["gate", "shop", "tree", "bank"] }),
  c1("{name} has three brothers. The youngest ______ is {n} years old.",
    { name: ANY, n: ["five", "six", "seven", "eight"] }),
  c1("This question is easy, but the next ______ is {adj}, {name}.",
    { adj: ["difficult", "very long", "harder", "strange"], name: N4 }),
  c1("I lost my umbrella, so I bought a {adj} ______ at the {place}.",
    { adj: ["new", "cheap", "small", "black"], place: ["market", "shop", "station", "bazaar"] }),
  c1("{name}, my seat is the ______ by the {place}.",
    { name: N4, place: ["window", "door", "wall", "stairs"] }),
  cs("These {fruit} are expensive, {name}. The {adj} ______ are cheaper.",
    { fruit: ["apples", "grapes", "tomatoes", "peppers"], name: P4, adj: ["green", "small", "local", "other"] }),
  cs("I don't like these {things}, {name}. Do you have any {colour} ______?",
    { things: ["shoes", "boots", "trousers", "gloves"], name: N4, colour: ["black", "brown", "white", "blue"] }),
  cs("My old {things} are too small. I need new ______, {name}.",
    { things: ["jeans", "shoes", "boots", "trainers"], name: P4 }),
  cs("Which {things} are yours, {name}? The ______ on the {place}?",
    { things: ["books", "keys", "bags", "glasses"], name: N4, place: ["table", "chair", "shelf", "floor"] }),
  cs("The red {things} are nice, but I prefer the blue ______, {name}.",
    { things: ["cups", "plates", "chairs", "curtains"], name: P4 }),
  cs("These {things} are dirty. Please bring some clean ______, {name}.",
    { things: ["glasses", "plates", "spoons", "towels"], name: N4 }),
  cs("{name} has many photos. The ______ from {place} are the best.",
    { name: ANY, place: ["Samarkand", "the wedding", "the mountains", "the school trip"] }),
  cs("{name}, we need more chairs. The ______ in the {room} are free.",
    { name: N4, room: ["hall", "kitchen", "next room", "library"] }),
  cs("These questions are easy, {name}. The ______ on page {n} are harder.",
    { name: N4, n: ["ten", "twenty", "thirty", "forty"] }),
  cs("My {relative} grows tomatoes, {name}. The small ______ are very sweet.",
    { relative: ["grandfather", "uncle", "aunt", "grandmother"], name: N4 }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write one or ones.";
const b1 = (source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "one", why: W1, slots });
const bs = (source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "ones", why: WS, slots });
const BUILD = [
  b1("This {thing} doesn't work, {name}. Try the other ______.",
    { thing: ["pen", "key", "lamp", "remote"], name: N4 }),
  b1("I have a blue {thing} and a red ______, {name}.",
    { thing: ["pen", "bag", "cup", "hat"], name: P4 }),
  b1("{name}, that film was boring. Let's watch a funny ______ {when}.",
    { name: N4, when: ["tonight", "tomorrow", "on Saturday", "after dinner"] }),
  b1("Your {thing} is nicer than the ______ I have, {name}.",
    { thing: ["phone", "bike", "room", "desk"], name: N4 }),
  b1("{name}, the {place} near my house is closed, so I go to the ______ in the centre.",
    { name: P4, place: ["shop", "market", "library", "gym"] }),
  b1("{name}, is your {thing} the black ______?",
    { name: N4, thing: ["bag", "coat", "car", "umbrella"] }),
  b1("This {thing} is too small, {name}. Do you have a bigger ______?",
    { thing: ["shirt", "jacket", "box", "table"], name: P4 }),
  b1("There are three {things} here, {name}. The ______ in the middle is mine.",
    { things: ["bags", "bikes", "phones", "cups"], name: N4 }),
  b1("I don't want a cold {drink}, {name}. I want a hot ______.",
    { drink: ["drink", "meal", "dish", "sandwich"], name: P4 }),
  b1("My {relative}'s house is the ______ with the {feature}.",
    { relative: ["uncle", "aunt", "grandmother", "friend"], feature: ["blue gate", "big tree", "red roof", "green door"] }),
  bs("These {things} are too big, {name}. Can I try the smaller ______?",
    { things: ["shoes", "jeans", "gloves", "boots"], name: P4 }),
  bs("{name}, the {things} on the top shelf are new. The ______ below are old.",
    { name: N4, things: ["books", "cups", "boxes", "toys"] }),
  bs("I like {adj} films, but my {relative} likes scary ______.",
    { adj: ["funny", "old", "short", "happy"], relative: ["brother", "sister", "cousin", "father"] }),
  bs("{name}, don't take those {things}. Take the ______ near the door.",
    { name: N4, things: ["chairs", "bags", "boxes", "shoes"] }),
  bs("Our old {things} were slow, {name}. The new ______ are much better.",
    { things: ["computers", "buses", "phones", "printers"], name: P4 }),
  bs("{name}, these {things} are for the teacher, and the ______ on the desk are for us.",
    { name: N4, things: ["books", "papers", "pens", "tests"] }),
  bs("{who} buys red {fruit}, but I like green ______.",
    { who: ["Mum", "Dad", "Grandma", "My aunt"], fruit: ["apples", "grapes", "peppers", "pears"] }),
  bs("The first two {things} were easy. The last ______ were hard, {name}.",
    { things: ["questions", "exercises", "tasks", "games"], name: N4 }),
  bs("I washed the white {things}, {name}. The dark ______ are still dirty.",
    { things: ["shirts", "socks", "towels", "T-shirts"], name: P4 }),
  bs("{name} wears black shoes to school and white ______ for {sport}.",
    { name: ANY, sport: ["sport", "tennis", "running", "the gym"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SING = "Do not repeat the noun. Use one or ones.";
const FIX = "Correct the mistake. Use one or ones.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // replace a repeated singular noun (5)
  T(SING, "I have a red {thing} and a blue {thing}, {name}.", "I have a red {thing} and a blue ______, {name}.", "one", W1,
    { thing: ["pen", "bag", "cup", "bike"], name: N4 }),
  T(SING, "This {thing} is old, {name}. I want a new {thing}.", "This {thing} is old, {name}. I want a new ______.", "one", W1,
    { thing: ["phone", "chair", "desk", "laptop"], name: P4 }),
  T(SING, "Which {thing} is yours? The black {thing}, {name}?", "Which {thing} is yours? The black ______, {name}?", "one", W1,
    { thing: ["coat", "car", "bag", "hat"], name: N4 }),
  T(SING, "The big {thing} is {price}, but the small {thing} is cheap.", "The big {thing} is {price}, but the small ______ is cheap.", "one", W1,
    { thing: ["cake", "lamp", "table", "pizza"], price: ["expensive", "a lot of money", "not cheap", "too expensive"] }),
  T(SING, "That {thing} is full. Let's sit in the other {thing}, {name}.", "That {thing} is full. Let's sit in the other ______, {name}.", "one", W1,
    { thing: ["cafe", "room", "bus", "carriage"], name: N4 }),
  // replace a repeated plural noun (5)
  T(SING, "I like the white {things}, not the black {things}, {name}.", "I like the white {things}, not the black ______, {name}.", "ones", WS,
    { things: ["shoes", "cups", "shirts", "curtains"], name: P4 }),
  T(SING, "These {things} are small, {name}. Do you have bigger {things}?", "These {things} are small, {name}. Do you have bigger ______?", "ones", WS,
    { things: ["boxes", "bags", "gloves", "plates"], name: N4 }),
  T(SING, "The new {things} are fast, but the old {things} are cheap, {name}.", "The new {things} are fast, but the old ______ are cheap, {name}.", "ones", WS,
    { things: ["phones", "computers", "bikes", "cars"], name: N4 }),
  T(SING, "{name} threw away the old {things} and kept the new {things}.", "{name} threw away the old {things} and kept the new ______.", "ones", WS,
    { name: ANY, things: ["magazines", "toys", "clothes", "boxes"] }),
  T(SING, "The red {things} are sweet, and the green {things} are sour, {name}.", "The red {things} are sweet, and the green ______ are sour, {name}.", "ones", WS,
    { things: ["apples", "grapes", "plums", "cherries"], name: P4 }),
  // correct a mistake (5)
  T(FIX, "I don't like this {thing}. Show me the blue, {name}.", "I don't like this {thing}. Show me the blue ______, {name}.", "one",
    "English needs a word after the adjective. One stands for the singular noun.",
    { thing: ["shirt", "bag", "cup", "hat"], name: N4 }),
  T(FIX, "These {things} are old, {name}. I need new one.", "These {things} are old, {name}. I need new ______.", "ones",
    "The noun is plural, so use ones, not one.",
    { things: ["shoes", "glasses", "boots", "trainers"], name: P4 }),
  T(FIX, "My {thing} is slow. I want a new it, {name}.", "My {thing} is slow. I want a new ______, {name}.", "one",
    "After a + adjective use one, not it.",
    { thing: ["phone", "laptop", "tablet", "computer"], name: P4 }),
  T(FIX, "The small {things} are nice, but I prefer the big one, {name}.", "The small {things} are nice, but I prefer the big ______, {name}.", "ones",
    "The noun is plural, so use ones, not one.",
    { things: ["plates", "windows", "rooms", "pictures"], name: N4 }),
  T(FIX, "Which {thing} do you want? This ones, {name}?", "Which {thing} do you want? This ______, {name}?", "one",
    "The noun is singular and this is singular, so use one, not ones.",
    { thing: ["cake", "seat", "book", "bike"], name: N4 }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["You are in a shop and you see two bags. Write one sentence saying which you want. Use one.", "the + adjective + one", ["exactly one sentence", "must use one in place of bag", "must not repeat the word bag"]],
  ["Write one sentence about your phone, bike or bag and a new one you want.", "a new one", ["exactly one sentence", "must name the thing first", "must use one"]],
  ["Write one sentence comparing two kinds of apples, grapes or tomatoes. Use ones.", "the + adjective + ones", ["exactly one sentence", "must name the fruit or vegetable once", "must use ones"]],
  ["A friend shows you two photos. Say which you like in one sentence. Use this one or that one.", "this one or that one", ["exactly one sentence", "must use this one or that one", "must not repeat the word photo"]],
  ["Write one sentence about your old shoes and the new ones you need.", "new ones", ["exactly one sentence", "must use ones", "must not repeat the word shoes"]],
  ["Write a question with Which one or Which ones for a friend who is choosing a film or some books.", "Which one or Which ones", ["exactly one question", "must use Which one or Which ones", "must end with a question mark"]],
  ["Write two sentences about the chairs in your classroom or home. Use ones in the second sentence.", "ones for a plural noun", ["exactly two sentences", "chairs named in the first sentence", "ones in the second sentence"]],
  ["A friend wrote: \"My pen is broken. Can you give me a new it?\" Write the question correctly.", "a new one", ["exactly one question", "must use one", "must not use it after new"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are buying clothes at the market. Tell the seller what you want and what you do not want. Write three or four sentences and use one or ones at least twice.",
    "one and ones in place of a repeated noun", ["one for a singular noun", "ones for a plural noun", "the noun is not repeated"]],
  ["Compare your old phone, bag or bike with a new one that you want. Write three or four sentences.",
    "one in place of a repeated noun", ["the old one / a new one", "no it after an adjective", "the noun named first"]],
  ["Describe the houses or buildings on your street. Which ones do you like? Write three or four sentences.",
    "one and ones in place of a repeated noun", ["the + adjective + one", "ones for plural", "the noun is not repeated"]],
  ["Your friend asks which films or songs you like. Answer with three or four sentences and use ones at least once.",
    "ones in place of a repeated plural noun", ["adjective + ones", "the noun named first", "correct number"]],
  ["You are choosing a present for a friend from three things. Say which one you choose and why. Write three or four sentences.",
    "one in place of a repeated noun", ["this one / that one / the + adjective + one", "a reason", "the noun is not repeated"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.substitution.one-ones.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
