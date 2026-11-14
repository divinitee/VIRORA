// Hand-authored: modals / obligation / mustnt-vs-dont-have-to (A2).
// Path fill P18 (2026-11-14, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement foci: mustn't = it is not allowed (You ______ park here. It is
// not allowed.) and don't have to = it is not necessary (It's a casual party,
// so you ______ wear a suit.). A contrast topic: every sentence carries a
// fixed, never-slotted reason that makes only one of the two right:
// mustn't → not allowed / dangerous / a secret / the baby is asleep;
// don't have to → free / we have time / there's food / you can use mine.
// About half of every stage is each; 4-5 per stage are he / she
// (doesn't have to). No sentence where a host or a teacher could just
// prefer you not to do it ("You mustn't come early" was cut).
// Choose options: mustn't / don't have to + one form error each (don't must,
// mustn't to, doesn't have to with you / we, don't have to with he / she).
// NEVER offered: shouldn't, can't, needn't (often right too).
// Build: "Write mustn't, don't have to or doesn't have to." (closed class in
// instr). No build or transform target prints "to" or "have", so the typed
// key is never echoed. Ingest adds must not / do not / does not.
// Transform: 5 "It isn't necessary for … to …" → don't / doesn't have to /
// 5 "… isn't allowed" → mustn't / 5 correct the wrong choice (both ways).
//
// Run: node tools/grammar-practice/authored/modals.obligation.mustnt-vs-dont-have-to.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "obligation", topic: "mustnt-vs-dont-have-to", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const WHO = ["class", "everyone", "children", "students"];
const ADULT = ["Dad", "Mum", "Uncle Bobur", "Aunt Lola"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const OPT = {
  m: ["mustn't", "don't have to", "don't must", "mustn't to"],
  d: ["don't have to", "mustn't", "don't must", "doesn't have to"],
  hm: ["mustn't", "doesn't have to", "doesn't must", "mustn't to"],
  hd: ["doesn't have to", "mustn't", "don't have to", "doesn't must"],
};
const WHY = {
  m: "It is not allowed or not safe, so use mustn't.",
  d: "It is not necessary, but it is OK to do it, so use don't have to.",
  hm: "It is not allowed or not safe, so use mustn't. Mustn't is the same for he and she.",
  hd: "It is not necessary, so use doesn't have to (he / she / it + doesn't).",
};
const KEY = { m: "mustn't", d: "don't have to", hm: "mustn't", hd: "doesn't have to" };

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  // mustn't (10)
  ["m", "You ______ park in front of the {place}, {who}. It isn't allowed.",
    { place: ["gate", "hospital", "school", "shop"], who: ADULT }],
  ["m", "You ______ touch the {thing}, {name}. It's dangerous.",
    { thing: ["machine", "cables", "socket", "heater"], name: NAME }],
  ["m", "We ______ tell {who} about the {thing}. It's a surprise.",
    { who: ["Mum", "Grandma", "Dad", "our teacher"], thing: ["party", "present", "cake", "trip"] }],
  ["m", "Students ______ use their phones during the {event}. It's against the rules.",
    { event: ["test", "exam", "dictation", "lesson"] }],
  ["m", "You ______ swim in the {water}, {name}. It's very dangerous here.",
    { water: ["river", "lake", "canal", "sea"], name: NAME }],
  ["m", "You ______ eat in the {place}, {who}. Food isn't allowed there.",
    { place: ["library", "computer room", "museum", "science room"], who: WHO }],
  ["hm", "{name} ______ eat {food}. Her doctor says no.",
    { name: SHE, food: ["sugar", "sweets", "chocolate", "cake"] }],
  ["m", "You ______ be late for the {event}, {name}. The doors close at nine.",
    { event: ["exam", "concert", "show", "test"], name: NAME }],
  ["m", "We ______ make any noise, {name}. The baby is {state}.",
    { name: NAME, state: ["asleep", "sleeping", "very tired", "just asleep"] }],
  ["hm", "{name} ______ lift {thing}. His back hurts.",
    { name: HE, thing: ["heavy bags", "heavy boxes", "heavy things", "the sofa"] }],
  // don't have to (10)
  ["d", "You ______ pay, {name}. The {place} is free today.",
    { name: NAME, place: ["museum", "zoo", "park", "gallery"] }],
  ["d", "We ______ get up early tomorrow, {name}. It's {day}.",
    { name: NAME, day: ["Sunday", "a holiday", "the first day of the holidays", "New Year's Day"] }],
  ["d", "You ______ bring food, {name}. There's a lot at the {event}.",
    { name: NAME, event: ["party", "wedding", "birthday party", "school concert"] }],
  ["hd", "{name} ______ wear a uniform. Her new {place} doesn't have one.",
    { name: SHE, place: ["school", "college", "job", "course"] }],
  ["d", "You ______ come with me, {name}. I can go to the {place} alone.",
    { name: NAME, place: ["bazaar", "shop", "bank", "doctor"] }],
  ["d", "We ______ hurry, {name}. The {transport} leaves in an hour.",
    { name: NAME, transport: ["bus", "train", "minibus", "tram"] }],
  ["d", "You ______ cook tonight, {who}. We're eating at {place}.",
    { who: ["Mum", "Dad", "Aziz", "Olga"], place: ["Grandma's", "a café", "our neighbours'", "Uncle Bobur's"] }],
  ["hd", "{name} ______ take the test again. He passed with {score}.",
    { name: HE, score: ["90 percent", "a very good mark", "95 percent", "top marks"] }],
  ["d", "You ______ buy a new {thing}, {name}. You can use mine.",
    { thing: ["dictionary", "calculator", "umbrella", "bike"], name: NAME }],
  ["d", "You ______ answer every question, {who}. Choose {n} of them.",
    { who: WHO, n: ["five", "six", "three", "four"] }],
].map(([k, prompt, slots], i) => {
  const options = rot(OPT[k], i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(OPT[k][0]), why: WHY[k], slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write mustn't, don't have to or doesn't have to.";
const BUILD = [
  // mustn't (10)
  ["m", "You ______ cross the {road} here, {name}. The cars go very fast.",
    { road: ["road", "street", "main road", "big road"], name: NAME }],
  ["m", "We ______ forget Grandma's {thing}, {name}. She needs it today.",
    { thing: ["medicine", "phone", "bag", "ticket"], name: NAME }],
  ["m", "You ______ open this {thing}, {name}. It's for your brother.",
    { thing: ["present", "box", "letter", "parcel"], name: NAME }],
  ["m", "Players ______ leave the {place} during the game. It's against the rules.",
    { place: ["pitch", "court", "field", "team area"] }],
  ["m", "You ______ talk with the driver while the {bus} is moving, {name}.",
    { bus: ["bus", "tram", "minibus", "coach"], name: NAME }],
  ["hm", "{name} ______ have cold {drink}. She is ill, and the doctor says no.",
    { name: SHE, drink: ["water", "juice", "milk", "drinks"] }],
  ["m", "You ______ feed the {animal} at the zoo, {name}. The sign says so.",
    { animal: ["monkeys", "bears", "lions", "birds"], name: NAME }],
  ["m", "We ______ be noisy in the {place}, {name}. People are reading.",
    { place: ["library", "reading room", "study room", "book club"], name: NAME }],
  ["m", "You ______ show this message to {who}, {name}. It's a secret.",
    { who: ["anyone", "your brother", "Mum", "your friends"], name: NAME }],
  ["hm", "{name} ______ play football today. He hurt his {part} yesterday.",
    { name: HE, part: ["leg", "knee", "foot", "ankle"] }],
  // don't / doesn't have to (10)
  ["d", "You ______ wash the {thing}, {name}. We've got a dishwasher.",
    { thing: ["dishes", "plates", "cups", "pans"], name: NAME }],
  ["d", "We ______ take a taxi, {name}. The {place} is very close.",
    { name: NAME, place: ["station", "bazaar", "school", "park"] }],
  ["d", "You ______ wear a suit at the {event}, {name}. It's very casual.",
    { event: ["party", "picnic", "dinner", "birthday party"], name: NAME }],
  ["hd", "{name} ______ work at the {place} tomorrow. It's her day off.",
    { name: SHE, place: ["café", "shop", "hospital", "bank"] }],
  ["d", "You ______ call me, {name}. Just send a {msg}.",
    { name: NAME, msg: ["message", "text", "photo", "voice message"] }],
  ["d", "We ______ buy {food}, {name}. There's a lot in the fridge.",
    { food: ["milk", "cheese", "juice", "butter"], name: NAME }],
  ["hd", "{name} ______ take the bus. His {who} drives him.",
    { name: HE, who: ["dad", "mum", "uncle", "brother"] }],
  ["d", "You ______ finish the book today, {who}. The library wants it back in {time}.",
    { who: WHO, time: ["a week", "two weeks", "a month", "ten days"] }],
  ["d", "You ______ speak English all the time, {who}. You can ask questions in {lang}.",
    { who: WHO, lang: ["Uzbek", "Russian", "Uzbek or Russian", "your language"] }],
  ["d", "They ______ bring plates for the {event}. There are lots at {place}.",
    { event: ["party", "picnic", "dinner", "barbecue"], place: ["home", "the flat", "our house", "Grandma's house"] }],
].map(([k, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: KEY[k], why: WHY[k], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NEC = "Rewrite with don't have to or doesn't have to.";
const BAN = "Rewrite with mustn't.";
const COR = "Correct the mistake: choose mustn't, don't have to or doesn't have to.";
const TRANSFORM = [
  // It isn't necessary -> don't / doesn't have to (5)
  [NEC, "d", "There's no need for you to bring a {thing}, {name}.", "You ______ bring a {thing}, {name}.",
    { thing: ["pen", "towel", "dictionary", "notebook"], name: NAME }],
  [NEC, "hd", "It isn't necessary for {name} to pay for the {thing}. It's a present.", "{name} ______ pay for the {thing}. It's a present.",
    { name: NAME, thing: ["book", "cake", "ticket", "bag"] }],
  [NEC, "d", "We don't need to wear our {thing} tomorrow, {name}. It's sports day.", "We ______ wear our {thing} tomorrow, {name}. It's sports day.",
    { thing: ["school uniform", "ties", "jackets", "school shoes"], name: NAME }],
  [NEC, "hd", "It isn't necessary for {who} to cook tonight. We're eating at {place}.", "{who} ______ cook tonight. We're eating at {place}.",
    { who: ["Dad", "Mum", "Grandma", "Uncle Bobur"], place: ["a café", "our neighbours'", "a restaurant", "Aunt Lola's"] }],
  [NEC, "d", "They don't need to learn all the {words} today, {name}.", "They ______ learn all the {words} today, {name}.",
    { words: ["words", "verbs", "rules", "phrases"], name: NAME }],
  // … isn't allowed -> mustn't (5)
  [BAN, "m", "Running by the {place} isn't allowed, {who}.", "You ______ run by the {place}, {who}.",
    { place: ["pool", "river", "lake", "road"], who: WHO }],
  [BAN, "m", "Food isn't allowed in the {room}, {who}.", "You ______ eat in the {room}, {who}.",
    { room: ["computer room", "library", "science room", "museum"], who: WHO }],
  [BAN, "m", "Phones aren't allowed during the {event}, {name}.", "You ______ use your phone during the {event}, {name}.",
    { event: ["exam", "test", "concert", "film"], name: NAME }],
  [BAN, "m", "Parking isn't allowed in front of the {place}, {who}.", "You ______ park in front of the {place}, {who}.",
    { place: ["gate", "school", "hospital", "shop"], who: ADULT }],
  [BAN, "m", "Swimming isn't allowed in the {water}, {name}.", "You ______ swim in the {water}, {name}.",
    { water: ["river", "lake", "pond", "canal"], name: NAME }],
  // correct the wrong choice (5)
  [COR, "d", "You mustn't pay for the {thing}, {name}. It's free.", "You ______ pay for the {thing}, {name}. It's free.",
    { thing: ["coffee", "tea", "water", "bread"], name: NAME }],
  [COR, "m", "You don't have to touch the {thing}, {name}. It's very hot.", "You ______ touch the {thing}, {name}. It's very hot.",
    { thing: ["oven", "pan", "iron", "stove"], name: NAME }],
  [COR, "hd", "{name} mustn't get up early tomorrow. It's a holiday.", "{name} ______ get up early tomorrow. It's a holiday.",
    { name: NAME }],
  [COR, "m", "We don't have to tell {who} the answers, {name}. It's a test.", "We ______ tell {who} the answers, {name}. It's a test.",
    { who: ["anyone", "our friends", "the other team", "them"], name: NAME }],
  [COR, "hd", "{name} don't have to wash the {thing}. Her brother did the job.", "{name} ______ wash the {thing}. Her brother did the job.",
    { name: SHE, thing: ["car", "dishes", "floor", "windows"] }],
].map(([instr, k, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: KEY[k], why: WHY[k], slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one thing students mustn't do at your school.", "mustn't + base verb", ["exactly one sentence", "must use mustn't", "a school word"]],
  ["Write one thing you don't have to do on Sunday.", "I don't have to + base verb", ["exactly one sentence", "must use don't have to", "on Sunday"]],
  ["Write one thing people mustn't do in your home.", "mustn't + base verb", ["exactly one sentence", "must use mustn't", "a room or a family word"]],
  ["Write one thing your brother, sister or friend doesn't have to do. Use he or she.", "he / she doesn't have to + base verb", ["exactly one sentence", "doesn't have to", "a reason"]],
  ["Write one rule for a park or a pool in your town with mustn't.", "mustn't + base verb", ["exactly one sentence", "must use mustn't", "a place in your town"]],
  ["Write one sentence about the summer holidays with don't have to.", "don't have to + base verb", ["exactly one sentence", "must use don't have to", "a holiday word"]],
  ["Write two sentences about your English class: one thing you mustn't do and one thing you don't have to do.", "mustn't / don't have to", ["exactly two sentences", "mustn't once", "don't have to once"]],
  ["Write two sentences about a job you know: one thing the worker mustn't do and one thing they don't have to do.", "mustn't / doesn't have to", ["exactly two sentences", "mustn't once", "don't or doesn't have to once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare a school day and a Sunday for you. What do you have to do, and what don't you have to do?", "don't have to / mustn't", ["don't have to", "have to once", "three or four sentences"]],
  ["Write the rules for a guest in your home: what mustn't they do, and what don't they have to do?", "mustn't / don't have to", ["mustn't", "don't have to", "three or four sentences"]],
  ["Explain the rules of your school or English course to a new student.", "mustn't / don't have to", ["mustn't once", "don't have to once", "three or four sentences"]],
  ["A friend is staying at your flat for a weekend. Write a note with the house rules.", "mustn't / don't have to", ["mustn't", "you don't have to", "three or four sentences"]],
  ["What is good about the summer holidays? Write about the things you don't have to do.", "don't have to", ["don't have to twice", "a holiday word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.obligation.mustnt-vs-dont-have-to.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);