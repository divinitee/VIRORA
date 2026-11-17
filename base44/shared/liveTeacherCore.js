// Live Teacher core (AI English teacher, voice). PURE logic: no I/O, no clock
// reads unless `now` is passed, so every rule here is unit-testable
// (tools/live-teacher-tests/).
//
// What lives here:
//   - the mistake tracker: new vs repeated vs relapse (was mastered), and the
//     escalation ladder (patient -> stricter -> playful strict -> drill)
//   - mastery: MASTERY_STREAK correct uses in a row after the last mistake
//   - level (CEFR) estimate smoothing, pronunciation + vocabulary memory
//   - the short memory summary that is injected into the teacher's prompt
//
// The MODEL decides *what* the mistake is (it hears the student). The SERVER
// decides *how many times* it happened and *how strict* to be, so the counts
// cannot drift or be forgotten mid-conversation. See docs/live-teacher.md.

export const MODES = ['normal', 'strict', 'exam'];
export const AGE_GROUPS = ['kid', 'teen', 'adult'];
export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Voice minutes cost real money (gpt-realtime-2 audio tokens), so every lesson
// has a hard length and every plan a daily number of lessons. These are
// BUSINESS defaults the owner can change here in one place.
export const MAX_MINUTES = { normal: 15, strict: 15, exam: 12 };
export const DAILY_SESSIONS = { free: 1, learner: 3, vip: 10 };

export const MASTERY_STREAK = 3; // correct uses in a row (after the last mistake) = mastered
export const MAX_LEVEL = 4; // escalation ladder top
const CAPS = { mistakes: 200, pronunciation: 100, vocabulary: 300, levelHistory: 10, tests: 30, progress: 60 };

// A controlled vocabulary of rules keeps the model's mistake keys consistent
// between lessons (a free-text key would drift: "third person s" vs "he go").
// `variant` (free snake_case) separates different mistakes inside one rule:
// "i_goes" and "he_dont" are both subject-verb agreement but are NOT the same
// mistake and are counted separately.
export const RULE_LABELS = {
  'grammar.subject_verb_agreement': { uz: "Ega va fe'l moslashuvi", en: 'Subject–verb agreement' },
  'grammar.verb_to_be': { uz: "To be fe'li (am/is/are)", en: 'Verb "to be"' },
  'grammar.articles': { uz: 'Artikllar (a/an/the)', en: 'Articles' },
  'grammar.plural_nouns': { uz: "Ko'plik shakli", en: 'Plural nouns' },
  'grammar.present_simple': { uz: 'Present Simple', en: 'Present Simple' },
  'grammar.present_continuous': { uz: 'Present Continuous', en: 'Present Continuous' },
  'grammar.past_simple': { uz: 'Past Simple', en: 'Past Simple' },
  'grammar.present_perfect': { uz: 'Present Perfect', en: 'Present Perfect' },
  'grammar.future_forms': { uz: 'Kelasi zamon', en: 'Future forms' },
  'grammar.modal_verbs': { uz: "Modal fe'llar", en: 'Modal verbs' },
  'grammar.conditionals': { uz: 'Shart gaplar', en: 'Conditionals' },
  'grammar.passive_voice': { uz: "Majhul nisbat", en: 'Passive voice' },
  'grammar.word_order': { uz: "So'z tartibi", en: 'Word order' },
  'grammar.question_formation': { uz: "Savol tuzish", en: 'Question formation' },
  'grammar.negation': { uz: 'Inkor gaplar', en: 'Negation' },
  'grammar.prepositions': { uz: "Predloglar", en: 'Prepositions' },
  'grammar.pronouns': { uz: 'Olmoshlar', en: 'Pronouns' },
  'grammar.countable_uncountable': { uz: "Sanaladigan / sanalmaydigan otlar", en: 'Countable / uncountable' },
  'grammar.comparatives': { uz: 'Qiyosiy darajalar', en: 'Comparatives and superlatives' },
  'grammar.gerund_infinitive': { uz: 'Gerund va infinitiv', en: 'Gerund vs infinitive' },
  'grammar.relative_clauses': { uz: 'Aniqlovchi gaplar', en: 'Relative clauses' },
  'grammar.reported_speech': { uz: "O'zlashtirma gap", en: 'Reported speech' },
  'vocabulary.word_choice': { uz: "So'z tanlash", en: 'Word choice' },
  'vocabulary.false_friend': { uz: "Aldamchi do'st so'zlar", en: 'False friends' },
  'vocabulary.collocation': { uz: "So'z birikmalari", en: 'Collocations' },
  'writing.spelling': { uz: "Imlo", en: 'Spelling' },
  'writing.punctuation': { uz: 'Tinish belgilari', en: 'Punctuation' },
  'language.used_uzbek_instead_of_english': { uz: "Inglizcha o'rniga o'zbekcha gapirish", en: 'Used Uzbek instead of English' },
  'other.general': { uz: 'Boshqa xato', en: 'Other' },
};
export const RULES = Object.keys(RULE_LABELS);

