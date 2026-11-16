// Hand-authored: modals / deduction / might-possibility (A2).
// Path fill P39 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: might for possibility (It is possible that Anna ______
// come later: must / should / might / has to).
// Sibling scope: might / might not for a present or future possibility
// only. No may, no could for possibility, no must for deduction, no
// might have + past participle.
// One right answer: should is never offered ("I'm not sure, but it should be
// fine" is English), nor will ("I think it will rain"), nor can ("The bus
// can be late" is a general truth). Choose meaning items use subjects that
// cannot be obliged (the weather, a bus, a shop, how someone feels), plus a
// fixed "not sure" marker, so must / has to are wrong.
// Choose, three kinds: 10 might vs must / has to / mights; 6 might not vs
// don't might / might not to / not might; 4 might + base vs -s / to / -ing.
// Build: "Write might or might not." The advice in the sentence decides
// ("Take an umbrella. It ______ rain" → might; "Take a jacket. It ______ be
// warm" → might not). No source prints might elsewhere.
// Transform: 5 It's possible that … will → might / 5 Perhaps … won't →
// might not / 5 correct the mistake.
//
// Run: node tools/grammar-practice/authored/modals.deduction.might-possibility.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "deduction", topic: "might-possibility", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const WHEN = ["afternoon", "evening", "weekend", "morning"];
const TRANS = ["bus", "train", "plane", "tram"];
const SHOP = ["bank", "museum", "library", "post office"];
const DAY = ["Sunday", "Monday", "Saturday", "Friday"];
const FOOD = ["soup", "salad", "cake", "plov"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  a: "It is possible, but we are not sure, so use might.",
  b: "It is possible that it will not happen, so use might not (not don't might).",
  c: "After might and might not, use the base verb: might come, not might comes or might to come.",
  might: "The advice shows it is possible: might.",
  mightnt: "The advice shows it is possible that it will NOT happen: might not.",
};
const A = ["might", "must", "has to", "mights"];
const B = ["might not", "don't might", "might not to", "not might"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE_A = [
  ["I'm not sure, but it ______ rain this {when}, {name}.", { when: WHEN, name: NAME }],
  ["It's possible that the {t} ______ be late today, {name}.", { t: TRANS, name: NAME }],
  ["We don't know yet. It ______ snow in the {place} tonight, {name}.", { place: ["mountains", "village", "city", "countryside"], name: NAME }],
  ["Perhaps the {shop} ______ be closed on {day}.", { shop: SHOP, day: DAY }],
  ["Try the {food}, {name}. You ______ like it. I'm not sure.", { food: FOOD, name: NAME }],
  ["I'm not sure where {name} is. She ______ be at the {place}.", { name: SHE, place: ["library", "gym", "bazaar", "café"] }],
  ["It's possible that {name} ______ know the answer. Ask him, {who}.", { name: HE, who: ["Mum", "Dad", "Olga", "Lola"] }],
  ["We don't know yet. The {event} ______ be on {day}.", { event: ["concert", "match", "party", "exam"], day: DAY }],
  ["I'm not sure, but there ______ be a test {when}, {name}.", { when: ["tomorrow", "on Friday", "next week", "on Monday"], name: NAME }],
  ["It's possible that the {thing} ______ be in the car. Let's look, {name}.", { thing: ["keys", "phone", "bag", "umbrella"], name: NAME }],
];
const CHOOSE_B = [
  ["I ______ come to the {event} tonight, {name}. I'm very tired.", { event: ["party", "concert", "match", "cinema"], name: NAME }],
  ["Take a jacket. It ______ be warm in the {place}, {name}.", { place: ["mountains", "village", "countryside", "forest"], name: NAME }],
  ["{name} ______ know about the {thing}. Tell her, please.", { name: SHE, thing: ["test", "party", "meeting", "new plan"] }],
  ["We ______ have time for {meal}, {name}. The train leaves soon.", { meal: ["breakfast", "lunch", "coffee", "dinner"], name: NAME }],
  ["The {shop} ______ be open now, {name}. It's very late.", { shop: SHOP, name: NAME }],
  ["My {who} ______ like this {thing}. He likes different colours.", { who: ["dad", "brother", "grandpa", "uncle"], thing: ["shirt", "scarf", "hat", "bag"] }],
];
const CHOOSE_C = [
  [["go", "goes", "to go", "going"], "{name} might ______ to the {event} later.", { name: SHE, event: ["party", "concert", "match", "wedding"] }],
  [["rain", "rains", "to rain", "raining"], "It might ______ this {when}, {name}.", { when: WHEN, name: NAME }],
  [["catch", "catches", "to catch", "catching"], "He might not ______ the {t}, {name}.", { t: TRANS, name: NAME }],
  [["move", "moves", "to move", "moving"], "We might ______ to {city} next {when}.", { city: CITY, when: ["year", "summer", "spring", "month"] }],
];
const CHOOSE = [
  ...CHOOSE_A.map(([p, s]) => [A, "a", p, s]),
  ...CHOOSE_B.map(([p, s]) => [B, "b", p, s]),
  ...CHOOSE_C.map(([o, p, s]) => [o, "c", p, s]),
].map(([base, w, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[w], slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write might or might not.";
const BUILD = [
  // might (10)
  ["might", "Take an umbrella, {name}. It ______ rain this {when}.", { name: NAME, when: WHEN }],
  ["might", "Call the {shop} first, {name}. It ______ be closed on {day}.", { shop: SHOP, name: NAME, day: DAY }],
  ["might", "Let's ask {name}. He ______ know the answer, {who}.", { name: HE, who: ["Mum", "Dad", "Olga", "Lola"] }],
  ["might", "Try this {food}, {name}. You ______ like it.", { food: FOOD, name: NAME }],
  ["might", "Wait a few minutes, {name}. The {t} ______ come soon.", { name: NAME, t: TRANS }],
  ["might", "Look in your bag, {name}. Your {thing} ______ be there.", { name: NAME, thing: ["phone", "key", "ticket", "pen"] }],
  ["might", "Buy some extra {food}, {who}. Our cousins ______ come for dinner.", { food: ["bread", "fruit", "juice", "tea"], who: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["might", "Don't go far, {name}. It ______ snow this {when}.", { name: NAME, when: WHEN }],
  ["might", "Study tonight, {name}. There ______ be a test {when}.", { name: NAME, when: ["tomorrow", "on Friday", "next week", "on Monday"] }],
  ["might", "Take some money, {name}. You ______ want a {thing} at the {place}.", { name: NAME, thing: ["drink", "snack", "sandwich", "coffee"], place: ["zoo", "park", "cinema", "stadium"] }],
  // might not (10)
  ["might not", "Don't wait for me, {name}. I ______ come to the {event}.", { name: NAME, event: ["party", "concert", "match", "cinema"] }],
  ["might not", "Take a jacket, {name}. It ______ be warm in the {place} tonight.", { name: NAME, place: ["mountains", "village", "countryside", "forest"] }],
  ["might not", "Tell {name} about the {thing}. She ______ know about it.", { name: SHE, thing: ["test", "party", "meeting", "new plan"] }],
  ["might not", "Let's eat now, {name}. We ______ have time {when}.", { name: NAME, when: ["later", "this evening", "after the lesson", "at the station"] }],
  ["might not", "Phone the {shop} first, {name}. It ______ be open now. It's very late.", { shop: SHOP, name: NAME }],
  ["might not", "Buy a different {thing}, {name}. Your {who} ______ like this colour.", { thing: ["shirt", "scarf", "hat", "bag"], name: NAME, who: ["dad", "brother", "grandpa", "uncle"] }],
  ["might not", "Bring your own {food}, {name}. There ______ be any at the {event}.", { food: ["water", "bread", "fruit", "juice"], name: NAME, event: ["picnic", "match", "concert", "meeting"] }],
  ["might not", "Don't buy the tickets yet, {name}. We ______ go to {city} this {when}.", { name: NAME, city: CITY, when: ["summer", "weekend", "month", "spring"] }],
  ["might not", "Have a plan B, {name}. The weather ______ be good on {day}.", { name: NAME, day: DAY }],
  ["might not", "Write it down, {name}. You ______ remember it {when}.", { name: NAME, when: ["tomorrow", "next week", "later", "in the morning"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "might" ? W.might : W.mightnt, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POS = "Rewrite the sentence with might.";
const NEG = "Rewrite the sentence with might not.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // It's possible that … will -> might (5)
  [POS, "It's possible that it will rain this {when}, {name}.", "It ______ rain this {when}, {name}.", "might", "It's possible that … will = might.", { when: WHEN, name: NAME }],
  [POS, "It's possible that the {t} will be late, {name}.", "The {t} ______ be late, {name}.", "might", "It's possible that … will = might.", { t: TRANS, name: NAME }],
  [POS, "Perhaps {name} will come to the {event}.", "{name} ______ come to the {event}.", "might", "Perhaps … will = might.", { name: NAME, event: ["party", "match", "concert", "wedding"] }],
  [POS, "Maybe we will go to {city} next {when}.", "We ______ go to {city} next {when}.", "might", "Maybe … will = might.", { city: CITY, when: ["year", "summer", "spring", "month"] }],
  [POS, "It's possible that the {shop} is closed today, {name}.", "The {shop} ______ be closed today, {name}.", "might", "It's possible that … is = might be.", { shop: SHOP, name: NAME }],
  // Perhaps … won't -> might not (5)
  [NEG, "Perhaps {name} won't come to the {event}.", "{name} ______ come to the {event}.", "might not", "Perhaps … won't = might not.", { name: NAME, event: ["party", "match", "concert", "wedding"] }],
  [NEG, "Maybe it won't be sunny on {day}, {name}.", "It ______ be sunny on {day}, {name}.", "might not", "Maybe … won't = might not.", { day: DAY, name: NAME }],
  [NEG, "It's possible that my {who} won't like the {thing}.", "My {who} ______ like the {thing}.", "might not", "It's possible that … won't = might not.", { who: ["dad", "brother", "grandpa", "uncle"], thing: ["film", "food", "music", "game"] }],
  [NEG, "Perhaps we won't have time for {meal}, {name}.", "We ______ have time for {meal}, {name}.", "might not", "Perhaps … won't = might not.", { meal: ["breakfast", "lunch", "coffee", "dinner"], name: NAME }],
  [NEG, "Maybe the {shop} isn't open now, {name}.", "The {shop} ______ be open now, {name}.", "might not", "Maybe … isn't = might not be.", { shop: SHOP, name: NAME }],
  // correct the mistake (5)
  [COR, "{name} might comes to the {event}.", "{name} ______ to the {event}.", "might come", "might + base verb: might come, not might comes.", { name: NAME, event: ["party", "match", "concert", "wedding"] }],
  [COR, "It don't might rain this {when}, {name}.", "It ______ rain this {when}, {name}.", "might not", "The negative is might not, not don't might.", { when: WHEN, name: NAME }],
  [COR, "We might to visit {city} next {when}.", "We ______ {city} next {when}.", "might visit", "No to after might: might visit.", { city: CITY, when: ["year", "summer", "spring", "month"] }],
  [COR, "The {t} mights be late, {name}.", "The {t} ______ be late, {name}.", "might", "Might never takes -s: he might, it might.", { t: TRANS, name: NAME }],
  [COR, "You might not to like the {food}, {name}.", "You ______ like the {food}, {name}.", "might not", "No to after might not: might not like.", { food: FOOD, name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one thing you might do this weekend.", "I might + base verb", ["exactly one sentence", "might", "this weekend"]],
  ["Write one sentence about the weather tomorrow with might.", "It might …", ["exactly one sentence", "might", "a weather word"]],
  ["Write one thing you might not do tonight, and why.", "I might not … because …", ["exactly one sentence", "might not", "a reason"]],
  ["Write one place you might visit next summer.", "I might go to / visit …", ["exactly one sentence", "might", "a place name"]],
  ["A friend is late. Write one possible reason with might.", "He / She might …", ["exactly one sentence", "might", "a person word"]],
  ["Write one piece of advice with might: Take … You might …", "You might need …", ["exactly two short sentences", "might", "a thing word"]],
  ["Write one sentence about a job you might do in the future.", "I might be a …", ["exactly one sentence", "might be", "a job word"]],
  ["Write two sentences about next year: one thing you might do and one thing you might not do.", "might / might not", ["exactly two sentences", "might once", "might not once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about your plans for the summer holidays. You are not sure yet.", "I might … / I might not …", ["might", "might not", "three or four sentences"]],
  ["A friend wants to go to the mountains this weekend. Give advice about the weather.", "It might … Take …", ["might twice", "a weather word", "three or four sentences"]],
  ["Write a message to a friend: you are not sure you can come to the party.", "I might not … / I might …", ["might not", "a reason", "three or four sentences"]],
  ["Write about your future: jobs, cities and things you might do.", "I might …", ["might", "a job or place word", "three or four sentences"]],
  ["Your teacher is not at school today. Write three possible reasons.", "She / He might …", ["might three times", "a reason", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.deduction.might-possibility.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);