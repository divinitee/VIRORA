// VT-40 Stage 5a — Coach language resolver (pure, no I/O).
//
// Decides, for ONE learner and ONE word, which language content a Coach word
// item may show. The learner's level and the app language decide; the word's
// own CEFR level never does (that was the 26 Oct bug: wordCheck.js keyed the
// definition tier and the gap-fill hint on word.cefr, and nativeKeyFor("en")
// returned "uzbek").
//
// Rules (locked by Tee, approved by GPT 26 Oct — claude/vira/COACH-LANGUAGE-TIERS-AUDIT.md):
// - A translation shows only when BOTH gates allow it:
//     1. app language is uz or ru (never en), and
//     2. learner level is A1 (as the main text) or A2 (on tap only). Never B1+.
// - Definitions follow the LEARNER: own tier -> one tier below -> english_definition.
//   A translation is never a definition fallback.
// - A Russian learner never sees Uzbek. A missing translation makes the
//   translation-based content unavailable; it is not substituted.
// - B1+ "type the word" prompts mix definition and sentence forms,
//   deterministically per session + word.

export const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

/** "b1", " B1 ", "B1+" -> "B1"; anything else -> null. */
export function normLevel(level) {
  const m = String(level || "").trim().toUpperCase().match(/^(A1|A2|B1|B2|C1)/);
  return m ? m[1] : null;
}

/** Support-language field for the app language. English has none: never "uzbek". */
export function supportKey(lang) {
  if (lang === "uz") return "uzbek";
  if (lang === "ru") return "russian";
  return null;
}

/**
 * How a translation may appear for this learner.
 *   "main" — A1 with uz/ru: the translation is the primary text.
 *   "tap"  — A2 with uz/ru: hidden by default, revealed on tap.
 *   "none" — English app language, or B1 and above.
 * Unplaced learners (no trusted level) get NO translation until a level is
 * known (GPT 5a audit: never assume a proficiency to unlock support).
 */
export function translationMode(learnerLevel, lang) {
  if (!supportKey(lang)) return "none";
  const lvl = normLevel(learnerLevel);
  if (!lvl) return "none";
  if (lvl === "A1") return "main";
  if (lvl === "A2") return "tap";
  return "none";
}

const clean = (s) => (typeof s === "string" ? s.trim() : "");
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The learner-language translation, strictly in that language ("" when missing). */
export function translationFor(word, lang) {
  const key = supportKey(lang);
  return key ? clean(word?.[key]) : "";
}

// Reader-relative tiers: A1 has no tier of its own and reads def_a2.
const OWN_TIER = { A1: "def_a2", A2: "def_a2", B1: "def_b1", B2: "def_b2", C1: "def_c1" };
// One tier below the learner (A1/A2 have none below def_a2).
const LOWER_TIER = { A1: null, A2: null, B1: "def_a2", B2: "def_b1", C1: "def_b2" };

/**
 * True when `text` contains the headword or an inflected form of it, as a whole
 * word: "weight" matches "weights"/"weighted" but "art" does not match "article".
 * Parenthesised parts of a headword are ignored ("get out (of)" -> "get out"),
 * and multiword headwords match with any whitespace between their words.
 */
export function revealsHeadword(text, headword) {
  const core = clean(String(headword || "").replace(/\([^)]*\)/g, " ")).replace(/\s+/g, " ");
  if (!core) return false;
  const body = core.split(" ").map(esc).join("\\s+");
  const re = new RegExp(`(^|[^\\p{L}])${body}(s|es|d|ed|ing|er|ers|ly)?(?=$|[^\\p{L}])`, "iu");
  return re.test(String(text || ""));
}

/**
 * The English definition for this learner, never one that reveals the
 * headword. Returns { text, source } where source is the field used, or
 * { text: "", source: null } when nothing usable exists.
 * Unplaced learners (no trusted level) read the word's own english_definition.
 */
export function definitionForLearner(word, learnerLevel) {
  const en = clean(word?.english);
  if (!en) return { text: "", source: null };
  const lvl = normLevel(learnerLevel);
  const chain = lvl ? [OWN_TIER[lvl], LOWER_TIER[lvl], "english_definition"] : ["english_definition"];
  for (const field of chain) {
    if (!field) continue;
    const text = clean(word?.[field]);
    if (text && !revealsHeadword(text, en)) return { text, source: field };
  }
  return { text: "", source: null };
}

/** 32-bit FNV-1a; stable across reloads and devices. */
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

/**
 * Which prompt a "Type the English word" item uses.
 *   A1 + uz/ru -> "translation"; A1 + en and A2 -> "definition";
 *   B1+ -> "sentence" or "definition", 50/50 by hash(session, word),
 *   falling back to "definition" when no valid alternative sentence exists.
 */
export function spellingPromptForm({ learnerLevel, lang, sessionId, wordId, sentenceOk }) {
  const mode = translationMode(learnerLevel, lang);
  if (mode === "main") return "translation";
  const lvl = normLevel(learnerLevel);
  if (!lvl || lvl === "A1" || lvl === "A2") return "definition";
  if (!sentenceOk) return "definition";
  return fnv1a(`${sessionId}|${wordId}`) % 2 === 0 ? "sentence" : "definition";
}

/** First-letter hint ("w_____") on spelling prompts: every level except C1. */
export const showsFirstLetter = (learnerLevel) => normLevel(learnerLevel) !== "C1";

/**
 * Everything a Coach word item may show for this learner and word.
 *   available: false when the word can't be shown at all (no headword, no
 *     definition, or a translation-led learner whose language is missing).
 *   translation: present only when mode !== "none".
 */
export function resolveWordContent(word, { learnerLevel, lang }) {
  const mode = translationMode(learnerLevel, lang);
  const translation = mode === "none" ? "" : translationFor(word, lang);
  const def = definitionForLearner(word, learnerLevel);
  const english = clean(word?.english);
  let available = !!english && !!def.text;
  if (mode === "main" && !translation) available = false; // A1 reads the translation; never substitute
  return {
    english,
    placed: !!normLevel(learnerLevel), // false -> caller should route to placement
    mode,
    ...(mode !== "none" && translation ? { translation } : {}),
    definition: def.text,
    definitionSource: def.source,
    available,
  };
}
