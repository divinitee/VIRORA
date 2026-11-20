// Hand-authored: verb-patterns / gerund-infinitive / decide-infinitive (A2).
// Path fill P43 (Claude lane, branch grammar-path-fill-claude, 17 Nov 2026).
//
// Tests ONE point: decide + to-infinitive ("They decided to go home early").
// The placement item's distractors are the bare verb, -ing and the past form.
//
// Shapes: decided / has decided / will decide + to + verb, and the negative
// decided not to + verb. "decided to not go" is never a wrong answer (natives
// say it). Kept apart from want-infinitive and would-like-infinitive: decide
// is the only governing verb here, and it is never slotted.
// Typed stages use one blank per word (to + verb), because a one-string key
// may not repeat the verb printed in brackets.
//
// Run: node tools/grammar-practice/authored/verb-patterns.gerund-infinitive.decide-infinitive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "gerund-infinitive", topic: "decide-infinitive", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const ANY = ["Aziz", "Lola", "Madina", "Timur"];
const F4 = ["Lola", "Madina", "Kamila", "Nodira"];
const CITY = ["Tashkent", "Samarkand", "Bukhara", "Fergana"];
const DAY = ["Friday", "Saturday", "Sunday", "Monday"];
const W = (v) => `After decide, the next verb is to + the base form: decided to ${v}. Not the -ing form and not the bare verb.`;
const WN = (v) => `To decide against something, put not before to: decided not to ${v}.`;

