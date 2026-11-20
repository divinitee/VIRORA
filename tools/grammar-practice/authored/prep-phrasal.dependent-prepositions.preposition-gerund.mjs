// Hand-authored: prep-phrasal / dependent-prepositions / preposition-gerund (B1).
// Wave C, C40 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item: "I'm worried ______ ______ (fail) the exam" →
// about failing): a word that takes a fixed preposition keeps it before a verb, and
// the verb then takes -ing: worried about failing, succeed in finding.
// Triage: kept. A2 verb-patterns preposition-gerund prints the preposition and tests
// only -ing; A2 adjective-preposition tests the preposition before a noun. Here the
// learner supplies BOTH: the right preposition AND the -ing form.
// One right answer: only words with ONE standard preposition are used. Left out:
// afraid / excited / interested (+ to-infinitive is also right), think of/about,
// dream of/about, sorry for/about, guilty of/about, nervous about/of, congratulate
// for (said), succeed at (said), apologise about (said), look forward to (own topic).
// Distractor prepositions are never ones some speakers use with that word.
// Choose: options right prep + -ing / wrong prep + -ing / right prep + base / wrong
// prep + -ing. Build and transform: two-gap array keys [preposition, -ing].
// No typed key has a British/American spelling split.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.dependent-prepositions.preposition-gerund.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "dependent-prepositions", topic: "preposition-gerund", level: "B1", pv: "2.5" };
const NAME = ["Dilnoza", "Otabek", "Feruza", "Sherzod"];
const NAME2 = ["Jamshid", "Malika", "Ulugbek", "Zarina"];

const fill = (text, slots, fallback) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && text.includes(`{${n}}`)) s[n] = f;
  if (text.includes("{name}") && !s.name) s.name = fallback;
  return s;
};

