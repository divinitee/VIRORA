// Hand-authored: tenses / present / temporary-situation (A2).
//
// Tests ONE point: the present continuous for a temporary situation AROUND
// now (this month, this year, these days, at the moment), not only at this
// second. Each sentence carries a reason or an end in sight that makes the
// situation clearly temporary. Time markers, subjects and verbs are never
// slotted.
//
// Distractors: the present simple (the main error), the wrong form of be, and
// a bare -ing with be dropped (the zero-copula error). The present perfect is
// NOT used as a distractor: "I have stayed here this month" is grammatical, so
// it would be a second right answer.
//
// Run: node tools/grammar-practice/authored/tenses.present.temporary-situation.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "present", topic: "temporary-situation", level: "A2", pv: "2.5" };

const BE = { i: "am", sg: "is", pl: "are" };
const WRONG = { i: "is", sg: "are", pl: "is" };
const opts = (type, ing, simple) => [`${BE[type]} ${ing}`, simple, `${WRONG[type]} ${ing}`, ing];
const why = (marker, type, ing) =>
  `${marker} shows a situation that is true around now but will not last, so use the present continuous: ${BE[type]} ${ing}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["This month", "i", "staying", "stay", "I ______ with my {person} this month because workers are repairing my {room}.",
    { person: ["parents", "grandparents", "aunt", "cousin"], room: ["kitchen", "bathroom", "roof", "flat"] }],
  ["This summer", "sg", "working", "works", "Gulnora ______ at a {place} this summer because she wants to save money for {thing}.",
    { place: ["café", "hotel", "shop", "bakery"], thing: ["a laptop", "university", "a trip", "a new phone"] }],
  ["This week", "pl", "using", "use", "We ______ the {thing} in the {room} this week because ours is broken.",
    { thing: ["computer", "kettle", "printer", "fridge"], room: ["office", "library", "staff room", "teachers' room"] }],
  ["These days", "sg", "learning", "learns", "My brother ______ to drive these days. His {person} gives him lessons on {day}.",
    { person: ["uncle", "father", "cousin", "friend"], day: ["Sundays", "Saturdays", "weekends", "Friday evenings"] }],
  ["For now", "pl", "living", "live", "My cousins ______ in a small flat in {city} for now. Their new house isn't {state} yet.",
    { city: ["Tashkent", "Samarkand", "Namangan", "Bukhara"], state: ["ready", "finished", "built", "painted"] }],
  ["At the moment", "i", "reading", "read", "I ______ a very good book about {topic} at the moment. I read a few pages every {time}.",
    { topic: ["space", "history", "animals", "football"], time: ["night", "evening", "morning", "lunchtime"] }],
  ["This month", "sg", "travelling", "travels", "Dad ______ a lot this month because his company has a big {project} in {city}.",
    { project: ["project", "contract", "order", "meeting"], city: ["Almaty", "Moscow", "Istanbul", "Dubai"] }],
  ["This term", "pl", "preparing", "prepare", "The students in our {group} ______ for the {event} this term.",
    { group: ["class", "group", "school", "college"], event: ["final exams", "olympiad", "IELTS test", "concert"] }],
  ["This month", "sg", "wearing", "wears", "My sister ______ a uniform this month because she has a part-time job at a {place} in {district}.",
    { place: ["hotel", "bank", "clinic", "café"], district: ["Chilonzor", "Yunusobod", "Mirobod", "Sergeli"] }],
  ["This week", "sg", "raining", "rains", "It ______ a lot this {period}, so take your {thing}.",
    { period: ["week", "month", "spring", "autumn"], thing: ["umbrella", "raincoat", "boots", "jacket"] }],
  ["This month", "i", "taking", "take", "I ______ a {course} online this month, so I am busy every {time}.",
    { course: ["computer course", "maths course", "design course", "cooking course"], time: ["evening", "night", "weekend", "afternoon"] }],
  ["This week", "sg", "sleeping", "sleeps", "Anvar ______ on the sofa this week because his {person} is using his {room}.",
    { person: ["grandmother", "uncle", "aunt", "cousin"], room: ["room", "bedroom", "bed", "small room"] }],
  ["These days", "pl", "walking", "walk", "We ______ to {place} these days because the metro station near us is closed for {reason}.",
    { place: ["school", "college", "work", "university"], reason: ["repairs", "building work", "cleaning", "a few weeks"] }],
  ["This month", "sg", "selling", "sells", "The shop on our street ______ {things} cheaply this month because it is {reason}.",
    { things: ["shoes", "clothes", "phones", "books"], reason: ["closing", "moving", "changing owners", "getting a new name"] }],
  ["This year", "sg", "teaching", "teaches", "Nargiza ______ at a school in {village} this year, but next year she wants to go back to {city}.",
    { village: ["Zomin", "Bostanliq", "Parkent", "Gazalkent"], city: ["Tashkent", "Samarkand", "Fergana", "Andijan"] }],
  ["This summer", "pl", "spending", "spend", "The children ______ a lot of time at their grandmother's {place} this summer because their parents are {state}.",
    { place: ["house", "flat", "dacha", "village house"], state: ["busy", "at work", "abroad", "away"] }],
  ["This month", "sg", "borrowing", "borrows", "My uncle ______ a car from his friend this month while his own car is at the {place} in {city}.",
    { place: ["garage", "repair shop", "mechanic's", "service centre"], city: ["Chirchik", "Tashkent", "Angren", "Almalyk"] }],
  ["This month", "i", "eating", "eat", "I ______ less {food} this month because I want to get {goal}.",
    { food: ["sugar", "bread", "fast food", "sweets"], goal: ["fit", "healthier", "stronger", "fitter"] }],
  ["At the moment", "sg", "looking", "looks", "Olim ______ for a new job at the moment. He sends his CV to {num} companies every {period}.",
    { num: ["two", "three", "five", "ten"], period: ["day", "week", "morning", "Monday"] }],
  ["This term", "sg", "singing", "sings", "Bobur ______ in the {group} this term because his {person} asked him to help.",
    { group: ["choir", "school band", "music club", "concert group"], person: ["teacher", "music teacher", "friend", "mother"] }],
].map(([m, type, ing, simple, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: opts(type, ing, simple), key: 0, why: why(m, type, ing), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the present continuous form of the verb in brackets. The situation is temporary.";
const BUILD = [
  ["This week", "sg", "staying", "Rustam ______ (stay) at a hostel in {city} this week while he looks for a {thing}.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Khiva"], thing: ["flat", "room", "job", "place to live"] }],
  ["This summer", "pl", "building", "My parents ______ (build) a new {room} this summer, so our house has a lot of {mess}.",
    { room: ["kitchen", "bathroom", "garage", "second floor"], mess: ["dust", "noise", "workers", "boxes"] }],
  ["This year", "i", "learning", "I ______ (learn) {lang} this year for my new job at the {place}.",
    { lang: ["Korean", "Turkish", "German", "Chinese"], place: ["hotel", "airport", "travel agency", "embassy"] }],
  ["This month", "sg", "working", "Zarina ______ (work) from home this month because the {place} has no {thing}.",
    { place: ["office", "school", "clinic", "bank"], thing: ["heating", "internet", "electricity", "water"] }],
  ["These days", "pl", "waiting", "We ______ (wait) for our new {thing} these days, so we use my {person}'s.",
    { thing: ["fridge", "sofa", "car", "washing machine"], person: ["aunt", "neighbour", "uncle", "cousin"] }],
  ["This month", "sg", "spending", "My little sister ______ (spend) this month at a summer camp in {place} with her {who}.",
    { place: ["Chimgan", "Charvak", "Zomin", "the mountains"], who: ["classmates", "friends", "cousins", "sports team"] }],
  ["This week", "sg", "using", "The bus company ______ (use) smaller buses on route {num} this week because of {reason}.",
    { num: ["12", "45", "67", "91"], reason: ["road works", "repairs", "the festival", "building work"] }],
  ["This year", "sg", "saving", "Akmal ______ (save) money for a new {thing} this year, so he cooks at home every {time}.",
    { thing: ["laptop", "phone", "bike", "guitar"], time: ["day", "evening", "night", "weekday"] }],
  ["This week", "pl", "painting", "Our neighbours ______ (paint) their {room} this week, so the stairs smell of {smell}.",
    { room: ["flat", "kitchen", "hall", "bedroom"], smell: ["paint", "chemicals", "fresh paint", "wet paint"] }],
  ["At the moment", "i", "training", "I ______ (train) for a {race} at the moment, so I run in the {place} every morning.",
    { race: ["race", "marathon", "half marathon", "10K race"], place: ["park", "stadium", "gym", "yard"] }],
  ["This year", "sg", "living", "Feruza ______ (live) with her aunt in {city} this year because her college has no {thing}.",
    { city: ["Tashkent", "Samarkand", "Namangan", "Nukus"], thing: ["dormitory", "rooms", "free places", "hostel"] }],
  ["These days", "sg", "walking", "These days my grandfather ______ (walk) with a stick because he hurt his {part} at the {place}.",
    { part: ["leg", "knee", "foot", "back"], place: ["market", "garden", "bus stop", "dacha"] }],
  ["This week", "pl", "looking", "My cousins ______ (look) after our dog this week while we visit {city} for {event}.",
    { city: ["Bukhara", "Khiva", "Samarkand", "Fergana"], event: ["a wedding", "the holidays", "a conference", "a family party"] }],
  ["This month", "sg", "giving", "The teacher ______ (give) us extra lessons on {days} this month before the {event}.",
    { days: ["Saturdays", "Tuesdays", "Thursdays", "weekends"], event: ["exam", "olympiad", "final test", "big test"] }],
  ["These days", "i", "sleeping", "I ______ (sleep) badly these days because of the {noise} from the {place}.",
    { noise: ["noise", "music", "sounds", "dogs"], place: ["street", "building site", "café", "yard"] }],
  ["This week", "sg", "driving", "Sanjar ______ (drive) his {relative}'s car this week because his own car has a problem with the {part}.",
    { relative: ["father", "uncle", "brother", "neighbour"], part: ["engine", "brakes", "lights", "doors"] }],
  ["At the moment", "sg", "taking", "My mother ______ (take) a {course} at the moment, so my father makes {meal}.",
    { course: ["sewing course", "computer course", "nursing course", "language course"], meal: ["dinner", "lunch", "breakfast", "supper"] }],
  ["This year", "pl", "renting", "We ______ (rent) a small flat near the {place} in {city} this year.",
    { place: ["university", "college", "hospital", "station"], city: ["Tashkent", "Samarkand", "Bukhara", "Andijan"] }],
  ["This summer", "sg", "helping", "Dilfuza ______ (help) at her uncle's {shop} this summer and earns {money} a week.",
    { shop: ["shop", "café", "bakery", "restaurant"], money: ["300,000 som", "400,000 som", "some money", "a little money"] }],
  ["This term", "sg", "writing", "Murod ______ (write) his {thing} this term, so he spends a lot of time in the {place}.",
    { thing: ["final project", "course paper", "first book", "report"], place: ["library", "reading room", "computer room", "archive"] }],
].map(([m, type, ing, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${BE[type]} ${ing}`, why: why(m, type, ing), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TO_TEMP = "The first sentence is the usual situation. Complete the second sentence about a temporary situation.";
const NEW_SUBJ = "Rewrite the sentence with the new subject. Keep the present continuous.";
const PAST_TO_NOW = "The first sentence is about the past. Complete the second sentence about the temporary situation now.";
const TRANSFORM = [
  // usual -> temporary (5)
  [TO_TEMP, "Aziz usually lives in {city}.", "This year Aziz ______ (live) in {city2} for his studies.", "is living",
    "This year is a temporary situation, so use the present continuous: is living.",
    { city: ["Fergana", "Andijan", "Namangan", "Karshi"], city2: ["Tashkent", "Samarkand", "Seoul", "Moscow"] }],
  [TO_TEMP, "My father normally works at the {place}.", "This month my father ______ (work) at the {place2} because they need help there.", "is working",
    "This month is a temporary situation, so use the present continuous: is working.",
    { place: ["main office", "factory", "bank", "hospital"], place2: ["new branch", "airport office", "city office", "small office"] }],
  [TO_TEMP, "We usually take the {transport} to college.", "This week we ______ (take) a taxi because the {transport} stop has moved.", "are taking",
    "This week is a temporary situation, so use the present continuous: are taking.",
    { transport: ["bus", "minibus", "metro", "school bus"] }],
  [TO_TEMP, "I usually sleep in my own {room}.", "This week I ______ (sleep) in my brother's {room} because of the {reason}.", "am sleeping",
    "This week is a temporary situation, so use the present continuous: am sleeping.",
    { room: ["room", "bedroom", "bed", "small room"], reason: ["repairs", "guests", "new carpet", "cold"] }],
  [TO_TEMP, "Laylo usually studies at the {place}.", "This term Laylo ______ (study) online because she {reason}.", "is studying",
    "This term is a temporary situation, so use the present continuous: is studying.",
    { place: ["library", "college", "university", "learning centre"], reason: ["has a part-time job", "lives in another city now", "works in the mornings", "looks after her grandmother"] }],
  // new subject (5)
  [NEW_SUBJ, "I'm staying with my aunt in {city} this week while our parents visit {place}.", "My brother ______ (stay) with our aunt in {city} this week while our parents visit {place}.", "is staying",
    "My brother is singular, so I'm becomes is: is staying.",
    { city: ["Samarkand", "Bukhara", "Fergana", "Termez"], place: ["Moscow", "Dubai", "Istanbul", "Seoul"] }],
  [NEW_SUBJ, "My friends are learning to swim at the {place} this summer.", "My friend Ali ______ (learn) to swim at the {place} this summer with his {person}.", "is learning",
    "My friend Ali is one person, so are becomes is: is learning.",
    { place: ["sports centre", "pool", "lake", "river"], person: ["father", "coach", "brother", "uncle"] }],
  [NEW_SUBJ, "She's living in a hostel this month while she looks for a {thing}.", "Kamola and her sister ______ (live) in a hostel in {city} this month while they look for a {thing}.", "are living",
    "Kamola and her sister are two people, so use are: are living.",
    { thing: ["flat", "room", "house", "place to rent"], city: ["Tashkent", "Samarkand", "Namangan", "Nukus"] }],
  [NEW_SUBJ, "He's using my {device} this week.", "I ______ (use) my {person}'s {device} this week.", "am using",
    "With I, use am: am using.",
    { device: ["laptop", "phone", "tablet", "computer"], person: ["brother", "sister", "father", "friend"] }],
  [NEW_SUBJ, "We're eating a lot of {food} this week.", "My grandfather ______ (eat) a lot of {food} this week because the {place} has it cheap.", "is eating",
    "My grandfather is singular, so we're becomes is: is eating.",
    { food: ["fruit", "melons", "grapes", "apricots"], place: ["market", "bazaar", "shop", "village shop"] }],
  // past -> temporary now (5)
  [PAST_TO_NOW, "Last summer I worked at a {place}.", "This summer I ______ (work) at my uncle's {place2}.", "am working",
    "This summer is a temporary situation now, so use the present continuous: am working.",
    { place: ["café", "hotel", "shop", "bakery"], place2: ["farm", "garage", "bakery", "restaurant"] }],
  [PAST_TO_NOW, "Last year Bobur lived in a dormitory in {city}.", "This year Bobur ______ (rent) a room in {city} with two {who}.", "is renting",
    "This year is a temporary situation now, so use the present continuous: is renting.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], who: ["friends", "classmates", "students", "cousins"] }],
  [PAST_TO_NOW, "Last month we studied {topic} in class.", "This month we ______ (study) {topic2} in class.", "are studying",
    "This month is a temporary situation now, so use the present continuous: are studying.",
    { topic: ["grammar", "history", "poems", "fractions"], topic2: ["new words", "essays", "maps", "geometry"] }],
  [PAST_TO_NOW, "Last week my mother taught at the {place}.", "This week my mother ______ (teach) at a different {place2} because a teacher there has the flu.", "is teaching",
    "This week is a temporary situation now, so use the present continuous: is teaching.",
    { place: ["school", "college", "lyceum", "centre"], place2: ["school", "college", "lyceum", "language centre"] }],
  [PAST_TO_NOW, "Last year my sister wore glasses.", "This month my sister ______ (wear) contact lenses for her {event} at the {place}.", "is wearing",
    "This month is a temporary situation now, so use the present continuous: is wearing.",
    { event: ["sports training", "dance classes", "swimming lessons", "football practice"], place: ["club", "gym", "pool", "stadium"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you are doing this month that is different from usual.", "am + -ing with this month",
    ["exactly one sentence", "must include this month", "must use I"]],
  ["Write one sentence about where a family member is staying or living for a short time.", "is staying or is living",
    ["exactly one sentence", "must name a family member", "must say why it is temporary"]],
  ["Write one sentence about a course or lesson you are taking these days.", "am taking or am studying",
    ["exactly one sentence", "must include these days", "must name the course or subject"]],
  ["Write one sentence about a friend who has a summer job.", "is working",
    ["exactly one sentence", "must include this summer", "must name the place of work"]],
  ["Write one sentence about the weather this week.", "is raining, is snowing or is getting",
    ["exactly one sentence", "must include this week", "must use the present continuous"]],
  ["Write one sentence about something two or more people are doing this year.", "are + -ing",
    ["exactly one sentence", "must include this year", "must use a plural subject"]],
  ["Write one sentence about a book, series or game you are enjoying at the moment, but not at this second.", "am reading, am watching or am playing",
    ["exactly one sentence", "must include at the moment", "must not be happening at this second"]],
  ["Write two sentences: first your usual situation, then a temporary situation this month.", "present simple, then present continuous",
    ["exactly two sentences", "first sentence present simple", "second sentence with this month and -ing"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write to a friend you haven't seen for a long time. Tell them what is different in your life these days. Write three or four sentences.",
    "present continuous for temporary situations", ["these days or this month", "am, is or are + -ing", "reasons with because"]],
  ["Describe a family member who is doing something unusual this year. Write three or four sentences.",
    "present continuous for a temporary situation", ["is + -ing", "this year", "how it is different from usual"]],
  ["Your town or school is changing for a short time (repairs, a festival, exams). Describe what is happening this month. Write three or four sentences.",
    "present continuous for temporary situations", ["this month or at the moment", "is or are + -ing", "a sense that it will end"]],
  ["Describe a project or course you are working on at the moment. Write three or four sentences.",
    "present continuous for situations around now", ["at the moment or these days", "am + -ing", "what you do for it each week"]],
  ["Compare your usual life with your life this summer or this term. Write three or four sentences.",
    "present simple for the usual, present continuous for the temporary", ["usually + present simple", "this summer or this term + -ing", "but to show the contrast"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.present.temporary-situation.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);