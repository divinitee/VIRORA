// Hand-authored: prep-phrasal / movement / arrive-at-in (A2).
// Path fill P41 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: arrive at a point or a building (We arrived ______ the
// airport: at / on / to / by), never "arrive to" (the Uzbek dative "-ga" and
// Russian "приехать в / на" both push learners to "to").
// Keys: AT for a point, a building or an event (the bus stop, the gate, the
// station, the hotel, the cinema, the party, the wedding, Grandma's flat);
// IN for a city or a country (Tashkent, Samarkand, Turkey, England).
// One right answer: subjects are always people, never a train or a plane
// (a train can "arrive in the station"); cut while drafting the office and
// the hospital (in the office / in hospital), villages (at / in both used)
// and "arrive home" (no preposition, P40). Choose options at / in / to / on,
// rotated. Every stage is about 60 % at and 40 % in.
// Build: "Write at, in or to." No build source prints at or in anywhere else
// (no clock times, no "in the morning").
// Transform: 5 correct "arrive to" / 5 got to → arrived at / in / 5 join two
// sentences with arrived.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.movement.arrive-at-in.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "movement", topic: "arrive-at-in", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const SHE = ["Lola", "Olga", "Madina", "Kamila"];
const CITY = ["Tashkent", "Samarkand", "Bukhara", "Khiva"];
const FAR = ["Istanbul", "Moscow", "London", "Almaty"];
const COUNTRY = ["Turkey", "Kazakhstan", "England", "Russia"];
const EVENT = ["party", "wedding", "concert", "meeting"];
const PLACE = ["station", "hotel", "cinema", "bus station"];
const DAYTIME = ["yesterday", "on Friday", "last week", "early"];
const WHEN = ["yesterday", "last night", "on Friday", "last week"];
const SOON = ["tomorrow", "on Monday", "next week", "on Saturday"];
const KIDS = ["children", "students", "boys", "girls"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const OPT = { at: ["at", "in", "to", "on"], in: ["in", "at", "to", "on"] };
const WHY = {
  at: "arrive at + a place like a building, a stop or an event. Never arrive to.",
  in: "arrive in + a city or a country. Never arrive to.",
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["at", "We arrived ______ the airport {when}, {name}.", { when: ["at 6 a.m.", "very early", "late", "on time"], name: NAME }],
  ["in", "My cousins arrived ______ {city} {when}.", { city: CITY, when: WHEN }],
  ["at", "{name} arrived ______ the {event} with a big cake.", { name: NAME, event: EVENT }],
  ["in", "When did you arrive ______ {country}, {name}?", { country: COUNTRY, name: NAME }],
  ["at", "Call me when you arrive ______ the {place}, {name}.", { place: PLACE, name: NAME }],
  ["at", "The guests arrived ______ the {event} very late, {name}.", { event: EVENT, name: NAME }],
  ["in", "We arrive ______ {far} in the evening, {name}. Then we take a taxi.", { far: FAR, name: NAME }],
  ["at", "We arrived ______ the bus stop {when}, but the bus was gone.", { when: ["too late", "at eight", "a minute late", "at five past nine"], who: ["", "", "", ""] }],
  ["in", "{name} is arriving ______ {city} {when}.", { name: NAME, city: CITY, when: ["tomorrow", "on Monday", "next week", "tonight"] }],
  ["at", "My {who} arrived ______ Grandma's flat with some {food}.", { who: ["uncle", "aunt", "sister", "brother"], food: ["fruit", "bread", "sweets", "flowers"] }],
  ["at", "Let's meet when we arrive ______ the {place}, {name}.", { place: ["stadium", "bazaar", "cinema", "museum"], name: NAME }],
  ["in", "We arrived ______ {country} {when}, {name}.", { country: COUNTRY, when: WHEN, name: NAME }],
  ["at", "Please arrive ______ the {event} on time, {name}.", { event: ["exam", "meeting", "concert", "lesson"], name: NAME }],
  ["in", "My grandparents arrive ______ {city} by train {when}.", { city: CITY, when: ["tomorrow", "on Sunday", "next Friday", "tonight"] }],
  ["at", "{name} arrived ______ the hotel {when}.", { name: NAME, when: ["late at night", "very tired", "at midnight", "with two big bags"] }],
  ["at", "What time did you arrive ______ the {event}, {name}?", { event: EVENT, name: NAME }],
  ["in", "My brother will arrive ______ {far} {when}.", { far: FAR, when: SOON }],
  ["at", "We arrived ______ the gate just in time, {name}. The {t} was still there.", { name: NAME, t: ["plane", "bus", "coach", "minibus"] }],
  ["in", "{name} arrived ______ {city} {when} and called her mum.", { name: SHE, city: CITY, when: WHEN }],
  ["at", "The {kids} arrived ______ the {place} with their teacher.", { kids: KIDS, place: ["museum", "zoo", "theatre", "park gate"] }],
].map(([k, prompt, slots], i) => {
  const options = rot(OPT[k], i);
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(k), why: WHY[k], slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write at, in or to.";
const BUILD = [
  ["at", "We arrived ______ the {place} {when}, {name}.", { place: PLACE, when: WHEN, name: NAME }],
  ["in", "My aunt arrived ______ {city} {when}.", { city: CITY, when: WHEN }],
  ["at", "{name} arrived ______ the {event} late again.", { name: NAME, event: EVENT }],
  ["in", "When do you arrive ______ {far}, {name}?", { far: FAR, name: NAME }],
  ["at", "Text me when you arrive ______ the {place}, {name}.", { place: ["bus stop", "station", "hotel", "stadium"], name: NAME }],
  ["in", "They arrived ______ {country} {when}.", { country: COUNTRY, when: WHEN }],
  ["at", "The teacher arrived ______ the {event} before us, {name}.", { event: ["concert", "meeting", "exam", "party"], name: NAME }],
  ["in", "{name} is arriving ______ {city} tomorrow with her {who}.", { name: SHE, city: CITY, who: ["mum", "sister", "aunt", "friend"] }],
  ["at", "Our guests arrived ______ the {event} early, {name}.", { event: EVENT, name: NAME }],
  ["at", "We arrived ______ Grandma's house {when}, {name}.", { when: WHEN, name: NAME }],
  ["in", "My cousins will arrive ______ {far} {when}.", { far: FAR, when: SOON }],
  ["at", "{name} arrived ______ the airport {when}.", { name: NAME, when: ["very early", "too late", "with the family", "by taxi"] }],
  ["in", "We arrived ______ {country} {when}, {name}.", { country: COUNTRY, when: WHEN, name: NAME }],
  ["at", "Please arrive ______ the {place} ten minutes early, {name}.", { place: ["station", "cinema", "theatre", "gate"], name: NAME }],
  ["in", "When did your grandparents arrive ______ {city}, {name}?", { city: CITY, name: NAME }],
  ["at", "The {kids} arrived ______ the zoo {when}.", { kids: KIDS, when: DAYTIME }],
  ["in", "My uncle arrived ______ {far} {when}. He loves the city.", { far: FAR, when: WHEN }],
  ["at", "We arrived ______ the {event} {when}, {name}.", { event: EVENT, when: ["by taxi", "on foot", "together", "very late"], name: NAME }],
  ["in", "{name} arrives ______ {city} by train {when}.", { name: NAME, city: CITY, when: ["tomorrow", "tonight", "on Sunday", "next Friday"] }],
  ["at", "What time do we arrive ______ the hotel, {name}? I'm very {state}.", { name: NAME, state: ["tired", "hungry", "sleepy", "cold"] }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why: WHY[key], slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const GOT = "Rewrite the sentence with arrived.";
const JOIN = "Join the two sentences with arrived.";
const TRANSFORM = [
  // correct arrive to (5)
  [COR, "We arrived to the {place} {when}, {name}.", "We arrived ______ the {place} {when}, {name}.", "at", WHY.at, { place: PLACE, when: WHEN, name: NAME }],
  [COR, "My aunt arrived to {city} {when}.", "My aunt arrived ______ {city} {when}.", "in", WHY.in, { city: CITY, when: WHEN }],
  [COR, "{name} arrived to the {event} late.", "{name} arrived ______ the {event} late.", "at", WHY.at, { name: NAME, event: EVENT }],
  [COR, "They arrived to {country} {when}.", "They arrived ______ {country} {when}.", "in", WHY.in, { country: COUNTRY, when: WHEN }],
  [COR, "When did you arrive to the hotel, {name}? You look {state}.", "When did you arrive ______ the hotel, {name}? You look {state}.", "at", WHY.at, { name: NAME, state: ["tired", "hungry", "cold", "sleepy"] }],
  // got to -> arrived at / in (5)
  [GOT, "We got to the {place} {when}, {name}.", "We ______ the {place} {when}, {name}.", "arrived at", "got to a building = arrived at.", { place: PLACE, when: WHEN, name: NAME }],
  [GOT, "My cousins got to {city} {when}.", "My cousins ______ {city} {when}.", "arrived in", "got to a city = arrived in.", { city: CITY, when: WHEN }],
  [GOT, "{name} got to the {event} with a present.", "{name} ______ the {event} with a present.", "arrived at", "got to an event = arrived at.", { name: NAME, event: EVENT }],
  [GOT, "Our {who} got to {far} {when}.", "Our {who} ______ {far} {when}.", "arrived in", "got to a city = arrived in.", { who: ["teacher", "neighbour", "uncle", "aunt"], far: FAR, when: WHEN }],
  [GOT, "The {kids} got to the zoo {when}.", "The {kids} ______ the zoo {when}.", "arrived at", "got to a place = arrived at.", { kids: KIDS, when: DAYTIME }],
  // join (5)
  [JOIN, "We left Tashkent. Four hours later we were in {city}, {name}.", "We ______ {city} four hours later, {name}.", "arrived in", "A city → arrived in.", { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"], name: NAME }],
  [JOIN, "{name} left home. Ten minutes later she was at the {place}.", "{name} ______ the {place} ten minutes later.", "arrived at", "A building or a stop → arrived at.", { name: SHE, place: ["station", "bus stop", "cinema", "bazaar"] }],
  [JOIN, "My uncle took a plane. The next {day}, he was in {country}.", "My uncle ______ {country} the next {day}.", "arrived in", "A country → arrived in.", { day: ["morning", "day", "evening", "afternoon"], country: COUNTRY }],
  [JOIN, "We took a taxi. Half an hour later we were at the {event}, {name}.", "We ______ the {event} half an hour later, {name}.", "arrived at", "An event → arrived at.", { event: EVENT, name: NAME }],
  [JOIN, "The {who} took the bus. An hour later they were at the {place}.", "The {who} ______ the {place} an hour later.", "arrived at", "A building → arrived at.", { who: ["guests", "students", "tourists", "players"], place: ["hotel", "museum", "theatre", "restaurant"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about what time you arrive at school or work.", "I arrive at … at …", ["exactly one sentence", "arrive at", "a time"]],
  ["Write one sentence about a city you arrived in on a trip.", "We arrived in …", ["exactly one sentence", "arrived in", "a city name"]],
  ["Write one sentence about arriving late at a party or a lesson.", "I arrived at the … late.", ["exactly one sentence", "arrived at", "an event word"]],
  ["Write one question to a friend about his or her trip. Use arrive.", "When did you arrive in …?", ["exactly one question", "arrive in or at", "a place name"]],
  ["Write one sentence about a relative who is arriving soon.", "My … is arriving in … tomorrow.", ["exactly one sentence", "arriving in or at", "a family word"]],
  ["Write one sentence for a friend: tell him or her to call you after arriving.", "Call me when you arrive at …", ["exactly one sentence", "arrive at or in", "a place word"]],
  ["Write one sentence about arriving at a station or an airport.", "We arrived at the …", ["exactly one sentence", "arrived at", "station or airport"]],
  ["Write two sentences about a trip: the city you arrived in and the hotel you arrived at.", "We arrived in … / We arrived at the hotel …", ["exactly two sentences", "arrived in once", "arrived at once"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a trip to another city: when you left, when you arrived and where you went first.", "arrived in / arrived at", ["arrived in", "arrived at", "three or four sentences"]],
  ["Write a message to a friend who is visiting you: tell him or her what to do on arriving.", "When you arrive at / in …", ["arrive at or in", "a place word", "three or four sentences"]],
  ["Describe a day when you arrived late somewhere. What happened?", "I arrived at … late", ["arrived at", "a time", "three or four sentences"]],
  ["Plan a family holiday: when you arrive in the city and at the hotel.", "We arrive in … / at the hotel …", ["arrive in", "arrive at", "three or four sentences"]],
  ["Describe the first day of a school trip: where the class arrived and when.", "We arrived at the …", ["arrived at", "a time", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.movement.arrive-at-in.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);