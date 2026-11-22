// masterV0 Phase 3 (2026-11-22): the lesson FOCUS picker.
//
// Before each Live Teacher lesson, score every known weakness of the student
// across VIRORA and hand the teacher ONE focus + ONE quick review item.
// Pure functions (no I/O, no clock reads): the engine fetches the rows, passes
// `now`, and this file decides. Plan doc: "masterV0: Making Vira Human", §Phase 3.
//
//   priority = frequency x spread x basics x readiness x due
//
// Evidence sources (all already in VIRORA):
//   speaking  LiveTeacherProfile.mistakes            (rule + variant, counts, streaks)
//   practice  LearnerItem (item_type grammar)         (Coach Engine: accuracy, rounds, FSRS due)
//   written   AssessmentResult                        (AI-graded answers: subskill text, score 0-5)
//   words     LearnerWordState (weakness_score)       (review item only)
// Each source names topics differently, so everything is mapped to a FAMILY below.

const DAY = 86400000;
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const lvIndex = (l) => { const i = LEVELS.indexOf(String(l || '').toUpperCase()); return i < 0 ? 1 : i; }; // unknown -> A2

// family -> label, the level by which it should be solid, and how each source names it.
// taxonomy: prefixes of Coach Engine grammar keys ("grammar:<prefix>..."), longest match wins.
// text: regex on AssessmentResult.subskill.
export const FAMILIES = {
  verb_to_be: { en: 'The verb "to be" (am / is / are)', uz: "To be fe'li (am/is/are)", ru: 'Глагол to be (am/is/are)', level: 'A1', rules: ['grammar.verb_to_be'], taxonomy: [], text: /\bto be\b|\bam\s*\/\s*is\b/i },
  present_simple: { en: 'Present Simple', uz: 'Present Simple', ru: 'Present Simple', level: 'A1', rules: ['grammar.present_simple'], taxonomy: ['tenses.present.simple', 'negation.negation.dont-doesnt', 'negation.yes-no.do-does'], text: /present simple/i },
  subject_verb_agreement: { en: 'He / she / it + -s (agreement)', uz: "Ega va fe'l moslashuvi (he/she + -s)", ru: 'Согласование (he/she + -s)', level: 'A1', rules: ['grammar.subject_verb_agreement'], taxonomy: ['articles.plurals-agreement.there-agreement', 'articles.plurals-agreement.each-every', 'pronouns.indefinite.indefinite-agreement'], text: /agreement/i },
  present_continuous: { en: 'Present Continuous', uz: 'Present Continuous', ru: 'Present Continuous', level: 'A1', rules: ['grammar.present_continuous'], taxonomy: ['tenses.present.continuous'], text: /present (continuous|progressive)/i },
  plural_nouns: { en: 'Plural nouns', uz: "Ko'plik shakli", ru: 'Множественное число', level: 'A1', rules: ['grammar.plural_nouns'], taxonomy: ['articles.plurals-agreement.es-plural', 'articles.plurals-agreement.irregular-plural', 'articles.plurals-agreement.y-ies'], text: /plural/i },
  pronouns: { en: 'Pronouns (I / me / my)', uz: 'Olmoshlar (I / me / my)', ru: 'Местоимения (I / me / my)', level: 'A1', rules: ['grammar.pronouns'], taxonomy: ['pronouns.'], text: /pronoun/i },
  question_formation: { en: 'Making questions', uz: 'Savol tuzish', ru: 'Построение вопросов', level: 'A1', rules: ['grammar.question_formation'], taxonomy: ['negation.yes-no', 'negation.wh-questions', 'negation.subject-questions', 'negation.tag-questions', 'negation.indirect-questions'], text: /question/i },
  negation: { en: 'Negatives (don\'t / isn\'t / didn\'t)', uz: "Inkor gaplar (don't / isn't)", ru: "Отрицание (don't / isn't)", level: 'A1', rules: ['grammar.negation'], taxonomy: ['negation.negation'], text: /negati/i },
  articles: { en: 'Articles (a / an / the)', uz: 'Artikllar (a/an/the)', ru: 'Артикли (a/an/the)', level: 'A2', rules: ['grammar.articles'], taxonomy: ['articles.articles'], text: /article/i },
  past_simple: { en: 'Past Simple', uz: 'Past Simple', ru: 'Past Simple', level: 'A2', rules: ['grammar.past_simple'], taxonomy: ['tenses.past.irregular', 'tenses.past.simple', 'tenses.past.regular', 'negation.yes-no.past-did', 'negation.wh-questions.past-wh'], text: /past simple/i },
  future_forms: { en: 'Future (will / going to)', uz: 'Kelasi zamon (will / going to)', ru: 'Будущее время (will / going to)', level: 'A2', rules: ['grammar.future_forms'], taxonomy: ['tenses.future'], text: /future|going to|\bwill\b/i },
  countable_uncountable: { en: 'Countable / uncountable (much / many)', uz: 'Sanaladigan / sanalmaydigan (much / many)', ru: 'Исчисляемые / неисчисляемые (much / many)', level: 'A2', rules: ['grammar.countable_uncountable'], taxonomy: ['articles.countability', 'articles.quantifiers'], text: /countab|quantif|much|many/i },
  comparatives: { en: 'Comparatives (bigger / more)', uz: 'Qiyosiy daraja (bigger / more)', ru: 'Сравнения (bigger / more)', level: 'A2', rules: ['grammar.comparatives'], taxonomy: ['comparison.'], text: /compar|superlat/i },
  prepositions: { en: 'Prepositions (in / on / at)', uz: 'Predloglar (in / on / at)', ru: 'Предлоги (in / on / at)', level: 'A2', rules: ['grammar.prepositions'], taxonomy: ['prepositions.'], text: /preposition/i },
  modal_verbs: { en: 'Modal verbs (can / should / must)', uz: "Modal fe'llar (can / should / must)", ru: 'Модальные глаголы (can / should / must)', level: 'A2', rules: ['grammar.modal_verbs'], taxonomy: ['modals.'], text: /modal|\bcan\b|should|must/i },
  word_order: { en: 'Word order', uz: "So'z tartibi", ru: 'Порядок слов', level: 'A2', rules: ['grammar.word_order'], taxonomy: ['word-order', 'negation.indirect-questions.embedded-order'], text: /word order/i },
  past_continuous: { en: 'Past Continuous', uz: 'Past Continuous', ru: 'Past Continuous', level: 'B1', rules: [], taxonomy: ['tenses.past.continuous', 'tenses.past.interrupted'], text: /past (continuous|progressive)/i },
  present_perfect: { en: 'Present Perfect', uz: 'Present Perfect', ru: 'Present Perfect', level: 'B1', rules: ['grammar.present_perfect'], taxonomy: ['tenses.present-perfect', 'tenses.perfect', 'tenses.present.perfect', 'negation.wh-questions.how-long-perfect', 'tenses.past.past-perfect'], text: /perfect/i },
  gerund_infinitive: { en: 'Gerund or infinitive (like doing / want to do)', uz: 'Gerund yoki infinitiv (like doing / want to do)', ru: 'Герундий или инфинитив (like doing / want to do)', level: 'B1', rules: ['grammar.gerund_infinitive'], taxonomy: ['verb-patterns', 'verbs.patterns', 'prepositions.preposition-gerund'], text: /gerund|infinitive/i },
  relative_clauses: { en: 'Relative clauses (who / which / that)', uz: 'Aniqlovchi gaplar (who / which / that)', ru: 'Придаточные (who / which / that)', level: 'B1', rules: ['grammar.relative_clauses'], taxonomy: ['clauses.'], text: /relative/i },
  conditionals: { en: 'Conditionals (if...)', uz: 'Shart gaplar (if...)', ru: 'Условные предложения (if...)', level: 'B1', rules: ['grammar.conditionals'], taxonomy: ['conditionals.'], text: /conditional|\bif\b/i },
  passive_voice: { en: 'Passive voice', uz: 'Majhul nisbat', ru: 'Пассивный залог', level: 'B1', rules: ['grammar.passive_voice'], taxonomy: ['passive.'], text: /passive/i },
  collocations: { en: 'Natural word combinations', uz: "Tabiiy so'z birikmalari", ru: 'Естественные словосочетания', level: 'B1', rules: ['vocabulary.collocation'], taxonomy: [], text: /collocation/i },
  word_choice: { en: 'Choosing the right word', uz: "To'g'ri so'z tanlash", ru: 'Выбор правильного слова', level: 'B1', rules: ['vocabulary.word_choice', 'vocabulary.false_friend'], taxonomy: [], text: /word choice|vocabulary/i },
  reported_speech: { en: 'Reported speech', uz: "O'zlashtirma gap", ru: 'Косвенная речь', level: 'B2', rules: ['grammar.reported_speech'], taxonomy: ['questions.reported', 'reported.'], text: /reported/i },
};
export const FAMILY_KEYS = Object.keys(FAMILIES);

