// Hand-authored: nouns-articles / possession / possessive-s (A2).
//
// Tests ONE point: 's on a singular name (Aziz's bike, James's car).
// The name is under test, so it is never a slot; slots are the owned thing
// and the context. Choose distractors: bare name (Uzbek "Aziz mashinasi",
// Russian "машина Азиза" carry no apostrophe), Name + s (no apostrophe),
// Name is (confusing 's with is). For names ending in -s the key is s's and
// "James'" is never offered (style guides allow it); typed keys accept both.
// Typed keys carry a curly-apostrophe alternative in `acceptable`.
//
// Run: node tools/grammar-practice/authored/nouns-articles.possession.possessive-s.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "possession", topic: "possessive-s", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DAY = ["Friday", "Saturday", "Sunday", "Monday"];
const opts = (n) => n.endsWith("s") ? [`${n}'s`, n, `${n}es`, `${n} is`] : [`${n}'s`, n, `${n}s`, `${n} is`];
const why = (n) => `${n} is one person who owns something, so add 's: ${n}'s.`;
const acc = (n) => (n.endsWith("s") ? [`${n}’s`, `${n}'`, `${n}’`] : [`${n}’s`]);

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["Aziz", "This is ______ {thing}. He got it in {city}.", { thing: ["bike", "phone", "watch", "bag"], city: CITY }],
  ["Olga", "______ {person} lives in {city}.", { person: ["mother", "father", "sister", "brother"], city: CITY }],
  ["Timur", "We are going to ______ {home} on {day}.", { home: ["house", "flat", "party", "birthday party"], day: DAY }],
  ["Malika", "______ {pet} is very {adj}.", { pet: ["cat", "dog", "parrot", "rabbit"], adj: ["clever", "friendly", "small", "funny"] }],
  ["Bobur", "I found ______ {thing} in the {place}.", { thing: ["phone", "key", "book", "pen"], place: ["classroom", "car", "kitchen", "hall"] }],
  ["Dilnoza", "______ {subject} teacher is from {city}.", { subject: ["maths", "English", "history", "music"], city: CITY }],
  ["Anna", "Can I use ______ {thing}, please? Mine is at {place}.", { thing: ["laptop", "pen", "ruler", "charger"], place: ["home", "school", "work", "college"] }],
  ["Rustam", "______ {person} is a {job}.", { person: ["uncle", "aunt", "father", "mother"], job: ["doctor", "driver", "teacher", "cook"] }],
  ["Nigora", "______ {thing} is on the {place}.", { thing: ["bag", "coat", "phone", "book"], place: ["table", "chair", "sofa", "desk"] }],
  ["Sanjar", "We watched a film at ______ {home} on {day}.", { home: ["house", "flat", "home", "place"], day: DAY }],
  ["Kamola", "______ {food} is the best in {city}.", { food: ["plov", "soup", "cake", "salad"], city: CITY }],
  ["Ivan", "______ {person} plays football on {day}.", { person: ["brother", "cousin", "son", "dad"], day: DAY }],
  ["Lola", "{who} borrowed ______ {thing} yesterday.", { who: ["I", "My sister", "Aziz", "We"], thing: ["pen", "umbrella", "book", "bike"] }],
  ["Jasur", "______ {thing} is {colour}.", { thing: ["car", "bike", "bag", "phone"], colour: ["red", "black", "blue", "white"] }],
  ["Elena", "Is this ______ {thing}, {name}?", { thing: ["coat", "scarf", "bag", "hat"], name: NAME }],
  ["Sardor", "______ {person} is coming to {city} tomorrow.", { person: ["grandmother", "uncle", "cousin", "friend"], city: CITY }],
  ["Madina", "I like ______ {thing} very much. It is {adj}.", { thing: ["dress", "bag", "room", "drawing"], adj: ["beautiful", "nice", "lovely", "great"] }],
  ["Boris", "______ {person} lives near the {place}.", { person: ["brother", "sister", "family", "aunt"], place: ["park", "station", "river", "market"] }],
  ["James", "This is ______ {thing}. He left it in the {place}.", { thing: ["jacket", "phone", "bag", "book"], place: ["car", "classroom", "café", "hall"] }],
  ["Zarina", "______ {room} is next to the {place}.", { room: ["room", "office", "desk", "locker"], place: ["kitchen", "window", "door", "stairs"] }],
].map(([n, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(n), key: 0, why: why(n), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the name in brackets with 's.";
const BUILD = [
  ["Olga", "______ (Olga) {person} is a nurse in {city}.", { person: ["mother", "aunt", "sister", "cousin"], city: CITY }],
  ["Timur", "This is ______ (Timur) {thing} from {city}.", { thing: ["bike", "ball", "cap", "watch"], city: CITY }],
  ["Aziz", "We had dinner at ______ (Aziz) {home} on {day}.", { home: ["house", "flat", "home", "place"], day: DAY }],
  ["Malika", "______ (Malika) {pet} sleeps on the {place}.", { pet: ["cat", "dog", "rabbit", "puppy"], place: ["sofa", "bed", "floor", "chair"] }],
  ["Bobur", "I can't find ______ (Bobur) {thing} in the {place}.", { thing: ["phone", "key", "book", "pen"], place: ["car", "bag", "classroom", "kitchen"] }],
  ["Dilnoza", "______ (Dilnoza) {subject} homework is on the {place}.", { subject: ["maths", "English", "history", "science"], place: ["desk", "table", "shelf", "bed"] }],
  ["Anna", "______ (Anna) {person} works at the {place}.", { person: ["father", "mother", "uncle", "aunt"], place: ["hospital", "bank", "airport", "market"] }],
  ["Rustam", "Is that ______ (Rustam) {thing}, {name}?", { thing: ["car", "bike", "bag", "coat"], name: NAME }],
  ["Nigora", "______ (Nigora) {food} is famous in our {place}.", { food: ["plov", "cake", "soup", "samsa"], place: ["street", "family", "village", "class"] }],
  ["Sanjar", "We are going to ______ (Sanjar) {event} on {day}.", { event: ["party", "wedding", "birthday party", "concert"], day: DAY }],
  ["Kamola", "______ (Kamola) {thing} is {colour}.", { thing: ["dress", "bag", "scarf", "phone"], colour: ["red", "green", "blue", "white"] }],
  ["Ivan", "I borrowed ______ (Ivan) {thing} for the {event}.", { thing: ["camera", "laptop", "bike", "jacket"], event: ["trip", "weekend", "party", "concert"] }],
  ["Lola", "______ (Lola) {person} lives in {city}.", { person: ["grandmother", "aunt", "uncle", "cousin"], city: CITY }],
  ["Jasur", "______ (Jasur) {room} is next to the {place}.", { room: ["bedroom", "room", "office", "desk"], place: ["kitchen", "bathroom", "stairs", "door"] }],
  ["Sardor", "We played football in ______ (Sardor) {place} on {day}.", { place: ["yard", "garden", "street", "village"], day: DAY }],
  ["Madina", "______ (Madina) {thing} is on the {place}.", { thing: ["coat", "bag", "hat", "scarf"], place: ["chair", "bed", "sofa", "hook"] }],
  ["Elena", "______ (Elena) {person} is a {job}.", { person: ["brother", "sister", "father", "mother"], job: ["doctor", "driver", "teacher", "cook"] }],
  ["Boris", "This is ______ (Boris) {thing}, {name}.", { thing: ["bag", "phone", "book", "pen"], name: NAME }],
  ["Nodir", "______ (Nodir) {pet} is very {adj}.", { pet: ["dog", "cat", "parrot", "horse"], adj: ["friendly", "clever", "big", "old"] }],
  ["Gulnora", "I found ______ (Gulnora) {thing} under the {place}.", { thing: ["pen", "phone", "key", "ring"], place: ["desk", "table", "sofa", "bed"] }],
].map(([n, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${n}'s`, acceptable: acc(n), why: why(n), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_BEL = "Rewrite with 's.";
const T_OF = "Rewrite with 's instead of of.";
const T_TWO = "Join the sentences. Use 's in each gap.";
const TWO = (a, b) => `${a} and ${b} are each one owner, so both take 's.`;
const TRANSFORM = [
  [T_BEL, "This {thing} belongs to Aziz, {name}.", "This is ______ {thing}, {name}.", "Aziz", { thing: ["bike", "phone", "watch", "bag"], name: ["Olga", "Timur", "Malika", "Dilnoza"] }],
  [T_BEL, "This {thing} belongs to Olga. She bought it in {city}.", "This is ______ {thing}. She bought it in {city}.", "Olga", { thing: ["scarf", "bag", "dress", "hat"], city: CITY }],
  [T_BEL, "The {thing} on the {place} belongs to Timur.", "It is ______ {thing} on the {place}.", "Timur", { thing: ["phone", "book", "cap", "pen"], place: ["table", "desk", "shelf", "sofa"] }],
  [T_BEL, "That {pet} belongs to Malika, {name}.", "That is ______ {pet}, {name}.", "Malika", { pet: ["cat", "dog", "parrot", "rabbit"], name: ["Aziz", "Olga", "Timur", "Bobur"] }],
  [T_BEL, "The {thing} in the {place} belongs to Bobur.", "The {thing} in the {place} is ______.", "Bobur", { thing: ["car", "bike", "bag", "ball"], place: ["yard", "garage", "street", "garden"] }],
  [T_OF, "The {person} of Dilnoza lives in {city}.", "______ {person} lives in {city}.", "Dilnoza", { person: ["mother", "father", "sister", "brother"], city: CITY }],
  [T_OF, "The {thing} of Anna is on the {place}.", "______ {thing} is on the {place}.", "Anna", { thing: ["bag", "coat", "phone", "laptop"], place: ["table", "chair", "sofa", "desk"] }],
  [T_OF, "The {home} of Rustam is near the {place}.", "______ {home} is near the {place}.", "Rustam", { home: ["house", "flat", "shop", "office"], place: ["park", "station", "river", "market"] }],
  [T_OF, "The {food} of Nigora is very good, {name}.", "______ {food} is very good, {name}.", "Nigora", { food: ["plov", "cake", "soup", "samsa"], name: NAME }],
  [T_OF, "The {person} of Sanjar works in {city}.", "______ {person} works in {city}.", "Sanjar", { person: ["uncle", "aunt", "father", "cousin"], city: CITY }],
  [T_TWO, "Lola has a cat and Jasur has a dog. They play in the {place}, {name}.", "______ cat and ______ dog play in the {place}, {name}.", ["Lola's", "Jasur's"], { place: ["yard", "garden", "street", "park"], name: NAME }, TWO("Lola", "Jasur")],
  [T_TWO, "Elena has a bike and Sardor has a car. They are in the {place}, {name}.", "______ bike and ______ car are in the {place}, {name}.", ["Elena's", "Sardor's"], { place: ["yard", "garage", "street", "car park"], name: NAME }, TWO("Elena", "Sardor")],
  [T_TWO, "Madina has a brother and Nodir has a sister. They study in {city}, {name}.", "______ brother and ______ sister study in {city}, {name}.", ["Madina's", "Nodir's"], { city: CITY, name: NAME }, TWO("Madina", "Nodir")],
  [T_TWO, "Zarina has a flat and Akmal has a house. They are near the {place} in {city}.", "______ flat and ______ house are near the {place} in {city}.", ["Zarina's", "Akmal's"], { place: ["park", "station", "river", "market"], city: CITY }, TWO("Zarina", "Akmal")],
  [T_TWO, "Farrukh has a laptop and Kamila has a tablet. They are on the {place}, {name}.", "______ laptop and ______ tablet are on the {place}, {name}.", ["Farrukh's", "Kamila's"], { place: ["table", "desk", "sofa", "shelf"], name: NAME }, TWO("Farrukh", "Kamila")],
].map(([instr, source, hint, key, slots, w]) => Array.isArray(key)
  ? { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots }
  : { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `${key}'s`, acceptable: acc(key), why: why(key), slots });

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about your best friend's phone or bag. Use their name with 's.", "Name's", ["exactly one sentence", "must use 's with a name"]],
  ["Write one sentence about a relative of a friend. Use 's.", "Name's", ["exactly one sentence", "must use 's"]],
  ["Ask a classmate: is this thing someone's? Use a name with 's.", "Is this Name's", ["exactly one question", "must use 's"]],
  ["Write one sentence about two friends and their things. Use 's twice.", "Name's … Name's", ["exactly one sentence", "must use 's twice"]],
  ["Write one sentence about a teacher's room. Use the teacher's name with 's.", "Name's", ["exactly one sentence", "must use 's"]],
  ["Write one sentence about food someone in your family makes. Use 's.", "Name's", ["exactly one sentence", "must use 's"]],
  ["Write one sentence about a friend's pet. Use 's.", "Name's", ["exactly one sentence", "must use 's"]],
  ["Write two sentences about where your friend's family lives. Use 's.", "Name's", ["exactly two sentences", "must use 's"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your best friend's family. Write three or four sentences.", "possessive 's", ["Name's mother / father", "lives", "'s"]],
  ["You found some things in the classroom. Write whose they are. Write three or four sentences.", "possessive 's", ["This is Name's", "'s", "found"]],
  ["Describe a party at a friend's house. Write three or four sentences.", "possessive 's", ["Name's house", "Name's", "'s"]],
  ["Describe your friends' pets or favourite things. Write three or four sentences.", "possessive 's", ["Name's", "is", "'s"]],
  ["Write a short message to a friend about a lost bag. Whose is it?", "possessive 's", ["Is it Name's", "'s", "bag"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.possession.possessive-s.json", JSON.stringify(items, null, 1) + "\n");