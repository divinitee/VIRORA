// Hand-authored: prep-phrasal / time / in-months (A1).
// Path fill P9 (2026-11-14, Base44 AI, branch grammar-path-fill-2-base44).
//
// Placement focus: in with months ("My birthday is in July").
// Sibling scope (P7-P11): every key here is IN + a MONTH (in May, in
// September). No clock times (P7), no days or dates (on-days, P8; "on 5 May"
// belongs with the contrast topic), no "at night" (P10), no seasons or years
// and no mixed in/on/at sentences (in-on-at-contrast, P11). The month is the
// only time marker in each sentence and is never slotted.
// Distractors: on and at (learners carry over "on" from days), plus since,
// with present or past simple only, so since is never right. Never by /
// until / during / from / before / after, which can all be right before a
// month. No claims about weather, fruit seasons or school calendars: each
// sentence is about the speaker's own family, plans and birthdays (Navruz in
// March is the one fixed fact).
// Build: "Write at, in or on." (closed class, choice in instr). No other "in"
// in any build source or transform target, so the typed key is never printed.
// Transform: 5 correct on / at -> in / 5 answer a When ...? question with the
// month given / 5 swap this month / next month for the month's name.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.time.in-months.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "time", topic: "in-months", level: "A1", pv: "2.5" };

