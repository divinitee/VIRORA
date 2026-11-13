// Hand-authored: adj-adv / frequency / rarely (A1).
// Speaking Pack batch 2, topic 8 (grammar-run/SPEAK-2.md).
//
// Tests ONE point: rarely means NOT OFTEN. It happens, but only a little.
// HANDOFF rule 14: rarely is never taught as a fixed frequency. No why line
// says "rarely = once a week / once a year"; the cues describe the facts
// ("only on special days", "almost never", "it happens, but not often") and
// every why line says what rarely means: not often.
//
// Triage (SPEAK-2 point 2): kept. The core contrast is rarely vs never (it
// DOES happen, just not often), which only this topic tests. Position stays
// with adverb-position.
//
// Choose options: rarely + three of never / often / always / usually.
// sometimes is never offered: "sometimes" and "rarely" overlap ("I sometimes
// go, maybe twice a year" is natural), so it would be a second answer. seldom
// and hardly ever are never offered either (both correct).
// Build: type rarely / never / often (14 rarely, 3 never, 3 often).
// Transform: 5 doesn't often → rarely (the -s comes back) / 5 almost never →
// rarely / 5 correct never → rarely where the facts say it does happen.
//
// Run: node tools/grammar-practice/authored/adj-adv.frequency.rarely.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "frequency", topic: "rarely", level: "A1", pv: "2.5" };
const whyR = (cue) => `${cue}: it happens, but not often. Rarely means not often.`;

/* ---------------- choose: 20 mcq ---------------- */
const R1 = ["rarely", "never", "often", "always"];
const R2 = ["rarely", "never", "usually", "always"];
// [options, prompt, cue, slots]
const CHOOSE = [
  [R1, "We ______ eat in a {place}. It is expensive, so we go only on special days like {event}.", "Only on special days",
    { place: ["restaurant", "café"], event: ["birthdays", "Navruz", "New Year", "weddings"] }],
  [R2, "My {who} ______ calls me. He is very busy, but he phones {when}.", "He is busy, but he does phone",
    { who: ["uncle", "older brother", "cousin", "grandfather"], when: ["on my birthday", "at New Year", "at Navruz", "on holidays"] }],
  [R1, "It ______ rains in {city} in {month}. The sky is clear almost every day.", "Clear almost every day",
    { city: ["Tashkent", "Bukhara", "Samarkand", "Khiva"], month: ["July", "August"] }],
  [R2, "I ______ watch TV. I prefer {thing}, and I turn the TV on only for big {event}.", "Only for big events",
    { thing: ["books", "my phone", "music", "sport"], event: ["football matches", "matches", "games", "concerts"] }],
  [R1, "My grandmother ______ leaves her {home}. Her legs hurt, so she goes out only {when}.", "She goes out only sometimes",
    { home: ["house", "flat", "village", "home"], when: ["when it is warm", "to see the doctor", "for weddings", "on sunny days"] }],
  [R2, "{name} is ______ ill. She is very healthy and almost never misses {thing}.", "She almost never misses it",
    { name: ["Sevara", "Nilufar", "Olga", "Kamola"], thing: ["school", "work", "lessons", "training"] }],
  [R1, "The {bus} to our village ______ comes. There are only {n} a day.", "Only a few a day",
    { bus: ["bus", "minibus", "train"], n: ["two", "three"] }],
  [R2, "We ______ see our cousins from {city}. They live far away, so we meet them only in the {season}.", "Only in one season",
    { city: ["Moscow", "Kazan", "Almaty", "Nukus"], season: ["summer", "holidays"] }],
  [R1, "Bobur ______ makes mistakes in {subject}. He is the best student, but he gets one wrong on a {test} now and then.", "Now and then, not often",
    { subject: ["maths", "English", "physics", "chemistry"], test: ["test", "quiz", "dictation", "practice test"] }],
  [R2, "I ______ drink coffee. I like {drink} more, and I have coffee only when I visit {who}.", "Only when I visit someone",
    { drink: ["tea", "green tea", "juice", "milk"], who: ["my aunt", "friends", "my uncle", "my cousins"] }],
  [R1, "Our {teacher} is ______ angry with the {who}. She is calm almost all the time.", "Calm almost all the time",
    { teacher: ["teacher", "English teacher", "maths teacher", "music teacher"], who: ["students", "class", "children", "boys"] }],
  [R2, "My father ______ takes a day off. He works hard at the {place}, and he rests only at {holiday}.", "He rests only on holidays",
    { place: ["factory", "hospital", "bank", "bazaar"], holiday: ["Navruz", "New Year", "the end of the year"] }],
  [R1, "The streets in our {place} are ______ empty. People {act} there almost all day and night.", "Almost all day and night",
    { place: ["city centre", "town", "district", "area"], act: ["walk", "shop", "meet", "sit"] }],
  [R2, "We ______ go to the {place}. {reason}, so we go only two or three times a year.", "Only two or three times a year",
    { place: ["cinema", "theatre", "circus", "concert hall"], reason: ["Tickets are expensive", "It is far away", "We are busy", "We have little free time"] }],
  [R1, "My {sib} ______ cleans her room. It is {adj} almost every day.", "It is a mess almost every day",
    { sib: ["sister", "cousin", "aunt", "little sister"], adj: ["messy", "untidy", "dirty", "a mess"] }],
  [R2, "I ______ eat {food}. It is not healthy, so I have it only as a treat at {when}.", "Only as a treat",
    { food: ["fast food", "cake", "ice cream", "chocolate"], when: ["weekends", "parties", "holidays", "birthdays"] }],
  [R1, "{name} ______ uses his phone in {subject} class. He takes it out only when the teacher asks.", "Only when the teacher asks",
    { name: ["Laziz", "Anton", "Sardor", "Bekzod"], subject: ["English", "maths", "history", "biology"] }],
  [R2, "My grandparents ______ travel. They almost never leave their {place}, but they visit {city} for big family events.", "Almost never, but they do travel for big events",
    { place: ["village", "town", "district"], city: ["Tashkent", "Samarkand", "Bukhara", "Andijan"] }],
  [R1, "Our {pet} ______ barks. He is a {adj} dog and barks only at strangers.", "Only at strangers",
    { pet: ["dog", "puppy"], adj: ["quiet", "calm", "gentle", "friendly"] }],
  [R2, "I ______ forget my {thing} at {place}. It happens, but not often.", "It happens, but not often",
    { thing: ["keys", "phone", "lunch", "notebook"], place: ["home", "school", "work", "the gym"] }],
].map(([options, prompt, cue, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: whyR(cue), slots }));

