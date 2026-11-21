// Hand-authored: passive-causative / simple-passive / no-passive-intransitive (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): verbs with no object (happen, arrive, die,
// fall, disappear, come …) have NO passive: "The accident was happened" → "The
// accident happened". The Uzbek / Russian learner over-uses was + verb for events.
// Triage: kept. To make the learner think, 6 choose / 6 build lines use a verb
// that does take an object (build, steal, invite …), where the passive is right.
// Verbs that are both (close, open, grow, stop for machines) are only used where
// one reading is impossible (The rain stopped).
// Choose: 14 intransitive (happened / was happened / was happen / happen);
// 6 transitive (was built / built / was build / build).
// Build: past simple, active or passive, of the verb in brackets; no source prints
// was / were.
// Transform: 5 correct "was happened" / 5 active → passive (transitive) /
// 5 present → past (the verb stays active).
//
// Run: node tools/grammar-practice/authored/passive-causative.simple-passive.no-passive-intransitive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "passive-causative", branch: "simple-passive", topic: "no-passive-intransitive", level: "B1", pv: "2.5" };
const NAME = ["Feruza", "Otabek", "Dilnoza", "Sardor"]; // listener names: never printed in a sentence (audit 20 Nov)
const PAST = { happen: "happened", arrive: "arrived", die: "died", fall: "fell", disappear: "disappeared", come: "came", sleep: "slept", go: "went", stay: "stayed", appear: "appeared", laugh: "laughed", wait: "waited", stop: "stopped", occur: "occurred", rain: "rained" };
const PP = { build: "built", steal: "stolen", invite: "invited", cancel: "cancelled", take: "taken", find: "found", make: "made", open: "opened" };
const WHY_I = "This verb has no object, so it has no passive: use the active past simple.";
const WHY_T = "This verb has an object; here the subject receives the action: was / were + past participle.";
const intr = (v) => [PAST[v], `was ${PAST[v]}`, `was ${v}`, v];
const tran = (v, be = "was") => [`${be} ${PP[v]}`, v === "build" ? "built" : v === "steal" ? "stole" : v === "take" ? "took" : v === "find" ? "found" : `${PP[v]}`, `${be} ${v}`, v];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [intr("happen"), WHY_I, "The accident ______ at six o'clock near the {place}, {name}.", { place: ["bridge", "school", "bazaar", "station"], name: NAME }],
  [intr("arrive"), WHY_I, "The {bus} ______ ten minutes late, {name}.", { bus: ["bus", "train", "plane", "taxi"], name: NAME }],
  [intr("die"), WHY_I, "Our old {pet} ______ last winter, {name}.", { pet: ["dog", "cat", "parrot", "horse"], name: NAME }],
  [intr("fall"), WHY_I, "The vase ______ off the {furn} and broke, {name}.", { furn: ["table", "shelf", "chair", "window"], name: NAME }],
  [intr("disappear"), WHY_I, "My {thing} ______ from my desk {when}, {name}.", { thing: ["pen", "phone", "notebook", "charger"], when: ["yesterday", "last night", "on Friday", "this morning"], name: NAME }],
  [intr("come"), WHY_I, "A lot of guests ______ to the {event}, {name}.", { event: ["wedding", "party", "concert", "meeting"], name: NAME }],
  [intr("sleep"), WHY_I, "The baby ______ for ten hours {when}, {name}.", { when: ["last night", "on Friday", "yesterday", "at Grandma's"], name: NAME }],
  [intr("go"), WHY_I, "The lights ______ out during the {storm}, {name}.", { storm: ["storm", "film", "match", "concert"], name: NAME }],
  [intr("stay"), WHY_I, "We ______ at a small hotel in {city}, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"], name: NAME }],
  [intr("appear"), WHY_I, "A rainbow ______ over the {place} after the rain, {name}.", { place: ["mountains", "lake", "city", "village"], name: NAME }],
  [intr("laugh"), WHY_I, "Everyone ______ at his joke at the {event}, {name}.", { event: ["wedding", "party", "dinner", "meeting"], name: NAME }],
  [intr("wait"), WHY_I, "We ______ for an hour at the {place}, {name}.", { place: ["airport", "bus stop", "bank", "hospital"], name: NAME }],
  [intr("stop"), WHY_I, "The rain ______ at {time}, {name}.", { time: ["six", "noon", "midnight", "five o'clock"], name: NAME }],
  [intr("occur"), WHY_I, "The same problem ______ again {when}, {name}.", { when: ["yesterday", "last week", "on Monday", "this morning"], name: NAME }],
  [tran("build"), WHY_T, "This bridge ______ in {year}, {name}.", { year: ["1990", "2005", "1975", "2012"], name: NAME }],
  [tran("steal"), WHY_T, "My {thing} ______ at the station, {name}.", { thing: ["bag", "phone", "wallet", "bike"], name: NAME }],
  [tran("invite", "were"), WHY_T, "All the {who} ______ to the wedding, {name}.", { who: ["neighbours", "cousins", "teachers", "classmates"], name: NAME }],
  [tran("cancel"), WHY_T, "The {event} ______ because of the rain, {name}.", { event: ["match", "concert", "picnic", "festival"], name: NAME }],
  [tran("take", "were"), WHY_T, "Two people ______ to hospital after the {accident}, {name}.", { accident: ["accident", "crash", "fire", "storm"], name: NAME }],
  [tran("find"), WHY_T, "The lost {pet} ______ in the park, {name}.", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
].map(([o, why, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Use the past simple of the verb in brackets, active or passive. Some verbs (happen, arrive, die …) have no passive.";
// no source prints was / were
const BUILD = [
  [PAST.happen, WHY_I, "The accident ______ (happen) on the {road}, {name}.", { road: ["motorway", "ring road", "main road", "bridge"], name: NAME }],
  [PAST.arrive, WHY_I, "Our {bus} ______ (arrive) at nine, {name}.", { bus: ["bus", "train", "plane", "taxi"], name: NAME }],
  [PAST.die, WHY_I, "The old {tree} in our yard ______ (die) last summer, {name}.", { tree: ["tree", "apple tree", "rose bush", "vine"], name: NAME }],
  [PAST.fall, WHY_I, "Lola ______ (fall) off her {bike} {when}.", { bike: ["bike", "horse", "chair", "scooter"], when: ["yesterday", "last week", "on Sunday", "this morning"] }],
  [PAST.disappear, WHY_I, "The {pet} ______ (disappear) for three days, {name}.", { pet: ["cat", "dog", "puppy", "kitten"], name: NAME }],
  [PAST.come, WHY_I, "Twenty people ______ (come) to the {event}, {name}.", { event: ["wedding", "party", "concert", "meeting"], name: NAME }],
  [PAST.sleep, WHY_I, "I ______ (sleep) badly in the {place}, {name}.", { place: ["hotel", "tent", "train", "car"], name: NAME }],
  [PAST.go, WHY_I, "Prices ______ (go) up again {when}, {name}.", { when: ["last month", "this year", "in May", "last week"], name: NAME }],
  [PAST.stay, WHY_I, "They ______ (stay) with their {who} in {city}.", { who: ["grandparents", "cousins", "aunt", "friends"], city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"] }],
  [PAST.appear, WHY_I, "A strange man ______ (appear) at the {place}, {name}.", { place: ["door", "window", "gate", "party"], name: NAME }],
  [PAST.wait, WHY_I, "We ______ (wait) for two hours at the {place}, {name}.", { place: ["airport", "bus stop", "bank", "hospital"], name: NAME }],
  [PAST.occur, WHY_I, "The mistake ______ (occur) in the {thing} again, {name}.", { thing: ["report", "test", "email", "list"], name: NAME }],
  [PAST.rain, WHY_I, "It ______ (rain) all day in {city}, {name}.", { city: ["London", "Moscow", "Tashkent", "Fergana"], name: NAME }],
  [PAST.stop, WHY_I, "The music ______ (stop) at {time}, {name}.", { time: ["midnight", "eleven", "ten o'clock", "two"], name: NAME }],
  ["was built", WHY_T, "This {building} ______ (build) in {year}.", { building: ["theatre", "bridge", "school", "hotel"], year: ["1990", "2005", "1975", "2012"] }],
  ["was stolen", WHY_T, "My {thing} ______ (steal) on the bus, {name}.", { thing: ["bag", "phone", "wallet", "bike"], name: NAME }],
  ["were invited", WHY_T, "All my {who} ______ (invite) to the party, {name}.", { who: ["neighbours", "cousins", "teachers", "classmates"], name: NAME }],
  ["was taken", WHY_T, "The injured man ______ (take) to hospital after the {accident}, {name}.", { accident: ["accident", "crash", "fire", "storm"], name: NAME }],
  ["was found", WHY_T, "The lost {pet} ______ (find) in the park, {name}.", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  ["was made", WHY_T, "This {food} ______ (make) by my grandmother, {name}.", { food: ["cake", "plov", "bread", "soup"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const TOP = "Rewrite in the passive. Start with the words given.";
const PST = "Rewrite in the past simple.";
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [FIX, "The accident was happened at six, {name}.", "The accident ______ at six, {name}.", "happened", WHY_I, { name: NAME, x: [] }],
  [FIX, "The {bus} was arrived late, {name}.", "The {bus} ______ late, {name}.", "arrived", WHY_I, { bus: ["bus", "train", "plane", "taxi"], name: NAME }],
  [FIX, "Our old {pet} was died last year, {name}.", "Our old {pet} ______ last year, {name}.", "died", WHY_I, { pet: ["dog", "cat", "parrot", "horse"], name: NAME }],
  [FIX, "The vase was fallen off the {furn}, {name}.", "The vase ______ off the {furn}, {name}.", "fell", WHY_I, { furn: ["table", "shelf", "chair", "window"], name: NAME }],
  [FIX, "My {thing} was disappeared from my bag, {name}.", "My {thing} ______ from my bag, {name}.", "disappeared", WHY_I, { thing: ["pen", "phone", "key", "ticket"], name: NAME }],
  [TOP, "Someone stole my {thing} at the bazaar, {name}.", "My {thing} ______ at the bazaar, {name}.", "was stolen", WHY_T, { thing: ["bag", "phone", "wallet", "bike"], name: NAME }],
  [TOP, "They built this {building} in {year}.", "This {building} ______ in {year}.", "was built", WHY_T, { building: ["theatre", "bridge", "school", "hotel"], year: ["1990", "2005", "1975", "2012"] }],
  [TOP, "Someone found the lost {pet} in the park, {name}.", "The lost {pet} ______ in the park, {name}.", "was found", WHY_T, { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  [TOP, "They invited all the {who} to the wedding, {name}.", "All the {who} ______ to the wedding, {name}.", "were invited", WHY_T, { who: ["neighbours", "cousins", "teachers", "classmates"], name: NAME }],
  [TOP, "Someone opened the {thing} at night, {name}.", "The {thing} ______ at night, {name}.", "was opened", WHY_T, { thing: ["door", "window", "gate", "shop"], name: NAME }],
  [PST, "The {bus} arrives at nine, {name}.", "Yesterday the {bus} ______ at nine, {name}.", "arrived", WHY_I, { bus: ["bus", "train", "plane", "taxi"], name: NAME }],
  [PST, "The guests come at six, {name}.", "On Friday the guests ______ at six, {name}.", "came", WHY_I, { name: NAME, x: [] }],
  [PST, "The baby sleeps well in the {room}, {name}.", "Last night the baby ______ well in the {room}, {name}.", "slept", WHY_I, { room: ["bedroom", "car", "hotel", "garden"], name: NAME }],
  [PST, "Accidents often happen on this {road}, {name}.", "Last week an accident ______ on this {road}, {name}.", "happened", WHY_I, { road: ["road", "bridge", "corner", "motorway"], name: NAME }],
  [PST, "Many tourists stay in this hotel in {city}.", "Last year many tourists ______ in this hotel in {city}.", "stayed", WHY_I, { city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"], x: [] }],
].map(([instr, source, hint, key, why, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about an accident you saw or heard about. Use happen.", "… happened …", ["exactly one sentence", "happened (no was)", "past simple"]],
  ["Write one sentence about a late bus or plane. Use arrive.", "… arrived late", ["exactly one sentence", "arrived (no was)", "past simple"]],
  ["Write one sentence with fell or disappeared.", "fell / disappeared", ["exactly one sentence", "active past simple", "no was"]],
  ["Write one passive sentence about something that was stolen or found.", "was stolen / was found", ["exactly one sentence", "was + past participle", "past"]],
  ["Write two sentences about a storm: one with happened, one with a passive (was damaged…).", "intransitive vs passive", ["exactly two sentences", "happened", "was + past participle"]],
  ["Write one sentence about guests who came to a party.", "… came to …", ["exactly one sentence", "came (no were)", "past simple"]],
  ["Write one sentence about a building and when it was built.", "… was built in …", ["exactly one sentence", "was built", "a year"]],
  ["Write one sentence with stayed or waited.", "stayed / waited", ["exactly one sentence", "active past simple", "a place"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell the story of a bad day at an airport. Write three or four sentences with arrived, waited and happened.", "intransitive verbs in the active", ["arrived", "waited", "happened"]],
  ["Describe a storm in your town. What happened, and what was damaged? Write three or four sentences.", "active intransitive + passive", ["happened / fell", "was / were + past participle", "three or four sentences"]],
  ["Write a short news story (three or four sentences) about a lost dog that was found.", "disappeared + was found", ["disappeared", "was found", "three or four sentences"]],
  ["Describe a wedding you went to. Who came, and what was served? Write three or four sentences.", "came + was served", ["came", "passive", "three or four sentences"]],
  ["Write three or four sentences about a trip: where you stayed, when you arrived, and what happened.", "stayed / arrived / happened", ["stayed", "arrived", "happened"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/passive-causative.simple-passive.no-passive-intransitive.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "happen has no object, so no passive: happened.",
   "arrive has no object: arrived.",
   "die has no object: died.",
   "fall has no object: fell.",
   "disappear has no object: disappeared.",
   "come has no object: came.",
   "sleep has no object: slept.",
   "go out has no object: went.",
   "stay has no object: stayed.",
   "appear has no object: appeared.",
   "laugh (at) has no passive here: laughed.",
   "wait has no object: waited.",
   "stop by itself, no doer: stopped.",
   "occur has no object: occurred.",
   "Someone built it: passive was built.",
   "Someone stole it: passive was stolen.",
   "Someone invited them: passive were invited.",
   "Someone cancelled it: passive was cancelled.",
   "Someone took them: passive were taken.",
   "Someone found it: passive was found."
  ],
  "build": [
   "Active only: happen → happened.",
   "Active only: arrive → arrived.",
   "Active only: die → died.",
   "Active only: fall → fell (irregular).",
   "Active only: disappear → disappeared.",
   "Active only: come → came (irregular).",
   "Active only: sleep → slept (irregular).",
   "Active only: go up → went up.",
   "Active only: stay → stayed.",
   "Active only: appear → appeared.",
   "Active only: wait → waited.",
   "Active only: occur → occurred (double r).",
   "Weather verb, active: rain → rained.",
   "Active only: stop → stopped (double p).",
   "Someone built it: was built.",
   "Someone stole it: was stolen.",
   "Someone invited them, plural: were invited.",
   "Someone took him: was taken.",
   "Someone found it: was found.",
   "My grandmother made it: was made."
  ],
  "transform": [
   "No was with happen: happened.",
   "No was with arrive: arrived.",
   "No was with die: died.",
   "No was with fall: fell.",
   "No was with disappear: disappeared.",
   "Someone stole → was stolen.",
   "They built → was built.",
   "Someone found → was found.",
   "They invited → were invited.",
   "Someone opened → was opened.",
   "Past time (Yesterday): arrived.",
   "Past time (On Friday): came.",
   "Past time (Last night): slept.",
   "Past time (Last week): happened.",
   "Past time (Last year): stayed."
  ]
 },
 "slot": [
  [
   "transform",
   1,
   "six",
   "h",
   [
    "six",
    "seven",
    "noon",
    "midnight"
   ]
  ],
  [
   "transform",
   12,
   "six",
   "h",
   [
    "six",
    "seven",
    "noon",
    "eight"
   ]
  ],
  [
   "transform",
   15,
   "hotel",
   "stay",
   [
    "hotel",
    "guesthouse",
    "hostel",
    "old house"
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
