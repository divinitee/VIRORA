// Hand-authored: questions-negation / wh-questions / how-long-perfect (A2).
//
// Placement focus: have (has) in a How long … present perfect question:
// How long + have/has + subject + past participle. Choose: 10 items pick the
// auxiliary (distractors did / do / are / is: every item prints a past
// participle, so "How long did you lived" is wrong, not a second answer);
// 10 items pick the participle (distractors base, -ing, -s; the past form is
// never offered because for regular verbs it is the same word). Build: have/has
// + participle from the cue. Transform kinds: you/they statement with for →
// How long question (5), he/she statement → How long … has (5), past simple
// "When did you start …?" → How long … present perfect (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.wh-questions.how-long-perfect.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "wh-questions", topic: "how-long-perfect", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const HAVE = "How long asks about time up to now, so use the present perfect: How long + have + I/you/we/they + past participle.";
const HAS = "How long asks about time up to now, so use the present perfect: How long + has + he/she/it + past participle.";
const PP = "After How long have/has + subject, use the past participle (lived, known, been), not the base verb or -ing.";
const O_HAVE = ["have", "did", "do", "are"];
const O_HAS = ["has", "have", "did", "is"];
const v = (pp, b, ing, s) => [pp, b, ing, s];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O_HAVE, HAVE, "How long ______ you lived in {city}, {name}?", { city: CITY, name: NAME }],
  [O_HAS, HAS, "How long ______ your sister worked at the {place}, {name}?", { place: ["bank", "hospital", "hotel", "airport"], name: NAME }],
  [O_HAVE, HAVE, "How long ______ you known {friend}, {name}?", { friend: ["Sardor", "Lola", "Bekzod", "Madina"], name: NAME }],
  [O_HAS, HAS, "How long ______ Kamron had his {thing}, {name}?", { thing: ["phone", "bike", "laptop", "watch"], name: NAME }],
  [O_HAVE, HAVE, "How long ______ your parents been married, {name}? Is it {num} years?", { name: NAME, num: ["twenty", "thirty", "fifteen", "twenty-five"] }],
  [O_HAS, HAS, "How long ______ it been cold in {city}, {name}?", { city: CITY, name: NAME }],
  [O_HAVE, HAVE, "How long ______ they studied {subject}, {name}?", { subject: ["English", "Korean", "German", "Chinese"], name: NAME }],
  [O_HAS, HAS, "How long ______ your dad driven a {vehicle}, {name}?", { vehicle: ["taxi", "bus", "truck", "van"], name: NAME }],
  [O_HAVE, HAVE, "How long ______ we been in this {place}, {name}? I'm tired.", { place: ["queue", "shop", "bank", "waiting room"], name: NAME }],
  [O_HAS, HAS, "How long ______ Nigora played the {instrument}, {name}?", { instrument: ["piano", "guitar", "violin", "dutar"], name: NAME }],
  [v("lived", "live", "living", "lives"), PP, "How long have your grandparents ______ in {city}, {name}?", { city: CITY, name: NAME }],
  [v("known", "know", "knowing", "knows"), PP, "How long has Shahzod ______ your {person}, {name}?", { person: ["brother", "sister", "cousin", "teacher"], name: NAME }],
  [v("been", "be", "being", "is"), PP, "How long have you ______ a {role}, {name}?", { role: ["student here", "teacher", "doctor", "driver"], name: NAME }],
  [v("worked", "work", "working", "works"), PP, "How long has your mum ______ at the {place}, {name}?", { place: ["school", "hospital", "bank", "post office"], name: NAME }],
  [v("had", "have", "having", "has"), PP, "How long have you ______ your {pet}, {name}?", { pet: ["dog", "cat", "parrot", "rabbit"], name: NAME }],
  [v("studied", "study", "studying", "studies"), PP, "How long has Feruza ______ {subject}, {name}?", { subject: ["English", "Korean", "German", "French"], name: NAME }],
  [v("played", "play", "playing", "plays"), PP, "How long have your brothers ______ {sport}, {name}?", { sport: ["football", "tennis", "volleyball", "basketball"], name: NAME }],
  [v("worn", "wear", "wearing", "wears"), PP, "How long has Bobur ______ {thing}, {name}?", { thing: ["glasses", "a brace", "contact lenses", "a uniform"], name: NAME }],
  [v("taught", "teach", "teaching", "teaches"), PP, "How long has Mr Karimov ______ {subject} here, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [v("waited", "wait", "waiting", "waits"), PP, "How long have you ______ for the {transport}, {name}?", { transport: ["bus", "train", "taxi", "minibus"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write have or has in the first gap and the past participle of the verb in brackets in the second.";
const BUILD = [
  ["have", "lived", "live", "How long ______ you ______ (live) in this {home}, {name}?", { home: ["flat", "house", "street", "town"], name: NAME }],
  ["has", "worked", "work", "How long ______ your uncle ______ (work) in {city}, {name}?", { city: CITY, name: NAME }],
  ["have", "known", "know", "How long ______ you ______ (know) your best friend, {name}? Since {school}?", { name: NAME, school: ["school", "college", "childhood", "kindergarten"] }],
  ["has", "had", "have", "How long ______ Jasur ______ (have) that {thing}, {name}?", { thing: ["bike", "phone", "car", "jacket"], name: NAME }],
  ["have", "been", "be", "How long ______ your parents ______ (be) in {city}, {name}?", { city: CITY, name: NAME }],
  ["has", "studied", "study", "How long ______ Madina ______ (study) {subject}, {name}?", { subject: ["English", "Korean", "German", "Chinese"], name: NAME }],
  ["have", "played", "play", "How long ______ you ______ (play) the {instrument}, {name}?", { instrument: ["piano", "guitar", "violin", "drums"], name: NAME }],
  ["has", "been", "be", "How long ______ it ______ (be) so hot in {city}, {name}?", { city: CITY, name: NAME }],
  ["have", "waited", "wait", "How long ______ they ______ (wait) at the {place}, {name}?", { place: ["bus stop", "station", "airport", "gate"], name: NAME }],
  ["has", "taught", "teach", "How long ______ your mum ______ (teach) at this {place}, {name}?", { place: ["school", "college", "university", "centre"], name: NAME }],
  ["have", "had", "have", "How long ______ you ______ (have) a {pet}, {name}?", { pet: ["dog", "cat", "parrot", "rabbit"], name: NAME }],
  ["has", "known", "know", "How long ______ Dilshod ______ (know) {friend}, {name}?", { friend: ["Lola", "Sardor", "Kamila", "Bekzod"], name: NAME }],
  ["have", "worked", "work", "How long ______ your cousins ______ (work) at the {place}, {name}?", { place: ["market", "café", "hotel", "factory"], name: NAME }],
  ["has", "lived", "live", "How long ______ Grandpa ______ (live) in the {place}, {name}?", { place: ["village", "mountains", "old house", "countryside"], name: NAME }],
  ["have", "been", "be", "How long ______ you ______ (be) in this {group}, {name}?", { group: ["class", "team", "club", "choir"], name: NAME }],
  ["has", "played", "play", "How long ______ Akmal ______ (play) for the {team}, {name}?", { team: ["school team", "city team", "club", "college team"], name: NAME }],
  ["have", "studied", "study", "How long ______ we ______ (study) in this {room}, {name}? It feels like hours.", { room: ["library", "classroom", "room", "hall"], name: NAME }],
  ["has", "driven", "drive", "How long ______ your sister ______ (drive) a car, {name}? Since {month}?", { name: NAME, month: ["June", "March", "October", "January"] }],
  ["have", "worn", "wear", "How long ______ you ______ (wear) {thing}, {name}?", { thing: ["glasses", "contact lenses", "a brace", "that watch"], name: NAME }],
  ["has", "sung", "sing", "How long ______ Zarina ______ (sing) in the {group}, {name}?", { group: ["choir", "band", "school group", "music club"], name: NAME }],
].map(([aux, pp, b, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: [aux, pp], why: `${aux === "have" ? HAVE : HAS} The past participle of ${b} is ${pp}.`, slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_Q = "Ask a How long question about this. Write one word in each gap.";
const T_PP = "Ask the question with How long and the present perfect. Write one word in each gap.";
const W1 = (pp) => `Use How long + have + you/they + ${pp}. The for-phrase is the answer, so it leaves the question.`;
const W2 = (pp) => `He or she takes has: How long + has + subject + ${pp}.`;
const W3 = (b, pp) => `How long asks about the whole time up to now, so did … ${b} becomes have … ${pp}.`;
const TRANSFORM = [
  [T_Q, "I have lived in {city} for ten years, {name}.", "How long ______ you ______ in {city}, {name}?", ["have", "lived"], W1("lived"), { city: CITY, name: NAME }],
  [T_Q, "They have known Sardor for {num} years, {name}.", "How long ______ they ______ Sardor, {name}?", ["have", "known"], W1("known"), { num: ["two", "three", "five", "six"], name: NAME }],
  [T_Q, "We have been at the {place} for an hour, {name}.", "How long ______ you ______ at the {place}, {name}?", ["have", "been"], W1("been"), { place: ["station", "airport", "hospital", "market"], name: NAME }],
  [T_Q, "I have had this {thing} for a year, {name}.", "How long ______ you ______ this {thing}, {name}?", ["have", "had"], W1("had"), { thing: ["phone", "bag", "bike", "laptop"], name: NAME }],
  [T_Q, "My friends have played {sport} for {num} years.", "How long ______ your friends ______ {sport}?", ["have", "played"], W1("played"), { sport: ["football", "tennis", "chess", "volleyball"], num: ["two", "three", "four", "five"] }],
  [T_Q, "My brother has worked at the {place} for six months, {name}.", "How long ______ your brother ______ at the {place}, {name}?", ["has", "worked"], W2("worked"), { place: ["bank", "hotel", "airport", "factory"], name: NAME }],
  [T_Q, "Lola has studied {subject} for two years, {name}.", "How long ______ Lola ______ {subject}, {name}?", ["has", "studied"], W2("studied"), { subject: ["English", "Korean", "German", "Turkish"], name: NAME }],
  [T_Q, "Our teacher has taught {subject} for twenty years.", "How long ______ your teacher ______ {subject}?", ["has", "taught"], W2("taught"), { subject: ["maths", "English", "history", "science"] }],
  [T_Q, "It has been {weather} for a week in {city}.", "How long ______ it ______ {weather} in {city}?", ["has", "been"], W2("been"), { weather: ["cold", "hot", "windy", "rainy"], city: CITY }],
  [T_Q, "Grandma has had her {pet} for five years, {name}.", "How long ______ Grandma ______ her {pet}, {name}?", ["has", "had"], W2("had"), { pet: ["cat", "dog", "parrot", "chickens"], name: NAME }],
  [T_PP, "When did you start studying {subject}, {name}?", "How long ______ you ______ {subject}, {name}?", ["have", "studied"], W3("start studying", "studied"), { subject: ["English", "Korean", "German", "Turkish"], name: NAME }],
  [T_PP, "When did your parents move to {city}, {name}?", "How long ______ your parents ______ in {city}, {name}?", ["have", "lived"], W3("move", "lived"), { city: CITY, name: NAME }],
  [T_PP, "When did Kamila start working at the {place}, {name}?", "How long ______ Kamila ______ at the {place}, {name}?", ["has", "worked"], W3("start working", "worked"), { place: ["bank", "café", "school", "shop"], name: NAME }],
  [T_PP, "When did you meet {friend}, {name}?", "How long ______ you ______ {friend}, {name}?", ["have", "known"], W3("meet", "known"), { friend: ["Bekzod", "Olga", "Sardor", "Madina"], name: NAME }],
  [T_PP, "When did your brother buy his {vehicle}, {name}?", "How long ______ your brother ______ his {vehicle}, {name}?", ["has", "had"], W3("buy", "had"), { vehicle: ["car", "bike", "scooter", "motorbike"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a new friend about their home town. Use How long have you lived.", "How long have you lived", ["exactly one question", "must use How long have you lived"]],
  ["Ask about your friend's phone. Use How long have you had.", "How long have you had", ["exactly one question", "must use had"]],
  ["Ask about a teacher at your school. Use How long has.", "How long has", ["exactly one question", "must use has + past participle"]],
  ["Ask a classmate about learning English. Use How long.", "How long have you", ["exactly one question", "must use the present perfect"]],
  ["Ask about two people in your family: one question with have, one with has.", "How long have / has", ["exactly two questions", "must use have", "must use has"]],
  ["Ask a person in a queue. Use How long have you been.", "How long have you been", ["exactly one question", "must use been"]],
  ["Ask about a friend and their pet. Use How long has … had.", "How long has … had", ["exactly one question", "must use has", "must use had"]],
  ["Ask about a sport your friend plays. Use How long … played.", "How long … played", ["exactly one question", "must use played"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write four questions for a new student in your class. Use How long.", "How long + present perfect", ["How long have you", "?"]],
  ["Interview a grandparent: write questions about their life. Use How long.", "How long + present perfect", ["How long have you", "lived", "known"]],
  ["Write a short dialogue with a new neighbour.", "How long + present perfect", ["How long have you", "For", "Since"]],
  ["Write questions about a friend's hobby. Use How long.", "How long + present perfect", ["How long has", "played"]],
  ["Write questions for a job interview at a café.", "How long + present perfect", ["How long have you", "worked"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.wh-questions.how-long-perfect.json", JSON.stringify(items, null, 1) + "\n");