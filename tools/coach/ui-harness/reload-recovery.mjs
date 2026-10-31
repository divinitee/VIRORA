// Reload recovery (VT-40, 15 Oct) against the REAL Coach page. The mocked server keeps
// its state across reloads (?persist=1, sessionStorage), like a real server would.
//   A. online: reload in the middle of a word -> the answers given so far are sent after
//      the reload (without Coach credit, as on Back) and the word stays in the plan
//   B. offline: a finished word can't be saved, the page reloads while still offline ->
//      plan shows "not saved yet" + Try again; back online -> Try again saves it with
//      its ORIGINAL round_id, the word leaves the plan, the banner goes
//   C. after recovery, a full session still ends in Done with every item saved once
//   node tools/coach/ui-harness/reload-recovery.mjs <screenshot-dir>
import { chromium } from "playwright";
const OUT = process.argv[2] || ".";
const URL = "http://localhost:5199/?start=/coach&lang=en&persist=1";
const results = []; const ok = (n, c, x = "") => { results.push([c, n]); console.log(`${c ? "PASS" : "FAIL"}  ${n}${!c && x ? " -> " + x : ""}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const errors = [];
const vis = (p, t) => p.getByText(t, { exact: false }).first().isVisible().catch(() => false);
const PENDING = "Some answers haven't saved yet";
const state = (p) => p.evaluate(() => ({ submits: window.__state.submits.map((b) => ({ game: b.game, id: b.round_id, n: b.items.length, key: b.coach?.session_key || null, words: [...new Set(b.items.map((i) => i.word_id).filter(Boolean))] })), done: [...(window.__state.done["2026-10-08:today:0"] || [])] }));
async function newPage() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|React Router/.test(m.text())) errors.push(m.text().slice(0, 160)); });
  await page.goto(URL);
  await page.getByRole("button", { name: /Make my plan/ }).click();
  await page.getByRole("button", { name: /Start/ }).waitFor();
  return { ctx, page };
}
// 5c: a word now asks only the question kinds it can (no repeats), so "finish the word"
// answers until the word check is gone instead of assuming exactly 5 questions.
async function finishWord(p) {
  for (let k = 0; k < 8; k++) {
    const grammar = await p.locator("button:has(span:text-is('A'))").first().isVisible().catch(() => false);
    const wordQ = await p.locator("[data-testid='word-q-count'], .premium-card input, .premium-card .grid button").first().isVisible().catch(() => false);
    if (grammar || !wordQ) return;
    await answerOne(p);
  }
}
async function answerOne(p) {
  const input = p.locator(".premium-card input");
  if (await input.isVisible().catch(() => false)) { await input.fill("apple"); await p.getByRole("button", { name: /^Check$/ }).click(); }
  else await p.locator(".premium-card .grid button").first().click();
  await p.getByRole("button", { name: /^Next$/ }).click();
  await p.waitForTimeout(120);
}

// ---- A. online reload in the middle of a word -------------------------------
{ const { ctx, page } = await newPage();
  await page.getByRole("button", { name: /Start/ }).click();
  await page.getByRole("button", { name: /^Got it$/ }).click();          // weak word: card first
  await answerOne(page); await answerOne(page);                          // 2 of 5 answered, nothing sent yet
  const before = await state(page);
  const stored = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("virora.coach.answers")).length);
  ok("A: 2 answers given, nothing sent yet, but kept on the device", before.submits.length === 0 && stored === 1, JSON.stringify(before));
  await page.reload();
  await page.getByRole("button", { name: /Start/ }).waitFor({ timeout: 8000 });
  await page.waitForTimeout(1500);
  const after = await state(page);
  const q = after.submits.filter((s) => s.game === "quiz");
  await page.screenshot({ path: `${OUT}/reload-A-after.png`, fullPage: true });
  ok("A: after the reload the 2 answers were sent, WITHOUT Coach credit (half-done word, as on Back)", q.length === 1 && q[0].n === 2 && q[0].key === null, JSON.stringify(q));
  ok("A: the half-done word is still in today's plan; no banner (saved fine)", await vis(page, "apple") && !(await vis(page, PENDING)));
  ok("A: device copy cleared after the save", (await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("virora.coach.answers")).length)) === 0);
  await ctx.close(); }

// ---- B. offline: finished word can't be saved, reload while offline ----------
{ const { ctx, page } = await newPage();
  await page.evaluate(() => sessionStorage.setItem("__offline", "quiz"));
  await page.getByRole("button", { name: /Start/ }).click();
  await page.getByRole("button", { name: /^Got it$/ }).click();
  await finishWord(page);                     // word finished -> save before grammar fails
  await page.getByText(PENDING).first().waitFor({ timeout: 5000 }).catch(() => {});
  const failedIds = await page.evaluate(() => window.__log.filter((e) => e.kind === "submit:fail").map((e) => e.detail.round_id));
  ok("B: offline -> the finished word's save failed (banner in the session)", failedIds.length >= 1 && await vis(page, PENDING), JSON.stringify(failedIds));
  await page.reload();                                                    // still offline
  await page.getByRole("button", { name: /Start/ }).waitFor({ timeout: 8000 });
  await page.getByText(PENDING).first().waitFor({ timeout: 6000 }).catch(() => {});
  await page.screenshot({ path: `${OUT}/reload-B-offline-banner.png`, fullPage: true });
  ok("B: reloaded while offline -> the plan says answers aren't saved yet, with Try again", await vis(page, PENDING) && await page.getByRole("button", { name: "Try again" }).isVisible());
  ok("B: ...and nothing reached the server", (await state(page)).submits.length === 0);
  await page.evaluate(() => sessionStorage.removeItem("__offline"));
  await page.getByRole("button", { name: "Try again" }).click();
  await page.waitForTimeout(2500);
  const s = await state(page);
  await page.screenshot({ path: `${OUT}/reload-B-recovered.png`, fullPage: true });
  const q = s.submits.filter((x) => x.game === "quiz");
  ok("B: back online -> Try again saves the word WITH Coach credit and its ORIGINAL round_id", q.length === 1 && q[0].n === 3 && q[0].key === "2026-10-08:today:0" && failedIds.includes(q[0].id) /* 5c: apple asks 3 kinds, no repeats */, JSON.stringify({ q, failedIds }));
  ok("B: the saved word left the plan and the banner is gone", !(await vis(page, "apple")) && !(await vis(page, PENDING)) && s.done.includes("word:v1:0"));

  // ---- C. the rest of the session, then Done ----
  await page.getByRole("button", { name: /^(Start|Continue)$/ }).click(); // 5d: a started session resumes with "Continue"
  for (let step = 0; step < 60; step++) {
    await page.waitForTimeout(150);
    if (await page.getByRole("button", { name: /Keep going/ }).isVisible().catch(() => false)) break;
    const optA = page.locator("button:has(span:text-is('A'))").first();
    if (await optA.isVisible().catch(() => false) && await optA.isEnabled().catch(() => false)) {
      await optA.click(); await page.getByRole("button", { name: /^Check$/ }).click();
      await page.getByRole("button", { name: /^(Next|Finish)/ }).first().click(); continue;
    }
    if (await page.getByRole("button", { name: /^Done$/ }).isVisible().catch(() => false)) { await page.getByRole("button", { name: /^Done$/ }).click(); continue; }
    if (await page.getByRole("button", { name: /^Got it$/ }).isVisible().catch(() => false)) { await page.getByRole("button", { name: /^Got it$/ }).click(); continue; }
    if (await page.locator(".premium-card .grid button, .premium-card input").first().isVisible().catch(() => false)) await answerOne(page).catch(() => {});
  }
  const end = await state(page);
  const ids = end.submits.map((x) => x.id);
  ok("C: after recovery the session finishes with Done (Keep going offered)", await page.getByRole("button", { name: /Keep going/ }).isVisible().catch(() => false));
  ok("C: all 3 items saved, every round stored once", end.done.length === 3 && new Set(ids).size === ids.length, JSON.stringify(end));
  ok("C: device copy empty at the end", (await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("virora.coach.answers")).length)) === 0);
  await ctx.close(); }

ok("no page errors", errors.length === 0, errors.join(" | "));
await browser.close();
const failed = results.filter((r) => !r[0]).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