const RULE_TO_FAMILY = Object.fromEntries(FAMILY_KEYS.flatMap((k) => FAMILIES[k].rules.map((r) => [r, k])));
const TAX = FAMILY_KEYS.flatMap((k) => FAMILIES[k].taxonomy.map((p) => [p, k])).sort((a, b) => b[0].length - a[0].length);

export const familyOfRule = (rule) => RULE_TO_FAMILY[rule] || null;
export function familyOfTopic(itemKey) {
  const t = String(itemKey || '').replace(/^grammar:/, '');
  const hit = TAX.find(([p]) => t.startsWith(p));
  return hit ? hit[1] : null;
}
export const familiesOfText = (text) => FAMILY_KEYS.filter((k) => FAMILIES[k].text && FAMILIES[k].text.test(String(text || '')));

const recency = (iso, now) => {
  const t = Date.parse(iso || '');
  if (!Number.isFinite(t)) return 0.3;
  const days = Math.max(0, (now - t) / DAY);
  return days > 60 ? 0 : Math.exp(-days / 14); // half-life ~10 days, nothing older than 2 months
};

/**
 * Collect per-family evidence from the raw rows.
 * @returns {Record<string, {wrong:number, right:number, sources:Set<string>, examples:Array, due:boolean}>}
 */
export function collectEvidence({ profile = null, learnerItems = [], assessments = [], now }) {
  const ev = {};
  const get = (k) => (ev[k] ||= { wrong: 0, right: 0, sources: new Set(), examples: [], due: false });
  // speaking (Live Teacher tracker)
  for (const m of Object.values(profile?.mistakes || {})) {
    const k = familyOfRule(m?.rule);
    if (!k) continue;
    const w = recency(m.last_seen, now);
    const e = get(k);
    if (m.status === 'mastered') { e.right += 2 * w; continue; }
    e.wrong += Math.max(1, Number(m.total_count) || 1) * w;
    e.right += Math.max(0, Number(m.correct_streak) || 0) * w;
    if (w > 0) e.sources.add('speaking');
    if (m.wrong_example && m.correct_example) e.examples.push({ wrong: m.wrong_example, correct: m.correct_example, at: m.last_seen || '' });
  }
  // grammar practice (Coach Engine LearnerItem)
  for (const it of learnerItems || []) {
    if (it?.item_type && it.item_type !== 'grammar') continue;
    const k = familyOfTopic(it?.item_key);
    if (!k) continue;
    const w = recency(it.last_evidence_at, now);
    const rounds = Math.max(1, Number(it.rounds) || 1);
    const acc = Math.max(0, Math.min(1, Number(it.weighted_accuracy)));
    const e = get(k);
    const wrong = rounds * (1 - (Number.isFinite(acc) ? acc : 0.5)) * w;
    e.wrong += wrong;
    e.right += rounds * (Number.isFinite(acc) ? acc : 0.5) * w;
    if (wrong > 0.05) e.sources.add('practice');
    if (Date.parse(it.due || '') <= now) e.due = true;
  }
  // written answers graded by the AI (score 0-5)
  for (const a of assessments || []) {
    const fams = familiesOfText(a?.subskill);
    if (!fams.length) continue;
    const w = recency(a.created_date, now);
    const s = Number(a.score);
    for (const k of fams) {
      const e = get(k);
      if (s <= 2) { e.wrong += w; e.sources.add('writing'); } else if (s >= 4) e.right += w;
    }
  }
  for (const e of Object.values(ev)) e.examples.sort((x, y) => String(y.at).localeCompare(String(x.at)));
  return ev;
}

