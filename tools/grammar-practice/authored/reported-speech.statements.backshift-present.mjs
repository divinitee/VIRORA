// Hand-authored: reported-speech / statements / backshift-present (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): reporting a PRESENT sentence after said: the
// verb moves one step back (am → was, are → were, am working → was working,
// have → had, want → wanted, can't → couldn't) and I / we / my move with it
// (Anna said, 'I am tired.' → Anna said that she was tired.).
// Triage: kept. Siblings backshift-past (past → past perfect), backshift-will
// (will → would, tomorrow → the next day), say-tell. Time words that would need
// changing (today, tomorrow) are kept out.
// One right answer: no backshift ("he said he is tired") can be English when the
// thing is still true now. So every line is a TEMPORARY situation that is over
// (yesterday / last week / last night + tired, at the station, waiting, a cold),
// where the present would be wrong.
// Choose: was / is / were / has been and the same pattern for each verb.
// Build: the past form of the verb in brackets (the original words).
// Transform: 5 report it (pronoun + verb) / 5 correct the mistake / 5 my / our →
// his / her / their + backshift (two blanks, array key).
//
// Run: node tools/grammar-practice/authored/reported-speech.statements.backshift-present.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "reported-speech", branch: "statements", topic: "backshift-present", level: "B1", pv: "2.5" };
const M = ["Aziz", "Timur", "Bekzod", "Rustam"];
const F = ["Olga", "Lola", "Madina", "Sevara"];
const WHY = "Reported after said: the present moves back to the past (am → was, are → were, can't → couldn't), and I / my change to he / his, she / her, they / their.";

