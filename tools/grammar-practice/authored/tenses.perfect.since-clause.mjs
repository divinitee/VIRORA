// Hand-authored: tenses / perfect / since-clause (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): PRESENT PERFECT in the main clause with a
// SINCE + PAST SIMPLE clause ("She has worked here since she finished
// university"). Siblings for-since and since-duration (A2) use since + a point
// (since 2020, since Monday): here the since part is always a full clause with
// its own subject and verb.
// Two angles: 14 choose / 16 build / 10 transform test the MAIN verb (has /
// have + participle); 6 / 4 / 5 test the verb INSIDE the since clause (past
// simple: since we moved, since she was ten).
//
// One right answer: the present perfect continuous ("has been working") is also
// right in the main clause, so it is never an option, typed keys accept it, and
// instructions say "present perfect". Main-clause distractors: past simple /
// present simple / present continuous (worked / works / is working). Since-clause
// distractors: present / present continuous / will (moved / move / are moving /
// will move); "have moved" is never offered (natives sometimes say it).
// Transform: 5 two sentences → since clause (main verb) / 5 correct the mistake /
// 5 write the since clause (past simple).
//
// Run: node tools/grammar-practice/authored/tenses.perfect.since-clause.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "since-clause", level: "B1", pv: "2.5" };
const NAME = ["Zarina", "Sherzod", "Nodira", "Akmal"]; // listener names: never printed in a sentence (audit 20 Nov)
const NAME_F = ["Madina", "Olga", "Sevara", "Nilufar"];
const NAME_M = ["Sardor", "Timur", "Ilya", "Jasur"];
const WHY_M = (pp) => `The time started in the past and goes on now, so the main clause takes the present perfect: ${pp}. The since clause says when it started.`;
const WHY_S = (v) => `The since clause names a finished moment in the past, so it takes the past simple: ${v}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [kind, key, [d1, d2, d3], prompt, slots]
const CHOOSE = [
  ["m", "has worked", ["worked", "works", "is working"], "{name} ______ at the {place} since she finished university.", { name: NAME_F, place: ["bank", "hospital", "school", "hotel"] }],
  ["m", "have known", ["knew", "know", "am knowing"], "I ______ {name} since we were at primary school.", { name: NAME, x: [] }],
  ["m", "have lived", ["lived", "live", "are living"], "We ______ in this {home} since I was {age}.", { home: ["flat", "house", "street", "village"], age: ["five", "six", "seven", "a baby"] }],
  ["m", "has had", ["had", "has", "is having"], "My brother ______ the same {thing} since he started college.", { thing: ["phone", "bike", "bag", "laptop"], x: [] }],
  ["m", "has played", ["played", "plays", "is playing"], "{name} ______ for the city team since he was {age}, {who}.", { name: NAME_M, age: ["twelve", "thirteen", "fourteen", "fifteen"], who: ["Aziz", "Olga", "Mum", "Dad"] }],
  ["m", "have been", ["were", "are", "are being"], "My parents ______ married since they finished {school}.", { school: ["school", "college", "university", "their studies"], x: [] }],
  ["m", "has changed", ["changed", "changes", "is changing"], "Our {place} ______ a lot since they built the new {thing}.", { place: ["town", "street", "village", "area"], thing: ["road", "school", "bridge", "market"] }],
  ["m", "have wanted", ["wanted", "want", "am wanting"], "I ______ a {pet} since I was a small child, {name}.", { pet: ["dog", "cat", "parrot", "rabbit"], name: NAME }],
  ["m", "has taught", ["taught", "teaches", "is teaching"], "Mr Karimov ______ at our {school} since it opened.", { school: ["school", "lyceum", "college", "language centre"], x: [] }],
  ["m", "have studied", ["studied", "study", "am studying"], "I ______ English since I moved to {city}.", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], x: [] }],
  ["m", "has felt", ["felt", "feels", "is feeling"], "My grandmother ______ much better since she started {thing}.", { thing: ["walking every day", "swimming", "doing yoga", "eating more fruit"], x: [] }],
  ["m", "haven't seen", ["didn't see", "don't see", "am not seeing"], "I ______ my cousins since they moved to {city}, {name}.", { city: ["Moscow", "Seoul", "Almaty", "Istanbul"], name: NAME }],
  ["m", "hasn't called", ["didn't call", "doesn't call", "isn't calling"], "{name} ______ me since we had that argument about the {thing}.", { name: NAME, thing: ["party", "money", "trip", "football match"] }],
  ["m", "have used", ["used", "use", "am using"], "I ______ this {thing} every day since my uncle gave it to me.", { thing: ["bike", "watch", "laptop", "camera"], x: [] }],
  ["s", "moved", ["move", "are moving", "will move"], "We have had a garden since we ______ to the {place}.", { place: ["new house", "village", "country", "suburbs"], x: [] }],
  ["s", "was", ["is", "has", "will be"], "{name} has loved music since she ______ a little girl.", { name: NAME_F, x: [] }],
  ["s", "started", ["start", "are starting", "will start"], "We have become good friends since we ______ {thing} together.", { thing: ["college", "work", "training", "English lessons"], x: [] }],
  ["s", "were", ["are", "have", "will be"], "My cousin and I have known each other since we ______ {age}.", { age: ["three", "four", "babies", "in kindergarten"], x: [] }],
  ["s", "left", ["leave", "are leaving", "will leave"], "{name} hasn't been back to {city} since he ______ ten years ago.", { name: NAME_M, city: ["Khiva", "Nukus", "Termez", "his village"] }],
  ["s", "bought", ["buy", "are buying", "will buy"], "We have saved a lot of money since we ______ the {car}.", { car: ["electric car", "small car", "new bike", "bus pass"], x: [] }],
].map(([kind, key, ds, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const opts = [key, ...ds];
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(key), why: kind === "m" ? WHY_M(key) : WHY_S(key), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const IM = "Write the verb in brackets in the present perfect.";
const IS = "Write the verb in brackets in the past simple.";
// [instr, key, source, slots]
const BUILD = [
  [IM, "has worked", "My aunt ______ (work) at the {place} since she finished {school}.", { place: ["bakery", "pharmacy", "post office", "clinic"], school: ["school", "college", "her course", "university"] }],
  [IM, "have lived", "My grandparents ______ (live) in {city} since they got married, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Namangan"], name: NAME }],
  [IM, "has known", "{name} ______ (know) how to swim since she was {age}.", { name: NAME_F, age: ["four", "five", "six", "seven"] }],
  [IM, "have had", "We ______ (have) this {thing} since we moved here, {name}.", { thing: ["sofa", "table", "fridge", "carpet"], name: NAME }],
  [IM, "has grown", "My little {sib} ______ (grow) a lot since you last saw him, {name}.", { sib: ["brother", "cousin", "nephew"], name: NAME }],
  [IM, "have learned", "I ______ (learn) many new words since I started {thing}, {name}.", { thing: ["reading English books", "watching films in English", "this course", "using the app"], name: NAME }],
  [IM, "has become", "Our {area} ______ (become) much quieter since they closed the {place}.", { area: ["street", "area", "village", "town"], place: ["old market", "car park", "factory", "big shop"] }],
  [IM, "has wanted", "My {who} ______ (want) to be a doctor since she was in {class}.", { who: ["sister", "cousin", "best friend", "niece"], class: ["primary school", "year five", "year three", "kindergarten"] }],
  [IM, "has driven", "My {who} ______ (drive) the same {car} since I was born.", { who: ["father", "uncle", "grandfather"], car: ["car", "white car", "old car", "truck"] }],
  [IM, "have made", "We ______ (make) a lot of friends since we joined the {club}, {name}.", { club: ["chess club", "football club", "choir", "dance group"], name: NAME }],
  [IM, "has been", "{name} ______ (be) very happy since he got his new {job}.", { name: NAME_M, job: ["job", "bike", "puppy", "phone"] }],
  [IM, "have read", "I ______ (read) five books since the {season} holidays started, {name}.", { season: ["summer", "winter", "spring", "autumn"], name: NAME }],
  [IM, "hasn't eaten", "My {who} ______ (not eat) meat since he watched a film about {thing}.", { who: ["cousin", "brother", "uncle", "friend"], thing: ["farms", "animals", "cows", "food"] }],
  [IM, "haven't been", "We ______ (not be) to the {place} since it closed for repairs, {name}.", { place: ["pool", "museum", "cinema", "library"], name: NAME }],
  [IM, "has helped", "Our {who} ______ (help) us a lot since my father broke his {part}.", { who: ["neighbour", "uncle", "aunt", "grandmother"], part: ["leg", "arm", "wrist", "ankle"] }],
  [IM, "have saved", "I ______ (save) a lot of money since I started {thing} to school, {name}.", { thing: ["walking", "cycling", "riding my bike", "going by bus"], name: NAME }],
  [IS, "finished", "My {who} has worked at the {place} since he ______ (finish) college.", { who: ["brother", "uncle", "cousin", "father"], place: ["bank", "airport", "hotel", "hospital"] }],
  [IS, "was", "{name} has played the {instr} since she ______ (be) six.", { name: NAME_F, instr: ["piano", "violin", "guitar", "dutar"] }],
  [IS, "moved", "We haven't seen our old neighbours since we ______ (move) to {city}, {name}.", { city: ["Tashkent", "Samarkand", "Andijan", "Namangan"], name: NAME }],
  [IS, "got", "My {who} has been much calmer since he ______ (get) his new {job}.", { who: ["father", "uncle", "brother", "grandfather"], job: ["job", "car", "garden", "dog"] }],
].map(([instr, key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  const why = instr === IM ? WHY_M(key) : WHY_S(key);
  const acc = [];
  if (instr === IM && !/n't/.test(key) && !/ been$/.test(key) && !/ had$/.test(key) && !/ known$/.test(key) && !/ become$/.test(key) && !/ wanted$/.test(key)) {
    const [aux, pp] = key.split(" ");
    const ING = { worked: "working", lived: "living", grown: "growing", learned: "learning", driven: "driving", made: "making", read: "reading", helped: "helping", saved: "saving" };
    if (ING[pp]) acc.push(`${aux} been ${ING[pp]}`);
  }
  return { ...BASE, stage: "build", format: "gap_fill", instr, source, key, why, slots: s, ...(acc.length ? { acceptable: acc } : {}) };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with since. Use the present perfect.";
const FIX = "Correct the mistake.";
const CL = "Finish the since clause with the verb in the past simple.";
// [instr, source, hint, key, why, acceptable, slots]
const TRANSFORM = [
  [JOIN, "{name} started working at the {place} after college. She still works there.", "{name} ______ at the {place} since she finished college.", "has worked", WHY_M("has worked"), ["has been working"], { name: NAME_F, place: ["bank", "café", "hotel", "clinic"] }],
  [JOIN, "We moved into this {home} when I was {age}. We still live here.", "We ______ in this {home} since I was {age}.", "have lived", WHY_M("have lived"), ["have been living"], { home: ["flat", "house", "building"], age: ["six", "eight", "ten", "a baby"] }],
  [JOIN, "I met {name} when we started {school}. I still know her.", "I ______ {name} since we started {school}.", "have known", WHY_M("have known"), [], { name: NAME_F, school: ["school", "college", "kindergarten", "primary school"] }],
  [JOIN, "My brother got a {pet} when he was {age}. He still has it.", "My brother ______ a {pet} since he was {age}.", "has had", WHY_M("has had"), [], { pet: ["dog", "cat", "parrot", "tortoise"], age: ["nine", "ten", "seven", "eight"] }],
  [JOIN, "My {who} began to teach {subj} when he left university. He still teaches it.", "My {who} ______ {subj} since he left university.", "has taught", WHY_M("has taught"), ["has been teaching"], { who: ["uncle", "father", "older brother", "cousin"], subj: ["maths", "history", "English", "music"] }],
  [FIX, "I know {name} since we were {age}.", "I ______ {name} since we were {age}.", "have known", "Since + a past moment needs the present perfect, not the present simple: have known.", [], { name: NAME, age: ["children", "at school", "six", "babies"] }],
  [FIX, "My sister lived in {city} since she got married, {name}.", "My sister ______ in {city} since she got married, {name}.", "has lived", "She still lives there, so not the past simple: has lived.", ["has been living"], { city: ["Moscow", "Tashkent", "Seoul", "Bukhara"], name: NAME }],
  [FIX, "We are here since the {event} started, {name}.", "We ______ here since the {event} started, {name}.", "have been", "With since, use the present perfect of be: have been.", [], { event: ["film", "concert", "match", "lesson"], name: NAME }],
  [FIX, "{name} has played {game} since he has been five.", "{name} has played {game} since he ______ five.", "was", "The since clause is a finished moment, so the past simple: was.", [], { name: NAME_M, game: ["chess", "football", "tennis", "the piano"] }],
  [FIX, "I haven't eaten since I have had {meal}, {name}.", "I haven't eaten since I ______ {meal}, {name}.", "had", "The since clause is a finished moment, so the past simple: had.", [], { name: NAME, meal: ["breakfast", "lunch", "that sandwich", "my morning tea"] }],
  [CL, "My parents got married in {time}. They have lived in {city} since then.", "My parents have lived in {city} since they ______ married.", "got", WHY_S("got"), [], { time: ["1998", "2001", "2005", "2010"], city: ["Samarkand", "Bukhara", "Andijan", "Termez"] }],
  [CL, "{name} started school in {time}. He has worn glasses since then.", "{name} has worn glasses since he ______ school.", "started", WHY_S("started"), [], { name: NAME_M, time: ["2015", "2018", "2019", "2020"] }],
  [CL, "We sold our old car {time}. We haven't had a car since then, {name}.", "We haven't had a car since we ______ the old one, {name}.", "sold", WHY_S("sold"), [], { time: ["last year", "in 2022", "in the spring", "in the summer"], name: NAME }],
  [CL, "I saw the doctor {time}. I have felt better since then, {name}.", "I have felt better since I ______ the doctor, {name}.", "saw", WHY_S("saw"), [], { time: ["on Monday", "last week", "on Friday", "yesterday"], name: NAME }],
  [CL, "{name} came back from the trip {time}. She has been tired since then.", "{name} has been tired since she ______ back from the trip.", "came", WHY_S("came"), [], { name: NAME_F, time: ["on Sunday", "last week", "at the weekend", "on Friday"] }],
].map(([instr, source, hint, key, why, acc, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s, ...(acc.length ? { acceptable: acc } : {}) };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about where you have lived since you were a child.", "have lived … since I was …", ["exactly one sentence", "present perfect", "since + a clause"]],
  ["Write one sentence about a friend you have known since school.", "have known … since we …", ["exactly one sentence", "have known", "since + past simple"]],
  ["Write one sentence about something you have learned since you started this course.", "have learned … since I started …", ["exactly one sentence", "present perfect", "since I started"]],
  ["Write one sentence about how your town has changed since something happened.", "has changed since they built …", ["exactly one sentence", "has changed", "since + past simple"]],
  ["Write one sentence with haven't … since about someone you miss.", "haven't seen … since …", ["exactly one sentence", "haven't + past participle", "since + a clause"]],
  ["Write one sentence about a hobby you have had since you were small.", "have had / have played … since I was …", ["exactly one sentence", "present perfect", "since I was"]],
  ["Write one sentence about a family member's job: since when?", "has worked … since he / she …", ["exactly one sentence", "has worked", "since + past simple"]],
  ["Write two sentences: when something started (past simple) and how long it has gone on (present perfect + since).", "past simple vs present perfect + since", ["exactly two sentences", "past simple once", "present perfect + since once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["How has your life changed since you finished school or started college? Write three or four sentences.", "present perfect + since clause", ["has / have + participle", "since + past simple", "three or four sentences"]],
  ["Describe your best friend: how long you have known them and what you have done together since you met. Write three or four sentences.", "have known since we …", ["have known", "since we met / started", "present perfect"]],
  ["Write about your English: what you have learned since you started. Write three or four sentences.", "have learned since I started", ["since I started", "present perfect", "at least two verbs"]],
  ["Describe how your street or town has changed since you were little. Write three or four sentences.", "has changed since I was …", ["has changed / have built", "since I was", "now"]],
  ["Write a short message to an old friend you haven't seen since you moved. Write three or four sentences.", "haven't seen / have done since …", ["haven't + participle", "since + past simple", "a question"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.perfect.since-clause.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
