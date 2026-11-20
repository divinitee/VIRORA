// Hand-authored: nouns-articles / plurals-agreement / each-every-singular (B1).
// Wave C, C3 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: each / every + singular noun + singular verb ("Every
// student in the class has a laptop"). B1 angle: "each of the + plural noun"
// still takes a singular verb ("Each of the boys has a bike").
// Learners say "every students" (meaning is "all", so they pluralise) and
// "Every student have" (plural verb from the meaning).
// Choose: 10 verb gaps (options: -s form / base / -ing / are + base) and 10
// noun gaps (options: singular / plural / of + plural / the + plural, e.g.
// "every person / people / of people / the people").
// Every verb gap is present simple with a present cue, so the past form is
// never offered and never right. No continuous frames ("Every student is
// having lunch" would be a second right answer to a "has" key).
// Build: "Write the verb in the present simple." (rule: no tense left open).
// Transform: 5 all the + plural → every + singular (two gaps) / 5 correct the
// mistake / 5 every → each of the + plural.
//
// Run: node tools/grammar-practice/authored/nouns-articles.plurals-agreement.each-every-singular.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "plurals-agreement", topic: "each-every-singular", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const det = (t) => (/\bEach of\b/i.test(t) ? "Each of" : /\bEach\b/.test(t) ? "Each" : "Every");
const WHYV = (t, v) => det(t) === "Each of"
  ? `Each of + a plural noun still means one by one, so the verb is singular: ${v}.`
  : `${det(t)} + a singular noun takes a singular verb: ${v}.`;
const WHYN = (t, n) => `${det(t)} is followed by a singular noun (${n}), never a plural.`;

