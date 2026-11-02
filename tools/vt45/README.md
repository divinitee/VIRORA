# VT-45 phase 1 tests

Run from the app root.

```bash
# pure rules + homework check states + who can write the trusted fields (static)
node tools/vt45/phase1-tests.mjs

# the REAL progressApi entry against an in-memory Base44 (needs Deno 2):
# ungradable quiz items rejected with or without coach.session_key, client
# can't set verification, resent rounds counted once, server_checked_rounds
# only from server receipts, recompute == rebuild, old rows rebuilt
deno test --allow-read --allow-env --allow-net=registry.npmjs.org --no-check \
  --import-map=tools/vt45/deno/import_map.json tools/vt45/deno/progressApi.test.ts
```

The Coach FSRS hook logs "coach applyRound failed (ignored)" in the Deno run:
ts-fsrs isn't installed for Deno here. That hook is wrapped in try/catch in
progressApi and never affects grading, receipts or SkillState, which are what
these tests check.
