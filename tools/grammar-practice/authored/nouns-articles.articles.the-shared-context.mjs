// Hand-authored: nouns-articles / articles / the-shared-context (A1).
//
// Tests ONE point: the for something both speakers know: a thing mentioned
// before ("a cake ... the cake"), the only one in this place ("close the
// door"), or a known plural/uncountable ("Where is the milk?").
// The noun after the blank is never slotted (rule 2).
//
// Choose distractors: a / an (L1 transfer: no articles in Uzbek/Russian, so
// learners guess) and no article. Every frame makes a/an impossible: a second
// mention, a plural, or an uncountable noun. All nouns start with a consonant
// sound, so "an" is always wrong.
// Build/transform keys are typed "the"; no sentence prints "the" anywhere.
//
// Run: node tools/grammar-practice/authored/nouns-articles.articles.the-shared-context.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "articles", topic: "the-shared-context", level: "A1", pv: "2.5" };
const OPTS = ["the", "a", "an", "–"];
const WHY = {
  again: (n) => `We talked about this ${n} before, so now we both know it. Use the.`,
  plural: (n) => `We both know which ${n}. Use the, also with plural nouns.`,
  unc: (n) => `We both know which ${n}. Use the, also with nouns like ${n}.`,
  one: (n) => `There is only one ${n} here, so we both know it. Use the.`,
};

