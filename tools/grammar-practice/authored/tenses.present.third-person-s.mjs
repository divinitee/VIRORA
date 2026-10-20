// Hand-authored: tenses / present / third-person-s (A1). Rebuild of the old
// GPT batch (it sat below the variance floor). Tests ONE point: he / she / it
// (or a singular noun) takes verb + -s / -es / -ies in the present simple.
// The subject and the verb are never slotted; slots only carry places, objects
// and times that leave the verb form unchanged.
//
// Distractors are the errors Uzbek/Russian learners make: the bare base form,
// a bare -ing form, an inserted "is" before the base form ("She is go"), and
// a doubled -s after does ("does goes"). No distractor is ever grammatical:
// verbs that double as adjectives (open, clean, close) never get an "is" option.
//
// Run: node tools/grammar-practice/authored/tenses.present.third-person-s.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "present", topic: "third-person-s", level: "A1", pv: "2.5" };

const ING = { go: "going", open: "opening", work: "working", play: "playing", watch: "watching", leave: "leaving",
  study: "studying", give: "giving", rain: "raining", have: "having", do: "doing", sell: "selling", cry: "crying",
  fix: "fixing", speak: "speaking", stop: "stopping", "get up": "getting up", wash: "washing", drive: "driving", start: "starting" };

// alt: "is" -> "is + base", "does" -> "does + -s form", or a literal 4th option.
const opts = (base, s, alt) => [s, base, ING[base], alt === "is" ? `is ${base}` : alt === "does" ? `does ${s}` : alt];

const rule = (base, s) =>
  s === "has" ? "Have is irregular: with he, she or it it becomes has."
    : s === "does" ? "Do adds -es with he, she or it: does."
      : s.endsWith("ies") ? `After a consonant, y changes to -ies: ${base} becomes ${s}.`
        : s.endsWith("es") && !base.endsWith("e") ? `Verbs ending in -sh, -ch, -x, -ss or -o add -es: ${base} becomes ${s}.`
          : `Add -s: ${base} becomes ${s}.`;
