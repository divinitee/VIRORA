// Hand-authored: adj-adv / adverb-form / irregular-adverb (A2).
// Path fill P35 (Claude lane, branch grammar-path-fill-claude, 16 Nov 2026).
//
// Tests the placement bank's points: well is the adverb of good ("He speaks
// English very well"), and hard is both adjective and adverb ("She works very
// hard"; hardly means almost not). fast, late and early behave like hard and
// are included so the learner meets the whole small family: no fastly, and
// lately means recently.
//
// Kept apart from ly-adverb (P34): no regular -ly adverb is keyed here.
// well sentences never allow "better" (they carry very / really, or a result
// that fixes the meaning). hardly and lately are only ever wrong answers:
// their own meanings are B1 (adverb-vs-adjective-sense).
// Typed answers: the bracket cue is only used for good -> well. For hard,
// fast, late and early the choice is named in the instruction, because a key
// may not repeat a word printed in the sentence.
//
// Run: node tools/grammar-practice/authored/adj-adv.adverb-form.irregular-adverb.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "adverb-form", topic: "irregular-adverb", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const ANY = ["Aziz", "Lola", "Madina", "Timur"];
const M4 = ["Aziz", "Timur", "Bobur", "Sardor"];
const CITY = ["Tashkent", "Samarkand", "Bukhara", "Namangan"];

