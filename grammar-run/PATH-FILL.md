# Path fill: brief for the Base44 AI (2026-11-14)

Tee has decided the app gets **one learner path**. Home's Continue button walks the
13 course units in order (src/lib/grammarCourse.js). A topic with no practice bank
is a hole in that path, so this run fills the **59 missing course topics in path
order**, unit by unit. Claude is building the path screens on another branch
(`one-path-claude`) at the same time.

## Your rule set
`grammar-run/HANDOFF.md` is still your full rule set (read all of it first, plus
`tools/grammar-practice/authored/continuous-negative.mjs` and one recent topic such as
`tools/grammar-practice/authored/modals.advice.should.mjs`). Only these points change:

1. **Topic list**: write exactly these, in this order (path order, not worklist
   order). The "wl #" column is the topic's number in WORKLIST.tsv; use it as the
   row number in the log.

| # | topic key | level | wl # | path unit |
|---|---|---|---|---|
| P1 | pronouns.personal.subject-pronouns | A1 | 73 | Meet & describe |
| P2 | sentence-structure.word-order.svo-basic | A1 | 63 | Meet & describe |
| P3 | pronouns.possessive.possessive-determiners | A1 | 74 | Meet & describe |
| P4 | pronouns.demonstrative.this-these-near | A1 | 77 | Meet & describe |
| P5 | pronouns.demonstrative.that-those-far | A1 | 76 | Meet & describe |
| P6 | adj-adv.adjective-form.adjective-before-noun | A1 | 97 | Meet & describe |
| P7 | prep-phrasal.time.at-clock | A1 | 122 | Every day |
| P8 | prep-phrasal.time.on-days | A1 | 126 | Every day |
| P9 | prep-phrasal.time.in-months | A1 | 124 | Every day |
| P10 | prep-phrasal.time.at-night | A1 | 123 | Every day |
| P11 | prep-phrasal.time.in-on-at-contrast | A1 | 125 | Every day |
| P12 | prep-phrasal.phrasal-verbs.common-phrasal | A2 | 134 | Every day |
| P13 | pronouns.personal.object-pronouns | A1 | 72 | Everyday questions |
| P14 | modals.ability-permission.can-form | A1 | 109 | Can & must |
| P15 | sentence-structure.imperatives.affirmative-imperative | A1 | 58 | Can & must |
| P16 | sentence-structure.imperatives.negative-imperative | A1 | 59 | Can & must |
| P17 | modals.obligation.must | A2 | 114 | Can & must |
| P18 | modals.obligation.mustnt-vs-dont-have-to | A2 | 115 | Can & must |
| P19 | verb-patterns.object-infinitive.let-bare | A2 | 92 | Can & must |
| P20 | sentence-structure.existential.there-question | A1 | 57 | Home & my things |
| P21 | verb-patterns.have-got.have-has | A1 | 86 | Home & my things |
| P22 | verb-patterns.have-got.have-got-question | A1 | 85 | Home & my things |
| P23 | verb-patterns.have-got.have-got-negative | A1 | 84 | Home & my things |
| P24 | pronouns.possessive.possessive-pronouns | A1 | 75 | Home & my things |
| P25 | prep-phrasal.place.in-container | A1 | 120 | Home & my things |
| P26 | prep-phrasal.place.on-surface | A1 | 121 | Home & my things |
| P27 | prep-phrasal.place.between | A1 | 119 | Home & my things |
| P28 | sentence-structure.word-order.place-time-order | A1 | 62 | Home & my things |
| P29 | adj-adv.adjective-form.adjective-after-be | A2 | 98 | Right now |
| P30 | prep-phrasal.place.in-area | A2 | 127 | Right now |
| P31 | comparison.comparative.double-comparative-error | A2 | 102 | Compare & describe |
| P32 | comparison.comparative.less-comparative | A2 | 103 | Compare & describe |
| P33 | comparison.superlative.irregular-superlative | A2 | 106 | Compare & describe |
| P34 | adj-adv.adverb-form.ly-adverb | A2 | 100 | Compare & describe |
| P35 | adj-adv.adverb-form.irregular-adverb | A2 | 99 | Compare & describe |
| P36 | pronouns.substitution.one-ones | A2 | 79 | Compare & describe |
| P37 | prep-phrasal.dependent-prepositions.adjective-preposition | A2 | 132 | Compare & describe |
| P38 | modals.ability-permission.could-past-ability | A2 | 113 | Yesterday |
| P39 | modals.deduction.might-possibility | A2 | 117 | Plans & trips |
| P40 | prep-phrasal.movement.go-home | A2 | 130 | Plans & trips |
| P41 | prep-phrasal.movement.arrive-at-in | A2 | 129 | Plans & trips |
| P42 | prep-phrasal.movement.to-vs-in | A2 | 131 | Plans & trips |
| P43 | verb-patterns.gerund-infinitive.decide-infinitive | A2 | 87 | Plans & trips |
| P44 | pronouns.personal.subject-object-contrast | A2 | 78 | Ask & connect |
| P45 | pronouns.indefinite.someone-anyone | A2 | 82 | Ask & connect |
| P46 | pronouns.indefinite.something-offer | A2 | 83 | Ask & connect |
| P47 | pronouns.indefinite.nothing-anything | A2 | 81 | Ask & connect |
| P48 | pronouns.indefinite.indefinite-agreement | A2 | 80 | Ask & connect |
| P49 | sentence-structure.relative-clauses.who-people | A2 | 71 | Ask & connect |
| P50 | sentence-structure.relative-clauses.that-which-things | A2 | 69 | Ask & connect |
| P51 | sentence-structure.relative-clauses.where-place | A2 | 70 | Ask & connect |
| P52 | sentence-structure.word-order.double-object | A2 | 68 | Ask & connect |
| P53 | prep-phrasal.time.since-for | A2 | 128 | Life experiences |
| P54 | verb-patterns.gerund-infinitive.preposition-gerund | A2 | 89 | Life experiences |
| P55 | prep-phrasal.dependent-prepositions.interested-in | A2 | 133 | Life experiences |
| P56 | conditionals-wishes.zero-first.zero-general-truth | A2 | 137 | If & results |
| P57 | passive-causative.simple-passive.present-passive | A2 | 140 | If & results |
| P58 | passive-causative.simple-passive.past-passive | A2 | 139 | If & results |
| P59 | passive-causative.simple-passive.active-to-passive | A2 | 138 | If & results |

