// Hand-authored: comparison / superlative / irregular-superlative (A2).
// Path fill P33 (Claude lane, branch grammar-path-fill-claude, 16 Nov 2026).
//
// Tests ONE point: good -> the best and bad -> the worst, with "the"
// ("This is the best restaurant in town"). The placement item's distractors
// are good, better and most good.
//
// Kept apart from est-superlative (regular -est): only best and worst are
// keyed. Every sentence has a superlative frame (in our class, of the year, in
// town), so the comparative (better / worse) is wrong, not just weaker.
// Distractors: goodest / baddest, most good / most bad, the comparative, and
// a missing "the". "best" without "the" is only a distractor before a noun
// ("is best player"), where it is always wrong.
//
// Run: node tools/grammar-practice/authored/comparison.superlative.irregular-superlative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "superlative", topic: "irregular-superlative", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const W = {
  g: "The superlative of good is the best: good, better, the best. There is no goodest or most good.",
  w: "The superlative of bad is the worst: bad, worse, the worst. There is no baddest or most bad.",
};
const O = {
  G: ["the best", "the goodest", "the most good", "the better"],
  W: ["the worst", "the baddest", "the most bad", "the worse"],
  g: ["best", "goodest", "better", "most good"],
  w: ["worst", "baddest", "worse", "most bad"],
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["G", "{name} is ______ player in our {team}.",
    { name: ["Aziz", "Timur", "Lola", "Madina"], team: ["team", "school", "class", "club"] }],
  ["G", "This is ______ {food} in town, {name}. Try it!",
    { food: ["plov", "bread", "ice cream", "pizza"], name: N4 }],
  ["G", "{day} is ______ day of the week for me because I {do}.",
    { day: ["Saturday", "Sunday", "Friday", "Wednesday"], do: ["play football", "see my friends", "sleep late", "have no homework"] }],
  ["G", "My {relative} makes ______ {dish} in our family.",
    { relative: ["grandmother", "mother", "aunt", "father"], dish: ["soup", "bread", "salads", "cakes"] }],
  ["G", "For {name}, summer is ______ season of the year. It is time for {thing}.",
    { name: ["Aziz", "Lola", "my sister", "Timur"], thing: ["swimming", "holidays", "fruit", "long days"] }],
  ["G", "What is ______ way to learn new {things}, {name}?",
    { things: ["words", "songs", "rules", "names"], name: N4 }],
  ["W", "Monday is ______ day of the week for {name}. There is a {thing} every Monday.",
    { name: ["Aziz", "Lola", "my brother", "Timur"], thing: ["test", "long lesson", "meeting", "big test"] }],
  ["W", "That was ______ {film} of the year, {name}. I fell asleep.",
    { film: ["film", "match", "concert", "show"], name: N4 }],
  ["W", "Winter is ______ time for {activity} in our {place}.",
    { activity: ["cycling", "picnics", "football", "long walks"], place: ["town", "village", "city", "street"] }],
  ["W", "This is ______ road in the {place}. It is full of {things}.",
    { place: ["town", "village", "city", "area"], things: ["holes", "stones", "cracks", "water"] }],
  ["W", "My {subject} mark was ______ in the class, {name}. I am so sad.",
    { subject: ["maths", "physics", "English", "history"], name: P4 }],
  ["g", "Who is the ______ {person} in your {group}, {name}?",
    { person: ["singer", "dancer", "cook", "student"], group: ["family", "class", "group", "school"], name: N4 }],
  ["g", "This {shop} has the ______ {thing} in the city.",
    { shop: ["shop", "cafe", "bakery", "market"], thing: ["prices", "bread", "coffee", "fruit"] }],
  ["g", "{name} got the ______ mark in the {test}: 100 out of 100.",
    { name: ["Aziz", "Lola", "My sister", "Timur"], test: ["test", "exam", "quiz", "competition"] }],
  ["g", "It was the ______ {event} of my life, {name}!",
    { event: ["day", "holiday", "trip", "birthday"], name: N4 }],
  ["g", "Our {team} has the ______ coach in the {area}.",
    { team: ["team", "club", "school", "gym"], area: ["city", "region", "country", "town"] }],
  ["w", "It was the ______ {event} of the year for our team. We lost {score}.",
    { event: ["game", "match", "day", "week"], score: ["5-0", "6-1", "4-0", "7-2"] }],
  ["w", "{name} had the ______ {thing} in the class, so the teacher helped him.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], thing: ["mark", "result", "score", "handwriting"] }],
  ["w", "This is the ______ {weather} of the winter, {name}. Stay at home.",
    { weather: ["weather", "storm", "day", "snow"], name: N4 }],
  ["w", "The {thing} was the ______ part of the {trip}.",
    { thing: ["food", "weather", "hotel", "bus ride"], trip: ["trip", "holiday", "journey", "weekend"] }],
].map(([k, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: O[k], key: 0, why: W[k.toLowerCase()], slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const I1 = "Write the superlative of the word in brackets.";
const I2 = "Write the superlative of the word in brackets. Do not forget the.";
const b1 = (k, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I1, source, key: k === "g" ? "best" : "worst", why: W[k], slots });
const b2 = (k, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I2, source, key: ["the", k === "g" ? "best" : "worst"], why: W[k], slots });
const BUILD = [
  b1("g", "{name} is the ______ (good) student in our {group}.",
    { name: ["Lola", "Aziz", "Madina", "Timur"], group: ["class", "group", "school", "year"] }),
  b1("g", "This cafe makes the ______ (good) {food} in the {place}.",
    { food: ["samsa", "coffee", "soup", "cakes"], place: ["city", "area", "street", "town"] }),
  b1("g", "{name}, what is the ______ (good) {thing} on your phone?",
    { name: N4, thing: ["game", "app", "photo", "song"] }),
  b1("g", "My {relative} gives the ______ (good) advice about {topic}.",
    { relative: ["grandfather", "mother", "aunt", "older brother"], topic: ["school", "money", "friends", "work"] }),
  b1("g", "The {season} holidays are the ______ (good) time of the year, {name}.",
    { season: ["summer", "winter", "spring", "New Year"], name: N4 }),
  b1("g", "We had the ______ (good) seats in the {place}, right at the {where}.",
    { place: ["cinema", "theatre", "stadium", "hall"], where: ["front", "centre", "top", "side"] }),
  b1("w", "It was the ______ (bad) {thing} of my school life, {name}.",
    { thing: ["day", "exam", "mark", "week"], name: P4 }),
  b1("w", "This {place} has the ______ (bad) {thing} in the city.",
    { place: ["cafe", "shop", "hotel", "station"], thing: ["service", "coffee", "prices", "toilets"] }),
  b1("w", "{name} says {day} is the ______ (bad) day for a test.",
    { name: ["Aziz", "Lola", "My sister", "Timur"], day: ["Monday", "Friday", "Saturday", "Sunday"] }),
  b1("w", "The {time} is the ______ (bad) time to drive through the {place}.",
    { time: ["morning", "evening", "rush hour", "afternoon"], place: ["centre", "market", "old city", "main street"] }),
  b1("w", "That was the ______ (bad) {thing} I can remember, {name}.",
    { thing: ["storm", "winter", "match", "journey"], name: N4 }),
  b1("w", "The second {part} was the ______ (bad) part of the whole {show}.",
    { part: ["song", "scene", "half", "story"], show: ["show", "concert", "film", "evening"] }),
  b2("g", "{name}, this is ______ ______ (good) {thing} I have.",
    { name: N4, thing: ["jacket", "photo", "idea", "pen"] }),
  b2("g", "Who is ______ ______ (good) {person} in your family, {name}?",
    { person: ["cook", "driver", "singer", "storyteller"], name: N4 }),
  b2("g", "{city} is ______ ______ (good) place for a {trip}, I think.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Chimgan"], trip: ["weekend", "holiday", "school trip", "family trip"] }),
  b2("g", "For me, {thing} is ______ ______ (good) way to relax after {time}.",
    { thing: ["music", "a walk", "football", "a film"], time: ["school", "work", "an exam", "a long day"] }),
  b2("w", "{name}, this is ______ ______ (bad) {thing} in the shop. Don't buy it.",
    { name: P4, thing: ["phone", "bag", "jacket", "laptop"] }),
  b2("w", "{month} is ______ ______ (bad) month for {who} because of the weather.",
    { month: ["January", "February", "December", "November"], who: ["drivers", "farmers", "cyclists", "builders"] }),
  b2("w", "That was ______ ______ (bad) {meal} of the trip, {name}.",
    { meal: ["meal", "lunch", "dinner", "breakfast"], name: N4 }),
  b2("w", "My {relative} thinks {thing} is ______ ______ (bad) thing for children.",
    { relative: ["grandmother", "father", "aunt", "uncle"], thing: ["too much sugar", "no sleep", "too much TV", "no sport"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SUP = "Say the same thing with a superlative.";
const FIX = "Correct the mistake.";
const OPP = "Write the opposite idea. Change only the superlative.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // comparative with "no ..." -> superlative (5)
  T(SUP, "No {thing} in town is better than this one, {name}.", "This is ______ ______ {thing} in town, {name}.", ["the", "best"],
    "If nothing is better, this one is the best. Good, better, the best.",
    { thing: ["cafe", "shop", "park", "school"], name: N4 }),
  T(SUP, "{name}, no day of the week is worse than {day} for me.", "{name}, {day} is ______ ______ day of the week for me.", ["the", "worst"],
    "If no day is worse, this day is the worst. Bad, worse, the worst.",
    { name: P4, day: ["Monday", "Tuesday", "Thursday", "Sunday"] }),
  T(SUP, "Nobody in our {group} is better at {subj} than Lola.", "Lola is ______ ______ in our {group} at {subj}.", ["the", "best"],
    "If nobody is better, Lola is the best. Good, better, the best.",
    { group: ["class", "school", "group", "club"], subj: ["maths", "English", "chess", "drawing"] }),
  T(SUP, "No film this {period} was worse than this one, {name}.", "This was ______ ______ film this {period}, {name}.", ["the", "worst"],
    "If no film was worse, this one was the worst. Bad, worse, the worst.",
    { period: ["year", "month", "summer", "winter"], name: N4 }),
  T(SUP, "{name}, no one in my family is a better cook than my {relative}.", "{name}, my {relative} is ______ ______ cook in my family.", ["the", "best"],
    "If no one is better, this person is the best. Good, better, the best.",
    { name: N4, relative: ["grandmother", "father", "aunt", "uncle"] }),
  // correct a mistake (5)
  T(FIX, "This is the goodest {food} in the city, {name}.", "This is the ______ {food} in the city, {name}.", "best", W.g,
    { food: ["plov", "bread", "tea", "ice cream"], name: N4 }),
  T(FIX, "It was the baddest {day} of the {period}.", "It was the ______ {day} of the {period}.", "worst", W.w,
    { day: ["day", "match", "exam", "trip"], period: ["year", "month", "week", "season"] }),
  T(FIX, "{name} is the most good {person} in our school.", "{name} is the ______ {person} in our school.", "best", W.g,
    { name: ["Aziz", "Lola", "Madina", "Timur"], person: ["singer", "runner", "artist", "player"] }),
  T(FIX, "This is the worse {thing} in the {place}, {name}.", "This is the ______ {thing} in the {place}, {name}.", "worst",
    "Worse compares two things. For the top of a whole group, use the worst.",
    { thing: ["road", "cafe", "hotel", "street"], place: ["town", "city", "area", "village"], name: P4 }),
  T(FIX, "{name} is best {person} in our class.", "{name} is ______ ______ {person} in our class.", ["the", "best"],
    "A superlative before a noun needs the: the best.",
    { name: ["Aziz", "Lola", "Madina", "Timur"], person: ["student", "singer", "speaker", "reader"] }),
  // opposite (5)
  T(OPP, "{day} is the best day of the week for {name}.", "{day} is the ______ day of the week for {name}.", "worst",
    "The opposite of the best is the worst.",
    { day: ["Monday", "Friday", "Saturday", "Sunday"], name: ["Aziz", "Lola", "my sister", "Timur"] }),
  T(OPP, "This is the worst {food} I know, {name}.", "This is the ______ {food} I know, {name}.", "best",
    "The opposite of the worst is the best.",
    { food: ["soup", "pizza", "coffee", "bread"], name: N4 }),
  T(OPP, "The {thing} was the best part of the {trip}.", "The {thing} was the ______ part of the {trip}.", "worst",
    "The opposite of the best is the worst.",
    { thing: ["food", "weather", "hotel", "music"], trip: ["trip", "holiday", "weekend", "journey"] }),
  T(OPP, "{name} had the worst {result} in the group.", "{name} had the ______ {result} in the group.", "best",
    "The opposite of the worst is the best.",
    { name: ["Aziz", "Lola", "Madina", "Timur"], result: ["result", "score", "mark", "time"] }),
  T(OPP, "Winter is the worst season for {sport} in {place}.", "Winter is the ______ season for {sport} in {place}.", "best",
    "The opposite of the worst is the best.",
    { sport: ["running", "cycling", "football", "tennis"], place: ["our town", "the mountains", "my village", "the city"] }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the best day of your week.", "the best + noun", ["exactly one sentence", "must use the best", "must name a day"]],
  ["Write one sentence about the worst weather you remember.", "the worst + noun", ["exactly one sentence", "must use the worst", "must be about weather"]],
  ["Who is the best cook in your family? Answer in one sentence.", "the best + noun", ["exactly one sentence", "must use the best", "must name a family member"]],
  ["Write one sentence about the best place in your town or village.", "the best + noun + in", ["exactly one sentence", "must use the best", "must name a place"]],
  ["Write one sentence about the worst film, game or book you know.", "the worst + noun", ["exactly one sentence", "must use the worst", "must name the film, game or book"]],
  ["Write one sentence about the best way to learn English words.", "the best way to + verb", ["exactly one sentence", "must use the best way", "must be about learning words"]],
  ["Write two sentences: the best thing and the worst thing about your school or job.", "the best and the worst", ["exactly two sentences", "must use the best", "must use the worst"]],
  ["A friend wrote: \"It was the goodest day of my life.\" Write the sentence correctly.", "the best day", ["exactly one sentence", "must use the best", "must not use goodest"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell me about the best day of your life so far. What happened? Write three or four sentences.",
    "the best + noun", ["the best with the", "no goodest or most good", "past tense for the story"]],
  ["What is the best thing and the worst thing about your town or village? Write three or four sentences.",
    "the best and the worst", ["the best", "the worst", "a reason for each"]],
  ["Who is the best teacher, coach or trainer you know? Why? Write three or four sentences.",
    "the best + noun", ["the best with the", "a reason", "no most good"]],
  ["What is the worst food you have tried and the best food you know? Write three or four sentences.",
    "the best and the worst", ["the worst", "the best", "no baddest"]],
  ["A visitor asks you: what is the best season to visit Uzbekistan, and what is the worst? Answer in three or four sentences.",
    "the best and the worst + season", ["the best season", "the worst season", "a reason for each"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.superlative.irregular-superlative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
