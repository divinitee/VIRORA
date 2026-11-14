// Hand-authored: sentence-structure / imperatives / negative-imperative (A1).
// Path fill P16 (2026-11-14, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: Don't + base form ("______ touch that. It is hot.":
// Don't / Doesn't / Not / No). Mirror of affirmative-imperative (P15): every
// key is a Don't form. Sibling scope: no Let's / Let's not, no mustn't /
// can't / shouldn't (modals), no Never as a key (Never + verb is a real
// negative order, so it is never an option either).
// Choose, three kinds: 10 pick the negative word before a printed verb
// (Don't / Doesn't / Not / No: the placement's own errors); 6 pick Don't +
// the verb form (base / -ing / to + verb / Doesn't); 4 Don't be + adjective
// (Don't be / Don't / Not be / Doesn't be: Uzbek and Russian drop "be").
// "No + -ing" is never an option (No running is a real sign).
// Build: "Make a negative order …" with the verb in brackets (-s, -ing or
// base form); the learner types don't + base verb.
// Transform: 5 correct the mistake / 5 make a positive order negative /
// 5 change a "No + -ing" sign into a spoken order.
//
// Run: node tools/grammar-practice/authored/sentence-structure.imperatives.negative-imperative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "imperatives", topic: "negative-imperative", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const WHO = ["class", "everyone", "children", "students"];

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);

