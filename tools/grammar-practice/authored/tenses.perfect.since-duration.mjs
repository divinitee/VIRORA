// Hand-authored: tenses / perfect / since-duration (A2).
//
// Tests ONE point: the present perfect (not the present simple) for a state
// or situation that started in the past and is still true, with since
// ("I have lived here since 2015"). The since phrase is never slotted, and
// neither is the subject.
//
// Choose distractors: the present simple (I live here since 2015: the main
// L1-transfer error from Russian "живу с 2015"), the present continuous (same
// transfer) and the past simple. Mostly state verbs (know, live, have, be,
// want), so the present perfect continuous is not a second answer; for the
// few activity verbs, typed keys accept the continuous form too.
//
// Run: node tools/grammar-practice/authored/tenses.perfect.since-duration.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "since-duration", level: "A2", pv: "2.5" };
const HAVE = { i: "have", sg: "has", pl: "have" };
const why = (form) => `It started in the past and is still true now, so use the present perfect with since: ${form}.`;

/* ---------------- choose: 20 mcq [present perfect, present simple, present continuous, past simple] ---------------- */
const CHOOSE = [
  [["has lived", "lives", "is living", "lived"], "My family ______ in this {home} since 2015, near the {place}.",
    { home: ["flat", "house", "building", "street"], place: ["market", "park", "metro", "school"] }],
  [["have known", "know", "am knowing", "knew"], "I ______ {name} since we were children at the {place}.",
    { name: ["Aziz", "Olga", "Bobur", "Nigora"], place: ["kindergarten", "school", "summer camp", "village school"] }],
  [["has had", "has", "is having", "had"], "Kamila ______ her {thing} since her birthday in {month}.",
    { thing: ["phone", "bike", "watch", "laptop"], month: ["March", "June", "May", "April"] }],
  [["have been", "are", "are being", "were"], "We ______ friends since the first day at {place} in {city}.",
    { place: ["college", "school", "university", "camp"], city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  [["has worked", "works", "is working", "worked"], "My mother ______ at the {place} since 2012 with her {person}.",
    { place: ["hospital", "bank", "school", "library"], person: ["friend", "sister", "colleague", "team"] }],
  [["have wanted", "want", "am wanting", "wanted"], "I ______ a {pet} since I was six, but my {person} says no.",
    { pet: ["dog", "cat", "parrot", "rabbit"], person: ["mother", "father", "grandmother", "brother"] }],
  [["has been", "is", "is being", "was"], "Timur ______ ill since Monday, so he is at home with his {person} and his {thing}.",
    { person: ["mother", "grandmother", "brother", "sister"], thing: ["books", "phone", "laptop", "cat"] }],
  [["have studied", "study", "am studying", "studied"], "The girls ______ {lang} since 2023 at the {place}.",
    { lang: ["English", "Korean", "German", "Turkish"], place: ["language centre", "college", "school", "university"] }],
  [["has taught", "teaches", "is teaching", "taught"], "Mr Rakhimov ______ {subject} at our {place} since 2008.",
    { subject: ["maths", "history", "physics", "music"], place: ["school", "college", "lyceum", "centre"] }],
  [["have played", "play", "am playing", "played"], "I ______ for the {team} since last September with my {person}.",
    { team: ["school team", "city team", "college team", "club"], person: ["brother", "best friend", "cousin", "classmate"] }],
  [["has belonged", "belongs", "is belonging", "belonged"], "This old {thing} ______ to our family since my {person} was young.",
    { thing: ["carpet", "clock", "table", "piano"], person: ["grandfather", "grandmother", "great-grandmother", "great-grandfather"] }],
  [["have lived", "live", "are living", "lived"], "My cousins ______ in {city} since 2019 with their {person}.",
    { city: ["Seoul", "Moscow", "Istanbul", "Almaty"], person: ["parents", "family", "grandmother", "uncle"] }],
  [["has liked", "likes", "is liking", "liked"], "Sevara ______ {food} since she was a little girl at her {person}'s house.",
    { food: ["plov", "manti", "samsa", "lagman"], person: ["grandmother", "aunt", "uncle", "grandfather"] }],
  [["have had", "have", "am having", "had"], "I ______ this {thing} since my first day at {place}.",
    { thing: ["bag", "pencil case", "jacket", "lunch box"], place: ["school", "college", "work", "university"] }],
  [["has been", "is", "is being", "was"], "The {shop} ______ closed since Friday because of the {reason}.",
    { shop: ["bakery", "café", "pharmacy", "shop"], reason: ["holiday", "repairs", "owner's trip", "new floor"] }],
  [["have known", "know", "are knowing", "knew"], "My parents ______ our neighbours since they moved to {district}, near the {place}.",
    { district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"], place: ["metro", "market", "park", "school"] }],
  [["has driven", "drives", "is driving", "drove"], "Rustam ______ a {vehicle} since he got his licence, and he takes it to {place}.",
    { vehicle: ["taxi", "minibus", "car", "van"], place: ["work", "the market", "the airport", "the station"] }],
  [["have been", "am", "am being", "was"], "I ______ in this {group} since the start of the year with my {person}.",
    { group: ["class", "group", "club", "team"], person: ["best friend", "cousin", "brother", "neighbour"] }],
  [["has owned", "owns", "is owning", "owned"], "My uncle ______ a small {place} in {city} since 2016.",
    { place: ["café", "shop", "bakery", "garage"], city: ["Tashkent", "Andijan", "Namangan", "Karshi"] }],
  [["have used", "use", "am using", "used"], "We ______ this {thing} in our {room} since last winter.",
    { thing: ["heater", "lamp", "sofa", "carpet"], room: ["living room", "bedroom", "kitchen", "flat"] }],
].map(([options, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: why(options[0]), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the present perfect of the verb in brackets.";
const BUILD = [
  ["have known", "I ______ (know) my best friend {name} since 2016, from the {place}.", { name: ["Aziz", "Olga", "Bobur", "Nigora"], place: ["park", "school", "summer camp", "village"] }],
  ["has lived", "My grandmother ______ (live) in her {home} since 1980, near the {place}.", { home: ["house", "flat", "village house", "old house"], place: ["river", "market", "school", "mosque"] }, ["has been living"]],
  ["have had", "We ______ (have) our {pet} since last summer, and she loves the {place}.", { pet: ["dog", "cat", "rabbit", "puppy"], place: ["garden", "yard", "park", "sofa"] }],
  ["has been", "Aziz ______ (be) at the {place} since 8 o'clock with his {person}.", { place: ["library", "gym", "hospital", "office"], person: ["brother", "friend", "father", "classmate"] }],
  ["have wanted", "I ______ (want) to visit {city} since I saw a film about it with my {person}.", { city: ["Khiva", "Istanbul", "Seoul", "Bukhara"], person: ["father", "family", "brother", "class"] }],
  ["has worked", "My father ______ (work) at the {place} since 2009 as a {job}.", { place: ["factory", "airport", "bank", "hospital"], job: ["driver", "manager", "mechanic", "guard"] }, ["has been working"]],
  ["have studied", "Malika and Laylo ______ (study) {subject} since September at the {place}.", { subject: ["chemistry", "biology", "IT", "economics"], place: ["college", "centre", "university", "school"] }, ["have been studying"]],
  ["has had", "Javohir ______ (have) a {problem} since Tuesday, so he is at home with his {person}.", { problem: ["cold", "headache", "fever", "cough"], person: ["mother", "grandmother", "sister", "father"] }],
  ["have been", "My sisters ______ (be) in {city} since Sunday with their {person}.", { city: ["Samarkand", "Bukhara", "Moscow", "Almaty"], person: ["aunt", "friends", "class", "uncle"] }],
  ["has taught", "Mrs Yusupova ______ (teach) at our {place} since 2014, and the {who} love her.", { place: ["school", "college", "lyceum", "centre"], who: ["students", "children", "parents", "teachers"] }, ["has been teaching"]],
  ["have liked", "I ______ (like) {sport} since I was a child, especially with my {person}.", { sport: ["football", "chess", "swimming", "tennis"], person: ["father", "brother", "uncle", "friends"] }],
  ["has played", "Dilshod ______ (play) the {instrument} since he was eight, with a {who}.", { instrument: ["piano", "guitar", "violin", "dutar"], who: ["teacher", "tutor", "music club", "friend"] }, ["has been playing"]],
  ["have lived", "We ______ (live) in {district} since 2018, near the {place}.", { district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"], place: ["metro", "market", "park", "school"] }, ["have been living"]],
  ["has known", "Our teacher ______ (know) my {person} since they were students in {city}.", { person: ["mother", "father", "aunt", "uncle"], city: ["Tashkent", "Samarkand", "Moscow", "Bukhara"] }],
  ["have been", "The {thing} on our street ______ (be) broken since the storm, and the {place} is dark.", { thing: ["street lights", "lamps", "lights", "traffic lights"], place: ["street", "corner", "road", "path"] }],
  ["has used", "My grandfather ______ (use) the same {thing} since 2005 in his {place}.", { thing: ["radio", "clock", "bike", "tools"], place: ["garage", "garden", "room", "workshop"] }],
  ["have been", "I ______ (be) a member of the {club} since last year with my {person}.", { club: ["chess club", "football club", "art club", "music club"], person: ["brother", "cousin", "friend", "classmate"] }],
  ["has wanted", "Kamola ______ (want) a {thing} since her last birthday, but it is too {adj}.", { thing: ["laptop", "new phone", "bike", "camera"], adj: ["expensive", "big", "much money", "dear"] }],
  ["have owned", "My parents ______ (own) this {thing} since 2010, and it still works {how}.", { thing: ["car", "fridge", "TV", "washing machine"], how: ["well", "fine", "perfectly", "very well"] }],
  ["has been", "It ______ (be) very {weather} in {city} since the weekend.", { weather: ["cold", "hot", "windy", "rainy"], city: ["Tashkent", "Samarkand", "Termez", "Nukus"] }],
].map(([key, source, slots, acceptable]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(acceptable ? { acceptable } : {}), why: why(key), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const START = "Read the two sentences. Complete one sentence with since and the present perfect.";
const HOW_LONG = "Answer the question with the present perfect and since.";
const NEW_SUBJ = "Rewrite the sentence with the new subject.";
const TRANSFORM = [
  [START, "I moved to {city} in 2017. I still live there.", "I ______ (live) in {city} since 2017 with my {person}.", "have lived",
    { city: ["Tashkent", "Samarkand", "Namangan", "Karshi"], person: ["family", "parents", "sister", "grandmother"] }, ["have been living"]],
  [START, "Bekzod met {name} in 2020. They are still friends.", "Bekzod ______ (know) {name} since 2020, from the {place}.", "has known",
    { name: ["Malika", "Sardor", "Anna", "Timur"], place: ["gym", "college", "summer camp", "football club"] }],
  [START, "We got our {pet} in May. We still have it.", "We ______ (have) our {pet} since May, and it sleeps in the {place}.", "have had",
    { pet: ["cat", "dog", "parrot", "rabbit"], place: ["kitchen", "hall", "garden", "living room"] }],
  [START, "My aunt started work at the {place} in 2011. She still works there.", "My aunt ______ (work) at the {place} since 2011 as a {job}.", "has worked",
    { place: ["bank", "hospital", "library", "post office"], job: ["cashier", "manager", "cleaner", "guard"] }, ["has been working"]],
  [START, "The lift broke on Monday. It is still broken.", "The lift in our {building} ______ (be) broken since Monday, so we use the {way}.", "has been",
    { building: ["building", "block", "office", "hotel"], way: ["stairs", "other lift", "back stairs", "steps"] }],
  [HOW_LONG, "How long have you been at this {place}? I came here in September.", "I ______ (be) at this {place} since September with my {person}.", "have been",
    { place: ["school", "college", "centre", "university"], person: ["friends", "brother", "cousin", "classmates"] }],
  [HOW_LONG, "How long has your brother had his {thing}? He bought it in March.", "He ______ (have) his {thing} since March, and he takes it to {where}.", "has had",
    { thing: ["car", "bike", "phone", "laptop"], where: ["work", "school", "college", "the gym"] }],
  [HOW_LONG, "How long have your parents lived in {district}? They moved there in 2005.", "They ______ (live) in {district} since 2005, near the {place}.", "have lived",
    { district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"], place: ["metro", "market", "park", "school"] }, ["have been living"]],
  [HOW_LONG, "How long has Nigora wanted a {pet}? She wanted one when she was five.", "She ______ (want) a {pet} since she was five, but her {person} says no.", "has wanted",
    { pet: ["dog", "cat", "parrot", "rabbit"], person: ["mother", "father", "grandmother", "brother"] }],
  [HOW_LONG, "How long have you known your {person}? I met them at {place} in 2019.", "I ______ (know) my {person} since 2019.", "have known",
    { person: ["best friends", "classmates", "neighbours", "teammates"], place: ["school", "camp", "college", "the club"] }],
  [NEW_SUBJ, "I have lived in this {home} since 2014.", "My grandparents ______ (live) in this {home} since 1990 with their {pet}.", "have lived",
    { home: ["street", "village", "building", "area"], pet: ["dog", "cat", "parrot", "old dog"] }, ["have been living"]],
  [NEW_SUBJ, "They have been in {city} since Friday.", "My sister ______ (be) in {city} since Friday with her {person}.", "has been",
    { city: ["Bukhara", "Moscow", "Samarkand", "Seoul"], person: ["friends", "class", "husband", "team"] }],
  [NEW_SUBJ, "We have had this {thing} since last year.", "Otabek ______ (have) this {thing} since last year, and he uses it every {time}.", "has had",
    { thing: ["bike", "phone", "car", "camera"], time: ["day", "morning", "weekend", "evening"] }],
  [NEW_SUBJ, "She has known Mr Aliev since 2015.", "I ______ (know) Mr Aliev since 2015, from the {place}.", "have known",
    { place: ["school", "college", "bank", "hospital"] }],
  [NEW_SUBJ, "He has studied at the {place} since 2022.", "Zarina and her sister ______ (study) at the {place} since 2022 with their {person}.", "have studied",
    { place: ["college", "university", "language centre", "music school"], person: ["friends", "cousin", "classmates", "neighbour"] }, ["have been studying"]],
].map(([instr, source, hint, key, slots, acceptable]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable ? { acceptable } : {}), why: why(key), slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about how long you have lived in your town. Use since.", "have lived + since", ["exactly one sentence", "must use since", "must name the town"]],
  ["Write one sentence about a friend you have known since you were a child.", "have known + since", ["exactly one sentence", "must use since", "must name the friend"]],
  ["Write one sentence about something you have had since a past year.", "have had + since + year", ["exactly one sentence", "must use since", "must include a year"]],
  ["Write one sentence about how long your teacher has been at your school.", "has been + since", ["exactly one sentence", "must use since", "must use has"]],
  ["Write one sentence about something you have wanted since you were young.", "have wanted + since", ["exactly one sentence", "must use since", "must use wanted"]],
  ["Write one sentence about a family member's job, using since.", "has worked + since", ["exactly one sentence", "must use since", "must name the job or place"]],
  ["Write one sentence about the weather since the weekend.", "has been + since", ["exactly one sentence", "must use since", "must use it has been"]],
  ["Write two sentences: when something started (past simple), and that it is still true (present perfect + since).", "past simple, then present perfect + since", ["exactly two sentences", "first sentence past simple", "second sentence with since"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Introduce yourself to a new group: how long you have lived, studied and known people here. Write three or four sentences.", "present perfect + since", ["have lived, have studied, have known", "since + start point", "no present simple with since"]],
  ["Write about your oldest friend. Since when have you known them? Write three or four sentences.", "present perfect + since", ["have known", "since", "what you have done together"]],
  ["Write about an old thing in your home and its story. Write three or four sentences.", "present perfect + since", ["have had or has belonged", "since", "past simple for the start"]],
  ["Write about a family member's job: when they started and how long they have done it. Write three or four sentences.", "past simple and present perfect + since", ["started + past time", "has worked + since", "still"]],
  ["Write about a change in your life: something new that you have had or done since a past time. Write three or four sentences.", "present perfect + since", ["since", "have + past participle", "how it is now"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.perfect.since-duration.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);