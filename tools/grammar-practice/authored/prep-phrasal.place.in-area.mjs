// Hand-authored: prep-phrasal / place / in-area (A2).
// Path fill P30 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: in for an enclosed area (The children are playing ______
// the garden: at / on / in / to).
// Sibling scope: P25 (in-container) already has rooms, containers and the
// garden; this stop is IN for a wider AREA: a town or city, a country, a
// village, the yard, the mountains, the forest, the field, the desert, the
// countryside, the sea, the sky, the world, the centre of a town. No arrive
// at / in (P41), no movement (go to, P42): every verb is static (live, work,
// be, stay, swim, play), so "to" is never right.
// One right answer: cut while drafting the park ("at the park" is common),
// the street (in / on the street), the playground (in / at), "on the
// mountain" places (snow on the mountains), a sports field (on the field),
// a boat on the sea, "travel in the world". No factual claims about real
// places.
// Choose options in / on / at / to, rotated.
// Build: "Write in, on or at." (all keys in); no build source prints "in"
// anywhere else.
// Transform: 5 answer a Where …? question (the place is in instr; key "in
// the") / 5 correct the mistake / 5 notes → sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.place.in-area.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "place", topic: "in-area", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const GIRL = ["Lola", "Olga", "Madina", "Kamila"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Namangan"];
const COUNTRY = ["Russia", "Korea", "Turkey", "Kazakhstan"];
const REL = ["grandpa", "grandma", "uncle", "aunt"];
const OPT = ["in", "on", "at", "to"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  town: "For a town, a city or a country, use in: in Samarkand, in Uzbekistan.",
  area: "For an area with edges around it (a village, the yard, the forest, the mountains), use in.",
  sky: "We say in the sky and in the sea: the thing is inside that big area.",
  world: "We say in the world and in the countryside.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["area", "My grandparents live ______ a small village near {city}, {name}.", { city: CITY, name: NAME }],
  ["sky", "Look, {name}! There are a lot of {thing} ______ the sky tonight.", { name: NAME, thing: ["stars", "bright stars", "little stars", "clouds"] }],
  ["town", "My uncle works ______ {city}. He comes home on {day}.", { city: CITY, day: ["Fridays", "Saturdays", "Sundays", "holidays"] }],
  ["sky", "We swim ______ the sea every {when}, {name}.", { when: ["summer", "morning", "day", "holiday"], name: NAME }],
  ["area", "The children are playing ______ the yard with the {pet}, {name}.", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  ["area", "There are big trees ______ the forest near our {home}.", { home: ["village", "house", "dacha", "town"] }],
  ["area", "{name} lives ______ the mountains with her {who}.", { name: GIRL, who: ["grandparents", "family", "aunt", "uncle"] }],
  ["area", "There are a lot of {animal} ______ the field behind our house, {name}.", { animal: ["cows", "sheep", "horses", "goats"], name: NAME }],
  ["town", "My {who} lives ______ a big city, but I live in a village, {name}.", { who: ["cousin", "aunt", "brother", "friend"], name: NAME }],
  ["area", "It's very hot ______ the desert in {month}, {name}.", { month: ["July", "August", "June", "the afternoon"], name: NAME }],
  ["area", "There's a big park ______ the centre of our {town}, {name}.", { town: ["town", "city", "village", "district"], name: NAME }],
  ["world", "My {who} has a small house ______ the countryside, {name}.", { who: REL, name: NAME }],
  ["town", "Is there a good {place} ______ your town, {name}?", { place: ["café", "library", "gym", "cinema"], name: NAME }],
  ["area", "Our {pet} stays ______ the yard all day, {name}.", { pet: ["dog", "cat", "chickens", "rabbit"], name: NAME }],
  ["sky", "There are a lot of fish ______ this {water}, {name}.", { water: ["river", "lake", "pond", "sea"], name: NAME }],
  ["town", "How many people live ______ your {area}, {name}?", { area: ["village", "town", "city", "building"], name: NAME }],
  ["world", "There are many {thing} ______ the world, {name}.", { thing: ["languages", "countries", "animals", "cities"], name: NAME }],
  ["town", "My friend from {country} is ______ Uzbekistan this {when}.", { country: COUNTRY, when: ["week", "month", "summer", "spring"] }],
  ["area", "We stay ______ the mountains for a week in {month}, {name}.", { month: ["July", "August", "June", "the summer"], name: NAME }],
  ["area", "There are red flowers ______ the fields in {month}, {name}.", { month: ["April", "May", "March", "spring"], name: NAME }],
].map(([w, prompt, slots], i) => {
  const options = rot(OPT, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf("in"), why: W[w], slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write in, on or at.";
const BUILD = [
  ["town", "My aunt lives ______ {city}, {name}.", { city: CITY, name: NAME }],
  ["sky", "There are a lot of {thing} ______ the sky tonight, {name}.", { thing: ["stars", "clouds", "bright stars", "little stars"], name: NAME }],
  ["area", "Our {pet} is ______ the yard, {name}.", { pet: ["dog", "cat", "puppy", "rabbit"], name: NAME }],
  ["area", "My grandparents have a farm ______ a small village near {city}, {name}.", { city: CITY, name: NAME }],
  ["sky", "We often swim ______ the {water} near our {home}.", { water: ["lake", "river", "sea", "pond"], home: ["house", "village", "town", "dacha"] }],
  ["area", "{name}'s family lives ______ the mountains with two {pet}.", { name: NAME, pet: ["dogs", "cats", "horses", "goats"] }],
  ["area", "There are a lot of {animal} ______ the forest, {name}.", { animal: ["birds", "rabbits", "squirrels", "deer"], name: NAME }],
  ["town", "My {who} works ______ a big city, {name}.", { who: REL, name: NAME }],
  ["town", "Is there a cinema ______ your {area}, {name}?", { area: ["village", "town", "city", "district"], name: NAME }],
  ["area", "It's very cold ______ the mountains at night, {name}. Take a {thing}.", { name: NAME, thing: ["coat", "jacket", "warm hat", "sweater"] }],
  ["town", "There are {n} people ______ our village, {name}.", { n: ["about 500", "about 800", "about a thousand", "two thousand"], name: NAME }],
  ["area", "The cows are ______ the field behind the {place}, {name}.", { place: ["school", "farm", "house", "river"], name: NAME }],
  ["town", "My friend from {country} lives ______ Tashkent now, {name}.", { country: COUNTRY, name: NAME }],
  ["world", "There are many {thing} ______ the world, {name}.", { thing: ["languages", "countries", "animals", "cities"], name: NAME }],
  ["world", "My {who} has a small house ______ the countryside, {name}.", { who: REL, name: NAME }],
  ["sky", "Look! There's a {color} plane ______ the sky, {name}.", { color: ["white", "red", "big", "small"], name: NAME }],
  ["area", "There's a big park ______ the centre of our {town}, {name}.", { town: ["town", "city", "village", "district"], name: NAME }],
  ["area", "The children are playing ______ the yard with their {thing}.", { thing: ["ball", "dog", "bikes", "kite"] }],
  ["sky", "There are a lot of fish ______ this {water}, {name}.", { water: ["river", "lake", "pond", "sea"], name: NAME }],
  ["area", "It's very {adj} ______ the desert during the day, {name}.", { adj: ["hot", "dry", "sunny", "bright"], name: NAME }],
].map(([w, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "in", why: W[w], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const NOTE = "Make a sentence from the notes. Use in.";
const TRANSFORM = [
  // where? (5)
  ["Answer the question. Use in and the mountains.", "Where does your {who} live, {name}?", "He or she lives ______ mountains, {name}.", "in the", "The mountains are an area: in the mountains.", { who: REL, name: NAME }],
  ["Answer the question. Use in and the yard.", "Where is the {pet}, {name}?", "It's ______ yard, {name}.", "in the", "The yard is an area with a fence around it: in the yard.", { pet: ["dog", "cat", "puppy", "rabbit"], name: NAME }],
  ["Answer the question. Use in and the forest.", "Where do the {animal} live, {name}?", "They live ______ forest, {name}.", "in the", "The forest is an area: in the forest.", { animal: ["birds", "squirrels", "rabbits", "deer"], name: NAME }],
  ["Answer the question. Use in and the countryside.", "Where does your {who} have a house, {name}?", "He or she has a house ______ countryside, {name}.", "in the", "We say in the countryside.", { who: REL, name: NAME }],
  ["Answer the question. Use in and the sky.", "Where are the {thing}, {name}?", "They're ______ sky, {name}. Look up!", "in the", "We say in the sky, not on the sky.", { thing: ["stars", "birds", "clouds", "planes"], name: NAME }],
  // correct the mistake (5)
  [COR, "My aunt lives at {city}, {name}.", "My aunt lives ______ {city}, {name}.", "in", "For a city, use in: in Samarkand, not at Samarkand.", { city: CITY, name: NAME }],
  [COR, "There are a lot of {thing} on the sky, {name}.", "There are a lot of {thing} ______ the sky, {name}.", "in", "We say in the sky, not on the sky.", { thing: ["stars", "clouds", "birds", "planes"], name: NAME }],
  [COR, "My grandparents live at a small village, {name}.", "My grandparents live ______ a small village, {name}.", "in", "For a village, use in, not at.", { name: NAME, x: ["", "", "", ""] }],
  [COR, "The {pet} is playing on the yard, {name}.", "The {pet} is playing ______ the yard, {name}.", "in", "The yard is an area, so use in, not on.", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  [COR, "My friend from {country} works at Uzbekistan now.", "My friend from {country} works ______ Uzbekistan now.", "in", "For a country, use in, not at.", { country: COUNTRY, x: ["", "", "", ""] }],
  // notes -> sentence (5)
  [NOTE, "my uncle / live / {city}", "My uncle lives ______ {city}, {name}.", "in", "A city → in: in Bukhara.", { city: CITY, name: NAME }],
  [NOTE, "the {animal} / be / the field", "The {animal} are ______ the field, {name}.", "in", "A field is an area: in the field.", { animal: ["cows", "sheep", "horses", "goats"], name: NAME }],
  [NOTE, "we / swim / the {water} / every summer", "We swim ______ the {water} every summer, {name}.", "in", "We swim in the sea, in the river, in the lake.", { water: ["sea", "river", "lake", "pond"], name: NAME }],
  [NOTE, "there / be / a big park / the centre of our {town}", "There's a big park ______ the centre of our {town}, {name}.", "in", "We say in the centre of a town.", { town: ["town", "city", "village", "district"], name: NAME }],
  [NOTE, "my cousin / live / {country}", "My cousin lives ______ {country}, {name}.", "in", "A country → in: in Korea, in Turkey.", { country: COUNTRY, name: NAME }],
].map(([instr, source, hint, key, why, slots]) => {
  const s = { ...slots }; delete s.x;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the town or city where you live.", "I live in …", ["exactly one sentence", "in + a town or city", "a place name"]],
  ["Write one sentence about a relative who lives in another town or village.", "My … lives in …", ["exactly one sentence", "in", "a family word"]],
  ["Write one sentence about something you can see in the sky at night.", "There are … in the sky.", ["exactly one sentence", "in the sky", "a thing word"]],
  ["Write one sentence about a good place in your town.", "There's a … in our town.", ["exactly one sentence", "in our town", "a place word"]],
  ["Write one sentence about the mountains, the countryside or the sea.", "… in the mountains / in the sea", ["exactly one sentence", "in the", "a nature word"]],
  ["Write one sentence about what children do in the yard of your building or house.", "The children … in the yard.", ["exactly one sentence", "in the yard", "an action word"]],
  ["Write one sentence about a country you want to visit and why.", "I want to see … in …", ["exactly one sentence", "in + a country", "a reason"]],
  ["Write two sentences: one about your town and one about your country.", "… in … / … in Uzbekistan", ["exactly two sentences", "in twice", "two place names"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your town, city or village for a visitor: what is there?", "There's a … in …", ["in", "two place words", "three or four sentences"]],
  ["Describe where your family lives: your town, your relatives' towns and villages.", "My … lives in …", ["in", "a family word", "three or four sentences"]],
  ["Describe a summer holiday in the mountains, the countryside or by the sea.", "We stayed in … / We swam in …", ["in the", "a nature word", "three or four sentences"]],
  ["Describe the yard of your house or building: who is there and what do they do?", "The children play in the yard.", ["in the yard", "people words", "three or four sentences"]],
  ["Write to a pen friend in another country: where do you live, and where does your family live?", "I live in … My grandparents live in …", ["in", "a place name", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.place.in-area.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);