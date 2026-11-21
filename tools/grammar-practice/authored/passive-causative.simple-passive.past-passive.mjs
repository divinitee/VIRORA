// Hand-authored: passive-causative / simple-passive / past-passive (A2).
// Path fill P58 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement foci: The house ______ last year (built / was built / is built
// / builds); These photos ______ (take) in Khiva last spring → were taken.
// Sibling scope: PAST simple passive only, was / were + past participle.
// Present passive is P57 (here only as a wrong option next to a past time
// marker); active → passive with "by" is P59, so no "by" phrases and no
// transform from an active sentence.
// Optional path topic: simple verbs only (built, made, written, painted,
// taken, cleaned, sold, given, found, sent, opened, planted, cooked,
// washed, broken, delivered, played, invited).
// One right answer: every sentence has a past time marker (last year, in
// 1990, yesterday, an hour ago) so is / are are wrong, and a thing as the
// subject so the active past is wrong. grow, open, close, sell, wash never
// stand next to an active option ("The shop opened at nine" is English).
// Choose, three kinds: 10 past passive vs active past / present passive /
// active -s (the placement's own options); 6 was vs were + participle (vs
// been / be); 4 participle form (was built vs was build / was builded /
// was building).
// Build: "Write the verb in brackets in the past passive."; no source
// prints was / were elsewhere.
// Transform: 5 correct the mistake / 5 present passive → past (new time
// words in the sentence) / 5 make it negative (wasn't / weren't).
//
// Run: node tools/grammar-practice/authored/passive-causative.simple-passive.past-passive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "passive-causative", branch: "simple-passive", topic: "past-passive", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];
const BIG = ["Tashkent", "Samarkand", "Namangan", "Andijan"];
const YEAR = ["1985", "1990", "2005", "2012"];
const LAST = ["spring", "summer", "year", "month"];
const RECENT = ["yesterday", "last week", "on Monday", "two days ago"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const W = {
  a: "It happened in the past, and something was done to the subject. Past passive: was / were + past participle.",
  b: "One thing → was + past participle; more than one → were + past participle.",
  c: "After was / were, use the past participle: built, taken, written, broken.",
  build: "Past passive: was (one thing) or were (more than one) + past participle.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CA = [
  [["was built", "built", "is built", "builds"], "Our {place} ______ in {year}, {name}.", { place: ["school", "house", "hospital", "library"], year: YEAR, name: NAME }],
  [["were taken", "took", "are taken", "take"], "These photos ______ in {city} last {when}.", { city: CITY, when: LAST }],
  [["was written", "wrote", "is written", "writes"], "This letter ______ {when}, {name}.", { when: ["in 1950", "in 1975", "long ago", "fifty years ago"], name: NAME }],
  [["was painted", "painted", "is painted", "paints"], "The kitchen ______ {when}, {name}. It looks nice now.", { when: ["last week", "yesterday", "in May", "last month"], name: NAME }],
  [["were cleaned", "cleaned", "are cleaned", "clean"], "The windows ______ {when}, {name}.", { when: ["yesterday", "this morning", "last week", "on Monday"], name: NAME }],
  [["was made", "made", "is made", "makes"], "This cake ______ {when}, {name}. It's still warm.", { when: ["this morning", "an hour ago", "at six", "just before lunch"], name: NAME }],
  [["were sent", "sent", "are sent", "send"], "The wedding invitations ______ {when}, {name}.", { when: RECENT, name: NAME }],
  [["was found", "found", "is found", "finds"], "My {thing} ______ under the sofa {when}.", { thing: ["phone", "key", "ring", "watch"], when: ["yesterday", "this morning", "last night", "on Sunday"] }],
  [["was given", "gave", "is given", "gives"], "This {thing} ______ to me for my birthday {when}.", { thing: ["watch", "bike", "book", "scarf"], when: ["last year", "last month", "in May", "two years ago"] }],
  [["were planted", "planted", "are planted", "plant"], "These trees ______ {when}, {name}.", { when: ["last spring", "ten years ago", "in 2015", "last autumn"], name: NAME }],
];
const AGR = (pp) => [`${pp[0]} ${pp[1]}`, `${pp[0] === "was" ? "were" : "was"} ${pp[1]}`, `been ${pp[1]}`, `be ${pp[1]}`];
const CB = [
  [AGR(["was", "made"]), "This {thing} ______ in {city} last {when}, {name}.", { thing: ["carpet", "plate", "dress", "knife"], city: CITY, when: LAST, name: NAME }],
  [AGR(["were", "built"]), "The new flats ______ last {when}, {name}.", { when: LAST, name: NAME }],
  [AGR(["was", "cooked"]), "Dinner ______ {when}, {name}.", { when: ["an hour ago", "at six", "early", "before we came"], name: NAME }],
  [AGR(["were", "washed"]), "The {thing} ______ {when}, {name}.", { thing: ["cups", "plates", "dishes", "towels"], when: RECENT, name: NAME }],
  [AGR(["was", "opened"]), "The new {place} ______ last {when}, {name}.", { place: ["museum", "park", "café", "library"], when: LAST, name: NAME }],
  [AGR(["were", "written"]), "These songs ______ in {lang} long ago, {name}.", { lang: ["Uzbek", "Russian", "Persian", "Tajik"], name: NAME }],
];
const CC = [
  [["was built", "was build", "was builded", "was building"], "The bridge ______ in {year}, {name}.", { year: YEAR, name: NAME }],
  [["were taken", "were take", "were took", "were taking"], "The pictures ______ at the {event} {when}.", { event: ["wedding", "party", "concert", "match"], when: ["yesterday", "last week", "on Sunday", "last night"] }],
  [["was written", "was write", "was wrote", "was writing"], "This {thing} ______ {when}, {name}.", { thing: ["poem", "story", "song", "book"], when: ["in 1990", "long ago", "last year", "in 2001"], name: NAME }],
  [["was broken", "was break", "was broke", "was breaking"], "The window ______ {when}, {name}.", { when: ["yesterday", "last night", "during the match", "on Friday"], name: NAME }],
];
const CHOOSE = [
  ...CA.map(([o, p, s]) => [o, "a", p, s]),
  ...CB.map(([o, p, s]) => [o, "b", p, s]),
  ...CC.map(([o, p, s]) => [o, "c", p, s]),
].map(([base, w, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[w], slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets in the past passive (was / were + past participle).";
const BUILD = [
  ["was built", "Our school ______ (build) in {year}, {name}.", { year: YEAR, name: NAME }],
  ["were taken", "These photos ______ (take) in {city} last {when}.", { city: CITY, when: LAST }],
  ["was written", "This book ______ (write) in {year}, {name}.", { year: ["1960", "1985", "2001", "2010"], name: NAME }],
  ["were made", "These {thing} ______ (make) by hand last {when}.", { thing: ["plates", "scarves", "carpets", "cups"], when: LAST }],
  ["was painted", "The door ______ (paint) {when}, {name}.", { when: RECENT, name: NAME }],
  ["were cleaned", "All the rooms ______ (clean) {when}, {name}.", { when: ["yesterday", "this morning", "last week", "on Saturday"], name: NAME }],
  ["was sold", "Our old car ______ (sell) last {when}, {name}.", { when: LAST, name: NAME }],
  ["were given", "The prizes ______ (give) to the winners {when}.", { when: ["yesterday", "on Friday", "last week", "after the match"] }],
  ["was found", "The lost {pet} ______ (find) in the park {when}.", { pet: ["dog", "cat", "puppy", "kitten"], when: ["yesterday", "this morning", "last night", "on Sunday"] }],
  ["were sent", "The {thing} ______ (send) {when}, {name}.", { thing: ["emails", "letters", "parcels", "messages"], when: RECENT, name: NAME }],
  ["was opened", "The new {place} ______ (open) last {when}.", { place: ["museum", "park", "café", "library"], when: LAST }],
  ["were planted", "The {tree} trees ______ (plant) {when}.", { tree: ["apple", "cherry", "apricot", "peach"], when: ["last spring", "in 2018", "ten years ago", "last autumn"] }],
  ["was cooked", "The plov ______ (cook) {when}, {name}.", { when: ["this morning", "yesterday", "an hour ago", "at noon"], name: NAME }],
  ["were washed", "The {thing} ______ (wash) {when}, {name}.", { thing: ["dishes", "cups", "clothes", "towels"], when: RECENT, name: NAME }],
  ["was broken", "The {thing} ______ (break) {when}, {name}.", { thing: ["window", "cup", "plate", "chair"], when: ["yesterday", "last night", "at the party", "on Friday"], name: NAME }],
  ["were built", "These houses ______ (build) {when}, {name}.", { when: ["long ago", "in the 1970s", "fifty years ago", "in 1960"], name: NAME }],
  ["was delivered", "The parcel ______ (deliver) {when}, {name}.", { when: ["this morning", "yesterday", "an hour ago", "on Tuesday"], name: NAME }],
  ["were played", "{n} matches ______ (play) {when}.", { n: ["Two", "Three", "Four", "Five"], when: ["yesterday", "last Sunday", "on Saturday", "last week"] }],
  ["was made", "This {thing} ______ (make) in {country} in {year}.", { thing: ["phone", "car", "watch", "camera"], country: ["China", "Korea", "Japan", "Germany"], year: YEAR }],
  ["were invited", "All our {who} ______ (invite) to the wedding {when}.", { who: ["cousins", "neighbours", "friends", "teachers"], when: ["last summer", "in May", "last year", "in June"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W.build, slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const PAST = "Rewrite the sentence in the past. Use the new time words.";
const NEG = "Make the sentence negative.";
const TRANSFORM = [
  // correct (5)
  [COR, "Our school were built in {year}, {name}.", "Our school ______ in {year}, {name}.", "was built", "One school → was built.", { year: YEAR, name: NAME }],
  [COR, "These photos was taken in {city}, {name}.", "These photos ______ in {city}, {name}.", "were taken", "More than one photo → were taken.", { city: CITY, name: NAME }],
  [COR, "The cake was make {when}, {name}.", "The cake ______ {when}, {name}.", "was made", "After was, use the past participle: made.", { when: ["this morning", "an hour ago", "yesterday", "last night"], name: NAME }],
  [COR, "The letters was sent {when}, {name}.", "The letters ______ {when}, {name}.", "were sent", "More than one letter → were sent.", { when: RECENT, name: NAME }],
  [COR, "This book wrote in {year}, {name}.", "This book ______ in {year}, {name}.", "was written", "A book doesn't write; it was written.", { year: ["1960", "1985", "2001", "2010"], name: NAME }],
  // present -> past (5)
  [PAST, "The shop is opened at nine every day, {name}.", "The shop ______ at nine yesterday, {name}.", "was opened", "yesterday → past: was opened.", { name: NAME }],
  [PAST, "The rooms are cleaned every {when}, {name}.", "The rooms ______ last {when}, {name}.", "were cleaned", "last … → past: were cleaned.", { when: ["week", "month", "Friday", "Saturday"], name: NAME }],
  [PAST, "This {thing} is made by hand, {name}.", "This {thing} ______ by hand last year, {name}.", "was made", "last year → past: was made.", { thing: ["carpet", "plate", "scarf", "dress"], name: NAME }],
  [PAST, "The letters are delivered every {when}, {name}.", "The letters ______ last {when}, {name}.", "were delivered", "last … → past: were delivered.", { when: ["Monday", "week", "month", "Friday"], name: NAME }],
  [PAST, "Many flats are built in {city} every year, {name}.", "Many flats ______ in {city} last year, {name}.", "were built", "last year → past: were built.", { city: BIG, name: NAME }],
  // negative (5)
  [NEG, "The car was washed {when}, {name}.", "The car ______ {when}, {name}.", "wasn't washed", "Negative: wasn't (was not) + past participle.", { when: RECENT, name: NAME }],
  [NEG, "The photos were taken in {city}, {name}.", "The photos ______ in {city}, {name}.", "weren't taken", "Negative: weren't (were not) + past participle.", { city: CITY, name: NAME }],
  [NEG, "The {food} was cooked {when}.", "The {food} ______ {when}.", "wasn't cooked", "Negative: wasn't (was not) + past participle.", { food: ["plov", "soup", "rice", "meat"], when: ["this morning", "yesterday", "in time", "at noon"] }],
  [NEG, "The invitations were sent {when}, {name}.", "The invitations ______ {when}, {name}.", "weren't sent", "Negative: weren't (were not) + past participle.", { when: RECENT, name: NAME }],
  [NEG, "The new {place} was opened last {when}.", "The new {place} ______ last {when}.", "wasn't opened", "Negative: wasn't (was not) + past participle.", { place: ["museum", "park", "café", "library"], when: LAST }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: fix(slots, source + hint) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about when your school or house was built.", "… was built in …", ["exactly one sentence", "was built", "a year or time word"]],
  ["Write one sentence about a photo that was taken on a holiday.", "This photo was taken in …", ["exactly one sentence", "was or were taken", "a place name"]],
  ["Write one sentence about a present that was given to you.", "… was given to me …", ["exactly one sentence", "was given", "a time word"]],
  ["Write one sentence about something that was broken at home.", "… was broken …", ["exactly one sentence", "was broken", "a past time word"]],
  ["Write one sentence about a meal that was cooked for your family.", "… was cooked …", ["exactly one sentence", "was cooked", "a food word"]],
  ["Write one sentence about something that was lost and then found.", "… was found …", ["exactly one sentence", "was found", "a place word"]],
  ["Write one sentence about people who were invited to a party or wedding.", "… were invited …", ["exactly one sentence", "were invited", "an event word"]],
  ["Write two sentences: one with was + past participle and one with were + past participle.", "… was made … / … were sent …", ["exactly two sentences", "was + past participle", "were + past participle"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a wedding or party: what was cooked, who was invited and what was given?", "… was cooked / … were invited …", ["was + past participle", "were + past participle", "three or four sentences"]],
  ["Describe an old building in your town: when it was built and what was done to it later.", "It was built in … / It was painted …", ["was built", "a year", "three or four sentences"]],
  ["Describe a bad day: what was lost, broken or forgotten?", "My … was lost / … was broken …", ["the past passive twice", "a past time word", "three or four sentences"]],
  ["Describe your last birthday: what were you given, and what was made for you?", "I was given … / A cake was made …", ["was given", "was made", "three or four sentences"]],
  ["Describe how your home was made ready for a holiday like Navruz.", "The rooms were cleaned … / Sumalak was cooked …", ["were cleaned", "was cooked", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/passive-causative.simple-passive.past-passive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);