const who = (subj) => /^(He|She|It)$/.test(subj) ? `${subj} is third person singular.` : `${subj} means one person or thing, like he, she or it.`;
const why = (subj, base, s) => `${who(subj)} ${rule(base, s)}`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["She", "go", "goes", "is", "She ______ to {place} by {transport} every morning.",
    { place: ["school", "work", "university", "the gym"], transport: ["bus", "metro", "taxi", "minibus"] }],
  ["The bakery", "open", "opens", "does", "The bakery ______ at {time} every day. It sells fresh {food}.",
    { time: ["7 a.m.", "8 a.m.", "six o'clock", "seven o'clock"], food: ["bread", "non", "samsa", "cakes"] }],
  ["My father", "work", "works", "is", "My father ______ at a {place} in {city}.",
    { place: ["bank", "hospital", "hotel", "factory"], city: ["Tashkent", "Samarkand", "Bukhara", "Namangan"] }],
  ["Aziz", "play", "plays", "does", "Aziz ______ {sport} with his {person} on Sundays.",
    { sport: ["football", "tennis", "chess", "volleyball"], person: ["brother", "friends", "cousins", "father"] }],
  ["My mother", "watch", "watches", "is", "My mother ______ {program} with my {person} every evening.",
    { program: ["the news", "a series", "cooking shows", "old films"], person: ["sister", "grandmother", "aunt", "little brother"] }],
  ["The bus", "leave", "leaves", "does", "The bus to {place} ______ at {time} every day.",
    { place: ["Chilonzor", "the airport", "the city centre", "Yunusobod"], time: ["7:30", "8:15", "9:00", "10:45"] }],
  ["Madina", "study", "studies", "is", "Madina ______ {subject} at the {place} after school.",
    { subject: ["English", "maths", "chemistry", "history"], place: ["library", "learning centre", "kitchen table", "café"] }],
  ["Our teacher", "give", "gives", "does", "Our teacher ______ us {task} every {day}.",
    { task: ["homework", "a test", "a short quiz", "new words"], day: ["Monday", "Friday", "week", "lesson"] }],
  ["It", "rain", "rains", "is", "It ______ a lot in {city} in {season}.",
    { city: ["Tashkent", "Fergana", "Andijan", "Namangan"], season: ["March", "April", "spring", "autumn"] }],
  ["My brother", "have", "has", "haves", "My brother ______ a {pet} and two {things}.",
    { pet: ["cat", "dog", "parrot", "rabbit"], things: ["bikes", "phones", "laptops", "guitars"] }],
  ["Dilnoza", "do", "does", "is do", "Dilnoza ______ her {task} before {meal}.",
    { task: ["homework", "reading", "revision", "chores"], meal: ["dinner", "lunch", "breakfast", "supper"] }],
  ["The café", "sell", "sells", "does", "The café near our {place} ______ cheap {food}.",
    { place: ["school", "university", "office", "house"], food: ["samsa", "sandwiches", "plov", "coffee"] }],
  ["The baby", "cry", "cries", "is", "The baby ______ when he is {state}. Then my mother {action} him.",
    { state: ["hungry", "tired", "cold", "wet"], action: ["feeds", "holds", "rocks", "sings to"] }],
  ["Timur", "fix", "fixes", "does", "Timur ______ {things} in his uncle's {place}.",
    { things: ["phones", "laptops", "bikes", "cars"], place: ["shop", "garage", "workshop", "small shop"] }],
  ["Olga", "speak", "speaks", "is", "Olga ______ {lang} with her {person}.",
    { lang: ["Russian", "English", "Uzbek", "Korean"], person: ["grandmother", "friends", "colleagues", "neighbours"] }],
  ["This train", "stop", "stops", "does", "This train ______ in {town} and {city}.",
    { town: ["Gulistan", "Jizzakh", "Navoi", "Karshi"], city: ["Samarkand", "Bukhara", "Termez", "Urgench"] }],
  ["My grandfather", "get up", "gets up", "is", "My grandfather ______ at {time} and {action} in the garden.",
    { time: ["5 a.m.", "6 a.m.", "half past five", "six o'clock"], action: ["walks", "works", "drinks tea", "reads"] }],
  ["He", "wash", "washes", "does", "He ______ the {item} after {meal}.",
    { item: ["dishes", "cups", "plates", "pots"], meal: ["dinner", "lunch", "breakfast", "supper"] }],
  ["Jasur", "drive", "drives", "is", "Jasur ______ a {vehicle} in {city}.",
    { vehicle: ["taxi", "bus", "truck", "van"], city: ["Tashkent", "Samarkand", "Khiva", "Nukus"] }],
  ["The film", "start", "starts", "does", "The film ______ at {time}, so we have {amount} to get there.",
    { time: ["seven", "eight", "nine", "half past six"], amount: ["an hour", "thirty minutes", "plenty of time", "twenty minutes"] }],
].map(([subj, base, s, alt, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options: opts(base, s, alt), key: 0, why: why(subj, base, s), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the present simple form of the verb in brackets.";
const BUILD = [
  ["My aunt", "teach", "teaches", "My aunt ______ (teach) {subject} at a {place} in Tashkent.",
    { subject: ["English", "maths", "music", "art"], place: ["school", "college", "lyceum", "language school"] }],
  ["Sardor", "wake", "wakes", "Sardor ______ (wake) up at {time} on {days}.",
    { time: ["six", "seven", "half past six", "6:30"], days: ["weekdays", "school days", "Mondays", "workdays"] }],
  ["The museum", "close", "closes", "The museum in {city} ______ (close) at {time} on Sundays.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], time: ["five", "six", "4 p.m.", "5 p.m."] }],
  ["My cousin", "live", "lives", "My cousin ______ (live) in {city} with her {person}.",
    { city: ["Fergana", "Andijan", "Moscow", "Almaty"], person: ["parents", "husband", "grandmother", "two sisters"] }],
  ["Nodira", "finish", "finishes", "Nodira ______ (finish) work at {time} and then goes to the {place}.",
    { time: ["five", "six", "4:30", "half past five"], place: ["gym", "market", "park", "library"] }],
  ["Our neighbour", "carry", "carries", "Our neighbour ______ (carry) {things} up to the {floor} floor for my grandmother.",
    { things: ["bags", "boxes", "bottles of water", "shopping bags"], floor: ["fourth", "fifth", "sixth", "ninth"] }],
  ["The bus", "go", "goes", "The number {num} bus ______ (go) to the {place}.",
    { num: ["7", "12", "45", "89"], place: ["airport", "bazaar", "station", "university"] }],
  ["Bekzod", "try", "tries", "Bekzod ______ (try) a new {food} at every {place} he visits.",
    { food: ["dish", "drink", "dessert", "soup"], place: ["café", "restaurant", "food stall", "teahouse"] }],
  ["My phone", "have", "has", "My phone ______ (have) a good {part}, but it is very {state}.",
    { part: ["camera", "speaker", "microphone", "screen"], state: ["old", "slow", "heavy", "small"] }],
  ["The doctor", "see", "sees", "The doctor ______ (see) {num} patients every {period}.",
    { num: ["twenty", "thirty", "forty", "fifty"], period: ["day", "morning", "shift", "afternoon"] }],
  ["Kamila", "miss", "misses", "Kamila ______ (miss) her {person} because they live in {city}.",
    { person: ["parents", "brothers", "old friends", "grandparents"], city: ["Moscow", "Seoul", "Istanbul", "Almaty"] }],
  ["My dog", "sleep", "sleeps", "My dog ______ (sleep) on the {place} next to the {thing}.",
    { place: ["sofa", "carpet", "floor", "balcony"], thing: ["door", "window", "heater", "TV"] }],
  ["Dad", "buy", "buys", "Dad ______ (buy) {food} from the {shop} on the corner.",
    { food: ["bread", "milk", "fruit", "vegetables"], shop: ["shop", "kiosk", "market stall", "little shop"] }],
  ["Anvar", "ride", "rides", "Anvar ______ (ride) his {vehicle} to the {place}.",
    { vehicle: ["bike", "scooter", "motorbike", "bicycle"], place: ["park", "lake", "stadium", "shop"] }],
  ["Lola", "watch", "watches", "Lola ______ (watch) {program} on her {device} at night.",
    { program: ["cartoons", "videos", "series", "films"], device: ["phone", "tablet", "laptop", "computer"] }],
  ["The teacher", "ask", "asks", "The teacher ______ (ask) {who} about the {topic} every lesson.",
    { who: ["me", "us", "Aziz", "the class"], topic: ["homework", "new words", "last text", "grammar"] }],
  ["Our class", "start", "starts", "Our {subject} class ______ (start) at {time}.",
    { subject: ["English", "maths", "music", "history"], time: ["eight", "nine", "8:30", "9:15"] }],
  ["My grandmother", "make", "makes", "My grandmother ______ (make) {food} for the whole family on {day}.",
    { food: ["plov", "manti", "samsa", "soup"], day: ["Fridays", "Sundays", "holidays", "birthdays"] }],
  ["Farrukh", "fly", "flies", "Farrukh ______ (fly) to {city} for work {freq}.",
    { city: ["Dubai", "Moscow", "Istanbul", "Seoul"], freq: ["twice a year", "every month", "once a year", "every spring"] }],
  ["It", "snow", "snows", "It ______ (snow) in the {place} in {season}.",
    { place: ["mountains", "north", "hills", "villages near Chimgan"], season: ["winter", "January", "December", "February"] }],
].map(([subj, base, key, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: why(subj, base, key), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NEW_SUBJ = "Rewrite the sentence with the new subject. Keep the present simple.";
const ONE = "Rewrite the sentence about one person or thing. Keep the present simple.";
const POS = "Rewrite the sentence as a positive statement.";
const TRANSFORM = [
  // I / we / you / they -> he / she (5)
  [NEW_SUBJ, "I walk to {place} with my {person}.", "Malika ______ (walk) to {place} with her {person}.", "walks",
    "Malika is one person, so walk becomes walks.",
    { place: ["school", "work", "the market", "the park"], person: ["friend", "sister", "brother", "cousin"] }],
  [NEW_SUBJ, "We eat {food} for {meal}.", "My father ______ (eat) {food} for {meal}.", "eats",
    "My father is one person, so eat becomes eats.",
    { food: ["eggs", "bread", "porridge", "fruit"], meal: ["breakfast", "lunch", "dinner", "supper"] }],
  [NEW_SUBJ, "They watch {sport} on TV on {day}.", "Rustam ______ (watch) {sport} on TV on {day}.", "watches",
    "Rustam is one person. Watch ends in -ch, so it becomes watches.",
    { sport: ["football", "boxing", "tennis", "wrestling"], day: ["Saturdays", "Sundays", "Fridays", "weekends"] }],
  [NEW_SUBJ, "I go to the {place} by {transport}.", "My sister ______ (go) to the {place} by {transport}.", "goes",
    "My sister is one person. Go ends in -o, so it becomes goes.",
    { place: ["market", "bank", "library", "gym"], transport: ["bus", "taxi", "metro", "bike"] }],
  [NEW_SUBJ, "You study {subject} in the {place}.", "Shahlo ______ (study) {subject} in the {place}.", "studies",
    "Shahlo is one person. Study ends in a consonant + y, so it becomes studies.",
    { subject: ["English", "biology", "maths", "Korean"], place: ["library", "evening", "afternoon", "kitchen"] }],
  // plural noun -> singular noun (5)
  [ONE, "My friends play {game} after {event}.", "My friend ______ (play) {game} after {event}.", "plays",
    "My friend is one person, so play becomes plays.",
    { game: ["chess", "football", "computer games", "basketball"], event: ["school", "class", "work", "dinner"] }],
  [ONE, "The shops open at {time} on {day}.", "The shop ______ (open) at {time} on {day}.", "opens",
    "The shop is one thing, so open becomes opens.",
    { time: ["nine", "ten", "8 a.m.", "10 a.m."], day: ["Sundays", "Saturdays", "holidays", "weekdays"] }],
  [ONE, "Our teachers give us {task} every {period}.", "Our teacher ______ (give) us {task} every {period}.", "gives",
    "Our teacher is one person, so give becomes gives.",
    { task: ["homework", "a test", "new words", "a short text"], period: ["week", "day", "lesson", "Friday"] }],
  [ONE, "The buses stop near the {place} every {interval}.", "The bus ______ (stop) near the {place} every {interval}.", "stops",
    "The bus is one thing, so stop becomes stops.",
    { place: ["school", "park", "hospital", "bazaar"], interval: ["ten minutes", "half hour", "twenty minutes", "fifteen minutes"] }],
  [ONE, "My brothers fix {things} in the {place}.", "My brother ______ (fix) {things} in the {place}.", "fixes",
    "My brother is one person. Fix ends in -x, so it becomes fixes.",
    { things: ["bikes", "cars", "phones", "computers"], place: ["garage", "yard", "shop", "workshop"] }],
  // negative -> positive, same subject (5)
  [POS, "Aziza doesn't drink {drink} in the {time}.", "Aziza ______ (drink) {drink} in the {time}.", "drinks",
    "In a positive sentence there is no does, so the -s goes on the verb: drinks.",
    { drink: ["coffee", "green tea", "milk", "juice"], time: ["morning", "evening", "afternoon", "winter"] }],
  [POS, "My uncle doesn't have a {vehicle} or a {thing}.", "My uncle ______ (have) a {vehicle} and a {thing}.", "has",
    "Without doesn't, have changes to has with he, she or it.",
    { vehicle: ["car", "bike", "motorbike", "scooter"], thing: ["garden", "dog", "big house", "flat"] }],
  [POS, "Nilufar doesn't teach {subject} at the {place}.", "Nilufar ______ (teach) {subject} at the {place}.", "teaches",
    "Without doesn't, the verb takes the ending: teach becomes teaches.",
    { subject: ["English", "music", "art", "maths"], place: ["lyceum", "college", "school", "university"] }],
  [POS, "This bus doesn't go to the {place} after {time}.", "This bus ______ (go) to the {place} after {time}.", "goes",
    "Without doesn't, the verb takes the ending: go becomes goes.",
    { place: ["airport", "station", "bazaar", "stadium"], time: ["ten", "nine", "midnight", "eight"] }],
  [POS, "Javlon doesn't try {food} at {place}.", "Javlon ______ (try) {food} at {place}.", "tries",
    "Without doesn't, the verb takes the ending: try becomes tries.",
    { food: ["new dishes", "spicy food", "the soup", "the salads"], place: ["restaurants", "parties", "weddings", "cafés"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what your mother or father does every morning.", "a verb with -s or -es after he or she",
    ["exactly one sentence", "must include every morning", "must be about one parent"]],
  ["Write one sentence about where your best friend lives.", "lives",
    ["exactly one sentence", "must name your friend", "must use the verb live"]],
  ["Write one sentence about what time a shop, bus or lesson starts.", "starts or opens",
    ["exactly one sentence", "must include a time", "must be about a thing, not a person"]],
  ["Write one sentence about a hobby of someone in your family.", "a verb with -s or -es",
    ["exactly one sentence", "must name a family member", "must use the present simple"]],
  ["Write one sentence about what your teacher has in class.", "has",
    ["exactly one sentence", "must use the verb have", "must be about your teacher"]],
  ["Write one sentence about what a friend studies.", "studies",
    ["exactly one sentence", "must use the verb study", "must be about one friend"]],
  ["Write one sentence about what your pet or a neighbour's pet does every day.", "a verb with -s or -es after it or a singular noun",
    ["exactly one sentence", "must include every day", "must be about one animal"]],
  ["Write two sentences: one about what you do on Sundays, and one about what your brother, sister or friend does.", "the base form with I and the -s form with he or she",
    ["exactly two sentences", "first sentence with I", "second sentence with he, she or a name"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a normal day for one person in your family. Write three or four sentences.",
    "present simple with the third-person -s", ["-s or -es on every verb after he or she", "has, does and goes spelled correctly", "time words like every day or in the morning"]],
  ["Tell a new classmate about your best friend: where they live, what they like and what they do after school. Write three or four sentences.",
    "present simple with the third-person -s", ["lives, likes and other -s forms", "no is before the verb", "he or she used correctly"]],
  ["Describe your town: when the shops open, where the buses go and what the market sells. Write three or four sentences.",
    "present simple -s with singular things", ["-s on verbs after a singular noun", "opens, goes, sells", "times and places"]],
  ["Describe the job of someone you know. What does he or she do every day? Write three or four sentences.",
    "present simple with the third-person -s", ["works, helps, teaches or similar -s forms", "-es after -ch, -sh, -s, -x and -o", "every day or other routine words"]],
  ["Compare your routine with a friend's routine. Write three or four sentences.",
    "base form with I and -s form with he or she", ["I + base form", "he or she + -s form", "but or and to join the ideas"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.present.third-person-s.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);