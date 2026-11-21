// Hand-authored: sentence-structure / relative-clauses / object-relative-omission (B1).
// Wave C, C13 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: an OBJECT relative pronoun can be left out ("The book I
// bought yesterday is excellent"); where / what are impossible for a thing.
// A2 siblings who-people / that-which-things key the relative word itself;
// this topic is about leaving it out, and when you can't:
//   - object relative: that / which / who / nothing all work;
//   - subject relative: the word must stay ("The man who lives next door");
//   - no extra pronoun inside the clause ("the film we watched it" is the
//     Uzbek / Russian resumptive-pronoun transfer), never what after a noun.
// Choose: 7 "which option is NOT possible" (where / what / which-for-people
// is the one wrong), 7 object clauses (key = no pronoun; distractors: extra
// it / her / them, what, where or which-for-people; that / which are never
// offered so there is one right answer), 6 subject clauses (key = who /
// which + verb; distractors: no pronoun, extra pronoun, what).
// Build: rule 11 (no typed zero key) → subject relatives only, "Write who or
// which", each accepting that: the gap where the word can NOT be left out.
// Transform: 5 leave the word out / 5 join two sentences without it /
// 5 correct (extra pronoun, what, missing subject relative).
//
// Run: node tools/grammar-practice/authored/sentence-structure.relative-clauses.object-relative-omission.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "relative-clauses", topic: "object-relative-omission", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const EVENT = ["party", "wedding", "concert", "meeting"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const JOB = ["doctor", "teacher", "pilot", "driver"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const NP = "Which option is NOT possible here?";
const NP_VARY = [NP, "One option is wrong. Which one?", "Which word can't go in the gap?", "Three options work. Find the one that doesn't.", "Pick the option that is NOT correct.", "Only one option is wrong. Choose it.", "Which of these can't fill the gap?"];
const W_WHERE = "The noun is the object of the verb, so that, which or nothing all work. Where is only for places you are in (where I live), not for a thing you bought or saw.";
const W_WHAT = "That, which or nothing all work after a noun. What can't follow a noun: the film what we watched is wrong.";
const W_WHICH = "For people use who or that, or leave the word out. Which is for things.";
const W_OBJ = "The noun is the object of the clause, so you can leave out the relative word: the film we saw. Don't add it / him / them again, and never use what or where here.";
const W_SUBJ = "Here the relative word is the subject of its clause (someone lives next door), so it can't be left out: who for people, which (or that) for things. No extra he / it after it.";

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  // which option is NOT possible (7)
  [W_WHERE, ["where", "that", "which", "(nothing)"], `${NP} The {thing} ______ I bought {when} is great, {name}.`, { thing: ["jacket", "phone", "bike", "lamp"], when: PAST, name: NAME }],
  [W_WHAT, ["what", "that", "which", "(nothing)"], `${NP} The {film} ______ we watched last night was very long, {name}.`, { film: ["film", "match", "show", "cartoon"], name: NAME }],
  [W_WHICH, ["which", "who", "that", "(nothing)"], `${NP} The {who} ______ we met at the {event} was very kind.`, { who: ["woman", "man", "girl", "boy"], event: EVENT }],
  [W_WHERE, ["where", "that", "which", "(nothing)"], `${NP} The {thing} ______ my grandmother gave me is very old, {name}.`, { thing: ["ring", "clock", "carpet", "teapot"], name: NAME }],
  [W_WHICH, ["which", "who", "that", "(nothing)"], `${NP} The {who} ______ I called yesterday didn't answer, {name}.`, { who: ["doctor", "plumber", "teacher", "taxi driver"], name: NAME }],
  [W_WHAT, ["what", "that", "which", "(nothing)"], `${NP} The {food} ______ Dad cooked tonight was delicious, {name}.`, { food: ["plov", "soup", "fish", "pasta"], name: NAME }],
  [W_WHERE, ["where", "that", "which", "(nothing)"], `${NP} The {thing} ______ you lent me is in my bag, {name}.`, { thing: ["book", "pen", "charger", "umbrella"], name: NAME }],
  // object clause, word left out (7)
  [W_OBJ, ["I wanted", "I wanted it", "what I wanted", "where I wanted"], "The {thing} ______ was too expensive, {name}.", { thing: ["dress", "phone", "watch", "sofa"], name: NAME }],
  [W_OBJ, ["we saw", "we saw it", "what we saw", "where we saw"], "The {film} ______ was really funny, {name}.", { film: ["film", "show", "cartoon", "play"], name: NAME }],
  [W_OBJ, ["you met", "you met her", "what you met", "which you met"], "The {who} ______ yesterday is my new neighbour, {name}.", { who: ["woman", "girl", "lady", "student"], name: NAME }],
  [W_OBJ, ["you lost", "you lost it", "what you lost", "where you lost"], "Is this the {thing} ______, {name}?", { thing: ["key", "phone", "ring", "wallet"], name: NAME }],
  [W_OBJ, ["we had", "we had it", "what we had", "where we had"], "The {meal} ______ in {city} was the best part of the trip.", { meal: ["plov", "dinner", "food", "breakfast"], city: CITY }],
  [W_OBJ, ["you gave me", "you gave me it", "what you gave me", "where you gave me"], "I love the {gift} ______, {name}.", { gift: ["scarf", "watch", "book", "card"], name: NAME }],
  [W_OBJ, ["we stayed with", "we stayed with them", "what we stayed with", "which we stayed with"], "The {who} ______ in {city} were really friendly.", { who: ["people", "hosts", "neighbours", "students"], city: CITY }],
  // subject clause, word stays (6)
  [W_SUBJ, ["who lives", "lives", "who he lives", "what lives"], "The {who} ______ next door is a {job}, {name}.", { who: ["man", "old man", "young man", "gentleman"], job: JOB, name: NAME }],
  [W_SUBJ, ["which is", "is", "which it is", "what is"], "The {thing} ______ on the table is mine, {name}.", { thing: ["phone", "bag", "book", "cup"], name: NAME }],
  [W_SUBJ, ["who lives", "lives", "who she lives", "what lives"], "I have an {who} ______ in {city}.", { who: ["aunt", "older sister", "old friend", "elderly aunt"], city: CITY }],
  [W_SUBJ, ["which goes", "goes", "which it goes", "what goes"], "The bus ______ to the {place} leaves at {time}.", { place: ["airport", "station", "bazaar", "old town"], time: ["seven", "eight", "nine", "ten"] }],
  [W_SUBJ, ["who won", "won", "who they won", "what won"], "The {who} ______ the match got a prize, {name}.", { who: ["boys", "girls", "players", "students"], name: NAME }],
  [W_SUBJ, ["which broke", "broke", "which it broke", "what broke"], "The {thing} ______ yesterday has been fixed, {name}.", { thing: ["lift", "printer", "computer", "fridge"], name: NAME }],
].map(([why, opts, prompt0, slots], i) => {
  const options = rot(opts, i);
  const prompt = prompt0.replace(NP, NP_VARY[i % NP_VARY.length]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill (subject relatives) ---------------- */
const INSTR_B = "Write who or which. Here the word can't be left out.";
const BUILD = [
  ["who", "The {who} ______ helped me {when} was very kind, {name}.", { who: ["woman", "man", "doctor", "nurse"], when: PAST, name: NAME }],
  ["who", "I know a {who} ______ speaks five languages, {name}.", { who: ["girl", "man", "teacher", "student"], name: NAME }],
  ["who", "The children ______ won the {comp} got a medal, {name}.", { comp: ["race", "quiz", "match", "contest"], name: NAME }],
  ["who", "My uncle is the man ______ fixed our {thing}, {name}.", { thing: ["car", "roof", "TV", "fridge"], name: NAME }],
  ["who", "Do you know the {who} ______ lives above us, {name}?", { who: ["woman", "man", "student", "girl"], name: NAME }],
  ["who", "The {who} ______ teaches us maths is from {city}.", { who: ["teacher", "woman", "man", "lady"], city: CITY }],
  ["who", "People ______ eat a lot of {food} are often healthy, {name}.", { food: ["fruit", "vegetables", "fish", "nuts"], name: NAME }],
  ["who", "The {who} ______ called you {when} left a message, {name}.", { who: ["man", "woman", "girl", "boy"], when: PAST, name: NAME }],
  ["who", "She is the {who} ______ sings at every {event}.", { who: ["girl", "woman", "singer", "student"], event: EVENT }],
  ["who", "The tourists ______ came to {city} {when} loved the food.", { city: CITY, when: ["last year", "in May", "last week", "in summer"] }],
  ["which", "The {thing} ______ broke {when} was very old, {name}.", { thing: ["chair", "cup", "lamp", "window"], when: PAST, name: NAME }],
  ["which", "I like {kind} ______ have a happy ending, {name}.", { kind: ["films", "books", "stories", "songs"], name: NAME }],
  ["which", "The bus ______ goes to the {place} is number {n}.", { place: ["airport", "station", "bazaar", "museum"], n: ["five", "seven", "twelve", "forty"] }],
  ["which", "This is the {thing} ______ costs a lot, {name}.", { thing: ["phone", "laptop", "bike", "watch"], name: NAME }],
  ["which", "The {shop} ______ opened {when} sells great bread.", { shop: ["bakery", "shop", "café", "market"], when: ["last week", "in May", "last month", "on Monday"] }],
  ["which", "We stayed in a hotel ______ had a big {thing}, {name}.", { thing: ["pool", "garden", "terrace", "restaurant"], name: NAME }],
  ["which", "The {thing} ______ is in the kitchen belongs to Grandma, {name}.", { thing: ["cup", "teapot", "basket", "radio"], name: NAME }],
  ["which", "I need a {thing} ______ works without the internet, {name}.", { thing: ["map", "phone app", "game", "dictionary"], name: NAME }],
  ["which", "The {thing} ______ fell from the tree hit our {what}.", { thing: ["apple", "branch", "ball", "nut"], what: ["car", "roof", "window", "dog"] }],
  ["which", "Plants ______ grow {place} need a lot of water, {name}.", { place: ["in the garden", "near the window", "in our yard", "on the balcony"], name: NAME }],
].map(([key, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, acceptable: ["that"], why: W_SUBJ, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const OUT = "Leave out the relative word.";
const JOIN = "Join the two sentences. Leave out the relative word.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // leave the word out (5)
  [OUT, "The {thing} that we watched was boring, {name}.", "The {thing} ______ was boring, {name}.", "we watched", W_OBJ, { thing: ["film", "match", "show", "play"], name: NAME }],
  [OUT, "The {who} who I met at the {event} was {adj}.", "The {who} ______ at the {event} was {adj}.", "I met", W_OBJ, { who: ["woman", "man", "girl", "guy"], event: EVENT, adj: ["friendly", "funny", "nice", "interesting"] }],
  [OUT, "Is this the {thing} which you bought {when}, {name}?", "Is this the {thing} ______ {when}, {name}?", "you bought", W_OBJ, { thing: ["bag", "lamp", "jacket", "rug"], when: PAST, name: NAME }],
  [OUT, "The {food} that Grandma cooks is the best, {name}.", "The {food} ______ is the best, {name}.", "Grandma cooks", W_OBJ, { food: ["plov", "soup", "bread", "samsa"], name: NAME }],
  [OUT, "The people that we visited in {city} were very kind, {name}.", "The people ______ in {city} were very kind, {name}.", "we visited", W_OBJ, { city: CITY, name: NAME }],
  // join (5)
  [JOIN, "I bought a {thing} {when}. It was cheap.", "The {thing} ______ {when} was cheap.", "I bought", W_OBJ, { thing: ["jacket", "lamp", "bike", "bag"], when: PAST }],
  [JOIN, "You recommended a {thing}. I loved it, {name}.", "I loved the {thing} ______, {name}.", "you recommended", W_OBJ, { thing: ["book", "film", "café", "song"], name: NAME }],
  [JOIN, "We met a {who} on the train. She was from {city}.", "The {who} ______ on the train was from {city}.", "we met", W_OBJ, { who: ["woman", "girl", "lady", "student"], city: CITY }],
  [JOIN, "My friend took some {photos}. They are beautiful, {name}.", "The {photos} ______ are beautiful, {name}.", "my friend took", W_OBJ, { photos: ["photos", "pictures", "videos", "selfies"], name: NAME }],
  [JOIN, "Dad told a {story}. Everyone laughed at it, {name}.", "Everyone laughed at the {story} ______, {name}.", "Dad told", W_OBJ, { story: ["story", "joke", "riddle", "tale"], name: NAME }],
  // correct (5)
  [COR, "The {thing} I bought it {when} was {adj}.", "The {thing} ______ {when} was {adj}.", "I bought", W_OBJ, { thing: ["phone", "bike", "jacket", "lamp"], when: PAST, adj: ["broken", "too small", "expensive", "great"] }, ["that I bought", "which I bought"]],
  [COR, "The {who} we met him at the {event} is a doctor.", "The {who} ______ at the {event} is a doctor.", "we met", W_OBJ, { who: ["man", "old man", "young man", "gentleman"], event: EVENT }, ["who we met", "that we met"]],
  [COR, "The museum what we visited in {city} was closed, {name}.", "The museum ______ in {city} was closed, {name}.", "we visited", W_OBJ, { city: CITY, name: NAME }, ["that we visited", "which we visited"]],
  [COR, "The woman lives next door is a {job}, {name}.", "The woman ______ next door is a {job}, {name}.", "who lives", W_SUBJ, { job: JOB, name: NAME }, ["that lives"]],
  [COR, "The train leaves at {time} is the fastest, {name}.", "The train ______ at {time} is the fastest, {name}.", "which leaves", W_SUBJ, { time: ["six", "seven", "eight", "nine"], name: NAME }, ["that leaves"]],
].map(([instr, source, hint, key, why, slots, acceptable = []]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a film you saw. Leave out the relative word.", "The film I saw … was …", ["exactly one sentence", "noun + subject + verb, no that / which", "no it in the clause"]],
  ["Write one sentence about a present someone gave you. Leave out the relative word.", "The … my … gave me is …", ["exactly one sentence", "no relative word", "no it in the clause"]],
  ["Write one sentence about a person you met recently. Leave out the relative word.", "The … I met … was …", ["exactly one sentence", "no who / that", "no him / her in the clause"]],
  ["Write one sentence about food someone in your family cooks.", "The … my mum cooks is …", ["exactly one sentence", "no relative word", "present simple"]],
  ["Write one sentence about a neighbour, using who as the subject of the clause.", "The man who lives … is …", ["exactly one sentence", "who + verb", "who can't be left out here"]],
  ["Write one sentence about a place you visited. Leave out the relative word.", "The … we visited in … was …", ["exactly one sentence", "no where", "no it in the clause"]],
  ["Write one sentence about something you lost.", "The … I lost … was …", ["exactly one sentence", "no relative word", "a past verb"]],
  ["Write two sentences: one where the relative word is left out and one where it must stay.", "The book I read … / The girl who sits …", ["exactly two sentences", "one object clause with no relative word", "one subject clause with who or which"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe the best trip you have had: the places you saw and the food you ate.", "The food we ate in … was … The people we met …", ["relative clauses with no relative word", "no extra it / them", "three or four sentences"]],
  ["Describe some presents you got for your last birthday.", "The … my sister gave me is … The … I liked most …", ["relative clauses with no relative word", "past verbs", "three or four sentences"]],
  ["Write a short review of a book or film you liked.", "The film I watched … The actor who plays …", ["object clauses with no relative word", "one subject clause with who or which", "three or four sentences"]],
  ["Describe the people you live near.", "The man who lives next door … The woman I see every morning …", ["who for subjects", "no relative word for objects", "three or four sentences"]],
  ["Write a message to a friend about things you bought in a new shop.", "The jacket I bought … The shop which opened …", ["object clauses with no relative word", "which or that for subjects", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.relative-clauses.object-relative-omission.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "A thing I bought: that, which or nothing work; where is for places.",
   "A film we watched: that, which or nothing work; never what after a noun.",
   "A person we met: who, that or nothing work; which is for things.",
   "Something Grandma gave me: that, which or nothing; where is for places.",
   "A person I called: who, that or nothing; which is for things.",
   "Food Dad cooked: that, which or nothing; never what after a noun.",
   "A thing you lent me: that, which or nothing; where is for places.",
   "I wanted it, so it's the object: leave out the word: I wanted.",
   "We saw it, so it's the object: just we saw.",
   "You met them, so the object: just you met.",
   "You lost it, so the object: just you lost.",
   "We had it, so the object: just we had.",
   "You gave it to me: the object: just you gave me.",
   "We stayed with them: the object, with stays at the end.",
   "The person does the living, so the subject: who lives.",
   "The thing does the being, so the subject: which is.",
   "The person does the living (subject): who lives.",
   "The bus does the going (subject): which goes.",
   "The person did the winning (subject): who won.",
   "The thing did the breaking (subject): which broke."
  ],
  "build": [
   "A person who did the helping: subject, so who.",
   "A person who speaks: subject, so who.",
   "Children who won: subject, so who.",
   "The man who fixed it: subject, so who.",
   "A person who lives above: subject, so who.",
   "A person who teaches: subject, so who.",
   "People who eat: subject, so who.",
   "A person who called: subject, so who.",
   "A person who sings: subject, so who.",
   "Tourists who came: subject, so who.",
   "A thing that broke: subject, so which.",
   "Stories that have an ending: subject, so which.",
   "A bus that goes: subject, so which.",
   "A thing that costs: subject, so which.",
   "A shop that opened: subject, so which.",
   "A hotel that had something: subject, so which.",
   "A thing that is in the kitchen: which.",
   "A thing that works: subject, so which.",
   "A thing that fell: subject, so which.",
   "Plants that grow: subject, so which."
  ],
  "transform": [
   "that is the object (we watched it): drop it.",
   "who is the object (I met them): drop it.",
   "which is the object (you bought it): drop it.",
   "that is the object (Grandma cooks it): drop it.",
   "that is the object (we visited them): drop it.",
   "Join the sentences: The … I bought.",
   "Join the sentences: the … you recommended.",
   "Join the sentences: The … we met.",
   "Join the sentences: The … my friend took.",
   "Join the sentences: the … Dad told.",
   "Don't repeat the object: I bought, not I bought it.",
   "Don't repeat the object: we met, not we met him.",
   "After a noun, never what: we visited.",
   "The woman is the subject: who lives can't be dropped.",
   "The train is the subject: which leaves can't be dropped."
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
console.log(`wrote ${out} — ${items.length} items`);