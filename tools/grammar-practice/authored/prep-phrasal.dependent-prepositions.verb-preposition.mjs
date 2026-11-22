// Hand-authored: prep-phrasal / dependent-prepositions / verb-preposition (B1).
// Wave C, C41 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement items: "depends ______ the weather" → on; "We need to
// discuss about the timetable" → discuss the timetable): many verbs take a fixed
// preposition before their object (depend on, wait for, listen to, belong to), and
// some common verbs take NO preposition (discuss, enter, marry, reach, contact).
// One right answer: only verb + object pairs with ONE standard preposition. Left out:
// agree to/on, listen for, wait on, apply to, consist in, suffer with, ask about,
// laugh about, smile on, look at/for, talk to/with, think of/about, translate to/into,
// call, attend, enter into, answer to, pay + person. A distractor is never a
// preposition some speakers use with that verb and object.
// Choose: 14 verb + preposition / 6 no preposition; the gap is verb + (preposition).
// Build: 20 typed prepositions (no key word printed elsewhere in the line).
// Transform: 5 correct the mistake / 10 rewrite with the verb in brackets (incl.
// "Who does this bag belong to?").
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.dependent-prepositions.verb-preposition.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "dependent-prepositions", topic: "verb-preposition", level: "B1", pv: "2.5" };
const NAME = ["Nodira", "Akmal", "Gulnora", "Ulugbek"];
const NAME2 = ["Sardor", "Zarina", "Otabek", "Malika"];

const fill = (text, slots, fallback) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && text.includes(`{${n}}`)) s[n] = f;
  if (text.includes("{name}") && !s.name) s.name = fallback;
  return s;
};

const ALT = (key, text) => key === "on" && /depend|rely/.test(text) ? ["upon"] : key === "from" && /suffer/.test(text) ? ["with"] : key === "to" && /happened/.test(text) ? ["with"] : null;

