// Hand-authored: comparison / superlative / est-superlative (A2).
// Speaking Pack batch 2, topic 3 (grammar-run/SPEAK-2.md).
//
// Tests ONE point: the superlative of a short adjective is the + -est, with
// its spelling (old -> the oldest, big -> the biggest, easy -> the easiest,
// nice -> the nicest). Placement item: "Samarkand is one of ______ (old)
// cities in the world" -> "the oldest" ("-iest spelling with 'the'").
//
// Kept apart from its siblings: no good/bad/far (irregular-superlative), no
// long adjectives with most (no separate A2 topic; "the most tall" appears
// only as the error), no "no other ... as ... as" (B2 negative-to-superlative)
// and no "the best I have ever" (B2 superlative-present-perfect).
//
// The article is part of what is tested, so typed keys are "the + -est" and
// those sentences never print another "the" (the key must not repeat a printed
// word). In choose, the blank sits before a noun ("______ boy in our class"),
// where leaving out "the" is always wrong. -y adjectives get the spelling
// error (the easyest) rather than "the most easy".
//
// Run: node tools/grammar-practice/authored/comparison.superlative.est-superlative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "superlative", topic: "est-superlative", level: "A2", pv: "2.5" };

const cap = (s) => s[0].toUpperCase() + s.slice(1);
// kind: reg (+est), dbl (double the consonant), y (y -> iest), e (+st)
const FORMS = {
  tall: ["tallest", "taller", "reg"], big: ["biggest", "bigger", "dbl"], old: ["oldest", "older", "reg"],
  hot: ["hottest", "hotter", "dbl"], cheap: ["cheapest", "cheaper", "reg"], easy: ["easiest", "easier", "y"],
  young: ["youngest", "younger", "reg"], busy: ["busiest", "busier", "y"], long: ["longest", "longer", "reg"],
  heavy: ["heaviest", "heavier", "y"], fast: ["fastest", "faster", "reg"], happy: ["happiest", "happier", "y"],
  cold: ["coldest", "colder", "reg"], funny: ["funniest", "funnier", "y"], nice: ["nicest", "nicer", "e"],
  thin: ["thinnest", "thinner", "dbl"], early: ["earliest", "earlier", "y"], dirty: ["dirtiest", "dirtier", "y"],
  small: ["smallest", "smaller", "reg"], high: ["highest", "higher", "reg"],
};
const est = (adj) => FORMS[adj][0];
const RULE = {
  reg: (a) => `${cap(a)} is a short adjective, so the superlative is the + -est: the ${est(a)}.`,
  dbl: (a) => `${cap(a)} ends in one vowel and one consonant, so double the last letter: the ${est(a)}.`,
  y: (a) => `${cap(a)} ends in y, so change y to i and add -est: the ${est(a)}.`,
  e: (a) => `${cap(a)} already ends in e, so just add -st: the ${est(a)}.`,
};
const why = (adj) => `${RULE[FORMS[adj][2]](adj)} It compares one thing with all the others in a group.`;
const opts = (adj) => {
  const [s, er, kind] = FORMS[adj];
  if (kind === "dbl") return [`the ${s}`, `the ${adj}est`, `the ${er}`, s];
  if (kind === "y") return [`the ${s}`, `the ${adj}est`, `the ${er}`, s];
  return [`the ${s}`, s, `the ${er}`, `the most ${adj}`];
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["tall", "Aziz is ______ boy in our {group}. He plays {sport} for the school team.",
    { group: ["class", "group", "year", "family"], sport: ["basketball", "volleyball", "football", "handball"] }],
  ["big", "Tashkent is ______ city in Uzbekistan. It has {thing} and many {place}.",
    { thing: ["a metro", "an airport", "a TV tower", "a zoo"], place: ["parks", "universities", "markets", "theatres"] }],
  ["old", "My grandfather is ______ person in our {place}. He is ninety and still {action} every day.",
    { place: ["family", "street", "village", "building"], action: ["walks in the park", "reads the newspaper", "works in his garden", "drinks tea with friends"] }],
  ["hot", "July is ______ month in {city}, so we sleep on the {place} at night.",
    { city: ["Tashkent", "Bukhara", "Termez", "Samarkand"], place: ["balcony", "roof", "terrace", "veranda"] }],
  ["cheap", "Samsa is ______ lunch near our {place}, so {who} buy it every day.",
    { place: ["university", "college", "school", "office"], who: ["students", "workers", "drivers", "my friends"] }],
  ["easy", "For me, {subject} is ______ subject at school. I always get {mark}.",
    { subject: ["English", "art", "music", "PE"], mark: ["a five", "top marks", "good marks", "high marks"] }],
  ["young", "My cousin {name} is ______ child in our family. She is only {age}.",
    { name: ["Malika", "Sevara", "Zarina", "Nilufar"], age: ["two", "three", "four", "five"] }],
  ["busy", "Saturday is ______ day at the bazaar. People buy {food} and {food2} for the week.",
    { food: ["meat", "fruit", "vegetables", "rice"], food2: ["bread", "flour", "eggs", "tea"] }],
  ["long", "Friday is ______ day of my week. I have {n} lessons and {thing} after school.",
    { n: ["seven", "eight", "six", "nine"], thing: ["football training", "a music lesson", "an English club", "extra maths"] }],
  ["heavy", "My {bag} is ______ one in our group, because I carry my {thing} every day.",
    { bag: ["school bag", "backpack", "sports bag", "rucksack"], thing: ["laptop", "dictionary", "lunch box", "sports shoes"] }],
  ["fast", "Diana is ______ runner in our {group}. She trains at the {place}.",
    { group: ["class", "school", "club", "team"], place: ["stadium", "park", "gym", "sports club"] }],
  ["happy", "My birthday was ______ day of the year for me. My {people} came and we ate {food}.",
    { people: ["friends", "cousins", "grandparents", "classmates"], food: ["cake", "plov", "ice cream", "pizza"] }],
  ["cold", "January is ______ month in {city}. We wear {clothes} and drink hot tea.",
    { city: ["Tashkent", "Nukus", "Fergana", "Samarkand"], clothes: ["warm coats", "thick hats", "boots", "scarves"] }],
  ["funny", "My {relative} is ______ person in our family. He always tells jokes at {event}.",
    { relative: ["uncle", "brother", "grandfather", "cousin"], event: ["dinner", "weddings", "parties", "breakfast"] }],
  ["nice", "This is ______ café in our {area}. They make great {food}.",
    { area: ["street", "area", "town", "district"], food: ["samsa", "tea", "cakes", "coffee"] }],
  ["thin", "This is ______ {device} in the shop, and my {person} wants it.",
    { device: ["phone", "laptop", "tablet", "TV"], person: ["brother", "father", "sister", "aunt"] }],
  ["early", "Every {day}, my father catches ______ bus to {place} at six o'clock.",
    { day: ["morning", "weekday", "Monday", "workday"], place: ["work", "the factory", "the city", "Chirchiq"] }],
  ["dirty", "After the {event}, Jasur's shirt was ______ shirt on our {team}.",
    { event: ["match", "game", "training", "rain"], team: ["team", "football team", "school team", "club team"] }],
  ["small", "Our flat is ______ one in the building, but it has a big {room} and a {thing}.",
    { room: ["kitchen", "balcony", "bathroom", "living room"], thing: ["nice view", "quiet yard", "small garden", "new lift"] }],
  ["high", "Chimgan is one of ______ places near Tashkent. People go there at {day} with their {person}.",
    { day: ["weekends", "the weekend", "New Year", "Navruz"], person: ["families", "friends", "children", "classmates"] }],
].map(([adj, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: opts(adj), key: 0, why: why(adj), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
// No sentence here prints another "the": the key brings it.
const INSTR_B = "Complete the sentence with the + the superlative (-est) of the adjective in brackets.";
const BUILD = [
  ["old", "Samarkand is one of ______ (old) cities in {area}. Tourists love its {thing}.",
    { area: ["Uzbekistan", "Central Asia", "Asia", "our region"], thing: ["markets", "squares", "buildings", "old walls"] }],
  ["hot", "July is ______ (hot) month in {city}, so we stay at home at {time}.",
    { city: ["Tashkent", "Bukhara", "Termez", "Samarkand"], time: ["midday", "lunchtime", "noon", "two o'clock"] }],
  ["big", "Chorsu is one of ______ (big) markets in Tashkent. My mother buys {food} and {food2} there.",
    { food: ["fruit", "spices", "meat", "rice"], food2: ["bread", "nuts", "dried fruit", "honey"] }],
  ["easy", "For me, this was ______ (easy) test of {period}. I knew every {thing}.",
    { period: ["this term", "this year", "this month", "my life"], thing: ["answer", "word", "rule", "question"] }],
  ["tall", "Bekzod is ______ (tall) boy in our {group}. He is a {sport} player.",
    { group: ["class", "group", "family", "building"], sport: ["basketball", "volleyball", "handball", "water polo"] }],
  ["cheap", "Students buy {food} at this kiosk because it has ______ (cheap) prices near our {place}.",
    { food: ["samsa", "tea", "sandwiches", "hot dogs"], place: ["university", "college", "school", "station"] }],
  ["young", "Kamola is ______ (young) student in our {group}. She is only {age}.",
    { group: ["class", "group", "course", "club"], age: ["fifteen", "sixteen", "fourteen", "thirteen"] }],
  ["busy", "Monday is ______ (busy) day of my week. I have {n} lessons and {club} after school.",
    { n: ["six", "seven", "eight", "five"], club: ["football training", "an English club", "a music lesson", "extra maths"] }],
  ["long", "My {relative} has ______ (long) hair in our family. She wears it in two {style}.",
    { relative: ["sister", "cousin", "aunt", "grandmother"], style: ["plaits", "braids", "ponytails", "buns"] }],
  ["heavy", "This is ______ (heavy) box in our {home}. Please help me carry it to {place}.",
    { home: ["flat", "house", "office", "garage"], place: ["my car", "our car", "a taxi", "my room"] }],
  ["fast", "{name} is ______ (fast) swimmer in our {club}.",
    { name: ["Sardor", "Diana", "Timur", "Lola"], club: ["club", "school", "class", "city"] }],
  ["happy", "That was ______ (happy) day of my life. My {person} came home from {city}.",
    { person: ["brother", "father", "sister", "uncle"], city: ["Moscow", "Seoul", "London", "Istanbul"] }],
  ["cold", "January is ______ (cold) month in {city}. Sometimes it snows for {time}.",
    { city: ["Tashkent", "Nukus", "Fergana", "Samarkand"], time: ["a week", "three days", "two days", "a whole week"] }],
  ["funny", "My grandfather tells ______ (funny) stories about his {life} at our family {event}.",
    { life: ["childhood", "school days", "village", "old job"], event: ["dinners", "parties", "weddings", "picnics"] }],
  ["nice", "Our teacher is ______ (nice) person in our {place}. She always {does}.",
    { place: ["school", "college", "lyceum", "academy"], does: ["helps us", "smiles", "listens to us", "explains things twice"] }],
  ["thin", "This is ______ (thin) {device} in this shop, and it costs {price}.",
    { device: ["laptop", "phone", "tablet", "TV"], price: ["a lot", "too much", "a lot of money", "over five million sum"] }],
  ["early", "My mother takes ______ (early) bus to work. It leaves at {time} from our {stop}.",
    { time: ["half past five", "six o'clock", "ten to six", "quarter to six"], stop: ["street", "stop", "corner", "village"] }],
  ["dirty", "My little brother has ______ (dirty) shoes in our family, because he plays {where} with his {friends}.",
    { where: ["in puddles", "in our yard", "in a field", "near a river"], friends: ["friends", "cousins", "dog", "classmates"] }],
  ["small", "Our {room} is ______ (small) room in our flat, but it is very {state}.",
    { room: ["kitchen", "bathroom", "bedroom", "study"], state: ["warm", "bright", "clean", "cosy"] }],
  ["high", "Chimgan has some of ______ (high) mountains near Tashkent. We go there {when} with our {people}.",
    { when: ["every winter", "every spring", "in summer", "at weekends"], people: ["families", "friends", "cousins", "classmates"] }],
].map(([adj, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `the ${est(adj)}`, why: why(adj), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ALL = "Rewrite the sentence with a superlative. Use the + -est of the adjective in brackets.";
const THREE = "Read the facts. Then complete the sentence with the + -est of the adjective in brackets.";
const FIX = "Correct the mistake in the superlative.";
const TRANSFORM = [
  // comparative + "than all the others" -> superlative (5)
  [ALL, "tall", "Aziz is taller than all the other boys in our {group}. He plays {sport}.", "Aziz is ______ (tall) boy in our {group}. He plays {sport}.",
    "Taller than all the others means the tallest.",
    { group: ["class", "group", "year", "building"], sport: ["basketball", "volleyball", "football", "tennis"] }],
  [ALL, "cheap", "This {dish} is cheaper than all the other dishes in this {place}.", "This {dish} is ______ (cheap) dish in this {place}.",
    "Cheaper than all the others means the cheapest.",
    { dish: ["soup", "salad", "samsa", "plov"], place: ["café", "canteen", "restaurant", "teahouse"] }],
  [ALL, "heavy", "This box is heavier than all the other boxes. Please carry it to {place} with {who}.", "This is ______ (heavy) box. Please carry it to {place} with {who}.",
    "Heavier than all the others means the heaviest.",
    { place: ["my car", "your room", "our kitchen", "a taxi"], who: ["your brother", "Sardor", "your father", "a friend"] }],
  [ALL, "big", "Our {room} is bigger than all the other rooms in our {home}.", "Our {room} is ______ (big) room in our {home}.",
    "Bigger than all the others means the biggest.",
    { room: ["living room", "kitchen", "bedroom", "hall"], home: ["flat", "house", "dacha", "new flat"] }],
  [ALL, "early", "On {day}, my train leaves earlier than all the other trains to {city}.", "On {day}, my train is ______ (early) train to {city}.",
    "Earlier than all the others means the earliest.",
    { day: ["Monday", "Friday", "Saturday", "Sunday"], city: ["Samarkand", "Bukhara", "Andijan", "Karshi"] }],
  // three facts -> the one at the top (5)
  [THREE, "old", "Lola is 15, Madina is 16 and {name} is 17. They all live in {city}.", "Of these three girls, {name} is ______ (old). They all live in {city}.",
    "Seventeen is the highest age of the three, so she is the oldest.",
    { name: ["Olga", "Zarina", "Sevara", "Nigora"], city: ["Tashkent", "Fergana", "Samarkand", "Urgench"] }],
  [THREE, "fast", "Aziz ran 100 metres in 14 seconds, Sardor in 13 and {name} in 12.", "Of these three boys, {name} is ______ (fast).",
    "Twelve seconds is the shortest time, so he is the fastest.",
    { name: ["Timur", "Jasur", "Bekzod", "Ivan"] }],
  [THREE, "cold", "In {city}, January is 0°C, February is 3°C and December is minus 2°C.", "In {city}, December is ______ (cold) of these three months.",
    "Minus two is the lowest temperature, so December is the coldest.",
    { city: ["Tashkent", "Samarkand", "Namangan", "Jizzakh"] }],
  [THREE, "tall", "In my family, my {relative} is 160 cm, my mother is 165 cm and my father is 180 cm.", "In my family, my father is ______ (tall).",
    "A hundred and eighty is the biggest number, so my father is the tallest.",
    { relative: ["sister", "brother", "grandmother", "aunt"] }],
  [THREE, "long", "From our {home} to {place}, road A is 10 km, road B is 15 km and road C is 25 km.", "From our {home} to {place}, road C is ______ (long) way.",
    "Twenty-five kilometres is the most of the three, so road C is the longest way.",
    { home: ["house", "school", "village", "office"], place: ["Chimgan", "Charvak", "Parkent", "Gazalkent"] }],
  // correct the mistake (5)
  [FIX, "tall", "Malika is the most tall girl in our {group}. She plays {sport}.", "Malika is ______ (tall) girl in our {group}. She plays {sport}.",
    "Tall is a short adjective, so the superlative is the tallest, never the most tall.",
    { group: ["class", "group", "school", "club"], sport: ["basketball", "volleyball", "tennis", "handball"] }],
  [FIX, "big", "This is the bigest {room} in our {home}.", "This is ______ (big) {room} in our {home}.",
    "Big ends in one vowel and one consonant, so double the g: the biggest.",
    { room: ["room", "bedroom", "window", "cupboard"], home: ["flat", "house", "dacha", "new flat"] }],
  [FIX, "easy", "For {who}, maths was the easyest subject at {school}.", "For {who}, maths was ______ (easy) subject at {school}.",
    "Easy ends in y, so change y to i before -est: the easiest.",
    { who: ["me", "my sister", "my brother", "Aziz"], school: ["school", "primary school", "college", "music school"] }],
  [FIX, "hot", "Today is the hotest day of this {period}, so we are staying {place}.", "Today is ______ (hot) day of this {period}, so we are staying {place}.",
    "Hot ends in one vowel and one consonant, so double the t: the hottest.",
    { period: ["summer", "week", "month", "year"], place: ["at home", "inside", "indoors", "in our flat"] }],
  [FIX, "fast", "Kamila is fastest runner in our {club}. She trains every {day}.", "Kamila is ______ (fast) runner in our {club}. She trains every {day}.",
    "A superlative needs the in front of it: the fastest.",
    { club: ["club", "class", "school", "team"], day: ["morning", "evening", "day", "weekend"] }],
].map(([instr, adj, source, hint, lead, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `the ${est(adj)}`,
  why: instr === FIX ? lead : `${lead} ${RULE[FORMS[adj][2]](adj)}`, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the tallest, oldest or youngest person in your family.", "the + an -est adjective",
    ["exactly one sentence", "must name a family member", "must use the before the superlative"]],
  ["Write one sentence about the biggest or oldest city you know in Uzbekistan.", "the biggest or the oldest",
    ["exactly one sentence", "must name a city", "must use in after the noun"]],
  ["Write one sentence about the hottest or coldest month where you live.", "the hottest or the coldest",
    ["exactly one sentence", "must name a month", "must use the before the superlative"]],
  ["Write one sentence about the easiest subject for you at school or university.", "the easiest",
    ["exactly one sentence", "must name a subject", "must use the y-to-i spelling"]],
  ["Write one sentence about the busiest day of your week.", "the busiest",
    ["exactly one sentence", "must name a day", "must say why"]],
  ["Write one sentence about the cheapest or nicest place to eat near your home.", "the cheapest or the nicest",
    ["exactly one sentence", "must name or describe a place", "must use the before the superlative"]],
  ["Write one sentence about the happiest day of your life.", "the happiest",
    ["exactly one sentence", "must use day of my life", "must say what happened"]],
  ["Write two sentences about two friends: who is the tallest and who is the funniest in your group?", "two -est superlatives with the",
    ["exactly two sentences", "two different superlatives", "the before each superlative"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your family. Who is the oldest, the youngest, the tallest and the funniest? Write three or four sentences.",
    "the + -est superlatives about people", ["the before every superlative", "-est forms", "y changed to i: funniest"]],
  ["A friend from abroad wants to visit Uzbekistan. Tell them about the best-known places: the oldest city, the biggest market, the highest mountains. Write three or four sentences.",
    "the + -est superlatives about places", ["the oldest, the biggest or the highest", "in after the noun", "doubled consonants: biggest, hottest"]],
  ["Describe your week. Which is the busiest day, the longest day and the easiest day? Write three or four sentences.",
    "the + -est superlatives about time", ["the busiest, the longest, the easiest", "of my week or in my week", "y changed to i"]],
  ["Describe the weather where you live through the year. Which month is the hottest, the coldest and the nicest? Write three or four sentences.",
    "the + -est superlatives about weather", ["the hottest, the coldest, the nicest", "month names", "no most before short adjectives"]],
  ["Describe your class or group. Who is the fastest, the youngest or the quietest? Write three or four sentences.",
    "the + -est superlatives about a group", ["the before every superlative", "in our class or in my group", "no comparative where a superlative is needed"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.superlative.est-superlative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);