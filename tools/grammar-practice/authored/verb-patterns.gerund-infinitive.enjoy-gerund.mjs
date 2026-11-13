// Hand-authored: verb-patterns / gerund-infinitive / enjoy-gerund (A2).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement foci: "enjoy + -ing" (She enjoys ______ in her free time) and
// "like/love + -ing (or to) but never bare infinitive" (My father loves cook…).
// So: enjoy takes ONLY -ing; like / love / hate take -ing or to, never the bare
// verb. Choose: 12 enjoy items (distractors: to + verb — the real transfer from
// want / would like —, bare verb, -s form); 8 like/love/hate items, where "to +
// verb" is NEVER offered (it is right), so the distractors are the bare verb,
// the -s form and "to + -ing". Build: 16 enjoy items (-ing only) and 4
// like/love/hate items whose `acceptable` lists the to-form too.
// Typed keys avoid verbs with spelling splits (travelling).
//
// Run: node tools/grammar-practice/authored/verb-patterns.gerund-infinitive.enjoy-gerund.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "verb-patterns", branch: "gerund-infinitive", topic: "enjoy-gerund", level: "A2", pv: "2.5" };

const EN = (ing) => `Enjoy is always followed by the -ing form: enjoy ${ing}. Never enjoy to + verb.`;
const LV = (v, ing) => `After ${v}, use the -ing form (${ing}) or to + verb, but never the bare verb.`;
const SP = { drop: (b, i) => ` Drop the final e: ${b} becomes ${i}.`, dbl: (b, i) => ` Double the last letter: ${b} becomes ${i}.`, ie: (b, i) => ` Change ie to y: ${b} becomes ${i}.` };

