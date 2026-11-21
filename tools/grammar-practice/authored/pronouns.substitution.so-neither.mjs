// Hand-authored: pronouns / substitution / so-neither (B1).
// Wave C, C19 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: short agreeing answers. So + auxiliary + subject after a
// positive ("I love plov." "So do I."), Neither + auxiliary + subject after a
// negative ("I don't eat meat." "Neither do I."), with the auxiliary matching
// the statement (am / do / did / have / can / will / was / does).
// Learner errors: wrong auxiliary ("I'm cold." "So do I."), statement order
// ("Neither I can"), double negative ("I don't neither"), word-for-word
// "Also I do" (Uzbek "Men ham", Russian "Я тоже").
// Never offered as wrong: Me too, Me neither, I do too, I don't either, Nor do
// I (all English). "So I am / So I do" are not offered either (emphatic
// "yes, I really am" exists). "have" for possession is avoided ("I have a
// car." "So have I" is British English).
// Choose: 10 So / 10 Neither, two with a third-person subject (So does …).
// Build: types only the auxiliary in "So ___ I." / "Neither ___ I." frames.
// Transform: the whole answer: 5 correct / 5 agree with So / 5 agree with
// Neither (Neither keys accept Nor).
//
// Run: node tools/grammar-practice/authored/pronouns.substitution.so-neither.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "substitution", topic: "so-neither", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const FOOD = ["plov", "fish", "spicy food", "sweets"];
const EVENT = ["party", "wedding", "concert", "meeting"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const LANG = ["Korean", "Turkish", "Spanish", "Chinese"];
const SKILL = ["swim", "drive", "ski", "dance"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
// Every line is said by a named friend, so each dialogue has a speaker slot.
const SPK = "{spk} says:";
const W_SO = "To agree with a positive sentence, say So + the same helping verb + I (am, do, did, have, can, will, was). The helping verb comes before I.";
const W_NE = "To agree with a negative sentence, say Neither + the same helping verb + I, with no not: Neither do I, Neither can I. The helping verb comes before I.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["s", "'I live in {city}.' '______.'", ["So do I", "So am I", "Neither do I", "So I live"], { city: CITY }],
  ["s", "'I'm tired after the {thing}.' '______.'", ["So am I", "So do I", "Neither am I", "So I'm"], { thing: ["trip", "match", "lesson", "walk"] }],
  ["s", "'I can {skill}.' '______.'", ["So can I", "So do I", "Neither can I", "Can I too"], { skill: SKILL }],
  ["s", "'I went to the {event} {when}.' '______.'", ["So did I", "So went I", "So do I", "Neither did I"], { event: EVENT, when: PAST }],
  ["s", "'I've been to {city} twice.' '______.'", ["So have I", "So did I", "So am I", "Neither have I"], { city: CITY }],
  ["s", "'I'll be at the {place} tomorrow.' '______.'", ["So will I", "So I'll", "So do I", "Neither will I"], { place: ["library", "gym", "bazaar", "station"] }],
  ["s", "'I was late for the {thing} {when}.' '______.'", ["So was I", "So did I", "So were I", "Neither was I"], { thing: ["lesson", "bus", "meeting", "exam"], when: PAST }],
  ["s", "'I love {food}.' '______.'", ["So do I", "So am I", "Neither do I", "So love I"], { food: FOOD }],
  ["s", "'I'm learning {lang}.' '______.'", ["So am I", "So do I", "Neither am I", "So I'm"], { lang: LANG }],
  ["s", "'My cousin speaks {lang}.' '______ my brother.'", ["So does", "So do", "So is", "Neither does"], { lang: LANG }],
  ["n", "'I don't like {food}.' '______.'", ["Neither do I", "So do I", "Neither I do", "I don't neither"], { food: FOOD }],
  ["n", "'I'm not ready for the {test}.' '______.'", ["Neither am I", "Neither do I", "So am I", "Neither I am"], { test: ["test", "exam", "match", "trip"] }],
  ["n", "'I can't {skill}.' '______.'", ["Neither can I", "Neither do I", "So can I", "Neither I can"], { skill: SKILL }],
  ["n", "'I didn't sleep well {when}.' '______.'", ["Neither did I", "Neither do I", "So did I", "Neither I did"], { when: PAST }],
  ["n", "'I haven't seen the new {film} yet.' '______.'", ["Neither have I", "Neither did I", "So have I", "Neither I have"], { film: ["film", "cartoon", "series", "show"] }],
  ["n", "'I won't be at the {event} on {day}.' '______.'", ["Neither will I", "Neither I'll", "So will I", "Neither I will"], { event: EVENT, day: ["Friday", "Saturday", "Sunday", "Monday"] }],
  ["n", "'I wasn't at school {when}.' '______.'", ["Neither was I", "Neither did I", "So was I", "Neither I was"], { when: PAST }],
  ["n", "'I don't drink {drink}.' '______.'", ["Neither do I", "Neither am I", "So do I", "I don't neither"], { drink: ["coffee", "cola", "milk", "green tea"] }],
  ["n", "'My {who} doesn't eat meat.' '______ my {who2}.'", ["Neither does", "Neither do", "So does", "Neither is"], { who: ["sister", "aunt", "mum", "grandma"], who2: ["brother", "uncle", "dad", "cousin"] }],
  ["n", "'We weren't at home {when}.' '______ we.'", ["Neither were", "Neither did", "So were", "Neither was"], { when: PAST }],
].map(([k, prompt, opts, slots], i) => {
  const options = rot(opts, i);
  const p = `${SPK} ${prompt}`;
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(opts[0]), why: k === "s" ? W_SO : W_NE, slots: { ...pick(prompt, slots), spk: NAME } };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the helping verb (do, am, did, have, can, will, was …).";
const BUILD = [
  ["do", W_SO, "'I live near the {place}.' 'So ______ I.'", { place: ["park", "school", "river", "bazaar"] }],
  ["am", W_SO, "'I'm hungry after the {thing}.' 'So ______ I.'", { thing: ["trip", "match", "lesson", "walk"] }],
  ["did", W_SO, "'I enjoyed the {event} {when}.' 'So ______ I.'", { event: EVENT, when: PAST }],
  ["have", W_SO, "'I've finished my {work}.' 'So ______ I.'", { work: ["homework", "essay", "project", "report"] }],
  ["will", W_SO, "'I'll take the bus to {city}.' 'So ______ I.'", { city: CITY }],
  ["does", W_SO, "'My brother likes {food}.' 'So ______ my sister.'", { food: FOOD }],
  ["do", W_SO, "'I love {sport}.' 'So ______ I.'", { sport: ["football", "tennis", "chess", "swimming"] }],
  ["am", W_SO, "'I'm going to {city} in {month}.' 'So ______ I.'", { city: CITY, month: ["May", "June", "July", "August"] }],
  ["did", W_SO, "'I saw your {who} at the bazaar {when}.' 'So ______ I.'", { who: ["mum", "dad", "aunt", "teacher"], when: PAST }],
  ["have", W_SO, "'I've got a cold {when}.' 'So ______ I.'", { when: ["again", "this week", "today", "now"] }],
  ["do", W_NE, "'I don't like {food}.' 'Neither ______ I.'", { food: FOOD }],
  ["am", W_NE, "'I'm not hungry {when}.' 'Neither ______ I.'", { when: ["now", "today", "yet", "at all"] }],
  ["can", W_NE, "'I can't {skill}.' 'Neither ______ I.'", { skill: SKILL }],
  ["did", W_NE, "'I didn't go to the {event} {when}.' 'Neither ______ I.'", { event: EVENT, when: PAST }],
  ["have", W_NE, "'I haven't been to {city}.' 'Neither ______ I.'", { city: CITY }],
  ["will", W_NE, "'I won't be late {when}.' 'Neither ______ I.'", { when: ["tomorrow", "tonight", "on Monday", "next time"] }],
  ["was", W_NE, "'I wasn't at the {place} {when}.' 'Neither ______ I.'", { place: ["lesson", "meeting", "club", "match"], when: PAST }],
  ["does", W_NE, "'My mum doesn't drink {drink}.' 'Neither ______ my dad.'", { drink: ["coffee", "cola", "milk", "green tea"] }],
  ["do", W_NE, "'I don't understand this {thing}.' 'Neither ______ I.'", { thing: ["rule", "word", "question", "task"] }],
  ["were", W_NE, "'We weren't ready for the {test}.' 'Neither ______ we.'", { test: ["test", "exam", "match", "trip"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source: `${SPK} ${source}`, key, why, slots: { ...pick(source, slots), spk: NAME } }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the answer.";
const SO = "Agree. Use So.";
const NE = "Agree. Use Neither.";
const nor = (k) => [k.replace("Neither", "Nor")];
const TRANSFORM = [
  // correct (5): any correct agreeing answer is accepted
  [COR, "'I like {food}.' 'So am I.'", "'I like {food}.' '______.'", "So do I", W_SO, { food: FOOD }, ["Me too", "I do too"]],
  [COR, "'I'm cold {where}.' 'So do I.'", "'I'm cold {where}.' '______.'", "So am I", W_SO, { where: ["in here", "outside", "today", "again"] }, ["Me too", "I am too"]],
  [COR, "'I can't {skill}.' 'Neither I can.'", "'I can't {skill}.' '______.'", "Neither can I", W_NE, { skill: SKILL }, ["Nor can I", "Me neither", "I can't either"]],
  [COR, "'I didn't see the {film}.' 'I didn't neither.'", "'I didn't see the {film}.' '______.'", "Neither did I", W_NE, { film: ["film", "match", "show", "news"] }, ["Nor did I", "Me neither", "I didn't either"]],
  [COR, "'I've lost my {thing}.' 'So did I.'", "'I've lost my {thing}.' '______.'", "So have I", W_SO, { thing: ["keys", "phone", "ticket", "pen"] }, ["Me too", "I have too"]],
  // agree with So (5)
  [SO, "'I went to the {event} {when}.'", "'I went to the {event} {when}.' '______.'", "So did I", W_SO, { event: EVENT, when: PAST }, []],
  [SO, "'I'll be late {when}.'", "'I'll be late {when}.' '______.'", "So will I", W_SO, { when: ["tomorrow", "tonight", "on Monday", "again"] }, []],
  [SO, "'I'm going to {city} next week.'", "'I'm going to {city} next week.' '______.'", "So am I", W_SO, { city: CITY }, []],
  [SO, "'My sister works in a {place}.' Agree about my brother.", "'My sister works in a {place}.' '______ my brother.'", "So does", W_SO, { place: ["bank", "school", "hospital", "hotel"] }, []],
  [SO, "'I've got two {sib}.'", "'I've got two {sib}.' '______.'", "So have I", W_SO, { sib: ["sisters", "brothers", "cousins", "cats"] }, []],
  // agree with Neither (5)
  [NE, "'I don't like {food}.'", "'I don't like {food}.' '______.'", "Neither do I", W_NE, { food: FOOD }, nor("Neither do I")],
  [NE, "'I wasn't at the {event}.'", "'I wasn't at the {event}.' '______.'", "Neither was I", W_NE, { event: EVENT }, nor("Neither was I")],
  [NE, "'I haven't finished the {work}.'", "'I haven't finished the {work}.' '______.'", "Neither have I", W_NE, { work: ["homework", "essay", "project", "book"] }, nor("Neither have I")],
  [NE, "'My dad can't {skill}.' Agree about my mum.", "'My dad can't {skill}.' '______ my mum.'", "Neither can", W_NE, { skill: SKILL }, nor("Neither can")],
  [NE, "'I won't be home {when}.'", "'I won't be home {when}.' '______.'", "Neither will I", W_NE, { when: ["tonight", "on Sunday", "before ten", "for dinner"] }, nor("Neither will I")],
].map(([instr, source, hint, key, why, slots, acceptable]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source: `${SPK} ${source}`, hint: `${SPK} ${hint}`, key, ...(acceptable.length ? { acceptable } : {}), why, slots: { ...pick(source + hint, slots), spk: NAME } }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your friend says: 'I love summer.' Agree with them.", "So do I.", ["So + helping verb + I", "one short answer", "no So I do"]],
  ["Your friend says: 'I can't cook.' Agree with them.", "Neither can I.", ["Neither + helping verb + I", "no not after Neither", "one short answer"]],
  ["Write one true sentence about yourself, then the answer a friend who agrees would give.", "I'm … / So am I.", ["a statement", "a matching So / Neither answer", "the same helping verb"]],
  ["Write one negative sentence about yesterday, then an agreeing answer.", "I didn't … / Neither did I.", ["a past negative", "Neither did I", "two lines"]],
  ["Your friend says: 'I've never been to London.' Agree with them.", "Neither have I.", ["Neither have I", "never counts as negative", "one short answer"]],
  ["Write a sentence about your brother or sister and agree about another person.", "My sister likes … / So does my …", ["So does + person", "a present verb", "two lines"]],
  ["Your friend says: 'I'm not going to the party.' Agree with them.", "Neither am I.", ["Neither am I", "no Neither do I", "one short answer"]],
  ["Write two short dialogues: one with So and one with Neither.", "'I'm …' 'So am I.' / 'I don't …' 'Neither do I.'", ["So + helping verb", "Neither + helping verb", "two dialogues"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write a short dialogue between two new classmates who find they have a lot in common.", "'I live in …' 'So do I!' 'I can't …' 'Neither can I.'", ["So + helping verb + I", "Neither + helping verb + I", "four to six lines"]],
  ["Write a dialogue about food two friends like and don't like.", "'I love …' 'So do I.' 'I don't eat …' 'Neither do I.'", ["So do I / Neither do I", "matching helping verbs", "four to six lines"]],
  ["Write a dialogue about last weekend.", "'I stayed at home.' 'So did I.' 'I didn't …' 'Neither did I.'", ["So did I / Neither did I", "past verbs", "four to six lines"]],
  ["Write a dialogue about plans for the summer.", "'I'm going to …' 'So am I.' 'I won't …' 'Neither will I.'", ["So am I / So will I", "Neither will I", "four to six lines"]],
  ["Write a dialogue about places you have visited.", "'I've been to …' 'So have I.' 'I haven't …' 'Neither have I.'", ["So have I / Neither have I", "present perfect", "four to six lines"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.substitution.so-neither.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);