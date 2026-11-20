// Hand-authored: prep-phrasal / time / since-for (A2).
// Path fill P53 (Claude lane, branch grammar-path-fill-claude, 17 Nov 2026).
//
// Tests the TIME MEANING only (HANDOFF rule 14): since + a START point
// (since 2020, since Monday, since I was a child), for + a LENGTH of time
// (for five years, for ages). The placement item: "I have lived here ______
// 2020" with for / during / from as wrong answers.
//
// Every sentence is already in the present perfect and the verb is printed:
// the learner never chooses a tense (tenses.perfect.for-since does that).
// Slots change the time expression only WITHIN its type (a year for a year,
// a number of days for a number of days), so the key never moves.
// Wrong answers: the other word, from (L1 transfer) and during. "in" is never
// offered: "I haven't seen him in years" is correct English.
// Typed stages: a key may not repeat a printed word, so no sentence with a
// for-key prints another "for" (no "waited for the bus").
//
// Run: node tools/grammar-practice/authored/prep-phrasal.time.since-for.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "time", topic: "since-for", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const ANY = ["Aziz", "Lola", "Madina", "Timur"];
const F4 = ["Lola", "Madina", "Kamila", "Nodira"];
const CITY = ["Tashkent", "Samarkand", "Bukhara", "Fergana"];
const DAYS = ["Monday", "Tuesday", "Friday", "Sunday"];
const WS = "Since goes with the START point: the moment when it began.";
const WF = "For goes with the LENGTH of time: how long it has continued.";

