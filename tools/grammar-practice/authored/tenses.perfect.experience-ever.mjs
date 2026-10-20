// Hand-authored: tenses / perfect / experience-ever (A2).
//
// Tests ONE point: the present perfect QUESTION for life experience:
// Have/Has + subject + ever + past participle ("Have you ever been to Khiva?").
// The subject is never slotted (it decides have/has).
//
// Choose distractors: the past form for the participle (Have you ever ate),
// wrong word order (Have ever you eaten: the auxiliary-subject inversion is the
// L1-transfer error), and wrong auxiliary (Has you / Have she). "Did you ever
// eat...?" is NOT used: it is acceptable in American English. Only verbs whose
// participle differs from the past form are used in choose.
//
// Run: node tools/grammar-practice/authored/tenses.perfect.experience-ever.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "experience-ever", level: "A2", pv: "2.5" };
const AUX = { you: "Have", they: "Have", we: "Have", he: "Has" };
const WRONG_AUX = { you: "Has", they: "Has", we: "Has", he: "Have" };
const why = (aux, pp) => `To ask about life experience, use ${aux} + subject + ever + the past participle (${pp}).`;

/* ---------------- choose: 20 mcq ---------------- */
// [subject type, subject text, past, participle, rest of sentence, slots]
const CHOOSE = [
  ["you", "you", "was", "been", "to {city} with your {person}?",
    { city: ["Khiva", "Bukhara", "Samarkand", "Istanbul"], person: ["family", "class", "friends", "cousins"] }],
  ["you", "you", "ate", "eaten", "{food} at a {place}?",
    { food: ["sushi", "pizza", "Korean food", "fish soup"], place: ["café", "restaurant", "friend's house", "party"] }],
  ["he", "your brother", "saw", "seen", "a {animal} in the {place}?",
    { animal: ["camel", "bear", "tiger", "wolf"], place: ["zoo", "mountains", "desert", "forest"] }],
  ["they", "your parents", "rode", "ridden", "a horse in the {place} with {who}?",
    { place: ["village", "mountains", "hills", "countryside"], who: ["your uncle", "a guide", "their friends", "you"] }],
  ["you", "you", "swam", "swum", "in the {place} in {season}?",
    { place: ["sea", "Charvak lake", "river", "mountain lake"], season: ["winter", "spring", "autumn", "March"] }],
  ["he", "your sister", "flew", "flown", "to {city} on a {thing}?",
    { city: ["Seoul", "Dubai", "Moscow", "London"], thing: ["holiday", "school trip", "work trip", "short trip"] }],
  ["he", "Timur", "drove", "driven", "his father's car on the {road} to {city}?",
    { road: ["motorway", "mountain road", "old road", "main road"], city: ["Samarkand", "Fergana", "Bukhara", "Jizzakh"] }],
  ["you", "you", "took", "taken", "a {transport} from Tashkent to {city}?",
    { transport: ["train", "night train", "fast train", "bus"], city: ["Bukhara", "Khiva", "Termez", "Nukus"] }],
  ["he", "Malika", "wrote", "written", "a {thing} in English for her {person}?",
    { thing: ["story", "poem", "letter", "song"], person: ["teacher", "class", "friend", "mother"] }],
  ["they", "your grandparents", "spoke", "spoken", "to a tourist from {country} in the {place}?",
    { country: ["Japan", "Italy", "Germany", "France"], place: ["old town", "market", "street", "park"] }],
  ["you", "you", "drank", "drunk", "{drink} at a {place}?",
    { drink: ["camel milk", "mint tea", "fresh juice", "ayran"], place: ["market", "village", "café", "wedding"] }],
  ["he", "your cousin", "broke", "broken", "his {part} playing {sport}?",
    { part: ["arm", "leg", "finger", "nose"], sport: ["football", "basketball", "volleyball", "hockey"] }],
  ["you", "you", "fell", "fallen", "off a {vehicle} in the {place}?",
    { vehicle: ["bike", "horse", "scooter", "skateboard"], place: ["park", "street", "yard", "village"] }],
  ["he", "Aziz", "wore", "worn", "a {clothes} to a {event}?",
    { clothes: ["suit", "tie", "national hat", "white shirt"], event: ["wedding", "concert", "party", "school event"] }],
  ["they", "your friends", "sang", "sung", "a song on stage at the {place} in front of {who}?",
    { place: ["school", "college", "festival", "concert hall"], who: ["the class", "their parents", "the teachers", "a big crowd"] }],
  ["you", "you", "forgot", "forgotten", "your {thing} at the {place}?",
    { thing: ["passport", "phone", "bag", "jacket"], place: ["airport", "station", "café", "hotel"] }],
  ["he", "your mother", "grew", "grown", "{plant} in her {place}?",
    { plant: ["melons", "tomatoes", "roses", "grapes"], place: ["garden", "yard", "dacha", "village garden"] }],
  ["we", "we", "gave", "given", "a talk in English at the {place} about {topic}?",
    { place: ["centre", "college", "school", "club"], topic: ["our city", "our country", "food", "sport"] }],
  ["he", "Sardor", "threw", "thrown", "a ball through a {thing} at {place}?",
    { thing: ["window", "door", "hoop", "net"], place: ["school", "home", "the gym", "his uncle's house"] }],
  ["you", "you", "did", "done", "a {thing} with your {person}?",
    { thing: ["bungee jump", "cooking class", "marathon", "dance class"], person: ["friends", "brother", "class", "father"] }],
].map(([type, subj, past, pp, rest, slots]) => {
  const a = AUX[type];
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  return { ...BASE, stage: "choose", format: "mcq", prompt: `______ ${rest}`,
    options: [`${a} ${subj} ever ${pp}`, `${a} ${subj} ever ${past}`, `${a} ever ${subj} ${pp}`, `${WRONG_AUX[type]} ${subj} ever ${pp}`].map(cap),
    key: 0, why: why(a, pp), slots };
});

