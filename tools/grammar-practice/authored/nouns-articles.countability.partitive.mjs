// Hand-authored: nouns-articles / countability / partitive (A1).
//
// Tests ONE point: counting an uncountable noun with a container or unit +
// of: two loaves of bread, a piece of cake, three cups of tea.
// The unit takes the plural, the uncountable noun never does.
//
// Choose options: correct phrase, the wrong number on the unit (piece /
// pieces), a plural on the uncountable noun (breads, teas after of), and
// "of" left out (L1 transfer: Uzbek "ikki bo'lak non", Russian "два куска
// хлеба" have no word for of). Bare forms that native speakers do use
// ("two teas", "a water bottle", "two cakes") are never offered.
//
// Run: node tools/grammar-practice/authored/nouns-articles.countability.partitive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "countability", topic: "partitive", level: "A1", pv: "2.5" };

// unit forms: [singular, plural]
const U = { loaf: ["loaf", "loaves"], piece: ["piece", "pieces"], cup: ["cup", "cups"], glass: ["glass", "glasses"],
  bottle: ["bottle", "bottles"], kilo: ["kilo", "kilos"], bar: ["bar", "bars"] };
const PLN = { bread: "breads", cake: "cakes", paper: "papers", chocolate: "chocolates", tea: "teas", coffee: "coffees",
  water: "waters", juice: "juices", rice: "rices", sugar: "sugars", milk: "milks", soap: "soaps" };
const phrase = (u, n, many) => `${U[u][many ? 1 : 0]} of ${n}`;
const opts = (u, n, many) => [phrase(u, n, many), phrase(u, n, !many), `${U[u][many ? 1 : 0]} of ${PLN[n]}`, `${U[u][many ? 1 : 0]} ${n}`];
const why = (u, n, many) => many
  ? `You can't count ${n}, so count the ${U[u][0]}: ${phrase(u, n, true)}. Only the ${U[u][0]} gets -s/-es.`
  : `You can't count ${n}, so use a + ${U[u][0]} + of: a ${phrase(u, n, false)}.`;

const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const SHOP = ["market", "bakery", "shop", "bazaar"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];

// [unit, noun, many?, sentence with ______, slots]
const ROWS = [
  ["loaf", "bread", true, "Mum bought two ______ at the {shop} for {meal}.", { shop: SHOP, meal: ["breakfast", "dinner", "lunch", "the guests"] }],
  ["loaf", "bread", true, "Please buy three ______ at the {shop}, {name}.", { shop: SHOP, name: NAME }],
  ["loaf", "bread", true, "{name}'s uncle is a baker in {city}. He makes a hundred ______ every morning.", { name: NAME, city: CITY }],
  ["loaf", "bread", true, "We need four ______ for the {event} on {day}.", { event: ["party", "picnic", "wedding", "trip"], day: ["Monday", "Friday", "Saturday", "Sunday"] }],
  ["loaf", "bread", false, "I can get a ______ at the {shop}, {name}.", { shop: SHOP, name: NAME }],
  ["piece", "cake", false, "Can I have a ______, {name}? It looks {adj}.", { name: NAME, adj: ["delicious", "great", "so sweet", "very nice"] }],
  ["piece", "paper", false, "I need a ______ for my {subject} homework, {name}.", { subject: ["maths", "art", "English", "science"], name: NAME }],
  ["piece", "cake", true, "{name} ate two ______ at the {event}.", { name: NAME, event: ["party", "wedding", "birthday", "picnic"] }],
  ["piece", "paper", true, "Give the {group} three ______ for the {subject} test.", { group: ["class", "students", "children", "team"], subject: ["maths", "English", "history", "science"] }],
  ["piece", "chocolate", false, "Would you like a ______ with your {drink}, {name}?", { drink: ["tea", "coffee", "milk", "juice"], name: NAME }],
  ["piece", "bread", true, "There are only two ______ left on the {place}, {name}.", { place: ["plate", "table", "board", "tray"], name: NAME }],
  ["cup", "tea", true, "{name} drinks three ______ every {time}.", { name: NAME, time: ["day", "morning", "evening", "afternoon"] }],
  ["cup", "coffee", false, "Can I have a ______ with my {food}, please?", { food: ["cake", "breakfast", "samsa", "dessert"] }],
  ["glass", "water", true, "Drink two ______ before the {activity}, {name}.", { activity: ["game", "run", "lesson", "walk"], name: NAME }],
  ["bottle", "juice", true, "We took four ______ on the trip to {city} with {who}.", { city: CITY, who: ["Grandma", "our cousins", "Dad", "the kids"] }],
  ["kilo", "rice", true, "Mum bought two ______ at the {shop} for {food}.", { shop: SHOP, food: ["plov", "dinner", "the party", "the week"] }],
  ["kilo", "sugar", false, "Can I have a ______, please? It's for {food}, {name}.", { food: ["a cake", "jam", "the party", "tea"], name: NAME }],
  ["bar", "chocolate", true, "{name} bought three ______ for {who}.", { name: NAME, who: ["the kids", "our cousins", "the trip", "the class"] }],
  ["bar", "soap", false, "There is a ______ in the {place}, {name}.", { place: ["bathroom", "bag", "cupboard", "box"], name: NAME }],
  ["loaf", "bread", true, "{name}, how many ______ do we need for {meal}?", { name: NAME, meal: ["dinner", "the party", "breakfast", "the week"] }],
];

