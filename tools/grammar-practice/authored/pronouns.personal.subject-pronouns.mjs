// Hand-authored: pronouns / personal / subject-pronouns (A1).
// Path fill P1 (2026-11-14, Base44 AI, branch grammar-path-fill-base44).
//
// Placement focus: subject pronoun I (not me/my) as the subject, and he
// referring back to a named male (Tom is here. ______ is waiting outside).
// Every blank is the SUBJECT of its verb and every referent is named first, so
// only one person/number fits. Distractors are the same person's object form,
// possessive determiner or possessive pronoun (me/my/mine, him/his, her/hers,
// us/our, them/their, its), plus one wrong-gender or wrong-number subject.
// The blank is never an object (object-pronouns, P13) and never a coordinated
// "my friend and I/me" (subject-object-contrast, P44). "you" is not keyed:
// subject and object are the same word.
//
// Run: node tools/grammar-practice/authored/pronouns.personal.subject-pronouns.mjs

import { writeFileSync } from "node:fs";

const BASE = { domain: "pronouns", branch: "personal", topic: "subject-pronouns", level: "A1", pv: "2.5" };

const O = {
  I: ["I", "Me", "My", "Mine"],
  He: ["He", "Him", "His", "Her"],
  She: ["She", "Her", "Hers", "He"],
  It: ["It", "Its", "They", "Them"],
  We: ["We", "Us", "Our", "They"],
  They: ["They", "Them", "Their", "He"],
};
const low = (k) => O[k].map((x) => (x === "I" ? x : x.toLowerCase()));
const W = {
  I: "You talk about yourself as the subject, so use I. Me and my are never the subject.",
  He: (who) => `${who} is one man or boy, and he is the subject of the verb, so use He. Him and his are not subjects.`,
  She: (who) => `${who} is one woman or girl, and she is the subject of the verb, so use She. Her and hers are not subjects.`,
  It: (what) => `${what} is one thing or animal, and it is the subject of the verb, so use It. Its is a possessive, not a subject.`,
  We: (who) => `${who} means you and someone else. As the subject, use We, not us or our.`,
  They: (who) => `${who} are more than one person or thing. As the subject, use They, not them or their.`,
};

