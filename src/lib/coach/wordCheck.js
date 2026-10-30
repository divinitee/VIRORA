// Pure helpers for the Coach word check (VT-40). Questions use the existing
// "quiz" evidence contract, so the SERVER grades every answer
// (progressCore.gradeTranslation):
//   multiple_choice  "meaning"     English shown -> pick the native translation
//   translation      "recall"      native shown -> pick the English word
//   definition       "definition"  English definition shown -> pick the word
//   context          "context"     example sentence with a gap -> pick the word
//   spelling         "spelling"    prompt shown -> TYPE the English word
//   definition_choice "meaning"    English word shown -> pick its English definition
// 2026-10-14 (Tee: "bump the whole skill, not only translate"): a word check
// now trains meaning, recall, definition, use in context and spelling.
// 2026-10-26 (VT-40 5c): WHAT each question shows comes from the LEARNER's level
// (frozen on the Coach session) + the app language, via base44/shared/languageGate.js:
//   A1 + uz/ru   translations (meaning = multiple_choice, recall, spelling prompt)
//   A2 + uz/ru   English definitions; the translation is only behind a tap
//   B1+, en, unplaced   English only, never a translation
// "What does it mean?" is definition_choice everywhere except A1+uz/ru, and a word
// never gets both definition_choice and "match the definition" in one session.

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

import { resolveWordContent, definitionForLearner, spellingPromptForm, showsFirstLetter, revealsHeadword, normLevel } from "./languageGate.js";

/** Kept for callers that only need the field name; English has NO native field (never "uzbek"). */
export const nativeKeyFor = (lang) => (lang === "ru" ? "russian" : lang === "uz" ? "uzbek" : null);

/** Session snapshot value ("B1", "unplaced", missing) -> resolver level (null = unplaced). */
export const levelFromSession = (v) => normLevel(v);

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

/**
 * Context-question support under the gap, by LEARNER (15 Oct audit: ambiguity was
 * concentrated in low-level gap sentences; 26 Oct: it must follow the learner, not
 * the word). "main" = shown, "tap" = behind a tap, "none" = not shown.
 * The answer is still picked by its English form, so these answers are not tagged as hinted.
 */
export const CONTEXT_MEANING_LEVELS = ["A1", "A2"];
export const contextMeaningShown = (learnerLevel, lang) => resolveWordContent({ english: "x", english_definition: "x" }, { learnerLevel, lang }).mode;

