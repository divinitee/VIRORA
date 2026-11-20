// Hand-authored: comparison / comparative / fewer-less (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): FEWER + countable plural (fewer people,
// fewer cars) and LESS + uncountable (less money, less time), in a comparison
// with than. About half each in every stage.
// Note for Tee: "less people" is common in everyday speech, but exams and
// textbooks mark it wrong; this topic teaches the textbook rule, as the
// placement item does.
// One right answer: every sentence has "than" (or "this year … last year"), so
// "little" is always wrong; "lesser" is always wrong. No "a few / a little"
// keys (A2 few-little owns them).
// Build: "Write fewer or less." Transform: 5 two numbers → fewer / less … than /
// 5 correct the mistake / 5 not as much / many … as → less / fewer … than.
//
// Run: node tools/grammar-practice/authored/comparison.comparative.fewer-less.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "comparative", topic: "fewer-less", level: "B1", pv: "2.5" };
const NAME = ["Gulnora", "Jamshid", "Malika", "Ulugbek"]; // listener names: never printed in a sentence (audit 20 Nov)
const WHY = {
  fewer: "The noun is plural and you can count it, so use fewer.",
  less: "The noun is uncountable (you can't count it), so use less.",
};
const OPT = { fewer: ["fewer", "less", "little", "lesser"], less: ["less", "fewer", "little", "lesser"] };

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["fewer", "There were ______ people at the {event} than last year, {name}.", { event: ["concert", "festival", "match", "fair"], name: NAME }],
  ["less", "I spend ______ money on {thing} than my {who}.", { thing: ["clothes", "food", "taxis", "games"], who: ["sister", "brother", "cousin", "friends"] }],
  ["fewer", "Our {place} has ______ trees than the park near the {place2}.", { place: ["street", "yard", "village", "school"], place2: ["river", "station", "bazaar", "museum"] }],
  ["less", "This {thing} uses ______ electricity than our old one, {name}.", { thing: ["fridge", "washing machine", "TV", "lamp"], name: NAME }],
  ["fewer", "My brother made ______ mistakes in the {test} than me, {name}.", { test: ["test", "exam", "dictation", "quiz"], name: NAME }],
  ["less", "We have ______ homework this {period} than last {period}, {name}.", { period: ["week", "month", "term"], name: NAME }],
  ["fewer", "There are ______ cars on the road on {day} than on weekdays, {name}.", { day: ["Sundays", "holidays", "Saturdays", "Navruz"], name: NAME }],
  ["less", "My {who} drinks ______ {drink} than he did last year.", { who: ["grandfather", "father", "uncle", "brother"], drink: ["coffee", "tea", "milk", "cola"] }],
  ["fewer", "{name} has ______ friends in {city} than in her old town.", { name: ["Madina", "Olga", "Sevara", "Nilufar"], city: ["Tashkent", "Moscow", "Seoul", "Bukhara"] }],
  ["less", "It takes ______ time by {transport} than by bus, {name}.", { transport: ["metro", "taxi", "car", "train"], name: NAME }],
  ["fewer", "This {thing} costs more, but it has ______ problems than the cheap one, {name}.", { thing: ["phone", "laptop", "car", "bike"], name: NAME }],
  ["less", "There was ______ snow this {season} than last {season}.", { season: ["winter", "year", "month"], x: [] }],
  ["fewer", "We sold ______ {goods} at the bazaar today than yesterday, {name}.", { goods: ["melons", "apples", "carpets", "shoes"], name: NAME }],
  ["less", "You should eat ______ sugar and more {food}, {name}.", { food: ["fruit", "vegetables", "fish", "salad"], name: NAME }],
  ["fewer", "There are ______ students in our {group} than in yours, {name}.", { group: ["group", "class", "team", "course"], name: NAME }],
  ["less", "My new job gives me ______ free time than my old {job}, {name}.", { job: ["job", "school", "course", "college"], name: NAME }],
  ["fewer", "Our team scored ______ goals this {season} than last {season}, {name}.", { season: ["season", "year", "month"], name: NAME }],
  ["less", "The {place} is quieter, {name}: there is ______ noise than in the centre.", { place: ["village", "new district", "park", "garden"], name: NAME }],
  ["fewer", "I got ______ messages {when}, {name}.", { when: ["today than yesterday", "this week than last week", "this month than last month", "this year than last year"], name: NAME }],
  ["less", "This {road} has ______ traffic than the main road, {name}.", { road: ["street", "road", "bridge", "route"], name: NAME }],
].map(([k, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const opts = OPT[k];
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: WHY[k], slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write fewer or less.";
const BUILD = [
  ["fewer", "There are ______ buses to {city} on Sundays, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Nukus"], name: NAME }],
  ["less", "I want to spend ______ time on my phone this {period}, {name}.", { period: ["week", "month", "year", "summer"], name: NAME }],
  ["fewer", "We need ______ chairs than we have, {name}. Only {n} guests are coming.", { n: ["six", "eight", "ten", "twelve"], name: NAME }],
  ["less", "Add ______ salt to the {food} next time, {name}. It's too salty.", { food: ["soup", "plov", "salad", "rice"], name: NAME }],
  ["fewer", "My {who2} works ______ hours than last year, so he can see his {who} more.", { who2: ["uncle", "father", "brother", "grandfather"], who: ["children", "family", "parents", "friends"] }],
  ["less", "Our new {home} gets ______ sun than the old one, {name}.", { home: ["flat", "house", "classroom", "office"], name: NAME }],
  ["fewer", "There were ______ tourists in {city} in {month} than in May.", { city: ["Samarkand", "Bukhara", "Khiva", "Shahrisabz"], month: ["January", "February", "December", "November"] }],
  ["less", "This {thing} makes ______ noise than the old one, {name}.", { thing: ["fan", "fridge", "car", "printer"], name: NAME }],
  ["fewer", "I read ______ books this {period} than last {period}, {name}.", { period: ["year", "month", "summer"], name: NAME }],
  ["less", "Please use ______ water in the {room}, {name}. We pay a lot.", { room: ["bathroom", "kitchen", "garden", "yard"], name: NAME }],
  ["fewer", "There are ______ shops in our village than in the {place}, {name}.", { place: ["town", "city", "centre", "next village"], name: NAME }],
  ["less", "Walking to {place} gives me ______ stress than driving, {name}.", { place: ["work", "school", "college", "the bazaar"], name: NAME }],
  ["fewer", "This {test} has ______ questions than the last one, {name}.", { test: ["test", "exam", "quiz", "worksheet"], name: NAME }],
  ["less", "We had ______ rain in {month} than in April, {name}.", { month: ["May", "June", "July", "August"], name: NAME }],
  ["fewer", "My little {sib} eats ______ vegetables than he should, {name}.", { sib: ["brother", "cousin", "nephew"], name: NAME }],
  ["less", "I have ______ energy in the {time} than in the morning, {name}.", { time: ["evening", "afternoon", "summer", "heat"], name: NAME }],
  ["fewer", "There are ______ birds in the city than in the {place}, {name}.", { place: ["mountains", "village", "forest", "countryside"], name: NAME }],
  ["less", "The new {device} needs ______ space on the desk, {name}.", { device: ["printer", "computer", "lamp", "speaker"], name: NAME }],
  ["fewer", "{name} wants to make ______ mistakes in her {subj} essays.", { name: ["Madina", "Olga", "Sevara", "Nilufar"], subj: ["English", "Russian", "history", "Uzbek"] }],
  ["less", "My {who} earns ______ money than before, but he is happier at his new {job}.", { who: ["father", "uncle", "brother", "grandfather"], job: ["job", "company", "school", "shop"] }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: WHY[key], slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NUM = "Compare the two numbers. Use fewer or less … than.";
const FIX = "Correct the mistake.";
const NOT = "Rewrite the sentence with fewer or less … than.";
// [instr, source, hint, key, slots]
const TRANSFORM = [
  [NUM, "Last year our {group} had 30 students. This year it has {n}.", "This year our {group} has ______ students than last year.", "fewer", { group: ["group", "class", "club", "team"], n: ["25", "22", "20", "18"] }],
  [NUM, "I slept eight hours on Monday and {n} hours on Tuesday, {name}.", "I slept for ______ on Tuesday than on Monday, {name}.", "fewer hours", { n: ["six", "five", "seven", "four"], name: NAME }],
  [NUM, "The old phone cost 3 million soum. The new one costs {n} million, {name}.", "The new phone costs ______ money than the old one, {name}.", "less", { n: ["2", "2.5", "1.5", "1"], name: NAME }],
  [NUM, "We had 40 guests at my sister's wedding and {n} at mine, {name}.", "We had ______ guests at my wedding than at my sister's, {name}.", "fewer", { n: ["30", "25", "35", "20"], name: NAME }],
  [NUM, "Our old car used 10 litres of petrol a day. The new one uses {n}.", "The new car uses ______ petrol than the old one, {name}.", "less", { n: ["6", "7", "5", "8"], name: NAME }],
  [FIX, "I have less friends in {city} than in my village, {name}.", "I have ______ friends in {city} than in my village, {name}.", "fewer", { city: ["Tashkent", "Moscow", "Seoul", "Bukhara"], name: NAME }],
  [FIX, "There is fewer traffic on {day} than on Monday, {name}.", "There is ______ traffic on {day} than on Monday, {name}.", "less", { day: ["Sunday", "Saturday", "Friday", "holidays"], name: NAME }],
  [FIX, "We bought lesser {goods} this week than last week, {name}.", "We bought ______ {goods} this week than last week, {name}.", "fewer", { goods: ["apples", "eggs", "melons", "tomatoes"], name: NAME }],
  [FIX, "My {who} drinks fewer coffee than before, {name}.", "My {who} drinks ______ coffee than before, {name}.", "less", { who: ["father", "mother", "uncle", "teacher"], name: NAME }],
  [FIX, "There were less mistakes in your {test} this time, {name}.", "There were ______ mistakes in your {test} this time, {name}.", "fewer", { test: ["test", "essay", "homework", "dictation"], name: NAME }],
  [NOT, "I don't watch as many films as my {who}, {name}.", "I watch ______ films than my {who}, {name}.", "fewer", { who: ["brother", "sister", "parents", "friends"], name: NAME }],
  [NOT, "Our {place} doesn't get as much rain as the mountains, {name}.", "Our {place} gets ______ rain than the mountains, {name}.", "less", { place: ["town", "village", "city", "valley"], name: NAME }],
  [NOT, "We don't have as much {thing} as last year, {name}.", "We have ______ {thing} than last year, {name}.", "less", { thing: ["money", "time", "free time", "work"], name: NAME }],
  [NOT, "This {shop} doesn't sell as many {goods} as the bazaar.", "This {shop} sells ______ {goods} than the bazaar.", "fewer", { shop: ["shop", "market", "kiosk", "store"], goods: ["melons", "spices", "shoes", "carpets"] }],
  [NOT, "My little sister doesn't eat as much {food} as me, {name}.", "My little sister eats ______ {food} than me, {name}.", "less", { food: ["bread", "rice", "meat", "fruit"], name: NAME }],
].map(([instr, source, hint, key, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  const w = key.startsWith("fewer") ? WHY.fewer : WHY.less;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence comparing how many friends you have now and before.", "fewer + plural noun", ["exactly one sentence", "fewer … than", "a plural noun"]],
  ["Write one sentence about something you want to spend less time on.", "less + uncountable noun", ["exactly one sentence", "less time / money", "than or a time word"]],
  ["Write one sentence comparing two towns or villages.", "fewer or less … than", ["exactly one sentence", "fewer or less", "than"]],
  ["Write one sentence about your diet: less of something.", "less + food noun", ["exactly one sentence", "less", "an uncountable food word"]],
  ["Write one sentence about a test with fewer mistakes than before.", "fewer mistakes", ["exactly one sentence", "fewer", "than"]],
  ["Write one sentence about traffic or noise where you live.", "less traffic / noise", ["exactly one sentence", "less", "than"]],
  ["Write one sentence with fewer people and one with less money.", "fewer vs less", ["exactly two sentences", "fewer + people", "less + money"]],
  ["Write one sentence comparing this year and last year at your school or job.", "fewer / less … than last year", ["exactly one sentence", "fewer or less", "than last year"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare your life now with your life five years ago. Write three or four sentences with fewer and less.", "fewer vs less", ["fewer + plural", "less + uncountable", "than"]],
  ["Compare a village and a city you know. Write three or four sentences.", "fewer / less … than", ["fewer", "less", "two places"]],
  ["Give a friend advice for a healthier week. Write three or four sentences.", "less + uncountable", ["less sugar / time / coffee", "fewer + plural", "should"]],
  ["Compare two phones, bikes or cars. Write three or four sentences.", "fewer problems / less money", ["fewer", "less", "than"]],
  ["Describe how your street has changed. Write three or four sentences.", "fewer cars / less noise", ["fewer", "less", "than before"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.comparative.fewer-less.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
