// Hand-authored: reported-speech / commands-requests / tell-sb-to (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement item): a reported command or request is TELL / ASK +
// person + (not) TO + base verb ('Close the window,' the teacher said. → The teacher
// told us to close the window. 'Don't be late.' → She told us not to be late.).
// Triage: kept. say-tell owns said vs told with that-clauses. "to not be" (split) is
// heard, so it is never offered; errors: no to (told us close), said + person (said
// us to close), told to us + -ing, don't kept (told me don't be), not without to.
// Choose: 12 told + person + to; 4 told + person + not to; 4 asked + person + to.
// Build: to (not to) + the verb in brackets; no source prints "to".
// Transform: 5 command → told + person + to / 5 Don't … → told + person + not to /
// 5 request → asked + person + to.
//
// Run: node tools/grammar-practice/authored/reported-speech.commands-requests.tell-sb-to.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "reported-speech", branch: "commands-requests", topic: "tell-sb-to", level: "B1", pv: "2.5" };
const M = ["Aziz", "Timur", "Bekzod", "Rustam"];
const F = ["Olga", "Lola", "Madina", "Sevara"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const WHY = "A reported command: told + person + to + base verb.";
const WHY_N = "A reported 'Don't …': told + person + not to + base verb.";
const WHY_A = "A reported request: asked + person + to + base verb.";
const T = (o, v) => [`told ${o} to ${v}`, `told ${o} ${v}`, `said ${o} to ${v}`, `told to ${o} ${v.replace(/e?$/, "ing")}`];
const N = (o, v) => [`told ${o} not to ${v}`, `told ${o} don't ${v}`, `said ${o} not to ${v}`, `told ${o} not ${v}`];
const A = (o, v) => [`asked ${o} to ${v}`, `asked ${o} ${v}`, `asked to ${o} ${v}`, `said ${o} to ${v}`];
const ING = { close: "closing", sit: "sitting", wait: "waiting", turn: "turning", call: "calling", bring: "bringing", eat: "eating", wear: "wearing", study: "studying", clean: "cleaning", write: "writing", take: "taking" };
const Tg = (o, v) => [`told ${o} to ${v}`, `told ${o} ${v}`, `said ${o} to ${v}`, `told to ${o} ${ING[v]}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [Tg("us", "close"), WHY, "'Close the {thing},' the {who} said to us. The {who} ______ the {thing}.", { thing: ["window", "door", "books", "laptops"], who: ["teacher", "coach", "director", "guide"] }],
  [Tg("me", "sit"), WHY, "'Sit down on the {seat},' the {who} said to me. The {who} ______ down on the {seat}.", { seat: ["chair", "bench", "sofa", "floor"], who: ["doctor", "teacher", "nurse", "manager"] }],
  [Tg("her", "wait"), WHY, "'Wait for me at the {place},' {m} said to his {who}. {m} ______ for him at the {place}.", { place: ["station", "gate", "café", "car"], m: M, who: ["sister", "wife", "daughter", "mother"] }],
  [Tg("them", "turn"), WHY, "'Turn off your phones,' the {who} said to the students. The {who} ______ off their phones.", { who: ["teacher", "director", "guide", "coach"], x: [] }],
  [Tg("him", "call"), WHY, "'Call me after the {event},' {f} said to {m}. {f} ______ her after the {event}.", { event: ["match", "meeting", "lesson", "party"], f: F, m: M }],
  [Tg("us", "bring"), WHY, "'Bring your {thing},' the {who} said to us. The {who} ______ our {thing}.", { thing: ["passports", "books", "tickets", "IDs"], who: ["guide", "teacher", "coach", "manager"] }],
  [Tg("me", "eat"), WHY, "'Eat your {food},' my {who} said to me. My {who} ______ my {food}.", { food: ["soup", "plov", "breakfast", "vegetables"], who: ["mum", "grandma", "dad", "aunt"] }],
  [Tg("him", "wear"), WHY, "'Wear a {coat},' my {who} said to my brother. My {who} ______ a {coat}.", { coat: ["coat", "hat", "scarf", "jacket"], who: ["mum", "grandma", "dad", "aunt"] }],
  [Tg("her", "study"), WHY, "'Study for the {test},' the teacher said to {f}. The teacher ______ for the {test}.", { test: ["exam", "test", "quiz", "final exam"], f: F }],
  [Tg("him", "clean"), WHY, "'Clean your {room},' {m}'s mother said to him. His mother ______ his {room}.", { room: ["room", "shoes", "bike", "desk"], m: M }],
  [Tg("me", "write"), WHY, "'Write your name on the {form},' the {who} said to me. The {who} ______ my name on the {form}.", { form: ["form", "list", "card", "paper"], who: ["clerk", "nurse", "teacher", "receptionist"] }],
  [Tg("us", "take"), WHY, "'Take the {bus} from the {place},' the man said to us. The man ______ the {bus} from the {place}.", { bus: ["bus", "train", "metro", "minibus"], place: ["station", "bazaar", "corner", "square"] }],
  [N("us", "be"), WHY_N, "'Don't be late for the {event},' the {who} said to us. The {who} ______ late for the {event}.", { event: ["lesson", "match", "trip", "meeting"], who: ["teacher", "coach", "guide", "manager"] }],
  [N("them", "touch"), WHY_N, "'Don't touch the {thing},' {f} said to the children. {f} ______ the {thing}.", { thing: ["cake", "oven", "paint", "plants"], f: F }],
  [N("me", "worry"), WHY_N, "'Don't worry about the {test},' my {who} said to me. My {who} ______ about the {test}.", { test: ["exam", "test", "interview", "match"], who: ["mum", "teacher", "friend", "dad"] }],
  [N("her", "open"), WHY_N, "'Don't open the {door},' {m} said to his sister. {m} ______ the {door}.", { door: ["door", "window", "box", "fridge"], m: M }],
  [A("me", "help"), WHY_A, "'Please help me with the {thing},' {f} said to me. {f} ______ her with the {thing}.", { thing: ["bags", "homework", "cooking", "boxes"], f: F }],
  [A("him", "open"), WHY_A, "'Could you open the {door}, please?' the {who} said to {m}. The {who} ______ the {door}.", { door: ["door", "window", "gate", "jar"], who: ["old woman", "teacher", "lady", "girl"], m: M }],
  [A("us", "speak"), WHY_A, "'Please speak more slowly,' the {who} said to us. The {who} ______ more slowly.", { who: ["tourist", "guest", "student", "old man"], x: [] }],
  [A("me", "lend"), WHY_A, "'Can you lend me your {thing}?' {m} said to me. {m} ______ him my {thing}.", { thing: ["car", "pen", "bike", "camera"], m: M }],
].map(([o, why, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Report the command or request. Write to (or not to) + the verb in brackets.";
// [key, why, source, slots] — no source prints "to"
const BUILD = [
  ["to close", WHY, "The {who} told us ______ (close) the {thing}.", { who: ["teacher", "coach", "director", "guide"], thing: ["window", "door", "books", "laptops"] }],
  ["to sit", WHY, "The {who} told me ______ (sit) down on the {seat}.", { who: ["doctor", "teacher", "nurse", "manager"], seat: ["chair", "bench", "sofa", "floor"] }],
  ["to wait", WHY, "{m} told his {who} ______ (wait) for him at the {place}.", { m: M, who: ["sister", "wife", "daughter", "mother"], place: ["station", "gate", "café", "car"] }],
  ["to turn", WHY, "The {who} told the students ______ (turn) off their phones, {f}.", { who: ["teacher", "director", "guide", "coach"], f: F }],
  ["to call", WHY, "{f} told {m} ______ (call) her after the {event}.", { f: F, m: M, event: ["match", "meeting", "lesson", "party"] }],
  ["to bring", WHY, "The {who} told us ______ (bring) our {thing}.", { who: ["guide", "teacher", "coach", "manager"], thing: ["passports", "books", "tickets", "IDs"] }],
  ["to eat", WHY, "My {who} told me ______ (eat) my {food}.", { who: ["mum", "grandma", "dad", "aunt"], food: ["soup", "plov", "breakfast", "vegetables"] }],
  ["to wear", WHY, "My {who} told my brother ______ (wear) a {coat}.", { who: ["mum", "grandma", "dad", "aunt"], coat: ["coat", "hat", "scarf", "jacket"] }],
  ["to study", WHY, "The teacher told {f} ______ (study) for the {test}.", { f: F, test: ["exam", "test", "quiz", "final exam"] }],
  ["to clean", WHY, "{m}'s mother told him ______ (clean) his {room}.", { m: M, room: ["room", "shoes", "bike", "desk"] }],
  ["to write", WHY, "The {who} told me ______ (write) my name on the {form}.", { who: ["clerk", "nurse", "teacher", "receptionist"], form: ["form", "list", "card", "paper"] }],
  ["to take", WHY, "The man told us ______ (take) the {bus} from the {place}.", { bus: ["bus", "train", "metro", "minibus"], place: ["station", "bazaar", "corner", "square"] }],
  ["not to be", WHY_N, "The {who} told us ______ (not / be) late for the {event}.", { who: ["teacher", "coach", "guide", "manager"], event: ["lesson", "match", "trip", "meeting"] }],
  ["not to touch", WHY_N, "{f} told the children ______ (not / touch) the {thing}.", { f: F, thing: ["cake", "oven", "paint", "plants"] }],
  ["not to worry", WHY_N, "My {who} told me ______ (not / worry) about the {test}.", { who: ["mum", "teacher", "friend", "dad"], test: ["exam", "test", "interview", "match"] }],
  ["not to open", WHY_N, "{m} told his sister ______ (not / open) the {door}.", { m: M, door: ["door", "window", "box", "fridge"] }],
  ["to help", WHY_A, "{f} asked me ______ (help) her with the {thing}.", { f: F, thing: ["bags", "homework", "cooking", "boxes"] }],
  ["to open", WHY_A, "The {who} asked {m} ______ (open) the {door}.", { who: ["old woman", "teacher", "lady", "girl"], m: M, door: ["door", "window", "gate", "jar"] }],
  ["to speak", WHY_A, "The {who} asked us ______ (speak) more slowly, {f}.", { who: ["tourist", "guest", "student", "old man"], f: F }],
  ["to lend", WHY_A, "{m} asked me ______ (lend) him my {thing}.", { m: M, thing: ["car", "pen", "bike", "camera"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const CMD = "Report the command with told + person + to.";
const NOT = "Report the command with told + person + not to.";
const ASK = "Report the request with asked + person + to.";
// [instr, why, source, hint, key, slots]
const TRANSFORM = [
  [CMD, WHY, "'Close the {thing},' the {who} said to us.", "The {who} ______ the {thing}.", "told us to close", { thing: ["window", "door", "books", "laptops"], who: ["teacher", "coach", "director", "guide"] }],
  [CMD, WHY, "'Sit down on the {seat},' the {who} said to me.", "The {who} ______ down on the {seat}.", "told me to sit", { seat: ["chair", "bench", "sofa", "floor"], who: ["doctor", "teacher", "nurse", "manager"] }],
  [CMD, WHY, "'Bring your {thing},' the {who} said to us.", "The {who} ______ our {thing}.", "told us to bring", { thing: ["passports", "books", "tickets", "IDs"], who: ["guide", "teacher", "coach", "manager"] }],
  [CMD, WHY, "'Study for the {test},' the teacher said to {f}.", "The teacher ______ for the {test}.", "told her to study", { test: ["exam", "test", "quiz", "final exam"], f: F }],
  [CMD, WHY, "'Clean your {room},' {m}'s mother said to him.", "His mother ______ his {room}.", "told him to clean", { room: ["room", "shoes", "bike", "desk"], m: M }],
  [NOT, WHY_N, "'Don't be late for the {event},' the {who} said to us.", "The {who} ______ late for the {event}.", "told us not to be", { event: ["lesson", "match", "trip", "meeting"], who: ["teacher", "coach", "guide", "manager"] }],
  [NOT, WHY_N, "'Don't touch the {thing},' {f} said to the children.", "{f} ______ the {thing}.", "told them not to touch", { thing: ["cake", "oven", "paint", "plants"], f: F }],
  [NOT, WHY_N, "'Don't worry about the {test},' my {who} said to me.", "My {who} ______ about the {test}.", "told me not to worry", { test: ["exam", "test", "interview", "match"], who: ["mum", "teacher", "friend", "dad"] }],
  [NOT, WHY_N, "'Don't open the {door},' {m} said to his sister.", "{m} ______ the {door}.", "told her not to open", { door: ["door", "window", "box", "fridge"], m: M }],
  [NOT, WHY_N, "'Don't eat all the {food},' {f} said to her brother.", "{f} ______ all the {food}.", "told him not to eat", { food: ["cake", "sweets", "bread", "fruit"], f: F }],
  [ASK, WHY_A, "'Please help me with the {thing},' {f} said to me.", "{f} ______ her with the {thing}.", "asked me to help", { thing: ["bags", "homework", "cooking", "boxes"], f: F }],
  [ASK, WHY_A, "'Could you open the {door}, please?' the {who} said to {m}.", "The {who} ______ the {door}.", "asked him to open", { door: ["door", "window", "gate", "jar"], who: ["old woman", "teacher", "lady", "girl"], m: M }],
  [ASK, WHY_A, "'Please speak more slowly,' the {who} said to us.", "The {who} ______ more slowly, {f}.", "asked us to speak", { who: ["tourist", "guest", "student", "old man"], f: F }],
  [ASK, WHY_A, "'Can you lend me your {thing}?' {m} said to me.", "{m} ______ him my {thing}.", "asked me to lend", { thing: ["car", "pen", "bike", "camera"], m: M }],
  [ASK, WHY_A, "'Please call a taxi for me,' the {who} said to {f}.", "The {who} ______ a taxi for him, {m}.", "asked her to call", { who: ["old man", "guest", "teacher", "waiter"], f: F, m: M }],
].map(([instr, why, source, hint, key, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if ((source + hint).includes(`{${n}}`)) s[n] = f;
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your teacher said: 'Open your books.' Report it.", "The teacher told us to open our books", ["exactly one sentence", "told + person + to", "past"]],
  ["Your mum said: 'Don't come home late.' Report it.", "My mum told me not to come home late", ["exactly one sentence", "told me not to", "base verb"]],
  ["A friend said: 'Please help me.' Report it with asked.", "He / She asked me to help him / her", ["exactly one sentence", "asked + person + to", "pronoun change"]],
  ["Report an order a coach gave a team.", "The coach told the players to …", ["exactly one sentence", "told", "to + base verb"]],
  ["Report a request someone made in a shop.", "… asked the assistant to …", ["exactly one sentence", "asked", "to + base verb"]],
  ["Write the direct command and then report it.", "command → told + person + to", ["exactly two sentences", "quotation marks", "told + person + to"]],
  ["Report a rule your parents gave you as a child with told me not to.", "My parents told me not to …", ["exactly one sentence", "not to", "past"]],
  ["Report something a doctor told you to do.", "The doctor told me to …", ["exactly one sentence", "told me to", "base verb"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Report three or four things your parents told you (not) to do when you were a child.", "told me (not) to", ["told me to", "told me not to", "three or four sentences"]],
  ["Report the instructions a teacher gave your class before an exam. Write three or four sentences.", "told us (not) to", ["told us to", "not to", "three or four sentences"]],
  ["Report what a doctor told you to do when you were ill. Write three or four sentences.", "told / asked + person + to", ["told me to", "not to", "three or four sentences"]],
  ["Report three or four requests a guest made at a hotel. Use asked … to.", "asked + person + to", ["asked", "to + base verb", "three or four sentences"]],
  ["Report a coach's orders at a football training. Write three or four sentences.", "told + person + (not) to", ["told the players to", "not to", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/reported-speech.commands-requests.tell-sb-to.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
