// Hand-authored: modals / ability-permission / can-request (A1).
// Speaking Pack batch 1 (2026-11-13, Claude, branch grammar-speak-1-claude).
//
// Placement focus: "Can for a request" (______ you help me? Do / Can / Are /
// Have). The everyday speaking skill: Can you … , please? (asking someone to do
// something) and Can I … , please? (asking to do something yourself).
// Choose: 10 items pick Can against Do / Are / Have in a clear request context
// (please + a reason, so "Do you open the window, please?" is not a real
// question there); 6 items choose Can I vs Can you from the meaning (I left my
// pen → Can I borrow yours?), with Do I / Am I as form errors; 4 items pick the
// base verb after Can you / Can I. Could / Will / May are never offered (they
// are right too).
// Build: Can I or Can you from context (the gap text never prints can, I or you).
// Transform: imperative → Can you … ?; I want to … → Can I … ?; my friend wants
// to … → Can my friend … ?
//
// Run: node tools/grammar-practice/authored/modals.ability-permission.can-request.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "modals", branch: "ability-permission", topic: "can-request", level: "A1", pv: "2.5" };

const O = ["Can", "Do", "Are", "Have"];
const ROLE = ["Can I", "Can you", "Do I", "Am I"];
const ROLE_YOU = ["Can you", "Can I", "Do you", "Are you"];
const REQ = "To ask someone to do something, use Can you + base verb … , please? Do, Are and Have don't make a request.";
const ME = (v) => `You want to ${v} it yourself, so ask for permission with Can I … ? Can you … ? asks the other person to do it.`;
const YOU = (v) => `You want the other person to ${v}, so ask Can you … ? Can I … ? asks to do something yourself.`;
const VF = (v) => `After Can you / Can I, use the base verb: ${v}. No to, no -ing, no -s.`;

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O, REQ, "It's hot in here. ______ you open the {thing}, please, {name}?",
    { thing: ["window", "door", "windows", "balcony door"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [O, REQ, "My bags are very heavy. ______ you help me {where}, please, {name}?",
    { where: ["with them", "up the stairs", "to the car", "to the taxi"], name: ["Bobur", "Aziza", "Dad", "Rustam"] }],
  [O, REQ, "Sorry, I don't understand. ______ you say that {how}, please, {name}?",
    { how: ["again", "more slowly", "in English", "one more time"], name: ["Ms Petrova", "Mr Aliev", "Kamila", "Bobur"] }],
  [O, REQ, "______ you lend me {money} for the {thing}, please?",
    { money: ["5,000 sum", "some money", "10,000 sum", "a little money"], thing: ["bus", "taxi", "tickets", "metro"] }],
  [O, REQ, "Excuse me, ______ you tell me the way to the {place}, please?",
    { place: ["station", "museum", "bazaar", "hospital"] }],
  [O, REQ, "______ you turn down the {thing}, please? I'm trying to {act}.",
    { thing: ["music", "TV", "radio", "volume"], act: ["sleep", "study", "read", "work"] }],
  [O, REQ, "______ you take a photo of {who} {where}, please?",
    { who: ["us", "me and my sister", "our family", "my friends"], where: ["here", "by the fountain", "in front of the gate", "near the tower"] }],
  [O, REQ, "______ you wait for me {where}, {name}? I'll be five minutes.",
    { where: ["outside", "at the gate", "by the car", "downstairs"], name: ["Dad", "Sardor", "Malika", "Anvar"] }],
  [O, REQ, "______ you call me {when}, please, {name}?",
    { when: ["tonight", "after work", "tomorrow", "later"], name: ["Nodira", "Rustam", "Olga", "Jasur"] }],
  [O, REQ, "______ you give me a glass of water, please? I'm {why}.",
    { why: ["thirsty", "so thirsty", "very thirsty", "really thirsty"] }],
  [ROLE, ME("borrow"), "I left my {thing} at home. ______ borrow yours, {name}?",
    { thing: ["pen", "ruler", "pencil", "calculator"], name: ["Aziza", "Bekzod", "Lola", "Timur"] }],
  [ROLE, ME("sit"), "Excuse me, ______ sit {where}, please?",
    { where: ["here", "next to you", "by the window", "at this table"] }],
  [ROLE, ME("use"), "______ use your {device} for a minute? Mine is {state}.",
    { device: ["phone", "laptop", "charger", "calculator"], state: ["broken", "at home", "not working", "in the car"] }],
  [ROLE_YOU, YOU("close"), "It's very cold. ______ close the {thing} for me, please, {name}?",
    { thing: ["window", "door", "balcony door", "windows"], name: ["Mum", "Aziz", "Olga", "Sardor"] }],
  [ROLE, ME("have"), "I'm really thirsty. ______ have some {drink}, please, {name}?",
    { drink: ["water", "juice", "tea", "lemonade"], name: ["Mum", "Grandma", "Aunt Lola", "Dad"] }],
  [ROLE_YOU, YOU("explain"), "I don't get it. ______ explain this {thing} to me again, {name}?",
    { thing: ["rule", "word", "exercise", "question"], name: ["Ms Karimova", "Mr Aliev", "Kamila", "Bobur"] }],
  [["pass", "to pass", "passing", "passes"], VF("pass"), "Can you ______ me the {thing}, please, {name}?",
    { thing: ["salt", "bread", "sugar", "water"], name: ["Dad", "Lola", "Aziz", "Grandpa"] }],
  [["have", "to have", "having", "has"], VF("have"), "Can I ______ a {thing}, please, {name}?",
    { thing: ["glass of water", "piece of cake", "cup of tea", "bag"], name: ["Mum", "Grandma", "Aunt Lola", "Dad"] }],
  [["check", "to check", "checking", "checks"], VF("check"), "Can you ______ my {thing} {when}, Ms Petrova?",
    { thing: ["homework", "essay", "answers", "letter"], when: ["tonight", "now", "later", "before class"] }],
  [["open", "to open", "opening", "opens"], VF("open"), "Can I ______ the window, please? It's very {adj} in here.",
    { adj: ["hot", "stuffy", "warm"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write Can I or Can you.";
const BUILD = [
  ["Can you", YOU("pass it"), "______ pass the {thing}, please? It's too far away, {name}.",
    { thing: ["salt", "bread", "sugar", "ketchup"], name: ["Dad", "Lola", "Aziz", "Grandma"] }],
  ["Can I", ME("use"), "______ use the {thing}, please? It's urgent.",
    { thing: ["bathroom", "toilet", "phone", "computer"] }],
  ["Can you", YOU("help"), "______ help me with my {task}, {name}? It's too hard for me.",
    { task: ["homework", "project", "essay", "maths problem"], name: ["Sardor", "Olga", "Dad", "Malika"] }],
  ["Can you", YOU("open it"), "______ open the {thing} for me? My hands are full, {name}.",
    { thing: ["door", "gate", "car door", "fridge"], name: ["Timur", "Mum", "Bobur", "Kamila"] }],
  ["Can I", ME("go"), "______ go to the {place} with my friends {when}, Mum?",
    { place: ["park", "cinema", "café", "stadium"], when: ["tonight", "on Saturday", "after school", "tomorrow"] }],
  ["Can you", YOU("speak more slowly"), "______ speak more slowly, please, {name}? My {lang} isn't very good.",
    { name: ["Olga", "Mr Smith", "Anna", "Ms Lee"], lang: ["English", "Russian", "Uzbek", "Korean"] }],
  ["Can I", ME("have"), "______ have another {thing}, please, {name}? It's delicious.",
    { thing: ["piece of cake", "samsa", "cup of tea", "slice of melon"], name: ["Grandma", "Aunt Lola", "Mum", "Nodira"] }],
  ["Can you", YOU("wake me up"), "______ wake me up at {time} tomorrow, {name}?",
    { time: ["six", "seven", "half past six", "eight"], name: ["Mum", "Dad", "Aziz", "Sevara"] }],
  ["Can I", ME("leave"), "______ leave {when} today, {name}? My mother is ill.",
    { when: ["early", "at three", "after lunch", "before the last lesson"], name: ["Ms Karimova", "Mr Aliev", "Ms Petrova", "Mr Rakhimov"] }],
  ["Can you", YOU("show the way"), "Excuse me, ______ show me the way to the {place}, please?",
    { place: ["station", "metro", "museum", "post office"] }],
  ["Can I", ME("try them on"), "______ try on these {clothes} in {size}, please?",
    { clothes: ["jeans", "shoes", "trousers", "boots"], size: ["a bigger size", "a smaller size", "black", "blue"] }],
  ["Can you", YOU("turn it off"), "______ turn off the {thing} for me, please? It's late, {name}.",
    { thing: ["light", "TV", "music", "radio"], name: ["Mum", "Aziz", "Olga", "Dad"] }],
  ["Can I", ME("pay"), "______ pay for the {thing} by {method}, please?",
    { thing: ["tickets", "room", "meal", "books"], method: ["card", "phone", "bank transfer", "QR code"] }],
  ["Can you", YOU("bring it"), "Excuse me, ______ bring me a {thing}, please?",
    { thing: ["menu", "glass of water", "spoon", "napkin"] }],
  ["Can I", ME("sit there"), "______ sit next to {who} today, {name}?",
    { who: ["Aziz", "the window", "my friend", "Lola"], name: ["Ms Karimova", "Mr Aliev", "Ms Petrova", "Coach"] }],
  ["Can you", YOU("repeat it"), "______ repeat the {thing} more slowly, please, {name}?",
    { thing: ["question", "address", "number", "word"], name: ["Mr Aliev", "Kamila", "Madam", "Ms Lee"] }],
  ["Can I", ME("borrow"), "______ borrow your {thing} until {day}?",
    { thing: ["book", "bike", "camera", "dictionary"], day: ["Monday", "Friday", "the weekend", "tomorrow"] }],
  ["Can you", YOU("keep a secret"), "______ keep a secret, {name}?",
    { name: ["Aziza", "Timur", "Olga", "Jasur"] }],
  ["Can you", YOU("take it"), "______ take my {thing} {where}, Dad? It's too heavy.",
    { thing: ["bag", "box", "suitcase", "guitar"], where: ["home", "upstairs", "to the car", "inside"] }],
  ["Can I", ME("come"), "______ come to your {event} on {day}?",
    { event: ["party", "concert", "football match", "birthday"], day: ["Saturday", "Sunday", "Friday", "Thursday"] }],
].map(([key, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key, why, slots }));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const POLITE = "Make it a polite request with Can you … , please?";
const PERM = "Ask for permission with Can I … ?";
const OTHER = "Ask for permission for the other person with Can … ?";
const TRANSFORM = [
  // imperative -> Can you … , please? (5)
  [POLITE, "Close the {thing}, {name}.", "______ (close) the {thing}, please, {name}?", "can you close",
    "A polite request: Can you + base verb … , please?",
    { thing: ["door", "window", "gate", "curtains"], name: ["Aziz", "Olga", "Timur", "Lola"] }],
  [POLITE, "Turn down the {thing} {how}.", "______ (turn) down the {thing} {how}, please?", "can you turn",
    "Make the order polite: Can you turn … , please?",
    { thing: ["music", "TV", "radio", "volume"], how: ["now", "a little", "a bit", "a lot"] }],
  [POLITE, "Help me with the {thing} {when}.", "______ (help) me with the {thing} {when}, please?", "can you help",
    "A polite request: Can you help me … , please?",
    { thing: ["bags", "dishes", "homework", "cooking"], when: ["now", "tonight", "after dinner", "later"] }],
  [POLITE, "Send me the {thing} {when}.", "______ (send) me the {thing} {when}, please?", "can you send",
    "A polite request: Can you send … , please?",
    { thing: ["photos", "address", "homework", "video"], when: ["tonight", "today", "after class", "now"] }],
  [POLITE, "Wait for me at the {place} {when}.", "______ (wait) for me at the {place} {when}, please?", "can you wait",
    "A polite request: Can you wait … , please?",
    { place: ["gate", "bus stop", "corner", "entrance"], when: ["after class", "at six", "after work", "at noon"] }],
  // I want to … -> Can I … ? (5)
  [PERM, "I want to use your {thing} for {time}.", "______ (use) your {thing} for {time}, please?", "can i use",
    "To ask to do something yourself, use Can I + base verb … ?",
    { thing: ["phone", "laptop", "charger", "pen"], time: ["a minute", "a moment", "a second", "a few minutes"] }],
  [PERM, "I want to ask a question about the {thing}, {name}.", "______ (ask) a question about the {thing}, {name}?", "can i ask",
    "Ask for permission with Can I + base verb: Can I ask … ?",
    { thing: ["homework", "test", "timetable", "trip"], name: ["Ms Karimova", "Mr Aliev", "Coach", "Ms Petrova"] }],
  [PERM, "I want to sit {where}, {name}.", "______ (sit) {where}, {name}?", "can i sit",
    "Ask for permission with Can I sit … ?",
    { where: ["here", "by the window", "next to Aziz", "at the back"], name: ["Ms Lee", "Mr Aliev", "Madam", "Coach"] }],
  [PERM, "I want to go home {when}, {name}.", "______ (go) home {when}, {name}?", "can i go",
    "Ask for permission with Can I go … ?",
    { when: ["early", "now", "at four", "after lunch"], name: ["Ms Karimova", "Dad", "Mr Rakhimov", "Mum"] }],
  [PERM, "I want to try this {thing} on in {colour}.", "______ (try) this {thing} on in {colour}, please?", "can i try",
    "Ask for permission with Can I try … ?",
    { thing: ["jacket", "dress", "shirt", "coat"], colour: ["black", "blue", "grey", "white"] }],
  // my friend wants to … -> Can my friend … ? (5)
  [OTHER, "My friend wants to come {when} too, {name}.", "______ (come) {when} too, {name}?", "can my friend come",
    "Put can first, then the person: Can my friend come … ?",
    { when: ["tonight", "on Saturday", "to the party", "with us"], name: ["Mum", "Dad", "Aziz", "Ms Lee"] }],
  [OTHER, "My little brother wants to play with us {where}.", "______ (play) with us {where}?", "can my little brother play",
    "Put can first, then the person: Can my little brother play … ?",
    { where: ["in the yard", "in the park", "after school", "today"] }],
  [OTHER, "Our dog wants to come into the {room}, {name}.", "______ (come) into the {room}, {name}?", "can our dog come",
    "Put can first, then the dog: Can our dog come … ?",
    { room: ["kitchen", "living room", "house", "bedroom"], name: ["Mum", "Grandma", "Dad", "Aunt Lola"] }],
  [OTHER, "My sister wants to sit with us at the {event}.", "______ (sit) with us at the {event}?", "can my sister sit",
    "Put can first, then the person: Can my sister sit … ?",
    { event: ["wedding", "concert", "party", "match"] }],
  [OTHER, "My parents want to watch the {event} from the {place}.", "______ (watch) the {event} from the {place}?", "can my parents watch",
    "Put can first, then the people: Can my parents watch … ?",
    { event: ["match", "concert", "show", "game"], place: ["front row", "back", "balcony", "side"] }],
].map(([instr, source, hint, key, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["You are in class and you forgot your pen. Ask a classmate.", "Can I borrow … ?", ["exactly one question", "must use Can I", "must use please"]],
  ["You are at a friend's house and you are thirsty. Ask politely.", "Can I have … , please?", ["exactly one question", "must use Can I have", "must name a drink"]],
  ["Ask your teacher to explain something again.", "Can you + base verb … , please?", ["exactly one question", "must use Can you", "must use again"]],
  ["Ask a stranger to take a photo of you.", "Can you take a photo … ?", ["exactly one question", "must use Can you", "must start with Excuse me"]],
  ["Ask your parents for permission to go somewhere this weekend.", "Can I go … ?", ["exactly one question", "must use Can I", "must name a place"]],
  ["Ask a shop assistant to help you find something.", "Can you help me … ?", ["exactly one question", "must use Can you help", "must name the thing"]],
  ["Ask if your friend can come with you to a party.", "Can my friend come … ?", ["exactly one question", "must start with Can my friend", "base verb after the person"]],
  ["Write two requests: one asking to do something yourself, one asking someone else to do something.", "Can I … ? and Can you … ?", ["exactly two questions", "one with Can I, one with Can you", "please in at least one"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["You are at a café. Write a short dialogue with the waiter: ask for the menu, order, and ask for the bill.",
    "Can I … ? / Can you … ? requests", ["Can I have … , please?", "Can you bring … ?", "please and thank you"]],
  ["You are staying with a host family abroad. Write four polite requests you might need on the first day.",
    "Can I … ? and Can you … ?", ["Can I + base verb", "Can you + base verb", "please"]],
  ["Your friend is helping you move to a new flat. Write four requests to your friend.",
    "Can you … , please?", ["Can you + base verb", "four different verbs", "no Do you … ? for requests"]],
  ["Write a short message to your teacher asking for two things (for example, to leave early and to send you the homework).",
    "Can I … ? and Can you … ?", ["Can I + base verb", "Can you + base verb", "a polite greeting and thank you"]],
  ["You are lost in a new city. Write a short dialogue asking a person on the street for help.",
    "Can you … ? requests", ["Excuse me", "Can you tell / show me … ?", "please and thank you"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/modals.ability-permission.can-request.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);
