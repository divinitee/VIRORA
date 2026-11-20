// Hand-authored: modals / obligation / modal-passive (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): after must, does the subject DO the action
// (active: Visitors must show ID) or RECEIVE it (passive: ID must be shown)?
// Triage with sibling passive-causative.modal-passive.modal-be-pp: THIS topic is the
// choice active vs passive after must, in rules and signs, so half the keys are
// active and half passive, with the same verbs. modal-be-pp owns building the
// passive form with other modals (can / should / will / might / has to be + pp),
// where every key is passive.
// Choose: one verb in four shapes: must + base / must be + pp / must be + base /
// must + pp; 10 active keys, 10 passive keys.
// Build: must + verb or must be + past participle (verb in brackets); no source
// prints must or be.
// Transform: 5 active → passive / 5 passive with by → active / 5 correct the mistake.
//
// Run: node tools/grammar-practice/authored/modals.obligation.modal-passive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "obligation", topic: "modal-passive", level: "B1", pv: "2.5" };
const NAME = ["Zarina", "Sherzod", "Nodira", "Akmal"]; // listener names: never printed in a sentence (audit 20 Nov)
const PP = { show: "shown", turn: "turned", wash: "washed", wear: "worn", check: "checked", follow: "followed", leave: "left", clean: "cleaned", complete: "completed", obey: "obeyed", respect: "respected", pay: "paid", finish: "finished", sign: "signed", keep: "kept", buy: "bought" };
const WHY_A = "The subject does the action: must + base verb (active).";
const WHY_P = "The subject receives the action: must be + past participle (passive).";
const shapes = (v) => [`must ${v}`, `must be ${PP[v]}`, `must be ${v}`, `must ${PP[v]}`];
const PLACE = ["entrance", "gate", "front desk", "door"];
const ROOM = ["exam room", "library", "classroom", "hall"];
const ROAD = ["motorway", "ring road", "mountain road", "main road"];
const SITE = ["building site", "factory floor", "roof", "bridge"];
const FORM = ["visa", "hotel", "school", "bank"];
const RULES = ["pool", "school", "park", "museum"];

