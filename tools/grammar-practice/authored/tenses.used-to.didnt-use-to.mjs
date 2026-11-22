// Hand-authored: tenses / used-to / didnt-use-to (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): the NEGATIVE didn't use to + base form for
// something that was not true or not done in the past but is now. After did,
// "use" has no -d ("She didn't use to like coffee").
// Triage: kept. used-to-state (positive) is live; would-habit / would-vs-used-to
// are C1. So: negatives only, no questions, no positive used to as a key.
// Every sentence shows the change: "but now ...", "Now ...", "last year".
//
// Distractors are the real learner errors, never a second right answer:
//   - didn't used to (the -d kept after did);
//   - wasn't / weren't used to + base form (mixed up with be used to);
//   - didn't use + base form (to dropped);
//   - don't / doesn't use to (present tense for a past fact);
//   - didn't use to + -ing.
// Never offered: "used not to" (formal British, correct) and "never used to"
// (correct). Subjects are always people, so "wasn't used to + verb" can't be
// read as a passive ("the room wasn't used to ...").
// Typed keys are "didn't use to + verb". The gate refuses a key that repeats a
// printed word, so no build source or transform hint contains to, use or
// didn't outside the bracket.
// Transform: 5 positive used to → negative / 5 correct the mistake /
// 5 past simple negative + "now" → didn't use to.
//
// Run: node tools/grammar-practice/authored/tenses.used-to.didnt-use-to.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "used-to", topic: "didnt-use-to", level: "B1", pv: "2.5" };
const NAME_F = ["Madina", "Olga", "Sevara", "Nilufar"];
const NAME_M = ["Sardor", "Timur", "Ilya", "Jasur"];
const WHEN = ["year", "summer", "spring", "winter"];
const BE = { i: "wasn't", sg: "wasn't", pl: "weren't" };
const DO = { i: "don't", sg: "doesn't", pl: "don't" };
const why = (v) => `It was not true in the past, but it is now: didn't use to + the base form, ${v}. After did, write use with no -d.`;

