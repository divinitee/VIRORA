// Hand-authored: adj-adv / frequency / adverb-position (A1).
// Speaking Pack batch 2, topic 5 (grammar-run/SPEAK-2.md).
//
// Tests ONE point: WHERE a frequency adverb goes. Before the main verb ("My
// father usually goes to work by bus") and after be ("She is often tired").
// The two placement items set exactly this scope.
//
// Triage (SPEAK-2 point 2): this topic tests position, the siblings always /
// never / rarely test meaning (which adverb fits the facts). Here the adverb
// is always given or fixed, so no item asks the learner to choose between
// adverbs, and the siblings keep the meaning point. rarely is not used here
// (rule 14 belongs to its own topic).
//
// Distractors, chosen so none is ever right:
//   main verb: adverb between the verb and its object ("drinks usually tea"),
//     be added in front ("is usually drinks", the Uzbek/Russian learner error),
//     and adverb + -ing with no be ("usually drinking").
//   be: adverb with be left out ("always hungry", zero copula), do-support
//     ("does always"), and adverb before be ("always is"). The before-be
//     option is offered ONLY with always and never: "usually is / often is /
//     sometimes is" are heard from natives, so they would be a second answer.
// End position is never offered ("I go there often" is fine English).
//
// Build gives the verb in brackets and names the adverb in the instruction,
// so the typed key is adverb + verb (or be + adverb).
//
// Run: node tools/grammar-practice/authored/adj-adv.frequency.adverb-position.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "frequency", topic: "adverb-position", level: "A1", pv: "2.5" };

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const BE = { i: "am", sg: "is", pl: "are" };
const DO = { i: "do", sg: "does", pl: "do" };
const whyV = (adv, v) => `${cap(adv)} goes before the main verb: ${adv} ${v}. Don't add be, and don't put it between the verb and the words after it.`;
const whyB = (adv, be) => `With be, ${adv} goes after it: ${be} ${adv}. Don't leave out be.`;

