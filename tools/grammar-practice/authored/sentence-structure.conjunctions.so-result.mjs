// Hand-authored: sentence-structure / conjunctions / so-result (A1).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "so for a result" (I am tired, ______ I am going to bed: so /
// but / because / or). The partner of the because topic: because → reason,
// so → result. Choose: 20 so-items; distractors because (the reverse
// direction), but and or, each read in its sentence to be sure it can't be
// said. "and" is never offered (it fits most result sentences: "I was tired
// and I went to bed"). Build: so or because, decided by direction (12 so,
// 8 because) — the confusion the two topics exist to fix. Transform: because →
// so (reverse the sentence), two sentences → one, "That's why" → so.
//
// Run: node tools/grammar-practice/authored/sentence-structure.conjunctions.so-result.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "conjunctions", topic: "so-result", level: "A1", pv: "2.5" };

const SO = "The second part is the result of the first, so use so. Because would give a reason, and but a contrast.";
const O = ["so", "because", "but", "or"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["I'm tired, ______ I'm going to bed {when}, {name}.",
    { when: ["now", "early", "at nine", "after dinner"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["It was raining {when}, ______ we took {thing}.",
    { when: ["this morning", "yesterday", "all day", "last night"], thing: ["an umbrella", "a taxi", "the bus", "our raincoats"] }],
  ["The shop was closed {when}, ______ we went to the {other}.",
    { when: ["yesterday", "on Sunday", "this morning", "again"], other: ["market", "supermarket", "bazaar", "next shop"] }],
  ["Aziz was hungry after {event}, ______ he {act}.",
    { event: ["school", "football", "work", "the trip"], act: ["made a sandwich", "ate some bread", "cooked some eggs", "bought a samsa"] }],
  ["My phone was dead {when}, ______ I couldn't call {who}.",
    { when: ["last night", "yesterday", "this morning", "all day"], who: ["you", "Mum", "my friends", "a taxi"] }],
  ["The bus didn't come {when}, ______ we {act}.",
    { when: ["this morning", "today", "again", "yesterday"], act: ["walked", "took a taxi", "called Dad", "went home"] }],
  ["It's very cold today, ______ wear a {thing}, {name}.",
    { thing: ["hat", "scarf", "coat", "warm jacket"], name: ["Timur", "Lola", "Jasur", "Nodira"] }],
  ["Lola studied hard {when}, ______ she {result}.",
    { when: ["all year", "every day", "for weeks", "last month"], result: ["passed the exam", "got a good mark", "did well", "won a prize"] }],
  ["I don't have any money {when}, ______ I can't buy {thing}.",
    { when: ["now", "today", "this week", "at the moment"], thing: ["the ticket", "a new phone", "lunch", "those shoes"] }],
  ["We missed the {transport}, ______ we {act}.",
    { transport: ["bus", "train", "metro", "minibus"], act: ["took a taxi", "walked", "waited an hour", "called Dad"] }],
  ["The film was {adj}, ______ we {act}.",
    { adj: ["boring", "too long", "very bad", "too scary"], act: ["left early", "went home", "fell asleep", "turned it off"] }],
  ["My brother wants to be a {job}, ______ he trains {when}.",
    { job: ["footballer", "swimmer", "runner", "tennis player"], when: ["every day", "after school", "at weekends", "every evening"] }],
  ["There was no milk {when}, ______ I drank {drink}.",
    { when: ["this morning", "at breakfast", "yesterday", "again"], drink: ["tea", "water", "juice", "black coffee"] }],
  ["The {room} was dark, ______ I turned on the {thing}.",
    { room: ["room", "kitchen", "hall", "garage"], thing: ["light", "lamp", "torch", "lights"] }],
  ["Our teacher was ill {when}, ______ we had {lesson}.",
    { when: ["yesterday", "on Monday", "last week", "today"], lesson: ["no class", "a free lesson", "a day off", "a different teacher"] }],
  ["It's Grandma's birthday {when}, ______ we're {act}.",
    { when: ["today", "tomorrow", "on Sunday", "this week"], act: ["making a cake", "buying flowers", "visiting her", "having a party"] }],
  ["I forgot my keys {when}, ______ I couldn't open the door.",
    { when: ["yesterday", "this morning", "again", "last night"] }],
  ["The tickets for the {event} were very expensive, ______ we {act}.",
    { event: ["concert", "match", "show", "festival"], act: ["didn't buy them", "stayed at home", "watched it online", "didn't go"] }],
  ["Kamila speaks Russian, ______ she {act}.",
    { act: ["can help the tourists", "translates for us", "is our translator", "helps at the hotel"] }],
  ["It was a beautiful day {when}, ______ we went to the {place}.",
    { when: ["yesterday", "on Sunday", "last weekend", "on Saturday"], place: ["park", "lake", "mountains", "river"] }],
].map(([prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: O, key: 0, why: SO, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write so or because.";
const W = { so: "The second part is the result, so use so.", because: "The second part is the reason (it answers Why?), so use because." };
const BUILD = [
  ["so", "I was thirsty {when}, ______ I drank some {drink}.",
    { when: ["after the game", "at night", "after the run", "in the afternoon"], drink: ["water", "juice", "tea", "lemonade"] }],
  ["so", "It was late, ______ we took a {transport} home, {name}.",
    { transport: ["taxi", "bus", "minibus", "tram"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["so", "The {who} was asleep, ______ we spoke {how}.",
    { who: ["baby", "Grandpa", "Grandma", "little one"], how: ["quietly", "very quietly", "softly", "in whispers"] }],
  ["so", "Bobur broke his leg, ______ he can't play {sport} {when}.",
    { sport: ["football", "basketball", "volleyball", "tennis"], when: ["this month", "for six weeks", "this season", "now"] }],
  ["so", "I didn't understand the question in {lesson}, ______ I asked the {person}.",
    { lesson: ["maths", "the test", "class", "the exam"], person: ["teacher", "guide", "coach", "examiner"] }],
  ["so", "The café was full {when}, ______ we went to {other}.",
    { when: ["tonight", "on Friday", "again", "at lunch"], other: ["another café", "a restaurant", "my house", "the park"] }],
  ["so", "My {thing} is very old, ______ I want a new one.",
    { thing: ["laptop", "phone", "bike", "watch"] }],
  ["so", "It was {weather} {when}, ______ the match was cancelled.",
    { weather: ["raining", "snowing", "very windy", "stormy"], when: ["on Saturday", "yesterday", "all day", "last night"] }],
  ["so", "We were hungry, ______ we ordered {food}, {name}.",
    { food: ["pizza", "plov", "burgers", "shashlik"], name: ["Dad", "Lola", "Aziz", "Olga"] }],
  ["so", "Olga lives near the {place}, ______ she walks there {when}.",
    { place: ["school", "university", "office", "gym"], when: ["every day", "every morning", "in ten minutes", "after lunch"] }],
  ["so", "I had a headache {when}, ______ I {act}.",
    { when: ["yesterday", "last night", "on Sunday", "after work"], act: ["went to bed early", "took a tablet", "stayed in bed", "lay down"] }],
  ["so", "The test is tomorrow, ______ let's study {when}, {name}.",
    { when: ["tonight", "now", "together", "this evening"], name: ["Kamila", "Bekzod", "Malika", "Rustam"] }],
  ["because", "I stayed at home {when} ______ I was {ill}.",
    { when: ["yesterday", "on Monday", "last week", "today"], ill: ["ill", "tired", "sick", "unwell"] }],
  ["because", "We went to the {place} {when} ______ it was sunny.",
    { place: ["park", "lake", "beach", "mountains"], when: ["yesterday", "on Sunday", "last weekend", "on Saturday"] }],
  ["because", "Aziz is happy ______ he got a new {thing}, {name}.",
    { thing: ["bike", "phone", "watch", "laptop"], name: ["Mum", "Olga", "Timur", "Lola"] }],
  ["because", "The children are tired ______ they played all {time} in the {place}.",
    { time: ["day", "afternoon", "morning", "evening"], place: ["park", "yard", "garden", "snow"] }],
  ["because", "I'm learning Korean ______ I love Korean {thing}.",
    { thing: ["music", "films", "food", "series"] }],
  ["because", "My mum is angry ______ I {act}.",
    { act: ["came home late", "lost my keys", "broke a plate", "forgot her birthday"] }],
  ["because", "We took a taxi {when} ______ we were {state}.",
    { when: ["this morning", "yesterday", "last night", "again"], state: ["late", "tired", "in a hurry", "lost"] }],
  ["because", "Lola can't come to the party ______ she's {state}, {name}.",
    { state: ["ill", "busy", "away", "at work"], name: ["Aziz", "Sardor", "Madina", "Bobur"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W[key], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REV = "Say the same thing with so. Start with the reason.";
const JOIN = "Join the two sentences with so. Use the verb in brackets.";
const WHY = "Rewrite with so instead of That's why.";
const TRANSFORM = [
  // because -> so (5)
  [REV, "We stayed at home {when} because it was raining.", "It was raining {when}, ______ (stay) at home.", "so we stayed", [],
    "Because gives the reason; so gives the result. Reason first, then so + result.",
    { when: ["yesterday", "on Sunday", "all day", "last night"] }],
  [REV, "Lola went to bed early because she was {state}.", "Lola was {state}, ______ (go) to bed early.", "so she went", [],
    "Reason first (she was tired), then so + result: so she went…",
    { state: ["tired", "ill", "sleepy", "very tired"] }],
  [REV, "The children played inside {when} because it was {weather}.", "It was {weather} {when}, ______ (play) inside.", "so the children played", ["so they played"],
    "Reason first, then so + result: so the children played inside.",
    { weather: ["cold", "raining", "snowing", "too hot"], when: ["yesterday", "on Monday", "all day", "after school"] }],
  [REV, "Aziz bought a new phone {when} because his old one was {state}.", "Aziz's old phone was {state}, ______ (buy) a new one {when}.", "so he bought", [],
    "Reason first, then so + result: so he bought a new one.",
    { state: ["broken", "very slow", "too old", "lost"], when: ["yesterday", "last week", "on Friday", "last month"] }],
  [REV, "Dad took a taxi {when} because he was {state}.", "Dad was {state}, ______ (take) a taxi {when}.", "so he took", [],
    "Reason first, then so + result: so he took a taxi.",
    { state: ["late", "tired", "in a hurry", "ill"], when: ["this morning", "yesterday", "last night", "again"] }],
  // two sentences -> one (5)
  [JOIN, "Aziz was late {when}. He ran to {place}.", "Aziz was late {when}, ______ (run) to {place}.", "so he ran", [],
    "The second sentence is the result, so join with so: so he ran.",
    { when: ["this morning", "today", "again", "yesterday"], place: ["school", "the bus stop", "work", "the station"] }],
  [JOIN, "The shop was closed. We went home {when}.", "The shop was closed, ______ (go) home {when}.", "so we went", [],
    "The second sentence is the result: so we went home.",
    { when: ["early", "without bread", "again", "at once"] }],
  [JOIN, "Malika was thirsty after {event}. She drank some {drink}.", "Malika was thirsty after {event}, ______ (drink) some {drink}.", "so she drank", [],
    "The second sentence is the result: so she drank…",
    { event: ["the game", "the run", "lunch", "the lesson"], drink: ["water", "juice", "tea", "milk"] }],
  [JOIN, "It was my brother's birthday. We made a {food} {when}.", "It was my brother's birthday, ______ (make) a {food} {when}.", "so we made", [],
    "The second sentence is the result: so we made…",
    { food: ["cake", "big plov", "pizza", "special dinner"], when: ["together", "in the morning", "for him", "at home"] }],
  [JOIN, "The film was {adj}. My friends left {when}.", "The film was {adj}, ______ (leave) {when}.", "so my friends left", ["so they left"],
    "The second sentence is the result: so my friends left.",
    { adj: ["boring", "too long", "very bad", "too scary"], when: ["early", "after an hour", "before the end", "at once"] }],
  // That's why -> so (5)
  [WHY, "The bus didn't come. That's why we walked {where}.", "The bus didn't come, ______ (walk) {where}.", "so we walked", [],
    "That's why = so: so we walked…",
    { where: ["home", "to school", "to the station", "all the way"] }],
  [WHY, "Bobur is ill. That's why he isn't at {place} {when}.", "Bobur is ill, ______ (be) at {place} {when}.", "so he isn't", [],
    "That's why = so: so he isn't at school.",
    { place: ["school", "work", "training", "the party"], when: ["today", "this week", "now", "tonight"] }],
  [WHY, "Our {who} is very kind. That's why everyone loves her, {name}.", "Our {who} is very kind, ______ (love) her, {name}.", "so everyone loves", [],
    "That's why = so: so everyone loves her.",
    { who: ["teacher", "neighbour", "coach", "doctor"], name: ["Aziz", "Olga", "Mum", "Timur"] }],
  [WHY, "It was {temp} in the {room}. That's why I opened the window.", "It was {temp} in the {room}, ______ (open) the window.", "so I opened", [],
    "That's why = so: so I opened the window.",
    { temp: ["hot", "stuffy", "warm", "too hot"], room: ["kitchen", "bedroom", "classroom", "office"] }],
  [WHY, "Olga didn't have her {thing} {when}. That's why she couldn't pay.", "Olga didn't have her {thing} {when}, ______ (pay).", "so she couldn't pay", [],
    "That's why = so: so she couldn't pay.",
    { thing: ["card", "wallet", "phone", "money"], when: ["at the shop", "yesterday", "at the café", "this morning"] }],
].map(([instr, source, hint, key, acceptable, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots, ...(acceptable.length ? { acceptable } : {}),
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence: you were hungry, and what you did.", "… , so …", ["exactly one sentence", "must use so", "result after so"]],
  ["Write one sentence about the weather today and what you are doing because of it.", "so for a result", ["exactly one sentence", "must use so", "must name the weather"]],
  ["Write one sentence about a time you were late and what happened.", "so in the past", ["exactly one sentence", "must use so", "past tense"]],
  ["Write one sentence about something you want, and what you are doing to get it.", "so", ["exactly one sentence", "must use so", "present tense"]],
  ["Write two sentences: one with so and one with because, about the same event.", "so / because", ["exactly two sentences", "one with so, one with because", "the same event"]],
  ["Write one sentence giving advice: It's cold, so … .", "so + advice", ["exactly one sentence", "must start with It's cold, so", "an instruction after so"]],
  ["Write one sentence about a friend who studied hard and the result.", "so", ["exactly one sentence", "must use so", "must name the friend"]],
  ["Write one sentence about something that was expensive and what you did.", "so", ["exactly one sentence", "must use so", "must use expensive"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a day when everything went wrong. Use so to show what happened next. Write three or four sentences.",
    "so for results", ["so + result", "past tense", "two or more uses of so"]],
  ["Give a friend advice for a trip to your city: the weather, transport and food. Use so.",
    "so for advice and results", ["it's … , so …", "advice after so", "place names"]],
  ["Describe your plans for next year and why. Use so and because.",
    "so / because", ["because + reason", "so + result", "future words"]],
  ["Tell a short story about a lost phone, keys or wallet. Use so and because.",
    "so / because in a story", ["so + result", "because + reason", "past tense"]],
  ["Describe your morning routine and what happens if something goes wrong.",
    "so for results", ["so + result", "time words", "present tense"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.conjunctions.so-result.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
