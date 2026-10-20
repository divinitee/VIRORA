// Hand-authored: nouns-articles / countability / uncountable-abstract (A2).
//
// Tests ONE point: abstract/collective uncountable nouns (information,
// news, luggage, equipment, knowledge, work) take some, not an/many, and
// never -s. Placement focus: 'information' is uncountable.
// Different nouns from uncountable-no-plural (homework, advice, music, rice,
// furniture) so the two topics never repeat each other.
//
// Every frame is a positive statement, where "much" is not used and "some"
// is the one natural quantifier. Choose options: some + noun, an/a + noun
// (L1 transfer: Russian "одна информация"), many + noun-s, and noun-s.
// "works" (factories, art) and "knowledges" are never used in a sense that
// could be correct: the sentence always means the uncountable sense.
// Build mixes singular countable nouns (key a/an) with uncountables
// (key some); instr lists a / an / some (rule 3).
//
// Run: node tools/grammar-practice/authored/nouns-articles.countability.uncountable-abstract.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "countability", topic: "uncountable-abstract", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const AN = { information: "an", equipment: "an", news: "a", luggage: "a" };
const OPTS = (n) => (n === "news" ? ["some news", "a news", "many news", "newses"] : [`some ${n}`, `${AN[n]} ${n}`, `many ${n}s`, `${n}s`]);
const U = (n) => `${n[0].toUpperCase()}${n.slice(1)} is uncountable: no a/an, no many and no -s. Use some ${n}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["information", "The woman at the {place} gave us ______ about the tour of {city}.", { place: ["hotel", "station", "museum", "tourist office"], city: CITY }],
  ["information", "I found ______ about the {thing} on the college website, {name}.", { thing: ["exam", "course", "teachers", "timetable"], name: NAME }],
  ["information", "{name} needs ______ for the {subject} project.", { name: NAME, subject: ["history", "science", "geography", "English"] }],
  ["information", "Our guide in {city} told us ______ about the {thing}.", { city: CITY, thing: ["old mosque", "market", "museum", "city walls"] }],
  ["information", "The {person} sent me ______ about the trip by {how}.", { person: ["teacher", "school", "travel agent", "coach"], how: ["email", "message", "phone", "post"] }],
  ["information", "There is ______ about the {event} on the wall in the {place}.", { event: ["concert", "exam", "trip", "match"], place: ["hall", "classroom", "library", "corridor"] }],
  ["news", "I have ______ for you, {name}! It's about {topic}.", { name: NAME, topic: ["the trip", "the exam", "our team", "my new job"] }],
  ["news", "{name} heard ______ about the {thing} in {city}.", { name: NAME, thing: ["new airport", "new park", "football club", "new school"], city: CITY }],
  ["news", "Grandma got ______ from her {person} in {city}.", { person: ["sister", "brother", "cousin", "old friend"], city: CITY }],
  ["news", "We got ______ from the {group} on {day}.", { group: ["school", "college", "team", "hospital"], day: ["Monday", "Tuesday", "Thursday", "Friday"] }],
  ["luggage", "We have ______ for the trip to {city}, {name}.", { city: CITY, name: NAME }],
  ["luggage", "There is ______ next to the {place}. Is it yours, {name}?", { place: ["door", "bus stop", "taxi", "stairs"], name: NAME }],
  ["luggage", "{name} left ______ in the {transport}.", { name: NAME, transport: ["taxi", "train", "bus", "car"] }],
  ["luggage", "The driver put ______ on the roof of the {vehicle}.", { vehicle: ["car", "minibus", "taxi", "van"] }],
  ["equipment", "The school bought ______ for the {room}.", { room: ["gym", "science room", "computer room", "music room"] }],
  ["equipment", "We need ______ for the {activity} on {day}, {name}.", { activity: ["camping trip", "football match", "picnic", "hike"], day: ["Saturday", "Sunday", "Friday", "Navruz"], name: NAME }],
  ["equipment", "{name}'s uncle sells ______ for {sport} in {city}.", { name: NAME, sport: ["football", "running", "tennis", "swimming"], city: CITY }],
  ["equipment", "There is ______ in the {place} for the students.", { place: ["gym", "lab", "sports hall", "music room"] }],
  ["information", "The {person} at the clinic gave {who} ______ about the test.", { person: ["nurse", "doctor", "receptionist", "dentist"], who: ["me", "us", "my mum", "Grandpa"] }],
  ["news", "There is ______ about our {thing} on the website, {name}.", { thing: ["school", "team", "college", "club"], name: NAME }],
].map(([n, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS(n), key: 0, why: U(n), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write a, an or some.";
const S = (n) => `${n[0].toUpperCase()}${n.slice(1)} is uncountable, so use some, not a/an.`;
const A = (n, a) => `You can count one ${n}, so use ${a}: ${a} ${n}.`;
const BUILD = [
  ["some", S("information"), "We got ______ information about the bus to {city}, {name}.", { city: CITY, name: NAME }],
  ["a", A("suitcase", "a"), "{name} has ______ suitcase for the trip to {city}.", { name: NAME, city: CITY }],
  ["some", S("news"), "I have ______ news about the {thing}, {name}.", { thing: ["exam", "trip", "match", "party"], name: NAME }],
  ["an", A("idea", "an"), "Timur has ______ idea for the {event} on {day}.", { event: ["party", "picnic", "project", "trip"], day: ["Friday", "Saturday", "Sunday", "Navruz"] }],
  ["some", S("luggage"), "There is ______ luggage in the {place}, {name}.", { place: ["hall", "car", "taxi", "corridor"], name: NAME }],
  ["a", A("message", "a"), "My teacher sent me ______ message about the {thing}.", { thing: ["exam", "homework", "lesson", "trip"] }],
  ["some", S("equipment"), "The club bought ______ new equipment for the {room} in {city}.", { room: ["gym", "pool", "sports hall", "studio"], city: CITY }],
  ["an", A("email", "an"), "{name} got ______ email from the {group}.", { name: NAME, group: ["college", "university", "bank", "school"] }],
  ["some", S("knowledge"), "You need ______ knowledge of {subject} for this job, {name}.", { subject: ["English", "computers", "maths", "Russian"], name: NAME }],
  ["a", A("job", "a"), "My cousin found ______ job in {city}.", { city: CITY }],
  ["some", S("work"), "{name} has ______ work to do before the {event}.", { name: NAME, event: ["meeting", "exam", "trip", "holiday"] }],
  ["an", A("answer", "an"), "The teacher wants ______ answer from {who} today.", { who: ["me", "Aziz", "the class", "Olga"] }],
  ["some", S("information"), "This website has ______ useful information about {city}.", { city: CITY }],
  ["a", A("bag", "a"), "Olga bought ______ bag for the trip to {city}.", { city: CITY }],
  ["some", S("news"), "We heard ______ good news about {topic} today, {name}.", { topic: ["the team", "Grandpa", "the new school", "the exam"], name: NAME }],
  ["an", A("umbrella", "an"), "Take ______ umbrella to {place}, {name}.", { place: ["school", "work", "the park", "college"], name: NAME }],
  ["some", S("equipment"), "We took ______ camping equipment to the {place}.", { place: ["mountains", "lake", "forest", "river"] }],
  ["a", A("question", "a"), "Malika has ______ question about the {thing}.", { thing: ["exam", "trip", "homework", "timetable"] }],
  ["some", S("luggage"), "{name} carried ______ luggage to the {place}.", { name: NAME, place: ["taxi", "train", "hotel", "bus"] }],
  ["some", S("work"), "Dad has ______ work at the {place} on {day}.", { place: ["office", "factory", "bank", "hospital"], day: ["Saturday", "Sunday", "Friday", "Monday"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_A = "The first sentence has a mistake with a/an. Complete the correct sentence with one word.";
const T_S = "The first sentence has a mistake. Complete the correct sentence with one word.";
const T_CH = "Say the same thing with the uncountable noun. Complete the sentence with one word.";
const TRANSFORM = [
  [T_A, "Can you give me an information about the {thing}, {name}?", "Can you give me ______ information about the {thing}, {name}?", "some", S("information"), { thing: ["course", "trip", "exam", "hotel"], name: NAME }],
  [T_A, "I have a news about {topic}, {name}.", "I have ______ news about {topic}, {name}.", "some", S("news"), { topic: ["the trip", "the team", "my job", "the exam"], name: NAME }],
  [T_A, "There is a luggage in the {place}, {name}.", "There is ______ luggage in the {place}, {name}.", "some", S("luggage"), { place: ["hall", "taxi", "car", "corridor"], name: NAME }],
  [T_A, "We bought an equipment for the {room}, {name}.", "We bought ______ equipment for the {room}, {name}.", "some", S("equipment"), { room: ["gym", "lab", "music room", "computer room"], name: NAME }],
  [T_A, "{name} has a work to do in {city}.", "{name} has ______ work to do in {city}.", "some", S("work"), { name: NAME, city: CITY }],
  [T_S, "The guide gave us many informations about {city}, {name}.", "The guide gave us a lot of ______ about {city}, {name}.", "information", "Information is uncountable, so it never takes -s.", { city: CITY, name: NAME }],
  [T_S, "We heard many newses from {city}, {name}.", "We heard a lot of ______ from {city}, {name}.", "news", "News is uncountable. It already ends in s, but it is not a plural.", { city: CITY, name: NAME }],
  [T_S, "{name} took many luggages to {city}.", "{name} took a lot of ______ to {city}.", "luggage", "Luggage is uncountable, so it never takes -s.", { name: NAME, city: CITY }],
  [T_S, "The {room} has many new equipments, {name}.", "The {room} has a lot of new ______, {name}.", "equipment", "Equipment is uncountable, so it never takes -s.", { room: ["gym", "lab", "music room", "sports hall"], name: NAME }],
  [T_S, "My teacher has many knowledges about {subject}, {name}.", "My teacher has a lot of ______ about {subject}, {name}.", "knowledge", "Knowledge is uncountable, so it never takes -s.", { subject: ["history", "science", "music", "computers"], name: NAME }],
  [T_CH, "We have three suitcases for the trip to {city}, {name}.", "We have ______ luggage for the trip to {city}, {name}.", "some", "Suitcase is countable, but luggage is uncountable, so use some luggage.", { city: CITY, name: NAME }],
  [T_CH, "The gym has new balls and nets, {name}.", "The gym has ______ new equipment, {name}.", "some", "Balls and nets are countable, but equipment is uncountable, so use some.", { name: NAME }],
  [T_CH, "I have two facts about the {thing} in {city}.", "I have ______ information about the {thing} in {city}.", "some", "Fact is countable, but information is uncountable, so use some.", { thing: ["museum", "old town", "market", "mosque"], city: CITY }],
  [T_CH, "{name} has two tasks for the {event}.", "{name} has ______ work for the {event}.", "some", "Task is countable, but work (meaning things to do) is uncountable, so use some.", { name: NAME, event: ["meeting", "party", "trip", "exam"] }],
  [T_CH, "I have two messages from {city}, {name}.", "I have ______ news from {city}, {name}.", "some", "Message is countable, but news is uncountable, so use some.", { city: CITY, name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask for information about a bus or train. Write one question.", "some information", ["exactly one question", "must use information", "no an before information"]],
  ["Tell a friend you have news for them. Write one sentence.", "some news", ["exactly one sentence", "must use news"]],
  ["Write one sentence about your luggage for a trip.", "luggage", ["exactly one sentence", "must use luggage", "no -s on luggage"]],
  ["Write one sentence about sports equipment.", "equipment", ["exactly one sentence", "must use equipment"]],
  ["Write one sentence about the work you have this week.", "some work", ["exactly one sentence", "must use work"]],
  ["Write one sentence with a lot of information.", "a lot of information", ["exactly one sentence", "must use a lot of information"]],
  ["Write one sentence with a suitcase and some luggage.", "a suitcase / some luggage", ["exactly one sentence", "must use a suitcase", "must use luggage"]],
  ["Write two sentences: one with information and one with news.", "information / news", ["exactly two sentences", "must use information", "must use news"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are planning a trip. Write three or four sentences about what you need to know and take.", "abstract uncountable nouns", ["information", "luggage", "some"]],
  ["Write a short message to a friend with some news. Write three or four sentences.", "abstract uncountable nouns", ["news", "some", "good news / bad news"]],
  ["Describe the gym or sports hall at your school. Write three or four sentences.", "abstract uncountable nouns", ["equipment", "a lot of", "There is"]],
  ["Write about a job you want. What knowledge and information do you need? Write three or four sentences.", "abstract uncountable nouns", ["knowledge", "information", "work"]],
  ["Write about your week at school or work. Write three or four sentences.", "abstract uncountable nouns", ["work", "news", "some"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.countability.uncountable-abstract.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.countability.uncountable-abstract.json`);