// Hand-authored: tenses / past / past-perfect-continuous (B2). Wave D (Claude, 23 Nov 2026).
// One point: had been + -ing for an activity that lasted up to a past moment
// (duration with for / since / all day, or a past result: "Her eyes were red because
// she had been crying"). One right answer: "had + pp" (had driven for six hours) is
// also English, so it is never a distractor; distractors are has been -ing, had -ing
// and had been + base. Build and transform instructions ask for had been + -ing.
import { build, NAME } from "../../../grammar-run/wave-d/skeleton.mjs";
const BASE = { domain: "tenses", branch: "past", topic: "past-perfect-continuous", level: "B2", pv: "2.5" };
const P = (ing, base) => [`had been ${ing}`, `has been ${ing}`, `had ${ing}`, `had been ${base}`];

const CHOOSE = [
  [P("driving", "drive"), "Six hours of driving before he stopped: had been driving.", "He was tired because he ______ for {n} hours before he stopped, {name}.", { n: ["six", "seven", "eight", "five"], name: NAME }],
  [P("crying", "cry"), "Red eyes in the past, caused by earlier crying: had been crying.", "Her eyes were red. She ______ after the {event}, {name}.", { event: ["phone call", "film", "argument", "bad news"], name: NAME }],
  [P("waiting", "wait"), "Waiting lasted until the bus came: had been waiting.", "We ______ for an hour when the {bus} finally came, {name}.", { bus: ["bus", "train", "taxi", "tram"], name: NAME }],
  [P("raining", "rain"), "Wet streets in the past, rain before that: had been raining.", "The streets were wet because it ______ all {time}, {name}.", { time: ["night", "morning", "afternoon", "day"], name: NAME }],
  [P("working", "work"), "From 2015 until the move, a long activity: had been working.", "Before she moved to {city}, she ______ at the same bank since 2015, {name}.", { city: ["the capital", "the coast", "the north", "a new town"], name: NAME }],
  [P("running", "run"), "Out of breath then, after running: had been running.", "Aziz was out of breath. He ______ to catch the {bus}, {name}.", { bus: ["bus", "train", "tram", "minibus"], name: NAME }],
  [P("studying", "study"), "Hours of study before the exam started: had been studying.", "By the time the {exam} started, I ______ for weeks, {name}.", { exam: ["exam", "test", "interview", "final"], name: NAME }],
  [P("playing", "play"), "Dirty clothes because of the earlier game: had been playing.", "The boys' clothes were dirty. They ______ football in the {place}, {name}.", { place: ["park", "yard", "field", "street"], name: NAME }],
  [P("cooking", "cook"), "The kitchen smell came from earlier cooking: had been cooking.", "The kitchen smelled of {food}. Mum ______ all morning, {name}.", { food: ["onions", "plov", "bread", "soup"], name: NAME }],
  [P("living", "live"), "Ten years there, up to the move: had been living.", "They ______ in the {home} for ten years before they sold it, {name}.", { home: ["old flat", "village house", "small house", "big flat"], name: NAME }],
  [P("talking", "talk"), "The talk went on until the teacher came in: had been talking.", "We ______ for twenty minutes when the {who} came in, {name}.", { who: ["teacher", "director", "coach", "manager"], name: NAME }],
  [P("painting", "paint"), "Paint on his hands from earlier work: had been painting.", "There was paint on his hands. He ______ the {room}, {name}.", { room: ["kitchen", "fence", "garage", "bedroom"], name: NAME }],
  [P("trying", "try"), "Many attempts up to that moment: had been trying.", "She ______ to call you all {time} before you answered, {name}.", { time: ["day", "morning", "evening", "afternoon"], name: NAME }],
  [P("sleeping", "sleep"), "Still asleep until the alarm: had been sleeping.", "The baby ______ for only an hour when the {noise} woke her, {name}.", { noise: ["doorbell", "phone", "thunder", "dog"], name: NAME }],
  [P("saving", "save"), "Years of saving before the purchase: had been saving.", "He ______ for two years before he bought the {thing}, {name}.", { thing: ["car", "laptop", "bike", "camera"], name: NAME }],
  [P("snowing", "snow"), "Deep snow then, from days of snowfall: had been snowing.", "The roads to the {place} were closed. It ______ for three days, {name}.", { place: ["village", "mountains", "pass", "airport"], name: NAME }],
  [P("practising", "practise"), "Practice over months before the concert: had been practising.", "She played well at the {event} because she ______ for months, {name}.", { event: ["concert", "competition", "school show", "wedding"], name: NAME }],
  [P("walking", "walk"), "Tired feet after hours of walking: had been walking.", "Our feet hurt. We ______ around the {place} since breakfast, {name}.", { place: ["old town", "market", "museum", "city centre"], name: NAME }],
  [P("looking", "look"), "Searching up to the moment she found it: had been looking.", "She found her {thing} under the sofa. She ______ for it all week, {name}.", { thing: ["keys", "glasses", "ring", "phone"], name: NAME }],
  [P("learning", "learn"), "Years of study before the trip: had been learning.", "He spoke well on the trip. He ______ {lang} for three years, {name}.", { lang: ["Korean", "English", "German", "Turkish"], name: NAME }],
];