/** Score one family. Exported for tests and for tuning. */
export function scoreFamily(key, e, { level, recentFocus = [] }) {
  const F = FAMILIES[key];
  const frequency = e.wrong;
  if (frequency < 0.25) return { score: 0, parts: { frequency } };
  const spread = Math.max(1, Math.min(3, e.sources.size));
  const gap = lvIndex(F.level) - lvIndex(level); // <0: should already be solid
  const basics = gap < 0 ? 1.5 : gap === 0 ? 1.2 : gap === 1 ? 0.8 : 0.4;
  const n = e.wrong + e.right;
  const acc = n > 0 ? e.right / n : null;
  const readiness = n < 2 || acc === null ? 0.8 : acc < 0.3 ? 0.6 : acc <= 0.8 ? 1.0 : 0.35;
  const spaced = recentFocus.includes(key) ? 0.4 : e.due ? 1.2 : 1;
  const score = frequency * spread * basics * readiness * spaced;
  return { score, parts: { frequency: +frequency.toFixed(2), spread, basics, readiness, due: spaced, accuracy: acc === null ? null : +acc.toFixed(2) } };
}

const SOURCE_TEXT = { speaking: 'speaking', practice: 'grammar practice', writing: 'written answers' };

/**
 * Pick today's focus + one review item.
 * @returns {null | { focus: {key,label,why,examples,score,parts}, review: string|null, runnerUp: string|null }}
 */
