// Hand-authored: adj-adv / order-position / adverb-of-manner-position (B1).
// Wave C, C36 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item: she / the letter / read / carefully): an adverb of
// manner does not go between the verb and its object. verb + object + adverb.
// One right answer: "She carefully read the letter" is also English, so every gap
// starts AFTER the verb: the only right order there is object + adverb.
// Choose: options are object + adverb / adverb + object / the adverb inside the
// object (two places). Objects are three words, so the wrong orders are clearly wrong.
// No adjective-form distractors (drive slow, sing loud are said by native speakers).
// Build: two gaps (array key), the two parts in brackets in mixed order.
// Transform: 10 correct the order / 5 her English is perfect → she speaks English
// perfectly. All array keys.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/adj-adv.order-position.adverb-of-manner-position.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "order-position", topic: "adverb-of-manner-position", level: "B1", pv: "2.5" };
const NAME = ["Gulnora", "Sardor", "Feruza", "Akmal"];
const NAME2 = ["Zarina", "Jamshid", "Malika", "Otabek"];
const OPTS = ([d, a, n], adv) => [`${d} ${a} ${n} ${adv}`, `${adv} ${d} ${a} ${n}`, `${d} ${adv} ${a} ${n}`, `${d} ${a} ${adv} ${n}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [["the", "long", "letter"], "carefully", "{who} read ______ before she signed it, {name}.", { who: ["My mum", "The manager", "My aunt", "The teacher"], name: NAME }, "She checked every word: read + the long letter + carefully."],
  [["the", "front", "door"], "gently", "Dad closed ______ because the {baby} was asleep.", { baby: ["baby", "puppy", "little boy", "little girl"], name: NAME2 }, "No noise for the baby: closed + the front door + gently."],
  [["the", "old", "piano"], "beautifully", "My {who} plays ______, {name}.", { who: ["sister", "grandpa", "teacher", "cousin"], name: NAME }, "Object first, then how: plays + the old piano + beautifully."],
  [["his", "new", "car"], "carefully", "My {who} drives ______ in the snow, {name}.", { who: ["dad", "uncle", "grandpa", "brother"], name: NAME2 }, "Snow means care: drives + his new car + carefully."],
  [["the", "whole", "form"], "neatly", "Please fill in ______ before the {test}, {name}.", { test: ["interview", "exam", "trip", "match"], name: NAME }, "fill in + the whole form + neatly; neatly never splits verb and object."],
  [["the", "last", "question"], "politely", "The {who} answered ______, {name}.", { who: ["waiter", "student", "guide", "nurse"], name: NAME2 }, "answered + the last question + politely."],
  [["the", "glass", "box"], "gently", "Put ______ on the {table}. It breaks easily, {name}.", { table: ["table", "shelf", "desk", "floor"], name: NAME }, "It breaks easily: put + the glass box + gently."],
  [["the", "new", "song"], "loudly", "The {kids} sang ______ in the car.", { kids: ["children", "boys", "girls", "fans"], name: NAME2 }, "sang + the new song + loudly; the place (in the car) comes after."],
  [["the", "heavy", "bags"], "slowly", "Grandpa carried ______ up the {stairs}.", { stairs: ["stairs", "hill", "street", "path"], name: NAME }, "carried + the heavy bags + slowly, then where (up the stairs)."],
  [["her", "little", "brother"], "patiently", "{who} helped ______ with his maths, {name}.", { who: ["My sister", "Grandma", "Mum", "Our neighbour"], name: NAME2 }, "helped + her little brother + patiently."],
  [["the", "dirty", "plates"], "quickly", "We washed ______ after the {event}.", { event: ["party", "dinner", "wedding", "picnic"], name: NAME }, "washed + the dirty plates + quickly."],
  [["the", "old", "photos"], "proudly", "Grandma showed us ______ from her {time}.", { time: ["wedding", "school days", "trip to Moscow", "first job"], name: NAME2 }, "showed us + the old photos + proudly."],
  [["the", "whole", "story"], "clearly", "The {who} explained ______, so we understood, {name}.", { who: ["teacher", "guide", "doctor", "coach"], name: NAME }, "We understood: explained + the whole story + clearly."],
  [["the", "tiny", "kitten"], "gently", "The {kid} held ______ in her arms.", { kid: ["girl", "vet", "nurse", "woman"], name: NAME2 }, "held + the tiny kitten + gently, then where (in her arms)."],
  [["the", "new", "rules"], "angrily", "The {fans} discussed ______ after the meeting.", { fans: ["players", "parents", "workers", "students"], name: NAME }, "discussed + the new rules + angrily."],
  [["the", "broken", "glass"], "carefully", "Dad picked up ______ from the {floor}.", { floor: ["floor", "carpet", "kitchen floor", "path"], name: NAME2 }, "Broken glass needs care: picked up + the broken glass + carefully."],
  [["the", "old", "man"], "kindly", "The {who} helped ______ across the street.", { who: ["boy", "student", "driver", "woman"], name: NAME }, "helped + the old man + kindly, then across the street."],
  [["the", "whole", "cake"], "greedily", "The {kids} ate ______ in five minutes!", { kids: ["children", "boys", "guests", "twins"], name: NAME2 }, "ate + the whole cake + greedily."],
  [["the", "school", "rules"], "strictly", "Our {who} follows ______.", { who: ["head teacher", "new student", "class captain", "coach"], name: NAME }, "follows + the school rules + strictly."],
  [["the", "heavy", "table"], "carefully", "Two {men} moved ______ into the {room}.", { men: ["men", "boys", "workers", "students"], room: ["hall", "kitchen", "garden", "office"] }, "moved + the heavy table + carefully, then into the room."],
].map(([obj, adv, prompt, slots, why], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  let p = prompt;
  if (Object.keys(s).length < 2) { s.name = slots.name; p = p.replace(/([.!])$/, ", {name}$1"); }
  const o = OPTS(obj, adv);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill, two gaps ---------------- */
const INSTR = "Put the two parts in brackets in the gaps, in the right order.";
const BUILD = [
  [["the contract", "slowly"], "The {who} read ______ ______ (slowly / the contract) before she signed it, {name}.", { who: ["manager", "lawyer", "director", "teacher"], name: NAME }, "Object, then how: the contract slowly."],
  [["English", "very well"], "My {who} speaks ______ ______ (very well / English), {name}.", { who: ["cousin", "teacher", "boss", "neighbour"], name: NAME2 }, "speaks + English + very well, never \"speaks very well English\"."],
  [["the window", "quietly"], "The {who} opened ______ ______ (the window / quietly) at night, {name}.", { who: ["cat", "old man", "nurse", "boy"], name: NAME }, "opened + the window + quietly."],
  [["the guitar", "badly"], "My {who} plays ______ ______ (badly / the guitar), but he loves it, {name}.", { who: ["brother", "uncle", "dad", "neighbour"], name: NAME2 }, "plays + the guitar + badly."],
  [["the soup", "slowly"], "{who} ate ______ ______ (the soup / slowly) because it was hot, {name}.", { who: ["Grandpa", "My son", "The baby", "Dad"], name: NAME }, "ate + the soup + slowly."],
  [["the glasses", "carefully"], "Please wash ______ ______ (carefully / the glasses). They are my {who}'s best ones, {name}.", { who: ["mum", "grandma", "aunt", "wife"], name: NAME2 }, "wash + the glasses + carefully."],
  [["Russian", "fluently"], "Our new {who} speaks ______ ______ (fluently / Russian), {name}.", { who: ["teacher", "doctor", "manager", "neighbour"], name: NAME }, "speaks + Russian + fluently."],
  [["the baby", "gently"], "The {who} held ______ ______ (gently / the baby) in her arms, {name}.", { who: ["nurse", "grandmother", "young mum", "doctor"], name: NAME2 }, "held + the baby + gently, then in her arms."],
  [["the room", "quickly"], "The children tidied ______ ______ (the room / quickly) before the {who} came home, {name}.", { who: ["parents", "guests", "teacher", "grandparents"], name: NAME }, "tidied + the room + quickly."],
  [["the plan", "clearly"], "The {who} explained ______ ______ (clearly / the plan) to everyone, {name}.", { who: ["coach", "manager", "teacher", "captain"], name: NAME2 }, "explained + the plan + clearly."],
  [["the ball", "hard"], "My {who} kicked ______ ______ (hard / the ball) and broke a window, {name}.", { who: ["brother", "son", "cousin", "neighbour's son"], name: NAME }, "kicked + the ball + hard (hard is an adverb too)."],
  [["the news", "calmly"], "{who} told us ______ ______ (calmly / the news), but we were shocked, {name}.", { who: ["Mum", "The doctor", "Our teacher", "Dad"], name: NAME2 }, "told us + the news + calmly."],
  [["the bill", "quickly"], "The {who} paid ______ ______ (the bill / quickly) and left the café, {name}.", { who: ["man", "tourists", "couple", "students"], name: NAME }, "paid + the bill + quickly."],
  [["the cake", "beautifully"], "My {who} decorated ______ ______ (beautifully / the cake) for the wedding, {name}.", { who: ["aunt", "sister", "mum", "cousin"], name: NAME2 }, "decorated + the cake + beautifully."],
  [["his name", "neatly"], "The {kid} wrote ______ ______ (his name / neatly) on the first page, {name}.", { kid: ["boy", "student", "little boy", "new pupil"], name: NAME }, "wrote + his name + neatly."],
  [["the instructions", "carefully"], "Follow ______ ______ (carefully / the instructions), or the {thing} won't work, {name}.", { thing: ["printer", "game", "app", "machine"], name: NAME2 }, "follow + the instructions + carefully."],
  [["the door", "loudly"], "Someone knocked on ______ ______ (loudly / the door) at {time}, {name}.", { time: ["midnight", "six in the morning", "dinner time", "two o'clock"], name: NAME }, "knocked on + the door + loudly."],
  [["the money", "fairly"], "Dad shared ______ ______ (the money / fairly) between the {kids}, {name}.", { kids: ["children", "twins", "three boys", "girls"], name: NAME2 }, "shared + the money + fairly."],
  [["the bus", "easily"], "We caught ______ ______ (easily / the bus) because it was late, {name}. We usually miss it on {day}.", { name: NAME, day: ["Mondays", "Fridays", "rainy days", "weekdays"] }, "caught + the bus + easily."],
  [["the poem", "perfectly"], "The {kid} said ______ ______ (the poem / perfectly) at the school concert, {name}.", { kid: ["girl", "boy", "little girl", "new student"], name: NAME2 }, "said + the poem + perfectly."],
].map(([key, source, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, two gaps ---------------- */
const FIX = "Correct the word order. Write one part in each gap.";
const ADV = "Rewrite with a verb and an -ly adverb. Write one part in each gap.";
const TRANSFORM = [
  [FIX, "She speaks very well English, {name}. She lived in {city}.", "She speaks ______ ______, {name}. She lived in {city}.", ["English", "very well"], { name: NAME, city: ["London", "Sydney", "Toronto", "Dublin"] }, "Object, then how: English very well."],
  [FIX, "My {who} drives carefully her car, {name}.", "My {who} drives ______ ______, {name}.", ["her car", "carefully"], { who: ["mum", "aunt", "sister", "grandma"], name: NAME2 }, "drives + her car + carefully."],
  [FIX, "He opened slowly the box, {name}. There was a puppy inside!", "He opened ______ ______, {name}. There was a puppy inside!", ["the box", "slowly"], { name: NAME, x: [] }, "opened + the box + slowly."],
  [FIX, "The {who} explained clearly the rules, {name}.", "The {who} explained ______ ______, {name}.", ["the rules", "clearly"], { who: ["teacher", "coach", "referee", "guide"], name: NAME2 }, "explained + the rules + clearly."],
  [FIX, "Please close quietly the door. The {baby} is asleep, {name}.", "Please close ______ ______. The {baby} is asleep, {name}.", ["the door", "quietly"], { baby: ["baby", "puppy", "patient", "little one"], name: NAME }, "close + the door + quietly."],
  [FIX, "My {who} plays beautifully the violin, {name}.", "My {who} plays ______ ______, {name}.", ["the violin", "beautifully"], { who: ["sister", "cousin", "aunt", "teacher"], name: NAME2 }, "plays + the violin + beautifully."],
  [FIX, "We ate quickly our lunch before the {event}, {name}.", "We ate ______ ______ before the {event}, {name}.", ["our lunch", "quickly"], { event: ["lesson", "match", "meeting", "exam"], name: NAME }, "ate + our lunch + quickly."],
  [FIX, "The {kid} answered politely the question, {name}.", "The {kid} answered ______ ______, {name}.", ["the question", "politely"], { kid: ["boy", "girl", "student", "waiter"], name: NAME2 }, "answered + the question + politely."],
  [FIX, "Grandma held gently the bird in her hands, {name}.", "Grandma held ______ ______ in her hands, {name}.", ["the bird", "gently"], { name: NAME, place: [] }, "held + the bird + gently, then in her hands."],
  [FIX, "Read carefully the instructions for the {thing}, {name}.", "Read ______ ______ for the {thing}, {name}.", ["the instructions", "carefully"], { thing: ["printer", "medicine", "game", "test"], name: NAME2 }, "read + the instructions + carefully."],
  [ADV, "Her English is perfect, {name}. She went to school in {city}.", "She speaks ______ ______, {name}. She went to school in {city}.", ["English", "perfectly"], { name: NAME, city: ["London", "Sydney", "Toronto", "Dublin"] }, "perfect English → speaks English perfectly."],
  [ADV, "His Russian is fluent. He grew up in {city}, {name}.", "He speaks ______ ______. He grew up in {city}, {name}.", ["Russian", "fluently"], { city: ["Moscow", "Kazan", "Minsk", "Almaty"], name: NAME2 }, "fluent Russian → speaks Russian fluently."],
  [ADV, "Her piano playing is beautiful, {name}. She practises every {time}.", "She plays ______ ______, {name}. She practises every {time}.", ["the piano", "beautifully"], { name: NAME, time: ["day", "evening", "morning", "weekend"] }, "beautiful playing → plays the piano beautifully."],
  [ADV, "Their football was terrible in the {match}, {name}.", "They played ______ ______ in the {match}, {name}.", ["football", "terribly"], { match: ["final", "first game", "cup match", "last match"], name: NAME2 }, "terrible football → played football terribly."],
  [ADV, "Her French is good, {name}. She studied in {city} for a year.", "She speaks ______ ______, {name}. She studied in {city} for a year.", ["French", "well"], { name: NAME, city: ["Paris", "Lyon", "Geneva", "Brussels"] }, "good French → speaks French well (the adverb of good is well)."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && (source + hint).includes(`{${n}}`)) s[n] = f;
  let src = source, h = hint;
  if (Object.keys(s).length < 2) {
    s.time = ["yesterday", "this morning", "last night", "on Sunday"];
    src = src.replace(/, \{name\}\./, " {time}, {name}."); h = h.replace(/, \{name\}\./, " {time}, {name}.");
  }
  return { ...BASE, stage: "transform", format: "rewrite", instr, source: src, hint: h, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence: verb + object + carefully.", "… read the letter carefully", ["exactly one sentence", "object before the adverb", "carefully"]],
  ["Write one sentence about a language someone speaks well.", "… speaks English well", ["exactly one sentence", "speaks + language + well", "a person"]],
  ["Write one sentence with an object and quickly.", "… did the homework quickly", ["exactly one sentence", "object before quickly", "past"]],
  ["Write one sentence with an object, an -ly adverb and a place.", "… put the box gently on the table", ["exactly one sentence", "object + adverb + place", "-ly adverb"]],
  ["Write one sentence about how someone plays an instrument or a sport.", "… plays the guitar badly", ["exactly one sentence", "plays + object + adverb", "a person"]],
  ["Write one sentence with an object and politely.", "… answered the question politely", ["exactly one sentence", "object before politely", "a person"]],
  ["Write one sentence with an object and slowly.", "… opened the door slowly", ["exactly one sentence", "object before slowly", "past"]],
  ["Write one sentence with an object and clearly.", "… explained the rules clearly", ["exactly one sentence", "object before clearly", "a person"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe how someone in your family cooks a special dish. Write three or four sentences.", "verb + object + adverb", ["object before the adverb", "-ly adverbs", "three or four sentences"]],
  ["Describe a good teacher or coach. How do they explain things? Write three or four sentences.", "verb + object + adverb", ["explains + object + clearly", "-ly adverbs", "three or four sentences"]],
  ["Write three or four sentences about the languages people in your family speak, and how well.", "speaks + language + adverb", ["speaks English well", "fluently", "three or four sentences"]],
  ["Write three or four sentences about how you got ready for school or work this morning.", "verb + object + adverb", ["object before the adverb", "past", "three or four sentences"]],
  ["Describe a match or a concert you saw. How did people play or sing? Write three or four sentences.", "played + object + adverb", ["object before the adverb", "-ly adverbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.order-position.adverb-of-manner-position.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
