// Hand-authored: prep-phrasal / phrasal-verbs / common-phrasal (A2).
// Path fill P12 (2026-11-14, Base44 AI, branch grammar-path-fill-3-base44).
//
// Placement focus: particle choice in a common phrasal verb ("I usually get
// ______ at seven" -> up). This stop sits in the "Every day" unit, so the verbs
// are everyday ones: wake up, get up, put on, take off, turn on / off, sit
// down, stand up, look for, look after, come back, go out, pick up, get off,
// grow up, try on, lie down, take out, find out, give up, slow down, calm
// down, come in, put down, write down.
// Sibling scope: an object is always a NOUN after the particle (put on your
// coat). Never an object pronoun (put it on: pronoun-separation, B1) and never
// a question about where the object goes (phrasal-noun-position, B2).
// One right particle per blank: every option was checked against the exact
// sentence, because particles combine freely in English. Cut while drafting:
// get in / get back (arrive), turn up / turn down (volume), turn in (hand in),
// sit up, put away, take out (from a bag), pick out, give in, come on,
// go in, write up / write out, call you back (pronoun), fill in / fill out.
// Distractors are real learner errors: put off for take off (Russian
// "снять" / "одеть" mix), turn of for turn off, find about (Russian
// "узнать о"), get down / get out the bus, wake on.
// Build: the particles to choose from are listed in instr for each item
// (closed class); the item was checked against that list only. No particle
// in the list is printed anywhere else in the source.
// Transform: 5 correct the particle / 5 say it with a phrasal verb (a
// one-word verb -> verb + particle; the verb is given) / 5 say the opposite.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.phrasal-verbs.common-phrasal.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "phrasal-verbs", topic: "common-phrasal", level: "A2", pv: "2.5" };

