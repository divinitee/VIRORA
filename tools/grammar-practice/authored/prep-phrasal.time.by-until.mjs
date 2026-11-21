// Hand-authored: prep-phrasal / time / by-until (B1).
// Wave C, C37 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item: "send me the report ______ Friday at the latest" →
// by): by = a deadline, at or before that time (finish / send / arrive / be ready by);
// until = something continues up to that time and then stops (wait / stay / work /
// sleep / be open until).
// One right answer: "be home by six" and "be home until six" are both English, so
// every line uses a verb that only fits one (finish, send, arrive vs wait, stay, sleep).
// Negatives are not used ("I won't be ready by / until ten" are both English).
// till = until, so till is never an option and is accepted in typed until answers.
// Choose: 10 by / 10 until; options by / until / since / during.
// Build: 20 typed one word. Transform: 5 no later than → by / 5 started … stopped at →
// until / 5 correct the mistake.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.time.by-until.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "time", topic: "by-until", level: "B1", pv: "2.5" };
const NAME = ["Akmal", "Nodira", "Sherzod", "Gulnora"];
const NAME2 = ["Feruza", "Ulugbek", "Malika", "Sardor"];
const SET = ["by", "until", "since", "during"];
const DAY = ["Monday", "Tuesday", "Thursday", "Friday"];
const TIME = ["five o'clock", "six o'clock", "half past four", "noon"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["by", "Please send me the {doc} ______ {day} at the latest, {name}.", { doc: ["report", "photos", "form", "list"], day: DAY }, "\"at the latest\" = a deadline: by."],
  ["until", "We waited for the {bus} ______ {time}, but it didn't come.", { bus: ["bus", "taxi", "plumber", "doctor"], time: TIME }, "Waiting continues up to that time: until."],
  ["by", "I need to finish this {work} ______ {day}, {name}.", { work: ["essay", "project", "book", "report"], day: DAY }, "finish happens once, before the deadline: by."],
  ["until", "The {shop} is open ______ ten o'clock tonight, {name}.", { shop: ["pharmacy", "bazaar", "supermarket", "library"], name: NAME2 }, "It stays open and then closes: until."],
  ["by", "The guests will arrive ______ {time}, so let's start cooking now.", { time: TIME, name: NAME }, "arrive happens at one point, not later than that: by."],
  ["until", "My little brother slept ______ {time} on Sunday, {name}.", { time: ["ten o'clock", "eleven", "noon", "half past nine"], name: NAME2 }, "Sleeping continues and then stops: until."],
  ["by", "Your passport will be ready ______ the end of {month}, {name}.", { month: ["March", "May", "the month", "next week"], name: NAME }, "be ready = the deadline for the job: by."],
  ["until", "Let's stay at the {place} ______ the rain stops, {name}.", { place: ["café", "museum", "library", "station"], name: NAME2 }, "We stay, and leave when the rain stops: until."],
  ["by", "The homework must be handed in ______ {day} morning.", { day: DAY, name: NAME }, "A deadline for the teacher: by."],
  ["until", "Grandpa worked at the {place} ______ he was sixty-five, {name}.", { place: ["factory", "hospital", "school", "bank"], name: NAME2 }, "He kept working and then stopped: until."],
  ["by", "Can you pay me back ______ the end of the {time}, {name}?", { time: ["week", "month", "holidays", "year"], name: NAME }, "Pay back once, not later than that: by."],
  ["until", "The road to {city} will stay closed ______ {day}.", { city: ["Chimgan", "Fergana", "Andijan", "Jizzakh"], day: DAY }, "Closed the whole time, then open again: until."],
  ["by", "If we leave now, we'll get to {city} ______ midnight, {name}.", { city: ["Samarkand", "Bukhara", "Namangan", "Karshi"], name: NAME2 }, "get to happens at one point, not later than midnight: by."],
  ["until", "We played {game} in the yard ______ it got dark, {name}.", { game: ["football", "volleyball", "chess", "basketball"], name: NAME }, "Playing continued and then stopped: until."],
  ["by", "I'll have the {thing} fixed ______ {time} tomorrow, {name}.", { thing: ["car", "phone", "laptop", "bike"], time: TIME }, "Fixed at some point before that time: by."],
  ["until", "You can borrow my {thing} ______ {day}, {name}.", { thing: ["bike", "laptop", "camera", "tent"], day: DAY }, "You keep it the whole time, then give it back: until."],
  ["by", "Make sure you've booked tickets for the {event} ______ {day}.", { event: ["concert", "trip", "match", "museum tour"], day: DAY }, "booked at some point before the deadline: by."],
  ["until", "The baby cried ______ {who} came home, {name}.", { name: NAME2, who: ["her mum", "her dad", "grandma", "her sister"] }, "Crying continued and stopped when mum came: until."],
  ["by", "Most of the {food} was gone ______ nine o'clock, {name}.", { food: ["plov", "cake", "salad", "bread"], name: NAME }, "Gone at some point before nine: by."],
  ["until", "The {who} stayed with us ______ the end of {month}.", { who: ["guests", "cousins", "grandparents", "students"], month: ["June", "August", "the summer", "the month"] }, "They stayed and then left: until."],
].map(([k, prompt, slots, why], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && prompt.includes(`{${n}}`)) s[n] = f;
  if (prompt.includes("{name}") && !s.name) s.name = NAME2;
  let p = prompt;
  if (Object.keys(s).length < 2) { s.name = slots.name || NAME; p = p.replace(/([.!?])$/, ", {name}$1"); }
  const options = SET.map((_, j) => SET[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(k), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write by or until.";
const BUILD = [
  ["by", "Could you finish the {work} ______ {day}, {name}?", { work: ["report", "essay", "design", "translation"], day: DAY }, "finish + a deadline: by."],
  ["until", "I'll wait for you at the {place} ______ {time}, {name}.", { place: ["gate", "station", "café", "bus stop"], time: TIME }, "I keep waiting up to that time: until."],
  ["by", "Our flight lands at seven, so we'll be home ______ nine with the {gift}, {name}.", { gift: ["sweets", "presents", "dried fruit", "photos"], name: NAME2 }, "be home at some point not later than nine: by (the landing time shows it)."],
  ["until", "The {shop} stays open ______ midnight in summer.", { shop: ["café", "supermarket", "pharmacy", "bakery"], name: NAME }, "stays open, then closes: until."],
  ["by", "Please return the library {thing} ______ {day}.", { thing: ["books", "DVDs", "magazines", "maps"], day: DAY }, "return once, before the deadline: by."],
  ["until", "My uncle lived in {city} ______ he got married, {name}.", { city: ["Moscow", "Tashkent", "Kazan", "Almaty"], name: NAME2 }, "He lived there, then moved: until."],
  ["by", "I'll call you back ______ {time} at the latest, {name}.", { time: TIME, name: NAME }, "\"at the latest\" = deadline: by."],
  ["until", "We danced at the {event} ______ two in the morning, {name}.", { event: ["wedding", "party", "festival", "concert"], name: NAME2 }, "Dancing continued, then stopped: until."],
  ["by", "The new {place} will be finished ______ next summer.", { place: ["school", "bridge", "hospital", "stadium"], name: NAME }, "finished at a point before next summer: by."],
  ["until", "Don't open the {thing} ______ your birthday, {name}!", { thing: ["present", "box", "card", "parcel"], name: NAME2 }, "Keep it closed up to your birthday: until."],
  ["by", "Everybody had left the {place} ______ ten o'clock, {name}.", { place: ["office", "stadium", "hall", "school"], name: NAME }, "left at some point before ten: by."],
  ["until", "Keep stirring the {food} ______ it gets thick, {name}.", { food: ["soup", "sauce", "porridge", "jam"], name: NAME2 }, "Keep stirring, stop when it is thick: until."],
  ["by", "The {doc} has to reach the office ______ {day}.", { doc: ["letter", "contract", "form", "parcel"], day: DAY }, "reach once, before the deadline: by."],
  ["until", "I studied in the {place} ______ it closed, {name}.", { place: ["library", "café", "reading room", "computer room"], name: NAME }, "Studying continued up to closing time: until."],
  ["by", "The doctor said I'd feel better ______ the {when}, {name}.", { when: ["weekend", "end of the week", "holidays", "big match"], name: NAME2 }, "feel better at a point before the weekend: by."],
  ["until", "You can park here ______ {time}, {name}. After that, it's {price}.", { time: TIME, price: ["not free", "two thousand sum an hour", "not allowed", "very expensive"] }, "Free the whole time, then it changes: until."],
  ["by", "We have to choose the {thing} for the wedding ______ next week, {name}.", { thing: ["music", "flowers", "cake", "photographer"], name: NAME }, "choose once, before the deadline: by."],
  ["until", "Sit on the {seat} and rest ______ you feel better, {name}.", { seat: ["sofa", "bench", "chair", "bed"], name: NAME2 }, "Rest the whole time, stop when you feel better: until."],
  ["by", "Let me know ______ {day} if you're coming to the {event}, {name}.", { day: DAY, event: ["party", "dinner", "trip", "meeting"] }, "let me know once, before the deadline: by."],
  ["until", "The {who} talked on the phone ______ two in the morning.", { who: ["girls", "brothers", "cousins", "students"], name: NAME }, "Talking continued, then stopped: until."],
].map(([key, source, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && source.includes(`{${n}}`)) s[n] = f;
  if (source.includes("{name}") && !s.name) s.name = NAME;
  let src = source;
  if (Object.keys(s).length < 2) {
    if (!s.name) { s.name = slots.name || NAME; src = src.replace(/([.!?])$/, ", {name}$1"); }
  }
  const it = { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why, slots: s };
  if (key === "until") it.acceptable = ["till"];
  return it;
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const LATER = "Rewrite with by.";
const CONT = "Make one sentence with until.";
const FIX = "Correct the mistake.";
const TRANSFORM = [
  [LATER, "Please send the form no later than {day}, {name}.", "Please send the form ______ {day}, {name}.", "by", { day: DAY, name: NAME }, "no later than = by."],
  [LATER, "The {work} must be finished not later than {time}, {name}.", "The {work} must be finished ______ {time}, {name}.", "by", { work: ["job", "report", "cake", "room"], time: TIME }, "not later than = by."],
  [LATER, "Be at the {place} at seven or a bit earlier, {name}.", "Be at the {place} ______ seven, {name}.", "by", { place: ["airport", "station", "stadium", "gate"], name: NAME2 }, "at seven or earlier = by seven."],
  [LATER, "The {food} will be ready at six or before, {name}.", "The {food} will be ready ______ six, {name}.", "by", { food: ["plov", "dinner", "cake", "bread"], name: NAME }, "at six or before = by six."],
  [LATER, "Pay the bill not later than the 10th of {month}, {name}.", "Pay the bill ______ the 10th of {month}, {name}.", "by", { month: ["May", "June", "July", "October"], name: NAME2 }, "not later than = by."],
  [CONT, "We started waiting at two. We stopped waiting at {time}, {name}.", "We waited ______ {time}, {name}.", "until", { time: TIME, name: NAME }, "Waiting went on up to that time: until."],
  [CONT, "The {shop} opens at eight. It closes at ten, {name}.", "The {shop} is open from eight ______ ten, {name}.", "until", { shop: ["café", "bakery", "pharmacy", "bank"], name: NAME2 }, "from … until: open the whole time, then closed."],
  [CONT, "I played {game} all afternoon. I stopped when it got dark, {name}.", "I played {game} ______ it got dark, {name}.", "until", { game: ["football", "chess", "tennis", "volleyball"], name: NAME }, "Playing went on and stopped when it got dark: until."],
  [CONT, "My aunt lived in {city} for years. She moved in {year}, {name}.", "My aunt lived in {city} ______ {year}, {name}.", "until", { city: ["Moscow", "Kazan", "Almaty", "Bishkek"], year: ["2015", "2018", "2020", "2022"] }, "She lived there, then moved: until."],
  [CONT, "The {who} talked and talked. They stopped at midnight, {name}.", "The {who} talked ______ midnight, {name}.", "until", { who: ["girls", "guests", "cousins", "students"], name: NAME2 }, "Talking went on up to midnight: until."],
  [FIX, "Can you finish it until {day}, {name}?", "Can you finish it ______ {day}, {name}?", "by", { day: DAY, name: NAME }, "finish = a deadline: by, not until."],
  [FIX, "I'll wait here by {time}, {name}.", "I'll wait here ______ {time}, {name}.", "until", { time: TIME, name: NAME2 }, "wait continues: until, not by."],
  [FIX, "The {doc} must arrive until the end of the week, {name}.", "The {doc} must arrive ______ the end of the week, {name}.", "by", { doc: ["parcel", "letter", "contract", "form"], name: NAME }, "arrive = one moment before a deadline: by."],
  [FIX, "The museum is open by six on {day}, {name}.", "The museum is open ______ six on {day}, {name}.", "until", { day: ["Mondays", "Fridays", "Sundays", "weekdays"], name: NAME2 }, "be open continues: until."],
  [FIX, "We have to decide about the {place} until {day}, {name}.", "We have to decide about the {place} ______ {day}, {name}.", "by", { place: ["hall", "hotel", "restaurant", "bus"], day: DAY }, "decide = once, before a deadline: by."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  if (source.includes("{name}") && !s.name) s.name = NAME2;
  const it = { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
  if (key === "until") it.acceptable = hint.includes("from eight") ? ["till", "to"] : ["till"];
  return it;
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a deadline you have. Use by.", "… by Friday", ["exactly one sentence", "by + time", "a deadline"]],
  ["Write one sentence about how long you slept last weekend. Use until.", "I slept until …", ["exactly one sentence", "until + time", "past"]],
  ["Write one sentence with finish … by.", "finish … by …", ["exactly one sentence", "finish", "by"]],
  ["Write one sentence with wait … until.", "wait … until …", ["exactly one sentence", "wait", "until"]],
  ["Write one sentence about when a shop near you is open. Use until.", "… is open until …", ["exactly one sentence", "open until", "a time"]],
  ["Write one sentence with at the latest.", "by … at the latest", ["exactly one sentence", "by", "at the latest"]],
  ["Write one sentence with until + a clause.", "until it gets dark / until you feel better", ["exactly one sentence", "until", "subject + verb after until"]],
  ["Write one sentence asking a friend to do something by a time.", "Can you … by …?", ["exactly one sentence", "a question", "by"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your plans for this week. What must you finish by a certain day? Write three or four sentences.", "by + deadline", ["by", "until", "three or four sentences"]],
  ["Write a short message to a friend who is borrowing your bike. Say until when they can keep it and by when they must return it.", "until vs by", ["until", "by", "three or four sentences"]],
  ["Describe a long day you had. Until what time did you work or study? Write three or four sentences.", "until + time", ["until", "past", "three or four sentences"]],
  ["Write three or four sentences of instructions for a new worker: deadlines and opening hours.", "by / until", ["by", "until", "three or four sentences"]],
  ["Write three or four sentences about a wedding or party: until when people danced and by when the guests had left.", "until / by", ["until", "by", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.time.by-until.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  "build": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "feel better at a point before the …: by.",
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
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
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