const NEG = ["Don't", "Doesn't", "Not", "No"];
const BE = ["Don't be", "Don't", "Not be", "Doesn't be"];
const FORM = (v, ing) => [`Don't ${v}`, `Don't ${ing}`, `Don't to ${v}`, `Doesn't ${v}`];
const W_NEG = "To tell someone not to do something, use Don't + base verb. Not or No alone is wrong, and doesn't is for he / she / it sentences, not orders.";
const W_FORM = (v) => `After Don't, use the base verb, with no -ing and no to: Don't ${v}.`;
const W_BE = (adj) => `With an adjective, a negative order needs be: Don't be ${adj}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [kind, verb/adj, ing, prompt, slots]
const CHOOSE = [
  ["neg", null, null, "______ touch the {thing}, {name}. It's very hot.",
    { thing: ["stove", "pan", "kettle", "iron"], name: NAME }],
  ["neg", null, null, "______ run in the {place}, {name}.",
    { place: ["corridor", "classroom", "library", "kitchen"], name: NAME }],
  ["neg", null, null, "{name}, ______ forget your {thing} tomorrow.",
    { name: NAME, thing: ["notebook", "homework", "dictionary", "sports bag"] }],
  ["neg", null, null, "______ eat in the {place}, please, {who}.",
    { place: ["library", "computer room", "museum", "science room"], who: WHO }],
  ["neg", null, null, "______ open the {thing}, {name}. It's cold outside.",
    { thing: ["window", "door", "balcony door", "big window"], name: NAME }],
  ["neg", null, null, "Please ______ talk during the {event}, {who}.",
    { event: ["test", "film", "concert", "lesson"], who: WHO }],
  ["neg", null, null, "______ leave your {thing} on the stairs, {name}.",
    { thing: ["bag", "shoes", "coat", "books"], name: NAME }],
  ["neg", null, null, "{name}, ______ play football near the {thing}.",
    { name: NAME, thing: ["windows", "cars", "flowers", "road"] }],
  ["neg", null, null, "______ worry about the {thing}, {name}. You can do it.",
    { thing: ["test", "exam", "homework", "match"], name: NAME }],
  ["neg", null, null, "______ drink the {drink} yet, {name}. It's too hot.",
    { drink: ["tea", "coffee", "milk", "cocoa"], name: NAME }],
  ["form", "use", "using", "______ your phone during {event}, {name}.",
    { event: ["dinner", "the lesson", "the film", "the test"], name: NAME }],
  ["form", "shout", "shouting", "______ so loudly, {name}. The {who} is asleep.",
    { name: NAME, who: ["baby", "dog", "cat", "little boy"] }],
  ["form", "get", "getting", "______ on the {bus} without a ticket, {name}.",
    { bus: ["bus", "tram", "train", "minibus"], name: NAME }],
  ["form", "pour", "pouring", "______ water on the {thing}, {name}.",
    { thing: ["laptop", "phone", "books", "carpet"], name: NAME }],
  ["form", "show", "showing", "______ the {thing} to anyone, {name}. It's a secret.",
    { thing: ["letter", "photo", "message", "drawing"], name: NAME }],
  ["form", "walk", "walking", "______ across the road here, {name}. Use the {crossing}.",
    { name: NAME, crossing: ["bridge", "crossing", "underpass", "traffic lights"] }],
  ["be", "late", null, "______ late for the {event}, {name}.",
    { event: ["lesson", "bus", "train", "film"], name: NAME }],
  ["be", "sad", null, "______ sad, {name}. We can play again {when}.",
    { name: NAME, when: ["tomorrow", "on Saturday", "next week", "after school"] }],
  ["be", "afraid", null, "______ afraid of the {animal}, {name}. It's very friendly.",
    { animal: ["dog", "horse", "cat", "goat"], name: NAME }],
  ["be", "noisy", null, "______ so noisy, {who}. Grandpa is {state}.",
    { who: ["children", "boys", "girls", "everyone"], state: ["sleeping", "resting", "asleep", "not well"] }],
].map(([kind, v, ing, prompt, slots], i) => {
  const first = prompt.startsWith("______");
  const base = kind === "neg" ? NEG : kind === "be" ? BE : FORM(v, ing);
  const options = rot(base, i).map((x) => (first ? x : x[0].toLowerCase() + x.slice(1)));
  const k = first ? base[0] : base[0][0].toLowerCase() + base[0].slice(1);
  const why = kind === "neg" ? W_NEG : kind === "be" ? W_BE(v) : W_FORM(v);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Make a negative order: write don't and the verb in brackets in the right form.";
const WB = (v) => `A negative order is don't + base verb: don't ${v}.`;
const BUILD = [
  ["touch", "______ (touches) the {thing}, {name}. It's broken.",
    { thing: ["glass", "plate", "cup", "mirror"], name: NAME }],
  ["shout", "______ (shouting) in the {place}, {name}.",
    { place: ["library", "hospital", "museum", "classroom"], name: NAME }],
  ["sit", "Please ______ (sits) on the {thing}, {name}. It's wet.",
    { thing: ["bench", "grass", "step", "swing"], name: NAME }],
  ["eat", "{name}, ______ (eating) too many {sweet}.",
    { name: NAME, sweet: ["sweets", "biscuits", "cakes", "chocolates"] }],
  ["be", "______ (is) rude to your {who}, {name}.",
    { who: ["sister", "brother", "teacher", "classmates"], name: NAME }],
  ["watch", "______ (watches) TV after {time}, {name}.",
    { time: ["ten o'clock", "eleven", "midnight", "nine"], name: NAME }],
  ["call", "______ (calling) me during the {event}, {name}.",
    { event: ["lesson", "meeting", "test", "exam"], name: NAME }],
  ["drive", "______ (drives) so fast, {who}. The road is {state}.",
    { who: ["Dad", "Uncle Bobur", "Mum", "Aunt Lola"], state: ["wet", "icy", "busy", "narrow"] }],
  ["be", "______ (being) nervous, {name}. The {event} is easy.",
    { name: NAME, event: ["test", "exam", "quiz", "dictation"] }],
  ["throw", "______ (throws) the {thing} in the house, {name}.",
    { thing: ["ball", "toys", "pillows", "shoes"], name: NAME }],
  ["buy", "______ (buying) {food} at that shop, {name}. It's very expensive.",
    { food: ["bread", "fruit", "milk", "meat"], name: NAME }],
  ["turn", "Please ______ (turns) off the {device}, {name}. I'm still using it.",
    { device: ["laptop", "computer", "printer", "fan"], name: NAME }],
  ["forget", "______ (forgets) to feed the {pet}, {name}.",
    { pet: ["cat", "dog", "fish", "chickens"], name: NAME }],
  ["open", "______ (opening) the {thing} before your birthday, {name}.",
    { thing: ["present", "card", "box", "parcel"], name: NAME }],
  ["be", "______ (are) late for {event} again, {who}.",
    { event: ["school", "the lesson", "practice", "the bus"], who: WHO }],
  ["play", "______ (plays) music so loudly, {name}. Your {who} is doing homework.",
    { name: NAME, who: ["brother", "sister", "cousin", "friend"] }],
  ["leave", "______ (leaving) the {thing} open, {name}. The cat can get out.",
    { thing: ["door", "gate", "window", "balcony door"], name: NAME }],
  ["swim", "______ (swims) here, {name}. The {water} is too deep.",
    { name: NAME, water: ["river", "lake", "pool", "water"] }],
  ["write", "______ (writes) on the {thing}, {name}.",
    { thing: ["desk", "wall", "table", "door"], name: NAME }],
  ["be", "______ (be) shy, {name}. Say hello to your new {who}.",
    { name: NAME, who: ["classmates", "teacher", "neighbours", "team"] }],
].map(([v, source, slots]) => {
  const adj = v === "be" ? source.match(/\) (\w+)/)[1] : null;
  const why = adj ? `${cap(adj)} is an adjective, so the negative order is don't be + adjective: don't be ${adj}.` : WB(v);
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `don't ${v}`, why, slots };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const NEGI = "Make the order negative.";
const SIGN = "Change the sign into a spoken order. Start with Don't.";
const TRANSFORM = [
  // correct the mistake (5)
  [COR, "No touch the {thing}, {name}. It's hot.", "______ the {thing}, {name}. It's hot.", "Don't touch",
    "A negative order starts with Don't, not No: Don't touch.", { thing: ["oven", "stove", "pan", "kettle"], name: NAME }],
  [COR, "Don't running on the {place}, {who}.", "______ on the {place}, {who}.", "Don't run",
    "After Don't, use the base verb, with no -ing: Don't run.", { place: ["stairs", "wet floor", "ice", "platform"], who: ["children", "boys", "girls", "everyone"] }],
  [COR, "Don't late for {event}, {name}.", "______ late for {event}, {name}.", "Don't be",
    "Late is an adjective, so the order needs be: Don't be late.", { event: ["school", "dinner", "the bus", "practice"], name: NAME }],
  [COR, "Doesn't eat that {food}, {name}. It's old.", "______ that {food}, {name}. It's old.", "Don't eat",
    "An order always uses Don't, never Doesn't: Don't eat.", { food: ["bread", "cheese", "meat", "fruit"], name: NAME }],
  [COR, "Don't to forget your {thing}, {name}.", "______ your {thing}, {name}.", "Don't forget",
    "After Don't, use the base verb, with no to: Don't forget.", { thing: ["keys", "ticket", "umbrella", "lunch"], name: NAME }],
  // positive order -> negative (5)
  [NEGI, "Wait for me at the {place}, {name}.", "______ for me at the {place}, {name}.", "Don't wait",
    "Put Don't before the base verb: Don't wait.", { place: ["gate", "bus stop", "corner", "school door"], name: NAME }],
  [NEGI, "Turn on the {device}, {name}.", "______ on the {device}, {name}.", "Don't turn",
    "Put Don't before the base verb: Don't turn on …", { device: ["TV", "light", "radio", "fan"], name: NAME }],
  [NEGI, "Sit near the {thing}, {name}.", "______ near the {thing}, {name}.", "Don't sit",
    "Put Don't before the base verb: Don't sit.", { thing: ["window", "door", "board", "heater"], name: NAME }],
  [NEGI, "Buy {food} for dinner, {name}.", "______ {food} for dinner, {name}.", "Don't buy",
    "Put Don't before the base verb: Don't buy.", { food: ["bread", "rice", "meat", "fish"], name: NAME }],
  [NEGI, "Tell {who} about the party, {name}.", "______ {who} about the party, {name}.", "Don't tell",
    "Put Don't before the base verb: Don't tell.", { who: ["Mum", "Grandma", "your brother", "your sister"], name: NAME }],
  // sign -> spoken order (5)
  [SIGN, "No eating in the {place}.", "______ in the {place}, please, {who}.", "Don't eat",
    "A sign says No + -ing. When you speak, say Don't + base verb: Don't eat.", { place: ["library", "museum", "computer room", "science room"], who: WHO }],
  [SIGN, "No swimming in the {water}.", "______ in the {water}, {name}.", "Don't swim",
    "A sign says No + -ing. When you speak, say Don't + base verb: Don't swim.", { water: ["river", "lake", "pond", "canal"], name: NAME }],
  [SIGN, "No talking during the {event}.", "______ during the {event}, please, {who}.", "Don't talk",
    "A sign says No + -ing. When you speak, say Don't + base verb: Don't talk.", { event: ["test", "film", "concert", "exam"], who: WHO }],
  [SIGN, "No parking in front of the {place}.", "______ in front of the {place}, {who}.", "Don't park",
    "A sign says No + -ing. When you speak, say Don't + base verb: Don't park.", { place: ["gate", "school", "hospital", "shop"], who: ["Dad", "Mum", "Uncle Bobur", "Aunt Lola"] }],
  [SIGN, "No photos in the {place}.", "______ photos in the {place}, please, {who}.", "Don't take",
    "A sign can say No + noun. When you speak, say Don't + base verb: Don't take photos.", { place: ["museum", "gallery", "theatre", "library"], who: WHO }],
// Keys are lower case so ingest also accepts "do not …" (grading ignores case).
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: key.replace(/^Don't/, "don't"), why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one rule for your classroom with Don't.", "Don't + base verb", ["exactly one sentence", "start with Don't", "a classroom word"]],
  ["Write one sentence to your little brother or sister: tell them not to do something at home.", "Don't + base verb", ["exactly one sentence", "start with Don't", "a reason"]],
  ["Write one rule for guests in your home with Don't.", "Don't + base verb", ["exactly one sentence", "start with Don't", "please"]],
  ["Write one sentence with Don't be to a friend before a test.", "Don't be + adjective", ["exactly one sentence", "must use Don't be", "a feeling word"]],
  ["Write one safety rule for the street near your home.", "Don't + base verb", ["exactly one sentence", "start with Don't", "a street word"]],
  ["Write one sentence to a friend who is visiting your town: tell them not to do something.", "Don't + base verb", ["exactly one sentence", "start with Don't", "a place in your town"]],
  ["Write one rule for the library or the computer room at your school.", "Don't + base verb", ["exactly one sentence", "start with Don't", "no -ing after Don't"]],
  ["Write two sentences: one thing to do and one thing not to do in your kitchen.", "base verb … / Don't + base verb", ["exactly two sentences", "one positive order", "one order with Don't"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write the rules of your home for a new guest: three things they should not do.", "negative imperatives", ["Don't + base verb", "please", "three or four sentences"]],
  ["Give a younger student advice for the first day at your school: what should they not do?", "negative imperatives", ["Don't + base verb", "Don't be + adjective once", "three or four sentences"]],
  ["Write the rules for a football or volleyball game with your friends.", "imperatives", ["one positive order", "Don't + base verb", "three or four sentences"]],
  ["A friend is staying in your flat for a weekend. Write a note: what can they do, and what can't they do?", "imperatives", ["Don't + base verb twice", "a positive order", "three or four sentences"]],
  ["Write the rules for your English class: what do students do, and what don't they do?", "imperatives", ["Don't + base verb", "a classroom word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.imperatives.negative-imperative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);