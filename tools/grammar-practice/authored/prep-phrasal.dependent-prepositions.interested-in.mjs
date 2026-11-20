// Hand-authored: prep-phrasal / dependent-prepositions / interested-in (A2).
// Path fill P55 (Claude lane, branch grammar-path-fill-claude, 17 Nov 2026).
//
// Tests ONE point: interested + in ("She is interested in photography"). The
// placement item's wrong answers are on, at and for.
//
// Triage: a single collocation, so three angles keep 20 choose sentences
// apart: (a) in, not at / on / for / about / to / with / of / from;
// (b) the preposition at the END of a question ("What are you interested
// in?"); (c) interested in, not "interesting in" or "interest in".
// Typed stages are mostly two blanks (interested + in) built from the cue
// (interest), so the stage is not twenty "in"s.
// Kept apart from adjective-preposition (P37): interested is the only
// adjective here. "interested to hear" is correct English, so "to" is only a
// wrong answer before a NOUN, never before a verb. "interested by" is never
// offered (some speakers use it).
//
// Run: node tools/grammar-practice/authored/prep-phrasal.dependent-prepositions.interested-in.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "dependent-prepositions", topic: "interested-in", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const ANY = ["Aziz", "Lola", "Madina", "Timur"];
const TOPIC = ["photography", "history", "music", "space"];
const W_IN = "Interested always takes in: interested in something.";
const W_END = "The preposition stays with interested, even at the end of a question: interested in.";
const W_ED = "A person is interested in something. Interesting describes the thing, not the person.";

