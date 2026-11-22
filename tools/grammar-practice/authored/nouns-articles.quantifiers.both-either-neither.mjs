// Hand-authored: nouns-articles / quantifiers / both-either-neither (B1).
// Wave C, C5 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: both (two, positive) vs neither / either / none, with the
// right agreement. Always about TWO people or things.
// One right answer: every gap has a setup or a link that fixes the meaning
// (placement lesson: "Neither of my parents work" is said informally, so a
// bare "______ of my parents work" has more than one answer). Forcing
// devices: a first sentence that states both facts, "so / but" clauses,
// both … and / neither … nor / either … or, and the noun form (both + plural,
// either / neither + singular: "either day", "neither answer").
// Verbs in choose avoid number agreement fights: modals and past tense where
// possible; where a verb shows number it is the standard one (Both … are,
// Neither … works).
// Choose options: both / neither / either / none ("none" is wrong for two).
// Build: "Write both, either or neither." No sentence prints its own key.
// Transform: 5 two sentences → both … and / 5 two negatives → neither … nor /
// 5 a choice → either … or.
//
// Run: node tools/grammar-practice/authored/nouns-articles.quantifiers.both-either-neither.mjs

import { writeFileSync } from "node:fs";

// Audit (Claude, 20 Nov): "Neither of them are doctors" is said too, so the both line now has "just like our mother".
const BASE = { domain: "nouns-articles", branch: "quantifiers", topic: "both-either-neither", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAME2 = ["Olga", "Lola", "Kamila", "Madina"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const WHY = {
  b: "It is true for the two of them, so use both (with a plural verb).",
  n: "It is true for not one of the two: neither already means not this one and not that one.",
  e: "Any one of the two is OK, so use either (with a singular noun).",
  en: "The verb is already negative, so use either: not … either = not this one and not that one.",
  bn: "both … and joins two things that are both true.",
  nn: "neither … nor joins two things that are both not true.",
  eo: "either … or gives a choice between two things.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["both", "b", "My mum can {skill}, and my dad can too. ______ of my parents can {skill}, {name}.", { skill: ["drive", "swim", "cook plov", "speak Russian"], name: NAME }],
  ["neither", "n", "Aziz can't {skill}, and Timur can't either. ______ of them can {skill}.", { skill: ["swim", "ski", "cook", "ride a horse"], x: [] }],
  ["either", "e", "There are two buses to the {place}, the 12 and the 45. You can take ______ of them, but not both, {name}.", { place: ["bazaar", "station", "university", "airport"], name: NAME }],
  ["both", "b", "______ my grandparents live in {city}, {name}. They have a house there.", { city: ["Samarkand", "Termez", "Nukus", "Jizzakh"], name: NAME }],
  ["neither", "n", "I asked my two friends for help, but ______ of them had time {when}, {name}.", { when: ["yesterday", "on Saturday", "last week", "this morning"], name: NAME }],
  ["either", "en", "I don't like ______ of these two {things}, {name}. Can I see another one?", { things: ["shirts", "bags", "phones", "jackets"], name: NAME }],
  ["both", "b", "Olga and Lola are best friends. ______ of them want to study {subject} in {city}.", { subject: ["medicine", "law", "maths", "art"], city: ["Tashkent", "Kazan", "Seoul", "Almaty"] }],
  ["neither", "n", "______ of the two {things} was cheap, so I didn't buy anything, {name}.", { things: ["bags", "jackets", "phones", "watches"], name: NAME }],
  ["either", "e", "We can meet on Saturday or Sunday. ______ day is fine for me, {name}.", { name: NAME, x: [] }],
  ["both", "b", "I've got two sisters. ______ of them are {jobs}, just like our mother, {name}.", { jobs: ["doctors", "teachers", "nurses", "students"], name: NAME }],
  ["neither", "n", "______ of my two brothers likes {food}. They never eat it, {name}.", { food: ["fish", "onions", "carrots", "soup"], name: NAME }],
  ["either", "e", "You can use ______ computer in the {room}, {name}. They both work now.", { room: ["lab", "library", "office", "classroom"], name: NAME }],
  ["both", "bn", "______ my phone and my laptop are broken, {name}. I can't {task}.", { name: NAME, task: ["do my homework", "send emails", "watch the lesson", "read my messages"] }],
  ["neither", "nn", "______ my mum nor my dad can come to the {event}, {name}.", { event: ["concert", "meeting", "match", "show"], name: NAME }],
  ["either", "eo", "You can pay ______ by card or in cash at the {place}, {name}.", { place: ["shop", "café", "hotel", "cinema"], name: NAME }],
  ["both", "bn", "We visited ______ Samarkand and Bukhara on our {trip}, {name}.", { trip: ["trip", "holiday", "school trip", "tour"], name: NAME }],
  ["neither", "n", "I called Aziz and Timur, but ______ of them answered, {name}.", { name: NAME2, x: [] }],
  ["both", "b", "My mum and dad are doctors. ______ of them work at the same hospital, so they go to work together every {time}.", { time: ["morning", "day", "Monday", "weekday"], x: [] }],
  ["either", "en", "I don't know ______ of the two new students in our {group}, {name}.", { group: ["class", "group", "team", "course"], name: NAME }],
  ["neither", "n", "We had two {things} at home, but ______ of them worked, so we bought a new one, {name}.", { things: ["TVs", "fans", "kettles", "irons"], name: NAME }],
].map(([k, w, prompt, slots], i) => {
  const start = prompt.startsWith("______");
  const base = ["both", "neither", "either", "none"].map((o) => (start ? o[0].toUpperCase() + o.slice(1) : o));
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.findIndex((o) => o.toLowerCase() === k), why: WHY[w], slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write both, either or neither.";
const BUILD = [
  ["Both", "bn", "______ Aziz and his sister speak {lang} well. They learned it at {place}.", { lang: ["Russian", "English", "Korean", "Turkish"], place: ["school", "home", "a language school", "university"] }],
  ["Neither", "nn", "______ my brother nor my sister likes {food}, {name}.", { food: ["fish", "eggs", "onions", "mushrooms"], name: NAME }],
  ["either", "eo", "You can come to the {place} ______ on Monday or on Friday, {name}.", { place: ["club", "office", "lesson", "class"], name: NAME }],
  ["Both", "b", "My sisters are twins. ______ of them were born on the {day} of May, {name}.", { day: ["first", "fifth", "tenth", "twelfth"], name: NAME }],
  ["neither", "n", "I have two old phones, but ______ of them works now, so I use my {who}'s, {name}.", { who: ["mum", "brother", "sister", "dad"], name: NAME }],
  ["Either", "e", "I don't mind: we can watch the {a} or the cartoon. ______ is fine for me, {name}.", { a: ["match", "news", "film", "show"], name: NAME }],
  ["both", "bn", "We need ______ eggs and flour for the {food}, {name}.", { food: ["cake", "pancakes", "biscuits", "pie"], name: NAME }],
  ["Neither", "n", "______ of the two hotels had a free room, so we slept at {place}, {name}.", { place: ["my aunt's", "a friend's house", "a guest house", "my cousin's flat"], name: NAME }],
  ["either", "eo", "Take ______ the bus or a taxi to the {place}, {name}.", { place: ["station", "airport", "bazaar", "museum"], name: NAME }],
  ["Both", "bn", "______ my mum and my grandmother make very good {food}, {name}.", { food: ["plov", "somsa", "manti", "soup"], name: NAME }],
  ["neither", "n", "I tried two keys, but ______ of them opened the {door}, {name}.", { door: ["door", "gate", "box", "garage"], name: NAME }],
  ["either", "e", "There are two free seats on the {vehicle}. You can take ______ one, {name}.", { vehicle: ["bus", "train", "plane", "tram"], name: NAME }],
  ["both", "bn", "{name} is good at ______ maths and {subject}.", { name: NAME, subject: ["physics", "chemistry", "history", "art"] }],
  ["Neither", "nn", "______ Timur nor Aziz was at {place} {when}.", { place: ["school", "the lesson", "practice", "the meeting"], when: ["yesterday", "on Monday", "this morning", "today"] }],
  ["either", "eo", "I can't decide. I'll buy ______ the red bag or the {colour} one, {name}.", { colour: ["black", "blue", "brown", "white"], name: NAME }],
  ["both", "b", "We watched two films at the {event} and liked ______ of them. They were great, {name}.", { event: ["festival", "cinema club", "camp", "party"], name: NAME }],
  ["neither", "n", "We had two plans for the weekend, but ______ worked because of the {weather}, {name}.", { weather: ["rain", "snow", "wind", "storm"], name: NAME }],
  ["either", "en", "I didn't see ______ of your brothers at the {event}, {name}.", { event: ["wedding", "party", "match", "meeting"], name: NAME }],
  ["Both", "b", "______ teams played very well {when}, {name}.", { when: ["yesterday", "last night", "on Sunday", "in the final"], name: NAME }],
  ["Neither", "n", "______ answer on the {thing} is right, {name}. Try again.", { thing: ["board", "page", "screen", "card"], name: NAME }],
].map(([key, w, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[w], slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const BOTH = "Join the two sentences with both.";
const NEI = "Join the two sentences with neither … nor.";
const EIT = "Rewrite with either.";
const TRANSFORM = [
  // both (5)
  [BOTH, "My mum likes {food}. My dad likes {food} too, {name}.", "______ my mum ______ my dad like {food}, {name}.", ["Both", "and"], WHY.bn, { food: ["plov", "fish", "green tea", "melons"], name: NAME }],
  [BOTH, "Olga works at a {place} in {city}. Lola works at a {place} in {city} too.", "______ Olga ______ Lola work at a {place} in {city}.", ["Both", "and"], WHY.bn, { place: ["hotel", "bank", "school", "hospital"], city: ["Tashkent", "Bukhara", "Andijan", "Moscow"] }],
  [BOTH, "My brother plays {sport}. My cousin plays {sport} too, {name}.", "______ my brother ______ my cousin play {sport}, {name}.", ["Both", "and"], WHY.bn, { sport: ["football", "chess", "tennis", "volleyball"], name: NAME }],
  [BOTH, "The kitchen is {adj}. The bathroom is {adj} too, {name}.", "______ the kitchen ______ the bathroom are {adj}, {name}.", ["Both", "and"], WHY.bn, { adj: ["small", "clean", "new", "cold"], name: NAME }],
  [BOTH, "I've got two sisters. One is a {job}, and the other is a {job} too, {name}.", "I've got two sisters. ______ of them are {job}s, {name}.", "Both", WHY.b, { job: ["doctor", "teacher", "nurse", "student"], name: NAME }],
  // neither ... nor (5)
  [NEI, "My brother doesn't eat {food}. My sister doesn't eat {food} either, {name}.", "______ my brother ______ my sister eats {food}, {name}.", ["Neither", "nor"], WHY.nn, { food: ["fish", "onions", "eggs", "carrots"], name: NAME }],
  [NEI, "Aziz wasn't at the {event} {when}. Timur wasn't there either.", "______ Aziz ______ Timur was at the {event} {when}.", ["Neither", "nor"], WHY.nn, { event: ["party", "meeting", "lesson", "match"], when: ["yesterday", "on Friday", "last night", "this morning"] }],
  [NEI, "The red jacket in this {shop} isn't cheap. The black one isn't cheap either, {name}.", "______ the red jacket ______ the black one in this {shop} is cheap, {name}.", ["Neither", "nor"], WHY.nn, { shop: ["shop", "market", "mall", "store"], name: NAME }],
  [NEI, "My sister isn't {adj}. My brother isn't {adj} either, {name}.", "______ my sister ______ my brother is {adj}, {name}.", ["Neither", "nor"], WHY.nn, { adj: ["tall", "lazy", "shy", "noisy"], name: NAME }],
  [NEI, "My dad can't come to the {event} {when}. My mum can't come either.", "______ my dad ______ my mum can come to the {event} {when}.", ["Neither", "nor"], WHY.nn, { event: ["concert", "meeting", "show", "match"], when: ["tonight", "on Sunday", "tomorrow", "this week"] }],
  // either (5)
  [EIT, "You can go to the {place} by bus, or you can go by taxi, {name}.", "You can go to the {place} ______ by bus ______ by taxi, {name}.", ["either", "or"], WHY.eo, { place: ["station", "bazaar", "airport", "museum"], name: NAME }],
  [EIT, "We can meet at the {place} on Saturday, or we can meet there on Sunday, {name}.", "We can meet at the {place} ______ on Saturday ______ on Sunday, {name}.", ["either", "or"], WHY.eo, { place: ["park", "café", "library", "station"], name: NAME }],
  [EIT, "After {meal} you can have tea, or you can have coffee, {name}.", "After {meal} you can have ______ tea ______ coffee, {name}.", ["either", "or"], WHY.eo, { meal: ["lunch", "dinner", "class", "the lesson"], name: NAME }],
  [EIT, "I didn't see your brother at the {event}, and I didn't see your sister there, {name}.", "I didn't see ______ of them at the {event}, {name}.", "either", WHY.en, { event: ["wedding", "party", "match", "concert"], name: NAME }],
  [EIT, "Maybe Olga will call you {when}, {name}, or maybe Lola will.", "______ Olga ______ Lola will call you {when}, {name}.", ["Either", "or"], WHY.eo, { when: ["tonight", "tomorrow", "after lunch", "later"], name: ["Aziz", "Timur", "Bobur", "Rustam"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about two people in your family who like the same thing.", "Both my … and my … like …", ["exactly one sentence", "both … and", "a plural verb"]],
  ["Write one sentence about two friends who can't do something.", "Neither … nor … can …", ["exactly one sentence", "neither … nor", "can"]],
  ["Write one sentence that gives a friend a choice between two places.", "We can go either to … or to …", ["exactly one sentence", "either … or", "two places"]],
  ["Write one sentence about two subjects you are good at.", "I'm good at both … and …", ["exactly one sentence", "both … and", "two subjects"]],
  ["Write one sentence about two foods you don't like.", "I don't like either … / I like neither …", ["exactly one sentence", "either or neither", "two foods"]],
  ["Write one sentence about your parents or grandparents with both of them.", "Both of them …", ["exactly one sentence", "both of them", "a plural verb"]],
  ["Write one sentence about two shops or cafés near you.", "Neither of them … / Both of them …", ["exactly one sentence", "both of or neither of", "two places"]],
  ["Write two sentences: one with both and one with neither.", "Both … / Neither …", ["exactly two sentences", "both once", "neither once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare your two best friends: what do they both like, and what does neither of them like?", "Both of them … / Neither of them …", ["both", "neither", "three or four sentences"]],
  ["Your friend can't choose between two phones. Give advice.", "Both phones are … / Either one is …", ["both or either", "is / are agreement", "three or four sentences"]],
  ["Describe your parents or two relatives: what is the same about them?", "Both my … and my … / Neither of them …", ["both … and", "neither", "three or four sentences"]],
  ["Plan a weekend with a friend: give two choices.", "We can either … or … / Both are …", ["either … or", "both", "three or four sentences"]],
  ["Describe two cities or villages you know.", "Both … are … / Neither of them is …", ["both", "neither or either", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/nouns-articles.quantifiers.both-either-neither.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "Mum can and Dad can: the two together: both.",
   "Aziz can't and Timur can't: not one of the two: neither.",
   "\"but not both\": one of the two, any one: either.",
   "\"They have a house there\": the two together: Both.",
   "No friend had time: not one of the two: neither.",
   "don't + like: after a negative verb use either.",
   "Best friends who share a plan: the two together: both.",
   "Nothing was cheap, so not one of the two: Neither.",
   "Saturday or Sunday, any one is fine: either.",
   "\"just like our mother\": the two sisters together: both.",
   "\"They never eat it\": not one of the two: Neither.",
   "\"They both work\": you can use any one: either.",
   "Phone and laptop, the two together: Both … and.",
   "Not Mum and not Dad: Neither … nor.",
   "Card or cash, one of the two: either … or.",
   "Two cities, we visited the two: both … and.",
   "No one answered: not one of the two: neither.",
   "\"go to work together\": the two together: both.",
   "don't + know: after a negative verb use either.",
   "\"we bought a new one\": not one worked: neither."
  ],
  "build": [
   "Aziz and his sister together: Both … and.",
   "Not my brother and not my sister: Neither … nor.",
   "Monday or Friday, one of the two: either … or.",
   "Twins, the two together: Both.",
   "\"so I use my …'s\": not one works: neither.",
   "\"I don't mind\": any one of the two: Either.",
   "Eggs and flour, the two together: both … and.",
   "\"we slept at …\": not one hotel was free: Neither.",
   "Bus or taxi, one of the two: either … or.",
   "Mum and grandmother together: Both … and.",
   "No key opened it: neither.",
   "Two free seats, take any one: either.",
   "Maths and another subject together: both … and.",
   "Not Timur and not Aziz: Neither … nor.",
   "\"I can't decide\": one or the other: either … or.",
   "\"They were great\": the two films: both.",
   "No plan worked: neither.",
   "didn't + see: after a negative verb use either.",
   "The two teams together: Both.",
   "\"Try again\": no answer is right: Neither."
  ],
  "transform": [
   "Mum and Dad, too: Both … and.",
   "Olga and Lola, too: Both … and.",
   "Brother and cousin, too: Both … and.",
   "Kitchen and bathroom, too: Both … and.",
   "One and the other, too: both of them.",
   "doesn't … either → Neither … nor.",
   "wasn't … either → Neither … nor.",
   "isn't … either → Neither … nor.",
   "Not my sister and not my brother: Neither … nor.",
   "can't … either → Neither … nor.",
   "by bus, or by taxi → either … or.",
   "Saturday, or Sunday → either … or.",
   "tea, or coffee → either … or.",
   "didn't see … and didn't see → either of them.",
   "Maybe Olga or maybe Lola → Either … or."
  ]
 }
};
{
  const byStage = (st) => items.filter((it) => it.stage === st);
  for (const [st, list] of Object.entries(VARIETY.why || {})) {
    if (list.length !== byStage(st).length) throw new Error(`VARIETY: ${st} has ${byStage(st).length} items, ${list.length} whys`);
    byStage(st).forEach((it, i) => { if (list[i]) it.why = list[i]; });
  }
  for (const [st, n, word, name, vals] of VARIETY.slot || []) {
    const it = byStage(st)[n - 1];
    if (!word) { if (!it?.slots?.[name]) throw new Error(`VARIETY: no slot ${name} in ${st} ${n}`); it.slots[name] = [...new Set([...it.slots[name], ...vals])]; continue; }
    const re = new RegExp(`(?<![\\w{])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w}])`, "g");
    let hit = false;
    for (const f of ["prompt", "source", "hint"]) if (it?.[f] && re.test(it[f])) { it[f] = it[f].replace(re, `{${name}}`); hit = true; re.lastIndex = 0; }
    if (!hit) throw new Error(`VARIETY: "${word}" not found in ${st} ${n}`);
    it.slots = { ...(it.slots || {}), [name]: vals };
  }
}
// end variety
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);