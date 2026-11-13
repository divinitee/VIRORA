// Hand-authored: sentence-structure / conjunctions / and-but-or (A1).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement foci: "and for addition" (I like tea ______ coffee) and "but for
// contrast" (She is young ______ she is very responsible); "or" for choices
// completes the set. The hard part for an author: "and" is grammatical almost
// everywhere ("The test was hard, and I passed it"), so it is NEVER offered as
// a distractor where it could be said. Each item was checked for the other two
// words (and so / because when offered):
//   and items: noun pairs, where "but tea" / "so tea" / "because tea" are
//     impossible; "or" is not offered (I like coffee or tea — heard).
//   but items: "but not …", "I'd love to, but I can't", "Sorry, but …",
//     where and / or / so are not defensible.
//   or items: exclusive choices (older or younger, inside or outside) and
//     "Hurry up, or …"; "and" only offered where both can't be true.
// Build: write and, but or or (closed class, choices in the instruction).
// Transform: join two sentences; the key is the conjunction + the new words.
//
// Run: node tools/grammar-practice/authored/sentence-structure.conjunctions.and-but-or.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "conjunctions", topic: "and-but-or", level: "A1", pv: "2.5" };

const AND = "Use and to add one more thing of the same kind.";
const BUT = "Use but for a contrast: the second part is different from what you expect.";
const OR = "Use or for a choice between two things (only one is true).";
const OA = ["and", "but", "because", "so"];
const OB = ["but", "or", "because", "so"];
const OO = ["or", "but", "so", "because"];
const OO2 = ["or", "and", "but", "so"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [OA, AND, "I like {food} ______ {food2}.",
    { food: ["plov", "manti", "pizza", "soup"], food2: ["lagman", "samsa", "salad", "pasta"] }],
  [OA, AND, "My {rel} ______ I go to the same {place}.",
    { rel: ["sister", "brother", "cousin", "best friend"], place: ["school", "gym", "college", "club"] }],
  [OA, AND, "We need {thing} ______ {thing2} for the cake.",
    { thing: ["eggs", "milk", "sugar", "butter"], thing2: ["flour", "apples", "cream", "honey"] }],
  [OA, AND, "There's a {thing} ______ a {thing2} in my room.",
    { thing: ["bed", "desk", "chair", "sofa"], thing2: ["wardrobe", "lamp", "mirror", "TV"] }],
  [OA, AND, "Aziz speaks {lang} ______ {lang2}.",
    { lang: ["Uzbek", "Russian", "Tajik", "Kazakh"], lang2: ["English", "Korean", "German", "Turkish"] }],
  [OA, AND, "My favourite subjects are {subject} ______ {subject2}.",
    { subject: ["maths", "English", "history", "music"], subject2: ["art", "biology", "PE", "chemistry"] }],
  [OA, AND, "At the bazaar you can buy {food} ______ {food2}.",
    { food: ["melons", "apples", "grapes", "apricots"], food2: ["bread", "rice", "spices", "nuts"] }],
  [OB, BUT, "The test was {adj}, ______ I passed it {how}.",
    { adj: ["hard", "very difficult", "long", "really hard"], how: ["easily", "in the end", "with a good mark", "somehow"] }],
  [OB, BUT, "My {thing} is old, ______ it works {how}.",
    { thing: ["phone", "laptop", "car", "bike"], how: ["very well", "fine", "perfectly", "well"] }],
  [OB, BUT, "I'd like to come, ______ I can't. I'm {busy} {when}.",
    { busy: ["busy", "ill", "at work", "away"], when: ["tonight", "on Saturday", "this weekend", "tomorrow"] }],
  [OB, BUT, "Lola is only {age}, ______ she can {skill}.",
    { age: ["four", "five", "three", "six"], skill: ["read", "swim", "count to a hundred", "ride a bike"] }],
  [OB, BUT, "It was {weather}, ______ we went {where}.",
    { weather: ["raining", "cold", "snowing", "very windy"], where: ["to the beach", "for a walk", "outside", "to the park"] }],
  [OB, BUT, "My grandfather is {age}, ______ he still {act} every day.",
    { age: ["eighty", "ninety", "eighty-five", "seventy-nine"], act: ["works", "swims", "walks five kilometres", "drives"] }],
  [OB, BUT, "I studied a lot, ______ I {result} the {exam}.",
    { result: ["failed", "didn't pass"], exam: ["exam", "test", "driving test", "maths test"] }],
  [OO2, OR, "Is your brother older ______ younger than you, {name}?",
    { name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [OO, OR, "Do you want {drink} ______ {drink2}?",
    { drink: ["tea", "coffee", "juice", "water"], drink2: ["milk", "lemonade", "cola", "ayran"] }],
  [OO, OR, "We can go by {transport} ______ on foot. What do you think?",
    { transport: ["bus", "taxi", "metro", "car"] }],
  [OO, OR, "Is the {event} on {day} ______ {day2}?",
    { event: ["test", "party", "match", "meeting"], day: ["Monday", "Tuesday", "Wednesday"], day2: ["Thursday", "Friday", "Saturday"] }],
  [OO2, OR, "Hurry up, ______ we'll miss the {transport}!",
    { transport: ["bus", "train", "film", "start"] }],
  [OO, OR, "I don't drink {drink} ______ {drink2}.",
    { drink: ["coffee", "cola", "energy drinks", "black tea"], drink2: ["fizzy drinks", "lemonade", "strong tea", "milk"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write and, but or or.";
const BUILD = [
  ["and", AND, "I have a {thing} ______ a {thing2} in my bag.",
    { thing: ["pen", "ruler", "phone", "book"], thing2: ["notebook", "bottle of water", "sandwich", "map"] }],
  ["and", AND, "We visited {city} ______ {city2} last summer.",
    { city: ["Samarkand", "Bukhara", "Fergana", "Termez"], city2: ["Khiva", "Tashkent", "Nukus", "Kokand"] }],
  ["and", AND, "{name} ______ {name2} are best friends.",
    { name: ["Bobur", "Aziz", "Timur", "Jasur"], name2: ["Sardor", "Rustam", "Anvar", "Bekzod"] }],
  ["and", AND, "Our flat has {num} bedrooms ______ a {room}.",
    { num: ["two", "three", "four"], room: ["kitchen", "balcony", "living room", "hall"] }],
  ["and", AND, "My {rel} ______ I are going to the {place} today.",
    { rel: ["brother", "sister", "cousin", "friend"], place: ["cinema", "park", "stadium", "bazaar"] }],
  ["and", AND, "I'm {age} years old ______ I live in {city}.",
    { age: ["fifteen", "eighteen", "twenty", "sixteen"], city: ["Tashkent", "Samarkand", "Namangan", "Karshi"] }],
  ["and", AND, "We sang songs ______ danced all {time} at the {event}.",
    { time: ["night", "evening", "day", "afternoon"], event: ["wedding", "party", "festival", "concert"] }],
  ["but", BUT, "I like {animal}, ______ not {animal2}.",
    { animal: ["cats", "horses", "birds", "rabbits"], animal2: ["dogs", "snakes", "spiders", "mice"] }],
  ["but", BUT, "I'd love to come, ______ I'm {busy} {when}.",
    { busy: ["busy", "ill", "at work", "away"], when: ["tonight", "on Saturday", "this weekend", "tomorrow"] }],
  ["but", BUT, "I'm sorry, {name}, ______ I can't help you {when}.",
    { name: ["Aziza", "Bekzod", "Olga", "Sardor"], when: ["today", "now", "with this", "this time"] }],
  ["but", BUT, "Thank you, {name}, ______ I don't need a {thing}.",
    { name: ["Madam", "Sir", "Aziz", "Lola"], thing: ["bag", "receipt", "spoon", "menu"] }],
  ["but", BUT, "She speaks {lang}, ______ not {lang2}.",
    { lang: ["English", "Russian", "Korean", "Turkish"], lang2: ["German", "Chinese", "French", "Arabic"] }],
  ["but", BUT, "You can use my {thing}, ______ not my {thing2}.",
    { thing: ["pen", "ruler", "dictionary", "pencils"], thing2: ["phone", "laptop", "headphones", "camera"] }],
  ["but", BUT, "I'd like to help, {name}, ______ I don't know how to {act}.",
    { name: ["Dad", "Mum", "Aziz", "Olga"], act: ["fix it", "use it", "do that", "cook plov"] }],
  ["or", OR, "Is your sister older ______ younger than you, {name}?",
    { name: ["Malika", "Rustam", "Nodira", "Jasur"] }],
  ["or", OR, "Do you want to sit inside ______ outside, {name}?",
    { name: ["Grandma", "Aziz", "Olga", "Timur"] }],
  ["or", OR, "Are you coming with us ______ staying at home {when}, {name}?",
    { when: ["tonight", "today", "on Saturday", "this weekend"], name: ["Lola", "Bobur", "Kamila", "Anvar"] }],
  ["or", OR, "Hurry up, ______ you'll be late for {event}, {name}!",
    { event: ["school", "the bus", "class", "the film"], name: ["Aziz", "Lola", "Sardor", "Malika"] }],
  ["or", OR, "Is the {shop} open ______ closed now, {name}?",
    { shop: ["shop", "bank", "pharmacy", "café"], name: ["Dad", "Aziz", "Olga", "Mum"] }],
  ["or", OR, "Should I take the {transport} ______ walk, {name}?",
    { transport: ["bus", "metro", "taxi", "tram"], name: ["Dad", "Mum", "Aziz", "Olga"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN_AND = "Join the two sentences into one with and. Use the word in brackets.";
const JOIN_BUT = "Join the two sentences into one with but. Use the word in brackets.";
const JOIN_OR = "Join the two questions or sentences into one with or. Use the word in brackets.";
const TRANSFORM = [
  // and (5)
  [JOIN_AND, "Aziz plays {sport} {when}. Bobur plays {sport} {when} too.", "Aziz ______ (Bobur) play {sport} {when}.", "and Bobur",
    "Two people do the same thing, so join them with and: Aziz and Bobur play…", [],
    { sport: ["football", "chess", "tennis", "volleyball"], when: ["on Sundays", "after school", "every day", "at weekends"] }],
  [JOIN_AND, "I bought {food} at the {shop}. I bought bread too.", "I bought {food} ______ (bread) at the {shop}.", "and bread",
    "Add one more thing with and: … and bread.", [],
    { food: ["milk", "eggs", "apples", "rice"], shop: ["market", "shop", "bazaar", "supermarket"] }],
  [JOIN_AND, "We visited {city} {when}. We visited Khiva too.", "We visited {city} ______ (Khiva) {when}.", "and Khiva",
    "Add one more place with and: … and Khiva.", [],
    { city: ["Samarkand", "Bukhara", "Tashkent", "Nukus"], when: ["last summer", "in May", "last year", "in spring"] }],
  [JOIN_AND, "Lola can sing {how} at {event}. She can dance there too.", "Lola can sing ______ (dance) {how} at {event}.", "and dance",
    "Add one more action with and: sing and dance.", [],
    { event: ["weddings", "parties", "school concerts", "festivals"], how: ["beautifully", "very well", "really well", "well"] }],
  [JOIN_AND, "My {room} has {thing}. It has a lamp too.", "My {room} has {thing} ______ (lamp).", "and a lamp",
    "Add one more thing with and: … and a lamp.", [],
    { thing: ["a bed", "a desk", "a sofa", "a table"], room: ["room", "bedroom", "office", "study"] }],
  // but (5)
  [JOIN_BUT, "I like {food}. I don't like fish.", "I like {food}, ______ (fish).", "but not fish",
    "The second part is a contrast, so use but: … but not fish.", ["but i don't like fish", "but i do not like fish"],
    { food: ["meat", "chicken", "plov", "eggs"] }],
  [JOIN_BUT, "Olga speaks {lang} {how}. She doesn't speak Chinese.", "Olga speaks {lang} {how}, ______ (Chinese).", "but not Chinese",
    "A contrast: use but: … but not Chinese.", ["but she doesn't speak chinese", "but she does not speak chinese"],
    { lang: ["English", "Russian", "Korean", "Turkish"], how: ["well", "a little", "very well", "at home"] }],
  [JOIN_BUT, "We have {fruit} {when}. We don't have bananas.", "We have {fruit} {when}, ______ (bananas).", "but no bananas",
    "A contrast: use but: … but no bananas.", ["but not bananas", "but we don't have bananas", "but we do not have bananas"],
    { fruit: ["apples", "melons", "grapes", "pears"], when: ["today", "now", "this week", "at the moment"] }],
  [JOIN_BUT, "My brother can {skill}. He can't swim.", "My brother can {skill}, ______ (swim).", "but he can't swim",
    "A contrast: use but: … but he can't swim.", ["but not swim"],
    { skill: ["drive", "ride a horse", "play football", "run fast"] }],
  [JOIN_BUT, "Aziz wanted to go to the {event} {when}. He was ill.", "Aziz wanted to go to the {event} {when}, ______ (ill).", "but he was ill",
    "What happened is different from what he wanted, so use but: … but he was ill.", [],
    { event: ["party", "match", "concert", "wedding"], when: ["on Saturday", "last night", "yesterday", "on Friday"] }],
  // or (5)
  [JOIN_OR, "Do you want {drink}? Do you want juice?", "Do you want {drink} ______ (juice), {name}?", "or juice",
    "A choice between two things: use or: … or juice?", [],
    { drink: ["tea", "water", "coffee", "milk"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [JOIN_OR, "Is the {event} on {day}? Is it on Friday?", "Is the {event} on {day} ______ (Friday)?", "or Friday",
    "Only one day is right, so use or: … or Friday?", ["or on friday"],
    { event: ["test", "party", "match", "trip"], day: ["Monday", "Tuesday", "Wednesday", "Thursday"] }],
  [JOIN_OR, "Are you coming by {transport}? Are you walking?", "Are you coming by {transport} ______ (walk), {name}?", "or walking",
    "A choice between two ways: use or: … or walking?", ["or are you walking"],
    { transport: ["bus", "taxi", "metro", "car"], name: ["Bobur", "Kamila", "Sardor", "Madina"] }],
  [JOIN_OR, "Shall we meet at {time}? Shall we meet at eight?", "Shall we meet at {time} ______ (eight), {name}?", "or eight",
    "A choice between two times: use or: … or eight?", ["or at eight"],
    { time: ["six", "seven", "five", "nine"], name: ["Aziza", "Bekzod", "Olga", "Anvar"] }],
  [JOIN_OR, "Hurry up! If you don't, you'll miss the {transport}.", "Hurry up, ______ (miss) the {transport}!", "or you'll miss",
    "Or after an order means 'if you don't': Hurry up, or you'll miss…", [],
    { transport: ["bus", "train", "start of the film", "plane"] }],
].map(([instr, source, hint, key, why, acceptable, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots, ...(acceptable.length ? { acceptable } : {}),
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about two foods you like.", "and between two things", ["exactly one sentence", "must use and", "must name two foods"]],
  ["Write one sentence about something you like and something you don't like.", "but for contrast", ["exactly one sentence", "must use but", "one positive part, one negative part"]],
  ["Write a question to offer a friend a choice of two drinks.", "or in a question", ["exactly one question", "must use or", "must name two drinks"]],
  ["Write one sentence about two languages you speak.", "and", ["exactly one sentence", "must use and", "must name two languages"]],
  ["Write one sentence: you want to go somewhere, but you can't.", "but", ["exactly one sentence", "must use but", "must say why you can't"]],
  ["Write a question asking if a test is on one day or another.", "or between two days", ["exactly one question", "must use or", "must name two days"]],
  ["Write one sentence about a family member: one thing they can do and one thing they can't do.", "can … but can't …", ["exactly one sentence", "must use but", "must use can and can't"]],
  ["Write two sentences about your weekend: one with and, one with but.", "and / but", ["exactly two sentences", "one with and, one with but", "no because or so"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe yourself: what you like, what you don't like, and what you can do. Write three or four sentences.",
    "and, but for addition and contrast", ["and to add", "but for a contrast", "full sentences"]],
  ["You are planning a party. Write a message to a friend with two choices for food and drinks.",
    "or for choices", ["or in a question", "and to list things", "two choices"]],
  ["Describe your city or village: what's good and what's not so good. Write three or four sentences.",
    "and / but", ["and to add good things", "but for a problem", "place names"]],
  ["Write about your last holiday: what you did and one thing that went wrong.",
    "and / but in the past", ["and between two actions", "but for the problem", "past verbs"]],
  ["Compare two people in your family. Write three or four sentences with and, but and or.",
    "and, but, or", ["and", "but", "or in a question or a choice"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.conjunctions.and-but-or.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
