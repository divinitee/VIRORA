// Hand-authored: questions-negation / yes-no / past-did (A2).
//
// Placement focus: Did for past simple yes/no questions, then the BASE verb.
// Every sentence has one fixed past time marker (never slotted: the key depends
// on it). Choose: 12 items pick the auxiliary (distractors Do / Does — the
// tense error — and Were, the be-for-do transfer; every item has a main verb so
// Were is never right); 8 items pick the verb after Did (distractors: past,
// -ing, -s — "Did you went" is the classic error). Build: two blanks, Did + base
// verb from the cue. Transform kinds: past statement → question (5), present
// question → past with the given time (5), answer → question (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.yes-no.past-did.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "yes-no", topic: "past-did", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DID = "The time is in the past, so the question starts with Did, for every subject.";
const BASEV = "After Did, use the base verb. Did already shows the past, so no -ed, no past form.";
const O = ["Did", "Do", "Does", "Were"];
const O_SG = ["Did", "Does", "Do", "Was"];
const v = (b, past, ing, s) => [b, past, ing, s];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O, DID, "______ you watch the {game} last night, {name}?", { game: ["match", "film", "concert", "show"], name: NAME }],
  [O_SG, DID, "______ your sister call you from {city} yesterday, {name}?", { city: CITY, name: NAME }],
  [O, DID, "______ they go to {city} by {transport} last summer?", { city: CITY, transport: ["train", "car", "bus", "plane"] }],
  [O_SG, DID, "______ Jasur buy a new {thing} last week, {name}?", { thing: ["phone", "bike", "jacket", "laptop"], name: NAME }],
  [O, DID, "______ you finish your {task} yesterday, {name}?", { task: ["homework", "project", "essay", "book"], name: NAME }],
  [O_SG, DID, "______ it snow in {city} last winter, {name}?", { city: CITY, name: NAME }],
  [O, DID, "______ your parents visit your grandma on {day}, {name}?", { day: ["Sunday", "Saturday", "Friday", "Monday"], name: NAME }],
  [O_SG, DID, "______ the {transport} leave on time this morning, {name}?", { transport: ["bus", "train", "plane", "minibus"], name: NAME }],
  [O, DID, "______ you eat {food} for dinner last night, {name}?", { food: ["plov", "soup", "pasta", "fish"], name: NAME }],
  [O_SG, DID, "______ Madina pass her {subject} test last week, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [O, DID, "______ we have {subject} two days ago, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [O_SG, DID, "______ your dad fix the {thing} yesterday, {name}?", { thing: ["car", "door", "TV", "bike"], name: NAME }],
  [v("go", "went", "going", "goes"), BASEV, "Did you ______ to the {place} yesterday, {name}?", { place: ["gym", "market", "library", "park"], name: NAME }],
  [v("see", "saw", "seeing", "sees"), BASEV, "Did Kamron ______ the new {thing} last week, {name}?", { thing: ["film", "teacher", "classroom", "cartoon"], name: NAME }],
  [v("make", "made", "making", "makes"), BASEV, "Did your mum ______ {food} on Sunday, {name}?", { food: ["plov", "samsa", "a cake", "soup"], name: NAME }],
  [v("take", "took", "taking", "takes"), BASEV, "Did you ______ the {transport} this morning, {name}?", { transport: ["bus", "metro", "train", "taxi"], name: NAME }],
  [v("win", "won", "winning", "wins"), BASEV, "Did your team ______ the {game} last Saturday, {name}?", { game: ["match", "game", "cup", "final"], name: NAME }],
  [v("write", "wrote", "writing", "writes"), BASEV, "Did Olga ______ to her {person} last month, {name}?", { person: ["grandma", "cousin", "friend", "aunt"], name: ["Aziz", "Timur", "Malika", "Dilnoza"] }],
  [v("buy", "bought", "buying", "buys"), BASEV, "Did they ______ {item} at the market yesterday, {name}?", { item: ["apples", "bread", "rice", "eggs"], name: NAME }],
  [v("sleep", "slept", "sleeping", "sleeps"), BASEV, "Did the baby ______ in the {room} last night, {name}?", { room: ["bedroom", "living room", "small room", "big room"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Make a past question: write Did in the first gap and the verb in brackets in the second.";
const BUILD = [
  ["go", "______ you ______ (go) to the {place} last weekend, {name}?", { place: ["park", "cinema", "museum", "bazaar"], name: NAME }],
  ["call", "______ Dilnoza ______ (call) her {person} yesterday?", { person: ["mum", "dad", "grandma", "brother"] }],
  ["have", "______ you ______ (have) {meal} this morning, {name}?", { meal: ["breakfast", "tea", "a shower", "a lesson"], name: NAME }],
  ["play", "______ your brothers ______ (play) {game} last night?", { game: ["football", "chess", "cards", "volleyball"] }],
  ["see", "______ you ______ (see) Sardor at the {place} yesterday, {name}?", { place: ["station", "gym", "market", "party"], name: NAME }],
  ["rain", "______ it ______ (rain) in {city} last week?", { city: CITY }],
  ["do", "______ you ______ (do) your {task} last night, {name}?", { task: ["homework", "project", "exercises", "reading"], name: NAME }],
  ["get", "______ your cousin ______ (get) a {thing} for his birthday?", { thing: ["bike", "phone", "watch", "ball"] }],
  ["come", "______ the {person} ______ (come) to class yesterday, {name}?", { person: ["teacher", "new student", "headteacher", "coach"], name: NAME }],
  ["drink", "______ you ______ (drink) {drink} at the party, {name}?", { drink: ["juice", "tea", "water", "lemonade"], name: NAME }],
  ["live", "______ your grandparents ______ (live) in {city} ten years ago?", { city: CITY }],
  ["lose", "______ Bobur ______ (lose) his {thing} last week, {name}?", { thing: ["keys", "phone", "bag", "wallet"], name: NAME }],
  ["meet", "______ you ______ (meet) your friends at the {place} on Saturday, {name}?", { place: ["café", "park", "cinema", "gym"], name: NAME }],
  ["read", "______ Shirin ______ (read) the {thing} last night, {name}?", { thing: ["book", "story", "message", "letter"], name: NAME }],
  ["help", "______ your sister ______ (help) you with {subject} yesterday, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["start", "______ the {event} ______ (start) late yesterday, {name}?", { event: ["lesson", "match", "concert", "film"], name: NAME }],
  ["clean", "______ you ______ (clean) the {room} on Sunday, {name}?", { room: ["kitchen", "bedroom", "bathroom", "living room"], name: NAME }],
  ["send", "______ Nigora ______ (send) you a {thing} last night?", { thing: ["message", "photo", "video", "letter"] }],
  ["find", "______ you ______ (find) your {thing} this morning, {name}?", { thing: ["keys", "glasses", "phone", "bag"], name: NAME }],
  ["fly", "______ your uncle ______ (fly) to {city} last month?", { city: ["Moscow", "Istanbul", "Seoul", "Dubai"] }],
].map(([vb, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: ["Did", vb], why: `${DID} Then the base verb ${vb}.`, slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_Q = "Make a yes/no question. Write one word in each gap.";
const T_PAST = (t) => `Ask the same question about ${t}. Write one word in each gap.`;
const T_ANS = "Write the question for this answer. Write one word in each gap.";
const W1 = (past, b) => `Use Did + subject + base verb: ${past} becomes Did … ${b}.`;
const W2 = (aux, b) => `The time is now in the past, so ${aux} becomes Did. The verb stays ${b}.`;
const W3 = (b) => `"Yes, … did" answers a Did question: Did + subject + ${b}.`;
const TRANSFORM = [
  [T_Q, "You went to {city} last year, {name}.", "______ you ______ to {city} last year, {name}?", ["Did", "go"], W1("went", "go"), { city: CITY, name: NAME }],
  [T_Q, "Farrukh bought a {thing} yesterday, {name}.", "______ Farrukh ______ a {thing} yesterday, {name}?", ["Did", "buy"], W1("bought", "buy"), { thing: ["ball", "book", "hat", "phone case"], name: NAME }],
  [T_Q, "They ate {food} at the wedding, {name}.", "______ they ______ {food} at the wedding, {name}?", ["Did", "eat"], W1("ate", "eat"), { food: ["plov", "samsa", "salads", "cake"], name: NAME }],
  [T_Q, "Your sister made a {food} last night, {name}.", "______ your sister ______ a {food} last night, {name}?", ["Did", "make"], W1("made", "make"), { food: ["cake", "salad", "pizza", "soup"], name: NAME }],
  [T_Q, "Lola wrote a {thing} in her {lesson} lesson.", "______ Lola ______ a {thing} in her {lesson} lesson?", ["Did", "write"], W1("wrote", "write"), { thing: ["story", "letter", "poem", "report"], lesson: ["English", "Uzbek", "Russian", "literature"] }],
  [T_PAST("last Friday"), "Do you play {game} on Fridays, {name}?", "______ you ______ {game} last Friday, {name}?", ["Did", "play"], W2("Do", "play"), { game: ["football", "chess", "tennis", "volleyball"], name: NAME }],
  [T_PAST("last year"), "Does your dad work in {city}, {name}?", "______ your dad ______ in {city} last year, {name}?", ["Did", "work"], W2("Does", "work"), { city: CITY, name: NAME }],
  [T_PAST("yesterday evening"), "Do they watch {show} every evening, {name}?", "______ they ______ {show} yesterday evening, {name}?", ["Did", "watch"], W2("Do", "watch"), { show: ["the news", "cartoons", "football", "films"], name: NAME }],
  [T_PAST("this morning"), "Does Aziza walk to the {place}, {name}?", "______ Aziza ______ to the {place} this morning, {name}?", ["Did", "walk"], W2("Does", "walk"), { place: ["college", "station", "market", "library"], name: NAME }],
  [T_PAST("last night"), "Do you study {subject} at night, {name}?", "______ you ______ {subject} last night, {name}?", ["Did", "study"], W2("Do", "study"), { subject: ["maths", "English", "history", "science"], name: NAME }],
  [T_ANS, "— Yes, I did. I visited my {person} in {city} on Sunday.", "______ you ______ your {person} in {city} on Sunday?", ["Did", "visit"], W3("visit"), { person: ["grandma", "aunt", "uncle", "cousin"], city: CITY }],
  [T_ANS, "— Yes, she did. Malika won the {event} at {place} last month.", "______ Malika ______ the {event} at {place} last month?", ["Did", "win"], W3("win"), { event: ["race", "competition", "quiz", "prize"], place: ["school", "college", "the club", "the sports centre"] }],
  [T_ANS, "— Yes, we did. We took the {transport} to {city}.", "______ you ______ the {transport} to {city}?", ["Did", "take"], W3("take"), { transport: ["train", "bus", "plane", "minibus"], city: CITY }],
  [T_ANS, "— Yes, he did. Rustam forgot his {thing} at {place} yesterday.", "______ Rustam ______ his {thing} at {place} yesterday?", ["Did", "forget"], W3("forget"), { thing: ["bag", "keys", "phone", "jacket"], place: ["home", "school", "the gym", "the café"] }],
  [T_ANS, "— Yes, they did. My friends came to the {event} with {person} on Saturday.", "______ your friends ______ to the {event} with {person} on Saturday?", ["Did", "come"], W3("come"), { event: ["party", "match", "concert", "wedding"], person: ["their parents", "their cousins", "their brothers", "their coach"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a friend about last weekend. Use Did you.", "Did you", ["exactly one question", "must start with Did", "base verb after the subject"]],
  ["Ask about your friend's birthday party. Use Did.", "Did", ["exactly one question", "must use Did", "must use a past time word"]],
  ["Ask if your teacher checked the homework. Use Did … check.", "Did … check", ["exactly one question", "must use Did", "must use check"]],
  ["Ask a classmate about yesterday evening. Use Did you watch.", "Did you watch", ["exactly one question", "must use Did you watch"]],
  ["Ask about a trip last summer. Use Did … go.", "Did … go", ["exactly one question", "must use Did", "must use go (not went)"]],
  ["Write two past questions: one about you and one about your family.", "Did", ["exactly two questions", "must use Did twice"]],
  ["Ask if a friend ate breakfast this morning. Use Did.", "Did", ["exactly one question", "must use Did", "must use eat"]],
  ["Ask if your brother won his match. Use Did he.", "Did he", ["exactly one question", "must start with Did he"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Your friend came back from a holiday. Write four questions about it.", "Did questions", ["Did you", "go", "?"]],
  ["Write questions to ask a classmate about yesterday.", "Did questions", ["Did you", "yesterday"]],
  ["Write a short dialogue: you ask your mum about her day.", "Did questions", ["Did you", "Yes, I did", "No, I didn't"]],
  ["Write questions for a survey: What did people do last weekend?", "Did questions", ["Did you", "last weekend"]],
  ["Your brother had a big exam. Write three questions about it.", "Did questions", ["Did he", "pass", "?"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.yes-no.past-did.json", JSON.stringify(items, null, 1) + "\n");