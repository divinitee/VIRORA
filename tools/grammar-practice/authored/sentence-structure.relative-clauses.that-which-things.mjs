// Hand-authored: sentence-structure / relative-clauses / that-which-things (A2).
// Path fill P50 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: that / which for a thing (This is the book ______ I told
// you about: who / where / that / whose).
// Sibling scope: THINGS only (book, phone, film, cake, bus, song …), defining
// clauses, no commas. People (who) are P49, places (where) P51: no houses,
// rooms, cities or shops as the noun, because "the house where I live" is
// right too. No whose, no "which" vs "what" after a noun (B1 topic).
// One right answer: that and which are BOTH right for a thing, so a choose
// item offers only one of them (key that 10, key which 10), and every typed
// key accepts the other word too. Distractors who / where / what (the book
// what I bought is a common error). whose is never offered (it can fit
// before a noun).
// Build: one blank = that + the verb in brackets (key "that is", accepted
// "which is"), singular and plural things, present and past, so the verb
// agrees with the thing.
// Transform: 5 join two sentences (subject relative) / 5 correct the mistake
// / 5 define a thing (A fridge is a machine that keeps food cold).
//
// Run: node tools/grammar-practice/authored/sentence-structure.relative-clauses.that-which-things.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "relative-clauses", topic: "that-which-things", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const WHO = ["Mum", "Dad", "my uncle", "Grandpa"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  that: "The noun is a thing, so use that (which is also right). who is for people, where for places.",
  which: "The noun is a thing, so use which (that is also right). who is for people, where for places.",
  build: "A thing + that / which + verb: the verb agrees with the thing (the phone that is, the shoes that are).",
};
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const OPT = { that: ["that", "who", "where", "what"], which: ["which", "who", "where", "what"] };
const other = (k) => [k.startsWith("that") ? k.replace(/^that/, "which") : k.replace(/^which/, "that")];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["that", "This is the book ______ I told you about, {name}.", { name: NAME }],
  ["which", "I lost the {thing} ______ {who} gave me.", { thing: ["watch", "pen", "scarf", "bag"], who: WHO }],
  ["that", "The {food} ______ Grandma made was delicious, {name}.", { food: ["cake", "plov", "soup", "bread"], name: NAME }],
  ["which", "Where is the {thing} ______ was on the table, {name}?", { thing: ["phone", "key", "letter", "cup"], name: NAME }],
  ["that", "We watched a film ______ was very {adj}, {name}.", { adj: ["funny", "sad", "long", "scary"], name: NAME }],
  ["which", "The bus ______ goes to {place} leaves at {time}.", { place: ["the airport", "the station", "the centre", "the bazaar"], time: ["seven", "eight", "nine", "ten"] }],
  ["that", "I don't like songs ______ are too {adj}, {name}.", { adj: ["loud", "slow", "long", "sad"], name: NAME }],
  ["which", "The shoes ______ I bought {when} are too small.", { when: ["yesterday", "last week", "on Monday", "at the bazaar"] }],
  ["that", "Do you have a {thing} ______ I can use, {name}?", { thing: ["pen", "charger", "dictionary", "calculator"], name: NAME }],
  ["which", "This is the {thing} ______ my dad uses for work, {name}.", { thing: ["laptop", "car", "phone", "bike"], name: NAME }],
  ["that", "The {thing} ______ we found in the yard belongs to {who}.", { thing: ["ball", "bike", "key", "toy"], who: ["our neighbour", "the boy next door", "my cousin", "Aziz"] }],
  ["which", "I want a phone ______ has a good {part}, {name}.", { part: ["camera", "battery", "screen", "speaker"], name: NAME }],
  ["that", "The {thing} ______ you sent me {when} is beautiful.", { thing: ["photo", "card", "video", "picture"], when: ["yesterday", "last night", "on my birthday", "this morning"] }],
  ["which", "Is this the train ______ stops in {city}, {name}?", { city: ["Samarkand", "Bukhara", "Jizzakh", "Navoi"], name: NAME }],
  ["that", "The {food} ______ you bought at the bazaar are very sweet, {name}.", { food: ["melons", "grapes", "apricots", "peaches"], name: NAME }],
  ["which", "Can I see the {thing} ______ you made at school, {name}?", { thing: ["poster", "model", "card", "picture"], name: NAME }],
  ["that", "This is the {game} ______ my brother likes, {name}.", { game: ["game", "song", "film", "book"], name: NAME }],
  ["which", "The {thing} ______ are on the shelf are {who}'s.", { thing: ["books", "plates", "cups", "boxes"], who: ["Mum", "Grandma", "my sister", "Lola"] }],
  ["that", "I'm reading a story ______ is about a {hero}, {name}.", { hero: ["dragon", "king", "brave girl", "small boy"], name: NAME }],
  ["which", "The {thing} ______ broke last week is working again, {name}.", { thing: ["fridge", "TV", "washing machine", "car"], name: NAME }],
].map(([k, prompt, slots], i) => {
  const options = rot(OPT[k], i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: W[k], slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write that and the verb in brackets in the right form.";
const BUILD = [
  ["that is", "The phone ______ (be) on the table is mine, {name}. Yours is in the {place}.", { name: NAME, place: ["bag", "car", "kitchen", "drawer"] }],
  ["that are", "The shoes ______ (be) in the box are new, {name}.", { name: NAME }],
  ["that goes", "Take the bus ______ (go) to the {place}, {name}.", { place: ["centre", "station", "airport", "bazaar"], name: NAME }],
  ["that go", "The buses ______ (go) to {city} leave from here, {name}.", { city: ["Samarkand", "Bukhara", "Tashkent", "Fergana"], name: NAME }],
  ["that has", "I want a bag ______ (have) a lot of pockets, {name}.", { name: NAME }],
  ["that have", "We need chairs ______ (have) soft seats for the {room}.", { room: ["kitchen", "office", "classroom", "hall"] }],
  ["that was", "The {food} ______ (be) in the fridge was very cold, {name}.", { food: ["milk", "juice", "melon", "water"], name: NAME }],
  ["that were", "The {thing} ______ (be) on my desk were for school, {name}.", { thing: ["books", "papers", "pens", "notebooks"], name: NAME }],
  ["that makes", "This is the machine ______ (make) {food}, {name}.", { food: ["coffee", "bread", "ice cream", "juice"], name: NAME }],
  ["that make", "I don't like films ______ (make) me cry, {name}.", { name: NAME }],
  ["that broke", "The {thing} ______ (break) yesterday was very old.", { thing: ["cup", "plate", "glass", "chair"] }],
  ["that won", "This is the {thing} ______ (win) the prize, {name}.", { thing: ["picture", "cake", "poem", "song"], name: NAME }],
  ["that costs", "I can't buy a phone ______ (cost) so much, {name}.", { name: NAME }],
  ["that cost", "The {thing} ______ (cost) a lot were not very good.", { thing: ["shoes", "headphones", "glasses", "jeans"] }],
  ["that tells", "I'm reading a book ______ (tell) the story of {who}.", { who: ["a famous king", "a small village", "an old horse", "a brave girl"] }],
  ["that stops", "Is this the train ______ (stop) in {city}, {name}?", { city: ["Samarkand", "Bukhara", "Jizzakh", "Navoi"], name: NAME }],
  ["that keeps", "We need a box ______ (keep) the {food} cold.", { food: ["fish", "meat", "drinks", "ice cream"] }],
  ["that opens", "Where is the key ______ (open) this {thing}, {name}?", { thing: ["door", "box", "drawer", "gate"], name: NAME }],
  ["that arrived", "The parcel ______ (arrive) {when} is for {who}.", { when: ["today", "this morning", "yesterday", "at lunch"], who: ["Grandma", "Dad", "you", "my sister"] }],
  ["that live", "Animals ______ (live) in the {place} need a lot of water.", { place: ["desert", "zoo", "forest", "mountains"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, acceptable: other(key), why: W.build, slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with that.";
const COR = "Correct the mistake.";
const DEF = "Say what the thing does. Use that.";
const TRANSFORM = [
  // join (5)
  [JOIN, "I bought a {thing}, {name}. It was very cheap.", "I bought a {thing} ______ very cheap, {name}.", "that was", { thing: ["phone", "jacket", "bag", "bike"], name: NAME }],
  [JOIN, "Where is the {thing}? It was on the table, {name}.", "Where is the {thing} ______ on the table, {name}?", "that was", { thing: ["key", "letter", "cake", "cup"], name: NAME }],
  [JOIN, "We watched a film. It made us {feel}, {name}.", "We watched a film ______ us {feel}, {name}.", "that made", { feel: ["laugh", "cry", "think", "smile"], name: NAME }],
  [JOIN, "Take the bus, {name}. It goes to the {place}.", "Take the bus ______ to the {place}, {name}.", "that goes", { place: ["centre", "station", "airport", "bazaar"], name: NAME }],
  [JOIN, "I like {thing}. They have a lot of pictures, {name}.", "I like {thing} ______ a lot of pictures, {name}.", "that have", { thing: ["books", "magazines", "comics", "websites"], name: NAME }],
  // correct (5)
  [COR, "This is the book who I told you about, {name}.", "This is the book ______ I told you about, {name}.", "that", { name: NAME }],
  [COR, "The {food} what Grandma made was delicious.", "The {food} ______ Grandma made was delicious.", "that", { food: ["cake", "plov", "soup", "bread"] }],
  [COR, "The bus that it goes to the {place} is late, {name}.", "The bus ______ to the {place} is late, {name}.", "that goes", { place: ["centre", "station", "airport", "bazaar"], name: NAME }],
  [COR, "I want a phone where has a good {part}, {name}.", "I want a phone ______ a good {part}, {name}.", "that has", { part: ["camera", "battery", "screen", "speaker"], name: NAME }],
  [COR, "The shoes that is in the box are new, {name}.", "The shoes ______ in the box are new, {name}.", "that are", { name: NAME }],
  // define (5)
  [DEF, "A fridge keeps {food} cold.", "A fridge is a machine ______ {food} cold.", "that keeps", { food: ["food", "milk", "drinks", "meat"] }],
  [DEF, "A dictionary tells you what {thing} mean.", "A dictionary is a book ______ you what {thing} mean.", "that tells", { thing: ["words", "new words", "English words", "hard words"] }],
  [DEF, "A {tool} cuts {thing}.", "A {tool} is a thing ______ {thing}.", "that cuts", { tool: ["knife", "pair of scissors", "saw", "blade"], thing: ["paper", "bread", "wood", "things"] }],
  [DEF, "A {room} washes {thing}.", "A {room} is a machine ______ {thing}.", "that washes", { room: ["washing machine", "dishwasher", "car wash", "washer"], thing: ["clothes", "plates", "cars", "things"] }],
  [DEF, "A clock shows the time {where}.", "A clock is a thing ______ the time {where}.", "that shows", { where: ["on the wall", "in the kitchen", "at the station", "in our classroom"] }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, acceptable: other(key), why: W.build, slots: fix(slots, source + hint) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a book or film that you like.", "… is a book / film that …", ["exactly one sentence", "that or which", "a describing word"]],
  ["Write one sentence about a present that someone gave you.", "The … that my … gave me …", ["exactly one sentence", "that or which", "a person word"]],
  ["Say what a phone is. Use a thing that.", "A phone is a thing that …", ["exactly one sentence", "that", "a verb with -s"]],
  ["Write one sentence about food that you don't like.", "I don't like food that …", ["exactly one sentence", "that", "a food word"]],
  ["Write one sentence about the bus or train that you take to school or work.", "The bus that I take …", ["exactly one sentence", "that or which", "a time word"]],
  ["Write one sentence about a song that makes you happy.", "… is a song that makes me …", ["exactly one sentence", "that makes", "a feeling word"]],
  ["Write one sentence about a thing that you lost.", "I lost the … that …", ["exactly one sentence", "that or which", "a past verb"]],
  ["Write two sentences: one with that and one with which, both about things.", "… that … / … which …", ["exactly two sentences", "that once", "which once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe three things in your room. Say something about each one with that or which.", "The … that … / The … which …", ["that or which three times", "a thing word", "three or four sentences"]],
  ["Describe your favourite film or book and why you like it.", "It's a film that … / The part that I like …", ["that or which", "a feeling word", "three or four sentences"]],
  ["You want to buy a new phone. Describe the phone that you want.", "I want a phone that has …", ["that", "has or have", "three or four sentences"]],
  ["Describe three machines in your kitchen and what they do.", "A … is a machine that …", ["that three times", "a verb with -s", "three or four sentences"]],
  ["Describe the presents that you got for your last birthday.", "The … that my … gave me …", ["that or which", "a past verb", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.relative-clauses.that-which-things.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);