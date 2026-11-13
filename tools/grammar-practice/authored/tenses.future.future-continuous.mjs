// Hand-authored: tenses / future / future-continuous (B1).
// Speaking Pack batch 2, topic 13 (grammar-run/SPEAK-2.md). Tee approved B1 early.
//
// Tests ONE point (placement item): will be + -ing for an action IN PROGRESS
// at a stated future time ("At this time next week, we will be relaxing on
// the beach"). Every sentence names the future moment (at this time tomorrow,
// at nine tonight, in an hour) and most add why it matters ("so don't call").
//
// Triage: kept. Siblings: arrangement-continuous (present continuous for a
// plan, topic 14), future-perfect (B2, finished BY a time). So no option is
// the present continuous (it can be an arrangement), no "going to", and no
// future perfect.
//
// Distractors: will + base (the placement's wrong answer), "will be" + base
// (-ing forgotten), "will" + -ing (be forgotten), and the present simple.
// Typed keys are "will be + -ing", so no build/transform sentence prints
// "will" or "be" (the gate refuses a key that repeats a printed word).
//
// Run: node tools/grammar-practice/authored/tenses.future.future-continuous.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "future", topic: "future-continuous", level: "B1", pv: "2.5" };
const why = (form) => `The action will be in progress at that moment in the future, so use will be + -ing: ${form}.`;

