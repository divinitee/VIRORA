// Hand-authored: nouns-articles / quantifiers / some-offer (A1).
//
// Tests ONE point: some (not any) in offers and requests, even though they
// are questions: Would you like some tea? Can I have some water?
//
// "Would you like any ...?" is not wrong in natural English, so any is never
// a distractor after "Would you like". Offer distractors: a, many, a few
// (all wrong before an uncountable noun). Request frames ("Can I have ___,
// please?", "Could you give me ___?") use any as a distractor: a learner who
// over-applies "questions take any" says it, and a native speaker does not.
// Every noun is uncountable and never takes "a" in an order (no tea, coffee,
// water, juice, salad, cake, soup).
// Build/transform keys are typed some or any; instr lists both (rule 3).
// Build mixes negatives (any) so the answer is not always some.
//
// Run: node tools/grammar-practice/authored/nouns-articles.quantifiers.some-offer.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "quantifiers", topic: "some-offer", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const WO = "This is an offer. Offers use some, even in a question.";
const WR = "This is a request (you ask for something). Requests use some, even in a question.";
const WN = "The sentence is negative (not), so use any.";
const O = ["some", "a", "many", "a few"];
const R = ["some", "any", "a", "many"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O, WO, "Would you like ______ bread with your {food}, {name}?", { food: ["soup", "salad", "eggs", "dinner"], name: NAME }],
  [O, WO, "Would you like ______ honey for your {food}, {name}?", { food: ["tea", "bread", "pancakes", "porridge"], name: NAME }],
  [O, WO, "Would you like ______ rice with the {food}, {name}?", { food: ["chicken", "fish", "vegetables", "beans"], name: NAME }],
  [O, WO, "Would you like ______ help with your {thing}, {name}?", { thing: ["bags", "homework", "phone", "project"], name: NAME }],
  [O, WO, "Would you like ______ jam on your {food}, {name}?", { food: ["bread", "pancakes", "toast", "bun"], name: NAME }],
  [O, WO, "Would you like ______ plov before the {event}, {name}?", { event: ["match", "film", "trip", "lesson"], name: NAME }],
  [O, WO, "Would you like ______ cheese from {city}, {name}?", { city: CITY, name: NAME }],
  [O, WO, "Would you like ______ fruit after the {event}, {name}?", { event: ["game", "lesson", "walk", "run"], name: NAME }],
  [O, WO, "Would you like ______ ice cream in the {place}, {name}?", { place: ["park", "garden", "car", "yard"], name: NAME }],
  [O, WO, "Would you like ______ meat with your {food}, {name}?", { food: ["rice", "potatoes", "salad", "bread"], name: NAME }],
  [O, WO, "Would you like ______ sugar in your {drink}, {name}?", { drink: ["tea", "coffee", "milk", "cup"], name: NAME }],
  [O, WO, "Would you like ______ butter for the {food}, {name}?", { food: ["bread", "pancakes", "potatoes", "rice"], name: NAME }],
  [R, WR, "Can I have ______ bread, please, {name}? I'm very {adj}.", { name: NAME, adj: ["hungry", "hungry today", "hungry after school", "hungry after football"] }],
  [R, WR, "Can I have ______ rice with my {food}, please?", { food: ["chicken", "fish", "vegetables", "meat"] }],
  [R, WR, "Could you give me ______ paper for the {subject} test, please?", { subject: ["maths", "English", "history", "science"] }],
  [R, WR, "Can we have ______ cheese for the {event}, please, {name}?", { event: ["picnic", "party", "trip", "breakfast"], name: NAME }],
  [R, WR, "Could you give {who} ______ help with the {thing}, please?", { who: ["me", "us", "my sister", "Grandma"], thing: ["bags", "boxes", "table", "homework"] }],
  [R, WR, "Can I have ______ honey for my {drink}, please?", { drink: ["tea", "milk", "cup of tea", "green tea"] }],
  [R, WR, "Could you buy ______ meat at the {shop}, please, {name}?", { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  [R, WR, "Can I have ______ jam for my {food}, please, {name}?", { food: ["bread", "toast", "pancakes", "bun"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write some or any.";
const BUILD = [
  ["some", WR, "Can I have ______ bread with my {food}, please?", { food: ["soup", "salad", "eggs", "plov"] }],
  ["any", WN, "We don't have ______ honey at home, {name}.", { name: NAME }],
  ["some", WR, "Could you bring ______ chairs to the {place}, please, {name}?", { place: ["kitchen", "garden", "yard", "classroom"], name: NAME }],
  ["some", WR, "Can we have ______ rice for the {meal}, please?", { meal: ["guests", "kids", "picnic", "party"] }],
  ["any", WN, "There isn't ______ cheese in the {place}, {name}.", { place: ["fridge", "kitchen", "bag", "box"], name: NAME }],
  ["some", WR, "Could you give me ______ paper, please? I need it for {subject}.", { subject: ["maths", "art", "English", "science"] }],
  ["some", WR, "Can I have ______ grapes from the {place}, please, {name}?", { place: ["garden", "bowl", "table", "basket"], name: NAME }],
  ["any", WN, "{name} doesn't eat ______ meat on {day}.", { name: NAME, day: ["Monday", "Wednesday", "Friday", "weekdays"] }],
  ["some", WR, "Could you buy ______ eggs at the {shop}, please, {name}?", { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  ["some", WR, "Can I borrow ______ pens for the {event}, please?", { event: ["test", "exam", "lesson", "meeting"] }],
  ["any", WN, "There aren't ______ apples in the {place}, {name}.", { place: ["bag", "box", "fridge", "basket"], name: NAME }],
  ["some", WR, "Could you get ______ butter from the {place}, please, {name}?", { place: ["fridge", "kitchen", "shop", "market"], name: NAME }],
  ["some", WR, "Can we have ______ help with the {thing}, please?", { thing: ["bags", "boxes", "tables", "homework"] }],
  ["any", WN, "I don't want ______ sugar in my {drink}, {name}.", { drink: ["tea", "coffee", "milk", "cup"], name: NAME }],
  ["some", WR, "Could you give us ______ tips for the {event}, please?", { event: ["exam", "trip", "interview", "match"] }],
  ["some", WR, "Can I have ______ ice cream after {meal}, please, Mum?", { meal: ["lunch", "dinner", "the lesson", "football"] }],
  ["any", WN, "We didn't buy ______ fruit in {city}, {name}.", { city: CITY, name: NAME }],
  ["some", WR, "Could you bring ______ plates for the {event}, please, {name}?", { event: ["party", "picnic", "dinner", "guests"], name: NAME }],
  ["some", WR, "Can I take ______ photos of your {thing}, please?", { thing: ["garden", "house", "cat", "dog"] }],
  ["any", WN, "There isn't ______ jam for the {food}, {name}.", { food: ["bread", "pancakes", "toast", "buns"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_OFF = "You have it. Offer it to your friend. Write some or any.";
const T_FIX = "The request has a mistake. Complete the correct request. Write some or any.";
const T_ASK = "You want it. Ask for it politely. Write some or any.";
const TRANSFORM = [
  [T_OFF, "I have some bread from {city}.", "Would you like ______ bread, {name}?", "some", WO, { city: CITY, name: NAME }],
  [T_OFF, "There is some rice in the {place}.", "Would you like ______ rice, {name}?", "some", WO, { place: ["pot", "kitchen", "bowl", "fridge"], name: NAME }],
  [T_OFF, "I have some honey from my {person}'s garden.", "Would you like ______ honey, {name}?", "some", WO, { person: ["grandfather", "uncle", "aunt", "neighbour"], name: NAME }],
  [T_OFF, "We have some fruit from the {shop}.", "Would you like ______ fruit, {name}?", "some", WO, { shop: ["market", "bazaar", "shop", "garden"], name: NAME }],
  [T_OFF, "I can help with your {thing}.", "Would you like ______ help with your {thing}, {name}?", "some", WO, { thing: ["bags", "homework", "phone", "project"], name: NAME }],
  [T_FIX, "Can I have any bread, please, {name}?", "Can I have ______ bread, please, {name}?", "some", WR, { name: NAME }],
  [T_FIX, "Could you give me any paper for the {subject} lesson, please?", "Could you give me ______ paper for the {subject} lesson, please?", "some", WR, { subject: ["maths", "art", "English", "science"] }],
  [T_FIX, "Can we have any rice with the {food}, please?", "Can we have ______ rice with the {food}, please?", "some", WR, { food: ["chicken", "fish", "vegetables", "meat"] }],
  [T_FIX, "Could you buy any eggs at the {shop}, please, {name}?", "Could you buy ______ eggs at the {shop}, please, {name}?", "some", WR, { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  [T_FIX, "Can I have any cheese for my {food}, please?", "Can I have ______ cheese for my {food}, please?", "some", WR, { food: ["bread", "salad", "pasta", "sandwich"] }],
  [T_ASK, "I want some jam for my {food}.", "Can I have ______ jam for my {food}, please?", "some", WR, { food: ["bread", "toast", "pancakes", "bun"] }],
  [T_ASK, "I need some help with the {thing}.", "Could you give me ______ help with the {thing}, please?", "some", WR, { thing: ["bags", "boxes", "table", "homework"] }],
  [T_ASK, "We want some meat for the {event}.", "Can we have ______ meat for the {event}, please?", "some", WR, { event: ["party", "picnic", "guests", "dinner"] }],
  [T_ASK, "I need some butter for the {food}, {name}.", "Can I have ______ butter for the {food}, please, {name}?", "some", WR, { food: ["bread", "pancakes", "potatoes", "rice"], name: NAME }],
  [T_ASK, "I want some ice cream after {meal}, Mum.", "Can I have ______ ice cream after {meal}, please, Mum?", "some", WR, { meal: ["lunch", "dinner", "the lesson", "football"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["A guest is at your home. Offer them some food. Write one question.", "Would you like some", ["exactly one question", "must use Would you like some"]],
  ["You are in a café. Ask for something. Write one question.", "Can I have some", ["exactly one question", "must use Can I have some", "must use please"]],
  ["Offer to help a friend. Write one question.", "some help", ["exactly one question", "must use some help"]],
  ["Ask your teacher for some paper. Write one question.", "Could you give me some", ["exactly one question", "must use some"]],
  ["Offer your friend some fruit. Write one question.", "some fruit", ["exactly one question", "must use some"]],
  ["Ask your mum for something to eat. Write one question.", "Can I have some", ["exactly one question", "must use some", "must use please"]],
  ["Write one offer and one negative sentence with any.", "some / any", ["exactly two sentences", "must use some", "must use any"]],
  ["Ask a shop worker for some bread. Write one question.", "some bread", ["exactly one question", "must use some bread"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Guests come to your home. Write a short dialogue (three or four lines). Offer them food and drinks.", "some in offers", ["Would you like some", "please", "thank you"]],
  ["Write a short dialogue (three or four lines) in a café.", "some in requests", ["Can I have some", "Would you like some", "please"]],
  ["Your friend is moving to a new flat. Write three or four lines. Offer help.", "some in offers", ["Would you like some help", "Can I", "some"]],
  ["You are at a picnic. Write three or four lines. Offer and ask for food.", "some in offers and requests", ["Would you like some", "Can I have some", "any in a negative"]],
  ["Write a short dialogue (three or four lines) at the market.", "some in requests", ["Can I have some", "Could you", "please"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.quantifiers.some-offer.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.quantifiers.some-offer.json`);