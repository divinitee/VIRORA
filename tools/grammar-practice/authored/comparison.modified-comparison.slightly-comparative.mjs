// Hand-authored: comparison / modified-comparison / slightly-comparative (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): SLIGHTLY + comparative for a SMALL
// difference (slightly more efficient, slightly cheaper).
// Triage: kept, separate from much-comparative (big difference). Two angles:
// 10 choose items give two numbers that are close and ask for the modifier
// (slightly vs much / far / very: only slightly fits the numbers, very can't
// go before a comparative); 10 ask for the form after a printed slightly
// (slightly cheaper vs slightly cheap / slightly cheapest / slightly more cheaper).
// "a bit" and "a little" also mean a small difference, so they are never
// options, and typed items say "use slightly".
// Build: the comparative after a printed "slightly". Transform: 5 two close
// numbers → slightly + comparative / 5 a bit / a little → slightly / 5 correct
// the mistake.
//
// Run: node tools/grammar-practice/authored/comparison.modified-comparison.slightly-comparative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "modified-comparison", topic: "slightly-comparative", level: "B1", pv: "2.5" };
const NAME = ["Zarina", "Sherzod", "Nodira", "Akmal"]; // listener names: never printed in a sentence (audit 20 Nov)
const SH = { cheap: "cheaper", warm: "warmer", tall: "taller", long: "longer", old: "older", big: "bigger", fast: "faster", heavy: "heavier", cold: "colder", short: "shorter", quiet: "quieter", small: "smaller", easy: "easier", early: "earlier", late: "later" };
const comp = (a) => SH[a] || `more ${a}`;
const sup = (a) => SH[a] ? (a === "big" ? "biggest" : SH[a].replace(/er$/, "est")) : `most ${a}`;
const WHY_M = (f) => `The numbers are close, so the difference is small: slightly + comparative, ${f}. Not very.`;
const WHY_F = (f) => `After slightly, use the comparative: ${f}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [kind m = choose the modifier, f = choose the form; adj; prompt; slots]
const CHOOSE = [
  ["m", "expensive", "The {thing} was 100,000 soum last month. Now it's 103,000. It's ______ more expensive, {name}.", { thing: ["bag", "jacket", "kettle", "lamp"], name: NAME }],
  ["m", "warm", "It was 20 degrees in {city} yesterday and it's 21 today. Today is ______ warmer than yesterday, {name}.", { city: ["Tashkent", "Samarkand", "Fergana", "Bukhara"], name: NAME }],
  ["m", "tall", "I'm 1.70 m and my {who} is 1.72 m. He's ______ taller than me, {name}.", { who: ["brother", "cousin", "friend", "father"], name: NAME }],
  ["m", "long", "The old road to {city} is 50 km and the new one is 52 km. The new road is ______ longer, {name}.", { city: ["Chirchiq", "Angren", "Gulistan", "Jizzakh"], name: NAME }],
  ["m", "old", "My {who} is 15 and a half, and her friend is 16. Her friend is ______ older, {name}.", { who: ["sister", "cousin", "niece"], name: NAME }],
  ["m", "heavy", "My {bag} is 7 kg and yours is 7.5 kg. Yours is ______ heavier, {name}.", { bag: ["bag", "suitcase", "backpack", "box"], name: NAME }],
  ["m", "fast", "At the {event}, {name} ran 100 metres in 13.1 seconds, and his friend ran it in 13.3. {name} is ______ faster.", { event: ["school race", "sports day", "competition", "training"], name: ["Sardor", "Timur", "Ilya", "Jasur"] }],
  ["m", "cheap", "The {thing} costs 49,000 at the bazaar and 50,000 in the shop. The bazaar is ______ cheaper, {name}.", { thing: ["melon", "shirt", "pan", "toy"], name: NAME }],
  ["m", "big", "Our {home} is 70 square metres, and yours is 72. Yours is ______ bigger, {name}.", { home: ["flat", "house", "office", "classroom"], name: NAME }],
  ["m", "early", "The {transport} leaves at 8:00 and the train at 8:05. The {transport} leaves ______ earlier, {name}.", { transport: ["bus", "minibus", "tram", "coach"], name: NAME }],
  ["f", "efficient", "The new {thing} is slightly ______ than the old one, {name}.", { thing: ["fridge", "heater", "washing machine", "car"], name: NAME }],
  ["f", "cheap", "These {goods} are slightly ______ at the bazaar than in the {shop}.", { goods: ["apples", "tomatoes", "eggs", "potatoes"], shop: ["supermarket", "shop", "mall", "kiosk"] }],
  ["f", "comfortable", "This {seat} is slightly ______ than that one, {name}.", { seat: ["chair", "sofa", "bed", "seat"], name: NAME }],
  ["f", "cold", "It's slightly ______ in the {room} than in the kitchen, {name}.", { room: ["bedroom", "hall", "garage", "bathroom"], name: NAME }],
  ["f", "difficult", "The second {test} was slightly ______ than the first, {name}.", { test: ["test", "exam", "quiz", "exercise"], name: NAME }],
  ["f", "short", "My hair is slightly ______ than my {who}'s, {name}.", { who: ["sister", "mother", "cousin", "friend"], name: NAME }],
  ["f", "interesting", "I think the {thing} is slightly ______ than the film, {name}.", { thing: ["book", "story", "comic", "novel"], name: NAME }],
  ["f", "quiet", "Our new {area} is slightly ______ than the old one, {name}.", { area: ["street", "flat", "office", "classroom"], name: NAME }],
  ["f", "late", "The {event} started slightly ______ than we thought, {name}.", { event: ["concert", "match", "film", "lesson"], name: NAME }],
  ["f", "popular", "Tea is slightly ______ than coffee in our {place}, {name}.", { place: ["office", "class", "family", "group"], name: NAME }],
].map(([kind, adj, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  let opts, why;
  if (kind === "m") { opts = ["slightly", "much", "far", "very"]; why = WHY_M(`slightly ${comp(adj)}`); }
  else {
    const c = comp(adj);
    opts = SH[adj] ? [c, adj, sup(adj), `more ${c}`] : [c, adj, sup(adj), `${adj}ly`.replace(/lly$/, "lly").replace(/(ent|ble|ful|ous|ult|ar)ly$/, (m) => m)];
    const FOURTH = { efficient: "efficiently", comfortable: "comfortably", difficult: "more difficulter", interesting: "interested", popular: "more popularer" };
    if (!SH[adj]) opts = [c, adj, `most ${adj}`, FOURTH[adj]];
    why = WHY_F(c);
  }
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write the comparative of the adjective in brackets.";
const BUILD = [
  ["cheap", "This {thing} is slightly ______ (cheap) online, {name}.", { thing: ["phone", "jacket", "book", "game"], name: NAME }],
  ["warm", "It's slightly ______ (warm) in {month} than in March, {name}.", { month: ["April", "May", "the spring", "early April"], name: NAME }],
  ["expensive", "The red {thing} is slightly ______ (expensive) than the blue one, {name}.", { thing: ["bag", "dress", "scarf", "bike"], name: NAME }],
  ["tall", "My {who} is slightly ______ (tall) than me now, {name}.", { who: ["little brother", "sister", "cousin", "son"], name: NAME }],
  ["comfortable", "The new {seat} is slightly ______ (comfortable) than the old one, {name}.", { seat: ["sofa", "chair", "bed", "car seat"], name: NAME }],
  ["early", "This {transport} leaves slightly ______ (early) than the other one, {name}.", { transport: ["bus", "train", "minibus", "tram"], name: NAME }],
  ["difficult", "Today's {task} was slightly ______ (difficult) than yesterday's, {name}.", { task: ["homework", "test", "lesson", "exercise"], name: NAME }],
  ["long", "The way through the {place} is slightly ______ (long), but it's nicer, {name}.", { place: ["park", "old town", "bazaar", "village"], name: NAME }],
  ["old", "My {who} is slightly ______ (old) than my mother, {name}.", { who: ["father", "aunt", "uncle", "godmother"], name: NAME }],
  ["heavy", "This {bag} is slightly ______ (heavy) than I thought, {name}.", { bag: ["suitcase", "box", "bag", "backpack"], name: NAME }],
  ["quiet", "The {room} is slightly ______ (quiet) in the evening, {name}.", { room: ["library", "café", "hall", "street"], name: NAME }],
  ["popular", "Volleyball is slightly ______ (popular) than {sport} in our {place}.", { sport: ["basketball", "tennis", "handball", "chess"], place: ["school", "college", "club", "village"] }],
  ["short", "The new {route} is slightly ______ (short) than the old one, {name}.", { route: ["route", "road", "path", "way"], name: NAME }],
  ["small", "My {thing} is slightly ______ (small) than yours, {name}.", { thing: ["room", "phone", "desk", "bike"], name: NAME }],
  ["interesting", "The second {part} was slightly ______ (interesting) than the first, {name}.", { part: ["half", "part", "lesson", "chapter"], name: NAME }],
  ["late", "Our {event} starts slightly ______ (late) this week, {name}.", { event: ["lesson", "training", "meeting", "class"], name: NAME }],
  ["easy", "This {test} is slightly ______ (easy) than the last one, {name}.", { test: ["test", "exam", "quiz", "exercise"], name: NAME }],
  ["fast", "The new {device} is slightly ______ (fast) than my old one, {name}.", { device: ["laptop", "phone", "computer", "tablet"], name: NAME }],
  ["big", "Your {room} is slightly ______ (big) than ours, {name}.", { room: ["kitchen", "flat", "garden", "yard"], name: NAME }],
  ["cold", "The water in the {water} is slightly ______ (cold) today than yesterday, {name}.", { water: ["pool", "lake", "river", "sea"], name: NAME }],
].map(([adj, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: comp(adj), why: WHY_F(comp(adj)), slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NUM = "The numbers are close. Rewrite with slightly and a comparative.";
const BIT = "Rewrite with slightly instead of a bit or a little.";
const FIX = "Correct the mistake.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [NUM, "My {thing} cost 500,000 soum. Yours cost 510,000, {name}.", "Your {thing} was ______ than mine, {name}.", "slightly more expensive", { thing: ["phone", "bike", "jacket", "watch"], name: NAME }],
  [NUM, "I'm 1.60 m. My {who} is 1.62 m, {name}.", "My {who} is ______ than me, {name}.", "slightly taller", { who: ["sister", "cousin", "friend", "mother"], name: NAME }],
  [NUM, "Today it's 15 degrees in {city}. Yesterday it was 14, {name}.", "Today it's ______ than yesterday, {name}.", "slightly warmer", { city: ["Tashkent", "Samarkand", "Fergana", "Bukhara"], name: NAME }],
  [NUM, "The {transport} takes 40 minutes. The train takes 38, {name}.", "The train is ______ than the {transport}, {name}.", "slightly faster", { transport: ["bus", "minibus", "car", "coach"], name: NAME }],
  [NUM, "My {box} is 10 kg. {name}'s {box} is 11 kg.", "{name}'s {box} is ______ than mine.", "slightly heavier", { box: ["box", "bag", "suitcase", "parcel"], name: NAME }],
  [BIT, "This {thing} is a bit cheaper than that one, {name}.", "This {thing} is ______ than that one, {name}.", "slightly cheaper", { thing: ["shirt", "bag", "pen", "cake"], name: NAME }],
  [BIT, "The second {test} was a little more difficult, {name}.", "The second {test} was ______, {name}.", "slightly more difficult", { test: ["test", "exam", "quiz", "lesson"], name: NAME }],
  [BIT, "It's a bit colder in the {room} than in the kitchen, {name}.", "It's ______ in the {room} than in the kitchen, {name}.", "slightly colder", { room: ["bedroom", "hall", "garage", "bathroom"], name: NAME }],
  [BIT, "My {who} is a little older than my father, {name}.", "My {who} is ______ than my father, {name}.", "slightly older", { who: ["mother", "uncle", "aunt", "godfather"], name: NAME }],
  [BIT, "Our new {area} is a bit quieter, {name}.", "Our new {area} is ______, {name}.", "slightly quieter", { area: ["street", "flat", "office", "classroom"], name: NAME }],
  [FIX, "This {thing} is slightly more cheaper than that one, {name}.", "This {thing} is ______ than that one, {name}.", "slightly cheaper", { thing: ["bag", "phone", "melon", "lamp"], name: NAME }],
  [FIX, "Today is very warmer than {when}, but only a little, {name}.", "Today is ______ than {when}, {name}.", "slightly warmer", { when: ["yesterday", "last week", "on Monday", "on Sunday"], name: NAME }],
  [FIX, "The new {seat} is slightly comfortable than the old one, {name}.", "The new {seat} is ______ than the old one, {name}.", "slightly more comfortable", { seat: ["sofa", "chair", "bed", "seat"], name: NAME }],
  [FIX, "My {who} is slightly most tall than me, {name}.", "My {who} is ______ than me, {name}.", "slightly taller", { who: ["brother", "cousin", "friend", "uncle"], name: NAME }],
  [FIX, "The {event} started slightly lately than usual, {name}.", "The {event} started ______ than usual, {name}.", "slightly later", { event: ["concert", "match", "film", "lesson"], name: NAME }],
].map(([instr, source, hint, key, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: `A small difference: slightly + comparative, ${key}.`, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence comparing your height with a friend's. The difference is small.", "slightly taller / shorter", ["exactly one sentence", "slightly", "than"]],
  ["Write one sentence about two prices that are almost the same.", "slightly cheaper / more expensive", ["exactly one sentence", "slightly + comparative", "than"]],
  ["Write one sentence about today's weather and yesterday's.", "slightly warmer / colder", ["exactly one sentence", "slightly", "yesterday"]],
  ["Write one sentence comparing two tests or lessons.", "slightly more difficult / easier", ["exactly one sentence", "slightly", "than"]],
  ["Write one sentence about two ways to get to school or work.", "slightly faster / longer", ["exactly one sentence", "slightly", "two ways"]],
  ["Write one sentence with slightly more + a long adjective.", "slightly more + adjective", ["exactly one sentence", "slightly more", "than"]],
  ["Write one sentence about two family members' ages.", "slightly older / younger", ["exactly one sentence", "slightly", "than"]],
  ["Write two sentences: one with slightly and one with much.", "slightly vs much", ["exactly two sentences", "slightly for a small difference", "much for a big one"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare two phones, bags or bikes that are almost the same. Write three or four sentences with slightly.", "slightly + comparative", ["slightly", "than", "three or four sentences"]],
  ["Compare this week's weather with last week's. Write three or four sentences.", "slightly warmer / colder", ["slightly", "much", "weather words"]],
  ["Compare two friends or two cousins. Write three or four sentences.", "slightly taller / older", ["slightly", "than", "two people"]],
  ["Compare two cafés, shops or markets near you. Write three or four sentences.", "slightly cheaper / busier", ["slightly", "much or a lot", "two places"]],
  ["Compare your new and old school, flat or job. Write three or four sentences.", "slightly vs much", ["slightly", "much", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.modified-comparison.slightly-comparative.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "100,000 against 103,000 is a tiny change: slightly.",
   "20 against 21 degrees: a small difference: slightly.",
   "1.70 against 1.72 m: slightly taller.",
   "50 against 52 km: slightly longer.",
   "Half a year is a small gap: slightly older.",
   "7 against 7.5 kg: slightly heavier.",
   "13.1 against 13.3 seconds: slightly faster.",
   "49,000 against 50,000: slightly cheaper.",
   "70 against 72 square metres: slightly bigger.",
   "Five minutes is a small gap: slightly earlier.",
   "efficient is long: slightly more efficient.",
   "cheap is short: slightly cheaper.",
   "comfortable is long: slightly more comfortable.",
   "cold is short: slightly colder.",
   "difficult is long: slightly more difficult.",
   "short is short: slightly shorter.",
   "interesting is long: slightly more interesting.",
   "quiet takes -er: slightly quieter.",
   "late → later, a small gap: slightly later.",
   "popular is long: slightly more popular."
  ],
  "build": [
   "cheap → cheaper (short adjective).",
   "warm → warmer (short adjective).",
   "expensive is long: more expensive.",
   "tall → taller (short adjective).",
   "comfortable is long: more comfortable.",
   "early ends in -y: earlier.",
   "difficult is long: more difficult.",
   "\"but it's nicer\": long → longer.",
   "old → older (short adjective).",
   "heavy ends in -y: heavier.",
   "quiet takes -er: quieter.",
   "popular is long: more popular.",
   "short → shorter (short adjective).",
   "small → smaller (short adjective).",
   "interesting is long: more interesting.",
   "late ends in -e: later.",
   "easy ends in -y: easier.",
   "fast → faster (short adjective).",
   "big doubles the g: bigger.",
   "cold → colder (short adjective)."
  ],
  "transform": [
   "500,000 against 510,000: slightly more expensive.",
   "1.60 against 1.62 m: slightly taller.",
   "14 against 15 degrees: slightly warmer.",
   "40 against 38 minutes: slightly faster.",
   "10 against 11 kg: slightly heavier.",
   "a bit = slightly: slightly cheaper.",
   "a little = slightly: slightly more difficult.",
   "a bit = slightly: slightly colder.",
   "a little = slightly: slightly older.",
   "a bit = slightly: slightly quieter.",
   "Not more + -er: slightly cheaper.",
   "\"only a little\" means slightly, not very: slightly warmer.",
   "comfortable needs more: slightly more comfortable.",
   "Not most tall: slightly taller.",
   "late → later, not lately: slightly later."
  ]
 },
 "slot": [
  [
   "choose",
   5,
   "",
   "who",
   [
    "cousin"
   ]
  ],
  [
   "choose",
   5,
   "",
   "who",
   [
    "daughter"
   ]
  ]
 ]
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
