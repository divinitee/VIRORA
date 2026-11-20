// Hand-authored: tenses / past / past-perfect-sequence (B1).
// Wave C, Claude lane (2026-11-20, branch grammar-wave-c-claude).
//
// Tests ONE point (placement items): the PAST PERFECT (had + past participle)
// for the EARLIER of two past events: by the time / when + past simple, and
// already ("When we got to the station, the train had already left").
// Triage: kept. Sibling past-perfect-experience owns "had never … before"
// (first-time experience), so no never / ever here. Past perfect continuous
// and past perfect passive are B2.
//
// One right answer. Never offered: "was leaving" ("the train was leaving" is
// fine English), the past simple (with already or after, natives often use it),
// before / after clauses (they make the order clear, so the past simple is also
// right). Choose options are one irregular verb in four shapes: had + participle
// (key) / has + participle / had + past simple / had + base (had gone / has gone /
// had went / had go), so only verbs whose past and participle differ.
// Build: "had + participle" typed; no source prints had.
// Transform: 5 join two sentences / 5 correct the mistake / 5 rewrite with
// already (two blanks: ["had", "left"] around a printed already).
//
// Run: node tools/grammar-practice/authored/tenses.past.past-perfect-sequence.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "past", topic: "past-perfect-sequence", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const NAME_F = ["Madina", "Olga", "Sevara", "Nilufar"];
const NAME_M = ["Sardor", "Timur", "Ilya", "Jasur"];
const WHY = (pp) => `This happened before the other past action, so use the past perfect: had + past participle, ${pp}.`;

