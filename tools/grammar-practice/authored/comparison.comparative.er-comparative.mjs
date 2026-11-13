// Hand-authored: comparison / comparative / er-comparative (A1).
// Speaking Pack batch 2, topic 1 (grammar-run/SPEAK-2.md).
//
// Tests ONE point: a short adjective takes -er (+ than) to compare two things
// ("My brother is taller than me"). The placement bank's three items set the
// scope: -er + than, the spelling of -er (hot -> hotter, easy -> easier,
// nice -> nicer), and -er rather than "more fast".
//
// Kept apart from its siblings: more-comparative (long adjectives), the
// double-comparative-error topic ("more bigger" is never offered or taught
// here) and less-comparative. Only adjectives whose "more X" form is wrong
// English are used, so "more fast / more cheap" is always an error:
// clever, quiet, simple, narrow, polite and friendly are left out on purpose.
// -y adjectives never get a "more" distractor ("more happy" is heard from
// natives); they get the spelling error easyer instead.
//
// Slots never touch the adjective or the two things compared where the
// comparison would stop being true; every filler keeps the sentence true and
// natural with every filler of the other slot.
//
// Run: node tools/grammar-practice/authored/comparison.comparative.er-comparative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "comparative", topic: "er-comparative", level: "A1", pv: "2.5" };

