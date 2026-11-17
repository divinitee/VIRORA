// Hand-authored: sentence-structure / word-order / double-object (A2).
// Path fill P52 (2026-11-17, Base44 AI, branch grammar-path-fill-4-base44).
//
// Placement focus: S + V + indirect object + direct object (a / gave /
// sister / I / present / my → I gave my sister a present).
// Choose: four orders of the same sentence; key S V IO DO. Distractors:
// S V DO IO without to ("gave a present my sister"), S V to-IO DO ("gave
// to my sister a present", the Russian "дал моей сестре" calque) and
// S IO V DO ("I my sister gave", the Uzbek verb-late order). NEVER offered:
// "gave a present to my sister" (correct English), and no pronoun as the
// direct object ("gave it my sister" / "gave me it" are disputed).
// Verbs: give, send, show, tell, buy, make, bring, lend, teach, read, pass,
// write, cook, get, sell, offer: only ones where the double-object order is
// natural. P2 (S V O) and P28 (place + time) stay as they are in every line.
// Build: two gaps, IO then DO; the two parts are listed in instr in a mixed
// order. Typed keys never contain a slot.
// Transform: 5 to-form → double object / 5 correct the order / 5 for-form
// → double object (key = "IO DO").
//
// Run: node tools/grammar-practice/authored/sentence-structure.word-order.double-object.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "word-order", topic: "double-object", level: "A2", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];

const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const WHY = "After give, send, show, tell, buy and similar verbs: the person first, then the thing (gave my sister a present). Or use to / for: gave a present to my sister.";