/* ---------------- choose: 20 mcq ---------------- */
const S = (prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: ["since", "for", "from", "during"], key: 0, why: WS, slots });
const F = (prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: ["for", "since", "during", "from"], key: 0, why: WF, slots });
const CHOOSE = [
  S("We have lived in this {home} ______ {year}.", { home: ["flat", "house", "street", "village"], year: ["2018", "2020", "2021", "2023"] }),
  S("I haven't seen {name} ______ {day}.", { name: ANY, day: ["Monday", "Tuesday", "Friday", "last Sunday"] }),
  S("{name} has had this {thing} ______ her birthday.", { name: F4, thing: ["phone", "bike", "watch", "bag"] }),
  S("My {relative} has worked at the {place} ______ {month}.", { relative: ["father", "aunt", "sister", "uncle"], place: ["bank", "hospital", "school", "factory"], month: ["March", "June", "September", "January"] }),
  S("It has rained ______ {time}, {name}.", { time: ["this morning", "last night", "eight o'clock", "yesterday"], name: N4 }),
  S("{name} has known Timur ______ they were {age}.", { name: ["Aziz", "Lola", "Madina", "Bobur"], age: ["children", "five", "in the first class", "little"] }),
  S("The {shop} has been closed ______ last {period}.", { shop: ["shop", "library", "pool", "museum"], period: ["week", "month", "Friday", "summer"] }),
  S("I have been at {place} ______ {time} this morning, {name}.", { place: ["school", "work", "the library", "the gym"], time: ["seven", "eight", "nine", "half past seven"], name: P4 }),
  S("My {relative} has played {game} ______ he was a boy.", { relative: ["father", "uncle", "grandfather", "brother"], game: ["chess", "football", "tennis", "the dutar"] }),
  S("We haven't eaten anything ______ {meal}, {name}.", { meal: ["breakfast", "lunch", "last night", "this morning"], name: P4 }),
  F("My family has lived in {city} ______ {n} years.", { city: CITY, n: ["two", "five", "ten", "twenty"] }),
  F("{name} has been ill ______ {n} days.", { name: ANY, n: ["two", "three", "four", "five"] }),
  F("I have had this {thing} ______ a long time, {name}.", { thing: ["bag", "phone", "bike", "jacket"], name: N4 }),
  F("We have been at the {stop} ______ {n} minutes.", { stop: ["bus stop", "station", "airport", "door"], n: ["ten", "twenty", "thirty", "forty"] }),
  F("My {relative} has been a {job} ______ {n} years.", { relative: ["father", "aunt", "uncle", "mother"], job: ["teacher", "driver", "doctor", "farmer"], n: ["six", "eight", "fifteen", "thirty"] }),
  F("{name} hasn't eaten ______ {n} hours.", { name: ANY, n: ["five", "six", "eight", "ten"] }),
  F("They have been friends ______ {period}, {name}.", { period: ["ages", "many years", "a long time", "six months"], name: N4 }),
  F("The {thing} has been broken ______ {n} weeks.", { thing: ["lift", "printer", "TV", "washing machine"], n: ["two", "three", "four", "six"] }),
  F("I have studied English ______ {period}, {name}.", { period: ["a year", "two years", "six months", "three months"], name: N4 }),
  F("{name} has worn glasses ______ {period}.", { name: ANY, period: ["a month", "a year", "two years", "a few weeks"] }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write since or for.";
const bs = (source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "since", why: WS, slots });
const bf = (source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "for", why: WF, slots });
const BUILD = [
  bs("{name}, I have been here ______ {time}.", { name: N4, time: ["six o'clock", "noon", "this morning", "Monday"] }),
  bs("{name} has lived in {city} ______ {year}.", { name: ANY, city: CITY, year: ["2016", "2019", "2022", "2024"] }),
  bs("We have had our {pet} ______ {month}.", { pet: ["dog", "cat", "parrot", "rabbit"], month: ["May", "August", "October", "December"] }),
  bs("My {relative} has been in hospital ______ {day}.", { relative: ["grandfather", "aunt", "uncle", "grandmother"], day: DAYS }),
  bs("The {who} have been on holiday ______ last {day}.", { who: ["children", "students", "teachers", "neighbours"], day: ["Friday", "Saturday", "Monday", "week"] }),
  bs("I haven't had a {thing} ______ I was {n}.", { thing: ["bike", "pet", "dog", "party"], n: ["ten", "twelve", "eight", "six"] }),
  bs("{name} has been my friend ______ the first {thing}.", { name: ANY, thing: ["class", "day of school", "lesson", "year"] }),
  bs("It has been cold ______ the beginning of {month}, {name}.", { month: ["November", "December", "January", "February"], name: P4 }),
  bs("My phone has been off ______ {time}, {name}.", { time: ["last night", "this morning", "yesterday", "lunch"], name: N4 }),
  bs("We have known the {who} ______ {year}.", { who: ["Karimovs", "neighbours", "new teacher", "family next door"], year: ["2015", "2019", "2021", "2022"] }),
  bf("I have known {name} ______ {n} years.", { name: ANY, n: ["three", "five", "seven", "ten"] }),
  bf("{name} has been in {city} ______ {period}.", { name: ANY, city: CITY, period: ["a week", "two weeks", "a month", "three days"] }),
  bf("We have had this {thing} ______ {n} months.", { thing: ["car", "sofa", "cat", "computer"], n: ["two", "three", "six", "eight"] }),
  bf("It has snowed ______ {n} days, {name}.", { n: ["two", "three", "four", "five"], name: P4 }),
  bf("My {relative} has been away ______ {period}.", { relative: ["father", "brother", "uncle", "sister"], period: ["a long time", "two weeks", "a month", "ten days"] }),
  bf("The {who} have played ______ {n} hours.", { who: ["boys", "children", "girls", "twins"], n: ["two", "three", "four", "five"] }),
  bf("I haven't seen my {relative} ______ {period}.", { relative: ["cousin", "uncle", "grandmother", "aunt"], period: ["ages", "a year", "months", "a long time"] }),
  bf("{name} has been a student ______ {n} years.", { name: ANY, n: ["two", "three", "four", "five"] }),
  bf("This {thing} has been here ______ {n} years.", { thing: ["school", "bridge", "tree", "shop"], n: ["fifty", "a hundred", "thirty", "eighty"] }),
  bf("We have been in the queue ______ {n} minutes, {name}.", { n: ["ten", "fifteen", "twenty", "forty"], name: N4 }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TO_FOR = "Say the same thing with for and the length of time.";
const TO_SINCE = "Say the same thing with since and the start point.";
const FIX = "Correct the mistake: write since or for.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // start point -> length (5)
  T(TO_FOR, "It is Friday. {name} has been ill since Monday, {voc}.", "{name} has been ill ______ four days, {voc}.", "for",
    "Monday to Friday is four days. A length of time takes for.", { name: ANY, voc: ["Mum", "Dad", "Grandma", "Olga"] }),
  T(TO_FOR, "It is 2026. We have lived in this {home} since 2021, {name}.", "We have lived in this {home} ______ five years, {name}.", "for",
    "2021 to 2026 is five years. A length of time takes for.", { home: ["flat", "house", "street", "village"], name: N4 }),
  T(TO_FOR, "It is noon. The {who} have played {game} since ten o'clock.", "The {who} have played {game} ______ two hours.", "for",
    "Ten o'clock to noon is two hours. A length of time takes for.", { who: ["boys", "children", "girls", "twins"], game: ["football", "chess", "tennis", "cards"] }),
  T(TO_FOR, "It is June. My {relative} has worked at the {place} since March.", "My {relative} has worked at the {place} ______ three months.", "for",
    "March to June is three months. A length of time takes for.", { relative: ["father", "aunt", "sister", "uncle"], place: ["bank", "hospital", "school", "factory"] }),
  T(TO_FOR, "It is ten past nine. I have been at the {stop} since nine o'clock, {name}.", "I have been at the {stop} ______ ten minutes, {name}.", "for",
    "Nine o'clock to ten past nine is ten minutes. A length of time takes for.", { stop: ["bus stop", "station", "gate", "corner"], name: N4 }),
  // length -> start point (5)
  T(TO_SINCE, "It is 2026. {name} has studied English for two years, {voc}.", "{name} has studied English ______ 2024, {voc}.", "since",
    "Two years before 2026 is 2024. A start point takes since.", { name: ANY, voc: P4 }),
  T(TO_SINCE, "It is Sunday. We have been in {city} for two days, {name}.", "We have been in {city} ______ Friday, {name}.", "since",
    "Two days before Sunday is Friday. A start point takes since.", { city: CITY, name: N4 }),
  T(TO_SINCE, "It is five o'clock. The {thing} has been off for an hour, {name}.", "The {thing} has been off ______ four o'clock, {name}.", "since",
    "An hour before five is four o'clock. A start point takes since.", { thing: ["light", "heating", "internet", "water"], name: P4 }),
  T(TO_SINCE, "It is December. My {relative} has had the {thing} for a month.", "My {relative} has had the {thing} ______ November.", "since",
    "A month before December is November. A start point takes since.", { relative: ["brother", "sister", "cousin", "uncle"], thing: ["car", "job", "puppy", "phone"] }),
  T(TO_SINCE, "{name} went to bed at noon. She has been asleep for six hours, {voc}.", "{name} has been asleep ______ noon, {voc}.", "since",
    "Noon is the moment it began. A start point takes since.", { name: F4, voc: P4 }),
  // correct a mistake (5)
  T(FIX, "I have lived here since {n} years, {name}.", "I have lived here ______ {n} years, {name}.", "for", WF,
    { n: ["two", "five", "ten", "twenty"], name: N4 }),
  T(FIX, "{name} has been ill for {day}.", "{name} has been ill ______ {day}.", "since", WS,
    { name: ANY, day: DAYS }),
  T(FIX, "We have known them from {year}, {name}.", "We have known them ______ {year}, {name}.", "since",
    "With have known and a start point we use since, not from.", { year: ["2015", "2019", "2021", "2022"], name: N4 }),
  T(FIX, "My {relative} has worked there during {n} years.", "My {relative} has worked there ______ {n} years.", "for",
    "To say how long, use for, not during.", { relative: ["father", "aunt", "uncle", "mother"], n: ["six", "eight", "fifteen", "thirty"] }),
  T(FIX, "I haven't eaten since {n} hours, {name}.", "I haven't eaten ______ {n} hours, {name}.", "for", WF,
    { n: ["five", "six", "eight", "ten"], name: P4 }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about how long you have lived in your home. Use for.", "have lived + for + a length of time", ["exactly one sentence", "must use for", "must give a length of time"]],
  ["Write the same idea with since: when did you start living there?", "have lived + since + a start point", ["exactly one sentence", "must use since", "must give a year or a moment"]],
  ["Write one sentence about a friend you have known for a long time.", "have known + for", ["exactly one sentence", "must use for", "must name the friend"]],
  ["Write one sentence about something you have had since your last birthday.", "have had + since", ["exactly one sentence", "must use since", "must name the thing"]],
  ["Write one sentence about how long you have studied English.", "have studied + for or since", ["exactly one sentence", "must use for or since", "must match a length (for) or a start (since)"]],
  ["Write one sentence with since + a day of the week.", "since + day", ["exactly one sentence", "must use since", "must name a day"]],
  ["Write two sentences about one fact: first with since, then with for.", "since + start point, for + length", ["exactly two sentences", "since in the first", "for in the second"]],
  ["A friend wrote: \"I have lived here since five years and I have known Ali from 2020.\" Write the sentence correctly.", "for five years ... since 2020", ["exactly one sentence", "must use for five years", "must use since 2020"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["How long have you lived in your town, studied at your school or done your hobby? Write three or four sentences with for and since.",
    "for + length, since + start point", ["for with a length of time", "since with a start point", "both words used"]],
  ["Describe your best friend. How long have you known each other, and since when? Write three or four sentences.",
    "have known + for / since", ["for with a length", "since with a start point", "no from in place of since"]],
  ["Tell me about three things you own. How long have you had each one? Write three or four sentences.",
    "have had + for / since", ["for or since in each sentence", "the right one for the time expression", "at least one of each"]],
  ["Describe someone's job in your family. How long has he or she done it? Write three or four sentences.",
    "has worked / has been + for / since", ["for with a length", "since with a start point", "no during in place of for"]],
  ["What has changed in your life since last year? Write three or four sentences.",
    "since + start point, for + length", ["since last year or since + a month", "for with a length of time", "both words used"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.time.since-for.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
