// Hand-authored: nouns-articles / articles / zero-article-general (B1).
// Wave C, C2 (2026-11-20, Base44 AI, branch grammar-wave-c-base44).
//
// Placement foci: no article with plural nouns used generally ("Cats are more
// independent than dogs") and with uncountable abstract nouns ("Money can't
// buy happiness"). Russian/Uzbek have no articles, so B1 learners overuse
// "the" once they learn it: "The money can't buy the happiness".
// Choose: 13 general (key –) and 7 specific (key the: "the water in this
// bottle", "the teachers at my school") so the learner has to read whether
// the sentence is about ALL of them or SOME KNOWN ones. Options – / the / a /
// some of ("some of cats" is the L1 calque of "некоторые из"; it needs "the").
// The general frames are facts or clear general claims (usually, always, can,
// is good for …), never a sentence that could be about a known group.
// Rule 11: no typed zero-article keys. Build keys the general PLURAL of the
// bracket noun ("Dogs") or "the + plural" for specific ones ("The cows"), so
// the typed answer is never the bare article. Uncountables are tested in
// choose and in transform two-gap keys only (a typed "money" would echo the
// cue word).
// Transform: 5 correct the general statement (two gaps) / 5 general →
// specific (the + plural) / 5 specific → general.
// Sibling scope: the-shared-context / the-unique (A1) key only "the";
// uncountable-abstract (A2) is some vs a/many, not articles.
//
// Run: node tools/grammar-practice/authored/nouns-articles.articles.zero-article-general.mjs

import { writeFileSync } from "node:fs";

// Audit (Claude, 20 Nov): four "the" keys had a post-modifier ("students in my group") where the zero
// article is also English; each is now one specific group or thing (we met, you bought, we saw).
const BASE = { domain: "nouns-articles", branch: "articles", topic: "zero-article-general", level: "B1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Lola"];
const rot = (arr, i) => arr.map((_, j) => arr[(j + i) % arr.length]);
const pick = (text, slots) => {
  const s = {};
  for (const [n, v] of Object.entries(slots)) if (text.includes(`{${n}}`)) s[n] = v;
  return s;
};
const GEN = (n) => `This is about ${n} in general, not some ${n} we know. Use no article.`;
const SPEC = (n) => `This is about specific ${n} (the ones the sentence names), so use the.`;

