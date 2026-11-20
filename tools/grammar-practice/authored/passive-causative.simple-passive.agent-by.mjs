// Hand-authored: passive-causative / simple-passive / agent-by (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): in a passive sentence BY introduces the doer
// (the agent) and WITH introduces the thing they used (the instrument):
// The lock was forced with a screwdriver by one of the thieves.
// Triage: kept. A2 active-to-passive owns turning active → passive with by; this
// topic is by vs with (and the "from / of" calque for the agent). Materials
// (made of / from) are never used, so of and from are always wrong here.
// Choose: by / with / from / of; 12 with keys, 8 by keys.
// Build: "Write by or with": 10 with, 10 by. A line that prints with keys by, and
// the other way round, so the word never repeats the key.
// Transform: 5 active → passive with by / 5 two sentences (used a …) → with /
// 5 correct the mistake.
//
// Run: node tools/grammar-practice/authored/passive-causative.simple-passive.agent-by.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "passive-causative", branch: "simple-passive", topic: "agent-by", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const TEAM = ["Pakhtakor", "Nasaf", "Bunyodkor", "Navbahor"];
const WHY_BY = "by + the doer (who did it).";
const WHY_WITH = "with + the thing that was used (a tool or an object).";
const OPTS = ["by", "with", "from", "of"];

