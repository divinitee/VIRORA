// Hand-authored: reported-speech / statements / backshift-will (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): reporting will later: will → would, won't →
// wouldn't, and the time word moves too (tomorrow → the next day, next week → the
// following week, tonight → that night), with you → me.
// One right answer: reported on the same day, "He said he will call me tomorrow" is
// English. So every line is reported LATER (last week / last month / on Monday),
// when the promise time is over; will and tomorrow are then wrong.
// Triage: kept. Siblings backshift-present / backshift-past.
// Choose: 12 would / will / would to / will be; 8 time words (the next day /
// tomorrow / yesterday / the day before …).
// Build: 14 would (wouldn't) + the verb, cue "(will / call)"; 6 time words, cue
// "(tomorrow)". No source prints would; time-word sources never print "the".
// Transform: 5 report the promise / 5 correct the mistake / 5 would + time word
// (array key).
//
// Run: node tools/grammar-practice/authored/reported-speech.statements.backshift-will.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "reported-speech", branch: "statements", topic: "backshift-will", level: "B1", pv: "2.5" };
const M = ["Aziz", "Timur", "Bekzod", "Rustam"];
const F = ["Olga", "Lola", "Madina", "Sevara"];
const WHY = "Reported later: will → would (won't → wouldn't), and tomorrow → the next day.";
const WHY_T = "Reported later, the time word moves too: tomorrow → the next day, next week → the following week, tonight → that night, today → that day.";
const MOD = ["would", "will", "would to", "will be"];
const NEG = ["wouldn't", "won't", "wouldn't to", "didn't"];
const DAY = ["the next day", "tomorrow", "yesterday", "the day before"];
const WEEK = ["the following week", "next week", "last week", "the week before"];
const NIGHT = ["that night", "tonight", "last night", "the night before"];
const TODAY = ["that day", "today", "yesterday", "the day after"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [MOD, WHY, "Last week {m} said, 'I'll call you tomorrow.' He said he ______ call me the next day.", { m: M, x: [] }],
  [MOD, WHY, "On Monday {f} said, 'I'll bring the {thing}.' She said she ______ bring the {thing}.", { f: F, thing: ["cake", "music", "chairs", "drinks"] }],
  [MOD, WHY, "Last year the {who} said, 'The {place} will open in May.' He said the {place} ______ open in May. It opened in June.", { who: ["headteacher", "director", "manager", "builder"], place: ["new school", "metro station", "park", "hospital"] }],
  [MOD, WHY, "Last year {m} said, 'I'll learn {lang}.' He said he ______ learn {lang}.", { m: M, lang: ["Korean", "English", "Turkish", "German"] }],
  [MOD, WHY, "Last week my {who} said, 'We'll help you move.' They said they ______ help me move.", { who: ["friends", "cousins", "neighbours", "brothers"], x: [] }],
  [MOD, WHY, "Last month {f} said, 'It will rain in {city} at the weekend.' She said it ______ rain in {city} that weekend.", { f: F, city: ["Tashkent", "Samarkand", "Fergana", "Bukhara"] }],
  [MOD, WHY, "Last month the {who} said, 'Prices will go up.' He said prices ______ go up. They went up in June.", { who: ["shopkeeper", "manager", "baker", "driver"], x: [] }],
  [MOD, WHY, "Last winter {m} said, 'I'll fix the {thing} soon.' He said he ______ fix the {thing} soon.", { m: M, thing: ["roof", "car", "heater", "door"] }],
  [NEG, WHY, "Last week {f} said, 'I won't be late.' She said she ______ be late for the {event}.", { f: F, event: ["wedding", "meeting", "lesson", "match"] }],
  [NEG, WHY, "On Sunday {m} said, 'I won't tell anyone.' He said he ______ tell anyone about the {thing}.", { m: M, thing: ["party", "gift", "plan", "test"] }],
  [NEG, WHY, "Last month the {who} said, 'It won't take long.' She said it ______ take long.", { who: ["doctor", "teacher", "mechanic", "nurse"], x: [] }],
  [NEG, WHY, "Last year my {who} said, 'We won't sell the {thing}.' They said they ______ sell the {thing}. But they sold it this spring.", { who: ["parents", "grandparents", "neighbours", "uncles"], thing: ["house", "car", "garden", "piano"] }],
  [DAY, WHY_T, "Last week {m} said, 'I'll come tomorrow.' He said he would come ______.", { m: M, x: [] }],
  [DAY, WHY_T, "On Monday {f} said, 'I'll send the {doc} tomorrow.' She said she would send the {doc} ______.", { f: F, doc: ["report", "photos", "email", "ticket"] }],
  [WEEK, WHY_T, "Last month {m} said, 'I'll visit you next week.' He said he would visit me ______.", { m: M, x: [] }],
  [WEEK, WHY_T, "In May the {who} said, 'The {test} will be next week.' She said the {test} would be ______.", { who: ["teacher", "director", "coach", "manager"], test: ["test", "exam", "match", "meeting"] }],
  [NIGHT, WHY_T, "Last Friday {f} said, 'I'll phone you tonight.' She said she would phone me ______.", { f: F, x: [] }],
  [NIGHT, WHY_T, "Last week {m} said, 'We'll watch the {film} tonight.' He said they would watch the {film} ______.", { m: M, film: ["film", "match", "final", "show"] }],
  [TODAY, WHY_T, "Last week {f} said, 'I'll finish the {work} today.' She said she would finish the {work} ______.", { f: F, work: ["report", "essay", "project", "painting"] }],
  [TODAY, WHY_T, "On Monday {m} said, 'I'll pay you today.' He said he would pay me ______.", { m: M, x: [] }],
].map(([o, why, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Report it later. Change will to would (won't to wouldn't) and use the verb in brackets.";
const INSTR_T = "Report it later. Change the time word in brackets.";
// Audit 21 Nov: two-gap time items use only time words with one answer (that night / that day),
// because array keys cannot list "the following day" etc.
// [instr, key, acceptable, why, source, slots] — no source prints would; time-word sources never print "the"
const BUILD = [
  [INSTR, "would call", [], WHY, "Last week {m} said he ______ (will / call) me soon.", { m: M, x: [] }],
  [INSTR, "would bring", [], WHY, "On Monday {f} said she ______ (will / bring) the {thing}.", { f: F, thing: ["cake", "music", "chairs", "drinks"] }],
  [INSTR, "would open", [], WHY, "Last year the {who} said the {place} ______ (will / open) in May. It opened in June.", { who: ["headteacher", "director", "manager", "builder"], place: ["new school", "metro station", "park", "hospital"] }],
  [INSTR, "would learn", [], WHY, "Last year {m} said he ______ (will / learn) {lang}.", { m: M, lang: ["Korean", "English", "Turkish", "German"] }],
  [INSTR, "would help", [], WHY, "Last week my {who} said they ______ (will / help) me move.", { who: ["friends", "cousins", "neighbours", "brothers"], x: [] }],
  [INSTR, "would rain", [], WHY, "Last month {f} said it ______ (will / rain) in {city} that weekend.", { f: F, city: ["Tashkent", "Samarkand", "Fergana", "Bukhara"] }],
  [INSTR, "would go", [], WHY, "Last month the {who} said prices ______ (will / go) up. They went up in June.", { who: ["shopkeeper", "manager", "baker", "driver"], x: [] }],
  [INSTR, "would fix", [], WHY, "Last winter {m} said he ______ (will / fix) the {thing} soon.", { m: M, thing: ["roof", "car", "heater", "door"] }],
  [INSTR, "would meet", [], WHY, "In June {f} said she ______ (will / meet) us at the {place}.", { f: F, place: ["station", "airport", "café", "bazaar"] }],
  [INSTR, "would win", [], WHY, "Before the match, {m} said {team} ______ (will / win).", { m: M, team: ["Sunrise FC", "Blue Star", "Green Valley", "Riverside"] }],
  [INSTR, "wouldn't be", [], WHY, "Last week {f} said she ______ (won't / be) late for the {event}.", { f: F, event: ["wedding", "meeting", "lesson", "match"] }],
  [INSTR, "wouldn't tell", [], WHY, "On Sunday {m} said he ______ (won't / tell) anyone about the {thing}.", { m: M, thing: ["party", "gift", "plan", "test"] }],
  [INSTR, "wouldn't take", [], WHY, "Last month the {who} said it ______ (won't / take) long.", { who: ["doctor", "teacher", "mechanic", "nurse"], x: [] }],
  [INSTR, "wouldn't sell", [], WHY, "Last year my {who} said they ______ (won't / sell) the {thing}. But they sold it this spring.", { who: ["parents", "grandparents", "neighbours", "uncles"], thing: ["house", "car", "garden", "piano"] }],
  [INSTR_T, "the next day", ["the following day"], WHY_T, "Last week {m} said he would come ______ (tomorrow).", { m: M, x: [] }],
  [INSTR_T, "the next day", ["the following day"], WHY_T, "On Monday {f} said she would send my {doc} ______ (tomorrow).", { f: F, doc: ["report", "photos", "email", "ticket"] }],
  [INSTR_T, "the following week", ["the next week"], WHY_T, "Last month {m} said he would visit me ______ (next week).", { m: M, x: [] }],
  [INSTR_T, "that night", [], WHY_T, "Last Friday {f} said she would phone me ______ (tonight).", { f: F, x: [] }],
  [INSTR_T, "that day", [], WHY_T, "Last week {f} said she would finish her {work} ______ (today).", { f: F, work: ["report", "essay", "project", "painting"] }],
  [INSTR_T, "that day", [], WHY_T, "On Monday {m} said he would pay me ______ (today).", { m: M, x: [] }],
].map(([instr, key, acceptable, why, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr, source, key, ...(acceptable.length ? { acceptable } : {}), why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REP = "Report the promise. Change the pronoun and will.";
const FIX = "Correct the mistake. It was said last week.";
const TIME = "Report it. Change will and the time word.";
const TRANSFORM = [
  [REP, "'I'll help you with the {work},' {f} said last week.", "Last week {f} said that she ______ with the {work}.", "would help me", { f: F, work: ["move", "homework", "party", "cooking"] }],
  [REP, "'I'll lend you my {thing},' {m} said last month.", "Last month {m} said that he ______ his {thing}.", "would lend me", { m: M, thing: ["car", "bike", "camera", "laptop"] }],
  [REP, "'We'll call you from {city},' my {who} said last week.", "Last week my {who} said that they ______ from {city}.", "would call me", { who: ["parents", "friends", "cousins", "neighbours"], city: ["Moscow", "Istanbul", "Dubai", "Seoul"] }],
  [REP, "'I won't forget your {day},' {m} said last year.", "Last year {m} said that he ______ my {day}.", "wouldn't forget", { m: M, day: ["birthday", "name", "number", "advice"] }],
  [REP, "'I'll wait for you at the {place},' {f} said on Monday.", "On Monday {f} said that she ______ for me at the {place}.", "would wait", { f: F, place: ["station", "gate", "café", "bus stop"] }],
  [FIX, "Last week {m} said he will call me from the {place} the next day.", "Last week {m} said he ______ call me from the {place} the next day.", "would", { m: M, place: ["office", "station", "airport", "hotel"] }],
  [FIX, "Last month {f} said she would visit us in {city} next week.", "Last month {f} said she would visit us in {city} ______.", "the following week", { f: F, city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  [FIX, "On Monday {m} said he would finish his {work} tomorrow.", "On Monday {m} said he would finish his {work} ______.", "the next day", { m: M, work: ["report", "essay", "project", "painting"] }],
  [FIX, "Last week {f} said she won't be late for the {event}.", "Last week {f} said she ______ be late for the {event}.", "wouldn't", { f: F, event: ["wedding", "meeting", "lesson", "match"] }],
  [FIX, "Last Friday {m} said he would phone me from {city} tonight.", "Last Friday {m} said he would phone me from {city} ______.", "that night", { m: M, city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  [TIME, "'I'll come to the {event} tonight,' {m} said last week.", "Last week {m} said he ______ come to the {event} ______.", ["would", "that night"], { m: M, event: ["party", "wedding", "match", "meeting"] }],
  [TIME, "'We'll visit you in {city} today,' my {who} said on Monday.", "On Monday my {who} said they ______ visit me in {city} ______.", ["would", "that day"], { who: ["parents", "friends", "cousins", "neighbours"], city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  [TIME, "'I'll phone you from the {place} tonight,' {f} said on Friday.", "On Friday {f} said she ______ phone me from the {place} ______.", ["would", "that night"], { f: F, place: ["office", "station", "airport", "hotel"] }],
  [TIME, "'I'll pay you for the {thing} today,' {m} said on Monday.", "On Monday {m} said he ______ pay me for the {thing} ______.", ["would", "that day"], { m: M, thing: ["tickets", "food", "taxi", "book"] }],
  [TIME, "'The {test} will be tonight,' the {who} said last week.", "Last week the {who} said the {test} ______ be ______.", ["would", "that night"], { test: ["test", "exam", "match", "meeting"], who: ["teacher", "director", "coach", "manager"] }],
].map(([instr, source, hint, key, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Last week a friend said: 'I'll call you tomorrow.' Report it now.", "… said he / she would call me the next day", ["exactly one sentence", "would", "the next day"]],
  ["Report a promise someone made to you last month.", "… said … would …", ["exactly one sentence", "would + base verb", "said"]],
  ["Last week your brother said: 'I won't be late.' Report it.", "He said he wouldn't be late", ["exactly one sentence", "wouldn't", "he"]],
  ["Report a weather forecast you heard last week.", "They said it would rain …", ["exactly one sentence", "would", "said"]],
  ["Last month a friend said: 'I'll visit you next week.' Report it.", "… would visit me the following week", ["exactly one sentence", "would", "the following week"]],
  ["Report something a teacher promised your class.", "The teacher said we would …", ["exactly one sentence", "would", "we / us"]],
  ["Write the direct words with will, then report them a week later.", "will → would", ["exactly two sentences", "will in quotes", "would in the report"]],
  ["Last Friday someone said: 'I'll phone you tonight.' Report it.", "… would phone me that night", ["exactly one sentence", "would", "that night"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["A friend promised you three things last month but didn't do them. Write three or four sentences reporting the promises.", "would / wouldn't in reported promises", ["said … would", "wouldn't", "three or four sentences"]],
  ["Report what a politician or a director said about the future of your town. Write three or four sentences.", "reported predictions", ["said … would", "the following year / week", "three or four sentences"]],
  ["Report the plans your family made last week for the weekend. Write three or four sentences.", "would + time word changes", ["would", "the next day / that night", "three or four sentences"]],
  ["Last year you made New Year promises. Report them in three or four sentences: I said I would …", "I said I would …", ["I said", "would", "three or four sentences"]],
  ["Report a weather forecast and what your parents said they would do. Write three or four sentences.", "would in reported speech", ["said", "would", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/reported-speech.statements.backshift-will.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
