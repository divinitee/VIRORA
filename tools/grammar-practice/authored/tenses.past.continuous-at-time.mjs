// Hand-authored: tenses / past / continuous-at-time (A2).
//
// Tests ONE point: was/were + -ing for an action in progress at a specific
// point in past time ("At 9 last night, I was watching TV"). The time point is
// never slotted, and neither is the subject (it decides was/were).
//
// Distractors: the present continuous (tense not moved back), the present
// simple, the wrong form of be (I were / they was: a common L1-transfer error)
// and a bare -ing with be dropped. The past simple is NOT a distractor in
// choose: "At 9 I watched TV" can be correct (the action started at 9).
//
// Run: node tools/grammar-practice/authored/tenses.past.continuous-at-time.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "past", topic: "continuous-at-time", level: "A2", pv: "2.5" };
const BE = { i: "was", sg: "was", pl: "were" };
const NOW = { i: "am", sg: "is", pl: "are" };
const WRONG = { i: "were", sg: "were", pl: "was" };
const why = (type, ing) =>
  `The time is a point in the middle of the action, so use the past continuous: ${BE[type]} ${ing}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["i", "watching", "At 9 last night, I ______ a {thing} on TV with my {person}.",
    { thing: ["film", "football match", "cooking show", "quiz show"], person: ["brother", "sister", "parents", "grandmother"] }],
  ["sg", "cooking", "At 7 this morning, my mother ______ breakfast for the {who} in our {home}.",
    { who: ["family", "children", "guests", "twins"], home: ["flat", "house", "dacha", "village house"] }],
  ["pl", "studying", "At midnight, the students ______ for the {exam} in the {place}.",
    { exam: ["maths exam", "history test", "English exam", "physics test"], place: ["library", "dormitory", "reading room", "kitchen"] }],
  ["sg", "playing", "At 3 pm yesterday, Dilnoza ______ {sport} in the {place}.",
    { sport: ["tennis", "volleyball", "basketball", "table tennis"], place: ["park", "school gym", "sports centre", "yard"] }],
  ["pl", "going", "At 8 o'clock on Saturday morning, we ______ to {city} by {transport}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], transport: ["train", "bus", "car", "taxi"] }],
  ["sg", "working", "At this time yesterday, Timur ______ in a {place} in {city}.",
    { place: ["café", "hotel", "shop", "bakery"], city: ["Tashkent", "Namangan", "Andijan", "Karshi"] }],
  ["pl", "walking", "At 6 pm yesterday, my grandparents ______ in the park near their {home} with {name}.",
    { home: ["house", "flat", "dacha", "building"], name: ["Aziz", "Olga", "Bobur", "Nigora"] }],
  ["i", "writing", "At 11 last night, I ______ a message to my {person} about the {thing}.",
    { person: ["friend", "teacher", "cousin", "classmate"], thing: ["homework", "party", "match", "trip"] }],
  ["sg", "explaining", "At 10 am on Monday, our teacher ______ the {topic} to the {group}.",
    { topic: ["new grammar", "homework", "test rules", "project"], group: ["class", "new students", "whole group", "first-year students"] }],
  ["pl", "repairing", "At 2 o'clock this afternoon, the workers ______ the {thing} outside our {building}.",
    { thing: ["road", "pavement", "fence", "gate"], building: ["school", "building", "house", "college"] }],
  ["sg", "waiting", "At 5 pm yesterday, Kamila ______ for the {transport} at the stop near the {place}.",
    { transport: ["bus", "minibus", "tram", "school bus"], place: ["market", "hospital", "park", "bank"] }],
  ["sg", "crying", "At 4 this morning, the baby ______, so my {person} got up and walked around the {room}.",
    { person: ["mother", "father", "aunt", "grandmother"], room: ["kitchen", "flat", "living room", "bedroom"] }],
  ["pl", "doing", "At 7:30 last night, my friends and I ______ a {task} together at {name}'s house.",
    { task: ["project", "puzzle", "maths task", "science project"], name: ["Sardor", "Anna", "Malika", "Oleg"] }],
  ["sg", "washing", "At noon yesterday, my father ______ the car in front of the {place} with a {tool}.",
    { place: ["house", "garage", "building", "gate"], tool: ["sponge", "hose", "cloth", "brush"] }],
  ["sg", "raining", "At 9 this morning, it ______ heavily, so the streets of {city} were {state}.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Nukus"], state: ["wet", "empty", "quiet", "full of water"] }],
  ["pl", "listening", "At 1 am, my neighbours ______ to loud music in their {room} on the {floor} floor.",
    { room: ["kitchen", "living room", "flat", "bedroom"], floor: ["second", "third", "fourth", "fifth"] }],
  ["i", "sitting", "At this time last week, I ______ on a beach in {place} with my {person}.",
    { place: ["Turkey", "Egypt", "Charvak", "Thailand"], person: ["family", "cousins", "parents", "friends"] }],
  ["sg", "riding", "At 8:15 yesterday morning, Javohir ______ to school on his {vehicle} through the {place}.",
    { vehicle: ["bike", "scooter", "new bike", "brother's bike"], place: ["park", "old town", "market", "quiet streets"] }],
  ["pl", "cleaning", "At 10 last night, the shop assistants ______ the {area} after a busy {day}.",
    { area: ["floor", "shelves", "windows", "tables"], day: ["day", "Saturday", "sale day", "holiday"] }],
  ["sg", "training", "At 6 this morning, my sister ______ for her {event} in the {place}.",
    { event: ["race", "marathon", "match", "competition"], place: ["park", "stadium", "gym", "yard"] }],
].map(([type, ing, prompt, slots]) => {
  const pres = { watching: "watch", cooking: "cooks", studying: "study", playing: "plays", going: "go", working: "works",
    walking: "walk", writing: "write", explaining: "explains", repairing: "repair", waiting: "waits", crying: "cries",
    doing: "do", washing: "washes", raining: "rains", listening: "listen", sitting: "sit", riding: "rides",
    cleaning: "clean", training: "trains" }[ing];
  return { ...BASE, stage: "choose", format: "mcq", prompt,
    options: [`${BE[type]} ${ing}`, `${NOW[type]} ${ing}`, `${WRONG[type]} ${ing}`, pres], key: 0, why: why(type, ing), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the past continuous form of the verb in brackets.";
const BUILD = [
  ["sg", "reading", "At 8 last night, Bekzod ______ (read) a book about {topic} in his {room}.",
    { topic: ["space", "dinosaurs", "history", "football"], room: ["room", "bedroom", "bed", "living room"] }],
  ["pl", "sitting", "At this time yesterday, we ______ (sit) in a {place} in {city}.",
    { place: ["café", "park", "cinema", "train"], city: ["Tashkent", "Samarkand", "Bukhara", "Termez"] }],
  ["sg", "driving", "At 5 am, my father ______ (drive) to the {place} to meet my {person}.",
    { place: ["airport", "station", "bus station", "hotel"], person: ["uncle", "aunt", "grandmother", "cousin"] }],
  ["pl", "swimming", "At 3 o'clock yesterday, the children ______ (swim) in the {place} with their {person}.",
    { place: ["pool", "lake", "river", "sea"], person: ["coach", "father", "cousins", "teacher"] }],
  ["i", "cooking", "At 7 pm on Friday, I ______ (cook) {food} for my {person}'s birthday.",
    { food: ["plov", "soup", "pasta", "samsa"], person: ["mother", "brother", "friend", "grandfather"] }],
  ["sg", "talking", "At midnight, Lola ______ (talk) on the phone with her {person} in {city}.",
    { person: ["cousin", "sister", "friend", "aunt"], city: ["Moscow", "Seoul", "London", "Almaty"] }],
  ["sg", "taking", "At 9:30 this morning, our class ______ (take) a {test} in room {num}.",
    { test: ["maths test", "spelling test", "history test", "short test"], num: ["12", "14", "21", "305"] }],
  ["pl", "picking", "At 6 last night, the farmers ______ (pick) {fruit} in the {place}.",
    { fruit: ["apples", "apricots", "grapes", "cherries"], place: ["village", "garden", "valley", "hills"] }],
  ["sg", "downloading", "At 2 am, my computer ______ (download) a {thing} for my {person}.",
    { thing: ["game", "film", "big file", "new program"], person: ["brother", "sister", "cousin", "father"] }],
  ["pl", "fixing", "At 4 pm yesterday, Rustam and Ali ______ (fix) their {vehicle} in the {place}.",
    { vehicle: ["bikes", "scooter", "car", "motorbike"], place: ["garage", "yard", "street", "garden"] }],
  ["i", "sleeping", "At 10 o'clock on Sunday morning, I ______ (sleep) in my {room}, so I didn't hear the {sound}.",
    { room: ["room", "bedroom", "bed", "little room"], sound: ["phone", "door", "doorbell", "alarm"] }],
  ["sg", "studying", "At this time last year, my brother ______ (study) in {city} on a short {course}.",
    { city: ["London", "Seoul", "Istanbul", "Berlin"], course: ["language course", "summer course", "computer course", "art course"] }],
  ["pl", "serving", "At 1 pm yesterday, the waiters ______ (serve) lunch to a big {group} from {place}.",
    { group: ["group", "family", "class", "team"], place: ["Russia", "Korea", "Bukhara", "Kazakhstan"] }],
  ["sg", "waiting", "At 7:45 this morning, Malika ______ (wait) for her {person} outside the {place}.",
    { person: ["friend", "sister", "mother", "classmate"], place: ["school", "metro station", "shop", "cinema"] }],
  ["sg", "blowing", "At 9 o'clock last night, the wind ______ (blow) hard and the {thing} in our {place} moved.",
    { thing: ["trees", "branches", "bushes", "flowers"], place: ["yard", "garden", "street", "park"] }],
  ["pl", "painting", "At 11 am yesterday, we ______ (paint) the walls of the {room} {colour}.",
    { room: ["kitchen", "classroom", "bedroom", "hall"], colour: ["white", "yellow", "light blue", "green"] }],
  ["sg", "playing", "At 8 pm yesterday, my uncle ______ (play) the {instrument} at a {event}.",
    { instrument: ["piano", "guitar", "drums", "dutar"], event: ["wedding", "party", "concert", "birthday party"] }],
  ["pl", "dancing", "At this time on Saturday evening, the girls ______ (dance) at the {place} in front of {num} people.",
    { place: ["school concert", "dance class", "club", "festival"], num: ["fifty", "a hundred", "two hundred", "three hundred"] }],
  ["pl", "making", "At 4 am, the bakers ______ (make) {food} for the {place}.",
    { food: ["bread", "non", "samsa", "buns"], place: ["market", "shops", "cafés", "hotel"] }],
  ["sg", "wearing", "At 6:30 last night, Otabek ______ (wear) his new {clothes} at the {event}.",
    { clothes: ["suit", "shirt", "jacket", "shoes"], event: ["party", "wedding", "concert", "dinner"] }],
].map(([type, ing, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${BE[type]} ${ing}`, why: why(type, ing), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOW_TO_PAST = "The first sentence is about now. Complete the second sentence about the same kind of action at a time in the past.";
const NEW_SUBJ = "Rewrite the sentence with the new subject. Keep the past continuous.";
const ROUTINE = "The first sentence is a routine. Complete the second sentence about a moment in the middle of that action yesterday.";
const TRANSFORM = [
  [NOW_TO_PAST, "I'm doing my {subject} homework now.", "At 8 last night, I ______ (do) my {subject} homework at the {place}.", "was doing",
    { subject: ["maths", "English", "history", "physics"], place: ["kitchen table", "library", "desk", "café"] }],
  [NOW_TO_PAST, "My sister is watching a {thing} now.", "At 9 last night, my sister ______ (watch) a {thing} with her {person}.", "was watching",
    { thing: ["film", "series", "match", "cartoon"], person: ["friends", "cousin", "children", "classmates"] }],
  [NOW_TO_PAST, "We're waiting for a {transport} now.", "At 8 this morning, we ______ (wait) for a {transport} at the {place}.", "were waiting",
    { transport: ["taxi", "bus", "train", "minibus"], place: ["station", "stop", "corner", "airport"] }],
  [NOW_TO_PAST, "The boys are playing {sport} now.", "At 4 pm yesterday, the boys ______ (play) {sport} in the {place}.", "were playing",
    { sport: ["football", "basketball", "volleyball", "tennis"], place: ["park", "yard", "school gym", "stadium"] }],
  [NOW_TO_PAST, "It's snowing in {city} now.", "At 7 this morning, it ______ (snow) in {city} and the roads were {state}.", "was snowing",
    { city: ["Tashkent", "Samarkand", "Jizzakh", "Fergana"], state: ["white", "icy", "slippery", "closed"] }],
  [NEW_SUBJ, "At 10 last night, I was cleaning my {room}.", "At 10 last night, my brothers ______ (clean) the {room2}.", "were cleaning",
    { room: ["room", "bedroom", "cupboard", "wardrobe"], room2: ["kitchen", "bathroom", "balcony", "garage"] }],
  [NEW_SUBJ, "At 6 pm, my parents were shopping at the {place}.", "At 6 pm, my father ______ (shop) at the {place} with my {person}.", "was shopping",
    { place: ["market", "bazaar", "supermarket", "mall"], person: ["uncle", "brother", "sister", "aunt"] }],
  [NEW_SUBJ, "At noon, Sevara was eating {food} in the {place}.", "At noon, Sevara and her friends ______ (eat) {food} in the {place}.", "were eating",
    { food: ["plov", "salad", "samsa", "soup"], place: ["canteen", "park", "café", "kitchen"] }],
  [NEW_SUBJ, "At 3 am, the dog was barking in the {place}.", "At 3 am, our neighbours' dogs ______ (bark) in the {place} near the {thing}.", "were barking",
    { place: ["yard", "street", "garden", "car park"], thing: ["gate", "trees", "fence", "garage"] }],
  [NEW_SUBJ, "At this time yesterday, you were sitting on the {transport}.", "At this time yesterday, I ______ (sit) on the {transport} next to my {person}.", "was sitting",
    { transport: ["bus", "train", "plane", "metro"], person: ["aunt", "friend", "brother", "teacher"] }],
  [ROUTINE, "I usually have lunch at 1 o'clock in the {place}.", "At 1:15 yesterday, I ______ (have) lunch in the {place} with my {person}.", "was having",
    { place: ["canteen", "kitchen", "café", "park"], person: ["classmates", "father", "friends", "teacher"] }],
  [ROUTINE, "Every evening my mother walks in the {place}.", "At 6:30 yesterday evening, my mother ______ (walk) in the {place} with our {person}.", "was walking",
    { place: ["park", "garden", "square", "old town"], person: ["neighbour", "aunt", "dog", "grandmother"] }],
  [ROUTINE, "Kamol answers emails at the {place} every morning.", "At 8:30 yesterday morning, Kamol ______ (answer) emails from {who} at the {place}.", "was answering",
    { place: ["office", "bank", "hotel", "shop"], who: ["customers", "students", "his boss", "the school"] }],
  [ROUTINE, "People buy {things} in the shop on {street} every morning.", "At 9:30 this morning, people ______ (buy) {things} in the shop on {street}.", "were buying",
    { things: ["bread", "fruit", "school bags", "water"], street: ["Navoi Street", "our street", "Amir Temur Street", "the main street"] }],
  [ROUTINE, "My grandfather reads the news in the {place} every morning.", "At 7 this morning, my grandfather ______ (read) the news on his {device} in the {place}.", "was reading",
    { device: ["phone", "tablet", "laptop", "computer"], place: ["garden", "kitchen", "yard", "living room"] }],
].map(([instr, source, hint, key, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key,
  why: `The time in the second sentence is a point in the middle of the action, so use the past continuous: ${key}.`, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what you were doing at 9 o'clock last night.", "was + -ing", ["exactly one sentence", "must start with At 9 o'clock last night", "must use I"]],
  ["Write one sentence about what your family was doing at 7 this morning.", "was or were + -ing", ["exactly one sentence", "must include at 7 this morning", "must name a family member"]],
  ["Write one sentence about what two friends were doing at this time yesterday.", "were + -ing", ["exactly one sentence", "must include at this time yesterday", "must use a plural subject"]],
  ["Write one sentence about the weather at a time yesterday.", "was raining, was snowing or was shining", ["exactly one sentence", "must include a clock time", "must use it or the sun"]],
  ["Write one sentence about what your teacher was doing at the start of yesterday's lesson.", "was + -ing", ["exactly one sentence", "must include a time", "must use the past continuous"]],
  ["Write one sentence about where you were and what you were doing at midnight on New Year's Eve.", "was + -ing", ["exactly one sentence", "must include at midnight", "must name a place"]],
  ["Write one sentence about what people in your street were doing at 8 o'clock this morning.", "were + -ing", ["exactly one sentence", "must include at 8 o'clock this morning", "must use people or a plural noun"]],
  ["Write two sentences: what you do at 7 pm every day, and what you were doing at 7 pm yesterday.", "present simple, then past continuous", ["exactly two sentences", "first sentence present simple", "second sentence with was + -ing"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your evening yesterday. Say what you were doing at three different times. Write three or four sentences.",
    "past continuous at specific past times", ["at + a clock time", "was or were + -ing", "three different actions"]],
  ["A friend asks where everyone in your family was at 8 pm last Saturday. Answer in three or four sentences.",
    "past continuous for actions in progress at a time", ["at 8 pm last Saturday", "different family members", "was or were + -ing"]],
  ["Describe what was happening in your school or office at 10 o'clock yesterday morning. Write three or four sentences.",
    "past continuous for scenes at a past moment", ["at 10 o'clock yesterday morning", "several people doing things", "were + -ing"]],
  ["Think of a special day (a holiday or a wedding). What were people doing at one moment of that day? Write three or four sentences.",
    "past continuous to describe a scene", ["a clear time", "was or were + -ing", "who, where and what"]],
  ["Compare a normal Sunday with last Sunday: what do you usually do at noon, and what were you doing at noon last Sunday? Write three or four sentences.",
    "present simple for routine, past continuous for a past moment", ["usually + present simple", "at noon last Sunday + was + -ing", "but to show the contrast"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.past.continuous-at-time.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);