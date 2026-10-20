// Hand-authored: nouns-articles / plurals-agreement / y-ies-plural (A1).
//
// Tests ONE point: consonant + y → -ies (city → cities, baby → babies).
// Every noun has a consonant before the y; vowel + y nouns (boys, days)
// are left out so the rule is never contradicted inside the topic.
// A number, "many", "some" or "are" forces the plural.
//
// Choose options: correct -ies, plain -ys (the most common error), the
// singular (L1 transfer: Uzbek keeps the singular after numbers) and -yes.
//
// Run: node tools/grammar-practice/authored/nouns-articles.plurals-agreement.y-ies-plural.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "plurals-agreement", topic: "y-ies-plural", level: "A1", pv: "2.5" };
const PL = (n) => n.slice(0, -1) + "ies";
const OPTS = (n) => [PL(n), n + "s", n, n + "es"];
const why = (n) => `${n} ends in a consonant + y, so change y to i and add -es: ${n} → ${PL(n)}.`;

const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const COUNTRY = ["Turkey", "Italy", "Spain", "China"];

// [noun, sentence with ______, slots]; build adds "(noun)" after the blank
const ROWS = [
  ["city", "{name} has visited three ______ in {country}.", { name: NAME, country: COUNTRY }],
  ["city", "{name} wants to see all the big ______ in {country}.", { name: NAME, country: COUNTRY }],
  ["baby", "There are two new ______ in our {building}, {name}!", { building: ["building", "street", "block", "family"], name: NAME }],
  ["baby", "My {person} in {city} has twin ______.", { person: ["aunt", "cousin", "sister", "neighbour"], city: CITY }],
  ["family", "Five ______ live in our {building} on {street}.", { building: ["building", "block", "house", "yard"], street: ["Navoi Street", "our street", "Bobur Street", "the main road"] }],
  ["family", "Many ______ go to the {place} on {day}.", { place: ["park", "lake", "mountains", "zoo"], day: ["Sunday", "Saturday", "Friday", "Navruz"] }],
  ["country", "{name} has been to four ______ with {who}.", { name: NAME, who: ["friends", "family", "a tour group", "school"] }],
  ["country", "How many ______ are there in {region}, {name}?", { region: ["Europe", "Asia", "Africa", "South America"], name: NAME }],
  ["party", "We have two birthday ______ this {time}, {name}.", { time: ["week", "month", "summer", "spring"], name: NAME }],
  ["party", "There are many ______ in {city} in {month}.", { city: CITY, month: ["March", "June", "July", "December"] }],
  ["story", "Grandma tells {who} ______ about {topic} every night.", { who: ["us", "me", "the kids", "my brother"], topic: ["animals", "old times", "her village", "kings"] }],
  ["story", "I read three ______ in {lang} last {time}.", { lang: ["English", "Russian", "Uzbek", "French"], time: ["week", "night", "month", "Sunday"] }],
  ["cherry", "{name}'s mum bought a kilo of ______ at the {shop}.", { name: NAME, shop: ["market", "shop", "bazaar", "supermarket"] }],
  ["cherry", "There are many ______ on the tree in {name}'s {place}.", { name: NAME, place: ["garden", "yard", "dacha", "village"] }],
  ["library", "There are two ______ near the {place} in {city}.", { place: ["park", "station", "university", "market"], city: CITY }],
  ["library", "{name} studies in different ______ in {city}.", { name: NAME, city: CITY }],
  ["dictionary", "We need two English ______ for the {group}, {name}.", { group: ["class", "lesson", "library", "team"], name: NAME }],
  ["hobby", "{name} has two ______: music and {hobby}.", { name: NAME, hobby: ["chess", "football", "cooking", "drawing"] }],
  ["lady", "Three old ______ are sitting in the {place} with {who}.", { place: ["park", "yard", "garden", "square"], who: ["their cats", "their friends", "my grandmother", "a dog"] }],
  ["diary", "My sister has written two ______ about her {topic} in {lang}.", { topic: ["life", "trips", "school", "family"], lang: ["English", "Russian", "Uzbek", "French"] }],
];

