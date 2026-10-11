// Pure helpers for the Coach word check (VT-40 Stage 3). Questions use the
// existing "quiz" evidence contract, so the SERVER grades them
// (progressCore.gradeTranslation): multiple_choice = pick the native
// translation; translation = pick the English headword.

/** Questions per word by plan depth (a word is small; grammar uses the full count). */
export const WORD_QUESTIONS = { probe: 1, brushup: 2, practice: 2, remediation: 3 };

export const nativeKeyFor = (lang) => (lang === "ru" ? "russian" : "uzbek");

function shuffle(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/**
 * Build the questions for one word. Distractors come from `pool` (other words),
 * never the target, never duplicates, never empty. Returns [] when the word has
 * no usable native translation (then the item is skipped, not faked).
 */
export function buildWordQuestions(word, pool, { depth, lang, rnd = Math.random } = {}) {
  const nk = nativeKeyFor(lang);
  // Strictly the learner's language: no Uzbek fallback for Russian learners
  // (a lone Uzbek option among Russian ones would give the answer away). The
  // server only plans words that have BOTH translations (coachEngine.contentGate);
  // distractors without the learner's language are simply not used.
  const native = (w) => String(w?.[nk] || "").trim();
  if (!word?.english || !native(word)) return [];
  const n = WORD_QUESTIONS[depth] || 1;
  // Distinct distractors only: one per id, and never two options that mean the
  // same. Compared per sense ("уверенный; определённый" -> both), without any
  // "(qualifier)", ignoring case, punctuation and ё/е ("счет" = "счёт").
  const norm = (s) => String(s || "").toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}']+/gu, " ").trim();
  const senses = (s) => {
    const out = new Set([norm(s)]);
    for (const part of String(s || "").split(/[;,/]/)) { out.add(norm(part)); out.add(norm(part.replace(/\([^)]*\)/g, " "))); }
    out.delete("");
    return out;
  };
  // A distractor written in the other script (Latin in Russian, Cyrillic in Uzbek) is never offered.
  const wrongScript = nk === "russian" ? /[A-Za-z]/ : /[\u0400-\u04FF]/;
  const targetText = new Set([...senses(native(word)), norm(word.english)]);
  const seenId = new Set(), seenText = new Set(targetText);
  const clash = (w) => [...senses(native(w))].some((x) => seenText.has(x)) || seenText.has(norm(w.english));
  // A row sharing a sense or the headword with the target (bill/account = "счет")
  // is a second right answer: neither its meaning nor its headword may be an option.
  for (const w of pool) {
    if (w && w.id !== word.id && ([...senses(native(w))].some((x) => targetText.has(x)) || targetText.has(norm(w.english)))) {
      senses(native(w)).forEach((x) => seenText.add(x)); seenText.add(norm(w.english));
    }
  }
  const others = pool.filter((w) => {
    if (!w || w.id === word.id || seenId.has(w.id) || !w.english || !native(w) || wrongScript.test(native(w))) return false;
    if (clash(w)) return false;
    seenId.add(w.id); senses(native(w)).forEach((x) => seenText.add(x)); seenText.add(norm(w.english));
    return true;
  });
  const qs = [];
  for (let k = 0; k < n; k++) {
    const type = k % 2 === 0 ? "multiple_choice" : "translation";
    const picks = shuffle(others, rnd).slice(0, 3);
    if (picks.length < 2) break;
    const correct = type === "multiple_choice" ? native(word) : word.english;
    const options = shuffle([correct, ...picks.map((w) => (type === "multiple_choice" ? native(w) : w.english))], rnd);
    qs.push({ type, prompt: type === "multiple_choice" ? word.english : native(word), options, correct });
  }
  return qs;
}

/** The evidence item the server grades itself (given = the option text chosen). */
export const evidenceItem = (word, q, given) => ({ word: word.english, word_id: word.id, type: q.type, given, correct: given === q.correct });

/** "grammar:tenses.present.simple-routine" -> ["tenses","present","simple-routine"]. */
export function grammarPath(itemKey) {
  const slug = String(itemKey || "").replace(/^grammar:/, "");
  const [domain, branch, ...rest] = slug.split(".");
  return domain && branch && rest.length ? [domain, branch, rest.join(".")] : null;
}

/** Plan depth -> grammar practice stage. Weak/new start at "choose" (recognise first). */
export const stageForDepth = (depth) => (depth === "practice" ? "build" : depth === "brushup" ? "transform" : "choose");
