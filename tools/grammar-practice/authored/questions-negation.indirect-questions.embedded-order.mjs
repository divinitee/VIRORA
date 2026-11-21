// Hand-authored: questions-negation / indirect-questions / embedded-order (B1).
// Wave C, C9 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement foci: statement order and no do / does / did inside an indirect
// WH-question ("Could you tell me where she lives?"), and producing one.
// Sibling embedded-if-whether (C8) does yes/no questions with if; every key
// here starts with a wh-word (where, what time, how much, why, who …).
// Choose: options are [wh + statement order, wh + question order, wh + a
// broken do/does form, wh + an inverted or emphatic order]. One item is a
// subject question ("Tell me what happened"), where direct and embedded order
// are the same and "what did happen" is the wrong one.
// Build: the wh-word and subject are printed; the learner types the verb in
// brackets (no do / does / did). Every item has a time cue; timetable items
// also accept "will + verb".
// Transform: 5 present → embedded / 5 past, modal, future → embedded /
// 5 correct the question order.
//
// Run: node tools/grammar-practice/authored/questions-negation.indirect-questions.embedded-order.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "indirect-questions", topic: "embedded-order", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const PLACE = ["museum", "bazaar", "station", "old town"];
const EVENT = ["party", "wedding", "meeting", "concert"];
const PAST = ["yesterday", "last night", "on Friday", "after school"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const WHY = "Inside another question or sentence, a wh-question uses statement order: wh-word + subject + verb. No do / does / did and no question order.";
const WHY_SUBJ = "Here the wh-word is the subject, so the order is already wh-word + verb: what happened. No did.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [["where the station is", "where is the station", "where does the station is", "the station where is"], "Can you tell me ______, {name}? I'm near the {place}.", { name: NAME, place: PLACE }],
  [["how much a ticket costs", "how much does a ticket cost", "how much costs a ticket", "how much a ticket does cost"], "Do you know ______ to {city}, {name}?", { city: CITY, name: NAME }],
  [["what time the film starts", "what time does the film start", "what time starts the film", "what time the film does start"], "I don't know ______, {name}. I forgot to ask {who}.", { name: NAME, who: ["Dad", "Mum", "my sister", "the teacher"] }],
  [["where you were", "where were you", "where did you be", "where you did be"], "Could you tell me ______ {when}, {name}?", { when: PAST, name: NAME }],
  [["why she left", "why did she leave", "why she did leave", "why left she"], "I wonder ______ the {event} so early, {name}.", { event: EVENT, name: NAME }],
  [["what his number is", "what is his number", "what does his number", "his number what is"], "Do you remember ______, {name}? I need to call him {when}.", { name: NAME, when: ["today", "tonight", "now", "later"] }],
  [["how I get to", "how do I get to", "how get I to", "how I do get to"], "Can you tell me ______ the {place}, {name}?", { place: PLACE, name: NAME }],
  [["what we are doing", "what are we doing", "what do we doing", "what we do doing"], "I'm not sure ______ {when}, {name}.", { when: ["tomorrow", "this weekend", "on Friday", "tonight"], name: NAME }],
  [["where your uncle lives", "where does your uncle live", "where lives your uncle", "where your uncle does live"], "Do you know ______ in {city}, {name}?", { city: CITY, name: NAME }],
  [["what happened", "what did happen", "what happened did", "what did it happen"], "Tell me ______, {name}. I want to know everything about the {thing}.", { name: NAME, thing: ["trip", "match", "party", "test"] }, WHY_SUBJ],
  [["when you bought", "when did you buy", "when bought you", "when you did buy"], "Could you tell me ______ the {thing}, {name}?", { thing: ["phone", "bike", "car", "tickets"], name: NAME }],
  [["how old she is", "how old is she", "how old does she", "how she old is"], "I have no idea ______, {name}. Let's ask {who}.", { name: NAME, who: ["her mum", "the teacher", "Dad", "her friend"] }],
  [["who he is coming with", "who is he coming with", "who does he coming with", "who he coming with"], "Can you ask him ______ to the {event}, {name}?", { event: EVENT, name: NAME }],
  [["how long the trip takes", "how long does the trip take", "how long takes the trip", "how long the trip does take"], "Do you know ______ by {transport}, {name}?", { transport: ["bus", "train", "car", "plane"], name: NAME }],
  [["where you put", "where did you put", "where put you", "where you did put"], "Please tell me ______ the {thing}, {name}.", { thing: ["keys", "remote", "tickets", "passport"], name: NAME }],
  [["what the teacher said", "what did the teacher say", "what said the teacher", "what the teacher did say"], "I can't remember ______ {when}, {name}.", { when: ["in class", "yesterday", "on Monday", "this morning"], name: NAME }],
  [["how often she eats", "how often does she eat", "how often eats she", "how often she does eat"], "Can you find out ______ {food}, {name}?", { food: ["meat", "fish", "sweets", "fruit"], name: NAME }],
  [["why your brother is", "why is your brother", "why does your brother", "why your brother does"], "Could you explain ______ so sad {when}, {name}?", { when: ["today", "this week", "now", "these days"], name: NAME }],
  [["what we are having", "what are we having", "what do we having", "what we having"], "I'd like to know ______ for {meal}, {name}.", { meal: ["lunch", "dinner", "breakfast", "the party"], name: NAME }],
  [["what time the bank is", "what time is the bank", "what time does the bank", "what time the bank does"], "Can you tell me ______ open on {day}, {name}?", { day: ["Saturday", "Sunday", "Friday", "holidays"], name: NAME }],
].map(([opts, prompt, slots, why], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: why || WHY, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets in the right form. Use statement order: no do / does / did.";
const BUILD = [
  ["is", "Can you tell me where the station ______ (be), {name}? I'm near the {place}.", { name: NAME, place: PLACE }],
  ["costs", "Do you know how much a ticket to {city} ______ (cost) {when}?", { city: CITY, when: ["now", "these days", "today", "this month"] }],
  ["starts", "I don't know what time the film ______ (start) {when}, {name}.", { when: ["every evening", "on weekdays", "on Sundays", "every night"], name: NAME }],
  ["were", "Could you tell me where you ______ (be) {when}, {name}?", { when: PAST, name: NAME }],
  ["left", "I wonder why she ______ (leave) the {event} so early yesterday, {name}.", { event: EVENT, name: NAME }],
  ["lives", "Do you know which street your uncle ______ (live) on in {city}, {name}?", { city: CITY, name: NAME }],
  ["takes", "Can you tell me how long the trip ______ (take) by {transport}, {name}?", { transport: ["bus", "train", "car", "plane"], name: NAME }, ["will take"]],
  ["put", "Please tell me where you ______ (put) the {thing} last night, {name}.", { thing: ["keys", "remote", "tickets", "passport"], name: NAME }],
  ["said", "I can't remember what the teacher ______ (say) {when}, {name}.", { when: ["yesterday", "on Monday", "this morning", "last week"], name: NAME }],
  ["goes", "Do you know how often she ______ (go) to the {place} these days, {name}?", { place: ["gym", "library", "bazaar", "pool"], name: NAME }],
  ["is", "Could you explain why your brother ______ (be) so quiet {when}, {name}?", { when: ["today", "this week", "these days", "now"], name: NAME }],
  ["closes", "I'd like to know what time the {shop} ______ (close) every day, {name}.", { shop: ["bakery", "pharmacy", "bank", "post office"], name: NAME }],
  ["bought", "Ask him where he ______ (buy) his {thing} last year, {name}.", { thing: ["bike", "guitar", "car", "watch"], name: NAME }],
  ["is", "I have no idea how old {who} ______ (be) now, {name}.", { who: ["your grandmother", "our teacher", "that tree", "this house"], name: NAME }],
  ["leaves", "I need to know when the next bus ______ (leave) for {city}, {name}.", { city: CITY, name: NAME }, ["will leave"]],
  ["means", "Can you tell me what this word ______ (mean) in {lang}, {name}?", { lang: ["Russian", "Uzbek", "Turkish", "Korean"], name: NAME }],
  ["won", "I'm not sure who ______ (win) the match {when}, {name}.", { when: ["yesterday", "last night", "on Sunday", "last week"], name: NAME }],
  ["came", "Could you tell me how many people ______ (come) to the {event} last {day}?", { event: EVENT, day: ["week", "Saturday", "month", "Friday"] }],
  ["did", "Tell me what you ______ (do) {when}, {name}.", { when: PAST, name: NAME }],
  ["parked", "Do you remember where we ______ (park) the car {when}, {name}?", { when: ["this morning", "yesterday", "last night", "on Sunday"], name: NAME }],
].map(([key, source, slots, acceptable]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(acceptable ? { acceptable } : {}), why: /who ______|how many people/.test(source) ? "The wh-word is the subject here, so the verb comes straight after it, in statement form." : WHY, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POL = "Make it a polite question. Use statement order.";
const COR = "Correct the word order.";
const TRANSFORM = [
  // present (5)
  [POL, "Where does she live in {city}, {name}?", "Could you tell me where ______ in {city}, {name}?", "she lives", { city: CITY, name: NAME }],
  [POL, "What time does it open on {day}, {name}?", "Do you know what time ______ on {day}, {name}?", "it opens", { day: ["Saturday", "Sunday", "Friday", "holidays"], name: NAME }],
  [POL, "How much are they at the {shop}, {name}?", "Can you tell me how much ______ at the {shop}, {name}?", "they are", { shop: ["bazaar", "shop", "market", "mall"], name: NAME }, ["they're"]],
  [POL, "Where is the toilet in this {place}, {name}?", "Could you tell me where ______ in this {place}, {name}?", "the toilet is", { place: ["café", "hotel", "museum", "station"], name: NAME }],
  [POL, "Why is he so angry {when}, {name}?", "Do you know why ______ so angry {when}, {name}?", "he is", { when: ["today", "now", "this week", "these days"], name: NAME }, ["he's"]],
  // past, modal, future (5)
  [POL, "Where did you buy your {thing}, {name}?", "Can I ask where ______ your {thing}, {name}?", "you bought", { thing: ["bag", "shoes", "jacket", "phone"], name: NAME }],
  [POL, "What did the doctor say {when}, {name}?", "Can you tell me what ______ {when}, {name}?", "the doctor said", { when: PAST, name: NAME }],
  [POL, "How can I get to the {place}, {name}?", "Could you tell me how ______ to the {place}, {name}?", "I can get", { place: PLACE, name: NAME }],
  [POL, "When will they arrive in {city}, {name}?", "Do you know when ______ in {city}, {name}?", "they will arrive", { city: CITY, name: NAME }, ["they'll arrive"]],
  [POL, "Who did you meet at the {event}, {name}?", "Tell me who ______ at the {event}, {name}.", "you met", { event: EVENT, name: NAME }],
  // correct the mistake (5)
  [COR, "Can you tell me where is it, {name}? I can't see the {place}.", "Can you tell me where ______, {name}? I can't see the {place}.", "it is", { name: NAME, place: PLACE }],
  [COR, "Do you know what time does the lesson start {when}, {name}?", "Do you know what time ______ {when}, {name}?", "the lesson starts", { when: ["today", "on Monday", "tomorrow", "on Fridays"], name: NAME }],
  [COR, "Can you remember where did I put my {thing}, {name}?", "Can you remember where ______ my {thing}, {name}?", "I put", { thing: ["keys", "phone", "glasses", "wallet"], name: NAME }],
  [COR, "Could you tell me how much costs the ticket to {city}, {name}?", "Could you tell me how much ______ to {city}, {name}?", "the ticket costs", { city: CITY, name: NAME }],
  [COR, "I wonder why was she late {when}, {name}.", "I wonder why ______ late {when}, {name}.", "she was", { when: PAST, name: NAME }],
].map(([instr, source, hint, key, slots, acceptable]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable ? { acceptable } : {}), why: WHY, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a stranger politely where the nearest bus stop is.", "Could you tell me where … is?", ["exactly one question", "where + subject + is", "no question order after where"]],
  ["Ask a shop worker politely how much something costs.", "Can you tell me how much … costs?", ["exactly one question", "how much + subject + verb", "no does"]],
  ["Ask a friend politely what time the match starts.", "Do you know what time … starts?", ["exactly one question", "what time + subject + verb", "no does"]],
  ["Write a sentence saying you don't know where a friend lives.", "I don't know where … lives.", ["exactly one sentence", "where + subject + verb", "lives with -s"]],
  ["Write a sentence saying you can't remember what you did last weekend.", "I can't remember what I did …", ["exactly one sentence", "what + subject + past verb", "no did after what"]],
  ["Ask a teacher politely why a lesson is cancelled.", "Could you tell me why … is …?", ["exactly one question", "why + subject + is", "statement order"]],
  ["Ask a hotel worker politely how you can get to the old town.", "Could you tell me how I can get to …?", ["exactly one question", "how + I + can", "statement order"]],
  ["Write two polite questions for a new classmate: one with where and one with what.", "Can I ask where you … / Do you know what …?", ["exactly two questions", "two different wh-words", "statement order in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are a tourist in a new city. Write polite questions to ask at the hotel desk.", "Could you tell me where … is / how much … costs?", ["wh-word + statement order", "different wh-words", "three or four questions"]],
  ["Write a message to a friend who missed a class: say what you don't know about the homework and ask them to find out.", "I don't know what … / Can you ask when …?", ["wh-word + statement order", "no do / does inside", "three or four sentences"]],
  ["You lost your bag. Write what you can't remember and ask a worker for help.", "I can't remember where I … / Do you know where …?", ["wh-word + statement order", "past verbs", "three or four sentences"]],
  ["Write polite questions to ask a doctor or nurse.", "Could you tell me how often I … / why …?", ["wh-word + statement order", "different wh-words", "three or four questions"]],
  ["You are planning a trip with your class. Write what you need to find out.", "We need to know how much … costs / when … leaves.", ["wh-word + statement order", "no question order inside", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/questions-negation.indirect-questions.embedded-order.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);