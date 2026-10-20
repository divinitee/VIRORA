// Hand-authored: nouns-articles / articles / a-jobs (A2).
//
// Tests ONE point: a/an before a job after be (She is a doctor, He is an
// engineer). Plural subjects take no article (They are doctors).
// Uzbek and Russian say "she is doctor", so the missing article is the main
// learner error.
//
// Choose options are full phrases: a/an + job (correct), no article, the
// wrong article, and a plural job after a singular subject. "the" is never
// offered: "She is the doctor" is fine in context.
// Build keys are typed a or an; instr lists both (rule 3). Rule 11: no
// zero-article typed keys, so plural subjects appear only in choose.
// The subject is a fixed singular in every build/transform sentence (rule 13).
//
// Run: node tools/grammar-practice/authored/nouns-articles.articles.a-jobs.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "articles", topic: "a-jobs", level: "A2", pv: "2.5" };
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const VOWEL = new Set(["engineer", "artist", "actor", "architect", "office worker", "English teacher", "electrician", "accountant", "honest driver", "old farmer", "excellent cook", "IT specialist"]);
const art = (j) => (VOWEL.has(j) ? "an" : "a");
const why = (j) => `Use a/an before a job after is. ${j[0].toUpperCase()}${j.slice(1)} starts with a ${art(j) === "an" ? "vowel sound, so an" : "consonant sound, so a"}: ${art(j)} ${j}.`;
const plural = (j) => (j.endsWith("man") ? j.slice(0, -3) + "men" : j + "s");

