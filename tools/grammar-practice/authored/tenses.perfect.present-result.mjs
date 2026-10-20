// Hand-authored: tenses / perfect / present-result (A2).
//
// Tests ONE point: the present perfect for a finished action with a result
// NOW ("I have lost my keys, so I can't open the door"). No time marker:
// the result clause carries the meaning. The subject is never slotted.
//
// Choose distractors: wrong auxiliary (I has / she have), the past form after
// have (has broke), and the base form after have (has break). The past simple
// is NOT a distractor: "I lost my keys, so I can't..." is fine American English.
// Only verbs whose participle differs from the past form are used in choose
// where the past-form distractor appears.
//
// Run: node tools/grammar-practice/authored/tenses.perfect.present-result.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "present-result", level: "A2", pv: "2.5" };
const HAVE = { i: "have", sg: "has", pl: "have" };
const WRONG = { i: "has", sg: "have", pl: "has" };
const why = (type, pp) => `The action is finished and we can see the result now, so use the present perfect: ${HAVE[type]} ${pp}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["i", "lose", "lost", "lost", "Oh no! I ______ my keys, so I can't open the {door} of our {home}.",
    { door: ["door", "front door", "gate", "garage"], home: ["flat", "house", "dacha", "building"] }],
  ["sg", "break", "broke", "broken", "Aziz ______ his leg, so he can't play {sport} with his {team} this month.",
    { sport: ["football", "basketball", "volleyball", "tennis"], team: ["team", "friends", "class", "club"] }],
  ["pl", "eat", "ate", "eaten", "The children ______ all the {food}, so there is nothing for their {person}.",
    { food: ["cake", "bread", "soup", "pizza"], person: ["father", "mother", "aunt", "grandfather"] }],
  ["sg", "forget", "forgot", "forgotten", "Madina ______ her {thing}, so she can't {act} at the moment.",
    { thing: ["password", "PIN code", "login", "account name"], act: ["log in", "use the app", "check her email", "open her account"] }],
  ["i", "take", "took", "taken", "I ______ a {pill} for my {problem}, so I feel better now.",
    { pill: ["pill", "tablet", "painkiller", "medicine"], problem: ["headache", "back", "tooth", "cold"] }],
  ["sg", "go", "went", "gone", "My father ______ to the {place}, so he isn't at home with my {person}.",
    { place: ["bank", "market", "office", "hospital"], person: ["mother", "sister", "grandmother", "brother"] }],
  ["pl", "write", "wrote", "written", "The students ______ their {task}, so they can give it to the {person}.",
    { task: ["essays", "reports", "stories", "summaries"], person: ["teacher", "tutor", "director", "coach"] }],
  ["sg", "fall", "fell", "fallen", "The old tree in our {place} ______ down, so the {thing} is blocked.",
    { place: ["street", "yard", "garden", "park"], thing: ["road", "gate", "path", "way"] }],
  ["i", "drink", "drank", "drunk", "I ______ three cups of {drink}, so I can't sleep in my {room}.",
    { drink: ["coffee", "strong tea", "black tea", "green tea"], room: ["room", "bedroom", "bed", "flat"] }],
  ["sg", "steal", "stole", "stolen", "Someone ______ my {thing} from the {place}, so I must walk home.",
    { thing: ["bike", "scooter", "car", "motorbike"], place: ["yard", "street", "station", "car park"] }],
  ["pl", "grow", "grew", "grown", "My little cousins ______ a lot, so their old {clothes} are too {adj} now.",
    { clothes: ["shoes", "jackets", "trousers", "coats"], adj: ["small", "short", "tight", "small for them"] }],
  ["sg", "tear", "tore", "torn", "Bobur ______ his {clothes}, so he can't wear it to the {event}.",
    { clothes: ["shirt", "jacket", "coat", "new shirt"], event: ["party", "wedding", "concert", "school event"] }],
  ["i", "give", "gave", "given", "I ______ my old {thing} to my {person}, so I don't have it now.",
    { thing: ["phone", "laptop", "bike", "guitar"], person: ["brother", "cousin", "sister", "friend"] }],
  ["sg", "leave", "left", "left", "Hurry! The {transport} ______ the {place}, and we have to wait.",
    { transport: ["bus", "train", "minibus", "tram"], place: ["stop", "station", "corner", "square"] }],
  ["pl", "choose", "chose", "chosen", "We ______ a name for our {pet}, so now we can call it {name}.",
    { pet: ["new puppy", "kitten", "parrot", "rabbit"], name: ["Laylo", "Max", "Bars", "Sunny"] }],
  ["sg", "wake", "woke", "woken", "The baby ______ up, so my {person} is in the {room} with her.",
    { person: ["mother", "sister", "aunt", "grandmother"], room: ["bedroom", "small room", "next room", "kitchen"] }],
  ["i", "hide", "hid", "hidden", "I ______ my sister's present in my {place}, so she can't find it before her {event}.",
    { place: ["wardrobe", "bag", "car", "desk"], event: ["birthday", "party", "wedding", "graduation"] }],
  ["sg", "speak", "spoke", "spoken", "Our teacher ______ to the director, so now we can go on the {trip} to {city}.",
    { trip: ["trip", "school trip", "class trip", "museum trip"], city: ["Samarkand", "Bukhara", "Khiva", "Shakhrisabz"] }],
  ["sg", "freeze", "froze", "frozen", "The {thing} in the yard ______, so the children can skate on it with their {person}.",
    { thing: ["pond", "small lake", "big puddle", "water"], person: ["friends", "father", "cousins", "neighbours"] }],
  ["sg", "ring", "rang", "rung", "The {bell} ______, so the lesson in room {num} is over.",
    { bell: ["bell", "school bell", "last bell", "alarm"], num: ["12", "14", "21", "305"] }],
].map(([type, b, past, pp, prompt, slots]) => {
  const opts = [`${HAVE[type]} ${pp}`, `${WRONG[type]} ${pp}`, `${HAVE[type]} ${past}`, `${HAVE[type]} ${b}`];
  if (past === pp) opts[2] = `${HAVE[type]} ${b}d`;
  return { ...BASE, stage: "choose", format: "mcq", prompt, options: opts, key: 0, why: why(type, pp), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the present perfect of the verb in brackets (have/has + past participle).";
const BUILD = [
  ["i", "finished", "I ______ (finish) my {task}, so I can watch the {show} now.", { task: ["homework", "project", "essay", "report"], show: ["film", "match", "series", "news"] }],
  ["sg", "cleaned", "My sister ______ (clean) the {room}, so it looks very {adj}.", { room: ["kitchen", "living room", "bathroom", "flat"], adj: ["nice", "clean", "tidy", "bright"] }],
  ["pl", "arrived", "Our guests ______ (arrive) from {city}, so my mother is making {food}.", { city: ["Moscow", "Bukhara", "Seoul", "Almaty"], food: ["plov", "tea", "dinner", "samsa"] }],
  ["sg", "lost", "Timur ______ (lose) his {thing}, so he can't get into the {place}.", { thing: ["key", "card", "pass", "ticket"], place: ["office", "building", "flat", "gym"] }],
  ["i", "cut", "I ______ (cut) my finger, so I can't cook {food} for my {person}.", { food: ["plov", "dinner", "soup", "lunch"], person: ["family", "guests", "brother", "parents"] }],
  ["pl", "painted", "We ______ (paint) the {room}, so please don't touch the {thing}.", { room: ["kitchen", "classroom", "hall", "bedroom"], thing: ["walls", "door", "windows", "doors"] }],
  ["sg", "broken", "The {thing} ______ (break), so we can't make {food}.", { thing: ["oven", "kettle", "cooker", "toaster"], food: ["breakfast", "tea", "anything", "dinner"] }],
  ["i", "bought", "I ______ (buy) a new {thing}, so I can give my old one to {name}.", { thing: ["phone", "laptop", "bike", "watch"], name: ["Aziz", "Olga", "Bobur", "Nigora"] }],
  ["sg", "passed", "Kamila ______ (pass) her {test}, so she is very {state}.", { test: ["driving test", "maths exam", "English exam", "IELTS test"], state: ["happy", "proud", "excited", "pleased"] }],
  ["pl", "spent", "My parents ______ (spend) all their money on the {thing}, so they can't go to {place}.", { thing: ["new car", "new flat", "wedding", "new kitchen"], place: ["Turkey", "the sea", "Dubai", "Istanbul"] }],
  ["sg", "sent", "Lola ______ (send) the {thing}, so her {person} can read it now.", { thing: ["email", "message", "letter", "report"], person: ["boss", "teacher", "friend", "aunt"] }],
  ["i", "hurt", "I ______ (hurt) my {part}, so I can't go to the {place} today.", { part: ["back", "knee", "foot", "arm"], place: ["gym", "pool", "stadium", "park"] }],
  ["sg", "stopped", "The rain ______ (stop), so the children can play in the {place} with their {thing}.", { place: ["yard", "park", "garden", "street"], thing: ["ball", "bikes", "friends", "dog"] }],
  ["pl", "found", "The police ______ (find) my {thing} at the {place}, so I'm very happy.", { thing: ["bike", "phone", "bag", "wallet"], place: ["station", "market", "park", "bus stop"] }],
  ["sg", "made", "Grandmother ______ (make) {food}, so the kitchen smells {adj}.", { food: ["samsa", "bread", "plov", "a cake"], adj: ["great", "nice", "wonderful", "lovely"] }],
  ["i", "forgotten", "I ______ (forget) my {thing}, so I can't {act} in the lesson.", { thing: ["glasses", "contact lenses", "reading glasses", "new glasses"], act: ["read the board", "see the board", "read the book", "read the text"] }],
  ["pl", "closed", "They ______ (close) the {place}, so we must go to the {place2}.", { place: ["bridge", "road", "main street", "tunnel"], place2: ["next bridge", "other road", "old road", "ring road"] }],
  ["sg", "gone", "My brother ______ (go) to {city}, so his room is {state}.", { city: ["Moscow", "Seoul", "Samarkand", "Istanbul"], state: ["empty", "quiet", "free", "clean"] }],
  ["i", "run", "I ______ (run) five kilometres, so I'm very {state} now.", { state: ["tired", "hot", "thirsty", "hungry"] }],
  ["sg", "won", "Our {team} ______ (win) the final, so everybody is singing in the {place}.", { team: ["football team", "school team", "city team", "volleyball team"], place: ["street", "bus", "square", "stadium"] }],
].map(([type, pp, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${HAVE[type]} ${pp}`, why: why(type, pp), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Read the two short sentences. Complete one sentence with the present perfect to show the result now.";
const NEW_SUBJ = "Rewrite the sentence with the new subject.";
const REPLY = "Answer the question with the present perfect of the verb in brackets.";
const TRANSFORM = [
  [JOIN, "Sardor broke his {part}. Now he can't play.", "Sardor ______ (break) his {part}, so he can't play {sport}.", "has broken",
    { part: ["leg", "arm", "finger", "foot"], sport: ["football", "basketball", "volleyball", "tennis"] }],
  [JOIN, "I lost my {thing}. Now I can't call my mother.", "I ______ (lose) my {thing}, so I can't call my {person}.", "have lost",
    { thing: ["phone", "phone charger", "SIM card", "headphones"], person: ["mother", "father", "sister", "friend"] }],
  [JOIN, "The {transport} left. Now we must wait.", "The {transport} ______ (leave), so we must wait at the {place}.", "has left",
    { transport: ["bus", "train", "minibus", "tram"], place: ["stop", "station", "corner", "square"] }],
  [JOIN, "We finished the {task}. Now we can go home.", "We ______ (finish) the {task}, so we can go to the {place}.", "have finished",
    { task: ["project", "test", "cleaning", "work"], place: ["park", "café", "cinema", "pool"] }],
  [JOIN, "My aunt made {food}. Now there is lots to eat.", "My aunt ______ (make) {food}, so there is lots to eat at the {event}.", "has made",
    { food: ["plov", "samsa", "manti", "salads"], event: ["party", "wedding", "picnic", "dinner"] }],
  [NEW_SUBJ, "I have washed the car, so it is clean.", "My brothers ______ (wash) the {thing}, so it is clean for the {event}.", "have washed",
    { thing: ["car", "carpet", "van", "kitchen floor"], event: ["wedding", "trip", "party", "holiday"] }],
  [NEW_SUBJ, "We have missed the {transport}, so we are late.", "Dilshod ______ (miss) the {transport}, so he is late for {place}.", "has missed",
    { transport: ["bus", "train", "metro", "minibus"], place: ["school", "work", "his lesson", "the meeting"] }],
  [NEW_SUBJ, "They have eaten all the {food}.", "Your little brother ______ (eat) all the {food} in the {place}.", "has eaten",
    { food: ["sweets", "biscuits", "grapes", "apples"], place: ["kitchen", "fridge", "bag", "box"] }],
  [NEW_SUBJ, "She has hurt her {part}, so she can't run.", "I ______ (hurt) my {part}, so I can't run in the {event}.", "have hurt",
    { part: ["knee", "foot", "leg", "back"], event: ["race", "match", "marathon", "PE lesson"] }],
  [NEW_SUBJ, "He has drunk all the {drink}.", "The players ______ (drink) all the {drink} in the {place}.", "have drunk",
    { drink: ["water", "juice", "tea", "cold water"], place: ["changing room", "bus", "gym", "fridge"] }],
  [REPLY, "Why can't you open the door?", "I ______ (lose) my key to the {place}.", "have lost",
    { place: ["flat", "house", "office", "garage"] }],
  [REPLY, "Why is Malika so happy?", "She ______ (get) a new {thing} from her {person}.", "has got",
    { thing: ["phone", "bike", "laptop", "watch"], person: ["father", "uncle", "grandmother", "aunt"] }],
  [REPLY, "Why is the floor wet?", "The children ______ (drop) the {thing} in the {room}.", "have dropped",
    { thing: ["bucket", "bottle", "jug", "glass of water"], room: ["kitchen", "hall", "classroom", "bathroom"] }],
  [REPLY, "Why can't Javlon come to the {event}?", "He ______ (break) his {part}.", "has broken",
    { event: ["party", "match", "concert", "picnic"], part: ["leg", "arm", "foot", "ankle"] }],
  [REPLY, "Why are you so tired?", "I ______ (clean) the whole {place} with my {person}.", "have cleaned",
    { place: ["flat", "house", "yard", "garage"], person: ["mother", "sister", "brother", "father"] }],
].map(([instr, source, hint, key, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key,
  why: `The action is finished and the result is now, so use the present perfect: ${key}.`, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you have lost and the result now.", "have lost + so", ["exactly one sentence", "must use have lost", "must use so"]],
  ["Write one sentence about someone who has broken something.", "has broken", ["exactly one sentence", "must use has broken", "must say the result"]],
  ["Write one sentence about why you are happy today.", "have + past participle", ["exactly one sentence", "must use the present perfect", "must use so or because"]],
  ["Write one sentence about why you are tired.", "have + past participle", ["exactly one sentence", "must use the present perfect", "must use because"]],
  ["Write one sentence about a friend who has gone somewhere.", "has gone", ["exactly one sentence", "must use has gone", "must name the place"]],
  ["Write one sentence about something two people have finished.", "have finished", ["exactly one sentence", "must use a plural subject", "must say the result"]],
  ["Write one sentence about a change in your room or home.", "have + past participle", ["exactly one sentence", "must use the present perfect", "must name the room"]],
  ["Write two sentences: a problem now, and the action that has caused it.", "present perfect for the cause", ["exactly two sentences", "first says the problem", "second uses have or has + past participle"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are late for class. Write a message to your teacher and explain what has happened. Write three or four sentences.", "present perfect with present result", ["have or has + past participle", "the result now", "so or because"]],
  ["Your room looks very different today. Describe what you have done. Write three or four sentences.", "present perfect with present result", ["have + past participle", "three different actions", "the result"]],
  ["Write a message to a friend: you can't come to the party. Explain why. Write three or four sentences.", "present perfect with present result", ["have or has + past participle", "can't", "because"]],
  ["Describe your street after a big storm. What has happened? Write three or four sentences.", "present perfect with present result", ["has fallen, has broken, have closed", "the result now", "past participles"]],
  ["Write about good news in your family. What has happened and how does everybody feel now? Write three or four sentences.", "present perfect with present result", ["has or have + past participle", "feelings now", "so"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.perfect.present-result.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);