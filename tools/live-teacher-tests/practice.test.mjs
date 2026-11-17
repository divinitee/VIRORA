// Live Teacher -> grammar practice map tests (src/lib/liveTeacher/practice.js).
// Run: node --test tools/live-teacher-tests/      (also works with: deno test -A)
import test from 'node:test';
import assert from 'node:assert/strict';
import { PRACTICE_MAP, VARIANT_OVERRIDES, practiceFor } from '../../src/lib/liveTeacher/practice.js';
import { RULES, RULE_LABELS, mistakeKey } from '../../base44/shared/liveTeacherCore.js';

// Live grammar-bank topic keys on feature/live-teacher, 2026-11-17 (from the
// round-2 hand-off). If the bank changes, update this list in the same commit.
const TOPICS = new Set([
  'adj-adv.adjective-form.adjective-before-noun',
  'adj-adv.adverb-form.irregular-adverb',
  'adj-adv.adverb-form.ly-adverb',
  'adj-adv.frequency.adverb-position',
  'adj-adv.frequency.always',
  'adj-adv.frequency.never',
  'adj-adv.frequency.rarely',
  'comparison.comparative.double-comparative-error',
  'comparison.comparative.er-comparative',
  'comparison.comparative.less-comparative',
  'comparison.comparative.more-comparative',
  'comparison.equality.as-as',
  'comparison.superlative.est-superlative',
  'comparison.superlative.irregular-superlative',
  'conditionals-wishes.zero-first.first-if-clause',
  'conditionals-wishes.zero-first.first-will',
  'conditionals-wishes.zero-first.zero-general-truth',
  'modals.ability-permission.can-ability',
  'modals.ability-permission.can-form',
  'modals.ability-permission.can-question',
  'modals.ability-permission.can-request',
  'modals.ability-permission.cant-ability',
  'modals.advice.should',
  'modals.semi-modals.have-to',
  'nouns-articles.articles.a-an',
  'nouns-articles.articles.a-jobs',
  'nouns-articles.articles.the-shared-context',
  'nouns-articles.articles.the-unique',
  'nouns-articles.countability.partitive',
  'nouns-articles.countability.uncountable-abstract',
  'nouns-articles.countability.uncountable-no-plural',
  'nouns-articles.plurals-agreement.es-plural',
  'nouns-articles.plurals-agreement.irregular-plural',
  'nouns-articles.plurals-agreement.y-ies-plural',
  'nouns-articles.possession.plural-possessive',
  'nouns-articles.possession.possessive-s',
  'nouns-articles.quantifiers.few-little',
  'nouns-articles.quantifiers.much-many',
  'nouns-articles.quantifiers.no-vs-any',
  'nouns-articles.quantifiers.some-any',
  'nouns-articles.quantifiers.some-offer',
  'prep-phrasal.dependent-prepositions.adjective-preposition',
  'prep-phrasal.dependent-prepositions.interested-in',
  'prep-phrasal.phrasal-verbs.common-phrasal',
  'prep-phrasal.time.at-clock',
  'prep-phrasal.time.at-night',
  'prep-phrasal.time.in-months',
  'prep-phrasal.time.in-on-at-contrast',
  'prep-phrasal.time.on-days',
  'prep-phrasal.time.since-for',
  'pronouns.demonstrative.that-those-far',
  'pronouns.demonstrative.this-these-near',
  'pronouns.personal.object-pronouns',
  'pronouns.personal.subject-pronouns',
  'pronouns.possessive.possessive-determiners',
  'pronouns.substitution.one-ones',
  'questions-negation.negation.dont-doesnt',
  'questions-negation.negation.wasnt-werent',
  'questions-negation.subject-questions.who-subject',
  'questions-negation.wh-questions.how-long-perfect',
  'questions-negation.wh-questions.how-often',
  'questions-negation.wh-questions.past-wh',
  'questions-negation.wh-questions.progressive-wh',
  'questions-negation.wh-questions.wh-word-choice',
  'questions-negation.yes-no.be-vs-do',
  'questions-negation.yes-no.do-does',
  'questions-negation.yes-no.past-did',
  'questions-negation.yes-no.progressive-question',
  'sentence-structure.conjunctions.and-but-or',
  'sentence-structure.conjunctions.because',
  'sentence-structure.conjunctions.so-result',
  'sentence-structure.conjunctions.when-time-clause',
  'sentence-structure.existential.there-is-are',
  'sentence-structure.existential.there-was-were',
  'sentence-structure.imperatives.affirmative-imperative',
  'sentence-structure.imperatives.lets',
  'sentence-structure.predication.be-am-is-are',
  'sentence-structure.predication.be-question',
  'sentence-structure.word-order.svo-basic',
  'tenses.future.future-continuous',
  'tenses.future.going-to-evidence',
  'tenses.future.going-to-plan',
  'tenses.future.will-spontaneous',
  'tenses.past.continuous-at-time',
  'tenses.past.interrupted-action',
  'tenses.past.irregular-past',
  'tenses.past.simple-finished-time',
  'tenses.past.simple-negative',
  'tenses.perfect.experience-ever',
  'tenses.perfect.for-since',
  'tenses.perfect.never-experience',
  'tenses.perfect.present-result',
  'tenses.perfect.since-duration',
  'tenses.present.continuous-negative',
  'tenses.present.continuous-now',
  'tenses.present.general-truth',
  'tenses.present.simple-negative',
  'tenses.present.simple-routine',
  'tenses.present.simple-vs-continuous',
  'tenses.present.stative-verbs',
  'tenses.present.temporary-situation',
  'tenses.present.third-person-s',
  'tenses.used-to.used-to-state',
  'verb-patterns.gerund-infinitive.decide-infinitive',
  'verb-patterns.gerund-infinitive.enjoy-gerund',
  'verb-patterns.gerund-infinitive.preposition-gerund',
  'verb-patterns.gerund-infinitive.want-infinitive',
  'verb-patterns.gerund-infinitive.would-like-infinitive',
]);