/* ---------------- choose: 20 mcq ---------------- */
// [verb, passive?, prompt, slots]
const CHOOSE = [
  ["show", 0, "All visitors ______ their ID at the {place}, {name}.", { place: PLACE, name: NAME }],
  ["turn", 0, "Students ______ their phones off in the {room}, {name}.", { room: ROOM, name: NAME }],
  ["wash", 0, "You ______ your hands before you cook {food}, {name}.", { food: ["plov", "dinner", "meat", "fish"], name: NAME }],
  ["wear", 0, "Drivers ______ their seat belts on the {road}, {name}.", { road: ROAD, name: NAME }],
  ["check", 0, "Passengers ______ their bags at the {place}, {name}.", { place: ["airport", "station", "border", "gate"], name: NAME }],
  ["follow", 0, "Children ______ the {place} rules, {name}.", { place: RULES, name: NAME }],
  ["wear", 0, "Workers ______ a helmet on the {site}, {name}.", { site: SITE, name: NAME }],
  ["leave", 0, "Guests ______ their rooms by {time}, {name}.", { time: ["noon", "eleven", "ten o'clock", "twelve"], name: NAME }],
  ["complete", 0, "You ______ the {form} form in black ink, {name}.", { form: FORM, name: NAME }],
  ["obey", 0, "Players ______ the {who}, {name}.", { who: ["referee", "coach", "captain", "judge"], name: NAME }],
  ["show", 1, "Your ID ______ at the {place}, {name}.", { place: PLACE, name: NAME }],
  ["turn", 1, "Phones ______ off in the {room}, {name}.", { room: ROOM, name: NAME }],
  ["wash", 1, "Hands ______ before cooking {food}, {name}.", { food: ["plov", "dinner", "meat", "fish"], name: NAME }],
  ["wear", 1, "Seat belts ______ on the {road}, {name}.", { road: ROAD, name: NAME }],
  ["check", 1, "All bags ______ at the {place}, {name}.", { place: ["airport", "station", "border", "gate"], name: NAME }],
  ["follow", 1, "The {place} rules ______ by everyone, {name}.", { place: RULES, name: NAME }],
  ["wear", 1, "Helmets ______ on the {site}, {name}.", { site: SITE, name: NAME }],
  ["check", 1, "The rooms ______ by {time} every day, {name}.", { time: ["noon", "eleven", "ten o'clock", "twelve"], name: NAME }],
  ["complete", 1, "The {form} form ______ in black ink, {name}.", { form: FORM, name: NAME }],
  ["respect", 1, "The {who}'s decision ______ by all players, {name}.", { who: ["referee", "coach", "captain", "judge"], name: NAME }],
].map(([v, pas, prompt, slots], i) => {
  const o = shapes(v);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[pas ? 1 : 0]), why: pas ? WHY_P : WHY_A, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Does the subject do the action or receive it? Complete with must + verb, or must be + past participle.";
// no source prints "must" or "be"
const BUILD = [
  ["show", 0, "All visitors ______ (show) their ID at the {place}, {name}.", { place: PLACE, name: NAME }],
  ["show", 1, "Your ID ______ (show) at the {place}, {name}.", { place: PLACE, name: NAME }],
  ["turn", 0, "Students ______ (turn) off their phones in the {room}, {name}.", { room: ROOM, name: NAME }],
  ["turn", 1, "Phones ______ (turn) off in the {room}, {name}.", { room: ROOM, name: NAME }],
  ["wear", 0, "Drivers ______ (wear) seat belts on the {road}, {name}.", { road: ROAD, name: NAME }],
  ["wear", 1, "Seat belts ______ (wear) on the {road}, {name}.", { road: ROAD, name: NAME }],
  ["leave", 0, "Guests ______ (leave) their keys at the {desk}, {name}.", { desk: ["front desk", "reception", "door", "office"], name: NAME }],
  ["leave", 1, "Keys ______ (leave) at the {desk}, {name}.", { desk: ["front desk", "reception", "door", "office"], name: NAME }],
  ["pay", 0, "You ______ (pay) for the {thing} at the door, {name}.", { thing: ["tickets", "drinks", "food", "parking"], name: NAME }],
  ["pay", 1, "The {thing} ______ (pay) for at the door, {name}.", { thing: ["tickets", "drinks", "food", "parking"], name: NAME }],
  ["follow", 0, "Everybody ______ (follow) the {place} rules, {name}.", { place: RULES, name: NAME }],
  ["follow", 1, "The {place} rules ______ (follow) by everybody, {name}.", { place: RULES, name: NAME }],
  ["wear", 0, "Workers ______ (wear) helmets on the {site}, {name}.", { site: SITE, name: NAME }],
  ["finish", 1, "Homework ______ (finish) by {day}, {name}.", { day: ["Monday", "Friday", "tomorrow", "Wednesday"], name: NAME }],
  ["finish", 0, "You ______ (finish) your homework by {day}, {name}.", { day: ["Monday", "Friday", "tomorrow", "Wednesday"], name: NAME }],
  ["sign", 1, "The {form} form ______ (sign) by a parent, {name}.", { form: ["school", "trip", "visa", "medical"], name: NAME }],
  ["sign", 0, "A parent ______ (sign) the {form} form, {name}.", { form: ["school", "trip", "visa", "medical"], name: NAME }],
  ["keep", 1, "This {food} ______ (keep) in the fridge, {name}.", { food: ["milk", "cake", "fish", "cheese"], name: NAME }],
  ["keep", 0, "You ______ (keep) the {food} in the fridge, {name}.", { food: ["milk", "cake", "fish", "cheese"], name: NAME }],
  ["keep", 1, "Dogs ______ (keep) on a lead in the {place}, {name}.", { place: ["park", "garden", "square", "zoo"], name: NAME }],
].map(([v, pas, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: pas ? `must be ${PP[v]}` : `must ${v}`, why: pas ? WHY_P : WHY_A, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TOP = "Rewrite in the passive. Start with the words given.";
const TOA = "Rewrite in the active. Start with the words given.";
const FIX = "Correct the mistake.";
// [instr, source, hint, verb, passive?, slots]
const TRANSFORM = [
  [TOP, "Visitors must show their ID at the {place}, {name}.", "ID ______ at the {place}, {name}.", "show", 1, { place: PLACE, name: NAME }],
  [TOP, "You must wash your hands before cooking {food}, {name}.", "Hands ______ before cooking {food}, {name}.", "wash", 1, { food: ["plov", "dinner", "meat", "fish"], name: NAME }],
  [TOP, "People must keep dogs on a lead in the {place}, {name}.", "Dogs ______ on a lead in the {place}, {name}.", "keep", 1, { place: ["park", "garden", "square", "zoo"], name: NAME }],
  [TOP, "You must turn off phones in the {room}, {name}.", "Phones ______ off in the {room}, {name}.", "turn", 1, { room: ROOM, name: NAME }],
  [TOP, "Someone must sign the {form} form, {name}.", "The {form} form ______, {name}.", "sign", 1, { form: ["school", "trip", "visa", "medical"], name: NAME }],
  [TOA, "Seat belts must be worn by all drivers on the {road}, {name}.", "All drivers ______ seat belts on the {road}, {name}.", "wear", 0, { road: ROAD, name: NAME }],
  [TOA, "The rules must be followed by all students at the {place}, {name}.", "All students ______ the rules at the {place}, {name}.", "follow", 0, { place: RULES, name: NAME }],
  [TOA, "Tickets must be bought by passengers before the {trip}, {name}.", "Passengers ______ tickets before the {trip}, {name}.", "buy", 0, { trip: ["journey", "flight", "trip", "concert"], name: NAME }],
  [TOA, "The keys must be left by guests at the {desk}, {name}.", "Guests ______ the keys at the {desk}, {name}.", "leave", 0, { desk: ["front desk", "reception", "door", "office"], name: NAME }],
  [TOA, "ID must be shown by all visitors at the {place}, {name}.", "All visitors ______ ID at the {place}, {name}.", "show", 0, { place: PLACE, name: NAME }],
  [FIX, "All visitors must be show ID at the {place}, {name}.", "All visitors ______ ID at the {place}, {name}.", "show", 0, { place: PLACE, name: NAME }],
  [FIX, "Seat belts must wear on the {road}, {name}.", "Seat belts ______ on the {road}, {name}.", "wear", 1, { road: ROAD, name: NAME }],
  [FIX, "Phones must turned off in the {room}, {name}.", "Phones ______ off in the {room}, {name}.", "turn", 1, { room: ROOM, name: NAME }],
  [FIX, "Students must be follow the rules at the {place}, {name}.", "Students ______ the rules at the {place}, {name}.", "follow", 0, { place: RULES, name: NAME }],
  [FIX, "This {food} must keep in the fridge, {name}.", "This {food} ______ in the fridge, {name}.", "keep", 1, { food: ["milk", "cake", "fish", "cheese"], name: NAME }],
].map(([instr, source, hint, v, pas, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: pas ? `must be ${PP[v]}` : `must ${v}`, why: pas ? WHY_P : WHY_A, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one rule for a library with must + verb (active).", "People must …", ["exactly one sentence", "must + base verb", "a person as subject"]],
  ["Write the same library rule in the passive.", "… must be + past participle", ["exactly one sentence", "must be + past participle", "a thing as subject"]],
  ["Write one sign for a swimming pool. Use must be + past participle.", "Showers must be taken …", ["exactly one sentence", "must be + past participle", "a rule"]],
  ["Write one rule for drivers. Use must + verb.", "Drivers must …", ["exactly one sentence", "must + base verb", "active"]],
  ["Write one rule about food in a kitchen. Use must be + past participle.", "Food must be kept …", ["exactly one sentence", "must be + past participle", "passive"]],
  ["Write two rules for a school: one active and one passive.", "must + verb / must be + pp", ["exactly two sentences", "one active", "one passive"]],
  ["Write one hotel rule in the passive.", "Rooms must be left by …", ["exactly one sentence", "must be + past participle", "a time"]],
  ["Write one rule for visitors to a museum. Choose active or passive.", "must / must be", ["exactly one sentence", "must", "the right form for the subject"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write the rules for your school or workplace. Write three or four sentences, some active and some passive.", "must + verb / must be + pp", ["must + base verb", "must be + past participle", "three or four sentences"]],
  ["Write three or four rules for a hotel. Use must be + past participle in at least two.", "must be + past participle", ["must be + past participle", "must", "three or four sentences"]],
  ["Write three or four rules for a football match, for players and for the ball and the pitch.", "active and passive after must", ["players must …", "the ball must be …", "three or four sentences"]],
  ["Write three or four rules for a kitchen at a café.", "must / must be", ["must + base verb", "must be + past participle", "three or four sentences"]],
  ["Write three or four rules for visitors to your city's old town.", "must / must be", ["active", "passive", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.obligation.modal-passive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