const CHOOSE = ROWS.map(([u, n, m, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(u, n, m), key: 0, why: why(u, n, m), slots }));
const BUILD = ROWS.map(([u, n, m, s, slots]) => ({ ...BASE, stage: "build", format: "gap_fill",
  instr: "Use the two words in brackets with of. Put the first word in the right form.",
  source: s.replace("______", `______ (${u} / ${n})`), key: phrase(u, n, m), why: why(u, n, m), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_COUNT = "Read the first sentence. Now count it. Complete the second sentence with the word in brackets + of + the noun.";
const T_FIX = "The first sentence has a mistake. Complete the correct sentence with the word in brackets + of + the noun.";
const T_MANY = "Read the first sentence. Now there are more. Complete the second sentence.";
const TRANSFORM = [
  // kind 1: some X -> counted X
  [T_COUNT, "loaf", "bread", true, "I want some bread for {meal}, {name}.", "I want two ______ (loaf) for {meal}, {name}.", { meal: ["dinner", "breakfast", "the party", "lunch"], name: NAME }],
  [T_COUNT, "piece", "paper", true, "I need some paper for {subject}, {name}.", "I need two ______ (piece) for {subject}, {name}.", { subject: ["art", "maths", "English", "science"], name: NAME }],
  [T_COUNT, "cup", "tea", true, "Grandma wants some tea after {meal}, {name}.", "Grandma wants two ______ (cup) after {meal}, {name}.", { meal: ["dinner", "lunch", "breakfast", "plov"], name: NAME }],
  [T_COUNT, "glass", "water", false, "{name} wants some water after the {activity}.", "{name} wants a ______ (glass) after the {activity}.", { name: NAME, activity: ["game", "run", "lesson", "walk"] }],
  [T_COUNT, "kilo", "rice", true, "We need some rice for {food}, {name}.", "We need three ______ (kilo) for {food}, {name}.", { food: ["plov", "the party", "the week", "dinner"], name: NAME }],
  // kind 2: fix the mistake
  [T_FIX, "loaf", "bread", true, "Mum bought three breads at the {shop}, {name}.", "Mum bought three ______ (loaf) at the {shop}, {name}.", { shop: SHOP, name: NAME }],
  [T_FIX, "glass", "milk", true, "{name} drank two milks at {place}.", "{name} drank two ______ (glass) at {place}.", { name: NAME, place: ["breakfast", "school", "Grandma's house", "the café"] }],
  [T_FIX, "kilo", "rice", true, "Dad bought two rices at the {shop}, {name}.", "Dad bought two ______ (kilo) at the {shop}, {name}.", { shop: SHOP, name: NAME }],
  [T_FIX, "loaf", "bread", false, "Can you buy a bread at the {shop}, {name}?", "Can you buy a ______ (loaf) at the {shop}, {name}?", { shop: SHOP, name: NAME }],
  [T_FIX, "piece", "cake", false, "I want a cake piece with my {drink}, {name}.", "I want a ______ (piece) with my {drink}, {name}.", { drink: ["tea", "coffee", "milk", "juice"], name: NAME }],
  // kind 3: a unit of X -> more units of X
  [T_MANY, "piece", "chocolate", true, "I had a piece of chocolate at {place}, {name}.", "{name} had three ______ at {place}.", { place: ["school", "the party", "Grandma's house", "the café"], name: NAME }],
  [T_MANY, "loaf", "bread", true, "There is one loaf of bread in the {place}.", "Now there are four ______ in the {place}, {name}.", { place: ["kitchen", "bag", "basket", "cupboard"], name: NAME }],
  [T_MANY, "cup", "tea", true, "{name} drank a cup of tea with {who}.", "{who} drank two ______.", { name: NAME, who: ["Grandma", "Dad", "our teacher", "my uncle"] }],
  [T_MANY, "bottle", "water", true, "We need a bottle of water for the {event}.", "We need six ______ for the {event}, {name}.", { event: ["trip", "game", "picnic", "walk"], name: NAME }],
  [T_MANY, "kilo", "rice", true, "Dad bought a kilo of rice at the {shop}.", "Mum bought three ______ at the {shop}, {name}.", { shop: SHOP, name: NAME }],
].map(([instr, u, n, m, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: phrase(u, n, m), why: why(u, n, m), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about bread you buy. Use loaves of bread.", "loaves of bread", ["exactly one sentence", "must use loaves of bread"]],
  ["Ask for some cake at a party. Use a piece of.", "a piece of", ["exactly one question", "must use a piece of"]],
  ["Write one sentence about what you drink every day. Use cups of or glasses of.", "cups of / glasses of", ["exactly one sentence", "must use cups of or glasses of", "must use a number"]],
  ["Write one sentence about paper for school. Use pieces of paper.", "pieces of paper", ["exactly one sentence", "must use pieces of paper"]],
  ["Write a shopping sentence with kilos of.", "kilos of", ["exactly one sentence", "must use kilos of"]],
  ["Write one sentence about chocolate. Use a bar of or a piece of.", "a bar of / a piece of", ["exactly one sentence", "must use a bar of or a piece of"]],
  ["Write one sentence with a bottle of.", "a bottle of", ["exactly one sentence", "must use a bottle of"]],
  ["Write two sentences: one with a piece of and one with two pieces of.", "a piece of / pieces of", ["exactly two sentences", "must use a piece of", "must use pieces of"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write a shopping list for a family dinner and one sentence about it.", "partitives", ["loaves of bread", "kilos of", "a number"]],
  ["Describe breakfast at your home. Write three or four sentences.", "partitives", ["a cup of or a glass of", "a piece of or a loaf of", "every morning"]],
  ["Write a short dialogue (three or four lines) in a café.", "partitives", ["a cup of", "a piece of", "please"]],
  ["You are planning a picnic. Write three or four sentences about the food and drinks.", "partitives", ["bottles of", "loaves of or pieces of", "need"]],
  ["Write about a birthday party. Write three or four sentences.", "partitives", ["pieces of cake", "glasses of or cups of", "a number"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.countability.partitive.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.countability.partitive.json`);