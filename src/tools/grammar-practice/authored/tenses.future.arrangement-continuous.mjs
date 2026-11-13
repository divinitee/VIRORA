// Hand-authored: tenses / future / arrangement-continuous (B1).
// Speaking Pack batch 2, topic 14 (grammar-run/SPEAK-2.md). Tee approved B1 early.
//
// Tests ONE point (placement item): the present continuous for a FIXED future
// arrangement, already made with another person ("I'm meeting Sarah for lunch
// tomorrow. We arranged it last week"). Every sentence carries the evidence of
// the arrangement: a booking, an appointment, an invitation, a promise.
//
// Triage: kept. Siblings: going-to-plan (A2, live), will-spontaneous (A2,
// live), timetable-simple (B1, present simple for timetables) and
// future-continuous (topic 13). So "be going to" is never offered (it is also
// right), and no sentence uses a timetable verb (start, leave, arrive, begin,
// fly, get married), because there the present simple is correct too.
//
// Distractors, from the placement item: present simple (meet), will + verb
// (a decision now, not an arrangement), present perfect. Some items swap the
// perfect for "am meet" (be + base, the learner error).
// Typed keys are am/is/are + -ing, so no build/transform sentence prints that
// am/is/are or the -ing word.
//
// Run: node tools/grammar-practice/authored/tenses.future.arrangement-continuous.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "future", topic: "arrangement-continuous", level: "B1", pv: "2.5" };
const why = (form) => `This is already arranged with other people for a fixed time, so use the present continuous: ${form}.`;
const BE = { i: "am", sg: "is", pl: "are" };
const HAVE = { i: "have", sg: "has", pl: "have" };

