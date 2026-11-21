// Hand-authored: verb-patterns / meaning-change-verbs / remember-gerund (B1).
// Wave C, C28 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item): remember + -ing = I have a memory of something I
// did in the past ("I remember meeting him at the party last year").
// Triage: kept. Sibling remember-infinitive (C29) = remember + to (a task not done
// yet). Here every line has a past time word or a past story, so "to + base" is wrong.
// Choose: -ing / to + base / base / past simple.
// Build: -ing of the verb in brackets (20).
// Transform: 5 correct the mistake / 5 I did X … I remember it → I remember doing X /
// 5 Did I …? I don't remember → I don't remember doing ….
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/verb-patterns.meaning-change-verbs.remember-gerund.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "meaning-change-verbs", topic: "remember-gerund", level: "B1", pv: "2.5" };
const NAME = ["Feruza", "Sherzod", "Nodira", "Jamshid"];
const NAME2 = ["Gulnora", "Otabek", "Zarina", "Akmal"];
const R = (ing, base, past) => [ing, `to ${base}`, base, past];
const WHY = (ing, cue) => `${cue}, so this is a memory of the past: remember + -ing (${ing}).`;

/* ---------------- choose: 20 mcq ---------------- */
// [options, prompt, slots, cue for the why]
const CHOOSE = [
  [R("meeting", "meet", "met"), "I remember ______ your {who} at the party last year, {name}.", { who: ["brother", "sister", "cousin", "uncle"], name: NAME }, "\"Last year\" is in the past"],
  [R("going", "go", "went"), "My grandpa remembers ______ to {city} by train in 1975.", { city: ["Moscow", "Tashkent", "Samarkand", "Kyiv"], x: [] }, "\"In 1975\" is long ago"],
  [R("playing", "play", "played"), "Do you remember ______ {game} in the yard when we were kids, {name}?", { game: ["football", "hide and seek", "chess", "tag"], name: NAME2 }, "\"When we were kids\" is the past"],
  [R("seeing", "see", "saw"), "I remember ______ snow in {city} for the first time, {name}.", { city: ["Moscow", "Tashkent", "Almaty", "Istanbul"], name: NAME }, "\"For the first time\" here is a past moment"],
  [R("crying", "cry", "cried"), "She remembers ______ on her first day at {place}.", { place: ["school", "kindergarten", "camp", "university"], x: [] }, "Her first day was in the past"],
  [R("eating", "eat", "ate"), "I remember ______ the best {food} of my life in {city}, {name}.", { food: ["plov", "samsa", "kebab", "soup"], city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], name: NAME2 }, "It happened on a past trip"],
  [R("learning", "learn", "learned"), "My mum remembers ______ to ride a {bike} when she was six.", { bike: ["bike", "horse", "scooter", "donkey"], x: [] }, "\"When she was six\" is the past"],
  [R("living", "live", "lived"), "Do you remember ______ in the old {home} on {street} Street, {name}?", { home: ["flat", "house", "building", "yard"], street: ["Navoi", "Amir Temur", "Bobur", "Mustaqillik"], name: NAME }, "The old flat is in the past"],
  [R("losing", "lose", "lost"), "I remember ______ my {thing} on the bus last winter, {name}.", { thing: ["gloves", "phone", "hat", "keys"], name: NAME2 }, "\"Last winter\" is the past"],
  [R("swimming", "swim", "swam"), "We remember ______ in the {water} every summer as children.", { water: ["river", "lake", "sea", "canal"], x: [] }, "\"As children\" is the past"],
  [R("laughing", "laugh", "laughed"), "I remember ______ a lot at your {event}, {name}.", { event: ["wedding", "birthday party", "graduation", "picnic"], name: NAME }, "The party is over: it is a memory"],
  [R("watching", "watch", "watched"), "My dad remembers ______ the {match} on a small black-and-white TV.", { match: ["final", "World Cup", "big match", "Olympics"], x: [] }, "A black-and-white TV is from the past"],
  [R("walking", "walk", "walked"), "I remember ______ to {place} in the snow as a child, {name}.", { place: ["school", "Grandma's house", "the shop", "kindergarten"], name: NAME2 }, "\"As a child\" is the past"],
  [R("telling", "tell", "told"), "I don't remember ______ you about the {thing}, {name}. Are you sure?", { thing: ["party", "test", "plan", "trip"], name: NAME }, "Did I tell you before? I have no memory of it"],
  [R("singing", "sing", "sang"), "She remembers ______ at her sister's {event} ten years ago.", { event: ["wedding", "party", "birthday", "graduation"], x: [] }, "\"Ten years ago\" is the past"],
  [R("getting", "get", "got"), "I remember ______ lost in {city} on my first trip, {name}.", { city: ["Istanbul", "Moscow", "Seoul", "Dubai"], name: NAME2 }, "\"On my first trip\" is the past"],
  [R("buying", "buy", "bought"), "Do you remember ______ this {thing} at the bazaar years ago, {name}?", { thing: ["carpet", "teapot", "dress", "lamp"], name: NAME }, "We bought it before: a memory"],
  [R("sleeping", "sleep", "slept"), "My son remembers ______ in a tent in the {place} last summer.", { place: ["mountains", "desert", "forest", "garden"], x: [] }, "\"Last summer\" is the past"],
  [R("flying", "fly", "flew"), "I remember ______ over the {sight} for the first time, {name}.", { sight: ["mountains", "sea", "desert", "clouds"], name: NAME2 }, "It is a memory of a past flight"],
  [R("winning", "win", "won"), "Our coach remembers ______ the {cup} in {year}.", { cup: ["cup", "final", "league", "championship"], year: ["1998", "2005", "2012", "1990"] }, "\"In 1998\" is the past"],
].map(([o, prompt, slots, cue], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY(o[0], cue), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "It is a memory of the past. Complete with the right form of the verb in brackets.";
const BUILD = [
  ["visiting", "I remember ______ (visit) {city} with my parents in {year}.", { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], year: ["2010", "2015", "2008", "2012"] }],
  ["riding", "Do you remember ______ (ride) a camel in the {place}, {name}?", { place: ["desert", "zoo", "village", "park"], name: NAME }],
  ["hearing", "I remember ______ (hear) this song at a {event} years ago, {name}.", { event: ["wedding", "party", "concert", "festival"], name: NAME2 }],
  ["making", "My grandma remembers ______ (make) bread in a {oven} as a girl.", { oven: ["tandoor", "clay oven", "village oven", "big oven"], x: [] }],
  ["breaking", "I don't remember ______ (break) the {thing}, {name}. Was it me?", { thing: ["vase", "window", "cup", "lamp"], name: NAME }],
  ["reading", "She remembers ______ (read) this {book} at school.", { book: ["book", "poem", "story", "novel"], x: [] }],
  ["climbing", "We remember ______ (climb) the {hill} behind our village.", { hill: ["hill", "mountain", "old tower", "big tree"], x: [] }],
  ["dancing", "I remember ______ (dance) all night at my cousin's {event}, {name}.", { event: ["wedding", "party", "birthday", "graduation"], name: NAME2 }],
  ["feeling", "I remember ______ (feel) very nervous before my first {test}, {name}.", { test: ["exam", "interview", "match", "concert"], name: NAME }],
  ["writing", "Do you remember ______ (write) letters to {who}, {name}?", { who: ["Grandma", "pen friends", "your cousin", "Father Frost"], name: NAME2 }],
  ["running", "My dad remembers ______ (run) {dist} in the army? ", { dist: ["x"], x: [] }],
  ["catching", "My brother remembers ______ (catch) a big fish in the {water}.", { water: ["river", "lake", "sea", "canal"], x: [] }],
  ["staying", "I remember ______ (stay) at a small hotel in {city}, {name}.", { city: ["Istanbul", "Bukhara", "Khiva", "Almaty"], name: NAME }],
  ["seeing", "Do you remember ______ (see) the {sight} from the plane, {name}?", { sight: ["mountains", "sea", "Aral Sea", "desert"], name: NAME2 }],
  ["being", "I remember ______ (be) scared of the dark as a child, {name}.", { name: NAME, x: [] }],
  ["planting", "Grandpa remembers ______ (plant) this {tree} forty years ago.", { tree: ["apple tree", "walnut tree", "cherry tree", "vine"], x: [] }],
  ["putting", "I remember ______ (put) my {thing} on this table an hour ago, {name}.", { thing: ["keys", "phone", "wallet", "glasses"], name: NAME2 }],
  ["sending", "I don't remember ______ (send) that email to the {who}, {name}.", { who: ["teacher", "boss", "manager", "client"], name: NAME }],
  ["talking", "She remembers ______ (talk) to a famous {who} at the airport.", { who: ["singer", "footballer", "actor", "writer"], x: [] }],
  ["taking", "I remember ______ (take) this photo in {city}, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"], name: NAME2 }],
].filter(([key]) => key !== "running").map(([key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: `A memory of something done before: remember + -ing (${key}).`, slots: s };
});
BUILD.push({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: "My uncle remembers ______ (work) on a farm near {city} as a boy, {name}.", key: "working", why: "\"As a boy\" is the past: remember + -ing (working).", slots: { city: ["Fergana", "Jizzakh", "Namangan", "Karshi"], name: NAME } });

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const MEM = "Rewrite with I remember + -ing.";
const NOT = "Rewrite with I don't remember + -ing.";
const TRANSFORM = [
  [FIX, "I remember to meet your {who} at the wedding last year, {name}.", "I remember ______ your {who} at the wedding last year, {name}.", "meeting", { who: ["brother", "sister", "cousin", "uncle"], name: NAME }, "\"Last year\" is a memory: remember + -ing."],
  [FIX, "She remembers to cry on her first day at {place}.", "She remembers ______ on her first day at {place}.", "crying", { place: ["school", "kindergarten", "camp", "university"], x: [] }, "A memory of her first day: remember + -ing."],
  [FIX, "Do you remember play in the yard as kids, {name}?", "Do you remember ______ in the yard as kids, {name}?", "playing", { name: NAME2, x: [] }, "remember + -ing for a memory: playing."],
  [FIX, "My grandpa remembers went to {city} in 1975.", "My grandpa remembers ______ to {city} in 1975.", "going", { city: ["Moscow", "Tashkent", "Samarkand", "Kyiv"], x: [] }, "remember + -ing: going, not went."],
  [FIX, "I remember to see snow for the first time in {city}, {name}.", "I remember ______ snow for the first time in {city}, {name}.", "seeing", { city: ["Moscow", "Almaty", "Tashkent", "Istanbul"], name: NAME }, "A first time in the past: remember + -ing."],
  [MEM, "I swam in the {water} as a child. I still remember it, {name}.", "I remember ______ in the {water} as a child, {name}.", "swimming", { water: ["river", "lake", "sea", "canal"], name: NAME2 }, "A memory: remember + -ing (swimming)."],
  [MEM, "I visited {city} with my class in {year}. I remember it well.", "I remember ______ {city} with my class in {year}.", "visiting", { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], year: ["2010", "2015", "2018", "2012"] }, "A memory: remember + -ing (visiting)."],
  [MEM, "I laughed a lot at your {event}. I remember that, {name}.", "I remember ______ a lot at your {event}, {name}.", "laughing", { event: ["wedding", "party", "graduation", "picnic"], name: NAME }, "A memory: remember + -ing (laughing)."],
  [MEM, "I got lost in {city} on my first trip. I remember it, {name}.", "I remember ______ lost in {city} on my first trip, {name}.", "getting", { city: ["Istanbul", "Moscow", "Seoul", "Dubai"], name: NAME2 }, "A memory: remember + -ing (getting lost)."],
  [MEM, "I felt very proud at my {event}. I remember that feeling, {name}.", "I remember ______ very proud at my {event}, {name}.", "feeling", { event: ["graduation", "first match", "first concert", "wedding"], name: NAME }, "A memory: remember + -ing (feeling)."],
  [NOT, "Did I say that at the {event}? I have no memory of it, {name}.", "I don't remember ______ that at the {event}, {name}.", "saying", { event: ["meeting", "party", "dinner", "lesson"], name: NAME2 }, "No memory of a past action: don't remember + -ing."],
  [NOT, "Did I borrow your {thing}? I can't remember it, {name}.", "I don't remember ______ your {thing}, {name}.", "borrowing", { thing: ["pen", "book", "charger", "umbrella"], name: NAME }, "No memory: don't remember + -ing (borrowing)."],
  [NOT, "Did we meet in {city}? I have no memory of that, {name}.", "I don't remember ______ you in {city}, {name}.", "meeting", { city: ["Samarkand", "Bukhara", "Istanbul", "Moscow"], name: NAME2 }, "No memory: don't remember + -ing (meeting)."],
  [NOT, "Did I pay for the {thing}? I can't remember, {name}.", "I don't remember ______ for the {thing}, {name}.", "paying", { thing: ["tickets", "taxi", "coffee", "lunch"], name: NAME }, "No memory: don't remember + -ing (paying)."],
  [NOT, "Did I close the {thing}? I have no memory of it, {name}.", "I don't remember ______ the {thing}, {name}.", "closing", { thing: ["window", "door", "gate", "fridge"], name: NAME2 }, "No memory of the past action: don't remember + -ing."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a happy memory from your childhood. Use I remember + -ing.", "I remember + -ing", ["exactly one sentence", "remember + -ing", "a past time"]],
  ["Write one sentence about your first day at school with remember.", "I remember + -ing", ["exactly one sentence", "remember + -ing", "first day"]],
  ["Write one question: Do you remember + -ing …?", "Do you remember + -ing?", ["exactly one question", "remember + -ing", "a question mark"]],
  ["Write one sentence with I don't remember + -ing.", "I don't remember + -ing", ["exactly one sentence", "don't remember", "-ing"]],
  ["Write one sentence about a grandparent's memory.", "My grandma remembers + -ing", ["exactly one sentence", "remembers", "-ing"]],
  ["Write one sentence about a trip you remember.", "I remember visiting / seeing …", ["exactly one sentence", "remember + -ing", "a place"]],
  ["Write one sentence with remember + -ing and one with remember to.", "remember doing vs remember to do", ["exactly two sentences", "remember + -ing (past)", "remember to + base (task)"]],
  ["Write one sentence about a funny thing you remember.", "I remember laughing …", ["exactly one sentence", "remember + -ing", "past"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your earliest memory. Write three or four sentences with remember + -ing.", "remember + -ing", ["remember", "-ing", "three or four sentences"]],
  ["Ask a grandparent about life long ago (in your mind). Write three or four sentences: he or she remembers …", "remembers + -ing", ["remembers", "-ing", "three or four sentences"]],
  ["Write three or four sentences about your best holiday. What do you remember doing?", "remember + -ing", ["remember", "-ing", "three or four sentences"]],
  ["A friend says you were at a party, but you don't remember. Write three or four sentences.", "don't remember + -ing", ["don't remember", "-ing", "three or four sentences"]],
  ["Write three or four sentences about your first English lesson.", "remember + -ing", ["remember", "-ing", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.meaning-change-verbs.remember-gerund.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "The old … is in the past, so this is a memory of the past: remember + -ing (living).",
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
   "\"In …\" is the past, so this is a memory of the past: remember + -ing (winning)."
  ],
  "build": [
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
