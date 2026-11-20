// Hand-authored: modals / semi-modals / be-able-to (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): be able to where CAN has no form: the future
// (will / won't be able to), the present perfect (have / haven't been able to),
// after another word that needs an infinitive (want to be able to, might be able to).
// Triage: kept. can / could for ability are A2 (can-ability, could-past-ability);
// "was able to" for one past success is left out (it needs the could / was able to
// contrast, a separate B1+ point).
// Choose: 10 future (will be able to / will can / can be able to / will able to,
// and won't …), 5 present perfect, 5 infinitive (to be able to / to can / can / be able).
// Build: a form of be able to + the verb in brackets. No source prints be, able,
// to, will or have (the key would repeat them).
// Transform: 5 correct the mistake / 5 it will (won't) be possible → will (won't)
// be able to / 5 it has (hasn't) been possible → have (haven't) been able to.
//
// Run: node tools/grammar-practice/authored/modals.semi-modals.be-able-to.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "semi-modals", topic: "be-able-to", level: "B1", pv: "2.5" };
const NAME = ["Feruza", "Otabek", "Dilnoza", "Sardor"]; // listener names: never printed in a sentence (audit 20 Nov)
const WHY_F = "can has no future form: will (won't) be able to + base verb.";
const WHY_P = "can has no present perfect form: have (haven't) been able to + base verb.";
const WHY_I = "can has no infinitive: (to) be able to + base verb after want, like, hope, need, might.";
const F = ["will be able to", "will can", "can be able to", "will able to"];
const FN = ["won't be able to", "won't can", "can't be able to", "won't able to"];
const P = ["have been able to", "have could", "can have", "have able to"];
const PN = ["haven't been able to", "haven't could", "can't have", "haven't able to"];
const HN = ["hasn't been able to", "hasn't could", "can't have", "hasn't able to"];
const I = ["to be able to", "to can", "can", "be able"];
const WHY = (o) => ([F, FN].includes(o) ? WHY_F : [P, PN, HN].includes(o) ? WHY_P : WHY_I);

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [F, "I hope I ______ come to your wedding next {time}, {name}.", { time: ["year", "month", "summer", "spring"], name: NAME }],
  [F, "After this course, you ______ speak English with {who}, {name}.", { who: ["tourists", "your boss", "your teacher", "foreigners"], name: NAME }],
  [F, "When the new bridge opens, we ______ drive to {city} in an hour, {name}.", { city: ["Samarkand", "Jizzakh", "Gulistan", "Chirchiq"], name: NAME }],
  [F, "Don't worry. The doctor says you ______ walk again in {when}, {name}.", { when: ["a month", "two weeks", "a few days", "May"], name: NAME }],
  [F, "If you save money now, you ______ buy a {thing} next year, {name}.", { thing: ["car", "laptop", "bike", "camera"], name: NAME }],
  [FN, "I'm busy {when}, so I ______ help you with the {work}.", { when: ["tomorrow", "on Friday", "all weekend", "next week"], work: ["move", "homework", "party", "project"] }],
  [FN, "Sorry, I ______ come to the {event} on Saturday, {name}. I'm working.", { event: ["party", "wedding", "match", "concert"], name: NAME }],
  [FN, "The {shop} is closed tomorrow, so we ______ buy bread there, {name}.", { shop: ["bakery", "bazaar", "supermarket", "shop"], name: NAME }],
  [F, "In ten years, robots ______ cook {food} for us, {name}.", { food: ["plov", "dinner", "breakfast", "soup"], name: NAME }],
  [F, "When you're eighteen, you ______ drive a {car}, {name}.", { car: ["car", "scooter", "van", "motorbike"], name: NAME }],
  [P, "I ______ sleep well since we moved to the new {home}, {name}.", { home: ["flat", "house", "village", "city"], name: NAME }],
  [HN, "She ______ find a job since she came to {city}, {name}.", { city: ["Tashkent", "Moscow", "Seoul", "Istanbul"], name: NAME }],
  [PN, "We ______ visit Grandma this {time} because of the snow, {name}.", { time: ["month", "week", "winter", "year"], name: NAME }],
  [PN, "I ______ call you all {time}. My phone is broken, {name}.", { time: ["day", "week", "morning", "evening"], name: NAME }],
  [P, "Since I started the course, I ______ understand {thing} in English, {name}.", { thing: ["films", "songs", "the news", "my teacher"], name: NAME }],
  [I, "I want ______ speak {lang} with my grandparents, {name}.", { lang: ["Uzbek", "Russian", "Tajik", "Kazakh"], name: NAME }],
  [I, "She'd like ______ play the {instr} one day, {name}.", { instr: ["piano", "guitar", "violin", "dutar"], name: NAME }],
  [I, "It's nice ______ walk to work in {month}, {name}.", { month: ["spring", "May", "summer", "June"], name: NAME }],
  [I, "We hope ______ travel to {country} next year, {name}.", { country: ["Japan", "Turkey", "Italy", "Korea"], name: NAME }],
  [I, "You need ______ swim before you go on the {trip}, {name}.", { trip: ["boat trip", "sea trip", "river trip", "kayak trip"], name: NAME }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY(o), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "can has no future, perfect or infinitive form. Complete with a form of be able to and the verb in brackets.";
// [key, why, source, slots]  — no source prints be / able / to / will / have
const BUILD = [
  ["will be able to come", WHY_F, "I hope I ______ (come) next {time}, {name}.", { time: ["year", "month", "summer", "Friday"], name: NAME }],
  ["will be able to speak", WHY_F, "After this {course}, you ______ (speak) English well, {name}.", { course: ["course", "year", "summer", "class"], name: NAME }],
  ["will be able to drive", WHY_F, "When the new {road} opens, we ______ (drive) there in an hour, {name}.", { road: ["road", "bridge", "tunnel", "motorway"], name: NAME }],
  ["will be able to walk", WHY_F, "The doctor says you ______ (walk) again in {when}, {name}.", { when: ["a month", "two weeks", "a few days", "May"], name: NAME }],
  ["will be able to buy", WHY_F, "If you save now, you ______ (buy) a {thing} next year, {name}.", { thing: ["car", "laptop", "bike", "camera"], name: NAME }],
  ["won't be able to help", WHY_F, "I'm busy {when}, so I ______ (not / help) you, {name}.", { when: ["tomorrow", "on Friday", "all weekend", "next week"], name: NAME }],
  ["won't be able to come", WHY_F, "Sorry, I ______ (not / come) on Saturday, {name}. I'm at the {place}.", { place: ["hospital", "office", "wedding", "airport"], name: NAME }],
  ["won't be able to buy", WHY_F, "The {shop} is closed tomorrow, so we ______ (not / buy) bread, {name}.", { shop: ["bakery", "bazaar", "supermarket", "shop"], name: NAME }],
  ["have been able to sleep", WHY_P, "I ______ (sleep) well since we moved into the new {home}, {name}.", { home: ["flat", "house", "village", "city"], name: NAME }],
  ["hasn't been able to find", WHY_P, "She ______ (not / find) a job since she came {where}, {name}.", { where: ["here", "back", "home", "over"], name: NAME }],
  ["haven't been able to visit", WHY_P, "We ______ (not / visit) Grandma this {time} because of the snow, {name}.", { time: ["month", "week", "winter", "year"], name: NAME }],
  ["haven't been able to call", WHY_P, "I ______ (not / call) you all {time}. My phone is broken, {name}.", { time: ["day", "week", "morning", "evening"], name: NAME }],
  ["have been able to finish", WHY_P, "Since we got the new {tool}, we ______ (finish) work early every day, {name}.", { tool: ["computer", "printer", "car", "machine"], name: NAME }],
  ["to be able to speak", WHY_I, "I want ______ (speak) {lang} with my grandparents, {name}.", { lang: ["Uzbek", "Russian", "Tajik", "Kazakh"], name: NAME }],
  ["to be able to play", WHY_I, "She'd like ______ (play) the {instr} one day, {name}.", { instr: ["piano", "guitar", "violin", "dutar"], name: NAME }],
  ["to be able to travel", WHY_I, "We hope ______ (travel) round {place} next year, {name}.", { place: ["Europe", "Asia", "Turkey", "Korea"], name: NAME }],
  ["to be able to swim", WHY_I, "You need ______ (swim) before the {trip}, {name}.", { trip: ["boat trip", "sea trip", "river trip", "kayak trip"], name: NAME }],
  ["be able to help", WHY_I, "I might ______ (help) you {when}, {name}.", { when: ["tomorrow", "later", "on Sunday", "after lunch"], name: NAME }],
  ["be able to meet", WHY_I, "We might ______ (meet) at the {place} later, {name}.", { place: ["café", "park", "station", "bazaar"], name: NAME }],
  ["will be able to read", WHY_F, "Next year, Timur ______ (read) English {thing}, {name}.", { thing: ["books", "newspapers", "novels", "comics"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const FUT = "Rewrite with will (or won't) be able to.";
const PER = "Rewrite with have / has (or haven't / hasn't) been able to.";
// [instr, source, hint, key, why, slots] — no hint prints be / able / to / will / have
const TRANSFORM = [
  [FIX, "I will can come next {time}, {name}.", "I ______ come next {time}, {name}.", "will be able to", WHY_F, { time: ["year", "month", "summer", "Friday"], name: NAME }],
  [FIX, "She will can drive next {time}, {name}.", "She ______ drive next {time}, {name}.", "will be able to", WHY_F, { time: ["year", "month", "summer", "spring"], name: NAME }],
  [FIX, "I haven't could sleep since {when}, {name}.", "I ______ sleep since {when}, {name}.", "haven't been able to", WHY_P, { when: ["Monday", "the party", "last week", "Sunday"], name: NAME }],
  [FIX, "I want can speak {lang} well, {name}.", "I want ______ speak {lang} well, {name}.", "to be able to", WHY_I, { lang: ["English", "Korean", "Turkish", "German"], name: NAME }],
  [FIX, "We might can help you {when}, {name}.", "We might ______ help you {when}, {name}.", "be able to", WHY_I, { when: ["tomorrow", "later", "on Sunday", "after lunch"], name: NAME }],
  [FUT, "It will be possible for us to see the {view} from the new flat, {name}.", "We ______ see the {view} from the new flat, {name}.", "will be able to", WHY_F, { view: ["mountains", "river", "old town", "park"], name: NAME }],
  [FUT, "I'm sorry, but coming on {day} won't be possible for me, {name}.", "I'm sorry, but I ______ come on {day}, {name}.", "won't be able to", WHY_F, { day: ["Friday", "Saturday", "Sunday", "Monday"], name: NAME }],
  [FUT, "In a year, you can read English {thing}. That's the plan, {name}.", "In a year, you ______ read English {thing}, {name}.", "will be able to", WHY_F, { thing: ["books", "newspapers", "novels", "comics"], name: NAME }],
  [FUT, "After the operation, walking in the {place} will be possible for {who}.", "After the operation, {who} ______ walk in the {place}.", "will be able to", WHY_F, { place: ["park", "garden", "yard", "street"], who: ["Grandma", "Grandpa", "my uncle", "my aunt"] }],
  [FUT, "They can't finish the {work} today. Maybe next week, {name}.", "They ______ finish the {work} today, {name}.", "won't be able to", WHY_F, { work: ["project", "report", "house", "garden"], name: NAME }],
  [PER, "Since {when}, sleeping well hasn't been possible for me, {name}.", "I ______ sleep well since {when}, {name}.", "haven't been able to", WHY_P, { when: ["Monday", "the party", "last week", "Sunday"], name: NAME }],
  [PER, "She came to {city} in May. She still has no {thing}.", "She ______ find a {thing} in {city}.", "hasn't been able to", WHY_P, { city: ["Tashkent", "Moscow", "Seoul", "Istanbul"], thing: ["job", "flat", "room", "school"] }],
  [PER, "This {time}, saving some money has been possible for us, {name}.", "This {time}, we ______ save some money, {name}.", "have been able to", WHY_P, { time: ["year", "month", "summer", "winter"], name: NAME }],
  [PER, "They wanted to visit us this {time}, but they never had a free day, {name}.", "They ______ visit us this {time}, {name}.", "haven't been able to", WHY_P, { time: ["month", "week", "winter", "year"], name: NAME }],
  [PER, "Since the {course}, films in English are easy for him, {name}.", "Since the {course}, he ______ understand films in English, {name}.", "has been able to", WHY_P, { course: ["course", "summer school", "trip", "camp"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you will be able to do after this English course.", "will be able to", ["exactly one sentence", "will be able to + base verb", "future"]],
  ["Write one sentence about a plan you can't do next week. Use won't be able to.", "won't be able to", ["exactly one sentence", "won't be able to + base verb", "a reason"]],
  ["Write one sentence about something you haven't been able to do this week.", "haven't been able to", ["exactly one sentence", "haven't been able to", "this week / since"]],
  ["Write one sentence about a skill you want to be able to do one day.", "want to be able to", ["exactly one sentence", "to be able to", "one day / in the future"]],
  ["Write one sentence with might be able to.", "might be able to", ["exactly one sentence", "might be able to + base verb", "not sure"]],
  ["Write one sentence with can (now) and one with will be able to (the future).", "can vs will be able to", ["exactly two sentences", "can + base verb", "will be able to"]],
  ["Write one sentence about something you have been able to do since you started learning English.", "have been able to", ["exactly one sentence", "have been able to", "since"]],
  ["Write one sentence about a new road, bridge or metro line and what people will be able to do.", "will be able to", ["exactly one sentence", "will be able to", "when … opens"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Imagine your life in five years. Write three or four sentences about what you will be able to do.", "will be able to", ["will be able to", "won't be able to", "three or four sentences"]],
  ["You hurt your leg last month. Write three or four sentences about what you haven't been able to do since then.", "haven't been able to", ["haven't been able to", "since", "three or four sentences"]],
  ["Write three or four sentences about skills you want to be able to do one day, and why.", "to be able to", ["want / would like to be able to", "because", "three or four sentences"]],
  ["A friend invites you to a party, but you are busy. Write a short reply (three or four sentences) with won't be able to.", "won't be able to", ["won't be able to", "a reason", "three or four sentences"]],
  ["Write three or four sentences about how your English has changed. Use can, have been able to and will be able to.", "can / have been able to / will be able to", ["can", "have been able to", "will be able to"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.semi-modals.be-able-to.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
