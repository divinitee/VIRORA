// Hand-authored: sentence-structure / relative-clauses / whose (B1).
// Wave C, C15 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: whose for possession in a relative clause ("That's the
// girl whose brother plays for the national team").
// Learners write "who his brother" / "which its roof" (resumptive pronoun,
// the Uzbek "akasi …" / Russian "у которой брат" pattern), "who's brother"
// (sound-alike spelling) or plain "who" / "which".
// Choose: 12 people + 4 things key whose, 4 subject clauses key who so whose
// is not always the answer. People options: whose / who / who's / which;
// thing options: whose / which / what / who's. "that" is never offered (it
// would be right on the who items, and wrong-but-close on whose items).
// Build: "Write who or whose." 14 whose / 6 who (who accepts that).
// Transform: 5 join with whose / 5 correct (who his, who's, which) /
// 5 's-possessive → whose + noun (two gaps).
//
// Run: node tools/grammar-practice/authored/sentence-structure.relative-clauses.whose.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "relative-clauses", topic: "whose", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAMEF = ["Olga", "Lola", "Madina", "Kamila"];
const NAMEM = ["Aziz", "Timur", "Bekzod", "Rustam"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const EVENT = ["party", "wedding", "concert", "meeting"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const JOB = ["doctor", "pilot", "teacher", "driver"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_WHOSE = "The noun after the gap belongs to the person or thing before it, so use whose (his / her / its / their in one word). Who's means who is.";
const W_WHO = "Here the person before the gap does the action (someone lives / works / won), and a verb follows the gap, so use who. Whose needs a noun after it.";
const P_OPT = ["whose", "who", "who's", "which"];
const T_OPT = ["whose", "which", "what", "who's"];
const W_OPT = ["who", "whose", "which", "what"]; // no who's: "who's won" = who has won, also right

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["p", "That's the girl ______ brother plays {sport} with my cousin, {name}.", { sport: ["football", "chess", "tennis", "volleyball"], name: NAME }],
  ["p", "I have a friend ______ mother is a {job}, {name}.", { job: JOB, name: NAME }],
  ["p", "The boy ______ bike broke {when} is very sad, {name}.", { when: PAST, name: NAME }],
  ["p", "We met a woman ______ son studies {subj} in {city}.", { subj: ["maths", "medicine", "music", "art"], city: CITY }],
  ["p", "Is that the man ______ car is parked outside the {place}, {name}?", { place: ["bank", "school", "shop", "café"], name: NAME }],
  ["p", "The student ______ essay won the {prize} is in my class, {name}.", { prize: ["prize", "contest", "competition", "award"], name: NAME }],
  ["p", "My neighbour, ______ dog barks all {time}, is very nice, {name}.", { time: ["night", "day", "morning", "evening"], name: NAME }],
  ["p", "I know a girl ______ parents own a {shop} in {city}.", { shop: ["café", "bakery", "shop", "hotel"], city: CITY }],
  ["p", "The teacher ______ lessons we love is leaving {when}, {name}.", { when: ["next month", "this summer", "in May", "soon"], name: NAME }],
  ["p", "My friend has a son ______ name is {son}.", { son: NAMEM }],
  ["p", "Do you know anyone ______ brother can fix a {thing}, {name}?", { thing: ["car", "laptop", "phone", "fridge"], name: NAME }],
  ["p", "The family ______ house we rented in {city} was very kind, {name}.", { city: CITY, name: NAME }],
  ["t", "We stayed in a hotel ______ rooms had a view of the {view}, {name}.", { view: ["river", "park", "mountains", "old town"], name: NAME }],
  ["t", "I bought a {thing} ______ battery lasts two days, {name}.", { thing: ["phone", "watch", "laptop", "tablet"], name: NAME }],
  ["t", "It's a {place} ______ name I can never remember, {name}.", { place: ["café", "village", "street", "shop"], name: NAME }],
  ["t", "They live in a {building} in {city} ______ roof is green.", { building: ["house", "building", "cottage", "villa"], city: CITY }],
  ["w", "The woman ______ lives above us is a {job}, {name}.", { job: JOB, name: NAME }],
  ["w", "I have a cousin ______ works at the {place}, {name}.", { place: ["bank", "airport", "hospital", "hotel"], name: NAME }],
  ["w", "The boy ______ won the {comp} is only ten, {name}.", { comp: ["race", "quiz", "match", "contest"], name: NAME }],
  ["w", "The tourists ______ visited our {place} {when} were very friendly.", { place: ["school", "village", "street", "college"], when: PAST }],
].map(([k, prompt, slots], i) => {
  const opts = k === "p" ? P_OPT : k === "t" ? T_OPT : W_OPT;
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: k === "w" ? W_WHO : W_WHOSE, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write who or whose.";
const BUILD = [
  ["whose", "I have a classmate ______ sister is a famous {job}, {name}.", { job: ["singer", "dancer", "writer", "chef"], name: NAME }],
  ["whose", "The man ______ bag I found {when} said thank you {times}.", { when: PAST, times: ["ten times", "again and again", "many times", "with a big smile"] }],
  ["whose", "That's the girl ______ dog follows her to {place}, {name}.", { place: ["school", "the shop", "the park", "the bazaar"], name: NAME }],
  ["whose", "We need a {who} ______ English is very good, {name}.", { who: ["teacher", "guide", "driver", "tutor"], name: NAME }],
  ["whose", "My aunt, ______ husband is from {city}, cooks great {food}.", { city: CITY, food: ["plov", "soup", "samsa", "manti"] }],
  ["whose", "Is this the student ______ notes you borrowed {when}, {name}?", { when: PAST, name: NAME }],
  ["whose", "The boy ______ father owns the {shop} is my friend, {name}.", { shop: ["café", "bakery", "shop", "hotel"], name: NAME }],
  ["whose", "I met a woman ______ children study at my {school}, {name}.", { school: ["school", "college", "university", "music school"], name: NAME }],
  ["whose", "A writer ______ books I love is coming to {city} {when}.", { city: CITY, when: ["next week", "in May", "this summer", "soon"] }],
  ["whose", "We bought a {thing} ______ door doesn't close, {name}.", { thing: ["fridge", "car", "cupboard", "wardrobe"], name: NAME }],
  ["whose", "I live in a street ______ name is very long, {name}.", { name: NAME }],
  ["whose", "It's a {place} ______ windows face the {view}.", { place: ["flat", "room", "house", "café"], view: ["river", "park", "mountains", "garden"] }],
  ["whose", "They have a {pet} ______ name is {pname}.", { pet: ["cat", "dog", "parrot", "rabbit"], pname: ["Max", "Bars", "Kesha", "Mila"] }],
  ["whose", "The company ______ office is next to ours is looking for new workers, {name}.", { name: NAME }],
  ["who", "The girl ______ sits next to me speaks {lang}, {name}.", { lang: ["Russian", "Korean", "Turkish", "Chinese"], name: NAME }],
  ["who", "I know a man ______ can repair old {thing}, {name}.", { thing: ["clocks", "radios", "bikes", "cameras"], name: NAME }],
  ["who", "The people ______ came to the {event} {when} were very friendly.", { event: EVENT, when: PAST }],
  ["who", "Do you know the woman ______ works in the {place}, {name}?", { place: ["bakery", "pharmacy", "library", "post office"], name: NAME }],
  ["who", "My brother is the one ______ broke the {thing}, {name}.", { thing: ["window", "vase", "cup", "lamp"], name: NAME }],
  ["who", "The children ______ helped us {when} got a {prize}.", { when: PAST, prize: ["prize", "present", "medal", "cake"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(key === "who" ? { acceptable: ["that"] } : {}), why: key === "who" ? W_WHO : W_WHOSE, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with whose.";
const COR = "Correct the mistake.";
const POSS = "Join the two sentences with whose and the noun.";
const TRANSFORM = [
  // join with whose (5)
  [JOIN, "I have a friend. His father is a {job}, {name}.", "I have a friend ______ father is a {job}, {name}.", "whose", { job: JOB, name: NAME }],
  [JOIN, "This is {name}. Her brother lives in {city}.", "This is {name}, ______ brother lives in {city}.", "whose", { name: NAMEF, city: CITY }],
  [JOIN, "We visited a {place} in {city}. Its walls are very old.", "We visited a {place} in {city} ______ walls are very old.", "whose", { place: ["museum", "palace", "castle", "library"], city: CITY }],
  [JOIN, "I met a girl. Her parents own a {shop}, {name}.", "I met a girl ______ parents own a {shop}, {name}.", "whose", { shop: ["café", "bakery", "shop", "hotel"], name: NAME }],
  [JOIN, "That's the boy. I found his {thing} {when}.", "That's the boy ______ {thing} I found {when}.", "whose", { thing: ["phone", "wallet", "keys", "bag"], when: PAST }],
  // correct (5)
  [COR, "The man who his car is red lives near the {place}, {name}.", "The man ______ car is red lives near the {place}, {name}.", "whose", { place: ["bank", "school", "park", "station"], name: NAME }],
  [COR, "I have a friend who's sister is a {job}, {name}.", "I have a friend ______ sister is a {job}, {name}.", "whose", { job: JOB, name: NAME }],
  [COR, "We stayed in a hotel which rooms were {adj}, {name}.", "We stayed in a hotel ______ rooms were {adj}, {name}.", "whose", { adj: ["huge", "clean", "cold", "tiny"], name: NAME }],
  [COR, "The girl who her bike broke {when} is sad, {name}.", "The girl ______ bike broke {when} is sad, {name}.", "whose", { when: PAST, name: NAME }],
  [COR, "My neighbour, who's dog is very big, is a {job}, {name}.", "My neighbour, ______ dog is very big, is a {job}, {name}.", "whose", { job: JOB, name: NAME }],
  // 's possessive -> whose + noun (5)
  [POSS, "That's {name}. {name}'s sister is my {who}.", "That's {name}, ______ ______ is my {who}.", ["whose", "sister"], { name: NAMEM, who: ["teacher", "doctor", "coach", "neighbour"] }],
  [POSS, "I know a girl, {name}. The girl's dog is very {adj}.", "I know a girl ______ ______ is very {adj}, {name}.", ["whose", "dog"], { name: NAME, adj: ["clever", "funny", "big", "friendly"] }],
  [POSS, "We met a man. The man's son studies in {city}, {name}.", "We met a man ______ ______ studies in {city}, {name}.", ["whose", "son"], { city: CITY, name: NAME }],
  [POSS, "This is a café. The café's owner is from {city}, {name}.", "This is a café ______ ______ is from {city}, {name}.", ["whose", "owner"], { city: CITY, name: NAME }],
  [POSS, "I have a cousin. My cousin's husband is a {job}, {name}.", "I have a cousin ______ ______ is a {job}, {name}.", ["whose", "husband"], { job: JOB, name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: W_WHOSE, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a friend whose parent has an interesting job.", "I have a friend whose … is a …", ["exactly one sentence", "whose + noun", "no his / her after whose"]],
  ["Write one sentence about a neighbour and their pet.", "My neighbour, whose … is …, …", ["exactly one sentence", "whose + noun", "a pet"]],
  ["Write one sentence about a building with something special.", "I live in a … whose … is …", ["exactly one sentence", "whose for a thing", "no which its"]],
  ["Write one sentence about a classmate whose brother or sister does something.", "… is the girl / boy whose …", ["exactly one sentence", "whose + noun", "a present verb"]],
  ["Write one sentence about a writer or singer whose work you like.", "… is a singer whose songs I …", ["exactly one sentence", "whose + noun", "no who's"]],
  ["Write one sentence about a shop or café whose owner you know.", "There's a café whose owner …", ["exactly one sentence", "whose + owner", "a place"]],
  ["Write one sentence with who and one noun clause, about a person who helps you.", "The man who … helps me …", ["exactly one sentence", "who + verb", "no whose"]],
  ["Write two sentences: one with who and one with whose.", "The girl who sits … / The boy whose …", ["exactly two sentences", "who + verb", "whose + noun"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe three people in your class or at work.", "There's a girl whose … I sit next to a boy who …", ["whose + noun", "who + verb", "three or four sentences"]],
  ["Describe your neighbours.", "Our neighbour, whose … , … The family who …", ["whose + noun", "no who his / who her", "three or four sentences"]],
  ["Describe a place you stayed on a trip.", "We stayed in a hotel whose rooms … The man who …", ["whose for a thing", "past verbs", "three or four sentences"]],
  ["Write about a famous person whose work you like.", "… is a writer whose books … I like people who …", ["whose + noun", "who + verb", "three or four sentences"]],
  ["Write about your relatives.", "I have an aunt whose … My cousin, whose …", ["whose + noun", "no who's for whose", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.relative-clauses.whose.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);