/* ---------------- choose: 20 mcq ---------------- */
// V rows: [type, adverb, verb form, -ing, prompt, slots]
const CHOOSE_V = [
  ["sg", "usually", "drinks", "drinking", "My grandmother ______ green tea after {meal} with her {who}.",
    { meal: ["lunch", "dinner", "breakfast", "work"], who: ["friends", "sisters", "neighbours", "daughter"] }],
  ["i", "always", "get", "getting", "I ______ up early on {days} and {act} before breakfast.",
    { days: ["school days", "weekdays", "workdays", "Mondays"], act: ["make my bed", "do exercises", "walk the dog", "read the news"] }],
  ["pl", "often", "play", "playing", "We ______ {sport} in the {place} after school.",
    { sport: ["football", "volleyball", "basketball", "table tennis"], place: ["yard", "park", "gym", "sports hall"] }],
  ["sg", "never", "eats", "eating", "My little brother ______ {food}. He doesn't like the {thing}.",
    { food: ["onions", "carrots", "fish", "spinach"], thing: ["taste", "smell", "colour", "look of it"] }],
  ["pl", "sometimes", "take", "taking", "My parents ______ a taxi to the {place} when it is {weather}.",
    { place: ["bazaar", "station", "airport", "hospital"], weather: ["raining", "snowing", "very hot", "very late"] }],
  ["i", "usually", "do", "doing", "I ______ my homework in the {room} after {time}.",
    { room: ["kitchen", "library", "living room", "bedroom"], time: ["dinner", "school", "lunch", "training"] }],
  ["sg", "always", "calls", "calling", "Aziza ______ her grandmother on {day} evenings and tells her about {topic}.",
    { day: ["Friday", "Sunday", "Saturday", "Wednesday"], topic: ["school", "her week", "her friends", "university"] }],
  ["pl", "often", "watch", "watching", "My friends and I ______ {program} on Friday nights at {whose} house.",
    { program: ["films", "football", "cartoons", "comedy shows"], whose: ["Sardor's", "my", "Olga's", "Timur's"] }],
  ["sg", "never", "uses", "using", "Our teacher ______ her phone in class. She keeps it in her {bag} until {time}.",
    { bag: ["bag", "handbag", "desk", "coat pocket"], time: ["lunch", "the break", "the end of the day", "home time"] }],
  ["sg", "sometimes", "cooks", "cooking", "My father ______ plov in a big {pot} {when}.",
    { pot: ["kazan", "pot", "iron pot", "family kazan"], when: ["at weekends", "on holidays", "for guests", "on Navruz"] }],
  ["pl", "usually", "walk", "walking", "The children ______ to school with their {person}, but today they are going by {transport}.",
    { person: ["mother", "older brother", "friends", "neighbours"], transport: ["car", "bus", "taxi", "bike"] }],
  ["sg", "always", "wears", "wearing", "My uncle ______ a {clothes} at work because the {place} is cold.",
    { clothes: ["jacket", "warm sweater", "hat", "coat"], place: ["office", "factory", "building", "workshop"] }],
].map(([type, adv, v, ing, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt,
  options: [`${adv} ${v}`, `${v} ${adv}`, `${BE[type]} ${adv} ${v}`, `${adv} ${ing}`], key: 0, why: whyV(adv, v), slots,
}));
// be rows: always / never only (see header)
const CHOOSE_B = [
  ["sg", "always", "My brother ______ hungry after {training}. He eats two {food}.",
    { training: ["football training", "school", "the gym", "swimming"], food: ["sandwiches", "plates of plov", "bowls of soup", "samsas"] }],
  ["pl", "never", "The buses in our {place} ______ late in the morning. They come every {n} minutes.",
    { place: ["town", "city", "district", "street"], n: ["five", "ten", "seven", "fifteen"] }],
  ["i", "always", "I ______ tired on {day} because I have {n} lessons.",
    { day: ["Mondays", "Tuesdays", "Thursdays", "Fridays"], n: ["seven", "eight", "six", "nine"] }],
  ["sg", "never", "Our {room} ______ cold in winter. My father fixed the {thing} last year.",
    { room: ["flat", "house", "bedroom", "kitchen"], thing: ["windows", "heating", "heater", "door"] }],
  ["pl", "always", "My cousins ______ happy at Navruz. They eat {food} and play in the {place}.",
    { food: ["sumalak", "plov", "sweets", "halim"], place: ["yard", "park", "street", "garden"] }],
  ["i", "never", "I ______ late for my English lessons. I leave home at {time} and take the {transport}.",
    { time: ["seven", "half past seven", "eight", "quarter past seven"], transport: ["metro", "bus", "minibus", "early bus"] }],
  ["sg", "always", "The bazaar ______ busy on {day}. People buy {food} for the week.",
    { day: ["Saturday", "Sunday", "Saturdays", "Sundays"], food: ["meat", "fruit", "vegetables", "rice"] }],
  ["sg", "never", "My grandfather ______ bored. He reads {thing} and works in his {place} every day.",
    { thing: ["books", "the newspaper", "stories", "poems"], place: ["garden", "workshop", "yard", "orchard"] }],
].map(([type, adv, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt,
  options: [`${BE[type]} ${adv}`, `${adv} ${BE[type]}`, adv, `${DO[type]} ${adv}`], key: 0, why: whyB(adv, BE[type]), slots,
}));
// Interleave so the stage isn't all main-verb first.
const CHOOSE = [];
for (let i = 0; i < 12; i++) { CHOOSE.push(CHOOSE_V[i]); if (i % 3 === 1 && CHOOSE_B.length) CHOOSE.push(CHOOSE_B.shift()); }
CHOOSE.push(...CHOOSE_B);