/* ---------------- build: 20 gap_fill (type one word) ---------------- */
const INSTR = "Write rarely, never or often.";
const WHY = {
  rarely: whyR,
  never: (c) => `${c}, so it does not happen at all. That is never.`,
  often: (c) => `${c}, so it happens many times. That is often.`,
};
// [key, source, cue, slots]
const BUILD = [
  ["rarely", "My {who} ______ eats sweets. She is careful with sugar, but she has a little cake at {event}.", "Only a little cake at special events",
    { who: ["mother", "aunt", "grandmother", "sister"], event: ["birthdays", "weddings", "parties", "New Year"] }],
  ["rarely", "We ______ go to the {place}. It is far from our house, so we go only on special days.", "Only on special days",
    { place: ["zoo", "theatre", "circus", "water park"] }],
  ["never", "My {who} ______ drinks coffee. He doesn't like it at all and has {drink}.", "He doesn't like it at all",
    { who: ["grandfather", "father", "uncle", "older brother"], drink: ["green tea", "black tea", "milk", "water"] }],
  ["often", "I ______ play {game} with my {who}. We play three or four times a week.", "Three or four times a week",
    { game: ["football", "chess", "volleyball", "basketball"], who: ["friends", "brother", "cousins", "classmates"] }],
  ["rarely", "{name} ______ gets angry. She is calm almost all the time.", "Calm almost all the time",
    { name: ["Gulnora", "Anna", "Zarina", "Shahzoda"] }],
  ["rarely", "It ______ rains in {city} in summer. The sky is blue almost every day.", "Blue almost every day",
    { city: ["Bukhara", "Khiva", "Samarkand", "Termez"] }],
  ["rarely", "My brother ______ reads books. He likes {thing} more, but he reads a book on long {trip}.", "Only on long trips",
    { thing: ["games", "sport", "films", "music"], trip: ["trips", "journeys", "train trips", "flights"] }],
  ["often", "Our neighbours ______ visit us. They come for {what} many times a week.", "Many times a week",
    { what: ["tea", "dinner", "a chat", "plov"] }],
  ["rarely", "We ______ eat at a café. It is expensive, so we go only for {event}.", "Only for special events",
    { event: ["birthdays", "special days", "big holidays", "family celebrations"] }],
  ["never", "My little sister {name} ______ drinks coffee. She is only {n} years old.", "She is a small child",
    { name: ["Madina", "Lola", "Sabina", "Asal"], n: ["five", "six", "seven", "four"] }],
  ["rarely", "Our {teacher} ______ gives us homework at the weekend. She does it only before big {test}.", "Only before big tests",
    { teacher: ["teacher", "English teacher", "maths teacher", "history teacher"], test: ["tests", "exams", "quizzes", "projects"] }],
  ["rarely", "My {who} ______ watches films. He is very busy and has time only at {holiday}.", "Only on holidays",
    { who: ["father", "uncle", "grandfather", "older brother"], holiday: ["Navruz", "New Year", "the end of the year"] }],
  ["often", "I ______ go to the {place} after {time}. I go there on most days.", "On most days",
    { place: ["library", "park", "gym", "sports hall"], time: ["school", "work", "lessons", "college"] }],
  ["rarely", "The {bus} to our {place} ______ comes on time. It is late almost every day.", "Late almost every day",
    { bus: ["bus", "minibus", "train", "school bus"], place: ["village", "town", "district", "area"] }],
  ["rarely", "I ______ wear a {clothes}. I put one on only for {event}.", "Only for special events",
    { clothes: ["suit", "tie", "dress"], event: ["weddings", "big events", "interviews", "family parties"] }],
  ["never", "Our {room} is ______ warm in winter. The heating doesn't work at all.", "The heating doesn't work at all",
    { room: ["classroom", "kitchen", "bathroom", "flat"] }],
  ["rarely", "My {who} ______ writes to me. He lives in {city}, and he sends a message only at New Year.", "Only at New Year",
    { who: ["uncle", "cousin", "old friend", "brother"], city: ["Moscow", "Seoul", "Almaty", "Istanbul"] }],
  ["rarely", "Children in our {place} ______ play outside in winter. It is too cold, but they go out on {day}.", "Only on some days",
    { place: ["village", "town", "district", "street"], day: ["warm days", "sunny days", "holidays", "the warmest days"] }],
  ["rarely", "I ______ see my cousins. They live in {city}, and we meet only at {event}.", "Only at family events",
    { city: ["Nukus", "Termez", "Andijan", "Kazan"], event: ["weddings", "Navruz", "big family parties", "birthdays"] }],
  ["rarely", "{name} ______ misses training. He comes almost every time, even when he is {state}.", "He comes almost every time",
    { name: ["Jasur", "Rustam", "Ilya", "Doniyor"], state: ["tired", "busy", "ill", "sad"] }],
].map(([key, source, cue, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: WHY[key](cue), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOT = "Rewrite the sentence with rarely. Don't use not.";
const ALM = "Rewrite the sentence with rarely instead of almost never.";
const FIX = "The adverb in the first sentence does not match the facts. Rewrite the first sentence correctly.";
const whyN = (form) => `Rarely means not often, and it is already negative in meaning, so the verb is positive: ${form}.`;
const whyA = (form) => `Almost never and rarely both mean not often: ${form}.`;
const whyF = (cue) => `${cue}, so it does happen, just not often. Never is wrong. Use rarely: it means not often.`;
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [NOT, "My {who} doesn't often cook {meal}.", "My {who} ______ (cook) {meal}.", "rarely cooks", whyN("rarely cooks"),
    { who: ["brother", "father", "uncle", "cousin"], meal: ["dinner", "lunch", "breakfast", "plov"] }],
  [NOT, "We don't often go to the {place} in {month}.", "We ______ to the {place} in {month}.", "rarely go", whyN("rarely go"),
    { place: ["lake", "mountains", "river", "park"], month: ["winter", "January", "February", "December"] }],
  [NOT, "{name} isn't often late for {thing}.", "{name} ______ late for {thing}.", "is rarely", whyN("is rarely"),
    { name: ["Akmal", "Pavel", "Javlon", "Ruslan"], thing: ["school", "work", "training", "class"] }],
  [NOT, "My {who} don't often watch {prog}.", "My {who} ______ {prog}.", "rarely watch", whyN("rarely watch"),
    { who: ["parents", "grandparents", "neighbours", "aunts"], prog: ["films", "football", "TV shows", "the news"] }],
  [NOT, "It doesn't often snow in {city} in {month}.", "It ______ in {city} in {month}.", "rarely snows", whyN("rarely snows"),
    { city: ["Tashkent", "Samarkand", "Fergana", "Namangan"], month: ["March", "November", "October"] }],
  [ALM, "We almost never eat {food} at {when}.", "We ______ {food} at {when}.", "rarely eat", whyA("rarely eat"),
    { food: ["fast food", "pizza", "burgers", "chips"], when: ["home", "school", "work", "the weekend"] }],
  [ALM, "My {who} almost never goes to the {place}.", "My {who} ______ to the {place}.", "rarely goes", whyA("rarely goes"),
    { who: ["grandmother", "uncle", "father", "aunt"], place: ["cinema", "gym", "theatre", "stadium"] }],
  [ALM, "Our {room} is almost never clean.", "Our {room} ______ clean.", "is rarely", whyA("is rarely"),
    { room: ["kitchen", "garage", "yard", "balcony"] }],
  [ALM, "I almost never take a taxi to {place} on {day}.", "I ______ a taxi to {place} on {day}.", "rarely take", whyA("rarely take"),
    { place: ["school", "work", "college", "university"], day: ["weekdays", "Mondays", "Fridays", "school days"] }],
  [ALM, "{name} almost never misses a {event}.", "{name} ______ a {event}.", "rarely misses", whyA("rarely misses"),
    { name: ["Shahzoda", "Nodira", "Irina", "Malika"], event: ["lesson", "match", "training session", "class"] }],
  [FIX, "I never see my cousins from {city}. We meet only at {event}.", "I ______ my cousins from {city}.", "rarely see", whyF("We meet at family events"),
    { city: ["Nukus", "Termez", "Kazan", "Almaty"], event: ["weddings", "Navruz", "big family parties", "birthdays"] }],
  [FIX, "My {who} never eats sweets. He has a small piece of cake at {event}.", "My {who} ______ sweets.", "rarely eats", whyF("He has cake on special days"),
    { who: ["grandfather", "father", "uncle", "brother"], event: ["his birthday", "weddings", "New Year", "Navruz"] }],
  [FIX, "It never rains in {city} in summer. There are only one or two rainy days.", "It ______ in {city} in summer.", "rarely rains", whyF("There are one or two rainy days"),
    { city: ["Bukhara", "Khiva", "Samarkand", "Termez"] }],
  [FIX, "We never go to the {place} in {city}. We went twice last year.", "We ______ to the {place} in {city}.", "rarely go", whyF("We went twice last year"),
    { place: ["cinema", "theatre", "zoo", "circus"], city: ["Tashkent", "Samarkand", "Fergana", "Bukhara"] }],
  [FIX, "Our {teacher} is never angry. She shouts at the {who} now and then, but not often.", "Our {teacher} ______ angry.", "is rarely", whyF("She shouts now and then"),
    { teacher: ["teacher", "English teacher", "maths teacher", "music teacher"], who: ["class", "boys", "students", "children"] }],
].map(([instr, source, hint, key, w, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you rarely eat, and say when you eat it.", "rarely = not often", ["exactly one sentence", "must use rarely", "must say when"]],
  ["Write one sentence about a person you rarely see.", "rarely + positive verb", ["exactly one sentence", "must name the person", "no not with rarely"]],
  ["Write one sentence about a place in your city that you rarely visit.", "rarely + visit or go", ["exactly one sentence", "must name a place", "must use rarely"]],
  ["Write one sentence about something you never do and one about something you rarely do.", "never vs rarely", ["exactly two sentences", "one with never", "one with rarely"]],
  ["Write one sentence about a family member who is rarely angry or rarely tired.", "be + rarely", ["exactly one sentence", "must name a family member", "must use is rarely"]],
  ["Write one sentence about something you often do and one about something you rarely do.", "often vs rarely", ["exactly two sentences", "one with often", "one with rarely"]],
  ["Write one sentence about the weather in your city: something that rarely happens.", "rarely with weather", ["exactly one sentence", "must name your city", "must use rarely"]],
  ["Write one sentence about a special day when you do something you rarely do.", "rarely + a special day", ["exactly one sentence", "must name the day", "must use rarely"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe things you rarely do. When do you do them, and why not more often? Write three or four sentences.",
    "rarely = not often", ["rarely + positive verb", "a reason for each", "no fixed rule like once a week = rarely"]],
  ["Describe your family's food. What do you often eat, and what do you rarely eat? Write three or four sentences.",
    "often vs rarely with food", ["often for many times", "rarely for not often", "food named"]],
  ["Describe a relative or friend you rarely see. Where do they live, and when do you meet? Write three or four sentences.",
    "rarely with people", ["rarely see or rarely meet", "a place named", "when you meet"]],
  ["Describe your weekends. What do you never do, rarely do and often do? Write three or four sentences.",
    "never, rarely and often", ["never for not at all", "rarely for not often", "often for many times"]],
  ["Describe the weather in your city in different seasons. What rarely happens there? Write three or four sentences.",
    "rarely with weather", ["rarely + rains or snows", "seasons or months named", "it with the -s form"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.frequency.rarely.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);