// Hand-authored: tenses / future / timetable-simple (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): the PRESENT SIMPLE for a future event on a
// timetable or schedule (The train leaves at 7:15 tomorrow; What time does the
// film start?). Subjects are always timetabled things: trains, buses, flights,
// films, concerts, lessons, courses, shops and museums (opening hours).
// Triage: kept. Siblings arrangement-continuous (personal plans, I'm meeting …)
// and will / going to are separate topics, so no personal plans here.
//
// One right answer. "is leaving" and "will leave" are ALSO correct English for a
// timetable ("The flight is leaving at 9"), so they are NEVER options in choose,
// and every typed item says "present simple" in its instruction. Choose
// options are the forms of one verb: -s / base / past / -ing alone (The train
// leaves / leave / left / leaving), so agreement and the future time word decide;
// question items use does / do / is / did with a future time word (tomorrow,
// next), so did is wrong.
// Transform: 5 will → present simple / 5 write the question / 5 correct the
// mistake (present simple).
//
// Run: node tools/grammar-practice/authored/tenses.future.timetable-simple.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "future", topic: "timetable-simple", level: "B1", pv: "2.5" };
const NAME = ["Nodira", "Akmal", "Zarina", "Sherzod"]; // listener names: never printed in a sentence (audit 20 Nov)
const CITY = ["Samarkand", "Bukhara", "Khiva", "Fergana"];
const FLY = ["Istanbul", "Moscow", "Seoul", "Dubai"];
const V = {
  leave: ["leaves", "left", "leaving"], start: ["starts", "started", "starting"], open: ["opens", "opened", "opening"],
  finish: ["finishes", "finished", "finishing"], take: ["takes", "took", "taking"], begin: ["begins", "began", "beginning"],
  end: ["ends", "ended", "ending"], close: ["closes", "closed", "closing"], run: ["runs", "ran", "running"],
};
const WHY_SG = (v) => `A future event on a timetable takes the present simple. One train, film or shop → ${v}.`;
const WHY_PL = (v) => `A timetable future takes the present simple. More than one → the base form, ${v}.`;
const WHY_Q = (aux) => `A question about a timetable uses the present simple: ${aux} + subject + base verb. Tomorrow or next shows the future, so not did.`;

