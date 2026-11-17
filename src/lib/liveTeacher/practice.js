// Live Teacher -> grammar practice map.
//
// After a lesson, every mistake on the recap gets up to two "Practise this"
// buttons that open the grammar production round for the topic that trains
// that exact mistake. PURE: no React, no '@/' imports, so `node --test` can
// load it (tools/live-teacher-tests/practice.test.mjs).
//
// Lookup order in practiceFor(rule, variant):
//   1. VARIANT_OVERRIDES['rule__variant']  the variant names the exact pattern
//      (i_goes is a third-person -s drill, there_is_are is the existential
//      drill, even though the model filed both under subject-verb agreement).
//      When an override exists it REPLACES the rule list: a generic second
//      button would point at something the student did not get wrong.
//   2. PRACTICE_MAP[rule]  best topic first.
//   3. []  unknown rule, or a rule with no grammar exercise (vocabulary,
//      writing, speaking Uzbek, passive, relative clauses, reported speech).
//
// Topic keys must exist in the grammar bank (content/grammar-practice/). The
// test checks every key against the live list from 2026-11-17 (109 topics).
// Variant spelling follows slug() in base44/shared/liveTeacherCore.js
// (lowercase snake_case); normVariant() below applies the same rule so a
// raw "I goes" still finds the override.

export const PRACTICE_MAP = {
  'grammar.subject_verb_agreement': ['tenses.present.third-person-s', 'questions-negation.negation.dont-doesnt'],
  'grammar.verb_to_be': ['sentence-structure.predication.be-am-is-are', 'sentence-structure.predication.be-question'],
  'grammar.articles': ['nouns-articles.articles.a-an', 'nouns-articles.articles.the-unique'],
  'grammar.plural_nouns': ['nouns-articles.plurals-agreement.es-plural', 'nouns-articles.plurals-agreement.irregular-plural'],
  'grammar.present_simple': ['tenses.present.simple-routine', 'tenses.present.third-person-s'],
  'grammar.present_continuous': ['tenses.present.continuous-now', 'tenses.present.simple-vs-continuous'],
  'grammar.past_simple': ['tenses.past.irregular-past', 'tenses.past.simple-finished-time'],
  'grammar.present_perfect': ['tenses.perfect.present-result', 'tenses.perfect.experience-ever'],
  'grammar.future_forms': ['tenses.future.will-spontaneous', 'tenses.future.going-to-plan'],
  'grammar.modal_verbs': ['modals.ability-permission.can-form', 'modals.advice.should'],
  'grammar.conditionals': ['conditionals-wishes.zero-first.first-if-clause', 'conditionals-wishes.zero-first.first-will'],
  'grammar.passive_voice': [],
  'grammar.word_order': ['sentence-structure.word-order.svo-basic', 'adj-adv.frequency.adverb-position'],
  'grammar.question_formation': ['questions-negation.yes-no.do-does', 'questions-negation.yes-no.be-vs-do'],
  'grammar.negation': ['questions-negation.negation.dont-doesnt', 'tenses.present.simple-negative'],
  'grammar.prepositions': ['prep-phrasal.time.in-on-at-contrast', 'prep-phrasal.dependent-prepositions.adjective-preposition'],
  'grammar.pronouns': ['pronouns.personal.subject-pronouns', 'pronouns.personal.object-pronouns'],
  'grammar.countable_uncountable': ['nouns-articles.countability.uncountable-no-plural', 'nouns-articles.quantifiers.much-many'],
  'grammar.comparatives': ['comparison.comparative.er-comparative', 'comparison.comparative.more-comparative'],
  'grammar.gerund_infinitive': ['verb-patterns.gerund-infinitive.want-infinitive', 'verb-patterns.gerund-infinitive.enjoy-gerund'],
  'grammar.relative_clauses': [],
  'grammar.reported_speech': [],
  'vocabulary.word_choice': [],
  'vocabulary.false_friend': [],
  'vocabulary.collocation': [],
  'writing.spelling': [],
  'writing.punctuation': [],
  'language.used_uzbek_instead_of_english': [],
  'other.general': [],
};

