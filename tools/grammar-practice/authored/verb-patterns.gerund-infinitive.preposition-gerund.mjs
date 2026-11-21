// Hand-authored: verb-patterns / gerund-infinitive / preposition-gerund (A2).
// Path fill P54 (Claude lane, branch grammar-path-fill-claude, 17 Nov 2026).
//
// Tests ONE point: after a preposition the verb takes -ing ("I'm good at
// swimming", "before going", "without saying"). The placement item is
// "good at ______ (swim) ... bad at ______ (run)".
//
// Prepositions used: before, after, without, for, at, of, about, by, instead
// of. The preposition is always printed and never tested (that is
// adjective-preposition, P37, and interested-in, P55). Wrong answers: the
// bare verb, to + verb and a past form. "interested to learn" is correct
// English, so "to + verb" is never offered after "interested in".
// No typed key has a British/American spelling split (no travelling).
//
// Run: node tools/grammar-practice/authored/verb-patterns.gerund-infinitive.preposition-gerund.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "gerund-infinitive", topic: "preposition-gerund", level: "A2", pv: "2.5" };
const N4 = ["Aziz", "Olga", "Timur", "Lola"];
const P4 = ["Mum", "Dad", "Aziz", "Olga"];
const ANY = ["Aziz", "Lola", "Madina", "Timur"];
const F4 = ["Lola", "Madina", "Kamila", "Nodira"];
const CITY = ["Tashkent", "Samarkand", "Bukhara", "Fergana"];
const W = (prep, ing) => `After a preposition (${prep}) the verb takes -ing: ${prep} ${ing}.`;