// Rules that have no grammar production exercise (yet): they must map to [].
const NO_EXERCISE = [
  'vocabulary.word_choice', 'vocabulary.false_friend', 'vocabulary.collocation',
  'writing.spelling', 'writing.punctuation', 'language.used_uzbek_instead_of_english', 'other.general',
];

const hrefOf = (topic) => `/grammar?topic=${topic}&stage=choose`;

test('P1. every rule in RULES has a PRACTICE_MAP entry, and nothing extra', () => {
  assert.equal(RULES.length, Object.keys(RULE_LABELS).length);
  for (const rule of RULES) assert.ok(Array.isArray(PRACTICE_MAP[rule]), `missing PRACTICE_MAP entry for ${rule}`);
  for (const rule of Object.keys(PRACTICE_MAP)) assert.ok(RULES.includes(rule), `PRACTICE_MAP has unknown rule ${rule}`);
});

test('P2. rules without a grammar exercise map to []', () => {
  for (const rule of NO_EXERCISE) assert.deepEqual(PRACTICE_MAP[rule], [], rule);
  for (const rule of RULES.filter((r) => r.startsWith('vocabulary.') || r.startsWith('writing.'))) {
    assert.deepEqual(PRACTICE_MAP[rule], [], rule);
  }
});

test('P3. every topic in PRACTICE_MAP and VARIANT_OVERRIDES is a live grammar topic', () => {
  for (const [rule, topics] of Object.entries(PRACTICE_MAP)) {
    for (const t of topics) assert.ok(TOPICS.has(t), `PRACTICE_MAP[${rule}] has unknown topic ${t}`);
    assert.ok(topics.length <= 2, `PRACTICE_MAP[${rule}] has more than 2 topics`);
  }
  assert.ok(Object.keys(VARIANT_OVERRIDES).length > 0);
  for (const [key, topics] of Object.entries(VARIANT_OVERRIDES)) {
    assert.ok(Array.isArray(topics) && topics.length > 0, `${key} must list at least one topic`);
    for (const t of topics) assert.ok(TOPICS.has(t), `VARIANT_OVERRIDES[${key}] has unknown topic ${t}`);
  }
});

