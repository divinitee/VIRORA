// Hand-authored: pronouns / substitution / the-other-others (B1).
// Wave C, C20 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: the other = the second one of two ("One lives in Tashkent
// and the other lives in Bukhara"); the others = the rest of a known group;
// the other + plural noun = the rest, with the noun.
// Learner errors: "another" for the second of two (Russian "другой" /
// Uzbek "boshqasi" cover both), "the another", "the others bags", and bare
// "others" for a known group.
// Sibling another-other (C18) keys another / other / others without "the".
// Here every frame names the group (two hands, two sisters, five friends,
// a pair of gloves) so only the + other fits. Bare "other" is never offered
// before a plural noun ("other students" can be English); bare "others" is
// offered only where the group is closed and it reads wrong.
// Choose: 10 the other (one of two) / 7 the others / 3 the other + plural.
// Build: "Write the other or the others." 12 / 8, no other "other" printed.
// Transform: 5 correct / 5 the second → the other / 5 the rest → the others.
//
// Run: node tools/grammar-practice/authored/pronouns.substitution.the-other-others.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "substitution", topic: "the-other-others", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const CITY2 = ["Tashkent", "Fergana", "Nukus", "Andijan"];
const JOB = ["doctor", "pilot", "teacher", "driver"];
const PLACE = ["café", "station", "park", "bazaar"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_TWO = "There are only two, so the second one is the other. Another means one more from many; the another is never English.";
const W_REST = "It means all the rest of a known group, so use the others (no noun after it). The other is only one; others alone means some different people.";
const W_PL = "The rest of a known group, with a noun after it: the other + plural noun (the other students). Others never goes before a noun.";
const O2 = ["the other", "another", "the others", "other"];
const OR = ["the others", "others", "the other", "another"];
const OP = ["the other", "the others", "others", "another"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O2, W_TWO, "I have two brothers. One lives in {city} and ______ lives in {city2}.", { city: CITY, city2: CITY2 }],
  [O2, W_TWO, "I've got two {pets}. One is black and ______ is white, {name}.", { pets: ["cats", "dogs", "rabbits", "puppies"], name: NAME }],
  [O2, W_TWO, "There are two shops on our street. One is open, but ______ one is closed, {name}.", { name: NAME }],
  [O2, W_TWO, "I can only find one {shoe}. Where's ______ one, {name}?", { shoe: ["shoe", "sock", "glove", "earring"], name: NAME }],
  [O2, W_TWO, "Hold the bag with one hand and open the {thing} with ______, {name}.", { thing: ["door", "gate", "window", "box"], name: NAME }],
  [O2, W_TWO, "Our flat has two bedrooms. I sleep in this one, and my {who} sleeps in ______, {name}.", { who: ["sister", "brother", "cousin", "grandma"], name: NAME }],
  [O2, W_TWO, "Two {who} came to the {event}. One was my cousin; I didn't know ______.", { who: ["girls", "boys", "students", "guests"], event: ["party", "lesson", "meeting", "wedding"] }],
  [O2, W_TWO, "This road is closed. Let's cross to ______ side of the {place}, {name}.", { place: ["river", "bridge", "square", "park"], name: NAME }],
  [O2, W_TWO, "One of my parents is a {job}; ______ is a {job2}.", { job: JOB, job2: ["nurse", "cook", "builder", "farmer"] }],
  [O2, W_TWO, "There are two cafés near the {place}. One is cheap, and ______ is very expensive.", { place: ["station", "school", "hotel", "museum"] }],
  [OR, W_REST, "Where are ______, {name}? Only you are at the {place}.", { name: NAME, place: PLACE }],
  [OR, W_REST, "There were five {fruit}. I ate one, and my brother ate all ______, {name}.", { fruit: ["apples", "peaches", "pears", "bananas"], name: NAME }],
  [OR, W_REST, "I kept one {thing} and gave all ______ to my sister, {name}.", { thing: ["photo", "book", "toy", "card"], name: NAME }],
  [OR, W_REST, "I have six {things}. This one is new, but all ______ are old, {name}.", { things: ["bags", "shirts", "pens", "cups"], name: NAME }],
  [OR, W_REST, "Ten students took the {test}. Three failed, but all ______ passed, {name}.", { test: ["test", "exam", "quiz", "driving test"], name: NAME }],
  [OR, W_REST, "Only two of us are here. Let's wait for all ______ before we start the {thing}, {name}.", { thing: ["game", "film", "lesson", "meal"], name: NAME }],
  [OR, W_REST, "Only one of my friends came on time; all ______ were late for the {event}.", { event: ["party", "film", "match", "wedding"] }],
  [OP, W_PL, "Our team was ready, but ______ teams were late for the {match}, {name}.", { match: ["match", "race", "quiz", "game"], name: NAME }],
  [OP, W_PL, "{name} sits at the front of the {room}, and ______ students sit at the back.", { name: NAME, room: ["class", "hall", "bus", "room"] }],
  [OP, W_PL, "Two of the {things} are broken, but ______ ones are fine, {name}.", { things: ["chairs", "lamps", "bikes", "cups"], name: NAME }],
].map(([opts, why, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
// Typed stages print "the" before the gap (the schema refuses a key that
// repeats a printed word, and most frames need another "the"), so the learner
// types other or others: one of two vs the rest.
const withThe = (s, key) => s.replace("______", key.startsWith("The") ? "The ______" : "the ______");
const dropThe = (key) => key.replace(/^the /i, "");
const INSTR_B = "Write other or others.";
const BUILD = [
  ["the other", W_TWO, "I've got two {sib}. One is a {job}, and ______ is a student.", { sib: ["brothers", "sisters", "cousins", "nephews"], job: JOB }],
  ["the other", W_TWO, "This {shoe} is mine. Where's ______ one, {name}?", { shoe: ["shoe", "sock", "glove", "boot"], name: NAME }],
  ["the other", W_TWO, "Our {place} has two gates. This one is closed, so use ______, {name}.", { place: ["school", "park", "college", "hospital"], name: NAME }],
  ["the other", W_TWO, "There are two hotels in the {place}. One is cheap, and ______ is very expensive, {name}.", { place: ["village", "old town", "centre", "valley"], name: NAME }],
  ["the other", W_TWO, "I use my right hand. I can't {act} with ______, {name}.", { act: ["write", "draw", "eat", "throw"], name: NAME }],
  ["the other", W_TWO, "My grandparents have two houses: one in {city} and ______ in the village, {name}.", { city: CITY, name: NAME }],
  ["the other", W_TWO, "Two people called {when}. One was my aunt; I don't know who ______ was, {name}.", { when: ["yesterday", "last night", "this morning", "on Friday"], name: NAME }],
  ["the other", W_TWO, "There are two banks here. Ours is on this side of the {place}, and ______ is across it, {name}.", { place: ["road", "street", "square", "river"], name: NAME }],
  ["the other", W_TWO, "Close one eye and look at the {thing} with ______, {name}.", { thing: ["board", "picture", "letters", "light"], name: NAME }],
  ["the other", W_PL, "Two girls got off at the {stop} {when}, and ______ passengers stayed on.", { stop: ["bazaar", "station", "school", "park"], when: ["today", "this morning", "at six", "yesterday"] }],
  ["the other", W_PL, "{name} has finished the {test}, but ______ students are still writing.", { name: NAME, test: ["test", "exam", "essay", "quiz"] }],
  ["the other", W_PL, "This window in the {room} is open, but ______ windows are closed, {name}.", { room: ["kitchen", "classroom", "bedroom", "office"], name: NAME }],
  ["the others", W_REST, "{name} is at the {place}. Where are ______?", { name: NAME, place: PLACE }],
  ["the others", W_REST, "I've found one of my five {thing}. Can you help me find ______, {name}?", { thing: ["keys", "cards", "pens", "pieces"], name: NAME }],
  ["the others", W_REST, "I'll take this {box}, and you can carry all ______, {name}.", { box: ["box", "bag", "chair", "suitcase"], name: NAME }],
  ["the others", W_REST, "Only one {who} came on time {when}; ______ were late.", { who: ["student", "guest", "player", "teacher"], when: ["yesterday", "last night", "on Friday", "last week"] }],
  ["The others", W_REST, "Let's start the {thing}. ______ can join us later, {name}.", { thing: ["game", "lesson", "meal", "meeting"], name: NAME }],
  ["the others", W_REST, "I like this photo of {city}, but ______ are a bit dark, {name}.", { city: CITY, name: NAME }],
  ["the others", W_REST, "Two of my friends live here; ______ live in {city}, {name}.", { city: CITY2, name: NAME }],
  ["the others", W_REST, "This {fruit} is ripe, but ______ are still green, {name}.", { fruit: ["melon", "apple", "peach", "tomato"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source: withThe(source, key), key: dropThe(key), why, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const TWO = "Rewrite with the other.";
const REST = "Rewrite with the others.";
const TRANSFORM = [
  // correct (5)
  [COR, "I have two sisters, {name}. One is a {job} and another is a student.", "I have two sisters, {name}. One is a {job} and ______ is a student.", "the other", W_TWO, { job: JOB, name: NAME }],
  [COR, "Where are others? Only {name} is at the {place}.", "Where are ______? Only {name} is at the {place}.", "the others", W_REST, { name: NAME, place: PLACE }],
  [COR, "I lost one {glove}. Have you seen the another one, {name}?", "I lost one {glove}. Have you seen ______ one, {name}?", "the other", W_TWO, { glove: ["glove", "sock", "shoe", "earring"], name: NAME }],
  [COR, "This bag on the {furn} is mine; the others bags are yours, {name}.", "This bag on the {furn} is mine; ______ bags are yours, {name}.", "the other", W_PL, { furn: ["chair", "table", "floor", "sofa"], name: NAME }],
  [COR, "Only {name} is ready. The other are still eating {food}.", "Only {name} is ready. ______ are still eating {food}.", "The others", W_REST, { name: NAME, food: ["plov", "soup", "breakfast", "lunch"] }],
  // the second one -> the other (5)
  [TWO, "I have two {pets}. One is black and the second one is white, {name}.", "I have two {pets}. One is black and ______ is white, {name}.", "the other", W_TWO, { pets: ["cats", "dogs", "rabbits", "puppies"], name: NAME }],
  [TWO, "There are two doors in the {room}. Please use the second door, {name}.", "There are two doors in the {room}. Please use ______ door, {name}.", "the other", W_TWO, { room: ["hall", "kitchen", "classroom", "shop"], name: NAME }],
  [TWO, "We have two cars. Dad drives one, and Mum drives the second one {when}, {name}.", "We have two cars. Dad drives one, and Mum drives ______ one {when}, {name}.", "the other", W_TWO, { when: ["to work", "on Sundays", "to the bazaar", "every day"], name: NAME }],
  [TWO, "He has two phones: one for work and the second for {use}, {name}.", "He has two phones: one for work and ______ for {use}, {name}.", "the other", W_TWO, { use: ["home", "family", "games", "travel"], name: NAME }],
  [TWO, "Two girls came to the {event}. One was {name}; the second was her friend.", "Two girls came to the {event}. One was {name}; ______ was her friend.", "the other", W_TWO, { event: ["party", "lesson", "meeting", "wedding"], name: ["Olga", "Lola", "Madina", "Kamila"] }],
  // the rest -> the others (5)
  [REST, "Five friends came to the {event}. {name} stayed, and the rest went home.", "Five friends came to the {event}. {name} stayed, and ______ went home.", "the others", W_REST, { event: ["party", "concert", "match", "picnic"], name: NAME }],
  [REST, "I've got one {thing}. Where are the rest, {name}?", "I've got one {thing}. Where are ______, {name}?", "the others", W_REST, { thing: ["key", "ticket", "card", "sock"], name: NAME }],
  [REST, "Ten people came. Three ate {food}; the rest ate soup, {name}.", "Ten people came. Three ate {food}; ______ ate soup, {name}.", "the others", W_REST, { food: ["plov", "fish", "salad", "manti"], name: NAME }],
  [REST, "This photo of {city} is good. The rest are dark, {name}.", "This photo of {city} is good. ______ are dark, {name}.", "The others", W_REST, { city: CITY, name: NAME }],
  [REST, "Six students passed the {test}, and the rest failed, {name}.", "Six students passed the {test}, and ______ failed, {name}.", "the others", W_REST, { test: ["test", "exam", "quiz", "driving test"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint: withThe(hint, key), key: dropThe(key), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about two people in your family: one … and the other …", "One of my … and the other …", ["exactly one sentence", "one … the other", "two people only"]],
  ["Write one sentence about a pair of things (shoes, gloves, earrings) where one is missing.", "I can find one …, but not the other.", ["exactly one sentence", "the other", "a pair"]],
  ["Write one sentence about a group where one person is different from the rest.", "… is …, but the others …", ["exactly one sentence", "the others", "no noun after the others"]],
  ["Write one sentence about two places you have lived or visited.", "One was … and the other was …", ["exactly one sentence", "the other", "past verbs"]],
  ["Write one sentence about your class, with the other + a plural noun.", "I sit with …, and the other students …", ["exactly one sentence", "the other + plural noun", "no the others + noun"]],
  ["Write one sentence about your hands or eyes.", "I use one hand for … and the other for …", ["exactly one sentence", "the other", "no another"]],
  ["Write one sentence about friends who were late.", "… came on time, but the others were late.", ["exactly one sentence", "the others", "a past verb"]],
  ["Write two sentences: one with the other and one with the others.", "I have two … The other … / … the others …", ["exactly two sentences", "the other for one of two", "the others for the rest"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe two friends who are very different.", "I have two best friends. One … The other …", ["the other", "present verbs", "three or four sentences"]],
  ["Describe your family: one person, then the others.", "My dad is … The others …", ["the others", "the other + plural", "three or four sentences"]],
  ["Write about a team or group you were part of.", "One player … The other players … The others …", ["the other + plural", "the others", "three or four sentences"]],
  ["Describe two jobs or two subjects you are choosing between.", "One is … The other is … I like …", ["one … the other", "comparisons", "three or four sentences"]],
  ["Write about a day when only one person in a group came on time.", "Only … came. The others … The other students …", ["the others", "past verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.substitution.the-other-others.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);