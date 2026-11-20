// Hand-authored: nouns-articles / plurals-agreement / there-agreement (B1).
// Wave C, C4 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: after "there", be agrees with the FIRST noun of a list:
// "There is a table and four chairs", "There are four chairs and a table".
// Sibling scope: existential.there-is-are / there-was-were (A1) teach is vs
// are with ONE noun. This topic only uses lists of two, and the key always
// follows the first item: about half the first items are singular or
// uncountable (is / was), half plural (are / were). The second item is often
// the "pull" the learner wrongly agrees with.
// Choose options: is / are / has / have ("There has", "There have" is the
// Uzbek "bor" / Russian "есть" → have transfer). All choose items present.
// Build: present items say "Write is or are", past items (with a past time
// word) say "Write was or were", so the tense is never open.
// Transform: 5 swap the list order (verb changes) / 5 correct the mistake /
// 5 make it past.
//
// Run: node tools/grammar-practice/authored/nouns-articles.plurals-agreement.there-agreement.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "plurals-agreement", topic: "there-agreement", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const first = (t) => (t.match(/______ (?:\(be\) )?(.+?) and /) || [])[1];
const WHY = (t, k) => {
  const n = first(t).replace(/\{[a-z]+\}/, "things");
  return ["is", "was"].includes(k)
    ? `After there, the verb agrees with the first thing in the list: ${n}. That is one thing (or uncountable), so use ${k}.`
    : `After there, the verb agrees with the first thing in the list: ${n}. That is plural, so use ${k}.`;
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["is", "There ______ a table and four chairs in the {room}, {name}.", { room: ["kitchen", "dining room", "classroom", "garden"], name: NAME }],
  ["are", "There ______ two beds and a {thing} in my room, {name}.", { thing: ["desk", "wardrobe", "lamp", "mirror"], name: NAME }],
  ["is", "There ______ a bank and two {shops} near our {home}.", { shops: ["cafés", "pharmacies", "bakeries", "shops"], home: ["house", "flat", "school", "college"] }],
  ["are", "There ______ three cafés and a {place} on this street, {name}.", { place: ["bank", "bakery", "school", "pharmacy"], name: NAME }],
  ["is", "There ______ some bread and two eggs in the {place}, {name}.", { place: ["fridge", "kitchen", "bag", "basket"], name: NAME }],
  ["are", "There ______ some eggs and a little {food} in the fridge, {name}.", { food: ["milk", "butter", "cheese", "juice"], name: NAME }],
  ["is", "There ______ a boy and two girls in the {place}. They are playing {game}.", { place: ["yard", "garden", "park", "street"], game: ["football", "tag", "with a ball", "hide-and-seek"] }],
  ["are", "There ______ many people and a {animal} at the bus stop, {name}.", { animal: ["dog", "cat", "goat", "big dog"], name: NAME }],
  ["is", "There ______ a lot of homework and two {subject} tests this week.", { subject: ["maths", "history", "English", "biology"], x: [] }],
  ["are", "There ______ lots of tourists and a big tour bus in the {place}, {name}.", { place: ["square", "old town", "street", "car park"], name: NAME }],
  ["is", "There ______ a TV and two sofas in our {room}, {name}.", { room: ["living room", "hall", "flat", "house"], name: NAME }],
  ["are", "There ______ five students and a teacher in the {place} now, {name}.", { place: ["library", "classroom", "lab", "hall"], name: NAME }],
  ["is", "There ______ an apple and three bananas in my {bag}, {name}.", { bag: ["bag", "lunch box", "backpack", "basket"], name: NAME }],
  ["are", "There ______ ten {things} and a pen on the {place}.", { things: ["books", "notebooks", "pencils", "cups"], place: ["desk", "table", "shelf", "floor"] }],
  ["is", "There ______ a doctor and two nurses in the {place}, {name}.", { place: ["room", "clinic", "office", "hall"], name: NAME }],
  ["are", "There ______ two doors and a window in our {room}, {name}.", { room: ["classroom", "kitchen", "bedroom", "hall"], name: NAME }],
  ["is", "There ______ a park and some cafés near the {place}, {name}.", { place: ["river", "station", "hotel", "museum"], name: NAME }],
  ["are", "There ______ some apples and a melon on the {place}, {name}.", { place: ["table", "plate", "shelf", "tray"], name: NAME }],
  ["is", "There ______ a man and two children at the {place}, {name}.", { place: ["door", "gate", "window", "bus stop"], name: NAME }],
  ["are", "There ______ six players and a coach in our {sport} club.", { sport: ["chess", "tennis", "swimming", "dance"], x: [] }],
].map(([k, prompt, slots], i) => {
  const options = rot(["is", "are", "has", "have"], i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: WHY(prompt, k), slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const P = "Write is or are.";
const PA = "Write was or were.";
const BUILD = [
  ["is", P, "In the {room} there ______ (be) a sofa and two armchairs, {name}.", { room: ["living room", "hall", "flat", "office"], name: NAME }],
  ["are", P, "There ______ (be) three bedrooms and a kitchen in our new {home}, {name}.", { home: ["flat", "house", "dacha", "place"], name: NAME }],
  ["is", P, "There ______ (be) a lot of snow and some ice on the {place} today, {name}.", { place: ["road", "street", "roof", "bridge"], name: NAME }],
  ["are", P, "There ______ (be) many cars and a bus on the {road} now, {name}.", { road: ["road", "street", "bridge", "square"], name: NAME }],
  ["is", P, "Look, {name}! There ______ (be) a cat and three kittens under the {place}.", { place: ["table", "car", "bed", "stairs"], name: NAME }],
  ["are", P, "There ______ (be) two dogs and a horse on my uncle's {place}, {name}.", { place: ["farm", "land", "field", "plot"], name: NAME }],
  ["was", PA, "There ______ (be) a cake and some sweets on the table {when}, {name}.", { when: ["last night", "yesterday", "at the party", "this morning"], name: NAME }],
  ["were", PA, "There ______ (be) twenty guests and a singer at the {event} last week, {name}.", { event: ["wedding", "party", "dinner", "concert"], name: NAME }],
  ["is", P, "There ______ (be) some juice and two sandwiches in your {bag}, {name}.", { bag: ["bag", "backpack", "lunch box", "basket"], name: NAME }],
  ["are", P, "There ______ (be) thirty students and one teacher in our {group}, {name}.", { group: ["class", "group", "course", "club"], name: NAME }],
  ["was", PA, "There ______ (be) a lot of noise and two loud cars outside {when}, {name}.", { when: ["last night", "at six", "this morning", "after dinner"], name: NAME }],
  ["were", PA, "There ______ (be) three {things} and a map on the wall of my old room, {name}.", { things: ["photos", "pictures", "posters", "clocks"], name: NAME }],
  ["is", P, "Near my {place} there ______ (be) a bus stop and two shops, {name}.", { place: ["house", "school", "flat", "college"], name: NAME }],
  ["are", P, "There ______ (be) many trees and a small lake in the {place}, {name}.", { place: ["park", "garden", "village", "yard"], name: NAME }],
  ["is", P, "Right now there ______ (be) a teacher and five students in the {room}, {name}.", { room: ["lab", "library", "hall", "classroom"], name: NAME }],
  ["are", P, "There ______ (be) some cups and a teapot on the {place}, {name}.", { place: ["table", "tray", "shelf", "desk"], name: NAME }],
  ["was", PA, "{when}, there ______ (be) a girl and two boys at the door, {name}.", { when: ["An hour ago", "This morning", "At five", "Yesterday"], name: NAME }],
  ["were", PA, "There ______ (be) lots of people and a band in the {place} {when}.", { place: ["square", "park", "street", "hall"], when: ["last night", "on Sunday", "yesterday", "at Navruz"] }],
  ["is", P, "There ______ (be) an orange and two apples for you, {name}. Take them to {place}.", { name: NAME, place: ["school", "work", "college", "the park"] }],
  ["are", P, "There ______ (be) two messages and a missed call from {who} on your phone, {name}.", { who: ["Mum", "Dad", "your teacher", "your boss"], name: NAME }],
].map(([key, instr, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr, source, key, why: WHY(source, key), slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SWAP = "Change the order of the list. Change the verb if you need to.";
const COR = "Correct the mistake.";
const PAST = "Make it past.";
const TRANSFORM = [
  // swap the list (5)
  [SWAP, "There is a bed and two chairs in my {room}, {name}.", "There ______ two chairs and a bed in my {room}, {name}.", "are", { room: ["bedroom", "room", "flat", "office"], name: NAME }],
  [SWAP, "There are three apples and a pear in the {place}, {name}.", "There ______ a pear and three apples in the {place}, {name}.", "is", { place: ["bag", "basket", "bowl", "fridge"], name: NAME }],
  [SWAP, "There is a lot of rice and two onions in the {place}, {name}.", "There ______ two onions and a lot of rice in the {place}, {name}.", "are", { place: ["kitchen", "bag", "cupboard", "pot"], name: NAME }],
  [SWAP, "There are two shops and a café near the {place}, {name}.", "There ______ a café and two shops near the {place}, {name}.", "is", { place: ["station", "school", "park", "hotel"], name: NAME }],
  [SWAP, "There is a sofa and three chairs in the {room}, {name}.", "There ______ three chairs and a sofa in the {room}, {name}.", "are", { room: ["hall", "living room", "office", "waiting room"], name: NAME }],
  // correct the mistake (5)
  [COR, "There are a desk and two chairs in the {room}, {name}.", "There ______ a desk and two chairs in the {room}, {name}.", "is", { room: ["classroom", "office", "library", "bedroom"], name: NAME }],
  [COR, "There is two dogs and a cat in our {place}, {name}.", "There ______ two dogs and a cat in our {place}, {name}.", "are", { place: ["yard", "garden", "house", "street"], name: NAME }],
  [COR, "There is many people and a car outside the {place}, {name}.", "There ______ many people and a car outside the {place}, {name}.", "are", { place: ["school", "bank", "shop", "station"], name: NAME }],
  [COR, "There are some milk and two eggs in the {place}, {name}.", "There ______ some milk and two eggs in the {place}, {name}.", "is", { place: ["fridge", "bag", "kitchen", "basket"], name: NAME }],
  [COR, "There is three boys and a girl in the {place}, {name}.", "There ______ three boys and a girl in the {place}, {name}.", "are", { place: ["pool", "yard", "park", "garden"], name: NAME }],
  // make it past (5)
  [PAST, "There is a cake and two pies on the table {now}, {name}.", "There ______ a cake and two pies on the table last night, {name}.", "was", { now: ["now", "today", "this evening", "right now"], name: NAME }],
  [PAST, "There are many cars and a bus on the road {now}, {name}.", "There ______ many cars and a bus on the road yesterday, {name}.", "were", { now: ["now", "today", "this morning", "right now"], name: NAME }],
  [PAST, "There is some soup and two salads for lunch {now}, {name}.", "There ______ some soup and two salads for lunch yesterday, {name}.", "was", { now: ["today", "this week", "at school today", "on Mondays"], name: NAME }],
  [PAST, "There are two cats and a dog in the yard {now}, {name}.", "There ______ two cats and a dog in the yard this morning, {name}.", "were", { now: ["now", "today", "right now", "at the moment"], name: NAME }],
  [PAST, "There is a lot of rain and a strong wind {now}, {name}.", "There ______ a lot of rain and a strong wind last night, {name}.", "was", { now: ["now", "today", "this evening", "right now"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY(hint, key), slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the things on your desk. Start with a singular thing.", "There is a … and two …", ["exactly one sentence", "There is + singular first", "a list of two"]],
  ["Write one sentence about your room. Start with a plural thing.", "There are two … and a …", ["exactly one sentence", "There are + plural first", "a list of two"]],
  ["Write one sentence about the food in your fridge.", "There is some … and …", ["exactly one sentence", "there + is or are", "the verb agrees with the first thing"]],
  ["Write one sentence about the people in your class or office now.", "There are … students and a …", ["exactly one sentence", "there + is or are", "a list of two"]],
  ["Write one sentence about the shops near your home.", "There is a … and some …", ["exactly one sentence", "there + is or are", "a list of two"]],
  ["Write one sentence about a party you went to.", "There was / were … and …", ["exactly one sentence", "there + was or were", "a list of two"]],
  ["Write one sentence about the animals in a yard or farm you know.", "There are … and a …", ["exactly one sentence", "there + is or are", "a list of two"]],
  ["Write two sentences: one that starts with There is … and one with There are … .", "There is a … and … / There are … and a …", ["exactly two sentences", "is with a singular first thing", "are with a plural first thing"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your kitchen or living room.", "There is a … and … / There are … and a …", ["lists after there", "the verb agrees with the first thing", "three or four sentences"]],
  ["Describe your street: what is there near your home?", "There is a … and two … / There are …", ["lists after there", "is and are", "three or four sentences"]],
  ["Describe your school bag or work bag.", "There is a … and some …", ["lists after there", "is or are", "three or four sentences"]],
  ["Describe a wedding or party you remember.", "There were … and a … / There was …", ["was and were", "lists after there", "three or four sentences"]],
  ["Describe your classroom or office.", "There are … and a … / There is …", ["lists after there", "is and are", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/nouns-articles.plurals-agreement.there-agreement.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);