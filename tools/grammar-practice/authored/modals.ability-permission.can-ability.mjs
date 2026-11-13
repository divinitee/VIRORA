// Hand-authored: modals / ability-permission / can-ability (A1).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "can + base verb for ability" (I ______ swim: can / am / do /
// have). Scope kept apart from the siblings: this topic is POSITIVE statements
// about ability. Questions are can-question, can't is cant-ability, requests are
// can-request, and the no -s / no to form rule is can-form (not in this batch;
// 8 choose items here touch it with base / -s / to / -ing options, which is the
// placement's "can + base verb").
// Choose: 12 meaning items pick can against the real transfer errors: be
// (I am swim — zero-copula / "men suza olaman" read word by word), know (Russian
// "umeyu" → "I know swim") and have. do / does / could / will are NEVER offered:
// "I do swim", "I could swim" are grammatical. 8 form items pick the base verb.
// Build/transform keys are "can + verb"; no gap text prints "can" (echo check).
//
// Run: node tools/grammar-practice/authored/modals.ability-permission.can-ability.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "ability-permission", topic: "can-ability", level: "A1", pv: "2.5" };

const M = { i: ["can", "am", "know", "have"], sg: ["can", "is", "knows", "has"], pl: ["can", "are", "know", "have"] };
const MEAN = (v) => `To say someone is able to do something, use can + verb: can ${v}. Don't use am / is / are, know or have here.`;
const F = (v, s, ing) => [v, s, `to ${v}`, ing];
const FORM = (v) => `After can, use the base verb with no to, no -s and no -ing: can ${v}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  // meaning: can vs be / know / have (12)
  [M.i, MEAN("ride"), "I ______ ride a {vehicle} {how}.",
    { vehicle: ["bike", "horse", "scooter", "motorbike"], how: ["very well", "fast", "with one hand", "quite well"] }],
  [M.sg, MEAN("count"), "My little brother ______ count to {num} in {lang}.",
    { num: ["ten", "twenty", "fifty", "a hundred"], lang: ["English", "Russian", "Korean", "German"] }],
  [M.pl, MEAN("cook"), "We ______ cook {food} {how}.",
    { food: ["plov", "soup", "manti", "eggs"], how: ["very well", "together", "without help", "quickly"] }],
  [M.sg, MEAN("play"), "Malika ______ play the {instrument} {how}.",
    { instrument: ["piano", "guitar", "violin", "dutar"], how: ["very well", "a little", "beautifully", "quite well"] }],
  [M.pl, MEAN("speak"), "They ______ speak {lang} {how}.",
    { lang: ["English", "Russian", "Turkish", "Korean"], how: ["very well", "a little", "quite well", "well"] }],
  [M.sg, MEAN("make"), "My grandmother ______ make {thing} {how}.",
    { thing: ["carpets", "dresses", "bread", "dolls"], how: ["by hand", "very fast", "very well", "without a machine"] }],
  [M.i, MEAN("run"), "I ______ run {dist} without stopping.",
    { dist: ["five kilometres", "ten kilometres", "two kilometres", "three kilometres"] }],
  [M.sg, MEAN("open"), "Our cat ______ open the {thing} with its {part}.",
    { thing: ["door", "cupboard", "fridge", "window"], part: ["paws", "head", "nose", "teeth"] }],
  [M.sg, MEAN("fix"), "Sardor ______ fix {thing} in {time}.",
    { thing: ["bikes", "cars", "phones", "computers"], time: ["an hour", "ten minutes", "a day", "five minutes"] }],
  [["can", "are", "know", "have"], MEAN("sing"), "You ______ sing {how}! You should join the {group}.",
    { how: ["really well", "beautifully", "so well", "very well"], group: ["choir", "school band", "music club", "school choir"] }],
  [M.pl, MEAN("dance"), "My friends ______ dance {dance} {how}.",
    { dance: ["lazgi", "the waltz", "hip-hop", "salsa"], how: ["really well", "very well", "beautifully", "a little"] }],
  [M.sg, MEAN("walk"), "Look, {name}! The baby ______ walk {how}.",
    { name: ["Mum", "Dad", "Grandma", "Aziza"], how: ["now", "on her own", "a little", "without help"] }],
  // form: base verb after can (8)
  [F("speak", "speaks", "speaking"), FORM("speak"), "My uncle can ______ three languages: Uzbek, Russian and {lang}.",
    { lang: ["English", "Turkish", "Arabic", "German"] }],
  [F("build", "builds", "building"), FORM("build"), "Aziz can ______ a {thing} in one {time}.",
    { thing: ["chair", "table", "kite", "birdhouse"], time: ["afternoon", "day", "morning", "week"] }],
  [F("see", "sees", "seeing"), FORM("see"), "We can ______ the {place} from our {room} window.",
    { place: ["mountains", "river", "park", "stadium"], room: ["kitchen", "bedroom", "classroom", "office"] }],
  [F("type", "types", "typing"), FORM("type"), "Dilnoza can ______ {things} {how} on her phone.",
    { things: ["messages", "emails", "notes", "answers"], how: ["very fast", "with one hand", "without looking", "in English"] }],
  [F("catch", "catches", "catching"), FORM("catch"), "My dog can ______ a {thing} {how}.",
    { thing: ["ball", "stick", "toy", "biscuit"], how: ["in the air", "every time", "from far away", "very fast"] }],
  [F("learn", "learns", "learning"), FORM("learn"), "Children can ______ a lot from {source}.",
    { source: ["games", "cartoons", "books", "their parents"] }],
  [F("read", "reads", "reading"), FORM("read"), "Grandpa can ______ {thing} without glasses.",
    { thing: ["small letters", "the newspaper", "the menu", "books"] }],
  [F("play", "plays", "playing"), FORM("play"), "They can ______ {sport} {where}.",
    { sport: ["football", "volleyball", "tennis", "basketball"], where: ["on the beach", "in the yard", "at school", "in the gym"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Use can + the verb in brackets to talk about ability.";
const B = (v) => `Ability → can + base verb: can ${v}. The verb has no -s and no to.`;
const BUILD = [
  ["read", "My brother is only {age}, but he ______ (read) {thing}.",
    { age: ["five", "six", "four", "seven"], thing: ["long words", "English books", "the newspaper", "street signs"] }],
  ["draw", "Lola ______ (draw) {things} {how}.",
    { things: ["horses", "faces", "cars", "flowers"], how: ["very well", "beautifully", "from memory", "in five minutes"] }],
  ["cook", "I ______ (cook) {food} {how}.",
    { food: ["plov", "lagman", "soup", "manti"], how: ["without help", "very well", "in one hour", "without a recipe"] }],
  ["speak", "Our new {person} ______ (speak) {num} languages.",
    { person: ["teacher", "neighbour", "doctor", "classmate"], num: ["three", "four", "five", "six"] }],
  ["swim", "Penguins ______ (swim) very fast in {water}.",
    { water: ["cold water", "the sea", "the ocean", "icy water"] }],
  ["fix", "My dad ______ (fix) {thing} {how}.",
    { thing: ["our car", "the TV", "the washing machine", "old bikes"], how: ["himself", "without help", "in one hour", "very fast"] }],
  ["see", "We ______ (see) the {place} from our {room}.",
    { place: ["mountains", "river", "stadium", "old city"], room: ["balcony", "kitchen", "bedroom", "roof"] }],
  ["run", "Bobur ______ (run) faster than {who} in our {group}.",
    { who: ["anyone", "everyone", "all the boys", "all the girls"], group: ["class", "school", "team", "street"] }],
  ["type", "Aziza ______ (type) {how} on her {device}.",
    { how: ["very fast", "with two fingers", "without looking", "with one hand"], device: ["laptop", "phone", "computer", "tablet"] }],
  ["fly", "These birds ______ (fly) {dist} {when}.",
    { dist: ["very far", "hundreds of kilometres", "across the sea", "over mountains"], when: ["in autumn", "every spring", "every year", "in winter"] }],
  ["count", "My little sister ______ (count) to {num} in {lang}.",
    { num: ["ten", "twenty", "fifty", "a hundred"], lang: ["English", "Russian", "Korean", "German"] }],
  ["play", "Rustam ______ (play) the {instrument} {how}.",
    { instrument: ["drums", "guitar", "piano", "dutar"], how: ["very well", "a little", "beautifully", "by ear"] }],
  ["ride", "You ______ (ride) a {vehicle} now! Well done, {name}!",
    { vehicle: ["bike", "horse", "scooter", "skateboard"], name: ["Timur", "Lola", "Anvar", "Malika"] }],
  ["remember", "My grandmother ______ (remember) {thing} from her {time}.",
    { thing: ["every song", "all the names", "every story", "many poems"], time: ["childhood", "school days", "village", "youth"] }],
  ["answer", "Our robot ______ (answer) {thing} in {lang}.",
    { thing: ["simple questions", "questions", "easy questions", "short questions"], lang: ["Uzbek", "English", "Russian", "three languages"] }],
  ["make", "Students in our club ______ (make) {thing} {how}.",
    { thing: ["websites", "simple games", "short films", "robots"], how: ["on their own", "in a week", "together", "with a laptop"] }],
  ["write", "Kamila ______ (write) with {hand} {how}.",
    { hand: ["her left hand", "both hands", "her right hand", "either hand"], how: ["very neatly", "quite fast", "very fast", "neatly"] }],
  ["hear", "I ______ (hear) the {sound} from my {room}.",
    { sound: ["music", "birds", "trains", "children"], room: ["bedroom", "window", "desk", "balcony"] }],
  ["take", "This phone ______ (take) {thing} at night.",
    { thing: ["great photos", "clear photos", "good videos", "nice pictures"] }],
  ["carry", "Elephants ______ (carry) {thing} with their trunks.",
    { thing: ["heavy logs", "water", "food", "small trees"] }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `can ${v}`, why: B(v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ABLE = "Rewrite the sentence with can.";
const KNOW = "Say the same thing with can.";
const GOOD = "Rewrite with can + verb + very well.";
const TRANSFORM = [
  // be able to -> can (5)
  [ABLE, "My sister is able to speak {lang} {how}.", "My sister ______ (speak) {lang} {how}.", "speak",
    "Is able to means can. Use can + base verb: can speak.",
    { lang: ["English", "Korean", "German", "Turkish"], how: ["very well", "quite well", "a little", "well"] }],
  [ABLE, "We are able to see {thing} from {place}.", "We ______ (see) {thing} from {place}.", "see",
    "Are able to means can: can see. Can is the same for all people.",
    { thing: ["the mountains", "the river", "the whole city", "the airport"], place: ["here", "our roof", "the hill", "the tenth floor"] }],
  [ABLE, "Tigers are able to swim {how} in {water}.", "Tigers ______ (swim) {how} in {water}.", "swim",
    "Are able to means can: can swim.",
    { how: ["very well", "fast", "for hours", "a long way"], water: ["rivers", "lakes", "cold water", "deep water"] }],
  [ABLE, "I'm able to finish the {task} in {time}.", "I ______ (finish) the {task} in {time}.", "finish",
    "Am able to means can: can finish. No am before can.",
    { task: ["puzzle", "test", "crossword", "exercise"], time: ["ten minutes", "five minutes", "an hour", "half an hour"] }],
  [ABLE, "Our son is able to tie his {thing} now.", "Our son ______ (tie) his {thing} now.", "tie",
    "Is able to means can: can tie. No is before can.",
    { thing: ["shoes", "laces", "own shoes", "trainers"] }],
  // know how to -> can (5)
  [KNOW, "{who} knows how to drive a {vehicle}.", "{who} ______ (drive) a {vehicle}.", "drive",
    "Knows how to means can: can drive. Can has no -s.",
    { who: ["Timur", "My uncle", "Our neighbour", "Aziza's father"], vehicle: ["car", "bus", "truck", "tractor"] }],
  [KNOW, "I know how to make {food} for {num} people.", "I ______ (make) {food} for {num} people.", "make",
    "Know how to means can: can make.",
    { food: ["plov", "soup", "salad", "samsa"], num: ["ten", "twenty", "fifty", "a hundred"] }],
  [KNOW, "{who} know how to use {thing}.", "{who} ______ (use) {thing}.", "use",
    "Know how to means can: can use.",
    { who: ["My parents", "My grandparents", "Our teachers", "Most students"], thing: ["a smartphone", "a computer", "online banking", "video calls"] }],
  [KNOW, "Lola knows how to play {game}. She learned it from her {who}.", "Lola ______ (play) {game}. She learned it from her {who}.", "play",
    "Knows how to means can: can play. Can never takes -s.",
    { game: ["chess", "the piano", "the guitar", "tennis"], who: ["father", "grandfather", "uncle", "teacher"] }],
  [KNOW, "My brother knows how to fix {thing}. He learned at {place}.", "My brother ______ (fix) {thing}. He learned at {place}.", "fix",
    "Knows how to means can: can fix.",
    { thing: ["cars", "phones", "computers", "bikes"], place: ["college", "work", "a course", "school"] }],
  // be good at -ing -> can + verb + very well (5)
  [GOOD, "Malika is good at singing {songs}.", "Malika ______ (sing) {songs} very well.", "sing",
    "Is good at singing means she can sing well. After can, use the base verb: sing, not singing.",
    { songs: ["Uzbek songs", "English songs", "old songs", "pop songs"] }],
  [GOOD, "Jasur is good at drawing {things} with {tool}.", "Jasur ______ (draw) {things} with {tool} very well.", "draw",
    "Good at drawing becomes can draw. After can, no -ing.",
    { things: ["animals", "faces", "trees", "houses"], tool: ["a pencil", "chalk", "paint", "coloured pens"] }],
  [GOOD, "My aunt is good at sewing {things} for {who}.", "My aunt ______ (sew) {things} for {who} very well.", "sew",
    "Good at sewing becomes can sew. After can, use the base verb.",
    { things: ["dresses", "shirts", "curtains", "bags"], who: ["her family", "her neighbours", "her daughters", "her friends"] }],
  [GOOD, "We are good at cooking {food} for {event}.", "We ______ (cook) {food} for {event} very well.", "cook",
    "Are good at cooking becomes can cook. Can is the same for all people.",
    { food: ["plov", "shashlik", "salads", "cakes"], event: ["parties", "weddings", "big families", "guests"] }],
  [GOOD, "Our goalkeeper is good at stopping {shots} in {event}.", "Our goalkeeper ______ (stop) {shots} in {event} very well.", "stop",
    "Good at stopping becomes can stop. After can, no -ing.",
    { shots: ["penalties", "long shots", "hard shots", "free kicks"], event: ["matches", "training", "big games", "every game"] }],
].map(([instr, source, hint, v, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `can ${v}`, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a sport you can play.", "I can + base verb", ["exactly one sentence", "must use I can", "must name a sport"]],
  ["Write one sentence about a language you can speak and how well.", "can speak", ["exactly one sentence", "must name a language", "must say how well (a little, very well…)"]],
  ["Write one sentence about something a family member can do very well.", "he / she can + base verb", ["exactly one sentence", "must name a family member", "no -s on can or on the verb"]],
  ["Write one sentence about something an animal can do.", "can + base verb", ["exactly one sentence", "must name an animal", "must use can"]],
  ["Write one sentence about something you can cook.", "I can cook", ["exactly one sentence", "must name a dish", "must use can + cook"]],
  ["Write one sentence about something your phone or computer can do.", "it can + base verb", ["exactly one sentence", "must use it can or my phone can", "no to after can"]],
  ["Write one sentence about something your best friend can do and you can do too.", "can + base verb for two people", ["exactly one sentence", "must name your friend", "must use can twice or both … can"]],
  ["Write two sentences about two different things you can do with your hands.", "I can + base verb", ["exactly two sentences", "two different verbs", "no -ing after can"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You want to join a summer camp. Write about the things you can do (sports, music, languages, cooking). Write three or four sentences.",
    "can + base verb for abilities", ["I can + base verb", "three or more different verbs", "words like very well or a little"]],
  ["Describe a talented person you know. What can they do? Write three or four sentences.",
    "he / she can + base verb", ["he can / she can", "no -s on the verb after can", "a detail like very well or fast"]],
  ["Write a short profile for a job website: say what you can do and what languages you can speak.",
    "can for skills", ["I can + base verb", "can speak + language", "no to after can"]],
  ["Describe your favourite animal. What can it do? Write three or four sentences.",
    "it can / they can + base verb", ["it can or they can", "different action verbs", "no -ing after can"]],
  ["Write about the members of your family and one special thing each person can do.",
    "can + base verb with different subjects", ["my mother can, my brother can…", "the same form of can for everyone", "base verb after can"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.ability-permission.can-ability.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
