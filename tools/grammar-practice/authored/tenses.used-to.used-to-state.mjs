// Hand-authored: tenses / used-to / used-to-state (B1).
// Speaking Pack batch 2, topic 10 (grammar-run/SPEAK-2.md). Tee approved B1 early.
//
// Tests ONE point (placement items): used to + BASE FORM for a past state or
// habit that is not true now ("I used to live near the sea", "There used to
// be a cinema here"). Every sentence shows the change: "but now ...",
// "not any more", "but he sold it", or a past time ("when I was ten").
//
// Triage: kept. Its siblings are didnt-use-to (negative, did + use), get-used-to
// (be/get used to + -ing) and would-habit / would-vs-used-to (C1). So: positive
// statements only, no questions, no didn't use to, no would.
//
// Distractors are the real learner errors, never a second right answer:
//   - "use to" in a positive sentence (the -d is heard as nothing);
//   - "was / am / is used to" + base form (mixed up with be used to);
//   - used to + -ing ("used to living") and used to + past ("used to went").
// "was used to + -ing" is never offered: "I was used to living alone" is
// correct English (= accustomed). Past simple is never offered either: "I
// lived near the sea" is also right.
//
// Typed keys are "used to + verb". The gate refuses a key that repeats a word
// printed in the sentence, so no build/transform sentence contains "to",
// "used" or the key's verb outside the bracket.
// Transform: 5 past simple + "not now" → used to / 5 past habit with often /
// always / usually → used to / 5 correct an error.
//
// Run: node tools/grammar-practice/authored/tenses.used-to.used-to-state.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "used-to", topic: "used-to-state", level: "B1", pv: "2.5" };
const BE = { i: ["was", "am"], sg: ["was", "is"], pl: ["were", "are"], there: ["was", "is"] };
const why = (form) => `This was true in the past but is not true now, so use used to + the base form: ${form}. Not use to, no -ing or past form after it, and no be before it.`;

