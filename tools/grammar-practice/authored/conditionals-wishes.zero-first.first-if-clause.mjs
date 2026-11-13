// Hand-authored: conditionals-wishes / zero-first / first-if-clause (A2).
// Speaking Pack batch 2, topic 11 (grammar-run/SPEAK-2.md).
//
// Tests ONE point (both placement items): in a first conditional the IF-CLAUSE
// takes the present simple, never will ("If it is sunny tomorrow", not "If it
// will be sunny"). The result clause is always PRINTED with will, so the blank
// is always in the if-clause.
//
// Triage: kept, and kept apart from first-will (topic 12), which blanks the
// result clause and prints the if-clause. Nothing here asks for will.
//
// Distractors: will + verb (the transfer error: Uzbek/Russian use a future
// form after "agar / если"), the past (second-conditional form, wrong next to
// a will-result), would + verb, and the -s mistake (he pass / we passes).
// Present continuous is never offered ("If it's raining when you arrive" is
// correct English), and neither is "be going to" ("If it's going to rain...").
//
// Run: node tools/grammar-practice/authored/conditionals-wishes.zero-first.first-if-clause.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "conditionals-wishes", branch: "zero-first", topic: "first-if-clause", level: "A2", pv: "2.5" };
const why = (form) => `After if, use the present simple for the future: if ... ${form}. Don't use will after if; will goes in the other part of the sentence.`;

