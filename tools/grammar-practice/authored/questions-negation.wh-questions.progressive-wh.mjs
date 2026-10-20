// Hand-authored: questions-negation / wh-questions / progressive-wh (A1).
//
// Placement focus: What + are + you + doing. Too narrow for 20 different
// choose sentences on its own, so the topic covers the pattern it belongs to:
// wh-word + am/is/are + subject + -ing (What / Where / Who / Why), with
// "What are you doing" kept as the anchor. The wh-word itself is never tested
// (that is wh-word-choice). Choose: 12 items pick the auxiliary (distractors:
// do/does, the wrong be form), 8 pick the verb form (base, -s, past).
// Transform kinds: statement → What question (5), statement → Where/Who/Why
// question (5), same question for a new subject (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.wh-questions.progressive-wh.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "wh-questions", topic: "progressive-wh", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const ARE = "The action is happening now and the subject is you, we or they, so use are, then the -ing form.";
const IS = "The action is happening now and the subject is he, she or it, so use is, then the -ing form.";
const AM = "The action is happening now and the subject is I, so use am, then the -ing form.";
const ING = "After the question word + am/is/are + subject, use the -ing form.";
const O_ARE = ["are", "do", "is", "does"];
const O_IS = ["is", "does", "are", "do"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O_ARE, ARE, "What ______ you doing in the {place}, {name}?", { place: ["kitchen", "garden", "yard", "library"], name: NAME }],
  [O_IS, IS, "What ______ your brother doing now? The {thing} is very loud.", { thing: ["TV", "music", "radio", "phone"] }],
  [O_ARE, ARE, "Where ______ you going, {name}? It's {weather} outside.", { name: NAME, weather: ["cold", "hot", "windy", "dark"] }],
  [O_IS, IS, "Who ______ Madina talking to on the {device}, {name}?", { device: ["phone", "laptop", "tablet", "computer"], name: NAME }],
  [O_ARE, ARE, "Why ______ the children running in the {place}, {name}?", { place: ["corridor", "yard", "classroom", "hall"], name: NAME }],
  [O_IS, IS, "What ______ Dad cooking for {meal}, {name}? It smells great.", { meal: ["lunch", "dinner", "breakfast", "supper"], name: NAME }],
  [O_ARE, ARE, "What ______ your friends watching in the {room} now, {name}?", { room: ["living room", "hall", "classroom", "café"], name: NAME }],
  [O_IS, IS, "Where ______ the bus going now, {name}? Is it going to {city}?", { name: NAME, city: CITY }],
  [O_ARE, ARE, "Who ______ you waiting for at the {place}, {name}?", { place: ["station", "gate", "bus stop", "airport"], name: NAME }],
  [O_IS, IS, "Why ______ your sister crying, {name}? Is her {thing} broken?", { name: NAME, thing: ["phone", "bike", "toy", "watch"] }],
  [O_ARE, ARE, "What ______ they building in the {place} near {city}?", { place: ["village", "park", "street", "area"], city: CITY }],
  [O_IS, IS, "What ______ Grandma making in the kitchen, {name}? Is it {food}?", { name: NAME, food: ["plov", "soup", "bread", "cake"] }],
  [["doing", "do", "does", "did"], ING, "What are you ______ now, {name}? Are you at the {place}?", { name: NAME, place: ["gym", "library", "market", "park"] }],
  [["going", "go", "goes", "went"], ING, "Where is Kamron ______ this {time}, {name}?", { time: ["evening", "weekend", "afternoon", "morning"], name: NAME }],
  [["buying", "buy", "buys", "bought"], ING, "What is your mum ______ at the {place}, {name}?", { place: ["market", "shop", "bazaar", "supermarket"], name: NAME }],
  [["talking", "talk", "talks", "talked"], ING, "Who are you ______ to on the {device}, {name}?", { device: ["phone", "laptop", "tablet", "computer"], name: NAME }],
  [["running", "run", "runs", "ran"], ING, "Why are they ______ so fast, {name}? Is the {transport} here?", { name: NAME, transport: ["bus", "train", "taxi", "minibus"] }],
  [["writing", "write", "writes", "wrote"], ING, "What are the students ______ in the {place} now, {name}?", { place: ["classroom", "library", "hall", "garden"], name: NAME }],
  [["parking", "park", "parks", "parked"], ING, "Where is your dad ______ the car, {name}? Is it in the {place}?", { name: NAME, place: ["street", "yard", "garage", "car park"] }],
  [["wearing", "wear", "wears", "wore"], ING, "What is Nigora ______ for the {event}, {name}?", { event: ["party", "wedding", "concert", "trip"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const I_BE = "Write am, is or are.";
const I_ING = "Write the -ing form of the verb in brackets.";
const BUILD = [
  [I_BE, "are", ARE, "What ______ you reading, {name}? Is it a book about {topic}?", { name: NAME, topic: ["animals", "space", "history", "football"] }],
  [I_BE, "is", IS, "Where ______ your brother going with that {thing}, {name}?", { thing: ["ball", "bag", "box", "bike"], name: NAME }],
  [I_BE, "am", AM, "What ______ I doing wrong in this {task}, {name}?", { task: ["exercise", "test", "game", "task"], name: NAME }],
  [I_BE, "are", ARE, "Why ______ you laughing, {name}? Is the {show} funny?", { name: NAME, show: ["film", "video", "cartoon", "story"] }],
  [I_BE, "is", IS, "Who ______ Shahzod playing with in the {place}, {name}?", { place: ["yard", "park", "garden", "gym"], name: NAME }],
  [I_BE, "are", ARE, "What ______ your parents doing in {city} this {time}?", { city: CITY, time: ["week", "month", "summer", "weekend"] }],
  [I_BE, "is", IS, "What ______ the dog eating, {name}? Is it your {thing}?", { name: NAME, thing: ["shoe", "sandwich", "homework", "bread"] }],
  [I_BE, "are", ARE, "Where ______ we sitting at the {event}, {name}?", { event: ["concert", "wedding", "match", "film"], name: NAME }],
  [I_BE, "is", IS, "Why ______ Dilshod wearing a coat in {month}, {name}?", { month: ["June", "July", "August", "May"], name: NAME }],
  [I_BE, "are", ARE, "What ______ the girls singing at the {event}, {name}?", { event: ["party", "concert", "wedding", "lesson"], name: NAME }],
  [I_ING, "doing", ING, "What are you ______ (do) in the {place}, {name}?", { place: ["kitchen", "garage", "garden", "yard"], name: NAME }],
  [I_ING, "going", ING, "Where is Lola ______ (go) with her {person}, {name}?", { person: ["mum", "friends", "sister", "dad"], name: NAME }],
  [I_ING, "writing", ING, "Who are you ______ (write) to, {name}? Is it your {person}?", { name: NAME, person: ["teacher", "cousin", "friend", "grandma"] }],
  [I_ING, "crying", ING, "Why is the baby ______ (cry) now, {name}? Is the {thing} too loud?", { name: NAME, thing: ["TV", "music", "radio", "phone"] }],
  [I_ING, "eating", ING, "What are they ______ (eat) at the {place}, {name}?", { place: ["café", "canteen", "party", "wedding"], name: NAME }],
  [I_ING, "making", ING, "What is your sister ______ (make) for {meal}, {name}?", { meal: ["lunch", "dinner", "breakfast", "supper"], name: NAME }],
  [I_ING, "sitting", ING, "Where are you ______ (sit) on the {transport}, {name}?", { transport: ["bus", "train", "plane", "metro"], name: NAME }],
  [I_ING, "standing", ING, "Why are your friends ______ (stand) at the {place}, {name}?", { place: ["door", "gate", "window", "bus stop"], name: NAME }],
  [I_ING, "studying", ING, "What is Javohir ______ (study) at the {place}, {name}?", { place: ["university", "college", "institute", "academy"], name: NAME }],
  [I_ING, "talking", ING, "Who is Grandpa ______ (talk) to in the {place}, {name}?", { place: ["yard", "garden", "street", "shop"], name: NAME }],
].map(([instr, key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_WHAT = "Make a question with What. Write one word in each gap.";
const T_WH = "Make a question with the question word. Write one word in each gap.";
const T_NEW = "Ask the same question about the new person. Write am, is or are.";
const W2 = (be, ing) => `Put ${be} after the question word and before the subject, then use ${ing}.`;
const TRANSFORM = [
  [T_WHAT, "You are watching a film in the {room}, {name}.", "What ______ you ______ in the {room}, {name}?", ["are", "watching"], W2("are", "watching"), { room: ["living room", "bedroom", "kitchen", "hall"], name: NAME }],
  [T_WHAT, "Your brother is cooking plov in the {place}, {name}.", "What ______ your brother ______ in the {place}, {name}?", ["is", "cooking"], W2("is", "cooking"), { place: ["kitchen", "yard", "garden", "village"], name: NAME }],
  [T_WHAT, "They are building a house in {city}, {name}.", "What ______ they ______ in {city}, {name}?", ["are", "building"], W2("are", "building"), { city: CITY, name: NAME }],
  [T_WHAT, "Shirin is reading a book in the {place}, {name}.", "What ______ Shirin ______ in the {place}, {name}?", ["is", "reading"], W2("is", "reading"), { place: ["library", "garden", "park", "café"], name: NAME }],
  [T_WHAT, "The students are writing a test in {subject}, {name}.", "What ______ the students ______ in {subject}, {name}?", ["are", "writing"], W2("are", "writing"), { subject: ["maths", "English", "history", "science"], name: NAME }],
  [T_WH, "Sardor is going to the market with his {person}, {name}.", "Where ______ Sardor ______ with his {person}, {name}?", ["is", "going"], W2("is", "going"), { person: ["mum", "dad", "brother", "friends"], name: NAME }],
  [T_WH, "You are waiting for your friend at the {place}, {name}.", "Who ______ you ______ for at the {place}, {name}?", ["are", "waiting"], W2("are", "waiting"), { place: ["station", "gate", "bus stop", "airport"], name: NAME }],
  [T_WH, "Your parents are staying at a hotel in {city}, {name}.", "Where ______ your parents ______ in {city}, {name}?", ["are", "staying"], W2("are", "staying"), { city: CITY, name: NAME }],
  [T_WH, "Nodir is talking to his coach at the {place}, {name}.", "Who ______ Nodir ______ to at the {place}, {name}?", ["is", "talking"], W2("is", "talking"), { place: ["stadium", "gym", "pool", "club"], name: NAME }],
  [T_WH, "Dad is running to the {transport} because he is late, {name}.", "Why ______ Dad ______ to the {transport}, {name}?", ["is", "running"], W2("is", "running"), { transport: ["bus", "train", "metro", "taxi"], name: NAME }],
  [T_NEW, "What are you doing in the {place}, {name}?", "What ______ your sister doing in the {place}, {name}?", "is", IS, { place: ["garden", "garage", "kitchen", "yard"], name: NAME }],
  [T_NEW, "Where is your friend going this {time}, {name}?", "Where ______ your friends going this {time}, {name}?", "are", "Friends is plural (they), so use are.", { time: ["evening", "weekend", "afternoon", "summer"], name: NAME }],
  [T_NEW, "Who is Bekzod meeting at the {place}, {name}?", "Who ______ you meeting at the {place}, {name}?", "are", "The subject is you, so use are.", { place: ["station", "café", "airport", "gate"], name: NAME }],
  [T_NEW, "Why are they wearing coats in {month}, {name}?", "Why ______ Zafar wearing a coat in {month}, {name}?", "is", IS, { month: ["June", "July", "August", "May"], name: NAME }],
  [T_NEW, "What is she cooking for {meal}, {name}?", "What ______ your grandparents cooking for {meal}, {name}?", "are", "Grandparents is plural (they), so use are.", { meal: ["lunch", "dinner", "breakfast", "supper"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your friend is on the phone. Ask what they are doing now.", "What are you doing", ["exactly one question", "must use What are you doing"]],
  ["Ask where your brother is going.", "Where is … -ing", ["exactly one question", "must start with Where", "must use -ing"]],
  ["Ask who your sister is talking to.", "Who is … -ing", ["exactly one question", "must start with Who", "must use -ing"]],
  ["Ask why the children are laughing.", "Why are … -ing", ["exactly one question", "must start with Why", "must use -ing"]],
  ["Ask what your mum is cooking.", "What is … -ing", ["exactly one question", "must start with What", "must use -ing"]],
  ["Ask what your friends are watching.", "What are … -ing", ["exactly one question", "must start with What", "must use are"]],
  ["Write two questions about people in a park now: one with is and one with are.", "wh + is/are + -ing", ["exactly two questions", "must use is", "must use are"]],
  ["Ask where you are sitting at a concert. Use am I.", "Where am I … -ing", ["exactly one question", "must use am", "must use -ing"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You call a friend. Write four questions about what they are doing now.", "wh + am/is/are + -ing", ["What are you doing", "Where", "-ing"]],
  ["You hear a noise in the next room. Write questions to ask your family.", "wh + am/is/are + -ing", ["What is", "Who is", "Why"]],
  ["Write a short phone dialogue with your mum. She is at the market.", "wh + am/is/are + -ing", ["What are you buying", "Where", "now"]],
  ["Look at a busy street. Write three or four questions about the people.", "wh + am/is/are + -ing", ["Where is", "What are", "-ing"]],
  ["Your friend is at a wedding. Write questions about it.", "wh + am/is/are + -ing", ["What are they", "Who is", "wearing"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.wh-questions.progressive-wh.json", JSON.stringify(items, null, 1) + "\n");