const I = "Use the past perfect continuous (had been + -ing).";
const BUILD = [
  [I, "had been waiting", [], "Waiting went on until the doctor came: had been waiting.", "We ______ (wait) for two hours when the {who} finally called us, {name}.", { who: ["doctor", "nurse", "dentist", "manager"], name: NAME }],
  [I, "had been running", [], "Out of breath then: run → had been running.", "Timur was out of breath because he ______ (run) to the {place}, {name}.", { place: ["station", "school", "bus stop", "shop"], name: NAME }],
  [I, "had been crying", [], "A wet face after crying: had been crying.", "The little girl's face was wet. She ______ (cry) for her {thing}, {name}.", { thing: ["mum", "toy", "dog", "doll"], name: NAME }],
  [I, "had been working", [], "Decades at one job until he retired: had been working.", "My grandpa ______ (work) at the {place} for forty years when he retired, {name}.", { place: ["factory", "school", "hospital", "post office"], name: NAME }],
  [I, "had been raining", [], "Puddles came from rain before: had been raining.", "There were puddles everywhere. It ______ (rain) all {time}, {name}.", { time: ["night", "morning", "day", "afternoon"], name: NAME }],
  [I, "had been studying", [], "Long study before the exam: had been studying.", "Lola passed easily. She ______ (study) since {month}, {name}.", { month: ["January", "March", "September", "the spring"], name: NAME }],
  [I, "had been playing", [], "Two hours of play before the rain: had been playing.", "The children ______ (play) in the {place} for two hours when it started to rain, {name}.", { place: ["park", "yard", "garden", "street"], name: NAME }],
  [I, "had been cooking", [], "Hot and tired from earlier cooking: had been cooking.", "Mum was hot and tired. She ______ (cook) {food} all day, {name}.", { food: ["plov", "samsa", "soup", "bread"], name: NAME }],
  [I, "had been living", [], "Years in the city before moving: had been living.", "They ______ (live) in the {home} for years before they moved, {name}.", { home: ["old flat", "village", "small town", "big house"], name: NAME }],
  [I, "had been talking", [], "A long talk before the battery died: had been talking.", "We ______ (talk) on the phone for an hour when my {dev} died, {name}.", { dev: ["phone", "battery", "laptop", "tablet"], name: NAME }],
  [I, "had been snowing", [], "Days of snow before the roads closed: had been snowing.", "It ______ (snow) for two days, so the {place} was closed, {name}.", { place: ["school", "road", "airport", "market"], name: NAME }],
  [I, "had been trying", [], "Many tries before the call got through: had been trying.", "I ______ (try) to call the {office} all morning before someone answered, {name}.", { office: ["bank", "clinic", "school", "hotel"], name: NAME }],
  [I, "had been sleeping", [], "Asleep up to the noise: had been sleeping.", "Grandpa ______ (sleep) for an hour when the {noise} woke him, {name}.", { noise: ["phone", "doorbell", "dog", "thunder"], name: NAME }],
  [I, "had been saving", [], "Months of saving before the trip: had been saving.", "They ______ (save) for a year before the trip to the {place}, {name}.", { place: ["coast", "mountains", "capital", "lake"], name: NAME }],
  [I, "had been practising", ["had been practicing"], "Months of practice before the show: had been practising.", "The band ______ (practise) for months before the {event}, {name}.", { event: ["concert", "festival", "wedding", "school show"], name: NAME }],
  [I, "had been walking", [], "Sore feet from a long walk: had been walking.", "Our legs hurt. We ______ (walk) in the {place} all afternoon, {name}.", { place: ["mountains", "old town", "park", "market"], name: NAME }],
  [I, "had been looking", [], "A long search before she found it: had been looking.", "She ______ (look) for a job for months before the {company} called her, {name}.", { company: ["bank", "hotel", "school", "shop"], name: NAME }],
  [I, "had been learning", [], "Years of learning before the move: had been learning.", "Before he moved, he ______ (learn) {lang} for two years, {name}.", { lang: ["Korean", "English", "German", "Turkish"], name: NAME }],
  [I, "had been driving", [], "Hours at the wheel before the stop: had been driving.", "Dad ______ (drive) for five hours when we stopped at a {place}, {name}.", { place: ["café", "petrol station", "market", "rest stop"], name: NAME }],
  [I, "had been painting", [], "Paint on her clothes from earlier work: had been painting.", "There was paint on her clothes. She ______ (paint) the {room}, {name}.", { room: ["kitchen", "fence", "bedroom", "door"], name: NAME }],
];

