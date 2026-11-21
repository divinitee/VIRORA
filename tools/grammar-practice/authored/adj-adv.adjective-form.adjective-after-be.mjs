// Hand-authored: adj-adv / adjective-form / adjective-after-be (A2).
// Path fill P29 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: an adjective, not an adverb, after be / feel / look
// (You look ______ today. Are you OK? tired / tiredly / tire / tiring).
// Rule 14 note covered: every look / smell / taste sentence is about how a
// person or thing SEEMS (You look tired, The cake looks delicious), never the
// action (look at, look carefully), and the why lines say "when look means
// seem". The -ly adverb after an action verb is P34 (ly-adverb), so no item
// asks for an adverb.
// One right answer: no good / well (both can follow feel and look); no
// -ed / -ing pairs as rivals; after FEEL no noun distractor ("feel
// happiness", "feel warmth" are English), so feel items use adverb + verb
// forms only (tired / tiredly / tiring / tire). No "kindly", "friendly" or
// comparatives (they can be adjectives).
// Choose: be 6 / look 5 / feel 5 / sound, taste, smell, seem 4.
// Build: "Write the right form of the word in brackets." The cue is the
// adverb or the noun (tiredly → tired, anger → angry).
// Transform: 5 correct the mistake (adverb → adjective) / 5 adverb sentence
// → be / look / seem + adjective / 5 adjective + noun → noun + be + adjective.
//
// Run: node tools/grammar-practice/authored/adj-adv.adjective-form.adjective-after-be.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "adjective-form", topic: "adjective-after-be", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const GIRL = ["Lola", "Olga", "Madina", "Kamila"];
const BOY = ["Aziz", "Timur", "Bobur", "Rustam"];
const ADULT_M = ["mum", "dad", "grandma", "grandpa"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const W = {
  be: "After be (am, is, are, was), use an adjective, not an adverb.",
  look: "When look means seem, use an adjective after it, not an adverb.",
  feel: "After feel, use an adjective to say how you are, not an adverb.",
  sense: "After sound, taste, smell and seem, use an adjective, not an adverb.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  // be (6)
  ["be", ["careful", "carefully", "care", "cares"], "Be ______ with the hot tea, {name}! It's in a {cup}.", { name: NAME, cup: ["glass", "thin cup", "small bowl", "paper cup"] }],
  ["be", ["quiet", "quietly", "quietness", "quieten"], "The children are very ______ today. They're reading {thing}, {name}.", { thing: ["books", "comics", "stories", "magazines"], name: NAME }],
  ["be", ["angry", "angrily", "anger", "angers"], "My {who} was ______ because I came home late from {place}.", { who: ADULT_M, place: ["football", "the park", "my friend's house", "the cinema"] }],
  ["be", ["easy", "easily", "ease", "eases"], "The test was ______, so I finished in {n} minutes, {name}.", { n: ["ten", "fifteen", "twenty", "thirty"], name: NAME }],
  ["be", ["comfortable", "comfortably", "comfort", "comforts"], "Our new {thing} is ______ and soft, {name}.", { thing: ["sofa", "bed", "armchair", "pillow"], name: NAME }],
  ["be", ["busy", "busily", "business", "busies"], "{name} is ______ this week. She has a lot of {work}.", { name: GIRL, work: ["work", "homework", "tests", "lessons"] }],
  // look (5)
  ["look", ["tired", "tiredly", "tire", "tiredness"], "You look ______ today, {name}. Did you sleep {how}?", { name: NAME, how: ["badly", "late", "enough", "at all"] }],
  ["look", ["beautiful", "beautifully", "beauty", "beautify"], "{name} looks ______ in her new {clothes}.", { name: GIRL, clothes: ["dress", "coat", "scarf", "hat"] }],
  ["look", ["delicious", "deliciously", "deliciousness", "delight"], "The {food} looks ______, {who}! Can I have some?", { food: ["cake", "plov", "soup", "salad"], who: ["Mum", "Grandma", "Dad", "Aunt Lola"] }],
  ["look", ["sad", "sadly", "sadness", "sadden"], "Your {who} looks ______. What happened, {name}?", { who: ["brother", "sister", "friend", "cousin"], name: NAME }],
  ["look", ["hungry", "hungrily", "hunger", "hungers"], "The {pet} looks ______. Give it some food, {name}.", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  // feel (5)
  ["feel", ["tired", "tiredly", "tiring", "tire"], "I feel ______ after the long {trip}, {name}.", { trip: ["trip", "walk", "lesson", "game"], name: NAME }],
  ["feel", ["sleepy", "sleepily", "sleeping", "sleep"], "I always feel ______ after {meal}, {name}.", { meal: ["lunch", "dinner", "plov", "a big meal"], name: NAME }],
  ["feel", ["warm", "warmly", "warming", "warms"], "I feel ______ in my new {clothes}, {name}.", { clothes: ["jacket", "coat", "sweater", "hat"], name: NAME }],
  ["feel", ["calm", "calmly", "calming", "calms"], "Take a deep breath. You'll feel ______ soon, {name}. The {event} is easy.", { name: NAME, event: ["test", "game", "lesson", "exam"] }],
  ["feel", ["sad", "sadly", "saddening", "sadden"], "{name} felt ______ when her team lost the {match}.", { name: GIRL, match: ["match", "final", "game", "cup"] }],
  // sound / taste / smell / seem (4)
  ["sense", ["great", "greatly", "greatness", "greats"], "A picnic in the {place}? That sounds ______, {name}!", { place: ["park", "mountains", "garden", "village"], name: NAME }],
  ["sense", ["terrible", "terribly", "terror", "terrify"], "This {drink} tastes ______. Is it old, {name}?", { drink: ["milk", "juice", "tea", "yogurt"], name: NAME }],
  ["sense", ["wonderful", "wonderfully", "wonder", "wonders"], "The bread smells ______. Is it fresh from the {place}, {name}?", { place: ["bakery", "tandoor", "oven", "shop"], name: NAME }],
  ["sense", ["polite", "politely", "politeness", "impolitely"], "Your new {who} seems very ______. He always says hello, {name}.", { who: ["neighbour", "teacher", "classmate", "doctor"], name: NAME }],
].map(([w, base, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: W[w], slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the right form of the word in brackets.";
const BUILD = [
  ["tired", "look", "You look ______ (tiredly), {name}. Go to bed early {when}.", { name: NAME, when: ["tonight", "today", "this evening", "after dinner"] }],
  ["delicious", "be", "The {food} is ______ (deliciously)! Thank you, {who}.", { food: ["soup", "plov", "cake", "salad"], who: ["Mum", "Grandma", "Aunt Lola", "Dad"] }],
  ["quiet", "be", "Please be ______ (quietly) in the {place}, {name}.", { place: ["library", "hospital", "museum", "classroom"], name: NAME }],
  ["angry", "be", "My {who} was very ______ (anger) with me, {name}.", { who: ADULT_M, name: NAME }],
  ["happy", "feel", "{name} feels ______ (happily) today. It's her {day}.", { name: GIRL, day: ["birthday", "first day of the holidays", "last exam", "big day"] }],
  ["boring", "be", "The {thing} was ______ (boringly), so we went home, {name}.", { thing: ["film", "concert", "game", "show"], name: NAME }],
  ["comfortable", "be", "This {thing} is very ______ (comfort), {name}.", { thing: ["sofa", "bed", "chair", "armchair"], name: NAME }],
  ["easy", "sense", "The test seemed ______ (easily) to {name} and her {who}.", { name: GIRL, who: ["friends", "sister", "classmates", "cousin"] }],
  ["hungry", "look", "Your {pet} looks ______ (hunger), {name}. Did you feed it?", { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  ["wonderful", "sense", "A day at the {place}? That sounds ______ (wonderfully), {name}!", { place: ["lake", "zoo", "river", "mountains"], name: NAME }],
  ["sleepy", "feel", "I feel ______ (sleepily) after {meal}, {name}.", { meal: ["lunch", "dinner", "plov", "a big meal"], name: NAME }],
  ["sad", "sense", "Grandpa seems ______ (sadly) today, {name}. Let's call {who}.", { name: NAME, who: ["him", "Grandma", "Dad", "Mum"] }],
  ["noisy", "be", "The {street} is very ______ (noise) at night, {name}.", { street: ["street", "road", "yard", "city"], name: NAME }],
  ["nervous", "look", "{name} looked ______ (nervously) before the {event}.", { name: NAME, event: ["test", "match", "concert", "interview"] }],
  ["warm", "feel", "The water in the {place} feels ______ (warmly) today, {name}.", { place: ["lake", "river", "sea", "pool"], name: NAME }],
  ["kind", "be", "Our {who} is very ______ (kindness) to us, {name}.", { who: ["teacher", "neighbour", "coach", "doctor"], name: NAME }],
  ["strange", "sense", "This {drink} tastes ______ (strangely). Is it old, {name}?", { drink: ["milk", "juice", "tea", "yogurt"], name: NAME }],
  ["busy", "be", "My {sib} is ______ (busily) with homework, {name}.", { sib: ["brother", "sister", "cousin", "friend"], name: NAME }],
  ["calm", "be", "The baby is ______ (calmly) now. She's sleeping in her {bed}, {name}.", { bed: ["cot", "bed", "pram", "cradle"], name: NAME }],
  ["beautiful", "look", "Your {thing} looks ______ (beauty), {name}!", { thing: ["dress", "garden", "picture", "room"], name: NAME }],
].map(([key, w, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W[w], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const ADJ = "Rewrite the sentence with an adjective.";
const AFTER = "Rewrite the sentence: put the adjective after be.";
const TRANSFORM = [
  // correct the mistake (5)
  [COR, "You look tiredly, {name}. Sit down, {who}.", "You look ______, {name}. Sit down, {who}.", "tired", "When look means seem, use an adjective: tired, not tiredly.", { name: NAME, who: ["please", "now", "here", "for a minute"] }],
  [COR, "The {food} smells deliciously, {who}.", "The {food} smells ______, {who}.", "delicious", "After smell, use an adjective: delicious, not deliciously.", { food: ["soup", "plov", "bread", "cake"], who: ["Mum", "Grandma", "Dad", "Aunt Lola"] }],
  [COR, "Be carefully with the {thing}, {name}.", "Be ______ with the {thing}, {name}.", "careful", "After be, use an adjective: careful, not carefully.", { thing: ["knife", "hot tea", "glass", "scissors"], name: NAME }],
  [COR, "{name} feels happily today. Her {who} is here.", "{name} feels ______ today. Her {who} is here.", "happy", "After feel, use an adjective: happy, not happily.", { name: GIRL, who: ["grandma", "aunt", "cousin", "best friend"] }],
  [COR, "This {music} sounds strangely, {name}.", "This {music} sounds ______, {name}.", "strange", "After sound, use an adjective: strange, not strangely.", { music: ["song", "music", "radio", "phone"], name: NAME }],
  // adverb sentence -> be / look / seem + adjective (5)
  [ADJ, "{name} sang beautifully at the {event}.", "{name}'s song at the {event} was ______.", "beautiful", "The song was … : after was, use the adjective beautiful.", { name: NAME, event: ["concert", "party", "wedding", "school show"] }],
  [ADJ, "The {kids} played quietly in their room, {name}.", "The {kids} were ______ in their room, {name}.", "quiet", "They were … : after were, use the adjective quiet.", { kids: ["children", "boys", "girls", "twins"], name: NAME }],
  [ADJ, "My {who} answered angrily, {name}.", "My {who} was ______, {name}.", "angry", "He or she was … : after was, use the adjective angry.", { who: ADULT_M, name: NAME }],
  [ADJ, "{name} smiled happily at her {who}.", "{name} looked ______.", "happy", "She looked … : when look means seem, use the adjective happy.", { name: GIRL, who: ["sister", "mum", "friend", "teacher"] }],
  [ADJ, "{name} spoke nervously at the start of the {event}.", "{name} seemed ______ at the start of the {event}.", "nervous", "He or she seemed … : after seem, use the adjective nervous.", { name: NAME, event: ["lesson", "meeting", "interview", "concert"] }],
  // adjective + noun -> noun + be + adjective (5)
  [AFTER, "This is a big {home}, {name}.", "This {home} ______, {name}.", "is big", "The adjective can go after be: This house is big.", { home: ["house", "flat", "garden", "kitchen"], name: NAME }],
  [AFTER, "These are old {things}, {name}.", "These {things} ______, {name}.", "are old", "More than one → are, then the adjective: These books are old.", { things: ["books", "photos", "chairs", "shoes"], name: NAME }],
  [AFTER, "That was an easy {test}, {name}.", "That {test} ______, {name}.", "was easy", "In the past → was, then the adjective: That test was easy.", { test: ["test", "exam", "lesson", "game"], name: NAME }],
  [AFTER, "It's a beautiful {place}, {name}.", "This {place} ______, {name}.", "is beautiful", "One place → is, then the adjective: This park is beautiful.", { place: ["park", "city", "village", "garden"], name: NAME }],
  [AFTER, "They are noisy {kids}, {name}.", "The {kids} ______, {name}.", "are noisy", "More than one → are, then the adjective: The boys are noisy.", { kids: ["children", "boys", "girls", "twins"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about how you feel today.", "I feel + adjective", ["exactly one sentence", "feel", "an adjective"]],
  ["Write one sentence about your favourite food: how does it look, smell or taste?", "It looks / smells / tastes + adjective", ["exactly one sentence", "look, smell or taste", "an adjective"]],
  ["A friend looks unhappy. Write one sentence to him or her.", "You look + adjective", ["exactly one sentence", "you look", "an adjective"]],
  ["Write one sentence about your English lessons this week.", "They are / were + adjective", ["exactly one sentence", "be", "an adjective"]],
  ["A friend has a plan for Saturday. Write one sentence to answer.", "That sounds + adjective", ["exactly one sentence", "sounds", "an adjective"]],
  ["Write one sentence about your street at night.", "It is + adjective", ["exactly one sentence", "be", "an adjective"]],
  ["Write one sentence about how you feel before a test.", "I feel + adjective", ["exactly one sentence", "feel", "an adjective"]],
  ["Write two sentences about your room: one with is and one with looks.", "It is … / It looks …", ["exactly two sentences", "is + adjective", "looks + adjective"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe how you feel on a Monday morning and on a Friday evening.", "I feel + adjective", ["feel twice", "two different adjectives", "three or four sentences"]],
  ["Describe a family dinner: how does the food look, smell and taste?", "It looks / smells / tastes + adjective", ["look, smell or taste", "two adjectives", "three or four sentences"]],
  ["Describe your best friend today: how does he or she look and feel?", "He / She looks + adjective", ["looks", "feels or is", "three or four sentences"]],
  ["Describe your town or village for a visitor: what is it like?", "It is + adjective", ["is + adjective", "two adjectives", "three or four sentences"]],
  ["A friend invites you to a party. Answer the message and say how you feel.", "That sounds + adjective. I feel …", ["sounds", "feel", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.adjective-form.adjective-after-be.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);