// enjoy options: -ing, to + base, base, -s/past
const e = (ing, base, other) => [ing, `to ${base}`, base, other];
// like/love/hate options: -ing, base, -s, to + -ing (to + base is NOT offered: it is right)
const l = (ing, base, s) => [ing, base, s, `to ${ing}`];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [e("reading", "read", "reads"), EN("reading"), "Malika enjoys ______ {things} {when}.",
    { things: ["books", "comics", "novels", "short stories"], when: ["before bed", "at the weekend", "in the evening", "on holiday"] }],
  [e("working", "work", "works"), EN("working"), "My grandfather enjoys ______ in the {place} every {time}.",
    { place: ["garden", "yard", "orchard", "vineyard"], time: ["morning", "evening", "afternoon", "day"] }],
  [e("cooking", "cook", "cooks"), EN("cooking"), "Do you enjoy ______ {food}, {name}?",
    { food: ["plov", "cakes", "soup", "Korean food"], name: ["Aziza", "Timur", "Olga", "Sardor"] }],
  [e("going", "go", "went"), "Enjoy (also enjoyed) is followed by the -ing form: enjoyed going. Never enjoyed to go or enjoyed went.", "We really enjoyed ______ to the {event} {when}.",
    { event: ["concert", "match", "festival", "circus"], when: ["last night", "on Saturday", "yesterday", "last week"] }],
  [e("doing", "do", "does"), EN("doing"), "Bobur doesn't enjoy ______ {chore} {when}.",
    { chore: ["the dishes", "homework", "the shopping", "housework"], when: ["at the weekend", "after dinner", "every day", "in the evening"] }],
  [e("playing", "play", "played"), EN("playing"), "The children enjoyed ______ with the {animal} at the {place}.",
    { animal: ["puppies", "kittens", "rabbits", "lambs"], place: ["farm", "village", "petting zoo", "animal centre"] }],
  [e("listening", "listen", "listens"), EN("listening"), "I enjoy ______ to {audio} on the {trip}.",
    { audio: ["music", "podcasts", "audiobooks", "English songs"], trip: ["bus", "metro", "train", "way home"] }],
  [e("drawing", "draw", "draws"), EN("drawing"), "My sister enjoys ______ pictures of {thing} in her {book}.",
    { thing: ["animals", "flowers", "people", "buildings"], book: ["notebook", "sketchbook", "diary", "art book"] }],
  [e("living", "live", "lived"), EN("living"), "Did you enjoy ______ in {city}, {name}?",
    { city: ["Samarkand", "Tashkent", "Moscow", "Seoul"], name: ["Kamila", "Rustam", "Olga", "Bekzod"] }],
  [e("talking", "talk", "talks"), EN("talking"), "Our teacher enjoys ______ about {topic} with us {when}.",
    { topic: ["history", "films", "books", "science"], when: ["after class", "during breaks", "on Fridays", "in the last lesson"] }],
  [e("eating", "eat", "eats"), EN("eating"), "Most people enjoy ______ {food} {when}.",
    { food: ["ice cream", "watermelon", "fresh fruit", "cold soup"], when: ["in summer", "on hot days", "in July", "after lunch"] }],
  [e("riding", "ride", "rides"), EN("riding"), "Timur enjoys ______ his {vehicle} in the {place}.",
    { vehicle: ["bike", "scooter", "horse", "motorbike"], place: ["park", "village", "countryside", "city"] }],
  [l("cooking", "cook", "cooks"), LV("loves", "cooking"), "My father loves ______ {food} for the family on {day}.",
    { food: ["plov", "breakfast", "shashlik", "soup"], day: ["Sundays", "Fridays", "Saturdays", "holidays"] }],
  [l("getting", "get", "gets"), LV("hate", "getting"), "I hate ______ up early when it's {weather}.",
    { weather: ["cold", "dark", "raining", "snowing"] }],
  [l("playing", "play", "plays"), LV("like", "playing"), "Do you like ______ {game}, {name}?",
    { game: ["chess", "volleyball", "computer games", "cards"], name: ["Lola", "Anvar", "Malika", "Jasur"] }],
  [l("swimming", "swim", "swims"), LV("love", "swimming"), "Kids love ______ in the {water} with their {who}.",
    { water: ["river", "lake", "pool", "sea"], who: ["friends", "cousins", "dads", "brothers"] }],
  [l("driving", "drive", "drives"), LV("like", "driving"), "My mum doesn't like ______ in the {place} {how}.",
    { place: ["city centre", "rain", "snow", "dark"], how: ["very much", "at all", "alone", "much"] }],
  [l("writing", "write", "writes"), LV("likes", "writing"), "Aziza likes ______ new words in a {book} {when}.",
    { book: ["notebook", "small notebook", "diary", "special book"], when: ["after class", "every day", "before bed", "in the evening"] }],
  [l("watching", "watch", "watches"), LV("love", "watching"), "Lots of teenagers love ______ videos about {topic} on their {device}.",
    { topic: ["football", "cooking", "games", "science"], device: ["phones", "tablets", "laptops", "computers"] }],
  [l("taking", "take", "takes"), LV("hates", "taking"), "Grandma hates ______ the {transport} because it's {adj}.",
    { transport: ["bus", "metro", "train", "minibus"], adj: ["crowded", "slow", "noisy", "hot"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the sentence with the correct form of the verb in brackets.";
const BUILD = [
  ["dancing", EN("dancing") + SP.drop("dance", "dancing"), "Sevara enjoys ______ (dance) at {event} with her {who}.",
    { event: ["weddings", "parties", "school concerts", "family events"], who: ["sisters", "friends", "cousins", "classmates"] }],
  ["shopping", EN("shopping") + SP.dbl("shop", "shopping"), "I don't enjoy ______ (shop) for {things} {how}.",
    { things: ["clothes", "shoes", "presents", "food"], how: ["with my brother", "alone", "online", "with my mum"] }],
  ["watching", EN("watching"), "Do your parents enjoy ______ (watch) {show} {when}?",
    { show: ["the news", "old films", "football", "comedy shows"], when: ["in the evening", "at night", "after dinner", "on Sundays"] }],
  ["fixing", EN("fixing"), "Akmal enjoys ______ (fix) old {thing} in his {place}.",
    { thing: ["bikes", "radios", "phones", "clocks"], place: ["garage", "room", "workshop", "free time"] }],
  ["sitting", EN("sitting") + SP.dbl("sit", "sitting"), "We enjoyed ______ (sit) by the {water} {when}.",
    { water: ["river", "lake", "fountain", "pool"], when: ["yesterday evening", "last night", "on Sunday", "all afternoon"] }],
  ["helping", EN("helping"), "My little sister enjoys ______ (help) Mum in the {room} {when}.",
    { room: ["kitchen", "garden", "shop", "yard"], when: ["every day", "after school", "at weekends", "on Sundays"] }],
  ["waiting", EN("waiting"), "Nobody enjoys ______ (wait) in a long queue at the {place}.",
    { place: ["bank", "post office", "airport", "hospital"] }],
  ["running", EN("running") + SP.dbl("run", "running"), "Does Lola enjoy ______ (run) in the {place} {when}?",
    { place: ["park", "stadium", "street", "sports ground"], when: ["in the morning", "before work", "at weekends", "every evening"] }],
  ["meeting", EN("meeting"), "I really enjoyed ______ (meet) your {who} {when}.",
    { who: ["family", "parents", "friends", "cousins"], when: ["last night", "yesterday", "on Saturday", "at the party"] }],
  ["speaking", EN("speaking"), "Jasur doesn't enjoy ______ (speak) in front of the {group} because he feels {feel}.",
    { group: ["class", "whole school", "teachers", "camera"], feel: ["shy", "nervous", "scared", "worried"] }],
  ["making", LV("loves", "making") + SP.drop("make", "making"), "My grandmother loves ______ (make) {food} for her {who}.",
    { food: ["samsa", "jam", "bread", "sweets"], who: ["grandchildren", "neighbours", "guests", "family"] }, ["to make"]],
  ["writing", LV("like", "writing") + SP.drop("write", "writing"), "Do you like ______ (write) {texts} in English, {name}?",
    { texts: ["emails", "stories", "letters", "messages"], name: ["Nodira", "Sardor", "Olga", "Anvar"] }, ["to write"]],
  ["losing", LV("hates", "losing") + SP.drop("lose", "losing"), "Olga hates ______ (lose) at {game} against her {who}.",
    { game: ["chess", "cards", "tennis", "video games"], who: ["brother", "sister", "dad", "friends"] }, ["to lose"]],
  ["trying", EN("trying"), "The tourists enjoyed ______ (try) {food} at the {place}.",
    { food: ["plov", "samsa", "fresh bread", "local fruit"], place: ["bazaar", "market", "café", "festival"] }],
  ["lying", EN("lying") + SP.ie("lie", "lying"), "Our dog enjoys ______ (lie) in the {place} {when}.",
    { place: ["sun", "garden", "shade", "yard"], when: ["after lunch", "all day", "in the afternoon", "in summer"] }],
  ["chatting", EN("chatting") + SP.dbl("chat", "chatting"), "I enjoy ______ (chat) with my {who} {when}.",
    { who: ["friends", "cousins", "grandparents", "classmates"], when: ["in the evening", "at weekends", "after school", "every night"] }],
  ["playing", EN("playing"), "Students usually enjoy ______ (play) {game} in {lesson}.",
    { game: ["word games", "quiz games", "team games", "board games"], lesson: ["English lessons", "class", "the break", "PE"] }],
  ["swimming", LV("loves", "swimming") + SP.dbl("swim", "swimming"), "Kamola loves ______ (swim) in the {water} {when}.",
    { water: ["sea", "lake", "pool", "river"], when: ["in summer", "every morning", "on holiday", "at weekends"] }, ["to swim"]],
  ["staying", EN("staying"), "Did you enjoy ______ (stay) at the {place}, {name}?",
    { place: ["hotel", "camp", "guesthouse", "sanatorium"], name: ["Bobur", "Lola", "Dilshod", "Nigora"] }],
  ["telling", EN("telling"), "My uncle enjoys ______ (tell) {stories} about his {time}.",
    { stories: ["stories", "funny stories", "old stories", "long stories"], time: ["childhood", "school days", "army days", "first job"] }],
].map(([key, why, source, slots, acceptable]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots, ...(acceptable ? { acceptable } : {}),
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const TO_ENJOY = "Rewrite the sentence with enjoy. Change the form of the second verb.";
const MAKE_NEG = "Rewrite the sentence in the negative.";
const HOBBY = "Say the same thing with enjoy + -ing.";
const TRANSFORM = [
  // like / love to … -> enjoy -ing (5)
  [TO_ENJOY, "I like to paint {things} {when}.", "I enjoy ______ (paint) {things} {when}.", "painting",
    "Like can take to + verb, but enjoy can't: enjoy painting.",
    { things: ["flowers", "mountains", "people", "animals"], when: ["at weekends", "in my free time", "after school", "on holiday"] }],
  [TO_ENJOY, "My brother likes to play {game} with his {who}.", "My brother enjoys ______ (play) {game} with his {who}.", "playing",
    "After enjoys, the next verb takes -ing: enjoys playing.",
    { game: ["football", "chess", "cards", "basketball"], who: ["friends", "classmates", "cousins", "neighbours"] }],
  [TO_ENJOY, "We love to walk in the {place} {when}.", "We enjoy ______ (walk) in the {place} {when}.", "walking",
    "Love can take to + verb, but enjoy takes only -ing: enjoy walking.",
    { place: ["park", "mountains", "old city", "forest"], when: ["in autumn", "on Sundays", "after dinner", "in spring"] }],
  [TO_ENJOY, "Nodira likes to bake {food} for her {who}.", "Nodira enjoys ______ (bake) {food} for her {who}.", "baking",
    "Enjoys + -ing: baking. Drop the final e before -ing.",
    { food: ["cakes", "bread", "cookies", "pies"], who: ["friends", "family", "classmates", "neighbours"] }],
  [TO_ENJOY, "They love to sing {songs} at {event}.", "They enjoy ______ (sing) {songs} at {event}.", "singing",
    "Enjoy is followed by the -ing form: enjoy singing.",
    { songs: ["Uzbek songs", "old songs", "pop songs", "English songs"], event: ["parties", "weddings", "family dinners", "school concerts"] }],
  // positive -> negative (5)
  [MAKE_NEG, "Lola enjoys getting up early on {day} to {act}.", "Lola ______ (get) up early on {day} to {act}.", "doesn't enjoy getting",
    "Lola is one person, so the negative is doesn't enjoy. The next verb keeps -ing: getting.",
    { day: ["Saturdays", "Sundays", "Mondays", "holidays"], act: ["go running", "study", "cook breakfast", "walk the dog"] }],
  [MAKE_NEG, "I enjoy doing {task} {when}.", "I ______ (do) {task} {when}.", "don't enjoy doing",
    "With I, the negative is don't enjoy, and the next verb keeps -ing: doing.",
    { task: ["homework", "the cleaning", "the ironing", "the washing"], when: ["on Sundays", "in the evening", "at night", "alone"] }],
  [MAKE_NEG, "My parents enjoy watching {show} {when}.", "My parents ______ (watch) {show} {when}.", "don't enjoy watching",
    "My parents is plural, so use don't enjoy + watching.",
    { show: ["horror films", "cartoons", "talent shows", "football"], when: ["late at night", "at weekends", "after work", "together"] }],
  [MAKE_NEG, "Rustam enjoys answering {thing} in {lesson}.", "Rustam ______ (answer) {thing} in {lesson}.", "doesn't enjoy answering",
    "Rustam is one person, so use doesn't enjoy (no -s on enjoy), then answering.",
    { thing: ["questions", "the teacher's questions", "hard questions", "long questions"], lesson: ["class", "maths", "physics", "history"] }],
  [MAKE_NEG, "We enjoy sitting in the {row} row of the {room}.", "We ______ (sit) in the {row} row of the {room}.", "don't enjoy sitting",
    "With we, the negative is don't enjoy, then sitting (double the t).",
    { row: ["front", "back", "first", "last"], room: ["bus", "cinema", "classroom", "theatre"] }],
  // activity + "I love it" -> enjoy + -ing (5)
  [HOBBY, "I take photos of {things} {where}. It's fun for me.", "I enjoy ______ (take) photos of {things} {where}.", "taking",
    "Enjoy + -ing: taking. Drop the final e of take.",
    { things: ["buildings", "flowers", "birds", "the sky"], where: ["in the city", "in the park", "on holiday", "from my window"] }],
  [HOBBY, "Bekzod plays football with his {who} {when}. He loves it.", "Bekzod enjoys ______ (play) football with his {who} {when}.", "playing",
    "Enjoys + -ing: playing.",
    { who: ["friends", "brothers", "cousins", "classmates"], when: ["after school", "at weekends", "every evening", "on Sundays"] }],
  [HOBBY, "My mum makes {food} for the {who}. It makes her happy.", "My mum enjoys ______ (make) {food} for the {who}.", "making",
    "Enjoys + -ing: making. Drop the final e of make.",
    { food: ["plov", "samsa", "cakes", "dinner"], who: ["whole family", "guests", "neighbours", "children"] }],
  [HOBBY, "Dilnoza writes in her {book} {when}. It relaxes her.", "Dilnoza enjoys ______ (write) in her {book} {when}.", "writing",
    "Enjoys + -ing: writing, with one t.",
    { book: ["diary", "notebook", "journal", "blog"], when: ["every evening", "before bed", "at weekends", "after school"] }],
  [HOBBY, "My friends and I ride our bikes {where} {when}. It's great fun.", "My friends and I enjoy ______ (ride) our bikes {where} {when}.", "riding",
    "Enjoy + -ing: riding. Drop the final e of ride.",
    { where: ["in the park", "by the river", "around the city", "in the village"], when: ["after school", "at weekends", "in summer", "on Sundays"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about something you enjoy doing at the weekend.", "enjoy + -ing", ["exactly one sentence", "must use I enjoy", "must include at the weekend"]],
  ["Write one sentence about something you don't enjoy doing at home.", "don't enjoy + -ing", ["exactly one sentence", "must use don't enjoy", "must name a job at home"]],
  ["Write one sentence about what a friend enjoys doing.", "enjoys + -ing", ["exactly one sentence", "must name the friend", "must use enjoys + -ing"]],
  ["Ask a new classmate a question about their free time.", "Do you enjoy + -ing … ?", ["exactly one question", "must use Do you enjoy", "must end with a question mark"]],
  ["Write one sentence about something you loved doing when you were a child.", "loved + -ing", ["exactly one sentence", "must use loved", "must use an -ing form"]],
  ["Write one sentence about something you hate doing in the morning.", "hate + -ing", ["exactly one sentence", "must use hate", "must include in the morning"]],
  ["Write one sentence about something your family enjoys doing together.", "enjoy + -ing", ["exactly one sentence", "must use together", "must use enjoy + -ing"]],
  ["Write two sentences: one thing you enjoy doing in summer and one thing you don't enjoy doing in winter.", "enjoy / don't enjoy + -ing", ["exactly two sentences", "one positive, one negative", "-ing form after enjoy in both"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell a new friend about your free time. What do you enjoy doing, and what don't you enjoy? Write three or four sentences.",
    "enjoy / don't enjoy + -ing", ["enjoy + -ing", "don't enjoy + -ing", "no enjoy to + verb"]],
  ["Describe a person in your family and the things they love and hate doing. Write three or four sentences.",
    "love / hate / enjoy + -ing", ["loves or enjoys + -ing", "hates + -ing", "no bare verb after love or hate"]],
  ["Describe your last holiday or a special day. What did you enjoy doing? Write three or four sentences.",
    "enjoyed + -ing", ["enjoyed + -ing", "two or more different -ing forms", "past time words like last summer"]],
  ["Compare yourself and your best friend: what do you both enjoy doing, and what is different? Write three or four sentences.",
    "enjoy / like + -ing for comparing", ["we both enjoy + -ing", "he / she enjoys + -ing", "but for a difference"]],
  ["Your teacher asks: \"What do you enjoy doing in English lessons?\" Answer in three or four sentences.",
    "enjoy + -ing with study activities", ["enjoy + -ing", "don't enjoy + -ing", "a reason with because"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/verb-patterns.gerund-infinitive.enjoy-gerund.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
