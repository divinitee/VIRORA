// Hand-authored: sentence-structure / word-order / svo-basic (A1).
// Path fill P2 (2026-11-14, Base44 AI, branch grammar-path-fill-base44).
//
// Placement focus: subject + verb + object (apples / likes / my sister ->
// my sister likes apples). The placement item is a word-order item; this
// course does not use word_order, so:
//   choose  = four orders of the same three parts; only S + V + O is English.
//             Distractors: S + O + V (the Uzbek order), V + S + O and V + O + S.
//             Never O + S + V ("Tomatoes Grandpa grows" can be a topicalised
//             or noun-phrase reading) and never a swapped subject/object
//             ("The piano plays Aziz" is grammatical nonsense, not an error).
//   build   = 10 items type all three parts in order from a scrambled list,
//             10 items place the subject and object around a printed verb.
//   transform = 5 fix S-O-V / 5 fix verb-first or object-first / 5 notes ->
//             sentence (plural or I subjects, so no third-person -s drift).
// Place and time stay fixed at the end of every sentence (place-time-order is
// P28) and there is never a second object (double-object is P52).
//
// Run: node tools/grammar-practice/authored/sentence-structure.word-order.svo-basic.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "word-order", topic: "svo-basic", level: "A1", pv: "2.5" };

const cap = (s) => s[0].toUpperCase() + s.slice(1);
// S V O / S O V / V S O / V O S
const ORD = (s, v, o) => [`${cap(s)} ${v} ${o}`, `${cap(s)} ${o} ${v}`, `${cap(v)} ${s} ${o}`, `${cap(v)} ${o} ${s}`];
const OW = (s, v, o) => `English order is subject + verb + object: ${s} (who) + ${v} (the action) + ${o} (what). The verb never goes at the end.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [["Grandpa", "grows", "tomatoes"], "______ in the {place} every {time}.",
    { place: ["garden", "village", "yard", "greenhouse"], time: ["summer", "spring", "year", "autumn"] }],
  [["my sister", "drinks", "green tea"], "______ after {meal} with {who}.",
    { meal: ["lunch", "dinner", "breakfast", "plov"], who: ["Grandma", "Mum", "her friends", "us"] }],
  [["we", "watch", "films"], "______ at {place} on {day}.",
    { place: ["home", "Aziz's house", "the cinema", "my cousin's flat"], day: ["Fridays", "Saturdays", "Sundays", "holidays"] }],
  [["Aziz", "plays", "the piano"], "______ at {place} every {day}.",
    { place: ["home", "school", "music school", "his uncle's house"], day: ["day", "evening", "Monday", "Thursday"] }],
  [["I", "like", "apples"], "______ very much, but my {who} prefers {fruit}.",
    { who: ["brother", "sister", "dad", "cousin"], fruit: ["pears", "grapes", "melons", "peaches"] }],
  [["my mum", "cooks", "plov"], "______ for the {who} on {day}.",
    { who: ["whole family", "guests", "neighbours", "cousins"], day: ["Sundays", "Fridays", "holidays", "birthdays"] }],
  [["the students", "borrow", "books"], "______ from the {place} {when}.",
    { place: ["library", "school library", "teacher", "reading room"], when: ["after lessons", "every afternoon", "on Tuesdays", "in the morning"] }],
  [["Dad", "drives", "a taxi"], "______ in {city} {when}.",
    { city: ["Tashkent", "Samarkand", "Namangan", "Fergana"], when: ["at night", "every day", "six days a week", "in the evenings"] }],
  [["Kamila", "speaks", "Russian"], "______ at {place} with her {who}.",
    { place: ["home", "work", "school", "the market"], who: ["grandmother", "friends", "mother", "neighbours"] }],
  [["my friends", "love", "football"], "______, so they go to the {place} {when}.",
    { place: ["stadium", "park", "sports centre", "football field"], when: ["every evening", "after school", "on Saturdays", "every weekend"] }],
  [["Lola", "writes", "stories"], "______ in her {book} {when}.",
    { book: ["notebook", "diary", "blue notebook", "old notebook"], when: ["at night", "every evening", "on Sundays", "after school"] }],
  [["the baby", "wants", "milk"], "______ {when}. Please give him a {cup}.",
    { when: ["again", "right now", "every two hours", "at night"], cup: ["bottle", "cup", "small cup", "warm bottle"] }],
  [["my brother", "has", "a new bike"], "______, and he rides it to {place} {when}.",
    { place: ["school", "the park", "the shop", "his friend's house"], when: ["every day", "after lunch", "on Sundays", "in the morning"] }],
  [["our teacher", "gives", "homework"], "______ {when}, but it is {adj}.",
    { when: ["every lesson", "every day", "on Fridays", "twice a week"], adj: ["short", "easy", "interesting", "not difficult"] }],
  [["Aziz", "needs", "a pen"], "______. Can you give him {one}, {name}?",
    { one: ["one", "yours", "a blue one", "a black one"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [["Timur", "sells", "phones"], "______ at the {place} in {city}.",
    { place: ["market", "small shop", "big shop", "mall"], city: ["Andijan", "Bukhara", "Karshi", "Termez"] }],
  [["my grandparents", "keep", "three cows"], "______ in their {place} near {city}.",
    { place: ["village", "yard", "farm", "garden"], city: ["Samarkand", "Jizzakh", "Gulistan", "Kokand"] }],
  [["tourists", "love", "Samarkand"], "______ because of its {thing}, and many come in {season}.",
    { thing: ["old buildings", "blue domes", "history", "markets"], season: ["spring", "autumn", "May", "September"] }],
  [["we", "need", "water"], "______ for the trip to {place}. Let's buy {amount}.",
    { place: ["the mountains", "Chimgan", "the lake", "the desert"], amount: ["five bottles", "a big bottle", "some bottles", "three bottles"] }],
  [["Madina", "teaches", "English"], "______ at a {place} in {city}.",
    { place: ["school", "language centre", "college", "university"], city: ["Tashkent", "Nukus", "Urgench", "Navoi"] }],
].map(([[s, v, o], prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: ORD(s, v, o), key: 0, why: OW(s, v, o), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
// X: all three parts, scrambled in instr. Y: subject and object around a printed verb.
const X = (parts, scrambled, source, slots) => ({
  instr: `Put the words in order (subject + verb + object): ${scrambled}.`, source, key: parts,
  why: `Subject first (${parts[0]}), then the verb (${parts[1]}), then the object (${parts[2]}).`, slots,
});
const Y = (parts, verb, scrambled, source, slots) => ({
  instr: `Put these words in the right gaps: ${scrambled}.`, source, key: parts,
  why: `${cap(parts[0])} does the action, so it goes before ${verb}. ${cap(parts[1])} is what ${parts[0]} ${verb}, so it goes after the verb.`, slots,
});
const BUILD = [
  X(["Aziz", "drinks", "milk"], "milk / drinks / Aziz", "______ ______ ______ with {food} every {when}.",
    { food: ["bread", "honey", "cookies", "biscuits"], when: ["morning", "evening", "day", "night"] }),
  X(["My mother", "makes", "bread"], "bread / makes / my mother", "______ ______ ______ on {day} in a {oven}.",
    { oven: ["tandoor", "big oven", "clay oven", "small oven"], day: ["Fridays", "Sundays", "Mondays", "holidays"] }),
  X(["We", "visit", "our grandparents"], "our grandparents / we / visit", "______ ______ ______ in {place} every {when}.",
    { place: ["the village", "Khiva", "Nukus", "Kokand"], when: ["summer", "Sunday", "month", "holiday"] }),
  X(["Children", "eat", "ice cream"], "ice cream / children / eat", "______ ______ ______ in the {place} when it is {weather}.",
    { place: ["park", "yard", "garden", "street"], weather: ["hot", "sunny", "very warm", "nice"] }),
  X(["I", "love", "music"], "music / love / I", "______ ______ ______, especially {genre} from {country}.",
    { genre: ["pop songs", "folk songs", "piano music", "film songs"], country: ["Uzbekistan", "Korea", "Turkey", "India"] }),
  X(["My uncle", "repairs", "cars"], "cars / repairs / my uncle", "______ ______ ______ at his {place} in {city}.",
    { place: ["garage", "workshop", "small garage", "service station"], city: ["Fergana", "Andijan", "Termez", "Chirchiq"] }),
  X(["Students", "wear", "uniforms"], "uniforms / wear / students", "At our {school}, ______ ______ ______ {when}.",
    { school: ["school", "college", "lyceum", "academy"], when: ["every day", "on weekdays", "from Monday to Friday", "all year"] }),
  X(["Lola", "studies", "English"], "English / studies / Lola", "______ ______ ______ at a {place} {when}.",
    { place: ["language centre", "learning centre", "college", "club"], when: ["after school", "three times a week", "every evening", "on Saturdays"] }),
  X(["This shop", "sells", "fresh bread"], "fresh bread / this shop / sells", "______ ______ ______ and {other} near our {place}.",
    { other: ["cakes", "milk", "eggs", "cheese"], place: ["bus stop", "school", "flat", "park"] }),
  X(["My grandmother", "grows", "flowers"], "flowers / grows / my grandmother", "______ ______ ______ in front of her {house} in {city}.",
    { house: ["house", "door", "window", "gate"], city: ["Bukhara", "Margilan", "Samarkand", "Karshi"] }),
  Y(["my sister", "apples"], "likes", "apples / my sister", "______ likes ______ and {fruit} from the {place}.",
    { fruit: ["pears", "grapes", "melons", "peaches"], place: ["market", "garden", "village", "shop"] }),
  Y(["my brother", "the guitar"], "plays", "the guitar / my brother", "______ plays ______ in a {band} {when}.",
    { band: ["band", "school band", "music club", "small group"], when: ["on Fridays", "every weekend", "after school", "in the evening"] }),
  Y(["Grandpa", "a new car"], "wants", "a new car / Grandpa", "______ wants ______ for his {trips} to {place}.",
    { trips: ["trips", "long trips", "weekend trips", "visits"], place: ["the village", "Samarkand", "the mountains", "Bukhara"] }),
  Y(["Dad", "the newspaper"], "reads", "the newspaper / Dad", "______ reads ______ {when} with a cup of {drink}.",
    { when: ["every morning", "after breakfast", "on Sundays", "after work"], drink: ["tea", "coffee", "green tea", "black tea"] }),
  Y(["Malika", "the house"], "cleans", "the house / Malika", "______ cleans ______ on {day} and cooks {food}.",
    { day: ["Saturdays", "Fridays", "Sundays", "Thursdays"], food: ["plov", "soup", "lagman", "manti"] }),
  Y(["students", "their homework"], "do", "their homework / students", "______ do ______ in the {place} after {time}.",
    { place: ["library", "classroom", "reading room", "study room"], time: ["lunch", "lessons", "school", "the break"] }),
  Y(["my aunt", "a small shop"], "has", "a small shop / my aunt", "______ has ______ near the {place} in {city}.",
    { place: ["market", "station", "school", "park"], city: ["Namangan", "Nukus", "Khiva", "Gulistan"] }),
  Y(["Jasur", "the bus"], "takes", "the bus / Jasur", "______ takes ______ to {place} {when}.",
    { place: ["school", "work", "college", "town"], when: ["every morning", "every day", "on weekdays", "at seven"] }),
  Y(["Sardor", "photos"], "posts", "photos / Sardor", "______ posts ______ of {thing} every {when}.",
    { thing: ["his cat", "the mountains", "food", "old buildings"], when: ["day", "week", "evening", "weekend"] }),
  Y(["Grandma", "Russian"], "speaks", "Russian / Grandma", "______ speaks ______ with her {who} at {place}.",
    { who: ["sisters", "friends", "neighbours", "old friends"], place: ["home", "the market", "family dinners", "parties"] }),
].map((it) => ({ ...BASE, stage: "build", format: "gap_fill", ...it }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the word order: subject + verb + object.";
const NOTE = "Make a sentence from the notes: subject + verb + object.";
const VE = (v) => `The verb ${v} goes straight after the subject, not at the end.`;
const VF = (s) => `An English sentence starts with the subject (${s}), then the verb, then the object.`;
const NW = (s, v, o) => `Who? ${s}. Action? ${v}. What? ${o}. Put them in that order.`;
const TRANSFORM = [
  // verb at the end (S O V) -> S V O (5)
  [COR, ["plays", "football"], "My brother football plays every {day} in the {place}.", "My brother ______ ______ every {day} in the {place}.",
    VE("plays"), { day: ["Sunday", "evening", "weekend", "afternoon"], place: ["park", "yard", "stadium", "school yard"] }],
  [COR, ["likes", "tea"], "Kamila tea likes with {food}, but her {who} doesn't.", "Kamila ______ ______ with {food}, but her {who} doesn't.",
    VE("likes"), { food: ["lemon", "honey", "milk", "sugar"], who: ["brother", "mum", "dad", "sister"] }],
  [COR, ["do", "my homework"], "I my homework do after {meal} in the {room}.", "I ______ ______ after {meal} in the {room}.",
    VE("do"), { meal: ["dinner", "lunch", "school", "lessons"], room: ["kitchen", "living room", "bedroom", "library"] }],
  [COR, ["buy", "bread"], "We bread buy at the {place} near our {home}.", "We ______ ______ at the {place} near our {home}.",
    VE("buy"), { place: ["bakery", "market", "small shop", "corner shop"], home: ["house", "flat", "school", "building"] }],
  [COR, ["washes", "the dishes"], "Aziz the dishes washes for his {who} when she is {state}.", "Aziz ______ ______ for his {who} when she is {state}.",
    VE("washes"), { who: ["mum", "grandmother", "aunt", "sister"], state: ["tired", "busy", "ill", "at work"] }],
  // verb first or object first -> S V O (5)
  [COR, ["My father", "speaks"], "Speaks my father Russian at {place} with his {who}.", "______ ______ Russian at {place} with his {who}.",
    VF("my father"), { place: ["work", "the office", "meetings", "the factory"], who: ["colleagues", "friends", "boss", "clients"] }],
  [COR, ["My grandmother", "grows"], "Grows vegetables my grandmother in her {place} in {city}.", "______ ______ vegetables in her {place} in {city}.",
    VF("my grandmother"), { place: ["garden", "yard", "village", "small garden"], city: ["Fergana", "Bukhara", "Navoi", "Jizzakh"] }],
  [COR, ["sells", "fresh bread"], "Fresh bread sells the baker to {who} on {street}.", "The baker ______ ______ to {who} on {street}.",
    "The baker does the action, so the baker comes first, then sells, then fresh bread.", { who: ["everyone", "the neighbours", "tourists", "students"], street: ["our street", "Navoi Street", "the corner", "the main street"] }],
  [COR, ["My friends", "like"], "Like my friends {games}, and they play them {when}.", "______ ______ {games}, and they play them {when}.",
    VF("my friends"), { games: ["computer games", "board games", "card games", "quiz games"], when: ["every evening", "on Fridays", "after school", "every day"] }],
  [COR, ["teaches", "English"], "Teaches English our teacher at {place} in {city}.", "Our teacher ______ ______ at {place} in {city}.",
    "Our teacher does the action, so start with our teacher, then teaches, then English.", { place: ["two schools", "a college", "our school", "a language centre"], city: ["Tashkent", "Samarkand", "Andijan", "Kokand"] }],
  // notes -> S V O sentence (5)
  [NOTE, ["grow", "apricots"], "Notes: apricots / my parents / grow / in the {place} near {city}.", "My parents ______ ______ in the {place} near {city}.",
    NW("my parents", "grow", "apricots"), { place: ["garden", "village", "yard", "orchard"], city: ["Samarkand", "Fergana", "Namangan", "Shahrisabz"] }],
  [NOTE, ["need", "a new table"], "Notes: a new table / need / we / for the {room}, {name}.", "We ______ ______ for the {room}, {name}.",
    NW("we", "need", "a new table"), { room: ["kitchen", "living room", "classroom", "garden"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [NOTE, ["have", "a big dog"], "Notes: have / a big dog / my cousins / in their {house} in {city}.", "My cousins ______ ______ in their {house} in {city}.",
    NW("my cousins", "have", "a big dog"), { house: ["house", "yard", "garden", "village house"], city: ["Bukhara", "Termez", "Urgench", "Karshi"] }],
  [NOTE, ["want", "a cup of tea"], "Notes: a cup of tea / I / want / with {food}, {name}.", "I ______ ______ with {food}, {name}.",
    NW("I", "want", "a cup of tea"), { food: ["lemon", "sugar", "honey", "milk"], name: ["Mum", "please", "Grandma", "Aziz"] }],
  [NOTE, ["love", "Mrs Aliyeva"], "Notes: Mrs Aliyeva / love / the children / at the {school} in {city}.", "The children ______ ______ at the {school} in {city}.",
    NW("the children", "love", "Mrs Aliyeva"), { school: ["school", "kindergarten", "music school", "art school"], city: ["Nukus", "Navoi", "Gulistan", "Margilan"] }],
].map(([instr, key, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a food you like.", "I + like + food", ["exactly one sentence", "subject + verb + object", "the verb is not at the end"]],
  ["Write one sentence about what your mother or father does at home.", "subject + verb + object", ["exactly one sentence", "start with My mother / My father", "one object after the verb"]],
  ["Write one sentence about a sport or game you play.", "I play + object", ["exactly one sentence", "must use play", "object after the verb"]],
  ["Write one sentence about a language someone in your family speaks.", "subject + speaks + language", ["exactly one sentence", "must use speaks or speak", "the language after the verb"]],
  ["Write one sentence about what you and your friends watch or read.", "We + verb + object", ["exactly one sentence", "must start with We", "object after the verb"]],
  ["Write one sentence about something you need for school.", "I need + object", ["exactly one sentence", "must use need", "object after the verb"]],
  ["Write one sentence about a shop or market in your town and what it sells.", "subject + sells + object", ["exactly one sentence", "must use sells", "object after the verb"]],
  ["Write three short sentences about three people you know. Each one: who + verb + what.", "subject + verb + object", ["exactly three sentences", "a different verb in each", "no verb at the end of a sentence"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about your family: what does each person like, eat or do? Write four short sentences.",
    "subject + verb + object", ["a subject at the start of each sentence", "the verb before the object", "four different verbs"]],
  ["Describe a normal Sunday at your home. Who cooks, cleans, plays or watches what?",
    "subject + verb + object", ["subject + verb + object", "names or family words as subjects", "no verb at the end"]],
  ["Tell a new friend about the things you like and the things you don't like.",
    "I like / I love / I don't like + object", ["I + verb + object", "three or more things", "the object after the verb"]],
  ["Write about your best friend: what languages, sports or hobbies do they have?",
    "he / she + verb + object", ["he or she + verb + object", "speaks / plays / likes", "three sentences"]],
  ["Describe your town: what do people buy, sell, eat or visit there?",
    "subject + verb + object", ["people / tourists + verb + object", "a place name", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.word-order.svo-basic.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);