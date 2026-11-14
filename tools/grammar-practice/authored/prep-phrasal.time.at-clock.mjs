// Hand-authored: prep-phrasal / time / at-clock (A1).
// Path fill P7 (2026-11-14, Base44 AI, branch grammar-path-fill-2-base44).
//
// Placement focus: at with clock times ("I get up at 7 o'clock").
// Sibling scope (P7-P11): every key here is AT + a CLOCK TIME (o'clock,
// half past, a quarter to, 6:30, 9 a.m., noon, midnight). No days (on-days,
// P8), no months (in-months, P9), no "at night" (P10), and no mixed in/on/at
// sentences (in-on-at-contrast, P11). One time marker per sentence: the clock
// time is the only one, so no "every day", "on Mondays" or "after lunch" next
// to it. The clock time is never slotted.
// Distractors: in and on (Russian "в семь", Uzbek "soat yettida" -> in / on)
// and since (Russian "с семи"), with present or past simple only, so since is
// never right. Never by / before / after / until / from / around / for, which
// can all be correct with a clock time.
// Build: "Write at, in or on." (closed class, choice in instr). Sources and
// transform targets carry no other "at", so the typed key is never printed.
// Transform: 5 correct in / on -> at / 5 answer a What time ...? question with
// the time given / 5 join "It is 6:30." into the sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.time.at-clock.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "time", topic: "at-clock", level: "A1", pv: "2.5" };