/* ---------------- choose: 20 mcq ---------------- */
// [prep, -ing, base, wrong1, wrong2, prompt, slots, why]
const CHOOSE = [
  ["at", "drawing", "draw", "in", "with", "My little sister is really good ______ {thing}, {name}.", { thing: ["horses", "cats", "faces", "cars"] }, "good at, and after at the verb takes -ing: at drawing."],
  ["of", "eating", "eat", "on", "at", "I'm tired ______ the same {food} every day, {name}.", { food: ["soup", "rice", "bread", "pasta"] }, "tired of + -ing: of eating."],
  ["of", "building", "build", "for", "on", "Grandpa is proud ______ {thing} with his own hands.", { thing: ["this house", "the table", "the garden wall", "the boat"] }, "proud of + -ing: of building."],
  ["about", "missing", "miss", "for", "of", "Mum is worried ______ the last {bus}, {name}.", { bus: ["bus", "train", "metro", "flight"] }, "worried about + -ing: about missing."],
  ["for", "cleaning", "clean", "of", "about", "Who is responsible ______ the {room} today?", { room: ["classroom", "kitchen", "office", "hall"] }, "responsible for + -ing: for cleaning."],
  ["on", "learning", "learn", "at", "in", "My brother is very keen ______ {lang}, {name}.", { lang: ["Korean", "Chinese", "Turkish", "German"] }, "keen on + -ing: on learning."],
  ["of", "going", "go", "for", "at", "This old {car} isn't capable ______ faster than 80 kilometres an hour.", { car: ["car", "bus", "truck", "boat"] }, "capable of + -ing: of going."],
  ["in", "finding", "find", "on", "for", "Did you succeed ______ a {thing}, {name}?", { thing: ["flat", "job", "room", "parking space"] }, "succeed in + -ing: in finding."],
  ["on", "paying", "pay", "in", "at", "My uncle insisted ______ for the {food}, {name}.", { food: ["dinner", "plov", "taxi", "tickets"] }, "insist on + -ing: on paying."],
  ["for", "helping", "help", "of", "about", "Thank you ______ me with the {thing}, {name}.", { thing: ["bags", "homework", "move", "cooking"] }, "thank you for + -ing: for helping."],
  ["for", "being", "be", "of", "on", "The {who} apologised ______ late.", { who: ["teacher", "driver", "doctor", "manager"] }, "apologise for + -ing: for being."],
  ["on", "passing", "pass", "about", "of", "We congratulated our {who} ______ the {test}.", { who: ["cousin", "neighbour", "son", "friend"], test: ["exam", "driving test", "IELTS", "interview"] }, "congratulate someone on + -ing: on passing."],
  ["from", "playing", "play", "of", "to", "The rain prevented us ______ {game}, {name}.", { game: ["football", "tennis", "volleyball", "golf"] }, "prevent someone from + -ing: from playing."],
  ["on", "doing", "do", "in", "at", "I can't concentrate ______ my {work} with this noise, {name}.", { work: ["homework", "report", "project", "essay"] }, "concentrate on + -ing: on doing."],
  ["about", "waiting", "wait", "for", "on", "The {who} complained ______ for so long.", { who: ["passengers", "patients", "customers", "guests"] }, "complain about + -ing: about waiting."],
  ["in", "eating", "eat", "on", "at", "My grandma believes ______ {food} every morning, {name}.", { food: ["porridge", "yoghurt", "a big breakfast", "fruit"] }, "believe in + -ing: in eating."],
  ["for", "making", "make", "of", "with", "Our village is famous ______ beautiful {thing}, {name}.", { thing: ["carpets", "plates", "pots", "scarves"] }, "famous for + -ing: for making."],
  ["of", "telling", "tell", "on", "for", "Grandpa is fond ______ stories about his {time}.", { time: ["childhood", "village days", "school days", "first job"] }, "fond of + -ing: of telling."],
  ["at", "remembering", "remember", "in", "with", "I'm bad ______ {thing}, {name}. Sorry!", { thing: ["names", "birthdays", "phone numbers", "faces"] }, "bad at + -ing: at remembering."],
  ["of", "planning", "plan", "for", "on", "Who's in charge ______ the {event}?", { event: ["party", "trip", "wedding", "concert"] }, "in charge of + -ing: of planning."],
].map(([p, ing, base, w1, w2, prompt, slots, why], i) => {
  let pr = prompt;
  const s = fill(pr, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) { s.name = i % 2 ? NAME2 : NAME; pr = pr.replace(/([.!?])$/, ", {name}$1"); }
  const o = [`${p} ${ing}`, `${w1} ${ing}`, `${p} ${base}`, `${w2} ${ing}`];
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: pr, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill, two gaps ---------------- */
const INSTR = "First gap: the preposition. Second gap: the -ing form of the verb in brackets.";
const BUILD = [
  [["about", "failing"], "I'm worried ______ ______ (fail) the {test}, {name}.", { test: ["exam", "driving test", "interview", "maths test"] }, "worried about failing."],
  [["at", "cooking"], "My dad is very good ______ ______ (cook) {food}, {name}.", { food: ["plov", "shashlik", "lagman", "manti"] }, "good at cooking."],
  [["of", "waiting"], "We're tired ______ ______ (wait) for the {who}, {name}.", { who: ["plumber", "bus", "doctor", "builders"] }, "tired of waiting."],
  [["in", "getting"], "Did your brother succeed ______ ______ (get) a {thing}, {name}?", { thing: ["visa", "job", "flat", "ticket"] }, "succeed in getting."],
  [["for", "losing"], "I'm sorry. I apologise ______ ______ (lose) your {thing}, {name}.", { thing: ["book", "pen", "umbrella", "charger"] }, "apologise for losing."],
  [["on", "speaking"], "The teacher insisted ______ ______ (speak) English in the {place}, {name}.", { place: ["lesson", "classroom", "club", "trip"] }, "insist on speaking."],
  [["for", "coming"], "Thanks ______ ______ (come) to my {event}, {name}!", { event: ["party", "wedding", "birthday", "concert"] }, "thanks for coming."],
  [["of", "winning"], "Our team is proud ______ ______ (win) the {match}, {name}.", { match: ["final", "cup", "league", "tournament"] }, "proud of winning."],
  [["on", "winning"], "Everyone congratulated my {who} ______ ______ (win) the race.", { who: ["sister", "cousin", "son", "friend"] }, "congratulate someone on winning."],
  [["from", "going"], "The snow stopped us ______ ______ (go) to {city}, {name}.", { city: ["Chimgan", "Samarkand", "Jizzakh", "Angren"] }, "stop someone from going."],
  [["for", "looking"], "Who is responsible ______ ______ (look) after the {animal}, {name}?", { animal: ["dog", "cat", "horses", "chickens"] }, "responsible for looking after."],
  [["on", "playing"], "My son is very keen ______ ______ (play) {game}, {name}.", { game: ["chess", "football", "tennis", "the piano"] }, "keen on playing."],
  [["about", "paying"], "The {who} complained ______ ______ (pay) so much for parking.", { who: ["man", "customer", "driver", "tourists"] }, "complain about paying."],
  [["on", "driving"], "Please concentrate ______ ______ (drive), {name}. The {road} is dangerous.", { road: ["road", "mountain road", "bridge", "motorway"] }, "concentrate on driving."],
  [["at", "making"], "My aunt is excellent ______ ______ (make) {food}, {name}.", { food: ["cakes", "bread", "samsa", "pancakes"] }, "excellent at making."],
  [["of", "taking"], "My cousin is fond ______ ______ (take) photos of {thing}, {name}.", { thing: ["birds", "flowers", "old buildings", "the sky"] }, "fond of taking."],
  [["in", "helping"], "Our neighbours believe ______ ______ (help) each other in the {place}, {name}.", { place: ["mahalla", "village", "building", "street"] }, "believe in helping."],
  [["of", "keeping"], "Is your {who} capable ______ ______ (keep) a secret, {name}?", { who: ["brother", "sister", "friend", "cousin"] }, "capable of keeping."],
  [["for", "forgetting"], "I felt bad. I apologised to my {who} ______ ______ (forget) her birthday.", { who: ["mum", "sister", "aunt", "wife"] }, "apologise for forgetting."],
  [["about", "speaking"], "I'm worried ______ ______ (speak) in front of the whole {who}, {name}.", { who: ["class", "school", "office", "team"] }, "worried about speaking."],
].map(([key, source, slots, why], i) => {
  let src = source;
  const s = fill(src, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) { s.name = i % 2 ? NAME2 : NAME; src = src.replace(/([.!?])$/, ", {name}$1"); }
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why: `${why[0].toUpperCase()}${why.slice(1)} The word keeps its preposition, and the verb after it takes -ing.`.replace(/\.\s+The/, ". The"), slots: s };
});

/* ---------------- transform: 15 rewrite, two gaps ---------------- */
const THAT = "Rewrite. Use the preposition + -ing. One word in each gap.";
const FIX = "Correct the mistake. One word in each gap.";
const BEC = "Make one sentence. One word in each gap.";
const TRANSFORM = [
  [THAT, "I'm worried that I will miss the {bus}, {name}.", "I'm worried ______ ______ the {bus}, {name}.", ["about", "missing"], { bus: ["bus", "train", "flight", "start"] }, "worried that I will miss → worried about missing."],
  [THAT, "My sister is proud that she won the {prize}, {name}.", "My sister is proud ______ ______ the {prize}, {name}.", ["of", "winning"], { prize: ["prize", "medal", "cup", "competition"] }, "proud that she won → proud of winning."],
  [THAT, "We're tired because we waited for the {who} all day, {name}.", "We're tired ______ ______ for the {who} all day, {name}.", ["of", "waiting"], { who: ["plumber", "builders", "taxi", "delivery"] }, "tired because we waited → tired of waiting."],
  [THAT, "He is good at it. He fixes {thing}, {name}.", "He is good ______ ______ {thing}, {name}.", ["at", "fixing"], { thing: ["bikes", "phones", "cars", "computers"] }, "good at it + fixes → good at fixing."],
  [THAT, "My son is keen on one thing: he plays {game}, {name}.", "My son is keen ______ ______ {game}, {name}.", ["on", "playing"], { game: ["chess", "football", "tennis", "volleyball"] }, "keen on + plays → keen on playing."],
  [FIX, "She succeeded to pass the {test}, {name}.", "She succeeded ______ ______ the {test}, {name}.", ["in", "passing"], { test: ["exam", "driving test", "interview", "IELTS"] }, "succeed in + -ing, not succeed to."],
  [FIX, "My uncle insisted to pay for the {food}, {name}.", "My uncle insisted ______ ______ for the {food}, {name}.", ["on", "paying"], { food: ["dinner", "taxi", "tickets", "plov"] }, "insist on + -ing, not insist to."],
  [FIX, "Thank you for help me with my {work}, {name}.", "Thank you ______ ______ me with my {work}, {name}.", ["for", "helping"], { work: ["homework", "bags", "move", "essay"] }, "after for the verb takes -ing: helping."],
  [FIX, "The noise prevented me to sleep in the {place}, {name}.", "The noise prevented me ______ ______ in the {place}, {name}.", ["from", "sleeping"], { place: ["hotel", "flat", "tent", "dormitory"] }, "prevent someone from + -ing, not to."],
  [FIX, "Concentrate in read the {doc}, {name}.", "Concentrate ______ ______ the {doc}, {name}.", ["on", "reading"], { doc: ["question", "text", "instructions", "letter"] }, "concentrate on + -ing."],
  [BEC, "The {who} apologised. He was late, {name}.", "The {who} apologised ______ ______ late, {name}.", ["for", "being"], { who: ["driver", "teacher", "doctor", "waiter"] }, "apologise for + being."],
  [BEC, "We congratulated my {who}. She passed the exam, {name}.", "We congratulated my {who} ______ ______ the exam, {name}.", ["on", "passing"], { who: ["sister", "cousin", "aunt", "friend"] }, "congratulate someone on + -ing."],
  [BEC, "Thank you. You came to my {event}, {name}.", "Thank you ______ ______ to my {event}, {name}.", ["for", "coming"], { event: ["party", "wedding", "concert", "birthday"] }, "thank you for + -ing."],
  [BEC, "The {who} complained. They waited for an hour, {name}.", "The {who} complained ______ ______ for an hour, {name}.", ["about", "waiting"], { who: ["customers", "patients", "guests", "passengers"] }, "complain about + -ing."],
  [BEC, "Who is responsible? Someone has to feed the {animal}, {name}.", "Who is responsible ______ ______ the {animal}, {name}?", ["for", "feeding"], { animal: ["cat", "dog", "fish", "chickens"] }, "responsible for + -ing."],
].map(([instr, source, hint, key, slots, why], i) => {
  const s = fill(source + hint, slots, i % 2 ? NAME2 : NAME);
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you are good at doing.", "I'm good at + -ing", ["exactly one sentence", "good at", "-ing"]],
  ["Write one sentence about something you are tired of doing.", "I'm tired of + -ing", ["exactly one sentence", "tired of", "-ing"]],
  ["Write one sentence with worried about + -ing.", "worried about + -ing", ["exactly one sentence", "worried about", "-ing"]],
  ["Write one sentence thanking someone for doing something.", "Thank you for + -ing", ["exactly one sentence", "thank you for", "-ing"]],
  ["Write one sentence with apologise for + -ing.", "apologise for + -ing", ["exactly one sentence", "apologise for", "-ing"]],
  ["Write one sentence with succeed in + -ing.", "succeed in + -ing", ["exactly one sentence", "succeed in", "-ing"]],
  ["Write one sentence about something that stopped you from doing something.", "stopped / prevented … from + -ing", ["exactly one sentence", "from", "-ing"]],
  ["Write one sentence about a person you are proud of. Say what they did.", "proud of + -ing", ["exactly one sentence", "proud of", "-ing"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write a short thank-you message (three or four sentences) to someone who helped you.", "thank you for + -ing", ["for + -ing", "another preposition + -ing", "three or four sentences"]],
  ["Describe yourself: what are you good at, bad at and tired of? Write three or four sentences.", "good at / bad at / tired of + -ing", ["at + -ing", "of + -ing", "three or four sentences"]],
  ["Write three or four sentences about a worry you had before an exam or interview.", "worried about + -ing", ["about + -ing", "succeed in / proud of", "three or four sentences"]],
  ["Write a short apology (three or four sentences) for something you did wrong.", "apologise for + -ing", ["for + -ing", "another preposition + -ing", "three or four sentences"]],
  ["Write three or four sentences about a family member you are proud of.", "proud of + -ing", ["of + -ing", "good at / keen on", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.dependent-prepositions.preposition-gerund.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
