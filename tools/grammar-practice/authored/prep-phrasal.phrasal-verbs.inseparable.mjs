// Hand-authored: prep-phrasal / phrasal-verbs / inseparable (B1).
// Wave C, C42 (2026-11-21, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item: "Who ______ while you were away?" → looked after
// your cat): with an inseparable phrasal verb the object (noun OR pronoun) goes after
// the whole verb: look after her, get on the bus, run into him. Never "look her after".
// Triage: kept. A2 common-phrasal tests the particle with noun objects; C43
// pronoun-separation tests separable verbs (turn it down). Here the particle is
// given and the order is tested, mostly with pronouns, where learners split it.
// Verbs: look after, look for, look into, get on, get off, get over, run into, come
// across, take after, count on, go through, deal with. Left out: look over, go over,
// get through, call on, see off (separable or two meanings).
// Choose: options verb + particle + object / verb + object + particle / verb +
// particle + subject pronoun / verb + particle + "for" + object (never a second
// right answer). Build and transform: two-gap array keys, so the order is graded.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.phrasal-verbs.inseparable.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "phrasal-verbs", topic: "inseparable", level: "B1", pv: "2.5" };
const NAME = ["Feruza", "Sardor", "Dilnoza", "Jamshid"];
const NAME2 = ["Zarina", "Akmal", "Gulnora", "Otabek"];
const SUBJ = { her: "she", him: "he", it: "it", them: "they", me: "I", us: "we" };

const fill = (text, slots, fallback) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && text.includes(`{${n}}`)) s[n] = f;
  if (text.includes("{name}") && !s.name) s.name = fallback;
  return s;
};

/* ---------------- choose: 20 mcq ---------------- */
// [verb, particle, object, prompt, slots, why]
const CHOOSE = [
  ["looked", "after", "your cat", "Who ______ while you were in {city}, {name}?", { city: ["Dubai", "Moscow", "Istanbul", "Seoul"] }, "look after is inseparable: looked after your cat."],
  ["look", "after", "her", "Grandma is ill. Can you ______ this {time}, {name}?", { time: ["weekend", "evening", "afternoon", "week"] }, "Even with a pronoun, look after stays together: look after her."],
  ["looking", "for", "them", "I've lost my {thing}. I've been ______ all morning.", { thing: ["keys", "glasses", "gloves", "headphones"] }, "look for is inseparable: looking for them."],
  ["deal", "with", "it", "The {thing} is broken, but don't worry. We can ______, {name}.", { thing: ["tap", "door", "heater", "fridge"] }, "deal with is inseparable: deal with it."],
  ["go", "through", "them", "These are your {thing} for the exam. Let's ______ together, {name}.", { thing: ["notes", "answers", "texts", "questions"] }, "go through (= check one by one) is inseparable: go through them."],
  ["ran", "into", "him", "I ______ at the {place} yesterday. I hadn't seen him for years!", { place: ["bazaar", "airport", "gym", "bank"] }, "run into (= meet by chance) is inseparable: ran into him."],
  ["came", "across", "it", "I was cleaning the {room} and I ______ under the bed, {name}. An old photo!", { room: ["flat", "bedroom", "attic", "garage"] }, "come across (= find by chance) is inseparable: came across it."],
  ["takes", "after", "her", "My sister really ______. They look the same as our {who}.", { who: ["mum", "grandma", "aunt", "mother"] }, "take after (= look or act like) is inseparable: takes after her."],
  ["get", "over", "it", "He had a bad cold, but he'll ______ soon, {name}. He's {state}.", { state: ["young", "strong", "resting", "taking medicine"] }, "get over (= recover from) is inseparable: get over it."],
  ["count", "on", "me", "Don't worry about the {thing}, {name}. You can ______.", { thing: ["move", "party", "food", "trip"] }, "count on (= trust) is inseparable: count on me."],
  ["looking", "into", "it", "The {who} said the problem was strange and they are ______ now.", { who: ["bank", "school", "shop", "company"] }, "look into (= study a problem) is inseparable: looking into it."],
  ["dealt", "with", "them", "The manager got three {thing} and ______ quickly, {name}.", { thing: ["complaints", "calls", "emails", "letters"] }, "deal with is inseparable: dealt with them."],
  ["went", "through", "it", "It was a hard time for the {who}, but they ______ together.", { who: ["family", "team", "village", "class"] }, "go through (= live through) is inseparable: went through it."],
  ["look", "after", "the children", "Who will ______ when you're at the {place}, {name}?", { place: ["hospital", "wedding", "office", "airport"] }, "look after + noun: the noun goes after the particle too."],
  ["looking", "for", "him", "Have you seen my little brother? Mum is ______ in the {place}.", { place: ["yard", "park", "street", "shop"] }, "look for is inseparable: looking for him."],
  ["get", "off", "the bus", "Excuse me, where should I ______ for the {place}, {name}?", { place: ["museum", "hospital", "station", "university"] }, "get off + the bus."],
  ["ran", "into", "them", "We ______ outside the {place}. Our old neighbours!", { place: ["cinema", "theatre", "café", "bank"] }, "run into is inseparable: ran into them."],
  ["came", "across", "them", "I ______ on the internet. They are very cheap {thing}, {name}.", { thing: ["shoes", "books", "tickets", "flights"] }, "come across is inseparable: came across them."],
  ["takes", "after", "him", "My son ______. He loves football like his {who}.", { who: ["dad", "father", "grandpa", "uncle"] }, "take after is inseparable: takes after him."],
  ["count", "on", "us", "You can always ______, {name}. We're your {who}.", { who: ["friends", "family", "neighbours", "brothers"] }, "count on is inseparable: count on us."],
].map(([v, p, o, prompt, slots, why], i) => {
  let pr = prompt;
  const s = fill(pr, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) { s.name = i % 2 ? NAME2 : NAME; pr = pr.replace(/([.!?])$/, ", {name}$1"); }
  const wrongCase = o === "it" ? `${v} it ${p} it` : SUBJ[o] ? `${v} ${p} ${SUBJ[o]}` : `${v} ${o} ${p} it`;
  const opts = [`${v} ${p} ${o}`, `${v} ${o} ${p}`, wrongCase, `${v} ${p} for ${o}`];
  if (p === "for") opts[3] = `${v} ${p} to ${o}`;
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: pr, options, key: options.indexOf(opts[0]), why, slots: s };
});

