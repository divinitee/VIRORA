// Hand-authored: prep-phrasal / movement / across-through-along (B1).
// Wave C, C39 (2026-11-20, Claude, branch grammar-wave-c-base44).
//
// Tests ONE point (placement item: "We walked ______ the forest until we reached the
// river" → through): across = from one side to the other (a road, a river, a lake);
// through = in one side and out the other of a space with things around you (a
// tunnel, a crowd, a forest, a door, a window); along = following a long line (a
// beach, a river bank, a road, a canal).
// One right answer: many places take two of them ("across / through the park",
// "walk along / across the road"), so parks, fields, squares and city centres are not
// used, and every line has a clue (to the other side / trees all around / for two
// kilometres). over is never an option ("go over the road" is English).
// Choose: 7 through / 7 across / 6 along; options across / through / along / between.
// Build: 20 typed one word. Transform: 5 from one side to the other → across /
// 5 in … and out the other end → through / 5 beside … the whole way → along.
// Whys are written per item; listener names are never printed in a sentence.
//
// Run: node tools/grammar-practice/authored/prep-phrasal.movement.across-through-along.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "prep-phrasal", branch: "movement", topic: "across-through-along", level: "B1", pv: "2.5" };
const NAME = ["Malika", "Jamshid", "Zarina", "Ulugbek"];
const NAME2 = ["Nodira", "Sardor", "Dilnoza", "Otabek"];
const SET = ["across", "through", "along", "between"];

