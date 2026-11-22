// Hand-authored: tenses / past / past-simple-vs-continuous (B2). Wave D (Claude, 23 Nov 2026).
// One point: a short past event (past simple) against an activity still in progress
// (past continuous), with a clue that the activity had not finished ("so I joined
// him", "and didn't hear the bell"). One right answer: choose distractors are wrong
// forms (were/was mismatch, present, base), never "had cooked" (English with another
// meaning). Build/transform keys are two-part: [background, event].
import { build, NAME } from "../../../grammar-run/wave-d/skeleton.mjs";
const BASE = { domain: "tenses", branch: "past", topic: "past-simple-vs-continuous", level: "B2", pv: "2.5" };
const BG = (sg, ing, base) => [`${sg ? "was" : "were"} ${ing}`, `${sg ? "were" : "was"} ${ing}`, `${sg ? "is" : "are"} ${ing}`, `${sg ? "was" : "were"} ${base}`];
const EV = (past, base, ing, wrong) => [past, base, `has ${wrong}`, `was ${ing}`];

const CHOOSE = [
  [BG(true, "cooking", "cook"), "\"so I joined him\": the cooking was still going on.", "When I got home, my brother ______ dinner, so I joined him, {name}. We made {food}.", { food: ["plov", "soup", "salad", "pasta"], name: NAME }],
  [BG(false, "watching", "watch"), "\"didn't hear the door\": they were in the middle of watching.", "The kids ______ a {show}, so they didn't hear the door, {name}.", { show: ["film", "cartoon", "match", "quiz show"], name: NAME }],
  [BG(true, "raining", "rain"), "\"we took the umbrella\": rain was in progress.", "It ______ when we left the {place}, so we took an umbrella, {name}.", { place: ["house", "café", "school", "cinema"], name: NAME }],
  [BG(true, "sleeping", "sleep"), "\"I didn't wake her\": she was asleep at that moment.", "Grandma ______ when the {who} arrived, so I didn't wake her, {name}.", { who: ["guests", "doctor", "neighbours", "postman"], name: NAME }],
  [BG(false, "having", "have"), "\"they asked me to join\": the lunch was in progress.", "When I came in, my colleagues ______ lunch in the {room}, and they asked me to join, {name}.", { room: ["kitchen", "garden", "canteen", "office"], name: NAME }],
  [BG(true, "driving", "drive"), "The call came in the middle of the drive.", "Dad ______ to the {place} when his phone rang, so he didn't answer, {name}.", { place: ["airport", "market", "village", "station"], name: NAME }],
  [BG(false, "playing", "play"), "\"they came inside\": the game was still going.", "The children ______ in the {yard} when it started to snow, so they came inside, {name}.", { yard: ["yard", "park", "garden", "street"], name: NAME }],
  [BG(true, "talking", "talk"), "\"I waited\": the call was not over yet.", "My boss ______ on the phone when I knocked, so I waited outside, {name}. It was about the {topic}.", { topic: ["meeting", "report", "trip", "budget"], name: NAME }],
  [BG(false, "waiting", "wait"), "\"and they were still there\": the waiting went on.", "My friends ______ for me at the {place} when I arrived, {name}.", { place: ["gate", "café", "bus stop", "entrance"], name: NAME }],
  [BG(true, "shining", "shine"), "A scene in progress around the event: was shining.", "The sun ______ when we reached the {place}, so we had lunch outside, {name}.", { place: ["lake", "top", "village", "beach"], name: NAME }],
  [EV("broke", "break", "breaking", "broke"), "One sudden event in the middle of washing up: broke.", "I was washing the dishes when I ______ a {thing}, {name}.", { thing: ["glass", "plate", "cup", "bowl"], name: NAME }],
  [EV("called", "call", "calling", "call"), "A short event while she was cooking: called.", "She was cooking when her {who} ______, {name}.", { who: ["sister", "aunt", "friend", "boss"], name: NAME }],
  [EV("fell", "fall", "falling", "fell"), "The fall happened during the run: fell.", "Timur ______ while he was running in the {place}, {name}.", { place: ["park", "stadium", "street", "forest"], name: NAME }],
  [EV("saw", "see", "seeing", "seed"), "One moment of seeing during the walk: saw.", "We were walking in the {place} when we ______ a fox, {name}.", { place: ["forest", "park", "hills", "field"], name: NAME }],
  [EV("went", "go", "going", "goed"), "The lights went out once, in the middle of it: went.", "We were watching a {show} when the lights ______ out, {name}.", { show: ["film", "match", "concert", "series"], name: NAME }],
  [EV("met", "meet", "meeting", "meeted"), "A single meeting during the trip: met.", "I ______ my best friend while I was studying in {city}, {name}.", { city: ["the capital", "Samarkand", "Bukhara", "Andijan"], name: NAME }],
  [EV("arrived", "arrive", "arriving", "arrive"), "The guests' arrival interrupted the cleaning: arrived.", "We were still cleaning the {room} when the guests ______, {name}.", { room: ["kitchen", "living room", "flat", "yard"], name: NAME }],
  [EV("stopped", "stop", "stopping", "stop"), "One stop in the middle of the drive: stopped.", "We were driving to the {place} when the car suddenly ______, {name}.", { place: ["coast", "mountains", "village", "airport"], name: NAME }],
  [EV("heard", "hear", "hearing", "hear"), "A sudden noise during sleep: heard.", "I was sleeping when I ______ a strange noise in the {room}, {name}.", { room: ["kitchen", "hall", "yard", "attic"], name: NAME }],
  [EV("dropped", "drop", "dropping", "drop"), "One drop while she was running: dropped.", "Lola ______ her {thing} while she was running for the bus, {name}.", { thing: ["phone", "keys", "bag", "ticket"], name: NAME }],
];

