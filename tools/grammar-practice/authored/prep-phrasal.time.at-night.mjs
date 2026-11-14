// Hand-authored: prep-phrasal / time / at-night (A1).
// Path fill P10 (2026-11-14, Base44 AI, branch grammar-path-fill-2-base44).
//
// Placement focus: at night, a fixed expression, versus in the morning /
// afternoon / evening ("I usually sleep at night").
// Sibling scope (P7-P11): every key here is AT in "at night". No clock times
// (P7), days (P8) or months (P9), and no sentence that mixes two prepositions
// of time (in-on-at-contrast, P11). The contrast with "in the morning /
// evening" is taught in transform (the source says in the evening, the target
// says at night), never as two time markers in one sentence.
// The blank is always followed by bare "night" (no "the", and never "night"
// + noun as in "the night market"), so "in night" and "on night" are wrong,
// and "in the night" (correct English) can never be produced. Choose options
// at / in / on / at the: in and on are the L1 errors (Russian "ночью" has no
// preposition, learners reach for in), at the is the extra article. Never by
// ("by night" is correct) and never tonight / during.
// Build: "Write at, in or on." (closed class, choice in instr). No other "at"
// in any build source or transform target.
// Transform: 5 correct in / on / at the -> at / 5 change in the morning,
// afternoon or evening to night / 5 say the opposite of a daytime sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.time.at-night.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "time", topic: "at-night", level: "A1", pv: "2.5" };

