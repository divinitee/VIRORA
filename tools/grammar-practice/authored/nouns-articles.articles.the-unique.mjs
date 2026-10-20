// Hand-authored: nouns-articles / articles / the-unique (A1).
//
// Tests ONE point: the for something there is only one of in the world
// (the sun, the moon, the sky, the world, the internet, the Earth, the
// weather) and for "the capital of ...".
// No adjective ever comes before the noun: "a full moon" / "a blue sky"
// would make "a" correct. The noun after the blank is never slotted.
//
// Choose distractors: a / an and no article (L1 transfer: no articles in
// Uzbek/Russian). Build/transform keys are typed "the"; no build/transform
// sentence prints "the".
//
// Run: node tools/grammar-practice/authored/nouns-articles.articles.the-unique.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "articles", topic: "the-unique", level: "A1", pv: "2.5" };
const OPTS = ["the", "a", "an", "–"];
const WHY = (n) => `There is only one ${n}, so everyone knows which one. Use the.`;
const WHY_CAP = "A country has only one capital, so use the: the capital of ...";

const SUN = "sun", MOON = "moon", SKY = "sky", WORLD = "world", NET = "internet", EARTH = "Earth", WEATHER = "weather";
const MONTH = ["July", "June", "August", "May"];
const CITY = ["Tashkent", "Samarkand", "Bukhara", "Termez"];
const NAME = ["Aziz", "Olga", "Timur", "Malika"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [SUN, "______ sun is very hot in {city} in {month}.", { city: CITY, month: MONTH }],
  [MOON, "Look at ______ moon tonight, {name}! It's so {adj}.", { name: NAME, adj: ["big", "bright", "beautiful", "round"] }],
  [SKY, "______ sky is {colour} this morning over {city}.", { colour: ["blue", "grey", "dark", "clear"], city: CITY }],
  [WORLD, "{name} wants to travel around ______ world with {who}.", { name: ["Kamila", "Sardor", "Anna", "Bobur"], who: NAME }],
  [NET, "I find a lot of {thing} on ______ internet.", { thing: ["recipes", "music", "English lessons", "news"] }],
  [EARTH, "In our {subject} lesson we learned that ______ Earth is round.", { subject: ["science", "geography", "physics", "astronomy"] }],
  ["cap", "{name} lives in Tashkent, ______ capital of Uzbekistan.", { name: NAME }],
  [SUN, "Don't look at ______ sun on the {place}, {name}!", { place: ["beach", "roof", "balcony", "mountain"], name: NAME }],
  [MOON, "We can see ______ moon from our {place}.", { place: ["balcony", "window", "roof", "garden"] }],
  [NET, "My {person} reads news on ______ internet every {time}.", { person: ["father", "grandfather", "aunt", "brother"], time: ["morning", "evening", "day", "night"] }],
  [SKY, "The stars in ______ sky are beautiful in {place}.", { place: ["Nurata", "our village", "Khiva", "the desert"] }],
  [WEATHER, "______ weather is {adj} in {city} today.", { adj: ["hot", "cold", "nice", "windy"], city: CITY }],
  [WORLD, "{name} talks to friends all over ______ world on {device}.", { name: NAME, device: ["a laptop", "a tablet", "a computer", "video calls"] }],
  [SUN, "In {city}, ______ sun goes down very late in {month}.", { city: CITY, month: MONTH }],
  [SKY, "Can you see ______ sky from your {room}, {name}?", { room: ["room", "bedroom", "office", "classroom"], name: NAME }],
  [MOON, "My {person} wants to fly to ______ moon.", { person: ["brother", "sister", "son", "cousin"] }],
  [NET, "Is there Wi-Fi here? I need ______ internet for my {thing}.", { thing: ["homework", "lesson", "work", "project"] }],
  [MOON, "{name} took a photo of ______ moon from the {place}.", { name: NAME, place: ["roof", "hill", "garden", "boat"] }],
  [EARTH, "In the photo from space, ______ Earth looks {adj}.", { adj: ["blue", "small", "beautiful", "round"] }],
  [SKY, "______ sky over the {place} is full of stars.", { place: ["desert", "mountains", "village", "lake"] }],
].map(([n, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS, key: 0, why: n === "cap" ? WHY_CAP : WHY(n), slots }));