/* ---------------- choose: 20 mcq ---------------- */
// [prompt, options, key, why, slots]
const CHOOSE = [
  ["{name} wakes ______ when the {sound} starts.", ["up", "on", "off", "out"], 0,
    "Wake up = stop sleeping.",
    { name: ["Aziz", "Lola", "Grandpa", "My sister"], sound: ["alarm", "music", "rain", "noise"] }],
  ["It's cold outside, {name}. Put ______ your {clothes}.", ["off", "on", "in", "up"], 1,
    "Put on = start wearing clothes. Put off does not mean this.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], clothes: ["warm coat", "hat", "jacket", "scarf"] }],
  ["Please take ______ your {shoes} before you come in, {name}.", ["on", "down", "off", "up"], 2,
    "Take off = remove clothes or shoes.",
    { shoes: ["shoes", "boots", "trainers", "sandals"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["It's dark in the {room}. Can you turn ______ the light, {name}?", ["in", "of", "on", "at"], 2,
    "Turn on = start a light or a machine.",
    { room: ["kitchen", "hall", "bathroom", "garage"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["Turn ______ the {device} and go to bed, {name}.", ["of", "off", "at", "from"], 1,
    "Turn off = stop a machine. Of is a different word.",
    { device: ["TV", "computer", "tablet", "radio"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["Come in and sit ______, {name}. The {food} is ready.", ["down", "on", "off", "to"], 0,
    "Sit down = take a seat.",
    { name: ["Aziz", "Olga", "Grandma", "Uncle Bobur"], food: ["tea", "soup", "plov", "dinner"] }],
  ["Please stand ______ when {who} comes into the {room}.", ["on", "up", "off", "at"], 1,
    "Stand up = get on your feet.",
    { who: ["the teacher", "Mr Karimov", "the head teacher", "our guest"], room: ["room", "classroom", "hall", "office"] }],
  ["I'm looking ______ my {thing}, {name}. I can't find it.", ["for", "to", "on", "of"], 0,
    "Look for = try to find something.",
    { thing: ["phone", "wallet", "pen", "bag"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["{who} looks ______ my little {sib} when Mum is at work.", ["of", "after", "on", "in"], 1,
    "Look after = take care of someone.",
    { who: ["Grandma", "My aunt", "Our neighbour", "Grandpa"], sib: ["sister", "brother", "sisters", "brothers"] }],
  ["{name} is coming ______ from {city} next Monday.", ["on", "off", "back", "to"], 2,
    "Come back = return to a place.",
    { name: ["My uncle", "Dad", "Aunt Lola", "My brother"], city: ["Moscow", "Kazan", "Seoul", "Almaty"] }],
  ["We often go ______ for dinner with {who}.", ["off", "out", "on", "to"], 1,
    "Go out = leave home to do something, for example eat at a cafe.",
    { who: ["our cousins", "my grandparents", "friends", "Aunt Lola"] }],
  ["Pick ______ your {things} from the floor, {name}.", ["up", "on", "in", "to"], 0,
    "Pick up = take something from the floor or a table.",
    { things: ["clothes", "books", "toys", "socks"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["This is our stop, {name}. Let's get ______ the {bus}.", ["from", "out", "off", "down"], 2,
    "Get off = leave a bus or a train. Get out needs of (get out of a car).",
    { name: ["Mum", "Dad", "Aziz", "Olga"], bus: ["bus", "tram", "minibus", "train"] }],
  ["My {who} grew ______ in a small village near {city}.", ["up", "on", "out", "off"], 0,
    "Grow up = change from a child to an adult.",
    { who: ["mother", "father", "grandmother", "uncle"], city: ["Bukhara", "Fergana", "Namangan", "Samarkand"] }],
  ["Can I try ______ this {item}, {name}? It looks nice.", ["in", "on", "up", "at"], 1,
    "Try on = put on clothes to see if they are right for you.",
    { item: ["jacket", "dress", "shirt", "coat"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  ["I want to lie ______ for an hour, {name}. I'm very {adj}.", ["down", "up", "off", "to"], 0,
    "Lie down = put your body flat on a bed or sofa to rest.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], adj: ["tired", "sleepy", "ill", "weak"] }],
  ["Can you take ______ the {thing}, {name}?", ["off", "out", "up", "on"], 1,
    "Take out = carry something out of the house.",
    { thing: ["rubbish", "bins", "dog", "rubbish bag"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["I want to find ______ the time of the {event}, {name}.", ["about", "up", "out", "on"], 2,
    "Find out = learn a fact. We don't say find about.",
    { event: ["match", "film", "concert", "lesson"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["Don't give ______, {name}! This {task} is not so hard.", ["up", "on", "off", "away"], 0,
    "Give up = stop trying.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], task: ["exercise", "test", "game", "puzzle"] }],
  ["Slow ______, {name}! The {road} is wet.", ["off", "down", "out", "on"], 1,
    "Slow down = go less fast.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], road: ["road", "street", "floor", "path"] }],
].map(([prompt, options, key, why, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const W = (list) => `Write ${list}.`;
const G1 = W("up, down, on or off");
const BUILD = [
  [G1, "{name} wakes ______ when the {pet} jumps onto the bed.", "up", "Wake up = stop sleeping.",
    { name: ["Aziz", "Lola", "Grandpa", "My sister"], pet: ["cat", "dog", "puppy", "kitten"] }],
  [G1, "Put ______ your {clothes}, {name}. It's cold.", "on", "Put on = start wearing clothes.",
    { clothes: ["gloves", "hat", "scarf", "boots"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [G1, "Take ______ your {coat} and hang it here, {name}.", "off", "Take off = remove clothes.",
    { coat: ["coat", "jacket", "hat", "scarf"], name: ["Aziz", "Olga", "Grandma", "Uncle Bobur"] }],
  [G1, "Turn ______ the {device} before you go to sleep, {name}.", "off", "Turn off = stop a machine.",
    { device: ["computer", "laptop", "tablet", "printer"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [W("down, off, out or on"), "{name}, sit ______ and eat your {food}.", "down", "Sit down = take a seat.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], food: ["soup", "breakfast", "plov", "salad"] }],
  [G1, "Stand ______, {name}, and come to the {place}.", "up", "Stand up = get on your feet.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], place: ["board", "front", "door", "window"] }],
  [W("after, for, at or on"), "I'm going to {city}. Can you look ______ my {pet}?", "after", "Look after = take care of someone or an animal.",
    { city: ["Kazan", "Seoul", "Almaty", "Moscow"], pet: ["cat", "dog", "parrot", "fish"] }],
  [W("after, for, at or on"), "I'm looking ______ my {thing}. Have you seen it, {name}?", "for", "Look for = try to find something.",
    { thing: ["phone", "pen", "ruler", "wallet"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [W("back, off, on or at"), "My {who} is in {city} now. She is coming ______ next week.", "back", "Come back = return to a place.",
    { who: ["aunt", "sister", "grandmother", "mum"], city: ["Kazan", "Seoul", "Almaty", "Moscow"] }],
  [W("out, up, on or off"), "Let's go ______ tonight, {name}. We can eat {food}.", "out", "Go out = leave home to do something, for example eat at a cafe.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], food: ["plov", "pizza", "kebabs", "ice cream"] }],
  [G1, "Pick ______ the {things}, {name}. The floor is a mess.", "up", "Pick up = take something from the floor.",
    { things: ["toys", "papers", "books", "socks"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [G1, "This is our stop, {name}. Get ______ the {bus} now.", "off", "Get off = leave a bus or a train.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], bus: ["bus", "tram", "minibus", "train"] }],
  [G1, "{who} grew ______ in {city}.", "up", "Grow up = change from a child to an adult.",
    { who: ["My father", "My grandmother", "Aunt Lola", "Mr Karimov"], city: ["Bukhara", "Namangan", "Khiva", "Termez"] }],
  [G1, "Try ______ these {shoes} before you buy them, {name}.", "on", "Try on = put on clothes to see if they are right for you.",
    { shoes: ["shoes", "jeans", "boots", "trainers"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [W("down, off, back or on"), "{name}, write ______ the new {words} in your notebook.", "down", "Write down = write something so you don't forget it.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], words: ["words", "phrases", "verbs", "rules"] }],
  [W("out, up, on or off"), "I want to find ______ the score of the {match}.", "out", "Find out = learn a fact.",
    { match: ["match", "game", "football match", "chess game"] }],
  [G1, "Calm ______, {name}. The {test} is easy.", "down", "Calm down = stop being worried or angry.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], test: ["test", "exam", "quiz", "lesson"] }],
  [W("in, off, at or to"), "Come ______ and close the door, {name}. It's cold outside.", "in", "Come in = enter a room or a house.",
    { name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [G1, "Put ______ your {thing} and listen to me, {name}.", "down", "Put down = stop holding something and leave it.",
    { thing: ["phone", "pen", "book", "tablet"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [G1, "Don't give ______ now, {name}. You are {adj}!", "up", "Give up = stop trying.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["so close", "nearly there", "very good", "doing well"] }],
].map(([instr, source, key, why, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const SAY = (v) => `Say it with ${v} + a small word.`;
const OPP = "Say the opposite.";
const TRANSFORM = [
  // correct the particle (5)
  [COR, "Put off your {coat}, {name}. It's cold.", "Put ______ your {coat}, {name}. It's cold.", "on",
    "Put on = start wearing clothes. Put off is not right here.", { coat: ["coat", "hat", "jacket", "scarf"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "{name} wakes on at seven and {does}.", "{name} wakes ______ at seven and {does}.", "up",
    "We say wake up, not wake on.", { name: ["Aziz", "Lola", "My brother", "Grandpa"], does: ["makes tea", "has a shower", "makes the bed", "opens the window"] }],
  [COR, "Turn of the {device} and go to sleep, {name}.", "Turn ______ the {device} and go to sleep, {name}.", "off",
    "Turn off has two f's. Of is a different word.", { device: ["computer", "tablet", "laptop", "games console"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "I'm looking after my {thing}, {name}. I can't find it.", "I'm looking ______ my {thing}, {name}. I can't find it.", "for",
    "You can't find it, so you are trying to find it: look for.", { thing: ["phone", "pen", "bag", "wallet"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [COR, "Let's get down the {bus} here, {name}. This is our stop.", "Let's get ______ the {bus} here, {name}. This is our stop.", "off",
    "We get off a bus or a train, not get down.", { bus: ["bus", "tram", "minibus", "train"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  // say it with a phrasal verb (5)
  [SAY("come"), "My {who} returns from {city} on Friday.", "My {who} comes ______ from {city} on Friday.", "back",
    "Return = come back.", { who: ["uncle", "aunt", "brother", "sister"], city: ["Kazan", "Seoul", "Almaty", "Moscow"] }],
  [SAY("look"), "{who} takes care of my little {sib} when Mum is at work.", "{who} looks ______ my little {sib} when Mum is at work.", "after",
    "Take care of = look after.", { who: ["Grandma", "My aunt", "Our neighbour", "Grandpa"], sib: ["sister", "brother", "sisters", "brothers"] }],
  [SAY("find"), "Can you check the time of the {event}, {name}?", "Can you find ______ the time of the {event}, {name}?", "out",
    "To learn a fact = find out.", { event: ["match", "film", "concert", "bus"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [SAY("take"), "Please remove your {shoes} here, {name}.", "Please take ______ your {shoes} here, {name}.", "off",
    "Remove clothes or shoes = take off.", { shoes: ["shoes", "boots", "trainers", "sandals"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [SAY("get"), "{name} gets out of bed at six and {does}.", "{name} gets ______ at six and {does}.", "up",
    "Get out of bed = get up.", { name: ["Grandpa", "Aziz", "Lola", "My mum"], does: ["makes tea", "feeds the chickens", "has a shower", "opens the shop"] }],
  // say the opposite (5)
  [OPP, "Put on your {hat}, {name}.", "Take ______ your {hat}, {name}.", "off",
    "The opposite of put on is take off.", { hat: ["hat", "coat", "jacket", "gloves"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [OPP, "Turn on the {device}, {name}.", "Turn ______ the {device}, {name}.", "off",
    "The opposite of turn on is turn off.", { device: ["TV", "radio", "computer", "fan"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [OPP, "Please stand up and {do}, {name}.", "Please sit ______ and {do}, {name}.", "down",
    "The opposite of stand up is sit down.", { do: ["open your books", "listen", "read the text", "write the date"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [OPP, "{name} gets on the bus at the {stop}.", "{name} gets ______ the bus at the {stop}.", "off",
    "The opposite of get on a bus is get off.", { name: ["Aziz", "Lola", "Grandpa", "My sister"], stop: ["market", "park", "school", "station"] }],
  [OPP, "Get in the {car}, {name}.", "Get ______ of the {car}, {name}.", "out",
    "The opposite of get in a car is get out of it.", { car: ["car", "taxi", "van", "truck"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what time you wake up and get up on a school day.", "wake up / get up", ["exactly one sentence", "must use wake up or get up", "about you"]],
  ["Write one sentence about what you put on when it is cold.", "put on", ["exactly one sentence", "must use put on", "a clothes word"]],
  ["Write one sentence about what you take off when you come home.", "take off", ["exactly one sentence", "must use take off", "about you"]],
  ["Write one sentence about a person who looks after you or someone in your family.", "look after", ["exactly one sentence", "must use look after", "a family word"]],
  ["Write one sentence about something you often look for at home.", "look for", ["exactly one sentence", "must use look for", "about you"]],
  ["Write one sentence about where you or a person in your family grew up.", "grow up", ["exactly one sentence", "must use grew up", "a place"]],
  ["Write one question to a friend about going out at the weekend.", "go out", ["exactly one question", "must use go out", "must end with a question mark"]],
  ["Write two sentences for a younger brother or sister: one with turn off, one with put on.", "turn off / put on", ["exactly two sentences", "turn off in one", "put on in the other"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your morning, from waking up to leaving home.", "wake up / get up / put on", ["wake up or get up", "put on", "three or four sentences"]],
  ["Describe what you do in the evening when you come back home.", "come back / take off / turn on", ["come back", "take off or turn on", "three or four sentences"]],
  ["Write a message to a friend who wants to stop learning English. Tell them not to give up.", "give up", ["don't give up", "a reason", "three or four sentences"]],
  ["Tell a visitor some rules in your home: shoes, the TV, the lights.", "take off / turn off", ["take off", "turn off", "please / don't"]],
  ["Tell a friend about a person in your family who looks after you or helps you.", "look after", ["look after", "what they do", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.phrasal-verbs.common-phrasal.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);