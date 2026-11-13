// Hand-authored: comparison / comparative / more-comparative (A2).
// Speaking Pack batch 2, topic 2 (grammar-run/SPEAK-2.md).
//
// Tests ONE point: a long adjective (two or more syllables, not ending in -y)
// takes more + adjective (+ than) to compare: "A train is more comfortable
// than a bus." Placement item: "more + long adjective".
//
// Distractors are the real errors: -er on a long adjective (comfortabler,
// the error the placement item uses), the superlative (most comfortable) and
// the bare adjective. "more comfortabler" is NOT offered: that is the
// double-comparative-error topic. -y adjectives (easy, healthy, busy) are left
// out (they take -ier, see er-comparative), and so are adjectives where both
// forms are correct English (clever, quiet, simple, narrow, polite, friendly,
// common, pleasant, gentle, honest), so "-er" is always wrong here.
//
// Typed keys are two words ("more expensive"), so no item prints "more"
// anywhere else in its sentence.
//
// Run: node tools/grammar-practice/authored/comparison.comparative.more-comparative.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "comparative", topic: "more-comparative", level: "A2", pv: "2.5" };

const cap = (s) => s[0].toUpperCase() + s.slice(1);
// The -er error as learners actually spell it. Adjectives ending in -ed / -ing
// get "very + adjective" instead (crowdeder, excitinger are not real errors;
// "very crowded than" is).
const WRONG_ER = {
  comfortable: "comfortabler", expensive: "expensiver", interesting: "interestinger", difficult: "difficulter",
  beautiful: "beautifuller", dangerous: "dangerouser", popular: "popularer", important: "importanter",
  famous: "famouser", modern: "moderner", delicious: "deliciouser", useful: "usefuller",
  careful: "carefuller", peaceful: "peacefuller", nervous: "nervouser",
};
const opts = (adj) => [`more ${adj}`, WRONG_ER[adj] || `very ${adj}`, `most ${adj}`, adj];
const why = (adj) => `${cap(adj)} is a long adjective, so put more in front of it: more ${adj}. Long adjectives never take -er.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["comfortable", "A train is ______ than a bus, so I always take the train to {city} with my {person}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Karshi"], person: ["family", "parents", "grandmother", "friends"] }],
  ["expensive", "A taxi is ______ than the metro, so I only take one when I am late for {thing} or carrying {load}.",
    { thing: ["work", "class", "a lesson", "the doctor"], load: ["heavy bags", "a big box", "my suitcase", "a lot of shopping"] }],
  ["interesting", "For me, history is ______ than {subject}. I love stories about {topic}.",
    { subject: ["maths", "physics", "chemistry", "geography"], topic: ["old cities", "the Silk Road", "famous people", "ancient Samarkand"] }],
  ["difficult", "English grammar is ______ than English {part} for me, so I study it every {time}.",
    { part: ["vocabulary", "listening", "reading", "spelling"], time: ["evening", "morning", "weekend", "day"] }],
  ["beautiful", "In spring, our {place} is ______ than in winter. There are {flowers} everywhere.",
    { place: ["garden", "village", "city", "park"], flowers: ["flowers", "green trees", "tulips", "roses"] }],
  ["dangerous", "Riding a bike on the main road is ______ than riding in the {place}, so I always wear a {thing}.",
    { place: ["park", "yard", "village", "quiet streets"], thing: ["helmet", "bright jacket", "safety vest", "bike helmet"] }],
  ["popular", "Football is ______ than tennis at my {place}. Every day, my classmates play it in the {area}.",
    { place: ["school", "college", "university", "lyceum"], area: ["yard", "park", "stadium", "gym"] }],
  ["important", "For my parents, my studies are ______ than {thing}, so I do my homework before I {fun}.",
    { thing: ["football", "games", "my phone", "parties"], fun: ["watch TV", "play games", "meet friends", "go out"] }],
  ["famous", "Samarkand is ______ than our {town}. Tourists from {country} visit it every year.",
    { town: ["town", "village", "district", "city"], country: ["Japan", "Germany", "Korea", "France"] }],
  ["modern", "The new {building} in our city is ______ than the old one. It has {feature}.",
    { building: ["hospital", "library", "school", "station"], feature: ["lifts", "big windows", "free Wi-Fi", "a café"] }],
  ["delicious", "My grandmother's plov is ______ than the plov at the {place}. She cooks it with {ingredient}.",
    { place: ["café", "restaurant", "canteen", "wedding"], ingredient: ["lamb", "yellow carrots", "raisins", "chickpeas"] }],
  ["useful", "My phone is ______ than my laptop on the {transport}. I can read {thing} on it.",
    { transport: ["bus", "metro", "train", "plane"], thing: ["books", "the news", "my notes", "messages"] }],
  ["crowded", "At {hour}, the metro is ______ than at midday, because everyone is going to {place}.",
    { hour: ["eight o'clock", "half past seven", "eight thirty", "quarter to eight"], place: ["work", "school", "university", "their offices"] }],
  ["exciting", "A football match at the stadium is ______ than a match on {screen}. You can hear the {sound}.",
    { screen: ["TV", "my phone", "a laptop", "a tablet"], sound: ["fans", "music", "drums", "crowd"] }],
  ["careful", "My sister is a ______ driver than my brother. She always drives slowly near {place} and stops for {who}.",
    { place: ["schools", "the market", "parks", "our house"], who: ["people", "children", "old people", "cyclists"] }],
  ["tiring", "Working in the {place} is ______ than working in an office, so my {relative} goes to bed early every evening.",
    { place: ["fields", "market", "garden", "factory"], relative: ["uncle", "aunt", "cousin", "father"] }],
  ["relaxing", "For me, a walk in the {place} is ______ than a day at the mall. I listen to the {sound}.",
    { place: ["park", "mountains", "garden", "forest"], sound: ["birds", "music", "river", "wind"] }],
  ["peaceful", "Life in my grandparents' {place} is ______ than life in the city. There are no {thing}.",
    { place: ["village", "small town", "mountain village", "little town"], thing: ["traffic jams", "loud cars", "crowds", "big shops"] }],
  ["nervous", "I am ______ before a speaking test than before a written test, so I practise with {person} at {place}.",
    { person: ["my friend", "my teacher", "my sister", "my tutor"], place: ["home", "school", "the library", "a café"] }],
  ["boring", "For my little brother, a museum is ______ than a park. He wants to {action} all day.",
    { action: ["run", "play football", "ride his bike", "climb trees"] }],
].map(([adj, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: opts(adj), key: 0, why: why(adj), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the comparative form of the adjective in brackets (more + adjective).";
const BUILD = [
  ["expensive", "Clothes at the mall are ______ (expensive) than at the {place}. I buy my {item} there.",
    { place: ["bazaar", "market", "street market", "village market"], item: ["shoes", "jeans", "T-shirts", "jackets"] }],
  ["comfortable", "My new {furniture} is ______ (comfortable) than the old one. I sit on it every {time}.",
    { furniture: ["sofa", "chair", "armchair", "desk chair"], time: ["evening", "morning", "day", "weekend"] }],
  ["interesting", "This {book} is ______ (interesting) than the film. My {person} gave it to me.",
    { book: ["book", "story", "novel", "comic"], person: ["teacher", "aunt", "cousin", "best friend"] }],
  ["difficult", "The {subject} test was ______ (difficult) than the English test, so I need to study with {person}.",
    { subject: ["maths", "physics", "chemistry", "history"], person: ["my tutor", "a friend", "my brother", "my teacher"] }],
  ["beautiful", "I think Khiva is ______ (beautiful) than many big cities. The old {thing} are amazing, especially in the {time}.",
    { thing: ["walls", "towers", "streets", "gates"], time: ["evening", "morning", "spring", "autumn"] }],
  ["dangerous", "Swimming in the {water} is ______ (dangerous) than swimming in a pool, so I always swim with {who}.",
    { water: ["river", "canal", "lake", "sea"], who: ["my father", "a friend", "my uncle", "my brother"] }],
  ["popular", "Basketball is ______ (popular) than volleyball at our {place}. Many {people} play it after lessons.",
    { place: ["school", "college", "university", "lyceum"], people: ["students", "boys", "girls", "teachers"] }],
  ["important", "Sleep is ______ (important) than games before an exam, so I go to bed at {time} and turn off my {device}.",
    { time: ["ten", "ten o'clock", "half past nine", "eleven"], device: ["phone", "laptop", "tablet", "computer"] }],
  ["famous", "Bukhara is ______ (famous) than my home {town}. People come to see its old {thing}.",
    { town: ["town", "village", "city", "district"], thing: ["streets", "buildings", "markets", "towers"] }],
  ["modern", "Our new {room} is ______ (modern) than the old one. It has {feature} and a big screen.",
    { room: ["classroom", "computer room", "library", "reading room"], feature: ["new desks", "fast computers", "air conditioning", "bright lights"] }],
  ["delicious", "Fresh {food} from my grandmother's {where} are ______ (delicious) than {food} from the supermarket.",
    { food: ["tomatoes", "cucumbers", "apples", "grapes"], where: ["garden", "village", "farm", "yard"] }],
  ["useful", "For me, a dictionary app is ______ (useful) than a paper dictionary, because I can use it on the {transport} or at {place}.",
    { transport: ["bus", "metro", "train", "plane"], place: ["work", "school", "university", "home"] }],
  ["crowded", "The bazaar is ______ (crowded) on Sunday than on weekdays, so we go early to buy {food} and {food2}.",
    { food: ["fruit", "meat", "vegetables", "bread"], food2: ["rice", "flour", "tea", "eggs"] }],
  ["exciting", "For my brother, {sport} is ______ (exciting) than {sport2}.",
    { sport: ["football", "basketball", "kurash", "wrestling"], sport2: ["chess", "golf", "running", "swimming"] }],
  ["careful", "My father is ______ (careful) with money than me. He saves a little every {time} for {goal}.",
    { time: ["week", "month", "day", "Friday"], goal: ["holidays", "a new car", "my studies", "our house"] }],
  ["tiring", "A long day at {place} is ______ (tiring) than a day at home, so I drink {drink} in the evening.",
    { place: ["university", "work", "school", "college"], drink: ["tea", "green tea", "warm milk", "ayran"] }],
  ["relaxing", "Drinking tea with my {person} is ______ (relaxing) than watching videos on my {device}.",
    { person: ["grandmother", "family", "friends", "parents"], device: ["phone", "tablet", "laptop", "computer"] }],
  ["patient", "My mother is ______ (patient) than my father when she helps me with {subject}. She explains everything {how}.",
    { subject: ["maths", "physics", "homework", "chemistry"], how: ["slowly", "again", "twice", "carefully"] }],
  ["serious", "My older brother is ______ (serious) than me. He studies {subject} {place}.",
    { subject: ["medicine", "law", "economics", "engineering"], place: ["in Tashkent", "at university", "in Moscow", "in Samarkand"] }],
  ["traditional", "Weddings in my grandparents' {place} are ______ (traditional) than weddings in the city. People dance to {music} all {time}.",
    { place: ["village", "town", "mountain village", "little town"], music: ["old songs", "folk music", "live music", "drums"], time: ["night", "evening", "day", "afternoon"] }],
].map(([adj, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `more ${adj}`, why: why(adj), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SWAP = "Rewrite the sentence with the long adjective in brackets. Keep the meaning.";
const JOIN = "Join the two facts into one comparison. Use the adjective in brackets and than.";
const FIX = "Correct the mistake. Long adjectives use more, not -er.";
const TRANSFORM = [
  // short adjective -> long adjective with the same (or turned-round) meaning (5)
  [SWAP, "A bus ticket to {city} is cheaper than a {train} ticket.", "A {train} ticket to {city} is ______ (expensive) than a bus ticket.", "expensive",
    "Cheap takes -er, but expensive is a long adjective, so it takes more: more expensive.",
    { city: ["Samarkand", "Bukhara", "Namangan", "Termez"], train: ["train", "plane", "fast train", "sleeper train"] }],
  [SWAP, "For me, {subject} is easier than {subject2}.", "For me, {subject2} is ______ (difficult) than {subject}.", "difficult",
    "Easy takes -ier, but difficult is a long adjective, so it takes more: more difficult.",
    { subject: ["English", "history", "art", "music"], subject2: ["maths", "physics", "chemistry", "Russian"] }],
  [SWAP, "For {who}, the park is safer than the main road.", "For {who}, the main road is ______ (dangerous) than the park.", "dangerous",
    "Safe takes -r, but dangerous is a long adjective, so it takes more: more dangerous.",
    { who: ["children", "cyclists", "runners", "families"] }],
  [SWAP, "This {task} is harder than the last one, so I need {help}.", "This {task} is ______ (difficult) than the last one, so I need {help}.", "difficult",
    "Hard and difficult mean the same here. Difficult is a long adjective, so it takes more.",
    { task: ["exercise", "test", "question", "puzzle"], help: ["some help", "a break", "a dictionary", "my teacher"] }],
  [SWAP, "Our {garden} is nicer in May than in {month}.", "Our {garden} is ______ (beautiful) in May than in {month}.", "beautiful",
    "Nice takes -r, but beautiful is a long adjective, so it takes more: more beautiful.",
    { garden: ["garden", "park", "street", "village"], month: ["January", "February", "November", "December"] }],
  // join two facts (5)
  [JOIN, "At the {shop}, the black {device} costs 4 million sum. The white one costs 3 million.", "At the {shop}, the black {device} is ______ (expensive) than the white one.", "expensive",
    "Four million is more money than three million. Expensive is long, so use more expensive.",
    { shop: ["mall", "market", "phone shop", "electronics shop"], device: ["phone", "laptop", "tablet", "watch"] }],
  [JOIN, "Thirty students in our {group} play football. Only five play {sport}.", "In our {group}, football is ______ (popular) than {sport}.", "popular",
    "More people play football. Popular is a long adjective, so use more popular.",
    { group: ["class", "group", "school", "college"], sport: ["tennis", "chess", "volleyball", "golf"] }],
  [JOIN, "On the way to {city}, the train seat is soft and wide. The bus seat is hard and small.", "On the way to {city}, the train seat is ______ (comfortable) than the bus seat.", "comfortable",
    "A soft, wide seat feels better. Comfortable is a long adjective, so use more comfortable.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Karshi"] }],
  [JOIN, "I read the book about {topic} in two days. I stopped the film about {topic} after ten minutes.", "The book about {topic} was ______ (interesting) than the film.", "interesting",
    "You finished the book but not the film. Interesting is a long adjective, so use more interesting.",
    { topic: ["space", "animals", "the Silk Road", "football"] }],
  [JOIN, "There are 200 people at the {place} near our {home} on Sunday. On Tuesday there are 50.", "The {place} near our {home} is ______ (crowded) on Sunday than on Tuesday.", "crowded",
    "Two hundred people is a lot more than fifty. Crowded is a long adjective, so use more crowded.",
    { place: ["bazaar", "park", "mall", "zoo"], home: ["house", "flat", "school", "office"] }],
  // correct the -er error (5)
  [FIX, "This chair is comfortabler than the {other} at {place}.", "This chair is ______ (comfortable) than the {other} at {place}.", "comfortable",
    "Comfortable is a long adjective, so say more comfortable, never comfortabler.",
    { other: ["sofa", "old chair", "bench", "armchair"], place: ["home", "school", "work", "my office"] }],
  [FIX, "My new {club} is interestinger than the old one, and the teacher is {kind}.", "My new {club} is ______ (interesting) than the old one, and the teacher is {kind}.", "interesting",
    "Interesting is a long adjective, so say more interesting, never interestinger.",
    { club: ["class", "course", "club", "group"], kind: ["kind", "friendly", "funny", "young"] }],
  [FIX, "A plane ticket to {city} is expensiver than a train ticket, but the flight is {short}.", "A plane ticket to {city} is ______ (expensive) than a train ticket, but the flight is {short}.", "expensive",
    "Expensive is a long adjective, so say more expensive, never expensiver.",
    { city: ["Nukus", "Termez", "Urgench", "Fergana"], short: ["short", "quick", "only one hour", "under two hours"] }],
  [FIX, "Climbing in the {place} is dangerouser than walking in the {place2}.", "Climbing in the {place} is ______ (dangerous) than walking in the {place2}.", "dangerous",
    "Dangerous is a long adjective, so say more dangerous, never dangerouser.",
    { place: ["mountains", "hills", "canyon", "gorge"], place2: ["park", "garden", "yard", "village"] }],
  [FIX, "For me, my {thing} is usefuller than my laptop at {place}.", "For me, my {thing} is ______ (useful) than my laptop at {place}.", "useful",
    "Useful has two syllables and is a long adjective, so say more useful, never usefuller.",
    { thing: ["phone", "notebook", "tablet", "dictionary"], place: ["school", "work", "university", "college"] }],
].map(([instr, source, hint, adj, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `more ${adj}`, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence comparing two school or university subjects. Which is more interesting for you?", "more + a long adjective + than",
    ["exactly one sentence", "must name two subjects", "must use than"]],
  ["Write one sentence comparing two kinds of transport in your city.", "more comfortable, more expensive or another more + adjective",
    ["exactly one sentence", "must name two kinds of transport", "must use than"]],
  ["Write one sentence comparing two dishes you know. Which one is more delicious?", "more delicious or another more + adjective",
    ["exactly one sentence", "must name two dishes", "must use than"]],
  ["Write one sentence comparing two places in Uzbekistan you would like to visit.", "more beautiful, more famous or another more + adjective",
    ["exactly one sentence", "must name two places", "must use than"]],
  ["Write one sentence comparing two sports or hobbies you like.", "more exciting, more relaxing or another more + adjective",
    ["exactly one sentence", "must name two sports or hobbies", "must use than"]],
  ["Write one sentence comparing two people in your family. Use careful, patient or serious.", "more careful, more patient or more serious + than",
    ["exactly one sentence", "must name two family members", "must use than"]],
  ["Write one sentence comparing your phone with a book or a laptop. Which is more useful for you?", "more useful + than",
    ["exactly one sentence", "must name two things", "must use than"]],
  ["Write two sentences: one with a short adjective (-er) and one with a long adjective (more).", "one -er comparative and one more + adjective comparative",
    ["exactly two sentences", "one -er and one more", "must use than in both"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare life in a big city and life in a village. Which do you prefer, and why? Write three or four sentences.",
    "more + long adjective + than", ["more peaceful, more crowded, more expensive or similar", "than", "no -er on long adjectives"]],
  ["Compare two ways of learning English: with an app or with a teacher. Write three or four sentences.",
    "more + long adjective + than for opinions", ["more useful, more interesting or more difficult", "than", "a reason for your opinion"]],
  ["A tourist asks you about two cities in Uzbekistan. Compare them for the tourist. Write three or four sentences.",
    "more + long adjective + than for places", ["more beautiful, more famous or more modern", "than", "two cities named"]],
  ["Compare your school or university now with your school a few years ago. Write three or four sentences.",
    "more + long adjective + than for change over time", ["more difficult, more interesting or more modern", "than", "no most in a comparison of two things"]],
  ["Compare two jobs you might like to do in the future. Write three or four sentences.",
    "more + long adjective + than for jobs", ["more interesting, more tiring, more important or similar", "than", "a mix of more and -er where right"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.comparative.more-comparative.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);