// Hand-authored: adj-adv / adjective-form / ed-vs-ing (B1).
// Wave C, C33 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement items): -ing adjectives describe the thing that causes a
// feeling (a boring lesson), -ed adjectives describe how a person feels (I was bored).
// One right answer: "I was boring" is English (= I bored other people), so every -ed
// line ties the person to the feeling with its preposition or result (excited about,
// interested in, bored … so I fell asleep, surprised by), and every -ing line has a
// thing as the subject (the film, the news, the trip).
// Choose: 10 -ing keys / 10 -ed keys; options -ing / -ed / verb / noun.
// Build: 15 one word from the verb in brackets; 5 both forms in one sentence (array
// key, the placement gap item).
// Transform: 5 correct the mistake / 5 X bored me → X was boring / 5 X surprised us →
// We were surprised.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/adj-adv.adjective-form.ed-vs-ing.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "adjective-form", topic: "ed-vs-ing", level: "B1", pv: "2.5" };
const NAME = ["Feruza", "Akmal", "Malika", "Sardor"];
const NAME2 = ["Nodira", "Otabek", "Zarina", "Jamshid"];
// [-ing, -ed, verb, noun]
const W = {
  bore: ["boring", "bored", "bore", "boredom"], excite: ["exciting", "excited", "excite", "excitement"], interest: ["interesting", "interested", "interest", "interests"],
  tire: ["tiring", "tired", "tire", "tiredness"], surprise: ["surprising", "surprised", "surprise", "surprises"], worry: ["worrying", "worried", "worry", "worries"],
  frighten: ["frightening", "frightened", "frighten", "fright"], disappoint: ["disappointing", "disappointed", "disappoint", "disappointment"],
  embarrass: ["embarrassing", "embarrassed", "embarrass", "embarrassment"], confuse: ["confusing", "confused", "confuse", "confusion"], relax: ["relaxing", "relaxed", "relax", "relaxation"],
  amaze: ["amazing", "amazed", "amaze", "amazement"], annoy: ["annoying", "annoyed", "annoy", "annoyance"], shock: ["shocking", "shocked", "shock", "shocks"],
};
const ING = (v) => W[v];
const ED = (v) => [W[v][1], W[v][0], W[v][2], W[v][3]];

