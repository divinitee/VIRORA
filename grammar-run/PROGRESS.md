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

| 22 | tenses.future.going-to-evidence | A2 | 0→0 | 320/320/276 | done | "will" NOT a distractor (also correct for predictions); distractors are be-form errors only. Ingest refused 15 first time: build/transform sentences printed is/are/to, which the key repeats; rewrote them with has/have/past forms. Checker: 2 hits (clouds/place plural), fine |
| 23 | tenses.future.going-to-plan | A2 | 2→0 | 320/320/240 | done | will and present continuous NOT distractors (both can express plans). Lint: "a evening course" → short course. Ingest refused 2 (paint/have printed in sentence), reworded |
| 24 | tenses.future.will-spontaneous | A2 | 0→0 | 320/320/240 | done | distractors: will to, dropped will (am/are), "going". "am going to" NOT a distractor (sometimes possible). Transform kinds: decide yes / say no (won't) / pick one ("I think I'll") |
| 25 | nouns-articles.articles.a-an | A1 | 0→0 | 320/308/276 | done | Rule 14: every why explains the first SOUND, not the letter; includes an hour (×4), a university (×4), a European (×3), a uniform (×3), a useful, a horse/house vs an hour. Choose frames (There is / What…! / half…hour) make "the" impossible. No sentence prints the word that is the key |
| 26 | nouns-articles.articles.the-shared-context | A1 | 0→0 | 296/296/240 | done | every frame makes a/an impossible (second mention, plural or uncountable); all nouns start with a consonant sound so "an" is always wrong. No build/transform sentence prints "the" |

Wave B turn 3 (Oct 20): rule 14 read; only a-an (#25) is in scope this turn.

Batch B3 audit (Claude, Oct 20): suites green, keys in sync (24 topics), checker hits are fine. Read all ~280 multi-slot items, no defects. a-an covers rule 14 fully (sound rule, an hour / a university / a European). The distractor discipline in the future topics is strong (will and going to are never offered where both are right). Approved.

Wave B turn 2 (Oct 20): rule 13 checker run on all 5 topics (1 hit, fine).

Batch B2 audit (Claude, Oct 20): suites green, keys in sync (19 topics), checker clean. Read all ~250 multi-slot items, no defects. experience-ever teaches have + past participle explicitly (two-blank keys), which the course audit asked for. Approved. New rule 14 (topic scope notes) added for upcoming topics.

Wave B turn 1 (Oct 20): build passes, lint passes, all suites green after each topic, keys in sync (14 topics).

Batch B1 audit (Claude, Oct 20): suites green, keys in sync, build + lint pass. Read every multi-slot item; 2 singular/plural slot bugs fixed and re-run (irregular-past: glasses + "dropped it"; simple-negative: vegetables + "it was"). New rule 13 + grammar-run/check_slot_agreement.mjs. Distractor notes in rows 12–16 are good, keep doing that.

Pilot audit (Claude, Oct 20): all 6 test suites pass, keys in sync (9 topics), lint clean (24 old unused-import errors elsewhere in the app fixed with eslint --fix), build passes. ~220 multi-slot items read by hand; 2 nonsense combinations found and fixed.

## Gate questions for Tee

1. `tools/grammar-practice/composition-tests.mjs` line 77 asserts that 240 choose draws from third-person-s must hit a repeat, i.e. that the bank is thin (≤239 variants). The rebuild has 320, so the test fails for the right reason. Proposed fix: draw `sizes.choose + 40` instead of a fixed 240, which keeps the test's purpose (repeats come back once the pool runs out) for any pool size. Needs Tee's OK because tests are gates.