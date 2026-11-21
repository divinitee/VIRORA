// Hand-authored: modals / past-modals / should-have (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): should have / shouldn't have + past participle
// to criticise or regret something in the past (You should have told me earlier.
// I shouldn't have eaten so much.).
// Triage: kept. Siblings must-have / might-have (deduction). must have is NOT offered
// in choose: "You must have told me" is English (a deduction), so the choose task
// is the past form: should have + pp vs should + pp / should had / should has.
// Every line has a bad result now (failed, missed, wet, sick) so the meaning is regret.
// Choose: 14 should have / 6 shouldn't have.
// Build: should have / shouldn't have (not / verb) + the verb in brackets.
// Transform: 5 why didn't … / it was a mistake not to → should have / 5 it was a
// mistake to / why did … → shouldn't have / 5 correct the mistake.
//
// Run: node tools/grammar-practice/authored/modals.past-modals.should-have.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "past-modals", topic: "should-have", level: "B1", pv: "2.5" };
const NAME = ["Nodira", "Akmal", "Zarina", "Sherzod"]; // listener names: never printed in a sentence (audit 20 Nov)
const PP = { tell: "told", study: "studied", leave: "left", take: "taken", go: "gone", say: "said", eat: "eaten", watch: "watched", charge: "charged", buy: "bought", ask: "asked", wear: "worn", call: "called", play: "played", shout: "shouted", drive: "driven", train: "trained", listen: "listened" };
const WHY = "Regret or criticism about the past: should have + past participle.";
const WHY_NOT = "Regret about something you did: shouldn't have + past participle.";
const POS = ["should have", "should", "should had", "should has"];
const NEG = ["shouldn't have", "shouldn't", "shouldn't had", "don't should have"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [POS, "Why didn't you say anything? You ______ told me about the {problem} earlier, {name}.", { problem: ["problem", "test", "party", "change"], name: NAME }],
  [POS, "I failed the {test}. I ______ studied more, {name}.", { test: ["exam", "test", "quiz", "driving test"], name: NAME }],
  [POS, "We missed the {bus}. We ______ left home earlier, {name}.", { bus: ["bus", "train", "flight", "first bus"], name: NAME }],
  [POS, "It's raining and I'm wet. I ______ taken an umbrella to the {place}, {name}.", { place: ["bazaar", "park", "station", "match"], name: NAME }],
  [POS, "The {shop} is closed now. You ______ gone this morning, {name}.", { shop: ["bank", "post office", "pharmacy", "bakery"], name: NAME }],
  [POS, "He was rude to his {who}. He ______ said sorry, {name}.", { who: ["teacher", "grandmother", "boss", "coach"], name: NAME }],
  [POS, "I'm so hungry. I ______ eaten breakfast before the {event}, {name}.", { event: ["exam", "meeting", "trip", "match"], name: NAME }],
  [POS, "The {food} is burnt. You ______ watched it, {name}.", { food: ["plov", "rice", "bread", "cake"], name: NAME }],
  [POS, "My phone is dead. I ______ charged it before the {trip}, {name}.", { trip: ["trip", "flight", "meeting", "journey"], name: NAME }],
  [POS, "The tickets for the {event} are sold out. We ______ bought them last week, {name}.", { event: ["concert", "match", "show", "festival"], name: NAME }],
  [POS, "She got lost in {city}. She ______ asked for directions, {name}.", { city: ["Istanbul", "Moscow", "Seoul", "London"], name: NAME }],
  [POS, "My feet hurt. I ______ worn comfortable shoes to the {event}, {name}.", { event: ["wedding", "party", "concert", "museum"], name: NAME }],
  [POS, "You didn't call {who} on her birthday. You ______ called her, {name}.", { who: ["Grandma", "your aunt", "your sister", "Mum"], name: NAME }],
  [POS, "Our team lost. The coach ______ played {player} from the start, {name}.", { player: ["Timur", "Aziz", "the new boy", "his best player"], name: NAME }],
  [NEG, "I feel sick. I ______ eaten so much {food}, {name}.", { food: ["cake", "ice cream", "plov", "chocolate"], name: NAME }],
  [NEG, "I'm so tired. I ______ gone to bed so late {when}, {name}.", { when: ["last night", "on Sunday", "yesterday", "again"], name: NAME }],
  [NEG, "You ______ shouted at your {who}. He was only trying to help, {name}.", { who: ["brother", "son", "friend", "cousin"], name: NAME }],
  [NEG, "We ______ bought this {thing}. It broke after a week, {name}.", { thing: ["phone", "kettle", "toy", "lamp"], name: NAME }],
  [NEG, "He ______ driven so fast on the {road}. He got a big fine, {name}.", { road: ["motorway", "mountain road", "ring road", "old bridge"], name: NAME }],
  [NEG, "I ______ told Timur about the {event}. Now everyone knows, {name}.", { event: ["party", "gift", "wedding", "surprise"], name: NAME }],
].map(([o, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why: o === NEG ? WHY_NOT : WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Regret or criticism about the past. Complete with should have (or shouldn't have) and the verb in brackets.";
// [verb, negative?, source, slots]
const BUILD = [
  ["study", 0, "I failed the {test}. I ______ (study) more, {name}.", { test: ["exam", "test", "quiz", "driving test"], name: NAME }],
  ["leave", 0, "We missed the {bus}. We ______ (leave) earlier, {name}.", { bus: ["bus", "train", "flight", "first bus"], name: NAME }],
  ["take", 0, "I'm wet. I ______ (take) an umbrella to the {place}, {name}.", { place: ["bazaar", "park", "station", "match"], name: NAME }],
  ["go", 0, "The {shop} is closed now. You ______ (go) in the morning, {name}.", { shop: ["bank", "post office", "pharmacy", "bakery"], name: NAME }],
  ["say", 0, "He was rude to his {who}. He ______ (say) sorry, {name}.", { who: ["teacher", "grandmother", "boss", "coach"], name: NAME }],
  ["watch", 0, "The {food} is burnt. You ______ (watch) it, {name}.", { food: ["plov", "rice", "bread", "cake"], name: NAME }],
  ["charge", 0, "My phone is dead. I ______ (charge) it before the {trip}, {name}.", { trip: ["trip", "flight", "meeting", "journey"], name: NAME }],
  ["buy", 0, "The {event} tickets are sold out. We ______ (buy) them earlier, {name}.", { event: ["concert", "match", "show", "festival"], name: NAME }],
  ["ask", 0, "She got lost in {city}. She ______ (ask) for directions, {name}.", { city: ["Istanbul", "Moscow", "Seoul", "London"], name: NAME }],
  ["call", 0, "You forgot {who}'s birthday. You ______ (call) her, {name}.", { who: ["Grandma", "Mum", "your sister", "your aunt"], name: NAME }],
  ["wear", 0, "I'm cold. I ______ (wear) a warmer {thing}, {name}.", { thing: ["coat", "jacket", "hat", "scarf"], name: NAME }],
  ["train", 0, "The {team} lost. They ______ (train) harder, {name}.", { team: ["team", "boys", "girls", "players"], name: NAME }],
  ["tell", 0, "You didn't say a word about the {event}! You ______ (tell) me, {name}.", { event: ["party", "test", "wedding", "trip"], name: NAME }],
  ["listen", 0, "I ______ (listen) to my {who}. She was right, {name}.", { who: ["mother", "teacher", "sister", "grandmother"], name: NAME }],
  ["eat", 1, "I feel sick. I ______ (not / eat) so much {food}, {name}.", { food: ["cake", "ice cream", "plov", "chocolate"], name: NAME }],
  ["go", 1, "I'm tired. I ______ (not / go) to bed so late {when}, {name}.", { when: ["last night", "on Sunday", "yesterday", "again"], name: NAME }],
  ["shout", 1, "You ______ (not / shout) at your {who}. He was only trying to help, {name}.", { who: ["brother", "son", "friend", "cousin"], name: NAME }],
  ["buy", 1, "We ______ (not / buy) this {thing}. It broke after a week, {name}.", { thing: ["phone", "kettle", "toy", "lamp"], name: NAME }],
  ["drive", 1, "He ______ (not / drive) so fast on the {road}, {name}.", { road: ["motorway", "mountain road", "ring road", "old bridge"], name: NAME }],
  ["tell", 1, "I ______ (not / tell) Timur about the {event}. Now everyone knows, {name}.", { event: ["party", "gift", "wedding", "surprise"], name: NAME }],
].map(([v, neg, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `${neg ? "shouldn't" : "should"} have ${PP[v]}`, why: neg ? WHY_NOT : WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POSI = "Rewrite with should have + past participle.";
const NEGI = "Rewrite with shouldn't have + past participle.";
const FIX = "Correct the mistake.";
// [instr, source, hint, verb, negative?, slots]
const TRANSFORM = [
  [POSI, "Why didn't you tell me about the {problem}, {name}?", "You ______ me about the {problem}, {name}.", "tell", 0, { problem: ["problem", "test", "party", "change"], name: NAME }],
  [POSI, "Why didn't you call me from the {place}, {name}?", "You ______ me from the {place}, {name}.", "call", 0, { place: ["station", "airport", "hospital", "hotel"], name: NAME }],
  [POSI, "It was a mistake not to study for the {test}, {name}.", "I ______ for the {test}, {name}.", "study", 0, { test: ["exam", "test", "quiz", "driving test"], name: NAME }],
  [POSI, "It was wrong of him not to say sorry to the {who}, {name}.", "He ______ sorry to the {who}, {name}.", "say", 0, { who: ["teacher", "neighbours", "boss", "coach"], name: NAME }],
  [POSI, "Why didn't we leave for the {place} earlier, {name}?", "We ______ for the {place} earlier, {name}.", "leave", 0, { place: ["airport", "station", "wedding", "match"], name: NAME }],
  [NEGI, "It was a mistake to eat so much {food}, {name}.", "I ______ so much {food}, {name}.", "eat", 1, { food: ["cake", "ice cream", "plov", "chocolate"], name: NAME }],
  [NEGI, "Why did you shout at your {who}, {name}?", "You ______ at your {who}, {name}.", "shout", 1, { who: ["brother", "son", "friend", "cousin"], name: NAME }],
  [NEGI, "It was a bad idea to buy this {thing}, {name}.", "We ______ this {thing}, {name}.", "buy", 1, { thing: ["phone", "kettle", "toy", "lamp"], name: NAME }],
  [NEGI, "Why did he drive so fast on the {road}, {name}?", "He ______ so fast on the {road}, {name}.", "drive", 1, { road: ["motorway", "mountain road", "ring road", "old bridge"], name: NAME }],
  [NEGI, "It was wrong to tell Timur about the {event}, {name}.", "I ______ Timur about the {event}, {name}.", "tell", 1, { event: ["party", "gift", "wedding", "surprise"], name: NAME }],
  [FIX, "You should told me about the {problem}, {name}.", "You ______ me about the {problem}, {name}.", "tell", 0, { problem: ["problem", "test", "party", "change"], name: NAME }],
  [FIX, "I should have study more for the {test}, {name}.", "I ______ more for the {test}, {name}.", "study", 0, { test: ["exam", "test", "quiz", "driving test"], name: NAME }],
  [FIX, "We should had left earlier for the {place}, {name}.", "We ______ earlier for the {place}, {name}.", "leave", 0, { place: ["airport", "station", "wedding", "match"], name: NAME }],
  [FIX, "She should has asked for directions in {city}, {name}.", "She ______ for directions in {city}, {name}.", "ask", 0, { city: ["Istanbul", "Moscow", "Seoul", "London"], name: NAME }],
  [FIX, "You shouldn't to have eaten so much {food}, {name}.", "You ______ so much {food}, {name}.", "eat", 1, { food: ["cake", "ice cream", "plov", "chocolate"], name: NAME }],
].map(([instr, source, hint, v, neg, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `${neg ? "shouldn't" : "should"} have ${PP[v]}`, why: neg ? WHY_NOT : WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["You failed a test. Write one sentence of regret with should have.", "I should have studied more", ["exactly one sentence", "should have + past participle", "past"]],
  ["You ate too much at a wedding. Write one sentence with shouldn't have.", "I shouldn't have eaten so much", ["exactly one sentence", "shouldn't have + past participle", "past"]],
  ["A friend didn't tell you about a party. Write one sentence criticising her. Use should have.", "You should have told me", ["exactly one sentence", "should have + past participle", "criticism"]],
  ["Write one sentence about a time you were late. Use should have.", "I should have left earlier", ["exactly one sentence", "should have", "a reason"]],
  ["Write one sentence about something you bought and didn't like. Use shouldn't have.", "I shouldn't have bought it", ["exactly one sentence", "shouldn't have", "past"]],
  ["Write one sentence with should (advice now) and one with should have (the past).", "should vs should have", ["exactly two sentences", "should + base verb", "should have + past participle"]],
  ["Write one sentence with should have and an irregular verb (gone, taken, told…).", "should have + irregular past participle", ["exactly one sentence", "irregular past participle", "should have"]],
  ["Write two sentences: what went wrong, then what you should have done.", "problem + should have", ["exactly two sentences", "first: past simple", "second: should have + past participle"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a bad day you had. Write three or four sentences about what you should and shouldn't have done.", "should have / shouldn't have", ["should have", "shouldn't have", "three or four sentences"]],
  ["A friend had a terrible holiday. Write three or four sentences of advice about what he should have done.", "should have for criticism", ["should have", "past participles", "three or four sentences"]],
  ["Write three or four sentences about a mistake a famous team or player made. Use should have.", "should have + past participle", ["should have", "shouldn't have", "three or four sentences"]],
  ["Think about your English learning. Write three or four sentences about what you should have done earlier.", "should have for regret", ["should have", "a reason", "three or four sentences"]],
  ["Your little brother broke a window. Write three or four sentences to him with should have and shouldn't have.", "should have / shouldn't have", ["should have", "shouldn't have", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.past-modals.should-have.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
