// Hand-authored: tenses / past / irregular-past (A2).
//
// Tests ONE point: producing the irregular past simple form (go → went).
// Every sentence has one finished past time marker, never slotted.
//
// Choose distractors: the regularised form (goed: the classic overgeneralisation),
// the base form (tense not marked, common with Uzbek/Russian speakers when the
// time word already shows the past) and the past participle (seen for saw).
// Only verbs whose participle differs from the past form are used in choose,
// and no regularised form that is a real English word (singed, ringed, flied).
//
// Run: node tools/grammar-practice/authored/tenses.past.irregular-past.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "past", topic: "irregular-past", level: "A2", pv: "2.5" };
const why = (base, past, wrong) => `${base} is irregular: the past simple is ${past}, not ${wrong}.`;

/* ---------------- choose: 20 mcq [past, regularised, base, participle] ---------------- */
const CHOOSE = [
  [["went", "goed", "go", "gone"], "Last Saturday, my brother ______ to the {place} with his {person}.",
    { place: ["cinema", "market", "stadium", "zoo"], person: ["friends", "classmates", "cousins", "team"] }],
  [["saw", "seed", "see", "seen"], "Yesterday I ______ a big {animal} in the {place} near our house.",
    { animal: ["dog", "horse", "bird", "cat"], place: ["street", "field", "park", "yard"] }],
  [["ate", "eated", "eat", "eaten"], "Last night we ______ {food} at my {person}'s house.",
    { food: ["plov", "manti", "shashlik", "soup"], person: ["aunt", "grandmother", "uncle", "friend"] }],
  [["took", "taked", "take", "taken"], "On Monday morning, Nilufar ______ the {transport} to {place}.",
    { transport: ["bus", "metro", "train", "taxi"], place: ["college", "work", "the airport", "the city centre"] }],
  [["wrote", "writed", "write", "written"], "Last week, Javlon ______ a long {thing} to his {person}.",
    { thing: ["letter", "message", "email", "story"], person: ["grandmother", "teacher", "friend", "cousin"] }],
  [["gave", "gived", "give", "given"], "Yesterday my teacher ______ us a lot of {task} for the {period}.",
    { task: ["homework", "exercises", "reading", "tasks"], period: ["weekend", "holiday", "break", "week"] }],
  [["drove", "drived", "drive", "driven"], "Last summer, my father ______ us to {city} in his {car}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], car: ["old car", "new car", "car", "brother's car"] }],
  [["rode", "rided", "ride", "ridden"], "Two days ago, Sanjar ______ his {vehicle} to the {place}.",
    { vehicle: ["bike", "scooter", "horse", "motorbike"], place: ["river", "park", "village", "shop"] }],
  [["spoke", "speaked", "speak", "spoken"], "Yesterday, my cousin ______ {lang} with a tourist from {country}.",
    { lang: ["English", "Russian", "Korean", "French"], country: ["Germany", "France", "Italy", "Japan"] }],
  [["broke", "breaked", "break", "broken"], "Last week, I ______ my {thing} when I dropped it on the {place}.",
    { thing: ["phone", "plate", "watch", "cup"], place: ["floor", "stairs", "road", "ground"] }],
  [["swam", "swimmed", "swim", "swum"], "Last August, we ______ in the {place} with our {person}.",
    { place: ["sea", "lake", "river", "pool"], person: ["cousins", "father", "friends", "coach"] }],
  [["drank", "drinked", "drink", "drunk"], "After the match yesterday, the players ______ a lot of {drink} in the {place}.",
    { drink: ["water", "juice", "tea", "cold water"], place: ["changing room", "café", "bus", "park"] }],
  [["began", "beginned", "begin", "begun"], "Last Monday, my sister ______ a new {course} at the {place}.",
    { course: ["English course", "dance class", "job", "computer course"], place: ["college", "centre", "university", "library"] }],
  [["wore", "weared", "wear", "worn"], "At the party last night, Gulnora ______ a {colour} dress and {shoes}.",
    { colour: ["red", "blue", "white", "green"], shoes: ["black shoes", "white shoes", "new shoes", "boots"] }],
  [["chose", "choosed", "choose", "chosen"], "Last week, we ______ a new {thing} for our {room}.",
    { thing: ["sofa", "table", "carpet", "lamp"], room: ["living room", "kitchen", "bedroom", "flat"] }],
  [["forgot", "forgetted", "forget", "forgotten"], "Yesterday Akmal ______ his {thing} at the {place}.",
    { thing: ["keys", "phone", "bag", "umbrella"], place: ["café", "gym", "office", "library"] }],
  [["fell", "falled", "fall", "fallen"], "Last winter, my grandfather ______ on the {surface} near the {place}.",
    { surface: ["ice", "snow", "stairs", "wet road"], place: ["shop", "bank", "bus stop", "market"] }],
  [["did", "doed", "do", "done"], "Last night, I ______ my {subject} homework with my {person}.",
    { subject: ["maths", "physics", "English", "history"], person: ["brother", "friend", "father", "classmate"] }],
  [["grew", "growed", "grow", "grown"], "Last year, my grandmother ______ {plant} in her {place}.",
    { plant: ["tomatoes", "melons", "cucumbers", "flowers"], place: ["garden", "village garden", "yard", "dacha"] }],
  [["threw", "throwed", "throw", "thrown"], "In the game yesterday, Bobur ______ the ball to his {person} in the {place}.",
    { person: ["teammate", "friend", "brother", "coach"], place: ["park", "yard", "gym", "field"] }],
].map(([options, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: why(options[2], options[0], options[1]), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the past simple form of the verb in brackets. All the verbs are irregular.";
const BUILD = [
  ["buy", "bought", "Yesterday I ______ (buy) a new {thing} at the {place}.",
    { thing: ["phone", "bag", "jacket", "book"], place: ["market", "mall", "shop", "bazaar"] }],
  ["bring", "brought", "Last night, my uncle ______ (bring) {food} from {city}.",
    { food: ["melons", "grapes", "apricots", "bread"], city: ["Samarkand", "Fergana", "Bukhara", "Khorezm"] }],
  ["teach", "taught", "Last year, Mrs Karimova ______ (teach) {subject} at our {place}.",
    { subject: ["maths", "chemistry", "English", "biology"], place: ["school", "college", "lyceum", "centre"] }],
  ["catch", "caught", "On Sunday morning, my father ______ (catch) three {fish} in the {place}.",
    { fish: ["fish", "big fish", "small fish", "carp"], place: ["river", "lake", "reservoir", "pond"] }],
  ["sell", "sold", "Last month, we ______ (sell) our old {thing} to a {person}.",
    { thing: ["car", "sofa", "fridge", "bike"], person: ["neighbour", "friend", "young man", "family"] }],
  ["tell", "told", "Yesterday, Madina ______ (tell) her {person} about the {event}.",
    { person: ["mother", "friends", "teacher", "sister"], event: ["test", "trip", "party", "match"] }],
  ["find", "found", "Last night, I ______ (find) my {thing} under the {place}.",
    { thing: ["keys", "phone", "wallet", "ring"], place: ["sofa", "bed", "table", "car seat"] }],
  ["leave", "left", "Two hours ago, the {transport} ______ (leave) for {city}.",
    { transport: ["train", "bus", "minibus", "night bus"], city: ["Samarkand", "Bukhara", "Andijan", "Nukus"] }],
  ["make", "made", "Last weekend, my sister ______ (make) a {food} for our {person}'s birthday.",
    { food: ["cake", "pie", "salad", "pizza"], person: ["father", "mother", "brother", "grandmother"] }],
  ["pay", "paid", "Yesterday, Rustam ______ (pay) {amount} for a {thing}.",
    { amount: ["50,000 som", "100,000 som", "a lot", "too much"], thing: ["new shirt", "haircut", "taxi", "ticket"] }],
  ["send", "sent", "Last week, I ______ (send) a {thing} to my {person} in Russia.",
    { thing: ["parcel", "letter", "card", "photo"], person: ["brother", "aunt", "cousin", "uncle"] }],
  ["sleep", "slept", "Last night, the baby ______ (sleep) in the {room} with her {person}.",
    { room: ["bedroom", "small room", "living room", "big room"], person: ["mother", "grandmother", "sister", "aunt"] }],
  ["spend", "spent", "Last summer, we ______ (spend) two weeks in {place} with our {person}.",
    { place: ["Charvak", "Chimgan", "Bukhara", "Khiva"], person: ["cousins", "grandparents", "friends", "uncle"] }],
  ["stand", "stood", "At the concert yesterday, we ______ (stand) near the {place} with our {person}.",
    { place: ["stage", "door", "window", "exit"], person: ["friends", "classmates", "cousins", "teacher"] }],
  ["win", "won", "Last month, our {team} ______ (win) the {competition}.",
    { team: ["football team", "class", "school team", "volleyball team"], competition: ["cup", "final", "city game", "match"] }],
  ["feel", "felt", "After the exam yesterday, Sevara ______ (feel) very {state} and went to the {place}.",
    { state: ["tired", "happy", "hungry", "sleepy"], place: ["park", "café", "canteen", "garden"] }],
  ["keep", "kept", "Last year, my grandfather ______ (keep) {animals} in his {place}.",
    { animals: ["chickens", "sheep", "rabbits", "goats"], place: ["yard", "garden", "village house", "dacha"] }],
  ["hear", "heard", "Last night, I ______ (hear) a loud {sound} from the {place}.",
    { sound: ["noise", "bang", "song", "voice"], place: ["street", "flat upstairs", "yard", "kitchen"] }],
  ["draw", "drew", "In class yesterday, the children ______ (draw) pictures of {thing} with {tool}.",
    { thing: ["animals", "their families", "the sea", "flowers"], tool: ["pencils", "crayons", "markers", "paint"] }],
  ["build", "built", "Last year, the workers ______ (build) a new {building} near our {place}.",
    { building: ["school", "hospital", "park", "shop"], place: ["house", "street", "flat", "college"] }],
].map(([b, key, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: `${b} is irregular: the past simple is ${key}.`, slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ROUTINE = "The first sentence is a routine. Complete the second sentence in the past simple.";
const NEG_POS = "The first sentence is negative. Complete the second sentence: this person did it.";
const ANSWER = "Answer the question. Use the past simple form of the verb in brackets.";
const TRANSFORM = [
  [ROUTINE, "I usually go to college by {transport}.", "Yesterday I ______ (go) to college by {transport} with my {person}.", "went",
    { transport: ["bus", "metro", "taxi", "minibus"], person: ["brother", "friend", "sister", "classmate"] }],
  [ROUTINE, "We usually eat {food} on Fridays.", "Last Friday we ______ (eat) {food} at my {person}'s house.", "ate",
    { food: ["plov", "manti", "soup", "fish"], person: ["aunt", "grandmother", "uncle", "friend"] }],
  [ROUTINE, "My sister writes in her {thing} every evening.", "Last night my sister ______ (write) in her {thing} in the {room}.", "wrote",
    { thing: ["diary", "notebook", "journal", "planner"], room: ["kitchen", "bedroom", "garden", "living room"] }],
  [ROUTINE, "Aziz drinks {drink} every morning.", "This morning Aziz ______ (drink) {drink} in the {place}.", "drank",
    { drink: ["green tea", "black tea", "coffee", "milk"], place: ["kitchen", "café", "office", "car"] }],
  [ROUTINE, "I usually wake up at 7.", "Yesterday I ______ (wake) up early because of the {sound} in the {place}.", "woke",
    { sound: ["noise", "rain", "music", "birds"], place: ["street", "yard", "flat upstairs", "garden"] }],
  [NEG_POS, "I didn't see the {thing}.", "My {person} ______ (see) the {thing} on Sunday.", "saw",
    { thing: ["film", "match", "concert", "show"], person: ["sister", "father", "cousin", "friend"] }],
  [NEG_POS, "Ali didn't speak to the {person}.", "His {who} ______ (speak) to the {person} after the lesson.", "spoke",
    { person: ["teacher", "coach", "director", "new student"], who: ["mother", "father", "brother", "friend"] }],
  [NEG_POS, "We didn't swim in the {place}.", "Our {person} ______ (swim) in the {place} all afternoon.", "swam",
    { place: ["lake", "river", "sea", "pool"], person: ["cousins", "friends", "children", "parents"] }],
  [NEG_POS, "Lola didn't forget her {thing}.", "Her brother ______ (forget) his {thing} at the {place}.", "forgot",
    { thing: ["keys", "phone", "bag", "ticket"], place: ["café", "school", "station", "gym"] }],
  [NEG_POS, "I didn't ride a horse in {place}.", "My {person} ______ (ride) a horse in {place}.", "rode",
    { place: ["the village", "Chimgan", "the mountains", "Zomin"], person: ["brother", "cousin", "sister", "friend"] }],
  [ANSWER, "Which {thing} did you choose?", "I ______ (choose) the {colour} one.", "chose",
    { thing: ["jacket", "bag", "phone case", "bike"], colour: ["blue", "black", "red", "green"] }],
  [ANSWER, "What did your grandmother give you for your birthday?", "She ______ (give) me a {thing} and some {food}.", "gave",
    { thing: ["book", "watch", "scarf", "wallet"], food: ["sweets", "fruit", "cake", "chocolate"] }],
  [ANSWER, "Who drove you to the {place}?", "My {person} ______ (drive) me to the {place}.", "drove",
    { place: ["airport", "station", "hospital", "wedding"], person: ["uncle", "father", "brother", "neighbour"] }],
  [ANSWER, "What time did the {event} begin?", "The {event} ______ (begin) at 6, so we missed the {part}.", "began",
    { event: ["film", "concert", "match", "show"], part: ["beginning", "first part", "start", "first ten minutes"] }],
  [ANSWER, "What did you do at the weekend?", "I ______ (do) the {chore} and visited my {person}.", "did",
    { chore: ["shopping", "cleaning", "washing", "cooking"], person: ["aunt", "grandmother", "friend", "cousin"] }],
].map(([instr, source, hint, key, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key,
  why: `The second sentence is about the finished past, so use the irregular past simple: ${key}.`, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about where you went last weekend.", "went", ["exactly one sentence", "must include last weekend", "must use went"]],
  ["Write one sentence about something you bought recently.", "bought", ["exactly one sentence", "must include a past time", "must use bought"]],
  ["Write one sentence about what you ate yesterday.", "ate", ["exactly one sentence", "must include yesterday", "must use ate"]],
  ["Write one sentence about someone you met last month.", "met", ["exactly one sentence", "must include last month", "must name the person"]],
  ["Write one sentence about a present someone gave you.", "gave", ["exactly one sentence", "must use gave", "must name the present"]],
  ["Write one sentence about something you saw on the way to school or work.", "saw", ["exactly one sentence", "must use saw", "must include a past time"]],
  ["Write one sentence with two irregular past verbs about your morning.", "two irregular past forms", ["exactly one sentence", "must use two different irregular verbs", "must include this morning"]],
  ["Write two sentences about a trip: how you went and what you did there.", "irregular past simple", ["exactly two sentences", "at least two irregular verbs", "must include a past time"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe what you did last weekend. Write three or four sentences.", "irregular past simple", ["went, saw, ate or bought", "a past time marker", "at least three irregular verbs"]],
  ["Write about a holiday you remember. Where did you go and what did you do? Write three or four sentences.", "irregular past simple", ["went", "took, saw or swam", "a finished time"]],
  ["Tell a friend about a busy day yesterday. Write three or four sentences.", "irregular past simple", ["woke, got or left", "a finished time", "at least three irregular verbs"]],
  ["Describe a birthday or a family celebration. Who came, what did people bring and what did you eat? Write three or four sentences.", "irregular past simple", ["came", "brought or gave", "ate or drank"]],
  ["Write about a time you lost something and found it again. Write three or four sentences.", "irregular past simple", ["lost", "found", "thought, saw or went"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.past.irregular-past.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);