/* ---------------- choose: 20 mcq ---------------- */
const A = (v, ing) => [`will be ${ing}`, `will ${v}`, `will be ${v}`, `will ${ing}`];
const B = (v, ing, pres) => [`will be ${ing}`, `will ${v}`, pres, `will be ${v}`];
const CHOOSE = [
  [A("relax", "relaxing"), "At this time {when}, we ______ on the beach in {place}, so don't call us.",
    { when: ["next week", "next Saturday", "next month", "tomorrow"], place: ["Antalya", "Dubai", "Batumi", "Bodrum"] }],
  [B("take", "taking", "take"), "Don't call me at {time} tomorrow. I ______ my {test} then.",
    { time: ["nine", "ten", "eleven", "half past nine"], test: ["driving test", "maths exam", "English exam", "IELTS test"] }],
  [A("have", "having"), "At {time} tonight, my {who} ______ dinner, so please come later.",
    { time: ["eight", "seven", "half past seven", "nine"], who: ["family", "parents", "grandparents", "cousins"] }],
  [A("sit", "sitting"), "At {time} tomorrow, I ______ in the exam hall, so I can't answer your messages.",
    { time: ["ten", "eleven", "nine", "half past ten"] }],
  [B("clean", "cleaning", "clean"), "Don't visit us on {day} morning. We ______ the {room} then.",
    { day: ["Saturday", "Sunday", "Friday", "Monday"], room: ["flat", "house", "kitchen", "garage"] }],
  [B("fly", "flying", "flies"), "At midnight on {day}, my sister ______ to {city}, so she can't come to the party.",
    { day: ["Friday", "Saturday", "Sunday", "Thursday"], city: ["Seoul", "Istanbul", "Dubai", "Moscow"] }],
  [A("play", "playing"), "Tomorrow at {time}, the children ______ football in the {place}, so it will be noisy.",
    { time: ["four", "five", "six", "half past four"], place: ["yard", "street", "park", "school yard"] }],
  [A("do", "doing"), "Please don't come at six. I ______ my {task} then.",
    { task: ["homework", "project", "essay", "English homework"] }],
  [B("run", "running", "runs"), "At this time on {day}, {name} ______ in the {race}, so he can't help you.",
    { day: ["Sunday", "Saturday", "Friday", "Monday"], name: ["Timur", "Aziz", "Pavel", "Sardor"], race: ["marathon", "school race", "city race"] }],
  [A("drive", "driving"), "In two hours, we ______ through the {place}, so there will be no internet.",
    { place: ["mountains", "desert", "Kamchik Pass", "valley"] }],
  [B("work", "working", "works"), "At {time} tomorrow, my {who} ______, so let's not phone her.",
    { time: ["nine", "ten", "eleven", "noon"], who: ["mother", "aunt", "sister", "grandmother"] }],
  [A("cook", "cooking"), "When the guests arrive at {time}, my mother ______ {food} in the kitchen. She always starts late.",
    { time: ["seven", "six", "eight", "half past six"], food: ["plov", "manti", "lagman", "soup"] }],
  [B("walk", "walking", "walk"), "This time tomorrow, we ______ around the old city of {city}. Our tour starts at ten.",
    { city: ["Bukhara", "Khiva", "Samarkand", "Shahrisabz"] }],
  [B("put", "putting", "puts"), "Don't phone {name} at eight. She ______ her baby to bed then.",
    { name: ["Dilnoza", "Olga", "Malika", "Nodira"] }],
  [B("fish", "fishing", "fish"), "At ten o'clock on {day}, I ______ at the {place} with my grandfather.",
    { day: ["Saturday", "Sunday", "Friday", "Wednesday"], place: ["lake", "river", "canal", "pond"] }],
  [A("serve", "serving"), "At this time next {when}, my {who} ______ in the army.",
    { when: ["year", "month", "spring", "winter"], who: ["brother", "cousin", "neighbour", "friend"] }],
  [A("write", "writing"), "Tomorrow at noon, the students ______ their {exam}, so the school will be quiet.",
    { exam: ["exam", "maths test", "English test", "final exam"] }],
  [B("drive", "driving", "drive"), "At seven tomorrow morning, I ______ to work, so call me after {time}.",
    { time: ["nine", "half past eight", "ten", "eight"] }],
  [A("celebrate", "celebrating"), "At this time on Sunday, we ______ my cousin's wedding in {city}.",
    { city: ["Tashkent", "Fergana", "Namangan", "Andijan"] }],
  [B("watch", "watching", "watch"), "Don't come at nine tonight. My {who} and I ______ a film.",
    { who: ["sister", "brother", "father", "friends"] }],
].map(([options, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: why(options[0]), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete the sentence with will be and the -ing form of the verb in brackets.";
// no sentence prints "will" or "be" (the key would echo it)
const BUILD = [
  ["flying", "At this time {when}, I ______ (fly) to {city}.",
    { when: ["tomorrow", "next Monday", "on Friday", "next week"], city: ["Seoul", "Dubai", "Istanbul", "Moscow"] }],
  ["studying", "Don't call me at {time} tonight. I ______ (study) for my {exam}.",
    { time: ["eight", "nine", "ten", "half past eight"], exam: ["exam", "maths test", "English test", "IELTS exam"] }],
  ["working", "At {time} on Saturday, my parents ______ (work) in the {place}.",
    { time: ["ten", "eleven", "nine", "noon"], place: ["garden", "shop", "bazaar", "yard"] }],
  ["sitting", "This time next week, we ______ (sit) on a train to {city}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  ["giving", "At noon tomorrow, {name} ______ (give) a talk at the {place}.",
    { name: ["Kamola", "Anna", "Zarina", "Sevara"], place: ["conference", "school", "university", "library"] }],
  ["cooking", "Please come after eight. At seven, I ______ (cook) {food} for the guests.",
    { food: ["plov", "manti", "lagman", "soup"] }],
  ["playing", "At this time on {day}, the {team} ______ (play) in the final.",
    { day: ["Sunday", "Saturday", "Friday", "Wednesday"], team: ["team", "boys", "girls", "students"] }],
  ["taking", "At ten tomorrow, my {who} ______ (take) his driving test, so he can't help you.",
    { who: ["brother", "cousin", "uncle", "neighbour"] }],
  ["cleaning", "Don't visit on Sunday morning. My {who} ______ (clean) the {room} then.",
    { who: ["mother", "aunt", "grandmother", "sister"], room: ["flat", "house", "kitchen", "garage"] }],
  ["watching", "At {time} tonight, we ______ (watch) the football match at {whose} house.",
    { time: ["nine", "eight", "ten", "half past eight"], whose: ["Aziz's", "my", "Olga's", "Timur's"] }],
  ["studying", "At this time next month, my {who} ______ (study) in {city}.",
    { who: ["sister", "brother", "cousin", "friend"], city: ["Seoul", "London", "Moscow", "Tashkent"] }],
  ["waiting", "At six tomorrow, I ______ (wait) for you outside the {place}.",
    { place: ["cinema", "metro", "school", "museum"] }],
  ["sleeping", "At midnight, the {who} ______ (sleep), so please come in quietly.",
    { who: ["children", "baby", "grandparents", "neighbours"] }],
  ["visiting", "At nine tomorrow morning, our class ______ (visit) the {place}.",
    { place: ["museum", "factory", "zoo", "library"] }],
  ["drinking", "At this time on {day}, my grandfather ______ (drink) tea in the teahouse with his {who}.",
    { day: ["Friday", "Sunday", "Saturday", "Monday"], who: ["friends", "neighbours", "brothers"] }],
  ["driving", "In an hour, we ______ (drive) through the {place}, so we can't use our phones.",
    { place: ["mountains", "desert", "Kamchik Pass", "valley"] }],
  ["playing", "At five o'clock, {name} ______ (play) the piano at the {event}.",
    { name: ["Malika", "Olga", "Dilnoza", "Shahzoda"], event: ["concert", "school party", "wedding", "festival"] }],
  ["lying", "At this time next {when}, I ______ (lie) on the beach.",
    { when: ["week", "month", "Sunday", "summer"] }],
  ["driving", "Tomorrow at {time}, my {who} ______ (drive) us to the airport.",
    { time: ["five", "six", "seven", "half past five"], who: ["uncle", "father", "brother", "cousin"] }],
  ["building", "At seven tomorrow, the workers ______ (build) the new {thing} in our street.",
    { thing: ["school", "shop", "café", "playground"] }],
].map(([ing, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `will be ${ing}`, why: why(`will be ${ing}`), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOWT = "Rewrite the sentence for the time in the hint.";
const PLAN = "Say what will be in progress at the time in the hint.";
const FIX = "There is a mistake with the verb. Rewrite the sentence correctly.";
const whyNow = (form) => `Now → present continuous; the same kind of moment in the future → will be + -ing: ${form}.`;
const whyPlan = (form) => `That time is in the middle of the action, so it will be in progress: ${form}.`;
const whyFix = (bad, form) => `${bad} is wrong. The future continuous needs will + be + -ing: ${form}.`;
const WHEN = ["tomorrow", "on Friday", "next Monday", "on Saturday"];
const TRANSFORM = [
  [NOWT, "I am working in the {place} now.", "At this time {when}, I ______ in the {place}.", "will be working", whyNow("will be working"),
    { place: ["office", "shop", "garden", "library"], when: WHEN }],
  [NOWT, "My {who} is cooking {food} now.", "At this time tomorrow, my {who} ______ {food}.", "will be cooking", whyNow("will be cooking"),
    { who: ["mother", "aunt", "grandmother", "sister"], food: ["plov", "manti", "lagman", "soup"] }],
  [NOWT, "We are sitting in the {place} now.", "At this time {when}, we ______ in the {place}.", "will be sitting", whyNow("will be sitting"),
    { place: ["park", "café", "garden", "classroom"], when: ["next week", "tomorrow", "on Sunday", "next month"] }],
  [NOWT, "{name} is playing {game} with his friends now.", "At this time on Saturday, {name} ______ {game} with his friends.", "will be playing", whyNow("will be playing"),
    { name: ["Bekzod", "Ilya", "Timur", "Sanjar"], game: ["chess", "football", "volleyball", "video games"] }],
  [NOWT, "The children are swimming in the {place} now.", "At this time {when}, the children ______ in the {place}.", "will be swimming", whyNow("will be swimming"),
    { place: ["river", "lake", "pool", "sea"], when: WHEN }],
  [PLAN, "Our {subject} lesson goes from ten until twelve on {day}.", "At eleven on {day}, we ______ (have) our {subject} lesson.", "will be having", whyPlan("will be having"),
    { subject: ["English", "maths", "history", "music"], day: ["Monday", "Tuesday", "Thursday", "Friday"] }],
  [PLAN, "My {who} drives to {city} from eight until twelve on Saturday.", "At ten on Saturday, my {who} ______ (drive) to {city}.", "will be driving", whyPlan("will be driving"),
    { who: ["father", "uncle", "brother", "grandfather"], city: ["Samarkand", "Bukhara", "Fergana", "Namangan"] }],
  [PLAN, "The match goes from seven until nine tonight at the {place}.", "At eight tonight, the {who} ______ (play) football at the {place}.", "will be playing", whyPlan("will be playing"),
    { who: ["boys", "girls", "students", "children"], place: ["stadium", "school", "park", "sports hall"] }],
  [PLAN, "My {who} sleeps from eleven until seven.", "At {time} in the morning, my {who} ______ (sleep).", "will be sleeping", whyPlan("will be sleeping"),
    { who: ["sister", "brother", "baby brother", "grandmother"], time: ["three", "two", "four", "five"] }],
  [PLAN, "The wedding party goes from six until midnight on {day}.", "At nine on {day}, the {who} ______ (dance).", "will be dancing", whyPlan("will be dancing"),
    { day: ["Saturday", "Sunday", "Friday", "Thursday"], who: ["guests", "young people", "children", "relatives"] }],
  [FIX, "At this time {when}, I will be work in the {place}.", "At this time {when}, I ______ in the {place}.", "will be working", whyFix("Will be work", "will be working"),
    { place: ["shop", "office", "garden", "bakery"], when: WHEN }],
  [FIX, "At {time} tonight, we will watching the {match}.", "At {time} tonight, we ______ the {match}.", "will be watching", whyFix("Will watching", "will be watching"),
    { time: ["nine", "eight", "ten", "half past nine"], match: ["match", "final", "concert", "film"] }],
  [FIX, "Don't call at {time}. {name} be studying for the test.", "Don't call at {time}. {name} ______ for the test.", "will be studying", whyFix("Be studying (no will)", "will be studying"),
    { time: ["seven", "eight", "nine", "six"], name: ["Kamola", "Anna", "Sevara", "Malika"] }],
  [FIX, "At this time on {day}, the children will be swim in the {place}.", "At this time on {day}, the children ______ in the {place}.", "will be swimming", whyFix("Will be swim", "will be swimming"),
    { day: ["Sunday", "Saturday", "Friday", "Monday"], place: ["river", "lake", "pool", "sea"] }],
  [FIX, "At noon tomorrow, my {who} will be play the piano at the {event}.", "At noon tomorrow, my {who} ______ the piano at the {event}.", "will be playing", whyFix("Will be play", "will be playing"),
    { who: ["sister", "cousin", "daughter", "friend"], event: ["concert", "school party", "wedding", "festival"] }],
].map(([instr, source, hint, key, w, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what you will be doing at this time tomorrow.", "will be + -ing at a future time", ["exactly one sentence", "at this time tomorrow", "will be + -ing"]],
  ["Write one sentence telling a friend not to call you at a certain time tomorrow, and why.", "will be + -ing as a reason", ["exactly one sentence or two", "a clock time", "will be + -ing"]],
  ["Write one sentence about what your family will be doing at eight o'clock tonight.", "will be + -ing with a clock time", ["exactly one sentence", "at eight o'clock tonight", "will be + -ing"]],
  ["Write one sentence about where you will be living this time next year.", "will be living", ["exactly one sentence", "this time next year", "will be + -ing"]],
  ["Write one sentence about what a friend will be doing on Saturday morning.", "will be + -ing with he or she", ["exactly one sentence", "must name the friend", "will be + -ing"]],
  ["Write one sentence about what you will be doing during a holiday next month.", "will be + -ing on holiday", ["exactly one sentence", "a place named", "will be + -ing"]],
  ["Write one sentence about what will be happening in your street at noon tomorrow.", "will be + -ing for a scene", ["exactly one sentence", "at noon tomorrow", "will be + -ing"]],
  ["Write two sentences: what you will be doing at 9 a.m. and at 9 p.m. tomorrow.", "two future-continuous sentences", ["exactly two sentences", "two clock times", "will be + -ing in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe tomorrow: what will you be doing at 8 a.m., at noon and at 8 p.m.? Write three or four sentences.",
    "future continuous at clock times", ["will be + -ing", "a time in each sentence", "no will + base for actions in progress"]],
  ["Imagine your perfect holiday next summer. Describe what you will be doing at this time on a normal day. Write three or four sentences.",
    "future continuous for a scene", ["will be + -ing", "a place named", "at least three actions"]],
  ["A friend wants to visit you on Saturday. Explain when you can't meet and what you will be doing. Write three or four sentences.",
    "future continuous for unavailability", ["will be + -ing", "clock times or parts of the day", "a time when you are free"]],
  ["Describe your life ten years from now. Where will you be living, and what will you be doing? Write three or four sentences.",
    "future continuous for the long term", ["will be living / working", "this time in ten years", "no will be + base"]],
  ["Describe what different people in your family will be doing at seven o'clock tomorrow evening. Write three or four sentences.",
    "future continuous with different subjects", ["will be + -ing", "at least three people", "at seven o'clock"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.future.future-continuous.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);