/** "carbon footprint" -> "c_____ f________" (first letters + length). "" when not typeable. */
export function spellingHint(english) {
  const en = clean(english);
  if (!/^[A-Za-z][A-Za-z' -]*$/.test(en) || spellKey(en).length < 2 || spellKey(en).length > 24) return "";
  return en.replace(/[A-Za-z]+/g, (w) => w[0] + "_".repeat(w.length - 1));
}

/**
 * A second sentence for B1+ "type the word" (sentence form): the word's
 * `description` when it contains the headword exactly once as a whole word,
 * differs from example_en (used by the context question), and blanks cleanly.
 * "" otherwise -> the definition form is used instead.
 */
export function altSentenceFor(word) {
  const en = clean(word?.english), d = clean(word?.description), ex = clean(word?.example_en);
  if (!en || !d || d.toLowerCase() === ex.toLowerCase()) return "";
  const re = new RegExp(`\\b${esc(en)}\\b`, "gi");
  if ((d.match(re) || []).length !== 1) return "";
  const gap = d.replace(re, "_____");
  return revealsHeadword(gap, en) ? "" : gap;
}

/**
 * Short refresher shown before a weak word's questions, gated like every
 * other screen: translation inline only at A1+uz/ru, behind a tap at A2+uz/ru,
 * absent at B1+, in English mode and for unplaced learners.
 */
export function wordCard(word, lang, learnerLevel = null) {
  const r = resolveWordContent(word, { learnerLevel, lang });
  return {
    english: clean(word?.english),
    ...(r.mode === "main" && r.translation ? { native: r.translation } : {}),
    ...(r.mode === "tap" && r.translation ? { tapNative: r.translation } : {}),
    definition: r.definition,
    example: clean(word?.example_en),
  };
}

/** Same-POS preference when both rows carry one (WordSense.pos; VocabularyWord has none). */
const posOf = (w) => clean(w?.pos).toLowerCase();

/**
 * Build the questions for one word. Distractors come from `pool` (other words),
 * never the target, never duplicates, never empty. Every option question has
 * EXACTLY four options or is not asked (its kind falls back, or the word is
 * skipped) — the item is then skipped, not faked.
 *
 * opts.learnerLevel   the level frozen on the Coach session (null/"unplaced" = unplaced)
 * opts.lang           app language (uz | ru | en)
 * opts.sessionId      Coach session key: makes B1+ spelling prompt forms stable on reload
 * opts.definitionChoice  false on legacy sessions without a level snapshot: the server
 *                     would reject definition_choice there, so it is never offered.
 */
export function buildWordQuestions(word, pool, { depth, lang, learnerLevel = null, sessionId = "", definitionChoice = true, rnd = Math.random } = {}) {
  const level = levelFromSession(learnerLevel);
  const res = resolveWordContent(word, { learnerLevel: level, lang });
  if (!res.available) return [];
  const mode = res.mode; // main | tap | none
  const nk = nativeKeyFor(lang);
  const native = (w) => (nk ? String(w?.[nk] || "").trim() : "");
  const plan = WORD_PLANS[depth] || WORD_PLANS.probe;

  // ---- English-word distractors (recall / definition / context): distinct headwords.
  const norm = (s) => String(s || "").toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}']+/gu, " ").trim();
  const senses = (s) => {
    const out = new Set([norm(s)]);
    for (const part of String(s || "").split(/[;,/]/)) { out.add(norm(part)); out.add(norm(part.replace(/\([^)]*\)/g, " "))); }
    out.delete("");
    return out;
  };
  const targetText = new Set([norm(word.english), ...(mode === "main" ? senses(native(word)) : [])]);
  const seenId = new Set(), seenText = new Set(targetText);
  // A row sharing a headword (or, in translation mode, a sense) with the target is a second right answer.
  for (const w of pool) {
    if (!w || w.id === word.id) continue;
    if (targetText.has(norm(w.english)) || (mode === "main" && [...senses(native(w))].some((x) => targetText.has(x)))) {
      seenText.add(norm(w.english)); if (mode === "main") senses(native(w)).forEach((x) => seenText.add(x));
    }
  }
  const wrongScript = nk === "russian" ? /[A-Za-z]/ : /[Ѐ-ӿ]/;
  const others = pool.filter((w) => {
    if (!w || w.id === word.id || seenId.has(w.id) || !w.english || seenText.has(norm(w.english))) return false;
    if (mode === "main") { // translation options: the learner's own language, own script, distinct sense
      if (!native(w) || wrongScript.test(native(w)) || [...senses(native(w))].some((x) => seenText.has(x))) return false;
      senses(native(w)).forEach((x) => seenText.add(x));
    }
    seenId.add(w.id); seenText.add(norm(w.english));
    return true;
  });
  const samePosFirst = (list) => { const p = posOf(word); return p ? [...list.filter((w) => posOf(w) === p), ...list.filter((w) => posOf(w) !== p)] : list; };
  const pick3 = (list) => samePosFirst(shuffle(list, rnd)).slice(0, 3);

  // ---- definition_choice options: three OTHER words' definitions from the SAME tier field.
  const keyDef = definitionForLearner(word, level);
  const defOthers = [];
  if (keyDef.text) {
    const seenDef = new Set([norm(keyDef.text)]);
    for (const w of shuffle(others, rnd)) {
      const d = definitionForLearner(w, level);
      if (d.source !== keyDef.source || !d.text || seenDef.has(norm(d.text)) || revealsHeadword(d.text, word.english)) continue;
      seenDef.add(norm(d.text)); defOthers.push({ w, text: d.text });
    }
  }
  const defOpts = samePosFirst(defOthers.map((x) => x.w)).slice(0, 3).map((w) => defOthers.find((x) => x.w === w).text);

  // ---- What each kind may use for THIS learner.
  const enoughWords = others.length >= 3;
  const meaningIsDefChoice = mode !== "main";
  const canMeaning = meaningIsDefChoice ? definitionChoice && defOpts.length === 3 : enoughWords && !!native(word);
  const ctx = contextFor(word), hint = showsFirstLetter(level) ? spellingHint(word.english) : "";
  const typeable = !!spellingHint(word.english);
  const alt = altSentenceFor(word);
  const form = spellingPromptForm({ learnerLevel: level, lang, sessionId, wordId: word.id, sentenceOk: !!alt });
  const spellPrompt = form === "translation" ? native(word) : form === "sentence" ? alt : res.definition;
  const available = {
    meaning: canMeaning,
    recall: mode === "main" && enoughWords && !!native(word), // translation -> word: A1 + uz/ru only
    definition: enoughWords && !!res.definition && !(meaningIsDefChoice && canMeaning), // never both with definition_choice
    context: enoughWords && !!ctx,
    spelling: typeable && !!spellPrompt,
  };
  // definition_choice and "match the definition" are mutually exclusive for a word:
  // if the plan asks for "definition" and the meaning slot is definition_choice, it falls back.
  const used = new Set();
  const kinds = [];
  for (const want of plan) {
    const pick = [want, ...(FALLBACK[want] || [])].find((k) => available[k] && !used.has(k));
    if (!pick) continue; // nothing left for this slot: fewer questions, never a repeat or a fake
    used.add(pick); kinds.push(pick);
  }
  if (!kinds.length) return [];
  const english = (picks) => shuffle([word.english, ...picks.map((w) => w.english)], rnd);
  return kinds.map((kind) => {
    if (kind === "spelling") return { type: "spelling", kind, prompt: spellPrompt, promptForm: form, hint, correct: word.english };
    if (kind === "meaning" && meaningIsDefChoice) return { type: "definition_choice", kind, prompt: word.english, options: shuffle([keyDef.text, ...defOpts], rnd), correct: keyDef.text, ...(mode === "tap" && res.translation ? { tapNative: res.translation } : {}) };
    const picks = pick3(others);
    if (kind === "meaning") return { type: "multiple_choice", kind, prompt: word.english, options: shuffle([native(word), ...picks.map(native)], rnd), correct: native(word) };
    const prompt = kind === "recall" ? native(word) : kind === "definition" ? res.definition : ctx;
    // Context support under the gap follows the LEARNER: inline at A1+uz/ru, a tap at A2+uz/ru, none otherwise.
    const support = kind === "context" && mode === "main" ? { meaning: res.translation } : kind === "context" && mode === "tap" ? { tapNative: res.translation } : {};
    return { type: TYPE_OF[kind], kind, prompt, ...support, options: english(picks), correct: word.english };
  });
}

