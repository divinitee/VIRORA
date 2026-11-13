// Hand-authored: sentence-structure / existential / there-was-were (A2).
// Speaking Pack batch 2, topic 9 (grammar-run/SPEAK-2.md).
//
// Tests ONE point (placement item: "there was/were agreement in the past"):
//   there was + a singular noun, an uncountable noun or nobody
//   there were + a plural noun ("a lot of people", "no buses", "ten dishes")
// The tricky cases are on purpose: a lot of traffic (was) vs a lot of people
// (were), no water (was) vs no buses (were), nobody (was).
//
// Triage: kept. The present (there is/are) and questions are their own
// topics, so every sentence here has ONE past time marker and is a statement
// (positive, or negative only in transform).
//
// Distractors are real L1 errors:
//   - wrong agreement (there was + plural, there were + singular);
//   - is / are with a past time marker;
//   - no "there" at all: "Was a cat in our yard" (Russian "Была кошка", Uzbek
//     "hovlida mushuk bor edi" have no dummy subject);
//   - "They were" for there were (they/there confusion).
// "It was" is never offered for a singular noun: "It was a big park" is fine
// English. Nouns that decide the key are never slotted (rule 2).
//
// Build: "Write was or were" (closed choice, listed in instr, no bracket);
// 12 one-gap items, 8 two-gap items (key = one part per gap). No other was /
// were is printed in a build sentence, so the key never echoes (rule 4).
// Transform: 5 present → past / 5 positive → negative (wasn't / weren't) /
// 5 correct an error (agreement or a missing there).
//
// Run: node tools/grammar-practice/authored/sentence-structure.existential.there-was-were.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "sentence-structure", branch: "existential", topic: "there-was-were", level: "A2", pv: "2.5" };

const W = {
  sg: (np) => `${np} is one thing, and this was in the past, so use there was.`,
  un: (np) => `${np} is uncountable, and this was in the past, so use there was.`,
  nb: () => "Nobody takes a singular verb, and this was in the past, so use there was.",
  pl: (np) => `${np} is plural, and this was in the past, so use there were.`,
};
const noThere = " Don't leave out there.";

