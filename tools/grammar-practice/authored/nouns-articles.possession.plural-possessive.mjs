// Hand-authored: nouns-articles / possession / plural-possessive (A2).
//
// Tests ONE point: a regular plural owner takes the apostrophe after the -s
// (the teachers' room). Every choose sentence forces a plural owner with a
// number, "All the" or "Both", so the singular X's is never a second answer.
// Choose distractors: X's (singular), Xs (no apostrophe — Uzbek/Russian have
// no apostrophe at all), Xs's (double s).
// Only regular -s plurals (irregular children's/men's is not this point).
// No neighbour/neighbor in typed keys (rule 10).
//
// Run: node tools/grammar-practice/authored/nouns-articles.possession.plural-possessive.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "nouns-articles", branch: "possession", topic: "plural-possessive", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const FLOOR = ["first", "second", "third", "top"];
const COLOUR = ["blue", "green", "red", "white"];
const opts = (n) => [`${n}s'`, `${n}'s`, `${n}s`, `${n}s's`];
const why = (n) => `There is more than one ${n}, and the plural ends in -s, so the apostrophe goes after the -s: ${n}s'.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["brother", "My two ______ room is next to the {place}, {name}.", { place: ["kitchen", "bathroom", "stairs", "door"], name: NAME }],
  ["student", "All the ______ bags are in the {place} during the {event}.", { place: ["hall", "corridor", "cloakroom", "classroom"], event: ["exam", "test", "concert", "lesson"] }],
  ["doctor", "The two ______ office is on the {floor} floor, {name}.", { floor: FLOOR, name: NAME }],
  ["sister", "Both my ______ phones are on the {place}, {name}.", { place: ["table", "desk", "sofa", "shelf"], name: NAME }],
  ["player", "All the ______ shirts are {colour} this {time}.", { colour: COLOUR, time: ["season", "year", "month", "week"] }],
  ["cousin", "Our two ______ bikes are in the {place}, {name}.", { place: ["yard", "garage", "garden", "street"], name: NAME }],
  ["guest", "All the ______ coats are on the {place}, {name}.", { place: ["bed", "chairs", "sofa", "hooks"], name: NAME }],
  ["girl", "The three ______ bedroom is next to the {place}, {name}.", { place: ["bathroom", "kitchen", "stairs", "living room"], name: NAME }],
  ["friend", "All my ______ tickets are in my {thing}, {name}.", { thing: ["bag", "pocket", "wallet", "folder"], name: NAME }],
  ["nurse", "The two ______ uniforms are in the {place}, {name}.", { place: ["cupboard", "bag", "car", "locker room"], name: NAME }],
  ["pupil", "All the ______ answers were correct in the {subject} test, {name}.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  ["aunt", "My two ______ birthdays are in {month}, {name}.", { month: ["May", "June", "July", "March"], name: NAME }],
  ["worker", "The ten ______ desks are in the new {place}, {name}.", { place: ["office", "building", "room", "hall"], name: NAME }],
  ["kid", "All the ______ shoes are by the {place}, {name}.", { place: ["door", "stairs", "bed", "wall"], name: NAME }],
  ["singer", "The two ______ songs were the best at the {event}, {name}.", { event: ["concert", "party", "festival", "show"], name: NAME }],
  ["farmer", "Both ______ cows are in the {place} near {city}.", { place: ["field", "barn", "yard", "village"], city: CITY }],
  ["uncle", "My two ______ cars are {colour}, {name}.", { colour: ["white", "black", "blue", "grey"], name: NAME }],
  ["visitor", "All the ______ bags are by the {place} in the {building}.", { place: ["door", "desk", "window", "stairs"], building: ["museum", "hospital", "theatre", "library"] }],
  ["teacher", "The two ______ desks are near the {place}, {name}.", { place: ["window", "door", "board", "wall"], name: NAME }],
  ["driver", "All the ______ taxis are at the {place} now, {name}.", { place: ["station", "airport", "bus stop", "market"], name: NAME }],
].map(([n, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts(n), key: 0, why: why(n), slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the possessive form of the plural word in brackets.";
const BUILD = [
  ["teachers", "The ______ (teachers) room is on the {floor} floor, {name}.", { floor: FLOOR, name: NAME }],
  ["parents", "My ______ (parents) flat is near the {place} in {city}.", { place: ["park", "market", "station", "river"], city: CITY }],
  ["students", "The ______ (students) bags are in the {place}, {name}.", { place: ["hall", "corridor", "classroom", "library"], name: NAME }],
  ["classmates", "My ______ (classmates) dog is very {adj}, {name}.", { adj: ["friendly", "loud", "big", "old"], name: NAME }],
  ["players", "The ______ (players) shirts are {colour} this {time}.", { colour: COLOUR, time: ["season", "year", "month", "week"] }],
  ["sisters", "My ______ (sisters) room is next to the {place}, {name}.", { place: ["kitchen", "bathroom", "stairs", "door"], name: NAME }],
  ["girls", "The ______ (girls) team won the {event} in {city}.", { event: ["match", "game", "cup", "final"], city: CITY }],
  ["boys", "The ______ (boys) shoes are by the {place}, {name}.", { place: ["door", "stairs", "bed", "wall"], name: NAME }],
  ["workers", "All the ______ (workers) cars are in the {place} at {time}.", { place: ["yard", "street", "garage", "car park"], time: ["night", "lunchtime", "noon", "weekends"] }],
  ["cousins", "My ______ (cousins) house is in {city}, {name}.", { city: CITY, name: NAME }],
  ["guests", "The ______ (guests) coats are on the {place}, {name}.", { place: ["bed", "sofa", "chairs", "hooks"], name: NAME }],
  ["nurses", "The ______ (nurses) room is at the end of the {place}, {name}.", { place: ["corridor", "hall", "building", "ward"], name: NAME }],
  ["drivers", "The ______ (drivers) taxis are at the {place} now, {name}.", { place: ["station", "airport", "bus stop", "market"], name: NAME }],
  ["friends", "My ______ (friends) bikes are in the {place}, {name}.", { place: ["yard", "garage", "garden", "street"], name: NAME }],
  ["singers", "The ______ (singers) songs were great at the {event}, {name}.", { event: ["concert", "party", "festival", "show"], name: NAME }],
  ["farmers", "The ______ (farmers) melons are sweet this {time}, {name}.", { time: ["year", "summer", "season", "month"], name: NAME }],
  ["doctors", "The ______ (doctors) office is near the {place}, {name}.", { place: ["entrance", "lift", "stairs", "door"], name: NAME }],
  ["uncles", "My ______ (uncles) cars are {colour}, {name}.", { colour: ["white", "black", "blue", "grey"], name: NAME }],
  ["visitors", "The ______ (visitors) bags are by the {place} in the {building}.", { place: ["door", "desk", "window", "stairs"], building: ["museum", "hospital", "theatre", "library"] }],
  ["pupils", "The ______ (pupils) answers were correct in the {subject} test.", { subject: ["maths", "English", "history", "science"] }],
].map(([n, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: `${n}'`, why: `${n} is a plural ending in -s, so add only an apostrophe after the -s: ${n}'.`, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_OF = "Rewrite with a possessive (').";
const T_PL = "Now there is more than one owner. Write the plural possessive.";
const T_TWO = "Rewrite with two possessives (').";
const W = (n) => `${n} is a plural ending in -s, so the apostrophe goes after the -s: ${n}'.`;
const TRANSFORM = [
  [T_OF, "The room of the teachers is on the {floor} floor, {name}.", "The ______ room is on the {floor} floor, {name}.", "teachers'", W("teachers"), { floor: FLOOR, name: NAME }],
  [T_OF, "The bags of the students are in the {place}, {name}.", "The ______ bags are in the {place}, {name}.", "students'", W("students"), { place: ["hall", "corridor", "classroom", "library"], name: NAME }],
  [T_OF, "The dog of my classmates is very {adj}, {name}.", "My ______ dog is very {adj}, {name}.", "classmates'", W("classmates"), { adj: ["friendly", "loud", "big", "old"], name: NAME }],
  [T_OF, "The flat of my parents is near the {place} in {city}.", "My ______ flat is near the {place} in {city}.", "parents'", W("parents"), { place: ["park", "market", "station", "river"], city: CITY }],
  [T_OF, "The shirts of the players are {colour} this {time}.", "The ______ shirts are {colour} this {time}.", "players'", W("players"), { colour: COLOUR, time: ["season", "year", "month", "week"] }],
  [T_PL, "My brother's room is next to the {place}, {name}.", "My two ______ room is next to the {place}, {name}.", "brothers'", W("brothers"), { place: ["kitchen", "bathroom", "stairs", "door"], name: NAME }],
  [T_PL, "The girl's team won the {event} in {city}.", "The three ______ team won the {event} in {city}.", "girls'", W("girls"), { event: ["match", "game", "cup", "final"], city: CITY }],
  [T_PL, "My friend's bike is in the {place}, {name}.", "My two ______ bikes are in the {place}, {name}.", "friends'", W("friends"), { place: ["yard", "garage", "garden", "street"], name: NAME }],
  [T_PL, "The driver's taxi is at the {place} now, {name}.", "All the ______ taxis are at the {place} now, {name}.", "drivers'", W("drivers"), { place: ["station", "airport", "bus stop", "market"], name: NAME }],
  [T_PL, "The nurse's room is at the end of the {place}, {name}.", "The two ______ room is at the end of the {place}, {name}.", "nurses'", W("nurses"), { place: ["corridor", "hall", "building", "ward"], name: NAME }],
  [T_TWO, "The bikes of the boys and the bags of the girls are in the {place}, {name}.", "The ______ bikes and the ______ bags are in the {place}, {name}.", ["boys'", "girls'"], "Both owners are plurals ending in -s, so both take s'.", { place: ["hall", "yard", "corridor", "garage"], name: NAME }],
  [T_TWO, "The room of the teachers is next to the room of the students on the {floor} floor.", "The ______ room is next to the ______ room on the {floor} floor.", ["teachers'", "students'"], "Both owners are plurals ending in -s, so both take s'.", { floor: FLOOR }],
  [T_TWO, "The shirts of the players and the flags of the fans are {colour} this {time}.", "The ______ shirts and the ______ flags are {colour} this {time}.", ["players'", "fans'"], "Both owners are plurals ending in -s, so both take s'.", { colour: COLOUR, time: ["season", "year", "month", "week"] }],
  [T_TWO, "The dog of my classmates plays with the cat of my cousins in the {place}, {name}.", "My ______ dog plays with my ______ cat in the {place}, {name}.", ["classmates'", "cousins'"], "Both owners are plurals ending in -s, so both take s'.", { place: ["yard", "garden", "street", "park"], name: NAME }],
  [T_TWO, "The coats of the guests are on the beds of my sisters, {name}.", "The ______ coats are on my ______ beds, {name}.", ["guests'", "sisters'"], "Both owners are plurals ending in -s, so both take s'.", { name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about your parents' home.", "parents'", ["exactly one sentence", "must use parents'"]],
  ["Write one sentence about a room at your school. Use teachers' or students'.", "teachers' / students'", ["exactly one sentence", "plural possessive s'"]],
  ["Write one sentence about two of your friends and their things.", "friends'", ["exactly one sentence", "must use friends'"]],
  ["Write one sentence about a sports team. Use players'.", "players'", ["exactly one sentence", "must use players'"]],
  ["Write one sentence with a singular possessive ('s) and a plural possessive (s').", "'s / s'", ["exactly one sentence", "must use 's", "must use s'"]],
  ["Write one sentence about your cousins. Use cousins'.", "cousins'", ["exactly one sentence", "must use cousins'"]],
  ["Write one sentence about guests at a party. Use guests'.", "guests'", ["exactly one sentence", "must use guests'"]],
  ["Write two sentences about your brothers or sisters and their room.", "brothers' / sisters'", ["exactly two sentences", "plural possessive s'"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your school building. Whose rooms are where? Write three or four sentences.", "plural possessive", ["teachers'", "students'", "room"]],
  ["Describe a family party. Where are the guests' things? Write three or four sentences.", "plural possessive", ["guests'", "are on / are in", "parents'"]],
  ["Describe your favourite sports team. Write three or four sentences.", "plural possessive", ["players'", "fans'", "shirts"]],
  ["Describe your relatives' homes. Write three or four sentences.", "plural possessive", ["parents'", "cousins'", "lives / live"]],
  ["Describe a busy street. Write three or four sentences about people and their things.", "plural possessive", ["drivers'", "workers'", "s'"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/nouns-articles.possession.plural-possessive.json", JSON.stringify(items, null, 1) + "\n");