/* ---------------- build: 20 gap_fill, two blanks: [aux, participle] ---------------- */
const INSTR_B = "Complete the question with have or has and the past participle of the verb in brackets.";
const BUILD = [
  ["Have", "visited", "______ you ever ______ (visit) the old town in {city} with your {person}?",
    { city: ["Bukhara", "Khiva", "Samarkand", "Shakhrisabz"], person: ["family", "class", "friends", "cousins"] }],
  ["Has", "eaten", "______ your sister ever ______ (eat) {food} at a {place}?",
    { food: ["sushi", "pizza", "Korean food", "fish soup"], place: ["café", "restaurant", "party", "friend's house"] }],
  ["Have", "seen", "______ your parents ever ______ (see) the {thing} in {city}?",
    { thing: ["sea", "snow", "old city walls", "big mosque"], city: ["Istanbul", "Khiva", "Bukhara", "Samarkand"] }],
  ["Has", "played", "______ Bobur ever ______ (play) {sport} for the {team}?",
    { sport: ["football", "basketball", "volleyball", "chess"], team: ["school team", "city team", "college team", "club"] }],
  ["Has", "tried", "______ your uncle ever ______ (try) {food} from {country}?",
    { food: ["soup", "bread", "sweets", "noodles"], country: ["Korea", "Japan", "Turkey", "Georgia"] }],
  ["Has", "been", "______ your father ever ______ (be) to {city} on a {trip}?",
    { city: ["Moscow", "Seoul", "Dubai", "London"], trip: ["work trip", "holiday", "short trip", "business trip"] }],
  ["Have", "climbed", "______ your friends ever ______ (climb) a mountain near {place} with a {who}?",
    { place: ["Chimgan", "Zomin", "Boysun", "Charvak"], who: ["guide", "group", "teacher", "club"] }],
  ["Has", "ridden", "______ Laylo ever ______ (ride) a {animal} in the {place}?",
    { animal: ["horse", "camel", "donkey", "pony"], place: ["village", "desert", "mountains", "park"] }],
  ["Have", "flown", "______ you ever ______ (fly) to {city} on a {thing}?",
    { city: ["Seoul", "Dubai", "Istanbul", "Moscow"], thing: ["holiday", "school trip", "work trip", "short trip"] }],
  ["Has", "met", "______ your teacher ever ______ (meet) a famous {person} at the {place}?",
    { person: ["singer", "footballer", "writer", "actor"], place: ["airport", "theatre", "festival", "stadium"] }],
  ["Have", "cooked", "______ your sisters ever ______ (cook) {food} for their {person}?",
    { food: ["plov", "manti", "samsa", "lagman"], person: ["family", "friends", "grandparents", "guests"] }],
  ["Has", "won", "______ Kamila ever ______ (win) a prize at the {event} for her {thing}?",
    { event: ["school fair", "festival", "competition", "olympiad"], thing: ["drawing", "poem", "story", "project"] }],
  ["Have", "lost", "______ your cousins ever ______ (lose) their way in {city} without a {thing}?",
    { city: ["Tashkent", "Istanbul", "Moscow", "Samarkand"], thing: ["map", "phone", "guide", "friend"] }],
  ["Has", "worked", "______ your brother ever ______ (work) in a {place} in the {season}?",
    { place: ["café", "hotel", "shop", "summer camp"], season: ["summer", "holidays", "winter", "evenings"] }],
  ["Has", "watched", "______ Javlon ever ______ (watch) a {event} at the {place}?",
    { event: ["football match", "concert", "show", "basketball game"], place: ["stadium", "big hall", "park", "sports centre"] }],
  ["Has", "slept", "______ your sister ever ______ (sleep) in a {place} in the {area}?",
    { place: ["tent", "yurt", "small hotel", "camp"], area: ["mountains", "desert", "forest", "countryside"] }],
  ["Have", "read", "______ you ever ______ (read) a book in English about {topic} from the {place}?",
    { topic: ["space", "animals", "history", "football"], place: ["library", "school", "bookshop", "market"] }],
  ["Has", "sent", "______ your grandmother ever ______ (send) a {thing} to her {person}?",
    { thing: ["video message", "voice message", "photo", "text message"], person: ["grandson", "sister", "friend", "neighbour"] }],
  ["Have", "taken", "______ your friends ever ______ (take) a {transport} across the {place}?",
    { transport: ["boat", "ferry", "small boat", "cable car"], place: ["lake", "river", "valley", "sea"] }],
  ["Has", "spoken", "______ Olga ever ______ (speak) English with a {person} from {country}?",
    { person: ["tourist", "teacher", "student", "doctor"], country: ["England", "Canada", "Australia", "the USA"] }],
].map(([aux, pp, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: [aux, pp], why: why(aux, pp), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const STATE_Q = "The first sentence is about you. Complete the question to ask someone about the same experience.";
const PAST_Q = "The first question is about one finished time. Complete the question about life experience with ever.";
const ANS_Q = "Here is an answer. Complete the question for this answer.";
const TRANSFORM = [
  [STATE_Q, "I have been to {city} twice.", "______ you ever ______ (be) to {city} with your {person}?", ["Have", "been"],
    { city: ["Khiva", "Bukhara", "Istanbul", "Almaty"], person: ["family", "class", "friends", "cousins"] }],
  [STATE_Q, "I have eaten {food}.", "______ your brother ever ______ (eat) {food} at a {place}?", ["Has", "eaten"],
    { food: ["sushi", "pizza", "Korean food", "fish soup"], place: ["café", "restaurant", "party", "friend's house"] }],
  [STATE_Q, "I have ridden a {animal}.", "______ your friends ever ______ (ride) a {animal} in the {place}?", ["Have", "ridden"],
    { animal: ["horse", "camel", "donkey", "pony"], place: ["village", "desert", "mountains", "park"] }],
  [STATE_Q, "I have seen a {event} live.", "______ your father ever ______ (see) a {event} live at the {place}?", ["Has", "seen"],
    { event: ["football match", "concert", "show", "basketball game"], place: ["stadium", "big hall", "park", "sports centre"] }],
  [STATE_Q, "I have written a {thing} in English.", "______ Madina ever ______ (write) a {thing} in English for a {who}?", ["Has", "written"],
    { thing: ["story", "poem", "letter", "song"], who: ["competition", "teacher", "friend", "school magazine"] }],
  [PAST_Q, "Did you go to {city} last summer?", "______ you ever ______ (visit) {city} with your {person}?", ["Have", "visited"],
    { city: ["Khiva", "Bukhara", "Samarkand", "Termez"], person: ["family", "class", "friends", "cousins"] }],
  [PAST_Q, "Did your sister try {food} yesterday?", "______ your sister ever ______ (try) {food} at a {place}?", ["Has", "tried"],
    { food: ["sushi", "pizza", "Korean food", "fish soup"], place: ["café", "restaurant", "party", "friend's house"] }],
  [PAST_Q, "Did they swim in the {place} last week?", "______ they ever ______ (swim) in the {place} in {season}?", ["Have", "swum"],
    { place: ["sea", "Charvak lake", "river", "mountain lake"], season: ["winter", "spring", "autumn", "March"] }],
  [PAST_Q, "Did Aziz drive to {city} on Sunday?", "______ Aziz ever ______ (drive) to {city} on the {road}?", ["Has", "driven"],
    { city: ["Samarkand", "Fergana", "Bukhara", "Jizzakh"], road: ["motorway", "mountain road", "old road", "main road"] }],
  [PAST_Q, "Did you meet {name} at the party last night?", "______ you ever ______ (meet) {name} at a {place}?", ["Have", "met"],
    { name: ["Aziz", "Olga", "Bobur", "Nigora"], place: ["party", "wedding", "concert", "club"] }],
  [ANS_Q, "Yes, I have. I flew to {city} with my {person} in 2024.", "______ you ever ______ (fly) on a plane?", ["Have", "flown"],
    { city: ["Seoul", "Dubai", "Istanbul", "Moscow"], person: ["family", "class", "father", "aunt"] }],
  [ANS_Q, "No, she hasn't. She is afraid of {thing}.", "______ your sister ever ______ (climb) a mountain near {place}?", ["Has", "climbed"],
    { thing: ["heights", "the cold", "snakes", "wild animals"], place: ["Chimgan", "Zomin", "Boysun", "Charvak"] }],
  [ANS_Q, "Yes, they have. They won the {thing} last year.", "______ your team ever ______ (win) a {competition}?", ["Has", "won"],
    { thing: ["city cup", "final", "school cup", "big match"], competition: ["cup", "big competition", "final", "trophy"] }],
  [ANS_Q, "No, I haven't. I don't like {thing}.", "______ you ever ______ (sleep) in a tent in the {place}?", ["Have", "slept"],
    { thing: ["camping", "the cold", "insects", "the dark"], place: ["mountains", "forest", "desert", "countryside"] }],
  [ANS_Q, "Yes, he has. He worked in a {place} in {city}.", "______ your cousin ever ______ (work) in another city?", ["Has", "worked"],
    { place: ["hotel", "café", "bank", "shop"], city: ["Moscow", "Seoul", "Istanbul", "Almaty"] }],
].map(([instr, source, hint, key, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: why(key[0], key[1]), slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one question to ask a friend about a city they have visited.", "Have you ever been to", ["exactly one question", "must use ever", "must name a city"]],
  ["Write one question about food someone has eaten.", "Have/Has + ever + eaten", ["exactly one question", "must use ever", "must use eaten"]],
  ["Write one question about your teacher's life experience.", "Has + ever + past participle", ["exactly one question", "must start with Has", "must use ever"]],
  ["Write one question about an animal someone has ridden or seen.", "ever ridden or ever seen", ["exactly one question", "must use ever", "must name an animal"]],
  ["Write one question about a sport someone has played.", "Have you ever played", ["exactly one question", "must use ever", "must name a sport"]],
  ["Write one question to ask two friends about a trip.", "Have you ever + past participle", ["exactly one question", "must use ever", "must name a place"]],
  ["Write one question with ever and an irregular past participle.", "Have/Has + ever + irregular participle", ["exactly one question", "must use ever", "participle must be irregular"]],
  ["Write a question with ever and a short answer to it.", "Have you ever...? Yes, I have / No, I haven't", ["one question and one short answer", "must use ever", "short answer with have or haven't"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are meeting a new classmate. Write four questions about their life experience.", "Have you ever + past participle", ["four questions", "ever in each", "different verbs"]],
  ["Write a short interview with a visitor to your city: three questions with ever and their answers.", "present perfect questions and short answers", ["Have you ever", "Yes, I have / No, I haven't", "three different places or things"]],
  ["Your friend wants to visit Uzbekistan. Write three or four questions to find out what they have already done.", "Have you ever + past participle", ["ever", "food, places or transport", "past participles"]],
  ["Write a quiz for your class: four questions about unusual experiences.", "Have you ever + past participle", ["four questions", "ever", "irregular participles"]],
  ["Ask a grandparent about their life: write three or four questions with ever.", "Have/Has + ever + past participle", ["ever", "different verbs", "question word order"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.perfect.experience-ever.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);