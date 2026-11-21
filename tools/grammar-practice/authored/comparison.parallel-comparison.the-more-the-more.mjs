// Hand-authored: comparison / parallel-comparison / the-more-the-more (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): The + comparative …, the + comparative …
// (two changes that go together). Full clauses only; the short C1 form
// ("the sooner, the better") is left to the C1 item. Sibling progressive-comparative
// owns "-er and -er".
// Choose: the blank is either half. Options: the better / better / the best / more
// better; The more / More / The most / The much.
// Build and transform: both halves are blanks with an ARRAY key, because "the" is
// printed in the other half and a single typed key would repeat it.
// Transform: 5 if … more → the …, the … / 5 correct the mistake / 5 as … → the …, the ….
//
// Run: node tools/grammar-practice/authored/comparison.parallel-comparison.the-more-the-more.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "parallel-comparison", topic: "the-more-the-more", level: "B1", pv: "2.5" };
const NAME = ["Nodira", "Akmal", "Zarina", "Sherzod"]; // listener names: never printed in a sentence (audit 20 Nov)
const SHE = ["Madina", "Olga", "Sevara", "Nilufar"];
const WHY = "Two changes go together: The + comparative …, the + comparative ….";

// option sets: [key, wrong, wrong, wrong]
const SUP = { better: "the best", angrier: "the angriest", sooner: "the soonest", wiser: "the wisest", thirstier: "the thirstiest", nicer: "the nicest", higher: "the highest", harder: "the hardest", scarier: "the scariest" };
const short = (c) => [`the ${c}`, c, SUP[c], `more ${c}`];
const shortFirst = (c) => [`The ${c}`, c[0].toUpperCase() + c.slice(1), SUP[c][0].toUpperCase() + SUP[c].slice(1), `More ${c}`];
const long = (a) => [`the more ${a}`, `more ${a}`, `the most ${a}`, `the ${a}`];
const MORE = ["the more", "more", "the most", "the much"];
const MORE1 = ["The more", "More", "The most", "The much"];
const LESS1 = ["The less", "Less", "The least", "The little"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [short("better"), "The more you practise {skill}, ______ you get, {name}.", { skill: ["English", "the piano", "football", "chess"], name: NAME }],
  [short("angrier"), "The longer we waited at the {place}, ______ we got, {name}.", { place: ["bus stop", "bank", "airport", "station"], name: NAME }],
  [LESS1, "______ you sleep, the more tired you feel in {time}, {name}.", { time: ["the morning", "class", "the afternoon", "the evening"], name: NAME }],
  [MORE, "The hotter the weather in {city}, ______ water we drink, {name}.", { city: ["Termez", "Bukhara", "Tashkent", "Karshi"], name: NAME }],
  [MORE1, "______ you read in {lang}, the more words you learn, {name}.", { lang: ["English", "Russian", "Korean", "Turkish"], name: NAME }],
  [short("sooner"), "The earlier we leave for the {place}, ______ we arrive, {name}.", { place: ["airport", "station", "wedding", "match"], name: NAME }],
  [MORE, "The bigger the {thing}, ______ it costs, {name}.", { thing: ["flat", "car", "cake", "room"], name: NAME }],
  [short("wiser"), "The older my {who} gets, ______ he becomes, {name}.", { who: ["grandfather", "uncle", "father", "teacher"], name: NAME }],
  [long("dangerous"), "The faster you drive on the {road}, ______ it is, {name}.", { road: ["motorway", "mountain road", "ring road", "old bridge"], name: NAME }],
  [short("thirstier"), "The more {food} you eat, ______ you get, {name}.", { food: ["salty crisps", "salted nuts", "dried fish", "salty cheese"], name: NAME }],
  [short("nicer"), "The more you smile, ______ people at {place} are to you, {name}.", { place: ["work", "school", "college", "the office"], name: NAME }],
  [MORE1, "______ we train at the {place}, the better our team gets, {name}.", { place: ["stadium", "gym", "club", "park"], name: NAME }],
  [MORE, "The colder it gets in {month}, ______ clothes we wear, {name}.", { month: ["November", "December", "January", "February"], name: NAME }],
  [MORE, "The less you spend at the {shop}, ______ you save, {name}.", { shop: ["bazaar", "mall", "café", "supermarket"], name: NAME }],
  [long("tired"), "The more {task} I do, ______ I feel, {name}.", { task: ["homework", "housework", "overtime", "sport"], name: NAME }],
  [short("higher"), "The harder you study for the {test}, ______ your mark will be, {name}.", { test: ["exam", "test", "quiz", "IELTS exam"], name: NAME }],
  [shortFirst("scarier"), "______ the {film}, the more I like it, {name}.", { film: ["film", "story", "book", "game"], name: NAME }],
  [long("fun"), "The more people come to the {event}, ______ it is, {name}.", { event: ["party", "wedding", "picnic", "concert"], name: NAME }],
  [short("harder"), "The faster you speak {lang}, ______ it is to understand you, {name}.", { lang: ["English", "Russian", "Uzbek", "Korean"], name: NAME }],
  [MORE, "The cheaper the {thing} at the {shop}, ______ people buy.", { thing: ["bread", "fruit", "rice", "meat"], shop: ["bazaar", "shop", "market", "supermarket"] }],
].map(([o, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots: s };
});

