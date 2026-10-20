// Hand-authored: tenses / future / going-to-evidence (A2).
//
// Tests ONE point: be going to for a prediction from what we can see now
// ("Look at those clouds! It is going to rain."). The subject is never slotted
// (rule 2), so am/is/are is fixed per item.
//
// Choose distractors are form errors only: dropped be ("going to"), wrong be
// (agreement), "be go to" and "be going" + bare verb. "will" is NOT a
// distractor: "It will rain" is also correct English, so it would be a second
// right answer.
//
// Run: node tools/grammar-practice/authored/tenses.future.going-to-evidence.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "future", topic: "going-to-evidence", level: "A2", pv: "2.5" };
const BE = { I: "am", it: "is", he: "is", she: "is", we: "are", you: "are", they: "are" };
const WRONG_BE = { am: "is", is: "are", are: "is" };
const opts = (s) => { const b = BE[s]; return [`${b} going to`, `${WRONG_BE[b]} going to`, "going to", `${b} go to`]; };
const WHY_C = (s) => `We can see the signs now, so we predict with be going to. With ${s}, use ${BE[s]} going to + verb.`;

/* ---------------- choose: 20 mcq ---------------- */
// [subject, sentence, slots]
const CHOOSE = [
  ["it", "Look at those dark clouds over the {place}! It ______ rain, so take your {thing}.",
    { place: ["mountains", "city", "river", "park"], thing: ["umbrella", "raincoat", "jacket", "coat"] }],
  ["he", "Aziz is running very fast with his {thing}. He ______ catch the bus to {city}.",
    { thing: ["bag", "backpack", "suitcase", "phone"], city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  ["I", "I feel very {state} after that {food}. I think I ______ be sick.",
    { state: ["ill", "bad", "hot", "strange"], food: ["fish", "soup", "cake", "salad"] }],
  ["they", "Our players are 3-0 up at the {place} with five minutes left. They ______ win the {prize}.",
    { place: ["stadium", "school field", "park", "sports hall"], prize: ["match", "game", "cup", "final"] }],
  ["she", "Malika has studied every day for her {exam}. She ______ pass it {how}.",
    { exam: ["maths exam", "English test", "driving test", "IT exam"], how: ["easily", "without problems", "with a high score", "for sure"] }],
  ["it", "Be careful! That glass is on the edge of the {furniture}. It ______ fall onto the {floor}.",
    { furniture: ["table", "desk", "shelf", "counter"], floor: ["floor", "carpet", "tiles", "rug"] }],
  ["we", "We are stuck in traffic on {street}. We ______ be late for the {event}.",
    { street: ["the ring road", "Amir Temur Street", "the main road", "the bridge"], event: ["lesson", "meeting", "film", "wedding"] }],
  ["it", "The sky over {city} is clear and the sun is hot. It ______ be a {kind} day.",
    { city: ["Tashkent", "Khiva", "Termez", "Bukhara"], kind: ["lovely", "beautiful", "hot", "sunny"] }],
  ["she", "The baby is rubbing her eyes in the {room}. She ______ fall asleep in her {person}'s arms.",
    { room: ["bedroom", "car", "living room", "kitchen"], person: ["mother", "father", "grandmother", "aunt"] }],
  ["it", "You haven't charged your {device} all day. It ______ stop working before you get {place}.",
    { device: ["phone", "laptop", "tablet", "watch"], place: ["home", "to work", "to class", "to the station"] }],
  ["they", "Those boys are playing football too close to the {target} in the {place}. They ______ break it.",
    { target: ["window", "car", "glass door", "lamp"], place: ["yard", "street", "garden", "car park"] }],
  ["he", "Timur hasn't slept for two days, and he looks {state}. He ______ get ill at {place}.",
    { state: ["tired", "pale", "weak", "awful"], place: ["work", "school", "college", "this rate"] }],
  ["it", "The {road} is covered in ice this morning. It ______ be dangerous for {who}.",
    { road: ["road", "bridge", "pavement", "path"], who: ["drivers", "cyclists", "children", "old people"] }],
  ["I", "I have eaten too much {food}. I ______ feel ill on the {transport}.",
    { food: ["plov", "cake", "ice cream", "samsa"], transport: ["bus", "train", "plane", "metro"] }],
  ["she", "Nodira is standing on a chair in the {room} to reach the {shelf}. She ______ fall!",
    { room: ["kitchen", "hall", "classroom", "library"], shelf: ["top shelf", "old cupboard", "high shelf", "lamp"] }],
  ["we", "There is a long queue at the {place} and it isn't moving. We ______ wait a long time for {thing}.",
    { place: ["bank", "post office", "pharmacy", "ticket office"], thing: ["our turn", "help", "an answer", "service"] }],
  ["it", "The {animal} is sitting by its empty bowl in the {room}. It ______ make a lot of noise.",
    { animal: ["cat", "dog", "puppy", "kitten"], room: ["kitchen", "hall", "yard", "living room"] }],
  ["they", "The {fruit} on the tree in our {place} are big and red. They ______ be ready to pick.",
    { fruit: ["apples", "cherries", "apricots", "peaches"], place: ["garden", "yard", "dacha", "village"] }],
  ["he", "Bobur is driving his {car} too fast on the wet {road}. He ______ have an accident.",
    { car: ["car", "van", "taxi", "truck"], road: ["road", "street", "bridge", "hill"] }],
  ["it", "The wind in {city} is very strong today. It ______ blow the {thing} off our balcony.",
    { city: ["Tashkent", "Nukus", "Jizzakh", "Karshi"], thing: ["towel", "chair", "plant", "small table"] }],
].map(([s, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(s), key: 0, why: WHY_C(s), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence. Use be going to and the verb in brackets.";
const WHY_B = (s, v) => `There is a sign now, so use be going to: ${s} ${BE[s]} going to ${v}.`;
// [subject, verb, sentence, slots]
const BUILD = [
  ["it", "rain", "Take your {thing}. The clouds over the {place} are black, and it ______ (rain).",
    { thing: ["umbrella", "raincoat", "jacket", "coat"], place: ["city", "mountains", "river", "school"] }],
  ["I", "sneeze", "My nose is itching in this {room}. I ______ (sneeze) because of the {cause}.",
    { room: ["kitchen", "old room", "garage", "attic"], cause: ["dust", "flowers", "cat", "pepper"] }],
  ["they", "lose", "Our {sport} players have scored no goals and the other team has six. They ______ (lose) the {game}.",
    { sport: ["football", "basketball", "volleyball", "hockey"], game: ["match", "game", "final", "semi-final"] }],
  ["she", "leave", "My sister has her coat on and her {thing} in her hand by the door. She ______ (leave) for {place}.",
    { thing: ["bag", "keys", "phone", "umbrella"], place: ["work", "college", "the market", "school"] }],
  ["he", "win", "Sardor has left all the other runners far behind in the {place}. He ______ (win) the {race}.",
    { place: ["stadium", "park", "school field", "city centre"], race: ["race", "gold medal", "prize", "competition"] }],
  ["we", "get", "We have no map, and we don't know this part of {city}. We ______ (get) lost near the {place}.",
    { city: ["Tashkent", "Samarkand", "Istanbul", "Moscow"], place: ["market", "old town", "river", "station"] }],
  ["it", "break", "The old {thing} in the {room} has started making a strange noise. It ______ (break).",
    { thing: ["fridge", "washing machine", "fan", "heater"], room: ["kitchen", "bathroom", "hall", "flat"] }],
  ["you", "burn", "Turn down the heat! You ______ (burn) the {food} in the {pan}.",
    { food: ["rice", "onions", "eggs", "meat"], pan: ["pan", "pot", "big pan", "frying pan"] }],
  ["she", "cry", "Little Zarina has dropped her {thing} in the {place}, and her lips are shaking. She ______ (cry).",
    { thing: ["ice cream", "toy", "doll", "sweet"], place: ["park", "street", "shop", "yard"] }],
  ["they", "be", "The {people} have practised every evening at the {place}. They ______ (be) great in the concert.",
    { people: ["singers", "dancers", "musicians", "children"], place: ["school hall", "centre", "club", "theatre"] }],
  ["it", "snow", "Look, the sky over {city} has turned grey and heavy, and it feels very cold. It ______ (snow) on the {place}.",
    { city: ["Tashkent", "Samarkand", "Jizzakh", "Namangan"], place: ["mountains", "roads", "fields", "houses"] }],
  ["he", "fail", "Bekzod hasn't opened his {subject} book all term. He ______ (fail) the {exam}.",
    { subject: ["maths", "physics", "history", "chemistry"], exam: ["exam", "test", "final test", "end-of-term test"] }],
  ["I", "be", "My {transport} is stuck in traffic on the bridge. I ______ (be) late for my {event}.",
    { transport: ["bus", "taxi", "minibus", "car"], event: ["lesson", "meeting", "interview", "exam"] }],
  ["we", "have", "Look at all these {people} at the door of the {place}! We ______ (have) a busy day.",
    { people: ["customers", "visitors", "guests", "people"], place: ["shop", "café", "museum", "office"] }],
  ["it", "stop", "The {transport} has slowed down near the {place}. It ______ (stop) here.",
    { transport: ["bus", "tram", "train", "minibus"], place: ["market", "school", "bridge", "station"] }],
  ["they", "miss", "Kamila and Laylo have just sat down in the {place}, but the {transport} leaves in five minutes. They ______ (miss) it.",
    { place: ["café", "shop", "hotel", "library"], transport: ["bus", "train", "last bus", "minibus"] }],
  ["it", "be", "Look at that clear blue sky over the {place}! It ______ (be) a {kind} day.",
    { place: ["city", "valley", "village", "lake"], kind: ["sunny", "lovely", "warm", "beautiful"] }],
  ["she", "drop", "Gulnora has too many {things} in her arms on the {way}. She ______ (drop) them.",
    { things: ["boxes", "books", "plates", "bags"], way: ["stairs", "steps", "hill", "street"] }],
  ["he", "get", "My father has no {thing} with him at the {place}, and it has started raining. He ______ (get) wet.",
    { thing: ["coat", "umbrella", "jacket", "hat"], place: ["bus stop", "gate", "market", "station"] }],
  ["you", "spill", "Be careful with that full {cup}! You ______ (spill) it on the {thing}.",
    { cup: ["cup", "glass", "bowl", "mug"], thing: ["carpet", "sofa", "table", "floor"] }],
].map(([s, v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${BE[s]} going to ${v}`, why: WHY_B(s, v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_SUBJ = "Read the first sentence. Complete the second sentence about a new person. Use be going to and the verb in brackets.";
const T_NEG = "Read the first sentence. Complete the second sentence with the negative of be going to and the verb in brackets.";
const T_Q = "Read the first sentence. Complete the question with be going to and the verb in brackets.";
const TRANSFORM = [
  // kind 1: change the subject (am -> is/are)
  [T_SUBJ, "Look at the traffic on {street}! I am going to be late for my {event}.", "My brother takes the same bus. He ______ (be) late for his {event}.",
    "is going to be", "He is a new subject, so am changes to is: he is going to be.",
    { street: ["the ring road", "the main road", "the bridge", "Navoi Street"], event: ["lesson", "meeting", "exam", "interview"] }],
  [T_SUBJ, "The ice on the {place} near our {home} is very thin. I am going to fall!", "Be careful, children! You ______ (fall) on the {place}.",
    "are going to fall", "With you, use are: you are going to fall.",
    { place: ["lake", "pond", "path", "river"], home: ["house", "school", "flat", "village"] }],
  [T_SUBJ, "My shoes are wet and cold after the {walk}. I am going to catch a cold.", "Your shoes got wet too on the {walk} in the {place}. You ______ (catch) a cold.",
    "are going to catch", "With you, use are: you are going to catch.",
    { walk: ["walk", "trip", "run", "hike"], place: ["rain", "snow", "park", "mountains"] }],
  [T_SUBJ, "I haven't eaten all day at the {place}. I am going to be very hungry.", "My {person} hasn't eaten all day either. She ______ (be) very hungry.",
    "is going to be", "With she, use is: she is going to be.",
    { place: ["office", "college", "market", "hospital"], person: ["sister", "mother", "aunt", "friend"] }],
  [T_SUBJ, "I am stuck in the {transport}, so I am going to miss the {event}.", "Laylo waits in the same {transport} with me. She ______ (miss) the {event}.",
    "is going to miss", "With she, use is: she is going to miss.",
    { transport: ["lift", "metro train", "traffic jam", "bus"], event: ["film", "start", "wedding", "lesson"] }],
  // kind 2: the sign changes, so make it negative
  [T_NEG, "I thought rain was coming, but now the sky over the {place} is blue.", "It ______ (rain) in {city} today.",
    "is not going to rain", "The sky is blue now, so the prediction is negative: it is not going to rain.",
    { place: ["city", "mountains", "river", "school"], city: ["Tashkent", "Samarkand", "Fergana", "Andijan"] }],
  [T_NEG, "Aziz has a high fever, so he is in bed at his {person}'s house.", "He ______ (go) out with his friends today.",
    "is not going to go", "He is ill in bed, so we predict the negative: he is not going to go.",
    { person: ["grandmother", "uncle", "aunt", "cousin"] }],
  [T_NEG, "The {shop} is closed and all the lights are off on {street}.", "We ______ (buy) {food} there tonight.",
    "are not going to buy", "The shop is closed, so the prediction is negative: we are not going to buy.",
    { shop: ["bakery", "market", "shop", "café"], food: ["bread", "fruit", "milk", "snacks"], street: ["our street", "Navoi Street", "the main road", "the corner"] }],
  [T_NEG, "There are only two minutes left and the score at the {place} is 0-4.", "Our {sport} team ______ (win) this match.",
    "is not going to win", "The score shows it, so the prediction is negative: the team is not going to win.",
    { place: ["stadium", "sports hall", "school field", "park"], sport: ["football", "basketball", "hockey", "volleyball"] }],
  [T_NEG, "Look! The {person} has fallen asleep on the {furniture}.", "She ______ (finish) her homework tonight.",
    "is not going to finish", "She is asleep, so the prediction is negative: she is not going to finish.",
    { person: ["girl", "student", "little girl", "young girl"], furniture: ["sofa", "desk", "bed", "chair"] }],
  // kind 3: make a question
  [T_Q, "The sky over {city} is very dark. Maybe rain is coming to the {place}.", "______ it ______ (rain) soon?",
    ["Is", "going to rain"], "In a question, be comes first: Is it going to rain?",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Namangan"], place: ["city", "valley", "mountains", "fields"] }],
  [T_Q, "Our {transport} is very slow today, and the {event} starts at nine.", "______ we ______ (be) late?",
    ["Are", "going to be"], "In a question, be comes first: Are we going to be late?",
    { transport: ["bus", "metro", "train", "taxi"], event: ["lesson", "exam", "meeting", "film"] }],
  [T_Q, "Sardor is running very fast at the {place}. Maybe he wins the {race}.", "______ he ______ (win) the {race}?",
    ["Is", "going to win"], "In a question, be comes first: Is he going to win?",
    { place: ["stadium", "park", "school field", "city centre"], race: ["race", "gold medal", "prize", "competition"] }],
  [T_Q, "The {glass} is on the edge of the {furniture}. Maybe it falls.", "______ it ______ (fall)?",
    ["Is", "going to fall"], "In a question, be comes first: Is it going to fall?",
    { glass: ["glass", "cup", "vase", "bowl"], furniture: ["table", "shelf", "desk", "counter"] }],
  [T_Q, "My {person} looks very tired after work at the {place}.", "______ she ______ (sleep) early tonight?",
    ["Is", "going to sleep"], "In a question, be comes first: Is she going to sleep?",
    { person: ["mother", "sister", "aunt", "grandmother"], place: ["hospital", "bank", "market", "school"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Look out of the window. Write one sentence about the weather with be going to.", "be going to (prediction)", ["exactly one sentence", "must use going to", "must be about the weather"]],
  ["Your friend is running to the bus stop and the bus is leaving. Write one sentence.", "be going to (prediction)", ["exactly one sentence", "must use going to", "must be about the bus"]],
  ["A glass is at the edge of a table. Write one sentence to warn someone.", "be going to (prediction)", ["exactly one sentence", "must use going to", "must use fall or break"]],
  ["Your team is winning 4-0. Write one sentence about the result.", "be going to (prediction)", ["exactly one sentence", "must use going to", "must use win"]],
  ["You feel very tired and ill. Write one sentence about yourself.", "I am going to", ["exactly one sentence", "must use I am going to", "must say how you will feel"]],
  ["The sky is clear and blue. Write one negative sentence.", "is not going to", ["exactly one sentence", "must use not going to", "must be about rain"]],
  ["Your friend hasn't studied for the exam. Write one sentence about him or her.", "is going to", ["exactly one sentence", "must use he or she", "must use going to"]],
  ["Ask a question about the dark clouds in the sky.", "Is it going to...?", ["exactly one question", "must start with Is", "must use going to"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Look at the sky today. Write three or four sentences about what the weather is going to do and why.", "be going to (prediction)", ["is going to", "a sign you can see", "is not going to"]],
  ["Your friend is late, the bus is full and the road is busy. Write three or four sentences about what is going to happen.", "be going to (prediction)", ["is going to", "are going to", "a reason"]],
  ["You are watching a football match. Write three or four sentences about the result.", "be going to (prediction)", ["are going to win or lose", "the score now", "a reason"]],
  ["Someone in your family is very tired. Write three or four sentences about what is going to happen tonight.", "be going to (prediction)", ["is going to", "a sign you can see", "is not going to"]],
  ["Describe a busy kitchen before dinner. Write three or four sentences with things that are going to happen.", "be going to (prediction)", ["is going to", "a warning", "a sign you can see"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/tenses.future.going-to-evidence.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/tenses.future.going-to-evidence.json`);