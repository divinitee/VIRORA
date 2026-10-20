// Hand-authored: tenses / past / interrupted-action (A2).
//
// Tests ONE point: a longer background action in the past continuous
// (was/were + -ing) interrupted by a short action in the past simple
// ("While I was cooking dinner, my phone rang").
//
// Half the items blank the background action, half blank the interruption.
// Background distractors: present continuous, wrong be (I were / they was),
// bare -ing. The past simple is NOT a background distractor ("While I cooked,
// the phone rang" is possible English). Interruption distractors: a
// regularised past (falled), the present simple, and the present perfect.
//
// Run: node tools/grammar-practice/authored/tenses.past.interrupted-action.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "past", topic: "interrupted-action", level: "A2", pv: "2.5" };
const BE = { i: "was", sg: "was", pl: "were" };
const NOW = { i: "am", sg: "is", pl: "are" };
const WRONG = { i: "were", sg: "were", pl: "was" };
const bgWhy = (type, ing) => `This is the longer action in progress when something else happened, so use the past continuous: ${BE[type]} ${ing}.`;
const intWhy = (past) => `This is the short action that interrupted the longer one, so use the past simple: ${past}.`;

/* ---------------- choose: 20 mcq ---------------- */
const BG = [
  ["i", "cooking", "While I ______ {food} for dinner, my phone rang in the {room}.",
    { food: ["plov", "soup", "pasta", "rice"], room: ["hall", "bedroom", "living room", "other room"] }],
  ["sg", "walking", "While Aziz ______ to the {place}, he saw his old {person}.",
    { place: ["market", "bus stop", "station", "library"], person: ["teacher", "classmate", "neighbour", "friend"] }],
  ["pl", "playing", "While we ______ {sport} in the park, it started to {weather}.",
    { sport: ["football", "volleyball", "tennis", "basketball"], weather: ["rain", "snow", "get dark", "get cold"] }],
  ["sg", "reading", "Madina ______ a {thing} in the {place} when the lights went out.",
    { thing: ["book", "magazine", "story", "letter"], place: ["library", "classroom", "bedroom", "kitchen"] }],
  ["pl", "running", "The children ______ around in the {place} when their {person} called them for dinner.",
    { place: ["yard", "garden", "park", "street"], person: ["mother", "grandmother", "father", "aunt"] }],
  ["sg", "driving", "While my father ______ to work, he heard a strange {sound} from the {part}.",
    { sound: ["noise", "sound", "click", "bang"], part: ["engine", "back", "wheels", "roof"] }],
  ["i", "having", "I ______ a shower when my {person} knocked on the door with a {thing}.",
    { person: ["brother", "neighbour", "sister", "cousin"], thing: ["parcel", "cake", "bag", "box"] }],
  ["pl", "writing", "While the students ______ the test, the {thing} in the {room} stopped working.",
    { thing: ["lights", "heating", "clock", "computers"], room: ["classroom", "hall", "exam room", "library"] }],
  ["sg", "working", "My grandmother ______ in the garden when she found an old {thing} under the {plant}.",
    { thing: ["coin", "key", "ring", "spoon"], plant: ["tree", "apple tree", "bush", "flowers"] }],
  ["pl", "waiting", "While they ______ for the {transport}, it started to rain in {city}.",
    { transport: ["bus", "train", "taxi", "minibus"], city: ["Tashkent", "Samarkand", "Andijan", "Termez"] }],
].map(([type, ing, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt,
  options: [`${BE[type]} ${ing}`, `${NOW[type]} ${ing}`, `${WRONG[type]} ${ing}`, ing], key: 0, why: bgWhy(type, ing), slots,
}));
const INT = [
  [["rang", "ringed", "rings", "has rung"], "We were having dinner when the doorbell ______ and our {person} came in with {thing}.",
    { person: ["uncle", "aunt", "cousins", "neighbour"], thing: ["a cake", "flowers", "a big box", "fruit"] }],
  [["fell", "falled", "falls", "has fallen"], "Kamila was running for the {transport} when she ______ and hurt her {part}.",
    { transport: ["bus", "train", "minibus", "tram"], part: ["knee", "leg", "hand", "foot"] }],
  [["found", "finded", "finds", "has found"], "I was walking home when I ______ a {thing} on the ground near the {place}.",
    { thing: ["phone", "wallet", "key", "bag"], place: ["park", "bus stop", "school", "shop"] }],
  [["broke", "breaked", "breaks", "has broken"], "My brother was doing his {subject} homework when his laptop ______ and he lost his {work}.",
    { subject: ["maths", "history", "English", "physics"], work: ["essay", "project", "notes", "drawings"] }],
  [["came", "comed", "comes", "has come"], "We were watching a film when the {person} next door ______ to the door with a {thing}.",
    { person: ["woman", "man", "boy", "girl"], thing: ["question", "parcel", "cat", "bag"] }],
  [["cut", "cutted", "cuts", "has cut"], "While Sardor was cooking {food}, he ______ his finger on a {thing}.",
    { food: ["plov", "soup", "dinner", "lunch"], thing: ["knife", "sharp lid", "broken glass", "tin can"] }],
  [["met", "meeted", "meets", "has met"], "While I was waiting at the bus stop, I ______ my old {person} from {place}.",
    { person: ["teacher", "classmate", "neighbour", "coach"], place: ["school", "college", "the village", "my first job"] }],
  [["began", "beginned", "begins", "has begun"], "The girls were playing tennis at the {place} when it ______ to {weather}.",
    { place: ["park", "club", "school", "sports centre"], weather: ["rain", "snow", "get dark", "get windy"] }],
  [["lost", "losed", "loses", "has lost"], "My mother was shopping at the {place} when she ______ her {thing}.",
    { place: ["market", "bazaar", "mall", "supermarket"], thing: ["purse", "phone", "keys", "bag"] }],
  [["hit", "hitted", "hits", "has hit"], "While we were driving to {city}, our car ______ a big stone on the road near {place}.",
    { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"], place: ["Jizzakh", "Gulistan", "the river", "a village"] }],
].map(([options, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: intWhy(options[0]), slots,
}));
const CHOOSE = [...BG, ...INT];

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_BG = "Complete the sentence with the past continuous form of the verb in brackets: the longer action.";
const INSTR_INT = "Complete the sentence with the past simple form of the verb in brackets: the short action that interrupted.";
const BUILD = [
  ...[
    ["i", "washing", "While I ______ (wash) the dishes, I broke a {thing} from my {person}'s set.",
      { thing: ["plate", "cup", "glass", "bowl"], person: ["grandmother", "mother", "aunt", "sister"] }],
    ["sg", "riding", "Nodir ______ (ride) his bike to {place} when it started to {weather}.",
      { place: ["school", "college", "work", "the shop"], weather: ["rain", "snow", "get dark", "get windy"] }],
    ["pl", "eating", "While we ______ (eat) {food} at the café, our {person} arrived.",
      { food: ["plov", "pizza", "soup", "salad"], person: ["friends", "cousins", "teacher", "uncle"] }],
    ["sg", "sleeping", "The baby ______ (sleep) in the {room} when the {thing} rang.",
      { room: ["bedroom", "next room", "small room", "living room"], thing: ["phone", "doorbell", "alarm", "telephone"] }],
    ["pl", "watching", "While my parents ______ (watch) the {show}, the power went off in the whole {place}.",
      { show: ["news", "match", "film", "concert"], place: ["building", "street", "house", "district"] }],
    ["i", "running", "I ______ (run) in the {place} when I saw a {animal}.",
      { place: ["park", "forest", "stadium", "village"], animal: ["big dog", "cat", "rabbit", "horse"] }],
    ["sg", "making", "While Zuhra ______ (make) a cake, her {person} came home from {place}.",
      { person: ["brother", "grandfather", "aunt", "friend"], place: ["work", "school", "the market", "college"] }],
    ["pl", "building", "The workers ______ (build) a new {building} when they found an old {thing}.",
      { building: ["school", "house", "shop", "road"], thing: ["coin", "wall", "pot", "well"] }],
    ["i", "talking", "While I ______ (talk) to my {person} outside the {place}, my phone battery died.",
      { person: ["aunt", "friend", "teacher", "cousin"], place: ["school", "shop", "bank", "cinema"] }],
    ["pl", "swimming", "My friends ______ (swim) in the {place} when a big {thing} came.",
      { place: ["lake", "river", "sea", "reservoir"], thing: ["wave", "boat", "storm", "wind"] }],
  ].map(([type, ing, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_BG, source, key: `${BE[type]} ${ing}`, why: bgWhy(type, ing), slots })),
  ...[
    ["rang", "I was sleeping when the {thing} ______ (ring) in the {room}.",
      { thing: ["alarm", "phone", "doorbell", "telephone"], room: ["hall", "kitchen", "bedroom", "flat"] }],
    ["came", "We were having dinner when my {person} ______ (come) home with a {thing}.",
      { person: ["father", "sister", "uncle", "brother"], thing: ["big box", "new bike", "cake", "puppy"] }],
    ["saw", "Laylo was walking to school when she ______ (see) a {animal} in the {place}.",
      { animal: ["cat", "dog", "horse", "cow"], place: ["street", "road", "park", "yard"] }],
    ["fell", "While Akmal was playing {sport}, he ______ (fall) and hurt his {part}.",
      { sport: ["football", "basketball", "volleyball", "tennis"], part: ["knee", "arm", "leg", "back"] }],
    ["sent", "While I was reading, my {person} ______ (send) me a message about the {thing}.",
      { person: ["friend", "cousin", "teacher", "sister"], thing: ["party", "test", "match", "trip"] }],
    ["left", "The students were writing their test when the teacher ______ (leave) the {room} to answer a {thing}.",
      { room: ["classroom", "room", "hall", "lab"], thing: ["call", "question", "phone call", "message"] }],
    ["dropped", "My uncle was fixing the roof when he ______ (drop) his {tool} into the {place}.",
      { tool: ["hammer", "phone", "keys", "bag"], place: ["garden", "yard", "street", "bushes"] }],
    ["gave", "While we were waiting for the bus, a {person} ______ (give) us {thing}.",
      { person: ["woman", "man", "boy", "girl"], thing: ["a map", "some water", "directions", "an umbrella"] }],
    ["met", "Dilshod was shopping at the {place} when he ______ (meet) his {person}.",
      { place: ["market", "bazaar", "mall", "supermarket"], person: ["teacher", "cousin", "neighbour", "coach"] }],
    ["stopped", "While the girls were dancing at the {event}, the music suddenly ______ (stop) and the {place} went dark.",
      { event: ["party", "wedding", "concert", "birthday party"], place: ["room", "hall", "stage", "house"] }],
  ].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_INT, source, key, why: intWhy(key), slots })),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with while. Use the past continuous for the longer action and the past simple for the short one.";
