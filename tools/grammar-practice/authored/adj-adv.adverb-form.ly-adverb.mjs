// Hand-authored: adj-adv / adverb-form / ly-adverb (A2).
// Path fill P34 (Claude lane, branch grammar-path-fill-claude, 16 Nov 2026).
//
// Tests the placement bank's two points: an -ly adverb (not the adjective)
// says HOW an action is done ("He drove carefully"), and an adjective ending
// in -y changes y to i (happy -> happily).
//
// Scope: every blank modifies an ACTION verb. No be / feel / look / seem +
// adjective (that is adjective-after-be, P29) and no well / hard / fast / late
// (irregular-adverb, P35). slow, quick and loud are left out on purpose:
// "drive slow" and "talk loud" are heard from native speakers, so the
// adjective would not be a clean wrong answer.
//
// Run: node tools/grammar-practice/authored/adj-adv.adverb-form.ly-adverb.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "adverb-form", topic: "ly-adverb", level: "A2", pv: "2.5" };
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const F4 = ["Lola", "Madina", "Kamila", "Nodira"];
const ily = (adj) => `${adj.slice(0, -1)}ily`;
const WHY = (adj, adv) => (adj.endsWith("y")
  ? `${cap(adj)} ends in -y, so change y to i and add -ly: ${adv}. The adverb says how the action is done.`
  : `To say how someone does something, use an adverb, not an adjective: ${adj} + -ly = ${adv}.`);

