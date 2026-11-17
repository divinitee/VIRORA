// Hand-authored: conditionals-wishes / zero-first / zero-general-truth (A2).
// Path fill P56 (Claude lane, branch grammar-path-fill-claude, 17 Nov 2026).
//
// Tests the zero conditional: when something is ALWAYS true, both parts take
// the present simple ("If you heat ice, it melts").
//
// Second-answer guard: the placement bank offers "will melt" as a wrong answer
// in the result part, but "If you heat ice, it will melt" is correct English.
// So here "will + verb" is a wrong answer ONLY in the if-part ("If you will
// heat ...", always wrong). In the result part the wrong answers are the
// past, the -ing form and a missing or extra -s.
// Every sentence is a general fact or a habit, never one future event (that
// is the first conditional: first-if-clause, first-will).
// Typed build keys are always third-person forms (melts, is, has, goes): a
// key may not repeat the bracket word, so "you ______ (mix)" cannot be typed.
//
// Run: node tools/grammar-practice/authored/conditionals-wishes.zero-first.zero-general-truth.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "conditionals-wishes", branch: "zero-first", topic: "zero-general-truth", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const F4 = ["Lola", "Madina", "Kamila", "Nodira"];
const M4 = ["Aziz", "Timur", "Bobur", "Sardor"];
const W_IF = "For something that is always true, the if-part takes the present simple. Never will after if.";
const W_RES = "When the result is always true, both parts take the present simple.";

