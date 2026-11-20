// Hand-authored: modals / obligation / must (A2).
// Path fill P17 (2026-11-14, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: "must for strong obligation" (You ______ wear a seatbelt
// in a car: must / might / could / would). Rules, signs and strong personal
// duties.
// Choose, two kinds: 6 meaning items (must vs might / could / would, the
// placement's own distractors; each sentence is a rule, a law or a sign, so
// only must says "necessary"); 14 form items (must + base verb: must to,
// musts, must + -s / -ing / past are the errors; must never changes for
// he / she / it). NEVER offered: should, have to, need to, can (often right
// too), and mustn't (the next stop, P18, contrasts mustn't / don't have to).
// Build: "Write must and the verb in brackets in the right form."; the cue is
// the -s, -ing or be form, and the learner types must + base verb.
// Transform: 5 correct the mistake / 5 order → rule with You must /
// 5 "It's necessary for … to …" → must.
//
// Run: node tools/grammar-practice/authored/modals.obligation.must.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "obligation", topic: "must", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const WHO = ["class", "everyone", "children", "students"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const MEAN = ["must", "might", "could", "would"];
const W_MEAN = "This is a rule: it is necessary and there is no choice, so use must.";
// he / she / it subjects get the -s errors; I / we / you / they get -ing / past.
const FORM3 = (v, s) => [`must ${v}`, `musts ${v}`, `must ${s}`, `must to ${v}`];
const FORMP = (v, ing, past) => [`must ${v}`, `must to ${v}`, `must ${ing}`, `must ${past}`];
const W_FORM = (v) => `After must, use the base verb, with no to, -s or -ing: must ${v}. Must is the same for every person.`;

