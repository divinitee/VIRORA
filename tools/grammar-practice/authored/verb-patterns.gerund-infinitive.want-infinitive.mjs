// Hand-authored: verb-patterns / gerund-infinitive / want-infinitive (A2).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "want + to-infinitive" (My sister wants ______ (be) a nurse).
// Covers the three shapes a learner needs to say what they want:
//   want / wants to + verb, don't / doesn't want to + verb, and
//   want + person + to + verb (My mum wants me to help).
// Distractors are the real errors: the bare verb (want go), -ing (want going),
// to + a wrong form (to going / to goes), and for the person pattern the
// Uzbek/Russian "that"-clause transfer (wants that I help) and the bare or -ing
// verb after the person. "would like" and "need" are never offered: both can be
// right. The subject, the verb under test and want itself are never slotted.
//
// Run: node tools/grammar-practice/authored/verb-patterns.gerund-infinitive.want-infinitive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "gerund-infinitive", topic: "want-infinitive", level: "A2", pv: "2.5" };

const TO = (v) => `After want, use to + the base verb: want to ${v}.`;
const TO_S = (v) => `After wants, use to + the base verb: wants to ${v}. Only want takes the -s, never the second verb.`;
const NEG = (aux, v) => `In the negative, ${aux} want is still followed by to + the base verb: ${aux} want to ${v}.`;
const Q = (v) => `In a question, want is still followed by to + the base verb: want to ${v}.`;
const OBJ = (who, v) => `To say what you want another person to do, use want + person + to + verb: want ${who} to ${v}. English never uses "want that…" here.`;