const CHOOSE = ROWS.map(([n, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS(n), key: 0, why: why(n), slots }));
const BUILD = ROWS.map(([n, s, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: "Write the plural of the word in brackets.",
  source: s.replace("______", `______ (${n})`), key: PL(n), why: why(n), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_MANY = "Read the first sentence. Now there are more. Complete the second sentence with the plural noun.";
const T_FIX = "The first sentence has a mistake. Complete the correct sentence.";
const T_SOME = "Read the question. Complete the answer with the plural noun.";
const WHERE = ["our town", "our village", "Chirchiq", "Gulistan"];
const TRANSFORM = [
  // kind 1: one -> many
  [T_MANY, "city", "{name} visited one city in {country}.", "Next year {name} wants to visit five ______ in {country}.", { name: NAME, country: COUNTRY }],
  [T_MANY, "baby", "There is one baby in our {building}, {name}.", "Now there are three ______ in our {building}, {name}.", { building: ["building", "block", "street", "yard"], name: NAME }],
  [T_MANY, "party", "We have one party in {month} with {who}.", "We have two ______ in {month} with {who}.", { month: ["May", "June", "July", "March"], who: ["friends", "family", "cousins", "classmates"] }],
  [T_MANY, "library", "There is one library in {where} near {place}.", "There are three ______ in {where} near {place}.", { where: WHERE, place: ["the school", "the park", "the market", "the station"] }],
  [T_MANY, "story", "{name} wrote one story about {topic}.", "{name}'s brother wrote four ______ about {topic}.", { name: NAME, topic: ["animals", "space", "football", "school"] }],
  // kind 2: fix the mistake
  [T_FIX, "family", "Ten familys live on {street} in {city}.", "Ten ______ live on {street} in {city}.", { street: ["Navoi Street", "our street", "Bobur Street", "the main road"], city: CITY }],
  [T_FIX, "country", "{name} has visited six countrys with {who}.", "{name} has visited six ______ with {who}.", { name: NAME, who: ["friends", "family", "a tour group", "school"] }],
  [T_FIX, "cherry", "I ate many cherrys at {name}'s {place}.", "I ate many ______ at {name}'s {place}.", { name: NAME, place: ["dacha", "house", "garden", "party"] }],
  [T_FIX, "dictionary", "We have two dictionarys in our {room}, {name}.", "We have two ______ in our {room}, {name}.", { room: ["classroom", "library", "office", "room"], name: NAME }],
  [T_FIX, "lady", "Two ladys are waiting at the {place} in {city}.", "Two ______ are waiting at the {place} in {city}.", { place: ["bus stop", "station", "door", "bank"], city: CITY }],
  // kind 3: a ... -> some ...
  [T_SOME, "strawberry", "Can I have a strawberry from the {place}, {name}?", "Yes, take some ______.", { place: ["fridge", "bowl", "box", "table"], name: NAME }],
  [T_SOME, "cherry", "Is there a cherry on your {food}, {name}?", "Yes, there are some ______ on it.", { food: ["cake", "ice cream", "plate", "dessert"], name: NAME }],
  [T_SOME, "story", "Do you know a story about {topic}, {name}?", "Yes, I know some ______ about {topic}.", { topic: ["animals", "old Bukhara", "kings", "space"], name: NAME }],
  [T_SOME, "baby", "Is there a baby in the {place}, {name}?", "Yes, there are some ______ there.", { place: ["park", "room", "clinic", "hall"], name: NAME }],
  [T_SOME, "city", "Do you know a big city in {country}, {name}?", "Yes, I know some big ______ there.", { country: COUNTRY, name: NAME }],
].map(([instr, n, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: PL(n), why: why(n), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about cities you want to visit.", "cities", ["exactly one sentence", "must use cities"]],
  ["Write one sentence about the families in your street or building.", "families", ["exactly one sentence", "must use families"]],
  ["Write one sentence about your hobbies.", "hobbies", ["exactly one sentence", "must use hobbies"]],
  ["Write one sentence about countries you know.", "countries", ["exactly one sentence", "must use countries", "must use a number"]],
  ["Write one sentence about stories you like.", "stories", ["exactly one sentence", "must use stories"]],
  ["Write one sentence about parties in your family.", "parties", ["exactly one sentence", "must use parties"]],
  ["Write one sentence about fruit. Use cherries or strawberries.", "cherries / strawberries", ["exactly one sentence", "must use cherries or strawberries"]],
  ["Write two sentences: one with babies and one with libraries.", "babies / libraries", ["exactly two sentences", "must use babies", "must use libraries"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about a trip you want to take. Write three or four sentences.", "-ies plurals", ["cities", "countries", "a number"]],
  ["Describe your free time. Write three or four sentences.", "-ies plurals", ["hobbies", "stories or parties", "like"]],
  ["Describe your town. Write three or four sentences.", "-ies plurals", ["libraries", "families", "There are"]],
  ["Write about a summer day at a dacha. Write three or four sentences.", "-ies plurals", ["cherries or strawberries", "families or babies", "a number"]],
  ["Write about your family's celebrations. Write three or four sentences.", "-ies plurals", ["parties", "families", "stories"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.plurals-agreement.y-ies-plural.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.plurals-agreement.y-ies-plural.json`);