const I = "The long action = past continuous; the short event = past simple.";
const BUILD = [
  [I, ["got", "was cooking"], [], "Arrival = event; cooking still going on (so I joined him).", "When I ______ (get) home, my brother ______ (cook) dinner, so I joined him, {name}. We made {food}.", { food: ["plov", "soup", "salad", "pasta"], name: NAME }],
  [I, ["was reading", "rang"], [], "Reading = background; the phone = a short event.", "I ______ (read) in the {room} when the phone ______ (ring), {name}.", { room: ["garden", "kitchen", "bedroom", "library"], name: NAME }],
  [I, ["were walking", "started"], [], "Walking = background; the rain began once.", "We ______ (walk) to the {place} when it ______ (start) to rain, {name}.", { place: ["station", "park", "market", "school"], name: NAME }],
  [I, ["was having", "knocked"], [], "The shower went on; the knock was one moment.", "Aziz ______ (have) a shower when someone ______ (knock) at the {door}, {name}.", { door: ["door", "front door", "gate", "window"], name: NAME }],
  [I, ["arrived", "were dancing"], [], "Arrival = event; dancing still going on.", "When we ______ (arrive) at the {event}, everyone ______ (dance), {name}.", { event: ["wedding", "party", "festival", "concert"], name: NAME }],
  [I, ["was driving", "saw"], [], "Driving = background; seeing the deer = a moment.", "Dad ______ (drive) through the {place} when he ______ (see) a deer, {name}.", { place: ["forest", "hills", "mountains", "valley"], name: NAME }],
  [I, ["were having", "went"], [], "Dinner went on; the lights went out once.", "We ______ (have) dinner when the lights ______ (go) out, {name}. It was a {day}.", { day: ["Friday", "Sunday", "holiday", "Monday"], name: NAME }],
  [I, ["was waiting", "lost"], [], "Waiting = background; losing the ticket = one event.", "She ______ (wait) at the {place} when she ______ (lose) her ticket, {name}.", { place: ["station", "airport", "bus stop", "gate"], name: NAME }],
  [I, ["was studying", "called"], [], "Studying went on; the call was short.", "I ______ (study) for my {exam} when my cousin ______ (call), {name}.", { exam: ["exam", "test", "maths test", "driving test"], name: NAME }],
  [I, ["were playing", "broke"], [], "The game was in progress; the window broke once.", "The boys ______ (play) {sport} when they ______ (break) a window, {name}.", { sport: ["football", "volleyball", "basketball", "cricket"], name: NAME }],
  [I, ["opened", "was sleeping"], [], "Opening the door = event; the baby still asleep.", "When I ______ (open) the door, the baby ______ (sleep), {name}. So I closed it quietly. It was {h}.", { h: ["noon", "two o'clock", "late", "early"], name: NAME }],
  [I, ["was cleaning", "found"], [], "Cleaning = background; the find = one moment.", "Mum ______ (clean) the {room} when she ______ (find) my old diary, {name}.", { room: ["attic", "garage", "cupboard", "bedroom"], name: NAME }],
  [I, ["were crossing", "turned"], [], "Crossing went on; the light changed once.", "We ______ (cross) the {road} when the light ______ (turn) red, {name}.", { road: ["road", "street", "square", "bridge"], name: NAME }],
  [I, ["was cooking", "burned"], [], "Cooking = background; the burn = a sudden event.", "Grandma ______ (cook) {food} when she ______ (burn) her hand, {name}.", { food: ["plov", "samsa", "soup", "bread"], name: NAME }],
  [I, ["came", "was snowing"], [], "Coming out = event; snow still falling then.", "When we ______ (come) out of the {place}, it ______ (snow), {name}.", { place: ["cinema", "museum", "school", "theatre"], name: NAME }],
  [I, ["was talking", "fell"], [], "Talking went on; the phone fell once.", "I ______ (talk) to my {who} when my phone ______ (fall) into the water, {name}.", { who: ["friend", "sister", "boss", "cousin"], name: NAME }],
  [I, ["were sitting", "came"], [], "Sitting = background; the waiter came once.", "We ______ (sit) in the {place} when the waiter ______ (come) over, {name}.", { place: ["café", "garden", "restaurant", "teahouse"], name: NAME }],
  [I, ["was riding", "hit"], [], "Riding went on; hitting the stone = a moment.", "Timur ______ (ride) his bike when he ______ (hit) a stone on the {road}, {name}.", { road: ["road", "path", "track", "street"], name: NAME }],
  [I, ["was painting", "spilled"], ["was painting", "spilt"], "Painting = background; the spill = one moment.", "Lola ______ (paint) the {room} when she ______ (spill) the paint, {name}.", { room: ["kitchen", "fence", "bedroom", "door"], name: NAME }],
  [I, ["got", "were sleeping"], [], "Getting home = event; everyone still asleep.", "When I ______ (get) home after the {event}, everyone ______ (sleep), {name}.", { event: ["party", "concert", "match", "wedding"], name: NAME }],
];
BUILD[18][2] = [["was painting", "spilt"]];

