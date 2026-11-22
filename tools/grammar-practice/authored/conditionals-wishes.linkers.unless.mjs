// Hand-authored: conditionals-wishes / linkers / unless (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): unless = if … not (You won't pass the exam
// unless you study more.). unless takes a POSITIVE present verb (not "unless you
// don't", not "unless you will").
// Triage: kept. The first conditional (if + present, will) is A2 (zero-first.*);
// here only unless, in first-conditional and general-rule sentences.
// Choose: 14 unless / if / when / so that (although is never offered: "won't X
// although Y" is often English); 6 the verb after unless (leave /
// don't leave / will leave / left).
// Build: "Write unless or if": 14 unless, 6 if.
// Transform: 5 if … not → Unless … / 5 correct the mistake (unless … don't / will) /
// 5 do X. If you don't, … → … unless you X.
//
// Run: node tools/grammar-practice/authored/conditionals-wishes.linkers.unless.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "conditionals-wishes", branch: "linkers", topic: "unless", level: "B1", pv: "2.5" };
const NAME = ["Nodira", "Akmal", "Zarina", "Sherzod"]; // listener names: never printed in a sentence (audit 20 Nov)
const TEAM = ["Sunrise FC", "Blue Star", "Green Valley", "Riverside"];
const WHY = "unless = if … not, with a positive present verb after it.";
const WHY_IF = "The condition is positive here: if.";
const LINK = ["unless", "if", "when", "so that"];

