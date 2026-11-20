// Hand-authored: pronouns / indefinite / nothing-anything (A2).
// Path fill P47 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: nothing with a positive verb, no double negative (There
// is ______ in my bag. I can't find my keys.: something / anything /
// nothing / anyone).
// Sibling scope: keys are ONLY nothing (positive verb: There's nothing, I
// ate nothing) and anything (negative verb: I didn't eat anything), about
// half each. someone / anyone is P45, offers P46, verb agreement P48.
// One right answer: every blank is a THING after a plain positive or
// negative verb. No questions, no can / imperative / if ("You can eat
// anything", "Ask me anything" are English), no nothing as a subject.
// Options: nothing key → nothing / anything / no one / anywhere;
// anything key → anything / nothing / anyone / anywhere ("didn't say
// nothing" is the Russian / Uzbek double negative: ничего не сказал,
// hech narsa demadi). something is never offered: "There's something in the
// fridge" can fit too many contexts.
// Build: "Write nothing or anything."; no source prints either word.
// Transform: 5 not … anything → nothing / 5 nothing → not … anything / 5
// correct the double negative or the positive anything.
//
// Run: node tools/grammar-practice/authored/pronouns.indefinite.nothing-anything.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "indefinite", topic: "nothing-anything", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const BOX = ["box", "bag", "fridge", "drawer"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const OPT = { nothing: ["nothing", "anything", "no one", "anywhere"], anything: ["anything", "nothing", "anyone", "anywhere"] };
const WHY = {
  nothing: "The verb is positive (is, ate, said), so use nothing for 'not one thing'.",
  anything: "The verb is already negative (n't, not), so use anything. Don't use nothing after not.",
};
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["nothing", "There is ______ in my bag, {name}. I can't find my keys.", { name: NAME }],
  ["anything", "I didn't buy ______ at the {place}, {name}. It was closed.", { place: ["bazaar", "shop", "market", "supermarket"], name: NAME }],
  ["nothing", "The {box} is empty, {name}. There's ______ in it.", { box: BOX, name: NAME }],
  ["anything", "{name} doesn't eat ______ in the morning. She just has {drink}.", { name: ["Lola", "Olga", "Madina", "Kamila"], drink: ["tea", "coffee", "water", "juice"] }],
  ["nothing", "I know ______ about {topic}, {name}. Can you help me?", { topic: ["cars", "computers", "football", "music"], name: NAME }],
  ["anything", "We didn't say ______ to {who} about the {thing}.", { who: ["Mum", "Dad", "Grandma", "the teacher"], thing: ["party", "present", "trip", "cake"] }],
  ["nothing", "He said ______ all evening, {name}. Is he OK?", { name: NAME }],
  ["anything", "I can't read ______ in this {place}, {name}. It's very dark.", { place: ["garage", "room", "tent", "corner"], name: NAME }],
  ["nothing", "The museum is free. It costs ______, {name}.", { name: NAME }],
  ["anything", "There isn't ______ in the {box}, {name}. We need to go shopping.", { box: ["fridge", "cupboard", "kitchen", "freezer"], name: NAME }],
  ["nothing", "I did ______ at the weekend, {name}. I just stayed at home.", { name: NAME }],
  ["anything", "{name} didn't do ______ in the {lesson} today.", { name: NAME, lesson: ["maths lesson", "English lesson", "art lesson", "history lesson"] }],
  ["nothing", "I ate ______ for {meal}, {name}. Now I'm very hungry.", { meal: ["breakfast", "lunch", "dinner", "two days"], name: NAME }],
  ["anything", "My {who} doesn't know ______ about phones.", { who: ["grandpa", "grandma", "uncle", "aunt"] }],
  ["nothing", "We found ______ in the {place}. The {thing} wasn't there.", { place: ["car", "garden", "classroom", "hall"], thing: ["phone", "key", "bag", "ticket"] }],
  ["anything", "I haven't got ______ to read on the {t}, {name}.", { t: ["train", "bus", "plane", "trip"], name: NAME }],
  ["nothing", "{name} has got ______ in her {thing}. It's empty.", { name: ["Lola", "Olga", "Madina", "Kamila"], thing: ["wallet", "purse", "pocket", "bag"] }],
  ["anything", "They didn't find ______ to eat in the {place}, {name}.", { place: ["forest", "old house", "garden", "cupboard"], name: NAME }],
  ["nothing", "There was ______ on TV last night, {name}, so I read a book.", { name: NAME }],
  ["anything", "Don't worry, {name}. I didn't break ______ in the {room}.", { name: NAME, room: ["kitchen", "living room", "bathroom", "bedroom"] }],
].map(([k, prompt, slots], i) => {
  const options = rot(OPT[k], i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: WHY[k], slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write nothing or anything.";
const BUILD = [
  ["nothing", "There's ______ in the {box}, {name}. Look!", { box: BOX, name: NAME }],
  ["anything", "I didn't hear ______ last night, {name}.", { name: NAME }],
  ["nothing", "{name} ate ______ at the {event}. He wasn't hungry.", { name: ["Aziz", "Timur", "Bobur", "Rustam"], event: ["party", "wedding", "picnic", "café"] }],
  ["anything", "We didn't buy ______ for {who}'s birthday yet.", { who: ["Mum", "Dad", "Grandma", "Grandpa"] }],
  ["nothing", "I have ______ to do this {when}, {name}. I'm bored.", { when: ["evening", "weekend", "afternoon", "morning"], name: NAME }],
  ["anything", "My little sister doesn't drink ______ with her {meal}.", { meal: ["lunch", "dinner", "breakfast", "plov"] }],
  ["nothing", "The concert was free. We paid ______, {name}.", { name: NAME }],
  ["anything", "{name} didn't tell me ______ about the {thing}.", { name: NAME, thing: ["test", "trip", "party", "new teacher"] }],
  ["nothing", "There was ______ in the {place} when we arrived, {name}.", { place: ["fridge", "box", "shop", "cupboard"], name: NAME }],
  ["anything", "I can't find ______ to wear for the {event}, {name}.", { event: ["wedding", "party", "concert", "exam"], name: NAME }],
  ["nothing", "We saw ______ in the {place}. It was too dark, {name}.", { place: ["forest", "garden", "sky", "yard"], name: NAME }],
  ["anything", "They didn't say ______ at the {event}, {name}.", { event: ["meeting", "lesson", "dinner", "party"], name: NAME }],
  ["nothing", "{name} knows ______ about {topic}.", { name: NAME, topic: ["cooking", "cars", "chess", "computers"] }],
  ["anything", "I haven't got ______ in my pocket, {name}.", { name: NAME }],
  ["nothing", "The {kid} said ______ to the teacher. He was afraid.", { kid: ["boy", "new boy", "little boy", "student"] }],
  ["anything", "We don't need ______ from the {place}, {name}.", { place: ["shop", "bazaar", "bakery", "chemist's"], name: NAME }],
  ["nothing", "I found ______ in my {thing}, {name}. Where's my ticket?", { thing: ["bag", "pocket", "jacket", "wallet"], name: NAME }],
  ["anything", "{name} doesn't want ______ for {meal} today.", { name: NAME, meal: ["breakfast", "lunch", "dinner", "dessert"] }],
  ["nothing", "This phone costs ______ with the new {plan}, {name}.", { plan: ["plan", "card", "offer", "contract"], name: NAME }],
  ["anything", "I didn't eat ______ on the {t}, {name}.", { t: ["train", "bus", "plane", "trip"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[key], slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POS = "Rewrite the sentence with nothing.";
const NEG = "Rewrite the sentence with not and anything.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // not … anything -> nothing (5)
  [POS, "There isn't anything in the {box}, {name}.", "There's ______ in the {box}, {name}.", "nothing", "isn't anything = is nothing.", { box: BOX, name: NAME }],
  [POS, "I didn't eat anything at the {event}, {name}.", "I ate ______ at the {event}, {name}.", "nothing", "didn't eat anything = ate nothing.", { event: ["party", "wedding", "picnic", "café"], name: NAME }],
  [POS, "{name} didn't say anything at the {event}.", "{name} said ______ at the {event}.", "nothing", "didn't say anything = said nothing.", { name: NAME, event: ["meeting", "lesson", "dinner", "party"] }],
  [POS, "We didn't find anything in the {place}, {name}.", "We found ______ in the {place}, {name}.", "nothing", "didn't find anything = found nothing.", { place: ["car", "garden", "classroom", "hall"], name: NAME }],
  [POS, "The {thing} doesn't cost anything, {name}.", "The {thing} costs ______, {name}.", "nothing", "doesn't cost anything = costs nothing.", { thing: ["museum", "concert", "lesson", "app"], name: NAME }],
  // nothing -> not … anything (5)
  [NEG, "There's nothing in the {box}, {name}.", "There ______ in the {box}, {name}.", "isn't anything", "is nothing = isn't anything.", { box: BOX, name: NAME }],
  [NEG, "I bought nothing at the {place}, {name}.", "I ______ at the {place}, {name}.", "didn't buy anything", "bought nothing = didn't buy anything.", { place: ["bazaar", "shop", "market", "mall"], name: NAME }],
  [NEG, "{name} knows nothing about {topic}.", "{name} ______ about {topic}.", "doesn't know anything", "knows nothing = doesn't know anything.", { name: NAME, topic: ["cars", "chess", "cooking", "music"] }],
  [NEG, "We heard nothing in the {place} last night.", "We ______ in the {place} last night.", "didn't hear anything", "heard nothing = didn't hear anything.", { place: ["yard", "street", "garden", "hall"], x: [] }],
  [NEG, "I've got nothing in my {thing}, {name}.", "I ______ in my {thing}, {name}.", "haven't got anything", "have got nothing = haven't got anything.", { thing: ["bag", "pocket", "wallet", "purse"], name: NAME }],
  // correct (5)
  [COR, "I didn't say nothing to {who}, {name}.", "I didn't say ______ to {who}, {name}.", "anything", WHY.anything, { who: ["Mum", "Dad", "the teacher", "Grandma"], name: NAME }],
  [COR, "{name} doesn't know nothing about the {thing}.", "{name} doesn't know ______ about the {thing}.", "anything", WHY.anything, { name: NAME, thing: ["test", "party", "trip", "plan"] }],
  [COR, "There isn't nothing in the {box}, {name}.", "There isn't ______ in the {box}, {name}.", "anything", WHY.anything, { box: BOX, name: NAME }],
  [COR, "I ate anything for {meal}, {name}. I wasn't hungry.", "I ate ______ for {meal}, {name}. I wasn't hungry.", "nothing", WHY.nothing, { meal: ["breakfast", "lunch", "dinner", "dessert"], name: NAME }],
  [COR, "There's anything in my bag, {name}. It's empty.", "There's ______ in my bag, {name}. It's empty.", "nothing", WHY.nothing, { name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: fix(slots, source + hint) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about an empty place with There's nothing.", "There's nothing in the …", ["exactly one sentence", "nothing", "a place word"]],
  ["Write one sentence about something you didn't do yesterday with anything.", "I didn't … anything.", ["exactly one sentence", "didn't", "anything"]],
  ["Write one sentence about a topic you know nothing about.", "I know nothing about …", ["exactly one sentence", "nothing", "a topic word"]],
  ["Write one sentence about a free thing with costs nothing.", "… costs nothing.", ["exactly one sentence", "costs nothing", "a thing word"]],
  ["Write one sentence about food you don't eat with anything.", "I don't eat anything …", ["exactly one sentence", "don't", "anything"]],
  ["You lost your keys. Write one sentence about your bag.", "There's nothing in my bag.", ["exactly one sentence", "nothing", "bag"]],
  ["Write one sentence about a quiet person who didn't say anything.", "He / She didn't say anything …", ["exactly one sentence", "didn't say anything", "a person word"]],
  ["Write two sentences with the same meaning: one with nothing and one with not … anything.", "I ate nothing. / I didn't eat anything.", ["exactly two sentences", "nothing once", "not … anything once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a boring day: you did nothing and you didn't see anything interesting.", "nothing / not … anything", ["nothing", "anything with not", "three or four sentences"]],
  ["You open the fridge and it's empty. Write a note to your family.", "There's nothing in the fridge. We haven't got anything …", ["nothing", "anything with n't", "three or four sentences"]],
  ["Write about a new hobby. At first you knew nothing about it.", "I knew nothing about … I didn't know anything …", ["nothing", "anything", "three or four sentences"]],
  ["Describe a trip where something went wrong: you lost your bag.", "There was nothing in … / I didn't have anything …", ["nothing", "anything", "three or four sentences"]],
  ["Write about free things to do in your town.", "It costs nothing. You don't need anything …", ["nothing", "anything with n't", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.indefinite.nothing-anything.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);