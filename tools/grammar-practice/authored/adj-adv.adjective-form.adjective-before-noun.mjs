// Hand-authored: adj-adv / adjective-form / adjective-before-noun (A1).
// Path fill P6 (2026-11-14, Base44 AI, branch grammar-path-fill-2-base44).
//
// Placement focus: adjective + noun order, and the adjective never takes a
// plural -s ("They live in a big house", not "house big" / "bigs house").
// Every blank is one adjective + one noun phrase after a determiner that fixes
// the number: a / an / one (singular) or two, three, many, these (plural), so
// the number distractor is always wrong. Never "my / the / some" before the
// blank (both numbers fit) and never a verb that allows "noun + adjective"
// (buy / keep / find / make / want it hot), so the noun-first option is never
// English. The -s distractor only uses adjectives whose -s form is not a real
// word (no new, good, kind, fast, green, white, black, red, cold, sweet...).
// Choose distractors: noun + adjective (the order some L1s use after the
// noun), adjective + -s (Russian adjectives agree in number), and the noun in
// the wrong number for the determiner.
// Build: the two words are listed in instr; the learner orders them and adds
// -s to the noun when there is more than one (regular -s nouns only).
// Transform: 4 fix the order / 4 fix an adjective with -s / 4 join "The X is
// adj." into adj + noun / 3 one -> more than one. Adjective after be is P29.
//
// Run: node tools/grammar-practice/authored/adj-adv.adjective-form.adjective-before-noun.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "adj-adv", branch: "adjective-form", topic: "adjective-before-noun", level: "A1", pv: "2.5" };

