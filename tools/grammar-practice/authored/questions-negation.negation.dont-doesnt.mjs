// Hand-authored: questions-negation / negation / dont-doesnt (A1).
//
// Placement foci: don't with I (and you/we/they), and doesn't + BASE verb
// (no -s on the main verb). Choose: 10 items pick the negative auxiliary
// (distractors: the other one, am not / isn't — the be-for-do transfer — and
// bare "not", the Uzbek/Russian word-order error); 10 items pick the verb after
// doesn't (distractors: -s, -ing, past). "didn't" is never offered (it can be
// right). Build: don't/doesn't + verb from the cue. Transform kinds: I/you/they
// positive → negative (5), he/she positive → negative, drop the -s (5),
// negative for a new subject (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.negation.dont-doesnt.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "negation", topic: "dont-doesnt", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DONT = "The subject is I, you, we or they, so the negative is don't + base verb.";
const DOESNT = "The subject is he, she or it, so the negative is doesn't + base verb.";
const BASEV = "After doesn't, use the base verb: no -s, no -ing, no past form. The -s is already in doesn't.";
const O_DONT = ["don't", "doesn't", "am not", "not"];
const O_DONT_P = ["don't", "doesn't", "aren't", "not"];
const O_DOESNT = ["doesn't", "don't", "isn't", "not"];
const v = (b, s, ing, past) => [b, s, ing, past];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O_DONT, DONT, "I ______ like {food}, {name}.", { food: ["fish", "onions", "carrots", "milk"], name: NAME }],
  [O_DOESNT, DOESNT, "My brother ______ play {game} with us, {name}.", { game: ["football", "chess", "volleyball", "cards"], name: NAME }],
  [O_DONT, DONT, "I ______ have a {thing}, {name}.", { thing: ["laptop", "bike", "car", "tablet"], name: NAME }],
  [O_DOESNT, DOESNT, "Kamila ______ live in {city} now.", { city: CITY }],
  [O_DONT_P, DONT, "We ______ have {subject} on {day}.", { subject: ["maths", "English", "history", "science"], day: ["Monday", "Tuesday", "Friday", "Saturday"] }],
  [O_DOESNT, DOESNT, "This {place} ______ open on Sunday, {name}.", { place: ["shop", "bank", "library", "museum"], name: NAME }],
  [O_DONT_P, DONT, "My parents ______ watch {show} on TV, {name}.", { show: ["cartoons", "football", "the news", "music shows"], name: NAME }],
  [O_DOESNT, DOESNT, "Our teacher ______ give homework on {day}, {name}.", { day: ["Friday", "Saturday", "Monday", "Wednesday"], name: NAME }],
  [O_DONT, DONT, "I ______ drink {drink} in the evening, {name}.", { drink: ["coffee", "tea", "cola", "juice"], name: NAME }],
  [O_DOESNT, DOESNT, "The {transport} ______ stop here, {name}.", { transport: ["bus", "train", "minibus", "tram"], name: NAME }],
  [v("eat", "eats", "eating", "ate"), BASEV, "My sister doesn't ______ {food}, {name}.", { food: ["meat", "sweets", "bread", "eggs"], name: NAME }],
  [v("speak", "speaks", "speaking", "spoke"), BASEV, "Grandma doesn't ______ {lang}, {name}.", { lang: ["English", "Korean", "German", "Turkish"], name: NAME }],
  [v("go", "goes", "going", "went"), BASEV, "Sardor doesn't ______ to the {place} on {day}.", { place: ["gym", "pool", "park", "club"], day: ["Monday", "Sunday", "Friday", "Saturday"] }],
  [v("work", "works", "working", "worked"), BASEV, "My dad doesn't ______ on {day}, {name}.", { day: ["Sunday", "Saturday", "Friday", "Monday"], name: NAME }],
  [v("know", "knows", "knowing", "knew"), BASEV, "Nodir doesn't ______ the way to the {place}, {name}.", { place: ["station", "hospital", "bazaar", "airport"], name: NAME }],
  [v("like", "likes", "liking", "liked"), BASEV, "My cat doesn't ______ the {thing}, {name}.", { thing: ["rain", "dog", "vacuum cleaner", "cold"], name: NAME }],
  [v("drive", "drives", "driving", "drove"), BASEV, "My mum doesn't ______ to work. She takes the {transport}.", { transport: ["bus", "metro", "train", "minibus"] }],
  [v("watch", "watches", "watching", "watched"), BASEV, "Zarina doesn't ______ {show} at home, {name}.", { show: ["films", "cartoons", "the news", "football"], name: NAME }],
  [v("need", "needs", "needing", "needed"), BASEV, "Akmal doesn't ______ a new {thing}, {name}.", { thing: ["phone", "bag", "jacket", "bike"], name: NAME }],
  [v("sleep", "sleeps", "sleeping", "slept"), BASEV, "The baby doesn't ______ in the {time}, {name}.", { time: ["morning", "afternoon", "day", "evening"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the negative: don't or doesn't + the verb in brackets.";
const BUILD = [
  ["don't", "like", "I ______ (like) {food}, {name}.", { food: ["fish", "tomatoes", "carrots", "cheese"], name: NAME }],
  ["doesn't", "play", "My cousin ______ (play) {sport} at school, {name}.", { sport: ["football", "tennis", "volleyball", "basketball"], name: NAME }],
  ["don't", "live", "We ______ (live) near the {place}, {name}.", { place: ["river", "park", "station", "bazaar"], name: NAME }],
  ["doesn't", "work", "Feruza ______ (work) at the {place} now.", { place: ["bank", "hospital", "hotel", "airport"] }],
  ["don't", "eat", "My friends ______ (eat) {food} for lunch, {name}.", { food: ["soup", "rice", "salad", "pizza"], name: NAME }],
  ["doesn't", "start", "The lesson ______ (start) at {hour}, {name}.", { hour: ["eight", "nine", "ten", "two"], name: NAME }],
  ["don't", "understand", "I ______ (understand) this {task}, {name}.", { task: ["exercise", "question", "word", "rule"], name: NAME }],
  ["doesn't", "have", "Bobur ______ (have) a {pet}, {name}.", { pet: ["dog", "cat", "parrot", "rabbit"], name: NAME }],
  ["don't", "go", "They ______ (go) to {place} on {day}.", { place: ["school", "college", "the gym", "work"], day: ["Sunday", "Saturday", "Friday", "Monday"] }],
  ["doesn't", "rain", "It ______ (rain) much in {city} in summer.", { city: CITY }],
  ["don't", "know", "I ______ (know) your {person}, {name}.", { person: ["brother", "sister", "cousin", "teacher"], name: NAME }],
  ["doesn't", "speak", "My grandpa ______ (speak) {lang}, {name}.", { lang: ["English", "German", "Korean", "French"], name: NAME }],
  ["don't", "watch", "My sisters ______ (watch) {show}, {name}.", { show: ["cartoons", "football", "the news", "horror films"], name: NAME }],
  ["doesn't", "drink", "Lola ______ (drink) {drink}, {name}.", { drink: ["coffee", "milk", "cola", "green tea"], name: NAME }],
  ["don't", "need", "You ______ (need) a {thing} today, {name}.", { thing: ["coat", "hat", "ticket", "pen"], name: NAME }],
  ["doesn't", "open", "The {place} ______ (open) on Sunday, {name}.", { place: ["shop", "bank", "post office", "library"], name: NAME }],
  ["don't", "use", "We ______ (use) phones in {subject} lessons, {name}.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["doesn't", "cook", "My dad ______ (cook) {food}, {name}.", { food: ["plov", "soup", "fish", "pasta"], name: NAME }],
  ["don't", "want", "I ______ (want) {food} for dinner, {name}.", { food: ["pasta", "soup", "rice", "chicken"], name: NAME }],
  ["doesn't", "sell", "This {shop} ______ (sell) bread, {name}.", { shop: ["kiosk", "shop", "café", "pharmacy"], name: NAME }],
].map(([aux, vb, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${aux} ${vb}`, why: aux === "don't" ? DONT : `${DOESNT} Write ${vb}, not ${vb}s.`, slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_NEG = "Make the sentence negative. Write one word in each gap.";
const T_NEW = (s) => `Write the same negative sentence with the subject "${s}". Write one word in each gap.`;
const W1 = (vb) => `The subject is I, you, we or they, so use don't + ${vb}.`;
const W2 = (vb, s) => `With he or she, use doesn't + the base verb: ${s} becomes doesn't ${vb}.`;
const TRANSFORM = [
  [T_NEG, "I play {game} after school, {name}.", "I ______ ______ {game} after school, {name}.", ["don't", "play"], W1("play"), { game: ["chess", "football", "volleyball", "cards"], name: NAME }],
  [T_NEG, "We live in {city}.", "We ______ ______ in {city}.", ["don't", "live"], W1("live"), { city: CITY }],
  [T_NEG, "You need a {thing} for this lesson, {name}.", "You ______ ______ a {thing} for this lesson, {name}.", ["don't", "need"], W1("need"), { thing: ["pen", "book", "laptop", "dictionary"], name: NAME }],
  [T_NEG, "They eat {food} at home, {name}.", "They ______ ______ {food} at home, {name}.", ["don't", "eat"], W1("eat"), { food: ["fish", "rice", "pasta", "meat"], name: NAME }],
  [T_NEG, "I like {show}, {name}.", "I ______ ______ {show}, {name}.", ["don't", "like"], W1("like"), { show: ["cartoons", "horror films", "the news", "music shows"], name: NAME }],
  [T_NEG, "My brother works in {city}.", "My brother ______ ______ in {city}.", ["doesn't", "work"], W2("work", "works"), { city: CITY }],
  [T_NEG, "Madina speaks {lang}, {name}.", "Madina ______ ______ {lang}, {name}.", ["doesn't", "speak"], W2("speak", "speaks"), { lang: ["Korean", "German", "Turkish", "French"], name: NAME }],
  [T_NEG, "The {transport} goes to the airport, {name}.", "The {transport} ______ ______ to the airport, {name}.", ["doesn't", "go"], W2("go", "goes"), { transport: ["bus", "minibus", "train", "tram"], name: NAME }],
  [T_NEG, "My mum drinks {drink} in the morning, {name}.", "My mum ______ ______ {drink} in the morning, {name}.", ["doesn't", "drink"], W2("drink", "drinks"), { drink: ["coffee", "tea", "milk", "juice"], name: NAME }],
  [T_NEG, "Our dog sleeps on the {place}, {name}.", "Our dog ______ ______ on the {place}, {name}.", ["doesn't", "sleep"], W2("sleep", "sleeps"), { place: ["sofa", "bed", "carpet", "chair"], name: NAME }],
  [T_NEW("My sister"), "I don't watch TV on {day}.", "My sister ______ ______ TV on {day}.", ["doesn't", "watch"], "My sister = she, so don't becomes doesn't. The verb stays watch.", { day: ["Monday", "Tuesday", "Friday", "Saturday"] }],
  [T_NEW("Jasur"), "We don't have {subject} today, {name}.", "Jasur ______ ______ {subject} today, {name}.", ["doesn't", "have"], "Jasur = he, so use doesn't + have (never doesn't has).", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [T_NEW("My parents"), "My dad doesn't eat {food}, {name}.", "My parents ______ ______ {food}, {name}.", ["don't", "eat"], "My parents = they, so doesn't becomes don't.", { food: ["fish", "sweets", "spicy food", "fast food"], name: NAME }],
  [T_NEW("I"), "Akmal doesn't go to the {place}, {name}.", "I ______ ______ to the {place}, {name}.", ["don't", "go"], "With I, use don't + go.", { place: ["gym", "pool", "cinema", "library"], name: NAME }],
  [T_NEW("Our teacher"), "They don't know my {person}, {name}.", "Our teacher ______ ______ my {person}, {name}.", ["doesn't", "know"], "Our teacher = he or she, so use doesn't + know.", { person: ["brother", "sister", "cousin", "uncle"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write about a food you don't like. Use I don't.", "I don't", ["exactly one sentence", "must use don't + base verb"]],
  ["Write about something your friend doesn't do at the weekend.", "doesn't", ["exactly one sentence", "must use doesn't", "base verb after doesn't"]],
  ["Write about a day when your school is closed. Use We don't.", "We don't", ["exactly one sentence", "must use don't"]],
  ["Write about a person in your family. Use doesn't … like.", "doesn't like", ["exactly one sentence", "must use doesn't like"]],
  ["Write one sentence with don't and one with doesn't.", "don't / doesn't", ["exactly two sentences", "must use don't", "must use doesn't"]],
  ["Write about a shop near your home. Use doesn't open.", "doesn't open", ["exactly one sentence", "must use doesn't open"]],
  ["Write about your phone. Use I don't use.", "I don't use", ["exactly one sentence", "must use don't use"]],
  ["Write about your pet or a friend's pet. Use doesn't.", "doesn't", ["exactly one sentence", "must use doesn't", "base verb after doesn't"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write three things you don't do on Sundays.", "don't + base verb", ["I don't", "on Sunday"]],
  ["Describe a friend: two things they do and two things they don't do.", "doesn't + base verb", ["He doesn't", "She doesn't"]],
  ["Write about your town: what it has and what it doesn't have.", "doesn't have", ["doesn't have", "It has"]],
  ["Write about food in your family: what people eat and don't eat.", "don't / doesn't", ["don't eat", "doesn't eat"]],
  ["Write about your morning: what you do and what you don't do.", "don't + base verb", ["I don't", "every morning"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.negation.dont-doesnt.json", JSON.stringify(items, null, 1) + "\n");