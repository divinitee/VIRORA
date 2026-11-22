// Hand-authored: verb-patterns / gerund-infinitive / avoid-gerund (B1).
// Wave C, C24 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: avoid + -ing ("You should avoid ______ too much coffee
// before bed" → drinking).
// Learner errors: "avoid to drink" (carried over from want / decide / try
// + to), the bare verb, and "avoid from drinking" (Uzbek "-dan qochmoq",
// Russian "избегать" + genitive feel like "from / of").
// Sibling enjoy-gerund (A2) keys enjoy / like / love + -ing; avoid is never
// used there, and enjoy / like are never keyed here. avoid + to / bare /
// from / of is wrong in every context, so every option set is safe.
// Choose: 20 avoid + -ing (present, past, should avoid, try to avoid,
// couldn't avoid, imperative Avoid …). Options -ing / to + verb / bare /
// from + -ing.
// Build: the verb in brackets after avoid, 20 typed -ing keys (no spelling
// splits like travelling).
// Transform: 5 correct the mistake / 5 habit → I try to avoid / 5 Don't …
// → You should avoid.
//
// Run: node tools/grammar-practice/authored/verb-patterns.gerund-infinitive.avoid-gerund.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "gerund-infinitive", topic: "avoid-gerund", level: "B1", pv: "2.5" };
const BOY = ["Aziz", "Timur", "Bobur", "Jasur"];
const GIRL = ["Olga", "Lola", "Madina", "Kamila"];
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const PLACE = ["bank", "post office", "airport", "clinic"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W = "avoid is always followed by the -ing form: avoid eating. Never avoid to eat, avoid eat or avoid from eating.";
const O = (ing, base) => [ing, `to ${base}`, base, `from ${ing}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O("eating", "eat"), "Try to avoid ______ {food} late at night, {name}.", { food: ["fast food", "sweets", "fried food", "heavy food"], name: NAME }],
  [O("drinking", "drink"), "The doctor told my {who} to avoid ______ {drink}.", { who: ["dad", "uncle", "grandpa", "mum"], drink: ["coffee", "cola", "energy drinks", "sweet tea"] }],
  [O("driving", "drive"), "We always avoid ______ in the {place} {time}.", { place: ["city centre", "old town", "market area", "busy streets"], time: ["at rush hour", "in the evening", "on Mondays", "in the rain"] }],
  [O("talking", "talk"), "{g} avoids ______ about her {topic}.", { g: GIRL, topic: ["problems", "exams", "job", "mistakes"] }],
  [O("making", "make"), "I try to avoid ______ the same mistakes in my {work}, {name}.", { work: ["essays", "tests", "homework", "emails"], name: NAME }],
  [O("answering", "answer"), "My brother avoided ______ my question {when}.", { when: PAST }],
  [O("going", "go"), "We avoid ______ to the {place} on {day} because it's too crowded.", { place: ["bazaar", "mall", "park", "beach"], day: ["Sundays", "Saturdays", "holidays", "Fridays"] }],
  [O("using", "use"), "Avoid ______ your phone while you {act}, {name}.", { act: ["drive", "eat", "cross the road", "study"], name: NAME }],
  [O("meeting", "meet"), "{g} avoided ______ her old classmate at the {place} {when}.", { g: GIRL, place: ["café", "bazaar", "station", "park"], when: PAST }],
  [O("spending", "spend"), "We should avoid ______ too much money on {thing}, {name}.", { thing: ["clothes", "games", "snacks", "taxis"], name: NAME }],
  [O("sitting", "sit"), "Avoid ______ in the sun for too long {when}, {name}.", { when: ["in July", "at midday", "in summer", "on hot days"], name: NAME }],
  [O("looking", "look"), "{b} avoided ______ at me during the {event}.", { b: BOY, event: ["lesson", "meeting", "dinner", "wedding"] }],
  [O("waiting", "wait"), "I left early to avoid ______ in the queue at the {place} {when}.", { place: PLACE, when: PAST }],
  [O("saying", "say"), "Try to avoid ______ \"um\" too often in your {talk}, {name}.", { talk: ["presentation", "speech", "interview", "answers"], name: NAME }],
  [O("flying", "fly"), "My aunt avoids ______ because she is afraid of {fear}.", { fear: ["heights", "planes", "small spaces", "storms"] }],
  [O("being", "be"), "I try to avoid ______ late for {event}, {name}.", { event: ["lessons", "work", "meetings", "the bus"], name: NAME }],
  [O("watching", "watch"), "Our kids avoid ______ scary {films} before {time}.", { films: ["films", "videos", "shows", "cartoons"], time: ["bed", "sleep", "dinner", "school"] }],
  [O("working", "work"), "My dad avoids ______ on {day} because it's family time.", { day: ["Sundays", "Saturdays", "Fridays", "holidays"] }],
  [O("hitting", "hit"), "The driver couldn't avoid ______ the {thing} on the road {when}.", { thing: ["hole", "rock", "box", "branch"], when: PAST }],
  [O("calling", "call"), "Why do you always avoid ______ me, {name}?", { name: NAME }],
].map(([opts, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: W, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets in the right form.";
const BUILD = [
  ["eating", "I always avoid ______ (eat) {food} before an {event}.", { food: ["heavy food", "garlic", "onions", "beans"], event: ["exam", "interview", "important lesson", "early meeting"] }],
  ["driving", "My mum avoids ______ (drive) at night in the {weather}, {name}.", { weather: ["rain", "snow", "fog", "winter"], name: NAME }],
  ["sitting", "You should avoid ______ (sit) at the computer all {span}, {name}.", { span: ["day", "evening", "night", "weekend"], name: NAME }],
  ["telling", "{b} avoided ______ (tell) his parents about the {thing}.", { b: BOY, thing: ["bad mark", "broken window", "lost phone", "small accident"] }],
  ["getting", "We left at {h} {when} to avoid ______ (get) stuck in traffic.", { h: ["six", "five", "seven", "half past six"], when: PAST }],
  ["using", "Try to avoid ______ (use) {tool} in your essays, {name}.", { tool: ["slang", "short forms", "the same words", "very long sentences"], name: NAME }],
  ["answering", "My cousin avoids ______ (answer) the phone when she is {busy}, {name}.", { busy: ["busy", "driving", "at work", "tired"], name: NAME }],
  ["going", "I avoid ______ (go) to the {place} on {day}.", { place: ["bazaar", "mall", "gym", "bank"], day: ["Saturdays", "Sundays", "Mondays", "holidays"] }],
  ["speaking", "{g} avoided ______ (speak) to the {who} after the {event}.", { g: GIRL, who: ["teacher", "coach", "boss", "director"], event: ["lesson", "match", "meeting", "concert"] }],
  ["swimming", "Avoid ______ (swim) in the {water} after a big meal, {name}.", { water: ["river", "lake", "sea", "pool"], name: NAME }],
  ["paying", "He always avoids ______ (pay) for {thing}, {name}.", { thing: ["taxis", "coffee", "lunch", "tickets"], name: NAME }],
  ["smoking", "Doctors tell people to avoid ______ (smoke) {where}, {name}.", { where: ["near children", "at home", "in the car", "indoors"], name: NAME }],
  ["walking", "We avoided ______ (walk) through the {place} {when}.", { place: ["park", "old town", "forest", "empty streets"], when: ["last night", "after dark", "on Friday night", "at midnight"] }],
  ["buying", "I try to avoid ______ (buy) {thing} online, {name}.", { thing: ["shoes", "clothes", "food", "glasses"], name: NAME }],
  ["taking", "My grandpa avoids ______ (take) the {transport} because it's {adj}.", { transport: ["bus", "metro", "train", "minibus"], adj: ["crowded", "slow", "noisy", "hot"] }],
  ["waking", "Avoid ______ (wake) {who}, {name}. He's just fallen asleep.", { who: ["Grandpa", "your brother", "the baby", "Dad"], name: GIRL }],
  ["staying", "We avoided ______ (stay) in the {place} because it was too {adj}.", { place: ["hotel", "flat", "guesthouse", "camp"], adj: ["noisy", "expensive", "dirty", "far"] }],
  ["losing", "Try to avoid ______ (lose) your {thing} on the trip, {name}.", { thing: ["tickets", "keys", "passport", "phone"], name: NAME }],
  ["cooking", "My sister avoids ______ (cook) {food} because it takes too long, {name}.", { food: ["plov", "manti", "bread", "soup"], name: NAME }],
  ["hearing", "I couldn't avoid ______ (hear) their {talk} {when}.", { talk: ["argument", "conversation", "music", "phone call"], when: PAST }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const TRY = "Rewrite with I try to avoid.";
const ADV = "Rewrite with You should avoid.";
const TRANSFORM = [
  // correct (5)
  [COR, "I try to avoid to eat {food} at night, {name}.", "I try to avoid ______ {food} at night, {name}.", "eating", { food: ["sweets", "fast food", "bread", "fried food"], name: NAME }],
  [COR, "My dad avoids from drinking {drink} {when}.", "My dad avoids ______ {drink} {when}.", "drinking", { drink: ["coffee", "cola", "sweet tea", "energy drinks"], when: ["at night", "after six", "in the evening", "before bed"] }],
  [COR, "We avoid go to the {place} on {day}.", "We avoid ______ to the {place} on {day}.", "going", { place: ["bazaar", "mall", "park", "beach"], day: ["Sundays", "Saturdays", "holidays", "Fridays"] }],
  [COR, "{b} avoided to answer my question {when}.", "{b} avoided ______ my question {when}.", "answering", { b: BOY, when: PAST }],
  [COR, "{g} avoids of talking about her {topic}.", "{g} avoids ______ about her {topic}.", "talking", { g: GIRL, topic: ["problems", "exams", "job", "family"] }],
  // habit -> I try to avoid (5)
  [TRY, "I don't usually eat {food} at night, {name}.", "I try to avoid ______ {food} at night, {name}.", "eating", { food: ["sweets", "fast food", "cake", "chips"], name: NAME }],
  [TRY, "I don't usually take taxis in {city}, {name}.", "I try to avoid ______ taxis in {city}, {name}.", "taking", { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], name: NAME }],
  [TRY, "I don't usually spend money on {thing}, {name}.", "I try to avoid ______ money on {thing}, {name}.", "spending", { thing: ["clothes", "games", "snacks", "coffee"], name: NAME }],
  [TRY, "I don't usually drive in the {place} at rush hour, {name}.", "I try to avoid ______ in the {place} at rush hour, {name}.", "driving", { place: ["city centre", "old town", "market area", "busy streets"], name: NAME }],
  [TRY, "I don't usually check my phone during {event}, {name}.", "I try to avoid ______ my phone during {event}, {name}.", "checking", { event: ["lessons", "dinner", "meetings", "films"], name: NAME }],
  // Don't ... -> You should avoid (5)
  [ADV, "Don't drink {drink} before bed, {name}.", "You should avoid ______ {drink} before bed, {name}.", "drinking", { drink: ["coffee", "cola", "strong tea", "energy drinks"], name: NAME }],
  [ADV, "Don't sit in the sun at midday {when}, {name}.", "You should avoid ______ in the sun at midday {when}, {name}.", "sitting", { when: ["in July", "in summer", "on hot days", "in August"], name: NAME }],
  [ADV, "Don't use your phone while you {act}, {name}.", "You should avoid ______ your phone while you {act}, {name}.", "using", { act: ["drive", "eat", "cross the road", "study"], name: NAME }],
  [ADV, "Don't swim in the {water} after a big meal, {name}.", "You should avoid ______ in the {water} after a big meal, {name}.", "swimming", { water: ["river", "lake", "sea", "pool"], name: NAME }],
  [ADV, "Don't walk through the {place} after dark, {name}.", "You should avoid ______ through the {place} after dark, {name}.", "walking", { place: ["park", "old town", "forest", "empty streets"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: W, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a food you try to avoid.", "I try to avoid eating …", ["exactly one sentence", "avoid + -ing", "no avoid to"]],
  ["Write one sentence of advice for someone who can't sleep.", "You should avoid drinking …", ["exactly one sentence", "should avoid + -ing", "a reason or time"]],
  ["Write one sentence about a place you avoid going to.", "I avoid going to … because …", ["exactly one sentence", "avoid + -ing", "because"]],
  ["Write one sentence about something a friend avoided doing.", "My friend avoided …", ["exactly one sentence", "avoided + -ing", "a past time"]],
  ["Write one sentence about a mistake you try to avoid in English.", "I try to avoid making …", ["exactly one sentence", "avoid + -ing", "about English"]],
  ["Write one sentence giving a safety tip.", "Avoid using … while …", ["exactly one sentence", "Avoid + -ing", "while"]],
  ["Write one sentence about why you left home early one day.", "I left early to avoid getting …", ["exactly one sentence", "to avoid + -ing", "a past verb"]],
  ["Write one sentence about a topic someone in your family avoids talking about.", "My … avoids talking about …", ["exactly one sentence", "avoids + -ing", "no avoid from"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Give advice to a student before an important exam.", "You should avoid staying up late … Avoid drinking …", ["avoid + -ing", "should", "three or four sentences"]],
  ["Describe your healthy habits.", "I try to avoid eating … I avoid sitting …", ["avoid + -ing", "present verbs", "three or four sentences"]],
  ["Write about a day when you avoided doing something.", "I avoided … because … In the end …", ["avoided + -ing", "past verbs", "three or four sentences"]],
  ["Give tips for a tourist visiting your city.", "Avoid taking … Try to avoid going …", ["avoid + -ing", "imperatives", "three or four sentences"]],
  ["Describe a person who avoids difficult conversations.", "My … avoids talking about … He / She avoids answering …", ["avoids + -ing", "present verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.gerund-infinitive.avoid-gerund.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "Try not to eat: avoid + -ing: eating.",
   "Not drinking is the advice: avoid + drinking.",
   "We stay away from driving there: avoid + driving.",
   "She doesn't talk about it: avoids + talking.",
   "Not making mistakes: avoid + making.",
   "He didn't answer: avoided + answering.",
   "\"too crowded\", so we don't go: avoid + going.",
   "Don't use it then: avoid + using.",
   "She didn't want to meet her: avoided + meeting.",
   "Don't spend too much: avoid + spending.",
   "Don't sit in the sun: avoid + sitting.",
   "He didn't look at me: avoided + looking.",
   "Not waiting in the queue: avoid + waiting.",
   "Don't say it too often: avoid + saying.",
   "\"afraid of …\", so she doesn't fly: avoids + flying.",
   "Not being late: avoid + being.",
   "They don't watch them: avoid + watching.",
   "\"family time\", so no work: avoids + working.",
   "He couldn't stop it happening: avoid + hitting.",
   "You never call me: avoid + calling."
  ],
  "build": [
   "avoid + -ing: eat → eating.",
   "avoid + -ing: drive → driving (drop e).",
   "avoid + -ing: sit → sitting (double t).",
   "avoid + -ing: tell → telling.",
   "avoid + -ing: get → getting (double t).",
   "avoid + -ing: use → using (drop e).",
   "avoid + -ing: answer → answering.",
   "avoid + -ing: go → going.",
   "avoid + -ing: speak → speaking.",
   "avoid + -ing: swim → swimming (double m).",
   "avoid + -ing: pay → paying.",
   "avoid + -ing: smoke → smoking (drop e).",
   "avoid + -ing: walk → walking.",
   "avoid + -ing: buy → buying.",
   "avoid + -ing: take → taking (drop e).",
   "avoid + -ing: wake → waking (drop e).",
   "avoid + -ing: stay → staying.",
   "avoid + -ing: lose → losing (drop e).",
   "avoid + -ing: cook → cooking.",
   "avoid + -ing: hear → hearing."
  ],
  "transform": [
   "avoid + -ing, not to + verb: eating.",
   "No from after avoid: drinking.",
   "avoid + -ing, not the base verb: going.",
   "avoid + -ing, not to + verb: answering.",
   "No of after avoid: talking.",
   "don't usually eat → try to avoid eating.",
   "don't usually take → try to avoid taking.",
   "don't usually spend → try to avoid spending.",
   "don't usually drive → try to avoid driving.",
   "don't usually check → try to avoid checking.",
   "Don't drink → should avoid drinking.",
   "Don't sit → should avoid sitting.",
   "Don't use → should avoid using.",
   "Don't swim → should avoid swimming.",
   "Don't walk → should avoid walking."
  ]
 },
 "slot": [
  [
   "choose",
   6,
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
   15,
   "aunt",
   "rel",
   [
    "aunt",
    "grandma",
    "mum",
    "sister"
   ]
  ],
  [
   "choose",
   18,
   "dad",
   "rel",
   [
    "dad",
    "uncle",
    "grandpa",
    "brother"
   ]
  ],
  [
   "choose",
   20,
   "always",
   "freq",
   [
    "always",
    "often",
    "sometimes",
    "usually"
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