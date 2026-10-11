# VIRORA Coach (VT-40): next task (as of 11 Oct 2026)

## Where it stands

- **Live:** checkpoint `6ac9fa347543691cb2d058da` (git `5cef10b`), published **10 Oct 09:47 UTC**. The publish was approved (confirmed 10 Oct).
- **Post-publish checks passed** (10–11 Oct, read-only):
  - coachApi and progressApi logs show only `POST → 200`, no `coach applyRound failed`;
  - ts-fsrs loads (LearnerItem rows have stability and due dates);
  - the first `PlanLog` / `ItemEvidence` / `LearnerItem` rows are well-formed;
  - only "score" lacks a Russian translation, and it is never planned.
- **Live users so far:** `xewap57317@18lover.com` (trial, test account, goal grammar_basics) and `javohirmetinov21@gmail.com` (free, vocabulary goal, a real learner since 10 Oct 10:35 UTC).
- **Fix bundle, not yet published:** git `d7cb56f`, `6b6daa8`, `ab4fab6` on branch `claude/affectionate-fermat-jujmpa`. The GitHub repo has been renamed to `divinitee/VIRORA`.
  - The same 6 files are applied to **Base44 main**, verified byte-identical (all 887 tracked files fingerprint-equal).
  - **No checkpoint yet:** the session's permission check refused `create_checkpoint`. Tee needs to create it in the Base44 editor (or allow it).
  - Until then, a builder Restore/Revert would discard these edits. Git keeps them either way.
  - Publishing "current version" would now include this bundle, so publish only after GPT/Tee approve it.
- Deadline: 21 Oct.

### What the bundle changes

1. **Keep going** is offered only when the plan it would start has items. `startContinuation` on an empty plan returns 409 `nothing_to_continue` without a snapshot, so the day's continuation is not used up. Before this, the trial tester would have used theirs on a "Nothing urgent today" screen.
2. **Word-check distractors** come from the planned words' CEFR levels, using only id/english/uzbek/russian. The old pool was the first 60 words by English, all "a…" words, which gave the answer away on "Which English word?" (~43% of practice questions; now at chance).
   - Options are deduped per sense, without "(qualifiers)", punctuation, case or ё/е. A word that shares any meaning with the target is never a wrong option (confident/certain, contact/connection, bill/account).
   - Distractors in the other script are never offered (ru "на CD/DVD/видео", uz "karbon izи").
3. **Onboarding goal names** are translated for uz/ru. English keeps the server's objective text.
4. **Minutes:** the plan-screen Vira greeting uses the planned minutes, with ru/en plural agreement, and onboarding follows the minutes the learner picks.
5. **Done screen:** says "Keep going … or come back tomorrow" when Keep going is offered.
6. **Upsell:** "Velvet gives you a second session" is shown to free learners only, since a trial already has the second session.

### Checks

- core 142 (3 new tests fail on the old engine); ui 56 (5 new fail on older word checks).
- skill-intelligence 34/102/50; Deno coach-boundary 21, progressapi 21; eslint clean on the changed files; build OK.
- ui-harness click-through 15, corrections 28; scratch ru flow 13/13. Its only flaky check is English grammar-explanation text.
- Adversarial review (3 lenses) found the server change clean: no mismatch between "available" and what startContinuation does over 40 random seeds and both live testers.
- Live simulation over all 2282 words, ru+uz, probe/practice/remediation, 20 seeds: 0 unplayable, 0 duplicate options, 0 second right answers.

## Next task (in order)

1. **Tee:** create a Base44 checkpoint of main (it already has the bundle), then get GPT/Tee approval to publish it.
2. Publish it, then re-check logs and rows. The checks are the same as on 10 Oct, plus: no `nothing_to_continue` loops, and the distractor pool loads.
3. **Real-account play-test:** `claude/vira/PLAYTEST-CHECKLIST.md`, including the full Russian run.
4. **Decision needed before 21 Oct: word time estimates (HIGH).** The planner charges every word 2–5 min (`DEPTHS`, `coachPlan.js:17-22`), but the client asks 1–3 questions per word (`WORD_QUESTIONS`, `wordCheck.js:7`). The free learner's 10-min vocabulary session was finished in **44 seconds**, with no Keep going on free. One correct guess also schedules 8 days.
   - Lowest-risk option: a `WORD_DEPTHS` table with integer minutes; the client uses the planned `questions` for words too, with at least 3 questions so one guess can't rate "easy"; bump `PLAN_VERSION`; add a test that client counts match planned counts.
   - Tee picks the numbers.
5. **Data fixes**, for Tee to approve (none were made):
   - "score" needs a Russian translation, e.g. "счёт, очко; забить (гол)". This lifts its Coach exclusion and fixes vocab games, which show "score" with an **empty** correct option to ru learners (`vocabGameUtils.js:19-24`).
   - Uzbek rows with stray Cyrillic: carbon footprint "karbon izи" → "karbon izi"; fireworks "fейерверk" → "feyerverk"; shed "sarоy; to'kmoq" → "saroy; to'kmoq".

## Deferred (recorded, not fixed)

- **No goal switcher after onboarding**, although trial/Velvet policy allows switching (`Coach.jsx:114`, `goal_switch_locked` unused). A tester on grammar_basics can never get word checks.
- **Grammar practice explanations and instructions are English-only** in every language: 340 items, no localised fields.
- **ItemEvidence FSRS audit fields** (`moved_fsrs`, `rating`, `due_before`, `stability_*`) are never written, and `duration_ms` is never captured, so minute calibration doesn't exist. No reader depends on them, and they can be rebuilt exactly from evidence later. Writing them conflicts with the "append-only" rule (an earlier-timed row can take the day's move), so it needs a reconcile-after-insert design. A prototype diff exists in the 11 Oct session scratchpad.
- **Short grammar-only plans.** A 20-min grammar_basics plan holds 2 probes (4 min) because of prerequisites and the 5 live topics. The greeting is now honest about it; the content gap remains.
- **Pre-existing, self-healing:** concurrent first-time submissions on one item can create a duplicate or stale LearnerItem until the next recompute. Admin `explain` rebuilds from game ledgers, so it shows no coach FSRS card.
- **Small copy issues:** "Ten out of ten" copy on 5-question rounds; grammar topic names are English slugs; the Learner Map is not content-gated (latent for "score").
- **Uzbek cognates:** 26 Uzbek words are spelled like the English ("club", "bank"), so the right option repeats the prompt. Harmless, pre-existing.
- **ui-harness:** imports a bare `playwright` that isn't in package.json; it needs `node_modules/playwright` linked to the global install.

## Prompt for the next Claude session

Resume VIRORA Coach (VT-40). Read `claude/vira/COACH-NEXT-TASK.md` and `claude/vira/PLAYTEST-CHECKLIST.md` on branch `claude/affectionate-fermat-jujmpa`. [Paste the publish approval for the fix bundle and the decision on word time estimates.] Check that Base44 main still matches git `ab4fab6` (app files), guide me through publish and the play-test, and fix anything it finds. Don't touch LIFE OS.
