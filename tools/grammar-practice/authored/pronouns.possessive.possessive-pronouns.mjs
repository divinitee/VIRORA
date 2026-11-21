// Hand-authored: pronouns / possessive / possessive-pronouns (A2).
// Path fill P24 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
// Level A2 by Tee's re-level, 16 Nov (the placement bank says A1).
//
// Placement foci: theirs standing alone; mine (pronoun) vs my (determiner).
// Sibling scope: every blank is a possessive PRONOUN with no noun after it
// (mine, yours, his, hers, ours, theirs). Possessive determiners before a
// noun are P3 (never keyed here); its is never keyed (no stand-alone its).
// One right answer: the owner is fixed and named in the sentence (I've got
// my …, Aziz's …, My sister and I …, the children left it), so a different
// person's pronoun never fits. No "Is it mine or yours?" lines.
// Choose distractors: the same person's determiner, object / subject form
// and the apostrophe error (my / me / I, your / you / your's, he / him /
// he's, her / she / her's, our / us / our's, their / them / their's).
// Build: cue = subject pronoun in brackets (I → mine); no source prints the
// key word anywhere else.
// Transform: 5 my + noun → mine / 5 correct the mistake / 5 answer Whose …?
//
// Run: node tools/grammar-practice/authored/pronouns.possessive.possessive-pronouns.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "possessive", topic: "possessive-pronouns", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const COLOR = ["white", "red", "blue", "black"];
const THING = ["phone", "pen", "bag", "book"];
const THINGS = ["books", "pens", "bags", "chairs"];
const PET = ["dog", "cat", "parrot", "rabbit"];
const TEACH = ["Ms Ivanova", "Mr Karimov", "Mum", "Dad"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const O = {
  mine: ["mine", "my", "me", "I"],
  Mine: ["Mine", "My", "Me", "I"],
  yours: ["yours", "your", "you", "your's"],
  his: ["his", "he", "him", "he's"],
  His: ["His", "He", "Him", "He's"],
  hers: ["hers", "her", "she", "her's"],
  ours: ["ours", "our", "us", "our's"],
  theirs: ["theirs", "their", "them", "their's"],
};
const W = {
  mine: "No noun comes after it, so use mine, not my.",
  yours: "No noun comes after it, so use yours, not your. Yours has no apostrophe.",
  his: "No noun comes after it, so use his: it means his thing.",
  hers: "No noun comes after it, so use hers, not her. Hers has no apostrophe.",
  ours: "No noun comes after it, so use ours, not our. Ours has no apostrophe.",
  theirs: "No noun comes after it, so use theirs, not their. Theirs has no apostrophe.",
};

/* ---------------- choose: 20 mcq ---------------- */
// [option set, why key, prompt, slots]
const CHOOSE = [
  ["mine", "mine", "This {thing} is ______, {name}. Please give it back.", { thing: THING, name: NAME }],
  ["mine", "mine", "That isn't your {thing}, {name}. It's ______.", { thing: THING, name: NAME }],
  ["mine", "mine", "Your {thing} is {c1}, and ______ is {c2}.", { thing: ["bike", "bag", "phone", "jacket"], c1: ["red", "white", "grey", "green"], c2: ["blue", "black", "pink", "yellow"] }],
  ["yours", "yours", "Is this {thing} ______, {name}? It was on the {place}.", { thing: THING, name: NAME, place: ["floor", "desk", "chair", "bus"] }],
  ["yours", "yours", "My {room} is small, but ______ is very big, {name}.", { room: ["room", "flat", "house", "kitchen"], name: NAME }],
  ["yours", "yours", "I've got my {thing}. Have you got ______, {name}?", { thing: ["ticket", "book", "pen", "passport"], name: NAME }],
  ["his", "his", "This is {name}'s {thing}. It's ______.", { name: HE, thing: THING }],
  ["His", "his", "My {who} has got a {thing}. ______ is new, but mine is old.", { who: ["brother", "cousin", "uncle", "dad"], thing: ["bike", "phone", "laptop", "watch"] }],
  ["hers", "hers", "{name} can't find her {thing}. Is this one ______?", { name: SHE, thing: THING }],
  ["hers", "hers", "Whose {thing} is this? – It's ______. {name} left it here.", { thing: THING, name: SHE }],
  ["hers", "hers", "My sister and I have got new {things}. Mine is blue, and ______ is {color}.", { things: ["bikes", "bags", "phones", "coats"], color: ["red", "pink", "white", "green"] }],
  ["ours", "ours", "This classroom isn't ______. We're in room {n}, {name}.", { n: ["12", "15", "21", "30"], name: NAME }],
  ["ours", "ours", "Their {home} is big, but ______ is small, {name}.", { home: ["flat", "house", "garden", "car"], name: NAME }],
  ["ours", "ours", "Is that {pet} ______, {name}? – No, it's our neighbours'.", { pet: PET, name: NAME }],
  ["theirs", "theirs", "These {things} aren't ours. They're ______. Ask the {who}.", { things: THINGS, who: ["neighbours", "teachers", "other students", "Karimovs"] }],
  ["theirs", "theirs", "Our {home} is old, but ______ is new. They built it {when}.", { home: ["house", "garage", "school", "shop"], when: ["last year", "this year", "two years ago", "in the summer"] }],
  ["theirs", "theirs", "Is this {thing} ______, {name}? – Yes, the children left it here.", { thing: ["ball", "kite", "bike", "toy car"], name: NAME }],
  ["Mine", "mine", "Can I use your {thing}, {name}? ______ is at home.", { thing: ["pen", "ruler", "charger", "dictionary"], name: NAME }],
  ["mine", "mine", "{name} is a friend of ______. We play {sport} together.", { name: NAME, sport: ["football", "chess", "tennis", "basketball"] }],
  ["his", "his", "I've got my {thing}, and {name} has got ______.", { thing: ["ticket", "book", "phone", "lunch"], name: HE }],
].map(([set, why, prompt, slots], i) => {
  const base = O[set];
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[why], slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the possessive pronoun for the word in brackets: mine, yours, his, hers, ours or theirs.";
const BUILD = [
  ["mine", "This {thing} is ______ (I), {name}.", { thing: THING, name: NAME }],
  ["yours", "Is this {thing} ______ (you), {name}?", { thing: THING, name: NAME }],
  ["hers", "That {thing} isn't mine. It's ______ (she). It was on her {place}.", { thing: THING, place: ["desk", "chair", "bed", "table"] }],
  ["ours", "These {things} are ______ (we), {name}.", { things: THINGS, name: NAME }],
  ["theirs", "The {home} on the corner is ______ (they), {name}.", { home: ["house", "shop", "café", "car"], name: NAME }],
  ["his", "My {thing} is old, but ______ (he) is new, {name}.", { thing: ["bike", "phone", "laptop", "watch"], name: NAME }],
  ["mine", "Your {room} is bigger than ______ (I), {name}.", { room: ["room", "flat", "house", "garden"], name: NAME }],
  ["theirs", "Our {thing} is {c1}, and ______ (they) is {c2}.", { thing: ["car", "door", "gate", "house"], c1: ["red", "white", "grey", "green"], c2: ["blue", "black", "brown", "yellow"] }],
  ["yours", "Is that {pet} ______ (you), {name}?", { pet: PET, name: NAME }],
  ["hers", "Whose {thing} is this? Is it ______ (she), {name}?", { thing: THING, name: NAME }],
  ["mine", "{name} is a cousin of ______ (I). He lives in {city}.", { name: HE, city: ["Samarkand", "Bukhara", "Tashkent", "Fergana"] }],
  ["ours", "The {things} on the table are ______ (we). Please don't take them, {name}.", { things: ["cups", "plates", "books", "phones"], name: NAME }],
  ["his", "Those {things} are ______ (he). He got them {when}.", { things: ["shoes", "books", "games", "headphones"], when: ["last week", "yesterday", "on Monday", "in the summer"] }],
  ["ours", "My {sib} and I share a room. The {thing} is ______ (we).", { sib: ["brother", "sister", "cousin", "twin"], thing: ["desk", "TV", "computer", "wardrobe"] }],
  ["yours", "I've got my {thing}. Have you got ______ (you), {name}?", { thing: ["ticket", "book", "pen", "passport"], name: NAME }],
  ["theirs", "They can't find their {thing}. Is this one ______ (they), {name}?", { thing: ["ball", "map", "key", "umbrella"], name: NAME }],
  ["hers", "{name} says the {thing} is ______ (she).", { name: SHE, thing: THING }],
  ["Mine", "Can I borrow your {thing}, {name}? ______ (I) is broken.", { thing: ["pen", "ruler", "charger", "calculator"], name: NAME }],
  ["theirs", "Our {home} is near the park, and ______ (they) is near the {place}.", { home: ["flat", "house", "school", "shop"], place: ["station", "bazaar", "river", "bank"] }],
  ["Mine", "This isn't my {thing}, {name}. ______ (I) is in my bag.", { thing: THING, name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W[key.toLowerCase()], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const RW = "Rewrite the sentence with a possessive pronoun.";
const COR = "Correct the mistake.";
const WHOSE = "Answer with mine, yours, his, hers, ours or theirs.";
const TRANSFORM = [
  // my + noun -> mine (5)
  [RW, "This is my {thing}, {name}.", "This {thing} is ______, {name}.", "mine", "My + noun → mine: This is my phone = This phone is mine.", { thing: THING, name: NAME }],
  [RW, "Is this your {thing}, {name}?", "Is this {thing} ______, {name}?", "yours", "Your + noun → yours: Is this phone yours?", { thing: THING, name: NAME }],
  [RW, "These are our {things}, {name}.", "These {things} are ______, {name}.", "ours", "Our + noun → ours: These books are ours.", { things: THINGS, name: NAME }],
  [RW, "That is {name}'s {thing}.", "That {thing} is ______.", "his", "Aziz's thing → his: That phone is his.", { name: HE, thing: THING }],
  [RW, "Those are their {things}, {who}.", "Those {things} are ______, {who}.", "theirs", "Their + noun → theirs: Those books are theirs.", { things: THINGS, who: TEACH }],
  // correct the mistake (5)
  [COR, "This {thing} is my, {name}.", "This {thing} is ______, {name}.", "mine", "No noun after it, so use mine, not my.", { thing: THING, name: NAME }],
  [COR, "The {color} {thing} is her's.", "The {color} {thing} is ______.", "hers", "Hers never has an apostrophe: her's is wrong.", { color: COLOR, thing: ["bag", "bike", "coat", "phone"] }],
  [COR, "Is this {thing} your, {name}?", "Is this {thing} ______, {name}?", "yours", "No noun after it, so use yours, not your.", { thing: THING, name: NAME }],
  [COR, "These {things} are our's, {name}.", "These {things} are ______, {name}.", "ours", "Ours never has an apostrophe: our's is wrong.", { things: THINGS, name: NAME }],
  [COR, "Those {things} are their, {who}.", "Those {things} are ______, {who}.", "theirs", "No noun after it, so use theirs, not their.", { things: THINGS, who: TEACH }],
  // whose? (5)
  [WHOSE, "Whose {thing} is this? – It's {name}'s.", "Whose {thing} is this? – It's ______.", "his", "A boy's thing → his, with no noun after it.", { thing: THING, name: HE }],
  [WHOSE, "Whose {thing} is this? – It's my {who}'s.", "Whose {thing} is this? – It's ______.", "hers", "My mum's or my sister's thing → hers.", { thing: THING, who: ["mum", "sister", "aunt", "grandma"] }],
  [WHOSE, "Whose {things} are these? – They're my {who}'.", "Whose {things} are these? – They're ______.", "theirs", "My parents' or my cousins' things → theirs.", { things: THINGS, who: ["parents", "cousins", "grandparents", "neighbours"] }],
  [WHOSE, "Whose {thing} is this, {name}? – It's my {thing}.", "Whose {thing} is this, {name}? – It's ______.", "mine", "My + noun → mine, with no noun after it.", { thing: THING, name: NAME }],
  [WHOSE, "Whose {pet} is that, {name}? – It's our {pet}.", "Whose {pet} is that, {name}? – It's ______.", "ours", "Our + noun → ours, with no noun after it.", { pet: PET, name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a thing in your classroom that is yours.", "… is mine.", ["exactly one sentence", "mine", "a school word"]],
  ["Compare your phone or bag with a friend's in one sentence.", "Mine is … , but yours / his / hers is …", ["exactly one sentence", "mine", "yours, his or hers"]],
  ["Someone has left a bag on the bus. Write one question to find who owns it.", "Is this yours?", ["exactly one question", "yours", "a thing word"]],
  ["Write one sentence about your family's home and your neighbours' home.", "Ours is … , and theirs is …", ["exactly one sentence", "ours", "theirs"]],
  ["Write one sentence about a friend of yours.", "… is a friend of mine.", ["exactly one sentence", "a friend of mine", "a name"]],
  ["Answer the question Whose pen is this? in one sentence. It's your sister's.", "It's hers.", ["exactly one sentence", "hers", "no noun after it"]],
  ["Write one sentence about your brother's or uncle's car.", "… is his.", ["exactly one sentence", "his", "a colour word"]],
  ["Write two sentences: one with mine and one with yours.", "… is mine. / Is … yours?", ["exactly two sentences", "mine once", "yours once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["After a lesson, there are things on the floor. Write a short dialogue: who owns what?", "Is this yours? – No, it's his / hers.", ["yours", "his or hers", "three or four lines"]],
  ["Compare your room with your brother's or sister's room.", "Mine is … , but his / hers is …", ["mine", "his or hers", "three or four sentences"]],
  ["Compare your family's flat or house with a neighbour's.", "Ours is … , and theirs is …", ["ours", "theirs", "three or four sentences"]],
  ["You and a friend have bought the same phone. Explain how you know which one is yours.", "Mine is … , and yours is …", ["mine", "yours", "three or four sentences"]],
  ["Write about two friends of yours: who they are and what you do together.", "a friend of mine", ["a friend of mine", "his or hers", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.possessive.possessive-pronouns.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);