// Hand-authored: prep-phrasal / dependent-prepositions / adjective-preposition (A2).
// Path fill P37 (Claude lane, branch grammar-path-fill-claude, 16 Nov 2026).
//
// Tests ONE point: an adjective keeps its own preposition (good at, afraid
// of). The placement item is "good ______ maths ... afraid ______ exams".
//
// Only pairs with ONE standard preposition are keyed: good / bad at; afraid /
// proud / tired / full / scared of; kind / nice / married / similar to;
// ready / famous / late for; worried / excited about; busy / pleased /
// crowded with. Left out on purpose: interested in (its own topic, P55),
// angry with/at, happy with/about, sorry for/about, different from/to,
// bored with/of, surprised at/by.
// Second-answer guard: a distractor is never a preposition some speakers use
// (no "late to", no "excited for", no "pleased about"). In the typed stage the
// instruction lists six choices, so late for, excited about and pleased with
// are kept out of it for the same reason.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.dependent-prepositions.adjective-preposition.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "dependent-prepositions", topic: "adjective-preposition", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const ANY = ["Aziz", "Lola", "Madina", "Timur"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Namangan"];
const WHY = (adj, prep) => `After ${adj} we use ${prep}: ${adj} ${prep}. The preposition is fixed, so learn the two words together.`;