// Short aliases keep the table below readable. Every value is a full topic key.
const T = {
  thirdS: 'tenses.present.third-person-s',
  routine: 'tenses.present.simple-routine',
  presNeg: 'tenses.present.simple-negative',
  dontDoesnt: 'questions-negation.negation.dont-doesnt',
  wasntWerent: 'questions-negation.negation.wasnt-werent',
  doDoes: 'questions-negation.yes-no.do-does',
  beVsDo: 'questions-negation.yes-no.be-vs-do',
  pastDid: 'questions-negation.yes-no.past-did',
  progQ: 'questions-negation.yes-no.progressive-question',
  pastWh: 'questions-negation.wh-questions.past-wh',
  progWh: 'questions-negation.wh-questions.progressive-wh',
  whWord: 'questions-negation.wh-questions.wh-word-choice',
  howOften: 'questions-negation.wh-questions.how-often',
  howLong: 'questions-negation.wh-questions.how-long-perfect',
  whoSubject: 'questions-negation.subject-questions.who-subject',
  thereIsAre: 'sentence-structure.existential.there-is-are',
  thereWasWere: 'sentence-structure.existential.there-was-were',
  beAmIsAre: 'sentence-structure.predication.be-am-is-are',
  beQuestion: 'sentence-structure.predication.be-question',
  svo: 'sentence-structure.word-order.svo-basic',
  lets: 'sentence-structure.imperatives.lets',
  aAn: 'nouns-articles.articles.a-an',
  aJobs: 'nouns-articles.articles.a-jobs',
  theUnique: 'nouns-articles.articles.the-unique',
  theShared: 'nouns-articles.articles.the-shared-context',
  esPlural: 'nouns-articles.plurals-agreement.es-plural',
  irrPlural: 'nouns-articles.plurals-agreement.irregular-plural',
  yIes: 'nouns-articles.plurals-agreement.y-ies-plural',
  uncNoPlural: 'nouns-articles.countability.uncountable-no-plural',
  uncAbstract: 'nouns-articles.countability.uncountable-abstract',
  partitive: 'nouns-articles.countability.partitive',
  muchMany: 'nouns-articles.quantifiers.much-many',
  fewLittle: 'nouns-articles.quantifiers.few-little',
  someAny: 'nouns-articles.quantifiers.some-any',
  noVsAny: 'nouns-articles.quantifiers.no-vs-any',
  possS: 'nouns-articles.possession.possessive-s',
  contNow: 'tenses.present.continuous-now',
  contNeg: 'tenses.present.continuous-negative',
  simpleVsCont: 'tenses.present.simple-vs-continuous',
  stative: 'tenses.present.stative-verbs',
  temporary: 'tenses.present.temporary-situation',
  generalTruth: 'tenses.present.general-truth',
  irrPast: 'tenses.past.irregular-past',
  finishedTime: 'tenses.past.simple-finished-time',
  pastNeg: 'tenses.past.simple-negative',
  interrupted: 'tenses.past.interrupted-action',
  contAtTime: 'tenses.past.continuous-at-time',
  usedTo: 'tenses.used-to.used-to-state',
  presResult: 'tenses.perfect.present-result',
  everExp: 'tenses.perfect.experience-ever',
  neverExp: 'tenses.perfect.never-experience',
  perfForSince: 'tenses.perfect.for-since',
  will: 'tenses.future.will-spontaneous',
  goingPlan: 'tenses.future.going-to-plan',
  goingEvidence: 'tenses.future.going-to-evidence',
  futCont: 'tenses.future.future-continuous',
  arrangeCont: 'tenses.future.arrangement-continuous', // added in lane A (topic is live on the branch)
  canForm: 'modals.ability-permission.can-form',
  canQ: 'modals.ability-permission.can-question',
  cant: 'modals.ability-permission.cant-ability',
  canRequest: 'modals.ability-permission.can-request',
  should: 'modals.advice.should',
  haveTo: 'modals.semi-modals.have-to',
  ifClause: 'conditionals-wishes.zero-first.first-if-clause',
  firstWill: 'conditionals-wishes.zero-first.first-will',
  zeroCond: 'conditionals-wishes.zero-first.zero-general-truth',
  advPos: 'adj-adv.frequency.adverb-position',
  adjBeforeNoun: 'adj-adv.adjective-form.adjective-before-noun',
  lyAdverb: 'adj-adv.adverb-form.ly-adverb',
  inOnAt: 'prep-phrasal.time.in-on-at-contrast',
  atClock: 'prep-phrasal.time.at-clock',
  onDays: 'prep-phrasal.time.on-days',
  inMonths: 'prep-phrasal.time.in-months',
  atNight: 'prep-phrasal.time.at-night',
  sinceFor: 'prep-phrasal.time.since-for',
  interestedIn: 'prep-phrasal.dependent-prepositions.interested-in',
  adjPrep: 'prep-phrasal.dependent-prepositions.adjective-preposition',
  phrasal: 'prep-phrasal.phrasal-verbs.common-phrasal',
  subjPron: 'pronouns.personal.subject-pronouns',
  objPron: 'pronouns.personal.object-pronouns',
  possDet: 'pronouns.possessive.possessive-determiners',
  thisThese: 'pronouns.demonstrative.this-these-near',
  thatThose: 'pronouns.demonstrative.that-those-far',
  oneOnes: 'pronouns.substitution.one-ones',
  erComp: 'comparison.comparative.er-comparative',
  moreComp: 'comparison.comparative.more-comparative',
  doubleComp: 'comparison.comparative.double-comparative-error',
  lessComp: 'comparison.comparative.less-comparative',
  asAs: 'comparison.equality.as-as',
  estSup: 'comparison.superlative.est-superlative',
  irrSup: 'comparison.superlative.irregular-superlative',
  wantInf: 'verb-patterns.gerund-infinitive.want-infinitive',
  enjoyGer: 'verb-patterns.gerund-infinitive.enjoy-gerund',
  decideInf: 'verb-patterns.gerund-infinitive.decide-infinitive',
  wouldLikeInf: 'verb-patterns.gerund-infinitive.would-like-infinitive',
  prepGer: 'verb-patterns.gerund-infinitive.preposition-gerund',
};

