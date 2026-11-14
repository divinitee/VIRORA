// Hand-authored: modals / ability-permission / can-form (A1).
// Path fill P14 (2026-11-14, Base44 AI, branch grammar-path-fill-3-base44).
//
// Placement focus: "Modal takes no -s and no 'to'" (She ______ speak French:
// can to / cans / can / is can) and "Modal + bare infinitive (no 'to')".
// Scope (PATH-FILL §2 and HANDOFF rule 14): kept to HE / SHE + can, the one
// place learners add -s (Russian/Uzbek have no invariable modal, and he/she
// pulls a third-person -s onto can or onto the verb). The rule is stated ONCE,
// in one sentence used by every why line: "With he or she, can and the verb
// after it don't change: no -s and no to."
// Every subject is he, she or one named person (fixed, never slotted). No I /
// we / they (no -s problem there), no questions (can-question), no can't
// (cant-ability), no requests (can-request).
// Apart from can-ability (#108), which blanks only the verb after a printed
// can and tests can vs am / know / have: here the WHOLE verb phrase is the
// blank and every distractor is a form error: cans + verb, can + verb-s,
// can to + verb, is can + verb. None of them is ever English.
// Build: "Write can + the verb in brackets." 10 cues are the base verb,
// 10 cues are the -s form (rides) that the learner must take the -s off.
// Transform: 5 correct the form / 5 change I to a he or she / 5 present
// simple (-s) -> can. Typed keys are "can + verb"; no source prints "can".
//
// Run: node tools/grammar-practice/authored/modals.ability-permission.can-form.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "ability-permission", topic: "can-form", level: "A1", pv: "2.5" };

const RULE = "With he or she, can and the verb after it don't change: no -s and no to.";
const W = (v) => `${RULE} She can ${v}.`;

