// Hand-authored: modals / past-modals / might-have (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): might have + past participle for a guess
// about the PAST when the speaker is not sure (He isn't here. He might have
// missed the bus.).
// Triage: kept. Siblings must-have (sure) and should-have (criticism); the present
// form is might-present. must have / could have / may have are never offered, so
// the choose task is the form for a past guess: might have + pp vs might + base
// (present / future), might had, might has.
// Choose: might have + pp / might + base / might had + pp / might has + pp.
// Build: might have (+ not) + the verb in brackets; no source prints might, have
// or the pp.
// Transform: 5 perhaps / maybe + past simple → might have / 5 correct the mistake /
// 5 perhaps … didn't → might not have.
//
// Run: node tools/grammar-practice/authored/modals.past-modals.might-have.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "past-modals", topic: "might-have", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const TEAM = ["Pakhtakor", "Nasaf", "Bunyodkor", "Navbahor"];
const PP = { miss: "missed", forget: "forgotten", leave: "left", go: "gone", eat: "eaten", win: "won", lose: "lost", study: "studied", see: "seen", take: "taken", be: "been", break: "broken", hear: "heard", drive: "driven", sleep: "slept", buy: "bought", finish: "finished", meet: "met", fall: "fallen", close: "closed", receive: "received", know: "known", understand: "understood" };
const WHY = "A guess about the past, not sure: might have + past participle.";
const WHY_NOT = "A guess about the past, not sure: might not have + past participle.";
const opts = (v) => [`might have ${PP[v]}`, `might ${v}`, `might had ${PP[v]}`, `might has ${PP[v]}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["miss", "Aziz didn't come to class this morning. I don't know why. He ______ the {bus}, {name}.", { bus: ["bus", "train", "metro", "first bus"], name: NAME }],
  ["forget", "Olga didn't call {when}. She ______, {name}. I'm not sure.", { when: ["yesterday", "last night", "on Friday", "this morning"], name: NAME }],
  ["leave", "I can't find my {thing}. I ______ it at the {place}.", { thing: ["phone", "wallet", "key", "umbrella"], place: ["café", "office", "station", "gym"] }],
  ["go", "Nobody answered at the {home}. They ______ out. I'm not sure, {name}.", { home: ["flat", "house", "office", "shop"], name: NAME }],
  ["eat", "The {food} is gone. I'm not sure who took it. The cat ______ it, {name}.", { food: ["fish", "meat", "cheese", "chicken"], name: NAME }],
  ["lose", "Timur hasn't got his {thing}. He ______ it on the bus. Nobody knows, {name}.", { thing: ["phone", "wallet", "bag", "key"], name: NAME }],
  ["see", "I'm not sure, but I ______ that film before, {name}. The {part} looks familiar.", { part: ["beginning", "ending", "first scene", "main actor"], name: NAME }],
  ["take", "I don't know where my {thing} is. My brother ______ it, {name}.", { thing: ["charger", "pen", "coat", "book"], name: NAME }],
  ["be", "The road was closed {when}. There ______ an accident. I don't know, {name}.", { when: ["this morning", "last night", "yesterday", "on Sunday"], name: NAME }],
  ["close", "The {shop} was dark when we got there. It ______ early. I'm not sure, {name}.", { shop: ["bakery", "pharmacy", "post office", "bookshop"], name: NAME }],
  ["break", "The {thing} doesn't work. I don't know why. Someone ______ it, {name}.", { thing: ["printer", "lift", "TV", "lamp"], name: NAME }],
  ["win", "I missed the game yesterday. I'm not sure, but {team} ______ the match, {name}.", { team: TEAM, name: NAME }],
  ["buy", "Lola has a new {thing}. I'm not sure, but she ______ it in {city}.", { thing: ["dress", "bag", "scarf", "coat"], city: ["Tashkent", "Istanbul", "Dubai", "Moscow"] }],
  ["sleep", "He's still in bed at {time}. I don't know why. He ______ badly, {name}.", { time: ["eleven", "noon", "ten o'clock", "lunchtime"], name: NAME }],
  ["study", "I'm not sure how she passed. She ______ a lot before the {test}, {name}.", { test: ["exam", "test", "quiz", "interview"], name: NAME }],
  ["meet", "I'm not sure where I know him from. I ______ him at the {event}, {name}.", { event: ["wedding", "party", "concert", "conference"], name: NAME }],
  ["drive", "I don't know how they got to {city}. They ______ there, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Namangan"], name: NAME }],
  ["fall", "Her knee is hurt. I'm not sure what happened. She ______ in the {place}, {name}.", { place: ["park", "yard", "street", "gym"], name: NAME }],
  ["finish", "I don't know if Timur is free. He ______ his {work} by now, {name}.", { work: ["homework", "essay", "project", "report"], name: NAME }],
  ["hear", "I'm not sure how she knows. She ______ the news from her {who}, {name}.", { who: ["sister", "mother", "friend", "neighbour"], name: NAME }],
].map(([v, prompt, slots], i) => {
  const o = opts(v);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "The speaker is not sure about the past. Complete with might have (or might not have) and the verb in brackets.";
// [verb, negative?, source, slots]
const BUILD = [
  ["miss", 0, "Aziz is late. He ______ (miss) the {bus}, {name}.", { bus: ["bus", "train", "metro", "first bus"], name: NAME }],
  ["forget", 0, "Olga didn't come to the {event}. She ______ (forget), {name}.", { event: ["meeting", "lesson", "party", "match"], name: NAME }],
  ["leave", 0, "My {thing} isn't in my bag. I ______ (leave) it at the {place}.", { thing: ["phone", "wallet", "key", "umbrella"], place: ["café", "office", "station", "gym"] }],
  ["go", 0, "Nobody is at the {home}. They ______ (go) to the bazaar, {name}.", { home: ["flat", "house", "office", "shop"], name: NAME }],
  ["eat", 0, "The {food} is gone. The dog ______ (eat) it, {name}.", { food: ["meat", "sausage", "chicken", "cheese"], name: NAME }],
  ["lose", 0, "Timur can't find his {thing}. He ______ (lose) it, {name}.", { thing: ["phone", "wallet", "bag", "key"], name: NAME }],
  ["take", 0, "My {thing} isn't here. My sister ______ (take) it, {name}.", { thing: ["charger", "pen", "coat", "book"], name: NAME }],
  ["be", 0, "The road was closed {when}. There ______ (be) an accident, {name}.", { when: ["this morning", "last night", "yesterday", "on Sunday"], name: NAME }],
  ["close", 0, "The {shop} was dark. It ______ (close) early, {name}.", { shop: ["bakery", "pharmacy", "post office", "bookshop"], name: NAME }],
  ["break", 0, "The {thing} isn't working. Someone ______ (break) it, {name}.", { thing: ["printer", "lift", "TV", "lamp"], name: NAME }],
  ["buy", 0, "Lola has a new {thing}. She ______ (buy) it in {city}.", { thing: ["dress", "bag", "scarf", "coat"], city: ["Tashkent", "Istanbul", "Dubai", "Moscow"] }],
  ["sleep", 0, "He looks tired this {time}. He ______ (sleep) badly, {name}.", { time: ["morning", "Monday", "afternoon", "week"], name: NAME }],
  ["meet", 0, "I know that man's face. I ______ (meet) him at the {event}, {name}.", { event: ["wedding", "party", "concert", "conference"], name: NAME }],
  ["fall", 0, "Her arm hurts. She ______ (fall) in the {place}, {name}.", { place: ["park", "yard", "street", "gym"], name: NAME }],
  ["win", 0, "I'm not sure about the score. {team} ______ (win) the match, {name}.", { team: TEAM, name: NAME }],
  ["hear", 1, "She didn't answer. She ______ (not / hear) the phone at the {place}, {name}.", { place: ["gym", "bazaar", "concert", "party"], name: NAME }],
  ["see", 1, "He didn't say hello. He ______ (not / see) you at the {event}, {name}.", { event: ["wedding", "party", "concert", "match"], name: NAME }],
  ["receive", 1, "They didn't reply. They ______ (not / receive) my {msg}, {name}.", { msg: ["email", "letter", "message", "invitation"], name: NAME }],
  ["know", 1, "Don't be angry with him. He ______ (not / know) about the {event}, {name}.", { event: ["meeting", "party", "test", "change"], name: NAME }],
  ["understand", 1, "She did the wrong {work}. She ______ (not / understand) the teacher, {name}.", { work: ["homework", "exercise", "task", "page"], name: NAME }],
].map(([v, neg, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `might ${neg ? "not " : ""}have ${PP[v]}`, why: neg ? WHY_NOT : WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PERH = "Rewrite with might have + past participle.";
const FIX = "Correct the mistake.";
const NOT = "Rewrite with might not have + past participle.";
// [instr, source, hint, verb, negative?, slots]
const TRANSFORM = [
  [PERH, "Perhaps he missed the {bus}, {name}.", "He ______ the {bus}, {name}.", "miss", 0, { bus: ["bus", "train", "metro", "first bus"], name: NAME }],
  [PERH, "Maybe she forgot about the {event}, {name}.", "She ______ about the {event}, {name}.", "forget", 0, { event: ["meeting", "lesson", "party", "match"], name: NAME }],
  [PERH, "Perhaps they went to {city} for the weekend, {name}.", "They ______ to {city} for the weekend, {name}.", "go", 0, { city: ["Samarkand", "Bukhara", "Khiva", "Namangan"], name: NAME }],
  [PERH, "Maybe I left my {thing} at the {place}.", "I ______ my {thing} at the {place}.", "leave", 0, { thing: ["phone", "wallet", "key", "umbrella"], place: ["café", "office", "station", "gym"] }],
  [PERH, "Perhaps the {shop} closed early, {name}.", "The {shop} ______ early, {name}.", "close", 0, { shop: ["bakery", "pharmacy", "post office", "bookshop"], name: NAME }],
  [FIX, "He might missed the {bus}, {name}.", "He ______ the {bus}, {name}.", "miss", 0, { bus: ["bus", "train", "metro", "first bus"], name: NAME }],
  [FIX, "She might has forgotten the {event}, {name}.", "She ______ the {event}, {name}.", "forget", 0, { event: ["meeting", "lesson", "party", "match"], name: NAME }],
  [FIX, "They might have went to the {place}, {name}.", "They ______ to the {place}, {name}.", "go", 0, { place: ["bazaar", "park", "mall", "cinema"], name: NAME }],
  [FIX, "I might had left my {thing} on the bus, {name}.", "I ______ my {thing} on the bus, {name}.", "leave", 0, { thing: ["phone", "wallet", "key", "umbrella"], name: NAME }],
  [FIX, "The dog might have eat the {food}, {name}.", "The dog ______ the {food}, {name}.", "eat", 0, { food: ["meat", "sausage", "chicken", "cheese"], name: NAME }],
  [NOT, "Perhaps she didn't hear the phone at the {place}, {name}.", "She ______ the phone at the {place}, {name}.", "hear", 1, { place: ["gym", "bazaar", "concert", "party"], name: NAME }],
  [NOT, "Maybe he didn't see you at the {event}, {name}.", "He ______ you at the {event}, {name}.", "see", 1, { event: ["wedding", "party", "concert", "match"], name: NAME }],
  [NOT, "Perhaps they didn't receive my {msg}, {name}.", "They ______ my {msg}, {name}.", "receive", 1, { msg: ["email", "letter", "message", "invitation"], name: NAME }],
  [NOT, "Maybe he didn't know about the {event}, {name}.", "He ______ about the {event}, {name}.", "know", 1, { event: ["meeting", "party", "test", "change"], name: NAME }],
  [NOT, "Perhaps she didn't understand the {work}, {name}.", "She ______ the {work}, {name}.", "understand", 1, { work: ["question", "task", "homework", "exercise"], name: NAME }],
].map(([instr, source, hint, v, neg, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `might ${neg ? "not " : ""}have ${PP[v]}`, why: neg ? WHY_NOT : WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your friend is late for the meeting. Write one sentence guessing what happened. Use might have.", "He might have missed the bus", ["exactly one sentence", "might have + past participle", "not sure"]],
  ["You can't find your keys. Write one sentence with might have.", "I might have left them …", ["exactly one sentence", "might have + past participle", "a place"]],
  ["A friend didn't reply to your message. Write one sentence with might not have.", "She might not have seen it", ["exactly one sentence", "might not have + past participle", "past"]],
  ["Write one sentence with might have been.", "might have been + noun / adjective", ["exactly one sentence", "might have been", "past"]],
  ["Write one sentence with must have and one with might have.", "must have vs might have", ["exactly two sentences", "must have = sure", "might have = not sure"]],
  ["The shop was closed yesterday. Write one sentence guessing why.", "It might have …", ["exactly one sentence", "might have", "a reason"]],
  ["Write one sentence with might have and an irregular verb (gone, lost, taken…).", "might have + irregular past participle", ["exactly one sentence", "irregular past participle", "might have"]],
  ["Write one sentence with might (now) and one with might have (past).", "might vs might have", ["exactly two sentences", "might + base verb", "might have + past participle"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Your friend didn't come to your birthday party. Write three or four sentences guessing why. Use might have and might not have.", "might have / might not have", ["might have", "might not have", "three or four sentences"]],
  ["You find a strange box outside your door. Write three or four sentences about who might have left it.", "might have + past participle", ["might have", "different guesses", "three or four sentences"]],
  ["Your team lost a match. Write three or four sentences about what might have gone wrong.", "might have for past guesses", ["might have", "past participles", "three or four sentences"]],
  ["Describe a mystery from the news or a film. Write three or four sentences with might have and must have.", "might have vs must have", ["might have", "must have", "three or four sentences"]],
  ["Your phone is not where you left it. Write three or four sentences with might have.", "might have + past participle", ["might have", "might not have", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.past-modals.might-have.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
