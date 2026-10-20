// Hand-authored: questions-negation / subject-questions / who-subject (A2).
//
// Placement focus: subject question, no "did", verb in past form. Choose: Who
// + past verb; distractors did + past (double past), base verb (no past mark)
// and -ing with no auxiliary. "did + base" is never offered (emphatic "Who
// DID break it?" is possible). Build: past form from the cue. Transform kinds:
// statement → Who question about the subject (5), present → past (5),
// correct a "did + past" question (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.subject-questions.who-subject.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "subject-questions", topic: "who-subject", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const WHY = (p) => `Who is the subject here, so don't use did. Use the past form: Who ${p} …?`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["called", "call", "calling", "Who ______ you last night, {name}? Was it {person}?", { person: ["your mum", "Sardor", "your cousin", "the teacher"], name: NAME }],
  ["broke", "break", "breaking", "Who ______ the {thing} in the kitchen, {name}?", { thing: ["cup", "plate", "glass", "window"], name: NAME }],
  ["won", "win", "winning", "Who ______ the {game} yesterday, {name}?", { game: ["chess game", "football match", "race", "quiz"], name: NAME }],
  ["made", "make", "making", "Who ______ this {food}, {name}? It's delicious.", { food: ["plov", "soup", "cake", "salad"], name: NAME }],
  ["took", "take", "taking", "Who ______ my {thing} from the desk, {name}?", { thing: ["pen", "phone", "book", "ruler"], name: NAME }],
  ["opened", "open", "opening", "Who ______ the {thing}, {name}? It's cold in here.", { thing: ["window", "door", "balcony door", "back door"], name: NAME }],
  ["wrote", "write", "writing", "Who ______ this {text}, {name}?", { text: ["message", "note", "poem", "letter"], name: NAME }],
  ["told", "tell", "telling", "Who ______ you about the {news}, {name}?", { news: ["party", "test", "trip", "new teacher"], name: NAME }],
  ["ate", "eat", "eating", "Who ______ the last {food}, {name}?", { food: ["apple", "banana", "sandwich", "samsa"], name: NAME }],
  ["paid", "pay", "paying", "Who ______ for the {thing}, {name}?", { thing: ["taxi", "tickets", "pizza", "dinner"], name: NAME }],
  ["cleaned", "clean", "cleaning", "Who ______ the {room} this morning, {name}?", { room: ["kitchen", "classroom", "bathroom", "yard"], name: NAME }],
  ["found", "find", "finding", "Who ______ your {thing} on the {place}?", { thing: ["keys", "phone", "wallet", "bag"], place: ["bus", "stairs", "floor", "bench"] }],
  ["sent", "send", "sending", "Who ______ you these {thing}, {name}?", { thing: ["flowers", "photos", "sweets", "books"], name: NAME }],
  ["helped", "help", "helping", "Who ______ you with your {subject} homework, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["drove", "drive", "driving", "Who ______ you to the {place} today, {name}?", { place: ["airport", "station", "hospital", "bazaar"], name: NAME }],
  ["bought", "buy", "buying", "Who ______ the {food} for the party, {name}?", { food: ["cake", "juice", "fruit", "bread"], name: NAME }],
  ["saw", "see", "seeing", "Who ______ my brother at the {place}, {name}?", { place: ["bazaar", "park", "station", "gym"], name: NAME }],
  ["left", "leave", "leaving", "Who ______ this {thing} on the bus, {name}?", { thing: ["umbrella", "jacket", "bag", "scarf"], name: NAME }],
  ["taught", "teach", "teaching", "Who ______ you {skill}, {name}?", { skill: ["chess", "to swim", "to cook", "English"], name: NAME }],
  ["brought", "bring", "bringing", "Who ______ these {food} to class, {name}?", { food: ["sweets", "apples", "cakes", "biscuits"], name: NAME }],
].map(([p, b, ing, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: [p, `did ${p}`, b, ing], key: 0, why: WHY(p), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the past form of the verb in brackets. Who is the subject, so don't use did.";
const BUILD = [
  ["sang", "Who ______ (sing) at the {event}, {name}?", { event: ["wedding", "concert", "party", "school show"], name: NAME }],
  ["gave", "Who ______ (give) you this {thing}, {name}?", { thing: ["book", "watch", "bag", "scarf"], name: NAME }],
  ["cooked", "Who ______ (cook) dinner on {day}, {name}?", { day: ["Monday", "Friday", "Saturday", "Sunday"], name: NAME }],
  ["lost", "Who ______ (lose) the {thing}, {name}?", { thing: ["key", "ticket", "ball", "map"], name: NAME }],
  ["drew", "Who ______ (draw) this {picture}, {name}?", { picture: ["picture", "map", "cat", "house"], name: NAME }],
  ["came", "Who ______ (come) to the {event} late, {name}?", { event: ["lesson", "meeting", "party", "match"], name: NAME }],
  ["washed", "Who ______ (wash) the {thing}, {name}?", { thing: ["dishes", "car", "cups", "floor"], name: NAME }],
  ["chose", "Who ______ (choose) this {thing}, {name}?", { thing: ["song", "film", "game", "restaurant"], name: NAME }],
  ["fixed", "Who ______ (fix) your {thing}, {name}?", { thing: ["bike", "phone", "laptop", "door"], name: NAME }],
  ["finished", "Who ______ (finish) the {task} first, {name}?", { task: ["test", "exercise", "book", "race"], name: NAME }],
  ["drank", "Who ______ (drink) my {drink}, {name}?", { drink: ["juice", "tea", "milk", "water"], name: NAME }],
  ["answered", "Who ______ (answer) the {q} correctly, {name}?", { q: ["first question", "last question", "hard question", "bonus question"], name: NAME }],
  ["met", "Who ______ (meet) you at the {place}, {name}?", { place: ["station", "airport", "bus stop", "gate"], name: NAME }],
  ["invited", "Who ______ (invite) you to the {event}, {name}?", { event: ["party", "wedding", "concert", "picnic"], name: NAME }],
  ["sat", "Who ______ (sit) next to you in {subject}, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["rang", "Who ______ (ring) the bell at {hour}, {name}?", { hour: ["eight", "nine", "ten", "noon"], name: NAME }],
  ["carried", "Who ______ (carry) your {thing} upstairs, {name}?", { thing: ["bags", "suitcase", "boxes", "books"], name: NAME }],
  ["lent", "Who ______ (lend) you this {thing}, {name}?", { thing: ["pen", "bike", "book", "jacket"], name: NAME }],
  ["built", "Who ______ (build) this {thing}, {name}?", { thing: ["house", "bridge", "wall", "school"], name: NAME }],
  ["woke", "Who ______ (wake) you up this morning, {name}? Was it {person}?", { person: ["your mum", "your dad", "your brother", "the alarm"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY(key), slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_ASK = "Ask a Who question about the person who did the action. Write one word in the gap.";
const T_PAST = "Change the question to the past. Write one word in the gap.";
const T_FIX = "Correct the question. Write one word in the gap.";
const TRANSFORM = [
  [T_ASK, "{name} broke the {thing}.", "Who ______ the {thing}?", "broke", { name: NAME, thing: ["cup", "plate", "window", "vase"] }],
  [T_ASK, "My cousin won the {game}, {name}.", "Who ______ the {game}, {name}?", "won", { game: ["race", "chess game", "quiz", "match"], name: NAME }],
  [T_ASK, "Malika made the {food} for us, {name}.", "Who ______ the {food} for you, {name}?", "made", { food: ["plov", "soup", "cake", "salad"], name: NAME }],
  [T_ASK, "Sardor found my {thing} on the {place}.", "Who ______ your {thing} on the {place}?", "found", { thing: ["keys", "wallet", "phone", "ticket"], place: ["bus", "stairs", "floor", "bench"] }],
  [T_ASK, "Grandpa told us a {story} last night, {name}.", "Who ______ you a {story} last night, {name}?", "told", { story: ["story", "joke", "fairy tale", "funny story"], name: NAME }],
  [T_PAST, "Who washes the dishes after {meal}, {name}?", "Who ______ the dishes after {meal} yesterday, {name}?", "washed", { meal: ["lunch", "dinner", "breakfast", "the party"], name: NAME }],
  [T_PAST, "Who drives you to {place} every day, {name}?", "Who ______ you to {place} this morning, {name}?", "drove", { place: ["school", "college", "work", "the gym"], name: NAME }],
  [T_PAST, "Who teaches {subject} at your school, {name}?", "Who ______ {subject} at your school last year, {name}?", "taught", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [T_PAST, "Who brings the {food} every Friday, {name}?", "Who ______ the {food} last Friday, {name}?", "brought", { food: ["bread", "fruit", "sweets", "tea"], name: NAME }],
  [T_PAST, "Who usually pays for the {thing}, {name}?", "Who ______ for the {thing} last time, {name}?", "paid", { thing: ["taxi", "lunch", "tickets", "pizza"], name: NAME }],
  [T_FIX, "Who did called your {person} this morning, {name}?", "Who ______ your {person} this morning, {name}?", "called", { person: ["mum", "dad", "sister", "brother"], name: NAME }],
  [T_FIX, "Who did ate my {food}, {name}?", "Who ______ my {food}, {name}?", "ate", { food: ["sandwich", "apple", "samsa", "banana"], name: NAME }],
  [T_FIX, "Who did wrote on the {thing}, {name}?", "Who ______ on the {thing}, {name}?", "wrote", { thing: ["board", "wall", "desk", "door"], name: NAME }],
  [T_FIX, "Who did took my {thing}, {name}?", "Who ______ my {thing}, {name}?", "took", { thing: ["pen", "chair", "notebook", "seat"], name: NAME }],
  [T_FIX, "Who did gave you the {thing}, {name}?", "Who ______ you the {thing}, {name}?", "gave", { thing: ["money", "tickets", "flowers", "keys"], name: NAME }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY(key), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask who called you yesterday. Use Who called …?", "Who called", ["exactly one question", "no did"]],
  ["Ask who made a meal in your family. Use Who made …?", "Who made", ["exactly one question", "no did"]],
  ["Ask who won a game or match. Use Who won …?", "Who won", ["exactly one question", "past form, no did"]],
  ["Ask who broke something at home.", "Who broke", ["exactly one question", "must use broke", "no did"]],
  ["Ask who helped a friend with homework.", "Who helped", ["exactly one question", "no did"]],
  ["Ask who took a photo. Use Who took …?", "Who took", ["exactly one question", "no did"]],
  ["Ask two Who questions about last weekend.", "Who + past verb", ["exactly two questions", "past form in both", "no did"]],
  ["Ask who taught your friend a skill.", "Who taught", ["exactly one question", "no did"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Something happened in your class today. Write three Who questions about it.", "Who + past verb", ["Who", "no did"]],
  ["Write three Who questions about a family party.", "Who + past verb", ["Who made", "Who brought"]],
  ["Write Who questions about a football match, and answer them.", "Who + past verb", ["Who won", "Who scored"]],
  ["Your room is a mess. Ask your family three Who questions.", "Who + past verb", ["Who took", "Who left"]],
  ["Write three Who questions about a trip you took.", "Who + past verb", ["Who drove", "Who paid"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.subject-questions.who-subject.json", JSON.stringify(items, null, 1) + "\n");