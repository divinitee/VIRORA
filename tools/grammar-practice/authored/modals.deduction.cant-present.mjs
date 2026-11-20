// Hand-authored: modals / deduction / cant-present (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): can't + base verb when the speaker is SURE
// something is NOT true (That can't be John. John is in Canada.). The classic
// error is mustn't (= not allowed) for a negative deduction.
// Triage: kept. Siblings must-present (sure it IS true) and might-present (not sure).
// Every line gives evidence that makes the idea impossible, so might and must are wrong.
// Choose: can't / mustn't / must / might.
// Build: can't + the verb in brackets; no source prints "can't".
// Transform: 5 I'm sure … isn't → can't / 5 correct the mistake (mustn't, can't to,
// can't knows, don't can) / 5 I'm sure … isn't -ing → can't be -ing.
//
// Run: node tools/grammar-practice/authored/modals.deduction.cant-present.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "deduction", topic: "cant-present", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const WHY = "The speaker is sure it is NOT true: can't + base verb (mustn't means 'not allowed').";
const OPTS = ["can't", "mustn't", "must", "might"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["That ______ be Aziz at the door. He's in {country} this week, {name}.", { country: ["Canada", "Korea", "Turkey", "Dubai"], name: NAME }],
  ["You ______ be hungry! You've just eaten two plates of {food}, {name}.", { food: ["plov", "pasta", "soup", "rice"], name: NAME }],
  ["She ______ be at work. Her office is closed on {day}s, {name}.", { day: ["Sunday", "Saturday", "Friday", "Monday"], name: NAME }],
  ["This ______ be your {thing}. Yours is blue, and this one is red, {name}.", { thing: ["bag", "umbrella", "pen", "scarf"], name: NAME }],
  ["He ______ be twenty. His son is at {place}, {name}.", { place: ["university", "college", "medical school", "law school"], name: NAME }],
  ["It ______ be cold outside. People are wearing {item}, {name}.", { item: ["T-shirts", "shorts", "sandals", "summer dresses"], name: NAME }],
  ["They ______ be asleep. I can hear them {doing} in the {room}.", { doing: ["talking", "laughing", "singing", "watching TV"], room: ["kitchen", "living room", "bedroom", "garden"] }],
  ["The {shop} ______ be open. It's three o'clock in the morning, {name}.", { shop: ["bank", "post office", "bakery", "library"], name: NAME }],
  ["You ______ be tired. You slept for {n} hours, {name}!", { n: ["twelve", "ten", "eleven", "fourteen"], name: NAME }],
  ["That ______ be the right bus. This one goes to the {place}, not the airport, {name}.", { place: ["bazaar", "station", "stadium", "university"], name: NAME }],
  ["She ______ be Lola's sister. Lola has only {sib}, {name}.", { sib: ["brothers", "one brother", "two brothers", "a brother"], name: NAME }],
  ["He ______ know about the {event}. Nobody told him, {name}.", { event: ["party", "surprise", "wedding", "plan"], name: NAME }],
  ["This {food} ______ be fresh. It's from last {time}.", { food: ["bread", "milk", "fish", "cake"], time: ["week", "month", "Monday", "Friday"] }],
  ["You ______ be serious, {name}! A new {thing} for five dollars?", { thing: ["phone", "laptop", "car", "bike"], name: NAME }],
  ["Timur ______ be at the {place}. I've just seen him in the café, {name}.", { place: ["gym", "library", "office", "stadium"], name: NAME }],
  ["It ______ be very far. The map says {dist}, {name}.", { dist: ["two minutes", "500 metres", "five minutes on foot", "one stop"], name: NAME }],
  ["This ______ be the right address. There's no {thing} here, {name}.", { thing: ["house", "hotel", "shop", "café"], name: NAME }],
  ["She ______ be from {country}. She doesn't speak a word of the language, {name}.", { country: ["Spain", "France", "Italy", "Germany"], name: NAME }],
  ["That ______ be true! Our {who} is never late, {name}.", { who: ["teacher", "boss", "coach", "driver"], name: NAME }],
  ["The {pet} ______ be hungry. I fed it ten minutes ago, {name}.", { pet: ["cat", "dog", "puppy", "kitten"], name: NAME }],
].map(([prompt, slots], i) => {
  const options = OPTS.map((_, j) => OPTS[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf("can't"), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "The speaker is sure it is NOT true. Complete with can't and the verb in brackets.";
const BUILD = [
  ["be", "Aziz ______ (be) at home. He's in {city} today, {name}.", { city: ["Samarkand", "Bukhara", "Moscow", "Almaty"], name: NAME }],
  ["be", "You ______ (be) hungry. You've just had {food}, {name}.", { food: ["lunch", "two sandwiches", "a big breakfast", "plov"], name: NAME }],
  ["be", "This ______ (be) my {thing}. Mine is black, {name}.", { thing: ["bag", "umbrella", "phone", "scarf"], name: NAME }],
  ["be", "The {shop} ______ (be) open. It's midnight, {name}.", { shop: ["bank", "post office", "bakery", "library"], name: NAME }],
  ["be", "It ______ (be) winter. The trees are green and it's {temp}, {name}.", { temp: ["thirty degrees", "very hot", "sunny", "warm"], name: NAME }],
  ["know", "Olga ______ (know) about the {event}. It's a secret, {name}.", { event: ["party", "surprise", "wedding", "plan"], name: NAME }],
  ["be", "He ______ (be) asleep. I can hear him {doing}, {name}.", { doing: ["talking", "singing", "laughing", "on the phone"], name: NAME }],
  ["be", "That ______ (be) the right {thing}. It doesn't open the door, {name}.", { thing: ["key", "card", "code", "button"], name: NAME }],
  ["be", "She ______ (be) tired. She slept until {time}, {name}.", { time: ["eleven", "noon", "ten o'clock", "lunchtime"], name: NAME }],
  ["be", "Your bag ______ (be) heavy. There's only one {thing} in it, {name}.", { thing: ["book", "pen", "scarf", "apple"], name: NAME }],
  ["be", "The film ______ (be) over. It started {when} ago, {name}.", { when: ["ten minutes", "five minutes", "half an hour", "fifteen minutes"], name: NAME }],
  ["be", "It ______ (be) Timur on the phone. He's on the plane to {city}, {name}.", { city: ["London", "Seoul", "Istanbul", "Dubai"], name: NAME }],
  ["live", "They ______ (live) here. This {place} is empty, {name}.", { place: ["flat", "house", "room", "building"], name: NAME }],
  ["be", "You ______ (be) serious about the {thing}, {name}!", { thing: ["price", "plan", "idea", "test"], name: NAME }],
  ["be", "That ______ (be) Madina's {car}. She doesn't have one, {name}.", { car: ["car", "bike", "scooter", "boat"], name: NAME }],
  ["be", "This ______ (be) the way to the {place}. The signs say it's behind us, {name}.", { place: ["station", "museum", "airport", "stadium"], name: NAME }],
  ["be", "He ______ (be) {age}. He's still at school, {name}.", { age: ["thirty", "forty", "twenty-five", "fifty"], name: NAME }],
  ["need", "The car ______ (need) petrol. I filled it up {when}, {name}.", { when: ["this morning", "yesterday", "an hour ago", "today"], name: NAME }],
  ["be", "The {food} ______ (be) ready. We put it in the oven {when}.", { food: ["cake", "bread", "chicken", "pie"], when: ["five minutes ago", "just now", "a minute ago", "two minutes ago"] }],
  ["be", "She ______ (be) at the {place}. It's closed today, {name}.", { place: ["library", "pool", "gym", "museum"], name: NAME }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `can't ${v}`, why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SURE = "Rewrite with can't.";
const FIX = "Correct the mistake.";
const ING = "Rewrite with can't be + -ing.";
const WHY_ING = "The speaker is sure it is not happening now: can't be + -ing.";
const TRANSFORM = [
  [SURE, "I'm sure he isn't at home. His {car} isn't outside, {name}.", "He ______ at home. His {car} isn't outside, {name}.", "can't be", { car: ["car", "bike", "scooter", "van"], name: NAME }],
  [SURE, "It's impossible that you are hungry, {name}. You've just had {food}.", "You ______ hungry, {name}. You've just had {food}.", "can't be", { food: ["lunch", "two sandwiches", "a big breakfast", "plov"], name: NAME }],
  [SURE, "I'm sure this isn't your {thing}, {name}.", "This ______ your {thing}, {name}.", "can't be", { thing: ["bag", "umbrella", "phone", "scarf"], name: NAME }],
  [SURE, "I'm sure she doesn't know about the {event}, {name}.", "She ______ about the {event}, {name}.", "can't know", { event: ["party", "surprise", "wedding", "plan"], name: NAME }],
  [SURE, "I'm sure it isn't far to the {place}, {name}.", "It ______ far to the {place}, {name}.", "can't be", { place: ["station", "bazaar", "park", "river"], name: NAME }],
  [FIX, "That mustn't be John. He's in {country} this week, {name}.", "That ______ John. He's in {country} this week, {name}.", "can't be", { country: ["Canada", "Korea", "Turkey", "Dubai"], name: NAME }],
  [FIX, "You mustn't be tired. You slept for {n} hours, {name}.", "You ______ tired. You slept for {n} hours, {name}.", "can't be", { n: ["twelve", "ten", "eleven", "fourteen"], name: NAME }],
  [FIX, "She can't to be at work. It's {day}, {name}.", "She ______ at work. It's {day}, {name}.", "can't be", { day: ["Sunday", "a holiday", "Navruz", "midnight"], name: NAME }],
  [FIX, "He can't knows the answer to the {q}, {name}.", "He ______ the answer to the {q}, {name}.", "can't know", { q: ["question", "puzzle", "riddle", "maths problem"], name: NAME }],
  [FIX, "It don't can be true. Our {who} is never late, {name}.", "It ______ true. Our {who} is never late, {name}.", "can't be", { who: ["teacher", "boss", "coach", "driver"], name: NAME }],
  [ING, "I'm sure she isn't sleeping. I can hear her {doing}, {name}.", "She ______. I can hear her {doing}, {name}.", "can't be sleeping", { doing: ["singing", "talking", "laughing", "on the phone"], name: NAME }],
  [ING, "I'm sure he isn't working at the {place} today. It's closed, {name}.", "He ______ at the {place} today. It's closed, {name}.", "can't be working", { place: ["bank", "school", "shop", "library"], name: NAME }],
  [ING, "I'm sure they aren't waiting for us at the {place}. Nobody is there, {name}.", "They ______ for us at the {place}. Nobody is there, {name}.", "can't be waiting", { place: ["station", "gate", "café", "bus stop"], name: NAME }],
  [ING, "I'm sure it isn't raining in {city}. The sky is clear, {name}.", "It ______ in {city}. The sky is clear, {name}.", "can't be raining", { city: ["London", "Moscow", "Tashkent", "Fergana"], name: NAME }],
  [ING, "I'm sure you aren't telling the truth about the {thing}, {name}.", "You ______ the truth about the {thing}, {name}.", "can't be telling", { thing: ["test", "money", "party", "accident"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: instr === ING ? WHY_ING : WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["A friend says he saw your teacher in Paris today, but you saw her this morning. Write one sentence with can't.", "That can't be true / She can't be in Paris", ["exactly one sentence", "can't + base verb", "present"]],
  ["Your brother says he's hungry, but he has just eaten. Write one sentence with can't.", "You can't be hungry", ["exactly one sentence", "can't be", "present"]],
  ["Write one sentence about a shop at midnight. Use can't.", "It can't be open", ["exactly one sentence", "can't", "a reason"]],
  ["Write one sentence with can't be + -ing about someone you can hear.", "He can't be sleeping", ["exactly one sentence", "can't be + -ing", "now"]],
  ["Someone says a new phone costs five dollars. Write one sentence with can't.", "That can't be right", ["exactly one sentence", "can't", "present"]],
  ["Write one sentence with must and one with can't about the same person.", "must vs can't", ["exactly two sentences", "must = sure yes", "can't = sure no"]],
  ["Write two sentences: the evidence, then your deduction with can't.", "evidence + can't", ["exactly two sentences", "first: what you know", "second: can't + base verb"]],
  ["Write one sentence that shows the difference between can't and mustn't.", "can't (deduction) vs mustn't (not allowed)", ["one or two sentences", "can't for a deduction", "mustn't for a rule"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["A friend tells you three surprising things. Write three or four sentences saying why they can't be true.", "can't for negative deduction", ["can't + base verb", "a reason for each", "three or four sentences"]],
  ["You find a phone on a table. Write three or four sentences: whose can it be, and whose can't it be?", "must / can't for deduction", ["can't", "must", "three or four sentences"]],
  ["Describe a mystery: someone ate the cake. Write three or four sentences about who can't be the one.", "can't be / can't have", ["can't", "evidence", "three or four sentences"]],
  ["Write three or four sentences about a rumour at school or work. Use can't and must.", "can't vs must", ["can't", "must", "three or four sentences"]],
  ["Write three or four sentences using must, might and can't about the weather outside.", "must / might / can't", ["must", "might", "can't"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.deduction.cant-present.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
