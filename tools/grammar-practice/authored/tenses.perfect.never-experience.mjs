// Hand-authored: tenses / perfect / never-experience (A2).
//
// Tests ONE point: has/have never + PAST PARTICIPLE for "no experience in my
// life" ("My grandmother has never flown on a plane").
//
// Choose distractors: never + past form (never flew: the main error, since
// many participles are new at A2), never + base form, and "ever" for "never"
// (ever in a positive statement is ungrammatical). Only verbs whose
// participle differs from the past form are used in choose.
//
// Run: node tools/grammar-practice/authored/tenses.perfect.never-experience.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "never-experience", level: "A2", pv: "2.5" };
const why = (pp) => `After has/have never, use the past participle: never ${pp}.`;

/* ---------------- choose: 20 mcq [base, past, participle] ---------------- */
const CHOOSE = [
  ["fly", "flew", "flown", "My grandmother has ______ on a plane to {city} or {city2}.",
    { city: ["Moscow", "Seoul", "Dubai", "Istanbul"], city2: ["London", "Paris", "Almaty", "Rome"] }],
  ["eat", "ate", "eaten", "I have ______ {food}, but my {person} loves it.",
    { food: ["sushi", "pizza", "Korean food", "fish soup"], person: ["brother", "sister", "father", "cousin"] }],
  ["see", "saw", "seen", "Our children have ______ the sea, so we want to go to {country} with our {person}.",
    { country: ["Turkey", "Egypt", "Georgia", "Thailand"], person: ["family", "cousins", "friends", "parents"] }],
  ["ride", "rode", "ridden", "Aziz has ______ a {animal}, but he wants to try it in the {place}.",
    { animal: ["horse", "camel", "donkey", "pony"], place: ["village", "desert", "mountains", "park"] }],
  ["swim", "swam", "swum", "My father has ______ in the sea, only in the {place} near {city}.",
    { place: ["river", "lake", "pool", "reservoir"], city: ["Tashkent", "Chirchiq", "Fergana", "Namangan"] }],
  ["drive", "drove", "driven", "My mother has ______ a car, so she takes the {transport} to {place}.",
    { transport: ["bus", "metro", "taxi", "minibus"], place: ["work", "the market", "the hospital", "the bank"] }],
  ["write", "wrote", "written", "Sardor has ______ a letter by hand to his {person} in {city}.",
    { person: ["grandmother", "aunt", "friend", "cousin"], city: ["Khiva", "Termez", "Nukus", "Moscow"] }],
  ["speak", "spoke", "spoken", "I have ______ English with a tourist in the {place} or at the {place2}.",
    { place: ["old town", "market", "street", "park"], place2: ["airport", "hotel", "station", "museum"] }],
  ["break", "broke", "broken", "Lucky boy! Bobur has ______ his {part}, and he plays {sport} every day.",
    { part: ["arm", "leg", "finger", "nose"], sport: ["football", "basketball", "volleyball", "hockey"] }],
  ["take", "took", "taken", "We have ______ the night train to {city} with our {person}.",
    { city: ["Bukhara", "Khiva", "Termez", "Nukus"], person: ["family", "class", "friends", "cousins"] }],
  ["wear", "wore", "worn", "My brother has ______ a {clothes}, not even at his {person}'s wedding.",
    { clothes: ["suit", "tie", "white shirt", "national hat"], person: ["cousin", "friend", "uncle", "sister"] }],
  ["drink", "drank", "drunk", "Malika has ______ {drink}, but she wants to try it at the {place}.",
    { drink: ["camel milk", "coffee", "ayran", "kefir"], place: ["market", "café", "village", "festival"] }],
  ["forget", "forgot", "forgotten", "Timur has ______ his {person}'s birthday, not once in {num} years.",
    { person: ["mother", "sister", "father", "grandmother"], num: ["ten", "twenty", "fifteen", "thirty"] }],
  ["sing", "sang", "sung", "Nigora has ______ on stage, but she sings at home with her {person} in the {room}.",
    { person: ["sister", "mother", "cousin", "friend"], room: ["kitchen", "bedroom", "living room", "garden"] }],
  ["give", "gave", "given", "Our teacher has ______ us a test on a {day}, only on {day2}.",
    { day: ["Friday", "Saturday", "Monday", "holiday"], day2: ["Wednesdays", "Thursdays", "Tuesdays", "weekdays"] }],
  ["fall", "fell", "fallen", "My little sister has ______ off her {vehicle} in the {place}.",
    { vehicle: ["bike", "scooter", "skateboard", "horse"], place: ["park", "yard", "street", "village"] }],
  ["grow", "grew", "grown", "My parents have ______ {plant} in our {place}, only flowers.",
    { plant: ["melons", "tomatoes", "potatoes", "cucumbers"], place: ["garden", "yard", "dacha", "village garden"] }],
  ["throw", "threw", "thrown", "Kamol has ______ food on the {place} in the {room}.",
    { place: ["floor", "ground", "table", "carpet"], room: ["canteen", "kitchen", "classroom", "café"] }],
  ["be", "was", "been", "My cousins have ______ to {city}, but they want to go with their {person}.",
    { city: ["Khiva", "Bukhara", "Samarkand", "Shakhrisabz"], person: ["parents", "class", "friends", "uncle"] }],
  ["do", "did", "done", "I have ______ a {thing}, but I want to try it with my {person}.",
    { thing: ["marathon", "cooking class", "bungee jump", "dance class"], person: ["friends", "brother", "class", "father"] }],
].map(([b, past, pp, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: [`never ${pp}`, `never ${past}`, `never ${b}`, `ever ${pp}`], key: 0, why: why(pp), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the past participle of the verb in brackets.";
const BUILD = [
  ["seen", "My little brother has never ______ (see) {thing} in {city}.", { thing: ["snow", "a big storm", "a desert", "the mountains"], city: ["Termez", "Tashkent", "Nukus", "Samarkand"] }],
  ["eaten", "Olga has never ______ (eat) {food} at a {place}.", { food: ["plov", "manti", "shashlik", "samsa"], place: ["wedding", "café", "friend's house", "market"] }],
  ["been", "We have never ______ (be) to the old town in {city} with our {person}.", { city: ["Khiva", "Bukhara", "Samarkand", "Shakhrisabz"], person: ["family", "class", "friends", "cousins"] }],
  ["flown", "Javlon has never ______ (fly) to {city} on a {trip}.", { city: ["Seoul", "Dubai", "Moscow", "London"], trip: ["holiday", "work trip", "school trip", "short trip"] }],
  ["played", "My grandfather has never ______ (play) {game} on a {device}.", { game: ["chess", "games", "cards", "quizzes"], device: ["phone", "computer", "tablet", "laptop"] }],
  ["won", "Our {team} has never ______ (win) the {competition}.", { team: ["football team", "class", "school team", "volleyball team"], competition: ["city cup", "final", "big match", "school cup"] }],
  ["met", "I have never ______ (meet) my {person} from {city}.", { person: ["cousin", "aunt", "uncle", "grandfather"], city: ["Moscow", "Seoul", "Almaty", "Istanbul"] }],
  ["ridden", "Dilnoza has never ______ (ride) a {vehicle} in the {place}.", { vehicle: ["bike", "scooter", "horse", "motorbike"], place: ["city", "village", "park", "street"] }],
  ["cooked", "My brothers have never ______ (cook) {food} for our {person}.", { food: ["plov", "soup", "dinner", "breakfast"], person: ["mother", "family", "grandparents", "guests"] }],
  ["tried", "Sevara has never ______ (try) {food} from {country}.", { food: ["soup", "bread", "sweets", "noodles"], country: ["Korea", "Japan", "Turkey", "Georgia"] }],
  ["read", "I have never ______ (read) a book about {topic} in {lang}.", { topic: ["space", "history", "animals", "sport"], lang: ["English", "Russian", "Korean", "German"] }],
  ["lost", "My sister has never ______ (lose) her {thing} at the {place}.", { thing: ["phone", "keys", "bag", "wallet"], place: ["market", "station", "café", "airport"] }],
  ["slept", "Akmal has never ______ (sleep) in a {place} in the {area}.", { place: ["tent", "yurt", "small hotel", "camp"], area: ["mountains", "desert", "forest", "countryside"] }],
  ["climbed", "Our class has never ______ (climb) a mountain near {place} with a {who}.", { place: ["Chimgan", "Zomin", "Boysun", "Charvak"], who: ["guide", "teacher", "group", "club"] }],
  ["sent", "My grandmother has never ______ (send) a {thing} to her {person}.", { thing: ["text message", "photo", "voice message", "video"], person: ["grandson", "sister", "friend", "neighbour"] }],
  ["taught", "Mr Karimov has never ______ (teach) {subject} at the {place}.", { subject: ["maths", "history", "music", "art"], place: ["college", "school", "lyceum", "centre"] }],
  ["bought", "We have never ______ (buy) a {thing} at the {place}.", { thing: ["phone", "bike", "jacket", "lamp"], place: ["market", "mall", "bazaar", "big shop"] }],
  ["watched", "My parents have never ______ (watch) a {event} at the {place}.", { event: ["football match", "concert", "show", "basketball game"], place: ["stadium", "big hall", "park", "sports centre"] }],
  ["worked", "Gulnora has never ______ (work) in a {place} in the {season}.", { place: ["café", "hotel", "shop", "summer camp"], season: ["summer", "holidays", "winter", "evenings"] }],
  ["heard", "I have never ______ (hear) this {thing} on the {where}.", { thing: ["song", "story", "name", "word"], where: ["radio", "TV", "internet", "street"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: why(key), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NEG = "Rewrite the sentence with never. Keep the meaning.";
const ANSWER = "Answer the question with never.";
const NEW_SUBJ = "Rewrite the sentence with the new subject. Use has or have and never.";
const TRANSFORM = [
  [NEG, "I haven't seen a {animal} in my life.", "I have never ______ (see) a {animal} in the {place}.", "seen",
    { animal: ["camel", "bear", "tiger", "wolf"], place: ["zoo", "mountains", "desert", "forest"] }],
  [NEG, "Aziz hasn't eaten {food} in his life.", "Aziz has never ______ (eat) {food} at a {place}.", "eaten",
    { food: ["sushi", "pizza", "Korean food", "fish soup"], place: ["café", "restaurant", "party", "friend's house"] }],
  [NEG, "We haven't been to {city} in our lives.", "We have never ______ (be) to {city} with our {person}.", "been",
    { city: ["Khiva", "Bukhara", "Istanbul", "Almaty"], person: ["family", "class", "friends", "cousins"] }],
  [NEG, "My aunt hasn't driven a car in her life.", "My aunt has never ______ (drive) a car on the {road} to {city}.", "driven",
    { road: ["motorway", "mountain road", "old road", "main road"], city: ["Samarkand", "Fergana", "Bukhara", "Jizzakh"] }],
  [NEG, "Laylo hasn't swum in the sea in her life.", "Laylo has never ______ (swim) in the {place} in {season}.", "swum",
    { place: ["sea", "Charvak lake", "river", "mountain lake"], season: ["winter", "spring", "autumn", "March"] }],
  [ANSWER, "Have you ever ridden a {animal}?", "No, I have never ______ (ride) a {animal} in the {place}.", "ridden",
    { animal: ["horse", "camel", "donkey", "pony"], place: ["village", "desert", "mountains", "park"] }],
  [ANSWER, "Has your brother ever written a {thing}?", "No, he has never ______ (write) a {thing} in English.", "written",
    { thing: ["story", "poem", "letter", "song"] }],
  [ANSWER, "Have your parents ever flown to {city}?", "No, they have never ______ (fly) to {city} on a {trip}.", "flown",
    { city: ["Seoul", "Dubai", "Moscow", "London"], trip: ["holiday", "work trip", "short trip", "business trip"] }],
  [ANSWER, "Has Kamila ever worn a {clothes}?", "No, she has never ______ (wear) a {clothes} to a {event}.", "worn",
    { clothes: ["long dress", "hat", "white dress", "national dress"], event: ["wedding", "concert", "party", "school event"] }],
  [ANSWER, "Have you ever taken a {transport} to {city}?", "No, I have never ______ (take) a {transport} to {city}.", "taken",
    { transport: ["train", "night train", "fast train", "bus"], city: ["Bukhara", "Khiva", "Termez", "Nukus"] }],
  [NEW_SUBJ, "I have never broken my {part}.", "My cousin ______ never ______ (break) his {part} playing {sport}.", ["has", "broken"],
    { part: ["arm", "leg", "finger", "nose"], sport: ["football", "basketball", "volleyball", "hockey"] }],
  [NEW_SUBJ, "Sardor has never drunk {drink}.", "My parents ______ never ______ (drink) {drink} at the {place}.", ["have", "drunk"],
    { drink: ["camel milk", "coffee", "ayran", "kefir"], place: ["market", "café", "village", "festival"] }],
  [NEW_SUBJ, "You have never sung at a {event}.", "Nodira ______ never ______ (sing) at a {event} in front of her {person}.", ["has", "sung"],
    { event: ["wedding", "concert", "party", "festival"], person: ["family", "class", "friends", "teachers"] }],
  [NEW_SUBJ, "My brother has never fallen off his {vehicle}.", "My sisters ______ never ______ (fall) off their {vehicle} in the {place}.", ["have", "fallen"],
    { vehicle: ["bikes", "scooters", "skateboards", "horses"], place: ["park", "yard", "street", "village"] }],
  [NEW_SUBJ, "We have never forgotten our {thing}.", "Bekzod ______ never ______ (forget) his {thing} at the {place}.", ["has", "forgotten"],
    { thing: ["passport", "phone", "bag", "jacket"], place: ["airport", "station", "café", "hotel"] }],
].map(([instr, source, hint, key, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key,
  why: Array.isArray(key) ? `Use ${key[0]} for this subject, then never + the past participle: never ${key[1]}.` : why(key), slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a place you have never been to.", "have never been", ["exactly one sentence", "must use never been", "must name the place"]],
  ["Write one sentence about food you have never eaten.", "have never eaten", ["exactly one sentence", "must use never eaten", "must name the food"]],
  ["Write one sentence about something your parent has never done.", "has never + past participle", ["exactly one sentence", "must use has never", "must name the parent"]],
  ["Write one sentence about an animal you have never seen or ridden.", "never seen or never ridden", ["exactly one sentence", "must use never", "must name an animal"]],
  ["Write one sentence with never and an irregular past participle.", "never + irregular participle", ["exactly one sentence", "participle must be irregular", "must use have or has"]],
  ["Write one sentence about two friends who have never done something.", "have never + past participle", ["exactly one sentence", "must use a plural subject", "must use never"]],
  ["Write one sentence with never and but.", "have never + past participle + but", ["exactly one sentence", "must use but", "must use never"]],
  ["Write two sentences: something you have done, and something you have never done.", "have + participle, have never + participle", ["exactly two sentences", "first positive", "second with never"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about three things you have never done but want to do. Write three or four sentences.", "have never + past participle", ["never", "three different verbs", "want to"]],
  ["Write about your grandparents: what they have done and what they have never done. Write three or four sentences.", "have/has never + past participle", ["have never or has never", "a positive sentence too", "past participles"]],
  ["Write about places in Uzbekistan you have never visited. Write three or four sentences.", "have never + past participle", ["never been or never visited", "names of places", "why you want to go"]],
  ["Write a short message to a new friend about food you have never tried. Write three or four sentences.", "have never + past participle", ["never eaten or never tried", "names of food", "but"]],
  ["Write about a friend who has never done something that you do every day. Write three or four sentences.", "has never + past participle", ["has never", "present simple for your routine", "past participles"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.perfect.never-experience.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);