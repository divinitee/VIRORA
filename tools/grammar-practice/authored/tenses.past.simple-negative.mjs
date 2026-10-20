// Hand-authored: tenses / past / simple-negative (A2).
//
// Tests ONE point: did + not + BASE form for the past simple negative
// ("I didn't go", never "I didn't went"). One past time marker per sentence.
//
// Choose distractors: didn't + past form (double past marking, the main
// error), not + past form (no auxiliary, from Uzbek/Russian negation) and
// wasn't/weren't + base (wrong auxiliary). Build/transform keys are typed;
// ingest expands didn't ↔ did not.
//
// Run: node tools/grammar-practice/authored/tenses.past.simple-negative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "past", topic: "simple-negative", level: "A2", pv: "2.5" };
const why = (base) => `The past simple negative is didn't + the base form: didn't ${base}, not didn't + a past form.`;
const opts = (base, past, pl) => [`didn't ${base}`, `didn't ${past}`, `not ${past}`, `${pl ? "weren't" : "wasn't"} ${base}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["go", "went", 0, "Yesterday I ______ to {place} because I had a {problem}.",
    { place: ["school", "college", "work", "the gym"], problem: ["cold", "headache", "fever", "sore throat"] }],
  ["eat", "ate", 0, "Last night my brother ______ any {food} at the {event}.",
    { food: ["plov", "salad", "cake", "meat"], event: ["party", "wedding", "dinner", "picnic"] }],
  ["see", "saw", 1, "We ______ {name} at the {place} last Saturday.",
    { name: ["Aziz", "Olga", "Bobur", "Nigora"], place: ["market", "stadium", "party", "library"] }],
  ["buy", "bought", 0, "Kamila ______ the {thing} yesterday because it was too {adj}.",
    { thing: ["jacket", "bag", "lamp", "phone"], adj: ["expensive", "big", "small", "heavy"] }],
  ["come", "came", 1, "My cousins ______ to my birthday party last week because they were in {city} with their {person}.",
    { city: ["Moscow", "Bukhara", "Seoul", "Almaty"], person: ["parents", "father", "grandmother", "team"] }],
  ["call", "called", 0, "Rustam ______ his {person} last night because his phone was {state}.",
    { person: ["mother", "friend", "teacher", "boss"], state: ["broken", "dead", "lost", "at home"] }],
  ["finish", "finished", 1, "The students ______ the {task} yesterday, so they stayed after class in the {room}.",
    { task: ["test", "project", "essay", "exercise"], room: ["library", "classroom", "lab", "hall"] }],
  ["understand", "understood", 0, "I ______ the {thing} in yesterday's {subject} lesson.",
    { thing: ["question", "new rule", "homework", "task"], subject: ["maths", "physics", "English", "chemistry"] }],
  ["sleep", "slept", 0, "The baby ______ well last night because of the {noise} from the {place}.",
    { noise: ["noise", "music", "rain", "wind"], place: ["street", "yard", "flat upstairs", "building site"] }],
  ["have", "had", 1, "We ______ time for breakfast yesterday, so we ate {food} on the {transport}.",
    { food: ["bread", "apples", "biscuits", "a banana"], transport: ["bus", "metro", "way", "train"] }],
  ["watch", "watched", 0, "My father ______ the {event} on TV last night because he was at {place}.",
    { event: ["match", "final", "news", "concert"], place: ["work", "a meeting", "the hospital", "his friend's house"] }],
  ["take", "took", 0, "Lola ______ the {transport} to college yesterday. She walked with her {person}.",
    { transport: ["bus", "metro", "taxi", "minibus"], person: ["sister", "friend", "classmate", "cousin"] }],
  ["play", "played", 1, "The boys ______ {sport} last weekend because the {place} was closed.",
    { sport: ["football", "basketball", "volleyball", "tennis"], place: ["stadium", "gym", "sports centre", "park"] }],
  ["find", "found", 0, "Akmal ______ his {thing} yesterday. It is still somewhere in the {place}.",
    { thing: ["keys", "wallet", "ticket", "passport"], place: ["house", "car", "flat", "office"] }],
  ["write", "wrote", 0, "Two days ago, Sevara ______ the {thing} for her {subject} class.",
    { thing: ["essay", "report", "story", "summary"], subject: ["English", "history", "literature", "biology"] }],
  ["hear", "heard", 0, "I ______ the {sound} last night because I had my headphones on in the {room}.",
    { sound: ["alarm", "doorbell", "phone", "knock"], room: ["bedroom", "kitchen", "living room", "bathroom"] }],
  ["know", "knew", 1, "We ______ about the {event} at the {place} last week, so we missed it.",
    { event: ["concert", "meeting", "sale", "party"], place: ["library", "school", "park", "centre"] }],
  ["drink", "drank", 0, "Javlon ______ any {drink} during the match yesterday, so he felt {state}.",
    { drink: ["water", "juice", "tea", "cold water"], state: ["tired", "weak", "dizzy", "ill"] }],
  ["bring", "brought", 0, "Dilfuza ______ her {thing} to class last Monday, so she shared with {name}.",
    { thing: ["book", "dictionary", "notebook", "laptop"], name: ["Malika", "Anna", "Zarina", "Kamola"] }],
  ["like", "liked", 1, "My grandparents ______ the {food} at the new {place} last week.",
    { food: ["soup", "plov", "pizza", "salad"], place: ["café", "restaurant", "canteen", "hotel"] }],
].map(([b, past, pl, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(b, past, pl), key: 0, why: why(b), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the past simple negative of the verb in brackets (didn't + verb).";
const BUILD = [
  ["go", "Yesterday Madina ______ (go) to the {place} because it was {weather}.",
    { place: ["park", "market", "beach", "stadium"], weather: ["raining", "too cold", "too hot", "snowing"] }],
  ["do", "Last night, I ______ (do) my {subject} homework because I was at my {person}'s house.",
    { subject: ["maths", "English", "history", "physics"], person: ["aunt", "grandmother", "friend", "cousin"] }],
  ["watch", "We ______ (watch) the {event} last night because we were at {place}.",
    { event: ["match", "film", "news", "concert"], place: ["the cinema", "my aunt's house", "a wedding", "the park"] }],
  ["buy", "Last week, Bobur ______ (buy) the {thing} because he had no {money}.",
    { thing: ["shoes", "jacket", "headphones", "book"], money: ["money", "cash", "time", "card"] }],
  ["eat", "The children ______ (eat) their {food} at lunch yesterday because it was {state}.",
    { food: ["soup", "rice", "salad", "pasta"], state: ["cold", "too salty", "too spicy", "too hot"] }],
  ["drive", "My father ______ (drive) to work last Monday because his car was at the {place}.",
    { place: ["garage", "repair shop", "mechanic's", "service centre"] }],
  ["visit", "Last summer, we ______ (visit) {city} because the {thing} were too expensive.",
    { city: ["Istanbul", "Dubai", "Seoul", "London"], thing: ["tickets", "hotels", "train tickets", "flights"] }],
  ["answer", "Nilufar ______ (answer) the phone yesterday because she was in the {place} with her {person}.",
    { place: ["lesson", "meeting", "cinema", "library"], person: ["friends", "sister", "cousin", "classmates"] }],
  ["come", "Last night the {transport} ______ (come) on time, so we waited at the {place}.",
    { transport: ["bus", "train", "minibus", "tram"], place: ["stop", "station", "corner", "gate"] }],
  ["understand", "I ______ (understand) the {thing} in class yesterday, so I asked my {person}.",
    { thing: ["question", "new rule", "task", "homework"], person: ["teacher", "friend", "brother", "classmate"] }],
  ["open", "Two days ago, the shop ______ (open) because of the {event} in {city}.",
    { event: ["holiday", "festival", "celebration", "marathon"], city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  ["play", "Last weekend, Sanjar ______ (play) {sport} because he hurt his {part}.",
    { sport: ["football", "tennis", "basketball", "volleyball"], part: ["knee", "leg", "arm", "back"] }],
  ["know", "I ______ (know) anyone at the {event} last Saturday except {name}.",
    { event: ["party", "wedding", "meeting", "concert"], name: ["Aziz", "Olga", "Bobur", "Nigora"] }],
  ["take", "Yesterday, my sister ______ (take) her {thing} to {place}, so she got wet.",
    { thing: ["umbrella", "raincoat", "coat", "jacket"], place: ["school", "college", "work", "the park"] }],
  ["get", "Last month, we ______ (get) any {thing} from our {person}.",
    { thing: ["news", "letters", "messages", "parcels"], person: ["cousins", "uncle", "aunt", "grandparents"] }],
  ["wear", "Yesterday Otabek ______ (wear) his {clothes} because he couldn't find it in the {place}.",
    { clothes: ["jacket", "coat", "hat", "scarf"], place: ["flat", "cupboard", "car", "hall"] }],
  ["hear", "Last night, I ______ (hear) my {thing} because it was in my {place}.",
    { thing: ["phone", "alarm", "tablet", "laptop"], place: ["bag", "coat pocket", "car", "kitchen"] }],
  ["finish", "We ______ (finish) the {task} last Friday because the {thing} stopped working.",
    { task: ["project", "report", "presentation", "homework"], thing: ["computer", "printer", "internet", "laptop"] }],
  ["call", "Kamola ______ (call) her {person} yesterday because she lost her phone.",
    { person: ["mother", "friend", "teacher", "grandmother"] }],
  ["give", "The teacher ______ (give) us any {task} last Friday because of the {event}.",
    { task: ["homework", "tests", "exercises", "reading"], event: ["holiday", "school concert", "sports day", "festival"] }],
].map(([b, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `didn't ${b}`, why: why(b), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POS_NEG = "Make the sentence negative.";
const PRES_PAST = "The first sentence is about now. Complete the second sentence: a negative in the past simple.";
const ANSWER = "Answer the question with a negative in the past simple.";
const TRANSFORM = [
  [POS_NEG, "I went to the {place} yesterday.", "I ______ (go) to the {place} yesterday. I stayed at home with my {person}.", "go",
    { place: ["park", "market", "gym", "cinema"], person: ["brother", "grandmother", "parents", "sister"] }],
  [POS_NEG, "Ali passed his {test}.", "Ali ______ (pass) his {test} last week, so he is studying with his {person} again.", "pass",
    { test: ["driving test", "maths exam", "English exam", "IELTS test"], person: ["father", "tutor", "teacher", "uncle"] }],
  [POS_NEG, "We bought a new {thing}.", "We ______ (buy) a new {thing} last month because it cost too much at the {place}.", "buy",
    { thing: ["sofa", "fridge", "TV", "carpet"], place: ["shop", "market", "mall", "store"] }],
  [POS_NEG, "My sister liked the {show}.", "My sister ______ (like) the {show} last Saturday because it was too {adj}.", "like",
    { show: ["film", "play", "concert", "series"], adj: ["long", "boring", "loud", "sad"] }],
  [POS_NEG, "The students wrote the {task}.", "The students ______ (write) the {task} yesterday because the {person} was ill.", "write",
    { task: ["essay", "test", "report", "summary"], person: ["teacher", "tutor", "school director", "coach"] }],
  [PRES_PAST, "Aziz doesn't play {sport} on weekdays.", "Last week Aziz ______ (play) {sport} at all because of his {problem}.", "play",
    { sport: ["football", "tennis", "chess", "volleyball"], problem: ["exams", "bad leg", "cold", "new job"] }],
  [PRES_PAST, "We don't usually eat {food} for breakfast.", "Yesterday we ______ (eat) {food} for breakfast either.", "eat",
    { food: ["soup", "rice", "meat", "fish"] }],
  [PRES_PAST, "My father doesn't drive in {weather}.", "Yesterday my father ______ (drive) because of the {weather} on the {road}.", "drive",
    { weather: ["snow", "rain", "fog", "ice"], road: ["main road", "bridge", "mountain road", "city roads"] }],
  [PRES_PAST, "Laylo doesn't watch {show} on her {device}.", "Last night Laylo ______ (watch) {show} on her {device} because she had a test.", "watch",
    { show: ["cartoons", "films", "series", "videos"], device: ["phone", "tablet", "laptop", "computer"] }],
  [PRES_PAST, "Our teacher doesn't give us {task} on Fridays.", "Last Friday our teacher ______ (give) us {task} because it was {name}'s birthday.", "give",
    { task: ["homework", "tests", "extra work", "reading"], name: ["Malika", "Sardor", "Anna", "Timur"] }],
  [ANSWER, "Did you see the {show}?", "No, I ______ (see) the {show}. I was at {place}.", "see",
    { show: ["film", "match", "concert", "play"], place: ["work", "my aunt's house", "the gym", "a lesson"] }],
  [ANSWER, "Did Bekzod call his {person}?", "No, he ______ (call) his {person} because he was {state}.", "call",
    { person: ["mother", "teacher", "coach", "uncle"], state: ["busy", "tired", "at work", "in a lesson"] }],
  [ANSWER, "Did the girls enjoy the {event}?", "No, they ______ (enjoy) the {event}. The {thing} was bad.", "enjoy",
    { event: ["party", "concert", "trip", "festival"], thing: ["music", "food", "sound", "weather"] }],
  [ANSWER, "Did your brother find his {thing}?", "No, he ______ (find) his {thing} in the {place}.", "find",
    { thing: ["keys", "phone", "wallet", "ticket"], place: ["car", "flat", "office", "bag"] }],
  [ANSWER, "Did you get my {thing}?", "No, I ______ (get) your {thing}. Please send it to my {contact} again.", "get",
    { thing: ["message", "email", "file", "photo"], contact: ["email", "phone", "new number", "work email"] }],
].map(([instr, source, hint, b, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `didn't ${b}`, why: why(b), slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you didn't do yesterday.", "didn't + base form", ["exactly one sentence", "must include yesterday", "must use I"]],
  ["Write one sentence about a place you didn't go last weekend, and why.", "didn't go + because", ["exactly one sentence", "must use because", "must include last weekend"]],
  ["Write one sentence about food you didn't like as a child.", "didn't like", ["exactly one sentence", "must use didn't like", "must name the food"]],
  ["Write one sentence about a friend who didn't come to an event.", "didn't come", ["exactly one sentence", "must name the friend", "must name the event"]],
  ["Write one sentence about something you didn't understand in a lesson.", "didn't understand", ["exactly one sentence", "must name the lesson", "must include a past time"]],
  ["Write one sentence about two people who didn't have time for something.", "didn't have", ["exactly one sentence", "must use a plural subject", "must include a past time"]],
  ["Write one sentence with one positive and one negative past verb.", "past simple + didn't + base", ["exactly one sentence", "must use but", "must use didn't"]],
  ["Write two sentences: something you planned to do last week, and that you didn't do it.", "past simple, then didn't + base", ["exactly two sentences", "second sentence negative", "must include last week"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a day when nothing went right. Write three or four sentences.", "past simple negative", ["didn't + base form", "at least two negatives", "a finished time"]],
  ["Write about a trip where you didn't do what you planned. Write three or four sentences.", "past simple positive and negative", ["didn't + base form", "what you did instead", "a finished time"]],
  ["Explain to your teacher why you didn't do your homework. Write three or four sentences.", "past simple negative with reasons", ["didn't do", "because", "past simple verbs"]],
  ["Compare a good weekend and a bad one: what you did and what you didn't do. Write three or four sentences.", "past simple positive and negative", ["didn't + base form", "but", "last weekend or a date"]],
  ["Write about a time you were ill. What didn't you do that week? Write three or four sentences.", "past simple negative", ["didn't go, didn't eat, didn't sleep", "a finished time", "at least two negatives"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.past.simple-negative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);