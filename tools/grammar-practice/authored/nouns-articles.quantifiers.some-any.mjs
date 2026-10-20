// Hand-authored: nouns-articles / quantifiers / some-any (A1).
//
// Tests ONE point: any in negatives and questions, some in positive
// sentences (placement foci: any in a question, any in a negative, any then
// some in one sentence).
//
// Questions are always "Is there / Are there ... ?" about whether something
// exists, never offers or requests, so "some" is not a second correct answer
// (offers are the next topic, some-offer). Choose distractors for questions
// are a / an / the, which are all wrong before a plural or uncountable noun
// in an existence question. Negative distractors: some, a, no (double
// negative, Russian "нет никаких").
// Build/transform keys are typed some or any; instr lists both (rule 3).
//
// Run: node tools/grammar-practice/authored/nouns-articles.quantifiers.some-any.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "quantifiers", topic: "some-any", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const WQ = "This is a question, so use any.";
const WN = "The sentence is negative (not), so use any.";
const WP = "The sentence is positive, so use some.";
const Q = ["any", "a", "an", "the"];
const N = ["any", "some", "a", "no"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [Q, WQ, "Are there ______ buses to {city} in the {time}, {name}?", { city: CITY, time: ["morning", "evening", "afternoon", "night"], name: NAME }],
  [Q, WQ, "Is there ______ milk in the {place}, {name}?", { place: ["fridge", "kitchen", "jug", "bottle"], name: NAME }],
  [Q, WQ, "Are there ______ shops near your {home}, {name}?", { home: ["house", "flat", "school", "college"], name: NAME }],
  [Q, WQ, "Is there ______ bread on the {place}, {name}?", { place: ["table", "plate", "shelf", "tray"], name: NAME }],
  [Q, WQ, "Are there ______ students from {city} in your {group}?", { city: CITY, group: ["class", "group", "team", "school"] }],
  [Q, WQ, "Is there ______ water in your {thing}, {name}?", { thing: ["bottle", "bag", "glass", "cup"], name: NAME }],
  [Q, WQ, "Are there ______ parks in {city}, {name}?", { city: ["Termez", "Nukus", "Urgench", "Jizzakh"], name: NAME }],
  [Q, WQ, "Is there ______ juice in the {place} for {who}?", { place: ["fridge", "kitchen", "jug", "bag"], who: ["the kids", "the guests", "us", "Grandma"] }],
  [N, WN, "I don't have ______ money for the {transport}, {name}.", { transport: ["bus", "taxi", "metro", "minibus"], name: NAME }],
  [N, WN, "There aren't ______ apples in the {place}, {name}.", { place: ["bag", "box", "fridge", "basket"], name: NAME }],
  [N, WN, "{name} doesn't have ______ homework on {day}.", { name: NAME, day: ["Friday", "Saturday", "Sunday", "holidays"] }],
  [N, WN, "We don't have ______ eggs for the {food}.", { food: ["cake", "salad", "pancakes", "breakfast"] }],
  [N, WN, "There isn't ______ sugar in my {drink}, {name}.", { drink: ["tea", "coffee", "cup", "glass"], name: NAME }],
  [N, WN, "My {person} doesn't have ______ brothers in {city}.", { person: ["friend", "cousin", "teacher", "neighbour"], city: CITY }],
  [N, WN, "There aren't ______ chairs in the {place}, {name}.", { place: ["kitchen", "classroom", "garden", "hall"], name: NAME }],
  [N, WN, "I didn't buy ______ fruit at the {shop} on {day}.", { shop: ["market", "bazaar", "shop", "supermarket"], day: ["Monday", "Tuesday", "Wednesday", "Thursday"] }],
  [N, WN, "There isn't ______ rice in the {place}, {name}.", { place: ["pot", "bag", "cupboard", "kitchen"], name: NAME }],
  [N, WN, "{name} didn't take ______ photos in {city}.", { name: NAME, city: CITY }],
  [N, WN, "We don't have ______ lessons on {day}, {name}.", { day: ["Sunday", "Saturday", "Navruz", "holidays"], name: NAME }],
  [N, WN, "There aren't ______ taxis at the {place} now.", { place: ["station", "airport", "bus stop", "corner"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write some or any.";
const BUILD = [
  ["some", "There are ______ books on {name}'s {place}.", { name: NAME, place: ["desk", "bed", "table", "shelf"] }],
  ["any", "We haven't got ______ bread for {meal}, {name}.", { meal: ["breakfast", "dinner", "lunch", "the guests"], name: NAME }],
  ["some", "I bought ______ grapes at the {shop} in {city}.", { shop: ["market", "bazaar", "shop", "supermarket"], city: CITY }],
  ["any", "{name} doesn't drink ______ coffee in the {time}.", { name: NAME, time: ["evening", "afternoon", "morning", "summer"] }],
  ["some", "There is ______ cheese in the {place}, {name}.", { place: ["fridge", "kitchen", "bag", "box"], name: NAME }],
  ["any", "There aren't ______ trains to {city} on {day}.", { city: CITY, day: ["Sunday", "Monday", "Navruz", "Tuesday"] }],
  ["some", "My mum made ______ soup for {who}, {name}.", { who: ["us", "Grandpa", "the guests", "the kids"], name: NAME }],
  ["any", "I don't know ______ people in {city}, {name}.", { city: CITY, name: NAME }],
  ["some", "{name} has ______ friends in {city}.", { name: NAME, city: CITY }],
  ["any", "There isn't ______ milk for the {food}, {name}.", { food: ["tea", "cake", "pancakes", "porridge"], name: NAME }],
  ["some", "We need ______ potatoes for the {food} on {day}.", { food: ["plov", "soup", "salad", "dinner"], day: ["Friday", "Saturday", "Sunday", "Navruz"] }],
  ["any", "{name} didn't eat ______ sweets at the {event}.", { name: NAME, event: ["party", "wedding", "birthday", "picnic"] }],
  ["some", "There are ______ cats in our {place} in {city}.", { place: ["yard", "street", "garden", "building"], city: CITY }],
  ["any", "My brother doesn't have ______ money for the {thing}, {name}.", { thing: ["ticket", "trip", "bike", "phone"], name: NAME }],
  ["some", "I want to buy ______ flowers for {who}.", { who: ["my mum", "my teacher", "Grandma", "my aunt"] }],
  ["any", "We didn't see ______ animals at the {place} in {city}.", { place: ["lake", "park", "river", "mountains"], city: CITY }],
  ["some", "{name} put ______ water in the {thing}.", { name: NAME, thing: ["bottle", "glass", "jug", "cup"] }],
  ["any", "There aren't ______ shops in {name}'s {place}.", { name: NAME, place: ["village", "street", "town", "building"] }],
  ["some", "There is ______ juice on the {place}, {name}.", { place: ["table", "tray", "shelf", "floor"], name: NAME }],
  ["any", "I don't have ______ lessons this {time}, {name}.", { time: ["afternoon", "evening", "week", "weekend"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "some" ? WP : WN, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_NEG = "Make the sentence negative. Write some or any.";
const T_Q = "Make a question. Write some or any.";
const T_BOTH = "Complete the sentence. Write some or any in each gap.";
const BOTH = "The first part is negative, so any. The second part is positive, so some.";
const TRANSFORM = [
  [T_NEG, "There is some cake in the {place}, {name}.", "There isn't ______ cake in the {place}, {name}.", "any", WN, { place: ["fridge", "kitchen", "box", "bag"], name: NAME }],
  [T_NEG, "We have some tickets for the {event}, {name}.", "We don't have ______ tickets for the {event}, {name}.", "any", WN, { event: ["concert", "match", "film", "show"], name: NAME }],
  [T_NEG, "{name} has some photos of {city}.", "{name} doesn't have ______ photos of {city}.", "any", WN, { name: NAME, city: CITY }],
  [T_NEG, "There are some birds in the {place} today, {name}.", "There aren't ______ birds in the {place} today, {name}.", "any", WN, { place: ["garden", "park", "yard", "tree"], name: NAME }],
  [T_NEG, "I bought some bread at the {shop}, {name}.", "I didn't buy ______ bread at the {shop}, {name}.", "any", WN, { shop: ["market", "bakery", "shop", "bazaar"], name: NAME }],
  [T_Q, "There are some buses to {city}, {name}.", "Are there ______ buses to {city}, {name}?", "any", WQ, { city: CITY, name: NAME }],
  [T_Q, "There is some sugar in the {place}, {name}.", "Is there ______ sugar in the {place}, {name}?", "any", WQ, { place: ["kitchen", "cupboard", "box", "jar"], name: NAME }],
  [T_Q, "There are some cafés near the {place}, {name}.", "Are there ______ cafés near the {place}, {name}?", "any", WQ, { place: ["station", "park", "university", "hotel"], name: NAME }],
  [T_Q, "There is some soup in the {place}, {name}.", "Is there ______ soup in the {place}, {name}?", "any", WQ, { place: ["pot", "kitchen", "fridge", "bowl"], name: NAME }],
  [T_Q, "There are some good schools in {city}, {name}.", "Are there ______ good schools in {city}, {name}?", "any", WQ, { city: CITY, name: NAME }],
  [T_BOTH, "We have no milk. We have juice for {meal}, {name}.", "We don't have ______ milk, but we have ______ juice for {meal}, {name}.", ["any", "some"], BOTH, { meal: ["breakfast", "lunch", "dinner", "the guests"], name: NAME }],
  [T_BOTH, "There are no apples. There are oranges in the {place}, {name}.", "There aren't ______ apples, but there are ______ oranges in the {place}, {name}.", ["any", "some"], BOTH, { place: ["bag", "box", "fridge", "basket"], name: NAME }],
  [T_BOTH, "{name} has no brothers. She has sisters in {city}.", "{name} doesn't have ______ brothers, but she has ______ sisters in {city}.", ["any", "some"], BOTH, { name: ["Olga", "Malika", "Dilnoza", "Nigora"], city: CITY }],
  [T_BOTH, "I didn't buy rice. I bought carrots at the {shop}, {name}.", "I didn't buy ______ rice, but I bought ______ carrots at the {shop}, {name}.", ["any", "some"], BOTH, { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  [T_BOTH, "There are no trains to {city}. There are buses on {day}.", "There aren't ______ trains to {city}, but there are ______ buses on {day}.", ["any", "some"], BOTH, { city: CITY, day: ["Sundays", "Mondays", "weekdays", "Saturdays"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about food in your kitchen. Use some.", "some", ["exactly one sentence", "must use some", "positive sentence"]],
  ["Write one negative sentence about your town. Use any.", "any", ["exactly one sentence", "must use any", "must use not"]],
  ["Ask a friend about shops near their home. Use any.", "any", ["exactly one question", "must use any"]],
  ["Write one sentence with any and some.", "any / some", ["exactly one sentence", "must use any", "must use some"]],
  ["Write one negative sentence about your homework. Use any.", "any", ["exactly one sentence", "must use any"]],
  ["Ask a question about the fridge. Use Is there any.", "Is there any", ["exactly one question", "must use Is there any"]],
  ["Write one sentence about your friends. Use some.", "some", ["exactly one sentence", "must use some"]],
  ["Write two sentences about your bag: one with some and one with any.", "some / any", ["exactly two sentences", "must use some", "must use any"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your kitchen today. What is there and what isn't there? Write three or four sentences.", "some / any", ["some", "any", "There is / There are"]],
  ["Describe your town or village. Write three or four sentences.", "some / any", ["some", "There aren't any", "Are there any"]],
  ["You are going shopping. Write three or four sentences about what you have and what you need.", "some / any", ["some", "don't have any", "need"]],
  ["Write three or four questions for a new friend from another city. Use any.", "some / any", ["Are there any", "Is there any", "Do you have any"]],
  ["Describe your school or college. Write three or four sentences.", "some / any", ["some", "any", "but"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.quantifiers.some-any.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.quantifiers.some-any.json`);