const J = "Join the two sentences with when. Long action: past continuous; short event: past simple.";
const FIX = "Correct the mistake. The first action was still going on.";
const TRANSFORM = [
  [J, "I was walking home. It started to rain, {name}. I was near the {place}.", "I ______ home when it ______ to rain, {name}. I was near the {place}.", ["was walking", "started"], "Walk in progress, rain began once.", { place: ["park", "bank", "school", "bridge"], name: NAME }],
  [J, "She was having lunch. Her {who} phoned, {name}.", "She ______ lunch when her {who} ______, {name}.", ["was having", "phoned"], "Lunch = background; the phone call = event.", { who: ["boss", "mum", "friend", "teacher"], name: NAME }],
  [J, "They were playing cards. The {thing} went off, {name}.", "They ______ cards when the {thing} ______ off, {name}.", ["were playing", "went"], "They: were playing; went off = a moment.", { thing: ["alarm", "lights", "radio", "heating"], name: NAME }],
  [J, "We were waiting for the {bus}. We saw an old friend, {name}.", "We ______ for the {bus} when we ______ an old friend, {name}.", ["were waiting", "saw"], "We: were waiting; seeing the friend = event.", { bus: ["bus", "train", "tram", "taxi"], name: NAME }],
  [J, "He was cooking. He cut his finger, {name}. He was making {food}.", "He ______ when he ______ his finger, {name}. He was making {food}.", ["was cooking", "cut"], "Cooking went on; cut is the same in the past.", { food: ["salad", "soup", "plov", "dinner"], name: NAME }],
  [J, "I was sleeping. The {noise} woke me up, {name}.", "I ______ when the {noise} ______ me up, {name}.", ["was sleeping", "woke"], "Asleep in progress; wake → woke.", { noise: ["thunder", "phone", "dog", "doorbell"], name: NAME }],
  [J, "My parents were watching TV. I came home, {name}. It was after the {event}.", "My parents ______ TV when I ______ home, {name}. It was after the {event}.", ["were watching", "came"], "Parents: were watching; come → came.", { event: ["party", "match", "concert", "lesson"], name: NAME }],
  [J, "The teacher was speaking. My {dev} rang, {name}.", "The teacher ______ when my {dev} ______, {name}.", ["was speaking", "rang"], "Speaking in progress; ring → rang.", { dev: ["phone", "watch", "alarm", "tablet"], name: NAME }],
  [J, "We were driving through {place}. The tyre burst, {name}.", "We ______ through {place} when the tyre ______, {name}.", ["were driving", "burst"], "Driving in progress; burst stays burst.", { place: ["the desert", "the hills", "the city", "the valley"], name: NAME }],
  [J, "Olga was shopping at the {shop}. She lost her purse, {name}.", "Olga ______ at the {shop} when she ______ her purse, {name}.", ["was shopping", "lost"], "Shopping in progress; lose → lost.", { shop: ["bazaar", "mall", "supermarket", "market"], name: NAME }],
  [FIX, "I had walked to school when I saw the accident, {name}. It happened near the {place}.", "I ______ to school when I saw the accident, {name}. It happened near the {place}.", "was walking", "The walk was not finished: was walking, not had walked.", { place: ["bridge", "bank", "market", "park"], name: NAME }],
  [FIX, "When I arrived, they cooked, so I helped them, {name}. They made {food}.", "When I arrived, they ______, so I helped them, {name}. They made {food}.", "were cooking", "\"so I helped them\": still in progress: were cooking.", { food: ["plov", "samsa", "soup", "bread"], name: NAME }],
  [FIX, "She was reading when the lights were going out, {name}. It was {time}.", "She was reading when the lights ______ out, {name}. It was {time}.", "went", "One sudden event: went out, not were going out.", { time: ["late", "midnight", "evening", "night"], name: NAME }],
  [FIX, "We was having dinner when the {who} came, {name}.", "We ______ dinner when the {who} came, {name}.", "were having", "We takes were: were having.", { who: ["guests", "neighbours", "postman", "doctor"], name: NAME }],
  [FIX, "He was falling off his bike when he was riding to the {place}, {name}.", "He ______ off his bike when he was riding to the {place}, {name}.", "fell", "The fall was one moment: fell.", { place: ["school", "park", "shop", "lake"], name: NAME }],
];