export function pickFocus({ profile = null, learnerItems = [], assessments = [], weakWords = [], recentFocus = [], level = '', uiLang = 'uz', now }) {
  const ev = collectEvidence({ profile, learnerItems, assessments, now });
  const ranked = Object.entries(ev)
    .map(([k, e]) => ({ key: k, e, ...scoreFamily(k, e, { level, recentFocus }) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  const lang = uiLang === 'ru' ? 'ru' : uiLang === 'en' ? 'en' : 'uz';
  // review item: an old speaking mistake from ANOTHER family, else a weak word
  const top = ranked[0] || null;
  let review = null;
  const old = Object.values(profile?.mistakes || {})
    .filter((m) => m?.status !== 'mastered' && familyOfRule(m?.rule) !== top?.key && m.wrong_example && m.correct_example)
    .sort((a, b) => String(b.last_seen || '').localeCompare(String(a.last_seen || '')))[0];
  if (old) review = `their old mistake "${old.wrong_example}" -> "${old.correct_example}"`;
  else {
    const w = (weakWords || []).find((x) => x?.lemma_key || x?.word);
    if (w) review = `the word "${w.lemma_key || w.word}" (they keep getting it wrong)`;
  }
  if (!top) return review ? { focus: null, review, runnerUp: null } : null;
  const F = FAMILIES[top.key];
  const where = [...top.e.sources].map((s) => SOURCE_TEXT[s]).join(' + ') || 'earlier lessons';
  const acc = top.parts.accuracy;
  const why = `mistakes in ${where}${acc !== null ? `, about ${Math.round(acc * 100)}% right so far` : ''}; ${F.level} level basics`;
  return {
    focus: { key: top.key, label: F.en, label_local: F[lang] || F.en, why, examples: top.e.examples.slice(0, 2), score: +top.score.toFixed(2), parts: top.parts },
    review,
    runnerUp: ranked[1] ? FAMILIES[ranked[1].key].en : null,
  };
}

/** The lines the brain sees at LESSON START. */
export function focusBrief(pick) {
  if (!pick) return '';
  const lines = [];
  if (pick.focus) {
    lines.push(`TODAY'S FOCUS (chosen from this student's real mistakes across the whole app): ${pick.focus.label} (${pick.focus.why}).`);
    for (const x of pick.focus.examples) lines.push(`- their real mistake: "${x.wrong}" -> "${x.correct}"`);
    lines.push('Use this as lesson_focus. In NOTICE, show them one of their own mistakes above and the fix.');
  }
  if (pick.review) lines.push(`WARM-UP REVIEW (one quick check, 1 minute): ${pick.review}.`);
  return lines.join('\n');
}
