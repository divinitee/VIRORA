// Hand-authored: sentence-structure / conjunctions / when-time-clause (A2).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "Present simple (not will) in a future time clause after
// when" (I'll call you when I ______ home: get / will get / am getting / got).
// Talking about plans: "When I finish school, I want to…".
// Choose: the verb in the when-clause; distractors are will + verb (the
// transfer from Uzbek/Russian, which use future there), the past form, and a
// wrong person form (arrive for he). The progressive is NOT offered: "I'll
// call you when I'm leaving" is good English. "going to" is offered only once
// it can't be right in that sentence.
// Build: present simple from the verb in brackets (he/she gets -s).
// Transform: two future sentences → one with when; first … then → when;
// the same sentence about a new person (he/she + -s).
//
// Run: node tools/grammar-practice/authored/sentence-structure.conjunctions.when-time-clause.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "conjunctions", topic: "when-time-clause", level: "A2", pv: "2.5" };

const W = (form) => `The sentence is about the future, but after when we use the present simple, not will: when … ${form}.`;
const WS = (form) => `${W(form)} With he, she or it, add -s.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [["get", "will get", "got", "am going to get"], W("I get"), "I'll {act} you when I ______ home, {name}.",
    { act: ["call", "text", "message", "phone"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  [["arrives", "will arrive", "arrive", "arrived"], WS("he arrives"), "When Aziz ______ {place}, he'll {act}.",
    { place: ["in Tashkent", "at the station", "at the airport", "home"], act: ["call us", "text you", "take a taxi", "have a rest"] }],
  [["is", "will be", "are", "was"], WS("everyone is"), "We'll start the {thing} when everyone ______ here, {name}.",
    { thing: ["lesson", "meeting", "game", "party"], name: ["Ms Karimova", "Coach", "Dad", "Aziz"] }],
  [["am", "will be", "was", "be"], W("I am"), "When I ______ older, I want to be a {job} in {city}.",
    { job: ["doctor", "pilot", "teacher", "programmer"], city: ["Tashkent", "Seoul", "London", "Samarkand"] }],
  [["leave", "will leave", "left", "leaves"], W("you leave"), "Please close the windows when you ______ the house, {name}.",
    { name: ["Lola", "Timur", "Kamila", "Bobur"] }],
  [["finds", "will find", "find", "found"], WS("she finds"), "My sister will buy a car when she ______ a job in {city}.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  [["finishes", "will finish", "finish", "finished"], WS("the film finishes"), "When the film ______, let's go for {food}, {name}.",
    { food: ["pizza", "ice cream", "a walk", "some tea"], name: ["Aziz", "Olga", "Sardor", "Madina"] }],
  [["see", "will see", "saw", "sees"], W("I see"), "I'll tell you the news when I ______ you {when}.",
    { when: ["tomorrow", "on Monday", "at school", "next week"] }],
  [["gets", "will get", "got", "get"], WS("it gets"), "When it ______ warm, we'll go to the {place}.",
    { place: ["lake", "mountains", "river", "beach"] }],
  [["arrive", "will arrive", "arrived", "arrives"], W("you arrive"), "Text me when you ______ at the {place}, {name}.",
    { place: ["airport", "hotel", "station", "camp"], name: ["Malika", "Rustam", "Nodira", "Jasur"] }],
  [["comes", "will come", "came", "come"], WS("Mum comes"), "When Mum ______ home, we'll have {meal}.",
    { meal: ["dinner", "lunch", "tea", "plov"] }],
  [["have", "will have", "had", "has"], W("I have"), "I'll buy a new {thing} when I ______ enough money.",
    { thing: ["phone", "laptop", "bike", "watch"] }],
  [["go", "will go", "went", "goes"], W("you go"), "When you ______ to Samarkand, visit the {place}.",
    { place: ["Registan", "old city", "bazaar", "paper factory"] }],
  [["finish", "will finish", "finished", "finishes"], W("we finish"), "When we ______ the {exam}, we'll have a {event}.",
    { exam: ["exams", "test", "project", "course"], event: ["party", "picnic", "holiday", "big dinner"] }],
  [["gets back", "will get back", "got back", "get back"], WS("he gets back"), "Dad will help you with the {task} when he ______ from work.",
    { task: ["homework", "car", "computer", "project"] }],
  [["comes", "will come", "came", "come"], WS("the bus comes"), "When the {transport} ______, get on quickly, {name}.",
    { transport: ["bus", "train", "metro", "minibus"], name: ["Aziz", "Lola", "Anvar", "Sevara"] }],
  [["is", "will be", "was", "are"], WS("the exam is"), "I'll be very happy when the {exam} ______ over.",
    { exam: ["exam", "test", "competition", "interview"] }],
  [["hears", "will hear", "heard", "hear"], WS("Lola hears"), "When Lola ______ the news, she'll be {feel}.",
    { feel: ["so happy", "surprised", "very sad", "angry"] }],
  [["stops", "will stop", "stopped", "stop"], WS("the rain stops"), "We'll go {where} when the rain ______.",
    { where: ["out", "for a walk", "to the park", "shopping"] }],
  [["starts", "will start", "started", "start"], WS("the lesson starts"), "Please turn off your phones when the {thing} ______.",
    { thing: ["lesson", "film", "concert", "exam"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "The sentence is about the future. Complete the when part with the correct form of the verb in brackets.";
const BUILD = [
  ["finish", W("I finish"), "I'll call you when I ______ (finish) work, {name}.",
    { name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["arrives", WS("Timur arrives"), "When Timur ______ (arrive), we'll start the {thing}.",
    { thing: ["meeting", "game", "party", "lesson"] }],
  ["comes", WS("Dad comes"), "We'll have {meal} when Dad ______ (come) home, {name}.",
    { meal: ["dinner", "plov", "tea", "lunch"], name: ["Lola", "Aziz", "Mum", "Grandma"] }],
  ["see", W("you see"), "When you ______ (see) {who}, say hello from me, {name}.",
    { who: ["Grandma", "Aziz", "your parents", "the teacher"], name: ["Olga", "Timur", "Kamila", "Bobur"] }],
  ["get", W("I get"), "I'll send you the {thing} when I ______ (get) home.",
    { thing: ["photos", "video", "address", "homework"] }],
  ["stops", WS("it stops"), "When it ______ (stop) raining, we'll go to the {place}.",
    { place: ["park", "market", "stadium", "lake"] }],
  ["is", WS("he is"), "My brother will learn to drive when he ______ (be) eighteen.",
    {}],
  ["opens", WS("the shop opens"), "When the {shop} ______ (open), let's buy some {food}.",
    { shop: ["shop", "bakery", "market", "kiosk"], food: ["bread", "fruit", "milk", "cakes"] }],
  ["come", W("you come"), "Please wash your hands when you ______ (come) in, {name}.",
    { name: ["Aziz", "Lola", "Sardor", "Nigora"] }],
  ["have", W("I have"), "When I ______ (have) more time, I'll learn {skill}.",
    { skill: ["Korean", "to swim", "to drive", "the guitar"] }],
  ["lands", WS("her plane lands"), "She'll call us when her plane ______ (land) in {city}.",
    { city: ["Moscow", "Istanbul", "Seoul", "Dubai"] }],
  ["get", W("we get"), "When we ______ (get) to {city}, we'll visit the old town.",
    { city: ["Bukhara", "Khiva", "Samarkand", "Shahrisabz"] }],
  ["boils", WS("the water boils"), "Tell me when the water ______ (boil), {name}.",
    { name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["finish", W("you finish"), "When you ______ (finish) the {test}, give it to the {person}.",
    { test: ["test", "exercise", "quiz", "worksheet"], person: ["teacher", "examiner", "assistant", "monitor"] }],
  ["start", W("the holidays start"), "The children will be happy when the {holiday} ______ (start).",
    { holiday: ["holidays", "summer holidays", "winter holidays", "school holidays"] }],
  ["passes", WS("Aziza passes"), "When Aziza ______ (pass) her exams, her parents will buy her a {thing}.",
    { thing: ["laptop", "phone", "bike", "watch"] }],
  ["comes", WS("the taxi comes"), "We'll leave for the {place} when the taxi ______ (come).",
    { place: ["airport", "station", "wedding", "concert"] }],
  ["grow", W("I grow"), "When I ______ (grow) up, I'll be a {job}.",
    { job: ["doctor", "pilot", "footballer", "teacher"] }],
  ["wake", W("you wake"), "Can you feed the {pet} when you ______ (wake) up, {name}?",
    { pet: ["cat", "dog", "fish", "parrot"], name: ["Lola", "Timur", "Kamila", "Bobur"] }],
  ["visit", W("my friends visit"), "When my friends ______ (visit) {city}, I'll show them the {place}.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "our city"], place: ["old city", "bazaar", "best cafés", "parks"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with when. Don't use will after when.";
const SEQ = "Rewrite with when. Don't use will after when.";
const NEW = "Rewrite the sentence about the new person.";
const TRANSFORM = [
  // two future sentences -> when + present (5)
  [JOIN, "Aziz will arrive at the {place}. Then he'll {act}.", "Aziz will {act} when he ______ (arrive) at the {place}.", "arrives", [],
    "After when, use the present simple (arrives), not will arrive.",
    { place: ["airport", "station", "hotel", "bus station"], act: ["call us", "text you", "take a taxi", "have lunch"] }],
  [JOIN, "The film will finish. Then we'll go for {food}.", "We'll go for {food} when the film ______ (finish), {name}.", "finishes", [],
    "After when, use the present simple: when the film finishes.",
    { food: ["pizza", "ice cream", "a walk", "coffee"], name: ["Olga", "Aziz", "Lola", "Timur"] }],
  [JOIN, "Mum will come home. Then we'll have {meal}.", "We'll have {meal} when Mum ______ (come) home, {name}.", "comes", [],
    "After when, use the present simple: when Mum comes.",
    { meal: ["dinner", "lunch", "plov", "tea"], name: ["Dad", "Aziz", "Grandma", "Sevara"] }],
  [JOIN, "It will stop raining. Then the children will play {where}.", "The children will play {where} when it ______ (stop) raining.", "stops", [],
    "After when, use the present simple: when it stops.",
    { where: ["outside", "in the yard", "in the park", "in the garden"] }],
  [JOIN, "The shop will open. Then I'll buy {thing}.", "I'll buy {thing} when the shop ______ (open), {name}.", "opens", [],
    "After when, use the present simple: when the shop opens.",
    { thing: ["bread", "some milk", "eggs", "a cake"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  // first … then … -> when (5)
  [SEQ, "First I'll finish my {task}. Then I'll {act}.", "I'll {act} when ______ (finish) my {task}.", "I finish", [],
    "When + present simple: when I finish, not when I will finish.",
    { task: ["homework", "project", "essay", "work"], act: ["call you", "watch a film", "go out", "play games"] }],
  [SEQ, "First we'll get to the hotel. Then we'll {act}.", "We'll {act} when ______ (get) to the hotel, {name}.", "we get", [],
    "When + present simple: when we get, not when we will get.",
    { act: ["have a rest", "call home", "have dinner", "go for a walk"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  [SEQ, "First you'll see the {place}. Then turn {dir}.", "Turn {dir} when ______ (see) the {place}.", "you see", [],
    "When + present simple: when you see the bank.",
    { place: ["bank", "school", "big mosque", "petrol station"], dir: ["left", "right"] }],
  [SEQ, "First I'll have enough money. Then I'll buy a {thing}.", "I'll buy a {thing} when ______ (have) enough money, {name}.", "I have", [],
    "When + present simple: when I have enough money.",
    { thing: ["car", "laptop", "bike", "new phone"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [SEQ, "First they'll finish school. Then they'll {act}.", "They'll {act} when ______ (finish) school.", "they finish", [],
    "When + present simple: when they finish school.",
    { act: ["go to university", "find jobs", "travel", "move to Tashkent"] }],
  // new person: he / she + -s (5)
  [NEW, "I'll call you when I get home {when}.", "Aziz will call you when ______ (get) home {when}.", "he gets", [],
    "With he, the present simple takes -s: when he gets home.",
    { when: ["tonight", "later", "this evening", "after work"] }],
  [NEW, "We'll start when we're ready, {name}.", "She'll start when ______ (be) ready, {name}.", "she is", ["she's"],
    "With she, use is: when she is ready, not when she will be.",
    { name: ["Coach", "Ms Lee", "Aziz", "Mum"] }],
  [NEW, "I'll buy a car when I find a job in {city}.", "My sister will buy a car when ______ (find) a job in {city}.", "she finds", [],
    "With she, the present simple takes -s: when she finds.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  [NEW, "I'll tell you when I know the {thing}.", "Dad will tell you when ______ (know) the {thing}.", "he knows", [],
    "With he, the present simple takes -s: when he knows.",
    { thing: ["answer", "price", "time", "address"] }],
  [NEW, "We'll go to the {place} when we have time.", "Lola will go to the {place} when ______ (have) time.", "she has", [],
    "With she, have becomes has: when she has time.",
    { place: ["beach", "museum", "gym", "bazaar"] }],
].map(([instr, source, hint, key, acceptable, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots, ...(acceptable.length ? { acceptable } : {}),
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what you will do when you finish school or university.", "When I + present simple, I'll …", ["exactly one sentence", "must start with When I", "no will after when"]],
  ["Write one sentence about what you will do when you get home today.", "… when I get home", ["exactly one sentence", "must use when I get home", "will in the other part"]],
  ["Write one sentence about a friend: what will they do when they arrive?", "when he / she arrives", ["exactly one sentence", "must name the friend", "present simple with -s after when"]],
  ["Write one sentence about what you will buy when you have enough money.", "when I have enough money", ["exactly one sentence", "must use when", "no will after when"]],
  ["Write one sentence asking a friend to text you when they arrive.", "Text me when you …", ["exactly one sentence", "must use when you", "present simple after when"]],
  ["Write one sentence about what you will do when the weather gets warm.", "when it gets warm", ["exactly one sentence", "must use when it", "present simple with -s after when"]],
  ["Write one sentence about your plans when the holidays start.", "when the holidays start", ["exactly one sentence", "must use when", "no will after when"]],
  ["Write two sentences about your future: one starting with When, one with when in the middle.", "when + present simple", ["exactly two sentences", "when at the start of one", "no will after when"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What will you do when you finish school or university? Write three or four sentences.",
    "when + present simple for future time", ["When I + present simple", "I'll / I want to in the other part", "no will after when"]],
  ["Your friend is visiting your city. Write a message: what will you do when they arrive?",
    "when + present simple", ["when you arrive / get here", "we'll + verb", "no will after when"]],
  ["Describe your plans for the summer holidays. Use when two or three times.",
    "future time clauses with when", ["when the holidays start", "when I + present simple", "will in the main part"]],
  ["Write instructions for a friend who will look after your pet while you travel.",
    "when + present simple in instructions", ["when you + present simple", "imperatives like feed / give", "no will after when"]],
  ["Imagine your life in ten years. What will you do when you have a job, money and free time?",
    "when + present simple", ["when I have …", "I'll + verb", "two or more when clauses"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.conjunctions.when-time-clause.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