/* ---------------- choose: 20 mcq ---------------- */
// [set, subj, base, ing, past, prompt, slots]
const CHOOSE = [
  ["A", "i", "live", "living", "lived", "I ______ near the {place} when I was a child, but now I live in {city}.",
    { place: ["sea", "river", "mountains", "lake"], city: ["Tashkent", "Samarkand", "Fergana", "Bukhara"] }],
  ["B", "sg", "have", "having", "had", "My grandfather ______ a big {thing} in the {place}, but he doesn't have one now.",
    { thing: ["garden", "orchard", "house", "farm"], place: ["village", "mountains", "country", "valley"] }],
  ["A", "sg", "be", "being", "was", "{name} ______ shy, but now she talks to everyone in our {group}.",
    { name: ["Madina", "Olga", "Sevara", "Nilufar"], group: ["class", "group", "team", "family"] }],
  ["A", "there", "be", "being", "was", "There ______ a cinema on our {street}, but now it is a {thing}.",
    { street: ["street", "road"], thing: ["supermarket", "bank", "café", "car park"] }],
  ["B", "sg", "go", "going", "went", "My father ______ to work by {transport}, but now he {now}.",
    { transport: ["bus", "metro", "minibus", "train"], now: ["drives", "takes a taxi", "works from home", "walks"] }],
  ["B", "pl", "live", "living", "lived", "We ______ in a small flat in {city}. Now we have a house with a {thing}.",
    { city: ["Tashkent", "Namangan", "Andijan", "Karshi"], thing: ["garden", "yard", "big kitchen", "balcony"] }],
  ["A", "i", "hate", "hating", "hated", "I ______ {food}, but now I love it.",
    { food: ["fish", "spinach", "garlic", "milk"] }],
  ["B", "sg", "be", "being", "was", "This {place} ______ very quiet, but now there are new {thing} everywhere.",
    { place: ["street", "village", "area", "district"], thing: ["shops", "buildings", "cafés", "houses"] }],
  ["A", "sg", "have", "having", "had", "My {who} ______ long {colour} hair, but now it is short.",
    { who: ["sister", "mother", "aunt", "cousin"], colour: ["dark", "black", "brown", "red"] }],
  ["B", "sg", "work", "working", "worked", "Our {teacher} ______ in {city} before she moved here.",
    { teacher: ["English teacher", "maths teacher", "music teacher", "history teacher"], city: ["Moscow", "Seoul", "Nukus", "Bukhara"] }],
  ["A", "i", "watch", "watching", "watched", "I ______ a lot of cartoons when I was {age}, but now I watch {thing}.",
    { age: ["six", "seven", "eight", "ten"], thing: ["films", "football", "the news", "series"] }],
  ["B", "there", "be", "being", "was", "There ______ many trees in our {place}, but they cut them down for a new {thing}.",
    { place: ["yard", "street", "park", "district"], thing: ["road", "car park", "building", "school"] }],
  ["A", "sg", "play", "playing", "played", "{name} ______ in the {team} at school, but now he plays for a city club.",
    { name: ["Sardor", "Timur", "Ilya", "Jasur"], team: ["football team", "volleyball team", "basketball team", "handball team"] }],
  ["B", "sg", "make", "making", "made", "My grandmother ______ her own {food}, but now her knees hurt and she buys it at the {shop}.",
    { food: ["bread", "non", "samsa", "manti"], shop: ["bazaar", "bakery", "shop", "corner shop"] }],
  ["A", "i", "be", "being", "was", "I ______ afraid of {thing}, but I am not afraid now.",
    { thing: ["dogs", "the dark", "water", "spiders"] }],
  ["B", "sg", "play", "playing", "played", "{name} ______ {sport} every day, but now he only plays at weekends.",
    { name: ["Bekzod", "Anton", "Rustam", "Aziz"], sport: ["football", "tennis", "volleyball", "basketball"] }],
  ["A", "pl", "visit", "visiting", "visited", "We ______ our {who} every {day} when they lived near us.",
    { who: ["grandparents", "cousins", "uncles", "relatives"], day: ["Sunday", "Friday", "weekend", "evening"] }],
  ["B", "sg", "be", "being", "was", "My {device} ______ very fast, but now it is old and {adj}.",
    { device: ["phone", "laptop", "tablet", "computer"], adj: ["slow", "very slow", "too slow"] }],
  ["A", "sg", "be", "being", "was", "This {bld} ______ a school, but now it is a {thing}.",
    { bld: ["building", "old building", "big building", "house"], thing: ["hospital", "museum", "hotel", "library"] }],
  ["B", "i", "go", "going", "went", "I ______ to bed at nine, but now I go to bed at {time}.",
    { time: ["eleven", "midnight", "half past ten", "twelve"] }],
].map(([set, subj, v, ing, past, prompt, slots]) => {
  const [was, am] = BE[subj];
  const options = set === "A"
    ? [`used to ${v}`, `use to ${v}`, `${was} used to ${v}`, `used to ${ing}`]
    : [`used to ${v}`, `used to ${past}`, `${am} used to ${v}`, `use to ${v}`];
  return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why: why(`used to ${v}`), slots };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Complete the sentence with used and the verb in brackets, in the right form.";
// [verb, source, slots] (no "to" in any sentence: the key would echo it)
const BUILD = [
  ["live", "When I was a child, I ______ (live) in a village near {city}. Now my home is in the {area}.",
    { city: ["Samarkand", "Bukhara", "Fergana", "Namangan"], area: ["city centre", "capital", "new district", "town"] }],
  ["have", "My uncle ______ (have) a small {shop} in the {where}, but he sold it last year.",
    { shop: ["shop", "café", "stall", "bakery"], where: ["bazaar", "market", "city centre", "old town"] }],
  ["be", "This {place} ______ (be) very quiet. Now there are new {thing} everywhere.",
    { place: ["street", "village", "area", "district"], thing: ["shops", "cafés", "buildings", "houses"] }],
  ["like", "{name} ______ (like) {thing}, but she doesn't any more.",
    { name: ["Gulnora", "Anna", "Zarina", "Malika"], thing: ["cartoons", "pop music", "computer games", "sweets"] }],
  ["go", "We ______ (go) camping in the {place} every {season}, but now we are too busy.",
    { place: ["mountains", "hills", "forest", "countryside"], season: ["summer", "spring", "autumn", "holiday"] }],
  ["play", "My father ______ (play) {sport} for a city team, but he stopped after his {thing}.",
    { sport: ["football", "volleyball", "basketball", "handball"], thing: ["injury", "accident", "wedding", "fortieth birthday"] }],
  ["work", "My mother ______ (work) at a {place}. Now she stays at home with my little {sib}.",
    { place: ["bank", "hospital", "school", "shop"], sib: ["brother", "sister", "sisters", "brothers"] }],
  ["be", "There ______ (be) a big {thing} in the middle of our {place}, but now it is gone.",
    { thing: ["tree", "fountain", "statue", "market"], place: ["village", "yard", "park", "square"] }],
  ["eat", "I ______ (eat) a lot of {food}, but now I am careful.",
    { food: ["sweets", "chips", "fast food", "sugar"] }],
  ["know", "Our neighbours ______ (know) everyone in our {place}, but now many new people live here.",
    { place: ["street", "building", "village", "area"] }],
  ["have", "Our {school} ______ (have) only one computer, but now every {room} has ten.",
    { school: ["school", "lyceum", "college", "library"], room: ["classroom", "floor", "group", "lab"] }],
  ["walk", "I ______ (walk) home after {thing}, but now my {who} drives me.",
    { thing: ["school", "lessons", "training", "work"], who: ["father", "brother", "uncle", "mother"] }],
  ["be", "My little {sib} ______ (be) afraid of {thing}, but now he loves them.",
    { sib: ["brother", "cousin", "nephew"], thing: ["dogs", "cats", "horses", "birds"] }],
  ["live", "My {who} ______ (live) in {city}, but they moved here last year.",
    { who: ["cousins", "grandparents", "aunt and uncle", "neighbours"], city: ["Nukus", "Termez", "Moscow", "Almaty"] }],
  ["wear", "{name} ______ (wear) glasses for {task}, but now he doesn't need them.",
    { name: ["Sherzod", "Pavel", "Doniyor", "Laziz"], task: ["reading", "school", "the computer", "driving"] }],
  ["drink", "My {who} ______ (drink) a lot of coffee. Now he has only {drink}.",
    { who: ["grandfather", "father", "uncle", "older brother"], drink: ["green tea", "black tea", "water", "milk"] }],
  ["ride", "I ______ (ride) my bike in the {place} every day when I was {age}.",
    { place: ["yard", "park", "street", "village"], age: ["ten", "eleven", "twelve", "nine"] }],
  ["be", "{city} ______ (be) much {adj} fifty years ago.",
    { city: ["Tashkent", "Samarkand", "Nukus", "Namangan"], adj: ["smaller", "quieter", "greener"] }],
  ["sleep", "As a baby, my {sib} ______ (sleep) all day. Now she runs around until {time}.",
    { sib: ["sister", "cousin", "little sister"], time: ["ten", "nine", "late", "midnight"] }],
  ["watch", "We ______ (watch) films at the old cinema in {city}, but it closed in the {when}.",
    { city: ["Tashkent", "Andijan", "Bukhara", "Fergana"], when: ["winter", "spring", "summer", "autumn"] }],
].map(([v, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source, key: `used to ${v}`, why: why(`used to ${v}`), slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const STATE = "Rewrite the two sentences as one, with used.";
const HABIT = "Rewrite the sentence with used instead of often, always or usually.";
const FIX = "This sentence has a mistake with used. Rewrite it correctly.";
const whyH = (form) => `A past habit that has stopped: used to + the base form, ${form}. Used already says it happened often.`;
const whyF = (bad, form) => `${bad} is wrong. After used, write to + the base form: ${form}.`;
// [instr, source, hint, verb, why|null, slots]
const TRANSFORM = [
  [STATE, "I lived in a small {home} in {city} as a child. I don't live there now.", "As a child, I ______ in a small {home} in {city}.", "live", null,
    { home: ["flat", "house", "village house"], city: ["Samarkand", "Bukhara", "Fergana", "Namangan"] }],
  [STATE, "Ten years ago, my {who} had a {car}. He doesn't have it now.", "Ten years ago, my {who} ______ a {car}.", "have", null,
    { who: ["father", "uncle", "grandfather", "brother"], car: ["red car", "motorbike", "small car", "white car"] }],
  [STATE, "This {place} was a factory. It isn't a factory now.", "This {place} ______ a factory.", "be", null,
    { place: ["building", "old building", "big building", "shopping centre"] }],
  [STATE, "When she was young, {name} liked {thing}. She doesn't like it now.", "When she was young, {name} ______ {thing}.", "like", null,
    { name: ["Dilnoza", "Irina", "Kamola", "Shahzoda"], thing: ["pop music", "chess", "sport", "ice cream"] }],
  [STATE, "There was a big {thing} near our {home}. It is not there now.", "There ______ a big {thing} near our {home}.", "be", null,
    { thing: ["tree", "park", "market", "playground"], home: ["house", "school", "flat", "college"] }],
  [HABIT, "When I was little, I often played {game} in the {place}.", "When I was little, I ______ {game} in the {place}.", "play", whyH("used to play"),
    { game: ["football", "hide-and-seek", "chess", "tag"], place: ["yard", "street", "park", "garden"] }],
  [HABIT, "Every summer, my {who} always went camping in the {place}.", "Every summer, my {who} ______ camping in the {place}.", "go", whyH("used to go"),
    { who: ["family", "cousins", "parents", "grandparents"], place: ["mountains", "hills", "forest", "countryside"] }],
  [HABIT, "In the past, my mother always made {food} on {day}.", "In the past, my mother ______ {food} on {day}.", "make", whyH("used to make"),
    { food: ["plov", "manti", "samsa", "lagman"], day: ["Sundays", "Fridays", "Saturdays", "holidays"] }],
  [HABIT, "At {school}, we usually wore a {uniform}.", "At {school}, we ______ a {uniform}.", "wear", whyH("used to wear"),
    { school: ["school", "my old school", "primary school", "our school"], uniform: ["uniform", "school uniform", "white shirt", "blue jacket"] }],
  [HABIT, "My {who} often told us stories in the {time}.", "My {who} ______ us stories in the {time}.", "tell", whyH("used to tell"),
    { who: ["grandfather", "grandmother", "uncle", "father"], time: ["evening", "evenings", "winter", "summer"] }],
  [FIX, "When I was {age}, I use to have {hair} hair.", "When I was {age}, I ______ {hair} hair.", "have", whyF("Use to", "used to have"),
    { age: ["ten", "twelve", "fourteen", "sixteen"], hair: ["long", "short", "curly", "dark"] }],
  [FIX, "She was used to live in {city} with her {who}.", "She ______ in {city} with her {who}.", "live", whyF("Was used to live", "used to live"),
    { city: ["Tashkent", "Kazan", "Andijan", "Urgench"], who: ["parents", "grandparents", "aunt", "sister"] }],
  [FIX, "We used to playing {game} after school with our {who}.", "We ______ {game} after school with our {who}.", "play", whyF("Used to playing", "used to play"),
    { game: ["football", "chess", "volleyball", "tennis"], who: ["neighbours", "cousins", "friends", "classmates"] }],
  [FIX, "My brother used to took the {transport} {when}.", "My brother ______ the {transport} {when}.", "take", whyF("Used to took", "used to take"),
    { transport: ["bus", "metro", "minibus", "tram"], when: ["every day", "every morning", "after school", "at night"] }],
  [FIX, "There use to be a {place} on our {street}.", "There ______ a {place} on our {street}.", "be", whyF("Use to", "used to be"),
    { place: ["cinema", "bakery", "market", "playground"], street: ["street", "road"] }],
].map(([instr, source, hint, v, w, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key: `used to ${v}`, why: w || why(`used to ${v}`), slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about where you used to live, or a place you used to go to as a child.", "used to + live / go", ["exactly one sentence", "must use used to", "must name a place"]],
  ["Write one sentence about a food you used to hate but like now.", "used to for a changed state", ["exactly one sentence", "must use used to", "must show it is different now"]],
  ["Write one sentence about a game you used to play as a child.", "used to + play", ["exactly one sentence", "must name the game", "used to + base form"]],
  ["Write one sentence about how your street or town used to be.", "there used to be", ["exactly one sentence", "must use there used to be", "must name the place"]],
  ["Write one sentence about something a family member used to do.", "used to with he or she", ["exactly one sentence", "must name the family member", "no -s or -ed after used to"]],
  ["Write one sentence about something you used to be afraid of.", "used to be + adjective", ["exactly one sentence", "must use used to be", "must name the thing"]],
  ["Write one sentence about what you used to watch or read, and what you do now.", "used to vs now", ["exactly two sentences", "one with used to", "one in the present simple"]],
  ["Write one sentence about a habit you used to have at school.", "used to for a past habit", ["exactly one sentence", "must use used to", "must say school"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Describe your life when you were ten. Where did you use to live, and what did you use to do every day? Write three or four sentences.",
    "used to for past states and habits", ["used to + base form", "at least two different verbs", "something that is different now"]],
  ["Describe how your town or neighbourhood has changed. What used to be there? Write three or four sentences.",
    "there used to be", ["there used to be", "now for the present", "a place named"]],
  ["Describe a person in your family: how they used to be and how they are now. Write three or four sentences.",
    "used to be vs now", ["used to be + adjective", "present simple for now", "he or she without -s after used to"]],
  ["Describe the games and hobbies you used to have as a child. Write three or four sentences.",
    "used to for past habits", ["used to play / used to go", "no use to in positive sentences", "a past time named"]],
  ["Describe your school days. What did you use to like and not like? Write three or four sentences.",
    "used to for past likes", ["used to like or used to love", "no used to + -ing", "school words"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.used-to.used-to-state.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);