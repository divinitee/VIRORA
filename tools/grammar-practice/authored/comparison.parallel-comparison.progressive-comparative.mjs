// Hand-authored: comparison / parallel-comparison / progressive-comparative (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): comparative + AND + comparative for a
// change that keeps growing (hotter and hotter, more and more nervous). Every
// sentence has a gradual change: get / become / grow, "as …", "every day".
// Triage: kept. Sibling the-more-the-more owns "the + comparative, the +
// comparative"; "more and more people" (a quantity) is not used here, only
// adjectives (and two adverbs: faster and faster, more and more slowly is cut).
// Choose: one adjective in four shapes: short → hotter and hotter / more and
// more hot / hot and hot / more hotter and hotter; long → more and more nervous /
// nervous and nervous / more nervous and nervous / most and most nervous.
// Build: typed; no source prints "and" or "more".
// Transform: 5 a bit … every day → … and … / 5 correct the mistake / 5 three
// steps of a change → got … and ….
//
// Run: node tools/grammar-practice/authored/comparison.parallel-comparison.progressive-comparative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "parallel-comparison", topic: "progressive-comparative", level: "B1", pv: "2.5" };
const NAME = ["Dilnoza", "Sardor", "Feruza", "Otabek"]; // listener names: never printed in a sentence (audit 20 Nov)
const ER = { hot: "hotter", cold: "colder", big: "bigger", dark: "darker", loud: "louder", long: "longer", fast: "faster", tall: "taller", warm: "warmer", busy: "busier", heavy: "heavier", easy: "easier", hungry: "hungrier", tired: null, small: "smaller", strong: "stronger", short: "shorter", quiet: "quieter", angry: "angrier", high: "higher", bad: "worse", good: "better" };
const prog = (a) => (ER[a] ? `${ER[a]} and ${ER[a]}` : `more and more ${a}`);
const WHY = (a) => `The change keeps growing: comparative + and + comparative, ${prog(a)}.`;
const opts = (a) => ER[a]
  ? [prog(a), /y$/.test(a) ? `the ${ER[a]}` : `more and more ${a}`, `${a} and ${a}`, `more ${ER[a]} and ${ER[a]}`] // -y adjectives: "more and more angry" is English too (audit 20 Nov)
  : [prog(a), `${a} and ${a}`, `more ${a} and ${a}`, `most and most ${a}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["nervous", "As the {test} got closer, I felt ______, {name}.", { test: ["exam", "interview", "driving test", "concert"], name: NAME }],
  ["hot", "In {month}, the days get ______ in {city}.", { month: ["June", "July", "early summer", "May"], city: ["Termez", "Bukhara", "Tashkent", "Karshi"] }],
  ["dark", "We walked home from the {place}, and the sky got ______, {name}.", { place: ["park", "bazaar", "station", "river"], name: NAME }],
  ["expensive", "Flats in {city} are getting ______ every year, {name}.", { city: ["Tashkent", "Samarkand", "Moscow", "Almaty"], name: NAME }],
  ["loud", "The music at the {event} got ______, so we left, {name}.", { event: ["party", "wedding", "concert", "festival"], name: NAME }],
  ["tired", "After five hours of walking in the {place}, the children got ______, {name}.", { place: ["old town", "mountains", "museum", "bazaar"], name: NAME }],
  ["big", "My little {pet} is getting ______ every week, {name}.", { pet: ["puppy", "kitten", "rabbit", "brother"], name: NAME }],
  ["difficult", "The {task} got ______ as we went on, {name}.", { task: ["test", "puzzle", "game", "homework"], name: NAME }],
  ["cold", "In {month}, the nights get ______ in the mountains, {name}.", { month: ["October", "November", "late autumn", "December"], name: NAME }],
  ["popular", "This {thing} is becoming ______ with young people, {name}.", { thing: ["app", "café", "game", "sport"], name: NAME }],
  ["long", "In {month}, the days get ______, {name}.", { month: ["March", "April", "May", "spring"], name: NAME }],
  ["angry", "The {who} waited for an answer and got ______, {name}.", { who: ["teacher", "coach", "boss", "director"], name: NAME }],
  ["busy", "The roads in our {city} are getting ______, {name}.", { city: ["town", "city", "village", "district"], name: NAME }],
  ["interesting", "The {book} got ______ after the first chapter, {name}.", { book: ["book", "story", "novel", "film"], name: NAME }],
  ["fast", "The {runner} ran ______ at the end of the race, {name}.", { runner: ["boy", "girl", "horse", "winner"], name: NAME }],
  ["hungry", "Dinner at the {place} was late, and we got ______, {name}.", { place: ["wedding", "party", "hotel", "camp"], name: NAME }],
  ["heavy", "My {bag} got ______ as I put more books in it, {name}.", { bag: ["bag", "backpack", "box", "suitcase"], name: NAME }],
  ["worried", "My mother got ______ when my brother didn't call {when}, {name}.", { when: ["all evening", "that night", "for two days", "all day"], name: NAME }],
  ["good", "Your {skill} is getting ______, {name}!", { skill: ["English", "Russian", "cooking", "drawing"], name: NAME }],
  ["strong", "The {weather} got ______, so we stayed inside, {name}.", { weather: ["wind", "rain", "storm", "snow"], name: NAME }],
].map(([a, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const o = opts(a);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY(a), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Show the change that keeps growing: write the comparative twice (… and …) with the adjective in brackets.";
// no source prints "and" or "more"
const BUILD = [
  ["nervous", "As the {event} got closer, {name} felt ______ (nervous).", { event: ["exam", "wedding", "interview", "match"], name: NAME }],
  ["hot", "The weather in {city} is getting ______ (hot) every week, {name}.", { city: ["Termez", "Bukhara", "Tashkent", "Karshi"], name: NAME }],
  ["cold", "As the sun went down over the {place}, it got ______ (cold), {name}.", { place: ["mountains", "lake", "desert", "village"], name: NAME }],
  ["expensive", "Food at the {place} is getting ______ (expensive), {name}.", { place: ["bazaar", "supermarket", "café", "canteen"], name: NAME }],
  ["tall", "Our {tree} is getting ______ (tall) every year, {name}.", { tree: ["apple tree", "cherry tree", "little brother", "son"], name: NAME }],
  ["loud", "The noise from the {place} got ______ (loud) all night, {name}.", { place: ["street", "party", "flat next door", "café"], name: NAME }],
  ["difficult", "The questions in the {test} got ______ (difficult), {name}.", { test: ["test", "quiz", "exam", "game"], name: NAME }],
  ["dark", "The clouds over the {place} got ______ (dark). It was going to rain, {name}.", { place: ["city", "mountains", "fields", "lake"], name: NAME }],
  ["popular", "Learning {lang} is becoming ______ (popular) in our {place}.", { lang: ["Korean", "English", "Chinese", "Turkish"], place: ["town", "school", "city", "country"] }],
  ["busy", "Our {shop} is getting ______ (busy) before Navruz, {name}.", { shop: ["shop", "café", "bakery", "market"], name: NAME }],
  ["long", "The queue at the {place} got ______ (long), {name}.", { place: ["bank", "post office", "bus stop", "museum"], name: NAME }],
  ["tired", "We climbed the {hill} for hours. My legs got ______ (tired), {name}.", { hill: ["hill", "mountain", "stairs", "path"], name: NAME }],
  ["big", "The town is getting ______ (big). There are new {thing} everywhere, {name}.", { thing: ["houses", "roads", "shops", "schools"], name: NAME }],
  ["interesting", "The {match} got ______ (interesting) in the second half, {name}.", { match: ["match", "game", "film", "final"], name: NAME }],
  ["warm", "In {month}, the water in the {water} gets ______ (warm).", { month: ["May", "June", "July", "August"], water: ["lake", "sea", "river", "pool"] }],
  ["angry", "The {who} waited in the traffic. He got ______ (angry), {name}.", { who: ["driver", "taxi driver", "bus driver", "man"], name: NAME }],
  ["good", "{name}'s cooking is getting ______ (good). Her plov is great now.", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
  ["bad", "The pain in my {part} got ______ (bad), so I called the doctor, {name}.", { part: ["tooth", "leg", "back", "knee"], name: NAME }],
  ["quiet", "As the night went on, the {place} got ______ (quiet), {name}.", { place: ["street", "town", "village", "city"], name: NAME }],
  ["strong", "{name} trains every day, so she is getting ______ (strong).", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
].map(([a, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: prog(a), ...(/y$/.test(a) && ER[a] ? { acceptable: [`more and more ${a}`] } : {}), why: WHY(a), slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const BIT = "Rewrite with … and … (the comparative twice).";
const FIX = "Correct the mistake.";
const STEP = "The change keeps growing. Rewrite the three sentences as one.";
// [instr, source, hint, adj, slots]
const TRANSFORM = [
  [BIT, "It gets a bit hotter every day in {month}, {name}.", "It gets ______ in {month}, {name}.", "hot", { month: ["June", "July", "August", "May"], name: NAME }],
  [BIT, "My {who} gets a little weaker every year, {name}.", "My {who} is getting ______, {name}.", "weak", { who: ["grandfather", "grandmother", "old dog", "uncle"], name: NAME }],
  [BIT, "The {test} questions got a bit harder each time, {name}.", "The {test} questions got ______, {name}.", "hard", { test: ["test", "quiz", "exam", "game"], name: NAME }],
  [BIT, "The {city} roads get a little busier every year, {name}.", "The {city} roads are getting ______, {name}.", "busy", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], name: NAME }],
  [BIT, "{thing} get a bit more expensive every year, {name}.", "{thing} are getting ______, {name}.", "expensive", { thing: ["Phones", "Flats", "Cars", "Plane tickets"], name: NAME }],
  [FIX, "It's getting more and more cold in {city}, {name}.", "It's getting ______ in {city}, {name}.", "cold", { city: ["Moscow", "Nukus", "Tashkent", "Almaty"], name: NAME }],
  [FIX, "The music got loud and loud at the {event}, {name}.", "The music got ______ at the {event}, {name}.", "loud", { event: ["party", "wedding", "concert", "festival"], name: NAME }],
  [FIX, "I felt more nervous and nervous before the {test}, {name}.", "I felt ______ before the {test}, {name}.", "nervous", { test: ["exam", "interview", "match", "concert"], name: NAME }],
  [FIX, "My little {pet} is getting more bigger and bigger, {name}.", "My little {pet} is getting ______, {name}.", "big", { pet: ["puppy", "kitten", "rabbit", "brother"], name: NAME }],
  [FIX, "This {thing} is becoming most and most popular, {name}.", "This {thing} is becoming ______, {name}.", "popular", { thing: ["app", "café", "game", "song"], name: NAME }],
  [STEP, "At first the sky over the {place} was dark. Then it was darker. Then it was very dark, {name}.", "The sky got ______, {name}.", "dark", { place: ["city", "lake", "mountains", "fields"], name: NAME }],
  [STEP, "At first my bag was heavy. Then it was heavier. At the end it was very heavy, {name}.", "My bag got ______, {name}.", "heavy", { name: NAME }],
  [STEP, "At first the {film} was interesting. Then it was more interesting. At the end it was great, {name}.", "The {film} got ______, {name}.", "interesting", { film: ["film", "book", "story", "series"], name: NAME }],
  [STEP, "At first the queue at the {place} was long. Then it was longer. Then it was very long, {name}.", "The queue got ______, {name}.", "long", { place: ["bank", "post office", "museum", "bus stop"], name: NAME }],
  [STEP, "At first {name} was angry. Then she was angrier. In the end she shouted.", "{name} got ______.", "angry", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
].map(([instr, source, hint, a, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  if (!ER[a] && ["weak", "hard"].includes(a)) ER[a] = a + "er";
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: prog(a), ...(/y$/.test(a) && ER[a] ? { acceptable: [`more and more ${a}`] } : {}), why: WHY(a), slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the weather getting hotter or colder.", "hotter and hotter / colder and colder", ["exactly one sentence", "-er and -er", "get or become"]],
  ["Write one sentence about how you felt before an exam.", "more and more nervous", ["exactly one sentence", "more and more + adjective", "as or before"]],
  ["Write one sentence about prices in your town.", "more and more expensive", ["exactly one sentence", "more and more", "getting"]],
  ["Write one sentence about a child or pet that is growing.", "bigger and bigger / taller and taller", ["exactly one sentence", "-er and -er", "getting"]],
  ["Write one sentence about your English or a skill you practise.", "better and better", ["exactly one sentence", "better and better", "getting"]],
  ["Write one sentence about a noise that got louder.", "louder and louder", ["exactly one sentence", "louder and louder", "past simple"]],
  ["Write one sentence about a film or book that got more and more interesting.", "more and more interesting", ["exactly one sentence", "more and more", "got"]],
  ["Write two sentences: one with -er and -er and one with more and more.", "short vs long adjectives", ["exactly two sentences", "-er and -er", "more and more + long adjective"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe how your town or city is changing. Write three or four sentences.", "-er and -er / more and more", ["getting + -er and -er", "more and more + adjective", "three or four sentences"]],
  ["Describe a storm or a hot day that got worse and worse. Write three or four sentences.", "progressive comparative in a story", ["got + -er and -er", "past simple", "weather words"]],
  ["Describe how you felt on the day of an exam or a big match. Write three or four sentences.", "more and more nervous / excited", ["more and more", "as …", "three or four sentences"]],
  ["Describe how your English has changed this year. Write three or four sentences.", "better and better / easier and easier", ["-er and -er", "getting", "three or four sentences"]],
  ["Describe a long trip that got more and more tiring. Write three or four sentences.", "more and more tired", ["more and more", "-er and -er", "past simple"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.parallel-comparison.progressive-comparative.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "\"As the … got closer\": the feeling grew: more and more nervous.",
   "Day after day in that month: hotter and hotter.",
   "The walk went on, the light went: darker and darker.",
   "\"every year\" a step up: more and more expensive.",
   "\"so we left\": the music kept rising: louder and louder.",
   "\"After five hours\": more and more tired.",
   "\"every week\" a bit more: bigger and bigger.",
   "\"as we went on\": more and more difficult.",
   "Night after night: colder and colder.",
   "A growing trend: more and more popular.",
   "Day after day: longer and longer.",
   "Waiting made it grow: angry → angrier and angrier.",
   "busy ends in -y: busier and busier.",
   "\"after the first chapter\": more and more interesting.",
   "\"at the end of the race\": faster and faster.",
   "Waiting for dinner: hungry → hungrier and hungrier.",
   "\"as I put more books in it\": heavier and heavier.",
   "No call, the worry grew: more and more worried.",
   "good → better, again and again: better and better.",
   "\"so we stayed inside\": stronger and stronger."
  ],
  "build": [
   "nervous is long: more and more nervous.",
   "hot doubles the t: hotter and hotter.",
   "\"As the sun went down\": colder and colder.",
   "expensive is long: more and more expensive.",
   "\"every year\": taller and taller.",
   "\"all night\": louder and louder.",
   "difficult is long: more and more difficult.",
   "\"It was going to rain\": darker and darker.",
   "popular is long: more and more popular.",
   "busy ends in -y: busier and busier.",
   "long is short: longer and longer.",
   "tired: more and more tired.",
   "big doubles the g: bigger and bigger.",
   "\"in the second half\": more and more interesting.",
   "warm is short: warmer and warmer.",
   "angry ends in -y: angrier and angrier.",
   "good → better: better and better.",
   "bad → worse: worse and worse.",
   "quiet takes -er: quieter and quieter.",
   "\"trains …\": stronger and stronger."
  ],
  "transform": [
   "\"a bit hotter every day\" = hotter and hotter.",
   "\"a little weaker every year\" = weaker and weaker.",
   "\"a bit harder each time\" = harder and harder.",
   "\"a little busier every year\" = busier and busier.",
   "\"a bit more expensive every year\" = more and more expensive.",
   "cold is short: colder and colder, not more and more cold.",
   "Repeat the -er form: louder and louder.",
   "Repeat more, not the adjective: more and more nervous.",
   "Not more + -er: bigger and bigger.",
   "more, not most: more and more popular.",
   "dark → darker → very dark: darker and darker.",
   "heavy → heavier → very heavy: heavier and heavier.",
   "interesting → more interesting: more and more interesting.",
   "long → longer → very long: longer and longer.",
   "angry → angrier → shouting: angrier and angrier."
  ]
 },
 "slot": [
  [
   "build",
   17,
   "plov",
   "dish",
   [
    "plov",
    "soup",
    "bread",
    "cake"
   ]
  ],
  [
   "build",
   20,
   "every day",
   "often",
   [
    "every day",
    "five times a week",
    "every morning",
    "after school"
   ]
  ],
  [
   "transform",
   12,
   "bag",
   "bag",
   [
    "bag",
    "box",
    "suitcase",
    "basket"
   ]
  ],
  [
   "transform",
   15,
   "shouted",
   "end",
   [
    "shouted",
    "left the room",
    "cried",
    "slammed the door"
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
