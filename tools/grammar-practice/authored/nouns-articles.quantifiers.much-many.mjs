// Hand-authored: nouns-articles / quantifiers / much-many (A2).
//
// Tests ONE point: many + plural countable, much + uncountable (placement
// foci). All sentences are negatives or questions, where much/many are the
// natural choice, so "much" never sounds stiff and there's no second answer.
// Choose distractors: the other word, a little / a few (wrong noun type),
// and "a lot" with no "of" (a real learner error, never correct here).
// Build/transform never print "much" or "many" (rule 4).
// Transform kinds: change the noun (5), make a How much/How many question
// (5), two gaps in one negative (5).
//
// Run: node tools/grammar-practice/authored/nouns-articles.quantifiers.much-many.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "quantifiers", topic: "much-many", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const SUBJ = ["maths", "English", "history", "science"];
const WC = "The noun is countable and plural, so use many.";
const WU = "The noun is uncountable, so use much.";
const C = ["many", "much", "a little", "a lot"];
const U = ["much", "many", "a few", "a lot"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [C, WC, "There aren't ______ eggs in the {place}, {name}.", { place: ["fridge", "box", "bag", "basket"], name: NAME }],
  [C, WC, "Are there ______ shops near your {home}, {name}?", { home: ["house", "flat", "school", "college"], name: NAME }],
  [C, WC, "{name} doesn't have ______ friends in {city}.", { name: NAME, city: CITY }],
  [C, WC, "We didn't take ______ photos at the {event}, {name}.", { event: ["wedding", "party", "match", "concert"], name: NAME }],
  [C, WC, "Are there ______ students from {city} at your {place}?", { city: CITY, place: ["college", "school", "university", "club"] }],
  [C, WC, "I don't know ______ people in {city}, {name}.", { city: CITY, name: NAME }],
  [C, WC, "There weren't ______ cars on the {place} this {time}.", { place: ["road", "street", "bridge", "main road"], time: ["morning", "evening", "afternoon", "week"] }],
  [C, WC, "Did you buy ______ apples at the {shop}, {name}?", { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  [C, WC, "My {person} doesn't read ______ books in the {time}.", { person: ["brother", "sister", "dad", "cousin"], time: ["summer", "winter", "evening", "holidays"] }],
  [C, WC, "Do you have ______ lessons on {day}, {name}?", { day: ["Monday", "Tuesday", "Friday", "Saturday"], name: NAME }],
  [U, WU, "I don't have ______ money with me, {name}. Can you pay for the {thing}?", { name: NAME, thing: ["tickets", "taxi", "bus", "snacks"] }],
  [U, WU, "Is there ______ milk in the {place}, {name}?", { place: ["fridge", "jug", "bottle", "kitchen"], name: NAME }],
  [U, WU, "{name} doesn't drink ______ coffee in the {time}.", { name: NAME, time: ["evening", "afternoon", "morning", "summer"] }],
  [U, WU, "We don't have ______ time before the {event}, {name}.", { event: ["lesson", "film", "match", "train"], name: NAME }],
  [U, WU, "Did you get ______ homework in {subject} today, {name}?", { subject: SUBJ, name: NAME }],
  [U, WU, "There isn't ______ water in the {thing}, {name}.", { thing: ["bottle", "glass", "jug", "kettle"], name: NAME }],
  [U, WU, "My {person} doesn't eat ______ bread for {meal}.", { person: ["grandma", "dad", "brother", "aunt"], meal: ["breakfast", "lunch", "dinner", "supper"] }],
  [U, WU, "Is there ______ traffic in {city} in the {time}?", { city: CITY, time: ["morning", "evening", "afternoon", "summer"] }],
  [U, WU, "We didn't have ______ snow in {city} this {time}.", { city: CITY, time: ["winter", "year", "month", "week"] }],
  [U, WU, "Do you need ______ help with the {thing}, {name}?", { thing: ["bags", "homework", "boxes", "project"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write much or many.";
const BUILD = [
  ["many", "There aren't ______ trees in our {place}, {name}.", { place: ["yard", "street", "garden", "village"], name: NAME }],
  ["much", "{name} doesn't eat ______ sugar in the {time}.", { name: NAME, time: ["morning", "evening", "summer", "winter"] }],
  ["many", "How ______ cousins do you have in {city}, {name}?", { city: CITY, name: NAME }],
  ["much", "How ______ money do you need for the {thing}, {name}?", { thing: ["ticket", "trip", "bike", "phone"], name: NAME }],
  ["many", "Did {name} buy ______ presents for the {event}?", { name: NAME, event: ["party", "wedding", "birthday", "holiday"] }],
  ["much", "There isn't ______ juice in the {thing}, {name}.", { thing: ["jug", "bottle", "fridge", "glass"], name: NAME }],
  ["many", "We don't have ______ tests in {subject} this {time}.", { subject: SUBJ, time: ["term", "month", "week", "year"] }],
  ["much", "I didn't get ______ sleep before the {event}, {name}.", { event: ["exam", "trip", "match", "interview"], name: NAME }],
  ["many", "Are there ______ taxis at the {place} at night, {name}?", { place: ["station", "airport", "bus stop", "hotel"], name: NAME }],
  ["much", "How ______ rice do we need for the {food}, {name}?", { food: ["plov", "soup", "dinner", "guests"], name: NAME }],
  ["many", "{name} doesn't have ______ photos of {city}.", { name: NAME, city: CITY }],
  ["much", "Is there ______ cheese in the {place}, {name}?", { place: ["fridge", "kitchen", "bag", "box"], name: NAME }],
  ["many", "How ______ players are there in your {group}, {name}?", { group: ["team", "club", "football team", "basketball team"], name: NAME }],
  ["much", "My {person} doesn't watch ______ TV in the {time}.", { person: ["dad", "mum", "grandpa", "brother"], time: ["morning", "evening", "afternoon", "summer"] }],
  ["many", "There weren't ______ people at the {place} on {day}.", { place: ["park", "market", "cinema", "museum"], day: ["Monday", "Tuesday", "Wednesday", "Thursday"] }],
  ["much", "We don't have ______ homework on {day}, {name}.", { day: ["Friday", "Saturday", "Sunday", "weekdays"], name: NAME }],
  ["many", "Do you know ______ songs in {lang}, {name}?", { lang: ["Uzbek", "Russian", "English", "Korean"], name: NAME }],
  ["much", "How ______ water do you drink every {time}, {name}?", { time: ["day", "morning", "evening", "week"], name: NAME }],
  ["many", "I didn't see ______ birds in the {place} this {time}.", { place: ["park", "garden", "forest", "mountains"], time: ["morning", "winter", "spring", "week"] }],
  ["much", "There wasn't ______ traffic in {city} this {time}.", { city: CITY, time: ["morning", "evening", "week", "weekend"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "many" ? WC : WU, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_NOUN = "Use the new noun. Write much or many.";
const T_Q = "Make a question with How. Write much or many.";
const T_BOTH = "Make the sentence negative. Write much or many in each gap.";
const TRANSFORM = [
  [T_NOUN, "I don't have many coins in my {thing}, {name}.", "I don't have ______ money in my {thing}, {name}.", "much", "Money is uncountable (coins are countable), so use much.", { thing: ["bag", "pocket", "wallet", "jacket"], name: NAME }],
  [T_NOUN, "There isn't much bread in the {place}, {name}.", "There aren't ______ buns in the {place}, {name}.", "many", "Buns are countable and plural (bread is not), so use many.", { place: ["kitchen", "bag", "box", "basket"], name: NAME }],
  [T_NOUN, "{name} doesn't have much homework in {subject}.", "{name} doesn't have ______ exercises in {subject}.", "many", "Exercises are countable and plural (homework is not), so use many.", { name: NAME, subject: SUBJ }],
  [T_NOUN, "We didn't buy many apples at the {shop}, {name}.", "We didn't buy ______ fruit at the {shop}, {name}.", "much", "Fruit here is uncountable (apples are countable), so use much.", { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  [T_NOUN, "There aren't many cars in {city} in the {time}.", "There isn't ______ traffic in {city} in the {time}.", "much", "Traffic is uncountable (cars are countable), so use much.", { city: CITY, time: ["morning", "evening", "afternoon", "summer"] }],
  [T_Q, "{name} has three brothers in {city}.", "How ______ brothers does {name} have in {city}?", "many", "Brothers are countable and plural, so How many.", { name: NAME, city: CITY }],
  [T_Q, "The ticket to {city} costs fifty thousand som, {name}.", "How ______ does the ticket to {city} cost, {name}?", "much", "We ask about money (uncountable), so How much.", { city: CITY, name: NAME }],
  [T_Q, "We need two kilos of rice for the {food}, {name}.", "How ______ rice do we need for the {food}, {name}?", "much", "Rice is uncountable, so How much.", { food: ["plov", "soup", "dinner", "guests"], name: NAME }],
  [T_Q, "There are twenty students in the {group}, {name}.", "How ______ students are there in the {group}, {name}?", "many", "Students are countable and plural, so How many.", { group: ["class", "group", "club", "team"], name: NAME }],
  [T_Q, "I drink two glasses of water every {time}, {name}.", "How ______ water do you drink every {time}, {name}?", "much", "Water is uncountable, so How much.", { time: ["day", "morning", "evening", "afternoon"], name: NAME }],
  [T_BOTH, "We have a lot of eggs and a lot of milk for the {food}, {name}.", "We don't have ______ eggs or ______ milk for the {food}, {name}.", ["many", "much"], "Eggs are countable plural → many; milk is uncountable → much.", { food: ["cake", "pancakes", "breakfast", "dinner"], name: NAME }],
  [T_BOTH, "{name} has a lot of time and a lot of friends in {city}.", "{name} doesn't have ______ time or ______ friends in {city}.", ["much", "many"], "Time is uncountable → much; friends are countable plural → many.", { name: NAME, city: CITY }],
  [T_BOTH, "Our {place} has a lot of shops and a lot of traffic, {name}.", "Our {place} doesn't have ______ shops or ______ traffic, {name}.", ["many", "much"], "Shops are countable plural → many; traffic is uncountable → much.", { place: ["town", "street", "village", "area"], name: NAME }],
  [T_BOTH, "I have a lot of homework and a lot of tests this {time}, {name}.", "I don't have ______ homework or ______ tests this {time}, {name}.", ["much", "many"], "Homework is uncountable → much; tests are countable plural → many.", { time: ["week", "month", "term", "year"], name: NAME }],
  [T_BOTH, "My {person} drinks a lot of tea and eats a lot of sweets in the {time}.", "My {person} doesn't drink ______ tea or eat ______ sweets in the {time}.", ["much", "many"], "Tea is uncountable → much; sweets are countable plural → many.", { person: ["grandma", "grandpa", "dad", "uncle"], time: ["evening", "morning", "afternoon", "summer"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one negative sentence about your town. Use many.", "many", ["exactly one sentence", "must use many", "must use not"]],
  ["Write one negative sentence about your free time. Use much.", "much", ["exactly one sentence", "must use much", "must use not"]],
  ["Ask a friend about their family. Use How many.", "How many", ["exactly one question", "must use How many"]],
  ["Ask the price of something in a shop. Use How much.", "How much", ["exactly one question", "must use How much"]],
  ["Write one sentence with much and many.", "much / many", ["exactly one sentence", "must use much", "must use many"]],
  ["Ask a question about food in the fridge. Use Is there much.", "Is there much", ["exactly one question", "must use much"]],
  ["Ask a question about your friend's city. Use Are there many.", "Are there many", ["exactly one question", "must use many"]],
  ["Write two sentences about your homework: one with much and one with many.", "much / many", ["exactly two sentences", "must use much", "must use many"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write four questions for a new classmate. Use How much and How many.", "much / many", ["How many", "How much", "Do you have"]],
  ["Describe a quiet village. What doesn't it have? Write three or four sentences.", "much / many", ["There aren't many", "There isn't much", "but"]],
  ["You are at the market. Write a short dialogue with the seller.", "much / many", ["How much", "How many", "kilos"]],
  ["Describe a busy week. Write three or four sentences.", "much / many", ["much time", "many", "don't have"]],
  ["Describe your kitchen today. What is missing? Write three or four sentences.", "much / many", ["isn't much", "aren't many", "need"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.quantifiers.much-many.json", JSON.stringify(items, null, 1) + "\n");