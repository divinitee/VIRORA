// Hand-authored: modals / past-modals / must-have (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): must have + past participle when the speaker
// is SURE about the PAST from evidence now (The ground is wet. It must have rained.).
// Triage: kept. Siblings might-have (not sure) and should-have (criticism); the
// present form is must-present. Every line gives strong present evidence.
// Choose: one verb in four shapes: must have + pp / must + base / must had + pp /
// must have + base (cost → "must have costed").
// Build: must have + the verb in brackets; no source prints must, have or the pp.
// Transform: 5 I'm sure + past simple → must have / 5 correct the mistake /
// 5 I'm sure … was / were → must have been.
//
// Run: node tools/grammar-practice/authored/modals.past-modals.must-have.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "past-modals", topic: "must-have", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const PP = { rain: "rained", forget: "forgotten", leave: "left", go: "gone", eat: "eaten", win: "won", lose: "lost", study: "studied", see: "seen", take: "taken", be: "been", break: "broken", hear: "heard", drive: "driven", sleep: "slept", cost: "cost", buy: "bought", finish: "finished", get: "got", meet: "met", fall: "fallen" };
const WHY = (v) => `Sure about the past, from what you see now: must have + past participle (must have ${PP[v]}).`;
const opts = (v) => [`must have ${PP[v]}`, `must ${v}`, `must had ${PP[v]}`, PP[v] === v ? `must have ${v}ed` : `must have ${v}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["rain", "The {thing} is wet. It ______ during the night, {name}.", { thing: ["ground", "road", "grass", "garden"], name: NAME }],
  ["forget", "Aziz didn't come to the {event}. He ______ about it, {name}.", { event: ["meeting", "lesson", "party", "match"], name: NAME }],
  ["leave", "The door of the {place} is open. Someone ______ it open, {name}.", { place: ["office", "garage", "classroom", "shop"], name: NAME }],
  ["go", "The lights in their {home} are off. They ______ to bed, {name}.", { home: ["flat", "house", "room", "dacha"], name: NAME }],
  ["eat", "There's no {food} left. The children ______ it all, {name}.", { food: ["cake", "plov", "bread", "soup"], name: NAME }],
  ["win", "Timur is smiling and holding a {prize}. He ______ the match, {name}.", { prize: ["cup", "medal", "trophy", "prize"], name: NAME }],
  ["lose", "Lola can't find her {thing}. She ______ it on the bus, {name}.", { thing: ["phone", "bag", "key", "ticket"], name: NAME }],
  ["study", "Olga got 100% in the {test}. She ______ very hard, {name}.", { test: ["exam", "test", "quiz", "IELTS exam"], name: NAME }],
  ["see", "He knows the end of the {film}. He ______ it before, {name}.", { film: ["film", "series", "show", "play"], name: NAME }],
  ["take", "My {thing} isn't here. Someone ______ it, {name}.", { thing: ["umbrella", "pen", "coat", "charger"], name: NAME }],
  ["be", "You walked {dist} yesterday. That ______ tiring, {name}.", { dist: ["thirty kilometres", "all day", "for ten hours", "up the mountain"], name: NAME }],
  ["break", "There's glass all over the {room} floor. Someone ______ a window, {name}.", { room: ["kitchen", "classroom", "hall", "bathroom"], name: NAME }],
  ["hear", "Everyone knows the news about the {event}. They ______ it on the radio, {name}.", { event: ["wedding", "match", "prize", "new school"], name: NAME }],
  ["drive", "His {car} is covered in dust. He ______ a long way, {name}.", { car: ["car", "van", "jeep", "truck"], name: NAME }],
  ["sleep", "You look great this {time}. You ______ well, {name}.", { time: ["morning", "Monday", "weekend", "week"], name: NAME }],
  ["cost", "That {thing} looks very expensive. It ______ a lot, {name}.", { thing: ["watch", "car", "dress", "sofa"], name: NAME }],
  ["buy", "There are new {thing} in the kitchen. Mum ______ them yesterday, {name}.", { thing: ["cups", "plates", "chairs", "curtains"], name: NAME }],
  ["finish", "Aziz is watching TV. He ______ his {work}, {name}.", { work: ["homework", "essay", "project", "report"], name: NAME }],
  ["get", "The {thing} are white this morning. It ______ very cold last night, {name}.", { thing: ["streets", "roofs", "cars", "fields"], name: NAME }],
  ["meet", "Madina knows your brother. She ______ him at the {event}, {name}.", { event: ["wedding", "party", "university", "concert"], name: NAME }],
].map(([v, prompt, slots], i) => {
  const o = opts(v);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY(v), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "You are sure about the past. Complete with must have and the verb in brackets.";
const BUILD = [
  ["rain", "The {thing} is wet. It ______ (rain) in the night, {name}.", { thing: ["road", "grass", "garden", "ground"], name: NAME }],
  ["forget", "Aziz isn't at the {event}. He ______ (forget) about it, {name}.", { event: ["meeting", "lesson", "party", "match"], name: NAME }],
  ["leave", "The {place} door is open. Someone ______ (leave) it open, {name}.", { place: ["office", "garage", "kitchen", "shop"], name: NAME }],
  ["go", "It's very quiet in the {home}. They ______ (go) out, {name}.", { home: ["flat", "house", "office", "yard"], name: NAME }],
  ["eat", "The {food} is gone. The dog ______ (eat) it, {name}.", { food: ["meat", "sausage", "chicken", "cheese"], name: NAME }],
  ["win", "The {team} fans are singing. Their team ______ (win), {name}.", { team: ["Pakhtakor", "Nasaf", "Bunyodkor", "Navbahor"], name: NAME }],
  ["lose", "I can't find my {thing}. I ______ (lose) it at the {place}.", { thing: ["phone", "wallet", "key", "ticket"], place: ["bazaar", "station", "park", "gym"] }],
  ["study", "Olga knows all the answers to the {test}. She ______ (study) a lot, {name}.", { test: ["exam", "test", "quiz", "homework"], name: NAME }],
  ["see", "He knows how the {film} ends. He ______ (see) it, {name}.", { film: ["film", "series", "show", "play"], name: NAME }],
  ["take", "My {thing} is not on the desk. Somebody ______ (take) it, {name}.", { thing: ["pen", "phone", "book", "charger"], name: NAME }],
  ["be", "Your trip to {city} took twenty hours. It ______ (be) tiring, {name}.", { city: ["Moscow", "Almaty", "Istanbul", "Seoul"], name: NAME }],
  ["break", "There's glass on the {room} floor. Somebody ______ (break) a glass, {name}.", { room: ["kitchen", "bathroom", "hall", "café"], name: NAME }],
  ["drive", "His {car} is very dirty. He ______ (drive) through the mountains, {name}.", { car: ["car", "van", "jeep", "truck"], name: NAME }],
  ["sleep", "You look very fresh this {time}. You ______ (sleep) well, {name}.", { time: ["morning", "Monday", "Sunday", "weekend"], name: NAME }],
  ["cost", "That {thing} is beautiful. It ______ (cost) a lot, {name}.", { thing: ["watch", "carpet", "dress", "sofa"], name: NAME }],
  ["buy", "There are new {thing} in the kitchen. Mum ______ (buy) them, {name}.", { thing: ["cups", "plates", "chairs", "curtains"], name: NAME }],
  ["finish", "Timur is playing games. He ______ (finish) his {work}, {name}.", { work: ["homework", "essay", "project", "report"], name: NAME }],
  ["meet", "Madina knows your cousin. She ______ (meet) him at the {event}, {name}.", { event: ["wedding", "party", "university", "concert"], name: NAME }],
  ["hear", "Everyone knows about the {event}. They ______ (hear) the news, {name}.", { event: ["wedding", "match", "prize", "new school"], name: NAME }],
  ["fall", "There are apples all over the {place}. They ______ (fall) from the tree, {name}.", { place: ["garden", "grass", "yard", "road"], name: NAME }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `must have ${PP[v]}`, why: WHY(v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SURE = "Rewrite with must have + past participle.";
const FIX = "Correct the mistake.";
const BEEN = "Rewrite with must have been.";
// [instr, source, hint, verb, slots]
const TRANSFORM = [
  [SURE, "I'm sure it rained last night, {name}. The {thing} is wet.", "It ______ last night, {name}. The {thing} is wet.", "rain", { thing: ["ground", "road", "grass", "garden"], name: NAME }],
  [SURE, "I'm sure he forgot about the {event}, {name}.", "He ______ about the {event}, {name}.", "forget", { event: ["meeting", "lesson", "party", "match"], name: NAME }],
  [SURE, "I'm sure they went home early from the {event}, {name}.", "They ______ home early from the {event}, {name}.", "go", { event: ["wedding", "party", "concert", "meeting"], name: NAME }],
  [SURE, "I'm sure she studied hard for the {test}, {name}.", "She ______ hard for the {test}, {name}.", "study", { test: ["exam", "test", "quiz", "IELTS exam"], name: NAME }],
  [SURE, "I'm sure the {thing} cost a lot, {name}.", "The {thing} ______ a lot, {name}.", "cost", { thing: ["watch", "carpet", "dress", "sofa"], name: NAME }],
  [FIX, "It must rained last night. The {thing} is wet, {name}.", "It ______ last night. The {thing} is wet, {name}.", "rain", { thing: ["ground", "road", "grass", "garden"], name: NAME }],
  [FIX, "He must have forget about the {event}, {name}.", "He ______ about the {event}, {name}.", "forget", { event: ["meeting", "lesson", "party", "match"], name: NAME }],
  [FIX, "They must had gone to bed. The {home} is dark, {name}.", "They ______ to bed. The {home} is dark, {name}.", "go", { home: ["flat", "house", "room", "dacha"], name: NAME }],
  [FIX, "She must has lost her {thing} on the bus, {name}.", "She ______ her {thing} on the bus, {name}.", "lose", { thing: ["phone", "bag", "key", "ticket"], name: NAME }],
  [FIX, "You must have eat all the {food}, {name}!", "You ______ all the {food}, {name}!", "eat", { food: ["cake", "plov", "bread", "soup"], name: NAME }],
  [BEEN, "I'm sure the trip to {city} was tiring, {name}.", "The trip to {city} ______ tiring, {name}.", "be", { city: ["Moscow", "Almaty", "Istanbul", "Seoul"], name: NAME }],
  [BEEN, "I'm sure you were tired after the {event}, {name}.", "You ______ tired after the {event}, {name}.", "be", { event: ["wedding", "match", "flight", "exam"], name: NAME }],
  [BEEN, "I'm sure the {test} was difficult, {name}.", "The {test} ______ difficult, {name}.", "be", { test: ["exam", "test", "quiz", "interview"], name: NAME }],
  [BEEN, "I'm sure they were happy at the {event}, {name}.", "They ______ happy at the {event}, {name}.", "be", { event: ["wedding", "party", "concert", "festival"], name: NAME }],
  [BEEN, "I'm sure it was cold in the {place} last night, {name}.", "It ______ cold in the {place} last night, {name}.", "be", { place: ["mountains", "tent", "desert", "village"], name: NAME }],
].map(([instr, source, hint, v, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `must have ${PP[v]}`, why: WHY(v), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["The street is wet this morning. Write one sentence about last night. Use must have.", "It must have rained", ["exactly one sentence", "must have + past participle", "a past event"]],
  ["Your friend didn't come to class yesterday. Write one sentence with must have.", "He must have been ill / forgotten", ["exactly one sentence", "must have + past participle", "a reason"]],
  ["There's no cake left. Write one sentence with must have.", "Someone must have eaten it", ["exactly one sentence", "must have + past participle", "past"]],
  ["Your classmate got the top mark. Write one sentence with must have.", "She must have studied hard", ["exactly one sentence", "must have + past participle", "a reason"]],
  ["Write one sentence with must have been.", "must have been + adjective", ["exactly one sentence", "must have been", "past"]],
  ["Write two sentences: what you see now, then what must have happened.", "evidence + must have", ["exactly two sentences", "first: present evidence", "second: must have + past participle"]],
  ["Write one sentence with must have and an irregular verb (gone, eaten, lost, taken…).", "must have + irregular past participle", ["exactly one sentence", "irregular past participle", "must have"]],
  ["Write one sentence with must (present) and one with must have (past).", "must vs must have", ["exactly two sentences", "must + base verb", "must have + past participle"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You come home and the kitchen is a mess. Write three or four sentences about what must have happened.", "must have + past participle", ["must have", "evidence", "three or four sentences"]],
  ["Your neighbour has a new car and looks very happy. Write three or four sentences with must have.", "must have for past deduction", ["must have", "past participles", "three or four sentences"]],
  ["Describe a photo of people after a long trip. What must have happened? Write three or four sentences.", "must have / must have been", ["must have", "must have been", "three or four sentences"]],
  ["A friend arrived very late to dinner. Write three or four sentences guessing why, when you are sure.", "must have + past participle", ["must have", "a reason", "three or four sentences"]],
  ["Write three or four sentences about an old house you visited. What must have happened there?", "must have for past deduction", ["must have", "must have been", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.past-modals.must-have.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