/* ---------------- choose: 20 mcq ---------------- */
// verb rows: ["v", [right, base, ing, are+base], sentence, slots]
// noun rows: ["n", [sg, pl], sentence, slots]
const CHOOSE = [
  ["v", ["has", "have", "having", "are have"], "Every student in our {group} ______ a laptop, {name}.", { group: ["group", "class", "team", "course"], name: NAME }],
  ["n", ["room", "rooms"], "Each ______ has its own number in this {place}.", { place: ["hotel", "hospital", "hostel", "school"], x: [] }],
  ["v", ["goes", "go", "going", "are go"], "Every child in my {place} ______ to school by bus, {name}.", { place: ["village", "street", "building", "family"], name: NAME }],
  ["n", ["student", "students"], "Every ______ in our class has a {thing}, {name}.", { thing: ["phone", "laptop", "tablet", "dictionary"], name: NAME }],
  ["v", ["trains", "train", "training", "are train"], "Each player on our {sport} team ______ {n} hours a week.", { sport: ["football", "basketball", "volleyball", "handball"], n: ["ten", "eight", "six", "twelve"] }],
  ["n", ["child", "children"], "Each ______ gets a small present at the {event}, {name}.", { event: ["party", "concert", "festival", "wedding"], name: NAME }],
  ["v", ["leaves", "leave", "leaving", "are leave"], "Every bus to {city} ______ from Gate {n}.", { city: ["Samarkand", "Bukhara", "Khiva", "Nukus"], n: ["2", "3", "5", "7"] }],
  ["n", ["house", "houses"], "Every ______ on this street is {colour}, {name}.", { colour: ["white", "blue", "green", "yellow"], name: NAME }],
  ["v", ["has", "have", "having", "are have"], "Each of the boys in my {place} ______ his own bike.", { place: ["street", "class", "family", "building"], x: [] }],
  ["n", ["person", "people"], "Every ______ in my family can {skill}, {name}.", { skill: ["swim", "cook", "drive", "dance"], name: NAME }],
  ["v", ["likes", "like", "liking", "are like"], "Each of my friends ______ a different {thing}, {name}.", { thing: ["sport", "singer", "film", "game"], name: NAME }],
  ["n", ["plant", "plants"], "Each ______ in the {place} needs water every day, {name}.", { place: ["garden", "classroom", "kitchen", "yard"], name: NAME }],
  ["v", ["opens", "open", "opening", "are open"], "Every shop in the {place} ______ at nine o'clock, {name}.", { place: ["bazaar", "mall", "square", "old town"], name: NAME }],
  ["n", ["guest", "guests"], "Every ______ at the {event} got a {thing}.", { event: ["wedding", "party", "concert", "dinner"], thing: ["piece of cake", "small present", "flower", "cup of tea"] }],
  ["v", ["speaks", "speak", "speaking", "are speak"], "Every teacher at our {school} ______ English, {name}.", { school: ["school", "college", "lyceum", "language school"], name: NAME }],
  ["n", ["day", "days"], "Every ______ of the week is busy for {name}.", { name: NAME, x: [] }],
  ["v", ["is", "are", "be", "being"], "Each room in the {place} ______ clean and quiet, {name}.", { place: ["hotel", "hostel", "hospital", "guest house"], name: NAME }],
  ["n", ["question", "questions"], "Each ______ in the {test} has four answers, {name}.", { test: ["exam", "quiz", "test", "workbook"], name: NAME }],
  ["v", ["costs", "cost", "costing", "are cost"], "Each of these {things} ______ {price} soum now.", { things: ["bags", "shirts", "books", "cups"], price: ["fifty thousand", "twenty thousand", "ten thousand", "thirty thousand"] }],
  ["n", ["park", "parks"], "Every ______ in this city has a {thing}, {name}.", { thing: ["café", "fountain", "playground", "small lake"], name: NAME }],
].map(([kind, o, prompt, slots], i) => {
  const base = kind === "v" ? o : [o[0], o[1], `of ${o[1]}`, `the ${o[1]}`];
  const options = rot(base, i);
  const why = kind === "v" ? WHYV(prompt, o[0]) : WHYN(prompt, o[0]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in the present simple.";
const BUILD = [
  ["wears", "Every student in our {group} ______ (wear) a uniform, {name}.", { group: ["class", "school", "lyceum", "college"], name: NAME }],
  ["plays", "Each of my brothers ______ (play) the {instr}, {name}.", { instr: ["guitar", "piano", "dutar", "violin"], name: NAME }],
  ["has", "Every flat in this {building} ______ (have) a balcony, {name}.", { building: ["building", "block", "tower", "house"], name: NAME }],
  ["gets", "Each child ______ (get) a free book at our {place}, {name}.", { place: ["school", "library", "club", "kindergarten"], name: NAME }],
  ["stops", "Every bus in our town ______ (stop) at the {place}, {name}.", { place: ["market", "station", "bazaar", "hospital"], name: NAME }],
  ["wants", "Each of the girls in my {group} ______ (want) to be a {job}.", { group: ["class", "family", "team", "street"], job: ["doctor", "teacher", "singer", "pilot"] }],
  ["needs", "Every player ______ (need) a ball and a {thing}, {name}.", { thing: ["towel", "water bottle", "pair of shoes", "T-shirt"], name: NAME }],
  ["is", "Each room ______ (be) ready for the {who}, {name}.", { who: ["guests", "students", "visitors", "new family"], name: NAME }],
  ["grows", "Every family in our {place} ______ (grow) {crop} in the garden.", { place: ["street", "village", "mahalla", "area"], crop: ["tomatoes", "apples", "grapes", "melons"] }],
  ["brings", "Each of us ______ (bring) some {food} to the picnic, {name}.", { food: ["bread", "fruit", "salad", "juice"], name: NAME }],
  ["works", "Every computer in the {room} ______ (work) well now, {name}.", { room: ["lab", "library", "classroom", "office"], name: NAME }],
  ["gives", "Each teacher ______ (give) us homework every {day}, {name}.", { day: ["day", "week", "lesson", "Monday"], name: NAME }],
  ["sells", "Every shop on this street ______ (sell) {goods}, {name}.", { goods: ["fruit", "clothes", "phones", "shoes"], name: NAME }],
  ["costs", "Each of the {things} ______ (cost) {price} soum.", { things: ["bags", "shirts", "books", "cups"], price: ["fifty thousand", "twenty thousand", "ten thousand", "thirty thousand"] }],
  ["speaks", "Every child in this {place} ______ (speak) two languages, {name}.", { place: ["class", "village", "family", "group"], name: NAME }],
  ["lives", "Each of my friends ______ (live) near the {place}, {name}.", { place: ["park", "bazaar", "station", "river"], name: NAME }],
  ["starts", "Every lesson ______ (start) at {time}, {name}.", { time: ["eight", "nine", "half past eight", "ten"], name: NAME }],
  ["comes", "Each phone in this shop ______ (come) with a {thing}.", { thing: ["case", "charger", "free bag", "small gift"], x: [] }],
  ["pays", "Every person in the {group} ______ (pay) for the bus, {name}.", { group: ["club", "team", "group", "class"], name: NAME }],
  ["does", "Each of the boys ______ (do) his homework {when}, {name}.", { when: ["after school", "in the evening", "before dinner", "on Sunday"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHYV(source, key), slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ALL = "Rewrite with every. Keep the meaning.";
const COR = "Correct the mistake.";
const EOF = "Rewrite with each of the … . Keep the meaning.";
const TRANSFORM = [
  // all the + plural -> every + singular (5)
  [ALL, "All the students in our {group} have a phone, {name}.", "Every ______ in our {group} ______ a phone, {name}.", ["student", "has"], "Every + singular noun + singular verb: every student has.", { group: ["group", "class", "team", "course"], name: NAME }],
  [ALL, "All the rooms in this {place} are clean, {name}.", "Every ______ in this {place} ______ clean, {name}.", ["room", "is"], "Every + singular noun + singular verb: every room is.", { place: ["hotel", "school", "hostel", "hospital"], name: NAME }],
  [ALL, "All the children in my {place} go to school by bus, {name}.", "Every ______ in my {place} ______ to school by bus, {name}.", ["child", "goes"], "Every + singular noun + singular verb: every child goes.", { place: ["village", "street", "building", "family"], name: NAME }],
  [ALL, "All the shops on our street open at {time}, {name}.", "Every ______ on our street ______ at {time}, {name}.", ["shop", "opens"], "Every + singular noun + singular verb: every shop opens.", { time: ["eight", "nine", "ten", "half past nine"], name: NAME }],
  [ALL, "All the players wear a {colour} shirt, {name}.", "Every ______ ______ a {colour} shirt, {name}.", ["player", "wears"], "Every + singular noun + singular verb: every player wears.", { colour: ["red", "blue", "white", "green"], name: NAME }],
  // correct the mistake (5)
  [COR, "Every students in my {group} likes {thing}.", "Every ______ in my {group} likes {thing}.", "student", "Every is followed by a singular noun: every student.", { group: ["class", "family", "team", "group"], thing: ["football", "music", "chess", "games"] }],
  [COR, "Each of the boys have a {thing}, {name}.", "Each of the boys ______ a {thing}, {name}.", "has", "Each of + a plural noun still takes a singular verb: has.", { thing: ["bike", "phone", "ball", "dog"], name: NAME }],
  [COR, "Every child in our {place} are very {adj}.", "Every child in our {place} ______ very {adj}.", "is", "Every child is singular, so use is.", { place: ["class", "street", "family", "village"], adj: ["friendly", "clever", "funny", "kind"] }],
  [COR, "Each of my friends live in {city}, {name}.", "Each of my friends ______ in {city}, {name}.", "lives", "Each of + a plural noun still takes a singular verb: lives.", { city: ["Tashkent", "Bukhara", "Andijan", "Termez"], name: NAME }],
  [COR, "Every houses on our street has a {thing}, {name}.", "Every ______ on our street has a {thing}, {name}.", "house", "Every is followed by a singular noun: every house.", { thing: ["garden", "gate", "tree", "balcony"], name: NAME }],
  // every -> each of the + plural (5)
  [EOF, "Every boy in my {group} has a {thing}.", "Each of the ______ in my {group} ______ a {thing}.", ["boys", "has"], "Each of the + plural noun, but the verb stays singular: each of the boys has.", { group: ["class", "family", "team", "street"], thing: ["bike", "phone", "ball", "tablet"] }],
  [EOF, "Every girl in the {team} plays {sport}.", "Each of the ______ in the {team} ______ {sport}.", ["girls", "plays"], "Each of the + plural noun, but the verb stays singular: each of the girls plays.", { team: ["club", "class", "group", "family"], sport: ["volleyball", "chess", "tennis", "basketball"] }],
  [EOF, "Every room has a {thing}, {name}.", "Each of ______ a {thing}, {name}.", "the rooms has", "Each of the + plural noun, but the verb stays singular: each of the rooms has.", { thing: ["window", "desk", "bed", "lamp"], name: NAME }],
  [EOF, "Every child needs a {thing} for the trip, {name}.", "Each of the ______ ______ a {thing} for the trip, {name}.", ["children", "needs"], "Each of the + plural noun, but the verb stays singular: each of the children needs.", { thing: ["hat", "bottle of water", "jacket", "bag"], name: NAME }],
  [EOF, "Every teacher at our {school} knows my {who}.", "Each of the ______ at our {school} ______ my {who}.", ["teachers", "knows"], "Each of the + plural noun, but the verb stays singular: each of the teachers knows.", { school: ["school", "college", "lyceum", "club"], who: ["name", "brother", "mother", "sister"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about every student in your class or group.", "Every student in my … has / likes …", ["exactly one sentence", "every + singular noun", "a singular verb"]],
  ["Write one sentence about your family with each of.", "Each of my … has / lives …", ["exactly one sentence", "each of + plural noun", "a singular verb"]],
  ["Write one sentence about the rooms in your home.", "Each room in my home has …", ["exactly one sentence", "each + singular noun", "has"]],
  ["Write one sentence about a rule at your school or work.", "Every student / worker has to …", ["exactly one sentence", "every + singular noun", "has to"]],
  ["Write one sentence about your friends and what they like.", "Each of my friends likes …", ["exactly one sentence", "each of + plural noun", "likes"]],
  ["Write one sentence about the shops or buses in your town.", "Every bus / shop … opens / stops …", ["exactly one sentence", "every + singular noun", "a present verb with -s"]],
  ["Write one sentence about a holiday when every person in your family does something.", "Every person in my family …", ["exactly one sentence", "every person", "a singular verb"]],
  ["Write two sentences: one with every and one with each of.", "Every … has … / Each of the … is …", ["exactly two sentences", "every + singular noun", "each of + plural noun with a singular verb"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your class or group: what does every student do or have?", "Every student … / Each of us …", ["every or each + singular verb", "two different verbs", "three or four sentences"]],
  ["Describe your family's morning: what does each person do?", "Each person in my family … / Every morning …", ["each + singular noun", "singular verbs", "three or four sentences"]],
  ["Describe the rules of a sport or game you play.", "Each player has … / Every team needs …", ["each or every", "has / needs", "three or four sentences"]],
  ["Describe your street or building.", "Every house / flat has … / Each of the neighbours …", ["every + singular noun", "each of + plural noun", "three or four sentences"]],
  ["Describe a celebration: what does every guest get or do?", "Every guest gets … / Each child …", ["every or each", "singular verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/nouns-articles.plurals-agreement.each-every-singular.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);