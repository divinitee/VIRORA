// Hand-authored: tenses / past / past-perfect-experience (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): the PAST PARTICIPLE in "had never … before"
// for an experience someone had not had up to a moment in the past ("She was
// nervous because she had never spoken in front of so many people before").
// Triage: kept. Sibling past-perfect-sequence owns by the time / when / already
// (two events in order), so every item here is about a FIRST TIME: had never /
// had ever … before / it was the first time … had.
// Choose keeps "had never" (or "had ever") printed and offers one irregular
// verb in four forms: participle (key) / past simple / base / -ing
// (spoken / spoke / speak / speaking), so only verbs whose three forms differ.
// Build: the participle alone after a printed "had never"; the instruction
// names the form.
// Transform: 5 "my first time" → had never … before / 5 present-perfect story
// moved to the past (has never → had never) / 5 correct the participle.
//
// Run: node tools/grammar-practice/authored/tenses.past.past-perfect-experience.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "past", topic: "past-perfect-experience", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAME_F = ["Madina", "Olga", "Sevara", "Nilufar"];
const NAME_M = ["Sardor", "Timur", "Ilya", "Jasur"];
const WHY = (pp) => `After had never / had ever, use the past participle: ${pp}. It was a new experience at that moment in the past.`;

/* ---------------- choose: 20 mcq ---------------- */
// [base, past, participle, ing, prompt, slots]
const CHOOSE = [
  ["speak", "spoke", "spoken", "speaking", "{name} was nervous because she had never ______ in front of so many {people} before.", { name: NAME_F, people: ["people", "students", "parents", "guests"] }],
  ["fly", "flew", "flown", "flying", "I was a bit scared on the plane to {city}. I had never ______ before, {name}.", { city: ["Istanbul", "Moscow", "Seoul", "Dubai"], name: NAME }],
  ["see", "saw", "seen", "seeing", "The children were so happy. They had never ______ {thing} before.", { thing: ["snow", "the sea", "a real camel", "mountains"], x: [] }],
  ["eat", "ate", "eaten", "eating", "{name} didn't know how to use chopsticks. He had never ______ {food} before.", { name: NAME_M, food: ["Korean food", "Chinese food", "sushi", "noodles"] }],
  ["ride", "rode", "ridden", "riding", "My little brother fell off the {animal} at the {place} because he had never ______ one before.", { animal: ["horse", "camel", "donkey", "pony"], place: ["farm", "zoo", "park", "village"] }],
  ["swim", "swam", "swum", "swimming", "{name} stayed near the beach. She had never ______ in the {water} before.", { name: NAME_F, water: ["sea", "ocean", "lake", "river"] }],
  ["drive", "drove", "driven", "driving", "My father was careful in {city} because he had never ______ there before, {name}.", { city: ["Tashkent", "Almaty", "Moscow", "Istanbul"], name: NAME }],
  ["write", "wrote", "written", "writing", "I didn't know how to start. I had never ______ a {text} in English before, {name}.", { text: ["letter", "story", "report", "cover letter"], name: NAME }],
  ["wear", "wore", "worn", "wearing", "{name} felt strange in the {thing}. He had never ______ one before.", { name: NAME_M, thing: ["suit", "tie", "uniform", "chapan"] }],
  ["drink", "drank", "drunk", "drinking", "My grandmother didn't like the {drink}. She had never ______ it before, {name}.", { drink: ["coffee", "cola", "green smoothie", "cold tea"], name: NAME }],
  ["sing", "sang", "sung", "singing", "Our teacher was nervous. She had never ______ on a stage before, {name}.", { name: NAME, x: [] }],
  ["take", "took", "taken", "taking", "I was excited at the {place}. I had never ______ a {trip} alone before.", { place: ["airport", "station", "bus station", "border"], trip: ["trip", "journey", "long trip", "holiday"] }],
  ["give", "gave", "given", "giving", "{name} was very nervous. She had never ______ a {talk} before.", { name: NAME_F, talk: ["talk", "speech", "presentation", "lesson"] }],
  ["throw", "threw", "thrown", "throwing", "Our team lost because the new player had never ______ a {ball} in a real match before.", { ball: ["ball", "basketball", "handball", "volleyball"], x: [] }],
  ["go", "went", "gone", "going", "Had you ever ______ abroad before your trip to {city}, {name}?", { city: ["Istanbul", "Seoul", "Dubai", "Almaty"], name: NAME }],
  ["see", "saw", "seen", "seeing", "Had your parents ever ______ a {show} before last night, {name}?", { show: ["ballet", "play", "circus show", "live concert"], name: NAME }],
  ["be", "was", "been", "being", "Before this trip, had you ever ______ to {city}, {name}?", { city: ["Khiva", "Nukus", "Termez", "Fergana"], name: NAME }],
  ["break", "broke", "broken", "breaking", "It was the first time I had ______ a {bone} in my life, {name}.", { bone: ["bone", "finger", "leg", "wrist"], name: NAME }],
  ["grow", "grew", "grown", "growing", "It was the first time my mother had ______ {veg} in our garden.", { veg: ["tomatoes", "potatoes", "melons", "carrots"], x: [] }],
  ["draw", "drew", "drawn", "drawing", "It was the first time {name} had ______ a picture of a {thing}.", { name: NAME, thing: ["horse", "face", "city", "car"] }],
].map(([v, past, pp, ing, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const opts = [pp, past, v, ing];
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(pp), why: WHY(pp), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write the past participle of the verb in brackets.";
const BUILD = [
  ["spoken", "She was nervous because she had never ______ (speak) on the radio before, {name}.", { name: NAME }],
  ["seen", "We stopped the car, {name}. We had never ______ (see) such a big {thing} before.", { thing: ["lake", "mountain", "field of flowers", "waterfall"], name: NAME }],
  ["flown", "{name} held my hand on the plane. He had never ______ (fly) to {city} before.", { name: NAME_M, city: ["Istanbul", "Seoul", "Moscow", "Dubai"] }],
  ["eaten", "I was surprised by the taste, {name}. I had never ______ (eat) {food} before.", { food: ["fish soup", "sushi", "Korean food", "Indian food"], name: NAME }],
  ["ridden", "{name} was scared because she had never ______ (ride) a {thing} before.", { name: NAME_F, thing: ["horse", "camel", "motorbike", "bike"] }],
  ["driven", "My {who} had never ______ (drive) in the {weather} before, so he went slowly.", { who: ["uncle", "father", "grandfather", "brother"], weather: ["snow", "rain", "fog", "dark"] }],
  ["swum", "The water was cold, and I had never ______ (swim) in a {water} before, {name}.", { water: ["lake", "river", "mountain lake", "cold sea"], name: NAME }],
  ["written", "My {who} had never ______ (write) an email in English before his {job} interview.", { who: ["brother", "cousin", "father", "uncle"], job: ["first", "new", "bank", "hotel"] }],
  ["worn", "{name} looked very smart. He had never ______ (wear) a {thing} before the wedding.", { name: NAME_M, thing: ["suit", "tie", "white shirt", "chapan"] }],
  ["sung", "Our {group} had never ______ (sing) in front of the whole {school} before.", { group: ["class", "choir", "group", "team"], school: ["school", "lyceum", "college", "town"] }],
  ["taken", "I had never ______ (take) the {transport} on my own before last {when}.", { transport: ["metro", "train", "night bus", "minibus"], when: ["week", "month", "summer", "Friday"] }],
  ["been", "{name} was excited. She had never ______ (be) to {city} before.", { name: NAME_F, city: ["Khiva", "Samarkand", "Bukhara", "Shahrisabz"] }],
  ["done", "My cousin had never ______ (do) a {sport} lesson before, so the coach helped him.", { sport: ["judo", "tennis", "boxing", "swimming"], x: [] }],
  ["met", "My parents had never ______ (meet) my teacher before the {event}, {name}.", { event: ["parents' meeting", "school concert", "graduation", "open day"], name: NAME }],
  ["drunk", "My {who} had never ______ (drink) {drink} before, and he didn't like it.", { who: ["grandfather", "father", "uncle", "little brother"], drink: ["coffee", "cola", "a milkshake", "a smoothie"] }],
  ["made", "{name} was proud. She had never ______ (make) {food} on her own before.", { name: NAME_F, food: ["plov", "manti", "a cake", "samsa"] }],
  ["won", "Our team was so happy. We had never ______ (win) a {thing} before, {name}.", { thing: ["cup", "match", "prize", "final"], name: NAME }],
  ["heard", "I had never ______ (hear) that {music} before last night.", { music: ["song", "singer", "band", "kind of music"], x: [] }],
  ["read", "{name} had never ______ (read) a whole book in English before this {time}.", { name: NAME, time: ["year", "summer", "month", "term"] }],
  ["tried", "My little sister had never ______ (try) {food} before the party.", { food: ["ice cream cake", "pizza", "chocolate", "lemon cake"], x: [] }],
].map(([pp, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: pp, why: WHY(pp), slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIRST = "Rewrite the sentence with had never … before.";
const PAST = "Put the story in the past.";
const FIX = "Correct the mistake.";
const whyF = (pp) => `It was the first time, so: had never + past participle (${pp}) + before.`;
const whyP = (pp) => `The story is now in the past, so has never → had never ${pp}.`;
const whyX = (bad, pp) => `${bad} is the past simple. After had, use the past participle: ${pp}.`;
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [FIRST, "Last {season} was my first time on a plane, {name}.", "Before last {season}, I ______ on a plane, {name}.", "had never flown", "", { season: ["summer", "winter", "spring", "year"], name: NAME }],
  [FIRST, "Yesterday was {name}'s first time in a {place}.", "Before yesterday, {name} ______ in a {place}.", "had never been", "", { name: NAME, place: ["theatre", "museum", "mosque", "stadium"] }],
  [FIRST, "At the party, it was my first time eating {food}, {name}.", "Before the party, I ______ {food}, {name}.", "had never eaten", "", { food: ["sushi", "pizza", "Korean food", "fish soup"], name: NAME }],
  [FIRST, "Last {when} was my brother's first time driving in {city}.", "Before last {when}, my brother ______ in {city}.", "had never driven", "", { when: ["week", "month", "year", "summer"], city: ["Tashkent", "Almaty", "Moscow", "Istanbul"] }],
  [FIRST, "In {month}, it was {name}'s first time seeing snow.", "Before {month}, {name} ______ snow.", "had never seen", "", { month: ["December", "January", "February", "that winter"], name: NAME }],
  [PAST, "{name} is excited. She has never been to {city}.", "{name} was excited. She ______ to {city} before.", "had never been", whyP("been"), { name: NAME_F, city: ["Khiva", "Samarkand", "Bukhara", "Tashkent"] }],
  [PAST, "I'm nervous, {name}. I have never spoken to a big {group}.", "I was nervous, {name}. I ______ to a big {group} before.", "had never spoken", whyP("spoken"), { group: ["audience", "class", "group", "crowd"], name: NAME }],
  [PAST, "My {who} is happy. She has never seen the {thing}.", "My {who} was happy. She ______ the {thing} before.", "had never seen", whyP("seen"), { who: ["grandmother", "mother", "aunt", "little sister"], thing: ["sea", "mountains", "new bridge", "old city"] }],
  [PAST, "{name} is scared. He has never ridden a {animal}.", "{name} was scared. He ______ a {animal} before.", "had never ridden", whyP("ridden"), { name: NAME_M, animal: ["horse", "camel", "donkey", "pony"] }],
  [PAST, "We are surprised, {name}. We have never eaten such good {food}.", "We were surprised, {name}. We ______ such good {food} before.", "had never eaten", whyP("eaten"), { food: ["plov", "bread", "fruit", "soup"], name: NAME }],
  [FIX, "She was nervous because she had never spoke on TV before, {name}.", "She was nervous because she had never ______ on TV before, {name}.", "spoken", whyX("Spoke", "spoken"), { name: NAME }],
  [FIX, "I had never swam in a {water} before that {trip}.", "I had never ______ in a {water} before that {trip}.", "swum", whyX("Swam", "swum"), { water: ["lake", "river", "pool", "cold sea"], trip: ["trip", "summer", "holiday", "camp"] }],
  [FIX, "{name} had never wrote a poem before {year}.", "{name} had never ______ a poem before {year}.", "written", whyX("Wrote", "written"), { name: NAME, year: ["2023", "2024", "last year", "that summer"] }],
  [FIX, "My {who} had never drove a {car} before.", "My {who} had never ______ a {car} before.", "driven", whyX("Drove", "driven"), { who: ["uncle", "father", "grandfather", "brother"], car: ["truck", "bus", "new car", "big car"] }],
  [FIX, "We had never saw such a big {thing} before, {name}.", "We had never ______ such a big {thing} before, {name}.", "seen", whyX("Saw", "seen"), { thing: ["city", "river", "market", "building"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  const pp = key.split(" ").pop();
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: why || whyF(pp), slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a place you visited for the first time. Use had never … before.", "had never been … before", ["exactly one sentence", "had never + past participle", "before"]],
  ["Write one sentence about a food you tried for the first time.", "had never eaten / tried", ["exactly one sentence", "had never", "name the food"]],
  ["Write one sentence about a time you were nervous because you had never done something.", "because + had never", ["exactly one sentence", "because", "had never + past participle"]],
  ["Write one question to a friend with Had you ever …?", "Had you ever + past participle?", ["exactly one question", "had ever", "before + a past event"]],
  ["Write one sentence with It was the first time I had …", "the first time + had + past participle", ["exactly one sentence", "it was the first time", "had + past participle"]],
  ["Write one sentence about a family member's first plane, train or car trip.", "had never flown / taken / driven", ["exactly one sentence", "he or she", "had never"]],
  ["Write one sentence about a sport or game you had never played before last year.", "had never played … before", ["exactly one sentence", "had never played", "before last year"]],
  ["Write two sentences: something you had done before school started, and something you had never done.", "had + participle / had never", ["exactly two sentences", "had once", "had never once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a first time in your life: a first flight, a first job or a first trip alone. What had you never done before? Write three or four sentences.", "had never … before", ["had never + past participle", "before", "past simple for what happened"]],
  ["Describe a trip to a new city. What had you never seen or done before? Write three or four sentences.", "had never seen / been / eaten", ["had never", "at least two participles", "a city name"]],
  ["Write about the first day at a new school or job. Write three or four sentences.", "had never met / worked", ["had never", "was nervous / excited", "three or four sentences"]],
  ["Interview a grandparent in your head: what had they never done before they were twenty? Write three or four sentences.", "had never + past participle", ["he / she had never", "before they were …", "three or four sentences"]],
  ["Describe a time you tried a new sport, food or hobby. Write three or four sentences.", "it was the first time I had …", ["the first time + had", "had never", "how you felt"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.past.past-perfect-experience.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
