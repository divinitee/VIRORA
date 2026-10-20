// Hand-authored: questions-negation / yes-no / progressive-question (A1).
//
// Tests ONE point (placement focus): Am/Is/Are + subject + -ing for an action
// happening now. Choose: 12 items pick the auxiliary (distractors: Do/Does —
// the simple-question transfer — and the wrong be form), 8 items pick the
// verb form (distractors: base, -s, past). Each sentence has one "now" marker.
// Build: 10 × Am/Is/Are, 10 × -ing form from a bracket cue (no BrE/AmE splits).
// Transform kinds: statement → question (5), simple question → question about
// now (5), same question for a new subject (5).
//
// Run: node tools/grammar-practice/authored/questions-negation.yes-no.progressive-question.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "questions-negation", branch: "yes-no", topic: "progressive-question", level: "A1", pv: "2.5" };
const NAME = ["Aziz", "Olga", "Timur", "Malika"];
const CITY = ["Samarkand", "Bukhara", "Fergana", "Termez"];
const ARE = "The action is happening now and the subject is you, we or they, so start with Are and use -ing.";
const IS = "The action is happening now and the subject is he, she or it, so start with Is and use -ing.";
const AM = "The action is happening now and the subject is I, so start with Am and use -ing.";
const ING = "After Am/Is/Are + subject, an action happening now takes the -ing form.";
const O_ARE = ["Are", "Do", "Is", "Does"];
const O_IS = ["Is", "Does", "Are", "Do"];

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O_ARE, ARE, "______ you watching {show} now, {name}?", { show: ["football", "a film", "cartoons", "the news"], name: NAME }],
  [O_IS, IS, "______ your brother sleeping now? The {thing} is very loud.", { thing: ["TV", "radio", "music", "phone"] }],
  [O_ARE, ARE, "______ your parents waiting at the {place} now, {name}?", { place: ["station", "airport", "bus stop", "door"], name: NAME }],
  [O_IS, IS, "______ it raining in {city} now, {name}?", { city: CITY, name: NAME }],
  [O_ARE, ARE, "______ the children playing in the {place} right now, {name}?", { place: ["yard", "park", "garden", "street"], name: NAME }],
  [O_IS, IS, "______ Nilufar doing her {subject} homework now, {name}?", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [O_ARE, ARE, "______ you cooking {food} for us, {name}? It smells good.", { food: ["plov", "soup", "pancakes", "manti"], name: NAME }],
  [O_IS, IS, "______ the {transport} coming now, {name}?", { transport: ["bus", "train", "taxi", "tram"], name: NAME }],
  [O_ARE, ARE, "______ your friends studying in the {place} at the moment, {name}?", { place: ["library", "café", "classroom", "park"], name: NAME }],
  [O_IS, IS, "______ your mum talking on the phone with {person} now, {name}?", { person: ["Grandma", "your aunt", "a friend", "the teacher"], name: NAME }],
  [O_ARE, ARE, "______ we going to the {place} now, {name}?", { place: ["market", "park", "cinema", "bazaar"], name: NAME }],
  [O_IS, IS, "______ Sardor wearing his new {thing} today, {name}?", { thing: ["jacket", "shoes", "hat", "watch"], name: NAME }],
  [["listening", "listen", "listens", "listened"], ING, "Are you ______ to music now, {name}? I can see your {thing}.", { name: NAME, thing: ["headphones", "earphones", "phone", "laptop"] }],
  [["reading", "read", "reads", "to read"], ING, "Is your sister ______ a book in the {place} now, {name}?", { place: ["garden", "bedroom", "kitchen", "yard"], name: NAME }],
  [["playing", "play", "plays", "played"], ING, "Are they ______ football in the {place} right now, {name}?", { place: ["park", "yard", "stadium", "gym"], name: NAME }],
  [["sleeping", "sleep", "sleeps", "slept"], ING, "Is the baby ______ now, {name}? The {place} is very quiet.", { name: NAME, place: ["house", "flat", "room", "kitchen"] }],
  [["studying", "study", "studies", "studied"], ING, "Are you ______ for the {event} at the moment, {name}?", { event: ["test", "exam", "quiz", "lesson"], name: NAME }],
  [["washing", "wash", "washes", "washed"], ING, "Is Dad ______ the car in the {place} now, {name}?", { place: ["yard", "garage", "street", "garden"], name: NAME }],
  [["driving", "drive", "drives", "drove"], ING, "Are your cousins ______ to {city} now, {name}?", { city: CITY, name: NAME }],
  [["making", "make", "makes", "made"], ING, "Is Grandma ______ {food} in the kitchen right now, {name}?", { food: ["plov", "bread", "tea", "soup"], name: NAME }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const I_BE = "Write Am, Is or Are.";
const I_ING = "Write the -ing form of the verb in brackets.";
const BUILD = [
  [I_BE, "Are", ARE, "______ you doing your homework now, {name}? Your {person} is waiting.", { name: NAME, person: ["mum", "dad", "teacher", "friend"] }],
  [I_BE, "Is", IS, "______ your brother playing {game} in his room, {name}?", { game: ["chess", "video games", "the guitar", "cards"], name: NAME }],
  [I_BE, "Am", AM, "______ I sitting in your seat on the {transport}, {name}?", { transport: ["bus", "train", "plane", "metro"], name: NAME }],
  [I_BE, "Are", ARE, "______ your friends waiting for us at the {place} now, {name}?", { place: ["cinema", "café", "gate", "station"], name: NAME }],
  [I_BE, "Is", IS, "______ it snowing in {city} at the moment, {name}?", { city: CITY, name: NAME }],
  [I_BE, "Are", ARE, "______ the boys running in the {place} now, {name}?", { place: ["park", "stadium", "yard", "gym"], name: NAME }],
  [I_BE, "Is", IS, "______ your {device} charging now, {name}?", { device: ["phone", "laptop", "tablet", "watch"], name: NAME }],
  [I_BE, "Are", ARE, "______ we waiting for {person}, {name}?", { person: ["the bus", "your mum", "the teacher", "Grandpa"], name: NAME }],
  [I_BE, "Is", IS, "______ Zarina making a cake for the {event} now, {name}?", { event: ["party", "birthday", "guests", "holiday"], name: NAME }],
  [I_BE, "Are", ARE, "______ your parents watching TV in the {room} now, {name}?", { room: ["living room", "kitchen", "bedroom", "hall"], name: NAME }],
  [I_ING, "waiting", ING, "Are you ______ (wait) for the {transport}, {name}?", { transport: ["bus", "train", "taxi", "metro"], name: NAME }],
  [I_ING, "swimming", ING, "Is your sister ______ (swim) in the {place} now, {name}?", { place: ["pool", "river", "sea", "lake"], name: NAME }],
  [I_ING, "running", ING, "Are they ______ (run) to the {place} now, {name}?", { place: ["bus stop", "station", "gate", "door"], name: NAME }],
  [I_ING, "writing", ING, "Is Ali ______ (write) a message to his {person} now, {name}?", { person: ["mum", "friend", "teacher", "brother"], name: NAME }],
  [I_ING, "sitting", ING, "Are the children ______ (sit) in the {place} now, {name}?", { place: ["garden", "car", "classroom", "yard"], name: NAME }],
  [I_ING, "fixing", ING, "Is your dad ______ (fix) the {thing} now, {name}?", { thing: ["car", "bike", "door", "TV"], name: NAME }],
  [I_ING, "having", ING, "Are you ______ (have) {meal} now, {name}?", { meal: ["lunch", "dinner", "breakfast", "tea"], name: NAME }],
  [I_ING, "getting", ING, "Is it ______ (get) dark in {city} now, {name}?", { city: CITY, name: NAME }],
  [I_ING, "coming", ING, "Are your cousins ______ (come) to the {event} today, {name}?", { event: ["party", "wedding", "match", "concert"], name: NAME }],
  [I_ING, "dancing", ING, "Is Malohat ______ (dance) at the {event} now, {name}?", { event: ["wedding", "party", "concert", "club"], name: NAME }],
].map(([instr, key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const T_Q = "Make a yes/no question. Write one word in each gap.";
const T_NOW = "Ask about now. Write one word in each gap.";
const T_NEW = "Ask the same question about the new person. Write Am, Is or Are.";
const TRANSFORM = [
  [T_Q, "You are waiting for the {transport}, {name}.", "______ you ______ for the {transport}, {name}?", ["Are", "waiting"], "Move are before you; the verb stays in the -ing form.", { transport: ["bus", "train", "taxi", "metro"], name: NAME }],
  [T_Q, "Your brother is sleeping in his {place}, {name}.", "______ your brother ______ in his {place}, {name}?", ["Is", "sleeping"], "Move is before your brother; the verb stays in the -ing form.", { place: ["room", "bedroom", "bed", "chair"], name: NAME }],
  [T_Q, "They are playing {game} in the yard, {name}.", "______ they ______ {game} in the yard, {name}?", ["Are", "playing"], "Move are before they; the verb stays in the -ing form.", { game: ["football", "chess", "tennis", "volleyball"], name: NAME }],
  [T_Q, "It is raining in {city} now, {name}.", "______ it ______ in {city} now, {name}?", ["Is", "raining"], "Move is before it; the verb stays in the -ing form.", { city: CITY, name: NAME }],
  [T_Q, "Your mum is cooking {food} now, {name}.", "______ your mum ______ {food} now, {name}?", ["Is", "cooking"], "Move is before your mum; the verb stays in the -ing form.", { food: ["plov", "soup", "dinner", "rice"], name: NAME }],
  [T_NOW, "Do you watch {show} in the evening, {name}?", "______ you ______ {show} now, {name}?", ["Are", "watching"], "Now means the action is happening at the moment, so use Are + watching, not Do.", { show: ["cartoons", "football", "the news", "films"], name: NAME }],
  [T_NOW, "Does your dad drive to {city} every week, {name}?", "______ your dad ______ to {city} now, {name}?", ["Is", "driving"], "Now means the action is happening at the moment, so use Is + driving, not Does.", { city: CITY, name: NAME }],
  [T_NOW, "Do your friends play {sport} in the {place}?", "______ your friends ______ {sport} in the {place} now?", ["Are", "playing"], "Now means the action is happening at the moment, so use Are + playing, not Do.", { sport: ["football", "basketball", "volleyball", "tennis"], place: ["park", "yard", "gym", "stadium"] }],
  [T_NOW, "Does Lola read in the {place} after school, {name}?", "______ Lola ______ in the {place} now, {name}?", ["Is", "reading"], "Now means the action is happening at the moment, so use Is + reading, not Does.", { place: ["library", "garden", "park", "kitchen"], name: NAME }],
  [T_NOW, "Do you study {subject} in the evenings, {name}?", "______ you ______ {subject} now, {name}?", ["Are", "studying"], "Now means the action is happening at the moment, so use Are + studying, not Do.", { subject: ["maths", "English", "history", "science"], name: NAME }],
  [T_NEW, "Are you reading in the {place}, {name}?", "______ your sister reading in the {place}, {name}?", "Is", IS, { place: ["library", "garden", "kitchen", "park"], name: NAME }],
  [T_NEW, "Is your brother running in the {place}, {name}?", "______ your brothers running in the {place}, {name}?", "Are", "Brothers is plural (they), so use Are.", { place: ["park", "stadium", "yard", "gym"], name: NAME }],
  [T_NEW, "Is Rustam talking to the {person}, {name}?", "______ you talking to the {person}, {name}?", "Are", "The subject is you, so use Are.", { person: ["teacher", "doctor", "driver", "coach"], name: NAME }],
  [T_NEW, "Are they eating {meal} now, {name}?", "______ Grandpa eating {meal} now, {name}?", "Is", IS, { meal: ["lunch", "dinner", "breakfast", "supper"], name: NAME }],
  [T_NEW, "Is your sister working in {city} this week, {name}?", "______ your sisters working in {city} this week, {name}?", "Are", "Sisters is plural (they), so use Are.", { city: CITY, name: NAME }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Your friend is on the phone. Ask if they are watching TV now. Use Are you.", "Are you … -ing", ["exactly one question", "must start with Are", "must use -ing"]],
  ["Ask if it is raining in your friend's city now.", "Is it … -ing", ["exactly one question", "must start with Is", "must use raining"]],
  ["Ask if your brother is sleeping.", "Is he … -ing", ["exactly one question", "must start with Is", "must use -ing"]],
  ["Ask if your friends are waiting for you.", "Are they … -ing", ["exactly one question", "must start with Are", "must use -ing"]],
  ["Ask about your mum in the kitchen now.", "Is she … -ing", ["exactly one question", "must start with Is", "must use -ing"]],
  ["Ask if you are sitting in the right seat. Use Am I.", "Am I … -ing", ["exactly one question", "must start with Am", "must use -ing"]],
  ["Write two questions about people at a party now: one with Is and one with Are.", "Is / Are … -ing", ["exactly two questions", "must use Is", "must use Are"]],
  ["Ask if the bus is coming.", "Is … coming", ["exactly one question", "must start with Is", "must use coming"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You call your family from a trip. Write four questions about what they are doing now.", "Am/Is/Are + -ing questions", ["Are you", "Is Dad", "-ing"]],
  ["Look out of the window. Write questions about the people in the street.", "Am/Is/Are + -ing questions", ["Is he", "Are they", "now"]],
  ["Your friend is at a match. Write a short phone dialogue.", "Am/Is/Are + -ing questions", ["Are you watching", "Is your team", "winning"]],
  ["Write three or four questions for a friend on a video call.", "Am/Is/Are + -ing questions", ["Are you", "now", "?"]],
  ["Your little brother is very quiet. Write questions to ask your mum.", "Am/Is/Are + -ing questions", ["Is he", "sleeping", "playing"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
writeFileSync("content/grammar-practice/questions-negation.yes-no.progressive-question.json", JSON.stringify(items, null, 1) + "\n");