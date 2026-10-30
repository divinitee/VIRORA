// VT-40 session recap: node tools/coach/recap-tests.mjs
import { buildRecap } from "../../src/lib/coach/sessionRecap.js";

let pass = 0, fail = 0;
const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${n}${c || !x ? "" : `  -> ${x}`}`); };

const planItems = [
  { item_key: "word:w1:0", item_type: "word", word_id: "w1", label: "Needs work" },
  { item_key: "word:w2:0", item_type: "word", word_id: "w2", label: "New" },
  { item_key: "word:w3:0", item_type: "word", word_id: "w3", label: "Practising" },
  { item_key: "grammar:tenses.present.simple-routine", item_type: "grammar", label: "New" },
];
const names = { w1: "success", w2: "concert", w3: "train" };
const words = { "word:w1:0": { right: 3, total: 3 }, "word:w2:0": { right: 2, total: 3 }, "word:w3:0": { right: 3, total: 3 } };
const grammar = { "grammar:tenses.present.simple-routine": { correct: 4, total: 5 } };
const map = { words: [
  { item_key: "word:w1:0", label: "Practising" },   // moved up
  { item_key: "word:w2:0", label: "Practising" },   // learned
  { item_key: "word:w3:0", label: "Practising" },   // unchanged
], grammar: [{ item_key: "grammar:tenses.present.simple-routine", label: "Needs work" }] };

const r = buildRecap({ planItems, words, grammar, map, session: { spent_minutes: 7.6 }, names });
ok("counts words and grammar topics actually practised", r.words === 3 && r.grammar === 1);
ok("accuracy over every answer this run (12/14 = 86%)", r.answers === 14 && r.accuracy === 86, JSON.stringify(r));
ok("minutes come from the server's spent_minutes", r.minutes === 8);
ok("moved up: success Needs work -> Practising", r.moved.length === 1 && r.moved[0].name === "success" && r.moved[0].from === "Needs work" && r.moved[0].to === "Practising");
ok("learned: concert New -> Practising", r.learned.length === 1 && r.learned[0].name === "concert");
ok("unchanged items are not claimed as progress (train)", !r.moved.some((m) => m.name === "train") && !r.learned.some((m) => m.name === "train"));
ok("a word with a miss that the server still moved forward is shown as learned, not 'again' (concert)", r.learned.some((a) => a.name === "concert") && !r.again.some((a) => a.name === "concert"));
const r2 = buildRecap({ planItems, words: { ...words, "word:w3:0": { right: 1, total: 3 } }, grammar, map, names });
ok("practise again: a word with a miss and no progress (train)", r2.again.some((a) => a.name === "train" && a.kind === "word"));
ok("practise again: a grammar topic the server still rates Needs work", r.again.some((a) => a.kind === "grammar"));
ok("an item shown as progress is never ALSO in 'worth another look'", ![...r.moved, ...r.learned].some((m) => r.again.some((a) => a.key === m.key)));
ok("New -> Needs work is NOT 'learned'", !r.learned.some((m) => m.key.startsWith("grammar:")));

const noMap = buildRecap({ planItems, words, grammar, map: null, session: { spent_minutes: 3 }, names });
ok("no map (getMap failed): no moved/learned section is invented", noMap.hasMap === false && noMap.moved.length === 0 && noMap.learned.length === 0);
ok("...but the honest numbers still show", noMap.words === 3 && noMap.accuracy === 86);

const empty = buildRecap({});
ok("nothing answered: zero counts, accuracy null (not 0%)", empty.words === 0 && empty.grammar === 0 && empty.accuracy === null && empty.minutes === 0);

const unknownWord = buildRecap({ planItems, words: { "word:zz:0": { right: 1, total: 1 } }, map, names });
ok("an answered item that wasn't in the plan has no name and is skipped from the lists", unknownWord.moved.length === 0 && unknownWord.again.length === 0);

const many = buildRecap({ planItems: Array.from({ length: 10 }, (_, i) => ({ item_key: `word:x${i}:0`, item_type: "word", word_id: `x${i}`, label: "New" })),
  words: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`word:x${i}:0`, { right: 0, total: 2 }])), names: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`x${i}`, `w${i}`])) });
ok("practise-again list is capped at 6", many.again.length === 6);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
