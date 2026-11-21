// Hand-authored: comparison / comparative / less-comparative (A2).
// Path fill P32 (Claude lane, branch grammar-path-fill-claude, 16 Nov 2026).
//
// Tests ONE point: less + adjective + than ("This exercise is less difficult
// than the last one"). The placement item sets the distractors: least, little,
// fewer.
//
// Three angles so 20 choose sentences don't all ask the same thing:
// (a) less, not fewer / little / least, before the adjective; (b) than, not
// then / from / that, after it; (c) less + the PLAIN adjective, never
// "less expensiver". Mostly long adjectives, because with short ones speakers
// prefer "not as ... as". The less / fewer choice with NOUNS is another topic
// and never appears. "more" comparatives appear only as the source of a
// transform.
//
// Run: node tools/grammar-practice/authored/comparison.comparative.less-comparative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "comparative", topic: "less-comparative", level: "A2", pv: "2.5" };
const wrongEr = (a) => (a.endsWith("e") ? `${a}r` : `${a}er`);
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];

const W_LESS = "Less + adjective + than means a smaller amount of that quality. Fewer is for things you count, and least is the superlative.";
const W_THAN = "After less + adjective, the second thing comes after than.";
const W_PLAIN = (a) => `Use less + the plain adjective: less ${a}. Less already makes the comparison, so do not add -er.`;

