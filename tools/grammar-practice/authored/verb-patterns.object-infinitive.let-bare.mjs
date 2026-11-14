// Hand-authored: verb-patterns / object-infinitive / let-bare (A2).
// Path fill P19 (2026-11-14, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: let + object + bare infinitive ("My parents don't let me
// ______ out late": stay / to stay / staying / stayed). Permission at home,
// at school and with friends.
// Choose, two kinds: 14 pick the verb after let + object (base vs to + verb,
// -ing, past: the placement's own errors); 6 pick let + object (let me /
// let us vs "allow me" with no to, "let me to" and the subject pronoun
// "let I / let we": Uzbek and Russian learners carry over "allow + verb" and
// subject forms). Kind-2 subjects are plural, a modal or an imperative, so
// "let" is right in any tense.
// Sibling scope: no make / help / want + object (make-bare, help-pattern,
// want-object-infinitive), no "Let's" suggestions (imperatives.lets).
// "Let me + verb" offers appear twice in choose, once in build.
// Build: "Write the verb in brackets in the right form."; cue -s / -ing /
// past; the learner types the base verb.
// Transform: 5 allow … to … → let / 5 correct the mistake / 5 "X says I can
// …" → X lets me …
//
// Run: node tools/grammar-practice/authored/verb-patterns.object-infinitive.let-bare.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "object-infinitive", topic: "let-bare", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const VF = (v, ing, past) => [v, `to ${v}`, ing, past];
const W_V = (v) => `After let + person, use the base verb, with no to and no -ing: let … ${v}.`;
const OBJ = (o, subj) => [`let ${o}`, `allow ${o}`, `let ${o} to`, `let ${subj}`];
const W_O = (o) => `Use let + ${o} + base verb. Allow needs to (allow ${o} to …), and after let use ${o}, not a subject word.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  // verb after let + object (14)
  [VF("stay", "staying", "stayed"), "stay", "My parents don't let me ______ out late with my {who} on {day}.",
    { who: ["friends", "cousins", "classmates", "neighbours"], day: ["weekdays", "Mondays", "school days", "Tuesdays"] }],
  [VF("use", "using", "used"), "use", "Mum lets me ______ her {thing} for my {task}.",
    { thing: ["laptop", "phone", "tablet", "printer"], task: ["homework", "project", "essay", "presentation"] }],
  [VF("drive", "driving", "drove"), "drive", "{name}'s dad let him ______ the car in the village {when}.",
    { name: HE, when: ["yesterday", "last week", "on Sunday", "last summer"] }],
  [VF("bring", "bringing", "brought"), "bring", "Our {who} teacher lets us ______ dictionaries to the {event}.",
    { who: ["English", "German", "Russian", "French"], event: ["test", "exam", "lesson", "quiz"] }],
  [VF("help", "helping", "helped"), "help", "Please let me ______ you with those {thing}, {name}.",
    { thing: ["bags", "boxes", "plates", "books"], name: NAME }],
  [VF("pick", "picking", "picked"), "pick", "My {who} lets us ______ apples from her {tree}.",
    { who: ["grandma", "aunt", "neighbour", "great-aunt"], tree: ["garden", "trees", "apple tree", "old tree"] }],
  [VF("play", "playing", "played"), "play", "The coach didn't let {name} ______ in the {match}. He was ill.",
    { name: HE, match: ["match", "final", "game", "cup match"] }],
  [VF("show", "showing", "showed"), "show", "Let me ______ you a photo of my new {thing}, {name}.",
    { thing: ["puppy", "kitten", "flat", "bike"], name: NAME }],
  [VF("touch", "touching", "touched"), "touch", "My {who} never lets me ______ his {thing}.",
    { who: ["brother", "cousin", "uncle", "dad"], thing: ["guitar", "laptop", "camera", "bike"] }],
  [VF("go", "going", "went"), "go", "Our {subj} teacher let us ______ home early {when}. It was very hot.",
    { subj: ["maths", "English", "art", "history"], when: ["today", "yesterday", "on Friday", "last week"] }],
  [VF("come", "coming", "came"), "come", "Will your parents let you ______ to the {event} with us, {name}?",
    { event: ["concert", "cinema", "match", "party"], name: NAME }],
  [VF("watch", "watching", "watched"), "watch", "My {who} lets her children ______ cartoons after school.",
    { who: ["aunt", "sister", "neighbour", "cousin Malika"] }],
  [VF("sleep", "sleeping", "slept"), "sleep", "Don't let the {pet} ______ on the sofa, {name}.",
    { pet: ["cat", "dog", "puppy", "kitten"], name: NAME }],
  [VF("choose", "choosing", "chose"), "choose", "{who} let me ______ the {thing} for my birthday.",
    { who: ["Dad", "Mum", "Grandma", "My uncle"], thing: ["cake", "music", "restaurant", "film"] }],
  // let + object (6)
  [OBJ("me", "I"), "me", "My parents don't ______ use my {device} after {time}.",
    { device: ["phone", "tablet", "laptop", "computer"], time: ["ten", "nine", "eleven", "half past nine"] }],
  [OBJ("us", "we"), "us", "The {who} ______ play on the big field after {when}.",
    { who: ["teachers", "coaches", "PE teachers", "older students"], when: ["lunch", "school", "the test", "class"] }],
  [OBJ("me", "I"), "me", "My grandparents ______ stay up late when I visit them in {city}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  [OBJ("me", "I"), "me", "Please ______ explain, {name}. It isn't my fault!",
    { name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [OBJ("you", "your"), "you", "Your parents should ______ choose your own {thing}, {name}.",
    { thing: ["clothes", "friends", "hobbies", "music"], name: NAME }],
  [OBJ("us", "we"), "us", "The guides at the {place} didn't ______ take photos inside.",
    { place: ["museum", "gallery", "palace", "old fortress"] }],
].map(([base, v, prompt, slots], i) => {
  const options = rot(base, i);
  const isObj = base[0].startsWith("let ");
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: isObj ? W_O(v) : W_V(v), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets in the right form.";
const BUILD = [
  ["go", "My parents let me ______ (went) to {city} with my {who}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], who: ["class", "friends", "cousins", "team"] }],
  ["eat", "Mum doesn't let us ______ (eats) {food} before {meal}.",
    { food: ["sweets", "chips", "ice cream", "cake"], meal: ["dinner", "lunch", "breakfast", "bed"] }],
  ["listen", "Our teacher lets us ______ (listening) to music in the {lesson} lesson {when}.",
    { lesson: ["art", "craft", "computer", "design"], when: ["on Fridays", "sometimes", "at the end", "after the test"] }],
  ["use", "Can you let me ______ (uses) your {thing} for a minute, {name}?",
    { thing: ["pen", "phone", "charger", "ruler"], name: NAME }],
  ["cook", "{name}'s mum lets her ______ (cooking) dinner on {day}.",
    { name: SHE, day: ["Saturdays", "Sundays", "Fridays", "Wednesdays"] }],
  ["get", "The driver let us ______ (got) off the {bus} near the {place}.",
    { bus: ["bus", "minibus", "tram", "coach"], place: ["bazaar", "park", "school", "hospital"] }],
  ["stay", "{who} let me ______ (stays) at {friend} house last weekend.",
    { who: ["Dad", "Mum", "My mum", "Grandma"], friend: ["Aziz's", "Timur's", "my cousin's", "my friend's"] }],
  ["go", "Please let the {pet} ______ (going) out, {name}. It wants to play.",
    { pet: ["dog", "cat", "puppy", "kitten"], name: NAME }],
  ["wear", "My big sister lets me ______ (wore) her {thing} sometimes, {name}.",
    { thing: ["jacket", "scarf", "dress", "hat"], name: NAME }],
  ["sit", "The teacher let {name} ______ (sits) next to his {who}.",
    { name: HE, who: ["friend", "cousin", "brother", "best friend"] }],
  ["ride", "My uncle lets me ______ (rides) his {thing} in the {place}.",
    { thing: ["horse", "bike", "motorbike", "donkey"], place: ["village", "park", "countryside", "field"] }],
  ["drink", "Our {sport} coach doesn't let us ______ (drank) cold water after the {event}.",
    { sport: ["football", "volleyball", "running", "basketball"], event: ["training", "practice", "run", "warm-up"] }],
  ["carry", "Let me ______ (carrying) your {thing}, {name}. It looks heavy.",
    { thing: ["bag", "box", "suitcase", "backpack"], name: NAME }],
  ["play", "My parents let my {sib} ______ (plays) computer games for {time} a day.",
    { sib: ["brother", "sister", "little brother", "cousin"], time: ["an hour", "two hours", "thirty minutes", "half an hour"] }],
  ["take", "Will your teacher let you ______ (taking) the test {when}, {name}?",
    { when: ["again", "later", "next week", "tomorrow"], name: NAME }],
  ["feed", "Grandpa let us ______ (feeds) the {animal} on his farm, {name}.",
    { animal: ["chickens", "sheep", "cows", "goats"], name: NAME }],
  ["burn", "Don't let the {food} ______ (burning), {name}!",
    { food: ["rice", "onions", "bread", "meat"], name: NAME }],
  ["decide", "My mum lets me ______ (decided) what to wear {when}, {name}.",
    { when: ["on weekends", "on holidays", "to parties", "every day"], name: NAME }],
  ["try", "The shop assistant let me ______ (tries) on the {thing}.",
    { thing: ["jacket", "shoes", "dress", "hat"] }],
  ["leave", "{t} let the {who} ______ (leaves) ten minutes early.",
    { t: ["Mr Karimov", "Ms Ivanova", "Our teacher", "The coach"], who: ["students", "class", "children", "boys"] }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: v, why: W_V(v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ALLOW = "Rewrite the sentence with let. Keep the same tense.";
const COR = "Correct the mistake.";
const CAN = "Rewrite the sentence with let.";
const TRANSFORM = [
  // allow … to … -> let (5)
  [ALLOW, "My parents allow me to stay out until {time}.", "My parents ______ out until {time}.", "let me stay",
    "allow + person + to + verb → let + person + base verb: let me stay.", { time: ["nine", "ten", "eleven", "half past nine"] }],
  [ALLOW, "{who} allows us to watch TV after {task}.", "{who} ______ TV after {task}.", "lets us watch",
    "allows us to watch → lets us watch (he / she + lets, then the base verb).", { who: ["Mum", "Dad", "Grandma", "Aunt Lola"], task: ["dinner", "our homework", "school", "lunch"] }],
  [ALLOW, "The {who} allowed him to go home. He felt {state}.", "The {who} ______ home. He felt {state}.", "let him go",
    "The past of let is let: allowed him to go → let him go.", { who: ["teacher", "coach", "PE teacher", "head teacher"], state: ["ill", "sick", "unwell", "very tired"] }],
  [ALLOW, "Our neighbours allowed us to use their {thing} {when}.", "Our neighbours ______ their {thing} {when}.", "let us use",
    "The past of let is let: allowed us to use → let us use.", { thing: ["garden", "car", "ladder", "pool"], when: ["last summer", "yesterday", "on Sunday", "last week"] }],
  [ALLOW, "My sister never allows me to read her {thing}.", "My sister never ______ her {thing}.", "lets me read",
    "allows me to read → lets me read: no to after let.", { thing: ["diary", "messages", "letters", "notes"] }],
  // correct the mistake (5)
  [COR, "{who} lets me to drive his car in the {place}.", "{who} lets me ______ his car in the {place}.", "drive",
    "After let + person there is no to: lets me drive.", { who: ["Dad", "Uncle Bobur", "Grandpa", "My uncle"], place: ["village", "empty car park", "field", "countryside"] }],
  [COR, "My {who} didn't let me going to the {event}.", "My {who} didn't let me ______ to the {event}.", "go",
    "After let + person, use the base verb, not -ing: let me go.", { who: ["parents", "grandparents", "mum and dad", "family"], event: ["party", "concert", "match", "wedding"] }],
  [COR, "The {who} let we play in the {match}.", "The {who} ______ play in the {match}.", "let us",
    "After let, use the object word us, not we: let us play.", { who: ["coach", "teacher", "PE teacher", "sports teacher"], match: ["final", "big match", "cup match", "game"] }],
  [COR, "Mum lets {name} watched cartoons in the {time}.", "Mum lets {name} ______ cartoons in the {time}.", "watch",
    "After let + person, use the base verb, not the past form: lets … watch.", { name: NAME, time: ["morning", "evening", "afternoon", "holidays"] }],
  [COR, "Let me helping you with the {thing}, {name}.", "Let me ______ you with the {thing}, {name}.", "help",
    "After let me, use the base verb, not -ing: let me help.", { thing: ["dishes", "bags", "homework", "shopping"], name: NAME }],
  // X says I can … -> X lets me … (5)
  [CAN, "{who} says I can use her {thing}.", "{who} ______ her {thing}.", "lets me use",
    "says I can use → lets me use (let + me + base verb).", { who: ["Mum", "Grandma", "My sister", "Aunt Lola"], thing: ["laptop", "phone", "camera", "bike"] }],
  [CAN, "Our {subj} teacher says we can leave early {when}.", "Our {subj} teacher ______ early {when}.", "lets us leave",
    "says we can leave → lets us leave (let + us + base verb).", { subj: ["maths", "English", "art", "music"], when: ["on Fridays", "after tests", "on hot days", "before holidays"] }],
  [CAN, "My parents say I can go to {city} with my {who}.", "My parents ______ to {city} with my {who}.", "let me go",
    "say I can go → let me go (let + me + base verb).", { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], who: ["friends", "class", "cousins", "team"] }],
  [CAN, "Dad says {name} can stay up until {time}.", "Dad ______ up until {time}. {name} is very happy.", "lets him stay",
    "says he can stay → lets him stay (let + him + base verb).", { name: HE, time: ["eleven", "midnight", "ten", "half past ten"] }],
  [CAN, "{who} says we can pick the {fruit} in her garden.", "{who} ______ the {fruit} in her garden.", "lets us pick",
    "says we can pick → lets us pick (let + us + base verb).", { who: ["Grandma", "Aunt Lola", "Our neighbour", "Mrs Karimova"], fruit: ["apples", "cherries", "apricots", "grapes"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one thing your parents let you do at the weekend.", "My parents let me + base verb", ["exactly one sentence", "must use let me", "no to after let me"]],
  ["Write one thing your parents don't let you do.", "don't let me + base verb", ["exactly one sentence", "must use don't let me", "a reason"]],
  ["Write one thing a teacher at your school lets students do.", "lets us / lets students + base verb", ["exactly one sentence", "must use lets", "a school word"]],
  ["Write one sentence about a time someone let you do something new.", "let me + base verb (past)", ["exactly one sentence", "a past time word", "base verb after let me"]],
  ["Offer to help someone with Let me … .", "Let me + base verb", ["exactly one sentence", "start with Let me", "a thing word"]],
  ["Write one thing you let your little brother, sister or friend do.", "I let him / her + base verb", ["exactly one sentence", "him or her after let", "base verb"]],
  ["Write one rule for a pet in your home with don't let.", "Don't let the … + base verb", ["exactly one sentence", "start with Don't let", "an animal word"]],
  ["Write two sentences: one thing your family lets you do and one thing they don't let you do.", "let me / don't let me", ["exactly two sentences", "let me once", "don't let me once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What do your parents let you do, and what don't they let you do? Is it fair?", "let + object + base verb", ["let me", "don't let me", "three or four sentences"]],
  ["Describe a good teacher you know. What does he or she let students do?", "let + object + base verb", ["lets us / lets students", "a school word", "three or four sentences"]],
  ["Imagine you are a parent. What will you let your children do?", "let + object + base verb", ["let them + base verb", "won't let them once", "three or four sentences"]],
  ["Tell a friend about a visit to your grandparents. What did they let you do?", "let + object + base verb (past)", ["let me / let us", "a past time word", "three or four sentences"]],
  ["Write the house rules for your pet or a friend's pet.", "let + object + base verb", ["don't let it / let it", "an animal word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.object-infinitive.let-bare.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);