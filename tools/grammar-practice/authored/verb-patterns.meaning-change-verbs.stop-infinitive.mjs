// Hand-authored: verb-patterns / meaning-change-verbs / stop-infinitive (B1).
// Wave C, C32 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item): stop + to + base = stop what you are doing IN
// ORDER TO do something else ("I stopped to drink some water because I was thirsty").
// Triage: kept. Siblings stop-gerund (C31, the activity ends) and stop-contrast (C30).
// One right answer: "stopped drinking" is also English (= quit), so every line gives a
// reason that needs the purpose meaning (I was thirsty → stopped to drink; we were lost
// → stopped to ask), which makes "quit" a contradiction.
// Choose: to + base / -ing / base / past.
// Build: to + the verb in brackets; no source prints "to".
// Transform: 5 correct the mistake / 5 We stopped. We wanted to X. → stopped to X /
// 5 He stopped and X-ed → stopped to X.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/verb-patterns.meaning-change-verbs.stop-infinitive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "meaning-change-verbs", topic: "stop-infinitive", level: "B1", pv: "2.5" };
const NAME = ["Zarina", "Otabek", "Feruza", "Sardor"];
const NAME2 = ["Malika", "Jamshid", "Nodira", "Ulugbek"];
const P = (base, ing, past) => [`to ${base}`, ing, base, past];
const WHY = (b, cue) => `${cue}, so we stopped in order to do it: stop + to + base (to ${b}).`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [P("drink", "drinking", "drank"), "I was thirsty, so I stopped ______ some water at the {place}, {name}.", { place: ["fountain", "café", "shop", "kiosk"], name: NAME }, "I was thirsty"],
  [P("ask", "asking", "asked"), "We were lost in {city}, so we stopped ______ a man for directions.", { city: ["Istanbul", "Bukhara", "Moscow", "Seoul"], x: [] }, "We were lost"],
  [P("take", "taking", "took"), "The view of the {sight} was beautiful, so we stopped ______ some photos, {name}.", { sight: ["mountains", "lake", "old town", "valley"], name: NAME2 }, "The view was beautiful"],
  [P("rest", "resting", "rested"), "My legs were tired, so I stopped ______ on a bench in the {place}.", { place: ["park", "square", "garden", "station"], x: [] }, "My legs were tired"],
  [P("buy", "buying", "bought"), "The car needed petrol, so Dad stopped ______ some at the {place}, {name}.", { place: ["petrol station", "garage", "corner", "motorway"], name: NAME }, "The car needed petrol"],
  [P("eat", "eating", "ate"), "We were very hungry, so we stopped ______ at a café near {city}, {name}.", { city: ["Jizzakh", "Gulistan", "Samarkand", "Karshi"], name: NAME2 }, "We were hungry"],
  [P("look", "looking", "looked"), "She heard a strange noise, so she stopped ______ behind her in the {place}.", { place: ["street", "park", "forest", "corridor"], x: [] }, "She heard a noise"],
  [P("answer", "answering", "answered"), "My phone rang, so I stopped ______ it, {name}.", { name: NAME, x: [] }, "The phone rang"],
  [P("tie", "tying", "tied"), "His shoelace was loose, so he stopped ______ it in the {place}.", { place: ["street", "park", "corridor", "station"], x: [] }, "The shoelace was loose"],
  [P("talk", "talking", "talked"), "I saw my old {who} in the street and stopped ______ to her, {name}.", { who: ["teacher", "neighbour", "classmate", "friend"], name: NAME2 }, "I saw an old friend"],
  [P("check", "checking", "checked"), "The driver heard a noise, so he stopped ______ the {thing}.", { thing: ["tyres", "engine", "wheels", "doors"], x: [] }, "There was a noise"],
  [P("help", "helping", "helped"), "An old man fell in the {place}, so we stopped ______ him, {name}.", { place: ["street", "bazaar", "park", "square"], name: NAME }, "Someone needed help"],
  [P("watch", "watching", "watched"), "There was a street concert in {city}, so we stopped ______ it.", { city: ["Samarkand", "Bukhara", "Tashkent", "Khiva"], x: [] }, "Something interesting was there"],
  [["to read", "reading", "read", "reads"], "I saw a sign on the {place} door, so I stopped ______ it, {name}.", { place: ["museum", "shop", "school", "bank"], name: NAME2 }, "There was a sign"],
  [P("say", "saying", "said"), "I met my {who} at the bazaar and stopped ______ hello, {name}.", { who: ["aunt", "teacher", "neighbour", "cousin"], name: NAME }, "I met someone I know"],
  [P("pick", "picking", "picked"), "We saw some ripe {fruit} by the road and stopped ______ a few.", { fruit: ["apples", "apricots", "cherries", "mulberries"], x: [] }, "We saw ripe fruit"],
  [P("make", "making", "made"), "The runners stopped ______ a short break at the {place}, {name}.", { place: ["bridge", "fountain", "park", "corner"], name: NAME2 }, "They needed a break"],
  [P("wait", "waiting", "waited"), "My friend was slow, so I stopped ______ for her at the {place}.", { place: ["corner", "gate", "bridge", "bus stop"], x: [] }, "My friend was slow"],
  [P("get", "getting", "got"), "It was cold, so we stopped ______ some tea at a {place}, {name}.", { place: ["chaikhana", "café", "kiosk", "roadside stall"], name: NAME }, "It was cold"],
  [P("fix", "fixing", "fixed"), "Her bike had a flat tyre, so she stopped ______ it near the {place}.", { place: ["river", "school", "park", "shop"], x: [] }, "The tyre was flat"],
].map(([o, prompt, slots, cue], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  if (Object.keys(s).length < 2 && prompt.includes("{name}") === false) s.name = NAME2;
  const p = s.name && !prompt.includes("{name}") ? prompt.replace(/\.$/, ", {name}.") : prompt;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(o[0]), why: WHY(o[0].slice(3), cue), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "We stopped in order to do something. Complete with to + the verb in brackets.";
// no source prints "to"
const BUILD = [
  ["to drink", "I was thirsty, so I stopped ______ (drink) some juice, {name}.", { name: NAME, x: [] }],
  ["to ask", "We were lost, so we stopped ______ (ask) a {who} the way.", { who: ["guard", "taxi driver", "shopkeeper", "woman"], x: [] }],
  ["to take", "The sunset over the {sight} was amazing, so we stopped ______ (take) a photo.", { sight: ["mountains", "lake", "sea", "desert"], x: [] }],
  ["to rest", "We were tired, so we stopped ______ (rest) in the shade, {name}.", { name: NAME2, x: [] }],
  ["to buy", "Mum needed {food}, so she stopped ______ (buy) some at the bazaar on the way home.", { food: ["bread", "melons", "grapes", "meat"], x: [] }],
  ["to eat", "We were hungry, so we stopped ______ (eat) at a {place}, {name}.", { place: ["café", "chaikhana", "roadside café", "restaurant"], name: NAME }],
  ["to look", "The {thing} in the shop window were beautiful, so I stopped ______ (look) at them.", { thing: ["dresses", "shoes", "watches", "cakes"], x: [] }],
  ["to answer", "My phone rang in the {place}, so I stopped ______ (answer) it.", { place: ["street", "park", "car", "bazaar"], x: [] }],
  ["to tie", "His laces were loose, so he stopped ______ (tie) them at the {place}, {name}.", { place: ["corner", "gate", "station", "school door"], name: NAME2 }],
  ["to chat", "I met an old friend and stopped ______ (chat) for a few minutes, {name}.", { name: NAME, x: [] }],
  ["to check", "There was a strange noise, so the driver stopped ______ (check) the {thing}.", { thing: ["tyres", "engine", "map", "lights"], x: [] }],
  ["to help", "An old woman dropped her {thing}, so everyone stopped ______ (help) her.", { thing: ["bags", "shopping", "suitcase", "boxes"], x: [] }],
  ["to watch", "The street dancers in {city} were great, so we stopped ______ (watch) them, {name}.", { city: ["Samarkand", "Istanbul", "Tashkent", "Bukhara"], name: NAME2 }],
  ["to read", "There was a notice on the {place} door, so I stopped ______ (read) it, {name}.", { place: ["museum", "shop", "school", "bank"], name: NAME }],
  ["to say", "I saw my {who} and stopped ______ (say) hello, {name}.", { who: ["teacher", "aunt", "neighbour", "cousin"], name: NAME2 }],
  ["to pick", "We saw ripe {fruit} by the road and stopped ______ (pick) some.", { fruit: ["apples", "apricots", "cherries", "mulberries"], x: [] }],
  ["to get", "It was freezing, so we stopped ______ (get) a hot drink at a {place}.", { place: ["café", "kiosk", "chaikhana", "petrol station"], x: [] }],
  ["to wait", "My little {who} was slow, so I stopped ______ (wait) for him at the corner, {name}.", { who: ["brother", "sister", "cousin", "son"], name: NAME }],
  ["to fix", "Her bike had a flat tyre, so she stopped ______ (fix) it near the {place}, {name}.", { place: ["river", "school", "park", "shop"], name: NAME2 }],
  ["to make", "The driver had an urgent call, so he stopped ______ (make) it outside {city}.", { city: ["Jizzakh", "Gulistan", "Samarkand", "Karshi"], x: [] }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  if (Object.keys(s).length < 2 && !source.includes("{name}")) s.name = NAME2;
  const src = s.name && !source.includes("{name}") ? source.replace(/\.$/, ", {name}.") : source;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why: `They stopped in order to do it: stop + to + base (${key}).`, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const WANT = "Rewrite as one sentence with stopped + to.";
const AND = "Rewrite with stopped + to.";
const TRANSFORM = [
  [FIX, "I was thirsty, so I stopped drinking some water at the {place}, {name}.", "I was thirsty, so I stopped ______ some water at the {place}, {name}.", "to drink", { place: ["fountain", "café", "shop", "kiosk"], name: NAME }, "Thirsty = stopped in order to drink: to drink."],
  [FIX, "We were lost, so we stopped ask a man in {city}, {name}.", "We were lost, so we stopped ______ a man in {city}, {name}.", "to ask", { city: ["Istanbul", "Bukhara", "Moscow", "Seoul"], name: NAME2 }, "Lost = stopped in order to ask: to ask."],
  [FIX, "The view of the {sight} was great, so we stopped taking photos, {name}.", "The view of the {sight} was great, so we stopped ______ photos, {name}.", "to take", { sight: ["mountains", "lake", "old town", "valley"], name: NAME }, "A great view = stopped in order to take photos."],
  [FIX, "My legs were tired, so I stopped for rest in the {place}, {name}.", "My legs were tired, so I stopped ______ in the {place}, {name}.", "to rest", { place: ["park", "square", "garden", "station"], name: NAME2 }, "stop + to + base: to rest, not for rest."],
  [FIX, "Dad stopped buy petrol at the {place}, {name}.", "Dad stopped ______ petrol at the {place}, {name}.", "to buy", { place: ["petrol station", "garage", "corner", "motorway"], name: NAME }, "stop + to + base: to buy."],
  [WANT, "We stopped at a {place}. We wanted to eat, {name}.", "We stopped at a {place} ______, {name}.", "to eat", { place: ["café", "chaikhana", "restaurant", "roadside café"], name: NAME2 }, "The reason for stopping: to eat."],
  [WANT, "I stopped in the {place}. I wanted to rest, {name}.", "I stopped in the {place} ______, {name}.", "to rest", { place: ["park", "garden", "square", "shade"], name: NAME }, "The reason for stopping: to rest."],
  [WANT, "She stopped at the {place}. She wanted to buy some bread, {name}.", "She stopped at the {place} ______ some bread, {name}.", "to buy", { place: ["bakery", "shop", "bazaar", "kiosk"], name: NAME2 }, "The reason for stopping: to buy."],
  [WANT, "We stopped by the {sight}. We wanted to take photos, {name}.", "We stopped by the {sight} ______ photos, {name}.", "to take", { sight: ["lake", "river", "old tower", "waterfall"], name: NAME }, "The reason for stopping: to take photos."],
  [WANT, "He stopped at the corner. He wanted to wait for his {who}, {name}.", "He stopped at the corner ______ for his {who}, {name}.", "to wait", { who: ["sister", "friend", "son", "cousin"], name: NAME2 }, "The reason for stopping: to wait."],
  [AND, "I was walking home, but I stopped and talked with my {who}, {name}.", "I was walking home, but I stopped ______ with my {who}, {name}.", "to talk", { who: ["neighbour", "teacher", "aunt", "classmate"], name: NAME }, "stopped and talked = stopped to talk."],
  [AND, "The driver stopped and checked the {thing}, {name}.", "The driver stopped ______ the {thing}, {name}.", "to check", { thing: ["tyres", "engine", "map", "lights"], name: NAME2 }, "stopped and checked = stopped to check."],
  [AND, "We stopped and watched the dancers in {city}, {name}.", "We stopped ______ the dancers in {city}, {name}.", "to watch", { city: ["Samarkand", "Bukhara", "Tashkent", "Khiva"], name: NAME }, "stopped and watched = stopped to watch."],
  [AND, "My mum stopped and helped an old man in the {place}, {name}.", "My mum stopped ______ an old man in the {place}, {name}.", "to help", { place: ["street", "bazaar", "park", "square"], name: NAME2 }, "stopped and helped = stopped to help."],
  [AND, "He stopped and fixed his bike near the {place}, {name}.", "He stopped ______ his bike near the {place}, {name}.", "to fix", { place: ["river", "school", "park", "shop"], name: NAME }, "stopped and fixed = stopped to fix."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a car trip where you stopped to do something.", "We stopped to …", ["exactly one sentence", "stopped + to + base", "a reason"]],
  ["Write one sentence with I was thirsty / hungry, so I stopped to ….", "… so I stopped to …", ["exactly one sentence", "stopped to", "so"]],
  ["Write one sentence about stopping to talk to someone.", "I stopped to talk to …", ["exactly one sentence", "stopped to talk", "a person"]],
  ["Write one sentence with stopped to and one with stopped + -ing.", "purpose vs end", ["exactly two sentences", "stopped to + base", "stopped + -ing"]],
  ["Write one sentence about stopping to take a photo.", "We stopped to take a photo of …", ["exactly one sentence", "stopped to take", "a place"]],
  ["Write one sentence about a time you stopped to help someone.", "I stopped to help …", ["exactly one sentence", "stopped to help", "past"]],
  ["Write one sentence about a walk in your town where you stopped to do something.", "I stopped to buy / look …", ["exactly one sentence", "stopped to", "your town"]],
  ["Write one question with Why did you stop to …?", "Why did you stop to …?", ["exactly one question", "stop to", "a question mark"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a long car or bus trip. Where did you stop, and why? Write three or four sentences with stopped to.", "stopped + to", ["stopped to", "reasons", "three or four sentences"]],
  ["Describe your walk to school or work this morning. Write three or four sentences with stopped to.", "stopped to", ["stopped to", "past simple", "three or four sentences"]],
  ["Write three or four sentences about a hike in the mountains with stopped to.", "stopped + to + base", ["stopped to", "so", "three or four sentences"]],
  ["Write three or four sentences: one thing you stopped doing (-ing) and one time you stopped to do something.", "stop + -ing vs stop + to", ["stopped + -ing", "stopped to", "three or four sentences"]],
  ["Write a short story (three or four sentences) about a driver who stopped to help someone.", "stopped to help", ["stopped to", "past", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.meaning-change-verbs.stop-infinitive.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "I saw an old …, so we stopped in order to do it: stop + to + base (to talk).",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  "build": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  "transform": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
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