// kind: "reg" (add -er), "dbl" (double the last consonant), "y" (y -> ier), "e" (add -r)
const est = (adj, er) => er.replace(/er$/, "est");
const opts = (adj, er, kind) => {
  if (kind === "dbl") return [er, `${adj}er`, adj, `more ${adj}`];
  if (kind === "y") return [er, `${adj}er`, adj, est(adj, er)];
  return [er, adj, est(adj, er), `more ${adj}`];
};
const RULE = {
  reg: (a, er) => `${cap(a)} is a short adjective, so add -er: ${er}.`,
  dbl: (a, er) => `${cap(a)} ends in one vowel and one consonant, so double the last letter: ${er}.`,
  y: (a, er) => `${cap(a)} ends in y, so change y to i and add -er: ${er}.`,
  e: (a, er) => `${cap(a)} already ends in e, so just add -r: ${er}.`,
};
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const THAN = "Use than after it to compare two things.";
const NOT_MORE = "Short adjectives take -er, not more.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["tall", "taller", "reg", "My {relative} is ______ than me. We both play {sport} after school.",
    { relative: ["brother", "cousin", "sister", "best friend"], sport: ["basketball", "volleyball", "football", "tennis"] }],
  ["cheap", "cheaper", "reg", "The bus is ______ than a taxi, so I take it to {place} every {time}.",
    { place: ["school", "university", "work", "the market"], time: ["day", "morning", "weekday", "afternoon"] }],
  ["fast", "faster", "reg", "The metro is ______ than the bus, so I use it to get to {place} in the {time}.",
    { place: ["work", "university", "college", "the city centre"], time: ["morning", "evening", "afternoon", "rush hour"] }],
  ["hot", "hotter", "dbl", "In {city}, July is ______ than June. We {activity} every evening.",
    { city: ["Tashkent", "Bukhara", "Samarkand", "Termez"], activity: ["sit outside", "go swimming", "eat ice cream", "drink cold water"] }],
  ["big", "bigger", "dbl", "Our new flat is ______ than the old one. It has {rooms} and it is near the {place}.",
    { rooms: ["three bedrooms", "four rooms", "two balconies", "a big hall"], place: ["park", "metro", "market", "school"] }],
  ["old", "older", "reg", "My phone is ______ than my sister's phone. I got it {when} from my {person}.",
    { when: ["four years ago", "five years ago", "a long time ago", "six years ago"], person: ["uncle", "father", "aunt", "grandmother"] }],
  ["young", "younger", "reg", "My little {sibling} is ______ than me, so I often help with {task}.",
    { sibling: ["brother", "sister", "cousin", "nephew"], task: ["homework", "maths", "reading", "English"] }],
  ["cold", "colder", "reg", "Today is ______ than yesterday, so I am wearing my {clothes} and {extra}.",
    { clothes: ["warm coat", "winter jacket", "thick sweater", "boots"], extra: ["a scarf", "a hat", "gloves", "warm socks"] }],
  ["easy", "easier", "y", "For me, English is ______ than {subject}. I {verb} it every day.",
    { subject: ["maths", "physics", "chemistry", "history"], verb: ["study", "speak", "read", "use"] }],
  ["long", "longer", "reg", "In summer, the days are ______ than in winter, so we play {sport} outside until {time}.",
    { sport: ["football", "volleyball", "tennis", "basketball"], time: ["eight o'clock", "nine o'clock", "late", "dark"] }],
  ["strong", "stronger", "reg", "My father is ______ than me. He can carry {thing} to the {place} easily.",
    { thing: ["the big bags", "the heavy box", "two suitcases", "the water bottles"], place: ["car", "fifth floor", "kitchen", "taxi"] }],
  ["small", "smaller", "reg", "My room is ______ than my brother's room, but it has a {thing} and a big {thing2}.",
    { thing: ["desk", "lamp", "bookshelf", "sofa"], thing2: ["window", "bed", "mirror", "cupboard"] }],
  ["warm", "warmer", "reg", "My new {clothes} is ______ than my old one. I bought it at the {place}.",
    { clothes: ["coat", "jacket", "sweater", "hat"], place: ["market", "bazaar", "mall", "shop"] }],
  ["slow", "slower", "reg", "My old laptop is ______ than my new {device}, so I use it only for {task}.",
    { device: ["phone", "tablet", "computer", "work laptop"], task: ["music", "films", "my notes", "email"] }],
  ["busy", "busier", "y", "On Saturday, the bazaar is ______ than on Monday. Many people buy {food} and {food2} there.",
    { food: ["fruit", "meat", "vegetables", "bread"], food2: ["rice", "flour", "tea", "sweets"] }],
  ["heavy", "heavier", "y", "My school bag is ______ than my brother's bag because I carry my {thing} and a big {book}.",
    { thing: ["laptop", "lunch", "water bottle", "sports clothes"], book: ["dictionary", "maths book", "atlas", "notebook"] }],
  ["early", "earlier", "y", "My mother gets up ______ than everyone in our family. She makes {food} and {drink} for us.",
    { food: ["breakfast", "eggs", "porridge", "sandwiches"], drink: ["tea", "coffee", "juice", "compote"] }],
  ["high", "higher", "reg", "The mountains near Chimgan are ______ than the hills near our {place}. We go there {time}.",
    { place: ["village", "town", "city", "house"], time: ["in spring", "in summer", "every summer", "at the weekend"] }],
  ["thin", "thinner", "dbl", "This {book} is ______ than that one. I can read it in {time}.",
    { book: ["book", "novel", "story book", "magazine"], time: ["one day", "two days", "an evening", "a week"] }],
  ["nice", "nicer", "e", "The weather today is ______ than yesterday, so let's go to the {place} with {people}.",
    { place: ["park", "lake", "river", "mountains"], people: ["our friends", "the children", "my cousins", "your sister"] }],
].map(([adj, er, kind, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq",
  prompt, options: opts(adj, er, kind), key: 0,
  why: `${RULE[kind](adj, er)} ${kind === "y" ? THAN : NOT_MORE}`, slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the comparative form (-er) of the word in brackets.";
const BUILD = [
  ["big", "bigger", "dbl", "Tashkent is ______ (big) than {city}. It has a metro and many {place}.",
    { city: ["Samarkand", "Bukhara", "Namangan", "Andijan"], place: ["parks", "universities", "theatres", "markets"] }],
  ["hot", "hotter", "dbl", "Be careful! This {drink} is ______ (hot) than the {food}.",
    { drink: ["soup", "tea", "coffee", "milk"], food: ["plov", "bread", "salad", "juice"] }],
  ["cheap", "cheaper", "reg", "Vegetables at the {place} are ______ (cheap) than in the {shop}.",
    { place: ["bazaar", "market", "village market", "street market"], shop: ["supermarket", "mall", "city centre", "big stores"] }],
  ["fast", "faster", "reg", "My cousin can run ______ (fast) than me. He trains at the {place} every {day}.",
    { place: ["stadium", "gym", "park", "sports club"], day: ["morning", "evening", "weekend", "afternoon"] }],
  ["easy", "easier", "y", "This {test} is ______ (easy) than the last one. I know all the {words}.",
    { test: ["test", "quiz", "exam", "exercise"], words: ["words", "answers", "rules", "verbs"] }],
  ["young", "younger", "reg", "My sister is ______ (young) than me. She is still at {place} and she loves {thing}.",
    { place: ["school", "primary school", "kindergarten", "music school"], thing: ["drawing", "dancing", "cartoons", "music"] }],
  ["short", "shorter", "reg", "In December, the days are ______ (short) than in {month}, so I go home in the dark after {thing}.",
    { month: ["June", "July", "May", "August"], thing: ["school", "work", "lessons", "training"] }],
  ["heavy", "heavier", "y", "This suitcase is ______ (heavy) than my {bag}. Can you help me carry it to the {place}?",
    { bag: ["backpack", "school bag", "sports bag", "handbag"], place: ["car", "taxi", "bus", "door"] }],
  ["happy", "happier", "y", "Our cat is ______ (happy) in the new flat than in the old one. It sleeps on the {place} by the {thing}.",
    { place: ["sofa", "bed", "carpet", "chair"], thing: ["window", "heater", "door", "balcony"] }],
  ["warm", "warmer", "reg", "Our kitchen is ______ (warm) than the other rooms, so we often {act} there with {who}.",
    { act: ["eat", "sit", "do homework", "drink tea"], who: ["our grandparents", "the children", "my little brother", "my aunt"] }],
  ["strong", "stronger", "reg", "Coffee is ______ (strong) than tea, so my father drinks only one {cup} {when}.",
    { cup: ["cup", "small cup", "glass", "mug"], when: ["before work", "at breakfast", "after lunch", "in the morning"] }],
  ["new", "newer", "reg", "This {bus} is ______ (new) than the old ones. It has {feature} and {feature2}.",
    { bus: ["bus", "train", "metro train", "minibus"], feature: ["air conditioning", "big windows", "soft seats", "bright lights"], feature2: ["free Wi-Fi", "phone chargers", "screens", "a clean floor"] }],
  ["thin", "thinner", "dbl", "This {thing} is ______ (thin) than that one, so it fits in my {bag}.",
    { thing: ["notebook", "book", "phone", "tablet"], bag: ["pocket", "small bag", "backpack", "jacket pocket"] }],
  ["busy", "busier", "y", "My mother is ______ (busy) than my father because she works at the {place} and looks after my little {sibling}.",
    { place: ["hospital", "school", "bank", "market"], sibling: ["brother", "sister", "cousin", "nephew"] }],
  ["dirty", "dirtier", "y", "My shoes are ______ (dirty) than yours because I walked through the {place} after the {event}.",
    { place: ["park", "field", "garden", "yard"], event: ["rain", "snow", "storm", "football match"] }],
  ["safe", "safer", "e", "The new road is ______ (safe) than the old one, so children can walk to {place} with their {person}.",
    { place: ["school", "the park", "the shop", "the stadium"], person: ["friends", "brothers", "sisters", "classmates"] }],
  ["high", "higher", "reg", "My score in English is ______ (high) than my score in {subject}, so my {person} is happy.",
    { subject: ["maths", "history", "physics", "chemistry"], person: ["teacher", "mother", "father", "grandfather"] }],
  ["clean", "cleaner", "reg", "The air in the mountains is ______ (clean) than the air in the {city}, so we go to {place} every summer.",
    { city: ["city", "city centre", "capital", "town"], place: ["Chimgan", "Zaamin", "the hills", "the mountains"] }],
  ["cold", "colder", "reg", "Water from the {source} is ______ (cold) than water from the tap, so we drink it on hot {time}.",
    { source: ["spring", "well", "fridge", "mountain stream"], time: ["days", "afternoons", "evenings", "mornings"] }],
  ["funny", "funnier", "y", "This cartoon is ______ (funny) than the film we watched on {day}. My {person} laughed a lot.",
    { day: ["Monday", "Friday", "Sunday", "Saturday"], person: ["sister", "brother", "cousin", "grandmother"] }],
].map(([adj, er, kind, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: er,
  why: `${RULE[kind](adj, er)} ${THAN}`, slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TURN = "Rewrite the sentence so it says the same thing from the other side. Use the comparative form of the word in brackets.";
const JOIN = "Join the two facts into one sentence. Use the comparative form of the word in brackets and than.";
const FIX = "Correct the mistake. Short adjectives take -er, not more.";
const TRANSFORM = [
  // turn the comparison round with the opposite adjective (5)
  [TURN, "In the {pic}, my brother is shorter than my {relative}.", "In the {pic}, my {relative} is ______ (tall) than my brother.", "taller",
    "Short and tall are opposites. Tall is a short adjective, so it becomes taller.",
    { pic: ["photo", "family photo", "picture", "video"], relative: ["cousin", "father", "uncle", "best friend"] }],
  [TURN, "The neighbours' {pet2} is older than our {pet}.", "Our {pet} is ______ (young) than the neighbours' {pet2}.", "younger",
    "Old and young are opposites. Young is a short adjective, so it becomes younger.",
    { pet2: ["dog", "cat", "goat", "horse"], pet: ["cat", "dog", "rabbit", "parrot"] }],
  [TURN, "The bus to {city} is slower than the {fast}.", "The {fast} to {city} is ______ (fast) than the bus.", "faster",
    "Slow and fast are opposites. Fast is a short adjective, so it becomes faster, not more fast.",
    { city: ["Samarkand", "Bukhara", "Karshi", "Navoi"], fast: ["train", "plane", "express train", "high-speed train"] }],
  [TURN, "The old {device} in my {room} is bigger than the new one.", "The new {device} is ______ (small) than the old one in my {room}.", "smaller",
    "Big and small are opposites. Small is a short adjective, so it becomes smaller.",
    { device: ["phone", "laptop", "TV", "fan"], room: ["bedroom", "kitchen", "living room", "office"] }],
  [TURN, "In {city}, January is colder than {month}.", "In {city}, {month} is ______ (warm) than January.", "warmer",
    "Cold and warm are opposites. Warm is a short adjective, so it becomes warmer.",
    { city: ["Tashkent", "Samarkand", "Nukus", "Fergana"], month: ["April", "May", "June", "September"] }],
  // join two facts into one comparison (5)
  [JOIN, "For the trip to {city}, my suitcase is 20 kilos and your {bag} is 15 kilos.", "For the trip to {city}, my suitcase is ______ (heavy) than your {bag}.", "heavier",
    "Twenty kilos is more than fifteen, so my suitcase is heavier. Heavy ends in y: change y to i and add -er.",
    { city: ["Samarkand", "Moscow", "Bukhara", "Istanbul"], bag: ["suitcase", "bag", "backpack", "sports bag"] }],
  [JOIN, "Aziza is 15 and her cousin {name} is 12. They live in {city}.", "Aziza is ______ (old) than her cousin {name}. They live in {city}.", "older",
    "Fifteen is more than twelve, so Aziza is older. Old is a short adjective: add -er.",
    { name: ["Madina", "Olga", "Lola", "Dilnoza"], city: ["Tashkent", "Fergana", "Samarkand", "Urgench"] }],
  [JOIN, "A metro ticket to the {place} is 3,000 sum and a taxi is 30,000 sum.", "A metro ticket to the {place} is ______ (cheap) than a taxi.", "cheaper",
    "The ticket costs less money, so it is cheaper. Cheap is a short adjective: add -er.",
    { place: ["airport", "station", "city centre", "university"] }],
  [JOIN, "Lola gets up at six and walks to {place}. Her {sibling} gets up at eight.", "Lola gets up ______ (early) than her {sibling} and walks to {place}.", "earlier",
    "Six o'clock comes before eight, so Lola gets up earlier. Early ends in y: change y to i and add -er.",
    { place: ["school", "college", "work", "the gym"], sibling: ["brother", "sister", "cousin", "father"] }],
  [JOIN, "My walk to {place} is 20 minutes. My {friend}'s walk is 10 minutes.", "My walk to {place} is ______ (long) than my {friend}'s walk.", "longer",
    "Twenty minutes is more than ten, so my walk is longer. Long is a short adjective: add -er.",
    { place: ["school", "work", "the metro", "the bus stop"], friend: ["friend", "sister", "brother", "cousin"] }],
  // correct "more + short adjective" (5)
  [FIX, "My new {device} is more fast than my old one, and the {part} is better.", "My new {device} is ______ (fast) than my old one, and the {part} is better.", "faster",
    "Fast has one syllable, so add -er: faster. Never more fast.",
    { device: ["phone", "laptop", "tablet", "computer"], part: ["camera", "screen", "battery", "sound"] }],
  [FIX, "Today is more hot than yesterday. Let's stay in the {place} and drink {drink}.", "Today is ______ (hot) than yesterday. Let's stay in the {place} and drink {drink}.", "hotter",
    "Hot is a short adjective. Double the t and add -er: hotter. Never more hot.",
    { place: ["shade", "house", "kitchen", "garden"], drink: ["cold water", "green tea", "juice", "ayran"] }],
  [FIX, "My {sibling} is more young than me, but {sport} is easy for us both.", "My {sibling} is ______ (young) than me, but {sport} is easy for us both.", "younger",
    "Young is a short adjective, so add -er: younger. Never more young.",
    { sibling: ["brother", "sister", "cousin", "friend"], sport: ["swimming", "running", "chess", "football"] }],
  [FIX, "This {item} is more cheap than that one, and the colour is {nice}.", "This {item} is ______ (cheap) than that one, and the colour is {nice}.", "cheaper",
    "Cheap is a short adjective, so add -er: cheaper. Never more cheap.",
    { item: ["bag", "jacket", "phone case", "scarf"], nice: ["nice", "beautiful", "better", "lovely"] }],
  [FIX, "Your {room} is more big than mine, so we can do our {task} there.", "Your {room} is ______ (big) than mine, so we can do our {task} there.", "bigger",
    "Big is a short adjective. Double the g and add -er: bigger. Never more big.",
    { room: ["room", "kitchen", "balcony", "flat"], task: ["homework", "project", "painting", "revision"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence comparing you and someone in your family. Who is taller, older or younger?", "a short adjective with -er plus than",
    ["exactly one sentence", "must name a family member", "must use than"]],
  ["Write one sentence comparing two cities or towns in Uzbekistan that you know.", "a short adjective with -er plus than",
    ["exactly one sentence", "must name two places", "must use than"]],
  ["Write one sentence comparing the weather today and the weather yesterday.", "hotter, colder, warmer or another -er adjective plus than",
    ["exactly one sentence", "must include today", "must use than"]],
  ["Write one sentence comparing two ways to get to school, university or work: bus, metro, taxi, walking or bike.", "faster, slower, cheaper or another -er adjective plus than",
    ["exactly one sentence", "must name two kinds of transport", "must use than"]],
  ["Write one sentence comparing your phone with a friend's phone or an old phone.", "a short adjective with -er plus than",
    ["exactly one sentence", "must be about a phone", "must use than"]],
  ["Write one sentence comparing two school subjects. Which is easier for you?", "easier or another -er adjective plus than",
    ["exactly one sentence", "must name two subjects", "must use than"]],
  ["Write one sentence with an adjective that doubles its last letter: big, hot, thin or fat.", "bigger, hotter, thinner or fatter plus than",
    ["exactly one sentence", "must use a doubled -er spelling", "must use than"]],
  ["Write two sentences comparing your home now with a home you lived in before.", "two short adjectives with -er plus than",
    ["exactly two sentences", "two different -er adjectives", "must use than"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare yourself with a brother, sister, cousin or friend. Who is taller, older, faster or stronger? Write three or four sentences.",
    "short adjectives with -er plus than", ["-er adjectives", "than after the adjective", "no more before a short adjective"]],
  ["Compare summer and winter where you live. Write three or four sentences.",
    "short adjectives with -er plus than for weather and days", ["hotter, colder, longer or shorter", "than", "correct spelling such as hotter"]],
  ["Compare your city or village with another place you know. Write three or four sentences.",
    "short adjectives with -er plus than for places", ["bigger, smaller, older or newer", "than", "two places named"]],
  ["A friend from another country is coming to visit you. Compare two ways to travel around your city. Write three or four sentences.",
    "short adjectives with -er plus than for transport", ["faster, slower, cheaper or safer", "than", "no more before a short adjective"]],
  ["Think about yourself five years ago. Compare the old you and the you of today. Write three or four sentences.",
    "short adjectives with -er plus than for change over time", ["taller, older, busier or happier", "y changed to i before -er", "than"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.comparative.er-comparative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);