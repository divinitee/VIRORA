// Hand-authored: modals / ability-permission / could-past-ability (A2).
// Path fill P38 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: could for past ability (When I was five, I ______ swim:
// can / could / must / should).
// Sibling scope: past ability only. Present can is can-ability / can-form;
// requests (Could you …?) are can-request; possibility (It could rain) is
// never used.
// Key rule (Murphy): POSITIVE could is only for a GENERAL ability over a
// past period (when I was five, as a child, at school, ten years ago). For
// one particular occasion (yesterday, last night) positive could is
// unnatural (was able to / managed to), so those sentences only ever take
// couldn't, which is fine for one occasion.
// Choose, three kinds: 10 general past ability, could vs can / must /
// should (the placement's options); 6 one occasion, couldn't vs can't /
// mustn't / shouldn't; 4 form, could / couldn't + base verb vs past / to /
// -ing. A past time marker is in every sentence and never slotted, so can /
// can't are wrong.
// Build: "Write could or couldn't." The second clause decides: "My dad
// taught me at four" → could, "so I always stayed near Mum" → couldn't. No
// source prints could / couldn't anywhere else.
// Transform: 5 present can → past could / 5 make it negative / 5 correct
// the mistake.
//
// Run: node tools/grammar-practice/authored/modals.ability-permission.could-past-ability.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "ability-permission", topic: "could-past-ability", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const SKILL = ["swim", "ride a bike", "read", "count to a hundred"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  a: "This is about ability in the past (when I was five, as a child), so use could.",
  b: "Someone was not able to do it on one day in the past, so use couldn't.",
  c: "After could and couldn't, use the base verb: could ride, not could rode or could to ride.",
  could: "The second part shows the person was able to do it in the past: could.",
  couldnt: "The second part shows the person was not able to do it in the past: couldn't.",
};
const A = ["could", "can", "must", "should"];
const B = ["couldn't", "can't", "mustn't", "shouldn't"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE_A = [
  ["When I was five, I ______ {skill}, {name}.", { skill: SKILL, name: NAME }],
  ["My {who} ______ speak {n} languages when she was young.", { who: ["grandma", "aunt", "great-grandma", "mum"], n: ["two", "three", "four", "five"] }],
  ["{name} ______ run very fast at school. He won a lot of {prize}.", { name: HE, prize: ["races", "medals", "cups", "prizes"] }],
  ["As a child, I ______ eat {n} pancakes for breakfast, {name}!", { n: ["five", "six", "eight", "ten"], name: NAME }],
  ["Ten years ago, my {who} ______ play football for hours, {name}.", { who: ["dad", "uncle", "grandpa", "brother"], name: NAME }],
  ["My {sib} ______ read when he was four, {name}.", { sib: ["brother", "cousin", "nephew", "friend"], name: NAME }],
  ["At my old school, we ______ play in the {place} after lunch, {name}.", { place: ["yard", "garden", "gym", "park"], name: NAME }],
  ["Last year I ______ only say \"hello\" in English. Now I can talk, {name}!", { name: NAME, x: ["", "", "", ""] }],
  ["When we lived in the village, we ______ see a lot of {thing} at night.", { thing: ["stars", "bright stars", "owls", "fireflies"] }],
  ["My grandpa ______ fix any {thing} when he was younger, {name}.", { thing: ["car", "bike", "radio", "TV"], name: NAME }],
];
const CHOOSE_B = [
  ["I ______ open the door yesterday. I didn't have my {thing}, {name}.", { thing: ["key", "keys", "door key", "house key"], name: NAME }],
  ["{name} ______ come to the party last {day}. She was ill.", { name: SHE, day: ["Friday", "Saturday", "Sunday", "night"] }],
  ["We ______ find a taxi after the {event} last night, so we walked home.", { event: ["concert", "match", "wedding", "film"] }],
  ["I ______ sleep last night. The {noise} was too loud, {name}.", { noise: ["music", "rain", "TV", "party next door"], name: NAME }],
  ["My {who} ______ answer the last question in yesterday's test. It was too hard.", { who: ["brother", "sister", "friend", "cousin"] }],
  ["Sorry, {name}. I ______ call you yesterday. My phone was {state}.", { name: NAME, state: ["broken", "at home", "dead", "with Dad"] }],
];
const CHOOSE_C = [
  [["ride", "rode", "to ride", "riding"], "When I was six, I could ______ a bike, {name}.", { name: NAME, x: ["", "", "", ""] }],
  [["sing", "sang", "to sing", "singing"], "My {who} could ______ beautiful songs when she was young.", { who: ["grandma", "mum", "aunt", "great-grandma"] }],
  [["find", "found", "to find", "finding"], "{name} couldn't ______ the answer in yesterday's {task}.", { name: NAME, task: ["test", "quiz", "crossword", "maths test"] }],
  [["run", "ran", "to run", "running"], "At school, my {who} could ______ very fast.", { who: ["dad", "uncle", "brother", "grandpa"] }],
];
const strip = (s) => { const o = { ...s }; delete o.x; return o; };
const CHOOSE = [
  ...CHOOSE_A.map(([p, s]) => [A, "a", p, s]),
  ...CHOOSE_B.map(([p, s]) => [B, "b", p, s]),
  ...CHOOSE_C.map(([o, p, s]) => [o, "c", p, s]),
].map(([base, w, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[w], slots: strip(slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write could or couldn't.";
const BUILD = [
  // could (10)
  ["could", "When I was five, I ______ swim. My dad taught me at four, {name}.", { name: NAME, x: ["", "", "", ""] }],
  ["could", "My {who} ______ speak {n} languages when she was young. She was a teacher.", { who: ["grandma", "aunt", "great-grandma", "mum"], n: ["two", "three", "four", "five"] }],
  ["could", "{name} ______ run very fast at school. He won a lot of {prize}.", { name: HE, prize: ["races", "medals", "cups", "prizes"] }],
  ["could", "As a child, I ______ eat {n} pancakes for breakfast. I was always hungry, {name}!", { n: ["five", "six", "eight", "ten"], name: NAME }],
  ["could", "Ten years ago, my {who} ______ play football for hours. He was very fit.", { who: ["dad", "uncle", "grandpa", "brother"] }],
  ["could", "My little {sib} ______ read at four. He loved books, {name}.", { sib: ["brother", "cousin", "nephew", "neighbour"], name: NAME }],
  ["could", "At my old school, we ______ play in the {place} after lunch. It was fun, {name}.", { place: ["yard", "garden", "gym", "park"], name: NAME }],
  ["could", "When we lived in the village, we ______ see a lot of stars at night. There were no {thing}.", { thing: ["lights", "street lights", "big buildings", "tall houses"] }],
  ["could", "My grandpa ______ fix any {thing} when he was younger. He was very good with his hands.", { thing: ["car", "bike", "radio", "TV"] }],
  ["could", "At {age}, {name} ______ already play the piano very well.", { age: ["five", "six", "seven", "eight"], name: NAME }],
  // couldn't (10)
  ["couldn't", "I ______ open the door yesterday. I didn't have my {thing}, {name}.", { thing: ["key", "keys", "door key", "house key"], name: NAME }],
  ["couldn't", "{name} ______ come to the party last {day}. She was ill.", { name: SHE, day: ["Friday", "Saturday", "Sunday", "night"] }],
  ["couldn't", "We ______ find a taxi after the {event}, so we walked home.", { event: ["concert", "match", "wedding", "film"] }],
  ["couldn't", "I ______ sleep last night. The {noise} was too loud, {name}.", { noise: ["music", "rain", "TV", "party next door"], name: NAME }],
  ["couldn't", "My {who} ______ answer the last question. It was too hard for everyone.", { who: ["brother", "sister", "friend", "cousin"] }],
  ["couldn't", "Sorry, {name}. I ______ call you yesterday. My phone was {state}.", { name: NAME, state: ["broken", "at home", "dead", "with Dad"] }],
  ["couldn't", "When I was small, I ______ swim, so I always stayed near {who}.", { who: ["Mum", "Dad", "Grandma", "my brother"] }],
  ["couldn't", "The {kids} ______ play outside yesterday. It was raining all day, {name}.", { kids: ["children", "boys", "girls", "twins"], name: NAME }],
  ["couldn't", "{name} ______ eat anything at the party. He had a {ill}.", { name: HE, ill: ["toothache", "stomach ache", "sore throat", "bad tooth"] }],
  ["couldn't", "We ______ see the {thing} last night because of the clouds, {name}.", { thing: ["moon", "stars", "mountains", "fireworks"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "could" ? W.could : W.couldnt, slots: strip(slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PAST = "Rewrite the sentence about the past.";
const NEG = "Make the sentence negative.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // can -> could (5)
  [PAST, "I can {skill}, {name}.", "When I was six, I ______ {skill}, {name}.", "could", "Ability in the past: can → could.", { skill: SKILL, name: NAME }],
  [PAST, "My {who} can speak {lang} very well.", "Ten years ago, my {who} ______ speak {lang} very well.", "could", "Ability in the past: can → could.", { who: ["aunt", "uncle", "teacher", "neighbour"], lang: ["English", "Russian", "German", "Korean"] }],
  [PAST, "{name} can draw beautiful {thing}.", "As a child, {name} ______ draw beautiful {thing}.", "could", "Ability in the past: can → could.", { name: NAME, thing: ["horses", "flowers", "birds", "houses"] }],
  [PAST, "We can play {game} in the yard every evening, {name}.", "When we were small, we ______ play {game} in the yard every evening, {name}.", "could", "Ability in the past: can → could.", { game: ["football", "tag", "hide and seek", "basketball"], name: NAME }],
  [PAST, "My {who} can lift very heavy {thing}.", "At thirty, my {who} ______ lift very heavy {thing}.", "could", "Ability in the past: can → could.", { who: ["dad", "grandpa", "uncle", "brother"], thing: ["bags", "boxes", "stones", "sacks of rice"] }],
  // negative (5)
  [NEG, "I could {skill} when I was four, {name}.", "I ______ {skill} when I was four, {name}.", "couldn't", "Negative of could → couldn't + base verb.", { skill: SKILL, name: NAME }],
  [NEG, "My {who} could cook {food} when he was young.", "My {who} ______ cook {food} when he was young.", "couldn't", "Negative of could → couldn't.", { who: ["dad", "grandpa", "uncle", "brother"], food: ["plov", "soup", "pasta", "rice"] }],
  [NEG, "{name} could speak {lang} at school.", "{name} ______ speak {lang} at school.", "couldn't", "Negative of could → couldn't.", { name: NAME, lang: ["English", "Russian", "German", "French"] }],
  [NEG, "We could see the sea from our old {home}, {name}.", "We ______ see the sea from our old {home}, {name}.", "couldn't", "Negative of could → couldn't.", { home: ["flat", "house", "hotel", "room"], name: NAME }],
  [NEG, "As a child, my {sib} could sleep with the light off, {name}.", "As a child, my {sib} ______ sleep with the light off, {name}.", "couldn't", "Negative of could → couldn't.", { sib: ["sister", "brother", "cousin", "friend"], name: NAME }],
  // correct the mistake (5)
  [COR, "When I was six, I can {skill}, {name}.", "When I was six, I ______ {skill}, {name}.", "could", "When I was six is the past: could, not can.", { skill: SKILL, name: NAME }],
  [COR, "My {who} could sang very well when she was young, {name}.", "My {who} ______ very well when she was young, {name}.", "could sing", "could + base verb: could sing, not could sang.", { who: ["grandma", "mum", "aunt", "great-grandma"], name: NAME }],
  [COR, "{name} could to play {game} at {age}.", "{name} ______ {game} at {age}.", "could play", "No to after could: could play.", { name: NAME, game: ["chess", "the piano", "the guitar", "tennis"], age: ["five", "six", "seven", "eight"] }],
  [COR, "I can't find my {thing} yesterday, {name}.", "I ______ find my {thing} yesterday, {name}.", "couldn't", "Yesterday is the past: couldn't, not can't.", { thing: ["key", "phone", "bag", "ticket"], name: NAME }],
  [COR, "We didn't could go out last {day}. It was too cold, {name}.", "We ______ go out last {day}. It was too cold, {name}.", "couldn't", "The past negative of can is couldn't, not didn't could.", { day: ["night", "Sunday", "Saturday", "weekend"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: strip(slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one thing you could do when you were five.", "I could + base verb", ["exactly one sentence", "could", "when I was …"]],
  ["Write one thing you couldn't do when you were small.", "I couldn't + base verb", ["exactly one sentence", "couldn't", "a past time"]],
  ["Write one thing your grandparent could do when he or she was young.", "he / she could + base verb", ["exactly one sentence", "could", "a family word"]],
  ["Write about one thing you couldn't do yesterday, and why.", "I couldn't … because …", ["exactly one sentence", "couldn't", "yesterday"]],
  ["Write one thing you can do now but couldn't do five years ago.", "I can … now, but I couldn't …", ["exactly one sentence", "can and couldn't", "a time word"]],
  ["Write one sentence about your first English lessons. What could you say?", "I could only say …", ["exactly one sentence", "could", "an English word"]],
  ["Write one thing a friend could do very well at school.", "he / she could + base verb", ["exactly one sentence", "could", "a school word"]],
  ["Write two sentences about when you were six: one thing you could do and one thing you couldn't do.", "could / couldn't", ["exactly two sentences", "could once", "couldn't once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe yourself at six years old. What could you do, and what couldn't you do?", "could / couldn't", ["could", "couldn't", "three or four sentences"]],
  ["Ask a grandparent or an older relative about their childhood. What could they do?", "he / she could …", ["could twice", "a family word", "three or four sentences"]],
  ["Write about a bad day. What couldn't you do, and why?", "I couldn't … because …", ["couldn't", "because", "three or four sentences"]],
  ["Compare your English now and one year ago.", "I couldn't … Now I can …", ["could or couldn't", "can", "three or four sentences"]],
  ["Describe a friend from your first school. What could he or she do well?", "he / she could …", ["could", "a school word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.ability-permission.could-past-ability.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);