const CUE = "Join the facts. Use the verb in brackets in the past perfect continuous.";
const FIX = "Correct the mistake. The story is in the past.";
const ASK = "Make the question. Use had … been + -ing.";
const TRANSFORM = [
  [CUE, "She started waiting at three. The {bus} came at five, {name}.", "She ______ (wait) for two hours when the {bus} came, {name}.", "had been waiting", "From three to five, up to a past moment: had been waiting.", { bus: ["bus", "train", "tram", "taxi"], name: NAME }],
  [CUE, "He started studying at eight. At midnight he was very tired, {name}. He had a {exam} the next day.", "He was tired because he ______ (study) since eight, {name}. He had a {exam} the next day.", "had been studying", "Eight to midnight explains the tiredness: had been studying.", { exam: ["test", "maths exam", "history exam", "big exam"], name: NAME }],
  [CUE, "It started raining on Monday. On Wednesday the {river} was very high, {name}.", "The {river} was very high because it ______ (rain) since Monday, {name}.", "had been raining", "Monday to Wednesday, rain explains the high water.", { river: ["river", "canal", "lake", "stream"], name: NAME }],
  [CUE, "They began building the {bldg} in 2019. In 2023 it was still not ready, {name}.", "In 2023 they ______ (build) the {bldg} for four years, {name}.", "had been building", "Four years of building up to 2023: had been building.", { bldg: ["bridge", "school", "stadium", "hospital"], name: NAME }],
  [CUE, "I started reading at six. My {who} called at nine, {name}.", "I ______ (read) for three hours when my {who} called, {name}.", "had been reading", "Six to nine, until the call: had been reading.", { who: ["mum", "friend", "brother", "cousin"], name: NAME }],
  [FIX, "When I arrived, they has been waiting for an hour at the {place}, {name}.", "When I arrived, they ______ for an hour at the {place}, {name}.", "had been waiting", "A past story needs had, not has: had been waiting.", { place: ["café", "station", "gate", "cinema"], name: NAME }],
  [FIX, "She was tired because she had been work in the {place} all day, {name}.", "She was tired because she ______ in the {place} all day, {name}.", "had been working", "After had been, the -ing form: working.", { place: ["garden", "shop", "office", "kitchen"], name: NAME }],
  [FIX, "His hands were dirty. He had been fix his {thing}, {name}.", "His hands were dirty. He ______ his {thing}, {name}.", "had been fixing", "had been + -ing: fixing, not fix.", { thing: ["bike", "car", "motorbike", "scooter"], name: NAME }],
  [FIX, "We was been talking for an hour when the {who} arrived, {name}.", "We ______ for an hour when the {who} arrived, {name}.", "had been talking", "The form is had been + -ing, not was been.", { who: ["guests", "teacher", "taxi", "doctor"], name: NAME }],
  [FIX, "It had been snowed all night, so the {place} was white, {name}.", "It ______ all night, so the {place} was white, {name}.", "had been snowing", "Duration of an activity: had been snowing, not snowed.", { place: ["garden", "street", "yard", "park"], name: NAME }],
  [ASK, "You were tired. Ask how long you had worked that day, {name}. It was at the {place}.", "How long ______ you ______ at the {place} that day, {name}?", ["had", "been working"], "Question order: had + subject + been + -ing.", { place: ["shop", "café", "factory", "office"], name: NAME }],
  [ASK, "She was waiting when the {bus} came. Ask how long, {name}.", "How long ______ she ______ when the {bus} came, {name}?", ["had", "been waiting"], "had before she, then been waiting.", { bus: ["bus", "train", "tram", "taxi"], name: NAME }],
  [ASK, "They lived in {city} before they moved. Ask how long, {name}.", "How long ______ they ______ in {city} before they moved, {name}?", ["had", "been living"], "How long + had + they + been living.", { city: ["the capital", "the village", "that town", "the north"], name: NAME }],
  [ASK, "Her eyes were red. Ask if she had cried, {name}. She was at the {place}.", "______ she ______ at the {place}, {name}?", ["Had", "been crying"], "Yes/no question: Had + she + been crying.", { place: ["cinema", "hospital", "station", "party"], name: NAME }],
  [ASK, "The ground was wet. Ask if it had rained in the {time}, {name}.", "______ it ______ in the {time}, {name}?", ["Had", "been raining"], "Yes/no question about the cause: Had it been raining?", { time: ["night", "morning", "afternoon", "evening"], name: NAME }],
];

