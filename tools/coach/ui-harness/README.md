# Coach UI click-through harness (VT-40 Stage 3)
Renders the REAL `src/pages/Coach.jsx`, `PracticeRunner`, `CoachWordCheck` and `CoachTodayCard`
with the server MOCKED by `serverApi.mock.js` (same response shapes as coachEngine.getToday;
submissions take 600 ms so a non-awaited submit is caught by ordering). This is NOT a
real-backend test. Needs Chromium + Playwright (the Base44 sandbox has none):
  npx vite --config tools/coach/ui-harness/vite.config.js            # serves on :5199
  node tools/coach/ui-harness/click-through.mjs <screenshot-dir>     # main flow, 15 checks
  node tools/coach/ui-harness/corrections.mjs <screenshot-dir>       # corrections (2026-10-09/10), 28 checks
  node tools/coach/ui-harness/save-failure.mjs <screenshot-dir>      # failed saves (2026-10-15): banner, error card, recovery, grammar; en/uz/ru, 39 checks
  node tools/coach/ui-harness/reload-recovery.mjs <screenshot-dir>   # reload recovery (2026-10-15), 13 checks; mock state survives reloads with ?persist=1
  node tools/coach/ui-harness/leave-resume.mjs <screenshot-dir>      # 5d + recap (2026-10-30/31): leave sheet, resume, counter, Enter, grammar Exit, route-change Back mid-word, recap; en/uz/ru, 23 checks
  node tools/coach/ui-harness/audit-31oct.mjs <screenshot-dir>       # GPT audit 31 Oct: offline Save & leave, Leave anyway banner, grammar note, REAL browser Back/Forward (?router=browser), closed tab + new tab (10-min rule, ?persist=shared + clock), 16 checks
URL params read by the mock: scenario=normal|unavailable|partial, minutes=<n>, whoami=fail|slow, lang=en|uz|ru, router=browser (real history), persist=1|shared (sessionStorage | localStorage shared by tabs),
level=A1|A2|B1|B2|C1|unplaced|legacy (5c: the learner level frozen on the session; default A1; legacy = no snapshot).
Playwright: if `import "playwright"` fails, link the global install: ln -sfn "$(npm root -g)/playwright" node_modules/playwright
window.__offline = true makes Coach word saves (game "quiz") fail; "all" makes grammar saves fail too.
Route /practice?mode=plain|coach renders PracticeRunner alone (regression check D).