const OPTS = ["at", "in", "on", "since"];
const W = (t) => `${t} is a clock time, so use at: at ${t}. In and on are not used before a clock time.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["6:30", "{name} gets up ______ 6:30 and has {food} for breakfast.",
    { name: ["Aziz", "Lola", "Timur", "Madina"], food: ["bread and tea", "eggs", "porridge", "bread and honey"] }],
  ["nine o'clock", "Our {subject} lesson starts ______ nine o'clock, {name}.",
    { subject: ["English", "maths", "history", "music"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["half past seven", "The {bus} to {city} leaves ______ half past seven.",
    { bus: ["bus", "train", "minibus", "plane"], city: ["Samarkand", "Bukhara", "Namangan", "Nukus"] }],
  ["6 p.m.", "My {who} comes home ______ 6 p.m., and then we have {meal}.",
    { who: ["dad", "mum", "uncle", "older brother"], meal: ["dinner", "plov", "tea", "soup"] }],
  ["four o'clock", "Can we meet ______ four o'clock near the {place}, {name}?",
    { place: ["park", "school gate", "bus stop", "library"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["8 a.m.", "{name}, the {shop} near our home opens ______ 8 a.m.",
    { name: ["Mum", "Dad", "Grandma", "Aziz"], shop: ["bakery", "market", "small shop", "pharmacy"] }],
  ["five o'clock", "I do my {task} ______ five o'clock, {name}.",
    { task: ["homework", "English homework", "reading", "maths"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  ["a quarter past eight", "The {show} starts ______ a quarter past eight. Don't be late, {name}!",
    { show: ["film", "football match", "concert", "school play"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["ten o'clock", "Grandma drinks a cup of {drink} ______ ten o'clock, {name}.",
    { drink: ["tea", "green tea", "milk", "hot milk"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["7:15", "{name}'s football practice finishes ______ 7:15. {who} picks him up.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], who: ["His dad", "His mum", "His uncle", "His brother"] }],
  ["one o'clock", "{who} have lunch ______ one o'clock in the school {place}.",
    { who: ["We", "The students", "The teachers", "My classmates"], place: ["canteen", "dining room", "hall", "cafe"] }],
  ["ten past nine", "The {test} begins ______ ten past nine. Please bring a {thing}.",
    { test: ["test", "exam", "quiz", "maths test"], thing: ["pen", "pencil", "ruler", "calculator"] }],
  ["six o'clock", "My {thing} rings ______ six o'clock. I hate it, {name}!",
    { thing: ["alarm", "phone", "alarm clock", "old clock"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["11:30", "The doctor can see you ______ 11:30, {name}. Please bring your {doc}.",
    { name: ["Mr Karimov", "Mrs Rahimova", "Olga", "Aziz"], doc: ["passport", "card", "papers", "ID card"] }],
  ["eight o'clock", "{name} calls her grandparents in {city} ______ eight o'clock.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], city: ["Khiva", "Termez", "Kazan", "Fergana"] }],
  ["9 p.m.", "The {place} closes ______ 9 p.m. Hurry up, {name}!",
    { place: ["swimming pool", "library", "museum", "shop"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["half past five", "Our guests arrive ______ half past five. Can you make {food}, {name}?",
    { food: ["some tea", "a salad", "plov", "some soup"], name: ["Mum", "Aziz", "Olga", "Grandma"] }],
  ["midnight", "{name} wants to watch the big match ______ midnight with {who}.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], who: ["his dad", "his friends", "his brother", "his uncle"] }],
  ["noon", "{name}, the {place} is very busy ______ noon.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], place: ["market", "bazaar", "canteen", "bus station"] }],
  ["4:45", "What time is your {thing}, {name}? It is ______ 4:45.",
    { thing: ["lesson", "train", "appointment", "music class"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([t, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS, key: 0, why: W(t), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write at, in or on.";
const BW = (t) => `${t} is a clock time, so use at.`;
const BUILD = [
  ["7:15", "{name} wakes up ______ 7:15 and has a glass of {drink}.",
    { name: ["Aziz", "Lola", "Timur", "Madina"], drink: ["water", "milk", "juice", "warm water"] }],
  ["twelve o'clock", "My {subject} class finishes ______ twelve o'clock, {name}.",
    { subject: ["English", "maths", "art", "music"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  ["ten past eight", "The bus to {place} comes ______ ten past eight. Don't be late, {name}.",
    { place: ["the city centre", "the airport", "the village", "our school"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["seven o'clock", "Our family has dinner ______ seven o'clock in the {room}, {name}.",
    { room: ["kitchen", "living room", "yard", "garden"], name: ["Aziz", "Olga", "Mum", "Grandpa"] }],
  ["10 p.m.", "The {shop} on {street} closes ______ 10 p.m.",
    { shop: ["bakery", "pharmacy", "fruit shop", "cafe"], street: ["our street", "Navoi Street", "the corner", "the main road"] }],
  ["half past three", "Let's meet ______ half past three in front of the {place}, {name}.",
    { place: ["school", "library", "park", "cinema"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["ten o'clock", "{name} goes to bed ______ ten o'clock. She reads a {book} first.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], book: ["book", "story", "comic", "magazine"] }],
  ["6:40", "The {train} for {city} leaves ______ 6:40.",
    { train: ["train", "bus", "minibus", "fast train"], city: ["Samarkand", "Bukhara", "Andijan", "Karshi"] }],
  ["five o'clock", "I phone my {who} ______ five o'clock, {name}.",
    { who: ["grandma", "aunt", "mother", "sister"], name: ["Dad", "Aziz", "Olga", "Timur"] }],
  ["9 a.m.", "The {place} opens ______ 9 a.m. Tickets are {price}.",
    { place: ["museum", "zoo", "swimming pool", "art gallery"], price: ["cheap", "not expensive", "free for children", "half price for students"] }],
  ["2:30", "Your {thing} is ______ 2:30, {name}.",
    { thing: ["lesson", "interview", "piano lesson", "dentist appointment"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["eight o'clock", "The {event} starts ______ eight o'clock. Bring your {who}.",
    { event: ["concert", "school show", "meeting", "party"], who: ["parents", "friends", "brother", "sister"] }],
  ["7:20", "{who} leave the house ______ 7:20 to catch the {bus}.",
    { who: ["We", "My sister and I", "The children", "Aziz and I"], bus: ["school bus", "metro", "number 3 bus", "train"] }],
  ["four o'clock", "{who} takes the bread out of the {oven} ______ four o'clock.",
    { who: ["Mum", "Grandma", "My aunt", "Our neighbour"], oven: ["oven", "tandoor", "big oven", "clay oven"] }],
  ["6 p.m.", "{name}'s English lesson begins ______ 6 p.m. She uses her {device}.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], device: ["phone", "laptop", "computer", "tablet"] }],
  ["three o'clock", "The football {thing} is ______ three o'clock. Come and watch, {name}!",
    { thing: ["match", "game", "final", "practice"], name: ["Aziz", "Olga", "Mum", "Dad"] }],
  ["six o'clock", "{who} feeds the {animal} ______ six o'clock.",
    { who: ["Grandpa", "My uncle", "Grandma", "Our neighbour"], animal: ["chickens", "sheep", "cows", "goats"] }],
  ["11 a.m.", "The {who} will call you ______ 11 a.m., {name}.",
    { who: ["doctor", "teacher", "manager", "nurse"], name: ["Aziz", "Olga", "Mr Karimov", "Mrs Rahimova"] }],
  ["a quarter to two", "Our {lesson} ends ______ a quarter to two. Then we go to {place}.",
    { lesson: ["last lesson", "maths lesson", "class", "English class"], place: ["the canteen", "the park", "our club", "the library"] }],
  ["9:30", "The {show} on TV is ______ 9:30. {name} wants to watch it.",
    { show: ["football match", "film", "cartoon", "music show"], name: ["Aziz", "Olga", "Grandpa", "Lola"] }],
].map(([t, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "at", why: BW(t), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const ANS = (t) => `Answer the question. The time is ${t}.`;
const JOIN = "Join the two sentences.";
const TRANSFORM = [
  // correct in / on / since -> at (5)
  [COR, "{name} starts work in 8 o'clock in the {place}.", "{name} starts work ______ 8 o'clock in the {place}.",
    "8 o'clock is a clock time, so use at, not in.", { name: ["My dad", "Aunt Lola", "Mr Karimov", "My sister"], place: ["bank", "shop", "hospital", "office"] }],
  [COR, "The {lesson} begins on half past nine, {name}.", "The {lesson} begins ______ half past nine, {name}.",
    "Half past nine is a clock time, so use at, not on.", { lesson: ["lesson", "English lesson", "maths class", "test"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "We have breakfast in seven o'clock in the {room}, {name}.", "We have breakfast ______ seven o'clock in the {room}, {name}.",
    "Seven o'clock is a clock time, so use at, not in.", { room: ["kitchen", "yard", "living room", "garden"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  [COR, "The {shop} opens since 10 a.m., {name}.", "The {shop} opens ______ 10 a.m., {name}.",
    "10 a.m. is the time it opens, a clock time, so use at, not since.", { shop: ["bakery", "bank", "pharmacy", "post office"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [COR, "My {who} comes home on 5 p.m. and makes {food}.", "My {who} comes home ______ 5 p.m. and makes {food}.",
    "5 p.m. is a clock time, so use at, not on.", { who: ["mum", "aunt", "sister", "grandmother"], food: ["dinner", "tea", "soup", "plov"] }],
  // answer a What time ...? question (5)
  [ANS("9 o'clock"), "{name}, what time does the {thing} start?", "It starts ______ 9 o'clock.",
    "For a clock time we say at: at 9 o'clock.", { name: ["Aziz", "Olga", "Mum", "Dad"], thing: ["film", "lesson", "concert", "match"] }],
  [ANS("6:45"), "What time do you get up, {name}?", "I get up ______ 6:45 for {thing}.",
    "6:45 is a clock time, so the answer uses at.", { name: ["Aziz", "Olga", "Timur", "Lola"], thing: ["school", "work", "the bus", "my run"] }],
  [ANS("half past four"), "What time does the {bus} to {city} leave?", "It leaves ______ half past four.",
    "Half past four is a clock time, so the answer uses at.", { bus: ["bus", "train", "minibus", "plane"], city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"] }],
  [ANS("two o'clock"), "What time does {name} finish {thing}?", "She finishes ______ two o'clock.",
    "Two o'clock is a clock time, so the answer uses at.", { name: ["Lola", "Madina", "Olga", "Kamila"], thing: ["school", "work", "her lessons", "college"] }],
  [ANS("8 p.m"), "What time do your {who} have {meal}?", "They have {meal} ______ 8 p.m.",
    "8 p.m. is a clock time, so the answer uses at.", { who: ["parents", "grandparents", "cousins", "neighbours"], meal: ["dinner", "supper", "tea", "plov"] }],
  // join "It is ..." into the sentence (5)
  [JOIN, "The {test} begins in Room {n}. It is ten o'clock.", "The {test} begins in Room {n} ______ ten o'clock.",
    "Say the clock time with at: at ten o'clock.", { test: ["test", "exam", "quiz", "lesson"], n: ["5", "12", "21", "3"] }],
  [JOIN, "{name} goes to bed with a {thing}. It is half past ten.", "{name} goes to bed with a {thing} ______ half past ten.",
    "Say the clock time with at: at half past ten.", { name: ["Aziz", "Grandpa", "My brother", "Lola"], thing: ["book", "cup of tea", "glass of milk", "story book"] }],
  [JOIN, "We leave for the {place}, {name}. It is 7:30.", "We leave for the {place} ______ 7:30, {name}.",
    "Say the clock time with at: at 7:30.", { place: ["airport", "station", "village", "mountains"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [JOIN, "{who} feeds the {animal}. It is six o'clock.", "{who} feeds the {animal} ______ six o'clock.",
    "Say the clock time with at: at six o'clock.", { who: ["Grandma", "Grandpa", "My uncle", "My cousin"], animal: ["chickens", "cat", "sheep", "dog"] }],
  [JOIN, "The {who} closes the {thing}. It is a quarter to eight.", "The {who} closes the {thing} ______ a quarter to eight.",
    "Say the clock time with at: at a quarter to eight.", { who: ["cleaner", "teacher", "caretaker", "school director"], thing: ["gate", "door", "main door", "windows"] }],
].map(([instr, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: "at", why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the time you get up on a school day or a work day.", "at + clock time", ["exactly one sentence", "must use at + a clock time", "about you"]],
  ["Write one sentence about the time your first lesson starts.", "at + clock time", ["exactly one sentence", "must use at", "a clock time like 8:30 or nine o'clock"]],
  ["Write one sentence about the time your family has dinner.", "at + clock time", ["exactly one sentence", "must use at", "about your family"]],
  ["Invite a friend to meet you. Say the place and the clock time.", "Let's meet at …", ["exactly one sentence", "must use at + a clock time", "a place in your town"]],
  ["Write one question to a friend about the time of something.", "What time …?", ["exactly one question", "must start with What time", "must end with a question mark"]],
  ["Answer this question about yourself: What time do you go to bed?", "I go to bed at …", ["exactly one sentence", "must use at", "a clock time"]],
  ["Write one sentence about a shop or market near your home and the time it opens or closes.", "opens / closes at …", ["exactly one sentence", "must use at + a clock time", "opens or closes"]],
  ["Write two sentences about your day: one thing in the morning and one in the evening, each with a clock time.", "at + clock time (×2)", ["exactly two sentences", "at in both sentences", "two different clock times"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a normal school day or work day for you, from morning to evening. Give the times.", "at + clock times", ["I get up at …", "at + four or five clock times", "starts / finishes / goes"]],
  ["A new student asks about your school timetable. Tell them when lessons start, have breaks and finish.", "at + clock times", ["starts at …", "finishes at …", "at + half past / o'clock"]],
  ["Write a message to a friend. Plan a trip to the park or the bazaar on Saturday and say what time you will meet.", "at + clock time", ["Let's meet at …", "a place", "a clock time"]],
  ["Tell a friend about your family's evening: when people come home, eat and go to bed.", "at + clock times", ["comes home at …", "have dinner at …", "goes to bed at …"]],
  ["Write about your weekend day. What time do you get up, eat and go out?", "at + clock times", ["at + clock times", "three or four sentences", "about you"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.time.at-clock.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);