/* ---------------- choose: 20 mcq ---------------- */
const LESS = ["less", "least", "little", "fewer"];
const THAN = ["than", "then", "from", "that"];
const A = (prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: LESS, key: 0, why: W_LESS, slots });
const B = (prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: THAN, key: 0, why: W_THAN, slots });
const C = (a, prompt, slots) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: [`less ${a}`, `less ${wrongEr(a)}`, `lesser ${a}`, `fewer ${a}`], key: 0, why: W_PLAIN(a), slots,
});
const CHOOSE = [
  A("The {subject} homework is ______ difficult than it was last {time}.",
    { subject: ["maths", "English", "physics", "history"], time: ["week", "month", "year", "term"] }),
  A("The bus is ______ expensive than a taxi, so we take it to the {place}, {name}.",
    { place: ["airport", "station", "market", "stadium"], name: N4 }),
  A("{name}, the {place} is ______ crowded in the morning than in the evening.",
    { name: P4, place: ["market", "park", "metro", "gym"] }),
  A("I am ______ tired today than yesterday because I {did}, {name}.",
    { did: ["slept well", "went to bed early", "had a day off", "stayed at home"], name: P4 }),
  A("For {name}, sport is ______ important than {thing}.",
    { name: ["Aziz", "Lola", "my sister", "Timur"], thing: ["music", "study", "family", "books"] }),
  A("{name}, this {road} is ______ dangerous than the main road at night.",
    { name: N4, road: ["street", "path", "road", "way"] }),
  A("The new {show} is ______ interesting than the first one, {name}.",
    { show: ["film", "book", "game", "season"], name: N4 }),
  A("Tea with {extra} is ______ sweet than {drink}.",
    { extra: ["lemon", "milk", "mint", "ginger"], drink: ["juice", "cola", "compote", "lemonade"] }),
  A("My {relative} says the village is ______ noisy than the city {time}.",
    { relative: ["grandmother", "uncle", "aunt", "cousin"], time: ["at night", "in the evening", "in summer", "in the morning"] }),
  A("This {phone} is ______ popular than that one, but it is {adj}.",
    { phone: ["phone", "game", "shop", "cafe"], adj: ["cheaper", "better", "newer", "nicer"] }),
  B("Chess is less tiring ______ {sport}, {name}.",
    { sport: ["football", "cycling", "running", "swimming"], name: N4 }),
  B("{name}, the {day} lessons are less boring ______ the others.",
    { name: P4, day: ["Monday", "Tuesday", "Friday", "Saturday"] }),
  B("My new {device} was less expensive ______ my old one, {name}.",
    { device: ["phone", "laptop", "bike", "watch"], name: N4 }),
  B("{city} is less hot in {month} ______ in July.",
    { city: ["Tashkent", "Bukhara", "Termez", "Karshi"], month: ["May", "September", "October", "April"] }),
  B("This {food} is less spicy ______ the one we had {when}.",
    { food: ["soup", "sauce", "salad", "dish"], when: ["yesterday", "last week", "on Sunday", "at the cafe"] }),
  C("comfortable", "The old {seats} are ______ than the new ones, {name}.",
    { seats: ["seats", "chairs", "beds", "sofas"], name: N4 }),
  C("useful", "This {app} is ______ than the one {who} uses.",
    { app: ["app", "dictionary", "book", "website"], who: ["our teacher", "my sister", "Timur", "the class"] }),
  C("modern", "{name}, our {building} is ______ than the one in the centre.",
    { name: P4, building: ["school", "library", "hospital", "station"] }),
  C("careful", "{name} is ______ than her sister with {thing}.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], thing: ["money", "her phone", "her books", "time"] }),
  C("serious", "The second {film} is ______ than the first, so the {who} like it.",
    { film: ["film", "book", "story", "play"], who: ["children", "students", "kids", "boys"] }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const I2 = "Complete the sentence with less and the word in brackets.";
const I3 = "Complete the sentence with less, the word in brackets and than.";
const W2 = (a) => `Less + the plain adjective: less ${a}. Then than before the second thing.`;
const B2 = (a, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I2, source, key: ["less", a], why: W2(a), slots });
const B3 = (a, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I3, source, key: ["less", a, "than"], why: W2(a), slots });
const BUILD = [
  B2("expensive", "Walking is ______ ______ (expensive) than taking a taxi to the {place}, {name}.",
    { place: ["airport", "station", "market", "stadium"], name: N4 }),
  B2("difficult", "The {exam} was ______ ______ (difficult) than I thought, {name}.",
    { exam: ["exam", "test", "interview", "quiz"], name: P4 }),
  B2("nervous", "After the {thing}, I felt ______ ______ (nervous) about the {test} than before.",
    { thing: ["first question", "first minute", "teacher's smile", "short break"], test: ["test", "exam", "interview", "speech"] }),
  B2("busy", "The {street} is ______ ______ (busy) on {day} than on weekdays.",
    { street: ["street", "market", "road", "centre"], day: ["Sundays", "holidays", "Saturdays", "Fridays"] }),
  B2("heavy", "This {bag} is ______ ______ (heavy) than it looks, {name}.",
    { bag: ["bag", "box", "suitcase", "table"], name: N4 }),
  B2("shy", "{name} is ______ ______ (shy) than last year. Now she talks to {who}.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], who: ["everyone", "the whole class", "new people", "the teachers"] }),
  B2("cold", "The {water} is ______ ______ (cold) in {month} than in spring.",
    { water: ["river", "lake", "sea", "water"], month: ["July", "August", "June", "September"] }),
  B2("boring", "The {film} was ______ ______ (boring) than the book, {name}.",
    { film: ["film", "play", "cartoon", "series"], name: N4 }),
  B2("strict", "Our new {teacher} is ______ ______ (strict) than the old one about {thing}.",
    { teacher: ["teacher", "coach", "trainer", "director"], thing: ["homework", "phones", "being late", "noise"] }),
  B2("dangerous", "The {road} to the {place} is ______ ______ (dangerous) in summer than in winter.",
    { road: ["road", "path", "bridge", "way"], place: ["village", "lake", "mountains", "farm"] }),
  B2("hungry", "I am ______ ______ (hungry) than you because I had {food}, {name}.",
    { food: ["a big lunch", "two sandwiches", "plov at noon", "soup at school"], name: N4 }),
  B2("tidy", "{name}'s room is ______ ______ (tidy) than mine. There are {things} on the floor.",
    { name: ["Aziz", "Timur", "My brother", "Bobur"], things: ["clothes", "books", "socks", "papers"] }),
  B3("expensive", "This {shop} is ______ ______ ______ (expensive) the one near the {place}.",
    { shop: ["shop", "cafe", "bakery", "market"], place: ["station", "school", "park", "bank"] }),
  B3("interesting", "For me, {subj} is ______ ______ ______ (interesting) {subj2}.",
    { subj: ["physics", "geometry", "chemistry", "maths"], subj2: ["history", "music", "art", "biology"] }),
  B3("noisy", "The village is ______ ______ ______ (noisy) the city, so {who} sleeps well there.",
    { who: ["Grandma", "my father", "everyone", "the baby"] }),
  B3("important", "Today's {task} is ______ ______ ______ (important) tomorrow's {task}, {name}.",
    { task: ["test", "meeting", "lesson", "match"], name: N4 }),
  B3("comfortable", "{name}, the {seat} at the back is ______ ______ ______ (comfortable) the one at the front.",
    { name: P4, seat: ["seat", "chair", "place", "bench"] }),
  B3("friendly", "{name} thinks a {pet} is ______ ______ ______ (friendly) a dog.",
    { name: ["Aziz", "Lola", "My sister", "Timur"], pet: ["cat", "rabbit", "parrot", "fish"] }),
  B3("exciting", "The second {half} was ______ ______ ______ (exciting) the first, {name}.",
    { half: ["half", "game", "film", "part"], name: N4 }),
  B3("worried", "My {relative} is ______ ______ ______ (worried) my mother about the {thing}.",
    { relative: ["father", "aunt", "grandmother", "uncle"], thing: ["exam", "trip", "weather", "move"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOT_AS = "Say the same thing with less ... than.";
const SIDE = "Say the same thing from the other side. Use less.";
const FIX = "Correct the mistake.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const W_NA = (a) => `Not as ${a} as means the same as less ${a} than.`;
const W_SIDE = (a) => `If one thing is more ${a}, the other is less ${a}: less + the plain adjective.`;
const TRANSFORM = [
  // not as ... as -> less ... than (5)
  T(NOT_AS, "The bus is not as expensive as the {taxi}, {name}.", "The bus is ______ ______ than the {taxi}, {name}.", ["less", "expensive"], W_NA("expensive"),
    { taxi: ["taxi", "train", "plane", "metro"], name: N4 }),
  T(NOT_AS, "For me, {subj} is not as difficult as {subj2}.", "For me, {subj} is ______ ______ than {subj2}.", ["less", "difficult"], W_NA("difficult"),
    { subj: ["English", "history", "art", "music"], subj2: ["maths", "physics", "chemistry", "geometry"] }),
  T(NOT_AS, "The {place} is not as crowded as the {place2} today.", "The {place} is ______ ______ than the {place2} today.", ["less", "crowded"], W_NA("crowded"),
    { place: ["park", "library", "gym", "cafe"], place2: ["market", "station", "centre", "stadium"] }),
  T(NOT_AS, "This {thing} is not as useful as that one, {name}.", "This {thing} is ______ ______ than that one, {name}.", ["less", "useful"], W_NA("useful"),
    { thing: ["app", "book", "tool", "map"], name: N4 }),
  T(NOT_AS, "My {relative} is not as strict as my {relative2}.", "My {relative} is ______ ______ than my {relative2}.", ["less", "strict"], W_NA("strict"),
    { relative: ["mother", "aunt", "grandmother", "sister"], relative2: ["father", "uncle", "grandfather", "brother"] }),
  // more -> less, from the other side (5)
  T(SIDE, "The red {item} is more expensive than the blue one, {name}.", "The blue {item} is ______ ______ than the red one, {name}.", ["less", "expensive"], W_SIDE("expensive"),
    { item: ["bag", "jacket", "bike", "lamp"], name: P4 }),
  T(SIDE, "At our school, {sport} is more popular than {sport2}.", "At our school, {sport2} is ______ ______ than {sport}.", ["less", "popular"], W_SIDE("popular"),
    { sport: ["football", "basketball", "volleyball", "wrestling"], sport2: ["tennis", "chess", "badminton", "swimming"] }),
  T(SIDE, "The first {part} was more interesting than the second, {name}.", "The second {part} was ______ ______ than the first, {name}.", ["less", "interesting"], W_SIDE("interesting"),
    { part: ["part", "lesson", "film", "chapter"], name: N4 }),
  T(SIDE, "In {season}, city life is more tiring than village life for my {relative}.", "In {season}, village life is ______ ______ than city life for my {relative}.", ["less", "tiring"], W_SIDE("tiring"),
    { season: ["summer", "winter", "spring", "autumn"], relative: ["grandmother", "father", "uncle", "aunt"] }),
  T(SIDE, "The {road} at night is more dangerous than in the daytime, {name}.", "The {road} in the daytime is ______ ______ than at night, {name}.", ["less", "dangerous"], W_SIDE("dangerous"),
    { road: ["road", "street", "bridge", "park"], name: N4 }),
  // correct a mistake (5)
  T(FIX, "This {item} is less expensiver than that one, {name}.", "This {item} is ______ ______ than that one, {name}.", ["less", "expensive"], W_PLAIN("expensive"),
    { item: ["phone", "watch", "bike", "laptop"], name: N4 }),
  T(FIX, "The {test} was fewer difficult than the last one, {name}.", "The {test} was ______ ______ than the last one, {name}.", ["less", "difficult"],
    "Before an adjective use less. Fewer is only for things you can count.",
    { test: ["test", "exam", "quiz", "lesson"], name: P4 }),
  T(FIX, "Tea is less sweet then {drink}, {name}.", "Tea is less sweet ______ {drink}, {name}.", "than",
    "After less + adjective we use than, not then. Then is about time.",
    { drink: ["juice", "cola", "lemonade", "compote"], name: N4 }),
  T(FIX, "The {place} is little crowded than the market, {name}.", "The {place} is ______ ______ than the market, {name}.", ["less", "crowded"],
    "To compare, use less + adjective + than. Little does not compare two things.",
    { place: ["park", "library", "gym", "cafe"], name: N4 }),
  T(FIX, "This {film} is less interesting from the book, {name}.", "This {film} is less interesting ______ the book, {name}.", "than",
    "In English the second thing comes after than, not from.",
    { film: ["film", "play", "cartoon", "series"], name: P4 }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence comparing two school subjects with less difficult or less interesting.", "less + adjective + than",
    ["exactly one sentence", "must name two subjects", "must use less and than"]],
  ["Write one sentence comparing two ways to travel with less expensive or less comfortable.", "less + adjective + than",
    ["exactly one sentence", "must name two kinds of transport", "must use less and than"]],
  ["Write one sentence about two places near you. Which one is less crowded or less noisy?", "less + adjective + than",
    ["exactly one sentence", "must name two places", "must use less and than"]],
  ["Write one sentence about how you feel today compared with yesterday. Use less tired, less nervous or less busy.", "less + adjective + than yesterday",
    ["exactly one sentence", "must be about you", "must use less and than"]],
  ["Write one sentence comparing two films, books or games with less.", "less + adjective + than",
    ["exactly one sentence", "must name two things", "must not add -er to the adjective"]],
  ["Write one sentence comparing two foods or drinks. Use less sweet, less spicy or less healthy.", "less + adjective + than",
    ["exactly one sentence", "must name two foods or drinks", "must use less and than"]],
  ["Your friend says: \"A taxi is more expensive than the bus.\" Write the same idea starting with \"The bus\".", "The bus is less expensive than a taxi",
    ["exactly one sentence", "must start with The bus", "must use less and than"]],
  ["Write two sentences about two people you know. Use less + adjective in both.", "two comparisons with less + adjective + than",
    ["exactly two sentences", "two different adjectives", "must use less and than in both"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare this school year with last year. What is less difficult, less boring or less important now? Write three or four sentences.",
    "less + adjective + than", ["less before a plain adjective", "than before the second thing", "no -er after less"]],
  ["Compare life in a city and life in a village. Write three or four sentences and use less at least twice.",
    "less + adjective + than", ["less crowded, less noisy or less expensive", "than", "two things compared"]],
  ["Compare two phones, laptops or bikes. Which one is less expensive, less modern or less useful? Write three or four sentences.",
    "less + adjective + than", ["less + a long adjective", "than", "no fewer before an adjective"]],
  ["Compare two jobs. Which one is less dangerous, less tiring or less interesting? Write three or four sentences.",
    "less + adjective + than", ["less + adjective", "than", "a reason for at least one comparison"]],
  ["Compare weekdays and weekends in your life. Write three or four sentences and use less at least twice.",
    "less + adjective + than", ["less busy, less tired or less stressful", "than", "two parts of the week compared"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.comparative.less-comparative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