/* ---------------- choose: 20 mcq ---------------- */
// [kind, verb or aux, prompt, slots]; kind sg = key -s, pl = key base, q = auxiliary
const CHOOSE = [
  ["sg", "leave", "The train to {city} ______ at {time} tomorrow morning.", { city: CITY, time: ["7:15", "8:30", "6:45", "9:10"] }],
  ["sg", "start", "Hurry up, {name}! The film ______ in {mins} minutes.", { name: NAME, mins: ["ten", "fifteen", "five", "twenty"] }],
  ["sg", "start", "Our {subj} lesson ______ at {time} next Monday.", { subj: ["English", "maths", "history", "music"], time: ["nine", "half past eight", "ten", "eleven"] }],
  ["sg", "open", "The {shop} ______ at {time} tomorrow, so let's go early.", { shop: ["bakery", "bank", "post office", "museum"], time: ["eight", "nine", "half past eight", "ten"] }],
  ["sg", "finish", "The concert ______ at {time} tonight, so we can be home by midnight, {name}.", { time: ["ten", "eleven", "half past ten", "ten thirty"], name: NAME }],
  ["sg", "take", "My flight to {city} ______ off at {time} next Friday.", { city: FLY, time: ["6:20", "7:40", "noon", "midnight"] }],
  ["sg", "begin", "Our {course} ______ next {day}.", { course: ["English course", "summer camp", "driving course", "cooking class"], day: ["Monday", "Tuesday", "week", "Saturday"] }],
  ["sg", "leave", "The last bus to the {place} ______ at {time} tonight.", { place: ["airport", "station", "village", "city centre"], time: ["11:30", "midnight", "eleven", "half past ten"] }],
  ["sg", "end", "The {event} ______ at {time} next Saturday.", { event: ["match", "festival", "exhibition", "show"], time: ["six", "five", "four", "seven"] }],
  ["sg", "close", "The museum ______ on {day} next week, {name}.", { day: ["Monday", "Tuesday", "Wednesday", "Friday"], name: NAME }],
  ["pl", "run", "The buses to {place} ______ every {n} minutes tomorrow.", { place: ["the airport", "the bazaar", "the centre", "the station"], n: ["ten", "fifteen", "twenty", "thirty"] }],
  ["pl", "close", "The shops in our {area} ______ at {time} next Sunday.", { area: ["street", "town", "village", "district"], time: ["six", "five", "four", "seven"] }],
  ["pl", "start", "Our {exam} ______ on {day}, so I'm studying all weekend.", { exam: ["exams", "tests", "final exams", "entrance exams"], day: ["Monday", "Tuesday", "Wednesday", "the 10th"] }],
  ["pl", "leave", "The {transport} to {city} ______ from the main station tomorrow.", { transport: ["trains", "buses", "minibuses", "coaches"], city: CITY }],
  ["pl", "start", "The school holidays ______ next {day}, {name}!", { day: ["Friday", "Monday", "week", "Saturday"], name: NAME }],
  ["pl", "finish", "Lessons ______ at {time} tomorrow because of the {event}.", { time: ["twelve", "noon", "one", "eleven"], event: ["school concert", "sports day", "teachers' meeting", "school trip"] }],
  ["q", "does", "What time ______ the {event} start tomorrow, {name}?", { event: ["film", "match", "concert", "lesson"], name: NAME }],
  ["q", "does", "When ______ the next {transport} to {city} leave?", { transport: ["train", "bus", "flight", "minibus"], city: CITY }],
  ["q", "do", "What time ______ the {shop} open tomorrow, {name}?", { shop: ["shops", "banks", "markets", "museums"], name: NAME }],
  ["q", "do", "______ your {exam} begin tomorrow, {name}?", { exam: ["exams", "classes", "lessons", "holidays"], name: NAME }],
].map(([kind, v, prompt, slots], i) => {
  let opts, keyText, why;
  if (kind === "q") {
    opts = v === "does" ? ["does", "do", "is", "did"] : ["do", "does", "are", "did"];
    if (prompt.startsWith("______")) opts = opts.map((o) => o[0].toUpperCase() + o.slice(1));
    keyText = opts[0]; why = WHY_Q(v);
  } else {
    const [s3, past, ing] = V[v];
    opts = kind === "sg" ? [s3, v, past, ing] : [v, s3, past, ing];
    keyText = opts[0]; why = kind === "sg" ? WHY_SG(s3) : WHY_PL(v);
  }
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(keyText), why, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "It's on the timetable. Write the verb in brackets in the present simple.";
const WHY_B_AUX = (v) => `After does / do / doesn't / don't, use the base form: ${v}.`;
// [key, why, source, slots]
const BUILD = [
  ["leaves", WHY_SG("leaves"), "The {transport} to {city} ______ (leave) at {time} tomorrow.", { transport: ["train", "bus", "minibus", "coach"], city: CITY, time: ["six", "seven", "half past six", "7:20"] }],
  ["starts", WHY_SG("starts"), "Our {subj} class ______ (start) at {time} next Monday.", { subj: ["English", "maths", "science", "art"], time: ["nine", "ten", "half past nine", "eleven"] }],
  ["opens", WHY_SG("opens"), "The {shop} ______ (open) at nine tomorrow, {name}.", { shop: ["bank", "bakery", "pharmacy", "post office"], name: NAME }],
  ["finishes", WHY_SG("finishes"), "The film ______ (finish) at {time}, so we can catch the last {transport}.", { time: ["ten", "half past ten", "eleven", "ten thirty"], transport: ["bus", "metro", "minibus", "tram"] }],
  ["lands", WHY_SG("lands"), "Our plane ______ (land) in {city} at {time} next Sunday.", { city: FLY, time: ["six", "noon", "midnight", "7:30"] }],
  ["begins", WHY_SG("begins"), "The {event} ______ (begin) at {time} tomorrow evening.", { event: ["concert", "show", "match", "festival"], time: ["six", "seven", "eight", "half past seven"] }],
  ["close", WHY_PL("close"), "The shops ______ (close) early on {day}, {name}.", { day: ["Friday", "Saturday", "Sunday", "New Year's Eve"], name: NAME }],
  ["end", WHY_PL("end"), "Our holidays ______ (end) next {day}, {name}.", { day: ["Monday", "Friday", "week", "Sunday"], name: NAME }],
  ["run", WHY_PL("run"), "The trains to {city} ______ (run) every {n} minutes tomorrow.", { city: CITY, n: ["thirty", "forty", "twenty", "fifteen"] }],
  ["begins", WHY_SG("begins"), "My English course ______ (begin) on {day}, {name}.", { day: ["Monday", "the 5th", "Tuesday", "Wednesday"], name: NAME }],
  ["closes", WHY_SG("closes"), "The museum ______ (close) at {time} today, so we have only one hour, {name}.", { time: ["five", "six", "four", "seven"], name: NAME }],
  ["finish", WHY_PL("finish"), "Lessons ______ (finish) at {time} tomorrow because of the {event}.", { time: ["twelve", "noon", "one", "eleven"], event: ["school concert", "sports day", "teachers' meeting", "school trip"] }],
  ["start", WHY_B_AUX("start"), "What time does the {event} ______ (start) tomorrow, {name}?", { event: ["film", "match", "concert", "lesson"], name: NAME }],
  ["leave", WHY_B_AUX("leave"), "When does the next {transport} ______ (leave) for {city}?", { transport: ["train", "bus", "flight", "minibus"], city: CITY }],
  ["open", WHY_B_AUX("open"), "What time do the {shop} ______ (open) on {day}?", { shop: ["shops", "banks", "markets", "museums"], day: ["Saturday", "Sunday", "Friday", "Monday"] }],
  ["begin", WHY_B_AUX("begin"), "Does your {exam} ______ (begin) tomorrow, {name}?", { exam: ["exam", "test", "course", "class"], name: NAME }],
  ["stop", WHY_B_AUX("stop"), "This {transport} doesn't ______ (stop) in {place} on Sunday.", { transport: ["bus", "train", "minibus", "tram"], place: ["Chirchiq", "Angren", "our village", "the centre"] }],
  ["open", WHY_B_AUX("open"), "The {shop} don't ______ (open) until {time} tomorrow.", { shop: ["shops", "banks", "markets", "cafés"], time: ["ten", "eleven", "noon", "nine"] }],
  ["end", WHY_B_AUX("end"), "The {event} doesn't ______ (end) until {time} tonight, {name}.", { event: ["concert", "match", "show", "film"], time: ["eleven", "midnight", "half past ten", "ten"], name: NAME }],
  ["leave", WHY_B_AUX("leave"), "Our flight doesn't ______ (leave) until {time}, so we can sleep longer tomorrow, {name}.", { time: ["noon", "two", "eleven", "three"], name: NAME }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TT = "It's on the timetable. Rewrite the sentence with the present simple instead of will.";
const Q = "Write the question for this answer. Use the present simple.";
const FIX = "Correct the mistake. Use the present simple.";
const whyQ = (aux) => `Present simple question: ${aux} + the subject, then the base verb.`;
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [TT, "The train will leave at {time} tomorrow, {name}.", "The train ______ at {time} tomorrow, {name}.", "leaves", WHY_SG("leaves"), { time: ["six", "7:15", "half past eight", "noon"], name: NAME }],
  [TT, "The {shop} will open at {time} on Monday.", "The {shop} ______ at {time} on Monday.", "opens", WHY_SG("opens"), { shop: ["bank", "library", "pharmacy", "bakery"], time: ["eight", "nine", "ten", "half past nine"] }],
  [TT, "Our lessons will start at {time} next week, {name}.", "Our lessons ______ at {time} next week, {name}.", "start", WHY_PL("start"), { time: ["eight", "half past eight", "nine", "ten"], name: NAME }],
  [TT, "The {event} will finish at {time} tonight.", "The {event} ______ at {time} tonight.", "finishes", WHY_SG("finishes"), { event: ["concert", "match", "film", "show"], time: ["ten", "eleven", "half past ten", "midnight"] }],
  [TT, "The buses to {city} will run every {n} minutes tomorrow.", "The buses to {city} ______ every {n} minutes tomorrow.", "run", WHY_PL("run"), { city: CITY, n: ["ten", "twenty", "thirty", "fifteen"] }],
  [Q, "The film starts at {time} tonight, {name}.", "What time ______ start tonight, {name}?", "does the film", whyQ("does"), { time: ["seven", "eight", "nine", "half past seven"], name: NAME }],
  [Q, "The train to {city} leaves at {time}.", "When ______ to {city} leave?", "does the train", whyQ("does"), { city: CITY, time: ["six", "seven", "noon", "9:40"] }],
  [Q, "The shops open at {time} on {day}.", "What time ______ open on {day}?", "do the shops", whyQ("do"), { time: ["nine", "ten", "eight", "eleven"], day: ["Saturday", "Sunday", "Friday", "Monday"] }],
  [Q, "Our exams begin on {day}, {name}.", "When ______ begin, {name}?", "do your exams", "Present simple question: do + your exams + begin. Use your when you ask about the other person's exams.", { day: ["Monday", "Tuesday", "the 10th", "Thursday"], name: NAME }],
  [Q, "The concert ends at {time}, {name}.", "What time ______ end, {name}?", "does the concert", whyQ("does"), { time: ["ten", "eleven", "half past ten", "midnight"], name: NAME }],
  [FIX, "The bus leave at {time} tomorrow, {name}.", "The bus ______ at {time} tomorrow, {name}.", "leaves", "One bus → leaves, with -s.", { time: ["six", "7:10", "eight", "half past seven"], name: NAME }],
  [FIX, "What time does the lesson starts on {day}, {name}?", "What time does the lesson ______ on {day}, {name}?", "start", "After does, use the base form: start, not starts.", { day: ["Monday", "Tuesday", "Thursday", "Friday"], name: NAME }],
  [FIX, "The shops opens at {time} on {day}.", "The shops ______ at {time} on {day}.", "open", "The shops is plural → open, with no -s.", { time: ["nine", "ten", "eight", "eleven"], day: ["Saturday", "Sunday", "Friday", "Monday"] }],
  [FIX, "Our plane landed in {city} at {time} tomorrow.", "Our plane ______ in {city} at {time} tomorrow.", "lands", "Tomorrow is the future, so not the past: a timetable takes the present simple, lands.", { city: FLY, time: ["six", "noon", "midnight", "7:30"] }],
  [FIX, "Does the {event} begins at {time}?", "Does the {event} ______ at {time}?", "begin", "After does, use the base form: begin, not begins.", { event: ["concert", "match", "show", "film"], time: ["six", "seven", "eight", "nine"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about when your next lesson or class starts.", "present simple for a timetable", ["exactly one sentence", "starts or begins", "a time"]],
  ["Write one sentence about when a train, bus or flight you know leaves.", "leaves at + time", ["exactly one sentence", "leaves or departs", "a future time word"]],
  ["Write one question about when a shop or museum opens tomorrow.", "What time does / do … open?", ["exactly one question", "does or do", "tomorrow"]],
  ["Write one sentence about when your holidays begin or end.", "present simple for a fixed date", ["exactly one sentence", "begin / end", "next or a date"]],
  ["Write one sentence about a film or match on TV this week and when it starts.", "starts at + time", ["exactly one sentence", "present simple", "a day and a time"]],
  ["Write one sentence with doesn't about a bus or shop timetable.", "doesn't + base verb", ["exactly one sentence", "doesn't + base form", "a time or day"]],
  ["Write one question to a friend about when their exams or course start.", "When do your … start?", ["exactly one question", "do + your", "base verb"]],
  ["Write two sentences about tomorrow: one fixed timetable and one plan of your own.", "present simple vs going to", ["exactly two sentences", "present simple for the timetable", "going to for your plan"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your timetable for tomorrow: when your lessons or work start and finish. Write three or four sentences.", "present simple for a timetable", ["starts / finishes", "at + time", "three or four sentences"]],
  ["You are going on a trip by train or plane. Tell a friend the times. Write three or four sentences.", "leaves / arrives / lands", ["present simple for times", "tomorrow or next", "a place"]],
  ["Write a short message to a friend about a concert or match: when it starts, when it ends, when the last bus leaves.", "present simple for events", ["starts / ends", "leaves", "times"]],
  ["Ask a friend three questions about a trip timetable.", "What time does …?", ["does / do", "base verb after does", "three questions"]],
  ["Describe the opening hours of a shop, museum or café near you. Write three or four sentences.", "opens / closes", ["opens / closes", "doesn't open until", "days and times"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
// Audit 21 Nov (MED/LOW): extra right answers.
const AUDIT_ACC = [
  ["transform", "When ______ begin", ["do the exams"]],
];
for (const [st, m, acc] of AUDIT_ACC) {
  const hit = items.filter((it) => it.stage === st && [it.prompt, it.source, it.hint].filter(Boolean).join(" ").includes(m));
  if (!hit.length) throw new Error(`AUDIT_ACC: no ${st} item matches ${m}`);
  for (const it of hit) it.acceptable = [...new Set([...(it.acceptable || []), ...acc])];
}
const out = "content/grammar-practice/tenses.future.timetable-simple.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "A train timetable, even for \"tomorrow morning\": present simple leaves.",
   "A film's fixed start time: present simple starts.",
   "A school timetable for next Monday: starts.",
   "Shop opening hours tomorrow: present simple opens.",
   "A fixed concert time tonight: finishes.",
   "A flight timetable: takes off, present simple.",
   "A course start date on the calendar: begins.",
   "A bus timetable for tonight: leaves.",
   "A fixed event time next Saturday: ends.",
   "The museum's timetable next week: closes.",
   "Plural \"buses\" on a timetable: run, no -s.",
   "Plural \"shops\" with fixed hours: close.",
   "Plural \"exams\" on a fixed date: start.",
   "Plural transport times tomorrow: leave.",
   "Plural \"holidays\" on the school calendar: start.",
   "Plural \"Lessons\" on tomorrow's timetable: finish.",
   "Question about a fixed time, singular event: does.",
   "Question about \"the next\" one on the timetable: does.",
   "Question about shop hours, plural: do.",
   "Yes/no question, plural exams: Do … begin."
  ],
  "build": [
   "Timetable for tomorrow, singular: leaves.",
   "School timetable, singular class: starts.",
   "Opening hours tomorrow, singular shop: opens.",
   "Fixed film time, singular: finishes.",
   "Flight timetable: lands.",
   "Fixed event time, singular: begins.",
   "Plural shops, fixed hours: close.",
   "Plural holidays on the calendar: end.",
   "Plural trains on the timetable: run.",
   "A course start date, singular: begins.",
   "Museum hours today, singular: closes.",
   "Plural lessons, fixed time: finish.",
   "After does, the base verb: start.",
   "After does, the base verb: leave.",
   "After do, the base verb: open.",
   "After Does, the base verb: begin.",
   "After doesn't, the base verb: stop.",
   "After don't, the base verb: open.",
   "After doesn't, the base verb: end.",
   "After doesn't, the base verb: leave."
  ],
  "transform": [
   "Timetables use the present simple, not will: leaves.",
   "Opening hours: present simple, not will: opens.",
   "A school timetable, plural lessons: start.",
   "A fixed event time: finishes.",
   "A bus timetable, plural buses: run.",
   "Question about a fixed time: does + the film.",
   "Question about a timetable: does + the train.",
   "Question about shop hours, plural: do + the shops.",
   "Question about exam dates: do + your exams.",
   "Question about a fixed end time: does + the concert.",
   "Singular bus needs -s: leaves.",
   "After does, no -s: start.",
   "Plural shops, no -s: open.",
   "\"tomorrow\" on a timetable needs the present simple, not landed: lands.",
   "After Does, no -s: begin."
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
