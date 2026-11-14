// Hand-authored: prep-phrasal / time / on-days (A1).
// Path fill P8 (2026-11-14, Base44 AI, branch grammar-path-fill-2-base44).
//
// Placement focus: on with days ("We have English on Monday").
// Sibling scope (P7-P11): every key here is ON + a DAY (Monday, on Fridays,
// on Saturday morning, on Sunday evenings, on a Monday). No clock times
// (at-clock, P7), no months (in-months, P9), no "at night" (P10) and no mixed
// in/on/at sentences (in-on-at-contrast, P11). The day is the only time marker
// in each sentence and is never slotted.
// Distractors: in (Russian "в понедельник") and at, plus since (Russian
// "с понедельника"), with present or past simple only, so since is never
// right. Never by / until / from / before / after, and no "no preposition"
// option ("See you Monday" is fine in American English).
// Build: "Write at, in or on." (closed class, choice in instr). No other "on"
// in any build source or transform target (no on TV, on the bus, on time).
// Transform: 5 correct in / at -> on / 5 answer a When ...? question with the
// day given / 5 swap today / tomorrow for the day's name.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.time.on-days.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "time", topic: "on-days", level: "A1", pv: "2.5" };

const OPTS = ["on", "in", "at", "since"];
const W = (d) => `${d} is a day, so use on: on ${d}. In and at are not used before the name of a day.`;
const WP = (d) => `${d} means a day of the week (every week), and days take on: on ${d}.`;
const WM = (d) => `${d} is one day and a part of it. With the name of a day, use on: on ${d}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [W("Monday"), "{name} has {lesson} ______ Monday.",
    { name: ["Aziz", "Lola", "Timur", "Madina"], lesson: ["a piano lesson", "football practice", "a maths test", "a dance class"] }],
  [WP("Sundays"), "My {who} visit us ______ Sundays. They always bring {food}.",
    { who: ["grandparents", "cousins", "aunt and uncle", "neighbours"], food: ["fruit", "bread", "cakes", "sweets"] }],
  [W("Tuesday"), "The {place} is closed ______ Tuesday, {name}.",
    { place: ["museum", "library", "swimming pool", "bakery"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [WM("Saturday morning"), "Let's go to the {place} ______ Saturday morning, {name}!",
    { place: ["park", "mountains", "lake", "bazaar"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [WP("Fridays"), "{name} helps Mum clean the {room} ______ Fridays.",
    { name: ["Aziz", "Lola", "Timur", "Madina"], room: ["house", "kitchen", "yard", "flat"] }],
  [W("Thursday"), "Our school {event} is ______ Thursday. Please come, {name}.",
    { event: ["concert", "show", "sports day", "fair"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  [WP("Wednesday evenings"), "I play {sport} with my {who} ______ Wednesday evenings.",
    { sport: ["football", "basketball", "chess", "volleyball"], who: ["friends", "brother", "cousins", "classmates"] }],
  [W("Sunday"), "My {who}'s birthday party is ______ Sunday. Can you come, {name}?",
    { who: ["sister", "brother", "cousin", "best friend"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [WP("Saturdays"), "{dad} doesn't work ______ Saturdays. He stays at home with {who}.",
    { dad: ["Dad", "My uncle", "Mr Karimov", "Grandpa"], who: ["us", "his family", "the children", "Grandma"] }],
  [WP("Mondays"), "The {bus} to the village only goes ______ Mondays, {name}.",
    { bus: ["bus", "minibus", "train", "old bus"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [WP("Sunday mornings"), "{who} go to the bazaar ______ Sunday mornings to buy {food}.",
    { who: ["We", "My parents", "Grandma and I", "Our neighbours"], food: ["fruit", "vegetables", "meat", "bread"] }],
  [W("Tuesday"), "{name} was ill ______ Tuesday, so she missed the {lesson}.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], lesson: ["test", "English lesson", "trip", "concert"] }],
  [W("Wednesday"), "Our new {subject} teacher starts ______ Wednesday, {name}.",
    { subject: ["English", "maths", "music", "art"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [WM("Friday afternoon"), "Can you call me ______ Friday afternoon, {name}? I need help with my {thing}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], thing: ["homework", "English", "maths", "computer"] }],
  [WP("Saturdays"), "The {shop} is very busy ______ Saturdays, {name}.",
    { shop: ["bazaar", "big shop", "bakery", "bus station"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [W("Monday"), "We had a {test} ______ Monday, and I got a {grade}.",
    { test: ["maths test", "spelling test", "history test", "quiz"], grade: ["good mark", "high score", "very good mark", "good result"] }],
  [W("Thursday"), "My {who} comes back from {city} ______ Thursday.",
    { who: ["dad", "uncle", "sister", "aunt"], city: ["Seoul", "Kazan", "Istanbul", "Almaty"] }],
  [W("Sunday"), "There is no school ______ Sunday, so {name} and I can go to the {place}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], place: ["village", "river", "mountains", "zoo"] }],
  [WM("Saturday evening"), "The football final is ______ Saturday evening. {name} has tickets for {who}.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], who: ["us", "the family", "his friends", "everyone"] }],
  [W("Tuesday"), "{name}, we have a {meeting} ______ Tuesday at the school.",
    { name: ["Mum", "Dad", "Grandma", "Aunt Lola"], meeting: ["parents' meeting", "class meeting", "school concert", "sports day"] }],
].map(([why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write at, in or on.";
const B = (d) => `${d}: the name of a day takes on.`;
const BUILD = [
  [B("Tuesdays"), "{name} goes swimming ______ Tuesdays with her {who}.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], who: ["sister", "mother", "friends", "cousin"] }],
  [B("Sunday"), "Our family has a big lunch ______ Sunday. {who} cooks it.",
    { who: ["Grandma", "Mum", "Dad", "My aunt"] }],
  [B("Saturday"), "We visit Grandma ______ Saturday. She makes {food} for us, {name}.",
    { food: ["plov", "samsa", "soup", "cakes"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [B("Wednesday afternoon"), "{name}'s {class} is ______ Wednesday afternoon.",
    { name: ["Lola", "Aziz", "Olga", "Timur"], class: ["dance class", "art club", "chess club", "piano lesson"] }],
  [B("Fridays"), "My {who} doesn't cook ______ Fridays, so we eat {food}.",
    { who: ["mum", "dad", "aunt", "grandma"], food: ["sandwiches", "soup", "eggs", "salad"] }],
  [B("Monday"), "The {test} is ______ Monday. Let's study together, {name}.",
    { test: ["maths test", "English test", "exam", "history test"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [B("Thursdays"), "I meet my {who} in the {place} ______ Thursdays.",
    { who: ["friends", "cousins", "classmates", "best friend"], place: ["park", "library", "yard", "cafe"] }],
  [B("Saturday morning"), "{who} go to the village ______ Saturday morning.",
    { who: ["We", "My parents", "Grandpa and I", "The children"] }],
  [B("Friday"), "{name}, there is a {event} at school ______ Friday.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], event: ["concert", "party", "football match", "show"] }],
  [B("Sundays"), "Dad washes the car ______ Sundays, and {who} helps him.",
    { who: ["my brother", "Timur", "my sister", "Grandpa"] }],
  [B("Tuesday"), "We had a {event} ______ Tuesday. It was {adj}.",
    { event: ["picnic", "party", "trip", "concert"], adj: ["fun", "great", "really good", "very long"] }],
  [B("Wednesday"), "We have {subject} ______ Wednesday, {name}.",
    { subject: ["art", "music", "sport", "history"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  [B("Mondays"), "The {shop} near the {place} is closed ______ Mondays.",
    { shop: ["bakery", "barber's", "flower shop", "pharmacy"], place: ["station", "school", "park", "bus stop"] }],
  [B("Friday"), "Bring your {thing} to school ______ Friday, {name}.",
    { thing: ["football boots", "swimming things", "paints", "sports bag"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [B("Sunday evening"), "My {who} arrive from {city} ______ Sunday evening.",
    { who: ["cousins", "grandparents", "aunt and uncle", "friends"], city: ["Khiva", "Termez", "Kazan", "Almaty"] }],
  [B("Thursdays"), "{name} cooks {meal} for the family ______ Thursdays.",
    { name: ["Aziz", "Lola", "Grandpa", "My sister"], meal: ["dinner", "plov", "soup", "lunch"] }],
  [B("Saturday"), "Is the {place} open ______ Saturday, {name}?",
    { place: ["post office", "bank", "pharmacy", "library"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [B("Friday"), "{name}, the new {film} comes out ______ Friday.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], film: ["film", "cartoon", "game", "song"] }],
  [B("Tuesday morning"), "{name}, I have a {thing} ______ Tuesday morning.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], thing: ["doctor's appointment", "dentist appointment", "job interview", "piano lesson"] }],
  [B("Sunday afternoons"), "{who} plays {game} with Grandpa ______ Sunday afternoons.",
    { who: ["Aziz", "My brother", "Lola", "Timur"], game: ["chess", "cards", "dominoes", "backgammon"] }],
].map(([why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "on", why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const ANS = (d) => `Answer the question. The day is ${d}.`;
const DAY = (rel, d) => `${rel} is ${d}. Rewrite the sentence with the name of the day.`;
const TRANSFORM = [
  // correct in / at -> on (5)
  [COR, "{name} has a {lesson} in Monday.", "{name} has a {lesson} ______ Monday.",
    "Monday is a day, so use on, not in.", { name: ["Aziz", "Lola", "Timur", "Madina"], lesson: ["piano lesson", "maths test", "dance class", "swimming lesson"] }],
  [COR, "We go to the {place} at Saturday, {name}.", "We go to the {place} ______ Saturday, {name}.",
    "Saturday is a day, so use on, not at.", { place: ["park", "lake", "bazaar", "zoo"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [COR, "My {who} visits us in Sundays with {food}.", "My {who} visits us ______ Sundays with {food}.",
    "Sundays are days, so use on, not in.", { who: ["grandma", "aunt", "uncle", "cousin"], food: ["fruit", "bread", "cakes", "samsa"] }],
  [COR, "The {event} is at Friday evening, {name}.", "The {event} is ______ Friday evening, {name}.",
    "Friday evening is part of a named day, so use on, not at.", { event: ["concert", "party", "match", "school show"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "{who} doesn't work in Sunday, so we go to the {place}.", "{who} doesn't work ______ Sunday, so we go to the {place}.",
    "Sunday is a day, so use on, not in.", { who: ["Dad", "Mum", "My uncle", "Aunt Lola"], place: ["park", "village", "river", "mountains"] }],
  // answer a When ...? question (5)
  [ANS("Tuesday"), "{name}, when is the {event}?", "It is ______ Tuesday.",
    "Tuesday is a day, so the answer uses on.", { name: ["Aziz", "Olga", "Mum", "Dad"], event: ["concert", "test", "trip", "meeting"] }],
  [ANS("Saturdays"), "When do you play {sport}, {name}?", "I play {sport} ______ Saturdays.",
    "Saturdays are days, so the answer uses on.", { sport: ["football", "chess", "tennis", "basketball"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [ANS("Sunday"), "When does {name} visit her grandmother in {city}?", "She goes there ______ Sunday.",
    "Sunday is a day, so the answer uses on.", { name: ["Lola", "Madina", "Olga", "Kamila"], city: ["Khiva", "Bukhara", "Andijan", "Termez"] }],
  [ANS("Mondays"), "Which day is the {place} closed, {name}?", "It is closed ______ Mondays.",
    "Mondays are days, so the answer uses on.", { place: ["museum", "library", "swimming pool", "zoo"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [ANS("Friday evening"), "{name}, when is {who}'s birthday party?", "It is ______ Friday evening.",
    "Friday evening is part of a named day, so the answer uses on.", { name: ["Aziz", "Olga", "Mum", "Dad"], who: ["your sister", "your cousin", "Grandpa", "Aunt Lola"] }],
  // today / tomorrow -> the day's name (5)
  [DAY("Tomorrow", "Thursday"), "We have a {test} tomorrow, {name}.", "We have a {test} ______ Thursday, {name}.",
    "Tomorrow becomes the name of a day, Thursday, so use on.", { test: ["maths test", "spelling test", "quiz", "history test"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [DAY("Today", "Saturday"), "{name} is going to the {place} today.", "{name} is going to the {place} ______ Saturday.",
    "Today becomes the name of a day, Saturday, so use on.", { name: ["Aziz", "Lola", "Grandpa", "My sister"], place: ["park", "bazaar", "village", "zoo"] }],
  [DAY("Tomorrow", "Friday"), "The {event} is tomorrow evening, {name}.", "The {event} is ______ Friday evening, {name}.",
    "Tomorrow evening becomes Friday evening, part of a named day, so use on.", { event: ["concert", "party", "school show", "match"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [DAY("Today", "Sunday"), "My {who} comes back from {city} today.", "My {who} comes back from {city} ______ Sunday.",
    "Today becomes the name of a day, Sunday, so use on.", { who: ["dad", "uncle", "sister", "aunt"], city: ["Seoul", "Kazan", "Istanbul", "Almaty"] }],
  [DAY("Tomorrow", "Wednesday"), "Let's go to the {place} tomorrow, {name}.", "Let's go to the {place} ______ Wednesday, {name}.",
    "Tomorrow becomes the name of a day, Wednesday, so use on.", { place: ["cinema", "pool", "library", "river"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([instr, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: "on", why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a lesson or class you have on one day of the week.", "on + day", ["exactly one sentence", "must use on + a day", "about you"]],
  ["Write one sentence about what your family does on Sundays.", "on Sundays", ["exactly one sentence", "must use on Sundays", "about your family"]],
  ["Invite a friend to do something with you. Say the day.", "Let's … on …", ["exactly one sentence", "must use on + a day", "an activity"]],
  ["Write one question to a friend about what they do on Saturday.", "What do you do on …?", ["exactly one question", "must use on + a day", "must end with a question mark"]],
  ["Write one sentence about the day you like best and why.", "on + day", ["exactly one sentence", "must use on + a day", "must say why"]],
  ["Write one sentence about a shop, market or place in your town that is closed on one day.", "closed on + day", ["exactly one sentence", "must use on + a day", "a place in your town"]],
  ["Write one sentence about something you do on a day and a part of it, like Friday evening.", "on + day + morning / afternoon / evening", ["exactly one sentence", "on + day + part of the day", "about you"]],
  ["Write two sentences about two different days of your week.", "on + day (×2)", ["exactly two sentences", "on in both sentences", "two different days"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your week. Say what you do on three or four different days.", "on + days", ["on Monday …", "on + three or four days", "I have / I go / I play"]],
  ["A new classmate asks about your timetable. Tell them which lessons you have on which days.", "on + days", ["We have … on …", "on + days", "lesson names"]],
  ["Write a message to a friend and plan a trip for next weekend. Say the day and what you will do.", "on Saturday / on Sunday", ["Let's go … on …", "a place", "on + a day"]],
  ["Tell a friend about your family's weekend: what happens on Saturday and on Sunday.", "on Saturday / on Sunday", ["on Saturday …", "on Sunday …", "family words"]],
  ["Write about your favourite day of the week. What do you do on that day, and why do you like it?", "on + day", ["on + a day", "because …", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.time.on-days.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);