/* ---------------- choose: 20 mcq ---------------- */
// singular rows: [job, sentence, slots]; plural rows marked with P
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const SING = [
  ["doctor", "My aunt is ______. She works at a hospital in {city} on {day}.", { city: CITY, day: ["weekdays", "Mondays", "Saturdays", "most days"] }],
  ["engineer", "{name}'s father is ______ at a {place}.", { name: NAME, place: ["factory", "company", "building site", "power station"] }],
  ["teacher", "Mrs Karimova is ______ at our school in {city}. She teaches {subject}.", { city: CITY, subject: ["maths", "English", "history", "music"] }],
  ["artist", "My uncle is ______. He paints {thing} in {place}.", { thing: ["mountains", "old streets", "people", "flowers"], place: ["his studio", "the park", "his garden", "the old town"] }],
  ["nurse", "{name}'s sister is ______ at the clinic in {city}.", { name: NAME, city: CITY }],
  ["accountant", "My mother is ______ at a {place} in {city}.", { place: ["bank", "hotel", "factory", "company"], city: CITY }],
  ["driver", "Mr Rustamov is ______. He drives a {vehicle} in {city}.", { vehicle: ["bus", "taxi", "minibus", "truck"], city: CITY }],
  ["architect", "Uncle Bobur is ______. He designs {thing} in {city}.", { thing: ["houses", "schools", "hotels", "parks"], city: CITY }],
  ["cook", "My cousin is ______ at a {place} in {city}.", { place: ["café", "hotel", "school", "hospital"], city: CITY }],
  ["actor", "Timur's brother is ______. He works in {place} in {city}.", { place: ["a theatre", "a big theatre", "the city theatre", "a small theatre"], city: CITY }],
  ["farmer", "My grandfather is ______ near {city}. He grows {food}.", { city: CITY, food: ["cotton", "apples", "melons", "potatoes"] }],
  ["electrician", "Mr Ivanov is ______. He fixes lights in {place} in {city}.", { place: ["schools", "offices", "flats", "shops"], city: CITY }],
  ["pilot", "Malika's dad is ______. He flies to {city} every {time}.", { city: ["Moscow", "Istanbul", "Dubai", "Seoul"], time: ["week", "Monday", "Friday", "month"] }],
  ["office worker", "Olga is ______ in {city}. She goes to work by {transport}.", { city: CITY, transport: ["bus", "car", "taxi", "bike"] }],
  ["waiter", "My brother is ______ in a restaurant near the {place}, {name}.", { place: ["station", "park", "river", "market"], name: NAME }],
  ["police officer", "Our neighbour is ______ in {city}. He works {time}.", { city: CITY, time: ["at night", "in the day", "at weekends", "every day"] }],
];
const PL = [
  ["doctor", "My parents are both ______ at a hospital in {city}, {name}.", { city: CITY, name: NAME }],
  ["engineer", "Aziz and Timur are ______ at a {place} in {city}.", { place: ["company", "factory", "building site", "power station"], city: CITY }],
  ["teacher", "My aunts are ______ at a school in {city}. They teach {subject}.", { city: CITY, subject: ["maths", "English", "history", "music"] }],
  ["farmer", "My uncles are ______ near {city}. They grow {food}.", { city: CITY, food: ["cotton", "apples", "melons", "potatoes"] }],
];
const CHOOSE = [
  ...SING.map(([j, prompt, slots]) => ({ prompt, slots, options: [`${art(j)} ${j}`, j, `${art(j) === "a" ? "an" : "a"} ${j}`, plural(j)], why: why(j) })),
  ...PL.map(([j, prompt, slots]) => ({ prompt, slots, options: [plural(j), `${art(j)} ${plural(j)}`, `${art(j)} ${j}`, j], why: `The subject is plural (are), so use the plural job with no a/an: ${plural(j)}.` })),
].map((x) => ({ ...BASE, stage: "choose", format: "mcq", prompt: x.prompt, options: x.options, key: 0, why: x.why, slots: x.slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write a or an.";
const BUILD = [
  ["teacher", "My mother is ______ teacher at our school in {city}. She teaches {subject}.", { city: CITY, subject: ["maths", "English", "history", "music"] }],
  ["engineer", "Dilnoza is ______ engineer. She works in {city} on {project}.", { city: CITY, project: ["bridges", "roads", "new buildings", "new schools"] }],
  ["doctor", "Mr Saidov is ______ doctor. He works at the city hospital in {city} on {day}.", { city: CITY, day: ["weekdays", "Mondays", "Saturdays", "most days"] }],
  ["artist", "My sister is ______ artist. She paints {thing} in {place}.", { thing: ["flowers", "people", "animals", "streets"], place: ["her room", "the park", "a studio", "the garden"] }],
  ["nurse", "Aunt Nigora is ______ nurse in {city}. She works {time}.", { city: CITY, time: ["at night", "in the mornings", "at weekends", "in the evenings"] }],
  ["accountant", "Mr Petrov is ______ accountant at a {place} in {city}.", { place: ["bank", "factory", "hotel", "company"], city: CITY }],
  ["driver", "My uncle is ______ driver. He drives his {vehicle} in {city}.", { vehicle: ["bus", "taxi", "minibus", "truck"], city: CITY }],
  ["actor", "Bobur is ______ actor. He works in {place} in {city}.", { place: ["a theatre", "a big theatre", "the city theatre", "a small theatre"], city: CITY }],
  ["cook", "My grandmother was ______ cook at the {place} in {city}.", { place: ["school", "hospital", "café", "hotel"], city: CITY }],
  ["architect", "Malika wants to be ______ architect. She loves {thing} in {city}.", { thing: ["old buildings", "the mosques", "the bridges", "the parks"], city: CITY }],
  ["farmer", "Mr Tursunov is ______ farmer near {city}. He has {animal}.", { city: CITY, animal: ["sheep", "cows", "horses", "goats"] }],
  ["office worker", "Olga is ______ office worker. She takes the {transport} to work in {city}.", { transport: ["bus", "taxi", "train", "minibus"], city: CITY }],
  ["pilot", "Timur wants to be ______ pilot. He wants to fly to {city} and {city2}.", { city: ["Seoul", "Istanbul", "Dubai", "Moscow"], city2: ["Paris", "London", "Tokyo", "Rome"] }],
  ["electrician", "My cousin is ______ electrician. He works in {place} in {city}.", { place: ["new flats", "offices", "schools", "shops"], city: CITY }],
  ["waiter", "Aziz is ______ waiter at the café near the {place}. He works on {day}.", { place: ["park", "station", "market", "river"], day: ["Saturdays", "Sundays", "weekends", "Fridays"] }],
  ["English teacher", "My aunt is ______ English teacher at a college in {city}. Her students are {adj}.", { city: CITY, adj: ["friendly", "clever", "funny", "hard-working"] }],
  ["police officer", "Mr Ahmedov is ______ police officer. He works {time} in {city}.", { time: ["at night", "in the day", "at weekends", "every day"], city: CITY }],
  ["IT specialist", "My brother is ______ IT specialist. He fixes {thing} at a {place}.", { thing: ["computers", "phones", "laptops", "printers"], place: ["bank", "school", "company", "hospital"] }],
  ["dentist", "Dr Yusupova is ______ dentist in {city}. She is very {adj}.", { city: CITY, adj: ["kind", "friendly", "careful", "good"] }],
  ["honest driver", "Mr Rakhimov is ______ honest driver. He never drives {how} in {city}.", { how: ["fast", "badly", "too fast", "carelessly"], city: CITY }],
].map(([j, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: art(j), why: j === "honest driver" ? "In honest the h is silent, so the first sound is a vowel sound. Use an." : why(j), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_ONE = "Now talk about one person. Complete the sentence with a or an + the job.";
const T_FIX = "The sentence has a mistake. Complete the correct sentence with a or an + the job.";
const T_ADJ = "Add the word in brackets before the job. Complete the sentence with a or an + the word.";
const DAY = ["weekdays", "Mondays", "Saturdays", "most days"];
const TRANSFORM = [
  [T_ONE, "My aunts are doctors in {city}. They work on {day}.", "My aunt is ______ in {city}. She works on {day}.", "a doctor", why("doctor"), { city: CITY, day: DAY }],
  [T_ONE, "Bobur's brothers are engineers at a {place} in {city}.", "Bobur's brother is ______ at a {place} in {city}.", "an engineer", why("engineer"), { place: ["factory", "company", "building site", "power station"], city: CITY }],
  [T_ONE, "My cousins are artists. They paint {thing} in {city}.", "My cousin is ______. She paints {thing} in {city}.", "an artist", why("artist"), { thing: ["flowers", "people", "animals", "streets"], city: CITY }],
  [T_ONE, "Olga's sisters are nurses at the {place} in {city}.", "Olga's sister is ______ at the {place} in {city}.", "a nurse", why("nurse"), { place: ["hospital", "clinic", "school", "children's hospital"], city: CITY }],
  [T_ONE, "My uncles are accountants at a {place} in {city}.", "My uncle is ______ at a {place} in {city}.", "an accountant", why("accountant"), { place: ["bank", "hotel", "factory", "company"], city: CITY }],
  [T_FIX, "My father is driver. He drives his {vehicle} in {city}.", "My father is ______. He drives his {vehicle} in {city}.", "a driver", why("driver"), { vehicle: ["bus", "taxi", "minibus", "truck"], city: CITY }],
  [T_FIX, "Malika is a actor in {place} in {city}.", "Malika is ______ in {place} in {city}.", "an actor", why("actor"), { place: ["a theatre", "a big theatre", "the city theatre", "a small theatre"], city: CITY }],
  [T_FIX, "Mr Saidov is architect. He designs {thing} in {city}.", "Mr Saidov is ______. He designs {thing} in {city}.", "an architect", why("architect"), { thing: ["houses", "schools", "hotels", "parks"], city: CITY }],
  [T_FIX, "My grandmother is an cook at the {place} in {city}.", "My grandmother is ______ at the {place} in {city}.", "a cook", why("cook"), { place: ["school", "café", "hotel", "hospital"], city: CITY }],
  [T_FIX, "Timur is electrician. He works in {place} in {city}.", "Timur is ______. He works in {place} in {city}.", "an electrician", why("electrician"), { place: ["schools", "offices", "flats", "shops"], city: CITY }],
  [T_ADJ, "My uncle is a farmer near {city}. He grows {food}.", "My uncle is ______ (old) farmer near {city}. He grows {food}.", "an old", "Old starts with a vowel sound, so the article changes to an: an old farmer.", { city: CITY, food: ["cotton", "apples", "melons", "potatoes"] }],
  [T_ADJ, "Aunt Nigora is a teacher in {city}, {name}.", "Aunt Nigora is ______ (English) teacher in {city}, {name}.", "an English", "English starts with a vowel sound, so the article changes to an: an English teacher.", { city: CITY, name: NAME }],
  [T_ADJ, "My sister is an engineer at the {place} in {city}.", "My sister is ______ (good) engineer at the {place} in {city}.", "a good", "Good starts with a consonant sound, so the article changes to a: a good engineer.", { place: ["factory", "company", "building site", "bank"], city: CITY }],
  [T_ADJ, "Mr Karimov is a cook at a café in {city}, {name}.", "Mr Karimov is ______ (excellent) cook at a café in {city}, {name}.", "an excellent", "Excellent starts with a vowel sound, so the article changes to an: an excellent cook.", { city: CITY, name: NAME }],
  [T_ADJ, "Bobur is an actor in {place} in {city}.", "Bobur is ______ (young) actor in {place} in {city}.", "a young", "Young starts with a consonant sound (y), so the article changes to a: a young actor.", { place: ["a theatre", "a big theatre", "the city theatre", "a small theatre"], city: CITY }],
].map(([instr, source, hint, key, w, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the job of someone in your family.", "a/an + job", ["exactly one sentence", "must use is a or is an"]],
  ["What do you want to be? Write one sentence.", "want to be a/an", ["exactly one sentence", "must use want to be a or want to be an"]],
  ["Write one sentence about an engineer, an artist or an actor you know.", "an + job", ["exactly one sentence", "must use an"]],
  ["Write one sentence about two people with the same job.", "plural job, no article", ["exactly one sentence", "must use are", "plural job"]],
  ["Write one sentence about your teacher.", "a/an + job", ["exactly one sentence", "must use a or an"]],
  ["Write one sentence with an adjective before a job, like an old farmer.", "a/an + adjective + job", ["exactly one sentence", "must use a or an", "adjective before the job"]],
  ["Ask a friend about their mother's job. Write one question and the answer.", "a/an + job", ["exactly two sentences", "must use a or an"]],
  ["Write two sentences: one with a + job and one with an + job.", "a / an + job", ["exactly two sentences", "must use a", "must use an"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about the jobs in your family. Write three or four sentences.", "a/an with jobs", ["is a", "is an", "are + plural job"]],
  ["What do you want to be in the future? Why? Write three or four sentences.", "a/an with jobs", ["want to be a/an", "because", "a/an + job"]],
  ["Describe a person you know with an interesting job. Write three or four sentences.", "a/an with jobs", ["is a/an", "works", "an adjective before the job"]],
  ["Write about people who work at your school or college. Write three or four sentences.", "a/an with jobs", ["a/an + job", "are + plural job", "works"]],
  ["Write about the jobs of people on your street. Write three or four sentences.", "a/an with jobs", ["is a", "is an", "neighbour"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.articles.a-jobs.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.articles.a-jobs.json`);