/* ---------------- choose: 20 mcq ---------------- */
const CHOOSE = [
  [O.I, W.I, "______ am from {city}, and my school is near the {place}.",
    { city: ["Samarkand", "Bukhara", "Namangan", "Andijan"], place: ["park", "bus station", "market", "river"] }],
  [O.I, W.I, "______ have breakfast with my {who} at {time}.",
    { who: ["mum", "family", "brother", "grandparents"], time: ["seven", "half past seven", "eight", "quarter past seven"] }],
  [O.He, W.He("Jasur"), "This is my brother Jasur. ______ is {age} and plays {sport}.",
    { age: ["ten", "twelve", "fourteen", "sixteen"], sport: ["football", "chess", "basketball", "tennis"] }],
  [O.He, W.He("Mr Karimov"), "Mr Karimov is our teacher. ______ teaches us {subject} on {day}.",
    { subject: ["English", "maths", "history", "biology"], day: ["Mondays", "Tuesdays", "Thursdays", "Fridays"] }],
  [O.She, W.She("Kamila"), "My sister Kamila is a nurse. ______ works {shift} at a hospital in {city}.",
    { shift: ["at night", "five days a week", "long hours", "every morning"], city: ["Tashkent", "Nukus", "Termez", "Karshi"] }],
  [O.She, W.She("Grandma"), "Grandma lives with us. ______ cooks {food} every {day}.",
    { food: ["plov", "soup", "lagman", "manti"], day: ["Sunday", "Friday", "morning", "evening"] }],
  [low("It"), W.It("The phone"), "My phone is very old, and ______ is {adj}. I need a new one {when}.",
    { adj: ["very slow", "broken", "too small", "cracked"], when: ["soon", "this year", "before school starts", "for my studies"] }],
  [O.It, W.It("The cat"), "We have a cat at home. ______ sleeps on the {place} all {time}.",
    { place: ["sofa", "bed", "carpet", "balcony"], time: ["day", "morning", "afternoon", "evening"] }],
  [O.We, W.We("My friend and I"), "My friend and I are in the same class. ______ sit together in {lesson} and walk home {how}.",
    { lesson: ["English", "maths", "history", "science"], how: ["after school", "every day", "at two o'clock", "in the afternoon"] }],
  [O.We, W.We("My family and I"), "My family and I live in {city}. ______ have a small {home} near the centre.",
    { city: ["Tashkent", "Samarkand", "Fergana", "Kokand"], home: ["flat", "house", "apartment", "garden"] }],
  [O.They, W.They("My grandparents"), "My grandparents live in a village. ______ have {animals} and a big {thing}.",
    { animals: ["cows", "sheep", "chickens", "goats"], thing: ["garden", "house", "apple tree", "field"] }],
  [O.They, W.They("Aziz and Sardor"), "Aziz and Sardor are my friends. ______ play {sport} in the {place}.",
    { sport: ["football", "volleyball", "basketball", "tennis"], place: ["park", "school yard", "sports hall", "stadium"] }],
  [O.I, W.I, "Hello, ______ am {name}. Nice to meet you, {name2}.",
    { name: ["Lola", "Bobur", "Anna", "Timur"], name2: ["Madina", "Sardor", "Olga", "Jasur"] }],
  [O.He, W.He("Dad"), "Dad works at a factory. ______ goes there by {transport} and comes home {state}.",
    { transport: ["bus", "car", "bike", "metro"], state: ["tired", "hungry", "late", "happy"] }],
  [O.She, W.She("Aunt Malika"), "My aunt Malika has a shop. ______ sells {things} in {city}.",
    { things: ["clothes", "shoes", "fruit", "bread"], city: ["Andijan", "Namangan", "Bukhara", "Khiva"] }],
  [O.It, W.It("The bus"), "The {bus} to school is always full. ______ comes every {min} minutes.",
    { bus: ["bus", "minibus", "number 12 bus", "morning bus"], min: ["ten", "fifteen", "twenty", "thirty"] }],
  [O.We, W.We("Lola and I"), "Lola and I love music. ______ listen to {music} on the way to {place}.",
    { music: ["pop songs", "Uzbek songs", "the radio", "English songs"], place: ["school", "the park", "the market", "our English lesson"] }],
  [low("They"), W.They("My parents"), "My parents work in {city}, and ______ come home at {time}.",
    { city: ["Tashkent", "the city centre", "Chirchiq", "Almalyk"], time: ["six", "seven", "half past six", "eight"] }],
  [O.It, W.It("The library"), "Our school has a new library. ______ has lots of {things} and a big {furn}.",
    { things: ["books", "computers", "magazines", "English books"], furn: ["table", "window", "sofa", "map"] }],
  [O.She, W.She("Ms Rakhimova"), "Ms Rakhimova is our English teacher. ______ gives us {task} every {day}.",
    { task: ["homework", "new words", "a short test", "a story to read"], day: ["Monday", "Friday", "lesson", "week"] }],
].map(([options, why, prompt, slots]) => ({ ...BASE, stage: "choose", format: "mcq", prompt, options, key: 0, why, slots }));

