// Hand-authored: verb-patterns / meaning-change-verbs / stop-contrast (B1).
// Wave C, C30 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item, productive): the CHOICE between stop + -ing (the
// activity ends) and stop + to + base (stop in order to do something else), in the
// same kind of sentence. Siblings stop-gerund (C31) and stop-infinitive (C32) each
// drill one form; here half the keys are -ing and half are to + base, and every line
// gives the clue that decides (not any more / because I was tired → -ing; I was
// thirsty / we were lost → to).
// Choose: -ing / to + base / base / past, key by meaning (10 / 10).
// Build: "Write the -ing form or to + verb" (10 / 10); no source prints "to".
// Transform: 5 not any more → stopped + -ing / 5 stopped and X-ed (purpose) → stopped to X /
// 5 correct the mistake (both directions).
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/verb-patterns.meaning-change-verbs.stop-contrast.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "meaning-change-verbs", topic: "stop-contrast", level: "B1", pv: "2.5" };
const NAME = ["Ulugbek", "Gulnora", "Akmal", "Zarina"];
const NAME2 = ["Sherzod", "Dilnoza", "Otabek", "Nodira"];
const G = (ing, base, past) => [ing, `to ${base}`, base, past];
const I = (base, ing, past) => [`to ${base}`, ing, base, past];
const WG = (k, c) => `${c}: the activity ends, so stop + -ing (${k}).`;
const WI = (k, c) => `${c}: they stopped in order to do it, so stop + to (${k}).`;

