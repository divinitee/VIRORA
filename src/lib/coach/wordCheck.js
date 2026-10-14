// Pure helpers for the Coach word check (VT-40). Questions use the existing
// "quiz" evidence contract, so the SERVER grades every answer
// (progressCore.gradeTranslation):
//   multiple_choice  "meaning"     English shown -> pick the native translation
//   translation      "recall"      native shown -> pick the English word
//   definition       "definition"  English definition shown -> pick the word
//   context          "context"     example sentence with a gap -> pick the word
//   spelling         "spelling"    native shown -> TYPE the English word
// 2026-10-14 (Tee: "bump the whole skill, not only translate"): a word check
// now trains meaning, recall, definition, use in context and spelling.

/** Question kinds per plan depth. Lengths must equal coachPlan WORD_DEPTHS.questions (tested). */
export const WORD_PLANS = {
  probe: ["meaning", "definition", "context"],
  brushup: ["context", "spelling", "recall"],
  practice: ["meaning", "definition", "context", "spelling"],
  remediation: ["meaning", "recall", "definition", "context", "spelling"],
};
export const WORD_QUESTIONS = Object.fromEntries(Object.entries(WORD_PLANS).map(([d, k]) => [d, k.length]));
const TYPE_OF = { meaning: "multiple_choice", recall: "translation", definition: "definition", context: "context", spelling: "spelling" };
// When a kind has no usable content for this word, try these instead (in order).
const FALLBACK = { definition: ["context", "recall", "meaning"], context: ["definition", "recall", "meaning"], spelling: ["recall", "meaning"], meaning: ["recall"], recall: ["meaning"] };

export const nativeKeyFor = (lang) => (lang === "ru" ? "russian" : "uzbek");

function shuffle(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const clean = (s) => String(s || "").trim();
/** Letters only, lower-case: the same comparison as the server's gradeSpelling. */
export const spellKey = (s) => String(s || "").replace(/[^a-zA-Z]/g, "").toLowerCase();

/** A level-appropriate English definition that doesn't contain the word itself (or a form of it). */
export function definitionFor(word) {
  const en = clean(word?.english);
  if (!en) return "";
  const order = { A1: ["def_a2", "english_definition", "def_b1"], A2: ["def_a2", "english_definition", "def_b1"], B1: ["def_b1", "english_definition", "def_a2", "def_b2"], B2: ["def_b2", "def_b1", "english_definition"], C1: ["def_c1", "def_b2", "english_definition"] }[word.cefr] || ["english_definition", "def_a2", "def_b1", "def_b2", "def_c1"];
  const gives = new RegExp(`\\b${esc(en)}`, "i");
  for (const f of order) { const d = clean(word[f]); if (d && !gives.test(d)) return d; }
  return "";
}

/** The example sentence with the headword blanked; "" when the exact word isn't in it. */
export function contextFor(word) {
  const en = clean(word?.english), ex = clean(word?.example_en);
  if (!en || !ex) return "";
  const re = new RegExp(`\\b${esc(en)}\\b`, "i");
  if (!re.test(ex)) return "";
  const gap = ex.replace(re, "_____");
  return re.test(gap) ? "" : gap; // the word twice: one gap would still show the answer
}

/** "carbon footprint" -> "c_____ f________" (first letters + length). "" when not typeable. */
export function spellingHint(english) {
  const en = clean(english);
  if (!/^[A-Za-z][A-Za-z' -]*$/.test(en) || spellKey(en).length < 2 || spellKey(en).length > 24) return "";
  return en.replace(/[A-Za-z]+/g, (w) => w[0] + "_".repeat(w.length - 1));
}

/** Short refresher shown before a weak word's questions. */
export function wordCard(word, lang) {
  return { english: clean(word?.english), native: clean(word?.[nativeKeyFor(lang)]), definition: definitionFor(word), example: clean(word?.example_en) };
}

/**
 * Build the questions for one word. Distractors come from `pool` (other words),
 * never the target, never duplicates, never empty. Returns [] when the word has
 * no usable native translation or too few distractors (the item is then skipped,
 * not faked).
 */
export function buildWordQuestions(word, pool, { depth, lang, rnd = Math.random } = {}) {
  const nk = nativeKeyFor(lang);
  // Strictly the learner's language: no Uzbek fallback for Russian learners
  // (a lone Uzbek option among Russian ones would give the answer away). The
  // server only plans words that have BOTH translations (coachEngine.contentGate);
  // distractors without the learner's language are simply not used.
  const native = (w) => String(w?.[nk] || "").trim();
  if (!word?.english || !native(word)) return [];
  const plan = WORD_PLANS[depth] || WORD_PLANS.probe;
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
  const wrongScript = nk === "russian" ? /[A-Za-z]/ : /[Ѐ-ӿ]/;
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
  if (others.length < 2) return [];

  const def = definitionFor(word), ctx = contextFor(word), hint = spellingHint(word.english);
  const available = { meaning: true, recall: true, definition: !!def, context: !!ctx, spelling: !!hint };
  const used = new Set();
  const kinds = [];
  const count = (k) => kinds.filter((x) => x === k).length;
  for (const want of plan) {
    // A kind not used yet if possible; otherwise repeat meaning/recall, whichever was used less.
    const pick = [want, ...(FALLBACK[want] || [])].find((k) => available[k] && !used.has(k))
      || (count("meaning") <= count("recall") ? "meaning" : "recall");
    used.add(pick); kinds.push(pick);
  }
  const english = (picks) => shuffle([word.english, ...picks.map((w) => w.english)], rnd);
  return kinds.map((kind) => {
    const type = TYPE_OF[kind];
    if (kind === "spelling") return { type, kind, prompt: native(word), hint, correct: word.english };
    const picks = shuffle(others, rnd).slice(0, 3);
    if (kind === "meaning") return { type, kind, prompt: word.english, options: shuffle([native(word), ...picks.map(native)], rnd), correct: native(word) };
    const prompt = kind === "recall" ? native(word) : kind === "definition" ? def : ctx;
    return { type, kind, prompt, options: english(picks), correct: word.english };
  });
}

/** The evidence item the server grades itself (given = the option text chosen). */
export const isRight = (q, given) => (q.type === "spelling" ? spellKey(q.correct).length > 0 && spellKey(given) === spellKey(q.correct) : given === q.correct);
export const evidenceItem = (word, q, given) => ({ word: word.english, word_id: word.id, type: q.type, given, correct: isRight(q, given) });

/** "grammar:tenses.present.simple-routine" -> ["tenses","present","simple-routine"]. */
export function grammarPath(itemKey) {
  const slug = String(itemKey || "").replace(/^grammar:/, "");
  const [domain, branch, ...rest] = slug.split(".");
  return domain && branch && rest.length ? [domain, branch, rest.join(".")] : null;
}

/** Plan depth -> grammar practice stage. Weak/new start at "choose" (recognise first). */
export const stageForDepth = (depth) => (depth === "practice" ? "build" : depth === "brushup" ? "transform" : "choose");
