// Hand-authored: tenses / future / will-spontaneous (A2).
//
// Tests ONE point: will + verb for a decision made at the moment of speaking
// ("The phone is ringing. - I'll answer it."). Almost every item is a short
// exchange: a situation, then the decision.
//
// Choose distractors: "will to" (L1 transfer, Russian "буду"/to-infinitive),
// a dropped will with am/are ("I am answer it", missing auxiliary), and
// "going" with no be. "am going to" is NOT a distractor: it is possible
// in some contexts, so it could be a second right answer.
//
// Run: node tools/grammar-practice/authored/tenses.future.will-spontaneous.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "future", topic: "will-spontaneous", level: "A2", pv: "2.5" };
const BE = { I: "am", we: "are" };
const opts = (s) => ["will", "will to", BE[s], "going"];
const WHY_C = "You decide right now, as you speak, so use will + verb (no to).";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["I", "The phone in the {room} is ringing. - Don't get up, {name}. I ______ answer it.",
    { room: ["kitchen", "hall", "office", "living room"], name: ["Aziz", "Mum", "Olga", "Bobur"] }],
  ["I", "This {bag} looks heavy. - I ______ help you carry it to the {place}.",
    { bag: ["bag", "box", "suitcase", "basket"], place: ["car", "taxi", "bus stop", "door"] }],
  ["I", "It's cold in the {room}. - I ______ close the {window}.",
    { room: ["classroom", "kitchen", "bedroom", "office"], window: ["window", "door", "balcony door", "small window"] }],
  ["we", "Oh no, the last bus to {city} has gone! - We ______ take a {transport} then.",
    { city: ["Chirchiq", "Angren", "Samarkand", "Jizzakh"], transport: ["taxi", "minibus", "train", "shared taxi"] }],
  ["I", "I'm thirsty after the {activity}. - Wait, I ______ get you some {drink}.",
    { activity: ["walk", "game", "run", "lesson"], drink: ["water", "juice", "tea", "cold water"] }],
  ["I", "Which {thing} do you want? - Hmm, I ______ take the {colour} one.",
    { thing: ["T-shirt", "bag", "cup", "phone case"], colour: ["red", "blue", "black", "white"] }],
  ["I", "We don't have any {food} for dinner. - No problem. I ______ buy some at the {shop}.",
    { food: ["bread", "rice", "eggs", "onions"], shop: ["market", "shop", "corner shop", "supermarket"] }],
  ["I", "I can't do this {subject} homework. - Don't worry, I ______ show you {what}.",
    { subject: ["maths", "English", "physics", "chemistry"], what: ["the steps", "an easy way", "the rule", "an example"] }],
  ["we", "It's late and the {place} is closing. - OK, we ______ come back {when}.",
    { place: ["shop", "museum", "library", "bank"], when: ["tomorrow", "on Monday", "next week", "later"] }],
  ["I", "Someone is at the door of the {home}. - I ______ open it, {name}.",
    { home: ["house", "flat", "office", "classroom"], name: ["Mum", "Dad", "Kamila", "Timur"] }],
  ["I", "There's no {thing} in the bathroom. - Sorry! I ______ bring some from the {room}.",
    { thing: ["soap", "toilet paper", "shampoo", "hot water"], room: ["kitchen", "hall", "cupboard", "bedroom"] }],
  ["I", "The {food} looks great. - Then I ______ have some {extra}.",
    { food: ["plov", "soup", "salad", "lagman"], extra: ["now", "too", "with bread", "with tea"] }],
  ["I", "Your {person} called while you were out. - Thanks, I ______ call her back {when}.",
    { person: ["mother", "aunt", "sister", "grandmother"], when: ["now", "after lunch", "in a minute", "later"] }],
  ["we", "The lift in our {building} isn't working. - Never mind, we ______ walk up the stairs with the {things}.",
    { building: ["building", "block", "hotel", "office"], things: ["bags", "shopping", "boxes", "bikes"] }],
  ["I", "I forgot my {thing} at home. - Don't worry, I ______ lend you mine for the {event}.",
    { thing: ["pen", "ruler", "dictionary", "calculator"], event: ["lesson", "test", "class", "exam"] }],
  ["I", "The music in the {room} is too loud. - Sorry, {name}, I ______ turn it down.",
    { room: ["bedroom", "car", "kitchen", "living room"], name: ["Dad", "Grandma", "Malika", "Rustam"] }],
  ["I", "Do you want tea or coffee with your {food}, {name}? - I ______ have tea, please.",
    { food: ["cake", "breakfast", "samsa", "dessert"], name: ["Aziz", "Nigora", "Sardor", "Anna"] }],
  ["we", "The {shop} is too busy today. - OK, we ______ try the one near the {place}.",
    { shop: ["café", "bakery", "pharmacy", "shop"], place: ["park", "station", "metro", "school"] }],
  ["I", "My {device} has stopped working. - Give it to me, {name}. I ______ have a look at it.",
    { device: ["laptop", "phone", "printer", "tablet"], name: ["Laylo", "Javohir", "Olga", "Bekzod"] }],
  ["I", "It's starting to rain on the {place}. - I ______ bring the {things} inside.",
    { place: ["balcony", "yard", "garden", "terrace"], things: ["chairs", "clothes", "cushions", "plants"] }],
].map(([s, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(s), key: 0, why: WHY_C, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Decide now. Complete the answer with will and the verb in brackets.";
const WHY_B = (v) => `You decide at this moment, so use will + verb: will ${v}.`;
const BUILD = [
  ["answer", "Someone is calling on the phone in the {room}. - Sit down, {name}. I ______ (answer) it.",
    { room: ["kitchen", "hall", "office", "living room"], name: ["Aziz", "Mum", "Olga", "Bobur"] }],
  ["carry", "Your {bag} looks very heavy. - Here, I ______ (carry) it for you to the {place}.",
    { bag: ["bag", "box", "suitcase", "basket"], place: ["car", "taxi", "bus stop", "door"] }],
  ["close", "It's very cold in this {room}. - I ______ (close) the {window}.",
    { room: ["classroom", "kitchen", "bedroom", "office"], window: ["window", "door", "balcony door", "small window"] }],
  ["take", "We have missed the bus to {city}! - Then we ______ (take) a {transport}.",
    { city: ["Chirchiq", "Angren", "Samarkand", "Jizzakh"], transport: ["taxi", "minibus", "train", "shared taxi"] }],
  ["get", "I'm hungry after the {activity}. - Wait here. I ______ (get) you some {food}.",
    { activity: ["walk", "game", "run", "lesson"], food: ["bread", "fruit", "soup", "samsa"] }],
  ["choose", "Which {thing} do you want? - Hmm, I ______ (choose) the {colour} one.",
    { thing: ["T-shirt", "bag", "cup", "phone case"], colour: ["red", "blue", "black", "white"] }],
  ["buy", "We don't have any {food} at home. - No problem. I ______ (buy) some at the {shop}.",
    { food: ["bread", "rice", "eggs", "onions"], shop: ["market", "shop", "corner shop", "supermarket"] }],
  ["explain", "I don't understand this {subject} exercise. - Don't worry, I ______ (explain) it with {help}.",
    { subject: ["maths", "English", "physics", "chemistry"], help: ["an example", "a picture", "a drawing", "my notes"] }],
  ["come", "Sorry, the {place} closes now. - OK, we ______ (come) back {when}.",
    { place: ["shop", "museum", "library", "bank"], when: ["tomorrow", "on Monday", "next week", "later"] }],
  ["open", "Somebody has knocked on the door of our {home}. - Stay here, {name}. I ______ (open) it.",
    { home: ["house", "flat", "office", "classroom"], name: ["Mum", "Dad", "Kamila", "Timur"] }],
  ["bring", "There's no {thing} in the bathroom. - Sorry! I ______ (bring) some from the {room}.",
    { thing: ["soap", "toilet paper", "shampoo", "hot water"], room: ["kitchen", "hall", "cupboard", "bedroom"] }],
  ["try", "This {food} smells great. - Then I ______ (try) some with {side}.",
    { food: ["plov", "soup", "lagman", "shurpa"], side: ["bread", "salad", "tea", "a little salt"] }],
  ["call", "Your {person} rang while you were out. - Thanks, I ______ (call) her back {when}.",
    { person: ["mother", "aunt", "sister", "grandmother"], when: ["now", "after lunch", "in a minute", "later"] }],
  ["walk", "The lift in our {building} has broken again. - Never mind, we ______ (walk) up the stairs with the {things}.",
    { building: ["building", "block", "hotel", "office"], things: ["bags", "shopping", "boxes", "bikes"] }],
  ["lend", "I forgot my {thing} at home. - Don't worry, I ______ (lend) you mine for the {event}.",
    { thing: ["pen", "ruler", "dictionary", "calculator"], event: ["lesson", "test", "class", "exam"] }],
  ["turn", "The music in the {room} is too loud. - Sorry, {name}, I ______ (turn) it down.",
    { room: ["bedroom", "car", "kitchen", "living room"], name: ["Dad", "Grandma", "Malika", "Rustam"] }],
  ["have", "Do you want tea or coffee, {name}? - I ______ (have) tea with my {food}, please.",
    { name: ["Aziz", "Nigora", "Sardor", "Anna"], food: ["cake", "breakfast", "samsa", "dessert"] }],
  ["look", "My {device} has stopped working. - Give it here, {name}. I ______ (look) at it for you.",
    { device: ["laptop", "phone", "printer", "tablet"], name: ["Laylo", "Javohir", "Olga", "Bekzod"] }],
  ["wash", "Look, these {things} in the sink are dirty. - I ______ (wash) them after {meal}.",
    { things: ["plates", "cups", "glasses", "pans"], meal: ["dinner", "lunch", "breakfast", "the film"] }],
  ["fix", "Oh no, the {thing} has fallen off the wall. - Don't worry, {name}, I ______ (fix) it.",
    { thing: ["picture", "clock", "mirror", "shelf"], name: ["Grandma", "Mum", "Zarina", "Akmal"] }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `will ${v}`, why: WHY_B(v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_YES = "Read the situation. Decide now. Complete the answer with will and the verb in brackets.";
const T_NO = "Read the situation. Decide now and say no. Complete the answer with won't (will not) and the verb in brackets.";
const T_PICK = "Read the choice. Decide now. Complete the answer with will and the verb in brackets.";
const TRANSFORM = [
  // kind 1: decide to do something
  [T_YES, "The {pet} is hungry and its bowl in the {room} is empty.", "I ______ (feed) it.",
    "will feed", "You decide now, so use will + verb: will feed.",
    { pet: ["cat", "dog", "puppy", "kitten"], room: ["kitchen", "hall", "yard", "living room"] }],
  [T_YES, "Your friend {name} needs a pen for the {event}.", "Here, I ______ (give) you mine.",
    "will give", "You decide now, so use will + verb: will give.",
    { name: ["Aziz", "Nodira", "Timur", "Anna"], event: ["test", "lesson", "exam", "class"] }],
  [T_YES, "The {room} is very dark and {name} can't see.", "I ______ (switch) on the light.",
    "will switch", "You decide now, so use will + verb: will switch.",
    { room: ["hall", "kitchen", "classroom", "bedroom"], name: ["Grandma", "Bobur", "Malika", "Dad"] }],
  [T_YES, "Your little brother can't reach the {thing} on the {shelf}.", "I ______ (get) it for you.",
    "will get", "You decide now, so use will + verb: will get.",
    { thing: ["book", "ball", "toy", "box"], shelf: ["top shelf", "high shelf", "cupboard", "wardrobe"] }],
  [T_YES, "Your {person} is waiting at the {place} in the rain.", "I ______ (drive) there now.",
    "will drive", "You decide now, so use will + verb: will drive.",
    { person: ["sister", "mother", "friend", "grandfather"], place: ["bus stop", "station", "airport", "gate"] }],
  // kind 2: decide NOT to do something
  [T_NO, "Do you want more {food}, {name}? You are full.", "No, thanks. I ______ (have) any more.",
    "will not have", "You decide now and say no, so use won't (will not) + verb.",
    { food: ["plov", "cake", "soup", "bread"], name: ["Aziz", "Kamila", "Olga", "Sardor"] }],
  [T_NO, "The film at the {place} looks boring, and it's very long.", "Sorry, {name}. I ______ (watch) it.",
    "will not watch", "You decide now and say no, so use won't (will not) + verb.",
    { place: ["cinema", "theatre", "club", "centre"], name: ["Laylo", "Bekzod", "Nigora", "Rustam"] }],
  [T_NO, "The {shop} on this street is very expensive.", "I ______ (buy) my {thing} here.",
    "will not buy", "You decide now and say no, so use won't (will not) + verb.",
    { shop: ["shop", "market", "bookshop", "clothes shop"], thing: ["shoes", "jacket", "bag", "books"] }],
  [T_NO, "It's very cold and windy this morning.", "We ______ (swim) in the {water} with the {who}.",
    "will not swim", "You decide now and say no, so use won't (will not) + verb.",
    { water: ["lake", "river", "sea", "pool"], who: ["children", "kids", "dog", "cousins"] }],
  [T_NO, "The {road} is very busy and the bus is slow.", "I ______ (wait) for it. Let's walk, {name}.",
    "will not wait", "You decide now and say no, so use won't (will not) + verb.",
    { road: ["road", "main road", "bridge", "street"], name: ["Aziz", "Mum", "Zarina", "Timur"] }],
  // kind 3: pick one of two
  [T_PICK, "Tea or juice, {name}? There is cold {juice} in the fridge.", "I think I ______ (drink) the {juice}.",
    "will drink", "You choose at this moment, so use will + verb: will drink.",
    { name: ["Aziz", "Olga", "Bobur", "Nigora"], juice: ["apple juice", "orange juice", "cherry juice", "peach juice"] }],
  [T_PICK, "The red {thing} or the {colour} one?", "I think I ______ (take) the {colour} one.",
    "will take", "You choose at this moment, so use will + verb: will take.",
    { thing: ["jacket", "bag", "scarf", "hat"], colour: ["blue", "black", "white", "green"] }],
  [T_PICK, "Bus or metro to the {place}?", "I think I ______ (use) the metro with {name}.",
    "will use", "You choose at this moment, so use will + verb: will use.",
    { place: ["market", "station", "university", "old town"], name: ["Kamila", "Timur", "Anna", "my sister"] }],
  [T_PICK, "Plov or lagman for lunch at the {place}?", "I think I ______ (order) the plov, {name}.",
    "will order", "You choose at this moment, so use will + verb: will order.",
    { place: ["café", "canteen", "restaurant", "choyxona"], name: ["Aziz", "Malika", "Sardor", "Dad"] }],
  [T_PICK, "Football or tennis this afternoon in the {place}?", "I think I ______ (play) tennis with {name}.",
    "will play", "You choose at this moment, so use will + verb: will play.",
    { place: ["park", "sports centre", "school", "yard"], name: ["Bobur", "Laylo", "Javohir", "my cousin"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your friend says: \"I'm cold.\" Answer with one sentence. Decide what to do now.", "will (spontaneous decision)", ["exactly one sentence", "must use will or 'll", "must be an offer or a decision"]],
  ["The phone is ringing and your mother is busy. Write one sentence.", "will (spontaneous decision)", ["exactly one sentence", "must use will or 'll", "must use answer"]],
  ["You are in a café. Write one sentence to choose your drink.", "I'll have...", ["exactly one sentence", "must use will or 'll", "must name a drink"]],
  ["Your friend has no money for the bus. Write one sentence.", "will (offer)", ["exactly one sentence", "must use will or 'll", "must be an offer"]],
  ["Someone offers you more food, but you are full. Write one sentence.", "won't", ["exactly one sentence", "must use won't", "must be polite"]],
  ["You see an old woman with heavy bags. Write one sentence.", "will (offer)", ["exactly one sentence", "must use will or 'll", "must use help or carry"]],
  ["The shop is closed. Write one sentence about what you decide to do.", "we'll", ["exactly one sentence", "must use we", "must use will or 'll"]],
  ["Write two short replies: say yes to one offer and no to another.", "will + won't", ["exactly two sentences", "one with will", "one with won't"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write a short dialogue (three or four lines) in a café. One person decides what to eat and drink.", "will (spontaneous decision)", ["I'll have", "a choice between two things", "won't"]],
  ["Your friend has a problem at home: the lights are off and the fridge is empty. Write three or four sentences to help.", "will (offer)", ["I'll", "two different offers", "a reason"]],
  ["You are with your family and it starts to rain. Write three or four sentences about what you decide to do.", "will (spontaneous decision)", ["we'll", "I'll", "won't"]],
  ["Write a short dialogue (three or four lines) where someone asks for help with homework.", "will (offer)", ["I'll", "show or explain", "a thank-you"]],
  ["You are shopping and you see two jackets. Write three or four sentences about your decision.", "will (spontaneous decision)", ["I think I'll", "won't", "a reason"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/tenses.future.will-spontaneous.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/tenses.future.will-spontaneous.json`);