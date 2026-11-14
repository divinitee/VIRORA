// Hand-authored: prep-phrasal / time / in-on-at-contrast (A1).
// Path fill P11 (2026-11-14, Base44 AI, branch grammar-path-fill-3-base44).
//
// Placement focus: in / on / at contrast across time expressions
// ("The lesson is on Tuesday at 10 o'clock in the morning").
// This is the contrast stop of the time-preposition group (P7-P11): the keys
// MIX in, on and at, so the learner has to look at the kind of time word:
//   at = clock times, noon, midnight, night
//   on = days, day + part of day (Friday evening), dates (12 May), my birthday
//   in = months, seasons, years, the morning / afternoon / evening
// Every blank has one right answer. Left out on purpose because English
// varies or two answers are right: the weekend (at/on), Christmas-type
// holidays, in the night, during, by, from, until, around. No "on time /
// in time". Choose options are in / on / at / since; since is the Russian
// "с понедельника" error and every sentence is present, past or future simple
// / going to, so since is never right.
// Choose: one blank, one time expression, the key mixes in (7) / on (7) /
// at (6). Build: "Write at, in or on." 10 one-blank items and 10 items with
// two or three blanks (the placement's own shape: on Tuesday at ten o'clock
// in the morning). Each blank is a different kind of time word. No other
// in/on/at is printed in any one-blank build source or transform target.
// Transform: 5 correct the preposition / 5 answer a question (the time is in
// instr) / 5 change a word like tomorrow or tonight to the given time.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.time.in-on-at-contrast.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "time", topic: "in-on-at-contrast", level: "A1", pv: "2.5" };

