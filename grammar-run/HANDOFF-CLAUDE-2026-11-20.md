# VIRORA grammar production: handoff to a new Claude chat (2026-11-20)

You are taking over grammar content production for **VIRORA**, an English-learning web app built on **Base44** for Uzbek and Russian speakers. The founder is **Tee**. The previous Claude chat (another account) ran out of room; this file is everything you need. Tee wants it **full steam ahead**.

## 0. Before anything: access
- You need the **Base44 connector** connected to Tee's Base44 account. App id: **`6a40f974860993eff3634df0`**. Sandbox root `/app`. If the Base44 tools are missing, ask Tee to connect Base44 in this chat first.
- Tools you will use: `run_command`, `read_file`, `write_file`, `edit_file`, `create_checkpoint`, `get_app_status`, `edit_base44_app` (runs Base44's own builder AI on its credits; always pass `branchId`), `execute_api` (branches), `query_entities` / `create_entities` / `update_entities` (taskboard).
- Branch API: create `POST /api/apps/{app_id}/branches` body `{"branch_name": "..."}`; merge `POST /api/apps/{app_id}/branches/{branch_id}/merge`; sync `POST .../{branch_id}/sync-from-main`; check `GET .../{branch_id}/sync-status`. Main = omit `branchId`.
- This same text is saved in the sandbox at `grammar-run/HANDOFF-CLAUDE-2026-11-20.md` (on main). The full rule set is `grammar-run/HANDOFF.md`. Read both, plus `grammar-run/PATH-FILL.md` on the Base44 branch (it holds the audit lessons).

## 1. How Tee works
- Fast, casual, direct, short replies, plain words. If he types "RDE" he wants that block format.
- **Never publish.** Tee publishes. **Never edit the gates or tests**: `tools/grammar-practice/ingest.mjs`, `src/lib/grammarPractice/schema.js`, `tools/grammar-practice/lint-topic.mjs`, any `*-tests.mjs`. Never use `--allow-legacy`. **Don't touch `deepmode-run/`.**
- Work on a **branch first, then merge**. Never let two lanes edit the same topic.
- Content generation can go to **Base44's builder AI on its own credits** (Tee's order). Claude briefs, audits and merges.
- Team rule: **log every act on the in-app taskboard** (`Task` entity, page `/taskboard`): who did what (claude / base44 / tee). Relevant tasks: **VT-12.2** (path fill), **VT-54** (one learner path), parent **VT-12**.
- Other chats are working on the same app (Vira mascot, Live Teacher). Only touch grammar files.

## 2. The pipeline (short version; HANDOFF.md is the real rule set)
- One topic = `tools/grammar-practice/authored/<domain>.<branch>.<topic>.mjs` → `bash grammar-run/run_topic.sh <key>` (author → lint → ingest → build-keys → all suites → review sheet `grammar-run/review/<key>.md`).
- 68 items per topic: 20 choose (mcq), 20 build (gap_fill), 15 transform (rewrite), 8 create, 5 express. Two slots × four fillers per item; 200+ variants per stage; a typed key may not repeat a word printed in the sentence; one right answer only.
- Generated files (rebuilt on every run): `src/lib/grammarPractice/manifest.js`, `base44/shared/grammarKeys.js`, `grammar-run/WORKLIST.tsv`. These are what conflict when two branches merge.
- Audit tools: `node grammar-run/list_multislot.mjs <key>` (read every line as its WORST pairing), `node grammar-run/check_slot_agreement.mjs <key>` (over-flags), and dump the choose options to hunt for a second right answer:
  `node -e "import('/app/src/lib/grammarPractice/bank/<key>.js').then(m=>{for(const it of m.default.filter(i=>i.stage==='choose')) console.log(it.prompt,'|',it.options.join('/'),'|',it.options[it.key])})"`
- Checks after any merge: `npm run build`, `npm run lint`, `for f in grading composition schema e2e feedback course path; do node tools/grammar-practice/$f-tests.mjs | tail -1; done`, `node tools/grammar-practice/build-keys.mjs --check`. Path UI checks: see `tools/path-tests/README.md` (needs jsdom at /tmp/rc: `mkdir -p /tmp/rc && cd /tmp/rc && npm i jsdom@24`).
- Gotchas: `run_command` auto-commits and blocks `git checkout/reset/stash`; to restore a file use `git show <commit>:<file> > <file>`. A checkpoint made right after a command can point one commit behind HEAD: check `git log` and checkpoint again. "This branch just changed. Try updating again" on sync = wait 20s and retry. A merged branch is closed: cut a new one for more work.