/* ---------------- choose: 20 mcq ---------------- */
const C = (adj, opts, prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: opts, key: 0, why: WHY(adj, opts[0]), slots });
const CHOOSE = [
  C("good", ["at", "in", "on", "to"], "{name} is very good ______ {subj}.",
    { name: ANY, subj: ["maths", "chess", "drawing", "languages"] }),
  C("good", ["at", "in", "on", "to"], "Are you good ______ {skill}, {name}?",
    { skill: ["cooking", "sport", "singing", "computers"], name: N4 }),
  C("bad", ["at", "in", "on", "for"], "I am bad ______ remembering {things}, {name}.",
    { things: ["names", "dates", "numbers", "faces"], name: P4 }),
  C("afraid", ["of", "from", "at", "about"], "My little {sib} is afraid ______ {thing}.",
    { sib: ["brother", "sister", "cousin", "nephew"], thing: ["dogs", "the dark", "spiders", "big cars"] }),
  C("afraid", ["of", "from", "at", "about"], "Don't be afraid ______ the {thing}, {name}.",
    { thing: ["exam", "water", "doctor", "horse"], name: N4 }),
  C("proud", ["of", "for", "with", "about"], "{who} are very proud ______ their {relative}.",
    { who: ["My parents", "My grandparents", "My aunt and uncle", "Our neighbours"], relative: ["son", "daughter", "children", "grandson"] }),
  C("tired", ["of", "on", "to", "at"], "I am tired ______ {thing} every day, {name}.",
    { thing: ["this weather", "the same food", "waiting for the bus", "long lessons"], name: P4 }),
  C("full", ["of", "with", "from", "by"], "The {place} is full ______ {people} today.",
    { place: ["market", "park", "bus", "stadium"], people: ["people", "tourists", "children", "students"] }),
  C("scared", ["of", "from", "about", "at"], "{name} is scared ______ {thing}.",
    { name: ANY, thing: ["snakes", "storms", "mice", "heights"] }),
  C("kind", ["to", "with", "for", "at"], "Our new {teacher} is very kind ______ the {who}.",
    { teacher: ["teacher", "neighbour", "coach", "doctor"], who: ["children", "students", "little ones", "new boys"] }),
  C("nice", ["to", "for", "with", "at"], "Please be nice ______ your {who}, {name}.",
    { who: ["sister", "brother", "cousin", "classmates"], name: N4 }),
  C("married", ["to", "with", "on", "for"], "My {relative} is married ______ a {job}.",
    { relative: ["sister", "aunt", "cousin", "uncle"], job: ["doctor", "teacher", "driver", "farmer"] }),
  C("similar", ["to", "with", "as", "like"], "Your {thing} is very similar ______ mine, {name}.",
    { thing: ["bag", "phone", "jacket", "bike"], name: N4 }),
  C("late", ["for", "on", "of", "with"], "{name} is often late ______ {event}.",
    { name: ANY, event: ["school", "work", "dinner", "training"] }),
  C("ready", ["for", "at", "on", "with"], "Are you ready ______ the {event}, {name}?",
    { event: ["test", "trip", "match", "party"], name: N4 }),
  C("famous", ["for", "with", "of", "by"], "{city} is famous ______ its {thing}.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Margilan"], thing: ["old streets", "history", "markets", "food"] }),
  C("worried", ["about", "of", "from", "at"], "My {relative} is worried ______ my {thing}.",
    { relative: ["mother", "father", "grandmother", "aunt"], thing: ["exams", "health", "marks", "future"] }),
  C("excited", ["about", "of", "on", "from"], "The {who} are excited ______ the {event}.",
    { who: ["children", "students", "boys", "girls"], event: ["school trip", "holidays", "concert", "New Year party"] }),
  C("busy", ["with", "of", "on", "about"], "{name} is busy ______ {thing} today.",
    { name: ANY, thing: ["homework", "work", "the guests", "a project"] }),
  C("pleased", ["with", "from", "of", "on"], "The {person} was pleased ______ our {thing}.",
    { person: ["teacher", "coach", "director", "trainer"], thing: ["work", "results", "project", "answers"] }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write at, of, to, for, about or with.";
const B = (adj, prep, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: prep, why: WHY(adj, prep), slots });
const BUILD = [
  B("good", "at", "My {relative} is good ______ fixing {things}.",
    { relative: ["father", "uncle", "brother", "grandfather"], things: ["cars", "bikes", "phones", "computers"] }),
  B("bad", "at", "I was bad ______ {subj} when I was small, {name}.",
    { subj: ["maths", "physics", "drawing", "sport"], name: N4 }),
  B("good", "at", "{name} is very good ______ telling {things}.",
    { name: ANY, things: ["stories", "jokes", "funny stories", "scary stories"] }),
  B("afraid", "of", "Are you afraid ______ {thing}, {name}?",
    { thing: ["flying", "dogs", "snakes", "the dentist"], name: N4 }),
  B("afraid", "of", "{name} is not afraid ______ {thing} any more.",
    { name: ANY, thing: ["water", "the dark", "big dogs", "exams"] }),
  B("proud", "of", "We are proud ______ our {team}, {name}.",
    { team: ["team", "school", "city", "class"], name: P4 }),
  B("full", "of", "{name}, my bag is full ______ {things}.",
    { name: N4, things: ["books", "clothes", "apples", "papers"] }),
  B("tired", "of", "{name} is tired ______ the {thing}.",
    { name: ANY, thing: ["noise", "rain", "cold", "heat"] }),
  B("scared", "of", "The {pet} is scared ______ the {thing}.",
    { pet: ["cat", "dog", "puppy", "kitten"], thing: ["vacuum cleaner", "storm", "fireworks", "big dog"] }),
  B("kind", "to", "The {person} was very kind ______ us in the {place}.",
    { person: ["doctor", "driver", "woman", "guard"], place: ["hospital", "station", "airport", "hotel"] }),
  B("nice", "to", "{name} is always nice ______ new {who}.",
    { name: ANY, who: ["students", "neighbours", "classmates", "people"] }),
  B("married", "to", "{name}, Aunt Lola is married ______ a man from {city}.",
    { name: N4, city: CITY }),
  B("similar", "to", "This {thing} is similar ______ the one in the {place}.",
    { thing: ["house", "street", "bridge", "park"], place: ["photo", "film", "book", "picture"] }),
  B("ready", "for", "The {who} are ready ______ the {event}.",
    { who: ["players", "students", "children", "girls"], event: ["match", "exam", "trip", "show"] }),
  B("famous", "for", "Our {place} is famous ______ its {thing}.",
    { place: ["town", "village", "region", "street"], thing: ["bread", "melons", "market", "sweets"] }),
  B("ready", "for", "I am not ready ______ {thing} yet, {name}.",
    { thing: ["the test", "school", "winter", "the interview"], name: P4 }),
  B("worried", "about", "{name} is worried ______ the {thing}.",
    { name: ANY, thing: ["exam", "weather", "results", "interview"] }),
  B("worried", "about", "Don't be worried ______ your {thing}, {name}. It will be fine.",
    { thing: ["test", "speech", "first day", "driving lesson"], name: N4 }),
  B("busy", "with", "Sorry, {name}, I am busy ______ my {thing} now.",
    { name: N4, thing: ["homework", "project", "little brother", "work"] }),
  B("crowded", "with", "The {place} was crowded ______ {people} on {day}.",
    { place: ["bazaar", "station", "park", "square"], people: ["people", "tourists", "shoppers", "families"], day: ["Sunday", "Saturday", "Friday", "Monday"] }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const SAME = "Finish the second sentence so it means the same. Write the preposition.";
const FIX = "Correct the preposition.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // verb sentence -> adjective + preposition (5)
  T(SAME, "{name} plays {game} very well.", "{name} is good ______ {game}.", "at", WHY("good", "at"),
    { name: ANY, game: ["chess", "tennis", "football", "basketball"] }),
  T(SAME, "{name}, {thing} scare my little {sib}.", "{name}, my little {sib} is afraid ______ {thing}.", "of", WHY("afraid", "of"),
    { name: N4, thing: ["big dogs", "spiders", "snakes", "storms"], sib: ["brother", "sister", "cousin", "nephew"] }),
  T(SAME, "My {relative} always forgets {things}.", "My {relative} is bad ______ remembering {things}.", "at", WHY("bad", "at"),
    { relative: ["father", "uncle", "grandmother", "aunt"], things: ["names", "dates", "birthdays", "phone numbers"] }),
  T(SAME, "Everybody knows {city} because of its {thing}.", "{city} is famous ______ its {thing}.", "for", WHY("famous", "for"),
    { city: ["Samarkand", "Bukhara", "Khiva", "Margilan"], thing: ["old streets", "history", "markets", "food"] }),
  T(SAME, "The {exam} makes {name} nervous.", "{name} is worried ______ the {exam}.", "about", WHY("worried", "about"),
    { exam: ["exam", "test", "interview", "trip"], name: ANY }),
  // wrong preposition (5)
  T(FIX, "My sister is afraid from {thing}, {name}.", "My sister is afraid ______ {thing}, {name}.", "of", WHY("afraid", "of"),
    { thing: ["mice", "spiders", "the dark", "dogs"], name: N4 }),
  T(FIX, "{name} is very good in {subj}.", "{name} is very good ______ {subj}.", "at", WHY("good", "at"),
    { name: ANY, subj: ["maths", "English", "history", "art"] }),
  T(FIX, "She is married with a {job} from {city}.", "She is married ______ a {job} from {city}.", "to", WHY("married", "to"),
    { job: ["doctor", "teacher", "driver", "farmer"], city: CITY }),
  T(FIX, "The {place} was full with {people}.", "The {place} was full ______ {people}.", "of", WHY("full", "of"),
    { place: ["bus", "hall", "park", "market"], people: ["people", "children", "tourists", "students"] }),
  T(FIX, "We are proud for our {team}, {name}.", "We are proud ______ our {team}, {name}.", "of", WHY("proud", "of"),
    { team: ["team", "school", "class", "city"], name: P4 }),
  // same meaning, new sentence (5)
  T(SAME, "I have had enough of this {thing}, {name}.", "I am tired ______ this {thing}, {name}.", "of", WHY("tired", "of"),
    { thing: ["noise", "weather", "game", "song"], name: N4 }),
  T(SAME, "{name} can start the {event} now. Everything is prepared.", "{name} is ready ______ the {event}.", "for", WHY("ready", "for"),
    { name: ANY, event: ["lesson", "trip", "party", "match"] }),
  T(SAME, "The {person} helped us a lot in the {place}.", "The {person} was very kind ______ us in the {place}.", "to", WHY("kind", "to"),
    { person: ["doctor", "driver", "guard", "young man"], place: ["hospital", "station", "airport", "hotel"] }),
  T(SAME, "{name} has a lot of {thing} to do today.", "{name} is busy ______ {thing} today.", "with", WHY("busy", "with"),
    { name: ANY, thing: ["homework", "work", "housework", "school work"] }),
  T(SAME, "My {thing} and your {thing} are almost the same, {name}.", "My {thing} is similar ______ yours, {name}.", "to", WHY("similar", "to"),
    { thing: ["bag", "phone", "jacket", "bike"], name: N4 }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you are good at.", "good at + noun or -ing", ["exactly one sentence", "must be about you", "must use good at"]],
  ["Write one sentence about something you are afraid of, or were afraid of as a child.", "afraid of + noun", ["exactly one sentence", "must use afraid of", "must not use afraid from"]],
  ["Write one sentence about a person or a team you are proud of.", "proud of + noun", ["exactly one sentence", "must use proud of", "must name the person or team"]],
  ["Write one sentence about something your town or village is famous for.", "famous for + noun", ["exactly one sentence", "must use famous for", "must name the place"]],
  ["Write one sentence about something you are worried about this week.", "worried about + noun", ["exactly one sentence", "must use worried about", "must be about this week"]],
  ["Write one sentence about a person who is kind to you.", "kind to + person", ["exactly one sentence", "must use kind to", "must name the person"]],
  ["Write two sentences: one thing you are good at and one thing you are bad at.", "good at and bad at", ["exactly two sentences", "must use good at", "must use bad at"]],
  ["A friend wrote: \"I am afraid from dogs and I am not good in sport.\" Write the sentence correctly.", "afraid of and good at", ["exactly one sentence", "must use afraid of", "must use good at"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What are you good at and bad at? Write three or four sentences about school subjects, sport or hobbies.",
    "good at / bad at", ["good at", "bad at", "at before a noun or -ing form"]],
  ["What were you afraid of when you were a child? Are you still afraid of it? Write three or four sentences.",
    "afraid of / scared of", ["afraid of or scared of", "no afraid from", "past and present"]],
  ["Describe your best friend. What is he or she good at, proud of or worried about? Write three or four sentences.",
    "adjective + its preposition", ["good at", "proud of or worried about", "the right preposition each time"]],
  ["Tell a visitor about your town or region. What is it famous for and what are people proud of? Write three or four sentences.",
    "famous for / proud of", ["famous for", "proud of", "the right preposition each time"]],
  ["Are you ready for your next exam or lesson? What are you worried about? Write three or four sentences.",
    "ready for / worried about", ["ready for", "worried about", "the right preposition each time"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
// Name-clash fix (Claude, 21 Nov 2026): a name slot never repeats a person printed in the
// same item, and two name slots in one item never share a name.
{
  const POOL = ["Dilnoza", "Sardor", "Nodira", "Akmal", "Gulnora", "Jamshid", "Feruza", "Otabek", "Zarina", "Sherzod", "Malika", "Ulugbek"];
  const isName = (x) => /^[A-Z][a-z]+$/.test(String(x));
  for (const it of items) {
    if (!["choose", "build", "transform"].includes(it.stage) || !it.slots) continue;
    const printed = [it.prompt, it.source, it.hint, it.instr].filter(Boolean).join(" ").replace(/\{[a-z0-9_]+\}/gi, " ");
    const used = new Set(Object.values(it.slots).flat());
    const fresh = () => POOL.find((p) => !used.has(p) && !new RegExp(`\\b${p}\\b`).test(printed));
    const seen = new Set();
    for (const [k, vals] of Object.entries(it.slots)) {
      const nameSlot = vals.every(isName);
      it.slots[k] = vals.map((v) => {
        const clash = isName(v) && (new RegExp(`\\b${v}\\b`).test(printed) || (nameSlot && seen.has(v)));
        if (!clash) return v;
        const r = fresh(); used.add(r); return r;
      });
      if (nameSlot) it.slots[k].forEach((v) => seen.add(v));
    }
  }
}
const out = "content/grammar-practice/prep-phrasal.dependent-prepositions.adjective-preposition.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
