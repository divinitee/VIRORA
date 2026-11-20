# Wave C status and handoff (Claude, 20 Nov 2026)

Tee: "full steam ahead". Read grammar-run/HANDOFF-CLAUDE-2026-11-20.md (main) first; this file only adds the wave C state.

## Done today on main (not published)
- Base44 path-fill branch audited (8 fixes) and merged: main = 141 topics, every A1-A2 course topic playable.
- Tee's level form (artifact "VIRORA grammar levels", db collection `submissions`): 10 path labels changed and merged (see PROGRESS.md note 20 Nov). Tee also chose "path AND placement test": NOT done, because placement item ids carry the level (agp.….A2.001) and saved placement answers point at them. Waiting for Tee: change anyway, or keep ids and change only the shown level.

## Wave C (80 B1 topics), two lanes, both cut from main at cbcaf6e
- **Claude lane**: branch `grammar-wave-c-claude` (id 6b001163ad45c553accd25f4), log grammar-run/PROGRESS-wave-c-claude.md. Domains: tenses, comparison, modals, conditionals-wishes, passive-causative, reported-speech (37 topics).
  - Done (12): tenses all 8 (didnt-use-to, timetable-simple, past-perfect-sequence, past-perfect-experience, since-clause, unfinished-time, continuous-present-result, perfect-vs-past), comparison fewer-less, much-comparative, slightly-comparative.
  - Next, in order: comparison.equality.not-as-as, comparison.parallel-comparison.progressive-comparative, comparison.parallel-comparison.the-more-the-more; modals (9: modal-passive*, cant-present, might-present, must-present, be-able-to, have-to-past, might-have, must-have, should-have); conditionals (3: if-i-were-you, second-if-clause, unless); passive (4: agent-by, no-passive-intransitive, present-perfect-passive, modal-be-pp*); reported speech (7). *modals.obligation.modal-passive and passive-causative.modal-passive.modal-be-pp are siblings: triage them together.
- **Base44 lane**: branch `grammar-wave-c-base44` (id 6b00115831f5782db9b021f6), brief grammar-run/WAVE-C-BASE44.md, log grammar-run/PROGRESS-wave-c-base44.md. 43 topics (nouns-articles, questions-negation, sentence-structure, pronouns, verb-patterns, adj-adv, prep-phrasal). C1-C9 done; Claude audited C1-C9 (2 fixes, applied). Turns run out of room after 3-6 topics, so the brief now says 3-4 per turn. Restart line: "Continue wave C: read grammar-run/WAVE-C-BASE44.md and carry on from where the log stops." Audit its new rows between turns (/tmp/da.mjs pattern: dump choose/build/transform with slots; read worst pairings).

## Lessons from writing wave C (Claude lane)
- Give EVERY choose/build/transform line two slots of four from the start (the gate floor is 200 per stage; one-slot lines cost a re-run). /tmp/addname.py (in the sandbox) appends ", {name}" to one-slot lines; it is a quick fix, not a substitute for a real second slot.
- add_row.mjs puts the first row at line 0 when the table has no rows yet: move it under the header by hand.
- The lint now flags "rises" as a spelling split (false positive): pick another verb.
- A bracket cue after a full stop ("… since 2019. (they / get married)") FLAGs: put the cue in the source as a sentence.
- Typed keys must accept every right answer: continuous forms (has been working), learnt, anybody / no one, whether.

## At the end of wave C
Merge lane 1, then lane 2, each with the reset-generated-files procedure (HANDOFF-CLAUDE-2026-11-20.md §4.2: reset manifest.js, grammarKeys.js, WORKLIST.tsv to the branch base cbcaf6e, sync-from-main, re-run one topic, check counts, fold the log into PROGRESS.md, checks, merge). Then update taskboard VT-12.