/* ---------------- choose: 20 mcq ---------------- */
// [base, past, participle, prompt, slots]
const CHOOSE = [
  ["go", "went", "gone", "By the time we got to the {stop}, the {transport} ______.", { stop: ["station", "bus stop", "corner", "main road"], transport: ["bus", "last bus", "minibus", "school bus"] }],
  ["eat", "ate", "eaten", "When I got home, my brothers ______ all the {food}, {name}.", { food: ["plov", "cake", "samsa", "bread"], name: NAME }],
  ["begin", "began", "begun", "The film ______ when we arrived at the {place}, so we missed the start.", { place: ["cinema", "club", "hall", "theatre"], x: [] }],
  ["forget", "forgot", "forgotten", "{name} couldn't open the door because she ______ her {thing} at school.", { name: NAME_F, thing: ["keys", "key", "key card", "bag with the keys"] }],
  ["see", "saw", "seen", "I didn't go to the cinema with them because I ______ the film {when}.", { when: ["the week before", "on TV", "twice", "with my cousins"], x: [] }],
  ["break", "broke", "broken", "My {who} was upset because someone ______ his {thing}.", { who: ["brother", "father", "cousin", "uncle"], thing: ["phone", "glasses", "bike", "camera"] }],
  ["write", "wrote", "written", "By the time the teacher came back, {name} ______ three {thing}.", { name: NAME, thing: ["pages", "answers", "paragraphs", "emails"] }],
  ["take", "took", "taken", "When we reached the {place}, someone ______ our table, {name}.", { place: ["café", "restaurant", "canteen", "kebab house"], name: NAME }],
  ["fall", "fell", "fallen", "The roads were white because a lot of snow ______ in the {time}.", { time: ["night", "morning", "evening", "afternoon"], x: [] }],
  ["speak", "spoke", "spoken", "By the time the {event} started, the {who} ______ to every player.", { event: ["match", "game", "final", "training"], who: ["coach", "captain", "manager", "team doctor"] }],
  ["give", "gave", "given", "When I asked for a ticket, they ______ all the {thing} away, {name}.", { thing: ["tickets", "seats", "free books", "places"], name: NAME }],
  ["wake", "woke", "woken", "When the {alarm} rang at {time}, I ______ up already.", { alarm: ["alarm", "phone", "clock"], time: ["six", "five", "seven", "half past six"] }],
  ["do", "did", "done", "{name} could go out because she ______ all her {task}.", { name: NAME_F, task: ["homework", "chores", "exercises", "work"] }],
  ["swim", "swam", "swum", "By the time the lifeguard arrived, {name} ______ back to the {place}.", { name: NAME_M, place: ["beach", "boat", "shore", "side of the pool"] }],
  ["grow", "grew", "grown", "When I visited my old {place} {when}, the trees ______ very tall.", { place: ["school", "village", "street", "neighbourhood"], when: ["last year", "in the summer", "in the spring", "last month"] }],
  ["know", "knew", "known", "I recognised {name} at once because I ______ him since {time}.", { name: NAME_M, time: ["school", "childhood", "primary school", "we were six"] }],
  ["drink", "drank", "drunk", "By the time I came back with the cups, my guests ______ all the {drink}.", { drink: ["tea", "juice", "water", "lemonade"], x: [] }],
  ["choose", "chose", "chosen", "When we got to the {shop}, my sister ______ a {thing} already.", { shop: ["shop", "bazaar", "market", "mall"], thing: ["dress", "present", "cake", "phone"] }],
  ["ring", "rang", "rung", "I was late: when I got to {school}, the {bell} ______.", { school: ["school", "college", "the lyceum", "my lesson"], bell: ["bell", "first bell", "school bell"] }],
  ["sing", "sang", "sung", "By the time we got to the {place}, the {group} ______ three songs.", { place: ["hall", "concert", "school", "club"], group: ["choir", "children", "band", "singers"] }],
].map(([v, past, pp, prompt, slots], i) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (prompt.includes(`{${n}}`)) s[n] = f;
  const opts = [`had ${pp}`, `has ${pp}`, `had ${past}`, `had ${v}`];
  const options = opts.map((_, j) => opts[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(`had ${pp}`), why: WHY(pp), slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write the verb in brackets in the past perfect (had + past participle).";
// [participle, source, slots]
const BUILD = [
  ["closed", "By the time we got to the {shop}, it ______ (close), {name}.", { shop: ["bakery", "bank", "post office", "pharmacy"], name: NAME }],
  ["started", "When I arrived at the {place}, the lesson ______ (start), {name}.", { place: ["school", "college", "language centre", "lyceum"], name: NAME }],
  ["lost", "My parents were angry because I ______ (lose) my {thing} {when}.", { thing: ["keys", "phone", "school bag", "bus card"], when: ["again", "that week", "on the bus", "at the market"] }],
  ["prepared", "By the time the guests arrived, we ______ (prepare) {food}.", { food: ["plov", "a big dinner", "three salads", "samsa"], x: [] }],
  ["worked", "{name} was tired because she ______ (work) all {time}.", { name: NAME_F, time: ["day", "night", "weekend", "morning"] }],
  ["bought", "When we got to the {place}, someone ______ (buy) the last tickets, {name}.", { place: ["cinema", "stadium", "theatre", "concert hall"], name: NAME }],
  ["stopped", "I couldn't finish my project because my {thing} ______ (stop) working, {name}.", { thing: ["laptop", "computer", "tablet", "printer"], name: NAME }],
  ["cleaned", "By the time my mum came home, I ______ (clean) the whole {room}.", { room: ["flat", "kitchen", "house", "bedroom"], x: [] }],
  ["finished", "When the teacher checked, {name} ______ (finish) the {test}.", { name: NAME, test: ["test", "exercise", "essay", "dictation"] }],
  ["drunk", "The {thing} was empty because my brother ______ (drink) all the {drink}.", { thing: ["bottle", "jug", "carton", "fridge"], drink: ["juice", "milk", "water", "lemonade"] }],
  ["been", "I knew the way because I ______ (be) there {n} times before, {name}.", { n: ["three", "four", "five", "many"], name: NAME }],
  ["left", "When we got to the {station}, the last train ______ (leave), {name}.", { station: ["station", "railway station"], name: NAME }],
  ["booked", "We didn't need a taxi because Dad ______ (book) a car for us {when}.", { when: ["the day before", "that morning", "online", "in advance"], x: [] }],
  ["gone", "By the time I found my {thing}, the {transport} ______ (go).", { thing: ["ticket", "passport", "bag", "phone"], transport: ["bus", "train", "plane", "minibus"] }],
  ["sold", "The shop assistant told us that they ______ (sell) the last {thing}.", { thing: ["bike", "phone", "jacket", "TV"], x: [] }],
  ["eaten", "When I opened the door, the cat ______ (eat) all the {food}, {name}.", { food: ["fish", "meat", "chicken", "sausages"], name: NAME }],
  ["caught", "{name} didn't come to the party because she ______ (catch) a cold {when}.", { name: NAME_F, when: ["the day before", "that week", "two days earlier", "at school"] }],
  ["walked", "By {time}, we ______ (walk) {n} kilometres.", { time: ["noon", "lunchtime", "six o'clock", "the evening"], n: ["ten", "fifteen", "twelve", "eight"] }],
  ["hadn't eaten", "I was hungry because I ______ (not eat) since {meal}, {name}.", { meal: ["breakfast", "the morning", "yesterday", "lunch"], name: NAME }],
  ["planted", "The garden looked beautiful because my grandmother ______ (plant) new {flowers}, {name}.", { flowers: ["roses", "tulips", "flowers", "trees"], name: NAME }],
].map(([pp, source, slots]) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (source.includes(`{${n}}`)) s[n] = f;
  const key = pp.startsWith("hadn't") ? pp : `had ${pp}`;
  const why = pp.startsWith("hadn't") ? "Not eating came before being hungry, so use the past perfect negative: hadn't + past participle." : WHY(pp);
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key, why, slots: s };
});

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const JOIN = "Join the two sentences. Use the past perfect for the action that happened first.";
const FIX = "Correct the mistake. One action happened before the other.";
const ALR = "Rewrite the sentence with already and the past perfect.";
const WHY_A = (pp) => `The first action was finished before the second: had + already + ${pp}.`;
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [JOIN, "The film started. Then we arrived at the {place}.", "When we arrived at the {place}, the film ______.", "had started", WHY("started"), { place: ["cinema", "club", "hall", "theatre"] }],
  [JOIN, "The guests left. Then {name} came home at {time}.", "When {name} came home at {time}, the guests ______.", "had left", WHY("left"), { name: NAME, time: ["ten", "eleven", "midnight", "nine"] }],
  [JOIN, "My friends ate all the {food}. Then I got to the {event}.", "By the time I got to the {event}, my friends ______ all the {food}.", "had eaten", WHY("eaten"), { food: ["pizza", "cake", "samsa", "fruit"], event: ["party", "picnic", "wedding", "birthday party"] }],
  [JOIN, "The {shop} closed. Then we got there at {time}.", "By the time we got there at {time}, the {shop} ______.", "had closed", WHY("closed"), { shop: ["bakery", "bank", "pharmacy", "post office"], time: ["six", "seven", "eight", "half past six"] }],
  [JOIN, "The rain stopped. Then we went out to the {place}.", "When we went out to the {place}, the rain ______.", "had stopped", WHY("stopped"), { place: ["park", "yard", "garden", "street"] }],
  [FIX, "By the time I got home, my sister ate all the {food}, {name}.", "By the time I got home, my sister ______ all the {food}, {name}.", "had eaten", "By the time shows her eating came first: had eaten.", { food: ["cake", "sweets", "samsa", "pizza"], name: NAME }],
  [FIX, "When we arrived, the {event} has already started, {name}.", "When we arrived, the {event} ______ already ______, {name}.", ["had", "started"], "The story is in the past, so had, not has: had already started.", { event: ["match", "film", "lesson", "concert"], name: NAME }],
  [FIX, "{name} was sad because she has lost her {thing}.", "{name} was sad because she ______ her {thing}.", "had lost", "Losing it came before being sad, and the story is past: had lost.", { name: NAME_F, thing: ["phone", "ring", "watch", "bag"] }],
  [FIX, "By the time {who} arrived at {time}, we had went to bed.", "By the time {who} arrived at {time}, we ______ to bed.", "had gone", "After had, use the past participle: gone, not went.", { who: ["Dad", "Mum", "Grandpa", "my uncle"], time: ["midnight", "eleven", "ten", "one"] }],
  [FIX, "I couldn't pay because I had forget my {thing} at home, {name}.", "I couldn't pay because I ______ my {thing} at home, {name}.", "had forgotten", "After had, use the past participle: forgotten.", { thing: ["wallet", "card", "money", "phone"], name: NAME }],
  [ALR, "The train left before we got to the {station}, {name}.", "When we got to the {station}, the train ______ already ______, {name}.", ["had", "left"], WHY_A("left"), { station: ["station", "railway station"], name: NAME }],
  [ALR, "The {subj} lesson started before {name} came in.", "When {name} came in, the {subj} lesson ______ already ______.", ["had", "started"], WHY_A("started"), { subj: ["English", "maths", "history", "music"], name: NAME }],
  [ALR, "My mum cooked dinner before I got home from {place}.", "When I got home from {place}, my mum ______ already ______ dinner.", ["had", "cooked"], WHY_A("cooked"), { place: ["school", "work", "training", "college"] }],
  [ALR, "The guests went home before {who} arrived.", "When {who} arrived, the guests ______ already ______ home.", ["had", "gone"], WHY_A("gone"), { who: ["my uncle", "Grandpa", "my aunt", "the singer"] }],
  [ALR, "{name} sold his old {thing} before he bought a new one.", "When {name} bought a new {thing}, he ______ already ______ his old one.", ["had", "sold"], WHY_A("sold"), { name: NAME_M, thing: ["bike", "phone", "car", "laptop"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about a time you arrived late and something had already happened.", "had already + past participle", ["exactly one sentence", "when / by the time + past simple", "had already"]],
  ["Write one sentence with by the time about your morning.", "by the time + past perfect", ["exactly one sentence", "by the time", "had + past participle"]],
  ["Write one sentence about why you were tired or happy yesterday, with the past perfect.", "because + had + past participle", ["exactly one sentence", "because", "had + past participle"]],
  ["Write one sentence about a shop or café that had closed when you got there.", "had closed", ["exactly one sentence", "when / by the time", "had closed"]],
  ["Write one sentence about a film or match that had started when you arrived.", "had started", ["exactly one sentence", "had started or had begun", "a past time"]],
  ["Write one sentence about something you had forgotten or lost.", "had forgotten / had lost", ["exactly one sentence", "had + irregular participle", "what happened next"]],
  ["Write one sentence with hadn't about why you were hungry or worried.", "hadn't + past participle", ["exactly one sentence", "hadn't", "because"]],
  ["Write two sentences about a trip: what happened first and what happened next.", "past perfect + past simple", ["exactly two sentences", "one past perfect", "one past simple"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe a day when everything went wrong. Use the past perfect for things that happened first. Write three or four sentences.", "past perfect for the earlier event", ["had + past participle", "by the time or when", "past simple for the later event"]],
  ["Tell the story of a time you missed a bus, train or film. Write three or four sentences.", "had already left / started", ["had already", "past simple", "a time"]],
  ["Describe a party or wedding you arrived late at. What had happened before you got there? Write three or four sentences.", "past perfect for things before you arrived", ["had + past participle", "by the time", "three or four sentences"]],
  ["Describe how a place had changed when you visited it again after a long time. Write three or four sentences.", "had changed / had built / had grown", ["had + past participle", "when I visited", "a place"]],
  ["Describe a test or exam day. What had you done before it? Write three or four sentences.", "past perfect for preparation", ["had studied / had slept", "before or by the time", "past simple"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.past.past-perfect-sequence.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
