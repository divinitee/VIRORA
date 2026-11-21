// Hand-authored: prep-phrasal / phrasal-verbs / pronoun-separation (B1).
// Wave C, C43 (2026-11-21, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement items: "Please ______" → turn it down; order tokens
// "I'll pick them up at six"): with a separable phrasal verb, an object PRONOUN must
// go between the verb and the particle: turn it down, pick them up. A noun can go on
// either side (turn the music down / turn down the music).
// One right answer: both noun orders are English, so a noun object is never tested
// in choose; every choose line has a pronoun. Bare "verb + particle" is never an
// option (wake up, take off, give up, clean up have no object and are English).
// Verbs: turn down / up / on / off, switch off, pick up, put on, take off, try on,
// give back, throw away, write down, fill in, wake up, call back, put away, put off
// (= postpone), look up (a word), take back.
// Choose: options verb + pronoun + particle / verb + particle + pronoun / verb +
// particle + subject pronoun (or a doubled object) / doubled object.
// Build and transform: two-gap array keys; transform 5 noun → pronoun / 5 correct
// the order / 5 move the noun after the particle (both noun orders are right).
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.phrasal-verbs.pronoun-separation.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "phrasal-verbs", topic: "pronoun-separation", level: "B1", pv: "2.5" };
const NAME = ["Malika", "Otabek", "Nodira", "Sherzod"];
const NAME2 = ["Ulugbek", "Gulnora", "Akmal", "Feruza"];
const SUBJ = { her: "she", him: "he", them: "they", me: "I", us: "we" };

const fill = (text, slots, fallback) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && text.includes(`{${n}}`)) s[n] = f;
  if (text.includes("{name}") && !s.name) s.name = fallback;
  return s;
};