## 3. Where things stand (20 Nov)
**Main** (not published): **109 grammar topics**. Includes the "one learner path" (Home Continue = next stop; Lesson 1 then the 13-unit A1–A2 grammar course in `src/lib/grammarCourse.js`; once done → next step / today's practice / free roam). Claude's lane of 12 topics + `er-comparative` re-levelled A1 → A2 are merged.

**Base44 branch `grammar-path-fill-4-base44`, id `6af839dc11b80ce508f09b9f`** (base commit `819ec1b`), NOT merged: **129 banks = all 32 remaining course topics are written** (P16–P30, P38–P42, P44–P52, P57–P59). Build and lint green, gates untouched. Its log: `grammar-run/PROGRESS-path-fill.md` (rows below the line "Merged 14 Nov (batch 3)").
- Audited by Claude, 7 fixes applied: P16–P42, P44, P52.
- **NOT audited yet: P45 someone-anyone, P46 something-offer, P47 nothing-anything, P48 indefinite-agreement, P49 who-people, P50 that-which-things, P51 where-place, P57 present-passive, P58 past-passive, P59 active-to-passive.** (A quick read of P45–P50 found nothing glaring, but do the full worst-pairing + second-answer check.)

After this merge main should have **141 topics**: all 138 course topics (so the whole path is playable) + 3 B1 extras (used-to-state, future-continuous, arrangement-continuous; Free map only).

## 4. Do next, in order
1. **Audit the 10 topics above** on the Base44 branch. Fix in the authored `.mjs`, re-run `run_topic.sh`. Add a short audit note at the end of `PROGRESS-path-fill.md`.
2. **Merge the Base44 branch** (main moved since its base, so):
   a. On the branch, reset the generated files to the base: `for f in src/lib/grammarPractice/manifest.js base44/shared/grammarKeys.js grammar-run/WORKLIST.tsv; do git show 819ec1b:$f > $f; done`
   b. `sync-from-main` (retry after 20s if it says the branch just changed).
   c. Re-run `run_topic.sh` on any one Base44 topic: it rebuilds manifest + keys from every bank. Then check `ls src/lib/grammarPractice/bank | wc -l` = 141, keys check says 141, and `grep -c live grammar-run/WORKLIST.tsv` covers every bank (re-run any topic whose row isn't `live`; ~1 s each). Confirm `er-comparative` still shows A2 in the manifest.
   d. Fold the rows below "Merged 14 Nov (batch 3)" into `grammar-run/PROGRESS.md` with `node grammar-run/add_row.mjs "<row>"` and add one dated note line. Add a "Merged" marker in PROGRESS-path-fill.md.
   e. Build, lint, suites, keys, path UI checks → checkpoint (twice if lagging) → sync-status → merge.
   f. On main: same checks, checkpoint "Main: all 138 course topics (141). Not published."
3. **Tell Tee it's ready to test** in the preview: Home → Continue walks the whole path now. Short message.
4. **Update the taskboard**: VT-12.2 → complete (with counts and who wrote what: Claude 12 + er-comparative re-level, Base44 AI 47 across the path fill, Claude audited all). Note on VT-54 that the path is now fully playable.

## 5. Waiting on Tee (ask, don't decide)
- **Levels.** Tee said comparatives/superlatives are A2 (done). He was sent this list of unsure levels and hasn't answered; nothing changed:
  A1 → A2? the-unique, rarely, so-result, partitive, some-offer · A2 → A1? a-jobs, possessive-s, lets, because, want-infinitive, would-like-infinitive, general-truth · A2 → B1? less-comparative, mustnt-vs-dont-have-to, perfect for/since/how-long, first conditional, passives. Also: re-level the placement test too, or only the level shown on the path? (Only the path label was changed so far.) To re-level a topic: change `level` in its authored file and re-run; the lint FLAG "differs from the placement bank" is expected.
- **third-person-s rebuild**: blocked by one assertion in `tools/grammar-practice/composition-tests.mjs` (~line 77, asserts the pool is thin). Needs Tee's OK to change that test line.
- Base44's "wrong sentence to correct" transform items ("more fast", "I don't never"): keep or drop?
- Uzbek/Russian UI copy on the path is draft; needs a native check.
- Path design calls to confirm: pass = one round with 8+ answers and 80%+; everyone starts at stop 1 (no skip-ahead by placement yet); Lesson 1 is the first Continue.

## 6. Full steam ahead: what comes after the merge
WORKLIST after the merge: the A1–A2 course is done. Left: **wave C = 80 B1 topics** (todo), wave D = 162 B2–C2 topics, plus `third-person-s` (rebuild, blocked) and 2 odd wave-A B2/C2 rows.
- HANDOFF.md says each wave starts only after Tee approves. Tee's "full steam ahead" = start wave C; confirm in one line, don't wait long.
- The path course is A1–A2 only, so B1 topics land in the **Free map** (and Coach), not on Continue, until a B1 course/unit list exists. Worth offering Tee: draft a B1 course (`grammarCourse.js`-style units) so the path keeps going after A2.
- Run it in **two lanes**, same as before: `grammar-wave-c-claude` and `grammar-wave-c-base44`, both cut from main. Split the 80 topics **by domain** so sibling topics stay in one lane. Give Base44 a brief file on its branch (copy the shape of `grammar-run/PATH-FILL.md` + `HANDOFF-BASE44.md` on the Base44 branch: exact ordered list, its own PROGRESS file, "never merge/publish/sync", 5–7 topics per turn, build + lint at the end of each turn). Restart Base44 after each turn with: "Continue …: read <brief> and carry on from where the log stops." Audit its topics between turns. Merge lane 1, then lane 2 with the reset-generated-files procedure in §4.2.
- Audit lessons that keep coming up (already in PATH-FILL.md): a {name} slot must not repeat a printed name; subject/owner slots must fit every other slot; pronouns must agree with every slot value; the follow-up sentence must stay true for every value; never offer as "wrong" something natives say (e.g. "will melt" in a zero-conditional result, "that" for who/which, "to not go"); no army/war/police/weapons; no factual claims about countries.

## 7. Paper trail
- `grammar-run/PROGRESS.md` (master log), `grammar-run/PROGRESS-path-fill.md` (Base44 lane), `grammar-run/PROGRESS-path-fill-claude.md` (Claude lane), `grammar-run/PATH-FILL.md` + `grammar-run/HANDOFF-BASE44.md` (Base44 briefs, on its branch).
- Taskboard: VT-12 (grammar), VT-12.1 (Speaking Packs, done), VT-12.2 (path fill), VT-54 (one learner path).
