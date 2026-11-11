# Comeback tests (Comeback Revamp Phase 1, 2026-11-10)

```bash
# post-signup flow: one question, blind-click wake-up, straight to the Coach (jsdom)
node tools/comeback-tests/onboarding/build.mjs && NODE_PATH=/tmp/rc/node_modules node tools/comeback-tests/onboarding/run.cjs
# soft landing (ease mode) rules, incl. the real students' rounds
deno test -A --no-check tools/comeback-tests/easeCore.test.mjs
# the REAL sendDailyReminder entry (SDK mocked)
deno test -A --no-check --import-map=tools/comeback-tests/import_map_reminder.json tools/comeback-tests/reminder_entry.test.ts
# day log, streaks, effort missions, streak bonuses, reminder targeting, admin tracker ignores claims
deno test -A --no-check tools/comeback-tests/comebackCore.test.mjs
# the REAL progressApi entry (SDK mocked): getComeback + claimMission, exactly-once XP incl. a race
deno test -A --no-check --import-map=tools/comeback-tests/import_map.json tools/comeback-tests/progressApi_comeback.test.ts
# ComebackCard render + claim flow in jsdom (mocked serverApi)
node tools/comeback-tests/render/build.mjs
NODE_PATH=/tmp/rc/node_modules node tools/comeback-tests/render/run.cjs   # needs: mkdir -p /tmp/rc && (cd /tmp/rc && npm i jsdom@24)
```
