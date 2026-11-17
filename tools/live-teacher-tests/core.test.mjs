// Live Teacher core + prompt tests (mistake tracker, tone ladder, memory).
// Run: node --test tools/live-teacher-tests/      (also works with: deno test -A)
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyProfile, applyMistake, applyCorrectUse, applyLevelEstimate, applyPronunciation, applyVocabulary,
  finishLesson, memorySummary, publicProfileView, mistakeStats, mistakeKey, RULES, MASTERY_STREAK,
} from '../../base44/shared/liveTeacherCore.js';
import { buildInstructions, buildSessionConfig, TOOLS } from '../../base44/shared/liveTeacherPrompt.js';

const T0 = Date.parse('2026-11-17T09:00:00Z');
const igoes = {
  rule: 'grammar.subject_verb_agreement', variant: 'i_goes',
  wrong: 'I goes to school.', correct: 'I go to school.',
  explanation_uz: "'I' bilan 'go' ishlatiladi, 'goes' emas.",
};
const hedont = {
  rule: 'grammar.subject_verb_agreement', variant: 'he_dont',
  wrong: "He don't like tea.", correct: "He doesn't like tea.", explanation_uz: "'He' bilan 'doesn't' ishlatiladi.",
};
const IGOES_KEY = mistakeKey('grammar.subject_verb_agreement', 'i_goes');
const mistake = (p, report, ctx = {}) => applyMistake(p, report, { lessonId: 'L1', mode: 'strict', ageGroup: 'adult', now: T0, ...ctx });

test('1. a simple first mistake is NEW: patient, explain in Uzbek', () => {
  const { profile, result } = mistake(emptyProfile('a@b.c'), igoes);
  assert.equal(result.status, 'new');
  assert.equal(result.level, 1);
  assert.equal(result.tone, 'patient');
  assert.match(result.directive, /patient/i);
  assert.match(result.directive, /Uzbek/);
  assert.equal(profile.mistakes[IGOES_KEY].total_count, 1);
});

test('2. the same mistake 3 times in one lesson climbs patient -> stricter -> playful strict + drill', () => {
  let p = emptyProfile('a@b.c');
  const seen = [];
  for (let i = 0; i < 4; i++) {
    const r = mistake(p, igoes);
    p = r.profile;
    seen.push(r.result);
  }
  assert.deepEqual(seen.map((r) => r.status), ['new', 'repeated', 'repeated', 'repeated']);
  assert.deepEqual(seen.map((r) => r.level), [1, 2, 3, 4]);
  assert.deepEqual(seen.map((r) => r.tone), ['patient', 'stricter', 'playful_strict', 'playful_strict_drill']);
  assert.equal(seen[1].needs_drill, false);
  assert.equal(seen[2].needs_drill, true);
  // 2nd: reminds of the earlier explanation; 3rd: sarcasm + repeat + extra exercise
  assert.match(seen[1].directive, /already (explained|covered)/i);
  assert.ok(seen[1].directive.includes("'I' bilan 'go'"), 'quotes the earlier Uzbek explanation');
  assert.match(seen[2].directive, /sarcasm/i);
  assert.match(seen[2].directive, /repeat/i);
  assert.match(seen[2].directive, /extra exercise/i);
  assert.equal(seen[3].total_count, 4);
});

test('0. keys never contain a dot (they are database field names)', () => {
  assert.equal(IGOES_KEY, 'grammar_subject_verb_agreement__i_goes');
  for (const r of RULES) assert.equal(mistakeKey(r, 'x.y z').includes('.'), false);
});

test('3. different mistakes are NOT counted as the same mistake', () => {
  let p = emptyProfile('a@b.c');
  p = mistake(p, igoes).profile;
  const r = mistake(p, hedont);
  assert.equal(r.result.status, 'new', 'he_dont is a different mistake from i_goes');
  assert.equal(r.result.level, 1);
  assert.equal(Object.keys(r.profile.mistakes).length, 2);
  // and a different rule with a similar word is also separate
  const r2 = mistake(r.profile, { rule: 'grammar.past_simple', variant: 'goed', wrong: 'I goed home.', correct: 'I went home.' });
  assert.equal(r2.result.status, 'new');
  assert.equal(Object.keys(r2.profile.mistakes).length, 3);
});

