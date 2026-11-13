// Hand-authored: adj-adv / frequency / never (A1).
// Speaking Pack batch 2, topic 7 (grammar-run/SPEAK-2.md).
//
// Tests the two placement points for never:
//   1. never = not at any time (A1 item: "We ______ eat pizza. We don't like it.")
//   2. never already makes the sentence negative, so the verb stays positive:
//      "He never eats meat", not "He doesn't never eat meat" (A2 item:
//      "never with a positive verb (no double negative)").
// The topic level is A1, the lowest level in the placement bank.
//
// Triage (SPEAK-2 point 2): kept. The double negative is a point no sibling
// tests, and it is the classic Russian/Uzbek transfer error ("никогда не ест",
// "hech qachon yemaydi" both carry a second negative). Position stays with
// adverb-position: no option here moves never to a wrong place.
//
// Choose: 10 meaning items (never vs always / often / usually / sometimes,
// each ruled out by a cue) and 10 form items. Form distractors: doesn't never
// + verb, never doesn't + verb, and either "not never" or never + verb with
// the -s dropped. With be: isn't never / never isn't / not never. "doesn't
// ever" is never offered: it is correct English.
// Build: 14 never + verb in brackets ("Don't use not"), 6 type one word
// (never / always / sometimes) from the facts.
// Transform: 5 don't/doesn't/not → never (the -s comes back) / 5 always +
// opposite → never / 5 correct a double negative.
//
// Run: node tools/grammar-practice/authored/adj-adv.frequency.never.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "frequency", topic: "never", level: "A1", pv: "2.5" };
const whyM = (cue) => `${cue}, so the answer is never. Never means not at any time.`;
const whyF = (form) => `Never is already negative, so the verb stays positive: ${form}. Don't add don't, doesn't or not.`;

/* ---------------- choose: 20 mcq ---------------- */
const M = ["never", "always", "often", "usually"];
const M2 = ["never", "always", "sometimes", "usually"];
const MEANING = [
  [M, "We ______ eat {food}. We don't like the {aspect}.", "We don't like it",
    { food: ["pizza", "fish", "mushrooms", "spicy food"], aspect: ["taste", "smell"] }],
  [M2, "My grandfather ______ uses a {device}. He doesn't know how, and he reads {thing} instead.", "He doesn't know how",
    { device: ["computer", "laptop", "tablet", "smartphone"], thing: ["newspapers", "books", "magazines", "letters"] }],
  [M, "{name} is ______ late for {thing}. He is always on time.", "He is always on time",
    { name: ["Jasur", "Timur", "Anton", "Sanjar"], thing: ["school", "work", "training", "lessons"] }],
  [M2, "My little brother ______ goes to bed before {time}. He {act} until late every night.", "He stays up late every night",
    { time: ["ten", "eleven", "half past ten", "nine"], act: ["plays", "reads", "talks", "watches cartoons"] }],
  [M, "The {place} near our school is ______ open on {day}. It is closed all day.", "It is closed all day",
    { place: ["bank", "post office", "museum", "library"], day: ["Sundays", "Mondays", "holidays", "Saturdays"] }],
  [M2, "I ______ drink {drink} after {time}. I can't sleep after it, so I don't.", "I can't sleep after it, so I don't",
    { drink: ["coffee", "strong tea", "cola", "black tea"], time: ["six", "seven", "eight", "dinner"] }],
  [M, "My {who} ______ cleans his {thing}. My mother does it for him.", "My mother does it for him",
    { who: ["brother", "younger brother", "cousin", "little brother"], thing: ["room", "shoes", "desk", "bike"] }],
  [M2, "{name} ______ eats meat. She is a vegetarian and eats {food}.", "She is a vegetarian",
    { name: ["Madina", "Olga", "Zarina", "Dilnoza"], food: ["vegetables", "beans", "rice", "eggs"] }],
  [M, "The {place} in our street is ______ quiet. There are {who} there all day.", "There are people there all day",
    { place: ["park", "square", "bazaar", "playground"], who: ["children", "people", "families", "kids"] }],
  [M2, "We ______ swim in the {water} in {month}. The water is too cold.", "The water is too cold",
    { water: ["river", "lake", "sea", "canal"], month: ["winter", "January", "December", "February"] }],
].map(([options, prompt, cue, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: whyM(cue), slots }));

