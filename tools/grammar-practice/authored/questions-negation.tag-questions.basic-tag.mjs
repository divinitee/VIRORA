// Hand-authored: questions-negation / tag-questions / basic-tag (B1).
// Wave C, C10 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement foci: negative tag after a positive statement with the matching
// auxiliary ("You live near the station, don't you?"), positive tag after a
// negative statement ("She isn't coming tonight, is she?").
// Learners copy the main verb ("works, worksn't"), use one tag for all
// ("isn't it?", the Russian "не так ли?" / Uzbek "-mi?") or keep the polarity.
// Choose: positive statements never get a same-polarity distractor ("You live
// here, do you?" is a native echo tag), only a wrong auxiliary, wrong pronoun,
// wrong tense or "isn't it". Negative statements get the negative tag as the
// distractor (never right), plus a wrong auxiliary or pronoun.
// No "I am" (aren't I), imperatives or Let's. Names in tag items come from a
// one-gender list so the pronoun is fixed.
// Build / transform: noun subjects only (your sister, the shop, a name), so
// the typed pronoun is never printed in the sentence (schema echo rule).
// Transform: 5 correct the tag / 5 make the statement negative and change the
// tag / 5 make the statement positive and change the tag.
//
// Run: node tools/grammar-practice/authored/questions-negation.tag-questions.basic-tag.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "tag-questions", topic: "basic-tag", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAMEF = ["Olga", "Lola", "Madina", "Kamila"];
const NAMEM = ["Aziz", "Timur", "Bekzod", "Rustam"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const PLACE = ["bank", "hospital", "hotel", "airport"];
const EVENT = ["party", "wedding", "concert", "meeting"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const POS = "Positive statement → negative tag. Use the same auxiliary (do / does / did for a main verb) and a pronoun for the subject.";
const NEG = "Negative statement → positive tag, with the same auxiliary and a pronoun for the subject.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [POS, ["don't you", "aren't you", "doesn't you", "isn't it"], "You live near the {place}, ______, {name}?", { place: ["station", "bazaar", "park", "school"], name: NAME }],
  [POS, ["doesn't she", "isn't she", "don't she", "doesn't it"], "Your sister works at the {place}, ______, {name}?", { place: PLACE, name: NAME }],
  [POS, ["don't they", "aren't they", "doesn't they", "didn't they"], "Your cousins play {sport} on Saturdays, ______?", { sport: ["football", "chess", "tennis", "volleyball"] }],
  [POS, ["didn't you", "don't you", "weren't you", "hadn't you"], "You saw the {film} last night, ______, {name}?", { film: ["match", "film", "news", "concert"], name: NAME }],
  [POS, ["didn't she", "doesn't she", "wasn't she", "didn't he"], "{name} called you {when}, ______?", { name: NAMEF, when: PAST }],
  [POS, ["isn't it", "doesn't it", "wasn't it", "isn't she"], "The {place} is open {when}, ______?", { place: ["museum", "bank", "pharmacy", "library"], when: ["today", "now", "on Sundays", "until six"] }],
  [POS, ["weren't they", "didn't they", "wasn't they", "aren't they"], "Your parents were at the {event} {when}, ______?", { event: EVENT, when: PAST }],
  [POS, ["can't he", "doesn't he", "isn't he", "can't she"], "{name} can {skill}, ______?", { name: NAMEM, skill: ["swim", "drive", "cook", "ski"] }],
  [POS, ["won't you", "don't you", "will not you", "aren't you"], "You'll come to the {event}, ______, {name}?", { event: EVENT, name: NAME }],
  [POS, ["haven't we", "didn't we", "don't we", "weren't we"], "We've met before at a {event}, ______, {name}?", { event: EVENT, name: NAME }],
  [NEG, ["is she", "isn't she", "does she", "is it"], "{name} isn't coming {when}, ______?", { name: NAMEF, when: ["tonight", "today", "tomorrow", "this weekend"] }],
  [NEG, ["do you", "don't you", "are you", "does you"], "You don't eat {food}, ______, {name}?", { food: ["meat", "fish", "sweets", "spicy food"], name: NAME }],
  [NEG, ["does he", "doesn't he", "is he", "do he"], "Your brother doesn't speak {lang}, ______?", { lang: ["Russian", "Korean", "Turkish", "Chinese"] }],
  [NEG, ["did they", "didn't they", "do they", "were they"], "They didn't go to the {event} {when}, ______?", { event: EVENT, when: PAST }],
  [NEG, ["was it", "wasn't it", "did it", "is it"], "The {thing} wasn't very expensive, ______, {name}?", { thing: ["bag", "phone", "jacket", "bike"], name: NAME }],
  [NEG, ["can you", "can't you", "do you", "are you"], "You can't come {when}, ______, {name}?", { when: ["tomorrow", "tonight", "on Friday", "this weekend"], name: NAME }],
  [NEG, ["are they", "aren't they", "do they", "is it"], "The children aren't hungry {when}, ______, {name}?", { when: ["now", "yet", "today", "this morning"], name: NAME }],
  [NEG, ["will it", "won't it", "does it", "is it"], "The bus won't be late {when}, ______, {name}?", { when: ["today", "tonight", "tomorrow", "this time"], name: NAME }],
  [NEG, ["have we", "haven't we", "do we", "are we"], "We haven't got any {thing}, ______, {name}?", { thing: ["milk", "bread", "eggs", "sugar"], name: NAME }],
  [NEG, ["is there", "isn't there", "is it", "does there"], "There isn't a {place} near here, ______, {name}?", { place: ["pharmacy", "bank", "café", "bus stop"], name: NAME }],
].map(([why, opts, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the question tag.";
const BUILD = [
  ["doesn't she", POS, "{name} lives near the {place}, ______?", { name: NAMEF, place: ["station", "bazaar", "park", "river"] }],
  ["doesn't he", POS, "Your brother works at the {place}, ______?", { place: PLACE }],
  ["doesn't it", POS, "The shop opens at {time}, ______, {name}?", { time: ["eight", "nine", "ten", "seven"], name: NAME }],
  ["didn't they", POS, "Your parents liked the {thing}, ______, {name}?", { thing: ["film", "dinner", "hotel", "trip"], name: NAME }],
  ["wasn't he", POS, "{name} was at the {event} yesterday, ______?", { name: NAMEM, event: EVENT }],
  ["isn't it", POS, "The {thing} is new, ______, {name}?", { thing: ["phone", "bike", "car", "laptop"], name: NAME }],
  ["aren't they", POS, "Your cousins are from {city}, ______?", { city: CITY }],
  ["can't she", POS, "{name} can {skill}, ______?", { name: NAMEF, skill: ["swim", "drive", "cook", "ski"] }],
  ["won't it", POS, "The train will be on time {when}, ______?", { when: ["today", "tonight", "tomorrow", "this time"] }],
  ["haven't they", POS, "Your grandparents have got a {thing}, ______?", { thing: ["garden", "dog", "car", "dacha"] }],
  ["is he", NEG, "{name} isn't at home {when}, ______?", { name: NAMEM, when: ["now", "today", "tonight", "this week"] }],
  ["does she", NEG, "Your sister doesn't like {food}, ______?", { food: ["plov", "fish", "spicy food", "coffee"] }],
  ["did they", NEG, "The children didn't eat their {food}, ______?", { food: ["soup", "vegetables", "lunch", "salad"] }],
  ["was it", NEG, "The {place} wasn't open {when}, ______?", { place: ["museum", "bank", "shop", "café"], when: ["yesterday", "on Sunday", "last night", "on Navruz"] }],
  ["can she", NEG, "{name} can't come to the {event}, ______?", { name: NAMEF, event: EVENT }],
  ["are they", NEG, "Your friends aren't coming {when}, ______, {name}?", { when: ["tonight", "today", "tomorrow", "this weekend"], name: NAME }],
  ["does it", NEG, "The bus doesn't stop at the {place}, ______, {name}?", { place: ["bazaar", "museum", "station", "hospital"], name: NAME }],
  ["will he", NEG, "{name} won't forget the {thing}, ______?", { name: NAMEM, thing: ["tickets", "keys", "cake", "map"] }],
  ["has he", NEG, "Your uncle hasn't seen the {thing}, ______, {name}?", { thing: ["photos", "video", "letter", "new house"], name: NAME }],
  ["were they", NEG, "The tickets weren't expensive {when}, ______, {name}?", { when: ["last year", "in summer", "for the concert", "online"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the question tag.";
const NEGI = "Make the statement negative and change the tag.";
const POSI = "Make the statement positive and change the tag.";
const TRANSFORM = [
  // correct the tag (5)
  [COR, "Your sister works at the {place}, isn't she, {name}?", "Your sister works at the {place}, ______, {name}?", "doesn't she", POS, { place: PLACE, name: NAME }],
  [COR, "{name} went to {city} last week, doesn't he?", "{name} went to {city} last week, ______?", "didn't he", POS, { name: NAMEM, city: CITY }],
  [COR, "The {thing} is broken, doesn't it, {name}?", "The {thing} is broken, ______, {name}?", "isn't it", POS, { thing: ["printer", "lift", "fridge", "clock"], name: NAME }],
  [COR, "Your parents aren't at home {when}, aren't they, {name}?", "Your parents aren't at home {when}, ______, {name}?", "are they", NEG, { when: ["now", "today", "tonight", "this week"], name: NAME }],
  [COR, "{name} can't come {when}, can't she?", "{name} can't come {when}, ______?", "can she", NEG, { name: NAMEF, when: ["tomorrow", "tonight", "on Friday", "this weekend"] }],
  // positive -> negative statement + tag (5)
  [NEGI, "Your brother eats {food}, doesn't he, {name}?", "Your brother ______ eat {food}, ______, {name}?", ["doesn't", "does he"], NEG, { food: ["meat", "fish", "sweets", "spicy food"], name: NAME }],
  [NEGI, "{name} is at the {place}, isn't she?", "{name} ______ at the {place}, ______?", ["isn't", "is she"], NEG, { name: NAMEF, place: ["gym", "library", "bazaar", "bank"] }],
  [NEGI, "The children liked the {thing}, didn't they, {name}?", "The children ______ like the {thing}, ______, {name}?", ["didn't", "did they"], NEG, { thing: ["film", "game", "food", "museum"], name: NAME }],
  [NEGI, "Your friends will come {when}, won't they, {name}?", "Your friends ______ come {when}, ______, {name}?", ["won't", "will they"], NEG, { when: ["tonight", "tomorrow", "on Saturday", "this weekend"], name: NAME }],
  [NEGI, "The {place} was busy {when}, wasn't it?", "The {place} ______ busy {when}, ______?", ["wasn't", "was it"], NEG, { place: ["bazaar", "café", "station", "airport"], when: PAST }],
  // negative -> positive statement + tag (5)
  [POSI, "Your cousin doesn't live in {city}, does she, {name}?", "Your cousin ______ in {city}, ______, {name}?", ["lives", "doesn't she"], POS, { city: CITY, name: NAME }],
  [POSI, "{name} didn't call {when}, did he?", "{name} ______ {when}, ______?", ["called", "didn't he"], POS, { name: NAMEM, when: PAST }],
  [POSI, "The bus isn't late {when}, is it, {name}?", "The bus ______ late {when}, ______, {name}?", ["is", "isn't it"], POS, { when: ["today", "again", "this morning", "tonight"], name: NAME }],
  [POSI, "Your parents can't drive a {vehicle}, can they, {name}?", "Your parents ______ drive a {vehicle}, ______, {name}?", ["can", "can't they"], POS, { vehicle: ["car", "truck", "bus", "tractor"], name: NAME }],
  [POSI, "The {thing} weren't cheap, were they, {name}?", "The {thing} ______ cheap, ______, {name}?", ["were", "weren't they"], POS, { thing: ["tickets", "shoes", "flowers", "books"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with a tag to check that a friend likes football.", "You like football, don't you?", ["exactly one sentence", "positive statement", "negative tag"]],
  ["Write one sentence with a tag to check that the shop isn't open today.", "The shop isn't open today, is it?", ["exactly one sentence", "negative statement", "positive tag"]],
  ["Write one sentence with a tag about something a friend did yesterday.", "You went to …, didn't you?", ["exactly one sentence", "a past verb", "didn't + pronoun"]],
  ["Write one sentence with a tag about what someone can do.", "… can …, can't she / he?", ["exactly one sentence", "can", "can't in the tag"]],
  ["Write one sentence with a tag about the weather.", "It's cold today, isn't it?", ["exactly one sentence", "be", "a matching tag"]],
  ["Write one sentence with a tag about a plan for tomorrow.", "We'll meet tomorrow, won't we?", ["exactly one sentence", "will", "won't in the tag"]],
  ["Write one sentence with a tag about something your family doesn't do.", "My dad doesn't …, does he?", ["exactly one sentence", "doesn't", "does + pronoun"]],
  ["Write two sentences with tags: one positive statement and one negative statement.", "… , don't you? / … , is it?", ["exactly two sentences", "a negative tag after the positive", "a positive tag after the negative"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You meet an old classmate. Write a short chat where you check facts about their life.", "You live in …, don't you? You aren't …, are you?", ["question tags", "positive and negative statements", "three or four sentences"]],
  ["Write what you say to a friend before a trip to check the plan.", "The train leaves at …, doesn't it? We won't …, will we?", ["question tags", "different auxiliaries", "three or four sentences"]],
  ["Write a short chat with a shop worker to check details about a product.", "It's new, isn't it? It doesn't …, does it?", ["question tags", "matching auxiliaries", "three or four sentences"]],
  ["Write what you say to a friend after a party to talk about it.", "It was great, wasn't it? You didn't …, did you?", ["question tags", "past forms", "three or four sentences"]],
  ["Write a short chat with a new neighbour.", "You've just moved in, haven't you? You don't …, do you?", ["question tags", "positive and negative statements", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/questions-negation.tag-questions.basic-tag.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);