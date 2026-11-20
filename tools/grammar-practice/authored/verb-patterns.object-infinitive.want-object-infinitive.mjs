// Hand-authored: verb-patterns / object-infinitive / want-object-infinitive (B1).
// Wave C, C27 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item): want + person + to + base verb ("My teacher wants
// me to write the essay again"). The errors are the Uzbek / Russian "want that …"
// (хочу, чтобы / … deb xohlayman), the -ing form, and no "to".
// Triage: kept. A2 want-infinitive owns want + to (I want to go); here there is always a
// second person. would like + person + to is included (same pattern); tell / ask + person
// + to belong to reported-speech.tell-sb-to.
// Choose: person + to + base / that + subject + base / person + -ing / person + base.
// Build: the person (object pronoun) + to + verb, cue "(I / write)". No source prints
// "to" or the object pronoun.
// Transform: 5 correct "want that" / 5 a request → wants / wanted + person + to /
// 5 would like + person + to.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/verb-patterns.object-infinitive.want-object-infinitive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "object-infinitive", topic: "want-object-infinitive", level: "B1", pv: "2.5" };
const NAME = ["Malika", "Ulugbek", "Gulnora", "Sardor"];
const NAME2 = ["Zarina", "Jamshid", "Dilnoza", "Otabek"];
const SUBJ = { me: "I", you: "you", him: "he", her: "she", us: "we", them: "they" };
const ING = (v) => (v.endsWith("e") && !v.endsWith("ee") ? v.slice(0, -1) : v) + "ing";
const O = (obj, v, ing = ING(v)) => [`${obj} to ${v}`, `that ${SUBJ[obj] || obj} ${v}`, `${obj} ${ing}`, `${obj} ${v}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O("me", "write"), "My teacher wants ______ the {text} again, {name}.", { text: ["essay", "letter", "test", "story"], name: NAME }, "want + the person (me) + to + base: me to write."],
  [O("us", "come"), "Grandma wants ______ for dinner on {day}, {name}.", { day: ["Sunday", "Friday", "Navruz", "Saturday"], name: NAME2 }, "Grandma wants something from us: us to come."],
  [O("him", "study"), "His parents want ______ {subject} at university.", { subject: ["medicine", "law", "economics", "IT"], x: [] }, "want + him + to + base: him to study (not \"that he study\")."],
  [O("you", "help"), "I want ______ me with the {thing}, {name}.", { thing: ["bags", "homework", "cooking", "boxes"], name: NAME }, "want + you + to + base: you to help."],
  [O("her", "sing"), "Everyone at the {event} wanted ______ a song.", { event: ["wedding", "party", "concert", "dinner"], x: [] }, "wanted + her + to + base: her to sing."],
  [O("them", "be", "being"), "The coach wants ______ on time for the {event}, {name}.", { event: ["training", "match", "trip", "meeting"], name: NAME2 }, "want + them + to + base: them to be."],
  [O("me", "call", "calling"), "Mum wants ______ her when I get to {city}, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], name: NAME }, "want + me + to + base: me to call."],
  [O("us", "wear"), "Our school wants ______ a {uniform} every day.", { uniform: ["uniform", "white shirt", "tie", "blue jacket"], x: [] }, "want + us + to + base: us to wear."],
  [O("him", "stay"), "The doctor wants ______ in bed for {n} days.", { n: ["three", "two", "five", "four"], x: [] }, "want + him + to + base: him to stay."],
  [O("you", "meet"), "I'd like ______ my {who}, {name}.", { who: ["parents", "sister", "best friend", "grandfather"], name: NAME2 }, "would like + you + to + base: you to meet."],
  [O("me", "go"), "My dad doesn't want ______ to the {event} alone, {name}.", { event: ["concert", "party", "match", "festival"], name: NAME }, "doesn't want + me + to + base: me to go."],
  [O("her", "cook"), "Her brothers always want ______ {food} for them.", { food: ["plov", "manti", "soup", "samsa"], x: [] }, "want + her + to + base: her to cook."],
  [O("us", "read"), "The {who} wants ______ two books this month, {name}.", { who: ["teacher", "librarian", "tutor", "coach"], name: NAME2 }, "want + us + to + base: us to read."],
  [O("them", "clean"), "Mum wants ______ their {room} before the guests come.", { room: ["room", "toys", "desks", "shoes"], x: [] }, "want + them + to + base: them to clean."],
  [O("you", "know", "knowing"), "I want ______ the truth about the {thing}, {name}.", { thing: ["money", "test", "accident", "party"], name: NAME }, "want + you + to + base: you to know."],
  [O("him", "drive"), "His wife doesn't want ______ at night on the {road}.", { road: ["motorway", "mountain road", "ring road", "old road"], x: [] }, "doesn't want + him + to + base: him to drive."],
  [O("me", "send"), "The {who} wanted ______ the photos by email, {name}.", { who: ["manager", "teacher", "client", "photographer"], name: NAME2 }, "wanted + me + to + base: me to send."],
  [O("us", "visit"), "Our cousins in {city} want ______ them in summer.", { city: ["Fergana", "Andijan", "Nukus", "Termez"], x: [] }, "want + us + to + base: us to visit."],
  [O("her", "learn"), "Her parents would like ______ {lang}, {name}.", { lang: ["English", "Korean", "German", "Chinese"], name: NAME }, "would like + her + to + base: her to learn."],
  [O("you", "try"), "We'd like ______ our new {food}, {name}.", { food: ["cake", "soup", "bread", "coffee"], name: NAME2 }, "would like + you + to + base: you to try."],
].map(([o, prompt, slots, why], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete with the person + to + verb. The words in brackets are the person and the verb.";
// [key, source, slots] — no source prints "to" or the key pronoun
const BUILD = [
  ["me to write", "My teacher wants ______ (I / write) a longer {text}, {name}.", { text: ["essay", "story", "letter", "report"], name: NAME }],
  ["us to come", "Grandma wants ______ (we / come) on {day}, {name}.", { day: ["Sunday", "Friday", "Navruz", "Saturday"], name: NAME2 }],
  ["him to study", "His dad wants ______ (he / study) {subject}.", { subject: ["medicine", "law", "economics", "IT"], x: [] }],
  ["you to help", "I want ______ (you / help) with the {thing}, {name}.", { thing: ["bags", "cooking", "boxes", "party"], name: NAME }],
  ["her to sing", "The guests wanted ______ (she / sing) at the {event}.", { event: ["wedding", "party", "concert", "dinner"], x: [] }],
  ["them to be", "The coach wants ______ (they / be) ready at {time}, {name}.", { time: ["six", "seven", "eight", "nine"], name: NAME2 }],
  ["me to call", "Mum wants ______ (I / call) her from {city}, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], name: NAME }],
  ["us to wear", "The school wants ______ (we / wear) a {uniform}.", { uniform: ["uniform", "white shirt", "tie", "blue jacket"], x: [] }],
  ["him to stay", "The doctor wants ______ (he / stay) at home for {n} days.", { n: ["three", "two", "five", "four"], x: [] }],
  ["you to meet", "I'd like ______ (you / meet) my {who}, {name}.", { who: ["parents", "sister", "best friend", "grandfather"], name: NAME2 }],
  ["me to go", "Dad doesn't want ______ (I / go) to the {event} alone, {name}.", { event: ["concert", "party", "match", "festival"], name: NAME }],
  ["her to cook", "Her brothers want ______ (she / cook) {food} again.", { food: ["plov", "manti", "soup", "samsa"], x: [] }],
  ["us to read", "The {who} wants ______ (we / read) a book a month, {name}.", { who: ["teacher", "librarian", "tutor", "coach"], name: NAME2 }],
  ["them to clean", "Mum wants ______ (they / clean) the {room} now.", { room: ["kitchen", "garden", "car", "living room"], x: [] }],
  ["you to know", "I want ______ (you / know) about the {thing}, {name}.", { thing: ["problem", "plan", "change", "party"], name: NAME }],
  ["him to drive", "His wife doesn't want ______ (he / drive) on the {road} at night.", { road: ["motorway", "mountain road", "ring road", "old road"], x: [] }],
  ["me to send", "The {who} wanted ______ (I / send) the photos, {name}.", { who: ["manager", "teacher", "client", "photographer"], name: NAME2 }],
  ["us to visit", "Our cousins want ______ (we / visit) them in {city}.", { city: ["Fergana", "Andijan", "Nukus", "Termez"], x: [] }],
  ["her to learn", "Her parents would like ______ (she / learn) {lang}, {name}.", { lang: ["English", "Korean", "German", "Chinese"], name: NAME }],
  ["you to try", "We'd like ______ (you / try) our {food}, {name}.", { food: ["cake", "soup", "bread", "coffee"], name: NAME2 }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  const [obj, , verb] = key.split(" ");
  const why = `want / would like + the person as an object (${obj}, not ${SUBJ[obj]}) + to + base: ${key}.`;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const REQ = "Rewrite with want / wanted + person + to.";
const LIKE = "Rewrite with would like + person + to.";
const TRANSFORM = [
  [FIX, "My parents want that I study {subject}, {name}.", "My parents want ______ {subject}, {name}.", "me to study", { subject: ["medicine", "law", "economics", "IT"], name: NAME }, "want + me + to + base, not \"want that I …\"."],
  [FIX, "I want that you come to the {event}, {name}.", "I want ______ to the {event}, {name}.", "you to come", { event: ["wedding", "party", "match", "concert"], name: NAME2 }, "want + you + to + base: you to come."],
  [FIX, "The teacher wants us reading more {thing}, {name}.", "The teacher wants ______ more {thing}, {name}.", "us to read", { thing: ["books", "stories", "newspapers", "poems"], name: NAME }, "want + us + to + base, not -ing."],
  [FIX, "Mum wanted me help her in the {room}.", "Mum wanted ______ her in the {room}, {name}.", "me to help", { room: ["kitchen", "garden", "shop", "yard"], name: NAME2 }, "want + me + to + base: don't forget \"to\"."],
  [FIX, "Our boss wants we finish the {work} today, {name}.", "Our boss wants ______ the {work} today, {name}.", "us to finish", { work: ["report", "project", "order", "plan"], name: NAME2 }, "After want, the person is an object: us, not we."],
  [REQ, "My dad said: 'Please wash the {thing}.' He asked me.", "My dad wanted ______ the {thing}, {name}.", "me to wash", { thing: ["car", "dishes", "windows", "carpet"], name: NAME2 }, "Dad's request to me: wanted me to wash."],
  [REQ, "The coach said to the boys: 'Run {dist} every morning.'", "The coach wants ______ {dist} every morning, {name}.", "them to run", { dist: ["five kilometres", "three kilometres", "ten laps", "two miles"], name: NAME2 }, "The coach's wish for the boys: them to run."],
  [REQ, "Grandma always says to us: 'Eat more {food}!', {name}.", "Grandma wants ______ more {food}, {name}.", "us to eat", { food: ["fruit", "vegetables", "soup", "bread"], name: NAME }, "Grandma's wish for us: us to eat."],
  [REQ, "The teacher told {who}: 'Speak English in class.'", "The teacher wants ______ English in class, {name}.", "her to speak", { who: ["Lola", "Madina", "my sister", "the new girl"], name: NAME2 }, "The teacher's wish for her: her to speak."],
  [REQ, "My friend said to me: 'Come to my {event}, please.'", "My friend wanted ______ to his {event}, {name}.", "me to come", { event: ["party", "wedding", "match", "birthday"], name: NAME2 }, "My friend's wish for me: me to come."],
  [LIKE, "Please give me your answer by {day}, {name}.", "I'd like ______ me your answer by {day}, {name}.", "you to give", { day: ["Monday", "Friday", "tomorrow", "Wednesday"], name: NAME2 }, "would like + you + to + base: you to give."],
  [LIKE, "My parents hope my brother becomes a {job}.", "My parents would like ______ a {job}, {name}.", "him to become", { job: ["doctor", "teacher", "pilot", "lawyer"], name: NAME2 }, "would like + him + to + base: him to become."],
  [LIKE, "We hope you can join us for {food}, {name}.", "We'd like ______ us for {food}, {name}.", "you to join", { food: ["dinner", "lunch", "plov", "tea"], name: NAME }, "would like + you + to + base: you to join."],
  [LIKE, "The manager hopes the workers come early on {day}.", "The manager would like ______ early on {day}, {name}.", "them to come", { day: ["Monday", "Friday", "Saturday", "Tuesday"], name: NAME2 }, "would like + them + to + base: them to come."],
  [LIKE, "Her mum hopes she will call every {time}, {name}.", "Her mum would like ______ every {time}, {name}.", "her to call", { time: ["day", "evening", "weekend", "Sunday"], name: NAME2 }, "would like + her + to + base: her to call."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what your parents want you to do.", "My parents want me to …", ["exactly one sentence", "want + me + to", "base verb"]],
  ["Write one sentence about what you want a friend to do.", "I want you / him / her to …", ["exactly one sentence", "want + person + to", "base verb"]],
  ["Write one sentence with would like + person + to.", "I'd like you to …", ["exactly one sentence", "would like", "person + to + base"]],
  ["Write one sentence about what a teacher wants the class to do.", "The teacher wants us to …", ["exactly one sentence", "wants us to", "base verb"]],
  ["Write one sentence with doesn't want + person + to.", "… doesn't want me to …", ["exactly one sentence", "doesn't want", "person + to + base"]],
  ["Write one sentence with want to (yourself) and one with want + person + to.", "want to vs want someone to", ["exactly two sentences", "want to + base", "want + person + to + base"]],
  ["Write one question: Do you want me to …?", "Do you want me to …?", ["exactly one question", "want + me + to", "a question mark"]],
  ["Write one sentence about what a doctor wanted someone to do.", "The doctor wanted him / her to …", ["exactly one sentence", "wanted", "person + to + base"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write three or four sentences about what your family wants you to do in the future.", "want + person + to", ["want me to", "would like me to", "three or four sentences"]],
  ["You are a teacher. Write three or four sentences about what you want your students to do.", "want + person + to", ["want you to", "would like", "three or four sentences"]],
  ["Write three or four sentences about a party you are planning: what do you want your friends to do?", "want / would like + person + to", ["want them to", "would like", "three or four sentences"]],
  ["Write three or four sentences about rules at home: what do your parents want and not want you to do?", "(don't) want + person + to", ["want me to", "don't want me to", "three or four sentences"]],
  ["Write a short message (three or four sentences) to a new classmate with Do you want me to …?", "Do you want me to …?", ["want me to", "a question", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.object-infinitive.want-object-infinitive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
