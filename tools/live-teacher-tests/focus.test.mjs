// Phase 3: the lesson focus picker (base44/shared/liveTeacherFocus.js)
import test from 'node:test';
import assert from 'node:assert/strict';
import { pickFocus, scoreFamily, collectEvidence, familyOfTopic, familyOfRule, familiesOfText, focusBrief, FAMILIES } from '../../base44/shared/liveTeacherFocus.js';
import { RULES } from '../../base44/shared/liveTeacherCore.js';
import { clockStage, buildTurnMessage, buildBrainInstructions } from '../../base44/shared/liveTeacherBrain.js';

const NOW = Date.parse('2026-11-22T08:00:00Z');
const daysAgo = (d) => new Date(NOW - d * 86400000).toISOString();
const mistake = (rule, variant, o = {}) => ({ rule, variant, wrong_example: `${variant} wrong`, correct_example: `${variant} right`, total_count: 1, status: 'active', correct_streak: 0, last_seen: daysAgo(1), ...o });

test('every grammar/vocabulary rule the teacher can log maps to a family', () => {
  for (const r of RULES.filter((x) => x.startsWith('grammar.') || x === 'vocabulary.collocation' || x === 'vocabulary.word_choice')) assert.ok(familyOfRule(r), r);
});

test('each source names topics differently; all land in the same family', () => {
  assert.equal(familyOfTopic('grammar:tenses.past.irregular-past'), 'past_simple');
  assert.equal(familyOfTopic('grammar:tenses.past.interrupted-action'), 'past_continuous');
  assert.equal(familyOfTopic('grammar:tenses.present.simple-routine'), 'present_simple');
  assert.equal(familyOfTopic('grammar:articles.quantifiers.much-many'), 'countable_uncountable');
  assert.equal(familyOfTopic('grammar:articles.articles.a-an'), 'articles');
  assert.equal(familyOfTopic('grammar:negation.yes-no.past-did'), 'past_simple');
  assert.deepEqual(familiesOfText('Present Simple vs Progressive').sort(), ['present_continuous', 'present_simple']);
  assert.equal(familyOfRule('grammar.past_simple'), 'past_simple');
});

test('cross-skill spread wins: the same weakness in speaking + practice + writing beats a one-off', () => {
  const profile = { mistakes: {
    a: mistake('grammar.subject_verb_agreement', 'he_dont', { total_count: 3 }),
    b: mistake('grammar.prepositions', 'on_the_last_lesson'),
  } };
  const learnerItems = [{ item_type: 'grammar', item_key: 'grammar:tenses.present.simple-negative', weighted_accuracy: 0.5, rounds: 3, last_evidence_at: daysAgo(2) }];
  const assessments = [{ subskill: 'Present Simple vs Progressive', score: 1, created_date: daysAgo(3) }, { subskill: 'Subject-verb agreement', score: 2, created_date: daysAgo(3) }];
  const pick = pickFocus({ profile, learnerItems, assessments, level: 'A2', now: NOW });
  assert.equal(pick.focus.key, 'subject_verb_agreement');
  assert.match(pick.focus.why, /speaking \+ written answers/);
  assert.equal(pick.focus.examples[0].wrong, 'he_dont wrong');
  assert.match(pick.review, /on_the_last_lesson wrong/); // review is from ANOTHER family
});

test('readiness: nearly mastered is review, hopeless is "teach the base first", 30-80% is the sweet spot', () => {
  const e = (wrong, right) => ({ wrong, right, sources: new Set(['practice']), examples: [], due: false });
  const sweet = scoreFamily('past_simple', e(3, 3), { level: 'A2' });
  const mastered = scoreFamily('past_simple', e(3, 30), { level: 'A2' });
  const lost = scoreFamily('past_simple', e(30, 1), { level: 'A2' });
  assert.equal(sweet.parts.readiness, 1);
  assert.equal(mastered.parts.readiness, 0.35);
  assert.equal(lost.parts.readiness, 0.6);
});

test('basics: an A1 rule a B1 student still breaks outranks a B2 rule; last focus is spaced out', () => {
  const e = () => ({ wrong: 2, right: 1, sources: new Set(['speaking']), examples: [], due: false });
  const a1 = scoreFamily('present_simple', e(), { level: 'B1' });
  const b2 = scoreFamily('reported_speech', e(), { level: 'B1' });
  assert.ok(a1.score > b2.score);
  const again = scoreFamily('present_simple', e(), { level: 'B1', recentFocus: ['present_simple'] });
  assert.ok(again.score < a1.score);
});

test('old evidence fades out; mastered speaking mistakes count as progress, not as mistakes', () => {
  const profile = { mistakes: { a: mistake('grammar.past_simple', 'goed', { last_seen: daysAgo(90) }), b: mistake('grammar.articles', 'a_an', { status: 'mastered' }) } };
  const pick = pickFocus({ profile, level: 'A2', now: NOW });
  assert.equal(pick.focus, null); // nothing recent enough to be today's focus...
  assert.match(pick.review, /goed wrong/); // ...but an old mistake is a good 1-minute warm-up review
});

test('no data at all -> null (the teacher picks from the warm-up), brief is empty', () => {
  assert.equal(pickFocus({ now: NOW }), null);
  assert.equal(focusBrief(null), '');
});

test('the brain gets the focus at LESSON START and a clock stage each turn', () => {
  const pick = pickFocus({ profile: { mistakes: { a: mistake('grammar.past_simple', 'goed', { total_count: 2 }) } }, level: 'A2', now: NOW });
  const brief = focusBrief(pick);
  assert.match(brief, /TODAY'S FOCUS[^\n]*Past Simple/);
  assert.match(brief, /their real mistake: "goed wrong" -> "goed right"/);
  assert.match(buildTurnMessage({ persona: 'vira', start: true, focusBrief: brief }), /TODAY'S FOCUS/);
  assert.equal(clockStage(9.5, 10), 'warm_up');
  assert.equal(clockStage(7.5, 10), 'notice');
  assert.equal(clockStage(5, 10), 'practice');
  assert.equal(clockStage(2, 10), 'free_talk');
  assert.equal(clockStage(0.5, 10), 'wrap_up');
  assert.match(buildTurnMessage({ persona: 'vira', studentText: 'x', minutesLeft: 5 }), /BY THE CLOCK[^\n]*practice/);
  assert.match(buildBrainInstructions({ persona: 'vira' }), /NOTICE \(~20%\): show them ONE of their own real mistakes/);
  assert.ok(Object.keys(FAMILIES).length >= 20);
});
