// Hand-authored: nouns-articles / articles / a-an (A1).
//
// Tests ONE point: a before a consonant SOUND, an before a vowel SOUND.
// Rule 14 (course audit): the rule is about the first sound, not the letter.
// Items include an hour (silent h), a university / a uniform / a useful
// (letter u, sound "you") and a European (letter e, sound "you").
// The word after the blank is never slotted (rule 2).
//
// Choose options: a, an, no article (L1 transfer: Uzbek and Russian have no
// articles) and "the". Every choose frame makes "the" impossible: "There is
// ___", "Is there ___", "What ___ ...!", "half ___ hour".
// Build/transform keys are typed a or an; instr lists the two choices (rule 3).
//
// Run: node tools/grammar-practice/authored/nouns-articles.articles.a-an.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "articles", topic: "a-an", level: "A1", pv: "2.5" };
const OPTS = { a: ["a", "an", "–", "the"], an: ["an", "a", "–", "the"] };
const W = {
  umbrella: "Umbrella starts with a vowel sound (um), so use an.",
  university: "University starts with the sound \"you\", not a vowel sound, so use a.",
  hour: "In hour the h is silent, so the first sound is a vowel sound (our). Use an.",
  european: "European starts with the sound \"you\", not a vowel sound, so use a.",
  egg: "Egg starts with a vowel sound (e), so use an.",
  uniform: "Uniform starts with the sound \"you\", not a vowel sound, so use a.",
  orange: "Orange starts with a vowel sound (o), so use an.",
  horse: "In horse you say the h, so it starts with a consonant sound. Use a.",
  idea: "Idea starts with a vowel sound (i), so use an.",
  yellow: "Yellow starts with a consonant sound (y), so use a.",
  old: "Old starts with a vowel sound (o), so use an.",
  young: "Young starts with a consonant sound (y), so use a.",
  house: "In house you say the h, so it starts with a consonant sound. Use a.",
  interesting: "Interesting starts with a vowel sound (i), so use an.",
  bank: "Bank starts with a consonant sound (b), so use a.",
  empty: "Empty starts with a vowel sound (e), so use an.",
  beautiful: "Beautiful starts with a consonant sound (b), so use a.",
  apple: "Apple starts with a vowel sound (a), so use an.",
  bus: "Bus starts with a consonant sound (b), so use a.",
  english: "English starts with a vowel sound (i), so use an.",
  new: "New starts with a consonant sound (n), so use a.",
  engineer: "Engineer starts with a vowel sound (e), so use an.",
  doctor: "Doctor starts with a consonant sound (d), so use a.",
  useful: "Useful starts with the sound \"you\", not a vowel sound, so use a.",
  big: "Big starts with a consonant sound (b), so use a.",
  small: "Small starts with a consonant sound (s), so use a.",
  good: "Good starts with a consonant sound (g), so use a.",
  eraser: "Eraser starts with a vowel sound (e), so use an.",
  giraffe: "Giraffe starts with a consonant sound (j), so use a.",
};

