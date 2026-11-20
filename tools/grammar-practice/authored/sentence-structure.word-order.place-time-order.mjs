// Hand-authored: sentence-structure / word-order / place-time-order (A1).
// Path fill P28 (2026-11-16, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: place before time at the end of a sentence (we / play /
// football / in the park / at the weekend → We play football in the park at
// the weekend).
// Sibling scope: S + V + O is P2 (svo-basic) and is never the question here;
// every sentence already has its subject, verb and object in place, and the
// point is where the PLACE and the TIME go. Time at the START ("At the
// weekend we play …") is correct English, so it is never a distractor.
// Choose: four orders of the same sentence: S V O + place + time (key) vs
// S V O + time + place (Murphy's "not"), S + time + V O + place (the Uzbek
// order) and S V + place + O + time. Places are short (in the park, to
// school, at home) so the "time first" order is not saved by end weight.
// Build: 10 put a place and a time in the gaps / 10 put object + place +
// time in the gaps; the words are listed in instr in a mixed order.
// Transform: 5 fix time before place / 5 fix time in the middle / 5 add a
// time to a sentence that has a place.
//
// Run: node tools/grammar-practice/authored/sentence-structure.word-order.place-time-order.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "word-order", topic: "place-time-order", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const BOY = ["Aziz", "Timur", "Bobur", "Rustam"];
const GIRL = ["Lola", "Olga", "Madina", "Kamila"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
// [subject, verb, object, place, time]
const ORD = ([s, v, o, p, t]) => [
  `${cap(s)} ${v} ${o} ${p} ${t}`,
  `${cap(s)} ${v} ${o} ${t} ${p}`,
  `${cap(s)} ${t} ${v} ${o} ${p}`,
  `${cap(s)} ${v} ${p} ${o} ${t}`,
];
const WHY = (p, t) => `Where comes before when: ${p} (where) + ${t} (when). The time never goes between the verb and its object.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [["we", "play", "football", "in the park", "at the weekend"], "______. Come with us, {name}, and bring your {thing}.", { name: NAME, thing: ["ball", "brother", "cousin", "friends"] }],
  [["I", "take", "the bus", "to school", "every morning"], "______. It's quicker than {how}, {name}.", { how: ["walking", "cycling", "riding my scooter", "going on foot"], name: NAME }],
  [["my grandparents", "take", "the train", "to Tashkent", "every summer"], "______. They bring {food} from their {place}.", { food: ["apricots", "melons", "grapes", "honey"], place: ["garden", "village", "farm", "yard"] }],
  [["Lola", "does", "her homework", "in the library", "after school"], "______. It's quiet there, and she can use the {thing}, {name}.", { thing: ["computers", "dictionaries", "big tables", "printer"], name: ["Mum", "Dad", "Aziz", "Timur"] }],
  [["my dad", "buys", "bread", "at the bazaar", "on Sundays"], "______. He also gets {food} for {who}.", { food: ["fruit", "cheese", "meat", "vegetables"], who: ["Grandma", "the family", "our neighbours", "lunch"] }],
  [["we", "take", "our books", "to the library", "on Tuesdays"], "______. The librarian is {who}, {name}.", { who: ["Ms Ivanova", "Mr Karimov", "Mrs Karimova", "Mr Lee"], name: NAME }],
  [["Aziz", "takes", "his friends", "to the café", "after work"], "______. They drink {drink} and talk about {topic}.", { drink: ["tea", "coffee", "juice", "lemonade"], topic: ["football", "films", "their week", "work"] }],
  [["my mum", "drinks", "tea", "in the kitchen", "every evening"], "______. She likes it with {thing}, {name}.", { thing: ["lemon", "honey", "milk", "sugar"], name: NAME }],
  [["the children", "watch", "cartoons", "at home", "on Saturday mornings"], "______. Their {who} makes {food} for them.", { who: ["mum", "dad", "grandma", "aunt"], food: ["pancakes", "eggs", "porridge", "sandwiches"] }],
  [["I", "leave", "my bike", "at the gate", "every day"], "______. Nobody takes it, {name}. Our {who} watches it.", { name: NAME, who: ["neighbour", "grandpa", "dog", "cousin"] }],
  [["we", "eat", "plov", "at home", "on Fridays"], "______. Mum cooks it in a big {pot}, {name}.", { pot: ["pot", "kazan", "black pot", "old pot"], name: NAME }],
  [["Timur", "takes", "his chess set", "to the club", "on Wednesdays"], "______. He wants to win the {event} this {when}.", { event: ["city cup", "school cup", "big game", "final"], when: ["year", "spring", "month", "winter"] }],
  [["my sister", "practises", "the piano", "at home", "every afternoon"], "______. Her teacher comes on {day}, {name}.", { day: ["Mondays", "Thursdays", "Fridays", "Saturdays"], name: NAME }],
  [["we", "drive", "our car", "to Samarkand", "every summer"], "______. We stay for {n} weeks with {who}.", { n: ["two", "three", "four", "five"], who: ["our aunt", "Grandma", "our uncle", "the family"] }],
  [["Olga", "reads", "books", "on the bus", "every morning"], "______. She reads about {topic}, {name}.", { topic: ["animals", "history", "space", "famous people"], name: ["Mum", "Dad", "Aziz", "Timur"] }],
  [["I", "do", "my exercises", "in the yard", "at seven o'clock"], "______. Then I have {meal} with my {who}.", { meal: ["breakfast", "tea", "juice", "porridge"], who: ["brother", "sister", "mum", "dad"] }],
  [["they", "sell", "fresh fruit", "at the market", "every morning"], "______. The {fruit} are very sweet, {name}.", { fruit: ["apricots", "grapes", "melons", "cherries"], name: NAME }],
  [["my brother", "washes", "the car", "in the yard", "on Sundays"], "______. I help him with the {thing}, {name}.", { thing: ["windows", "wheels", "water", "seats"], name: NAME }],
  [["we", "have", "lunch", "at school", "at one o'clock"], "______. Today it's {food}, {name}!", { food: ["soup", "plov", "pasta", "chicken"], name: NAME }],
  [["Madina", "takes", "her dog", "to the park", "every evening"], "______. The dog loves the {thing} there, {name}.", { thing: ["grass", "ducks", "other dogs", "trees"], name: ["Mum", "Dad", "Aziz", "Timur"] }],
].map(([parts, prompt, slots], i) => {
  const base = ORD(parts);
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: WHY(parts[3], parts[4]), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const PT = (key, list, source, slots) => ({
  instr: `Put these words in the right gaps: ${list}.`, source, key,
  why: `Place first (${key[0]}), then time (${key[1]}).`, slots,
});
const OPT3 = (key, list, source, slots) => ({
  instr: `Put these words in the right gaps: ${list}.`, source, key,
  why: `The object first (${key[0]}), then the place (${key[1]}), then the time (${key[2]}).`, slots,
});
const BUILD = [
  PT(["in the park", "at the weekend"], "at the weekend / in the park", "{name} and I play {sport} ______ ______.", { name: NAME, sport: ["football", "basketball", "tennis", "volleyball"] }),
  PT(["to school", "every morning"], "every morning / to school", "My {sib} walks ______ ______, {name}.", { sib: ["brother", "sister", "cousin", "friend"], name: NAME }),
  PT(["at home", "in the evening"], "in the evening / at home", "We usually have {meal} ______ ______, {name}.", { meal: ["dinner", "tea", "plov", "soup"], name: NAME }),
  PT(["at the bazaar", "on Saturdays"], "on Saturdays / at the bazaar", "My {who} buys {food} ______ ______.", { who: ["mum", "dad", "grandma", "uncle"], food: ["fruit", "vegetables", "meat", "rice"] }),
  PT(["in the library", "after lessons"], "after lessons / in the library", "{name} reads {thing} ______ ______.", { name: NAME, thing: ["books", "magazines", "comics", "newspapers"] }),
  PT(["to Bukhara", "next month"], "next month / to Bukhara", "We are going ______ ______ by {veh}, {name}.", { veh: ["train", "bus", "car", "plane"], name: NAME }),
  PT(["in the kitchen", "every morning"], "in the kitchen / every morning", "Grandma makes {food} ______ ______, {name}.", { food: ["bread", "tea", "porridge", "pancakes"], name: NAME }),
  PT(["at the stadium", "on Sunday"], "on Sunday / at the stadium", "There's a {event} ______ ______, {name}.", { event: ["football match", "concert", "race", "festival"], name: NAME }),
  PT(["in the yard", "after dinner"], "after dinner / in the yard", "The {kids} play with the {pet} ______ ______.", { kids: ["children", "boys", "girls", "twins"], pet: ["dog", "cat", "puppy", "kitten"] }),
  PT(["at work", "all day"], "all day / at work", "My {who} is ______ ______ today, so I cook {food}.", { who: ["mum", "dad", "aunt", "uncle"], food: ["dinner", "soup", "rice", "eggs"] }),
  OPT3(["TV", "in my room", "at night"], "at night / TV / in my room", "{name}, I don't watch ______ ______ ______. My {who} doesn't like it.", { name: NAME, who: ["mum", "dad", "grandma", "grandpa"] }),
  OPT3(["football", "in the yard", "after school"], "after school / in the yard / football", "{name} and his {who} play ______ ______ ______.", { name: BOY, who: ["brother", "cousins", "friends", "dad"] }),
  OPT3(["my homework", "at the table", "after dinner"], "after dinner / my homework / at the table", "I do ______ ______ ______ with my {who}, {name}.", { who: ["brother", "sister", "cousin", "mum"], name: NAME }),
  OPT3(["the bus", "to work", "every day"], "to work / every day / the bus", "My {who} takes ______ ______ ______, {name}.", { who: ["aunt", "uncle", "mum", "dad"], name: NAME }),
  OPT3(["our grandparents", "in the village", "every summer"], "every summer / our grandparents / in the village", "We visit ______ ______ ______ with {who}, {name}.", { who: ["Mum", "Dad", "my cousins", "our uncle"], name: NAME }),
  OPT3(["English", "at a language school", "twice a week"], "twice a week / English / at a language school", "{name} studies ______ ______ ______ because she wants to {goal}.", { name: GIRL, goal: ["travel", "work in a hotel", "be a teacher", "watch films in English"] }),
  OPT3(["tea", "on the balcony", "in the evening"], "in the evening / on the balcony / tea", "My {who} drink ______ ______ ______, {name}.", { who: ["parents", "grandparents", "neighbours", "cousins"], name: NAME }),
  OPT3(["bread", "at the bakery", "every morning"], "bread / every morning / at the bakery", "We buy ______ ______ ______, {name}. It's {adj}.", { name: NAME, adj: ["fresh", "hot", "warm", "cheap"] }),
  OPT3(["the dishes", "in the kitchen", "after lunch"], "after lunch / the dishes / in the kitchen", "My {sib} washes ______ ______ ______, {name}.", { sib: ["brother", "sister", "cousin", "dad"], name: NAME }),
  OPT3(["photos", "in the park", "on Sundays"], "on Sundays / photos / in the park", "{name} takes ______ ______ ______ with her {dev}.", { name: GIRL, dev: ["phone", "camera", "new camera", "old camera"] }),
].map((it) => ({ ...BASE, stage: "build", format: "gap_fill", ...it }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the word order: place, then time.";
const ADD = (t) => `Add ${t} to the sentence.`;
const TW = "Where comes before when: the place first, then the time.";
const MW = "The time never goes between the subject and the verb here: put it at the end, after the place.";
const AW = "Put the time at the end, after the place.";
const TRANSFORM = [
  // time before place (5)
  [COR, ["in the park", "at the weekend"], "We play {sport} at the weekend in the park, {name}.", "We play {sport} ______ ______, {name}.", TW, { sport: ["football", "basketball", "tennis", "volleyball"], name: NAME }],
  [COR, ["to school", "every morning"], "My {sib} takes the bus every morning to school, {name}.", "My {sib} takes the bus ______ ______, {name}.", TW, { sib: ["brother", "sister", "cousin", "friend"], name: NAME }],
  [COR, ["at home", "on Fridays"], "We eat {food} on Fridays at home, {name}.", "We eat {food} ______ ______, {name}.", TW, { food: ["plov", "soup", "fish", "pasta"], name: NAME }],
  [COR, ["at the bazaar", "on Sundays"], "My {who} buys {food} on Sundays at the bazaar.", "My {who} buys {food} ______ ______.", TW, { who: ["mum", "dad", "grandma", "uncle"], food: ["fruit", "vegetables", "meat", "rice"] }],
  [COR, ["in the library", "after school"], "{name} does her homework after school in the library, {who}.", "{name} does her homework ______ ______, {who}.", TW, { name: GIRL, who: ["Mum", "Dad", "Grandma", "Grandpa"] }],
  // time in the middle (5)
  [COR, ["to school", "every morning"], "I every morning walk to school with my {who}, {name}.", "I walk ______ ______ with my {who}, {name}.", MW, { who: ["brother", "sister", "cousin", "friend"], name: NAME }],
  [COR, ["in the yard", "after dinner"], "The {kids} after dinner play in the yard, {name}.", "The {kids} play ______ ______, {name}.", MW, { kids: ["children", "boys", "girls", "twins"], name: NAME }],
  [COR, ["at the café", "on Saturdays"], "My {who} on Saturdays meet their friends at the café, {name}.", "My {who} meet their friends ______ ______, {name}.", MW, { who: ["parents", "brothers", "cousins", "sisters"], name: NAME }],
  [COR, ["in the kitchen", "every evening"], "Grandma every evening drinks {drink} in the kitchen, {name}.", "Grandma drinks {drink} ______ ______, {name}.", MW, { drink: ["tea", "milk", "green tea", "warm milk"], name: NAME }],
  [COR, ["at home", "every Sunday"], "We every Sunday have {meal} at home, {name}.", "We have {meal} ______ ______, {name}.", MW, { meal: ["breakfast", "pancakes", "eggs", "porridge"], name: NAME }],
  // add a time (5)
  [ADD("on Fridays"), ["in the big classroom", "on Fridays"], "We have {subj} in the big classroom, {name}.", "We have {subj} ______ ______, {name}.", AW, { subj: ["maths", "art", "music", "English"], name: NAME }],
  [ADD("every summer"), ["in the village", "every summer"], "My {who} grows {food} in the village.", "My {who} grows {food} ______ ______.", AW, { who: ["grandpa", "grandma", "uncle", "aunt"], food: ["melons", "tomatoes", "potatoes", "onions"] }],
  [ADD("at night"), ["in my room", "at night"], "I read {thing} in my room, {name}.", "I read {thing} ______ ______, {name}.", AW, { thing: ["books", "comics", "stories", "magazines"], name: NAME }],
  [ADD("after work"), ["at the gym", "after work"], "My {who} plays {sport} at the gym.", "My {who} plays {sport} ______ ______.", AW, { who: ["dad", "uncle", "brother", "cousin"], sport: ["basketball", "table tennis", "volleyball", "badminton"] }],
  [ADD("on Sundays"), ["to the park", "on Sundays"], "{name} takes her {pet} to the park.", "{name} takes her {pet} ______ ______.", AW, { name: GIRL, pet: ["dog", "little brother", "puppy", "sister"] }],
].map(([instr, key, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about where and when you do your homework.", "I do my homework + place + time", ["exactly one sentence", "a place", "a time after the place"]],
  ["Write one sentence about a sport you play: where and when?", "I play … + place + time", ["exactly one sentence", "a place", "a time after the place"]],
  ["Write one sentence about where your family eats on Fridays or at the weekend.", "We eat … + place + time", ["exactly one sentence", "a place", "a time after the place"]],
  ["Write one sentence about how you go to school or work, and when.", "I go to … + time", ["exactly one sentence", "to + place", "a time after the place"]],
  ["Write one sentence about where you meet your friends, and when.", "I meet my friends + place + time", ["exactly one sentence", "a place", "a time after the place"]],
  ["Write one sentence about a relative you visit: where and when?", "I visit … + place + time", ["exactly one sentence", "a place", "a time after the place"]],
  ["Write one sentence about where and when you watch TV or films.", "I watch … + place + time", ["exactly one sentence", "a place", "a time after the place"]],
  ["Write two sentences about your weekend. Put a place and a time in each.", "… + place + time", ["exactly two sentences", "a place in each", "a time after each place"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your usual week: what do you do, where and when?", "… + place + time", ["place before time", "three different times", "three or four sentences"]],
  ["Describe your family's weekend: where do you go, and when?", "We go to … on …", ["place before time", "a family word", "three or four sentences"]],
  ["Tell a new classmate about your school day: where you have lessons, lunch and sport, and when.", "We have … in … at …", ["place before time", "a school word", "three or four sentences"]],
  ["Describe your summer holidays: where do you go, and when?", "We go to … in …", ["place before time", "a place name", "three or four sentences"]],
  ["Write a message to a friend: invite him or her to do something with you, and say where and when.", "Let's meet at … at …", ["place before time", "a time", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.word-order.place-time-order.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);