// ---------- small helpers ----------
export const clean = (v, max = 200) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
export const slug = (v, max = 40) =>
  clean(v, 80).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, max);
// "I goes to school!" and "i goes to school" are the same wrong sentence.
const sentenceKey = (s) => clean(s, 200).toLowerCase().replace(/[^a-z0-9' ]+/g, '').replace(/\s+/g, ' ').trim();
const iso = (now) => new Date(now).toISOString();
const clone = (o) => structuredClone(o);

export const cleanMode = (m) => (MODES.includes(m) ? m : 'normal');
export const cleanAge = (a) => (AGE_GROUPS.includes(a) ? a : 'teen');
export const cleanCefr = (c) => {
  const v = String(c || '').toUpperCase().trim();
  return CEFR_LEVELS.includes(v) ? v : null;
};

export function emptyProfile(email) {
  return {
    user_email: email,
    cefr_level: '',
    level_history: [],
    mode: 'normal',
    age_group: 'teen',
    mistakes: {},
    pronunciation: {},
    vocabulary: {},
    test_results: [],
    progress: [],
    lesson_count: 0,
    last_lesson_at: '',
    last_lesson_summary: '',
    last_focus: [],
  };
}

/** A row from the database may lack newer fields; make it safe to work on. */
export function normalizeProfile(row) {
  const base = emptyProfile(row?.user_email || '');
  const p = { ...base, ...(row || {}) };
  for (const k of ['mistakes', 'pronunciation', 'vocabulary']) if (!p[k] || typeof p[k] !== 'object' || Array.isArray(p[k])) p[k] = {};
  for (const k of ['level_history', 'test_results', 'progress', 'last_focus']) if (!Array.isArray(p[k])) p[k] = [];
  p.lesson_count = Number(p.lesson_count) || 0;
  return p;
}

export function mistakeStats(profile) {
  let active = 0;
  let mastered = 0;
  for (const m of Object.values(profile.mistakes || {})) (m.status === 'mastered' ? mastered++ : active++);
  return { active, mastered };
}

function evict(map, max, score) {
  const keys = Object.keys(map);
  if (keys.length <= max) return;
  keys.sort((a, b) => score(map[a]) - score(map[b]));
  for (const k of keys.slice(0, keys.length - max)) delete map[k];
}

// ---------- mistake tracker ----------
// The key is a field NAME inside the stored `mistakes` object, so it must not
// contain '.' (document databases treat dots in field names as paths). The
// readable rule id (with its dot) is kept as a VALUE in the record.
export function mistakeKey(rule, variant) {
  const r = RULES.includes(rule) ? rule : 'other.general';
  return `${r.replace(/\./g, '_')}__${slug(variant) || 'general'}`;
}

/** Find an existing record for this report: same key, or same rule + same wrong sentence. */
export function findMistakeKey(profile, rule, variant, wrong) {
  const key = mistakeKey(rule, variant);
  if (profile.mistakes[key]) return key;
  const r = RULES.includes(rule) ? rule : 'other.general';
  const w = sentenceKey(wrong);
  if (!w) return null;
  for (const [k, m] of Object.entries(profile.mistakes)) {
    if (m.rule === r && sentenceKey(m.wrong_example) === w) return k;
  }
  return null;
}

const SARCASM_OK = { adult: true, teen: true, kid: false };

// Tone ladder per mode. Level 1 is always patient (first mistake: explain
// calmly). Exam mode never teaches during the exam.
const LADDER = {
  normal: ['patient', 'patient_firm', 'encouraging_drill', 'encouraging_drill'],
  strict: ['patient', 'stricter', 'playful_strict', 'playful_strict_drill'],
  exam: ['examiner', 'examiner', 'examiner', 'examiner'],
};

function directive({ mode, age, level, status, rec, prevExplanation }) {
  if (mode === 'exam') {
    return 'EXAM MODE: do NOT correct, hint, repeat the right answer, or react to the error in any way. Stay neutral and move to the next question. The mistake is recorded for the final report.';
  }
  const relapse = status === 'relapse'
    ? 'RELAPSE: the student had already MASTERED this rule, so this is a step backwards. Say so (surprised, fair, not cruel) and restate the rule in one sentence. '
    : '';
  const earlier = prevExplanation ? ` Earlier explanation (Uzbek) you gave: "${prevExplanation}".` : '';
  const total = rec.total_count;
  if (level <= 1) {
    return `NEW mistake. Be patient. Say the correct sentence ("${rec.correct_example || '...'}"), then explain the rule in simple Uzbek in 2-3 sentences. Ask the student to say the correct sentence once.`;
  }
  if (level === 2) {
    const strict = mode === 'strict' && age !== 'kid';
    return `${relapse}REPEATED mistake (${total} times in total). ${strict ? 'Use a clearly stricter tone: openly say you already explained this.' : 'Stay friendly but firmer: remind the student you already covered this.'}${earlier} Give the correct sentence ("${rec.correct_example || '...'}") and make the student repeat it correctly right now. No sarcasm yet.`;
  }
  if (level === 3) {
    if (mode === 'normal') {
      return `${relapse}STILL repeating this (${total} times in total). Stay warm, NO sarcasm. Ask the student to repeat the correct sentence ("${rec.correct_example || '...'}") slowly, then give ONE short extra exercise (two gap-fill sentences with the same rule) and wait for the answers.${earlier}`;
    }
    const humor = SARCASM_OK[age]
      ? `Use playful strict expressions and light humorous sarcasm aimed at the MISTAKE, never the person (like "Yana shu xatomi? Hozirgina tushuntirdim-ku!"${age === 'teen' ? ' - keep it light, teen student' : ''}).`
      : 'The student is a child: be playfully insistent and encouraging, with NO sarcasm.';
    return `${relapse}THIRD time or more (${total} in total). ${humor} Demand that the student repeat the correct sentence out loud ("${rec.correct_example || '...'}"), then give an extra exercise: three quick sentences to fix. Wait for the answers.${earlier}`;
  }
  const drama = SARCASM_OK[age] && mode === 'strict'
    ? 'Dramatic, friendly mock-despair is allowed (never insulting).'
    : 'Stay kind and encouraging.';
  return `${relapse}FOURTH time or more (${total} in total). ${drama} Pause the lesson flow: the student repeats "${rec.correct_example || 'the correct sentence'}" three times slowly, then does a mini-drill of three NEW sentences with the same rule. Continue the lesson only after they get one right.${earlier}`;
}

/**
 * Record one mistake the model heard. Returns { profile, result }.
 * result.status: 'new' | 'repeated' | 'relapse' (was mastered, came back).
 */
export function applyMistake(profile, report, { lessonId = '', mode = 'strict', ageGroup = 'adult', now = Date.now() } = {}) {
  const p = clone(profile);
  const rule = RULES.includes(report?.rule) ? report.rule : 'other.general';
  const variant = slug(report?.variant) || 'general';
  const wrong = clean(report?.wrong, 200);
  const correct = clean(report?.correct, 200);
  const explanation = clean(report?.explanation_uz, 300);
  const m = cleanMode(mode);
  const age = cleanAge(ageGroup);

  const foundKey = findMistakeKey(p, rule, variant, wrong);
  const key = foundKey || mistakeKey(rule, variant);
  const prev = foundKey ? p.mistakes[foundKey] : null;

  let status = 'new';
  let level = 1;
  if (prev) {
    status = prev.status === 'mastered' ? 'relapse' : 'repeated';
    // Inside one lesson the ladder climbs one step per repeat. A mistake that
    // carries over from an earlier lesson starts at level 2: it is already a
    // repeated mistake the moment it reappears.
    level = prev.last_lesson_id && prev.last_lesson_id === lessonId
      ? Math.min(MAX_LEVEL, (prev.last_level || 1) + 1)
      : 2;
  }

  const stamp = iso(now);
  const rec = {
    key,
    rule,
    variant,
    wrong_example: wrong || prev?.wrong_example || '',
    correct_example: correct || prev?.correct_example || '',
    // keep the FIRST explanation: it is what the student already heard
    explanation_uz: prev?.explanation_uz || explanation,
    total_count: (prev?.total_count || 0) + 1,
    status: 'active',
    correct_streak: 0,
    first_seen: prev?.first_seen || stamp,
    last_seen: stamp,
    last_lesson_id: lessonId,
    last_level: level,
    relapses: (prev?.relapses || 0) + (status === 'relapse' ? 1 : 0),
    mastered_at: '',
  };
  p.mistakes[key] = rec;
  evict(p.mistakes, CAPS.mistakes, (x) => (x.status === 'mastered' ? 0 : 1e15) + Date.parse(x.last_seen || 0));

  const ladderTone = LADDER[m][level - 1];
  // Children never get sarcasm: the strict rungs become gentle ones.
  const tone = !SARCASM_OK[age] ? ladderTone.replace('playful_strict', 'playful_gentle') : ladderTone;
  const result = {
    ok: true,
    status,
    key,
    level,
    tone,
    total_count: rec.total_count,
    previous_explanation_uz: prev?.explanation_uz || '',
    needs_drill: m !== 'exam' && level >= 3,
    directive: directive({ mode: m, age, level, status, rec, prevExplanation: prev?.explanation_uz || '' }),
    ...mistakeStats(p),
  };
  return { profile: p, result };
}

/** The student used a previously-mistaken pattern correctly. */
export function applyCorrectUse(profile, report, { mode = 'strict', now = Date.now() } = {}) {
  const p = clone(profile);
  const key = findMistakeKey(p, report?.rule, report?.variant, '');
  const rec = key ? p.mistakes[key] : null;
  if (!rec) return { profile: p, result: { ok: true, status: 'untracked', directive: 'Nothing to update. Continue.' } };
  if (rec.status === 'mastered') return { profile: p, result: { ok: true, status: 'already_mastered', key, directive: 'Already mastered. Continue.' } };
  const quiet = mode === 'exam';
  rec.correct_streak = (rec.correct_streak || 0) + 1;
  rec.last_seen = iso(now);
  if (rec.correct_streak >= MASTERY_STREAK) {
    rec.status = 'mastered';
    rec.mastered_at = iso(now);
    return {
      profile: p,
      result: {
        ok: true, status: 'mastered', key, correct_streak: rec.correct_streak, ...mistakeStats(p),
        directive: quiet ? 'Exam: no feedback. Continue.' : 'The student has now MASTERED this rule (several correct uses in a row). Say so briefly and genuinely, then move on.',
      },
    };
  }
  return {
    profile: p,
    result: {
      ok: true, status: 'improving', key, correct_streak: rec.correct_streak,
      remaining: MASTERY_STREAK - rec.correct_streak,
      directive: quiet ? 'Exam: no feedback. Continue.' : 'Correct this time. Acknowledge it in a few words (no gushing) and keep going.',
    },
  };
}

// ---------- level, pronunciation, vocabulary ----------
export function applyLevelEstimate(profile, report, { now = Date.now() } = {}) {
  const p = clone(profile);
  const cefr = cleanCefr(report?.cefr);
  if (!cefr) return { profile: p, result: { ok: false, error: 'invalid_cefr' } };
  const confidence = Math.max(0, Math.min(1, Number(report?.confidence) || 0.5));
  p.level_history.push({ cefr, confidence, at: iso(now) });
  p.level_history = p.level_history.slice(-CAPS.levelHistory);
  // Smooth: the most common of the last 5 estimates; a tie goes to the newest.
  const recent = p.level_history.slice(-5);
  const counts = {};
  for (const e of recent) counts[e.cefr] = (counts[e.cefr] || 0) + 1;
  const top = Math.max(...Object.values(counts));
  const winner = [...recent].reverse().find((e) => counts[e.cefr] === top).cefr;
  p.cefr_level = winner;
  return { profile: p, result: { ok: true, cefr_level: winner, estimates: p.level_history.length, directive: 'Level noted. Pitch the next task one step above the student\'s comfort zone.' } };
}

export function applyPronunciation(profile, report, { now = Date.now() } = {}) {
  const p = clone(profile);
  const word = clean(report?.word, 40).toLowerCase().replace(/[^a-z' -]/g, '');
  if (!word) return { profile: p, result: { ok: false, error: 'invalid_word' } };
  const prev = p.pronunciation[word];
  const rec = {
    word,
    issue: clean(report?.issue, 160) || prev?.issue || '',
    tip_uz: clean(report?.tip_uz, 200) || prev?.tip_uz || '',
    count: (prev?.count || 0) + 1,
    first_seen: prev?.first_seen || iso(now),
    last_seen: iso(now),
  };
  p.pronunciation[word] = rec;
  evict(p.pronunciation, CAPS.pronunciation, (x) => Date.parse(x.last_seen || 0));
  return {
    profile: p,
    result: {
      ok: true, status: prev ? 'repeated' : 'new', count: rec.count,
      directive: prev
        ? `Pronunciation problem with "${word}" again (${rec.count} times). Model it slowly syllable by syllable and have the student repeat it three times.`
        : `Model "${word}" slowly and clearly, say what to change in the mouth (in Uzbek, one sentence), and ask for one repeat.`,
    },
  };
}

export function applyVocabulary(profile, report, { now = Date.now() } = {}) {
  const p = clone(profile);
  const word = clean(report?.word, 40).toLowerCase().replace(/[^a-z' -]/g, '');
  const outcome = ['learned', 'struggled', 'used_well'].includes(report?.outcome) ? report.outcome : null;
  if (!word || !outcome) return { profile: p, result: { ok: false, error: 'invalid_vocabulary' } };
  const prev = p.vocabulary[word] || { word, meaning_uz: '', seen: 0, struggles: 0, good_uses: 0, learned: false };
  const rec = { ...prev, word, seen: prev.seen + 1, last_seen: iso(now) };
  const meaning = clean(report?.meaning_uz, 80);
  if (meaning) rec.meaning_uz = meaning;
  if (outcome === 'struggled') { rec.struggles += 1; rec.learned = false; rec.good_uses = 0; }
  if (outcome === 'used_well') { rec.good_uses += 1; if (rec.good_uses >= 2) rec.learned = true; }
  if (outcome === 'learned') { rec.learned = true; rec.good_uses = Math.max(rec.good_uses, 1); }
  p.vocabulary[word] = rec;
  evict(p.vocabulary, CAPS.vocabulary, (x) => Date.parse(x.last_seen || 0));
  return { profile: p, result: { ok: true, status: rec.learned ? 'learned' : 'learning', directive: 'Noted. Continue.' } };
}

// ---------- end of lesson ----------
const score = (v) => (Number.isFinite(Number(v)) ? Math.max(0, Math.min(100, Math.round(Number(v)))) : null);

export function finishLesson(profile, { mode = 'strict', summary = '', focusNext = [], scores = null, now = Date.now() } = {}) {
  const p = clone(profile);
  p.lesson_count += 1;
  p.last_lesson_at = iso(now);
  p.last_lesson_summary = clean(summary, 400);
  p.last_focus = (Array.isArray(focusNext) ? focusNext : []).map((f) => clean(f, 80)).filter(Boolean).slice(0, 5);
  const st = mistakeStats(p);
  p.progress.push({ at: iso(now), cefr: p.cefr_level || '', active: st.active, mastered: st.mastered });
  p.progress = p.progress.slice(-CAPS.progress);
  if (mode === 'exam' && scores) {
    const s = {
      grammar: score(scores.grammar), vocabulary: score(scores.vocabulary),
      fluency: score(scores.fluency), pronunciation: score(scores.pronunciation),
    };
    if (Object.values(s).some((v) => v != null)) {
      p.test_results.push({ at: iso(now), cefr: cleanCefr(scores.cefr) || p.cefr_level || '', ...s });
      p.test_results = p.test_results.slice(-CAPS.tests);
    }
  }
  return p;
}

// ---------- what the teacher "remembers" (goes into the prompt) ----------
export function memorySummary(profile, { now = Date.now() } = {}) {
  const p = normalizeProfile(profile);
  if (!p.lesson_count && !Object.keys(p.mistakes).length) {
    return 'FIRST LESSON: you know nothing about this student yet. Start with easy questions and estimate their level.';
  }
  const lines = [];
  lines.push(`Level estimate: ${p.cefr_level || 'unknown'}. Lessons so far: ${p.lesson_count}.`);
  if (p.last_lesson_at) {
    const days = Math.max(0, Math.round((now - Date.parse(p.last_lesson_at)) / 86400000));
    lines.push(`Last lesson: ${days === 0 ? 'today' : `${days} day(s) ago`}${p.last_lesson_summary ? ` - ${p.last_lesson_summary}` : ''}`);
  }
  if (p.last_focus.length) lines.push(`Planned focus for this lesson: ${p.last_focus.join('; ')}.`);

  const active = Object.values(p.mistakes)
    .filter((m) => m.status !== 'mastered')
    .sort((a, b) => b.total_count - a.total_count || Date.parse(b.last_seen) - Date.parse(a.last_seen))
    .slice(0, 8);
  if (active.length) {
    lines.push('ACTIVE MISTAKES (when the student repeats one, call log_mistake with the EXACT same rule and variant):');
    for (const m of active) {
      lines.push(`- rule=${m.rule} variant=${m.variant} | seen ${m.total_count}x | wrong: "${m.wrong_example}" -> right: "${m.correct_example}"`);
    }
  }
  const mastered = Object.values(p.mistakes).filter((m) => m.status === 'mastered');
  if (mastered.length) {
    lines.push(`Mastered before (a mistake on these is a relapse): ${mastered.slice(0, 8).map((m) => `${m.rule}:${m.variant}`).join(', ')}.`);
  }
  const pron = Object.values(p.pronunciation).sort((a, b) => b.count - a.count).slice(0, 5);
  if (pron.length) lines.push(`Pronunciation difficulties: ${pron.map((x) => `${x.word} (${x.issue || 'unclear'})`).join('; ')}.`);
  const vocab = Object.values(p.vocabulary).filter((v) => !v.learned && v.struggles > 0).slice(0, 6);
  if (vocab.length) lines.push(`Words the student struggles with: ${vocab.map((v) => v.word).join(', ')}.`);
  const lastTest = p.test_results[p.test_results.length - 1];
  if (lastTest) lines.push(`Last exam: grammar ${lastTest.grammar ?? '-'}, vocabulary ${lastTest.vocabulary ?? '-'}, fluency ${lastTest.fluency ?? '-'}, pronunciation ${lastTest.pronunciation ?? '-'}.`);
  return lines.join('\n');
}

// ---------- what the browser may see ----------
export function publicProfileView(profile) {
  const p = normalizeProfile(profile);
  const mistakes = Object.values(p.mistakes)
    .sort((a, b) => Date.parse(b.last_seen) - Date.parse(a.last_seen))
    .slice(0, 40)
    .map((m) => ({
      key: m.key, rule: m.rule, variant: m.variant,
      label: RULE_LABELS[m.rule] || RULE_LABELS['other.general'],
      wrong: m.wrong_example, correct: m.correct_example, explanation_uz: m.explanation_uz,
      count: m.total_count, status: m.status, streak: m.correct_streak, last_seen: m.last_seen,
    }));
  return {
    cefr_level: p.cefr_level || '',
    lesson_count: p.lesson_count,
    last_lesson_at: p.last_lesson_at,
    last_lesson_summary: p.last_lesson_summary,
    last_focus: p.last_focus,
    mode: p.mode,
    age_group: p.age_group,
    ...mistakeStats(p),
    mistakes,
    pronunciation: Object.values(p.pronunciation).sort((a, b) => b.count - a.count).slice(0, 20),
    vocabulary_learned: Object.values(p.vocabulary).filter((v) => v.learned).length,
    vocabulary_struggling: Object.values(p.vocabulary).filter((v) => !v.learned && v.struggles > 0).map((v) => v.word).slice(0, 20),
    test_results: p.test_results.slice(-5),
    progress: p.progress.slice(-20),
  };
}
