// Hand-authored: questions-negation / negation / wasnt-werent (A2).
//
// Placement focus: negative of past be, no "didn't". Rule 14 scope note: no
// topic teaches past be positive, so this one contrasts was/were with
// wasn't/weren't. Choose: 6 positive picks (was/were vs is/are/been) + 14
// negative picks (distractors: the other number, didn't = do-transfer, and
// "not was" = L1 word order). Options are all one polarity, so only the number
// and the form decide. Build: cue (be), instr says positive or negative.
// Transform kinds: positive → negative (5), negative → positive (5),
// present → past (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.negation.wasnt-werent.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "negation", topic: "wasnt-werent", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const W = {
  was: "The subject is I, he, she or it, so the past of be is was.",
  were: "The subject is you, we, they or a plural noun, so the past of be is were.",
  "wasn't": "Past be with I, he, she or it: wasn't. Never didn't with be.",
  "weren't": "Past be with you, we, they or a plural noun: weren't. Never didn't with be.",
};
const O = {
  was: ["was", "were", "is", "been"],
  were: ["were", "was", "are", "been"],
  "wasn't": ["wasn't", "weren't", "didn't", "not was"],
  "weren't": ["weren't", "wasn't", "didn't", "not were"],
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["was", "I ______ very tired after the {event} yesterday, {name}.", { event: ["match", "exam", "trip", "concert"], name: NAME }],
  ["was", "The weather ______ {adj} in {city} last weekend.", { adj: ["sunny", "warm", "cold", "windy"], city: CITY }],
  ["was", "Before she retired, my grandma ______ a {job}, {name}.", { job: ["teacher", "nurse", "doctor", "cook"], name: NAME }],
  ["were", "My friends ______ at the {place} last Saturday, {name}.", { place: ["park", "cinema", "bazaar", "stadium"], name: NAME }],
  ["were", "We ______ in {city} two years ago, {name}.", { city: CITY, name: NAME }],
  ["were", "The {thing} ______ very cheap last year, {name}.", { thing: ["tickets", "apples", "phones", "shoes"], name: NAME }],
  ["wasn't", "I ______ at school yesterday because I was {state}, {name}.", { state: ["ill", "at the dentist", "at the hospital", "in Tashkent"], name: NAME }],
  ["wasn't", "The {food} ______ very good, so we didn't finish it, {name}.", { food: ["soup", "pizza", "plov", "cake"], name: NAME }],
  ["wasn't", "Sorry, {name}. My phone ______ on, so I missed your {msg}.", { msg: ["call", "message", "text", "voice message"], name: NAME }],
  ["wasn't", "Timur ______ happy with his {result} last week, {name}.", { result: ["test score", "mark", "photo", "haircut"], name: NAME }],
  ["wasn't", "The {place} ______ open on Sunday, so we went home, {name}.", { place: ["museum", "bank", "library", "post office"], name: NAME }],
  ["wasn't", "It ______ cold yesterday, so I didn't wear my {cloth}, {name}.", { cloth: ["coat", "jacket", "hat", "scarf"], name: NAME }],
  ["wasn't", "Our teacher ______ at the {event} last night, {name}.", { event: ["concert", "meeting", "party", "match"], name: NAME }],
  ["weren't", "My parents ______ at home when I came back from {place}, {name}.", { place: ["school", "college", "the gym", "work"], name: NAME }],
  ["weren't", "The {thing} ______ expensive, so I bought two, {name}.", { thing: ["notebooks", "socks", "pens", "T-shirts"], name: NAME }],
  ["weren't", "We ______ late for the {event} this morning, {name}.", { event: ["lesson", "bus", "exam", "meeting"], name: NAME }],
  ["weren't", "The students ______ ready for the {test} on Monday, {name}.", { test: ["test", "exam", "quiz", "presentation"], name: NAME }],
  ["weren't", "You ______ in {subject} class yesterday, {name}.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["weren't", "My cousins ______ in {city} last summer, {name}.", { city: CITY, name: NAME }],
  ["weren't", "The streets ______ busy on {day} morning, {name}.", { day: ["Sunday", "Saturday", "Friday", "Monday"], name: NAME }],
].map(([k, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: O[k], key: 0, why: W[k], slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const B_POS = "Write the past of be: was or were.";
const B_NEG = "Write the negative past of be: wasn't or weren't.";
const BUILD = [
  ["was", "I ______ (be) at the {place} all day yesterday, {name}.", { place: ["library", "gym", "bazaar", "hospital"], name: NAME }],
  ["were", "My brothers ______ (be) at the {event} last night, {name}.", { event: ["match", "concert", "wedding", "party"], name: NAME }],
  ["was", "The film ______ (be) really {adj}, {name}.", { adj: ["funny", "long", "boring", "sad"], name: NAME }],
  ["were", "Olga and Timur ______ (be) in {city} last {time}.", { city: CITY, time: ["month", "week", "summer", "winter"] }],
  ["was", "It ______ (be) {adj} yesterday morning, {name}.", { adj: ["foggy", "cold", "windy", "rainy"], name: NAME }],
  ["were", "Your keys ______ (be) on the {furniture} a minute ago, {name}.", { furniture: ["table", "sofa", "shelf", "desk"], name: NAME }],
  ["was", "My first teacher ______ (be) very {adj}, {name}.", { adj: ["kind", "strict", "funny", "patient"], name: NAME }],
  ["were", "We ______ (be) at the {place} at six o'clock, {name}.", { place: ["station", "airport", "stadium", "bazaar"], name: NAME }],
  ["wasn't", "I ______ (be) at home when you called, {name}. I was at the {place}.", { place: ["gym", "shop", "library", "bazaar"], name: NAME }],
  ["wasn't", "The {food} ______ (be) hot enough, {name}.", { food: ["soup", "tea", "pizza", "coffee"], name: NAME }],
  ["weren't", "My parents ______ (be) angry about the {thing}, {name}.", { thing: ["mess", "broken cup", "late bus", "noise"], name: NAME }],
  ["wasn't", "The exam ______ (be) difficult last {day}, {name}.", { day: ["Friday", "Monday", "Tuesday", "Thursday"], name: NAME }],
  ["weren't", "We ______ (be) at the {event} yesterday. We were ill, {name}.", { event: ["party", "match", "concert", "lesson"], name: NAME }],
  ["weren't", "The shops ______ (be) open on {holiday}, {name}.", { holiday: ["New Year's Day", "Navruz", "Sunday", "the holiday"], name: NAME }],
  ["wasn't", "Kamila ______ (be) at the {place} this morning, {name}.", { place: ["lesson", "meeting", "gym", "bus stop"], name: NAME }],
  ["weren't", "The questions ______ (be) easy in the {subject} test, {name}.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["wasn't", "It ______ (be) my {thing}, {name}. Mine is blue.", { thing: ["bag", "pen", "umbrella", "jacket"], name: NAME }],
  ["weren't", "The seats on the bus ______ (be) comfortable, {name}. My back hurt after the {trip}.", { trip: ["trip", "journey", "ride", "drive"], name: NAME }],
  ["wasn't", "I ______ (be) ready for the {event} on Monday, {name}.", { event: ["test", "match", "interview", "trip"], name: NAME }],
  ["weren't", "My friends ______ (be) at school on {day}, {name}.", { day: ["Monday", "Tuesday", "Thursday", "Friday"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: key.includes("n't") ? B_NEG : B_POS, source, key, why: W[key], slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_NEG = "Make the sentence negative. Write one word in the gap.";
const T_POS = "Make the sentence positive. Write one word in the gap.";
const T_PAST = "Change the sentence to the past. Write one word in the gap.";
const TRANSFORM = [
  [T_NEG, "I was at the {place} on Monday, {name}.", "I ______ at the {place} on Monday, {name}.", "wasn't", { place: ["gym", "library", "pool", "bazaar"], name: NAME }],
  [T_NEG, "The tickets were {adj}, {name}.", "The tickets ______ {adj}, {name}.", "weren't", { adj: ["cheap", "expensive", "free", "ready"], name: NAME }],
  [T_NEG, "My sister was at home last {time}, {name}.", "My sister ______ at home last {time}, {name}.", "wasn't", { time: ["night", "weekend", "Sunday", "week"], name: NAME }],
  [T_NEG, "We were in {city} in {month}.", "We ______ in {city} in {month}.", "weren't", { city: CITY, month: ["May", "June", "July", "August"] }],
  [T_NEG, "The test was {adj}, {name}.", "The test ______ {adj}, {name}.", "wasn't", { adj: ["hard", "long", "easy", "short"], name: NAME }],
  [T_POS, "I wasn't late for {event} today, {name}.", "I ______ late for {event} today, {name}.", "was", { event: ["school", "work", "the bus", "the lesson"], name: NAME }],
  [T_POS, "The children weren't in the {place} after lunch, {name}.", "The children ______ in the {place} after lunch, {name}.", "were", { place: ["garden", "yard", "classroom", "park"], name: NAME }],
  [T_POS, "The room wasn't {adj} this morning, {name}.", "The room ______ {adj} this morning, {name}.", "was", { adj: ["cold", "clean", "warm", "quiet"], name: NAME }],
  [T_POS, "My parents weren't at the {event} yesterday, {name}.", "My parents ______ at the {event} yesterday, {name}.", "were", { event: ["wedding", "meeting", "concert", "match"], name: NAME }],
  [T_POS, "Nodir wasn't at the {place} on {day}.", "Nodir ______ at the {place} on {day}.", "was", { place: ["gym", "pool", "library", "bazaar"], day: ["Monday", "Tuesday", "Friday", "Sunday"] }],
  [T_PAST, "I'm not hungry now, {name}.", "I ______ hungry at {meal}, {name}.", "wasn't", { meal: ["lunch", "breakfast", "dinner", "the party"], name: NAME }],
  [T_PAST, "The streets in {city} are busy today, {name}.", "The streets in {city} ______ busy yesterday, {name}.", "were", { city: CITY, name: NAME }],
  [T_PAST, "My friends aren't at the {place} today, {name}.", "My friends ______ at the {place} yesterday, {name}.", "weren't", { place: ["gym", "park", "library", "pool"], name: NAME }],
  [T_PAST, "It's {adj} in {city} today.", "It ______ {adj} in {city} yesterday.", "was", { adj: ["sunny", "cold", "hot", "windy"], city: CITY }],
  [T_PAST, "Our teacher isn't at the {place} today, {name}.", "Our teacher ______ at the {place} yesterday, {name}.", "wasn't", { place: ["school", "meeting", "office", "gym"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: W[key], slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write about where you were yesterday evening. Use I was.", "I was", ["exactly one sentence", "must use was"]],
  ["Write about a place where you weren't last weekend. Use We weren't.", "We weren't", ["exactly one sentence", "must use weren't"]],
  ["Write about the weather yesterday. Use It wasn't.", "It wasn't", ["exactly one sentence", "must use wasn't", "no didn't"]],
  ["Write about a test or lesson. Use was and wasn't.", "was / wasn't", ["exactly two sentences", "must use was", "must use wasn't"]],
  ["Write about your friends last Saturday. Use were.", "were", ["exactly one sentence", "must use were"]],
  ["Write about a shop or café that wasn't open. Use wasn't open.", "wasn't open", ["exactly one sentence", "must use wasn't open"]],
  ["Write about your parents yesterday. Use weren't.", "weren't", ["exactly one sentence", "must use weren't"]],
  ["Write about a film you saw. Use It wasn't.", "It wasn't", ["exactly one sentence", "must use wasn't"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about your last holiday: where you were and how the weather was.", "was / were", ["We were", "It was"]],
  ["Write about a bad day: what wasn't good and who wasn't there.", "wasn't / weren't", ["wasn't", "weren't"]],
  ["Describe your first school: what was there and what wasn't.", "was / wasn't", ["was", "wasn't"]],
  ["Write about last weekend: where you were and where you weren't.", "were / weren't", ["I was", "weren't"]],
  ["Write about a trip: two things that were good and one that wasn't.", "were / wasn't", ["were", "wasn't"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.negation.wasnt-werent.json", JSON.stringify(items, null, 1) + "\n");