/* ---------------- build: 20 gap_fill, two gaps ---------------- */
const INSTR = "Put the two words in brackets in the gaps, in the right order.";
const BUILD = [
  [["after", "him"], "My little brother is sick. Can you look ______ ______ (him / after) on {day}, {name}?", { day: ["Monday", "Friday", "Saturday", "Sunday"] }, "look after him: the pronoun goes after the particle."],
  [["for", "it"], "I dropped my {thing} somewhere. I'm looking ______ ______ (it / for), {name}.", { thing: ["ring", "key", "phone", "wallet"] }, "look for it: inseparable."],
  [["on", "it"], "The {bus} is leaving! Get ______ ______ (on / it) now, {name}!", { bus: ["bus", "train", "tram", "minibus"] }, "get on it: inseparable."],
  [["off", "it"], "When the {bus} stops, get ______ ______ (it / off) and wait for me, {name}.", { bus: ["bus", "train", "tram", "minibus"] }, "get off it: inseparable."],
  [["into", "her"], "I ran ______ ______ (her / into) at the {place} last week, {name}.", { place: ["bazaar", "station", "cinema", "bank"] }, "ran into her: inseparable."],
  [["across", "it"], "This recipe is great. I came ______ ______ (across / it) in an old {thing}, {name}.", { thing: ["book", "magazine", "notebook", "newspaper"] }, "came across it: inseparable."],
  [["after", "her"], "Your daughter really takes ______ ______ (her / after). She has her {who}'s eyes, {name}.", { who: ["mother", "grandma", "aunt", "mum"] }, "takes after her: inseparable."],
  [["over", "it"], "It was a bad {thing}, but she got ______ ______ (it / over) quickly, {name}.", { thing: ["cold", "flu", "day", "week"] }, "got over it: inseparable."],
  [["on", "him"], "My {who} is always on time. You can count ______ ______ (him / on), {name}.", { who: ["brother", "driver", "uncle", "son"] }, "count on him: inseparable."],
  [["into", "it"], "The bank is looking ______ ______ (into / it) and will call you back, {name}.", { name: NAME }, "looking into it: inseparable."],
  [["with", "it"], "Don't worry about the broken {thing}. Dad will deal ______ ______ (it / with), {name}.", { thing: ["window", "door", "tap", "fence"] }, "deal with it: inseparable."],
  [["after", "them"], "Who looks ______ ______ (them / after) when you're at work, {name}? Your {who}?", { who: ["mum", "neighbour", "sister", "grandma"] }, "looks after them: inseparable."],
  [["for", "her"], "Have you seen my {who}? I'm looking ______ ______ (for / her), {name}.", { who: ["sister", "daughter", "mum", "aunt"] }, "looking for her: inseparable."],
  [["into", "them"], "We ran ______ ______ (them / into) at the {event}. What a surprise, {name}!", { event: ["wedding", "concert", "match", "party"] }, "ran into them: inseparable."],
  [["through", "it"], "The exam was hard, but we went ______ ______ (it / through) together, {name}. It was in {month}.", { month: ["May", "June", "January", "December"] }, "went through it: inseparable."],
  [["across", "them"], "These old letters are my grandpa's. I came ______ ______ (them / across) in the {place}, {name}.", { place: ["attic", "garage", "cupboard", "basement"] }, "came across them: inseparable."],
  [["after", "it"], "We have a new puppy. My son looks ______ ______ (after / it) every {time}, {name}.", { time: ["day", "morning", "evening", "weekend"] }, "looks after it: inseparable."],
  [["on", "us"], "If you need help with the {thing}, you can count ______ ______ (us / on), {name}.", { thing: ["move", "wedding", "garden", "party"] }, "count on us: inseparable."],
  [["over", "it"], "He was very sad when his best friend moved to {city}, but he got ______ ______ (it / over) in the end, {name}.", { city: ["Moscow", "Seoul", "London", "Dubai"] }, "got over it: inseparable."],
  [["with", "them"], "There were problems with the {thing}, but the manager dealt ______ ______ (with / them), {name}.", { thing: ["tickets", "rooms", "orders", "bills"] }, "dealt with them: inseparable."],
].map(([key, source, slots, why], i) => {
  let src = source;
  const s = fill(src, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) { s.place = ["today", "this week", "soon", "right now"]; src = src.replace("will call you back", "will call you back {place}"); }
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, two gaps ---------------- */
const PRON = "Rewrite with the pronoun in brackets instead of the noun. One word in each gap.";
const FIX = "Correct the word order. One word in each gap.";
const SAY = "Say it with the phrasal verb. One word in each gap.";
const TRANSFORM = [
  [PRON, "(her) I ran into my old teacher at the {place}, {name}.", "I ran ______ ______ at the {place}, {name}.", ["into", "her"], { place: ["bazaar", "airport", "bank", "station"] }, "ran into her: the pronoun goes after the particle."],
  [PRON, "(it) Who looks after your grandparents' {animal}, {name}?", "Who looks ______ ______, {name}?", ["after", "it"], { animal: ["dog", "cow", "garden", "cat"] }, "looks after it: inseparable."],
  [PRON, "(it) We got on the last {bus} just in time, {name}.", "We got ______ ______ just in time, {name}.", ["on", "it"], { bus: ["bus", "train", "tram", "minibus"] }, "got on it: inseparable."],
  [PRON, "(them) I came across these {thing} in a box, {name}.", "I came ______ ______ in a box, {name}.", ["across", "them"], { thing: ["photos", "letters", "coins", "stamps"] }, "came across them: inseparable."],
  [PRON, "(him) Are you still looking for your {who}, {name}?", "Are you still looking ______ ______, {name}?", ["for", "him"], { who: ["brother", "son", "dad", "uncle"] }, "looking for him: inseparable."],
  [FIX, "Can you look her after on {day}, {name}?", "Can you look ______ ______ on {day}, {name}?", ["after", "her"], { day: ["Monday", "Friday", "Saturday", "Sunday"] }, "look after her, never look her after."],
  [FIX, "I'm looking them for. Have you seen my {thing}, {name}?", "I'm looking ______ ______. Have you seen my {thing}, {name}?", ["for", "them"], { thing: ["keys", "glasses", "socks", "gloves"] }, "looking for them, never looking them for."],
  [FIX, "I ran him into at the {place}, {name}.", "I ran ______ ______ at the {place}, {name}.", ["into", "him"], { place: ["gym", "café", "bazaar", "airport"] }, "ran into him, never ran him into."],
  [FIX, "Don't worry about the {thing}. I'll deal it with, {name}.", "Don't worry about the {thing}. I'll deal ______ ______, {name}.", ["with", "it"], { thing: ["bill", "noise", "car", "letter"] }, "deal with it, never deal it with."],
  [FIX, "My daughter takes me after. She loves {thing}, {name}.", "My daughter takes ______ ______. She loves {thing}, {name}.", ["after", "me"], { thing: ["books", "music", "cooking", "maths"] }, "takes after me, never takes me after."],
  [SAY, "(take after) My brother is just like our dad, {name}. He's tall and {adj}.", "My brother takes ______ ______ dad, {name}. He's tall and {adj}.", ["after", "our"], { adj: ["funny", "quiet", "kind", "clever"] }, "be like = take after; the noun comes after the particle."],
  [SAY, "(run into) I met my cousin by chance at the {place}, {name}.", "I ran ______ ______ cousin at the {place}, {name}.", ["into", "my"], { place: ["bazaar", "airport", "metro", "theatre"] }, "meet by chance = run into + the person."],
  [SAY, "(come across) She found an old {thing} by chance in the cupboard, {name}.", "She came ______ ______ old {thing} in the cupboard, {name}.", ["across", "an"], { thing: ["album", "letter", "envelope", "atlas"] }, "find by chance = come across + the thing."],
  [SAY, "(get over) It took my dad a month to get better after the {thing}, {name}.", "It took my dad a month to get ______ ______ {thing}, {name}.", ["over", "the"], { thing: ["flu", "operation", "accident", "cold"] }, "get better after = get over + the illness."],
  [SAY, "(look after) Who takes care of the {animal} when you're away, {name}?", "Who looks ______ ______ {animal} when you're away, {name}?", ["after", "the"], { animal: ["dog", "cat", "garden", "flat"] }, "take care of = look after + the noun."],
].map(([instr, source, hint, key, slots, why], i) => {
  const s = fill(source + hint, slots, i % 2 ? NAME2 : NAME);
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with look after + a pronoun.", "look after him / her / it", ["exactly one sentence", "look after", "a pronoun after the particle"]],
  ["Write one sentence with look for + a pronoun.", "looking for it / them", ["exactly one sentence", "look for", "a pronoun after the particle"]],
  ["Write one sentence about someone you ran into by chance.", "I ran into …", ["exactly one sentence", "run into", "past"]],
  ["Write one sentence about someone in your family you take after.", "I take after …", ["exactly one sentence", "take after", "a person"]],
  ["Write one sentence about something you came across by chance.", "I came across …", ["exactly one sentence", "come across", "past"]],
  ["Write one sentence with get on or get off + it.", "get on it / get off it", ["exactly one sentence", "get on / off", "it after the particle"]],
  ["Write one sentence with count on + a pronoun.", "You can count on me", ["exactly one sentence", "count on", "a pronoun"]],
  ["Write one sentence with get over + an illness or a problem.", "… got over …", ["exactly one sentence", "get over", "past"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write three or four sentences about who looks after the children or pets in your family.", "look after + pronoun", ["look after", "a pronoun object", "three or four sentences"]],
  ["Describe a surprise meeting with someone you hadn't seen for years. Write three or four sentences.", "run into / come across", ["run into", "a pronoun object", "three or four sentences"]],
  ["Write three or four sentences about who you take after in your family.", "take after", ["take after", "a pronoun object", "three or four sentences"]],
  ["Describe a time you lost something and looked for it. Write three or four sentences.", "look for it / come across it", ["look for", "a pronoun object", "three or four sentences"]],
  ["Write three or four sentences about a friend you can always count on.", "count on him / her", ["count on", "a pronoun object", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.phrasal-verbs.inseparable.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
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
   "",
   "",
   "",
   "",
   "",
   "",
   "",
   ""
  ],
  "build": [
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
   "",
   "",
   "",
   "",
   "",
   "",
   "get over stays together; it goes after: over it.",
   ""
  ],
  "transform": [
   "",
   "look after stays together: after it, never look it after.",
   "",
   "come across stays together: across them, never came them across.",
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
   ""
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
