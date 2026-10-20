// Hand-authored: tenses / present / simple-vs-continuous (A2).
//
// Tests ONE point: in one context, the usual routine takes the present simple
// and the temporary change takes the present continuous. Every sentence holds
// both halves (routine + change), so each one has two time words by design —
// the contrast IS the topic, and the placement item has the same shape.
// The time words, subjects and verbs are never slotted.
//
// Distractors: the other tense (the real choice), a wrong agreement form, and
// a bare -ing with no be (the zero-copula error).
//
// Run: node tools/grammar-practice/authored/tenses.present.simple-vs-continuous.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "present", topic: "simple-vs-continuous", level: "A2", pv: "2.5" };

const ROUTINE = (m, f) => `${m} shows the usual routine, so use the present simple: ${f}.`;
const TEMP = (m, f) => `${m} shows a temporary change from the routine, so use the present continuous: ${f}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [marker, simple?, options (key first), prompt, slots]
const CHOOSE = [
  ["Usually", 1, ["goes", "is going", "go", "going"], "Aziz usually ______ to {place} by bus, but this week he is cycling because the weather is {weather}.",
    { place: ["work", "university", "school", "college"], weather: ["nice", "warm", "sunny", "lovely"] }],
  ["At the moment", 0, ["am drinking", "drink", "drinks", "drinking"], "I usually drink tea, but at the moment I ______ {drink} because I'm {state}.",
    { drink: ["coffee", "juice", "water", "hot milk"], state: ["tired", "ill", "cold", "sleepy"] }],
  ["This month", 0, ["is working", "works", "work", "working"], "My father works in an office, but this month he ______ from {place} because they are {reason}.",
    { place: ["home", "our flat", "my grandmother's house", "a café"], reason: ["painting the office", "repairing the building", "moving offices", "changing the computers"] }],
  ["Every evening", 1, ["studies", "is studying", "study", "studying"], "Madina ______ in the library every evening, but today she is studying at {place} with her {person}.",
    { place: ["home", "a café", "the park", "her aunt's flat"], person: ["sister", "cousin", "friend", "brother"] }],
  ["This week", 0, ["are eating", "eat", "is eating", "eating"], "We usually eat at home, but this week we ______ at the {place} near our {building}.",
    { place: ["café", "canteen", "teahouse", "restaurant"], building: ["office", "school", "university", "flat"] }],
  ["On Saturdays", 1, ["plays", "is playing", "play", "playing"], "Timur ______ football on Saturdays, but this Saturday he is helping his {person} at the {place}.",
    { person: ["father", "uncle", "grandfather", "brother"], place: ["market", "shop", "garage", "farm"] }],
  ["This week", 0, ["is taking", "takes", "take", "taking"], "My sister normally takes the {transport}, but this week she ______ a taxi because she has a {problem}.",
    { transport: ["metro", "bus", "minibus", "train"], problem: ["bad knee", "broken arm", "heavy bag", "cold"] }],
  ["Every Sunday", 1, ["visit", "am visiting", "visits", "visiting"], "I ______ my grandmother every Sunday, but this Sunday I am visiting my {person} in {city}.",
    { person: ["uncle", "aunt", "cousin", "friend"], city: ["Samarkand", "Bukhara", "Fergana", "Termez"] }],
  ["Today", 0, ["is speaking", "speaks", "speak", "speaking"], "Our teacher usually speaks fast, but today she ______ more slowly because there is a new {who} in the {room}.",
    { who: ["student", "boy", "girl", "classmate"], room: ["class", "group", "room", "classroom"] }],
  ["This summer", 1, ["teaches", "is teaching", "teach", "teaching"], "Dilshod ______ {subject} at a school, but this summer he is helping at his uncle's {place}.",
    { subject: ["maths", "English", "history", "physics"], place: ["hotel", "café", "shop", "farm"] }],
  ["This week", 0, ["is driving", "drives", "drive", "driving"], "The children usually walk to school, but this week their {person} ______ them in the car because of the {weather}.",
    { person: ["father", "mother", "uncle", "grandfather"], weather: ["snow", "rain", "cold", "ice"] }],
  ["Usually", 1, ["wakes up", "is waking up", "wake up", "waking up"], "My brother usually ______ at seven, but these days he is getting up at {time} because of his {event}.",
    { time: ["five", "six", "half past five", "5:30"], event: ["exams", "project", "new job", "online course"] }],
  ["This week", 0, ["am wearing", "wear", "wears", "wearing"], "I usually wear a {thing} to work, but this week I ______ a {thing2} because it's very hot.",
    { thing: ["jacket", "suit", "sweater", "coat"], thing2: ["T-shirt", "light shirt", "short-sleeved shirt", "cotton shirt"] }],
  ["Every Monday", 1, ["has", "is having", "have", "having"], "Nigora ______ {instrument} lessons every Monday, but this week she is resting because her {part} hurts.",
    { instrument: ["guitar", "piano", "violin", "drum"], part: ["hand", "finger", "arm", "wrist"] }],
  ["This year", 0, ["are staying", "stay", "is staying", "staying"], "Our family usually spends the summer in {place}, but this year we ______ in {city}.",
    { place: ["Chimgan", "the village", "the mountains", "Charvak"], city: ["Tashkent", "Samarkand", "Bukhara", "the city"] }],
  ["Usually", 1, ["does", "is doing", "do", "doing"], "Bobur usually ______ his homework in his room, but today he is sitting in the {place} because his {person} is sleeping.",
    { place: ["kitchen", "living room", "yard", "garden"], person: ["baby brother", "grandfather", "little sister", "father"] }],
  ["Tonight", 0, ["is cooking", "cooks", "cook", "cooking"], "My mother usually cooks dinner, but tonight my father ______ {food} for us because she is {state}.",
    { food: ["plov", "soup", "pasta", "eggs"], state: ["at work", "ill", "tired", "away"] }],
  ["Usually", 1, ["rides", "is riding", "ride", "riding"], "Sevara usually ______ her bike to college, but this week she is walking because her bike is at the {place} for {reason}.",
    { place: ["repair shop", "garage", "workshop", "mechanic's"], reason: ["repairs", "a new chain", "new brakes", "a check"] }],
  ["Normally", 1, ["lives", "is living", "live", "living"], "My uncle normally ______ in Moscow, but this year he is staying with us in {city} while he {action}.",
    { city: ["Tashkent", "Namangan", "Andijan", "Karshi"], action: ["looks for work", "finds a new flat", "studies", "visits relatives"] }],
  ["On Fridays", 1, ["run", "are running", "runs", "running"], "We ______ in the park on Fridays, but this week we are running in the {place} because the park is {state}.",
    { place: ["gym", "sports hall", "stadium", "school gym"], state: ["closed", "wet", "flooded", "muddy"] }],
].map(([m, simple, options, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0,
  why: simple ? ROUTINE(m, options[0]) : TEMP(m, options[0]), slots,
}));

/* ---------------- build: 20 gap_fill, two blanks ---------------- */
const INSTR_B = "Complete the sentence. Use the present simple for the routine and the present continuous for the temporary change.";
const BUILD = [
  [["walks", "is taking"], "Sardor usually ______ (walk) to {place}, but this week he ______ (take) the bus because of the {weather}.",
    { place: ["work", "school", "college", "the office"], weather: ["rain", "snow", "cold", "heat"] }],
  [["cook", "am eating"], "I normally ______ (cook) at home, but this week I ______ (eat) at the {place} because our {thing} is broken.",
    { place: ["canteen", "café", "teahouse", "university café"], thing: ["cooker", "stove", "oven", "gas cooker"] }],
  [["live", "are staying"], "My parents ______ (live) in {city}, but this month they ______ (stay) with us in {city2}.",
    { city: ["Fergana", "Namangan", "Andijan", "Khiva"], city2: ["Tashkent", "Samarkand", "Bukhara", "Chirchik"] }],
  [["goes", "is meeting"], "Lola usually ______ (go) to the gym after work, but today she ______ (meet) her {person} at the {place}.",
    { person: ["sister", "cousin", "old friend", "aunt"], place: ["café", "park", "station", "mall"] }],
  [["gives", "is preparing"], "Our {subject} teacher ______ (give) us homework every day, but this week she ______ (prepare) us for the {event} in class.",
    { subject: ["English", "maths", "history", "biology"], event: ["exam", "test", "olympiad", "concert"] }],
  [["plays", "is learning"], "Kamol ______ (play) the guitar every weekend, but this month he ______ (learn) the {instrument} with a {who}.",
    { instrument: ["piano", "violin", "drums", "dutar"], who: ["teacher", "tutor", "friend", "neighbour"] }],
  [["sleeps", "is getting"], "Usually my brother ______ (sleep) until eight, but this week he ______ (get) up at six for his {event}.",
    { event: ["new job", "exams", "training", "early lessons"] }],
  [["speaks", "is studying"], "Anna ______ (speak) Russian at home every day, but this year she ______ (study) {lang} at a {place}.",
    { lang: ["Uzbek", "English", "Korean", "Chinese"], place: ["language centre", "college", "university", "private school"] }],
  [["have", "are waiting"], "We usually ______ (have) lunch at one, but today we ______ (wait) for our {person} from {city}.",
    { person: ["uncle", "guests", "cousins", "grandparents"], city: ["Samarkand", "Bukhara", "Moscow", "Fergana"] }],
  [["stops", "is using"], "The bus usually ______ (stop) here, but this week it ______ (use) a different street because of the {work} on {street}.",
    { work: ["road works", "repairs", "building work", "new pipes"], street: ["Navoi Street", "Amir Temur Street", "our street", "the main road"] }],
  [["works", "is helping"], "Malika ______ (work) at a hotel all year, but this summer she ______ (help) at her aunt's {place} in {city}.",
    { place: ["shop", "café", "farm", "bakery"], city: ["Khiva", "Nukus", "Termez", "Jizzakh"] }],
  [["drives", "is riding"], "My dad usually ______ (drive) to work, but this week he ______ (ride) a bike because his {vehicle} is at the {place}.",
    { vehicle: ["car", "old car", "new car", "white car"], place: ["garage", "repair shop", "mechanic's", "car wash"] }],
  [["read", "am listening"], "I ______ (read) the news on my phone every morning, but this week I ______ (listen) to {audio} on the {transport}.",
    { audio: ["podcasts", "audiobooks", "the radio", "music"], transport: ["bus", "metro", "train", "minibus"] }],
  [["wears", "is trying"], "Ozoda usually ______ (wear) glasses, but today she ______ (try) contact lenses for her {event} at the {place}.",
    { event: ["photos", "dance class", "sports day", "performance"], place: ["school", "club", "studio", "college"] }],
  [["run", "are sitting"], "Normally the children ______ (run) around the yard after school, but this week they ______ (sit) inside and play {game} because of the {weather}.",
    { game: ["board games", "chess", "cards", "word games"], weather: ["rain", "cold", "snow", "wind"] }],
  [["teaches", "is writing"], "Javohir ______ (teach) English at a school, but this term he ______ (write) a {thing} for {who}.",
    { thing: ["textbook", "book", "course", "workbook"], who: ["new students", "children", "beginners", "teachers"] }],
  [["spend", "are building"], "Our neighbours usually ______ (spend) the summer at their {place}, but this year they ______ (build) a new {room}.",
    { place: ["dacha", "village house", "country house", "cottage"], room: ["kitchen", "garage", "bathroom", "balcony"] }],
  [["watches", "is visiting"], "My grandfather ______ (watch) the news at nine every night, but tonight he ______ (visit) his old {person} in {district}.",
    { person: ["friend", "colleague", "neighbour", "classmate"], district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"] }],
  [["study", "am attending"], "Usually I ______ (study) at night, but this month I ______ (attend) a {course} at the {place}.",
    { course: ["dance class", "cooking course", "driving course", "music class"], place: ["city centre", "club", "college", "youth centre"] }],
  [["buys", "is bringing"], "Bekzod usually ______ (buy) bread from the bakery, but this week his {person} ______ (bring) it from the {place}.",
    { person: ["mother", "sister", "father", "grandmother"], place: ["bazaar", "market", "village", "other bakery"] }],
].map(([key, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key,
  why: `The first verb is the usual routine, so it takes the present simple: ${key[0]}. The second is a temporary change, so it takes the present continuous: ${key[1]}.`,
  slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TO_TEMP = "The first sentence is the usual routine. Complete the second sentence about a temporary change.";
const TO_ROUTINE = "The first sentence is a temporary change. Complete the second sentence about the usual routine.";
const NEW_SUBJ = "Rewrite the sentence with the new subject. Keep the routine and the temporary change.";
const TRANSFORM = [
  // routine -> temporary (5)
  [TO_TEMP, "Aziz walks to {place} with his {person} every day.", "This week Aziz ______ (walk) to {place} alone. His {person} has a cold.", "is walking",
    "This week is a temporary change, so use the present continuous: is walking.",
    { place: ["school", "college", "work", "the gym"], person: ["brother", "friend", "cousin", "sister"] }],
  [TO_TEMP, "My mother cooks {food} at home every evening.", "This week my mother ______ (cook) {food} at my {place}. Our kitchen has no gas.", "is cooking",
    "This week is different from the routine, so use the present continuous: is cooking.",
    { food: ["plov", "soup", "rice", "pasta"], place: ["aunt's flat", "grandmother's house", "neighbour's flat", "cousin's flat"] }],
  [TO_TEMP, "We have English lessons in room {num} every week.", "This month we ______ (have) English lessons in the {place}. Room {num} has no heating.", "are having",
    "This month is a temporary change, so use the present continuous: are having.",
    { num: ["12", "7", "25", "104"], place: ["library", "hall", "computer room", "big classroom"] }],
  [TO_TEMP, "I sleep in my own room every night.", "This week I ______ (sleep) in the {room} because my {person} is visiting.", "am sleeping",
    "This week is a temporary change, so use the present continuous: am sleeping.",
    { room: ["living room", "kitchen", "hall", "small room"], person: ["grandmother", "uncle", "aunt", "cousin"] }],
  [TO_TEMP, "Shahzoda works at the {place} on weekdays.", "This month Shahzoda ______ (work) at the {place2} because her boss needs help there.", "is working",
    "This month is a temporary change, so use the present continuous: is working.",
    { place: ["bank", "main office", "hospital", "head office"], place2: ["new office", "branch in Chirchik", "office near the airport", "other office"] }],
  // temporary -> routine (5)
  [TO_ROUTINE, "This week Lola is getting up at six for her {event}.", "Lola usually ______ (get) up at {time} on weekdays.", "gets",
    "Usually shows the routine, so use the present simple: gets.",
    { event: ["exams", "early training", "new job", "trip"], time: ["eight", "half past seven", "7:30", "nine"] }],
  [TO_ROUTINE, "Today Rustam is driving his father's car.", "Rustam usually ______ (drive) his own {vehicle} to {place}.", "drives",
    "Usually shows the routine, so use the present simple: drives.",
    { vehicle: ["car", "old car", "small car", "van"], place: ["work", "college", "the market", "his office"] }],
  [TO_ROUTINE, "This month we are eating at the {place} near the office.", "We normally ______ (eat) at home with the {who}.", "eat",
    "Normally shows the routine, so use the present simple. We takes the base form: eat.",
    { place: ["canteen", "café", "teahouse", "restaurant"], who: ["family", "children", "kids", "whole family"] }],
  [TO_ROUTINE, "These days my brother is wearing a {thing} to work.", "My brother usually ______ (wear) a {thing2} to work.", "wears",
    "Usually shows the routine, so use the present simple: wears.",
    { thing: ["suit", "white shirt", "tie", "uniform"], thing2: ["T-shirt", "sweater", "jacket", "hoodie"] }],
  [TO_ROUTINE, "Today Ziyoda is speaking {lang} with the {who}.", "Ziyoda normally ______ (speak) Uzbek with her {person}.", "speaks",
    "Normally shows the routine, so use the present simple: speaks.",
    { lang: ["English", "Russian", "Korean", "Turkish"], who: ["guests", "tourists", "visitors", "new students"], person: ["family", "friends", "colleagues", "parents"] }],
  // new subject, both halves (5)
  [NEW_SUBJ, "I usually take the metro, but this week I'm walking to {place} with my {person}.", "My sister usually ______ (take) the metro, but this week she ______ (walk) to {place} with her {person}.", ["takes", "is walking"],
    "My sister is singular: takes for the routine, is walking for the temporary change.",
    { place: ["work", "college", "school", "the office"], person: ["friend", "cousin", "classmate", "colleague"] }],
  [NEW_SUBJ, "We usually eat {food} on Fridays, but today we're having {food2}.", "Our neighbour usually ______ (eat) {food} on Fridays, but today he ______ (have) {food2}.", ["eats", "is having"],
    "Our neighbour is singular: eats for the routine, is having for today.",
    { food: ["plov", "manti", "lagman", "shashlik"], food2: ["soup", "pasta", "salad", "fish"] }],
  [NEW_SUBJ, "My parents usually watch TV at night, but this week they're reading {thing} in the {room}.", "My grandfather usually ______ (watch) TV at night, but this week he ______ (read) {thing} in the {room}.", ["watches", "is reading"],
    "My grandfather is singular: watches for the routine, is reading for this week.",
    { thing: ["books", "a novel", "old letters", "magazines"], room: ["garden", "kitchen", "living room", "bedroom"] }],
  [NEW_SUBJ, "Olga usually works in {city}, but this month she's working in {city2}.", "Olga and her husband usually ______ (work) in {city}, but this month they ______ (work) in {city2}.", ["work", "are working"],
    "Olga and her husband are two people: work for the routine, are working for this month.",
    { city: ["Tashkent", "Moscow", "Almaty", "Samarkand"], city2: ["Bukhara", "Fergana", "Khiva", "Nukus"] }],
  [NEW_SUBJ, "Timur usually plays {sport} after school, but this week he's studying for his {event}.", "Timur and Bobur usually ______ (play) {sport} after school, but this week they ______ (study) for their {event}.", ["play", "are studying"],
    "Timur and Bobur are two people: play for the routine, are studying for this week.",
    { sport: ["football", "basketball", "volleyball", "tennis"], event: ["exams", "test", "olympiad", "finals"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what you usually do in the morning and what is different this week.", "present simple and present continuous in one sentence",
    ["exactly one sentence", "must include usually", "must include this week"]],
  ["Write one sentence about how a family member usually travels to work and how they are travelling today.", "present simple + present continuous",
    ["exactly one sentence", "must include today", "must name a family member"]],
  ["Write one sentence about where a friend usually lives and where they are staying this month.", "lives or live + is staying or are staying",
    ["exactly one sentence", "must include this month", "must use but"]],
  ["Write one sentence about what you usually eat for lunch and what you are eating this week.", "eat + am eating",
    ["exactly one sentence", "must use I", "must include this week"]],
  ["Write one sentence about a teacher's normal routine and a temporary change.", "present simple + present continuous",
    ["exactly one sentence", "must be about a teacher", "must include normally or usually"]],
  ["Write one sentence about a sport or hobby you usually do and what you are doing instead these days.", "present simple + present continuous",
    ["exactly one sentence", "must include these days", "must use but"]],
  ["Write one sentence about a shop, bus or lesson that is different from usual this week.", "present simple + present continuous",
    ["exactly one sentence", "must be about a thing, not a person", "must include this week"]],
  ["Write two sentences: first your usual weekend routine, then what you are doing differently this weekend.", "present simple in the first sentence, present continuous in the second",
    ["exactly two sentences", "first sentence present simple", "second sentence present continuous"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Your life is different this month. Describe your usual routine and what is different now. Write three or four sentences.",
    "present simple for routine, present continuous for temporary change", ["usually or every day", "this month or these days", "both tenses used correctly"]],
  ["Write a message to a friend: say what you normally do on Saturdays and why this Saturday is different. Write three or four sentences.",
    "present simple + present continuous", ["normally or usually", "this Saturday", "but to show the contrast"]],
  ["Describe a family member who has a temporary job or project. What do they usually do, and what are they doing now? Write three or four sentences.",
    "present simple + present continuous", ["-s with he or she", "is + -ing for the change", "time words for each tense"]],
  ["Describe how your school or work is different during exam time. Write three or four sentences.",
    "present simple for normal days, present continuous for exam time", ["normally or usually", "this week or at the moment", "both tenses"]],
  ["Imagine you are on holiday. Compare your normal day with your holiday day. Write three or four sentences.",
    "present simple + present continuous", ["usual habits in the present simple", "holiday activities in the present continuous", "but or however"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.present.simple-vs-continuous.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);