// rule -> { variant: [topics] }. Several spellings of one pattern point at the
// same topics, because the model names variants itself. Common variants also
// appear under every rule the model is likely to file them under.
const BY_RULE = {
  'grammar.subject_verb_agreement': {
    i_goes: [T.thirdS, T.routine], he_go: [T.thirdS], she_go: [T.thirdS], he_like: [T.thirdS],
    missing_s: [T.thirdS], third_person_s: [T.thirdS], missing_third_person_s: [T.thirdS],
    he_dont: [T.dontDoesnt, T.presNeg], she_dont: [T.dontDoesnt, T.presNeg], it_dont: [T.dontDoesnt, T.presNeg],
    i_doesnt: [T.dontDoesnt, T.presNeg], dont_doesnt: [T.dontDoesnt],
    does_he_goes: [T.doDoes], do_he: [T.doDoes], does_verb_s: [T.doDoes],
    there_is_are: [T.thereIsAre], there_is_plural: [T.thereIsAre], there_are_singular: [T.thereIsAre],
    there_was_were: [T.thereWasWere],
    they_is: [T.beAmIsAre], we_is: [T.beAmIsAre], i_is: [T.beAmIsAre], i_are: [T.beAmIsAre],
    he_are: [T.beAmIsAre], you_is: [T.beAmIsAre], people_is: [T.beAmIsAre], am_is_are: [T.beAmIsAre],
    they_was: [T.wasntWerent, T.thereWasWere], we_was: [T.wasntWerent], was_were: [T.wasntWerent, T.thereWasWere],
    can_s: [T.canForm], he_cans: [T.canForm],
  },
  'grammar.verb_to_be': {
    missing_be: [T.beAmIsAre], missing_am: [T.beAmIsAre], missing_is: [T.beAmIsAre], missing_are: [T.beAmIsAre],
    i_student: [T.beAmIsAre, T.aJobs], am_is_are: [T.beAmIsAre], they_is: [T.beAmIsAre], i_is: [T.beAmIsAre],
    be_question: [T.beQuestion, T.beVsDo], is_question: [T.beQuestion], you_are_question: [T.beQuestion],
    do_you_are: [T.beVsDo, T.beQuestion], do_be: [T.beVsDo], be_vs_do: [T.beVsDo],
    i_am_agree: [T.beVsDo, T.routine], i_am_like: [T.beVsDo, T.routine], be_with_verb: [T.beVsDo, T.routine],
    was_were: [T.wasntWerent, T.thereWasWere], they_was: [T.wasntWerent],
    there_is_are: [T.thereIsAre],
  },
  'grammar.articles': {
    a_an: [T.aAn], a_before_vowel: [T.aAn], an_before_consonant: [T.aAn], a_apple: [T.aAn],
    missing_a: [T.aAn, T.aJobs], missing_a_job: [T.aJobs], missing_article_job: [T.aJobs], i_am_doctor: [T.aJobs],
    missing_the: [T.theUnique, T.theShared], missing_the_before_sea: [T.theUnique], the_unique: [T.theUnique],
    missing_the_second_mention: [T.theShared], the_shared_context: [T.theShared], a_vs_the: [T.theShared, T.aAn],
    a_with_uncountable: [T.uncNoPlural, T.partitive], a_with_plural: [T.esPlural, T.aAn],
  },
  'grammar.plural_nouns': {
    missing_plural_s: [T.esPlural], missing_plural: [T.esPlural], regular_plural: [T.esPlural],
    es_plural: [T.esPlural], boxs: [T.esPlural], watchs: [T.esPlural],
    y_ies: [T.yIes], y_ies_plural: [T.yIes], babys: [T.yIes], citys: [T.yIes],
    irregular_plural: [T.irrPlural], childs: [T.irrPlural], mans: [T.irrPlural], foots: [T.irrPlural],
    peoples: [T.irrPlural], womans: [T.irrPlural],
    uncountable_plural: [T.uncNoPlural], informations: [T.uncNoPlural], advices: [T.uncNoPlural],
    plural_verb_agreement: [T.beAmIsAre, T.thereIsAre],
  },
  'grammar.present_simple': {
    i_goes: [T.thirdS, T.routine], he_go: [T.thirdS], she_go: [T.thirdS], he_like: [T.thirdS],
    missing_s: [T.thirdS], third_person_s: [T.thirdS], missing_third_person_s: [T.thirdS],
    he_dont: [T.dontDoesnt, T.presNeg], she_dont: [T.dontDoesnt, T.presNeg],
    negative: [T.presNeg, T.dontDoesnt], i_not_like: [T.presNeg, T.dontDoesnt], not_verb: [T.presNeg, T.dontDoesnt],
    question: [T.doDoes], missing_do: [T.doDoes], does_he_goes: [T.doDoes], you_like_question: [T.doDoes],
    continuous_for_routine: [T.simpleVsCont, T.routine], simple_vs_continuous: [T.simpleVsCont],
    i_am_go: [T.beVsDo, T.routine], i_am_like: [T.beVsDo, T.routine],
    general_truth: [T.generalTruth], how_often: [T.howOften, T.advPos],
    adverb_position: [T.advPos],
  },
  'grammar.present_continuous': {
    missing_be: [T.contNow], missing_am: [T.contNow], i_going: [T.contNow], he_playing: [T.contNow],
    missing_ing: [T.contNow], continuous_now: [T.contNow],
    negative: [T.contNeg], continuous_negative: [T.contNeg], i_not_going: [T.contNeg],
    question: [T.progQ, T.progWh], progressive_question: [T.progQ], what_you_doing: [T.progWh, T.progQ],
    simple_for_now: [T.simpleVsCont, T.contNow], simple_vs_continuous: [T.simpleVsCont],
    continuous_for_routine: [T.simpleVsCont, T.routine],
    stative: [T.stative], stative_verbs: [T.stative], i_am_knowing: [T.stative], i_am_liking: [T.stative],
    i_am_wanting: [T.stative], i_am_understanding: [T.stative],
    temporary: [T.temporary], temporary_situation: [T.temporary],
    present_continuous_for_future: [T.arrangeCont], arrangement: [T.arrangeCont],
  },
  'grammar.past_simple': {
    irregular: [T.irrPast], irregular_past: [T.irrPast], goed: [T.irrPast], buyed: [T.irrPast],
    eated: [T.irrPast], seed: [T.irrPast], taked: [T.irrPast], comed: [T.irrPast],
    present_for_past: [T.finishedTime, T.irrPast], missing_ed: [T.finishedTime], missing_past: [T.finishedTime, T.irrPast],
    yesterday_go: [T.finishedTime, T.irrPast], finished_time: [T.finishedTime],
    negative: [T.pastNeg], didnt_went: [T.pastNeg], didnt_past: [T.pastNeg], not_went: [T.pastNeg],
    past_negative: [T.pastNeg], i_no_go: [T.pastNeg],
    question: [T.pastDid, T.pastWh], did_went: [T.pastDid, T.pastWh], missing_did: [T.pastDid, T.pastWh],
    past_question: [T.pastDid, T.pastWh], where_you_went: [T.pastWh, T.pastDid],
    was_were: [T.wasntWerent, T.thereWasWere], they_was: [T.wasntWerent],
    past_continuous: [T.contAtTime, T.interrupted], interrupted_action: [T.interrupted, T.contAtTime],
    used_to: [T.usedTo], use_to: [T.usedTo],
  },
  'grammar.present_perfect': {
    since_for: [T.perfForSince, T.sinceFor], for_since: [T.perfForSince, T.sinceFor],
    since_with_period: [T.perfForSince, T.sinceFor], for_with_point: [T.perfForSince, T.sinceFor],
    present_for_duration: [T.perfForSince, T.howLong], i_live_here_since: [T.perfForSince, T.sinceFor],
    how_long: [T.howLong, T.perfForSince],
    ever: [T.everExp], experience: [T.everExp, T.neverExp], have_you_ever: [T.everExp],
    did_you_ever: [T.everExp, T.pastDid], never: [T.neverExp], never_experience: [T.neverExp],
    perfect_with_finished_time: [T.finishedTime, T.presResult], perfect_with_yesterday: [T.finishedTime, T.presResult],
    past_for_perfect: [T.presResult, T.everExp], past_vs_perfect: [T.presResult, T.finishedTime],
    missing_have: [T.presResult], past_participle: [T.presResult, T.everExp], have_went: [T.presResult, T.everExp],
    present_result: [T.presResult],
  },
  'grammar.future_forms': {
    going_to: [T.goingPlan, T.goingEvidence], missing_be_going_to: [T.goingPlan], i_going_to: [T.goingPlan],
    going_to_plan: [T.goingPlan], will_for_plan: [T.goingPlan, T.will], will_vs_going_to: [T.goingPlan, T.will],
    going_to_evidence: [T.goingEvidence],
    will_to: [T.will], will_ing: [T.will], will_s: [T.will], will_spontaneous: [T.will], present_for_future: [T.will, T.goingPlan],
    future_continuous: [T.futCont],
    present_continuous_for_future: [T.arrangeCont], arrangement: [T.arrangeCont], arrangements: [T.arrangeCont],
    will_in_if_clause: [T.ifClause, T.firstWill], if_will: [T.ifClause, T.firstWill],
  },
  'grammar.modal_verbs': {
    can_to: [T.canForm], can_s: [T.canForm], can_ing: [T.canForm], can_verb_s: [T.canForm], modal_to: [T.canForm, T.should],
    he_cans: [T.canForm], can_form: [T.canForm],
    can_question: [T.canQ, T.canRequest], do_you_can: [T.canQ], can_request: [T.canRequest],
    cant: [T.cant], dont_can: [T.cant], cant_ability: [T.cant],
    should_to: [T.should], should: [T.should], must_to: [T.should, T.haveTo],
    have_to: [T.haveTo], has_to: [T.haveTo], must_vs_have_to: [T.haveTo], have_to_he: [T.haveTo],
  },
  'grammar.conditionals': {
    will_in_if_clause: [T.ifClause, T.firstWill], if_will: [T.ifClause], first_conditional: [T.ifClause, T.firstWill],
    missing_will: [T.firstWill, T.ifClause], first_will: [T.firstWill],
    zero_conditional: [T.zeroCond], zero_general_truth: [T.zeroCond],
  },
  'grammar.word_order': {
    svo: [T.svo], svo_basic: [T.svo], verb_before_subject: [T.svo], object_before_verb: [T.svo],
    adverb_position: [T.advPos], frequency_adverb_position: [T.advPos], always_position: [T.advPos],
    usually_position: [T.advPos], often_position: [T.advPos],
    adjective_after_noun: [T.adjBeforeNoun], adjective_position: [T.adjBeforeNoun],
    question_word_order: [T.doDoes, T.beQuestion], wh_question_order: [T.pastWh, T.doDoes],
    missing_auxiliary: [T.doDoes, T.pastDid],
  },
  'grammar.question_formation': {
    missing_do: [T.doDoes], no_auxiliary: [T.doDoes, T.pastDid], missing_auxiliary: [T.doDoes, T.pastDid],
    you_like: [T.doDoes], does_he_goes: [T.doDoes], do_does: [T.doDoes], do_he: [T.doDoes],
    do_you_are: [T.beVsDo, T.beQuestion], do_be: [T.beVsDo], are_you_like: [T.beVsDo, T.doDoes], be_vs_do: [T.beVsDo],
    be_question: [T.beQuestion, T.beVsDo], intonation_only: [T.doDoes, T.beQuestion],
    did_went: [T.pastDid, T.pastWh], missing_did: [T.pastDid, T.pastWh], past_question: [T.pastDid, T.pastWh],
    past_wh: [T.pastWh, T.pastDid],
    who_subject: [T.whoSubject], who_did_call: [T.whoSubject], subject_question: [T.whoSubject],
    wh_word: [T.whWord], wh_word_choice: [T.whWord], wrong_question_word: [T.whWord],
    how_often: [T.howOften], how_long: [T.howLong, T.perfForSince],
    progressive_question: [T.progQ, T.progWh], what_you_doing: [T.progWh, T.progQ],
    can_question: [T.canQ], do_you_can: [T.canQ],
  },
  'grammar.negation': {
    he_dont: [T.dontDoesnt, T.presNeg], she_dont: [T.dontDoesnt, T.presNeg], dont_doesnt: [T.dontDoesnt],
    i_not_like: [T.presNeg, T.dontDoesnt], not_verb: [T.presNeg, T.dontDoesnt], i_no: [T.presNeg, T.dontDoesnt],
    no_do: [T.presNeg, T.dontDoesnt], present_negative: [T.presNeg, T.dontDoesnt],
    didnt_went: [T.pastNeg], not_went: [T.pastNeg], past_negative: [T.pastNeg], i_no_go: [T.pastNeg],
    wasnt_werent: [T.wasntWerent], werent_wasnt: [T.wasntWerent],
    continuous_negative: [T.contNeg], i_not_going: [T.contNeg],
    dont_can: [T.cant], cant: [T.cant],
    double_negative: [T.noVsAny], no_vs_any: [T.noVsAny], not_no: [T.noVsAny], dont_have_no: [T.noVsAny],
  },
  'grammar.prepositions': {
    in_on_at: [T.inOnAt], in_on_at_time: [T.inOnAt], time_preposition: [T.inOnAt],
    at_clock: [T.atClock], in_clock: [T.atClock], on_clock: [T.atClock],
    on_days: [T.onDays], in_monday: [T.onDays], at_monday: [T.onDays],
    in_months: [T.inMonths], on_month: [T.inMonths], at_month: [T.inMonths],
    at_night: [T.atNight], in_night: [T.atNight], on_night: [T.atNight],
    since_for: [T.sinceFor, T.perfForSince], for_since: [T.sinceFor, T.perfForSince],
    interested_on: [T.interestedIn], interested_about: [T.interestedIn], interested_to: [T.interestedIn, T.prepGer],
    interested_in: [T.interestedIn],
    adjective_preposition: [T.adjPrep], afraid_from: [T.adjPrep], good_in: [T.adjPrep], angry_on: [T.adjPrep],
    phrasal_verb: [T.phrasal], common_phrasal: [T.phrasal],
    preposition_infinitive: [T.prepGer], before_go: [T.prepGer], preposition_gerund: [T.prepGer],
  },
  'grammar.pronouns': {
    me_vs_i: [T.subjPron], me_go: [T.subjPron], him_is: [T.subjPron], object_as_subject: [T.subjPron],
    he_she: [T.subjPron, T.possDet], he_she_mixup: [T.subjPron, T.possDet], subject_pronoun: [T.subjPron],
    i_vs_me: [T.objPron], help_i: [T.objPron], subject_as_object: [T.objPron], object_pronoun: [T.objPron],
    possessive: [T.possDet], he_vs_his: [T.possDet], me_book: [T.possDet], possessive_determiner: [T.possDet],
    his_her: [T.possDet, T.subjPron],
    this_these: [T.thisThese], this_plural: [T.thisThese], that_those: [T.thatThose], that_plural: [T.thatThose],
    one_ones: [T.oneOnes],
    missing_subject: [T.subjPron, T.svo], missing_it: [T.subjPron, T.svo],
  },
  'grammar.countable_uncountable': {
    uncountable_plural: [T.uncNoPlural], informations: [T.uncNoPlural], advices: [T.uncNoPlural],
    furnitures: [T.uncNoPlural], homeworks: [T.uncNoPlural], moneys: [T.uncNoPlural],
    a_with_uncountable: [T.uncNoPlural, T.partitive], an_advice: [T.uncNoPlural, T.partitive],
    a_bread: [T.partitive, T.uncNoPlural], partitive: [T.partitive], a_piece: [T.partitive],
    much_many: [T.muchMany], many_money: [T.muchMany], much_people: [T.muchMany], many_time: [T.muchMany],
    few_little: [T.fewLittle], little_people: [T.fewLittle], few_money: [T.fewLittle],
    some_any: [T.someAny], any_positive: [T.someAny], some_question: [T.someAny, T.canRequest],
    abstract: [T.uncAbstract], uncountable_abstract: [T.uncAbstract],
  },
  'grammar.comparatives': {
    more_er: [T.doubleComp], more_bigger: [T.doubleComp], double_comparative: [T.doubleComp], more_better: [T.doubleComp],
    er_comparative: [T.erComp], bigger_than: [T.erComp], than_then: [T.erComp], missing_than: [T.erComp],
    beautifuller: [T.moreComp], more_comparative: [T.moreComp], long_adjective_er: [T.moreComp],
    gooder: [T.irrSup, T.erComp], badder: [T.irrSup, T.erComp], irregular_comparative: [T.irrSup, T.erComp],
    goodest: [T.irrSup], baddest: [T.irrSup], irregular_superlative: [T.irrSup],
    superlative: [T.estSup], most_big: [T.estSup, T.doubleComp], missing_the_superlative: [T.estSup],
    est_superlative: [T.estSup],
    as_as: [T.asAs], as_than: [T.asAs], same_like: [T.asAs],
    less_comparative: [T.lessComp], less_er: [T.lessComp],
  },
  'grammar.gerund_infinitive': {
    want_ing: [T.wantInf], want_go: [T.wantInf], want_infinitive: [T.wantInf], want_that: [T.wantInf],
    enjoy_to: [T.enjoyGer], enjoy_infinitive: [T.enjoyGer], enjoy_gerund: [T.enjoyGer],
    decide_ing: [T.decideInf], decide_infinitive: [T.decideInf],
    would_like_ing: [T.wouldLikeInf], would_like_go: [T.wouldLikeInf], would_like_infinitive: [T.wouldLikeInf],
    preposition_infinitive: [T.prepGer], interested_in_learn: [T.prepGer, T.interestedIn],
    before_go: [T.prepGer], after_eat: [T.prepGer], preposition_gerund: [T.prepGer],
    lets_to: [T.lets], lets_ing: [T.lets],
    can_to: [T.canForm], should_to: [T.should],
  },
};

