// Hand-authored: sentence-structure / predication / be-question (A1).
//
// Placement focus: inverted question with be (Are you …?). Triage: distinct
// from questions-negation.yes-no.be-vs-do (be vs do choice): this topic is
// the form and order of Am/Is/Are + subject. Choose: Are you 6, Is 6, Are
// plural 4, Am I 4; distractors the wrong be form + Do/Does (do-for-be
// transfer). "You are …?" (rising intonation) is never offered: it is
// possible in speech. Build: be + subject from the cue. Transform kinds:
// statement → question (5), same question for a new subject (5), answer →
// question (5).
//
// Run: node tools/grammar-practice/authored/sentence-structure.predication.be-question.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "predication", topic: "be-question", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const W = {
  Are: "The subject is you, we, they or a plural noun, so the question starts with Are.",
  Is: "The subject is he, she, it or one person or thing, so the question starts with Is.",
  Am: "The subject is I, so the question starts with Am. Use be, not do, before an adjective, a place or a noun.",
};
const O = { Are: ["Are", "Is", "Do", "Am"], Is: ["Is", "Are", "Does", "Am"], Am: ["Am", "Is", "Do", "Are"] };
const first = (k) => (Array.isArray(k) ? k[0] : k.split(" ")[0]);

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["Are", "______ you from {city}, {name}?", { city: CITY, name: NAME }],
  ["Are", "______ you hungry, {name}? There is {food} in the kitchen.", { food: ["plov", "soup", "bread", "rice"], name: NAME }],
  ["Are", "______ you at the {place} now, {name}?", { place: ["gym", "bazaar", "library", "station"], name: NAME }],
  ["Are", "______ you a {role}, {name}?", { role: ["new student", "teacher here", "doctor", "driver"], name: NAME }],
  ["Are", "______ you good at {subject}, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["Are", "______ you and Sardor in the same {group}, {name}?", { group: ["class", "team", "group", "club"], name: NAME }],
  ["Is", "______ your sister at {place}, {name}?", { place: ["home", "school", "work", "the gym"], name: NAME }],
  ["Is", "______ it {adj} in {city} today?", { adj: ["cold", "hot", "windy", "sunny"], city: CITY }],
  ["Is", "______ the bank open on {day}, {name}?", { day: ["Saturday", "Sunday", "Monday", "Friday"], name: NAME }],
  ["Is", "______ your teacher {adj}, {name}?", { adj: ["strict", "kind", "young", "funny"], name: NAME }],
  ["Is", "______ this your {thing}, {name}?", { thing: ["bag", "phone", "pen", "jacket"], name: NAME }],
  ["Is", "______ Timur in the {room}, {name}?", { room: ["kitchen", "garden", "car", "library"], name: NAME }],
  ["Are", "______ your parents at {place}, {name}?", { place: ["home", "work", "the bazaar", "the hospital"], name: NAME }],
  ["Are", "______ the shops open on {holiday}, {name}?", { holiday: ["Sunday", "Navruz", "New Year's Day", "Saturday"], name: NAME }],
  ["Are", "______ we late for the {event}, {name}?", { event: ["lesson", "bus", "film", "match"], name: NAME }],
  ["Are", "______ these {food} fresh, {name}?", { food: ["apples", "eggs", "tomatoes", "grapes"], name: NAME }],
  ["Am", "______ I in your {group}, {name}?", { group: ["team", "group", "class", "photo"], name: NAME }],
  ["Am", "______ I late, {name}? The {event} starts at nine.", { event: ["lesson", "meeting", "test", "film"], name: NAME }],
  ["Am", "______ I right about the {thing}, {name}?", { thing: ["answer", "time", "date", "price"], name: NAME }],
  ["Am", "______ I in the right {place}, {name}?", { place: ["room", "queue", "bus", "class"], name: NAME }],
].map(([k, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: O[k], key: 0, why: W[k], slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the question: Am, Is or Are + the word in brackets.";
const BUILD = [
  ["Are you", "______ (you) tired after the {event}, {name}?", { event: ["match", "trip", "test", "lesson"], name: NAME }],
  ["Is he", "______ (he) your {person}, {name}?", { person: ["brother", "cousin", "uncle", "teacher"], name: NAME }],
  ["Is she", "______ (she) at the {place} now, {name}?", { place: ["gym", "pool", "bank", "shop"], name: NAME }],
  ["Are they", "______ (they) from {city}, {name}?", { city: CITY, name: NAME }],
  ["Is it", "______ (it) far from the {place}, {name}?", { place: ["station", "airport", "school", "bazaar"], name: NAME }],
  ["Are we", "______ (we) in the same {group}, {name}?", { group: ["class", "team", "group", "club"], name: NAME }],
  ["Am I", "______ (I) late for {event}, {name}?", { event: ["school", "the bus", "the lesson", "dinner"], name: NAME }],
  ["Are you", "______ (you) ready for the {event}, {name}?", { event: ["test", "trip", "match", "party"], name: NAME }],
  ["Is Kamila", "______ (Kamila) at home? She doesn't answer her {thing}, {name}.", { thing: ["phone", "messages", "calls", "texts"], name: NAME }],
  ["Is Bobur", "______ (Bobur) in {subject} class today, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["Are they", "______ (they) at the {place} with you, {name}?", { place: ["park", "cinema", "bazaar", "stadium"], name: NAME }],
  ["Is she", "______ (she) a {job}, {name}?", { job: ["nurse", "teacher", "driver", "cook"], name: NAME }],
  ["Is it", "______ (it) {adj} outside, {name}?", { adj: ["cold", "hot", "windy", "rainy"], name: NAME }],
  ["Are you", "______ (you) good at {sport}, {name}?", { sport: ["football", "chess", "tennis", "volleyball"], name: NAME }],
  ["Am I", "______ (I) next, {name}? It's my turn after {person}.", { person: ["Sardor", "Lola", "Nodir", "Kamron"], name: NAME }],
  ["Is he", "______ (he) at the {place} today, {name}?", { place: ["office", "hospital", "bank", "factory"], name: NAME }],
  ["Are we", "______ (we) on the right {transport}, {name}?", { transport: ["bus", "train", "minibus", "tram"], name: NAME }],
  ["Are they", "______ (they) your {thing}, {name}?", { thing: ["keys", "books", "shoes", "glasses"], name: NAME }],
  ["Is it", "______ (it) your {thing} on the table, {name}?", { thing: ["bag", "phone", "cup", "book"], name: NAME }],
  ["Is she", "______ (she) {adj} today, {name}?", { adj: ["happy", "busy", "ill", "tired"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W[first(key)], slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_Q = "Make a question. Write one word in each gap.";
const T_NEW = "Ask the same question about the new subject. Write one word in the gap.";
const T_ANS = "Write the question for this answer. Write one word in each gap.";
const TRANSFORM = [
  [T_Q, "You are from {city}, {name}.", "______ ______ from {city}, {name}?", ["Are", "you"], { city: CITY, name: NAME }],
  [T_Q, "Sardor is at the {place}, {name}.", "______ ______ at the {place}, {name}?", ["Is", "Sardor"], { place: ["gym", "pool", "bank", "bazaar"], name: NAME }],
  [T_Q, "They are in the {room}, {name}.", "______ ______ in the {room}, {name}?", ["Are", "they"], { room: ["kitchen", "garden", "classroom", "library"], name: NAME }],
  [T_Q, "It is {adj} today, {name}.", "______ ______ {adj} today, {name}?", ["Is", "it"], { adj: ["cold", "hot", "windy", "sunny"], name: NAME }],
  [T_Q, "I am in your {group}, {name}.", "______ ______ in your {group}, {name}?", ["Am", "I"], { group: ["team", "group", "class", "club"], name: NAME }],
  [T_NEW, "Is your brother at {place}, {name}?", "______ your brothers at {place}, {name}?", "Are", { place: ["home", "school", "work", "the gym"], name: NAME }],
  [T_NEW, "Are you {adj}, {name}?", "______ Olga {adj}, {name}?", "Is", { adj: ["tired", "hungry", "busy", "ready"], name: NAME }],
  [T_NEW, "Is he in the {group}, {name}?", "______ they in the {group}, {name}?", "Are", { group: ["team", "club", "class", "choir"], name: NAME }],
  [T_NEW, "Are they from {city}, {name}?", "______ your teacher from {city}, {name}?", "Is", { city: CITY, name: NAME }],
  [T_NEW, "Is she late for the {event}, {name}?", "______ I late for the {event}, {name}?", "Am", { event: ["lesson", "bus", "test", "film"], name: NAME }],
  [T_ANS, "Yes, I am. I'm at the {place}, {name}.", "______ ______ at the {place}, {name}?", ["Are", "you"], { place: ["gym", "station", "library", "bazaar"], name: NAME }],
  [T_ANS, "No, she isn't. She is at {place}, {name}.", "______ ______ at {place}, {name}?", ["Is", "she"], { place: ["home", "school", "work", "the gym"], name: NAME }],
  [T_ANS, "Yes, they are. They are in the {room}, {name}.", "______ ______ in the {room}, {name}?", ["Are", "they"], { room: ["kitchen", "garden", "car", "yard"], name: NAME }],
  [T_ANS, "Yes, it is. It is {adj} today, {name}.", "______ ______ {adj} today, {name}?", ["Is", "it"], { adj: ["cold", "hot", "rainy", "windy"], name: NAME }],
  [T_ANS, "No, we aren't. We are at the {place}, {name}.", "______ ______ at the {place}, {name}?", ["Are", "you"], { place: ["park", "cinema", "bazaar", "station"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: W[first(key)] + (instr === T_ANS ? " The answer tells you the subject and the be form." : ""), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a friend where they are from. Use Are you …?", "Are you", ["exactly one question", "be before the subject"]],
  ["Ask about the weather today. Use Is it …?", "Is it", ["exactly one question", "must start with Is"]],
  ["Ask about a person in your friend's family. Use Is your …?", "Is your", ["exactly one question", "must start with Is"]],
  ["Ask if you are late. Use Am I …?", "Am I", ["exactly one question", "must start with Am I"]],
  ["Ask about two people. Use Are they …?", "Are they", ["exactly one question", "must start with Are"]],
  ["Ask a new classmate two questions with be.", "Are you", ["exactly two questions", "be before the subject", "no do"]],
  ["Ask if a shop is open. Use Is the …?", "Is the", ["exactly one question", "must start with Is"]],
  ["Ask if your friends are ready. Use Are …?", "Are", ["exactly one question", "plural subject"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write four questions for a new student in your class.", "Are you …?", ["Are you", "Is your"]],
  ["You are going to a friend's house. Write three questions to ask on the phone.", "Is / Are questions", ["Is it", "Are you"]],
  ["Write questions about a photo of a family.", "Is / Are questions", ["Is she", "Are they"]],
  ["Write questions about a town you want to visit.", "Is / Are questions", ["Is it", "Are the"]],
  ["Write a short dialogue with three be questions and answers.", "be questions + short answers", ["Are you", "Yes, I am"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/sentence-structure.predication.be-question.json", JSON.stringify(items, null, 1) + "\n");