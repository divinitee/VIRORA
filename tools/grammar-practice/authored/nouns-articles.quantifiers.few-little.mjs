// Hand-authored: nouns-articles / quantifiers / few-little (A2).
//
// Tests ONE point: a few + countable plural, a little + uncountable
// (placement foci: a few with countable plural, a little with uncountable).
// Every sentence is positive and means "some, a small number/amount", so
// few/little without "a" (= not enough) is never tested and never offered.
// Choose distractors: the other one, much in a positive sentence (L1 "mnogo"
// over-use), a bit + noun with no "of", many/several before uncountables.
// "many"/"several" are never offered before plurals (they'd be correct).
// Build/transform sentences never print "a", "few" or "little" (rule 4).
//
// Run: node tools/grammar-practice/authored/nouns-articles.quantifiers.few-little.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "quantifiers", topic: "few-little", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DAY = ["Friday", "Saturday", "Sunday", "Navruz"];
const SHOP = ["market", "bazaar", "shop", "supermarket"];
const WC = "The noun is countable and plural, so use a few.";
const WU = "The noun is uncountable, so use a little.";
const C = ["a few", "a little", "much", "a bit"];
const U = ["a little", "a few", "many", "several"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [C, WC, "We have ______ apples, so we can make a pie for {who} on {day}.", { who: ["Grandma", "the guests", "Dad", "our teacher"], day: DAY }],
  [C, WC, "I have ______ friends in {city}, {name}.", { city: CITY, name: NAME }],
  [C, WC, "There are ______ students in the {place} now, {name}.", { place: ["library", "canteen", "gym", "hall"], name: NAME }],
  [C, WC, "{name} bought ______ eggs at the {shop}.", { name: NAME, shop: SHOP }],
  [C, WC, "Wait ______ minutes, please, {name}. The {transport} is coming.", { name: NAME, transport: ["bus", "taxi", "train", "minibus"] }],
  [C, WC, "I took ______ photos of the {place} in {city}.", { place: ["old town", "market", "park", "river"], city: CITY }],
  [C, WC, "There are ______ cafés near the {place}, {name}.", { place: ["station", "park", "university", "hotel"], name: NAME }],
  [C, WC, "My {person} has ______ cousins in {city}.", { person: ["mum", "dad", "friend", "neighbour"], city: CITY }],
  [C, WC, "We need ______ chairs for the {event}, {name}.", { event: ["party", "meeting", "picnic", "lesson"], name: NAME }],
  [C, WC, "{name} knows ______ English words about {topic}.", { name: NAME, topic: ["food", "sport", "music", "school"] }],
  [U, WU, "There is ______ milk in the {place}, {name}.", { place: ["fridge", "jug", "bottle", "kitchen"], name: NAME }],
  [U, WU, "Can I have ______ sugar in my {drink}, {name}?", { drink: ["tea", "coffee", "milk", "cocoa"], name: NAME }],
  [U, WU, "{name} speaks ______ Russian with {who}.", { name: NAME, who: ["the neighbours", "our teacher", "the guests", "the doctor"] }],
  [U, WU, "I have ______ money for the {thing}, {name}.", { thing: ["ticket", "bus", "snacks", "cinema"], name: NAME }],
  [U, WU, "Put ______ salt in the {food}, {name}.", { food: ["soup", "salad", "rice", "plov"], name: NAME }],
  [U, WU, "We have ______ time before the {event}, {name}.", { event: ["lesson", "film", "match", "train"], name: NAME }],
  [U, WU, "There is ______ water in the {thing}, {name}.", { thing: ["bottle", "glass", "jug", "kettle"], name: NAME }],
  [U, WU, "{name} drinks ______ juice after {activity}.", { name: NAME, activity: ["school", "football", "the gym", "work"] }],
  [U, WU, "I need ______ help with my {thing}, {name}.", { thing: ["homework", "project", "bags", "phone"], name: NAME }],
  [U, WU, "There is ______ rice in the {place} for {meal}.", { place: ["pot", "bag", "bowl", "cupboard"], meal: ["lunch", "dinner", "breakfast", "the guests"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write a few or a little.";
const F = "a few", L = "a little";
const BUILD = [
  [F, "I bought ______ oranges at the {shop} in {city}.", { shop: SHOP, city: CITY }],
  [L, "There is ______ cheese in the {place}, {name}.", { place: ["fridge", "kitchen", "bag", "box"], name: NAME }],
  [F, "{name} has ______ books about {topic}.", { name: NAME, topic: ["animals", "football", "space", "history"] }],
  [L, "Add ______ butter to the {food}, {name}.", { food: ["pancakes", "rice", "potatoes", "porridge"], name: NAME }],
  [F, "We waited ______ minutes at the {place}, {name}.", { place: ["bus stop", "station", "airport", "door"], name: NAME }],
  [L, "My grandfather drinks ______ tea every {time}.", { time: ["morning", "evening", "afternoon", "day"] }],
  [F, "There are ______ trees in our {place} in {city}.", { place: ["yard", "street", "garden", "school"], city: CITY }],
  [L, "I have ______ homework this {time}, {name}.", { time: ["evening", "weekend", "afternoon", "week"], name: NAME }],
  [F, "{name} invited ______ friends to the {event}.", { name: NAME, event: ["party", "picnic", "match", "concert"] }],
  [L, "There is ______ snow on the {place} today, {name}.", { place: ["mountains", "roof", "road", "hills"], name: NAME }],
  [F, "My {person} knows ______ words in Korean, {name}.", { person: ["sister", "brother", "cousin", "friend"], name: NAME }],
  [L, "We need ______ flour for the {food} on {day}.", { food: ["cake", "bread", "pancakes", "samsa"], day: DAY }],
  [F, "There are ______ buses to {city} on {day}.", { city: CITY, day: ["Sundays", "Mondays", "weekdays", "Saturdays"] }],
  [L, "{name} put ______ honey in the {food}.", { name: NAME, food: ["tea", "milk", "porridge", "yoghurt"] }],
  [F, "I made ______ mistakes in my {subject} test, {name}.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [L, "There is ______ juice in the {thing} for {who}.", { thing: ["jug", "bottle", "glass", "fridge"], who: ["the kids", "Grandma", "us", "you"] }],
  [F, "Our {group} has ______ new players this {time}.", { group: ["team", "club", "football club", "school team"], time: ["year", "season", "month", "week"] }],
  [L, "Give me ______ water for the {thing}, please, {name}.", { thing: ["flowers", "plant", "dog", "cat"], name: NAME }],
  [F, "{name} sent ______ messages to {who} today.", { name: NAME, who: ["Mum", "the group", "Grandpa", "the team"] }],
  [L, "I know ______ Uzbek, {name}. My {person} taught me.", { name: NAME, person: ["friend", "neighbour", "teacher", "grandmother"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === F ? WC : WU, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_SMALL = "Say it is only a small number or amount. Write a few or a little.";
const T_NOUN = "Use the new noun. Write a few or a little.";
const T_BOTH = "Say it is only a small number or amount of each. Write a few or a little in each gap.";
const BOTH = (a, b) => `${a}; ${b}.`;
const TC = "countable plural noun → a few", TU = "uncountable noun → a little";
const TRANSFORM = [
  [T_SMALL, "There is some milk in the {place}, {name}.", "There is ______ milk in the {place}, {name}.", L, WU, { place: ["fridge", "jug", "bottle", "kitchen"], name: NAME }],
  [T_SMALL, "There are some people at the {place}, {name}.", "There are ______ people at the {place}, {name}.", F, WC, { place: ["bus stop", "station", "café", "shop"], name: NAME }],
  [T_SMALL, "We have some bread for {meal}, {name}.", "We have ______ bread for {meal}, {name}.", L, WU, { meal: ["breakfast", "lunch", "dinner", "the guests"], name: NAME }],
  [T_SMALL, "{name} has some friends in {city}.", "{name} has ______ friends in {city}.", F, WC, { name: NAME, city: CITY }],
  [T_SMALL, "There is some money in my {thing}, {name}.", "There is ______ money in my {thing}, {name}.", L, WU, { thing: ["bag", "pocket", "wallet", "jacket"], name: NAME }],
  [T_NOUN, "I have some coins in my {thing}, {name}.", "I have ______ money in my {thing}, {name}.", L, "Money is uncountable (coins are countable), so use a little.", { thing: ["bag", "pocket", "wallet", "jacket"], name: NAME }],
  [T_NOUN, "There is some bread in the {place}, {name}.", "There are ______ buns in the {place}, {name}.", F, "Buns are countable and plural (bread is not), so use a few.", { place: ["kitchen", "bag", "box", "basket"], name: NAME }],
  [T_NOUN, "{name} gave me some tips for the {event}.", "{name} gave me ______ advice for the {event}.", L, "Advice is uncountable (tips are countable), so use a little.", { name: NAME, event: ["exam", "interview", "trip", "match"] }],
  [T_NOUN, "We bought some fruit at the {shop} in {city}.", "We bought ______ apples at the {shop} in {city}.", F, "Apples are countable and plural (fruit here is not), so use a few.", { shop: SHOP, city: CITY }],
  [T_NOUN, "I have some homework for {subject}, {name}.", "I have ______ exercises for {subject}, {name}.", F, "Exercises are countable and plural (homework is not), so use a few.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [T_BOTH, "We have some eggs and some butter for the {food}, {name}.", "We have ______ eggs and ______ butter for the {food}, {name}.", [F, L], BOTH("eggs: " + TC, "butter: " + TU), { food: ["cake", "pancakes", "breakfast", "dinner"], name: NAME }],
  [T_BOTH, "I need some sugar and some lemons for the {drink}, {name}.", "I need ______ sugar and ______ lemons for the {drink}, {name}.", [L, F], BOTH("sugar: " + TU, "lemons: " + TC), { drink: ["tea", "lemonade", "juice", "drinks"], name: NAME }],
  [T_BOTH, "{name} bought some carrots and some rice at the {shop}.", "{name} bought ______ carrots and ______ rice at the {shop}.", [F, L], BOTH("carrots: " + TC, "rice: " + TU), { name: NAME, shop: SHOP }],
  [T_BOTH, "We have some time and some ideas for the {thing}, {name}.", "We have ______ time and ______ ideas for the {thing}, {name}.", [L, F], BOTH("time: " + TU, "ideas: " + TC), { thing: ["project", "party", "trip", "video"], name: NAME }],
  [T_BOTH, "There is some water and there are some glasses on the {place}, {name}.", "There is ______ water and there are ______ glasses on the {place}, {name}.", [L, F], BOTH("water: " + TU, "glasses: " + TC), { place: ["table", "tray", "shelf", "desk"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about food in your fridge. Use a little.", "a little", ["exactly one sentence", "must use a little", "uncountable noun"]],
  ["Write one sentence about your friends. Use a few.", "a few", ["exactly one sentence", "must use a few", "plural noun"]],
  ["Write one sentence with a few and a little.", "a few / a little", ["exactly one sentence", "must use a few", "must use a little"]],
  ["Write one sentence about money. Use a little.", "a little", ["exactly one sentence", "must use a little"]],
  ["Write one sentence about your town. Use a few.", "a few", ["exactly one sentence", "must use a few"]],
  ["Tell a friend to wait. Use a few minutes.", "a few minutes", ["exactly one sentence", "must use a few minutes"]],
  ["Write one sentence about a drink. Use a little sugar or a little milk.", "a little", ["exactly one sentence", "must use a little"]],
  ["Write two sentences about your bag: one with a few and one with a little.", "a few / a little", ["exactly two sentences", "must use a few", "must use a little"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are cooking dinner. What do you have? Write three or four sentences.", "a few / a little", ["a few", "a little", "We have"]],
  ["Describe your free time this week. Write three or four sentences.", "a few / a little", ["a little time", "a few", "friends"]],
  ["Describe your street or village. Write three or four sentences.", "a few / a little", ["There are a few", "There is a little", "but"]],
  ["What languages do you know, and how well? Write three or four sentences.", "a few / a little", ["a little", "a few words", "speak"]],
  ["You are packing for a trip. Write three or four sentences about your bag.", "a few / a little", ["a few", "a little", "I need"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.quantifiers.few-little.json", JSON.stringify(items, null, 1) + "\n");