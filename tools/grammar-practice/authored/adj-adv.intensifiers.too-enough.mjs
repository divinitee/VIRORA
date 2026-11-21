// Hand-authored: adj-adv / intensifiers / too-enough (B1).
// Wave C, C35 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement items): too + adjective (= more than is OK), adjective +
// enough (enough comes AFTER an adjective), enough + noun (BEFORE a noun), with
// to + verb / for + person.
// One right answer: "hot enough" and "too hot" are both English, so every line has a
// clue that rules the other one out (I'll wait five minutes / he's only fifteen /
// so my dad helped). "very hot to drink" and "too much hot" are never offered as keys;
// "very" is not used as a distractor (some speakers say "very heavy to carry").
// "time enough / money enough" (old-fashioned but English) is never offered as wrong.
// Choose: 8 too + adj, 7 adj + enough, 5 enough + noun.
// Build: 20 typed, too or enough + the word in brackets.
// Transform: two-word array keys, so word order is tested: very X, so I can't → too X /
// too young → not old enough / not big enough → too small.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/adj-adv.intensifiers.too-enough.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "intensifiers", topic: "too-enough", level: "B1", pv: "2.5" };
const NAME = ["Malika", "Ulugbek", "Nodira", "Jamshid"];
const NAME2 = ["Zarina", "Otabek", "Dilnoza", "Sherzod"];
const TOO = (a) => [`too ${a}`, `${a} enough`, `enough ${a}`, `too much ${a}`];
const ENA = (a) => [`${a} enough`, `enough ${a}`, `too ${a}`, `${a} too`];
const ENN = (n) => [`enough ${n}`, `enough of ${n}`, `too ${n}`, `the enough ${n}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [TOO("hot"), "This {drink} is ______ to drink. I'll wait a few minutes, {name}.", { drink: ["tea", "coffee", "soup", "milk"], name: NAME }, "You have to wait, so it is more hot than is OK: too hot."],
  [ENA("old"), "My brother isn't ______ to drive yet. He's only {age}.", { age: ["fourteen", "fifteen", "sixteen", "twelve"], name: NAME2 }, "He is only fifteen: not old enough. enough goes after the adjective."],
  [TOO("heavy"), "The {box} was ______ for me to carry, so my dad helped me, {name}.", { box: ["box", "suitcase", "bag", "table"], name: NAME }, "Dad had to help, so it was more than I could carry: too heavy."],
  [ENA("warm"), "Is the {water} ______ to swim in, {name}? It looks cold.", { water: ["lake", "sea", "river", "pool"], name: NAME2 }, "It looks cold, so you ask if it is warm enough: enough after warm."],
  [ENN("time"), "We didn't have ______ to finish the {test}, {name}.", { test: ["exam", "test", "quiz", "project"], name: NAME }, "enough goes before a noun: enough time."],
  [TOO("cold"), "It's ______ to go out without a coat today, {name}.", { name: NAME2, day: [] }, "You need a coat, so it is colder than is OK: too cold."],
  [ENA("tall"), "My little sister is ______ to reach the top shelf now, {name}. She grew a lot this year.", { name: NAME, x: [] }, "She grew, so now she can reach it: tall enough."],
  [ENN("eggs"), "Have we got ______ for {dish}, {name}?", { dish: ["a cake", "an omelette", "pancakes", "cookies"], name: NAME2 }, "enough goes before the noun: enough eggs."],
  [["too scary", "enough scary", "too much scary", "scary too"], "The {film} was ______ for the children, so we left early.", { film: ["film", "show", "story", "game"], name: NAME }, "You left early, so it was more scary than is OK: too scary."],
  [ENA("fast"), "I'm not ______ to win the {race}, but I'll try, {name}.", { race: ["race", "marathon", "competition", "match"], name: NAME2 }, "\"but I'll try\" = I may lose: not fast enough."],
  [TOO("small"), "This {thing} is ______ for me. Have you got a bigger one, {name}?", { thing: ["shirt", "jacket", "T-shirt", "coat"], name: NAME }, "You want a bigger one: too small."],
  [ENN("money"), "Did you bring ______ for the {ticket}, {name}?", { ticket: ["bus", "metro", "cinema", "museum"], name: NAME2 }, "enough goes before the noun: enough money."],
  [TOO("noisy"), "The {room} was ______ to sleep in. There was a party next door, {name}.", { room: ["hotel room", "flat", "bedroom", "tent"], name: NAME }, "The party stopped your sleep: too noisy."],
  [ENA("wide"), "The {gap} wasn't ______ for our car, so we parked down the street.", { gap: ["space", "gate", "garage", "road"], name: NAME2 }, "You had to park somewhere else: not wide enough."],
  [ENN("space"), "There isn't ______ in the {place} for a sofa, {name}.", { place: ["room", "flat", "hall", "kitchen"], name: NAME }, "enough goes before the noun: enough space."],
  [ENA("loudly"), "The {who} spoke ______ for everyone to hear. The hall was quiet.", { who: ["teacher", "guide", "speaker", "director"], name: NAME2 }, "Everyone heard: loudly enough (enough after an adverb too)."],
  [TOO("tight"), "These {shoes} are ______ to walk in. My feet hurt, {name}.", { shoes: ["shoes", "boots", "jeans", "trainers"], name: NAME }, "Your feet hurt: too tight."],
  [ENN("petrol"), "We've got ______ for the drive to {city}. Let's go, {name}!", { city: ["Samarkand", "Bukhara", "Namangan", "Termez"], name: NAME2 }, "enough goes before the noun: enough petrol."],
  [ENA("good"), "My English isn't ______ for the {test} yet, so I study every day.", { test: ["IELTS", "exam", "interview", "course"], name: NAME }, "You still need to study: not good enough."],
  [TOO("tired"), "After the {event}, I was ______ to cook, so we ordered pizza, {name}.", { event: ["match", "trip", "long day", "move"], name: NAME2 }, "You didn't cook: too tired."],
].map(([o, prompt, slots, why], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && prompt.includes(`{${n}}`)) s[n] = f;
  let p = prompt;
  if (!s.name) { s.name = slots.name || NAME; p = p.replace(/\.$/, ", {name}."); }
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete with too or enough and the word in brackets.";
const BUILD = [
  ["too hot", "The {drink} is ______ (hot) to drink. Let's wait a few minutes, {name}.", { drink: ["tea", "coffee", "soup", "milk"], name: NAME }, "You have to wait: too + adjective."],
  ["old enough", "My cousin isn't ______ (old) to vote. He's only {age}.", { age: ["sixteen", "fifteen", "fourteen", "seventeen"], name: NAME2 }, "He is only sixteen: not old enough (adjective + enough)."],
  ["too heavy", "The {box} is ______ (heavy) for one person. Can you help me, {name}?", { box: ["box", "suitcase", "sofa", "table"], name: NAME }, "You need help: too heavy for one person."],
  ["warm enough", "It's ______ (warm) to eat outside today, so let's take the food to the {place}.", { place: ["garden", "park", "river", "yard"], name: NAME2 }, "We eat outside, so the weather is OK: warm enough."],
  ["enough time", "Hurry up! We don't have ______ (time) to stop at the {place}, {name}.", { place: ["shop", "café", "bazaar", "bank"], name: NAME }, "enough + noun: enough time."],
  ["too small", "This {thing} is ______ (small) for me. I need a bigger size, {name}.", { thing: ["shirt", "jacket", "coat", "dress"], name: NAME2 }, "You need a bigger size: too small."],
  ["tall enough", "My son is ______ (tall) to go on the {ride} now. He grew a lot this year, {name}.", { ride: ["rollercoaster", "big slide", "Ferris wheel", "water slide"], name: NAME }, "He grew, so now he can: tall enough."],
  ["enough chairs", "There aren't ______ (chairs) for all the guests at the {event}.", { event: ["wedding", "party", "meeting", "concert"], name: NAME2 }, "enough + noun: enough chairs."],
  ["too tired", "I was ______ (tired) to cook, so we ordered {food}, {name}.", { food: ["pizza", "plov", "burgers", "lagman"], name: NAME }, "You didn't cook: too tired."],
  ["fast enough", "He ran ______ (fast) to catch the {bus}. He got on just in time.", { bus: ["bus", "train", "metro", "tram"], name: NAME2 }, "He got on in time: fast enough."],
  ["too expensive", "The {thing} was ______ (expensive) for us, so we didn't buy it, {name}.", { thing: ["car", "sofa", "phone", "flat"], name: NAME }, "You didn't buy it: too expensive."],
  ["enough money", "Have you got ______ (money) for the {ticket} ticket, {name}?", { ticket: ["bus", "metro", "cinema", "museum"], name: NAME2 }, "enough + noun: enough money."],
  ["too late", "It's ______ (late) to call {who} now. Call tomorrow, {name}.", { who: ["grandma", "the doctor", "your teacher", "the shop"], name: NAME }, "Call tomorrow: too late now."],
  ["big enough", "Our flat isn't ______ (big) for a {thing}. We need a garden, {name}.", { thing: ["dog", "piano", "trampoline", "pool table"], name: NAME2 }, "You need more room: not big enough."],
  ["too noisy", "The {place} was ______ (noisy). I couldn't hear my friend, {name}.", { place: ["café", "bus", "party", "street"], name: NAME }, "You couldn't hear: too noisy."],
  ["enough eggs", "We haven't got ______ (eggs) for {dish}, {name}. Can you go to the shop?", { dish: ["a cake", "an omelette", "pancakes", "cookies"], name: NAME2 }, "enough + noun: enough eggs."],
  ["too difficult", "The {test} was ______ (difficult) for me. I didn't finish it, {name}.", { test: ["exam", "test", "quiz", "puzzle"], name: NAME }, "You didn't finish: too difficult."],
  ["good enough", "Your work is ______ (good) to pass the {test}. Well done, {name}!", { test: ["exam", "course", "test", "interview"], name: NAME2 }, "Well done = you pass: good enough."],
  ["too young", "My little brother is ______ (young) to watch that {film}, {name}.", { film: ["film", "series", "show", "programme"], name: NAME }, "He is little: too young."],
  ["enough petrol", "Is there ______ (petrol) in the car to get to {city}, {name}?", { city: ["Samarkand", "Bukhara", "Namangan", "Termez"], name: NAME2 }, "enough + noun: enough petrol."],
].map(([key, source, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && source.includes(`{${n}}`)) s[n] = f;
  let src = source;
  if (!s.name) { s.name = slots.name || NAME2; src = src.replace(/\.$/, ", {name}."); }
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, array keys (word order) ---------------- */
const T1 = "Rewrite with too. Write one word in each gap.";
const T2 = "Rewrite with enough. Write one word in each gap.";
const T3 = "Rewrite with too and the opposite adjective. Write one word in each gap.";
const TRANSFORM = [
  [T1, "The {drink} is very hot. I can't drink it, {name}.", "The {drink} is ______ ______ to drink, {name}.", ["too", "hot"], { drink: ["tea", "coffee", "soup", "milk"], name: NAME }, "very hot + can't → too hot to drink."],
  [T1, "The {box} is very heavy. I can't carry it, {name}.", "The {box} is ______ ______ to carry, {name}.", ["too", "heavy"], { box: ["box", "suitcase", "bag", "sofa"], name: NAME2 }, "very heavy + can't → too heavy to carry."],
  [T1, "It's very cold. We can't swim in the {water} today, {name}.", "It's ______ ______ to swim in the {water} today, {name}.", ["too", "cold"], { water: ["lake", "sea", "river", "pool"], name: NAME }, "very cold + can't → too cold to swim."],
  [T1, "The {test} was very difficult. I couldn't finish it, {name}.", "The {test} was ______ ______ to finish, {name}.", ["too", "difficult"], { test: ["exam", "test", "quiz", "puzzle"], name: NAME2 }, "very difficult + couldn't → too difficult to finish."],
  [T1, "I was very tired. I couldn't go to the {event}, {name}.", "I was ______ ______ to go to the {event}, {name}.", ["too", "tired"], { event: ["party", "concert", "match", "gym"], name: NAME }, "very tired + couldn't → too tired to go."],
  [T2, "My brother is too young to drive the {car}, {name}.", "My brother isn't ______ ______ to drive the {car}, {name}.", ["old", "enough"], { car: ["car", "bus", "truck", "tractor"], name: NAME2 }, "too young = not old enough; enough after the adjective."],
  [T2, "The water in the {water} is too cold for swimming, {name}.", "The water in the {water} isn't ______ ______ for swimming, {name}.", ["warm", "enough"], { water: ["lake", "sea", "river", "pool"], name: NAME }, "too cold = not warm enough."],
  [T2, "The {room} is too small for our family, {name}.", "The {room} isn't ______ ______ for our family, {name}.", ["big", "enough"], { room: ["flat", "car", "kitchen", "tent"], name: NAME2 }, "too small = not big enough."],
  [T2, "I'm too short to reach the top {shelf}, {name}.", "I'm not ______ ______ to reach the top {shelf}, {name}.", ["tall", "enough"], { shelf: ["shelf", "cupboard", "window", "branch"], name: NAME }, "too short = not tall enough."],
  [T2, "This {thing} is too weak for the job, {name}.", "This {thing} isn't ______ ______ for the job, {name}.", ["strong", "enough"], { thing: ["rope", "ladder", "table", "bag"], name: NAME2 }, "too weak = not strong enough."],
  [T3, "Our {room} isn't big enough for a party, {name}.", "Our {room} is ______ ______ for a party, {name}.", ["too", "small"], { room: ["flat", "garden", "kitchen", "yard"], name: NAME }, "not big enough = too small."],
  [T3, "The {drink} isn't cold enough to drink yet, {name}.", "The {drink} is still ______ ______ to drink, {name}.", ["too", "warm"], { drink: ["lemonade", "juice", "water", "ayran"], name: NAME2 }, "not cold enough = still too warm."],
  [T3, "My son isn't old enough for this {thing}, {name}.", "My son is ______ ______ for this {thing}, {name}.", ["too", "young"], { thing: ["film", "game", "book", "ride"], name: NAME }, "not old enough = too young."],
  [T3, "The {bus} wasn't fast enough. We arrived late, {name}.", "The {bus} was ______ ______. We arrived late, {name}.", ["too", "slow"], { bus: ["bus", "train", "taxi", "ferry"], name: NAME2 }, "not fast enough = too slow."],
  [T3, "These {shoes} aren't cheap enough for me, {name}.", "These {shoes} are ______ ______ for me, {name}.", ["too", "expensive"], { shoes: ["shoes", "boots", "jeans", "trainers"], name: NAME }, "not cheap enough = too expensive."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with too + adjective + to.", "too + adjective + to + verb", ["exactly one sentence", "too", "to + verb"]],
  ["Write one sentence with adjective + enough + to.", "adjective + enough + to + verb", ["exactly one sentence", "enough after the adjective", "to + verb"]],
  ["Write one sentence with enough + noun.", "enough + noun", ["exactly one sentence", "enough before the noun", "a noun"]],
  ["Write one sentence with not … enough.", "isn't + adjective + enough", ["exactly one sentence", "not", "enough after the adjective"]],
  ["Write one sentence with too + adjective + for + a person.", "too + adjective + for me / him …", ["exactly one sentence", "too", "for + person"]],
  ["Write one sentence about why you can't do something today. Use too.", "I'm too … to …", ["exactly one sentence", "too", "a reason"]],
  ["Write one sentence about something you can do now because you are old enough.", "I'm old enough to …", ["exactly one sentence", "old enough", "to + verb"]],
  ["Write one sentence with didn't have enough.", "didn't have enough + noun", ["exactly one sentence", "enough + noun", "past"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your room or flat. What is too small, big enough or not big enough? Write three or four sentences.", "too / enough", ["too + adjective", "adjective + enough", "three or four sentences"]],
  ["Write three or four sentences about a time you could not do something. Why not?", "too … to / not … enough", ["too", "enough", "three or four sentences"]],
  ["Write a short complaint (three or four sentences) about a hotel or café.", "too + adjective, not enough + noun", ["too", "enough + noun", "three or four sentences"]],
  ["Write three or four sentences about the weather today and what you can or can't do in it.", "too cold / warm enough", ["too", "enough", "three or four sentences"]],
  ["Write three or four sentences about what young people are old enough to do in your country.", "old enough / too young", ["old enough", "too young", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.intensifiers.too-enough.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "",
   "He is only …: not old enough. enough goes after the adjective.",
   "",
   "",
   "",
   "You need a …, so it is colder than is OK: too cold.",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "After the long event you couldn't cook: too tired."
  ],
  "build": [
   "",
   "He is only …: not old enough (adjective + enough).",
   "",
   "",
   "",
   "",
   "",
   "",
   "Too tired to cook, so you ordered food: too tired.",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  "transform": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ]
 },
 "slot": [
  [
   "choose",
   6,
   "coat",
   "coat",
   [
    "coat",
    "jacket",
    "hat",
    "scarf"
   ]
  ],
  [
   "choose",
   7,
   "top shelf",
   "high",
   [
    "top shelf",
    "light switch",
    "door handle",
    "kitchen cupboard"
   ]
  ]
 ]
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
