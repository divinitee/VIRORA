// Hand-authored: comparison / comparative / double-comparative-error (A2).
// Path fill P31 (Claude lane, branch grammar-path-fill-claude, 16 Nov 2026).
//
// Tests ONE point: a comparative carries ONE mark. Short adjectives take -er,
// long ones take more, and better / worse take neither: never "more bigger",
// "more easier", "more better". The placement item is a correction of exactly
// this error.
//
// Kept apart from its siblings: er-comparative teaches forming -er and
// more-comparative teaches more + long adjective. Here every choose item
// offers a double-marked form, the stage mixes short, -y, long and irregular
// adjectives, and the transform stage makes the learner SWITCH marker
// (more expensive -> cheaper, easier -> more difficult), which is where the
// double mark appears. -y adjectives never get a "more happy" distractor
// (heard from natives); they get the spelling error instead. "less" belongs
// to less-comparative and is never used.
//
// Run: node tools/grammar-practice/authored/comparison.comparative.double-comparative-error.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "comparative", topic: "double-comparative-error", level: "A2", pv: "2.5" };
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const wrongEr = (a) => (a.endsWith("e") ? `${a}r` : `${a}er`);

// kind: s = short (-er), y = ends in -y (-ier), l = long (more), g = good / bad
const OPTS = {
  s: (a, c) => [c, `more ${c}`, `more ${a}`, `most ${a}`],
  y: (a, c) => [c, `more ${c}`, `${a}er`, `most ${a}`],
  l: (a) => [`more ${a}`, `more ${wrongEr(a)}`, wrongEr(a), `most ${a}`],
  g: (a, c) => (a === "good" ? [c, "more better", "gooder", "more good"] : [c, "more worse", "worser", "badder"]),
};
const WHY = {
  s: (a, c) => `${cap(a)} is a short adjective, so the comparative is ${c}. One mark is enough: -er or more, never both.`,
  y: (a, c) => `${cap(a)} ends in -y, so the comparative is ${c}. It already has -er, so do not add more.`,
  l: (a) => `${cap(a)} is a long adjective, so the comparative is more ${a}. Do not add -er as well.`,
  g: (a, c) => `The comparative of ${a} is ${c}. It is already a comparative, so do not add more or -er.`,
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["s", "cheap", "cheaper", "{name}, this {item} is ______ than the one in the other shop.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], item: ["jacket", "bag", "phone", "watch"] }],
  ["s", "tall", "taller", "My {relative} is ______ than my father now, {name}.",
    { relative: ["brother", "cousin", "nephew", "little brother"], name: ["Lola", "Timur", "Madina", "Sardor"] }],
  ["s", "fast", "faster", "The {train} to {city} is ______ than the bus.",
    { train: ["train", "new train", "morning train", "express train"], city: ["Samarkand", "Bukhara", "Andijan", "Karshi"] }],
  ["s", "old", "older", "Our school is ______ than the {building} next to it, {name}.",
    { building: ["library", "hospital", "bank", "museum"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["s", "big", "bigger", "My new {room} is ______ than my old one, so I have space for a {thing}.",
    { room: ["room", "bedroom", "flat", "office"], thing: ["desk", "sofa", "bookcase", "big table"] }],
  ["s", "cold", "colder", "It is ______ in the {place} than in the city, so take a {thing}.",
    { place: ["mountains", "village", "hills", "valley"], thing: ["jacket", "coat", "sweater", "scarf"] }],
  ["s", "young", "younger", "{name} is ______ than me, but we are in the same {group}.",
    { name: ["Lola", "Timur", "Madina", "Bobur"], group: ["class", "team", "group", "club"] }],
  ["s", "long", "longer", "The {thing} to the {place} is ______ than I thought.",
    { thing: ["road", "walk", "way", "bus ride"], place: ["lake", "village", "airport", "stadium"] }],
  ["y", "easy", "easier", "This {task} is ______ than the last one, {name}.",
    { task: ["exercise", "test", "game", "puzzle"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["y", "busy", "busier", "The {place} is ______ than usual today because of the {event}.",
    { place: ["market", "station", "city centre", "park"], event: ["holiday", "festival", "concert", "football match"] }],
  ["y", "happy", "happier", "{name} looks ______ than yesterday. Maybe the {thing} went well.",
    { name: ["Aziz", "Lola", "My sister", "Grandpa"], thing: ["test", "interview", "exam", "match"] }],
  ["y", "heavy", "heavier", "My {bag} is ______ than yours because I have {things} in it.",
    { bag: ["bag", "backpack", "suitcase", "box"], things: ["books", "shoes", "presents", "tools"] }],
  ["l", "expensive", "", "A taxi to the {place} is ______ than the bus, so I only take one {when}.",
    { place: ["airport", "station", "city centre", "market"], when: ["at night", "when it rains", "when I am late", "on holidays"] }],
  ["l", "interesting", "", "For me, {subject} is ______ than {subject2}.",
    { subject: ["history", "biology", "art", "music"], subject2: ["maths", "physics", "chemistry", "geometry"] }],
  ["l", "comfortable", "", "These {shoes} are ______ than my old ones, {name}.",
    { shoes: ["shoes", "trainers", "boots", "sandals"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["l", "difficult", "", "The second {part} of the {test} was ______ than the first.",
    { part: ["part", "half", "section", "task"], test: ["test", "exam", "quiz", "lesson"] }],
  ["g", "good", "better", "Your English is ______ than mine, {name}. How do you {verb}?",
    { name: ["Aziz", "Olga", "Timur", "Lola"], verb: ["study", "learn new words", "remember everything", "do it"] }],
  ["g", "good", "better", "The food at {place} is ______ than at the school canteen. It is also {adj}.",
    { place: ["home", "my aunt's house", "the new cafe", "Grandma's house"], adj: ["cheaper", "hotter", "fresher", "healthier"] }],
  ["g", "bad", "worse", "The weather today is ______ than yesterday. Take {thing}, {name}.",
    { thing: ["an umbrella", "a coat", "your boots", "a hat"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["g", "bad", "worse", "My {thing} was ______ than last time. I need to {fix}.",
    { thing: ["mark", "score", "result", "test"], fix: ["study more", "work harder", "read more", "sleep earlier"] }],
].map(([k, a, c, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS[k](a, c), key: 0, why: WHY[k](a, c), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the comparative of the word in brackets. Use one mark only: -er or more, never both.";
const BUILD = [
  ["s", "small", "smaller", "My brother's room is ______ (small) than mine, but it has a {thing}, {name}.",
    { thing: ["balcony", "big window", "new desk", "nice view"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["s", "warm", "warmer", "It is ______ (warm) today than it was on {day}, {name}.",
    { day: ["Monday", "Tuesday", "Friday", "Sunday"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["s", "short", "shorter", "This {way} to the {place} is ______ (short) than the main road.",
    { way: ["way", "path", "street", "route"], place: ["school", "market", "station", "river"] }],
  ["s", "strong", "stronger", "{name} is ______ (strong) than his brother, so he carries the {thing}.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], thing: ["boxes", "water", "heavy bags", "chairs"] }],
  ["s", "clean", "cleaner", "The air in the {place} is ______ (clean) than in the city, {name}.",
    { place: ["mountains", "village", "countryside", "hills"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["s", "hot", "hotter", "The {food} is ______ (hot) than the tea, so wait a minute, {name}.",
    { food: ["soup", "plov", "bread", "milk"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["s", "thin", "thinner", "My new {device} is ______ (thin) than my old one and fits in my {place}.",
    { device: ["phone", "laptop", "tablet", "notebook"], place: ["bag", "backpack", "school bag", "small bag"] }],
  ["s", "late", "later", "The {bus} leaves ______ (late) than usual on {day}.",
    { bus: ["bus", "train", "minibus", "first bus"], day: ["Sundays", "Fridays", "holidays", "Saturdays"] }],
  ["y", "early", "earlier", "{name} gets up ______ (early) than me to {do}.",
    { name: ["Aziz", "Lola", "My sister", "Grandpa"], do: ["make breakfast", "study", "go running", "catch the bus"] }],
  ["y", "noisy", "noisier", "Our street is ______ (noisy) than yours because of the {thing}, {name}.",
    { thing: ["market", "buses", "school", "building work"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["y", "funny", "funnier", "The new {show} is ______ (funny) than the old one. We laughed {how}.",
    { show: ["film", "cartoon", "show", "video"], how: ["a lot", "all evening", "so much", "for an hour"] }],
  ["y", "dirty", "dirtier", "My {shoes} are ______ (dirty) than yours after the {event}.",
    { shoes: ["shoes", "boots", "trainers", "jeans"], event: ["match", "walk", "trip", "rain"] }],
  ["y", "hungry", "hungrier", "I am ______ (hungry) than I was {when}, {name}.",
    { when: ["this morning", "an hour ago", "at lunch", "before the lesson"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["g", "good", "better", "I feel ______ (good) than yesterday, so I can go to {place}, {name}.",
    { place: ["school", "work", "the lesson", "training"], name: ["Mum", "Dad", "Grandma", "Olga"] }],
  ["g", "good", "better", "{name} is ______ (good) than me at {game}.",
    { name: ["Aziz", "Lola", "My sister", "Timur"], game: ["chess", "tennis", "football", "maths"] }],
  ["g", "bad", "worse", "The {road} is ______ (bad) than last year. There are {things} everywhere.",
    { road: ["road", "street", "path", "bridge"], things: ["holes", "stones", "cracks", "puddles"] }],
  ["g", "bad", "worse", "My headache is ______ (bad) than it was {when}, {name}.",
    { when: ["this morning", "an hour ago", "at school", "before lunch"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["l", "popular", "", "Football is ______ ______ (popular) than {sport} in our {place}.",
    { sport: ["tennis", "chess", "volleyball", "basketball"], place: ["school", "class", "town", "street"] }],
  ["l", "careful", "", "Please be ______ ______ (careful) than last time with the {thing}, {name}.",
    { thing: ["glasses", "plates", "paint", "keys"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["l", "tired", "", "{name} is ______ ______ (tired) than usual after the {event}.",
    { name: ["Aziz", "Lola", "My sister", "Grandpa"], event: ["trip", "match", "exam", "long walk"] }],
].map(([k, a, c, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: k === "l" ? ["more", a] : c, why: WHY[k](a, c), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "This sentence marks the comparative twice. Write the correct comparative.";
const SWAP = "Say the same thing from the other side. Use the comparative of the word in brackets, with one mark only.";
const JOIN = "Join the two facts into one sentence. Use the comparative of the word in brackets, with one mark only.";
const TRANSFORM = [
  // correct a double comparative (5)
  [FIX, "This {item} is more cheaper than the one {where}.", "This {item} is ______ than the one {where}.", "cheaper",
    "Cheap is a short adjective: cheaper. More cheaper marks the comparative twice.",
    { item: ["bag", "shirt", "watch", "lamp"], where: ["in the window", "online", "at the market", "in the other shop"] }],
  [FIX, "My {relative} is more older than me, but I am {adj}.", "My {relative} is ______ than me, but I am {adj}.", "older",
    "Old is a short adjective: older. More older marks the comparative twice.",
    { relative: ["sister", "brother", "cousin", "friend"], adj: ["taller", "faster", "stronger", "quicker"] }],
  [FIX, "The exam was more easier than the {thing}, {name}.", "The exam was ______ than the {thing}, {name}.", "easier",
    "Easy becomes easier. It already has -er, so more is not needed.",
    { thing: ["homework", "last test", "practice test", "first one"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [FIX, "This sofa is more comfortabler than the {thing} in the {room}.", "This sofa is ______ than the {thing} in the {room}.", "more comfortable",
    "Comfortable is a long adjective: more comfortable. Do not add -er as well.",
    { thing: ["chairs", "bed", "old one", "armchair"], room: ["living room", "hall", "kitchen", "office"] }],
  [FIX, "Your idea is more better than mine, {name}. Let's {do}.", "Your idea is ______ than mine, {name}. Let's {do}.", "better",
    "Better is already the comparative of good, so more is not needed.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], do: ["try it", "use it", "tell the teacher", "start now"] }],
  // switch the marker: more -> -er, -er -> more (5)
  [SWAP, "A taxi to the {place} is more expensive than the {bus}.", "The {bus} to the {place} is ______ (cheap) than a taxi.", "cheaper",
    "Expensive takes more, but cheap is short and takes -er: cheaper, not more cheaper.",
    { place: ["airport", "station", "city centre", "stadium"], bus: ["bus", "metro", "minibus", "tram"] }],
  [SWAP, "The {subj} test was more difficult than the {subj2} test.", "The {subj2} test was ______ (easy) than the {subj} test.", "easier",
    "Difficult takes more, but easy takes -er: easier, not more easier.",
    { subj: ["maths", "physics", "chemistry", "history"], subj2: ["English", "art", "music", "biology"] }],
  [SWAP, "The main road is more dangerous than this {street} {time}.", "This {street} is ______ (safe) than the main road {time}.", "safer",
    "Dangerous takes more, but safe is short and takes -r: safer, not more safer.",
    { street: ["street", "path", "road", "way"], time: ["at night", "in the rush hour", "in winter", "in the dark"] }],
  [SWAP, "This {exercise} is easier than that one, {name}.", "That {exercise} is ______ ______ (difficult) than this one, {name}.", ["more", "difficult"],
    "Easy takes -er, but difficult is long and takes more: more difficult, with no -er.",
    { exercise: ["exercise", "question", "game", "level"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [SWAP, "The {shop} near my house is cheaper than the one in the centre, {name}.", "The one in the centre is ______ ______ (expensive) than the {shop} near my house, {name}.", ["more", "expensive"],
    "Cheap takes -er, but expensive is long and takes more: more expensive, with no -er.",
    { shop: ["shop", "cafe", "market", "bakery"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  // join two facts (5)
  [JOIN, "{name} got 70 points in the {test}. I got 90 points.", "My result in the {test} was ______ (good) than {name}'s.", "better",
    "The comparative of good is better. It needs no more and no -er.",
    { name: ["Aziz", "Lola", "Timur", "Olga"], test: ["test", "quiz", "exam", "game"] }],
  [JOIN, "It was 5 degrees in {city} yesterday. It is 15 degrees today, {name}.", "Today is ______ (warm) than yesterday in {city}, {name}.", "warmer",
    "Warm is a short adjective: warmer. One mark is enough.",
    { city: ["Tashkent", "Samarkand", "Nukus", "Fergana"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [JOIN, "The {film} was bad. The {thing} was very, very bad.", "The {thing} was ______ (bad) than the {film}.", "worse",
    "The comparative of bad is worse. It needs no more and no -er.",
    { film: ["film", "first game", "party", "lesson"], thing: ["food", "weather", "traffic", "second game"] }],
  [JOIN, "My {bag} weighs 3 kilos. Your {bag} weighs 6 kilos, {name}.", "Your {bag} is ______ (heavy) than mine, {name}.", "heavier",
    "Heavy ends in -y, so it becomes heavier. Do not add more.",
    { bag: ["bag", "backpack", "suitcase", "box"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [JOIN, "A {thing} costs {price} here. In the centre it costs a lot.", "A {thing} is ______ ______ (expensive) in the centre than here.", ["more", "expensive"],
    "Expensive is a long adjective: more expensive, with no -er.",
    { thing: ["coffee", "pizza", "taxi", "haircut"], price: ["a little", "very little", "not much", "almost nothing"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence comparing two phones, bags or pairs of shoes. Use cheaper or more expensive.", "one comparative with one mark (-er or more) plus than",
    ["exactly one sentence", "must use than", "must not use more with an -er form"]],
  ["Write one sentence comparing two school subjects. Use easier or more difficult.", "easier or more difficult plus than",
    ["exactly one sentence", "must name two subjects", "must use than"]],
  ["Write one sentence that says something is better than something else.", "better plus than (not more better)",
    ["exactly one sentence", "must use better", "must use than"]],
  ["Write one sentence that says something is worse than something else.", "worse plus than (not more worse)",
    ["exactly one sentence", "must use worse", "must use than"]],
  ["Write one sentence comparing two people in your family with a short adjective: tall, old, young or strong.", "a short adjective with -er plus than",
    ["exactly one sentence", "must name two people", "must not use more"]],
  ["Write one sentence comparing two places with a long adjective: beautiful, interesting, modern or dangerous.", "more plus a long adjective plus than",
    ["exactly one sentence", "must name two places", "must not add -er to the adjective"]],
  ["Write two sentences about two ways to travel. Use one -er comparative and one comparative with more.", "one -er comparative and one more comparative",
    ["exactly two sentences", "one comparative with -er", "one comparative with more"]],
  ["A friend wrote: \"My new phone is more faster and more better than my old one.\" Write the sentence correctly.", "faster and better, each with one mark",
    ["exactly one sentence", "must use faster", "must use better"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare your life now with your life two years ago. What is better, worse, easier or more interesting? Write three or four sentences.",
    "comparatives with one mark each: -er, more, better, worse", ["-er on short adjectives", "more only with long adjectives", "better and worse without more"]],
  ["Compare two shops, cafes or markets near you. Write three or four sentences.",
    "comparatives with one mark each plus than", ["cheaper, bigger, cleaner or busier", "more expensive or more popular", "no double comparatives"]],
  ["Compare learning English with learning another subject. Write three or four sentences.",
    "comparatives with one mark each plus than", ["easier or more difficult", "better or worse", "than after the comparative"]],
  ["Compare two seasons where you live. Write three or four sentences.",
    "comparatives with one mark each plus than", ["hotter, colder, longer or shorter", "more beautiful or more comfortable", "no more with an -er form"]],
  ["Compare two films, games or songs that you know. Which one is better and why? Write three or four sentences.",
    "comparatives with one mark each plus than", ["better or worse", "funnier or longer", "more interesting or more exciting"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.comparative.double-comparative-error.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
