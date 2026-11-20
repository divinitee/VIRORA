// Hand-authored: tenses / perfect / perfect-vs-past (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): the present perfect can't go with a
// FINISHED time marker (yesterday, last week, in 2019, two days ago, when I was
// a child): those take the past simple. An unfinished time (since, so far, for
// + still) takes the present perfect.
// One right answer: just / already / yet / ever / never are NOT used as the
// present-perfect cue, because American English often uses the past simple with
// them ("I just saw him", "Did you ever go?"). The perfect cues here are since,
// so far, up to now and "for … and we still …", where the past simple is wrong.
// Choose: key + the other tense + present simple + present continuous
// (saw / have seen / see / am seeing), about 12 past / 8 perfect.
// Siblings: unfinished-time owns this morning / today, since-clause owns
// since + clause, experience-ever owns ever / never (A2).
// Transform: 5 correct the mistake / 5 new finished time word → past simple /
// 5 since or so far → present perfect.
//
// Run: node tools/grammar-practice/authored/tenses.perfect.perfect-vs-past.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "perfect-vs-past", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAME_F = ["Madina", "Olga", "Sevara", "Nilufar"];
const NAME_M = ["Sardor", "Timur", "Ilya", "Jasur"];
const FIN = ["yesterday", "last week", "two days ago", "on Sunday"];
const WHY_PAST = (v) => `The time word is finished (yesterday, last …, ago, in 2019), so use the past simple: ${v}. Not the present perfect.`;
const WHY_PERF = (v) => `The time is not finished (since, so far, and still), so use the present perfect: ${v}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [kind, [key, other, present, continuous], prompt, slots]
const CHOOSE = [
  ["p", ["saw", "have seen", "see", "am seeing"], "I ______ that film {when}, {name}. It was great.", { when: FIN, name: NAME }],
  ["p", ["went", "have gone", "go", "am going"], "We ______ to {city} in {year}.", { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], year: ["2019", "2021", "2022", "2023"] }],
  ["p", ["bought", "has bought", "buys", "is buying"], "My {who} ______ a new {thing} three days ago.", { who: ["father", "uncle", "brother", "neighbour"], thing: ["car", "phone", "laptop", "bike"] }],
  ["p", ["met", "have met", "meet", "am meeting"], "I ______ {name} at a party {when}.", { name: NAME, when: ["last year", "last month", "in May", "two years ago"] }],
  ["p", ["lost", "has lost", "loses", "is losing"], "{name} ______ her keys on the bus {when}.", { name: NAME_F, when: FIN }],
  ["p", ["called", "has called", "calls", "is calling"], "Your {who} ______ you an hour ago, {name}.", { who: ["mum", "teacher", "boss", "cousin"], name: NAME }],
  ["p", ["learned", "have learned", "learn", "am learning"], "I ______ to swim when I was {age}, {name}.", { age: ["six", "seven", "eight", "ten"], name: NAME }],
  ["p", ["won", "has won", "wins", "is winning"], "Our team ______ the {event} last {season}.", { event: ["cup", "final", "match", "competition"], season: ["year", "summer", "spring", "season"] }],
  ["p", ["finished", "have finished", "finish", "are finishing"], "We ______ the {task} at six yesterday, {name}.", { task: ["project", "homework", "test", "cleaning"], name: NAME }],
  ["p", ["visited", "has visited", "visits", "is visiting"], "My grandmother ______ us {when}. She brought {food}.", { when: ["last weekend", "on Friday", "yesterday", "in March"], food: ["plov", "samsa", "apples", "a cake"] }],
  ["p", ["broke", "has broken", "breaks", "is breaking"], "{name} ______ his arm when he was {age}.", { name: NAME_M, age: ["ten", "eleven", "twelve", "nine"] }],
  ["p", ["moved", "have moved", "move", "are moving"], "My cousins ______ to {city} {n} years ago.", { city: ["Moscow", "Seoul", "Almaty", "Istanbul"], n: ["five", "two", "three", "ten"] }],
  ["f", ["have lived", "lived", "live", "am living"], "I ______ in this {home} since {year}, {name}.", { home: ["flat", "house", "street", "town"], year: ["2015", "2018", "2020", "2021"], name: NAME }],
  ["f", ["has worked", "worked", "works", "is working"], "My {who} ______ at the {place} since she was twenty.", { who: ["mother", "aunt", "sister", "grandmother"], place: ["hospital", "bank", "school", "bakery"] }],
  ["f", ["have read", "read", "reads", "am reading"], "So far this year, I ______ {n} books in English, {name}.", { n: ["two", "three", "four", "five"], name: NAME }],
  ["f", ["have known", "knew", "know", "am knowing"], "I ______ {name} for {n} years, and we are still best friends.", { name: NAME, n: ["ten", "five", "six", "eight"] }],
  ["f", ["has been", "was", "is", "is being"], "My brother ______ ill since {day}, {name}.", { day: ["Monday", "Friday", "the weekend", "Tuesday"], name: NAME }],
  ["f", ["have had", "had", "have", "are having"], "We ______ this {thing} since I was a baby, {name}, and it still works.", { thing: ["fridge", "TV", "sofa", "clock"], name: NAME }],
  ["f", ["has scored", "scored", "scores", "is scoring"], "Up to now, {name} ______ {n} goals this season.", { name: NAME_M, n: ["five", "seven", "ten", "twelve"] }],
  ["f", ["have studied", "studied", "study", "am studying"], "I ______ English for {n} years, and I still go to lessons, {name}.", { n: ["three", "four", "five", "six"], name: NAME }],
].map(([kind, opts, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: kind === "p" ? WHY_PAST(opts[0]) : WHY_PERF(opts[0]), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Present perfect or past simple? Look at the time words and write the verb in brackets.";
// [key, kind, source, slots]
const BUILD = [
  ["saw", "p", "I ______ (see) {name} at the bazaar {when}.", { name: NAME, when: FIN }],
  ["went", "p", "We ______ (go) to the mountains last {season}, {name}.", { season: ["summer", "spring", "winter", "autumn"], name: NAME }],
  ["started", "p", "The {event} ______ (start) ten minutes ago, {name}. Hurry up!", { event: ["film", "match", "concert", "lesson"], name: NAME }],
  ["wrote", "p", "{name} ______ (write) this poem in {year}.", { name: NAME, year: ["2020", "2022", "2023", "2024"] }],
  ["ate", "p", "We ______ (eat) {food} at Grandma's {when}.", { food: ["plov", "manti", "lagman", "shurpa"], when: FIN }],
  ["was", "p", "My {who} ______ (be) a teacher {when}.", { who: ["grandfather", "father", "uncle", "neighbour"], when: ["in the 1990s", "thirty years ago", "in 2005", "before I was born"] }],
  ["passed", "p", "My sister ______ (pass) her driving test {when}, {name}.", { when: ["last month", "in June", "two weeks ago", "on Friday"], name: NAME }],
  ["got", "p", "I ______ (get) your message at {time} last night, {name}.", { time: ["ten", "eleven", "midnight", "nine"], name: NAME }],
  ["built", "p", "They ______ (build) the new {place} in our town in {year}.", { place: ["school", "bridge", "hospital", "park"], year: ["2018", "2020", "2021", "2023"] }],
  ["left", "p", "The last bus ______ (leave) {n} ago, so we took a {transport}.", { n: ["an hour", "twenty minutes", "half an hour", "ten minutes"], transport: ["taxi", "minibus", "car", "tram"] }],
  ["forgot", "p", "{name} ______ (forget) his {thing} at home {when}.", { name: NAME_M, thing: ["ticket", "bag", "phone", "lunch"], when: FIN }],
  ["has lived", "f", "My aunt ______ (live) in {city} since {year}.", { city: ["Tashkent", "Bukhara", "Moscow", "Seoul"], year: ["2010", "2015", "2019", "2020"] }],
  ["have played", "f", "I ______ (play) the {instr} since I was {age}, {name}.", { instr: ["piano", "guitar", "dutar", "violin"], age: ["six", "eight", "ten", "twelve"], name: NAME }],
  ["has rained", "f", "It ______ (rain) every day so far this {period}, {name}.", { period: ["week", "month", "spring"], name: NAME }],
  ["have been", "f", "We ______ (be) friends since {time}, {name}.", { time: ["school", "childhood", "2018", "the first day of college"], name: NAME }],
  ["has taught", "f", "Mr Karimov ______ (teach) at our {school} since {year}.", { school: ["school", "lyceum", "college", "university"], year: ["2005", "2010", "2012", "2016"] }],
  ["have had", "f", "I ______ (have) this {thing} for six years, and it still works, {name}.", { thing: ["phone", "bike", "watch", "laptop"], name: NAME }],
  ["has visited", "f", "Up to now, my {who} ______ (visit) us {n} times this year.", { who: ["uncle", "aunt", "grandfather", "cousin"], n: ["two", "three", "four", "five"] }],
  ["have known", "f", "I ______ (know) my best friend since we were {age}, {name}.", { age: ["five", "six", "seven", "children"], name: NAME }],
  ["has worked", "f", "{name} ______ (work) at the {place} for two years, and she likes it.", { name: NAME_F, place: ["café", "bank", "hotel", "shop"] }],
].map(([key, kind, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  const acc = [];
  const ing = { "has lived": "has been living", "have played": "have been playing", "has rained": "has been raining", "has taught": "has been teaching", "has worked": "has been working" }[key];
  if (ing) acc.push(ing);
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: kind === "p" ? WHY_PAST(key) : WHY_PERF(key), slots: s, ...(acc.length ? { acceptable: acc } : {}) };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const PAST = "Rewrite the sentence with the new time words. Change the verb if you need to.";
const PERF = "Rewrite the sentence with the new time words. Change the verb if you need to.";
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [FIX, "I have seen that film {when}, {name}.", "I ______ that film {when}, {name}.", "saw", WHY_PAST("saw"), { when: FIN, name: NAME }],
  [FIX, "We have visited {city} in {year}.", "We ______ {city} in {year}.", "visited", WHY_PAST("visited"), { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], year: ["2019", "2021", "2022", "2023"] }],
  [FIX, "{name} has bought a new {thing} two days ago.", "{name} ______ a new {thing} two days ago.", "bought", WHY_PAST("bought"), { name: NAME, thing: ["phone", "bag", "jacket", "bike"] }],
  [FIX, "I live in this {home} since {year}.", "I ______ in this {home} since {year}.", "have lived", WHY_PERF("have lived"), { home: ["flat", "house", "street", "town"], year: ["2015", "2018", "2020", "2021"] }],
  [FIX, "My brother is ill since {day}, {name}.", "My brother ______ ill since {day}, {name}.", "has been", WHY_PERF("has been"), { day: ["Monday", "Friday", "the weekend", "Tuesday"], name: NAME }],
  [PAST, "I have lost my {thing}, {name}.", "I ______ my {thing} yesterday, {name}.", "lost", WHY_PAST("lost"), { thing: ["keys", "phone", "wallet", "ticket"], name: NAME }],
  [PAST, "My parents have been to {country}.", "My parents ______ to {country} in {year}.", "went", WHY_PAST("went"), { country: ["Turkey", "Korea", "Russia", "Kazakhstan"], year: ["2019", "2020", "2022", "2023"] }],
  [PAST, "{name} has finished the {task}.", "{name} ______ the {task} an hour ago.", "finished", WHY_PAST("finished"), { name: NAME, task: ["homework", "project", "test", "book"] }],
  [PAST, "We have met your {who}, {name}.", "We ______ your {who} last week, {name}.", "met", WHY_PAST("met"), { who: ["teacher", "brother", "boss", "neighbour"], name: NAME }],
  [PAST, "The {shop} has closed, {name}.", "The {shop} ______ at six yesterday, {name}.", "closed", WHY_PAST("closed"), { shop: ["bakery", "bank", "pharmacy", "post office"], name: NAME }],
  [PERF, "I lived here in {year}, {name}.", "I ______ here since {year}, {name}.", "have lived", WHY_PERF("have lived"), { year: ["2015", "2018", "2020", "2021"], name: NAME }],
  [PERF, "{name} worked at the {place} last year.", "{name} ______ at the {place} since last year, and she still likes it.", "has worked", WHY_PERF("has worked"), { name: NAME_F, place: ["bank", "café", "hotel", "school"] }],
  [PERF, "We had two tests last {period}, {name}.", "We ______ two tests so far this {period}, {name}.", "have had", WHY_PERF("have had"), { period: ["week", "month", "term"], name: NAME }],
  [PERF, "My {who} was in hospital on Monday, {name}.", "My {who} ______ in hospital since Monday, {name}.", "has been", WHY_PERF("has been"), { who: ["uncle", "grandfather", "aunt", "cousin"], name: NAME }],
  [PERF, "I knew {name} at {school}.", "I ______ {name} for ten years, and we are still friends.", "have known", WHY_PERF("have known"), { name: NAME, school: ["school", "college", "primary school", "camp"] }],
].map(([instr, source, hint, key, why, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  const acc = { "have lived": ["have been living"], "has worked": ["has been working"] }[key];
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s, ...(acc ? { acceptable: acc } : {}) };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you did yesterday.", "past simple + yesterday", ["exactly one sentence", "past simple", "yesterday"]],
  ["Write one sentence about where you have lived since you were a child.", "present perfect + since", ["exactly one sentence", "have lived", "since"]],
  ["Write one sentence about a trip you took in a year you name.", "past simple + in + year", ["exactly one sentence", "past simple", "in + a year"]],
  ["Write one sentence about how many books or films you have finished so far this year.", "present perfect + so far", ["exactly one sentence", "so far", "present perfect"]],
  ["Write one sentence with ago about a family member.", "past simple + ago", ["exactly one sentence", "ago", "past simple"]],
  ["Write one sentence about a friend you have known for a long time.", "have known … for", ["exactly one sentence", "have known", "for + a length of time"]],
  ["Write one sentence about when you started school or learned to ride a bike.", "past simple + when I was", ["exactly one sentence", "when I was", "past simple"]],
  ["Write two sentences: one with last year and one with since last year.", "past simple vs present perfect", ["exactly two sentences", "past simple + last year", "present perfect + since last year"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell the story of your last holiday, then say how your life has changed since then. Write three or four sentences.", "past simple vs present perfect", ["past simple with finished times", "present perfect with since", "three or four sentences"]],
  ["Write about your English: when you started and how long you have studied it. Write three or four sentences.", "started (past) / have studied (perfect)", ["past simple + in / ago", "present perfect + since / for", "three or four sentences"]],
  ["Describe a friend: when you met and how long you have known each other. Write three or four sentences.", "met (past) / have known (perfect)", ["met + a past time", "have known + for / since", "three or four sentences"]],
  ["Write about your town: what they built last year and what has changed since. Write three or four sentences.", "built (past) / has changed (perfect)", ["past simple + last year", "has changed + since", "a place"]],
  ["Write about your week: what you did on Monday and what you have done so far this week. Write three or four sentences.", "past simple vs present perfect", ["on Monday + past simple", "so far + present perfect", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.perfect.perfect-vs-past.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
