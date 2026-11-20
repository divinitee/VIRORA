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
// Transform: 5 all the … → everyone / everybody (plural verb → singular) /
// 5 correct the mistake / 5 plural negative → nobody / no one.
//
// Run: node tools/grammar-practice/authored/pronouns.indefinite.indefinite-agreement.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "indefinite", topic: "indefinite-agreement", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const GROUP = ["in my family", "in our class", "in our street", "at my school"];
const PLACE = ["classroom", "office", "kitchen", "hall"];
const HOME_G = ["in my family", "in our house", "in our flat", "at my grandma's"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const WHY = "everyone, everybody, nobody, no one, someone, everything and nothing take a singular verb (like he or she).";
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const V = (s, b, ing) => [s, b, `are ${ing}`, ing];
const BE = ["is", "are", "am", "be"];
const WAS = ["was", "were", "be", "been"];
const HAS = ["has", "have", "having", "are having"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [V("likes", "like", "liking"), "Everyone {group} ______ football, {name}.", { group: GROUP, name: NAME }],
  [V("knows", "know", "knowing"), "Nobody ______ the answer to this {subj} question, {name}.", { subj: ["maths", "history", "science", "English"], name: NAME }],
  [BE, "Everybody ______ here now, {name}. Let's start the {event}.", { name: NAME, event: ["lesson", "meeting", "game", "test"] }],
  [WAS, "No one ______ at home yesterday {when}, {name}.", { when: ["evening", "afternoon", "morning", "at six"], name: NAME }],
  [HAS, "Everyone in our class ______ a {thing} now, {name}.", { thing: ["phone", "laptop", "tablet", "dictionary"], name: NAME }],
  [V("wants", "want", "wanting"), "Nobody {group} ______ to clean the {room}.", { group: HOME_G, room: ["kitchen", "yard", "garage", "bathroom"] }],
  [BE, "Someone ______ at the {door}, {name}. Can you open it?", { door: ["door", "gate", "front door", "back door"], name: NAME }],
  [V("speaks", "speak", "speaking"), "Everybody in {group} ______ Uzbek and a little Russian.", { group: ["our village", "my town", "our street", "my family"] }],
  [WAS, "Everything ______ delicious at the {event} last night, {name}.", { event: ["wedding", "party", "dinner", "picnic"], name: NAME }],
  [V("works", "work", "working"), "Nothing ______ in this old {thing}, {name}. Let's buy a new one.", { thing: ["car", "phone", "radio", "laptop"], name: NAME }],
  [HAS, "Somebody ______ my {thing}, {name}. I can't find it.", { thing: ["pen", "umbrella", "book", "key"], name: NAME }],
  [V("lives", "live", "living"), "No one ______ in that old {home} on our street, {name}.", { home: ["house", "flat", "building", "cottage"], name: NAME }],
  [BE, "Everything in this {place} ______ very expensive, {name}.", { place: ["shop", "café", "hotel", "market"], name: NAME }],
  [WAS, "Nobody ______ late for the {event} {when}.", { event: ["lesson", "exam", "meeting", "concert"], when: ["yesterday", "on Monday", "last week", "this morning"] }],
  [V("loves", "love", "loving"), "Everyone {group} ______ Grandma's {food}.", { group: HOME_G, food: ["plov", "samsa", "soup", "cakes"] }],
  [V("calls", "call", "calling"), "Somebody ______ me every morning at {time}, {name}. I don't know who it is.", { time: ["seven", "six", "eight", "half past seven"], name: NAME }],
  [HAS, "Nobody in my {group} ______ a {pet}.", { group: ["family", "class", "street", "building"], pet: ["dog", "cat", "car", "horse"] }],
  [V("goes", "go", "going"), "Everybody {group} ______ to bed late at the weekend, {name}.", { group: HOME_G, name: NAME }],
  [WAS, "Someone ______ in the {place} an hour ago, {name}. I heard a voice.", { place: PLACE, name: NAME }],
  [V("understands", "understand", "understanding"), "No one ______ this {text}, {name}. It's too difficult.", { text: ["text", "letter", "poem", "story"], name: NAME }],
].map(([base, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: WHY, slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
// Audit (Claude, 20 Nov): with no tense cue, "liked" / "was" were right too.
const INSTR_B = "Write the verb in brackets in the right form. Use the present, or the past if the sentence has a past time word.";
const BUILD = [
  ["likes", "Everyone {group} ______ (like) {sport}.", { group: GROUP, sport: ["football", "chess", "volleyball", "tennis"] }],
  ["knows", "Nobody ______ (know) where {name} is {when}.", { name: NAME, when: ["now", "today", "this morning", "tonight"] }],
  ["is", "Look at them! Everybody ______ (be) tired after the {event}, {name}.", { event: ["match", "trip", "exam", "wedding"], name: NAME }],
  ["was", "No one ______ (be) in the {place} last night, {name}.", { place: PLACE, name: NAME }],
  ["has", "Everyone {group} ______ (have) a {thing}.", { group: GROUP, thing: ["bike", "phone", "pet", "laptop"] }],
  ["wants", "Nobody ______ (want) to sit near the {place}, {name}.", { place: ["door", "window", "heater", "board"], name: NAME }],
  ["drinks", "Everybody in my family ______ (drink) tea after {meal}.", { meal: ["dinner", "lunch", "plov", "breakfast"], x: [] }],
  ["works", "Someone in our {place} ______ (work) at the {job}.", { place: ["street", "building", "family", "village"], job: ["bank", "hospital", "airport", "post office"] }],
  ["was", "Everything ______ (be) ready for the {event} last {day}.", { event: ["party", "wedding", "test", "concert"], day: ["Friday", "Saturday", "Sunday", "Monday"] }],
  ["costs", "Nothing in this {place} ______ (cost) more than ten dollars, {name}.", { place: ["shop", "café", "bazaar", "market"], name: NAME }],
  ["has", "Somebody ______ (have) your {thing}, {name}. Ask the teacher.", { thing: ["bag", "book", "jacket", "phone"], name: NAME }],
  ["lives", "No one ______ (live) on the top floor of our {home}, {name}.", { home: ["building", "house", "block", "new building"], name: NAME }],
  ["is", "Everything in the {place} ______ (be) new, {name}.", { place: ["kitchen", "classroom", "flat", "shop"], name: NAME }],
  ["loves", "Everyone ______ (love) {name}'s {food}.", { name: NAME, food: ["cakes", "plov", "soup", "salads"] }],
  ["was", "Nobody ______ (be) at the bus stop at {time} yesterday, {name}.", { time: ["six", "seven", "midnight", "five"], name: NAME }],
  ["helps", "Someone always ______ (help) {who} with the {task}.", { who: ["Grandma", "Grandpa", "Mum", "our teacher"], task: ["shopping", "garden", "cooking", "cleaning"] }],
  ["speaks", "Everybody in our {group} ______ (speak) a little English, {name}.", { group: ["class", "family", "office", "street"], name: NAME }],
  ["watches", "No one in our {group} ______ (watch) TV in the {when}.", { group: ["family", "flat", "house", "building"], when: ["morning", "afternoon", "evening", "daytime"] }],
  ["goes", "Everyone {group} ______ (go) to the {place} on Sundays.", { group: HOME_G, place: ["bazaar", "park", "café", "market"] }],
  ["was", "Somebody ______ (be) in my {room} this morning, {name}.", { room: ["room", "kitchen", "car", "garden"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY, slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const EV = "Rewrite the sentence with everyone or everybody.";
const COR = "Correct the mistake.";
const NO = "Rewrite the sentence with nobody or no one.";
const TRANSFORM = [
  // all the … -> everyone (5)
  [EV, "All the students in our class like {subj}, {name}.", "Everyone in our class ______ {subj}, {name}.", "likes", "everyone → singular verb: likes.", { subj: ["music", "art", "English", "PE"], name: NAME }],
  [EV, "All my friends are at the {event}, {name}.", "Everybody ______ at the {event}, {name}.", "is", "everybody → is, not are.", { event: ["party", "match", "concert", "café"], name: NAME }],
  [EV, "All the people in our {place} have a {thing}.", "Everyone in our {place} ______ a {thing}.", "has", "everyone → has, not have.", { place: ["street", "building", "village", "family"], thing: ["car", "garden", "dog", "bike"] }],
  [EV, "All the guests were happy at the {event}, {name}.", "Everybody ______ happy at the {event}, {name}.", "was", "everybody → was, not were.", { event: ["wedding", "party", "dinner", "picnic"], name: NAME }],
  [EV, "All the people in my family speak {lang}, {name}.", "Everyone in my family ______ {lang}, {name}.", "speaks", "everyone → speaks, with -s.", { lang: ["English", "Russian", "Tajik", "Turkish"], name: NAME }],
  // correct (5)
  [COR, "Everyone are here, {name}. Let's start the {event}.", "Everyone ______ here, {name}. Let's start the {event}.", "is", WHY, { name: NAME, event: ["lesson", "game", "meeting", "film"] }],
  [COR, "Nobody know the answer, {name}. Ask {who}.", "Nobody ______ the answer, {name}. Ask {who}.", "knows", WHY, { name: NAME, who: ["the teacher", "Dad", "Grandpa", "Mum"] }],
  [COR, "Somebody have my {thing}, {name}.", "Somebody ______ my {thing}, {name}.", "has", WHY, { thing: ["pen", "key", "book", "phone"], name: NAME }],
  [COR, "Everybody were tired after the {event}, {name}.", "Everybody ______ tired after the {event}, {name}.", "was", WHY, { event: ["match", "trip", "exam", "wedding"], name: NAME }],
  [COR, "No one want to clean the {room}, {name}.", "No one ______ to clean the {room}, {name}.", "wants", WHY, { room: ["kitchen", "yard", "garage", "bathroom"], name: NAME }],
  // plural -> nobody / no one (5)
  [NO, "The students don't like the new {thing}, {name}.", "Nobody ______ the new {thing}, {name}.", "likes", "nobody → singular verb: likes (no don't).", { thing: ["timetable", "rule", "canteen", "uniform"], name: NAME }],
  [NO, "The people in the {place} aren't happy, {name}.", "No one in the {place} ______ happy, {name}.", "is", "no one → is (no not).", { place: ["office", "class", "street", "village"], name: NAME }],
  [NO, "My friends weren't at home {when}, {name}.", "Nobody ______ at home {when}, {name}.", "was", "nobody → was (no not).", { when: ["yesterday", "on Sunday", "last night", "at five"], name: NAME }],
  [NO, "The children don't know the {thing}, {name}.", "No one ______ the {thing}, {name}.", "knows", "no one → knows (no don't).", { thing: ["answer", "way", "rules", "song"], name: NAME }],
  [NO, "My classmates haven't got a {thing}, {name}.", "Nobody in my class ______ a {thing}, {name}.", "has", "nobody → has (no not).", { thing: ["car", "horse", "boat", "dog"], name: NAME }, ["has got"]],
].map(([instr, source, hint, key, why, slots, acceptable]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: fix(slots, source + hint), ...(acceptable ? { acceptable } : {}) }));

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