// Hand-authored: pronouns / personal / object-pronouns (A1).
// Path fill P13 (2026-11-14, Base44 AI, branch grammar-path-fill-3-base44).
//
// Placement focus: object pronoun after a verb (her, me), us vs we/our, and
// the object pronoun for a plural referent (them).
// Every blank is the OBJECT of a verb or a preposition, and the person or
// thing it stands for is named first with a fixed, never-slotted word whose
// gender and number decide the key (Aziz, my grandmother, my cats, Mum and I).
// Sibling scope: never a subject blank (subject-pronouns, P1), never a
// compound object like "my friend and me" (subject-object-contrast, P44),
// never a possessive before a noun (P3), never a pronoun inside a phrasal
// verb (pronoun-separation, B1). "you" is never keyed (subject = object).
// Choose distractors: the same person's subject form, possessive word and
// reflexive or stand-alone form (him: he / his / himself; her: she / hers /
// herself; me: I / my / mine; us: we / our / ours; them: they / their /
// theirs; it: its / it's / they). No wrong-gender option: "her" for a boy can
// always be read as some other girl. The blank is never followed by a noun
// (that would make his / her / my / our / their right) and no sentence has a
// noun that hers / mine / ours / theirs could stand for.
// Build: cue = the subject pronoun in brackets, e.g. ______ (he) -> him.
// Transform: 5 replace a repeated name or noun / 5 correct the form /
// 5 change the person or thing, then the pronoun.
//
// Run: node tools/grammar-practice/authored/pronouns.personal.object-pronouns.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "personal", topic: "object-pronouns", level: "A1", pv: "2.5" };

