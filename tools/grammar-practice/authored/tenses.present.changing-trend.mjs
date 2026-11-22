// Hand-authored: tenses / present / changing-trend (B2). Wave D (Claude, 23 Nov 2026).
// One point: the present continuous for a change in progress ("is getting better",
// "more and more people are learning …", "these days / day by day / -er and -er").
// One right answer: choose distractors are form errors or a past simple that clashes
// with "these days / now"; no present simple distractor (natives say "More people
// shop online these days"). Build and transform instructions ask for the present
// continuous, so a typed present simple is not a second right answer.
import { build, NAME } from "../../../grammar-run/wave-d/skeleton.mjs";
const BASE = { domain: "tenses", branch: "present", topic: "changing-trend", level: "B2", pv: "2.5" };
const O = (be, ing, past, base) => [`${be} ${ing}`, past, ing, `${be} ${base}`];

const CHOOSE = [
  [O("is", "getting", "got", "get"), "Improving step by step now: be + -ing: is getting.", "Your {skill} ______ better every week, {name}. Keep going!", { skill: ["English", "cooking", "handwriting", "swimming"], name: NAME }],
  [O("are", "going", "went", "go"), "\"these days\" + a change still happening: are going up.", "Food prices at the {shop} ______ up these days, {name}.", { shop: ["bazaar", "supermarket", "corner shop", "bakery"], name: NAME }],
  [O("are", "learning", "learned", "learn"), "\"more and more\" shows a growing trend: are learning.", "More and more young people ______ {lang} these days, {name}.", { lang: ["Korean", "English", "Chinese", "German"], name: NAME }],
  [O("are", "getting", "got", "get"), "Shorter day after day at this time of year: are getting.", "The days ______ shorter now that it's {month}, {name}.", { month: ["October", "November", "autumn", "late autumn"], name: NAME }],
  [O("is", "growing", "grew", "grow"), "New buildings all the time show the change: is growing.", "Our little town ______ fast, {name}. There are new {bldg} everywhere.", { bldg: ["houses", "shops", "cafés", "schools"], name: NAME }],
  [O("are", "becoming", "became", "become"), "More popular now than before, and still changing: are becoming.", "Electric cars ______ more popular in {place} these days, {name}.", { place: ["our town", "our city", "our district", "the suburbs"], name: NAME }],
  [O("is", "getting", "got", "get"), "\"day by day\" marks a slow change in progress: is getting.", "The weather ______ warmer day by day, {name}. Spring is {near}.", { near: ["coming", "almost here", "on its way", "close"], name: NAME }],
  [O("is", "getting", "got", "get"), "\"slower and slower\": a change that is still going on: is getting.", "My old {dev} ______ slower and slower, {name}.", { dev: ["laptop", "phone", "computer", "printer"], name: NAME }],
  [O("are", "climbing", "climbed", "climb"), "\"at the moment\" + a rise in progress: are climbing.", "Rents in the {area} ______ higher at the moment, {name}.", { area: ["centre", "old town", "new district", "city"], name: NAME }],
  [O("are", "writing", "wrote", "write"), "Fewer than before, and still falling: are writing.", "Fewer people ______ letters nowadays, {name}. Everyone sends {msg}.", { msg: ["messages", "emails", "voice notes", "photos"], name: NAME }],
  [O("is", "getting", "got", "get"), "\"longer and longer\" at this moment: is getting.", "The queue at the {office} ______ longer and longer, {name}.", { office: ["bank", "post office", "clinic", "ticket office"], name: NAME }],
  [O("is", "getting", "got", "get"), "This season, still improving game by game: is getting.", "Our team ______ stronger this season, {name}. We've won {n} games.", { n: ["three", "four", "five", "six"], name: NAME }],
  [O("are", "spending", "spent", "spend"), "A habit that keeps growing now: are spending.", "{kids} ______ more and more time on screens these days, {name}.", { kids: ["Children", "Teenagers", "Students", "Adults"], name: NAME }],
  [O("is", "melting", "melted", "melt"), "Warmer each day, so it's changing now: is melting.", "The ice on the {water} ______, {name}. Don't walk on it!", { water: ["lake", "pond", "river", "canal"], name: NAME }],
  [O("are", "coming", "came", "come"), "\"this month\" + prices still falling: are coming down.", "Prices for {item} ______ down this month, {name}.", { item: ["phones", "laptops", "TVs", "bikes"], name: NAME }],
  [O("is", "growing", "grew", "grow"), "The short trousers prove he's still growing now.", "My little {boy} ______ so fast, {name}! Look at his trousers.", { boy: ["brother", "son", "nephew", "cousin"], name: NAME }],
  [O("is", "getting", "got", "get"), "\"worse and worse\": a change in progress: is getting.", "The traffic in the {area} ______ worse and worse, {name}.", { area: ["centre", "old town", "new district", "market area"], name: NAME }],
  [O("are", "visiting", "visited", "visit"), "More than before, and the number goes on rising: are visiting.", "More tourists ______ our {place} these days, {name}.", { place: ["village", "valley", "town", "mountains"], name: NAME }],
  [O("is", "gaining", "gained", "gain"), "Users increase month after month: is gaining.", "The {club} ______ more and more members, {name}.", { club: ["new app", "chess club", "sports club", "book club"], name: NAME }],
  [O("are", "growing", "grew", "grow"), "\"this year\", and the plants are still growing well.", "Your {plants} ______ really well this year, {name}.", { plants: ["tomatoes", "roses", "grapes", "beans"], name: NAME }],
];