/* ---------------- choose: 20 mcq ---------------- */
// [options (key first), prompt, slots]
const CHOOSE = [
  [["was", "is", "were", "has been"], "Yesterday {m} said, 'I'm {adj}.' He said that he ______ {adj}.", { m: M, adj: ["tired", "hungry", "busy", "cold"] }],
  [["were", "are", "was", "have been"], "Last week my {who} said, 'We're at the {place}.' They said they ______ at the {place}.", { who: ["friends", "cousins", "neighbours", "classmates"], place: ["station", "beach", "bazaar", "cinema"] }],
  [["was", "is", "were", "has been"], "On the phone last night, {f} said, 'I'm at the {place}.' She said she ______ at the {place}.", { f: F, place: ["airport", "hospital", "hotel", "office"] }],
  [["was working", "is working", "worked", "were working"], "Yesterday {m} said, 'I'm working on my {work}.' He said he ______ on his {work}.", { m: M, work: ["essay", "project", "report", "car"] }],
  [["were watching", "are watching", "watched", "was watching"], "Last night the {who} said, 'We're watching a {film}.' They said they ______ a {film}.", { who: ["kids", "boys", "girls", "students"], film: ["film", "match", "cartoon", "show"] }],
  [["was waiting", "is waiting", "waited", "were waiting"], "This morning {f} said, 'I'm waiting for the {bus}.' She said she ______ for the {bus}.", { f: F, bus: ["bus", "train", "taxi", "metro"] }],
  [["had", "has", "have", "had had"], "Last week {m} said, 'I have a {ill}.' He said he ______ a {ill}.", { m: M, ill: ["cold", "headache", "toothache", "fever"] }],
  [["had", "has", "have", "had had"], "On Monday {f} said, 'I have a lot of {work}.' She said she ______ a lot of {work}.", { f: F, work: ["homework", "work", "housework", "emails"] }],
  [["wanted", "wants", "want", "had want"], "At the café yesterday, {m} said, 'I want some {food}.' He said he ______ some {food}.", { m: M, food: ["tea", "soup", "water", "bread"] }],
  [["needed", "needs", "need", "was need"], "Yesterday {f} said, 'I need your {thing}.' She said she ______ my {thing}.", { f: F, thing: ["help", "car", "phone", "laptop"] }],
  [["couldn't", "can't", "can't to", "didn't can"], "Last Friday {m} said, 'I can't come to the {event}.' He said he ______ come to the {event}.", { m: M, event: ["party", "wedding", "match", "meeting"] }],
  [["could", "can", "can to", "could to"], "On Sunday {f} said, 'I can help you with the {work}.' She said she ______ help me with the {work}.", { f: F, work: ["move", "homework", "party", "cooking"] }],
  [["was", "is", "were", "has been"], "Last night the {who} said, 'The {thing} is ready.' He said the {thing} ______ ready.", { who: ["waiter", "manager", "driver", "porter"], thing: ["table", "room", "car", "food"] }],
  [["wasn't", "isn't", "weren't", "didn't"], "At lunch yesterday, {m} said, 'I'm not {adj}.' He said he ______ {adj}.", { m: M, adj: ["hungry", "tired", "ready", "cold"] }],
  [["wasn't", "isn't", "didn't", "weren't"], "At the {event} last night, {f} said, 'I'm not feeling well.' She said she ______ feeling well.", { f: F, event: ["party", "wedding", "concert", "dinner"] }],
  [["were", "are", "was", "have been"], "After the concert, my {who} said, 'We're very {adj}.' They said they ______ very {adj}.", { who: ["parents", "grandparents", "neighbours", "cousins"], adj: ["proud", "happy", "tired", "hungry"] }],
  [["didn't", "doesn't", "don't", "wasn't"], "Last week {m} said, 'My {car} doesn't work.' He said his {car} ______ work.", { m: M, car: ["car", "phone", "laptop", "fridge"] }],
  [["was", "is", "were", "has been"], "Yesterday {f} called and said, 'I'm lost in {city}.' She said she ______ lost in {city}.", { f: F, city: ["Samarkand", "Bukhara", "Istanbul", "Moscow"] }],
  [["was cooking", "is cooking", "cooked", "were cooking"], "Last night {m} said, 'I'm cooking {food}.' He said he ______ {food}.", { m: M, food: ["plov", "soup", "dinner", "pasta"] }],
  [["was", "is", "were", "has been"], "Last week the {who} said, 'The {thing} is broken.' She said the {thing} ______ broken.", { who: ["teacher", "manager", "receptionist", "cleaner"], thing: ["lift", "printer", "heater", "door"] }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Report it. Put the words in brackets one step into the past.";
// [key, source, slots]
const BUILD = [
  ["was", "Yesterday {m} said he ______ (am) {adj}.", { m: M, adj: ["tired", "hungry", "busy", "cold"] }],
  ["were", "Last week my {who} said they ______ (are) at the {place}.", { who: ["friends", "cousins", "neighbours", "classmates"], place: ["station", "beach", "bazaar", "cinema"] }],
  ["was", "On the phone last night, {f} said she ______ (am) at the {place}.", { f: F, place: ["airport", "hospital", "hotel", "office"] }],
  ["was working", "Yesterday {m} said he ______ (am working) on his {work}.", { m: M, work: ["essay", "project", "report", "car"] }],
  ["were watching", "Last night the {who} said they ______ (are watching) a {film}.", { who: ["kids", "boys", "girls", "students"], film: ["film", "match", "cartoon", "show"] }],
  ["was waiting", "This morning {f} said she ______ (am waiting) for the {bus}.", { f: F, bus: ["bus", "train", "taxi", "metro"] }],
  ["had", "Last week {m} said he ______ (have) a {ill}.", { m: M, ill: ["cold", "headache", "toothache", "fever"] }],
  ["had", "On Monday {f} said she ______ (have) a lot of {work}.", { f: F, work: ["homework", "work", "housework", "emails"] }],
  ["wanted", "At the café yesterday, {m} said he ______ (want) some {food}.", { m: M, food: ["tea", "soup", "water", "bread"] }],
  ["needed", "Yesterday {f} said she ______ (need) my {thing}.", { f: F, thing: ["help", "car", "phone", "laptop"] }],
  ["couldn't", "Last Friday {m} said he ______ (can't) come to the {event}.", { m: M, event: ["party", "wedding", "match", "meeting"] }],
  ["could", "On Sunday {f} said she ______ (can) help me with the {work}.", { f: F, work: ["move", "homework", "party", "cooking"] }],
  ["was", "Last night the {who} said the {thing} ______ (is) ready.", { who: ["waiter", "manager", "driver", "porter"], thing: ["table", "room", "car", "food"] }],
  ["wasn't", "At lunch yesterday, {m} said he ______ (am not) {adj}.", { m: M, adj: ["hungry", "tired", "ready", "cold"] }],
  ["wasn't feeling", "At the {event} last night, {f} said she ______ (am not feeling) well.", { f: F, event: ["party", "wedding", "concert", "dinner"] }],
  ["were", "After the concert, my {who} said they ______ (are) very {adj}.", { who: ["parents", "grandparents", "neighbours", "cousins"], adj: ["proud", "happy", "tired", "hungry"] }],
  ["didn't", "Last week {m} said his {car} ______ (doesn't) work.", { m: M, car: ["car", "phone", "laptop", "fridge"] }],
  ["was", "Yesterday {f} called and said she ______ (am) lost in {city}.", { f: F, city: ["Samarkand", "Bukhara", "Istanbul", "Moscow"] }],
  ["was cooking", "Last night {m} said he ______ (am cooking) {food}.", { m: M, food: ["plov", "soup", "dinner", "pasta"] }],
  ["was", "Last week the {who} said the {thing} ______ (is) broken.", { who: ["teacher", "manager", "receptionist", "cleaner"], thing: ["lift", "printer", "heater", "door"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REP = "Report the words. Change the pronoun and the verb.";
const FIX = "Correct the mistake.";
const POSS = "Report the words. Change my / our and the verb.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [REP, "'I'm {adj},' {m} said yesterday.", "Yesterday {m} said that ______ {adj}.", "he was", { m: M, adj: ["tired", "hungry", "busy", "cold"] }],
  [REP, "'We're at the {place},' my {who} said last week.", "Last week my {who} said that ______ at the {place}.", "they were", { who: ["friends", "cousins", "neighbours", "classmates"], place: ["station", "beach", "bazaar", "cinema"] }],
  [REP, "'I'm working on my {work},' {f} said yesterday.", "Yesterday {f} said that ______ on her {work}.", "she was working", { f: F, work: ["essay", "project", "report", "car"] }],
  [REP, "'I have a {ill},' {m} said last week.", "Last week {m} said that ______ a {ill}.", "he had", { m: M, ill: ["cold", "headache", "toothache", "fever"] }],
  [REP, "'I can't come to the {event},' {f} said on Friday.", "On Friday {f} said that ______ come to the {event}.", "she couldn't", { f: F, event: ["party", "wedding", "match", "meeting"] }],
  [FIX, "Yesterday {m} said that he is {adj}.", "Yesterday {m} said that he ______ {adj}.", "was", { m: M, adj: ["tired", "hungry", "busy", "cold"] }],
  [FIX, "Yesterday {f} said that I was at the {place}.", "Yesterday {f} said that ______ was at the {place}.", "she", { f: F, place: ["airport", "hospital", "hotel", "office"] }],
  [FIX, "Last night the {who} said they are watching a {film}.", "Last night the {who} said they ______ a {film}.", "were watching", { who: ["kids", "boys", "girls", "students"], film: ["film", "match", "cartoon", "show"] }],
  [FIX, "Last week {m} said he has a {ill}.", "Last week {m} said he ______ a {ill}.", "had", { m: M, ill: ["cold", "headache", "toothache", "fever"] }],
  [FIX, "On Friday {f} said she can't come to the {event}.", "On Friday {f} said she ______ come to the {event}.", "couldn't", { f: F, event: ["party", "wedding", "match", "meeting"] }],
  [POSS, "'My {thing} is broken,' {m} said yesterday.", "Yesterday {m} said that ______ {thing} ______ broken.", ["his", "was"], { m: M, thing: ["phone", "bike", "laptop", "watch"] }],
  [POSS, "'My {who} is ill,' {f} said last week.", "Last week {f} said that ______ {who} ______ ill.", ["her", "was"], { f: F, who: ["mother", "son", "sister", "dog"] }],
  [POSS, "'Our {car} doesn't work,' the {who} said last week.", "Last week the {who} said that ______ {car} ______ work.", ["their", "didn't"], { car: ["car", "fridge", "heater", "TV"], who: ["neighbours", "students", "workers", "guests"] }],
  [POSS, "'I'm waiting for my {who},' {m} said this morning.", "This morning {m} said that ______ waiting for ______ {who}.", ["he was", "his"], { m: M, who: ["brother", "father", "friend", "son"] }],
  [POSS, "'We need our {thing},' the {who} said yesterday.", "Yesterday the {who} said that ______ ______ {thing}.", ["they needed", "their"], { thing: ["keys", "tickets", "passports", "bags"], who: ["tourists", "guests", "students", "players"] }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["A friend said yesterday: 'I'm tired.' Report it in one sentence.", "He / She said (that) he / she was tired", ["exactly one sentence", "said", "was"]],
  ["Your mum said last night: 'I'm cooking plov.' Report it.", "She said she was cooking plov", ["exactly one sentence", "was + -ing", "she"]],
  ["Your classmates said last week: 'We're at the museum.' Report it.", "They said they were at the museum", ["exactly one sentence", "they", "were"]],
  ["Someone said: 'I can't come.' Report it in one sentence.", "… said he / she couldn't come", ["exactly one sentence", "couldn't", "past"]],
  ["Report something a friend said on the phone yesterday. Use said that.", "said that + past", ["exactly one sentence", "said that", "one step into the past"]],
  ["Someone said: 'My car doesn't work.' Report it.", "… said his / her car didn't work", ["exactly one sentence", "his / her", "didn't"]],
  ["Write the direct words and then the reported sentence.", "direct → reported", ["exactly two sentences", "quotation marks in the first", "backshift in the second"]],
  ["A tourist said: 'I want a map.' Report it.", "He / She said he / she wanted a map", ["exactly one sentence", "wanted", "pronoun change"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You talked to three friends yesterday. Write three or four sentences reporting what they said.", "reported statements with backshift", ["said (that)", "past forms", "three or four sentences"]],
  ["Report a phone call with your grandmother last week. Write three or four sentences.", "reported speech", ["she said", "was / had / couldn't", "three or four sentences"]],
  ["A new classmate told you about himself or herself yesterday. Write three or four reported sentences.", "backshift + pronoun change", ["said", "he / she", "three or four sentences"]],
  ["Report what your teacher said in class yesterday. Write three or four sentences.", "reported statements", ["said that", "past", "three or four sentences"]],
  ["Write three or four sentences reporting what people said at a party last weekend.", "reported speech with backshift", ["said", "was / were", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/reported-speech.statements.backshift-present.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
