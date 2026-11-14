// Hand-authored: sentence-structure / imperatives / affirmative-imperative (A1).
// Path fill P15 (2026-11-14, Base44 AI, branch grammar-path-fill-3-base44).
//
// Placement focus: base form for an imperative ("______ the door, please":
// Opens / Opening / Open / To open).
// Every blank is the verb of a positive order, instruction or request to the
// person spoken to: classroom, home, cooking, directions, safety. Sibling
// scope: no Don't (negative-imperative, P16), no Let's, no "you must / should"
// (modals), no can-requests as answers (can-request).
// Choose options are the base form plus the placement's three errors: -s
// (Opens), -ing (Opening) and to + verb (To open). "Be" items use Be / Is /
// Being / To be (Russian and Uzbek drop "be": "Careful!" is fine, "Is
// careful" is not). Each sentence makes the imperative the only reading: a
// name or "please" tells you someone is spoken to, and no sentence lets an
// -ing or to-form work as a subject or a heading ("Washing hands" as a sign).
// "You + verb" is never an option ("You open the door, please" can be said).
// Build: "Write the verb in brackets in the right form." The cue is the -s or
// -ing form (stops, giving, being) and the learner writes the base form.
// Transform: 5 correct the form (-s, to, -ing, Being, "Please you help") /
// 5 "You + verb" instruction -> imperative / 5 "Can you …?" -> imperative.
//
// Run: node tools/grammar-practice/authored/sentence-structure.imperatives.affirmative-imperative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "imperatives", topic: "affirmative-imperative", level: "A1", pv: "2.5" };