test('P4. override keys are rule__variant with a known rule and a slug()-style variant', () => {
  for (const key of Object.keys(VARIANT_OVERRIDES)) {
    const i = key.indexOf('__');
    assert.ok(i > 0, key);
    const rule = key.slice(0, i);
    const variant = key.slice(i + 2);
    assert.ok(RULES.includes(rule), `${key}: unknown rule`);
    assert.match(variant, /^[a-z0-9]+(_[a-z0-9]+)*$/, `${key}: variant is not snake_case`);
    assert.ok(variant.length <= 40, `${key}: variant longer than slug() keeps`);
    // The server stores the same variant, so the recap can always look it up.
    assert.equal(mistakeKey(rule, variant).split('__')[1], variant, `${key}: slug() would change this variant`);
  }
});

test('P5. practiceFor returns at most 2 items with the right href', () => {
  const inputs = [
    ...RULES.map((r) => [r, '']),
    ...Object.keys(VARIANT_OVERRIDES).map((k) => [k.slice(0, k.indexOf('__')), k.slice(k.indexOf('__') + 2)]),
  ];
  for (const [rule, variant] of inputs) {
    const out = practiceFor(rule, variant);
    assert.ok(Array.isArray(out));
    assert.ok(out.length <= 2, `${rule} / ${variant} returned ${out.length}`);
    assert.equal(new Set(out.map((x) => x.topic)).size, out.length, 'no duplicate buttons');
    for (const item of out) {
      assert.deepEqual(Object.keys(item).sort(), ['href', 'topic']);
      assert.ok(TOPICS.has(item.topic));
      assert.equal(item.href, hrefOf(item.topic));
    }
  }
});

test('P6. the override wins over the rule map', () => {
  assert.equal(practiceFor('grammar.subject_verb_agreement', 'i_goes')[0].topic, 'tenses.present.third-person-s');
  assert.equal(practiceFor('grammar.subject_verb_agreement', 'he_dont')[0].topic, 'questions-negation.negation.dont-doesnt');
  assert.deepEqual(
    practiceFor('grammar.subject_verb_agreement', 'there_is_are').map((x) => x.topic),
    ['sentence-structure.existential.there-is-are'],
  );
  for (const [key, topics] of Object.entries(VARIANT_OVERRIDES)) {
    const i = key.indexOf('__');
    const out = practiceFor(key.slice(0, i), key.slice(i + 2)).map((x) => x.topic);
    assert.deepEqual(out, [...new Set(topics)].slice(0, 2), key);
  }
});

test('P7. a known rule with an unknown or empty variant falls back to the rule map', () => {
  for (const rule of RULES) {
    const want = PRACTICE_MAP[rule].slice(0, 2);
    assert.deepEqual(practiceFor(rule, 'some_variant_nobody_uses').map((x) => x.topic), want, rule);
    assert.deepEqual(practiceFor(rule, undefined).map((x) => x.topic), want, rule);
  }
});

test('P8. the variant is normalised like slug(): "I goes" finds i_goes', () => {
  const want = practiceFor('grammar.subject_verb_agreement', 'i_goes');
  assert.deepEqual(practiceFor('grammar.subject_verb_agreement', 'I goes'), want);
  assert.deepEqual(practiceFor('grammar.subject_verb_agreement', '  I-GOES! '), want);
});

test('P9. unknown or junk input returns [] and never throws', () => {
  for (const [rule, variant] of [
    ['grammar.not_a_rule', 'i_goes'], ['', ''], [undefined, undefined], [null, null],
    [42, {}], ['__proto__', 'x'], ['constructor', ''], ['toString', 'i_goes'],
    ['grammar_subject_verb_agreement', 'i_goes'], // a stored mistakeKey prefix is not a rule
  ]) {
    assert.deepEqual(practiceFor(rule, variant), [], `${String(rule)} / ${String(variant)}`);
  }
  assert.deepEqual(practiceFor('grammar.passive_voice', 'missing_be'), []);
  assert.deepEqual(practiceFor('language.used_uzbek_instead_of_english', 'whole_sentence_uzbek'), []);
});

test('P10. every grammar rule that has exercises gets at least one button', () => {
  const empty = RULES.filter((r) => r.startsWith('grammar.') && practiceFor(r, '').length === 0);
  // No topic in the bank trains these yet. Add them here only on purpose.
  assert.deepEqual(empty.sort(), ['grammar.passive_voice', 'grammar.relative_clauses', 'grammar.reported_speech']);
});
