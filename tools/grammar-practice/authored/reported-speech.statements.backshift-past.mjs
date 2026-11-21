// Hand-authored: reported-speech / statements / backshift-past (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): reporting a PAST sentence after said: the past
// simple (and the present perfect) move back to the PAST PERFECT, had + past
// participle ('I lost my keys,' he said. → He said he had lost his keys.).
// Triage: kept. Sibling backshift-present owns present → past.
// One right answer: in speech the past simple is often kept (He said he lost his
// keys). So choose never offers the plain past simple; typed keys accept it after
// a past simple source, like the placement item ("lost" is an alt). After a present
// perfect source only had + pp is right.
// Time words (last week, yesterday) are kept out: they would need changing too.
// Choose: had + pp / has + pp / had + past simple / have + pp, with verbs whose past
// and participle differ (saw / seen). 3 present-perfect lines: had / has / have / did.
// Build: had + past participle of the verb in brackets; no source prints had or the pp.
// Transform: 5 report it (pronoun + had + pp) / 5 correct the mistake / 5 present
// perfect → past perfect.
//
// Run: node tools/grammar-practice/authored/reported-speech.statements.backshift-past.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "reported-speech", branch: "statements", topic: "backshift-past", level: "B1", pv: "2.5" };
const M = ["Aziz", "Timur", "Bekzod", "Rustam"];
const F = ["Olga", "Lola", "Madina", "Sevara"];
const V = { see: ["saw", "seen"], go: ["went", "gone"], eat: ["ate", "eaten"], take: ["took", "taken"], write: ["wrote", "written"], forget: ["forgot", "forgotten"], break: ["broke", "broken"], give: ["gave", "given"], do: ["did", "done"], speak: ["spoke", "spoken"], fall: ["fell", "fallen"], drive: ["drove", "driven"], steal: ["stole", "stolen"], swim: ["swam", "swum"], choose: ["chose", "chosen"], wear: ["wore", "worn"], know: ["knew", "known"], begin: ["began", "begun"], fly: ["flew", "flown"], ride: ["rode", "ridden"], sing: ["sang", "sung"], draw: ["drew", "drawn"], hide: ["hid", "hidden"], throw: ["threw", "thrown"], lose: ["lost", "lost"], finish: ["finished", "finished"], be: ["was", "been"] };
const WHY = "Reported after said, the past simple moves back to the past perfect: had + past participle.";
const WHY_PP = "Reported after said, the present perfect (have done) moves back to the past perfect (had done).";
const opts = (v) => [`had ${V[v][1]}`, `has ${V[v][1]}`, `had ${V[v][0]}`, `have ${V[v][1]}`];