// form rows: [options (key first), prompt, slots]
const v3 = (base, s) => [`never ${s}`, `doesn't never ${base}`, `never doesn't ${base}`, `never ${base}`];
const v1 = (base, dont) => [`never ${base}`, `${dont} never ${base}`, `never ${dont} ${base}`, `not never ${base}`];
const b = (be, neg) => [`${be} never`, `${neg} never`, `never ${neg}`, "not never"];
const FORM = [
  [v3("drive", "drives"), "My uncle ______ his car to work. He goes by {transport} because the {problem} is bad.",
    { transport: ["metro", "bus", "train", "minibus"], problem: ["traffic", "parking", "road"] }],
  [v1("eat", "don't"), "I ______ {food} for breakfast. I only have {drink} and bread.",
    { food: ["meat", "soup", "rice", "fish"], drink: ["tea", "milk", "coffee", "juice"] }],
  [v1("visit", "don't"), "My grandparents ______ the city in summer. They stay in their {place} until {month}.",
    { place: ["village", "village house", "house in the mountains", "country house"], month: ["September", "October", "the autumn", "late August"] }],
  [v3("do", "does"), "My sister ______ her homework late. She does it right after {time} in her {room}.",
    { time: ["school", "lunch", "college", "dinner"], room: ["room", "bedroom", "kitchen", "study corner"] }],
  [b("are", "aren't"), "The buses on our {street} ______ empty in the morning. People go to {place} at that time.",
    { street: ["street", "road", "route", "line"], place: ["work", "school", "the bazaar", "university"] }],
  [b("am", "am not"), "I ______ bored at my {rel}'s house. There is always something to do in the {place}.",
    { rel: ["grandmother", "aunt", "uncle", "cousin"], place: ["garden", "kitchen", "yard", "village"] }],
  [v1("play", "don't"), "We ______ {game} in the {room}. My mother says it is dangerous.",
    { game: ["football", "ball games", "basketball", "volleyball"], room: ["house", "flat", "living room", "kitchen"] }],
  [v3("say", "says"), "My friend {name} ______ unkind things about other people. He is very {adj}.",
    { name: ["Rustam", "Bekzod", "Ilya", "Sardor"], adj: ["kind", "friendly", "polite", "nice"] }],
  [b("is", "isn't"), "Our {teacher} ______ angry with us. She stays calm when we make {what}.",
    { teacher: ["teacher", "English teacher", "maths teacher", "music teacher"], what: ["mistakes", "noise", "a mess", "jokes"] }],
  [v1("watch", "don't"), "My cousins ______ TV at {meal}. My {rel} doesn't allow it.",
    { meal: ["dinner", "lunch", "breakfast"], rel: ["aunt", "uncle", "grandmother", "grandfather"] }],
].map(([options, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: whyF(options[0]), slots }));

const CHOOSE = [];
for (let i = 0; i < 10; i++) CHOOSE.push(MEANING[i], FORM[i]);

