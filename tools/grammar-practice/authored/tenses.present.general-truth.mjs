// Hand-authored: tenses / present / general-truth (A2).
//
// Tests ONE point: the present simple states a fact that is always true
// (science, nature, how things work). The fact itself, its subject and its
// verb are never slotted; slots only change the everyday consequence after
// "so ...", and every filler was checked to keep the fact true.
//
// Distractors: present continuous (the Russian/Uzbek "it is happening"
// reading), the wrong agreement form, and the present perfect. Facts carry no
// "now" marker, and each "so ..." clause forces the general reading.
//
// Run: node tools/grammar-practice/authored/tenses.present.general-truth.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "tenses", branch: "present", topic: "general-truth", level: "A2", pv: "2.5" };

// [simple, continuous, wrong agreement, perfect]
const opts = (simple, cont, agree, perf) => [simple, cont, agree, perf];
const FACT = "This is a fact that is always true, so use the present simple, not the present continuous.";
const one = (subj, v) => `${FACT} ${subj} is singular, so the verb takes -s: ${v}.`;
const many = (subj, v) => `${FACT} ${subj} is plural, so use the base form: ${v}.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["Water", 1, ["boils", "is boiling", "boil", "has boiled"], "Water ______ at 100 degrees, so be careful with the {thing} in the {room}.",
    { thing: ["kettle", "pot", "teapot", "pan"], room: ["kitchen", "café", "office kitchen", "staff room"] }],
  ["The sun", 1, ["sets", "is setting", "set", "has set"], "The sun ______ in the west, so our {room} is {state} in the evening.",
    { room: ["balcony", "living room", "kitchen", "classroom"], state: ["hot", "sunny", "bright", "warm"] }],
  ["Plants", 0, ["need", "are needing", "needs", "have needed"], "Plants ______ water and light, so I put my {plant} near the {place}.",
    { plant: ["flowers", "small tree", "herbs", "basil"], place: ["window", "balcony", "glass door", "lamp"] }],
  ["Water", 1, ["freezes", "is freezing", "freeze", "has frozen"], "Water ______ at zero degrees, so the {place} near our {building} is icy in January.",
    { place: ["path", "road", "pond", "river"], building: ["school", "house", "college", "village"] }],
  ["Cats", 0, ["see", "are seeing", "sees", "have seen"], "Cats ______ well in the dark, so our {pet} often walks around the {place} at night.",
    { pet: ["cat", "kitten", "old cat", "little cat"], place: ["house", "garden", "yard", "flat"] }],
  ["The Earth", 1, ["goes", "is going", "go", "has gone"], "Our {subject} teacher showed us with {object} that the Earth ______ round the Sun.",
    { subject: ["geography", "physics", "science", "astronomy"], object: ["a ball", "a lamp", "a small model", "an orange"] }],
  ["Oil", 1, ["floats", "is floating", "float", "has floated"], "Oil ______ on water. You can see this when you wash a {dish} in the {place}.",
    { dish: ["pan", "plate", "pot", "frying pan"], place: ["sink", "kitchen", "basin", "bathroom"] }],
  ["Bees", 0, ["make", "are making", "makes", "have made"], "Bees ______ honey, and my {person} sells it at the {place}.",
    { person: ["uncle", "grandfather", "neighbour", "aunt"], place: ["bazaar", "market", "roadside", "village shop"] }],
  ["Light", 1, ["travels", "is travelling", "travel", "has travelled"], "Light ______ faster than sound, so in a {weather} you see the flash before the {noise}.",
    { weather: ["storm", "thunderstorm", "big storm", "summer storm"], noise: ["thunder", "sound", "noise", "bang"] }],
  ["Hot air", 1, ["rises", "is rising", "rise", "has risen"], "Hot air ______, so the top floor of our {building} is always {state} in summer.",
    { building: ["school", "house", "office", "dormitory"], state: ["hot", "warm", "stuffy", "the hottest"] }],
  ["Fish", 0, ["live", "are living", "lives", "have lived"], "Fish ______ in water, so my {pet} needs clean water in its {tank}.",
    { pet: ["goldfish", "little fish", "fish", "pet fish"], tank: ["tank", "bowl", "aquarium", "glass tank"] }],
  ["Metal", 1, ["gets", "is getting", "get", "has got"], "Metal ______ hot in the sun, so don't touch the {thing} in the {place} in July.",
    { thing: ["car door", "slide", "bench", "gate"], place: ["park", "yard", "street", "playground"] }],
  ["A week", 1, ["has", "is having", "have", "has had"], "A week ______ seven days, and my {lesson} classes are on {days}.",
    { lesson: ["English", "piano", "swimming", "chess"], days: ["Monday and Thursday", "Tuesdays", "Wednesdays and Saturdays", "weekends"] }],
  ["Dogs", 0, ["smell", "are smelling", "smells", "have smelled"], "Dogs ______ better than people, so my {pet} always finds the {food} in my bag.",
    { pet: ["dog", "puppy", "old dog", "little dog"], food: ["sausage", "bread", "cheese", "meat"] }],
  ["Many trees", 0, ["lose", "are losing", "loses", "have lost"], "Many trees ______ their leaves in autumn, so we clean the {place} near our {building} a lot.",
    { place: ["yard", "path", "street", "garden"], building: ["house", "school", "flat", "office"] }],
  ["Bread", 1, ["becomes", "is becoming", "become", "has become"], "Bread ______ hard if you leave it on the {place} for {time}.",
    { place: ["table", "windowsill", "counter", "plate"], time: ["two days", "a day", "a long time", "three days"] }],
  ["Cows", 0, ["eat", "are eating", "eats", "have eaten"], "Cows ______ grass, so my grandfather takes them to the {place} every {time}.",
    { place: ["field", "hills", "riverside", "mountains"], time: ["morning", "day", "afternoon", "summer"] }],
  ["Rain", 1, ["comes", "is coming", "come", "has come"], "Rain ______ from clouds, so when the sky is {colour}, I take my {thing}.",
    { colour: ["grey", "dark", "dark grey", "black"], thing: ["umbrella", "raincoat", "jacket", "boots"] }],
  ["People", 0, ["drink", "are drinking", "drinks", "have drunk"], "People ______ more water in hot weather, so we always take {drink} to the {place}.",
    { drink: ["water", "a big bottle", "two bottles", "cold water"], place: ["park", "beach", "stadium", "field"] }],
  ["Many birds", 0, ["fly", "are flying", "flies", "have flown"], "Many birds ______ south when it gets cold, so our {place} is quiet in {month}.",
    { place: ["garden", "park", "yard", "village"], month: ["December", "January", "February", "winter"] }],
].map(([subj, sg, options, prompt, slots]) => ({
  ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0,
  why: sg ? one(subj, options[0]) : many(subj, options[0]), slots,
}));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Complete the fact with the present simple form of the verb in brackets.";
const BUILD = [
  ["The sun", 1, "rises", "The sun ______ (rise) in the east, so the {part} of our {building} gets light first.",
    { part: ["kitchen", "balcony", "top floor", "front"], building: ["house", "school", "flat", "dormitory"] }],
  ["Ice", 1, "floats", "Ice ______ (float) on water, so you can see it on the {place} in {month}.",
    { place: ["river", "lake", "pond", "canal"], month: ["January", "February", "December", "winter"] }],
  ["A spider", 1, "has", "A spider ______ (have) eight legs, so my little {person} is afraid of it in the {room}.",
    { person: ["sister", "brother", "cousin", "nephew"], room: ["bathroom", "kitchen", "garage", "bedroom"] }],
  ["Paper", 1, "burns", "Paper ______ (burn) easily, so keep it away from the {thing} in the {room}.",
    { thing: ["stove", "heater", "candles", "fire"], room: ["kitchen", "living room", "classroom", "office"] }],
  ["Plants", 0, "grow", "Plants ______ (grow) towards the light, so I turn my {plant} every {period}.",
    { plant: ["flowers", "cactus", "basil", "little tree"], period: ["week", "few days", "Sunday", "morning"] }],
  ["Smoke", 1, "goes", "Smoke ______ (go) up, so we open the {thing} when we cook {food}.",
    { thing: ["window", "top window", "kitchen door", "balcony door"], food: ["plov", "meat", "shashlik", "samsa"] }],
  ["Cats", 0, "sleep", "Cats ______ (sleep) for many hours a day, so our {pet} is always on the {place}.",
    { pet: ["cat", "kitten", "old cat", "grey cat"], place: ["sofa", "bed", "carpet", "windowsill"] }],
  ["Milk", 1, "turns", "Milk ______ (turn) sour outside the fridge, so my mother buys it in {size} bottles at the {shop}.",
    { size: ["small", "little", "half-litre", "plastic"], shop: ["market", "corner shop", "bazaar", "supermarket"] }],
  ["The Earth", 1, "moves", "Our {subject} teacher says that the Earth ______ (move) around the Sun at a very {adj} speed.",
    { subject: ["geography", "physics", "science", "astronomy"], adj: ["high", "great", "steady", "even"] }],
  ["Fish", 0, "swim", "Fish ______ (swim) with their tails, so my {pet} moves fast in its {tank}.",
    { pet: ["goldfish", "little fish", "fish", "pet fish"], tank: ["tank", "bowl", "aquarium", "glass tank"] }],
  ["Children", 0, "need", "Children ______ (need) a lot of sleep, so my {person} goes to bed at {time}.",
    { person: ["little brother", "little sister", "son", "daughter"], time: ["eight", "nine", "half past eight", "8:30"] }],
  ["Camels", 0, "drink", "Camels ______ (drink) a lot of water at one time, so they can walk across the {place} for {days}.",
    { place: ["desert", "Kyzylkum", "hot sand", "dry land"], days: ["days", "a week", "many days", "five days"] }],
  ["Glass", 1, "breaks", "Glass ______ (break) easily, so carry the {thing} with {care}.",
    { thing: ["mirror", "window", "vase", "glass table"], care: ["two hands", "care", "a friend", "a blanket around it"] }],
  ["Bees", 0, "visit", "Bees ______ (visit) flowers, so there are many in my grandmother's {place} in {season}.",
    { place: ["garden", "yard", "orchard", "village"], season: ["spring", "summer", "May", "June"] }],
  ["Thunder", 1, "comes", "Thunder ______ (come) after lightning, so I count to {n} after the {thing}.",
    { n: ["three", "five", "ten", "seven"], thing: ["flash", "bright light", "white flash", "flash of light"] }],
  ["An elephant", 1, "eats", "An elephant ______ (eat) a lot of grass, so the zoo in {city} buys {amount} of food every day.",
    { city: ["Tashkent", "Samarkand", "Moscow", "Almaty"], amount: ["tons", "a lot", "kilos", "many kilos"] }],
  ["Rain", 1, "makes", "Rain ______ (make) the {thing} wet and slippery, so {who} walk carefully.",
    { thing: ["roads", "steps", "streets", "paths"], who: ["we", "people", "children", "students"] }],
  ["People", 0, "feel", "People ______ (feel) tired after a long {activity}, so we rest at {place}.",
    { activity: ["walk", "game", "lesson", "day"], place: ["home", "the café", "the teahouse", "my friend's house"] }],
  ["Water", 1, "covers", "Water ______ (cover) most of the Earth, so we see a lot of {colour} on a {map}.",
    { colour: ["blue", "dark blue", "light blue", "sea blue"], map: ["map", "globe", "world map", "satellite photo"] }],
  ["Babies", 0, "cry", "Babies ______ (cry) when they are hungry, so my {person} feeds my little {sibling} often.",
    { person: ["mother", "aunt", "sister", "grandmother"], sibling: ["brother", "sister", "cousin", "nephew"] }],
].map(([subj, sg, key, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key,
  why: sg ? one(subj, key) : many(subj, key), slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const NOW_TO_FACT = "The first sentence is about now. Complete the second sentence as a fact that is always true.";
const ONE_THING = "Rewrite the fact about one animal or thing. Keep the present simple.";
const PAST_TO_FACT = "The first sentence tells a past event. Complete the second sentence as a general fact.";
const TRANSFORM = [
  // now (continuous) -> always (simple) (5)
  [NOW_TO_FACT, "The water in the {pot} on the {place} is boiling now.", "Water ______ (boil) at 100 degrees, so the {pot} on the {place} gets very hot.", "boils",
    "A fact about water in general takes the present simple: boils, not is boiling.",
    { pot: ["kettle", "pot", "teapot", "pan"], place: ["stove", "cooker", "fire", "hob"] }],
  [NOW_TO_FACT, "Look, the ice on the {place} is melting in the {weather}.", "Ice ______ (melt) when it gets warm, so the {place} is wet in the {weather}.", "melts",
    "A rule about ice in general takes the present simple: melts.",
    { place: ["road", "path", "roof", "steps"], weather: ["sun", "sunshine", "warm air", "spring sun"] }],
  [NOW_TO_FACT, "Our cat is sleeping on the {place} in the {room} right now.", "Cats ______ (sleep) a lot, so you often find ours on the {place} in the {room}.", "sleep",
    "Cats in general is plural, and a general fact takes the present simple: sleep.",
    { place: ["sofa", "carpet", "chair", "bed"], room: ["living room", "bedroom", "kitchen", "hall"] }],
  [NOW_TO_FACT, "The sun is going down behind the {place} now. We can see it from the {spot}.", "The sun ______ (set) in the west, so we see it go down behind the {place} from the {spot}.", "sets",
    "Where the sun goes down is always true, so use the present simple: sets.",
    { place: ["hills", "mountains", "trees", "houses"], spot: ["balcony", "roof", "kitchen", "garden"] }],
  [NOW_TO_FACT, "The plants in my {room} are leaning towards the {thing}.", "Plants ______ (grow) towards light, so the ones in my {room} lean towards the {thing}.", "grow",
    "Plants is plural, and how plants grow is a general fact: grow.",
    { room: ["bedroom", "kitchen", "office", "classroom"], thing: ["window", "lamp", "balcony door", "sun"] }],
  // plural -> one (5)
  [ONE_THING, "Dogs hear very well, so they bark at {sound} in the {place}.", "A dog ______ (hear) very well, so it barks at {sound} in the {place}.", "hears",
    "A dog is singular, so hear becomes hears.",
    { sound: ["cars", "bikes", "people", "noises"], place: ["street", "yard", "garden", "building"] }],
  [ONE_THING, "Bees make honey from {thing} in the {place}.", "A bee ______ (make) honey from {thing} in the {place}.", "makes",
    "A bee is singular, so make becomes makes.",
    { thing: ["flowers", "fruit trees", "garden flowers", "wild flowers"], place: ["mountains", "garden", "fields", "village"] }],
  [ONE_THING, "Camels carry heavy {things} across the {place}.", "A camel ______ (carry) heavy {things} across the {place}.", "carries",
    "A camel is singular. Carry ends in a consonant + y, so it becomes carries.",
    { things: ["bags", "loads", "boxes", "goods"], place: ["desert", "sand", "Kyzylkum", "dry land"] }],
  [ONE_THING, "Spiders catch {insects} with their webs in the {place}.", "A spider ______ (catch) {insects} with its web in the {place}.", "catches",
    "A spider is singular. Catch ends in -ch, so it becomes catches.",
    { insects: ["flies", "small insects", "mosquitoes", "bugs"], place: ["corner", "garden", "window", "garage"] }],
  [ONE_THING, "Owls see well in the dark, so they find {food} in the {place}.", "An owl ______ (see) well in the dark, so it finds {food} in the {place}.", "sees",
    "An owl is singular, so see becomes sees.",
    { food: ["mice", "food", "small animals", "insects"], place: ["fields", "forest", "garden", "mountains"] }],
  // past event -> general fact (5)
  [PAST_TO_FACT, "My {drink} got cold quickly on the {place} yesterday.", "Hot {drink} ______ (get) cold quickly on the {place} in winter.", "gets",
    "This is now a general fact, not one past event, so use the present simple: gets.",
    { drink: ["tea", "coffee", "milk", "soup"], place: ["balcony", "terrace", "cold balcony", "porch"] }],
  [PAST_TO_FACT, "The milk in my {container} went sour in the warm {place} last week.", "Milk ______ (go) sour in a warm {place}, so keep your {container} in the fridge.", "goes",
    "This is a general fact about milk, so use the present simple: goes.",
    { container: ["bottle", "jug", "cup", "glass"], place: ["room", "car", "bag", "kitchen"] }],
  [PAST_TO_FACT, "My phone battery died quickly in {weather} on our trip to {place}.", "Phone batteries ______ (die) quickly in {weather}, so keep your phone warm when you visit {place}.", "die",
    "Phone batteries is plural, and this is a general fact: die.",
    { weather: ["the cold", "cold weather", "the frost", "the snow"], place: ["Chimgan", "the mountains", "Moscow", "Siberia"] }],
  [PAST_TO_FACT, "The river near {city} froze last {month}.", "Water ______ (freeze) at zero degrees, so the river near {city} is often icy in {month}.", "freezes",
    "This is a scientific fact, so use the present simple: freezes.",
    { city: ["Tashkent", "Chirchik", "Samarkand", "Nukus"], month: ["January", "December", "February", "winter"] }],
  [PAST_TO_FACT, "My bike got rusty in {weather} outside the {place} last year.", "Iron ______ (rust) in {weather}, so don't leave your bike outside the {place}.", "rusts",
    "This is a general fact about iron, so use the present simple: rusts.",
    { weather: ["the rain", "wet weather", "the snow", "damp air"], place: ["house", "shop", "school", "garage"] }],
].map(([instr, source, hint, key, why, slots]) => ({
  ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots,
}));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence with a fact about water.", "a present simple verb with -s",
    ["exactly one sentence", "must be always true", "must not use the present continuous"]],
  ["Write one sentence with a fact about an animal.", "a present simple verb",
    ["exactly one sentence", "must be about an animal in general", "must be true"]],
  ["Write one sentence about the weather in Uzbekistan that is true every year.", "a present simple verb",
    ["exactly one sentence", "must name a season or month", "no now or right now"]],
  ["Write one sentence with a fact about the sun or the moon.", "rises, sets or shines",
    ["exactly one sentence", "must be a scientific fact", "must use the present simple"]],
  ["Write one sentence with a fact about plants.", "plants plus a base-form verb",
    ["exactly one sentence", "must use plants as the subject", "must be always true"]],
  ["Write one sentence with a fact about the human body.", "a present simple verb",
    ["exactly one sentence", "must be true for all people", "must use the present simple"]],
  ["Write one sentence with a fact about food, for example what happens to bread, milk or ice cream.", "a present simple verb with -s",
    ["exactly one sentence", "must use a singular subject", "must be always true"]],
  ["Write two sentences: one fact that is always true, and one thing that is happening right now.", "the present simple for the fact and the present continuous for now",
    ["exactly two sentences", "first sentence a general fact", "second sentence with right now"]],
].map(([prompt, requiredElement, constraints]) => ({
  ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints,
}));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Tell a younger child three facts about nature. Write three or four sentences.",
    "present simple for general truths", ["present simple verbs", "-s with singular subjects", "no present continuous for facts"]],
  ["Describe the weather and nature in your region across the year. Write three or four sentences.",
    "present simple for facts that are always true", ["seasons or months", "present simple verbs", "correct -s endings"]],
  ["Explain how to keep food fresh in summer, and why. Write three or four sentences.",
    "present simple for facts and their results", ["facts like milk goes sour", "so or because to link ideas", "present simple verbs"]],
  ["Describe an animal you know well: where it lives, what it eats and what it can do. Write three or four sentences.",
    "present simple for facts about animals", ["lives, eats or similar -s forms", "plural subjects with the base form", "no is + -ing for facts"]],
  ["Write three or four sentences about something you learned in a science or geography lesson.",
    "present simple for scientific facts", ["present simple verbs", "facts that are always true", "correct agreement"]],
].map(([prompt, targetGrammar, lookFor]) => ({
  ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor,
}));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/tenses.present.general-truth.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items to ${out}`);