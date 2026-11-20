// Hand-authored: verb-patterns / gerund-infinitive / look-forward-to (B1).
// Wave C, C26 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item): look forward to + -ing / noun. The "to" is a
// preposition, so the verb after it takes -ing ("I look forward to see you" → seeing).
// Triage: kept. Sibling get-used-to (C25) has the same "to"; here only look forward
// to. "I look forward to" and "I'm looking forward to" are both right and never
// contrasted.
// Choose: 14 the verb after it (-ing / base / to + base / past); 6 the preposition
// (to / for / on / at).
// Build: -ing of the verb in brackets (20).
// Transform: 5 correct the mistake / 5 I can't wait to … → I'm looking forward to … /
// 5 email endings: I hope to … → I look forward to ….
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/verb-patterns.gerund-infinitive.look-forward-to.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "gerund-infinitive", topic: "look-forward-to", level: "B1", pv: "2.5" };
const NAME = ["Gulnora", "Jamshid", "Zarina", "Sherzod"];
const NAME2 = ["Nodira", "Akmal", "Feruza", "Otabek"];
const V = (ing, base, past) => [ing, base, `to ${base}`, past];
const PREP = ["to", "for", "on", "at"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [V("seeing", "see", "saw"), "I'm looking forward to ______ you at the {event}, {name}.", { event: ["wedding", "party", "concert", "match"], name: NAME }, "look forward to + -ing: seeing, because this \"to\" is a preposition."],
  [V("going", "go", "went"), "The children are looking forward to ______ to the {place} on Saturday.", { place: ["zoo", "lake", "water park", "circus"], x: [] }, "after look forward to, use -ing: going."],
  [V("hearing", "hear", "heard"), "I look forward to ______ from you soon, {name}.", { name: NAME2, x: [] }, "A polite email ending: look forward to hearing."],
  [V("meeting", "meet", "met"), "We're looking forward to ______ your {who} next week, {name}.", { who: ["parents", "family", "new boss", "cousins"], name: NAME }, "look forward to + -ing: meeting."],
  [V("visiting", "visit", "visited"), "My grandparents are looking forward to ______ {city} in May.", { city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"], x: [] }, "look forward to + -ing: visiting."],
  [V("starting", "start", "started"), "I'm really looking forward to ______ my new {job}, {name}.", { job: ["job", "course", "school", "classes"], name: NAME2 }, "look forward to + -ing: starting."],
  [V("having", "have", "had"), "Everyone is looking forward to ______ a break after the {test}, {name}.", { test: ["exams", "project", "busy week", "match"], name: NAME }, "look forward to + -ing: having."],
  [V("trying", "try", "tried"), "We look forward to ______ the {food} at the new café.", { food: ["plov", "soup", "desserts", "coffee"], x: [] }, "look forward to + -ing: trying."],
  [V("working", "work", "worked"), "We look forward to ______ with you, {name}.", { name: NAME2, x: [] }, "A formal ending: look forward to working with you."],
  [V("playing", "play", "played"), "My son is looking forward to ______ in the {match} on Sunday.", { match: ["final", "big match", "school match", "tournament"], x: [] }, "look forward to + -ing: playing."],
  [V("travelling", "travel", "travelled"), "Are you looking forward to ______ to {country}, {name}?", { country: ["Japan", "Italy", "Turkey", "Egypt"], name: NAME }, "look forward to + -ing: travelling."],
  [V("watching", "watch", "watched"), "I'm looking forward to ______ the new {film} with you, {name}.", { film: ["film", "series", "show", "cartoon"], name: NAME2 }, "look forward to + -ing: watching."],
  [V("getting", "get", "got"), "She's looking forward to ______ her exam results on {day}.", { day: ["Monday", "Friday", "Tuesday", "Thursday"], x: [] }, "look forward to + -ing: getting."],
  [V("sleeping", "sleep", "slept"), "After this long {trip}, I'm looking forward to ______ in my own bed, {name}.", { trip: ["trip", "flight", "week", "journey"], name: NAME }, "look forward to + -ing: sleeping."],
  [PREP, "I'm looking forward ______ the holidays, {name}.", { name: NAME2, x: [] }, "The phrase is always look forward to."],
  [PREP, "We look forward ______ your reply about the {thing}.", { thing: ["room", "job", "order", "course"], x: [] }, "look forward to + noun: to your reply."],
  [PREP, "My little brother is looking forward ______ his birthday {event}, {name}.", { event: ["party", "cake", "presents", "trip"], name: NAME }, "look forward to + noun: to his birthday party."],
  [PREP, "Are you looking forward ______ the {event} on Friday, {name}?", { event: ["concert", "wedding", "match", "trip"], name: NAME2 }, "look forward to, not for or on."],
  [PREP, "Our team is looking forward ______ the final in {city}.", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"], x: [] }, "look forward to + noun: to the final."],
  [PREP, "I always look forward ______ Navruz, {name}.", { name: NAME, x: [] }, "look forward to + noun: to Navruz."],
].map(([o, prompt, slots, why], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete with the right form of the verb in brackets.";
const BUILD = [
  ["seeing", "I'm looking forward to ______ (see) my cousins in {city}, {name}.", { city: ["Samarkand", "Fergana", "Andijan", "Nukus"], name: NAME }],
  ["going", "We're looking forward to ______ (go) to the {place} tomorrow.", { place: ["mountains", "lake", "seaside", "countryside"], x: [] }],
  ["hearing", "I look forward to ______ (hear) your news, {name}.", { name: NAME2, x: [] }],
  ["meeting", "Our class is looking forward to ______ (meet) the new {who}.", { who: ["teacher", "students", "coach", "director"], x: [] }],
  ["moving", "My parents are looking forward to ______ (move) into the new {home}, {name}.", { home: ["flat", "house", "district", "village"], name: NAME }],
  ["eating", "I'm looking forward to ______ (eat) Grandma's {food} on Sunday, {name}.", { food: ["plov", "manti", "samsa", "soup"], name: NAME2 }],
  ["learning", "She's looking forward to ______ (learn) {lang} at university.", { lang: ["Korean", "Chinese", "German", "Arabic"], x: [] }],
  ["swimming", "The kids are looking forward to ______ (swim) in the {water}, {name}.", { water: ["sea", "lake", "pool", "river"], name: NAME }],
  ["finishing", "I'm looking forward to ______ (finish) this {work}, {name}.", { work: ["project", "essay", "course", "book"], name: NAME2 }],
  ["celebrating", "We're looking forward to ______ (celebrate) {event} together.", { event: ["Navruz", "New Year", "Mum's birthday", "the wedding"], x: [] }],
  ["working", "I look forward to ______ (work) with your {team}, {name}.", { team: ["team", "company", "school", "group"], name: NAME }],
  ["riding", "My son is looking forward to ______ (ride) his new {bike}, {name}.", { bike: ["bike", "scooter", "horse", "skateboard"], name: NAME2 }],
  ["having", "Everyone is looking forward to ______ (have) a day off on {day}.", { day: ["Monday", "Friday", "Navruz", "Independence Day"], x: [] }],
  ["staying", "We're looking forward to ______ (stay) at a hotel in {city}, {name}.", { city: ["Istanbul", "Dubai", "Bukhara", "Khiva"], name: NAME }],
  ["watching", "Dad is looking forward to ______ (watch) the {match} tonight.", { match: ["final", "big match", "derby", "game"], x: [] }],
  ["speaking", "I'm looking forward to ______ (speak) with you on the phone, {name}.", { name: NAME2, x: [] }],
  ["receiving", "We look forward to ______ (receive) your {doc}, {name}.", { doc: ["order", "letter", "application", "photos"], name: NAME }],
  ["opening", "The children are looking forward to ______ (open) their {thing}.", { thing: ["presents", "gifts", "boxes", "cards"], x: [] }],
  ["showing", "I'm looking forward to ______ (show) you my {home}, {name}.", { home: ["new flat", "garden", "town", "school"], name: NAME2 }],
  ["coming", "Are you looking forward to ______ (come) home after the {trip}, {name}?", { trip: ["trip", "camp", "course", "army service"], name: NAME }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  const why = `look forward to + -ing: ${key}. The "to" here is a preposition, so the verb cannot be the base form.`;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const FIX = "Correct the mistake.";
const WAIT = "Rewrite with I'm (really) looking forward to.";
const MAIL = "Rewrite as a polite ending with I look forward to.";
const TRANSFORM = [
  [FIX, "I look forward to see you in {city}, {name}.", "I look forward to ______ you in {city}, {name}.", "seeing", { city: ["Samarkand", "Bukhara", "Khiva", "Termez"], name: NAME }, "look forward to + -ing: seeing, not see."],
  [FIX, "We're looking forward for the {event}, {name}.", "We're looking forward ______ the {event}, {name}.", "to", { event: ["wedding", "holidays", "concert", "match"], name: NAME2 }, "The phrase is look forward to, not for."],
  [FIX, "She's looking forward to start her new {job}.", "She's looking forward to ______ her new {job}.", "starting", { job: ["job", "course", "school", "classes"], x: [] }, "look forward to + -ing: starting."],
  [FIX, "My kids look forward to went to the {place}, {name}.", "My kids look forward to ______ to the {place}, {name}.", "going", { place: ["zoo", "lake", "water park", "circus"], name: NAME }, "look forward to + -ing: going."],
  [FIX, "I'm looking forward to meet your {who}, {name}.", "I'm looking forward to ______ your {who}, {name}.", "meeting", { who: ["parents", "family", "sister", "friends"], name: NAME2 }, "look forward to + -ing: meeting."],
  [WAIT, "I can't wait to see the {sight}, {name}!", "I'm really looking forward to ______ the {sight}, {name}!", "seeing", { sight: ["mountains", "sea", "old town", "fireworks"], name: NAME }, "look forward to + -ing: seeing."],
  [WAIT, "I can't wait to try the {food} in {city}, {name}.", "I'm looking forward to ______ the {food} in {city}, {name}.", "trying", { food: ["plov", "samsa", "bread", "kebabs"], city: ["Samarkand", "Bukhara", "Tashkent", "Khiva"], name: NAME2 }, "look forward to + -ing: trying."],
  [WAIT, "I can't wait to have a holiday at the {place}, {name}.", "I'm really looking forward to ______ a holiday at the {place}, {name}.", "having", { place: ["sea", "lake", "mountains", "dacha"], name: NAME }, "look forward to + -ing: having."],
  [WAIT, "I can't wait to play with my new {thing}, {name}!", "I'm looking forward to ______ with my new {thing}, {name}!", "playing", { thing: ["ball", "game", "puppy", "drone"], name: NAME2 }, "look forward to + -ing: playing."],
  [WAIT, "I can't wait to sleep in the {place} tonight, {name}.", "I'm really looking forward to ______ in the {place} tonight, {name}.", "sleeping", { place: ["tent", "mountains", "garden", "new bed"], name: NAME }, "look forward to + -ing: sleeping."],
  [MAIL, "I hope to hear from you soon, {name}.", "I look forward to ______ from you soon, {name}.", "hearing", { name: NAME2, x: [] }, "Email ending: I look forward to hearing from you."],
  [MAIL, "I hope we meet at the {event}, {name}.", "I look forward to ______ you at the {event}, {name}.", "meeting", { event: ["conference", "meeting", "party", "interview"], name: NAME }, "look forward to + -ing: meeting you."],
  [MAIL, "I hope to work with your {team}, {name}.", "I look forward to ______ with your {team}, {name}.", "working", { team: ["team", "company", "school", "group"], name: NAME2 }, "look forward to + -ing: working."],
  [MAIL, "I hope to receive your answer about the {thing} soon.", "I look forward to ______ your answer about the {thing}.", "receiving", { thing: ["room", "job", "order", "course"], x: [] }, "look forward to + -ing: receiving."],
  [MAIL, "I hope to visit your {place} next month, {name}.", "I look forward to ______ your {place} next month, {name}.", "visiting", { place: ["school", "office", "factory", "shop"], name: NAME }, "look forward to + -ing: visiting."],
].map(([instr, source, hint, key, slots, why]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you are looking forward to this month.", "I'm looking forward to + -ing / noun", ["exactly one sentence", "looking forward to", "-ing or a noun"]],
  ["Write a polite last sentence for an email to a new teacher.", "I look forward to + -ing", ["exactly one sentence", "look forward to", "-ing"]],
  ["Write one sentence about a trip you are looking forward to.", "… looking forward to visiting / going …", ["exactly one sentence", "looking forward to", "-ing"]],
  ["Write one question with Are you looking forward to …?", "Are you looking forward to …?", ["exactly one question", "looking forward to", "a question mark"]],
  ["Write one sentence about a family member who is looking forward to something.", "My … is looking forward to …", ["exactly one sentence", "is looking forward to", "-ing or a noun"]],
  ["Write one sentence with look forward to + a noun (no verb).", "look forward to + noun", ["exactly one sentence", "look forward to", "a noun"]],
  ["Write one sentence with can't wait to and one with looking forward to.", "can't wait to + base / look forward to + -ing", ["exactly two sentences", "can't wait to + base", "looking forward to + -ing"]],
  ["Write one sentence about something you are NOT looking forward to.", "I'm not looking forward to …", ["exactly one sentence", "not looking forward to", "-ing"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write a short email (three or four sentences) to a new pen friend. End with look forward to.", "look forward to + -ing", ["look forward to", "-ing", "three or four sentences"]],
  ["Describe the next holiday. What are you and your family looking forward to? Write three or four sentences.", "looking forward to + -ing / noun", ["looking forward to", "-ing", "three or four sentences"]],
  ["Write three or four sentences about your plans for next year and what you look forward to.", "look forward to", ["look forward to", "-ing or a noun", "three or four sentences"]],
  ["Write a short formal email (three or four sentences) to a hotel about your booking.", "formal look forward to", ["I look forward to", "-ing", "three or four sentences"]],
  ["Write three or four sentences about things you are and aren't looking forward to this week.", "(not) looking forward to", ["looking forward to", "not looking forward to", "-ing"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.gerund-infinitive.look-forward-to.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
