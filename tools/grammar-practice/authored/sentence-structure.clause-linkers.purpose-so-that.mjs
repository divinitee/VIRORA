// Hand-authored: sentence-structure / clause-linkers / purpose-so-that (B1).
// Wave C, C16 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: so that + clause for purpose ("I wrote the address down so
// that I wouldn't forget it"), vs to + verb before a bare verb.
// Learner errors: "for buy" / "for to see" (Russian "для того чтобы" / Uzbek
// "… uchun"), "in order to" + clause, "because of" + clause.
// Sibling so-result (A2) tests so for a result; this topic never offers bare
// "so" as a wrong answer, because natives say "Wear a hat so you don't get
// cold" for purpose too (typed so-that keys accept "so" and "in order that").
// Choose: 14 so that keys (options so that / in order to / for / because of),
// 6 to keys (options to / so that / for / for to).
// Build: "Write so that or to." 12 so that / 8 to (accepts in order to); no
// sentence prints another so, that or to next to its key.
// Transform: 5 join with so that / 5 correct the mistake / 5 to + verb →
// so that + can / could (two gaps, modal fixed by instr).
// Modal follows the main verb: present → can / will / don't, past → could / wouldn't.
//
// Run: node tools/grammar-practice/authored/sentence-structure.clause-linkers.purpose-so-that.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "clause-linkers", topic: "purpose-so-that", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const EVENT = ["party", "wedding", "concert", "meeting"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_ST = "A full clause (subject + verb) follows the gap and says why, so use so that. In order to and to need a bare verb; for and because of can't start a clause.";
const W_TO = "A bare verb follows the gap, so use to (or in order to). So that needs a subject and verb; for + verb and for to are wrong.";
const ST_OPT = ["so that", "in order to", "for", "because of"];
const TO_OPT = ["to", "so that", "for", "for to"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["s", "I set two alarms ______ I wouldn't be late for the {thing}, {name}.", { thing: ["exam", "flight", "train", "interview"], name: NAME }],
  ["s", "Speak slowly ______ the {who} can understand you, {name}.", { who: ["children", "guests", "students", "tourists"], name: NAME }],
  ["s", "Mum left the light on ______ we could see the {thing}, {name}.", { thing: ["stairs", "door", "path", "steps"], name: NAME }],
  ["s", "I'm saving money ______ I can buy a {thing}, {name}.", { thing: ["bike", "laptop", "camera", "guitar"], name: NAME }],
  ["s", "We left early ______ we could get good seats at the {event}, {name}.", { event: ["concert", "match", "show", "film"], name: NAME }],
  ["s", "Close the window ______ the {thing} doesn't get wet, {name}.", { thing: ["carpet", "sofa", "floor", "table"], name: NAME }],
  ["s", "She studies every evening ______ she can pass the {exam} in {month}.", { exam: ["exam", "test", "final exam", "entrance exam"], month: ["May", "June", "July", "August"] }],
  ["s", "I'll send you the {thing} ______ you can read it {when}.", { thing: ["file", "report", "story", "article"], when: ["tonight", "at home", "later", "on the bus"] }],
  ["s", "He took a taxi ______ he wouldn't miss the {thing}, {name}.", { thing: ["train", "flight", "bus", "start"], name: NAME }],
  ["s", "Put the {food} in the fridge ______ it stays fresh, {name}.", { food: ["milk", "meat", "fish", "cheese"], name: NAME }],
  ["s", "We whispered ______ we wouldn't wake the {who}, {name}.", { who: ["baby", "children", "neighbours", "grandmother"], name: NAME }],
  ["s", "I'm learning {lang} ______ I can watch {thing} without subtitles.", { lang: ["Korean", "Turkish", "Spanish", "Chinese"], thing: ["films", "dramas", "cartoons", "videos"] }],
  ["s", "Grandpa wears glasses ______ he can read the {thing}, {name}.", { thing: ["newspaper", "menu", "signs", "labels"], name: NAME }],
  ["s", "Turn the music down ______ I can hear {what}, {name}.", { what: ["the TV", "my phone", "the teacher", "you"], name: NAME }],
  ["t", "I went to the bazaar ______ buy some {food}, {name}.", { food: ["bread", "fruit", "rice", "vegetables"], name: NAME }],
  ["t", "She called me ______ ask about the {thing}, {name}.", { thing: ["homework", "party", "trip", "meeting"], name: NAME }],
  ["t", "We stopped at a café ______ have some {food}, {name}.", { food: ["tea", "soup", "lunch", "coffee"], name: NAME }],
  ["t", "He's working hard ______ save money for a {thing}, {name}.", { thing: ["car", "flat", "trip", "wedding"], name: NAME }],
  ["t", "I opened the {room} window ______ let some fresh air in, {name}.", { room: ["kitchen", "bedroom", "bathroom", "classroom"], name: NAME }],
  ["t", "They came to {city} ______ visit their {who}.", { city: CITY, who: ["grandparents", "cousins", "friends", "uncle"] }],
].map(([k, prompt, slots], i) => {
  const opts = k === "s" ? ST_OPT : TO_OPT;
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why: k === "s" ? W_ST : W_TO, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write so that or to.";
const BUILD = [
  ["s", "I'll write your {thing} down ______ I don't forget it, {name}.", { thing: ["number", "address", "name", "email"], name: NAME }],
  ["s", "Wear a hat ______ you don't get cold {when}, {name}.", { when: ["in the mountains", "outside", "on the walk", "tonight"], name: NAME }],
  ["s", "We hurried ______ we wouldn't miss the {thing}, {name}.", { thing: ["bus", "train", "start", "film"], name: NAME }],
  ["s", "Dad fixed the {thing} ______ we could use it again, {name}.", { thing: ["bike", "chair", "lamp", "radio"], name: NAME }],
  ["s", "Bring an umbrella ______ you don't get wet {when}, {name}.", { when: ["later", "tonight", "in the park", "on the way"], name: NAME }],
  ["s", "I'm going to bed early ______ I can get up at {time}, {name}.", { time: ["five", "six", "half past five", "six thirty"], name: NAME }],
  ["s", "She runs every morning ______ she can win the {race} in {month}.", { race: ["race", "marathon", "competition", "cup"], month: ["May", "June", "July", "August"] }],
  ["s", "Let's leave now ______ we arrive before {time}, {name}.", { time: ["six", "seven", "eight", "nine"], name: NAME }],
  ["s", "Mum hid the {food} ______ we wouldn't eat it all, {name}.", { food: ["cake", "pie", "chocolate", "halva"], name: NAME }],
  ["s", "I saved the file twice ______ I wouldn't lose my {work}, {name}.", { work: ["essay", "project", "notes", "report"], name: NAME }],
  ["s", "Speak louder ______ the people at the back {where} can hear you, {name}.", { where: ["of the hall", "of the room", "of the bus", "of the class"], name: NAME }],
  ["s", "Leave the door open ______ the {pet} can come in, {name}.", { pet: ["cat", "dog", "puppy", "kitten"], name: NAME }],
  ["t", "I went out ______ buy some {food}, {name}.", { food: ["bread", "milk", "eggs", "fruit"], name: NAME }],
  ["t", "She phoned her aunt ______ wish her a happy {day}, {name}.", { day: ["birthday", "New Year", "holiday", "Navruz"], name: NAME }],
  ["t", "We met at the café ______ plan the {event}, {name}.", { event: EVENT, name: NAME }],
  ["t", "He's saving money ______ buy a {thing}, {name}.", { thing: ["car", "bike", "phone", "laptop"], name: NAME }],
  ["t", "I use this app ______ learn new words every {time}, {name}.", { time: ["day", "morning", "evening", "week"], name: NAME }],
  ["t", "They called the hotel ______ book a room for {n} nights.", { n: ["two", "three", "four", "five"] }],
  ["t", "Grandma uses a stick ______ walk in the {place}, {name}.", { place: ["park", "garden", "yard", "street"], name: NAME }],
  ["t", "I opened the {room} window ______ let in some fresh air, {name}.", { room: ["kitchen", "bedroom", "bathroom", "classroom"], name: NAME }],
].map(([k, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: k === "s" ? "so that" : "to", acceptable: k === "s" ? ["so", "in order that"] : ["in order to"], why: k === "s" ? W_ST : W_TO, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with so that.";
const COR = "Correct the mistake.";
const MOD = "Rewrite with so that. Use can after a present verb and could after a past verb.";
const TRANSFORM = [
  // join with so that (5)
  [JOIN, "I wrote the {thing} down. I didn't want to forget it, {name}.", "I wrote the {thing} down ______ I wouldn't forget it, {name}.", "so that", W_ST, { thing: ["address", "number", "date", "password"], name: NAME }, ["so", "in order that"]],
  [JOIN, "Mum cooked a lot. She wanted everyone to have enough {food}, {name}.", "Mum cooked a lot ______ everyone would have enough {food}, {name}.", "so that", W_ST, { food: ["plov", "soup", "bread", "salad"], name: NAME }, ["so", "in order that"]],
  [JOIN, "Speak clearly. Then the {who} can understand you, {name}.", "Speak clearly ______ the {who} can understand you, {name}.", "so that", W_ST, { who: ["children", "guests", "students", "tourists"], name: NAME }, ["so", "in order that"]],
  [JOIN, "We left early. We wanted a good seat at the {event}, {name}.", "We left early ______ we could get a good seat at the {event}, {name}.", "so that", W_ST, { event: ["concert", "match", "show", "film"], name: NAME }, ["so", "in order that"]],
  [JOIN, "Take a map. Then you won't get lost in {city}, {name}.", "Take a map ______ you won't get lost in {city}, {name}.", "so that", W_ST, { city: CITY, name: NAME }, ["so", "in order that"]],
  // correct (5)
  [COR, "I went out for buy some {food}, {name}.", "I went out ______ buy some {food}, {name}.", "to", W_TO, { food: ["bread", "milk", "eggs", "fruit"], name: NAME }, ["in order to"]],
  [COR, "She came here for to see her {who}, {name}.", "She came here ______ see her {who}, {name}.", "to", W_TO, { who: ["grandparents", "cousins", "aunt", "teacher"], name: NAME }, ["in order to"]],
  [COR, "I set an alarm in order to I wouldn't be late {when}, {name}.", "I set an alarm ______ I wouldn't be late {when}, {name}.", "so that", W_ST, { when: ["for school", "for work", "for the exam", "for the bus"], name: NAME }, ["so", "in order that"]],
  [COR, "Close the door for the {pet} can't get out, {name}.", "Close the door ______ the {pet} can't get out, {name}.", "so that", W_ST, { pet: ["cat", "dog", "puppy", "kitten"], name: NAME }, ["so", "in order that"]],
  [COR, "We spoke quietly because of the {who} could sleep, {name}.", "We spoke quietly ______ the {who} could sleep, {name}.", "so that", W_ST, { who: ["baby", "children", "patients", "grandparents"], name: NAME }, ["so", "in order that"]],
  // to + verb -> so that + can / could (5)
  [MOD, "I study every day to pass the {exam}, {name}.", "I study every day ______ I ______ pass the {exam}, {name}.", ["so that", "can"], W_ST, { exam: ["exam", "test", "final exam", "entrance exam"], name: NAME }],
  [MOD, "She saved money to buy a {thing}, {name}.", "She saved money ______ she ______ buy a {thing}, {name}.", ["so that", "could"], W_ST, { thing: ["bike", "laptop", "camera", "guitar"], name: NAME }],
  [MOD, "We got up early to see the {view}, {name}.", "We got up early ______ we ______ see the {view}, {name}.", ["so that", "could"], W_ST, { view: ["sunrise", "mountains", "parade", "sea"], name: NAME }],
  [MOD, "He's learning {lang} to talk to his {who}.", "He's learning {lang} ______ he ______ talk to his {who}.", ["so that", "can"], W_ST, { lang: ["Korean", "Turkish", "Spanish", "Chinese"], who: ["grandparents", "cousins", "friends", "neighbours"] }],
  [MOD, "I took a photo of the board to remember the {thing}, {name}.", "I took a photo of the board ______ I ______ remember the {thing}, {name}.", ["so that", "could"], W_ST, { thing: ["homework", "dates", "rules", "new words"], name: NAME }],
].map(([instr, source, hint, key, why, slots, acceptable = []]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about why you are learning English. Use so that.", "I'm learning English so that I can …", ["exactly one sentence", "so that + subject + can", "a present verb"]],
  ["Write one sentence about something you did yesterday so that you wouldn't be late.", "I … so that I wouldn't be late.", ["exactly one sentence", "so that + wouldn't", "a past verb"]],
  ["Write one sentence giving advice to a friend. Use so that.", "Take … so that you don't …", ["exactly one sentence", "an imperative", "so that + clause"]],
  ["Write one sentence about why you went to a shop. Use to + verb.", "I went to the … to buy …", ["exactly one sentence", "to + verb", "no for + verb"]],
  ["Write one sentence about why your family saves money.", "We save money so that we can …", ["exactly one sentence", "so that + can", "a present verb"]],
  ["Write one sentence about something a parent did for you when you were small.", "My mum … so that I could …", ["exactly one sentence", "so that + could", "a past verb"]],
  ["Write one sentence about how you study for an exam.", "I … so that I can remember …", ["exactly one sentence", "so that", "no in order to + subject"]],
  ["Write two sentences: one with to + verb and one with so that + clause.", "I went … to … / I left early so that …", ["exactly two sentences", "to + verb", "so that + subject + verb"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write how you get ready for a long trip.", "I pack … so that I can … I take … to …", ["so that + clause", "to + verb", "three or four sentences"]],
  ["Give a new student advice about the first week at school or college.", "Come early so that you can … Ask … to …", ["so that + clause", "imperatives", "three or four sentences"]],
  ["Write how your family got ready for a big celebration.", "We cleaned … so that … Mum went … to …", ["so that + could / would", "past verbs", "three or four sentences"]],
  ["Write about your plans for next year and why.", "I want to save money so that … I'll study … to …", ["so that + can", "to + verb", "three or four sentences"]],
  ["Write tips for saving energy at home.", "Turn off … so that … Close … so that …", ["so that + clause", "no for + verb", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.clause-linkers.purpose-so-that.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "A clause follows (I wouldn't be late): so that.",
   "A new subject follows (the … can understand): so that.",
   "A new subject follows (we could see): so that.",
   "A clause with can follows (I can buy): so that.",
   "A clause with could follows (we could get): so that.",
   "A new subject follows (the … doesn't get wet): so that.",
   "A clause with can follows (she can pass): so that.",
   "A new subject follows (you can read it): so that.",
   "A clause with wouldn't follows: so that.",
   "A new subject follows (it stays fresh): so that.",
   "A clause with wouldn't follows (we wouldn't wake): so that.",
   "A clause with can follows (I can watch): so that.",
   "A clause with can follows (he can read): so that.",
   "A clause with can follows (I can hear): so that.",
   "Only a verb follows (buy): to.",
   "Only a verb follows (ask): to.",
   "Only a verb follows (have): to.",
   "Only a verb follows (save): to.",
   "Only a verb follows (let): to.",
   "Only a verb follows (visit): to."
  ],
  "build": [
   "A clause follows (I don't forget it): so that.",
   "A clause follows (you don't get cold): so that.",
   "A clause follows (we wouldn't miss): so that.",
   "A clause follows (we could use it): so that.",
   "A clause follows (you don't get wet): so that.",
   "A clause follows (I can get up): so that.",
   "A clause follows (she can win): so that.",
   "A clause follows (we arrive): so that.",
   "A clause follows (we wouldn't eat it): so that.",
   "A clause follows (I wouldn't lose): so that.",
   "A clause follows (the people … can hear): so that.",
   "A clause follows (the … can come in): so that.",
   "Just a verb follows (buy): to.",
   "Just a verb follows (wish): to.",
   "Just a verb follows (plan): to.",
   "Just a verb follows (buy a …): to.",
   "Just a verb follows (learn): to.",
   "Just a verb follows (book): to.",
   "Just a verb follows (walk): to.",
   "Just a verb follows (let in): to."
  ],
  "transform": [
   "didn't want to forget → so that I wouldn't forget.",
   "wanted everyone to have → so that everyone would have.",
   "Then … can understand → so that.",
   "wanted a good seat → so that we could get.",
   "Then you won't get lost → so that.",
   "Purpose + verb: to buy, not for buy.",
   "Purpose + verb: to see, not for to see.",
   "in order to needs a verb, not a clause: so that.",
   "for can't start a clause: so that.",
   "because of needs a noun, not a clause: so that.",
   "to pass → so that I can pass.",
   "Past: to buy → so that she could buy.",
   "Past: to see → so that we could see.",
   "Present: to talk → so that he can talk.",
   "Past: to remember → so that I could remember."
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
console.log(`wrote ${out} — ${items.length} items`);