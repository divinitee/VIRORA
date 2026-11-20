// Hand-authored: adj-adv / adverb-form / adverb-vs-adjective-sense (B1).
// Wave C, C34 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item): some -ly words are NOT the adverb of the word they
// look like: lately = recently (late = not on time), hardly = almost not (hard = with
// effort), nearly = almost (near = close to), highly = very / very well (high = up).
// Triage: kept. A2 irregular-adverb keys hard / late (hardly / lately only as wrong
// answers); here the -ly meanings are keyed too. Options never include a form that
// could also be right (later, harder, nearer, higher are left out of plain-word sets).
// Choose: lately 3, late 2, hardly 4, hard 2, nearly 3, near 2, highly 2, high 2.
// Build: the word in brackets or its -ly form.
// Transform: 5 recently → lately / 5 almost → nearly / 5 almost no(t) → hardly.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/adj-adv.adverb-form.adverb-vs-adjective-sense.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "adverb-form", topic: "adverb-vs-adjective-sense", level: "B1", pv: "2.5" };
const NAME = ["Sherzod", "Feruza", "Akmal", "Dilnoza"];
const NAME2 = ["Otabek", "Zarina", "Ulugbek", "Gulnora"];
const SET = {
  lately: ["lately", "late", "later", "latest"], late: ["late", "lately", "latest", "lated"],
  hardly: ["hardly", "hard", "harder", "hardest"], hard: ["hard", "hardly", "hardest", "hardness"],
  nearly: ["nearly", "near", "nearer", "nearest"], near: ["near", "nearly", "nearness", "neared"],
  highly: ["highly", "high", "higher", "height"], high: ["high", "highly", "height", "highness"],
};
const MEAN = { lately: "lately = recently", late: "late = not on time / at a late hour", hardly: "hardly = almost not", hard: "hard = with a lot of effort", nearly: "nearly = almost", near: "near = close to (a place)", highly: "highly = very / very well", high: "high = far up" };

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["lately", "I haven't seen {who} much ______. Is everything OK, {name}?", { who: ["Timur", "your brother", "the neighbours", "your cousin"], name: NAME }, "\"haven't … much\" + a recent period"],
  ["lately", "Have you read any good {thing} ______, {name}?", { thing: ["books", "articles", "stories", "comics"], name: NAME2 }, "a question about the recent past"],
  ["lately", "Prices at the {place} have gone up a lot ______.", { place: ["bazaar", "supermarket", "café", "petrol station"], x: [] }, "\"have gone up\" in the recent past"],
  ["late", "The {bus} came twenty minutes ______, so I missed the lesson, {name}.", { bus: ["bus", "train", "metro", "taxi"], name: NAME }, "twenty minutes after the right time"],
  ["late", "We stayed up ______ to watch the {match}, {name}.", { match: ["final", "match", "film", "fireworks"], name: NAME2 }, "until a late hour"],
  ["hardly", "I can ______ hear you. Please speak louder, {name}.", { name: NAME, x: [] }, "\"speak louder\" = I almost can't hear"],
  ["hardly", "There was ______ any food left at the {event}, {name}.", { event: ["wedding", "party", "picnic", "dinner"], name: NAME2 }, "\"any food left\" = almost no food"],
  ["hardly", "My grandpa ______ ever uses his {thing}.", { thing: ["phone", "computer", "car", "bike"], x: [] }, "\"ever\" = almost never"],
  ["hardly", "I was so tired that I could ______ walk after the {event}.", { event: ["match", "race", "hike", "wedding"], x: [] }, "so tired = almost couldn't walk"],
  ["hard", "My sister studies very ______ for her {test}, {name}.", { test: ["exams", "tests", "IELTS", "finals"], name: NAME }, "\"very\" + with a lot of effort"],
  ["hard", "It rained ______ all night in {city}.", { city: ["Tashkent", "Fergana", "London", "Moscow"], x: [] }, "heavy rain = rained hard"],
  ["nearly", "I ______ fell off my {bike} on the ice, {name}.", { bike: ["bike", "scooter", "horse", "skateboard"], name: NAME2 }, "almost fell, but didn't"],
  ["nearly", "We ______ missed the {bus}. We ran the last hundred metres!", { bus: ["bus", "train", "plane", "start"], x: [] }, "almost missed it"],
  ["nearly", "I've ______ finished my {work}, {name}. Just one page left.", { work: ["essay", "homework", "report", "book"], name: NAME }, "\"Just one page left\" = almost finished"],
  ["near", "We live ______ the {place}, so we walk there every day.", { place: ["park", "school", "bazaar", "river"], x: [] }, "close to the park"],
  ["near", "Is there a pharmacy ______ here, {name}?", { name: NAME2, x: [] }, "close to this place"],
  ["highly", "This {place} is ______ recommended by the guidebook, {name}.", { place: ["restaurant", "hotel", "museum", "café"], name: NAME }, "very strongly recommended"],
  ["highly", "Our new {who} is a ______ paid engineer.", { who: ["neighbour", "uncle", "cousin", "friend"], x: [] }, "paid very well"],
  ["high", "The plane flew very ______ over the {sight}.", { sight: ["mountains", "clouds", "sea", "desert"], x: [] }, "far up in the sky"],
  ["high", "My cousin can jump really ______, {name}. He plays basketball.", { name: NAME2, x: [] }, "far up"],
].map(([k, prompt, slots, cue], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  if (Object.keys(s).length < 2 && !prompt.includes("{name}")) s.name = NAME;
  let p = s.name && !prompt.includes("{name}") ? prompt.replace(/\.$/, ", {name}.") : prompt;
  if (Object.keys(s).length < 2) { s.place = ["at the moment", "these days", "in this town", "this year"]; }
  if (s.place && !p.includes("{place}")) delete s.place;
  const o = SET[k];
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(k), why: `${cue}: ${MEAN[k]}.`, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Use the word in brackets or its -ly form.";
const BUILD = [
  ["lately", "late", "I've been very busy ______ (late), {name}. Sorry I didn't call.", { name: NAME, x: [] }, `"busy … sorry I didn't call" is about the recent past`],
  ["late", "late", "The {who} arrived ______ (late) again this morning.", { who: ["teacher", "bus", "doctor", "plumber"], x: [] }, "the teacher came after the right time"],
  ["lately", "late", "Has the weather in {city} been cold ______ (late), {name}?", { city: ["Tashkent", "Moscow", "Samarkand", "Almaty"], name: NAME2 }, "a question about recent weather"],
  ["late", "late", "Don't stay out ______ (late) tonight, {name}. You have the {test} tomorrow.", { name: NAME, test: ["exam", "match", "interview", "trip"] }, "staying out until a late hour"],
  ["hardly", "hard", "I ______ (hard) know anyone at the {event}, {name}.", { event: ["party", "wedding", "conference", "new school"], name: NAME2 }, "I almost don't know anyone there"],
  ["hard", "hard", "The builders worked ______ (hard) all day on the {thing}.", { thing: ["roof", "bridge", "road", "house"], x: [] }, "they worked with a lot of effort"],
  ["hardly", "hard", "There's ______ (hard) any milk in the fridge, {name}.", { name: NAME, x: [] }, "there is almost no milk"],
  ["hardly", "hard", "My little brother ______ (hard) ever eats {food}, {name}.", { food: ["vegetables", "fish", "soup", "fruit"], name: NAME2 }, `"ever" here means almost never`],
  ["hard", "hard", "Try ______ (hard) and you will pass the {test}, {name}.", { test: ["exam", "test", "interview", "driving test"], name: NAME }, "try with a lot of effort"],
  ["nearly", "near", "I ______ (near) forgot your birthday, {name}!", { name: NAME2, x: [] }, "I almost forgot, but didn't"],
  ["near", "near", "Our hotel was ______ (near) the {sight} in {city}.", { sight: ["old town", "beach", "station", "bazaar"], city: ["Bukhara", "Istanbul", "Khiva", "Samarkand"] }, "the hotel was close to the place"],
  ["nearly", "near", "The {thing} costs ______ (near) a million sum, {name}.", { thing: ["bike", "phone", "carpet", "laptop"], name: NAME }, "the price is almost a million"],
  ["nearly", "near", "We ______ (near) won the {match}, {name}. We lost 2–3.", { match: ["final", "match", "game", "cup"], name: NAME2 }, "2–3 means we almost won"],
  ["near", "near", "Don't park ______ (near) the {place}, {name}.", { place: ["gate", "school", "hospital", "corner"], name: NAME }, "don"t park close to that place"],
  ["highly", "high", "Dr Karimova is a ______ (high) respected {job}.", { job: ["doctor", "teacher", "surgeon", "scientist"], x: [] }, "people respect the doctor very much"],
  ["high", "high", "The kite flew ______ (high) above the {place}, {name}.", { place: ["park", "field", "beach", "roofs"], name: NAME2 }, "the kite was far up in the sky"],
  ["highly", "high", "I ______ (high) recommend this {thing}, {name}.", { thing: ["book", "film", "café", "teacher"], name: NAME }, "I recommend it very strongly"],
  ["lately", "late", "My {who} hasn't been well ______ (late), {name}.", { who: ["grandma", "uncle", "neighbour", "cat"], name: NAME2 }, `"hasn't been well" in the recent past`],
  ["hard", "hard", "It's snowing ______ (hard) in the {place} today, {name}.", { place: ["mountains", "north", "city", "village"], name: NAME }, "heavy snow falls hard"],
  ["nearly", "near", "The {work} is ______ (near) ready, {name}. Give me five minutes.", { work: ["dinner", "report", "car", "cake"], name: NAME2 }, "five more minutes means almost ready"],
].map(([key, cue, source, slots, clue]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  if (Object.keys(s).length < 2 && !source.includes("{name}")) s.name = NAME2;
  const src = s.name && !source.includes("{name}") ? source.replace(/\.$/, ", {name}.") : source;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why: `${clue[0].toUpperCase()+clue.slice(1)}: ${MEAN[key]}.`, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REC = "Rewrite with lately instead of recently.";
const ALM = "Rewrite with nearly instead of almost.";
const NOT = "Rewrite with hardly.";
const TRANSFORM = [
  [REC, "I haven't slept well recently, {name}.", "I haven't slept well ______, {name}.", "lately", { name: NAME, x: [] }, "Lately means recently: same meaning, same place."],
  [REC, "Have you been to the {place} recently, {name}?", "Have you been to the {place} ______, {name}?", "lately", { place: ["cinema", "gym", "bazaar", "theatre"], name: NAME2 }, "Lately means recently: same meaning, same place."],
  [REC, "My dad has been very busy at the {place} recently.", "My dad has been very busy at the {place} ______.", "lately", { place: ["office", "factory", "hospital", "shop"], x: [] }, "Lately means recently: same meaning, same place."],
  [REC, "It has rained a lot in {city} recently, {name}.", "It has rained a lot in {city} ______, {name}.", "lately", { city: ["Tashkent", "London", "Fergana", "Moscow"], name: NAME }, "Lately means recently: same meaning, same place."],
  [REC, "What {thing} have you watched recently, {name}?", "What {thing} have you watched ______, {name}?", "lately", { thing: ["films", "series", "matches", "shows"], name: NAME2 }, "Lately means recently: same meaning, same place."],
  [ALM, "I almost missed the {bus} this morning, {name}.", "I ______ missed the {bus} this morning, {name}.", "nearly", { bus: ["bus", "train", "metro", "lesson"], name: NAME }, "Nearly means almost: put it where almost was."],
  [ALM, "We almost lost the {match}, {name}.", "We ______ lost the {match}, {name}.", "nearly", { match: ["final", "match", "game", "race"], name: NAME2 }, "Nearly means almost: put it where almost was."],
  [ALM, "The {thing} is almost ready, {name}.", "The {thing} is ______ ready, {name}.", "nearly", { thing: ["dinner", "cake", "car", "report"], name: NAME }, "Nearly means almost: put it where almost was."],
  [ALM, "My grandma is almost ninety, {name}. She still cooks {food}!", "My grandma is ______ ninety, {name}. She still cooks {food}!", "nearly", { name: NAME2, food: ["plov", "manti", "bread", "soup"] }, "Nearly means almost: put it where almost was."],
  [ALM, "I almost fell on the ice in the {place}, {name}.", "I ______ fell on the ice in the {place}, {name}.", "nearly", { place: ["street", "yard", "park", "car park"], name: NAME }, "Nearly means almost: put it where almost was."],
  [NOT, "I almost can't hear you. The music in the {place} is loud, {name}.", "I can ______ hear you. The music in the {place} is loud, {name}.", "hardly", { place: ["café", "club", "car", "hall"], name: NAME2 }, "almost can't hear → can hardly hear."],
  [NOT, "There was almost no food at the {event}, {name}.", "There was ______ any food at the {event}, {name}.", "hardly", { event: ["party", "wedding", "picnic", "meeting"], name: NAME }, "almost no food → hardly any food."],
  [NOT, "My uncle almost never visits {city}, {name}.", "My uncle ______ ever visits {city}, {name}.", "hardly", { city: ["Tashkent", "Samarkand", "Moscow", "Bukhara"], name: NAME2 }, "almost never visits → hardly ever visits."],
  [NOT, "I almost didn't sleep before the {test}, {name}.", "I ______ slept before the {test}, {name}.", "hardly", { test: ["exam", "interview", "match", "flight"], name: NAME }, "almost didn't sleep → hardly slept."],
  [NOT, "Almost nobody came to the {event}, {name}.", "______ anybody came to the {event}, {name}.", "Hardly", { event: ["meeting", "concert", "lesson", "party"], name: NAME2 }, "almost nobody came → hardly anybody came."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with lately.", "… lately", ["exactly one sentence", "lately = recently", "present perfect"]],
  ["Write one sentence with hardly.", "I can hardly … / hardly ever …", ["exactly one sentence", "hardly = almost not", "a verb"]],
  ["Write one sentence with nearly.", "I nearly …", ["exactly one sentence", "nearly = almost", "past"]],
  ["Write one sentence with hard and one with hardly.", "hard vs hardly", ["exactly two sentences", "hard = with effort", "hardly = almost not"]],
  ["Write one sentence with late and one with lately.", "late vs lately", ["exactly two sentences", "late = not on time", "lately = recently"]],
  ["Write one sentence with near and one with nearly.", "near vs nearly", ["exactly two sentences", "near = close to", "nearly = almost"]],
  ["Write one sentence with highly recommend.", "I highly recommend …", ["exactly one sentence", "highly", "recommend"]],
  ["Write one sentence with hardly ever.", "… hardly ever …", ["exactly one sentence", "hardly ever", "a habit"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your week. What have you done lately? What did you hardly do? Write three or four sentences.", "lately / hardly", ["lately", "hardly", "three or four sentences"]],
  ["Tell a story (three or four sentences) about a day when you nearly missed something important.", "nearly / late", ["nearly", "late", "three or four sentences"]],
  ["Describe a hard-working person you know. Write three or four sentences with hard and hardly.", "hard vs hardly", ["hard", "hardly", "three or four sentences"]],
  ["Write a short review (three or four sentences) of a place you highly recommend.", "highly", ["highly", "near", "three or four sentences"]],
  ["Write three or four sentences about how your town has changed lately.", "lately", ["lately", "nearly / hardly", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.adverb-form.adverb-vs-adjective-sense.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