/* ---------------- choose: 20 mcq ---------------- */
// [type, base, -ing, present, past participle, variant, prompt, slots]
const CHOOSE = [
  ["i", "meet", "meeting", "meet", "met", 0, "I ______ {name} for lunch on {day}. We arranged it last week.",
    { name: ["Aziz", "Olga", "Kamola", "Timur"], day: ["Friday", "Saturday", "Monday", "Thursday"] }],
  ["sg", "stay", "staying", "stays", "stayed", 1, "My {who} ______ with us next week. She called my mother yesterday.",
    { who: ["aunt", "grandmother", "cousin", "older sister"] }],
  ["pl", "visit", "visiting", "visit", "visited", 0, "We ______ our grandparents in {city} on Sunday. My father phoned them yesterday.",
    { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"] }],
  ["sg", "see", "seeing", "sees", "seen", 0, "{name} ______ the dentist at {time} tomorrow. She has an appointment.",
    { name: ["Madina", "Anna", "Sevara", "Nilufar"], time: ["ten", "three", "half past four", "nine"] }],
  ["pl", "have", "having", "have", "had", 1, "My parents ______ a party for my sister's birthday on {day}. They invited twenty guests.",
    { day: ["Saturday", "Sunday", "Friday", "Wednesday"] }],
  ["i", "play", "playing", "play", "played", 0, "I ______ tennis with {name} at {time} this evening. We booked the court.",
    { name: ["Sardor", "Ilya", "Rustam", "Laziz"], time: ["six", "seven", "five", "half past six"] }],
  ["pl", "come", "coming", "come", "come", 1, "Our {who} ______ for dinner tonight. My mother invited them this morning.",
    { who: ["cousins", "neighbours", "relatives", "friends"] }],
  ["sg", "take", "taking", "takes", "taken", 0, "My father ______ me to the {place} at five tomorrow. We agreed on it last night.",
    { place: ["airport", "station", "bus station", "hospital"] }],
  ["i", "have", "having", "have", "had", 1, "I ______ dinner with my {who} on Friday. We booked a table at a {place}.",
    { who: ["friends", "parents", "cousins", "classmates"], place: ["café", "restaurant", "teahouse"] }],
  ["sg", "fix", "fixing", "fixes", "fixed", 0, "The plumber ______ our {thing} on Tuesday morning. My mother called him yesterday.",
    { thing: ["sink", "shower", "heater", "washing machine"] }],
  ["pl", "watch", "watching", "watch", "watched", 1, "We ______ a film with our {who} on Saturday. We already have the tickets.",
    { who: ["cousins", "friends", "classmates", "neighbours"] }],
  ["i", "visit", "visiting", "visit", "visited", 0, "I can't come to the lesson on {day}. I ______ my grandmother in {city}. We planned it a month ago.",
    { day: ["Monday", "Tuesday", "Thursday", "Friday"], city: ["Khiva", "Termez", "Andijan", "Nukus"] }],
  ["sg", "meet", "meeting", "meets", "met", 1, "{name} ______ his {who} at the station at eight. He promised them last week.",
    { name: ["Bobur", "Pavel", "Jasur", "Sanjar"], who: ["grandparents", "cousins", "parents", "friends"] }],
  ["pl", "help", "helping", "help", "helped", 0, "My {who} ______ me with my move on {day}. They promised last week.",
    { who: ["friends", "cousins", "brothers", "neighbours"], day: ["Saturday", "Sunday", "Friday", "Monday"] }],
  ["i", "take", "taking", "take", "taken", 1, "Sorry, I can't meet you at seven. I ______ my {who} to the cinema. I bought the tickets yesterday.",
    { who: ["cousin", "little brother", "sister", "nephew"] }],
  ["sg", "cook", "cooking", "cooks", "cooked", 0, "My grandmother ______ {food} for the whole family on {day}. Everyone has an invitation.",
    { food: ["plov", "manti", "sumalak", "lagman"], day: ["Sunday", "Saturday", "Friday", "Navruz"] }],
  ["pl", "stay", "staying", "stay", "stayed", 1, "My parents ______ in a hotel in {city} next weekend. They booked a room.",
    { city: ["Samarkand", "Bukhara", "Istanbul", "Dubai"] }],
  ["i", "see", "seeing", "see", "seen", 0, "I ______ the doctor on {day} afternoon. I made an appointment yesterday.",
    { day: ["Thursday", "Monday", "Wednesday", "Friday"] }],
  ["pl", "study", "studying", "study", "studied", 1, "{name} and I ______ for the exam together at the library tomorrow. We planned it on the phone.",
    { name: ["Aziz", "Olga", "Dilnoza", "Timur"] }],
  ["sg", "play", "playing", "plays", "played", 0, "My brother ______ the guitar at his friend's wedding on {day}. The family asked him a month ago.",
    { day: ["Saturday", "Sunday", "Friday", "Thursday"] }],
].map(([t, v, ing, pres, pp, variant, prompt, slots]) => {
  const key = `${BE[t]} ${ing}`;
  const options = variant === 0
    ? [key, pres, `will ${v}`, `${HAVE[t]} ${pp}`]
    : [key, pres, `will ${v}`, `${BE[t]} ${v}`];
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: why(key), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete the sentence with the present continuous of the verb in brackets.";
// no sentence prints the key's am/is/are or its -ing word
const BUILD = [
  ["am meeting", "I ______ (meet) {name} at the café at {time}. We arranged it on Monday.",
    { name: ["Aziz", "Olga", "Kamola", "Timur"], time: ["six", "seven", "five", "half past six"] }],
  ["is staying", "My {who} ______ (stay) with us next week. She called my mother yesterday.",
    { who: ["aunt", "grandmother", "cousin", "older sister"] }],
  ["are visiting", "We ______ (visit) our grandparents in {city} on Sunday. Dad bought the train tickets.",
    { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"] }],
  ["is seeing", "{name} ______ (see) the dentist at {time} tomorrow. She made an appointment.",
    { name: ["Madina", "Anna", "Sevara", "Nilufar"], time: ["ten", "three", "half past four", "nine"] }],
  ["are having", "My parents ______ (have) a party on {day}. They invited all the neighbours.",
    { day: ["Saturday", "Sunday", "Friday", "Wednesday"] }],
  ["am playing", "I ______ (play) tennis with my {who} this evening. We booked the court.",
    { who: ["brother", "cousin", "father", "friend"] }],
  ["are coming", "Our {who} ______ (come) for dinner tonight. My mother invited them this morning.",
    { who: ["cousins", "neighbours", "relatives", "friends"] }],
  ["is taking", "My father ______ (take) me to the {place} at six tomorrow. We agreed on it yesterday.",
    { place: ["airport", "station", "bus station", "hospital"] }],
  ["am having", "I ______ (have) lunch with my {who} on Friday. We booked a table at a {place}.",
    { who: ["friends", "parents", "cousins", "classmates"], place: ["café", "restaurant", "teahouse"] }],
  ["is fixing", "The mechanic ______ (fix) our {thing} on Tuesday. My father called him.",
    { thing: ["car", "motorbike", "van", "bike"] }],
  ["are watching", "We ______ (watch) the match with our {who} on Saturday. We have the tickets.",
    { who: ["cousins", "friends", "classmates", "neighbours"] }],
  ["am helping", "Sorry, I can't come on {day}. I ______ (help) my uncle in his {place}.",
    { day: ["Saturday", "Sunday", "Friday", "Monday"], place: ["shop", "garden", "workshop", "café"] }],
  ["is meeting", "{name} ______ (meet) his friends at the {place} at eight. They planned it in a group chat.",
    { name: ["Bobur", "Pavel", "Jasur", "Sanjar"], place: ["park", "café", "metro", "stadium"] }],
  ["is cooking", "My grandmother ______ (cook) {food} for everyone on Sunday. She invited the whole family.",
    { food: ["plov", "manti", "sumalak", "lagman"] }],
  ["are going", "My parents ______ (go) to {city} on Monday. Their tickets came by email.",
    { city: ["Dubai", "Istanbul", "Seoul", "Moscow"] }],
  ["am taking", "I ______ (take) my little {who} to the zoo on Saturday. I promised him last week.",
    { who: ["brother", "cousin", "nephew"] }],
  ["are staying", "We ______ (stay) at a hotel in {city} next weekend. We booked two rooms.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"] }],
  ["are studying", "{name} and I ______ (study) together at the library tomorrow. We planned it after class.",
    { name: ["Aziz", "Olga", "Dilnoza", "Timur"] }],
  ["is singing", "My sister ______ (sing) at her friend's wedding in {month}. The family asked her last month.",
    { month: ["May", "June", "September", "October"] }],
  ["am seeing", "I ______ (see) the doctor on {day} afternoon. The receptionist gave me a time.",
    { day: ["Thursday", "Monday", "Wednesday", "Friday"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: why(key), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const DIARY = "Write a sentence about the plan in the diary. Use the verb in brackets.";
const PERSON = "Rewrite the sentence about the person in the hint.";
const FIX = "There is a mistake with the verb. Rewrite the sentence correctly.";
const whyD = (form) => `A diary plan is an arrangement, so use the present continuous: ${form}.`;
const whyP = (form) => `Same arrangement, new person: change am / is / are to match: ${form}.`;
const whyF = (bad, form) => `${bad} is wrong for an arrangement. Use am / is / are + -ing: ${form}.`;
const TRANSFORM = [
  [DIARY, "Diary, {day}: 3 pm, dentist.", "I ______ (see) the dentist at three on {day}.", "am seeing", whyD("am seeing"),
    { day: ["Saturday", "Monday", "Tuesday", "Thursday"] }],
  [DIARY, "Diary, Friday: 7 pm, dinner with {name}.", "I ______ (have) dinner with {name} at seven on Friday.", "am having", whyD("am having"),
    { name: ["Aziz", "Olga", "Kamola", "Timur"] }],
  [DIARY, "Diary, Sunday: football with my {who}, 10 am.", "I ______ (play) football with my {who} on Sunday morning.", "am playing", whyD("am playing"),
    { who: ["cousins", "friends", "brothers", "classmates"] }],
  [DIARY, "Diary, {day}: meet Grandma at the {place}.", "I ______ (meet) my grandmother at the {place} on {day}.", "am meeting", whyD("am meeting"),
    { day: ["Monday", "Wednesday", "Friday", "Sunday"], place: ["station", "airport", "bus station"] }],
  [DIARY, "Diary, Thursday: help Uncle Rustam in the {place}.", "I ______ (help) my uncle in his {place} on Thursday.", "am helping", whyD("am helping"),
    { place: ["shop", "garden", "workshop", "café"] }],
  [PERSON, "I am meeting {name} at the café tomorrow.", "My {who} ______ {name} at the café tomorrow.", "is meeting", whyP("is meeting"),
    { name: ["Aziz", "Olga", "Kamola", "Timur"], who: ["sister", "brother", "mother", "cousin"] }],
  [PERSON, "We are driving to {city} on Monday.", "My {who} ______ to {city} on Monday.", "is driving", whyP("is driving"),
    { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], who: ["aunt", "uncle", "father", "grandmother"] }],
  [PERSON, "She is visiting her grandparents in {city} on Sunday.", "We ______ our grandparents in {city} on Sunday.", "are visiting", whyP("are visiting"),
    { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"] }],
  [PERSON, "My brother is playing in a concert on {day}.", "I ______ in a concert on {day}.", "am playing", whyP("am playing"),
    { day: ["Saturday", "Friday", "Sunday", "Thursday"] }],
  [PERSON, "I am having a party at my house on {day}.", "My {who} ______ a party at their house on {day}.", "are having", whyP("are having"),
    { who: ["cousins", "neighbours", "parents", "friends"], day: ["Saturday", "Sunday", "Friday", "Wednesday"] }],
  [FIX, "I meet my {who} at the station tomorrow. We arranged it last week.", "I ______ my {who} at the station tomorrow. We arranged it last week.", "am meeting", whyF("Meet (present simple)", "am meeting"),
    { who: ["cousin", "grandmother", "uncle", "aunt"] }],
  [FIX, "{name} is visit her aunt in {city} on Friday.", "{name} ______ her aunt in {city} on Friday.", "is visiting", whyF("Is visit", "is visiting"),
    { name: ["Madina", "Anna", "Sevara", "Nilufar"], city: ["Khiva", "Termez", "Andijan", "Nukus"] }],
  [FIX, "We going to the {event} on Saturday. We have the tickets.", "We ______ to the {event} on Saturday. We have the tickets.", "are going", whyF("Going (no are)", "are going"),
    { event: ["concert", "theatre", "football match", "circus"] }],
  [FIX, "My {who} will playing tennis with his friend at six. They booked the court.", "My {who} ______ tennis with his friend at six. They booked the court.", "is playing", whyF("Will playing", "is playing"),
    { who: ["brother", "father", "cousin", "uncle"] }],
  [FIX, "I am have lunch with my {who} on {day}. We booked a table.", "I ______ lunch with my {who} on {day}. We booked a table.", "am having", whyF("Am have", "am having"),
    { who: ["parents", "friends", "cousins", "classmates"], day: ["Friday", "Sunday", "Monday", "Saturday"] }],
].map(([instr, source, hint, key, w, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about someone you are meeting this week. Say when.", "present continuous for an arrangement", ["exactly one sentence", "a day or time", "am / is / are + -ing"]],
  ["Write one sentence about a trip your family is taking soon, and how you know it is fixed.", "arrangement + evidence", ["one or two sentences", "a place named", "present continuous"]],
  ["Write one sentence about an appointment you have this month.", "am seeing / am going", ["exactly one sentence", "a day named", "present continuous"]],
  ["Write one sentence about what a friend is doing on Saturday evening.", "is + -ing with he or she", ["exactly one sentence", "must name the friend", "is + -ing"]],
  ["Write one sentence saying no to an invitation because you have another plan.", "present continuous as a reason", ["one or two sentences", "Sorry, I can't ...", "I am + -ing"]],
  ["Write one sentence about a family event next weekend.", "are + -ing for a family plan", ["exactly one sentence", "next weekend", "present continuous"]],
  ["Write one sentence about who is coming to your home for dinner this week.", "is / are coming", ["exactly one sentence", "a day named", "coming"]],
  ["Write two sentences from your diary for next week: two different arrangements.", "two arrangements", ["exactly two sentences", "two different days", "present continuous in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your plans for next weekend. Who are you meeting, and where are you going? Write three or four sentences.",
    "present continuous for arrangements", ["am / is / are + -ing", "days or times", "people named"]],
  ["A friend invites you to the cinema on Friday, but you are busy. Write a message: say no and explain your arrangements. Write three or four sentences.",
    "present continuous to explain plans", ["I'm + -ing", "a time", "polite refusal"]],
  ["Describe your family's plans for a holiday such as Navruz or New Year. Write three or four sentences.",
    "present continuous for family arrangements", ["we are + -ing", "who is coming", "where you are going"]],
  ["Look at your week. Describe three appointments or meetings you have. Write three or four sentences.",
    "present continuous with fixed times", ["am + -ing", "a day in each sentence", "no will for arrangements"]],
  ["Describe a trip that someone in your family is taking soon. Write three or four sentences.",
    "is / are + -ing for travel plans", ["is + -ing", "a place and a day", "how you know it is booked"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.future.arrangement-continuous.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);