test('3b. the same wrong sentence under a drifting variant name is still the same mistake', () => {
  let p = mistake(emptyProfile('a@b.c'), igoes).profile;
  const r = mistake(p, { ...igoes, variant: 'first_person_with_s', wrong: 'i goes to school' });
  assert.equal(r.result.status, 'repeated');
  assert.equal(Object.keys(r.profile.mistakes).length, 1);
});

test('4. a mistake from an earlier lesson is already REPEATED (level 2) with the old explanation', () => {
  let p = mistake(emptyProfile('a@b.c'), igoes, { lessonId: 'L1' }).profile;
  const r = mistake(p, igoes, { lessonId: 'L2', now: T0 + 86400000 });
  assert.equal(r.result.status, 'repeated');
  assert.equal(r.result.level, 2);
  assert.equal(r.result.previous_explanation_uz, igoes.explanation_uz);
  // and it keeps climbing inside the new lesson
  const r3 = mistake(r.profile, igoes, { lessonId: 'L2', now: T0 + 86400000 + 1000 });
  assert.equal(r3.result.level, 3);
});

test('5. mastery: 3 correct uses in a row; a new mistake resets the streak; coming back is a RELAPSE', () => {
  let p = mistake(emptyProfile('a@b.c'), igoes).profile;
  let r = applyCorrectUse(p, igoes);
  assert.equal(r.result.status, 'improving');
  assert.equal(r.result.correct_streak, 1);
  // a mistake in between resets the streak
  p = mistake(r.profile, igoes).profile;
  assert.equal(p.mistakes[IGOES_KEY].correct_streak, 0);
  for (let i = 1; i <= MASTERY_STREAK; i++) {
    r = applyCorrectUse(p, igoes);
    p = r.profile;
  }
  assert.equal(r.result.status, 'mastered');
  assert.equal(p.mistakes[IGOES_KEY].status, 'mastered');
  assert.deepEqual(mistakeStats(p), { active: 0, mastered: 1 });
  // mastered mistakes are not nagged about any more
  assert.equal(applyCorrectUse(p, igoes).result.status, 'already_mastered');
  // ...but if it comes back, that is a relapse, distinguished from new/repeated
  const back = mistake(p, igoes, { lessonId: 'L9' });
  assert.equal(back.result.status, 'relapse');
  assert.match(back.result.directive, /MASTERED/);
  assert.equal(back.profile.mistakes[IGOES_KEY].relapses, 1);
  assert.equal(back.profile.mistakes[IGOES_KEY].status, 'active');
  // correct use of something never mistaken is ignored, not invented
  assert.equal(applyCorrectUse(emptyProfile('x'), igoes).result.status, 'untracked');
});

test('6. modes: normal never sarcastic, exam stays silent, children never get sarcasm', () => {
  let p = emptyProfile('a@b.c');
  const normal = [];
  for (let i = 0; i < 3; i++) { const r = mistake(p, igoes, { mode: 'normal' }); p = r.profile; normal.push(r.result); }
  assert.deepEqual(normal.map((r) => r.tone), ['patient', 'patient_firm', 'encouraging_drill']);
  assert.match(normal[2].directive, /NO sarcasm/);

  const exam = mistake(emptyProfile('a@b.c'), igoes, { mode: 'exam' }).result;
  assert.equal(exam.tone, 'examiner');
  assert.match(exam.directive, /do NOT correct/i);
  assert.equal(exam.needs_drill, false);

  let k = emptyProfile('a@b.c');
  let last;
  for (let i = 0; i < 3; i++) { const r = mistake(k, igoes, { ageGroup: 'kid' }); k = r.profile; last = r.result; }
  assert.equal(last.tone, 'playful_gentle');
  assert.match(last.directive, /NO sarcasm/);
});