/* ---------------- choose: 20 mcq ---------------- */
// [options, why, prompt, slots]
const CHOOSE = [
  [opts("see"), WHY, "'I saw the {film},' {m} said. He said he ______ the {film}.", { m: M, film: ["film", "match", "play", "show"] }],
  [opts("go"), WHY, "'We went to {city},' my {who} said. They said they ______ to {city}.", { who: ["friends", "cousins", "parents", "neighbours"], city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"] }],
  [opts("eat"), WHY, "'I ate all the {food},' {f} said. She said she ______ all the {food}.", { f: F, food: ["cake", "plov", "bread", "sweets"] }],
  [opts("take"), WHY, "'I took your {thing},' {m} said. He said he ______ my {thing}.", { m: M, thing: ["pen", "umbrella", "charger", "book"] }],
  [opts("write"), WHY, "'I wrote a {text},' {f} said. She said she ______ a {text}.", { f: F, text: ["poem", "song", "letter", "story"] }],
  [opts("forget"), WHY, "'I forgot my {thing},' {m} said. He said he ______ his {thing}.", { m: M, thing: ["keys", "passport", "phone", "ticket"] }],
  [opts("break"), WHY, "'I broke the {thing},' {f} said. She said she ______ the {thing}.", { f: F, thing: ["vase", "window", "cup", "plate"] }],
  [opts("give"), WHY, "'I gave the {thing} to my sister,' {m} said. He said he ______ the {thing} to his sister.", { m: M, thing: ["book", "money", "keys", "letter"] }],
  [opts("do"), WHY, "'I did my {work},' {f} said. She said she ______ her {work}.", { f: F, work: ["homework", "exercises", "shopping", "washing"] }],
  [opts("speak"), WHY, "'I spoke to the {who},' {m} said. He said he ______ to the {who}.", { m: M, who: ["teacher", "manager", "doctor", "director"] }],
  [opts("fall"), WHY, "'I fell off my {bike},' {f} said. She said she ______ off her {bike}.", { f: F, bike: ["bike", "horse", "chair", "scooter"] }],
  [opts("drive"), WHY, "'We drove to {city},' the {who} said. They said they ______ to {city}.", { who: ["tourists", "students", "neighbours", "guests"], city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  [opts("take"), WHY, "'Someone took my {thing} by mistake,' {m} said. He said someone ______ his {thing} by mistake.", { m: M, thing: ["bike", "phone", "wallet", "car"] }],
  [opts("swim"), WHY, "'I swam in the {water},' {f} said. She said she ______ in the {water}.", { f: F, water: ["lake", "sea", "river", "pool"] }],
  [opts("choose"), WHY, "'We chose the {color} one,' my {who} said. They said they ______ the {color} one.", { who: ["parents", "friends", "cousins", "neighbours"], color: ["blue", "red", "black", "white"] }],
  [opts("wear"), WHY, "'I wore my new {thing},' {f} said. She said she ______ her new {thing}.", { f: F, thing: ["dress", "coat", "shoes", "scarf"] }],
  [opts("know"), WHY, "'I knew the answer to the {q},' {m} said. He said he ______ the answer to the {q}.", { m: M, q: ["question", "puzzle", "riddle", "maths problem"] }],
  [["had lost", "has lost", "have lost", "was lost"], WHY_PP, "'I've lost my {thing},' {m} said. He said he ______ his {thing}.", { m: M, thing: ["keys", "passport", "phone", "ticket"] }],
  [["had", "has", "have", "was"], WHY_PP, "'I've never been to {city},' {f} said. She said she ______ never been to {city}.", { f: F, city: ["London", "Seoul", "Paris", "Dubai"] }],
  [["had", "has", "have", "did"], WHY_PP, "'I've already done the {work},' {m} said. He said he ______ already done the {work}.", { m: M, work: ["homework", "shopping", "washing", "cleaning"] }],
].map(([o, why, prompt, slots], i) => {
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Report it. Use the past perfect (had + past participle) of the verb in brackets.";
// [verb, source, slots] — no source prints "had" or the participle; the past simple is also accepted
const BUILD = [
  ["begin", "'The film began at six,' {m} said. He said the film ______ (begin) at six, {f}.", { m: M, f: F }],
  ["fly", "'I flew to {city},' {f} said. She said she ______ (fly) to {city}.", { f: F, city: ["Moscow", "Istanbul", "Dubai", "Seoul"] }],
  ["ride", "'I rode a horse in the {place},' {m} said. He said he ______ (ride) a horse in the {place}.", { m: M, place: ["mountains", "village", "desert", "park"] }],
  ["sing", "'We sang at the {event},' the {who} said. They said they ______ (sing) at the {event}.", { who: ["children", "girls", "students", "boys"], event: ["wedding", "party", "concert", "festival"] }],
  ["draw", "'I drew a {thing},' {f} said. She said she ______ (draw) a {thing}.", { f: F, thing: ["horse", "map", "house", "tree"] }],
  ["hide", "'I hid the {thing},' {m} said. He said he ______ (hide) the {thing}.", { m: M, thing: ["presents", "cake", "keys", "money"] }],
  ["throw", "'I threw the ball over the {place},' {m} said. He said he ______ (throw) the ball over the {place}.", { m: M, place: ["wall", "fence", "roof", "trees"] }],
  ["see", "'I saw your {who} at the bazaar,' {f} said. She said she ______ (see) my {who} at the bazaar.", { f: F, who: ["brother", "mother", "uncle", "teacher"] }],
  ["go", "'I went to the {place},' {m} said. He said he ______ (go) to the {place}.", { m: M, place: ["dentist", "bank", "gym", "museum"] }],
  ["eat", "'We ate at the new {place},' my {who} said. They said they ______ (eat) at the new {place}.", { who: ["parents", "friends", "cousins", "neighbours"], place: ["café", "restaurant", "chaikhana", "canteen"] }],
  ["take", "'I took a lot of photos in {city},' {f} said. She said she ______ (take) a lot of photos in {city}.", { f: F, city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  ["write", "'I wrote to the {who},' {m} said. He said he ______ (write) to the {who}.", { m: M, who: ["manager", "director", "teacher", "landlord"] }],
  ["forget", "'I forgot her {thing},' {f} said. She said she ______ (forget) her {thing}.", { f: F, thing: ["birthday", "name", "number", "address"] }],
  ["break", "'I broke my {part},' {m} said. He said he ______ (break) his {part}.", { m: M, part: ["arm", "leg", "finger", "nose"] }],
  ["give", "'I gave my old {thing} away,' {f} said. She said she ______ (give) her old {thing} away.", { f: F, thing: ["bike", "clothes", "books", "toys"] }],
  ["speak", "'We spoke {lang} on the trip,' the {who} said. They said they ______ (speak) {lang} on the trip.", { who: ["tourists", "students", "girls", "boys"], lang: ["English", "Russian", "Turkish", "Korean"] }],
  ["fall", "'I fell asleep in the {place},' {m} said. He said he ______ (fall) asleep in the {place}.", { m: M, place: ["cinema", "car", "lesson", "meeting"] }],
  ["drive", "'I drove all night,' {f} said. She said she ______ (drive) all night, {m}.", { f: F, m: M }],
  ["take", "'Somebody took our {thing} by mistake,' the {who} said. They said somebody ______ (take) their {thing} by mistake.", { thing: ["coats", "bikes", "bags", "umbrellas"], who: ["tourists", "neighbours", "students", "guests"] }],
  ["wear", "'I wore a suit to the {event},' {m} said. He said he ______ (wear) a suit to the {event}.", { m: M, event: ["wedding", "interview", "party", "concert"] }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `had ${V[v][1]}`, acceptable: [V[v][0]], why: WHY, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REP = "Report the words. Use the past perfect.";
const FIX = "Correct the mistake.";
const PERF = "Report the words. The present perfect becomes the past perfect.";
// [instr, source, hint, key, acceptable, why, slots]
const TRANSFORM = [
  [REP, "'I went to the {place},' {m} said.", "{m} said that ______ to the {place}.", "he had gone", ["he went", "he'd gone"], WHY, { m: M, place: ["dentist", "bank", "gym", "museum"] }],
  [REP, "'I saw the {film},' {f} said.", "{f} said that ______ the {film}.", "she had seen", ["she saw", "she'd seen"], WHY, { f: F, film: ["film", "match", "play", "show"] }],
  [REP, "'We ate all the {food},' the {who} said.", "The {who} said that ______ all the {food}.", "they had eaten", ["they ate", "they'd eaten"], WHY, { who: ["children", "boys", "girls", "guests"], food: ["cake", "plov", "bread", "sweets"] }],
  [REP, "'I forgot my {thing},' {m} said.", "{m} said that ______ his {thing}.", "he had forgotten", ["he forgot", "he'd forgotten"], WHY, { m: M, thing: ["keys", "passport", "phone", "ticket"] }],
  [REP, "'I broke the {thing},' {f} said.", "{f} said that ______ the {thing}.", "she had broken", ["she broke", "she'd broken"], WHY, { f: F, thing: ["vase", "window", "cup", "plate"] }],
  [FIX, "{m} said he has seen the {film}.", "{m} said he ______ the {film}.", "had seen", ["saw"], WHY, { m: M, film: ["film", "match", "play", "show"] }],
  [FIX, "{f} said she had went to {city}.", "{f} said she ______ to {city}.", "had gone", ["went"], WHY, { f: F, city: ["Samarkand", "Bukhara", "Khiva", "Istanbul"] }],
  [FIX, "{m} said he had took my {thing}.", "{m} said he ______ my {thing}.", "had taken", ["took"], WHY, { m: M, thing: ["pen", "umbrella", "charger", "book"] }],
  [FIX, "My {who} said they have driven to {city}.", "My {who} said they ______ to {city}.", "had driven", ["drove"], WHY, { who: ["friends", "cousins", "parents", "neighbours"], city: ["Samarkand", "Bukhara", "Khiva", "Termez"] }],
  [FIX, "{f} said she had wrote a {text}.", "{f} said she ______ a {text}.", "had written", ["wrote"], WHY, { f: F, text: ["poem", "song", "letter", "story"] }],
  [PERF, "'I've finished the {work},' {f} said.", "{f} said that she ______ the {work}.", "had finished", [], WHY_PP, { f: F, work: ["homework", "project", "report", "book"] }],
  [PERF, "'I've lost my {thing},' {m} said.", "{m} said that he ______ his {thing}.", "had lost", [], WHY_PP, { m: M, thing: ["keys", "passport", "phone", "ticket"] }],
  [PERF, "'We've never been to {city},' my {who} said.", "My {who} said that they ______ never ______ to {city}.", ["had", "been"], [], WHY_PP, { who: ["parents", "friends", "cousins", "neighbours"], city: ["London", "Seoul", "Paris", "Dubai"] }],
  [PERF, "'I've already eaten,' {m} said at the {place}.", "At the {place}, {m} said that he ______ already ______.", ["had", "eaten"], [], WHY_PP, { m: M, place: ["party", "café", "wedding", "table"] }],
  [PERF, "'I've just bought a new {thing},' {f} said.", "{f} said that she ______ just ______ a new {thing}.", ["had", "bought"], [], WHY_PP, { f: F, thing: ["phone", "car", "dress", "laptop"] }],
].map(([instr, source, hint, key, acceptable, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["A friend said: 'I lost my phone.' Report it with the past perfect.", "He / She said he / she had lost …", ["exactly one sentence", "had + past participle", "pronoun change"]],
  ["Your brother said: 'I saw a famous singer.' Report it.", "He said he had seen …", ["exactly one sentence", "had seen", "said"]],
  ["Report something someone told you about their holiday. Use had + past participle.", "said (that) … had …", ["exactly one sentence", "past perfect", "said"]],
  ["Someone said: 'I've finished.' Report it.", "… said he / she had finished", ["exactly one sentence", "had finished", "pronoun"]],
  ["Write the direct words (past simple) and then the reported sentence.", "direct → reported with had", ["exactly two sentences", "past simple in quotes", "had + past participle"]],
  ["Your teacher said: 'I wrote a book.' Report it.", "… said he / she had written a book", ["exactly one sentence", "had written", "said"]],
  ["Your friends said: 'We went to the mountains.' Report it.", "They said they had gone …", ["exactly one sentence", "they", "had gone"]],
  ["Someone said: 'I've never been to London.' Report it.", "… said he / she had never been …", ["exactly one sentence", "had never been", "said"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["A friend told you about a bad day. Write three or four sentences reporting what had happened.", "reported speech with had + pp", ["said", "had + past participle", "three or four sentences"]],
  ["Report what your family said about a trip they took. Write three or four sentences.", "past perfect in reported speech", ["they said", "had", "three or four sentences"]],
  ["A classmate told you about a film. Report it in three or four sentences.", "backshift past → past perfect", ["said", "had seen / had liked", "three or four sentences"]],
  ["Write three or four sentences reporting what a tourist said about your city.", "had + past participle", ["said", "had", "three or four sentences"]],
  ["Report a story a grandparent told you about their youth. Write three or four sentences.", "past perfect in reported speech", ["said", "had", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/reported-speech.statements.backshift-past.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "'I saw' moves back a step: saw → had seen.",
   "'We went' moves back a step: had gone.",
   "'I ate' moves back a step: had eaten.",
   "'I took' moves back a step: had taken.",
   "'I wrote' moves back a step: had written.",
   "'I forgot' moves back a step: had forgotten.",
   "'I broke' moves back a step: had broken.",
   "'I gave' moves back a step: had given.",
   "'I did' moves back a step: had done.",
   "'I spoke' moves back a step: had spoken.",
   "'I fell off' moves back a step: had fallen.",
   "'We drove' moves back a step: had driven.",
   "'Someone took' moves back a step: had taken.",
   "'I swam' moves back a step: had swum.",
   "'We chose' moves back a step: had chosen.",
   "'I wore' moves back a step: had worn.",
   "'I knew' moves back a step: had known.",
   "'I've lost' (present perfect) moves back: had lost.",
   "'I've never been' moves back: have → had.",
   "'I've already done' moves back: have → had."
  ],
  "build": [
   "began moves back: had + begun.",
   "flew moves back: had + flown.",
   "rode moves back: had + ridden.",
   "sang moves back: had + sung.",
   "drew moves back: had + drawn.",
   "hid moves back: had + hidden.",
   "threw moves back: had + thrown.",
   "saw moves back: had + seen.",
   "went moves back: had + gone.",
   "ate moves back: had + eaten.",
   "took a lot of photos: had + taken.",
   "wrote moves back: had + written.",
   "forgot moves back: had + forgotten.",
   "broke moves back: had + broken.",
   "gave away moves back: had + given.",
   "spoke moves back: had + spoken.",
   "fell asleep moves back: had + fallen.",
   "drove all night: had + driven.",
   "Somebody took it: had + taken.",
   "wore moves back: had + worn."
  ],
  "transform": [
   "I went → he had gone.",
   "I saw → she had seen.",
   "We ate → they had eaten.",
   "I forgot → he had forgotten.",
   "I broke → she had broken.",
   "Past report: has seen → had seen.",
   "had + past participle: gone, not went.",
   "had + past participle: taken, not took.",
   "Past report: have driven → had driven.",
   "had + past participle: written, not wrote.",
   "I've finished → she had finished.",
   "I've lost → he had lost.",
   "We've never been → had never been.",
   "I've already eaten → had already eaten.",
   "I've just bought → had just bought."
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
