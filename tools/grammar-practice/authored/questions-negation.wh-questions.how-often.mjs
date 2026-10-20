// Hand-authored: questions-negation / wh-questions / how-often (A2).
//
// Placement focus: does after How often with a singular subject (and do with
// plural / I / you, for contrast), then the base verb. Choose: 12 items pick the
// auxiliary (8 does, 4 do; distractors do/does and is/are — every item has a
// main verb, so be is never right; "did" is never offered, it can be right);
// 8 items pick the verb after does (distractors -s, -ing, past). Build: do or
// does. Transform kinds: he/she statement with a frequency → How often (5),
// you/they statement → How often (5), same question for a new subject (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.wh-questions.how-often.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "wh-questions", topic: "how-often", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DOES = "The subject is he, she or it (one person or thing), so How often takes does.";
const DO = "The subject is I, you, we, they or a plural noun, so How often takes do.";
const BASEV = "After How often does + subject, use the base verb: no -s, no -ing, no past form.";
const O_DOES = ["does", "do", "is", "are"];
const O_DO = ["do", "does", "are", "is"];
const v = (b, s, ing, past) => [b, s, ing, past];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O_DOES, DOES, "How often ______ your brother go to the {place}, {name}?", { place: ["gym", "pool", "stadium", "club"], name: NAME }],
  [O_DOES, DOES, "How often ______ Madina call her {person}, {name}?", { person: ["grandma", "aunt", "cousin", "dad"], name: NAME }],
  [O_DO, DO, "How often ______ you eat {food}, {name}?", { food: ["plov", "fish", "fast food", "fruit"], name: NAME }],
  [O_DOES, DOES, "How often ______ the {transport} come, {name}?", { transport: ["bus", "train", "metro", "minibus"], name: NAME }],
  [O_DOES, DOES, "How often ______ it rain in {city} in {season}?", { city: CITY, season: ["spring", "autumn", "winter", "April"] }],
  [O_DO, DO, "How often ______ your parents visit {city}, {name}?", { city: CITY, name: NAME }],
  [O_DOES, DOES, "How often ______ your teacher give {task}, {name}?", { task: ["tests", "homework", "quizzes", "projects"], name: NAME }],
  [O_DOES, DOES, "How often ______ Sardor play {game} with you, {name}?", { game: ["chess", "football", "tennis", "cards"], name: NAME }],
  [O_DO, DO, "How often ______ they clean the {room}, {name}?", { room: ["kitchen", "classroom", "bathroom", "yard"], name: NAME }],
  [O_DOES, DOES, "How often ______ your mum cook {food}, {name}?", { food: ["plov", "manti", "soup", "samsa"], name: NAME }],
  [O_DOES, DOES, "How often ______ your little sister watch {show}, {name}?", { show: ["cartoons", "videos", "films", "TV"], name: NAME }],
  [O_DO, DO, "How often ______ we have {subject} lessons, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [v("go", "goes", "going", "went"), BASEV, "How often does your dad ______ to {city}, {name}?", { city: CITY, name: NAME }],
  [v("play", "plays", "playing", "played"), BASEV, "How often does Bekzod ______ {sport}, {name}?", { sport: ["football", "tennis", "volleyball", "basketball"], name: NAME }],
  [v("wash", "washes", "washing", "washed"), BASEV, "How often does your brother ______ his {thing}, {name}?", { thing: ["car", "bike", "clothes", "shoes"], name: NAME }],
  [v("read", "reads", "reading", "to read"), BASEV, "How often does Shirin ______ {thing}, {name}?", { thing: ["books", "the news", "stories", "magazines"], name: NAME }],
  [v("buy", "buys", "buying", "bought"), BASEV, "How often does your family ______ {food}, {name}?", { food: ["bread", "rice", "fruit", "meat"], name: NAME }],
  [v("drink", "drinks", "drinking", "drank"), BASEV, "How often does Grandpa ______ {drink}, {name}?", { drink: ["green tea", "coffee", "milk", "water"], name: NAME }],
  [v("use", "uses", "using", "used"), BASEV, "How often does your sister ______ her {thing}, {name}?", { thing: ["laptop", "bike", "phone", "camera"], name: NAME }],
  [v("open", "opens", "opening", "opened"), BASEV, "How often does the {place} ______ late, {name}?", { place: ["library", "museum", "shop", "pool"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write do or does.";
const BUILD = [
  ["does", "How often ______ your cousin come to {city}, {name}?", { city: CITY, name: NAME }],
  ["do", "How often ______ you go to the {place}, {name}?", { place: ["cinema", "library", "bazaar", "park"], name: NAME }],
  ["does", "How often ______ Kamila practise the {instrument}, {name}?", { instrument: ["piano", "guitar", "violin", "dutar"], name: NAME }],
  ["do", "How often ______ your friends play {game}, {name}?", { game: ["football", "chess", "volleyball", "cards"], name: NAME }],
  ["does", "How often ______ the {place} close for cleaning, {name}?", { place: ["pool", "gym", "café", "museum"], name: NAME }],
  ["do", "How often ______ they have {subject} tests, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["does", "How often ______ your dad wash the {thing}, {name}?", { thing: ["car", "dishes", "windows", "carpet"], name: NAME }],
  ["do", "How often ______ we need to water the {plant}, {name}?", { plant: ["flowers", "trees", "tomatoes", "plants"], name: NAME }],
  ["does", "How often ______ it snow in {city}, {name}?", { city: CITY, name: NAME }],
  ["do", "How often ______ your grandparents visit you in {city}?", { city: CITY }],
  ["does", "How often ______ Nodir check his {thing}, {name}?", { thing: ["phone", "messages", "email", "homework"], name: NAME }],
  ["do", "How often ______ you drink {drink}, {name}?", { drink: ["coffee", "tea", "juice", "milk"], name: NAME }],
  ["does", "How often ______ your sister go {activity}, {name}?", { activity: ["shopping", "swimming", "running", "dancing"], name: NAME }],
  ["do", "How often ______ the students use {thing} in class, {name}?", { thing: ["laptops", "dictionaries", "tablets", "phones"], name: NAME }],
  ["does", "How often ______ your mum make {food}, {name}?", { food: ["plov", "cake", "soup", "samsa"], name: NAME }],
  ["do", "How often ______ your brothers watch {show}, {name}?", { show: ["football", "films", "the news", "cartoons"], name: NAME }],
  ["does", "How often ______ the {transport} go to the airport, {name}?", { transport: ["bus", "train", "minibus", "metro"], name: NAME }],
  ["do", "How often ______ you clean your {room}, {name}?", { room: ["room", "bedroom", "desk", "bathroom"], name: NAME }],
  ["does", "How often ______ Farida see her {person}, {name}?", { person: ["grandma", "cousins", "aunt", "best friend"], name: NAME }],
  ["do", "How often ______ your parents eat at a {place}, {name}?", { place: ["café", "restaurant", "friend's house", "choyxona"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "do" ? DO : DOES, slots }));

/* ---------------- transform: 15 rewrite ---------------- */
const T_Q = "Ask a How often question about this. Write one word in each gap.";
const T_NEW = (s) => `Ask the same question about "${s}". Write one word in each gap.`;
const W1 = (s, b) => `He or she takes does, then the base verb: ${s} becomes does … ${b}. The frequency is the answer, so it leaves the question.`;
const W2 = (b) => `You or they takes do, then the base verb ${b}. The frequency is the answer, so it leaves the question.`;
const TRANSFORM = [
  [T_Q, "Zarina goes to the {place} twice a week, {name}.", "How often ______ Zarina ______ to the {place}, {name}?", ["does", "go"], W1("goes", "go"), { place: ["pool", "gym", "library", "club"], name: NAME }],
  [T_Q, "My brother plays {game} every day, {name}.", "How often ______ your brother ______ {game}, {name}?", ["does", "play"], W1("plays", "play"), { game: ["chess", "football", "tennis", "volleyball"], name: NAME }],
  [T_Q, "Jasur visits his grandma in {city} once a month.", "How often ______ Jasur ______ his grandma in {city}?", ["does", "visit"], W1("visits", "visit"), { city: CITY }],
  [T_Q, "My mum buys {food} three times a week, {name}.", "How often ______ your mum ______ {food}, {name}?", ["does", "buy"], W1("buys", "buy"), { food: ["bread", "milk", "fruit", "vegetables"], name: NAME }],
  [T_Q, "The {transport} comes every ten minutes, {name}.", "How often ______ the {transport} ______, {name}?", ["does", "come"], W1("comes", "come"), { transport: ["bus", "metro", "train", "minibus"], name: NAME }],
  [T_Q, "I call my {person} every evening, {name}.", "How often ______ you ______ your {person}, {name}?", ["do", "call"], W2("call"), { person: ["mum", "grandma", "sister", "best friend"], name: NAME }],
  [T_Q, "They eat {food} once a week, {name}.", "How often ______ they ______ {food}, {name}?", ["do", "eat"], W2("eat"), { food: ["plov", "fish", "pizza", "manti"], name: NAME }],
  [T_Q, "We have {subject} four times a week, {name}.", "How often ______ you ______ {subject}, {name}?", ["do", "have"], W2("have"), { subject: ["maths", "English", "history", "science"], name: NAME }],
  [T_Q, "My friends go to the {place} every Saturday, {name}.", "How often ______ your friends ______ to the {place}, {name}?", ["do", "go"], W2("go"), { place: ["park", "cinema", "stadium", "bazaar"], name: NAME }],
  [T_Q, "I watch {show} twice a day, {name}.", "How often ______ you ______ {show}, {name}?", ["do", "watch"], W2("watch"), { show: ["the news", "videos", "cartoons", "football"], name: NAME }],
  [T_NEW("your sister"), "How often do you clean the {room}, {name}?", "How often ______ your sister ______ the {room}, {name}?", ["does", "clean"], "Your sister = she, so do becomes does. The verb stays clean.", { room: ["kitchen", "bathroom", "living room", "yard"], name: NAME }],
  [T_NEW("Akmal"), "How often do your cousins come to {city}, {name}?", "How often ______ Akmal ______ to {city}, {name}?", ["does", "come"], "Akmal = he, so do becomes does. The verb stays come.", { city: CITY, name: NAME }],
  [T_NEW("your parents"), "How often does your uncle drive to {city}, {name}?", "How often ______ your parents ______ to {city}, {name}?", ["do", "drive"], "Your parents = they, so does becomes do. The verb stays drive.", { city: CITY, name: NAME }],
  [T_NEW("you"), "How often does Lola use her {thing}, {name}?", "How often ______ you ______ your {thing}, {name}?", ["do", "use"], "With you, does becomes do. The verb stays use.", { thing: ["laptop", "bike", "camera", "tablet"], name: NAME }],
  [T_NEW("the dog"), "How often do the cats eat, {name}? Twice a day in {season}?", "How often ______ the dog ______, {name}? Twice a day in {season}?", ["does", "eat"], "The dog = it, so do becomes does. The verb stays eat.", { name: NAME, season: ["summer", "winter", "spring", "autumn"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a friend about sport. Use How often do you.", "How often do you", ["exactly one question", "must use How often do you"]],
  ["Ask about your friend's brother. Use How often does.", "How often does", ["exactly one question", "must use does", "base verb after the subject"]],
  ["Ask about a bus near your home. Use How often does.", "How often does", ["exactly one question", "must use does"]],
  ["Ask a classmate about homework. Use How often.", "How often", ["exactly one question", "must use do or does correctly"]],
  ["Write two questions: one with How often do and one with How often does.", "How often do / does", ["exactly two questions", "must use do", "must use does"]],
  ["Ask about your teacher. Use How often does … give.", "How often does … give", ["exactly one question", "must use give"]],
  ["Ask about a friend's family and food. Use How often.", "How often", ["exactly one question", "must use eat or cook"]],
  ["Ask about a shop or market. Use How often does … open.", "How often does … open", ["exactly one question", "must use open"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write a survey of four questions about free time. Use How often.", "How often + do/does", ["How often do you", "?"]],
  ["Write questions about a friend's family habits.", "How often + does", ["How often does", "your"]],
  ["Write a short dialogue with a doctor about sport and food.", "How often + do/does", ["How often do you", "every day", "twice a week"]],
  ["Write questions about public transport in your city.", "How often + does", ["How often does", "bus"]],
  ["Write questions to ask a famous sports player.", "How often + do", ["How often do you", "train"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.wh-questions.how-often.json", JSON.stringify(items, null, 1) + "\n");