const I = "Something is changing these days. Put the verb in the present continuous.";
const BUILD = [
  [I, "is getting", [], "Better and better over time: get → is getting.", "My cousin's {skill} ______ (get) better and better, {name}.", { skill: ["Russian", "English", "chess", "cooking"], name: NAME }],
  [I, "are going", [], "Fares up this year, still changing: are going.", "Bus fares ______ (go) up this year, {name}, so I walk to {where}.", { where: ["school", "work", "the bazaar", "college"], name: NAME }],
  [I, "are becoming", [], "More popular than before: become → are becoming.", "Bikes ______ (become) more popular in our {area}, {name}.", { area: ["town", "street", "district", "village"], name: NAME }],
  [I, "is changing", [], "New places open every month: change → is changing.", "Our neighbourhood ______ (change) fast, {name}. New {bldg} open every month.", { bldg: ["cafés", "shops", "gyms", "bakeries"], name: NAME }],
  [I, "are getting", [], "Colder night after night in this season: are getting.", "The nights ______ (get) colder now that it's {month}, {name}.", { month: ["October", "November", "autumn", "late autumn"], name: NAME }],
  [I, "is improving", [], "\"slowly\" + a road that gets better: is improving.", "The road to the {place} ______ (improve) slowly, {name}.", { place: ["airport", "village", "station", "market"], name: NAME }],
  [I, "are learning", [], "\"more and more adults\": a trend: are learning.", "More and more adults ______ (learn) {lang} online, {name}.", { lang: ["Korean", "English", "Chinese", "German"], name: NAME }],
  [I, "is growing", [], "The number keeps rising: grow → is growing.", "The number of cars in our {area} ______ (grow) every month, {name}.", { area: ["town", "street", "district", "village"], name: NAME }],
  [I, "are spending", [], "\"more and more time\": spend → are spending.", "Teenagers ______ (spend) more and more time on their {dev}, {name}.", { dev: ["phones", "tablets", "laptops", "consoles"], name: NAME }],
  [I, "is increasing", [], "\"at the moment\" + a price going up: is increasing.", "The price of {food} ______ (increase) at the moment, {name}.", { food: ["rice", "sugar", "meat", "bread"], name: NAME }],
  [I, "are falling", [], "\"this year\" + prices going down: are falling.", "Phone prices ______ (fall) this year, {name}. Wait for the {sale}.", { sale: ["summer sale", "new model", "holidays", "autumn sale"], name: NAME }],
  [I, "is getting", [], "Warmer week after week: the water is getting warmer.", "The water in the {water} ______ (get) warmer every week, {name}.", { water: ["lake", "pool", "river", "sea"], name: NAME }],
  [I, "am getting", [], "I + be = am: I am getting better.", "I ______ (get) better at {skill}, {name}. My teacher says so.", { skill: ["maths", "tennis", "drawing", "singing"], name: NAME }],
  [I, "are moving", [], "\"more young families\" these days: are moving.", "More young families ______ (move) to the {area} these days, {name}.", { area: ["suburbs", "new district", "countryside", "old town"], name: NAME }],
  [I, "is getting", [], "Bigger every year, a change still going on: is getting.", "My grandmother's garden ______ (get) bigger every year, {name}. Now she grows {veg}.", { veg: ["melons", "potatoes", "onions", "peppers"], name: NAME }],
  [I, "are opening", [], "New ones all over the city: open → are opening.", "New {shops} ______ (open) all over the city these days, {name}.", { shops: ["cafés", "gyms", "bookshops", "bakeries"], name: NAME }],
  [I, "is becoming", [], "More confident than before: become → is becoming.", "Our {group} ______ (become) more confident in English, {name}.", { group: ["class", "son", "daughter", "group"], name: NAME }],
  [I, "are getting", [], "\"cheaper and cheaper\": are getting.", "Smartphones ______ (get) cheaper and cheaper, {name}. Even my {who} has one.", { who: ["grandma", "little brother", "grandpa", "neighbour"], name: NAME }],
  [I, "is going", [], "Earlier day by day: the sun is going down earlier.", "The sun ______ (go) down earlier these days, {name}. It's dark by {h}.", { h: ["five", "six", "half past five", "six o'clock"], name: NAME }],
  [I, "are improving", [], "Better results month after month: are improving.", "Your test results ______ (improve) every month, {name}. Well done in {subject}.", { subject: ["maths", "physics", "English", "history"], name: NAME }],
];