/* ---------------- choose: 20 mcq ---------------- */
const ORD = ([s, v, io, d]) => {
  const subj = s === "I" ? "I" : s;
  const key = cap(`${subj} ${v} ${io} ${d}`);
  return [key, cap(`${subj} ${v} ${d} ${io}`), cap(`${subj} ${v} to ${io} ${d}`), cap(`${subj} ${io} ${v} ${d}`)];
};
const CHOOSE = [
  [["I", "gave", "my sister", "a present"], "______. It was her birthday, {name}. She loved the {thing}.", { name: NAME, thing: ["scarf", "book", "bag", "watch"] }],
  [["Grandma", "told", "us", "a long story"], "______. It was about {topic}, {name}.", { topic: ["her village", "a clever fox", "a king", "her school days"], name: NAME }],
  [["my uncle", "sent", "me", "a postcard"], "______. It's from {city}, {name}.", { city: ["Istanbul", "Moscow", "London", "Almaty"], name: NAME }],
  [["Dad", "bought", "my brother", "a new bike"], "______. It's {colour}, and he rides it every {day}.", { colour: ["red", "blue", "black", "green"], day: ["day", "evening", "weekend", "morning"] }],
  [["the teacher", "showed", "the class", "some photos"], "______. They were from her trip to {city}, {name}.", { city: ["Khiva", "Bukhara", "Samarkand", "Fergana"], name: NAME }],
  [["can you", "pass", "me", "the salt"], "______, please, {name}? The {food} needs a little more.", { name: NAME, food: ["soup", "salad", "rice", "plov"] }],
  [["Mum", "made", "us", "a big cake"], "______. We ate it with {drink}, {name}.", { drink: ["tea", "milk", "juice", "lemonade"], name: NAME }],
  [["my friend", "lent", "me", "his dictionary"], "______. I need it for my {subj} homework, {name}.", { subj: ["English", "Russian", "German", "French"], name: NAME }],
  [["our neighbour", "brought", "us", "some apples"], "______. They're from her {place}, {name}.", { place: ["garden", "village", "farm", "tree"], name: NAME }],
  [["Ms Ivanova", "teaches", "us", "English"], "______. Her lessons are on {day}, {name}.", { day: ["Mondays", "Tuesdays", "Thursdays", "Fridays"], name: NAME }],
  [["Lola", "wrote", "her grandma", "a letter"], "______. She told her about her new {thing}, {name}.", { thing: ["school", "friends", "flat", "teacher"], name: NAME }],
  [["Dad", "reads", "the twins", "a story"], "______. They go to bed at {time}, {name}.", { time: ["eight", "nine", "half past eight", "nine o'clock"], name: NAME }],
  [["Aziz", "got", "his mum", "some flowers"], "______. They were {colour} roses, {name}.", { colour: ["red", "white", "pink", "yellow"], name: NAME }],
  [["the man", "sold", "us", "a melon"], "______. It was very sweet, {name}. We paid {price}.", { name: NAME, price: ["ten thousand", "fifteen thousand", "twenty thousand", "twelve thousand"] }],
  [["my aunt", "cooked", "us", "plov"], "______. She uses a big {pot}, {name}.", { pot: ["kazan", "black pot", "old pot", "pot"], name: NAME }],
  [["please", "give", "me", "your phone number"], "______, {name}. I'll call you {when}.", { name: NAME, when: ["tonight", "tomorrow", "on Friday", "after school"] }],
  [["the waiter", "brought", "us", "the menu"], "______. We ordered {food}, {name}.", { food: ["soup", "plov", "salad", "kebabs"], name: NAME }],
  [["I", "will send", "you", "the photos"], "______ tonight, {name}. They're on my {dev}.", { name: NAME, dev: ["phone", "laptop", "camera", "tablet"] }],
  [["Timur", "showed", "me", "his new phone"], "______. It has a very good {part}, {name}.", { part: ["camera", "screen", "battery", "speaker"], name: NAME }],
  [["my grandparents", "gave", "us", "some money"], "______. We bought {thing} with it, {name}.", { thing: ["books", "a game", "new shoes", "a football"], name: NAME }],
].map(([parts, prompt, slots], i) => {
  const base = ORD(parts);
  const options = rot(base, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(base[0]), why: WHY, slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const B = (key, list, source, slots) => ({ instr: `Put these words in the right gaps: ${list}.`, source, key, slots });
const BUILD = [
  B(["me", "a book"], "a book / me", "My {who} gave ______ ______ for my birthday, {name}.", { who: ["aunt", "uncle", "cousin", "teacher"], name: NAME }),
  B(["us", "a funny story"], "a funny story / us", "Grandpa told ______ ______ {when}, {name}.", { when: ["last night", "after dinner", "yesterday", "on Sunday"], name: NAME }),
  B(["my brother", "a message"], "a message / my brother", "I sent ______ ______ {when}, {name}.", { when: ["this morning", "an hour ago", "yesterday", "last night"], name: NAME }),
  B(["the children", "some sweets"], "some sweets / the children", "The {who} gave ______ ______.", { who: ["neighbour", "teacher", "guest", "shop owner"], x: [] }),
  B(["me", "his photos"], "his photos / me", "{name} showed ______ ______ from {city}.", { name: ["Aziz", "Timur", "Bobur", "Rustam"], city: ["Khiva", "Bukhara", "Samarkand", "Istanbul"] }),
  B(["us", "a big pizza"], "a big pizza / us", "Dad bought ______ ______ on {day}, {name}.", { day: ["Friday", "Saturday", "Sunday", "my birthday"], name: NAME }),
  B(["my sister", "a dress"], "a dress / my sister", "Mum made ______ ______ for the {event}.", { event: ["wedding", "party", "concert", "holiday"], x: [] }),
  B(["me", "the bread"], "the bread / me", "Can you pass ______ ______, {who}?", { who: ["Mum", "Dad", "Grandma", "Aziz"], x: [] }),
  B(["us", "maths"], "maths / us", "Mr Karimov teaches ______ ______ on {day}.", { day: ["Mondays", "Tuesdays", "Wednesdays", "Fridays"], x: [] }),
  B(["her friend", "a letter"], "a letter / her friend", "{name} wrote ______ ______ from {city}.", { name: ["Lola", "Olga", "Madina", "Kamila"], city: ["Moscow", "London", "Almaty", "Istanbul"] }),
  B(["me", "her bike"], "her bike / me", "My {who} lent ______ ______ for the weekend, {name}.", { who: ["sister", "cousin", "neighbour", "friend Lola"], name: NAME }),
  B(["us", "some fruit"], "some fruit / us", "Our {who} brought ______ ______ from the {place}.", { who: ["grandparents", "cousins", "neighbours", "aunt and uncle"], place: ["village", "garden", "bazaar", "farm"] }),
  B(["the baby", "a song"], "a song / the baby", "{who} sang ______ ______, and he fell asleep.", { who: ["Mum", "Grandma", "My sister", "Aunt Lola"], x: [] }),
  B(["you", "my notes"], "my notes / you", "I'll send ______ ______ tonight, {name}.", { name: NAME, x: [] }),
  B(["his grandma", "a cup of tea"], "a cup of tea / his grandma", "{name} made ______ ______ after {event}.", { name: ["Aziz", "Timur", "Bobur", "Rustam"], event: ["work", "dinner", "lunch", "the long trip"] }),
  B(["us", "the way"], "the way / us", "A {who} showed ______ ______ to the {place}.", { who: ["shop assistant", "kind woman", "taxi driver", "student"], place: ["station", "museum", "bazaar", "hotel"] }),
  B(["me", "a ticket"], "a ticket / me", "My {who} got ______ ______ for the {event}, {name}.", { who: ["brother", "dad", "uncle", "cousin"], event: ["match", "concert", "film", "show"], name: NAME }),
  B(["the guests", "plov"], "plov / the guests", "Grandma cooked ______ ______ in a big {pot}.", { pot: ["kazan", "black pot", "old pot", "pot"], x: [] }),
  B(["my dad", "a new watch"], "a new watch / my dad", "We gave ______ ______ for his {event}, {name}.", { event: ["birthday", "fiftieth birthday", "new job", "sixtieth birthday"], name: NAME }),
  B(["us", "some homework"], "some homework / us", "The teacher gave ______ ______ for {day}, {name}.", { day: ["Monday", "Tuesday", "tomorrow", "the weekend"], name: NAME }),
].map(({ instr, source, key, slots }) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "build", format: "gap_fill", instr, source, key, why: `The person first (${key[0]}), then the thing (${key[1]}).`, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TO = "Rewrite the sentence without to: the person first, then the thing.";
const FOR = "Rewrite the sentence without for: the person first, then the thing.";
const COR = "Correct the word order.";
const TRANSFORM = [
  // to-form -> IO DO (5)
  [TO, "I gave a present to my sister {when}, {name}.", "I gave ______ {when}, {name}.", "my sister a present", { when: ["yesterday", "on her birthday", "last week", "this morning"], name: NAME }],
  [TO, "My {who} sent a postcard to me from {city}.", "My {who} sent ______ from {city}.", "me a postcard", { who: ["uncle", "aunt", "cousin", "friend"], city: ["Istanbul", "Moscow", "London", "Almaty"] }],
  [TO, "{name} showed his drawings to the class {when}.", "{name} showed ______ {when}.", "the class his drawings", { name: ["Aziz", "Timur", "Bobur", "Rustam"], when: ["today", "yesterday", "on Monday", "after lunch"] }],
  [TO, "Grandma told a story to the children {when}, {name}.", "Grandma told ______ {when}, {name}.", "the children a story", { when: ["last night", "after dinner", "before bed", "on Sunday"], name: NAME }],
  [TO, "Please pass the water to me, {name}. I'm {state}.", "Please pass ______, {name}. I'm {state}.", "me the water", { name: NAME, state: ["thirsty", "very hot", "tired", "hungry"] }],
  // correct the order (5)
  [COR, "Dad bought a new bike me {when}, {name}.", "Dad bought ______ {when}, {name}.", "me a new bike", { when: ["yesterday", "for my birthday", "last summer", "last week"], name: NAME }],
  [COR, "The teacher gave to us a test {when}, {name}.", "The teacher gave ______ {when}, {name}.", "us a test", { when: ["today", "on Friday", "yesterday", "this morning"], name: NAME }],
  [COR, "My friend lent his phone me {when}, {name}.", "My friend lent ______ {when}, {name}.", "me his phone", { when: ["yesterday", "for an hour", "this morning", "after school"], name: NAME }],
  [COR, "{name} wrote a long letter her grandma from {city}.", "{name} wrote ______ from {city}.", "her grandma a long letter", { name: ["Lola", "Olga", "Madina", "Kamila"], city: ["Moscow", "London", "Almaty", "Istanbul"] }],
  [COR, "Our neighbour brought to us some {food} {when}.", "Our neighbour brought ______ {when}.", "us some {food}", { food: [], when: [] }],
  // for-form -> IO DO (5)
  [FOR, "Mum made a cake for us {when}, {name}.", "Mum made ______ {when}, {name}.", "us a cake", { when: ["yesterday", "on Sunday", "for my birthday", "last night"], name: NAME }],
  [FOR, "My {who} bought a ticket for me, {name}.", "My {who} bought ______, {name}.", "me a ticket", { who: ["dad", "brother", "uncle", "cousin"], name: NAME }],
  [FOR, "{name} got some flowers for his grandma {when}.", "{name} got ______ {when}.", "his grandma some flowers", { name: ["Aziz", "Timur", "Bobur", "Rustam"], when: ["yesterday", "on her birthday", "on Women's Day", "last week"] }],
  [FOR, "Grandma cooked plov for the guests {when}, {name}.", "Grandma cooked ______ {when}, {name}.", "the guests plov", { when: ["yesterday", "on Friday", "for the wedding", "last night"], name: NAME }],
  [FOR, "I'll get a coffee for you, {name}. Wait {where}.", "I'll get ______, {name}. Wait {where}.", "you a coffee", { name: NAME, where: ["here", "by the door", "at the table", "outside"] }],
].map(([instr, source, hint, key, slots]) => ({ instr, source, hint, key, slots }));

// The "us some {food}" line above had a slot in its key; replace it with a
// fixed key before the lint sees it.
TRANSFORM[9] = { instr: COR, source: "Our neighbour brought to us some apples {when}, {name}.", hint: "Our neighbour brought ______ {when}, {name}.", key: "us some apples", slots: { when: ["yesterday", "this morning", "on Sunday", "last week"], name: NAME } };

const TR = TRANSFORM.map(({ instr, source, hint, key, slots }) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = v;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why: WHY, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a present someone gave you. Put the person before the thing.", "… gave me …", ["exactly one sentence", "gave me + a thing", "no to"]],
  ["Write one sentence about something you sent to a friend. Use sent + person + thing.", "I sent my friend …", ["exactly one sentence", "sent + person + thing", "no to"]],
  ["Write one sentence about a meal a relative cooked for your family.", "My … cooked us …", ["exactly one sentence", "cooked us", "a food word"]],
  ["Write one sentence about a teacher who taught you something.", "… teaches / taught us …", ["exactly one sentence", "teach + us", "a subject word"]],
  ["Ask a friend to pass you something at the table.", "Can you pass me …?", ["exactly one question", "pass me", "a food word"]],
  ["Write one sentence about a story someone told you.", "… told me a story about …", ["exactly one sentence", "told me", "a story word"]],
  ["Write one sentence about something you bought for your mum or dad.", "I bought my mum …", ["exactly one sentence", "bought + person + thing", "no for"]],
  ["Write two sentences: something you gave someone, and something someone showed you.", "I gave … / … showed me …", ["exactly two sentences", "gave + person + thing", "showed me + thing"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your last birthday: what did people give you, and what did they make you?", "gave me / made me", ["gave me", "a second verb + me", "three or four sentences"]],
  ["Write about a kind neighbour or relative: what does he or she bring you, tell you or show you?", "brings us / tells us / shows us", ["two of bring, tell, show", "person + thing", "three or four sentences"]],
  ["Describe a family holiday: who bought or cooked what for whom?", "Dad bought us … / Mum cooked us …", ["bought or cooked + person + thing", "a food word", "three or four sentences"]],
  ["Write a thank-you message to a teacher: what did he or she teach you and give you?", "You taught us … / You gave us …", ["taught us", "gave us", "three or four sentences"]],
  ["You are planning presents for your family. Write what you will give or buy each person.", "I'll give my … / I'll buy my …", ["give + person + thing", "buy + person + thing", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TR, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.word-order.double-object.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);