test('7. level estimate is smoothed and validated', () => {
  let p = emptyProfile('a@b.c');
  for (const cefr of ['A2', 'A2', 'B1']) p = applyLevelEstimate(p, { cefr, confidence: 0.7 }, { now: T0 }).profile;
  assert.equal(p.cefr_level, 'A2', 'one optimistic estimate does not move the level');
  for (const cefr of ['B1', 'B1']) p = applyLevelEstimate(p, { cefr }, { now: T0 }).profile;
  assert.equal(p.cefr_level, 'B1');
  const bad = applyLevelEstimate(p, { cefr: 'Z9' });
  assert.equal(bad.result.ok, false);
  assert.equal(bad.profile.cefr_level, 'B1');
});

test('8. pronunciation + vocabulary memory', () => {
  let p = emptyProfile('a@b.c');
  let r = applyPronunciation(p, { word: 'Think', issue: 'th pronounced as s', tip_uz: "Tilni tishlar orasiga qo'ying" });
  assert.equal(r.result.status, 'new');
  r = applyPronunciation(r.profile, { word: 'think', issue: 'th pronounced as s' });
  assert.equal(r.result.status, 'repeated');
  assert.equal(r.result.count, 2);
  assert.match(r.result.directive, /three times/);
  p = r.profile;
  let v = applyVocabulary(p, { word: 'borrow', outcome: 'struggled', meaning_uz: 'qarz olmoq' });
  v = applyVocabulary(v.profile, { word: 'borrow', outcome: 'used_well' });
  assert.equal(v.profile.vocabulary.borrow.learned, false);
  v = applyVocabulary(v.profile, { word: 'borrow', outcome: 'used_well' });
  assert.equal(v.profile.vocabulary.borrow.learned, true);
  assert.equal(applyVocabulary(p, { word: '', outcome: 'learned' }).result.ok, false);
});

test('9. returning student: memory summary carries level, exact mistake keys, last lesson', () => {
  assert.match(memorySummary(emptyProfile('a@b.c')), /FIRST LESSON/);
  let p = mistake(emptyProfile('a@b.c'), igoes).profile;
  p = applyLevelEstimate(p, { cefr: 'A2' }).profile;
  p = applyPronunciation(p, { word: 'think', issue: 'th as s' }).profile;
  p = finishLesson(p, { mode: 'strict', summary: 'Present Simple practice.', focusNext: ['he/she + s'], now: T0 });
  const s = memorySummary(p, { now: T0 + 2 * 86400000 });
  assert.match(s, /Level estimate: A2/);
  assert.match(s, /Lessons so far: 1/);
  assert.match(s, /2 day\(s\) ago/);
  assert.match(s, /rule=grammar\.subject_verb_agreement variant=i_goes/);
  assert.match(s, /think/);
  assert.match(s, /he\/she \+ s/);
});

test('10. finishLesson keeps progress; exam scores are stored only for exam mode', () => {
  let p = applyLevelEstimate(emptyProfile('a@b.c'), { cefr: 'B1' }).profile;
  const scores = { grammar: 71, vocabulary: 64.4, fluency: 58, pronunciation: 80, cefr: 'B1' };
  const normal = finishLesson(p, { mode: 'strict', summary: 's', scores, now: T0 });
  assert.equal(normal.test_results.length, 0);
  assert.equal(normal.lesson_count, 1);
  const exam = finishLesson(p, { mode: 'exam', summary: 's', scores, now: T0 });
  assert.equal(exam.test_results.length, 1);
  assert.equal(exam.test_results[0].vocabulary, 64);
  assert.equal(exam.progress.length, 1);
});

