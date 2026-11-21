// Hand-authored: questions-negation / indirect-questions / embedded-if-whether (B1).
// Wave C, C8 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: if / whether for an embedded YES/NO question, with
// statement order ("Do you know if the bank is open?"). Sibling
// embedded-order (C9) does wh-questions ("Can you tell me where she lives?"),
// so every key here is a yes/no question.
// Choose: options are [if/whether + statement order, direct question order
// with no if, if + question order, a broken do/does form]. "that" is never
// offered ("I'm not sure that she is …" is grammatical), and no distractor is
// a different tense that could also be right.
// Build: the direct question is printed in brackets; the learner types the
// subject + verb after the printed "if" (statement order, no do/does/did).
// Transform: 5 present → embedded / 5 past, modal, perfect → embedded /
// 5 correct the mistake. Every "if" key also accepts "whether".
//
// Run: node tools/grammar-practice/authored/questions-negation.indirect-questions.embedded-if-whether.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "indirect-questions", topic: "embedded-if-whether", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const WHY = "A yes/no question inside another sentence: if (or whether) + statement order, subject then verb. No do / does / did, no question order.";
const withWhether = (k) => (/^if /.test(k) ? [k.replace(/^if /, "whether ")] : []);

/* ---------------- choose: 20 mcq ---------------- */
const LANG = ["Russian", "Korean", "Turkish", "Chinese"];
const CHOOSE = [
  [["if the bank is", "is the bank", "if is the bank", "does the bank"], "Do you know ______ open on {day}, {name}?", { day: ["Sundays", "Mondays", "holidays", "Navruz"], name: NAME }],
  [["if the train leaves", "does the train leave", "if does the train leave", "if the train leave"], "Can you tell me ______ at {time}, {name}?", { time: ["six", "seven", "noon", "eight"], name: NAME }],
  [["if my sister is", "is my sister", "if is my sister", "does my sister"], "I'm not sure ______ at home {when}, {name}.", { when: ["now", "today", "tonight", "this evening"], name: NAME }],
  [["if your teacher speaks", "does your teacher speak", "if does your teacher speak", "if your teacher speak"], "I'd like to know ______ {lang}, {name}.", { lang: LANG, name: NAME }],
  [["whether she got", "did she get", "whether did she get", "whether she get"], "I wonder ______ my {thing}, {name}.", { thing: ["letter", "message", "postcard", "email"], name: NAME }],
  [["if he is coming", "is he coming", "if is he coming", "does he coming"], "Could you ask him ______ to the {event}, {name}?", { event: ["party", "wedding", "concert", "meeting"], name: NAME }],
  [["if your brother can", "can your brother", "if can your brother", "does your brother can"], "Do you know ______ {skill}, {name}?", { skill: ["swim", "drive", "ski", "cook"], name: NAME }],
  [["if I passed", "did I pass", "if did I pass", "do I passed"], "I don't know ______ the {test} yet, {name}.", { test: ["exam", "test", "driving test", "interview"], name: NAME }],
  [["if there is a pharmacy", "is there a pharmacy", "if is there a pharmacy", "does there a pharmacy"], "Can you tell me ______ near the {place}, {name}?", { place: ["hotel", "station", "school", "bazaar"], name: NAME }],
  [["whether it will rain", "will it rain", "whether will it rain", "does it rain"], "Do you know ______ {when}, {name}?", { when: ["tomorrow", "tonight", "this weekend", "on Saturday"], name: NAME }],
  [["if the price includes", "does the price include", "if does the price include", "if the price include"], "I'd like to know ______ {thing}, {name}.", { thing: ["breakfast", "wifi", "parking", "dinner"], name: NAME }],
  [["if the bus stops", "does the bus stop", "if does the bus stop", "if the bus stop"], "Ask the driver ______ at the {place}, {name}.", { place: ["bazaar", "museum", "hospital", "station"], name: NAME }],
  [["whether I left", "did I leave", "whether did I leave", "whether I leaved"], "I'm not sure ______ my {thing} at home, {name}.", { thing: ["phone", "keys", "wallet", "passport"], name: NAME }],
  [["if your cousin is", "is your cousin", "if is your cousin", "does your cousin"], "Could you find out ______ free on {day}, {name}?", { day: ["Saturday", "Sunday", "Friday", "Monday"], name: NAME }],
  [["if there are", "are there", "if are there", "do there"], "Can you check ______ any seats left on the {vehicle}, {name}?", { vehicle: ["train", "bus", "plane", "night train"], name: NAME }],
  [["if the teacher has read", "has the teacher read", "if has the teacher read", "if the teacher have read"], "I wonder ______ my {work}, {name}.", { work: ["essay", "email", "story", "homework"], name: NAME }],
  [["if you locked", "did you lock", "if did you lock", "if you locking"], "Do you remember ______ the {thing}, {name}?", { thing: ["door", "car", "gate", "window"], name: NAME }],
  [["if I can pay", "can I pay", "if can I pay", "if I can to pay"], "Could you tell me ______ by {method}, {name}?", { method: ["card", "phone", "cash", "bank transfer"], name: NAME }],
  [["whether they are coming", "are they coming", "whether are they coming", "whether they coming"], "We don't know ______ to the {event}, {name}.", { event: ["party", "wedding", "picnic", "dinner"], name: NAME }],
  [["if your grandmother understands", "does your grandmother understand", "if does your grandmother understand", "if your grandmother understand"], "I'm not sure ______ {lang}, {name}.", { lang: LANG, name: NAME }],
].map(([opts, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: WHY, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets after if. Use statement order: no do / does / did.";
const PLACE = ["bazaar", "airport", "station", "museum"];
const DAY = ["Sundays", "Mondays", "holidays", "Fridays"];
// Every item has a time cue (every day, usually, yesterday, last …, tomorrow)
// so only one tense is right; typed keys are the verb in the embedded clause.
const BUILD = [
  ["stops", "Can you tell me if the bus ______ (stop) at the {place} every day, {name}?", { place: PLACE, name: NAME }],
  ["is", "Do you know if the shop ______ (be) usually open on {day}, {name}?", { day: DAY, name: NAME }],
  ["called", "I wonder if Grandma ______ (call) {when}, {name}.", { when: ["yesterday", "this morning", "last night", "on Sunday"], name: NAME }],
  ["works", "Can you find out if your brother still ______ (work) at the {place}, {name}?", { place: ["bank", "hotel", "hospital", "airport"], name: NAME }],
  ["were", "I'm not sure if they ______ (be) at home {when}, {name}.", { when: ["yesterday", "last night", "on Saturday", "last weekend"], name: NAME }],
  ["likes", "Do you know if your sister usually ______ (like) {food}, {name}?", { food: ["plov", "fish", "spicy food", "ice cream"], name: NAME }],
  ["rained", "I wonder if it ______ (rain) in {city} {when}.", { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], when: ["yesterday", "last night", "last week", "on Monday"] }],
  ["locked", "Can you check if you ______ (lock) the {thing} this morning, {name}?", { thing: ["door", "car", "gate", "window"], name: NAME }],
  ["opens", "Please ask if the shop ______ (open) at {time} every day, {name}.", { time: ["eight", "nine", "ten", "seven"], name: NAME }],
  ["has", "Could you ask if the hotel ______ (have) {thing}, {name}?", { thing: ["wifi", "a pool", "parking", "a lift"], name: NAME }],
  ["started", "Do you know if the {event} ______ (start) on time yesterday, {name}?", { event: ["lesson", "match", "film", "concert"], name: NAME }],
  ["came", "I don't know if your cousin ______ (come) to the {event} last {when}.", { event: ["party", "wedding", "concert", "picnic"], when: ["week", "Saturday", "month", "Friday"] }],
  ["sell", "Can you ask if they usually ______ (sell) {thing} here, {name}?", { thing: ["phone cards", "stamps", "bread", "tickets"], name: NAME }],
  ["checked", "I wonder if the teacher ______ (check) our {work} last night, {name}.", { work: ["tests", "essays", "homework", "stories"], name: NAME }],
  ["goes", "Could you check if this bus ______ (go) to the {place} every hour, {name}?", { place: PLACE, name: NAME }],
  ["was", "Can you tell me if the exam ______ (be) {adj} yesterday, {name}?", { adj: ["difficult", "long", "easy", "fair"], name: NAME }],
  ["enjoyed", "I'd like to know if your parents ______ (enjoy) the {thing} last week, {name}.", { thing: ["trip", "concert", "dinner", "film"], name: NAME }],
  ["is", "I'd like to know if the museum ______ (be) free on {day}, {name}.", { day: DAY, name: NAME }],
  ["speaks", "I'm not sure if your teacher ______ (speak) {lang} at home, {name}.", { lang: LANG, name: NAME }],
  ["understood", "Could you ask Grandpa if he ______ (understand) the {thing} yesterday, {name}?", { thing: ["film", "letter", "message", "news"], name: NAME }],
].map(([key, source, slots]) => {
  const acc = [];
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(acc.length ? { acceptable: acc } : {}), why: WHY, slots: pick(source, slots) };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POL = "Make it a polite question. Use if.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // present (5)
  [POL, "Is the bank open on {day}, {name}?", "Do you know ______ on {day}, {name}?", "if the bank is open", { day: DAY, name: NAME }],
  [POL, "Does your friend eat {food}, {name}?", "Do you know ______ {food}, {name}?", "if your friend eats", { food: ["meat", "fish", "spicy food", "sweets"], name: NAME }],
  [POL, "Is your sister at home {when}, {name}?", "I wonder ______ {when}, {name}.", "if your sister is at home", { when: ["now", "today", "tonight", "this evening"], name: NAME }],
  [POL, "Do they live near the {place}, {name}?", "Can you tell me ______ near the {place}, {name}?", "if they live", { place: PLACE, name: NAME }],
  [POL, "Does the museum close at {time}, {name}?", "Could you tell me ______ at {time}, {name}?", "if the museum closes", { time: ["five", "six", "seven", "eight"], name: NAME }],
  // past, modal, future, perfect (5)
  [POL, "Did you finish the {work}, {name}?", "Can I ask ______ the {work}, {name}?", "if you finished", { work: ["homework", "essay", "project", "book"], name: NAME }],
  [POL, "Can we sit near the {place}, {name}?", "Do you know ______ near the {place}, {name}?", "if we can sit", { place: ["window", "door", "stage", "screen"], name: NAME }],
  [POL, "Will the bus come {when}, {name}?", "Do you know ______ {when}, {name}?", "if the bus will come", { when: ["soon", "before six", "on time", "today"], name: NAME }],
  [POL, "Has the {event} started, {name}?", "Can you check if the {event} ______, {name}?", "has started", { event: ["lesson", "match", "film", "concert"], name: NAME }],
  [POL, "Did Grandma get our {thing}, {name}?", "I wonder ______ our {thing}, {name}.", "if Grandma got", { thing: ["message", "letter", "photos", "postcard"], name: NAME }],
  // correct the mistake (5)
  [COR, "Do you know is the shop open on {day}, {name}?", "Do you know ______ open on {day}, {name}?", "if the shop is", { day: DAY, name: NAME }],
  [COR, "Can you tell me does this train stop in {city}, {name}?", "Can you tell me ______ in {city}, {name}?", "if this train stops", { city: ["Samarkand", "Bukhara", "Jizzakh", "Navoi"], name: NAME }],
  [COR, "I wonder if is she angry with me {when}, {name}.", "I wonder ______ angry with me {when}, {name}.", "if she is", { when: ["today", "now", "after the party", "this week"], name: NAME }],
  [COR, "Do you know if did they win the {match}, {name}?", "Do you know ______ the {match}, {name}?", "if they won", { match: ["match", "game", "final", "quiz"], name: NAME }],
  [COR, "I'm not sure if can I come {when}, {name}.", "I'm not sure ______ {when}, {name}.", "if I can come", { when: ["tomorrow", "on Friday", "tonight", "this weekend"], name: NAME }],
].map(([instr, source, hint, key, slots]) => {
  const acc = [...withWhether(key)];
  if (key === "if she is") acc.push("if she's", "whether she's");
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acc.length ? { acceptable: acc } : {}), why: WHY, slots: pick(source + hint, slots) };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a hotel worker politely if breakfast is free.", "Could you tell me if …?", ["exactly one question", "if + statement order", "no do / does after if"]],
  ["Ask a stranger politely if there is a bus stop near here.", "Do you know if there is …?", ["exactly one question", "if there is", "statement order"]],
  ["Write a sentence saying you are not sure if a friend is coming.", "I'm not sure if …", ["exactly one sentence", "if + statement order", "coming"]],
  ["Ask a shop worker politely if you can pay by card.", "Can you tell me if I can …?", ["exactly one question", "if I can", "statement order"]],
  ["Write a sentence about something you wonder about your exam result.", "I wonder if I …", ["exactly one sentence", "I wonder if", "a past verb"]],
  ["Ask a teacher politely if the lesson starts at nine.", "Do you know if the lesson …?", ["exactly one question", "if + statement order", "starts with -s"]],
  ["Ask a friend if they remember locking the door.", "Do you remember if you …?", ["exactly one question", "if you + past verb", "no did after if"]],
  ["Write two polite questions for a train station: one with if and one with whether.", "Do you know if … / Could you tell me whether …?", ["exactly two questions", "if and whether", "statement order in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are booking a room. Write a polite message with three questions for the hotel.", "Could you tell me if … / I'd like to know whether …", ["if or whether", "statement order", "three questions"]],
  ["You are new in a town. Write polite questions to ask someone in the street.", "Do you know if there is … near here?", ["if + statement order", "different verbs", "three or four questions"]],
  ["Write a message to a teacher asking about a test and homework.", "Could you tell me if the test is …?", ["if or whether", "no do / does after if", "three or four sentences"]],
  ["You are not sure about a friend's plans. Write what you wonder.", "I wonder if he … / I'm not sure whether …", ["if or whether", "statement order", "three or four sentences"]],
  ["Write polite questions to ask in a shop before you buy a phone.", "Can you tell me if it has … / Do you know whether …", ["if or whether", "statement order", "three or four questions"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/questions-negation.indirect-questions.embedded-if-whether.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);