// Hand-authored: pronouns / indefinite / something-offer (A2).
// Path fill P46 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: something in an offer question (Would you like ______ to
// eat?: nothing / anyone / something / no one).
// Sibling scope: offers and requests with something only. someone / anyone
// statements are P45, nothing / anything P47, verb agreement P48.
// One right answer: "Would you like anything to drink?" is ALSO correct, so
// anything is never an option and never typed. Every blank is a THING (to
// eat, to drink, to read, for your headache), so no one / nowhere are wrong.
// No place verbs (somewhere to sit), no people (someone to help you).
// Choose, three kinds: 10 something vs nothing / no one / nowhere; 5 the
// adjective after something (something cold vs cold something / somethings
// cold / something colds); 5 something + to + verb (vs something for eat /
// something eat / something eating). "to eat something" is never offered
// (Would you like to eat something? is English).
// Build: two blanks from words listed in instr: something + adjective, or
// something + to. Nothing to type freely, so anything never comes up.
// Transform: 5 situation → offer with "something to" / 5 correct the order or
// form / 5 request → "Can I have something …".
//
// Run: node tools/grammar-practice/authored/pronouns.indefinite.something-offer.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "indefinite", topic: "something-offer", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const ADULT = ["Grandma", "Mum", "Aunt Lola", "Mrs Karimova"];
const EVENT = ["match", "lesson", "walk", "run"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  a: "In an offer (Would you like …? Can I get you …?) about a thing, use something.",
  b: "The adjective comes AFTER something: something cold, something sweet.",
  c: "something + to + verb: something to eat, something to drink.",
  build: "Offers use something; an adjective or to + verb comes after it.",
};
const A = ["something", "nothing", "no one", "nowhere"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE_A = [
  ["Would you like ______ to eat, {name}? You look hungry.", { name: NAME }],
  ["Can I get you ______ to drink, {name}? We have {drink}.", { name: NAME, drink: ["tea", "juice", "coffee", "water"] }],
  ["You look bored, {name}. Would you like ______ to read?", { name: NAME }],
  ["Do you want ______ for your headache, {name}? I have some tablets.", { name: NAME }],
  ["{who}, would you like ______ from the shop? I'm going now.", { who: ADULT }],
  ["Shall I bring you ______ to eat, {name}? Dinner is at nine.", { name: NAME }],
  ["Would you like ______ for your cold, {name}? I can make some {drink}.", { name: NAME, drink: ["tea with lemon", "hot milk", "soup", "ginger tea"] }],
  ["Can I give you ______ for the road, {name}? Take some {food}.", { name: NAME, food: ["apples", "bread", "samsa", "biscuits"] }],
  ["Do you want ______ to drink with your {food}, {name}?", { food: ["plov", "lunch", "pizza", "sandwich"], name: NAME }],
  ["Would your {who} like ______ to eat? There's a lot of {food}.", { who: ["parents", "friends", "cousins", "guests"], food: ["soup", "plov", "salad", "bread"] }],
];
const CHOOSE_B = [
  [["something cold", "cold something", "somethings cold", "something colds"], "It's very hot, {name}. Would you like ______ to drink?", { name: NAME }],
  [["something sweet", "sweet something", "somethings sweet", "something sweets"], "Would you like ______ after dinner, {name}? I made a cake.", { name: NAME }],
  [["something hot", "hot something", "somethings hot", "something hots"], "You're cold, {name}. Can I get you ______ to drink?", { name: NAME }],
  [["something new", "new something", "somethings new", "something news"], "Do you want to try ______, {name}? This {food} is from {city}.", { name: NAME, food: ["cheese", "bread", "jam", "fruit"], city: ["Fergana", "Khiva", "Bukhara", "Samarkand"] }],
  [["something light", "light something", "somethings light", "something lights"], "It's late, {name}. Would you like ______ to eat, like a salad?", { name: NAME }],
];
const CHOOSE_C = [
  [["something to eat", "something for eat", "something eat", "something eating"], "You didn't have lunch, {name}. Would you like ______?", { name: NAME }],
  [["something to drink", "something for drink", "something drink", "something drinking"], "Welcome, {name}! Can I get you ______?", { name: NAME }],
  [["something to read", "something for read", "something read", "something reading"], "The train is long, {name}. Do you want ______?", { name: NAME }],
  [["something to wear", "something for wear", "something wear", "something wearing"], "It's cold outside, {name}. Would you like ______? Take my {thing}.", { name: NAME, thing: ["jacket", "scarf", "coat", "hat"] }],
  [["something to do", "something for do", "something do", "something doing"], "Are you bored, {name}? Would you like ______? You can help me in the {place}.", { name: NAME, place: ["kitchen", "garden", "yard", "shop"] }],
];
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const CHOOSE = [
  ...CHOOSE_A.map(([p, s]) => [A, "a", p, s]),
  ...CHOOSE_B.map(([o, p, s]) => [o, "b", p, s]),
  ...CHOOSE_C.map(([o, p, s]) => [o, "c", p, s]),
].map(([base, w, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[w], slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill, two blanks ---------------- */
const BUILD = [
  // something + adjective (10)
  ["cold", "Put the two words in order: cold, something.", "Would you like ______ ______ to drink, {name}? It's very hot.", { name: NAME }],
  ["sweet", "Put the two words in order: sweet, something.", "Can I get you ______ ______ with your {drink}, {name}?", { drink: ["tea", "coffee", "cocoa", "milk"], name: NAME }],
  ["hot", "Put the two words in order: hot, something.", "You're wet, {name}. Would you like ______ ______ to eat? There's {food}.", { name: NAME, food: ["soup", "plov", "rice", "pasta"] }],
  ["warm", "Put the two words in order: warm, something.", "Do you want ______ ______ to wear, {name}? Take my {thing}.", { name: NAME, thing: ["jacket", "scarf", "coat", "sweater"] }],
  ["nice", "Put the two words in order: nice, something.", "Shall I cook ______ ______ for dinner, {name}? Your {who} is coming.", { name: NAME, who: ["grandma", "aunt", "uncle", "teacher"] }],
  ["light", "Put the two words in order: light, something.", "Would you like ______ ______ to eat before the {event}, {name}?", { event: ["match", "concert", "lesson", "exam"], name: NAME }],
  ["fresh", "Put the two words in order: fresh, something.", "Can I bring you ______ ______ from the bazaar, {who}? I'm going {when}.", { who: ADULT, when: ["now", "this morning", "after lunch", "soon"] }],
  ["easy", "Put the two words in order: easy, something.", "Do you want ______ ______ to read, {name}? This {book} is short.", { name: NAME, book: ["book", "story", "magazine", "comic"] }],
  ["new", "Put the two words in order: new, something.", "Would you like to try ______ ______, {name}? It's a {food} from {city}.", { name: NAME, food: ["cake", "melon", "pie", "biscuit"], city: ["Fergana", "Khiva", "Bukhara", "Samarkand"] }],
  ["special", "Put the two words in order: special, something.", "Shall we get ______ ______ for {who}'s birthday, {name}?", { who: ["Mum", "Grandpa", "Dad", "Grandma"], name: NAME }],
  // something + to (10)
  ["to", "Put the two words in order: to, something.", "You look hungry, {name}. Would you like ______ ______ eat?", { name: NAME }],
  ["to", "Put the two words in order: to, something.", "Welcome, {name}! Can I get you ______ ______ drink?", { name: NAME }],
  ["to", "Put the two words in order: to, something.", "The flight is long, {name}. Do you want ______ ______ read?", { name: NAME }],
  ["to", "Put the two words in order: to, something.", "It's snowing, {name}. Would you like ______ ______ wear on your head?", { name: NAME }],
  ["to", "Put the two words in order: to, something.", "Are you bored, {name}? Do you want ______ ______ do in the {place}?", { name: NAME, place: ["garden", "kitchen", "yard", "shop"] }],
  ["to", "Put the two words in order: to, something.", "Shall I make you ______ ______ eat for the {trip}, {name}?", { trip: ["trip", "train", "bus", "road"], name: NAME }],
  ["to", "Put the two words in order: to, something.", "{who}, would you like ______ ______ drink with your {food}?", { who: ADULT, food: ["plov", "lunch", "cake", "samsa"] }],
  ["to", "Put the two words in order: to, something.", "Can I give you ______ ______ read on the {t}, {name}?", { t: ["bus", "train", "plane", "beach"], name: NAME }],
  ["to", "Put the two words in order: to, something.", "Do you need ______ ______ write with, {name}? Here's a {pen}.", { name: NAME, pen: ["pen", "pencil", "marker", "blue pen"] }],
  ["to", "Put the two words in order: to, something.", "Would the {kids} like ______ ______ play with? We have {toy}.", { kids: ["children", "twins", "boys", "girls"], toy: ["a ball", "some games", "a puzzle", "some cards"] }],
].map(([second, instr, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr, source, key: ["something", second], why: W.build, slots: fix(slots, source),
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const OFF = "Make an offer with something to.";
const COR = "Correct the mistake.";
const REQ = "Ask for it politely with something.";
const TRANSFORM = [
  // situation -> offer (5)
  [OFF, "Your guest {name} is hungry after the {trip}.", "Would you like ______ eat, {name}?", "something to", "Offer: Would you like something to + verb?", { name: NAME, trip: ["trip", "long drive", "flight", "train"] }],
  [OFF, "Your friend {name} is thirsty after the {event}.", "Can I get you ______ drink, {name}?", "something to", "Offer: Can I get you something to + verb?", { name: NAME, event: EVENT }],
  [OFF, "Your cousin {name} is bored on the {t}.", "Do you want ______ read, {name}?", "something to", "Offer: Do you want something to + verb?", { name: NAME, t: ["train", "bus", "plane", "trip"] }],
  [OFF, "{name} is cold. You have a spare {thing}.", "Would you like ______ wear, {name}?", "something to", "Offer: Would you like something to + verb?", { name: NAME, thing: ["jacket", "scarf", "coat", "sweater"] }],
  [OFF, "{who} arrives tired after a long trip from {city}.", "Shall I make you ______ eat, {who}?", "something to", "Offer: Shall I make you something to + verb?", { who: ["Grandma", "Grandpa", "Aunt Lola", "Uncle Rustam"], city: ["Khiva", "Fergana", "Bukhara", "Samarkand"] }],
  // correct (5)
  [COR, "It's hot in the {place}. Would you like cold something to drink, {name}?", "It's hot in the {place}. Would you like ______ to drink, {name}?", "something cold", "The adjective comes after something.", { place: ["garden", "yard", "kitchen", "car"], name: NAME }],
  [COR, "Can I get you something for drink with your {food}, {name}?", "Can I get you ______ drink with your {food}, {name}?", "something to", "something + to + verb, not for.", { food: ["plov", "lunch", "cake", "samsa"], name: NAME }],
  [COR, "Do you want something eat, {name}? There's {food}.", "Do you want ______ eat, {name}? There's {food}.", "something to", "something + to + verb.", { name: NAME, food: ["soup", "plov", "bread", "fruit"] }],
  [COR, "Would you like sweet something with your {drink}, {name}?", "Would you like ______ with your {drink}, {name}?", "something sweet", "The adjective comes after something.", { drink: ["tea", "coffee", "milk", "cocoa"], name: NAME }],
  [COR, "Would you like nothing to eat, {name}? The {food} is ready.", "Would you like ______ to eat, {name}? The {food} is ready.", "something", W.a, { name: NAME, food: ["soup", "plov", "rice", "pasta"] }, ["anything"]],
  // request (5)
  [REQ, "I'm hungry after the {event}. Give me food, {who}.", "Can I have ______ eat, please, {who}?", "something to", "Polite request: Can I have something to + verb?", { event: EVENT, who: ADULT }],
  [REQ, "I'm thirsty after the {event}. Give me a drink, {who}.", "Can I have ______ drink, please, {who}?", "something to", "Polite request: Can I have something to + verb?", { event: EVENT, who: ADULT }],
  [REQ, "I'm bored on the {t}. Give me a book, {name}.", "Can I have ______ read, please, {name}?", "something to", "Polite request: Can I have something to + verb?", { t: ["train", "bus", "plane", "trip"], name: NAME }],
  [REQ, "It's so hot in the {place}. Give me a cold drink, {name}.", "Could I have ______ to drink, please, {name}?", "something cold", "Polite request: something + adjective.", { place: ["yard", "garden", "street", "car"], name: NAME }],
  [REQ, "I've got a {ill}. Give me a hot drink, {who}.", "Could I have ______ to drink, please, {who}?", "something hot", "Polite request: something + adjective.", { ill: ["cold", "sore throat", "cough", "runny nose"], who: ADULT }],
// Audit (Claude, 20 Nov): "Would you like anything to eat?" is a right correction too.
].map(([instr, source, hint, key, why, slots, acceptable]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: fix(slots, source + hint), ...(acceptable ? { acceptable } : {}) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["A guest comes to your home. Offer them something to drink.", "Would you like something to drink?", ["exactly one sentence", "something to", "a question mark"]],
  ["Your friend looks hungry. Offer food.", "Can I get you something to eat?", ["exactly one sentence", "something", "a question mark"]],
  ["It's very hot. Offer something cold.", "Would you like something cold …?", ["exactly one sentence", "something cold", "a question mark"]],
  ["Your little brother is bored. Offer him something to do or read.", "Do you want something to …?", ["exactly one sentence", "something to", "a question mark"]],
  ["You are in a café. Ask for something sweet.", "Could I have something sweet …?", ["exactly one sentence", "something + adjective", "please"]],
  ["Your grandma is cold. Offer her something to wear.", "Would you like something to wear?", ["exactly one sentence", "something to wear", "a question mark"]],
  ["You are going to the shop. Ask your mum if she wants something.", "Do you want something from the shop?", ["exactly one sentence", "something", "shop"]],
  ["Write two offers: one with something to + verb, one with something + adjective.", "something to eat / something hot", ["exactly two questions", "something to once", "something + adjective once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Friends come to your home after school. Write what you say to them: offer food, drinks and something to do.", "Would you like something to …?", ["something twice", "a question", "three or four sentences"]],
  ["Write a short dialogue in a café between you and a waiter.", "Can I get you something …? / Could I have something …?", ["something", "please", "three or four lines"]],
  ["Your cousin arrives after a long train trip. Write what you say to him or her.", "Would you like something to eat / drink?", ["something to", "a question", "three or four sentences"]],
  ["A new student is in your class. Write how you help: offer things he or she needs.", "Do you want something to write with?", ["something", "a school word", "three or four sentences"]],
  ["It's a very hot day at the beach. Offer things to your family.", "Would you like something cold …?", ["something + adjective", "a question", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.indefinite.something-offer.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);