/* ---------------- build: 20 gap_fill, two blanks ---------------- */
const INSTR = "Complete both parts with the + comparative. Use the words in brackets.";
const BUILD = [
  ["The more", "the better", "______ (much) you practise {skill}, ______ (good) you get, {name}.", { skill: ["English", "the piano", "football", "chess"], name: NAME }],
  ["The longer", "the angrier", "______ (long) we waited at the {place}, ______ (angry) we got, {name}.", { place: ["bus stop", "bank", "airport", "station"], name: NAME }],
  ["The less", "the more tired", "______ (little) you sleep, ______ (tired) you feel in {time}, {name}.", { time: ["the morning", "class", "the afternoon", "the evening"], name: NAME }],
  ["The hotter", "the more", "______ (hot) the weather in {city}, ______ (much) water we drink, {name}.", { city: ["Termez", "Bukhara", "Tashkent", "Karshi"], name: NAME }],
  ["The earlier", "the sooner", "______ (early) we leave for the {place}, ______ (soon) we arrive, {name}.", { place: ["airport", "station", "wedding", "match"], name: NAME }],
  ["The bigger", "the more expensive", "______ (big) the {thing}, ______ (expensive) it is, {name}.", { thing: ["flat", "car", "cake", "room"], name: NAME }],
  ["The older", "the wiser", "______ (old) my {who} gets, ______ (wise) he becomes, {name}.", { who: ["grandfather", "uncle", "father", "teacher"], name: NAME }],
  ["The faster", "the more dangerous", "______ (fast) you drive on the {road}, ______ (dangerous) it is, {name}.", { road: ["motorway", "mountain road", "ring road", "old bridge"], name: NAME }],
  ["The more", "the easier", "______ (much) you read in {lang}, ______ (easy) it gets, {name}.", { lang: ["English", "Russian", "Korean", "Turkish"], name: NAME }],
  ["The colder", "the warmer", "______ (cold) it gets in {month}, ______ (warm) the clothes we need, {name}.", { month: ["November", "December", "January", "February"], name: NAME }],
  ["The harder", "the higher", "______ (hard) you study for the {test}, ______ (high) your mark will be, {name}.", { test: ["exam", "test", "quiz", "IELTS exam"], name: NAME }],
  ["The nearer", "the more nervous", "______ (near) the {event} gets, ______ (nervous) I feel, {name}.", { event: ["exam", "wedding", "match", "interview"], name: NAME }],
  ["The more", "the more fun", "______ (many) people come to the {event}, ______ (fun) it is, {name}.", { event: ["party", "wedding", "picnic", "concert"], name: NAME }],
  ["The less", "the more", "______ (little) you spend at the {shop}, ______ (much) you save, {name}.", { shop: ["bazaar", "mall", "café", "supermarket"], name: NAME }],
  ["The faster", "the more difficult", "______ (fast) you speak {lang}, ______ (difficult) it is to understand you, {name}.", { lang: ["English", "Russian", "Uzbek", "Korean"], name: NAME }],
  ["The scarier", "the more", "______ (scary) the {film}, ______ (much) I like it, {name}.", { film: ["film", "story", "book", "game"], name: NAME }],
  ["The higher", "the colder", "______ (high) we climbed up the {hill}, ______ (cold) it got, {name}.", { hill: ["hill", "mountain", "tower", "path"], name: NAME }],
  ["The more", "the thirstier", "______ (much) {food} you eat, ______ (thirsty) you get, {name}.", { food: ["salty crisps", "salted nuts", "dried fish", "salty cheese"], name: NAME }],
  ["The louder", "the happier", "______ (loud) the music at the {event}, ______ (happy) the children are, {name}.", { event: ["party", "wedding", "picnic", "festival"], name: NAME }],
  ["The more", "the stronger", "______ (much) {name} trains at the {gym}, ______ (strong) she gets.", { name: SHE, gym: ["gym", "club", "stadium", "pool"] }],
].map(([k1, k2, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: [k1, k2], why: WHY, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const IF = "Rewrite with The …, the … .";
const FIX = "Correct the mistake.";
const AS = "Rewrite the sentence with The …, the … .";
// [instr, source, hint, k1, k2, slots]
const TRANSFORM = [
  [IF, "If you practise {skill} more, you get better, {name}.", "______ you practise {skill}, ______ you get, {name}.", "The more", "the better", { skill: ["English", "the piano", "football", "chess"], name: NAME }],
  [IF, "If we leave for the {place} earlier, we will arrive sooner, {name}.", "______ we leave for the {place}, ______ we will arrive, {name}.", "The earlier", "the sooner", { place: ["airport", "station", "wedding", "match"], name: NAME }],
  [IF, "If you read more in {lang}, it gets easier, {name}.", "______ you read in {lang}, ______ it gets, {name}.", "The more", "the easier", { lang: ["English", "Russian", "Korean", "Turkish"], name: NAME }],
  [IF, "If you spend less at the {shop}, you save more, {name}.", "______ you spend at the {shop}, ______ you save, {name}.", "The less", "the more", { shop: ["bazaar", "mall", "café", "supermarket"], name: NAME }],
  [IF, "If you drive faster on the {road}, it is more dangerous, {name}.", "______ you drive on the {road}, ______ it is, {name}.", "The faster", "the more dangerous", { road: ["motorway", "mountain road", "ring road", "old bridge"], name: NAME }],
  [FIX, "The more you study for the {test}, better your mark will be, {name}.", "______ you study for the {test}, ______ your mark will be, {name}.", "The more", "the better", { test: ["exam", "test", "quiz", "IELTS exam"], name: NAME }],
  [FIX, "The longer we waited at the {place}, the more angrier we got, {name}.", "______ we waited at the {place}, ______ we got, {name}.", "The longer", "the angrier", { place: ["bus stop", "bank", "airport", "station"], name: NAME }],
  [FIX, "More you sleep, the less tired you feel in {time}, {name}.", "______ you sleep, ______ you feel in {time}, {name}.", "The more", "the less tired", { time: ["the morning", "class", "the afternoon", "the evening"], name: NAME }],
  [FIX, "The hotter the weather in {city}, the most water we drink, {name}.", "______ the weather in {city}, ______ water we drink, {name}.", "The hotter", "the more", { city: ["Termez", "Bukhara", "Tashkent", "Karshi"], name: NAME }],
  [FIX, "The much people come to the {event}, the more fun it is, {name}.", "______ people come to the {event}, ______ it is, {name}.", "The more", "the more fun", { event: ["party", "wedding", "picnic", "concert"], name: NAME }],
  [AS, "As my {who} gets older, he gets wiser, {name}.", "______ my {who} gets, ______ he gets, {name}.", "The older", "the wiser", { who: ["grandfather", "uncle", "father", "teacher"], name: NAME }],
  [AS, "As we climbed higher up the {hill}, it got colder, {name}.", "______ we climbed up the {hill}, ______ it got, {name}.", "The higher", "the colder", { hill: ["hill", "mountain", "tower", "path"], name: NAME }],
  [AS, "As it gets later at the {event}, I feel more tired, {name}.", "______ it gets at the {event}, ______ I feel, {name}.", "The later", "the more tired", { event: ["party", "wedding", "concert", "meeting"], name: NAME }],
  [AS, "As {name} trains more at the {gym}, she gets stronger.", "______ {name} trains at the {gym}, ______ she gets.", "The more", "the stronger", { name: SHE, gym: ["gym", "club", "stadium", "pool"] }],
  [AS, "As the music at the {event} gets louder, the children get happier, {name}.", "______ the music at the {event} gets, ______ the children get, {name}.", "The louder", "the happier", { event: ["party", "wedding", "picnic", "festival"], name: NAME }],
].map(([instr, source, hint, k1, k2, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: [k1, k2], why: WHY, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with The more you practise, the … .", "The more …, the + comparative", ["exactly one sentence", "the + comparative twice", "a comma between the halves"]],
  ["Write one sentence about sleep and how you feel.", "The less / more …, the …", ["exactly one sentence", "The + comparative …, the + comparative …", "a comma"]],
  ["Write one sentence about the weather and what people do.", "The hotter / colder …, the …", ["exactly one sentence", "-er in the first half", "the more in the second half"]],
  ["Write one sentence about money: spending and saving.", "The less …, the more …", ["exactly one sentence", "The less", "the more"]],
  ["Write one sentence about learning English.", "The more …, the easier / better …", ["exactly one sentence", "The more", "the + -er"]],
  ["Write one sentence about a film, game or book you like.", "The scarier / longer …, the more I like it", ["exactly one sentence", "The + -er", "the more"]],
  ["Write one sentence about getting older.", "The older …, the wiser / happier …", ["exactly one sentence", "The older", "the + comparative"]],
  ["Write one sentence with a long adjective in the second half.", "the more + long adjective", ["exactly one sentence", "The + comparative", "the more + adjective"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Give a friend three pieces of advice about learning English. Use The …, the … in each.", "The + comparative …, the + comparative …", ["three sentences", "The more …, the …", "the + -er / the more + adjective"]],
  ["Describe how the weather changes what people do in your town. Write three or four sentences.", "parallel comparative about weather", ["The hotter / colder …", "the more …", "three or four sentences"]],
  ["Describe a sport or hobby: what happens when you practise more? Write three or four sentences.", "The more you practise, the …", ["The more …, the …", "present simple", "three or four sentences"]],
  ["Describe a busy day: what happened as it got later? Write three or four sentences.", "The later it got, the …", ["The + -er …, the …", "past simple", "three or four sentences"]],
  ["Write about money: spending, saving and prices. Write three or four sentences.", "The less / more …, the more / less …", ["The less …", "the more …", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.parallel-comparison.the-more-the-more.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "Practice goes up, skill goes up: the + better.",
   "Longer wait, more anger: the + angrier.",
   "Less sleep, more tired: The less.",
   "Hotter weather, more drinking: the more water.",
   "More reading, more words: The more.",
   "Earlier start, sooner arrival: the sooner.",
   "Bigger size, higher price: the more it costs.",
   "Older age, more wisdom: the wiser.",
   "Faster driving, more danger: the more dangerous.",
   "More eating, more thirst: thirsty → the thirstier.",
   "More smiles, kinder people: the nicer.",
   "More training, a better team: The more.",
   "Colder weather, more layers: the more clothes.",
   "Spend less, save more: the more.",
   "More work, more tiredness: the more tired.",
   "Harder study, a higher mark: the higher.",
   "Scarier film, more liking: scary → The scarier.",
   "More people, more fun: the more fun.",
   "Faster speech, harder to follow: the harder.",
   "Cheaper price, more buyers: the more."
  ],
  "build": [
   "much → more, good → better: The more … the better.",
   "long → longer, angry → angrier.",
   "little → less, tired → more tired.",
   "hot → hotter, much → more.",
   "early → earlier, soon → sooner.",
   "big → bigger, expensive → more expensive.",
   "old → older, wise → wiser.",
   "fast → faster, dangerous → more dangerous.",
   "much → more, easy → easier.",
   "cold → colder, warm → warmer.",
   "hard → harder, high → higher.",
   "near → nearer, nervous → more nervous.",
   "many → more, fun → more fun.",
   "little → less, much → more.",
   "fast → faster, difficult → more difficult.",
   "scary → scarier, much → more.",
   "high → higher, cold → colder.",
   "much → more, thirsty → thirstier.",
   "loud → louder, happy → happier.",
   "much → more, strong → stronger."
  ],
  "transform": [
   "If more …, better …: The more … the better.",
   "If earlier …, sooner …: The earlier … the sooner.",
   "If more …, easier …: The more … the easier.",
   "If less …, more …: The less … the more.",
   "If faster …, more dangerous …: The faster … the more dangerous.",
   "Both halves need the: the better.",
   "Not more angrier: the angrier.",
   "The first half needs The too: The more.",
   "more, not most: the more.",
   "many people → The more, not The much.",
   "As … older, … wiser: The older … the wiser.",
   "As … higher, … colder: The higher … the colder.",
   "As … later, … more tired: The later … the more tired.",
   "As … trains more, … stronger: The more … the stronger.",
   "As … louder, … happier: The louder … the happier."
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