const OPTS = ["at", "in", "on", "at the"];
const W = "At night is a fixed expression: at + night, with no the. We say in the morning and in the evening, but at night.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["{animal} hunt ______ night in the {place}.",
    { animal: ["Owls", "Bats", "Foxes", "Wild cats"], place: ["forest", "fields", "mountains", "hills"] }],
  ["I can't sleep ______ night, {name}. It is too {adj}.",
    { name: ["Mum", "Dad", "Grandma", "Aunt Lola"], adj: ["hot", "noisy", "bright", "cold"] }],
  ["The streets of {city} are beautiful ______ night, {name}.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Khiva"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["My {who} works ______ night in a {place}.",
    { who: ["mum", "aunt", "uncle", "father"], place: ["hospital", "bakery", "hotel", "big shop"] }],
  ["Don't eat {food} ______ night, {name}.",
    { food: ["sweets", "chocolate", "big meals", "fried food"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["We can see the {sky} from our {place} ______ night.",
    { sky: ["stars", "moon", "city lights", "planes"], place: ["roof", "balcony", "garden", "window"] }],
  ["{name} likes to study ______ night when the {place} is quiet.",
    { name: ["Lola", "Aziz", "Madina", "Timur"], place: ["house", "flat", "street", "yard"] }],
  ["{name}, the dogs in our {place} bark ______ night.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], place: ["street", "village", "neighbourhood", "yard"] }],
  ["It is cold in the {place} ______ night, so take a {thing}.",
    { place: ["mountains", "desert", "village", "tent"], thing: ["jacket", "warm coat", "blanket", "sweater"] }],
  ["Please turn off your {device} ______ night, {name}.",
    { device: ["phone", "computer", "TV", "tablet"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["{who} bakes bread ______ night, so it is fresh for the {place}.",
    { who: ["Our neighbour", "The baker", "Mr Karimov", "My uncle"], place: ["market", "shop", "cafe", "bazaar"] }],
  ["{name} hears the {sound} ______ night.",
    { name: ["Aziz", "Olga", "Grandpa", "Lola"], sound: ["river", "wind", "rain", "trains"] }],
  ["My little {who} doesn't like to sleep alone ______ night, {name}.",
    { who: ["brother", "sister", "cousin", "nephew"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  ["The mosquitoes by the {place} bite ______ night, {name}.",
    { place: ["river", "lake", "canal", "pond"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["Grandpa drinks a cup of warm {drink} ______ night, {name}.",
    { drink: ["milk", "tea", "green tea", "water"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["The {bus} doesn't run ______ night, so we take a taxi, {name}.",
    { bus: ["metro", "bus", "tram", "minibus"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["{name} often dreams about {thing} ______ night.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], thing: ["football", "school", "flying", "the sea"] }],
  ["{name}, our city looks different ______ night. Look at the {lights}!",
    { name: ["Mum", "Dad", "Aziz", "Olga"], lights: ["lights", "moon", "tower", "bridge"] }],
  ["The {shop} near our home is open ______ night too, {name}.",
    { shop: ["pharmacy", "small shop", "cafe", "bakery"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["{cat} is very active ______ night. It {does}.",
    { cat: ["Our cat", "My cat", "Grandma's cat", "The neighbour's cat"], does: ["runs around the house", "plays with its toys", "jumps on the beds", "wakes us up"] }],
].map(([prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS, key: 0, why: W, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write at, in or on.";
const BW = "Night takes at: at night (but in the morning, in the evening).";
const BUILD = [
  ["{name} usually sleeps {n} hours ______ night.",
    { name: ["Aziz", "Lola", "Grandpa", "My sister"], n: ["seven", "eight", "nine", "six"] }],
  ["The {animal} in the {place} come out ______ night.",
    { animal: ["owls", "bats", "hedgehogs", "foxes"], place: ["forest", "park", "garden", "fields"] }],
  ["I read a {book} in bed ______ night, {name}.",
    { book: ["book", "story", "comic", "magazine"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  ["The air is cool in the {place} ______ night, {name}.",
    { place: ["mountains", "village", "garden", "desert"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["{who} drives a {vehicle} ______ night.",
    { who: ["My uncle", "Mr Karimov", "Our neighbour", "My cousin"], vehicle: ["taxi", "bus", "truck", "delivery van"] }],
  ["We see many stars ______ night in the {place}, {name}.",
    { place: ["village", "mountains", "desert", "countryside"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["Our {pet} sleeps in the {room} ______ night.",
    { pet: ["cat", "dog", "puppy", "kitten"], room: ["kitchen", "hall", "yard", "living room"] }],
  ["Close the windows ______ night, {name}. It gets {adj}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["cold", "windy", "very cold", "noisy"] }],
  ["{name} feels hungry ______ night and eats {food}.",
    { name: ["Aziz", "Lola", "Timur", "My brother"], food: ["bread", "fruit", "nuts", "an apple"] }],
  ["The {road} near our house is quiet ______ night, {name}.",
    { road: ["road", "street", "square", "big road"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["{who} tells us {stories} ______ night.",
    { who: ["My grandmother", "Grandpa", "My aunt", "Mum"], stories: ["stories", "fairy tales", "old stories", "funny stories"] }],
  ["{name} works ______ night as a {job}.",
    { name: ["Aunt Lola", "My uncle", "Our neighbour", "Mr Karimov"], job: ["nurse", "baker", "taxi driver", "cleaner"] }],
  ["Don't play loud {music} ______ night, {name}.",
    { music: ["music", "songs", "games", "videos"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["You can hear the {sound} ______ night, {name}.",
    { sound: ["river", "wind", "trains", "frogs"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["Our {town} is very beautiful ______ night, {name}.",
    { town: ["town", "village", "city", "street"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["{name} turns off the {device} ______ night.",
    { name: ["Dad", "Grandpa", "Aziz", "My sister"], device: ["TV", "lights", "computer", "radio"] }],
  ["{who} locks the {thing} ______ night.",
    { who: ["Grandpa", "Dad", "My uncle", "Mr Karimov"], thing: ["gate", "door", "garage", "shop"] }],
  ["My baby {who} wakes up ______ night and wants {thing}.",
    { who: ["brother", "sister", "cousin", "nephew"], thing: ["milk", "Mum", "water", "a toy"] }],
  ["We sit in the {place} and talk ______ night, {name}.",
    { place: ["yard", "garden", "kitchen", "living room"], name: ["Grandma", "Aziz", "Olga", "Dad"] }],
  ["The city {thing} are bright ______ night, {name}.",
    { thing: ["lights", "signs", "streets", "windows"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
].map(([source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "at", why: BW, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const EVE = "Now it happens at night. Rewrite the sentence.";
const OPP = "Say the opposite: the night, not the day.";
const TRANSFORM = [
  // correct in / on / at the -> at (5)
  [COR, "{name} sleeps badly in night when it is {adj}.", "{name} sleeps badly ______ night when it is {adj}.",
    "We say at night, not in night.", { name: ["Aziz", "Grandpa", "My sister", "Lola"], adj: ["hot", "noisy", "windy", "cold"] }],
  [COR, "The {animal} come to our {place} on night.", "The {animal} come to our {place} ______ night.",
    "We say at night, not on night.", { animal: ["hedgehogs", "cats", "foxes", "birds"], place: ["garden", "yard", "street", "village"] }],
  [COR, "We look for stars from the {place} at the night, {name}.", "We look for stars from the {place} ______ night, {name}.",
    "At night has no the: at night.", { place: ["roof", "balcony", "garden", "hill"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [COR, "My {who} works in night in a {place}.", "My {who} works ______ night in a {place}.",
    "We say at night, not in night.", { who: ["mum", "aunt", "sister", "uncle"], place: ["hospital", "bakery", "hotel", "factory"] }],
  [COR, "It is very quiet on night in our {place}, {name}.", "It is very quiet ______ night in our {place}, {name}.",
    "We say at night, not on night.", { place: ["village", "street", "town", "yard"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  // in the morning / afternoon / evening -> at night (5)
  [EVE, "{name} does homework in the {room} in the evening.", "{name} does homework in the {room} ______ night.",
    "In the evening changes to night, and night takes at: at night.", { name: ["Aziz", "Lola", "Timur", "Madina"], room: ["kitchen", "living room", "bedroom", "dining room"] }],
  [EVE, "Grandpa walks the {pet} in the morning, {name}.", "Grandpa walks the {pet} ______ night, {name}.",
    "In the morning, but at night: night takes at.", { pet: ["dog", "puppy", "old dog", "big dog"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [EVE, "My {who} goes running in the {place} in the afternoon.", "My {who} goes running in the {place} ______ night.",
    "In the afternoon, but at night: night takes at.", { who: ["brother", "uncle", "dad", "cousin"], place: ["park", "stadium", "street", "neighbourhood"] }],
  [EVE, "We water the {plants} in the evening, {name}.", "We water the {plants} ______ night, {name}.",
    "In the evening, but at night: night takes at.", { plants: ["flowers", "trees", "garden", "tomatoes"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  [EVE, "{name} listens to {music} in the morning.", "{name} listens to {music} ______ night.",
    "In the morning, but at night: night takes at.", { name: ["Aziz", "Lola", "My sister", "Timur"], music: ["music", "the radio", "old songs", "podcasts"] }],
  // say the opposite (5)
  [OPP, "Owls sleep during the day in the {place}.", "Owls are awake ______ night in the {place}.",
    "The opposite of during the day is at night.", { place: ["forest", "mountains", "fields", "park"] }],
  [OPP, "Our {road} is very busy during the day, {name}.", "Our {road} is very quiet ______ night, {name}.",
    "The opposite of during the day is at night.", { road: ["street", "road", "square", "town"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [OPP, "It is hot in the {place} during the day, {name}.", "It is cold in the {place} ______ night, {name}.",
    "The opposite of during the day is at night.", { place: ["desert", "mountains", "village", "tent"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [OPP, "The {shop} near us is open during the day, {name}.", "The {shop} near us is closed ______ night, {name}.",
    "The opposite of during the day is at night.", { shop: ["bakery", "post office", "bank", "library"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [OPP, "{name} can't see the {sky} during the day.", "{name} can see the {sky} ______ night.",
    "The opposite of during the day is at night.", { name: ["Aziz", "Lola", "Grandpa", "My sister"], sky: ["stars", "moon", "city lights", "bright stars"] }],
].map(([instr, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: "at", why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what you usually do at night.", "at night", ["exactly one sentence", "must use at night", "about you"]],
  ["Write one sentence about your street or village at night.", "at night", ["exactly one sentence", "must use at night", "a place word"]],
  ["Write one sentence about a person in your family and what they do at night.", "at night", ["exactly one sentence", "must use at night", "a family word"]],
  ["Write one sentence about something you can see or hear at night from your home.", "can see / can hear … at night", ["exactly one sentence", "must use at night", "see or hear"]],
  ["Write one question to a friend about their night.", "Do you … at night?", ["exactly one question", "must use at night", "must end with a question mark"]],
  ["Write one sentence with a rule for your home at night.", "Don't … at night", ["exactly one sentence", "must use at night", "a rule: don't / please"]],
  ["Write one sentence that compares the morning and the night in your town.", "in the morning … at night", ["exactly one sentence", "in the morning and at night", "about your town"]],
  ["Write two sentences: one thing you do in the evening, one thing you do at night.", "in the evening / at night", ["exactly two sentences", "in the evening in one", "at night in the other"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your evening and your night: what you do after dinner and at night.", "in the evening / at night", ["in the evening …", "at night …", "three or four sentences"]],
  ["Tell a visitor what your town or village is like at night.", "at night", ["at night", "quiet / beautiful / dark", "three or four sentences"]],
  ["Write a message to a friend who can't sleep. Give some advice for the night.", "at night", ["Don't … at night", "at night", "advice words: try, don't"]],
  ["Tell a friend about a person you know who works at night.", "at night", ["works at night", "what they do", "when they sleep"]],
  ["Compare your morning and your night. What is different?", "in the morning / at night", ["in the morning …", "at night …", "but"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.time.at-night.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);