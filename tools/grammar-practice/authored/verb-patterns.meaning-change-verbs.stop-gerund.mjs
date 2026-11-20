// Hand-authored: verb-patterns / meaning-change-verbs / stop-gerund (B1).
// Wave C, C31 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item): stop + -ing = finish an activity, not do it any
// more ("I stopped working because I was tired").
// Triage: kept. Siblings stop-infinitive (C32, stop + to = stop in order to do
// something) and stop-contrast (C30, both). One right answer: "stop + to" is English
// with a purpose meaning, so every line makes that reading impossible (the rain
// stopped; stop talking!; because I was tired; any more).
// Choose: -ing / to + base / base / past.
// Build: -ing of the verb in brackets.
// Transform: 5 correct the mistake / 5 I don't X any more → I stopped X-ing /
// 5 Don't X! → Stop X-ing!
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/verb-patterns.meaning-change-verbs.stop-gerund.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "meaning-change-verbs", topic: "stop-gerund", level: "B1", pv: "2.5" };
const NAME = ["Akmal", "Nodira", "Sherzod", "Gulnora"];
const NAME2 = ["Jamshid", "Malika", "Otabek", "Dilnoza"];
const S = (ing, base, past) => [ing, `to ${base}`, base, past];
const WHY = (ing, cue) => `${cue}: the activity ends, so stop + -ing (${ing}).`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [S("working", "work", "worked"), "I stopped ______ at {time} because I was very tired, {name}.", { time: ["ten", "nine", "midnight", "eleven"], name: NAME }, "\"Because I was tired\" = I finished work"],
  [S("raining", "rain", "rained"), "It stopped ______ at last, so we went to the {place}.", { place: ["park", "bazaar", "beach", "stadium"], x: [] }, "The rain ended"],
  [S("talking", "talk", "talked"), "Please stop ______! The {show} is starting, {name}.", { show: ["film", "concert", "lesson", "play"], name: NAME2 }, "Be quiet now: stop the talking"],
  [S("crying", "cry", "cried"), "The baby stopped ______ when her {who} came home.", { who: ["mother", "father", "grandma", "sister"], x: [] }, "The crying ended"],
  [S("eating", "eat", "ate"), "My uncle has stopped ______ {food}. The doctor said it was bad for him.", { food: ["sugar", "fried food", "fast food", "fatty meat"], x: [] }, "He doesn't eat it any more"],
  [S("playing", "play", "played"), "Stop ______ games and do your {work}, {name}!", { work: ["homework", "chores", "revision", "project"], name: NAME }, "End the games now"],
  [S("laughing", "laugh", "laughed"), "Everyone stopped ______ when the {who} came in.", { who: ["teacher", "director", "boss", "coach"], x: [] }, "The laughing ended"],
  [S("using", "use", "used"), "I stopped ______ my old {thing} when I got a new one, {name}.", { thing: ["phone", "laptop", "bike", "camera"], name: NAME2 }, "I don't use it any more"],
  [S("snowing", "snow", "snowed"), "When did it stop ______ in {city}, {name}?", { city: ["Moscow", "Tashkent", "Almaty", "Astana"], name: NAME }, "The snow ended"],
  [S("making", "make", "made"), "Can you stop ______ so much noise in the {room}, {name}?", { room: ["kitchen", "hall", "yard", "next room"], name: NAME2 }, "End the noise"],
  [S("drinking", "drink", "drank"), "She stopped ______ {drink} after six to sleep better.", { drink: ["coffee", "strong tea", "cola", "energy drinks"], x: [] }, "She doesn't drink it any more"],
  [S("watching", "watch", "watched"), "We stopped ______ that {show}. It got boring, {name}.", { show: ["series", "show", "cartoon", "programme"], name: NAME }, "\"It got boring\" = we don't watch it now"],
  [S("worrying", "worry", "worried"), "Stop ______ about the {test}. You'll be fine, {name}.", { test: ["exam", "interview", "match", "results"], name: NAME2 }, "End the worry now"],
  [S("running", "run", "ran"), "The tap in the {room} has stopped ______, {name}.", { room: ["kitchen", "bathroom", "garden", "yard"], name: NAME }, "The water ended"],
  [S("buying", "buy", "bought"), "My parents stopped ______ newspapers years ago.", { x: [], y: [] }, "They don't buy them any more"],
  [S("calling", "call", "called"), "Why did your {who} stop ______ you, {name}?", { who: ["cousin", "friend", "aunt", "brother"], name: NAME2 }, "The calls ended"],
  [S("shouting", "shout", "shouted"), "Please stop ______ at your little {who}, {name}.", { who: ["brother", "sister", "cousin", "son"], name: NAME }, "End the shouting"],
  [S("growing", "grow", "grew"), "This {tree} stopped ______ years ago.", { tree: ["apple tree", "palm tree", "plant", "vine"], x: [] }, "It doesn't grow any more"],
  [S("learning", "learn", "learned"), "Never stop ______, {name}. Even at seventy!", { name: NAME2, x: [] }, "Don't ever end your learning"],
  [S("ringing", "ring", "rang"), "The phone in the {room} finally stopped ______.", { room: ["office", "hall", "kitchen", "classroom"], x: [] }, "The ringing ended"],
].map(([o, prompt, slots, cue], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  if (!Object.keys(s).length) s.who = ["parents", "grandparents", "neighbours", "uncles"];
  const p = Object.keys(s).includes("who") && !prompt.includes("{who}") ? prompt.replace("My parents", "My {who}") : prompt;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(o[0]), why: WHY(o[0], cue), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "The activity ends. Complete with the right form of the verb in brackets.";
const BUILD = [
  ["working", "My dad stopped ______ (work) at the {place} last year.", { place: ["factory", "bank", "bazaar", "hospital"], x: [] }],
  ["raining", "Has it stopped ______ (rain) in {city} yet, {name}?", { city: ["Tashkent", "Fergana", "Samarkand", "Nukus"], name: NAME }],
  ["talking", "Stop ______ (talk) and listen to the {who}, {name}!", { who: ["teacher", "guide", "coach", "doctor"], name: NAME2 }],
  ["crying", "The little boy stopped ______ (cry) when he got his {thing}.", { thing: ["ball", "ice cream", "toy", "sweet"], x: [] }],
  ["eating", "I've stopped ______ (eat) {food} at night, {name}.", { food: ["bread", "sweets", "fast food", "fried food"], name: NAME }],
  ["playing", "The children stopped ______ (play) in the {place} when it got dark.", { place: ["yard", "park", "street", "garden"], x: [] }],
  ["using", "We stopped ______ (use) plastic bags at the {shop}, {name}.", { shop: ["bazaar", "supermarket", "shop", "market"], name: NAME2 }],
  ["snowing", "It stopped ______ (snow) in the morning, so we went to the {place}.", { place: ["mountains", "park", "school", "shops"], x: [] }],
  ["making", "Please stop ______ (make) jokes about my {thing}, {name}.", { thing: ["hair", "accent", "shoes", "car"], name: NAME }],
  ["drinking", "Grandpa stopped ______ (drink) {drink} after his heart problem.", { drink: ["coffee", "cola", "strong tea", "sweet drinks"], x: [] }],
  ["watching", "I stopped ______ (watch) {show} in the evenings and started reading, {name}.", { show: ["TV", "the news", "cartoons", "football"], name: NAME2 }],
  ["worrying", "Stop ______ (worry) about the {thing}, {name}. It's fine.", { thing: ["money", "test", "trip", "car"], name: NAME }],
  ["shouting", "The {who} stopped ______ (shout) when the police— no, when the manager came.", { who: ["x"], x: [] }],
  ["laughing", "We couldn't stop ______ (laugh) at the {show}, {name}.", { show: ["film", "cartoon", "comedy", "joke"], name: NAME2 }],
  ["buying", "My sister stopped ______ (buy) clothes online after a bad {thing}.", { thing: ["order", "experience", "delivery", "dress"], x: [] }],
  ["calling", "The {who} stopped ______ (call) me after the interview, {name}.", { who: ["company", "manager", "agency", "school"], name: NAME }],
  ["growing", "My {who} has stopped ______ (grow), {name}. He's still short!", { who: ["little brother", "son", "nephew", "cousin"], name: NAME2 }],
  ["ringing", "The alarm stopped ______ (ring) after {n} minutes.", { n: ["two", "five", "ten", "three"], x: [] }],
  ["going", "She stopped ______ (go) to the {place} because it was too expensive.", { place: ["gym", "pool", "club", "café"], x: [] }],
  ["complaining", "Stop ______ (complain) about the {thing}, {name}!", { thing: ["food", "weather", "traffic", "homework"], name: NAME }],
].filter(([k]) => k !== "shouting").map(([key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: `The activity ends: stop + -ing (${key}).`, slots: s };
});
BUILD.push({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: "The neighbours stopped ______ (argue) when the {who} knocked on the door, {name}.", key: "arguing", why: "The arguing ended: stop + -ing (arguing).", slots: { who: ["caretaker", "landlord", "old man", "neighbour"], name: NAME2 } });

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const ANY = "Rewrite with stopped + -ing.";
const IMP = "Rewrite with Stop + -ing.";
const TRANSFORM = [
  [FIX, "It stopped to rain, so we went out to the {place}, {name}.", "It stopped ______, so we went out to the {place}, {name}.", "raining", { place: ["park", "bazaar", "beach", "stadium"], name: NAME }, "The rain ended: stop + -ing."],
  [FIX, "Please stop talk during the {show}, {name}.", "Please stop ______ during the {show}, {name}.", "talking", { show: ["film", "concert", "lesson", "play"], name: NAME2 }, "stop + -ing: talking."],
  [FIX, "My uncle has stopped eat {food}, {name}.", "My uncle has stopped ______ {food}, {name}.", "eating", { food: ["sugar", "fried food", "fast food", "fatty meat"], name: NAME }, "stop + -ing: eating."],
  [FIX, "The baby stopped cried when her {who} came.", "The baby stopped ______ when her {who} came.", "crying", { who: ["mother", "father", "grandma", "sister"], x: [] }, "stop + -ing: crying."],
  [FIX, "I stopped to work at {time} because I was tired, {name}.", "I stopped ______ at {time} because I was tired, {name}.", "working", { time: ["ten", "nine", "midnight", "eleven"], name: NAME2 }, "\"Because I was tired\" = the work ended: working."],
  [ANY, "I don't drink {drink} any more, {name}.", "I stopped ______ {drink}, {name}.", "drinking", { drink: ["coffee", "cola", "strong tea", "energy drinks"], name: NAME }, "Not any more = stopped + -ing."],
  [ANY, "My parents don't buy {thing} any more, {name}.", "My parents stopped ______ {thing}, {name}.", "buying", { thing: ["newspapers", "magazines", "CDs", "DVDs"], name: NAME2 }, "Not any more = stopped + -ing."],
  [ANY, "We don't watch that {show} any more, {name}.", "We stopped ______ that {show}, {name}.", "watching", { show: ["series", "show", "cartoon", "programme"], name: NAME }, "Not any more = stopped + -ing."],
  [ANY, "She doesn't go to the {place} any more, {name}.", "She stopped ______ to the {place}, {name}.", "going", { place: ["gym", "pool", "club", "café"], name: NAME2 }, "Not any more = stopped + -ing."],
  [ANY, "My grandpa doesn't drive in {city} any more.", "My grandpa stopped ______ in {city}.", "driving", { city: ["Tashkent", "Moscow", "Almaty", "Samarkand"], x: [] }, "Not any more = stopped + -ing."],
  [IMP, "Don't make so much noise in the {room}, {name}!", "Stop ______ so much noise in the {room}, {name}!", "making", { room: ["kitchen", "hall", "yard", "classroom"], name: NAME }, "Don't X = Stop X-ing."],
  [IMP, "Don't worry about the {test}, {name}!", "Stop ______ about the {test}, {name}!", "worrying", { test: ["exam", "interview", "match", "results"], name: NAME2 }, "Don't X = Stop X-ing."],
  [IMP, "Don't shout at your {who}, {name}!", "Stop ______ at your {who}, {name}!", "shouting", { who: ["brother", "sister", "cousin", "son"], name: NAME }, "Don't X = Stop X-ing."],
  [IMP, "Don't play games now. Do your {work}, {name}!", "Stop ______ games now. Do your {work}, {name}!", "playing", { work: ["homework", "chores", "revision", "project"], name: NAME2 }, "Don't X = Stop X-ing."],
  [IMP, "Don't complain about the {thing}, {name}!", "Stop ______ about the {thing}, {name}!", "complaining", { thing: ["food", "weather", "traffic", "homework"], name: NAME }, "Don't X = Stop X-ing."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a habit you stopped.", "I stopped + -ing", ["exactly one sentence", "stopped + -ing", "past"]],
  ["Write one sentence about the weather with stopped + -ing.", "It stopped raining / snowing", ["exactly one sentence", "stopped + -ing", "weather"]],
  ["Write one request with Please stop + -ing.", "Please stop + -ing", ["exactly one sentence", "stop + -ing", "please"]],
  ["Write one sentence about something a family member has stopped doing.", "My … has stopped + -ing", ["exactly one sentence", "has stopped + -ing", "a family member"]],
  ["Write one sentence with stop + -ing and one with stop + to.", "stop doing vs stop to do", ["exactly two sentences", "stop + -ing (end)", "stop + to (purpose)"]],
  ["Write one sentence with couldn't stop + -ing.", "I couldn't stop laughing …", ["exactly one sentence", "couldn't stop", "-ing"]],
  ["Write one sentence about something you want to stop doing.", "I want to stop + -ing", ["exactly one sentence", "stop + -ing", "a habit"]],
  ["Write one sentence with Never stop + -ing.", "Never stop + -ing", ["exactly one sentence", "never stop", "-ing"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write three or four sentences about habits you have stopped and why.", "stopped + -ing", ["stopped", "-ing", "three or four sentences"]],
  ["Your little brother is very noisy. Write three or four sentences with Stop + -ing.", "Stop + -ing", ["stop", "-ing", "three or four sentences"]],
  ["Describe a storm that finally ended. Write three or four sentences.", "stopped raining / blowing", ["stopped", "-ing", "three or four sentences"]],
  ["Write three or four sentences about a funny moment when you couldn't stop laughing.", "couldn't stop + -ing", ["stop", "-ing", "three or four sentences"]],
  ["Give a friend three or four pieces of advice for a healthier life with stop + -ing.", "stop + -ing", ["stop", "-ing", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.meaning-change-verbs.stop-gerund.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
