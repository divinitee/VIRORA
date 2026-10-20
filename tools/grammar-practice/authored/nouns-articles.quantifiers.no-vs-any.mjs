// Hand-authored: nouns-articles / quantifiers / no-vs-any (A2).
//
// Tests ONE point: no with a positive verb (There is no...), any with a
// negative verb (There isn't any...). Placement focus: "no with an
// affirmative verb vs any with a negative".
// Choose distractors: positive verb → any / not / none (Russian "нет сахара"
// gives "There is not sugar"); negative verb → no (double negative, Russian
// "нет никакого") / none / and a for plurals or many for uncountables
// ("a" is only offered before plurals, where it can never be right).
// Build/transform never print "no" or "any" (rule 4).
// Transform kinds: not…any → no (5), no → not…any (5), two gaps (5).
//
// Run: node tools/grammar-practice/authored/nouns-articles.quantifiers.no-vs-any.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "quantifiers", topic: "no-vs-any", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const WA = "The verb is positive, so use no (no = not any).";
const WN = "The verb is already negative (not), so use any. Two negatives are wrong.";
const A = ["no", "any", "not", "none"];
const N1 = ["any", "no", "none", "a"];
const N2 = ["any", "no", "none", "many"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [A, WA, "There is ______ sugar in my {drink}, {name}.", { drink: ["tea", "coffee", "milk", "cocoa"], name: NAME }],
  [A, WA, "We have ______ bread for {meal}, {name}.", { meal: ["breakfast", "lunch", "dinner", "the guests"], name: NAME }],
  [A, WA, "There are ______ buses to {city} on {day}.", { city: CITY, day: ["Sundays", "Mondays", "Navruz", "holidays"] }],
  [A, WA, "{name} has ______ homework this {time}.", { name: NAME, time: ["evening", "weekend", "week", "afternoon"] }],
  [A, WA, "There are ______ chairs in the {place}, {name}.", { place: ["kitchen", "classroom", "garden", "hall"], name: NAME }],
  [A, WA, "I have ______ money for the {thing}, {name}.", { thing: ["ticket", "trip", "taxi", "snacks"], name: NAME }],
  [A, WA, "There is ______ milk in the {place}, {name}.", { place: ["fridge", "jug", "bottle", "kitchen"], name: NAME }],
  [A, WA, "My {person} has ______ brothers or sisters.", { person: ["friend", "cousin", "teacher", "neighbour"] }],
  [A, WA, "There are ______ taxis at the {place} now, {name}.", { place: ["station", "airport", "bus stop", "corner"], name: NAME }],
  [A, WA, "We had ______ lessons on {day}, {name}.", { day: ["Navruz", "Sunday", "Saturday", "holidays"], name: NAME }],
  [N2, WN, "There isn't ______ milk in the {thing}, {name}.", { thing: ["jug", "bottle", "fridge", "glass"], name: NAME }],
  [N1, WN, "I don't have ______ cousins in {city}, {name}.", { city: CITY, name: NAME }],
  [N2, WN, "{name} didn't buy ______ bread at the {shop}.", { name: NAME, shop: ["market", "bakery", "shop", "bazaar"] }],
  [N1, WN, "There aren't ______ shops near our {home}, {name}.", { home: ["house", "flat", "school", "college"], name: NAME }],
  [N1, WN, "We don't have ______ tests on {day}, {name}.", { day: ["Friday", "Monday", "Saturday", "Tuesday"], name: NAME }],
  [N2, WN, "My {person} doesn't drink ______ coffee in the {time}.", { person: ["dad", "mum", "grandma", "uncle"], time: ["evening", "afternoon", "morning", "summer"] }],
  [N2, WN, "There wasn't ______ rain in {city} this {time}.", { city: CITY, time: ["week", "month", "summer", "spring"] }],
  [N1, WN, "We didn't see ______ animals in the {place}, {name}.", { place: ["park", "forest", "mountains", "desert"], name: NAME }],
  [N1, WN, "I can't find ______ eggs in the {place}, {name}.", { place: ["fridge", "kitchen", "shop", "basket"], name: NAME }],
  [N2, WN, "{name} doesn't have ______ free time on {day}.", { name: NAME, day: ["Monday", "Tuesday", "Wednesday", "Thursday"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write no or any.";
const BUILD = [
  ["no", "There is ______ cheese in the {place}, {name}.", { place: ["fridge", "kitchen", "bag", "box"], name: NAME }],
  ["any", "We don't have ______ eggs for the {food}, {name}.", { food: ["cake", "pancakes", "breakfast", "salad"], name: NAME }],
  ["no", "{name} has ______ brothers in {city}.", { name: NAME, city: CITY }],
  ["any", "There aren't ______ trains to {city} on {day}.", { city: CITY, day: ["Sundays", "Mondays", "weekdays", "Saturdays"] }],
  ["no", "We have ______ time for {meal} today, {name}.", { meal: ["breakfast", "lunch", "dinner", "tea"], name: NAME }],
  ["any", "I didn't get ______ messages from {who} today, {name}.", { who: ["Mum", "Dad", "the teacher", "my friends"], name: NAME }],
  ["no", "There are ______ clouds over {city} today, {name}.", { city: CITY, name: NAME }],
  ["any", "{name} doesn't eat ______ meat on {day}.", { name: NAME, day: ["Mondays", "Wednesdays", "Fridays", "weekdays"] }],
  ["no", "There is ______ water in the {thing}, {name}.", { thing: ["bottle", "glass", "jug", "kettle"], name: NAME }],
  ["any", "My {person} doesn't have ______ pets.", { person: ["friend", "cousin", "teacher", "neighbour"] }],
  ["no", "We had ______ homework on {day}, {name}.", { day: ["Navruz", "Saturday", "Sunday", "Friday"], name: NAME }],
  ["any", "There isn't ______ bread in the {place}, {name}.", { place: ["kitchen", "bag", "box", "cupboard"], name: NAME }],
  ["no", "{name} has ______ money for the {thing}.", { name: NAME, thing: ["ticket", "trip", "bike", "phone"] }],
  ["any", "We can't see ______ stars over {city} tonight, {name}.", { city: CITY, name: NAME }],
  ["no", "There are ______ cafés near the {place}, {name}.", { place: ["station", "park", "university", "hotel"], name: NAME }],
  ["any", "I don't know ______ people at the {place}, {name}.", { place: ["club", "gym", "college", "office"], name: NAME }],
  ["no", "My {person} drinks tea with ______ sugar in the {time}.", { person: ["dad", "mum", "grandma", "uncle"], time: ["morning", "evening", "afternoon", "summer"] }],
  ["any", "{name} didn't take ______ photos at the {event}.", { name: NAME, event: ["party", "wedding", "match", "concert"] }],
  ["no", "There were ______ people at the {place} on {day}.", { place: ["park", "market", "museum", "cinema"], day: ["Monday", "Tuesday", "Wednesday", "Thursday"] }],
  ["any", "We haven't got ______ milk for the {food}, {name}.", { food: ["tea", "coffee", "porridge", "cake"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "no" ? WA : WN, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_NO = "Rewrite with a positive verb and no.";
const T_ANY = "Rewrite with not and any.";
const T_TWO = "Rewrite with not and any. Write one word in each gap.";
const W2 = "Make the verb negative (not), then use any after it.";
const TRANSFORM = [
  [T_NO, "There isn't any milk in the {place}, {name}.", "There is ______ milk in the {place}, {name}.", "no", WA, { place: ["fridge", "jug", "bottle", "kitchen"], name: NAME }],
  [T_NO, "We don't have any bread for {meal}, {name}.", "We have ______ bread for {meal}, {name}.", "no", WA, { meal: ["breakfast", "lunch", "dinner", "the guests"], name: NAME }],
  [T_NO, "{name} doesn't have any brothers in {city}.", "{name} has ______ brothers in {city}.", "no", WA, { name: NAME, city: CITY }],
  [T_NO, "There aren't any buses to {city} on {day}.", "There are ______ buses to {city} on {day}.", "no", WA, { city: CITY, day: ["Sundays", "Mondays", "weekdays", "Saturdays"] }],
  [T_NO, "I don't have any money for the {thing}, {name}.", "I have ______ money for the {thing}, {name}.", "no", WA, { thing: ["ticket", "trip", "taxi", "snacks"], name: NAME }],
  [T_ANY, "There is no juice in the {thing}, {name}.", "There isn't ______ juice in the {thing}, {name}.", "any", WN, { thing: ["jug", "bottle", "fridge", "glass"], name: NAME }],
  [T_ANY, "We have no eggs for the {food}, {name}.", "We don't have ______ eggs for the {food}, {name}.", "any", WN, { food: ["cake", "pancakes", "breakfast", "salad"], name: NAME }],
  [T_ANY, "{name} has no homework this {time}.", "{name} doesn't have ______ homework this {time}.", "any", WN, { name: NAME, time: ["evening", "weekend", "week", "afternoon"] }],
  [T_ANY, "There are no shops near our {home}, {name}.", "There aren't ______ shops near our {home}, {name}.", "any", WN, { home: ["house", "flat", "school", "college"], name: NAME }],
  [T_ANY, "My {person} has no free time on {day}.", "My {person} doesn't have ______ free time on {day}.", "any", WN, { person: ["dad", "mum", "sister", "uncle"], day: ["Monday", "Tuesday", "Wednesday", "Thursday"] }],
  [T_TWO, "There are no taxis at the {place}, {name}.", "There ______ ______ taxis at the {place}, {name}.", ["aren't", "any"], W2, { place: ["station", "airport", "bus stop", "corner"], name: NAME }],
  [T_TWO, "There is no cheese in the {place}, {name}.", "There ______ ______ cheese in the {place}, {name}.", ["isn't", "any"], W2, { place: ["fridge", "kitchen", "bag", "box"], name: NAME }],
  [T_TWO, "We have no lessons on {day}, {name}.", "We ______ have ______ lessons on {day}, {name}.", ["don't", "any"], W2, { day: ["Sunday", "Saturday", "Navruz", "Friday"], name: NAME }],
  [T_TWO, "{name} has no cousins in {city}.", "{name} ______ have ______ cousins in {city}.", ["doesn't", "any"], W2, { name: NAME, city: CITY }],
  [T_TWO, "There was no rain in {city} this {time}.", "There ______ ______ rain in {city} this {time}.", ["wasn't", "any"], W2, { city: CITY, time: ["week", "month", "summer", "spring"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about your fridge. Use There is no.", "There is no", ["exactly one sentence", "must use no", "positive verb"]],
  ["Write one sentence about your town. Use There aren't any.", "There aren't any", ["exactly one sentence", "must use any", "must use not"]],
  ["Write the same idea twice: once with no and once with not any.", "no / not any", ["exactly two sentences", "must use no", "must use any"]],
  ["Write one sentence about your free time. Use have no.", "have no / has no", ["exactly one sentence", "must use no"]],
  ["Write one sentence about your homework. Use don't have any.", "don't have any", ["exactly one sentence", "must use any"]],
  ["Write one sentence about the weather. Use There was no.", "There was no", ["exactly one sentence", "must use no"]],
  ["Write one sentence about your bag. Use any.", "any", ["exactly one sentence", "must use any", "must use not"]],
  ["Write one sentence about your street. Use no.", "no", ["exactly one sentence", "must use no"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe an empty fridge. Write three or four sentences.", "no / not any", ["There is no", "There aren't any", "We have no"]],
  ["Describe a quiet day in your town. Write three or four sentences.", "no / not any", ["There were no", "didn't see any", "people"]],
  ["Your friend wants to visit your village. What isn't there? Write three or four sentences.", "no / not any", ["no", "any", "but"]],
  ["Describe a free day: no school and no work. Write three or four sentences.", "no / not any", ["I have no", "don't have any", "time"]],
  ["Write a short message to a friend: you can't come to the party. Explain why.", "no / not any", ["no", "any", "money / time"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.quantifiers.no-vs-any.json", JSON.stringify(items, null, 1) + "\n");