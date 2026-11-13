// Hand-authored: modals / ability-permission / can-question (A1).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "Modal question: can + subject + verb" (can / you / play /
// the guitar). Yes/no and wh- questions about ability and possibility.
// Choose: the blank holds can + subject, so the order is the test. Distractors
// are the real errors: do-support on top of can (Do you can…? Does she can…?),
// the copula (Are you can…?), "to" after can, and in wh- questions the
// statement order (What you can cook?). The plain statement order is NOT
// offered in yes/no items: "You can ride a horse?" is a real spoken question.
// "Could" is never offered (it is right).
// Build: short dialogues; the learner writes can + subject + verb from the
// verb in brackets and the context (key never printed in the text).
// Transform: statement → yes/no question; statement → wh- question;
// "Are you able to…?" → "Can you…?".
//
// Run: node tools/grammar-practice/authored/modals.ability-permission.can-question.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "ability-permission", topic: "can-question", level: "A1", pv: "2.5" };

const DOES = (s) => (/^(you|we|they|your (parents|grandparents|friends))$/i.test(s) || / and /.test(s) || /s$/.test(s) && !/^(Aziz|Bobur)$/.test(s) ? "Do" : "Does");
const BE = (s) => (/^(you|we|they)$/i.test(s) || /s$/.test(s) ? "Are" : "Is");
// yes/no: Can + S | Do/Does + S + can | Am/Is/Are + S + can | Can + S + to
const yn = (s) => [`Can ${s}`, `${DOES(s)} ${s} can`, `${BE(s)} ${s} can`, `Can ${s} to`];
// wh-: can + S | S + can | do/does + S + can | can + S + to
const wh = (s) => [`can ${s}`, `${s} can`, `${DOES(s).toLowerCase()} ${s} can`, `can ${s} to`];
const YN = (s, v) => `In a question, can comes first, then the subject, then the base verb: Can ${s} ${v}…? Don't add do/does or am/is/are, and no to.`;
const WH = (w, s, v) => `After the question word, put can before the subject: ${w} can ${s} ${v}…? Not "${w} ${s} can…".`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [yn("you"), YN("you", "ride"), "______ ride a {vehicle}, {name}?",
    { vehicle: ["bike", "horse", "scooter", "motorbike"], name: ["Aziz", "Lola", "Timur", "Olga"] }],
  [yn("you"), YN("you", "swim"), "______ swim in deep {water}, {name}?",
    { water: ["water", "rivers", "lakes", "pools"], name: ["Malika", "Sardor", "Kamila", "Bobur"] }],
  [yn("you"), YN("you", "cook"), "______ cook {food} for {num} people?",
    { food: ["plov", "soup", "manti", "lagman"], num: ["ten", "twenty", "five", "fifty"] }],
  [yn("you"), YN("you", "speak"), "______ speak {lang} {how}?",
    { lang: ["Korean", "German", "Turkish", "English"], how: ["well", "a little", "very well", "at all"] }],
  [yn("you"), YN("you", "play"), "______ play the {instrument}, {name}?",
    { instrument: ["piano", "guitar", "drums", "dutar"], name: ["Nodira", "Jasur", "Olga", "Anvar"] }],
  [yn("you"), YN("you", "see"), "______ see the {thing} from your {room}?",
    { thing: ["mountains", "river", "stadium", "park"], room: ["window", "balcony", "flat", "office"] }],
  [yn("you"), YN("you", "draw"), "______ draw {things} {how}?",
    { things: ["people", "animals", "cars", "houses"], how: ["well", "from memory", "very well", "fast"] }],
  [yn("the baby"), YN("the baby", "walk"), "______ walk on her own yet, {name}?",
    { name: ["Dilnoza", "Mum", "Aunt Lola", "Grandma"] }],
  [yn("your father"), YN("your father", "drive"), "______ drive a {vehicle}, {name}?",
    { vehicle: ["truck", "bus", "tractor", "car"], name: ["Rustam", "Malika", "Aziz", "Nigora"] }],
  [yn("your grandparents"), YN("your grandparents", "speak"), "______ speak {lang} {how}?",
    { lang: ["Russian", "Tajik", "Kazakh", "English"], how: ["well", "a little", "very well", "at all"] }],
  [yn("your cat"), YN("your cat", "open"), "______ open the {thing} {how}?",
    { thing: ["door", "fridge", "window", "cupboard"], how: ["by itself", "with its paws", "on its own", "at night"] }],
  [yn("your grandmother"), YN("your grandmother", "use"), "______ use a {device} {how}?",
    { device: ["smartphone", "computer", "laptop", "tablet"], how: ["well", "on her own", "without help", "at all"] }],
  [yn("Aziz"), YN("Aziz", "fix"), "______ fix {thing} {when}?",
    { thing: ["my bike", "our TV", "your phone", "the computer"], when: ["today", "by Friday", "this week", "tomorrow"] }],
  [wh("you"), WH("What", "you", "cook"), "What ______ cook, {name}?",
    { name: ["Sevara", "Bekzod", "Olga", "Timur"] }],
  [wh("we"), WH("Where", "we", "buy"), "Where ______ buy {thing} in this {place}?",
    { thing: ["bread", "tickets", "water", "stamps"], place: ["town", "area", "city", "district"] }],
  [wh("you"), WH("How many", "you", "carry"), "How many {things} ______ carry, {name}?",
    { things: ["bags", "boxes", "chairs", "books"], name: ["Jasur", "Lola", "Aziz", "Kamila"] }],
  [wh("we"), WH("When", "we", "start"), "When ______ start the {task}, {name}?",
    { task: ["test", "project", "game", "exercise"], name: ["Ms Karimova", "Mr Aliev", "Coach", "Ms Petrova"] }],
  [wh("your brother"), WH("How fast", "your brother", "run"), "How fast ______ run {dist}?",
    { dist: ["a kilometre", "100 metres", "five kilometres", "two kilometres"] }],
  [wh("your sister"), WH("Which", "your sister", "play"), "Which {thing} ______ play, {name}?",
    { thing: ["songs", "games", "instruments", "sports"], name: ["Anvar", "Madina", "Sardor", "Nilufar"] }],
  [wh("you"), WH("How long", "you", "stay"), "How long ______ stay {where}, {name}?",
    { where: ["at the party", "with us", "in Tashkent", "here"], name: ["Olga", "Bobur", "Malika", "Rustam"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the question with can + the right person + the verb in brackets.";
const BUILD = [
  ["can you swim", "Ask about you: can + you + swim.", "A: ______ (swim), {name}? B: Yes, I love the {water}!",
    { name: ["Aziza", "Timur", "Olga", "Sardor"], water: ["sea", "lake", "river", "pool"] }],
  ["can he drive", "Ask about your brother (he): can + he + drive.", "A: Your brother is eighteen now. ______ (drive)? B: Yes, since {when}.",
    { when: ["last year", "March", "the summer", "his birthday"] }],
  ["can you play", "Ask about you: can + you + play.", "A: ______ (play) the {instrument}, {name}? B: Yes, a little.",
    { instrument: ["piano", "guitar", "violin", "dutar"], name: ["Malika", "Bekzod", "Lola", "Anvar"] }],
  ["can she read", "Ask about your grandmother (she): can + she + read.", "A: Your grandmother is {age}. ______ (read) without glasses? B: No, not {what}.",
    { age: ["eighty", "ninety", "seventy-five", "eighty-five"], what: ["small letters", "the newspaper", "her phone", "menus"] }],
  ["can she make", "Ask about your sister (she): What + can + she + make?", "A: Your sister makes great {food}. What else ______ (make)? B: {other} and bread.",
    { food: ["cakes", "samsa", "pies", "cookies"], other: ["Biscuits", "Pizza", "Pancakes", "Soup"] }],
  ["can you speak", "Ask about you: What languages + can + you + speak?", "A: What languages ______ (speak), {name}? B: Uzbek, Russian and a little {lang}.",
    { name: ["Kamila", "Rustam", "Nodira", "Jasur"], lang: ["English", "Korean", "Turkish", "German"] }],
  ["can it open", "Ask about the cat (it): can + it + open.", "A: Your cat is so clever! ______ (open) the {thing}? B: Yes, with its {part}!",
    { thing: ["door", "fridge", "cupboard", "window"], part: ["paws", "head", "nose", "teeth"] }],
  ["can you do", "Ask about you: How many + can + you + do?", "A: How many push-ups ______ (do), {name}? B: About {num}.",
    { name: ["Bobur", "Aziz", "Sevara", "Timur"], num: ["twenty", "thirty", "fifty", "ten"] }],
  ["can they speak", "Ask about your parents (they): can + they + speak.", "A: Your parents live in {city}. ______ (speak) {lang}? B: Yes, very well.",
    { city: ["Moscow", "Kazan", "Seoul", "Istanbul"], lang: ["Russian", "Uzbek", "English", "Korean"] }],
  ["can you type", "Ask about you: How fast + can + you + type?", "A: How fast ______ (type), {name}? B: About {num} words a minute.",
    { name: ["Olga", "Sardor", "Madina", "Anvar"], num: ["thirty", "forty", "fifty", "sixty"] }],
  ["can it do", "Ask about the robot (it): What + can + it + do?", "A: Our robot is ready, {name}. What ______ (do)? B: Walk and {ability}.",
    { name: ["Lola", "Bekzod", "Kamila", "Aziz"], ability: ["talk", "dance", "sing", "draw"] }],
  ["can he take", "Ask about your uncle (he): can + he + take.", "A: My uncle has a boat. ______ (take) us to the {place}? B: Sure, on {day}.",
    { place: ["island", "beach", "other side", "old fort"], day: ["Saturday", "Sunday", "Friday", "Monday"] }],
  ["can you see", "Ask about you: can + you + see.", "A: ______ (see) the {thing} from your window, {name}? B: Yes, it's beautiful.",
    { thing: ["mountains", "river", "lake", "old city"], name: ["Nigora", "Timur", "Olga", "Jasur"] }],
  ["can she write", "Ask about Malika (she): can + she + write.", "A: Malika is only {age}. ______ (write) her name? B: Yes, and the {more} too.",
    { age: ["four", "five", "three", "six"], more: ["alphabet", "numbers", "date", "days of the week"] }],
  ["can we park", "Ask about us (we): Where + can + we + park?", "A: We're here! Where ______ (park) the car, {name}? B: Behind the {place}.",
    { name: ["Dad", "Aziz", "Mum", "Lola"], place: ["hotel", "market", "school", "bank"] }, ["can i park"]],
  ["can it jump", "Ask about the dog (it): can + it + jump.", "A: Your dog is very big. ______ (jump) over the {thing}? B: Easily, {name}!",
    { thing: ["fence", "gate", "wall", "sofa"], name: ["Rustam", "Malika", "Sardor", "Nodira"] }, ["can he jump", "can she jump"]],
  ["can you stay", "Ask about you: How long + can + you + stay?", "A: How long ______ (stay) in {city}? B: Only {time}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], time: ["two days", "a week", "one night", "three days"] }],
  ["can they grow", "Ask about the neighbours (they): can + they + grow.", "A: Our neighbours have a big garden. ______ (grow) {food} there? B: Yes, lots of {food}!",
    { food: ["tomatoes", "melons", "grapes", "apples"] }],
  ["can you hear", "Ask about you: can + you + hear.", "A: ______ (hear) me, {name}? B: Not very well. The {noise} is too loud.",
    { name: ["Aziza", "Bekzod", "Lola", "Timur"], noise: ["music", "TV", "wind", "traffic"] }],
  ["can he tie", "Ask about your little brother (he): can + he + tie.", "A: Your little brother is {age}. ______ (tie) his shoes? B: Not yet.",
    { age: ["three", "four", "five", "six"] }],
].map(([key, why, source, slots, acceptable]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key,
  why: `${why} Can comes before the person in a question.`, slots, ...(acceptable ? { acceptable } : {}),
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const YNQ = "Make a yes/no question with can.";
const WHQ = "Make a question with the question word given.";
const ABLE = "Ask the same question with can.";
const TRANSFORM = [
  // statement -> yes/no (5)
  [YNQ, "Sardor can play {instrument} {how}.", "______ (play) {instrument} {how}?", "can sardor play",
    "Move can to the front, before Sardor: Can Sardor play…?",
    { instrument: ["the piano", "the guitar", "the drums", "the dutar"], how: ["well", "very well", "by ear", "a little"] }],
  [YNQ, "Your parents can come to the {event} on {day}.", "______ (come) to the {event} on {day}?", "can your parents come",
    "Can goes before the subject: Can your parents come…?",
    { event: ["concert", "meeting", "party", "school show"], day: ["Friday", "Saturday", "Monday", "Sunday"] }],
  [YNQ, "The new student can speak {lang} {how}.", "______ (speak) {lang} {how}?", "can the new student speak",
    "Can goes first, then the new student, then speak.",
    { lang: ["English", "Russian", "Korean", "Turkish"], how: ["well", "very well", "a little", "quite well"] }],
  [YNQ, "Aziza can ride a {vehicle} {where}.", "______ (ride) a {vehicle} {where}?", "can aziza ride",
    "Can goes before Aziza: Can Aziza ride…? No does.",
    { vehicle: ["bike", "horse", "scooter", "motorbike"], where: ["in the city", "in the mountains", "on the road", "in the village"] }],
  [YNQ, "Your dog can catch a {thing} {how}.", "______ (catch) a {thing} {how}?", "can your dog catch",
    "Can goes before your dog: Can your dog catch…?",
    { thing: ["ball", "stick", "frisbee", "toy"], how: ["in the air", "in its mouth", "every time", "from far away"] }],
  // statement -> wh- question (5)
  [WHQ, "Malika can speak {num} languages {how}.", "How many languages ______ (speak) {how}?", "can malika speak",
    "After How many languages, put can before Malika: can Malika speak.",
    { num: ["two", "three", "four", "five"], how: ["well", "very well", "now", "at work"] }],
  [WHQ, "Timur can swim {dist} {where}.", "How far ______ (swim) {where}?", "can timur swim",
    "After How far, put can before Timur: can Timur swim.",
    { dist: ["two kilometres", "a kilometre", "five hundred metres", "three kilometres"], where: ["in the sea", "in the lake", "in the river", "in the pool"] }],
  [WHQ, "We can buy {thing} at the {shop}.", "Where ______ (buy) {thing}?", "can we buy",
    "After Where, put can before we: Where can we buy…?",
    { thing: ["bread", "stamps", "tickets", "fruit"], shop: ["market", "kiosk", "station", "bazaar"] }],
  [WHQ, "The children can start {task} at {time}.", "When ______ (start) {task}?", "can the children start",
    "After When, put can before the children: When can the children start…?",
    { task: ["the test", "the game", "lunch", "the lesson"], time: ["nine", "ten", "noon", "two"] }],
  [WHQ, "Your brother can lift {weight} {where}.", "How much ______ (lift) {where}?", "can your brother lift",
    "After How much, put can before your brother: can your brother lift.",
    { weight: ["fifty kilos", "eighty kilos", "a hundred kilos", "a lot"], where: ["at the gym", "in training", "with one hand", "now"] }],
  // be able to / is it possible -> can (5)
  [ABLE, "Are you able to come {when}, {name}?", "______ (come) {when}, {name}?", "can you come",
    "Are you able to = Can you: Can you come…?",
    { when: ["on Friday", "tomorrow", "at six", "this evening"], name: ["Olga", "Aziz", "Lola", "Timur"] }],
  [ABLE, "Is your father able to pick us up from the {place} {when}?", "______ (pick) us up from the {place} {when}?", "can your father pick",
    "Is your father able to = Can your father: Can your father pick us up…?",
    { place: ["station", "airport", "school", "stadium"], when: ["tonight", "at five", "after the match", "tomorrow"] }],
  [ABLE, "Are your friends able to help with the {event} {when}?", "______ (help) with the {event} {when}?", "can your friends help",
    "Are your friends able to = Can your friends: Can your friends help…?",
    { event: ["party", "wedding", "concert", "move"], when: ["on Saturday", "next week", "tomorrow", "this weekend"] }],
  [ABLE, "Is it possible for me to pay for the {thing} by {method}?", "______ (pay) for the {thing} by {method}?", "can i pay",
    "Is it possible for me to = Can I: Can I pay…?",
    { thing: ["tickets", "room", "meal", "books"], method: ["card", "phone", "bank transfer", "QR code"] }],
  [ABLE, "Is Lola able to swim {how} {where}?", "______ (swim) {how} {where}?", "can lola swim",
    "Is Lola able to = Can Lola: Can Lola swim…?",
    { how: ["well", "fast", "far", "underwater"], where: ["in the sea", "in deep water", "in the river", "in the lake"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write a question to ask a new friend about a sport they can play.", "Can you + base verb … ?", ["exactly one question", "must start with Can you", "must name a sport"]],
  ["Write a question about a language someone in your class can speak.", "Can he / she speak … ?", ["exactly one question", "must name the person", "can before the person"]],
  ["Write a question with What can … ? about cooking.", "What can + subject + cook?", ["exactly one question", "must start with What can", "must end with a question mark"]],
  ["Write a question with Where can … ? about buying something in your city.", "Where can I / we buy … ?", ["exactly one question", "must start with Where can", "must name a thing to buy"]],
  ["Write a question to ask your teacher about something your class can do.", "Can we + base verb … ?", ["exactly one question", "must use Can we", "no to after can"]],
  ["Write a question about an animal and what it can do.", "Can + animal + base verb?", ["exactly one question", "must name an animal", "can before the animal"]],
  ["Write a question with How many … can … ?", "How many + noun + can + subject + verb?", ["exactly one question", "must start with How many", "can before the subject"]],
  ["Write two questions to ask a friend about their skills.", "Can you + base verb … ?", ["exactly two questions", "two different verbs", "no do or does with can"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are interviewing a new member for your school club. Write four questions with can.",
    "yes/no and wh- questions with can", ["Can you + base verb?", "a wh- question with can", "no Do you can…?"]],
  ["Write a short dialogue: you meet an exchange student. Ask what they can do and answer their questions about you.",
    "can questions and short answers", ["Can you … ?", "Yes, I can / No, I can't", "can before the subject"]],
  ["You want to rent a flat. Write four questions to the owner with can (pets, guests, parking, internet).",
    "Can I / Can we + base verb … ?", ["Can I / Can we", "base verb after can", "a question mark on each question"]],
  ["Write questions for a class survey about skills: cooking, languages, sports and music.",
    "Can you + base verb … ? / How many … can you … ?", ["four or more questions", "a How many / How well question", "no to after can"]],
  ["A tourist asks you about your city. Write four questions they could ask with Where can … ? or What can … ?",
    "wh- questions with can", ["Where can I / we …", "What can I / we …", "can before the subject"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.ability-permission.can-question.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