/* ---------------- build: 20 gap_fill ---------------- */
const INSTR_B = "Write the subject pronoun (I, he, she, it, we, they) for the word in brackets.";
const BW = (cue, key, who) => `${who} is the subject of the verb, so ${cue} changes to the subject pronoun ${key}.`;
const BUILD = [
  ["I", "me", "you", "My name is Aziz. ______ (me) am {age} years old and live in {city}.",
    { age: ["twelve", "thirteen", "fifteen", "sixteen"], city: ["Tashkent", "Fergana", "Urgench", "Jizzakh"] }],
  ["I", "my", "you", "______ (my) live in {city} with my {who}.",
    { city: ["Samarkand", "Navoi", "Gulistan", "Kokand"], who: ["parents", "grandparents", "family", "uncle"] }],
  ["he", "him", "Bobur", "Bobur is my neighbour. ______ (him) works at the {place} in {area}.",
    { place: ["market", "airport", "hospital", "bank"], area: ["the city centre", "Chilonzor", "our town", "Yunusabad"] }],
  ["he", "his", "Mr Usmonov", "Mr Usmonov drives our school bus. ______ (his) is always {adj} and {adj2}.",
    { adj: ["kind", "friendly", "polite", "cheerful"], adj2: ["careful", "calm", "patient", "helpful"] }],
  ["she", "her", "Your sister", "My sister is a student. ______ (her) studies {subject} in {city}.",
    { subject: ["medicine", "English", "law", "music"], city: ["Tashkent", "Samarkand", "Bukhara", "Namangan"] }],
  ["she", "her", "Aunt Dilnoza", "Aunt Dilnoza loves cooking. ______ (her) makes {food} for the whole {group}.",
    { food: ["plov", "samsa", "manti", "cakes"], group: ["family", "class", "street", "party"] }],
  ["it", "its", "The flat", "Our flat in {city} is small, but ______ (its) has a {feature}.",
    { city: ["Tashkent", "Andijan", "Karshi", "Termez"], feature: ["balcony", "big window", "nice view", "new kitchen"] }],
  ["we", "us", "My friends and I", "My friends and I like sport. ______ (us) play {sport} in the {place}.",
    { sport: ["football", "volleyball", "basketball", "badminton"], place: ["park", "school yard", "sports hall", "youth centre"] }],
  ["we", "our", "My brother and I", "My brother and I have a dog. ______ (our) take it to the {place} {when}.",
    { place: ["park", "river", "big field", "hills"], when: ["after school", "every evening", "on Sundays", "early in the morning"] }],
  ["they", "them", "My grandparents", "My grandparents are very kind. ______ (them) always give me {gift} when I {visit}.",
    { gift: ["sweets", "fruit", "books", "presents"], visit: ["visit them", "come", "stay with them", "go there"] }],
  ["they", "their", "Lola and Madina", "Lola and Madina are twins. ______ (their) go to {place} together on {day}.",
    { place: ["music school", "the gym", "dance class", "the library"], day: ["Mondays", "Tuesdays", "Thursdays", "Saturdays"] }],
  ["she", "her", "Kamila", "Kamila is my best friend. ______ (her) always helps me with {subject} {where}.",
    { subject: ["maths", "English", "homework", "physics"], where: ["at school", "in class", "at the library", "on the phone"] }],
  ["he", "him", "Sardor", "Sardor is new in our class. ______ (him) comes from {city} and speaks {lang}.",
    { city: ["Tashkent", "Nukus", "Fergana", "Bukhara"], lang: ["Russian", "Uzbek", "Tajik", "Kazakh"] }],
  ["he", "him", "Mr Aliev", "Our teacher, Mr Aliev, is funny. ______ (him) tells us {thing} {when}.",
    { thing: ["jokes", "stories", "funny stories", "interesting facts"], when: ["in class", "in every lesson", "at the end of the lesson", "on Fridays"] }],
  ["they", "them", "The students", "The students are tired. ______ (them) want a {pause} before the {lesson}.",
    { pause: ["break", "rest", "snack", "drink"], lesson: ["next lesson", "test", "exam", "maths lesson"] }],
  ["I", "me", "you", "______ (me) don't like {food}, but my {who} loves it.",
    { food: ["fish", "milk", "cheese", "soup"], who: ["brother", "sister", "dad", "mum"] }],
  ["she", "her", "Mrs Karimova", "Mrs Karimova is a doctor. ______ (her) helps {who} at the {place}.",
    { who: ["children", "old people", "sick people", "patients"], place: ["hospital", "clinic", "health centre", "village clinic"] }],
  ["he", "his", "Grandpa", "My grandpa in {city} is seventy, but ______ (his) still {act} every morning.",
    { city: ["Khiva", "Samarkand", "Margilan", "Shahrisabz"], act: ["runs", "swims", "walks five kilometres", "works in the garden"] }],
  ["they", "their", "My cousins", "My cousins live in {city}. ______ (their) visit us every {season}.",
    { city: ["Bukhara", "Almaty", "Moscow", "Andijan"], season: ["summer", "winter", "spring", "autumn"] }],
  ["we", "us", "Timur and I", "Timur and I are on the same team. ______ (us) train {when} at the {place}.",
    { when: ["twice a week", "every evening", "on Saturdays", "after school"], place: ["stadium", "sports centre", "school gym", "club"] }],
].map(([key, cue, who, source, slots]) => ({
  ...BASE, stage: "build", format: "gap_fill", instr: INSTR_B, source, key,
  why: who === "you"
    ? `You are the subject of the verb, so ${cue} changes to I.`
    : BW(cue, key === "I" ? "I" : key[0].toUpperCase() + key.slice(1), who),
  slots,
}));