const SG = (adj, n, pl = n + "s") => [`${adj} ${n}`, `${n} ${adj}`, `${adj}s ${n}`, `${adj} ${pl}`];
const PL = (adj, n, pl = n + "s") => [`${adj} ${pl}`, `${pl} ${adj}`, `${adj}s ${pl}`, `${adj} ${n}`];
const WS = (adj, n, det) => `The adjective goes before the noun: ${adj} ${n}. "${det}" means one, so the noun is singular, and the adjective never takes -s.`;
const WP = (adj, pl, det) => `The adjective goes before the noun: ${adj} ${pl}. "${det}" means more than one, so the noun is plural, but the adjective never takes -s.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [SG("big", "house"), WS("big", "house", "A"), "My {who} live in a ______ near the {place}.",
    { who: ["grandparents", "cousins", "aunt and uncle", "neighbours"], place: ["river", "park", "school", "market"] }],
  [PL("old", "car"), WP("old", "cars", "Two"), "Our neighbour {name} has two ______ in his {place}.",
    { name: ["Bobur", "Mr Karimov", "Rustam", "Timur"], place: ["garage", "yard", "garden", "big garage"] }],
  [SG("expensive", "phone"), WS("expensive", "phone", "An"), "{name} wants an ______ for her {event}.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], event: ["birthday", "sixteenth birthday", "graduation", "new job"] }],
  [PL("tall", "tree"), WP("tall", "trees", "Many"), "There are many ______ in the {place} near {where}.",
    { place: ["park", "garden", "yard", "village"], where: ["our school", "my home", "the river", "Grandma's house"] }],
  [SG("young", "teacher"), WS("young", "teacher", "A"), "We have a ______ for {subject} this {when}.",
    { subject: ["English", "maths", "music", "art"], when: ["year", "term", "semester", "autumn"] }],
  [PL("cheap", "shoe"), WP("cheap", "shoes", "These"), "These ______ are from the {place}, {name}.",
    { place: ["market", "bazaar", "small shop", "shop near our school"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [SG("funny", "film"), WS("funny", "film", "A"), "Let's watch a ______ on {day}, {name}.",
    { day: ["Friday", "Saturday", "Sunday", "Friday evening"], name: ["Aziz", "Olga", "Mum", "Timur"] }],
  [PL("heavy", "bag"), WP("heavy", "bags", "Two"), "My {who} carries two ______ to the {place} every day.",
    { who: ["brother", "sister", "mother", "dad"], place: ["market", "bus stop", "shop", "station"] }],
  [SG("quiet", "room"), WS("quiet", "room", "A"), "I need a ______ for my {task} tonight, {name}.",
    { task: ["homework", "exam practice", "reading", "online lesson"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  [PL("friendly", "dog"), WP("friendly", "dogs", "Three"), "Our {who} has three ______ in the {place}.",
    { who: ["neighbour", "uncle", "grandfather", "aunt"], place: ["yard", "garden", "village", "big yard"] }],
  [SG("old", "bike"), WS("old", "bike", "An"), "{name} rides an ______ to school. It was his {who}'s.",
    { name: ["Bobur", "Sardor", "Jasur", "Timur"], who: ["dad", "grandfather", "uncle", "brother"] }],
  [PL("big", "cake"), WP("big", "cakes", "Two"), "My {who} makes two ______ for {event}.",
    { who: ["grandmother", "aunt", "mother", "sister"], event: ["Navruz", "my birthday", "our guests", "the New Year"] }],
  [SG("tall", "man", "men"), WS("tall", "man", "A"), "There is a ______ at the {place}. He is asking for {who}.",
    { place: ["door", "gate", "bus stop", "shop"], who: ["you", "Dad", "your brother", "the teacher"] }],
  [PL("interesting", "book"), WP("interesting", "books", "Many"), "Our {place} has many ______ about {topic}.",
    { place: ["library", "school library", "teacher", "classroom"], topic: ["history", "animals", "space", "sport"] }],
  [SG("busy", "street"), WS("busy", "street", "A"), "Our {building} is on a ______ in {city}.",
    { building: ["flat", "school", "college", "shop"], city: ["Tashkent", "Samarkand", "Namangan", "Andijan"] }],
  [PL("comfortable", "chair"), WP("comfortable", "chairs", "Four"), "Our {place} has four ______ and a big {thing}.",
    { place: ["living room", "office", "teachers' room", "library"], thing: ["table", "window", "desk", "carpet"] }],
  [SG("modern", "school"), WS("modern", "school", "A"), "My {who} studies at a ______ in {city}.",
    { who: ["sister", "brother", "cousin", "friend"], city: ["Tashkent", "Bukhara", "Fergana", "Karshi"] }],
  [PL("noisy", "child", "children"), WP("noisy", "children", "Two"), "There are two ______ on the {place}. Their {who} is asleep.",
    { place: ["bus", "train", "minibus", "plane"], who: ["mother", "father", "grandma", "aunt"] }],
  [SG("easy", "test"), WS("easy", "test", "An"), "Our teacher gives us an ______ in {subject} every {day}.",
    { subject: ["English", "maths", "history", "biology"], day: ["Monday", "Friday", "week", "month"] }],
  [PL("beautiful", "place"), WP("beautiful", "places", "Many"), "{city} has many ______ for {who} to see.",
    { city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"], who: ["tourists", "visitors", "students", "families"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const instrB = (n, adj) => `Write the two words in the right order: ${n} / ${adj}. Add -s to the noun if there is more than one.`;
const MTO = (d) => `${d} means more than one`;
const B = (n, adj, key, reason, source, slots) => ({
  instr: instrB(n, adj), key, source, slots,
  why: reason === "one"
    ? `Adjective first, then the noun: ${key}. A or an means one, so the noun has no -s.`
    : `Adjective first, then the noun: ${key}. ${reason}, so the noun takes -s, but the adjective never does.`,
});
const BUILD = [
  B("bag", "red", "red bag", "one", "{name} has a ______ for {thing}.",
    { name: ["Lola", "Aziz", "Olga", "Timur"], thing: ["school", "the gym", "the swimming pool", "the trip"] }),
  B("apple", "green", "green apples", MTO("Two"), "Grandma has two ______ in her {place}, {name}.",
    { place: ["bag", "basket", "kitchen", "hand"], name: ["Aziz", "Olga", "Timur", "Lola"] }),
  B("flat", "small", "small flat", "one", "My {who} lives in a ______ in {city}.",
    { who: ["uncle", "aunt", "cousin", "brother"], city: ["Tashkent", "Nukus", "Termez", "Kokand"] }),
  B("friend", "good", "good friends", MTO("Many"), "{name} has many ______ at {place}.",
    { name: ["Madina", "Bobur", "Sardor", "Kamila"], place: ["school", "college", "the sports club", "work"] }),
  B("coat", "warm", "warm coat", "one", "Take a ______ today, {name}. It is cold {where}.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], where: ["outside", "in the mountains", "in the park", "at the bus stop"] }),
  B("shirt", "white", "white shirts", MTO("Three"), "{who} needs three ______ for {thing}.",
    { who: ["Dad", "My uncle", "My brother", "Mr Karimov"], thing: ["work", "his new job", "the office", "the week"] }),
  B("question", "easy", "easy question", "one", "The teacher asks {name} an ______ in the {subject} lesson.",
    { name: ["Aziz", "Olga", "Timur", "Lola"], subject: ["English", "maths", "history", "geography"] }),
  B("room", "big", "big rooms", MTO("Two"), "Our {building} has two ______ and a small {room}.",
    { building: ["flat", "house", "new flat", "old house"], room: ["kitchen", "bathroom", "hall", "balcony"] }),
  B("cat", "black", "black cat", "one", "There is a ______ on our {place}, {name}.",
    { place: ["roof", "wall", "car", "balcony"], name: ["Mum", "Dad", "Aziz", "Olga"] }),
  B("student", "clever", "clever students", MTO("Many"), "There are many ______ in my {group} at {place}.",
    { group: ["class", "group", "team", "English group"], place: ["school", "college", "the club", "the lyceum"] }),
  B("song", "beautiful", "beautiful song", "one", "{name} sings a ______ for {who}.",
    { name: ["Lola", "Madina", "Olga", "Kamila"], who: ["her grandmother", "the class", "her friends", "us"] }),
  B("orange", "sweet", "sweet oranges", MTO("Five"), "Mum buys five ______ at the {place} on {day}.",
    { place: ["market", "bazaar", "shop", "corner shop"], day: ["Saturdays", "Sundays", "Mondays", "Fridays"] }),
  B("phone", "cheap", "cheap phone", "one", "{name} wants a ______ for {reason}.",
    { name: ["Aziz", "Timur", "Bobur", "Sardor"], reason: ["school", "his trips", "music", "games"] }),
  B("hat", "funny", "funny hats", "Each child wears a hat, so there is more than one hat", "The {who} wear ______ at the {event}.",
    { who: ["children", "girls", "boys", "students"], event: ["party", "school show", "New Year party", "festival"] }),
  B("lesson", "interesting", "interesting lesson", "one", "We have an ______ about {topic} on {day}.",
    { topic: ["space", "animals", "history", "the sea"], day: ["Monday", "Tuesday", "Thursday", "Friday"] }),
  B("word", "long", "long words", MTO("Many"), "This {text} has many ______. Can you help me, {name}?",
    { text: ["text", "story", "page", "letter"], name: ["Mum", "Dad", "Aziz", "Olga"] }),
  B("chair", "comfortable", "comfortable chair", "one", "Grandpa sits in a ______ by the {place} after {meal}.",
    { place: ["window", "door", "stove", "TV"], meal: ["lunch", "dinner", "breakfast", "work"] }),
  B("girl", "happy", "happy girls", MTO("Two"), "Two ______ are {doing} in the school {place}.",
    { doing: ["singing", "dancing", "playing", "laughing"], place: ["yard", "hall", "garden", "gym"] }),
  B("idea", "good", "good idea", "one", "That is a ______, {name}! Let's go to the {place}.",
    { name: ["Aziz", "Olga", "Mum", "Timur"], place: ["park", "river", "cinema", "lake"] }),
  B("car", "fast", "fast cars", "He likes cars in general, not one car", "My {who} likes ______ and {thing}.",
    { who: ["brother", "cousin", "uncle", "friend Timur"], thing: ["big bikes", "loud music", "football", "video games"] }),
].map((b) => ({ ...BASE, stage: "build", format: "gap_fill", ...b }));

/* ---------------- transform: 15 rewrite, four kinds ---------------- */
const ORD = "Correct the mistake: put the adjective in the right place.";
const ESS = "Correct the mistake in the adjective.";
const JOIN = "Join the two sentences. Put the adjective before the noun.";
const MORE = "Now there is more than one. Rewrite the sentence.";
const TRANSFORM = [
  // fix the order (4)
  [ORD, "big house", "{name} lives in a house big near the {place}.", "{name} lives in a ______ near the {place}.",
    "The adjective goes before the noun: a big house, not a house big.", { name: ["Aziz", "Lola", "Bobur", "Madina"], place: ["river", "park", "station", "market"] }],
  [ORD, "nice teacher", "We have a teacher nice for {subject}, {name}.", "We have a ______ for {subject}, {name}.",
    "In English the adjective comes first: a nice teacher.", { subject: ["English", "maths", "music", "art"], name: ["Mum", "Dad", "Grandma", "Aunt Lola"] }],
  [ORD, "dirty shoes", "Take off your shoes dirty at the {place}, {name}.", "Take off your ______ at the {place}, {name}.",
    "The adjective goes before the noun: your dirty shoes.", { place: ["door", "hall", "front door", "entrance"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [ORD, "hungry cat", "There is a cat hungry in the {place}. Give it some {food}.", "There is a ______ in the {place}. Give it some {food}.",
    "The adjective goes before the noun: a hungry cat.", { place: ["yard", "kitchen", "garden", "street"], food: ["milk", "meat", "bread", "fish"] }],
  // fix the adjective with -s (4)
  [ESS, "big dogs", "{name} has two bigs dogs in the {place}.", "{name} has two ______ in the {place}.",
    "Adjectives never take -s, even with a plural noun: two big dogs.", { name: ["Lola", "Aziz", "Grandpa", "My uncle"], place: ["yard", "garden", "village", "big yard"] }],
  [ESS, "beautiful flowers", "My {who} grows beautifuls flowers in front of the {place}.", "My {who} grows ______ in front of the {place}.",
    "The adjective stays the same with a plural noun: beautiful flowers.", { who: ["grandmother", "mother", "aunt", "neighbour"], place: ["house", "window", "gate", "door"] }],
  [ESS, "old photos", "Grandpa shows us three olds photos of {place} after {meal}.", "Grandpa shows us three ______ of {place} after {meal}.",
    "Only the noun takes -s: three old photos.", { place: ["Samarkand", "his village", "our family", "his school"], meal: ["dinner", "lunch", "breakfast", "tea"] }],
  [ESS, "young players", "There are many youngs players in our {team} this {when}.", "There are many ______ in our {team} this {when}.",
    "The adjective never takes -s: many young players.", { team: ["team", "football team", "club", "school team"], when: ["year", "season", "summer", "autumn"] }],
  // join (4)
  [JOIN, "old car", "My {who} has a car. The car is old.", "My {who} has an ______.",
    "Put the adjective before the noun, and use an before the sound o: an old car.", { who: ["uncle", "grandfather", "neighbour", "teacher"] }],
  [JOIN, "small garden", "We have a garden behind our {house}. It is small, {name}.", "We have a ______ behind our {house}, {name}.",
    "Put the adjective before the noun: a small garden.", { house: ["house", "school", "home", "building"], name: ["Mum", "Dad", "Aziz", "Olga"] }],
  [JOIN, "kind friends", "{name} has two friends. They are kind.", "{name} has two ______.",
    "Put the adjective before the noun. The noun is plural, but the adjective has no -s: kind friends.", { name: ["Madina", "Bobur", "Kamila", "Sardor"] }],
  [JOIN, "fresh bread", "Mum buys bread at the {place}. The bread is fresh.", "Mum buys ______ at the {place}.",
    "Put the adjective before the noun: fresh bread.", { place: ["bakery", "market", "bazaar", "corner shop"] }],
  // one -> more than one (3)
  [MORE, "new books", "{name} has a new book about {topic}.", "{name} has three ______ about {topic}.",
    "Three means more than one, so the noun takes -s: new books. The adjective does not change.", { name: ["Aziz", "Olga", "Timur", "Lola"], topic: ["animals", "space", "football", "history"] }],
  [MORE, "tall boys", "A tall boy is waiting at the {place} for {who}.", "Two ______ are waiting at the {place} for {who}.",
    "Two means more than one: tall boys. The adjective stays the same.", { place: ["bus stop", "gate", "door", "corner"], who: ["the bus", "a friend", "the teacher", "a taxi"] }],
  [MORE, "cheap pens", "Can I have a cheap pen, {name}? I need it for {thing}.", "Can I have two ______, {name}? I need them for {thing}.",
    "Two means more than one: cheap pens. Only the noun takes -s.", { name: ["please", "Aziz", "Olga", "Mum"], thing: ["school", "my test", "my homework", "the exam"] }],
].map(([instr, key, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about your home. Use a or an + adjective + noun.", "a/an + adjective + noun", ["exactly one sentence", "the adjective before the noun", "about your home"]],
  ["Write one sentence about two things in your bag. Use two + adjective + noun.", "two + adjective + plural noun", ["exactly one sentence", "the adjective has no -s", "the noun has -s"]],
  ["Describe your best friend with one sentence. Use an adjective before a noun.", "adjective + noun", ["exactly one sentence", "the adjective before the noun", "about your friend"]],
  ["Write one sentence about your town or village. Use many + adjective + noun.", "many + adjective + plural noun", ["exactly one sentence", "the adjective has no -s", "about your town"]],
  ["Write one sentence about the food your family eats on a holiday. Use an adjective before the food word.", "adjective + noun", ["exactly one sentence", "the adjective before the noun", "a food word"]],
  ["Write one sentence about an animal you know: a pet, or an animal in your village or town.", "a/an + adjective + noun", ["exactly one sentence", "the adjective before the noun", "an animal word"]],
  ["Write one sentence about the clothes you wear to school or work.", "adjective + plural noun", ["exactly one sentence", "a plural noun with an adjective", "the adjective has no -s"]],
  ["Write two sentences about your classroom: one about one thing, one about many things.", "a + adjective + noun / adjective + plural noun", ["exactly two sentences", "one singular, one plural", "adjectives before the nouns"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your home to a new friend from another country.", "adjective + noun", ["a big / small / old house or flat", "adjectives before nouns", "no -s on adjectives"]],
  ["Tell a friend about your favourite place in your town.", "adjective + noun", ["a / an + adjective + noun", "many + adjective + plural noun", "three or four sentences"]],
  ["Describe the people in your family. Say one thing about each person.", "adjective + noun", ["a kind mother, a tall brother …", "adjectives before nouns", "is / are"]],
  ["Write a short message about a market or shop near your home. What can you buy there?", "adjective + plural noun", ["fresh, cheap, big …", "plural nouns with -s", "no -s on adjectives"]],
  ["Describe your school or your workplace for a new student.", "adjective + noun", ["a / an + adjective + noun", "two or three adjectives", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/adj-adv.adjective-form.adjective-before-noun.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);