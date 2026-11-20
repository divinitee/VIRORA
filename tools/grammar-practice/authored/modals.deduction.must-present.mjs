// Hand-authored: modals / deduction / must-present (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): must + base verb when the speaker is SURE
// about the present (strong evidence → He must be at home).
// Triage: kept. Siblings: might-present (not sure) and cant-present (sure it is
// NOT true). Here every line gives strong evidence FOR the idea, so "might" is
// left out of the options (it would not be wrong, only weaker).
// Choose: must / can't / mustn't / must to.
// Build: typed must + the verb in brackets; no source prints "must".
// Transform: 5 I'm sure … → must / 5 correct the mistake / 5 I'm sure … is -ing →
// must be -ing.
//
// Run: node tools/grammar-practice/authored/modals.deduction.must-present.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "deduction", topic: "must-present", level: "B1", pv: "2.5" };
const NAME = ["Gulnora", "Jamshid", "Malika", "Ulugbek"]; // listener names: never printed in a sentence (audit 20 Nov)
const WHY = "The speaker is sure, from the evidence: must + base verb.";
const OPTS = ["must", "can't", "mustn't", "must to"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["The lights are on and his {car} is outside. He ______ be at home, {name}.", { car: ["car", "bike", "scooter", "van"], name: NAME }],
  ["She has worked for {n} hours today. She ______ be tired, {name}.", { n: ["twelve", "ten", "eleven", "fourteen"], name: NAME }],
  ["You've had no food since {time}. You ______ be hungry, {name}.", { time: ["breakfast", "last night", "seven o'clock", "yesterday"], name: NAME }],
  ["Everyone is wearing coats and {item}. It ______ be cold outside, {name}.", { item: ["hats", "scarves", "gloves", "boots"], name: NAME }],
  ["He speaks {lang} with his grandmother every day. He ______ know the language well, {name}.", { lang: ["Uzbek", "Russian", "Kazakh", "Tajik"], name: NAME }],
  ["They have three cars and a big house in {city}. They ______ be rich, {name}.", { city: ["Tashkent", "Samarkand", "Moscow", "Dubai"], name: NAME }],
  ["The {shop} is closed and all the lights are off. It ______ be a holiday today, {name}.", { shop: ["bank", "post office", "bazaar", "library"], name: NAME }],
  ["Madina is at the {place} every day. She ______ love sport, {name}.", { place: ["gym", "stadium", "pool", "sports club"], name: NAME }],
  ["There's always a long queue outside that {place}. The food ______ be good, {name}.", { place: ["café", "restaurant", "bakery", "canteen"], name: NAME }],
  ["Timur is smiling at his phone. He ______ be talking to his {who}, {name}.", { who: ["girlfriend", "best friend", "brother", "grandmother"], name: NAME }],
  ["You've just walked {dist}. Your legs ______ hurt, {name}.", { dist: ["twenty kilometres", "all day", "for six hours", "up the mountain"], name: NAME }],
  ["The baby is crying and it's {time}. She ______ be hungry, {name}.", { time: ["lunchtime", "six o'clock", "feeding time", "past noon"], name: NAME }],
  ["He lived in {country} for ten years. He ______ speak the language, {name}.", { country: ["Japan", "Turkey", "Germany", "Korea"], name: NAME }],
  ["Your phone is ringing. It ______ be your {who}, {name}. She always calls at this time.", { who: ["mother", "sister", "boss", "aunt"], name: NAME }],
  ["This {thing} is from Italy and it's two hundred years old. It ______ be expensive, {name}.", { thing: ["watch", "painting", "violin", "table"], name: NAME }],
  ["The streets are wet and people have {item}. It ______ be raining, {name}.", { item: ["umbrellas", "raincoats", "wet coats", "wet shoes"], name: NAME }],
  ["The {team} fans are singing and dancing. Their team ______ be winning, {name}.", { team: ["Pakhtakor", "Nasaf", "Bunyodkor", "Navbahor"], name: NAME }],
  ["My neighbour plays the {instr} every evening. He ______ love music, {name}.", { instr: ["piano", "guitar", "violin", "drums"], name: NAME }],
  ["There are flowers in every room of her {home}. She ______ love flowers, {name}.", { home: ["flat", "house", "office", "shop"], name: NAME }],
  ["You've been at your desk since {time}. You ______ need a break, {name}.", { time: ["eight o'clock", "early morning", "breakfast", "nine"], name: NAME }],
].map(([prompt, slots], i) => {
  const options = OPTS.map((_, j) => OPTS[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf("must"), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "The speaker is sure. Complete with must and the verb in brackets.";
const BUILD = [
  ["be", "Aziz's car is outside the {place}. He ______ (be) inside, {name}.", { place: ["café", "bank", "gym", "library"], name: NAME }],
  ["be", "You've worked since {time}. You ______ (be) tired, {name}.", { time: ["six", "seven o'clock", "early morning", "breakfast"], name: NAME }],
  ["study", "She speaks perfect {lang}. She ______ (study) a lot, {name}.", { lang: ["English", "Korean", "German", "French"], name: NAME }],
  ["be", "They eat at that {place} every day. The food there ______ (be) good, {name}.", { place: ["café", "canteen", "restaurant", "chaikhana"], name: NAME }],
  ["love", "He reads {n} books a month. He ______ (love) reading, {name}.", { n: ["five", "six", "ten", "eight"], name: NAME }],
  ["be", "Everybody in the {room} is laughing. The film ______ (be) funny, {name}.", { room: ["cinema", "living room", "classroom", "hall"], name: NAME }],
  ["live", "Lola walks through the old town of {city} every morning. She ______ (live) near there, {name}.", { city: ["Bukhara", "Khiva", "Samarkand", "Tashkent"], name: NAME }],
  ["be", "The {shop} is full of people. The prices ______ (be) low today, {name}.", { shop: ["bazaar", "supermarket", "mall", "shoe shop"], name: NAME }],
  ["need", "Timur is yawning again at the {place}. He ______ (need) some sleep, {name}.", { place: ["meeting", "lesson", "table", "desk"], name: NAME }],
  ["be", "There is snow on all the {thing}. It ______ (be) very cold outside, {name}.", { thing: ["cars", "roofs", "trees", "roads"], name: NAME }],
  ["be", "Your sister trains at the {place} every morning. She ______ (be) very fit, {name}.", { place: ["gym", "pool", "stadium", "sports club"], name: NAME }],
  ["like", "He has three phones and two {thing}. He ______ (like) technology, {name}.", { thing: ["laptops", "tablets", "cameras", "smart watches"], name: NAME }],
  ["be", "The {who} is shouting at everyone. He ______ (be) angry, {name}.", { who: ["boss", "coach", "driver", "manager"], name: NAME }],
  ["be", "You've just come back from {place}. You ______ (be) glad that you are home, {name}.", { place: ["a long trip", "Moscow", "the mountains", "a month in Korea"], name: NAME }],
  ["be", "Olga always wins at {game}. She ______ (be) very clever, {name}.", { game: ["chess", "cards", "backgammon", "quizzes"], name: NAME }],
  ["want", "The {pet} is sitting by its bowl. It ______ (want) its dinner, {name}.", { pet: ["cat", "dog", "puppy", "kitten"], name: NAME }],
  ["work", "My uncle has a big farm near {city}. He ______ (work) very hard, {name}.", { city: ["Fergana", "Namangan", "Andijan", "Jizzakh"], name: NAME }],
  ["be", "The {place} is dark and nobody is answering. They ______ (be) on holiday, {name}.", { place: ["office", "shop", "house", "flat"], name: NAME }],
  ["be", "That {thing} cost five thousand dollars. It ______ (be) very good, {name}.", { thing: ["camera", "laptop", "bike", "watch"], name: NAME }],
  ["be", "Everyone at the {event} is dancing. The music ______ (be) great, {name}.", { event: ["party", "wedding", "festival", "concert"], name: NAME }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `must ${v}`, why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SURE = "Rewrite with must.";
const FIX = "Correct the mistake.";
const ING = "Rewrite with must be + -ing.";
const WHY_ING = "The speaker is sure about something happening now: must be + -ing.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [SURE, "I'm sure he is at the {place}, {name}.", "He ______ at the {place}, {name}.", "must be", { place: ["gym", "bazaar", "library", "office"], name: NAME }],
  [SURE, "I'm sure you are tired after the {trip}, {name}.", "You ______ tired after the {trip}, {name}.", "must be", { trip: ["flight", "match", "long walk", "exam"], name: NAME }],
  [SURE, "I'm sure she knows the answer, {name}. She's the best in the {class}.", "She ______ the answer, {name}. She's the best in the {class}.", "must know", { class: ["class", "group", "school", "team"], name: NAME }],
  [SURE, "I'm sure they live near the {place}, {name}.", "They ______ near the {place}, {name}.", "must live", { place: ["station", "park", "river", "bazaar"], name: NAME }],
  [SURE, "I'm sure the {shop} is closed now, {name}.", "The {shop} ______ closed now, {name}.", "must be", { shop: ["bank", "post office", "bakery", "pharmacy"], name: NAME }],
  [FIX, "He must to be at home, {name}. His {car} is outside.", "He ______ at home, {name}. His {car} is outside.", "must be", { car: ["car", "bike", "scooter", "van"], name: NAME }],
  [FIX, "She must is tired. She worked for {n} hours, {name}.", "She ______ tired. She worked for {n} hours, {name}.", "must be", { n: ["twelve", "ten", "eleven", "fourteen"], name: NAME }],
  [FIX, "They must knowing the way. They live in {city}, {name}.", "They ______ the way. They live in {city}, {name}.", "must know", { city: ["Bukhara", "Khiva", "Samarkand", "Tashkent"], name: NAME }],
  [FIX, "It musts be cold outside. Everyone is wearing {item}, {name}.", "It ______ cold outside. Everyone is wearing {item}, {name}.", "must be", { item: ["hats", "scarves", "gloves", "boots"], name: NAME }],
  [FIX, "You must are hungry. You've had nothing since {time}, {name}.", "You ______ hungry. You've had nothing since {time}, {name}.", "must be", { time: ["breakfast", "last night", "seven o'clock", "yesterday"], name: NAME }],
  [ING, "I'm sure she is working at the {place} now, {name}.", "She ______ at the {place} now, {name}.", "must be working", { place: ["hospital", "bank", "school", "shop"], name: NAME }],
  [ING, "I'm sure it is raining in {city}, {name}.", "It ______ in {city}, {name}.", "must be raining", { city: ["London", "Moscow", "Tashkent", "Fergana"], name: NAME }],
  [ING, "I'm sure they are sleeping. The {room} is dark, {name}.", "They ______. The {room} is dark, {name}.", "must be sleeping", { room: ["flat", "bedroom", "house", "tent"], name: NAME }],
  [ING, "I'm sure he is joking about the {thing}, {name}.", "He ______ about the {thing}, {name}.", "must be joking", { thing: ["test", "prize", "wedding", "money"], name: NAME }],
  [ING, "I'm sure you are waiting for the {bus}, {name}.", "You ______ for the {bus}, {name}.", "must be waiting", { bus: ["bus", "train", "taxi", "results"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: instr === ING ? WHY_ING : WHY, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your friend hasn't eaten all day. Write one sentence about how he feels. Use must.", "must be hungry / tired", ["exactly one sentence", "must + base verb", "present"]],
  ["Look out of the window in your mind: everyone has an umbrella. Write one sentence with must.", "It must be raining", ["exactly one sentence", "must be + -ing", "weather"]],
  ["A neighbour has a big new car and a big house. Write one sentence with must.", "They must be rich", ["exactly one sentence", "must", "present"]],
  ["Your classmate always gets top marks. Write one sentence with must.", "She must study a lot", ["exactly one sentence", "must + base verb", "a reason"]],
  ["Someone is knocking at your door at 7 a.m. Write one sentence with must.", "It must be …", ["exactly one sentence", "must be", "a guess you are sure about"]],
  ["Write one sentence about a busy restaurant. Use must.", "The food must be good", ["exactly one sentence", "must + be", "present"]],
  ["Write two sentences: the evidence, then your deduction with must.", "evidence + must", ["exactly two sentences", "first: what you see", "second: must + base verb"]],
  ["Write one sentence with must be + -ing about what someone is doing now.", "must be + -ing", ["exactly one sentence", "must be + -ing", "now"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You visit a friend's flat. Describe three things you see and what they tell you. Use must.", "must for present deduction", ["three deductions", "must + base verb", "evidence for each"]],
  ["Look at a busy street in your town. Write three or four sentences about the people. Use must.", "must be / must be + -ing", ["must", "must be + -ing", "three or four sentences"]],
  ["Your teacher is late today. Write three or four sentences guessing why, when you are sure. Use must.", "must for a confident guess", ["must", "a reason", "three or four sentences"]],
  ["Describe a photo of a family at a party. What must be true? Write three or four sentences.", "must + base verb", ["must", "present", "three or four sentences"]],
  ["A new student joins your class. Write three or four sentences about what must be true about him or her.", "must for present deduction", ["must", "evidence", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.deduction.must-present.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