const cap = (s) => s[0].toUpperCase() + s.slice(1);
// first = the blank opens the sentence (capital letters in the options)
const OPTS = (v, s, ing, first) => {
  const o = [[v, s, ing, `to ${v}`], [s, v, `to ${v}`, ing], [ing, `to ${v}`, v, s], [`to ${v}`, s, ing, v]];
  return (i) => o[i % 4].map((x) => (first ? cap(x) : x));
};
const BE = ["Be", "Is", "Being", "To be"];
const W = (v) => `To tell someone to do something, use the base verb with no -s, no -ing and no to: ${v}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["open", "opens", "opening", "______ the {thing}, please, {name}. It's hot in here.",
    { thing: ["window", "door", "balcony door", "big window"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["wash", "washes", "washing", "______ your hands before {meal}, {name}.",
    { meal: ["dinner", "lunch", "breakfast", "the meal"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["be", null, null, "______ careful, {name}! The {thing} is hot.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], thing: ["soup", "tea", "pan", "stove"] }],
  ["take", "takes", "taking", "{name}, ______ an umbrella. It's {weather} outside.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], weather: ["raining", "wet", "stormy", "grey"] }],
  ["turn", "turns", "turning", "______ left at the {place} and then {next}.",
    { place: ["bank", "bakery", "big tree", "traffic lights"], next: ["cross the road", "go straight on", "walk for two minutes", "stop"] }],
  ["sit", "sits", "sitting", "Please ______ here, {name}. This {seat} is free.",
    { name: ["Aziz", "Olga", "Grandma", "Uncle Bobur"], seat: ["chair", "seat", "place", "bench"] }],
  ["listen", "listens", "listening", "______ to the {audio} and answer the questions, {who}.",
    { audio: ["dialogue", "story", "song", "text"], who: ["class", "everyone", "children", "students"] }],
  ["drink", "drinks", "drinking", "______ some water, {name}. You look {adj}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["tired", "hot", "thirsty", "ill"] }],
  ["put", "puts", "putting", "______ your {bag} on the {place}, please.",
    { bag: ["bag", "coat", "jacket", "books"], place: ["chair", "table", "shelf", "desk"] }],
  ["call", "calls", "calling", "{name}, ______ me when you get to {place}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], place: ["school", "Tashkent", "the station", "Grandma's house"] }],
  ["write", "writes", "writing", "______ your name at the top of the {paper}, {who}.",
    { paper: ["page", "paper", "test", "form"], who: ["everyone", "class", "students", "children"] }],
  ["help", "helps", "helping", "{name}, please ______ your sister with her {task}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], task: ["homework", "maths", "bag", "English"] }],
  ["come", "comes", "coming", "______ here, {name}! Look at this {thing}!",
    { name: ["Aziz", "Olga", "Timur", "Lola"], thing: ["cat", "picture", "bird", "rainbow"] }],
  ["eat", "eats", "eating", "______ your {food}, {name}. It's getting cold.",
    { food: ["soup", "plov", "dinner", "breakfast"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["be", null, null, "______ quiet in the {place}, please, {name}.",
    { place: ["library", "hospital", "museum", "classroom"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["close", "closes", "closing", "It's cold in here, {name}. Please ______ the {thing}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], thing: ["window", "door", "balcony door", "big window"] }],
  ["cut", "cuts", "cutting", "______ the {veg} into small pieces, {name}.",
    { veg: ["onions", "carrots", "potatoes", "tomatoes"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["wear", "wears", "wearing", "______ a warm {coat} today, {name}. It's very cold.",
    { coat: ["coat", "hat", "jacket", "sweater"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["tell", "tells", "telling", "{name}, ______ Grandma about your {news}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], news: ["test", "new school", "trip", "football match"] }],
  ["bring", "brings", "bringing", "Please ______ your {thing} to the next lesson, {name}.",
    { thing: ["dictionary", "notebook", "pencil", "ruler"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([v, s, ing, prompt, slots], i) => {
  const first = prompt.startsWith("______");
  const options = v === "be" ? BE : OPTS(v, s, ing, first)(i);
  const k = v === "be" ? "Be" : first ? cap(v) : v;
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: W(v === "be" ? "be" : v), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets in the right form.";
const BUILD = [
  ["stop", "______ (stops) at the {place}, {name}.",
    { place: ["corner", "red light", "gate", "crossing"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["give", "Please ______ (giving) me the {thing}, {name}.",
    { thing: ["salt", "bread", "remote", "pen"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["look", "______ (looks) at the {thing} on page {n}.",
    { thing: ["picture", "map", "table", "photo"], n: ["ten", "twelve", "twenty", "five"] }],
  ["be", "______ (being) quiet, please, {name}. The baby is {state}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], state: ["sleeping", "asleep", "very tired", "not well"] }],
  ["clean", "{name}, ______ (cleans) your room before {who} comes.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], who: ["Grandma", "Aunt Lola", "Uncle Bobur", "Grandpa"] }],
  ["go", "______ (going) straight on, {name}, and turn right at the {place}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], place: ["school", "bank", "park", "bakery"] }],
  ["mix", "______ (mixes) the {thing} with a spoon, {name}.",
    { thing: ["soup", "salad", "sugar", "flour"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["wait", "Please ______ (waits) for me at the {place}, {name}.",
    { place: ["bus stop", "gate", "corner", "door"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["do", "______ (doing) your {subj} homework now, {name}.",
    { subj: ["maths", "English", "history", "chemistry"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["feed", "______ (feeds) the {pet}, please, {name}.",
    { pet: ["cat", "dog", "chickens", "fish"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["brush", "______ (brushing) your teeth before {time}, {name}.",
    { time: ["bed", "school", "you sleep", "breakfast"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["open", "______ (opens) your books at page {n}, {who}.",
    { n: ["five", "ten", "twenty", "thirty"], who: ["class", "everyone", "children", "students"] }],
  ["say", "______ (says) hello to your {who} for me, {name}.",
    { who: ["mum", "grandma", "brother", "family"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["carry", "______ (carrying) this {thing} to the kitchen, {name}.",
    { thing: ["box", "bag", "plate", "tray"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["smile", "______ (smiles), {name}! I'm taking a {photo}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], photo: ["photo", "picture", "video", "selfie"] }],
  ["play", "{name}, ______ (plays) with your little {sib} for an hour.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], sib: ["brother", "sister", "cousin", "brothers"] }],
  ["run", "______ (runs)! The {bus} is {state}.",
    { bus: ["bus", "train", "tram", "minibus"], state: ["here", "leaving", "coming", "at the stop"] }],
  ["repeat", "______ (repeating) the new {words} after me, {who}.",
    { words: ["words", "phrases", "verbs", "sentences"], who: ["class", "everyone", "children", "students"] }],
  ["shut", "Please ______ (shuts) the {thing} quietly, {name}.",
    { thing: ["door", "window", "gate", "cupboard"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["choose", "______ (choosing) a {thing} for Grandma's birthday, {name}.",
    { thing: ["card", "present", "cake", "song"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: v, why: W(v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const YOU = "Make it an order. Start with the verb.";
const CAN = "Change the question to an order. Start with the verb.";
const TRANSFORM = [
  // correct the form (5)
  [COR, "Washes the {thing}, please, {name}.", "______ the {thing}, please, {name}.", "wash",
    "An order uses the base verb, with no -s: wash.", { thing: ["cups", "plates", "apples", "car"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "To sit down, please, {name}. The {event} is starting.", "______ down, please, {name}. The {event} is starting.", "sit",
    "An order uses the base verb, with no to: sit.", { name: ["Aziz", "Olga", "Timur", "Lola"], event: ["film", "lesson", "concert", "show"] }],
  [COR, "Being careful on the {place}, {name}.", "______ careful on the {place}, {name}.", "be",
    "An order with an adjective uses be: be careful.", { place: ["stairs", "ice", "road", "wet floor"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "Please you help me with this {thing}, {name}.", "Please ______ me with this {thing}, {name}.", "help",
    "An order has no you before the verb: please help me.", { thing: ["box", "bag", "table", "exercise"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [COR, "Taking your {thing}. It's {weather} today.", "______ your {thing}. It's {weather} today.", "take",
    "An order uses the base verb, with no -ing: take.", { thing: ["coat", "hat", "scarf", "gloves"], weather: ["cold", "windy", "snowing", "freezing"] }],
  // "You + verb" -> order (5)
  [YOU, "You turn right at the {place}, {name}.", "______ right at the {place}, {name}.", "turn",
    "An order has no you: just the verb.", { place: ["bank", "park", "school", "bakery"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [YOU, "You put the {veg} in the pot, {name}.", "______ the {veg} in the pot, {name}.", "put",
    "An order has no you: just the verb.", { veg: ["onions", "carrots", "rice", "potatoes"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [YOU, "You write the answers in your {book}, {who}.", "______ the answers in your {book}, {who}.", "write",
    "An order has no you: just the verb.", { book: ["notebook", "copybook", "workbook", "exercise book"], who: ["class", "everyone", "children", "students"] }],
  [YOU, "You press the {colour} button on the {device}.", "______ the {colour} button on the {device}.", "press",
    "An order has no you: just the verb.", { colour: ["green", "red", "blue", "yellow"], device: ["remote", "machine", "phone", "radio"] }],
  [YOU, "You fill the {thing} with water, {name}.", "______ the {thing} with water, {name}.", "fill",
    "An order has no you: just the verb.", { thing: ["bottle", "glass", "kettle", "bucket"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  // "Can you …?" -> order (5)
  [CAN, "Can you pass me the {thing}, {name}?", "______ me the {thing}, please, {name}.", "pass",
    "An order starts with the base verb: pass me …", { thing: ["salt", "bread", "water", "sugar"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [CAN, "Can you clean the {thing}, {name}?", "______ the {thing}, please, {name}.", "clean",
    "An order starts with the base verb: clean …", { thing: ["table", "kitchen", "board", "floor"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [CAN, "Can you show me your {thing}, {name}?", "______ me your {thing}, please, {name}.", "show",
    "An order starts with the base verb: show me …", { thing: ["homework", "drawing", "new phone", "photos"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [CAN, "Can you buy some {food} at the shop, {name}?", "______ some {food} at the shop, please, {name}.", "buy",
    "An order starts with the base verb: buy …", { food: ["bread", "milk", "eggs", "fruit"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [CAN, "Can you speak more {how}, {name}?", "______ more {how}, please, {name}.", "speak",
    "An order starts with the base verb: speak …", { how: ["slowly", "quietly", "loudly", "clearly"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one instruction for a guest in your home.", "base verb + …", ["exactly one sentence", "start with the verb", "please"]],
  ["Write one instruction for your little brother or sister in the morning.", "base verb + …", ["exactly one sentence", "start with the verb", "about the morning"]],
  ["Write one sentence that tells a friend the way from your school to your home.", "turn / go + …", ["exactly one sentence", "turn or go", "a place word"]],
  ["Write one instruction for cooking your favourite food.", "cut / put / mix + …", ["exactly one sentence", "start with the verb", "a food word"]],
  ["Write one instruction a teacher gives in your English class.", "open / write / listen + …", ["exactly one sentence", "start with the verb", "a classroom word"]],
  ["Write one sentence with be: tell a friend to be careful or quiet.", "Be careful / Be quiet", ["exactly one sentence", "must use be", "a reason"]],
  ["Write one instruction for a friend who feels ill.", "drink / sit / go + …", ["exactly one sentence", "start with the verb", "advice"]],
  ["Write two instructions for a friend who is visiting your town.", "base verb + …", ["exactly two sentences", "start each with a verb", "a place in your town"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Explain to a friend how to cook a simple dish from your home: three or four steps.", "imperatives", ["start each step with a verb", "first / then", "three or four sentences"]],
  ["Tell a new student the way from the school gate to your classroom.", "imperatives", ["go / turn / walk", "a place word", "three or four sentences"]],
  ["Write the rules for a guest in your home: shoes, food, the pet.", "imperatives", ["start with a verb", "please", "three or four sentences"]],
  ["Give a friend advice for a big test tomorrow.", "imperatives", ["start with a verb", "be + adjective once", "three or four sentences"]],
  ["Write a message to a friend who is coming to your town for the first time. What should they do?", "imperatives", ["visit / try / go", "a place in your town", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.imperatives.affirmative-imperative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);