/* ---------------- build: 20 gap_fill ---------------- */
const IF = "Complete the sentence with never and the right form of the verb in brackets. Don't use not.";
const IW = "Write never, always or sometimes.";
// form: [key, source, slots]
const BUILD_F = [
  ["never eats", "My brother ______ (eat) breakfast. He {act} and runs to the {stop}.",
    { act: ["gets up late", "sleeps too long", "wakes up at eight", "stays in bed"], stop: ["bus", "metro", "bus stop", "minibus"] }],
  ["never watch", "I ______ (watch) the news at {time}. It makes me {feel}.",
    { time: ["night", "bedtime", "dinner", "breakfast"], feel: ["sad", "worried", "nervous", "tired"] }],
  ["never barks", "Our {pet} ______ (bark) at the neighbours. He is a very {adj} dog.",
    { pet: ["dog", "puppy"], adj: ["calm", "quiet", "friendly", "gentle"] }],
  ["are never", "My {who} ______ (be) at home at lunchtime. They both work at the {place}.",
    { who: ["parents", "sisters", "older brothers", "aunts"], place: ["hospital", "bank", "school", "factory"] }],
  ["never forgets", "Gulnora ______ (forget) her friends' birthdays. She writes them in her {thing}.",
    { thing: ["notebook", "phone", "diary", "calendar"] }],
  ["never drink", "We ______ (drink) water from the {place}. It is not clean.",
    { place: ["river", "canal", "lake", "stream"] }],
  ["never opens", "The {place} ______ (open) on {day}. Everyone who works there has a day off.",
    { place: ["museum", "library", "gallery", "theatre"], day: ["Mondays", "Tuesdays", "Sundays", "Wednesdays"] }],
  ["never buys", "My {rel} ______ (buy) bread. She bakes it in her {oven} at home.",
    { rel: ["grandmother", "mother", "aunt", "neighbour"], oven: ["oven", "tandoor", "kitchen", "own oven"] }],
  ["am never", "I ______ (be) late for my {class}. I leave home at {time}.",
    { class: ["English class", "maths lesson", "piano lesson", "training"], time: ["seven", "half past seven", "quarter past seven", "ten past seven"] }],
  ["never play", "Children in our {place} ______ (play) on the {where}. It is too busy.",
    { place: ["town", "district", "area", "city"], where: ["street", "road", "main road", "pavement"] }],
  ["never shouts", "My {teacher} ______ (shout) at us. She {act} instead.",
    { teacher: ["teacher", "English teacher", "maths teacher", "music teacher"], act: ["talks quietly", "explains again", "smiles", "stays calm"] }],
  ["is never", "This {shop} ______ (be) open after {time}.",
    { shop: ["bakery", "pharmacy", "post office", "small shop"], time: ["nine", "ten", "eight", "six"] }],
  ["are never", "My little cousins ______ (be) quiet at {event}. They run and shout all the time.",
    { event: ["parties", "weddings", "dinner", "family visits"] }],
  ["never uses", "{name} ______ (use) his phone during {meal}. His father doesn't allow it.",
    { name: ["Nodir", "Oleg", "Sanjar", "Bekzod"], meal: ["dinner", "lunch", "breakfast", "meals"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: IF, source, key, why: whyF(key), slots }));
const WW = {
  never: (c) => whyM(c),
  always: (c) => `${c}, so the answer is always. Always means every time.`,
  sometimes: (c) => `${c}, so the answer is sometimes. Sometimes means on some days, not all.`,
};
const BUILD_W = [
  ["never", "My {who} ______ eats {food}. She doesn't like it at all.", "She doesn't like it at all",
    { who: ["sister", "aunt", "grandmother", "cousin"], food: ["fish", "onions", "carrots", "eggs"] }],
  ["sometimes", "I ______ walk to {place}. Some days I walk, and some days I take the {transport}.", "Some days yes, some days no",
    { place: ["school", "work", "college", "university"], transport: ["bus", "metro", "minibus", "tram"] }],
  ["never", "{name} ______ drinks tea without sugar. He puts {n} spoons in every cup.", "He puts sugar in every cup",
    { name: ["Aziz", "Pavel", "Sherzod", "Ulugbek"], n: ["two", "three", "four", "five"] }],
  ["never", "Our cat ______ goes outside. She stays in the {room} all {time}.", "She stays in all the time",
    { room: ["flat", "house", "kitchen", "bedroom"], time: ["day", "week", "winter", "the time"] }],
  ["always", "We ______ eat {food} at weddings in {city}. It is on the table at every wedding.", "It is at every wedding",
    { food: ["plov", "non", "halva", "fruit"], city: ["Tashkent", "Samarkand", "Fergana", "Bukhara"] }],
  ["never", "My {who} ______ cooks dinner. My mother cooks every evening, and he {act}.", "My mother cooks every evening",
    { who: ["father", "brother", "uncle", "grandfather"], act: ["doesn't help", "watches TV", "reads the news", "rests"] }],
].map(([key, source, cue, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: IW, source, key, why: WW[key](cue), slots }));
const BUILD = [];
for (let i = 0; i < 14; i++) { BUILD.push(BUILD_F[i]); if (i % 2 === 1 && BUILD_W.length) BUILD.push(BUILD_W.shift()); }
BUILD.push(...BUILD_W);

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NEG = "Rewrite the sentence with never. Don't use not.";
const OPP = "Rewrite the sentence with never and the opposite idea.";
const FIX = "This sentence has two negatives. Rewrite it correctly with never.";
const whyN = (form) => `Never replaces don't, doesn't or not, and the verb becomes positive again: ${form}.`;
const whyO = (a, b2) => `${a} means ${b2}: always and never are opposites.`;
const whyD = (form) => `Never is already negative, so don't add don't, doesn't or isn't: ${form}.`;
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [NEG, "My {who} doesn't eat {food}.", "My {who} ______ {food}.", "never eats", whyN("never eats"),
    { who: ["brother", "cousin", "uncle", "friend"], food: ["meat", "fish", "onions", "sweets"] }],
  [NEG, "I don't drink {drink} in the {time}.", "I ______ {drink} in the {time}.", "never drink", whyN("never drink"),
    { drink: ["coffee", "cola", "strong tea", "black tea"], time: ["evening", "afternoon"] }],
  [NEG, "We don't play {game} in the {place}.", "We ______ {game} in the {place}.", "never play", whyN("never play"),
    { game: ["football", "volleyball", "basketball", "tennis"], place: ["house", "flat", "kitchen", "living room"] }],
  [NEG, "{name} is not late for {thing}.", "{name} ______ late for {thing}.", "is never", whyN("is never"),
    { name: ["Akmal", "Pavel", "Javlon", "Ruslan"], thing: ["school", "work", "training", "class"] }],
  [NEG, "The {place} doesn't open on {day}.", "The {place} ______ on {day}.", "never opens", whyN("never opens"),
    { place: ["museum", "bank", "library", "post office"], day: ["Sundays", "Mondays", "holidays", "Saturdays"] }],
  [OPP, "My {who} is always on time for {thing}.", "My {who} ______ late for {thing}.", "is never", whyO("Always on time", "never late"),
    { who: ["sister", "brother", "friend", "cousin"], thing: ["school", "work", "lessons", "dinner"] }],
  [OPP, "Our {room} is always quiet.", "Our {room} ______ noisy.", "is never", whyO("Always quiet", "never noisy"),
    { room: ["library", "bedroom", "office", "reading room"] }],
  [OPP, "My {who} always remembers our {what}.", "My {who} ______ (forget) our {what}.", "never forgets", whyO("Always remembers", "never forgets"),
    { who: ["grandfather", "grandmother", "teacher", "uncle"], what: ["names", "birthdays", "phone numbers", "address"] }],
  [OPP, "The water in the {place} is always cold in {month}.", "The water in the {place} ______ warm in {month}.", "is never", whyO("Always cold", "never warm"),
    { place: ["river", "lake", "spring", "mountain stream"], month: ["June", "July", "August", "summer"] }],
  [OPP, "My {who} always say yes when I ask for help with {task}.", "My {who} ______ (say) no when I ask for help with {task}.", "never say", whyO("Always say yes", "never say no"),
    { who: ["friends", "parents", "cousins", "classmates"], task: ["homework", "maths", "English", "my phone"] }],
  [FIX, "I don't never drink {drink} at {time}.", "I ______ {drink} at {time}.", "never drink", whyD("I never drink"),
    { drink: ["coffee", "cola", "strong tea", "black tea"], time: ["night", "bedtime", "midnight", "ten o'clock"] }],
  [FIX, "My {who} doesn't never help in the {room}.", "My {who} ______ in the {room}.", "never helps", whyD("never helps"),
    { who: ["brother", "cousin", "uncle", "son"], room: ["kitchen", "garden", "house", "yard"] }],
  [FIX, "She isn't never late for {thing} on {day}.", "She ______ late for {thing} on {day}.", "is never", whyD("is never"),
    { thing: ["class", "work", "lessons", "training"], day: ["Mondays", "Fridays", "Tuesdays", "Thursdays"] }],
  [FIX, "My {who} don't never go to the {place} at night.", "My {who} ______ to the {place} at night.", "never go", whyD("never go"),
    { who: ["parents", "grandparents", "aunts", "neighbours"], place: ["park", "bazaar", "shop", "city centre"] }],
  [FIX, "The {bus} to our {place} doesn't never come on time.", "The {bus} to our {place} ______ on time.", "never comes", whyD("never comes"),
    { bus: ["bus", "minibus", "tram", "train"], place: ["village", "district", "town", "area"] }],
].map(([instr, source, hint, key, w, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a food you never eat.", "never + positive verb", ["exactly one sentence", "must use I", "no don't or not with never"]],
  ["Write one sentence about something your friend never does.", "never + verb with -s", ["exactly one sentence", "must name the friend", "verb ends in -s"]],
  ["Write one sentence about a place in your city that is never quiet.", "be + never", ["exactly one sentence", "must name a place", "must use is never"]],
  ["Write one sentence about something you never do at night.", "never for zero frequency", ["exactly one sentence", "must include at night", "no double negative"]],
  ["Write one sentence about a rule in your home: something your family never does.", "never for a rule", ["exactly one sentence", "must use we or my family", "must use never"]],
  ["Write one sentence about something you always do and one about something you never do.", "always vs never", ["exactly two sentences", "one with always", "one with never"]],
  ["Write one sentence about a person who is never late.", "be + never + adjective", ["exactly one sentence", "must name the person", "must use is never late"]],
  ["Write one sentence about a game or sport you never play, and say why.", "never + reason", ["exactly one sentence", "must use because", "no not with never"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your food habits. What do you never eat or drink, and why? Write three or four sentences.",
    "never with food and drink", ["never + positive verb", "no double negative", "a reason with because"]],
  ["Describe a person in your family. What do they never do? Write three or four sentences.",
    "never with he or she", ["never + verb with -s", "no doesn't with never", "at least two things"]],
  ["Describe the rules in your home or school. What do people never do there? Write three or four sentences.",
    "never for rules", ["never + positive verb", "we or they as subjects", "a place named"]],
  ["Compare two people you know: one who is always late and one who is never late. Write three or four sentences.",
    "always vs never with be", ["is always", "is never", "no isn't with never"]],
  ["Describe your evenings. What do you always do, and what do you never do? Write three or four sentences.",
    "never vs always in routines", ["always for every time", "never for not at any time", "no double negative"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.frequency.never.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);