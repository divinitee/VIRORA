// Hand-authored: sentence-structure / conjunctions / because (A2).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "because for a reason" (I stayed at home ______ I was feeling
// sick: but / because / so / although). Giving reasons is the backbone of
// speaking ("I like it because…"). Choose: 14 items pick because against so
// (the result, the reverse direction), but (contrast) and "because of" + a
// sentence (a real error). 6 items need "because of" + a noun (because of the
// rain), with "because the rain" as the error. "and" is never offered (it can
// join two facts: "I was ill and I stayed at home"). Every so / but option was
// read in its sentence to be sure it is not defensible.
// Build: write because or because of. Transform: so → because (reverse the
// sentence), because of + noun → because + sentence, two sentences → one.
//
// Run: node tools/grammar-practice/authored/sentence-structure.conjunctions.because.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "conjunctions", topic: "because", level: "A2", pv: "2.5" };

const BC = "Because introduces the reason (the answer to Why?). So introduces a result, and but a contrast. Because of needs a noun, not a sentence.";
const BOF = "Use because of + a noun (because of the rain) and because + a sentence with a verb (because it was raining).";
const O = ["because", "so", "but", "because of"];
const OC = ["Because", "So", "But", "Because of"];
const OF = ["because of", "because", "so", "but"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O, BC, "I stayed at home {when} ______ I was {ill}.",
    { when: ["yesterday", "on Monday", "last week", "on Friday"], ill: ["ill", "tired", "sick", "unwell"] }],
  [O, BC, "Aziz is happy ______ he {reason}, {name}.",
    { reason: ["passed his exam", "got a new bike", "won the match", "has a new phone"], name: ["Mum", "Olga", "Timur", "Lola"] }],
  [O, BC, "We can't play outside ______ it's {weather}, {name}.",
    { weather: ["raining", "snowing", "too hot", "dark"], name: ["Bobur", "Kamila", "Sardor", "Madina"] }],
  [O, BC, "I'm learning English ______ I want to {goal} {when}.",
    { goal: ["study abroad", "travel", "work in IT", "watch films in English"], when: ["one day", "next year", "in the future", "after school"] }],
  [O, BC, "She's wearing a {garment} ______ it's {adj} today.",
    { garment: ["coat", "scarf", "hat", "jacket"], adj: ["cold", "windy", "freezing", "chilly"] }],
  [O, BC, "The {shop} is closed ______ it's {day}.",
    { shop: ["shop", "bank", "post office", "café"], day: ["Sunday", "a holiday", "very late", "New Year"] }],
  [O, BC, "My little brother is crying ______ he {reason}.",
    { reason: ["lost his toy", "is hungry", "fell down", "is tired"] }],
  [O, BC, "We took a taxi to the {place} ______ we were {late}.",
    { place: ["station", "airport", "theatre", "stadium"], late: ["late", "in a hurry", "tired", "lost"] }],
  [O, BC, "I didn't call you, {name}, ______ my phone was {state}.",
    { name: ["Aziza", "Bekzod", "Olga", "Rustam"], state: ["broken", "dead", "at home", "switched off"] }],
  [O, BC, "Lola is going to bed early ______ she has {event} tomorrow.",
    { event: ["an exam", "a test", "a long trip", "an early flight"] }],
  [OC, BC, "Why are you late, {name}? — ______ I missed the {transport}.",
    { name: ["Aziz", "Lola", "Jasur", "Nodira"], transport: ["bus", "train", "metro", "minibus"] }],
  [OC, BC, "Why do you like {city}? — ______ it's {adj}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], adj: ["beautiful", "old", "quiet", "green"] }],
  [O, BC, "Dad is angry ______ I {reason}.",
    { reason: ["broke the window", "came home late", "lost the keys", "didn't do my homework"] }],
  [O, BC, "We love our teacher ______ she {reason}.",
    { reason: ["is kind", "explains well", "makes lessons fun", "helps us"] }],
  [OF, BOF, "The match was cancelled ______ the {weather}.",
    { weather: ["rain", "snow", "storm", "wind"] }],
  [OF, BOF, "I couldn't sleep {when} ______ the {noise}.",
    { when: ["last night", "on Friday", "at all", "again"], noise: ["noise", "music", "neighbours", "traffic"] }],
  [OF, BOF, "We were late for {event} ______ the {thing}.",
    { event: ["school", "work", "the lesson", "the film"], thing: ["traffic", "snow", "rain", "long queue"] }],
  [OF, BOF, "The flight was delayed ______ {reason}.",
    { reason: ["bad weather", "the fog", "a problem with the plane", "the snow"] }],
  [OF, BOF, "Many tourists visit {city} ______ its {thing}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Shahrisabz"], thing: ["old buildings", "history", "markets", "beautiful squares"] }],
  [OF, BOF, "My sister is in hospital ______ a {problem}.",
    { problem: ["broken leg", "broken arm", "high fever", "bad back"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write because or because of.";
const BUILD = [
  ["because", "I'm tired ______ I worked all {time}, {name}.",
    { time: ["day", "night", "weekend", "morning"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["because", "We're happy ______ our team won the {game} {when}.",
    { game: ["match", "final", "cup", "game"], when: ["yesterday", "last night", "on Sunday", "again"] }],
  ["because", "Bobur is learning Korean ______ he wants to work in {place}.",
    { place: ["Seoul", "Busan", "Korea", "a Korean company"] }],
  ["because", "I can't come {when} ______ I have to {act}.",
    { when: ["tonight", "on Saturday", "tomorrow", "this weekend"], act: ["study", "work", "help my mum", "look after my sister"] }],
  ["because", "The baby is crying ______ she's {state}, {name}.",
    { state: ["hungry", "tired", "sleepy", "cold"], name: ["Dad", "Aziza", "Grandma", "Timur"] }],
  ["because", "I took an umbrella {when} ______ it was {weather}.",
    { when: ["this morning", "today", "yesterday", "on Monday"], weather: ["raining", "cloudy", "grey", "wet"] }],
  ["because", "We opened the windows ______ it was {adj} in the {room}.",
    { adj: ["hot", "stuffy", "warm", "too warm"], room: ["classroom", "kitchen", "bedroom", "office"] }],
  ["because", "My dad sold his {vehicle} ______ it was too {adj}.",
    { vehicle: ["car", "van", "motorbike", "bike"], adj: ["old", "expensive", "small", "slow"] }],
  ["because", "Kamila didn't go to school {when} ______ she had a {illness}.",
    { when: ["yesterday", "on Monday", "last week", "today"], illness: ["cold", "headache", "fever", "sore throat"] }],
  ["because", "I love summer ______ I can {act}.",
    { act: ["swim every day", "eat watermelon", "sleep late", "go to the mountains"] }],
  ["because", "Jasur is late {when} ______ he missed the {transport}.",
    { when: ["today", "again", "this morning", "for class"], transport: ["bus", "train", "metro", "minibus"] }],
  ["because", "We stayed inside ______ it was {temp} outside, {name}.",
    { temp: ["too hot", "freezing", "very windy", "dark"], name: ["Lola", "Bobur", "Sevara", "Anvar"] }],
  ["because of", "The school was closed {when} ______ the {weather}.",
    { when: ["yesterday", "on Monday", "today", "last Friday"], weather: ["snow", "storm", "heat", "ice"] }],
  ["because of", "We couldn't hear the teacher ______ the {noise}.",
    { noise: ["noise", "music", "traffic", "wind"] }],
  ["because of", "I was late {when} ______ the {thing} on the road.",
    { when: ["today", "this morning", "again", "yesterday"], thing: ["traffic", "snow", "ice", "roadworks"] }],
  ["because of", "The game stopped {when} ______ the {weather}.",
    { when: ["twice", "at half-time", "early", "for an hour"], weather: ["rain", "wind", "storm", "hail"] }],
  ["because of", "Grandpa stayed in bed {when} ______ his {problem}.",
    { when: ["all day", "yesterday", "this week", "on Sunday"], problem: ["bad back", "broken leg", "cold", "headache"] }],
  ["because of", "We didn't go to the beach {when} ______ the {weather}.",
    { when: ["yesterday", "on Sunday", "today", "last weekend"], weather: ["wind", "cold", "rain", "clouds"] }],
  ["because of", "I chose this university ______ its {thing}.",
    { thing: ["good teachers", "location", "library", "sports centre"] }],
  ["because of", "My sister is popular at school ______ her {quality}.",
    { quality: ["kindness", "smile", "jokes", "cooking"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "because" ? `A sentence with its own verb follows, so use because. ${BOF}` : `Only a noun follows, so use because of. ${BOF}`, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SO = "Say the same thing with because. Start with the result.";
const NOUN = "Change because of + noun into because + a full sentence.";
const JOIN = "Join the two sentences with because.";
const TRANSFORM = [
  // so -> because (5)
  [SO, "Aziz was hungry, so he made a {food}.", "Aziz made a {food} ______ (hungry).", "because he was hungry", [],
    "The reason (he was hungry) comes after because. So gave the result; because gives the reason.",
    { food: ["sandwich", "salad", "pizza", "omelette"] }],
  [SO, "It was cold, so the children played {where} {when}.", "The children played {where} {when} ______ (cold).", "because it was cold", [],
    "Put the reason after because: because it was cold.",
    { where: ["inside", "at home", "in the gym", "in the hall"], when: ["yesterday", "on Monday", "all day", "after school"] }],
  [SO, "Lola was tired, so she went to bed {when}.", "Lola went to bed {when} ______ (tired).", "because she was tired", [],
    "Put the reason after because: because she was tired.",
    { when: ["early", "at nine", "after dinner", "before ten"] }],
  [SO, "The bus didn't come, so we walked to {place} {when}.", "We walked to {place} {when} ______ (come).", "because the bus didn't come", [],
    "Put the reason after because: because the bus didn't come.",
    { place: ["school", "work", "the station", "the market"], when: ["today", "this morning", "again", "yesterday"] }],
  [SO, "My phone was broken, so I didn't answer your {msg}, {name}.", "{name}, I didn't answer your {msg} ______ (broken).", "because my phone was broken", [],
    "Put the reason after because: because my phone was broken.",
    { msg: ["call", "message", "calls", "text"], name: ["Aziz", "Olga", "Mum", "Timur"] }],
  // because of + noun -> because + sentence (5)
  [NOUN, "We stayed at home {when} because of the rain.", "We stayed at home {when} ______ (rain).", "because it was raining", ["because it rained"],
    "Because of + noun (the rain) becomes because + a sentence: because it was raining.",
    { when: ["yesterday", "on Sunday", "all weekend", "last night"] }],
  [NOUN, "The match stopped {when} because of the snow.", "The match stopped {when} ______ (snow).", "because it was snowing", ["because it snowed"],
    "Because of the snow becomes because it was snowing.",
    { when: ["early", "twice", "after ten minutes", "at half-time"] }],
  [NOUN, "{name} couldn't sleep because of the noise.", "{name} couldn't sleep ______ (noisy).", "because it was noisy", ["because it was so noisy", "because it was too noisy", "because it was very noisy"],
    "Because of the noise becomes because it was noisy.",
    { name: ["Aziz", "Malika", "My brother", "Grandma"] }],
  [NOUN, "Malika stayed in bed {when} because of her headache.", "Malika stayed in bed {when} ______ (headache).", "because she had a headache", ["because her head hurt"],
    "Because of her headache becomes because she had a headache.",
    { when: ["all day", "yesterday", "this morning", "on Sunday"] }],
  [NOUN, "They cancelled our flight {when} because of the fog.", "They cancelled our flight {when} ______ (foggy).", "because it was foggy", ["because it was very foggy"],
    "Because of the fog becomes because it was foggy.",
    { when: ["yesterday", "this morning", "last night", "again"] }],
  // two sentences -> one (5)
  [JOIN, "Bobur is happy. He passed his {exam} {when}.", "Bobur is happy ______ (pass) his {exam} {when}.", "because he passed", [],
    "The second sentence is the reason, so join with because: because he passed…",
    { exam: ["exam", "driving test", "maths test", "English test"], when: ["yesterday", "this week", "on Monday", "at last"] }],
  [JOIN, "We love {city}. It's very beautiful.", "We love {city} ______ (beautiful).", "because it's very beautiful", ["because it is very beautiful", "because it's beautiful", "because it is beautiful"],
    "The second sentence is the reason: because it's very beautiful.",
    { city: ["Samarkand", "Bukhara", "Khiva", "our city"] }],
  [JOIN, "My brother is learning English. He wants to travel {where}.", "My brother is learning English ______ (travel) {where}.", "because he wants to travel", [],
    "The second sentence is the reason: because he wants to travel.",
    { where: ["abroad", "to London", "around the world", "to America"] }],
  [JOIN, "The children are tired. They played all {time} in the {place}.", "The children are tired ______ (play) all {time} in the {place}.", "because they played", [],
    "The second sentence is the reason: because they played…",
    { time: ["day", "afternoon", "morning", "evening"], place: ["park", "yard", "garden", "snow"] }],
  [JOIN, "Dad is angry. I broke his {thing} {when}.", "Dad is angry ______ (break) his {thing} {when}.", "because I broke", [],
    "The second sentence is the reason: because I broke… (break → broke).",
    { thing: ["phone", "glasses", "camera", "watch"], when: ["yesterday", "this morning", "last night", "again"] }],
].map(([instr, source, hint, key, acceptable, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots, ...(acceptable.length ? { acceptable } : {}),
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about why you are learning English.", "because + reason", ["exactly one sentence", "must use because", "the reason has its own verb"]],
  ["Write one sentence about your favourite season and why you like it.", "because", ["exactly one sentence", "must name a season", "must use because"]],
  ["Write one sentence about a time you were late and why.", "because + past", ["exactly one sentence", "must use because", "past tense"]],
  ["Answer the question: Why do you like your best friend?", "Because + reason", ["one or two sentences", "must use because", "a full sentence after because"]],
  ["Write one sentence about something that was cancelled because of the weather.", "because of + noun", ["exactly one sentence", "must use because of", "a noun after because of"]],
  ["Write one sentence about why you can't come to a friend's party.", "I can't come because …", ["exactly one sentence", "must use because", "must use can't"]],
  ["Write one sentence about a city you want to visit and why.", "because", ["exactly one sentence", "must name a city", "must use because"]],
  ["Write two sentences: one with because and one with because of.", "because / because of", ["exactly two sentences", "because + sentence", "because of + noun"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What is your favourite food, place and hobby? Say why you like each one. Write three or four sentences.",
    "because for reasons", ["because + a full sentence", "three different reasons", "no because of + sentence"]],
  ["You missed a lesson yesterday. Write a short message to your teacher explaining why.",
    "because / because of for an excuse", ["because + reason", "because of + noun", "polite words like sorry"]],
  ["Do you prefer living in a city or a village? Give two or three reasons.",
    "because to support an opinion", ["I prefer … because …", "two or more reasons", "full sentences after because"]],
  ["Describe a bad day you had. What went wrong and why? Write three or four sentences.",
    "because / because of in the past", ["because + past sentence", "because of + noun", "past tense verbs"]],
  ["Why do people visit Uzbekistan? Write three or four sentences for a tourist website.",
    "because / because of", ["because", "because of + noun", "place names"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.conjunctions.because.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