const FIX = "Correct the mistake. Use the present continuous.";
const CUE = "Say what is changing now. Use the verb in brackets in the present continuous.";
const TWO = "Say it with the present continuous and a double comparative (-er and -er / more and more).";
const TRANSFORM = [
  [FIX, "Prices at the {shop} is going up these days, {name}.", "Prices at the {shop} ______ up these days, {name}.", "are going", "Prices is plural, so are, not is.", { shop: ["bazaar", "supermarket", "corner shop", "bakery"], name: NAME }],
  [FIX, "Our town growing very fast, {name}. Look at all the {bldg}.", "Our town ______ very fast, {name}. Look at all the {bldg}.", "is growing", "be is missing: is growing.", { bldg: ["new houses", "new shops", "cranes", "new roads"], name: NAME }],
  [FIX, "More people are use bikes in our {area} now, {name}.", "More people ______ bikes in our {area} now, {name}.", "are using", "After are, the -ing form: using.", { area: ["town", "street", "district", "village"], name: NAME }],
  [FIX, "My {skill} get better and better, {name}.", "My {skill} ______ better and better, {name}.", "is getting", "A change in progress: is getting, not get.", { skill: ["English", "cooking", "handwriting", "chess"], name: NAME }],
  [FIX, "The days are get longer now that it's {month}, {name}.", "The days ______ longer now that it's {month}, {name}.", "are getting", "are + -ing, never are + base: are getting.", { month: ["March", "April", "spring", "early spring"], name: NAME }],
  [CUE, "Last year few people in our {area} had electric bikes. Now many people buy them, {name}.", "More and more people ______ (buy) electric bikes, {name}.", "are buying", "A trend growing now: more and more people are buying.", { area: ["town", "street", "district", "village"], name: NAME }],
  [CUE, "Ten years ago the {river} was clean. Now it is dirtier every year, {name}.", "The {river} ______ (become) dirtier, {name}.", "is becoming", "Dirtier year after year: is becoming.", { river: ["river", "lake", "canal", "pond"], name: NAME }],
  [CUE, "In {month1} it was hot. In {month2} it is cooler, {name}.", "The weather ______ (get) cooler, {name}.", "is getting", "From hot to cooler, still changing: is getting.", { month1: ["August", "July", "June", "late August"], month2: ["September", "October", "autumn", "early autumn"], name: NAME }],
  [CUE, "Before, my sister read one book a month. Now she reads two or three, {name}. She loves {genre}.", "My sister ______ (read) more and more, {name}. She loves {genre}.", "is reading", "From one book to three: is reading more and more.", { genre: ["novels", "poems", "comics", "short stories"], name: NAME }],
  [CUE, "Last year our club had {n} members. Now it has many more, {name}.", "Our club ______ (grow), {name}.", "is growing", "More members than last year: is growing.", { n: ["ten", "twelve", "fifteen", "twenty"], name: NAME }],
  [TWO, "The {road} is busy now. Tomorrow it will be even busier, {name}.", "The {road} ______ ______ (busy), {name}.", ["is getting", "busier and busier"], "be + getting, then busy → busier and busier.", { road: ["main road", "bridge", "ring road", "market street"], name: NAME }],
  [TWO, "The {shop} is popular. Every month it is more popular, {name}.", "The {shop} ______ ______ popular, {name}.", ["is becoming", "more and more"], "Long adjective: more and more popular; is becoming.", { shop: ["new café", "bookshop", "bakery", "gym"], name: NAME }],
  [TWO, "My {dev} was fast. Now it is slower every week, {name}.", "My {dev} ______ ______ (slow), {name}.", ["is getting", "slower and slower"], "Short adjective: slower and slower; is getting.", { dev: ["laptop", "phone", "computer", "tablet"], name: NAME }],
  [TWO, "Flights to the {place} were cheap. Every year they are more expensive, {name}.", "Flights to the {place} ______ ______ expensive, {name}.", ["are getting", "more and more"], "Plural flights: are getting more and more expensive.", { place: ["coast", "mountains", "capital", "islands"], name: NAME }, [["are becoming", "more and more"]]],
  [TWO, "My grandpa's walks were long. Every week they are shorter, {name}. He is {age} now.", "My grandpa's walks ______ ______ (short), {name}. He is {age} now.", ["are getting", "shorter and shorter"], "Plural walks: are getting shorter and shorter.", { age: ["eighty", "eighty-five", "ninety", "seventy-nine"], name: NAME }],
];