/* ---------------- choose: 20 mcq ---------------- */
// [key, noun for why, sentence, slots]
const CHOOSE = [
  ["–", "cats", "{name} says that ______ cats are more independent than {animal}.", { name: NAME, animal: ["dogs", "rabbits", "parrots", "hamsters"] }],
  ["–", "money", "______ money can't buy {thing}, {name}.", { thing: ["happiness", "friends", "time", "health"], name: NAME }],
  ["–", "fresh fruit", "My grandmother thinks ______ fresh fruit is good for {who}.", { who: ["children", "everyone", "old people", "your skin"] , x: [] }],
  ["the", "water", "______ water in this {container} is very cold, {name}.", { container: ["bottle", "glass", "jug", "cup"], name: NAME }],
  ["–", "children", "______ children usually learn languages faster than {who}, {name}.", { who: ["adults", "their parents", "old people", "grandparents"], name: NAME }],
  ["the", "students", "______ students we met at the party were very {adj}, {name}.", { adj: ["friendly", "kind", "clever", "funny"], name: NAME }],
  ["–", "coffee", "I never drink ______ coffee. I prefer {drink}, {name}.", { drink: ["tea", "juice", "milk", "water"], name: NAME }],
  ["–", "sport", "______ sport is good for your {part}, {name}.", { part: ["heart", "body", "health", "mood"], name: NAME }],
  ["the", "bread", "______ bread you bought at the {shop} this morning is very fresh, {name}.", { shop: ["bakery", "shop", "bazaar", "kiosk"], name: NAME }],
  ["–", "spiders", "Many people are afraid of ______ spiders, but my {who} loves them.", { who: ["sister", "brother", "cousin", "friend"], x: [] }],
  ["–", "health", "______ health is more important than {thing}, {name}.", { thing: ["money", "success", "fame", "work"], name: NAME }],
  ["the", "teachers", "______ teachers I told you about work at my {school}. They are very {adj}.", { school: ["school", "college", "lyceum", "university"], adj: ["kind", "strict", "helpful", "young"] }],
  ["–", "elephants", "{who} told me that ______ elephants can't jump.", { who: ["My teacher", "My brother", "Grandpa", "Our guide"], x: [] }],
  ["the", "elephants", "______ elephants we saw at the zoo yesterday were {doing}, {name}.", { doing: ["eating", "sleeping", "playing", "swimming"], name: NAME }],
  ["–", "breakfast", "______ breakfast is the most important meal of the day, {who} says.", { who: ["my mum", "our doctor", "my grandmother", "our teacher"], x: [] }],
  ["–", "vegetables", "______ vegetables are always good for {who}, {name}.", { who: ["you", "children", "everyone", "your body"], name: NAME }],
  ["the", "money", "Where is ______ money I gave you {when}, {name}?", { when: ["yesterday", "this morning", "last week", "on Monday"], name: NAME }],
  ["–", "history", "{name} wants to study ______ history at {place}.", { name: NAME, place: ["university", "college", "a big university", "an institute"] }],
  ["the", "history", "______ history of our {place} is very interesting, {name}.", { place: ["city", "town", "village", "school"], name: NAME }],
  ["–", "old people", "______ old people often need help with {task}, {name}.", { task: ["phones", "computers", "shopping", "heavy bags"], name: NAME }],
].map(([k, noun, prompt, slots], i) => {
  const start = prompt.startsWith("______");
  const base = ["–", start ? "The" : "the", start ? "A" : "a", start ? "Some of" : "some of"];
  const options = rot(base, i);
  const key = options.indexOf(k === "–" ? "–" : base[1]);
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key, why: k === "–" ? GEN(noun) : SPEC(noun), slots: pick(prompt, slots) };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the noun in brackets in the plural. Add the only if the sentence is about specific ones.";
const BUILD = [
  // general -> plural, no article (10)
  ["Dogs", "dogs", "______ (dog) can hear much better than {who}, {name}.", { who: ["people", "humans", "us", "we can"], name: NAME }],
  ["Bees", "bees", "______ (bee) make honey from flowers, {name}.", { name: NAME }],
  ["Spiders", "spiders", "______ (spider) have eight legs, {name}. Insects have six.", { name: NAME }],
  ["Birds", "birds", "______ (bird) lay eggs, and so do {animal}.", { animal: ["snakes", "turtles", "crocodiles", "frogs"] }],
  ["Cows", "cows", "______ (cow) give milk. My grandmother makes {product} from it, {name}.", { product: ["butter", "cheese", "qatiq", "yogurt"], name: NAME }],
  ["Plants", "plants", "______ (plant) need light and water to grow. Don't forget to water your {plant}, {name}.", { plant: ["flowers", "tomatoes", "roses", "cactus"], name: NAME }],
  ["Penguins", "penguins", "______ (penguin) can't fly, but they can swim {how}, {name}.", { how: ["very fast", "very well", "for hours", "in cold water"], name: NAME }],
  ["Camels", "camels", "______ (camel) can live without water for many days. We saw some in {place}, {name}.", { place: ["the desert", "Kyzylkum", "Bukhara", "the zoo"], name: NAME }],
  ["Babies", "babies", "______ (baby) sleep a lot. My little {who} sleeps all day, {name}.", { who: ["sister", "brother", "cousin", "nephew"], name: NAME }],
  ["Doctors", "doctors", "______ (doctor) often work very long hours. My {who} is one, {name}.", { who: ["aunt", "uncle", "mother", "father"], name: NAME }],
  // specific -> the + plural (10); no other "the" in these sentences
  ["The horses", "horses", "______ (horse) on my uncle's farm are {colour}, {name}.", { colour: ["brown", "white", "black", "grey"], name: NAME }],
  ["The books", "books", "______ (book) on my {furniture} are all from {who}.", { furniture: ["desk", "shelf", "bed", "table"], who: ["my aunt", "Grandpa", "my teacher", "my cousin"] }],
  ["The students", "students", "______ (student) in our group are from {n} different cities, {name}.", { n: ["three", "four", "five", "six"], name: NAME }],
  ["the keys", "keys", "Where are ______ (key) to our {thing}, {name}?", { thing: ["car", "flat", "house", "garage"], name: NAME }],
  ["The shoes", "shoes", "______ (shoe) you bought me {when} are too small, {name}.", { when: ["last week", "yesterday", "on Friday", "for my birthday"], name: NAME }],
  ["The apples", "apples", "______ (apple) from our garden are very {adj}, {name}.", { adj: ["sweet", "sour", "big", "juicy"], name: NAME }],
  ["The children", "children", "______ (child) in my building play football every {time}, {name}.", { time: ["evening", "day", "Sunday", "afternoon"], name: NAME }],
  ["the photos", "photos", "I liked ______ (photo) you sent me {when}, {name}.", { when: ["yesterday", "last night", "on Sunday", "this morning"], name: NAME }],
  ["The buses", "buses", "______ (bus) in our town are {adj} and clean, {name}.", { adj: ["new", "modern", "quiet", "fast"], name: NAME }],
  ["The flowers", "flowers", "______ (flower) on {who}'s table are from her garden.", { who: ["Grandma", "my aunt", "Mum", "Olga"] }],
].map(([key, noun, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key,
  why: key.toLowerCase().startsWith("the ") ? SPEC(noun) : `${GEN(noun)} The plural is ${key.toLowerCase()}.`,
  slots: pick(source, slots),
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const COR = "This is a general statement. Correct the two mistakes.";
const SPC = "Make it about the specific ones in the new sentence.";
const GENI = "Make it a general statement about all of them.";
const WHO = ["My grandfather", "Our teacher", "My mum", "My friend"];
const TRANSFORM = [
  // correct a general statement: drop the wrong "the" twice (5)
  [COR, "{who} says the money can't buy the happiness, {name}.", "{who} says ______ can't buy ______, {name}.", ["money", "happiness"], "General statement about money and happiness: no article on either.", { who: WHO, name: NAME }],
  [COR, "{who} told me that the cats don't like the water.", "{who} told me that ______ don't like ______.", ["cats", "water"], "General statement about cats and water: no article on either.", { who: ["My aunt", "Our teacher", "Grandpa", "My friend"] }],
  [COR, "{who} says the children need the sleep to grow, {name}.", "{who} says ______ need ______ to grow, {name}.", ["children", "sleep"], "General statement about children and sleep: no article on either.", { who: WHO, name: NAME }],
  [COR, "{who} says the fresh air is good for the children, {name}.", "{who} says fresh ______ is good for ______, {name}.", ["air", "children"], "General statement about fresh air and children: no article on either.", { who: WHO, name: NAME }],
  [COR, "{who} says the sport is good for the health, {name}.", "{who} says ______ is good for ______, {name}.", ["sport", "health"], "General statement about sport and health: no article on either.", { who: WHO, name: NAME }],
  // general -> specific (5)
  [SPC, "Apples are {adj}, {name}.", "______ from our garden are {adj}, {name}.", "The apples", SPEC("apples"), { adj: ["sweet", "sour", "big", "juicy"], name: NAME }],
  [SPC, "Students work hard {when}.", "______ in our group work hard {when}.", "The students", SPEC("students"), { when: ["before exams", "every day", "in May", "at night"] }],
  [SPC, "Buses are often late {when}, {name}.", "______ in our town are often late {when}, {name}.", "The buses", SPEC("buses"), { when: ["in winter", "at night", "on Mondays", "after rain"], name: NAME }],
  [SPC, "Children love {thing}, {name}.", "______ in my street love {thing}, {name}.", "The children", SPEC("children"), { thing: ["football", "ice cream", "cartoons", "bikes"], name: NAME }],
  [SPC, "Flowers need water {freq}.", "______ on my desk need water {freq}.", "The flowers", SPEC("flowers"), { freq: ["every day", "twice a week", "in summer", "every morning"] }],
  // specific -> general (5)
  [GENI, "The dogs in our street are very {adj}, {name}.", "______ are very {adj}, {name}.", "Dogs", GEN("dogs"), { adj: ["friendly", "loyal", "clever", "playful"], name: NAME }],
  [GENI, "{name} says the coffee in this café is {adj}.", "{name} says ______ is {adj}.", "coffee", GEN("coffee"), { name: NAME, adj: ["bitter", "expensive", "bad for sleep", "good in the morning"] }],
  [GENI, "The children in my class love {thing}, {name}.", "______ love {thing}, {name}.", "Children", GEN("children"), { thing: ["games", "cartoons", "sweets", "football"], name: NAME }],
  [GENI, "{who} thinks the books in this shop are {adj}.", "{who} thinks ______ are {adj}.", "books", GEN("books"), { who: WHO, adj: ["expensive", "useful", "interesting", "important"] }],
  [GENI, "The music in this café helps me {verb}, {name}.", "______ helps me {verb}, {name}.", "Music", GEN("music"), { verb: ["relax", "study", "think", "feel calm"], name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: pick(source + hint, slots) }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one general sentence about an animal you like.", "… (plural animal) are / can …", ["exactly one sentence", "a plural noun with no article", "a present verb"]],
  ["Write one sentence about what money can or can't buy.", "Money can't buy …", ["exactly one sentence", "money with no article", "can or can't"]],
  ["Write one general sentence about what is good for your health.", "… is / are good for …", ["exactly one sentence", "a general noun with no article", "good for"]],
  ["Write one general sentence about teenagers or children.", "Teenagers / Children often …", ["exactly one sentence", "a plural noun with no article", "often or usually"]],
  ["Write one sentence about a school subject you like and why.", "I like … because …", ["exactly one sentence", "a subject with no article", "because"]],
  ["Write two sentences: one about cats in general, one about a specific cat or cats you know.", "Cats are … The cats in my … are …", ["exactly two sentences", "no article for the general one", "the for the specific one"]],
  ["Write one general sentence about food or drink in your family.", "In my family we drink / eat …", ["exactly one sentence", "a food or drink with no article", "a present verb"]],
  ["Write one sentence about what you think about music or sport.", "I think music / sport …", ["exactly one sentence", "no article", "I think"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["What makes people happy? Write your opinion.", "Money / Friends / Health … make people happy", ["general nouns with no article", "I think", "three or four sentences"]],
  ["Describe dogs and cats in general. Which do you prefer, and why?", "Dogs are … Cats are …", ["plural nouns with no article", "prefer", "three or four sentences"]],
  ["Give advice to a younger student about healthy food and sport.", "Vegetables are … Sport is …", ["general nouns with no article", "should or good for", "three or four sentences"]],
  ["Write about a school subject you love and a subject you find hard.", "I love history … Maths is …", ["subjects with no article", "because", "three or four sentences"]],
  ["Compare young people and old people in your family: what do they like?", "Young people like … Old people …", ["general plurals with no article", "a contrast word (but)", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/nouns-articles.articles.zero-article-general.json";
// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,
// and extra slots on thin lines (B1 course).
const VARIETY = {
 "why": {
  "choose": [
   "Cats in general: no article.",
   "Money in general: no article.",
   "Fresh fruit in general: no article.",
   "This particular water, in this container: The.",
   "Children in general: no article.",
   "The students we met: particular ones: The.",
   "Coffee in general, as a drink I never have: no article.",
   "Sport in general: no article.",
   "The bread you bought: a particular loaf: The.",
   "Spiders in general: no article.",
   "Health in general: no article.",
   "The teachers I told you about: particular ones: The.",
   "Elephants in general: no article.",
   "The elephants we saw: particular ones: The.",
   "Breakfast as a meal in general: no article.",
   "Vegetables in general: no article.",
   "The money I gave you: particular money: the.",
   "History as a school subject: no article.",
   "The history of one place: particular: The.",
   "Old people in general: no article."
  ],
  "build": [
   "All dogs: plural, no article: Dogs.",
   "All bees: plural, no article: Bees.",
   "All spiders: plural, no article: Spiders.",
   "All birds: plural, no article: Birds.",
   "All cows: plural, no article: Cows.",
   "All plants: plural, no article: Plants.",
   "All penguins: plural, no article: Penguins.",
   "All camels: plural, no article: Camels.",
   "All babies: y → ies, no article: Babies.",
   "All doctors: plural, no article: Doctors.",
   "Only the horses on the farm: The horses.",
   "Only the books on my shelf: The books.",
   "Only the students in our group: The students.",
   "The keys to one thing: the keys.",
   "The shoes you bought: The shoes.",
   "The apples from our garden: The apples.",
   "child → children; the ones in my building: The children.",
   "The photos you sent: the photos.",
   "bus → buses; the ones in our town: The buses.",
   "The flowers on her table: The flowers."
  ],
  "transform": [
   "Money and happiness in general: no the.",
   "Cats and water in general: no the.",
   "Children and sleep in general: no the.",
   "Air and children in general: no the.",
   "Sport and health in general: no the.",
   "Only the apples from our garden: The apples.",
   "Only the students in our group: The students.",
   "Only the buses in our town: The buses.",
   "Only the children in my street: The children.",
   "Only the flowers on my desk: The flowers.",
   "Dogs in general now: no The.",
   "Coffee in general now: no the.",
   "Children in general now: no The.",
   "Books in general now: no the.",
   "Music in general now: no The."
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