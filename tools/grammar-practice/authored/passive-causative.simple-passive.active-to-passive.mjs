// Hand-authored: passive-causative / simple-passive / active-to-passive (A2).
// Path fill P59 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: rewrite in the passive (Shakespeare wrote Hamlet. →
// Hamlet ______. → was written by Shakespeare).
// Sibling scope: the last of P57-P59. Turning an ACTIVE sentence into a
// PASSIVE one with "by + the doer", keeping the tense: present → is / are
// + past participle, past → was / were + past participle. Only named or
// noun doers (my grandpa, the postman, farmers); never they / people /
// someone (the passive then drops "by"), never a pronoun doer (by him).
// Simple verbs only (built, written, made, taken, cleaned, taught, spoken,
// grown, sold, used, painted, sent, found, planted, delivered, washed).
// Choose: the active sentence is printed; four passive versions. Key keeps
// the tense with "by"; distractors: the other tense (is ↔ was, are ↔
// were), "from" instead of by (the Russian "от" calque), and no be (This
// house built by …). 10 past / 10 present, about half plural.
// Build: two blanks, be + participle and by (["was built", "by"]); the
// active sentence is in instr.
// Transform: 5 past one thing / 5 present one thing / 5 more than one
// (are / were); keys are fixed phrases ("was built by my grandpa").
//
// Run: node tools/grammar-practice/authored/passive-causative.simple-passive.active-to-passive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "passive-causative", branch: "simple-passive", topic: "active-to-passive", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];
const YEAR = ["1985", "1990", "2005", "2012"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const fix = (slots, text) => { const s = {}; for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v; return s; };
const SWAP = { is: "was", was: "is", are: "were", were: "are" };
const WHY = "The object comes first, keep the tense (present → is / are, past → was / were), add the past participle, then by + the doer.";

/* ---------------- choose: 20 mcq ---------------- */
// [active, object (capitalised), be, participle, doer, trailing sentence, slots]
const CH = [
  ["My grandpa built this house.", "This house", "was", "built", "my grandpa", "It's in {city}, {name}.", { city: CITY, name: NAME }],
  ["Alisher Navoi wrote this poem.", "This poem", "was", "written", "Alisher Navoi", "We read it in {lesson}, {name}.", { lesson: ["class", "our lesson", "year seven", "school"], name: NAME }],
  ["Our teacher took these photos.", "These photos", "were", "taken", "our teacher", "They're from {city}, {name}.", { city: CITY, name: NAME }],
  ["Mum made this cake.", "This cake", "was", "made", "Mum", "It's for {who}'s birthday, {name}.", { who: ["Dad", "Grandma", "Aziz", "Lola"], name: NAME }],
  ["My uncle painted these pictures.", "These pictures", "were", "painted", "my uncle", "Look at the {thing}, {name}.", { thing: ["colours", "flowers", "mountains", "horses"], name: NAME }],
  ["A boy found my phone.", "My phone", "was", "found", "a boy", "He gave it back {when}, {name}.", { when: ["yesterday", "this morning", "at once", "after school"], name: NAME }],
  ["The neighbours planted these trees.", "These trees", "were", "planted", "the neighbours", "Now they're {adj}, {name}.", { adj: ["very tall", "green", "full of fruit", "beautiful"], name: NAME }],
  ["Grandma cooked the plov.", "The plov", "was", "cooked", "Grandma", "It was {adj}, {name}.", { adj: ["delicious", "hot", "perfect", "very good"], name: NAME }],
  ["The ball broke the window.", "The window", "was", "broken", "the ball", "Who kicked it, {name}? It happened {when}.", { name: NAME, when: ["during the match", "after lunch", "yesterday", "this morning"] }],
  ["My friend sent these letters.", "These letters", "were", "sent", "my friend", "They came from {city}, {name}.", { city: ["Moscow", "London", "Almaty", "Istanbul"], name: NAME }],
  ["Millions of people speak English.", "English", "is", "spoken", "millions of people", "That's why we learn it, {name}. It's {adj}.", { name: NAME, adj: ["useful", "important", "everywhere", "popular"] }],
  ["Farmers grow these melons.", "These melons", "are", "grown", "farmers", "They come from {region}, {name}.", { region: ["Khorezm", "our village", "the south", "Mirzachul"], name: NAME }],
  ["My dad cleans the car.", "The car", "is", "cleaned", "my dad", "He does it on {day}, {name}.", { day: ["Sundays", "Saturdays", "Fridays", "weekends"], name: NAME }],
  ["Ms Ivanova teaches this class.", "This class", "is", "taught", "Ms Ivanova", "Her lessons start at {time}, {name}.", { time: ["eight", "nine", "ten", "half past eight"], name: NAME }],
  ["The postman delivers the letters.", "The letters", "are", "delivered", "the postman", "He comes every {when}, {name}.", { when: ["morning", "day", "Monday", "afternoon"], name: NAME }],
  ["Mum washes the dishes.", "The dishes", "are", "washed", "Mum", "Can we help her {when}, {name}?", { when: ["tonight", "after dinner", "today", "tomorrow"], name: NAME }],
  ["My sister makes these bags.", "These bags", "are", "made", "my sister", "She sells them in {city}, {name}.", { city: CITY, name: NAME }],
  ["Young people use this app.", "This app", "is", "used", "young people", "It's good for {thing}, {name}.", { thing: ["music", "photos", "games", "chat"], name: NAME }],
  ["Tourists visit this museum.", "This museum", "is", "visited", "tourists", "They come from {place}, {name}.", { place: ["many countries", "Europe", "Asia", "everywhere"], name: NAME }],
  ["My brother writes these songs.", "These songs", "are", "written", "my brother", "He plays them on the {inst}, {name}.", { inst: ["guitar", "piano", "dutar", "violin"], name: NAME }],
];
const CHOOSE = CH.map(([active, obj, be, pp, doer, trail, slots], i) => {
  const key = `${obj} ${be} ${pp} by ${doer}.`;
  const base = [key, `${obj} ${SWAP[be]} ${pp} by ${doer}.`, `${obj} ${be} ${pp} from ${doer}.`, `${obj} ${pp} by ${doer}.`];
  const options = rot(base, i);
  const prompt = `Active: ${active} Passive: ______ ${trail}`;
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(key), why: WHY, slots: fix(slots, prompt) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const BUILD = [
  ["Mum cooks dinner.", "Dinner ______ ______ Mum. Tonight it's {food}, {name}.", ["is cooked", "by"], { food: ["plov", "soup", "manti", "lagman"], name: NAME }],
  ["My uncle built this café.", "This café ______ ______ my uncle. It's near the {place}, {name}.", ["was built", "by"], { place: ["park", "bazaar", "station", "river"], name: NAME }],
  ["Millions of people speak Russian.", "Russian ______ ______ millions of people. My {who} speaks it too.", ["is spoken", "by"], { who: ["mum", "dad", "teacher", "grandma"] }],
  ["Lola took this photo.", "This photo ______ ______ Lola. It's from {city}, {name}.", ["was taken", "by"], { city: CITY, name: NAME }],
  ["Farmers grow these apricots.", "These apricots ______ ______ farmers in {region}, {name}.", ["are grown", "by"], { region: ["Fergana", "our village", "the south", "the valley"], name: NAME }],
  ["A famous poet wrote this song.", "This song ______ ______ a famous poet. We sing it at {event}, {name}.", ["was written", "by"], { event: ["weddings", "school", "parties", "concerts"], name: NAME }],
  ["The school cleaner cleans the classrooms.", "The classrooms ______ ______ the school cleaner. She comes at {time}, {name}.", ["are cleaned", "by"], { time: ["five", "six", "four", "seven"], name: NAME }],
  ["My grandma made these scarves.", "These scarves ______ ______ my grandma. They're {colour}, {name}.", ["were made", "by"], { colour: ["red", "blue", "green", "white"], name: NAME }],
  ["Our neighbour sells these melons.", "These melons ______ ______ our neighbour. They're very {adj}, {name}.", ["are sold", "by"], { adj: ["sweet", "big", "cheap", "good"], name: NAME }],
  ["A boy found my wallet.", "My wallet ______ ______ a boy. He gave it back {when}, {name}.", ["was found", "by"], { when: ["yesterday", "this morning", "at once", "after school"], name: NAME }],
  ["Ms Karimova teaches our class.", "Our class ______ ______ Ms Karimova. Her lessons start at {time}, {name}.", ["is taught", "by"], { time: ["eight", "nine", "ten", "half past eight"], name: NAME }],
  ["The children painted these pictures.", "These pictures ______ ______ the children. Look at the {thing}, {name}.", ["were painted", "by"], { thing: ["colours", "sun", "flowers", "houses"], name: NAME }],
  ["The postman delivers our letters.", "Our letters ______ ______ the postman. He comes every {when}, {name}.", ["are delivered", "by"], { when: ["morning", "day", "Monday", "afternoon"], name: NAME }],
  ["The wind broke the window.", "The window ______ ______ the wind. It happened {when}, {name}.", ["was broken", "by"], { when: ["last night", "yesterday", "in the storm", "on Friday"], name: NAME }],
  ["Students use this room.", "This room ______ ______ students. They study here every {when}, {name}.", ["is used", "by"], { when: ["day", "evening", "morning", "afternoon"], name: NAME }],
  ["My dad planted these trees.", "These trees ______ ______ my dad. Now they're {adj}, {name}.", ["were planted", "by"], { adj: ["very tall", "green", "full of fruit", "beautiful"], name: NAME }],
  ["Tourists visit this museum.", "This museum ______ ______ tourists from {place}, {name}.", ["is visited", "by"], { place: ["many countries", "Europe", "Asia", "everywhere"], name: NAME }],
  ["My cousin sent these flowers.", "These flowers ______ ______ my cousin. They came {when}, {name}.", ["were sent", "by"], { when: ["this morning", "yesterday", "on my birthday", "an hour ago"], name: NAME }],
  ["Grandpa washes the car.", "The car ______ ______ Grandpa. He does it on {day}, {name}.", ["is washed", "by"], { day: ["Sundays", "Saturdays", "Fridays", "weekends"], name: NAME }],
  ["Our class made this video.", "This video ______ ______ our class. We filmed it for {event}, {name}.", ["was made", "by"], { event: ["Navruz", "the school party", "Teachers' Day", "our project"], name: NAME }],
].map(([active, source, key, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: `Make it passive: ${active}`, source, key, why: WHY, slots: fix(slots, source) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const INSTR_T = "Rewrite the sentence in the passive. Keep the tense and use by.";
const TRANSFORM = [
  // past, one thing (5)
  ["My grandpa built this house in {year}, {name}.", "This house ______ in {year}, {name}.", "was built by my grandpa", { year: YEAR, name: NAME }],
  ["Alisher Navoi wrote this poem, {name}. We read it in {lesson}.", "This poem ______, {name}. We read it in {lesson}.", "was written by Alisher Navoi", { name: NAME, lesson: ["class", "our lesson", "year seven", "school"] }],
  ["Mum made this dress for the {event}, {name}.", "This dress ______ for the {event}, {name}.", "was made by Mum", { event: ["wedding", "party", "concert", "holiday"], name: NAME }],
  ["A boy found my phone in the {place}, {name}.", "My phone ______ in the {place}, {name}.", "was found by a boy", { place: ["park", "bus", "yard", "library"], name: NAME }],
  ["The ball broke the window {when}, {name}.", "The window ______ {when}, {name}.", "was broken by the ball", { when: ["during the match", "after lunch", "yesterday", "this morning"], name: NAME }],
  // present, one thing (5)
  ["My dad cleans the car every {day}, {name}.", "The car ______ every {day}, {name}.", "is cleaned by my dad", { day: ["Sunday", "Saturday", "Friday", "weekend"], name: NAME }],
  ["Ms Ivanova teaches this class on {day}, {name}.", "This class ______ on {day}, {name}.", "is taught by Ms Ivanova", { day: ["Mondays", "Tuesdays", "Thursdays", "Fridays"], name: NAME }],
  ["Millions of people speak {lang}, {name}.", "{lang} ______, {name}.", "is spoken by millions of people", { lang: ["English", "Russian", "Spanish", "Arabic"], name: NAME }],
  ["Young people use this {app} a lot, {name}.", "This {app} ______ a lot, {name}.", "is used by young people", { app: ["app", "website", "café", "park"], name: NAME }],
  ["My sister makes this {food} every {when}, {name}.", "This {food} ______ every {when}, {name}.", "is made by my sister", { food: ["cake", "salad", "soup", "bread"], when: ["Sunday", "week", "weekend", "holiday"], name: NAME }],
  // more than one (5)
  ["Our teacher took these photos in {city}, {name}.", "These photos ______ in {city}, {name}.", "were taken by our teacher", { city: CITY, name: NAME }],
  ["The neighbours planted these trees {when}, {name}.", "These trees ______ {when}, {name}.", "were planted by the neighbours", { when: ["last spring", "ten years ago", "in 2015", "last autumn"], name: NAME }],
  ["The postman delivers the letters every {when}, {name}.", "The letters ______ every {when}, {name}.", "are delivered by the postman", { when: ["morning", "day", "Monday", "afternoon"], name: NAME }],
  ["Farmers grow these melons in {region}, {name}.", "These melons ______ in {region}, {name}.", "are grown by farmers", { region: ["Khorezm", "our village", "the south", "Mirzachul"], name: NAME }],
  ["My brother writes these songs on the {inst}, {name}.", "These songs ______ on the {inst}, {name}.", "are written by my brother", { inst: ["guitar", "piano", "dutar", "violin"], name: NAME }],
].map(([source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr: INSTR_T, source, hint, key, why: WHY, slots: fix(slots, source + hint) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one passive sentence about a building and who built it.", "… was built by …", ["exactly one sentence", "was built by", "a person word"]],
  ["Write one passive sentence about a book or song and who wrote it.", "… was written by …", ["exactly one sentence", "was written by", "a name"]],
  ["Write one passive sentence about a meal and who cooks it in your family.", "… is cooked by …", ["exactly one sentence", "is cooked by", "a food word"]],
  ["Write one passive sentence about a photo and who took it.", "This photo was taken by …", ["exactly one sentence", "was taken by", "a person word"]],
  ["Write one passive sentence about a subject and who teaches it.", "… is taught by …", ["exactly one sentence", "is taught by", "a subject word"]],
  ["Write one active sentence, then the same idea in the passive.", "My dad built … / … was built by my dad.", ["exactly two sentences", "the same tense in both", "by"]],
  ["Write one passive sentence about something that is made or grown by people in your region.", "… are grown by …", ["exactly one sentence", "is or are + past participle + by", "a place word"]],
  ["Write two passive sentences with by: one in the present and one in the past.", "… is … by … / … was … by …", ["exactly two sentences", "is or are + by", "was or were + by"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your home: who built it, who painted it and who cleans it.", "It was built by … / It is cleaned by …", ["was + past participle + by", "is + past participle + by", "three or four sentences"]],
  ["Describe a family celebration: what was made or cooked, and by whom?", "The plov was cooked by … / The cake was made by …", ["was + by twice", "a food word", "three or four sentences"]],
  ["Describe your favourite book, film or song: who wrote or made it, and who it is loved by.", "It was written by …", ["was written by or was made by", "is + past participle + by", "three or four sentences"]],
  ["Describe your school: who teaches which subjects and who looks after the building.", "English is taught by …", ["is taught by", "are + past participle + by", "three or four sentences"]],
  ["Describe a famous place in your country: who built it and who visits it now.", "It was built by … / It is visited by …", ["was built by", "is visited by", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/passive-causative.simple-passive.active-to-passive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);