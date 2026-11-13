// Hand-authored: sentence-structure / imperatives / lets (A2).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "Let's + base form" (Let's to go to the cinema tonight →
// Let's go …). Making suggestions: Let's + verb, and Let's not + verb.
// Choose: 12 items pick the verb after Let's (to / -ing / -s are the errors),
// 4 items pick the Let's form itself (Let's we / Let we / Lets we: "we" added
// from Uzbek/Russian "keling, …-aylik" / "davay my …"), 4 items pick the
// negative (not to / no / not -ing). "Let us" is never offered (it is right,
// if formal), and neither is "Let's don't" (some American speakers use it).
// Typed keys: let's + verb / let's not + verb; "let us …" is accepted too.
//
// Run: node tools/grammar-practice/authored/sentence-structure.imperatives.lets.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "imperatives", topic: "lets", level: "A2", pv: "2.5" };

const V = (v, s, ing) => [v, `to ${v}`, ing, s];
const VW = (v) => `After Let's, use the base verb: Let's ${v}. No to, no -ing, no -s.`;
const FORM = ["Let's", "Lets we", "Let we", "Let's we"];
const FW = "Make a suggestion with Let's + base verb. Let's already means let us, so don't add we.";
const N = (v, ing) => [`not ${v}`, `not to ${v}`, `no ${v}`, `not ${ing}`];
const NW = (v) => `The negative suggestion is Let's not + base verb: Let's not ${v}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [V("go", "goes", "going"), VW("go"), "It's sunny! Let's ______ to the {place} {when}.",
    { place: ["park", "lake", "river", "mountains"], when: ["this afternoon", "today", "after lunch", "now"] }],
  [V("make", "makes", "making"), VW("make"), "I'm hungry. Let's ______ {food} for dinner, {name}.",
    { food: ["plov", "pizza", "soup", "manti"], name: ["Aziz", "Olga", "Mum", "Lola"] }],
  [V("watch", "watches", "watching"), VW("watch"), "Let's ______ a film {where} {when}.",
    { where: ["at home", "at my house", "together", "online"], when: ["tonight", "this evening", "after dinner", "on Saturday"] }],
  [V("ask", "asks", "asking"), VW("ask"), "Let's ______ {who} for help with the {task}.",
    { who: ["the teacher", "Dad", "our neighbour", "my brother"], task: ["homework", "project", "computer", "maths"] }],
  [V("take", "takes", "taking"), VW("take"), "The {transport} is late. Let's ______ a taxi to the {place}.",
    { transport: ["bus", "minibus", "tram", "train"], place: ["station", "airport", "hospital", "stadium"] }],
  [V("wait", "waits", "waiting"), VW("wait"), "Let's ______ for {who} at the {place}.",
    { who: ["the others", "Aziz", "our friends", "Mum"], place: ["gate", "entrance", "bus stop", "corner"] }],
  [V("play", "plays", "playing"), VW("play"), "Let's ______ {sport} after {event}!",
    { sport: ["football", "volleyball", "basketball", "tennis"], event: ["school", "class", "lunch", "work"] }],
  [V("buy", "buys", "buying"), VW("buy"), "It's Grandma's birthday. Let's ______ her a {thing} {where}.",
    { thing: ["cake", "scarf", "card", "plant"], where: ["at the market", "online", "in town", "together"] }],
  [V("have", "has", "having"), VW("have"), "Let's ______ a break for {time}, {name}.",
    { time: ["ten minutes", "five minutes", "a few minutes", "half an hour"], name: ["Sardor", "Kamila", "Bobur", "Nodira"] }],
  [V("clean", "cleans", "cleaning"), VW("clean"), "Let's ______ the {room} before {who} comes home.",
    { room: ["kitchen", "living room", "flat", "bedroom"], who: ["Mum", "Dad", "Grandma", "Grandpa"] }],
  [V("speak", "speaks", "speaking"), VW("speak"), "Let's ______ only English {when}, {name}.",
    { when: ["this week", "today", "in class", "at lunch"], name: ["Malika", "Timur", "Olga", "Jasur"] }],
  [V("say", "says", "saying"), VW("say"), "Let's ______ hello to {who} {when}.",
    { who: ["the new student", "our neighbours", "Grandma", "everyone"], when: ["now", "first", "before we go", "at the party"] }],
  [FORM, FW, "______ go home now. It's {adj}, {name}.",
    { adj: ["late", "dark", "cold", "raining"], name: ["Aziz", "Lola", "Anvar", "Sevara"] }],
  [FORM, FW, "I'm bored. ______ play a {game}, {name}!",
    { game: ["game", "board game", "word game", "card game"], name: ["Bekzod", "Malika", "Rustam", "Olga"] }],
  [FORM, FW, "We have an exam {when}. ______ study together, {name}.",
    { when: ["tomorrow", "on Monday", "next week", "on Friday"], name: ["Kamila", "Jasur", "Nigora", "Sardor"] }],
  [FORM, FW, "______ meet at the {place} at {time}.",
    { place: ["cinema", "metro", "café", "library"], time: ["six", "seven", "five", "eight"] }],
  [N("be", "being"), NW("be"), "Let's ______ late {when}, {name}.",
    { when: ["again", "tomorrow", "this time", "for class"], name: ["Aziz", "Olga", "Timur", "Dilnoza"] }],
  [N("take", "taking"), NW("take"), "Let's ______ the {transport}. It's too {adj}.",
    { transport: ["bus", "metro", "minibus", "train"], adj: ["crowded", "slow", "full"] }],
  [N("have", "having"), NW("have"), "Let's ______ {food} again. We had it {when}.",
    { food: ["pizza", "plov", "soup", "pasta"], when: ["yesterday", "last night", "on Monday", "for lunch"] }],
  [N("worry", "worrying"), NW("worry"), "Let's ______ about the {thing} now. Let's enjoy the {event}.",
    { thing: ["exam", "test", "homework", "money"], event: ["party", "holiday", "weekend", "concert"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Make a suggestion with Let's or Let's not + the verb in brackets.";
const POS = (v) => `A suggestion: Let's + base verb: Let's ${v}.`;
const NEG = (v) => `The context says we shouldn't do it, so use Let's not + base verb: Let's not ${v}.`;
const BUILD = [
  ["go", 1, "It's a lovely day. ______ (go) for a walk in the {place}, {name}!",
    { place: ["park", "old city", "botanical garden", "mahalla"], name: ["Aziz", "Lola", "Mum", "Sardor"] }],
  ["have", 1, "______ (have) {food} for lunch today. It's my favourite, {name}!",
    { food: ["plov", "lagman", "pizza", "soup"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["hurry", 1, "The film starts at {time}. ______ (hurry), {name}!",
    { time: ["six", "seven", "eight", "half past five"], name: ["Bobur", "Kamila", "Olga", "Timur"] }],
  ["ask", 1, "We're lost. ______ (ask) the {person} for directions to the {place}.",
    { person: ["police officer", "shop assistant", "guard", "taxi driver"], place: ["station", "hotel", "museum", "bazaar"] }],
  ["invite", 1, "______ (invite) {who} to the party {when}.",
    { who: ["Aziz and Lola", "our neighbours", "the whole class", "Olga"], when: ["on Friday", "next week", "on Saturday", "tonight"] }],
  ["tidy", 1, "This room is a mess. ______ (tidy) it together {when}.",
    { when: ["now", "after lunch", "before Mum comes", "today"] }],
  ["sit", 1, "______ (sit) {where}. There's a nice view, {name}.",
    { where: ["here", "by the window", "outside", "on the balcony"], name: ["Grandma", "Dilshod", "Malika", "Dad"] }],
  ["call", 1, "______ (call) {who} {when} and tell them the news.",
    { who: ["our parents", "Aziz and Lola", "everyone", "our friends"], when: ["now", "tonight", "after dinner", "right away"] }],
  ["open", 1, "It's {temp} in here. ______ (open) the windows.",
    { temp: ["hot", "stuffy", "warm", "too hot"] }],
  ["play", 1, "______ (play) {game} while we wait for {who}.",
    { game: ["cards", "chess", "a word game", "a quiz"], who: ["the bus", "Dad", "the others", "our food"] }],
  ["meet", 1, "______ (meet) outside the {place} at {time}.",
    { place: ["cinema", "school", "metro", "library"], time: ["six", "seven", "five", "eight"] }],
  ["learn", 1, "______ (learn) ten new words {when}, {name}.",
    { when: ["every day", "today", "this week", "before class"], name: ["Nodira", "Jasur", "Olga", "Anvar"] }],
  ["start", 1, "______ (start) the {thing} now. We don't have much time.",
    { thing: ["meeting", "lesson", "game", "test"] }],
  ["go", 0, "______ (go) out tonight. It's too {adj}, {name}.",
    { adj: ["cold", "late", "wet", "windy"], name: ["Aziz", "Sevara", "Mum", "Rustam"] }],
  ["tell", 0, "______ (tell) {who} about the party. It's a surprise!",
    { who: ["Mum", "Lola", "the teacher", "our brother"] }],
  ["spend", 0, "______ (spend) all our money on {thing}. We need it for the {trip}.",
    { thing: ["snacks", "games", "clothes", "souvenirs"], trip: ["trip", "tickets", "hotel", "holiday"] }],
  ["watch", 0, "______ (watch) {show} tonight. It's too {adj}.",
    { show: ["that film", "that series", "the horror film", "this show"], adj: ["scary", "boring", "long", "sad"] }],
  ["wake", 0, "______ (wake) the baby, {name}. She's {state}.",
    { name: ["Aziz", "Dad", "Olga", "Timur"], state: ["asleep", "so tired", "very tired", "sleeping well"] }],
  ["forget", 0, "______ (forget) our {thing} this time, {name}!",
    { thing: ["tickets", "passports", "keys", "umbrellas"], name: ["Bekzod", "Mum", "Lola", "Anvar"] }],
  ["argue", 0, "______ (argue) about {thing} again, {name}.",
    { thing: ["money", "football", "homework", "the TV"], name: ["Sardor", "Kamila", "Dad", "Bobur"] }],
].map(([v, pos, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source,
  key: pos ? `let's ${v}` : `let's not ${v}`, acceptable: [pos ? `let us ${v}` : `let us not ${v}`],
  why: pos ? POS(v) : NEG(v), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const WHY = "Rewrite the suggestion with Let's.";
const HOW = "Rewrite the suggestion with Let's. Change the verb form.";
const NOT = "Rewrite with Let's not.";
const TRANSFORM = [
  // Why don't we …? -> Let's … (5)
  [WHY, "Why don't we go to {place} {when}?", "______ (go) to {place} {when}.", 1, "go",
    "Why don't we go…? is a suggestion. The short way: Let's go…",
    { place: ["the zoo", "the cinema", "Chorsu Bazaar", "the lake"], when: ["on Sunday", "tomorrow", "this weekend", "today"] }],
  [WHY, "Why don't we order {food} {when}?", "______ (order) {food} {when}.", 1, "order",
    "Why don't we… = Let's + base verb: Let's order…",
    { food: ["pizza", "plov", "burgers", "shashlik"], when: ["tonight", "for lunch", "now", "for the party"] }],
  [WHY, "Why don't we ask {who} about the {thing}?", "______ (ask) {who} about the {thing}.", 1, "ask",
    "Why don't we… = Let's + base verb: Let's ask…",
    { who: ["the teacher", "Dad", "Aziz", "the guide"], thing: ["homework", "trip", "test", "price"] }],
  [WHY, "Why don't we study at the {place} {when}?", "______ (study) at the {place} {when}.", 1, "study",
    "Why don't we… = Let's + base verb: Let's study…",
    { place: ["library", "café", "park", "reading room"], when: ["after school", "tomorrow", "on Saturday", "this afternoon"] }],
  [WHY, "Why don't we take the {transport} to {city}?", "______ (take) the {transport} to {city}.", 1, "take",
    "Why don't we… = Let's + base verb: Let's take…",
    { transport: ["train", "bus", "fast train", "night train"], city: ["Bukhara", "Samarkand", "Khiva", "Fergana"] }],
  // How about -ing? -> Let's + base (5)
  [HOW, "How about playing {game} {when}?", "______ (play) {game} {when}.", 1, "play",
    "How about playing…? becomes Let's play… After Let's, the verb has no -ing.",
    { game: ["chess", "cards", "football", "a quiz"], when: ["after dinner", "now", "this evening", "at lunch"] }],
  [HOW, "How about cooking {food} for {who}?", "______ (cook) {food} for {who}.", 1, "cook",
    "How about cooking…? becomes Let's cook… No -ing after Let's.",
    { food: ["plov", "manti", "soup", "dinner"], who: ["Mum", "our guests", "the family", "Grandma"] }],
  [HOW, "What about visiting {who} {when}?", "______ (visit) {who} {when}.", 1, "visit",
    "What about visiting…? becomes Let's visit…",
    { who: ["Grandma", "our cousins", "Aunt Lola", "our old teacher"], when: ["on Sunday", "this weekend", "tomorrow", "after the exams"] }],
  [HOW, "How about watching {show} {where}?", "______ (watch) {show} {where}.", 1, "watch",
    "How about watching…? becomes Let's watch…",
    { show: ["a film", "the match", "a cartoon", "the concert"], where: ["at my house", "together", "online", "at the café"] }],
  [HOW, "What about meeting at the {place} at {time}?", "______ (meet) at the {place} at {time}.", 1, "meet",
    "What about meeting…? becomes Let's meet…",
    { place: ["metro", "gate", "café", "library"], time: ["five", "six", "seven", "noon"] }],
  // We shouldn't … -> Let's not … (5)
  [NOT, "We shouldn't be late for the {event}, {name}.", "______ (be) late for the {event}, {name}.", 0, "be",
    "We shouldn't… becomes Let's not + base verb: Let's not be late.",
    { event: ["lesson", "bus", "concert", "wedding"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [NOT, "We shouldn't eat {food} {when}.", "______ (eat) {food} {when}.", 0, "eat",
    "We shouldn't… becomes Let's not + base verb: Let's not eat…",
    { food: ["fast food", "sweets", "chips", "cake"], when: ["today", "tonight", "before dinner", "this week"] }],
  [NOT, "We shouldn't make noise. {who} is {state}.", "______ (make) noise. {who} is {state}.", 0, "make",
    "We shouldn't… becomes Let's not + base verb: Let's not make noise.",
    { who: ["The baby", "Grandpa", "Grandma", "Our neighbour"], state: ["sleeping", "asleep", "resting", "working"] }],
  [NOT, "We shouldn't spend so much time on {thing} {when}.", "______ (spend) so much time on {thing} {when}.", 0, "spend",
    "We shouldn't… becomes Let's not + base verb: Let's not spend…",
    { thing: ["our phones", "games", "social media", "TV"], when: ["today", "this week", "at the weekend", "tonight"] }],
  [NOT, "We shouldn't go {where} {when}.", "______ (go) {where} {when}.", 0, "go",
    "We shouldn't… becomes Let's not + base verb: Let's not go…",
    { where: ["outside", "to the river", "swimming", "far"], when: ["today", "tonight", "in this weather", "alone"] }],
].map(([instr, source, hint, pos, v, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint,
  key: pos ? `let's ${v}` : `let's not ${v}`, acceptable: [pos ? `let us ${v}` : `let us not ${v}`], why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Suggest something to do with your friends this weekend.", "Let's + base verb", ["exactly one sentence", "must start with Let's", "must include this weekend"]],
  ["Suggest what to eat for dinner tonight.", "Let's + base verb", ["exactly one sentence", "must use Let's", "must name a food"]],
  ["It's raining. Suggest something NOT to do.", "Let's not + base verb", ["exactly one sentence", "must use Let's not", "must mention the rain"]],
  ["Your class has an exam soon. Make a suggestion to a classmate.", "Let's + base verb", ["exactly one sentence", "must use Let's", "no to after Let's"]],
  ["Suggest a place to meet and a time.", "Let's meet at …", ["exactly one sentence", "must use Let's meet", "must include a place and a time"]],
  ["A friend wants to buy something expensive. Make a suggestion.", "Let's not + base verb", ["exactly one sentence", "must use Let's not", "must name the thing"]],
  ["Answer your friend: \"I'm bored.\"", "Let's + base verb", ["exactly one sentence", "must use Let's", "no -ing after Let's"]],
  ["Make two suggestions for a picnic: one thing to do and one thing not to do.", "Let's … and Let's not …", ["exactly two sentences", "one with Let's, one with Let's not", "base verb in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Plan a free Saturday with a friend. Write a short dialogue where you both make suggestions.",
    "Let's / Let's not + base verb", ["Let's + base verb", "Let's not + base verb", "a reply like Good idea!"]],
  ["Your class wants to do something nice for your teacher's birthday. Write four suggestions.",
    "Let's + base verb", ["Let's + base verb", "four different verbs", "no to or -ing after Let's"]],
  ["You and your family are planning a trip in Uzbekistan. Write three or four suggestions about where to go and what to do.",
    "Let's for suggestions", ["Let's go / visit / see", "place names", "Let's not for one thing to avoid"]],
  ["Your group has a project to finish. Write suggestions about how to work together.",
    "Let's / Let's not + base verb", ["Let's + base verb", "Let's not + base verb", "who does what"]],
  ["A friend says: \"Why don't we go to the cinema?\" Answer with your own suggestions instead.",
    "Let's + base verb", ["Let's + base verb", "a reason with because", "Let's not for one idea"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.imperatives.lets.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