/* ---------------- build: 20 gap_fill (no "the" printed) ---------------- */
const INSTR_B = "Write a, an or the.";
const BUILD = [
  [SUN, "______ sun is very hot in {city} in {month}.", { city: CITY, month: MONTH }],
  [MOON, "Look at ______ moon tonight, {name}! It's so {adj}.", { name: NAME, adj: ["big", "bright", "beautiful", "round"] }],
  [SKY, "______ sky is {colour} this morning over {city}.", { colour: ["blue", "grey", "dark", "clear"], city: CITY }],
  [WORLD, "{name} wants to travel around ______ world with {who}.", { name: ["Kamila", "Sardor", "Anna", "Bobur"], who: NAME }],
  [NET, "I find a lot of {thing} on ______ internet.", { thing: ["recipes", "music", "English lessons", "news"] }],
  [EARTH, "In our {subject} lesson we learned that ______ Earth is round.", { subject: ["science", "geography", "physics", "astronomy"] }],
  ["cap", "{name} lives in Tashkent, ______ capital of Uzbekistan.", { name: NAME }],
  [SUN, "Don't look at ______ sun on your {place}, {name}!", { place: ["balcony", "roof", "walk", "trip"], name: NAME }],
  [MOON, "We can see ______ moon from our {place}.", { place: ["balcony", "window", "roof", "garden"] }],
  [NET, "My {person} reads news on ______ internet every {time}.", { person: ["father", "grandfather", "aunt", "brother"], time: ["morning", "evening", "day", "night"] }],
  [SKY, "Stars in ______ sky are beautiful in {place}.", { place: ["Nurata", "our village", "Khiva", "Bukhara"] }],
  [WEATHER, "______ weather is {adj} in {city} today.", { adj: ["hot", "cold", "nice", "windy"], city: CITY }],
  [WORLD, "{name} talks to friends all over ______ world on {device}.", { name: NAME, device: ["a laptop", "a tablet", "a computer", "video calls"] }],
  [SUN, "In {city}, ______ sun goes down very late in {month}.", { city: CITY, month: MONTH }],
  [SKY, "Can you see ______ sky from your {room}, {name}?", { room: ["room", "bedroom", "office", "classroom"], name: NAME }],
  [MOON, "My {person} wants to fly to ______ moon.", { person: ["brother", "sister", "son", "cousin"] }],
  [NET, "Is there Wi-Fi here? I need ______ internet for my {thing}.", { thing: ["homework", "lesson", "work", "project"] }],
  [MOON, "{name} took a photo of ______ moon from {place}.", { name: NAME, place: ["our roof", "a hill", "our garden", "a boat"] }],
  [EARTH, "In this photo from space, ______ Earth looks {adj}.", { adj: ["blue", "small", "beautiful", "round"] }],
  [SKY, "______ sky over our {place} is full of stars.", { place: ["village", "dacha", "camp", "town"] }],
].map(([n, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "the", why: n === "cap" ? WHY_CAP : WHY(n), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_ANS = "Read the question. Complete the answer with a, an or the.";
const T_CAP = "Read the sentence. Complete the second sentence with a, an or the.";
const T_FIX = "The first sentence has a mistake. Complete the correct sentence with a, an or the.";
const TRANSFORM = [
  // kind 1: answer a question about something unique
  [T_ANS, SUN, "What is big, hot and yellow over {city} at {time}?", "It's ______ sun.", { city: CITY, time: ["noon", "midday", "lunchtime", "two o'clock"] }],
  [T_ANS, MOON, "What can you see at night above our {place}, {name}?", "We can see ______ moon.", { place: ["house", "village", "dacha", "school"], name: NAME }],
  [T_ANS, SKY, "What is blue above {city} on a {day} day?", "It's ______ sky.", { city: CITY, day: ["sunny", "clear", "warm", "summer"] }],
  [T_ANS, NET, "Where does {name} watch {thing}?", "On ______ internet.", { name: NAME, thing: ["films", "lessons", "music videos", "cartoons"] }],
  [T_ANS, WORLD, "{name} wants to visit every country with {who} one day. What does she want to do?", "She wants to travel around ______ world.", { name: ["Kamila", "Olga", "Malika", "Nodira"], who: ["her sister", "her friends", "her cousin", "her mother"] }],
  // kind 2: the capital of ...
  [T_CAP, "cap", "{name} is from Tashkent, like {who}.", "Tashkent is ______ capital of Uzbekistan.", { name: NAME, who: ["my uncle", "our teacher", "my friend", "my neighbour"] }],
  [T_CAP, "cap", "{name} lives in Astana with {who}.", "Astana is ______ capital of Kazakhstan.", { name: ["Aidana", "Arman", "Dana", "Yerlan"], who: ["two friends", "a cousin", "an uncle", "three friends"] }],
  [T_CAP, "cap", "{name} studies in Moscow with {who}.", "Moscow is ______ capital of Russia.", { name: ["Olga", "Ivan", "Anna", "Sergei"], who: ["two friends", "a cousin", "an uncle", "three friends"] }],
  [T_CAP, "cap", "{name} works in Bishkek with {who}.", "Bishkek is ______ capital of Kyrgyzstan.", { name: ["Aibek", "Nurlan", "Aigul", "Bakyt"], who: ["two friends", "a cousin", "an uncle", "three friends"] }],
  [T_CAP, "cap", "{name} visited Dushanbe with {who}.", "Dushanbe is ______ capital of Tajikistan.", { name: NAME, who: ["two friends", "a cousin", "an uncle", "three friends"] }],
  // kind 3: fix the mistake
  [T_FIX, NET, "I found {thing} on internet, {name}.", "I found {thing} on ______ internet, {name}.", { thing: ["a recipe", "a song", "a video", "my answer"], name: NAME }],
  [T_FIX, MOON, "Moon is very bright over {place} tonight, {name}.", "______ moon is very bright over {place} tonight, {name}.", { place: ["our village", "our dacha", "Chimgan", "Nurata"], name: NAME }],
  [T_FIX, SUN, "A sun is very strong in {city} in {month}.", "______ sun is very strong in {city} in {month}.", { city: CITY, month: MONTH }],
  [T_FIX, SKY, "Look at sky over {city}, {name}!", "Look at ______ sky over {city}, {name}!", { city: CITY, name: NAME }],
  [T_FIX, EARTH, "{name} says an Earth is very {adj}.", "{name} says ______ Earth is very {adj}.", { name: NAME, adj: ["old", "big", "beautiful", "round"] }],
].map(([instr, n, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: "the", why: n === "cap" ? WHY_CAP : WHY(n), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the sun in summer.", "the sun", ["exactly one sentence", "must use the sun"]],
  ["Write one sentence about the moon at night.", "the moon", ["exactly one sentence", "must use the moon"]],
  ["Write one sentence about what you do on the internet.", "the internet", ["exactly one sentence", "must use the internet"]],
  ["Write one sentence about the weather today.", "the weather", ["exactly one sentence", "must use the weather"]],
  ["Write one sentence about the capital of your country.", "the capital of", ["exactly one sentence", "must use the capital of"]],
  ["Write one sentence about a place in the world you want to visit.", "the world", ["exactly one sentence", "must use the world"]],
  ["Write one sentence about the sky in your town.", "the sky", ["exactly one sentence", "must use the sky"]],
  ["Write two sentences: one about the sun and one about the moon.", "the sun / the moon", ["exactly two sentences", "must use the sun", "must use the moon"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a summer day in your town. Write three or four sentences.", "the + unique noun", ["the sun", "the sky", "the weather"]],
  ["Describe a night in the mountains or the desert. Write three or four sentences.", "the + unique noun", ["the moon", "the sky", "stars"]],
  ["How do you use the internet for your studies? Write three or four sentences.", "the internet", ["the internet", "two activities", "a reason"]],
  ["Write about your dream trip around the world. Write three or four sentences.", "the world / the capital of", ["the world", "the capital of", "a country"]],
  ["Write a short weather report for your city. Write three or four sentences.", "the + unique noun", ["the weather", "the sun or the sky", "today"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.articles.the-unique.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.articles.the-unique.json`);