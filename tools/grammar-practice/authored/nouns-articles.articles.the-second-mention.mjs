// Hand-authored: nouns-articles / articles / the-second-mention (B1).
// Wave C, C1 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: "a on first mention, the on second mention".
// Sibling scope: the-shared-context (A1) already keys ONLY "the" (second
// mention, the only one here, a known plural). This topic is the CONTRAST:
// about half the keys are "a" (first mention) and half "the" (the same thing
// mentioned again), so the learner has to read the context to choose.
// One right answer: every "a" gap is a first mention in a frame where "the"
// is wrong (There is/was ___, has/have got ___, Can I ask you ___ question),
// never after verbs like buy / find / want where "the" could mean a known
// one. Every "the" gap comes after the thing was named with a/an.
// Options: a / the / an / – . Every noun or adjective after the gap starts
// with a consonant sound, so "an" is never right; "–" is the Uzbek/Russian
// no-article error.
// Rule 4: a typed "a" sentence prints no other "a", a typed "the" sentence no
// other "the" (the first mention "a horse" is the cue for "the").
// Transform: 5 wrong a / no article → the, 5 wrong the / no article → a,
// 5 two gaps (a … the).
//
// Run: node tools/grammar-practice/authored/nouns-articles.articles.the-second-mention.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "articles", topic: "the-second-mention", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const OPT = { a: ["a", "the", "an", "–"], the: ["the", "a", "an", "–"] };
const WHY = {
  a: "First mention: the listener doesn't know this one yet, so use a.",
  the: "Second mention: we already said a …, so now we both know which one. Use the.",
};
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["a", "There was ______ tall man at the {place} this morning. The man asked me the way to the {dest}.", { place: ["bus stop", "school gate", "corner", "metro exit"], dest: ["bazaar", "museum", "bank", "post office"] }],
  ["the", "I saw a cat and a dog in the {place}. ______ dog was {doing}.", { place: ["yard", "park", "street", "garden"], doing: ["sleeping", "barking", "eating", "running"] }],
  ["a", "My uncle has ______ small shop in {city}. The shop sells {goods}.", { city: ["Tashkent", "Namangan", "Andijan", "Karshi"], goods: ["fruit", "phones", "shoes", "bread"] }],
  ["the", "We bought a sofa and a lamp for our new {home}. ______ sofa was {adj}.", { home: ["flat", "house", "room", "dacha"], adj: ["expensive", "heavy", "cheap", "very soft"] }],
  ["a", "There's ______ letter for you on the {place}, {name}. The letter is from the bank.", { place: ["table", "desk", "shelf", "sofa"], name: NAME }],
  ["the", "A boy and a girl from my class came to the {event}. ______ girl brought a {gift}.", { event: ["party", "birthday party", "picnic", "dinner"], gift: ["cake", "salad", "present", "bag of fruit"] }],
  ["a", "I have ______ new teacher this year. The teacher is from {city} and teaches {subject}.", { city: ["Bukhara", "Kazan", "Samarkand", "Almaty"], subject: ["maths", "history", "biology", "chemistry"] }],
  ["the", "Last week I watched a film and read a book. ______ film was about {topic}, and I watched it with {who}.", { topic: ["space", "a football team", "two friends", "a long trip"], who: ["my brother", "my friends", "Dad", "my cousin"] }],
  ["a", "There is ______ big tree in front of our {home}. The tree is older than my {who}.", { home: ["house", "school", "flat", "college"], who: ["grandfather", "grandmother", "father", "mother"] }],
  ["the", "Our teacher gave us a story and a poem {when}. ______ poem was {adj}.", { when: ["on Monday", "yesterday", "last week", "this morning"], adj: ["short", "beautiful", "hard", "sad"] }],
  ["a", "There was ______ bird in our {place} yesterday. The bird was {doing}.", { place: ["kitchen", "classroom", "yard", "garden"], doing: ["singing", "very loud", "eating seeds", "hungry"] }],
  ["the", "I ordered soup and a salad at the {place}. ______ salad was {adj}.", { place: ["café", "restaurant", "canteen", "choyxona"], adj: ["fresh", "too salty", "very good", "cold"] }],
  ["a", "My cousin has ______ cat called {cname}. The cat sleeps on the {place} all day.", { cname: ["Mosh", "Tom", "Laylo", "Barsik"], place: ["sofa", "bed", "chair", "carpet"] }],
  ["the", "There is a bank and a pharmacy on our {street}. ______ pharmacy opens at {time}.", { street: ["street", "corner", "road", "square"], time: ["eight", "nine", "seven", "ten"] }],
  ["a", "We have ______ new student in our group, {name}. The student is from {city}.", { name: NAME, city: ["Kazan", "Almaty", "Bishkek", "Khiva"] }],
  ["the", "A woman and her son got on the {vehicle}. ______ son was carrying a {thing}.", { vehicle: ["bus", "train", "tram", "metro"], thing: ["big box", "guitar", "football", "heavy bag"] }],
  ["a", "There was ______ long queue at the {place} today, {name}. The queue was very slow.", { place: ["bank", "post office", "bazaar", "pharmacy"], name: NAME }],
  ["the", "Mum made plov and a cake for the {event}. ______ cake was {adj}.", { event: ["party", "guests", "wedding", "holiday"], adj: ["sweet", "delicious", "huge", "beautiful"] }],
  ["a", "I've got ______ plan for the {when}, {name}. The plan is simple.", { when: ["weekend", "holidays", "trip", "summer"], name: NAME }],
  ["the", "We met a doctor and a teacher at the {event}. ______ doctor was very {adj}.", { event: ["wedding", "party", "meeting", "concert"], adj: ["friendly", "funny", "kind", "quiet"] }],
].map(([k, prompt, slots], i) => {
  const base = OPT[k];
  const capd = prompt.startsWith("______") ? base.map((o) => (o === "–" ? o : o[0].toUpperCase() + o.slice(1))) : base;
  const options = rot(capd, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(capd[0]), why: WHY[k], slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write a or the.";
// Typed gaps: the schema refuses a key word printed elsewhere in the sentence,
// so an "a" gap never has another "a" in its sentence and a "the" gap never has
// another "the". The first mention "a …" stays as the cue for "the".
const BUILD = [
  ["a", "There is ______ new café near {place}, {name}.", { place: ["our school", "my flat", "our college", "my office"], name: NAME }],
  ["The", "I bought a hat and a scarf for {who}. ______ scarf is {colour}.", { who: ["Grandma", "my sister", "Mum", "my aunt"], colour: ["red", "blue", "green", "white"] }],
  ["a", "My brother has ______ new job in {city}, {name}.", { city: ["Tashkent", "Navoi", "Andijan", "Karshi"], name: NAME }],
  ["The", "A man and his daughter were waiting for {what}. ______ daughter was {doing}.", { what: ["a bus", "a taxi", "their friend", "a train"], doing: ["reading", "smiling", "eating an apple", "very tired"] }],
  ["a", "In art class {name} drew ______ picture of {thing}.", { name: NAME, thing: ["our school", "two horses", "some flowers", "mountains"] }],
  ["The", "We have a cat and a parrot at home. ______ parrot can say \"{word}\", {name}.", { word: ["hello", "salom", "privet", "thank you"], name: NAME }],
  ["a", "There was ______ big box outside our door {when}, {name}.", { when: ["this morning", "last night", "on Monday", "after lunch"], name: NAME }],
  ["The", "Our class has a new board and a new computer. ______ computer is very {adj}, {name}.", { adj: ["fast", "quiet", "useful", "good"], name: NAME }],
  ["a", "{name} has ______ sister and two {who}.", { name: NAME, who: ["brothers", "cats", "dogs", "parrots"] }],
  ["The", "I ordered a tea and a sandwich. ______ sandwich was {adj}, {name}.", { adj: ["cold", "tasty", "huge", "fresh"], name: NAME }],
  ["a", "There's ______ small hole in my {thing}, {name}.", { thing: ["shoe", "jacket", "bag", "sock"], name: NAME }],
  ["The", "A girl and a boy sang at our {event}. ______ boy was only {age}.", { event: ["concert", "party", "wedding", "festival"], age: ["ten", "eight", "twelve", "nine"] }],
  ["a", "I had ______ strange dream last night, {name}. It was about {topic}.", { name: NAME, topic: ["my school", "flying", "my grandmother", "our old house"] }],
  ["The", "There's a pen and a notebook on my {place}. ______ notebook is {owner}'s.", { place: ["desk", "table", "shelf", "chair"], owner: NAME }],
  ["a", "Can I ask you ______ question about the {thing}, {name}?", { thing: ["homework", "test", "trip", "plan"], name: NAME }],
  ["The", "I saw a horse and a cow near our {place}. ______ cow was {doing}.", { place: ["village", "house", "farm", "school"], doing: ["eating grass", "drinking water", "lying down", "sleeping"] }],
  ["a", "There's ______ man at the door, {name}. He wants to see {who}.", { name: NAME, who: ["your dad", "your mum", "you", "Grandpa"] }],
  ["The", "We stayed in a small hotel in {city}. It had a garden. ______ garden was full of {plant}.", { city: ["Khiva", "Bukhara", "Samarkand", "Shakhrisabz"], plant: ["roses", "flowers", "fruit trees", "tulips"] }],
  ["a", "I've got ______ headache, {name}. Can you turn off the {thing}?", { name: NAME, thing: ["TV", "music", "radio", "light"] }],
  ["The", "My friend sent me a photo and a video. ______ video was {adj}, {name}.", { adj: ["funny", "very short", "long", "great"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[key.toLowerCase()], slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake with a or the.";
const TWO = "Write a or the in each gap.";
const NO_THE = "We already said a …, so we both know which one. Use the; English can't leave it out.";
const TRANSFORM = [
  // wrong a / no article -> the (5)
  [COR, "We met a boy and a girl at {event}. A girl was {who}'s sister.", "We met a boy and a girl at {event}. ______ girl was {who}'s sister.", "The", WHY.the, { event: ["my cousin's wedding", "our school", "our picnic", "a concert"], who: ["my friend", "Olga", "Timur", "our teacher"] }],
  [COR, "I bought a shirt and a belt {when}. Belt was {adj}.", "I bought a shirt and a belt {when}. ______ belt was {adj}.", "The", NO_THE, { when: ["yesterday", "last week", "on Sunday", "for Navruz"], adj: ["cheap", "too long", "black", "nice"] }],
  [COR, "My aunt has a dog and a cat. A cat is {colour}, {name}.", "My aunt has a dog and a cat. ______ cat is {colour}, {name}.", "The", WHY.the, { colour: ["white", "black", "grey", "brown"], name: NAME }],
  [COR, "We watched a match and a film {when}. Film was {adj}.", "We watched a match and a film {when}. ______ film was {adj}.", "The", NO_THE, { when: ["on Saturday", "last night", "yesterday", "at home"], adj: ["boring", "great", "very long", "funny"] }],
  [COR, "There's a sink and a cooker in our kitchen. A cooker is {adj}, {name}.", "There's a sink and a cooker in our kitchen. ______ cooker is {adj}, {name}.", "The", WHY.the, { adj: ["new", "old", "very small", "broken"], name: NAME }],
  // wrong the / no article -> a (5)
  [COR, "There is the new shop on our {street}, {name}.", "There is ______ new shop on our {street}, {name}.", "a", WHY.a, { street: ["street", "corner", "road", "square"], name: NAME }],
  [COR, "My uncle has the farm in {region}. The farm has {animal}.", "My uncle has ______ farm in {region}. The farm has {animal}.", "a", WHY.a, { region: ["the mountains", "the village", "Jizzakh", "Surkhandarya"], animal: ["cows", "sheep", "horses", "goats"] }],
  [COR, "Last night I saw film about {topic}. The film was great, {name}.", "Last night I saw ______ film about {topic}. The film was great, {name}.", "a", "First mention of one film: the listener doesn't know it yet. Use a; it can't be left out.", { topic: ["space", "two brothers", "the sea", "old cars"], name: NAME }],
  [COR, "There's the strange noise in our {room}, {name}.", "There's ______ strange noise in our {room}, {name}.", "a", WHY.a, { room: ["kitchen", "garden", "yard", "hall"], name: NAME }],
  [COR, "I have got new phone. The phone is {colour}, {name}.", "I have got ______ new phone. The phone is {colour}, {name}.", "a", "First mention of one phone: the listener doesn't know it yet. Use a; it can't be left out.", { colour: ["black", "white", "blue", "silver"], name: NAME }],
  // two gaps (5)
  [TWO, "We found ___ small kitten in the {place}. ___ kitten was {state}.", "We found ______ small kitten in the {place}. ______ kitten was {state}.", ["a", "The"], "First mention → a; the same kitten again → the.", { place: ["yard", "street", "garden", "park"], state: ["hungry", "cold", "wet", "scared"] }],
  [TWO, "There's ___ bakery and a bank on my street. ___ bakery opens at {time}, {name}.", "There's ______ bakery and a bank on my street. ______ bakery opens at {time}, {name}.", ["a", "The"], "First mention → a; the same bakery again → the.", { time: ["six", "seven", "eight", "nine"], name: NAME }],
  [TWO, "We have ___ garden behind our house. ___ garden is full of {thing} in {season}.", "We have ______ garden behind our house. ______ garden is full of {thing} in {season}.", ["a", "The"], "First mention → a; the same garden again → the.", { thing: ["flowers", "roses", "butterflies", "birds"], season: ["spring", "summer", "May", "June"] }],
  [TWO, "There was ___ big storm {when}, {name}. ___ storm broke our window.", "There was ______ big storm {when}, {name}. ______ storm broke our window.", ["a", "The"], "First mention → a; the same storm again → the.", { when: ["last night", "on Sunday", "yesterday", "this morning"], name: NAME }],
  [TWO, "There was ___ woman with a map at the {place}. ___ woman needed help with her {thing}.", "There was ______ woman with a map at the {place}. ______ woman needed help with her {thing}.", ["a", "The"], "First mention → a; the same woman again → the.", { place: ["station", "bus stop", "bazaar", "hotel"], thing: ["bags", "ticket", "phone", "suitcase"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write two sentences about something you bought. Use a the first time and the the second time.", "I bought a … The … was …", ["exactly two sentences", "a on first mention", "the on second mention"]],
  ["Write two sentences about a person you saw on the way to school or work.", "I saw a … The … was …", ["exactly two sentences", "a then the", "a past verb"]],
  ["Write two sentences about an animal you know.", "My … has a … The … is …", ["exactly two sentences", "a then the", "an animal word"]],
  ["Write two sentences about a film or a book you liked.", "I watched / read a … The … was about …", ["exactly two sentences", "a then the", "about"]],
  ["Write two sentences about a place near your home.", "There is a … near my home. The … is …", ["exactly two sentences", "There is a …", "the on second mention"]],
  ["Write two sentences about a present you got.", "I got a … The … is …", ["exactly two sentences", "a then the", "an adjective"]],
  ["Write two sentences about two things on your desk, then say something about one of them.", "There's a … and a … The … is …", ["exactly two sentences", "two things with a", "one of them with the"]],
  ["Write two sentences about a meal you had in a café.", "I ordered a … The … was …", ["exactly two sentences", "a then the", "a food word"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell a short story about something strange you saw in your street.", "a … (first time) / the … (again)", ["a on first mention", "the for the same thing again", "three or four sentences"]],
  ["Describe your room: name some things in it, then say more about two of them.", "There is a … The … is …", ["a for new things", "the for things already named", "three or four sentences"]],
  ["Describe a visit to the bazaar: what did you buy, and what was it like?", "I bought a … The … was …", ["a then the", "past verbs", "three or four sentences"]],
  ["Describe a new person in your class, group or job.", "We have a new … The … is from …", ["a then the", "a place word", "three or four sentences"]],
  ["Describe a trip: where did you stay, and what was it like?", "We stayed in a … The … had …", ["a then the", "past verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/nouns-articles.articles.the-second-mention.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);