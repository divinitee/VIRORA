// Hand-authored: prep-phrasal / time / during-while (B1).
// Wave C, C38 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item: "My phone rang twice ______ the meeting" → during):
// during + a noun (during the film, during the night); while + subject + verb (while I
// was cooking, while we were in Bukhara).
// One right answer: "during cooking" is English (during + -ing noun), so no while key
// is followed by a bare -ing; every while key has a subject + verb after it.
// at / for / since are never options (at the meeting, for = because, since = because).
// Choose: 10 during / 10 while; options during / while / meanwhile / whereas.
// Build: 20 typed one word. Transform: 5 while we were having X → during X / 5 during
// X → while I was … / 5 correct the mistake.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.time.during-while.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "time", topic: "during-while", level: "B1", pv: "2.5" };
const NAME = ["Otabek", "Dilnoza", "Jamshid", "Zarina"];
const NAME2 = ["Sherzod", "Gulnora", "Akmal", "Feruza"];
const SET = ["during", "while", "meanwhile", "whereas"];

const fill = (text, slots, fallback) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && text.includes(`{${n}}`)) s[n] = f;
  if (text.includes("{name}") && !s.name) s.name = fallback;
  return s;
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["during", "My phone rang twice ______ the {event}, {name}.", { event: ["meeting", "lesson", "exam", "concert"] }, "\"the meeting\" is a noun: during."],
  ["while", "Someone called ______ I was in the {room}, {name}.", { room: ["shower", "kitchen", "garden", "garage"] }, "\"I was in the shower\" has a subject and verb: while."],
  ["during", "Grandpa fell asleep ______ the {film}, {name}.", { film: ["film", "match", "news", "speech"] }, "\"the film\" is a noun: during."],
  ["while", "The {who} arrived ______ we were having dinner, {name}.", { who: ["guests", "neighbours", "cousins", "plumber"] }, "\"we were having dinner\" is a clause: while."],
  ["during", "It snowed a lot ______ the night in {city}.", { city: ["Tashkent", "Chimgan", "Moscow", "Almaty"] }, "\"the night\" is a noun: during."],
  ["while", "I met my best friend ______ I was living in {city}, {name}.", { city: ["Kazan", "Seoul", "Istanbul", "Moscow"] }, "\"I was living\" has a subject and verb: while."],
  ["during", "Nobody may use a phone ______ the {test}, {name}.", { test: ["exam", "test", "interview", "lesson"] }, "\"the exam\" is a noun: during."],
  ["while", "Please don't talk ______ the {who} is speaking, {name}.", { who: ["teacher", "director", "guide", "doctor"] }, "\"the teacher is speaking\" is a clause: while."],
  ["during", "We visited lots of museums ______ our stay in {city}.", { city: ["Samarkand", "Bukhara", "Istanbul", "Paris"] }, "\"our stay\" is a noun: during."],
  ["while", "The lights went out ______ we were watching the {show}, {name}.", { show: ["final", "film", "concert", "news"] }, "\"we were watching\" is a clause: while."],
  ["during", "The {shop} is closed ______ the holidays, {name}.", { shop: ["bakery", "library", "gym", "school"] }, "\"the holidays\" is a noun: during."],
  ["while", "My little sister drew a picture ______ Mum was {job}, {name}.", { job: ["cooking", "on the phone", "at work", "driving"] }, "\"Mum was cooking\" has a subject and verb: while."],
  ["during", "I made lots of new friends ______ the summer {camp}, {name}.", { camp: ["camp", "course", "holidays", "school"] }, "\"the summer camp\" is a noun: during."],
  ["while", "Can you water the plants ______ we are in {city}, {name}?", { city: ["Antalya", "Dubai", "Bukhara", "Khiva"] }, "\"we are in Antalya\" is a clause: while."],
  ["during", "Two players got hurt ______ the {match}, {name}.", { match: ["match", "game", "final", "training"] }, "\"the match\" is a noun: during."],
  ["while", "I burnt my hand ______ I was making {food}, {name}.", { food: ["plov", "tea", "pancakes", "soup"] }, "\"I was making\" has a subject and verb: while."],
  ["during", "The baby woke up three times ______ the {time}.", { time: ["night", "flight", "storm", "concert"] }, "\"the night\" is a noun: during."],
  ["while", "The {who} waited in the car ______ I bought the tickets, {name}.", { who: ["kids", "girls", "boys", "guests"] }, "\"I bought the tickets\" is a clause: while."],
  ["during", "Please switch off your phones ______ the {event}.", { event: ["performance", "lesson", "flight", "ceremony"] }, "\"the performance\" is a noun: during."],
  ["while", "A dog ate my sandwich ______ I wasn't looking, {name}. We were at the {place}.", { place: ["bazaar", "station", "beach", "café"] }, "\"I wasn't looking\" is a clause: while."],
].map(([k, prompt, slots, why], i) => {
  let p = prompt;
  const s = fill(p, slots, NAME);
  if (!s.name && Object.keys(s).length < 2) { s.name = i % 2 ? NAME2 : NAME; p = p.replace(/([.!?])$/, ", {name}$1"); }
  const options = SET.map((_, j) => SET[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(k), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write during or while.";
const BUILD = [
  ["during", "I always feel sleepy ______ long {event}s, {name}.", { event: ["meeting", "lesson", "flight", "speech"] }, "\"long meetings\" is a noun: during."],
  ["while", "I listen to {thing} ______ I run in the park, {name}.", { thing: ["music", "podcasts", "the radio", "audiobooks"] }, "\"I run\" has a subject and verb: while."],
  ["during", "There was a power cut ______ the {storm}, {name}.", { storm: ["storm", "match", "wedding", "night"] }, "\"the storm\" is a noun: during."],
  ["while", "The phone rang ______ I was {job}, {name}.", { job: ["asleep", "in the bath", "out", "at the bazaar"] }, "\"I was asleep\" is a clause: while."],
  ["during", "My uncle worked in {city} ______ the 1990s, {name}.", { city: ["Moscow", "Seoul", "Kazan", "Almaty"] }, "\"the 1990s\" is a noun: during."],
  ["while", "Wait in the hall ______ the {who} gets your papers ready, {name}.", { who: ["secretary", "nurse", "manager", "clerk"] }, "\"the secretary gets\" is a clause: while."],
  ["during", "Please don't eat ______ the {lesson}, {name}.", { lesson: ["lesson", "lecture", "test", "concert"] }, "\"the lesson\" is a noun: during."],
  ["while", "We met some tourists ______ we were walking round {city}, {name}.", { city: ["Khiva", "Samarkand", "Bukhara", "Istanbul"] }, "\"we were walking\" is a clause: while."],
  ["during", "The {place} is very busy ______ the day, {name}.", { place: ["bazaar", "station", "bank", "metro"] }, "\"the day\" is a noun: during."],
  ["while", "My brother broke his arm ______ he was playing {game}, {name}.", { game: ["football", "basketball", "volleyball", "tennis"] }, "\"he was playing\" is a clause: while."],
  ["during", "We stayed inside ______ the {weather}, {name}.", { weather: ["storm", "heatwave", "dust storm", "snowstorm"] }, "\"the storm\" is a noun: during."],
  ["while", "Can you hold my {thing} ______ I tie my shoes, {name}?", { thing: ["bag", "coffee", "phone", "keys"] }, "\"I tie my shoes\" is a clause: while."],
  ["during", "Lots of people get colds ______ the {season}, {name}.", { season: ["winter", "autumn", "cold months", "rainy season"] }, "\"the winter\" is a noun: during."],
  ["while", "Grandma told stories ______ we ate {food}, {name}.", { food: ["plov", "dinner", "breakfast", "manti"] }, "\"we ate\" has a subject and verb: while."],
  ["during", "The {who} slept ______ the whole {time}.", { who: ["baby", "children", "dog", "passengers"], time: ["journey", "flight", "film", "concert"] }, "\"the whole journey\" is a noun: during."],
  ["while", "My ice cream melted ______ I was in the {place}, {name}.", { place: ["shop", "library", "café", "gym"] }, "\"I was in the shop\" is a clause: while."],
  ["during", "The {who} asked a lot of questions ______ the {event}.", { who: ["students", "tourists", "parents", "journalists"], event: ["tour", "lecture", "meeting", "visit"] }, "\"the tour\" is a noun: during."],
  ["while", "Don't use your phone ______ you are driving, {name}.", { x: [] }, "\"you are driving\" is a clause: while."],
  ["during", "I read three books ______ my holiday in {city}, {name}.", { city: ["Antalya", "Dubai", "Issyk-Kul", "Batumi"] }, "\"my holiday\" is a noun: during."],
  ["while", "The {kids} played outside ______ their parents cooked, {name}.", { kids: ["children", "boys", "girls", "cousins"] }, "\"their parents cooked\" is a clause: while."],
].map(([key, source, slots, why], i) => {
  let src = source;
  const s = fill(src, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) {
    if (!s.name) { s.name = NAME2; src = src.replace(/([.!?])$/, ", {name}$1"); }
    else { s.where = ["in the city", "on the motorway", "at night", "in the rain"]; src = src.replace("driving, {name}", "driving {where}, {name}"); }
  }
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOUN = "Rewrite with during.";
const CLAUSE = "Rewrite with while.";
const FIX = "Correct the mistake.";
const TRANSFORM = [
  [NOUN, "My phone rang when we were having the {event}, {name}.", "My phone rang ______ the {event}, {name}.", "during", { event: ["meeting", "lesson", "interview", "dinner"] }, "the meeting is a noun: during."],
  [NOUN, "Dad fell asleep when we were watching the {show}, {name}.", "Dad fell asleep ______ the {show}, {name}.", "during", { show: ["film", "match", "news", "concert"] }, "the film is a noun: during."],
  [NOUN, "It rained when we were on our trip to {city}, {name}.", "It rained ______ our trip to {city}, {name}.", "during", { city: ["Khiva", "Bukhara", "Chimgan", "Termez"] }, "our trip is a noun: during."],
  [NOUN, "Two windows broke when the {storm} was happening, {name}.", "Two windows broke ______ the {storm}, {name}.", "during", { storm: ["storm", "earthquake", "match", "party"] }, "the storm is a noun: during."],
  [NOUN, "I lost my {thing} when we were on the flight, {name}.", "I lost my {thing} ______ the flight, {name}.", "during", { thing: ["ring", "pen", "scarf", "headphones"] }, "the flight is a noun: during."],
  [CLAUSE, "I met my wife during my holiday in {city}, {name}.", "I met my wife ______ I was on holiday in {city}, {name}.", "while", { city: ["Antalya", "Samarkand", "Dubai", "Batumi"] }, "I was on holiday is a clause: while."],
  [CLAUSE, "The baby slept during our drive to {city}, {name}.", "The baby slept ______ we drove to {city}, {name}.", "while", { city: ["Fergana", "Namangan", "Karshi", "Nukus"] }, "we drove is a clause: while."],
  [CLAUSE, "I hurt my knee during the {game}, {name}.", "I hurt my knee ______ I was playing {game}, {name}.", "while", { game: ["football", "basketball", "tennis", "volleyball"] }, "I was playing is a clause: while."],
  [CLAUSE, "The {who} came during our dinner, {name}.", "The {who} came ______ we were having dinner, {name}.", "while", { who: ["guests", "neighbours", "postman", "plumber"] }, "we were having dinner is a clause: while."],
  [CLAUSE, "I learned to cook during my stay in {city}, {name}.", "I learned to cook ______ I was staying in {city}, {name}.", "while", { city: ["Seoul", "Istanbul", "Rome", "Tokyo"] }, "I was staying is a clause: while."],
  [FIX, "Please be quiet while the {event}, {name}.", "Please be quiet ______ the {event}, {name}.", "during", { event: ["concert", "lesson", "ceremony", "exam"] }, "the concert is a noun, so not while: during."],
  [FIX, "I fell asleep during I was reading the {thing}, {name}.", "I fell asleep ______ I was reading the {thing}, {name}.", "while", { thing: ["book", "report", "newspaper", "article"] }, "I was reading is a clause, so not during: while."],
  [FIX, "We met many people while our trip to {city}, {name}.", "We met many people ______ our trip to {city}, {name}.", "during", { city: ["Samarkand", "Khiva", "Bukhara", "Andijan"] }, "our trip is a noun, so not while: during."],
  [FIX, "The {who} called during we were out, {name}.", "The {who} called ______ we were out, {name}.", "while", { who: ["doctor", "teacher", "bank", "landlord"] }, "we were out is a clause, so not during: while."],
  [FIX, "Mum cooked dinner during Dad was at the {place}, {name}.", "Mum cooked dinner ______ Dad was at the {place}, {name}.", "while", { place: ["bazaar", "gym", "bank", "office"] }, "Dad was at the bazaar is a clause, so not during: while."],
].map(([instr, source, hint, key, slots, why], i) => {
  const s = fill(source + hint, slots, i % 2 ? NAME2 : NAME);
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with during + a noun.", "during the film / the night", ["exactly one sentence", "during", "a noun after during"]],
  ["Write one sentence with while + subject + verb.", "while I was cooking", ["exactly one sentence", "while", "subject + verb after while"]],
  ["Write one sentence about something that happened during a holiday.", "during my holiday …", ["exactly one sentence", "during", "past"]],
  ["Write one sentence about something that happened while you were sleeping.", "while I was sleeping …", ["exactly one sentence", "while", "past continuous"]],
  ["Write one sentence about a rule at school or work. Use during.", "Don't … during the lesson", ["exactly one sentence", "during", "a rule"]],
  ["Write one sentence about two things you do at the same time. Use while.", "I … while I …", ["exactly one sentence", "while", "present simple"]],
  ["Write two sentences with the same meaning: one with during and one with while.", "during the film / while we were watching the film", ["exactly two sentences", "during + noun", "while + clause"]],
  ["Write one sentence with during the night.", "during the night", ["exactly one sentence", "during the night", "past"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a trip you made. What happened during the trip? Write three or four sentences with during and while.", "during + noun / while + clause", ["during", "while", "three or four sentences"]],
  ["Write three or four sentences about a funny or strange thing that happened while you were at school.", "while + clause", ["while", "during", "three or four sentences"]],
  ["Write three or four rules for a cinema or a library. Use during and while.", "during the film / while people are reading", ["during", "while", "three or four sentences"]],
  ["Describe a storm or a power cut you remember. Write three or four sentences.", "during the storm / while we were …", ["during", "while", "three or four sentences"]],
  ["Write three or four sentences about what you do while you travel on a bus or plane.", "while + clause / during the flight", ["while", "during", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.time.during-while.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "Only a noun phrase after the gap (the …): during.",
   "\"I was in the …\" has a subject and verb: while.",
   "\"the …\" with no verb after it: during.",
   "",
   "",
   "",
   "Through the whole … (a noun): during.",
   "\"the … is speaking\" is a clause: while.",
   "",
   "",
   "",
   "\"Mum was …\" has a subject and verb: while.",
   "\"the summer …\" is a noun: during.",
   "\"we are in …\" is a clause: while.",
   "At some point in the … (a noun): during.",
   "",
   "Across the whole … (a noun): during.",
   "",
   "For the whole … (a noun, no verb): during.",
   ""
  ],
  "build": [
   "",
   "",
   "A noun (the …), no subject or verb: during.",
   "\"I was …\" is a clause: while.",
   "",
   "\"the … gets\" is a clause: while.",
   "Within that class time (a noun): during.",
   "",
   "",
   "",
   "Bad weather is a noun here: during.",
   "",
   "A season is a noun: during.",
   "",
   "\"the whole …\" is a noun: during.",
   "\"I was in the …\" is a clause: while.",
   "In the … (a noun after the gap): during.",
   "",
   "",
   ""
  ],
  "transform": [
   "when we were having the … → during the ….",
   "when we were watching the … → during the ….",
   "",
   "when the … was happening → during the ….",
   "",
   "",
   "",
   "",
   "",
   "",
   "the … is a noun, so not while: during.",
   "",
   "",
   "",
   "Dad was at the … is a clause, so not during: while."
  ]
 }
};
{
  const byStage = (st) => items.filter((it) => it.stage === st);
  for (const [st, list] of Object.entries(VARIETY.why || {})) {
    if (list.length !== byStage(st).length) throw new Error(`VARIETY: ${st} has ${byStage(st).length} items, ${list.length} whys`);
    byStage(st).forEach((it, i) => { if (list[i]) it.why = list[i]; });
  }
  for (const [st, n, word, name, vals] of VARIETY.slot || []) {
    const it = byStage(st)[n - 1];
    if (!word) { if (!it?.slots?.[name]) throw new Error(`VARIETY: no slot ${name} in ${st} ${n}`); it.slots[name] = [...new Set([...it.slots[name], ...vals])]; continue; }
    const re = new RegExp(`(?<![\\w{])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w}])`, "g");
    let hit = false;
    for (const f of ["prompt", "source", "hint"]) if (it?.[f] && re.test(it[f])) { it[f] = it[f].replace(re, `{${name}}`); hit = true; re.lastIndex = 0; }
    if (!hit) throw new Error(`VARIETY: "${word}" not found in ${st} ${n}`);
    it.slots = { ...(it.slots || {}), [name]: vals };
  }
}
// end variety
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