/* ---------------- choose: 20 mcq ---------------- */
// [key, prompt, slots]
const CHOOSE = [
  ["with", "The lock was opened ______ a {tool} by the {who}.", { tool: ["screwdriver", "knife", "key", "hairpin"], who: ["thief", "neighbour", "plumber", "caretaker"] }],
  ["with", "The cake was cut ______ a {tool}, {name}.", { tool: ["knife", "bread knife", "sharp knife", "long knife"], name: NAME }],
  ["with", "The letter was written ______ a {pen}, {name}.", { pen: ["pencil", "blue pen", "black pen", "fountain pen"], name: NAME }],
  ["with", "The walls were painted ______ a {tool} by my grandfather, {name}.", { tool: ["brush", "roller", "small brush", "big roller"], name: NAME }],
  ["with", "The window was broken ______ a {thing}, {name}.", { thing: ["stone", "ball", "brick", "stick"], name: NAME }],
  ["with", "The plov was eaten ______ our hands at the {event}, {name}.", { event: ["wedding", "party", "picnic", "festival"], name: NAME }],
  ["with", "The box was tied ______ {rope}, {name}.", { rope: ["string", "rope", "ribbon", "wire"], name: NAME }],
  ["with", "The photo was taken ______ an old {camera} by my {who}.", { camera: ["camera", "phone", "Nikon", "Kodak"], who: ["uncle", "father", "cousin", "brother"] }],
  ["with", "The tree was cut down ______ a {tool} by the {who}.", { tool: ["saw", "chainsaw", "big saw", "small saw"], who: ["farmer", "gardener", "workers", "neighbours"] }],
  ["with", "The floor was cleaned ______ a {tool}, {name}.", { tool: ["mop", "brush", "cloth", "vacuum cleaner"], name: NAME }],
  ["with", "The meat was cut ______ a {tool}, {name}.", { tool: ["knife", "cleaver", "blade", "pair of scissors"], name: NAME }],
  ["with", "The car was washed ______ a {tool} and soap, {name}.", { tool: ["sponge", "hose", "cloth", "brush"], name: NAME }],
  ["by", "The lock was forced ______ one of the thieves with a {tool}, {name}.", { tool: ["screwdriver", "knife", "hammer", "metal bar"], name: NAME }],
  ["by", "This song was written ______ a famous {who}, {name}.", { who: ["singer", "poet", "composer", "band"], name: NAME }],
  ["by", "The window was broken ______ the {who} next door, {name}.", { who: ["boy", "children", "girl", "kids"], name: NAME }],
  ["by", "The plov was cooked ______ my {who}, {name}.", { who: ["grandmother", "uncle", "father", "mother"], name: NAME }],
  ["by", "The photos were taken ______ a {who} from the newspaper, {name}.", { who: ["photographer", "journalist", "student", "reporter"], name: NAME }],
  ["by", "The new bridge was built ______ a {country} company, {name}.", { country: ["Turkish", "Korean", "Chinese", "German"], name: NAME }],
  ["by", "The thief was stopped ______ a {who}, {name}.", { who: ["shop assistant", "guard", "taxi driver", "neighbour"], name: NAME }],
  ["by", "The walls were painted ______ my {who} with a big brush, {name}.", { who: ["grandfather", "uncle", "brother", "father"], name: NAME }],
].map(([k, prompt, slots], i) => {
  const options = OPTS.map((_, j) => OPTS[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: k === "by" ? WHY_BY : WHY_WITH, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write by (who did it) or with (what they used).";
const BUILD = [
  ["with", "The door was opened ______ a {tool}, {name}.", { tool: ["key", "card", "knife", "hairpin"], name: NAME }],
  ["with", "The bread was cut ______ a {knife}, {name}.", { knife: ["knife", "bread knife", "sharp knife", "long knife"], name: NAME }],
  ["with", "The picture was drawn ______ a {pen}, {name}.", { pen: ["pencil", "black pen", "marker", "piece of chalk"], name: NAME }],
  ["with", "The fence was painted ______ a {tool}, {name}.", { tool: ["brush", "roller", "small brush", "big roller"], name: NAME }],
  ["with", "The glass was broken ______ a {thing}, {name}.", { thing: ["stone", "ball", "brick", "stick"], name: NAME }],
  ["with", "The parcel was tied ______ {rope}, {name}.", { rope: ["string", "rope", "ribbon", "wire"], name: NAME }],
  ["with", "The video was filmed ______ a {camera}, {name}.", { camera: ["phone", "drone", "camera", "GoPro"], name: NAME }],
  ["with", "The soup was stirred ______ a {spoon}, {name}.", { spoon: ["spoon", "wooden spoon", "ladle", "stick"], name: NAME }],
  ["by", "The book was written ______ a young {who} from {city}.", { who: ["writer", "student", "teacher", "doctor"], city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  ["by", "The cake was made ______ my {who}, {name}.", { who: ["grandmother", "aunt", "sister", "mother"], name: NAME }],
  ["by", "The match was won ______ {team}, {name}.", { team: TEAM, name: NAME }],
  ["by", "The phone was found ______ a {who} in the park, {name}.", { who: ["boy", "cleaner", "woman", "student"], name: NAME }],
  ["by", "These photos were taken ______ my {who}, {name}.", { who: ["uncle", "father", "cousin", "brother"], name: NAME }],
  ["by", "The house was built ______ my {who} in 1990, {name}.", { who: ["grandfather", "father", "uncle", "family"], name: NAME }],
  ["by", "The {thing} was stolen ______ two young men, {name}.", { thing: ["bike", "car", "bag", "phone"], name: NAME }],
  ["by", "The tea was served ______ the {who}, {name}.", { who: ["waiter", "host", "owner", "waitress"], name: NAME }],
  ["with", "The letter was opened ______ a {tool} by Olga, {name}.", { tool: ["knife", "pair of scissors", "pen", "finger"], name: NAME }],
  ["by", "The window was cleaned ______ the {who} with a cloth, {name}.", { who: ["cleaner", "caretaker", "boy", "girl"], name: NAME }],
  ["with", "The tree was cut down ______ a {saw}, {name}.", { saw: ["saw", "chainsaw", "big saw", "small saw"], name: NAME }],
  ["by", "The song was sung ______ the {who} at the {event}.", { who: ["children", "choir", "bride", "teacher"], event: ["wedding", "party", "concert", "festival"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: key === "by" ? WHY_BY : WHY_WITH, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TOP = "Rewrite in the passive with by. Start with the words given.";
const USED = "Rewrite as one passive sentence. Show what was used.";
const FIX = "Correct the mistake.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [TOP, "A famous {who} wrote this song, {name}.", "This song ______ a famous {who}, {name}.", "was written by", { who: ["singer", "poet", "composer", "band"], name: NAME }],
  [TOP, "My {who} cooked the plov, {name}.", "The plov ______ my {who}, {name}.", "was cooked by", { who: ["grandmother", "uncle", "father", "mother"], name: NAME }],
  [TOP, "{team} won the cup, {name}.", "The cup ______ {team}, {name}.", "was won by", { team: TEAM, name: NAME }],
  [TOP, "A {who} found my wallet in the {place}.", "My wallet ______ a {who} in the {place}.", "was found by", { who: ["boy", "cleaner", "woman", "student"], place: ["park", "bus", "café", "street"] }],
  [TOP, "Two young men stole the {thing}, {name}.", "The {thing} ______ two young men, {name}.", "was stolen by", { thing: ["bike", "car", "bag", "phone"], name: NAME }],
  [USED, "Someone broke the window. He used a {thing}, {name}.", "The window was broken ______ a {thing}, {name}.", "with", { thing: ["stone", "ball", "brick", "stick"], name: NAME }],
  [USED, "Grandma cut the bread. She used a {knife}, {name}.", "The bread was cut by Grandma ______ a {knife}, {name}.", "with", { knife: ["knife", "bread knife", "sharp knife", "long knife"], name: NAME }],
  [USED, "The thief forced the lock. He used a {tool}, {name}.", "The lock was forced by the thief ______ a {tool}, {name}.", "with", { tool: ["screwdriver", "knife", "hammer", "metal bar"], name: NAME }],
  [USED, "My dad painted the fence. He used a {tool}, {name}.", "The fence was painted by my dad ______ a {tool}, {name}.", "with", { tool: ["brush", "roller", "small brush", "big roller"], name: NAME }],
  [USED, "They tied the box. They used {rope}, {name}.", "The box was tied ______ {rope}, {name}.", "with", { rope: ["string", "rope", "ribbon", "wire"], name: NAME }],
  [FIX, "This song was written from a famous {who}, {name}.", "This song was written ______ a famous {who}, {name}.", "by", { who: ["singer", "poet", "composer", "band"], name: NAME }],
  [FIX, "The bread was cut by a {knife}, {name}.", "The bread was cut ______ a {knife}, {name}.", "with", { knife: ["knife", "bread knife", "sharp knife", "long knife"], name: NAME }],
  [FIX, "The house was built of my {who}, {name}.", "The house was built ______ my {who}, {name}.", "by", { who: ["grandfather", "father", "uncle", "family"], name: NAME }],
  [FIX, "The window was broken with a {thing} from the boy next door.", "The window was broken with a {thing} ______ the boy next door.", "by", { thing: ["stone", "ball", "brick", "stick"], x: [] }],
  [FIX, "The photo was taken from my {who} with an old camera, {name}.", "The photo was taken ______ my {who} with an old camera, {name}.", "by", { who: ["uncle", "father", "cousin", "brother"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: key === "with" ? WHY_WITH : WHY_BY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one passive sentence about a famous building and who built it.", "… was built by …", ["exactly one sentence", "passive", "by + the doer"]],
  ["Write one passive sentence about something that was cut, and what was used.", "… was cut with a …", ["exactly one sentence", "passive", "with + the tool"]],
  ["Write one passive sentence with both by and with.", "… by … with …", ["exactly one sentence", "by + the doer", "with + the tool"]],
  ["Write one passive sentence about a song or a book and who wrote it.", "… was written by …", ["exactly one sentence", "was written by", "past"]],
  ["Write one passive sentence about a meal your family made.", "… was cooked by …", ["exactly one sentence", "passive", "by"]],
  ["Write one passive sentence about a photo and what it was taken with.", "… was taken with …", ["exactly one sentence", "passive", "with"]],
  ["Write two passive sentences: one with by and one with with.", "by vs with", ["exactly two sentences", "by + person", "with + thing"]],
  ["Write one passive sentence about something that was broken.", "… was broken by / with …", ["exactly one sentence", "passive", "by or with"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe how your favourite dish is made. Write three or four passive sentences with by and with.", "passive with by / with", ["passive", "by", "with"]],
  ["Describe a famous building in your country. Write three or four sentences: who built it and what with?", "passive + by / with", ["was built by", "with", "three or four sentences"]],
  ["Tell the story of a small accident at home in three or four passive sentences.", "passive with by and with", ["was broken / was damaged", "by", "with"]],
  ["Describe a piece of art or a photo you like. Write three or four sentences with by and with.", "passive + agent + instrument", ["was painted / taken by", "with", "three or four sentences"]],
  ["Write three or four passive sentences about how a garden or field is looked after.", "passive with by / with", ["passive", "by", "with"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/passive-causative.simple-passive.agent-by.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
