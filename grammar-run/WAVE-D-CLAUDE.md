# Wave D (B2, 92 topics): Claude's handoff and log (started 23 Nov 2026)

Tee, 21 Nov: "Wave D = B2 only (92 topics). C1 and C2 (72 topics) are on hold until I say so." Don't publish.
Branch `grammar-wave-d` (id 6b03407d48245bc47538782b), cut from main at f5ea3012 (B1 course + approved gates merged).
One lane for now (Claude). A Base44 AI lane is possible if Tee wants it (it cost heavy audits in wave C and Claude took it over at C25).

## Where we are
Next topic: D4 tenses.future.about-to (wl 226), then the WORKLIST B2 order (D5 future-in-the-past … D92 reporting suggest-pattern).
New authored files use grammar-run/wave-d/skeleton.mjs (each line carries its own why; see tenses.present.changing-trend.mjs).
Echo errors from ingest show the item index 0-based: [40] = transform 1.

## Routine per topic
triage (`grep -n 't: "<topic>"' src/lib/adaptiveGrammar/bank/*.js`) → authored file `tools/grammar-practice/authored/<key>.mjs` (copy the shape of a recent B1 file, e.g. reported-speech.statements.backshift-will) → `bash grammar-run/run_topic.sh <key>` → `node grammar-run/tools-claude/variety.mjs <key>` (aim 0 shared whys, 0 thin lines) → `node grammar-run/tools-claude/whyslot.mjs <key>` (no why may name a slot word) → `node grammar-run/list_multislot.mjs <key>` worst pairings → row below → checkpoint.

Write it right the first time (lessons from waves C and the B1 variety pass):
- Every choose/build/transform line has 2 slots of 4+ values; every why is item-specific, 5+ words, names no slot word, and no two whys are the same.
- Echo rule: a typed string key may not repeat a printed word; use an array key with two blanks when it would.
- 'd short forms and two-part alternatives are now automatic/allowed (gates of 21 Nov): put whole alternative answers for array keys in `acceptable` as arrays.
- Name clash is a lint FAIL. Listener names (never printed): Dilnoza, Sardor, Nodira, Akmal, Gulnora, Jamshid, Feruza, Otabek, Zarina, Sherzod, Malika, Ulugbek.
- No army, war, police, weapons, crime, romance, brands or religion; no factual claims about countries; never offer as wrong what natives say.

## Sibling triage (decide before writing)
- verb-patterns.gerund-infinitive.suggest-pattern vs reported-speech.reporting-verbs.suggest-pattern: VP = speaker's own suggestion ("I suggest going / that we go", never "suggest you to"); RS = reporting what someone suggested (past, "She suggested that we leave", backshift).
- modals.past-modals.neednt-have vs didnt-need-vs-neednt-have: the first keys only needn't have + pp; the second contrasts the two with context deciding (done or not done).
- whom-formal (questions: "To whom …?") vs pronouns.personal.whom-object (focus: object pronoun after than, formal) vs prep-phrasal.stranding.fronted-preposition / relative-preposition vs sentence-structure.relative-clauses.preposition-which: keep each to its focus line in WORKLIST.
- adj-adv.intensifiers.so-such vs sentence-structure.clause-linkers.result-so-that: so-such = so + adj / such + (adj) noun; result-so-that = the that-clause of result.
- regret-formal (regret to inform) vs regret-past (regret + -ing); future-perfect vs future-perfect-continuous; third-result vs mixed.past-condition-present-result; the three wish topics; despite-ing (B2) must not repeat although-despite (B1).

## Log
| # | wl | topic | status | notes |
|---|---|---|---|---|
| D1 | 10 | tenses.present.changing-trend | done | Present continuous for change in progress. Choose distractors are form errors / past simple only (present simple "people shop online these days" is natural, so never offered as wrong); build/transform instructions ask for the continuous. 5 double-comparative array keys. Lint 0/0, variety 0/0/0. |
| D2 | 224 | tenses.past.past-perfect-continuous | done | had been + -ing up to a past moment / for a past result. "had + pp" is also English, so never a distractor (distractors: has been -ing, had -ing, had been + base); instructions ask for had been + -ing. 5 questions with array keys. practicing accepted. Lint 0/0, variety 0/0/0. |
| D3 | 225 | tenses.past.past-simple-vs-continuous | done | Background (was/were -ing) vs short event (past simple), with a clue that the background was unfinished ("so I joined him"). Choose distractors are form errors only (never "had cooked"). Build/transform: two-part keys [background, event]; spilt accepted. Lint 0/0, variety 0/0/0. |