// Three distractor sets, rotated so the key moves around.
const SETS = [
  (v, s) => [`can ${v}`, `cans ${v}`, `can ${s}`, `can to ${v}`],
  (v, s) => [`can ${s}`, `can ${v}`, `can to ${v}`, `is can ${v}`],
  (v, s) => [`cans ${v}`, `can to ${v}`, `can ${v}`, `is can ${v}`],
  (v, s) => [`can to ${v}`, `cans ${s}`, `can ${s}`, `can ${v}`],
];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["cook", "cooks", "My sister ______ {food} very well, {name}.",
    { food: ["plov", "soup", "manti", "eggs"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["drive", "drives", "Grandpa ______ a {vehicle} {how}.",
    { vehicle: ["car", "truck", "tractor", "bus"], how: ["very well", "carefully", "slowly", "safely"] }],
  ["speak", "speaks", "Lola ______ {lang} {how}.",
    { lang: ["English", "Korean", "Turkish", "German"], how: ["well", "a little", "very well", "quite well"] }],
  ["play", "plays", "He ______ the {instrument} {how}.",
    { instrument: ["piano", "guitar", "dutar", "drums"], how: ["very well", "a little", "beautifully", "quite well"] }],
  ["ride", "rides", "My brother ______ a {vehicle} {how}.",
    { vehicle: ["bike", "horse", "scooter", "skateboard"], how: ["fast", "very well", "without help", "quite well"] }],
  ["draw", "draws", "{name}, look! She ______ beautiful {thing}.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], thing: ["pictures", "faces", "animals", "flowers"] }],
  ["sing", "sings", "Aunt Lola ______ {song} {how}.",
    { song: ["songs", "Uzbek songs", "old songs", "Russian songs"], how: ["very well", "beautifully", "from memory", "without music"] }],
  ["fix", "fixes", "My uncle ______ old {thing} {how}.",
    { thing: ["bikes", "radios", "chairs", "clocks"], how: ["very quickly", "without help", "very well", "at home"] }],
  ["read", "reads", "My little sister ______ {thing} now, {name}.",
    { thing: ["books", "short stories", "English words", "the clock"], name: ["Mum", "Dad", "Grandma", "Olga"] }],
  ["run", "runs", "Look, {name}. He ______ {dist} without stopping.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], dist: ["two kilometres", "three kilometres", "round the park", "to the river"] }],
  ["type", "types", "Kamila ______ very fast in {lang} on a {device}.",
    { lang: ["English", "Russian", "Uzbek", "Korean"], device: ["computer", "laptop", "phone", "keyboard"] }],
  ["sew", "sews", "My grandmother ______ {thing} by hand for {who}.",
    { thing: ["dresses", "shirts", "bags", "curtains"], who: ["the family", "us", "her neighbours", "the children"] }],
  ["carry", "carries", "Bobur ______ a heavy {thing} up to the {floor} floor.",
    { thing: ["box", "bag", "table", "suitcase"], floor: ["third", "fourth", "fifth", "top"] }],
  ["write", "writes", "My cousin ______ {thing} in {lang}.",
    { thing: ["letters", "stories", "poems", "emails"], lang: ["English", "Korean", "Arabic", "Turkish"] }],
  ["climb", "climbs", "Timur ______ {thing} {how}.",
    { thing: ["trees", "mountains", "the rope", "hills"], how: ["very fast", "without help", "quickly", "easily"] }],
  ["make", "makes", "Grandma ______ delicious {food} for {event}.",
    { food: ["bread", "cakes", "jam", "noodles"], event: ["birthdays", "Navruz", "guests", "the family"] }],
  ["teach", "teaches", "My aunt ______ {subj} to {who}.",
    { subj: ["maths", "English", "music", "drawing"], who: ["children", "adults", "students", "beginners"] }],
  ["understand", "understands", "She ______ {lang} {media} without help.",
    { lang: ["English", "Korean", "Turkish", "Russian"], media: ["films", "songs", "cartoons", "news"] }],
  ["learn", "learns", "Aziz ______ a new {thing} {how}.",
    { thing: ["game", "song", "dance", "card trick"], how: ["very quickly", "in a day", "in five minutes", "easily"] }],
  ["wash", "washes", "My little brother ______ the {thing} by himself now, {name}.",
    { thing: ["dishes", "cups", "plates", "spoons"], name: ["Mum", "Dad", "Grandma", "Olga"] }],
].map(([v, s, prompt, slots], i) => {
  const options = SETS[i % SETS.length](v, s);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(`can ${v}`), why: W(v), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write can + the verb in brackets.";
const BUILD = [
  ["bake", "My mum ______ (bake) {food} without a recipe, {name}.",
    { food: ["bread", "cakes", "cookies", "pies"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["swim", "Aziz ______ (swims) across the {water} {how}.",
    { water: ["river", "lake", "pool", "canal"], how: ["easily", "in a minute", "very fast", "without stopping"] }],
  ["speak", "She ______ (speak) {lang} with her {who}.",
    { lang: ["Russian", "English", "Korean", "Turkish"], who: ["grandmother", "friends", "teacher", "cousins"] }],
  ["play", "My grandfather ______ (plays) {game} very well, {name}.",
    { game: ["chess", "backgammon", "football", "volleyball"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["drive", "He ______ (drive) a {vehicle} in the {place}.",
    { vehicle: ["car", "truck", "bus", "tractor"], place: ["city", "mountains", "snow", "rain"] }],
  ["draw", "Nigora ______ (draws) {thing} very well, {name}.",
    { thing: ["horses", "people", "flowers", "houses"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["repair", "My uncle ______ (repair) {thing} in his {place}.",
    { thing: ["cars", "bikes", "phones", "TVs"], place: ["garage", "workshop", "shop", "yard"] }],
  ["write", "Little Kamila ______ (writes) her {thing} now, {name}.",
    { thing: ["name", "first name", "family name", "address"], name: ["Mum", "Dad", "Grandma", "Olga"] }],
  ["lift", "Bobur ______ (lift) {thing} with one hand, {name}.",
    { thing: ["a chair", "a heavy box", "a bag of rice", "a big melon"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["sing", "She ______ (sings) {song} {how}.",
    { song: ["Uzbek songs", "English songs", "old songs", "Russian songs"], how: ["very well", "beautifully", "from memory", "without music"] }],
  ["knit", "Grandma ______ (knit) warm {thing} for us in {time}.",
    { thing: ["socks", "hats", "scarves", "mittens"], time: ["a day", "a week", "two days", "three days"] }],
  ["run", "My brother ______ (runs) to the {place} in {time}.",
    { place: ["school", "park", "river", "shop"], time: ["five minutes", "ten minutes", "a minute", "three minutes"] }],
  ["cook", "He ______ (cook) {food} for the whole family, {name}.",
    { food: ["plov", "soup", "dinner", "breakfast"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["read", "Malika ______ (reads) {lang} books {how}.",
    { lang: ["English", "Russian", "Turkish", "Korean"], how: ["easily", "quickly", "without a dictionary", "very well"] }],
  ["jump", "My cousin ______ (jump) over the {thing}, {name}.",
    { thing: ["fence", "wall", "box", "bench"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["make", "My aunt ______ (makes) beautiful {thing} at home, {name}.",
    { thing: ["bags", "dolls", "baskets", "toys"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["catch", "Timur ______ (catch) {thing} with one hand, {name}.",
    { thing: ["a ball", "an apple", "the keys", "a bottle"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["type", "Olga ______ (types) {num} words in a minute, {name}.",
    { num: ["forty", "fifty", "sixty", "eighty"], name: ["Mum", "Dad", "Aziz", "Timur"] }],
  ["fly", "Mr Karimov ______ (fly) a {thing}, {name}.",
    { thing: ["plane", "kite", "drone", "helicopter"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["ride", "My little brother ______ (rides) a {vehicle} without help now, {name}.",
    { vehicle: ["bike", "scooter", "horse", "pony"], name: ["Mum", "Dad", "Grandma", "Olga"] }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `can ${v}`, why: W(v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const CHG = (who) => `Change I to ${who}. Rewrite the sentence.`;
const SAY = "Say it with can.";
const TRANSFORM = [
  // correct the form (5)
  [COR, "My sister cans drive a {vehicle}, {name}.", "My sister ______ a {vehicle}, {name}.", "drive",
    { vehicle: ["car", "bus", "truck", "tractor"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [COR, "He can swims in the {water} {how}.", "He ______ in the {water} {how}.", "swim",
    { water: ["river", "lake", "sea", "pool"], how: ["very fast", "very well", "underwater", "for an hour"] }],
  [COR, "Lola can to play the {inst} {how}.", "Lola ______ the {inst} {how}.", "play",
    { inst: ["piano", "guitar", "violin", "dutar"], how: ["very well", "a little", "beautifully", "quite well"] }],
  [COR, "Grandpa is can make {thing}, {name}.", "Grandpa ______ {thing}, {name}.", "make",
    { thing: ["baskets", "chairs", "tables", "kites"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "Aziz cans speaks {lang} {how}.", "Aziz ______ {lang} {how}.", "speak",
    { lang: ["English", "Russian", "Korean", "Turkish"], how: ["well", "a little", "very well", "quite well"] }],
  // change I to he / she (5)
  [CHG("my brother"), "I can cook {food} {how}.", "My brother ______ {food} {how}.", "cook",
    { food: ["plov", "eggs", "soup", "pasta"], how: ["well", "a little", "very well", "without help"] }],
  [CHG("my sister"), "I can ride a {vehicle} {how}.", "My sister ______ a {vehicle} {how}.", "ride",
    { vehicle: ["bike", "horse", "scooter", "skateboard"], how: ["fast", "very well", "without help", "quite well"] }],
  [CHG("Aunt Lola"), "I can read {lang} {how}.", "Aunt Lola ______ {lang} {how}.", "read",
    { lang: ["English", "Arabic", "Korean", "Turkish"], how: ["well", "a little", "very well", "quite well"] }],
  [CHG("Dad"), "I can fix {thing} for {who}.", "Dad ______ {thing} for {who}.", "fix",
    { thing: ["bikes", "chairs", "lamps", "doors"], who: ["the neighbours", "our friends", "Grandma", "the school"] }],
  [CHG("Madina"), "I can sing {song} {how}.", "Madina ______ {song} {how}.", "sing",
    { song: ["Uzbek songs", "English songs", "old songs", "Russian songs"], how: ["very well", "beautifully", "from memory", "without music"] }],
  // present simple -> can (5)
  [SAY, "Timur plays {game} {how}.", "Timur ______ {game} {how}.", "play",
    { game: ["chess", "tennis", "football", "volleyball"], how: ["very well", "quite well", "well", "a little"] }],
  [SAY, "Grandma bakes bread in a {place}, {name}.", "Grandma ______ bread in a {place}, {name}.", "bake",
    { place: ["tandir", "big oven", "small oven", "clay oven"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [SAY, "She speaks {lang} with her {who}.", "She ______ {lang} with her {who}.", "speak",
    { lang: ["Russian", "English", "Korean", "Turkish"], who: ["grandmother", "friends", "teacher", "cousins"] }],
  [SAY, "My uncle drives a {vehicle}, {name}.", "My uncle ______ a {vehicle}, {name}.", "drive",
    { vehicle: ["bus", "truck", "tractor", "taxi"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [SAY, "He writes {thing} in {lang}.", "He ______ {thing} in {lang}.", "write",
    { thing: ["letters", "stories", "poems", "emails"], lang: ["English", "Korean", "Arabic", "Turkish"] }],
].map(([instr, source, hint, v, slots], i) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `can ${v}`,
  why: i < 5 ? W(v) : i < 10 ? `${RULE} With I or with he / she, it is the same: can ${v}.` : `${RULE} The -s goes: can ${v}.`,
  slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something your mother or father can do well.", "He can … / She can …", ["exactly one sentence", "he or she + can + verb", "no -s and no to"]],
  ["Write one sentence about a friend and a sport he or she can play.", "can play", ["exactly one sentence", "a friend's name + can play", "no -s and no to"]],
  ["Write one sentence about a language a person in your family can speak.", "can speak", ["exactly one sentence", "a family word + can speak", "no -s and no to"]],
  ["Write one sentence about something your grandmother or grandfather can make.", "can make", ["exactly one sentence", "he or she + can make", "no -s and no to"]],
  ["Write one sentence about a little child you know and what he or she can do now.", "can + verb", ["exactly one sentence", "he or she + can", "no -s and no to"]],
  ["Write one sentence about a teacher and something he or she can do well.", "can + verb", ["exactly one sentence", "a teacher + can", "no -s and no to"]],
  ["Write one sentence about a famous person you like and what he or she can do.", "can + verb", ["exactly one sentence", "he or she + can", "no -s and no to"]],
  ["Write two sentences: one thing your brother or sister can do, one thing your friend can do.", "can + verb", ["exactly two sentences", "he or she + can in both", "no -s and no to"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell a new friend about a person in your family and three things he or she can do.", "he / she can + verb", ["he can / she can", "three different verbs", "no -s and no to"]],
  ["Describe your best friend. What can he or she do well?", "he / she can + verb", ["he can / she can", "well / very well", "three or four sentences"]],
  ["Write about a grandparent. What can he or she make or do with his or her hands?", "can make / can do", ["can make or can sew or can fix", "he or she", "three or four sentences"]],
  ["Tell a visitor about a teacher at your school and what he or she can do.", "he / she can + verb", ["he can / she can", "no -s and no to", "three or four sentences"]],
  ["Write about a little child you know. What can he or she do now?", "he / she can + verb", ["he can / she can", "now", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.ability-permission.can-form.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);