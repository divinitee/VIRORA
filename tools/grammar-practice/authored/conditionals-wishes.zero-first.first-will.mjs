// Hand-authored: conditionals-wishes / zero-first / first-will (A2).
// Speaking Pack batch 2, topic 12 (grammar-run/SPEAK-2.md).
//
// Tests ONE point (both placement items): in a first conditional the RESULT
// clause takes will + base form ("If it rains tomorrow, we will stay at home"),
// including after a negative if-clause ("If you don't hurry, you will miss the
// bus"). The if-clause is always PRINTED in the present, so the blank is
// always the result.
//
// Triage: kept, and kept apart from first-if-clause (topic 11), which blanks
// the if-clause. Every sentence is about one real future situation (tomorrow,
// tonight, on Saturday), so it is never a zero-conditional general truth
// (zero-general-truth is its own topic).
//
// Distractors: the present simple (no will), the past, would + verb (second-
// conditional form next to a present if-clause), and the present perfect.
// Negative results: won't + base vs don't/doesn't, didn't, wouldn't.
// "be going to" and imperatives are never offered (both can be right), and no
// present continuous option ("we are staying" can be an arrangement).
//
// Run: node tools/grammar-practice/authored/conditionals-wishes.zero-first.first-will.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "conditionals-wishes", branch: "zero-first", topic: "first-will", level: "A2", pv: "2.5" };
const why = (form) => `The if-part is in the present, and the result is a real future, so use will + the base form: ${form}. Not the present or past, and not would.`;
const whyN = (form) => `The if-part is in the present, and the result is a real future that will not happen, so use won't + the base form: ${form}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [options (key first), prompt, slots]
const A = (v, pres, past) => [`will ${v}`, pres, past, `would ${v}`];
const B = (v, pres, past, perf) => [`will ${v}`, pres, past, perf];
const N = (v, dont) => [`won't ${v}`, `${dont} ${v}`, `didn't ${v}`, `wouldn't ${v}`];
const CHOOSE = [
  [A("stay", "stay", "stayed"), "If it rains {when}, we ______ at home and {act}.",
    { when: ["tomorrow", "on Saturday", "tonight", "on Sunday"], act: ["watch films", "play chess", "read", "bake a cake"] }],
  [B("miss", "misses", "missed", "has missed"), "If {name} doesn't hurry, he ______ the {transport}.",
    { name: ["Timur", "Sardor", "Aziz", "Ilya"], transport: ["bus", "train", "metro", "minibus"] }],
  [A("buy", "buy", "bought"), "If {name} passes the exam, her parents ______ her a {gift}.",
    { name: ["Madina", "Olga", "Sevara", "Zarina"], gift: ["bike", "phone", "laptop", "new dress"] }],
  [N("come", "don't"), "If it snows {when}, the {transport} ______ on time tomorrow.",
    { when: ["tonight", "this evening", "all night"], transport: ["buses", "trains", "trams", "minibuses"] }],
  [["will be", "are", "were", "would be"], "If you eat all that {food} now, you ______ ill tonight.",
    { food: ["ice cream", "cake", "chocolate", "candy"] }],
  [A("call", "call", "called"), "I ______ you if I find your {thing} in the {place}.",
    { thing: ["keys", "phone", "glasses", "wallet"], place: ["car", "kitchen", "classroom", "garden"] }],
  [B("be", "is", "was", "has been"), "If the weather is good on {day}, the {place} ______ full of families.",
    { day: ["Saturday", "Sunday", "Friday", "Navruz"], place: ["park", "zoo", "lake", "square"] }],
  [N("sleep", "don't"), "If I drink {drink} now, I ______ tonight.",
    { drink: ["coffee", "strong tea", "cola", "black tea"] }],
  [B("help", "helps", "helped", "has helped"), "If you ask {name}, she ______ you with the {task} after school.",
    { name: ["Dilnoza", "Anna", "Kamola", "Nilufar"], task: ["homework", "project", "essay", "maths"] }],
  [A("go", "go", "went"), "If our {who} visit us on Sunday, we ______ to the {place} together.",
    { who: ["cousins", "grandparents", "friends", "relatives"], place: ["bazaar", "mountains", "museum", "old city"] }],
  [B("fail", "fails", "failed", "has failed"), "If {name} doesn't study this week, he ______ the {exam}.",
    { name: ["Bekzod", "Pavel", "Rustam", "Jasur"], exam: ["test", "exam", "maths test", "English test"] }],
  [["will be", "is", "was", "would be"], "If we are late {when}, the {who} ______ angry.",
    { when: ["again", "for class", "tomorrow", "for the lesson"], who: ["teacher", "coach", "director", "driver"] }],
  [A("have", "have", "had"), "If my parents finish work early {when}, we ______ dinner in the {place}.",
    { when: ["today", "tomorrow", "on Friday", "this evening"], place: ["garden", "yard", "café", "restaurant"] }],
  [["won't be", "aren't", "weren't", "wouldn't be"], "If you don't wear a {coat}, you ______ warm in the {place}.",
    { coat: ["coat", "jacket", "warm hat", "scarf"], place: ["mountains", "stadium", "park", "yard"] }],
  [B("cook", "cooks", "cooked", "has cooked"), "If we buy meat at the bazaar, my father ______ {food} tonight.",
    { food: ["plov", "shashlik", "lagman", "manti"] }],
  [A("tell", "tell", "told"), "If I see Aziz at the {place}, I ______ him about the {event}.",
    { place: ["bazaar", "metro", "stadium", "library"], event: ["party", "concert", "trip", "match"] }],
  [N("train", "doesn't"), "If it rains on {day}, our {team} ______ outside.",
    { day: ["Saturday", "Sunday", "Tuesday", "Thursday"], team: ["team", "football team", "running club", "school team"] }],
  [B("get", "get", "got", "have got"), "If they leave {when}, they ______ {where} before dark.",
    { when: ["now", "at six", "before lunch", "in ten minutes"], where: ["home", "there", "to the village", "to the hotel"] }],
  [B("love", "loves", "loved", "has loved"), "If you give my {who} this {gift}, she ______ it.",
    { who: ["grandmother", "mother", "aunt", "sister"], gift: ["scarf", "book", "cake", "plant"] }],
  [A("be", "am", "was"), "If I get the job in {city}, I ______ very happy.",
    { city: ["Tashkent", "Seoul", "Dubai", "Moscow"] }],
].map(([options, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0,
  why: options[0].startsWith("won't") ? whyN(options[0]) : why(options[0]), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete the result with will or won't and the verb in brackets.";
const BUILD = [
  ["will stay", "If it rains on {day}, we ______ (stay) at home with {who}.",
    { day: ["Saturday", "Sunday", "Friday", "Monday"], who: ["our grandparents", "my cousins", "the children", "our neighbours"] }],
  ["will miss", "If {name} doesn't hurry, she ______ (miss) the {transport}.",
    { name: ["Sevara", "Anna", "Madina", "Nodira"], transport: ["bus", "train", "metro", "first lesson"] }],
  ["will feel", "If you eat too many {food}, you ______ (feel) ill {when}.",
    { food: ["sweets", "cakes", "samsas", "chocolates"], when: ["tonight", "later", "tomorrow", "after the party"] }],
  ["will call", "If I find your {thing} in the {place}, I ______ (call) you.",
    { thing: ["keys", "phone", "glasses", "wallet"], place: ["car", "kitchen", "classroom", "garden"] }],
  ["will go", "If the weather is nice, my {who} ______ (go) for a walk in the {place}.",
    { who: ["grandparents", "parents", "cousins", "friends"], place: ["park", "garden", "mountains", "old city"] }],
  ["won't be", "If we leave at {time}, we ______ (not be) late for the {event}.",
    { time: ["six", "seven", "half past six", "eight"], event: ["concert", "wedding", "match", "film"] }],
  ["will help", "If you ask {name} nicely, he ______ (help) you with the {task}.",
    { name: ["Sardor", "Timur", "Anton", "Laziz"], task: ["homework", "project", "essay", "computer"] }],
  ["will have", "If my parents finish work early, we ______ (have) dinner at the {place}.",
    { place: ["café", "restaurant", "teahouse", "park"] }],
  ["will build", "If it snows tonight, the children ______ (build) a snowman in the {place}.",
    { place: ["yard", "park", "garden", "street"] }],
  ["will buy", "If {name} gets a good mark, her mother ______ (buy) her a {gift}.",
    { name: ["Malika", "Olga", "Zarina", "Kamola"], gift: ["bike", "phone", "new dress", "watch"] }],
  ["won't sleep", "If you drink {drink} now, you ______ (not sleep) {when}.",
    { drink: ["coffee", "strong tea", "cola", "black tea"], when: ["tonight", "well", "before midnight", "at all"] }],
  ["will dance", "If the {team} wins on {day}, the fans ______ (dance) in the streets.",
    { team: ["team", "national team", "city team", "football team"], day: ["Saturday", "Sunday", "Friday", "Wednesday"] }],
  ["will fail", "If my {who} don't study, they ______ (fail) the {exam}.",
    { who: ["cousins", "brothers", "classmates", "friends"], exam: ["exam", "test", "maths test", "English exam"] }],
  ["will go", "If the {shop} is closed on {day}, I ______ (go) to the bazaar.",
    { shop: ["shop", "bakery", "supermarket", "pharmacy"], day: ["Sunday", "Monday", "Friday", "Navruz"] }],
  ["will say", "If I see your {who} at the {place}, I ______ (say) hello.",
    { who: ["sister", "brother", "parents", "grandmother"], place: ["bazaar", "park", "metro", "school"] }],
  ["will be", "If you don't wear a hat, you ______ (be) cold in the {place}.",
    { place: ["mountains", "stadium", "park", "yard"] }],
  ["will send", "If my {device} works again, I ______ (send) you the {thing}.",
    { device: ["phone", "laptop", "computer", "tablet"], thing: ["photos", "video", "address", "files"] }],
  ["will cook", "If my {who} come early, we ______ (cook) {food} together.",
    { who: ["cousins", "grandparents", "guests", "friends"], food: ["plov", "manti", "samsa", "lagman"] }],
  ["will swim", "If it is hot on {day}, we ______ (swim) in the {place}.",
    { day: ["Saturday", "Sunday", "Friday", "Thursday"], place: ["river", "lake", "pool", "sea"] }],
  ["won't answer", "If {name} calls tonight, I ______ (not answer). I am still angry with him about the {thing}.",
    { name: ["Jasur", "Ilya", "Bobur", "Sanjar"], thing: ["party", "money", "game", "photos"] }],
].map(([key, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key,
  why: key.startsWith("won't") ? whyN(key) : why(key), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOTES = "Write a sentence with if from the notes.";
const NOTESN = "Write a sentence with if from the notes. Use won't where the notes say not.";
const FIX = "There is a mistake in the result. Rewrite the sentence correctly.";
const whyF = (bad, form) => `${bad} is wrong for a real future result. Use will + the base form: ${form}.`;
const TRANSFORM = [
  [NOTES, "it / rain on {day} → we / stay at home and {act}.", "If it rains on {day}, we ______ at home and {act}.", "will stay", why("will stay"),
    { day: ["Saturday", "Sunday", "Friday", "Monday"], act: ["watch films", "play chess", "bake a cake", "read"] }],
  [NOTES, "{name} / pass the exam → her parents / buy her a {gift}.", "If {name} passes the exam, her parents ______ her a {gift}.", "will buy", why("will buy"),
    { name: ["Madina", "Olga", "Sevara", "Zarina"], gift: ["bike", "phone", "laptop", "watch"] }],
  [NOTES, "we / buy meat at the {place} → my father / cook {food}.", "If we buy meat at the {place}, my father ______ {food}.", "will cook", why("will cook"),
    { place: ["bazaar", "market", "shop", "supermarket"], food: ["plov", "shashlik", "lagman", "manti"] }],
  [NOTES, "you / ask {name} → she / help you with the {task}.", "If you ask {name}, she ______ you with the {task}.", "will help", why("will help"),
    { name: ["Dilnoza", "Anna", "Kamola", "Nilufar"], task: ["homework", "project", "essay", "maths"] }],
  [NOTES, "the weather / be nice → my {who} / go to the {place}.", "If the weather is nice, my {who} ______ to the {place}.", "will go", why("will go"),
    { who: ["grandparents", "parents", "cousins", "friends"], place: ["park", "mountains", "lake", "old city"] }],
  [NOTESN, "you / not hurry → you / miss the {transport} on {day}.", "If you don't hurry, you ______ the {transport} on {day}.", "will miss", why("will miss"),
    { transport: ["bus", "train", "metro", "minibus"], day: ["Monday", "Friday", "Tuesday", "Saturday"] }],
  [NOTESN, "we / leave at {time} → we / not be late for the {event}.", "If we leave at {time}, we ______ late for the {event}.", "won't be", whyN("won't be"),
    { time: ["six", "seven", "eight", "half past six"], event: ["concert", "wedding", "match", "film"] }],
  [NOTESN, "you / drink {drink} now → you / not sleep tonight.", "If you drink {drink} now, you ______ tonight.", "won't sleep", whyN("won't sleep"),
    { drink: ["coffee", "strong tea", "cola", "black tea"] }],
  [NOTESN, "{name} / not study → he / fail the {exam} in {month}.", "If {name} doesn't study, he ______ the {exam} in {month}.", "will fail", why("will fail"),
    { name: ["Bekzod", "Pavel", "Rustam", "Jasur"], exam: ["test", "exam", "maths test", "English test"], month: ["May", "June", "December", "January"] }],
  [NOTESN, "it / snow tonight → the {transport} / not come on time.", "If it snows tonight, the {transport} ______ on time.", "won't come", whyN("won't come"),
    { transport: ["buses", "trains", "trams", "minibuses"] }],
  [FIX, "If it rains tomorrow, we stay at home with {who}.", "If it rains tomorrow, we ______ at home with {who}.", "will stay", whyF("Stay (present)", "will stay"),
    { who: ["our grandparents", "my cousins", "the children", "our neighbours"] }],
  [FIX, "If you ask {name}, she would help you with the {task}.", "If you ask {name}, she ______ you with the {task}.", "will help", whyF("Would help", "will help"),
    { name: ["Dilnoza", "Anna", "Kamola", "Malika"], task: ["homework", "project", "essay", "maths"] }],
  [FIX, "If my {who} come early, we cooked {food} together.", "If my {who} come early, we ______ {food} together.", "will cook", whyF("Cooked (past)", "will cook"),
    { who: ["cousins", "grandparents", "guests", "friends"], food: ["plov", "manti", "samsa", "lagman"] }],
  [FIX, "If {name} doesn't hurry, he will misses the {transport}.", "If {name} doesn't hurry, he ______ the {transport}.", "will miss", whyF("Will misses", "will miss (no -s after will)"),
    { name: ["Timur", "Sardor", "Aziz", "Ilya"], transport: ["bus", "train", "metro", "minibus"] }],
  [FIX, "If it is hot on {day}, we will to swim in the {place}.", "If it is hot on {day}, we ______ in the {place}.", "will swim", whyF("Will to swim", "will swim (no to after will)"),
    { day: ["Saturday", "Sunday", "Friday", "Thursday"], place: ["river", "lake", "pool", "sea"] }],
].map(([instr, source, hint, key, w, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Finish this sentence: If I get up late tomorrow, ...", "will in the result", ["exactly one sentence", "result with will", "no will after if"]],
  ["Write one sentence about what will happen if you don't do your homework.", "negative if-clause + will", ["exactly one sentence", "if I don't", "will in the result"]],
  ["Write one sentence about what your mother or father will do if you get a good mark.", "will + base form", ["exactly one sentence", "must name the person", "will + base form, no -s"]],
  ["Write one sentence with won't in the result.", "won't + base form", ["exactly one sentence", "must use if", "won't + base form"]],
  ["Write one sentence about what will happen if it snows a lot tonight.", "will for a real future result", ["exactly one sentence", "if it snows", "will in the result"]],
  ["Write one sentence about what you will cook if your friends visit you this weekend.", "will + cook / make", ["exactly one sentence", "must name a food", "will in the result"]],
  ["Write one sentence warning a friend: what will happen if he or she doesn't wear a coat?", "warning with will", ["exactly one sentence", "if you don't", "will be or will feel"]],
  ["Write two sentences: what will happen if you win a prize, and what won't happen.", "will and won't", ["exactly two sentences", "one with will", "one with won't"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Your friend wants to stay up all night before an exam. Tell them what will happen. Write three or four sentences with if.",
    "will in first conditional results", ["if you ..., you will ...", "won't + base form", "no would"]],
  ["Plan a trip for next summer. What will you do if you have enough money, and what will you do if you don't? Write three or four sentences.",
    "will for real future results", ["will + base form", "negative if-clause", "two different plans"]],
  ["Talk about what will happen in your city if it snows a lot this winter. Write three or four sentences.",
    "will and won't for results", ["will in each result", "won't once or more", "present after if"]],
  ["Tell a younger brother or sister what will happen if they eat too many sweets. Write three or four sentences.",
    "warnings with will", ["you will ...", "you won't ...", "no present in the result"]],
  ["Imagine your team wins an important match this weekend. Describe what will happen. Write three or four sentences.",
    "will for consequences", ["if our team wins", "will + base form", "at least three results"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/conditionals-wishes.zero-first.first-will.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);