const OPTS = ["in", "on", "at", "since"];
const W = (m) => `${m} is a month, so use in: in ${m}. On is for days, and at is for clock times.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["May", "{name}'s birthday is ______ May. She wants a {gift}.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], gift: ["new phone", "bike", "big book", "watch"] }],
  ["July", "We go to the {place} ______ July with {who}.",
    { place: ["mountains", "lake", "village", "river"], who: ["our cousins", "Grandpa", "our neighbours", "my uncle"] }],
  ["August", "Grandpa's {fruit} are very sweet ______ August, {name}.",
    { fruit: ["melons", "grapes", "peaches", "watermelons"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["December", "My {who} is coming home from {city} ______ December.",
    { who: ["brother", "sister", "uncle", "cousin"], city: ["Seoul", "Kazan", "Istanbul", "Almaty"] }],
  ["March", "{name} started a new job at a {place} ______ March.",
    { name: ["My sister", "Aunt Lola", "My brother", "Mr Karimov"], place: ["bank", "hotel", "school", "shop"] }],
  ["June", "Our {exam} is ______ June. Let's study together, {name}.",
    { exam: ["English exam", "maths exam", "final exam", "big test"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["January", "We often build a snowman in the {place} ______ January, {name}.",
    { place: ["yard", "park", "garden", "street"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["October", "The school {event} is ______ October, {name}.",
    { event: ["concert", "trip", "sports day", "fair"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  ["April", "My {who} planted these {plants} ______ April.",
    { who: ["grandparents", "parents", "grandfather", "uncle"], plants: ["apple trees", "flowers", "tomatoes", "roses"] }],
  ["August", "{name} learned to {skill} ______ August.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], skill: ["swim", "ride a bike", "play chess", "drive"] }],
  ["March", "{who} celebrate Navruz ______ March with {food}.",
    { who: ["We", "My family", "Our neighbours", "All my relatives"], food: ["sumalak", "plov", "samsa", "a big family lunch"] }],
  ["September", "The {place} near our home is closed ______ September, {name}.",
    { place: ["swimming pool", "library", "cafe", "cinema"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["November", "{name} and her family moved to {city} ______ November.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], city: ["Tashkent", "Namangan", "Nukus", "Karshi"] }],
  ["April", "I want to visit {city} ______ April, {name}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Shahrisabz"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["February", "My {who} has a holiday ______ February. We are going to {city}.",
    { who: ["dad", "mum", "uncle", "aunt"], city: ["Samarkand", "Bukhara", "Fergana", "Termez"] }],
  ["September", "We pick {fruit} in {who}'s garden ______ September.",
    { fruit: ["apples", "grapes", "pears", "figs"], who: ["Grandma", "our neighbour", "my uncle", "Aunt Lola"] }],
  ["January", "The new {thing} near our school opens ______ January, {name}.",
    { thing: ["swimming pool", "library", "sports centre", "park"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["October", "{name} was born ______ October, like his {who}.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], who: ["dad", "brother", "grandfather", "cousin"] }],
  ["July", "Are you free ______ July, {name}? Let's go to {place}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], place: ["the mountains", "Samarkand", "the lake", "the village"] }],
  ["February", "Our {club} starts again ______ February, {name}.",
    { club: ["chess club", "football club", "dance class", "English club"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
].map(([m, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: OPTS, key: 0, why: W(m), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write at, in or on.";
const B = (m) => `${m} is a month, so use in.`;
const BUILD = [
  ["June", "{name}'s birthday is ______ June. Let's buy a {gift}.",
    { name: ["Aziz", "Lola", "Timur", "Madina"], gift: ["cake", "card", "book", "ball"] }],
  ["August", "{who} go to the village ______ August to see {fam}.",
    { who: ["We", "My parents", "Aziz and I", "The children"], fam: ["Grandma", "our cousins", "my uncle", "Grandpa"] }],
  ["July", "{who} makes {jam} ______ July.",
    { who: ["Grandma", "Mum", "My aunt", "Our neighbour"], jam: ["apricot jam", "cherry jam", "peach jam", "jam"] }],
  ["May", "My {exam} is ______ May, {name}.",
    { exam: ["English exam", "maths exam", "final exam", "music exam"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  ["September", "{name} started at a new {school} ______ September.",
    { name: ["Lola", "Aziz", "My sister", "My cousin"], school: ["school", "college", "lyceum", "university"] }],
  ["January", "{who} goes skiing ______ January with {comp}.",
    { who: ["My uncle", "Aziz", "My cousin", "Dad"], comp: ["his friends", "his family", "us", "Timur"] }],
  ["October", "{name}, the {event} is ______ October.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], event: ["book fair", "music festival", "school fair", "art show"] }],
  ["April", "Our family went to {city} ______ April with {who}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], who: ["Grandpa", "our cousins", "my aunt", "friends"] }],
  ["December", "My {who}'s birthday is ______ December, {name}.",
    { who: ["sister", "brother", "mum", "dad"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["March", "I want a {thing} for my birthday ______ March, {name}.",
    { thing: ["bike", "phone", "guitar", "watch"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  ["May", "The {pool} opens ______ May, {name}.",
    { pool: ["swimming pool", "summer cafe", "water park", "outdoor pool"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["April", "{who} planted the {plants} ______ April.",
    { who: ["Dad", "Grandpa", "My aunt", "Our neighbour"], plants: ["trees", "flowers", "tomatoes", "potatoes"] }],
  ["November", "{who} visit our cousins ______ November. They live {where}.",
    { who: ["We", "My parents", "Grandma and I", "The children"], where: ["near Bukhara", "far away", "near the mountains", "by the river"] }],
  ["June", "{who} comes back from {city} ______ June.",
    { who: ["My brother", "Our English teacher", "My aunt", "Dad"], city: ["Seoul", "Kazan", "Istanbul", "Almaty"] }],
  ["March", "{name} learned to {skill} ______ March.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], skill: ["drive", "swim", "cook plov", "ride a bike"] }],
  ["September", "The new {building} opens ______ September, {name}.",
    { building: ["library", "park", "school", "sports hall"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["August", "Is your {who}'s birthday ______ August, {name}?",
    { who: ["sister", "brother", "mum", "dad"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  ["July", "We sleep {where} ______ July. It's very hot, {name}.",
    { where: ["on the balcony", "on the roof", "outside", "on the terrace"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  ["May", "{who} paints the {part} ______ May.",
    { who: ["Dad", "Grandpa", "My uncle", "Our neighbour"], part: ["house", "fence", "gate", "front door"] }],
  ["February", "{name}, the school trip to {city} is ______ February.",
    { name: ["Mum", "Dad", "Aziz", "Olga"], city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
].map(([m, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: "in", why: B(m), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const ANS = (m) => `Answer the question. The month is ${m}.`;
const MON = (rel, m) => `${rel} is ${m}. Rewrite the sentence with the name of the month.`;
const TRANSFORM = [
  // correct on / at -> in (5)
  [COR, "{name}'s birthday is on July, {who}.", "{name}'s birthday is ______ July, {who}.",
    "July is a month, so use in, not on.", { name: ["Lola", "Aziz", "My sister", "Grandpa"], who: ["Mum", "Dad", "Olga", "Timur"] }],
  [COR, "We go to the {place} at August with {fam}.", "We go to the {place} ______ August with {fam}.",
    "August is a month, so use in, not at.", { place: ["mountains", "lake", "village", "river"], fam: ["our cousins", "Grandpa", "my aunt", "friends"] }],
  [COR, "My {who} comes back from {city} on May.", "My {who} comes back from {city} ______ May.",
    "May is a month, so use in, not on.", { who: ["brother", "uncle", "sister", "aunt"], city: ["Seoul", "Kazan", "Istanbul", "Almaty"] }],
  [COR, "The {event} is on October, {name}.", "The {event} is ______ October, {name}.",
    "October is a month, so use in, not on.", { event: ["school concert", "book fair", "art show", "school trip"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [COR, "{who} started a new job at March, {name}.", "{who} started a new job ______ March, {name}.",
    "March is a month, so use in, not at.", { who: ["My sister", "Aunt Lola", "My brother", "Mr Karimov"], name: ["Mum", "Dad", "Grandma", "Olga"] }],
  // answer a When ...? question (5)
  [ANS("June"), "{name}, when is your {exam}?", "It is ______ June.",
    "June is a month, so the answer uses in.", { name: ["Aziz", "Olga", "Timur", "Lola"], exam: ["English exam", "maths exam", "final exam", "music exam"] }],
  [ANS("April"), "When do you go to {city}, {name}?", "We go there ______ April.",
    "April is a month, so the answer uses in.", { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [ANS("November"), "When is {who}'s birthday, {name}?", "It is ______ November.",
    "November is a month, so the answer uses in.", { who: ["your sister", "your dad", "Grandma", "your cousin"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [ANS("September"), "When did {name} start {thing}?", "She started ______ September.",
    "September is a month, so the answer uses in.", { name: ["Lola", "Madina", "Olga", "Kamila"], thing: ["college", "her new job", "piano lessons", "the dance class"] }],
  [ANS("March"), "When do your {who} celebrate Navruz, {name}?", "They celebrate it ______ March.",
    "March is a month, so the answer uses in.", { who: ["grandparents", "neighbours", "cousins", "parents"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  // this / next month -> the month's name (5)
  [MON("Next month", "May"), "{name} is going to {city} next month.", "{name} is going to {city} ______ May.",
    "Next month becomes a month's name, May, so use in.", { name: ["Aziz", "Lola", "Grandpa", "My sister"], city: ["Samarkand", "Bukhara", "Khiva", "Seoul"] }],
  [MON("This month", "January"), "Our {club} starts again this month, {name}.", "Our {club} starts again ______ January, {name}.",
    "This month becomes a month's name, January, so use in.", { club: ["chess club", "football club", "dance class", "English club"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [MON("Next month", "August"), "My {who} has a holiday next month.", "My {who} has a holiday ______ August.",
    "Next month becomes a month's name, August, so use in.", { who: ["dad", "mum", "uncle", "aunt"] }],
  [MON("This month", "October"), "{name}'s {who} has a birthday this month.", "{name}'s {who} has a birthday ______ October.",
    "This month becomes a month's name, October, so use in.", { name: ["Aziz", "Lola", "Timur", "Madina"], who: ["sister", "brother", "mother", "father"] }],
  [MON("Next month", "December"), "We are visiting our {fam} next month, {name}.", "We are visiting our {fam} ______ December, {name}.",
    "Next month becomes a month's name, December, so use in.", { fam: ["grandparents", "cousins", "aunt", "uncle"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
].map(([instr, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: "in", why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about the month of your birthday.", "My birthday is in …", ["exactly one sentence", "must use in + a month", "about you"]],
  ["Write one sentence about a family member's birthday.", "in + month", ["exactly one sentence", "must use in + a month", "a family word"]],
  ["Write one sentence about a trip you want to take and the month.", "in + month", ["exactly one sentence", "must use in + a month", "a place"]],
  ["Write one question to a friend about the month of their birthday.", "Is your birthday in …?", ["exactly one question", "must use in + a month", "must end with a question mark"]],
  ["Write one sentence about what your family does in March for Navruz.", "in March", ["exactly one sentence", "must use in March", "about your family"]],
  ["Write one sentence about the month you like best and why.", "in + month", ["exactly one sentence", "must use in + a month", "must say why"]],
  ["Write one sentence about a test, exam or event at your school and its month.", "in + month", ["exactly one sentence", "must use in + a month", "about school or work"]],
  ["Write two sentences about two different months: what you do in each.", "in + month (×2)", ["exactly two sentences", "in in both sentences", "two different months"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell a new friend about the birthdays in your family. Who has a birthday in which month?", "in + months", ["My … 's birthday is in …", "in + three or four months", "family words"]],
  ["Describe your year. What do you do in three or four different months?", "in + months", ["in January …", "in + months", "I go / we visit / I have"]],
  ["Write a message to a friend and plan a trip. Say the month and where you want to go.", "in + month", ["Let's go … in …", "a place", "in + a month"]],
  ["Tell a friend about Navruz in your family. What do you do in March?", "in March", ["in March", "food or family words", "three or four sentences"]],
  ["Write about the month you like best. Why do you like it, and what do you do in it?", "in + month", ["in + a month", "because …", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.time.in-months.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);