/* ---------------- choose: 20 mcq ---------------- */
// [options, kind, cue, prompt, slots]
const CHOOSE = [
  [G("eating", "eat", "ate"), "g", "He doesn't eat it any more", "My uncle stopped ______ {food} last year. He feels better now, {name}.", { food: ["sugar", "fast food", "fried food", "white bread"], name: NAME }],
  [I("eat", "eating", "ate"), "i", "They were hungry", "We were hungry, so we stopped ______ at a café near {city}, {name}.", { city: ["Jizzakh", "Samarkand", "Gulistan", "Karshi"], name: NAME2 }],
  [G("talking", "talk", "talked"), "g", "Be quiet now", "Please stop ______. The {show} is starting, {name}.", { show: ["film", "lesson", "concert", "play"], name: NAME }],
  [I("talk", "talking", "talked"), "i", "I met an old friend", "I met my old {who} in the street and stopped ______ to her, {name}.", { who: ["teacher", "neighbour", "classmate", "friend"], name: NAME2 }],
  [G("raining", "rain", "rained"), "g", "The rain ended", "When it stopped ______, we went to the {place}, {name}.", { place: ["park", "bazaar", "beach", "stadium"], name: NAME }],
  [I("drink", "drinking", "drank"), "i", "I was thirsty", "I was thirsty, so I stopped ______ some water at the {place}, {name}.", { place: ["fountain", "kiosk", "shop", "café"], name: NAME2 }],
  [G("playing", "play", "played"), "g", "The game ended", "The children stopped ______ in the {place} when it got dark.", { place: ["yard", "park", "street", "garden"], x: [] }],
  [I("ask", "asking", "asked"), "i", "We were lost", "We were lost in {city}, so we stopped ______ a woman the way, {name}.", { city: ["Istanbul", "Bukhara", "Moscow", "Seoul"], name: NAME }],
  [G("working", "work", "worked"), "g", "Because I was tired, the work ended", "I stopped ______ at {time} because I was very tired, {name}.", { time: ["ten", "nine", "midnight", "eleven"], name: NAME2 }],
  [I("take", "taking", "took"), "i", "The view was beautiful", "The {sight} looked amazing, so we stopped ______ some photos.", { sight: ["mountains", "lake", "old town", "sunset"], x: [] }],
  [G("crying", "cry", "cried"), "g", "The crying ended", "The baby stopped ______ when her {who} picked her up.", { who: ["mother", "father", "grandma", "sister"], x: [] }],
  [I("buy", "buying", "bought"), "i", "The car needed petrol", "The car needed petrol, so Dad stopped ______ some at the {place}, {name}.", { place: ["petrol station", "garage", "motorway", "corner"], name: NAME }],
  [G("using", "use", "used"), "g", "I don't use it any more", "I stopped ______ my old {thing} when I got a new one, {name}.", { thing: ["phone", "laptop", "bike", "camera"], name: NAME2 }],
  [I("rest", "resting", "rested"), "i", "Her legs were tired", "Her legs were tired, so she stopped ______ on a bench in the {place}.", { place: ["park", "square", "garden", "station"], x: [] }],
  [G("worrying", "worry", "worried"), "g", "End the worry", "Stop ______ about the {test}. You'll be fine, {name}.", { test: ["exam", "interview", "match", "results"], name: NAME }],
  [I("help", "helping", "helped"), "i", "Someone fell", "An old man fell in the {place}, so we stopped ______ him, {name}.", { place: ["street", "bazaar", "park", "square"], name: NAME2 }],
  [G("going", "go", "went"), "g", "She doesn't go there any more", "She stopped ______ to the {place} because it was too expensive.", { place: ["gym", "pool", "club", "café"], x: [] }],
  [I("answer", "answering", "answered"), "i", "The phone rang", "My phone rang in the {place}, so I stopped ______ it, {name}.", { place: ["street", "park", "bazaar", "corridor"], name: NAME }],
  [G("ringing", "ring", "rang"), "g", "The ringing ended", "The phone in the {room} finally stopped ______.", { room: ["office", "hall", "kitchen", "classroom"], x: [] }],
  [I("say", "saying", "said"), "i", "I saw someone I know", "I saw my {who} at the bazaar and stopped ______ hello, {name}.", { who: ["aunt", "teacher", "neighbour", "cousin"], name: NAME2 }],
].map(([o, kind, cue, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  if (Object.keys(s).length < 2 && !prompt.includes("{name}")) s.name = NAME;
  const p = s.name && !prompt.includes("{name}") ? prompt.replace(/\.$/, ", {name}.") : prompt;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(o[0]), why: kind === "g" ? WG(o[0], cue) : WI(o[0], cue), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Does the activity end, or do they stop in order to do something? Write the -ing form or to + the verb in brackets.";
// [key, cue, source, slots] — no source prints "to"
const BUILD = [
  ["drinking", "He doesn't drink it any more", "My grandpa stopped ______ (drink) {drink} last year, {name}.", { drink: ["coffee", "cola", "strong tea", "sweet drinks"], name: NAME }],
  ["to drink", "I was thirsty", "I was thirsty, so I stopped ______ (drink) some juice at the {place}.", { place: ["kiosk", "café", "shop", "fountain"], x: [] }],
  ["snowing", "The snow ended", "Has it stopped ______ (snow) in {city} yet, {name}?", { city: ["Moscow", "Tashkent", "Almaty", "Astana"], name: NAME2 }],
  ["to look", "We wanted a better view", "We stopped ______ (look) at the {sight} from the bridge, {name}.", { sight: ["river", "sunset", "old town", "mountains"], name: NAME }],
  ["shouting", "Be calm now", "Please stop ______ (shout) at your {who}, {name}.", { who: ["brother", "sister", "cousin", "son"], name: NAME2 }],
  ["to buy", "Mum needed bread", "Mum needed bread, so she stopped ______ (buy) some at the {place}.", { place: ["bakery", "bazaar", "kiosk", "shop"], x: [] }],
  ["watching", "The show got boring", "We stopped ______ (watch) the {show} because it got boring, {name}.", { show: ["series", "film", "show", "match"], name: NAME }],
  ["to watch", "The dancers were great", "The street dancers in {city} were great, so we stopped ______ (watch) them.", { city: ["Samarkand", "Istanbul", "Tashkent", "Bukhara"], x: [] }],
  ["laughing", "Nobody laughed after that", "Everyone stopped ______ (laugh) when the {who} came in.", { who: ["teacher", "director", "boss", "coach"], x: [] }],
  ["to fix", "The tyre was flat", "Her bike had a flat tyre, so she stopped ______ (fix) it near the {place}, {name}.", { place: ["river", "school", "park", "shop"], name: NAME2 }],
  ["playing", "He doesn't play any more", "My brother stopped ______ (play) {sport} after his injury, {name}.", { sport: ["football", "tennis", "basketball", "volleyball"], name: NAME }],
  ["to check", "There was a noise", "There was a strange noise, so the driver stopped ______ (check) the {thing}.", { thing: ["tyres", "engine", "wheels", "doors"], x: [] }],
  ["complaining", "Be quiet about it now", "Stop ______ (complain) about the {thing}, {name}!", { thing: ["food", "weather", "traffic", "homework"], name: NAME2 }],
  ["to pick", "We saw ripe fruit", "We saw ripe {fruit} by the road and stopped ______ (pick) some, {name}.", { fruit: ["apples", "apricots", "cherries", "mulberries"], name: NAME }],
  ["growing", "It doesn't grow any more", "This old {tree} stopped ______ (grow) years ago, {name}.", { tree: ["apple tree", "walnut tree", "vine", "palm"], name: NAME2 }],
  ["to wait", "My friend was slow", "My friend was slow, so I stopped ______ (wait) for her at the {place}.", { place: ["corner", "gate", "bridge", "bus stop"], x: [] }],
  ["calling", "He never phones now", "My {who} never phones now. Why did he stop ______ (call), {name}?", { who: ["cousin", "friend", "uncle", "brother"], name: NAME }],
  ["to chat", "I met an old friend", "I met an old friend in the {place} and stopped ______ (chat), {name}.", { place: ["street", "park", "bazaar", "mall"], name: NAME2 }],
  ["working", "The work ended", "The workers stopped ______ (work) at {time} and went home.", { time: ["five", "six", "noon", "seven"], x: [] }],
  ["to get", "It was freezing", "It was freezing, so we stopped ______ (get) a hot drink at a {place}, {name}.", { place: ["café", "kiosk", "chaikhana", "petrol station"], name: NAME }],
].map(([key, cue, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  if (Object.keys(s).length < 2 && !source.includes("{name}")) s.name = NAME2;
  const src = s.name && !source.includes("{name}") ? source.replace(/\.$/, ", {name}.") : source;
  const why = key.startsWith("to ") ? WI(key, cue) : WG(key, cue);
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ANY = "Rewrite with stopped + -ing.";
const AND = "Rewrite with stopped + to.";
const FIX = "Correct the mistake.";
const TRANSFORM = [
  [ANY, "My dad doesn't drink {drink} any more, {name}.", "My dad stopped ______ {drink}, {name}.", "drinking", { drink: ["coffee", "cola", "strong tea", "energy drinks"], name: NAME }, "Not any more = stopped + -ing."],
  [ANY, "We don't go to that {place} any more, {name}.", "We stopped ______ to that {place}, {name}.", "going", { place: ["café", "gym", "pool", "club"], name: NAME2 }, "Not any more = stopped + -ing."],
  [ANY, "She doesn't play the {instr} any more, {name}.", "She stopped ______ the {instr}, {name}.", "playing", { instr: ["piano", "violin", "guitar", "dutar"], name: NAME }, "Not any more = stopped + -ing."],
  [ANY, "My parents don't buy {thing} any more, {name}.", "My parents stopped ______ {thing}, {name}.", "buying", { thing: ["newspapers", "magazines", "CDs", "DVDs"], name: NAME2 }, "Not any more = stopped + -ing."],
  [ANY, "I don't use my old {thing} any more, {name}.", "I stopped ______ my old {thing}, {name}.", "using", { thing: ["phone", "laptop", "bike", "camera"], name: NAME }, "Not any more = stopped + -ing."],
  [AND, "We stopped and ate at a café near {city}, {name}.", "We stopped ______ at a café near {city}, {name}.", "to eat", { city: ["Jizzakh", "Samarkand", "Gulistan", "Karshi"], name: NAME2 }, "stopped and ate = stopped in order to eat: to eat."],
  [AND, "The driver stopped and checked the {thing}, {name}.", "The driver stopped ______ the {thing}, {name}.", "to check", { thing: ["tyres", "engine", "map", "lights"], name: NAME }, "stopped and checked = stopped to check."],
  [AND, "I stopped and bought some {food} at the bazaar, {name}.", "I stopped ______ some {food} at the bazaar, {name}.", "to buy", { food: ["bread", "fruit", "nuts", "flowers"], name: NAME2 }, "stopped and bought = stopped to buy."],
  [AND, "We stopped and took photos of the {sight}, {name}.", "We stopped ______ photos of the {sight}, {name}.", "to take", { sight: ["mountains", "lake", "old town", "sunset"], name: NAME }, "stopped and took = stopped to take."],
  [AND, "She stopped and helped a child in the {place}, {name}.", "She stopped ______ a child in the {place}, {name}.", "to help", { place: ["street", "park", "bazaar", "square"], name: NAME2 }, "stopped and helped = stopped to help."],
  [FIX, "It stopped to rain, so we went to the {place}, {name}.", "It stopped ______, so we went to the {place}, {name}.", "raining", { place: ["park", "bazaar", "beach", "stadium"], name: NAME }, "The rain ended: stop + -ing."],
  [FIX, "I was thirsty, so I stopped drinking some water at the {place}, {name}.", "I was thirsty, so I stopped ______ some water at the {place}, {name}.", "to drink", { place: ["kiosk", "café", "shop", "fountain"], name: NAME2 }, "Thirsty = stopped in order to drink: to drink."],
  [FIX, "My uncle stopped to eat {food}. He feels better now, {name}.", "My uncle stopped ______ {food}. He feels better now, {name}.", "eating", { food: ["sugar", "fast food", "fried food", "white bread"], name: NAME }, "He feels better = he doesn't eat it now: eating."],
  [FIX, "We were lost, so we stopped asking a man for directions in {city}, {name}.", "We were lost, so we stopped ______ a man for directions in {city}, {name}.", "to ask", { city: ["Istanbul", "Bukhara", "Moscow", "Seoul"], name: NAME2 }, "Lost = stopped in order to ask: to ask."],
  [FIX, "Please stop to make so much noise in the {room}, {name}.", "Please stop ______ so much noise in the {room}, {name}.", "making", { room: ["kitchen", "hall", "yard", "classroom"], name: NAME }, "End the noise: stop + -ing."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write two sentences that show the difference between stop + -ing and stop + to.", "stop doing vs stop to do", ["exactly two sentences", "stop + -ing", "stop + to + base"]],
  ["Write one sentence about a habit you stopped.", "I stopped + -ing", ["exactly one sentence", "stopped + -ing", "past"]],
  ["Write one sentence about a trip where you stopped to do something.", "We stopped to …", ["exactly one sentence", "stopped + to", "a reason"]],
  ["Write one sentence with It stopped + -ing.", "It stopped raining / snowing", ["exactly one sentence", "stopped + -ing", "weather"]],
  ["Write one sentence with … so I stopped to ….", "… so I stopped to …", ["exactly one sentence", "so", "stopped to"]],
  ["Write one request with Please stop + -ing.", "Please stop + -ing", ["exactly one sentence", "stop + -ing", "please"]],
  ["Write one sentence about stopping to talk to someone.", "I stopped to talk to …", ["exactly one sentence", "stopped to talk", "a person"]],
  ["Write one sentence about something a family member stopped doing.", "My … stopped + -ing", ["exactly one sentence", "stopped + -ing", "a family member"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a long walk or drive. Write three or four sentences with stopped to and stopped + -ing.", "stop + to vs stop + -ing", ["stopped to", "stopped + -ing", "three or four sentences"]],
  ["Write three or four sentences about healthy changes in your life: what did you stop doing?", "stopped + -ing", ["stopped", "-ing", "three or four sentences"]],
  ["Tell a short story (three or four sentences) about a day when the rain stopped and you stopped to do something.", "both patterns", ["stopped raining", "stopped to", "three or four sentences"]],
  ["Write three or four sentences explaining stop + -ing and stop + to to a friend, with examples.", "the meaning difference", ["stop + -ing", "stop + to", "examples"]],
  ["Write three or four sentences about your journey to school or work, with stopped to.", "stopped to", ["stopped to", "reasons", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.meaning-change-verbs.stop-contrast.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