const CREATE = [
  ["Write one sentence about why you were tired yesterday.", "had been + -ing as a cause", ["exactly one sentence", "because", "had been + -ing"]],
  ["Write one sentence: how long had you been waiting when something happened?", "had been + -ing + for + when", ["exactly one sentence", "for", "when"]],
  ["Write one sentence about a place your family had been living in before you moved.", "had been living … before", ["exactly one sentence", "had been living", "before"]],
  ["Write one sentence that explains why someone's clothes were dirty.", "had been + -ing for a visible past result", ["exactly one sentence", "had been", "-ing"]],
  ["Write one question with How long had … been …?", "question with had been + -ing", ["exactly one question", "How long", "had … been"]],
  ["Write one sentence about something you had been learning before a trip or exam.", "had been learning / practising", ["exactly one sentence", "had been", "before"]],
  ["Write one sentence with 'since' and the past perfect continuous.", "had been + -ing + since", ["exactly one sentence", "since", "had been"]],
  ["Write one sentence about the weather before a past event.", "it had been raining / snowing", ["exactly one sentence", "It had been", "-ing"]],
];
const EXPRESS = [
  ["Tell the story of a long wait (at a station, a clinic or an office). Write three or four sentences.", "past perfect continuous for duration", ["had been waiting", "when", "three or four sentences"]],
  ["You came home very tired one day. Explain why: what had you been doing?", "had been + -ing as a reason", ["because", "had been", "three or four sentences"]],
  ["Describe a big change in your family's life and what you had been doing before it.", "had been + -ing before a past event", ["had been", "before", "three or four sentences"]],
  ["Write a short story that starts: 'When the lights went out, we had been …'", "past perfect continuous in a narrative", ["had been", "past simple events", "three or four sentences"]],
  ["Tell a friend about a skill you had been practising for a long time before a test or show.", "had been practising / learning", ["had been", "for / since", "three or four sentences"]],
];

build(BASE, { CHOOSE, BUILD, TRANSFORM, CREATE, EXPRESS });
