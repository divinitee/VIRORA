// Hand-authored: comparison / equality / not-as-as (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement items): NOT AS + adjective + AS means "less than"
// (The film is not as good as the book = the book is better). Form and meaning.
// Triage: kept. as-as (A2) owns the positive "as … as"; here every item is the
// negative and what it means.
// Choose: 14 form items (not as fast as vs not as faster as / not as fast than /
// not fast as); 6 meaning items ("My bag is not as heavy as yours. So: ______"
// → your bag is heavier). "not so … as" is also right, so it is never an option
// and typed keys accept it.
// Build: "not as + adjective + as" typed; no source prints not or as.
// Transform: 5 comparative → not as … as (the placement item) / 5 two facts →
// not as … as / 5 correct the mistake.
//
// Run: node tools/grammar-practice/authored/comparison.equality.not-as-as.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "comparison", branch: "equality", topic: "not-as-as", level: "B1", pv: "2.5" };
const NAME = ["Malika", "Ulugbek", "Gulnora", "Jamshid"]; // listener names: never printed in a sentence (audit 20 Nov)
const ER = { fast: "faster", cheap: "cheaper", big: "bigger", old: "older", tall: "taller", warm: "warmer", long: "longer", busy: "busier", heavy: "heavier", hot: "hotter", cold: "colder", quiet: "quieter", easy: "easier", good: "better", strong: "stronger", near: "nearer" };
const WHY = (a) => `Not as ${a} as = less ${a} than. The base adjective goes between as and as.`;
const form = (a) => {
  const k = `not as ${a} as`;
  const e = ER[a] || `more ${a}`;
  return [k, `not as ${e} as`, `not as ${a} than`, `not ${a} as`];
};

