// Hand-authored: questions-negation / negation / no-vs-not (B1).
// Wave C, C7 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: "no + noun vs not + any". Sibling no-vs-any (A2) already
// tests no vs any as the determiner. This topic is the NO / NOT contrast:
// no goes straight before a noun ("There is no milk"); not goes before an
// adjective, a verb form, a place or "any" ("not hot", "not working",
// "not at home", "not any bread"). Russian "нет" / Uzbek "yo'q" cover both,
// so learners write "I have not money" and "There is no any bread".
// Choose: 11 no keys, 9 not keys (4 of them before "any"); options always
// no / not / none / any. No "a + noun" frames ("He is no teacher" is an idiom)
// and no comparatives ("no better" is right).
// Build: "Write no or not." No sentence prints its own key a second time.
// Transform: 5 not … any → no / 5 no → not … any (two gaps) / 5 correct.
//
// Run: node tools/grammar-practice/authored/questions-negation.negation.no-vs-not.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "negation", topic: "no-vs-not", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAMEF = ["Olga", "Lola", "Madina", "Kamila"];
const NAMEM = ["Aziz", "Timur", "Bekzod", "Rustam"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const WHY = {
  no: "There is a noun right after the gap and the verb is positive, so use no (no = not any).",
  not: "Use not before an adjective, a verb, a place word or any. No only goes straight before a noun.",
  notany: "Not + any: the verb is negative with not, and any goes before the noun. \"No any\" is wrong.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["no", "no", "There is ______ milk in the {place}, {name}. Let's buy some.", { place: ["fridge", "kitchen", "jug", "bottle"], name: NAME }],
  ["no", "no", "I have ______ idea where {thing} is, {name}.", { thing: ["Dad", "the teacher", "your bag", "the remote"], name: NAME }],
  ["no", "no", "We have ______ lessons on {day}, {name}.", { day: ["Sunday", "Navruz", "the first of January", "Independence Day"], name: NAME }],
  ["no", "no", "There were ______ seats on the {vehicle}, so we stood.", { vehicle: ["bus", "train", "metro", "tram"] }],
  ["no", "no", "{name} has ______ time for games this {when}.", { name: NAME, when: ["week", "evening", "weekend", "month"] }],
  ["no", "no", "Sorry, there's ______ hot water in the {room} today, {name}.", { room: ["bathroom", "kitchen", "hotel", "hostel"], name: NAME }],
  ["no", "no", "My grandparents have ______ internet in their {home}.", { home: ["village house", "dacha", "flat", "old house"] }],
  ["no", "no", "There are ______ shops near our {home}, {name}.", { home: ["house", "flat", "school", "dacha"], name: NAME }],
  ["no", "no", "I've got ______ money left after the {thing}, {name}.", { thing: ["trip", "wedding", "holidays", "concert"], name: NAME }],
  ["no", "no", "The {room} has ______ windows, so it's very dark.", { room: ["basement", "storeroom", "little room", "old garage"] }],
  ["no", "no", "There's ______ sugar in my {drink}, {name}. I don't like it sweet.", { drink: ["tea", "coffee", "cocoa", "milk"], name: NAME }],
  ["not", "not", "The soup is ______ hot yet, {name}. Wait a {time}.", { name: NAME, time: ["minute", "moment", "second", "bit"] }],
  ["not", "not", "I'm ______ working today, {name}. It's my day off.", { name: NAME }],
  ["not", "not", "My brother is ______ very tall, but he plays {sport} well.", { sport: ["basketball", "volleyball", "football", "tennis"] }],
  ["not", "not", "We are ______ ready yet, {name}. Give us {n} minutes.", { name: NAME, n: ["five", "ten", "two", "fifteen"] }],
  ["not", "notany", "There is ______ any bread left, {name}. Can you buy some?", { name: NAME }],
  ["not", "notany", "I have ______ any homework {when}, {name}.", { when: ["today", "this weekend", "tonight", "for Monday"], name: NAME }],
  ["not", "not", "{name} is ______ at home. She's at the {place}.", { name: NAMEF, place: ["bazaar", "library", "gym", "bank"] }],
  ["not", "not", "The station is ______ far from here, {name}. You can walk.", { name: NAME }],
  ["not", "notany", "There were ______ any taxis at the {place}, so we walked.", { place: ["station", "airport", "bus stop", "hotel"] }],
].map(([k, w, prompt, slots], i) => {
  const options = rot(["no", "not", "none", "any"], i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: WHY[w], slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write no or not.";
const BUILD = [
  ["no", "no", "There's ______ cheese in the {place}, {name}.", { place: ["fridge", "kitchen", "bag", "box"], name: NAME }],
  ["no", "no", "I've got ______ brothers, but I have two {sib}.", { sib: ["sisters", "cousins"] }],
  ["no", "no", "We had ______ rain {when}, {name}.", { when: ["last month", "this summer", "in August", "all week"], name: NAME }],
  ["no", "no", "There are ______ buses after {time} in our town, {name}.", { time: ["ten", "eleven", "midnight", "nine"], name: NAME }],
  ["no", "no", "{name} has ______ free time {when}.", { name: NAME, when: ["this week", "today", "on Mondays", "before exams"] }],
  ["no", "no", "Our village has ______ cinema, {name}.", { name: NAME }],
  ["no", "no", "There's ______ wifi in this {place}, {name}.", { place: ["café", "hotel", "room", "train"], name: NAME }],
  ["no", "no", "I have ______ questions, {name}. Everything is clear.", { name: NAME }],
  ["no", "no", "There were ______ eggs at the {shop}, {name}.", { shop: ["bazaar", "shop", "market", "supermarket"], name: NAME }],
  ["no", "no", "My uncle has ______ car, so he goes by {transport}.", { transport: ["bus", "metro", "bike", "taxi"] }],
  ["not", "not", "The museum is ______ open on {day}, {name}.", { day: ["Mondays", "Tuesdays", "holidays", "Sundays"], name: NAME }],
  ["not", "not", "I'm ______ hungry, {name}. I had a big {meal}.", { name: NAME, meal: ["lunch", "breakfast", "dinner", "plate of plov"] }],
  ["not", "notany", "There's ______ any juice left, {name}.", { name: NAME }],
  ["not", "notany", "We have ______ any lessons on {day}, {name}.", { day: ["Sunday", "Navruz", "the first of January", "Independence Day"], name: NAME }],
  ["not", "not", "{name} is ______ here. He's at the {place}.", { name: NAMEM, place: ["gym", "bank", "bazaar", "library"] }],
  ["not", "not", "It's ______ cold today, {name}. You don't need a {thing}.", { name: NAME, thing: ["coat", "hat", "scarf", "jacket"] }],
  ["not", "not", "The test was ______ difficult, {name}. I finished it in {n} minutes.", { name: NAME, n: ["twenty", "fifteen", "thirty", "ten"] }],
  ["not", "not", "My phone is ______ working, {name}. Can I use yours?", { name: NAME }],
  ["not", "notany", "There were ______ any free seats, so we sat on the {place}.", { place: ["floor", "stairs", "grass", "steps"] }],
  ["not", "not", "The bus is ______ late today, {name}. It's on time.", { name: NAME }],
].map(([key, w, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[w], slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TO_NO = "Rewrite with no. Keep the meaning.";
const TO_ANY = "Rewrite with not … any. Keep the meaning.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // not … any -> no (5)
  [TO_NO, "There isn't any milk in the {place}, {name}.", "There is ______ milk in the {place}, {name}.", "no", WHY.no, { place: ["fridge", "jug", "bottle", "kitchen"], name: NAME }],
  [TO_NO, "We don't have any lessons on {day}, {name}.", "We have ______ lessons on {day}, {name}.", "no", WHY.no, { day: ["Sunday", "Navruz", "Saturday", "holidays"], name: NAME }],
  [TO_NO, "I haven't got any money for the {thing}, {name}.", "I have got ______ money for the {thing}, {name}.", "no", WHY.no, { thing: ["ticket", "trip", "taxi", "concert"], name: NAME }],
  [TO_NO, "There aren't any shops in our {place}.", "There are ______ shops in our {place}.", "no", WHY.no, { place: ["village", "street", "building", "area"] }],
  [TO_NO, "{name} doesn't have any time {when}.", "{name} has ______ time {when}.", "no", WHY.no, { name: NAME, when: ["today", "this week", "before the exam", "in the morning"] }],
  // no -> not … any (5)
  [TO_ANY, "There is no sugar in my {drink}, {name}.", "There is ______ ______ sugar in my {drink}, {name}.", ["not", "any"], WHY.notany, { drink: ["tea", "coffee", "cocoa", "milk"], name: NAME }],
  [TO_ANY, "We have no bread for {meal}, {name}.", "We do ______ have ______ bread for {meal}, {name}.", ["not", "any"], WHY.notany, { meal: ["breakfast", "lunch", "dinner", "the guests"], name: NAME }],
  [TO_ANY, "There were no taxis at the {place}.", "There were ______ ______ taxis at the {place}.", ["not", "any"], WHY.notany, { place: ["station", "airport", "bus stop", "hotel"] }],
  [TO_ANY, "{name} has no homework {when}.", "{name} does ______ have ______ homework {when}.", ["not", "any"], WHY.notany, { name: NAME, when: ["today", "tonight", "this weekend", "for Monday"] }],
  [TO_ANY, "I have no plans for the {when}, {name}.", "I do ______ have ______ plans for the {when}, {name}.", ["not", "any"], WHY.notany, { when: ["weekend", "holidays", "evening", "summer"], name: NAME }],
  // correct the mistake (5)
  [COR, "There is no any milk in the {place}, {name}.", "There is ______ any milk in the {place}, {name}.", "not", WHY.notany, { place: ["fridge", "jug", "kitchen", "bottle"], name: NAME }],
  [COR, "I have not money for the {thing}, {name}.", "I have ______ money for the {thing}, {name}.", "no", WHY.no, { thing: ["ticket", "trip", "taxi", "concert"], name: NAME }],
  [COR, "The shop is no open on {day}, {name}.", "The shop is ______ open on {day}, {name}.", "not", WHY.not, { day: ["Mondays", "Sundays", "holidays", "Navruz"], name: NAME }],
  [COR, "We have not time for {meal}, {name}.", "We have ______ time for {meal}, {name}.", "no", WHY.no, { meal: ["breakfast", "lunch", "tea", "dinner"], name: NAME }],
  [COR, "My sister is no at home {when}, {name}.", "My sister is ______ at home {when}, {name}.", "not", WHY.not, { when: ["today", "now", "this week", "on Fridays"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something your home has none of.", "There is / are no …", ["exactly one sentence", "no + noun", "a positive verb"]],
  ["Write one sentence about something you are not today.", "I'm not … today.", ["exactly one sentence", "not + adjective", "today"]],
  ["Write one sentence about food you don't have at home now. Use not … any.", "We don't have any …", ["exactly one sentence", "not + any", "a food word"]],
  ["Write one sentence about a free day: what you have no time for, or no lessons.", "I have no … on …", ["exactly one sentence", "no + noun", "a day word"]],
  ["Write one sentence about a place that is not open or not near.", "The … is not …", ["exactly one sentence", "not + adjective or place", "a place word"]],
  ["Write one sentence about your town using There are no …", "There are no … in my town.", ["exactly one sentence", "no + plural noun", "There are"]],
  ["Write one sentence about a person who is not at home now.", "My … is not at home.", ["exactly one sentence", "not at home", "a person word"]],
  ["Write two sentences: one with no and one with not.", "There is no … / It is not …", ["exactly two sentences", "no + noun", "not + adjective or verb"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a small village: what does it have and what does it not have?", "There is no … / It is not …", ["no + noun", "not + adjective", "three or four sentences"]],
  ["You can't come to a friend's party. Write a message explaining why.", "I'm not … / I have no time …", ["no and not", "a reason", "three or four sentences"]],
  ["Describe a bad day at a hotel or hostel.", "There was no hot water … The room was not …", ["no + noun", "not + adjective", "three or four sentences"]],
  ["Describe your fridge or kitchen before shopping day.", "There is no … / There isn't any …", ["no + noun", "not … any", "three or four sentences"]],
  ["Describe a holiday when you had no lessons or work.", "We had no … / I was not …", ["no and not", "past verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/questions-negation.negation.no-vs-not.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "Before a noun (milk), with a positive verb: no.",
   "Before a noun (idea): no.",
   "Before a noun (lessons): no.",
   "Before a noun (seats): no.",
   "Before a noun (time): no.",
   "Before a noun (hot water): no.",
   "Before a noun (internet): no.",
   "Before a noun (shops): no.",
   "Before a noun (money): no.",
   "Before a noun (windows): no.",
   "Before a noun (sugar): no.",
   "Before an adjective (hot): not.",
   "Before an -ing verb (working): not.",
   "Before an adjective (very tall): not.",
   "Before an adjective (ready): not.",
   "\"any bread\" after the gap: not.",
   "\"any homework\" after the gap: not.",
   "Before a place (at home): not.",
   "Before an adjective (far): not.",
   "\"any taxis\" after the gap: not."
  ],
  "build": [
   "Noun after the gap (cheese): no.",
   "Noun after the gap (brothers): no.",
   "Noun after the gap (rain): no.",
   "Noun after the gap (buses): no.",
   "Noun after the gap (free time): no.",
   "Noun after the gap (cinema): no.",
   "Noun after the gap (wifi): no.",
   "Noun after the gap (questions): no.",
   "Noun after the gap (eggs): no.",
   "Noun after the gap (car): no.",
   "Adjective after the gap (open): not.",
   "Adjective after the gap (hungry): not.",
   "\"any juice\" after the gap: not.",
   "\"any lessons\" after the gap: not.",
   "Place word after the gap (here): not.",
   "Adjective after the gap (cold): not.",
   "Adjective after the gap (difficult): not.",
   "-ing after the gap (working): not.",
   "\"any free seats\" after the gap: not.",
   "Adjective after the gap (late): not."
  ],
  "transform": [
   "isn't any = is no.",
   "don't have any = have no.",
   "haven't got any = have got no.",
   "aren't any = are no.",
   "doesn't have any = has no.",
   "is no = is not any.",
   "have no = do not have any.",
   "were no = were not any.",
   "has no = does not have any.",
   "I have no plans = I do not have any plans.",
   "Never no any: not any.",
   "Before a noun (money): no, not not.",
   "Before an adjective: not, not no.",
   "Before a noun (time): no, not not.",
   "Before a place: not, not no."
  ]
 },
 "slot": [
  [
   "choose",
   4,
   "stood",
   "act",
   [
    "stood",
    "waited",
    "walked",
    "got off"
   ]
  ],
  [
   "choose",
   7,
   "grandparents",
   "who",
   [
    "grandparents",
    "neighbours",
    "aunt and uncle",
    "cousins"
   ]
  ],
  [
   "choose",
   10,
   "dark",
   "adj",
   [
    "dark",
    "stuffy",
    "gloomy",
    "warm"
   ]
  ],
  [
   "choose",
   13,
   "today",
   "when",
   [
    "today",
    "tonight",
    "this morning",
    "this afternoon"
   ]
  ],
  [
   "choose",
   14,
   "brother",
   "rel",
   [
    "brother",
    "cousin",
    "uncle",
    "dad"
   ]
  ],
  [
   "choose",
   16,
   "bread",
   "food",
   [
    "bread",
    "milk",
    "rice",
    "butter"
   ]
  ],
  [
   "choose",
   19,
   "station",
   "place",
   [
    "station",
    "bazaar",
    "park",
    "library"
   ]
  ],
  [
   "choose",
   20,
   "walked",
   "act",
   [
    "walked",
    "took the bus",
    "waited",
    "stayed"
   ]
  ],
  [
   "build",
   2,
   "",
   "sib",
   [
    "cats",
    "dogs"
   ]
  ],
  [
   "build",
   6,
   "village",
   "place",
   [
    "village",
    "town",
    "street",
    "area"
   ]
  ],
  [
   "build",
   8,
   "questions",
   "what",
   [
    "questions",
    "problems",
    "doubts",
    "worries"
   ]
  ],
  [
   "build",
   10,
   "uncle",
   "rel",
   [
    "uncle",
    "grandpa",
    "brother",
    "dad"
   ]
  ],
  [
   "build",
   13,
   "juice",
   "drink",
   [
    "juice",
    "milk",
    "tea",
    "water"
   ]
  ],
  [
   "build",
   18,
   "phone",
   "dev",
   [
    "phone",
    "laptop",
    "pen",
    "charger"
   ]
  ],
  [
   "build",
   20,
   "bus",
   "veh",
   [
    "bus",
    "train",
    "ferry",
    "tram"
   ]
  ],
  [
   "transform",
   4,
   "shops",
   "what",
   [
    "shops",
    "cafés",
    "banks",
    "parks"
   ]
  ],
  [
   "transform",
   8,
   "taxis",
   "what",
   [
    "taxis",
    "buses",
    "trains",
    "cars"
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
console.log(`wrote ${out} — ${items.length} items`);