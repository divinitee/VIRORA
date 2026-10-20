// Hand-authored: tenses / past / simple-finished-time (A2).
//
// Tests ONE point: the past simple with a finished-time marker (last night,
// yesterday, two days ago, in 2020). The marker is never slotted.
//
// Distractors: the present perfect (the main error: "I have seen him
// yesterday", common with Russian speakers, who have one past form), the
// present simple and the present continuous. No marker used here can also
// take the present perfect ("this morning" and "today" are avoided).
//
// Run: node tools/grammar-practice/authored/tenses.past.simple-finished-time.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "past", topic: "simple-finished-time", level: "A2", pv: "2.5" };
const why = (marker, past) => `${marker} is a finished time, so use the past simple, not the present perfect: ${past}.`;

/* ---------------- choose: 20 mcq [past, perfect, present, continuous] ---------------- */
const CHOOSE = [
  ["Last night", ["went", "have gone", "go", "are going"], "We ______ to the {place} last night with our {person}.",
    { place: ["cinema", "theatre", "circus", "concert"], person: ["cousins", "parents", "friends", "teacher"] }],
  ["Two days ago", ["passed", "has passed", "passes", "is passing"], "My brother ______ his {test} two days ago at the {place}.",
    { test: ["driving test", "maths exam", "IELTS test", "English exam"], place: ["centre", "college", "university", "school"] }],
  ["Yesterday", ["met", "have met", "meet", "am meeting"], "I ______ {name} at the {place} yesterday.",
    { name: ["Aziz", "Olga", "Bobur", "Nigora"], place: ["market", "bus stop", "gym", "library"] }],
  ["In 2020", ["lived", "has lived", "lives", "is living"], "Kamila ______ in {city} in 2020 with her {person}.",
    { city: ["Moscow", "Seoul", "Istanbul", "Almaty"], person: ["parents", "family", "aunt", "grandparents"] }],
  ["Last month", ["bought", "have bought", "buy", "are buying"], "They ______ a new {thing} last month for their {room}.",
    { thing: ["sofa", "carpet", "TV", "table"], room: ["living room", "kitchen", "flat", "bedroom"] }],
  ["Yesterday evening", ["started", "has started", "starts", "is starting"], "The {event} ______ at 8 o'clock yesterday evening in the {place}.",
    { event: ["concert", "film", "show", "meeting"], place: ["park", "big hall", "school", "centre"] }],
  ["Last week", ["visited", "have visited", "visit", "are visiting"], "My grandparents ______ us last week and brought {food} from {city}.",
    { food: ["melons", "grapes", "bread", "apricots"], city: ["Fergana", "Samarkand", "Khorezm", "Bukhara"] }],
  ["Last Monday", ["lost", "has lost", "loses", "is losing"], "Sardor ______ his {thing} on the {transport} last Monday.",
    { thing: ["phone", "wallet", "keys", "gloves"], transport: ["bus", "metro", "train", "tram"] }],
  ["The day before yesterday", ["watched", "have watched", "watch", "am watching"], "I ______ a {show} about {topic} on TV the day before yesterday.",
    { show: ["film", "show", "documentary", "cartoon"], topic: ["animals", "space", "history", "Japan"] }],
  ["An hour ago", ["finished", "have finished", "finish", "are finishing"], "We ______ our {task} an hour ago and gave it to the {person}.",
    { task: ["project", "homework", "essay", "report"], person: ["teacher", "director", "manager", "coach"] }],
  ["In 2019", ["got", "has got", "gets", "is getting"], "Nodira ______ her first {thing} in 2019 from her {person}.",
    { thing: ["phone", "bike", "laptop", "watch"], person: ["father", "uncle", "mother", "grandmother"] }],
  ["Last Saturday", ["closed", "has closed", "closes", "is closing"], "The shop ______ early last Saturday because of the {event} on {street}.",
    { event: ["festival", "concert", "holiday", "celebration"], street: ["Navoi Street", "our street", "the main street", "Amir Temur Street"] }],
  ["In 2010", ["moved", "have moved", "move", "are moving"], "My parents ______ to {city} in 2010 for my father's {thing}.",
    { city: ["Tashkent", "Samarkand", "Namangan", "Karshi"], thing: ["job", "new job", "work", "studies"] }],
  ["Last year", ["played", "have played", "play", "am playing"], "I ______ {sport} for the school team last year with my {person}.",
    { sport: ["football", "volleyball", "basketball", "chess"], person: ["best friend", "cousin", "brother", "classmate"] }],
  ["Last weekend", ["helped", "has helped", "helps", "is helping"], "Last weekend, Otabek ______ his {person} with the {thing}.",
    { person: ["father", "uncle", "neighbour", "grandmother"], thing: ["garden", "shopping", "car", "cleaning"] }],
  ["Last summer", ["took", "have taken", "take", "are taking"], "We ______ a lot of photos in {city} last summer with my {device}.",
    { city: ["Khiva", "Bukhara", "Samarkand", "Istanbul"], device: ["phone", "camera", "tablet", "brother's camera"] }],
  ["Two weeks ago", ["sang", "has sung", "sings", "is singing"], "Two weeks ago, my sister ______ a {thing} at the {place}.",
    { thing: ["song", "solo", "folk song", "new song"], place: ["school concert", "wedding", "party", "festival"] }],
  ["Yesterday morning", ["arrived", "has arrived", "arrives", "is arriving"], "The bus ______ late yesterday morning because of the {weather} on {road}.",
    { weather: ["snow", "rain", "fog", "ice"], road: ["the bridge", "the main road", "the motorway", "our street"] }],
  ["Last Tuesday", ["sent", "have sent", "send", "am sending"], "I ______ a letter to my {person} in {city} last Tuesday.",
    { person: ["aunt", "grandfather", "cousin", "friend"], city: ["Moscow", "London", "Seoul", "Almaty"] }],
  ["In 2023", ["opened", "has opened", "opens", "is opening"], "In 2023, our school ______ a new {room} for the {who}.",
    { room: ["library", "gym", "computer room", "canteen"], who: ["students", "children", "teachers", "older students"] }],
].map(([m, options, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: why(m, options[0]), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the correct form of the verb in brackets. Look at the time words.";
const BUILD = [
  ["Last year", "studied", "Last year, my cousin ______ (study) {subject} at a college in {city}.",
    { subject: ["law", "medicine", "IT", "economics"], city: ["Tashkent", "Samarkand", "Moscow", "Seoul"] }],
  ["Yesterday", "cleaned", "Yesterday, we ______ (clean) the whole {place} before the {event}.",
    { place: ["flat", "house", "classroom", "yard"], event: ["party", "holiday", "wedding", "visit"] }],
  ["Three days ago", "called", "Three days ago, Aziz ______ (call) his {person} from {city}.",
    { person: ["mother", "brother", "teacher", "boss"], city: ["Moscow", "Seoul", "Istanbul", "Almaty"] }],
  ["Last winter", "snowed", "Last winter, it ______ (snow) a lot in {city}, and the {place} were closed.",
    { city: ["Tashkent", "Jizzakh", "Namangan", "Karshi"], place: ["schools", "roads", "parks", "markets"] }],
  ["In 2021", "opened", "In 2021, my uncle ______ (open) a small {shop} near the {place}.",
    { shop: ["café", "shop", "bakery", "garage"], place: ["market", "station", "school", "park"] }],
  ["Last Sunday", "cooked", "Last Sunday, the girls ______ (cook) {food} for their {person}.",
    { food: ["plov", "soup", "manti", "pasta"], person: ["parents", "grandmother", "teacher", "guests"] }],
  ["An hour ago", "saw", "An hour ago, I ______ (see) {name} at the {place}.",
    { name: ["Sardor", "Anna", "Malika", "Oleg"], place: ["market", "metro station", "gym", "bank"] }],
  ["Last night", "came", "Last night, my father ______ (come) home late from the {place} because of the {reason}.",
    { place: ["office", "factory", "hospital", "bank"], reason: ["traffic", "snow", "rain", "meeting"] }],
  ["The day before yesterday", "lost", "The day before yesterday, Laylo ______ (lose) her {thing} at the {place}.",
    { thing: ["phone", "keys", "purse", "ticket"], place: ["market", "station", "cinema", "park"] }],
  ["Last month", "went", "Last month, our class ______ (go) on a trip to {city} by {transport}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Shakhrisabz"], transport: ["train", "bus", "car", "minibus"] }],
  ["In 2018", "lived", "In 2018, my family ______ (live) in a small flat in {district} near the {place}.",
    { district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"], place: ["metro", "market", "park", "school"] }],
  ["Last weekend", "finished", "Last weekend, I ______ (finish) a {thing} about {topic}.",
    { thing: ["book", "long article", "project", "series"], topic: ["space", "history", "football", "animals"] }],
  ["Two years ago", "started", "Two years ago, Malika ______ (start) learning {lang} at a {place}.",
    { lang: ["English", "Korean", "German", "Turkish"], place: ["language centre", "college", "school", "summer camp"] }],
  ["Yesterday afternoon", "played", "Yesterday afternoon, the children ______ (play) in the {place} with their {pet}.",
    { place: ["park", "yard", "garden", "street"], pet: ["dog", "cat", "puppy", "friends"] }],
  ["Last Friday", "made", "Last Friday, my mother ______ (make) {food} for the whole {group}.",
    { food: ["plov", "samsa", "soup", "cake"], group: ["family", "class", "street", "team"] }],
  ["Last week", "fixed", "Last week, Javohir ______ (fix) his {person}'s {thing}.",
    { person: ["brother", "sister", "neighbour", "father"], thing: ["bike", "phone", "computer", "lamp"] }],
  ["Last August", "visited", "Last August, we ______ (visit) our relatives in {city} and stayed at their {home}.",
    { city: ["Fergana", "Bukhara", "Khiva", "Termez"], home: ["house", "flat", "dacha", "village house"] }],
  ["Last night", "watched", "Last night, I ______ (watch) a {thing} with my {person}.",
    { thing: ["film", "match", "cartoon", "concert"], person: ["brother", "parents", "friends", "grandfather"] }],
  ["Last Saturday", "won", "Last Saturday, Dilnoza ______ (win) a prize for her {thing} at the {event}.",
    { thing: ["drawing", "poem", "story", "project"], event: ["festival", "competition", "school fair", "olympiad"] }],
  ["Last spring", "planted", "Last spring, my grandfather ______ (plant) {plants} in his {place}.",
    { plants: ["apple trees", "tomatoes", "flowers", "grapes"], place: ["garden", "yard", "dacha", "village garden"] }],
].map(([m, key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: why(m, key), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PERF = "The first sentence has no time. Complete the second sentence: it has a finished time.";
const ROUTINE = "The first sentence is a routine. Complete the second sentence about one finished time.";
const PLAN = "The first sentence is a plan. Now it is finished: complete the second sentence.";
const TRANSFORM = [
  [PERF, "I have visited {city}.", "I ______ (visit) {city} last summer with my {person}.", "visited",
    { city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"], person: ["family", "class", "cousins", "friends"] }],
  [PERF, "My sister has bought a new {thing}.", "My sister ______ (buy) a new {thing} two days ago at the {place}.", "bought",
    { thing: ["phone", "bag", "jacket", "laptop"], place: ["market", "mall", "shop", "bazaar"] }],
  [PERF, "We have seen this {show}.", "We ______ (see) this {show} last week at the {place}.", "saw",
    { show: ["film", "play", "cartoon", "show"], place: ["cinema", "theatre", "school", "park"] }],
  [PERF, "Bobur has passed his {test}.", "Bobur ______ (pass) his {test} last May at the {place}.", "passed",
    { test: ["driving test", "maths exam", "English exam", "IELTS test"], place: ["centre", "college", "school", "university"] }],
  [PERF, "They have moved to a new {home}.", "They ______ (move) to a new {home} in {district} in 2022.", "moved",
    { home: ["flat", "house", "building", "street"], district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"] }],
  [ROUTINE, "Every day Ali walks to {place}.", "Yesterday Ali ______ (walk) to {place} with his {person}.", "walked",
    { place: ["school", "college", "work", "the gym"], person: ["brother", "friend", "father", "classmate"] }],
  [ROUTINE, "My mother usually cooks {food} on Sundays.", "Last Sunday my mother ______ (cook) {food} for our {person}.", "cooked",
    { food: ["plov", "manti", "soup", "samsa"], person: ["guests", "grandparents", "neighbours", "cousins"] }],
  [ROUTINE, "Zarina often plays {sport} after school.", "Yesterday Zarina ______ (play) {sport} in the {place}.", "played",
    { sport: ["tennis", "volleyball", "basketball", "chess"], place: ["park", "school gym", "yard", "sports centre"] }],
  [ROUTINE, "We usually have lunch at the {place}.", "Last Friday we ______ (have) lunch at the {place} with {name}.", "had",
    { place: ["canteen", "café", "office", "park"], name: ["Aziz", "Olga", "Bobur", "Nigora"] }],
  [ROUTINE, "Timur usually takes the {transport} to work.", "Yesterday Timur ______ (take) the {transport} to work because of the {reason}.", "took",
    { transport: ["bus", "metro", "minibus", "tram"], reason: ["rain", "snow", "traffic", "cold"] }],
  [PLAN, "I'm going to call my {person} tomorrow.", "I ______ (call) my {person} yesterday about the {thing}.", "called",
    { person: ["aunt", "teacher", "grandmother", "cousin"], thing: ["party", "test", "trip", "wedding"] }],
  [PLAN, "We're going to paint the {room} next week.", "We ______ (paint) the {room} {colour} last week.", "painted",
    { room: ["kitchen", "bedroom", "hall", "classroom"], colour: ["white", "yellow", "light blue", "green"] }],
  [PLAN, "Nigora is going to send the {thing} tomorrow.", "Nigora ______ (send) the {thing} to her {person} yesterday.", "sent",
    { thing: ["parcel", "letter", "photos", "documents"], person: ["sister", "teacher", "boss", "cousin"] }],
  [PLAN, "They're going to sell their {thing} next month.", "They ______ (sell) their {thing} to a {person} last month.", "sold",
    { thing: ["car", "flat", "sofa", "bike"], person: ["neighbour", "friend", "young family", "teacher"] }],
  [PLAN, "I'm going to clean my {room} at the weekend.", "I ______ (clean) my {room} last weekend with my {person}.", "cleaned",
    { room: ["room", "flat", "car", "desk"], person: ["brother", "sister", "mother", "friend"] }],
].map(([instr, source, hint, key, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key,
  why: `The second sentence has a finished time, so use the past simple: ${key}.`, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you did last night.", "past simple + last night", ["exactly one sentence", "must include last night", "must use I"]],
  ["Write one sentence about a place you visited in a past year.", "past simple + in + year", ["exactly one sentence", "must include in and a year", "must name the place"]],
  ["Write one sentence about something a friend did two days ago.", "past simple + ago", ["exactly one sentence", "must include two days ago", "must name the friend"]],
  ["Write one sentence about the weather last weekend.", "past simple + last weekend", ["exactly one sentence", "must include last weekend", "must use was or a past verb"]],
  ["Write one sentence about when you started learning English.", "started + finished time", ["exactly one sentence", "must use started", "must include a finished time"]],
  ["Write one sentence about a film or match you watched last week.", "watched + last week", ["exactly one sentence", "must include last week", "must use watched"]],
  ["Write one sentence about something your family bought last month.", "bought + last month", ["exactly one sentence", "must include last month", "must name the thing"]],
  ["Write two sentences: one with I have ever... and one about the time you did it, with a finished time.", "present perfect, then past simple", ["exactly two sentences", "first sentence present perfect", "second sentence past simple + finished time"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your last birthday. Write three or four sentences.", "past simple with finished times", ["last year or a date", "past simple verbs", "no present perfect with a finished time"]],
  ["Write about the first day at a new school, college or job. Write three or four sentences.", "past simple with finished times", ["in + year or ago", "past simple verbs", "what you did and felt"]],
  ["Tell a friend what you did last weekend, day by day. Write three or four sentences.", "past simple with finished times", ["on Saturday, on Sunday", "past simple verbs", "different activities"]],
  ["Write about a trip you took a few years ago. Write three or four sentences.", "past simple with finished times", ["ago or in + year", "went, saw, stayed", "no present perfect"]],
  ["Describe an important day in your family's history. Write three or four sentences.", "past simple with finished times", ["in + year", "moved, started, opened, met", "past simple throughout"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.past.simple-finished-time.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);