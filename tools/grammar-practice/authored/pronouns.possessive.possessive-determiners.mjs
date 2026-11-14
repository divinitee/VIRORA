// Hand-authored: pronouns / possessive / possessive-determiners (A1).
// Path fill P3 (2026-11-14, Base44 AI, branch grammar-path-fill-base44).
//
// Placement focus: my before a noun (This is ______ book: I / me / my / mine),
// his not he/him before a noun (______ name is Ali), their vs theirs before a
// noun. Every blank stands directly before a noun and the owner is always
// clear from the sentence (a named person, I, we, the dog...). Distractors:
// the same person's subject pronoun, object pronoun and possessive pronoun
// (mine / yours / hers / ours / theirs), plus it's for its and you're for your.
// Possessive pronouns are never the key (possessive-pronouns is P24).
// Build cue = the subject pronoun in brackets (he -> his).
//
// Run: node tools/grammar-practice/authored/pronouns.possessive.possessive-determiners.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "possessive", topic: "possessive-determiners", level: "A1", pv: "2.5" };

const O = {
  my: ["my", "me", "I", "mine"],
  your: ["your", "you", "yours", "you're"],
  his: ["his", "he", "him", "he's"],
  her: ["her", "she", "hers", "she's"],
  its: ["its", "it's", "it", "its'"],
  our: ["our", "us", "we", "ours"],
  their: ["their", "they", "them", "theirs"],
};
const C = (k) => O[k].map((x) => (x === "I" ? x : x[0].toUpperCase() + x.slice(1)));
const OWN = { my: "I", your: "you", his: "he", her: "she", its: "it", our: "we", their: "they" };
const W = (k, owner) => `The thing belongs to ${owner}, and a noun comes next, so use ${k}. ${OWN[k] === "I" ? "I, me and mine" : "Subject, object and stand-alone forms"} cannot go before a noun.`;
const WITS = "The thing belongs to it, and a noun comes next, so use its. It's means it is, and its' is not a word.";
const WYOUR = "The thing belongs to you, and a noun comes next, so use your. You're means you are.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O.my, W("my", "me"), "This is ______ {thing}. I got it {when}.",
    { thing: ["bike", "phone", "watch", "bag"], when: ["yesterday", "last week", "last month", "in May"] }],
  [C("his"), W("his", "my brother"), "This is my brother. ______ name is {name}, and he is {age}.",
    { name: ["Ali", "Bobur", "Jasur", "Timur"], age: ["eight", "eleven", "fourteen", "seventeen"] }],
  [C("her"), W("her", "Lola"), "Lola is my classmate. ______ mother is a {job} in {city}.",
    { job: ["doctor", "teacher", "nurse", "cook"], city: ["Tashkent", "Fergana", "Bukhara", "Nukus"] }],
  [C("their"), W("their", "my grandparents"), "My grandparents live in {city}. ______ house has a big {feature}.",
    { city: ["Khiva", "Kokand", "Termez", "Jizzakh"], feature: ["garden", "yard", "balcony", "gate"] }],
  [O.our, W("our", "us"), "We love ______ teacher. She is very {adj} and {adj2}.",
    { adj: ["kind", "funny", "friendly", "patient"], adj2: ["smart", "helpful", "calm", "clever"] }],
  [C("its"), WITS, "{name}, the cat is hungry. ______ bowl is empty, and it wants {food}.",
    { name: ["Mum", "Dad", "Aziz", "Lola"], food: ["milk", "fish", "meat", "some food"] }],
  [O.your, WYOUR, "Excuse me, is this ______ {thing}? I found it {where}.",
    { thing: ["pen", "phone", "scarf", "key"], where: ["under the table", "on the bus", "in the classroom", "near the door"] }],
  [O.his, W("his", "Dad"), "Dad can't find ______ {thing}, and he is late for {event}.",
    { thing: ["keys", "phone", "wallet", "bag"], event: ["work", "a meeting", "the bus", "the train"] }],
  [O.her, W("her", "my sister"), "My sister is in ______ room. She is doing {task} {where}.",
    { task: ["homework", "maths", "a puzzle", "exercises"], where: ["right now", "at her desk", "quietly", "on the floor"] }],
  [O.their, W("their", "the students"), "The students open ______ {books} at page {n}.",
    { books: ["books", "notebooks", "workbooks", "textbooks"], n: ["ten", "twenty", "five", "thirty"] }],
  [C("our"), W("our", "my brother and me"), "My brother and I share a room at {home}. ______ beds are next to the {place}.",
    { home: ["home", "Grandma's house", "the village house", "the summer house"], place: ["window", "door", "wall", "wardrobe"] }],
  [O.my, W("my", "me"), "Can you help me? I can't find ______ {thing}, {name}.",
    { thing: ["notebook", "ruler", "pen", "ticket"], name: ["Aziz", "Olga", "Timur", "Kamila"] }],
  [C("his"), W("his", "Sardor"), "Sardor loves {sport}. ______ favourite player is from {country}.",
    { sport: ["football", "basketball", "tennis", "volleyball"], country: ["Spain", "Brazil", "Korea", "Japan"] }],
  [O.its, WITS, "Our school in {city} is old, but ______ {room} is new.",
    { city: ["Samarkand", "Navoi", "Andijan", "Urgench"], room: ["gym", "library", "roof", "canteen"] }],
  [C("their"), W("their", "Aziz and Lola"), "Aziz and Lola are cousins. ______ parents work in {place}.",
    { place: ["a bank", "a hospital", "the same office", "a big shop"] }],
  [O.your, WYOUR, "Please write ______ {thing} on the {where}.",
    { thing: ["name", "address", "phone number", "email"], where: ["form", "paper", "board", "card"] }],
  [C("her"), W("her", "Grandma"), "Grandma is {age}. ______ birthday is in {month}.",
    { age: ["seventy", "eighty", "sixty-five", "seventy-two"], month: ["March", "June", "October", "December"] }],
  [C("our"), W("our", "us"), "We live on the {n} floor. ______ flat has {rooms} rooms.",
    { n: ["second", "third", "fifth", "ninth"], rooms: ["two", "three", "four", "five"] }],
  [O.my, W("my", "me"), "I live with ______ {who} in {city}.",
    { who: ["parents", "grandparents", "aunt", "family"], city: ["Tashkent", "Margilan", "Karshi", "Gulistan"] }],
  [O.its, WITS, "The bird is in ______ nest {where}. It is {doing}.",
    { where: ["in the tree", "on the roof", "near our window", "in the garden"], doing: ["singing", "sleeping", "eating", "sitting quietly"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the possessive word (my, your, his, her, its, our, their) for the word in brackets.";
const BW = (cue, key) => `A noun comes after the gap, so ${cue} changes to ${key}.`;
const BUILD = [
  ["my", "I", "______ (I) name is {name}, and I am from {city}.",
    { name: ["Lola", "Aziz", "Madina", "Timur"], city: ["Bukhara", "Namangan", "Termez", "Navoi"] }],
  ["his", "he", "Aziz lives with ______ (he) {who} in {city}.",
    { who: ["parents", "grandparents", "uncle", "family"], city: ["Samarkand", "Fergana", "Nukus", "Kokand"] }],
  ["her", "she", "Kamila is talking to ______ (she) {who} {where}.",
    { who: ["mother", "best friend", "grandmother", "sister"], where: ["on the phone", "in the kitchen", "in the garden", "at the door"] }],
  ["our", "we", "We visit ______ (we) {who} in {city} every summer.",
    { who: ["grandparents", "aunt", "cousins", "uncle"], city: ["Khiva", "Andijan", "Jizzakh", "Chirchiq"] }],
  ["their", "they", "The children are playing with ______ (they) {toy} in the {place}.",
    { toy: ["ball", "dog", "new toys", "kite"], place: ["yard", "park", "garden", "street"] }],
  ["your", "you", "Is this ______ (you) {thing}? It was on the {place}.",
    { thing: ["umbrella", "jacket", "scarf", "hat"], place: ["chair", "floor", "bus", "desk"] }],
  ["its", "it", "The dog is eating ______ (it) {food} in the {place}.",
    { food: ["dinner", "food", "meat", "breakfast"], place: ["kitchen", "yard", "garden", "corner"] }],
  ["his", "he", "My father washes ______ (he) car every {day} in the {place}.",
    { day: ["Sunday", "Saturday", "week", "weekend"], place: ["yard", "street", "garage", "car wash"] }],
  ["her", "she", "Mrs Rakhimova checks ______ (she) students' homework {when}.",
    { when: ["every evening", "every day", "after class", "on Fridays"] }],
  ["my", "I", "I always do ______ (I) homework {when} in the {room}.",
    { when: ["after dinner", "in the evening", "after school", "before dinner"], room: ["kitchen", "living room", "bedroom", "library"] }],
  ["their", "they", "Sardor and Jasur are brothers. ______ (they) father is a {job} in {city}.",
    { job: ["driver", "doctor", "teacher", "builder"], city: ["Tashkent", "Bukhara", "Karshi", "Urgench"] }],
  ["its", "it", "Our {town} is proud of ______ (it) {thing}.",
    { town: ["town", "city", "village", "home town"], thing: ["old market", "big park", "football team", "new stadium"] }],
  ["your", "you", "Do you like ______ (you) new {thing}, {name}?",
    { thing: ["school", "teacher", "phone", "flat"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["your", "you", "{name}, please put ______ (you) {thing} in the {place}.",
    { name: ["Lola", "Bobur", "Aziz", "Madina"], thing: ["bag", "coat", "shoes", "books"], place: ["cupboard", "hall", "corner", "box"] }],
  ["our", "we", "Malika and I love ______ (we) {who}. They are very {adj}.",
    { who: ["neighbours", "teachers", "grandparents", "cousins"], adj: ["kind", "funny", "friendly", "helpful"] }],
  ["his", "he", "My uncle sells ______ (he) {things} at the market in {city}.",
    { things: ["fruit", "vegetables", "honey", "carpets"], city: ["Andijan", "Samarkand", "Namangan", "Margilan"] }],
  ["her", "she", "Grandma keeps ______ (she) {thing} in a small box under the {place}.",
    { thing: ["money", "rings", "old photos", "letters"], place: ["bed", "sofa", "table", "stairs"] }],
  ["their", "they", "The students are waiting for ______ (they) {who} outside the {place}.",
    { who: ["teacher", "bus", "coach", "parents"], place: ["school", "museum", "library", "gym"] }],
  ["its", "it", "The {tree} in the yard is old, and ______ (it) {part} are very big.",
    { tree: ["tree", "old tree", "walnut tree", "plane tree"], part: ["branches", "leaves", "roots"] }],
  ["our", "we", "We can't find ______ (we) {thing}. Is it in the car, {name}?",
    { thing: ["map", "key", "passport", "umbrella"], name: ["Mum", "Dad", "Aziz", "Lola"] }],
].map(([key, cue, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: BW(cue, key), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const POSS = "Use a possessive word (my, your, his, her, its, our, their) instead of the name with 's.";
const TRANSFORM = [
  // correct the wrong form (5)
  [COR, "my", "This is me {thing}. I {got} it yesterday.", "This is ______ {thing}. I {got} it yesterday.",
    "Before a noun, use my, not me.", { thing: ["bag", "phone", "watch", "bike"], got: ["bought", "got", "chose", "found"] }],
  [COR, "His", "This is my cousin. He name is {name}, and he lives in {city}.", "This is my cousin. ______ name is {name}, and he lives in {city}.",
    "Before a noun, use his, not he.", { name: ["Ali", "Sardor", "Anvar", "Rustam"], city: ["Fergana", "Nukus", "Kazan", "Almaty"] }],
  [COR, "Their", "My neighbours are nice. Them house has a {feature} and a {feature2}.", "My neighbours are nice. ______ house has a {feature} and a {feature2}.",
    "Before a noun, use their, not them.", { feature: ["big garden", "nice yard", "blue gate", "small pool"], feature2: ["garage", "balcony", "tall tree", "red roof"] }],
  [COR, "its", "The cat drinks it's milk in the {place} every {when}.", "The cat drinks ______ milk in the {place} every {when}.",
    "It's means it is. For something that belongs to it, use its.", { place: ["kitchen", "hall", "yard", "corner"], when: ["morning", "evening", "day", "night"] }],
  [COR, "our", "We like us {who}. She is very {adj}.", "We like ______ {who}. She is very {adj}.",
    "Before a noun, use our, not us.", { who: ["teacher", "coach", "neighbour", "doctor"], adj: ["kind", "funny", "patient", "friendly"] }],
  // name's -> possessive word (5)
  [POSS, "his", "This is Aziz's {thing}. He uses it {when}.", "This is ______ {thing}. He uses it {when}.",
    "Aziz is a boy, so Aziz's becomes his.", { thing: ["bike", "laptop", "ball", "camera"], when: ["every day", "at school", "on weekends", "for school"] }],
  [POSS, "Her", "Lola is my friend. Lola's {who} is a {job}.", "Lola is my friend. ______ {who} is a {job}.",
    "Lola is a girl, so Lola's becomes her.", { who: ["mother", "father", "aunt", "brother"], job: ["doctor", "driver", "teacher", "cook"] }],
  [POSS, "Their", "My grandparents have a dog. My grandparents' dog is {adj} and {adj2}.", "My grandparents have a dog. ______ dog is {adj} and {adj2}.",
    "My grandparents are two people, so my grandparents' becomes their.", { adj: ["big", "old", "small", "friendly"], adj2: ["brown", "white", "quiet", "black"] }],
  [POSS, "Its", "Our school has a new gym. The school's gym is {adj} and has {things}.", "Our school has a new gym. ______ gym is {adj} and has {things}.",
    "The school is a thing, so the school's becomes its.", { adj: ["big", "bright", "modern", "clean"], things: ["new balls", "big windows", "modern machines", "two basketball hoops"] }],
  [POSS, "Our", "We are the Karimov family. The Karimov family's flat is on the {n} floor, and it has {rooms} rooms.", "We are the Karimov family. ______ flat is on the {n} floor, and it has {rooms} rooms.",
    "We are the Karimov family, so the Karimov family's becomes our.", { n: ["second", "fourth", "sixth", "eighth"], rooms: ["two", "three", "four", "five"] }],
  // change the subject, then the possessive (5)
  ["Change I to She.", "her", "I love my {pet}. I play with it every {when}.", "She loves ______ {pet}. She plays with it every {when}.",
    "The owner is now she, so my changes to her.", { pet: ["cat", "dog", "rabbit", "parrot"], when: ["day", "evening", "morning", "weekend"] }],
  ["Change I to They.", "their", "I do my homework in the {room} {when}.", "They do ______ homework in the {room} {when}.",
    "The owner is now they, so my changes to their.", { room: ["kitchen", "living room", "bedroom", "garden"], when: ["after school", "every evening", "after dinner", "on Sundays"] }],
  ["Change She to He.", "his", "She washes her {thing} every {when}.", "He washes ______ {thing} every {when}.",
    "The owner is now he, so her changes to his.", { thing: ["car", "bike", "motorbike", "school shoes"], when: ["Sunday", "weekend", "week", "Saturday"] }],
  ["Change He to We.", "our", "He visits his {who} in {city} every summer.", "We visit ______ {who} in {city} every summer.",
    "The owner is now we, so his changes to our.", { who: ["grandparents", "aunt", "uncle", "cousins"], city: ["Khiva", "Termez", "Kokand", "Samarkand"] }],
  ["Change They to I.", "my", "They call their {who} every {when}.", "I call ______ {who} every {when}.",
    "The owner is now I, so their changes to my.", { who: ["grandmother", "parents", "uncle", "best friend"], when: ["evening", "Sunday", "day", "weekend"] }],
].map(([instr, key, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about your name and your age.", "my name / my age", ["exactly one sentence", "must use my", "my before a noun"]],
  ["Write one sentence about a friend's family. Use his or her.", "his / her + noun", ["exactly one sentence", "must use his or her", "a family word after it"]],
  ["Write one sentence about your family's home. Use our.", "our + noun", ["exactly one sentence", "must use our", "must say something about the home"]],
  ["Write one sentence about your neighbours or your grandparents. Use their.", "their + noun", ["exactly one sentence", "must use their", "a noun after their"]],
  ["Write one sentence about an animal and something that belongs to it. Use its.", "its + noun", ["exactly one sentence", "must use its, not it's", "must name an animal"]],
  ["Ask a new classmate one question with your.", "your + noun", ["exactly one question", "must use your", "must end with a question mark"]],
  ["Write one sentence about your favourite thing at home.", "my favourite + noun", ["exactly one sentence", "must use my", "must name the thing"]],
  ["Write three short sentences about three people in your family and one thing each of them has.", "my / his / her / their", ["exactly three sentences", "a possessive word in each", "no me, him or them before a noun"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Introduce your family: say each person's name, age and job.",
    "my / his / her + noun", ["my mother / my father", "his name / her name", "a possessive before every noun it owns"]],
  ["Describe your room: what is in it and whose things are they?",
    "my / our / his / her", ["my + noun", "a brother's or sister's things with his / her", "no me / him before a noun"]],
  ["Write about your best friend and their family in three or four sentences.",
    "his / her / their", ["his or her for the friend", "their for the family", "names of family members"]],
  ["Describe your school or your town and the things it has.",
    "our / its", ["our school / our town", "its + noun", "its, not it's"]],
  ["Write a short message to a pen friend about your home and your family.",
    "possessive determiners", ["my and our", "his / her for family members", "three or more possessive words"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.possessive.possessive-determiners.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);