/* ---------------- choose: 20 mcq ---------------- */
const I = (opts, prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts, key: 0, why: W_IF, slots });
const R = (opts, prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts, key: 0, why: W_RES, slots });
const CHOOSE = [
  I(["mix", "will mix", "mixed", "mixing"], "If you ______ blue and yellow, you get green, {name}.", { name: N4 }),
  I(["rains", "will rain", "rained", "raining"], "If it ______ in {season}, the {place} get very wet.",
    { season: ["spring", "autumn", "winter", "November"], place: ["roads", "streets", "fields", "paths"] }),
  I(["eat", "will eat", "ate", "eating"], "If people ______ too much {thing}, they get ill, {name}.",
    { thing: ["sugar", "salt", "fast food", "fat"], name: P4 }),
  I(["is", "will be", "was", "being"], "If a {pet} ______ hungry, it {does}.",
    { pet: ["cat", "dog", "puppy", "kitten"], does: ["makes a noise", "comes to the kitchen", "waits by its bowl", "looks at you"] }),
  I(["put", "will put", "putting", "puts"], "If you ______ {liquid} in the freezer, it turns into ice, {name}.",
    { liquid: ["water", "juice", "milk", "tea"], name: N4 }),
  I(["drink", "will drink", "drank", "drinking"], "If I ______ coffee {time}, I can't sleep, {name}.",
    { time: ["in the evening", "late at night", "after six", "after dinner"], name: P4 }),
  I(["works", "will work", "worked", "working"], "If my {relative} ______ late, he always calls {who}.",
    { relative: ["father", "uncle", "brother", "grandfather"], who: ["us", "home", "my mother", "Grandma"] }),
  I(["press", "will press", "pressed", "pressing"], "If you ______ this button, the {machine} starts, {name}.",
    { machine: ["machine", "printer", "washing machine", "lift"], name: N4 }),
  I(["don't get", "won't get", "didn't get", "not get"], "If {plants} ______ any water, they die.",
    { plants: ["plants", "flowers", "trees", "tomatoes"] }),
  I(["gets up", "will get up", "got up", "getting up"], "If {name} ______ early on {day}, she is tired all day.",
    { name: F4, day: ["Mondays", "Saturdays", "Sundays", "school days"] }),
  R(["melts", "melted", "melting", "melt"], "If you heat {thing}, it ______, {name}.",
    { thing: ["ice", "butter", "chocolate", "snow"], name: N4 }),
  R(["die", "died", "dying", "dies"], "If you don't water {plants}, they ______, {name}.",
    { plants: ["plants", "flowers", "tomatoes", "young trees"], name: P4 }),
  R(["freezes", "froze", "freezing", "freeze"], "If the temperature falls below zero, the water in the {place} ______, {name}.",
    { place: ["river", "lake", "bucket", "pond"], name: N4 }),
  R(["feel", "felt", "feeling", "feels"], "If I eat {food}, I ______ ill, {name}.",
    { food: ["too much chocolate", "a lot of ice cream", "very spicy food", "too many sweets"], name: P4 }),
  R(["gets", "got", "getting", "get"], "If {name} is late for the {lesson}, the teacher ______ angry.",
    { name: ["Aziz", "Lola", "Madina", "Timur"], lesson: ["first lesson", "test", "class", "meeting"] }),
  R(["get", "got", "getting", "gets"], "If you mix red and white, you ______ pink, {name}.", { name: N4 }),
  R(["stays", "stayed", "staying", "stay"], "If it is very hot, my {relative} ______ in the {place}.",
    { relative: ["grandmother", "grandfather", "aunt", "uncle"], place: ["house", "shade", "garden", "kitchen"] }),
  R(["walk", "walked", "walking", "walks"], "If the {bus} doesn't come, we ______ to {place}.",
    { bus: ["bus", "minibus", "tram", "train"], place: ["school", "work", "the centre", "the station"] }),
  R(["cry", "cried", "crying", "cries"], "If babies are {state}, they ______, {name}.",
    { state: ["hungry", "tired", "cold", "wet"], name: N4 }),
  R(["opens", "opened", "opening", "open"], "If you press the {colour} button, the door ______, {name}.",
    { colour: ["green", "red", "blue", "yellow"], name: P4 }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the verb in brackets in the present simple.";
const B = (key, why, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots });
const BUILD = [
  B("reaches", W_IF, "{name}, if water ______ (reach) 100 degrees, it boils.", { name: N4 }),
  B("gets", W_RES, "If you heat {metal}, it ______ (get) hot quickly, {name}.", { metal: ["metal", "iron", "a spoon", "a pan"], name: P4 }),
  B("drinks", W_IF, "If my {relative} ______ (drink) tea at night, he can't sleep.", { relative: ["father", "uncle", "grandfather", "brother"] }),
  B("shines", W_IF, "If the sun ______ (shine), the {kids} play in the {place}.", { kids: ["children", "boys", "girls", "twins"], place: ["yard", "park", "garden", "street"] }),
  B("has", W_IF, "If {name} ______ (have) a test, she studies all {time}.", { name: F4, time: ["evening", "night", "weekend", "day"] }),
  B("snows", W_IF, "If it ______ (snow), the {bus} is always late, {name}.", { bus: ["bus", "train", "tram", "minibus"], name: N4 }),
  B("falls", W_RES, "If you drop a {thing}, it ______ (fall) down, {name}.", { thing: ["ball", "book", "cup", "stone"], name: N4 }),
  B("sees", W_IF, "{name}, if a {pet} ______ (see) a bird, it runs after it.", { name: P4, pet: ["cat", "dog", "kitten", "puppy"] }),
  B("comes", W_IF, "If our {relative} ______ (come), we always eat {food}.", { relative: ["grandmother", "uncle", "aunt", "grandfather"], food: ["plov", "manti", "samsa", "cake"] }),
  B("is", W_IF, "If the {thing} ______ (be) very cold, the car doesn't start, {name}.", { thing: ["weather", "engine", "morning", "night"], name: N4 }),
  B("feels", W_RES, "If you don't eat {meal}, your body ______ (feel) weak, {name}.", { meal: ["breakfast", "lunch", "anything", "enough"], name: P4 }),
  B("rings", W_IF, "If a phone ______ (ring) in class, the {teacher} gets angry, {name}.", { teacher: ["teacher", "tutor", "director", "class teacher"], name: N4 }),
  B("goes", W_IF, "If {name} ______ (go) to bed late, he is sleepy at {place}.", { name: M4, place: ["school", "work", "the lesson", "training"] }),
  B("goes", W_RES, "If you leave {food} in the sun, it ______ (go) bad, {name}.", { food: ["milk", "fish", "meat", "butter"], name: N4 }),
  B("watches", W_IF, "{name}, if my little brother ______ (watch) {films}, he doesn't sleep.", { name: P4, films: ["scary films", "horror films", "the news", "TV at night"] }),
  B("rises", W_IF, "If the {river} ______ (rise), the road is closed, {name}.", { river: ["river", "water", "canal", "lake"], name: N4 }),
  B("melts", W_RES, "{name}, ice ______ (melt) if you leave it in the {place}.", { name: N4, place: ["sun", "kitchen", "car", "warm room"] }),
  B("dies", W_RES, "A plant ______ (die) if it gets no {thing}.", { thing: ["water", "light", "sun", "air"] }),
  B("gets", W_RES, "My {relative} ______ (get) a headache if she reads in the {place}.", { relative: ["mother", "aunt", "sister", "grandmother"], place: ["car", "bus", "dark", "train"] }),
  B("stops", W_RES, "{name}, the {machine} ______ (stop) if you open the door.", { name: P4, machine: ["washing machine", "microwave", "lift", "machine"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the verb in the if-part. The sentence is about something that is always true.";
const SUBJ = "Rewrite the sentence for the new subject. Keep the present simple.";
const IF = "Say the same thing with if. Use the present simple in both parts.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // will in the if-part (5)
  T(FIX, "If you will heat {thing}, it melts, {name}.", "If you ______ {thing}, it melts, {name}.", "heat", W_IF,
    { thing: ["ice", "butter", "chocolate", "snow"], name: N4 }),
  T(FIX, "If it will rain, the {who} stay at {place}.", "If it ______, the {who} stay at {place}.", "rains", W_IF,
    { who: ["children", "boys", "girls", "twins"], place: ["home", "school", "Grandma's", "the club"] }),
  T(FIX, "If {name} will be tired, he goes to bed {when}.", "If {name} ______ tired, he goes to bed {when}.", "is", W_IF,
    { name: M4, when: ["early", "at nine", "before ten", "after dinner"] }),
  T(FIX, "If people will eat too much {thing}, they feel ill, {name}.", "If people ______ too much {thing}, they feel ill, {name}.", "eat", W_IF,
    { thing: ["sugar", "salt", "fast food", "chocolate"], name: P4 }),
  T(FIX, "If the {bus} will be late, I walk to {place}.", "If the {bus} ______ late, I walk to {place}.", "is", W_IF,
    { bus: ["bus", "tram", "train", "minibus"], place: ["school", "work", "the centre", "the station"] }),
  // new subject (5)
  T(SUBJ, "If babies are {state}, they cry, {name}.", "If a baby ______ {state}, it ______, {name}.", ["is", "cries"],
    "A baby is one, so the verbs change: is, cries. Both parts stay in the present simple.", { state: ["hungry", "tired", "cold", "wet"], name: N4 }),
  T(SUBJ, "If I drink coffee {when}, I can't sleep.", "If my {relative} ______ coffee {when}, she can't sleep.", "drinks",
    "My mother / aunt / sister is she, so the verb takes -s: drinks.", { when: ["in the evening", "late at night", "after six", "after dinner"], relative: ["mother", "aunt", "sister", "grandmother"] }),
  T(SUBJ, "If we are late, the {teacher} gets angry.", "If {name} ______ late, the {teacher} gets angry.", "is",
    "One person takes is. Both parts stay in the present simple.", { teacher: ["teacher", "coach", "tutor", "director"], name: ["Aziz", "Lola", "Madina", "Timur"] }),
  T(SUBJ, "If dogs see a {animal}, they run after it, {name}.", "If our dog ______ a {animal}, it ______ after it, {name}.", ["sees", "runs"],
    "Our dog is one, so both verbs take -s: sees, runs.", { animal: ["cat", "bird", "rabbit", "squirrel"], name: P4 }),
  T(SUBJ, "If you sleep badly, you feel tired all {time}.", "If {name} ______ badly, he ______ tired all {time}.", ["sleeps", "feels"],
    "One person (he) takes -s on both verbs: sleeps, feels.", { time: ["day", "morning", "week", "afternoon"], name: M4 }),
  // another structure -> if (5)
  T(IF, "{name}, people who eat too much {thing} get ill.", "{name}, if people ______ too much {thing}, they ______ ill.", ["eat", "get"], W_RES,
    { name: N4, thing: ["sugar", "salt", "fast food", "fat"] }),
  T(IF, "{name}, {thing} melts when you heat it.", "{name}, if you ______ {thing}, it ______.", ["heat", "melts"], W_RES,
    { name: N4, thing: ["ice", "butter", "chocolate", "snow"] }),
  T(IF, "{name}, {plants} that get no water die.", "{name}, if {plants} ______ no water, they ______.", ["get", "die"], W_RES,
    { name: P4, plants: ["plants", "flowers", "trees", "tomatoes"] }),
  T(IF, "Mixing blue and yellow gives green, {name}.", "If you ______ blue and yellow, you ______ green, {name}.", ["mix", "get"], W_RES,
    { name: N4 }),
  T(IF, "{name}, a {pet} that is hungry makes a lot of noise.", "{name}, if a {pet} ______ hungry, it ______ a lot of noise.", ["is", "makes"], W_RES,
    { name: N4, pet: ["cat", "dog", "puppy", "kitten"] }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one true sentence about ice, water or snow. Start with If.", "If + present simple, present simple", ["exactly one sentence", "must start with If", "present simple in both parts"]],
  ["Write one sentence about what happens if you don't sleep enough.", "If + present simple, present simple", ["exactly one sentence", "must use if", "present simple in both parts"]],
  ["Write one sentence about what you always do if it rains.", "If it rains, I + present simple", ["exactly one sentence", "must use If it rains", "present simple in both parts"]],
  ["Write one sentence about what your teacher does if a student is late.", "If + present simple, present simple", ["exactly one sentence", "must be about a teacher", "present simple in both parts"]],
  ["Write one sentence about plants or animals that is always true. Use if.", "If + present simple, present simple", ["exactly one sentence", "must use if", "no will"]],
  ["Write one sentence about what happens if you mix two colours.", "If you mix ..., you get ...", ["exactly one sentence", "must name two colours", "present simple in both parts"]],
  ["Write two sentences about your habits: what you do if you are tired, and what you do if you are hungry.", "two zero conditionals", ["exactly two sentences", "if in both", "present simple in both parts"]],
  ["A friend wrote: \"If you will heat water, it boiling.\" Write the sentence correctly.", "If you heat water, it boils", ["exactly one sentence", "must use heat", "must use boils"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write three or four facts about nature that are always true. Start each one with If.",
    "zero conditional: present simple in both parts", ["if + present simple", "present simple result", "no will after if"]],
  ["What do you usually do if you are tired, hungry, bored or late? Write three or four sentences.",
    "zero conditional for habits", ["if + present simple", "present simple result", "at least three different situations"]],
  ["Explain the rules at your school or at home. What happens if someone is late, forgets homework or uses a phone? Write three or four sentences.",
    "zero conditional for rules", ["if + present simple", "present simple result", "third-person -s where needed"]],
  ["Give health advice as general truths: what happens if people eat too much sugar, sleep too little or never do sport? Write three or four sentences.",
    "zero conditional for general truths", ["if + present simple", "present simple result", "no will after if"]],
  ["Describe how something works (a phone, a kettle, a bus card or a machine). What happens if you press, open or turn something? Write three or four sentences.",
    "zero conditional for how things work", ["if you + present simple", "present simple result", "at least three steps"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/conditionals-wishes.zero-first.zero-general-truth.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
