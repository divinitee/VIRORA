// Hand-authored: conditionals-wishes / second / if-i-were-you (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): advice with If I were you, I WOULD (wouldn't)
// + base verb (If I were you, I would apply for that job.).
// Triage with sibling second-if-clause: THIS topic owns the result half (would +
// base) in the fixed advice frame; second-if-clause owns the if-half (past simple:
// If I won / had / lived …). "If I were you" is printed in every line, so the
// learner never has to choose was / were here.
// Choose: 14 would + base / will + base / base / past; 6 wouldn't / won't / don't / didn't.
// Build: would (wouldn't) + the verb in brackets; no source prints would.
// Transform: 5 should / why don't you → If I were you / 5 correct the mistake /
// 5 it's a good (bad) idea → If I were you.
//
// Run: node tools/grammar-practice/authored/conditionals-wishes.second.if-i-were-you.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "conditionals-wishes", branch: "second", topic: "if-i-were-you", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const PAST = { apply: "applied", see: "saw", take: "took", call: "called", buy: "bought", go: "went", ask: "asked", study: "studied", wear: "wore", save: "saved", tell: "told", book: "booked", learn: "learned", try: "tried", drive: "drove", eat: "ate", worry: "worried", spend: "spent", lend: "lent", leave: "left" };
const WHY = "Advice: If I were you, I would + base verb.";
const WHY_NOT = "Advice not to do something: If I were you, I wouldn't + base verb.";
const pos = (v) => [`would ${v}`, `will ${v}`, v, PAST[v]];
const neg = (v) => [`wouldn't ${v}`, `won't ${v}`, `don't ${v}`, `didn't ${v}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["apply", 0, "That job at the {place} is perfect for you. If I were you, I ______ for it, {name}.", { place: ["bank", "hotel", "airport", "hospital"], name: NAME }],
  ["see", 0, "Your {part} still hurts? I ______ a doctor if I were you, {name}.", { part: ["tooth", "back", "knee", "eye"], name: NAME }],
  ["take", 0, "The bus is very slow. If I were you, I ______ a taxi to the {place}, {name}.", { place: ["airport", "station", "wedding", "hospital"], name: NAME }],
  ["call", 0, "I ______ her today if I were you, {name}. She's waiting for your {thing}.", { thing: ["answer", "call", "news", "message"], name: NAME }],
  ["buy", 0, "Both are nice, but if I were you, I ______ the {color} one, {name}.", { color: ["blue", "black", "red", "white"], name: NAME }],
  ["go", 0, "You have the {test} tomorrow. If I were you, I ______ to bed early, {name}.", { test: ["exam", "test", "interview", "match"], name: NAME }],
  ["ask", 0, "I ______ the teacher if I were you, {name}. She knows a lot about {topic}.", { topic: ["history", "maths", "music", "art"], name: NAME }],
  ["study", 0, "You love helping people. If I were you, I ______ {subject} at university, {name}.", { subject: ["medicine", "law", "nursing", "teaching"], name: NAME }],
  ["wear", 0, "It's cold outside. I ______ a {coat} if I were you, {name}.", { coat: ["coat", "jacket", "hat", "scarf"], name: NAME }],
  ["save", 0, "Don't spend it all. If I were you, I ______ the money for a {thing}, {name}.", { thing: ["car", "laptop", "trip", "bike"], name: NAME }],
  ["tell", 0, "I ______ your {who} the truth if I were you, {name}.", { who: ["parents", "boss", "teacher", "friend"], name: NAME }],
  ["book", 0, "Tickets sell fast. If I were you, I ______ them for the {event} now, {name}.", { event: ["concert", "match", "show", "festival"], name: NAME }],
  ["learn", 0, "You're going to {country} in May? If I were you, I ______ some of the language, {name}.", { country: ["Korea", "Turkey", "Japan", "China"], name: NAME }],
  ["try", 0, "Their {food} is famous. If I were you, I ______ it, {name}.", { food: ["plov", "samsa", "soup", "lagman"], name: NAME }],
  ["drive", 1, "Look at this {weather}! If I were you, I ______ today, {name}.", { weather: ["snow", "rain", "fog", "storm"], name: NAME }],
  ["eat", 1, "I ______ that {food} if I were you, {name}. It's very old.", { food: ["fish", "cheese", "meat", "cake"], name: NAME }],
  ["worry", 1, "You studied a lot. If I were you, I ______ about the {test}, {name}.", { test: ["exam", "test", "interview", "quiz"], name: NAME }],
  ["spend", 1, "Prices there are crazy. If I were you, I ______ much at the {place}, {name}.", { place: ["airport", "mall", "hotel", "tourist shop"], name: NAME }],
  ["lend", 1, "I ______ him your {thing} if I were you, {name}. He never gives things back.", { thing: ["car", "laptop", "camera", "bike"], name: NAME }],
  ["leave", 1, "This street isn't safe. If I were you, I ______ the {thing} in the car, {name}.", { thing: ["bag", "laptop", "phone", "passport"], name: NAME }],
].map(([v, n, prompt, slots], i) => {
  const o = n ? neg(v) : pos(v);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: n ? WHY_NOT : WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Give advice. Complete with would (or wouldn't) and the verb in brackets.";
// no source prints "would"
const BUILD = [
  ["apply", 0, "You'd be great there. If I were you, I ______ (apply) for the job at the {place}, {name}.", { place: ["bank", "hotel", "airport", "hospital"], name: NAME }],
  ["see", 0, "Your {part} hurts? If I were you, I ______ (see) a doctor, {name}.", { part: ["tooth", "back", "knee", "eye"], name: NAME }],
  ["take", 0, "I ______ (take) a taxi to the {place} if I were you, {name}.", { place: ["airport", "station", "wedding", "hospital"], name: NAME }],
  ["call", 0, "It's her birthday. If I were you, I ______ (call) your {who} tonight, {name}.", { who: ["mother", "grandmother", "sister", "aunt"], name: NAME }],
  ["buy", 0, "Both are nice. If I were you, I ______ (buy) the {color} one, {name}.", { color: ["blue", "black", "red", "white"], name: NAME }],
  ["go", 0, "I ______ (go) to bed early if I were you. The {test} is tomorrow, {name}.", { test: ["exam", "test", "interview", "match"], name: NAME }],
  ["ask", 0, "You look lost. If I were you, I ______ (ask) the {who} for help, {name}.", { who: ["teacher", "manager", "coach", "librarian"], name: NAME }],
  ["wear", 0, "It's freezing. If I were you, I ______ (wear) a warm {coat}, {name}.", { coat: ["coat", "jacket", "hat", "scarf"], name: NAME }],
  ["tell", 0, "I ______ (tell) your {who} the truth if I were you, {name}.", { who: ["parents", "boss", "teacher", "friend"], name: NAME }],
  ["book", 0, "Hotels fill up fast. If I were you, I ______ (book) the hotel in {city} now, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"], name: NAME }],
  ["speak", 0, "Want fast progress? If I were you, I ______ (speak) English every day with {who}, {name}.", { who: ["tourists", "friends", "your cousin", "your teacher"], name: NAME }],
  ["try", 0, "The new café is good. If I were you, I ______ (try) the {food}, {name}.", { food: ["plov", "samsa", "soup", "lagman"], name: NAME }],
  ["sell", 0, "You never use it. If I were you, I ______ (sell) the old {thing}, {name}.", { thing: ["car", "bike", "sofa", "piano"], name: NAME }],
  ["visit", 0, "Spring is the best time. If I were you, I ______ (visit) {city} in April, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], name: NAME }],
  ["drive", 1, "The roads are dangerous. If I were you, I ______ (not / drive) in this {weather}, {name}.", { weather: ["snow", "rain", "fog", "storm"], name: NAME }],
  ["eat", 1, "I ______ (not / eat) that {food} if I were you, {name}. It smells bad.", { food: ["fish", "cheese", "meat", "cake"], name: NAME }],
  ["worry", 1, "You're ready. If I were you, I ______ (not / worry) about the {test}, {name}.", { test: ["exam", "test", "interview", "quiz"], name: NAME }],
  ["lend", 1, "I ______ (not / lend) him your {thing} if I were you, {name}.", { thing: ["car", "laptop", "camera", "bike"], name: NAME }],
  ["leave", 1, "Cars get broken into here. If I were you, I ______ (not / leave) your {thing} in the car, {name}.", { thing: ["bag", "laptop", "phone", "passport"], name: NAME }],
  ["buy", 1, "That shop is expensive. If I were you, I ______ (not / buy) a {thing} there, {name}.", { thing: ["phone", "laptop", "TV", "fridge"], name: NAME }],
].map(([v, n, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `${n ? "wouldn't" : "would"} ${v}`, why: n ? WHY_NOT : WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ADV = "Rewrite the advice with If I were you.";
const FIX = "Correct the mistake.";
const IDEA = "Rewrite with If I were you, I would (or wouldn't) ….";
// [instr, source, hint, verb, negative?, slots]
const TRANSFORM = [
  [ADV, "You should see a doctor about your {part}, {name}.", "If I were you, I ______ a doctor about my {part}, {name}.", "see", 0, { part: ["tooth", "back", "knee", "eye"], name: NAME }],
  [ADV, "You should take the {bus}, {name}. It's faster.", "If I were you, I ______ the {bus}, {name}. It's faster.", "take", 0, { bus: ["train", "metro", "night bus", "fast train"], name: NAME }],
  [ADV, "Why don't you call your {who}, {name}?", "If I were you, I ______ my {who}, {name}.", "call", 0, { who: ["mother", "grandmother", "sister", "aunt"], name: NAME }],
  [ADV, "You shouldn't spend so much on {thing}, {name}.", "If I were you, I ______ so much on {thing}, {name}.", "spend", 1, { thing: ["clothes", "games", "coffee", "taxis"], name: NAME }],
  [ADV, "My advice: don't tell {who} about the {event}.", "If I were you, I ______ {who} about the {event}.", "tell", 1, { who: ["Timur", "your boss", "your sister", "anyone"], event: ["party", "gift", "plan", "trip"] }],
  [FIX, "I will apply for the job at the {place} if I were you, {name}.", "I ______ for the job at the {place} if I were you, {name}.", "apply", 0, { place: ["bank", "hotel", "airport", "hospital"], name: NAME }],
  [FIX, "If I were you, I would to call the {who}, {name}.", "If I were you, I ______ the {who}, {name}.", "call", 0, { who: ["doctor", "plumber", "landlord", "teacher"], name: NAME }],
  [FIX, "Honestly, I would went to the {place} if I were you, {name}.", "Honestly, I ______ to the {place} if I were you, {name}.", "go", 0, { place: ["dentist", "bank", "office", "bazaar"], name: NAME }],
  [FIX, "That {food} is old. If I were you, I don't eat it, {name}.", "That {food} is old. If I were you, I ______ it, {name}.", "eat", 1, { food: ["fish", "cheese", "meat", "cake"], name: NAME }],
  [FIX, "Both are good, but I would bought the {color} one if I were you, {name}.", "Both are good, but I ______ the {color} one if I were you, {name}.", "buy", 0, { color: ["blue", "black", "red", "white"], name: NAME }],
  [IDEA, "I think it's a good idea to rest at home today, {name}. You look {adj}.", "If I were you, I ______ at home today, {name}. You look {adj}.", "rest", 0, { adj: ["tired", "ill", "pale", "terrible"], name: NAME }],
  [IDEA, "Going out in the {weather} is a bad idea, {name}.", "If I were you, I ______ out in the {weather}, {name}.", "go", 1, { weather: ["snow", "rain", "fog", "storm"], name: NAME }],
  [IDEA, "Asking your {who} is the best idea, {name}.", "If I were you, I ______ my {who}, {name}.", "ask", 0, { who: ["teacher", "father", "boss", "coach"], name: NAME }],
  [IDEA, "Before the trip, learning some {lang} is a good idea, {name}.", "If I were you, I ______ some {lang} before the trip, {name}.", "learn", 0, { lang: ["Korean", "Turkish", "Arabic", "Chinese"], name: NAME }],
  [IDEA, "Taking the night train to {city} is a bad idea, {name}.", "If I were you, I ______ the night train to {city}, {name}.", "take", 1, { city: ["Moscow", "Almaty", "Nukus", "Termez"], name: NAME }],
].map(([instr, source, hint, v, n, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `${n ? "wouldn't" : "would"} ${v}`, why: n ? WHY_NOT : WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["A friend has a toothache. Write one sentence of advice starting with If I were you.", "If I were you, I would …", ["exactly one sentence", "If I were you", "would + base verb"]],
  ["A friend wants to buy an expensive phone. Write one sentence of advice with wouldn't.", "If I were you, I wouldn't …", ["exactly one sentence", "If I were you", "wouldn't + base verb"]],
  ["Your cousin is going to Samarkand for the first time. Write one sentence of advice.", "If I were you, I would visit …", ["exactly one sentence", "If I were you", "would"]],
  ["A classmate is nervous about an exam. Write one sentence with If I were you.", "If I were you, I wouldn't worry", ["exactly one sentence", "If I were you", "would or wouldn't"]],
  ["Write one sentence of advice with the if-part at the end.", "I would … if I were you", ["exactly one sentence", "would first", "if I were you at the end"]],
  ["A friend is always late for work. Write one sentence of advice.", "If I were you, I would leave earlier", ["exactly one sentence", "If I were you", "would + base verb"]],
  ["Write two sentences of advice for someone learning English: one with would, one with wouldn't.", "would / wouldn't", ["exactly two sentences", "would", "wouldn't"]],
  ["A friend found a wallet in the street. Write one sentence of advice.", "If I were you, I would take it to …", ["exactly one sentence", "If I were you", "would"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["A friend can't decide between two jobs. Write three or four sentences of advice with If I were you.", "If I were you, I would …", ["If I were you", "would / wouldn't", "three or four sentences"]],
  ["Your little brother wants to stop going to school. Write three or four sentences of advice.", "If I were you, I wouldn't …", ["If I were you", "wouldn't", "three or four sentences"]],
  ["A tourist asks you for advice about your city. Write three or four sentences with If I were you.", "advice with would", ["If I were you", "would", "three or four sentences"]],
  ["A friend wants to learn English fast. Write three or four sentences of advice.", "If I were you, I would …", ["If I were you", "would", "wouldn't"]],
  ["Write a short reply (three or four sentences) to a friend who wants to buy a car with all her money.", "advice with would / wouldn't", ["If I were you", "would", "wouldn't"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/conditionals-wishes.second.if-i-were-you.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
