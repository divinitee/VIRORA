// Hand-authored: tenses / perfect / unfinished-time (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): the PRESENT PERFECT for a time period that
// is NOT finished yet (today, this week, this month, this year, while it is
// still going on).
// One right answer is the hard part: "I sent three emails this morning" is also
// natural English (and normal in American English), so a bare "this morning /
// today" never decides the tense. Every choose sentence carries "so far" or
// "up to now", which need the present perfect in British and American English.
// Distractors: past simple / had + participle / present simple (sent / had sent /
// send). Present continuous and the perfect continuous are never offered.
// Build mixes the two sides with a clear cue: 14 present perfect (so far, up to
// now, "and the week isn't over") and 6 past simple where the period is clearly
// finished ("Now it's evening", "this morning … Now it's three o'clock").
// Sibling perfect-vs-past owns yesterday / last week / ago; nth-time-perfect
// ("the third time today") is C1, so neither is used here.
// Transform: 5 finished period → "so far this …" / 5 correct the mistake /
// 5 answer a How many … ? question with so far.
//
// Run: node tools/grammar-practice/authored/tenses.perfect.unfinished-time.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "unfinished-time", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAME_F = ["Madina", "Olga", "Sevara", "Nilufar"];
const NAME_M = ["Sardor", "Timur", "Ilya", "Jasur"];
const PERIOD = ["today", "this week", "this month", "this year"];
const WHY_P = (pp) => `So far / up to now means the time is not finished yet, so use the present perfect: ${pp}.`;
const WHY_S = (v) => `That part of the day is over now, so use the past simple: ${v}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [aux, base, past, pp, s3, prompt, slots]
const CHOOSE = [
  ["have", "send", "sent", "sent", "send", "So far {period}, I ______ {n} emails to my teacher.", { period: PERIOD, n: ["three", "five", "two", "ten"] }],
  ["has", "drink", "drank", "drunk", "drinks", "So far today, my father ______ {n} cups of {drink}.", { n: ["three", "four", "five", "six"], drink: ["tea", "coffee", "green tea", "black tea"] }],
  ["have", "read", "read", "read", "read", "So far {period}, we ______ {n} chapters of the book.", { period: ["this week", "this month", "this term", "this year"], n: ["two", "three", "four", "five"] }],
  ["has", "score", "scored", "scored", "scores", "{name} ______ {n} goals so far this season.", { name: NAME_M, n: ["three", "five", "seven", "ten"] }],
  ["have", "spend", "spent", "spent", "spend", "We ______ a lot of money on {thing} so far {period}.", { thing: ["food", "taxis", "books", "presents"], period: PERIOD }],
  ["has", "rain", "rained", "rained", "rains", "It ______ {n} times so far this {period}, {name}.", { n: ["three", "four", "two", "five"], period: ["week", "month", "spring"], name: NAME }],
  ["have", "see", "saw", "seen", "see", "So far {period}, I ______ {n} films at the cinema.", { period: ["this month", "this year", "this summer", "this winter"], n: ["two", "three", "four", "six"] }],
  ["has", "call", "called", "called", "calls", "Up to now, {name} ______ me {n} times today. What does she want?", { name: NAME_F, n: ["four", "five", "six", "seven"] }],
  ["have", "eat", "ate", "eaten", "eat", "So far today, I ______ only {food}, so I'm very hungry.", { food: ["an apple", "a banana", "some bread", "a biscuit"], x: [] }],
  ["has", "visit", "visited", "visited", "visits", "So far this {period}, my grandmother ______ us {n} times.", { period: ["week", "month", "year", "summer"], n: ["two", "three", "four", "five"] }],
  ["have", "write", "wrote", "written", "write", "So far this term, our class ______ {n} essays in English, {name}.", { n: ["two", "three", "four", "five"], name: NAME }],
  ["has", "win", "won", "won", "wins", "Our team ______ every {game} so far this season, {name}.", { game: ["match", "game", "home match", "away game"], name: NAME }],
  ["have", "make", "made", "made", "make", "Up to now, my sisters ______ {n} cakes for the {event}.", { n: ["two", "three", "four", "five"], event: ["wedding", "party", "birthday", "school fair"] }],
  ["have", "learn", "learned", "learned", "learn", "So far {period}, I ______ about {n} new English words.", { period: PERIOD, n: ["fifty", "a hundred", "thirty", "two hundred"] }],
  ["has", "sell", "sold", "sold", "sells", "So far {period}, the shop ______ {n} {thing}.", { period: PERIOD, n: ["twenty", "fifty", "a hundred", "thirty"], thing: ["bikes", "phones", "melons", "coats"] }],
  ["haven't", "have", "didn't have", "had", "don't have", "So far {period}, we ______ any free time, {name}.", { period: ["today", "this week", "this month", "this weekend"], name: NAME }],
  ["hasn't", "be", "wasn't", "been", "isn't", "Up to now, {name} ______ late for training once this {period}.", { name: NAME_M, period: ["week", "month", "season", "year"] }],
  ["haven't", "see", "didn't see", "seen", "don't see", "So far today, I ______ {name} at school. Is she ill?", { name: NAME_F, x: [] }],
  ["has", "ride", "rode", "ridden", "rides", "So far this {period}, my brother ______ his bike to work every day.", { period: ["week", "month", "spring", "summer"], x: [] }],
  ["have", "take", "took", "taken", "take", "Up to now, we ______ {n} photos on this trip, {name}.", { n: ["two hundred", "a hundred", "fifty", "three hundred"], name: NAME }],
].map(([aux, v, past, pp, pres, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const neg = /n't$/.test(aux);
  const key = `${aux} ${pp}`;
  const hadForm = neg ? `hadn't ${pp}` : `had ${pp}`;
  let opts = [key, neg ? past : past, hadForm, pres];
  if (new Set(opts).size < 4) opts = [key, neg ? past : past, hadForm, neg ? `won't ${v}` : `will ${v}`];
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(key), why: WHY_P(key), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Is the time finished or not? Write the verb in brackets in the present perfect or the past simple.";
// [key, why, source, slots]
const BUILD = [
  ["have drunk", WHY_P("have drunk"), "So far today, I ______ (drink) {n} glasses of water, {name}.", { n: ["two", "three", "four", "five"], name: NAME }],
  ["has rained", WHY_P("has rained"), "It ______ (rain) every day so far this {period}.", { period: ["week", "month", "spring"], x: [] }],
  ["have spent", WHY_P("have spent"), "We ______ (spend) {n} dollars on food so far this {period}.", { n: ["fifty", "a hundred", "forty", "seventy"], period: ["week", "month", "trip"] }],
  ["has written", WHY_P("has written"), "{name} ______ (write) {n} pages of her essay so far today.", { name: NAME_F, n: ["two", "three", "four", "five"] }],
  ["have watched", WHY_P("have watched"), "Up to now, I ______ (watch) {n} episodes of the series {period}.", { n: ["three", "four", "five", "six"], period: ["today", "this week", "this weekend"] }],
  ["has scored", WHY_P("has scored"), "So far this season, our {player} ______ (score) {n} goals.", { player: ["captain", "best player", "new player", "goalkeeper"], n: ["two", "five", "eight", "twelve"] }],
  ["have met", WHY_P("have met"), "So far this {period}, I ______ (meet) a lot of new people, {name}.", { period: ["week", "month", "year", "term"], name: NAME }],
  ["has cooked", WHY_P("has cooked"), "My mother ______ (cook) plov {n} times so far this {period}.", { n: ["two", "three", "four"], period: ["week", "month", "year"] }],
  ["have run", WHY_P("have run"), "So far today, I ______ (run) {n} kilometres, and the race isn't over.", { n: ["five", "seven", "ten", "twelve"], x: [] }],
  ["has sent", WHY_P("has sent"), "Up to now, {name} ______ (send) me {n} messages today.", { name: NAME, n: ["ten", "twenty", "fifteen", "thirty"] }],
  ["have visited", WHY_P("have visited"), "We ______ (visit) {n} museums so far on this trip to {city}.", { n: ["two", "three", "four", "five"], city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"] }],
  ["has been", WHY_P("has been"), "So far this {period}, the weather ______ (be) very {adj}.", { period: ["week", "month", "spring", "summer"], adj: ["warm", "hot", "cold", "nice"] }],
  ["haven't had", WHY_P("haven't had"), "I ______ (not have) breakfast yet, and it's already {time}.", { time: ["ten", "eleven", "half past ten", "noon"], x: [] }],
  ["hasn't called", WHY_P("hasn't called"), "So far today, {name} ______ (not call) me. Is he OK?", { name: NAME_M, x: [] }],
  ["saw", WHY_S("saw"), "I ______ (see) {name} this morning. Now it's evening and I haven't seen her again.", { name: NAME_F, x: [] }],
  ["drank", WHY_S("drank"), "I ______ (drink) a lot of coffee this morning. Now it's {time} and I'm tired.", { time: ["four", "five", "three", "six"], x: [] }],
  ["ate", WHY_S("ate"), "We ______ (eat) {food} this morning. Now it's night, and the kitchen is closed, {name}.", { food: ["eggs", "porridge", "samsa", "bread and honey"], name: NAME }],
  ["called", WHY_S("called"), "{name} ______ (call) me at eight this morning. It's late afternoon now.", { name: NAME, x: [] }],
  ["finished", WHY_S("finished"), "Our {subj} lesson ______ (finish) at noon today. Now it's {time}.", { subj: ["English", "maths", "history", "music"], time: ["three", "four", "five", "evening"] }],
  ["went", WHY_S("went"), "My father ______ (go) to the {place} this morning. It's evening now and he's at home.", { place: ["bank", "bazaar", "post office", "doctor"], x: [] }],
].map(([key, why, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOW = "The time is not finished yet. Rewrite the sentence with so far.";
const FIX = "Correct the mistake.";
const ANS = "Answer the question with the present perfect and so far.";
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [NOW, "I read {n} books last month, {name}.", "I ______ {n} books so far this month, {name}.", "have read", WHY_P("have read"), { n: ["two", "three", "four", "five"], name: NAME }],
  [NOW, "We had {n} tests last week.", "We ______ {n} tests so far this {period}.", "have had", WHY_P("have had"), { n: ["two", "three", "four", "five"], period: ["week", "month", "term"] }],
  [NOW, "{name} made {n} new friends last year.", "{name} ______ {n} new friends so far this year.", "has made", WHY_P("has made"), { name: NAME, n: ["two", "three", "five", "ten"] }],
  [NOW, "My brother won {n} prizes last season.", "My brother ______ {n} prizes so far this {period}.", "has won", WHY_P("has won"), { n: ["two", "three", "four", "five"], period: ["season", "year", "month"] }],
  [NOW, "It snowed {n} times last winter, {name}.", "It ______ {n} times so far this winter, {name}.", "has snowed", WHY_P("has snowed"), { n: ["two", "three", "four", "five"], name: NAME }],
  [FIX, "So far today I drank {n} cups of tea, {name}.", "So far today I ______ {n} cups of tea, {name}.", "have drunk", "So far: the day is not finished, so the present perfect, have drunk.", { n: ["three", "four", "five", "six"], name: NAME }],
  [FIX, "Up to now, {name} visits us twice this {period}.", "Up to now, {name} ______ us twice this {period}.", "has visited", "Up to now needs the present perfect: has visited.", { name: NAME, period: ["week", "month", "year"] }],
  [FIX, "So far this {period}, we had very good weather.", "So far this {period}, we ______ very good weather.", "have had", "So far means the time is still going on: have had.", { period: ["week", "month", "spring", "summer"] }],
  [FIX, "So far this season, our team had won every {game}, {name}.", "So far this season, our team ______ every {game}, {name}.", "has won", "Had won is for before another past time. The season is still on: has won.", { game: ["match", "game", "home match", "away game"], name: NAME }],
  [FIX, "{name} doesn't call me so far {period}.", "{name} ______ me so far {period}.", "hasn't called", "So far needs the present perfect: hasn't called.", { name: NAME, period: ["today", "this week", "this month", "this weekend"] }],
  [ANS, "How many {thing} have you sent today, {name}? Three.", "I ______ three {thing} so far.", "have sent", WHY_P("have sent"), { thing: ["emails", "messages", "letters", "photos"], name: NAME }],
  [ANS, "How many cups of {drink} has your {who} had today? Four.", "He ______ four cups so far.", "has had", WHY_P("has had"), { drink: ["tea", "coffee", "green tea"], who: ["father", "grandfather", "uncle", "brother"] }],
  [ANS, "How many {thing} have you learned this week, {name}? Twenty.", "I ______ twenty {thing} so far.", "have learned", WHY_P("have learned"), { thing: ["new words", "verbs", "songs", "phrases"], name: NAME }],
  [ANS, "How many times has it rained this {period}, {name}? Twice.", "It ______ twice so far, {name}.", "has rained", WHY_P("has rained"), { period: ["week", "month", "spring"], name: NAME }],
  [ANS, "How many {game} has your team played this year, {name}? Six.", "We ______ six {game} so far.", "have played", WHY_P("have played"), { game: ["matches", "games", "home matches", "finals"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what you have done so far today.", "so far today + present perfect", ["exactly one sentence", "so far", "have / has + past participle"]],
  ["Write one sentence about how many cups of tea or coffee you have had this week.", "have had … this week", ["exactly one sentence", "present perfect", "this week"]],
  ["Write one sentence about the weather so far this month.", "it has been / it has rained", ["exactly one sentence", "so far this month", "present perfect"]],
  ["Write one sentence with haven't … yet today.", "haven't + past participle + today", ["exactly one sentence", "haven't", "today"]],
  ["Write one sentence about how many books or films you have finished this year.", "have read / have watched this year", ["exactly one sentence", "this year", "a number"]],
  ["Write one sentence about a family member's day so far.", "has + past participle so far", ["exactly one sentence", "he / she has", "so far"]],
  ["Write one sentence about this morning when it is already evening.", "past simple for a finished morning", ["exactly one sentence", "past simple", "this morning"]],
  ["Write two sentences: one about this week (not finished) and one about last week (finished).", "present perfect vs past simple", ["exactly two sentences", "present perfect with this week", "past simple with last week"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your week so far. What have you done, and what haven't you done yet? Write three or four sentences.", "present perfect for this week", ["so far / this week", "have + past participle", "haven't … yet"]],
  ["Write about your English this year: what you have learned and read so far. Write three or four sentences.", "present perfect for this year", ["so far this year", "at least two verbs", "a number"]],
  ["Describe a busy day that is not finished yet. Write three or four sentences.", "present perfect for today", ["so far today", "has / have", "still to do"]],
  ["Write a message to a friend about a trip you are still on. What have you seen so far? Write three or four sentences.", "present perfect on a trip", ["so far", "have seen / visited", "a place"]],
  ["Compare this month with last month. Write three or four sentences.", "present perfect vs past simple", ["this month + present perfect", "last month + past simple", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.perfect.unfinished-time.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
