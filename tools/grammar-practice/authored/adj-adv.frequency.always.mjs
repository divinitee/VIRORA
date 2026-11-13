// Hand-authored: adj-adv / frequency / always (A1).
// Speaking Pack batch 2, topic 6 (grammar-run/SPEAK-2.md).
//
// Tests ONE point: always means every time, with no exceptions (placement
// item: "always for a fixed routine"). Each sentence carries a cue that
// rules out every other adverb on offer: "every day, even on holidays",
// "she can't sleep without it", "he is never late".
//
// Triage (SPEAK-2 point 2): kept. Position belongs to adverb-position
// (topic 5), so here the adverb slot is fixed by the sentence and only the
// choice of word is tested. never and rarely get their own topics; here
// they appear only as wrong answers.
//
// Distractors: never / rarely / sometimes contradict the cue. usually is
// offered only where the cue says "every time" or "with no exceptions",
// because usually means "most times, not all" (the common learner mix-up:
// Uzbek "odatda" vs "doim", Russian "обычно" vs "всегда").
//
// Build: the learner types one word from always / usually / never. Most
// keys are always; a few are usually (an exception is stated) or never, so
// the meaning contrast is real and the answer is not given away.
// Transform: 5 "every day / every time" → always, 5 never + opposite →
// always, 5 correct usually → always when the facts allow no exception.
//
// Run: node tools/grammar-practice/authored/adj-adv.frequency.always.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "frequency", topic: "always", level: "A1", pv: "2.5" };
const why = (cue) => `${cue}, so the answer is always. Always means every time, with no exceptions.`;

/* ---------------- choose: 20 mcq ---------------- */
const N3 = ["always", "never", "rarely", "sometimes"];
const U3 = ["always", "usually", "rarely", "never"];
// [options, prompt, cue for why, slots]
const CHOOSE = [
  [N3, "My father ______ reads the news on his {device} at {time}. He does it every morning, even on holidays.", "Every morning, even on holidays",
    { device: ["phone", "laptop", "tablet", "computer"], time: ["breakfast", "seven o'clock", "half past six", "eight o'clock"] }],
  [U3, "Our {subject} teacher ______ checks our homework at the {part} of the lesson. She looks at every notebook, every time.", "Every notebook, every time",
    { subject: ["English", "maths", "history", "Russian"], part: ["start", "end", "beginning"] }],
  [N3, "The {shop} near our {home} is ______ open at eight o'clock, every day of the week.", "Every day of the week",
    { shop: ["bakery", "pharmacy", "shop", "small market"], home: ["house", "flat", "school", "metro station"] }],
  [N3, "I ______ wear a seatbelt in my {person}'s car. I put it on every time, even for short trips to the {place}.", "Every time, even for short trips",
    { person: ["uncle", "father", "aunt", "brother"], place: ["bazaar", "shop", "school", "park"] }],
  [N3, "Dilnoza ______ says thank you to the {person}. She is very polite and does it every time.", "She does it every time",
    { person: ["bus driver", "waiter", "shop assistant", "cleaner"] }],
  [N3, "My {relative} is ______ at home in the evening. She {act} and never goes out after dark.", "She never goes out after dark",
    { relative: ["grandmother", "aunt", "mother", "older sister"], act: ["cooks", "reads", "watches TV", "sews"] }],
  [U3, "We ______ take off our shoes at the {spot} when we visit {who}. Everyone does it, every time.", "Everyone does it, every time",
    { spot: ["door", "entrance", "front door", "doorway"], who: ["friends", "our relatives", "our neighbours", "my aunt"] }],
  [N3, "My {device}'s battery is ______ empty by {time}. It is old, and this happens every single day.", "This happens every single day",
    { device: ["phone", "laptop", "tablet", "watch"], time: ["lunch", "six o'clock", "the evening", "the end of school"] }],
  [N3, "Bobur ______ gets the top mark in {subject}. He gets five out of five in every test.", "Five out of five in every test",
    { subject: ["maths", "physics", "chemistry", "English"] }],
  [N3, "The morning {transport} to {city} ______ leaves on time. It is never late.", "It is never late",
    { transport: ["train", "bus", "fast train", "minibus"], city: ["Samarkand", "Bukhara", "Andijan", "Namangan"] }],
  [N3, "In our family, we ______ eat {food} at Navruz with our {who}. We have it every year, because it is our tradition.", "Every year, because it is a tradition",
    { food: ["sumalak", "plov", "halim", "samsa"], who: ["relatives", "grandparents", "neighbours", "cousins"] }],
  [U3, "Kamola is ______ happy to help her {who}. She says yes every time they ask, even when she is {state}.", "She says yes every time",
    { who: ["friends", "classmates", "cousins", "neighbours"], state: ["busy", "tired", "hungry", "late"] }],
  [["always", "never", "rarely", "sometimes"], "The water in this {place} is ______ cold, even in {month}.", "Cold even in the hottest months",
    { place: ["river", "mountain lake", "spring", "stream"], month: ["July", "August", "June", "summer"] }],
  [N3, "My little sister ______ sleeps with her {toy}. She can't sleep without it.", "She can't sleep without it",
    { toy: ["teddy bear", "doll", "blanket", "toy rabbit"] }],
  [U3, "Our {team} ______ trains on Tuesdays and Thursdays. The coach doesn't cancel, even when it {weather}.", "The coach doesn't cancel, even in bad weather",
    { team: ["football team", "volleyball team", "basketball team", "running club"], weather: ["rains", "snows", "is very cold", "is very hot"] }],
  [N3, "I ______ forget people's names. I meet someone at a {event}, and {n} minutes later the name is gone, every time.", "Every time",
    { event: ["party", "wedding", "lesson", "meeting"], n: ["five", "ten", "two", "three"] }],
  [U3, "Sardor is ______ the first student in the {room}. He arrives at {time}, before everyone, every day.", "Before everyone, every day",
    { room: ["classroom", "gym", "lab", "computer room"], time: ["half past seven", "quarter to eight", "seven o'clock", "ten to eight"] }],
  [N3, "My mother ______ makes {food} on {day}. It is our family tradition, every week.", "A family tradition, every week",
    { food: ["plov", "manti", "lagman", "dumplings"], day: ["Fridays", "Sundays", "Saturdays", "Thursdays"] }],
  [N3, "These {shoes} are ______ comfortable. I wear them to {place} every day, and my feet never hurt.", "My feet never hurt",
    { shoes: ["shoes", "trainers", "boots", "sandals"], place: ["school", "work", "the gym", "university"] }],
  [U3, "Aziz is ______ online. His {who} send messages at any hour, and he replies in one minute, every time.", "He replies every time",
    { who: ["friends", "classmates", "cousins", "brothers"] }],
].map(([options, prompt, cue, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: why(cue), slots,
}));