/* ---------------- choose: 20 mcq ---------------- */
// regular: [adjective, adverb, a wrong spelling]; -y adjectives: adverb is built by ily()
const R = (adj, adv, bad, prompt, slots) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: [adv, adj, bad, `more ${adj}`], key: 0, why: WHY(adj, adv), slots,
});
const Y = (adj, prompt, slots) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: [ily(adj), adj, `${adj}ly`, `${adj.slice(0, -1)}ly`], key: 0, why: WHY(adj, ily(adj)), slots,
});
const CHOOSE = [
  R("careful", "carefully", "carefuly", "Please drive ______, {name}. The road is {adj}.",
    { name: P4, adj: ["wet", "icy", "narrow", "busy"] }),
  R("quiet", "quietly", "quitely", "The {who} are sleeping, so please talk ______, {name}.",
    { who: ["children", "twins", "babies", "boys"], name: N4 }),
  R("beautiful", "beautifully", "beautifuly", "{name} sings ______ at every school {event}.",
    { name: ["Lola", "Aziz", "Madina", "Timur"], event: ["concert", "party", "show", "festival"] }),
  R("polite", "politely", "politly", "The {person} answered every question ______ and {did}.",
    { person: ["waiter", "doctor", "shop assistant", "driver"], did: ["smiled", "helped us", "showed us the way", "gave us a map"] }),
  R("clear", "clearly", "clearley", "Our {teacher} explains {subject} very ______.",
    { teacher: ["teacher", "coach", "tutor", "trainer"], subject: ["grammar", "maths", "the rules", "everything"] }),
  R("bad", "badly", "badley", "I slept ______ last night because of the {noise}, {name}.",
    { noise: ["noise", "heat", "storm", "music next door"], name: P4 }),
  R("correct", "correctly", "correctley", "{name} answered all the {things} ______ and got a {grade}.",
    { name: ["Aziz", "Lola", "Madina", "Timur"], things: ["questions", "tasks", "exercises", "problems"], grade: ["five", "top mark", "prize", "good mark"] }),
  R("nervous", "nervously", "nervousely", "{name} waited ______ outside the {place}.",
    { name: ["Aziz", "Lola", "My brother", "Timur"], place: ["exam room", "director's office", "doctor's room", "interview room"] }),
  R("safe", "safely", "safly", "We arrived ______ in {city} after a long {trip}.",
    { city: ["Samarkand", "Bukhara", "Nukus", "Fergana"], trip: ["drive", "flight", "journey", "bus ride"] }),
  R("kind", "kindly", "kindely", "The old man spoke ______ to the {who} in the {place}.",
    { who: ["children", "tourists", "students", "boys"], place: ["park", "street", "shop", "yard"] }),
  R("patient", "patiently", "patiantly", "My {relative} teaches me to {skill} very ______.",
    { relative: ["grandfather", "mother", "aunt", "uncle"], skill: ["drive", "cook", "swim", "play chess"] }),
  R("neat", "neatly", "neatley", "{name} always writes ______ in her {book}.",
    { name: F4, book: ["notebook", "diary", "copybook", "workbook"] }),
  R("warm", "warmly", "warmley", "Grandma smiled ______ at the {who} and gave them {food}.",
    { who: ["children", "guests", "boys", "neighbours"], food: ["tea", "sweets", "bread", "fruit"] }),
  Y("happy", "The {kids} are playing ______ in the {place}.",
    { kids: ["children", "boys", "girls", "twins"], place: ["yard", "park", "garden", "snow"] }),
  Y("easy", "{name} won the {game} ______. Nobody was close.",
    { name: ["Aziz", "Lola", "Madina", "Timur"], game: ["race", "match", "game", "competition"] }),
  Y("angry", "The {person} shouted ______ at the {who}.",
    { person: ["driver", "man", "shopkeeper", "guard"], who: ["dog", "boys", "car in front", "birds"] }),
  Y("noisy", "My little {sib} eats ______, {name}. It's funny.",
    { sib: ["brother", "sister", "cousin", "nephew"], name: N4 }),
  Y("heavy", "It is raining ______ in {city}, so take {thing}.",
    { city: ["Tashkent", "Samarkand", "Andijan", "Namangan"], thing: ["an umbrella", "a raincoat", "your boots", "a taxi"] }),
  Y("hungry", "After the {event}, the {who} ate ______.",
    { event: ["match", "long walk", "race", "swim"], who: ["boys", "players", "children", "team"] }),
  Y("sleepy", "{name} walked ______ to the {room} for breakfast.",
    { name: ["Aziz", "Lola", "My brother", "Grandpa"], room: ["kitchen", "table", "dining room", "living room"] }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the adverb form of the word in brackets.";
const B = (adj, adv, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: adv, why: WHY(adj, adv), slots });
const BUILD = [
  B("proud", "proudly", "{name} showed us her {thing} ______ (proud).",
    { name: F4, thing: ["medal", "drawing", "certificate", "new bike"] }),
  B("sad", "sadly", "The {who} looked at the empty {thing} ______ (sad).",
    { who: ["boy", "child", "little girl", "puppy"], thing: ["plate", "box", "bowl", "bag"] }),
  B("brave", "bravely", "The {person} ran ______ (brave) into the {place} to save the {pet}.",
    { person: ["fireman", "neighbour", "young man", "driver"], place: ["house", "yard", "garage", "shed"], pet: ["cat", "dog", "kitten", "puppy"] }),
  B("calm", "calmly", "Please speak ______ (calm), {name}. I can't understand you when you {do}.",
    { name: N4, do: ["shout", "cry", "talk so fast", "are angry"] }),
  B("honest", "honestly", "{name} answered the {person}'s questions ______ (honest).",
    { name: ["Aziz", "Lola", "Madina", "Timur"], person: ["teacher", "doctor", "director", "coach"] }),
  B("serious", "seriously", "Our {team} trains ______ (serious) before every {event}.",
    { team: ["team", "club", "class", "group"], event: ["match", "game", "competition", "tournament"] }),
  B("perfect", "perfectly", "{name} speaks {lang} ______ (perfect) after {n} years there.",
    { name: ["Aziz", "Lola", "My uncle", "Timur"], lang: ["Korean", "Turkish", "German", "Russian"], n: ["five", "ten", "six", "eight"] }),
  B("soft", "softly", "My {relative} sings ______ (soft) to the baby every {time}.",
    { relative: ["mother", "aunt", "grandmother", "sister"], time: ["night", "evening", "afternoon", "day"] }),
  B("nice", "nicely", "{name} always talks ______ (nice) to the {who}.",
    { name: ["Aziz", "Lola", "Madina", "Timur"], who: ["new students", "neighbours", "little children", "guests"] }),
  B("quiet", "quietly", "{name}, we closed the door ______ (quiet) because {who} was asleep.",
    { name: N4, who: ["the baby", "Grandpa", "Dad", "my sister"] }),
  B("careful", "carefully", "Carry the {thing} ______ (careful) to the {place}, {name}.",
    { thing: ["glasses", "plates", "eggs", "cake"], place: ["table", "kitchen", "car", "living room"], name: N4 }),
  B("clear", "clearly", "Please write your {thing} ______ (clear) on the {paper}.",
    { thing: ["name", "address", "answer", "phone number"], paper: ["form", "paper", "first page", "card"] }),
  B("polite", "politely", "The {who} asked ______ (polite) for {thing}.",
    { who: ["tourist", "boy", "new student", "customer"], thing: ["help", "directions", "a glass of water", "the bill"] }),
  B("happy", "happily", "The {pet} is running ______ (happy) around the {place}.",
    { pet: ["dog", "puppy", "kitten", "goat"], place: ["yard", "garden", "field", "park"] }),
  B("easy", "easily", "You can find the {place} ______ (easy), {name}. It is next to the {landmark}.",
    { place: ["cafe", "library", "hotel", "clinic"], name: N4, landmark: ["bank", "big park", "station", "school"] }),
  B("angry", "angrily", "{name} closed the {thing} ______ (angry) and left the room.",
    { name: ["Aziz", "Lola", "My brother", "Timur"], thing: ["door", "book", "laptop", "window"] }),
  B("noisy", "noisily", "The {who} ran ______ (noisy) down the {place}.",
    { who: ["children", "boys", "students", "kids"], place: ["stairs", "corridor", "street", "hall"] }),
  B("lazy", "lazily", "The {pet} is lying ______ (lazy) in the {place}.",
    { pet: ["cat", "dog", "old cat", "big dog"], place: ["sun", "garden", "yard", "shade"] }),
  B("heavy", "heavily", "It snowed ______ (heavy) in the {place} last {time}.",
    { place: ["mountains", "north", "village", "hills"], time: ["night", "week", "weekend", "winter"] }),
  B("hungry", "hungrily", "The {who} looked ______ (hungry) at the {food}.",
    { who: ["boys", "children", "dogs", "cats"], food: ["plov", "bread", "cakes", "meat"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const VERB = "Say the same thing with a verb and an adverb.";
const FIX = "Correct the mistake. An adverb says how the action is done.";
const SPELL = "Correct the spelling of the adverb.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // adjective + noun -> verb + adverb (5)
  T(VERB, "My {relative} is a careful driver, {name}.", "My {relative} drives ______, {name}.", "carefully",
    "A careful driver drives carefully: the adjective describes the person, the adverb describes the action.",
    { relative: ["father", "uncle", "brother", "grandfather"], name: N4 }),
  T(VERB, "{name} is a beautiful singer, {voc}.", "{name} sings ______, {voc}.", "beautifully",
    "A beautiful singer sings beautifully: the adverb describes the action.",
    { name: F4, voc: P4 }),
  T(VERB, "{name}, our {person} is a patient teacher.", "{name}, our {person} teaches ______.", "patiently",
    "A patient teacher teaches patiently: the adverb describes the action.",
    { name: N4, person: ["coach", "tutor", "trainer", "neighbour"] }),
  T(VERB, "The {who} are quiet workers, {name}.", "The {who} work ______, {name}.", "quietly",
    "Quiet workers work quietly: the adverb describes the action.",
    { who: ["new students", "boys", "builders", "girls"], name: P4 }),
  T(VERB, "{name} is a neat writer, {voc}.", "{name} writes ______, {voc}.", "neatly",
    "A neat writer writes neatly: the adverb describes the action.",
    { name: ["Lola", "Aziz", "Madina", "Timur"], voc: ["Mum", "Dad", "Grandma", "Olga"] }),
  // adjective used as an adverb (5)
  T(FIX, "Please speak quiet in the {place}, {name}.", "Please speak ______ in the {place}, {name}.", "quietly", WHY("quiet", "quietly"),
    { place: ["library", "hospital", "museum", "classroom"], name: N4 }),
  T(FIX, "{name} did the {task} perfect.", "{name} did the {task} ______.", "perfectly", WHY("perfect", "perfectly"),
    { name: ["Aziz", "Lola", "Madina", "Timur"], task: ["test", "exercise", "dance", "homework"] }),
  T(FIX, "The {who} answered polite, {name}.", "The {who} answered ______, {name}.", "politely", WHY("polite", "politely"),
    { who: ["waiter", "boy", "driver", "girl"], name: P4 }),
  T(FIX, "My {relative} drives very careful in the {weather}.", "My {relative} drives very ______ in the {weather}.", "carefully", WHY("careful", "carefully"),
    { relative: ["mother", "aunt", "sister", "grandfather"], weather: ["rain", "snow", "fog", "dark"] }),
  T(FIX, "She smiled kind at the {who} and {did}.", "She smiled ______ at the {who} and {did}.", "kindly", WHY("kind", "kindly"),
    { who: ["children", "new student", "old woman", "visitors"], did: ["said hello", "opened the door", "sat down", "waved"] }),
  // -y -> -ily spelling (5)
  T(SPELL, "The {kids} are playing happyly in the {place}.", "The {kids} are playing ______ in the {place}.", "happily", WHY("happy", "happily"),
    { kids: ["children", "boys", "girls", "twins"], place: ["yard", "park", "garden", "street"] }),
  T(SPELL, "{name} passed the {test} easyly.", "{name} passed the {test} ______.", "easily", WHY("easy", "easily"),
    { name: ["Aziz", "Lola", "Madina", "Timur"], test: ["test", "exam", "driving test", "interview"] }),
  T(SPELL, "It rained heavyly all {time}, {name}.", "It rained ______ all {time}, {name}.", "heavily", WHY("heavy", "heavily"),
    { time: ["night", "day", "morning", "weekend"], name: P4 }),
  T(SPELL, "The {person} looked angryly at the {thing}.", "The {person} looked ______ at the {thing}.", "angrily", WHY("angry", "angrily"),
    { person: ["driver", "teacher", "man", "guard"], thing: ["broken window", "dirty floor", "open gate", "long queue"] }),
  T(SPELL, "The boys ran noisyly through the {place}, {name}.", "The boys ran ______ through the {place}, {name}.", "noisily", WHY("noisy", "noisily"),
    { place: ["hall", "corridor", "yard", "park"], name: N4 }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about how you speak English. Use an -ly adverb such as slowly, clearly or carefully.", "an action verb + an -ly adverb",
    ["exactly one sentence", "must be about you", "must use one -ly adverb"]],
  ["Write one sentence about how someone in your family drives, cooks or sings.", "an action verb + an -ly adverb",
    ["exactly one sentence", "must name a family member", "must use one -ly adverb"]],
  ["Write one sentence with happily, easily or angrily.", "an adverb in -ily after an action verb",
    ["exactly one sentence", "must use happily, easily or angrily", "the adverb must describe an action"]],
  ["Write one sentence that tells a friend how to carry something. Start with a verb.", "an imperative + an -ly adverb",
    ["exactly one sentence", "must start with a verb", "must use one -ly adverb"]],
  ["Write one sentence about the weather with heavily.", "rain or snow + heavily",
    ["exactly one sentence", "must use heavily", "must be about rain or snow"]],
  ["Write one sentence about how your teacher explains things.", "explains + an -ly adverb",
    ["exactly one sentence", "must be about a teacher", "must use one -ly adverb"]],
  ["Write two sentences about one person: the first with an adjective (She is a careful driver), the second with its adverb.", "an adjective, then its -ly adverb",
    ["exactly two sentences", "one adjective before a noun", "the same word as an -ly adverb"]],
  ["A friend wrote: \"The children played happyly and quiet.\" Write the sentence correctly.", "happily and quietly",
    ["exactly one sentence", "must use happily", "must use quietly"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["How do you do things in the morning: quickly or slowly, quietly or noisily? Write three or four sentences about your morning.",
    "action verbs with -ly adverbs", ["an -ly adverb after an action verb", "no adjective in place of an adverb", "at least two different adverbs"]],
  ["Describe how a good teacher works. How does he or she speak, explain and listen? Write three or four sentences.",
    "action verbs with -ly adverbs", ["clearly, patiently, kindly or carefully", "adverb after the verb or object", "at least two different adverbs"]],
  ["Think of a person you know who does something very well. Describe how they do it. Write three or four sentences.",
    "action verbs with -ly adverbs", ["beautifully, perfectly, easily or carefully", "correct -ily spelling", "the adverb describes an action"]],
  ["Give advice to a new driver or cyclist in your town. How should they drive or ride? Write three or four sentences.",
    "action verbs with -ly adverbs", ["carefully, slowly or safely", "adverbs, not adjectives", "at least two different adverbs"]],
  ["Describe a rainy or snowy day you remember. What happened, and how? Write three or four sentences.",
    "action verbs with -ly adverbs", ["heavily", "another -ly adverb", "past tense for the story"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.adverb-form.ly-adverb.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