/** The evidence item the server grades itself (given = the option text chosen). */
/**
 * A weak word (remediation) opens with a word card that shows the answers to its
 * questions (translation, definition, example). Those answers are therefore given
 * WITH A HINT (14 Oct audit): coachCore halves their evidence weight and FSRS can
 * rate them at most Good. The card and the tag come from this one rule.
 */
export const showsWordCard = (depth) => depth === "remediation";

export const isRight = (q, given) => (q.type === "spelling" ? spellKey(q.correct).length > 0 && spellKey(given) === spellKey(q.correct) : given === q.correct);
export const evidenceItem = (word, q, given, { support } = {}) => ({ word: word.english, word_id: word.id, type: q.type, given, correct: isRight(q, given), ...(support ? { support } : {}) });

/** "grammar:tenses.present.simple-routine" -> ["tenses","present","simple-routine"]. */
export function grammarPath(itemKey) {
  const slug = String(itemKey || "").replace(/^grammar:/, "");
  const [domain, branch, ...rest] = slug.split(".");
  return domain && branch && rest.length ? [domain, branch, rest.join(".")] : null;
}

/** Plan depth -> grammar practice stage. Weak/new start at "choose" (recognise first). */
export const stageForDepth = (depth) => (depth === "practice" ? "build" : depth === "brushup" ? "transform" : "choose");
