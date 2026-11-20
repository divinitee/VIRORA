// Hand-authored: sentence-structure / conjunctions / although-despite (B1).
// Wave C, C11 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement foci: although + clause for concession; despite + noun / -ing,
// never + clause ("Despite it was raining" is the error, and "despite of"
// is the Russian "несмотря на" calque).
// Choose: 10 although keys (a full clause follows), 10 despite keys (6 noun,
// 4 -ing). Options are chosen so no distractor can also be right:
//   clause items:  although / despite / in spite / however
//   noun items:    despite / although / despite of / however
//   -ing items:    despite / despite of / however / because
// ("Although feeling tired …" is a grammatical reduced clause, so although is
// never offered before -ing; "because" is never offered before a clause, where
// it could make sense.)
// Build: "Write although or despite"; although also accepts though / even
// though, despite also accepts in spite of.
// Transform: 5 although → despite + noun / -ing / 5 despite → although +
// clause / 5 correct the mistake.
//
// Run: node tools/grammar-practice/authored/sentence-structure.conjunctions.although-despite.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "conjunctions", topic: "although-despite", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAMEF = ["Olga", "Lola", "Madina", "Kamila"];
const NAMEM = ["Aziz", "Timur", "Bekzod", "Rustam"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const SPORT = ["football", "tennis", "volleyball", "basketball"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const WA = "A full clause follows (subject + verb), so use although. Despite can't go before a clause.";
const WD = "A noun follows, not a clause, so use despite (no of).";
const WI = "An -ing form follows, so use despite (no of).";
const OPT = {
  a: ["although", "despite", "in spite", "however"],
  d: ["despite", "although", "despite of", "however"],
  i: ["despite", "despite of", "however", "because"],
};
const ACC = { although: ["though", "even though"], despite: ["in spite of"] };

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["a", "______ it was raining, we played {sport} in the park, {name}.", { sport: SPORT, name: NAME }],
  ["a", "______ {name} was tired, she finished her {work}.", { name: NAMEF, work: ["homework", "essay", "project", "report"] }],
  ["a", "We enjoyed the trip ______ the hotel was very {adj}, {name}.", { adj: ["small", "old", "noisy", "basic"], name: NAME }],
  ["a", "______ he studied hard, {name} failed the {test}.", { name: NAMEM, test: ["exam", "test", "driving test", "quiz"] }],
  ["a", "______ the tickets were expensive, we bought {n} of them.", { n: ["two", "three", "four", "five"] }],
  ["a", "I still feel hungry ______ I ate a big {meal}, {name}.", { meal: ["lunch", "breakfast", "plate of plov", "dinner"], name: NAME }],
  ["a", "______ she lives near the {place}, {name} is often late.", { place: ["school", "office", "college", "lyceum"], name: NAMEF }],
  ["a", "______ my grandmother is {age}, she still works in the garden every {time}.", { age: ["eighty", "ninety", "seventy-five", "eighty-five"], time: ["day", "morning", "week", "summer"] }],
  ["a", "The {thing} still works ______ it is very old, {name}.", { thing: ["car", "radio", "fridge", "phone"], name: NAME }],
  ["a", "______ we left home early, we missed the {vehicle}, {name}.", { vehicle: ["bus", "train", "plane", "start of the film"], name: NAME }],
  ["d", "______ the rain, we played {sport} outside, {name}.", { sport: SPORT, name: NAME }],
  ["d", "We went to the {place} ______ the cold weather, {name}.", { place: ["park", "mountains", "lake", "zoo"], name: NAME }],
  ["d", "______ his illness, {name} came to the {event}.", { name: NAMEM, event: ["party", "wedding", "meeting", "match"] }],
  ["d", "My aunt got the job ______ her age, {name}. She is {age}.", { name: NAME, age: ["sixty", "fifty-eight", "sixty-two", "sixty-five"] }],
  ["d", "______ the traffic, we arrived at the {place} on time, {name}.", { place: ["airport", "station", "wedding", "theatre"], name: NAME }],
  ["d", "The match went on ______ the {weather}, {name}.", { weather: ["heavy rain", "snow", "strong wind", "storm"], name: NAME }],
  ["i", "______ feeling ill, {name} went to {work}.", { name: NAMEF, work: ["school", "work", "class", "college"] }],
  ["i", "______ having little money, they enjoyed their trip to {city}.", { city: CITY }],
  ["i", "She passed the {test} ______ missing many lessons, {name}.", { test: ["exam", "test", "course", "final test"], name: NAME }],
  ["i", "______ living in {city} for years, my uncle still gets lost in the old town, {name}.", { city: CITY, name: NAME }],
].map(([k, prompt, slots], i) => {
  const base = prompt.startsWith("______") ? OPT[k].map(cap) : OPT[k];
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: k === "a" ? WA : k === "d" ? WD : WI, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write although or despite.";
const BUILD = [
  ["a", "______ it was {time}, the children didn't want to sleep, {name}.", { time: ["late", "midnight", "very late", "after ten"], name: NAME }],
  ["d", "We went swimming in the {place} ______ the cold water, {name}.", { place: ["lake", "river", "sea", "pool"], name: NAME }],
  ["a", "______ the {test} was easy, many students made mistakes, {name}.", { test: ["exam", "test", "quiz", "homework"], name: NAME }],
  ["d", "______ the noise, the baby slept all {time}, {name}.", { time: ["night", "afternoon", "morning", "evening"], name: NAME }],
  ["a", "{name} didn't buy the {thing} ______ she liked it.", { name: NAMEF, thing: ["jacket", "dress", "bag", "phone"] }],
  ["d", "The {place} was full ______ the high prices, {name}.", { place: ["restaurant", "café", "hotel", "cinema"], name: NAME }],
  ["a", "______ we were tired, we walked to the {place}, {name}.", { place: ["museum", "bazaar", "old town", "station"], name: NAME }],
  ["i", "______ being only {age}, my cousin plays the {instr} very well.", { age: ["six", "seven", "eight", "nine"], instr: ["piano", "guitar", "violin", "drums"] }],
  ["a", "I couldn't sleep ______ I was very tired {when}, {name}.", { when: ["last night", "on the train", "after the trip", "on Sunday"], name: NAME }],
  ["d", "{name} went out ______ his mother's warning about the {weather}.", { name: NAMEM, weather: ["rain", "storm", "snow", "cold"] }],
  ["a", "______ the bus was late, we got to the {event} on time, {name}.", { event: ["party", "wedding", "concert", "match"], name: NAME }],
  ["d", "______ the heat, the tourists walked around the {place} all day, {name}.", { place: ["old town", "bazaar", "museum", "park"], name: NAME }],
  ["a", "My {who} is always hungry ______ he eats a lot, {name}.", { who: ["brother", "dog", "son", "uncle"], name: NAME }],
  ["i", "______ studying every day, {name} found the {test} hard.", { name: NAME, test: ["exam", "test", "course", "quiz"] }],
  ["a", "______ the shop was closed, the owner sold us some {thing}, {name}.", { thing: ["bread", "milk", "water", "fruit"], name: NAME }],
  ["d", "They stayed in the {place} ______ the {weather}.", { place: ["tent", "garden", "mountains", "village"], weather: ["storm", "rain", "strong wind", "cold"] }],
  ["a", "______ she was nervous, {name} sang very well at the {event}.", { name: NAMEF, event: ["concert", "party", "wedding", "festival"] }],
  ["i", "{name} felt cold ______ wearing a warm {thing}.", { name: NAME, thing: ["coat", "jacket", "hat", "scarf"] }],
  ["a", "______ it was expensive, my {who} bought a new {thing}.", { who: ["dad", "uncle", "sister", "aunt"], thing: ["phone", "car", "laptop", "TV"] }],
  ["d", "We had a great time in {city} ______ the bad weather, {name}.", { city: CITY, name: NAME }],
].map(([k, source, slots]) => {
  const word = k === "a" ? "although" : "despite";
  const start = source.startsWith("______");
  const key = start ? cap(word) : word;
  const acceptable = ACC[word].map((a) => (start ? cap(a) : a));
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, acceptable, why: k === "a" ? WA : k === "d" ? WD : WI, slots: pick(source, slots) };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TO_D = "Rewrite with despite. Keep the meaning.";
const TO_A = "Rewrite with although. Keep the meaning.";
const COR = "Correct the mistake.";
const WTD = "Despite + a noun or -ing form, not a whole clause.";
const WTA = "Although + a full clause: subject + verb.";
const TRANSFORM = [
  // although -> despite (5)
  [TO_D, "Although it was raining, we played {sport}, {name}.", "Despite ______, we played {sport}, {name}.", "the rain", WTD, { sport: SPORT, name: NAME }, []],
  [TO_D, "Although he was ill, {name} went to {work}.", "Despite ______, {name} went to {work}.", "being ill", WTD, { name: NAMEM, work: ["school", "work", "class", "college"] }, ["his illness"]],
  [TO_D, "Although it was cold, we swam every {time}, {name}.", "Despite ______, we swam every {time}, {name}.", "the cold", WTD, { time: ["day", "morning", "evening", "afternoon"], name: NAME }, ["the cold weather"]],
  [TO_D, "Although she was tired, {name} finished the {work}.", "Despite ______, {name} finished the {work}.", "being tired", WTD, { name: NAMEF, work: ["essay", "project", "report", "homework"] }, ["feeling tired"]],
  [TO_D, "Although the traffic was bad, we got to {city} on time, {name}.", "Despite ______, we got to {city} on time, {name}.", "the bad traffic", WTD, { city: CITY, name: NAME }, ["the traffic"]],
  // despite -> although (5)
  [TO_A, "Despite the rain, the {event} started on time, {name}.", "Although ______, the {event} started on time, {name}.", "it was raining", WTA, { event: ["match", "concert", "festival", "wedding"], name: NAME }, ["it rained"]],
  [TO_A, "Despite being tired, {name} cooked {meal}.", "Although ______, {name} cooked {meal}.", "he was tired", WTA, { name: NAMEM, meal: ["dinner", "plov", "breakfast", "lunch"] }, []],
  [TO_A, "Despite the noise, the children slept well {when}, {name}.", "Although ______, the children slept well {when}, {name}.", "it was noisy", WTA, { when: ["last night", "on the train", "at the hotel", "on Saturday"], name: NAME }, ["there was a lot of noise"]],
  [TO_A, "Despite living near the {place}, {name} is always late.", "Although ______ near the {place}, {name} is always late.", "she lives", WTA, { place: ["school", "office", "college", "lyceum"], name: NAMEF }, []],
  [TO_A, "Despite the high price, we bought the {thing}, {name}.", "Although ______, we bought the {thing}, {name}.", "it was expensive", WTA, { thing: ["sofa", "bike", "laptop", "camera"], name: NAME }, ["the price was high"]],
  // correct the mistake (5)
  [COR, "Despite it was late, we watched another {film}, {name}.", "______ it was late, we watched another {film}, {name}.", "Although", WA, { film: ["film", "episode", "cartoon", "match"], name: NAME }, ["Though", "Even though"]],
  [COR, "Although the rain, we went to the {place}, {name}.", "______ the rain, we went to the {place}, {name}.", "Despite", WD, { place: ["park", "bazaar", "zoo", "beach"], name: NAME }, ["In spite of"]],
  [COR, "Despite of the cold, {name} went out without a {thing}.", "______ the cold, {name} went out without a {thing}.", "Despite", "Despite has no of after it: despite the cold.", { name: NAME, thing: ["coat", "hat", "scarf", "jacket"] }, ["In spite of"]],
  [COR, "Despite he was tired, {name} played another game of {game}.", "______ he was tired, {name} played another game of {game}.", "Although", WA, { name: NAMEM, game: ["chess", "football", "cards", "tennis"] }, ["Though", "Even though"]],
  [COR, "She went to {work} despite she felt ill, {name}.", "She went to {work} ______ she felt ill, {name}.", "although", WA, { work: ["school", "work", "class", "college"], name: NAME }, ["though", "even though"]],
].map(([instr, source, hint, key, why, slots, acceptable]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about doing something although you were tired.", "Although I was tired, I …", ["exactly one sentence", "although + a clause", "a past verb"]],
  ["Write one sentence about going out despite bad weather.", "Despite the rain / cold, we …", ["exactly one sentence", "despite + a noun", "no of after despite"]],
  ["Write one sentence about a person who is good at something despite their age.", "Despite being only …, my … can …", ["exactly one sentence", "despite + -ing", "an age"]],
  ["Write one sentence about food you like although it isn't healthy.", "I like … although it …", ["exactly one sentence", "although in the middle", "a food word"]],
  ["Write one sentence about a trip that was good despite a problem.", "The trip was great despite …", ["exactly one sentence", "despite + a noun", "a past verb"]],
  ["Write one sentence about something you didn't buy although you liked it.", "Although I liked …, I didn't …", ["exactly one sentence", "although + a clause", "didn't"]],
  ["Write one sentence about passing a test despite a difficulty.", "Despite …ing …, I passed …", ["exactly one sentence", "despite + -ing", "passed"]],
  ["Write two sentences about the same problem: one with although and one with despite.", "Although it was …, … / Despite the …, …", ["exactly two sentences", "although + a clause", "despite + a noun or -ing"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a day that went well although things went wrong.", "Although the bus was late, … / Despite the rain, …", ["although + clause", "despite + noun or -ing", "three or four sentences"]],
  ["Describe a person you admire who succeeded despite difficulties.", "Despite having …, she … / Although he …", ["although and despite", "past verbs", "three or four sentences"]],
  ["Write a short review of a café or hotel: the good and the bad.", "Although the room was small, … / Despite the prices, …", ["although and despite", "an adjective", "three or four sentences"]],
  ["Describe a sport or hobby you keep doing although it is hard.", "Although it is difficult, I … / Despite feeling tired, …", ["although and despite", "present verbs", "three or four sentences"]],
  ["Describe a holiday with bad weather.", "Despite the rain, we … / Although it was cold, …", ["although and despite", "past verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.conjunctions.although-despite.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);