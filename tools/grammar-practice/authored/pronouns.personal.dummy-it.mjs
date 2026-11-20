// Hand-authored: pronouns / personal / dummy-it (B1).
// Wave C, C17 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: dummy "it" as the subject for weather, time, dates,
// distance and "it takes + time" ("It's raining", "It's half past six",
// "It's a long way to the station", "It takes twenty minutes").
// Uzbek ("Bugun sovuq", "Yomg'ir yog'yapti") and Russian ("Холодно",
// "Идёт дождь") have no subject here, so learners write "Is cold", "Today very
// cold", or reach for "There is cold" / "It has raining" / "Takes an hour".
// Choose: 9 weather, 4 time / dates, 3 distance, 4 it takes. Options are
// It's / Is / There is / It has (time: They are, dates: Has / Today, it takes:
// Takes / Is / It has). "There is" is never offered where natives use it
// ("there's about five kilometres left"), "It is" never on it-takes frames.
// Build: "Write it or there." 13 it (dummy subject) / 7 there; every there
// sentence has a plural verb (are / were) so "it" is impossible there.
// Transform: 5 add the missing subject / 5 There → It / 5 make a question
// (Is it … ? / How long does it take … ?).
//
// Run: node tools/grammar-practice/authored/pronouns.personal.dummy-it.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "personal", topic: "dummy-it", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const EVENT = ["party", "wedding", "concert", "meeting"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_IT = "English needs a subject even for weather, time, dates and distance. Use it: It's cold, It's raining, It's six o'clock, It's a long way. There is needs a noun after it.";
const W_TAKE = "For how long something lasts, say It takes + time. English never starts with Takes or Is here.";
const W_THERE = "Here something exists (people, clouds, shops), and a plural verb follows, so use there: There are … It can't go with are / were.";
const OW = ["It's", "Is", "There is", "It has"];
const OWl = ["it's", "is", "there is", "it has"];
const OP = ["It", "There", "–", "Its"];
const OT = ["It's", "Is", "There is", "They are"];
const OD = ["It's", "Is", "There is", "Has"];
const OK = ["It's", "Is", "It has", "Has"];
const OTK = ["It takes", "Takes", "Is", "It has"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [OW, W_IT, "Take a coat, {name}. ______ very cold {when}.", { name: NAME, when: ["today", "this morning", "outside", "tonight"] }],
  [OW, W_IT, "______ raining again in {city}, {name}.", { city: CITY, name: NAME }],
  [OW, W_IT, "Look outside, {name}! ______ snowing {how}.", { name: NAME, how: ["again", "a lot", "so hard", "at last"] }],
  [OP, W_IT, "______ was very windy at the {place} {when}.", { place: ["lake", "beach", "park", "stadium"], when: PAST }],
  [OWl, W_IT, "Is it hot at your grandma's house in {month}, {name}? Yes, ______ really hot.", { month: ["June", "July", "August", "May"], name: NAME }],
  [["It", "There", "–", "This"], W_IT, "______ will be sunny {when}, so let's go to the {place}.", { when: ["tomorrow", "on Saturday", "this weekend", "on Sunday"], place: ["park", "lake", "mountains", "river"] }],
  [OWl, W_IT, "I don't like winter because ______ dark at {h}, {name}.", { h: ["four", "five", "half past four", "five o'clock"], name: NAME }],
  [OW, W_IT, "Let's go inside, {name}. ______ getting cold {where}.", { name: NAME, where: ["out here", "in the yard", "on the balcony", "in the park"] }],
  [OW, W_IT, "______ very hot in summer here, so we sleep on the {place}, {name}.", { place: ["balcony", "terrace", "porch", "roof"], name: NAME }],
  [OT, W_IT, "What time is it, {name}? ______ half past {h}.", { name: NAME, h: ["six", "seven", "eight", "nine"] }],
  [OT, W_IT, "______ already {h}. We should go home, {name}.", { h: ["ten", "eleven", "midnight", "very late"], name: NAME }],
  [OD, W_IT, "______ my birthday {when}, {name}!", { when: ["tomorrow", "on Friday", "next week", "today"], name: NAME }],
  [["It's", "Is", "There is", "Today"], W_IT, "______ Sunday, so the {place} is closed, {name}.", { place: ["bank", "post office", "school", "library"], name: NAME }],
  [OK, W_IT, "______ a long way to the {place} from here, {name}.", { place: ["airport", "station", "sea", "mountains"], name: NAME }],
  [OK, W_IT, "______ not far to the {place}. We can walk, {name}.", { place: ["bazaar", "park", "school", "station"], name: NAME }],
  [OK, W_IT, "______ about {n} kilometres from my house to the {place}.", { n: ["two", "three", "five", "ten"], place: ["school", "station", "bazaar", "river"] }],
  [OTK, W_TAKE, "______ about twenty minutes to get to the {place}, {name}.", { place: ["station", "airport", "bazaar", "museum"], name: NAME }],
  [OTK, W_TAKE, "______ a long time to cook {food}, {name}.", { food: ["plov", "manti", "sumalak", "halim"], name: NAME }],
  [OTK, W_TAKE, "How long does the trip last? ______ about an hour by {transport}, {name}.", { transport: ["bus", "train", "car", "taxi"], name: NAME }],
  [OTK, W_TAKE, "______ me ten minutes to walk to {place} every day, {name}.", { place: ["school", "work", "the station", "the gym"], name: NAME }],
].map(([opts, why, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write it or there.";
const BUILD = [
  ["It", W_IT, "______ is very cold {when}, {name}. Wear a hat.", { when: ["today", "outside", "this morning", "tonight"], name: NAME }],
  ["It", W_IT, "______ was raining all day in {city}, so we stayed at {place}.", { city: CITY, place: ["home", "the hotel", "our aunt's", "the museum"] }],
  ["it", W_IT, "Is ______ far to the {place}, {name}?", { place: ["station", "airport", "bazaar", "museum"], name: NAME }],
  ["It", W_IT, "______ was sunny and warm at the {place} {when}.", { place: ["lake", "beach", "park", "river"], when: PAST }],
  ["it", W_IT, "What time is ______ now, {name}? I left my phone at {place}.", { name: NAME, place: ["home", "school", "work", "the café"] }],
  ["It", W_TAKE, "______ takes about {n} minutes to walk to the {place}.", { n: ["ten", "fifteen", "twenty", "thirty"], place: ["station", "bazaar", "park", "school"] }],
  ["It", W_IT, "______ is my sister's birthday {when}, {name}.", { when: ["tomorrow", "on Sunday", "next week", "today"], name: NAME }],
  ["It", W_IT, "______ is getting dark. Let's go back {where}, {name}.", { where: ["home", "to the car", "to the hotel", "inside"], name: NAME }],
  ["It", W_IT, "______ was very windy on the {place} yesterday, {name}.", { place: ["bridge", "hill", "beach", "roof"], name: NAME }],
  ["It", W_IT, "______ is about {n} kilometres from here to the {place}.", { n: ["two", "three", "five", "ten"], place: ["airport", "station", "lake", "village"] }],
  ["It", W_IT, "______ will be hot {when}, so take some water, {name}.", { when: ["tomorrow", "this afternoon", "at the match", "on the trip"], name: NAME }],
  ["It", W_TAKE, "______ took us {n} hours to get to {city}.", { n: ["two", "three", "four", "five"], city: CITY }],
  ["It", W_IT, "______ is half past {h}. The {show} starts soon.", { h: ["six", "seven", "eight", "nine"], show: ["film", "match", "lesson", "concert"] }],
  ["There", W_THERE, "______ are two {places} on our street, {name}.", { places: ["banks", "cafés", "bakeries", "pharmacies"], name: NAME }],
  ["There", W_THERE, "______ were many people at the {event} {when}.", { event: EVENT, when: PAST }],
  ["There", W_THERE, "______ are no clouds in the sky {when}, {name}.", { when: ["today", "this morning", "right now", "tonight"], name: NAME }],
  ["There", W_THERE, "______ are {n} students in my {group}.", { n: ["twelve", "fifteen", "twenty", "thirty"], group: ["class", "group", "English class", "course"] }],
  ["There", W_THERE, "______ were some nice photos on the {thing}, {name}.", { thing: ["wall", "website", "desk", "table"], name: NAME }],
  ["There", W_THERE, "______ are lots of {fruit} at the bazaar {when}.", { fruit: ["melons", "apples", "grapes", "peaches"], when: ["in summer", "in August", "today", "this week"] }],
  ["there", W_THERE, "Are ______ any {things} left, {name}?", { things: ["eggs", "tickets", "apples", "seats"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ADD = "Add the missing subject.";
const COR = "Correct the mistake.";
const Q = "Make a question.";
const TRANSFORM = [
  // add the missing subject (5)
  [ADD, "Is very cold in the {room}, {name}.", "______ very cold in the {room}, {name}.", "It's", W_IT, { room: ["kitchen", "classroom", "bedroom", "office"], name: NAME }],
  [ADD, "Is raining again {when}, {name}.", "______ raining again {when}, {name}.", "It's", W_IT, { when: ["today", "this morning", "this week", "tonight"], name: NAME }],
  [ADD, "Was very hot at the {event} {when}.", "______ very hot at the {event} {when}.", "It was", W_IT, { event: EVENT, when: PAST }],
  [ADD, "Takes {n} minutes to get to the {place}.", "______ {n} minutes to get to the {place}.", "It takes", W_TAKE, { n: ["ten", "fifteen", "twenty", "forty"], place: ["station", "airport", "bazaar", "museum"] }],
  [ADD, "Is a long way to the {place}, {name}.", "______ a long way to the {place}, {name}.", "It's", W_IT, { place: ["airport", "sea", "mountains", "village"], name: NAME }],
  // There -> It (5)
  [COR, "There is very windy {when}, {name}.", "______ very windy {when}, {name}.", "It's", W_IT, { when: ["today", "outside", "this morning", "tonight"], name: NAME }],
  [COR, "There was very hot in the {place} {when}.", "______ very hot in the {place} {when}.", "It was", W_IT, { place: ["bus", "room", "car", "kitchen"], when: PAST }],
  [COR, "There is already {h}, {name}.", "______ already {h}, {name}.", "It's", W_IT, { h: ["ten", "eleven", "midnight", "very late"], name: NAME }],
  [COR, "There are five kilometres to the {place}, {name}.", "______ five kilometres to the {place}, {name}.", "It's", W_IT, { place: ["station", "lake", "bazaar", "airport"], name: NAME }],
  [COR, "There takes an hour by {transport} to get to {city}.", "______ an hour by {transport} to get to {city}.", "It takes", W_TAKE, { transport: ["bus", "train", "car", "taxi"], city: CITY }],
  // make a question (5)
  [Q, "It is far to the {place}, {name}.", "______ ______ far to the {place}, {name}?", ["Is", "it"], W_IT, { place: ["station", "airport", "bazaar", "museum"], name: NAME }],
  [Q, "It was cold in {city} {when}.", "______ ______ cold in {city} {when}?", ["Was", "it"], W_IT, { city: CITY, when: PAST }],
  [Q, "It takes a long time to get to the {place}, {name}.", "How long ______ ______ take to get to the {place}, {name}?", ["does", "it"], W_TAKE, { place: ["airport", "village", "lake", "mountains"], name: NAME }],
  [Q, "It will rain {when}, {name}.", "______ ______ rain {when}, {name}?", ["Will", "it"], W_IT, { when: ["tomorrow", "tonight", "this afternoon", "on Saturday"], name: NAME }],
  [Q, "It is {h} o'clock, {name}.", "What time ______ ______, {name}?", ["is", "it"], W_IT, { h: ["six", "seven", "eight", "nine"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(key === "It's" ? { acceptable: ["It is"] } : {}), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the weather today.", "It's … today.", ["exactly one sentence", "It as the subject", "no There is + adjective"]],
  ["Write one sentence saying what time it is now.", "It's … o'clock.", ["exactly one sentence", "It's + time", "no They are"]],
  ["Write one sentence about how far your home is from your school or work.", "It's about … kilometres from my house to …", ["exactly one sentence", "It's + distance", "from … to …"]],
  ["Write one sentence about how long your journey to school or work takes.", "It takes me … to get to …", ["exactly one sentence", "It takes + time", "a present verb"]],
  ["Write one sentence about the weather yesterday.", "It was … yesterday.", ["exactly one sentence", "It was", "a past time word"]],
  ["Write one sentence about the weather tomorrow.", "It will be … tomorrow.", ["exactly one sentence", "It will", "a future time word"]],
  ["Write one question about the distance to a place.", "Is it far to …?", ["exactly one question", "Is it", "a place"]],
  ["Write two sentences: one with It's for weather and one with There are for things.", "It's sunny. There are …", ["exactly two sentences", "It for weather", "There for things that exist"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe the weather in your town in winter and in summer.", "In winter it's … In summer it …", ["It as the subject", "weather words", "three or four sentences"]],
  ["Describe your journey to school or work.", "It's about … kilometres. It takes me … It's …", ["It's + distance", "It takes + time", "three or four sentences"]],
  ["Write a message to a friend who is visiting tomorrow: weather, time, distance.", "It will be … It takes … It's not far …", ["dummy it", "future and present", "three or four sentences"]],
  ["Describe a day when the weather changed your plans.", "It was raining, so … Then it got …", ["It was / It got", "past verbs", "three or four sentences"]],
  ["Describe your favourite season.", "It's warm … It gets dark … There are …", ["It for weather", "There for things", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.personal.dummy-it.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);