/* ---------------- choose: 20 mcq ---------------- */
// form items: [adj, prompt, slots]
const FORM = [
  ["fast", "The bus to {city} takes six hours and the train takes two. The bus is ______ the train, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], name: NAME }],
  ["expensive", "My {thing} cost 300,000 soum and yours cost 900,000. Mine is ______ yours, {name}.", { thing: ["phone", "watch", "jacket", "bike"], name: NAME }],
  ["big", "Our {home} is ______ yours, but it's very cosy, {name}.", { home: ["flat", "garden", "kitchen", "house"], name: NAME }],
  ["difficult", "The second {test} was ______ the first one. I finished early, {name}.", { test: ["test", "exam", "quiz", "task"], name: NAME }],
  ["old", "My {who} is 40 and my mother is 45. He's ______ my mother, {name}.", { who: ["father", "uncle", "stepfather"], name: NAME }],
  ["interesting", "The film was ______ the {thing}, {name}. I fell asleep.", { thing: ["book", "trailer", "first film", "story"], name: NAME }],
  ["warm", "It's only 10 degrees in {city} today. It's ______ yesterday, {name}.", { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], name: NAME }],
  ["busy", "On {day}, the bazaar is ______ it is on Sundays, {name}.", { day: ["Mondays", "Tuesdays", "weekday mornings", "rainy days"], name: NAME }],
  ["tall", "My {sib} is 1.50 m and I'm 1.70 m. She's ______ me, {name}.", { sib: ["sister", "cousin", "friend", "mother"], name: NAME }],
  ["popular", "Chess is ______ football in our {place}, {name}.", { place: ["school", "college", "village", "club"], name: NAME }],
  ["good", "My English is ______ my brother's. He lived in {city} for a year, {name}.", { city: ["London", "New York", "Sydney", "Toronto"], name: NAME }],
  ["comfortable", "The new {seat} is ______ the old one, {name}. I don't like it.", { seat: ["sofa", "chair", "bed", "car seat"], name: NAME }],
  ["long", "The way through the {place} is ______ the main road. It's quicker, {name}.", { place: ["park", "old town", "bazaar", "village"], name: NAME }],
  ["cold", "Winter in {city} is ______ winter in Moscow, {name}.", { city: ["Tashkent", "Termez", "Bukhara", "Samarkand"], name: NAME }],
];
// meaning items: [prompt, key, [d1, d2, d3], slots] (options carry no slot: pronouns only)
const MEAN = [
  ["My {thing} is not as heavy as yours. So ______, {name}.", "yours is heavier", ["mine is heavier", "they weigh the same", "yours is lighter"], { thing: ["bag", "box", "suitcase", "backpack"], name: NAME }],
  ["The {film} was not as good as the book. So ______, {name}.", "the book was better", ["the film was better", "they were equally good", "the book was worse"], { film: ["film", "new film", "cartoon", "TV series"], name: NAME }],
  ["The {transport} is not as fast as the train. So ______, {name}.", "the train is faster", ["the train is slower", "they are equally fast", "both are very slow"], { transport: ["bus", "minibus", "coach", "old bus"], name: NAME }],
  ["My little {sib} is not as tall as me. So ______, {name}.", "I am taller", ["she is taller", "we are the same height", "I am shorter"], { sib: ["sister", "cousin", "niece"], name: NAME }],
  ["This {shop} is not as cheap as the bazaar. So ______, {name}.", "the bazaar is cheaper", ["this place is cheaper", "they cost the same", "the bazaar is more expensive"], { shop: ["shop", "supermarket", "mall", "kiosk"], name: NAME }],
  ["Today is not as hot as {when}. So ______, {name}.", "it was hotter before", ["today is hotter", "it is equally hot", "it was colder before"], { when: ["yesterday", "last week", "on Monday", "on Sunday"], name: NAME }],
];
const CHOOSE = [
  ...FORM.map(([adj, prompt, slots]) => ({ kind: "f", adj, prompt, slots })),
  ...MEAN.map(([prompt, key, ds, slots]) => ({ kind: "m", prompt, key, ds, slots })),
].map((it, i) => {
  const s = {};
  for (const [n, f] of Object.entries(it.slots)) if (it.prompt.includes(`{${n}}`)) s[n] = f;
  let opts, why;
  if (it.kind === "f") { opts = form(it.adj); why = WHY(it.adj); }
  else {
    opts = [it.key, ...it.ds];
    why = "Not as … as means less: the other one has more of it.";
  }
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: it.prompt, options, key: options.indexOf(opts[0]), why, slots: s };
});
/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write not as … as with the adjective in brackets.";
const BUILD = [
  ["cheap", "The {shop} is ______ (cheap) the bazaar, {name}.", { shop: ["shop", "supermarket", "mall", "kiosk"], name: NAME }],
  ["fast", "My old {device} is ______ (fast) my new one, {name}.", { device: ["phone", "laptop", "computer", "tablet"], name: NAME }],
  ["big", "Our village is ______ (big) {city}, {name}.", { city: ["Tashkent", "Samarkand", "Namangan", "Andijan"], name: NAME }],
  ["easy", "Russian grammar is ______ (easy) {lang} grammar for me, {name}.", { lang: ["English", "Turkish", "Uzbek", "Kazakh"], name: NAME }],
  ["warm", "The {room} is ______ (warm) the kitchen in winter, {name}.", { room: ["bedroom", "hall", "garage", "bathroom"], name: NAME }],
  ["old", "My {who} is ______ (old) my father, {name}.", { who: ["mother", "aunt", "uncle", "stepmother"], name: NAME }],
  ["expensive", "This {thing} is ______ (expensive) the one in the window, {name}.", { thing: ["dress", "bag", "watch", "phone"], name: NAME }],
  ["quiet", "Our new street is ______ (quiet) the old one. There's a {place} next to it, {name}.", { place: ["school", "market", "bus station", "big road"], name: NAME }],
  ["strong", "I'm ______ (strong) my brother. He goes to the gym every {day}, {name}.", { day: ["day", "morning", "evening", "week"], name: NAME }],
  ["interesting", "The second {part} was ______ (interesting) the first, {name}.", { part: ["half", "part", "lesson", "film"], name: NAME }],
  ["heavy", "My {bag} is ______ (heavy) yours. Can I carry yours, {name}?", { bag: ["bag", "suitcase", "backpack", "box"], name: NAME }],
  ["popular", "Tennis is ______ (popular) football in {city}, {name}.", { city: ["our town", "our village", "my school", "our district"], name: NAME }],
  ["tall", "{name} is ______ (tall) her brother, but she plays {sport} better.", { name: ["Madina", "Olga", "Sevara", "Nilufar"], sport: ["basketball", "volleyball", "tennis", "football"] }],
  ["long", "The {holiday} is ______ (long) the summer holiday, {name}.", { holiday: ["winter holiday", "spring holiday", "autumn break", "Navruz holiday"], name: NAME }],
  ["hot", "This {month} is ______ (hot) last {month}, {name}.", { month: ["July", "August", "June"], name: NAME }],
  ["comfortable", "The {transport} is ______ (comfortable) the train, {name}.", { transport: ["bus", "minibus", "coach", "taxi"], name: NAME }],
  ["good", "My {skill} is ______ (good) my sister's, {name}.", { skill: ["English", "cooking", "drawing", "singing"], name: NAME }],
  ["near", "The bus stop is ______ (near) the metro, {name}. We should take the metro to {place}.", { name: NAME, place: ["school", "the bazaar", "work", "the station"] }],
  ["dangerous", "Cycling in the {place} is ______ (dangerous) cycling in the city centre, {name}.", { place: ["park", "village", "countryside", "yard"], name: NAME }],
  ["busy", "On {day}, the roads are ______ (busy) they are on weekdays, {name}.", { day: ["Sundays", "holidays", "Navruz", "New Year's Day"], name: NAME }],
].map(([adj, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `not as ${adj} as`, acceptable: [`not so ${adj} as`], why: WHY(adj), slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COMP = "Rewrite with not as … as. Keep the meaning.";
const TWO = "Compare the two with not as … as.";
const FIX = "Correct the mistake.";
// [instr, source, hint, adj, slots]
const TRANSFORM = [
  [COMP, "The bus to {city} is cheaper than the train, {name}.", "The train to {city} is ______ the bus, {name}.", "cheap", { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], name: NAME }],
  [COMP, "My {who} is taller than me, {name}.", "I'm ______ my {who}, {name}.", "tall", { who: ["brother", "sister", "cousin", "father"], name: NAME }],
  [COMP, "The {book} is more interesting than the film, {name}.", "The film is ______ the {book}, {name}.", "interesting", { book: ["book", "novel", "story", "comic"], name: NAME }],
  [COMP, "{city} is bigger than our town, {name}.", "Our town is ______ {city}, {name}.", "big", { city: ["Tashkent", "Samarkand", "Namangan", "Andijan"], name: NAME }],
  [COMP, "The new {seat} is more comfortable than the old one, {name}.", "The old {seat} is ______ the new one, {name}.", "comfortable", { seat: ["sofa", "chair", "bed", "car seat"], name: NAME }],
  [TWO, "The train to {city} takes two hours. The bus takes five, {name}.", "The bus is ______ the train, {name}.", "fast", { city: ["Samarkand", "Bukhara", "Khiva", "Fergana"], name: NAME }],
  [TWO, "My {thing} cost 200,000. Yours cost 600,000, {name}.", "My {thing} is ______ yours, {name}.", "expensive", { thing: ["phone", "watch", "jacket", "bike"], name: NAME }],
  [TWO, "My {who} is 70. My grandfather is 75, {name}.", "My {who} is ______ my grandfather, {name}.", "old", { who: ["grandmother", "great-aunt", "neighbour", "aunt"], name: NAME }],
  [TWO, "It's 25 degrees in {city}. It's 35 in Termez, {name}.", "{city} is ______ Termez, {name}.", "hot", { city: ["Tashkent", "Samarkand", "Fergana", "Namangan"], name: NAME }],
  [TWO, "The first {test} was hard. The second {test} was easy, {name}.", "The second {test} was ______ the first, {name}.", "difficult", { test: ["test", "exam", "quiz", "task"], name: NAME }],
  [FIX, "My {device} is not as faster as yours, {name}.", "My {device} is ______ yours, {name}.", "fast", { device: ["phone", "laptop", "computer", "tablet"], name: NAME }],
  [FIX, "The {place} is not as busy than the bazaar, {name}.", "The {place} is ______ the bazaar, {name}.", "busy", { place: ["shop", "mall", "kiosk", "supermarket"], name: NAME }],
  [FIX, "Our {home} is not big as yours, {name}.", "Our {home} is ______ yours, {name}.", "big", { home: ["flat", "garden", "house", "kitchen"], name: NAME }],
  [FIX, "This {thing} is not as more expensive as that one, {name}.", "This {thing} is ______ that one, {name}.", "expensive", { thing: ["bag", "dress", "watch", "lamp"], name: NAME }],
  [FIX, "The {film} was not so good than the book, {name}.", "The {film} was ______ the book, {name}.", "good", { film: ["film", "new film", "cartoon", "TV series"], name: NAME }],
].map(([instr, source, hint, adj, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `not as ${adj} as`, acceptable: [`not so ${adj} as`], why: WHY(adj), slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence comparing your town with a big city. Use not as … as.", "not as big / busy as", ["exactly one sentence", "not as … as", "two places"]],
  ["Write one sentence comparing two members of your family.", "not as tall / old as", ["exactly one sentence", "not as … as", "two people"]],
  ["Write one sentence comparing a book and its film.", "not as good / interesting as", ["exactly one sentence", "not as … as", "book and film"]],
  ["Write one sentence comparing two ways to travel.", "not as fast / cheap as", ["exactly one sentence", "not as … as", "two kinds of transport"]],
  ["Write one sentence about two seasons where you live.", "not as hot / cold as", ["exactly one sentence", "not as … as", "two seasons"]],
  ["Write one sentence comparing two subjects at school.", "not as difficult / interesting as", ["exactly one sentence", "not as … as", "two subjects"]],
  ["Write one sentence with not as … as and a long adjective.", "not as expensive / comfortable as", ["exactly one sentence", "not as + long adjective + as", "than is not used"]],
  ["Write two sentences that mean the same: one with -er than and one with not as … as.", "comparative ↔ not as … as", ["exactly two sentences", "-er / more … than", "not as … as"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Compare your town with Tashkent or another big city. Write three or four sentences with not as … as.", "not as … as", ["not as … as", "a comparative with than", "two places"]],
  ["Compare two phones, bags or bikes you know. Write three or four sentences.", "not as … as", ["not as … as", "at least two adjectives", "three or four sentences"]],
  ["Compare yourself with a brother, sister or friend. Write three or four sentences.", "not as tall / old as", ["not as … as", "but", "three or four sentences"]],
  ["Compare a book and a film of the same story. Write three or four sentences.", "not as good as", ["not as … as", "better / more interesting", "your opinion"]],
  ["Compare this year with last year at your school or job. Write three or four sentences.", "not as busy / difficult as", ["not as … as", "than", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/comparison.equality.not-as-as.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "Six hours against two: the bus is less fast: not as fast as.",
   "300,000 against 900,000: not as expensive as.",
   "\"but it's very cosy\": smaller, so not as big as.",
   "\"I finished early\": easier, so not as difficult as.",
   "40 against 45: not as old as.",
   "\"I fell asleep\": not as interesting as.",
   "\"only 10 degrees\": colder, so not as warm as.",
   "Weekdays against Sundays: not as busy as.",
   "1.50 against 1.70 m: not as tall as.",
   "Fewer people play it: not as popular as.",
   "\"He lived in … for a year\": not as good as.",
   "\"I don't like it\": not as comfortable as.",
   "\"It's quicker\": shorter, so not as long as.",
   "Milder than Moscow: not as cold as.",
   "Turn it round: not as heavy as → yours is heavier.",
   "Turn it round: not as good as → the book was better.",
   "Turn it round: not as fast as → the train is faster.",
   "Turn it round: not as tall as → I am taller.",
   "Turn it round: not as cheap as → the bazaar is cheaper.",
   "Turn it round: not as hot as → it was hotter before."
  ],
  "build": [
   "not as + adjective + as: not as cheap as.",
   "The old one is slower: not as fast as.",
   "A village is smaller: not as big as.",
   "not as + base adjective + as, never easier: not as easy as.",
   "Colder in winter: not as warm as.",
   "Younger: not as old as.",
   "Cheaper: not as expensive as.",
   "\"There's a … next to it\": not as quiet as.",
   "\"He goes to the gym\": not as strong as.",
   "Less interesting: not as interesting as.",
   "\"Can I carry yours?\": not as heavy as.",
   "Fewer fans: not as popular as.",
   "\"but she plays … better\": not as tall as.",
   "Shorter: not as long as.",
   "Cooler: not as hot as.",
   "Less comfortable: not as comfortable as.",
   "not as + good + as, never better: not as good as.",
   "\"We should take the metro\": not as near as.",
   "Safer: not as dangerous as.",
   "Quieter roads: not as busy as."
  ],
  "transform": [
   "cheaper than → the other one is not as cheap as.",
   "taller than → I'm not as tall as.",
   "more interesting than → not as interesting as.",
   "bigger than → not as big as.",
   "more comfortable than → not as comfortable as.",
   "Five hours against two: not as fast as.",
   "200,000 against 600,000: not as expensive as.",
   "70 against 75: not as old as.",
   "25 against 35 degrees: not as hot as.",
   "Hard against easy: not as difficult as.",
   "After as, the base form, not faster: not as fast as.",
   "as … as, not as … than: not as busy as.",
   "The first as is missing: not as big as.",
   "No more inside as … as: not as expensive as.",
   "Use as … as, not so … than: not as good as."
  ]
 },
 "slot": [
  [
   "choose",
   5,
   "",
   "who",
   [
    "uncle"
   ]
  ],
  [
   "choose",
   18,
   "",
   "sib",
   [
    "nephew"
   ]
  ],
  [
   "choose",
   5,
   "",
   "who",
   [
    "dad"
   ]
  ]
 ]
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