/* ---------------- build: 20 gap_fill ---------------- */
const instrV = (adv) => `Complete the sentence with ${adv} and the right form of the verb in brackets. Put ${adv} in the right place.`;
const BUILD = [
  // main verb: [adverb, verb, key, source, slots]
  ["usually", "walk", "usually walks", "My sister ______ (walk) to {place} with her {friend}.",
    { place: ["school", "college", "the metro", "work"], friend: ["friends", "classmate", "best friend", "cousin"] }],
  ["always", "brush", "always brush", "I ______ (brush) my teeth before {time} and after {meal}.",
    { time: ["bed", "school", "work", "sleeping"], meal: ["breakfast", "dinner", "lunch", "sweets"] }],
  ["often", "visit", "often visit", "We ______ (visit) our grandparents in {city} at {time}.",
    { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"], time: ["weekends", "the weekend", "Navruz", "New Year"] }],
  ["never", "drink", "never drinks", "My father ______ (drink) {drink} {time}. He can't sleep after it.",
    { drink: ["coffee", "strong tea", "black tea", "espresso"], time: ["in the evening", "after dinner", "at night", "after six"] }],
  ["sometimes", "help", "sometimes help", "I ______ (help) my mother with {task} on {day}.",
    { task: ["the cooking", "the shopping", "the cleaning", "the washing"], day: ["Saturdays", "Sundays", "Fridays", "holidays"] }],
  ["usually", "have", "usually have", "We ______ (have) {meal} at seven o'clock in the {room}.",
    { meal: ["dinner", "breakfast", "tea", "supper"], room: ["kitchen", "living room", "yard", "garden"] }],
  ["always", "do", "always does", "Bekzod ______ (do) his homework at the {place} before he {fun}.",
    { place: ["kitchen table", "library", "desk in his room", "table by the window"], fun: ["plays games", "watches TV", "goes out", "meets friends"] }],
  ["often", "go", "often go", "My friends and I ______ (go) to the {place} after classes. We {activity} there.",
    { place: ["park", "café", "library", "student centre"], activity: ["talk", "relax", "chat", "meet other students"] }],
  ["never", "watch", "never watches", "My grandmother ______ (watch) {program}. She prefers {thing}.",
    { program: ["cartoons", "football", "action films", "the news"], thing: ["books", "music", "the radio", "her garden"] }],
  ["sometimes", "play", "sometimes plays", "My brother ______ (play) chess with our {relative} in the {place}.",
    { relative: ["grandfather", "uncle", "father", "cousin"], place: ["park", "yard", "garden", "teahouse"] }],
  ["usually", "take", "usually take", "Students ______ (take) the metro to {place} because it is {reason}.",
    { place: ["university", "college", "the city centre", "school"], reason: ["fast", "cheap", "warm", "safe"] }],
  ["always", "forget", "always forget", "I ______ (forget) my {thing} at home on {day}.",
    { thing: ["umbrella", "keys", "notebook", "lunch"], day: ["Mondays", "Fridays", "Tuesdays", "Thursdays"] }],
  // be: [adverb, "be", key, source, slots]
  ["usually", "be", "is usually", "My little brother ______ (be) sleepy after {meal}, so he sleeps on the {place}.",
    { meal: ["lunch", "school", "dinner", "swimming"], place: ["sofa", "bed", "carpet", "floor"] }],
  ["often", "be", "are often", "The roads ______ (be) icy in {month}, so we walk {how}.",
    { month: ["January", "February", "December", "winter"], how: ["slowly", "carefully", "very slowly", "very carefully"] }],
  ["sometimes", "be", "am sometimes", "I ______ (be) late for {thing} because of the {problem}.",
    { thing: ["school", "work", "class", "the bus"], problem: ["traffic", "rain", "snow", "long queue"] }],
  ["never", "be", "is never", "Our English teacher ______ (be) angry. She {does} when we make mistakes.",
    { does: ["smiles", "helps us", "explains again", "stays calm"] }],
  ["always", "be", "are always", "My parents ______ (be) busy on {day}. They work at the {place}.",
    { day: ["Mondays", "weekdays", "Saturdays", "Fridays"], place: ["bazaar", "hospital", "shop", "school"] }],
  ["usually", "be", "is usually", "The metro ______ (be) crowded at {time}, so I {act}.",
    { time: ["eight o'clock", "rush hour", "half past eight", "nine o'clock"], act: ["stand", "read on my phone", "listen to music", "leave early"] }],
  ["often", "be", "is often", "In {month}, it ______ (be) very hot in {city}.",
    { month: ["July", "August", "June", "early September"], city: ["Tashkent", "Bukhara", "Termez", "Samarkand"] }],
  ["never", "be", "am never", "I ______ (be) bored at my grandparents' house. We {activity} together.",
    { activity: ["cook", "play chess", "work in the garden", "tell stories"] }],
].map(([adv, verb, key, source, slots]) => {
  const be = verb === "be";
  return {
    ...BASE, stage: "build", format: "gap_fill", instr: instrV(adv), source, key,
    why: be ? whyB(adv, key.split(" ")[0]) : whyV(adv, key.split(" ")[1]), slots,
  };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const ADD = "Add the word in brackets to the sentence in the right place.";
const FIX = "The word in brackets is in the wrong place. Rewrite the sentence correctly.";
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  // add to a main-verb sentence (5)
  [ADD, "We play {sport} on {day}.", "We ______ (often) {sport} on {day}.", "often play", whyV("often", "play"),
    { sport: ["football", "volleyball", "chess", "tennis"], day: ["Sundays", "Saturdays", "Fridays", "holidays"] }],
  [ADD, "My mother makes {food} for {meal}.", "My mother ______ (usually) {food} for {meal}.", "usually makes", whyV("usually", "makes"),
    { food: ["eggs", "porridge", "pancakes", "soup"], meal: ["breakfast", "dinner", "guests", "lunch"] }],
  [ADD, "I check my phone in {place}.", "I ______ (never) my phone in {place}.", "never check", whyV("never", "check"),
    { place: ["class", "the library", "lessons", "the cinema"] }],
  [ADD, "Timur goes to the gym after {thing} with his {person}.", "Timur ______ (always) to the gym after {thing} with his {person}.", "always goes", whyV("always", "goes"),
    { thing: ["work", "school", "lessons", "college"], person: ["brother", "friend", "father", "cousin"] }],
  [ADD, "They eat {food} at the {place}.", "They ______ (sometimes) {food} at the {place}.", "sometimes eat", whyV("sometimes", "eat"),
    { food: ["samsa", "shashlik", "plov", "soup"], place: ["café", "canteen", "teahouse", "bazaar"] }],
  // add to a be sentence (5)
  [ADD, "My sister is tired after {thing} on {day}.", "My sister ______ (often) tired after {thing} on {day}.", "is often", whyB("often", "is"),
    { thing: ["work", "school", "training", "her lessons"], day: ["Mondays", "Fridays", "weekdays", "Thursdays"] }],
  [ADD, "The {place} in our {town} is closed on Mondays.", "The {place} in our {town} ______ (always) closed on Mondays.", "is always", whyB("always", "is"),
    { place: ["museum", "library", "theatre", "gallery"], town: ["town", "city", "district", "village"] }],
  [ADD, "I am hungry after {thing}.", "I ______ (usually) hungry after {thing}.", "am usually", whyB("usually", "am"),
    { thing: ["football", "swimming", "school", "the gym"] }],
  [ADD, "We are late for {thing} on {day}.", "We ______ (never) late for {thing} on {day}.", "are never", whyB("never", "are"),
    { thing: ["class", "school", "work", "lessons"], day: ["Mondays", "rainy days", "Fridays", "snowy days"] }],
  [ADD, "In {city}, the weather is cold in {month}.", "In {city}, the weather ______ (sometimes) cold in {month}.", "is sometimes", whyB("sometimes", "is"),
    { city: ["Tashkent", "Samarkand", "Fergana", "Nukus"], month: ["April", "March", "October", "November"] }],
  // correct the position (5)
  [FIX, "My father drinks usually coffee at {place} with {who}.", "My father ______ (usually) coffee at {place} with {who}.", "usually drinks",
    "Usually goes before the main verb, not between drinks and coffee: usually drinks.",
    { place: ["work", "breakfast", "the office", "home"], who: ["his friends", "my mother", "his colleagues", "my uncle"] }],
  [FIX, "She always is late for {thing} on {day}.", "She ______ (always) late for {thing} on {day}.", "is always",
    "With be, always comes after it: is always.",
    { thing: ["class", "the bus", "work", "lessons"], day: ["Mondays", "Fridays", "Tuesdays", "Wednesdays"] }],
  [FIX, "I play often {game} with my {person}.", "I ______ (often) {game} with my {person}.", "often play",
    "Often goes before the main verb, not between play and the game: often play.",
    { game: ["chess", "football", "tennis", "video games"], person: ["brother", "cousin", "friends", "father"] }],
  [FIX, "He is usually works at the {place} on {day}.", "He ______ (usually) at the {place} on {day}.", "usually works",
    "Works is the main verb, so don't add is: usually works.",
    { place: ["bazaar", "shop", "hospital", "factory"], day: ["Saturdays", "weekdays", "Mondays", "Sundays"] }],
  [FIX, "They never are at home on {day} because they visit {who}.", "They ______ (never) at home on {day} because they visit {who}.", "are never",
    "With be, never comes after it: are never.",
    { day: ["Saturdays", "Sundays", "Fridays", "holidays"], who: ["their grandparents", "friends", "their cousins", "relatives"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you always do in the morning.", "always before the main verb",
    ["exactly one sentence", "must use I", "must use always"]],
  ["Write one sentence about something you never eat or drink.", "never before the main verb",
    ["exactly one sentence", "must use I", "must use never"]],
  ["Write one sentence about how you usually get to school, university or work.", "usually before the main verb",
    ["exactly one sentence", "must name a kind of transport", "must use usually"]],
  ["Write one sentence about how you often feel on Monday mornings.", "be + often + adjective",
    ["exactly one sentence", "must use am or is", "often after be"]],
  ["Write one sentence about someone in your family who is always busy, happy or late.", "be + always + adjective",
    ["exactly one sentence", "must name a family member", "always after is"]],
  ["Write one sentence about something you sometimes do at the weekend with friends.", "sometimes before the main verb",
    ["exactly one sentence", "must include at the weekend", "must use sometimes"]],
  ["Write one sentence about a place in your city that is never quiet.", "be + never + adjective",
    ["exactly one sentence", "must name a place", "never after is"]],
  ["Write two sentences about your evenings: one with a main verb and one with be.", "a frequency adverb before a main verb and after be",
    ["exactly two sentences", "one adverb before a main verb", "one adverb after be"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a normal school or work day for you, from morning to evening. Use always, usually, often, sometimes and never. Write three or four sentences.",
    "frequency adverbs before the main verb", ["adverb before the main verb", "no adverb between the verb and its object", "at least three different adverbs"]],
  ["Describe your weekends. What do you usually do, and what do you never do? Write three or four sentences.",
    "frequency adverbs in habits", ["usually and never before the main verb", "no be before a main verb", "at weekends or at the weekend"]],
  ["Describe how you feel at different times of the week. Are you often tired? Are you always happy on Fridays? Write three or four sentences.",
    "frequency adverbs after be", ["am, is or are before the adverb", "an adjective after the adverb", "no missing be"]],
  ["Describe someone in your family and their habits. Write three or four sentences.",
    "frequency adverbs with be and with main verbs", ["adverb after be", "adverb before the main verb", "he or she with the -s form"]],
  ["Describe what you eat and drink in a normal week. Write three or four sentences.",
    "frequency adverbs before main verbs about food", ["often, sometimes or never before eat or drink", "no adverb after the verb", "food and drink named"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.frequency.adverb-position.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);