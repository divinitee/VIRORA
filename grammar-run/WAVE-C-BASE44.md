# Wave C (B1): brief for the Base44 AI (Tee, 20 Nov 2026)

Tee's order: full steam ahead. The A1-A2 path is finished and merged (141 topics on main). Wave C is the **80 B1 topics** in grammar-run/WORKLIST.tsv (wave column `C`, status `todo`). It runs in two lanes, split by domain so sibling topics stay together:

- **Your lane** (this branch, `grammar-wave-c-base44`): the 43 topics listed below.
- **Claude's lane** (branch `grammar-wave-c-claude`): tenses, comparison, modals, conditionals-wishes, passive-causative, reported-speech. **Never write, edit or run any topic in those six domains.**

B1 topics are not on the learner path yet (the path is A1-A2). They appear on the Free map and in Coach. Claude is drafting a B1 course separately: you only write practice banks.

## How to work (every turn, same routine)
1. Read grammar-run/HANDOFF.md (the full rule set), grammar-run/PATH-FILL.md (its "Lessons from the audit" and point 6 content notes) and this file. Read `tools/grammar-practice/authored/continuous-negative.mjs` once, and one recent topic such as `tools/grammar-practice/authored/pronouns.indefinite.someone-anyone.mjs`.
2. Open grammar-run/PROGRESS-wave-c-base44.md and find the last topic with a row. Continue with the NEXT topic in the list below. Never redo a topic that has a `done` row. If an authored file exists for a topic with no row yet (a turn stopped mid-topic, e.g. C10 basic-tag and C11 although-despite on 20 Nov), finish that one first: run, audit, log.
3. Write **3 or 4 topics per turn** (update 20 Nov: two turns ran out of room after 6 and 3 topics; stop early, the log carries on next turn), one at a time: triage (placement items: `grep -n 't: "<topic>"' src/lib/adaptiveGrammar/bank/*.js`) → authored file → `bash grammar-run/run_topic.sh <key>` → read the review sheet → `node grammar-run/list_multislot.mjs <key>` and read every line as its worst pairing → `node grammar-run/check_slot_agreement.mjs <key>` → dump the choose options and hunt for a second right answer → fix → one row in PROGRESS-wave-c-base44.md → checkpoint.
4. End of turn: `npm run build` and `npm run lint`, then stop and report which topic comes next.

Tee or Claude restarts you with: "Continue wave C: read grammar-run/WAVE-C-BASE44.md and carry on from where the log stops."

## Your list, in order (level B1 for every topic)
| # | topic key | wl # |
|---|---|---|
| C1 | nouns-articles.articles.the-second-mention | 152 |
| C2 | nouns-articles.articles.zero-article-general | 153 |
| C3 | nouns-articles.plurals-agreement.each-every-singular | 154 |
| C4 | nouns-articles.plurals-agreement.there-agreement | 155 |
| C5 | nouns-articles.quantifiers.both-either-neither | 156 |
| C6 | questions-negation.wh-questions.question-preposition | 157 |
| C7 | questions-negation.negation.no-vs-not | 158 |
| C8 | questions-negation.indirect-questions.embedded-if-whether | 159 |
| C9 | questions-negation.indirect-questions.embedded-order | 160 |
| C10 | questions-negation.tag-questions.basic-tag | 161 |
| C11 | sentence-structure.conjunctions.although-despite | 162 |
| C12 | sentence-structure.word-order.indirect-object-to | 163 |
| C13 | sentence-structure.relative-clauses.object-relative-omission | 164 |
| C14 | sentence-structure.relative-clauses.which-vs-what | 165 |
| C15 | sentence-structure.relative-clauses.whose | 166 |
| C16 | sentence-structure.clause-linkers.purpose-so-that | 167 |
| C17 | pronouns.personal.dummy-it | 168 |
| C18 | pronouns.substitution.another-other | 169 |
| C19 | pronouns.substitution.so-neither | 170 |
| C20 | pronouns.substitution.the-other-others | 171 |
| C21 | pronouns.reflexive.no-reflexive-after-feel | 172 |
| C22 | pronouns.reflexive.reciprocal | 173 |
| C23 | pronouns.reflexive.reflexive-object | 174 |
| C24 | verb-patterns.gerund-infinitive.avoid-gerund | 175 |
| C25 | verb-patterns.gerund-infinitive.get-used-to | 176 |
| C26 | verb-patterns.gerund-infinitive.look-forward-to | 177 |
| C27 | verb-patterns.object-infinitive.want-object-infinitive | 178 |
| C28 | verb-patterns.meaning-change-verbs.remember-gerund | 179 |
| C29 | verb-patterns.meaning-change-verbs.remember-infinitive | 180 |
| C30 | verb-patterns.meaning-change-verbs.stop-contrast | 181 |
| C31 | verb-patterns.meaning-change-verbs.stop-gerund | 182 |
| C32 | verb-patterns.meaning-change-verbs.stop-infinitive | 183 |
| C33 | adj-adv.adjective-form.ed-vs-ing | 184 |
| C34 | adj-adv.adverb-form.adverb-vs-adjective-sense | 185 |
| C35 | adj-adv.intensifiers.too-enough | 186 |
| C36 | adj-adv.order-position.adverb-of-manner-position | 187 |
| C37 | prep-phrasal.time.by-until | 203 |
| C38 | prep-phrasal.time.during-while | 204 |
| C39 | prep-phrasal.movement.across-through-along | 205 |
| C40 | prep-phrasal.dependent-prepositions.preposition-gerund | 206 |
| C41 | prep-phrasal.dependent-prepositions.verb-preposition | 207 |
| C42 | prep-phrasal.phrasal-verbs.inseparable | 208 |
| C43 | prep-phrasal.phrasal-verbs.pronoun-separation | 209 |

