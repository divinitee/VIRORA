// Hand-authored: sentence-structure / predication / be-am-is-are (A1).
//
// Placement foci: am with I, is with a singular subject, are with a plural
// subject, are with a compound subject ("my brother and I"). The subject is
// never slotted. Choose: am 4, is 6, are 5, compound 5; distractors the two
// other forms + "be" (bare be). Build: cue (be). Transform kinds: singular →
// plural (5), new subject I/he/she (5), add a second person → compound (5).
//
// Run: node tools/grammar-practice/authored/sentence-structure.predication.be-am-is-are.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "predication", topic: "be-am-is-are", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const W = {
  am: "The subject is I, so use am.",
  is: "The subject is one person or thing (he, she, it), so use is.",
  are: "The subject is plural (or you), so use are.",
  and: "Two people joined with and are a plural subject, so use are.",
};
const O = { am: ["am", "is", "are", "be"], is: ["is", "are", "am", "be"], are: ["are", "is", "am", "be"], and: ["are", "is", "am", "be"] };
const K = (t) => (t === "and" ? "are" : t);

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["am", "I ______ from {city}, {name}.", { city: CITY, name: NAME }],
  ["am", "I ______ {age} years old, {name}.", { age: ["twelve", "fifteen", "eighteen", "twenty"], name: NAME }],
  ["am", "I ______ hungry. Can we have {food}, {name}?", { food: ["plov", "soup", "samsa", "pizza"], name: NAME }],
  ["am", "I ______ in the {room} now, {name}.", { room: ["kitchen", "garden", "library", "car"], name: NAME }],
  ["is", "My sister ______ a {job}, {name}.", { job: ["nurse", "teacher", "driver", "doctor"], name: NAME }],
  ["is", "The bank ______ next to the {place}, {name}.", { place: ["bazaar", "park", "school", "hotel"], name: NAME }],
  ["is", "Kamron ______ in {subject} class now, {name}.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["is", "It ______ {adj} today in {city}.", { adj: ["sunny", "cold", "hot", "windy"], city: CITY }],
  ["is", "Our teacher ______ very {adj}, {name}.", { adj: ["kind", "strict", "funny", "friendly"], name: NAME }],
  ["is", "My phone ______ in my {bag}, {name}.", { bag: ["bag", "pocket", "jacket", "car"], name: NAME }],
  ["are", "My parents ______ at {place} now, {name}.", { place: ["home", "work", "the bazaar", "the doctor's"], name: NAME }],
  ["are", "The books ______ on the {furniture}, {name}.", { furniture: ["shelf", "table", "desk", "chair"], name: NAME }],
  ["are", "My friends ______ in {city} this week, {name}.", { city: CITY, name: NAME }],
  ["are", "The children ______ in the {place}, {name}.", { place: ["garden", "yard", "park", "pool"], name: NAME }],
  ["are", "You ______ late again, {name}! The lesson starts at {hour}.", { hour: ["eight", "nine", "ten", "two"], name: NAME }],
  ["and", "My brother and I ______ at the {place}, {name}.", { place: ["gym", "cinema", "bazaar", "park"], name: NAME }],
  ["and", "Sardor and Lola ______ in the same {group}, {name}.", { group: ["class", "team", "group", "club"], name: NAME }],
  ["and", "My mum and dad ______ from {city}, {name}.", { city: CITY, name: NAME }],
  ["and", "Nodir and I ______ {adj} today, {name}.", { adj: ["tired", "busy", "happy", "hungry"], name: NAME }],
  ["and", "Kamila and her sister ______ at {place}, {name}.", { place: ["home", "school", "the bazaar", "the station"], name: NAME }],
].map(([t, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: O[t], key: 0, why: W[t], slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write am, is or are.";
const BUILD = [
  ["am", "I ______ (be) at the {place} with my mum, {name}.", { place: ["bazaar", "doctor's", "bank", "station"], name: NAME }],
  ["am", "I ______ (be) very {adj} today, {name}.", { adj: ["tired", "happy", "busy", "sleepy"], name: NAME }],
  ["am", "I ______ (be) good at {subject}, {name}.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["is", "Sardor ______ (be) at the {place}, {name}.", { place: ["gym", "pool", "library", "shop"], name: NAME }],
  ["is", "My grandma ______ (be) {age} years old, {name}.", { age: ["sixty", "seventy", "seventy-five", "eighty"], name: NAME }],
  ["is", "The weather ______ (be) {adj} in {city}.", { adj: ["nice", "cold", "hot", "warm"], city: CITY }],
  ["is", "Our flat ______ (be) on the {floor} floor, {name}.", { floor: ["second", "third", "fifth", "ninth"], name: NAME }],
  ["is", "The museum ______ (be) closed on {day}, {name}.", { day: ["Monday", "Tuesday", "Sunday", "Saturday"], name: NAME }],
  ["is", "My cat ______ (be) under the {furniture}, {name}.", { furniture: ["bed", "table", "sofa", "chair"], name: NAME }],
  ["is", "Our classroom ______ (be) next to the {room}, {name}.", { room: ["library", "canteen", "gym", "office"], name: NAME }],
  ["are", "My cousins ______ (be) in {city} now, {name}.", { city: CITY, name: NAME }],
  ["are", "The keys ______ (be) in the {place}, {name}.", { place: ["drawer", "car", "bag", "kitchen"], name: NAME }],
  ["are", "We ______ (be) ready for the {event}, {name}.", { event: ["test", "match", "trip", "concert"], name: NAME }],
  ["are", "They ______ (be) at the {place} with their dad, {name}.", { place: ["bazaar", "park", "airport", "cinema"], name: NAME }],
  ["are", "The shops ______ (be) open until {hour}, {name}.", { hour: ["eight", "nine", "ten", "eleven"], name: NAME }],
  ["and", "My dad and I ______ (be) {sport} fans, {name}.", { sport: ["football", "chess", "tennis", "volleyball"], name: NAME }],
  ["and", "Nodir and Zarina ______ (be) at the {place}, {name}.", { place: ["station", "bus stop", "gate", "library"], name: NAME }],
  ["and", "You and your brother ______ (be) very {adj}, {name}.", { adj: ["tall", "kind", "funny", "quiet"], name: NAME }],
  ["and", "My sister and I ______ (be) in the {room}, {name}.", { room: ["kitchen", "garden", "living room", "yard"], name: NAME }],
  ["and", "Olga and her friend ______ (be) late for {event}, {name}.", { event: ["school", "the lesson", "the bus", "work"], name: NAME }],
].map(([t, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: K(t), why: W[t], slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_PL = "Make the subject plural. Write one word in the gap.";
const T_NEW = "Write the sentence with the new subject. Write one word in the gap.";
const T_AND = "Add a second person to the subject. Write one word in the gap.";
const TRANSFORM = [
  [T_PL, "My brother is at the {place}, {name}.", "My brothers ______ at the {place}, {name}.", "are", { place: ["gym", "bazaar", "park", "station"], name: NAME }],
  [T_PL, "The book is on the {furniture}, {name}.", "The books ______ on the {furniture}, {name}.", "are", { furniture: ["shelf", "table", "desk", "bed"], name: NAME }],
  [T_PL, "My friend is from {city}, {name}.", "My friends ______ from {city}, {name}.", "are", { city: CITY, name: NAME }],
  [T_PL, "This apple is {adj}, {name}.", "These apples ______ {adj}, {name}.", "are", { adj: ["red", "sweet", "cheap", "fresh"], name: NAME }],
  [T_PL, "The child is in the {room}, {name}.", "The children ______ in the {room}, {name}.", "are", { room: ["garden", "kitchen", "yard", "classroom"], name: NAME }],
  [T_NEW, "Aziz is hungry. He wants {food}, {name}.", "I ______ hungry. I want {food}, {name}.", "am", { food: ["plov", "soup", "bread", "rice"], name: NAME }],
  [T_NEW, "My sister is {age} years old, {name}.", "I ______ {age} years old, {name}.", "am", { age: ["twelve", "fourteen", "sixteen", "nineteen"], name: NAME }],
  [T_NEW, "You are in {subject} class now, {name}.", "I ______ in {subject} class now, {name}.", "am", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [T_NEW, "They are at the {place} now, {name}.", "She ______ at the {place} now, {name}.", "is", { place: ["gym", "pool", "library", "bank"], name: NAME }],
  [T_NEW, "We are from {city}, {name}.", "Jasur ______ from {city}, {name}.", "is", { city: CITY, name: NAME }],
  [T_AND, "My brother is at {place}, {name}.", "My brother and I ______ at {place}, {name}.", "are", { place: ["home", "school", "work", "the gym"], name: NAME }],
  [T_AND, "Malika is very {adj}, {name}.", "Malika and Olga ______ very {adj}, {name}.", "are", { adj: ["kind", "tall", "funny", "busy"], name: NAME }],
  [T_AND, "I am {adj} today, {name}.", "My friend and I ______ {adj} today, {name}.", "are", { adj: ["tired", "happy", "busy", "free"], name: NAME }],
  [T_AND, "Timur is in the {group}, {name}.", "Timur and Nodir ______ in the {group}, {name}.", "are", { group: ["team", "club", "class", "choir"], name: NAME }],
  [T_AND, "My mum is in the {room}, {name}.", "My mum and dad ______ in the {room}, {name}.", "are", { room: ["kitchen", "garden", "car", "shop"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: key === "am" ? W.am : key === "is" ? W.is : source !== hint && hint.includes(" and ") ? W.and : W.are, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write about yourself: your age or your city. Use I am.", "I am", ["exactly one sentence", "must use am"]],
  ["Write about a person in your family. Use is.", "is", ["exactly one sentence", "must use is"]],
  ["Write where your friends are now. Use are.", "are", ["exactly one sentence", "must use are"]],
  ["Write about you and a friend. Use … and I are.", "and I are", ["exactly one sentence", "must use and I are"]],
  ["Write about your town. Use It is.", "It is", ["exactly one sentence", "must use is"]],
  ["Write one sentence with am, one with is and one with are.", "am / is / are", ["exactly three sentences", "must use am, is and are"]],
  ["Write about two things in your bag. Use are.", "are", ["exactly one sentence", "plural subject + are"]],
  ["Write about your teacher. Use is.", "is", ["exactly one sentence", "must use is"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Introduce yourself: your name, age and city.", "am", ["I am", "I'm"]],
  ["Describe your family: who they are and where they are now.", "is / are", ["is", "are"]],
  ["Describe your classroom: what is in it and where things are.", "is / are", ["is", "are"]],
  ["Write about you and your best friend.", "and I are", ["and I are", "is"]],
  ["Describe your town for a visitor.", "is / are", ["It is", "are"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/sentence-structure.predication.be-am-is-are.json", JSON.stringify(items, null, 1) + "\n");