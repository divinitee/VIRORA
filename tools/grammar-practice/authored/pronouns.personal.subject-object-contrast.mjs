// Hand-authored: pronouns / personal / subject-object-contrast (A2).
// Path fill P44 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: an object pronoun after a preposition in a coordinated
// phrase ("This present is for my sister and I" → me). The topic is the
// pronoun inside "X and ___": subject form when the pair is the subject
// (My sister and I went …), object form when the pair comes after a verb or
// a preposition (… for my sister and me). P1 (subject pronouns) and P13
// (object pronouns) never used a pair; this stop only uses pairs.
// One right answer: the other person always comes first and is printed,
// so "me and my sister" (informal but common as an object) is never an
// option and never a key. Never offered: myself / himself / herself (natives
// do say "for my sister and myself"). Options are one person's forms:
// I / me / my / mine, he / him / his / he's, she / her / hers / she's,
// we / us / our / ours. A he / she key always has its person named first
// (Where's Aziz? …), so the gender is fixed.
// Choose: I 5 / me 5 / he 2 / him 2 / she 2 / her 2 / we 1 / us 1.
// Build: instr names the two forms (Write I or me.); no source prints its
// key elsewhere.
// Transform: 5 correct "… and I" after a verb or preposition → me / 5
// correct "… and me / him / her" as a subject → I / he / she / 5 join two
// sentences into one pair (key = the whole pair).
//
// Run: node tools/grammar-practice/authored/pronouns.personal.subject-object-contrast.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "personal", topic: "subject-object-contrast", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const SIB = ["sister", "brother", "cousin", "friend"];
const PLACE = ["cinema", "park", "bazaar", "museum"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const F = {
  I: ["I", "me", "my", "mine"],
  me: ["me", "I", "my", "mine"],
  he: ["he", "him", "his", "he's"],
  him: ["him", "he", "his", "he's"],
  she: ["she", "her", "hers", "she's"],
  her: ["her", "she", "hers", "she's"],
  we: ["we", "us", "our", "ours"],
  us: ["us", "we", "our", "ours"],
};
const SUBJ = "The two people are the subject (they do the action), so use the subject form: I, he, she, we.";
const OBJ = "The two people come after a verb or a preposition (for, with, to), so use the object form: me, him, her, us.";
const WHY = { I: SUBJ, he: SUBJ, she: SUBJ, we: SUBJ, me: OBJ, him: OBJ, her: OBJ, us: OBJ };

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["me", "This present is for my {sib} and ______, {name}.", { sib: SIB, name: NAME }],
  ["I", "My {sib} and ______ went to the {place} yesterday.", { sib: SIB, place: PLACE }],
  ["me", "Grandma made a cake for my {sib} and ______.", { sib: SIB, x: [] }],
  ["I", "{name} and ______ are in the same {group}.", { name: NAME, group: ["class", "team", "group", "club"] }],
  ["him", "Where's {name}? The teacher wants to see Lola and ______.", { name: HE, x: [] }],
  ["me", "Can you come to the {place} with Mum and ______, {name}?", { place: PLACE, name: NAME }],
  ["she", "Do you know {name}? My {sib} and ______ play tennis every {day}.", { name: SHE, sib: SIB, day: ["Sunday", "Saturday", "Friday", "evening"] }],
  ["I", "Last {day}, Dad and ______ cooked plov for the whole family.", { day: ["Sunday", "Saturday", "Friday", "night"], x: [] }],
  ["her", "{name} is new here. Please sit between Aziz and ______.", { name: SHE, x: [] }],
  ["me", "Our teacher gave Timur and ______ a good mark, {name}.", { name: ["Aziz", "Olga", "Lola", "Madina"], x: [] }],
  ["he", "That's {name}. Aziz and ______ live in the same {home}.", { name: ["Timur", "Bobur", "Rustam", "Sardor"], home: ["building", "street", "village", "area"] }],
  ["us", "Grandpa told the twins and ______ a long story, {name}.", { name: NAME, x: [] }],
  ["I", "My {who} and ______ often walk to school together.", { who: ["neighbour", "cousin", "best friend", "brother"], x: [] }],
  ["him", "I saw {name} at the {place}. I took a photo of Olga and ______.", { name: HE, place: PLACE }],
  ["me", "The teacher was angry with {name} and ______.", { name: NAME, x: [] }],
  ["we", "My parents and ______ are going to {city} next week.", { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], x: [] }],
  ["she", "Is {name} here? Mum says Lola and ______ can watch the film.", { name: ["Olga", "Madina", "Kamila", "Dilnoza"], x: [] }],
  ["I", "{name} and ______ want to play football after school.", { name: NAME, x: [] }],
  ["her", "Where's {name}? I have a message for Olga and ______.", { name: ["Lola", "Madina", "Kamila", "Dilnoza"], x: [] }],
  ["me", "Please send the photos to my {sib} and ______, {name}.", { sib: SIB, name: NAME }],
].map(([k, prompt, slots], i) => {
  const options = rot(F[k], i);
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: WHY[k], slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INS = { I: "Write I or me.", me: "Write I or me.", he: "Write he or him.", him: "Write he or him.", she: "Write she or her.", her: "Write she or her.", we: "Write we or us.", us: "Write we or us." };
const BUILD = [
  ["me", "The {who} gave my {sib} and ______ some {food}.", { who: ["neighbour", "teacher", "shop owner", "guest"], sib: SIB, food: ["apples", "sweets", "bread", "cherries"] }],
  ["I", "My {sib} and ______ watched a film {when}.", { sib: SIB, when: ["yesterday", "last night", "on Friday", "after dinner"] }],
  ["me", "{name} is going to the {place} with Dad and ______.", { name: NAME, place: PLACE }],
  ["I", "Aziz and ______ are good friends, {name}.", { name: ["Olga", "Timur", "Lola", "Madina"], x: [] }],
  ["him", "{name} is ill. Our teacher sent homework for Timur and ______.", { name: ["Aziz", "Bobur", "Rustam", "Sardor"], x: [] }],
  ["he", "This is {name}. My {sib} and ______ are in the same class.", { name: HE, sib: SIB }],
  ["me", "Thank you for the tea, {who}. You are very kind to my {sib} and ______.", { who: ["Grandma", "Aunt Lola", "Mrs Karimova", "Uncle Bobur"], sib: SIB }],
  ["I", "Mum and ______ went shopping at the {place}.", { place: ["bazaar", "mall", "supermarket", "market"], x: [] }],
  ["her", "Do you remember {name}? I met Olga and ______ at the {place}.", { name: ["Lola", "Madina", "Kamila", "Dilnoza"], place: PLACE }],
  ["she", "{name} plays the {inst}. Lola and ______ play together at school.", { name: ["Olga", "Madina", "Kamila", "Dilnoza"], inst: ["piano", "guitar", "violin", "drums"] }],
  ["us", "Dad bought ice cream for the twins and ______, {name}.", { name: NAME, x: [] }],
  ["we", "The neighbours and ______ had a picnic by the {place}.", { place: ["river", "lake", "canal", "mountains"], x: [] }],
  ["me", "Can you wait for Aziz and ______ after the {event}, {name}?", { event: ["lesson", "match", "concert", "test"], name: ["Olga", "Timur", "Lola", "Madina"] }],
  ["I", "{name} and ______ have English on {day}.", { name: NAME, day: ["Mondays", "Tuesdays", "Fridays", "Saturdays"] }],
  ["him", "Where is {name}? Grandma wants to talk to Lola and ______.", { name: HE, x: [] }],
  ["he", "{name} is my cousin. Aziz and ______ often play chess.", { name: ["Timur", "Bobur", "Rustam", "Sardor"], x: [] }],
  ["me", "This photo of my {sib} and ______ is from {city}.", { sib: SIB, city: ["Samarkand", "Bukhara", "Khiva", "Fergana"] }],
  ["I", "My {who} and ______ cleaned the flat on {day}.", { who: ["mum", "sister", "brother", "dad"], day: ["Saturday", "Sunday", "Friday", "the holiday"] }],
  ["her", "{name} has a cold. The doctor gave some medicine to Olga and ______.", { name: ["Lola", "Madina", "Kamila", "Dilnoza"], x: [] }],
  ["she", "Where's {name}? Her mum and ______ are at the {place}.", { name: SHE, place: ["bazaar", "doctor's", "bank", "post office"] }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INS[key], source, key, why: WHY[key], slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const JOIN = "Join the two sentences. Start with the person's name or word and and.";
const TRANSFORM = [
  // object: and I -> and me (5)
  [COR, "This present is for my {sib} and I, {name}.", "This present is for my {sib} ______, {name}.", "and me", OBJ, { sib: SIB, name: NAME }],
  [COR, "Mum made breakfast for {who} and I {when}.", "Mum made breakfast for {who} ______ {when}.", "and me", OBJ, { who: ["Dad", "Grandpa", "my brother", "my sister"], when: ["today", "this morning", "on Sunday", "early"] }],
  [COR, "Can you come with {name} and I to the {place}?", "Can you come with {name} ______ to the {place}?", "and me", OBJ, { name: NAME, place: PLACE }],
  [COR, "The teacher helped my {sib} and I with the {task}.", "The teacher helped my {sib} ______ with the {task}.", "and me", OBJ, { sib: SIB, task: ["homework", "project", "test", "essay"] }],
  [COR, "Grandpa told Lola and I a funny {thing}, {name}.", "Grandpa told Lola ______ a funny {thing}, {name}.", "and me", OBJ, { thing: ["story", "joke", "song", "poem"], name: ["Aziz", "Olga", "Timur", "Madina"] }],
  // subject: and me / him / her -> I / he / she (5)
  [COR, "My {sib} and me went to the {place} yesterday.", "My {sib} ______ went to the {place} yesterday.", "and I", SUBJ, { sib: SIB, place: PLACE }],
  [COR, "{name} and me are in the same {group}.", "{name} ______ are in the same {group}.", "and I", SUBJ, { name: NAME, group: ["class", "team", "group", "club"] }],
  [COR, "Where's {name}? Aziz and him play {game} every day.", "Where's {name}? Aziz and ______ play {game} every day.", "he", SUBJ, { name: ["Timur", "Bobur", "Rustam", "Sardor"], game: ["football", "chess", "tennis", "volleyball"] }],
  [COR, "Do you know {she1}? Lola and her are best friends, {name}.", "Do you know {she1}? Lola and ______ are best friends, {name}.", "she", SUBJ, { she1: ["Madina", "Kamila", "Dilnoza", "Olga"], name: ["Aziz", "Timur", "Bobur", "Rustam"] }],
  [COR, "Our {who} and us had dinner {when}.", "Our {who} and ______ had dinner {when}.", "we", SUBJ, { who: ["neighbours", "cousins", "grandparents", "friends"], when: ["together", "in the garden", "last night", "on Friday"] }],
  // join two sentences (5)
  [JOIN, "My {sib} went to the {place}. I went too.", "My {sib} ______ went to the {place}.", "and I", SUBJ, { sib: SIB, place: PLACE }],
  [JOIN, "Grandma made {food} for my {sib}. She made {food} for me too.", "Grandma made {food} for my {sib} ______.", "and me", OBJ, { sib: SIB, food: ["plov", "soup", "pancakes", "dumplings"] }],
  [JOIN, "{name} likes {thing}. I like {thing} too.", "{name} ______ like {thing}.", "and I", SUBJ, { name: NAME, thing: ["chess", "football", "music", "drawing"] }],
  [JOIN, "The teacher called {he1}. She called me too, {name}.", "The teacher called {he1} ______, {name}.", "and me", OBJ, { he1: HE, name: SHE }],
  [JOIN, "Dad bought {thing} for Lola. He bought {thing} for me too, {name}.", "Dad bought {thing} for Lola ______, {name}.", "and me", OBJ, { thing: ["books", "sweets", "new shoes", "ice cream"], name: ["Aziz", "Olga", "Timur", "Madina"] }],
].map(([instr, source, hint, key, why, slots]) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you and a friend did last weekend. Start with your friend's name.", "… and I + past verb", ["exactly one sentence", "… and I", "a weekend word"]],
  ["Write one sentence about a present someone gave you and your brother or sister.", "… for my … and me", ["exactly one sentence", "… and me", "a family word"]],
  ["Write one sentence about a person you and your mum often visit.", "My mum and I visit …", ["exactly one sentence", "… and I", "a family word"]],
  ["Write one sentence about a teacher who helped you and a classmate.", "… helped … and me", ["exactly one sentence", "… and me", "a school word"]],
  ["Write one sentence about two friends who play together. Use he or she.", "… and he / she play …", ["exactly one sentence", "and he or and she", "a game word"]],
  ["Write one sentence asking a friend to come with you and your family.", "Come with my family and me.", ["exactly one sentence", "… and me", "a place word"]],
  ["Write one sentence about a photo of you and a relative.", "This is a photo of my … and me.", ["exactly one sentence", "… and me", "a family word"]],
  ["Write two sentences: one about something you and a friend do, one about something your friend does for you and your family.", "… and I … / … for … and me", ["exactly two sentences", "and I once", "and me once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a day out with a friend: where you went and what people did for you.", "my friend and I / for my friend and me", ["and I", "and me", "three or four sentences"]],
  ["Write about you and your best friend: what you do together and what other people say to you both.", "… and I / … to … and me", ["and I", "and me", "three or four sentences"]],
  ["Describe a family dinner: who cooked and who the food was for.", "Mum and I cooked … for … and me", ["and I", "and me", "three or four sentences"]],
  ["Write a thank-you note to a relative who gave presents to you and your brother or sister.", "… for my … and me", ["and me", "a family word", "three or four sentences"]],
  ["Describe a school trip you took with a classmate.", "… and I went … / The teacher told … and me …", ["and I", "and me", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.personal.subject-object-contrast.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);