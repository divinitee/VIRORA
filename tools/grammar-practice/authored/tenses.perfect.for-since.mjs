// Hand-authored: tenses / perfect / for-since (A2).
//
// Tests ONE point: since + a start point (since 2019, since Monday) vs for + a
// length of time (for three years, for two hours) with the present perfect.
// The time expression is never slotted.
//
// Choose distractors: the other preposition, "ago" (mixing up the past simple
// time phrase), and "during"/"from" (L1 transfer: Russian "в течение" / "с").
// "from" is only used with a length of time, where it cannot be right.
// Build/transform keys are typed; instr lists the two choices (rule 3).
//
// Run: node tools/grammar-practice/authored/tenses.perfect.for-since.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "for-since", level: "A2", pv: "2.5" };
const WHY = {
  since: (t) => `${t} is the start point, so use since.`,
  for: (t) => `${t} is a length of time, so use for.`,
};
const OPTS = { since: ["since", "for", "ago", "during"], for: ["for", "since", "ago", "from"] };

/* ---------------- choose: 20 mcq ---------------- */
// [key, time expression, sentence with ______ before the time, slots]
const CHOOSE = [
  ["since", "2015", "My family has lived in {city} ______ 2015, near the {place}.",
    { city: ["Tashkent", "Samarkand", "Namangan", "Karshi"], place: ["market", "park", "metro", "river"] }],
  ["for", "ten years", "My uncle has worked at the {place} in {city} ______ ten years.",
    { place: ["bank", "hospital", "airport", "factory"], city: ["Tashkent", "Bukhara", "Fergana", "Andijan"] }],
  ["since", "Monday", "Aziz has been ill ______ Monday, so he hasn't come to {place} or the {club}.",
    { place: ["school", "college", "work", "class"], club: ["gym", "football club", "chess club", "dance class"] }],
  ["for", "two hours", "We have waited at the {place} ______ two hours for the {transport}.",
    { place: ["station", "bus stop", "airport", "corner"], transport: ["bus", "train", "taxi", "minibus"] }],
  ["since", "September", "Kamila has studied {subject} at the {place} ______ September.",
    { subject: ["English", "Korean", "German", "IT"], place: ["language centre", "college", "university", "school"] }],
  ["for", "three years", "I have had this {thing} ______ three years, and it still works {how}.",
    { thing: ["phone", "laptop", "bike", "watch"], how: ["well", "fine", "perfectly", "very well"] }],
  ["since", "2020", "Olga has taught {subject} at our {place} ______ 2020.",
    { subject: ["maths", "Russian", "music", "art"], place: ["school", "college", "lyceum", "centre"] }],
  ["for", "six months", "My sister has played the {instrument} ______ six months with a {who}.",
    { instrument: ["piano", "guitar", "violin", "dutar"], who: ["teacher", "tutor", "friend", "music club"] }],
  ["since", "last summer", "We haven't seen our {person} from {city} ______ last summer.",
    { person: ["cousins", "aunt", "grandparents", "uncle"], city: ["Khiva", "Termez", "Nukus", "Moscow"] }],
  ["for", "a week", "It has rained in {city} ______ a week, and the {place} are wet.",
    { city: ["Tashkent", "Samarkand", "Fergana", "Jizzakh"], place: ["streets", "parks", "roads", "fields"] }],
  ["since", "8 o'clock", "The students have been in the {room} ______ 8 o'clock with their {who}.",
    { room: ["library", "classroom", "exam room", "lab"], who: ["teacher", "books", "tutor", "notes"] }],
  ["for", "twenty minutes", "Timur has talked on the phone with his {person} ______ twenty minutes in the {place}.",
    { person: ["friend", "mother", "boss", "cousin"], place: ["kitchen", "car", "corridor", "yard"] }],
  ["since", "2018", "My grandparents have kept {animals} in their {place} ______ 2018.",
    { animals: ["chickens", "sheep", "rabbits", "goats"], place: ["yard", "garden", "village house", "dacha"] }],
  ["for", "five years", "Nodira has known {name} ______ five years, from {place}.",
    { name: ["Malika", "Anna", "Zarina", "Kamola"], place: ["school", "college", "dance class", "summer camp"] }],
  ["since", "January", "Bobur has gone to the {place} every morning ______ January with his {person}.",
    { place: ["gym", "pool", "stadium", "park"], person: ["brother", "father", "friend", "coach"] }],
  ["for", "a long time", "Our neighbours have lived in this {building} ______ a long time with their {pet}.",
    { building: ["building", "street", "house", "area"], pet: ["dog", "cat", "parrot", "children"] }],
  ["since", "Friday", "The {shop} on our street has been closed ______ Friday because of the {reason}.",
    { shop: ["bakery", "café", "pharmacy", "shop"], reason: ["holiday", "repairs", "owner's trip", "new floor"] }],
  ["for", "four days", "My father has been in {city} ______ four days for his {thing}.",
    { city: ["Moscow", "Almaty", "Bukhara", "Istanbul"], thing: ["work", "job", "meeting", "course"] }],
  ["since", "I was a child", "Sevara has loved {food} ______ she was a child, especially her {person}'s.",
    { food: ["plov", "samsa", "manti", "lagman"], person: ["grandmother", "mother", "aunt", "father"] }],
  ["for", "two weeks", "I haven't used my {thing} ______ two weeks because it is at the {place}.",
    { thing: ["bike", "laptop", "car", "phone"], place: ["repair shop", "garage", "service centre", "shop"] }],
].map(([key, t, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS[key], key: 0, why: WHY[key](t === "I was a child" ? "She was a child" : t[0].toUpperCase() + t.slice(1)), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with for or since.";
const BUILD = [
  ["since", "2019", "We have known {name} ______ 2019, when we met at the {place}.",
    { name: ["Aziz", "Olga", "Bobur", "Nigora"], place: ["park", "college", "summer camp", "gym"] }],
  ["for", "three hours", "Laylo has studied in the {place} ______ three hours with her {person}.",
    { place: ["library", "kitchen", "café", "classroom"], person: ["sister", "friend", "classmate", "cousin"] }],
  ["since", "Tuesday", "My brother has been at our {person}'s house ______ Tuesday with his {thing}.",
    { person: ["grandmother", "uncle", "aunt", "cousin"], thing: ["laptop", "books", "bike", "dog"] }],
  ["for", "a month", "Rustam has worked at the new {place} ______ a month as a {job}.",
    { place: ["café", "hotel", "shop", "office"], job: ["cashier", "driver", "helper", "cleaner"] }],
  ["since", "2017", "Our school has had a {room} for the {who} ______ 2017.",
    { room: ["library", "gym", "computer room", "canteen"], who: ["students", "children", "teachers", "older students"] }],
  ["for", "ten minutes", "The baby has slept in the {room} ______ ten minutes, so please be {how}.",
    { room: ["bedroom", "small room", "next room", "living room"], how: ["quiet", "careful", "calm", "silent"] }],
  ["since", "last year", "Javohir has wanted a {thing} ______ last year for his {room}.",
    { thing: ["new desk", "big TV", "new lamp", "computer"], room: ["room", "bedroom", "flat", "study"] }],
  ["for", "two days", "The {thing} in our flat hasn't worked ______ two days, so we called the {person}.",
    { thing: ["fridge", "heating", "washing machine", "lift"], person: ["landlord", "repairman", "neighbour", "manager"] }],
  ["since", "April", "Madina has gone to {class} every week ______ April with her {person}.",
    { class: ["swimming lessons", "dance class", "art class", "English lessons"], person: ["sister", "friend", "cousin", "classmate"] }],
  ["for", "an hour", "We have walked in the {place} ______ an hour, and now we are {state}.",
    { place: ["park", "old town", "mountains", "forest"], state: ["tired", "hungry", "thirsty", "cold"] }],
  ["since", "2021", "My cousin has lived in {city} ______ 2021 with his {person}.",
    { city: ["Seoul", "Moscow", "Istanbul", "London"], person: ["wife", "family", "friends", "parents"] }],
  ["for", "six years", "Dilnoza has played {sport} ______ six years in the {team}.",
    { sport: ["tennis", "volleyball", "basketball", "chess"], team: ["school team", "city team", "club", "college team"] }],
  ["since", "this morning", "It has snowed in {city} ______ this morning, and the {place} are white.",
    { city: ["Tashkent", "Jizzakh", "Namangan", "Samarkand"], place: ["streets", "roofs", "parks", "cars"] }],
  ["for", "a few weeks", "I haven't called my {person} ______ a few weeks because I have been {state}.",
    { person: ["aunt", "grandfather", "friend", "cousin"], state: ["busy", "ill", "away", "tired"] }],
  ["since", "Sunday", "Akmal hasn't eaten {food} ______ Sunday because of his {problem}.",
    { food: ["meat", "sweets", "bread", "fried food"], problem: ["stomach", "diet", "teeth", "cold"] }],
  ["for", "five months", "My parents have had their new {thing} ______ five months, and they love {it}.",
    { thing: ["car", "sofa", "kitchen", "fridge"], it: ["it", "it a lot", "it very much", "it so much"] }],
  ["since", "October", "The workers have built the new {building} near our {place} ______ October.",
    { building: ["school", "hospital", "bridge", "road"], place: ["house", "street", "flat", "college"] }],
  ["for", "a year", "Gulnora has taken the {transport} to work ______ a year with her {person}.",
    { transport: ["metro", "bus", "minibus", "train"], person: ["sister", "friend", "neighbour", "colleague"] }],
  ["since", "the summer", "We haven't been to the {place} in {city} ______ the summer.",
    { place: ["beach", "zoo", "big park", "old town"], city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  ["for", "a long time", "Sardor has wanted to visit {city} ______ a long time with his {person}.",
    { city: ["Khiva", "Istanbul", "Seoul", "Bukhara"], person: ["father", "friends", "brother", "family"] }],
].map(([key, t, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[key](t[0].toUpperCase() + t.slice(1)), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const START = "Read the first sentence. Complete the second sentence with for or since.";
const TRANSFORM = [
  // kind 1: a start point in the past (past simple) -> since
  ["since", "I came to this {place} in September.", "I have been at this {place} ______ September with my {person}.",
    { place: ["school", "college", "centre", "university"], person: ["brother", "friends", "cousin", "classmates"] }, "September"],
  ["since", "Aziz bought his {thing} on Monday.", "Aziz has had his {thing} ______ Monday, and he takes it to {place}.",
    { thing: ["bike", "phone", "watch", "bag"], place: ["school", "college", "work", "the gym"] }, "Monday"],
  ["since", "We moved to {district} in 2016.", "We have lived in {district} ______ 2016, near the {place}.",
    { district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"], place: ["metro", "market", "park", "school"] }, "2016"],
  ["since", "Olga met {name} at a {place} in 2022.", "Olga has known {name} ______ 2022.",
    { name: ["Aziz", "Bobur", "Nigora", "Sardor"], place: ["party", "wedding", "course", "summer camp"] }, "2022"],
  ["since", "My father started work at the {place} in 2010.", "My father has worked at the {place} ______ 2010 with his {person}.",
    { place: ["bank", "hospital", "factory", "airport"], person: ["friend", "brother", "team", "colleague"] }, "2010"],
  // kind 2: "... ago" -> for
  ["for", "I started learning {lang} three years ago.", "I have learned {lang} ______ three years at the {place}.",
    { lang: ["English", "Korean", "German", "Turkish"], place: ["language centre", "college", "school", "university"] }, "three years"],
  ["for", "Kamola arrived in {city} two weeks ago.", "Kamola has been in {city} ______ two weeks with her {person}.",
    { city: ["Seoul", "Moscow", "Istanbul", "Almaty"], person: ["family", "aunt", "friends", "sister"] }, "two weeks"],
  ["for", "The {transport} stopped working an hour ago.", "The {transport} hasn't worked ______ an hour, so people are walking to {place}.",
    { transport: ["metro", "tram", "lift", "cable car"], place: ["work", "school", "the station", "the next stop"] }, "an hour"],
  ["for", "My grandmother got her {pet} five years ago.", "My grandmother has had her {pet} ______ five years in her {place}.",
    { pet: ["cat", "dog", "parrot", "canary"], place: ["flat", "house", "village house", "dacha"] }, "five years"],
  ["for", "The boys started playing {sport} two hours ago.", "The boys have played {sport} ______ two hours in the {place}.",
    { sport: ["football", "basketball", "volleyball", "tennis"], place: ["park", "yard", "gym", "stadium"] }, "two hours"],
  // kind 3: "How long ...?" answers
  ["since", "How long have you had your {thing}? I got it in May.", "I have had my {thing} ______ May.",
    { thing: ["phone", "bike", "laptop", "watch"] }, "May"],
  ["for", "How long has Timur been at the {place}? He went there three hours ago.", "He has been at the {place} ______ three hours.",
    { place: ["library", "gym", "hospital", "office"] }, "three hours"],
  ["since", "How long have your cousins lived in {city}? They moved there in 2019.", "They have lived in {city} ______ 2019 with their {person}.",
    { city: ["Moscow", "Seoul", "Bukhara", "Almaty"], person: ["parents", "grandmother", "uncle", "family"] }, "2019"],
  ["for", "How long has Lola played the {instrument}? She started six months ago.", "She has played the {instrument} ______ six months with a {who}.",
    { instrument: ["piano", "guitar", "violin", "dutar"], who: ["teacher", "tutor", "friend", "music club"] }, "six months"],
  ["since", "How long has it rained in {city}? It started on Saturday.", "It has rained in {city} ______ Saturday, and the {place} are wet.",
    { city: ["Tashkent", "Samarkand", "Fergana", "Andijan"], place: ["streets", "parks", "roads", "fields"] }, "Saturday"],
].map(([key, source, hint, slots, t]) => ({ ...BASE, stage: "transform", format: "rewrite", instr: START, source, hint, key, why: WHY[key](t[0].toUpperCase() + t.slice(1)), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about how long you have lived in your home. Use for.", "present perfect + for", ["exactly one sentence", "must use for", "must use have lived"]],
  ["Write one sentence about when you started at your school or job. Use since.", "present perfect + since", ["exactly one sentence", "must use since", "must name a start point"]],
  ["Write one sentence about a friend you have known for a long time.", "have known + for or since", ["exactly one sentence", "must name the friend", "must use for or since"]],
  ["Write one sentence about something you have had since you were a child.", "have had + since", ["exactly one sentence", "must use since", "must name the thing"]],
  ["Write one sentence about the weather for the last few days.", "present perfect + for", ["exactly one sentence", "must use for", "must name the weather"]],
  ["Write one sentence about a hobby you have had since a year in the past.", "present perfect + since + year", ["exactly one sentence", "must use since", "must include a year"]],
  ["Write one sentence about someone you haven't seen for a long time.", "haven't seen + for", ["exactly one sentence", "must use haven't seen", "must use for"]],
  ["Write two sentences about the same thing: one with for and one with since.", "for and since", ["exactly two sentences", "one with for", "one with since"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about your English learning: how long you have studied it and since when. Write three or four sentences.", "present perfect + for and since", ["for + length", "since + start point", "have studied or have learned"]],
  ["Describe your best friend: how long you have known them and what you have done together. Write three or four sentences.", "present perfect + for and since", ["have known", "for or since", "a start point or length"]],
  ["Write about your home and your street: how long your family has lived there. Write three or four sentences.", "present perfect + for and since", ["have lived", "for", "since"]],
  ["Write about a thing you own and love. How long have you had it? Write three or four sentences.", "present perfect + for and since", ["have had", "for or since", "why you like it"]],
  ["Write about a hobby or sport: when you started and how long you have done it. Write three or four sentences.", "present perfect + for and since", ["have played or have done", "since + start point", "for + length"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.perfect.for-since.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);