/** 'rule__variant' -> [topic keys], best first. Built from BY_RULE above. */
export const VARIANT_OVERRIDES = Object.freeze(
  Object.fromEntries(
    Object.entries(BY_RULE).flatMap(([rule, variants]) =>
      Object.entries(variants).map(([variant, topics]) => [`${rule}__${variant}`, topics])
    )
  )
);

// Same normalisation as slug() in base44/shared/liveTeacherCore.js, so a key
// stored by the server and a raw model string meet in the same place.
const normVariant = (v) =>
  String(v ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);

const MAX_BUTTONS = 2;

export const practiceHref = (topic) => `/grammar?topic=${encodeURIComponent(topic)}&stage=choose`;

/**
 * @param {string} rule     one of RULES in base44/shared/liveTeacherCore.js, e.g. 'grammar.present_simple'
 * @param {string} variant  the snake_case variant, e.g. 'i_goes'
 * @returns {{ topic: string, href: string }[]}  at most 2; [] when nothing fits
 *          href = `/grammar?topic=${topic}&stage=choose` (opens that topic's practice round)
 */
export function practiceFor(rule, variant) {
  const r = typeof rule === 'string' ? rule.trim() : '';
  if (!Object.prototype.hasOwnProperty.call(PRACTICE_MAP, r)) return [];
  const v = normVariant(variant);
  const override = v && Object.prototype.hasOwnProperty.call(VARIANT_OVERRIDES, `${r}__${v}`) ? VARIANT_OVERRIDES[`${r}__${v}`] : null;
  const topics = override || PRACTICE_MAP[r];
  return [...new Set(topics)].slice(0, MAX_BUTTONS).map((topic) => ({ topic, href: practiceHref(topic) }));
}