/* ---------------- choose: 20 mcq ---------------- */
const O1 = ["in", "at", "on", "for"];
const O2 = ["in", "about", "to", "with"];
const O3 = ["in", "of", "from", "on"];
const A = (o, prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: o, key: 0, why: W_IN, slots });
const E = (prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: ["in", "at", "on", "about"], key: 0, why: W_END, slots });
const D = (prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: ["interested in", "interesting in", "interest in", "interested on"], key: 0, why: W_ED, slots });
const CHOOSE = [
  A(O1, "{name} is interested ______ {topic}.", { name: ANY, topic: TOPIC }),
  A(O2, "Are you interested ______ {thing}, {name}?", { thing: ["sport", "art", "cars", "computers"], name: N4 }),
  A(O3, "My {relative} is very interested ______ old {things}.", { relative: ["grandfather", "uncle", "father", "aunt"], things: ["coins", "books", "cars", "maps"] }),
  A(O1, "I am not interested ______ {thing}, {name}.", { thing: ["football", "fashion", "video games", "fishing"], name: P4 }),
  A(O2, "The {who} are interested ______ the new {thing}.", { who: ["students", "children", "boys", "girls"], thing: ["club", "course", "teacher", "game"] }),
  A(O3, "{name} was interested ______ {subj} at school.", { name: ANY, subj: ["biology", "geography", "chemistry", "literature"] }),
  A(O1, "Is your {relative} interested ______ {thing}?", { relative: ["brother", "sister", "father", "friend"], thing: ["cooking", "gardening", "travel", "languages"] }),
  A(O2, "We are all interested ______ your {thing}, {name}.", { thing: ["idea", "plan", "story", "project"], name: N4 }),
  A(O3, "Nobody in my {group} is interested ______ {thing}.", { group: ["family", "class", "team", "group"], thing: ["opera", "golf", "chess", "poetry"] }),
  A(O1, "{name} became interested ______ {thing} last year.", { name: ANY, thing: ["cooking", "programming", "painting", "running"] }),
  E("What is your {relative} interested ______, {name}?", { relative: ["brother", "sister", "father", "best friend"], name: N4 }),
  E("{name}, what are you interested ______ these days?", { name: P4 }),
  E("Which {things} are you interested ______, {name}?", { things: ["subjects", "sports", "books", "films"], name: N4 }),
  E("What was {name} interested ______ as a {age}?", { name: ANY, age: ["child", "little child", "teenager", "student"] }),
  E("Which {things} are the {who} interested ______?", { things: ["clubs", "games", "lessons", "topics"], who: ["students", "children", "boys", "girls"] }),
  D("{name} is ______ {topic}.", { name: ANY, topic: ["photography", "history", "music", "space"] }),
  D("My {relative} is very ______ {things}.", { relative: ["grandfather", "uncle", "father", "aunt"], things: ["old coins", "birds", "plants", "trains"] }),
  D("Are you ______ {thing}, {name}?", { thing: ["chess", "art", "cars", "dancing"], name: N4 }),
  D("{name}, I am really ______ this {thing}.", { name: P4, thing: ["book", "course", "job", "idea"] }),
  D("The {who} were not ______ the {thing}.", { who: ["children", "students", "boys", "guests"], thing: ["film", "museum", "lesson", "game"] }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const I2 = "Complete the sentence with the right form of the word in brackets and a preposition.";
const I1 = "Write the preposition.";
const W2 = "Interested (not interesting) describes the person, and it takes in: interested in.";
const B2 = (source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I2, source, key: ["interested", "in"], why: W2, slots });
const B1 = (source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I1, source, key: "in", why: W_IN, slots });
const BUILD = [
  B2("{name} is ______ ______ (interest) {topic}.", { name: ANY, topic: ["art", "science", "sport", "nature"] }),
  B2("My little {sib} is ______ ______ (interest) {things}.", { sib: ["brother", "sister", "cousin", "nephew"], things: ["dinosaurs", "trains", "animals", "robots"] }),
  B2("Are you ______ ______ (interest) the {thing}, {name}?", { thing: ["trip", "competition", "course", "job"], name: N4 }),
  B2("{name}, I am not ______ ______ (interest) {thing}.", { name: P4, thing: ["cartoons", "fashion", "shopping", "fishing"] }),
  B2("Our {teacher} is ______ ______ (interest) the history of {place}.", { teacher: ["teacher", "guide", "neighbour", "director"], place: ["Samarkand", "Bukhara", "Khiva", "our town"] }),
  B2("The {who} are ______ ______ (interest) {lang} culture.", { who: ["students", "tourists", "children", "visitors"], lang: ["Uzbek", "Korean", "Japanese", "Turkish"] }),
  B2("Is {name} ______ ______ (interest) our {club} club?", { name: ANY, club: ["chess", "drama", "English", "football"] }),
  B2("My {relative} was ______ ______ (interest) {subj} when he was young.", { relative: ["father", "uncle", "grandfather", "brother"], subj: ["maths", "physics", "music", "football"] }),
  B2("We are very ______ ______ (interest) your {thing}, {name}.", { thing: ["offer", "idea", "work", "plan"], name: N4 }),
  B2("{name} has always been ______ ______ (interest) {thing}.", { name: ANY, thing: ["cooking", "medicine", "space", "languages"] }),
  B2("Nobody was ______ ______ (interest) the {thing}, {name}.", { thing: ["old film", "long speech", "second game", "last lesson"], name: P4 }),
  B2("The {who} became ______ ______ (interest) {thing} after the trip.", { who: ["children", "boys", "girls", "students"], thing: ["history", "birds", "art", "the stars"] }),
  B1("{name} is interested ______ learning {lang}.", { name: ANY, lang: ["Korean", "German", "Arabic", "Turkish"] }),
  B1("What are you interested ______, {name}?", { name: N4 }),
  B1("My {relative} is interested ______ buying a new {thing}.", { relative: ["father", "uncle", "sister", "brother"], thing: ["car", "phone", "house", "bike"] }),
  B1("Which {things} is {name} interested ______?", { things: ["subjects", "sports", "books", "games"], name: ANY }),
  B1("{name}, are you interested ______ joining the {team}?", { name: N4, team: ["team", "club", "choir", "group"] }),
  B1("I am very interested ______ this {thing}, {name}.", { thing: ["topic", "book", "job", "city"], name: P4 }),
  B1("The {who} are not interested ______ {thing} at all.", { who: ["boys", "girls", "children", "students"], thing: ["the news", "old films", "opera", "golf"] }),
  B1("Is anybody interested ______ a game of {game}?", { game: ["chess", "football", "tennis", "cards"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const VERB = "Say the same thing with be interested in.";
const FIX = "Correct the mistake.";
const SAME = "Finish the second sentence so it means the same. Use interested in.";
const II = ["interested", "in"];
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // "interests me" / "finds it interesting" -> be interested in (5)
  T(VERB, "{name}, {topic} interests me a lot.", "{name}, I am very ______ ______ {topic}.", II, W2,
    { name: N4, topic: TOPIC }),
  T(VERB, "{name}, does {topic} interest you?", "{name}, are you ______ ______ {topic}?", II, W2,
    { name: N4, topic: ["chess", "art", "biology", "cooking"] }),
  T(VERB, "My {relative} says {things} don't interest him.", "My {relative} is not ______ ______ {things}.", II, W2,
    { relative: ["father", "uncle", "brother", "grandfather"], things: ["computers", "films", "cars", "games"] }),
  T(VERB, "{name} finds {topic} interesting.", "{name} is ______ ______ {topic}.", II, W2,
    { name: ANY, topic: ["history", "geography", "music", "science"] }),
  T(VERB, "The {who} find the new {thing} interesting.", "The {who} are ______ ______ the new {thing}.", II, W2,
    { who: ["students", "children", "boys", "girls"], thing: ["club", "course", "game", "project"] }),
  // correct a mistake (5)
  T(FIX, "I am interesting in {topic}, {name}.", "I am ______ in {topic}, {name}.", "interested", W_ED,
    { topic: TOPIC, name: P4 }),
  T(FIX, "She is interested on {topic}, {name}.", "She is interested ______ {topic}, {name}.", "in", W_IN,
    { topic: ["dancing", "painting", "medicine", "fashion"], name: N4 }),
  T(FIX, "They are interested for the {thing}.", "They are interested ______ the {thing}.", "in", W_IN,
    { thing: ["job", "flat", "course", "trip"] }),
  T(FIX, "{name} is interest in {topic}.", "{name} is ______ in {topic}.", "interested", W_ED,
    { name: ANY, topic: ["sport", "nature", "art", "cooking"] }),
  T(FIX, "Are you interested about {thing}, {name}?", "Are you interested ______ {thing}, {name}?", "in", W_IN,
    { thing: ["football", "chess", "music", "history"], name: N4 }),
  // same meaning (5)
  T(SAME, "{name} wants to know more about {topic}.", "{name} is ______ ______ {topic}.", II, W2,
    { name: ANY, topic: ["space", "animals", "computers", "history"] }),
  T(SAME, "{name}, I would like to learn about {topic}.", "{name}, I am ______ ______ learning about {topic}.", II, W2,
    { name: P4, topic: ["plants", "cars", "music", "medicine"] }),
  T(SAME, "My {relative} loves reading about {topic}.", "My {relative} is ______ ______ {topic}.", II, W2,
    { relative: ["father", "mother", "aunt", "brother"], topic: ["sport", "history", "nature", "science"] }),
  T(SAME, "The {who} asked many questions about the {thing}.", "The {who} were ______ ______ the {thing}.", II, W2,
    { who: ["children", "students", "tourists", "guests"], thing: ["museum", "old city", "factory", "farm"] }),
  T(SAME, "Nobody wants to hear about my {thing}, {name}.", "Nobody is ______ ______ my {thing}, {name}.", II, W2,
    { thing: ["trip", "idea", "problem", "story"], name: N4 }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you are interested in.", "interested in + noun or -ing", ["exactly one sentence", "must be about you", "must use interested in"]],
  ["Write one sentence about something you are not interested in.", "not interested in + noun", ["exactly one sentence", "must use not interested in", "must be about you"]],
  ["Write one sentence about what a person in your family is interested in.", "is interested in", ["exactly one sentence", "must name a family member", "must use interested in"]],
  ["Write a question to ask a new classmate about his or her interests. End it with the preposition.", "What are you interested in?", ["exactly one question", "must use interested in", "must end with in?"]],
  ["Write one sentence with interested in + an -ing form (learning, joining, visiting).", "interested in + -ing", ["exactly one sentence", "must use interested in", "must use an -ing form"]],
  ["Write one sentence about what you were interested in when you were a child.", "was interested in", ["exactly one sentence", "must use was interested in", "must be about your childhood"]],
  ["Write two sentences: one with interested and one with interesting about the same thing.", "interested (person) and interesting (thing)", ["exactly two sentences", "interested in for the person", "interesting for the thing"]],
  ["A friend wrote: \"I am very interesting on history.\" Write the sentence correctly.", "interested in history", ["exactly one sentence", "must use interested in", "must not use interesting"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What are you interested in? Write three or four sentences about your interests and why you like them.",
    "interested in + noun or -ing", ["interested in", "no interesting for a person", "a reason"]],
  ["Describe a friend or someone in your family. What is he or she interested in? Write three or four sentences.",
    "is interested in", ["is interested in", "in, not on or at", "at least two interests"]],
  ["What were you interested in as a child, and what are you interested in now? Write three or four sentences.",
    "was / am interested in", ["was interested in", "am interested in", "past and present"]],
  ["Which school subjects are you interested in, and which are you not interested in? Write three or four sentences.",
    "interested in / not interested in", ["interested in", "not interested in", "subjects named"]],
  ["A new club is opening at your school or in your town. Which clubs would students be interested in? Write three or four sentences.",
    "interested in + noun or -ing", ["interested in", "interested in + -ing", "in every time"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.dependent-prepositions.interested-in.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