const CREATE = [
  ["Write one sentence: what were you doing when your phone last rang?", "past continuous + when + past simple", ["exactly one sentence", "was / were + -ing", "when"]],
  ["Write one sentence with 'while' about an accident at home.", "while + past continuous, past simple", ["exactly one sentence", "while", "past simple"]],
  ["Write one sentence about arriving somewhere when people were still doing something.", "When I arrived, … were + -ing", ["exactly one sentence", "When I arrived", "were + -ing"]],
  ["Write one sentence about the weather when you left home this morning.", "it was + -ing when …", ["exactly one sentence", "It was", "when"]],
  ["Write one sentence where a sound interrupts someone sleeping.", "was sleeping when … heard / woke", ["exactly one sentence", "was sleeping", "past simple"]],
  ["Write one sentence about meeting someone while you were travelling.", "past simple event + while + past continuous", ["exactly one sentence", "met", "while"]],
  ["Write one sentence that shows the first action was still going on (use 'so').", "past continuous background + so", ["exactly one sentence", "was / were + -ing", "so"]],
  ["Write one sentence with two people doing things at the same time in the past.", "two past continuous clauses", ["exactly one sentence", "while", "was / were + -ing"]],
];
const EXPRESS = [
  ["Tell a short story about a day when something went wrong. Write three or four sentences.", "past continuous background + past simple events", ["was / were + -ing", "when / while", "three or four sentences"]],
  ["Describe what everyone in your family was doing when you got home yesterday.", "past continuous for a scene", ["were + -ing", "When I got home", "three or four sentences"]],
  ["Tell a friend how you met someone important in your life.", "past simple event against a background", ["was / were + -ing", "met", "three or four sentences"]],
  ["Write about a time the lights went out or the internet stopped. What were people doing?", "background + sudden event", ["were + -ing", "went out / stopped", "three or four sentences"]],
  ["Describe a funny moment from a holiday or a trip.", "past continuous + past simple in a narrative", ["while / when", "past simple", "three or four sentences"]],
];

build(BASE, { CHOOSE, BUILD, TRANSFORM, CREATE, EXPRESS });