Suggested turns: T1 = C1-C7, T2 = C8-C14, T3 = C15-C21, T4 = C22-C28, T5 = C29-C35, T6 = C36-C43.

## Triage: sibling groups to watch (HANDOFF §2)
Each topic tests its OWN point. If two siblings would test the same thing, keep each to its own key and say how in the notes; if a topic can't carry 20 different choose sentences of its own, log it `needs Tee` with a merge/skip suggestion and move on.
- **remember-gerund / remember-infinitive**: remember + -ing = a memory of the past; remember + to = don't forget a future task. Each topic keys only its own form. Never mix forget into the keys.
- **stop-gerund / stop-infinitive / stop-contrast**: stop + -ing = quit the action; stop + to = stop one thing in order to do another. stop-gerund keys only -ing, stop-infinitive keys only to-verb, stop-contrast mixes both (about half each) with the meaning made clear by the second clause.
- **another-other / the-other-others**: another = one more (singular, not specific); other + plural; the other = the last one of two; the others = the rest. Split the keys so the two topics don't overlap.
- **reflexive-object / reciprocal / no-reflexive-after-feel**: myself vs me; each other vs themselves; no reflexive after feel / relax / meet / concentrate (feel myself is the Russian calque "чувствую себя").
- **embedded-if-whether / embedded-order**: if/whether for yes/no questions vs statement order after "Can you tell me where … ?". Keep each to its own point.
- **C40 prep-phrasal.dependent-prepositions.preposition-gerund**: main already has `verb-patterns.gerund-infinitive.preposition-gerund` (A2). Triage it first: if it would repeat that topic, log `needs Tee` (suggest: merge or B1-only angles such as "look forward to / be used to / instead of + -ing") and move on.
- **C12 indirect-object-to**: main has `sentence-structure.word-order.double-object` (A2). Keep C12 to the "to / for" pattern (give it TO him, buy it FOR her, explain TO me — never "explain me").
- **get-used-to / look-forward-to**: "to" is a preposition here, so -ing follows. Never offer "used to + base verb" as wrong when it is the past-habit meaning; the context must make "get used to" clear.

## Rules that never change
- Never edit the gates or tests (ingest.mjs, schema.js, lint-topic.mjs, *-tests.mjs). Never `--allow-legacy`. Never touch deepmode-run/, app code under src/pages, src/components, src/hooks, entities or database rows.
- **Never merge, publish or sync this branch.** Claude audits between your turns and merges at the end. If a file you wrote has changed since your last turn, that is Claude's audit fix: keep it.
- Log to `grammar-run/PROGRESS-wave-c-base44.md` only (not PROGRESS.md).
- Level is B1 for every topic. If a level looks wrong, don't change it: start the row's notes with "LEVEL? <suggestion and why>".

## Lessons from Claude's audits (keep adding to this list)
- A {name} slot must never contain a name already printed in the same sentence, or used by another slot ("It's for Aziz's birthday, Aziz").
- A slot for the subject or owner must fit every value of the other slot; a pronoun must agree with every slot value.
- Never split a job and its object across two slots ("a nanny looks after old people", "a bus driver drives a taxi"). Fix the job, slot the free parts.
- A typed key must accept every correct alternative: anybody / somebody / no one forms, "has got" next to "has", the other relative pronoun (that / which). Add them to the item's `acceptable` array.
- If a typed verb has no tense cue, both present and past are right: put a time word in the sentence, or say the tense in `instr`.
- Never offer as "wrong" something natives say ("This poem is written by …" for authorship, "ask anyone", "I can't find someone to help"). If in doubt, change the sentence so only the key fits.
- No army, war, police or weapons. No factual claims about real countries or cities ("many tourists love Fergana", "many languages are spoken in Namangan"). No uncountable noun after "a" ("a bread").
- Every slot combination must make sense: run list_multislot and read every line as its worst pairing.
- "Students in my group are friendly" / "Bread from this bakery is fresh" are fine English: a plural or uncountable noun with a phrase after it does not force "the". When "the" is the key, make it one specific group or thing (the students we met, the bread you bought this morning).
- "Neither of them are …" is said too: when "both" is the key, add a phrase that rules out neither ("just like our mother").
