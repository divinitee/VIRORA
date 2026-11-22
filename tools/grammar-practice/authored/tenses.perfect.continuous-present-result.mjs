// Hand-authored: tenses / perfect / continuous-present-result (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement items): the PRESENT PERFECT CONTINUOUS (has / have
// been + -ing) for a recent activity that explains how someone or something is
// NOW: tired, wet, dirty, out of breath, red eyes ("He's exhausted because he has
// been studying all afternoon").
// One right answer: in these sentences "has studied", "studied" and "was
// studying" can also be defended, so tense choice is never tested in choose.
// Choose tests the FORM only: has / have been + -ing (key) vs has been + base,
// the wrong auxiliary for the subject, and "has / have be" (has been studying /
// has been study / have been studying / has be studying), plus 4 questions
// (Have you been running? vs Did you been / Are you been / Have you running).
// Typed items name the tense in the instruction.
// Triage: kept. perfect-vs-perfect-continuous is C1; past perfect continuous is
// B2; since-duration owns "for / since" length questions.
// Transform: 5 past simple → present perfect continuous (the result is now) /
// 5 correct the mistake / 5 ask a question about the cause.
//
// Run: node tools/grammar-practice/authored/tenses.perfect.continuous-present-result.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "perfect", topic: "continuous-present-result", level: "B1", pv: "2.5" };
const NAME = ["Dilnoza", "Sardor", "Feruza", "Otabek"]; // listener names: never printed in a sentence (audit 20 Nov)
const NAME_F = ["Madina", "Olga", "Sevara", "Nilufar"];
const NAME_M = ["Sardor", "Timur", "Ilya", "Jasur"];
const WHY = (f) => `A recent activity explains how things are now, so use the present perfect continuous: ${f}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [aux, base, ing, prompt, slots]; aux "q" = question item (base = subject)
const CHOOSE = [
  ["has", "study", "studying", "{name} is exhausted because he ______ all {time}.", { name: NAME_M, time: ["afternoon", "day", "evening", "morning"] }],
  ["have", "run", "running", "I'm out of breath because I ______ to catch the {transport}, {name}.", { transport: ["bus", "train", "minibus", "metro"], name: NAME }],
  ["has", "cry", "crying", "My {who}'s eyes are red. She ______ for an hour, {name}.", { who: ["sister", "cousin", "aunt", "niece"], name: NAME }],
  ["have", "work", "working", "My hands are dirty because I ______ in the {place}, {name}.", { place: ["garden", "garage", "yard", "field"], name: NAME }],
  ["has", "rain", "raining", "The ground is wet, {name}. It ______ all {time}.", { time: ["night", "morning", "day", "afternoon"], name: NAME }],
  ["have", "swim", "swimming", "We're tired because we ______ in the {water} for {n} hours.", { water: ["sea", "lake", "pool", "river"], n: ["two", "three", "four", "five"] }],
  ["has", "cook", "cooking", "The kitchen smells of {food}. My {who} ______ since lunch.", { food: ["plov", "onions", "fresh bread", "spices"], who: ["mother", "grandmother", "aunt", "sister"] }],
  ["have", "play", "playing", "The boys are very dirty, {name}. They ______ football in the {place}.", { place: ["mud", "rain", "yard", "park"], name: NAME }],
  ["has", "paint", "painting", "There is paint on {name}'s {thing}. She ______ her room.", { name: NAME_F, thing: ["hands", "shirt", "face", "hair"] }],
  ["have", "wait", "waiting", "We're cold because we ______ for the {transport} for {n} minutes.", { transport: ["bus", "taxi", "minibus", "tram"], n: ["forty", "thirty", "twenty", "fifty"] }],
  ["has", "train", "training", "My {who}'s legs hurt. He ______ hard for the {event}.", { who: ["brother", "cousin", "father", "uncle"], event: ["race", "match", "marathon", "competition"] }],
  ["have", "clean", "cleaning", "The flat looks great, {name}! We ______ all {time}.", { name: NAME, time: ["morning", "day", "afternoon", "weekend"] }],
  ["has", "snow", "snowing", "The roads are white, {name}. It ______ since {time}.", { time: ["six", "midnight", "the morning", "early this morning"], name: NAME }],
  ["have", "dance", "dancing", "My feet hurt, {name}. I ______ at the {event} for three hours.", { name: NAME, event: ["wedding", "party", "concert", "festival"] }],
  ["has", "repair", "repairing", "My {who} is covered in oil. He ______ the {thing}.", { who: ["father", "uncle", "brother", "grandfather"], thing: ["car", "motorbike", "bike", "tractor"] }],
  ["have", "shout", "shouting", "Our throats hurt, {name}. We ______ at the {event} all evening.", { event: ["match", "game", "concert", "final"], name: NAME }],
  ["q", "you", "run", "Your face is red, {name}. ______ ? Sit down and have some {drink}.", { name: NAME, drink: ["water", "juice", "tea", "cold water"] }],
  ["q", "you", "cry", "What's wrong, {name}? Your eyes are red. ______ ? Did something happen at {place}?", { name: NAME, place: ["school", "work", "home", "the party"] }],
  ["q", "they", "play", "The children are wet, {name}. ______ in the {water} again?", { water: ["river", "lake", "pool", "fountain"], name: NAME }],
  ["q", "she", "work", "{name} looks tired. ______ late again this {period}?", { name: NAME_F, period: ["week", "month"] }],
].map(([aux, v, ing, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  let opts, key, why;
  if (aux === "q") {
    const subj = v, a = subj === "she" ? "Has" : "Have", w = subj === "she" ? "Is" : "Are";
    const gi = { run: "running", cry: "crying", play: "playing", work: "working" }[ing];
    key = `${a} ${subj} been ${gi}`;
    opts = [key, `Did ${subj} been ${gi}`, `${w} ${subj} been ${gi}`, `${a} ${subj} ${gi}`];
    why = `Question: ${a} + ${subj} + been + -ing.`;
    prompt = prompt.replace("______ ?", "______?");
  } else {
    key = `${aux} been ${ing}`;
    const other = aux === "has" ? "have" : "has";
    opts = [key, `${aux} been ${v}`, `${other} been ${ing}`, `${aux} be ${ing}`];
    why = WHY(key);
  }
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(key), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write the verb in brackets in the present perfect continuous (has / have been + -ing).";
// [key, source, slots]
const BUILD = [
  ["has been studying", "{name} is tired because she ______ (study) for her {test}.", { name: NAME_F, test: ["exams", "test", "driving test", "English exam"] }],
  ["have been running", "I'm hot because I ______ (run) in the {place}, {name}.", { place: ["park", "stadium", "street", "gym"], name: NAME }],
  ["has been raining", "Take your umbrella, {name}. It ______ (rain) all {time}.", { time: ["morning", "day", "afternoon", "night"], name: NAME }],
  ["have been working", "My {who} are tired. They ______ (work) in the {place} since early morning.", { who: ["parents", "grandparents", "uncles", "cousins"], place: ["garden", "field", "shop", "bakery"] }],
  ["has been crying", "The baby ______ (cry) for {n}. Is she hungry, {name}?", { n: ["an hour", "half an hour", "twenty minutes", "ten minutes"], name: NAME }],
  ["have been playing", "The boys are hungry because they ______ (play) {sport} all {time}.", { sport: ["football", "basketball", "volleyball", "tennis"], time: ["afternoon", "morning", "day", "evening"] }],
  ["has been cooking", "{who} ______ (cook) {food} since nine, so the house smells wonderful.", { who: ["Grandma", "Mum", "My aunt", "Aunt Lola"], food: ["plov", "samsa", "manti", "soup"] }],
  ["have been waiting", "We ______ (wait) for {name} for {n}. Where is he?", { name: NAME_M, n: ["half an hour", "an hour", "forty minutes", "twenty minutes"] }],
  ["has been painting", "There is paint on my {who}'s {thing}. He ______ (paint) the fence.", { who: ["uncle", "father", "brother", "grandfather"], thing: ["hands", "shirt", "shoes", "face"] }],
  ["have been swimming", "Our hair is wet because we ______ (swim) in the {water}, {name}.", { water: ["sea", "lake", "pool", "river"], name: NAME }],
  ["has been snowing", "The car is white, {name}. It ______ (snow) since {time}.", { time: ["midnight", "six", "the evening", "two o'clock"], name: NAME }],
  ["have been cleaning", "I'm dirty because I ______ (clean) the {room} all {time}.", { room: ["garage", "kitchen", "yard", "basement"], time: ["morning", "afternoon", "day"] }],
  ["has been training", "{name} is very fit now. He ______ (train) every day for the {event}.", { name: NAME_M, event: ["race", "match", "marathon", "tournament"] }],
  ["have been dancing", "My feet hurt, {name}. I ______ (dance) at the {event} since eight.", { event: ["wedding", "party", "festival", "concert"], name: NAME }],
  ["has been fixing", "{who}'s hands are black. He ______ (fix) the {thing} in the garage.", { who: ["Dad", "Grandpa", "My uncle", "My brother"], thing: ["car", "bike", "motorbike", "old radio"] }],
  ["have been shouting", "Our voices are gone, {name}. We ______ (shout) for our team all {time}.", { time: ["evening", "afternoon", "match", "night"], name: NAME }],
  ["has been reading", "{name}'s eyes are tired. She ______ (read) on her {device} for hours.", { name: NAME_F, device: ["phone", "tablet", "laptop", "e-reader"] }],
  ["have been walking", "We are tired because we ______ (walk) around the {place} all day.", { place: ["old city", "bazaar", "museum", "mountains"], x: [] }],
  ["has been digging", "My grandfather is tired. He ______ (dig) in the {place} since lunch.", { place: ["garden", "yard", "field", "orchard"], x: [] }],
  ["have been watching", "Your eyes are red, {name}. You ______ (watch) {thing} for too long.", { name: NAME, thing: ["TV", "videos", "cartoons", "films"] }],
].map(([key, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why: WHY(key), slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOWR = "The result is still here now. Rewrite the second sentence with the present perfect continuous.";
const FIX = "Correct the mistake.";
const ASK = "Ask about the cause. Use the present perfect continuous.";
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [NOWR, "Your eyes are red, {name}. You cried for {n}.", "Your eyes are red, {name}. You ______ for {n}.", "have been crying", WHY("have been crying"), { name: NAME, n: ["a long time", "an hour", "half an hour", "two hours"] }],
  [NOWR, "{name} is wet. He walked in the {weather}.", "{name} is wet. He ______ in the {weather}.", "has been walking", WHY("has been walking"), { name: NAME_M, weather: ["rain", "snow", "storm", "rain all morning"] }],
  [NOWR, "The kitchen is a mess. My {who} cooked {food}.", "The kitchen is a mess. My {who} ______ {food}.", "have been cooking", WHY("have been cooking"), { who: ["brothers", "cousins", "sisters", "friends"], food: ["pizza", "plov", "eggs", "pancakes"] }],
  [NOWR, "I'm very tired, {name}. I worked in the {place} all day.", "I'm very tired, {name}. I ______ in the {place} all day.", "have been working", WHY("have been working"), { name: NAME, place: ["shop", "garden", "office", "field"] }],
  [NOWR, "{name}'s clothes are dirty. She played in the {place}.", "{name}'s clothes are dirty. She ______ in the {place}.", "has been playing", WHY("has been playing"), { name: NAME_F, place: ["mud", "garden", "yard", "sand"] }],
  [FIX, "She is tired because she has been work all {time}, {name}.", "She is tired because she ______ all {time}, {name}.", "has been working", "After been, use the -ing form: has been working.", { time: ["day", "night", "morning", "week"], name: NAME }],
  [FIX, "My {who} is been waiting for an hour, {name}.", "My {who} ______ for an hour, {name}.", "have been waiting", "The subject is plural, so have been + -ing: have been waiting.", { who: ["parents", "grandparents", "friends", "cousins"], name: NAME }],
  [FIX, "It have been raining since {time}, {name}.", "It ______ since {time}, {name}.", "has been raining", "It takes has: has been raining.", { time: ["six", "the morning", "lunch", "Monday"], name: NAME }],
  [FIX, "I has been running in the {place}, so I'm out of breath, {name}.", "I ______ in the {place}, so I'm out of breath, {name}.", "have been running", "I takes have: have been running.", { place: ["park", "street", "stadium", "yard"], name: NAME }],
  [FIX, "{name} has be studying for the {test}.", "{name} ______ for the {test}.", "has been studying", "Has needs been, not be: has been studying.", { name: NAME, test: ["exam", "test", "quiz", "driving test"] }],
  [ASK, "Your friend {name} is out of breath. Ask if he ran to the {place}.", "______ you ______ to the {place}, {name}?", ["Have", "been running"], "Question: Have + you + been + -ing.", { name: NAME_M, place: ["bus stop", "station", "school", "shop"] }],
  [ASK, "{name}'s eyes are red. Ask if she cried {when}.", "______ you ______ {when}, {name}?", ["Have", "been crying"], "Question: Have + you + been + -ing.", { name: NAME_F, when: ["again", "all morning", "all night", "today"] }],
  [ASK, "The children are wet, {name}. Ask if they swam in the {water}.", "______ they ______ in the {water}, {name}?", ["Have", "been swimming"], "Question: Have + they + been + -ing.", { water: ["river", "lake", "pool", "sea"], name: NAME }],
  [ASK, "Your {who} looks tired. Ask if he worked late at the {place}.", "______ he ______ late at the {place}?", ["Has", "been working"], "Question: Has + he + been + -ing.", { who: ["brother", "father", "uncle", "cousin"], place: ["office", "shop", "hospital", "bank"] }],
  [ASK, "The floor is wet, {name}. Ask if your {who} cleaned it.", "______ your {who} ______ the floor, {name}?", ["Has", "been cleaning"], "Question: Has + your … + been + -ing.", { who: ["sister", "mother", "brother", "grandmother"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about why you are tired today.", "because I have been + -ing", ["exactly one sentence", "have been + -ing", "because"]],
  ["Look at a wet street. Write one sentence about the weather.", "It has been raining / snowing", ["exactly one sentence", "it has been + -ing", "a time word"]],
  ["Write one sentence about why a family member's hands are dirty.", "has been + -ing", ["exactly one sentence", "he / she has been", "dirty"]],
  ["Write one question to a friend who looks very hot.", "Have you been + -ing?", ["exactly one question", "have you been", "-ing"]],
  ["Write one sentence about why the kitchen smells good.", "has been cooking", ["exactly one sentence", "present perfect continuous", "food"]],
  ["Write one sentence about why you are out of breath.", "have been running / walking", ["exactly one sentence", "have been + -ing", "a place"]],
  ["Write one sentence about why your eyes are tired.", "have been reading / watching", ["exactly one sentence", "have been", "for + a time"]],
  ["Write two sentences: how someone looks now, and what they have been doing.", "result now + have been + -ing", ["exactly two sentences", "present simple for the result", "present perfect continuous for the cause"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You come home very tired after a busy day. Explain why to your family. Write three or four sentences.", "present perfect continuous for causes", ["have been + -ing", "because", "how you feel now"]],
  ["Describe a messy room and say what the people have been doing there. Write three or four sentences.", "have been + -ing for results", ["has / have been", "at least two activities", "what the room looks like"]],
  ["Describe the weather today and what it has been doing. Write three or four sentences.", "it has been + -ing", ["it has been raining / snowing", "since / all", "the result now"]],
  ["Your friend looks very happy. Ask three questions about what they have been doing.", "Have you been + -ing?", ["have you been", "three questions", "-ing"]],
  ["Describe how you feel after a sports training or a long walk. Write three or four sentences.", "have been + -ing", ["have been + -ing", "out of breath / tired", "for + a time"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
// Audit 21 Nov (MED/LOW): extra right answers.
const AUDIT_ACC = [
  ["transform", "My {who} ______ {food}.", ["have been making"]],
];
for (const [st, m, acc] of AUDIT_ACC) {
  const hit = items.filter((it) => it.stage === st && [it.prompt, it.source, it.hint].filter(Boolean).join(" ").includes(m));
  if (!hit.length) throw new Error(`AUDIT_ACC: no ${st} item matches ${m}`);
  for (const it of hit) it.acceptable = [...new Set([...(it.acceptable || []), ...acc])];
}
const out = "content/grammar-practice/tenses.perfect.continuous-present-result.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "\"exhausted\" now from a long activity: has been studying.",
   "\"out of breath\" now: I have been running.",
   "\"eyes are red\" now, \"for an hour\": has been crying.",
   "\"hands are dirty\" now from work: have been working.",
   "\"The ground is wet\" now, \"all …\": has been raining.",
   "\"tired … for … hours\": have been swimming.",
   "\"smells of …\" now, \"since lunch\": has been cooking.",
   "\"very dirty\" now from the game: have been playing.",
   "\"paint on …\" now: she has been painting.",
   "\"cold … for … minutes\": have been waiting.",
   "\"legs hurt\" now from hard work: has been training.",
   "\"looks great\" now after work \"all …\": have been cleaning.",
   "\"The roads are white\" now, \"since …\": has been snowing.",
   "\"feet hurt … for three hours\": have been dancing.",
   "\"covered in oil\" now: he has been repairing.",
   "\"throats hurt … all evening\": have been shouting.",
   "Question about a red face now: Have you been running?",
   "Question about red eyes now: Have you been crying?",
   "Question about wet children now: Have they been playing?",
   "Question about looking tired now: Has she been working?"
  ],
  "build": [
   "\"tired because\" of a long activity: has been studying.",
   "\"hot because\" of the activity: have been running.",
   "\"Take your umbrella\" … \"all …\": has been raining.",
   "\"tired … since early morning\": have been working.",
   "\"for …\" up to now, \"Is she hungry?\": has been crying.",
   "\"hungry because … all …\": have been playing.",
   "\"since nine, so the house smells\": has been cooking.",
   "\"for …\" up to now, \"Where is he?\": have been waiting.",
   "\"paint on …\" now: has been painting.",
   "\"hair is wet\" now: have been swimming.",
   "\"The car is white\" now, \"since …\": has been snowing.",
   "\"dirty because … all …\": have been cleaning.",
   "\"very fit now … every day\": has been training.",
   "\"feet hurt … since eight\": have been dancing.",
   "\"hands are black\" now: has been fixing.",
   "\"voices are gone … all …\": have been shouting.",
   "\"eyes are tired … for hours\": has been reading.",
   "\"… because … all day\": have been walking.",
   "\"tired … since lunch\": has been digging.",
   "\"eyes are red … too long\": have been watching."
  ],
  "transform": [
   "A result you can see now (red eyes): have been crying.",
   "A result you can see now (wet): has been walking.",
   "A result you can see now (a mess): have been cooking.",
   "A result you feel now (tired): have been working.",
   "A result you can see now (dirty clothes): has been playing.",
   "has been + -ing: working, not work.",
   "Plural subject + have been, not is been: have been waiting.",
   "It + has been, not have been: has been raining.",
   "I + have been, not has been: have been running.",
   "has been, not has be: has been studying.",
   "Question: Have + you + been running.",
   "Question: Have + you + been crying.",
   "Question: Have + they + been swimming.",
   "Question: Has + he + been working.",
   "Question: Has + your … + been cleaning."
  ]
 },
 "slot": [
  [
   "build",
   18,
   "tired",
   "feel",
   [
    "tired",
    "exhausted",
    "sleepy",
    "worn out"
   ]
  ],
  [
   "build",
   19,
   "grandfather",
   "who",
   [
    "grandfather",
    "uncle",
    "father",
    "neighbour"
   ]
  ],
  [
   "choose",
   20,
   "",
   "period",
   [
    "term",
    "year"
   ]
  ],
  [
   "build",
   12,
   "",
   "time",
   [
    "evening"
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
