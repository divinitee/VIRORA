// Which "thinking" sound fits what the student just said? (Live Teacher v2)
// Instant and free: a word check in English, Uzbek and Russian. When unsure,
// "neutral" (sounds that fit ANY sentence). Order matters: sadness wins over
// a question ("why am I so tired?" gets sympathy, not "good question").
//   empathy | question | positive | neutral

const EMPATHY = [
  // English
  'sad', 'tired', 'exhausted', 'sick', ' ill ', 'upset', 'angry', 'bad day', 'terrible', 'awful', 'horrible', 'lonely', 'alone',
  'died', ' dead ', 'death', 'passed away', 'funeral', 'lost my', 'miss him', 'miss her', 'miss my', 'cry', 'crying', 'cried',
  'stress', 'worried', 'worry', 'afraid', 'scared', 'hurt', ' pain ', 'painful', 'broke up', 'failed', 'fail', 'depress', 'hate my',
  'nobody', 'bored', 'not good', 'not well', 'not okay', 'unhappy', 'headache', 'hospital',
  // Uzbek (Latin, with and without the ' / ʻ marks)
  'xafa', 'charcha', 'kasal', 'yomon', 'qayg', "g'amgin", 'gamgin', 'yolg', 'vafot', 'qo\'rq', 'qorq', 'siqil', 'zerik',
  'og\'ri', 'ogri', 'yig\'la', 'yigla', 'muammo', 'jahlim', 'asabim', 'ishdan ketdim', 'yiqildim',
  // Russian
  'грустн', 'устал', 'болею', 'болен', 'больна', 'плохо', 'ужасн', 'одинок', 'умер', 'умерла', 'скучаю', 'плач', 'стресс',
  'боюсь', 'страшно', 'больно', 'проблем', 'обидно', 'злой', 'злюсь', 'расстро', 'скучно',
];
const POSITIVE = [
  'great', 'amazing', 'awesome', 'happy', 'excited', 'i won', 'we won', 'passed', 'got the job', 'got a job', 'fantastic',
  'birthday', 'good news', 'glad', 'wonderful', 'love it', 'perfect', 'finally', 'promoted', 'new job', 'wedding', 'vacation',
  "zo'r", 'zor', 'ajoyib', 'xursand', 'baxtli', 'yutdim', "o'tdim", 'otdim', 'tug\'ilgan kun', 'tugilgan kun',
  'отлично', 'круто', 'рад', 'счастлив', 'ура', 'выиграл', 'сдал', 'классно', 'супер', 'день рождения',
];
const QUESTION_START = /^(what|why|how|when|where|who|which|can|could|should|would|is|are|do|does|did|will|nima|nega|qanday|qachon|qayer|kim|nimaga|что|почему|как|когда|где|кто|зачем|можно)(?=[\s,?!.]|$)/i;

const norm = (s) => ` ${String(s || '').toLowerCase()
  .replace(/[\[(][^\])]*[\])]/g, ' ') // (laughter), [mouse clicking]
  .replace(/[’`ʻʼ]/g, "'")
  .replace(/[^\p{L}\p{N}'\s]/gu, ' ') // punctuation -> space, so " ill." still matches " ill "
  .replace(/\s+/g, ' ').trim()} `;
const has = (text, words) => words.some((w) => text.includes(w));

export function fillerMood(studentText) {
  const t = norm(studentText);
  if (t.trim().length < 2) return 'neutral';
  if (has(t, EMPATHY) && !/\bnot (that )?bad\b/.test(t)) return 'empathy';
  const raw = String(studentText || '').trim();
  if (/\?\s*$/.test(raw) || QUESTION_START.test(raw) || / mi $/.test(t)) return 'question';
  if (has(t, POSITIVE)) return 'positive';
  return 'neutral';
}
