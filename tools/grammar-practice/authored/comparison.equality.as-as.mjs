// Hand-authored: comparison / equality / as-as (A2).
// Speaking Pack batch 2, topic 4 (grammar-run/SPEAK-2.md).
//
// Tests ONE point: as + adjective + as for two things that are equal
// ("My sister is as tall as me"). Placement item: "My sister is as tall
// ______ me" (as, not than / like / that).
//
// Half the choose items blank the second "as" (the placement shape), half
// blank the whole frame. Whole-frame distractors are the real errors:
// "as tall than" (mixing in the comparative), "as taller as" / "as more
// difficult as" (a comparative inside the frame) and "the same tall as"
// (Russian "такой же ... как" carried over).
//
// Kept apart from its siblings: no negatives (not as ... as is B1
// not-as-as) and no adverbs after a verb ("runs as fast as" is B2
// as-as-adverb): the adjective always follows be / look / feel or a noun
// phrase. Typed keys are "as + adjective + as", so those sentences never
// print another "as".
//
// Run: node tools/grammar-practice/authored/comparison.equality.as-as.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "equality", topic: "as-as", level: "A2", pv: "2.5" };

// Comparative used inside the wrong frame "as taller as".
const ER = {
  tall: "taller", cold: "colder", delicious: "more delicious", old: "older", hot: "hotter",
  difficult: "more difficult", cheap: "cheaper", busy: "busier", friendly: "friendlier", long: "longer",
};
const whole = (adj) => [`as ${adj} as`, `as ${adj} than`, `as ${ER[adj]} as`, `the same ${adj} as`];
const second = () => ["as", "than", "like", "that"];
const WHY_W = (adj) => `The two things are equal, so use as + adjective + as: as ${adj} as. The adjective keeps its normal form.`;
const WHY_S = (adj) => `As ... as needs as on both sides: as ${adj} as. Than goes with -er comparatives, never after as.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["w", "tall", "My little brother is now ______ my {relative}. He plays {sport} every day.",
    { relative: ["father", "uncle", "older cousin", "grandfather"], sport: ["basketball", "volleyball", "football", "tennis"] }],
  ["s", "big", "Our new flat is as big ______ our old one, but it is closer to {place} and the {place2}.",
    { place: ["the metro", "my school", "my work", "the bazaar"], place2: ["park", "market", "hospital", "stadium"] }],
  ["w", "cold", "In {city}, March can be ______ January. Take a {thing}!",
    { city: ["Tashkent", "Samarkand", "Nukus", "Jizzakh"], thing: ["warm coat", "hat", "scarf", "jacket"] }],
  ["s", "expensive", "A good {item} at the {market} can be as expensive ______ one at the mall.",
    { item: ["jacket", "coat", "carpet", "pair of shoes"], market: ["bazaar", "market", "street market", "Chorsu bazaar"] }],
  ["w", "delicious", "My mother's samsa is ______ the samsa at the {place}. She makes it on {day}.",
    { place: ["bakery", "café", "bazaar", "teahouse"], day: ["Fridays", "Sundays", "Saturdays", "holidays"] }],
  ["s", "fast", "The new {bus} is as fast ______ the metro {time}.",
    { bus: ["bus", "electric bus", "express bus", "minibus"], time: ["at rush hour", "in the morning", "in the evening", "at night"] }],
  ["w", "old", "My uncle {name} is ______ my father. They are twins, and they both work in {place}.",
    { name: ["Rustam", "Bakhtiyor", "Alisher", "Farhod"], place: ["Tashkent", "a bank", "a hospital", "the same office"] }],
  ["s", "heavy", "This box is as heavy ______ a bag of {food}. Be careful on the {place}.",
    { food: ["rice", "flour", "potatoes", "sugar"], place: ["stairs", "steps", "ladder", "way down"] }],
  ["w", "hot", "Today is ______ yesterday. Let's stay at home and drink {drink} with {who}.",
    { drink: ["cold water", "green tea", "ayran", "juice"], who: ["Grandma", "the children", "our neighbours", "my cousins"] }],
  ["s", "beautiful", "In autumn, the {place} is as beautiful ______ in spring. The {trees} turn red and yellow.",
    { place: ["park", "garden", "valley", "village"], trees: ["leaves", "trees", "plane trees", "apple trees"] }],
  ["w", "difficult", "For me, Russian is ______ English. I study both at {place} every {day}.",
    { place: ["school", "college", "a language centre", "university"], day: ["day", "week", "evening", "morning"] }],
  ["s", "tired", "After my {task}, I am as tired ______ after a {sport} match.",
    { task: ["exam", "night shift", "maths test", "long day"], sport: ["football", "basketball", "volleyball", "handball"] }],
  ["w", "cheap", "At this {shop}, a big bottle of water is ______ a small one at the {place}.",
    { shop: ["shop", "supermarket", "market", "kiosk"], place: ["station", "airport", "stadium", "cinema"] }],
  ["s", "popular", "Basketball is now as popular ______ football at our {place}. Even the {people} play it.",
    { place: ["school", "college", "lyceum", "university"], people: ["teachers", "girls", "little kids", "older students"] }],
  ["w", "busy", "On Sunday, the park is ______ the bazaar. Families come and stay until {time} with their {who}.",
    { time: ["evening", "dark", "six o'clock", "sunset"], who: ["children", "grandparents", "friends", "neighbours"] }],
  ["s", "comfortable", "This old {sofa} is as comfortable ______ a new one. My {person} sleeps on it.",
    { sofa: ["sofa", "armchair", "bed", "mattress"], person: ["grandfather", "cat", "brother", "dog"] }],
  ["w", "friendly", "Our new neighbours are ______ our old ones. They brought us {food} on the first {day}.",
    { food: ["bread", "a cake", "fruit", "plov"], day: ["day", "evening", "weekend", "morning"] }],
  ["s", "strong", "My little sister is as strong ______ me! She can carry {thing} up to the {floor} floor.",
    { thing: ["two bags", "the water", "a chair", "my backpack"], floor: ["third", "fourth", "fifth", "sixth"] }],
  ["w", "long", "My hair is now ______ my sister's hair. I want to cut it before {event}.",
    { event: ["the wedding", "Navruz", "the new school year", "my birthday"] }],
  ["s", "good", "My {skill} is as good ______ my brother's now. We practise together every {day}.",
    { skill: ["English", "Russian", "cooking", "handwriting"], day: ["evening", "day", "weekend", "morning"] }],
].map(([t, adj, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt,
  options: t === "w" ? whole(adj) : second(), key: 0, why: t === "w" ? WHY_W(adj) : WHY_S(adj), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
// No sentence here prints another "as": the key brings both.
const INSTR_B = "Complete the sentence with as + the adjective in brackets + as.";
const BUILD = [
  ["tall", "My sister is ______ (tall) my mother now. They wear the same {clothes} and {shoes}.",
    { clothes: ["dresses", "coats", "jackets", "scarves"], shoes: ["shoes", "boots", "trainers", "sandals"] }],
  ["old", "My phone is ______ (old) my brother's phone. We got them in the same {year} from our {person}.",
    { year: ["year", "month", "week", "summer"], person: ["father", "uncle", "parents", "grandparents"] }],
  ["hot", "In {city}, June is almost ______ (hot) July, so we go to the {place} every weekend.",
    { city: ["Tashkent", "Bukhara", "Termez", "Samarkand"], place: ["lake", "river", "pool", "mountains"] }],
  ["busy", "On Saturday, the metro is ______ (busy) on Monday morning. Everyone goes out with their {who} to the {place}.",
    { who: ["families", "friends", "children", "kids"], place: ["bazaar", "park", "mall", "city centre"] }],
  ["expensive", "A good {item} is ______ (expensive) a cheap phone, so I am saving my {money}.",
    { item: ["bike", "jacket", "watch", "guitar"], money: ["money", "pocket money", "birthday money", "salary"] }],
  ["big", "My {room} is ______ (big) our living room. I have a desk, a bed and a {thing}.",
    { room: ["bedroom", "room", "study", "new room"], thing: ["sofa", "wardrobe", "piano", "bookcase"] }],
  ["cold", "The water in Charvak lake is ______ (cold) ice in {month}! Only my {relative} swims in it.",
    { month: ["May", "April", "June", "October"], relative: ["uncle", "brother", "father", "cousin"] }],
  ["heavy", "My school bag is ______ (heavy) a bag of {food}, because I carry {things}.",
    { food: ["potatoes", "rice", "flour", "onions"], things: ["all my books", "a laptop", "three dictionaries", "my sports clothes"] }],
  ["fast", "In the city, my cousin's new bike is ______ (fast) a {vehicle}. He rides it to {place}.",
    { vehicle: ["car", "scooter", "motorbike", "bus"], place: ["work", "school", "college", "the park"] }],
  ["kind", "Our new teacher is ______ (kind) our old teacher. She always {does}.",
    { does: ["helps us", "smiles", "listens to us", "explains things again"] }],
  ["interesting", "This {book} is ______ (interesting) the film. I read it in {time}.",
    { book: ["book", "novel", "comic", "story"], time: ["two days", "one evening", "a week", "three days"] }],
  ["difficult", "For me, speaking English is ______ (difficult) writing it. I practise with {who} every {day}.",
    { who: ["my friend", "my sister", "an app", "my tutor"], day: ["day", "evening", "weekend", "morning"] }],
  ["happy", "My grandmother was ______ (happy) a child when we came from {city} for {event}.",
    { city: ["Tashkent", "Moscow", "Samarkand", "Seoul"], event: ["Navruz", "her birthday", "the holidays", "the wedding"] }],
  ["sweet", "These {fruit} from our garden are ______ (sweet) honey. My {person} picks them every morning.",
    { fruit: ["grapes", "peaches", "apricots", "melons"], person: ["grandfather", "mother", "uncle", "aunt"] }],
  ["quiet", "After {time}, our street is ______ (quiet) a village street. Only the {animal} make a noise.",
    { time: ["midnight", "ten o'clock", "eleven", "dinner"], animal: ["dogs", "cats", "birds", "crickets"] }],
  ["strong", "My grandfather is still ______ (strong) a young man. He works in the {place} every {day}.",
    { place: ["garden", "field", "yard", "orchard"], day: ["morning", "day", "afternoon", "evening"] }],
  ["comfortable", "The train seats are ______ (comfortable) seats on a plane. I always sleep on the way to {city}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  ["cheap", "In summer, tomatoes are ______ (cheap) potatoes at the {market}. My mother buys {amount}.",
    { market: ["bazaar", "market", "Chorsu bazaar", "village market"], amount: ["five kilos", "a big bag", "ten kilos", "a box"] }],
  ["good", "My younger brother is now ______ (good) me at {game}. We play every {day}.",
    { game: ["chess", "football", "table tennis", "video games"], day: ["evening", "weekend", "Sunday", "day"] }],
  ["white", "In winter, the mountains near {city} are ______ (white) {thing}.",
    { city: ["Tashkent", "Samarkand", "Fergana", "Jizzakh"], thing: ["snow", "milk", "paper", "cotton"] }],
].map(([adj, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `as ${adj} as`,
  why: `The two things are equal, so use as ${adj} as. Use the normal adjective, not -er or more.`, slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const EQUAL = "The two facts are the same. Rewrite them as one sentence with as + the adjective in brackets + as.";
const SAME = "Rewrite the sentence with as + the adjective in brackets + as instead of the same.";
const FIX = "Correct the mistake. For two equal things, use as + adjective + as.";
const TRANSFORM = [
  // two equal facts -> as ... as (5)
  [EQUAL, "tall", "Aziz is 170 cm and {name} is 170 cm too. They play {sport}.", "Aziz is ______ (tall) {name}. They play {sport}.",
    "Both are 170 cm, so they are equal: as tall as.",
    { name: ["Timur", "Sardor", "Ivan", "Jasur"], sport: ["basketball", "volleyball", "handball", "football"] }],
  [EQUAL, "heavy", "For the trip to {city}, my bag is 5 kilos and your {bag} is 5 kilos too.", "For the trip to {city}, my bag is ______ (heavy) your {bag}.",
    "Both weigh 5 kilos, so they are equal: as heavy as.",
    { city: ["Samarkand", "Bukhara", "Moscow", "Khiva"], bag: ["bag", "backpack", "suitcase", "sports bag"] }],
  [EQUAL, "hot", "In {city}, it was 35 degrees yesterday and it is 35 degrees today.", "In {city}, today is ______ (hot) yesterday.",
    "The temperature is the same, so today is as hot as yesterday.",
    { city: ["Tashkent", "Bukhara", "Termez", "Karshi"] }],
  [EQUAL, "expensive", "At the {shop}, this {item} costs 200,000 sum and that one costs 200,000 sum too.", "At the {shop}, this {item} is ______ (expensive) that one.",
    "The prices are the same, so use as expensive as.",
    { shop: ["mall", "market", "bazaar", "shop"], item: ["jacket", "bag", "pair of shoes", "scarf"] }],
  [EQUAL, "old", "My cousin {name} is 19 and I am 19 too. We both study in {city}.", "My cousin {name} is ______ (old) me. We both study in {city}.",
    "You are both 19, so use as old as.",
    { name: ["Madina", "Olga", "Sardor", "Bekzod"], city: ["Tashkent", "Samarkand", "Moscow", "Seoul"] }],
  // the same + noun -> as + adjective + as (5)
  [SAME, "tall", "In this {photo}, my sister is the same height as my {relative}.", "In this {photo}, my sister is ______ (tall) my {relative}.",
    "The same height means as tall as.",
    { photo: ["photo", "picture", "family photo", "video"], relative: ["mother", "aunt", "father", "grandmother"] }],
  [SAME, "big", "Our new {room} is the same size as our old one, but it is {state}.", "Our new {room} is ______ (big) our old one, but it is {state}.",
    "The same size means as big as.",
    { room: ["kitchen", "bedroom", "flat", "classroom"], state: ["brighter", "warmer", "quieter", "cleaner"] }],
  [SAME, "long", "This road is the same length as the road to {city}.", "This road is ______ (long) the road to {city}.",
    "The same length means as long as.",
    { city: ["Chirchiq", "Angren", "Gulistan", "Parkent"] }],
  [SAME, "old", "The {thing} in my room is the same age as me. My {person} bought it.", "The {thing} in my room is ______ (old) me. My {person} bought it.",
    "The same age means as old as.",
    { thing: ["cupboard", "carpet", "bed", "desk"], person: ["grandfather", "father", "mother", "grandmother"] }],
  [SAME, "expensive", "This {item} is the same price as that one at the {shop}.", "This {item} is ______ (expensive) that one at the {shop}.",
    "The same price means as expensive as.",
    { item: ["jacket", "scarf", "hat", "bag"], shop: ["mall", "market", "bazaar", "station"] }],
  // correct the mistake (5)
  [FIX, "tall", "My {relative} is as tall than my father, and he is only {age}.", "My {relative} is ______ (tall) my father, and he is only {age}.",
    "After as ... use as again, not than: as tall as.",
    { relative: ["brother", "cousin", "nephew", "little brother"], age: ["fourteen", "fifteen", "thirteen", "sixteen"] }],
  [FIX, "cold", "Today in {city} is as colder as yesterday, so wear your {clothes}.", "Today in {city} is ______ (cold) yesterday, so wear your {clothes}.",
    "Between as and as, use the normal adjective: as cold as, not as colder as.",
    { city: ["Tashkent", "Nukus", "Fergana", "Samarkand"], clothes: ["warm coat", "hat", "boots", "gloves"] }],
  [FIX, "good", "{name}'s {lang} is the same good as her teacher's.", "{name}'s {lang} is ______ (good) her teacher's.",
    "In English, say as good as, not the same good as.",
    { name: ["Olga", "Madina", "Lola", "Kamila"], lang: ["English", "Korean", "German", "French"] }],
  [FIX, "big", "This {fruit} from my grandmother's garden is big like a {ball}.", "This {fruit} from my grandmother's garden is ______ (big) a {ball}.",
    "To say two things are equal in size, use as big as, not big like.",
    { fruit: ["melon", "watermelon", "pumpkin", "cabbage"], ball: ["football", "basketball", "volleyball", "beach ball"] }],
  [FIX, "busy", "My {relative} is so busy as my father. They both work at a {place}.", "My {relative} is ______ (busy) my father. They both work at a {place}.",
    "In a positive sentence, use as busy as, not so busy as.",
    { relative: ["mother", "aunt", "sister", "uncle"], place: ["hospital", "bank", "school", "factory"] }],
].map(([instr, adj, source, hint, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `as ${adj} as`, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about someone in your family who is as tall as you, or as old as you.", "as + adjective + as",
    ["exactly one sentence", "must name a family member", "must use as twice"]],
  ["Write one sentence comparing two cities or towns that are equal in some way.", "as + adjective + as",
    ["exactly one sentence", "must name two places", "no than"]],
  ["Write one sentence about two foods or dishes that are as delicious as each other for you.", "as delicious as or another as + adjective + as",
    ["exactly one sentence", "must name two foods", "must use as twice"]],
  ["Write one sentence comparing the weather today and yesterday when they are the same.", "as hot as, as cold as or as warm as",
    ["exactly one sentence", "must include today", "must include yesterday"]],
  ["Write one sentence about two school subjects that are as difficult or as interesting as each other.", "as difficult as or as interesting as",
    ["exactly one sentence", "must name two subjects", "no more inside as ... as"]],
  ["Write one sentence about a friend who is as good as you at a sport or game.", "as good as",
    ["exactly one sentence", "must name a sport or game", "must use at"]],
  ["Write one sentence with a fixed phrase: as cold as ice, as white as snow or as sweet as honey.", "as + adjective + as + noun",
    ["exactly one sentence", "must use one of the phrases", "must be about something real in your life"]],
  ["Write two sentences: in the first, two things are different (-er than); in the second, two things are equal (as ... as).", "one -er than comparative and one as ... as",
    ["exactly two sentences", "first with than", "second with as ... as"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare yourself with a brother, sister, cousin or close friend. In what ways are you the same? Write three or four sentences.",
    "as + adjective + as for people who are equal", ["as tall as, as old as or similar", "as on both sides", "no than after as"]],
  ["Compare two places in Uzbekistan you know. In what ways are they equal, and in what ways are they different? Write three or four sentences.",
    "as ... as for equal things and -er than for different things", ["as + adjective + as", "-er than or more ... than", "two places named"]],
  ["Compare two ways to get around your city, for example the metro and the bus. Write three or four sentences.",
    "as + adjective + as for transport", ["as fast as, as cheap as or as comfortable as", "the adjective in its normal form", "no the same + adjective"]],
  ["Compare the food at home and the food at a café or canteen. Write three or four sentences.",
    "as + adjective + as for opinions about food", ["as delicious as, as cheap as or as healthy as", "as on both sides", "a reason for your opinion"]],
  ["Describe two friends who are very alike. How are they the same? Write three or four sentences.",
    "as + adjective + as for describing similar people", ["several as ... as phrases", "different adjectives", "no as ... than"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.equality.as-as.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);