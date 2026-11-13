# Speaking Pack, batch 2: brief for the Base44 AI (2026-11-13)

Tee wants the grammar map to help learners **speak and communicate freely**, so two
"speaking pack" batches jump the worklist queue. They run in parallel:

- **Batch 1** (Claude, on branch `grammar-speak-1-claude`): want/would like/enjoy,
  can (4 topics), let's, and/but/or, because, so, when, should, have to.
- **Batch 2** (you, on THIS branch `grammar-speak-2-base44`): the 14 topics below.

## Your rule set
`grammar-run/HANDOFF.md` is still your full rule set (read all of it first, plus
`tools/grammar-practice/authored/continuous-negative.mjs` and one recent topic such as
`tools/grammar-practice/authored/tenses.past.interrupted-action.mjs`). Only these
points change:

1. **Topic list**: write exactly these, in this order. Ignore worklist order.

| # | topic key | level |
|---|---|---|
| 1 | comparison.comparative.er-comparative | A1 |
| 2 | comparison.comparative.more-comparative | A2 |
| 3 | comparison.superlative.est-superlative | A2 |
| 4 | comparison.equality.as-as | A2 |
| 5 | adj-adv.frequency.adverb-position | A1 |
| 6 | adj-adv.frequency.always | A1 |
| 7 | adj-adv.frequency.never | A1 |
| 8 | adj-adv.frequency.rarely | A1 |
| 9 | sentence-structure.existential.there-was-were | A2 |
| 10 | tenses.used-to.used-to-state | B1 |
| 11 | conditionals-wishes.zero-first.first-if-clause | A2 |
| 12 | conditionals-wishes.zero-first.first-will | A2 |
| 13 | tenses.future.future-continuous | B1 |
| 14 | tenses.future.arrangement-continuous | B1 |

   Use the level in the WORKLIST row for each topic (the table above copies it).
   Tee has approved the B1 topics in this list early.

2. **Triage still applies (HANDOFF §2).** The frequency topics (#5–8) and the
   first-conditional pair (#11–12) are the most likely to overlap. Before writing
   each one, read its placement items and decide: can it carry 20 *different* choose
   sentences that all test its own point, without repeating a sibling? If not, log it
   `needs Tee` with a merge/skip suggestion and move on. Keep the siblings clearly
   apart (e.g. first-if-clause tests the present tense in the if-clause, so "If it
   will rain" is the trap; first-will tests will in the result clause).
   Rule 14 has a note for `rarely`: follow it.

3. **Log to `grammar-run/PROGRESS-speak-2.md`, NOT PROGRESS.md.** Create it with the
   same header row as PROGRESS.md. (Claude's branch writes PROGRESS.md; separate logs
   stop the two branches from clashing at merge time. Claude folds them together.)

4. **Branch rules.** Work only on this branch. **Never merge the branch, never
   publish, never sync from main.** Claude handles the merge after reviewing your
   work. Don't touch `deepmode-run/`, entities, database rows, or any app code
   outside the files HANDOFF §0.3 allows.

5. **Pace.** 5 topics per turn, then stop and report (HANDOFF §4 format). Checkpoint
   after every topic. `npm run build` and `npm run lint` at the end of every turn.
   Before logging each topic: `node grammar-run/check_slot_agreement.mjs <key>` and
   `node grammar-run/list_multislot.mjs <key>`, and read every multi-slot line as a
   worst pairing (rules 12–13).

6. **Speaking focus.** These topics exist so learners can talk about themselves:
   compare things they know, describe their habits, tell stories about the past,
   talk about plans. Prefer sentences a learner could actually say about their own
   life in Uzbekistan (study, family, food, city, phone, sport, travel, work).
   CREATE and EXPRESS prompts should invite them to talk about themselves.