const fill = (text, slots, fallback) => {
  const s = {};
  for (const [n, f] of Object.entries(slots)) if (f.length && text.includes(`{${n}}`)) s[n] = f;
  if (text.includes("{name}") && !s.name) s.name = fallback;
  return s;
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  ["through", "The train went ______ a long dark tunnel under the {sight} and came out into the sunlight.", { sight: ["mountain", "hill", "river", "city"] }, "In one end of the tunnel and out the other: through."],
  ["through", "We pushed our way ______ the crowd to the {place}, {name}.", { place: ["stage", "exit", "front", "gate"] }, "People all around us: through the crowd."],
  ["through", "The {animal} came in ______ the open window, {name}.", { animal: ["cat", "bird", "bee", "butterfly"] }, "In one side of the window and out the other: through."],
  ["through", "Go ______ the gate and turn left to find the {place}, {name}.", { place: ["car park", "garden", "playground", "office"] }, "You pass the gate from one side to the other side of the wall: through."],
  ["through", "We walked ______ the forest for an hour. There were {tree} all around us.", { tree: ["trees", "pine trees", "tall trees", "birch trees"] }, "Trees all around you: through the forest."],
  ["through", "The little boy looked ______ the keyhole into the {room}, {name}.", { room: ["kitchen", "classroom", "bedroom", "office"] }, "Your eye goes into the hole and out the other side: through."],
  ["through", "The ball flew ______ the open {door} and into the house, {name}.", { door: ["door", "window", "gate", "kitchen door"] }, "In one side of the door and out the other: through."],
  ["across", "Look both ways before you walk ______ the {road}, {name}.", { road: ["road", "street", "railway", "car park"] }, "\"Look both ways\" = you go to the other side: across."],
  ["across", "My cousin swam ______ the {water} to the other side.", { water: ["river", "lake", "canal", "pool"] }, "\"to the other side\": across."],
  ["across", "We took a boat ______ the {water} to the little island, {name}.", { water: ["lake", "bay", "sea", "river"] }, "From this side to the island on the other side: across."],
  ["across", "The ball rolled ______ the street and into the {place} on the other side.", { place: ["garden", "yard", "shop", "café"] }, "\"on the other side\": across."],
  ["across", "He jumped ______ the stream without getting his {thing} wet, {name}.", { thing: ["feet", "shoes", "socks", "trousers"] }, "Over to the other bank in one jump: across."],
  ["across", "My friend lives just ______ the road from me, so I can see her {thing}, {name}.", { thing: ["window", "balcony", "garden", "door"] }, "On the other side of the road: across."],
  ["across", "It took three days to sail ______ the {water} from one coast to the other.", { water: ["sea", "Black Sea", "Caspian Sea", "big lake"] }, "\"from one coast to the other\": across."],
  ["along", "We walked ______ the beach for two hours, looking at the {thing}, {name}.", { thing: ["sea", "boats", "waves", "sunset"] }, "For two hours beside the sea = following the beach: along."],
  ["along", "There are cafés all ______ this street, from one end to the other, {name}.", { name: NAME }, "Following the whole length of the street: along."],
  ["along", "Drive ______ this road for two kilometres, then turn left at the {place}.", { place: ["petrol station", "school", "bazaar", "bridge"] }, "\"for two kilometres\" = following the road: along."],
  ["along", "We cycled ______ the river bank to the next {place}, {name}.", { place: ["village", "town", "bridge", "café"] }, "Following the line of the river bank: along."],
  ["along", "Tall trees grow ______ both sides of the {road}.", { road: ["canal", "road", "street", "river"] }, "In a line beside the road: along."],
  ["along", "We walked slowly ______ the river and watched the {thing} go by, {name}.", { thing: ["boats", "ducks", "swimmers", "people"] }, "Following the river and watching it: along."],
].map(([k, prompt, slots, why], i) => {
  let p = prompt;
  const s = fill(p, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) {
    if (!s.name) { s.name = i % 2 ? NAME2 : NAME; p = p.replace(/([.!?])$/, ", {name}$1"); }
    else { s.street = ["this street", "Navoi Street", "the main street", "our street"]; p = p.replace("all ______ this street", "all ______ {street}"); }
  }
  const options = SET.map((_, j) => SET[(j + i) % 4]);
  return { ...BASE, stage: "choose", format: "mcq", prompt: p, options, key: options.indexOf(k), why, slots: s };
});

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR = "Write across, through or along.";
const BUILD = [
  ["through", "The water came in ______ a hole in the roof of the {place}, {name}.", { place: ["garage", "kitchen", "shed", "classroom"] }, "In the hole and out the other side: through."],
  ["across", "The children ran ______ the road to the {place} on the other side, {name}.", { place: ["shop", "park", "bus stop", "school"] }, "\"on the other side\": across."],
  ["along", "We walked ______ the canal for an hour, {name}. The {thing} were beautiful.", { thing: ["trees", "flowers", "houses", "boats"] }, "For an hour beside the canal: along."],
  ["through", "We drove ______ a thick fog all the way to {city}, {name}.", { city: ["Chimgan", "Jizzakh", "Gulistan", "Angren"] }, "Fog all around you: through."],
  ["across", "There's a little bridge ______ the stream at the bottom of the {place}, {name}.", { place: ["garden", "village", "hill", "farm"] }, "It goes from one bank to the other: across."],
  ["along", "Walk ______ the corridor to the end. The {room} is the last door, {name}.", { room: ["office", "classroom", "toilet", "kitchen"] }, "To the end of the corridor, following it: along."],
  ["through", "I could hear music ______ the wall of my {room}, {name}.", { room: ["bedroom", "hotel room", "flat", "office"] }, "The sound came from one side of the wall to the other: through."],
  ["across", "The {animal} swam ______ the river to the far bank, {name}.", { animal: ["dog", "horse", "duck", "boy"] }, "\"to the far bank\" = to the other side: across."],
  ["along", "There are lots of {thing} ______ the coast near {city}.", { thing: ["hotels", "beaches", "cafés", "villages"], city: ["Antalya", "Batumi", "Dubai", "Sochi"] }, "In a line following the coast: along."],
  ["through", "Come in ______ the back door. The front door is locked, {name}.", { name: NAME }, "In one side of the door: through."],
  ["across", "We flew ______ the {water} to get to {city}, {name}.", { water: ["Caspian Sea", "Black Sea", "sea", "ocean"], city: ["Baku", "Istanbul", "Batumi", "London"] }, "From one side of the sea to the other: across."],
  ["along", "The old men sat on benches ______ the {path}, {name}.", { path: ["path", "river", "wall", "street"] }, "In a line beside the path: along."],
  ["through", "The sun shone ______ the {window} onto my desk, {name}.", { window: ["window", "curtains", "leaves", "glass roof"] }, "The light came from one side to the other: through."],
  ["across", "My sister lives ______ the street from my school, {name}. I visit her after {lesson}.", { lesson: ["lessons", "school", "football", "music club"] }, "On the other side of the street: across."],
  ["along", "We drove ______ the river for ten kilometres before we found a bridge, {name}.", { name: NAME2 }, "For ten kilometres beside the river: along."],
  ["through", "The thief ran ______ the house", { x: [] }, ""],
  ["across", "The {kid} drew a line ______ the page from left to right, {name}.", { kid: ["boy", "teacher", "girl", "student"] }, "\"from left to right\" = from one side to the other: across."],
  ["along", "Ducks swam slowly ______ the {water}, close to the bank.", { water: ["canal", "river", "stream", "lake shore"] }, "Following the bank: along."],
  ["through", "It's quicker to go ______ the {place} than round it, {name}.", { place: ["shopping centre", "station", "building", "underpass"] }, "In one end of the building and out the other: through."],
  ["along", "We walked ______ the old city wall in {city}, {name}.", { city: ["Khiva", "Bukhara", "Istanbul", "Derbent"] }, "Following the wall: along."],
].filter(([, , , why]) => why).map(([key, source, slots, why], i) => {
  let src = source;
  const s = fill(src, slots, i % 2 ? NAME2 : NAME);
  if (Object.keys(s).length < 2) {
    if (!s.name) { s.name = i % 2 ? NAME2 : NAME; src = src.replace(/([.!?])$/, ", {name}$1"); }
    else if (src.includes("back door")) { s.door = ["back door", "garden door", "kitchen door", "side door"]; src = src.replace("the back door", "the {door}"); }
    else if (src.includes("ten kilometres")) { s.dist = ["ten kilometres", "an hour", "half an hour", "five kilometres"]; src = src.replace("ten kilometres", "{dist}"); }
  }
  return { ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: src, key, why, slots: s };
});
BUILD.push({ ...BASE, stage: "build", format: "gap_fill", instr: INSTR, source: "The cat jumped in ______ the kitchen {window} and ate the fish, {name}.", key: "through", why: "In one side of the window: through.", slots: { window: ["window", "door", "hatch", "open window"], name: NAME2 } });

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const AC = "Rewrite with across.";
const TH = "Rewrite with through.";
const AL = "Rewrite with along.";
const TRANSFORM = [
  [AC, "We swam from one side of the {water} to the other, {name}.", "We swam ______ the {water}, {name}.", "across", { water: ["river", "lake", "canal", "pool"] }, "from one side to the other = across."],
  [AC, "The dog ran from one side of the road to the other, {name}. A {car} had to stop.", "The dog ran ______ the road, {name}. A {car} had to stop.", "across", { car: ["car", "bus", "taxi", "truck"] }, "from one side to the other = across."],
  [AC, "We sailed from one side of the lake to the other in an hour, {name}. The {weather} was perfect.", "We sailed ______ the lake in an hour, {name}. The {weather} was perfect.", "across", { weather: ["wind", "weather", "sea", "sky"] }, "from one side to the other = across."],
  [AC, "The kids ran from one side of the street to the other side, {name}. The {place} was there.", "The kids ran ______ the street, {name}. The {place} was there.", "across", { place: ["shop", "bakery", "park", "school"] }, "from one side to the other = across."],
  [AC, "The birds fly from one side of the sea to the other every {season}, {name}.", "The birds fly ______ the sea every {season}, {name}.", "across", { season: ["autumn", "spring", "year", "winter"] }, "from one side to the other = across."],
  [TH, "The train went into the tunnel and came out at the other end, {name}. It was in the {place}.", "The train went ______ the tunnel, {name}. It was in the {place}.", "through", { place: ["mountains", "hills", "city", "Alps"] }, "in one end and out the other = through."],
  [TH, "We went into the forest and came out on the other side, {name}. It took {time}.", "We went ______ the forest, {name}. It took {time}.", "through", { time: ["an hour", "two hours", "all day", "all morning"] }, "in one side and out the other = through."],
  [TH, "The ball went in one side of the window and out the other, {name}. It was a {game} ball.", "The ball went ______ the window, {name}. It was a {game} ball.", "through", { game: ["football", "tennis", "basketball", "cricket"] }, "in one side and out the other = through."],
  [TH, "We entered the crowd and came out at the front, {name}. We saw the {who}.", "We went ______ the crowd, {name}. We saw the {who}.", "through", { who: ["singer", "band", "players", "dancers"] }, "into the crowd and out the other side = through."],
  [TH, "The light goes in one side of the glass and out the other, {name}. The {room} is bright.", "The light goes ______ the glass, {name}. The {room} is bright.", "through", { room: ["kitchen", "hall", "room", "office"] }, "in one side and out the other = through."],
  [AL, "We walked beside the river the whole way to the {place}, {name}.", "We walked ______ the river to the {place}, {name}.", "along", { place: ["bridge", "village", "café", "station"] }, "beside a long line, the whole way = along."],
  [AL, "There are shops on both sides of the street, from one end to the other, {name}. It's in {city}.", "There are shops all ______ the street, {name}. It's in {city}.", "along", { city: ["Tashkent", "Samarkand", "Bukhara", "Fergana"] }, "the whole length of the street = along."],
  [AL, "We drove beside the coast for an hour, {name}. We saw {thing}.", "We drove ______ the coast for an hour, {name}. We saw {thing}.", "along", { thing: ["dolphins", "boats", "beaches", "lighthouses"] }, "following the coast = along."],
  [AL, "Flowers grow next to the wall the whole way, {name}. They are {colour}.", "Flowers grow ______ the wall, {name}. They are {colour}.", "along", { colour: ["red", "yellow", "white", "pink"] }, "next to the wall the whole way = along."],
  [AL, "We cycled beside the canal from end to end, {name}. It took {time}.", "We cycled ______ the canal, {name}. It took {time}.", "along", { time: ["an hour", "two hours", "all morning", "half a day"] }, "following the canal from end to end = along."],
].map(([instr, source, hint, key, slots, why], i) => {
  const s = fill(source + hint, slots, i % 2 ? NAME2 : NAME);
  return { ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots: s };
});

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about crossing a road or a river. Use across.", "… across the road / river", ["exactly one sentence", "across", "to the other side"]],
  ["Write one sentence about going through a tunnel, a forest or a crowd.", "… through the tunnel", ["exactly one sentence", "through", "a space around you"]],
  ["Write one sentence about walking beside a river or a beach. Use along.", "… along the river", ["exactly one sentence", "along", "a long line"]],
  ["Write directions to your home with along and across.", "Go along … then across …", ["exactly one sentence", "along", "across"]],
  ["Write one sentence about light or sound coming through something.", "… through the window / wall", ["exactly one sentence", "through", "light or sound"]],
  ["Write one sentence about a place on the other side of the street from your home.", "… across the street from …", ["exactly one sentence", "across the street", "a place"]],
  ["Write one sentence about things in a line beside a road or river.", "… along the road", ["exactly one sentence", "along", "a line of things"]],
  ["Write one sentence about a journey through mountains or a desert.", "… through the mountains", ["exactly one sentence", "through", "past"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Give directions from your home to a shop or school. Write three or four sentences with across, through and along.", "across / through / along", ["across", "along", "three or four sentences"]],
  ["Describe a walk you enjoyed. Where did you go? Write three or four sentences.", "along the river / through the forest", ["along", "through", "three or four sentences"]],
  ["Describe a long car or train journey. Write three or four sentences.", "through tunnels / across rivers / along the coast", ["through", "across", "three or four sentences"]],
  ["Describe your street or a street you like. Write three or four sentences.", "along the street / across the street from", ["along", "across", "three or four sentences"]],
  ["Write three or four sentences of a story about an animal that got into a house.", "through the window / across the room", ["through", "across", "three or four sentences"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/prep-phrasal.movement.across-through-along.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${items.length} items -> ${out}`);
