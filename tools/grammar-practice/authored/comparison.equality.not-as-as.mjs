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
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
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
  ["fast", "The bus takes six hours and the train takes two. The bus is ______ the train, {name}.", { name: NAME, x: [] }],
  ["expensive", "My {thing} cost 300,000 soum and yours cost 900,000. Mine is ______ yours.", { thing: ["phone", "watch", "jacket", "bike"], x: [] }],
  ["big", "Our {home} is ______ yours, but it's very cosy, {name}.", { home: ["flat", "garden", "kitchen", "house"], name: NAME }],
  ["difficult", "The second {test} was ______ the first one. I finished early, {name}.", { test: ["test", "exam", "quiz", "task"], name: NAME }],
  ["old", "My {who} is 40 and my mother is 45. He's ______ my mother.", { who: ["father", "uncle", "stepfather"], x: [] }],
  ["interesting", "The film was ______ the {thing}, {name}. I fell asleep.", { thing: ["book", "trailer", "first film", "story"], name: NAME }],
  ["warm", "It's only 10 degrees today. It's ______ yesterday, {name}.", { name: NAME, x: [] }],
  ["busy", "The bazaar is ______ on {day} as on Sundays, {name}.".replace(" as on", " on"), { day: ["Mondays", "Tuesdays", "weekday mornings", "rainy days"], name: NAME }],
  ["tall", "My {sib} is 1.50 m and I'm 1.70 m. She's ______ me.", { sib: ["sister", "cousin", "friend", "mother"], x: [] }],
  ["popular", "Chess is ______ football in our {place}, {name}.", { place: ["school", "college", "village", "club"], name: NAME }],
  ["good", "My English is ______ my brother's. He lived in {city} for a year.", { city: ["London", "New York", "Sydney", "Toronto"], x: [] }],
  ["comfortable", "The new {seat} is ______ the old one, {name}. I don't like it.", { seat: ["sofa", "chair", "bed", "car seat"], name: NAME }],
  ["long", "The way through the {place} is ______ the main road. It's quicker, {name}.", { place: ["park", "old town", "bazaar", "village"], name: NAME }],
  ["cold", "Winter in {city} is ______ winter in Moscow.", { city: ["Tashkent", "Termez", "Bukhara", "Samarkand"], x: [] }],
];
// meaning items: [prompt, key, [d1, d2, d3], slots]
const MEAN = [
  ["My {thing} is not as heavy as yours, {name}. So: ______", "your {thing} is heavier.", ["my {thing} is heavier.", "they are the same.", "your {thing} is lighter."], { thing: ["bag", "box", "suitcase", "backpack"], name: NAME }],
  ["The film was not as good as the book, {name}. So: ______", "the book was better.", ["the film was better.", "they were equally good.", "the book was worse."], { name: NAME, x: [] }],
  ["The {transport} is not as fast as the train. So: ______", "the train is faster.", ["the bus is faster.", "they are equally fast.", "the train is slower."], { transport: ["bus", "minibus", "coach"], x: [] }],
  ["My little sister is not as tall as me, {name}. So: ______", "I am taller.", ["she is taller.", "we are the same height.", "I am shorter."], { name: NAME, x: [] }],
  ["This {shop} is not as cheap as the bazaar. So: ______", "the bazaar is cheaper.", ["this shop is cheaper.", "they cost the same.", "the bazaar is more expensive."], { shop: ["shop", "supermarket", "mall", "kiosk"], x: [] }],
  ["Today is not as hot as yesterday, {name}. So: ______", "yesterday was hotter.", ["today is hotter.", "they are equally hot.", "yesterday was colder."], { name: NAME, x: [] }],
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
    // options may not carry slots: use fixed wording ("your bag" for the {thing} item)
    const fill = (x) => x.replace("{thing}", "bag");
    opts = [fill(it.key), ...it.ds.map(fill)];
    why = "Not as … as means less: the other one has more of it.";
  }
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: it.prompt, options, key: options.indexOf(opts[0]), why, slots: s };
});
// the {thing} meaning item: keep the noun fixed so the options match it
CHOOSE[14].prompt = "My bag is not as heavy as yours, {name}. So: ______";
CHOOSE[14].slots = { name: NAME, who: undefined };
delete CHOOSE[14].slots.who;
CHOOSE[16].options = CHOOSE[16].options.map((o) => o.replace("the bus is faster.", "the other one is faster."));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write not as … as with the adjective in brackets.";
const BUILD = [
  ["cheap", "The shop is ______ (cheap) the bazaar, {name}.", { name: NAME, x: [] }],
  ["fast", "My old {device} is ______ (fast) my new one.", { device: ["phone", "laptop", "computer", "tablet"], x: [] }],
  ["big", "Our village is ______ (big) {city}, {name}.", { city: ["Tashkent", "Samarkand", "Namangan", "Andijan"], name: NAME }],
  ["easy", "Russian grammar is ______ (easy) {lang} grammar for me.", { lang: ["English", "Turkish", "Uzbek", "Kazakh"], x: [] }],
  ["warm", "The {room} is ______ (warm) the kitchen in winter, {name}.", { room: ["bedroom", "hall", "garage", "bathroom"], name: NAME }],
  ["old", "My {who} is ______ (old) my father.", { who: ["mother", "aunt", "uncle", "stepmother"], x: [] }],
  ["expensive", "This {thing} is ______ (expensive) the one in the window, {name}.", { thing: ["dress", "bag", "watch", "phone"], name: NAME }],
  ["quiet", "Our new street is ______ (quiet) the old one. There's a {place} next to it.", { place: ["school", "market", "bus station", "big road"], x: [] }],
  ["strong", "I'm ______ (strong) my brother. He goes to the gym every {day}, {name}.", { day: ["day", "morning", "evening", "week"], name: NAME }],
  ["interesting", "The second {part} was ______ (interesting) the first, {name}.", { part: ["half", "part", "lesson", "film"], name: NAME }],
  ["heavy", "My {bag} is ______ (heavy) yours. Can I carry yours, {name}?", { bag: ["bag", "suitcase", "backpack", "box"], name: NAME }],
  ["popular", "Tennis is ______ (popular) football in {city}.", { city: ["our town", "our village", "my school", "our district"], x: [] }],
  ["tall", "{name} is ______ (tall) her brother, but she plays {sport} better.", { name: ["Madina", "Olga", "Sevara", "Nilufar"], sport: ["basketball", "volleyball", "tennis", "football"] }],
  ["long", "The {holiday} is ______ (long) the summer holiday.", { holiday: ["winter holiday", "spring holiday", "autumn break", "Navruz holiday"], x: [] }],
  ["hot", "This {month} is ______ (hot) last {month}, {name}.", { month: ["July", "August", "June"], name: NAME }],
  ["comfortable", "The {transport} is ______ (comfortable) the train, {name}.", { transport: ["bus", "minibus", "coach", "taxi"], name: NAME }],
  ["good", "My {skill} is ______ (good) my sister's.", { skill: ["English", "cooking", "drawing", "singing"], x: [] }],
  ["near", "The bus stop is ______ (near) the metro, {name}. We should take the metro.", { name: NAME, x: [] }],
  ["dangerous", "Cycling in the {place} is ______ (dangerous) cycling in the city centre.", { place: ["park", "village", "countryside", "yard"], x: [] }],
  ["busy", "The roads are ______ (busy) on {day} as on weekdays.".replace(" as on", " on"), { day: ["Sundays", "holidays", "Navruz", "New Year's Day"], x: [] }],
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
  [COMP, "The bus is cheaper than the train, {name}.", "The train is ______ the bus, {name}.", "cheap", { name: NAME, x: [] }],
  [COMP, "My brother is taller than me.", "I'm ______ my brother.", "tall", { x: [], y: [] }],
  [COMP, "The book is more interesting than the film, {name}.", "The film is ______ the book, {name}.", "interesting", { name: NAME, x: [] }],
  [COMP, "{city} is bigger than our town.", "Our town is ______ {city}.", "big", { city: ["Tashkent", "Samarkand", "Namangan", "Andijan"], x: [] }],
  [COMP, "The new {seat} is more comfortable than the old one.", "The old {seat} is ______ the new one.", "comfortable", { seat: ["sofa", "chair", "bed", "car seat"], x: [] }],
  [TWO, "The train takes two hours. The bus takes five, {name}.", "The bus is ______ the train, {name}.", "fast", { name: NAME, x: [] }],
  [TWO, "My {thing} cost 200,000. Yours cost 600,000.", "My {thing} is ______ yours.", "expensive", { thing: ["phone", "watch", "jacket", "bike"], x: [] }],
  [TWO, "My grandmother is 70. My grandfather is 75, {name}.", "My grandmother is ______ my grandfather, {name}.", "old", { name: NAME, x: [] }],
  [TWO, "It's 25 degrees in {city}. It's 35 in Termez.", "{city} is ______ Termez.", "hot", { city: ["Tashkent", "Samarkand", "Fergana", "Namangan"], x: [] }],
  [TWO, "The first test was hard. The second test was easy, {name}.", "The second test was ______ the first, {name}.", "difficult", { name: NAME, x: [] }],
  [FIX, "My phone is not as faster as yours, {name}.", "My phone is ______ yours, {name}.", "fast", { name: NAME, x: [] }],
  [FIX, "The {place} is not as busy than the bazaar.", "The {place} is ______ the bazaar.", "busy", { place: ["shop", "mall", "kiosk", "supermarket"], x: [] }],
  [FIX, "Our flat is not big as yours, {name}.", "Our flat is ______ yours, {name}.", "big", { name: NAME, x: [] }],
  [FIX, "This {thing} is not as more expensive as that one.", "This {thing} is ______ that one.", "expensive", { thing: ["bag", "dress", "watch", "lamp"], x: [] }],
  [FIX, "The film was not so good than the book, {name}.", "The film was ______ the book, {name}.", "good", { name: NAME, x: [] }],
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
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
