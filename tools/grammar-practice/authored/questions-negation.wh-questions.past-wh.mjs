// Hand-authored: questions-negation / wh-questions / past-wh (A2).
//
// Placement foci: did in a past wh-question, and the order
// Wh + did + subject + base verb + time. Every sentence has one fixed past time
// marker (never slotted). Choose: 12 items pick the auxiliary (distractors do /
// does — the tense error — and were: every item has a main verb, so were is
// never right); 8 items pick the verb after did (distractors past, -ing, -s:
// "Where did you went" is the classic error). The wh-word is never tested
// (wh-word-choice does that). Build: did + base verb from the cue. Transform
// kinds: statement → Where question (5), → What question (5), → When / What
// time question (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.wh-questions.past-wh.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "wh-questions", topic: "past-wh", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DID = "The question is about the past, so use Wh + did + subject + base verb, for every subject.";
const BASEV = "After did + subject, use the base verb. Did already shows the past.";
const O = ["did", "do", "does", "were"];
const O_SG = ["did", "does", "do", "was"];
const v = (b, past, ing, s) => [b, past, ing, s];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O, DID, "Where ______ you go last weekend, {name}? To {city}?", { name: NAME, city: CITY }],
  [O_SG, DID, "What ______ your sister buy at the {place} yesterday, {name}?", { place: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  [O, DID, "When ______ they arrive in {city} last week?", { city: CITY }],
  [O_SG, DID, "Why ______ Sardor leave the {event} early last night, {name}?", { event: ["party", "match", "concert", "lesson"], name: NAME }],
  [O, DID, "What ______ you eat for {meal} yesterday, {name}?", { meal: ["lunch", "dinner", "breakfast", "supper"], name: NAME }],
  [O_SG, DID, "Who ______ Madina meet at the {place} on Saturday, {name}?", { place: ["park", "café", "station", "gym"], name: NAME }],
  [O, DID, "What time ______ your parents get home last night, {name}?", { name: NAME }],
  [O_SG, DID, "Where ______ your dad park the {vehicle} this morning, {name}?", { vehicle: ["car", "van", "taxi", "bike"], name: NAME }],
  [O, DID, "What ______ we learn in {subject} yesterday, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [O_SG, DID, "How ______ Kamron get to {city} last summer?", { city: CITY }],
  [O, DID, "Why ______ you miss the {transport} this morning, {name}?", { transport: ["bus", "train", "metro", "minibus"], name: NAME }],
  [O_SG, DID, "What ______ your teacher say about the {task} yesterday, {name}?", { task: ["test", "homework", "project", "essay"], name: NAME }],
  [v("go", "went", "going", "goes"), BASEV, "Where did you ______ on {day}, {name}?", { day: ["Saturday", "Sunday", "Friday", "Monday"], name: NAME }],
  [v("buy", "bought", "buying", "buys"), BASEV, "What did Lola ______ for her {person} last week, {name}?", { person: ["mum", "brother", "grandma", "friend"], name: NAME }],
  [v("see", "saw", "seeing", "sees"), BASEV, "Who did you ______ at the {event} last night, {name}?", { event: ["party", "concert", "match", "wedding"], name: NAME }],
  [v("do", "did", "doing", "does"), BASEV, "What did your brother ______ in {city} last summer?", { city: CITY }],
  [v("arrive", "arrived", "arriving", "arrives"), BASEV, "When did the {transport} ______ yesterday, {name}?", { transport: ["bus", "train", "plane", "minibus"], name: NAME }],
  [v("leave", "left", "leaving", "leaves"), BASEV, "Where did you ______ my {thing} last night, {name}?", { thing: ["keys", "phone", "bag", "book"], name: NAME }],
  [v("come", "came", "coming", "comes"), BASEV, "Why did Jasur ______ late to {subject} today, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [v("make", "made", "making", "makes"), BASEV, "What did your grandma ______ for {meal} on Sunday, {name}?", { meal: ["lunch", "dinner", "breakfast", "the guests"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write did in the first gap and the verb in brackets in the second.";
const BUILD = [
  ["go", "Where ______ you ______ (go) after {subject} yesterday, {name}?", { subject: ["maths", "English", "school", "college"], name: NAME }],
  ["eat", "What ______ your friends ______ (eat) at the {event} last night, {name}?", { event: ["party", "wedding", "picnic", "birthday"], name: NAME }],
  ["call", "Who ______ you ______ (call) this morning, {name}? Your {person}?", { name: NAME, person: ["mum", "dad", "teacher", "cousin"] }],
  ["start", "When ______ the {event} ______ (start) yesterday, {name}?", { event: ["match", "concert", "film", "lesson"], name: NAME }],
  ["cry", "Why ______ the baby ______ (cry) last night, {name}? Was she {state}?", { name: NAME, state: ["hungry", "tired", "cold", "ill"] }],
  ["buy", "Where ______ Nodira ______ (buy) her new {thing} last week, {name}?", { thing: ["dress", "bag", "phone", "coat"], name: NAME }],
  ["watch", "What ______ you ______ (watch) on TV on {day}, {name}?", { day: ["Saturday", "Sunday", "Friday", "Monday"], name: NAME }],
  ["meet", "Where ______ your parents ______ (meet) for the first time, {name}? In {city}?", { name: NAME, city: CITY }],
  ["get", "What ______ you ______ (get) for your birthday last year, {name}? A {thing}?", { name: NAME, thing: ["bike", "phone", "watch", "book"] }],
  ["sleep", "Where ______ they ______ (sleep) in {city} last summer?", { city: CITY }],
  ["say", "What ______ Rustam ______ (say) to the {person} yesterday, {name}?", { person: ["teacher", "coach", "doctor", "driver"], name: NAME }],
  ["arrive", "What time ______ your {person} ______ (arrive) last night, {name}?", { person: ["uncle", "aunt", "cousin", "grandma"], name: NAME }],
  ["choose", "Why ______ you ______ (choose) {subject} last year, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["find", "Where ______ Dilnoza ______ (find) her {thing} this morning, {name}?", { thing: ["keys", "phone", "glasses", "bag"], name: NAME }],
  ["help", "Who ______ you ______ (help) with {subject} on Monday, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["drink", "What ______ you ______ (drink) at the {place} yesterday, {name}?", { place: ["café", "party", "match", "cinema"], name: NAME }],
  ["finish", "When ______ Bobur ______ (finish) his {task} last night, {name}?", { task: ["homework", "project", "essay", "book"], name: NAME }],
  ["break", "How ______ your brother ______ (break) his {part} last month, {name}?", { part: ["arm", "leg", "finger", "phone"], name: NAME }],
  ["sit", "Where ______ you ______ (sit) on the {transport} this morning, {name}?", { transport: ["bus", "train", "metro", "minibus"], name: NAME }],
  ["learn", "What ______ the students ______ (learn) in {subject} on Tuesday, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
].map(([vb, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: ["did", vb], why: `${DID} Then the base verb ${vb}.`, slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T = (w, part) => `Ask a ${w} question about the ${part}. Write one word in each gap.`;
const W = (past, b) => `Past question: Wh + did + subject + base verb, so ${past} becomes did … ${b}.`;
const TRANSFORM = [
  [T("Where", "place"), "Sardor went to {city} last week, {name}.", "Where ______ Sardor ______ last week, {name}?", ["did", "go"], W("went", "go"), { city: CITY, name: NAME }],
  [T("Where", "place"), "I bought this {thing} at the bazaar yesterday, {name}.", "Where ______ you ______ this {thing} yesterday, {name}?", ["did", "buy"], W("bought", "buy"), { thing: ["hat", "bag", "scarf", "phone case"], name: NAME }],
  [T("Where", "place"), "They stayed in a hotel in {city} last summer, {name}.", "Where ______ they ______ in {city} last summer, {name}?", ["did", "stay"], W("stayed", "stay"), { city: CITY, name: NAME }],
  [T("Where", "place"), "My mum met her {person} at the market on Monday.", "Where ______ your mum ______ her {person} on Monday?", ["did", "meet"], W("met", "meet"), { person: ["friend", "sister", "neighbour", "teacher"] }],
  [T("Where", "place"), "We played {game} in the park yesterday, {name}.", "Where ______ you ______ {game} yesterday, {name}?", ["did", "play"], W("played", "play"), { game: ["football", "volleyball", "chess", "tennis"], name: NAME }],
  [T("What", "thing"), "Lola ate {food} for lunch yesterday, {name}.", "What ______ Lola ______ for lunch yesterday, {name}?", ["did", "eat"], W("ate", "eat"), { food: ["plov", "soup", "salad", "pasta"], name: NAME }],
  [T("What", "thing"), "I watched a {show} last night, {name}.", "What ______ you ______ last night, {name}?", ["did", "watch"], W("watched", "watch"), { show: ["film", "match", "cartoon", "video"], name: NAME }],
  [T("What", "thing"), "My brother bought a {thing} on Saturday, {name}.", "What ______ your brother ______ on Saturday, {name}?", ["did", "buy"], W("bought", "buy"), { thing: ["bike", "phone", "jacket", "ball"], name: NAME }],
  [T("What", "thing"), "Akmal wrote a {thing} for his {person} last week.", "What ______ Akmal ______ for his {person} last week?", ["did", "write"], W("wrote", "write"), { thing: ["letter", "poem", "story", "song"], person: ["mum", "grandma", "sister", "teacher"] }],
  [T("What", "thing"), "They made {food} for the guests on Sunday, {name}.", "What ______ they ______ for the guests on Sunday, {name}?", ["did", "make"], W("made", "make"), { food: ["plov", "samsa", "a cake", "manti"], name: NAME }],
  [T("When", "time"), "Kamila arrived in {city} on Tuesday, {name}.", "When ______ Kamila ______ in {city}, {name}?", ["did", "arrive"], W("arrived", "arrive"), { city: CITY, name: NAME }],
  [T("What time", "time"), "The {event} started at seven, {name}.", "What time ______ the {event} ______, {name}?", ["did", "start"], W("started", "start"), { event: ["match", "concert", "film", "party"], name: NAME }],
  [T("When", "time"), "I finished my {task} on Monday, {name}.", "When ______ you ______ your {task}, {name}?", ["did", "finish"], W("finished", "finish"), { task: ["project", "essay", "homework", "book"], name: NAME }],
  [T("What time", "time"), "Dad left for {city} at six, {name}.", "What time ______ Dad ______ for {city}, {name}?", ["did", "leave"], W("left", "leave"), { city: CITY, name: NAME }],
  [T("When", "time"), "We moved to this {home} in 2020, {name}.", "When ______ you ______ to this {home}, {name}?", ["did", "move"], W("moved", "move"), { home: ["flat", "house", "street", "town"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a friend about last weekend. Use Where did you.", "Where did you", ["exactly one question", "must use Where did you + base verb"]],
  ["Ask about your friend's dinner last night. Use What did.", "What did", ["exactly one question", "must use What did", "base verb"]],
  ["Ask why a classmate was late yesterday. Use Why did.", "Why did", ["exactly one question", "must use Why did"]],
  ["Ask when your cousin arrived. Use When did.", "When did", ["exactly one question", "must use When did", "must use arrive"]],
  ["Ask who your friend saw at a party. Use Who did.", "Who did", ["exactly one question", "must use Who did", "must use see"]],
  ["Write two past questions with different wh-words.", "Wh + did", ["exactly two questions", "must use did twice"]],
  ["Ask what time the film started. Use What time did.", "What time did", ["exactly one question", "must use start"]],
  ["Ask how your friend got to school this morning. Use How did.", "How did", ["exactly one question", "must use How did", "must use get"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Your friend came back from a trip. Write four wh-questions about it.", "Wh + did questions", ["Where did you", "What did you"]],
  ["Interview a classmate about their last birthday.", "Wh + did questions", ["What did you", "Who did you"]],
  ["Write a short dialogue: a police officer asks about a lost bag.", "Wh + did questions", ["Where did you", "When did you"]],
  ["Write questions about your grandparents' childhood.", "Wh + did questions", ["Where did", "What did"]],
  ["Write questions about a football match last weekend.", "Wh + did questions", ["Who did", "What time did"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.wh-questions.past-wh.json", JSON.stringify(items, null, 1) + "\n");