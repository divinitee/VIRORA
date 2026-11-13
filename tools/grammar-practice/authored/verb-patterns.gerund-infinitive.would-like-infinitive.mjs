// Hand-authored: verb-patterns / gerund-infinitive / would-like-infinitive (A2).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "would like + to-infinitive" (I would like ______ more about
// the course: learn / learning / to learn / learned). This is the polite
// "speaking" form: ordering, booking, inviting (Would you like to…?), offering
// (Would you like me to…?) and saying wishes (I'd like to…).
// Choose: 15 items pick the verb form after would like; 5 items pick the
// would like form itself with a he/she subject (would likes / would to like are
// the real errors). Distractor care: "-ing" is NOT offered after "Would you
// like" or "wouldn't like" (natives say "Would you like having a sister?",
// "I wouldn't like living there"); it is offered only after affirmative
// "I'd like / would like", where it is never right. "like to" alone (I like to…)
// and will/want are never offered: they can be right with another meaning.
// Gap texts never print "to" (the ingest echo check): would like + to is the point.
//
// Run: node tools/grammar-practice/authored/verb-patterns.gerund-infinitive.would-like-infinitive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "gerund-infinitive", topic: "would-like-infinitive", level: "A2", pv: "2.5" };

const TO = (v) => `After would like ('d like), use to + the base verb: would like to ${v}.`;
const Q = (v) => `In a question with would you like, the verb still needs to: Would you like to ${v}?`;
const NEG = (v) => `Wouldn't like is also followed by to + the base verb: wouldn't like to ${v}.`;
const OBJ = (who, v) => `To say what you want another person to do, use would like + person + to + verb: would like ${who} to ${v}. Not "would like that…".`;
const WL = "Would never changes and like never takes -s after would: he would like, she would like. Then to + verb.";

