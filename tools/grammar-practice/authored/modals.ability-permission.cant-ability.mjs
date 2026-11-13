// Hand-authored: modals / ability-permission / cant-ability (A1).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "can't for lack of ability; no 'doesn't'" (He ______ drive.
// He is only 12: can / can't / doesn't can / isn't). Saying what you can't do.
// Choose: 12 items pick the negative itself (can't vs the do-support transfer
// "doesn't can / don't can", the copula "isn't can / am not can", and "not can",
// Uzbek/Russian word order "ne mogu" read word by word). 8 items pick the verb
// after can't (base / to / -s / -ing). "couldn't", "won't" and "mustn't" are
// never offered. Context in each sentence makes the inability clear.
// Typed keys: can't + verb. Ingest adds "cannot"; "can not" is added here too
// (it is accepted spelling, though cannot is usual).
//
// Run: node tools/grammar-practice/authored/modals.ability-permission.cant-ability.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "ability-permission", topic: "cant-ability", level: "A1", pv: "2.5" };

const N = {
  i: ["can't", "don't can", "am not can", "not can"],
  you: ["can't", "don't can", "aren't can", "not can"],
  sg: ["can't", "doesn't can", "isn't can", "not can"],
  pl: ["can't", "don't can", "aren't can", "not can"],
};
const NEG = (s, v) => `To say ${s} not able to, use can't + base verb: can't ${v}. Can never takes do/does: "doesn't can" and "don't can" are wrong.`;
const V = (v, s, ing) => [v, `to ${v}`, s, ing];
const VW = (v) => `After can't, use the base verb: can't ${v}. No to, no -s, no -ing.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [N.sg, NEG("he is", "drive"), "My cousin ______ drive. He is only {age}.",
    { age: ["twelve", "ten", "fourteen", "eleven"] }],
  [N.i, NEG("you are", "swim"), "I ______ swim, so I stay near the {place} on {trip}.",
    { place: ["shore", "edge", "steps", "side"], trip: ["holiday", "school trips", "picnics", "Sundays"] }],
  [N.sg, NEG("she is", "read"), "My grandmother ______ read {thing} without her glasses.",
    { thing: ["small letters", "text messages", "the menu", "labels"] }],
  [N.pl, NEG("we are", "hear"), "We ______ hear you, {name}. The {noise} is too loud.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], noise: ["music", "traffic", "wind", "TV"] }],
  [N.pl, NEG("they are", "tie"), "My little brothers ______ tie their {thing} yet.",
    { thing: ["shoes", "laces", "trainers", "boots"] }],
  [N.sg, NEG("he is", "sing"), "Bobur ______ sing {how}, but he {other}.",
    { how: ["at all", "very well", "in public", "high notes"], other: ["plays the guitar", "dances well", "loves music", "writes songs"] }],
  [N.sg, NEG("it is", "climb"), "Our old dog ______ climb {thing} any more.",
    { thing: ["stairs", "trees", "the fence", "ladders"] }],
  [N.i, NEG("you are", "help"), "Sorry, {name}, I ______ help you with {subject}. I'm bad at it too.",
    { name: ["Madina", "Sardor", "Kamila", "Jasur"], subject: ["maths", "physics", "chemistry", "this exercise"] }],
  [N.pl, NEG("they are", "speak"), "My parents ______ speak {lang}, so I {act} for them.",
    { lang: ["English", "Korean", "Turkish", "German"], act: ["translate", "read letters", "fill in forms", "make calls"] }],
  [N.sg, NEG("she is", "ride"), "Lola ______ ride a bike {how}. She's only {age}.",
    { how: ["yet", "very well", "without help", "with no hands"], age: ["four", "five", "three", "six"] }],
  [N.you, NEG("you are", "run"), "You ______ run in those {shoes}, {name}!",
    { shoes: ["shoes", "boots", "sandals", "slippers"], name: ["Anvar", "Malika", "Rustam", "Nodira"] }],
  [N.sg, NEG("she is", "walk"), "{name}'s baby ______ walk yet, but she {other}.",
    { name: ["Aziza", "Lola", "Olga", "Nodira"], other: ["crawls everywhere", "stands up", "says 'mama'", "claps her hands"] }],
  [V("lift", "lifts", "lifting"), VW("lift"), "My brother can't ______ the {thing}. It's too {adj}.",
    { thing: ["box", "bag", "table", "suitcase"], adj: ["heavy", "big", "large"] }],
  [V("find", "finds", "finding"), VW("find"), "I can't ______ my {thing}. Have you seen it, {name}?",
    { thing: ["phone", "wallet", "passport", "umbrella"], name: ["Mum", "Dad", "Bekzod", "Sevara"] }],
  [V("speak", "speaks", "speaking"), VW("speak"), "Aziz can't ______ {lang} {how}.",
    { lang: ["Korean", "German", "Chinese", "French"], how: ["at all", "very well", "yet", "well"] }],
  [V("see", "sees", "seeing"), VW("see"), "We can't ______ the {thing} from here. Let's move {where}.",
    { thing: ["stage", "screen", "board", "river"], where: ["closer", "to the front", "forward", "nearer"] }],
  [V("hear", "hears", "hearing"), VW("hear"), "Grandpa can't ______ {who} well {where}.",
    { who: ["us", "me", "you", "people"], where: ["on the phone", "from the kitchen", "in the car", "outside"] }],
  [V("write", "writes", "writing"), VW("write"), "Our son can't ______ his name in {script} yet, {name}.",
    { script: ["English", "Russian", "capital letters", "Latin letters"], name: ["Ms Karimova", "Doctor", "Grandma", "Aunt Lola"] }],
  [V("eat", "eats", "eating"), VW("eat"), "I can't ______ {food}, {name}. I'm allergic.",
    { food: ["nuts", "eggs", "fish", "peanuts"], name: ["Olga", "Timur", "Mum", "Aziza"] }],
  [V("play", "plays", "playing"), VW("play"), "She can't ______ the {instrument}, but she {other}.",
    { instrument: ["piano", "violin", "drums", "flute"], other: ["sings beautifully", "plays the guitar", "dances well", "writes songs"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Use can't + the verb in brackets.";
const B = (v) => `Not able → can't + base verb: can't ${v} (or cannot ${v}). Never doesn't can or don't can.`;
const BUILD = [
  ["see", "My grandmother ______ (see) well without her {thing} {when}.",
    { thing: ["glasses", "reading glasses", "contact lenses"], when: ["at night", "in the evening", "any more", "these days"] }],
  ["open", "I ______ (open) this {thing}. Please help me, {name}.",
    { thing: ["jar", "bottle", "door", "window"], name: ["Dad", "Aziz", "Olga", "Rustam"] }],
  ["talk", "Our baby ______ (talk) yet. She's only {age} months old.",
    { age: ["six", "eight", "ten", "nine"] }],
  ["come", "Jasur ______ (come) to the {event} because he's {why}.",
    { event: ["party", "match", "meeting", "lesson"], why: ["ill", "busy", "at work", "away"] }],
  ["hear", "We ______ (hear) you {where}, {name}. Please speak louder!",
    { where: ["at the back", "in the corner", "from here", "over the music"], name: ["Mr Aliev", "Kamila", "Bobur", "Ms Petrova"] }],
  ["reach", "My little sister ______ (reach) the top {thing}. She's too short.",
    { thing: ["shelf", "cupboard", "button", "drawer"] }],
  ["find", "They ______ (find) their {thing} {where}.",
    { thing: ["keys", "tickets", "passports", "car keys"], where: ["anywhere", "at home", "in the car", "in their bags"] }],
  ["take", "This old phone ______ (take) {thing}.",
    { thing: ["good photos", "videos", "selfies", "clear pictures"] }],
  ["eat", "Sevara ______ (eat) {food}. She's allergic to it.",
    { food: ["fish", "honey", "chocolate", "cheese"] }],
  ["lend", "Sorry, I ______ (lend) you my {thing} {when}. I need it.",
    { thing: ["laptop", "bike", "camera", "phone"], when: ["today", "now", "this week", "tonight"] }],
  ["lift", "Anvar ______ (lift) that {thing}. It's too heavy for {who}.",
    { thing: ["box", "bag", "suitcase", "table"], who: ["him", "one person", "a child", "a boy"] }],
  ["sleep", "Most people ______ (sleep) well when it's {weather} in the {room}.",
    { weather: ["very hot", "too cold", "too noisy", "too bright"], room: ["bedroom", "flat", "house", "room"] }],
  ["cook", "My dad ______ (cook) {food}, so my mum {other}.",
    { food: ["at all", "very well", "plov", "rice"], other: ["makes dinner", "cooks every day", "does the cooking", "makes breakfast"] }],
  ["understand", "The students ______ (understand) the {thing}. It's too {adj}.",
    { thing: ["text", "question", "rule", "video"], adj: ["difficult", "fast", "long", "hard"] }],
  ["remember", "Sorry, {name}, I ______ (remember) her {thing}. What is it again?",
    { name: ["Lola", "Timur", "Malika", "Sardor"], thing: ["name", "phone number", "address", "surname"] }],
  ["play", "Kamila ______ (play) {sport} today. She hurt her {part}.",
    { sport: ["tennis", "volleyball", "football", "basketball"], part: ["arm", "leg", "knee", "hand"] }],
  ["open", "My computer ______ (open) this {file}. It's too {adj}.",
    { file: ["file", "video", "document", "game"], adj: ["old", "slow"] }],
  ["go", "We ______ (go) {where} today because of the {weather}.",
    { where: ["outside", "to the park", "to the beach", "to the lake"], weather: ["rain", "snow", "storm", "wind"] }],
  ["walk", "Grandpa ______ (walk) {dist} because of his {part}.",
    { dist: ["far", "very far", "long distances", "without a stick"], part: ["knees", "back", "leg", "bad foot"] }],
  ["wake", "My brother ______ (wake) up early {when}, so he's often late for {event}.",
    { when: ["on Mondays", "in winter", "after a late night", "without an alarm"], event: ["school", "class", "work", "training"] }],
].map(([v, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `can't ${v}`, acceptable: [`can not ${v}`], why: B(v), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const MAKE_NEG = "Rewrite the sentence in the negative.";
const ABLE = "Rewrite the sentence with can't.";
const KNOW = "Say the same thing with can't.";
const TRANSFORM = [
  // positive -> negative (5)
  [MAKE_NEG, "Aziz can swim {how} in the {water}.", "Aziz ______ (swim) {how} in the {water}.", "swim",
    "Add n't to can: can't swim. Don't use doesn't.",
    { how: ["well", "far", "fast", "very well"], water: ["sea", "river", "lake", "pool"] }],
  [MAKE_NEG, "My sister can drive {vehicle} {where}.", "My sister ______ (drive) {vehicle} {where}.", "drive",
    "The negative of can is can't (cannot): can't drive. Not doesn't can.",
    { vehicle: ["a car", "a truck", "a bus", "a van"], where: ["in the city", "at night", "in the snow", "on long trips"] }],
  [MAKE_NEG, "We can see the {thing} from {place}.", "We ______ (see) the {thing} from {place}.", "see",
    "The negative is can't + base verb: can't see. Not don't can.",
    { thing: ["stage", "board", "screen", "mountains"], place: ["here", "our seats", "the back", "the window"] }],
  [MAKE_NEG, "I can understand {thing} {how}.", "I ______ (understand) {thing} {how}.", "understand",
    "With I, the negative is still can't: can't understand.",
    { thing: ["this text", "the teacher", "the film", "the song"], how: ["well", "easily", "without help", "very well"] }],
  [MAKE_NEG, "The children can play {where} {when}.", "The children ______ (play) {where} {when}.", "play",
    "The negative is can't + base verb: can't play.",
    { where: ["outside", "in the yard", "in the park", "in the garden"], when: ["today", "now", "this afternoon", "after lunch"] }],
  // isn't able to -> can't (5)
  [ABLE, "Lola isn't able to come {when} because she's {why}.", "Lola ______ (come) {when} because she's {why}.", "come",
    "Isn't able to = can't: can't come.",
    { when: ["tonight", "on Friday", "tomorrow", "this weekend"], why: ["ill", "busy", "at work", "away"] }],
  [ABLE, "I'm not able to answer {thing} {when}.", "I ______ (answer) {thing} {when}.", "answer",
    "Am not able to = can't: can't answer. Not am not can.",
    { thing: ["this question", "your email", "the phone", "all the questions"], when: ["now", "today", "right now", "tonight"] }],
  [ABLE, "My parents aren't able to visit us {when}. They're {why}.", "My parents ______ (visit) us {when}. They're {why}.", "visit",
    "Aren't able to = can't: can't visit.",
    { when: ["this year", "next week", "in winter", "this month"], why: ["busy", "ill", "away", "working"] }],
  [ABLE, "Our old car isn't able to go {how} any more.", "Our old car ______ (go) {how} any more.", "go",
    "Isn't able to = can't: can't go.",
    { how: ["fast", "very fast", "up hills", "far"] }],
  [ABLE, "The doctor isn't able to see you {when}, {name}.", "The doctor ______ (see) you {when}, {name}.", "see",
    "Isn't able to = can't: can't see.",
    { when: ["today", "now", "this morning", "before Friday"], name: ["Mr Aliev", "Olga", "Mrs Rakhimova", "Jasur"] }],
  // doesn't know how to -> can't (5)
  [KNOW, "{who} doesn't know how to use {thing}.", "{who} ______ (use) {thing}.", "use",
    "Doesn't know how to = can't: can't use. No doesn't with can.",
    { who: ["My grandfather", "My grandmother", "Our neighbour", "My uncle"], thing: ["a smartphone", "a computer", "the internet", "email"] }],
  [KNOW, "I don't know how to cook {food} for {num} people.", "I ______ (cook) {food} for {num} people.", "cook",
    "Don't know how to = can't: can't cook. Not don't can.",
    { food: ["plov", "manti", "soup", "lagman"], num: ["ten", "twenty", "fifty", "a hundred"] }],
  [KNOW, "{who} doesn't know how to play {game}.", "{who} ______ (play) {game}.", "play",
    "Doesn't know how to = can't: can't play.",
    { who: ["Bekzod", "My brother", "Our new classmate", "Anvar"], game: ["chess", "the guitar", "the piano", "cards"] }],
  [KNOW, "My friends don't know how to dance {dance}.", "My friends ______ (dance) {dance}.", "dance",
    "Don't know how to = can't: can't dance.",
    { dance: ["lazgi", "the waltz", "salsa", "hip-hop"] }],
  [KNOW, "My little sister doesn't know how to ride a {vehicle} yet.", "My little sister ______ (ride) a {vehicle} yet.", "ride",
    "Doesn't know how to = can't: can't ride.",
    { vehicle: ["bike", "scooter", "horse", "skateboard"] }],
].map(([instr, source, hint, v, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `can't ${v}`, acceptable: [`can not ${v}`], why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a sport you can't play.", "I can't + base verb", ["exactly one sentence", "must use I can't", "must name a sport"]],
  ["Write one sentence about something a small child can't do yet.", "can't + base verb + yet", ["exactly one sentence", "must use can't", "must use yet"]],
  ["Write one sentence about a language you can't speak but want to learn.", "can't speak", ["exactly one sentence", "must name a language", "must use can't speak"]],
  ["Write one sentence about something an animal can't do.", "can't + base verb", ["exactly one sentence", "must name an animal", "no doesn't with can"]],
  ["Write one sentence saying you can't come to something and why.", "I can't come … because …", ["exactly one sentence", "must use can't come", "must give a reason with because"]],
  ["Write one sentence about something your phone or computer can't do.", "it can't + base verb", ["exactly one sentence", "must use can't", "base verb after can't"]],
  ["Write one sentence with can and can't about the same person.", "can … but can't …", ["exactly one sentence", "must use can and can't", "must use but"]],
  ["Write two sentences about two things you can't do well.", "I can't + base verb", ["exactly two sentences", "two different verbs", "no to after can't"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about three things you can't do but would like to learn. Write three or four sentences.",
    "can't + base verb", ["I can't + base verb", "three different verbs", "no don't can"]],
  ["A friend invites you to play football, but you can't. Write a short reply and explain why.",
    "can't for inability", ["I can't + base verb", "a reason with because", "a polite word like sorry"]],
  ["Describe a family member: what can they do, and what can't they do? Write three or four sentences.",
    "can / can't + base verb", ["he / she can …", "he / she can't …", "no doesn't can"]],
  ["Compare a baby and a ten-year-old child. What can't a baby do yet? Write three or four sentences.",
    "can't … yet", ["can't + base verb", "yet", "can for the older child"]],
  ["Write about an old phone or computer you have. What can't it do? Write three or four sentences.",
    "it can't + base verb", ["it can't", "different verbs", "base verb after can't"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.ability-permission.cant-ability.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
