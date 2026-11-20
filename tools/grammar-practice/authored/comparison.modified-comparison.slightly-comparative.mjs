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
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const SH = { cheap: "cheaper", warm: "warmer", tall: "taller", long: "longer", old: "older", big: "bigger", fast: "faster", heavy: "heavier", cold: "colder", short: "shorter", quiet: "quieter", small: "smaller", easy: "easier", early: "earlier", late: "later" };
const comp = (a) => SH[a] || `more ${a}`;
const sup = (a) => SH[a] ? (a === "big" ? "biggest" : SH[a].replace(/er$/, "est")) : `most ${a}`;
const WHY_M = (f) => `The numbers are close, so the difference is small: slightly + comparative, ${f}. Not very.`;
const WHY_F = (f) => `After slightly, use the comparative: ${f}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [kind m = choose the modifier, f = choose the form; adj; prompt; slots]
const CHOOSE = [
  ["m", "expensive", "The bag was 100,000 soum last month. Now it's 103,000. It's ______ more expensive, {name}.", { name: NAME, x: [] }],
  ["m", "warm", "It was 20 degrees yesterday and it's 21 today. Today is ______ warmer than yesterday, {name}.", { name: NAME, x: [] }],
  ["m", "tall", "I'm 1.70 m and my {who} is 1.72 m. He's ______ taller than me.", { who: ["brother", "cousin", "friend", "father"], x: [] }],
  ["m", "long", "The old road is 50 km and the new one is 52 km. The new road is ______ longer, {name}.", { name: NAME, x: [] }],
  ["m", "old", "My sister is 15 and a half, and her friend is 16. Her friend is ______ older, {name}.", { name: NAME, x: [] }],
  ["m", "heavy", "My bag is 7 kg and yours is 7.5 kg. Yours is ______ heavier, {name}.", { name: NAME, x: [] }],
  ["m", "fast", "{name} ran 100 metres in 13.1 seconds, and his friend ran it in 13.3. {name} is ______ faster.", { name: ["Sardor", "Timur", "Ilya", "Jasur"], x: [] }],
  ["m", "cheap", "The {thing} costs 49,000 at the bazaar and 50,000 in the shop. The bazaar is ______ cheaper.", { thing: ["melon", "shirt", "pan", "toy"], x: [] }],
  ["m", "big", "Our flat is 70 square metres, and yours is 72. Yours is ______ bigger, {name}.", { name: NAME, x: [] }],
  ["m", "early", "The {transport} leaves at 8:00 and the train at 8:05. The {transport} leaves ______ earlier.", { transport: ["bus", "minibus", "tram", "coach"], x: [] }],
  ["f", "efficient", "The new {thing} is slightly ______ than the old one, {name}.", { thing: ["fridge", "heater", "washing machine", "car"], name: NAME }],
  ["f", "cheap", "These {goods} are slightly ______ at the bazaar than in the {shop}.", { goods: ["apples", "tomatoes", "eggs", "potatoes"], shop: ["supermarket", "shop", "mall", "kiosk"] }],
  ["f", "comfortable", "This {seat} is slightly ______ than that one, {name}.", { seat: ["chair", "sofa", "bed", "seat"], name: NAME }],
  ["f", "cold", "It's slightly ______ in the {room} than in the kitchen, {name}.", { room: ["bedroom", "hall", "garage", "bathroom"], name: NAME }],
  ["f", "difficult", "The second {test} was slightly ______ than the first, {name}.", { test: ["test", "exam", "quiz", "exercise"], name: NAME }],
  ["f", "short", "My hair is slightly ______ than my {who}'s.", { who: ["sister", "mother", "cousin", "friend"], x: [] }],
  ["f", "interesting", "I think the {thing} is slightly ______ than the film, {name}.", { thing: ["book", "story", "comic", "novel"], name: NAME }],
  ["f", "quiet", "Our new {area} is slightly ______ than the old one.", { area: ["street", "flat", "office", "classroom"], x: [] }],
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
    if (!SH[adj]) opts = [c, adj, `most ${adj}`, `more ${adj}er`.replace("more " + adj + "er", `${adj}er`)];
    why = WHY_F(c);
  }
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write the comparative of the adjective in brackets.";
const BUILD = [
  ["cheap", "This {thing} is slightly ______ (cheap) online, {name}.", { thing: ["phone", "jacket", "book", "game"], name: NAME }],
  ["warm", "It's slightly ______ (warm) in {month} than in March.", { month: ["April", "May", "the spring", "early April"], x: [] }],
  ["expensive", "The red {thing} is slightly ______ (expensive) than the blue one, {name}.", { thing: ["bag", "dress", "scarf", "bike"], name: NAME }],
  ["tall", "My {who} is slightly ______ (tall) than me now.", { who: ["little brother", "sister", "cousin", "son"], x: [] }],
  ["comfortable", "The new {seat} is slightly ______ (comfortable) than the old one, {name}.", { seat: ["sofa", "chair", "bed", "car seat"], name: NAME }],
  ["early", "This {transport} leaves slightly ______ (early) than the other one, {name}.", { transport: ["bus", "train", "minibus", "tram"], name: NAME }],
  ["difficult", "Today's {task} was slightly ______ (difficult) than yesterday's.", { task: ["homework", "test", "lesson", "exercise"], x: [] }],
  ["long", "The way through the {place} is slightly ______ (long), but it's nicer, {name}.", { place: ["park", "old town", "bazaar", "village"], name: NAME }],
  ["old", "My {who} is slightly ______ (old) than my mother.", { who: ["father", "aunt", "uncle", "godmother"], x: [] }],
  ["heavy", "This {bag} is slightly ______ (heavy) than I thought, {name}.", { bag: ["suitcase", "box", "bag", "backpack"], name: NAME }],
  ["quiet", "The {room} is slightly ______ (quiet) in the evening, {name}.", { room: ["library", "café", "hall", "street"], name: NAME }],
  ["popular", "Volleyball is slightly ______ (popular) than {sport} in our {place}.", { sport: ["basketball", "tennis", "handball", "chess"], place: ["school", "college", "club", "village"] }],
  ["short", "The new {route} is slightly ______ (short) than the old one, {name}.", { route: ["route", "road", "path", "way"], name: NAME }],
  ["small", "My {thing} is slightly ______ (small) than yours, {name}.", { thing: ["room", "phone", "desk", "bike"], name: NAME }],
  ["interesting", "The second {part} was slightly ______ (interesting) than the first, {name}.", { part: ["half", "part", "lesson", "chapter"], name: NAME }],
  ["late", "Our {event} starts slightly ______ (late) this week, {name}.", { event: ["lesson", "training", "meeting", "class"], name: NAME }],
  ["easy", "This {test} is slightly ______ (easy) than the last one.", { test: ["test", "exam", "quiz", "exercise"], x: [] }],
  ["fast", "The new {device} is slightly ______ (fast) than my old one, {name}.", { device: ["laptop", "phone", "computer", "tablet"], name: NAME }],
  ["big", "Your {room} is slightly ______ (big) than ours, {name}.", { room: ["kitchen", "flat", "garden", "yard"], name: NAME }],
  ["cold", "The water is slightly ______ (cold) today than yesterday, {name}.", { name: NAME, x: [] }],
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
  [NUM, "I'm 1.60 m. My {who} is 1.62 m.", "My {who} is ______ than me.", "slightly taller", { who: ["sister", "cousin", "friend", "mother"], x: [] }],
  [NUM, "Today it's 15 degrees. Yesterday it was 14, {name}.", "Today it's ______ than yesterday, {name}.", "slightly warmer", { name: NAME, x: [] }],
  [NUM, "The {transport} takes 40 minutes. The train takes 38, {name}.", "The train is ______ than the {transport}, {name}.", "slightly faster", { transport: ["bus", "minibus", "car", "coach"], name: NAME }],
  [NUM, "My box is 10 kg. {name}'s box is 11 kg.", "{name}'s box is ______ than mine.", "slightly heavier", { name: NAME, x: [] }],
  [BIT, "This {thing} is a bit cheaper than that one, {name}.", "This {thing} is ______ than that one, {name}.", "slightly cheaper", { thing: ["shirt", "bag", "pen", "cake"], name: NAME }],
  [BIT, "The second {test} was a little more difficult, {name}.", "The second {test} was ______, {name}.", "slightly more difficult", { test: ["test", "exam", "quiz", "lesson"], name: NAME }],
  [BIT, "It's a bit colder in the {room} than in the kitchen.", "It's ______ in the {room} than in the kitchen.", "slightly colder", { room: ["bedroom", "hall", "garage", "bathroom"], x: [] }],
  [BIT, "My {who} is a little older than my father.", "My {who} is ______ than my father.", "slightly older", { who: ["mother", "uncle", "aunt", "godfather"], x: [] }],
  [BIT, "Our new {area} is a bit quieter, {name}.", "Our new {area} is ______, {name}.", "slightly quieter", { area: ["street", "flat", "office", "classroom"], name: NAME }],
  [FIX, "This {thing} is slightly more cheaper than that one, {name}.", "This {thing} is ______ than that one, {name}.", "slightly cheaper", { thing: ["bag", "phone", "melon", "lamp"], name: NAME }],
  [FIX, "Today is very warmer than yesterday, but only a little, {name}.", "Today is ______ than yesterday, {name}.", "slightly warmer", { name: NAME, x: [] }],
  [FIX, "The new {seat} is slightly comfortable than the old one.", "The new {seat} is ______ than the old one.", "slightly more comfortable", { seat: ["sofa", "chair", "bed", "seat"], x: [] }],
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
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
