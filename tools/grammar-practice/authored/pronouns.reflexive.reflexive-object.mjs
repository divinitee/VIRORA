// Hand-authored: pronouns / reflexive / reflexive-object (B1).
// Wave C, C23 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: subject and object are the same person → reflexive
// ("Be careful with that knife — you might cut yourself"), and a different
// person → object pronoun ("My mum helped me").
// Learner errors: "I cut me", "enjoy you", "hisself", "theirselves",
// "ourself", and the reverse, "She helped myself" (myself as a polite me).
// Siblings: no-reflexive-after-feel (C21: feel / relax / concentrate keep no
// reflexive) and reciprocal (C22: each other). Neither is keyed or offered.
// Why the keys are mostly I / you / we: "I cut me" and "You might cut you"
// are wrong in every context, but "He hurt him" can be English (him = another
// man). So third-person reflexive items never offer him / her / them; their
// wrong options are hisself / his, sheself / hers, theirselves / their, its.
// Benefactive "bought us / built us" (US dialect) is never offered as wrong.
// Choose: 15 reflexive keys, 5 object-pronoun keys (the subject is someone
// else, so myself / yourself / ourselves is wrong). Singular you only
// (a named listener), so yourselves is never a second answer.
// Build: "Write the right pronoun." 15 reflexive / 5 object.
// Transform: 5 correct to -self / 5 correct to me / you / us / 5 change the
// subject (the reflexive follows it).
//
// Run: node tools/grammar-practice/authored/pronouns.reflexive.reflexive-object.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "reflexive", topic: "reflexive-object", level: "B1", pv: "2.5" };
const BOY = ["Aziz", "Timur", "Bobur", "Jasur"];
const GIRL = ["Olga", "Lola", "Madina", "Kamila"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const EVENT = ["party", "wedding", "concert", "festival"];
const FOOD = ["plov", "cake", "fruit", "samsa"];
const SURF = ["ice", "stairs", "wet floor", "path"];
const PAN = ["pan", "pot", "oven", "kettle"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_SELF = "The subject and the object are the same person, so use a -self word: I → myself, you → yourself, we → ourselves, he → himself, she → herself, it → itself, they → themselves.";
const W_FORM = "The -self words are myself, yourself, himself, herself, itself, ourselves, yourselves, themselves. hisself, theirselves and ourself are not English.";
const W_OBJ = "Here the subject is a different person, so use an object pronoun (me, you, us). myself / yourself / ourselves only work when the subject is the same person.";
const OY = ["yourself", "you", "yours", "your"];
const OM = ["myself", "me", "mine", "I"];
const OW = ["ourselves", "us", "ourself", "our"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [OY, W_SELF, "Be careful with that {tool}, {g}! You might cut ______.", { tool: ["knife", "saw", "razor", "glass"], g: GIRL }],
  [OM, W_SELF, "I taught ______ to play the {inst} from videos, {g}.", { inst: ["guitar", "piano", "dutar", "drums"], g: GIRL }],
  [OM, W_SELF, "I hurt ______ when I fell on the {surface} {when}.", { surface: SURF, when: PAST }],
  [OY, W_SELF, "Help ______ to some {food}, {g}!", { food: FOOD, g: GIRL }],
  [OY, W_SELF, "Did you enjoy ______ at the {event}, {g}?", { event: EVENT, g: GIRL }],
  [OM, W_SELF, "Let me introduce ______. I'm {b}, your new {job}.", { b: BOY, job: ["teacher", "neighbour", "coach", "driver"] }],
  [["ourselves", "us", "ourself", "our"], W_SELF, "We really enjoyed ______ at the {event} {when}.", { event: EVENT, when: PAST }],
  [["himself", "hisself", "his", "he"], W_FORM, "{b} made ______ a cup of {drink} and sat down.", { b: BOY, drink: ["tea", "coffee", "cocoa", "green tea"] }],
  [["herself", "sheself", "hers", "she"], W_FORM, "My sister bought ______ a new {thing} with her first salary.", { thing: ["phone", "laptop", "bike", "coat"] }],
  [["itself", "its", "itselves", "it's"], W_FORM, "The {machine} turns ______ off after ten minutes.", { machine: ["TV", "heater", "printer", "fan"] }],
  [["themselves", "theirselves", "their", "theirs"], W_FORM, "The children can dress ______ now; they're {age}.", { age: ["five", "six", "seven", "big now"] }],
  [OY, W_SELF, "Look after ______ in {city}, {g}!", { city: CITY, g: GIRL }],
  [OM, W_SELF, "I talk to ______ when I'm {state}, {g}.", { state: ["nervous", "alone", "cooking", "bored"], g: GIRL }],
  [["ourselves", "ourself", "our", "ours"], W_FORM, "We built ______ a small {thing} in the garden.", { thing: ["house", "table", "bench", "shed"] }],
  [OY, W_SELF, "Don't blame ______, {g}. It wasn't your fault.", { g: GIRL }],
  [["me", "myself", "mine", "I"], W_OBJ, "My mum looked at ______ and smiled, {g}.", { g: GIRL }],
  [["me", "myself", "mine", "I"], W_OBJ, "Can you help ______ with this {bag}, {g}?", { bag: ["bag", "box", "suitcase", "homework"], g: GIRL }],
  [["me", "myself", "mine", "I"], W_OBJ, "The teacher asked ______ a difficult question {when}.", { when: PAST }],
  [["us", "ourselves", "our", "we"], W_OBJ, "Our {who} invited ______ to dinner {when}.", { who: ["neighbours", "cousins", "friends", "teachers"], when: PAST }],
  [["you", "yourself", "yours", "your"], W_OBJ, "I'll call ______ tomorrow, {g}.", { g: GIRL }],
].map(([opts, why, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the right pronoun (myself, yourself … or me, you, us …). A word in brackets says who it is.";
const BUILD = [
  ["myself", W_SELF, "I cut ______ while I was cooking {food} {when}.", { food: ["plov", "soup", "dinner", "fish"], when: PAST }],
  ["yourself", W_SELF, "Be careful, {g}! Don't burn ______ on the {pan}.", { g: GIRL, pan: PAN }],
  ["ourselves", W_SELF, "We introduced ______ to the new {who} on {day}.", { who: ["neighbours", "teacher", "students", "coach"], day: ["Monday", "Tuesday", "Friday", "Saturday"] }],
  ["myself", W_SELF, "I made ______ a {food} because I was hungry, {g}.", { food: ["sandwich", "salad", "fried egg", "cup of soup"], g: GIRL }],
  ["yourself", W_SELF, "Did you hurt ______ when you fell on the {surface}, {g}?", { surface: SURF, g: GIRL }],
  ["himself", W_SELF, "My grandpa taught ______ English from {source} in {city}.", { source: ["old books", "the radio", "films", "songs"], city: CITY }],
  ["myself", W_SELF, "I looked at ______ in the {mirror} and laughed, {g}.", { mirror: ["mirror", "window", "photo", "video"], g: GIRL }],
  ["yourself", W_SELF, "Enjoy ______ at the {event}, {g}!", { event: EVENT, g: GIRL }],
  ["ourselves", W_SELF, "We enjoyed ______ at the {event} {when}.", { event: EVENT, when: PAST }],
  ["itself", W_SELF, "The {room} door locks ______ when you close it, {g}.", { room: ["office", "hotel", "car", "front"], g: GIRL }],
  ["myself", W_SELF, "I'm angry with ______ because I forgot my {thing}, {g}.", { thing: ["keys", "phone", "homework", "ticket"], g: GIRL }],
  ["yourself", W_SELF, "Take care of ______ in {city}, {g}.", { city: CITY, g: GIRL }],
  ["myself", W_SELF, "I sometimes talk to ______ when I'm {state}, {g}.", { state: ["nervous", "alone", "cooking", "bored"], g: GIRL }],
  ["ourselves", W_SELF, "We bought ______ new {things} for the trip to {city}.", { things: ["bags", "shoes", "hats", "jackets"], city: CITY }],
  ["yourself", W_SELF, "Help ______ to some {food}, {g}.", { food: FOOD, g: GIRL }],
  ["me", W_OBJ, "My dad drove ______ (I) to the {place} {when}.", { place: ["station", "airport", "hospital", "bazaar"], when: PAST }],
  ["me", W_OBJ, "Can you show ______ (I) the way to the {place}, {g}?", { place: ["station", "museum", "bank", "library"], g: GIRL }],
  ["us", W_OBJ, "Our neighbours invited ______ (we) to their {event} {when}.", { event: EVENT, when: PAST }],
  ["you", W_OBJ, "I'll send ______ (you) the photos {when}, {g}.", { when: ["tonight", "tomorrow", "later", "on Monday"], g: GIRL }],
  ["me", W_OBJ, "The {who} gave ______ (I) a good mark {when}.", { who: ["teacher", "tutor", "professor", "coach"], when: PAST }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "Correct the mistake.";
const SUB = (who) => `Start the sentence with ${who}.`;
const TRANSFORM = [
  // correct -> -self (5)
  [COR, "I cut me on the broken {thing} {when}.", "I cut ______ on the broken {thing} {when}.", "myself", W_SELF, { thing: ["glass", "plate", "bottle", "window"], when: PAST }],
  [COR, "Did you hurt you on the {surface}, {g}?", "Did you hurt ______ on the {surface}, {g}?", "yourself", W_SELF, { surface: SURF, g: GIRL }],
  [COR, "We enjoyed us at the {event} {when}.", "We enjoyed ______ at the {event} {when}.", "ourselves", W_SELF, { event: EVENT, when: PAST }],
  [COR, "{b} taught hisself to {skill}.", "{b} taught ______ to {skill}.", "himself", W_FORM, { b: BOY, skill: ["swim", "cook", "drive", "draw"] }],
  [COR, "The kids made theirselves some {food} {when}.", "The kids made ______ some {food} {when}.", "themselves", W_FORM, { food: ["sandwiches", "tea", "eggs", "pancakes"], when: PAST }],
  // correct -> object pronoun (5)
  [COR, "My mum helped myself with the {work}, {g}.", "My mum helped ______ with the {work}, {g}.", "me", W_OBJ, { work: ["homework", "cooking", "project", "letter"], g: GIRL }],
  [COR, "Can you call myself {when}, {g}?", "Can you call ______ {when}, {g}?", "me", W_OBJ, { when: ["tonight", "tomorrow", "later", "after lunch"], g: GIRL }],
  [COR, "Our {who} invited ourselves to the {event}.", "Our {who} invited ______ to the {event}.", "us", W_OBJ, { who: ["neighbours", "cousins", "friends", "teachers"], event: EVENT }],
  [COR, "I'll text yourself the {info}, {g}.", "I'll text ______ the {info}, {g}.", "you", W_OBJ, { info: ["address", "photos", "link", "plan"], g: GIRL }],
  [COR, "The {who} gave myself a present {when}.", "The {who} gave ______ a present {when}.", "me", W_OBJ, { who: ["teacher", "coach", "doctor", "neighbour"], when: PAST }],
  // change the subject (5)
  [SUB("I"), "You can look after yourself in {city}, {g}.", "I can look after ______ in {city}, {g}.", "myself", W_SELF, { city: CITY, g: GIRL }],
  [SUB("We"), "I enjoyed myself at the {event}, {g}.", "We enjoyed ______ at the {event}, {g}.", "ourselves", W_SELF, { event: EVENT, g: GIRL }],
  [SUB("I"), "We introduced ourselves to the new {who}, {g}.", "I introduced ______ to the new {who}, {g}.", "myself", W_SELF, { who: ["neighbours", "teacher", "students", "coach"], g: GIRL }],
  [SUB("My brother"), "I taught myself to {skill}.", "My brother taught ______ to {skill}.", "himself", W_SELF, { skill: ["swim", "cook", "drive", "draw"] }],
  [SUB("My sister"), "I bought myself a new {thing}.", "My sister bought ______ a new {thing}.", "herself", W_SELF, { thing: ["phone", "laptop", "bike", "coat"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you taught yourself.", "I taught myself to …", ["exactly one sentence", "myself", "taught"]],
  ["Write one sentence telling a friend to be careful.", "Be careful! Don't hurt yourself.", ["one or two short sentences", "yourself", "an imperative"]],
  ["Write one sentence about a party where you had a good time.", "We enjoyed ourselves at …", ["exactly one sentence", "ourselves", "a past verb"]],
  ["Write one sentence introducing yourself to a new class.", "Let me introduce myself. I'm …", ["one or two short sentences", "myself", "introduce"]],
  ["Write one sentence about someone who helped you.", "My … helped me with …", ["exactly one sentence", "me, not myself", "a different subject"]],
  ["Write one sentence about a small accident at home.", "I burned myself on …", ["exactly one sentence", "a -self word", "a past verb"]],
  ["Write one sentence about a person in your family who bought something for themselves.", "My … bought himself / herself …", ["exactly one sentence", "himself or herself", "no hisself"]],
  ["Write two sentences: one with myself and one with me.", "I hurt myself. / My friend helped me.", ["exactly two sentences", "myself with I", "me with another subject"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Write about a skill you learned on your own.", "I taught myself to … I watched videos … My friend helped me …", ["myself", "me with another subject", "three or four sentences"]],
  ["Write about a small accident you had.", "I fell and hurt myself … My mum took me to …", ["myself", "me", "three or four sentences"]],
  ["Write a message to a friend who is travelling alone.", "Look after yourself … Enjoy yourself … Call me …", ["yourself", "me", "three or four sentences"]],
  ["Describe a party or holiday with your family.", "We enjoyed ourselves … My uncle made himself … They invited us …", ["ourselves / himself", "us", "three or four sentences"]],
  ["Introduce yourself to a new group.", "Let me introduce myself … I taught myself … You can ask me …", ["myself", "me", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.reflexive.reflexive-object.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);