// Hand-authored: nouns-articles / countability / uncountable-no-plural (A1).
//
// Tests ONE point: an uncountable noun takes no plural -s and no a/an
// (homework, advice, music, rice, furniture). Placement focus also names
// 'advice' has no plural form, so advice appears in every stage.
//
// Nouns are chosen so that no distractor is something a native speaker says:
// bread (breads), water (a water), cheese, juice, tea, sugar (two sugars) and
// money (monies) are left out of choose.
// Choose options: some + noun (correct), a + noun (L1 transfer: Uzbek "bir"),
// noun + s, and some + noun + s.
// Build mixes countable nouns after a number (key = plural) with uncountable
// nouns (key = no -s), so the student must decide every time.
//
// Run: node tools/grammar-practice/authored/nouns-articles.countability.uncountable-no-plural.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "countability", topic: "uncountable-no-plural", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const U = (n) => `${n[0].toUpperCase()}${n.slice(1)} is uncountable: no a/an and no -s. Say some ${n}.`;
const OPTS = (n) => [`some ${n}`, `a ${n}`, `${n}s`, `some ${n}s`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["homework", "We have ______ for {subject} today, {name}.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["homework", "The teacher gave the {group} ______ on {day}.", { group: ["class", "students", "children", "team"], day: ["Monday", "Tuesday", "Thursday", "Friday"] }],
  ["homework", "{name} still has ______ to do after {activity}.", { name: NAME, activity: ["football", "dinner", "the lesson", "the film"] }],
  ["homework", "I did ______ on the {transport} to {city}.", { transport: ["bus", "train", "minibus", "plane"], city: CITY }],
  ["advice", "My grandmother gave me ______ about {topic}, {name}.", { topic: ["cooking", "school", "money", "friends"], name: NAME }],
  ["advice", "Can you give {who} ______ about {topic}?", { who: ["me", "us", "my sister", "the new student"], topic: ["the exam", "the trip", "the job", "English"] }],
  ["advice", "{name} needs ______ before the {event}.", { name: NAME, event: ["exam", "interview", "match", "trip"] }],
  ["advice", "Our teacher in {city} has ______ for the {group}.", { city: CITY, group: ["class", "new students", "team", "parents"] }],
  ["advice", "I want ______ from {who}, {name}.", { who: ["my dad", "the doctor", "my teacher", "my big brother"], name: NAME }],
  ["music", "Let's listen to ______ in the {place}, {name}.", { place: ["car", "kitchen", "garden", "living room"], name: NAME }],
  ["music", "{name} plays ______ at {event} every year.", { name: NAME, event: ["weddings", "Navruz", "school parties", "the summer camp"] }],
  ["music", "There is ______ in the {place} in {city} tonight.", { place: ["park", "square", "theatre", "old town"], city: CITY }],
  ["music", "I want to download ______ for the trip to {city}, {name}.", { city: CITY, name: NAME }],
  ["rice", "Mum cooked ______ with {food} for {meal}.", { food: ["vegetables", "chicken", "carrots", "beans"], meal: ["lunch", "dinner", "the guests", "us"] }],
  ["rice", "Please buy ______ at the {shop}, {name}.", { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  ["rice", "There is ______ in the {place}, {name}.", { place: ["pot", "bag", "cupboard", "kitchen"], name: NAME }],
  ["rice", "We need ______ for the plov on {day}.", { day: ["Friday", "Saturday", "Sunday", "Navruz"] }],
  ["furniture", "{name}'s parents bought ______ for the new {room}.", { name: NAME, room: ["flat", "house", "bedroom", "kitchen"] }],
  ["furniture", "There is ______ in the {place} in {city}.", { place: ["shop window", "yard", "hall", "old house"], city: CITY }],
  ["furniture", "We sold ______ before we moved to {city}, {name}.", { city: CITY, name: NAME }],
].map(([n, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS(n), key: 0, why: U(n), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the word in brackets. Add -s only if you can count it.";
const C = (n, pl) => `You can count a ${n}, and the number makes it plural: ${pl}.`;
const B = (n) => `${n[0].toUpperCase()}${n.slice(1)} is uncountable, so it never takes -s.`;
const BUILD = [
  ["homework", null, "{name} has a lot of ______ (homework) this {time}.", { name: NAME, time: ["week", "weekend", "month", "evening"] }],
  ["book", "books", "{name} bought three ______ (book) in {city}.", { name: NAME, city: CITY }],
  ["advice", null, "The doctor gave {who} some good ______ (advice) about {topic}.", { who: ["me", "us", "my dad", "Grandma"], topic: ["sleep", "sport", "food", "water"] }],
  ["song", "songs", "We sang four ______ (song) at the {event}, {name}.", { event: ["party", "wedding", "concert", "camp"], name: NAME }],
  ["music", null, "I listen to ______ (music) on the {transport} to {place}.", { transport: ["bus", "metro", "train", "minibus"], place: ["school", "work", "college", "the university"] }],
  ["chair", "chairs", "We need six ______ (chair) for the guests, {name}. They come on {day}.", { name: NAME, day: ["Friday", "Saturday", "Sunday", "Navruz"] }],
  ["rice", null, "Can you cook some ______ (rice) for {meal}, {name}?", { meal: ["lunch", "dinner", "the guests", "us"], name: NAME }],
  ["apple", "apples", "{name} put five ______ (apple) in the {place}.", { name: NAME, place: ["bag", "box", "basket", "bowl"] }],
  ["furniture", null, "There is a lot of old ______ (furniture) in {name}'s {room}.", { name: NAME, room: ["house", "flat", "garage", "village house"] }],
  ["bag", "bags", "Aunt {name} has two ______ (bag) for the trip to {city}.", { name: ["Dilnoza", "Olga", "Malika", "Nigora"], city: CITY }],
  ["homework", null, "Our {subject} teacher never gives ______ (homework) on {day}.", { subject: ["maths", "English", "art", "music"], day: ["Friday", "Saturday", "holidays", "Navruz"] }],
  ["lesson", "lessons", "{name} has five ______ (lesson) at {place} on Monday.", { name: NAME, place: ["school", "college", "the language centre", "university"] }],
  ["advice", null, "{name}'s big brother always gives useful ______ (advice) about {topic}.", { name: NAME, topic: ["phones", "football", "exams", "jobs"] }],
  ["ticket", "tickets", "We bought two ______ (ticket) for the {transport} to {city}.", { transport: ["train", "bus", "plane", "minibus"], city: CITY }],
  ["music", null, "There was loud ______ (music) at the {event} in {city}.", { event: ["party", "wedding", "concert", "festival"], city: CITY }],
  ["egg", "eggs", "Mum needs six ______ (egg) for the {food}, {name}.", { food: ["cake", "breakfast", "salad", "pancakes"], name: NAME }],
  ["rice", null, "We bought a big bag of ______ (rice) at the {shop}, {name}.", { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  ["table", "tables", "There are ten ______ (table) in the {place} in {city}.", { place: ["café", "classroom", "restaurant", "hall"], city: CITY }],
  ["furniture", null, "Uncle {name} makes wooden ______ (furniture) in {city}.", { name: ["Rustam", "Ivan", "Timur", "Bobur"], city: CITY }],
  ["friend", "friends", "{name} went to the {place} with three ______ (friend).", { name: NAME, place: ["park", "cinema", "lake", "mountains"] }],
].map(([n, pl, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: pl || n, why: pl ? C(n, pl) : B(n), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_S = "The first sentence has a mistake. Complete the correct sentence.";
const T_A = "The first sentence has a mistake with a/an. Complete the correct sentence with one word.";
const T_MIX = "Now there is more. Complete the second sentence with the words in brackets.";
const TRANSFORM = [
  // kind 1: remove -s
  [T_S, "{name} has two homeworks for {day}.", "{name} has a lot of ______ for {day}.", "homework", B("homework"), { name: NAME, day: ["Monday", "Tuesday", "tomorrow", "Friday"] }],
  [T_S, "My dad gave me two advices about {topic}, {name}.", "My dad gave me some ______ about {topic}, {name}.", "advice", B("advice"), { topic: ["money", "school", "sport", "jobs"], name: NAME }],
  [T_S, "We listened to musics in the {place} in {city}.", "We listened to ______ in the {place} in {city}.", "music", B("music"), { place: ["car", "park", "café", "garden"], city: CITY }],
  [T_S, "There are many furnitures in the {place}, {name}.", "There is a lot of ______ in the {place}, {name}.", "furniture", B("furniture"), { place: ["shop", "hall", "old house", "office"], name: NAME }],
  [T_S, "Grandma cooked rices with {food} for {meal}.", "Grandma cooked ______ with {food} for {meal}.", "rice", B("rice"), { food: ["carrots", "chicken", "beans", "vegetables"], meal: ["lunch", "dinner", "us", "the guests"] }],
  // kind 2: a -> some
  [T_A, "Can you give me an advice about {topic}, {name}?", "Can you give me ______ advice about {topic}, {name}?", "some", "Advice is uncountable, so you can't use an. Use some.", { topic: ["the exam", "the trip", "English", "my phone"], name: NAME }],
  [T_A, "{name} has a homework for {subject}.", "{name} has ______ homework for {subject}.", "some", "Homework is uncountable, so you can't use a. Use some.", { name: NAME, subject: ["maths", "English", "history", "science"] }],
  [T_A, "Let's play a music at the {event}, {name}.", "Let's play ______ music at the {event}, {name}.", "some", "Music is uncountable, so you can't use a. Use some.", { event: ["party", "picnic", "wedding", "camp"], name: NAME }],
  [T_A, "We bought a furniture for the {room} in {city}.", "We bought ______ furniture for the {room} in {city}.", "some", "Furniture is uncountable, so you can't use a. Use some.", { room: ["flat", "kitchen", "bedroom", "office"], city: CITY }],
  [T_A, "Mum wants a rice from the {shop}, {name}.", "Mum wants ______ rice from the {shop}, {name}.", "some", "Rice is uncountable, so you can't use a. Use some.", { shop: ["market", "bazaar", "shop", "supermarket"], name: NAME }],
  // kind 3: countable + uncountable in one sentence
  [T_MIX, "There is one book on {name}'s {place}.", "There are three ______ (book) and some ______ (homework) on {name}'s {place}.", ["books", "homework"], "Book is countable, so three books. Homework is uncountable: no -s.", { name: NAME, place: ["desk", "table", "bed", "chair"] }],
  [T_MIX, "I have one bag for the trip to {city}.", "I have two ______ (bag) and some ______ (music) on my phone for the trip to {city}.", ["bags", "music"], "Bag is countable, so two bags. Music is uncountable: no -s.", { city: CITY }],
  [T_MIX, "The teacher gave {who} one book.", "The teacher gave {who} two ______ (book) and some ______ (advice).", ["books", "advice"], "Book is countable, so two books. Advice is uncountable: no -s.", { who: ["me", "us", "Aziz", "Olga"] }],
  [T_MIX, "We bought one chair for the {room}, {name}.", "We bought four ______ (chair) and some other ______ (furniture) for the {room}, {name}.", ["chairs", "furniture"], "Chair is countable, so four chairs. Furniture is uncountable: no -s.", { room: ["kitchen", "flat", "office", "classroom"], name: NAME }],
  [T_MIX, "There is one egg in the {place}, {name}.", "There are six ______ (egg) and some ______ (rice) in the {place}, {name}.", ["eggs", "rice"], "Egg is countable, so six eggs. Rice is uncountable: no -s.", { place: ["kitchen", "fridge", "cupboard", "bag"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about your homework.", "homework", ["exactly one sentence", "must use homework", "no -s on homework"]],
  ["Write one sentence about advice from your family.", "advice", ["exactly one sentence", "must use advice", "no a/an before advice"]],
  ["Write one sentence about music you like.", "music", ["exactly one sentence", "must use music"]],
  ["Ask a friend for advice. Write one question.", "advice", ["exactly one question", "must use advice"]],
  ["Write one sentence about rice and one countable food with a number.", "rice + plural noun", ["exactly one sentence", "must use rice", "must use a number"]],
  ["Write one sentence about the furniture in your room.", "furniture", ["exactly one sentence", "must use furniture"]],
  ["Write one sentence with some homework and two books.", "homework / books", ["exactly one sentence", "must use homework", "must use books"]],
  ["Write two sentences: one with advice and one with music.", "advice / music", ["exactly two sentences", "must use advice", "must use music"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about your school day. Write three or four sentences.", "uncountable nouns", ["homework", "some", "a countable noun with a number"]],
  ["A friend has an exam next week. Write three or four sentences of advice.", "uncountable nouns", ["advice", "some", "no -s on advice"]],
  ["Describe your room at home. Write three or four sentences.", "uncountable nouns", ["furniture", "There is", "There are"]],
  ["Write about a family dinner. Write three or four sentences.", "uncountable nouns", ["rice", "music", "some"]],
  ["Write about what you do in the evening. Write three or four sentences.", "uncountable nouns", ["music", "homework", "every evening"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.countability.uncountable-no-plural.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.countability.uncountable-no-plural.json`);