/* ---------------- transform: 15 rewrite, three kinds ---------------- */
const REP = "Rewrite the second sentence with a pronoun instead of the repeated words.";
const COR = "Correct the pronoun.";
const TRANSFORM = [
  // repeated name -> subject pronoun (5)
  [REP, "He", "This is Aziz. Aziz is from {city} and likes {thing}.", "This is Aziz. ______ is from {city} and likes {thing}.",
    "Aziz is one boy and the subject, so use He instead of repeating his name.", { city: ["Bukhara", "Kokand", "Nukus", "Jizzakh"], thing: ["football", "music", "chess", "maths"] }],
  [REP, "She", "My mum is a teacher. My mum teaches {subject} at a school in {city}.", "My mum is a teacher. ______ teaches {subject} at a school in {city}.",
    "My mum is one woman and the subject, so use She.", { subject: ["English", "maths", "music", "art"], city: ["Tashkent", "Fergana", "Samarkand", "Karshi"] }],
  [REP, "They", "My parents have a car. My parents drive to {place} on {day}.", "My parents have a car. ______ drive to {place} on {day}.",
    "My parents are two people and the subject, so use They.", { place: ["work", "the market", "the village", "Grandma's house"], day: ["Mondays", "Saturdays", "Sundays", "weekdays"] }],
  [REP, "It", "Our school is big. Our school has a {thing} and a {thing2}.", "Our school is big. ______ has a {thing} and a {thing2}.",
    "Our school is one thing and the subject, so use It.", { thing: ["library", "swimming pool", "garden", "sports hall"], thing2: ["canteen", "music room", "computer room", "playground"] }],
  [REP, "We", "Malika and I like books. Malika and I read {thing} before {time}.", "Malika and I like books. ______ read {thing} before {time}.",
    "Malika and I means me and another person. As the subject, use We.", { thing: ["stories", "comics", "English books", "magazines"], time: ["bed", "dinner", "school", "lessons"] }],
  // correct the wrong form (5)
  [COR, "I", "Me live in {city} with my {who}.", "______ live in {city} with my {who}.",
    "The subject is you, so use I. Me is not a subject.", { city: ["Namangan", "Termez", "Urgench", "Navoi"], who: ["parents", "aunt", "grandparents", "big family"] }],
  [COR, "He", "My uncle has a shop in {city}. Him sells {things} there.", "My uncle has a shop in {city}. ______ sells {things} there.",
    "My uncle is the subject of sells, so use He, not him.", { city: ["Andijan", "Samarkand", "Gulistan", "Chirchiq"], things: ["phones", "fruit", "shoes", "books"] }],
  [COR, "She", "Nodira is my cousin. Her studies {subject} in {city}.", "Nodira is my cousin. ______ studies {subject} in {city}.",
    "Nodira is the subject of studies, so use She. Her is not a subject.", { subject: ["English", "medicine", "music", "art"], city: ["Tashkent", "Bukhara", "Kazan", "Seoul"] }],
  [COR, "They", "My friends love {sport}. Them play it {when}.", "My friends love {sport}. ______ play it {when}.",
    "My friends are the subject of play, so use They, not them.", { sport: ["football", "volleyball", "chess", "basketball"], when: ["every Sunday", "after school", "in the evening", "on Saturdays"] }],
  [COR, "We", "Our class has a trip to {place} today. Us want to bring some {food}.", "Our class has a trip to {place} today. ______ want to bring some {food}.",
    "You and your class are the subject of want, so use We, not us.", { place: ["Samarkand", "Khiva", "the museum", "the zoo"], food: ["sandwiches", "fruit", "water", "snacks"] }],
  // change the subject, then the pronoun (5)
  ["Change Aziz to Lola.", "She", "My {who} Aziz is ill today. He is in bed with a {problem}.", "My {who} Lola is ill today. ______ is in bed with a {problem}.",
    "Lola is a girl, so He changes to She.", { who: ["cousin", "friend", "classmate", "neighbour"], problem: ["cold", "fever", "headache", "cough"] }],
  ["Change my brother to my brothers.", "They", "My brother is at the {place}. He is playing {game}.", "My brothers are at the {place}. ______ are playing {game}.",
    "My brothers are more than one person, so He changes to They.", { place: ["park", "stadium", "sports centre", "school yard"], game: ["football", "basketball", "volleyball", "table tennis"] }],
  ["Change I to My friend and I.", "We", "I am at the {place} now. I am waiting for the {bus}.", "My friend and I are at the {place} now. ______ are waiting for the {bus}.",
    "My friend and I means two people including you, so I changes to We.", { place: ["bus stop", "corner", "school gate", "market"], bus: ["bus", "minibus", "school bus", "number 7 bus"] }],
  ["Change Kamila to Grandpa.", "He", "Kamila is in the kitchen. She is making {food} for {who}.", "Grandpa is in the kitchen. ______ is making {food} for {who}.",
    "Grandpa is a man, so She changes to He.", { food: ["plov", "tea", "soup", "breakfast"], who: ["the family", "us", "the guests", "everyone"] }],
  ["Change the cat to the cats.", "They", "The cat is on the {place}. It is sleeping {how}.", "The cats are on the {place}. ______ are sleeping {how}.",
    "The cats are more than one animal, so It changes to They.", { place: ["sofa", "roof", "balcony", "bed"], how: ["in the sun", "together", "quietly", "all day"] }],
].map(([instr, key, source, hint, why, slots]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, why, slots }));

