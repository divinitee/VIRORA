// Hand-authored: prep-phrasal / movement / go-home (A2).
// Path fill P40 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Focus: no preposition before "home" after a movement verb (go, come, get,
// walk, drive, run, fly, hurry, ride, take / bring something). The Uzbek
// dative "uyga" and the Russian "домой" lead to "go to home"; "go at home"
// and "go to house" are the other usual mistakes.
// Sibling scope: movement only. No be / stay (at) home, where "at home" and
// "home" can both be right; no arrive (P41); "to + place" (go to school) is
// P42's topic and only appears in build here, as the contrast that shows
// home takes no to.
// Choose: 20 items, every option a phrase: verb + home vs verb + to home /
// at home / in home / to house, or the wrong verb form; rotated.
// Build: "Write to, at or home." 12 blanks with nothing after them (key
// home) and 8 before a printed place (go ______ the park → to). No source
// prints its own key elsewhere.
// Transform: 5 correct the mistake / 5 to my house / our flat → home / 5
// answer Where are you going? (key "going home").
//
// Run: node tools/grammar-practice/authored/prep-phrasal.movement.go-home.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "movement", topic: "go-home", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const T = ["bus", "taxi", "metro", "tram"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Khiva"];
const EVENT = ["wedding", "party", "concert", "match"];
const DAY = ["night", "Friday", "Saturday", "Sunday"];
const TIME = ["six", "seven", "half past six", "five"];
const KIDS = ["children", "boys", "girls", "twins"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const P = (v, last) => [`${v} home`, `${v} to home`, `${v} at home`, last];
const H = ["home", "to home", "at home", "in home"];
const WH = "After go, come, get, walk, drive and other movement verbs, use home with no preposition: go home, not go to home.";
const WT = "Before a place word like the park or school, use to: go to the park. Only home has no to.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [P("go", "go to house"), "It's late, {name}. Let's ______ by {t}.", { name: NAME, t: T }],
  [P("walks", "walk home"), "After school, {name} ______ with her {who}.", { name: SHE, who: ["sister", "mum", "friend", "brother"] }],
  [P("comes", "come home"), "Dad ______ from work at {time}, {name}.", { time: TIME, name: NAME }],
  [P("got", "got in home"), "We ______ late after the {event}, {name}.", { event: EVENT, name: NAME }],
  [P("went", "goes home"), "{name} ______ early yesterday. He felt {ill}.", { name: HE, ill: ["ill", "sick", "tired", "cold"] }],
  [P("go", "going home"), "I want to ______ now, {name}. I'm very {state}.", { name: NAME, state: ["tired", "sleepy", "hungry", "cold"] }],
  [["drove me home", "drove me to home", "drove me at home", "drove home me"], "My {who} ______ after the lesson, {name}.", { who: ["dad", "mum", "uncle", "aunt"], name: NAME }],
  [P("going", "go home"), "Are you ______ by {t}, {name}?", { t: T, name: NAME }],
  [P("come", "coming home"), "Can you ______ before {time}, {name}?", { time: ["ten", "nine", "eleven", "midnight"], name: NAME }],
  [P("run", "runs home"), "The {kids} ______ at {time} every day.", { kids: KIDS, time: ["four", "five", "three", "half past four"] }],
  [["home", "to home", "at home", "to house"], "Let's take a taxi ______, {name}. It's {w}.", { name: NAME, w: ["raining", "very late", "cold", "dark"] }],
  [P("is flying", "flying home"), "{name} ______ from {city} next week.", { name: NAME, city: CITY }],
  [P("get", "got home"), "When did you ______ last {day}, {name}?", { day: DAY, name: NAME }],
  [H, "I'll take the {thing} ______ tonight, {name}.", { thing: ["books", "cake", "toys", "photos"], name: NAME }],
  [P("came", "came to the home"), "My grandparents ______ after their holiday in {city}.", { city: CITY }],
  [H, "Please bring some {thing} ______, {name}.", { thing: ["bread", "milk", "fruit", "juice"], name: NAME }],
  [H, "{name} hurried ______ because of the {w}.", { name: NAME, w: ["rain", "snow", "cold", "storm"] }],
  [H, "Shall we walk ______ or take the {t}, {name}?", { t: T, name: NAME }],
  [H, "I usually ride my {veh} ______ after {event}.", { veh: ["bike", "scooter", "skateboard", "bicycle"], event: ["school", "practice", "training", "lessons"] }],
  [P("get", "getting home"), "What time do you usually ______ on {day}, {name}?", { day: ["Mondays", "Fridays", "weekdays", "Saturdays"], name: NAME }],
].map(([base, prompt, slots], i) => {
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: WH, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write to, at or home.";
const BUILD = [
  // home (12)
  ["home", "It's late, {name}. Let's go ______ by {t}.", { name: NAME, t: T }],
  ["home", "{name} walks ______ after school with her {who}.", { name: SHE, who: ["sister", "mum", "friend", "brother"] }],
  ["home", "Dad comes ______ from work at {time}, {name}.", { time: TIME, name: NAME }],
  ["home", "We got ______ very late after the {event}, {name}.", { event: EVENT, name: NAME }],
  ["home", "{name} went ______ early. He felt {ill}.", { name: HE, ill: ["ill", "sick", "tired", "cold"] }],
  ["home", "Can you drive me ______, {who}? I missed the {t}.", { who: ["Dad", "Mum", "Uncle Bobur", "Aunt Lola"], t: T }],
  ["home", "The {kids} run ______ at {time} every day.", { kids: KIDS, time: ["four", "five", "three", "half past four"] }],
  ["home", "My brother is flying ______ from {city} next {day}.", { city: CITY, day: ["week", "Friday", "month", "Sunday"] }],
  ["home", "Take the {thing} ______ with you, {name}.", { thing: ["cake", "books", "flowers", "rest of the plov"], name: NAME }],
  ["home", "When did you get ______ last {day}, {name}?", { day: DAY, name: NAME }],
  ["home", "Shall we walk ______ or take the {t}, {name}?", { t: T, name: NAME }],
  ["home", "Please bring some {thing} ______, {name}.", { thing: ["bread", "milk", "fruit", "juice"], name: NAME }],
  // to + place (8)
  ["to", "Mum goes ______ work at {time}, {name}.", { time: ["eight", "seven", "half past seven", "nine"], name: NAME }],
  ["to", "We often walk ______ the {place} on {day}.", { place: ["park", "bazaar", "river", "stadium"], day: ["Sundays", "Saturdays", "Fridays", "holidays"] }],
  ["to", "{name} drives ______ {city} every {when}.", { name: NAME, city: CITY, when: ["month", "summer", "week", "year"] }],
  ["to", "Let's go ______ the {place} after lunch, {name}.", { place: ["cinema", "museum", "bazaar", "library"], name: NAME }],
  ["to", "The {kids} run ______ the {place} after lessons.", { kids: KIDS, place: ["yard", "park", "shop", "sports ground"] }],
  ["to", "My grandparents flew ______ {city} last {when}.", { city: CITY, when: ["month", "summer", "week", "year"] }],
  ["to", "I usually ride my {veh} ______ school, {name}.", { veh: ["bike", "scooter", "skateboard", "bicycle"], name: NAME }],
  ["to", "Come ______ my house after {event}, {name}.", { event: ["school", "lunch", "the lesson", "dinner"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: key === "home" ? WH : WT, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const HOUSE = "Rewrite the sentence with home.";
const TRANSFORM = [
  // correct the mistake (5)
  [COR, "I went to home at {time}, {name}.", "I ______ at {time}, {name}.", "went home", "No to before home: went home.", { time: TIME, name: NAME }],
  [COR, "{name} comes at home late on {day}.", "{name} ______ late on {day}.", "comes home", "After come, no at before home: comes home.", { name: NAME, day: ["Fridays", "Mondays", "weekdays", "Saturdays"] }],
  [COR, "We got to home at midnight after the {event}, {name}.", "We ______ at midnight after the {event}, {name}.", "got home", "No to before home: got home.", { event: EVENT, name: NAME }],
  [COR, "Let's go to the home now, {name}. It's {w}.", "Let's ______ now, {name}. It's {w}.", "go home", "No to the before home: go home.", { name: NAME, w: ["late", "dark", "cold", "raining"] }],
  [COR, "{name} walked in home in the {w}.", "{name} ______ in the {w}.", "walked home", "No in before home: walked home.", { name: NAME, w: ["rain", "snow", "dark", "cold"] }],
  // my house / our flat -> home (5)
  [HOUSE, "I went to my house after {event}, {name}.", "I ______ after {event}, {name}.", "went home", "Your own house or flat = home: went home.", { event: ["school", "work", "the lesson", "lunch"], name: NAME }],
  [HOUSE, "{who} drove to our flat after the {event}.", "{who} ______ after the {event}.", "drove home", "Your own flat = home: drove home.", { who: ["Dad", "Mum", "My brother", "My sister"], event: EVENT }],
  [HOUSE, "Come back to our house before {time}, {name}.", "Come ______ before {time}, {name}.", "home", "Your own house = home, with no to.", { time: ["ten", "nine", "eleven", "midnight"], name: NAME }],
  [HOUSE, "The {kids} ran to their house in the {w}.", "The {kids} ______ in the {w}.", "ran home", "Their own house = home: ran home.", { kids: KIDS, w: ["rain", "snow", "dark", "cold"] }],
  [HOUSE, "{name} is flying to her flat in {city} tomorrow.", "{name} is ______ to {city} tomorrow.", "flying home", "Her own flat = home: flying home.", { name: SHE, city: ["Tashkent", "Bukhara", "Samarkand", "Fergana"] }],
  // Where are you going? (5)
  ["Answer the question: you are going home.", "Where are you going after the {event}, {name}?", "I'm ______ after the {event}, {name}.", "going home", "going home, with no to.", { event: ["lesson", "match", "concert", "party"], name: NAME }],
  ["Answer the question: he went home.", "Where did {name} go after the {event}?", "He ______ after the {event}.", "went home", "went home, with no to.", { name: HE, event: EVENT }],
  ["Answer the question: they are coming home.", "Are your {who} still in {city}?", "No, they're ______ from {city} today.", "coming home", "coming home, with no to.", { who: ["parents", "grandparents", "cousins", "brothers"], city: CITY }],
  ["Answer the question: she got home at six.", "When did {name} get back last {day}?", "She ______ at six.", "got home", "got home, with no to.", { name: SHE, day: DAY }],
  ["Answer the question: we walked home.", "How did you get back from the {place}, {name}?", "We ______, {name}.", "walked home", "walked home, with no to.", { place: ["park", "bazaar", "cinema", "stadium"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => {
  const s = { ...slots }; delete s.x;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what time you go home after school or work.", "I go home at …", ["exactly one sentence", "go home", "a time"]],
  ["Write one sentence about how you get home: by bus, by car or on foot.", "I get home by … / I walk home.", ["exactly one sentence", "home", "a transport word"]],
  ["Write one sentence about what time your mum or dad comes home.", "She / He comes home at …", ["exactly one sentence", "comes home", "a family word"]],
  ["Write one sentence about a time you went home early.", "I went home early because …", ["exactly one sentence", "went home", "a reason"]],
  ["Write one sentence asking a friend when he or she gets home.", "When do you get home?", ["exactly one question", "get home", "a question word"]],
  ["Write one sentence about something you take home from school.", "I take … home.", ["exactly one sentence", "take … home", "a school word"]],
  ["Write one sentence about a relative who is coming home soon.", "My … is coming home …", ["exactly one sentence", "coming home", "a family word"]],
  ["Write two sentences: where you go in the morning and when you come home.", "I go to … / I come home …", ["exactly two sentences", "go to once", "home once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your way home from school or work.", "I walk / go / get home …", ["home with no to", "a transport word", "three or four sentences"]],
  ["Describe a late evening: a party or a wedding, and how you got home.", "We got home at …", ["got home", "a time", "three or four sentences"]],
  ["Write about a family member who lives far away and comes home for the holidays.", "… comes home …", ["comes or came home", "a place name", "three or four sentences"]],
  ["Describe your evening routine: when everyone in your family comes home.", "Dad comes home at …", ["comes home", "a family word", "three or four sentences"]],
  ["Write a message to your mum: you are late, and you are coming home by taxi.", "I'm coming home by …", ["coming home", "a transport word", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.movement.go-home.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);