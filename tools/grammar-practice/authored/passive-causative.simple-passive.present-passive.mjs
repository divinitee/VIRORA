// Hand-authored: passive-causative / simple-passive / present-passive (A2).
// Path fill P57 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement foci: English ______ in many countries (speaks / is spoken /
// spoke / is speaking); The letters ______ every morning (deliver / are
// delivered / delivered / are delivering).
// Sibling scope: PRESENT simple passive only, is / are + past participle.
// Past passive (was / were) is P58 and never offered; active → passive with
// "by" is P59, so no transform here starts from an active sentence.
// Optional path topic: simple verbs only (made, built, spoken, written,
// cleaned, sold, grown, taught, used, kept, washed, delivered, played …).
// One right answer: every choose sentence has a present marker (every day,
// in many countries, usually, now) so the past is wrong, and a thing as the
// subject so the active is wrong. Choose never uses grow, open, close, sell
// or wash with an active option: "Cotton grows here", "The shop opens at
// nine" are correct English. Passive with is being is never offered.
// Choose, three kinds: 10 passive vs active -s / past / is + -ing (the
// placement's own options); 6 is vs are + participle (vs am / be);
// 4 participle form (is made vs is make / is maked / is making).
// Build: "Write the verb in brackets in the present passive."; no source
// prints is / are elsewhere.
// Transform: 5 correct the mistake / 5 one thing → more than one (is → are)
// / 5 make it negative (isn't / aren't + participle).
//
// Run: node tools/grammar-practice/authored/passive-causative.simple-passive.present-passive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "passive-causative", branch: "simple-passive", topic: "present-passive", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];
const BIG = ["Tashkent", "Samarkand", "Namangan", "Andijan"];
const DAY = ["Sundays", "Mondays", "Fridays", "Saturdays"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const W = {
  a: "The subject does not do the action; something is done to it. Present passive: is / are + past participle.",
  b: "One thing → is + past participle; more than one → are + past participle.",
  c: "After is / are, use the past participle: made, written, built, kept.",
  build: "Present passive: is (one thing) or are (more than one) + past participle.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CA = [
  [["is spoken", "speaks", "spoke", "is speaking"], "{lang} ______ in many countries, {name}.", { lang: ["English", "Spanish", "French", "Arabic"], name: NAME }],
  [["is made", "makes", "made", "is making"], "This {thing} ______ in {country}. Look at the label, {name}.", { thing: ["phone", "bag", "watch", "toy"], country: ["China", "Korea", "Turkey", "Germany"], name: NAME }],
  [["are cleaned", "clean", "cleaned", "are cleaning"], "The rooms in this hotel ______ every {when}, {name}.", { when: ["morning", "day", "afternoon", "evening"], name: NAME }],
  [["are delivered", "deliver", "delivered", "are delivering"], "Letters ______ every {when} in our {place}.", { when: ["morning", "day", "Monday", "afternoon"], place: ["street", "village", "town", "area"] }],
  [["is made", "makes", "made", "is making"], "Plov ______ with rice, meat and {veg}, {name}.", { veg: ["carrots", "onions", "chickpeas", "raisins"], name: NAME }],
  [["are made", "make", "made", "are making"], "These {thing} ______ by hand, {name}. That's why they're expensive.", { thing: ["carpets", "plates", "scarves", "bags"], name: NAME }],
  [["is taught", "teaches", "taught", "is teaching"], "{subj} ______ at our school from {age}.", { subj: ["English", "Chinese", "German", "Korean"], age: ["age six", "the first year", "the fifth year", "age ten"] }],
  [["is used", "uses", "used", "is using"], "This hall ______ for {use} every {when}, {name}.", { use: ["meetings", "lessons", "concerts", "exams"], when: ["week", "month", "Friday", "term"], name: NAME }],
  [["are built", "build", "built", "are building"], "Many new {thing} ______ in {city} every year.", { thing: ["flats", "houses", "schools", "roads"], city: BIG }],
  [["is written", "writes", "wrote", "is writing"], "The menu in this café ______ in {lang}, {name}.", { lang: ["English", "Russian", "Uzbek", "three languages"], name: NAME }],
];
const AGR = (pp) => [`${pp[0]} ${pp[1]}`, `${pp[0] === "is" ? "are" : "is"} ${pp[1]}`, `am ${pp[1]}`, `be ${pp[1]}`];
const CB = [
  [AGR(["is", "baked"]), "Fresh bread ______ in this bakery every {when}, {name}.", { when: ["morning", "day", "evening", "night"], name: NAME }],
  [AGR(["are", "sold"]), "{fruit} ______ by the kilo at the bazaar, {name}.", { fruit: ["Apples", "Melons", "Grapes", "Peaches"], name: NAME }],
  [AGR(["is", "grown"]), "Rice ______ in {region}, {name}.", { region: ["Khorezm", "many countries", "Asia", "the south"], name: NAME }],
  [AGR(["are", "cleaned"]), "The windows ______ every {when}, {name}.", { when: ["week", "month", "spring", "Saturday"], name: NAME }],
  [AGR(["are", "spoken"]), "Uzbek and Russian ______ in {city}, {name}.", { city: CITY, name: NAME }],
  [AGR(["is", "played"]), "This song ______ at every {event}, {name}.", { event: ["wedding", "party", "concert", "birthday"], name: NAME }],
];
const CC = [
  [["is made", "is make", "is maked", "is making"], "{thing} ______ from wood, {name}.", { thing: ["Paper", "This table", "Our door", "This box"], name: NAME }],
  [["are written", "are write", "are wrote", "are writing"], "These books ______ in {lang}, {name}.", { lang: ["English", "Russian", "Uzbek", "French"], name: NAME }],
  [["are built", "are build", "are builded", "are building"], "Houses in this village ______ of {mat}, {name}.", { mat: ["stone", "wood", "brick", "clay"], name: NAME }],
  [["are kept", "are keep", "are kepted", "are keeping"], "The {thing} ______ in the fridge, {name}.", { thing: ["eggs", "drinks", "vegetables", "medicines"], name: NAME }],
];
const CHOOSE = [
  ...CA.map(([o, p, s]) => [o, "a", p, s]),
  ...CB.map(([o, p, s]) => [o, "b", p, s]),
  ...CC.map(([o, p, s]) => [o, "c", p, s]),
].map(([base, w, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[w], slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets in the present passive (is / are + past participle).";
const BUILD = [
  ["is made", "This {thing} ______ (make) in {country}, {name}.", { thing: ["phone", "bag", "watch", "toy"], country: ["China", "Korea", "Turkey", "Germany"], name: NAME }],
  ["are grown", "Melons ______ (grow) in {region}, {name}.", { region: ["Khorezm", "many villages", "the south", "our village"], name: NAME }],
  ["is spoken", "Uzbek ______ (speak) in {city}, {name}.", { city: CITY, name: NAME }],
  ["are sold", "Fresh {fruit} ______ (sell) at the bazaar every day, {name}.", { fruit: ["apples", "grapes", "peaches", "apricots"], name: NAME }],
  ["are cleaned", "The classrooms ______ (clean) every {when}, {name}.", { when: ["evening", "day", "afternoon", "Friday"], name: NAME }],
  ["is written", "This {thing} ______ (write) in English, {name}.", { thing: ["book", "menu", "letter", "poem"], name: NAME }],
  ["are built", "Many new {thing} ______ (build) in {city} every year.", { thing: ["flats", "houses", "schools", "roads"], city: BIG }],
  ["is opened", "The gate ______ (open) at {time} every morning, {name}.", { time: ["six", "seven", "eight", "nine"], name: NAME }],
  ["are washed", "The dishes ______ (wash) after every {meal}, {name}.", { meal: ["meal", "lunch", "dinner", "party"], name: NAME }],
  ["is used", "This room ______ (use) for {use}, {name}.", { use: ["meetings", "lessons", "parties", "exams"], name: NAME }],
  ["are made", "These {thing} ______ (make) by hand in {city}.", { thing: ["carpets", "plates", "scarves", "knives"], city: CITY }],
  ["is taught", "{subj} ______ (teach) at our school, {name}.", { subj: ["English", "Chinese", "German", "Korean"], name: NAME }],
  ["are kept", "The {thing} ______ (keep) in the fridge, {name}.", { thing: ["eggs", "drinks", "vegetables", "medicines"], name: NAME }],
  ["is cooked", "At weddings, plov ______ (cook) in a big {pot}, {name}.", { pot: ["kazan", "pot", "black pot", "old pot"], name: NAME }],
  ["are delivered", "The {thing} ______ (deliver) every {when}.", { thing: ["newspapers", "letters", "parcels", "bread rolls"], when: ["morning", "day", "Monday", "week"] }],
  ["is eaten", "{food} ______ (eat) with bread in our family, {name}.", { food: ["Soup", "Shurpa", "Salad", "Kebab"], name: NAME }],
  ["are played", "{n} games ______ (play) every {when} at the club.", { n: ["Two", "Three", "Four", "Five"], when: ["Sunday", "week", "evening", "Saturday"] }],
  ["is closed", "The {shop} ______ (close) on {day}, {name}.", { shop: ["bank", "museum", "library", "post office"], day: DAY, name: NAME }],
  ["are painted", "The {thing} in our street ______ (paint) every {when}.", { thing: ["walls", "fences", "doors", "benches"], when: ["spring", "summer", "year", "autumn"] }],
  // Audit (Claude, 20 Nov): no claims about real cities.
  ["are spoken", "Many languages ______ (speak) at {place}, {name}.", { place: ["our school", "this market", "the airport", "the big bazaar"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W.build, slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const PL = "Rewrite the sentence about more than one.";
const NEG = "Make the sentence negative.";
const TRANSFORM = [
  // correct (5)
  [COR, "This {thing} is make in {country}, {name}.", "This {thing} ______ in {country}, {name}.", "is made", "After is, use the past participle: made.", { thing: ["phone", "bag", "watch", "toy"], country: ["China", "Korea", "Turkey", "Germany"], name: NAME }],
  [COR, "{lang} are spoken in many countries, {name}.", "{lang} ______ in many countries, {name}.", "is spoken", "One language → is spoken.", { lang: ["English", "Spanish", "French", "Arabic"], name: NAME }],
  [COR, "These {thing} are sell at the bazaar, {name}.", "These {thing} ______ at the bazaar, {name}.", "are sold", "After are, use the past participle: sold.", { thing: ["melons", "carpets", "plates", "spices"], name: NAME }],
  [COR, "The rooms is cleaned every {when}, {name}.", "The rooms ______ every {when}, {name}.", "are cleaned", "More than one room → are cleaned.", { when: ["morning", "day", "afternoon", "evening"], name: NAME }],
  [COR, "{subj} teaches at our school, {name}.", "{subj} ______ at our school, {name}.", "is taught", "A subject doesn't teach; it is taught.", { subj: ["English", "Chinese", "German", "Korean"], name: NAME }],
  // more than one (5)
  [PL, "This carpet is made by hand in {city}, {name}.", "These carpets ______ by hand in {city}, {name}.", "are made", "More than one → are made.", { city: CITY, name: NAME }],
  [PL, "The window is cleaned every {when}, {name}.", "The windows ______ every {when}, {name}.", "are cleaned", "More than one → are cleaned.", { when: ["week", "month", "spring", "Saturday"], name: NAME }],
  [PL, "The letter is delivered every {when}, {name}.", "The letters ______ every {when}, {name}.", "are delivered", "More than one → are delivered.", { when: ["morning", "day", "Monday", "afternoon"], name: NAME }],
  [PL, "This book is written in {lang}, {name}.", "These books ______ in {lang}, {name}.", "are written", "More than one → are written.", { lang: ["English", "Russian", "Uzbek", "French"], name: NAME }],
  [PL, "A new school is built in {city} every year, {name}.", "Two new schools ______ in {city} every year, {name}.", "are built", "More than one → are built.", { city: BIG, name: NAME }],
  // negative (5)
  [NEG, "Tea is grown in our {place}, {name}.", "Tea ______ in our {place}, {name}.", "isn't grown", "Negative: isn't (is not) + past participle.", { place: ["village", "town", "region", "garden"], name: NAME }],
  [NEG, "These {thing} are sold here, {name}.", "These {thing} ______ here, {name}.", "aren't sold", "Negative: aren't (are not) + past participle.", { thing: ["phones", "shoes", "books", "toys"], name: NAME }],
  [NEG, "{lang} is spoken in our home, {name}.", "{lang} ______ in our home, {name}.", "isn't spoken", "Negative: isn't (is not) + past participle.", { lang: ["English", "German", "French", "Turkish"], name: NAME }],
  [NEG, "The {shop} is closed on {day}.", "The {shop} ______ on {day}.", "isn't closed", "Negative: isn't (is not) + past participle.", { shop: ["bank", "museum", "library", "post office"], day: DAY }],
  [NEG, "The rooms are cleaned on {day}, {name}.", "The rooms ______ on {day}, {name}.", "aren't cleaned", "Negative: aren't (are not) + past participle.", { day: DAY, name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: fix(slots, source + hint) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a language that is spoken in your town.", "… is spoken in …", ["exactly one sentence", "is spoken", "a language word"]],
  ["Write one sentence about where your phone or bag is made.", "My … is made in …", ["exactly one sentence", "is made", "a country name"]],
  ["Write one sentence about a fruit or vegetable that is grown in your region.", "… are grown in …", ["exactly one sentence", "is or are grown", "a place word"]],
  ["Write one sentence about a dish from your country. How is it made?", "… is made with …", ["exactly one sentence", "is made", "a food word"]],
  ["Write one sentence about something that is sold at your local bazaar.", "… are sold at …", ["exactly one sentence", "is or are sold", "a thing word"]],
  ["Write one sentence about a subject that is taught at your school.", "… is taught at …", ["exactly one sentence", "is taught", "a subject word"]],
  ["Write one sentence about how often the rooms at your school are cleaned.", "The rooms are cleaned …", ["exactly one sentence", "are cleaned", "a time word"]],
  ["Write two sentences: one with is + past participle and one with are + past participle.", "… is made … / … are sold …", ["exactly two sentences", "is + past participle", "are + past participle"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your town: which languages are spoken and what is made or grown there?", "… is spoken / … are grown …", ["is + past participle", "are + past participle", "three or four sentences"]],
  ["Describe how a dish from your country is made.", "First the rice is washed …", ["the present passive twice", "a food word", "three or four sentences"]],
  ["Describe your school: what is taught, and how the rooms are used and cleaned.", "English is taught … / The rooms are cleaned …", ["is taught", "are + past participle", "three or four sentences"]],
  ["Describe a bazaar in your town: what is sold there?", "Fruit is sold … / Carpets are sold …", ["is sold", "are sold", "three or four sentences"]],
  ["Describe a famous product from your country: where it is made and where it is sold.", "… is made in … / … is sold …", ["is made", "is or are sold", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/passive-causative.simple-passive.present-passive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);