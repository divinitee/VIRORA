// Hand-authored: passive-causative / perfect-progressive-passive / present-perfect-passive (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement items): the present perfect passive has / have been
// + past participle, usually with no doer, for news and results now (My bike has
// been stolen. The documents have already been sent.).
// Triage: kept at B1 level: news, results, already / just / yet. The C1 placement
// items (academic, ongoing process) are left to C1.
// "open" and other verbs that can be used without an object are not used (A new
// shop has opened is English too). "cancel" is used in choose only (cancelled /
// canceled is a spelling split for typed keys).
// Choose: has been + pp / has + pp / is been + pp / has being + pp (plural: have
// been / have / are been / has been).
// Build: 15 has / have been + pp of the verb in brackets; 5 split by already / just /
// yet (array key ["has", "been sent"], the placement gap item).
// Transform: 5 someone has … → passive / 5 correct the mistake / 5 already / just /
// yet split (array key).
//
// Run: node tools/grammar-practice/authored/passive-causative.perfect-progressive-passive.present-perfect-passive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "passive-causative", branch: "perfect-progressive-passive", topic: "present-perfect-passive", level: "B1", pv: "2.5" };
const NAME = ["Zarina", "Sherzod", "Nodira", "Akmal"]; // listener names: never printed in a sentence (audit 20 Nov)
const WHY = "News or a result now, and we don't say who did it: has / have been + past participle.";
const sg = (pp) => [`has been ${pp}`, `has ${pp}`, `is been ${pp}`, `has being ${pp}`];
const pl = (pp) => [`have been ${pp}`, `have ${pp}`, `are been ${pp}`, `has been ${pp}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [sg("stolen"), "Oh no! My {thing} ______. I can't find it anywhere, {name}.", { thing: ["bike", "phone", "wallet", "car"], name: NAME }],
  [sg("built"), "A new {place} ______ near our house this year, {name}.", { place: ["library", "school", "hospital", "park"], name: NAME }],
  [sg("cancelled"), "The {event} ______ because of the snow, {name}.", { event: ["match", "concert", "trip", "lesson"], name: NAME }],
  [sg("repaired"), "The {thing} ______ at last. We can use it again, {name}.", { thing: ["lift", "road", "bridge", "printer"], name: NAME }],
  [sg("painted"), "Your {room} ______ blue. Do you like it, {name}?", { room: ["room", "kitchen", "office", "bedroom"], name: NAME }],
  [sg("sold"), "Sorry, the last {thing} ______. Come back tomorrow, {name}.", { thing: ["ticket", "cake", "melon", "newspaper"], name: NAME }],
  [sg("found"), "Good news! Your {pet} ______ in the park, {name}.", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  [sg("sent"), "The {doc} ______ to your email, {name}.", { doc: ["ticket", "report", "invoice", "letter"], name: NAME }],
  [sg("invited"), "Our class ______ to the {event}, {name}.", { event: ["concert", "museum", "wedding", "festival"], name: NAME }],
  [sg("cleaned"), "The {room} ______. You can go in now, {name}.", { room: ["kitchen", "classroom", "hall", "bathroom"], name: NAME }],
  [sg("repaired"), "Your {thing} ______. You can pick it up now, {name}.", { thing: ["shoes", "watch", "phone", "bike"], name: NAME }],
  [sg("broken"), "The window in the {room} ______ again, {name}.", { room: ["kitchen", "classroom", "hall", "bathroom"], name: NAME }],
  [pl("sold"), "All the {thing} ______. There are none left, {name}.", { thing: ["tickets", "cakes", "melons", "books"], name: NAME }],
  [pl("told"), "The {who} ______ about the change, {name}.", { who: ["students", "workers", "guests", "parents"], name: NAME }],
  [pl("built"), "Two new {thing} ______ in our street this year, {name}.", { thing: ["houses", "shops", "schools", "cafés"], name: NAME }],
  [pl("sent"), "The emails ______ to all the {who}, {name}.", { who: ["students", "parents", "guests", "workers"], name: NAME }],
  [pl("washed"), "My {thing} ______. They're clean now, {name}.", { thing: ["shirts", "clothes", "dishes", "curtains"], name: NAME }],
  [pl("put"), "The {event} results ______ online, {name}.", { event: ["exam", "test", "race", "quiz"], name: NAME }],
  [pl("planted"), "Hundreds of trees ______ in the {place} this spring, {name}.", { place: ["park", "city", "village", "school yard"], name: NAME }],
  [pl("sent"), "The children ______ home because of the {weather}, {name}.", { weather: ["snow", "heat", "storm", "flood"], name: NAME }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots };
});

/* ---------------- build: 15 single + 5 split ---------------- */
const INSTR = "Complete with has been or have been + the past participle of the verb in brackets.";
const INSTR2 = "Complete with has / have and been + the past participle of the verb in brackets.";
// no source prints has / have / been
const BUILD = [
  [INSTR, "has been stolen", "My {thing} ______ (steal), {name}.", { thing: ["bike", "phone", "wallet", "car"], name: NAME }],
  [INSTR, "has been built", "A new {place} ______ (build) near us, {name}.", { place: ["library", "school", "hospital", "park"], name: NAME }],
  [INSTR, "has been postponed", "The {event} ______ (postpone) until May, {name}.", { event: ["match", "concert", "trip", "wedding"], name: NAME }],
  [INSTR, "has been repaired", "The {thing} ______ (repair) at last, {name}.", { thing: ["lift", "road", "bridge", "printer"], name: NAME }],
  [INSTR, "has been painted", "Your {room} ______ (paint) blue, {name}.", { room: ["room", "kitchen", "office", "bedroom"], name: NAME }],
  [INSTR, "has been found", "Your {pet} ______ (find), {name}!", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  [INSTR, "has been invited", "Our class ______ (invite) to the {event}, {name}.", { event: ["concert", "museum", "wedding", "festival"], name: NAME }],
  [INSTR, "has been cleaned", "The {room} ______ (clean). You can go in, {name}.", { room: ["kitchen", "classroom", "hall", "bathroom"], name: NAME }],
  [INSTR, "has been checked", "Your {thing} ______ (check). It's fine now, {name}.", { thing: ["car", "heater", "laptop", "bike"], name: NAME }],
  [INSTR, "have been sold", "All the {thing} ______ (sell), {name}.", { thing: ["tickets", "cakes", "melons", "books"], name: NAME }],
  [INSTR, "have been told", "The {who} ______ (tell) about the change, {name}.", { who: ["students", "workers", "guests", "parents"], name: NAME }],
  [INSTR, "have been built", "Two new {thing} ______ (build) in our street, {name}.", { thing: ["houses", "shops", "schools", "cafés"], name: NAME }],
  [INSTR, "have been washed", "My {thing} ______ (wash). They're clean now, {name}.", { thing: ["shirts", "clothes", "dishes", "curtains"], name: NAME }],
  [INSTR, "have been planted", "Hundreds of trees ______ (plant) in the {place}, {name}.", { place: ["park", "city", "village", "school yard"], name: NAME }],
  [INSTR, "have been sent", "The children ______ (send) home because of the {weather}, {name}.", { weather: ["snow", "heat", "storm", "flood"], name: NAME }],
  [INSTR2, ["has", "been sent"], "The {doc} ______ already ______ (send) to the manager, {name}.", { doc: ["report", "invoice", "letter", "contract"], name: NAME }],
  [INSTR2, ["has", "been delivered"], "The {thing} ______ just ______ (deliver), {name}.", { thing: ["parcel", "pizza", "sofa", "fridge"], name: NAME }],
  [INSTR2, ["Has", "been cleaned"], "______ the {room} ______ (clean) yet, {name}?", { room: ["kitchen", "classroom", "hall", "bathroom"], name: NAME }],
  [INSTR2, ["has", "been chosen"], "The new {who} ______ already ______ (choose), {name}.", { who: ["captain", "director", "teacher", "manager"], name: NAME }],
  [INSTR2, ["have", "been sold"], "All the {thing} ______ just ______ (sell), {name}.", { thing: ["tickets", "cakes", "melons", "books"], name: NAME }],
].map(([instr, key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr, source, key, why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TOP = "Rewrite in the passive. Start with the words given. Don't say who did it.";
const FIX = "Correct the mistake.";
const SPLIT = "Rewrite in the passive. Keep already / just / yet.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [TOP, "Someone has stolen my {thing}, {name}.", "My {thing} ______, {name}.", "has been stolen", { thing: ["bike", "phone", "wallet", "car"], name: NAME }],
  [TOP, "They have built a new {place} near us, {name}.", "A new {place} ______ near us, {name}.", "has been built", { place: ["library", "school", "hospital", "park"], name: NAME }],
  [TOP, "Someone has broken the window in the {room}, {name}.", "The window in the {room} ______, {name}.", "has been broken", { room: ["kitchen", "classroom", "hall", "bathroom"], name: NAME }],
  [TOP, "They have sold all the {thing}, {name}.", "All the {thing} ______, {name}.", "have been sold", { thing: ["tickets", "cakes", "melons", "books"], name: NAME }],
  [TOP, "Somebody has found your {pet}, {name}!", "Your {pet} ______, {name}!", "has been found", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  [FIX, "My {thing} has stolen, {name}.", "My {thing} ______, {name}.", "has been stolen", { thing: ["bike", "phone", "wallet", "car"], name: NAME }],
  [FIX, "The {event} has been postpone, {name}.", "The {event} ______, {name}.", "has been postponed", { event: ["match", "concert", "trip", "wedding"], name: NAME }],
  [FIX, "The {who} have being told about it, {name}.", "The {who} ______ about it, {name}.", "have been told", { who: ["students", "workers", "guests", "parents"], name: NAME }],
  [FIX, "A new {place} is been built near us, {name}.", "A new {place} ______ near us, {name}.", "has been built", { place: ["library", "school", "hospital", "park"], name: NAME }],
  [FIX, "The letters has been sent to the {who}, {name}.", "The letters ______ to the {who}, {name}.", "have been sent", { who: ["students", "parents", "guests", "workers"], name: NAME }],
  [SPLIT, "They have already cleaned the {room}, {name}.", "The {room} ______ already ______, {name}.", ["has", "been cleaned"], { room: ["kitchen", "classroom", "hall", "bathroom"], name: NAME }],
  [SPLIT, "Someone has just repaired the {thing}, {name}.", "The {thing} ______ just ______, {name}.", ["has", "been repaired"], { thing: ["lift", "road", "bridge", "printer"], name: NAME }],
  [SPLIT, "Have they sent the {doc} yet, {name}?", "______ the {doc} ______ yet, {name}?", ["Has", "been sent"], { doc: ["report", "invoice", "letter", "contract"], name: NAME }],
  [SPLIT, "They have already told the {who}, {name}.", "The {who} ______ already ______, {name}.", ["have", "been told"], { who: ["students", "workers", "guests", "parents"], name: NAME }],
  [SPLIT, "Someone has just painted the {thing}. Don't touch it, {name}.", "The {thing} ______ just ______. Don't touch it, {name}.", ["has", "been painted"], { thing: ["door", "fence", "wall", "bench"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence of news about your town with has been + past participle.", "… has been built / opened …", ["exactly one sentence", "has / have been + past participle", "no doer"]],
  ["Something of yours has gone. Write one sentence with has been stolen or has been lost.", "My … has been stolen", ["exactly one sentence", "has been + past participle", "present perfect"]],
  ["Write one sentence with already and the present perfect passive.", "… has already been …", ["exactly one sentence", "already", "has / have been + past participle"]],
  ["Write one question with yet and the present perfect passive.", "Has … been … yet?", ["exactly one question", "yet", "Has / Have … been"]],
  ["Write one sentence about a match or concert that has been cancelled or postponed.", "… has been postponed", ["exactly one sentence", "has been + past participle", "a reason"]],
  ["Write one sentence with have been (plural).", "… have been + past participle", ["exactly one sentence", "a plural subject", "have been"]],
  ["Write one sentence with just and the present perfect passive.", "… has just been …", ["exactly one sentence", "just", "has / have been + past participle"]],
  ["Write two sentences: active (Someone has …) and the same in the passive.", "active vs passive", ["exactly two sentences", "someone has …", "has been + past participle"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write a short news report (three or four sentences) about changes in your town this year.", "present perfect passive for news", ["has / have been + past participle", "no doer", "three or four sentences"]],
  ["You come back from holiday. Write three or four sentences about what has been done at home while you were away.", "has / have been + past participle", ["has been", "have been", "three or four sentences"]],
  ["Write three or four sentences about preparations for a wedding: what has already been done and what hasn't been done yet.", "already / yet with the passive", ["already", "yet", "three or four sentences"]],
  ["Your school or office has changed. Write three or four sentences with has been / have been.", "present perfect passive", ["has been", "have been", "three or four sentences"]],
  ["Write a short email (three or four sentences) to a customer: their order has been sent, and some items have been changed.", "present perfect passive", ["has been sent", "have been", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/passive-causative.perfect-progressive-passive.present-perfect-passive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