/* ---------------- create: 8 ---------------- */
const CREATE = [
  ["Write one sentence about yourself: your name and where you are from.", "I + verb", ["exactly one sentence", "must start with I", "must name a city or town"]],
  ["Write two sentences about your best friend. Use their name in the first sentence and a pronoun in the second.", "he / she as subject", ["exactly two sentences", "name in sentence one", "he or she starts sentence two"]],
  ["Write one sentence about you and your family. Start with We.", "We + verb", ["exactly one sentence", "must start with We", "must say where you live or what you do"]],
  ["Write two sentences about your grandparents. Use They in the second sentence.", "They as subject", ["exactly two sentences", "They in sentence two", "no them or their as the subject"]],
  ["Write two sentences about your phone or your bag. Use It in the second sentence.", "It as subject", ["exactly two sentences", "It in sentence two", "not Its as the subject"]],
  ["Write one sentence about a teacher at your school. Start with He or She.", "He / She + verb", ["exactly one sentence", "must start with He or She", "must say what the teacher teaches or does"]],
  ["Write one sentence about what you and your friends do after school.", "We + verb", ["exactly one sentence", "must use We as the subject", "must name an activity"]],
  ["Write three short sentences: one with I, one with he or she, one with they.", "I / he / she / they as subjects", ["exactly three sentences", "a different subject pronoun in each", "no me, him, her or them as a subject"]],
].map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints }));

/* ---------------- express: 5 ---------------- */
const EXPRESS = [
  ["Introduce yourself to a new classmate. Write three or four sentences about you and your family.",
    "subject pronouns I / we / he / she", ["I am …", "a family member, then he or she", "we for you and your family"]],
  ["Describe two people in your family. Say who they are, where they work or study and what they like.",
    "he / she / they as subjects", ["he or she instead of repeating the name", "they for two people", "present simple verbs"]],
  ["Write about your best friend: who they are, where they live and what you do together.",
    "he / she / we", ["he or she for the friend", "we for you and your friend", "no him / her as a subject"]],
  ["Describe your home or your school in three or four sentences.",
    "it / they as subjects", ["it for one thing", "they for more than one", "is / has / are"]],
  ["Write a short message to a pen friend about your town and the people in it.",
    "I / we / they / it", ["I and we about yourself", "it for the town", "they for people"]],
].map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor }));

const items = [...CHOOSE, ...BUILD, ...TRANSFORM, ...CREATE, ...EXPRESS];
const out = "content/grammar-practice/pronouns.personal.subject-pronouns.json";
writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
console.log(`wrote ${out} — ${items.length} items`);