/* ---------------- choose: 20 mcq ---------------- */
// [verb, pronoun, particle, prompt, slots, why]
const CHOOSE = [
  ["turn", "it", "down", "The {music} is too loud. Please ______, {name}.", { music: ["music", "TV", "radio", "game"] }, "With a pronoun, it goes in the middle: turn it down."],
  ["pick", "them", "up", "The kids finish school at six. I'll ______ in the {car}.", { car: ["car", "taxi", "van", "minibus"] }, "pick them up: the pronoun goes between pick and up."],
  ["put", "it", "on", "It's cold outside. Take your {thing} and ______, {name}.", { thing: ["coat", "hat", "scarf", "jacket"] }, "put it on: the pronoun splits the verb."],
  ["try", "them", "on", "These {thing} look nice. Can I ______, {name}?", { thing: ["shoes", "jeans", "boots", "trousers"] }, "try them on: pronoun in the middle."],
  ["wake", "me", "up", "I have an early {event} tomorrow. Please ______ at six, {name}.", { event: ["flight", "exam", "train", "meeting"] }, "wake me up: pronoun in the middle."],
  ["turn", "it", "off", "Nobody is watching the {thing}. Can you ______, {name}?", { thing: ["TV", "computer", "radio", "fan"] }, "turn it off: pronoun in the middle."],
  ["give", "it", "back", "That's my {thing}! ______ now, {name}!", { thing: ["pen", "ball", "phone", "book"] }, "give it back: pronoun in the middle."],
  ["throw", "them", "away", "These {food} are old. Let's ______, {name}.", { food: ["biscuits", "apples", "eggs", "tomatoes"] }, "throw them away: pronoun in the middle."],
  ["write", "it", "down", "This is my new {thing}. Please ______ before you forget, {name}.", { thing: ["phone number", "address", "email", "work number"] }, "write it down: pronoun in the middle."],
  ["fill", "it", "in", "Here is the {doc}. Please ______ and give it to the nurse.", { doc: ["form", "card", "paper", "questionnaire"] }, "fill it in: pronoun in the middle."],
  ["call", "him", "back", "Your {who} phoned while you were out. Can you ______ later, {name}?", { who: ["uncle", "boss", "teacher", "brother"] }, "call him back: pronoun in the middle."],
  ["put", "them", "away", "Your toys are all over the {room}. ______ now, please.", { room: ["floor", "room", "sofa", "kitchen"] }, "put them away: pronoun in the middle."],
  ["take", "it", "off", "Your {thing} is wet. ______ and sit by the fire, {name}.", { thing: ["coat", "jacket", "jumper", "hat"] }, "take it off: pronoun in the middle."],
  ["put", "it", "off", "It will rain on the day of the {event}. Let's ______ until next week, {name}.", { event: ["picnic", "trip", "match", "barbecue"] }, "put it off (= postpone): pronoun in the middle."],
  ["look", "it", "up", "I don't know this word. I'll ______ in the {thing}, {name}.", { thing: ["dictionary", "app", "book", "glossary"] }, "look it up: pronoun in the middle."],
  ["switch", "it", "off", "The {thing} is very noisy. Can you ______, {name}?", { thing: ["fan", "heater", "washing machine", "air conditioner"] }, "switch it off: pronoun in the middle."],
  ["pick", "her", "up", "My sister lands at nine. I'm going to ______ from the {place}.", { place: ["airport", "station", "bus station", "train station"] }, "pick her up: pronoun in the middle."],
  ["take", "them", "back", "These {thing} are too small. I'll ______ to the shop, {name}.", { thing: ["shoes", "trousers", "gloves", "boots"] }, "take them back: pronoun in the middle."],
  ["turn", "it", "up", "I can't hear the {thing}. Please ______ a little, {name}.", { thing: ["radio", "TV", "music", "news"] }, "turn it up: pronoun in the middle."],
].map(([v, pron, p, prompt, slots, why], i) => {
  let pr = prompt;
  const s = fill(pr, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) { s.name = i % 2 ? NAME2 : NAME; pr = pr.replace(/([.!?])$/, ", {name}$1"); }
  const third = SUBJ[pron] ? `${v} ${p} ${SUBJ[pron]}` : `${v} ${p} ${pron} ${p}`;
  const opts = [`${v} ${pron} ${p}`, `${v} ${p} ${pron}`, third, `${v} ${pron} ${p} ${pron}`];
  const cap = pr.startsWith("______") || /[.!?] ______/.test(pr) ? (x) => x[0].toUpperCase() + x.slice(1) : (x) => x;
  const o = opts.map(cap);
  const options = o.map((_, j) => o[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: pr, options, key: options.indexOf(o[0]), why, slots: s };
});
CHOOSE.push({ ...BASE, stage: "choose", format: "mcq", prompt: "The kids are asleep in the {room}. Please don't wake ______, {name}.", options: ["them up", "up them", "up they", "them up them"], key: 0, why: "wake them up: the pronoun goes between wake and up.", slots: { room: ["car", "bedroom", "tent", "back seat"], name: NAME2 } });

/* ---------------- build: 20 gap_fill, two gaps ---------------- */
const INSTR = "Put the two words in brackets in the gaps, in the right order.";
const BUILD = [
  [["it", "down"], "The music is too loud. Can you turn ______ ______ (down / it), {name}? The {who} are asleep.", { who: ["kids", "neighbours", "babies", "guests"] }, "turn it down: pronoun in the middle."],
  [["them", "up"], "I'll pick ______ ______ (up / them) at the {place} at six, {name}.", { place: ["school", "station", "airport", "gym"] }, "pick them up: pronoun in the middle."],
  [["it", "on"], "Here's your {thing}. Put ______ ______ (on / it), {name}. It's cold.", { thing: ["coat", "hat", "scarf", "jacket"] }, "put it on: pronoun in the middle."],
  [["them", "on"], "Do you like these {thing}? Try ______ ______ (on / them), {name}.", { thing: ["shoes", "jeans", "boots", "trousers"] }, "try them on: pronoun in the middle."],
  [["me", "up"], "Please wake ______ ______ (up / me) at seven, {name}. I have a {event}.", { event: ["flight", "test", "lesson", "meeting"] }, "wake me up: pronoun in the middle."],
  [["it", "off"], "The {thing} is still on. Turn ______ ______ (off / it), {name}.", { thing: ["TV", "light", "oven", "computer"] }, "turn it off: pronoun in the middle."],
  [["it", "back"], "I lent him my {thing}, but he never gave ______ ______ (back / it), {name}.", { thing: ["bike", "book", "camera", "charger"] }, "gave it back: pronoun in the middle."],
  [["them", "away"], "These old {thing} are broken. Throw ______ ______ (away / them), {name}.", { thing: ["toys", "shoes", "pens", "cups"] }, "throw them away: pronoun in the middle."],
  [["it", "down"], "Here's the address of the {place}. Write ______ ______ (down / it), {name}.", { place: ["hotel", "clinic", "school", "office"] }, "write it down: pronoun in the middle."],
  [["it", "in"], "The {doc} is on the desk. Please fill ______ ______ (in / it), {name}.", { doc: ["form", "card", "application", "questionnaire"] }, "fill it in: pronoun in the middle."],
  [["her", "back"], "Your {who} called. Please call ______ ______ (back / her), {name}.", { who: ["mum", "aunt", "teacher", "sister"] }, "call her back: pronoun in the middle."],
  [["them", "away"], "Your clothes are on the {place}. Put ______ ______ (away / them), {name}.", { place: ["floor", "bed", "chair", "sofa"] }, "put them away: pronoun in the middle."],
  [["them", "off"], "Your {thing} are dirty. Take ______ ______ (off / them) at the door, {name}.", { thing: ["shoes", "boots", "trainers", "sandals"] }, "take them off: pronoun in the middle."],
  [["it", "off"], "The {event} can't happen on Friday. We'll put ______ ______ (off / it) until Monday, {name}.", { event: ["meeting", "party", "match", "lesson"] }, "put it off: pronoun in the middle."],
  [["it", "up"], "If you don't know the word, look ______ ______ (up / it) in the {thing}, {name}.", { thing: ["dictionary", "app", "glossary", "book"] }, "look it up: pronoun in the middle."],
  [["us", "up"], "Grandpa will pick ______ ______ (up / us) from the {place}, {name}.", { place: ["station", "airport", "bus stop", "bazaar"] }, "pick us up: pronoun in the middle."],
  [["it", "up"], "I love this {thing}! Turn ______ ______ (up / it), {name}!", { thing: ["song", "music", "film", "show"] }, "turn it up: pronoun in the middle."],
  [["them", "back"], "The {thing} were too big, so I took ______ ______ (back / them), {name}.", { thing: ["shoes", "jeans", "gloves", "shirts"] }, "took them back: pronoun in the middle."],
  [["him", "up"], "The baby is asleep. Don't wake ______ ______ (up / him), {name}! He was up all {time}.", { time: ["night", "morning", "evening", "day"] }, "wake him up: pronoun in the middle."],
  [["it", "off"], "It's hot in here, but the {thing} is too loud. Switch ______ ______ (off / it), {name}.", { thing: ["fan", "heater", "air conditioner", "radio"] }, "switch it off: pronoun in the middle."],
].map(([key, source, slots, why], i) => {
  const s = fill(source, slots, i % 2 ? NAME2 : NAME);
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, two gaps ---------------- */
const PRON = "Rewrite with the pronoun in brackets instead of the noun. One word in each gap.";
const FIX = "Correct the word order. One word in each gap.";
const MOVE = "Rewrite with the noun after the particle. One word in each gap.";
const TRANSFORM = [
  [PRON, "(it) Turn down the music, {name}. The {who} are sleeping.", "Turn ______ ______, {name}. The {who} are sleeping.", ["it", "down"], { who: ["kids", "neighbours", "guests", "babies"] }, "With a pronoun: turn it down."],
  [PRON, "(them) I'll pick up the children at the {place}, {name}.", "I'll pick ______ ______ at the {place}, {name}.", ["them", "up"], { place: ["school", "park", "gym", "pool"] }, "With a pronoun: pick them up."],
  [PRON, "(it) Put on your {thing}, {name}.", "Put ______ ______, {name}.", ["it", "on"], { thing: ["coat", "hat", "jacket", "scarf"] }, "With a pronoun: put it on."],
  [PRON, "(her) Can you wake up your {who} at seven, {name}?", "Can you wake ______ ______ at seven, {name}?", ["her", "up"], { who: ["sister", "mum", "grandma", "aunt"] }, "With a pronoun: wake her up."],
  [PRON, "(them) Throw away those old {thing}, {name}.", "Throw ______ ______, {name}.", ["them", "away"], { thing: ["shoes", "papers", "boxes", "bottles"] }, "With a pronoun: throw them away."],
  [FIX, "Please turn off it. The {thing} is too loud, {name}.", "Please turn ______ ______. The {thing} is too loud, {name}.", ["it", "off"], { thing: ["TV", "radio", "music", "fan"] }, "turn it off, never turn off it."],
  [FIX, "I'll pick up them at the {place}, {name}.", "I'll pick ______ ______ at the {place}, {name}.", ["them", "up"], { place: ["station", "airport", "school", "bazaar"] }, "pick them up, never pick up them."],
  [FIX, "Can I try on it? I like the {colour} one, {name}.", "Can I try ______ ______? I like the {colour} one, {name}.", ["it", "on"], { colour: ["blue", "red", "black", "green"] }, "try it on, never try on it."],
  [FIX, "Write down it before you forget the {thing}, {name}.", "Write ______ ______ before you forget the {thing}, {name}.", ["it", "down"], { thing: ["address", "number", "date", "name"] }, "write it down, never write down it."],
  [FIX, "Your {who} called. Call back him, {name}.", "Your {who} called. Call ______ ______, {name}.", ["him", "back"], { who: ["uncle", "dad", "brother", "boss"] }, "call him back, never call back him."],
  [MOVE, "Turn the TV off, {name}. It's time for {thing}.", "Turn ______ ______ TV, {name}. It's time for {thing}.", ["off", "the"], { thing: ["bed", "dinner", "homework", "school"] }, "With a noun, both orders are right: turn the TV off = turn off the TV."],
  [MOVE, "Please fill this form in, {name}. Then give it to the {who}.", "Please fill ______ ______ form, {name}. Then give it to the {who}.", ["in", "this"], { who: ["nurse", "teacher", "secretary", "manager"] }, "fill this form in = fill in this form."],
  [MOVE, "I took my new {thing} back to the shop, {name}.", "I took ______ ______ new {thing} to the shop, {name}.", ["back", "my"], { thing: ["phone", "jacket", "shoes", "lamp"] }, "took my new phone back = took back my new phone."],
  [MOVE, "Put your toys away, {name}. Your {who} are coming.", "Put ______ ______ toys, {name}. Your {who} are coming.", ["away", "your"], { who: ["grandparents", "cousins", "friends", "guests"] }, "put your toys away = put away your toys."],
  [MOVE, "Let's put the {event} off until next week, {name}.", "Let's put ______ ______ {event} until next week, {name}.", ["off", "the"], { event: ["meeting", "trip", "party", "match"] }, "put the meeting off = put off the meeting."],
].map(([instr, source, hint, key, slots, why], i) => {
  const s = fill(source + hint, slots, i % 2 ? NAME2 : NAME);
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with turn it down, turn it up, turn it on or turn it off.", "turn it off", ["exactly one sentence", "turn + it + particle", "it in the middle"]],
  ["Write one sentence with pick + a pronoun + up.", "I'll pick you up at …", ["exactly one sentence", "pick … up", "a pronoun in the middle"]],
  ["Write one sentence about clothes with put … on or take … off and a pronoun.", "put it on / take them off", ["exactly one sentence", "a pronoun in the middle", "clothes"]],
  ["Write one sentence asking someone to wake you up.", "Please wake me up at …", ["exactly one sentence", "wake me up", "a time"]],
  ["Write one sentence with give it back or take it back.", "… give it back", ["exactly one sentence", "it in the middle", "back"]],
  ["Write one sentence with write it down or look it up.", "write it down / look it up", ["exactly one sentence", "it in the middle", "a reason"]],
  ["Write one sentence with call + a pronoun + back.", "Call her back", ["exactly one sentence", "call … back", "a pronoun in the middle"]],
  ["Write one sentence with a noun and the same verb: put on your coat or put your coat on.", "put on your coat / put your coat on", ["exactly one sentence", "a noun object", "either order"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write three or four sentences of instructions for a younger brother or sister getting ready for school.", "put it on / pick them up", ["a pronoun in the middle", "phrasal verbs", "three or four sentences"]],
  ["Describe buying clothes in a shop. Write three or four sentences.", "try them on / take them back", ["a pronoun in the middle", "phrasal verbs", "three or four sentences"]],
  ["Write a short message to a family member about who will pick up whom and when. Write three or four sentences.", "pick him up / pick them up", ["pick … up", "a pronoun in the middle", "three or four sentences"]],
  ["Write three or four house rules about the TV, music and lights.", "turn it off / turn it down", ["a pronoun in the middle", "turn", "three or four sentences"]],
  ["Write three or four sentences about how you learn new English words.", "write them down / look them up", ["a pronoun in the middle", "phrasal verbs", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.phrasal-verbs.pronoun-separation.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "",
   "",
   "",
   "\"these …\" → them, and them goes in the middle: try them on.",
   "Me is a pronoun, so it sits inside: wake me up.",
   "\"the …\" → it, inside the verb: turn it off.",
   "",
   "\"These …\" → them, inside: throw them away.",
   "\"my new …\" → it, inside: write it down.",
   "\"the …\" (a paper) → it, inside: fill it in.",
   "",
   "\"Your toys\" → them, inside: Put them away.",
   "",
   "",
   "\"this word\" → it, inside: look it up.",
   "\"The …\" → it, inside: switch it off.",
   "",
   "",
   "\"the …\" → it, inside: turn it up.",
   ""
  ],
  "build": [
   "",
   "",
   "",
   "Pronoun them before on: them, on.",
   "Pronoun me before up: me, up.",
   "Pronoun it before off: it, off.",
   "",
   "Pronoun them before away: them, away.",
   "Pronoun it before down: it, down.",
   "Pronoun it before in: it, in.",
   "",
   "Pronoun them before away: them, away (clothes).",
   "",
   "",
   "Pronoun it before up: it, up.",
   "",
   "Pronoun it before up (louder): it, up.",
   "",
   "",
   "Pronoun it before off (switch): it, off."
  ],
  "transform": [
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   "took my new … back = took back my new ….",
   "",
   "put the … off = put off the …."
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