/* ---------------- choose: 20 mcq ---------------- */
// [why kind, noun, sentence, slots]
const CHOOSE = [
  ["again", "cake", "I bought a cake and some juice at the {shop}. ______ cake was {taste}.",
    { shop: ["bakery", "market", "shop", "café"], taste: ["delicious", "sweet", "very good", "fresh"] }],
  ["unc", "salt", "Can you pass me ______ salt for the {food}, {name}?",
    { food: ["soup", "salad", "rice", "eggs"], name: ["Aziz", "Mum", "Olga", "Dad"] }],
  ["plural", "keys", "Where are ______ keys of our {home}? I can't find them in my {bag}.",
    { home: ["house", "flat", "car", "dacha"], bag: ["bag", "pocket", "jacket", "backpack"] }],
  ["again", "dog", "We have a dog and a cat at our {home}. ______ dog sleeps in the {place}.",
    { home: ["house", "dacha", "farm", "flat"], place: ["kitchen", "yard", "garden", "hall"] }],
  ["plural", "lights", "Please turn off ______ lights in the {room} before you go to {place}.",
    { room: ["kitchen", "bathroom", "classroom", "hall"], place: ["bed", "school", "work", "sleep"] }],
  ["again", "café", "There is a café and a bank near {place}. ______ café opens at {time}.",
    { place: ["our flat", "my school", "our college", "my office"], time: ["eight", "nine", "ten", "seven"] }],
  ["again", "bike", "My sister has a new bike. ______ bike is {colour} and very {adj}.",
    { colour: ["red", "blue", "black", "green"], adj: ["fast", "light", "nice", "cool"] }],
  ["plural", "boys", "Look at ______ boys in the {place}! They are playing {sport}.",
    { place: ["park", "yard", "street", "garden"], sport: ["football", "chess", "tennis", "volleyball"] }],
  ["again", "book", "I read a book and watched a film last night. ______ book was {opinion}.",
    { opinion: ["boring", "great", "very long", "funny"] }],
  ["unc", "milk", "Where is ______ milk, {name}? I bought it at the {shop}.",
    { name: ["Mum", "Aziz", "Kamila", "Dad"], shop: ["shop", "market", "corner shop", "supermarket"] }],
  ["again", "hotel", "We stayed at a hotel in {city}. ______ hotel had a {feature}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"], feature: ["big pool", "nice garden", "small café", "great view"] }],
  ["again", "car", "My father bought a car and a bike for his {use}. ______ car is {colour}.",
    { use: ["work", "trips", "family", "job"], colour: ["white", "black", "grey", "blue"] }],
  ["again", "test", "Our teacher gave us a test. ______ test was very {adj} for {who}.",
    { adj: ["hard", "easy", "long", "short"], who: ["me", "us", "everyone", "Aziz"] }],
  ["plural", "children", "Where are ______ children? They were in the {place} with {who}.",
    { place: ["yard", "park", "garden", "kitchen"], who: ["Grandma", "their father", "Olga", "my mother"] }],
  ["again", "woman", "I saw a man and a woman at the {place}. ______ woman was {doing}.",
    { place: ["bus stop", "door", "gate", "shop"], doing: ["singing", "laughing", "reading", "dancing"] }],
  ["again", "chair", "There is a sofa and a chair in my {room}. ______ chair is near the {thing}.",
    { room: ["room", "bedroom", "living room", "flat"], thing: ["window", "door", "lamp", "TV"] }],
  ["unc", "water", "Is ______ water in the {thing} hot or cold, {name}?",
    { thing: ["kettle", "bottle", "cup", "bath"], name: ["Aziz", "Mum", "Laylo", "Timur"] }],
  ["again", "cat", "We have a cat. ______ cat likes {food} and sleeps on the {place}.",
    { food: ["fish", "milk", "meat", "chicken"], place: ["sofa", "bed", "chair", "carpet"] }],
  ["again", "brother", "Aziz has a brother and a sister. ______ brother is {age} years old.",
    { age: ["ten", "twelve", "fifteen", "twenty"] }],
  ["again", "soup", "I made soup and a salad for {name}. ______ soup was {adj}.",
    { name: ["Grandma", "my friends", "Dad", "the guests"], adj: ["hot", "too salty", "very good", "cold"] }],
].map(([w, n, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS, key: 0, why: WHY[w](n), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write a, an or the.";
const BUILD = [
  ["again", "cake", "I bought a cake and some juice at our {shop}. ______ cake was {taste}.",
    { shop: ["bakery", "market", "shop", "café"], taste: ["delicious", "sweet", "very good", "fresh"] }],
  ["unc", "salt", "Can you pass me ______ salt for my {food}, {name}?",
    { food: ["soup", "salad", "rice", "eggs"], name: ["Aziz", "Mum", "Olga", "Dad"] }],
  ["plural", "keys", "Where are ______ keys of our {home}? I can't find them in my {bag}.",
    { home: ["house", "flat", "car", "dacha"], bag: ["bag", "pocket", "jacket", "backpack"] }],
  ["again", "dog", "We have a dog and a cat at our {home}. ______ dog sleeps in our {place}.",
    { home: ["house", "dacha", "farm", "flat"], place: ["kitchen", "yard", "garden", "hall"] }],
  ["plural", "lights", "Please turn off ______ lights in your {room} before {time}.",
    { room: ["kitchen", "bathroom", "bedroom", "office"], time: ["bed", "school", "you leave", "dinner"] }],
  ["again", "café", "There is a café and a bank near {place}. ______ café opens at {time}.",
    { place: ["our flat", "my school", "our college", "my office"], time: ["eight", "nine", "ten", "seven"] }],
  ["again", "bike", "My sister has a new bike. ______ bike is {colour} and very {adj}.",
    { colour: ["red", "blue", "black", "green"], adj: ["fast", "light", "nice", "cool"] }],
  ["plural", "boys", "Look at ______ boys in our {place}! They are playing {sport}.",
    { place: ["yard", "street", "park", "garden"], sport: ["football", "chess", "tennis", "volleyball"] }],
  ["again", "book", "I read a book and watched a film last night. ______ book was {opinion}.",
    { opinion: ["boring", "great", "very long", "funny"] }],
  ["unc", "milk", "Where is ______ milk, {name}? I bought it at {shop}.",
    { name: ["Mum", "Aziz", "Kamila", "Dad"], shop: ["our shop", "that market", "this shop", "a big shop"] }],
  ["again", "hotel", "We stayed at a hotel in {city}. ______ hotel had a {feature}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"], feature: ["big pool", "nice garden", "small café", "great view"] }],
  ["again", "car", "My father bought a car and a bike for his {use}. ______ car is {colour}.",
    { use: ["work", "trips", "family", "job"], colour: ["white", "black", "grey", "blue"] }],
  ["again", "test", "Our teacher gave us a test. ______ test was very {adj} for {who}.",
    { adj: ["hard", "easy", "long", "short"], who: ["me", "us", "everyone", "Aziz"] }],
  ["plural", "children", "Where are ______ children? They were in our {place} with {who}.",
    { place: ["yard", "park", "garden", "kitchen"], who: ["Grandma", "their father", "Olga", "my mother"] }],
  ["again", "woman", "I saw a man and a woman at our {place}. ______ woman was {doing}.",
    { place: ["bus stop", "door", "gate", "shop"], doing: ["singing", "laughing", "reading", "dancing"] }],
  ["again", "chair", "There is a sofa and a chair in my {room}. ______ chair is near my {thing}.",
    { room: ["room", "bedroom", "living room", "flat"], thing: ["window", "door", "lamp", "TV"] }],
  ["unc", "water", "Is ______ water in your {thing} hot or cold, {name}?",
    { thing: ["kettle", "bottle", "cup", "bath"], name: ["Aziz", "Mum", "Laylo", "Timur"] }],
  ["again", "cat", "We have a cat. ______ cat likes {food} and sleeps on my {place}.",
    { food: ["fish", "milk", "meat", "chicken"], place: ["sofa", "bed", "chair", "carpet"] }],
  ["again", "brother", "Aziz has a brother and a sister. ______ brother is {age} years old.",
    { age: ["ten", "twelve", "fifteen", "twenty"] }],
  ["again", "soup", "I made soup and a salad for {name}. ______ soup was {adj}.",
    { name: ["Grandma", "my friends", "Dad", "our guests"], adj: ["hot", "too salty", "very good", "cold"] }],
].map(([w, n, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "the", why: WHY[w](n), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_AGAIN = "Read the first sentence. Now we talk about the same thing again. Complete the second sentence with a, an or the.";
const T_ONE = "Read the first sentence. There is only one here. Complete the second sentence with a, an or the.";
const T_KNOWN = "Read the first sentence. Now we both know which one. Complete the second sentence with a, an or the.";
const TRANSFORM = [
  // kind 1: first mention (a) -> second mention (the)
  [T_AGAIN, "again", "dog", "There is a dog in our {place}.", "______ dog is very {adj}.",
    { place: ["yard", "garden", "street", "building"], adj: ["big", "friendly", "old", "noisy"] }],
  [T_AGAIN, "again", "shop", "My uncle has a shop in {city}.", "______ shop sells {goods}.",
    { city: ["Tashkent", "Fergana", "Andijan", "Karshi"], goods: ["bread", "clothes", "phones", "fruit"] }],
  [T_AGAIN, "again", "film", "I saw a film with {name} yesterday.", "______ film was very {adj}.",
    { name: ["Aziz", "Olga", "my sister", "Bobur"], adj: ["long", "funny", "good", "sad"] }],
  [T_AGAIN, "again", "sofa", "We bought a new sofa for our {room}.", "______ sofa is {colour}.",
    { room: ["living room", "flat", "house", "bedroom"], colour: ["grey", "blue", "brown", "green"] }],
  [T_AGAIN, "again", "letter", "Kamila got a letter from {who}.", "______ letter was {adj}.",
    { who: ["her grandmother", "her friend", "her school", "her cousin"], adj: ["very long", "short", "in English", "beautiful"] }],
  // kind 2: only one in this place
  [T_ONE, "one", "door", "There is one door in our {room}.", "Please close ______ door, {name}.",
    { room: ["classroom", "bedroom", "kitchen", "office"], name: ["Aziz", "Olga", "Timur", "Malika"] }],
  [T_ONE, "one", "TV", "There is one TV in our {home}.", "Can you turn on ______ TV, {name}?",
    { home: ["flat", "house", "hotel room", "kitchen"], name: ["Dad", "Bobur", "Grandma", "Laylo"] }],
  [T_ONE, "one", "lift", "Our {building} has one lift.", "Let's take ______ lift, {name}.",
    { building: ["building", "hotel", "office", "block"], name: ["Aziz", "Mum", "Sardor", "Anna"] }],
  [T_ONE, "one", "teacher", "There is one teacher in our {group} today.", "Ask ______ teacher, {name}.",
    { group: ["class", "group", "room", "lesson"], name: ["Kamila", "Timur", "Nodira", "Bekzod"] }],
  [T_ONE, "one", "station", "Our town near {city} has one station.", "Let's meet at ______ station at {time}.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], time: ["six", "seven", "noon", "ten"] }],
  // kind 3: known plural / uncountable
  [T_KNOWN, "unc", "bread", "Mum put some bread on our {furniture}.", "Is ______ bread fresh, {name}?",
    { furniture: ["table", "plate", "board", "tray"], name: ["Mum", "Aziz", "Grandma", "Olga"] }],
  [T_KNOWN, "plural", "apples", "I bought some apples at {shop}.", "______ apples are {adj}.",
    { shop: ["our market", "that shop", "Chorsu bazaar", "a small shop"], adj: ["sweet", "red", "very good", "big"] }],
  [T_KNOWN, "unc", "water", "There is some water in my {thing}.", "Is ______ water cold, {name}?",
    { thing: ["bottle", "cup", "glass", "bag"], name: ["Aziz", "Laylo", "Timur", "Malika"] }],
  [T_KNOWN, "plural", "students", "We met some students from {city}.", "______ students were very {adj}.",
    { city: ["Seoul", "Moscow", "Bukhara", "Almaty"], adj: ["friendly", "kind", "nice", "funny"] }],
  [T_KNOWN, "plural", "flowers", "Dad bought some flowers for {person}.", "______ flowers are on our {place} now.",
    { person: ["Mum", "Grandma", "my sister", "our teacher"], place: ["table", "balcony", "shelf", "desk"] }],
].map(([instr, w, n, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: "the", why: WHY[w](n), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write two sentences about a pet. Use a in the first sentence and the in the second.", "a ... the (second mention)", ["exactly two sentences", "first uses a", "second uses the"]],
  ["Ask someone at home to close or open something. Use the.", "the (only one here)", ["exactly one sentence", "must use the", "must use close or open"]],
  ["Ask where something in your kitchen is. Use the.", "the (shared)", ["exactly one question", "must use the", "must start with Where"]],
  ["Write two sentences about something you bought. Use a, then the.", "a ... the", ["exactly two sentences", "first uses a", "second uses the"]],
  ["Ask someone at the table to pass you something.", "the (shared)", ["exactly one question", "must use the", "must use pass"]],
  ["Write one sentence about the lights or the windows in your room.", "the + plural", ["exactly one sentence", "must use the", "must use lights or windows"]],
  ["Write two sentences about a film you saw. Use a, then the.", "a ... the", ["exactly two sentences", "first uses a", "second uses the"]],
  ["Write one sentence about the water or the milk in your fridge.", "the + uncountable", ["exactly one sentence", "must use the water or the milk"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your home: there is a..., and then say more about it with the. Write three or four sentences.", "a ... the", ["a + first mention", "the + second mention", "There is"]],
  ["Write about a trip: you stayed at a hotel and ate at a café. Write three or four sentences.", "a ... the", ["a hotel or a café", "the hotel or the café", "was"]],
  ["Write a short note to your family about things in the kitchen. Write three or four sentences.", "the (shared)", ["the + kitchen things", "please", "where"]],
  ["Write about a present you got. Write three or four sentences.", "a ... the", ["a + present", "the + present", "a colour or size"]],
  ["Write about your pets or a friend's pets. Write three or four sentences.", "a ... the", ["a + animal", "the + animal", "likes"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.articles.the-shared-context.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.articles.the-shared-context.json`);