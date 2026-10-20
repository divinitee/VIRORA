// Hand-authored: questions-negation / wh-questions / wh-word-choice (A1).
//
// Tests the four placement foci: Where (place), When (time), Who (person),
// Why (reason). Every item carries its answer after a dash, so exactly one
// question word fits; the answer slot only ever takes fillers of the same
// kind (all cities, all days…), so the key never changes. The other three
// words are always the distractors — the real error is mixing them up.
// Transform kinds: question for a place/time answer (5), same question with a
// new answer → new word (5), question for a person/reason answer (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.wh-questions.wh-word-choice.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "wh-questions", topic: "wh-word-choice", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const DAY = ["Monday", "Tuesday", "Friday", "Saturday"];
const HOUR = ["six", "seven", "eight", "nine"];
const SUBJ = ["maths", "English", "history", "science"];
const WHY = {
  Where: "The answer is a place, so ask with Where.",
  When: "The answer is a time or a day, so ask with When.",
  Who: "The answer is a person, so ask with Who.",
  Why: "The answer starts with Because (a reason), so ask with Why.",
};
const ALL = ["Where", "When", "Who", "Why"];
const opts = (k) => [k, ...ALL.filter((w) => w !== k)];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["Where", "______ do you live, {name}? — In {city}.", { name: NAME, city: CITY }],
  ["Where", "______ is your {thing}, {name}? — It's on the table.", { thing: ["phone", "bag", "key", "book"], name: NAME }],
  ["Where", "______ does your sister work? — At a {place} in {city}.", { place: ["bank", "hospital", "hotel", "shop"], city: CITY }],
  ["Where", "______ are you going, {name}? — To the {place}.", { name: NAME, place: ["market", "park", "gym", "library"] }],
  ["Where", "______ is the {place}, {name}? — Next to the bank.", { place: ["café", "pharmacy", "bus stop", "post office"], name: NAME }],
  ["When", "______ is your birthday, {name}? — In {month}.", { name: NAME, month: ["June", "March", "October", "January"] }],
  ["When", "______ does the {event} start? — At {hour} o'clock.", { event: ["film", "lesson", "match", "concert"], hour: HOUR }],
  ["When", "______ do you play football, {name}? — On {day}.", { name: NAME, day: DAY }],
  ["When", "______ is the test in {subject}? — Next {day}.", { subject: SUBJ, day: DAY }],
  ["When", "______ does your train leave for {city}? — At {hour} in the morning.", { city: CITY, hour: HOUR }],
  ["Who", "______ is that man, {name}? — He's my {person}.", { name: NAME, person: ["uncle", "teacher", "coach", "neighbour"] }],
  ["Who", "______ is your best friend at {place}? — {friend}.", { place: ["school", "college", "work", "the club"], friend: ["Sardor", "Lola", "Bekzod", "Madina"] }],
  ["Who", "______ teaches you {subject}, {name}? — Mr Karimov.", { subject: SUBJ, name: NAME }],
  ["Who", "______ do you live with in {city}? — My {person}.", { city: CITY, person: ["parents", "grandma", "brother", "aunt"] }],
  ["Who", "______ is calling you, {name}? — My {person}.", { name: NAME, person: ["mum", "dad", "sister", "cousin"] }],
  ["Why", "______ are you tired, {name}? — Because I played {sport} all day.", { name: NAME, sport: ["football", "tennis", "volleyball", "basketball"] }],
  ["Why", "______ is Feruza at home today, {name}? — Because she is {state}.", { name: NAME, state: ["ill", "sick", "tired", "busy"] }],
  ["Why", "______ do you study English, {name}? — Because I want to work in {country}.", { name: NAME, country: ["England", "Canada", "Australia", "America"] }],
  ["Why", "______ are you late, {name}? — Because the {transport} was slow.", { name: NAME, transport: ["bus", "train", "metro", "taxi"] }],
  ["Why", "______ is the shop closed today, {name}? — Because it's {holiday}.", { name: NAME, holiday: ["Sunday", "Navruz", "a holiday", "New Year's Day"] }],
].map(([k, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(k), key: 0, why: WHY[k], slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write Where, When, Who or Why.";
const BUILD = [
  ["Where", "______ do your grandparents live? — In a village near {city}.", { city: CITY }],
  ["Where", "______ can I buy a {thing}, {name}? — At the market.", { thing: ["hat", "bag", "phone case", "ball"], name: NAME }],
  ["Where", "______ is the {place}? — It's near the station, {name}.", { place: ["hotel", "museum", "hospital", "school"], name: NAME }],
  ["Where", "______ do you do your homework, {name}? — In my {room}.", { name: NAME, room: ["room", "bedroom", "study", "classroom"] }],
  ["Where", "______ are my {things}, Mum? — In your bag.", { things: ["keys", "books", "socks", "glasses"] }],
  ["When", "______ do you get up on {day}, {name}? — At seven.", { day: DAY, name: NAME }],
  ["When", "______ is the {event}? — On Saturday, {name}.", { event: ["party", "wedding", "match", "concert"], name: NAME }],
  ["When", "______ does the shop open, {name}? — At {hour}.", { name: NAME, hour: HOUR }],
  ["When", "______ do you visit your family in {city}? — In the {season}.", { city: CITY, season: ["summer", "winter", "spring", "holidays"] }],
  ["When", "______ is your English lesson, {name}? — On {day} afternoon.", { name: NAME, day: DAY }],
  ["Who", "______ is your {subject} teacher, {name}? — Mrs Akhmedova.", { subject: SUBJ, name: NAME }],
  ["Who", "______ is in the photo, {name}? — My {person}.", { name: NAME, person: ["grandpa", "cousin", "sister", "uncle"] }],
  ["Who", "______ cooks dinner in your family? — My {person}, {name}.", { person: ["mum", "dad", "grandma", "brother"], name: NAME }],
  ["Who", "______ do you play {game} with? — My brother, {name}.", { game: ["chess", "tennis", "football", "cards"], name: NAME }],
  ["Who", "______ is at the door, {name}? — It's the {person}.", { name: NAME, person: ["neighbour", "postman", "taxi driver", "delivery man"] }],
  ["Why", "______ are you happy today, {name}? — Because I got a {thing}.", { name: NAME, thing: ["present", "new bike", "good mark", "new phone"] }],
  ["Why", "______ is the baby crying? — Because she is {state}, {name}.", { state: ["hungry", "tired", "cold", "sleepy"], name: NAME }],
  ["Why", "______ do you like {city}, {name}? — Because it's beautiful.", { city: CITY, name: NAME }],
  ["Why", "______ are you at home today? — Because I have a {ill}, {name}.", { ill: ["cold", "headache", "fever", "cough"], name: NAME }],
  ["Why", "______ does Ravshan go to the gym? — Because he wants to be {adj}, {name}.", { adj: ["strong", "fit", "healthy", "fast"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[key], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_PT = "Write a question for this answer. Use Where or When.";
const T_SWAP = "The answer is different now. Write the new question word.";
const T_PR = "Write a question for this answer. Use Who or Why.";
const TRANSFORM = [
  [T_PT, "My grandparents live in {city}, {name}.", "______ do your grandparents live, {name}? — In {city}.", "Where"],
  [T_PT, "The match starts at {hour}, {name}.", "______ does the match start, {name}? — At {hour}.", "When", { hour: HOUR, name: NAME }],
  [T_PT, "My brother works at the {place} in {city}.", "______ does your brother work? — At the {place} in {city}.", "Where", { place: ["bank", "airport", "hospital", "hotel"], city: CITY }],
  [T_PT, "We have {subject} on {day}.", "______ do we have {subject}? — On {day}.", "When", { subject: SUBJ, day: DAY }],
  [T_PT, "The keys are in the {place}, {name}.", "______ are the keys, {name}? — In the {place}.", "Where", { place: ["car", "kitchen", "drawer", "bag"], name: NAME }],
  [T_SWAP, "Where do you go on {day}, {name}? — To the gym.", "______ do you go to the gym, {name}? — On {day}.", "When", { day: DAY, name: NAME }],
  [T_SWAP, "When does Aziza go to the {place}? — On Sundays.", "______ does Aziza go on Sundays? — To the {place}.", "Where", { place: ["pool", "market", "park", "cinema"] }],
  [T_SWAP, "Who is in the {room}, {name}? — Grandma.", "______ is Grandma, {name}? — In the {room}.", "Where", { room: ["kitchen", "garden", "living room", "yard"], name: NAME }],
  [T_SWAP, "Why is your brother at home, {name}? — Because he has a {ill}.", "______ is at home with a {ill}, {name}? — My brother.", "Who", { ill: ["cold", "cough", "fever", "headache"], name: NAME }],
  [T_SWAP, "Where is the {event}, {name}? — In the big hall.", "______ is the {event}, {name}? — On Friday.", "When", { event: ["concert", "meeting", "party", "test"], name: NAME }],
  [T_PR, "My {person} teaches maths at {place}.", "______ teaches maths at {place}? — My {person}.", "Who", { person: ["aunt", "uncle", "mum", "dad"], place: ["our school", "the college", "this school", "the university"] }],
  [T_PR, "I'm late because the {transport} was slow, {name}.", "______ are you late, {name}? — Because the {transport} was slow.", "Why", { transport: ["bus", "train", "metro", "taxi"], name: NAME }],
  [T_PR, "Kamila is in the photo with her {person}.", "______ is in the photo with Kamila? — Her {person}.", "Who", { person: ["dad", "sister", "grandma", "teacher"] }],
  [T_PR, "Sanjar is tired because he played {sport} all day, {name}.", "______ is Sanjar tired, {name}? — Because he played {sport} all day.", "Why", { sport: ["football", "tennis", "volleyball", "basketball"], name: NAME }],
  [T_PR, "Your {person} is calling you, {name}.", "______ is calling me, {name}? — Your {person}.", "Who", { person: ["mum", "dad", "sister", "teacher"], name: NAME }],
].map(([instr, source, hint, key, slots = { city: CITY, name: NAME }]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY[key], slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Ask a new classmate about their home town. Use Where.", "Where", ["exactly one question", "must start with Where"]],
  ["Ask a friend about their birthday. Use When.", "When", ["exactly one question", "must start with When"]],
  ["Ask about a person in a photo. Use Who.", "Who", ["exactly one question", "must start with Who"]],
  ["Your friend is sad. Ask about the reason. Use Why.", "Why", ["exactly one question", "must start with Why"]],
  ["Ask when the next bus to the city centre leaves.", "When", ["exactly one question", "must start with When"]],
  ["Ask who your friend's English teacher is.", "Who", ["exactly one question", "must start with Who"]],
  ["Write two questions about a party: one with Where and one with When.", "Where / When", ["exactly two questions", "must use Where", "must use When"]],
  ["Write a question with Why and an answer with Because.", "Why … Because", ["one question and one answer", "must use Why", "must use Because"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write four questions for a new classmate. Use Where, When, Who and Why.", "Where / When / Who / Why", ["Where", "When", "Who", "Why"]],
  ["You want to go to a concert with a friend. Write questions about it.", "Where / When / Who / Why", ["Where is", "When does", "Who"]],
  ["Write a short interview with a famous sports player.", "Where / When / Who / Why", ["Why do you", "When", "Where"]],
  ["Your friend is back from a trip. Write three or four questions.", "Where / When / Who / Why", ["Where", "Who", "When"]],
  ["Write questions and short answers about your family.", "Where / When / Who / Why", ["Who", "Where", "Because"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.wh-questions.wh-word-choice.json", JSON.stringify(items, null, 1) + "\n");