// Hand-authored: modals / semi-modals / have-to (A2).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "have to for external necessity" (You ______ bring your
// passport: have to / might / could / don't have). Rule 14: include has to
// for he / she / it. Talking about rules, jobs and duties.
// Choose: 10 items pick have to / has to (errors: the wrong person, have or
// has without to, "haves to"); 5 pick the verb after have to (base vs -ing /
// -s / past); 5 do / does questions and negatives (Do vs Does, Are / Is, not).
// NEVER offered: must, need to, have got to, should (often right too), and
// "Has she to … ? / hasn't to" (old British forms, not errors).
// The "not necessary" meaning of don't have to vs mustn't is a separate topic
// (obligation.mustnt-vs-dont-have-to); negatives here only test the form.
//
// Run: node tools/grammar-practice/authored/modals.semi-modals.have-to.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "semi-modals", topic: "have-to", level: "A2", pv: "2.5" };

const PL = ["have to", "has to", "have", "haves to"];
const SG = ["has to", "have to", "has", "haves to"];
const WP = "With I, you, we and they, use have to + base verb for something that is necessary.";
const WS = "With he, she or it, use has to + base verb. Don't forget to.";
const V = (v, ing, s, past) => [v, ing, s, past];
const VW = (v) => `After have to / has to, use the base verb: ${v}.`;
const QD = "Questions with have to use do / does: Do you have to … ? Does she have to … ?";
const ND = "The negative uses don't / doesn't + have to: She doesn't have to … ; They don't have to …";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [PL, WP, "I ______ get up at six because my {transport} leaves at {time}.",
    { transport: ["bus", "train", "minibus", "metro"], time: ["half past six", "six thirty", "seven", "a quarter to seven"] }],
  [SG, WS, "My dad ______ work at the {place} on {day}.",
    { place: ["factory", "hospital", "shop", "office"], day: ["Saturdays", "Sundays", "holidays", "Fridays"] }],
  [PL, WP, "Students ______ wear a uniform at {place} {when}.",
    { place: ["our school", "this college", "school", "the academy"], when: ["every day", "on Mondays", "for exams", "all week"] }],
  [SG, WS, "Lola ______ take her {thing} before {meal}.",
    { thing: ["medicine", "vitamins", "pills", "tablets"], meal: ["breakfast", "dinner", "school", "bed"] }],
  [PL, WP, "We ______ leave now, {name}. The {event} starts soon.",
    { name: ["Aziz", "Olga", "Mum", "Dad"], event: ["film", "concert", "lesson", "match"] }],
  [PL, WP, "You ______ show your {doc} at the {place}.",
    { doc: ["passport", "ticket", "ID card", "student card"], place: ["airport", "gate", "entrance", "border"] }],
  [SG, WS, "Our dog ______ go out {freq}, {name}.",
    { freq: ["three times a day", "every morning", "twice a day", "after meals"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [SG, WS, "My sister ______ study for her {exam} {when}.",
    { exam: ["exams", "driving test", "IELTS exam", "maths test"], when: ["tonight", "every day", "this week", "all weekend"] }],
  [PL, WP, "They ______ pay for the {thing} {when}.",
    { thing: ["tickets", "room", "flat", "lessons"], when: ["today", "every month", "before Friday", "now"] }],
  [PL, WP, "Doctors {how} ______ work {when}.",
    { how: ["sometimes", "often", "usually", "always"], when: ["at night", "at weekends", "on holidays", "very long hours"] }],
  [V("finish", "finishing", "finishes", "finished"), VW("finish"), "Aziz has to ______ his {thing} {when}.",
    { thing: ["homework", "project", "report", "essay"], when: ["tonight", "by Friday", "today", "before dinner"] }],
  [V("clean", "cleaning", "cleans", "cleaned"), VW("clean"), "We have to ______ the {room} before {who} arrive.",
    { room: ["kitchen", "living room", "flat", "bathroom"], who: ["the guests", "our friends", "Grandma and Grandpa", "the neighbours"] }],
  [V("wash", "washing", "washes", "washed"), VW("wash"), "You have to ______ your hands before {meal}, {name}.",
    { meal: ["lunch", "dinner", "breakfast", "eating"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [V("take", "taking", "takes", "took"), VW("take"), "She has to ______ a bus and a metro to get to {place}.",
    { place: ["work", "university", "school", "the office"] }],
  [V("help", "helping", "helps", "helped"), VW("help"), "I have to ______ my {relative} with the {task}.",
    { relative: ["mum", "grandfather", "little brother", "aunt"], task: ["shopping", "cooking", "garden", "cleaning"] }],
  [["Do", "Does", "Are", "Is"], QD, "______ you have to work on {day}, {name}?",
    { day: ["Saturday", "Sunday", "Friday", "holidays"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [["Does", "Do", "Is", "Are"], QD, "______ your sister have to wear a {thing} at {place}?",
    { thing: ["uniform", "suit", "hat", "badge"], place: ["work", "school", "the hotel", "the hospital"] }],
  [["don't", "doesn't", "aren't", "not"], ND, "Children ______ have to go to school on {day} in {country}.",
    { day: ["Sundays", "holidays", "Saturdays"], country: ["Uzbekistan", "Russia", "Korea", "our country"] }],
  [["doesn't", "don't", "isn't", "not"], ND, "{name} is lucky. He ______ have to get up early {when}.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], when: ["tomorrow", "on Sundays", "this week", "in the holidays"] }],
  [["do", "does", "are", "is"], QD, "What time ______ we have to be at the {place}, {name}?",
    { place: ["airport", "station", "school", "stadium"], name: ["Dad", "Mum", "Aziz", "Olga"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Use have to or has to + the verb in brackets.";
const BP = (v) => `With I, you, we, they: have to + base verb: have to ${v}.`;
const BS = (v) => `With he, she, it: has to + base verb: has to ${v}.`;
const BUILD = [
  [0, "wear", "My brother ______ (wear) glasses {when}, {name}.",
    { when: ["for reading", "at school", "all the time", "in class"], name: ["Mum", "Olga", "Aziz", "Lola"] }],
  [1, "finish", "I ______ (finish) this {task} by {day}.",
    { task: ["project", "essay", "report", "book"], day: ["Friday", "Monday", "tomorrow", "the weekend"] }],
  [0, "check", "Our teacher ______ (check) {num} tests {when}.",
    { num: ["thirty", "forty", "fifty", "a hundred"], when: ["tonight", "every week", "this evening", "by Monday"] }],
  [1, "buy", "We ______ (buy) a present for {who} {when}.",
    { who: ["Grandma", "Mum", "our teacher", "Aziz"], when: ["today", "this week", "before Sunday", "tomorrow"] }],
  [0, "walk", "Lola ______ (walk) her dog {freq}.",
    { freq: ["every morning", "twice a day", "after school", "every evening"] }],
  [1, "be", "You ______ (be) quiet in the {place}, {name}.",
    { place: ["library", "hospital", "museum", "exam room"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [1, "bring", "Students ______ (bring) a {thing} {when}.",
    { thing: ["dictionary", "calculator", "pencil", "notebook"], when: ["every day", "for the test", "on Monday", "tomorrow"] }],
  [0, "cook", "My mum ______ (cook) dinner for {num} people {when}.",
    { num: ["ten", "twelve", "fifteen", "twenty"], when: ["tonight", "on Sunday", "every Friday", "tomorrow"] }],
  [1, "change", "They ______ (change) trains in {city}.",
    { city: ["Samarkand", "Tashkent", "Bukhara", "Jizzakh"] }],
  [0, "repeat", "Aziz ______ (repeat) the {exam}. He failed it.",
    { exam: ["exam", "test", "course", "year"] }],
  [1, "call", "I ______ (call) my parents every {time}, {name}.",
    { time: ["evening", "day", "night", "weekend"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [1, "train", "The players ______ (train) {freq} before the {event}.",
    { freq: ["every day", "twice a day", "every morning", "a lot"], event: ["final", "big match", "tournament", "cup game"] }],
  [0, "look", "Dilnoza ______ (look) after her little {sib} {when}.",
    { sib: ["brother", "sister", "cousins", "brothers"], when: ["after school", "today", "every evening", "at weekends"] }],
  [1, "wait", "We ______ (wait) for the {transport} {where}.",
    { transport: ["bus", "train", "taxi", "minibus"], where: ["outside", "at the corner", "in the rain", "for an hour"] }],
  [0, "drive", "My dad ______ (drive) {dist} every day.",
    { dist: ["fifty kilometres", "a long way", "far", "for two hours"] }],
  [1, "fill", "You ______ (fill) in this {form}, {name}.",
    { form: ["form", "application", "card", "questionnaire"], name: ["Aziz", "Olga", "sir", "madam"] }],
  [0, "stand", "The shop assistant ______ (stand) all {time}.",
    { time: ["day", "morning", "afternoon", "evening"] }],
  [1, "get", "I ______ (get) up early {when}.",
    { when: ["tomorrow", "on Mondays", "every day", "this week"] }],
  [0, "eat", "Our cat ______ (eat) special {food} {when}.",
    { food: ["food", "biscuits", "fish", "meat"], when: ["now", "every day", "because she's old", "this month"] }],
  [1, "speak", "You ______ (speak) English in this {class}, {name}.",
    { class: ["class", "lesson", "room", "club"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([pl, v, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${pl ? "have" : "has"} to ${v}`, why: pl ? BP(v) : BS(v), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const MUST = "Rewrite the sentence with have to or has to.";
const NEW = "Rewrite the sentence about the new person.";
const Q = "Make a question with do or does + have to.";
const TRANSFORM = [
  // must -> have to / has to (5)
  [MUST, "Students must wear a uniform at {place} {when}.", "Students ______ (wear) a uniform at {place} {when}.", "have to wear",
    "Students is plural, so must becomes have to + base verb.",
    { place: ["our school", "this college", "school", "the academy"], when: ["every day", "on Mondays", "for exams", "all week"] }],
  [MUST, "Drivers must stop at the {thing} {where}.", "Drivers ______ (stop) at the {thing} {where}.", "have to stop",
    "Drivers is plural: have to stop.",
    { thing: ["red light", "crossing", "border", "gate"], where: ["in the city", "here", "on this road", "every time"] }],
  [MUST, "Aziz must finish the {task} {when}.", "Aziz ______ (finish) the {task} {when}.", "has to finish",
    "Aziz is one person (he), so must becomes has to.",
    { task: ["report", "project", "essay", "test"], when: ["today", "by Friday", "tonight", "this week"] }],
  [MUST, "Passengers must show their {doc} at the {place}.", "Passengers ______ (show) their {doc} at the {place}.", "have to show",
    "Passengers is plural: have to show.",
    { doc: ["passports", "tickets", "ID cards", "boarding passes"], place: ["airport", "gate", "station", "border"] }],
  [MUST, "My sister must take her {thing} {when}.", "My sister ______ (take) her {thing} {when}.", "has to take",
    "My sister is she, so use has to.",
    { thing: ["medicine", "vitamins", "pills", "tablets"], when: ["every morning", "after meals", "twice a day", "before bed"] }],
  // I / we / they -> he / she (5)
  [NEW, "I have to get up at {time}, {name}.", "My dad ______ (get) up at {time}, {name}.", "has to get",
    "My dad is he, so have to becomes has to.",
    { time: ["five", "six", "half past five", "six thirty"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [NEW, "We have to wear {thing} at {place}.", "Olga ______ (wear) {thing} at {place}.", "has to wear",
    "Olga is she, so have to becomes has to.",
    { thing: ["a uniform", "a suit", "a hat", "black shoes"], place: ["work", "school", "the hotel", "the bank"] }],
  [NEW, "I have to study for the {exam} {when}.", "Aziz ______ (study) for the {exam} {when}.", "has to study",
    "Aziz is he, so use has to.",
    { exam: ["exam", "test", "interview", "competition"], when: ["tonight", "this week", "every day", "all weekend"] }],
  [NEW, "They have to help their parents in the {place} {when}.", "Bobur ______ (help) his parents in the {place} {when}.", "has to help",
    "Bobur is he, so use has to.",
    { place: ["shop", "garden", "kitchen", "field"], when: ["after school", "at weekends", "every day", "in summer"] }],
  [NEW, "You have to pay for the {thing} {when}.", "She ______ (pay) for the {thing} {when}.", "has to pay",
    "With she, use has to.",
    { thing: ["tickets", "room", "lessons", "books"], when: ["today", "now", "before Friday", "every month"] }],
  // questions with do / does (5)
  [Q, "Aziz has to work on {day} {when}.", "______ Aziz ______ (work) on {day} {when}?", ["Does", "have to work"],
    "Question: Does + he + have to + verb. After does, has becomes have.",
    { day: ["Saturday", "Sunday", "Friday", "holidays"], when: ["this week", "again", "every week", "in summer"] }],
  [Q, "You have to bring a {thing} {when}.", "______ you ______ (bring) a {thing} {when}?", ["Do", "have to bring"],
    "Question: Do + you + have to + verb.",
    { thing: ["dictionary", "calculator", "passport", "photo"], when: ["tomorrow", "on Monday", "for the test", "every day"] }],
  [Q, "Lola has to wear a {thing} at {place}.", "______ Lola ______ (wear) a {thing} at {place}?", ["Does", "have to wear"],
    "Question: Does + she + have to + verb (have, not has).",
    { thing: ["uniform", "hat", "badge", "suit"], place: ["school", "work", "the hospital", "the hotel"] }],
  [Q, "We have to leave at {time} {when}.", "______ we ______ (leave) at {time} {when}?", ["Do", "have to leave"],
    "Question: Do + we + have to + verb.",
    { time: ["six", "seven", "five", "eight"], when: ["tomorrow", "tonight", "on Friday", "today"] }],
  [Q, "Your brother has to go to the {place} {when}.", "______ your brother ______ (go) to the {place} {when}?", ["Does", "have to go"],
    "Question: Does + he + have to + verb.",
    { place: ["dentist", "hospital", "bank", "office"], when: ["today", "tomorrow", "every week", "this afternoon"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you have to do every morning.", "I have to + base verb", ["exactly one sentence", "must use have to", "must include every morning"]],
  ["Write one sentence about something a family member has to do at work.", "has to + base verb", ["exactly one sentence", "must name the person", "must use has to"]],
  ["Write one sentence about a rule at your school or university.", "have to + base verb", ["exactly one sentence", "must use have to", "must mention school or university"]],
  ["Ask a friend a question about their job or studies with have to.", "Do you have to … ?", ["exactly one question", "must start with Do you have to", "must end with a question mark"]],
  ["Write one sentence about something you don't have to do at the weekend.", "don't have to + base verb", ["exactly one sentence", "must use don't have to", "must include at the weekend"]],
  ["Write one sentence about what tourists have to show at the airport.", "have to show", ["exactly one sentence", "must use have to", "must name a document"]],
  ["Write one sentence about something a pet has to do or have every day.", "has to + base verb", ["exactly one sentence", "must name the animal", "must use has to"]],
  ["Write two sentences: one thing you have to do this week and one thing your friend has to do.", "have to / has to", ["exactly two sentences", "have to in one, has to in the other", "base verb in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a normal school or work day. What do you have to do? Write three or four sentences.",
    "have to for duties", ["I have to + base verb", "time words", "three different verbs"]],
  ["What does a doctor, a teacher or a driver have to do at work? Choose one job and write three or four sentences.",
    "has to for a job", ["he / she has to + base verb", "don't forget to", "no must to"]],
  ["Write about the rules in your home. What do you and your brothers or sisters have to do?",
    "have to / has to", ["I have to", "my brother / sister has to", "don't have to for one thing"]],
  ["A friend is coming to study at your school. Write what students have to do there.",
    "have to for rules", ["students have to", "you have to", "a question with Do you have to"]],
  ["Interview a friend about their week: write four questions with have to and their answers.",
    "Do you have to … ? questions and answers", ["Do you have to … ?", "Yes, I do / No, I don't", "has to in one answer"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.semi-modals.have-to.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
