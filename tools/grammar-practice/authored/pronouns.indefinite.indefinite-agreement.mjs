// Hand-authored: pronouns / indefinite / indefinite-agreement (A2).
// Path fill P48 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement foci: everyone takes a singular verb (Everyone in my family
// ______ (like) football → likes) and nobody takes a singular verb (Nobody
// ______ what happened: know / knows / are knowing / have known).
// Sibling scope: the VERB after an indefinite pronoun only (everyone,
// everybody, nobody, no one, someone, somebody, everything, nothing). The
// pronoun itself is always printed, so P45-P47 (which word to choose) are
// not tested. No pronoun or possessive refers back (their / they is the B2
// singular-they topic), no negatives with everyone, no questions.
// One right answer: every present item has a habit or fact marker, so the
// -ing form is wrong; every past item has a past time marker, so was is the
// only form. Options: likes / like / are liking / liking; is / are / am /
// be; was / were / be / been; has / have / having / are having.
// Build: "Write the verb in brackets in the right form."; cue = base verb or
// be / have; the learner adds -s, writes is / was / has.
// Transform: 5 all the … / the people … → everyone / everybody (plural verb
// → singular) / 5 correct the mistake / 5 plural subject → nobody / no one.
//
// Run: node tools/grammar-practice/authored/pronouns.indefinite.indefinite-agreement.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "indefinite", topic: "indefinite-agreement", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const GROUP = ["in my family", "in our class", "in our street", "at my school"];
const PLACE = ["classroom", "office", "kitchen", "hall"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const WHY = "everyone, everybody, nobody, no one, someone, everything and nothing take a singular verb (like he or she).";
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const V = (s, b, ing) => [s, b, `are ${ing}`, ing];
const BE = ["is", "are", "am", "be"];
const WAS = ["was", "were", "be", "been"];
const HAS = ["has", "have", "having", "are having"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [V("likes", "like", "liking"), "Everyone {group} ______ football.", { group: GROUP }],
  [V("knows", "know", "knowing"), "Nobody ______ the answer to this question, {name}.", { name: NAME }],
  [BE, "Everybody ______ here now, {name}. Let's start the {event}.", { name: NAME, event: ["lesson", "meeting", "game", "test"] }],
  [WAS, "No one ______ at home yesterday {when}, {name}.", { when: ["evening", "afternoon", "morning", "at six"], name: NAME }],
  [HAS, "Everyone in our class ______ a {thing} now.", { thing: ["phone", "laptop", "tablet", "dictionary"] }],
  [V("wants", "want", "wanting"), "Nobody {group} ______ to clean the {room}.", { group: GROUP, room: ["kitchen", "yard", "garage", "bathroom"] }],
  [BE, "Someone ______ at the door, {name}. Can you open it?", { name: NAME }],
  [V("speaks", "speak", "speaking"), "Everybody in {city} ______ Uzbek and a little Russian.", { city: ["our village", "my town", "our street", "my family"] }],
  [WAS, "Everything ______ delicious at the {event} last night, {name}.", { event: ["wedding", "party", "dinner", "picnic"], name: NAME }],
  [V("works", "work", "working"), "Nothing ______ in this old {thing}, {name}. Let's buy a new one.", { thing: ["car", "phone", "house", "kitchen"], name: NAME }],
  [HAS, "Somebody ______ my {thing}, {name}. I can't find it.", { thing: ["pen", "umbrella", "book", "key"], name: NAME }],
  [V("lives", "live", "living"), "No one ______ in that old house on our street.", { x: [] }],
  [BE, "Everything in this {place} ______ very expensive, {name}.", { place: ["shop", "café", "hotel", "market"], name: NAME }],
  [WAS, "Nobody ______ late for the {event} {when}.", { event: ["lesson", "exam", "meeting", "concert"], when: ["yesterday", "on Monday", "last week", "this morning"] }],
  [V("loves", "love", "loving"), "Everyone {group} ______ Grandma's plov.", { group: GROUP }],
  [V("calls", "call", "calling"), "Somebody ______ me every morning at seven, {name}. I don't know who it is.", { name: NAME }],
  [HAS, "Nobody in my family ______ a {pet}.", { pet: ["dog", "cat", "car", "bike"] }],
  [V("goes", "go", "going"), "Everybody {group} ______ to bed late at the weekend.", { group: GROUP }],
  [WAS, "Someone ______ in the {place} an hour ago, {name}. I heard a voice.", { place: PLACE, name: NAME }],
  [V("understands", "understand", "understanding"), "No one ______ this text, {name}. It's too difficult.", { name: NAME }],
].map(([base, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: WHY, slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets in the right form.";
const BUILD = [
  ["likes", "Everyone {group} ______ (like) football.", { group: GROUP }],
  ["knows", "Nobody ______ (know) where {name} is.", { name: NAME }],
  ["is", "Everybody ______ (be) tired after the {event}.", { event: ["match", "trip", "exam", "wedding"] }],
  ["was", "No one ______ (be) in the {place} last night, {name}.", { place: PLACE, name: NAME }],
  ["has", "Everyone {group} ______ (have) a bike.", { group: GROUP }],
  ["wants", "Nobody ______ (want) to sit near the {place}, {name}.", { place: ["door", "window", "heater", "board"], name: NAME }],
  ["drinks", "Everybody in my family ______ (drink) tea after {meal}.", { meal: ["dinner", "lunch", "plov", "breakfast"] }],
  ["works", "Someone in our {place} ______ (work) at the bank.", { place: ["street", "building", "family", "village"] }],
  ["was", "Everything ______ (be) ready for the {event} on {day}.", { event: ["party", "wedding", "test", "concert"], day: ["Friday", "Saturday", "Sunday", "Monday"] }],
  ["costs", "Nothing in this {place} ______ (cost) more than ten dollars, {name}.", { place: ["shop", "café", "bazaar", "market"], name: NAME }],
  ["has", "Somebody ______ (have) your {thing}, {name}. Ask the teacher.", { thing: ["bag", "book", "jacket", "phone"], name: NAME }],
  ["lives", "No one ______ (live) on the top floor of our {home}.", { home: ["building", "house", "block", "school"] }],
  ["is", "Everything in the {place} ______ (be) new, {name}.", { place: ["kitchen", "classroom", "flat", "shop"], name: NAME }],
  ["loves", "Everyone ______ (love) {name}'s cakes.", { name: NAME }],
  ["was", "Nobody ______ (be) at the bus stop at {time}, {name}.", { time: ["six", "seven", "midnight", "five"], name: NAME }],
  ["helps", "Someone always ______ (help) Grandma with the {task}.", { task: ["shopping", "garden", "cooking", "cleaning"] }],
  ["speaks", "Everybody in our class ______ (speak) a little English, {name}.", { name: NAME }],
  ["watches", "No one in my family ______ (watch) TV in the {when}.", { when: ["morning", "afternoon", "day", "week"] }],
  ["goes", "Everyone {group} ______ (go) to the bazaar on Sundays.", { group: GROUP }],
  ["was", "Somebody ______ (be) in my {room} this morning, {name}.", { room: ["room", "kitchen", "car", "garden"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY, slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const EV = "Rewrite the sentence with everyone or everybody.";
const COR = "Correct the mistake.";
const NO = "Rewrite the sentence with nobody or no one.";
const TRANSFORM = [
  // all the … -> everyone (5)
  [EV, "All the students in our class like {subj}.", "Everyone in our class ______ {subj}.", "likes", "everyone → singular verb: likes.", { subj: ["music", "art", "English", "PE"] }],
  [EV, "All my friends are at the {event}, {name}.", "Everybody ______ at the {event}, {name}.", "is", "everybody → is, not are.", { event: ["party", "match", "concert", "café"], name: NAME }],
  [EV, "All the people in our street have a {thing}.", "Everyone in our street ______ a {thing}.", "has", "everyone → has, not have.", { thing: ["car", "garden", "dog", "balcony"] }],
  [EV, "All the guests were happy at the {event}.", "Everybody ______ happy at the {event}.", "was", "everybody → was, not were.", { event: ["wedding", "party", "dinner", "picnic"] }],
  [EV, "All my cousins speak English, {name}.", "Everyone in my family ______ English, {name}.", "speaks", "everyone → speaks, with -s.", { name: NAME }],
  // correct (5)
  [COR, "Everyone are here, {name}. Let's go.", "Everyone ______ here, {name}. Let's go.", "is", WHY, { name: NAME }],
  [COR, "Nobody know the answer, {name}.", "Nobody ______ the answer, {name}.", "knows", WHY, { name: NAME }],
  [COR, "Somebody have my {thing}, {name}.", "Somebody ______ my {thing}, {name}.", "has", WHY, { thing: ["pen", "key", "book", "phone"], name: NAME }],
  [COR, "Everybody were tired after the {event}.", "Everybody ______ tired after the {event}.", "was", WHY, { event: ["match", "trip", "exam", "wedding"] }],
  [COR, "No one want to clean the {room}, {name}.", "No one ______ to clean the {room}, {name}.", "wants", WHY, { room: ["kitchen", "yard", "garage", "bathroom"], name: NAME }],
  // plural -> nobody / no one (5)
  [NO, "The students don't like the new {thing}.", "Nobody ______ the new {thing}.", "likes", "nobody → singular verb: likes (no don't).", { thing: ["timetable", "teacher", "rule", "canteen"] }],
  [NO, "The people in the {place} aren't happy.", "No one in the {place} ______ happy.", "is", "no one → is (no not).", { place: ["office", "class", "street", "village"] }],
  [NO, "My friends weren't at home {when}.", "Nobody ______ at home {when}.", "was", "nobody → was (no not).", { when: ["yesterday", "on Sunday", "last night", "at five"] }],
  [NO, "The children don't know the {thing}, {name}.", "No one ______ the {thing}, {name}.", "knows", "no one → knows (no don't).", { thing: ["answer", "way", "rules", "song"], name: NAME }],
  [NO, "My classmates haven't got a {thing}.", "Nobody in my class ______ a {thing}.", "has", "nobody → has (no not).", { thing: ["car", "horse", "boat", "dog"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: fix(slots, source + hint) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about your family with Everyone.", "Everyone in my family + verb-s", ["exactly one sentence", "Everyone", "a verb with -s"]],
  ["Write one sentence about your class with Nobody.", "Nobody in my class + verb-s", ["exactly one sentence", "Nobody", "a singular verb"]],
  ["Write one sentence about a party last week with Everybody was.", "Everybody was …", ["exactly one sentence", "Everybody was", "a feeling word"]],
  ["Write one sentence about your street with No one.", "No one in our street …", ["exactly one sentence", "No one", "a singular verb"]],
  ["Write one sentence about a mystery phone call with Someone.", "Someone calls / called …", ["exactly one sentence", "Someone", "call"]],
  ["Write one sentence about a shop with Everything is.", "Everything in this shop is …", ["exactly one sentence", "Everything is", "a price or adjective"]],
  ["Write one sentence about a food that everybody likes.", "Everybody likes …", ["exactly one sentence", "Everybody likes", "a food word"]],
  ["Write two sentences: one with Everyone and one with Nobody.", "Everyone … -s. Nobody … -s.", ["exactly two sentences", "Everyone once", "Nobody once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a family holiday: what does everyone do, and what does nobody like?", "Everyone + verb-s / Nobody + verb-s", ["Everyone", "Nobody", "three or four sentences"]],
  ["Describe your class: what everybody has, likes or does.", "Everybody has / likes …", ["Everybody", "a singular verb", "three or four sentences"]],
  ["Describe a wedding or party you went to. How was everyone?", "Everyone was … Nobody was …", ["was twice", "Everyone or Nobody", "three or four sentences"]],
  ["Describe your street or village. Who lives there, and what does everyone do?", "Everyone knows … No one lives …", ["Everyone", "No one", "three or four sentences"]],
  ["Describe a strange morning: someone was in the kitchen, but nobody knows who.", "Someone was … Nobody knows …", ["Someone", "Nobody knows", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.indefinite.indefinite-agreement.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);