const OPTS = ["in", "on", "at", "since"];
const K = { in: 0, on: 1, at: 2 };
const WHY = {
  clock: "A clock time takes at: at six o'clock, at half past seven.",
  noon: "Noon and midnight take at, like a clock time.",
  night: "Night takes at: at night (but in the morning, in the evening).",
  day: "A day takes on: on Saturday, on Tuesdays.",
  daypart: "A day + part of the day takes on: on Friday evening, on Sunday mornings.",
  date: "A date takes on: on 12 May.",
  special: "A special day takes on: on my birthday.",
  month: "A month takes in: in January.",
  season: "A season takes in: in summer, in spring.",
  year: "A year takes in: in 2009.",
  part: "Parts of the day take in: in the morning, in the evening (but at night).",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["{name}'s birthday party is ______ Saturday, {who}.", "on", "day",
    { name: ["Lola", "Aziz", "Timur", "Madina"], who: ["Mum", "Dad", "Olga", "Grandma"] }],
  ["My {who} gets up ______ six o'clock to make {food}.", "at", "clock",
    { who: ["mum", "grandma", "aunt", "father"], food: ["breakfast", "bread", "tea", "porridge"] }],
  ["We visit our grandparents in the {place} ______ summer, {name}.", "in", "season",
    { place: ["village", "mountains", "countryside", "valley"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["{name} was born ______ 2009 in {city}.", "in", "year",
    { name: ["Aziz", "Lola", "Timur", "Madina"], city: ["Tashkent", "Samarkand", "Namangan", "Fergana"] }],
  ["The {shop} near our house closes ______ midnight, {name}.", "at", "noon",
    { shop: ["pharmacy", "small shop", "cafe", "bakery"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["I have {lesson} with {teacher} ______ Tuesdays.", "on", "day",
    { lesson: ["piano lessons", "swimming lessons", "English lessons", "dance lessons"], teacher: ["Mr Karimov", "Ms Olga", "my aunt", "Mrs Rahimova"] }],
  ["{name} reads {book} ______ the evening.", "in", "part",
    { name: ["Grandpa", "Aziz", "Lola", "My sister"], book: ["a book", "comics", "the news", "stories"] }],
  ["Our {event} is ______ 12 May, {name}.", "on", "date",
    { event: ["school concert", "class trip", "sports day", "English exam"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["My {who} has lunch ______ noon in the {place}.", "at", "noon",
    { who: ["dad", "uncle", "mum", "brother"], place: ["office", "canteen", "kitchen", "garden"] }],
  ["Our family goes to the {place} ______ January, {name}.", "in", "month",
    { place: ["mountains", "village", "lake", "capital"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["The {show} starts ______ half past seven, {name}.", "at", "clock",
    { show: ["film", "match", "concert", "cartoon"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["{name} goes to the {place} ______ Sunday mornings.", "on", "daypart",
    { name: ["Grandpa", "Aziz", "Lola", "My uncle"], place: ["market", "bazaar", "pool", "park"] }],
  ["{name} can't sleep ______ night when the {room} is hot.", "at", "night",
    { name: ["Aziz", "Lola", "Grandpa", "My sister"], room: ["bedroom", "flat", "house", "room"] }],
  ["{who} calls us ______ Friday evening, {name}.", "on", "daypart",
    { who: ["Grandma", "Aunt Lola", "My uncle", "Grandpa"], name: ["Aziz", "Olga", "Timur", "Kamila"] }],
  ["{name} plays football with {who} ______ the afternoon.", "in", "part",
    { name: ["Aziz", "Timur", "My brother", "Sardor"], who: ["friends", "his cousins", "his classmates", "the neighbours"] }],
  ["The {thing} in our garden are beautiful ______ spring, {name}.", "in", "season",
    { thing: ["flowers", "trees", "roses", "apple trees"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["My {exam} is ______ Monday, {name}.", "on", "day",
    { exam: ["maths test", "English exam", "music exam", "history test"], name: ["Mum", "Dad", "Grandma", "Olga"] }],
  ["The {bus} to {city} leaves ______ 6:45.", "at", "clock",
    { bus: ["train", "bus", "minibus", "plane"], city: ["Bukhara", "Samarkand", "Namangan", "Fergana"] }],
  ["{who} always makes a big {cake} ______ my birthday.", "on", "special",
    { who: ["Grandma", "Mum", "My aunt", "Dad"], cake: ["cake", "chocolate cake", "honey cake", "fruit cake"] }],
  ["I drink {drink} ______ the morning, {name}.", "in", "part",
    { drink: ["green tea", "warm milk", "water", "black tea"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
].map(([prompt, k, w, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS, key: K[k], why: WHY[w], slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write at, in or on.";
const BUILD = [
  // one blank (10)
  ["{name} has {lesson} ______ Wednesday.", "on", WHY.day,
    { name: ["Aziz", "Lola", "Timur", "My sister"], lesson: ["a piano lesson", "a dance class", "a swimming lesson", "a maths test"] }],
  ["The {shop} opens ______ nine o'clock, {name}.", "at", WHY.clock,
    { shop: ["bakery", "pharmacy", "post office", "library"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["My {who} was born ______ 1965, {name}.", "in", WHY.year,
    { who: ["grandmother", "grandfather", "uncle", "aunt"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["Our family eats {food} together ______ the evening, {name}.", "in", WHY.part,
    { food: ["plov", "soup", "salad", "fish"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["{name} goes to bed ______ midnight, {who}.", "at", WHY.noon,
    { name: ["Aziz", "My brother", "Grandpa", "Lola"], who: ["Mum", "Dad", "Olga", "Timur"] }],
  ["{name} wears a warm {coat} ______ winter.", "in", WHY.season,
    { name: ["Grandpa", "Aziz", "Lola", "My sister"], coat: ["coat", "hat", "jacket", "scarf"] }],
  ["{name}'s family is moving to a new {home} ______ 5 September.", "on", WHY.date,
    { name: ["Lola", "Aziz", "Timur", "Madina"], home: ["flat", "house", "village", "town"] }],
  ["{who} calls me from {city} ______ Sunday evenings.", "on", WHY.daypart,
    { who: ["Grandma", "My aunt", "Uncle Bobur", "My cousin"], city: ["Moscow", "Seoul", "Kazan", "Almaty"] }],
  ["The {lesson} ends ______ a quarter past two, {name}.", "at", WHY.clock,
    { lesson: ["maths lesson", "English class", "art lesson", "music lesson"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["I feel {adj} ______ the morning, {name}.", "in", WHY.part,
    { adj: ["sleepy", "tired", "hungry", "cold"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  // two or three blanks (10)
  ["The {lesson} with {teacher} is ______ Tuesday ______ ten o'clock.", ["on", "at"],
    "Tuesday is a day, so on; ten o'clock is a clock time, so at.",
    { lesson: ["English lesson", "piano lesson", "maths test", "art class"], teacher: ["Mr Karimov", "Ms Olga", "Mrs Rahimova", "our new teacher"] }],
  ["We eat {food} for breakfast ______ seven ______ the morning, {name}.", ["at", "in"],
    "Seven is a clock time, so at; the morning is a part of the day, so in.",
    { food: ["eggs", "bread and honey", "porridge", "fruit"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["{name} goes to the {place} ______ Mondays ______ five o'clock.", ["on", "at"],
    "Mondays are days, so on; five o'clock is a clock time, so at.",
    { name: ["Aziz", "Lola", "My sister", "Timur"], place: ["pool", "gym", "library", "music school"] }],
  ["The {event} is ______ 8 May ______ six o'clock, {name}.", ["on", "at"],
    "8 May is a date, so on; six o'clock is a clock time, so at.",
    { event: ["school concert", "art show", "book fair", "dance show"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["My {who} works ______ night and sleeps ______ the morning, {name}.", ["at", "in"],
    "Night takes at; the morning is a part of the day, so in.",
    { who: ["uncle", "aunt", "mum", "neighbour"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["{name} was born ______ a {adj} Sunday ______ 2010.", ["on", "in"],
    "Sunday is a day, so on; 2010 is a year, so in.",
    { name: ["Lola", "Aziz", "My cousin", "Timur"], adj: ["sunny", "cold", "rainy", "windy"] }],
  ["The {bus} to {city} leaves ______ Friday ______ 6:30 ______ the morning.", ["on", "at", "in"],
    "Friday is a day (on), 6:30 is a clock time (at), the morning is a part of the day (in).",
    { bus: ["bus", "train", "minibus", "plane"], city: ["Bukhara", "Andijan", "Termez", "Samarkand"] }],
  ["My {who} has a {test} ______ Thursday ______ nine o'clock ______ the morning.", ["on", "at", "in"],
    "Thursday is a day (on), nine o'clock is a clock time (at), the morning is a part of the day (in).",
    { who: ["sister", "brother", "cousin", "friend"], test: ["maths test", "driving test", "piano exam", "history test"] }],
  ["The {shop} opens ______ eight o'clock ______ the morning ______ Saturdays, {name}.", ["at", "in", "on"],
    "Eight o'clock is a clock time (at), the morning is a part of the day (in), Saturdays are days (on).",
    { shop: ["bazaar", "bakery", "pool", "library"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["My {who} comes home from work ______ midnight ______ Fridays, {name}.", ["at", "on"],
    "Midnight takes at, like a clock time; Fridays are days, so on.",
    { who: ["dad", "uncle", "mum", "brother"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([source, key, why, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const ANS = (t) => `Answer the question. The time is: ${t}.`;
const CHG = (from, to) => `Change ${from} to ${to}. Rewrite the sentence.`;
const TRANSFORM = [
  // correct the preposition (5)
  [COR, "{name} has a {lesson} in Friday.", "{name} has a {lesson} ______ Friday.", "on",
    "Friday is a day, so use on, not in.", { name: ["Aziz", "Lola", "Timur", "My sister"], lesson: ["piano lesson", "dance class", "swimming lesson", "maths test"] }],
  [COR, "The {show} starts on eight o'clock, {name}.", "The {show} starts ______ eight o'clock, {name}.", "at",
    "Eight o'clock is a clock time, so use at, not on.", { show: ["film", "match", "concert", "cartoon"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [COR, "My {who} goes to {city} at June.", "My {who} goes to {city} ______ June.", "in",
    "June is a month, so use in, not at.", { who: ["uncle", "aunt", "brother", "sister"], city: ["Seoul", "Kazan", "Istanbul", "Almaty"] }],
  [COR, "We drink {drink} on the evening, {name}.", "We drink {drink} ______ the evening, {name}.", "in",
    "The evening is a part of the day, so use in, not on.", { drink: ["green tea", "warm milk", "black tea", "compote"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "{who}'s birthday party is in 20 August, {name}.", "{who}'s birthday party is ______ 20 August, {name}.", "on",
    "20 August is a date, so use on, not in.", { who: ["My cousin", "Aunt Lola", "Grandpa", "My sister"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  // answer a question (5)
  [ANS("7:30"), "{name}, what time does the {bus} leave?", "It leaves ______ 7:30.", "at",
    "7:30 is a clock time, so the answer uses at.", { name: ["Aziz", "Olga", "Timur", "Lola"], bus: ["bus", "train", "minibus", "plane"] }],
  [ANS("Thursday"), "When is your {exam}, {name}?", "It is ______ Thursday.", "on",
    "Thursday is a day, so the answer uses on.", { exam: ["maths test", "English exam", "history test", "music exam"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [ANS("2015"), "When did your family move to {city}, {name}?", "We moved there ______ 2015.", "in",
    "2015 is a year, so the answer uses in.", { city: ["Tashkent", "Samarkand", "Namangan", "Andijan"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [ANS("the afternoon"), "When do you play {sport}, {name}?", "I play it ______ the afternoon.", "in",
    "The afternoon is a part of the day, so the answer uses in.", { sport: ["football", "tennis", "chess", "basketball"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [ANS("midnight"), "When does {who} come home from {place}?", "He comes home ______ midnight.", "at",
    "Midnight takes at, like a clock time.", { who: ["your dad", "your uncle", "Mr Karimov", "your brother"], place: ["work", "the bakery", "the hospital", "the factory"] }],
  // change the time word (5)
  [CHG("tomorrow", "Saturday"), "We are going to the {place} tomorrow, {name}.", "We are going to the {place} ______ Saturday, {name}.", "on",
    "Saturday is a day, so it takes on. Tomorrow has no preposition.", { place: ["zoo", "bazaar", "mountains", "lake"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [CHG("tonight", "ten o'clock"), "{name} is calling {who} tonight.", "{name} is calling {who} ______ ten o'clock.", "at",
    "Ten o'clock is a clock time, so it takes at. Tonight has no preposition.", { name: ["Aziz", "Lola", "Timur", "Madina"], who: ["Grandma", "Uncle Bobur", "the doctor", "the teacher"] }],
  [CHG("this month", "August"), "My {who} is visiting us this month, {name}.", "My {who} is visiting us ______ August, {name}.", "in",
    "August is a month, so it takes in. This month has no preposition.", { who: ["aunt", "grandmother", "cousin", "uncle"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [CHG("today", "4 October"), "{name} is flying to {city} today.", "{name} is flying to {city} ______ 4 October.", "on",
    "4 October is a date, so it takes on. Today has no preposition.", { name: ["Aziz", "Lola", "My uncle", "Aunt Lola"], city: ["Kazan", "Istanbul", "Almaty", "Moscow"] }],
  [CHG("after dinner", "half past nine"), "{name} reads to {who} after dinner.", "{name} reads to {who} ______ half past nine.", "at",
    "Half past nine is a clock time, so it takes at.", { name: ["Grandma", "Mum", "Dad", "My sister"], who: ["the children", "the baby", "the little ones", "my little brother"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about when you get up on a school day. Use a clock time.", "at + clock time", ["exactly one sentence", "must use at + a time", "about you"]],
  ["Write one sentence about your favourite day of the week and what you do then.", "on + day", ["exactly one sentence", "must use on + a day", "about you"]],
  ["Write one sentence about the month of your birthday.", "in + month", ["exactly one sentence", "must use in + a month", "about you"]],
  ["Write one sentence about what your family does in the evening.", "in the evening", ["exactly one sentence", "must use in the evening", "a family word"]],
  ["Write one sentence about one of your lessons. Say the day and the time.", "on + day … at + time", ["exactly one sentence", "on + a day", "at + a clock time"]],
  ["Write one sentence about the year you were born or the year you started school.", "in + year", ["exactly one sentence", "must use in + a year", "about you"]],
  ["Write one question to a friend about their weekend plans. Use a day.", "on + day", ["exactly one question", "on + a day", "must end with a question mark"]],
  ["Write two sentences about your day: one with in the morning, one with at night.", "in the morning / at night", ["exactly two sentences", "in the morning in one", "at night in the other"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a normal school day: when you get up, when your lessons start and what you do in the evening.", "at / in", ["at + clock time", "in the morning / in the evening", "three or four sentences"]],
  ["Tell a new friend about your week: what you do on different days.", "on + days", ["on Monday …", "on Saturdays …", "three or four sentences"]],
  ["Write about your year: what your family does in different months or seasons.", "in + months / seasons", ["in + a month", "in summer / in winter", "three or four sentences"]],
  ["Invite a friend to your birthday party. Say the date, the day and the time.", "on + date / at + time", ["on + date or day", "at + clock time", "a friendly invitation"]],
  ["Tell a visitor about a special day in your family: when it is and what you do.", "in / on / at", ["at least two of in, on, at", "when it is", "what you do"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.time.in-on-at-contrast.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);