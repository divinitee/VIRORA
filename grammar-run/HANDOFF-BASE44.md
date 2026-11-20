# Handoff to the Base44 AI: you carry the rest of the path fill (Tee, 16 Nov 2026)

Claude is out of usage for now. Tee's order: **Base44 AI writes everything that is left.** This file overrides the lane split in PATH-FILL.md ("Two lanes from 16 Nov") where they differ. Everything else in grammar-run/HANDOFF.md and grammar-run/PATH-FILL.md still applies.

## How to work (every turn, same routine)
1. Read grammar-run/HANDOFF.md, grammar-run/PATH-FILL.md (with its audit lessons) and this file.
2. Open grammar-run/PROGRESS-path-fill.md and find the last topic with a row. Continue with the NEXT topic in the list below. Never redo a topic that has a `done` row.
3. Write as many topics as fit in the turn (aim for 5 or 6), one at a time: authored file → `bash grammar-run/run_topic.sh <key>` → read the review sheet → `node grammar-run/list_multislot.mjs <key>` and read every line as its worst pairing → fix → one row in PROGRESS-path-fill.md → checkpoint.
4. End of turn: `npm run build` and `npm run lint`, then stop and report which topic comes next.
Tee restarts you with: "Continue the grammar path fill: read grammar-run/HANDOFF-BASE44.md and carry on from where the log stops."

## The list, in order
Already done on this branch: P16-P21 (and whatever turn 5 has logged).
1. P22 verb-patterns.have-got.have-got-question
2. P23 verb-patterns.have-got.have-got-negative
3. P24 pronouns.possessive.possessive-pronouns (**level A2**, Tee's re-level; the lint FLAG is expected)
4. P25 prep-phrasal.place.in-container
5. P26 prep-phrasal.place.on-surface
6. P27 prep-phrasal.place.between
7. P28 sentence-structure.word-order.place-time-order
8. P29 adj-adv.adjective-form.adjective-after-be
9. P30 prep-phrasal.place.in-area
10. P38 modals.ability-permission.could-past-ability
11. P39 modals.deduction.might-possibility
12. P40 prep-phrasal.movement.go-home
13. P41 prep-phrasal.movement.arrive-at-in
14. P42 prep-phrasal.movement.to-vs-in
15. P44 pronouns.personal.subject-object-contrast
16. P52 sentence-structure.word-order.double-object
17. P45 pronouns.indefinite.someone-anyone
18. P46 pronouns.indefinite.something-offer
19. P47 pronouns.indefinite.nothing-anything
20. P48 pronouns.indefinite.indefinite-agreement
21. P49 sentence-structure.relative-clauses.who-people
22. P50 sentence-structure.relative-clauses.that-which-things
23. P51 sentence-structure.relative-clauses.where-place
24. P57 passive-causative.simple-passive.present-passive
25. P58 passive-causative.simple-passive.past-passive
26. P59 passive-causative.simple-passive.active-to-passive

## Do NOT write or touch
**Update 17 Nov: Claude is back.** Your list now ENDS at P59 (item 26). Claude writes P43 decide-infinitive, P53 since-for, P54 preposition-gerund, P55 interested-in and P56 zero-general-truth on his own branch: do not write them. Claude may fix sentences in your finished topics between your turns: if a file you wrote has changed, keep the change.

P31 double-comparative-error, P32 less-comparative, P33 irregular-superlative, P34 ly-adverb, P35 irregular-adverb, P36 one-ones, P37 adjective-preposition: **Claude finished these** on branch `grammar-path-fill-claude`. Also leave `comparison.comparative.er-comparative` alone (Claude re-levelled it to A2 there). They reach main when Claude merges.

## Notes for the five topics that were Claude's
- **P43 decide-infinitive**: decide + to-infinitive. Vary decide / decided / has decided / can't decide. A typed key may not repeat the bracket word, so use two blanks: `______ ______ (stay)` → ["to", "stay"]. Negative is "decided not to go"; never offer "to not go" as a wrong answer (natives say it).
- **P53 since-for**: follow rule 14: test the TIME meaning only (since + start point, for + length). Every sentence is already in the present perfect; never make the learner choose a tense. Wrong answers: from, during, ago, in.
- **P54 preposition-gerund**: -ing after a preposition (before going, after eating, without saying, thank you for helping, good at drawing). Never use "interested to" as a wrong answer (it is correct English). No typed key with a British/American spelling split (travelling).
- **P55 interested-in**: narrow topic, so use three angles in choose: in vs at / on / for / about; "interested in" vs "interesting in / interest in"; and the question "What are you interested ______?". In build and transform use two blanks: `______ ______ (interest)` → ["interested", "in"], so the stage is not twenty "in"s.
- **P56 zero-general-truth**: present simple in both clauses. **Never offer "will + verb" as a wrong answer in the RESULT clause** ("If you heat ice, it will melt" is correct English). Test will in the IF clause instead ("If you will heat ..." is wrong), and use past / -ing / missing -s as the other wrong answers.

## Two fixes from Claude's audit of P16-P21 (apply them, re-run the topic)
- `modals.obligation.mustnt-vs-dont-have-to`, build: "{name} ______ play football today. He hurt his {part} yesterday." Both mustn't and doesn't have to can be defended. Make it "He hurt his {part}, and the doctor says no." so only mustn't fits.
- `verb-patterns.have-got.have-has`, transform: "Lola has a new {thing}. || Lola and {friend} ______ a new {thing}." Two girls sharing one dress or phone reads oddly. Use things two people share: teacher, puppy, game, neighbour.
P16, P17, P19, P20: nothing to change.

## Rules that never change
- Never edit the gates or tests (ingest.mjs, schema.js, lint-topic.mjs, *-tests.mjs). Never `--allow-legacy`. Never touch deepmode-run/ or app code under src/pages, src/components, src/hooks.
- Never merge, publish or sync this branch. Claude audits and merges when he is back.
- Levels: use the level in the PATH-FILL table (P24 is A2). If a level looks wrong to you, do not change it: start the row's notes with "LEVEL? <suggestion and why>". Tee decides.
- If a topic cannot carry 20 different choose sentences of its own, log it `needs Tee` and move on.
