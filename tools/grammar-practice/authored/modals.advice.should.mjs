// Hand-authored: modals / advice / should (A2).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "should for advice" (You ______ see a doctor if you feel
// worse: should / can't / mustn't / would). Giving and asking for advice.
// Choose: 10 form items (should + base verb: to / -ing / -s are the errors),
// 6 meaning items (should vs shouldn't, made clear by the context, plus
// "don't should" and "should to"), 4 advice questions (Should I…? / What
// should I…?, with do-support and copula errors). must / have to / could / can
// are NEVER offered: in advice sentences they are often right too.
// Typed keys: should / shouldn't + verb; ingest adds "should not".
//
// Run: node tools/grammar-practice/authored/modals.advice.should.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "advice", topic: "should", level: "A2", pv: "2.5" };

const F = (v, ing, s) => [v, `to ${v}`, ing, s];
const FW = (v) => `After should, use the base verb: should ${v}. No to, no -ing, no -s.`;
const POS = ["should", "shouldn't", "don't should", "should to"];
const NEG = ["shouldn't", "should", "don't should", "shouldn't to"];
const PW = "It is a good idea, so use should + base verb. Should never takes do / don't.";
const NW = "It is a bad idea, so use shouldn't + base verb. Never don't should.";
const Q = (w) => `To ask for advice, put should before the subject: ${w}`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [F("see", "seeing", "sees"), FW("see"), "You look {adj}. You should ______ a doctor {when}.",
    { adj: ["ill", "pale", "unwell", "terrible"], when: ["today", "soon", "right away", "tomorrow"] }],
  [F("learn", "learning", "learns"), FW("learn"), "You should ______ ten new words every day, {name}. Write them {where}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], where: ["in a notebook", "on cards", "in your phone", "on the wall"] }],
  [F("clean", "cleaning", "cleans"), FW("clean"), "We should ______ the {room} before {who} come.",
    { room: ["kitchen", "living room", "flat", "bathroom"], who: ["the guests", "Grandma and Grandpa", "our friends", "the neighbours"] }],
  [F("wear", "wearing", "wears"), FW("wear"), "You should ______ a jacket, {name}. It's {adj} outside.",
    { name: ["Bobur", "Kamila", "Sardor", "Madina"], adj: ["cold", "windy", "chilly", "freezing"] }],
  [F("go", "going", "goes"), FW("go"), "Aziz should ______ to bed earlier. He's always {state} in the {time}.",
    { state: ["tired", "sleepy", "late", "grumpy"], time: ["morning", "first lesson", "mornings", "class"] }],
  [F("visit", "visiting", "visits"), FW("visit"), "Tourists should ______ {city} in {season}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Shahrisabz"], season: ["spring", "autumn", "April", "October"] }],
  [F("call", "calling", "calls"), FW("call"), "You should ______ your {relative} more often, {name}.",
    { relative: ["grandmother", "parents", "uncle", "aunt"], name: ["Jasur", "Nodira", "Anvar", "Malika"] }],
  [F("turn", "turning", "turns"), FW("turn"), "Students should ______ their phones off in {place}, {name}.",
    { place: ["class", "the exam", "the library", "lessons"], name: ["Aziz", "everyone", "Lola", "Timur"] }],
  [F("buy", "buying", "buys"), FW("buy"), "I think you should ______ {thing} for your mum's birthday.",
    { thing: ["flowers", "a scarf", "a cake", "a nice book"] }],
  [F("eat", "eating", "eats"), FW("eat"), "Children should ______ {food} every day for {meal}.",
    { food: ["fruit", "vegetables", "eggs", "porridge"], meal: ["breakfast", "lunch", "a snack", "dinner"] }],
  [NEG, NW, "You ______ eat so many {food}, {name}. They're bad for your teeth.",
    { food: ["sweets", "chocolates", "biscuits", "sugary snacks"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [NEG, NW, "You ______ go to bed so late, {name}. You have {event} tomorrow.",
    { name: ["Sardor", "Kamila", "Bobur", "Malika"], event: ["school", "an exam", "a test", "work"] }],
  [NEG, NW, "Drivers ______ use their phones {when}. It's very dangerous.",
    { when: ["while they drive", "on the road", "in traffic", "at the wheel"] }],
  [POS, PW, "You look tired. You ______ have a rest, {name}. Sit {where}.",
    { name: ["Mum", "Aziz", "Grandpa", "Olga"], where: ["here", "on the sofa", "in the shade", "by the window"] }],
  [POS, PW, "It's a long trip. We ______ take some {food} with us, {name}.",
    { food: ["water", "sandwiches", "fruit", "snacks"], name: ["Dad", "Aziz", "Mum", "Lola"] }],
  [NEG, NW, "You ______ swim in the {water} {when}. It's dangerous.",
    { water: ["river", "lake", "sea", "canal"], when: ["at night", "alone", "after a big meal", "in winter"] }],
  [["Should I", "Do I should", "Am I should", "Should I to"], Q("Should I take…?"), "______ take an umbrella, {name}? It looks {weather}.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], weather: ["cloudy", "grey", "like rain", "dark"] }],
  [["should I", "I should", "do I should", "should I to"], Q("What should I wear…?"), "What ______ wear to the {event}, {name}?",
    { event: ["wedding", "party", "interview", "concert"], name: ["Mum", "Lola", "Aziza", "Dad"] }],
  [["should we", "we should", "do we should", "should we to"], Q("Where should we go…?"), "Where ______ go on holiday this {season}, {name}?",
    { season: ["summer", "spring", "winter", "autumn"], name: ["Dad", "Mum", "Aziz", "Olga"] }],
  [["Should I", "Do I should", "Am I should", "Should I to"], Q("Should I call…?"), "______ call the doctor, {name}? Grandma has a {problem}.",
    { name: ["Mum", "Dad", "Aziz", "Lola"], problem: ["high fever", "bad cough", "headache", "pain in her back"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Give advice with should or shouldn't + the verb in brackets.";
const BP = (v) => `It's a good idea, so use should + base verb: should ${v}.`;
const BN = (v) => `It's a bad idea, so use shouldn't + base verb: shouldn't ${v}.`;
const BUILD = [
  [1, "study", "You have a test tomorrow. You ______ (study) {when}, {name}.",
    { when: ["tonight", "this evening", "now", "all afternoon"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [1, "wear", "It's very cold. You ______ (wear) a {thing}, {name}.",
    { thing: ["warm coat", "hat", "scarf", "jacket"], name: ["Bobur", "Kamila", "Sardor", "Madina"] }],
  [0, "eat", "You ______ (eat) fast food every day, {name}. It's not {adj}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], adj: ["healthy", "good for you", "cheap", "a good idea"] }],
  [1, "go", "{who} has a toothache. He ______ (go) to the dentist {when}.",
    { who: ["Aziz", "My brother", "Dad", "Grandpa"], when: ["today", "soon", "this week", "tomorrow"] }],
  [0, "be", "We ______ (be) late for the {event}, {name}.",
    { event: ["wedding", "concert", "exam", "interview"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  [1, "drink", "You ______ (drink) more water in {season}, {name}.",
    { season: ["summer", "hot weather", "July", "August"], name: ["Grandpa", "Aziz", "Lola", "Timur"] }],
  [0, "spend", "Lola ______ (spend) so much time on her {device}. Her eyes {state}.",
    { device: ["phone", "laptop", "tablet", "computer"], state: ["hurt", "are tired", "are red", "feel tired"] }],
  [1, "take", "If you're tired, you ______ (take) a break for {time}, {name}.",
    { time: ["ten minutes", "a while", "half an hour", "a few minutes"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  [0, "tell", "You ______ (tell) {who} about the party. It's a surprise, {name}!",
    { who: ["Mum", "Lola", "the teacher", "your brother"], name: ["Aziz", "Olga", "Timur", "Kamila"] }],
  [1, "try", "Tourists ______ (try) {food} when they visit {city}.",
    { food: ["plov", "samsa", "lagman", "fresh bread"], city: ["Samarkand", "Tashkent", "Bukhara", "Uzbekistan"] }],
  [0, "leave", "You ______ (leave) your bag {where}. Someone can take it, {name}.",
    { where: ["on the bus", "outside", "on the bench", "in the car"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [1, "read", "My brother ______ (read) more {things}. He wants to improve his {skill}.",
    { things: ["books", "English stories", "newspapers", "articles"], skill: ["English", "spelling", "vocabulary", "writing"] }],
  [1, "ask", "You ______ (ask) the teacher if you don't understand something in {lesson}, {name}.",
    { lesson: ["maths", "class", "English", "physics"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [0, "play", "Children ______ (play) with {thing}. It's dangerous.",
    { thing: ["matches", "knives", "fire", "electricity"] }],
  [1, "book", "We ______ (book) the tickets {when}. They sell out fast, {name}.",
    { when: ["today", "now", "early", "this week"], name: ["Dad", "Aziz", "Mum", "Olga"] }],
  [1, "talk", "You look unhappy, {name}. You ______ (talk) to {who} about it.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], who: ["your parents", "a friend", "the teacher", "your sister"] }],
  [0, "copy", "Students ______ (copy) answers from {source} in the {test}.",
    { source: ["the internet", "their friends", "other students", "the book"], test: ["test", "exam", "quiz", "homework"] }],
  [1, "bring", "You ______ (bring) a {thing} to the beach. The sun is very strong.",
    { thing: ["hat", "cap", "bottle of sun cream", "big umbrella"] }],
  [1, "sell", "I think Dad ______ (sell) his old {vehicle}. It's {state}.",
    { vehicle: ["car", "van", "motorbike", "bike"], state: ["too old", "always broken", "very slow", "not safe"] }],
  [0, "walk", "You ______ (walk) {where} at night, {name}. It isn't safe.",
    { where: ["alone", "in the park", "by the river", "on dark streets"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([pos, v, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: pos ? `should ${v}` : `shouldn't ${v}`, why: pos ? BP(v) : BN(v), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const IMP = "Give the same advice with should or shouldn't.";
const IDEA = "Rewrite with should or shouldn't.";
const WHY = "Rewrite the suggestion with You should.";
const TRANSFORM = [
  // imperative -> should / shouldn't (5)
  [IMP, 1, "drink", "Drink more {drink}, {name}.", "You ______ (drink) more {drink}, {name}.",
    "An order (Drink…) becomes advice with should + base verb.", { drink: ["water", "milk", "green tea", "juice"], name: ["Aziz", "Olga", "Grandpa", "Lola"] }],
  [IMP, 1, "go", "Go to bed early {when}, {name}.", "You ______ (go) to bed early {when}, {name}.",
    "Go… becomes advice: You should go…", { when: ["tonight", "this week", "before the exam", "every night"], name: ["Bobur", "Kamila", "Sardor", "Madina"] }],
  [IMP, 0, "eat", "Don't eat so much {food}, {name}.", "You ______ (eat) so much {food}, {name}.",
    "Don't eat… becomes advice with shouldn't: You shouldn't eat…", { food: ["sugar", "bread", "fast food", "salt"], name: ["Dad", "Aziz", "Olga", "Timur"] }],
  [IMP, 0, "worry", "Don't worry about the {thing}, {name}.", "You ______ (worry) about the {thing}, {name}.",
    "Don't worry… becomes advice with shouldn't: You shouldn't worry…", { thing: ["exam", "test", "interview", "match"], name: ["Lola", "Aziz", "Mum", "Jasur"] }],
  [IMP, 1, "ask", "Ask your {who} for help {when}.", "You ______ (ask) your {who} for help {when}.",
    "Ask… becomes advice: You should ask…", { who: ["teacher", "parents", "brother", "friends"], when: ["now", "today", "next time", "before the test"] }],
  // It's (not) a good idea -> should / shouldn't (5)
  [IDEA, 1, "learn", "It's a good idea to learn some {lang} before your trip, {name}.", "You ______ (learn) some {lang} before your trip, {name}.",
    "It's a good idea to… = should + base verb.", { lang: ["English", "Korean", "Turkish", "German"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [IDEA, 0, "swim", "It's not a good idea to swim after {meal}, {name}.", "You ______ (swim) after {meal}, {name}.",
    "It's not a good idea to… = shouldn't + base verb.", { meal: ["lunch", "a big meal", "dinner", "eating"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [IDEA, 1, "see", "It's a good idea for Aziz to see the {doctor} {when}.", "Aziz ______ (see) the {doctor} {when}.",
    "It's a good idea for Aziz to… = Aziz should + base verb.", { doctor: ["doctor", "dentist", "nurse", "school doctor"], when: ["today", "soon", "this week", "tomorrow"] }],
  [IDEA, 0, "watch", "It's not a good idea for {who} to watch TV {how}.", "{who} ______ (watch) TV {how}.",
    "It's not a good idea for… to = shouldn't + base verb.", { who: ["Children", "Young kids", "Little children", "Babies"], how: ["all day", "late at night", "for hours", "before school"] }],
  [IDEA, 1, "leave", "It's a good idea for us to leave {when}, {name}.", "We ______ (leave) {when}, {name}.",
    "It's a good idea for us to… = We should + base verb.", { when: ["now", "early", "before six", "soon"], name: ["Dad", "Aziz", "Mum", "Olga"] }],
  // Why don't you …? -> You should … (5)
  [WHY, 1, "call", "Why don't you call {who}, {name}?", "You ______ (call) {who}, {name}.",
    "Why don't you…? is a suggestion. You can say: You should call…", { who: ["your grandma", "the doctor", "your teacher", "a taxi"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [WHY, 1, "take", "Why don't you take the {transport}? It's faster, {name}.", "You ______ (take) the {transport}. It's faster, {name}.",
    "Why don't you take…? = You should take…", { transport: ["metro", "train", "fast bus", "taxi"], name: ["Bobur", "Kamila", "Sardor", "Madina"] }],
  [WHY, 1, "join", "Why don't you join the {club}, {name}?", "You ______ (join) the {club}, {name}.",
    "Why don't you join…? = You should join…", { club: ["chess club", "football team", "school choir", "English club"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [WHY, 1, "ask", "Why don't you ask for a {thing}, {name}?", "You ______ (ask) for a {thing}, {name}.",
    "Why don't you ask…? = You should ask…", { thing: ["discount", "bigger size", "receipt", "new one"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  [WHY, 1, "rest", "Why don't you rest for a {time}, {name}?", "You ______ (rest) for a {time}, {name}.",
    "Why don't you rest…? = You should rest…", { time: ["while", "bit", "few minutes", "moment"], name: ["Grandpa", "Mum", "Aziz", "Olga"] }],
].map(([instr, pos, v, source, hint, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: pos ? `should ${v}` : `shouldn't ${v}`, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["A friend is always tired. Give one piece of advice.", "You should + base verb", ["exactly one sentence", "must use should", "base verb after should"]],
  ["A friend wants to learn English fast. Give one piece of advice.", "You should + base verb", ["exactly one sentence", "must use should", "no to after should"]],
  ["Write one sentence about something people shouldn't do in a library.", "shouldn't + base verb", ["exactly one sentence", "must use shouldn't", "must mention the library"]],
  ["A tourist is coming to Uzbekistan. Tell them one thing they should try.", "should try", ["exactly one sentence", "must use should", "must name a food or place"]],
  ["Ask a friend for advice about what to wear to a party.", "What should I … ?", ["exactly one question", "must start with What should I", "must end with a question mark"]],
  ["Write one sentence of advice for a student before an exam.", "should / shouldn't", ["exactly one sentence", "must use should or shouldn't", "must mention the exam"]],
  ["Write one sentence about something children shouldn't eat too much of.", "shouldn't + base verb", ["exactly one sentence", "must use shouldn't", "must name a food"]],
  ["Give two pieces of advice to a friend who has a cold: one with should, one with shouldn't.", "should / shouldn't", ["exactly two sentences", "one should, one shouldn't", "base verb in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Your friend wants to visit your city for three days. Give advice: what should they see, eat and do?",
    "should / shouldn't for advice", ["You should + base verb", "You shouldn't + base verb", "place and food names"]],
  ["A new student is starting at your school. Give them advice for their first week.",
    "should / shouldn't", ["should + base verb", "shouldn't + base verb", "three or more pieces of advice"]],
  ["Your little brother spends all day on his phone. What should he do? Write three or four sentences.",
    "he should / he shouldn't", ["he should", "he shouldn't", "a reason with because"]],
  ["Write a short message asking a friend for advice about a problem, and then write their answer.",
    "Should I … ? and You should …", ["Should I … ? / What should I … ?", "You should …", "a clear problem"]],
  ["What should people do to stay healthy? Write three or four sentences.",
    "should / shouldn't for general advice", ["people should", "people shouldn't", "food, sleep or sport"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.advice.should.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