/* ---------------- choose: 20 mcq ---------------- */
// [key, why word, sentence, slots]
const CHOOSE = [
  ["an", "umbrella", "There is ______ umbrella by the {place}. Is it {who}'s?",
    { place: ["door", "window", "bed", "sofa"], who: ["Aziz", "Olga", "Timur", "Malika"] }],
  ["a", "university", "There is ______ university near our {home} in {city}.",
    { home: ["house", "flat", "street", "school"], city: ["Tashkent", "Samarkand", "Bukhara", "Namangan"] }],
  ["an", "hour", "We waited for the {transport} for half ______ hour at the {place}.",
    { transport: ["bus", "train", "taxi", "minibus"], place: ["station", "bus stop", "corner", "airport"] }],
  ["a", "european", "There is ______ European student in my {group}. She is from {country}.",
    { group: ["class", "group", "English class", "dance class"], country: ["Spain", "France", "Italy", "Poland"] }],
  ["an", "egg", "There is ______ egg in the {place}, so I can make {meal}.",
    { place: ["fridge", "bowl", "box", "basket"], meal: ["breakfast", "lunch", "a snack", "dinner"] }],
  ["a", "uniform", "There is ______ uniform for the {team} in the {place}.",
    { team: ["football team", "school", "dance group", "club"], place: ["box", "bag", "cupboard", "wardrobe"] }],
  ["an", "orange", "Is there ______ orange in your {bag}, {name}?",
    { bag: ["bag", "lunch box", "basket", "fridge"], name: ["Aziz", "Mum", "Kamila", "Bobur"] }],
  ["a", "horse", "There is ______ horse in the {place} near our {home}.",
    { place: ["field", "village", "yard", "garden"], home: ["house", "dacha", "school", "farm"] }],
  ["an", "idea", "What ______ idea! Let's go to the {place} with {name}.",
    { place: ["park", "zoo", "cinema", "lake"], name: ["Olga", "Sardor", "Nigora", "Timur"] }],
  ["a", "yellow", "There is ______ yellow bus outside the {place} on {street}.",
    { place: ["school", "hotel", "station", "market"], street: ["Navoi Street", "our street", "the main road", "Amir Temur Street"] }],
  ["an", "old", "There is ______ old man at the {place}. He wants to see {who}.",
    { place: ["door", "gate", "office", "front desk"], who: ["you", "your father", "the doctor", "the teacher"] }],
  ["a", "young", "There is ______ young girl with her {pet} in the {place}.",
    { pet: ["dog", "cat", "puppy", "rabbit"], place: ["park", "garden", "yard", "street"] }],
  ["an", "hour", "There is only half ______ hour for lunch at the {place}, so let's eat {food}.",
    { place: ["college", "office", "factory", "school"], food: ["samsa", "soup", "salad", "sandwiches"] }],
  ["a", "house", "There is ______ house for sale on {street} in {city}.",
    { street: ["our street", "Navoi Street", "the main road", "Bobur Street"], city: ["Tashkent", "Fergana", "Andijan", "Karshi"] }],
  ["an", "interesting", "What ______ interesting book! Can I take it home for the {time}, {name}?",
    { time: ["weekend", "holidays", "night", "week"], name: ["Aziz", "Laylo", "Bekzod", "Anna"] }],
  ["a", "bank", "There is ______ bank near the {place}, next to the {shop}.",
    { place: ["station", "market", "park", "school"], shop: ["café", "pharmacy", "bakery", "bookshop"] }],
  ["an", "empty", "There is ______ empty seat next to {name} on the {transport}.",
    { name: ["Aziz", "Olga", "Timur", "Malika"], transport: ["bus", "train", "metro", "minibus"] }],
  ["a", "beautiful", "What ______ beautiful day in {city}! Let's go to the {place}.",
    { city: ["Tashkent", "Samarkand", "Khiva", "Bukhara"], place: ["park", "lake", "mountains", "old town"] }],
  ["an", "apple", "There is ______ apple tree in our {place} in {where}.",
    { place: ["garden", "yard", "dacha", "school"], where: ["the village", "Chirchiq", "Fergana", "Namangan"] }],
  ["a", "european", "There is ______ European football match on TV tonight at {name}'s {home}.",
    { name: ["Aziz", "Bobur", "Sardor", "Javohir"], home: ["house", "flat", "dacha", "place"] }],
].map(([key, w, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS[key], key: 0, why: W[w], slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write a or an. Listen to the first sound of the next word.";
const BUILD = [
  ["an", "egg", "My brother eats ______ egg with {side} before {place}.",
    { side: ["bread", "tea", "salad", "cheese"], place: ["school", "work", "college", "class"] }],
  ["a", "university", "Kamila studies at ______ university in {city} with her {person}.",
    { city: ["Tashkent", "Seoul", "Moscow", "Samarkand"], person: ["cousin", "friend", "sister", "brother"] }],
  ["an", "hour", "The {transport} from {city} takes ______ hour.",
    { transport: ["train", "bus", "minibus", "taxi"], city: ["Chirchiq", "Angren", "Jizzakh", "Gulistan"] }],
  ["a", "european", "Our new {subject} teacher is ______ European woman from {country}.",
    { subject: ["English", "music", "art", "French"], country: ["Spain", "Italy", "Poland", "Germany"] }],
  ["an", "umbrella", "Please take ______ umbrella, {name}. It's raining in {city}.",
    { name: ["Aziz", "Olga", "Timur", "Malika"], city: ["Tashkent", "Samarkand", "Fergana", "Andijan"] }],
  ["a", "uniform", "Every student at our {place} wears ______ uniform with {detail}.",
    { place: ["school", "lyceum", "college", "academy"], detail: ["black shoes", "white socks", "blue trousers", "dark trousers"] }],
  ["an", "orange", "Can I have ______ orange with my {meal}, {name}?",
    { meal: ["breakfast", "lunch", "dinner", "tea"], name: ["Mum", "Grandma", "Dad", "Aunt Lola"] }],
  ["a", "horse", "My grandfather has ______ horse at his {home} in {where}.",
    { home: ["farm", "house", "dacha", "village house"], where: ["the mountains", "the village", "Surkhandarya", "Karakalpakstan"] }],
  ["an", "idea", "Nodira has ______ idea for the {event} with her {group}.",
    { event: ["party", "trip", "game", "concert"], group: ["class", "friends", "team", "group"] }],
  ["a", "bus", "Is there ______ bus stop near the {place} on {street}?",
    { place: ["market", "hospital", "park", "bank"], street: ["Navoi Street", "this street", "the main road", "Bobur Street"] }],
  ["an", "old", "Our neighbour on {street} is ______ old man with {feature}.",
    { street: ["our street", "Navoi Street", "the corner", "the fifth floor"], feature: ["white hair", "kind eyes", "two dogs", "three cats"] }],
  ["a", "new", "Bobur wants ______ new phone for his {event} in {month}.",
    { event: ["birthday", "new job", "trip", "studies"], month: ["May", "June", "July", "March"] }],
  ["an", "english", "We had ______ English lesson in room {num} with {teacher}.",
    { num: ["five", "twelve", "nine", "three"], teacher: ["Mr Karimov", "Ms Smith", "Olga", "our teacher"] }],
  ["a", "young", "My sister has ______ young cat called {pet} in her {home}.",
    { pet: ["Mosh", "Barsik", "Snow", "Luna"], home: ["flat", "house", "room", "home"] }],
  ["an", "engineer", "Aziz is ______ engineer at the {place} in {city}.",
    { place: ["factory", "airport", "bank", "power station"], city: ["Tashkent", "Navoi", "Almalyk", "Fergana"] }],
  ["a", "doctor", "Malika is ______ doctor at the {place} near our {home}.",
    { place: ["hospital", "clinic", "health centre", "children's hospital"], home: ["house", "flat", "school", "street"] }],
  ["an", "interesting", "I read ______ interesting story about {topic} last night.",
    { topic: ["space", "animals", "old Samarkand", "football"] }],
  ["a", "useful", "This is ______ useful book for {subject} students at the {place}.",
    { subject: ["English", "maths", "IT", "music"], place: ["college", "university", "school", "language centre"] }],
  ["an", "apple", "There is ______ apple tree in my {person}'s {place}.",
    { person: ["grandmother", "uncle", "aunt", "neighbour"], place: ["garden", "yard", "dacha", "village house"] }],
  ["a", "house", "We live in ______ house near the {place} in {city}.",
    { place: ["river", "park", "market", "mountains"], city: ["Fergana", "Samarkand", "Termez", "Urgench"] }],
].map(([key, w, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: W[w], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_ONE = "Read the first sentence. Now there is only one. Complete the second sentence with a or an.";
const T_ADJ = "Read the first sentence. A new word comes before the noun. Complete the second sentence with a or an.";
const T_NOUN = "Read the first sentence. The noun is different now. Complete the second sentence with a or an.";
const TRANSFORM = [
  // kind 1: plural -> one
  [T_ONE, "an", "umbrella", "I have two umbrellas in my {place}.", "My {person} has only ______ umbrella.",
    { place: ["car", "bag", "hall", "office"], person: ["sister", "brother", "friend", "mother"] }],
  [T_ONE, "a", "university", "There are two universities in {city}.", "Our town near {city} has only ______ university for {who}.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], who: ["students", "young people", "everyone", "the region"] }],
  [T_ONE, "an", "hour", "The film at the {place} is two hours long.", "The {show} on TV is only ______ hour long.",
    { place: ["cinema", "theatre", "club", "centre"], show: ["cartoon", "match", "concert", "programme"] }],
  [T_ONE, "an", "egg", "Mum bought six eggs at the {shop}.", "Now there is only ______ egg in the {place}.",
    { shop: ["market", "shop", "bazaar", "supermarket"], place: ["fridge", "box", "bowl", "kitchen"] }],
  [T_ONE, "a", "uniform", "The students at our {place} have two uniforms.", "My little brother has only ______ uniform for {use}.",
    { place: ["school", "lyceum", "college", "academy"], use: ["summer", "winter", "sport", "school days"] }],
  // kind 2: a new word before the noun changes the first sound
  [T_ADJ, "an", "old", "There is a book on the {furniture} in the {room}.", "It is ______ old book from my {person}.",
    { furniture: ["table", "shelf", "desk", "bed"], room: ["kitchen", "bedroom", "hall", "classroom"], person: ["grandfather", "aunt", "teacher", "father"] }],
  [T_ADJ, "a", "big", "I want an egg for {meal}.", "I want ______ big egg, {name}.",
    { meal: ["breakfast", "lunch", "dinner", "my salad"], name: ["Mum", "Grandma", "Dad", "Aunt Lola"] }],
  [T_ADJ, "a", "small", "There is an orange in my {bag}.", "It is ______ small orange from {place}.",
    { bag: ["bag", "lunch box", "pocket", "basket"], place: ["the market", "Fergana", "our garden", "Grandma's tree"] }],
  [T_ADJ, "an", "empty", "We live near a house on {street}.", "It is ______ empty house with {feature}.",
    { street: ["our street", "Navoi Street", "the main road", "Bobur Street"], feature: ["old doors", "broken windows", "tall trees", "no lights"] }],
  [T_ADJ, "a", "good", "Aziz has an idea for the {event}.", "It is ______ good idea, {name}.",
    { event: ["party", "trip", "game", "class project"], name: ["Aziz", "Olga", "Timur", "Malika"] }],
  // kind 3: a different noun
  [T_NOUN, "an", "engineer", "Aziz is a doctor at the {place}.", "His sister is ______ engineer in {city}.",
    { place: ["hospital", "clinic", "health centre", "children's hospital"], city: ["Tashkent", "Navoi", "Almalyk", "Fergana"] }],
  [T_NOUN, "a", "university", "My mother is an artist in {city}.", "My father is ______ university teacher.",
    { city: ["Tashkent", "Samarkand", "Bukhara", "Khiva"] }],
  [T_NOUN, "an", "hour", "We stayed in {city} for a day.", "We stayed at the {place} for ______ hour.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], place: ["station", "airport", "café", "museum"] }],
  [T_NOUN, "an", "eraser", "I bought a pen for my {person}.", "I also bought ______ eraser at the {shop}.",
    { person: ["brother", "sister", "son", "daughter"], shop: ["bookshop", "school shop", "market", "shop"] }],
  [T_NOUN, "a", "giraffe", "There is an elephant at the {place} in {city}.", "There is ______ giraffe there too.",
    { place: ["zoo", "park", "wildlife park", "animal park"], city: ["Tashkent", "Samarkand", "Moscow", "Almaty"] }],
].map(([instr, key, w, source, hint, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: W[w], slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something in your bag. Use a or an.", "a / an", ["exactly one sentence", "must use a or an", "must name one thing"]],
  ["Write one sentence with an hour.", "an hour", ["exactly one sentence", "must use an hour"]],
  ["Write one sentence with a university.", "a university", ["exactly one sentence", "must use a university"]],
  ["Write one sentence about a person's job. Use an.", "an + job", ["exactly one sentence", "must use an", "must name a job"]],
  ["Write one sentence about food for breakfast. Use an.", "an + food", ["exactly one sentence", "must use an", "must name a food"]],
  ["Write one sentence with an old thing and one sentence with a new thing.", "an old / a new", ["exactly two sentences", "must use an old", "must use a new"]],
  ["Write one sentence that starts with There is and uses an umbrella or an apple.", "There is an...", ["exactly one sentence", "must start with There is", "must use an"]],
  ["Write one sentence with a uniform or a European.", "a + \"you\" sound", ["exactly one sentence", "must use a uniform or a European"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your room. Write three or four sentences with There is a... and There is an...", "a / an", ["a + consonant sound", "an + vowel sound", "There is"]],
  ["Write about your family's jobs. Write three or four sentences.", "a / an + job", ["a + job", "an + job", "is"]],
  ["What is in your fridge? Write three or four sentences.", "a / an + food", ["an egg or an apple", "a + food", "There is"]],
  ["Write about your school or university day. Use an hour and a university or a uniform.", "a / an with tricky sounds", ["an hour", "a university or a uniform", "three or four sentences"]],
  ["Describe your street. Write three or four sentences.", "a / an", ["a + place", "an old or an empty", "There is"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.articles.a-an.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/nouns-articles.articles.a-an.json`);