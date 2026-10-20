// Hand-authored: questions-negation / yes-no / be-vs-do (A1).
//
// Tests ONE point (placement foci): a question with be and no main verb starts
// with Is/Are (no do); a question with a main verb starts with Do/Does —
// including have, which is a main verb here (Does she have…?).
// Distractors are the other family (Is/Are vs Do/Does) and the wrong number.
// "Has your sister a bike?" is never offered (old British, defensible).
// Transform kinds: be statement → question (5), do/does statement → question
// with base verb (5), same question for a new subject (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.yes-no.be-vs-do.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "yes-no", topic: "be-vs-do", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DAY = ["Monday", "Tuesday", "Friday", "Saturday"];
const IS = "There is no main verb here, only be, so the question starts with Is. Don't add do.";
const ARE = "There is no main verb here, only be, so the question starts with Are. Don't add do.";
const DOES = "There is a main verb, so use Does with he, she or it. Don't use be.";
const DOES_HAVE = "Have is the main verb here, so the question needs Does with he, she or it.";
const DO = "There is a main verb, so use Do with I, you, we or they. Don't use be.";
const O_IS = ["Is", "Does", "Are", "Do"];
const O_ARE = ["Are", "Do", "Is", "Does"];
const O_DOES = ["Does", "Is", "Do", "Are"];
const O_DO = ["Do", "Are", "Does", "Is"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O_IS, IS, "______ your brother at home, {name}? I have his {thing}.", { name: NAME, thing: ["book", "phone", "bag", "key"] }],
  [O_ARE, ARE, "______ you hungry after {activity}, {name}?", { activity: ["football", "school", "work", "the gym"], name: NAME }],
  [O_IS, IS, "______ the {place} open on {day}?", { place: ["museum", "library", "bank", "post office"], day: ["Sunday", "Monday", "Saturday", "Friday"] }],
  [O_ARE, ARE, "______ your parents from {city}, {name}?", { city: CITY, name: NAME }],
  [O_IS, IS, "______ it cold in {city} in {month}?", { city: CITY, month: ["January", "February", "December", "November"] }],
  [O_ARE, ARE, "______ the {food} ready, Mum? I'm very hungry after {activity}.", { food: ["chips", "pancakes", "samsas", "dumplings"], activity: ["school", "football", "work", "swimming"] }],
  [O_IS, IS, "______ your teacher from {country}, {name}?", { country: ["Russia", "Korea", "Turkey", "Kazakhstan"], name: NAME }],
  [O_ARE, ARE, "______ you a student at the {place}, {name}?", { place: ["college", "university", "music school", "language centre"], name: NAME }],
  [O_IS, IS, "______ the bus to {city} late again, {name}?", { city: CITY, name: NAME }],
  [O_ARE, ARE, "______ your friends in the {place} now? I can't see them, {name}.", { place: ["park", "yard", "café", "canteen"], name: NAME }],
  [O_DOES, DOES_HAVE, "______ your sister have a {thing}, {name}?", { thing: ["bike", "laptop", "camera", "phone"], name: NAME }],
  [O_DO, DO, "______ you play {sport} after school, {name}?", { sport: ["football", "tennis", "volleyball", "basketball"], name: NAME }],
  [O_DOES, DOES, "______ your dad work in {city}, {name}?", { city: CITY, name: NAME }],
  [O_DO, DO, "______ your cousins live near the {place}, {name}?", { place: ["park", "river", "market", "station"], name: NAME }],
  [O_DOES, DOES_HAVE, "______ Kamola have lessons on {day}, {name}?", { day: DAY, name: NAME }],
  [O_DO, DO, "______ you have a pen for the {event}, {name}?", { event: ["test", "exam", "lesson", "quiz"], name: NAME }],
  [O_DOES, DOES, "______ the shop sell {item}, {name}?", { item: ["bread", "milk", "eggs", "fruit"], name: NAME }],
  [O_DO, DO, "______ they speak {lang} at home, {name}?", { lang: ["Uzbek", "Russian", "English", "Tajik"], name: NAME }],
  [O_DOES, DOES_HAVE, "______ your grandma have a garden in {city}, {name}?", { city: CITY, name: NAME }],
  [O_DO, DO, "______ you like {food} for {meal}?", { food: ["plov", "soup", "eggs", "porridge"], meal: ["breakfast", "lunch", "dinner", "supper"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write Is, Are, Do or Does.";
const BUILD = [
  ["Is", IS, "______ your mum a nurse at the {place}, {name}?", { place: ["hospital", "clinic", "school", "college"], name: NAME }],
  ["Does", DOES, "______ your brother drive to {city} every {time}?", { city: CITY, time: ["week", "month", "weekend", "summer"] }],
  ["Are", ARE, "______ you ready for the {event}, {name}?", { event: ["test", "match", "trip", "concert"], name: NAME }],
  ["Do", DO, "______ you walk to the {place} every morning, {name}?", { place: ["school", "college", "gym", "bus stop"], name: NAME }],
  ["Is", IS, "______ the {thing} new, {name}? It looks nice.", { thing: ["jacket", "phone", "bike", "watch"], name: NAME }],
  ["Does", DOES_HAVE, "______ Sardor have a {thing}, {name}?", { thing: ["car", "dog", "bike", "computer"], name: NAME }],
  ["Are", ARE, "______ the shops open late in {city}, {name}?", { city: CITY, name: NAME }],
  ["Do", DO, "______ your friends go to the {place} on {day}?", { place: ["gym", "pool", "cinema", "park"], day: DAY }],
  ["Is", IS, "______ your school near the {place}, {name}?", { place: ["park", "river", "market", "station"], name: NAME }],
  ["Does", DOES, "______ the {transport} stop near your house, {name}?", { transport: ["bus", "minibus", "tram", "taxi"], name: NAME }],
  ["Are", ARE, "______ your grandparents in {city} this week, {name}?", { city: CITY, name: NAME }],
  ["Do", DO, "______ your parents speak {lang}, {name}?", { lang: ["Uzbek", "Russian", "English", "Korean"], name: NAME }],
  ["Is", IS, "______ it hot in {city} in {month}?", { city: CITY, month: ["June", "July", "August", "May"] }],
  ["Does", DOES, "______ your teacher give a lot of homework in {subject}, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["Are", ARE, "______ these {thing} yours, {name}?", { thing: ["keys", "books", "shoes", "pens"], name: NAME }],
  ["Do", DO, "______ you eat {food} at home, {name}?", { food: ["plov", "manti", "samsa", "lagman"], name: NAME }],
  ["Is", IS, "______ this seat free, {name}? My {person} wants to sit down.", { name: NAME, person: ["grandma", "friend", "mum", "sister"] }],
  ["Does", DOES, "______ Lola play the {instr} at the {place}?", { instr: ["piano", "guitar", "violin", "drums"], place: ["music school", "concert", "party", "club"] }],
  ["Are", ARE, "______ we late for the {event}, {name}?", { event: ["lesson", "film", "bus", "train"], name: NAME }],
  ["Does", DOES_HAVE, "______ your phone have a good {part}, {name}?", { part: ["camera", "battery", "screen", "speaker"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_BE = "Make a yes/no question.";
const T_DO = "Make a yes/no question. Write one word in each gap.";
const T_NEW = "Ask the same question about the new person. Write Is, Are, Do or Does.";
const TRANSFORM = [
  [T_BE, "Your brother is at the {place}, {name}.", "______ your brother at the {place}, {name}?", "Is", IS, { place: ["gym", "library", "market", "bank"], name: NAME }],
  [T_BE, "Your friends are in {city} this {time}.", "______ your friends in {city} this {time}?", "Are", ARE, { city: CITY, time: ["week", "month", "summer", "weekend"] }],
  [T_BE, "The {place} is far from here, {name}.", "______ the {place} far from here, {name}?", "Is", IS, { place: ["station", "airport", "hospital", "stadium"], name: NAME }],
  [T_BE, "You are tired after {activity}, {name}.", "______ you tired after {activity}, {name}?", "Are", ARE, { activity: ["football", "school", "work", "the gym"], name: NAME }],
  [T_BE, "It is cold in {city} today, {name}.", "______ it cold in {city} today, {name}?", "Is", IS, { city: CITY, name: NAME }],
  [T_DO, "Your sister plays {sport} on {day}.", "______ your sister ______ {sport} on {day}?", ["Does", "play"], "Plays is a main verb, so use Does with she, and the verb goes back to play.", { sport: ["tennis", "volleyball", "basketball", "football"], day: DAY }],
  [T_DO, "You live near the {place}, {name}.", "______ you ______ near the {place}, {name}?", ["Do", "live"], "Live is a main verb, so use Do with you, then the base verb live.", { place: ["park", "river", "bazaar", "station"], name: NAME }],
  [T_DO, "Your dad has a {thing}, {name}.", "______ your dad ______ a {thing}, {name}?", ["Does", "have"], "Has is a main verb here, so use Does with he, and has goes back to have.", { thing: ["car", "bike", "laptop", "camera"], name: NAME }],
  [T_DO, "Your cousins work in {city}, {name}.", "______ your cousins ______ in {city}, {name}?", ["Do", "work"], "Work is a main verb, so use Do with they, then the base verb work.", { city: CITY, name: NAME }],
  [T_DO, "Malika speaks {lang} at {place}.", "______ Malika ______ {lang} at {place}?", ["Does", "speak"], "Speaks is a main verb, so use Does with she, and the verb goes back to speak.", { lang: ["Uzbek", "Russian", "English", "Korean"], place: ["home", "school", "work", "college"] }],
  [T_NEW, "Is your friend at the {place}, {name}?", "______ your friends at the {place}, {name}?", "Are", "Friends is plural and there is no main verb, so use Are.", { place: ["park", "cinema", "café", "stadium"], name: NAME }],
  [T_NEW, "Do your brothers have a {thing}, {name}?", "______ your brother have a {thing}, {name}?", "Does", DOES_HAVE, { thing: ["car", "dog", "computer", "bike"], name: NAME }],
  [T_NEW, "Are you from {city}, {name}?", "______ your teacher from {city}, {name}?", "Is", "Your teacher is one person and there is no main verb, so use Is.", { city: CITY, name: NAME }],
  [T_NEW, "Does your sister like {food}, {name}?", "______ your sisters like {food}, {name}?", "Do", "Like is a main verb and sisters is plural, so use Do.", { food: ["plov", "fish", "pizza", "soup"], name: NAME }],
  [T_NEW, "Is your dad at work in {city} today, {name}?", "______ your parents at work in {city} today, {name}?", "Are", "Parents is plural and there is no main verb, so use Are.", { city: CITY, name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a new classmate where they are from. Use Are you.", "Are you", ["exactly one question", "must start with Are", "no do"]],
  ["Ask a friend about their sport. Use Do you.", "Do you", ["exactly one question", "must start with Do"]],
  ["Ask about your friend's sister. Use Does she have.", "Does she have", ["exactly one question", "must use Does", "must use have"]],
  ["Ask if a shop is open today. Use Is.", "Is", ["exactly one question", "must start with Is", "no do"]],
  ["Ask about your teacher's job. Use Is your teacher.", "Is", ["exactly one question", "must start with Is"]],
  ["Ask if your friend's parents work in your city. Use Do.", "Do", ["exactly one question", "must start with Do", "must use work"]],
  ["Write two questions about a friend: one with Is and one with Does.", "Is / Does", ["exactly two questions", "must use Is", "must use Does"]],
  ["Ask if someone has a pet. Use Does … have.", "Does … have", ["exactly one question", "must use Does", "must use have"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write four yes/no questions for a new classmate. Use Are you and Do you.", "be vs do questions", ["Are you", "Do you", "?"]],
  ["You want to know about your friend's brother. Write three or four questions.", "be vs do questions", ["Is he", "Does he", "have"]],
  ["You are new in a town. Write questions for a person in the street.", "be vs do questions", ["Is the", "Does the", "open"]],
  ["Write a short dialogue: you ask a friend about their weekend plans and hobbies.", "be vs do questions", ["Are you", "Do you", "Yes"]],
  ["Write questions to ask about a family photo.", "be vs do questions", ["Is this", "Does she", "Are they"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.yes-no.be-vs-do.json", JSON.stringify(items, null, 1) + "\n");