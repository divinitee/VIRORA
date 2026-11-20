// Hand-authored: prep-phrasal / movement / to-vs-in (A2).
// Path fill P42 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: TO for movement towards a place, IN for being in a place
// (Every summer we go ______ the mountains and stay ______ a small hotel:
// to / in). A contrast topic: keys are to and in, about half each.
// One right answer: movement verbs are only ones that never take "in" for a
// destination (go, fly, move, come, return, take the bus / train); travel,
// walk, run, drive and swim were cut ("travel in Turkey", "walk in the park"
// are English). Location verbs are live, stay, work, study, be, spend (time),
// where "to" is always wrong. Places are cities, countries, the mountains,
// the countryside, the capital, the north / south: no buildings, where "at"
// could also be right (stay at a hotel), and no "home" (P40) or arrive (P41).
// Choose: 20 two-blank items, options "to / in", "in / to", "to / to",
// "in / in", rotated; the order of movement and location changes.
// Build: "Write to or in." 10 to, 10 in; no build source prints to or in
// elsewhere (no "want to", no "in the evening").
// Transform: 5 correct the mistake (both ways) / 5 be there → go to / 5 went
// there and are there now → live / stay in.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.movement.to-vs-in.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "movement", topic: "to-vs-in", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const HE = ["Aziz", "Timur", "Bobur", "Rustam"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];
const FAR = ["Istanbul", "Moscow", "London", "Almaty"];
const COUNTRY = ["Turkey", "Kazakhstan", "England", "Russia"];
const AREA = ["the mountains", "the countryside", "a small village", "the north"];
const WHEN = ["last summer", "last year", "last spring", "two years ago"];
const NEXT = ["next summer", "next month", "next spring", "next year"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const OPT = ["to", "in", "at", "on"];
const WHY = {
  to: "go, fly, move, come and return show movement towards a place, so use to.",
  in: "live, stay, work, study and be show where someone is, so use in.",
};

/* ---------------- choose: 20 mcq, two blanks ---------------- */
const CHOOSE = [
  ["ti", "Every summer we go ______ {area} and stay ______ a village there, {name}.", { area: ["the mountains", "the countryside", "the north", "the south"], name: NAME }],
  ["it", "My uncle lives ______ {city}, but he often goes ______ {far} for work.", { city: CITY, far: FAR }],
  ["ti", "{name} moved ______ {far} {when}. Now she works ______ a big city.", { name: SHE, far: FAR, when: WHEN }],
  ["it", "We stayed ______ {city} for a week and then went ______ {city2}.", { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"], city2: ["Khiva", "Tashkent", "Andijan", "Termez"] }],
  ["ti", "My cousins came ______ Tashkent {when}, and they still live ______ the capital.", { when: WHEN, x: [] }],
  ["it", "{name} studies ______ {far}, and he flies ______ Tashkent every {time}.", { name: HE, far: FAR, time: ["summer", "winter", "holiday", "New Year"] }],
  ["ti", "Let's go ______ {city} {next} and stay ______ the old town, {name}.", { city: CITY, next: NEXT, name: NAME }],
  ["it", "My grandparents live ______ {area}, so we go ______ their village by car.", { area: ["the countryside", "the mountains", "a small village", "the south"], x: [] }],
  ["ti", "We flew ______ {country} {when} and spent two weeks ______ the south.", { country: COUNTRY, when: WHEN }],
  ["it", "{name} works ______ {far} now. She returns ______ Uzbekistan every {time}.", { name: SHE, far: FAR, time: ["summer", "winter", "spring", "year"] }],
  ["ti", "When did you come ______ {city}, {name}? Do you like living ______ this city?", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], name: NAME }],
  ["it", "We were ______ {city} {when}. We went ______ the old town every day.", { city: CITY, when: WHEN }],
  ["ti", "My aunt is going ______ {country} {next}. She will stay ______ the capital.", { country: COUNTRY, next: NEXT }],
  ["it", "{name} lived ______ {area} as a child, and then his family moved ______ {city}.", { name: HE, area: ["the mountains", "a small village", "the countryside", "the north"], city: CITY }],
  ["ti", "They took the train ______ {city} and stayed ______ the city for three days.", { city: CITY, x: [] }],
  ["it", "Is your brother still ______ {far}, {name}? When is he coming ______ Tashkent?", { far: FAR, name: NAME }],
  ["ti", "I want to go ______ {country} one day and live ______ a big city there, {name}.", { country: COUNTRY, name: NAME }],
  ["it", "Our teacher studied ______ {far}, and then she came ______ our town.", { far: FAR, x: [] }],
  ["ti", "We're flying ______ {far} {next}, and we'll stay ______ the centre, {name}.", { far: FAR, next: NEXT, name: NAME }],
  ["it", "My friends spent the summer ______ {area}, and then they went ______ {city}.", { area: ["the mountains", "the countryside", "a small village", "the north"], city: CITY }],
].map(([k, two, slots], i) => {
  // Keep ONE blank: even items blank the first preposition, odd the second;
  // the other one is printed, so every sentence shows the contrast.
  const pair = k === "ti" ? ["to", "in"] : ["in", "to"];
  const b = (i >> 1) & 1;
  const parts = two.split("______");
  const prompt = b === 0 ? parts[0] + "______" + parts[1] + pair[1] + parts[2] : parts[0] + pair[0] + parts[1] + "______" + parts[2];
  const key0 = pair[b];
  const options = rot(OPT, i);
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(key0), why: WHY[key0], slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write to or in.";
const BUILD = [
  // to (10)
  ["to", "We go ______ {area} every summer, {name}.", { area: ["the mountains", "the countryside", "the north", "the south"], name: NAME }],
  ["to", "{name} moved ______ {far} {when}.", { name: NAME, far: FAR, when: WHEN }],
  ["to", "My uncle flies ______ {country} {next}.", { country: COUNTRY, next: NEXT }],
  ["to", "When did your family come ______ Tashkent, {name}?", { name: NAME, x: [] }],
  ["to", "Let's take the train ______ {city} on Saturday, {name}.", { city: CITY, name: NAME }],
  ["to", "My sister returned ______ Uzbekistan {when}.", { when: WHEN, x: [] }],
  ["to", "Are you going ______ {city} {next}, {name}?", { city: CITY, next: NEXT, name: NAME }],
  ["to", "Our neighbours are moving ______ {area} next month.", { area: ["the countryside", "a small village", "the mountains", "the south"], x: [] }],
  ["to", "{name} went ______ {far} with his {who}.", { name: HE, far: FAR, who: ["dad", "uncle", "brother", "team"] }],
  ["to", "My cousins came ______ our city {when}, {name}.", { when: WHEN, name: NAME }],
  // in (10)
  ["in", "My grandparents live ______ {area}, {name}.", { area: ["the countryside", "the mountains", "a small village", "the north"], name: NAME }],
  ["in", "{name} works ______ {far} now.", { name: NAME, far: FAR }],
  ["in", "We stayed ______ {city} for a week {when}.", { city: CITY, when: WHEN }],
  ["in", "My brother studies ______ {country}, {name}.", { country: COUNTRY, name: NAME }],
  ["in", "Is your aunt still ______ {far}, {name}?", { far: FAR, name: NAME }],
  ["in", "They spent the holidays ______ {area}.", { area: ["the mountains", "the countryside", "a small village", "the south"], x: [] }],
  ["in", "{name} lived ______ {city} as a child.", { name: NAME, city: CITY }],
  ["in", "Our friends were ______ {country} {when}.", { country: COUNTRY, when: WHEN }],
  ["in", "My {who} works ______ the capital, {name}.", { who: ["mum", "dad", "uncle", "aunt"], name: NAME }],
  ["in", "We'll stay ______ {far} for three days {next}.", { far: FAR, next: NEXT }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[key], slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const GO = "Rewrite the sentence with the verb in brackets.";
const TRANSFORM = [
  // correct (5)
  [COR, "We go in {area} every summer, {name}.", "We go ______ {area} every summer, {name}.", "to", WHY.to, { area: ["the mountains", "the countryside", "the north", "the south"], name: NAME }],
  [COR, "My aunt lives to {city} now, {name}.", "My aunt lives ______ {city} now, {name}.", "in", WHY.in, { city: CITY, name: NAME }],
  [COR, "{name} moved in {far} {when}.", "{name} moved ______ {far} {when}.", "to", WHY.to, { name: NAME, far: FAR, when: WHEN }],
  [COR, "We stayed to {city} for a week {when}.", "We stayed ______ {city} for a week {when}.", "in", WHY.in, { city: CITY, when: WHEN }],
  [COR, "My cousins flew in {country} {when}.", "My cousins flew ______ {country} {when}.", "to", WHY.to, { country: COUNTRY, when: WHEN }],
  // be there -> go to (5)
  [GO + " (go)", "We will be in {city} {next}, {name}.", "We will go ______ {city} {next}, {name}.", "to", "go shows movement: go to.", { city: CITY, next: NEXT, name: NAME }],
  [GO + " (fly)", "My uncle will be in {far} {next}.", "My uncle will fly ______ {far} {next}.", "to", "fly shows movement: fly to.", { far: FAR, next: NEXT }],
  [GO + " (move)", "Next year {name} will live in {country}.", "Next year {name} will move ______ {country}.", "to", "move shows movement: move to.", { name: NAME, country: COUNTRY }],
  [GO + " (come)", "My grandparents will be in Tashkent {next}, {name}.", "My grandparents will come ______ Tashkent {next}, {name}.", "to", "come shows movement: come to.", { next: NEXT, name: NAME }],
  [GO + " (return)", "{name} will be back in Uzbekistan {next}.", "{name} will return ______ Uzbekistan {next}.", "to", "return shows movement: return to.", { name: NAME, next: NEXT }],
  // went there -> live / stay in (5)
  [GO + " (live)", "My cousins moved to {city} {when}.", "My cousins live ______ {city} now.", "in", "live shows where they are: live in.", { city: CITY, when: WHEN }],
  [GO + " (work)", "{name} went to {far} for a job {when}.", "{name} works ______ {far} now.", "in", "work shows where she is: work in.", { name: SHE, far: FAR, when: WHEN }],
  [GO + " (stay)", "We went to {area} for the weekend, {name}.", "We stayed ______ {area} for the weekend, {name}.", "in", "stay shows where you were: stay in.", { area: ["the mountains", "the countryside", "a small village", "the north"], name: NAME }],
  [GO + " (study)", "My brother went to {country} to study {when}.", "My brother studies ______ {country} now.", "in", "study shows where he is: study in.", { country: COUNTRY, when: WHEN }],
  [GO + " (be)", "Our teacher flew to {far} {when}.", "Our teacher was ______ {far} {when}.", "in", "be shows where someone is: be in.", { far: FAR, when: WHEN }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a city you want to go to.", "I want to go to …", ["exactly one sentence", "go to", "a city name"]],
  ["Write one sentence about where a relative lives.", "My … lives in …", ["exactly one sentence", "lives in", "a family word"]],
  ["Write one sentence about a trip: where you went and where you stayed.", "We went to … and stayed in …", ["exactly one sentence", "to once", "in once"]],
  ["Write one sentence about someone who moved to another city or country.", "… moved to …", ["exactly one sentence", "moved to", "a place name"]],
  ["Write one sentence about where you spend the summer holidays.", "We spend the summer in …", ["exactly one sentence", "in", "a place word"]],
  ["Write one question to a friend about a trip. Use go to.", "Are you going to … ?", ["exactly one question", "go to", "a place name"]],
  ["Write one sentence about where you would like to live one day.", "I'd like to live in …", ["exactly one sentence", "live in", "a city or country"]],
  ["Write two sentences: one about where you live and one about where you often go.", "I live in … / I often go to …", ["exactly two sentences", "in once", "to once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your last holiday: where you went, where you stayed and what you did there.", "went to / stayed in", ["went to", "stayed in", "three or four sentences"]],
  ["Write about a relative who lives in another city or country. How often do you go there?", "lives in / go to", ["lives in", "go to", "three or four sentences"]],
  ["Plan a trip for next summer: where will you go, and where will you stay?", "go to / stay in", ["go to", "stay in", "three or four sentences"]],
  ["Write about someone in your family who moved to a new city. Where does he or she live now?", "moved to / lives in", ["moved to", "lives in", "three or four sentences"]],
  ["Describe a place you love: where it is and how you get there.", "go to / is in", ["to", "in", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.movement.to-vs-in.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);