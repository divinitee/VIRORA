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
const SING = [
  ["doctor", "My aunt is ______. She works at a hospital in {city}.", { city: CITY }],
  ["engineer", "{name}'s father is ______ at a {place} in {city}.", { name: ["Aziz", "Olga", "Timur", "Malika"], place: ["factory", "company", "building site", "power station"], city: CITY }],
  ["teacher", "Mrs Karimova is ______ at our school in {city}.", { city: CITY }],
  ["artist", "My uncle is ______. He paints {thing}.", { thing: ["mountains", "old streets", "people", "flowers"] }],
  ["nurse", "{name}'s sister is ______ at the clinic.", { name: ["Aziz", "Olga", "Timur", "Malika"] }],
  ["accountant", "My mother is ______ at a bank in {city}.", { city: CITY }],
  ["driver", "Mr Rustamov is ______. He drives a {vehicle}.", { vehicle: ["bus", "taxi", "minibus", "truck"] }],
  ["architect", "Uncle Bobur is ______. He designs {thing} in {city}.", { thing: ["houses", "schools", "hotels", "parks"], city: CITY }],
  ["cook", "My cousin is ______ at a café in {city}.", { city: CITY }],
  ["actor", "Timur's brother is ______ in a theatre in {city}.", { city: CITY }],
  ["farmer", "My grandfather is ______. He grows {food}.", { food: ["cotton", "apples", "melons", "potatoes"] }],
  ["electrician", "Mr Ivanov is ______. He fixes lights in {place}.", { place: ["schools", "offices", "flats", "shops"] }],
  ["pilot", "Malika's dad is ______. He flies to {city} every {time}.", { city: ["Moscow", "Istanbul", "Dubai", "Seoul"], time: ["week", "Monday", "Friday", "month"] }],
  ["office worker", "Olga is ______ in {city}. She works from nine to five.", { city: CITY }],
  ["waiter", "My brother is ______ in a restaurant near the {place}.", { place: ["station", "park", "river", "market"] }],
  ["police officer", "Our neighbour is ______ in {city}.", { city: CITY }],
];
const PL = [
  ["doctor", "My parents are both ______ in {city}.", { city: CITY }],
  ["engineer", "Aziz and Timur are ______ at a company in {city}.", { city: CITY }],
  ["teacher", "My aunts are ______ at a school in {city}.", { city: CITY }],
  ["farmer", "My uncles are ______ in a village near {city}.", { city: CITY }],
];
const CHOOSE = [
  ...SING.map(([j, prompt, slots]) => ({ prompt, slots, options: [`${art(j)} ${j}`, j, `${art(j) === "a" ? "an" : "a"} ${j}`, plural(j)], why: why(j) })),
  ...PL.map(([j, prompt, slots]) => ({ prompt, slots, options: [plural(j), `${art(j)} ${plural(j)}`, `${art(j)} ${j}`, j], why: `The subject is plural (are), so use the plural job with no a/an: ${plural(j)}.` })),
].map((x) => ({ ...BASE, stage: "choose", format: "mcq", prompt: x.prompt, options: x.options, key: 0, why: x.why, slots: x.slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write a or an.";
const BUILD = [
  ["teacher", "My mother is ______ teacher at a school in {city}. She teaches {subject}.", { city: CITY, subject: ["maths", "English", "history", "music"] }],
  ["engineer", "Dilnoza is ______ engineer. She works in {city} on {project}.", { city: CITY, project: ["bridges", "roads", "new buildings", "the metro"] }],
  ["doctor", "Mr Saidov is ______ doctor. He works at a hospital in {city} on {day}.", { city: CITY, day: ["weekdays", "Mondays", "Saturdays", "most days"] }],
  ["artist", "My sister is ______ artist. She paints {thing} in {place}.", { thing: ["flowers", "people", "animals", "streets"], place: ["her room", "the park", "a studio", "the garden"] }],
  ["nurse", "Aunt Nigora is ______ nurse in {city}. She works {time}.", { city: CITY, time: ["at night", "in the mornings", "at weekends", "in the evenings"] }],
  ["accountant", "Mr Petrov is ______ accountant at a {place} in {city}.", { place: ["bank", "factory", "hotel", "company"], city: CITY }],
  ["driver", "My uncle is ______ driver. He drives a {vehicle} in {city}.", { vehicle: ["bus", "taxi", "minibus", "truck"], city: CITY }],
  ["actor", "Bobur is ______ actor. He works in {place} in {city}.", { place: ["a theatre", "films", "TV shows", "a big theatre"], city: CITY }],
  ["cook", "My grandmother was ______ cook at a {place} in {city}.", { place: ["school", "hospital", "café", "hotel"], city: CITY }],
  ["architect", "Malika wants to be ______ architect. She loves {thing} in {city}.", { thing: ["old buildings", "the mosques", "the bridges", "the parks"], city: CITY }],
  ["farmer", "Mr Tursunov is ______ farmer near {city}. He has {animal}.", { city: CITY, animal: ["sheep", "cows", "horses", "goats"] }],
  ["office worker", "Olga is ______ office worker. She takes the {transport} to work in {city}.", { transport: ["bus", "metro", "train", "minibus"], city: CITY }],
  ["pilot", "Timur wants to be ______ pilot. He wants to fly to {city} and {city2}.", { city: ["Seoul", "Istanbul", "Dubai", "Moscow"], city2: ["Paris", "London", "Tokyo", "Rome"] }],
  ["electrician", "My cousin is ______ electrician. He works in {place} in {city}.", { place: ["new flats", "offices", "schools", "shops"], city: CITY }],
  ["waiter", "Aziz is ______ waiter at a café near the {place}. He works on {day}.", { place: ["park", "station", "market", "river"], day: ["Saturdays", "Sundays", "weekends", "Fridays"] }],
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
const TRANSFORM = [
  [T_ONE, "My aunts are doctors in {city}.", "My aunt is ______ in {city}.", "a doctor", why("doctor"), { city: CITY }],
  [T_ONE, "Bobur's brothers are engineers at a {place}.", "Bobur's brother is ______ at a {place}.", "an engineer", why("engineer"), { place: ["factory", "company", "building site", "power station"] }],
  [T_ONE, "My cousins are artists in {city}.", "My cousin is ______ in {city}.", "an artist", why("artist"), { city: CITY }],
  [T_ONE, "Olga's sisters are nurses at the {place}.", "Olga's sister is ______ at the {place}.", "a nurse", why("nurse"), { place: ["hospital", "clinic", "school", "children's hospital"] }],
  [T_ONE, "My uncles are accountants in {city}.", "My uncle is ______ in {city}.", "an accountant", why("accountant"), { city: CITY }],
  [T_FIX, "My father is driver in {city}.", "My father is ______ in {city}.", "a driver", why("driver"), { city: CITY }],
  [T_FIX, "Malika is a actor in a theatre in {city}.", "Malika is ______ in a theatre in {city}.", "an actor", why("actor"), { city: CITY }],
  [T_FIX, "Mr Saidov is architect. He works in {city}.", "Mr Saidov is ______. He works in {city}.", "an architect", why("architect"), { city: CITY }],
  [T_FIX, "My grandmother is an cook at a {place}.", "My grandmother is ______ at a {place}.", "a cook", why("cook"), { place: ["school", "café", "hotel", "hospital"] }],
  [T_FIX, "Timur is electrician in {city}.", "Timur is ______ in {city}.", "an electrician", why("electrician"), { city: CITY }],
  [T_ADJ, "My uncle is a farmer near {city}.", "My uncle is ______ farmer near {city}. (old)", "an old", "Old starts with a vowel sound, so the article changes to an: an old farmer.", { city: CITY }],
  [T_ADJ, "Aunt Nigora is a teacher in {city}.", "Aunt Nigora is ______ teacher in {city}. (English)", "an English", "English starts with a vowel sound, so the article changes to an: an English teacher.", { city: CITY }],
  [T_ADJ, "My sister is an engineer at a {place}.", "My sister is ______ engineer at a {place}. (good)", "a good", "Good starts with a consonant sound, so the article changes to a: a good engineer.", { place: ["factory", "company", "building site", "bank"] }],
  [T_ADJ, "Mr Karimov is a cook at a café in {city}.", "Mr Karimov is ______ cook at a café in {city}. (excellent)", "an excellent", "Excellent starts with a vowel sound, so the article changes to an: an excellent cook.", { city: CITY }],
  [T_ADJ, "Bobur is an actor in {city}.", "Bobur is ______ actor in {city}. (young)", "a young", "Young starts with a consonant sound (y), so the article changes to a: a young actor.", { city: CITY }],
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