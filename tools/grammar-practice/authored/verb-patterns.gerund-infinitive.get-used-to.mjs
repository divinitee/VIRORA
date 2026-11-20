// Hand-authored: verb-patterns / gerund-infinitive / get-used-to (B1).
// Wave C, C25 (2026-11-20, Claude, branch grammar-wave-c-base44; Claude took this lane over).
//
// Tests ONE point (placement item): get used to + -ing / noun = slowly become
// comfortable with something new ("It took me a few weeks to get used to waking up
// early"). "to" is a preposition here, so -ing follows, never the base verb.
// Triage: kept. Sibling tenses.used-to.* (used to + base = a past habit) is never
// keyed here; "be used to" is not used (it is the state, a later point).
// Choose: 10 the get used to form (get / got / getting used to vs used to / use to /
// get use to); 10 the verb after it (-ing vs base / past / to + base).
// Build: 12 -ing of the verb in brackets after get used to; 8 the right form of get
// (get / got / getting) + used to. No source prints the key words.
// Transform: 5 correct the mistake / 5 "It was strange at first, now it's OK" → got used
// to / 5 "is still strange" → is getting used to.
// Whys are written for each item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/verb-patterns.gerund-infinitive.get-used-to.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "gerund-infinitive", topic: "get-used-to", level: "B1", pv: "2.5" };
const NAME = ["Dilnoza", "Sardor", "Feruza", "Otabek"];
const NAME2 = ["Zarina", "Akmal", "Malika", "Ulugbek"];
const INF = ["get used to", "used to", "get use to", "use to"];
const PAST = ["got used to", "used to", "got use to", "was use to"];
const ING = ["getting used to", "used to", "getting use to", "get used to"];
const v4 = (ing, base, past) => [ing, base, past, `to ${base}`];

