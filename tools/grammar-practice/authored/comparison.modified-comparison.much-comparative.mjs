// Hand-authored: comparison / modified-comparison / much-comparative (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement items): MUCH + comparative for a BIG difference
// (much bigger, much more difficult): much goes before the comparative, and
// "very" can't modify a comparative.
// Triage: kept. Sibling slightly-comparative owns the SMALL difference
// (slightly / a bit), so every item here has a big gap (numbers or "a lot").
// Choose options are one adjective in four shapes: much + comparative (key) /
// very + comparative / much + base / more + -er doubled (much bigger / very
// bigger / much big / more bigger; much more expensive / much expensive /
// more much expensive / very more expensive). "far" and "a lot" are also
// right, so they are never options and typed items say "use much".
// Transform: 5 two facts → much + comparative / 5 correct the mistake /
// 5 a lot / far → much.
//
// Run: node tools/grammar-practice/authored/comparison.modified-comparison.much-comparative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "modified-comparison", topic: "much-comparative", level: "B1", pv: "2.5" };
const NAME = ["Feruza", "Otabek", "Dilnoza", "Sardor"]; // listener names: never printed in a sentence (audit 20 Nov)
const WHY = (f) => `A big difference: much goes before the comparative, ${f}. Not very.`;
// [adj, short comparative or null for "more adj"]
const SH = { big: "bigger", cheap: "cheaper", hot: "hotter", fast: "faster", old: "older", long: "longer", cold: "colder", easy: "easier", tall: "taller", heavy: "heavier", warm: "warmer", busy: "busier", quiet: "quieter", small: "smaller", happy: "happier", safe: "safer", strong: "stronger", near: "nearer" };
const LG = ["expensive", "difficult", "interesting", "comfortable", "beautiful", "dangerous", "popular", "important", "useful", "careful"];
const opts = (adj) => SH[adj]
  ? [`much ${SH[adj]}`, `very ${SH[adj]}`, `much ${adj}`, `more ${SH[adj]}`]
  : [`much more ${adj}`, `much ${adj}`, `more much ${adj}`, `very more ${adj}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["big", "Our new {home} is 120 square metres. The old one was 40. The new one is ______, {name}.", { home: ["flat", "house", "office", "classroom"], name: NAME }],
  ["expensive", "A taxi costs 30,000 soum, but the bus costs 2,000. The taxi is ______ than the {transport}, {name}.", { transport: ["bus", "metro", "minibus", "tram"], name: NAME }],
  ["hot", "It's 42 degrees in {city} today and it was 30 yesterday. Today is ______ than yesterday, {name}.", { city: ["Termez", "Bukhara", "Tashkent", "Karshi"], name: NAME }],
  ["difficult", "This {test} is ______ than the last one. Nobody finished it, {name}.", { test: ["test", "exam", "quiz", "task"], name: NAME }],
  ["fast", "The train takes two hours, the bus takes six. The train is ______ than the {transport}, {name}.", { transport: ["bus", "minibus", "coach", "old bus"], name: NAME }],
  ["interesting", "The {thing} was ______ than the film. I read it in two days, {name}.", { thing: ["book", "novel", "story", "comic"], name: NAME }],
  ["old", "My grandfather is 85 and my father is 50. My grandfather is ______ than my {who}, {name}.", { who: ["father", "dad", "uncle", "mother"], name: NAME }],
  ["comfortable", "The new {seat} is ______ than the old one. I can sleep in it, {name}.", { seat: ["sofa", "bed", "chair", "armchair"], name: NAME }],
  ["long", "The {road} is 300 km. The new road is only 100 km. The {road} is ______, {name}.", { road: ["old road", "mountain road", "road through the villages", "old route"], name: NAME }],
  ["beautiful", "The {place} is ______ in spring than in winter, {name}.", { place: ["park", "garden", "old town", "valley"], name: NAME }],
  ["cold", "It's minus fifteen in {city} today. It's ______ than in Tashkent, {name}.", { city: ["Moscow", "Nukus", "Almaty", "Kazan"], name: NAME }],
  ["dangerous", "Riding a motorbike in the {weather} is ______ than in the sun, {name}.", { weather: ["rain", "snow", "dark", "fog"], name: NAME }],
  ["easy", "Today's {task} was ______ than yesterday's. I finished in ten minutes, {name}.", { task: ["homework", "test", "exercise", "quiz"], name: NAME }],
  ["popular", "Football is ______ than {sport} in our school, {name}.", { sport: ["chess", "tennis", "handball", "golf"], name: NAME }],
  ["tall", "My {who} is 1.90 m, and I'm 1.60 m. He's ______ than me, {name}.", { who: ["brother", "father", "uncle", "cousin"], name: NAME }],
  ["important", "Your health is ______ than your {thing}, {name}.", { thing: ["marks", "phone", "work", "money"], name: NAME }],
  ["heavy", "This {bag} is ______ than mine. What's in it, {name}?", { bag: ["bag", "suitcase", "box", "backpack"], name: NAME }],
  ["useful", "For me, English is ______ than {subj} at work, {name}.", { subj: ["chemistry", "art", "music", "drawing"], name: NAME }],
  ["busy", "The bazaar is ______ on {day} than on weekdays, {name}.", { day: ["Sundays", "Saturdays", "holidays", "weekends"], name: NAME }],
  ["careful", "My sister drives ______ than my brother. She never goes fast, {name}.", { name: NAME, x: [] }],
].map(([adj, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const o = opts(adj);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY(o[0]), slots: s };
});
// careful → "much more carefully" is the adverb; keep the adjective sentence instead:
CHOOSE[19].prompt = "My {who} is ______ than my brother when she drives. She never goes fast, {name}.";
CHOOSE[19].slots = { who: ["sister", "mother", "aunt", "cousin"], name: NAME };

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write much and the comparative of the adjective in brackets.";
// [adj, source, slots]
const BUILD = [
  ["cheap", "The bazaar is ______ (cheap) than the {shop}, {name}.", { shop: ["supermarket", "mall", "big shop", "airport shop"], name: NAME }],
  ["expensive", "Plane tickets are ______ (expensive) in {month} than in winter, {name}.", { month: ["July", "August", "June", "the summer"], name: NAME }],
  ["warm", "It's ______ (warm) in {city} than in the mountains, {name}.", { city: ["Termez", "Bukhara", "Karshi", "Tashkent"], name: NAME }],
  ["difficult", "Russian grammar is ______ (difficult) for me than {lang} grammar, {name}.", { lang: ["English", "Turkish", "Uzbek", "Kazakh"], name: NAME }],
  ["quiet", "Our new {area} is ______ (quiet) than the old one. We sleep well now, {name}.", { area: ["street", "flat", "district", "house"], name: NAME }],
  ["comfortable", "These {shoes} are ______ (comfortable) than my old ones, {name}.", { shoes: ["shoes", "trainers", "boots", "sandals"], name: NAME }],
  ["small", "My {room} is ______ (small) than my brother's, {name}.", { room: ["room", "bedroom", "desk", "wardrobe"], name: NAME }],
  ["interesting", "The second {part} of the film was ______ (interesting) than the first, {name}.", { part: ["half", "part", "hour"], name: NAME }],
  ["happy", "{name} is ______ (happy) at her new school than at the old one.", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
  ["beautiful", "The mountains are ______ (beautiful) in {season} than in winter, {name}.", { season: ["spring", "summer", "autumn", "May"], name: NAME }],
  ["safe", "The new {road} is ______ (safe) than the old one, {name}.", { road: ["road", "bridge", "crossing", "bus stop"], name: NAME }],
  ["dangerous", "Swimming in the {water} is ______ (dangerous) than in the pool, {name}.", { water: ["river", "sea", "lake", "canal"], name: NAME }],
  ["strong", "My uncle is ______ (strong) than me. He can carry the {thing} alone, {name}.", { thing: ["sofa", "fridge", "table", "washing machine"], name: NAME }],
  ["popular", "This café is ______ (popular) than the one next to the {place}, {name}.", { place: ["bank", "station", "park", "school"], name: NAME }],
  ["near", "The {place} is ______ (near) than the bazaar. Let's walk, {name}.", { place: ["shop", "pharmacy", "bakery", "bus stop"], name: NAME }],
  ["useful", "A dictionary app is ______ (useful) than a paper {thing} for me, {name}.", { thing: ["dictionary", "book", "notebook", "list"], name: NAME }],
  ["heavy", "The {thing} was ______ (heavy) than we thought, {name}.", { thing: ["box", "suitcase", "table", "melon"], name: NAME }],
  ["important", "For my parents, my {thing} is ______ (important) than football, {name}.", { thing: ["education", "health", "family", "future"], name: NAME }],
  ["busy", "The roads are ______ (busy) at {time} than at noon, {name}.", { time: ["eight", "six", "rush hour", "half past five"], name: NAME }],
  ["long", "The summer holidays are ______ (long) than the {holiday}, {name}.", { holiday: ["winter holidays", "spring holidays", "autumn break", "Navruz holidays"], name: NAME }],
].map(([adj, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  const key = opts(adj)[0];
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: WHY(key), slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const BIG = "The difference is big. Rewrite with much and a comparative.";
const FIX = "Correct the mistake.";
const LOT = "Rewrite with much instead of a lot or far.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [BIG, "The {transport} takes ten hours. The plane takes one hour, {name}.", "The plane is ______ than the {transport}, {name}.", "much faster", { transport: ["bus", "train", "coach", "car"], name: NAME }],
  [BIG, "My phone cost 2 million soum. {name}'s phone cost {n} million.", "{name}'s phone was ______ than mine.", "much more expensive", { name: NAME, n: ["10", "12", "9", "15"] }],
  [BIG, "In {month} it's 40 degrees. In January it's 5 degrees, {name}.", "In {month} it's ______ than in January, {name}.", "much hotter", { month: ["July", "August", "June", "summer"], name: NAME }],
  [BIG, "The old {school} had 200 students. The new one has 2,000, {name}.", "The new {school} is ______ than the old one, {name}.", "much bigger", { school: ["school", "college", "lyceum", "library"], name: NAME }],
  [BIG, "Last year's {test} took me an hour. This year's took ten minutes, {name}.", "This year's {test} was ______ than last year's, {name}.", "much easier", { test: ["test", "exam", "quiz", "project"], name: NAME }],
  [FIX, "This {thing} is very bigger than my old one, {name}.", "This {thing} is ______ than my old one, {name}.", "much bigger", { thing: ["bag", "room", "TV", "flat"], name: NAME }],
  [FIX, "The new {thing} is much more cheaper than the old one, {name}.", "The new {thing} is ______ than the old one, {name}.", "much cheaper", { thing: ["phone", "bike", "printer", "kettle"], name: NAME }],
  [FIX, "Maths is more much difficult than {subj} for me, {name}.", "Maths is ______ than {subj} for me, {name}.", "much more difficult", { subj: ["history", "English", "art", "biology"], name: NAME }],
  [FIX, "The {place} is much beautiful than the photos, {name}.", "The {place} is ______ than the photos, {name}.", "much more beautiful", { place: ["old town", "lake", "mountain", "garden"], name: NAME }],
  [FIX, "My {who} is much more old than me, {name}.", "My {who} is ______ than me, {name}.", "much older", { who: ["grandmother", "grandfather", "uncle", "aunt"], name: NAME }],
  [LOT, "The new {road} is a lot safer than the old one, {name}.", "The new {road} is ______ than the old one, {name}.", "much safer", { road: ["road", "bridge", "crossing", "bus stop"], name: NAME }],
  [LOT, "This {thing} is far more comfortable than that one, {name}.", "This {thing} is ______ than that one, {name}.", "much more comfortable", { thing: ["chair", "bed", "sofa", "car"], name: NAME }],
  [LOT, "{name} is a lot taller than her {sib}.", "{name} is ______ than her {sib}.", "much taller", { name: ["Madina", "Olga", "Sevara", "Nilufar"], sib: ["sister", "brother", "cousin", "mother"] }],
  [LOT, "Winter in {city} is far colder than in Tashkent, {name}.", "Winter in {city} is ______ than in Tashkent, {name}.", "much colder", { city: ["Moscow", "Nukus", "Almaty", "Kazan"], name: NAME }],
  [LOT, "This {test} was a lot more difficult than the last one, {name}.", "This {test} was ______ than the last one, {name}.", "much more difficult", { test: ["test", "exam", "quiz", "lesson"], name: NAME }],
].map(([instr, source, hint, key, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY(key), slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence comparing a plane and a bus. Use much.", "much + comparative", ["exactly one sentence", "much + -er or much more", "than"]],
  ["Write one sentence about the weather in summer and winter where you live.", "much hotter / much colder", ["exactly one sentence", "much", "than"]],
  ["Write one sentence comparing two subjects at school.", "much more difficult / much easier", ["exactly one sentence", "much", "two subjects"]],
  ["Write one sentence comparing two family members.", "much older / much taller", ["exactly one sentence", "much + comparative", "than"]],
  ["Write one sentence comparing the bazaar and a big shop.", "much cheaper / much busier", ["exactly one sentence", "much", "than"]],
  ["Write one sentence about a city that is much bigger than your town.", "much bigger", ["exactly one sentence", "much bigger", "two places"]],
  ["Write one sentence with much more + a long adjective.", "much more + adjective", ["exactly one sentence", "much more", "than"]],
  ["Write two sentences: one with much and one with slightly.", "much vs slightly", ["exactly two sentences", "much for a big difference", "slightly for a small one"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare life in a big city and a village. Write three or four sentences with much.", "much + comparative", ["much + -er", "much more + adjective", "than"]],
  ["Compare your school now with your primary school. Write three or four sentences.", "much bigger / much more difficult", ["much", "two places", "three or four sentences"]],
  ["Compare two ways to travel to Samarkand. Write three or four sentences.", "much faster / much cheaper", ["much", "than", "two kinds of transport"]],
  ["Compare two seasons where you live. Write three or four sentences.", "much hotter / much colder", ["much", "than", "weather words"]],
  ["Compare your life now with five years ago. Write three or four sentences.", "much happier / much busier", ["much + comparative", "than", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.modified-comparison.much-comparative.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "120 against 40 is a big difference: much bigger.",
   "30,000 against 2,000 is a big gap: much more expensive.",
   "42 against 30 degrees: much hotter.",
   "\"Nobody finished it\": a big difference: much more difficult.",
   "Two hours against six: much faster.",
   "\"I read it in two days\": much more interesting.",
   "85 against 50: much older.",
   "\"I can sleep in it\": much more comfortable.",
   "300 km against 100 km: much longer.",
   "Spring against winter, a big change: much more beautiful.",
   "Minus fifteen: a big difference: much colder.",
   "Bad weather against sun: much more dangerous.",
   "\"I finished in ten minutes\": much easier.",
   "A big gap in our school: much more popular.",
   "1.90 against 1.60: much taller.",
   "Health against a thing: much more important.",
   "\"What's in it?\": a big weight gap: much heavier.",
   "For work, a big gap: much more useful.",
   "A busy day against weekdays: much busier.",
   "\"She never goes fast\": much more careful."
  ],
  "build": [
   "cheap is short: much + cheaper.",
   "expensive is long: much more expensive.",
   "warm is short: much warmer.",
   "difficult is long: much more difficult.",
   "\"We sleep well now\": quiet → much quieter.",
   "comfortable is long: much more comfortable.",
   "small is short: much smaller.",
   "interesting is long: much more interesting.",
   "happy ends in -y: much happier.",
   "beautiful is long: much more beautiful.",
   "safe ends in -e: much safer.",
   "dangerous is long: much more dangerous.",
   "\"He can carry … alone\": much stronger.",
   "popular is long: much more popular.",
   "\"Let's walk\": near → much nearer.",
   "useful is long: much more useful.",
   "heavy ends in -y: much heavier.",
   "important is long: much more important.",
   "busy ends in -y: much busier.",
   "long is short: much longer."
  ],
  "transform": [
   "Ten hours against one: much faster.",
   "A few million more: much more expensive.",
   "40 against 5 degrees: much hotter.",
   "200 against 2,000 students: much bigger.",
   "An hour against ten minutes: much easier.",
   "Not very + -er: much bigger.",
   "much + -er, not much more cheaper: much cheaper.",
   "Order: much comes before more: much more difficult.",
   "beautiful is long, so more is needed: much more beautiful.",
   "old is short: much older, not much more old.",
   "a lot = much here: much safer.",
   "far = much here: much more comfortable.",
   "a lot = much here: much taller.",
   "far = much here: much colder.",
   "a lot = much here: much more difficult."
  ]
 },
 "slot": [
  [
   "build",
   9,
   "new school",
   "place",
   [
    "new school",
    "new job",
    "new club",
    "new college"
   ]
  ],
  [
   "build",
   8,
   "",
   "part",
   [
    "hour"
   ]
  ],
  [
   "build",
   8,
   "",
   "part",
   [
    "episode"
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
