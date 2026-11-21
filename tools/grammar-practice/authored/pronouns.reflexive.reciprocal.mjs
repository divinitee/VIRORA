// Hand-authored: pronouns / reflexive / reciprocal (B1).
// Wave C, C22 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement focus: each other (A → B and B → A) vs themselves / ourselves
// (each person → the same person). "The two sisters often send ______ long
// messages" → each other.
// Learner errors: "They help themselves" for helping one another (Russian
// "друг другу" vs "себе" is clear, but Uzbek "bir-biriga" vs "o'zlariga" gets
// mixed), "each others", "They love them", "each other's" missing.
// Sibling reflexive-object (C23) keys myself / yourself when subject = object
// (one person). Here every subject is two or more people, and the reflexive
// keys (5 of 20) are only where each other is impossible: they fell and hurt
// themselves, burned themselves on a pan, locked ourselves out, behave
// yourselves. Never keyed: enjoy / look at / dress / teach + reflexive (each
// other would be right too). "one another" is accepted wherever each other is.
// Choose: 13 each other, 2 each other's, 5 reflexive. Options each other /
// themselves (ourselves) / them (us) / each others.
// Build: "Write each other or a -selves word." 14 / 6.
// Transform: 5 join two sentences / 5 correct to each other(s) / 5 correct to
// -selves.
//
// Run: node tools/grammar-practice/authored/pronouns.reflexive.reciprocal.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "reflexive", topic: "reciprocal", level: "B1", pv: "2.5" };
const BOY = ["Aziz", "Timur", "Bobur", "Jasur"];
const GIRL = ["Olga", "Lola", "Madina", "Kamila"];
const PAST = ["yesterday", "last night", "on Friday", "last week"];
const CITY = ["Samarkand", "Bukhara", "Khiva", "Termez"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const W_EO = "A does it to B and B does it to A, so use each other (two words, no -s). themselves would mean each person does it to himself or herself.";
const W_POS = "For things that belong to the other person, use each other's: They wear each other's clothes. Never each others.";
const W_SELF = "Here each person does it to himself or herself (nobody did it to the other), so use themselves / ourselves / yourselves.";
const OT = ["each other", "themselves", "them", "each others"];
const OU = ["each other", "ourselves", "us", "each others"];
const OP = ["each other's", "each others", "themselves", "each others'"]; // "their" removed by Claude's audit: "wear their clothes / know their secrets" is English
const ST = ["themselves", "each other", "them", "theirselves"];
const SU = ["ourselves", "our", "us", "ourself"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [OT, W_EO, "{b} helps {g} with maths, and {g} helps him with English. They help ______.", { b: BOY, g: GIRL }],
  [OT, W_EO, "The two sisters live in {city} and {town}. They phone ______ every {day}.", { city: ["Tashkent", "Andijan", "Nukus", "Jizzakh"], town: CITY, day: ["day", "evening", "Sunday", "week"] }],
  [OT, W_EO, "{b} and {g} met at university and have helped ______ with {what} ever since.", { b: BOY, g: GIRL, what: ["homework", "work", "exams", "everything"] }],
  [OU, W_EO, "My best friend and I tell ______ everything, {g}.", { g: GIRL }],
  [OT, W_EO, "When {b} and his cousin meet, they always hug ______.", { b: BOY }],
  [OT, W_EO, "The two teams shook hands with ______ after the {match}.", { match: ["match", "game", "final", "race"] }],
  [OU, W_EO, "{b} and I sat in silence and looked at ______ {how}.", { b: BOY, how: ["for a long time", "and smiled", "across the table", "in surprise"] }],
  [OT, W_EO, "The two brothers don't talk to ______ any more after the {fight}.", { fight: ["argument", "quarrel", "argument about money", "argument at the wedding"] }],
  [OT, W_EO, "{b} and {g} gave ______ presents for {event}.", { b: BOY, g: GIRL, event: ["New Year", "Navruz", "their birthdays", "the holiday"] }],
  [OU, W_EO, "My neighbour and I have known ______ for {n} years.", { n: ["ten", "twenty", "five", "many"] }],
  [OT, W_EO, "The two girls in the {place} were shouting at ______.", { place: ["street", "yard", "bus", "shop"] }],
  [OU, W_EO, "We send ______ photos from our trips, {g}.", { g: GIRL }],
  [OT, W_EO, "The players on our team pass the ball to ______ {when}.", { when: ["a lot", "every minute", "in big matches", "very well"] }],
  [OP, W_POS, "The twins often wear ______ clothes, {g}.", { g: GIRL }],
  [OP, W_POS, "{b} and his brother know ______ secrets.", { b: BOY }],
  [ST, W_SELF, "The boys fell off their bikes and hurt ______ {when}.", { when: PAST }],
  [ST, W_SELF, "The kids burned ______ on the hot {pan} in the kitchen.", { pan: ["pan", "pot", "oven", "kettle"] }],
  [SU, W_SELF, "We left the keys inside and locked ______ out of the {place}, {g}.", { place: ["house", "flat", "car", "office"], g: GIRL }],
  [["yourselves", "each other", "you", "yourself"], W_SELF, "Behave ______ at Grandma's {event}, children!", { event: ["party", "house", "birthday", "wedding"] }],
  [SU, W_SELF, "Did we hurt ______ when we slipped on the {surface}, one after the other? No, we're fine.", { surface: ["ice", "stairs", "wet floor", "path"] }],
].map(([opts, why, prompt, slots], i) => {
  const options = rot(opts, i);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(opts[0]), why, slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write each other or a -selves word (themselves, ourselves, yourselves).";
const EO = ["one another"];
const BUILD = [
  ["each other", W_EO, "{b} and {g} write to ______ every {day}.", { b: BOY, g: GIRL, day: ["day", "week", "month", "evening"] }, EO],
  ["each other", W_EO, "My parents have loved ______ for {n} years.", { n: ["thirty", "twenty", "forty", "many"] }, EO],
  ["each other", W_EO, "The two old friends hugged ______ at the {place}.", { place: ["station", "airport", "door", "bus stop"] }, EO],
  ["each other", W_EO, "We sometimes help ______ with our {work}, {g}.", { work: ["homework", "projects", "English", "essays"], g: GIRL }, EO],
  ["each other", W_EO, "{b} and his sister don't understand ______ at all.", { b: BOY }, EO],
  ["each other", W_EO, "The students in my group often call ______ in the {time}.", { time: ["evening", "morning", "afternoon", "holidays"] }, EO],
  ["each other", W_EO, "The two cats in the {place} were looking at ______.", { place: ["yard", "garden", "street", "kitchen"] }, EO],
  ["each other", W_EO, "{b} and {g} bought ______ flowers {when}.", { b: BOY, g: GIRL, when: PAST }, EO],
  ["each other", W_EO, "My cousin and I see ______ at every {event}.", { event: ["wedding", "birthday", "holiday", "family dinner"] }, EO],
  ["each other", W_EO, "Our two {who} don't like ______, so they never visit.", { who: ["grandmas", "neighbours", "uncles", "aunts"] }, EO],
  ["each other", W_EO, "The two teams thanked ______ after the {match}.", { match: ["match", "game", "final", "race"] }, EO],
  ["each other", W_EO, "{b} and {g} stood and smiled at ______.", { b: BOY, g: GIRL }, EO],
  ["each other's", W_POS, "We often borrow ______ books, {g}.", { g: GIRL }, ["one another's"]],
  ["each other's", W_POS, "{b} and his friend always copy ______ homework.", { b: BOY }, ["one another's"]],
  ["themselves", W_SELF, "The two boys fell on the {surface} and hurt ______.", { surface: ["ice", "stairs", "wet floor", "path"] }, []],
  ["themselves", W_SELF, "The children cut ______ on the broken {thing}.", { thing: ["glass", "window", "bottle", "plate"] }, []],
  ["ourselves", W_SELF, "We locked ______ out of the {place} {when}.", { place: ["house", "flat", "car", "office"], when: PAST }, []],
  ["yourselves", W_SELF, "Behave ______ at the {event}, boys!", { event: ["party", "wedding", "museum", "concert"] }, []],
  ["yourselves", W_SELF, "Did you two burn ______ on the {pan}? Show me your hands.", { pan: ["pan", "pot", "oven", "kettle"] }, []],
  ["ourselves", W_SELF, "Did we lock ______ out again, {g}? Where are the keys?", { g: GIRL }, []],
].map(([key, why, source, slots, acceptable]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source, slots) }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences with each other.";
const COR = "Correct the mistake.";
const TRANSFORM = [
  // join (5)
  [JOIN, "{b} helps {g}. {g} helps {b}.", "{b} and {g} help ______.", "each other", W_EO, { b: BOY, g: GIRL }, EO],
  [JOIN, "My mum calls my aunt. My aunt calls my mum every {day}.", "My mum and my aunt call ______ every {day}.", "each other", W_EO, { day: ["day", "evening", "Sunday", "week"] }, EO],
  [JOIN, "{b} looked at {g}. {g} looked at {b}.", "{b} and {g} looked at ______.", "each other", W_EO, { b: BOY, g: GIRL }, EO],
  [JOIN, "I trust my brother. My brother trusts me, {g}.", "My brother and I trust ______, {g}.", "each other", W_EO, { g: GIRL }, EO],
  [JOIN, "{b} sent {g} a message {when}. {g} sent {b} a message too.", "{b} and {g} sent ______ messages {when}.", "each other", W_EO, { b: BOY, g: GIRL, when: PAST }, EO],
  // correct -> each other / each other's (5)
  [COR, "{b} and {g} phone themselves every evening.", "{b} and {g} phone ______ every evening.", "each other", W_EO, { b: BOY, g: GIRL }, EO],
  [COR, "We see us every {day} at {place}.", "We see ______ every {day} at {place}.", "each other", W_EO, { day: ["day", "morning", "week", "Monday"], place: ["school", "work", "the gym", "the bazaar"] }, EO],
  [COR, "The two brothers talk to each others {when}.", "The two brothers talk to ______ {when}.", "each other", W_EO, { when: ["every day", "on the phone", "in the evening", "a lot"] }, EO],
  [COR, "The twins wear each others clothes, {g}.", "The twins wear ______ clothes, {g}.", "each other's", W_POS, { g: GIRL }, ["one another's"]],
  [COR, "{b} and I helped ourselves with the {work} {when}.", "{b} and I helped ______ with the {work} {when}.", "each other", W_EO, { b: BOY, work: ["homework", "project", "move", "cooking"], when: PAST }, EO],
  // correct -> -selves (5)
  [COR, "The boys fell and hurt each other {when}.", "The boys fell and hurt ______ {when}.", "themselves", W_SELF, { when: PAST }, []],
  [COR, "We locked us out of the {place}, {g}.", "We locked ______ out of the {place}, {g}.", "ourselves", W_SELF, { place: ["house", "flat", "car", "office"], g: GIRL }, []],
  [COR, "Behave yourself, children! We are at the {place}.", "Behave ______, children! We are at the {place}.", "yourselves", W_SELF, { place: ["museum", "theatre", "hospital", "library"] }, []],
  [COR, "The kids burned each other on the hot {pan}.", "The kids burned ______ on the hot {pan}.", "themselves", W_SELF, { pan: ["pan", "pot", "oven", "kettle"] }, []],
  [COR, "Did you two hurt you on the {surface}?", "Did you two hurt ______ on the {surface}?", "yourselves", W_SELF, { surface: ["ice", "stairs", "wet floor", "path"] }, []],
].map(([instr, source, hint, key, why, slots, acceptable]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable.length ? { acceptable } : {}), why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about two people in your family who help each other.", "My … and my … help each other with …", ["exactly one sentence", "each other", "two people"]],
  ["Write one sentence about how often you and a friend see each other.", "My friend and I see each other …", ["exactly one sentence", "each other", "a time word"]],
  ["Write one sentence about two people who borrow each other's things.", "… borrow each other's …", ["exactly one sentence", "each other's", "a plural noun"]],
  ["Write one sentence about two people who don't like each other.", "… don't like each other because …", ["exactly one sentence", "each other", "a negative verb"]],
  ["Write one sentence about people who hurt themselves.", "They fell and hurt themselves.", ["exactly one sentence", "themselves", "no each other"]],
  ["Write one sentence about two friends who send each other something.", "… send each other …", ["exactly one sentence", "each other", "a present verb"]],
  ["Write one sentence about two friends who help each other.", "They help each other with …", ["exactly one sentence", "each other", "past verbs"]],
  ["Write two sentences: one with each other and one with themselves.", "They helped each other. / They hurt themselves.", ["exactly two sentences", "each other", "themselves"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your friendship with your best friend.", "We have known each other for … We tell each other … We help each other …", ["each other", "each other's", "three or four sentences"]],
  ["Describe two people in your family and how they get on.", "They phone each other … They never argue with each other …", ["each other", "present verbs", "three or four sentences"]],
  ["Write about a team or group that works well together.", "The players trust each other … They help each other …", ["each other", "a group of people", "three or four sentences"]],
  ["Write about a small accident at home or at school.", "Two children fell and hurt themselves … The others helped each other …", ["themselves", "each other", "three or four sentences"]],
  ["Describe how two neighbours became friends.", "At first they didn't know each other … Now they visit each other …", ["each other", "past and present", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.reflexive.reciprocal.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "He helps her and she helps him: each other.",
   "Each sister phones the other: each other.",
   "Each one helps the other: each other.",
   "I tell my friend and my friend tells me: each other.",
   "Each one hugs the other: each other.",
   "Each side shakes the other side's hand: each other.",
   "I looked at him and he looked at me: each other.",
   "Neither talks to the other: each other.",
   "Each one gave the other a present: each other.",
   "I know my … and my … knows me: each other.",
   "Each girl shouted at the other: each other.",
   "I send to you and you send to me: each other.",
   "Each player passes to another: each other.",
   "… that belong to the other twin: each other's.",
   "… that belong to the other: each other's.",
   "Each boy hurt his own body: themselves.",
   "Each kid burned his or her own hand: themselves.",
   "We locked our own selves out: ourselves.",
   "Talking to children, plural you: yourselves.",
   "Each of us, our own bodies: ourselves."
  ],
  "build": [
   "Each one writes to the other: each other.",
   "Each parent loves the other: each other.",
   "Each friend hugged the other: each other.",
   "I help you and you help me: each other.",
   "Neither understands the other: each other.",
   "Each student calls another: each other.",
   "Each cat looked at the other: each other.",
   "Each one bought the other flowers: each other.",
   "I see my … and my … sees me: each other.",
   "Neither likes the other: each other.",
   "Each team … the other: each other.",
   "Each one smiled at the other: each other.",
   "… that belong to the other: each other's.",
   "… that belongs to the other: each other's.",
   "They fell and each one got hurt: themselves.",
   "Each child cut his or her own hand: themselves.",
   "\"We locked … out\": the doors shut on us: ourselves.",
   "Talking to …, plural you: yourselves.",
   "\"you two\": plural you, own hands: yourselves.",
   "Our own selves locked out: ourselves."
  ],
  "transform": [
   "A helps B, B helps A: each other.",
   "A calls B, B calls A: each other.",
   "A looked at B, B looked at A: each other.",
   "I trust him, he trusts me: each other.",
   "A sent B, B sent A: each other.",
   "Two people phone the other one: each other, not themselves.",
   "Two-way action: each other, not us.",
   "No -s on other: each other.",
   "Belonging: each other's, with 's.",
   "Two-way help: each other, not ourselves.",
   "Each boy hurt his own body: themselves, not each other.",
   "We, our own selves: ourselves, not us.",
   "Talking to many …: yourselves, not yourself.",
   "Not one hurting the other: each one burned a hand: themselves.",
   "\"you two\": yourselves, not you."
  ]
 },
 "slot": [
  [
   "choose",
   4,
   "everything",
   "what",
   [
    "everything",
    "secrets",
    "jokes",
    "stories"
   ]
  ],
  [
   "choose",
   5,
   "cousin",
   "rel",
   [
    "cousin",
    "brother",
    "uncle",
    "friend"
   ]
  ],
  [
   "choose",
   6,
   "teams",
   "grp",
   [
    "teams",
    "coaches",
    "captains",
    "players"
   ]
  ],
  [
   "choose",
   8,
   "brothers",
   "rel",
   [
    "brothers",
    "sisters",
    "cousins",
    "friends"
   ]
  ],
  [
   "choose",
   10,
   "neighbour",
   "who",
   [
    "neighbour",
    "teacher",
    "cousin",
    "best friend"
   ]
  ],
  [
   "choose",
   11,
   "girls",
   "kids",
   [
    "girls",
    "boys",
    "women",
    "men"
   ]
  ],
  [
   "choose",
   12,
   "photos",
   "what",
   [
    "photos",
    "videos",
    "postcards",
    "messages"
   ]
  ],
  [
   "choose",
   13,
   "players",
   "who",
   [
    "players",
    "girls",
    "boys",
    "kids"
   ]
  ],
  [
   "choose",
   14,
   "clothes",
   "what",
   [
    "clothes",
    "shoes",
    "hats",
    "jackets"
   ]
  ],
  [
   "choose",
   15,
   "secrets",
   "what",
   [
    "secrets",
    "plans",
    "dreams",
    "phone numbers"
   ]
  ],
  [
   "choose",
   16,
   "bikes",
   "veh",
   [
    "bikes",
    "scooters",
    "skateboards",
    "horses"
   ]
  ],
  [
   "choose",
   17,
   "kids",
   "kids",
   [
    "kids",
    "children",
    "boys",
    "girls"
   ]
  ],
  [
   "choose",
   19,
   "Grandma",
   "rel",
   [
    "Grandma",
    "Grandpa",
    "Auntie",
    "Uncle"
   ]
  ],
  [
   "choose",
   20,
   "slipped",
   "act",
   [
    "slipped",
    "fell",
    "tripped",
    "slid"
   ]
  ],
  [
   "build",
   2,
   "loved",
   "verb",
   [
    "loved",
    "known",
    "helped",
    "trusted"
   ]
  ],
  [
   "build",
   3,
   "friends",
   "who",
   [
    "friends",
    "teachers",
    "neighbours",
    "classmates"
   ]
  ],
  [
   "build",
   5,
   "sister",
   "rel",
   [
    "sister",
    "brother",
    "cousin",
    "friend"
   ]
  ],
  [
   "build",
   6,
   "call",
   "verb",
   [
    "call",
    "text",
    "message",
    "phone"
   ]
  ],
  [
   "build",
   7,
   "cats",
   "an",
   [
    "cats",
    "dogs",
    "birds",
    "horses"
   ]
  ],
  [
   "build",
   9,
   "cousin",
   "rel",
   [
    "cousin",
    "uncle",
    "aunt",
    "neighbour"
   ]
  ],
  [
   "build",
   11,
   "thanked",
   "verb",
   [
    "thanked",
    "congratulated",
    "hugged",
    "greeted"
   ]
  ],
  [
   "build",
   13,
   "books",
   "what",
   [
    "books",
    "pens",
    "notes",
    "bikes"
   ]
  ],
  [
   "build",
   14,
   "homework",
   "what",
   [
    "homework",
    "answers",
    "notes",
    "drawings"
   ]
  ],
  [
   "build",
   15,
   "boys",
   "kids",
   [
    "boys",
    "girls",
    "children",
    "players"
   ]
  ],
  [
   "build",
   16,
   "children",
   "kids",
   [
    "children",
    "kids",
    "boys",
    "girls"
   ]
  ],
  [
   "build",
   18,
   "boys",
   "kids",
   [
    "boys",
    "girls",
    "children",
    "kids"
   ]
  ],
  [
   "transform",
   2,
   "aunt",
   "rel",
   [
    "aunt",
    "sister",
    "grandma",
    "friend"
   ]
  ],
  [
   "transform",
   4,
   "brother",
   "rel",
   [
    "brother",
    "sister",
    "cousin",
    "dad"
   ]
  ],
  [
   "transform",
   8,
   "brothers",
   "rel",
   [
    "brothers",
    "sisters",
    "cousins",
    "twins"
   ]
  ],
  [
   "transform",
   9,
   "clothes",
   "what",
   [
    "clothes",
    "shoes",
    "hats",
    "jackets"
   ]
  ],
  [
   "transform",
   11,
   "boys",
   "kids",
   [
    "boys",
    "girls",
    "children",
    "players"
   ]
  ],
  [
   "transform",
   13,
   "children",
   "kids",
   [
    "children",
    "kids",
    "boys",
    "girls"
   ]
  ],
  [
   "transform",
   14,
   "kids",
   "kids",
   [
    "kids",
    "children",
    "boys",
    "girls"
   ]
  ]
 ]
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