2. **Triage still applies (HANDOFF §2).** Before each topic, read its placement
   items (`grep -n 't: "<topic>"' src/lib/adaptiveGrammar/bank/*.js`) and decide:
   can it carry 20 different choose sentences that all test its own point, without
   repeating a sibling? If not, log it `needs Tee` with a merge/skip suggestion and
   move on. Watch these sibling groups: the time prepositions (P7-P11), have-got
   (P21-P23), place prepositions (P25-P27), indefinite pronouns (P45-P48), relative
   clauses (P49-P51), passives (P57-P59). `modals.ability-permission.can-form`
   (P14) overlaps the finished can-ability topic: keep it to he/she + no -s and no
   "to" after can (rule 14: state the rule once). Rule 14 also has notes for
   that-those-far, adjective-after-be and since-for: follow them.

3. **Log to `grammar-run/PROGRESS-path-fill.md`, NOT PROGRESS.md.** Create it with
   the same header row as PROGRESS.md. Claude folds it into PROGRESS.md at merge.

4. **Branch rules.** Work only on this branch (`grammar-path-fill-base44`). **Never
   merge, never publish, never sync from main.** Claude reviews and merges. Touch only
   the files HANDOFF §0.3 allows. No entities, no database rows, no app code, and
   not `deepmode-run/`.

5. **Pace.** 5 topics per turn, then stop and report (HANDOFF §4). Checkpoint after
   every topic. `npm run build` and `npm run lint` at the end of every turn (the one
   lint error in src/pages/SkillHub.jsx was already on main: leave it, just note it).
   Before logging each topic run `node grammar-run/check_slot_agreement.mjs <key>` and
   `node grammar-run/list_multislot.mjs <key>` and read every multi-slot line as a
   worst pairing (rules 12-13).

6. **Content notes from the last audit (Claude, Nov 13).**
   - No army, war, police or weapons, even in passing ("serving in the army" was removed).
   - No factual claims about countries or school systems that could be wrong.
   - A filler must make sense with the fixed words around it ("My father fixed the
     windows" does not fit "our classroom").
   - These topics are stops on a path that learners walk in order: keep the
     sentences about a learner's own life in Uzbekistan, and make CREATE and EXPRESS
     prompts invite them to talk about themselves.

## Lessons from the audit of P1-P5 (read before each turn)
- A {name} slot must never contain a name that is already printed in the same sentence ("Aziz needs a pen. Can you give him one, Aziz?").
- A slot for the SUBJECT or OWNER must fit every value of the other slot ("Our school is proud of its old market" does not work).
- Read each multi-slot line as its worst pairing before you call a topic done: `node grammar-run/list_multislot.mjs <key>`.
- A pronoun in the sentence must agree with every slot value ("A tall boy is waiting for their friend"; "Mr Karimov ... stays at home with us").
- The second sentence must still be true for every slot value (a cat that is "very active" cannot "sit by the window").