const CREATE = [
  ["Write one sentence about something that is getting better in your life.", "present continuous for a change (is getting better)", ["exactly one sentence", "is / are getting", "better or -er"]],
  ["Write one sentence about prices in your town these days.", "present continuous for a trend", ["exactly one sentence", "these days", "are going up / are falling"]],
  ["Write one sentence with 'more and more people' and the present continuous.", "more and more people + are + -ing", ["exactly one sentence", "more and more people", "are + -ing"]],
  ["Write one sentence about the weather this month.", "is getting + comparative", ["exactly one sentence", "is getting", "warmer / colder"]],
  ["Write one sentence about your English using a double comparative.", "is getting + -er and -er / more and more", ["exactly one sentence", "and", "is getting"]],
  ["Write one sentence about something popular among young people now.", "is / are becoming more popular", ["exactly one sentence", "becoming", "popular"]],
  ["Write one sentence about a place that is changing fast.", "present continuous for change", ["exactly one sentence", "is changing / is growing", "fast"]],
  ["Write one sentence about something that people do less these days.", "fewer people are + -ing / people are … less", ["exactly one sentence", "these days", "are + -ing"]],
];
const EXPRESS = [
  ["How is your town or village changing? Write three or four sentences.", "present continuous for trends", ["is / are + -ing", "these days / more and more", "three or four sentences"]],
  ["Describe how technology is changing the way your family lives. Write three or four sentences.", "present continuous for trends", ["is / are + -ing", "more and more / less and less", "three or four sentences"]],
  ["Your English is changing this year. Tell a friend what is getting better and what is still hard.", "is getting + comparative", ["is getting", "better / easier", "three or four sentences"]],
  ["Write a short message to a friend abroad about prices and life in your city now.", "present continuous for trends", ["are going up / are falling", "these days", "three or four sentences"]],
  ["What are young people in your country doing more these days? Give two or three examples.", "more and more + present continuous", ["more and more", "are + -ing", "two or three examples"]],
];

build(BASE, { CHOOSE, BUILD, TRANSFORM, CREATE, EXPRESS });
