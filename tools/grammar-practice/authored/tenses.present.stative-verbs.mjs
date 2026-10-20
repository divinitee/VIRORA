// Hand-authored: tenses / present / stative-verbs (A2).
//
// Tests ONE point: state verbs (like, know, want, belong, cost...) take the
// present simple even when the situation is happening now. Verbs with a
// common dynamic use (think, have, see, taste, weigh, hear) are left out, so
// "-ing" is never a second right answer. The subject and the verb are never
// slotted.
//
// Distractors: be + -ing (the main error), the wrong agreement form, and
// either the present perfect or "am agree" (a direct Russian/Uzbek transfer).
//
// Run: node tools/grammar-practice/authored/tenses.present.stative-verbs.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "present", topic: "stative-verbs", level: "A2", pv: "2.5" };

const STATE = (v) => `${v[0].toUpperCase() + v.slice(1)} is a state verb, so it takes the present simple, even about now. Never use it with -ing.`;
const SG = (subj, f) => `${subj} is singular: ${f}.`;
const PL = (subj, f) => `With ${subj}, use the base form: ${f}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [verb, subject note, options (key first), prompt, slots]
const CHOOSE = [
  ["like", PL("I", "like"), ["like", "am liking", "likes", "have liked"], "I ______ this {place}. The {food} here is excellent.",
    { place: ["café", "restaurant", "teahouse", "canteen"], food: ["plov", "soup", "bread", "salad"] }],
  ["love", SG("Nodira", "loves"), ["loves", "is loving", "love", "loving"], "Nodira ______ her new {thing} from her {person}. She uses it every day.",
    { thing: ["phone", "bag", "watch", "laptop"], person: ["parents", "aunt", "brother", "grandmother"] }],
  ["hate", SG("My grandfather", "hates"), ["hates", "is hating", "hate", "has hated"], "Turn off the {thing}, please. My grandfather ______ loud {sound}.",
    { thing: ["music", "TV", "radio", "speaker"], sound: ["music", "noise", "songs", "sounds"] }],
  ["want", PL("they", "want"), ["want", "are wanting", "wants", "have wanted"], "The children ______ {food} now. They are hungry after {activity}.",
    { food: ["some bread", "ice cream", "something to eat", "a snack"], activity: ["football", "school", "the trip", "swimming"] }],
  ["need", PL("I", "need"), ["need", "am needing", "needs", "have needed"], "I ______ a new {thing} at the moment. My old one is {state}.",
    { thing: ["phone", "laptop", "tablet", "computer"], state: ["broken", "too slow", "very old", "not working"] }],
  ["know", SG("Malika", "knows"), ["knows", "is knowing", "know", "has known"], "Ask Malika. She ______ the answer to question {num} in the {subject} homework.",
    { num: ["3", "5", "7", "10"], subject: ["maths", "physics", "English", "chemistry"] }],
  ["understand", PL("we", "understand"), ["understand", "are understanding", "understands", "understanding"], "Thank you, teacher. Now we ______ the {topic} in {unit}.",
    { topic: ["rule", "new words", "example", "exercise"], unit: ["unit 4", "lesson 6", "chapter 2", "part B"] }],
  ["believe", SG("Sardor", "believes"), ["believes", "is believing", "believe", "believing"], "Sardor ______ his {person}'s story about the {thing}.",
    { person: ["friend", "brother", "cousin", "teacher"], thing: ["lost phone", "big fish", "old house", "trip"] }],
  ["remember", PL("I", "remember"), ["remember", "am remembering", "remembers", "remembering"], "Oh yes! I ______ your {thing}. We met at the {event}.",
    { thing: ["face", "name", "sister", "voice"], event: ["wedding", "party", "conference", "birthday party"] }],
  ["prefer", SG("Dilnoza", "prefers"), ["prefers", "is preferring", "prefer", "preferring"], "Dilnoza ______ {drink} to coffee, so we always order it at the {place}.",
    { drink: ["tea", "green tea", "juice", "hot chocolate"], place: ["café", "teahouse", "restaurant", "canteen"] }],
  ["belong", SG("The subject", "belongs"), ["belongs", "is belonging", "belong", "belonging"], "This {thing} ______ to my {person}. Please give it back.",
    { thing: ["bag", "phone", "book", "jacket"], person: ["sister", "teacher", "friend", "brother"] }],
  ["own", SG("My uncle", "owns"), ["owns", "is owning", "own", "owning"], "My uncle ______ two {things} in {city} now.",
    { things: ["shops", "cafés", "flats", "cars"], city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  ["seem", SG("The subject", "seems"), ["seems", "is seeming", "seem", "seeming"], "Your {person} ______ very {state} today. Is everything OK?",
    { person: ["brother", "sister", "friend", "mother"], state: ["tired", "sad", "quiet", "worried"] }],
  ["mean", SG("The subject", "means"), ["means", "is meaning", "mean", "meaning"], "This {sign} ______ 'no {thing}'.",
    { sign: ["sign", "symbol", "red sign", "picture"], thing: ["parking", "phones", "food", "photos"] }],
  ["cost", PL("these", "cost"), ["cost", "are costing", "costs", "costing"], "These {things} ______ fifty thousand som at the {place}.",
    { things: ["shoes", "jeans", "books", "headphones"], place: ["bazaar", "market", "mall", "shop"] }],
  ["contain", SG("The subject", "contains"), ["contains", "is containing", "contain", "containing"], "This {food} ______ a lot of sugar, so don't give it to my {person}.",
    { food: ["cake", "juice", "drink", "yoghurt"], person: ["grandfather", "little brother", "baby", "grandmother"] }],
  ["agree", PL("I", "agree. Never say I am agree"), ["agree", "am agreeing", "am agree", "agrees"], "I ______ with you about the {topic} for our {event}.",
    { topic: ["plan", "date", "place", "menu"], event: ["trip", "party", "project", "class picnic"] }],
  ["depend", PL("plans", "depend"), ["depend", "are depending", "depends", "depending"], "Our plans for {day} ______ on the {thing}.",
    { day: ["Saturday", "the weekend", "tomorrow", "Sunday"], thing: ["weather", "bus times", "money", "exam results"] }],
  ["deserve", SG("Jasur", "deserves"), ["deserves", "is deserving", "deserve", "deserving"], "Jasur worked hard on his {work}. He ______ a {thing}.",
    { work: ["project", "studies", "exams", "job"], thing: ["prize", "holiday", "break", "good mark"] }],
  ["smell", SG("The subject", "smells"), ["smells", "is smelling", "smell", "smelling"], "This {food} ______ delicious. Can I have some {extra}?",
    { food: ["soup", "plov", "bread", "cake"], extra: ["more", "now", "too", "later"] }],
].map(([verb, note, options, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: `${STATE(verb)} ${note}`, slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the correct present form of the verb in brackets. These are state verbs.";
const BUILD = [
  ["know", "know", PL("I", "know"), "I ______ (know) the way to the {place}, so I can take you there by {transport}.",
    { place: ["station", "museum", "bazaar", "hospital"], transport: ["car", "bus", "taxi", "metro"] }],
  ["want", "wants", SG("Kamila", "wants"), "Kamila ______ (want) {drink} right now because she is {state}.",
    { drink: ["a glass of water", "a cup of tea", "a cold drink", "some juice"], state: ["thirsty", "tired", "hot", "sleepy"] }],
  ["like", "likes", SG("My little brother", "likes"), "My little brother ______ (like) his new {thing} from {person}.",
    { thing: ["bike", "toy car", "ball", "book"], person: ["Grandma", "our uncle", "his teacher", "Dad"] }],
  ["need", "need", PL("we", "need"), "We ______ (need) more {thing} for the {event} tonight.",
    { thing: ["chairs", "cups", "plates", "bread"], event: ["party", "dinner", "guests", "family meal"] }],
  ["understand", "understands", SG("Bekzod", "understands"), "Bekzod ______ (understand) the {thing} now because the teacher explained it in {lang}.",
    { thing: ["rule", "task", "question", "text"], lang: ["Uzbek", "Russian", "simple English", "small steps"] }],
  ["belong", "belong", PL("these", "belong"), "These {things} ______ (belong) to the {who}.",
    { things: ["books", "chairs", "balls", "computers"], who: ["school", "library", "club", "sports team"] }],
  ["love", "loves", SG("My grandmother", "loves"), "My grandmother ______ (love) the {thing} in her {place}.",
    { thing: ["flowers", "roses", "trees", "birds"], place: ["garden", "yard", "village", "balcony"] }],
  ["hate", "hates", SG("Our cat", "hates"), "Our cat ______ (hate) the {sound} of the {machine}.",
    { sound: ["noise", "sound", "loud noise", "buzz"], machine: ["vacuum cleaner", "hair dryer", "washing machine", "mixer"] }],
  ["believe", "believe", PL("I", "believe"), "I ______ (believe) you. Your story about the {thing} at the {place} is true.",
    { thing: ["lost dog", "big fish", "old coin", "strange noise"], place: ["lake", "river", "beach", "market"] }],
  ["remember", "remembers", SG("My father", "remembers"), "My father still ______ (remember) his first {thing} in {city}.",
    { thing: ["job", "car", "flat", "school"], city: ["Tashkent", "Samarkand", "Andijan", "Moscow"] }],
  ["prefer", "prefer", PL("most students", "prefer"), "Most students in our {group} ______ (prefer) {sport} to running.",
    { group: ["class", "group", "college", "school"], sport: ["football", "basketball", "swimming", "tennis"] }],
  ["own", "owns", SG("Our neighbour", "owns"), "Our neighbour ______ (own) a small {shop} near the {place}.",
    { shop: ["bakery", "café", "shop", "kiosk"], place: ["metro", "bazaar", "park", "school"] }],
  ["seem", "seems", SG("The subject", "seems"), "The new {person} ______ (seem) very {state}.",
    { person: ["teacher", "student", "neighbour", "doctor"], state: ["kind", "friendly", "nice", "smart"] }],
  ["cost", "costs", SG("The subject", "costs"), "This {thing} ______ (cost) too much. Let's look at the {other}.",
    { thing: ["jacket", "phone", "bag", "watch"], other: ["cheaper ones", "other shop", "market", "next shop"] }],
  ["contain", "contains", SG("The subject", "contains"), "This {box} ______ (contain) old {things} from my grandfather.",
    { box: ["box", "bag", "suitcase", "drawer"], things: ["photos", "letters", "coins", "books"] }],
  ["mean", "means", SG("The red light", "means"), "The red light ______ (mean) stop, so the {who} must wait at the {place}.",
    { who: ["cars", "drivers", "people", "children"], place: ["corner", "crossing", "lights", "road"] }],
  ["agree", "agree", PL("my parents", "agree"), "My parents ______ (agree) with my plan to study in {city} with my {person}.",
    { city: ["Tashkent", "Seoul", "Istanbul", "Moscow"], person: ["cousin", "friend", "brother", "sister"] }],
  ["depend", "depends", SG("The price", "depends"), "The price ______ (depend) on the {thing} of the {item}.",
    { thing: ["size", "colour", "age", "weight"], item: ["room", "car", "phone", "bag"] }],
  ["deserve", "deserve", PL("you", "deserve"), "You ______ (deserve) a {thing} after all that {work}.",
    { thing: ["rest", "holiday", "break", "good dinner"], work: ["study", "work", "training", "cleaning"] }],
  ["fit", "fit", PL("these", "fit"), "These {things} from the {place} ______ (fit) me perfectly.",
    { things: ["shoes", "jeans", "boots", "trainers"], place: ["market", "mall", "bazaar", "shop"] }],
].map(([verb, key, note, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: `${STATE(verb)} ${note}`, slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "This sentence has a mistake: a state verb with -ing. Rewrite it correctly.";
const NEW_SUBJ = "Rewrite the sentence with the new subject.";
const STATE_VERB = "Say the same idea with the state verb in brackets.";
const TRANSFORM = [
  // fix the -ing mistake (5)
  [FIX, "I am knowing the answer to question {num} in the {subject} test.", "I ______ (know) the answer to question {num} in the {subject} test.", "know",
    "Know is a state verb, so use the present simple: I know.",
    { num: ["2", "4", "6", "9"], subject: ["maths", "history", "English", "biology"] }],
  [FIX, "Aziza is wanting a new {thing} for her {event}.", "Aziza ______ (want) a new {thing} for her {event}.", "wants",
    "Want is a state verb, so use the present simple: Aziza wants.",
    { thing: ["dress", "phone", "bag", "watch"], event: ["birthday", "graduation", "trip", "new job"] }],
  [FIX, "We are needing more {thing} in the {room}.", "We ______ (need) more {thing} in the {room}.", "need",
    "Need is a state verb, so use the present simple: we need.",
    { thing: ["chairs", "light", "space", "tables"], room: ["classroom", "kitchen", "office", "hall"] }],
  [FIX, "This {thing} is belonging to my {person}.", "This {thing} ______ (belong) to my {person}.", "belongs",
    "Belong is a state verb, so use the present simple: belongs.",
    { thing: ["umbrella", "pen", "scarf", "notebook"], person: ["cousin", "uncle", "neighbour", "classmate"] }],
  [FIX, "My brother is understanding the {topic} now after his {who} helped him.", "My brother ______ (understand) the {topic} now after his {who} helped him.", "understands",
    "Understand is a state verb, so use the present simple: understands.",
    { topic: ["homework", "rule", "maths problem", "text"], who: ["teacher", "friend", "sister", "tutor"] }],
  // new subject (5)
  [NEW_SUBJ, "I like the new {place} near our {building}.", "My father ______ (like) the new {place} near our {building}.", "likes",
    "My father is singular, so like becomes likes. It stays in the present simple.",
    { place: ["park", "café", "library", "gym"], building: ["house", "school", "office", "flat"] }],
  [NEW_SUBJ, "My friends own a small {shop} in {city}.", "My friend ______ (own) a small {shop} in {city}.", "owns",
    "My friend is singular, so own becomes owns.",
    { shop: ["bakery", "café", "shop", "garage"], city: ["Namangan", "Fergana", "Karshi", "Jizzakh"] }],
  [NEW_SUBJ, "They prefer {drink} in the {time}.", "Our teacher ______ (prefer) {drink} in the {time}.", "prefers",
    "Our teacher is singular, so prefer becomes prefers.",
    { drink: ["tea", "coffee", "water", "juice"], time: ["morning", "evening", "afternoon", "winter"] }],
  [NEW_SUBJ, "You seem {state} after your {event}.", "Your sister ______ (seem) {state} after her {event}.", "seems",
    "Your sister is singular, so seem becomes seems.",
    { state: ["tired", "happy", "quiet", "busy"], event: ["exam", "trip", "lesson", "match"] }],
  [NEW_SUBJ, "These shoes cost {price} at the {place}.", "This jacket ______ (cost) {price} at the {place}.", "costs",
    "This jacket is singular, so cost becomes costs.",
    { price: ["200,000 som", "300,000 som", "a lot", "too much"], place: ["bazaar", "mall", "market", "shop"] }],
  // action -> state verb (5)
  [STATE_VERB, "I am enjoying this {food} from the {place}.", "I ______ (like) this {food} from the {place}.", "like",
    "Like is a state verb, so use the present simple: I like.",
    { food: ["plov", "samsa", "bread", "soup"], place: ["bazaar", "café", "market", "teahouse"] }],
  [STATE_VERB, "Look, Madina is smiling at her new {thing}.", "Madina ______ (love) her new {thing} from her {person}.", "loves",
    "Love is a state verb, so use the present simple: Madina loves.",
    { thing: ["phone", "bike", "jacket", "headphones"], person: ["parents", "uncle", "aunt", "grandparents"] }],
  [STATE_VERB, "The baby is crying because of the {sound} from the {place}.", "The baby ______ (hate) the {sound} from the {place}.", "hates",
    "Hate is a state verb, so use the present simple: the baby hates.",
    { sound: ["noise", "music", "loud noise", "sound"], place: ["street", "yard", "flat next door", "building site"] }],
  [STATE_VERB, "I am thinking about my old school in {city} a lot.", "I ______ (remember) my old school in {city} very well, especially my {person}.", "remember",
    "Remember is a state verb, so use the present simple: I remember.",
    { city: ["Andijan", "Fergana", "Samarkand", "Urgench"], person: ["teachers", "friends", "classmates", "first teacher"] }],
  [STATE_VERB, "Everyone is nodding at your idea about the {thing}.", "Everyone ______ (agree) with your idea about the {thing} for the {event}.", "agrees",
    "Agree is a state verb, so use the present simple. Everyone is singular: agrees.",
    { thing: ["plan", "date", "place", "music"], event: ["trip", "party", "concert", "picnic"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you want right now.", "I want (not I am wanting)",
    ["exactly one sentence", "must include right now", "must use want"]],
  ["Write one sentence about a food you like and why.", "like or likes in the present simple",
    ["exactly one sentence", "must use because", "no -ing with like"]],
  ["Write one sentence about something that belongs to a family member.", "belongs to",
    ["exactly one sentence", "must name a family member", "must use belong"]],
  ["Write one sentence about something you need for school or work this week.", "need in the present simple",
    ["exactly one sentence", "must include this week", "no -ing with need"]],
  ["Write one sentence about a person you know well and what they know about you.", "knows or know",
    ["exactly one sentence", "must use know", "present simple only"]],
  ["Write one sentence saying how much something costs in your town.", "costs or cost",
    ["exactly one sentence", "must include a price", "must use cost"]],
  ["Write one sentence agreeing with a friend's idea.", "I agree (not I am agree)",
    ["exactly one sentence", "must use agree", "must say what the idea is"]],
  ["Write two sentences: one with something you are doing now, and one with a state verb about how you feel about it.", "present continuous for the action, present simple for the state verb",
    ["exactly two sentences", "first sentence present continuous", "second sentence with like, love, hate or want"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your favourite place in your town: what you like about it and what you don't like. Write three or four sentences.",
    "state verbs in the present simple", ["like, love or hate without -ing", "present simple", "because to give reasons"]],
  ["You are in a shop. Write what you want, what you need and how much things cost. Write three or four sentences.",
    "want, need and cost in the present simple", ["no -ing with want, need or cost", "-s with singular subjects", "prices or amounts"]],
  ["Describe a friend: what they like, what they know a lot about and what they want in the future. Write three or four sentences.",
    "state verbs with he or she", ["likes, knows, wants with -s", "no is + -ing with state verbs", "present simple"]],
  ["Write a short message to a teacher saying what you understand and what you don't understand in the lesson. Write three or four sentences.",
    "understand and know in the present simple", ["I understand / I don't understand", "no am understanding", "a clear question"]],
  ["Describe what you are doing right now and how you feel about it. Write three or four sentences.",
    "present continuous for actions, present simple for state verbs", ["am + -ing for actions", "like, want or need in the present simple", "right now or at the moment"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.present.stative-verbs.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);