// statement options: to + base, bare base, -ing, to + wrong form
const o = (base, ing, wrong) => [`to ${base}`, base, ing, wrong];
// question / negative options: no bare -ing (it can be right there)
const q = (base, ing, s) => [`to ${base}`, base, `to ${ing}`, `to ${s}`];
// person pattern
const ob = (who, subj, base, thatClause) => [`${who} to ${base}`, thatClause, `${who} ${base}`, `${subj} to ${base}`];
const WLO = ["would like", "would likes", "would to like", "would liking"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [o("book", "booking", "to booking"), TO("book"), "I would like ______ a table for {num} {when}, please.",
    { num: ["two", "three", "four", "six"], when: ["tonight", "on Friday", "at seven", "this evening"] }],
  [q("have", "having", "has"), Q("have"), "Would you like ______ {meal} with us {when}?",
    { meal: ["dinner", "plov", "tea", "a meal"], when: ["tonight", "on Sunday", "after work", "tomorrow"] }],
  [WLO, WL, "My father ______ to speak to the {person} {when}.",
    { person: ["manager", "doctor", "director", "head teacher"], when: ["now", "today", "before lunch", "this afternoon"] }],
  [o("visit", "visiting", "to visits"), TO("visit"), "We'd like ______ {city} {when}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Shahrisabz"], when: ["next spring", "this summer", "one day", "in May"] }],
  [ob("us", "we", "visit", "that we visit"), OBJ("us", "visit"), "Grandma would like ______ her in {place} {when}.",
    { place: ["Bukhara", "Termez", "the village", "Karshi"], when: ["more often", "this summer", "next month", "at New Year"] }],
  [ob("me", "I", "carry", "that I carry"), OBJ("me", "carry"), "Would you like ______ the {thing} {where}?",
    { thing: ["bags", "box", "shopping", "suitcase"], where: ["to the car", "upstairs", "home", "to the bus stop"] }],
  [o("get", "getting", "to gets"), TO("get"), "Nigora would like ______ a {pet} {when}.",
    { pet: ["kitten", "puppy", "parrot", "rabbit"], when: ["for her birthday", "this year", "one day", "next summer"] }],
  [o("learn", "learning", "to learning"), TO("learn"), "I'd like ______ more about the {course} at your {place}.",
    { course: ["English course", "summer camp", "IT course", "art classes"], place: ["centre", "school", "college", "club"] }],
  [q("try", "trying", "tries"), Q("try"), "Would your parents like ______ my {food} {when}?",
    { food: ["plov", "cake", "soup", "salad"], when: ["now", "after dinner", "before they go", "later"] }],
  [o("take", "taking", "to took"), TO("take"), "The students would like ______ the {exam} on {day} instead.",
    { exam: ["exam", "test", "quiz", "dictation"], day: ["Monday", "Friday", "Thursday", "Tuesday"] }],
  [WLO, WL, "My sister ______ to study {subject} in {country}.",
    { subject: ["medicine", "design", "IT", "music"], country: ["Korea", "Germany", "Turkey", "Italy"] }],
  [o("see", "seeing", "to saw"), TO("see"), "We'd like ______ the {thing} before we {act}.",
    { thing: ["room", "flat", "house", "car"], act: ["pay", "decide", "sign anything", "say yes"] }],
  [q("live", "living", "lives"), NEG("live"), "I wouldn't like ______ in a {place} {how}.",
    { place: ["big city", "small village", "cold country", "flat"], how: ["far from my family", "without friends", "alone", "without a car"] }],
  [q("try", "trying", "tries"), Q("try"), "Would you like ______ this {item} on in {colour}?",
    { item: ["jacket", "dress", "shirt", "coat"], colour: ["black", "blue", "grey", "white"] }],
  [ob("us", "we", "finish", "that we finish"), OBJ("us", "finish"), "Our teacher would like ______ our {thing} by {day}.",
    { thing: ["projects", "essays", "posters", "reports"], day: ["Friday", "Monday", "Wednesday", "next week"] }],
  [o("buy", "buying", "to buying"), TO("buy"), "My mum would like ______ a new {thing} for the {room}.",
    { thing: ["carpet", "sofa", "table", "lamp"], room: ["living room", "hall", "bedroom", "guest room"] }],
  [WLO, WL, "The man at the {place} ______ to talk to you, {name}.",
    { place: ["door", "gate", "reception desk", "front desk"], name: ["Aziz", "Olga", "Malika", "Rustam"] }],
  [q("go", "going", "goes"), Q("go"), "Where would you like ______ {when}, {name}?",
    { when: ["this weekend", "on holiday", "after the exam", "tonight"], name: ["Kamila", "Sardor", "Lola", "Timur"] }],
  [o("plan", "planning", "to planned"), TO("plan"), "They'd like ______ a {thing} for {who}.",
    { thing: ["party", "surprise", "picnic", "concert"], who: ["their teacher", "Grandma", "the new students", "their coach"] }],
  [o("show", "showing", "to showed"), TO("show"), "Dilnoza would like ______ you her {thing} from {place}.",
    { thing: ["photos", "pictures", "videos", "drawings"], place: ["Bukhara", "the trip", "the camp", "Samarkand"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the correct form of the verb in brackets.";
const BUILD = [
  ["to order", TO("order"), "I'd like ______ (order) the {dish} and a {drink}, please.",
    { dish: ["plov", "chicken soup", "lagman", "fish"], drink: ["green tea", "juice", "coffee", "lemonade"] }],
  ["to come", Q("come"), "Would you like ______ (come) {how} {when}?",
    { how: ["with us", "over", "along", "round"], when: ["tonight", "on Saturday", "after school", "later"] }],
  ["to see", TO("see"), "My grandfather would like ______ (see) all his {who} {when}.",
    { who: ["grandchildren", "children", "old friends", "cousins"], when: ["on his birthday", "at New Year", "this summer", "more often"] }],
  ["to miss", NEG("miss"), "We wouldn't like ______ (miss) the {event}, so let's leave {when}.",
    { event: ["concert", "last bus", "wedding", "final"], when: ["now", "early", "at six", "soon"] }],
  ["to be", TO("be"), "Aziz would like ______ (be) a {job} in {city}.",
    { job: ["chef", "dentist", "driver", "programmer"], city: ["Tashkent", "Fergana", "Samarkand", "Nukus"] }],
  ["to study", OBJ("me", "study"), "My parents would like me ______ (study) {subject} at a university in {city}.",
    { subject: ["medicine", "law", "economics", "banking"], city: ["Tashkent", "Seoul", "Moscow", "Samarkand"] }],
  ["to open", OBJ("me", "open"), "It's {adj} in here. Would you like me ______ (open) the {thing}?",
    { adj: ["hot", "warm", "stuffy", "a bit hot"], thing: ["window", "door", "windows", "balcony door"] }],
  ["to spend", TO("spend"), "Lola would like ______ (spend) her {holiday} near the {place}.",
    { holiday: ["holiday", "summer", "weekend", "free days"], place: ["sea", "lake", "mountains", "river"] }],
  ["to join", Q("join"), "Would your brother like ______ (join) our {team} {when}?",
    { team: ["football team", "chess club", "band", "group"], when: ["this year", "next season", "on Saturday", "again"] }],
  ["to thank", TO("thank"), "I'd like ______ (thank) you for the {thing}, {name}.",
    { thing: ["present", "flowers", "help", "lovely dinner"], name: ["Madina", "Bekzod", "Olga", "Uncle Rustam"] }],
  ["to speak", TO("speak"), "The director would like ______ (speak) with all the {who} {when}.",
    { who: ["teachers", "students", "parents", "new workers"], when: ["after lunch", "at three", "on Monday", "tomorrow"] }],
  ["to rest", Q("rest"), "You look {adj}. Wouldn't you like ______ (rest) for a {time}?",
    { adj: ["tired", "pale", "sleepy", "exhausted"], time: ["while", "moment", "bit", "few minutes"] }],
  ["to try", TO("try"), "Kamila would like ______ (try) {activity} {when}.",
    { activity: ["skiing", "yoga", "rock climbing", "horse riding"], when: ["one day", "this winter", "next year", "some day"] }],
  ["to invite", TO("invite"), "Our class would like ______ (invite) a {guest} {when}.",
    { guest: ["famous writer", "doctor", "footballer", "scientist"], when: ["next month", "this term", "on Friday", "before the holidays"] }],
  ["to wait", OBJ("us", "wait"), "Would you like us ______ (wait) for you {where}, {name}?",
    { where: ["outside", "at the gate", "in the car", "downstairs"], name: ["Anvar", "Nilufar", "Olga", "Jasur"] }],
  ["to pay", TO("pay"), "I'd like ______ (pay) for the {thing} by {method}, please.",
    { thing: ["tickets", "room", "meal", "books"], method: ["card", "phone", "bank transfer", "QR code"] }],
  ["to improve", TO("improve"), "Bobur would like ______ (improve) his {skill} before the {exam}.",
    { skill: ["English", "speaking", "writing", "maths"], exam: ["exam", "interview", "test", "competition"] }],
  ["to sit", Q("sit"), "Would you like ______ (sit) near the {spot}, {name}?",
    { spot: ["window", "door", "heater", "stage"], name: ["Grandma", "Aziza", "Mr Karimov", "Dilshod"] }],
  ["to have", TO("have"), "My little brother would like ______ (have) a {thing} for {event}.",
    { thing: ["bike", "robot", "football", "drum"], event: ["his birthday", "New Year", "the holidays", "his next birthday"] }],
  ["to eat", Q("eat"), "Would the guests like ______ (eat) {when}, {name}?",
    { when: ["now", "later", "outside", "in the garden"], name: ["Mum", "Aunt Lola", "Dad", "Nodira"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POLITE = "Make the request more polite. Use would like.";
const INVITE = "Turn this into a polite invitation with Would you like … ?";
const PERSON = "Rewrite with would like + person + to + verb.";
const wl = (v) => ({ key: `would like to ${v}`, acceptable: [`'d like to ${v}`] });
const TRANSFORM = [
  // want / give me -> I'd like to (5)
  [POLITE, "I want to see the {thing} {when}.", "I ______ (see) the {thing} {when}, please.", wl("see"),
    "Would like is the polite way to say want. It is followed by to + base verb: would like to see.",
    { thing: ["menu", "manager", "room", "doctor"], when: ["now", "first", "again", "today"] }],
  [POLITE, "We want to change our {thing} {when}.", "We ______ (change) our {thing} {when}, please.", wl("change"),
    "Use would like + to + base verb for a polite request: would like to change.",
    { thing: ["seats", "room", "tickets", "table"], when: ["now", "today", "if possible", "this evening"] }],
  [POLITE, "I want to ask a question about the {thing}, {name}.", "I ______ (ask) a question about the {thing}, {name}.", wl("ask"),
    "Would like + to + base verb is polite: would like to ask.",
    { thing: ["homework", "price", "timetable", "test"], name: ["Mr Aliev", "Ms Petrova", "Malika", "Bobur"] }],
  [POLITE, "My mother wants to speak with the {person} {when}.", "My mother ______ (speak) with the {person} {when}, please.", wl("speak"),
    "With he or she, would like stays the same (never would likes). Then to speak.",
    { person: ["teacher", "doctor", "manager", "director"], when: ["today", "now", "this morning", "after class"] }],
  [POLITE, "I want to buy {num} tickets for {event}.", "I ______ (buy) {num} tickets for {event}, please.", wl("buy"),
    "Would like + to + base verb is the polite form: would like to buy.",
    { num: ["two", "three", "four", "five"], event: ["the concert", "the match", "the film", "the show"] }],
  // Do you want to …? -> Would you like to …? (5)
  [INVITE, "Do you want to dance?", "______ (dance) with {who} {when}?", "would you like to dance",
    "A polite invitation is Would you like + to + base verb.",
    { who: ["us", "me", "my sister", "our group"], when: ["tonight", "at the wedding", "at the party", "now"] }],
  [INVITE, "Bobur, do you want to play {game}?", "______ (play) {game} with us after {event}, Bobur?", "would you like to play",
    "Invite with Would you like + to + base verb: Would you like to play…?",
    { game: ["chess", "volleyball", "cards", "football"], event: ["school", "lunch", "class", "work"] }],
  [INVITE, "Kamila, do you want to watch {show}?", "______ (watch) {show} with me on {day}, Kamila?", "would you like to watch",
    "Would you like + to watch is a polite invitation.",
    { show: ["a film", "the match", "the new series", "a cartoon"], day: ["Friday", "Saturday", "Sunday", "Thursday"] }],
  [INVITE, "Do you want to have {meal} at our house?", "______ (have) {meal} at our house {when}?", "would you like to have",
    "Would you like + to have is the polite way to invite someone to eat.",
    { meal: ["dinner", "lunch", "plov", "tea"], when: ["on Sunday", "tomorrow", "this weekend", "after the lesson"] }],
  [INVITE, "Do you want to go for a walk in {place} {when}?", "______ (go) for a walk in {place} {when}?", "would you like to go",
    "Would you like + to go is a polite invitation.",
    { place: ["the park", "the old city", "the botanical garden", "the city centre"], when: ["today", "this evening", "on Saturday", "later"] }],
  // imperative -> would like + person + to (5)
  [PERSON, "The teacher says to us: \"Please read page {num} {when}.\"", "The teacher would like ______ (read) page {num} {when}.", "us to read",
    "The teacher is talking to us, so use would like + us + to read.",
    { num: ["ten", "twelve", "twenty", "forty"], when: ["at home", "tonight", "before Monday", "again"] }],
  [PERSON, "I say to you: \"Please call me {when}.\"", "I'd like ______ (call) me {when}.", "you to call",
    "Use would like + you + to + verb: I'd like you to call me.",
    { when: ["tomorrow", "tonight", "after work", "on Friday"] }],
  [PERSON, "Dad says to my sister: \"Please help Mum in the {room}.\"", "Dad would like ______ (help) Mum in the {room}.", "my sister to help",
    "Use would like + person + to + verb: would like my sister to help.",
    { room: ["kitchen", "garden", "yard", "shop"] }],
  [PERSON, "Our coach says to the players: \"Please come at {time} on {day}.\"", "Our coach would like ______ (come) at {time} on {day}.", "the players to come",
    "Use would like + person + to + verb: would like the players to come. Not \"would like that the players come\".",
    { time: ["eight", "nine", "seven", "ten"], day: ["Saturday", "Sunday", "Monday", "Friday"] }],
  [PERSON, "Grandma says to me: \"Please bring {thing} {when}.\"", "Grandma would like ______ (bring) {thing} {when}.", "me to bring",
    "Grandma is talking to me, so use would like + me + to bring.",
    { thing: ["bread", "some fruit", "the photos", "the newspaper"], when: ["tomorrow", "next time", "on Sunday", "tonight"] }],
].map(([instr, source, hint, key, why, slots]) => {
  const k = typeof key === "string" ? { key } : key;
  const acc = { "my sister to help": ["her to help"], "the players to come": ["them to come"] }[k.key];
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, ...k, ...(acc ? { acceptable: acc } : {}), why, slots };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["You are in a café. Write one sentence to order food and a drink.", "I'd like to … or I would like to …", ["exactly one sentence", "must use would like to or 'd like to", "must name a food and a drink"]],
  ["Invite a friend to do something with you this weekend.", "Would you like to + base verb?", ["exactly one question", "must start with Would you like to", "must include this weekend"]],
  ["Write one sentence about a country you would like to visit and why.", "would like to visit", ["exactly one sentence", "must name a country", "must give a reason with because"]],
  ["Offer to help a person who is carrying heavy bags.", "Would you like me to + base verb?", ["exactly one question", "must use Would you like me to", "must name what you will do"]],
  ["Write one sentence about a job you would like to do one day.", "would like to + base verb", ["exactly one sentence", "must use would like to or 'd like to", "must name a job"]],
  ["Write one sentence about something you wouldn't like to do.", "wouldn't like to + base verb", ["exactly one sentence", "must use wouldn't like to", "must say what you wouldn't like to do"]],
  ["You are at a hotel. Write one polite sentence asking to change something.", "I'd like to change …", ["exactly one sentence", "must use would like to or 'd like to", "must end with please"]],
  ["Write one sentence about something your teacher would like your class to do.", "would like + us + to + base verb", ["exactly one sentence", "must use would like us to", "must not use that after would like"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are at a restaurant with your family. Write a short dialogue with the waiter: order food, drinks and ask for the bill.",
    "would like to + verb for polite requests", ["I'd like to … / We'd like to …", "Would you like to … ? from the waiter", "to + base verb after like"]],
  ["Write a message inviting a friend to your birthday party. Say what you would like to do together.",
    "Would you like to … ? and we'd like to …", ["Would you like to + verb", "two or more different verbs after would like to", "a day or time"]],
  ["Describe your dream holiday. Where would you like to go, and what would you like to do there? Write three or four sentences.",
    "would like to + base verb", ["would like to go / visit / see", "a place name", "no -ing or bare verb after would like"]],
  ["What would you like to do after you finish school or university? What would your parents like you to do? Write three or four sentences.",
    "would like to + verb and would like + person + to + verb", ["I'd like to …", "would like me to …", "no would like that …"]],
  ["You call a language centre. Write what you say: ask for information about a course and book a place.",
    "polite requests with would like to", ["I'd like to know / ask / book", "please", "to + base verb after like"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.gerund-infinitive.would-like-infinitive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