const O = {
  him: ["him", "he", "his", "himself"],
  her: ["she", "her", "hers", "herself"],
  me: ["I", "my", "me", "mine"],
  us: ["we", "our", "ours", "us"],
  them: ["them", "they", "their", "theirs"],
  it: ["its", "it", "it's", "they"],
};
const WHY = {
  him: "After a verb or a preposition we use the object form: he → him.",
  her: "After a verb or a preposition we use the object form: she → her.",
  me: "After a verb or a preposition we use the object form: I → me.",
  us: "After a verb or a preposition we use the object form: we → us. Our needs a noun after it.",
  them: "More than one person or thing, after a verb or a preposition: they → them.",
  it: "One thing, after a verb or a preposition: it. Its needs a noun after it; it's means it is.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["Aziz is in the {room}. Can you call ______, {name}?", "him",
    { room: ["kitchen", "garden", "yard", "garage"], name: ["Mum", "Dad", "Olga", "Timur"] }],
  ["My {who} lives in {city}. We visit ______ every summer.", "her",
    { who: ["grandmother", "aunt", "sister", "older sister"], city: ["Bukhara", "Samarkand", "Khiva", "Namangan"] }],
  ["{name}, I can't do this {task}. Can you help ______?", "me",
    { name: ["Mum", "Dad", "Grandpa", "Aunt Lola"], task: ["homework", "exercise", "puzzle", "maths problem"] }],
  ["We are at the {place}, {name}. Come and meet ______ here.", "us",
    { place: ["park", "bazaar", "station", "cafe"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["My {pets} are hungry. Can you feed ______, {name}?", "them",
    { pets: ["cats", "dogs", "chickens", "rabbits"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["I can't find my {thing}. Have you seen ______, {name}?", "it",
    { thing: ["phone", "pen", "bag", "key"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["Madina is new in our {group}. Let's talk to ______, {name}.", "her",
    { group: ["class", "group", "team", "school"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["My grandparents live near the {place}. I often help ______ in the {area}.", "them",
    { place: ["market", "park", "school", "river"], area: ["garden", "kitchen", "shop", "yard"] }],
  ["Our teacher, Mr Karimov, is very {adj}. All the {who} like ______.", "him",
    { adj: ["kind", "funny", "friendly", "patient"], who: ["students", "children", "parents", "teachers"] }],
  ["{name}, this {box} is very heavy. Can you carry ______ for me?", "it",
    { name: ["Dad", "Grandpa", "Aziz", "Uncle Bobur"], box: ["box", "bag", "suitcase", "table"] }],
  ["My sister and I are at home. {who} is coming to see ______ tonight.", "us",
    { who: ["Grandma", "Aunt Lola", "Uncle Bobur", "Grandpa"] }],
  ["I'm at the {place}, {name}. Please wait for ______.", "me",
    { place: ["bus stop", "gate", "school door", "corner"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["The {kids} are in the yard. Ask ______ to come in for {meal}.", "them",
    { kids: ["children", "boys", "girls", "twins"], meal: ["dinner", "lunch", "tea", "plov"] }],
  ["Lola has {ill}. I'm going to phone ______ after school, {name}.", "her",
    { ill: ["a cold", "a fever", "a headache", "flu"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["Timur is my best friend. I play {game} with ______ every day.", "him",
    { game: ["football", "chess", "tennis", "basketball"] }],
  ["{who} makes great {food}. Everybody loves ______.", "it",
    { who: ["My mum", "Grandma", "My aunt", "Dad"], food: ["plov", "soup", "bread", "honey cake"] }],
  ["Our neighbours are away. We water the {plants} for ______, {name}.", "them",
    { plants: ["flowers", "trees", "garden", "tomatoes"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["Excuse me. Can you show ______ the way to the {place}? I'm new in {city}.", "me",
    { place: ["station", "bazaar", "museum", "library"], city: ["Tashkent", "Samarkand", "Bukhara", "Khiva"] }],
  ["My little brother is {state}. Can you hold ______ for a minute, {name}?", "him",
    { state: ["crying", "tired", "sleepy", "sad"], name: ["Mum", "Dad", "Grandma", "Olga"] }],
  ["Our class is going on a trip. {who} is taking ______ to the {place}.", "us",
    { who: ["Mr Karimov", "Ms Olga", "Our teacher", "Mrs Rahimova"], place: ["museum", "zoo", "mountains", "lake"] }],
].map(([prompt, k, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: O[k], key: O[k].indexOf(k), why: WHY[k], slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the object form of the word in brackets.";
const BW = {
  him: "He → him after a verb or a preposition.",
  her: "She → her after a verb or a preposition.",
  me: "I → me after a verb or a preposition.",
  us: "We → us after a verb or a preposition.",
  them: "They → them after a verb or a preposition.",
};
const BUILD = [
  ["{name} is at the {place}. I can see ______ (he) from here.", "him",
    { name: ["Aziz", "Grandpa", "My brother", "Timur"], place: ["gate", "bus stop", "window", "corner"] }],
  ["{name} is very good at {subj}. Ask ______ (she) for help.", "her",
    { name: ["Lola", "Madina", "My sister", "Aunt Lola"], subj: ["maths", "English", "chemistry", "drawing"] }],
  ["{name}, please give ______ (I) the {thing}.", "me",
    { name: ["Mum", "Dad", "Aziz", "Olga"], thing: ["salt", "bread", "remote", "pen"] }],
  ["Our {who} lives in {city}. He writes to ______ (we) every week.", "us",
    { who: ["uncle", "grandfather", "brother", "cousin"], city: ["Moscow", "Kazan", "Seoul", "Almaty"] }],
  ["I have two new {things}. I wear ______ (they) to {place}.", "them",
    { things: ["shirts", "jackets", "sweaters", "T-shirts"], place: ["school", "college", "work", "the gym"] }],
  ["My {who} are coming today. Can you meet ______ (they) at the {place}?", "them",
    { who: ["cousins", "grandparents", "aunts", "friends"], place: ["station", "airport", "bus stop", "gate"] }],
  ["Mr Karimov is our new {job}. Do you know ______ (he), {name}?", "him",
    { job: ["neighbour", "teacher", "doctor", "coach"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["{who} has a big {place}. We help ______ (she) on Saturdays.", "her",
    { who: ["Grandma", "My aunt", "Aunt Lola", "Mrs Rahimova"], place: ["garden", "farm", "field", "yard"] }],
  ["I don't understand this {word}, {name}. Can you explain it to ______ (I)?", "me",
    { word: ["word", "sentence", "rule", "question"], name: ["Mum", "Dad", "Ms Olga", "Aziz"] }],
  ["We are lost in the {place}, {name}. Can you help ______ (we)?", "us",
    { place: ["market", "old city", "park", "big shop"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["The {animals} are thirsty. Give ______ (they) some water, {name}.", "them",
    { animals: ["cows", "sheep", "horses", "chickens"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["{name} is in hospital. Let's visit ______ (he) tomorrow with some {gift}.", "him",
    { name: ["Grandpa", "Uncle Bobur", "Aziz", "My cousin"], gift: ["fruit", "flowers", "juice", "books"] }],
  ["My {who} is in {city} now. I miss ______ (she) a lot.", "her",
    { who: ["sister", "aunt", "grandmother", "best friend"], city: ["Kazan", "Seoul", "Almaty", "Moscow"] }],
  ["{name}, please call ______ (I) when you get to {place}.", "me",
    { name: ["Mum", "Dad", "Aziz", "Olga"], place: ["school", "Tashkent", "the station", "Grandma's house"] }],
  ["Our {who} cooks {food} for ______ (we) every Friday.", "us",
    { who: ["grandmother", "dad", "uncle", "mother"], food: ["plov", "soup", "manti", "samsa"] }],
  ["I can't find my {things}. Have you seen ______ (they), {name}?", "them",
    { things: ["keys", "glasses", "books", "shoes"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["My little brother is afraid of the {thing}. I sit with ______ (he) at night.", "him",
    { thing: ["dark", "dog", "storm", "noise"] }],
  ["{name} has a new phone number. Can you text ______ (she) for me?", "her",
    { name: ["Lola", "Madina", "Aunt Lola", "Grandma"] }],
  ["This {bag} is too heavy for ______ (I), {name}.", "me",
    { bag: ["bag", "box", "suitcase", "table"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["{who} tells ______ (we) stories about his {time}.", "us",
    { who: ["Grandpa", "Uncle Bobur", "Our neighbour", "Mr Karimov"], time: ["childhood", "school", "village", "work"] }],
].map(([source, key, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: BW[key], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REP = "Don't say the name or the noun again. Use a pronoun.";
const COR = "Correct the mistake.";
const CHG = (a, b) => `Change ${a} to ${b}. Then change the pronoun.`;
const TRANSFORM = [
  // replace a repeated name or noun (5)
  [REP, "Aziz is my friend. I often play {game} with Aziz at the {place}.", "Aziz is my friend. I often play {game} with ______ at the {place}.", "him",
    "Aziz is one boy, after with: him.", { game: ["football", "chess", "tennis", "basketball"], place: ["park", "club", "school", "yard"] }],
  [REP, "My aunt is a {job}. Everybody in our {area} knows my aunt.", "My aunt is a {job}. Everybody in our {area} knows ______.", "her",
    "My aunt is one woman, after knows: her.", { job: ["doctor", "nurse", "teacher", "baker"], area: ["street", "village", "town", "neighbourhood"] }],
  [REP, "These {things} are dirty. Please wash the {things}, {name}.", "These {things} are dirty. Please wash ______, {name}.", "them",
    "The things are more than one, after wash: them.", { things: ["plates", "cups", "socks", "apples"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [REP, "Mum and I are in the {room}. {who} is looking for Mum and me.", "Mum and I are in the {room}. {who} is looking for ______.", "us",
    "Mum and me = us after for.", { room: ["kitchen", "garden", "yard", "living room"], who: ["Dad", "Grandma", "Aziz", "Aunt Lola"] }],
  [REP, "{name}, I have a new {thing}. I take the {thing} to school every day.", "{name}, I have a new {thing}. I take ______ to school every day.", "it",
    "One thing, after take: it.", { name: ["Mum", "Dad", "Aziz", "Olga"], thing: ["bike", "bag", "ball", "laptop"] }],
  // correct the form (5)
  [COR, "Mr Karimov is my neighbour. I see he at the {place} every morning.", "Mr Karimov is my neighbour. I see ______ at the {place} every morning.", "him",
    "After see we use the object form: him, not he.", { place: ["bus stop", "shop", "gate", "bakery"] }],
  [COR, "Madina is in my {group}. I sit next to she, {name}.", "Madina is in my {group}. I sit next to ______, {name}.", "her",
    "After next to we use the object form: her, not she.", { group: ["class", "group", "team", "row"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [COR, "Please help we, {name}! The {thing} is very heavy.", "Please help ______, {name}! The {thing} is very heavy.", "us",
    "After help we use the object form: us, not we.", { name: ["Dad", "Grandpa", "Aziz", "Uncle Bobur"], thing: ["box", "table", "sofa", "bag"] }],
  [COR, "My {pets} are in the {place}. Can you see they?", "My {pets} are in the {place}. Can you see ______?", "them",
    "After see we use the object form: them, not they.", { pets: ["dogs", "cats", "rabbits", "chickens"], place: ["garden", "yard", "street", "field"] }],
  [COR, "{name}, can you lend I your {thing}?", "{name}, can you lend ______ your {thing}?", "me",
    "After lend we use the object form: me, not I.", { name: ["Aziz", "Olga", "Timur", "Lola"], thing: ["pen", "ruler", "bike", "book"] }],
  // change the person or thing, then the pronoun (5)
  [CHG("grandfather", "grandparents"), "We visit our grandfather on Sundays. We bring him {gift}, {name}.", "We visit our grandparents on Sundays. We bring ______ {gift}, {name}.", "them",
    "Grandparents are more than one person: him → them.", { gift: ["fruit", "bread", "sweets", "flowers"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [CHG("Aziz", "Lola"), "Aziz is late. Let's wait for him at the {place}, {name}.", "Lola is late. Let's wait for ______ at the {place}, {name}.", "her",
    "Lola is a girl: him → her.", { place: ["gate", "bus stop", "corner", "cafe"], name: ["Mum", "Dad", "Olga", "Timur"] }],
  [CHG("friend", "friends"), "My friend is at the {place}. Can you let him in, {name}?", "My friends are at the {place}. Can you let ______ in, {name}?", "them",
    "Friends are more than one person: him → them.", { place: ["door", "gate", "front door", "garden gate"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [CHG("this bag", "these bags"), "I like this {colour} bag, {name}. I want to buy it.", "I like these {colour} bags, {name}. I want to buy ______.", "them",
    "Bags are more than one thing: it → them.", { colour: ["red", "blue", "black", "green"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  [CHG("Dad", "Mum"), "Dad is in the {room}. Please take this {thing} to him.", "Mum is in the {room}. Please take this {thing} to ______.", "her",
    "Mum is a woman: him → her.", { room: ["kitchen", "garden", "yard", "bedroom"], thing: ["tea", "letter", "phone", "bag"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a friend and what you do with him or her.", "with him / with her", ["exactly one sentence", "must use him or her", "a friend's name"]],
  ["Write one sentence about a person in your family who helps you.", "helps me", ["exactly one sentence", "must use me", "a family word"]],
  ["Write one sentence about your family and a person who visits you.", "visits us", ["exactly one sentence", "must use us", "about your family"]],
  ["Write one sentence about two or more people or animals you like.", "like them", ["exactly one sentence", "must use them", "about you"]],
  ["Write one sentence about a thing you use every day and why you like it.", "like it / use it", ["exactly one sentence", "must use it as an object", "about you"]],
  ["Write one question to a friend: ask them to help you with something.", "Can you help me …?", ["exactly one question", "must use me", "must end with a question mark"]],
  ["Write one sentence about a teacher and what the students think of him or her.", "like him / like her", ["exactly one sentence", "must use him or her", "a teacher"]],
  ["Write two sentences: name a person in the first, then use him or her in the second.", "name … him / her", ["exactly two sentences", "a name in the first", "him or her in the second"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell a new friend about your best friend: what you do with them and why you like them.", "him / her / them", ["with him / with her", "I like him / her", "three or four sentences"]],
  ["Describe a person in your family who looks after you. What do they do for you?", "me / us", ["helps me / for us", "a family word", "three or four sentences"]],
  ["Write a message to your grandparents. Tell them you miss them and want to visit them.", "them", ["miss them", "visit them", "three or four sentences"]],
  ["Tell a friend about your favourite thing at home and what you do with it.", "it", ["use it / like it", "what you do", "three or four sentences"]],
  ["Write about a teacher you like. Say what the teacher does and why you like him or her.", "him / her", ["him or her", "what the teacher does", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.personal.object-pronouns.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);