/* ---------------- choose: 20 mcq ---------------- */
// [options, verb for why or null, prompt, slots]
const CHOOSE = [
  [MEAN, null, "You ______ wear a seatbelt in the {seat}, {name}. That's Dad's rule.",
    { seat: ["front seat", "back seat", "car", "new car"], name: NAME }],
  [MEAN, null, "Visitors ______ show their {doc} at the entrance of the {place}. It's the rule.",
    { doc: ["ticket", "pass", "e-ticket", "student card"], place: ["museum", "theatre", "zoo", "gallery"] }],
  [MEAN, null, "Students ______ turn off their {device} in the {room}. It's a school rule.",
    { device: ["phones", "tablets", "laptops", "music players"], room: ["exam room", "library", "computer room", "science room"] }],
  [MEAN, null, "You ______ wear a helmet when you ride a {vehicle}, {name}. It's the rule here.",
    { vehicle: ["bike", "scooter", "horse", "motorbike"], name: NAME }],
  [MEAN, null, "Passengers ______ buy a ticket before they get on the {train}. The sign says so.",
    { train: ["train", "fast train", "night train", "train to Bukhara"] }],
  [MEAN, null, "Swimmers ______ take a shower before they go into the {pool}. The sign says so.",
    { pool: ["pool", "water", "big pool", "children's pool"] }],
  [FORMP("call", "calling", "called"), "call", "I ______ my {who} tonight, {name}. It's her birthday.",
    { who: ["grandma", "aunt", "mum", "sister"], name: NAME }],
  [FORM3("finish", "finishes"), "finish", "{name} ______ his {task} before dinner. His mum says so.",
    { name: HE, task: ["homework", "essay", "project", "maths exercises"] }],
  [FORM3("take", "takes"), "take", "{name} ______ her passport for the trip to {city}.",
    { name: SHE, city: ["Moscow", "Istanbul", "Seoul", "Dubai"] }],
  [FORMP("leave", "leaving", "left"), "leave", "We ______ now, {name}. The {bus} goes in five minutes.",
    { name: NAME, bus: ["bus", "train", "tram", "minibus"] }],
  [["must be", "must to be", "must are", "must being"], "be", "You ______ quiet in the {place}, {who}.",
    { place: ["library", "hospital", "museum", "exam room"], who: ["children", "everyone", "class", "boys"] }],
  [FORM3("go", "goes"), "go", "The {pet} ______ to the vet today. It's {state}.",
    { pet: ["cat", "dog", "rabbit", "parrot"], state: ["ill", "not eating", "hurt", "sick"] }],
  [FORM3("get", "gets"), "get", "My {who} ______ up at five tomorrow. His {transport} leaves at seven.",
    { who: ["dad", "uncle", "brother", "grandpa"], transport: ["flight", "train", "bus", "plane"] }],
  [FORMP("write", "writing", "wrote"), "write", "Students ______ their answers in {colour} pen on the {paper}.",
    { colour: ["blue", "black", "dark blue", "black or blue"], paper: ["test", "answer sheet", "form", "exam paper"] }],
  [FORMP("wash", "washing", "washed"), "wash", "You ______ your hands before you {cook}, {name}.",
    { cook: ["cook", "make bread", "touch the food", "cut the vegetables"], name: NAME }],
  [FORMP("study", "studying", "studied"), "study", "I really ______ this evening, {name}. I've got a big {test} tomorrow.",
    { name: NAME, test: ["test", "exam", "dictation", "presentation"] }],
  [FORM3("take", "takes"), "take", "{name} ______ her medicine {freq}. The doctor says so.",
    { name: SHE, freq: ["twice a day", "three times a day", "every morning", "after meals"] }],
  [FORMP("tidy", "tidying", "tidied"), "tidy", "We ______ the classroom before the {event}, {name}.",
    { event: ["parents' meeting", "concert", "open day", "exam"], name: NAME }],
  [FORMP("wear", "wearing", "wore"), "wear", "The {sport} players ______ the same {colour} shirts. It's a team rule.",
    { sport: ["football", "volleyball", "basketball", "handball"], colour: ["red", "blue", "white", "green"] }],
  [FORMP("take", "taking", "took"), "take", "Guests ______ off their shoes in our {room}, {name}. It's a family rule.",
    { room: ["house", "flat", "living room", "home"], name: NAME }],
].map(([base, v, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: v ? W_FORM(v) : W_MEAN, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write must and the verb in brackets in the right form.";
const WB = (v) => `After must, use the base verb: must ${v}. No to, no -s, no -ing.`;
const BUILD = [
  ["go", "{name} ______ (goes) to the dentist {when}. Her tooth hurts.",
    { name: SHE, when: ["today", "this afternoon", "tomorrow morning", "after school"] }],
  ["stop", "Drivers ______ (stops) at a red light in {city}.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  ["buy", "We ______ (buying) a present for {who}. It's her birthday on {day}.",
    { who: ["Grandma", "Mum", "our teacher", "Aunt Lola"], day: ["Friday", "Saturday", "Sunday", "Monday"] }],
  ["learn", "I ______ (learning) these {n} words for the test, {name}.",
    { n: ["ten", "twenty", "thirty", "fifty"], name: NAME }],
  ["wear", "My {who} ______ (wears) a uniform at his new {place}.",
    { who: ["brother", "cousin", "uncle", "dad"], place: ["job", "shop", "hotel", "café"] }],
  ["be", "The {who} ______ (are) home before {time}. Their mum says so.",
    { who: ["children", "boys", "girls", "twins"], time: ["dark", "eight o'clock", "nine", "dinner"] }],
  ["take", "You ______ (takes) your {doc} to the exam, {who}.",
    { doc: ["ID card", "pen", "student card", "pencil case"], who: WHO }],
  ["drink", "Your sister ______ (drinking) more water, {name}. The {who} says so.",
    { name: NAME, who: ["doctor", "nurse", "coach", "teacher"] }],
  ["clean", "We ______ (cleans) the {room} before {who} arrives.",
    { room: ["kitchen", "living room", "flat", "house"], who: ["Grandma", "Grandpa", "our aunt", "Uncle Bobur"] }],
  ["get", "I ______ (gets) to the station by {time}, {name}. My train leaves ten minutes later.",
    { time: ["six", "seven", "eight", "ten"], name: NAME }],
  ["play", "Aziz ______ (plays) the {instrument} every day. His {event} is next week.",
    { instrument: ["piano", "guitar", "violin", "drums"], event: ["concert", "exam", "show", "competition"] }],
  ["show", "Passengers ______ (showing) their {doc} at the {place}.",
    { doc: ["tickets", "passports", "boarding passes", "ID cards"], place: ["airport", "gate", "check-in desk", "boarding gate"] }],
  ["wash", "You ______ (washes) the {fruit} before you eat it, {name}.",
    { fruit: ["apple", "pear", "peach", "plum"], name: NAME }],
  ["finish", "{name} ______ (finishes) her {task} tonight. It's for tomorrow's lesson.",
    { name: SHE, task: ["essay", "project", "homework", "report"] }],
  ["keep", "Everybody ______ (keeping) the {room} clean. It's a school rule.",
    { room: ["classroom", "canteen", "library", "gym"] }],
  ["turn", "You ______ (turns) off the {device} at the end of the lesson, {who}.",
    { device: ["computers", "lights", "projector", "laptops"], who: WHO }],
  ["catch", "We ______ (catching) the {bus} at seven, {name}. The next one is at nine.",
    { bus: ["bus", "train", "tram", "minibus"], name: NAME }],
  ["feed", "My {who} ______ (feeds) the {pet} every morning. It's his job at home.",
    { who: ["brother", "cousin", "little brother", "uncle"], pet: ["cat", "dog", "chickens", "rabbits"] }],
  ["send", "I ______ (sends) this {doc} to the school today, {name}. It's the last day.",
    { doc: ["form", "letter", "email", "photo"], name: NAME }],
  ["be", "You ______ (are) careful on the {place}, {name}. It's very slippery.",
    { place: ["stairs", "ice", "wet floor", "path"], name: NAME }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `must ${v}`, why: WB(v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const IMP = "Change the order into a rule. Use You must.";
const NEC = "Rewrite the sentence with must.";
const TRANSFORM = [
  // correct the mistake (5)
  [COR, "You must to wear a {thing} here, {name}.", "You ______ a {thing} here, {name}.", "must wear",
    "After must, there is no to: must wear.", { thing: ["helmet", "hard hat", "life jacket", "seatbelt"], name: NAME }],
  [COR, "My little {sib} musts go to bed at nine.", "My little {sib} ______ to bed at nine.", "must go",
    "Must never takes -s: she must go, he must go.", { sib: ["sister", "brother", "cousin", "niece"] }],
  [COR, "{name} must calls his {who} tonight.", "{name} ______ his {who} tonight.", "must call",
    "After must, use the base verb with no -s: must call.", { name: HE, who: ["grandma", "mum", "aunt", "uncle"] }],
  [COR, "We must going home now, {name}. It's {state}.", "We ______ home now, {name}. It's {state}.", "must go",
    "After must, use the base verb, not -ing: must go.", { name: NAME, state: ["late", "dark", "very cold", "raining"] }],
  [COR, "I must finished my {task} today, {name}.", "I ______ my {task} today, {name}.", "must finish",
    "After must, use the base verb, not the past form: must finish.", { task: ["essay", "project", "homework", "report"], name: NAME }],
  // order -> rule with You must (5)
  [IMP, "Switch off your phones in the {room}, {who}.", "You ______ off your phones in the {room}, {who}.", "must switch",
    "A rule: You must + base verb.", { room: ["exam room", "library", "hospital", "theatre"], who: WHO }],
  [IMP, "Bring your {thing} to every lesson, {who}.", "You ______ your {thing} to every lesson, {who}.", "must bring",
    "A rule: You must + base verb.", { thing: ["notebook", "dictionary", "pen", "textbook"], who: WHO }],
  [IMP, "Be on time for the {event}, {name}.", "You ______ on time for the {event}, {name}.", "must be",
    "A rule with an adjective or phrase: You must be …", { event: ["lesson", "train", "match", "meeting"], name: NAME }],
  [IMP, "Wash your hands before {meal}, {name}.", "You ______ your hands before {meal}, {name}.", "must wash",
    "A rule: You must + base verb.", { meal: ["lunch", "dinner", "breakfast", "you cook"], name: NAME }],
  [IMP, "Write your answers in {colour} pen, {who}.", "You ______ your answers in {colour} pen, {who}.", "must write",
    "A rule: You must + base verb.", { colour: ["blue", "black", "dark blue", "black or blue"], who: WHO }],
  // It's necessary for … to … -> must (5)
  [NEC, "It's necessary for us to leave at {time}, {name}.", "We ______ at {time}, {name}.", "must leave",
    "It's necessary → must + base verb: we must leave.", { time: ["six", "seven", "half past six", "eight"], name: NAME }],
  [NEC, "It's necessary for {name} to rest at home today. She is very {state}.", "{name} ______ at home today. She is very {state}.", "must rest",
    "It's necessary → must + base verb: she must rest.", { name: SHE, state: ["ill", "tired", "weak", "sick"] }],
  [NEC, "It's necessary for passengers to show their {doc} at the {place}.", "Passengers ______ their {doc} at the {place}.", "must show",
    "It's necessary → must + base verb: passengers must show.", { doc: ["tickets", "passports", "ID cards", "boarding passes"], place: ["gate", "airport", "check-in desk", "boarding gate"] }],
  [NEC, "It's necessary for me to buy {food} today, {name}.", "I ______ {food} today, {name}.", "must buy",
    "It's necessary → must + base verb: I must buy.", { food: ["bread", "milk", "eggs", "rice"], name: NAME }],
  [NEC, "It's necessary for the {sport} players to drink a lot of water in {weather} weather.", "The {sport} players ______ a lot of water in {weather} weather.", "must drink",
    "It's necessary → must + base verb: the players must drink.", { sport: ["football", "volleyball", "basketball", "tennis"], weather: ["hot", "very hot", "sunny", "dry"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one rule at your school with must.", "must + base verb", ["exactly one sentence", "must use must", "a school word"]],
  ["Write one rule in your home with must.", "must + base verb", ["exactly one sentence", "must use must", "a room or a family word"]],
  ["Write one thing you must do this week.", "I must + base verb", ["exactly one sentence", "start with I must", "a time word"]],
  ["Write one rule for a sport you play.", "must + base verb", ["exactly one sentence", "must use must", "the name of the sport"]],
  ["Write one sentence about something your brother, sister or friend must do. Use he or she.", "he / she must + base verb", ["exactly one sentence", "he or she", "no -s after must"]],
  ["Write one rule for passengers on a bus or a train.", "Passengers must + base verb", ["exactly one sentence", "must use must", "a travel word"]],
  ["Write one rule for visitors to a museum or a library.", "Visitors must + base verb", ["exactly one sentence", "must use must", "no to after must"]],
  ["Write two sentences: one thing you must do today and why.", "I must + base verb … because …", ["exactly two sentences", "must use must once", "a reason"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write the rules of your school or your English class. What must students do?", "must", ["must + base verb", "a school word", "three or four sentences"]],
  ["Write the rules in your home. What must everyone in your family do?", "must", ["must + base verb", "he / she must once", "three or four sentences"]],
  ["You are going on a trip next week. What must you do before you go?", "must", ["I must + base verb", "a travel word", "three or four sentences"]],
  ["Write the rules for a game or a sport you play with your friends.", "must", ["must + base verb", "players / everyone", "three or four sentences"]],
  ["Your friend is starting a new job in a café. What must they do at work?", "must", ["must + base verb", "a work word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.obligation.must.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);