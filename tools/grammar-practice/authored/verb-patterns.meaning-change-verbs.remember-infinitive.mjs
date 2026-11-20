// Hand-authored: verb-patterns / meaning-change-verbs / remember-infinitive (B1).
// Wave C, C29 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item): remember + to + base = don't forget a task you
// must still do ("Please remember to lock the door when you leave").
// Triage: kept. Sibling remember-gerund (C28) = a memory of the past. One right
// answer: every line is an instruction, a plan or a habit (please / remember / will /
// must / always), never a past question like "Did you remember …", where both can work.
// Choose: to + base / -ing / base / past simple.
// Build: to + the verb in brackets; no source prints "to".
// Transform: 5 correct the mistake / 5 Don't forget: X → Remember to X / 5 It's important
// to X → Remember to X.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/verb-patterns.meaning-change-verbs.remember-infinitive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "meaning-change-verbs", topic: "remember-infinitive", level: "B1", pv: "2.5" };
const NAME = ["Otabek", "Dilnoza", "Ulugbek", "Malika"];
const NAME2 = ["Sardor", "Zarina", "Akmal", "Feruza"];
const T = (base, ing, past) => [`to ${base}`, ing, base, past];
const WHY = (b, cue) => `${cue}: a task still to do, so remember + to + base (to ${b}).`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [T("lock", "locking", "locked"), "Please remember ______ the door when you leave, {name}.", { name: NAME, x: [] }, "\"Please … when you leave\""],
  [T("buy", "buying", "bought"), "Remember ______ some {food} on your way home, {name}.", { food: ["bread", "milk", "eggs", "fruit"], name: NAME2 }, "\"On your way home\" is later"],
  [T("call", "calling", "called"), "I must remember ______ Grandma on her {day}, {name}.", { day: ["birthday", "name day", "anniversary", "holiday"], name: NAME }, "\"I must\" = a duty"],
  [T("take", "taking", "took"), "Remember ______ your passport to the {place}, {name}.", { place: ["airport", "bank", "embassy", "hotel"], name: NAME2 }, "An instruction for the trip"],
  [T("feed", "feeding", "fed"), "Will you remember ______ the {pet} while I'm away?", { pet: ["cat", "dog", "fish", "parrot"], x: [] }, "\"While I'm away\" is the future"],
  [T("water", "watering", "watered"), "Please remember ______ the {plant} every morning, {name}.", { plant: ["flowers", "tomatoes", "roses", "plants"], name: NAME }, "\"Every morning\" from now on"],
  [T("turn", "turning", "turned"), "Always remember ______ off the {thing} before you go to bed.", { thing: ["gas", "lights", "heater", "TV"], x: [] }, "\"Always … before you go to bed\""],
  [T("send", "sending", "sent"), "I'll remember ______ you the photos from {city}, {name}.", { city: ["Samarkand", "Bukhara", "Istanbul", "Khiva"], name: NAME2 }, "\"I'll\" = a promise for later"],
  [T("bring", "bringing", "brought"), "Remember ______ your {thing} to the lesson tomorrow, {name}.", { thing: ["dictionary", "notebook", "laptop", "homework"], name: NAME }, "\"Tomorrow\" is later"],
  [T("wear", "wearing", "wore"), "Remember ______ a hat in the {place} — it's very cold, {name}.", { place: ["mountains", "park", "stadium", "village"], name: NAME2 }, "An instruction for later"],
  [T("pay", "paying", "paid"), "You must remember ______ the {bill} by Friday, {name}.", { bill: ["rent", "phone bill", "school fee", "gas bill"], name: NAME }, "\"By Friday\" = a deadline"],
  [T("check", "checking", "checked"), "Please remember ______ your answers before you finish the {test}.", { test: ["exam", "test", "quiz", "form"], x: [] }, "\"Before you finish\" is later"],
  [T("say", "saying", "said"), "Remember ______ thank you to your {who}, {name}.", { who: ["aunt", "teacher", "host", "grandmother"], name: NAME2 }, "A reminder about good manners"],
  [T("close", "closing", "closed"), "Remember ______ the windows if it starts to rain, {name}.", { name: NAME, x: [] }, "\"If it starts to rain\" is later"],
  [T("charge", "charging", "charged"), "I always remember ______ my {thing} at night.", { thing: ["phone", "laptop", "watch", "tablet"], x: [] }, "\"Always\" = a habit, a task each night"],
  [T("drink", "drinking", "drank"), "Remember ______ a lot of water in the {place}, {name}.", { place: ["desert", "heat", "gym", "mountains"], name: NAME2 }, "An instruction for later"],
  [T("write", "writing", "wrote"), "I hope he remembers ______ his name on the {form}.", { form: ["form", "test", "list", "card"], x: [] }, "\"I hope he will\" = a task he must not forget"],
  [T("ask", "asking", "asked"), "Remember ______ the {who} about the homework, {name}.", { who: ["teacher", "tutor", "coach", "librarian"], name: NAME }, "A task for later"],
  [T("book", "booking", "booked"), "We must remember ______ the hotel in {city} soon, {name}.", { city: ["Bukhara", "Khiva", "Istanbul", "Dubai"], name: NAME2 }, "\"Soon\" = later"],
  [T("give", "giving", "gave"), "Please remember ______ this letter to your {who}.", { who: ["mother", "teacher", "boss", "neighbour"], x: [] }, "\"Please\" = a request for later"],
].map(([o, prompt, slots, cue], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY(o[0].slice(3), cue), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "It is a task. Complete with to + the verb in brackets.";
// no source prints "to"
const BUILD = [
  ["to lock", "Please remember ______ (lock) the {thing} at night, {name}.", { thing: ["door", "gate", "car", "garage"], name: NAME }],
  ["to buy", "Remember ______ (buy) {food} at the bazaar, {name}.", { food: ["bread", "melons", "rice", "onions"], name: NAME2 }],
  ["to call", "I must remember ______ (call) the {who} on Monday.", { who: ["dentist", "bank", "school", "plumber"], x: [] }],
  ["to take", "Remember ______ (take) your {pills} after dinner, {name}.", { pills: ["pills", "vitamins", "medicine", "drops"], name: NAME }],
  ["to feed", "Will you remember ______ (feed) the {pet}, {name}?", { pet: ["cat", "dog", "fish", "parrot"], name: NAME2 }],
  ["to switch", "Remember ______ (switch) off the {thing} when you leave, {name}.", { thing: ["lights", "computer", "heater", "fan"], name: NAME }],
  ["to send", "I'll remember ______ (send) you the {doc}, {name}.", { doc: ["photos", "address", "link", "report"], name: NAME2 }],
  ["to bring", "Remember ______ (bring) your {thing} on Friday, {name}.", { thing: ["passport", "ticket", "swimsuit", "laptop"], name: NAME }],
  ["to pay", "You must remember ______ (pay) for the {thing} online.", { thing: ["tickets", "course", "hotel", "parking"], x: [] }],
  ["to wear", "Always remember ______ (wear) a seat belt in the {car}, {name}.", { car: ["car", "taxi", "bus", "van"], name: NAME2 }],
  ["to check", "Please remember ______ (check) the {thing} before the trip.", { thing: ["tyres", "tickets", "weather", "oil"], x: [] }],
  ["to thank", "Remember ______ (thank) your {who} for the present, {name}.", { who: ["aunt", "uncle", "grandma", "teacher"], name: NAME }],
  ["to close", "Please remember ______ (close) the {thing} behind you, {name}.", { thing: ["door", "gate", "fridge", "window"], name: NAME2 }],
  ["to drink", "Always remember ______ (drink) water during the {sport}.", { sport: ["match", "training", "race", "game"], x: [] }],
  ["to clean", "Remember ______ (clean) your {thing} before the guests come, {name}.", { thing: ["room", "shoes", "desk", "kitchen"], name: NAME }],
  ["to write", "I hope she remembers ______ (write) her address on the {form}.", { form: ["form", "parcel", "list", "card"], x: [] }],
  ["to ask", "Remember ______ (ask) the {who} about the price, {name}.", { who: ["driver", "seller", "manager", "guide"], name: NAME2 }],
  ["to book", "We must remember ______ (book) a table at the {place}, {name}.", { place: ["restaurant", "café", "chaikhana", "hotel"], name: NAME }],
  ["to give", "Please remember ______ (give) the {who} the keys back.", { who: ["owner", "landlord", "neighbour", "caretaker"], x: [] }],
  ["to post", "Remember ______ (post) this letter on your way {where}, {name}.", { where: ["home", "out", "back", "home tonight"], name: NAME2 }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: `It is a task still to do, so remember + to + base: ${key}.`, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const FORGET = "Rewrite with Remember + to.";
const IMP = "Rewrite the advice with Remember + to.";
const TRANSFORM = [
  [FIX, "Please remember locking the {thing} tonight, {name}.", "Please remember ______ the {thing} tonight, {name}.", "to lock", { thing: ["door", "gate", "car", "garage"], name: NAME }, "A task for tonight: remember to lock."],
  [FIX, "Remember buy some {food} on your way home, {name}.", "Remember ______ some {food} on your way home, {name}.", "to buy", { food: ["bread", "milk", "eggs", "fruit"], name: NAME2 }, "remember + to + base: don't forget \"to\"."],
  [FIX, "I must remember calling the {who} tomorrow, {name}.", "I must remember ______ the {who} tomorrow, {name}.", "to call", { who: ["dentist", "bank", "school", "plumber"], name: NAME }, "A task for tomorrow: remember to call."],
  [FIX, "Always remember turned off the {thing}, {name}.", "Always remember ______ off the {thing}, {name}.", "to turn", { thing: ["gas", "lights", "heater", "TV"], name: NAME2 }, "remember + to + base: to turn."],
  [FIX, "Will you remember feeding the {pet} tomorrow, {name}?", "Will you remember ______ the {pet} tomorrow, {name}?", "to feed", { pet: ["cat", "dog", "fish", "parrot"], name: NAME }, "A task for tomorrow: remember to feed."],
  [FORGET, "Don't forget: bring your {thing} tomorrow, {name}.", "Remember ______ your {thing} tomorrow, {name}.", "to bring", { thing: ["passport", "ticket", "swimsuit", "laptop"], name: NAME2 }, "Don't forget X = Remember to X."],
  [FORGET, "Don't forget: water the {plant} on Sunday, {name}.", "Remember ______ the {plant} on Sunday, {name}.", "to water", { plant: ["flowers", "tomatoes", "roses", "plants"], name: NAME }, "Don't forget X = Remember to X."],
  [FORGET, "Don't forget: pay the {bill} this week, {name}.", "Remember ______ the {bill} this week, {name}.", "to pay", { bill: ["rent", "phone bill", "school fee", "gas bill"], name: NAME2 }, "Don't forget X = Remember to X."],
  [FORGET, "Don't forget: send me the {doc} tonight, {name}.", "Remember ______ me the {doc} tonight, {name}.", "to send", { doc: ["photos", "address", "link", "report"], name: NAME }, "Don't forget X = Remember to X."],
  [FORGET, "Don't forget: ask your {who} about Saturday, {name}.", "Remember ______ your {who} about Saturday, {name}.", "to ask", { who: ["mum", "dad", "teacher", "boss"], name: NAME2 }, "Don't forget X = Remember to X."],
  [IMP, "Take an umbrella. It may rain at the {place}, {name}.", "Remember ______ an umbrella. It may rain at the {place}, {name}.", "to take", { place: ["park", "station", "match", "bazaar"], name: NAME }, "An important task: remember to take."],
  [IMP, "You need a helmet on your {bike}. Wear it, {name}.", "Remember ______ a helmet on your {bike}, {name}.", "to wear", { bike: ["bike", "scooter", "motorbike", "horse"], name: NAME2 }, "An important task: remember to wear."],
  [IMP, "Please check the {thing} before the trip. It's important, {name}.", "Remember ______ the {thing} before the trip, {name}.", "to check", { thing: ["tyres", "tickets", "weather", "oil"], name: NAME }, "An important task: remember to check."],
  [IMP, "It's important that you thank the {who}, {name}.", "Remember ______ the {who}, {name}.", "to thank", { who: ["host", "driver", "teacher", "doctor"], name: NAME2 }, "An important task: remember to thank."],
  [IMP, "You should drink water in the {place}, {name}.", "Remember ______ water in the {place}, {name}.", "to drink", { place: ["desert", "gym", "heat", "mountains"], name: NAME }, "An important task: remember to drink."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one reminder for a friend who is going on a trip.", "Remember to …", ["exactly one sentence", "remember + to + base", "a task"]],
  ["Write one sentence about something you must remember to do tomorrow.", "I must remember to …", ["exactly one sentence", "remember to", "tomorrow"]],
  ["Write one sentence with Always remember to ….", "Always remember to …", ["exactly one sentence", "always remember to", "base verb"]],
  ["Write one sentence with remember to and one with remember + -ing.", "task vs memory", ["exactly two sentences", "remember to + base", "remember + -ing"]],
  ["Write one question: Will you remember to …?", "Will you remember to …?", ["exactly one question", "remember to", "a question mark"]],
  ["Write one reminder from a parent to a child.", "Remember to …", ["exactly one sentence", "remember to", "base verb"]],
  ["Write one sentence with Please remember to ….", "Please remember to …", ["exactly one sentence", "please remember to", "base verb"]],
  ["Write one sentence about a rule at your school with remember to.", "Remember to …", ["exactly one sentence", "remember to", "a rule"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Your little brother is staying at home alone. Write three or four reminders with remember to.", "remember + to", ["remember to", "base verbs", "three or four sentences"]],
  ["Write a short note (three or four sentences) to a neighbour who is looking after your flat.", "Please remember to …", ["remember to", "please", "three or four sentences"]],
  ["Write three or four tips for a student before an exam with remember to.", "remember + to", ["remember to", "always", "three or four sentences"]],
  ["Write three or four sentences about things you must remember to do this week.", "I must remember to …", ["remember to", "must", "three or four sentences"]],
  ["Write three or four sentences: one memory (remember + -ing) and some tasks (remember to).", "memory vs task", ["remember + -ing", "remember to", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.meaning-change-verbs.remember-infinitive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
