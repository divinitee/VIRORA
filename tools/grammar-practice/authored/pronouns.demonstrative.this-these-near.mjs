// Hand-authored: pronouns / demonstrative / this-these-near (A1).
// Path fill P4 (2026-11-14, Base44 AI, branch grammar-path-fill-base44).
//
// Placement focus: this for a single near object (______ is my phone here in
// my hand), these for plural near objects (______ books here are mine).
// Every sentence carries a strong "near" marker that is never slotted (in my
// hand, I'm wearing, here on my desk, on my plate, next to me, we are on), so
// that / those are wrong on distance, and the noun's number makes the other
// near form wrong. Choose options are always This / These / That / Those.
// Build: "Write this or these" (closed class, so the choice is in instr):
// distance is given, the learner chooses by number. Transform: 5 singular ->
// plural / 5 correct a number mistake / 5 move the thing from far to near.
// that / those are never the key (that-those-far is P5).
//
// Run: node tools/grammar-practice/authored/pronouns.demonstrative.this-these-near.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "demonstrative", topic: "this-these-near", level: "A1", pv: "2.5" };

const UP = { s: ["This", "These", "That", "Those"], p: ["These", "This", "Those", "That"] };
const LO = { s: ["this", "these", "that", "those"], p: ["these", "this", "those", "that"] };
const WS = (near) => `One thing, and it is near (${near}), so use this. These is for more than one; that and those are for things far away.`;
const WP = (near) => `More than one, and they are near (${near}), so use these. This is for one thing; that and those are for things far away.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [UP.s, WS("here in my hand"), "______ is my phone here in my hand. It's {adj}, but it works {how}.",
    { adj: ["old", "small", "cheap", "cracked"], how: ["well", "fine", "very well", "OK"] }],
  [UP.p, WP("here on my desk"), "______ books here on my desk are {adj}. I need them for {subject}.",
    { adj: ["new", "heavy", "from the library", "Aziz's"], subject: ["maths", "English", "history", "my exam"] }],
  [LO.p, WP("I'm wearing them"), "Look at ______ shoes I'm wearing. Mum bought them in {city} {when}.",
    { city: ["Tashkent", "Bukhara", "Samarkand", "Andijan"], when: ["last week", "yesterday", "for my birthday", "in the summer"] }],
  [LO.s, WS("on my plate"), "Mmm, ______ soup on my plate is {adj}, {name}!",
    { adj: ["delicious", "hot", "very good", "great"], name: ["Mum", "Grandma", "Dad", "Aunt Malika"] }],
  [UP.s, WS("next to me in the photo"), "______ is my friend {name}, next to me in the photo from {place}.",
    { name: ["Aziz", "Lola", "Timur", "Madina"], place: ["Samarkand", "the wedding", "school", "the park"] }],
  [LO.p, WP("I'm holding them"), "I'm holding ______ bags, and they are {adj}. Can you open the door, {name}?",
    { adj: ["heavy", "full", "very big", "wet"], name: ["Dad", "Aziz", "Olga", "Timur"] }],
  [UP.s, WS("next to me"), "______ chair next to me is free. Sit here, {name}, and have some {food}.",
    { name: ["Lola", "Grandpa", "Sardor", "Kamila"], food: ["tea", "bread", "fruit", "soup"] }],
  [UP.p, WP("in my basket"), "______ apples in my basket are from our {place}. Try one, {name}.",
    { place: ["garden", "village", "tree", "yard"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [UP.s, WS("I'm wearing it"), "______ jacket I'm wearing is {adj}. It was {price}.",
    { adj: ["warm", "new", "my brother's", "too big"], price: ["cheap", "a present", "on sale", "from the market"] }],
  [UP.p, WP("in my bag"), "______ pencils in my bag are {colour}. Do you need one, {name}?",
    { colour: ["blue", "red", "new", "sharp"], name: ["Bobur", "Kamila", "Sardor", "Madina"] }],
  [LO.s, WS("I'm listening to it now"), "I love ______ song I'm listening to now. It's {adj}, {name}.",
    { adj: ["so good", "beautiful", "very old", "new"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [UP.p, WP("here in the photo"), "______ are my cousins here in the photo, {name1} and {name2}.",
    { name1: ["Aziz", "Lola", "Bobur", "Madina"], name2: ["Kamila", "Sardor", "Nodira", "Jasur"] }],
  [UP.p, WP("here on the table"), "______ flowers here on the table are from the {place}. They're for {who}.",
    { place: ["market", "garden", "flower shop", "village"], who: ["Mum", "Grandma", "our teacher", "Aunt Lola"] }],
  [UP.s, WS("in my glass"), "{name}, ______ milk in my glass tastes {adj}.",
    { name: ["Mum", "Dad", "Grandma", "Aunt Dilnoza"], adj: ["strange", "sour", "funny", "bad"] }],
  [UP.s, WS("here, where we are standing"), "Welcome, {name}! ______ room here is mine, and it is {adj}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["small", "a bit messy", "quiet", "warm"] }],
  [LO.p, WP("here in the box"), "Wow, ______ cakes here in the box are {adj}! Did you make them, {name}?",
    { adj: ["beautiful", "so small", "lovely", "amazing"], name: ["Mum", "Grandma", "Aunt Malika", "Kamila"] }],
  [UP.p, WP("in my pocket"), "______ keys in my pocket open the {place} and the {place2}.",
    { place: ["front door", "gate", "garage", "shop"], place2: ["car", "back door", "office", "cupboard"] }],
  [UP.s, WS("here on my desk"), "______ homework here on my desk is for {day}. It's {adj}.",
    { day: ["Monday", "tomorrow", "Friday", "next week"], adj: ["easy", "long", "very hard", "short"] }],
  [LO.p, WP("in my hand"), "Try ______ grapes in my hand, {name}. They are very {adj}.",
    { name: ["Aziz", "Grandpa", "Olga", "Timur"], adj: ["sweet", "fresh", "big", "juicy"] }],
  [UP.s, WS("here, next to you"), "______ is my new bike here, {name}. Dad gave it to me {when}.",
    { name: ["Aziz", "Lola", "Timur", "Madina"], when: ["yesterday", "last week", "for my birthday", "in May"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "The things are near you. Write this or these.";
const BS = (n) => `${n} is one thing, so use this.`;
const BP = (n) => `${n} are more than one, so use these.`;
const BUILD = [
  ["This", BS("Bag"), "______ bag in my hand is very {adj}, {name}.",
    { adj: ["heavy", "old", "light", "full"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["These", BP("Photos"), "Look! ______ photos on my phone are from {place}, {name}.",
    { place: ["Samarkand", "the wedding", "our trip", "the mountains"], name: ["Mum", "Aziz", "Lola", "Dad"] }],
  ["This", BS("Tea"), "______ tea in my cup is {adj}. Can I have some {extra}?",
    { adj: ["cold", "too strong", "very hot", "not sweet"], extra: ["sugar", "milk", "lemon", "honey"] }],
  ["These", BP("Children"), "______ children here with me are in my {group}, {name}.",
    { group: ["class", "group", "team", "club"], name: ["Mum", "Mr Aliev", "Grandpa", "Aunt Lola"] }],
  ["These", BP("Boots"), "{name}, I'm wearing ______ boots because it is {weather} today.",
    { name: ["Mum", "Aziz", "Olga", "Dad"], weather: ["cold", "raining", "snowy", "wet"] }],
  ["This", BS("Computer"), "______ computer in front of me is {adj}. I need help, {name}.",
    { adj: ["very slow", "broken", "new", "strange"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["These", BP("Sweets"), "______ sweets in my {pocket} are for {who}.",
    { pocket: ["pocket", "bag", "coat pocket", "backpack"], who: ["my sister", "the kids", "you", "Grandpa"] }],
  ["this", BS("The thing in your hand"), "Is ______ your {thing} in my hand, {name}?",
    { thing: ["key", "pen", "ring", "ticket"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["These", BP("Glasses"), "______ glasses I'm wearing are {adj}. I got them from {who}.",
    { adj: ["new", "a bit big", "strong", "my old ones"], who: ["Grandpa", "the doctor", "my aunt", "a shop in town"] }],
  ["This", BS("Place"), "______ place here is {adj}. Let's sit down, {name}.",
    { adj: ["nice", "quiet", "perfect", "shady"], name: ["Mum", "Aziz", "Olga", "Grandpa"] }],
  ["These", BP("Trousers"), "______ trousers I have on are too {adj}, {name}.",
    { adj: ["long", "short", "big", "small"], name: ["Mum", "Grandma", "Dad", "Aunt Lola"] }],
  ["This", BS("Plov"), "______ plov on my plate is {adj}, {name}!",
    { adj: ["delicious", "very hot", "so good", "perfect"], name: ["Mum", "Grandma", "Aunt Malika", "Dad"] }],
  ["These", BP("Exercises"), "______ exercises here in my {book} are {adj}.",
    { book: ["book", "workbook", "notebook", "textbook"], adj: ["easy", "hard", "long", "short"] }],
  ["This", BS("Street"), "______ street where we are standing is very {adj}, {name}.",
    { adj: ["busy", "quiet", "old", "long"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["These", BP("Grapes"), "______ grapes here are from our {garden}. They are {adj}.",
    { garden: ["garden", "village", "yard", "vine"], adj: ["sweet", "big", "ripe", "delicious"] }],
  ["This", BS("The person next to you"), "______ is my grandmother next to me in the {photo}.",
    { photo: ["photo", "picture", "video", "old photo"] }],
  ["These", BP("Friends"), "______ are my friends here with me, {name1} and {name2}.",
    { name1: ["Aziz", "Lola", "Bobur", "Madina"], name2: ["Kamila", "Sardor", "Nodira", "Jasur"] }],
  ["This", BS("Room"), "______ room we are in is our {room}, and it is {adj}.",
    { room: ["classroom", "kitchen", "living room", "music room"], adj: ["big", "bright", "warm", "new"] }],
  ["these", BP("Flowers"), "Smell ______ flowers in my hand, {name}. They are from the {place}.",
    { name: ["Mum", "Grandma", "Aziz", "Lola"], place: ["garden", "market", "park", "village"] }],
  ["This", BS("Bus"), "______ bus we are on goes to {place}, and it is very {adj}.",
    { place: ["the centre", "the station", "Chilonzor", "the airport"], adj: ["full", "slow", "hot", "crowded"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PL = "Make it plural (more than one).";
const COR = "Correct the mistake.";
const NEAR = "Now the thing is here, near you. Rewrite the sentence.";
const TRANSFORM = [
  // singular -> plural (5)
  [PL, "These", "This book is {adj}. I read it {when}.", "______ books are {adj}. I read them {when}.",
    "Books is more than one, so this changes to these.", { adj: ["interesting", "easy", "funny", "new"], when: ["every day", "at night", "on the bus", "at school"] }],
  [PL, "These", "This cup on my {place} is {adj}.", "______ cups on my {place} are {adj}.",
    "Cups is more than one, so this changes to these.", { place: ["desk", "table", "tray", "shelf"], adj: ["dirty", "full", "empty", "Grandma's"] }],
  [PL, "These", "This apple in my hand is {adj}. I got it from {who}.", "______ apples in my hand are {adj}. I got them from {who}.",
    "Apples is more than one, so this changes to these.", { adj: ["sweet", "sour", "red", "big"], who: ["Grandma", "the market", "our garden", "a friend"] }],
  [PL, "These", "This is my cousin {name}.", "______ are my cousins {name} and {name2}.",
    "Two cousins are more than one, so This is changes to These are.", { name: ["Aziz", "Lola", "Bobur", "Madina"], name2: ["Kamila", "Sardor", "Nodira", "Jasur"] }],
  [PL, "These", "This {adj} student here is from {city}.", "______ {adj} students here are from {city}.",
    "Students is more than one, so this changes to these.", { adj: ["new", "young", "quiet", "clever"], city: ["Nukus", "Termez", "Kazan", "Almaty"] }],
  // correct a number mistake (5)
  [COR, "These", "This shoes I'm wearing are {adj}, {name}.", "______ shoes I'm wearing are {adj}, {name}.",
    "Shoes is plural, so use these, not this.", { adj: ["new", "too small", "comfortable", "my sister's"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  [COR, "This", "These book in my {bag} is about {topic}.", "______ book in my {bag} is about {topic}.",
    "Book is one thing, so use this, not these.", { bag: ["bag", "backpack", "hand", "desk"], topic: ["animals", "space", "football", "history"] }],
  [COR, "These", "This apricots here on the {table} are from {place}.", "______ apricots here on the {table} are from {place}.",
    "Apricots is plural, so use these, not this.", { table: ["table", "plate", "tray", "counter"], place: ["Fergana", "our garden", "the market", "Grandpa's tree"] }],
  [COR, "This", "These water in my {bottle} is {adj}.", "______ water in my {bottle} is {adj}.",
    "Water has no plural, so use this, not these.", { bottle: ["bottle", "glass", "cup", "flask"], adj: ["cold", "warm", "fresh", "very clean"] }],
  [COR, "These", "This keys in my {pocket} are for the {place}.", "______ keys in my {pocket} are for the {place}.",
    "Keys is plural, so use these, not this.", { pocket: ["pocket", "bag", "hand", "coat"], place: ["flat", "car", "garage", "shop"] }],
  // far -> near (5)
  [NEAR, "This", "{name}, that bag over there is {adj}.", "{name}, ______ bag here is {adj}.",
    "The bag is near now and it is one thing, so that changes to this.", { name: ["Aziz", "Olga", "Mum", "Dad"], adj: ["heavy", "mine", "open", "new"] }],
  [NEAR, "These", "Those boys over there are in my {group}, {name}.", "______ boys here are in my {group}, {name}.",
    "The boys are near now and there are more than one, so those changes to these.", { group: ["class", "team", "club", "group"], name: ["Mum", "Dad", "Grandpa", "Aunt Lola"] }],
  [NEAR, "this", "Is that your {thing} over there, {name}?", "Is ______ your {thing} here, {name}?",
    "The thing is near now and it is one thing, so that changes to this.", { thing: ["phone", "jacket", "ball", "umbrella"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [NEAR, "These", "Those flowers in the garden are {adj}, {name}.", "______ flowers in my hand are {adj}, {name}.",
    "The flowers are in your hand now, more than one, so those changes to these.", { adj: ["beautiful", "red", "white", "lovely"], name: ["Mum", "Grandma", "Aziz", "Lola"] }],
  [NEAR, "This", "That chair by the door is {adj}, {name}.", "______ chair next to me is {adj}, {name}.",
    "The chair is next to you now and it is one thing, so that changes to this.", { adj: ["free", "broken", "new", "very old"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([instr, key, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["You are holding your phone. Write one sentence about it with This.", "This + is", ["exactly one sentence", "must start with This", "must say something about the phone"]],
  ["You are wearing your shoes. Write one sentence about them with These.", "These + are", ["exactly one sentence", "must start with These", "are, not is"]],
  ["Show a friend a photo of your family. Write one sentence about one person in it.", "This is my …", ["exactly one sentence", "must use This is", "a family word"]],
  ["Write one sentence about the food on your plate at dinner.", "this + noun", ["exactly one sentence", "must use this", "must name the food"]],
  ["You have some books on your desk. Write one sentence about them.", "these + plural noun", ["exactly one sentence", "must use these", "a plural noun after these"]],
  ["A friend visits your room. Write one sentence to show them something in it.", "This is / These are", ["exactly one sentence", "must use this or these", "must name the thing"]],
  ["Write one sentence about the room you are in now.", "This room …", ["exactly one sentence", "must use this", "is, not are"]],
  ["Write two sentences about things in your bag: one with this, one with these.", "this + singular / these + plural", ["exactly two sentences", "one this, one these", "is after this, are after these"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are showing a new friend around your room. Write what you say about four things in it.",
    "this / these for near things", ["This is …", "These are …", "is after this, are after these"]],
  ["You are looking at photos of your family on your phone. Describe three of them.",
    "This is … / These are …", ["This is my …", "These are my …", "family words"]],
  ["You are at the market with a friend, holding some fruit. Write a short conversation about it.",
    "this / these + noun", ["these + plural fruit", "this + one thing", "a question with this or these"]],
  ["Describe the things on your desk or table right now.",
    "this / these", ["this + singular noun", "these + plural noun", "near words: here, on my desk"]],
  ["Write a short message to a pen friend with a photo of your school. What is in the photo?",
    "This is / These are", ["This is our school", "These are my friends / classmates", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.demonstrative.this-these-near.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);