/* ---------------- choose: 20 mcq ---------------- */
const GAP = ["was", "were", "is", "are"];
const GAP_PL = ["were", "was", "are", "is"];
const SG = ["There was", "There were", "Was", "There is"];
const PL = ["There were", "There was", "Were", "They were"];
// [options, prompt, why, slots]
const CHOOSE = [
  [GAP, "There ______ a lot of traffic on the {road} yesterday, so I was late for {thing}.", W.un("Traffic"),
    { road: ["main road", "ring road", "bridge", "way home"], thing: ["school", "work", "class", "training"] }],
  [PL, "______ two {places} near our old flat. We went there {when}.", W.pl("Two cafés or parks") + noThere,
    { places: ["cafés", "parks", "shops", "bakeries"], when: ["every week", "on Sundays", "after school", "every day"] }],
  [GAP_PL, "There ______ five hundred guests at my {rel}'s wedding last summer. We danced until {time}.", W.pl("Guests"),
    { rel: ["cousin", "brother", "sister", "neighbour"], time: ["midnight", "one o'clock", "late", "two o'clock"] }],
  [SG, "______ a cat in our yard yesterday morning. It was {colour} and very small.", W.sg("A cat") + noThere,
    { colour: ["black", "white", "grey", "ginger"] }],
  [GAP, "There ______ nobody in the {place} when I arrived, so I {act}.", W.nb(),
    { place: ["classroom", "office", "gym", "library"], act: ["waited", "sat down", "called my friend", "read a book"] }],
  [PL, "______ a lot of mistakes in my {test} last week, so I {act}.", W.pl("Mistakes") + noThere,
    { test: ["test", "essay", "homework", "dictation"], act: ["studied more", "asked my teacher", "did it again", "felt sad"] }],
  [GAP_PL, "There ______ no buses after {time} last night, so we {act}.", W.pl("Buses"),
    { time: ["ten", "eleven", "midnight", "half past ten"], act: ["took a taxi", "walked home", "called my father", "stayed at my aunt's"] }],
  [SG, "______ a lot of snow in {city} last January. We {act} every day.", W.un("Snow") + noThere,
    { city: ["Tashkent", "Samarkand", "Fergana", "Chimgan"], act: ["made snowmen", "played outside", "walked to school", "had snowball fights"] }],
  [GAP, "There ______ some {food} in the fridge this morning, but now it is gone.", W.un("This food"),
    { food: ["milk", "cheese", "soup", "juice"] }],
  [PL, "______ so many people on the {transport} this morning that I {act}.", W.pl("People") + noThere,
    { transport: ["bus", "metro", "minibus", "tram"], act: ["stood all the way", "couldn't sit down", "missed my stop", "waited for the next one"] }],
  [GAP_PL, "There ______ a lot of people at the {place} on Saturday, and we waited for {n} minutes.", W.pl("People"),
    { place: ["bazaar", "bank", "post office", "cinema"], n: ["twenty", "thirty", "forty", "fifteen"] }],
  [SG, "______ no water in our {building} last Monday, so we bought {what}.", W.un("Water") + noThere,
    { building: ["building", "flat", "street", "house"], what: ["two bottles", "big bottles", "water at the shop", "five bottles"] }],
  [GAP, "There ______ an old {thing} in my grandmother's {room} when I was small.", W.sg("An old radio or clock"),
    { thing: ["piano", "radio", "clock", "mirror"], room: ["house", "flat", "bedroom", "living room"] }],
  [PL, "______ some new students in our {group} last month. They came from {city}.", W.pl("Students") + noThere,
    { group: ["group", "class", "English group", "team"], city: ["Nukus", "Fergana", "Moscow", "Kazan"] }],
  [GAP_PL, "There ______ only {n} students in our {group} last year.", W.pl("Students"),
    { n: ["twelve", "fifteen", "ten", "eighteen"], group: ["class", "group", "English group", "team"] }],
  [SG, "______ a problem with my {device} yesterday, so I {act}.", W.sg("A problem") + noThere,
    { device: ["phone", "laptop", "computer", "tablet"], act: ["called my brother", "took it to a shop", "couldn't do my homework", "used my sister's"] }],
  [GAP, "There ______ a big storm in {city} two days ago, and the {thing} went off.", W.sg("A storm"),
    { city: ["Tashkent", "Namangan", "Andijan", "Bukhara"], thing: ["lights", "power", "electricity", "internet"] }],
  [PL, "______ beautiful flowers in the {place} last spring. My mother took {n} photos.", W.pl("Flowers") + noThere,
    { place: ["park", "garden", "yard", "square"], n: ["ten", "twenty", "fifty", "thirty"] }],
  [GAP_PL, "There ______ no {thing} in our {place} when my father was a boy.", W.pl("Shops, cars or phones"),
    { thing: ["shops", "cars", "phones", "computers"], place: ["village", "town", "street", "district"] }],
  [SG, "______ nobody at home when I came back from {place} last night, so I {act}.", W.nb() + noThere,
    { place: ["work", "training", "the gym", "my friend's house"], act: ["made dinner", "watched a film", "called my mother", "went to bed"] }],
].map(([options, prompt, why, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const I1 = "Write was or were.";
const I2 = "Write was or were in each gap.";
// [key, source, why, slots]
const BUILD = [
  ["was", "When I was a child, there ______ a small {shop} at the end of our {street}.", W.sg("A small shop"),
    { shop: ["shop", "bakery", "café", "kiosk"], street: ["street", "road", "lane"] }],
  [["were", "was"], "There ______ a lot of guests at the {event}, but there ______ only one {who} I knew.", "Guests is plural, so there were. One person is singular, so there was.",
    { event: ["wedding", "party", "birthday party", "concert"], who: ["girl", "boy", "person", "man"] }],
  ["were", "Last night there ______ three good films on TV, so I stayed up until {time}.", W.pl("Films"),
    { time: ["midnight", "one o'clock", "eleven", "half past twelve"] }],
  ["was", "There ______ a lot of rain in {city} last spring, and the {place} looked green.", W.un("Rain"),
    { city: ["Tashkent", "Fergana", "Namangan", "Samarkand"], place: ["park", "garden", "yard", "field"] }],
  [["was", "were"], "There ______ one {shop} in our {place}, and there ______ no cafés.", "One shop is singular, so there was. Cafés is plural, so there were.",
    { shop: ["shop", "bakery", "school", "clinic"], place: ["village", "street", "district", "area"] }],
  ["were", "At the concert there ______ thousands of people, and I couldn't see the {who}.", W.pl("People"),
    { who: ["singer", "stage", "band", "guitarist"] }],
  ["was", "There ______ nobody in the {place} at seven this morning, so it felt very {adj}.", W.nb(),
    { place: ["gym", "pool", "park", "yard"], adj: ["quiet", "calm", "nice", "peaceful"] }],
  [["were", "was"], "In the fridge there ______ some eggs, but there ______ no bread, so I {act}.", "Eggs is plural, so there were. Bread is uncountable, so there was.",
    { act: ["went to the shop", "made an omelette", "ate the eggs", "called my mother"] }],
  ["were", "In my old {school} in {city}, there ______ two computer rooms.", W.pl("Two computer rooms"),
    { school: ["school", "lyceum", "college"], city: ["Tashkent", "Andijan", "Karshi", "Urgench"] }],
  ["was", "There ______ an accident on the {road} yesterday, so I got to {place} late.", W.sg("An accident"),
    { road: ["main road", "bridge", "ring road", "motorway"], place: ["school", "work", "class", "training"] }],
  [["was", "were"], "There ______ a big park near my old {home} in {city}, and there ______ two swimming pools in it.", "A park is singular, so there was. Two pools is plural, so there were.",
    { home: ["house", "flat", "school", "college"], city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
  ["were", "At my {rel}'s house last Navruz, there ______ ten different dishes on the {table}.", W.pl("Dishes"),
    { rel: ["aunt", "uncle", "grandmother", "cousin"], table: ["table", "big table", "long table", "dastarkhan"] }],
  ["was", "There ______ some money on the {place} this morning. Is it yours?", W.un("Money"),
    { place: ["table", "floor", "desk", "sofa"] }],
  [["were", "were"], "On the {transport} this morning there ______ a lot of students, and there ______ no free seats.", "Students and seats are plural, so there were both times.",
    { transport: ["bus", "metro", "minibus", "tram"] }],
  ["were", "Thirty years ago, there ______ no mobile phones in {place}.", W.pl("Phones"),
    { place: ["Uzbekistan", "our country", "our town", "the village"] }],
  [["was", "were"], "There ______ a lot of snow in {city} last winter, and there ______ no classes for {n} days.", "Snow is uncountable, so there was. Classes is plural, so there were.",
    { city: ["Tashkent", "Samarkand", "Jizzakh", "Namangan"], n: ["two", "three", "four", "five"] }],
  ["was", "There ______ a good film at the {place} last Saturday, so we went with {who}.", W.sg("A good film"),
    { place: ["cinema", "new cinema", "film club", "cinema in town"], who: ["friends", "my sister", "our cousins", "my parents"] }],
  [["was", "were"], "At the {place} yesterday there ______ lots of fruit, but there ______ no tomatoes.", "Fruit is uncountable, so there was. Tomatoes is plural, so there were.",
    { place: ["bazaar", "market", "shop", "supermarket"] }],
  ["were", "There ______ a lot of children in the {place} yesterday afternoon. They {act}.", W.pl("Children"),
    { place: ["park", "playground", "yard", "pool"], act: ["played games", "ran and shouted", "laughed a lot", "had ice cream"] }],
  [["were", "was"], "There ______ two tests in {subject} last week, and there ______ a lot of homework too, so I {act} every evening.", "Tests is plural, so there were. Homework is uncountable, so there was.",
    { subject: ["maths", "English", "physics", "history"], act: ["studied", "worked hard", "stayed at home", "read my notes"] }],
].map(([key, source, why, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: Array.isArray(key) ? I2 : I1, source, key, why, slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const PAST = "Rewrite the sentence in the past.";
const NEG = "Make the sentence negative. Use any.";
const FIX = "This sentence has a mistake. Rewrite it correctly.";
// [instr, source, hint, key, why, slots]
const TRANSFORM = [
  [PAST, "There is a big {shop} in our {place} now.", "There ______ a big {shop} in our {place} ten years ago.", "was",
    "Ten years ago is the past, and a shop is one thing, so is becomes was.",
    { shop: ["shop", "market", "supermarket", "café"], place: ["street", "village", "district", "town"] }],
  [PAST, "There are many cars on the {road} near our {home} today.", "There ______ many cars on the {road} near our {home} last night.", "were",
    "Last night is the past, and cars is plural, so are becomes were.",
    { road: ["road", "street"], home: ["house", "school", "flat", "college"] }],
  [PAST, "There is no milk in the {place}.", "There ______ no milk in the {place} yesterday.", "was",
    "Yesterday is the past, and milk is uncountable, so is becomes was.",
    { place: ["fridge", "kitchen", "shop", "café"] }],
  [PAST, "There are a lot of tourists in the {area} of {city} this summer.", "There ______ a lot of tourists in the {area} of {city} last summer.", "were",
    "Last summer is the past, and tourists is plural, so are becomes were.",
    { area: ["centre", "old town", "streets", "bazaars"], city: ["Samarkand", "Bukhara", "Khiva", "Tashkent"] }],
  [PAST, "There is a football match on TV tonight.", "There ______ a football match on TV last night, so my {who} stayed up late.", "was",
    "Last night is the past, and a match is one thing, so is becomes was.",
    { who: ["father", "brother", "uncle", "grandfather"] }],
  [NEG, "There were some free seats on the {transport} this morning.", "There ______ any free seats on the {transport} this morning.", "weren't",
    "Seats is plural, so the negative is there weren't, with any.",
    { transport: ["bus", "metro", "minibus", "train"] }],
  [NEG, "There was some bread in the {place} for {meal}.", "There ______ any bread in the {place} for {meal}.", "wasn't",
    "Bread is uncountable, so the negative is there wasn't, with any.",
    { place: ["kitchen", "bag", "cupboard", "shop"], meal: ["breakfast", "lunch", "dinner", "the guests"] }],
  [NEG, "There were some good films at the cinema near our {home} in {city} last week.", "There ______ any good films at the cinema near our {home} in {city} last week.", "weren't",
    "Films is plural, so the negative is there weren't, with any.",
    { home: ["house", "school", "flat", "college"], city: ["Tashkent", "Fergana", "Namangan", "Karshi"] }],
  [NEG, "There was a doctor at the {place} in our {area} yesterday.", "There ______ a doctor at the {place} in our {area} yesterday.", "wasn't",
    "A doctor is one person, so the negative is there wasn't.",
    { place: ["school", "camp", "stadium", "sports club"], area: ["village", "district", "town", "area"] }],
  [NEG, "There were a lot of people at the {event} in {city} on Sunday.", "There ______ many people at the {event} in {city} on Sunday.", "weren't",
    "People is plural, so the negative is there weren't.",
    { event: ["concert", "match", "party", "meeting"], city: ["Tashkent", "Andijan", "Bukhara", "Samarkand"] }],
  [FIX, "There was many people at the {event} in {city}.", "There ______ many people at the {event} in {city}.", "were",
    "People is plural, so use there were, not there was.",
    { event: ["concert", "wedding", "match", "festival"], city: ["Tashkent", "Samarkand", "Fergana", "Nukus"] }],
  [FIX, "In our old {school} in {city} was a big hall.", "In our old {school} in {city} ______ a big hall.", "there was",
    "English needs there before was: in our old school there was a big hall.",
    { school: ["school", "lyceum", "college", "kindergarten"], city: ["Tashkent", "Andijan", "Karshi", "Urgench"] }],
  [FIX, "Was a lot of traffic on the {road} near the {place} yesterday.", "______ a lot of traffic on the {road} near the {place} yesterday.", "There was",
    "English needs there at the start: there was a lot of traffic.",
    { road: ["main road", "ring road", "bridge", "big road"], place: ["bazaar", "station", "airport", "stadium"] }],
  [FIX, "There were a cat in our {place} this morning. It had {colour} paws.", "There ______ a cat in our {place} this morning.", "was",
    "A cat is one animal, so use there was, not there were.",
    { place: ["yard", "garden", "kitchen", "street"], colour: ["white", "black", "grey", "brown"] }],
  [FIX, "It were two cafés near our old {home} in {city}.", "______ two cafés near our old {home} in {city}.", "There were",
    "To say something existed, use there, not it: there were two cafés.",
    { home: ["flat", "house", "school", "office"], city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something that was in your home when you were a child.", "there was + singular", ["exactly one sentence", "must use there was", "must say where"]],
  ["Write one sentence about the people at a wedding or party you went to.", "there were + plural", ["exactly one sentence", "must use there were", "must name the event"]],
  ["Write one sentence about your old school: what was there, and what wasn't there?", "there was / there wasn't", ["exactly two sentences", "one with there was", "one with there wasn't"]],
  ["Write one sentence about the weather last winter in your city.", "there was + uncountable", ["exactly one sentence", "must use there was", "must name your city"]],
  ["Write one sentence about your street or village thirty years ago.", "there were no + plural", ["exactly one sentence", "must use there were no", "must include thirty years ago"]],
  ["Write one sentence about what was in your fridge yesterday.", "there was / were with food", ["exactly one sentence", "must name a food", "was or were matches the noun"]],
  ["Write one sentence about a trip: what was there to see?", "there was / were in a story", ["exactly one sentence", "must name the place", "must use there was or there were"]],
  ["Write one sentence about a time when there was nobody at home.", "there was nobody", ["exactly one sentence", "must use there was nobody", "must say when"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe the house or flat where you lived as a child. What was there? Write three or four sentences.",
    "there was / there were", ["there was + singular", "there were + plural", "past time words"]],
  ["Describe a wedding, party or holiday you remember. What was there, and who was there? Write three or four sentences.",
    "there was / were in a story", ["there were + people or guests", "there was + food or music", "no missing there"]],
  ["Describe your town or village in the past. Ask an older person if you can. Write three or four sentences.",
    "there was / were for the past", ["there was / there were", "there wasn't / there weren't", "a time in the past named"]],
  ["Describe your first school. What was there, and what was not there? Write three or four sentences.",
    "positive and negative there was / were", ["there was or there were", "there wasn't any or there weren't any", "school words"]],
  ["Describe a trip you took. What was there to see and do? Write three or four sentences.",
    "there was / were to describe a place", ["was or were matches the noun", "a place named", "past tense throughout"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/sentence-structure.existential.there-was-were.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);