test('11. the mistake map is capped and keeps active mistakes over mastered ones', () => {
  let p = emptyProfile('a@b.c');
  for (let i = 0; i < 205; i++) {
    p = applyMistake(p, { rule: 'other.general', variant: `v${i}`, wrong: `w${i}`, correct: `c${i}` }, { lessonId: 'L', now: T0 + i * 1000 }).profile;
    if (i < 50) p.mistakes[mistakeKey('other.general', `v${i}`)].status = 'mastered';
  }
  assert.ok(Object.keys(p.mistakes).length <= 200);
  assert.ok(p.mistakes[mistakeKey('other.general', 'v204')], 'newest survives');
  assert.equal(p.mistakes[mistakeKey('other.general', 'v0')], undefined, 'oldest mastered one is evicted first');
});

test('12. what the browser sees contains no internal lesson ids', () => {
  const p = mistake(emptyProfile('a@b.c'), igoes).profile;
  const view = publicProfileView(p);
  assert.equal(view.mistakes[0].key, IGOES_KEY);
  assert.ok(view.mistakes[0].label.uz);
  assert.equal(JSON.stringify(view).includes('last_lesson_id'), false);
});

// ---------------- prompt + session ----------------
test('prompt: personality, modes, memory, safety and tool protocol are all present', () => {
  const strict = buildInstructions({ mode: 'strict', ageGroup: 'adult', uiLang: 'uz', studentName: 'Doniyor Pulatov', memory: 'MEMORY-LINE' });
  assert.match(strict, /Strict and demanding/);
  assert.match(strict, /Yana shu xatomi/);
  assert.match(strict, /NEVER abusive, threatening, discriminatory or humiliating/);
  assert.match(strict, /MODE: STRICT/);
  assert.match(strict, /MEMORY-LINE/);
  assert.match(strict, /first name is Doniyor\./);
  assert.ok(!strict.includes('Pulatov'), 'only the first name goes to the model');
  assert.match(strict, /FIRST call log_mistake/);
  assert.match(strict, /I don't understand/);
  assert.match(strict, /language\.used_uzbek_instead_of_english/);
  assert.match(buildInstructions({ mode: 'exam', ageGroup: 'adult' }), /NEVER reveal answers/);
  assert.match(buildInstructions({ mode: 'normal', ageGroup: 'adult' }), /MODE: NORMAL/);
  assert.match(buildInstructions({ mode: 'strict', ageGroup: 'kid' }), /NO sarcasm at all/);
  // junk input falls back safely
  assert.match(buildInstructions({ mode: 'hax', ageGroup: 'zzz' }), /MODE: STRICT/);
});

test('session config: GA realtime shape, tools, semantic VAD with interruption, no language lock', () => {
  const cfg = buildSessionConfig({ instructions: 'X', env: {} });
  assert.equal(cfg.type, 'realtime');
  assert.equal(cfg.model, 'gpt-realtime-2');
  assert.equal(cfg.audio.output.voice, 'marin');
  assert.equal(cfg.audio.input.turn_detection.interrupt_response, true);
  assert.equal(cfg.audio.input.turn_detection.type, 'semantic_vad');
  assert.equal('language' in cfg.audio.input.transcription, false);
  assert.deepEqual(cfg.reasoning, { effort: 'low' });
  const names = cfg.tools.map((t) => t.name);
  assert.deepEqual(names.sort(), ['end_lesson', 'log_correct_use', 'log_mistake', 'log_pronunciation', 'log_vocabulary', 'set_level_estimate']);
  const lm = TOOLS.find((t) => t.name === 'log_mistake');
  assert.deepEqual(lm.parameters.properties.rule.enum, RULES);
  const custom = buildSessionConfig({ instructions: 'X', env: { LIVE_TEACHER_MODEL: 'gpt-realtime-mini', LIVE_TEACHER_VOICE: 'cedar', LIVE_TEACHER_REASONING: '' } });
  assert.equal(custom.model, 'gpt-realtime-mini');
  assert.equal(custom.audio.output.voice, 'cedar');
  assert.equal('reasoning' in custom, false);
});
