// Hand-authored: questions-negation / wh-questions / question-preposition (B1).
// Wave C, C6 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: the preposition is stranded at the END of an everyday
// wh-question ("Who are you waiting for?"), never dropped ("Who are you
// waiting?" is the Russian "Кого ты ждёшь?" / Uzbek "Kimni kutyapsan?"
// transfer) and not moved to the front ("For who are you waiting?").
// Choose: 12 items with the gap at the end (right preposition / none / two
// wrong ones) and 8 whole-frame items (stranded / fronted / statement order /
// no preposition). Every question has its answer after a dash so only one
// preposition fits ("— My keys. I can't find them." → look for, not at).
// Prepositions that could also be right are never offered as wrong: no
// "talk with", "think of", "wait on", "book on", "angry at"; "speak with" is
// accepted in the one typed item that uses speak.
// Build: the answer after the dash never contains the preposition (schema
// echo rule), and instr lists the choices (rule 3).
// Transform: 5 formal fronted → everyday stranded / 5 answer → question /
// 5 correct the mistake.
//
// Run: node tools/grammar-practice/authored/questions-negation.wh-questions.question-preposition.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "wh-questions", topic: "question-preposition", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAMEF = ["Olga", "Lola", "Madina", "Kamila"];
const CITY = ["Tashkent", "Bukhara", "Kazan", "Almaty"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const WHY = (vp) => `The verb is ${vp}. In a wh-question the preposition stays: it goes at the end of the question.`;
const FRAME = (vp) => `Question word + auxiliary + subject + verb, and the preposition of ${vp} goes at the end.`;

/* ---------------- choose: 20 mcq ---------------- */
// end-gap rows: ["end", right, [wrong1, wrong2], vp, prompt, slots]
// frame rows: ["frame", [stranded, fronted, statement, no-prep], vp, prompt, slots]
const CHOOSE = [
  ["end", "for", ["to", "at"], "wait for", "Who are you waiting ______, {name}? — My cousin. Her train is {late}.", { name: NAME, late: ["late", "very late", "late again", "an hour late"] }],
  ["end", "for", ["at", "to"], "look for", "What are you looking ______, {name}? — My {thing}. I can't find {it}.", { name: NAME, thing: ["phone", "passport", "wallet", "key"], it: ["it"] }],
  ["end", "to", ["at", "for"], "talk to", "Who did you talk ______ at the {event}? — {name}'s mother.", { event: ["party", "wedding", "meeting", "concert"], name: NAME }],
  ["end", "about", ["of", "with"], "be about", "What is this book ______, {name}? — It's a story of {topic}.", { name: NAME, topic: ["two brothers", "a long trip", "a small village", "an old ship"] }],
  ["end", "from", ["of", "in"], "be from", "Where is your new teacher ______, {name}? — {city}, I think.", { name: NAME, city: CITY }],
  ["end", "to", ["at", "for"], "belong to", "Who does this {thing} belong ______? — It's mine, {name}.", { thing: ["bag", "ball", "umbrella", "hat"], name: NAME }],
  ["end", "of", ["from", "about"], "be afraid of", "What are you afraid ______, {name}? — {thing}!", { name: NAME, thing: ["Spiders", "Snakes", "Big dogs", "The dark"] }],
  ["end", "to", ["in", "at"], "go to", "Which school did you go ______, {name}? — School number {n}.", { name: NAME, n: ["5", "12", "21", "40"] }],
  ["end", "about", ["for", "at"], "think about", "What are you thinking ______, {name}? — My {test} tomorrow.", { name: NAME, test: ["exam", "test", "interview", "match"] }],
  ["end", "with", ["to", "at"], "go with", "Who are you going to the {event} ______? — My sister, {name}.", { event: ["party", "concert", "match", "wedding"], name: NAME }],
  ["end", "in", ["on", "for"], "be interested in", "What are you interested ______, {name}? — {subject}.", { name: NAME, subject: ["History", "Music", "Football", "Cooking"] }],
  ["end", "from", ["of", "by"], "get from", "Who did you get this present ______? — My {who}. She sent it, {name}.", { who: ["aunt", "grandmother", "sister", "teacher"], name: NAME }],
  ["frame", ["What are you listening to", "To what are you listening", "What you are listening to", "What are you listening"], "listen to", "______? — I'm listening to {music}, {name}.", { music: ["the radio", "a podcast", "an old song", "the news"], name: NAME }],
  ["frame", ["What are you talking about", "About what are you talking", "What you are talking about", "What are you talking"], "talk about", "______? — We're talking about the {topic}, {name}.", { topic: ["trip", "match", "exam", "party"], name: NAME }],
  ["frame", ["Who does she live with", "With who does she live", "Who she lives with", "Who does she live"], "live with", "______? — She lives with her {who}, {name}.", { who: ["aunt", "grandparents", "parents", "sister"], name: NAME }],
  ["frame", ["Who is this letter from", "From who is this letter", "Who this letter is from", "Who is this letter"], "be from", "______? — It's from your {who}, {name}.", { who: ["bank", "school", "uncle", "teacher"], name: NAME }],
  ["frame", ["What are you looking for", "For what are you looking", "What you are looking for", "What are you looking"], "look for", "______? — I'm looking for my {thing}, {name}.", { thing: ["glasses", "keys", "shoes", "gloves"], name: NAME }],
  ["frame", ["Who does he work for", "For who does he work", "Who he works for", "Who does he work"], "work for", "______? — He works for a {company}, {name}.", { company: ["bank", "big hotel", "travel company", "TV channel"], name: NAME }],
  ["frame", ["What are you worried about", "About what are you worried", "What you are worried about", "What are you worried"], "be worried about", "______? — I'm worried about my {test}, {name}.", { test: ["exam", "test", "interview", "grades"], name: NAME }],
  ["frame", ["What are they laughing at", "At what are they laughing", "What they are laughing at", "What are they laughing"], "laugh at", "______? — They're laughing at a funny {thing}, {name}.", { thing: ["video", "photo", "story", "cartoon"], name: NAME }],
].map((row, i) => {
  if (row[0] === "end") {
    const [, right, wrong, vp, prompt, slots] = row;
    const options = rot([right, "–", ...wrong], i);
    return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(right), why: WHY(vp), slots: pick(prompt, slots) };
  }
  const [, opts, vp, prompt, slots] = row;
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: FRAME(vp), slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the preposition that ends the question: for, to, about, with, from, at, of, in or on.";
const BUILD = [
  ["to", "talk to", "Who is {name} talking ______? — Her {who}.", { name: NAMEF, who: ["teacher", "mother", "boss", "neighbour"] }],
  ["for", "look for", "What are you looking ______, {name}? — My glasses. I can't find them.", { name: NAME }],
  ["with", "go with", "Who did you go to the {place} ______, {name}? — My brother.", { place: ["bazaar", "cinema", "park", "museum"], name: NAME }],
  ["about", "be about", "What is the film ______, {name}? — Two {who} and a lost dog.", { name: NAME, who: ["brothers", "friends", "sisters", "boys"] }],
  ["from", "be from", "Where is your new teacher ______, {name}? — {city}.", { name: NAME, city: CITY }],
  ["to", "belong to", "Who does this {thing} belong ______, {name}? — My little sister.", { thing: ["bag", "ball", "phone", "hat"], name: NAME }],
  ["of", "be afraid of", "What is your brother afraid ______, {name}? — Dogs and {thing}.", { name: NAME, thing: ["spiders", "snakes", "the dark", "big waves"] }],
  ["for", "wait for", "Who are you waiting ______, {name}? — My cousin. Her bus is {late}.", { name: NAME, late: ["late", "very late", "late again", "an hour late"] }],
  ["about", "be worried about", "What are you so worried ______, {name}? — My {test} tomorrow.", { name: NAME, test: ["exam", "test", "interview", "match"] }],
  ["for", "buy for", "Who did you buy these {things} ______? — My mum. It's her birthday, {name}.", { things: ["flowers", "sweets", "cups", "books"], name: NAME }],
  ["in", "be interested in", "What are you interested ______, {name}? — Music and {subject}.", { name: NAME, subject: ["art", "history", "sport", "films"] }],
  ["from", "be from", "Who is this message ______, {name}? — Your {who} sent it.", { name: NAME, who: ["teacher", "boss", "brother", "aunt"] }],
  ["on", "live on", "Which floor do you live ______, {name}? — The {n} floor.", { name: NAME, n: ["third", "fifth", "ninth", "second"] }],
  ["at", "laugh at", "What are the children laughing ______? — A funny {animal} video, {name}.", { animal: ["cat", "dog", "parrot", "goat"], name: NAME }],
  ["with", "have lunch with", "Who did you have lunch ______ {when}? — My friends from {place}.", { when: ["today", "yesterday", "on Sunday", "after class"], place: ["school", "work", "college", "the club"] }],
  ["to", "apply to", "Which university did your sister apply ______, {name}? — One in {city}.", { name: NAME, city: ["Seoul", "Kazan", "Tashkent", "Istanbul"] }],
  ["to", "listen to", "What kind of music do you listen ______, {name}? — Mostly {genre}.", { name: NAME, genre: ["pop", "jazz", "rap", "folk music"] }],
  ["with", "dance with", "Who did you dance ______ at the {event}? — My cousin {name}.", { event: ["wedding", "party", "concert", "festival"], name: NAME }],
  ["at", "get off at", "Which stop do I get off ______ for the {place}, {name}? — The next one.", { place: ["bazaar", "museum", "station", "hospital"], name: NAME }],
  ["to", "write to", "Who are you writing ______, {name}? — My grandmother in {city}.", { name: NAME, city: CITY }],
].map(([key, vp, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY(vp), slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FORM = "Make the question everyday English: put the preposition at the end.";
const ASK = "Write the question for this answer.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // formal / fronted -> stranded (5)
  [FORM, "For whom are you waiting at the {place}, {name}?", "______ are you waiting ______ at the {place}, {name}?", ["Who", "for"], WHY("wait for"), { place: ["station", "gate", "bus stop", "door"], name: NAME }],
  [FORM, "About what are you and {who} talking, {name}?", "______ are you and {who} talking ______, {name}?", ["What", "about"], WHY("talk about"), { who: ["your sister", "Dad", "the teacher", "your friend"], name: NAMEF }],
  [FORM, "With whom does your sister live in {city}, {name}?", "______ does your sister live ______ in {city}, {name}?", ["Who", "with"], WHY("live with"), { city: CITY, name: NAME }],
  [FORM, "To whom does this {thing} belong, {name}?", "______ does this {thing} belong ______, {name}?", ["Who", "to"], WHY("belong to"), { thing: ["bag", "bike", "jacket", "phone"], name: NAME }],
  [FORM, "From where is your new {who}, {name}?", "______ is your new {who} ______, {name}?", ["Where", "from"], WHY("be from"), { who: ["friend", "teacher", "neighbour", "coach"], name: NAME }],
  // answer -> question (5)
  [ASK, "I'm looking at the {thing}, {name}.", "______ are you looking ______, {name}?", ["What", "at"], WHY("look at"), { thing: ["map", "clock", "board", "photo"], name: NAME }],
  [ASK, "She's talking to her {who}, {name}.", "______ is she talking ______, {name}?", ["Who", "to"], WHY("talk to"), { who: ["coach", "teacher", "mother", "boss"], name: NAME }],
  [ASK, "We're worried about the {test}, {name}.", "______ are you worried ______, {name}?", ["What", "about"], WHY("be worried about"), { test: ["exam", "test", "match", "interview"], name: NAME }],
  [ASK, "He comes from {city}, {name}.", "______ does he come ______, {name}?", ["Where", "from"], WHY("come from"), { city: CITY, name: NAME }],
  [ASK, "They're listening to {music}, {name}.", "______ are they listening ______, {name}?", ["What", "to"], WHY("listen to"), { music: ["the radio", "a podcast", "the news", "an old song"], name: NAME }],
  // correct the mistake (5)
  [COR, "Who are you waiting, {name}? Everyone is {where}.", "Who are you waiting ______, {name}? Everyone is {where}.", "for", WHY("wait for"), { name: NAME, where: ["here", "in the car", "at the table", "ready"] }],
  [COR, "What are you looking, {name}? Did you lose your {thing}?", "What are you looking ______, {name}? Did you lose your {thing}?", "for", WHY("look for"), { name: NAME, thing: ["key", "phone", "pen", "ticket"] }],
  [COR, "With who did you go to the {event}, {name}?", "______ did you go to the {event} ______, {name}?", ["Who", "with"], WHY("go with"), { event: ["party", "concert", "match", "wedding"], name: NAME }],
  [COR, "Who did you speak at the {place}, {name}?", "Who did you speak ______ at the {place}, {name}?", "to", WHY("speak to"), { place: ["bank", "hotel", "office", "station"], name: NAME }],
  [COR, "About what was the {film}, {name}?", "What was the {film} ______, {name}?", "about", WHY("be about"), { film: ["film", "book", "lesson", "talk"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots),
  ...(key === "to" && /speak/.test(source) ? { acceptable: ["with"] } : {}),
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write a question to ask a friend what music they listen to.", "What … do you listen to?", ["exactly one question", "listen to", "the preposition at the end"]],
  ["Write a question to ask someone where they are from.", "Where are you from?", ["exactly one question", "be from", "the preposition at the end"]],
  ["Write a question to ask a classmate what they are worried about this week.", "What are you worried about …?", ["exactly one question", "worried about", "the preposition at the end"]],
  ["Write a question to ask who a friend lives with.", "Who do you live with?", ["exactly one question", "live with", "the preposition at the end"]],
  ["Write a question to ask what a film or book is about.", "What is … about?", ["exactly one question", "be about", "the preposition at the end"]],
  ["Write a question to ask who a friend is waiting for.", "Who are you waiting for?", ["exactly one question", "wait for", "the preposition at the end"]],
  ["Write a question to ask what someone is interested in.", "What are you interested in?", ["exactly one question", "interested in", "the preposition at the end"]],
  ["Write two questions for a new classmate. Each one ends with a preposition.", "Where …? / Who … with?", ["exactly two questions", "two different prepositions", "each preposition at the end"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write four questions to interview a new student in your class.", "Where are you from? / Who do you live with? …", ["questions ending in a preposition", "at least three different verbs", "four questions"]],
  ["Your friend looks sad. Write a short chat: ask what is wrong and who can help.", "What are you worried about? / Who can you talk to?", ["questions ending in a preposition", "a short answer to each", "three or four lines"]],
  ["Write questions to ask a friend about a film they saw.", "What was it about? / Who did you go with?", ["questions ending in a preposition", "past tense", "three or four questions"]],
  ["Write questions to ask your grandparents about when they were young.", "Who did you live with? / What were you afraid of?", ["questions ending in a preposition", "past tense", "three or four questions"]],
  ["Write questions for a short quiz about music for your class.", "Who do you listen to? / What is this song about?", ["questions ending in a preposition", "different prepositions", "three or four questions"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/questions-negation.wh-questions.question-preposition.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);