/* ---------------- choose: 20 mcq ---------------- */
// [options, key, prompt, slots]
const CHOOSE = [
  [LINK, "You won't pass the {test} ______ you study more, {name}.", { test: ["exam", "test", "driving test", "quiz"], name: NAME }],
  [LINK, "We'll miss the {bus} ______ we leave now, {name}.", { bus: ["bus", "train", "flight", "start"], name: NAME }],
  [LINK, "I can't help you ______ you tell me the {thing}, {name}.", { thing: ["problem", "truth", "details", "address"], name: NAME }],
  [LINK, "Don't call me ______ it's important. I'm at the {place}, {name}.", { place: ["hospital", "meeting", "cinema", "wedding"], name: NAME }],
  [LINK, "The {plant} will die ______ you water them, {name}.", { plant: ["plants", "flowers", "tomatoes", "roses"], name: NAME }],
  [LINK, "You can't enter the {place} ______ you have a ticket, {name}.", { place: ["museum", "stadium", "concert hall", "zoo"], name: NAME }],
  [LINK, "I'll be there at six ______ the {bus} is late, {name}.", { bus: ["bus", "train", "metro", "taxi"], name: NAME }],
  [LINK, "She won't come to the {event} ______ you invite her, {name}.", { event: ["party", "wedding", "meeting", "dinner"], name: NAME }],
  [LINK, "We'll have the picnic in the {place} ______ it rains, {name}.", { place: ["park", "garden", "mountains", "yard"], name: NAME }],
  [LINK, "You'll get cold ______ you wear a {coat}, {name}.", { coat: ["coat", "jacket", "hat", "scarf"], name: NAME }],
  [LINK, "You can't borrow my {thing} ______ you promise to bring it back, {name}.", { thing: ["car", "laptop", "camera", "bike"], name: NAME }],
  [LINK, "Don't eat the {food} ______ it's fresh, {name}.", { food: ["fish", "meat", "chicken", "eggs"], name: NAME }],
  [LINK, "You can't come into the {place} ______ you take your shoes off, {name}.", { place: ["bedroom", "house", "gym", "classroom"], name: NAME }],
  [LINK, "{team} will lose ______ they play better in the second half, {name}.", { team: TEAM, name: NAME }],
  [["leave", "don't leave", "will leave", "left"], "You'll miss the {bus} unless you ______ now, {name}.", { bus: ["bus", "train", "flight", "start"], name: NAME }],
  [["come", "don't come", "will come", "came"], "I won't go to the {event} unless you ______ too, {name}.", { event: ["party", "wedding", "concert", "match"], name: NAME }],
  [["is", "isn't", "will be", "was"], "We can't start the {thing} unless everyone ______ here, {name}.", { thing: ["meeting", "game", "lesson", "film"], name: NAME }],
  [["speaks", "doesn't speak", "will speak", "spoke"], "He won't get the job unless he ______ {lang}, {name}.", { lang: ["English", "Russian", "Korean", "German"], name: NAME }],
  [["give", "don't give", "will give", "gave"], "The {pet} won't eat unless you ______ it {food}.", { pet: ["cat", "dog", "puppy", "kitten"], food: ["meat", "fish", "chicken", "milk"] }],
  [["have", "don't have", "will have", "had"], "You can't drive a {car} unless you ______ a licence, {name}.", { car: ["car", "bus", "truck", "motorbike"], name: NAME }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write unless or if.";
const BUILD = [
  ["unless", "You'll be late for the {event} ______ you take a taxi, {name}.", { event: ["wedding", "match", "meeting", "concert"], name: NAME }],
  ["unless", "I won't tell {who} ______ you say it's OK, {name}.", { who: ["anyone", "your mum", "the teacher", "Timur"], name: NAME }],
  ["unless", "We'll go to the {place} tomorrow ______ it snows, {name}.", { place: ["beach", "lake", "river", "park"], name: NAME }],
  ["unless", "You can't use the {room} ______ you have a key, {name}.", { room: ["gym", "office", "lab", "music room"], name: NAME }],
  ["unless", "The {food} will go bad ______ you put it in the fridge, {name}.", { food: ["milk", "meat", "fish", "cake"], name: NAME }],
  ["unless", "Don't buy the {thing} ______ it's on sale, {name}.", { thing: ["TV", "sofa", "laptop", "phone"], name: NAME }],
  ["unless", "I always walk ______ it's raining. Then I take the {bus}, {name}.", { bus: ["bus", "metro", "taxi", "tram"], name: NAME }],
  ["unless", "She won't speak to her {who} ______ he says sorry, {name}.", { who: ["brother", "husband", "cousin", "friend"], name: NAME }],
  ["unless", "You won't get better before the {event} ______ you rest, {name}.", { event: ["match", "exam", "wedding", "trip"], name: NAME }],
  ["unless", "They can't win ______ they score in the next {n} minutes, {name}.", { n: ["five", "ten", "two", "three"], name: NAME }],
  ["unless", "I'll see you at the {place} at eight ______ I'm working late, {name}.", { place: ["café", "station", "cinema", "gym"], name: NAME }],
  ["unless", "The {who} won't start ______ we're all quiet, {name}.", { who: ["teacher", "coach", "director", "speaker"], name: NAME }],
  ["unless", "Don't open the {door} ______ you know who it is, {name}.", { door: ["door", "gate", "front door", "back door"], name: NAME }],
  ["unless", "You can't park here ______ you live in this {street}, {name}.", { street: ["street", "building", "block", "area"], name: NAME }],
  ["if", "You'll pass the {test} ______ you study hard, {name}.", { test: ["exam", "test", "driving test", "quiz"], name: NAME }],
  ["if", "Call me ______ you need help with the {work}, {name}.", { work: ["move", "homework", "garden", "car"], name: NAME }],
  ["if", "We'll stay at home ______ it rains on {day}, {name}.", { day: ["Saturday", "Sunday", "Friday", "Monday"], name: NAME }],
  ["if", "I'll buy the {thing} ______ I get my salary on Friday, {name}.", { thing: ["TV", "sofa", "laptop", "phone"], name: NAME }],
  ["if", "The {pet} gets angry ______ you touch its food, {name}.", { pet: ["cat", "dog", "puppy", "kitten"], name: NAME }],
  ["if", "You can sit on the {seat} ______ you're tired, {name}.", { seat: ["bench", "sofa", "chair", "step"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: key === "if" ? WHY_IF : WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const IFNOT = "Rewrite with Unless.";
const FIX = "Correct the mistake.";
const SENT = "Rewrite as one sentence with unless.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [IFNOT, "If you don't hurry, we'll miss the {bus}, {name}.", "______, we'll miss the {bus}, {name}.", "Unless you hurry", { bus: ["bus", "train", "flight", "start"], name: NAME }],
  [IFNOT, "If it doesn't rain, we'll have a picnic in the {place}, {name}.", "______, we'll have a picnic in the {place}, {name}.", "Unless it rains", { place: ["park", "garden", "mountains", "yard"], name: NAME }],
  [IFNOT, "If Lola doesn't study, she won't pass the {test}, {name}.", "______, she won't pass the {test}, {name}.", "Unless Lola studies", { test: ["exam", "test", "driving test", "quiz"], name: NAME }],
  [IFNOT, "If they don't invite me, I won't go to the {event}, {name}.", "______, I won't go to the {event}, {name}.", "Unless they invite me", { event: ["party", "wedding", "concert", "dinner"], name: NAME }],
  [IFNOT, "If you don't water them, the {plant} will die, {name}.", "______, the {plant} will die, {name}.", "Unless you water them", { plant: ["flowers", "roses", "tomatoes", "plants"], name: NAME }],
  [FIX, "We'll miss the {bus} unless you don't hurry, {name}.", "We'll miss the {bus} unless ______, {name}.", "you hurry", { bus: ["bus", "train", "flight", "start"], name: NAME }],
  [FIX, "I won't go to the {event} unless they don't invite me, {name}.", "I won't go to the {event} unless ______, {name}.", "they invite me", { event: ["party", "wedding", "concert", "dinner"], name: NAME }],
  [FIX, "Lola won't pass the {test} unless she doesn't study, {name}.", "Lola won't pass the {test} unless ______, {name}.", "she studies", { test: ["exam", "test", "driving test", "quiz"], name: NAME }],
  [FIX, "We'll start the {thing} at six unless Timur will be late, {name}.", "We'll start the {thing} at six unless ______, {name}.", "Timur is late", { thing: ["meeting", "game", "lesson", "film"], name: NAME }],
  [FIX, "The {pet} won't eat unless you will give it {food}.", "The {pet} won't eat unless ______ it {food}.", "you give", { pet: ["cat", "dog", "puppy", "kitten"], food: ["meat", "fish", "chicken", "milk"] }],
  [SENT, "Take a coat. If you don't, you'll get cold in the {place}, {name}.", "You'll get cold in the {place} ______ a coat, {name}.", "unless you take", { place: ["mountains", "park", "desert", "stadium"], name: NAME }],
  [SENT, "Hurry up! If not, the {shop} will be closed, {name}.", "The {shop} will be closed ______ up, {name}.", "unless you hurry", { shop: ["bank", "post office", "pharmacy", "bakery"], name: NAME }],
  [SENT, "Book now. If you don't, there won't be any seats at the {event}, {name}.", "There won't be any seats at the {event} ______ now, {name}.", "unless you book", { event: ["concert", "match", "show", "festival"], name: NAME }],
  [SENT, "Say sorry. If you don't, your {who} will stay angry, {name}.", "Your {who} will stay angry ______ sorry, {name}.", "unless you say", { who: ["brother", "mother", "friend", "teacher"], name: NAME }],
  [SENT, "Turn left at the {place}. If you don't, you'll get lost, {name}.", "You'll get lost ______ left at the {place}, {name}.", "unless you turn", { place: ["bank", "park", "bazaar", "school"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about an exam with unless.", "You won't pass unless …", ["exactly one sentence", "unless + present simple", "will / won't"]],
  ["Write one sentence about the weather and a plan. Use unless.", "We'll … unless it rains", ["exactly one sentence", "unless", "a plan"]],
  ["Write one rule for a place (a gym, a museum) with unless.", "You can't … unless you …", ["exactly one sentence", "can't … unless", "present"]],
  ["Write one sentence about a habit with never … unless.", "I never … unless …", ["exactly one sentence", "never", "unless + present simple"]],
  ["Write one sentence with if … not, then the same idea with unless.", "if … not = unless", ["exactly two sentences", "if … not", "unless"]],
  ["Write one sentence of warning to a friend with unless.", "You'll … unless you …", ["exactly one sentence", "unless", "a warning"]],
  ["Write one sentence with unless at the start.", "Unless …, …", ["exactly one sentence", "Unless first", "a comma"]],
  ["Write one sentence about your phone or computer with unless.", "It won't work unless …", ["exactly one sentence", "unless", "present simple after unless"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write three or four rules for a new student at your school. Use unless in at least two.", "unless for conditions", ["unless", "can't / won't", "three or four sentences"]],
  ["Give a friend three or four warnings before a mountain trip. Use unless.", "You'll … unless …", ["unless", "will / won't", "three or four sentences"]],
  ["Describe your plans for the weekend. What will you do unless something goes wrong? Write three or four sentences.", "unless + present simple", ["unless", "will", "three or four sentences"]],
  ["Write three or four sentences about your habits with never … unless and always … unless.", "habits with unless", ["never … unless", "unless + present simple", "three or four sentences"]],
  ["Write three or four sentences about learning English: what won't happen unless you work hard?", "won't … unless", ["unless", "won't", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
// Audit 21 Nov (MED/LOW): extra right answers.
const AUDIT_ACC = [
  ["transform", "______ a coat", ["unless you wear", "unless you bring", "unless you have"]],
  ["transform", "will be closed ______ up", ["unless we hurry"]],
  ["transform", "______ now, {name}.", ["unless we book"]],
];
for (const [st, m, acc] of AUDIT_ACC) {
  const hit = items.filter((it) => it.stage === st && [it.prompt, it.source, it.hint].filter(Boolean).join(" ").includes(m));
  if (!hit.length) throw new Error(`AUDIT_ACC: no ${st} item matches ${m}`);
  for (const it of hit) it.acceptable = [...new Set([...(it.acceptable || []), ...acc])];
}
const out = "content/grammar-practice/conditionals-wishes.linkers.unless.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "You won't pass if you don't study more: unless.",
   "We'll miss it if we don't leave now: unless.",
   "I can't help if you don't tell me: unless.",
   "Don't call if it isn't important: unless.",
   "They will die if you don't water them: unless.",
   "You can't enter if you don't have a ticket: unless.",
   "I'll be there if the … isn't late: unless.",
   "She won't come if you don't invite her: unless.",
   "The picnic is on if it doesn't rain: unless.",
   "You'll get cold if you don't wear one: unless.",
   "No borrowing if you don't promise: unless.",
   "Don't eat it if it isn't fresh: unless.",
   "No entry if you don't take your shoes off: unless.",
   "They will lose if they don't play better: unless.",
   "After unless, positive present: leave.",
   "After unless, positive present: come.",
   "After unless, present for the future: everyone is.",
   "After unless + he, present: speaks.",
   "After unless, positive present: give.",
   "After unless, positive present: have."
  ],
  "build": [
   "Late if you don't take a taxi: unless.",
   "I won't tell if you don't say OK: unless.",
   "We'll go if it doesn't snow: unless.",
   "No room use if you don't have a key: unless.",
   "It will go bad if it isn't in the fridge: unless.",
   "Don't buy it if it isn't on sale: unless.",
   "I walk, except when it's raining: unless.",
   "She won't speak if he doesn't say sorry: unless.",
   "You won't get better if you don't rest: unless.",
   "They can't win if they don't score: unless.",
   "I'll see you, except if I'm working late: unless.",
   "It won't start if we aren't quiet: unless.",
   "Don't open if you don't know who: unless.",
   "No parking if you don't live here: unless.",
   "Pass only when you study hard: positive condition: if.",
   "Call when you need help: positive condition: if.",
   "We stay home when it rains: positive condition: if.",
   "I'll buy it when I get paid: positive condition: if.",
   "It gets angry when you touch it: positive condition: if.",
   "Sit when you're tired: positive condition: if."
  ],
  "transform": [
   "If you don't hurry → Unless you hurry.",
   "If it doesn't rain → Unless it rains.",
   "If Lola doesn't study → Unless Lola studies.",
   "If they don't invite me → Unless they invite me.",
   "If you don't water them → Unless you water them.",
   "unless already means if not: you hurry, no don't.",
   "unless already means if not: they invite me.",
   "unless already means if not: she studies.",
   "No will after unless: Timur is late.",
   "No will after unless: you give.",
   "If you don't take a coat → unless you take.",
   "If not (hurry) → unless you hurry.",
   "If you don't book → unless you book.",
   "If you don't say sorry → unless you say.",
   "If you don't turn left → unless you turn."
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