const KIND = {
  well: { o: ["well", "good", "goodly", "more good"], w: "Good is an adjective. Its adverb is well: you do something well." },
  hard: { o: ["hard", "hardly", "hardy", "hardily"], w: "Hard is both the adjective and the adverb. Hardly means almost not." },
  fast: { o: ["fast", "fastly", "fastily", "more fastly"], w: "Fast is both the adjective and the adverb. There is no fastly." },
  late: { o: ["late", "lately", "lated", "latly"], w: "Late is both the adjective and the adverb. Lately means recently." },
  early: { o: ["early", "earlily", "earlyly", "more early"], w: "Early is both the adjective and the adverb. It does not change." },
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["well", "{name} speaks {lang} very ______.", { name: ANY, lang: ["English", "Russian", "Korean", "Turkish"] }],
  ["well", "My {relative} cooks very ______, {name}. Come for dinner.", { relative: ["mother", "father", "aunt", "grandmother"], name: N4 }],
  ["well", "On {day}, our team played very ______ and won the {event}.", { day: ["Saturday", "Sunday", "Friday", "Monday"], event: ["match", "game", "cup", "final"] }],
  ["well", "Did you sleep ______, {name}? You look {adj}.", { name: N4, adj: ["tired", "happy", "fresh", "sleepy"] }],
  ["well", "{name} draws {things} really ______.", { name: ANY, things: ["animals", "faces", "flowers", "cars"] }],
  ["well", "I don't know {city} very ______, so I use a {thing}.", { city: ["Tashkent", "Samarkand", "Bukhara", "this city"], thing: ["map", "phone", "guide", "taxi"] }],
  ["well", "The new {device} works very ______, {name}. Thank you!", { device: ["phone", "laptop", "printer", "washing machine"], name: P4 }],
  ["hard", "{name} studies very ______ before every {exam}.", { name: ANY, exam: ["exam", "test", "competition", "interview"] }],
  ["hard", "My {relative} works ______ in the {place} all day.", { relative: ["father", "uncle", "mother", "brother"], place: ["field", "shop", "garden", "market"] }],
  ["hard", "It is raining ______ now, so wait {where}, {name}.", { where: ["inside", "here", "in the car", "at school"], name: N4 }],
  ["hard", "Try ______ and you will {result}, {name}.", { result: ["pass", "win", "finish", "learn it"], name: N4 }],
  ["hard", "The {who} trained ______ for the {event}.", { who: ["boys", "girls", "players", "team"], event: ["match", "final", "race", "tournament"] }],
  ["fast", "{name} runs very ______. Nobody in the {group} can catch him.", { name: M4, group: ["class", "team", "school", "street"] }],
  ["fast", "Don't drive so ______, {name}! The road is {adj}.", { name: P4, adj: ["wet", "narrow", "icy", "busy"] }],
  ["fast", "My {relative} talks so ______ that I can't {do}.", { relative: ["sister", "cousin", "aunt", "friend"], do: ["understand", "follow", "answer", "keep up"] }],
  ["fast", "The new {thing} goes very ______, {name}.", { thing: ["train", "bus", "bike", "boat"], name: N4 }],
  ["late", "The {bus} arrived ______ again, so I missed the {thing}.", { bus: ["bus", "train", "taxi", "minibus"], thing: ["first lesson", "meeting", "film", "test"] }],
  ["late", "{name} went to bed ______ and is very tired {when}.", { name: ANY, when: ["today", "this morning", "now", "at school"] }],
  ["early", "We got up ______ to catch the {bus} to {city}.", { bus: ["bus", "train", "plane", "minibus"], city: CITY }],
  ["early", "{name} always comes to {place} ______, before everybody else.", { name: ANY, place: ["school", "work", "training", "the lesson"] }],
].map(([k, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: KIND[k].o, key: 0, why: KIND[k].w, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const I_GOOD = "Write the adverb of the word in brackets. Careful: it does not end in -ly.";
const I_PICK = (a, b) => `Write the correct adverb: ${a} or ${b}.`;
const PAIR = { hard: "hardly", fast: "fastly", late: "lately", early: "earlily" };
const G = (source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I_GOOD, source, key: "well", why: KIND.well.w, slots });
const P = (k, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: I_PICK(k, PAIR[k]), source, key: k, why: KIND[k].w, slots });
const BUILD = [
  G("{name} plays the {inst} very ______ (good).", { name: ANY, inst: ["piano", "guitar", "dutar", "violin"] }),
  G("I can't see ______ (good) without my glasses, {name}.", { name: P4 }),
  G("My {relative} knows {city} ______ (good). He was born there.", { relative: ["father", "uncle", "grandfather", "brother"], city: CITY }),
  G("The {event} went ______ (good), {name}. Everybody was happy.", { event: ["party", "meeting", "concert", "trip"], name: N4 }),
  G("{name} did ______ (good) in the {test} and got a {mark}.", { name: ANY, test: ["test", "exam", "competition", "quiz"], mark: ["five", "prize", "top mark", "medal"] }),
  G("Listen ______ (good), {who}. I will say this only once.", { who: ["children", "everyone", "class", "boys"] }),
  G("This {thing} doesn't work very ______ (good) in {cond}.", { thing: ["phone", "car", "bike", "radio"], cond: ["winter", "the cold", "bad weather", "the rain"] }),
  G("You speak {lang} really ______ (good), {name}.", { lang: ["Uzbek", "Russian", "English", "Korean"], name: N4 }),
  P("hard", "{name} works very ______ at the {place}.", { name: ANY, place: ["bakery", "hospital", "farm", "market"] }),
  P("hard", "It snowed ______ all {time}, {name}.", { time: ["night", "day", "morning", "weekend"], name: P4 }),
  P("hard", "You must push the {thing} ______ to open it, {name}.", { thing: ["door", "gate", "window", "box"], name: N4 }),
  P("hard", "The {who} are studying ______ for the {exam}.", { who: ["students", "boys", "girls", "twins"], exam: ["exams", "test", "final test", "competition"] }),
  P("hard", "{name} hit the ball ______, and it flew over the {thing}.", { name: ANY, thing: ["wall", "fence", "net", "goal"] }),
  P("fast", "The {thing} is going too ______, {name}.", { thing: ["bus", "car", "taxi", "train"], name: P4 }),
  P("fast", "{name} learns new {things} very ______.", { name: ANY, things: ["words", "songs", "games", "rules"] }),
  P("fast", "Time goes ______ when you are {doing}, {name}.", { doing: ["on holiday", "with friends", "busy", "happy"], name: N4 }),
  P("fast", "Eat ______, {name}! The {bus} leaves in five minutes.", { name: N4, bus: ["bus", "train", "taxi", "minibus"] }),
  P("late", "{name} came home ______ last night, at {time}.", { name: ANY, time: ["midnight", "eleven", "half past eleven", "one o'clock"] }),
  P("late", "The {show} started ______ because of the {reason}.", { show: ["concert", "match", "film", "lesson"], reason: ["rain", "traffic", "snow", "weather"] }),
  P("early", "The {shop} opens ______ on {day}, at six o'clock.", { shop: ["bakery", "market", "bazaar", "cafe"], day: ["Sundays", "Mondays", "Saturdays", "Fridays"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const VERB = "Say the same thing with a verb and an adverb.";
const FIX = "Correct the adverb.";
const SAME = "Finish the second sentence so it means the same. Use an adverb.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // adjective + noun -> verb + adverb (5)
  T(VERB, "{name} is a good singer, {voc}.", "{name} sings ______, {voc}.", "well", "A good singer sings well. Good describes the person, well describes the action.",
    { name: ANY, voc: P4 }),
  T(VERB, "My {relative} is a hard worker, {name}.", "My {relative} works ______, {name}.", "hard", "A hard worker works hard. The adverb has the same form as the adjective.",
    { relative: ["father", "mother", "uncle", "aunt"], name: N4 }),
  T(VERB, "{name} is a fast runner, {voc}.", "{name} runs ______, {voc}.", "fast", "A fast runner runs fast. The adverb has the same form as the adjective.",
    { name: ANY, voc: ["Mum", "Dad", "Grandma", "Olga"] }),
  T(VERB, "Our {person} is a good cook, {name}.", "Our {person} cooks ______, {name}.", "well", "A good cook cooks well. Good describes the person, well describes the action.",
    { person: ["neighbour", "aunt", "grandfather", "uncle"], name: N4 }),
  T(VERB, "The {who} are fast learners, {name}.", "The {who} learn ______, {name}.", "fast", "Fast learners learn fast. The adverb has the same form as the adjective.",
    { who: ["children", "new students", "twins", "girls"], name: P4 }),
  // correct the adverb (5)
  T(FIX, "{name} speaks {lang} very good.", "{name} speaks {lang} very ______.", "well", KIND.well.w,
    { name: ANY, lang: ["English", "Russian", "Korean", "German"] }),
  T(FIX, "{name}, she works very hardly every {day}.", "{name}, she works very ______ every {day}.", "hard", KIND.hard.w,
    { name: N4, day: ["day", "morning", "weekend", "summer"] }),
  T(FIX, "The {thing} goes very fastly, {name}.", "The {thing} goes very ______, {name}.", "fast", KIND.fast.w,
    { thing: ["new train", "bus", "car", "boat"], name: N4 }),
  T(FIX, "The {bus} came lately again, {name}.", "The {bus} came ______ again, {name}.", "late", KIND.late.w,
    { bus: ["bus", "train", "taxi", "minibus"], name: P4 }),
  T(FIX, "My {relative} drives good in the {place}.", "My {relative} drives ______ in the {place}.", "well", KIND.well.w,
    { relative: ["mother", "sister", "aunt", "father"], place: ["city", "mountains", "rain", "snow"] }),
  // same meaning, new sentence (5)
  T(SAME, "{name}'s English is good, {voc}.", "{name} speaks English ______, {voc}.", "well", "Good English means you speak English well.",
    { name: ANY, voc: P4 }),
  T(SAME, "My {relative} has a hard job at the {place}.", "My {relative} works ______ at the {place}.", "hard", "A hard job means you work hard. The adverb has the same form as the adjective.",
    { relative: ["father", "uncle", "brother", "aunt"], place: ["factory", "farm", "market", "hospital"] }),
  T(SAME, "{name}'s answers in the {test} were good.", "{name} answered ______ in the {test}.", "well", "Good answers mean you answered well.",
    { name: ANY, test: ["test", "exam", "quiz", "interview"] }),
  T(SAME, "The {thing} is fast, {name}.", "The {thing} moves ______, {name}.", "fast", "Something fast moves fast. The adverb has the same form as the adjective.",
    { thing: ["train", "river", "car", "boat"], name: N4 }),
  T(SAME, "We had an early start on {day}, {name}.", "We started ______ on {day}, {name}.", "early", "An early start means you started early. The adverb has the same form as the adjective.",
    { day: ["Monday", "Saturday", "Sunday", "Friday"], name: N4 }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you do well.", "an action verb + well", ["exactly one sentence", "must be about you", "must use well, not good"]],
  ["Write one sentence about a person who works or studies hard.", "works hard or studies hard", ["exactly one sentence", "must name a person", "must use hard, not hardly"]],
  ["Write one sentence about someone who runs, talks or drives fast.", "an action verb + fast", ["exactly one sentence", "must use fast", "must not use fastly"]],
  ["Write one sentence about a day when you got up early or went to bed late.", "got up early or went to bed late", ["exactly one sentence", "must use early or late", "past tense"]],
  ["Write one sentence about how well you speak another language.", "speak + a language + well", ["exactly one sentence", "must name a language", "must use well"]],
  ["Write one sentence with good and one with well about the same person.", "good as an adjective, well as an adverb", ["exactly two sentences", "good before a noun or after be", "well after an action verb"]],
  ["A friend wrote: \"My brother drives very good but too fastly.\" Write the sentence correctly.", "drives very well but too fast", ["exactly one sentence", "must use well", "must use fast"]],
  ["Write one sentence of advice for a student before an exam. Use hard or early.", "study hard or go to bed early", ["exactly one sentence", "must be advice", "must use hard or early"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What can you do well, and what can't you do well yet? Write three or four sentences.",
    "action verbs with well", ["well after the verb or object", "no good in place of well", "at least two different verbs"]],
  ["Describe a person you know who works very hard. What do they do? Write three or four sentences.",
    "work hard, start early, finish late", ["hard, not hardly", "early or late", "the adverb after the verb"]],
  ["Describe your school day or work day. When do you get up, how do you work, when do you finish? Write three or four sentences.",
    "early, late, hard, fast, well", ["early or late", "hard or fast", "no fastly or hardly"]],
  ["Who is the best sports player you know? How do they play, run or train? Write three or four sentences.",
    "action verbs with well, fast and hard", ["plays well", "runs fast or trains hard", "adverbs, not adjectives"]],
  ["Give advice to a new student who wants to learn English well. Write three or four sentences.",
    "well, hard, early", ["speak or learn well", "study or work hard", "no good in place of well"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.adverb-form.irregular-adverb.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
