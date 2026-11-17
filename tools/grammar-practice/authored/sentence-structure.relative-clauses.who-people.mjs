// Hand-authored: sentence-structure / relative-clauses / who-people (A2).
// Path fill P49 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement foci: who for a person in a defining relative clause (The woman
// ______ lives next door is a teacher: which / who / where / whose) and a
// productive defining relative clause.
// Sibling scope: who for PEOPLE only, and only as the SUBJECT of the clause
// (the man who lives …), so who can never be left out. Things (that /
// which) are P50, places (where) P51; no object relatives (the man I met:
// who / that / whom / nothing are all right), no whose, no commas.
// One right answer: THAT is also correct for people, so that is NEVER an
// option, and every typed answer accepts "that …" as well. Choose options:
// who / which / where / what (the man what lives is a common learner error);
// whose is not offered. Second kind: who + verb vs "who he lives" (the
// resumptive pronoun Uzbek / Russian learners add), which + verb, where +
// verb.
// Build: one blank = who + the verb in brackets in the right form (key "who
// lives", accepted "that lives"); singular and plural people, present and
// past.
// Transform: 5 join two sentences / 5 correct the mistake / 5 define a job
// (A doctor is a person who …).
//
// Run: node tools/grammar-practice/authored/sentence-structure.relative-clauses.who-people.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "relative-clauses", topic: "who-people", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  a: "The noun is a person, so use who (or that). which is for things, where for places.",
  b: "who is already the subject of the clause: who lives, not who he lives.",
  build: "A person + who + verb: the verb agrees with the person (the man who lives, the people who live).",
};
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const A = ["who", "which", "where", "what"];
const thatOf = (k) => [k.replace(/^who\b/, "that")];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE_A = [
  ["The woman ______ lives next door is a {job}, {name}.", { job: ["teacher", "doctor", "nurse", "cook"], name: NAME }],
  ["The man ______ sells {thing} at the bazaar is my {who}.", { thing: ["melons", "bread", "spices", "carpets"], who: ["uncle", "neighbour", "cousin", "grandpa"] }],
  ["I have a friend ______ speaks {lang} very well, {name}.", { lang: ["English", "Turkish", "Korean", "Chinese"], name: NAME }],
  ["The boy ______ won the {event} is in my class, {name}.", { event: ["race", "chess game", "competition", "quiz"], name: NAME }],
  ["Do you know the girl ______ is standing near the {place}, {name}?", { place: ["door", "window", "bus stop", "gate"], name: NAME }],
  ["The students ______ finished the {test} can go home, {name}.", { test: ["test", "exam", "dictation", "project"], name: NAME }],
  ["The doctor ______ helped my {who} was very kind, {name}.", { who: ["grandma", "grandpa", "little brother", "mum"], name: NAME }],
  ["My cousin is the person ______ always makes us laugh at {event}, {name}.", { event: ["weddings", "parties", "dinner", "family picnics"], name: NAME }],
  ["The people ______ live upstairs have a {pet}, {name}.", { pet: ["dog", "parrot", "cat", "rabbit"], name: NAME }],
  ["The driver ______ took us to {city} was very friendly, {name}.", { city: CITY, name: NAME }],
  ["Where is the man ______ fixed our {thing}, {name}?", { thing: ["car", "fridge", "washing machine", "roof"], name: NAME }],
  ["The children ______ play in the {place} are very {adj}.", { place: ["yard", "park", "street", "garden"], adj: ["loud", "happy", "funny", "friendly"] }],
  ["I like teachers ______ explain {subj} slowly, {name}.", { subj: ["grammar", "maths", "new words", "the rules"], name: NAME }],
  ["The woman ______ called you {when} was from the {place}.", { when: ["this morning", "an hour ago", "yesterday", "at lunch"], place: ["bank", "school", "hospital", "post office"] }],
];
const CHOOSE_B = [
  [["who lives", "who he lives", "which lives", "where lives"], "The man ______ near the {place} has three {animal}.", { place: ["river", "school", "mosque", "park"], animal: ["horses", "cows", "dogs", "goats"] }],
  [["who works", "who she works", "which works", "where works"], "My aunt is the woman ______ at the {job}, {name}.", { job: ["bank", "hospital", "post office", "school"], name: NAME }],
  [["who teaches", "who he teaches", "which teaches", "where teaches"], "Mr Karimov is the man ______ us {subj}, {name}.", { subj: ["maths", "history", "chemistry", "music"], name: NAME }],
  [["who sing", "who they sing", "which sing", "where sing"], "The girls ______ in the choir are from {city}, {name}.", { city: CITY, name: NAME }],
  [["who cooked", "who she cooked", "which cooked", "where cooked"], "Grandma is the person ______ this {food}, {name}.", { food: ["plov", "soup", "cake", "samsa"], name: NAME }],
  [["who drive", "who they drive", "which drive", "where drive"], "People ______ too fast on this {road} are dangerous, {name}.", { road: ["road", "street", "bridge", "hill"], name: NAME }],
];
const CHOOSE = [
  ...CHOOSE_A.map(([p, s]) => [A, "a", p, s]),
  ...CHOOSE_B.map(([o, p, s]) => [o, "b", p, s]),
].map(([base, w, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[w], slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write who and the verb in brackets in the right form.";
const BUILD = [
  ["who lives", "The woman ______ (live) next door is a {job}, {name}.", { job: ["teacher", "doctor", "nurse", "cook"], name: NAME }],
  ["who live", "The people ______ (live) upstairs are from {city}, {name}.", { city: CITY, name: NAME }],
  ["who works", "My uncle is the man ______ (work) at the {job}, {name}.", { job: ["bank", "airport", "hospital", "bazaar"], name: NAME }],
  ["who work", "The {job} ______ (work) at this hospital are very good, {name}.", { job: ["doctors", "nurses", "cooks", "cleaners"], name: NAME }],
  ["who plays", "I have a friend ______ (play) the {instr} very well, {name}.", { instr: ["piano", "guitar", "dutar", "violin"], name: NAME }],
  ["who play", "The boys ______ (play) football in the {place} are my {who}.", { place: ["yard", "park", "street", "field"], who: ["cousins", "brothers", "neighbours", "classmates"] }],
  ["who speaks", "We need someone ______ (speak) {lang}, {name}.", { lang: ["English", "Russian", "Turkish", "German"], name: NAME }],
  ["who teaches", "Ms Ivanova is the teacher ______ (teach) us {subj}, {name}.", { subj: ["English", "maths", "art", "biology"], name: NAME }],
  ["who sells", "The man ______ (sell) {thing} here is very kind, {name}.", { thing: ["fruit", "bread", "flowers", "shoes"], name: NAME }],
  ["who helped", "The woman ______ (help) us {when} was a {job}.", { when: ["yesterday", "on Monday", "last week", "this morning"], job: ["nurse", "police officer", "teacher", "doctor"] }],
  ["who won", "The girl ______ (win) the {event} is only twelve, {name}.", { event: ["race", "competition", "chess game", "quiz"], name: NAME }],
  ["who called", "The man ______ (call) you {when} was from the {place}.", { when: ["this morning", "at lunch", "an hour ago", "last night"], place: ["school", "bank", "shop", "hospital"] }],
  ["who wants", "Is there anyone ______ (want) more {food}, {name}?", { food: ["plov", "tea", "cake", "soup"], name: NAME }],
  ["who like", "People ______ (like) {sport} often come to this {place}.", { sport: ["football", "chess", "running", "volleyball"], place: ["park", "club", "café", "sports centre"] }],
  ["who wrote", "The woman ______ (write) this {book} lives in {city}.", { book: ["book", "song", "poem", "story"], city: CITY }],
  ["who sits", "The boy ______ (sit) next to me in class is from {city}, {name}.", { city: CITY, name: NAME }],
  ["who made", "Do you know the person ______ (make) this {thing}, {name}?", { thing: ["cake", "video", "poster", "dress"], name: NAME }],
  ["who visit", "Tourists ______ (visit) {city} love the old {place}.", { city: ["Samarkand", "Bukhara", "Khiva", "Shahrisabz"], place: ["town", "streets", "mosques", "bazaar"] }],
  ["who drives", "My cousin is the man ______ (drive) the school {vehicle}, {name}.", { vehicle: ["bus", "van", "minibus", "coach"], name: NAME }],
  ["who arrived", "The students ______ (arrive) late had to wait {place}, {name}.", { place: ["outside", "in the hall", "at the door", "in the corridor"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, acceptable: thatOf(key), why: W.build, slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with who.";
const COR = "Correct the mistake.";
const DEF = "Say what the person does. Use a person who.";
const TRANSFORM = [
  // join (5)
  [JOIN, "I have a friend, {name}. She lives in {city}.", "I have a friend ______ in {city}, {name}.", "who lives", { city: ["London", "Moscow", "Seoul", "Istanbul"], name: NAME }],
  [JOIN, "The man is my {who}. He sells {thing} at the bazaar.", "The man ______ {thing} at the bazaar is my {who}.", "who sells", { who: ["uncle", "neighbour", "cousin", "grandpa"], thing: ["melons", "bread", "spices", "carpets"] }],
  [JOIN, "The girl is in my class, {name}. She won the {event}.", "The girl ______ the {event} is in my class, {name}.", "who won", { event: ["race", "chess game", "competition", "quiz"], name: NAME }],
  [JOIN, "The people are very {adj}. They live next door, {name}.", "The people ______ next door are very {adj}, {name}.", "who live", { adj: ["nice", "friendly", "quiet", "kind"], name: NAME }],
  [JOIN, "The doctor was very kind. He helped my {who}, {name}.", "The doctor ______ my {who} was very kind, {name}.", "who helped", { who: ["grandma", "grandpa", "little brother", "mum"], name: NAME }],
  // correct (5)
  [COR, "The woman which lives next door is a {job}, {name}.", "The woman ______ next door is a {job}, {name}.", "who lives", { job: ["teacher", "doctor", "nurse", "cook"], name: NAME }],
  [COR, "The man who he works at the {job} is my {who}.", "The man ______ at the {job} is my {who}.", "who works", { job: ["bank", "airport", "hospital", "post office"], who: ["dad", "uncle", "neighbour", "cousin"] }],
  [COR, "I have a friend what plays the {instr}, {name}.", "I have a friend ______ the {instr}, {name}.", "who plays", { instr: ["piano", "guitar", "dutar", "violin"], name: NAME }],
  [COR, "The students where finished the {test} can go, {name}.", "The students ______ the {test} can go, {name}.", "who finished", { test: ["test", "exam", "dictation", "project"], name: NAME }],
  [COR, "The girl who she sings in the choir is from {city}, {name}.", "The girl ______ in the choir is from {city}, {name}.", "who sings", { city: CITY, name: NAME }],
  // define a job (5)
  [DEF, "A doctor helps {who}.", "A doctor is a person ______ {who}.", "who helps", { who: ["sick people", "ill children", "people in hospital", "patients"] }],
  [DEF, "A teacher teaches {who} at {place}.", "A teacher is a person ______ {who} at {place}.", "who teaches", { who: ["children", "students", "young people", "teenagers"], place: ["school", "a college", "a lyceum", "a language centre"] }],
  [DEF, "A baker makes {food} every {when}.", "A baker is a person ______ {food} every {when}.", "who makes", { food: ["bread", "cakes", "non", "samsa"], when: ["day", "morning", "night", "week"] }],
  [DEF, "A {job} looks after {who}.", "A {job} is a person ______ {who}.", "who looks after", { job: ["nurse", "babysitter", "nanny", "carer"], who: ["sick people", "children", "old people", "babies"] }],
  [DEF, "A {job} drives a {vehicle}.", "A {job} is a person ______ a {vehicle}.", "who drives", { job: ["bus driver", "taxi driver", "truck driver", "tram driver"], vehicle: ["bus", "taxi", "truck", "tram"] }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, acceptable: thatOf(key), why: W.build, slots: fix(slots, source + hint) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a friend who lives in another city.", "I have a friend who lives in …", ["exactly one sentence", "who", "a city name"]],
  ["Write one sentence about a person in your family who cooks well.", "My … is the person who …", ["exactly one sentence", "who", "a family word"]],
  ["Say what a nurse is. Use a person who.", "A nurse is a person who …", ["exactly one sentence", "a person who", "a verb with -s"]],
  ["Write one sentence about a teacher who helped you.", "… is the teacher who helped me …", ["exactly one sentence", "who", "a past verb"]],
  ["Write one sentence about the people who live next door.", "The people who live next door …", ["exactly one sentence", "who live", "a describing word"]],
  ["Write one sentence about a famous person who you like.", "… is a singer / player who …", ["exactly one sentence", "who + verb", "a job word"]],
  ["Write one sentence about the kind of friends you like.", "I like friends who …", ["exactly one sentence", "who", "a plural noun"]],
  ["Write two sentences: one about a person who lives near you and one about a person who works with your mum or dad.", "who lives / who works", ["exactly two sentences", "who lives once", "who works once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe three people in your street or building. Use who in each sentence.", "The man who … / The woman who …", ["who three times", "a person word", "three or four sentences"]],
  ["Describe your best friend and the people who are important to him or her.", "… is a person who …", ["who", "a family word", "three or four sentences"]],
  ["Describe the people at a family wedding or party.", "The woman who … / The boy who …", ["who twice", "a past verb", "three or four sentences"]],
  ["Write about three jobs. Say what each person does.", "A … is a person who …", ["a person who", "three job words", "three or four sentences"]],
  ["Describe your class: the students who are good at different things.", "The boy who … / The girl who …", ["who", "good at", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.relative-clauses.who-people.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);