const NEW_SUBJ = "Rewrite the sentence with the new subject. Keep the past continuous for the longer action.";
const NEW_EVENT = "Complete the second sentence with a new short action in the past simple.";
const TRANSFORM = [
  [JOIN, "I was cooking {food}. The phone rang in the {room}.", "While I ______ (cook) {food}, the phone ______ (ring) in the {room}.", ["was cooking", "rang"],
    { food: ["plov", "soup", "pasta", "rice"], room: ["hall", "bedroom", "living room", "other room"] }],
  [JOIN, "Ali was riding his bike. He saw a {animal} on the {place}.", "While Ali ______ (ride) his bike, he ______ (see) a {animal} on the {place}.", ["was riding", "saw"],
    { animal: ["dog", "cat", "horse", "cow"], place: ["road", "path", "bridge", "street"] }],
  [JOIN, "We were playing {sport}. It started to {weather}.", "While we ______ (play) {sport}, it ______ (start) to {weather}.", ["were playing", "started"],
    { sport: ["football", "volleyball", "basketball", "tennis"], weather: ["rain", "snow", "get dark", "get cold"] }],
  [JOIN, "My mother was shopping at the {place}. She lost her {thing}.", "While my mother ______ (shop) at the {place}, she ______ (lose) her {thing}.", ["was shopping", "lost"],
    { place: ["market", "bazaar", "mall", "supermarket"], thing: ["purse", "phone", "keys", "bag"] }],
  [JOIN, "The students were having a test. The {thing} went off in the {room}.", "While the students ______ (have) a test, the {thing} ______ (go) off in the {room}.", ["were having", "went"],
    { thing: ["lights", "fire alarm", "heating", "computers"], room: ["classroom", "hall", "exam room", "building"] }],
  [NEW_SUBJ, "I was walking to the {place} when I met {name}.", "My sisters ______ (walk) to the {place} when they met {name}.", "were walking",
    { place: ["market", "station", "park", "library"], name: ["Aziz", "Olga", "Bobur", "Nigora"] }],
  [NEW_SUBJ, "The boys were swimming in the {place} when it got {state}.", "Bobur ______ (swim) in the {place} when it got {state}.", "was swimming",
    { place: ["lake", "river", "sea", "pool"], state: ["cold", "dark", "windy", "cloudy"] }],
  [NEW_SUBJ, "You were sleeping when your {person} came home.", "I ______ (sleep) when my {person} came home from {place}.", "was sleeping",
    { person: ["father", "brother", "mother", "sister"], place: ["work", "school", "the market", "college"] }],
  [NEW_SUBJ, "She was watching a {show} when the {thing} rang.", "My grandparents ______ (watch) a {show} when the {thing} rang.", "were watching",
    { show: ["film", "match", "concert", "cartoon"], thing: ["phone", "doorbell", "alarm", "telephone"] }],
  [NEW_SUBJ, "He was talking on the phone when the {transport} arrived.", "We ______ (talk) on the phone when the {transport} arrived at the {place}.", "were talking",
    { transport: ["bus", "train", "taxi", "minibus"], place: ["stop", "station", "corner", "gate"] }],
  [NEW_EVENT, "I was reading in my {room} when my phone rang.", "I was reading in my {room} when my {person} ______ (come) in.", "came",
    { room: ["room", "bedroom", "bed", "little room"], person: ["mother", "brother", "sister", "grandfather"] }],
  [NEW_EVENT, "We were eating {food} when the lights went out.", "We were eating {food} when our {person} ______ (arrive) from the airport.", "arrived",
    { food: ["plov", "salad", "soup", "samsa"], person: ["uncle", "aunt", "cousins", "guests"] }],
  [NEW_EVENT, "Sara was running in the {place} when it started to rain.", "Sara was running in the {place} when she ______ (fall) over a {thing}.", "fell",
    { place: ["park", "forest", "stadium", "street"], thing: ["stone", "branch", "bag", "dog"] }],
  [NEW_EVENT, "My father was driving to {city} when the radio stopped.", "My father was driving to {city} when he ______ (hear) a strange {sound}.", "heard",
    { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"], sound: ["noise", "sound", "click", "bang"] }],
  [NEW_EVENT, "The children were playing in the {place} when their mother called.", "The children were playing in the {place} when it ______ (begin) to {weather}.", "began",
    { place: ["yard", "park", "garden", "street"], weather: ["rain", "snow", "get dark", "get cold"] }],
].map(([instr, source, hint, key, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key,
  why: Array.isArray(key)
    ? `The longer action in progress is past continuous (${key[0]}); the short action that interrupted it is past simple (${key[1]}).`
    : instr === NEW_EVENT ? intWhy(key) : `The longer action in progress takes the past continuous; check the subject: ${key}.`,
  slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with while about something that happened while you were walking.", "while + was + -ing, then past simple", ["exactly one sentence", "must use while", "must use I"]],
  ["Write one sentence about a time your phone rang at a bad moment.", "was + -ing when + past simple", ["exactly one sentence", "must use when", "must include rang"]],
  ["Write one sentence about the weather changing while people were doing something outside.", "were + -ing when it started to", ["exactly one sentence", "must use a plural subject", "must use started"]],
  ["Write one sentence about meeting someone by chance.", "was + -ing when I met", ["exactly one sentence", "must use met", "must name a place"]],
  ["Write one sentence about a small accident at home.", "was + -ing when + past simple", ["exactly one sentence", "must name what the person was doing", "must name what happened"]],
  ["Write one sentence about the lights going out.", "past continuous + when the lights went out", ["exactly one sentence", "must include the lights went out", "must use was or were + -ing"]],
  ["Write one sentence that starts with While my friends were...", "while + were + -ing, then past simple", ["exactly one sentence", "must start with While my friends were", "second part in the past simple"]],
  ["Write two sentences: what you were doing, and then what interrupted you.", "past continuous, then past simple", ["exactly two sentences", "first sentence past continuous", "second sentence past simple"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell a short story about a day when something surprising happened. Write three or four sentences.",
    "past continuous for background, past simple for events", ["was or were + -ing for the scene", "when or while", "past simple for what happened"]],
  ["Describe a time a plan went wrong because of the weather. Write three or four sentences.",
    "past continuous interrupted by past simple", ["what people were doing", "what the weather did", "when or while"]],
  ["Write about a funny moment in class or at work. Write three or four sentences.",
    "past continuous background, past simple interruption", ["were + -ing for the class", "a short event in past simple", "a result"]],
  ["Describe a journey where something unexpected happened on the way. Write three or four sentences.",
    "past continuous for the journey, past simple for the event", ["was or were + -ing", "a short event", "while or when"]],
  ["Write about a time you met someone by chance. Say what you were doing, where, and what happened next. Write three or four sentences.",
    "past continuous and past simple in a story", ["was + -ing", "when I met or when I saw", "what happened next"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.past.interrupted-action.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);