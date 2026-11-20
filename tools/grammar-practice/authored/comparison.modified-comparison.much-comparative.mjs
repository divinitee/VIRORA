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
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const WHY = (f) => `A big difference: much goes before the comparative, ${f}. Not very.`;
// [adj, short comparative or null for "more adj"]
const SH = { big: "bigger", cheap: "cheaper", hot: "hotter", fast: "faster", old: "older", long: "longer", cold: "colder", easy: "easier", tall: "taller", heavy: "heavier", warm: "warmer", busy: "busier", quiet: "quieter", small: "smaller", happy: "happier", safe: "safer", strong: "stronger", near: "nearer" };
const LG = ["expensive", "difficult", "interesting", "comfortable", "beautiful", "dangerous", "popular", "important", "useful", "careful"];
const opts = (adj) => SH[adj]
  ? [`much ${SH[adj]}`, `very ${SH[adj]}`, `much ${adj}`, `more ${SH[adj]}`]
  : [`much more ${adj}`, `much ${adj}`, `more much ${adj}`, `very more ${adj}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["big", "Our new flat is 120 square metres. The old one was 40. The new one is ______, {name}.", { name: NAME, x: [] }],
  ["expensive", "A taxi costs 30,000 soum, but the bus costs 2,000. The taxi is ______ than the {transport}.", { transport: ["bus", "metro", "minibus", "tram"], x: [] }],
  ["hot", "It's 42 degrees today and it was 30 yesterday. Today is ______ than yesterday, {name}.", { name: NAME, x: [] }],
  ["difficult", "This {test} is ______ than the last one. Nobody finished it, {name}.", { test: ["test", "exam", "quiz", "task"], name: NAME }],
  ["fast", "The train takes two hours, the bus takes six. The train is ______ than the {transport}.", { transport: ["bus", "minibus", "coach", "old bus"], x: [] }],
  ["interesting", "The {thing} was ______ than the film. I read it in two days, {name}.", { thing: ["book", "novel", "story", "comic"], name: NAME }],
  ["old", "My grandfather is 85 and my father is 50. My grandfather is ______ than my {who}.", { who: ["father", "dad", "uncle", "mother"], x: [] }],
  ["comfortable", "The new {seat} is ______ than the old one. I can sleep in it, {name}.", { seat: ["sofa", "bed", "chair", "armchair"], name: NAME }],
  ["long", "The {road} is 300 km. The new road is only 100 km. The {road} is ______.", { road: ["old road", "mountain road", "road through the villages", "old route"], x: [] }],
  ["beautiful", "The {place} is ______ in spring than in winter, {name}.", { place: ["park", "garden", "old town", "valley"], name: NAME }],
  ["cold", "It's minus fifteen in {city} today. It's ______ than in Tashkent.", { city: ["Moscow", "Nukus", "Almaty", "Kazan"], x: [] }],
  ["dangerous", "Riding a motorbike in the {weather} is ______ than in the sun, {name}.", { weather: ["rain", "snow", "dark", "fog"], name: NAME }],
  ["easy", "Today's {task} was ______ than yesterday's. I finished in ten minutes.", { task: ["homework", "test", "exercise", "quiz"], x: [] }],
  ["popular", "Football is ______ than {sport} in our school, {name}.", { sport: ["chess", "tennis", "handball", "golf"], name: NAME }],
  ["tall", "My brother is 1.90 m, and I'm 1.60 m. He's ______ than me, {name}.", { name: NAME, x: [] }],
  ["important", "Your health is ______ than your {thing}, {name}.", { thing: ["marks", "phone", "work", "money"], name: NAME }],
  ["heavy", "This {bag} is ______ than mine. What's in it, {name}?", { bag: ["bag", "suitcase", "box", "backpack"], name: NAME }],
  ["useful", "For me, English is ______ than {subj} at work.", { subj: ["chemistry", "art", "music", "drawing"], x: [] }],
  ["busy", "The bazaar is ______ on {day} than on weekdays, {name}.", { day: ["Sundays", "Saturdays", "holidays", "Fridays"], name: NAME }],
  ["careful", "My sister drives ______ than my brother. She never goes fast, {name}.", { name: NAME, x: [] }],
].map(([adj, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const o = opts(adj);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY(o[0]), slots: s };
});
// careful → "much more carefully" is the adverb; keep the adjective sentence instead:
CHOOSE[19].prompt = "My sister is ______ than my brother when she drives. She never goes fast, {name}.";

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write much and the comparative of the adjective in brackets.";
// [adj, source, slots]
const BUILD = [
  ["cheap", "The bazaar is ______ (cheap) than the supermarket, {name}.", { name: NAME, x: [] }],
  ["expensive", "Plane tickets are ______ (expensive) in {month} than in winter.", { month: ["July", "August", "June", "the summer"], x: [] }],
  ["warm", "It's ______ (warm) in {city} than in the mountains, {name}.", { city: ["Termez", "Bukhara", "Karshi", "Tashkent"], name: NAME }],
  ["difficult", "Russian grammar is ______ (difficult) for me than {lang} grammar.", { lang: ["English", "Turkish", "Uzbek", "Kazakh"], x: [] }],
  ["quiet", "Our new street is ______ (quiet) than the old one. We sleep well now, {name}.", { name: NAME, x: [] }],
  ["comfortable", "These {shoes} are ______ (comfortable) than my old ones.", { shoes: ["shoes", "trainers", "boots", "sandals"], x: [] }],
  ["small", "My {room} is ______ (small) than my brother's, {name}.", { room: ["room", "bedroom", "desk", "wardrobe"], name: NAME }],
  ["interesting", "The second {part} of the film was ______ (interesting) than the first.", { part: ["half", "part", "hour"], x: [] }],
  ["happy", "{name} is ______ (happy) at her new school than at the old one.", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
  ["beautiful", "The mountains are ______ (beautiful) in {season} than in winter.", { season: ["spring", "summer", "autumn", "May"], x: [] }],
  ["safe", "The new {road} is ______ (safe) than the old one, {name}.", { road: ["road", "bridge", "crossing", "bus stop"], name: NAME }],
  ["dangerous", "Swimming in the {water} is ______ (dangerous) than in the pool.", { water: ["river", "sea", "lake", "canal"], x: [] }],
  ["strong", "My uncle is ______ (strong) than me. He can carry the {thing} alone.", { thing: ["sofa", "fridge", "table", "washing machine"], x: [] }],
  ["popular", "This café is ______ (popular) than the one next to the {place}, {name}.", { place: ["bank", "station", "park", "school"], name: NAME }],
  ["near", "The {place} is ______ (near) than the bazaar. Let's walk, {name}.", { place: ["shop", "pharmacy", "bakery", "bus stop"], name: NAME }],
  ["useful", "A dictionary app is ______ (useful) than a paper {thing} for me.", { thing: ["dictionary", "book", "notebook", "list"], x: [] }],
  ["heavy", "The {thing} was ______ (heavy) than we thought, {name}.", { thing: ["box", "suitcase", "table", "melon"], name: NAME }],
  ["important", "For my parents, my {thing} is ______ (important) than football.", { thing: ["studies", "health", "family", "future"], x: [] }],
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
  [BIG, "My phone cost 2 million soum. {name}'s phone cost 10 million.", "{name}'s phone was ______ than mine.", "much more expensive", { name: NAME, x: [] }],
  [BIG, "In {month} it's 40 degrees. In January it's 5 degrees.", "In {month} it's ______ than in January.", "much hotter", { month: ["July", "August", "June", "summer"], x: [] }],
  [BIG, "The old {school} had 200 students. The new one has 2,000, {name}.", "The new {school} is ______ than the old one, {name}.", "much bigger", { school: ["school", "college", "lyceum", "library"], name: NAME }],
  [BIG, "Last year's test took me an hour. This year's took ten minutes, {name}.", "This year's test was ______ than last year's, {name}.", "much easier", { name: NAME, x: [] }],
  [FIX, "This {thing} is very bigger than my old one, {name}.", "This {thing} is ______ than my old one, {name}.", "much bigger", { thing: ["bag", "room", "TV", "flat"], name: NAME }],
  [FIX, "The new {thing} is much more cheaper than the old one.", "The new {thing} is ______ than the old one.", "much cheaper", { thing: ["phone", "bike", "printer", "kettle"], x: [] }],
  [FIX, "Maths is more much difficult than {subj} for me, {name}.", "Maths is ______ than {subj} for me, {name}.", "much more difficult", { subj: ["history", "English", "art", "biology"], name: NAME }],
  [FIX, "The {place} is much beautiful than the photos.", "The {place} is ______ than the photos.", "much more beautiful", { place: ["old town", "lake", "mountain", "garden"], x: [] }],
  [FIX, "My grandmother is much more old than my grandfather, {name}.", "My grandmother is ______ than my grandfather, {name}.", "much older", { name: NAME, x: [] }],
  [LOT, "The new {road} is a lot safer than the old one, {name}.", "The new {road} is ______ than the old one, {name}.", "much safer", { road: ["road", "bridge", "crossing", "bus stop"], name: NAME }],
  [LOT, "This {thing} is far more comfortable than that one.", "This {thing} is ______ than that one.", "much more comfortable", { thing: ["chair", "bed", "sofa", "car"], x: [] }],
  [LOT, "{name} is a lot taller than her sister.", "{name} is ______ than her sister.", "much taller", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
  [LOT, "Winter in {city} is far colder than in Tashkent.", "Winter in {city} is ______ than in Tashkent.", "much colder", { city: ["Moscow", "Nukus", "Almaty", "Kazan"], x: [] }],
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
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
