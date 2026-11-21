// Hand-authored: pronouns / reflexive / no-reflexive-after-feel (B1).
// Wave C, C21 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: verbs that take NO reflexive in English although Russian
// marks them with -ся / себя and Uzbek with -lan / -in / o'zini: feel
// ("чувствую себя" → "feel myself"), relax (расслабиться), concentrate
// (сосредоточиться), meet (встретиться), and the -ся verbs about things:
// start, open, finish, close (начаться, открыться …), return (вернуться),
// hurry (торопиться).
// Siblings: reflexive-object (C23) keys myself when subject = object;
// reciprocal (C22) keys each other. Neither is keyed or offered here.
// Never offered as wrong: "each other" after meet (We met each other is
// English), negative feel + reflexive ("I don't feel myself today" is an
// idiom), wake / get / sit / calm / behave / worry + reflexive (all said).
// Choose: 6 feel, 3 relax, 3 concentrate, 2 meet, 4 start / open / finish,
// 1 come back, 1 hurry. Options: verb / verb + reflexive / verb + object
// pronoun / reflexive before the verb (or a wrong passive).
// Build: Rule 11 means no typed "nothing", so build types the verb in the
// right form from a bracket cue (every key differs from its cue: -s or past).
// Transform: 10 correct the mistake (drop the reflexive) / 5 make it past.
//
// Run: node tools/grammar-practice/authored/pronouns.reflexive.no-reflexive-after-feel.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "reflexive", topic: "no-reflexive-after-feel", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const PLACE = ["café", "bazaar", "station", "park"];
const H = ["six", "seven", "eight", "nine"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_FEEL = "In English, feel, relax and concentrate take no myself / yourself: I feel tired, Relax!, I can't concentrate. (Russian says чувствую себя, but English does not.)";
const W_MEET = "meet needs no reflexive: We met at the café. (встретиться has -ся, English meet has nothing.)";
const W_THING = "When a thing starts, opens, finishes or closes by itself, English uses the verb alone: The film starts at seven. Never starts itself.";
const W_MOVE = "come back, return and hurry take no reflexive in English: I came back from Bukhara. Hurry up!";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [["feel", "feel myself", "feel me", "myself feel"], W_FEEL, "I ______ much better today, {name}. Thanks for the {thing}.", { name: NAME, thing: ["soup", "tea", "medicine", "flowers"] }],
  [["feel", "feel yourself", "feel you", "yourself feel"], W_FEEL, "Do you ______ OK, {name}? You look {adj}.", { name: NAME, adj: ["pale", "tired", "sad", "worried"] }],
  [["felt", "felt myself", "felt me", "was felt"], W_FEEL, "After the {thing}, I ______ very tired, {name}.", { thing: ["match", "trip", "exam", "wedding"], name: NAME }],
  [["felt", "felt herself", "felt her", "herself felt"], W_FEEL, "My grandma ______ sick {when}, so she stayed in {place}.", { when: PAST, place: ["bed", "her room", "the hotel", "her flat"] }],
  [["feel", "feel myself", "feel me", "am feel"], W_FEEL, "I always ______ nervous before an {thing}, {name}.", { thing: ["exam", "interview", "operation", "important match"], name: NAME }],
  [["feel", "feel yourself", "feel you", "yourself feel"], W_FEEL, "How do you ______ {when}, {name}?", { when: ["today", "now", "after the run", "this morning"], name: NAME }],
  [["relax", "relax yourself", "relax you", "yourself relax"], W_FEEL, "Sit down and ______, {name}. The {show} starts in an hour.", { name: NAME, show: ["film", "match", "lesson", "concert"] }],
  [["relaxed", "relaxed ourselves", "relaxed us", "ourselves relaxed"], W_FEEL, "On {day} we ______ at home and watched {show}.", { day: ["Sunday", "Saturday", "Friday", "Monday"], show: ["films", "cartoons", "football", "the news"] }],
  [["relax", "relax myself", "relax me", "myself relax"], W_FEEL, "I can't ______ in this noisy {place}, {name}.", { place: ["room", "café", "hotel", "flat"], name: NAME }],
  [["concentrate", "concentrate myself", "concentrate me", "myself concentrate"], W_FEEL, "I can't ______ on my {work} when the TV is on, {name}.", { work: ["homework", "essay", "reading", "project"], name: NAME }],
  [["concentrate", "concentrate yourself", "concentrate you", "yourself concentrate"], W_FEEL, "Please ______ on the {task}, {name}.", { task: ["test", "question", "road", "game"], name: NAME }],
  [["concentrated", "concentrated myself", "concentrated me", "was concentrated"], W_FEEL, "In the {test} I ______ hard and did well, {name}.", { test: ["exam", "test", "quiz", "maths test"], name: NAME }],
  [["meet", "meet ourselves", "meet us", "ourselves meet"], W_MEET, "Let's ______ at the {place} at {h}.", { place: PLACE, h: H }],
  [["met", "met ourselves", "met us", "ourselves met"], W_MEET, "{name} and I first ______ at a {event} {when}.", { name: NAME, event: ["wedding", "party", "concert", "conference"], when: ["last year", "two years ago", "in May", "in 2020"] }],
  [["starts", "starts itself", "starts it", "itself starts"], W_THING, "The {show} ______ at seven, {name}.", { show: ["film", "match", "concert", "lesson"], name: NAME }],
  [["opens", "opens itself", "opens it", "itself opens"], W_THING, "The {place} ______ at nine and closes at {h}.", { place: ["bank", "bazaar", "library", "post office"], h: ["five", "six", "seven", "eight"] }],
  [["finished", "finished itself", "finished it", "itself finished"], W_THING, "The {thing} ______ at {h} {when}.", { thing: ["lesson", "meeting", "party", "concert"], h: ["ten", "eleven", "nine", "eight"], when: PAST }],
  [["opened", "opened itself", "opened it", "itself opened"], W_THING, "Suddenly the {room} door ______ and {who} came in.", { room: ["kitchen", "classroom", "office", "bedroom"], who: ["my uncle", "the teacher", "a young man", "the doctor"] }],
  [["came back", "came myself back", "returned myself", "came back me"], W_MOVE, "I ______ from {city} {when}, {name}.", { city: CITY, when: PAST, name: NAME }],
  [["hurry", "hurry ourselves", "hurry us", "ourselves hurry"], W_MOVE, "We must ______, {name}. The {transport} leaves in five minutes.", { name: NAME, transport: ["bus", "train", "taxi", "minibus"] }],
].map(([opts, why, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in the right form.";
const BUILD = [
  ["feels", W_FEEL, "Thanks for the {thing}, {name}. Grandma ______ (feel) much better now.", { thing: ["soup", "tea", "medicine", "flowers"], name: NAME }, ["is feeling"]],
  ["felt", W_FEEL, "After the long {trip} {when}, we ______ (feel) very tired.", { trip: ["trip", "walk", "flight", "drive"], when: PAST }, ["were feeling"]],
  ["felt", W_FEEL, "My {who} ______ (feel) sick yesterday, so she stayed in {place}.", { who: ["sister", "mum", "aunt", "grandma"], place: ["bed", "her room", "the hotel", "her flat"] }, ["was feeling"]],
  ["feels", W_FEEL, "My cousin always ______ (feel) nervous before an {thing}, {name}.", { thing: ["exam", "interview", "operation", "important match"], name: NAME }, []],
  ["relaxes", W_FEEL, "Every {day} evening my dad ______ (relax) in the {place}.", { day: ["Friday", "Sunday", "Saturday", "Monday"], place: ["garden", "park", "yard", "living room"] }, []],
  ["relaxed", W_FEEL, "We ______ (relax) on the beach all day {when}, {name}.", { when: ["yesterday", "on Sunday", "last Saturday", "on our holiday"], name: NAME }, ["were relaxing"]],
  ["relaxes", W_FEEL, "After {time}, my mum ______ (relax) with a cup of {drink}.", { time: ["work", "dinner", "lunch", "school"], drink: ["tea", "coffee", "cocoa", "green tea"] }, []],
  ["concentrates", W_FEEL, "My brother ______ (concentrate) better in the {time}, {name}.", { time: ["morning", "evening", "afternoon", "library"], name: NAME }, []],
  ["concentrated", W_FEEL, "In the {test} {when}, I ______ (concentrate) and got a good mark.", { test: ["exam", "test", "quiz", "maths test"], when: PAST }, []],
  ["met", W_MEET, "We first ______ (meet) at a {event} in {city}.", { event: ["wedding", "party", "concert", "conference"], city: CITY }, []],
  ["meets", W_MEET, "Our group ______ (meet) at the {place} every {day}.", { place: PLACE, day: ["Monday", "Tuesday", "Friday", "Saturday"] }, []],
  ["starts", W_THING, "The {show} ______ (start) at seven every {day}.", { show: ["film", "news", "show", "cartoon"], day: ["Monday", "Tuesday", "Friday", "evening"] }, []],
  ["started", W_THING, "The {event} ______ (start) late {when}, so we waited.", { event: ["concert", "match", "wedding", "lesson"], when: PAST }, []],
  ["opened", W_THING, "The {place} ______ (open) at nine {when}.", { place: ["bank", "bazaar", "library", "museum"], when: ["yesterday", "on Monday", "last Friday", "this morning"] }, []],
  ["opened", W_THING, "Suddenly the {room} door ______ (open) and {who} came in.", { room: ["kitchen", "classroom", "office", "bedroom"], who: ["my uncle", "the teacher", "a young man", "the doctor"] }, []],
  ["finished", W_THING, "The {thing} ______ (finish) late last night, {name}.", { thing: ["party", "concert", "match", "meeting"], name: NAME }, []],
  ["finishes", W_THING, "The lesson ______ (finish) at {h} every day, {name}.", { h: ["two", "three", "four", "five"], name: NAME }, []],
  ["closes", W_THING, "The {shop} ______ (close) at {h} on Sundays.", { shop: ["shop", "bakery", "pharmacy", "café"], h: ["two", "four", "five", "six"] }, []],
  ["returned", W_MOVE, "My dad ______ (return) from {city} {when}.", { city: CITY, when: PAST }, ["came back"]],
  ["hurried", W_MOVE, "We ______ (hurry) to the {place} because we were late {when}.", { place: ["station", "airport", "lesson", "cinema"], when: PAST }, []],
].map(([key, why, source, slots, acceptable]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, two kinds ---------------- */
const COR = "Correct the mistake.";
const PST = "Make it past.";
const TRANSFORM = [
  // correct the mistake (10)
  [COR, "I feel myself very tired after the {trip}, {name}.", "I ______ very tired after the {trip}, {name}.", "feel", W_FEEL, { trip: ["trip", "walk", "flight", "drive"], name: NAME }, ["am feeling", "felt"]],
  [COR, "Do you feel yourself better {when}, {name}?", "Do you ______ better {when}, {name}?", "feel", W_FEEL, { when: ["today", "now", "this morning", "after the tea"], name: NAME }, []],
  [COR, "We relaxed ourselves at the {place} {when}.", "We ______ at the {place} {when}.", "relaxed", W_FEEL, { place: ["lake", "beach", "park", "river"], when: PAST }, ["were relaxing"]],
  [COR, "I can't concentrate myself on the {task}, {name}.", "I can't ______ on the {task}, {name}.", "concentrate", W_FEEL, { task: ["test", "question", "homework", "game"], name: NAME }, []],
  [COR, "Let's meet ourselves at the {place} at {h}.", "Let's ______ at the {place} at {h}.", "meet", W_MEET, { place: PLACE, h: H }, []],
  [COR, "The {show} starts itself at {h}, {name}.", "The {show} ______ at {h}, {name}.", "starts", W_THING, { show: ["film", "match", "concert", "lesson"], h: H, name: NAME }, []],
  [COR, "The {place} opens itself at nine every {day}.", "The {place} ______ at nine every {day}.", "opens", W_THING, { place: ["bank", "bazaar", "library", "museum"], day: ["Monday", "Tuesday", "Saturday", "day"] }, []],
  [COR, "The {event} finished itself very late {when}.", "The {event} ______ very late {when}.", "finished", W_THING, { event: ["party", "concert", "match", "meeting"], when: PAST }, []],
  [COR, "My {who} returned himself from {city} yesterday.", "My {who} ______ from {city} yesterday.", "returned", W_MOVE, { who: ["dad", "uncle", "brother", "grandpa"], city: CITY }, ["came back"]],
  [COR, "Hurry yourself, {name}! The {transport} is leaving.", "______, {name}! The {transport} is leaving.", "Hurry", W_MOVE, { name: NAME, transport: ["bus", "train", "taxi", "minibus"] }, ["Hurry up"]],
  // make it past (5)
  [PST, "I feel very tired after the {thing}.", "I ______ very tired after the {thing} {when}.", "felt", W_FEEL, { thing: ["match", "trip", "exam", "wedding"], when: PAST }, ["was feeling"]],
  [PST, "We relax at the {place} on Sundays, {name}.", "We ______ at the {place} last Sunday, {name}.", "relaxed", W_FEEL, { place: ["lake", "beach", "park", "river"], name: NAME }, ["were relaxing"]],
  [PST, "The {show} starts at seven, {name}.", "The {show} ______ at seven yesterday, {name}.", "started", W_THING, { show: ["film", "match", "concert", "lesson"], name: NAME }, []],
  [PST, "We meet at the {place}, {name}.", "We ______ at the {place} {when}, {name}.", "met", W_MEET, { place: PLACE, when: PAST, name: NAME }, []],
  [PST, "I concentrate well in the {test}, {name}.", "I ______ well in the {test} {when}, {name}.", "concentrated", W_FEEL, { test: ["exam", "test", "quiz", "match"], when: PAST, name: NAME }, []],
].map(([instr, source, hint, key, why, slots, acceptable]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about how you feel today.", "I feel … today.", ["exactly one sentence", "feel with no myself", "an adjective after feel"]],
  ["Write one sentence about how you relax at the weekend.", "At the weekend I relax by …", ["exactly one sentence", "relax with no myself", "a present verb"]],
  ["Write one sentence about where you can't concentrate.", "I can't concentrate when …", ["exactly one sentence", "concentrate with no myself", "can't"]],
  ["Write one sentence inviting a friend to meet you.", "Let's meet at … at …", ["exactly one sentence", "meet with no ourselves", "a place and a time"]],
  ["Write one sentence about when a film or lesson starts.", "The … starts at …", ["exactly one sentence", "starts with no itself", "a time"]],
  ["Write one sentence about how you felt after a long day.", "After …, I felt …", ["exactly one sentence", "felt with no myself", "a past time"]],
  ["Write one sentence about when a shop near you opens and closes.", "The … opens at … and closes at …", ["exactly one sentence", "opens / closes with no itself", "two times"]],
  ["Write one sentence telling a friend to hurry.", "Hurry up! The … is leaving.", ["one or two short sentences", "hurry with no yourself", "a reason"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe how you felt before and after an exam.", "Before the exam I felt … I couldn't concentrate … After it I relaxed …", ["feel / relax / concentrate with no reflexive", "past verbs", "three or four sentences"]],
  ["Describe your perfect relaxing evening.", "I come back home … I relax … I feel …", ["relax and feel with no myself", "present verbs", "three or four sentences"]],
  ["Write a message to a friend about meeting this weekend.", "Let's meet at … The film starts at … Don't be late, hurry …", ["meet / start with no reflexive", "a place and a time", "three or four sentences"]],
  ["Describe a day when you were ill.", "I felt terrible … I stayed in bed … I couldn't concentrate …", ["feel with no myself", "past verbs", "three or four sentences"]],
  ["Describe a busy morning when you were late.", "I woke up late … I hurried … The lesson started …", ["hurry / start with no reflexive", "past verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.reflexive.no-reflexive-after-feel.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "Saying how you are now: feel, no myself.",
   "\"You look …\": asking about now: feel.",
   "\"After the …\": past: felt, no myself.",
   "Past (\"so she stayed\"): felt.",
   "\"always\": habit: feel, no myself.",
   "Asking how someone is: feel.",
   "\"Sit down and …\": relax, no yourself.",
   "\"On … we\": past: relaxed, no ourselves.",
   "\"this noisy …\": can't + relax.",
   "\"when the TV is on\": can't + concentrate, no myself.",
   "Asking someone to focus: concentrate on.",
   "Past (\"did well\"): concentrated.",
   "\"Let's\": meet, no ourselves.",
   "\"first … at a …\": past: met.",
   "Timetable: starts, no itself.",
   "Timetable: opens, no itself.",
   "Past: finished, no itself.",
   "\"Suddenly … came in\": past: opened.",
   "Past: came back, no myself.",
   "\"leaves in five minutes\": we must hurry."
  ],
  "build": [
   "Grandma now: feels, no herself.",
   "\"After the long …\": felt.",
   "\"yesterday\" is past time: felt.",
   "\"always\" + my cousin: feels.",
   "\"Every … evening\" + my dad: relaxes.",
   "Past (\"all day\"): relaxed.",
   "Habit + my mum: relaxes.",
   "Habit + my brother: concentrates.",
   "Past: concentrated, no myself.",
   "\"first\" points to the past: met.",
   "\"every …\" + our group: meets.",
   "\"every …\" + the show: starts.",
   "\"so we waited\": past: started.",
   "Past: opened, no itself.",
   "\"Suddenly … came in\" is past: opened.",
   "\"last night\" is past time: finished.",
   "\"every day\" + the lesson: finishes.",
   "\"on Sundays\" + the shop: closes.",
   "Past: returned, no himself.",
   "\"because we were late\": hurried."
  ],
  "transform": [
   "feel needs no myself: I feel tired.",
   "feel needs no yourself: Do you feel better?",
   "relax needs no ourselves: We relaxed.",
   "concentrate needs no myself: concentrate on.",
   "meet needs no ourselves: Let's meet.",
   "start needs no itself: starts.",
   "open needs no itself: opens.",
   "finish needs no itself: finished.",
   "return needs no himself: returned.",
   "hurry needs no yourself: Hurry!",
   "Now in the past: feel → felt.",
   "\"last Sunday\": relax → relaxed.",
   "\"yesterday\": start → started.",
   "Past time: meet → met.",
   "Past time: concentrate → concentrated."
  ]
 }
};
{
  const byStage = (st) => items.filter((it) => it.stage === st);
  for (const [st, list] of Object.entries(VARIETY.why || {})) {
    if (list.length !== byStage(st).length) throw new Error(`VARIETY: ${st} has ${byStage(st).length} items, ${list.length} whys`);
    byStage(st).forEach((it, i) => { if (list[i]) it.why = list[i]; });
  }
  for (const [st, n, word, name, vals] of VARIETY.slot || []) {
    const it = byStage(st)[n - 1];
    if (!word) { if (!it?.slots?.[name]) throw new Error(`VARIETY: no slot ${name} in ${st} ${n}`); it.slots[name] = [...new Set([...it.slots[name], ...vals])]; continue; }
    const re = new RegExp(`(?<![\\w{])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w}])`, "g");
    let hit = false;
    for (const f of ["prompt", "source", "hint"]) if (it?.[f] && re.test(it[f])) { it[f] = it[f].replace(re, `{${name}}`); hit = true; re.lastIndex = 0; }
    if (!hit) throw new Error(`VARIETY: "${word}" not found in ${st} ${n}`);
    it.slots = { ...(it.slots || {}), [name]: vals };
  }
}
// end variety
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);