// four options, key first: to + base, bare base, -ing, and one "to + wrong form"
const o = (base, ing, wrong) => [`to ${base}`, base, ing, wrong];
// person pattern: key, the that-clause transfer, the bare verb, and the subject
// pronoun in place of the object one (wants I to help). "wants me helping" is
// NOT offered: natives do say "I don't want you running around".
const ob = (who, subj, base, thatClause) => [`${who} to ${base}`, thatClause, `${who} ${base}`, `${subj} to ${base}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [o("be", "being", "to being"), TO_S("be"), "My {relative} wants ______ a {job} one day.",
    { relative: ["little sister", "younger brother", "cousin", "best friend"], job: ["teacher", "doctor", "pilot", "programmer"] }],
  [o("buy", "buying", "to buying"), TO("buy"), "I want ______ a new {item} with my {money}.",
    { item: ["phone", "laptop", "bike", "watch"], money: ["birthday money", "first salary", "savings", "prize money"] }],
  [o("visit", "visiting", "to visits"), TO("visit"), "We want ______ {city} in {season}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Shahrisabz"], season: ["spring", "summer", "autumn", "May"] }],
  [o("learn", "learning", "to learning"), TO_S("learn"), "Akmal wants ______ {lang} at a language centre in {city}.",
    { lang: ["Korean", "German", "Turkish", "Chinese"], city: ["Tashkent", "Namangan", "Fergana", "Andijan"] }],
  [ob("me", "I", "help", "that I help"), OBJ("me", "help"), "My mother wants ______ her with the {task} on {day}.",
    { task: ["cooking", "cleaning", "shopping", "washing"], day: ["Saturday", "Sunday", "Friday", "Wednesday"] }],
  [o("go", "going", "to goes"), NEG("doesn't", "go"), "Bobur doesn't want ______ to the {place} today. He feels {state}.",
    { place: ["gym", "party", "market", "cinema"], state: ["tired", "ill", "sleepy", "unwell"] }],
  [o("have", "having", "to having"), Q("have"), "Do you want ______ {food} for dinner tonight, {name}?",
    { food: ["plov", "manti", "soup", "lagman"], name: ["Aziza", "Timur", "Olga", "Sardor"] }],
  [o("open", "opening", "to opened"), TO("open"), "Lola and her sister want ______ a {business} {place}.",
    { business: ["café", "small shop", "bakery", "beauty salon"], place: ["in the city centre", "near the bazaar", "on our street", "next to the university"] }],
  [o("make", "making", "to making"), TO("make"), "My grandparents want ______ {food} {occasion}.",
    { food: ["plov", "samsa", "lagman", "manti"], occasion: ["for the whole family", "for our guests", "for the neighbours", "on Sunday"] }],
  [ob("us", "we", "read", "that we read"), OBJ("us", "read"), "The teacher wants ______ the {text} {how} at home.",
    { text: ["text", "story", "dialogue", "chapter"], how: ["aloud", "carefully", "slowly", "twice"] }],
  [o("play", "playing", "to plays"), Q("play"), "Do your friends want ______ {sport} with us after {event}?",
    { sport: ["football", "volleyball", "basketball", "table tennis"], event: ["school", "lunch", "class", "the lesson"] }],
  [o("leave", "leaving", "to left"), NEG("don't", "leave"), "I don't want ______ my {thing} on the {transport} again.",
    { thing: ["phone", "bag", "umbrella", "keys"], transport: ["bus", "metro", "train", "minibus"] }],
  [o("get", "getting", "to gets"), TO_S("get"), "Malika wants ______ a {pet}, but her {family} say no.",
    { pet: ["cat", "dog", "parrot", "rabbit"], family: ["parents", "grandparents", "mum and dad", "older sisters"] }],
  [ob("us", "we", "run", "that we run"), OBJ("us", "run"), "Our coach wants ______ {where} every day before the {event}.",
    { where: ["in the park", "around the stadium", "by the river", "up the hill"], event: ["match", "final", "race", "tournament"] }],
  [o("sell", "selling", "to selling"), TO_S("sell"), "My dad wants ______ his old {vehicle} {where} and buy a new one.",
    { vehicle: ["car", "bike", "van", "motorbike"], where: ["online", "at the market", "to a neighbour", "to his friend"] }],
  [o("do", "doing", "to doing"), Q("do"), "What do you want ______ after {stage}, {name}?",
    { stage: ["school", "university", "college", "the exams"], name: ["Kamila", "Sardor", "Olga", "Jasur"] }],
  [o("see", "seeing", "to sees"), TO_S("see"), "Olga wants ______ her {relative} in {city} this summer.",
    { relative: ["grandmother", "aunt", "cousins", "uncle"], city: ["Moscow", "Kazan", "Almaty", "Tashkent"] }],
  [o("eat", "eating", "to eats"), NEG("doesn't", "eat"), "My brother doesn't want ______ his {food}. He says it's too {taste}.",
    { food: ["soup", "porridge", "salad", "rice"], taste: ["hot", "salty", "spicy", "cold"] }],
  [ob("him", "he", "study", "that he studies"), OBJ("him", "study"), "Jasur's parents want ______ {subject} {where}.",
    { subject: ["medicine", "law", "economics", "engineering"], where: ["at university", "in Tashkent", "in Korea", "abroad"] }],
  [o("watch", "watching", "to watched"), TO_S("watch"), "Everyone in my class wants ______ the {event} on {day}.",
    { event: ["football match", "concert", "new film", "final"], day: ["Saturday", "Sunday", "Friday", "Tuesday"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the correct form of the verb in brackets.";
const BUILD = [
  ["to become", TO_S("become"), "Nodira wants ______ (become) a {job} after college.",
    { job: ["nurse", "lawyer", "designer", "teacher"] }],
  ["to try", TO("try"), "We want ______ (try) the new {place} in our {area}.",
    { place: ["café", "restaurant", "bakery", "pizza place"], area: ["street", "district", "mahalla", "town"] }],
  ["to rest", NEG("doesn't", "rest"), "My father doesn't want ______ (rest) on {day}. He's happy in the {place}.",
    { day: ["Sunday", "Saturday", "Friday", "his day off"], place: ["garden", "garage", "yard", "shop"] }],
  ["to live", TO("live"), "My cousins want ______ (live) in {city} for {reason}.",
    { city: ["Tashkent", "Samarkand", "Seoul", "Istanbul"], reason: ["work", "university", "a better job", "their studies"] }],
  ["to call", TO_S("call"), "Dilshod wants ______ (call) his {relative} {when}.",
    { relative: ["mother", "grandfather", "uncle", "big sister"], when: ["tonight", "after dinner", "this evening", "on Sunday"] }],
  ["to wear", NEG("don't", "wear"), "I don't want ______ (wear) my {clothes} {when}.",
    { clothes: ["school uniform", "old jacket", "brown coat", "heavy boots"], when: ["today", "this weekend", "tomorrow", "on holiday"] }],
  ["to pass", TO_S("pass"), "Kamola wants ______ (pass) her {exam} in {month}.",
    { exam: ["driving test", "IELTS exam", "maths exam", "entrance exam"], month: ["June", "May", "December", "March"] }],
  ["to stay", Q("stay"), "Do you want ______ (stay) at {place} {when}?",
    { place: ["home", "my house", "your aunt's flat", "the hotel"], when: ["tonight", "this weekend", "on Friday", "after the party"] }],
  ["to start", TO("start"), "My friends and I want ______ (start) a {club} at {place}.",
    { club: ["chess club", "book club", "football team", "music group"], place: ["school", "college", "university", "the youth centre"] }],
  ["to meet", TO_S("meet"), "Our teacher wants ______ (meet) our {who} {when}.",
    { who: ["parents", "families", "mothers", "fathers"], when: ["next week", "on Friday", "after the exams", "before the holidays"] }],
  ["to sit", NEG("don't", "sit"), "The boys don't want ______ (sit) in the {row} row of the {room}.",
    { row: ["front", "back", "first", "last"], room: ["classroom", "bus", "hall", "cinema"] }],
  ["to cook", TO_S("cook"), "Sevara wants ______ (cook) {food} for her {who}.",
    { food: ["plov", "dinner", "manti", "soup"], who: ["guests", "parents", "friends", "grandmother"] }],
  ["to take", Q("take"), "Does your sister want ______ (take) the {transport} {when}?",
    { transport: ["train", "bus", "plane", "night train"], when: ["tomorrow", "on Friday", "next week", "at the weekend"] }],
  ["to answer", TO("answer"), "I want ______ (answer) the {thing} first. It looks {adj}.",
    { thing: ["last question", "second question", "third question", "picture question"], adj: ["easy", "interesting", "simple", "fun"] }],
  ["to clean", OBJ("you", "clean"), "Mum wants you ______ (clean) your {room} {when}.",
    { room: ["room", "desk", "shoes", "wardrobe"], when: ["today", "before dinner", "this morning", "right now"] }],
  ["to drive", OBJ("her", "drive"), "Aziza's father wants her ______ (drive) {how}.",
    { how: ["carefully", "slowly", "more slowly", "very carefully"] }],
  ["to wait", NEG("doesn't", "wait"), "The bus driver doesn't want ______ (wait) for {who} at the {stop}.",
    { who: ["us", "late students", "anyone", "the other passengers"], stop: ["first stop", "bus station", "corner", "last stop"] }],
  ["to win", TO("win"), "The {team} want ______ (win) the {cup} this year.",
    { team: ["players", "girls", "boys", "students"], cup: ["city cup", "school cup", "final", "tournament"] }],
  ["to borrow", Q("borrow"), "Why do you want ______ (borrow) my {thing}, {name}?",
    { thing: ["laptop", "dictionary", "bike", "charger"], name: ["Bobur", "Lola", "Anvar", "Nigora"] }],
  ["to know", TO_S("know"), "Rustam wants ______ (know) the {thing} of the {event}.",
    { thing: ["time", "date", "start time", "finish time"], event: ["concert", "match", "party", "meeting"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NEW_SUBJ = "Rewrite the sentence about the new person. Keep want + to.";
const MAKE_NEG = "Rewrite the sentence in the negative.";
const PERSON = "Rewrite the request with want + person + to + verb.";
const TRANSFORM = [
  // I want to … -> he / she wants to … (5)
  [NEW_SUBJ, "I want to buy {item} for my {who}.", "My sister ______ (buy) {item} for her {who}.", "wants to buy",
    "My sister is one person, so want becomes wants. The second verb stays to + base: to buy.",
    { item: ["flowers", "a present", "a cake", "a card"], who: ["teacher", "mother", "best friend", "grandmother"] }],
  [NEW_SUBJ, "We want to visit {place} on {day}.", "Timur ______ (visit) {place} on {day}.", "wants to visit",
    "Timur is one person, so use wants, then to + base verb: to visit, not to visits.",
    { place: ["the zoo", "the museum", "the old city", "Chorsu Bazaar"], day: ["Saturday", "Sunday", "Friday", "Monday"] }],
  [NEW_SUBJ, "They want to learn {skill} in the {season}.", "Our neighbour ______ (learn) {skill} in the {season}.", "wants to learn",
    "Our neighbour is one person, so use wants + to learn.",
    { skill: ["to swim", "to drive", "English", "to cook"], season: ["summer", "spring", "autumn", "winter"] }],
  [NEW_SUBJ, "I want to finish my {task} before {time}.", "Aziz ______ (finish) his {task} before {time}.", "wants to finish",
    "Aziz is one person, so want becomes wants. Finish stays in the base form after to.",
    { task: ["homework", "project", "report", "essay"], time: ["dinner", "nine", "the weekend", "Friday"] }],
  [NEW_SUBJ, "You want to watch {show} tonight.", "Grandpa ______ (watch) {show} tonight.", "wants to watch",
    "Grandpa is one person, so use wants, then to watch.",
    { show: ["the news", "the football", "a film", "a concert"] }],
  // positive -> negative (5)
  [MAKE_NEG, "Lola wants to live in {city} {when}.", "Lola ______ (live) in {city} {when}.", "doesn't want to live",
    "Lola is one person, so the negative is doesn't want. Want loses its -s after doesn't, and to live stays.",
    { city: ["Tashkent", "Moscow", "another city", "the capital"], when: ["next year", "this year", "after college", "in the summer"] }],
  [MAKE_NEG, "I want to eat {food} {when}.", "I ______ (eat) {food} {when}.", "don't want to eat",
    "With I, the negative is don't want, still followed by to + base verb.",
    { food: ["fast food", "sweets", "meat", "bread"], when: ["today", "this week", "tonight", "for lunch"] }],
  [MAKE_NEG, "My friends want to play {game} {where}.", "My friends ______ (play) {game} {where}.", "don't want to play",
    "My friends is plural, so the negative is don't want + to play.",
    { game: ["chess", "computer games", "cards", "volleyball"], where: ["inside", "in the yard", "at my house", "after school"] }],
  [MAKE_NEG, "Bekzod wants to sit near {who} in {lesson}.", "Bekzod ______ (sit) near {who} in {lesson}.", "doesn't want to sit",
    "Bekzod is one person, so use doesn't want + to sit. Never doesn't wants.",
    { who: ["Anvar", "the window", "the door", "his cousin"], lesson: ["maths", "class", "English", "history"] }],
  [MAKE_NEG, "We want to spend our {money} on {thing}.", "We ______ (spend) our {money} on {thing}.", "don't want to spend",
    "With we, the negative is don't want, then to + base verb: to spend.",
    { money: ["money", "savings", "pocket money", "birthday money"], thing: ["clothes", "games", "snacks", "new phones"] }],
  // imperative -> want + person + to (5)
  [PERSON, "Mum says to me: \"Wash the {thing} {when}, please.\"", "Mum wants ______ (wash) the {thing} {when}.", "me to wash",
    "Mum is talking to me, so use want + me + to + verb. Not \"wants that I wash\".",
    { thing: ["dishes", "car", "windows", "carpet"], when: ["now", "today", "after dinner", "this evening"] }],
  [PERSON, "The doctor says to my grandfather: \"Walk every {time}.\"", "The doctor wants my grandfather ______ (walk) every {time}.", "to walk",
    "After want + person, use to + base verb: wants my grandfather to walk.",
    { time: ["day", "morning", "evening", "afternoon"] }],
  [PERSON, "Our teacher says to us: \"Bring your {thing} {when}.\"", "Our teacher wants ______ (bring) our {thing} {when}.", "us to bring",
    "The teacher is talking to us, so use wants + us + to bring.",
    { thing: ["dictionaries", "notebooks", "photos", "projects"], when: ["tomorrow", "on Monday", "next lesson", "on Friday"] }],
  [PERSON, "Dad says to my brother: \"Turn off the {device} {when}.\"", "Dad wants ______ (turn) off the {device} {when}.", "my brother to turn",
    "Use want + person + to + verb: wants my brother to turn. Not \"wants that my brother turns\".",
    { device: ["TV", "light", "computer", "music"], when: ["now", "at ten", "before bed", "at night"] }],
  [PERSON, "I say to you: \"Help me with my {task} on {day}.\"", "I want ______ (help) me with my {task} on {day}.", "you to help",
    "Use want + you + to + verb: I want you to help me.",
    { task: ["project", "homework", "presentation", "party"], day: ["Saturday", "Sunday", "Friday", "Thursday"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
  // "Dad says to my brother" -> "him to turn" is just as right
  ...(key === "my brother to turn" ? { acceptable: ["him to turn"] } : {}),
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a job you want to do in the future.", "want to + base verb", ["exactly one sentence", "must use I want to", "must name a job"]],
  ["Write one sentence about a place you want to visit and say when.", "want to visit", ["exactly one sentence", "must name a place", "must include a time"]],
  ["Write one sentence about something you don't want to do this weekend.", "don't want to + base verb", ["exactly one sentence", "must use don't want to", "must include this weekend"]],
  ["Write one sentence about something a family member wants to do.", "wants to + base verb", ["exactly one sentence", "must name a family member", "must use wants to"]],
  ["Write one sentence about something your parents or teacher want you to do.", "want + me + to + base verb", ["exactly one sentence", "must use want(s) me to", "must not use that after want"]],
  ["Write a question to ask a friend what they want to do after school.", "Do you want to … ? or What do you want to … ?", ["exactly one question", "must end with a question mark", "must use want to"]],
  ["Write one sentence about a skill you want to learn this year.", "want to learn", ["exactly one sentence", "must name a skill", "must include this year"]],
  ["Write two sentences: one thing you want to buy, and one thing you don't want to buy.", "want to buy and don't want to buy", ["exactly two sentences", "one positive, one negative", "must use to buy in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Talk about your plans for the next five years. What do you want to do, and what don't you want to do? Write three or four sentences.",
    "want to / don't want to + base verb", ["want to + base verb", "don't want to + base verb", "no bare verb or -ing after want"]],
  ["Your friend asks: \"What do you want to do this weekend?\" Answer and give reasons. Write three or four sentences.",
    "want to + base verb for plans", ["want to + base verb", "a reason with because", "a time like this weekend or on Saturday"]],
  ["What do your parents want you to do in the future? Do you want the same thing? Write three or four sentences.",
    "want + person + to + base verb", ["want(s) me to + base verb", "I want to / I don't want to", "no want that…"]],
  ["Describe a trip you want to take. Where do you want to go and what do you want to see there? Write three or four sentences.",
    "want to + base verb", ["want to go / visit / see", "a place name", "two or more different verbs after want to"]],
  ["Write a short message to a friend inviting them to do something with you. Say what you want to do and what you want them to bring.",
    "want to + verb and want + you + to + verb", ["want to + base verb", "want you to + base verb", "a day or time"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.gerund-infinitive.want-infinitive.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