/* ---------------- choose: 20 mcq ---------------- */
// [set, subj, verb, ing, prompt, slots]
const CHOOSE = [
  ["A", "i", "like", "liking", "I ______ {food}, but now I eat it every {day}.", { food: ["fish", "spinach", "cheese", "garlic"], day: ["day", "week", "evening", "weekend"] }],
  ["B", "sg", "drink", "drinking", "My mother ______ coffee, but now she has a cup every {time}.", { time: ["morning", "afternoon", "evening", "day"], x: [] }],
  ["A", "pl", "have", "having", "We ______ a {thing} at home. We bought one last {when}.", { thing: ["car", "computer", "washing machine", "big fridge"], when: WHEN }],
  ["B", "sg", "speak", "speaking", "{name} ______ English, but now he speaks it at work with {who}.", { name: NAME_M, who: ["tourists", "his boss", "clients", "visitors"] }],
  ["A", "i", "enjoy", "enjoying", "I ______ {subj} at school. Now it's my favourite subject, {name}.", { subj: ["maths", "history", "chemistry", "physics"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["B", "pl", "live", "living", "My cousins ______ near us. They moved here from {city} last {when}.", { city: ["Nukus", "Termez", "Almaty", "Kazan"], when: WHEN }],
  ["A", "sg", "wear", "wearing", "My {who} ______ glasses, but now he needs them for {task}.", { who: ["father", "grandfather", "uncle", "brother"], task: ["reading", "driving", "the computer", "work"] }],
  ["B", "i", "eat", "eating", "I ______ breakfast, but now I have {food} every {time}.", { food: ["eggs", "porridge", "bread and tea", "fruit"], time: ["morning", "day", "school day", "weekday"] }],
  ["A", "sg", "get", "getting", "My sister ______ up early, but now she gets up at {time} for {thing}.", { time: ["six", "half past six", "seven", "five"], thing: ["work", "college", "training", "her job"] }],
  ["B", "pl", "go", "going", "We ______ {where} on holiday, but now we go there every {season}.", { where: ["to the mountains", "to the sea", "to Samarkand", "to the lake"], season: ["summer", "year", "spring", "autumn"] }],
  ["A", "sg", "play", "playing", "{name} ______ {sport}. He started last {when} and now he loves it.", { name: ["Bekzod", "Anton", "Rustam", "Aziz"], sport: ["chess", "tennis", "volleyball", "basketball"], when: WHEN }],
  ["B", "i", "know", "knowing", "I ______ how to {task}, but my {who} taught me.", { task: ["cook plov", "swim", "drive", "ride a bike"], who: ["grandmother", "father", "aunt", "older brother"] }],
  ["A", "pl", "watch", "watching", "My parents ______ {show}, but now they watch it every {day}.", { show: ["football", "the news", "the weather forecast", "that quiz show"], day: ["evening", "weekend", "Sunday", "night"] }],
  ["B", "sg", "walk", "walking", "{name} ______ to school, but now she walks there every {day} with {who}.", { name: NAME_F, day: ["morning", "day"], who: ["her friends", "her sister", "her cousin", "her neighbour"] }],
  ["A", "pl", "have", "having", "We ______ a {room} in our old {home}, but our new home has two.", { room: ["balcony", "bathroom", "storeroom", "big bedroom"], home: ["flat", "house", "place"] }],
  ["B", "sg", "like", "liking", "My little brother ______ {pet}, but now he plays with them all {time}.", { pet: ["cats", "dogs", "rabbits", "puppies"], time: ["day", "evening", "afternoon", "weekend"] }],
  ["A", "i", "be", "being", "I ______ good at {subj}, but I practised a lot last {when}.", { subj: ["drawing", "chess", "English", "singing"], when: ["year", "summer", "winter", "term"] }],
  ["B", "sg", "cook", "cooking", "My {who} ______ {food}, but now she makes it every {day}.", { who: ["aunt", "sister", "mother", "cousin"], food: ["manti", "samsa", "lagman", "pizza"], day: ["Friday", "Sunday", "weekend", "holiday"] }],
  ["A", "pl", "talk", "talking", "My {who} ______ much, but now they talk on the phone every {time}.", { who: ["brothers", "cousins", "sisters", "neighbours"], time: ["evening", "day", "night", "weekend"] }],
  ["B", "i", "read", "reading", "I ______ books, but now I read one every {time} on the {transport}.", { time: ["week", "month"], transport: ["bus", "metro", "train", "minibus"] }],
].map(([set, subj, v, ing, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  // Audit 21 Nov: "didn't used to" is accepted by some dictionaries, so it is a wrong option in 4 items only.
  const second = i < 4 ? `didn't used to ${v}` : set === "A" ? `${DO[subj]} use to ${v}` : `${BE[subj]} used to ${v}`;
  const opts = set === "A"
    ? [`didn't use to ${v}`, second, `${BE[subj]} used to ${v}`, `didn't use ${v}`]
    : [`didn't use to ${v}`, second, `${DO[subj]} use to ${v}`, `didn't use to ${ing}`];
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(`didn't use to ${v}`), why: why(`didn't use to ${v}`), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete the sentence with didn't use to and the verb in brackets.";
// No source prints to, use or didn't (the key would echo them).
const BUILD = [
  ["like", "As a child, I ______ (like) {food}. Now I love it with {side}.", { food: ["rice", "fish", "cheese", "soup"], side: ["bread", "salad", "tomatoes", "herbs"] }],
  ["have", "My grandparents ______ (have) a phone. They got one last {when} and now they call us every {day}.", { when: WHEN, day: ["day", "evening", "Sunday", "morning"] }],
  ["drive", "My {who} ______ (drive). He learned last {when}.", { who: ["father", "uncle", "older brother", "grandfather"], when: ["year", "summer", "spring", "autumn"] }],
  ["eat", "{name} ______ (eat) meat, but now she eats {food} every week.", { name: NAME_F, food: ["chicken", "beef", "lamb", "kebabs"] }],
  ["go", "We ______ (go) out on {day}. Now we visit the {place} every week.", { day: ["Saturdays", "Sundays", "Fridays", "weekdays"], place: ["park", "café", "bazaar", "cinema"] }],
  ["speak", "My friend ______ (speak) Russian, but now he speaks it with {who} at {place}.", { who: ["customers", "colleagues", "his boss", "tourists"], place: ["work", "the shop", "the hotel", "the bank"] }],
  ["study", "I ______ (study) hard at {school}, but now I work hard every {time}.", { school: ["school", "primary school", "my old school", "college"], time: ["evening", "day", "weekend", "night"] }],
  ["be", "Our {place} ______ (be) so busy. Now there are {thing} everywhere.", { place: ["street", "village", "area", "town"], thing: ["cars", "people", "shops", "new houses"] }],
  ["wear", "My little brother ______ (wear) a {thing}. Now he wears one every {day}.", { thing: ["watch", "cap", "scarf", "helmet"], day: ["day", "morning", "Sunday", "evening"] }],
  ["watch", "My parents ______ (watch) {show}. Now they never miss it on {day}.", { show: ["football", "the news", "that quiz show", "the weather forecast"], day: ["Saturdays", "Sundays", "Fridays", "weekdays"] }],
  ["play", "{name} ______ (play) chess. Her {who} taught her last {when}.", { name: NAME_F, who: ["grandfather", "uncle", "teacher", "brother"], when: WHEN }],
  ["know", "We ______ (know) our neighbours in the {place}, but now we visit them every {day}.", { place: ["old building", "village", "new block", "old street"], day: ["Friday", "Sunday", "week", "month"] }],
  ["work", "My {who} ______ (work) at weekends, but now she has a job in a {place} and works on Saturdays.", { who: ["mother", "aunt", "sister", "cousin"], place: ["shop", "café", "bakery", "hotel"] }],
  ["take", "I ______ (take) the {transport}, but now I'm on it every {time}.", { transport: ["bus", "metro", "tram", "minibus"], time: ["morning", "day", "evening", "weekday"] }],
  ["cook", "My father ______ (cook), but now he makes {food} on {day}.", { food: ["plov", "eggs", "soup", "pasta"], day: ["Sundays", "Fridays", "holidays", "weekends"] }],
  ["sleep", "My {who} ______ (sleep) well, but now she sleeps all night in her own {room}.", { who: ["little sister", "baby sister", "little cousin"], room: ["room", "bed", "bedroom"] }],
  ["call", "My {who} ______ (call) me, but now we talk every {time}.", { who: ["brother", "cousin", "best friend", "uncle"], time: ["day", "evening", "weekend", "Sunday"] }],
  ["ride", "{name} ______ (ride) a bike, but now he rides one every {day} in the {place}.", { name: NAME_M, day: ["day", "morning", "weekend", "evening"], place: ["park", "yard", "village", "street"] }],
  ["enjoy", "I ______ (enjoy) {thing}, but last {when} it became my favourite hobby.", { thing: ["cooking", "reading", "running", "drawing"], when: WHEN }],
  ["visit", "We ______ (visit) our relatives in {city} often. Now we go there every {season}.", { city: ["Khiva", "Nukus", "Termez", "Andijan"], season: ["summer", "spring", "autumn", "holiday"] }],
].map(([v, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `didn't use to ${v}`, why: why(`didn't use to ${v}`), slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NEG = "Make the sentence negative with didn't use to.";
const FIX = "This sentence has a mistake. Rewrite it correctly with didn't use to.";
const PAST = "Rewrite the first sentence with didn't use to.";
const whyN = (v) => `Negative of used to: didn't + use to + the base form, ${v}. The -d goes away after did.`;
const whyP = (v) => `It wasn't true then, but it is now, so ${v} fits better than the past simple.`;
// [instr, source, hint, verb, why, slots]
const TRANSFORM = [
  [NEG, "When I was {age}, I used to like {food}.", "When I was {age}, I ______ {food}.", "like", whyN("didn't use to like"), { age: ["six", "seven", "eight", "little"], food: ["onions", "fish", "cheese", "spinach"] }],
  [NEG, "My parents used to go out on {day}.", "My parents ______ out on {day}.", "go", whyN("didn't use to go"), { day: ["Fridays", "Saturdays", "weekdays", "Sunday evenings"], x: [] }],
  [NEG, "We used to have a {thing} in our {room}.", "We ______ a {thing} in our {room}.", "have", whyN("didn't use to have"), { thing: ["dishwasher", "washing machine", "microwave", "big fridge"], room: ["kitchen", "old kitchen", "first flat", "old flat"] }],
  [NEG, "{name} used to eat {food}.", "{name} ______ {food}.", "eat", whyN("didn't use to eat"), { name: NAME_F, food: ["meat", "sugar", "fast food", "sweets"] }],
  [NEG, "My {who} used to work on {day}.", "My {who} ______ on {day}.", "work", whyN("didn't use to work"), { who: ["brother", "father", "uncle", "cousin"], day: ["Saturdays", "Sundays", "Fridays", "holidays"] }],
  [FIX, "I didn't used to like {thing}, but now I do.", "I ______ {thing}, but now I do.", "like", "After did, write use with no -d: didn't use to like.", { thing: ["sport", "maths", "winter", "tea"], x: [] }],
  [FIX, "{name} wasn't used to drink {drink}, but now she has it every {day}.", "{name} ______ {drink}, but now she has it every {day}.", "drink", "Wasn't used to is a different meaning. For a past fact that changed: didn't use to drink.", { name: NAME_F, drink: ["coffee", "milk", "green tea", "juice"], day: ["day", "morning", "evening"] }],
  [FIX, "We don't use to visit the {place} as children, but now we go every {day}.", "We ______ the {place} as children, but now we go every {day}.", "visit", "As children is the past, so did, not do: didn't use to visit.", { place: ["museum", "library", "zoo", "theatre"], day: ["week", "month", "Sunday", "summer"] }],
  [FIX, "My {who} didn't use cook at home, but now he cooks every {day}.", "My {who} ______ at home, but now he cooks every {day}.", "cook", "Use needs to after it: didn't use to cook.", { who: ["father", "uncle", "grandfather", "brother"], day: ["day", "weekend", "Friday", "evening"] }],
  [FIX, "They didn't use to living in {city}, but they moved there last {when}.", "They ______ in {city}, but they moved there last {when}.", "live", "After use to, write the base form, not -ing: didn't use to live.", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], when: WHEN }],
  [PAST, "At {school}, we didn't have a {room} then. We have one now.", "At {school}, we ______ a {room}.", "have", whyP("didn't use to have"), { school: ["our school", "my school", "our lyceum", "our college"], room: ["gym", "library", "computer room", "canteen"] }],
  [PAST, "My {who} didn't drive a {car} then. He drives one now.", "My {who} ______ a {car}.", "drive", whyP("didn't use to drive"), { who: ["father", "uncle", "grandfather", "neighbour"], car: ["car", "truck", "bus", "taxi"] }],
  [PAST, "{name} didn't speak much in {class} then. She talks a lot now.", "{name} ______ much in {class}.", "speak", whyP("didn't use to speak"), { name: NAME_F, class: ["class", "lessons", "English lessons", "meetings"] }],
  [PAST, "We didn't eat out on {day} then. Now we often go to a {place}.", "We ______ out on {day}.", "eat", whyP("didn't use to eat"), { day: ["Fridays", "Sundays", "weekdays", "holidays"], place: ["café", "restaurant", "kebab house", "pizza place"] }],
  [PAST, "I didn't get up early in the {season} then. I get up at {time} now.", "I ______ up early in the {season}.", "get", whyP("didn't use to get"), { season: ["summer", "winter", "holidays", "autumn"], time: ["six", "five", "half past six", "seven"] }],
].map(([instr, source, hint, v, w, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `didn't use to ${v}`, why: w, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a food you didn't use to like but like now.", "didn't use to like", ["exactly one sentence", "didn't use to + base form", "show it is different now"]],
  ["Write one sentence about something your family didn't use to have at home.", "didn't use to have", ["exactly one sentence", "didn't use to", "name the thing"]],
  ["Write one sentence about a hobby you didn't use to enjoy.", "didn't use to enjoy", ["exactly one sentence", "no -d after did", "name the hobby"]],
  ["Write one sentence about something you didn't use to do at school but do now.", "didn't use to + verb", ["exactly one sentence", "didn't use to", "a school word"]],
  ["Write one sentence about a family member who didn't use to do something.", "he / she didn't use to", ["exactly one sentence", "name the family member", "didn't use to + base form"]],
  ["Write one sentence about your town: something it didn't use to be like.", "didn't use to be", ["exactly one sentence", "didn't use to be", "name the place"]],
  ["Write two sentences: one with used to and one with didn't use to.", "used to vs didn't use to", ["exactly two sentences", "used to once", "didn't use to once"]],
  ["Write one sentence about a language or skill you didn't use to know.", "didn't use to know", ["exactly one sentence", "didn't use to know", "how you learned it or when"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["How are you different from five years ago? Write three or four sentences with things you didn't use to do.", "didn't use to for changes", ["didn't use to + base form", "at least two verbs", "now for the present"]],
  ["Describe how your street or town has changed. What didn't there use to be? Write three or four sentences.", "didn't use to / there didn't use to be", ["didn't use to", "a place named", "now for the present"]],
  ["Describe a family member who has changed a lot. Write three or four sentences.", "he / she didn't use to", ["didn't use to", "used to or now", "no -d after did"]],
  ["Write about a food, sport or hobby you didn't use to like. Why do you like it now? Write three or four sentences.", "didn't use to like", ["didn't use to like or enjoy", "a reason", "present simple for now"]],
  ["Describe your first year at school or college compared with now. Write three or four sentences.", "used to and didn't use to", ["didn't use to", "used to", "school words"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.used-to.didnt-use-to.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "\"but now I eat it\" means the old dislike is over: didn't use to like.",
   "\"now she has a cup\" means … is new for her: didn't use to drink.",
   "\"We bought one last …\": before that, no: didn't use to have.",
   "\"now he speaks it at work\" is new: didn't use to speak.",
   "\"Now it's my favourite\" was not true before: didn't use to enjoy.",
   "\"They moved here … last\": before, they lived far: didn't use to live.",
   "\"now he needs them\" is new: didn't use to wear.",
   "\"now I have … every\" is a new habit: didn't use to eat.",
   "\"now she gets up at …\" is a new habit: didn't use to get up.",
   "\"now we go there every …\" is new: didn't use to go.",
   "\"He started last …\": before that, no: didn't use to play.",
   "\"my … taught me\": before, I couldn't: didn't use to know.",
   "\"now they watch it every …\" is new: didn't use to watch.",
   "\"now she walks there every …\" is a new habit: didn't use to walk.",
   "\"our new home has two\": the old one had none: didn't use to have.",
   "\"now he plays with them\" is new: didn't use to like.",
   "\"I practised a lot\" changed it: didn't use to be good.",
   "\"now she makes it every …\" is new: didn't use to cook.",
   "\"now they talk on the phone\" is new: didn't use to talk.",
   "\"now I read one every …\" is a new habit: didn't use to read."
  ],
  "build": [
   "\"As a child\" against \"Now I love it\": didn't use to like.",
   "\"They got one last …\": before that, no phone: didn't use to have.",
   "\"He learned last …\": before that, no driving: didn't use to drive.",
   "\"now she eats … every week\" is new: didn't use to eat.",
   "\"Now we visit … every week\" is new: didn't use to go out.",
   "\"now he speaks it\" is new: didn't use to speak.",
   "\"now I work hard\" is new: didn't use to study hard.",
   "\"Now there are … everywhere\": it was quiet before: didn't use to be.",
   "\"Now he wears one every …\" is new: didn't use to wear.",
   "\"Now they never miss it\" is new: didn't use to watch.",
   "\"Her … taught her last …\": before that, no chess: didn't use to play.",
   "\"now we visit them\" is new: didn't use to know.",
   "\"now … works on Saturdays\" is new: didn't use to work.",
   "\"now I'm on it every …\" is new: didn't use to take.",
   "\"now he makes …\" is new: didn't use to cook.",
   "\"now she sleeps all night\" is new: didn't use to sleep.",
   "\"now we talk every …\" is new: didn't use to call.",
   "\"now he rides one every …\" is new: didn't use to ride.",
   "\"last … it became my favourite\": not before: didn't use to enjoy.",
   "\"Now we go there every …\" is new: didn't use to visit."
  ],
  "transform": [
   "Make the old habit negative: used to like → didn't use to like.",
   "Negative of used to go: didn't use to go (no -d after did).",
   "Negative of used to have: didn't use to have.",
   "Negative of used to eat: didn't use to eat.",
   "Negative of used to work: didn't use to work.",
   "After did, write use with no -d: didn't use to like.",
   "Not \"wasn't used to drink\": a past habit is didn't use to drink.",
   "\"as children\" is the past, so did, not do: didn't use to visit.",
   "to is missing: didn't use to cook.",
   "After use to comes the base verb, not -ing: didn't use to live.",
   "\"We have one now\", not then: didn't use to have.",
   "\"He drives one now\", not then: didn't use to drive.",
   "\"She talks a lot now\", not then: didn't use to speak.",
   "\"Now we often go\", not then: didn't use to eat out.",
   "\"I get up at … now\", not then: didn't use to get up."
  ]
 },
 "slot": [
  [
   "choose",
   2,
   "coffee",
   "drink",
   [
    "coffee",
    "green tea",
    "black tea",
    "hot chocolate"
   ]
  ],
  [
   "transform",
   2,
   "parents",
   "who",
   [
    "parents",
    "grandparents",
    "neighbours",
    "cousins"
   ]
  ],
  [
   "transform",
   6,
   "do",
   "doit",
   [
    "do",
    "do a lot",
    "really do",
    "do every day"
   ]
  ],
  [
   "choose",
   14,
   "",
   "day",
   [
    "afternoon",
    "evening"
   ]
  ],
  [
   "choose",
   15,
   "",
   "home",
   [
    "building"
   ]
  ],
  [
   "choose",
   20,
   "",
   "time",
   [
    "weekend",
    "holiday"
   ]
  ],
  [
   "build",
   16,
   "",
   "who",
   [
    "daughter"
   ]
  ],
  [
   "build",
   16,
   "",
   "room",
   [
    "cot"
   ]
  ],
  [
   "transform",
   7,
   "",
   "day",
   [
    "afternoon"
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