/* ---------------- choose: 20 mcq ---------------- */
// [options (key first), prompt, slots, why]
const CHOOSE = [
  [["depends on", "depends of", "depends from", "depends"], "Whether we go to the {place} or not ______ the weather, {name}.", { place: ["mountains", "lake", "beach", "zoo"] }, "depend on: it depends on the weather."],
  [["discuss", "discuss about", "discuss on", "discuss of"], "We need to ______ the new {thing} at the meeting, {name}.", { thing: ["timetable", "rules", "prices", "menu"] }, "discuss takes its object straight away: discuss the timetable, no preposition."],
  [["listening to", "listening", "listening on", "listening of"], "My grandpa is ______ the old {music} on the radio.", { music: ["songs", "music", "news", "concert"] }, "listen to + what you hear."],
  [["waiting for", "waiting", "waiting to", "waiting of"], "We've been ______ the {bus} for twenty minutes, {name}.", { bus: ["bus", "taxi", "doctor", "plumber"] }, "wait for + the person or thing you expect."],
  [["entered", "entered in", "entered to", "entered at"], "Everyone stood up when the {who} ______ the room.", { who: ["teacher", "director", "bride", "judge"] }, "enter takes its object straight away: entered the room."],
  [["belongs to", "belongs", "belongs of", "belongs for"], "This {thing} ______ my sister, {name}. Please don't take it.", { thing: ["bag", "phone", "scarf", "laptop"] }, "belong to + the owner."],
  [["agree with", "agree", "agree at", "agree of"], "I ______ you, {name}. The {thing} is too expensive.", { thing: ["hotel", "car", "flat", "phone"] }, "agree with + a person."],
  [["married", "married with", "married to", "married on"], "My cousin ______ a teacher from {city} last summer.", { city: ["Bukhara", "Namangan", "Khiva", "Termez"] }, "marry takes its object straight away: she married a teacher."],
  [["pay for", "pay", "pay of", "pay on"], "Can I ______ the {food} with a card, {name}?", { food: ["food", "drinks", "cake", "pizza"] }, "pay for + the thing you buy."],
  [["asked for", "asked", "asked of", "asked on"], "We ______ the bill after dinner at the {place}.", { place: ["café", "restaurant", "chaikhana", "hotel"] }, "ask for + the thing you want."],
  [["reached", "reached at", "reached in", "reached on"], "We finally ______ {city} at midnight, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Nukus"] }, "reach takes its object straight away: reached Samarkand."],
  [["consists of", "consists from", "consists with", "consists"], "The test ______ three parts: {parts}.", { parts: ["reading, writing and speaking", "grammar, words and listening", "maths, English and history", "two essays and an interview"] }, "consist of + the parts."],
  [["laughed at", "laughed", "laughed on", "laughed to"], "Everybody ______ my funny {thing}, {name}.", { thing: ["hat", "photo", "story", "dance"] }, "laugh at + the thing that is funny."],
  [["contact", "contact with", "contact to", "contact at"], "Please ______ the {who} if you have any questions.", { who: ["teacher", "office", "manager", "hotel"] }, "contact takes its object straight away: contact the teacher."],
  [["rely on", "rely of", "rely to", "rely"], "You can always ______ your {who}, {name}.", { who: ["family", "best friend", "neighbours", "brother"] }, "rely on + the person you trust."],
  [["search for", "search of", "search on", "search to"], "We had to ______ our {thing} for an hour, {name}.", { thing: ["keys", "passports", "tickets", "cat"] }, "search for + the thing you want to find."],
  [["borrowed", "borrowed with", "borrowed to", "borrowed by"], "I ______ my brother's {thing} for the trip.", { thing: ["bag", "camera", "tent", "jacket"] }, "borrow takes the thing straight away: borrowed his bag."],
  [["smiled at", "smiled", "smiled to", "smiled of"], "The baby ______ me and I {verb}.", { verb: ["laughed", "smiled back", "waved", "said hello"] }, "smile at + the person."],
  [["discussed", "discussed about", "discussed on", "discussed of"], "The {who} ______ the problem for two hours.", { who: ["teachers", "parents", "managers", "players"] }, "discuss + object, no preposition."],
  [["suffers from", "suffers of", "suffers on", "suffers"], "My uncle ______ terrible headaches in the {season}.", { season: ["summer", "spring", "heat", "winter"] }, "suffer from + the problem."],
].map(([o, prompt, slots, why], i) => {
  let pr = prompt;
  const s = fill(pr, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) { s.name = i % 2 ? NAME2 : NAME; pr = pr.replace(/([.!?])$/, ", {name}$1"); }
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: pr, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write the preposition that goes with the verb.";
const BUILD = [
  ["on", "The price of the trip depends ______ the {thing}, {name}.", { thing: ["hotel", "season", "flight", "group"] }, "depend on + the thing that decides."],
  ["to", "My little brother never listens ______ me, {name}!", { x: [] }, "listen to + the person."],
  ["for", "Wait ______ me at the {place}, {name}. I'm coming.", { place: ["gate", "bus stop", "café", "corner"] }, "wait for + the person."],
  ["to", "Whose {thing} is this? Does it belong ______ you, {name}?", { thing: ["bag", "phone", "pen", "jacket"] }, "belong to + the owner."],
  ["with", "I don't agree ______ my {who} about the new rules.", { who: ["dad", "teacher", "boss", "brother"] }, "agree with + a person."],
  ["for", "My grandpa paid ______ the {thing} in cash, {name}.", { thing: ["car", "carpet", "fridge", "piano"] }, "pay for + the thing you buy."],
  ["for", "The tourists asked ______ a glass of water in {city}.", { city: ["Bukhara", "Samarkand", "Khiva", "Tashkent"] }, "ask for + what you want."],
  ["of", "Our team consists ______ eleven {who} and a coach.", { who: ["players", "girls", "boys", "students"] }, "consist of + the parts."],
  ["at", "Please don't laugh ______ my {thing}, {name}. I made it myself.", { thing: ["cake", "drawing", "hat", "poem"] }, "laugh at + the thing that is funny."],
  ["for", "My sister has applied ______ a visa to study in {place}, {name}.", { place: ["Korea", "Japan", "the UK", "Canada"] }, "apply for + a visa."],
  ["on", "You can rely ______ my {who}, {name}. He's never late.", { who: ["brother", "uncle", "driver", "friend"] }, "rely on + the person you trust."],
  ["from", "Many people suffer ______ colds in the {season}, {name}.", { season: ["winter", "autumn", "spring", "cold months"] }, "suffer from + the problem."],
  ["for", "The {who} searched ______ the lost child all night.", { who: ["neighbours", "villagers", "parents", "teachers"] }, "search for + who you want to find."],
  ["at", "The {who} smiled ______ me when I came in, {name}.", { who: ["nurse", "waiter", "receptionist", "teacher"] }, "smile at + the person."],
  ["from", "Can I borrow some money ______ you, {name}? I left my {thing} at home.", { thing: ["wallet", "card", "bag", "purse"] }, "borrow + thing + from + the person."],
  ["to", "Can you explain the rule ______ me again, {name}? I didn't {verb} it.", { verb: ["get", "understand", "follow", "remember"] }, "explain + thing + to + the person."],
  ["to", "What happened ______ your {thing}, {name}? It's broken!", { thing: ["phone", "bike", "car", "glasses"] }, "happen to + the person or thing."],
  ["about", "Don't worry ______ the {thing}, {name}. I'll fix it.", { thing: ["car", "window", "door", "computer"] }, "worry about + the problem."],
  ["in", "Does your little sister believe ______ fairies, {name}?", { x: [] }, "believe in + something you think is real."],
  ["on", "I spent all my money ______ {thing}, {name}.", { thing: ["books", "clothes", "presents", "games"] }, "spend money on + what you buy."],
].map(([key, source, slots, why], i) => {
  let src = source;
  const s = fill(src, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) {
    if (src.includes("never listens")) { s.who = ["me", "Mum", "our teacher", "Dad"]; src = src.replace("______ me", "______ {who}"); }
    else if (src.includes("fairies")) { s.who = ["little sister", "son", "daughter", "little brother"]; src = src.replace("little sister", "{who}"); }
    else if (!s.name) { s.name = i % 2 ? NAME2 : NAME; src = src.replace(/([.!?])$/, ", {name}$1"); }
  }
  const it = { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why, slots: s };
  const alt = ALT(key, src); if (alt) it.acceptable = alt;
  return it;
});

/* ---------------- transform: 15 rewrite ---------------- */
const FIX = "Correct the mistake.";
const VERB = "Rewrite with the verb in brackets.";
const TRANSFORM = [
  [FIX, "It depends of the price of the {thing}, {name}.", "It depends ______ the price of the {thing}, {name}.", "on", { thing: ["tickets", "hotel", "flat", "car"] }, "depend on, not depend of."],
  [FIX, "I listen music every day on the {bus}, {name}.", "I listen ______ music every day on the {bus}, {name}.", "to", { bus: ["bus", "metro", "way home", "train"] }, "listen needs to before its object."],
  [FIX, "We're waiting the {bus}, {name}.", "We're waiting ______ the {bus}, {name}.", "for", { bus: ["bus", "taxi", "train", "guests"] }, "wait needs for before its object."],
  [FIX, "I agree to you about the {thing}, {name}.", "I agree ______ you about the {thing}, {name}.", "with", { thing: ["plan", "price", "hotel", "party"] }, "agree with a person."],
  [FIX, "Can you explain me the {thing}, {name}?", "Can you explain the {thing} ______ me, {name}?", "to", { thing: ["rules", "game", "answer", "map"] }, "explain something to someone, not explain me."],
  [VERB, "(belong) Whose {thing} is this, {name}?", "Who does this {thing} belong ______, {name}?", "to", { thing: ["bag", "phone", "coat", "bike"] }, "belong to; in a question the preposition goes at the end."],
  [VERB, "(ask) I'm phoning because I need help from the {who}, {name}.", "I'm phoning to ask the {who} ______ help, {name}.", "for", { who: ["teacher", "office", "doctor", "bank"] }, "ask someone for something."],
  [VERB, "(consist) The {thing} has three parts, {name}.", "The {thing} consists ______ three parts, {name}.", "of", { thing: ["course", "exam", "book", "show"] }, "consist of + the parts."],
  [VERB, "(rely) Can I trust the {who}, {name}?", "Can I rely ______ the {who}, {name}?", "on", { who: ["driver", "builders", "new boy", "plumber"] }, "rely on = trust."],
  [VERB, "(suffer) My aunt often has headaches in the {season}, {name}.", "My aunt often suffers ______ headaches in the {season}, {name}.", "from", { season: ["summer", "heat", "spring", "winter"] }, "suffer from + the problem."],
  [VERB, "(smile) The baby saw me and gave a big smile, {name}. It was in the {place}.", "The baby smiled ______ me, {name}. It was in the {place}.", "at", { place: ["park", "shop", "bus", "clinic"] }, "smile at + the person."],
  [VERB, "(borrow) My brother gave me some money. I'll give it back on {day}, {name}.", "I borrowed some money ______ my brother, {name}. I'll give it back on {day}.", "from", { day: ["Monday", "Friday", "Sunday", "Thursday"] }, "borrow something from someone."],
  [VERB, "(pay) Don't worry about the {thing}, {name}. I'll give the money.", "Don't worry, {name}. I'll pay ______ the {thing}.", "for", { thing: ["taxi", "tickets", "drinks", "food"] }, "pay for + the thing."],
  [VERB, "(laugh) Everyone thought my {thing} was funny, {name}.", "Everyone laughed ______ my {thing}, {name}.", "at", { thing: ["hat", "photo", "joke", "dance"] }, "laugh at + the funny thing."],
  [VERB, "(depend) My parents are thinking about the price of the {thing}, {name}. It decides everything.", "Everything depends ______ the price of the {thing}, {name}.", "on", { thing: ["flat", "car", "trip", "wedding"] }, "depend on + the thing that decides."],
].map(([instr, source, hint, key, slots, why], i) => {
  const s = fill(source + hint, slots, i % 2 ? NAME2 : NAME);
  const it = { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
  const alt = ALT(key, hint); if (alt) it.acceptable = alt;
  return it;
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with depend on.", "… depends on …", ["exactly one sentence", "depend on", "a noun object"]],
  ["Write one sentence with wait for.", "… waiting for …", ["exactly one sentence", "wait for", "a person or thing"]],
  ["Write one sentence with listen to.", "… listen to …", ["exactly one sentence", "listen to", "a noun object"]],
  ["Write one sentence with discuss and no preposition.", "We discussed the …", ["exactly one sentence", "discuss + object", "no about"]],
  ["Write a question with belong to. Put to at the end.", "Who does … belong to?", ["exactly one sentence", "question", "to at the end"]],
  ["Write one sentence with agree with.", "I agree with …", ["exactly one sentence", "agree with", "a person"]],
  ["Write one sentence with pay for.", "… paid for …", ["exactly one sentence", "pay for", "past"]],
  ["Write one sentence with explain … to.", "explain … to …", ["exactly one sentence", "explain + thing", "to + person"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a meeting or a family talk. What did people discuss? Who did you agree with? Write three or four sentences.", "discuss / agree with", ["discuss + object", "agree with", "three or four sentences"]],
  ["Describe a time you waited for something for a long time. Write three or four sentences.", "wait for / depend on", ["wait for", "another verb + preposition", "three or four sentences"]],
  ["Write three or four sentences about who you rely on and why.", "rely on / ask for / listen to", ["rely on", "another verb + preposition", "three or four sentences"]],
  ["Write three or four sentences about what you spend your money on.", "spend on / pay for", ["spend on", "pay for", "three or four sentences"]],
  ["Write three or four sentences about a time you borrowed something and something happened to it.", "borrow from / happen to", ["borrow from", "happen to", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.dependent-prepositions.verb-preposition.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "",
   "discuss takes its object straight away: discuss the …, no preposition.",
   "",
   "",
   "",
   "\"my sister\" is the owner: belongs to.",
   "\"I … you\": same opinion as a person: agree with.",
   "",
   "\"with a card\": the thing bought is after: pay for.",
   "",
   "reach takes its object straight away: reached ….",
   "Three parts make the test: consists of.",
   "My funny … made them laugh: laughed at.",
   "contact takes its object straight away: contact the ….",
   "Your … will always help: rely on.",
   "",
   "borrow takes the thing straight away: borrowed his ….",
   "The baby looked at me happily: smiled at.",
   "",
   "Headaches are the problem: suffers from."
  ],
  "build": [
   "The price changes with the …: depends on.",
   "",
   "",
   "Asking about the owner: belong to.",
   "Not the same opinion as my …: agree with.",
   "\"in cash\" for the thing bought: paid for.",
   "",
   "Eleven … and a coach make the team: consists of.",
   "\"I made it myself\": please don't laugh at.",
   "",
   "\"He's never late\": you can rely on.",
   "Colds are the problem: suffer from.",
   "",
   "Looking at me happily: smiled at.",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  "transform": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "has three parts → consists of.",
   "",
   "often has headaches → suffers from.",
   "gave a big smile → smiled at.",
   "",
   "",
   "",
   "It decides everything → depends on."
  ]
 }
};
{
  const byStage = (st) => items.filter((it) => it.stage === st);
  for (const [st, list] of Object.entries(VARIETY.why || {})) {
    if (list.length !== byStage(st).length) throw new Error(`VARIETY: ${st} has ${byStage(st).length} items, ${list.length} whys`);
    byStage(st).forEach((it, i) => { if (list[i]) it.why = list[i]; });
  }
  for (const [st, n, word, name, vals] of VARIETY.slot || []) {
    const it = byStage(st)[n - 1];
    if (!word) { if (!it?.slots?.[name]) throw new Error(`VARIETY: no slot ${name} in ${st} ${n}`); it.slots[name] = [...new Set([...it.slots[name], ...vals])]; continue; }
    const re = new RegExp(`(?<![\\w{])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w}])`, "g");
    let hit = false;
    for (const f of ["prompt", "source", "hint"]) if (it?.[f] && re.test(it[f])) { it[f] = it[f].replace(re, `{${name}}`); hit = true; re.lastIndex = 0; }
    if (!hit) throw new Error(`VARIETY: "${word}" not found in ${st} ${n}`);
    it.slots = { ...(it.slots || {}), [name]: vals };
  }
}
// end variety
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