/* ---------------- choose: 20 mcq ---------------- */
const C = (prep, ing, opts, prompt, slots) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options: [ing, ...opts], key: 0, why: W(prep, ing), slots });
const CHOOSE = [
  C("without", "saying", ["say", "to say", "said"], "{name} left the {place} without ______ goodbye.",
    { name: ANY, place: ["party", "room", "house", "office"] }),
  C("before", "eating", ["eat", "to eat", "ate"], "Wash your hands before ______ {meal}, {name}.",
    { meal: ["lunch", "dinner", "breakfast", "the cake"], name: N4 }),
  C("after", "watching", ["watch", "to watch", "watched"], "After ______ the {thing}, we went {where}.",
    { thing: ["film", "match", "show", "news"], where: ["home", "to bed", "for a walk", "to a cafe"] }),
  C("for", "helping", ["help", "to help", "helped"], "Thank you for ______ me with my {thing}, {name}.",
    { thing: ["homework", "bags", "project", "English"], name: N4 }),
  C("at", "fixing", ["fix", "to fix", "fixed"], "My {relative} is good at ______ {things}.",
    { relative: ["father", "uncle", "brother", "grandfather"], things: ["cars", "bikes", "phones", "computers"] }),
  C("of", "waiting", ["wait", "to wait", "waited"], "I am tired of ______ for the {bus} every {time}.",
    { bus: ["bus", "train", "lift", "doctor"], time: ["morning", "day", "week", "Monday"] }),
  C("of", "making", ["make", "to make", "made"], "{name} is afraid of ______ mistakes in {subj}.",
    { name: ANY, subj: ["English", "maths", "the test", "class"] }),
  C("about", "moving", ["move", "to move", "moved"], "We are thinking about ______ to {city}, {name}.",
    { city: CITY, name: N4 }),
  C("by", "reading", ["read", "to read", "reads"], "{name}, you can learn new words by ______ {things}.",
    { name: N4, things: ["books", "stories", "comics", "the news"] }),
  C("instead of", "taking", ["take", "to take", "took"], "Let's walk instead of ______ the {bus}, {name}.",
    { bus: ["bus", "metro", "taxi", "tram"], name: N4 }),
  C("before", "going", ["go", "to go", "goes"], "{name} always reads {things} before ______ to sleep.",
    { name: ANY, things: ["a book", "stories", "the news", "comics"] }),
  C("after", "having", ["have", "to have", "has"], "After ______ breakfast, my {relative} goes to {place}.",
    { relative: ["father", "mother", "uncle", "aunt"], place: ["work", "the market", "the garden", "the office"] }),
  C("without", "looking", ["look", "to look", "looked"], "Don't cross the {road} without ______ both ways, {name}.",
    { road: ["road", "street", "main road", "big street"], name: N4 }),
  C("for", "being", ["be", "to be", "been"], "Sorry for ______ late, {name}. The {bus} didn't come.",
    { name: P4, bus: ["bus", "train", "taxi", "minibus"] }),
  C("at", "remembering", ["remember", "to remember", "remembered"], "I am bad at ______ {things}, {name}.",
    { things: ["names", "dates", "numbers", "faces"], name: N4 }),
  C("of", "buying", ["buy", "to buy", "bought"], "What do you think of ______ a {thing} for Dad, {name}?",
    { thing: ["watch", "book", "shirt", "bag"], name: N4 }),
  C("at", "drawing", ["draw", "to draw", "drew"], "{name} is very good at ______ {things}.",
    { name: ANY, things: ["animals", "people", "cars", "flowers"] }),
  C("about", "opening", ["open", "to open", "opened"], "My {relative} often talks about ______ a {shop}.",
    { relative: ["father", "uncle", "aunt", "sister"], shop: ["shop", "cafe", "bakery", "small hotel"] }),
  C("by", "running", ["run", "to run", "ran"], "{name} got fit by ______ every {time}.",
    { name: ANY, time: ["morning", "day", "evening", "weekend"] }),
  C("before", "leaving", ["leave", "to leave", "left"], "Please turn off the {thing} before ______ the {room}.",
    { thing: ["light", "computer", "TV", "heater"], room: ["room", "house", "office", "classroom"] }),
];

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the right form of the verb in brackets.";
const B = (prep, ing, source, slots) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key: ing, why: W(prep, ing), slots });
const BUILD = [
  B("at", "swimming", "I'm good at ______ (swim), {name}, but I can't {do}.",
    { name: N4, do: ["dive", "run fast", "skate", "ski"] }),
  B("for", "coming", "Thank you for ______ (come) to my {event}, {name}.",
    { event: ["party", "wedding", "concert", "birthday"], name: N4 }),
  B("without", "taking", "{name} went out without ______ (take) {thing}.",
    { name: ANY, thing: ["an umbrella", "a coat", "the keys", "any money"] }),
  B("before", "buying", "Before ______ (buy) a {thing}, read about it online, {name}.",
    { thing: ["phone", "laptop", "bike", "car"], name: P4 }),
  B("after", "finishing", "After ______ (finish) {thing}, {name} went to bed.",
    { thing: ["the book", "the film", "the game", "dinner"], name: ANY }),
  B("at", "cooking", "My {relative} is bad at ______ (cook), so we often eat {what}.",
    { relative: ["father", "uncle", "brother", "aunt"], what: ["out", "in a cafe", "at Grandma's", "simple food"] }),
  B("of", "doing", "{name} is tired of ______ (do) the same {thing} every day.",
    { name: ANY, thing: ["exercises", "job", "work", "thing"] }),
  B("about", "getting", "We are thinking about ______ (get) a {pet}, {name}.",
    { pet: ["dog", "cat", "parrot", "rabbit"], name: N4 }),
  B("by", "walking", "{name}, you can save money by ______ (walk) to {place}.",
    { name: N4, place: ["school", "work", "the market", "the centre"] }),
  B("instead of", "watching", "Instead of ______ (watch) TV, let's {do}, {name}.",
    { do: ["go out", "play chess", "call Grandma", "read"], name: N4 }),
  B("of", "losing", "{name} is afraid of ______ (lose) her {thing}.",
    { name: F4, thing: ["phone", "keys", "bag", "job"] }),
  B("for", "calling", "Sorry for ______ (call) so late, {name}. I need {thing}.",
    { name: N4, thing: ["help", "your advice", "the address", "the homework"] }),
  B("by", "listening", "My {relative} relaxes by ______ (listen) to {music}.",
    { relative: ["father", "mother", "sister", "grandfather"], music: ["music", "the radio", "old songs", "the news"] }),
  B("in", "joining", "Are you interested in ______ (join) our {club} club, {name}?",
    { club: ["chess", "drama", "English", "football"], name: N4 }),
  B("without", "washing", "Don't eat {food} without ______ (wash) it first, {name}.",
    { food: ["fruit", "an apple", "a peach", "a carrot"], name: N4 }),
  B("about", "visiting", "{name} talks about ______ (visit) {city} one day.",
    { name: ANY, city: ["Samarkand", "Khiva", "Istanbul", "Seoul"] }),
  B("before", "going", "Before ______ (go) out, close the {thing}, {name}.",
    { thing: ["window", "door", "gate", "balcony door"], name: N4 }),
  B("after", "playing", "After ______ (play) {game}, the {who} were hungry.",
    { game: ["football", "tennis", "volleyball", "basketball"], who: ["boys", "girls", "children", "players"] }),
  B("at", "singing", "{name}, I'm not very good at ______ (sing), but I love {thing}.",
    { name: N4, thing: ["music", "karaoke", "songs", "concerts"] }),
  B("about", "having", "What about ______ (have) {food} for dinner, {name}?",
    { food: ["plov", "pizza", "fish", "soup"], name: P4 }),
];

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the ideas into one sentence. Use an -ing form after the preposition.";
const FIX = "Correct the verb form after the preposition.";
const SAME = "Finish the second sentence so it means the same.";
const T = (instr, source, hint, key, why, slots) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots });
const TRANSFORM = [
  // join (5)
  T(JOIN, "{name}, he ate breakfast. Then he went to {place}.", "{name}, after ______ breakfast, he went to {place}.", "eating", W("after", "eating"),
    { name: N4, place: ["school", "work", "the market", "the gym"] }),
  T(JOIN, "{name} didn't say goodbye. She left the {place}.", "{name} left the {place} without ______ goodbye.", "saying", W("without", "saying"),
    { name: F4, place: ["party", "room", "house", "office"] }),
  T(JOIN, "First wash the {fruit}. Then eat it, {name}.", "Wash the {fruit} before ______ it, {name}.", "eating", W("before", "eating"),
    { fruit: ["apple", "pear", "peach", "tomato"], name: N4 }),
  T(JOIN, "{name} swims very well, {voc}.", "{name} is good at ______, {voc}.", "swimming", W("at", "swimming"),
    { name: ANY, voc: P4 }),
  T(JOIN, "Don't take the {bus}. Walk, {name}.", "Walk instead of ______ the {bus}, {name}.", "taking", W("instead of", "taking"),
    { bus: ["bus", "metro", "taxi", "tram"], name: N4 }),
  // correct the form (5)
  T(FIX, "Thank you for help me with the {thing}, {name}.", "Thank you for ______ me with the {thing}, {name}.", "helping", W("for", "helping"),
    { thing: ["bags", "dishes", "project", "test"], name: N4 }),
  T(FIX, "Before to go to bed, {name} reads a {thing}.", "Before ______ to bed, {name} reads a {thing}.", "going", W("before", "going"),
    { name: ANY, thing: ["book", "story", "magazine", "comic"] }),
  T(FIX, "I'm tired of wait for the {bus}, {name}.", "I'm tired of ______ for the {bus}, {name}.", "waiting", W("of", "waiting"),
    { bus: ["bus", "train", "lift", "taxi"], name: P4 }),
  T(FIX, "She left without to close the {thing}, {name}.", "She left without ______ the {thing}, {name}.", "closing", W("without", "closing"),
    { thing: ["door", "window", "gate", "fridge"], name: N4 }),
  T(FIX, "My {relative} is good at cook {food}.", "My {relative} is good at ______ {food}.", "cooking", W("at", "cooking"),
    { relative: ["father", "mother", "aunt", "brother"], food: ["plov", "soup", "fish", "manti"] }),
  // same meaning, new sentence (5)
  T(SAME, "{name} likes to draw {things} and does it well.", "{name} is good at ______ {things}.", "drawing", W("at", "drawing"),
    { name: ANY, things: ["animals", "people", "cars", "flowers"] }),
  T(SAME, "I don't want to do my {task} any more, {name}.", "I am tired of ______ my {task}, {name}.", "doing", W("of", "doing"),
    { task: ["homework", "exercises", "project", "job"], name: N4 }),
  T(SAME, "{name}, we may move to {city}. We are thinking about it.", "{name}, we are thinking about ______ to {city}.", "moving", W("about", "moving"),
    { name: N4, city: CITY }),
  T(SAME, "{name} learns {lang}. She watches films to do it.", "{name} learns {lang} by ______ films.", "watching", W("by", "watching"),
    { name: F4, lang: ["English", "Korean", "Turkish", "German"] }),
  T(SAME, "It scares {name} to speak in front of the {who}.", "{name} is afraid of ______ in front of the {who}.", "speaking", W("of", "speaking"),
    { name: ANY, who: ["class", "school", "teachers", "guests"] }),
];

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you are good at doing.", "good at + -ing", ["exactly one sentence", "must be about you", "must use at + an -ing form"]],
  ["Write one sentence about what you do before going to bed.", "before + -ing", ["exactly one sentence", "must use before going", "must be about you"]],
  ["Write one sentence that thanks someone for doing something.", "Thank you for + -ing", ["exactly one sentence", "must start with Thank you for", "must use an -ing form"]],
  ["Write one sentence about what you usually do after finishing school or work.", "after + -ing", ["exactly one sentence", "must use after + an -ing form", "must be about you"]],
  ["Write one sentence about something you are tired of doing.", "tired of + -ing", ["exactly one sentence", "must use tired of + an -ing form", "must be about you"]],
  ["Write one sentence of advice with without + -ing (for example about crossing the road or leaving home).", "without + -ing", ["exactly one sentence", "must use without + an -ing form", "must be advice"]],
  ["Write two sentences: one thing you are good at doing and one thing you are bad at doing.", "good at + -ing, bad at + -ing", ["exactly two sentences", "good at + -ing", "bad at + -ing"]],
  ["A friend wrote: \"Thank you for help me. I am good at cook.\" Write the two sentences correctly.", "for helping ... at cooking", ["exactly two sentences", "must use helping", "must use cooking"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What are you good at doing and bad at doing? Write three or four sentences.",
    "at + -ing", ["good at + -ing", "bad at + -ing", "no bare verb after at"]],
  ["Describe your evening. What do you do after coming home and before going to bed? Write three or four sentences.",
    "after / before + -ing", ["after + -ing", "before + -ing", "no to + verb after the preposition"]],
  ["How do you learn English words? Write three or four sentences with by + -ing.",
    "by + -ing", ["by + -ing at least twice", "an -ing form after every preposition", "different verbs"]],
  ["Write a short thank-you message to a friend or teacher who helped you. Three or four sentences.",
    "Thank you for + -ing", ["for + -ing", "another preposition + -ing", "polite tone"]],
  ["What are you tired of doing, and what are you thinking about doing this year? Write three or four sentences.",
    "tired of / thinking about + -ing", ["tired of + -ing", "thinking about + -ing", "no bare verb after the preposition"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
// Name-clash fix (Claude, 21 Nov 2026): a name slot never repeats a person printed in the
// same item, and two name slots in one item never share a name.
{
  const POOL = ["Dilnoza", "Sardor", "Nodira", "Akmal", "Gulnora", "Jamshid", "Feruza", "Otabek", "Zarina", "Sherzod", "Malika", "Ulugbek"];
  const isName = (x) => /^[A-Z][a-z]+$/.test(String(x));
  for (const it of items) {
    if (!["choose", "build", "transform"].includes(it.stage) || !it.slots) continue;
    const printed = [it.prompt, it.source, it.hint, it.instr].filter(Boolean).join(" ").replace(/\{[a-z0-9_]+\}/gi, " ");
    const used = new Set(Object.values(it.slots).flat());
    const fresh = () => POOL.find((p) => !used.has(p) && !new RegExp(`\\b${p}\\b`).test(printed));
    const seen = new Set();
    for (const [k, vals] of Object.entries(it.slots)) {
      const nameSlot = vals.every(isName);
      it.slots[k] = vals.map((v) => {
        const clash = isName(v) && (new RegExp(`\\b${v}\\b`).test(printed) || (nameSlot && seen.has(v)));
        if (!clash) return v;
        const r = fresh(); used.add(r); return r;
      });
      if (nameSlot) it.slots[k].forEach((v) => seen.add(v));
    }
  }
}
const out = "content/grammar-practice/verb-patterns.gerund-infinitive.preposition-gerund.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
