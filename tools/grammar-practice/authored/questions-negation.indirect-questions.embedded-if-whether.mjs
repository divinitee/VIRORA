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
const CHOOSE = [
  [["if the bank is", "is the bank", "if is the bank", "does the bank"], "Do you know ______ open on {day}, {name}?", { day: ["Sundays", "Mondays", "holidays", "Navruz"], name: NAME }],
  [["if the train leaves", "does the train leave", "if does the train leave", "if the train leave"], "Can you tell me ______ at {time}, {name}?", { time: ["six", "seven", "noon", "eight"], name: NAME }],
  [["if my sister is", "is my sister", "if is my sister", "does my sister"], "I'm not sure ______ at home {when}, {name}.", { when: ["now", "today", "tonight", "this evening"], name: NAME }],
  [["if your teacher speaks", "does your teacher speak", "if does your teacher speak", "if your teacher speak"], "I'd like to know ______ Russian, {name}.", { name: NAME }],
  [["whether she got", "did she get", "whether did she get", "whether she get"], "I wonder ______ my letter, {name}.", { name: NAME }],
  [["if he is coming", "is he coming", "if is he coming", "does he coming"], "Could you ask him ______ to the {event}?", { event: ["party", "wedding", "concert", "meeting"] }],
  [["if your brother can", "can your brother", "if can your brother", "does your brother can"], "Do you know ______ swim, {name}?", { name: NAME }],
  [["if I passed", "did I pass", "if did I pass", "do I passed"], "I don't know ______ the {test} yet, {name}.", { test: ["exam", "test", "driving test", "interview"], name: NAME }],
  [["if there is a pharmacy", "is there a pharmacy", "if is there a pharmacy", "does there a pharmacy"], "Can you tell me ______ near here, {name}?", { name: NAME }],
  [["whether it will rain", "will it rain", "whether will it rain", "does it rain"], "Do you know ______ {when}, {name}?", { when: ["tomorrow", "tonight", "this weekend", "on Saturday"], name: NAME }],
  [["if the price includes", "does the price include", "if does the price include", "if the price include"], "I'd like to know ______ breakfast, {name}.", { name: NAME }],
  [["if the bus stops", "does the bus stop", "if does the bus stop", "if the bus stop"], "Ask the driver ______ at the {place}.", { place: ["bazaar", "museum", "hospital", "station"] }],
  [["whether I left", "did I leave", "whether did I leave", "whether I leaved"], "I'm not sure ______ my {thing} at home, {name}.", { thing: ["phone", "keys", "wallet", "passport"], name: NAME }],
  [["if your cousin is", "is your cousin", "if is your cousin", "does your cousin"], "Could you find out ______ married, {name}?", { name: NAME }],
  [["if there are", "are there", "if are there", "do there"], "Can you check ______ any seats left on the {vehicle}, {name}?", { vehicle: ["train", "bus", "plane", "night train"], name: NAME }],
  [["if the teacher has read", "has the teacher read", "if has the teacher read", "if the teacher have read"], "I wonder ______ my {work}, {name}.", { work: ["essay", "email", "story", "homework"], name: NAME }],
  [["if you locked", "did you lock", "if did you lock", "if you locking"], "Do you remember ______ the door, {name}?", { name: NAME }],
  [["if I can pay", "can I pay", "if can I pay", "if I can to pay"], "Could you tell me ______ by card, {name}?", { name: NAME }],
  [["whether they are coming", "are they coming", "whether are they coming", "whether they coming"], "We don't know ______ to the {event}.", { event: ["party", "wedding", "picnic", "dinner"] }],
  [["if your grandmother understands", "does your grandmother understand", "if does your grandmother understand", "if your grandmother understand"], "I'm not sure ______ English, {name}.", { name: NAME }],
].map(([opts, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: WHY, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Finish the polite question with the words from the question in brackets. Use statement order.";
const BUILD = [
  ["the bus stops", "(Does the bus stop here?) Can you tell me if ______ here, {name}?", { name: NAME }],
  ["the shop is", "(Is the shop open on {day}?) Do you know if ______ open on {day}?", { day: ["Sundays", "Mondays", "holidays", "Navruz"] }],
  ["Grandma called", "(Did Grandma call?) I wonder if ______, {name}.", { name: NAME }],
  ["your brother can drive", "(Can your brother drive?) Do you know if ______, {name}?", { name: NAME }],
  ["they are", "(Are they at home {when}?) I'm not sure if ______ at home {when}.", { when: ["now", "today", "tonight", "this evening"] }],
  ["your sister likes", "(Does your sister like {food}?) Do you know if ______ {food}?", { food: ["plov", "fish", "spicy food", "ice cream"] }],
  ["it is going", "(Is it going to rain?) I wonder if ______ to rain, {name}.", { name: NAME }],
  ["you locked", "(Did you lock the door?) Can you check if ______ the door, {name}?", { name: NAME }],
  ["the shop will be", "(Will the shop be open {when}?) Do you know if ______ open {when}?", { when: ["tomorrow", "on Sunday", "tonight", "after six"] }],
  ["the hotel has", "(Does the hotel have wifi?) Could you ask if ______ wifi, {name}?", { name: NAME }],
  ["the film has started", "(Has the film started?) Do you know if ______, {name}?", { name: NAME }],
  ["your cousin is coming", "(Is your cousin coming to the {event}?) I don't know if ______ to the {event}.", { event: ["party", "wedding", "concert", "picnic"] }],
  ["they sell", "(Do they sell {thing} here?) Can you ask if ______ {thing} here?", { thing: ["phone cards", "stamps", "bread", "tickets"] }],
  ["the teacher checked", "(Did the teacher check our tests?) I wonder if ______ our tests, {name}.", { name: NAME }],
  ["I can park", "(Can I park here?) Do you know if ______ here, {name}?", { name: NAME }],
  ["the exam was", "(Was the exam difficult?) Can you tell me if ______ difficult, {name}?", { name: NAME }],
  ["there are", "(Are there any tickets left?) Could you check if ______ any tickets left, {name}?", { name: NAME }],
  ["this bus goes", "(Does this bus go to the {place}?) Do you know if ______ to the {place}?", { place: ["bazaar", "airport", "station", "museum"] }],
  ["your parents enjoyed", "(Did your parents enjoy the trip?) I'd like to know if ______ the trip, {name}.", { name: NAME }],
  ["the museum is", "(Is the museum free on {day}?) Do you know if ______ free on {day}?", { day: ["Sundays", "Mondays", "holidays", "Fridays"] }],
].map(([key, source, slots]) => {
  const acc = [];
  if (/ is( |$)/.test(key)) acc.push(key.replace(/ is( |$)/, "'s$1"));
  if (/ has started$/.test(key)) acc.push(key.replace(" has started", "'s started"));
  if (key === "they are") acc.push("they're");
  if (key === "there are") acc.length = 0;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(acc.length ? { acceptable: acc } : {}), why: WHY, slots: pick(source, slots) };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POL = "Make it a polite question. Use if.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // present (5)
  [POL, "Is the bank open on {day}?", "Do you know ______ on {day}?", "if the bank is open", { day: ["Sundays", "Mondays", "holidays", "Navruz"] }],
  [POL, "Does your friend eat meat, {name}?", "Do you know ______, {name}?", "if your friend eats meat", { name: NAME }],
  [POL, "Is your sister at home {when}?", "I wonder ______ {when}.", "if your sister is at home", { when: ["now", "today", "tonight", "this evening"] }],
  [POL, "Do they live near here, {name}?", "Can you tell me ______, {name}?", "if they live near here", { name: NAME }],
  [POL, "Does the museum close at {time}?", "Could you tell me ______ at {time}?", "if the museum closes", { time: ["five", "six", "seven", "eight"] }],
  // past, modal, future, perfect (5)
  [POL, "Did you finish the homework, {name}?", "Can I ask ______, {name}?", "if you finished the homework", { name: NAME }],
  [POL, "Can we sit here, {name}?", "Do you know ______, {name}?", "if we can sit here", { name: NAME }],
  [POL, "Will the bus come soon, {name}?", "Do you know ______, {name}?", "if the bus will come soon", { name: NAME }],
  [POL, "Has the lesson started, {name}?", "Can you check ______, {name}?", "if the lesson has started", { name: NAME }],
  [POL, "Did Grandma get our message, {name}?", "I wonder ______, {name}.", "if Grandma got our message", { name: NAME }],
  // correct the mistake (5)
  [COR, "Do you know is the shop open, {name}?", "Do you know ______ open, {name}?", "if the shop is", { name: NAME }],
  [COR, "Can you tell me does this train stop in {city}?", "Can you tell me ______ in {city}?", "if this train stops", { city: ["Samarkand", "Bukhara", "Jizzakh", "Navoi"] }],
  [COR, "I wonder if is she angry with me, {name}.", "I wonder ______ angry with me, {name}.", "if she is", { name: NAME }],
  [COR, "Do you know if did they win the match, {name}?", "Do you know ______ the match, {name}?", "if they won", { name: NAME }],
  [COR, "I'm not sure if can I come {when}, {name}.", "I'm not sure ______ {when}, {name}.", "if I can come", { when: ["tomorrow", "on Friday", "tonight", "this weekend"], name: NAME }],
].map(([instr, source, hint, key, slots]) => {
  const acc = [...withWhether(key)];
  if (key === "if she is") acc.push("if she's", "whether she's");
  if (key === "if the lesson has started") acc.push("if the lesson's started", "whether the lesson's started");
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