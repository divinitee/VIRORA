// Hand-authored: passive-causative / modal-passive / modal-be-pp (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): the FORM of the modal passive: modal + be +
// past participle (can be recycled, should be kept, will be finished, might be
// delayed, can't be fixed, has to be paid).
// Triage with sibling modals.obligation.modal-passive: that topic is the choice
// active vs passive after must (half its keys active). Here every key is passive and
// the modals vary; the errors are the form: modal + pp (can recycled), be + base
// (can be recycle), been (can been recycled).
// "complete" is avoided (must be complete is English, an adjective).
// Choose: modal be + pp / modal + pp / modal be + base / modal been + pp.
// Build: the modal and the verb are in brackets: "(can / recycle)". No source
// prints be; has to is choose-only (the cue would print "to").
// Transform: 5 active modal → passive / 5 correct the mistake / 5 it's possible /
// a good idea / maybe … → modal passive.
//
// Run: node tools/grammar-practice/authored/passive-causative.modal-passive.modal-be-pp.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "passive-causative", branch: "modal-passive", topic: "modal-be-pp", level: "B1", pv: "2.5" };
const NAME = ["Malika", "Ulugbek", "Gulnora", "Jamshid"]; // listener names: never printed in a sentence (audit 20 Nov)
const WHY = "Passive with a modal: modal + be + past participle.";
// [modal, base, pp, particle]
const shapes = (m, b, pp, p = "") => [`${m} be ${pp}${p}`, `${m} ${pp}${p}`, `${m} be ${b}${p}`, `${m} been ${pp}${p}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [shapes("must", "sign", "signed"), "This {form} form ______ by a parent, {name}.", { form: ["school", "trip", "visa", "medical"], name: NAME }],
  [shapes("can", "recycle", "recycled"), "Plastic {thing} ______, so don't throw them away, {name}.", { thing: ["bottles", "bags", "cups", "boxes"], name: NAME }],
  [shapes("should", "keep", "kept"), "This {med} ______ away from children, {name}.", { med: ["medicine", "cleaning spray", "pair of scissors", "glue"], name: NAME }],
  [shapes("will", "finish", "finished"), "The new {place} ______ next year, {name}.", { place: ["bridge", "metro line", "stadium", "hospital"], name: NAME }],
  [shapes("might", "cancel", "cancelled"), "The {event} ______ if it rains, {name}.", { event: ["match", "picnic", "concert", "festival"], name: NAME }],
  [shapes("can't", "fix", "fixed"), "My old {thing} ______. I need a new one, {name}.", { thing: ["phone", "laptop", "TV", "watch"], name: NAME }],
  [shapes("should", "wash", "washed"), "{fruit} ______ before you eat them, {name}.", { fruit: ["Apples", "Grapes", "Peaches", "Strawberries"], name: NAME }],
  [shapes("has to", "pay", "paid"), "The {bill} ______ by the first of the month, {name}.", { bill: ["rent", "phone bill", "gas bill", "school fee"], name: NAME }],
  [shapes("will", "send", "sent"), "Your {thing} ______ tomorrow, {name}.", { thing: ["ticket", "order", "parcel", "card"], name: NAME }],
  [shapes("can", "see", "seen"), "The mountains ______ from our {room} window, {name}.", { room: ["kitchen", "bedroom", "office", "hotel"], name: NAME }],
  [shapes("won't", "allow", "allowed"), "Phones ______ in the {room}, {name}.", { room: ["exam room", "meeting", "library", "classroom"], name: NAME }],
  [shapes("should", "turn", "turned", " off"), "The lights ______ when you leave the {room}, {name}.", { room: ["kitchen", "classroom", "office", "hall"], name: NAME }],
  [shapes("might", "delay", "delayed"), "Flights to {city} ______ because of the snow, {name}.", { city: ["Moscow", "Istanbul", "Almaty", "Seoul"], name: NAME }],
  [shapes("can", "buy", "bought"), "Tickets ______ online or at the {place}, {name}.", { place: ["station", "door", "stadium", "box office"], name: NAME }],
  [shapes("will", "hold", "held"), "The {event} ______ in the main hall, {name}.", { event: ["meeting", "concert", "party", "exam"], name: NAME }],
  [shapes("shouldn't", "leave", "left"), "Bags ______ on the {place}, {name}.", { place: ["stairs", "floor", "bus", "seats"], name: NAME }],
  [shapes("has to", "repair", "repaired"), "The {thing} ______ before winter, {name}.", { thing: ["roof", "heater", "window", "car"], name: NAME }],
  [shapes("can't", "open", "opened"), "This {thing} ______ without a key, {name}.", { thing: ["door", "box", "safe", "gate"], name: NAME }],
  [shapes("will", "announce", "announced"), "The winners ______ on {day}, {name}.", { day: ["Monday", "Friday", "Sunday", "Navruz"], name: NAME }],
  [shapes("might", "sell", "sold"), "Our old {thing} ______ next month, {name}.", { thing: ["car", "flat", "house", "piano"], name: NAME }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete with the passive: the modal in brackets + be + the past participle of the verb.";
const BUILD = [
  ["should be kept", "{food} ______ (should / keep) in the fridge, {name}.", { food: ["Milk", "Meat", "Fish", "Cheese"], name: NAME }],
  ["can be recycled", "Old {thing} ______ (can / recycle), {name}.", { thing: ["newspapers", "bottles", "phones", "boxes"], name: NAME }],
  ["will be finished", "The new {place} ______ (will / finish) in May, {name}.", { place: ["bridge", "metro line", "stadium", "hospital"], name: NAME }],
  ["might be postponed", "The {event} ______ (might / postpone), {name}.", { event: ["match", "picnic", "concert", "festival"], name: NAME }],
  ["can't be fixed", "Your {thing} ______ (can't / fix), {name}. Sorry.", { thing: ["phone", "laptop", "TV", "watch"], name: NAME }],
  ["must be signed", "This {form} form ______ (must / sign) by a parent, {name}.", { form: ["school", "trip", "visa", "medical"], name: NAME }],
  ["will be sent", "Your {thing} ______ (will / send) tomorrow, {name}.", { thing: ["ticket", "order", "parcel", "card"], name: NAME }],
  ["can be seen", "The {sight} ______ (can / see) from the hill, {name}.", { sight: ["old town", "river", "sea", "whole city"], name: NAME }],
  ["won't be allowed", "Dogs ______ (won't / allow) in the {place}, {name}.", { place: ["café", "shop", "museum", "hotel"], name: NAME }],
  ["should be turned off", "Phones ______ (should / turn off) in the {room}, {name}.", { room: ["exam room", "meeting", "library", "cinema"], name: NAME }],
  ["might be delayed", "Trains to {city} ______ (might / delay) today, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], name: NAME }],
  ["can be bought", "Tickets ______ (can / buy) at the {place}, {name}.", { place: ["station", "door", "stadium", "box office"], name: NAME }],
  ["will be held", "The {event} ______ (will / hold) in the park, {name}.", { event: ["concert", "festival", "party", "race"], name: NAME }],
  ["shouldn't be left", "Children ______ (shouldn't / leave) alone at the {place}, {name}.", { place: ["pool", "beach", "lake", "park"], name: NAME }],
  ["can't be opened", "The {thing} ______ (can't / open) without a code, {name}.", { thing: ["door", "box", "safe", "gate"], name: NAME }],
  ["will be announced", "The results ______ (will / announce) on {day}, {name}.", { day: ["Monday", "Friday", "Sunday", "Navruz"], name: NAME }],
  ["might be sold", "The old {thing} ______ (might / sell) soon, {name}.", { thing: ["car", "flat", "house", "piano"], name: NAME }],
  ["should be cleaned", "The {room} ______ (should / clean) every day, {name}.", { room: ["kitchen", "classroom", "bathroom", "office"], name: NAME }],
  ["can't be used", "This {thing} ______ (can't / use) after {month}.", { thing: ["ticket", "card", "coupon", "pass"], month: ["May", "June", "July", "August"] }],
  ["must be paid", "The {bill} ______ (must / pay) today, {name}.", { bill: ["rent", "phone bill", "gas bill", "school fee"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TOP = "Rewrite in the passive. Start with the words given.";
const FIX = "Correct the mistake.";
const MEAN = "Rewrite with a modal passive (can / can't / should / will / might + be + past participle).";
const TRANSFORM = [
  [TOP, "You can recycle these {thing}, {name}.", "These {thing} ______, {name}.", "can be recycled", { thing: ["bottles", "bags", "cups", "boxes"], name: NAME }],
  [TOP, "They will finish the new {place} next year, {name}.", "The new {place} ______ next year, {name}.", "will be finished", { place: ["bridge", "metro line", "stadium", "hospital"], name: NAME }],
  [TOP, "You should keep this {med} in a cool place, {name}.", "This {med} ______ in a cool place, {name}.", "should be kept", { med: ["medicine", "cream", "cheese", "chocolate"], name: NAME }],
  [TOP, "They might postpone the {event}, {name}.", "The {event} ______, {name}.", "might be postponed", { event: ["match", "picnic", "concert", "festival"], name: NAME }],
  [TOP, "Nobody can fix my old {thing}, {name}.", "My old {thing} ______, {name}.", "can't be fixed", { thing: ["phone", "laptop", "TV", "watch"], name: NAME }],
  [FIX, "Plastic {thing} can recycled, {name}.", "Plastic {thing} ______, {name}.", "can be recycled", { thing: ["bottles", "bags", "cups", "boxes"], name: NAME }],
  [FIX, "The {event} will be hold in the hall, {name}.", "The {event} ______ in the hall, {name}.", "will be held", { event: ["meeting", "concert", "party", "exam"], name: NAME }],
  [FIX, "This {thing} can't been opened without a key, {name}.", "This {thing} ______ without a key, {name}.", "can't be opened", { thing: ["door", "box", "safe", "gate"], name: NAME }],
  [FIX, "{fruit} should washed before you eat them, {name}.", "{fruit} ______ before you eat them, {name}.", "should be washed", { fruit: ["Apples", "Grapes", "Peaches", "Strawberries"], name: NAME }],
  [FIX, "The {bill} must be pay today, {name}.", "The {bill} ______ today, {name}.", "must be paid", { bill: ["rent", "phone bill", "gas bill", "school fee"], name: NAME }],
  [MEAN, "It's possible to see the {sight} from here, {name}.", "The {sight} ______ from here, {name}.", "can be seen", { sight: ["old town", "river", "sea", "whole city"], name: NAME }],
  [MEAN, "It's a good idea to water the {plant} every day, {name}.", "The {plant} ______ every day, {name}.", "should be watered", { plant: ["flowers", "tomatoes", "roses", "garden"], name: NAME }],
  [MEAN, "They are going to announce the winners on {day}, {name}.", "The winners ______ on {day}, {name}.", "will be announced", { day: ["Monday", "Friday", "Sunday", "Navruz"], name: NAME }],
  [MEAN, "Maybe they will sell our old {thing}, {name}.", "Our old {thing} ______, {name}.", "might be sold", { thing: ["car", "flat", "house", "piano"], name: NAME }],
  [MEAN, "It's not possible to use this {thing} after {month}.", "This {thing} ______ after {month}.", "can't be used", { thing: ["ticket", "card", "coupon", "pass"], month: ["May", "June", "July", "August"] }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something that can be recycled.", "… can be recycled", ["exactly one sentence", "can be + past participle", "present"]],
  ["Write one sentence about food that should be kept in the fridge.", "… should be kept …", ["exactly one sentence", "should be + past participle", "a place"]],
  ["Write one sentence about a building that will be finished next year.", "… will be finished …", ["exactly one sentence", "will be + past participle", "future"]],
  ["Write one sentence about an event that might be cancelled.", "… might be cancelled …", ["exactly one sentence", "might be + past participle", "a reason"]],
  ["Write one sentence about something that can't be fixed.", "… can't be fixed", ["exactly one sentence", "can't be + past participle", "present"]],
  ["Write one rule for a library with a modal passive.", "… must / should be …", ["exactly one sentence", "modal + be + past participle", "a rule"]],
  ["Write two sentences about your phone with two different modal passives.", "two modal passives", ["exactly two sentences", "two different modals", "be + past participle"]],
  ["Write one sentence about a view that can be seen from somewhere.", "… can be seen from …", ["exactly one sentence", "can be seen", "a place"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write three or four rules for a hotel pool. Use can, can't, should and must + be + past participle.", "modal passives for rules", ["can't be", "should be", "three or four sentences"]],
  ["Describe plans for your town next year. What will be built or changed? Write three or four sentences.", "will be + past participle", ["will be", "might be", "three or four sentences"]],
  ["Write three or four sentences about recycling at home: what can be recycled and what should be thrown away?", "can be / should be + past participle", ["can be", "should be", "three or four sentences"]],
  ["Write three or four instructions for looking after a plant or a pet, with should be and must be.", "modal passive instructions", ["should be", "must be", "three or four sentences"]],
  ["Describe a festival in your city. When will it be held, and what can be seen? Write three or four sentences.", "will be held / can be seen", ["will be", "can be", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/passive-causative.modal-passive.modal-be-pp.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "A rule, someone signs it: must be signed.",
   "\"don't throw them away\": possible: can be recycled.",
   "Advice, someone keeps it: should be kept.",
   "\"next year\": future passive: will be finished.",
   "\"if it rains\": maybe: might be cancelled.",
   "\"I need a new one\": impossible: can't be fixed.",
   "Advice before eating: should be washed.",
   "\"by the first of the month\": necessary: has to be paid.",
   "\"tomorrow\": future passive: will be sent.",
   "Possible to see from the window: can be seen.",
   "A future rule, negative: won't be allowed.",
   "Advice when you leave: should be turned off.",
   "\"because of the snow\": maybe: might be delayed.",
   "Possible in two ways: can be bought.",
   "Future plan: will be held.",
   "Advice not to: shouldn't be left.",
   "\"before winter\": necessary: has to be repaired.",
   "\"without a key\": impossible: can't be opened.",
   "On a future day: will be announced.",
   "\"next month\": maybe: might be sold."
  ],
  "build": [
   "should + be + kept (keep → kept).",
   "can + be + recycled.",
   "will + be + finished.",
   "might + be + postponed.",
   "can't + be + fixed, \"Sorry\".",
   "must + be + signed by a parent.",
   "will + be + sent (send → sent).",
   "can + be + seen (see → seen).",
   "won't + be + allowed.",
   "should + be + turned off.",
   "might + be + delayed.",
   "can + be + bought (buy → bought).",
   "will + be + held (hold → held).",
   "shouldn't + be + left (leave → left).",
   "can't + be + opened without a code.",
   "will + be + announced.",
   "might + be + sold (sell → sold).",
   "should + be + cleaned every day.",
   "can't + be + used (no longer possible).",
   "must + be + paid (pay → paid)."
  ],
  "transform": [
   "You can recycle → can be recycled.",
   "They will finish → will be finished.",
   "You should keep → should be kept.",
   "They might postpone → might be postponed.",
   "Nobody can fix → can't be fixed.",
   "be is missing: can be recycled.",
   "Past participle: held, not hold.",
   "After can't use be, not been.",
   "be is missing: should be washed.",
   "Past participle: paid, not pay.",
   "It's possible → can be seen.",
   "It's a good idea → should be watered.",
   "They are going to announce → will be announced.",
   "Maybe they will sell → might be sold.",
   "It's not possible → can't be used."
  ]
 }
};
{
  const byStage = (st) => items.filter((it) => it.stage === st);
  for (const [st, list] of Object.entries(VARIETY.why || {})) {
    if (list.length !== byStage(st).length) throw new Error(`VARIETY: ${st} has ${byStage(st).length} items, ${list.length} whys`);
    byStage(st).forEach((it, i) => { if (list[i]) it.why = list[i]; });
  }
  for (const [st, n, word, name, vals] of VARIETY.slot || []) {
    const it = byStage(st)[n - 1];
    if (!word) { if (!it?.slots?.[name]) throw new Error(`VARIETY: no slot ${name} in ${st} ${n}`); it.slots[name] = [...new Set([...it.slots[name], ...vals])]; continue; }
    const re = new RegExp(`(?<![\\w{])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w}])`, "g");
    let hit = false;
    for (const f of ["prompt", "source", "hint"]) if (it?.[f] && re.test(it[f])) { it[f] = it[f].replace(re, `{${name}}`); hit = true; re.lastIndex = 0; }
    if (!hit) throw new Error(`VARIETY: "${word}" not found in ${st} ${n}`);
    it.slots = { ...(it.slots || {}), [name]: vals };
  }
}
// end variety
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
