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
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const ER = { hot: "hotter", cold: "colder", big: "bigger", dark: "darker", loud: "louder", long: "longer", fast: "faster", tall: "taller", warm: "warmer", busy: "busier", heavy: "heavier", easy: "easier", hungry: "hungrier", tired: null, small: "smaller", strong: "stronger", short: "shorter", quiet: "quieter", angry: "angrier", high: "higher", bad: "worse", good: "better" };
const prog = (a) => (ER[a] ? `${ER[a]} and ${ER[a]}` : `more and more ${a}`);
const WHY = (a) => `The change keeps growing: comparative + and + comparative, ${prog(a)}.`;
const opts = (a) => ER[a]
  ? [prog(a), `more and more ${a}`, `${a} and ${a}`, `more ${ER[a]} and ${ER[a]}`]
  : [prog(a), `${a} and ${a}`, `more ${a} and ${a}`, `most and most ${a}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["nervous", "As the {test} got closer, I felt ______, {name}.", { test: ["exam", "interview", "driving test", "concert"], name: NAME }],
  ["hot", "In {month}, the days get ______ in {city}.", { month: ["June", "July", "early summer", "May"], city: ["Termez", "Bukhara", "Tashkent", "Karshi"] }],
  ["dark", "We walked home from the {place}, and the sky got ______, {name}.", { place: ["park", "bazaar", "station", "river"], name: NAME }],
  ["expensive", "Flats in {city} are getting ______ every year.", { city: ["Tashkent", "Samarkand", "Moscow", "Almaty"], x: [] }],
  ["loud", "The music at the {event} got ______, so we left, {name}.", { event: ["party", "wedding", "concert", "festival"], name: NAME }],
  ["tired", "After five hours of walking in the {place}, the children got ______.", { place: ["old town", "mountains", "museum", "bazaar"], x: [] }],
  ["big", "My little {pet} is getting ______ every week, {name}.", { pet: ["puppy", "kitten", "rabbit", "brother"], name: NAME }],
  ["difficult", "The {task} got ______ as we went on, {name}.", { task: ["test", "puzzle", "game", "homework"], name: NAME }],
  ["cold", "In {month}, the nights get ______ in the mountains.", { month: ["October", "November", "late autumn", "December"], x: [] }],
  ["popular", "This {thing} is becoming ______ with young people, {name}.", { thing: ["app", "café", "game", "sport"], name: NAME }],
  ["long", "In {month}, the days get ______, {name}.", { month: ["March", "April", "May", "spring"], name: NAME }],
  ["angry", "The {who} waited for an answer and got ______, {name}.", { who: ["teacher", "coach", "boss", "director"], name: NAME }],
  ["busy", "The roads in our {city} are getting ______.", { city: ["town", "city", "village", "district"], x: [] }],
  ["interesting", "The {book} got ______ after the first chapter, {name}.", { book: ["book", "story", "novel", "film"], name: NAME }],
  ["fast", "The {runner} ran ______ at the end of the race.", { runner: ["boy", "girl", "horse", "winner"], x: [] }],
  ["hungry", "Dinner at the {place} was late, and we got ______, {name}.", { place: ["wedding", "party", "hotel", "camp"], name: NAME }],
  ["heavy", "My {bag} got ______ as I put more books in it.", { bag: ["bag", "backpack", "box", "suitcase"], x: [] }],
  ["worried", "My mother got ______ when my brother didn't call {when}.", { when: ["all evening", "that night", "for two days", "all day"], x: [] }],
  ["good", "Your {skill} is getting ______, {name}!", { skill: ["English", "Russian", "cooking", "drawing"], name: NAME }],
  ["strong", "The {weather} got ______, so we stayed inside.", { weather: ["wind", "rain", "storm", "snow"], x: [] }],
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
  ["hot", "The weather in {city} is getting ______ (hot) every week.", { city: ["Termez", "Bukhara", "Tashkent", "Karshi"], x: [] }],
  ["cold", "As the sun went down over the {place}, it got ______ (cold), {name}.", { place: ["mountains", "lake", "desert", "village"], name: NAME }],
  ["expensive", "Food at the {place} is getting ______ (expensive).", { place: ["bazaar", "supermarket", "café", "canteen"], x: [] }],
  ["tall", "Our {tree} is getting ______ (tall) every year, {name}.", { tree: ["apple tree", "cherry tree", "little brother", "son"], name: NAME }],
  ["loud", "The noise from the {place} got ______ (loud) all night.", { place: ["street", "party", "flat next door", "café"], x: [] }],
  ["difficult", "The questions in the {test} got ______ (difficult), {name}.", { test: ["test", "quiz", "exam", "game"], name: NAME }],
  ["dark", "The clouds over the {place} got ______ (dark). It was going to rain, {name}.", { place: ["city", "mountains", "fields", "lake"], name: NAME }],
  ["popular", "Learning {lang} is becoming ______ (popular) in our {place}.", { lang: ["Korean", "English", "Chinese", "Turkish"], place: ["town", "school", "city", "country"] }],
  ["busy", "Our {shop} is getting ______ (busy) before Navruz, {name}.", { shop: ["shop", "café", "bakery", "market"], name: NAME }],
  ["long", "The queue at the {place} got ______ (long), {name}.", { place: ["bank", "post office", "bus stop", "museum"], name: NAME }],
  ["tired", "We climbed the {hill} for hours. My legs got ______ (tired), {name}.", { hill: ["hill", "mountain", "stairs", "path"], name: NAME }],
  ["big", "The town is getting ______ (big). There are new {thing} everywhere.", { thing: ["houses", "roads", "shops", "schools"], x: [] }],
  ["interesting", "The {match} got ______ (interesting) in the second half, {name}.", { match: ["match", "game", "film", "final"], name: NAME }],
  ["warm", "In {month}, the water in the {water} gets ______ (warm).", { month: ["May", "June", "July", "August"], water: ["lake", "sea", "river", "pool"] }],
  ["angry", "The {who} waited in the traffic. He got ______ (angry), {name}.", { who: ["driver", "taxi driver", "bus driver", "man"], name: NAME }],
  ["good", "{name}'s cooking is getting ______ (good). Her plov is great now.", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
  ["bad", "The pain in my {part} got ______ (bad), so I called the doctor.", { part: ["tooth", "leg", "back", "knee"], x: [] }],
  ["quiet", "As the night went on, the {place} got ______ (quiet).", { place: ["street", "town", "village", "city"], x: [] }],
  ["strong", "{name} trains every day, so she is getting ______ (strong).", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
].map(([a, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: prog(a), why: WHY(a), slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const BIT = "Rewrite with … and … (the comparative twice).";
const FIX = "Correct the mistake.";
const STEP = "The change keeps growing. Rewrite the three sentences as one.";
// [instr, source, hint, adj, slots]
const TRANSFORM = [
  [BIT, "It gets a bit hotter every day in {month}, {name}.", "It gets ______ in {month}, {name}.", "hot", { month: ["June", "July", "August", "May"], name: NAME }],
  [BIT, "My {who} gets a little weaker every year, {name}.", "My {who} is getting ______, {name}.", "weak", { who: ["grandfather", "grandmother", "old dog", "uncle"], name: NAME }],
  [BIT, "The {test} questions got a bit harder each time.", "The {test} questions got ______.", "hard", { test: ["test", "quiz", "exam", "game"], x: [] }],
  [BIT, "The {city} roads get a little busier every year.", "The {city} roads are getting ______.", "busy", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], x: [] }],
  [BIT, "{thing} get a bit more expensive every year, {name}.", "{thing} are getting ______, {name}.", "expensive", { thing: ["Phones", "Flats", "Cars", "Plane tickets"], name: NAME }],
  [FIX, "It's getting more and more cold in {city}, {name}.", "It's getting ______ in {city}, {name}.", "cold", { city: ["Moscow", "Nukus", "Tashkent", "Almaty"], name: NAME }],
  [FIX, "The music got loud and loud at the {event}.", "The music got ______ at the {event}.", "loud", { event: ["party", "wedding", "concert", "festival"], x: [] }],
  [FIX, "I felt more nervous and nervous before the {test}, {name}.", "I felt ______ before the {test}, {name}.", "nervous", { test: ["exam", "interview", "match", "concert"], name: NAME }],
  [FIX, "My little {pet} is getting more bigger and bigger.", "My little {pet} is getting ______.", "big", { pet: ["puppy", "kitten", "rabbit", "brother"], x: [] }],
  [FIX, "This {thing} is becoming most and most popular, {name}.", "This {thing} is becoming ______, {name}.", "popular", { thing: ["app", "café", "game", "song"], name: NAME }],
  [STEP, "At first the sky over the {place} was dark. Then it was darker. Then it was very dark, {name}.", "The sky got ______, {name}.", "dark", { place: ["city", "lake", "mountains", "fields"], name: NAME }],
  [STEP, "At first my bag was heavy. Then it was heavier. At the end it was very heavy.", "My bag got ______.", "heavy", { x: [], y: [] }],
  [STEP, "At first the {film} was interesting. Then it was more interesting. At the end it was great.", "The {film} got ______.", "interesting", { film: ["film", "book", "story", "series"], x: [] }],
  [STEP, "At first the queue at the {place} was long. Then it was longer. Then it was very long, {name}.", "The queue got ______, {name}.", "long", { place: ["bank", "post office", "museum", "bus stop"], name: NAME }],
  [STEP, "At first {name} was angry. Then she was angrier. In the end she shouted.", "{name} got ______.", "angry", { name: ["Madina", "Olga", "Sevara", "Nilufar"], x: [] }],
].map(([instr, source, hint, a, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  if (!ER[a] && ["weak", "hard"].includes(a)) ER[a] = a + "er";
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: prog(a), why: WHY(a), slots: s };
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
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