/* ---------------- choose: 20 mcq ---------------- */
// [options (key first), prompt, slots, why]
const CHOOSE = [
  [INF, "It took me a few weeks to ______ waking up at {time}, {name}.", { time: ["six", "five", "half past five", "dawn"], name: NAME }, "\"It took me a few weeks\" = a slow change, so get used to; then -ing."],
  [PAST, "The food in {country} was strange, but after a month I ______ it, {name}.", { country: ["Korea", "India", "Mexico", "Japan"], name: NAME }, "After a month the food stopped feeling strange: got used to + noun."],
  [ING, "I'm still ______ my new {thing}. The buttons are different, {name}.", { thing: ["phone", "laptop", "car", "keyboard"], name: NAME2 }, "\"Still\" = the change is happening now: am getting used to."],
  [INF, "You'll soon ______ the noise from the {place}, {name}.", { place: ["street", "airport", "bazaar", "building site"], name: NAME }, "\"Soon\" = in the future the noise will feel normal: get used to."],
  [PAST, "My grandma ______ her hearing aid quickly, {name}. Now she hears everything at the {event}.", { name: NAME2, event: ["dinner table", "wedding", "family party", "lesson"] }, "She became comfortable with it quickly, in the past: got used to."],
  [ING, "Our new {who} is ______ the cold winters here, {name}.", { who: ["neighbour", "teacher", "classmate", "colleague"], name: NAME }, "It is happening now, little by little: is getting used to."],
  [INF, "I can't ______ driving on the left in {country}, {name}.", { country: ["England", "Japan", "Australia", "India"], name: NAME2 }, "\"Can't\" + the base form get; driving on the left still feels strange."],
  [PAST, "At first the uniform felt strange, but the {who} soon ______ wearing it.", { who: ["new students", "nurses", "players", "waiters"], x: [] }, "\"Soon\" in a past story: got used to + -ing."],
  [ING, "Are you ______ your new {job} yet, {name}?", { job: ["job", "school", "flat", "timetable"], name: NAME }, "\"Yet\" asks about a change that is still happening: getting used to."],
  [INF, "It's hard to ______ a new {thing} at my age, {name}.", { thing: ["city", "language", "phone", "routine"], name: NAME2 }, "After \"to\" (it's hard to) comes the base form get: get used to."],
  [v4("living", "live", "lived"), "Did you get used to ______ in {city} in the end, {name}?", { city: ["Moscow", "Seoul", "Istanbul", "Tashkent"], name: NAME }, "The \"to\" in get used to is a preposition, so the verb takes -ing: living."],
  [v4("speaking", "speak", "spoke"), "I'm getting used to ______ English at work, {name}.", { name: NAME2, x: [] }, "get used to + -ing: speaking, not speak."],
  [v4("sleeping", "sleep", "slept"), "The baby still can't get used to ______ in her own {room}.", { room: ["room", "bed", "cot", "bedroom"], x: [] }, "after get used to, the verb is -ing: sleeping."],
  [v4("working", "work", "worked"), "My dad got used to ______ at night when he was a {job}.", { job: ["taxi driver", "nurse", "baker", "guard"], x: [] }, "got used to + -ing: working."],
  [v4("cooking", "cook", "cooked"), "{who} is slowly getting used to ______ for the whole family, {name}.", { who: ["My brother", "My cousin", "My uncle", "My son"], name: NAME }, "getting used to + -ing: cooking."],
  [v4("taking", "take", "took"), "I'll never get used to ______ the {bus} at six in the morning, {name}.", { bus: ["bus", "metro", "train", "minibus"], name: NAME2 }, "never get used to + -ing: taking."],
  [v4("wearing", "wear", "wore"), "It took her a year to get used to ______ {glasses}, {name}.", { glasses: ["glasses", "a uniform", "high heels", "a watch"], name: NAME }, "get used to + -ing: wearing."],
  [v4("eating", "eat", "ate"), "We got used to ______ dinner at {time} in {country}.", { time: ["ten", "nine", "half past nine", "eleven"], country: ["Spain", "Italy", "Greece", "Portugal"] }, "got used to + -ing: eating."],
  [v4("getting", "get", "got"), "You'll get used to ______ up early for the {work}, {name}.", { work: ["new job", "training", "early shift", "course"], name: NAME2 }, "get used to + -ing: getting up."],
  [v4("walking", "walk", "walked"), "My legs hurt, but I'm getting used to ______ {dist} a day, {name}.", { dist: ["ten kilometres", "an hour", "five kilometres", "twenty minutes"], name: NAME }, "getting used to + -ing: walking."],
].map(([o, prompt, slots, why], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_V = "Complete with the right form of the verb in brackets.";
const INSTR_G = "Complete with get / got / getting + used to.";
// [instr, key, source, slots, why] — no source prints the key words
const BUILD = [
  [INSTR_V, "waking", "It took me months to get used to ______ (wake) up at {time}, {name}.", { time: ["five", "six", "half past five", "dawn"], name: NAME }, "get used to + -ing: waking."],
  [INSTR_V, "driving", "My cousin finally got used to ______ (drive) in {city}.", { city: ["Tashkent", "Moscow", "Istanbul", "Dubai"], x: [] }, "got used to + -ing: driving."],
  [INSTR_V, "living", "Are you getting used to ______ (live) without your parents, {name}?", { name: NAME2, x: [] }, "getting used to + -ing: living."],
  [INSTR_V, "sharing", "Twins soon get used to ______ (share) a {room}, {name}.", { room: ["room", "bedroom", "desk", "wardrobe"], name: NAME }, "get used to + -ing: sharing."],
  [INSTR_V, "studying", "I can't get used to ______ (study) online, {name}. I miss the {place}.", { name: NAME2, place: ["classroom", "library", "teacher", "school"] }, "get used to + -ing: studying."],
  [INSTR_V, "eating", "We got used to ______ (eat) spicy food in {country}.", { country: ["India", "Thailand", "Mexico", "Korea"], x: [] }, "got used to + -ing: eating."],
  [INSTR_V, "working", "My mum is getting used to ______ (work) from home, {name}.", { name: NAME, x: [] }, "getting used to + -ing: working."],
  [INSTR_V, "speaking", "You'll get used to ______ (speak) in front of the {who}, {name}.", { who: ["class", "team", "group", "students"], name: NAME2 }, "get used to + -ing: speaking."],
  [INSTR_V, "taking", "Grandpa never got used to ______ (take) his {pills} every day.", { pills: ["pills", "vitamins", "medicine", "drops"], x: [] }, "got used to + -ing: taking."],
  [INSTR_V, "wearing", "It's hard to get used to ______ (wear) a {thing} all day, {name}.", { thing: ["helmet", "tie", "mask", "uniform"], name: NAME }, "get used to + -ing: wearing."],
  [INSTR_V, "sleeping", "The puppy is getting used to ______ (sleep) in the {place}, {name}.", { place: ["kitchen", "hall", "garden", "box"], name: NAME2 }, "getting used to + -ing: sleeping."],
  [INSTR_V, "cooking", "My brother got used to ______ (cook) for himself at {place}.", { place: ["university", "college", "work", "camp"], x: [] }, "got used to + -ing: cooking."],
  [INSTR_G, "get used to", "Don't worry. You'll ______ the new {thing} soon, {name}.", { thing: ["timetable", "teacher", "flat", "rules"], name: NAME }, "\"You'll … soon\" = future: will + get used to."],
  [INSTR_G, "got used to", "At first the {place} was very quiet, but we ______ it, {name}.", { place: ["village", "new flat", "hotel", "office"], name: NAME2 }, "A past story that ended well: got used to."],
  [INSTR_G, "getting used to", "I'm still ______ the cold weather in {city}, {name}.", { city: ["Moscow", "Helsinki", "Oslo", "Astana"], name: NAME }, "\"I'm still\" = happening now: getting used to."],
  [INSTR_G, "get used to", "Give it time. You'll slowly ______ a new {thing}, {name}.", { thing: ["school", "language", "country", "job"], name: NAME2 }, "\"You'll\" + the base form: get used to."],
  [INSTR_G, "got used to", "My little sister quickly ______ her new {school} last year.", { school: ["school", "teacher", "classmates", "kindergarten"], x: [] }, "\"Quickly … last year\" = past: got used to."],
  [INSTR_G, "getting used to", "Is your dad ______ his new {thing}, {name}?", { thing: ["car", "phone", "glasses", "job"], name: NAME }, "\"Is your dad\" = happening now: getting used to."],
  [INSTR_G, "get used to", "I'll never ______ the traffic in {city}, {name}.", { city: ["Cairo", "Moscow", "Tashkent", "Delhi"], name: NAME2 }, "\"I'll never\" + the base form: get used to."],
  [INSTR_G, "got used to", "After two weeks in {country}, we ______ the time difference.", { country: ["Japan", "Canada", "Brazil", "Australia"], x: [] }, "\"After two weeks\" in the past: got used to."],
].map(([instr, key, source, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr, source, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const GOT = "Rewrite with got used to.";
const NOW = "Rewrite with am / is / are getting used to.";
// [instr, source, hint, key, slots, why]
const TRANSFORM = [
  [FIX, "I can't get used to get up so early for {work}, {name}.", "I can't get used to ______ up so early for {work}, {name}.", "getting", { work: ["school", "work", "training", "my new job"], name: NAME }, "After get used to, the verb is -ing: getting up."],
  [FIX, "She got use to the {weather} in {city}.", "She ______ the {weather} in {city}.", "got used to", { weather: ["rain", "heat", "snow", "wind"], city: ["London", "Dubai", "Moscow", "Bergen"] }, "The phrase is got used to, with -d."],
  [FIX, "We are getting used to live in a small {home}, {name}.", "We are getting used to ______ in a small {home}, {name}.", "living", { home: ["flat", "house", "room", "village"], name: NAME2 }, "getting used to + -ing: living."],
  [FIX, "After a year I get use to the {thing}, {name}.", "After a year I ______ the {thing}, {name}.", "got used to", { thing: ["noise", "food", "language", "climate"], name: NAME }, "A finished change in the past: got used to, with -d."],
  [FIX, "My uncle never got used to work at night as a {job}, {name}.", "My uncle never got used to ______ at night as a {job}, {name}.", "working", { job: ["taxi driver", "nurse", "baker", "guard"], name: NAME2 }, "got used to + -ing: working."],
  [GOT, "Living in {city} was strange at first, but now it's normal for me, {name}.", "I ______ in {city}, {name}.", "got used to living", { city: ["Seoul", "Istanbul", "Moscow", "Dubai"], name: NAME2 }, "Strange at first, normal now: got used to + -ing."],
  [GOT, "The spicy {food} was hard for us at first. Later it was fine, {name}.", "We ______ the spicy {food}, {name}.", "got used to", { food: ["soup", "noodles", "sauce", "curry"], name: NAME }, "Hard at first, fine later: got used to + noun."],
  [GOT, "Waking up at {time} was difficult for my sister. After a month it was easy, {name}.", "My sister ______ up at {time}, {name}.", "got used to waking", { time: ["five", "six", "half past five", "dawn"], name: NAME2 }, "Difficult, then easy: got used to + -ing."],
  [GOT, "The new {thing} felt strange to Grandpa, but now he likes it, {name}.", "Grandpa ______ the new {thing}, {name}.", "got used to", { thing: ["phone", "TV", "sofa", "glasses"], name: NAME }, "Strange before, fine now: got used to."],
  [GOT, "Speaking English at {place} was scary for me. Now it's normal, {name}.", "I ______ English at {place}, {name}.", "got used to speaking", { place: ["work", "school", "meetings", "the hotel"], name: NAME2 }, "Scary before, normal now: got used to + -ing."],
  [NOW, "Living alone in {city} is still a bit strange for me, but it's easier every week, {name}.", "I ______ alone in {city}, {name}.", "am getting used to living", { city: ["Tashkent", "Moscow", "Seoul", "Istanbul"], name: NAME }, "Easier every week = still changing: am getting used to + -ing."],
  [NOW, "The new {thing} is still strange for my mum, but she uses it every day, {name}.", "My mum ______ the new {thing}, {name}.", "is getting used to", { thing: ["phone", "oven", "laptop", "car"], name: NAME2 }, "Still strange, used every day: is getting used to."],
  [NOW, "Our class is still learning the new timetable at {place}, {name}.", "We ______ the new timetable at {place}, {name}.", "are getting used to", { place: ["school", "college", "the club", "the gym"], name: NAME2 }, "Still learning = changing now: are getting used to."],
  [NOW, "Working nights at the {place} is hard for my brother, but it's a little easier now, {name}.", "My brother ______ nights at the {place}, {name}.", "is getting used to working", { place: ["hospital", "bakery", "factory", "hotel"], name: NAME }, "A little easier now: is getting used to + -ing."],
  [NOW, "The {who} are still finding the cold in {city} hard.", "The {who} ______ the cold in {city}.", "are getting used to", { who: ["tourists", "new students", "players", "workers"], city: ["Moscow", "Astana", "Oslo", "Helsinki"] }, "Still hard = changing now: are getting used to."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something new you got used to last year.", "I got used to + -ing / noun", ["exactly one sentence", "got used to", "-ing or a noun after it"]],
  ["Write one sentence about something you are getting used to now.", "I'm getting used to …", ["exactly one sentence", "am getting used to", "-ing or a noun"]],
  ["Write one sentence about something you will never get used to.", "I'll never get used to …", ["exactly one sentence", "never get used to", "-ing"]],
  ["Write one sentence with used to (a past habit) and one with get used to.", "used to vs get used to", ["exactly two sentences", "used to + base verb", "get used to + -ing"]],
  ["A friend moved to a new city. Write one sentence of advice with get used to.", "You'll soon get used to …", ["exactly one sentence", "will get used to", "-ing or a noun"]],
  ["Write one sentence with It took me … to get used to.", "It took me … to get used to …", ["exactly one sentence", "It took me", "get used to + -ing"]],
  ["Write one question with getting used to.", "Are you getting used to …?", ["exactly one question", "getting used to", "a question mark"]],
  ["Write one sentence about a family member who got used to something new.", "My … got used to …", ["exactly one sentence", "got used to", "past"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your first weeks at a new school, job or home. What did you get used to? Write three or four sentences.", "got used to + -ing / noun", ["got used to", "-ing", "three or four sentences"]],
  ["A friend from another country lives in your town now. What is he or she getting used to? Write three or four sentences.", "is getting used to", ["getting used to", "-ing or a noun", "three or four sentences"]],
  ["Write three or four sentences about things you could never get used to.", "never get used to", ["get used to", "-ing", "three or four sentences"]],
  ["Compare your life now with five years ago. Use used to and got used to in three or four sentences.", "used to vs get used to", ["used to + base", "got used to + -ing", "three or four sentences"]],
  ["Give advice to a student who is starting at a new school. Write three or four sentences with get used to.", "You'll get used to …", ["get used to", "will", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.gerund-infinitive.get-used-to.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