/* ---------------- choose: 20 mcq ---------------- */
const C = (v, ing, prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: [`to ${v}`, v, ing, `to ${ing}`], key: 0, why: W(v), slots });
const CN = (v, prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: [`not to ${v}`, `no to ${v}`, `not ${v}`, `don't ${v}`], key: 0, why: WN(v), slots });
const CHOOSE = [
  C("take", "taking", "We decided ______ a taxi to the {place} because of the {reason}.",
    { place: ["airport", "station", "hotel", "stadium"], reason: ["rain", "heavy bags", "time", "snow"] }),
  C("study", "studying", "{name} decided ______ {subj} at university.",
    { name: ANY, subj: ["medicine", "law", "history", "English"] }),
  C("buy", "buying", "My parents decided ______ a new {thing} this {time}.",
    { thing: ["car", "fridge", "sofa", "TV"], time: ["year", "month", "spring", "summer"] }),
  C("go", "going", "After the {event}, we decided ______ home on foot, {name}.",
    { event: ["film", "concert", "match", "party"], name: N4 }),
  C("learn", "learning", "{name} has decided ______ {lang} this year.",
    { name: ANY, lang: ["Korean", "German", "Arabic", "Turkish"] }),
  C("get", "getting", "I have decided ______ up earlier, {name}. I am always {adj}.",
    { name: P4, adj: ["late", "tired", "sleepy", "in a hurry"] }),
  C("visit", "visiting", "Our class decided ______ the {place} on {day}.",
    { place: ["museum", "zoo", "old city", "theatre"], day: DAY }),
  C("sell", "selling", "My {relative} decided ______ his old {thing}.",
    { relative: ["father", "uncle", "brother", "grandfather"], thing: ["car", "bike", "phone", "computer"] }),
  C("call", "calling", "{name} decided ______ her {relative} every week.",
    { name: F4, relative: ["grandmother", "aunt", "parents", "sister"] }),
  C("stop", "stopping", "The {who} decided ______ the {event} because of the weather.",
    { who: ["teachers", "coaches", "parents", "directors"], event: ["match", "trip", "picnic", "race"] }),
  C("stay", "staying", "We have decided ______ in {city} for the holidays, {name}.",
    { city: CITY, name: N4 }),
  C("make", "making", "{name} and I decided ______ a {thing} for Mum's birthday.",
    { name: ANY, thing: ["cake", "card", "video", "photo book"] }),
  C("become", "becoming", "Why did you decide ______ a {job}, {name}?",
    { job: ["doctor", "teacher", "driver", "cook"], name: N4 }),
  C("cut", "cutting", "My sister decided ______ her hair {style}.",
    { style: ["short", "very short", "herself", "before the wedding"] }),
  C("come", "coming", "I think {name} will decide ______ with us to the {place}.",
    { name: ANY, place: ["cinema", "lake", "match", "party"] }),
  C("give", "giving", "The {person} has decided ______ us a test on {day}.",
    { person: ["teacher", "coach", "tutor", "director"], day: DAY }),
  CN("go", "It was {weather}, so we decided ______ out, {name}.",
    { weather: ["raining", "very cold", "too hot", "snowing"], name: N4 }),
  CN("buy", "{name} decided ______ the {thing}. It was too expensive.",
    { name: ANY, thing: ["jacket", "phone", "bike", "watch"] }),
  CN("watch", "I was tired, so I decided ______ {show} last night, {name}.",
    { show: ["the film", "TV", "the match", "the concert"], name: P4 }),
  CN("take", "My {relative} decided ______ the job in {city}.",
    { relative: ["brother", "sister", "uncle", "cousin"], city: ["Moscow", "Seoul", "Istanbul", "Dubai"] }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const I_TO = "Complete the sentence with to + the verb in brackets.";
const I_NOT = "Complete the sentence with not to + the verb in brackets.";
const B = (v, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I_TO, source, key: ["to", v], why: W(v), slots });
const BN = (v, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I_NOT, source, key: ["not", "to", v], why: WN(v), slots });
const BUILD = [
  B("walk", "{name} decided ______ ______ (walk) to {place} today.",
    { name: ANY, place: ["school", "work", "the market", "the park"] }),
  B("have", "We decided ______ ______ (have) a picnic by the {place} on {day}.",
    { place: ["river", "lake", "canal", "pond"], day: DAY }),
  B("open", "My {relative} decided ______ ______ (open) a small {shop}.",
    { relative: ["father", "uncle", "aunt", "cousin"], shop: ["shop", "cafe", "bakery", "garage"] }),
  B("read", "I have decided ______ ______ (read) one {thing} every {time}.",
    { thing: ["book", "story", "chapter", "article"], time: ["week", "month", "day", "weekend"] }),
  B("join", "{name} decided ______ ______ (join) the {club} club.",
    { name: ANY, club: ["chess", "football", "drama", "English"] }),
  B("play", "After lunch, the {who} decided ______ ______ (play) {game}.",
    { who: ["boys", "girls", "children", "students"], game: ["football", "chess", "volleyball", "cards"] }),
  B("move", "{name}, my parents have decided ______ ______ (move) to {city}.",
    { name: N4, city: CITY }),
  B("tell", "{name}, I decided ______ ______ (tell) the {person} the truth.",
    { name: P4, person: ["teacher", "coach", "doctor", "director"] }),
  B("spend", "Our family decided ______ ______ (spend) the {holiday} in the {place}.",
    { holiday: ["summer", "weekend", "holidays", "New Year"], place: ["mountains", "village", "countryside", "city"] }),
  B("save", "{name} has decided ______ ______ (save) money for a new {thing}.",
    { name: ANY, thing: ["bike", "phone", "laptop", "guitar"] }),
  B("wear", "Did you decide ______ ______ (wear) the {colour} {item}, {name}?",
    { colour: ["blue", "black", "white", "red"], item: ["dress", "shirt", "jacket", "shoes"], name: N4 }),
  B("train", "The {team} decided ______ ______ (train) {n} times a week.",
    { team: ["team", "club", "boys", "girls"], n: ["three", "four", "five", "six"] }),
  B("ask", "I decided ______ ______ (ask) my {relative} for {thing}.",
    { relative: ["father", "mother", "aunt", "brother"], thing: ["help", "advice", "money", "a lift"] }),
  B("meet", "We decided ______ ______ (meet) at the {place} at {time}.",
    { place: ["station", "park", "cafe", "school gate"], time: ["six", "seven", "half past five", "noon"] }),
  B("cook", "For the guests, {name} decided ______ ______ (cook) {food}.",
    { name: ANY, food: ["plov", "soup", "manti", "fish"] }),
  B("start", "My {relative} has decided ______ ______ (start) a new {thing}.",
    { relative: ["sister", "brother", "cousin", "friend"], thing: ["job", "course", "hobby", "business"] }),
  BN("call", "It was late, so {name} decided ______ ______ ______ (call) her {who}.",
    { name: F4, who: ["friend", "teacher", "aunt", "grandmother"] }),
  BN("eat", "We decided ______ ______ ______ (eat) at the {place}. It was too {adj}.",
    { place: ["cafe", "restaurant", "hotel", "station"], adj: ["expensive", "crowded", "noisy", "dirty"] }),
  BN("drive", "{name} decided ______ ______ ______ (drive) in the {weather}.",
    { name: ["Dad", "My uncle", "Aziz", "Grandpa"], weather: ["snow", "fog", "storm", "dark"] }),
  BN("tell", "I decided ______ ______ ______ (tell) {who} about the {thing}.",
    { who: ["Mum", "Dad", "my brother", "the teacher"], thing: ["surprise", "present", "party", "plan"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PLAN = "Say it with decide + to + verb.";
const FIX = "Correct the mistake after decided.";
const OPP = "Write the opposite decision.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // a plan or choice -> decided to (5)
  T(PLAN, "{name}'s plan is clear now: she will study {subj}.", "{name} has decided ______ ______ {subj}.", ["to", "study"], W("study"),
    { name: F4, subj: ["medicine", "law", "history", "English"] }),
  T(PLAN, "{name}, we talked about it. In the end we took the {bus}.", "{name}, in the end we decided ______ ______ the {bus}.", ["to", "take"], W("take"),
    { name: N4, bus: ["bus", "train", "metro", "tram"] }),
  T(PLAN, "My {relative} thought about the {thing}. He bought it.", "My {relative} decided ______ ______ the {thing}.", ["to", "buy"], W("buy"),
    { relative: ["father", "uncle", "brother", "grandfather"], thing: ["car", "house", "phone", "bike"] }),
  T(PLAN, "{name}, I made a decision: I will get up at {time} every day.", "{name}, I have decided ______ ______ up at {time} every day.", ["to", "get"], W("get"),
    { name: P4, time: ["six", "five", "half past six", "seven"] }),
  T(PLAN, "The {who} talked about the trip. Their choice: the {place}.", "The {who} decided ______ ______ to the {place}.", ["to", "go"], W("go"),
    { who: ["class", "students", "teachers", "family"], place: ["mountains", "lake", "museum", "zoo"] }),
  // correct a mistake (5)
  T(FIX, "{name} decided going to {city}.", "{name} decided ______ ______ to {city}.", ["to", "go"], W("go"),
    { name: ANY, city: CITY }),
  T(FIX, "We decided buy a {thing}, {name}.", "We decided ______ ______ a {thing}, {name}.", ["to", "buy"], W("buy"),
    { thing: ["cake", "present", "ticket", "map"], name: N4 }),
  T(FIX, "My {relative} decided to selling the {thing}.", "My {relative} decided ______ ______ the {thing}.", ["to", "sell"], W("sell"),
    { relative: ["father", "uncle", "aunt", "grandfather"], thing: ["car", "house", "shop", "land"] }),
  T(FIX, "She decided for learn {lang}, {name}.", "She decided ______ ______ {lang}, {name}.", ["to", "learn"], W("learn"),
    { lang: ["Korean", "German", "Arabic", "Turkish"], name: N4 }),
  T(FIX, "{name}, he decided don't play in the {match}.", "{name}, he decided ______ ______ ______ in the {match}.", ["not", "to", "play"], WN("play"),
    { name: N4, match: ["match", "final", "game", "tournament"] }),
  // opposite decision (5)
  T(OPP, "{name} decided to go to the {event}.", "{name} decided ______ ______ ______ to the {event}.", ["not", "to", "go"], WN("go"),
    { name: ANY, event: ["party", "concert", "wedding", "meeting"] }),
  T(OPP, "We decided to buy the {thing}, {name}.", "We decided ______ ______ ______ the {thing}, {name}.", ["not", "to", "buy"], WN("buy"),
    { thing: ["sofa", "car", "tickets", "tent"], name: P4 }),
  T(OPP, "{name}, I decided not to wait for the {bus}.", "{name}, I decided ______ ______ for the {bus}.", ["to", "wait"], W("wait"),
    { name: N4, bus: ["bus", "train", "taxi", "others"] }),
  T(OPP, "My {relative} decided not to sell the {thing}.", "My {relative} decided ______ ______ the {thing}.", ["to", "sell"], W("sell"),
    { relative: ["father", "uncle", "aunt", "grandmother"], thing: ["house", "car", "garden", "shop"] }),
  T(OPP, "The {who} decided to play in the {weather}.", "The {who} decided ______ ______ ______ in the {weather}.", ["not", "to", "play"], WN("play"),
    { who: ["boys", "children", "team", "girls"], weather: ["rain", "snow", "heat", "wind"] }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you decided to do this week.", "decided to + verb", ["exactly one sentence", "must be about you", "must use decided to"]],
  ["Write one sentence about something you decided not to do.", "decided not to + verb", ["exactly one sentence", "must use decided not to", "must be about you"]],
  ["Write one sentence about what someone in your family decided to buy, sell or change.", "decided to + verb", ["exactly one sentence", "must name a family member", "must use decided to"]],
  ["Write one sentence about what you have decided to study or become.", "have decided to + verb", ["exactly one sentence", "must use have decided to", "must be about your future"]],
  ["Write a question to a friend: why did he or she decide to do something?", "Why did you decide to + verb", ["exactly one question", "must use decide to", "must end with a question mark"]],
  ["Write one sentence about what your class or your friends decided to do at the weekend.", "decided to + verb", ["exactly one sentence", "must use decided to", "must be about a group"]],
  ["Write two sentences: one thing you decided to do and one thing you decided not to do.", "decided to and decided not to", ["exactly two sentences", "must use decided to", "must use decided not to"]],
  ["A friend wrote: \"We decided going by bus and not take a taxi.\" Write the sentence correctly.", "decided to go ... and not to take", ["exactly one sentence", "must use decided to go", "must use not to take"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell me about a big decision you made this year. What did you decide to do, and why? Write three or four sentences.",
    "decided to + verb", ["decided to + base verb", "no -ing after decided", "a reason"]],
  ["What have you decided to do after school or university? Write three or four sentences.",
    "have decided to + verb", ["have decided to", "to + base verb", "a plan for the future"]],
  ["Describe a day when the weather changed your plans. What did you decide to do, and what did you decide not to do? Write three or four sentences.",
    "decided to / decided not to", ["decided to", "decided not to", "past tense for the story"]],
  ["Your family is planning a holiday. What did everyone decide? Write three or four sentences.",
    "decided to + verb", ["decided to go, stay or visit", "to + base verb", "at least two decisions"]],
  ["Why did you decide to learn English? What did you decide to do to learn it faster? Write three or four sentences.",
    "decided to + verb", ["decided to learn", "another decided to", "a reason"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.gerund-infinitive.decide-infinitive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
