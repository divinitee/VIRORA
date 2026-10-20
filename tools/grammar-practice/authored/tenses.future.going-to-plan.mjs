// Hand-authored: tenses / future / going-to-plan (A2).
//
// Tests ONE point: be going to for a plan someone has already made
// ("I have bought the tickets. I am going to visit my aunt."). The subject is
// never slotted, so am/is/are is fixed per item.
//
// Choose distractors are form errors only: dropped be, wrong be (agreement),
// "be go to". "will" and the present continuous are NOT distractors: both can
// also talk about a plan, so either could be a second right answer.
//
// Run: node tools/grammar-practice/authored/tenses.future.going-to-plan.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "future", topic: "going-to-plan", level: "A2", pv: "2.5" };
const BE = { I: "am", he: "is", she: "is", we: "are", they: "are" };
const WRONG_BE = { am: "is", is: "are", are: "is" };
const opts = (s) => { const b = BE[s]; return [`${b} going to`, `${WRONG_BE[b]} going to`, "going to", `${b} go to`]; };
const WHY_C = (s) => `This plan is already made, so use be going to. With ${s}, use ${BE[s]} going to + verb.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["I", "I have bought the tickets. I ______ visit my {person} in {city} next week.",
    { person: ["grandmother", "uncle", "aunt", "cousins"], city: ["Bukhara", "Khiva", "Samarkand", "Termez"] }],
  ["we", "We ______ paint our {room} {colour} this weekend.",
    { room: ["kitchen", "bedroom", "living room", "hall"], colour: ["white", "blue", "green", "yellow"] }],
  ["she", "Kamila has saved money for months. She ______ buy a new {thing} at the {place}.",
    { thing: ["laptop", "phone", "bike", "camera"], place: ["market", "big shop", "mall", "electronics shop"] }],
  ["he", "Aziz ______ study {subject} at university in {city} next year.",
    { subject: ["IT", "medicine", "economics", "law"], city: ["Seoul", "Tashkent", "Moscow", "Istanbul"] }],
  ["they", "My parents ______ sell their old {thing} this summer because they need {reason}.",
    { thing: ["car", "sofa", "fridge", "TV"], reason: ["money", "a new one", "more space", "a bigger one"] }],
  ["I", "I ______ start a {class} at the {place} in January.",
    { class: ["new course", "new class", "short course", "weekend class"], place: ["sports centre", "language centre", "college", "music school"] }],
  ["we", "We have decided. We ______ have the party at our {person}'s {home}.",
    { person: ["grandmother", "uncle", "aunt", "cousin"], home: ["house", "flat", "dacha", "garden"] }],
  ["she", "Nigora ______ learn to drive with her {person} in his {car}.",
    { person: ["father", "uncle", "brother", "grandfather"], car: ["car", "old car", "new car", "small car"] }],
  ["he", "My brother has booked a room in a {hotel}. He ______ stay in {city} for three nights.",
    { hotel: ["hotel", "small hotel", "guest house", "hostel"], city: ["Khiva", "Bukhara", "Almaty", "Istanbul"] }],
  ["they", "The students ______ visit the {place} in {city} on Friday.",
    { place: ["museum", "old town", "zoo", "theatre"], city: ["Samarkand", "Tashkent", "Bukhara", "Fergana"] }],
  ["I", "I ______ cook {food} for our family {event} on Sunday.",
    { food: ["plov", "manti", "lagman", "samsa"], event: ["dinner", "party", "lunch", "celebration"] }],
  ["we", "We ______ fly to {city} for our {holiday} in August.",
    { city: ["Istanbul", "Seoul", "Dubai", "Almaty"], holiday: ["holiday", "summer holiday", "family trip", "short break"] }],
  ["he", "Rustam has found a job at a {place}. He ______ start work there as a {job}.",
    { place: ["café", "hotel", "bank", "shop"], job: ["cashier", "cleaner", "helper", "manager"] }],
  ["she", "My aunt ______ open a small {shop} near the {place}.",
    { shop: ["bakery", "café", "flower shop", "clothes shop"], place: ["market", "metro", "school", "park"] }],
  ["they", "Our neighbours ______ move to a bigger {home} in {district}.",
    { home: ["flat", "house", "home", "apartment"], district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"] }],
  ["I", "I have decided. I ______ join the {club} at {place}.",
    { club: ["football club", "chess club", "dance club", "film club"], place: ["school", "college", "university", "our centre"] }],
  ["we", "We ______ get a {pet} for our {person}'s birthday.",
    { pet: ["puppy", "kitten", "parrot", "rabbit"], person: ["son", "daughter", "brother", "sister"] }],
  ["he", "Javohir ______ take the {exam} again in the spring because he wants a {result}.",
    { exam: ["driving test", "IELTS exam", "maths exam", "entrance exam"], result: ["better score", "higher score", "better result", "good result"] }],
  ["they", "My cousins ______ spend the holidays at their {person}'s {home}.",
    { person: ["grandmother", "uncle", "aunt", "grandfather"], home: ["house", "dacha", "flat", "village house"] }],
  ["I", "I ______ visit the {place} with my {person} after class.",
    { place: ["library", "bookshop", "gym", "park"], person: ["friend", "sister", "classmate", "cousin"] }],
].map(([s, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(s), key: 0, why: WHY_C(s), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence about a plan. Use be going to and the verb in brackets.";
const WHY_B = (s, v) => `The plan is already made, so use be going to: ${s} ${BE[s]} going to ${v}.`;
const BUILD = [
  ["I", "visit", "I have bought my bus ticket. I ______ (visit) my {person} in {city} next week.",
    { person: ["grandmother", "uncle", "aunt", "cousins"], city: ["Bukhara", "Khiva", "Samarkand", "Termez"] }],
  ["we", "paint", "We have chosen {colour} for our {room}. We ______ (paint) it this weekend.",
    { colour: ["white", "blue", "green", "yellow"], room: ["kitchen", "bedroom", "living room", "hall"] }],
  ["she", "buy", "Kamila has saved money for months. She ______ (buy) a new {thing} at the {place}.",
    { thing: ["laptop", "phone", "bike", "camera"], place: ["market", "big shop", "mall", "electronics shop"] }],
  ["he", "study", "Aziz has chosen his university. He ______ (study) {subject} in {city}.",
    { subject: ["IT", "medicine", "economics", "law"], city: ["Seoul", "Tashkent", "Moscow", "Istanbul"] }],
  ["they", "sell", "My parents have decided. They ______ (sell) their old {thing} this summer, and they have told {who}.",
    { thing: ["car", "sofa", "fridge", "TV"], who: ["everyone", "our neighbours", "the family", "my uncle"] }],
  ["I", "start", "I have paid for a {class} at the {place}. I ______ (start) in January.",
    { class: ["new course", "new class", "short course", "weekend class"], place: ["sports centre", "language centre", "college", "music school"] }],
  ["we", "have", "Our plan is ready. We ______ (have) the party at our {person}'s {home}.",
    { person: ["grandmother", "uncle", "aunt", "cousin"], home: ["house", "flat", "dacha", "garden"] }],
  ["she", "learn", "Nigora has found a {teacher}. She ______ (learn) English with her at the {place}.",
    { teacher: ["tutor", "teacher", "new teacher", "private tutor"], place: ["language centre", "college", "library", "centre"] }],
  ["he", "stay", "My brother has booked a room in a {hotel}. He ______ (stay) in {city} for three nights.",
    { hotel: ["hotel", "small hotel", "guest house", "hostel"], city: ["Khiva", "Bukhara", "Almaty", "Istanbul"] }],
  ["they", "visit", "The students have their tickets. They ______ (visit) the {place} in {city} on Friday.",
    { place: ["museum", "old town", "zoo", "theatre"], city: ["Samarkand", "Tashkent", "Bukhara", "Fergana"] }],
  ["I", "cook", "I have bought rice and meat for {count} people. I ______ (cook) plov for our family {event} on Sunday.",
    { count: ["ten", "twelve", "fifteen", "twenty"], event: ["dinner", "party", "lunch", "celebration"] }],
  ["we", "fly", "We have our plane tickets. We ______ (fly) with our {person} for our {holiday} in August.",
    { person: ["children", "parents", "grandparents", "cousins"], holiday: ["holiday", "summer holiday", "family trip", "short break"] }],
  ["he", "start", "Rustam has found a job at a {place}. He ______ (start) work there as a {job} on Monday.",
    { place: ["café", "hotel", "bank", "shop"], job: ["cashier", "cleaner", "helper", "manager"] }],
  ["she", "open", "My aunt has found a good building. She ______ (open) a small {shop} near the {place}.",
    { shop: ["bakery", "café", "flower shop", "clothes shop"], place: ["market", "metro", "school", "park"] }],
  ["they", "move", "Our neighbours have sold their flat. They ______ (move) into a bigger {home} in {district}.",
    { home: ["flat", "house", "home", "apartment"], district: ["Chilonzor", "Yunusobod", "Sergeli", "Mirobod"] }],
  ["I", "join", "I have decided. I ______ (join) the {club} at {place}.",
    { club: ["football club", "chess club", "dance club", "film club"], place: ["school", "college", "university", "our centre"] }],
  ["we", "get", "We have talked with our {person}. We ______ (get) a {pet} for the children.",
    { person: ["landlord", "neighbours", "parents", "family"], pet: ["puppy", "kitten", "parrot", "rabbit"] }],
  ["he", "take", "Javohir wants a {result}. He ______ (take) the {exam} again in the spring.",
    { result: ["better score", "higher score", "better result", "good result"], exam: ["driving test", "IELTS exam", "maths exam", "entrance exam"] }],
  ["they", "spend", "My cousins have their bags ready. They ______ (spend) the holidays at their {person}'s {home}.",
    { person: ["grandmother", "uncle", "aunt", "grandfather"], home: ["house", "dacha", "flat", "village house"] }],
  ["I", "meet", "I have finished my homework. I ______ (meet) my {person} at the {place} after class.",
    { person: ["friend", "sister", "classmate", "cousin"], place: ["library", "bookshop", "gym", "park"] }],
].map(([s, v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${BE[s]} going to ${v}`, why: WHY_B(s, v), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_SUBJ = "Read the first sentence. Complete the second sentence about a new person. Use be going to and the verb in brackets.";
const T_NEG = "Read the first sentence. The plan has changed. Complete the second sentence with the negative of be going to and the verb in brackets.";
const T_Q = "Read the first sentence. Ask about the plan. Complete the question with be going to and the verb in brackets.";
const TRANSFORM = [
  // kind 1: change the subject
  [T_SUBJ, "I am going to visit {city} in the spring with my {person}.", "My friend wants the same trip. She ______ (visit) {city} with us.",
    "is going to visit", "With she, use is: she is going to visit.",
    { city: ["Khiva", "Bukhara", "Samarkand", "Istanbul"], person: ["family", "parents", "sister", "cousins"] }],
  [T_SUBJ, "We are going to buy a {thing} for our {room}.", "My brother has the same idea. He ______ (buy) a {thing} for his {room}.",
    "is going to buy", "With he, use is: he is going to buy.",
    { thing: ["new lamp", "small desk", "new carpet", "bookshelf"], room: ["room", "bedroom", "flat", "study"] }],
  [T_SUBJ, "I am going to learn {lang} this year.", "My parents have the same plan. They ______ (learn) {lang} with me at the {place}.",
    "are going to learn", "With they, use are: they are going to learn.",
    { lang: ["English", "Korean", "German", "Turkish"], place: ["language centre", "college", "centre", "library"] }],
  [T_SUBJ, "Aziz is going to play in the {sport} match on Saturday.", "I have decided too. I ______ (play) in the {sport} match with him at the {place}.",
    "am going to play", "With I, use am: I am going to play.",
    { sport: ["football", "basketball", "volleyball", "tennis"], place: ["stadium", "park", "school field", "sports hall"] }],
  [T_SUBJ, "She is going to take the {transport} to {city}.", "We have our tickets too. We ______ (take) the {transport} with her.",
    "are going to take", "With we, use are: we are going to take.",
    { transport: ["train", "bus", "plane", "night train"], city: ["Moscow", "Almaty", "Bukhara", "Nukus"] }],
  // kind 2: the plan has changed -> negative
  [T_NEG, "Malika has changed her mind. She doesn't want a {thing} now.", "She ______ (order) a {thing} from the {place}.",
    "is not going to order", "She doesn't want it now, so the plan is negative: she is not going to order.",
    { thing: ["new phone", "new dress", "laptop", "watch"], place: ["shop", "market", "website", "catalogue"] }],
  [T_NEG, "My father has a lot of work this {time}.", "He ______ (come) on holiday with us in {city}.",
    "is not going to come", "He has too much work, so the plan is negative: he is not going to come.",
    { time: ["week", "month", "summer", "year"], city: ["Khiva", "Bukhara", "Almaty", "Istanbul"] }],
  [T_NEG, "The weather in {city} looks bad for the weekend.", "We ______ (have) our picnic in the {place}.",
    "are not going to have", "The weather is bad, so the plan is negative: we are not going to have.",
    { city: ["Tashkent", "Samarkand", "Fergana", "Jizzakh"], place: ["park", "mountains", "garden", "yard"] }],
  [T_NEG, "I have a cold and a high fever.", "I ______ (watch) the {sport} match with my {person} tonight.",
    "am not going to watch", "I am ill, so the plan is negative: I am not going to watch.",
    { sport: ["football", "tennis", "volleyball", "basketball"], person: ["friends", "brother", "cousins", "classmates"] }],
  [T_NEG, "The {shop} near our house has closed.", "We ______ (get) our {food} there now.",
    "are not going to get", "The shop has closed, so the plan is negative: we are not going to get.",
    { shop: ["bakery", "shop", "market", "café"], food: ["bread", "fruit", "cakes", "milk"] }],
  // kind 3: ask about the plan
  [T_Q, "My sister plans to sell her old {thing} at the {place}.", "______ she ______ (sell) her old {thing}?",
    ["Is", "going to sell"], "In a question, be comes first: Is she going to sell?",
    { thing: ["bike", "phone", "laptop", "camera"], place: ["market", "weekend market", "shop", "flea market"] }],
  [T_Q, "Our neighbours plan to paint their {thing} {colour}.", "______ they ______ (paint) their {thing} {colour}?",
    ["Are", "going to paint"], "In a question, be comes first: Are they going to paint?",
    { thing: ["door", "fence", "gate", "house"], colour: ["white", "green", "blue", "brown"] }],
  [T_Q, "You plan to cook {food} for the {event}.", "______ you ______ (cook) {food} for the {event}?",
    ["Are", "going to cook"], "In a question, be comes first: Are you going to cook?",
    { food: ["plov", "manti", "lagman", "soup"], event: ["party", "guests", "dinner", "birthday"] }],
  [T_Q, "Aziz plans to study {subject} in {city}.", "______ he ______ (study) {subject} there?",
    ["Is", "going to study"], "In a question, be comes first: Is he going to study?",
    { subject: ["IT", "medicine", "economics", "law"], city: ["Seoul", "Moscow", "Istanbul", "Tashkent"] }],
  [T_Q, "Your parents plan to invite {who} to the {event}.", "______ they ______ (invite) {who}?",
    ["Are", "going to invite"], "In a question, be comes first: Are they going to invite?",
    { who: ["our neighbours", "the teachers", "all the cousins", "their friends"], event: ["wedding", "party", "dinner", "celebration"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about your plan for this weekend. Use be going to.", "be going to (plan)", ["exactly one sentence", "must use going to", "must name the weekend"]],
  ["Write one sentence about a trip your family has planned.", "be going to (plan)", ["exactly one sentence", "must use we are going to", "must name a place"]],
  ["Write one sentence about something you are going to buy. Say why.", "be going to (plan)", ["exactly one sentence", "must use going to", "must give a reason"]],
  ["Write one sentence about a friend's plan for next year.", "is going to", ["exactly one sentence", "must use he or she", "must use going to"]],
  ["Write one sentence about a plan you have changed. Use the negative.", "not going to", ["exactly one sentence", "must use not going to", "must name the plan"]],
  ["Ask a friend one question about their plans for the holidays.", "Are you going to...?", ["exactly one question", "must start with Are", "must use going to"]],
  ["Write one sentence about what you are going to study.", "am going to", ["exactly one sentence", "must use I am going to", "must name a subject"]],
  ["Write two sentences: one plan you have made and one thing you are not going to do.", "going to + not going to", ["exactly two sentences", "one with going to", "one with not going to"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about your plans for next summer. Write three or four sentences.", "be going to (plan)", ["am going to", "a place or activity", "a reason"]],
  ["Your family is planning a party. Write three or four sentences about the plan.", "be going to (plan)", ["are going to", "who is going to do what", "a time"]],
  ["Write about a friend who has a big plan for next year. Write three or four sentences.", "be going to (plan)", ["is going to", "what has already been done", "a reason"]],
  ["Write about your plans after you finish school or college. Write three or four sentences.", "be going to (plan)", ["am going to", "a job or study", "not going to"]],
  ["Write about a trip you have already booked. Write three or four sentences.", "be going to (plan)", ["going to", "tickets or booking", "what you are going to do there"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/tenses.future.going-to-plan.json", JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to content/grammar-practice/tenses.future.going-to-plan.json`);