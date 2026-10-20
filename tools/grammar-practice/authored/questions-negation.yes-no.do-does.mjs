// Hand-authored: questions-negation / yes-no / do-does (A1).
//
// Tests the three placement foci: Do with I/you/we/they, Does with he/she/it,
// and the order auxiliary + subject + BASE verb (Does he play…?, never plays).
// Choose: 12 items pick the auxiliary (distractors: the other one, Is/Are —
// the be-for-do transfer error), 8 items pick the verb after Does (distractors:
// -s, -ing, past). "Did" and "Doesn't" are never offered: both can be right.
// Build: Do or Does only (no bracket cue: the base verb would be the answer).
// Transform kinds: you/they statement → question (5), he/she statement →
// question with base verb (5), same question for a new subject (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.yes-no.do-does.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "yes-no", topic: "do-does", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DAY = ["Monday", "Tuesday", "Friday", "Saturday"];
const DO = "The subject is I, you, we or they, so the question starts with Do.";
const DOES = "The subject is he, she or it (one person or thing), so the question starts with Does.";
const BASEV = "After Does, use the base verb: no -s, no -ing, no past form.";
const O_DO = ["Do", "Does", "Are", "Is"];
const O_DOES = ["Does", "Do", "Is", "Are"];
const v = (b, s, ing, past) => [b, s, ing, past];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O_DO, DO, "______ you get up early on {day}, {name}?", { day: DAY, name: NAME }],
  [O_DOES, DOES, "______ your mum cook {food} on {day}?", { food: ["plov", "soup", "manti", "pancakes"], day: ["Sunday", "Friday", "Saturday", "Wednesday"] }],
  [O_DO, DO, "______ you go to the {place} by bus, {name}?", { place: ["college", "gym", "market", "library"], name: NAME }],
  [O_DOES, DOES, "______ Akmal study {subject} at {place}?", { subject: ["maths", "English", "history", "science"], place: ["school", "college", "university", "home"] }],
  [O_DO, DO, "______ your friends play {game} on {day}?", { game: ["football", "chess", "volleyball", "basketball"], day: DAY }],
  [O_DOES, DOES, "______ the {transport} go to {city}, {name}?", { transport: ["train", "bus", "minibus", "plane"], city: CITY, }],
  [O_DO, DO, "______ you and your sister share a {thing}, {name}?", { thing: ["room", "phone", "laptop", "bike"], name: NAME }],
  [O_DOES, DOES, "______ your grandpa watch the news in the {time}, {name}?", { time: ["morning", "evening", "afternoon", "kitchen"].slice(0, 3).concat(["night"]), name: NAME }],
  [O_DO, DO, "______ they sell {item} at this {shop}, {name}?", { item: ["bread", "juice", "eggs", "rice"], shop: ["shop", "kiosk", "market", "supermarket"] }],
  [O_DOES, DOES, "______ it rain a lot in {city} in {season}?", { city: CITY, season: ["spring", "autumn", "winter", "April"] }],
  [O_DO, DO, "______ your parents drink {drink} in the {time}?", { drink: ["tea", "coffee", "milk", "juice"], time: ["morning", "evening", "afternoon", "summer"] }],
  [O_DOES, DOES, "______ your cat sleep on the {place}, {name}?", { place: ["sofa", "bed", "floor", "chair"], name: NAME }],
  [v("play", "plays", "playing", "played"), BASEV, "Does your brother ______ {sport} on {day}?", { sport: ["football", "tennis", "volleyball", "basketball"], day: DAY }],
  [v("live", "lives", "living", "lived"), BASEV, "Does Dilnoza ______ in {city}, {name}?", { city: CITY, name: NAME }],
  [v("speak", "speaks", "speaking", "spoke"), BASEV, "Does your teacher ______ {lang}, {name}?", { lang: ["Russian", "Korean", "Turkish", "German"], name: NAME }],
  [v("open", "opens", "opening", "opened"), BASEV, "Does the {place} ______ at nine, {name}?", { place: ["shop", "bank", "library", "museum"], name: NAME }],
  [v("go", "goes", "going", "went"), BASEV, "Does your dad ______ to work by {transport}, {name}?", { transport: ["bus", "car", "metro", "taxi"], name: NAME }],
  [v("eat", "eats", "eating", "ate"), BASEV, "Does Bobur ______ {food} for breakfast, {name}?", { food: ["eggs", "bread", "porridge", "fruit"], name: NAME }],
  [v("sing", "sings", "singing", "sang"), BASEV, "Does your sister ______ English songs at {place}, {name}?", { place: ["home", "school", "parties", "concerts"], name: NAME }],
  [v("start", "starts", "starting", "started"), BASEV, "Does the film ______ at {hour}, {name}?", { hour: ["six", "seven", "eight", "nine"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write Do or Does.";
const BUILD = [
  ["Does", "______ your sister work at the {place}, {name}?", { place: ["bank", "hospital", "hotel", "airport"], name: NAME }],
  ["Do", "______ you need help with your {thing}, {name}?", { thing: ["bags", "homework", "project", "phone"], name: NAME }],
  ["Does", "______ Rustam sing in the school {group}, {name}?", { group: ["band", "choir", "club", "concert"], name: NAME }],
  ["Do", "______ your brothers go to the {place} on {day}?", { place: ["gym", "pool", "park", "stadium"], day: DAY }],
  ["Does", "______ the lesson start at {hour}, {name}?", { hour: ["eight", "nine", "ten", "two"], name: NAME }],
  ["Do", "______ you know the way to the {place}, {name}?", { place: ["station", "museum", "hospital", "bazaar"], name: NAME }],
  ["Does", "______ your uncle drive a {vehicle} in {city}?", { vehicle: ["taxi", "bus", "truck", "van"], city: CITY }],
  ["Do", "______ we have {subject} on {day}?", { subject: ["maths", "English", "history", "science"], day: DAY }],
  ["Does", "______ your phone take good {thing}, {name}?", { thing: ["photos", "videos", "pictures", "selfies"], name: NAME }],
  ["Do", "______ your neighbours have a {pet}, {name}?", { pet: ["dog", "cat", "parrot", "rabbit"], name: NAME }],
  ["Does", "______ Nodira like {food}, {name}?", { food: ["fish", "rice", "salad", "ice cream"], name: NAME }],
  ["Do", "______ you and Sardor walk to {place} together, {name}?", { place: ["school", "college", "work", "the park"], name: NAME }],
  ["Does", "______ it snow in {city} in {month}?", { city: CITY, month: ["January", "December", "February", "March"] }],
  ["Do", "______ your cousins visit you in the {season}, {name}?", { season: ["summer", "winter", "spring", "holidays"], name: NAME }],
  ["Does", "______ your mum make {food} for {event}?", { food: ["plov", "cakes", "samsa", "soup"], event: ["Navruz", "birthdays", "guests", "weddings"] }],
  ["Do", "______ they open the {place} at eight, {name}?", { place: ["shop", "gym", "library", "pool"], name: NAME }],
  ["Does", "______ your dog eat {food}, {name}?", { food: ["bread", "meat", "rice", "fish"], name: NAME }],
  ["Do", "______ you listen to music on the {transport}, {name}?", { transport: ["bus", "metro", "train", "plane"], name: NAME }],
  ["Does", "______ Kamila speak {lang} with her {person}?", { lang: ["Uzbek", "Russian", "English", "Korean"], person: ["friends", "mum", "teacher", "cousins"] }],
  ["Do", "______ your parents watch films on {day}, {name}?", { day: DAY, name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "Do" ? DO : DOES, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_DO = "Make a yes/no question. Write one word in each gap.";
const T_NEW = "Ask the same question about the new person. Write Do or Does.";
const W_DO = (vb) => `The subject is you or they, so use Do, then the base verb ${vb}.`;
const W_DOES = (vb) => `The subject is he or she, so use Does, and the verb goes back to ${vb} (no -s).`;
const TRANSFORM = [
  [T_DO, "You play {sport} on {day}, {name}.", "______ you ______ {sport} on {day}, {name}?", ["Do", "play"], W_DO("play"), { sport: ["football", "tennis", "chess", "volleyball"], day: DAY, name: NAME }],
  [T_DO, "They live near the {place}, {name}.", "______ they ______ near the {place}, {name}?", ["Do", "live"], W_DO("live"), { place: ["river", "park", "bazaar", "station"], name: NAME }],
  [T_DO, "Your parents work in {city}, {name}.", "______ your parents ______ in {city}, {name}?", ["Do", "work"], W_DO("work"), { city: CITY, name: NAME }],
  [T_DO, "You eat {food} for breakfast, {name}.", "______ you ______ {food} for breakfast, {name}?", ["Do", "eat"], W_DO("eat"), { food: ["eggs", "bread", "porridge", "fruit"], name: NAME }],
  [T_DO, "Your friends speak {lang} at school, {name}.", "______ your friends ______ {lang} at school, {name}?", ["Do", "speak"], W_DO("speak"), { lang: ["Uzbek", "Russian", "English", "Tajik"], name: NAME }],
  [T_DO, "Your sister goes to the {place} on {day}.", "______ your sister ______ to the {place} on {day}?", ["Does", "go"], W_DOES("go"), { place: ["gym", "pool", "library", "market"], day: DAY }],
  [T_DO, "Bobur watches {thing} in the {time}, {name}.", "______ Bobur ______ {thing} in the {time}, {name}?", ["Does", "watch"], W_DOES("watch"), { thing: ["football", "films", "cartoons", "the news"], time: ["evening", "morning", "afternoon", "summer"] }],
  [T_DO, "Your grandma has a {thing} in {city}.", "______ your grandma ______ a {thing} in {city}?", ["Does", "have"], "The subject is she, so use Does, and has goes back to have.", { thing: ["garden", "flat", "house", "shop"], city: CITY }],
  [T_DO, "The bus stops near the {place}, {name}.", "______ the bus ______ near the {place}, {name}?", ["Does", "stop"], "The subject is it (the bus), so use Does, and the verb goes back to stop.", { place: ["school", "market", "park", "hospital"], name: NAME }],
  [T_DO, "Your teacher gives tests on {day}, {name}.", "______ your teacher ______ tests on {day}, {name}?", ["Does", "give"], W_DOES("give"), { day: DAY, name: NAME }],
  [T_NEW, "Do you like {food}, {name}?", "______ your brother like {food}, {name}?", "Does", DOES, { food: ["plov", "fish", "pizza", "soup"], name: NAME }],
  [T_NEW, "Does your sister study {subject} on {day}?", "______ your sisters study {subject} on {day}?", "Do", "Sisters is plural (they), so use Do.", { subject: ["maths", "English", "history", "science"], day: DAY }],
  [T_NEW, "Do they drink {drink} in the {time}?", "______ Grandpa drink {drink} in the {time}?", "Does", DOES, { drink: ["tea", "coffee", "milk", "juice"], time: ["morning", "evening", "afternoon", "summer"] }],
  [T_NEW, "Does Jamshid walk to the {place}, {name}?", "______ Jamshid and his friends walk to the {place}, {name}?", "Do", "Jamshid and his friends means they, so use Do.", { place: ["park", "market", "station", "stadium"], name: NAME }],
  [T_NEW, "Do your parents cook {food} on {day}?", "______ your mum cook {food} on {day}?", "Does", DOES, { food: ["plov", "soup", "manti", "pancakes"], day: ["Sunday", "Friday", "Saturday", "Wednesday"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a friend about their morning. Use Do you.", "Do you", ["exactly one question", "must start with Do"]],
  ["Ask about your friend's brother and his sport. Use Does he.", "Does he", ["exactly one question", "must start with Does", "base verb after he"]],
  ["Ask if a shop opens on Sunday. Use Does.", "Does", ["exactly one question", "must use Does", "must use open"]],
  ["Ask two friends about their weekend. Use Do you.", "Do you", ["exactly one question", "must start with Do"]],
  ["Ask about your teacher. Use Does … speak.", "Does … speak", ["exactly one question", "must use Does", "must use speak"]],
  ["Ask if your classmates live near the school. Use Do they.", "Do they", ["exactly one question", "must start with Do"]],
  ["Write two questions: one with Do and one with Does.", "Do / Does", ["exactly two questions", "must use Do", "must use Does"]],
  ["Ask if the bus goes to the city centre. Use Does.", "Does", ["exactly one question", "must use Does", "must use go"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write four questions for a new classmate about their daily life.", "Do / Does questions", ["Do you", "?", "every day"]],
  ["You want to know about your friend's family. Write three or four questions.", "Do / Does questions", ["Does your", "Do your", "live"]],
  ["Write questions for a survey about free time.", "Do / Does questions", ["Do you", "play", "watch"]],
  ["Write a short dialogue: you ask a friend about their brother's job.", "Do / Does questions", ["Does he", "work", "Yes, he does"]],
  ["Write questions to ask a new teacher.", "Do / Does questions", ["Do you", "speak", "live"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.yes-no.do-does.json", JSON.stringify(items, null, 1) + "\n");