/* ---------------- choose: 20 mcq ---------------- */
// option builders (key first)
const SG = (s, v, past) => [s, `will ${v}`, v, past];
const PL = (v, past) => [v, `will ${v}`, `would ${v}`, past];
const CHOOSE = [
  [SG("passes", "pass", "passed"), "If {name} ______ the exam, her parents will buy her a {gift}.",
    { name: ["Madina", "Zarina", "Olga", "Sevara"], gift: ["bike", "phone", "laptop", "new dress"] }],
  [SG("rains", "rain", "rained"), "We will play {game} at home if it ______ on {day}.",
    { game: ["chess", "cards", "video games", "board games"], day: ["Saturday", "Sunday", "Friday", "Monday"] }],
  [PL("leave", "left"), "If we ______ now, we will catch the {transport}.",
    { transport: ["bus", "train", "metro", "last bus"] }],
  [["is", "will be", "be", "was"], "If the weather ______ nice on {day}, we will have a picnic in the {place}.",
    { day: ["Saturday", "Sunday", "Friday", "Navruz"], place: ["park", "garden", "mountains", "yard"] }],
  [["doesn't do", "won't do", "don't do", "didn't do"], "If {name} ______ his {subject} homework, the teacher will be angry.",
    { name: ["Timur", "Sardor", "Ilya", "Bekzod"], subject: ["maths", "English", "history", "physics"] }],
  [PL("find", "found"), "I will call you if I ______ your {thing} in the {place}.",
    { thing: ["keys", "phone", "glasses", "wallet"], place: ["car", "kitchen", "classroom", "garden"] }],
  [SG("comes", "come", "came"), "If the {transport} ______ late again, I will {act}.",
    { transport: ["bus", "train", "minibus", "tram"], act: ["take a taxi", "walk", "call my father", "ride my bike"] }],
  [["are", "will be", "be", "were"], "If the tickets ______ cheap, we will go to the {event} in {city}.",
    { event: ["concert", "football match", "show", "festival"], city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  [["don't wear", "won't wear", "doesn't wear", "didn't wear"], "If you ______ a {coat}, you will be cold {where}.",
    { coat: ["coat", "jacket", "warm hat", "scarf"], where: ["in the mountains", "at the stadium", "outside", "at the bus stop"] }],
  [SG("finishes", "finish", "finished"), "My {who} will make {food} tonight if she ______ work early.",
    { who: ["mother", "aunt", "grandmother", "sister"], food: ["plov", "manti", "lagman", "soup"] }],
  [PL("have", "had"), "If I ______ time after {thing}, I will help you with your {task}.",
    { thing: ["school", "lessons", "training", "work"], task: ["homework", "project", "essay", "English"] }],
  [SG("snows", "snow", "snowed"), "If it ______ tonight, the children will build a snowman in the {place}.",
    { place: ["yard", "park", "garden", "street"] }],
  [SG("wins", "win", "won"), "If our {team} ______ on {day}, we will celebrate at {place}.",
    { team: ["team", "football team", "volleyball team", "class team"], day: ["Saturday", "Sunday", "Friday", "Tuesday"], place: ["the café", "home", "my house", "school"] }],
  [["isn't", "won't be", "aren't", "wasn't"], "If the {shop} ______ open on Sunday, we will go on Monday.",
    { shop: ["bakery", "bank", "pharmacy", "post office"] }],
  [PL("get", "got"), "You will feel {adj} tomorrow if you ______ some {thing} tonight.",
    { adj: ["better", "stronger", "happier"], thing: ["sleep", "rest", "fresh air"] }],
  [SG("calls", "call", "called"), "If {name} ______ me tonight, I will tell her the {news}.",
    { name: ["Dilnoza", "Anna", "Kamola", "Nilufar"], news: ["news", "good news", "plan", "answer"] }],
  [PL("see", "saw"), "If we ______ Aziz at the {place}, we will give him his {thing}.",
    { place: ["bazaar", "metro", "stadium", "library"], thing: ["book", "keys", "phone", "bag"] }],
  [["costs", "will cost", "cost", "costed"], "I will buy the {thing} if it ______ less than {price} sum.",
    { thing: ["jacket", "watch", "book", "bag"], price: ["100,000", "200,000", "50,000", "300,000"] }],
  [["aren't", "won't be", "isn't", "weren't"], "If you ______ busy {when}, we will go to the {place} together.",
    { when: ["tomorrow", "on Friday", "this evening", "on Saturday"], place: ["cinema", "museum", "park", "bazaar"] }],
  [PL("arrive", "arrived"), "If my {who} ______ early, we will have dinner at {time}.",
    { who: ["parents", "cousins", "grandparents", "guests"], time: ["six", "seven", "half past six", "eight"] }],
].map(([options, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: why(options[0]), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete the sentence with the right form of the verb in brackets.";
const BUILD = [
  ["passes", "If {name} ______ (pass) her driving test, she will drive us to {city}.",
    { name: ["Malika", "Irina", "Gulnora", "Shahzoda"], city: ["Samarkand", "Bukhara", "Chimgan", "Fergana"] }],
  ["rains", "If it ______ (rain) on {day}, we will play {game} at home.",
    { day: ["Saturday", "Sunday", "Friday", "Wednesday"], game: ["chess", "cards", "video games", "board games"] }],
  ["doesn't come", "We will be late if the {transport} ______ (not come) {when}.",
    { transport: ["bus", "train", "minibus", "taxi"], when: ["soon", "in five minutes", "now", "in ten minutes"] }],
  ["study", "If you ______ (study) hard, you will pass the {exam} in {month}.",
    { exam: ["exam", "English test", "IELTS exam", "maths test"], month: ["May", "June", "December", "March"] }],
  ["finds", "If my {who} ______ (find) a job in {city}, he will move there.",
    { who: ["brother", "uncle", "cousin", "father"], city: ["Tashkent", "Moscow", "Seoul", "Almaty"] }],
  ["come", "I will be happy if my {who} ______ (come) to my birthday party on {day}.",
    { who: ["friends", "cousins", "grandparents", "classmates"], day: ["Saturday", "Sunday", "Friday", "Tuesday"] }],
  ["is", "If the water ______ (be) warm, the children will swim in the {place} {when}.",
    { place: ["river", "lake", "sea", "pool"], when: ["tomorrow", "on Sunday", "this afternoon", "after lunch"] }],
  ["doesn't hurry", "If {name} ______ (not hurry), she will miss the {transport}.",
    { name: ["Sevara", "Anna", "Madina", "Nodira"], transport: ["bus", "train", "metro", "first lesson"] }],
  ["leave", "If we ______ (leave) at {time}, we will arrive in {city} before dark.",
    { time: ["six", "seven", "eight", "half past six"], city: ["Bukhara", "Khiva", "Samarkand", "Termez"] }],
  ["buy", "My father will cook {food} if we ______ (buy) meat at the {place}.",
    { food: ["plov", "shashlik", "lagman", "manti"], place: ["bazaar", "market", "shop", "supermarket"] }],
  ["get", "If I ______ (get) a good mark in {subject}, my mother will make {food}.",
    { subject: ["maths", "English", "history", "chemistry"], food: ["a cake", "plov", "my favourite soup", "samsa"] }],
  ["has", "If {name} ______ (have) a cold {when}, he will stay in bed.",
    { name: ["Jasur", "Pavel", "Sanjar", "Doniyor"], when: ["tomorrow", "on Monday", "next week", "on the day of the trip"] }],
  ["sells", "If the {shop} ______ (sell) {thing}, I will buy some for my grandmother.",
    { shop: ["shop", "bazaar", "corner shop", "market"], thing: ["honey", "dried apricots", "walnuts", "raisins"] }],
  ["don't understand", "If you ______ (not understand) the {task}, the teacher will help you {when}.",
    { task: ["task", "rule", "homework", "question"], when: ["after class", "in the break", "after school", "at the end"] }],
  ["is", "If it ______ (be) cold {when}, we will light the {thing}.",
    { when: ["tonight", "this evening", "tomorrow night", "at the weekend"], thing: ["stove", "fire"] }],
  ["win", "If they ______ (win) the match on {day}, the whole {group} will celebrate.",
    { day: ["Saturday", "Sunday", "Friday", "Thursday"], group: ["school", "class", "city", "street"] }],
  ["works", "If my {device} ______ (work) again, I will send you the {thing}.",
    { device: ["phone", "laptop", "computer", "tablet"], thing: ["photos", "video", "address", "files"] }],
  ["are", "If the {who} ______ (be) late, we will start without them {when}.",
    { who: ["guests", "others", "boys", "students"], when: ["at seven", "at six", "after ten minutes", "at eight"] }],
  ["calls", "If {name} ______ (call) tonight, I will ask about the {thing}.",
    { name: ["Kamola", "Olga", "Dilnoza", "Zarina"], thing: ["party", "homework", "trip", "wedding"] }],
  ["see", "If I ______ (see) your {who} in the {place}, I will say hello.",
    { who: ["sister", "brother", "parents", "grandmother"], place: ["street", "bazaar", "park", "metro"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: why(key), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences into one sentence with if.";
const PERSON = "Rewrite the sentence about the new person. Change the verb after if.";
const FIX = "There is a mistake after if. Rewrite the sentence correctly.";
const whyJ = (form) => `Maybe ... then ... becomes a first conditional. After if, use the present simple, not will: ${form}.`;
const whyP = (form) => `With he or she, the present simple after if takes -s: ${form}.`;
const whyF = (form) => `After if, use the present simple, not will: ${form}. Keep will in the other part.`;
const TRANSFORM = [
  [JOIN, "Maybe it will rain on {day}. Then we will watch a film at {whose} house.", "If it ______ on {day}, we will watch a film at {whose} house.", "rains", whyJ("if it rains"),
    { day: ["Saturday", "Sunday", "Friday", "Monday"], whose: ["Aziz's", "my", "Olga's", "Timur's"] }],
  [JOIN, "Maybe {name} will come. Then we will play {game}.", "If {name} ______, we will play {game}.", "comes", whyJ("if he comes"),
    { name: ["Sardor", "Anton", "Rustam", "Laziz"], game: ["chess", "football", "cards", "volleyball"] }],
  [JOIN, "Maybe the {transport} will be late. Then I will walk {where}.", "If the {transport} ______ late, I will walk {where}.", "is", whyJ("if the bus is late"),
    { transport: ["bus", "tram", "minibus", "train"], where: ["home", "there", "with my friends", "with my sister"] }],
  [JOIN, "Maybe you will feel tired after {thing}. Then you will go to bed early.", "If you ______ tired after {thing}, you will go to bed early.", "feel", whyJ("if you feel"),
    { thing: ["the trip", "training", "work", "the exam"] }],
  [JOIN, "Maybe my parents will buy a car. Then we will drive to {city} in {month}.", "If my parents ______ a car, we will drive to {city} in {month}.", "buy", whyJ("if my parents buy"),
    { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], month: ["July", "August", "June", "September"] }],
  [PERSON, "If I finish {thing} early, I will call you.", "If my {who} ______ {thing} early, she will call you.", "finishes", whyP("if she finishes"),
    { thing: ["work", "school", "lessons", "training"], who: ["sister", "mother", "aunt", "cousin"] }],
  [PERSON, "If we miss the {transport}, we will take a taxi.", "If {name} ______ the {transport}, he will take a taxi.", "misses", whyP("if he misses"),
    { transport: ["bus", "train", "metro", "last bus"], name: ["Timur", "Aziz", "Ilya", "Bobur"] }],
  [PERSON, "If you don't like the {food}, you will cook something else.", "If my {who} ______ the {food}, he will cook something else.", "doesn't like", whyP("if he doesn't like (does + not, no -s on like)"),
    { food: ["soup", "plov", "salad", "fish"], who: ["brother", "father", "uncle", "cousin"] }],
  [PERSON, "If they go to {city}, they will visit the old town.", "If {name} ______ to {city}, she will visit the old town.", "goes", whyP("if she goes"),
    { city: ["Bukhara", "Khiva", "Samarkand", "Shahrisabz"], name: ["Madina", "Olga", "Sevara", "Malika"] }],
  [PERSON, "If we have time {when}, we will visit our {who}.", "If my father ______ time {when}, he will visit his {who}.", "has", whyP("if he has"),
    { when: ["tomorrow", "on Sunday", "this weekend", "after work"], who: ["parents", "brother", "sister", "friends"] }],
  [FIX, "If it will be sunny {when}, we will go to the {place}.", "If it ______ sunny {when}, we will go to the {place}.", "is", whyF("if it is sunny"),
    { when: ["tomorrow", "on Sunday", "this weekend", "on Friday"], place: ["lake", "mountains", "park", "river"] }],
  [FIX, "If she will call me {when}, I will tell her about the {thing}.", "If she ______ me {when}, I will tell her about the {thing}.", "calls", whyF("if she calls"),
    { when: ["tonight", "today", "after school", "this evening"], thing: ["party", "trip", "homework", "wedding"] }],
  [FIX, "If you will come early, we will cook {food} together in the {room}.", "If you ______ early, we will cook {food} together in the {room}.", "come", whyF("if you come"),
    { food: ["plov", "manti", "samsa", "soup"], room: ["kitchen", "yard", "garden"] }],
  [FIX, "If he will not study, he will fail the {exam} in {month}.", "If he ______, he will fail the {exam} in {month}.", "doesn't study", whyF("if he doesn't study"),
    { exam: ["exam", "test", "maths test", "English exam"], month: ["May", "June", "January", "December"] }],
  [FIX, "If our {team} will win on {day}, the fans will dance in the streets.", "If our {team} ______ on {day}, the fans will dance in the streets.", "wins", whyF("if our team wins"),
    { team: ["team", "football team", "volleyball team", "basketball team"], day: ["Saturday", "Sunday", "Friday", "Wednesday"] }],
].map(([instr, source, hint, key, w, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: w, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Finish this sentence: If it rains tomorrow, ...", "present simple after if + will", ["exactly one sentence", "if-clause with rains", "result with will"]],
  ["Write one sentence about what you will do if you have free time this weekend.", "if + present simple", ["exactly one sentence", "must start with If I have", "no will after if"]],
  ["Write one sentence about what will happen if you are late for school or work.", "if + be in the present", ["exactly one sentence", "if I am late", "will in the result"]],
  ["Write one sentence about a friend: what will he or she do if he or she passes an exam?", "if + he/she + -s", ["exactly one sentence", "verb after if ends in -s", "will in the result"]],
  ["Write one sentence with if and don't or doesn't.", "negative present after if", ["exactly one sentence", "don't or doesn't after if", "no won't after if"]],
  ["Write one sentence about what your family will do if the weather is good on Sunday.", "if the weather is", ["exactly one sentence", "must name a place", "no will after if"]],
  ["Write one sentence about what you will buy if you find something cheap at the bazaar.", "if + present simple", ["exactly one sentence", "must name a thing", "no will after if"]],
  ["Write two sentences: one plan for tomorrow if it is sunny, one if it rains.", "two if-clauses in the present", ["exactly two sentences", "if it is sunny", "if it rains"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Talk about your plans for the weekend. What will you do if the weather is good, and what will you do if it is bad? Write three or four sentences.",
    "first conditional if-clauses", ["present simple after if", "no will after if", "will in the result"]],
  ["Imagine you pass your English exam this year. What will happen? Write three or four sentences with if.",
    "if + present simple for future events", ["if I pass", "no will after if", "at least two results"]],
  ["Give advice to a friend before a trip to the mountains. Write three or four sentences with if.",
    "if-clauses for warnings", ["if you don't ...", "present simple after if", "you will ..."]],
  ["Talk about a family member's plans. What will he or she do if something happens? Write three or four sentences.",
    "if + he/she + -s", ["-s after he or she in the if-clause", "no will after if", "will in the result"]],
  ["Describe what you will do this evening if you finish your homework early. Write three or four sentences.",
    "if + present simple for a plan", ["if I finish", "two or more plans", "no will after if"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/conditionals-wishes.zero-first.first-if-clause.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);