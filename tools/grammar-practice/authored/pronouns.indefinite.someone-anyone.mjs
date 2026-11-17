// Hand-authored: pronouns / indefinite / someone-anyone (A2).
// Path fill P45 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement foci: someone in a positive statement (There is ______ at the
// door) and anyone in a negative one (I didn't see ______ in the room).
// Sibling scope: keys are ONLY someone and anyone, about half each. No
// questions ("Is someone / anyone there?" are both right), no offers
// (something-offer, P46), no nothing / anything (P47), no verb agreement
// (P48), no "Anyone can …" (any = whoever) and no "if anyone …".
// One right answer: every gap is a PERSON (someone called, I don't know
// anyone here), so the thing words are clearly wrong. Options:
// someone key → someone / anyone / anything / anywhere;
// anyone key → anyone / someone / no one / somewhere ("didn't see no one" is
// the Russian "никого не видел" double negative). Never offered: everyone
// ("I didn't see everyone" is English) and no one after a positive verb
// ("There's no one at the door" is English).
// Build: "Write someone or anyone."; no source prints either word elsewhere.
// Transform: 5 positive → negative / 5 correct the mistake / 5 negative →
// positive (keys fixed: "didn't see anyone", "someone" …).
//
// Run: node tools/grammar-practice/authored/pronouns.indefinite.someone-anyone.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "indefinite", topic: "someone-anyone", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const PLACE = ["classroom", "kitchen", "garden", "office"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const OPT = { someone: ["someone", "anyone", "anything", "anywhere"], anyone: ["anyone", "someone", "no one", "somewhere"] };
const WHY = {
  someone: "A positive sentence about a person → someone.",
  anyone: "A negative sentence (not, n't, never) about a person → anyone. Don't use no one after not.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["someone", "There is ______ at the door, {name}. Can you open it?", { name: NAME, x: [] }],
  ["anyone", "I didn't see ______ in the {place}. It was empty, {name}.", { place: PLACE, name: NAME }],
  ["someone", "______ called you {when}, {name}. It was a man's voice.", { when: ["this morning", "an hour ago", "at lunch", "last night"], name: NAME }],
  ["anyone", "{name} is new here. She doesn't know ______ in {city}.", { name: ["Lola", "Olga", "Madina", "Kamila"], city: ["Tashkent", "Samarkand", "Bukhara", "this city"] }],
  ["someone", "I met ______ from {city} at the {event}.", { city: ["Khiva", "Fergana", "Moscow", "Istanbul"], event: ["party", "wedding", "concert", "match"] }],
  ["anyone", "Don't tell ______ about the {thing}, {name}. It's a secret.", { thing: ["present", "party", "cake", "trip"], name: NAME }],
  ["someone", "______ is sitting in my seat, {name}. What can I do?", { name: NAME, x: [] }],
  ["anyone", "There isn't ______ in the {place} now. Everyone went home.", { place: PLACE, x: [] }],
  ["someone", "I can hear ______ in the {place}. Is it Mum, {name}?", { place: ["kitchen", "garden", "hall", "next room"], name: NAME }],
  ["anyone", "We waited for an hour, but we didn't see ______ on the {road}.", { road: ["road", "street", "bridge", "path"], x: [] }],
  ["someone", "{name} wants to talk to ______ from the {office}.", { name: NAME, office: ["school office", "bank", "shop", "hotel"] }],
  ["anyone", "My grandpa never asks ______ for help, {name}.", { name: NAME, x: [] }],
  ["someone", "______ left a {thing} on the table, {name}.", { thing: ["bag", "phone", "jacket", "book"], name: NAME }],
  ["anyone", "I can't find ______ to help me with the {task}.", { task: ["homework", "boxes", "project", "car"], x: [] }],
  ["someone", "Look! There's ______ in the {place}, {name}.", { place: ["garden", "yard", "car", "water"], name: NAME }],
  ["anyone", "The shop was closed. We didn't meet ______ there, {name}.", { name: NAME, x: [] }],
  ["someone", "We need ______ to carry the {thing}, {name}.", { thing: ["sofa", "boxes", "table", "fridge"], name: NAME }],
  ["anyone", "{name} didn't invite ______ to his {event}.", { name: ["Aziz", "Timur", "Bobur", "Rustam"], event: ["party", "birthday", "house", "concert"] }],
  ["someone", "I think ______ took my {thing}, {name}.", { thing: ["pen", "umbrella", "chair", "book"], name: NAME }],
  ["anyone", "Don't open the door to ______ when we're out, {name}.", { name: NAME, x: [] }],
].map(([k, prompt, slots], i) => {
  const base = OPT[k];
  const capd = prompt.startsWith("______") ? base.map((o) => o[0].toUpperCase() + o.slice(1)) : base;
  const options = rot(capd, i);
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(capd[0]), why: WHY[k], slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write someone or anyone.";
const BUILD = [
  ["someone", "There's ______ in the {place}, {name}.", { place: ["hall", "garden", "yard", "kitchen"], name: NAME }],
  ["anyone", "I don't know ______ at this {place}, {name}.", { place: ["school", "party", "club", "office"], name: NAME }],
  ["someone", "I gave my old {thing} to ______ from our street, {name}.", { thing: ["bike", "books", "toys", "coat"], name: NAME }],
  ["anyone", "We didn't see ______ at the {place} {when}.", { place: ["park", "bus stop", "station", "beach"], when: ["this morning", "last night", "on Sunday", "at six"] }],
  ["someone", "Please ask ______ for directions to the {place}, {name}.", { place: ["station", "museum", "hotel", "bazaar"], name: NAME }],
  ["anyone", "{name} never talks to ______ on the bus.", { name: NAME, x: [] }],
  ["someone", "I think ______ is knocking, {name}.", { name: NAME, x: [] }],
  ["anyone", "There wasn't ______ in the {place} when we arrived, {name}.", { place: PLACE, name: NAME }],
  ["someone", "{name} is waiting for ______ at the {place}.", { name: NAME, place: ["station", "café", "gate", "bus stop"] }],
  ["anyone", "Don't show this {thing} to ______, {name}.", { thing: ["photo", "letter", "message", "list"], name: NAME }],
  ["someone", "We heard ______ in the {place} last night.", { place: ["yard", "garden", "street", "hall"], x: [] }],
  ["anyone", "I can't see ______ in the {place}, {name}.", { place: ["water", "garden", "car", "window"], name: NAME }],
  ["someone", "My {who} met ______ famous at the airport, {name}!", { who: ["uncle", "aunt", "sister", "brother"], name: NAME }],
  ["anyone", "They didn't tell ______ about the {thing}, {name}.", { thing: ["trip", "wedding", "news", "plan"], name: NAME }],
  ["someone", "{name} needs ______ to look after the {pet}.", { name: NAME, pet: ["dog", "cat", "parrot", "fish"] }],
  ["anyone", "My little brother doesn't like ______ in his room, {name}.", { name: NAME, x: [] }],
  ["someone", "There's ______ on the phone for you, {name}.", { name: NAME, x: [] }],
  ["anyone", "We didn't ask ______ for money, {name}.", { name: NAME, x: [] }],
  ["someone", "I saw ______ in your {thing}, {name}. Who was it?", { thing: ["car", "garden", "yard", "flat"], name: NAME }],
  ["anyone", "The teacher didn't see ______ with a phone in the {event}.", { event: ["test", "exam", "lesson", "dictation"], x: [] }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[key], slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NEG = "Make the sentence negative.";
const COR = "Correct the mistake.";
const POS = "Make the sentence positive.";
const TRANSFORM = [
  // positive -> negative (5)
  [NEG, "I saw someone in the {place}, {name}.", "I ______ in the {place}, {name}.", "didn't see anyone", "didn't + see, and someone → anyone.", { place: PLACE, name: NAME }],
  [NEG, "We met someone at the {place} {when}.", "We ______ at the {place} {when}.", "didn't meet anyone", "didn't + meet, and someone → anyone.", { place: ["park", "bazaar", "station", "café"], when: ["yesterday", "on Sunday", "this morning", "last night"] }],
  [NEG, "{name} knows someone in {city}.", "{name} ______ in {city}.", "doesn't know anyone", "doesn't + know, and someone → anyone.", { name: NAME, city: ["Tashkent", "Bukhara", "Moscow", "London"] }],
  [NEG, "There's someone in the {place}, {name}.", "There ______ in the {place}, {name}.", "isn't anyone", "isn't, and someone → anyone.", { place: PLACE, name: NAME }],
  [NEG, "I can hear someone in the {place}, {name}.", "I ______ in the {place}, {name}.", "can't hear anyone", "can't + hear, and someone → anyone.", { place: ["hall", "garden", "kitchen", "yard"], name: NAME }],
  // correct (5)
  [COR, "I didn't see someone at the {place}, {name}.", "I didn't see ______ at the {place}, {name}.", "anyone", WHY.anyone, { place: ["bus stop", "gate", "station", "park"], name: NAME }],
  [COR, "We don't know no one in this {place}, {name}.", "We don't know ______ in this {place}, {name}.", "anyone", WHY.anyone, { place: ["city", "street", "village", "building"], name: NAME }],
  [COR, "There's anyone at the door, {name}. Can you open it?", "There's ______ at the door, {name}. Can you open it?", "someone", WHY.someone, { name: NAME, x: [] }],
  [COR, "{name} didn't call no one {when}.", "{name} didn't call ______ {when}.", "anyone", WHY.anyone, { name: NAME, when: ["yesterday", "last night", "today", "on Friday"] }],
  [COR, "I met anyone nice at the {event}, {name}.", "I met ______ nice at the {event}, {name}.", "someone", WHY.someone, { event: ["party", "wedding", "concert", "match"], name: NAME }],
  // negative -> positive (5)
  [POS, "There isn't anyone in the {place}, {name}.", "There's ______ in the {place}, {name}.", "someone", WHY.someone, { place: PLACE, name: NAME }],
  [POS, "I didn't see anyone at the {place} {when}.", "I saw ______ at the {place} {when}.", "someone", WHY.someone, { place: ["gate", "bus stop", "window", "door"], when: ["this morning", "last night", "an hour ago", "at six"] }],
  [POS, "{name} doesn't know anyone at the {place}.", "{name} knows ______ at the {place}.", "someone", WHY.someone, { name: NAME, place: ["bank", "school", "hospital", "hotel"] }],
  [POS, "We didn't hear anyone in the {place}, {name}.", "We heard ______ in the {place}, {name}.", "someone", WHY.someone, { place: ["yard", "garden", "hall", "street"], name: NAME }],
  [POS, "Nobody called you {when}, {name}.", "______ called you {when}, {name}.", "Someone", WHY.someone, { when: ["this morning", "an hour ago", "at lunch", "today"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about someone you met last week.", "I met someone …", ["exactly one sentence", "someone", "a place word"]],
  ["Write one sentence about a place where you don't know anyone.", "I don't know anyone in / at …", ["exactly one sentence", "don't know anyone", "a place word"]],
  ["You hear a noise at home. Write one sentence about it with someone.", "There's someone in the …", ["exactly one sentence", "someone", "a room word"]],
  ["Write one sentence about a secret. Tell a friend not to tell anyone.", "Don't tell anyone …", ["exactly one sentence", "anyone", "don't"]],
  ["Write one sentence about a time you needed someone to help you.", "I needed someone to …", ["exactly one sentence", "someone", "a verb"]],
  ["Write one sentence about an empty place you saw.", "There wasn't anyone in / at …", ["exactly one sentence", "wasn't anyone or didn't see anyone", "a place word"]],
  ["Write one sentence about a phone call or a message from someone.", "Someone called / sent …", ["exactly one sentence", "someone", "call or message"]],
  ["Write two sentences: one with someone and one with anyone.", "… someone … / … not … anyone …", ["exactly two sentences", "someone once", "anyone once with a negative"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your first day at a new school or job. Did you know anyone? Did someone help you?", "someone / anyone", ["someone", "anyone with a negative", "three or four sentences"]],
  ["Describe a strange night: you heard someone, but you didn't see anyone.", "heard someone / didn't see anyone", ["someone", "anyone", "three or four sentences"]],
  ["Write a note for your little brother: you are going out. Tell him the rules.", "Don't open the door to anyone …", ["anyone", "don't", "three or four sentences"]],
  ["Describe a trip to a city where you didn't know anyone.", "I didn't know anyone … / Someone showed me …", ["anyone", "someone", "three or four sentences"]],
  ["Describe a busy day at your home: who came, and who called?", "Someone came … / Someone called …", ["someone twice", "a family word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.indefinite.someone-anyone.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);