/* ---------------- choose: 20 mcq ---------------- */
// [options, prompt, slots, why]
const CHOOSE = [
  [ING("bore"), "The {thing} was so ______ that half the class fell asleep.", { thing: ["lecture", "lesson", "film", "speech"], x: [] }, "The lesson causes the feeling: boring."],
  [ED("excite"), "I'm really ______ about my trip to {city}, {name}.", { city: ["Istanbul", "Seoul", "Dubai", "Samarkand"], name: NAME }, "I feel it (excited about …): -ed."],
  [ING("interest"), "That was a very ______ {thing} about the Silk Road, {name}.", { thing: ["book", "film", "talk", "museum"], name: NAME2 }, "The book makes people interested: interesting."],
  [ED("tire"), "After the {event}, the players were very ______ and went to bed early.", { event: ["match", "race", "long trip", "training"], x: [] }, "The players feel it, and they went to bed: tired."],
  [ING("surprise"), "The end of the {film} was really ______, {name}.", { film: ["film", "book", "match", "story"], name: NAME }, "The ending causes surprise: surprising."],
  [ED("worry"), "My mum gets ______ when I come home late from the {place}.", { place: ["party", "gym", "library", "club"], x: [] }, "Mum feels it: worried."],
  [ING("frighten"), "The storm last night was really ______, {name}.", { name: NAME2, x: [] }, "The storm causes fear: frightening."],
  [ED("disappoint"), "We were ______ with the hotel in {city}. The room was dirty.", { city: ["Bukhara", "Antalya", "Moscow", "Dubai"], x: [] }, "We felt it (disappointed with …): -ed."],
  [ING("embarrass"), "Falling on the stage at the {event} was very ______, {name}.", { event: ["concert", "school party", "wedding", "graduation"], name: NAME }, "The fall causes the feeling: embarrassing."],
  [ED("confuse"), "I was ______ by the new {thing}. Can you explain it again, {name}?", { thing: ["timetable", "rules", "app", "map"], name: NAME2 }, "I feel it (confused by …): -ed."],
  [ING("relax"), "A walk by the {water} in the evening is very ______.", { water: ["river", "lake", "sea", "canal"], x: [] }, "The walk causes the feeling: relaxing."],
  [ED("bore"), "I was so ______ in the {event} that I started drawing in my notebook, {name}.", { event: ["meeting", "lecture", "lesson", "seminar"], name: NAME }, "I felt it and started drawing: bored."],
  [ING("amaze"), "The view from the top of the {sight} was ______, {name}.", { sight: ["mountain", "tower", "hill", "bridge"], name: NAME2 }, "The view causes amazement: amazing."],
  [ED("interest"), "My brother is very ______ in {topic}, {name}.", { topic: ["history", "football", "space", "cars"], name: NAME }, "He feels it (interested in …): -ed."],
  [ING("annoy"), "The noise from the {place} next door is really ______.", { place: ["building site", "café", "flat", "garage"], x: [] }, "The noise causes the feeling: annoying."],
  [ED("surprise"), "We were ______ by the price of the {thing} in {city}.", { thing: ["taxi", "hotel", "coffee", "tickets"], city: ["London", "Dubai", "Paris", "Moscow"] }, "We felt it (surprised by …): -ed."],
  [ING("tire"), "Moving to a new {home} is very ______, {name}.", { home: ["flat", "house", "city", "office"], name: NAME2 }, "Moving causes the feeling: tiring."],
  [ED("frighten"), "The little girl was ______ of the big {animal}, {name}.", { animal: ["dog", "horse", "camel", "goose"], name: NAME }, "She feels it (frightened of …): -ed."],
  [ING("shock"), "The news about the {event} was ______ for everyone.", { event: ["accident", "fire", "flood", "earthquake"], x: [] }, "The news causes the feeling: shocking."],
  [ED("embarrass"), "He felt ______ when he forgot his {who}'s name, {name}.", { who: ["teacher", "boss", "neighbour", "classmate"], name: NAME2 }, "He felt it: embarrassed."],
].map(([o, prompt, slots, why], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  if (Object.keys(s).length < 2 && !prompt.includes("{name}")) s.name = NAME;
  const p = s.name && !prompt.includes("{name}") ? prompt.replace(/\.$/, ", {name}.") : prompt;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 15 single + 5 double ---------------- */
const INSTR = "Complete with the -ing or -ed adjective of the word in brackets.";
const INSTR2 = "Complete both gaps: how the person feels (-ed) and what causes it (-ing).";
const BUILD = [
  [INSTR, "boring", "Nobody laughed. The {show} was really ______ (bore), {name}.", { show: ["show", "film", "play", "concert"], name: NAME }, "The show causes the feeling: boring."],
  [INSTR, "excited", "The children were ______ (excite) about the trip to the {place}.", { place: ["zoo", "mountains", "lake", "water park"], x: [] }, "The children feel it (excited about …)."],
  [INSTR, "interesting", "We read an ______ (interest) article about {topic}, {name}.", { topic: ["space", "the Silk Road", "dinosaurs", "Amir Temur"], name: NAME2 }, "The article causes interest: interesting."],
  [INSTR, "tired", "I'm too ______ (tire) to cook tonight, {name}. Let's eat at the {place}.", { name: NAME, place: ["café", "chaikhana", "canteen", "restaurant"] }, "I feel it: tired."],
  [INSTR, "amazing", "The test results were ______ (amaze). Everyone passed the {test}, {name}!", { test: ["exam", "test", "quiz", "driving test"], name: NAME2 }, "The results cause amazement: amazing."],
  [INSTR, "worried", "Grandma is ______ (worry) about her {thing}, {name}.", { thing: ["garden", "cat", "health", "car"], name: NAME2 }, "Grandma feels it (worried about …)."],
  [INSTR, "frightening", "The {film} was so ______ (frighten) that my sister closed her eyes.", { film: ["film", "story", "cartoon", "game"], x: [] }, "The film causes fear: frightening."],
  [INSTR, "disappointed", "Our fans were ______ (disappoint) with the result of the {match}.", { match: ["match", "final", "game", "race"], x: [] }, "The fans feel it (disappointed with …)."],
  [INSTR, "embarrassing", "Singing alone at the {event} was really ______ (embarrass), {name}.", { event: ["wedding", "party", "lesson", "concert"], name: NAME }, "The singing causes the feeling: embarrassing."],
  [INSTR, "confused", "The tourists were ______ (confuse) by the bus map in {city}.", { city: ["Tashkent", "Istanbul", "Moscow", "Seoul"], x: [] }, "The tourists feel it (confused by …)."],
  [INSTR, "relaxing", "A cup of green tea in the {place} is very ______ (relax), {name}.", { place: ["garden", "evening", "shade", "chaikhana"], name: NAME2 }, "The tea causes the feeling: relaxing."],
  [INSTR, "amazed", "I was ______ (amaze) by the old buildings in {city}, {name}.", { city: ["Khiva", "Bukhara", "Samarkand", "Istanbul"], name: NAME }, "I feel it (amazed by …)."],
  [INSTR, "annoying", "My little brother's {habit} is so ______ (annoy), {name}.", { habit: ["singing", "whistling", "music", "phone game"], name: NAME2 }, "The singing causes the feeling: annoying."],
  [INSTR, "shocked", "We were ______ (shock) when we saw the {thing}.", { thing: ["bill", "broken window", "price", "flood"], x: [] }, "We feel it: shocked."],
  [INSTR, "interested", "Are you ______ (interest) in {topic}, {name}?", { topic: ["art", "football", "music", "science"], name: NAME }, "You feel it (interested in …)."],
  [INSTR2, ["amazed", "amazing"], "I was really ______ (amaze) by the end — it was the most ______ (amaze) {film} I've seen this year.", { film: ["film", "book", "story", "show"], x: [] }, "Feeling → amazed; the film causes it → amazing."],
  [INSTR2, ["bored", "boring"], "The students were ______ (bore) because the {thing} was so ______ (bore).", { thing: ["lecture", "lesson", "film", "speech"], x: [] }, "Feeling → bored; the lesson causes it → boring."],
  [INSTR2, ["tired", "tiring"], "We were ______ (tire) after the trip — the drive to {city} was very ______ (tire).", { city: ["Nukus", "Termez", "Khiva", "Almaty"], x: [] }, "Feeling → tired; the drive causes it → tiring."],
  [INSTR2, ["excited", "exciting"], "The fans were ______ (excite) because the {match} was really ______ (excite).", { match: ["match", "final", "race", "game"], x: [] }, "Feeling → excited; the match causes it → exciting."],
  [INSTR2, ["confused", "confusing"], "I was ______ (confuse) because the instructions for the {thing} were ______ (confuse).", { thing: ["printer", "game", "form", "app"], x: [] }, "Feeling → confused; the instructions cause it → confusing."],
].map(([instr, key, source, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  if (Object.keys(s).length < 2 && !source.includes("{name}")) s.name = NAME2;
  const src = s.name && !source.includes("{name}") ? source.replace(/\.$/, ", {name}.") : source;
  return { ...BASE, stage: "build", format: "gap_fill", instr, source: src, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const THING = "Rewrite. Describe the thing with an -ing adjective.";
const PERSON = "Rewrite. Say how the people felt with an -ed adjective.";
const TRANSFORM = [
  [FIX, "I am very exciting about my trip to {city}, {name}.", "I am very ______ about my trip to {city}, {name}.", "excited", { city: ["Istanbul", "Seoul", "Dubai", "Samarkand"], name: NAME }, "The person feels it: excited."],
  [FIX, "The {thing} was so bored that I fell asleep, {name}.", "The {thing} was so ______ that I fell asleep, {name}.", "boring", { thing: ["film", "lecture", "lesson", "speech"], name: NAME2 }, "The film causes the feeling: boring."],
  [FIX, "My mum was worrying about the {thing}, {name}.", "My mum was ______ about the {thing}, {name}.", "worried", { thing: ["exam", "trip", "weather", "money"], name: NAME }, "Mum feels it (worried about …)."],
  [FIX, "The view from the {sight} was amazed, {name}.", "The view from the {sight} was ______, {name}.", "amazing", { sight: ["mountain", "tower", "hill", "bridge"], name: NAME2 }, "The view causes the feeling: amazing."],
  [FIX, "Are you interesting in {topic}, {name}?", "Are you ______ in {topic}, {name}?", "interested", { topic: ["art", "football", "music", "science"], name: NAME }, "You feel it (interested in …)."],
  [THING, "The {thing} bored everyone, {name}.", "The {thing} was ______, {name}.", "boring", { thing: ["film", "lecture", "match", "speech"], name: NAME2 }, "It caused boredom: boring."],
  [THING, "The long walk in the {place} tired us, {name}.", "The long walk in the {place} was ______, {name}.", "tiring", { place: ["mountains", "desert", "old town", "park"], name: NAME }, "It caused tiredness: tiring."],
  [THING, "The news about the {event} shocked us, {name}.", "The news about the {event} was ______, {name}.", "shocking", { event: ["accident", "fire", "flood", "earthquake"], name: NAME2 }, "It caused shock: shocking."],
  [THING, "The new rules at the {place} confuse everybody, {name}.", "The new rules at the {place} are ______, {name}.", "confusing", { place: ["school", "office", "airport", "gym"], name: NAME }, "They cause confusion: confusing."],
  [THING, "The {show} really interested my son, {name}.", "The {show} was really ______, {name}.", "interesting", { show: ["museum", "film", "book", "talk"], name: NAME2 }, "It caused interest: interesting."],
  [PERSON, "The ending of the {film} shocked us, {name}.", "We were ______ by the ending of the {film}, {name}.", "shocked", { film: ["film", "book", "match", "story"], name: NAME }, "We felt it: shocked by …."],
  [PERSON, "The thunder frightened the {who}, {name}.", "The {who} were ______ of the thunder, {name}.", "frightened", { who: ["children", "dogs", "horses", "babies"], name: NAME2 }, "They felt it: frightened of …."],
  [PERSON, "The hotel in {city} disappointed us, {name}.", "We were ______ with the hotel in {city}, {name}.", "disappointed", { city: ["Bukhara", "Antalya", "Moscow", "Dubai"], name: NAME }, "We felt it: disappointed with …."],
  [PERSON, "The {thing} annoyed my dad, {name}.", "My dad was ______ by the {thing}, {name}.", "annoyed", { thing: ["noise", "traffic", "queue", "music"], name: NAME2 }, "He felt it: annoyed by …."],
  [PERSON, "The old buildings in {city} amazed the tourists, {name}.", "The tourists were ______ by the old buildings in {city}, {name}.", "amazed", { city: ["Khiva", "Bukhara", "Samarkand", "Istanbul"], name: NAME }, "They felt it: amazed by …."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a film you saw. Use an -ing adjective.", "The film was boring / exciting …", ["exactly one sentence", "-ing adjective", "a thing"]],
  ["Write one sentence about how you felt after the film. Use an -ed adjective.", "I was bored / excited …", ["exactly one sentence", "-ed adjective", "a person"]],
  ["Write one sentence with both forms: I was … because it was ….", "I was -ed because it was -ing", ["exactly one sentence", "-ed", "-ing"]],
  ["Write one sentence with interested in.", "I'm interested in …", ["exactly one sentence", "interested in", "a topic"]],
  ["Write one sentence about something tiring you did this week.", "… was tiring", ["exactly one sentence", "tiring", "past"]],
  ["Write one sentence about a time you felt embarrassed.", "I felt embarrassed when …", ["exactly one sentence", "embarrassed", "when"]],
  ["Write one sentence about a surprising piece of news.", "The news was surprising", ["exactly one sentence", "surprising", "news"]],
  ["Write one sentence with worried about.", "… is worried about …", ["exactly one sentence", "worried about", "a person"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your last holiday. What was exciting, tiring or disappointing? How did you feel? Write three or four sentences.", "-ed and -ing adjectives", ["-ing adjectives", "-ed adjectives", "three or four sentences"]],
  ["Write a short review (three or four sentences) of a film or book.", "-ing for the film, -ed for you", ["-ing", "-ed", "three or four sentences"]],
  ["Describe your first day at a new school or job. Write three or four sentences.", "feelings and causes", ["-ed", "-ing", "three or four sentences"]],
  ["Write three or four sentences about a match you watched.", "exciting / disappointed …", ["-ing", "-ed", "three or four sentences"]],
  ["Write three or four sentences about things that annoy you and how they make you feel.", "annoying / annoyed", ["-ing", "-ed", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.adjective-form.ed-vs-ing.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