/* ---------------- build: 20 gap_fill (type one word) ---------------- */
const INSTR = "Write always, usually or never.";
const WHY = {
  always: (cue) => why(cue),
  usually: (cue) => `${cue}, so the answer is usually. Usually means most times, but not every time.`,
  never: (cue) => `${cue}, so the answer is never. Never means not at any time.`,
};
// [key, source, cue, slots]
const BUILD = [
  ["always", "My {who} ______ goes to bed at {time}. He goes at that time every night, even at weekends.", "Every night, even at weekends",
    { who: ["brother", "cousin", "uncle", "grandfather"], time: ["ten", "eleven", "half past ten", "nine"] }],
  ["always", "I ______ have {drink} with breakfast. I have it every morning, even on holidays.", "Every morning, even on holidays",
    { drink: ["tea", "milk", "juice", "coffee"] }],
  ["always", "Our {teacher} ______ comes to {what} with a smile. In every lesson, she is happy to see us.", "In every lesson",
    { teacher: ["English teacher", "maths teacher", "music teacher", "history teacher"], what: ["class", "school", "our lessons", "the lesson"] }],
  ["usually", "We ______ eat lunch at {place}. We eat there most days, but on {day} we go home.", "Most days, but not on one day",
    { place: ["the canteen", "school", "the café", "college"], day: ["Fridays", "Saturdays", "Wednesdays", "Mondays"] }],
  ["never", "My {who} ______ drinks coffee. He doesn't like it at all, so he has {drink} instead.", "He doesn't like it at all",
    { who: ["grandfather", "father", "uncle", "older brother"], drink: ["green tea", "black tea", "milk", "water"] }],
  ["always", "The {place} is ______ crowded on {day}. There are lots of people every week, with no exceptions.", "Every week, with no exceptions",
    { place: ["bazaar", "park", "metro", "shopping centre"], day: ["Saturdays", "Sundays", "holidays", "Friday evenings"] }],
  ["always", "{name} ______ wears a hat in winter. She puts it on every time she goes {out}, even for a minute.", "Every time, even for a minute",
    { name: ["Malika", "Zarina", "Olga", "Nilufar"], out: ["out", "to school", "to the shop", "outside"] }],
  ["always", "I ______ check the weather on my {device} in the morning. I look at it every day before I {act}.", "Every day",
    { device: ["phone", "laptop", "tablet", "computer"], act: ["leave home", "get dressed", "go out", "choose my clothes"] }],
  ["usually", "My parents ______ watch {prog} in the evening. They watch it most evenings, but not on {day}.", "Most evenings, but not on one day",
    { prog: ["the news", "TV", "films", "football"], day: ["Sundays", "Fridays", "Saturdays", "Mondays"] }],
  ["never", "{name} is ______ late. He comes on time to every lesson and every meeting.", "He comes on time to everything",
    { name: ["Timur", "Rustam", "Anton", "Jasur"] }],
  ["always", "My little cousins are ______ hungry after {act}. They ask for {food} every time, with no exceptions.", "Every time, with no exceptions",
    { act: ["swimming", "football", "school", "playing outside"], food: ["samsa", "bread", "fruit", "sandwiches"] }],
  ["always", "Our {pet} ______ sleeps on my {place}. She sleeps there every night, even in summer.", "Every night, even in summer",
    { pet: ["cat", "kitten"], place: ["bed", "pillow", "chair", "sofa"] }],
  ["usually", "I ______ take the bus to {place}. I take it most days, but sometimes my {who} drives me.", "Most days, but not every day",
    { place: ["school", "work", "college", "university"], who: ["father", "uncle", "brother", "mother"] }],
  ["always", "Aziza ______ tells her {who} the truth. She is very honest and does it every time.", "Every time",
    { who: ["parents", "friends", "teachers", "grandmother"] }],
  ["never", "My {who} ______ eats meat. He is a vegetarian, so he eats {food} and vegetables.", "He is a vegetarian",
    { who: ["brother", "cousin", "uncle", "friend"], food: ["rice", "beans", "eggs", "bread"] }],
  ["always", "Our {place} is ______ clean. The cleaners come every day, morning and evening.", "Every day, morning and evening",
    { place: ["school", "classroom", "office", "building"] }],
  ["usually", "We ______ visit my grandparents on {day}. We go most weeks, but not when it {weather}.", "Most weeks, but not in bad weather",
    { day: ["Sundays", "Saturdays", "Friday evenings", "Saturday mornings"], weather: ["snows", "rains hard", "is very cold", "is icy"] }],
  ["always", "My {who} ______ locks the {thing} at night. He checks it every night before bed.", "Every night",
    { who: ["father", "grandfather", "uncle", "brother"], thing: ["door", "front door", "gate", "garage"] }],
  ["always", "Students are ______ quiet in the {place}. Everyone is silent there, from {time} until closing.", "Everyone is silent there, all day",
    { place: ["library", "exam room", "reading room", "test room"], time: ["morning", "nine o'clock", "opening", "eight"] }],
  ["always", "I ______ sleep with the {thing} open. I keep it open every night, even in {month}.", "Every night, even in the cold months",
    { thing: ["window", "door", "balcony door", "small window"], month: ["winter", "January", "December", "February"] }],
].map(([key, source, cue, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: WHY[key](cue), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const EVERY = "Rewrite the sentence with always instead of the words every day or every time.";
const OPP = "Rewrite the sentence with always and the opposite idea.";
const FIX = "The adverb in the first sentence does not match the facts. Rewrite the first sentence correctly.";
const whyE = "Every time, with no exceptions, is what always means. Always goes before the main verb or after be.";
const whyO = "Never late means always on time: never and always are opposites.";
const whyF = (cue) => `${cue}: there are no exceptions, so usually is wrong. Use always.`;
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [EVERY, "I drink {drink} after {sport} every time.", "I ______ {drink} after {sport}.", "always drink", whyE,
    { drink: ["water", "juice", "tea", "milk"], sport: ["football", "training", "running", "swimming"] }],
  [EVERY, "My mother calls her {rel} on {day} every week.", "My mother ______ her {rel} on {day}.", "always calls", whyE,
    { day: ["Sundays", "Fridays", "Saturdays", "Mondays"], rel: ["sister", "mother", "brother", "cousin"] }],
  [EVERY, "We have {food} for lunch at {place} every day.", "We ______ {food} for lunch at {place}.", "always have", whyE,
    { food: ["soup", "bread", "salad", "rice"], place: ["home", "the canteen", "school", "work"] }],
  [EVERY, "{name} is tired after {thing} every time.", "{name} ______ tired after {thing}.", "is always", whyE,
    { name: ["Laziz", "Ruslan", "Ilya", "Javlon"], thing: ["work", "school", "training", "the gym"] }],
  [EVERY, "The {bus} is full at {time} every day.", "The {bus} ______ full at {time}.", "is always", whyE,
    { bus: ["bus", "metro", "minibus", "tram"], time: ["eight o'clock", "half past eight", "rush hour", "seven o'clock"] }],
  [OPP, "My {who} is never late for {thing}.", "My {who} ______ on time for {thing}.", "is always", whyO,
    { who: ["brother", "sister", "father", "cousin"], thing: ["school", "work", "training", "dinner"] }],
  [OPP, "{name} never forgets her {thing}.", "{name} ______ (remember) her {thing}.", "always remembers",
    "Never forgets means always remembers: never and always are opposites.",
    { name: ["Nodira", "Sevara", "Anna", "Malika"], thing: ["keys", "phone", "notebook", "bag"] }],
  [OPP, "Our {room} is never dirty.", "Our {room} ______ clean.", "is always",
    "Never dirty means always clean: never and always are opposites.",
    { room: ["kitchen", "classroom", "flat", "bathroom"] }],
  [OPP, "The {shop} near my house is never closed on {day}.", "The {shop} near my house ______ open on {day}.", "is always",
    "Never closed means always open: never and always are opposites.",
    { shop: ["pharmacy", "bakery", "shop", "market"], day: ["Sundays", "Saturdays", "holidays", "Mondays"] }],
  [OPP, "My {who} never go to bed late {when}.", "My {who} ______ to bed early {when}.", "always go",
    "Never late means always early: never and always are opposites.",
    { who: ["grandparents", "parents", "little cousins", "neighbours"], when: ["on weekdays", "in winter", "in the village", "at home"] }],
  [FIX, "Our {place} is usually open at eight. It opens at eight every day, even on {day}.", "Our {place} ______ open at eight.", "is always",
    whyF("Every day, even on holidays"),
    { place: ["shop", "bakery", "pharmacy", "café"], day: ["holidays", "Sundays", "Navruz", "New Year's Day"] }],
  [FIX, "My {who} usually brings {food} to school. She brings it every day, with no exceptions.", "My {who} ______ {food} to school.", "always brings",
    whyF("Every day, with no exceptions"),
    { who: ["friend", "sister", "classmate", "cousin"], food: ["lunch", "fruit", "water", "bread"] }],
  [FIX, "I usually wear glasses for {task}. I can't see well without them.", "I ______ glasses for {task}.", "always wear",
    whyF("I can't see well without them"),
    { task: ["reading", "driving", "watching TV", "my lessons"] }],
  [FIX, "My little {sib} usually cries at the {place}. He cries every single time we go.", "My little {sib} ______ at the {place}.", "always cries",
    whyF("Every single time"),
    { sib: ["brother", "cousin", "nephew"], place: ["dentist", "doctor", "hospital", "hairdresser"] }],
  [FIX, "The weather in {city} is usually hot in {month}. It is hot every single day of the month.", "The weather in {city} ______ hot in {month}.", "is always",
    whyF("Every single day of the month"),
    { city: ["Termez", "Bukhara", "Khiva", "Tashkent"], month: ["June", "July", "August"] }],
].map(([instr, source, hint, key, w, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you always do in the morning.", "always for a routine", ["exactly one sentence", "must use I", "must use always"]],
  ["Write one sentence about something you always eat or drink at a holiday.", "always for a tradition", ["exactly one sentence", "must name a holiday", "must use always"]],
  ["Write one sentence about a person in your family who is always busy, happy or tired.", "be + always", ["exactly one sentence", "must name a family member", "must use is always"]],
  ["Write one sentence about something you always take with you when you leave home.", "always for every time", ["exactly one sentence", "must name a thing", "must use always"]],
  ["Write one sentence about something you usually do, and one about something you always do.", "always vs usually", ["exactly two sentences", "one with usually", "one with always"]],
  ["Write one sentence about a place in your city that is always busy.", "be + always + adjective", ["exactly one sentence", "must name a place", "must use always"]],
  ["Write one sentence about a friend who always helps you.", "always for a habit", ["exactly one sentence", "must name the friend", "must use always"]],
  ["Write one sentence about a rule in your home or school that everyone always follows.", "always for a rule", ["exactly one sentence", "must say where", "must use always"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your morning routine. What do you always do before you leave home? Write three or four sentences.",
    "always for routines", ["always with a routine", "always before the main verb", "at least two different actions"]],
  ["Describe a family tradition. What does your family always do at Navruz, New Year or a birthday? Write three or four sentences.",
    "always for traditions", ["always with a tradition", "a holiday or event named", "present simple verbs"]],
  ["Describe a friend or family member. What are they always like? What do they always do? Write three or four sentences.",
    "always with be and with main verbs", ["is always + adjective", "always + main verb", "he or she with the -s form"]],
  ["Compare things you always do with things you usually do at the weekend. Write three or four sentences.",
    "always vs usually", ["always for no exceptions", "usually for most times", "at the weekend or at weekends"]],
  ["Describe a place you know well, such as a bazaar, a park or your school. What is always true about it? Write three or four sentences.",
    "always for facts that do not change", ["always used two or more times", "a place named", "be or a main verb after always as needed"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.frequency.always.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);