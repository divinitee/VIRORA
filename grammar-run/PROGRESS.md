# Grammar production log

Rules: grammar-run/HANDOFF.md. One row per topic, in worklist order.

| # | topic | level | lint FAIL→FLAG | variants c/b/t | status | notes |
|---|---|---|---|---|---|---|
| 1 | tenses.present.continuous-negative | A1 | – | 320/320/240 | live | reference topic (hand-authored) |
| 2 | tenses.present.continuous-now | A1 | – | 320/320/240 | live | hand-authored |
| 3 | tenses.present.simple-negative | A1 | – | 320/320/240 | live | GPT pv 2.1 |
| 4 | tenses.present.simple-routine | A2 | – | 320/320/72 | live | GPT pv 2.0; level A2 kept as shipped (placement says A1) |
| 5 | tenses.present.third-person-s | A1 | 0→0 | 320/320/240 | written, NOT ingested | rebuild authored (pilot, Oct 20). Old thin bank still live: composition test hard-codes the thin pool (see gate question 1) |
| 6 | tenses.present.general-truth | A2 | 0→0 | 320/320/240 | in preview | pilot. "rises" swapped for "comes up" (spelling-split false positive) |
| 7 | tenses.present.simple-vs-continuous | A2 | 0→0 | 320/308/288 | in preview | pilot |
| 8 | tenses.present.stative-verbs | A2 | 0→0 | 320/320/240 | in preview | pilot. Claude audit fixed 2 slot collisions (bag/too slow, radio/videos); new rule 12 |
| 9 | tenses.present.temporary-situation | A2 | 0→0 | 320/320/228 | in preview | pilot |
| 10 | tenses.present.changing-trend | B2 | – | – | deferred | Tee, Oct 20: skip B2/C2 in wave A for now |
| 11 | (wave A #11, B2/C2) | – | – | – | deferred | Tee, Oct 20: skip B2/C2 in wave A for now |
| 12 | tenses.past.continuous-at-time | A2 | 0→0 | 320/320/240 | done | wave B. Past simple left out of choose distractors (can be right with "at 9") |
| 13 | tenses.past.interrupted-action | A2 | 0→0 | 320/320/240 | done | half background / half interruption blanks; past simple never a background distractor. One 3-slot transform cut to 2 |
| 14 | tenses.past.irregular-past | A2 | 0→0 | 320/320/240 | done | choose verbs all have participle ≠ past; no regularised distractor that is a real word |
| 15 | tenses.past.simple-finished-time | A2 | 2→0 | 320/320/240 | done | lint: "a Uzbek/old song" fillers replaced. No this morning/today markers (could take present perfect) |
| 16 | tenses.past.simple-negative | A2 | 0→0 | 320/296/228 | done | |

| 17 | tenses.perfect.experience-ever | A2 | 0→0 (1 FLAG→0) | 320/320/240 | done | two-blank keys [Have/Has, participle]. "Did you ever...?" left out of distractors (fine in US English). FLAG: 6 builds opened "______ you ever", subjects varied |
| 18 | tenses.perfect.for-since | A2 | 0→0 | 320/320/216 | done | ingest refused 1: build key "for" also printed ("for the team" → "in the team"). "from" only as a distractor before a length of time |
| 19 | tenses.perfect.never-experience | A2 | 0→0 | 320/320/228 | done | "ever" in a positive statement used as the 4th distractor. Filler "mother's's" bug caught by reading, fixed before the run |
| 20 | tenses.perfect.present-result | A2 | 0→0 | 320/308/228 | done | past simple NOT a distractor (fine in US English). Fixed before run: "pond … have frozen" subject type, a 3-slot reply cut to 2. Agreement checker: 1 hit (food + "lots to eat"), fine |
| 21 | tenses.perfect.since-duration | A2 | 1→0 | 320/320/228 | done | lint: "a engineer" → mechanic. Ingest refused: transform under 200 variants (too many one-slot items) → second slots added. Activity-verb keys accept the continuous form |

Wave B turn 2 (Oct 20): rule 13 checker run on all 5 topics (1 hit, fine).

Batch B2 audit (Claude, Oct 20): suites green, keys in sync (19 topics), checker clean. Read all ~250 multi-slot items, no defects. experience-ever teaches have + past participle explicitly (two-blank keys), which the course audit asked for. Approved. New rule 14 (topic scope notes) added for upcoming topics.

Wave B turn 1 (Oct 20): build passes, lint passes, all suites green after each topic, keys in sync (14 topics).

Batch B1 audit (Claude, Oct 20): suites green, keys in sync, build + lint pass. Read every multi-slot item; 2 singular/plural slot bugs fixed and re-run (irregular-past: glasses + "dropped it"; simple-negative: vegetables + "it was"). New rule 13 + grammar-run/check_slot_agreement.mjs. Distractor notes in rows 12–16 are good, keep doing that.

Pilot audit (Claude, Oct 20): all 6 test suites pass, keys in sync (9 topics), lint clean (24 old unused-import errors elsewhere in the app fixed with eslint --fix), build passes. ~220 multi-slot items read by hand; 2 nonsense combinations found and fixed.

## Gate questions for Tee

1. `tools/grammar-practice/composition-tests.mjs` line 77 asserts that 240 choose draws from third-person-s must hit a repeat, i.e. that the bank is thin (≤239 variants). The rebuild has 320, so the test fails for the right reason. Proposed fix: draw `sizes.choose + 40` instead of a fixed 240, which keeps the test's purpose (repeats come back once the pool runs out) for any pool size. Needs Tee's OK because tests are gates.