// Hand-authored: pronouns / substitution / another-other (B1).
// Wave C, C18 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: another = one more / a different single one ("Can I try
// another?"), other + plural noun ("other people"), others standing alone
// ("Some walk; others take the bus").
// Learner errors: "other cup" (no article in Uzbek / Russian "другую чашку"),
// "others people" (Russian "другие люди" is plural, so the -s goes on),
// "another books", "an other".
// Sibling the-other-others (C20) keys "the other" / "the others" (the specific
// rest). This topic never keys them and never offers them, because in most
// of these frames they would also be English.
// Choose: 8 another / 7 other + plural / 5 others. Options another / other /
// others / an other (or the another); "others" is dropped where "Can you show
// me others?" would be right.
// Build: "Write another, other or others." 7 / 7 / 6; no sentence prints a
// second another / other / others.
// Transform: 5 correct the mistake / 5 one more → another / 5 different or
// more → other / others.
//
// Run: node tools/grammar-practice/authored/pronouns.substitution.another-other.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "substitution", topic: "another-other", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const DRINK = ["cup of tea", "glass of juice", "cup of coffee", "glass of water"];
const PLACE = ["school", "work", "home", "the club"];
const EVENT = ["party", "wedding", "meeting", "lesson"];
const DAY = ["Monday", "Tuesday", "Friday", "Saturday"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_AN = "One more, or a different single one: another (one word, an + other). Other can't stand before a singular noun on its own.";
const W_OT = "Before a plural noun, use other with no -s: other people, other colours. Another is only for one thing; others never goes before a noun.";
const W_OS = "No noun follows, so use others (= other people / other ones). Other needs a noun after it; another is only one.";
const OA = ["another", "other", "others", "an other"];
const OA2 = ["another", "other", "an other", "the another"];
const OO = ["other", "others", "another", "the another"];
const OS = ["others", "other", "another", "the another"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [OA, W_AN, "This {thing} is dirty. Can I have ______ one, please, {name}?", { thing: ["cup", "glass", "spoon", "plate"], name: NAME }],
  [OA, W_AN, "I'm still hungry. Can I have ______ {food}, {name}?", { food: ["samsa", "sandwich", "piece of cake", "apple"], name: NAME }],
  [OA, W_AN, "We'll stay in {city} for ______ two days.", { city: CITY }],
  [OA2, W_AN, "I don't like this {thing}. Can you show me ______, {name}?", { thing: ["jacket", "hat", "bag", "scarf"], name: NAME }],
  [OA, W_AN, "Would you like ______ {drink}, {name}?", { drink: DRINK, name: NAME }],
  [OA, W_AN, "He missed the bus, so he waited for ______ {bus}, {name}.", { bus: ["one", "bus", "taxi", "minibus"], name: NAME }],
  [OA, W_AN, "That's ______ good idea, {name}! Let's {act}.", { act: ["try it", "do it", "write it down", "tell Mum"], name: NAME }],
  [OA2, W_AN, "My phone broke, so I had to buy ______ {when}.", { when: PAST }],
  [OO, W_OT, "Some people like tea, but ______ people prefer coffee, {name}.", { name: NAME }],
  [OO, W_OT, "Do you have this {thing} in any ______ colours, {name}?", { thing: ["shirt", "dress", "bag", "jacket"], name: NAME }],
  [OO, W_OT, "We visited {city} and some ______ cities on our trip.", { city: CITY }],
  [OO, W_OT, "Are there any ______ questions before we {act}, {name}?", { act: ["start", "finish", "go", "stop"], name: NAME }],
  [OO, W_OT, "She speaks {lang} and two ______ languages, {name}.", { lang: ["English", "Uzbek", "Russian", "Korean"], name: NAME }],
  [OO, W_OT, "I don't know any ______ students in this {group}, {name}.", { group: ["class", "group", "course", "school"], name: NAME }],
  [OO, W_OT, "Let's try ______ ways to learn {what}, {name}.", { what: ["new words", "grammar", "English", "spelling"], name: NAME }],
  [OS, W_OS, "Some of my friends like {sport}; ______ prefer chess.", { sport: ["football", "tennis", "boxing", "volleyball"] }],
  [OS, W_OS, "Be kind to ______ at {place}, {name}.", { place: PLACE, name: NAME }],
  [OS, W_OS, "Some guests are always early for the {event}, and ______ are always late.", { event: ["party", "wedding", "dinner", "concert"] }],
  [OS, W_OS, "I've read this book. Do you have any ______ by the same {who}, {name}?", { who: ["writer", "author", "poet", "novelist"], name: NAME }],
  [OS, W_OS, "Some {who} speak Russian at home; ______ speak Uzbek.", { who: ["families", "students", "children", "neighbours"] }],
].map(([opts, why, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write another, other or others.";
const BUILD = [
  ["another", W_AN, "I need ______ {thing}. This one doesn't work, {name}.", { thing: ["pen", "pencil", "marker", "charger"], name: NAME }],
  ["another", W_AN, "Can we meet ______ day, {name}? I'm busy on {day}.", { name: NAME, day: DAY }],
  ["another", W_AN, "Let's watch ______ film {when}, {name}.", { when: ["tonight", "tomorrow", "after dinner", "at the weekend"], name: NAME }],
  ["another", W_AN, "There's ______ {bus} in ten minutes, {name}.", { bus: ["bus", "train", "tram", "minibus"], name: NAME }],
  ["another", W_AN, "I'd like ______ {drink}, please, {name}.", { drink: DRINK, name: NAME }],
  ["another", W_AN, "She has ______ exam on {day}, {name}.", { day: DAY, name: NAME }],
  ["another", W_AN, "Please give him ______ chance, {name}. He's only {age}.", { name: NAME, age: ["six", "seven", "eight", "ten"] }],
  ["other", W_OT, "I like {sport} and ______ sports too, {name}.", { sport: ["football", "tennis", "chess", "swimming"], name: NAME }],
  ["other", W_OT, "Are there any ______ ideas for the {event}, {name}?", { event: EVENT, name: NAME }],
  ["other", W_OT, "We met people from many ______ countries in {city}.", { city: CITY }],
  ["other", W_OT, "Do you know any ______ songs by this {who}, {name}?", { who: ["singer", "band", "group", "artist"], name: NAME }],
  ["other", W_OT, "There are some ______ ways to cook {food}.", { food: ["plov", "rice", "fish", "eggs"] }],
  ["other", W_OT, "I don't have any ______ plans for {when}, {name}.", { when: ["the weekend", "tonight", "Sunday", "the holiday"], name: NAME }],
  ["other", W_OT, "My brother and some ______ boys played {sport} {when}.", { sport: ["football", "basketball", "volleyball", "chess"], when: PAST }],
  ["others", W_OS, "Some children like {food}, but ______ don't, {name}.", { food: ["plov", "fish", "soup", "carrots"], name: NAME }],
  ["others", W_OS, "Some of the {thing} are new; ______ are very old.", { thing: ["books", "chairs", "desks", "bikes"] }],
  ["others", W_OS, "Don't worry about what ______ think about your {thing}, {name}.", { thing: ["hair", "clothes", "job", "car"], name: NAME }],
  ["others", W_OS, "Help ______ at {place} when you can, {name}.", { place: PLACE, name: NAME }],
  ["others", W_OS, "Some shops open at eight, and ______ open at {h}.", { h: ["nine", "ten", "eleven", "noon"] }],
  ["others", W_OS, "This {thing} is too small. Do you have any ______, {name}?", { thing: ["shirt", "jacket", "box", "bag"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const ONE = "Rewrite with another.";
const OTH = "Rewrite with other or others.";
const TRANSFORM = [
  // correct (5)
  [COR, "Can I have other {drink}, {name}?", "Can I have ______ {drink}, {name}?", "another", W_AN, { drink: DRINK, name: NAME }],
  [COR, "Others people think the {plan} is a good idea, {name}.", "______ people think the {plan} is a good idea, {name}.", "Other", W_OT, { plan: ["trip", "party", "plan", "project"], name: NAME }],
  [COR, "I want to read another books by this {who}, {name}.", "I want to read ______ books by this {who}, {name}.", "other", W_OT, { who: ["writer", "author", "poet", "novelist"], name: NAME }],
  [COR, "Let's try an other way to {do}, {name}.", "Let's try ______ way to {do}, {name}.", "another", W_AN, { do: ["get there", "cook it", "fix it", "learn this"], name: NAME }],
  [COR, "Some people walk to {place}; other take the bus, {name}.", "Some people walk to {place}; ______ take the bus, {name}.", "others", W_OS, { place: ["work", "school", "the bazaar", "college"], name: NAME }],
  // one more -> another (5)
  [ONE, "Can I have one more {food}, {name}?", "Can I have ______ {food}, {name}?", "another", W_AN, { food: ["samsa", "apple", "sandwich", "biscuit"], name: NAME }],
  [ONE, "I need one more day to finish the {work}, {name}.", "I need ______ day to finish the {work}, {name}.", "another", W_AN, { work: ["project", "essay", "report", "painting"], name: NAME }],
  [ONE, "Let's wait for one more {time}, {name}.", "Let's wait for ______ {time}, {name}.", "another", W_AN, { time: ["minute", "hour", "day", "week"], name: NAME }],
  [ONE, "There's one more {thing} in the fridge, {name}.", "There's ______ {thing} in the fridge, {name}.", "another", W_AN, { thing: ["egg", "apple", "bottle of milk", "yogurt"], name: NAME }],
  [ONE, "We'll stay for two more days in {city}.", "We'll stay for ______ two days in {city}.", "another", W_AN, { city: CITY }],
  // different / more -> other / others (5)
  [OTH, "Do you have this {thing} in any different colours, {name}?", "Do you have this {thing} in any ______ colours, {name}?", "other", W_OT, { thing: ["shirt", "dress", "bag", "jacket"], name: NAME }],
  [OTH, "Some students like grammar. Some students like {skill} more, {name}.", "Some students like grammar; ______ like {skill} more, {name}.", "others", W_OS, { skill: ["speaking", "reading", "writing", "listening"], name: NAME }],
  [OTH, "Ask different people about the {thing}, not only me, {name}.", "Ask ______ people about the {thing}, not only me, {name}.", "other", W_OT, { thing: ["trip", "hotel", "school", "job"], name: NAME }],
  [OTH, "Some days are hot, and some days are cold in {month}.", "Some days are hot, and ______ are cold in {month}.", "others", W_OS, { month: ["March", "April", "October", "November"] }],
  [OTH, "Are there any more questions about the {topic}, {name}?", "Are there any ______ questions about the {topic}, {name}?", "other", W_OT, { topic: ["homework", "test", "trip", "lesson"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence asking for one more of something at a café.", "Can I have another …, please?", ["exactly one sentence", "another + singular noun", "a polite question"]],
  ["Write one sentence about the languages you speak.", "I speak … and two other languages.", ["exactly one sentence", "other + plural noun", "no others before the noun"]],
  ["Write one sentence about what different people in your family like.", "Some of us like …; others …", ["exactly one sentence", "others with no noun", "some … others"]],
  ["Write one sentence about a plan you had to change to another day.", "We moved it to another day because …", ["exactly one sentence", "another day", "a past verb"]],
  ["Write one sentence asking a shop assistant for different colours.", "Do you have this in any other colours?", ["exactly one sentence", "other + plural noun", "a question"]],
  ["Write one sentence about helping people.", "I like helping others because …", ["exactly one sentence", "others alone", "no others people"]],
  ["Write one sentence about a film you want to see after this one.", "After this, I want to watch another …", ["exactly one sentence", "another", "no an other"]],
  ["Write two sentences: one with another and one with other + a plural noun.", "Can I have another …? / There are other …", ["exactly two sentences", "another + singular", "other + plural"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe the students in your class: what some like and what others like.", "Some students … Others … There are other …", ["others alone", "other + plural", "three or four sentences"]],
  ["Write a short dialogue in a shop where you ask for a different item.", "I don't like this one. Can I see another? Do you have other …?", ["another", "other + plural", "three or four lines"]],
  ["Describe a trip where you visited more than one place.", "We visited … and some other towns. Another day we …", ["another + day", "other + plural", "three or four sentences"]],
  ["Give advice about living with other people.", "Think about others. Don't use other people's …", ["others", "other + noun", "three or four sentences"]],
  ["Write about a bad day when you needed another chance.", "I failed … I asked for another chance … Other students …", ["another", "other + plural", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.substitution.another-other.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);