// GPT audit 31 Oct (5d + recap): the paths the earlier suites didn't prove.
//   A. Save & leave while OFFLINE: the sheet must say "Not saved yet" (never look like success),
//      Try again works once back online, Leave anyway keeps a persistent "not saved" banner.
//   B. Leaving from inside a grammar round says that round starts again.
//   C. The REAL browser Back / Forward (BrowserRouter, ?router=browser) mid-word.
//   D. Closing a tab mid-word and opening a NEW tab: within 10 min the other tab's answers are
//      left alone (it may still be open); after 10 min (abandoned) they are recovered and sent.
// node tools/coach/ui-harness/audit-31oct.mjs <screenshot-dir>   (mock app on :5199)
import { chromium } from "playwright";
const OUT = process.argv[2];
let pass = 0, fail = 0;
const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log(`${c ? "PASS" : "FAIL"}  ${n}${!c && x ? " -> " + x : ""}`); };
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" }).catch(() => chromium.launch());
const errors = [];
const vis = (p, t) => p.getByText(t, { exact: false }).first().isVisible().catch(() => false);
const log = (p) => p.evaluate(() => window.__log || []);
const submits = async (p) => (await log(p)).filter((e) => e.kind === "submit:start").map((e) => e.detail);
async function onboardIfNeeded(p) {
  await p.getByRole("button", { name: /Make my plan|^Start$|^Continue$/ }).first().waitFor({ timeout: 10000 });
  const go = p.getByRole("button", { name: /Make my plan/ });
  if (await go.isVisible().catch(() => false)) await go.click();
  await p.getByRole("button", { name: /^(Start|Continue)$/ }).waitFor({ timeout: 8000 });
}
async function answer(p) {
  const input = p.locator(".premium-card input");
  if (await input.isVisible().catch(() => false)) { await input.fill("apple"); await p.getByRole("button", { name: /^Check$/ }).click(); }
  else await p.locator(".premium-card .grid button").first().click();
}
async function finishWord(p) {
  for (let k = 0; k < 8; k++) {
    if (!(await p.getByTestId("word-q-count").isVisible().catch(() => false))) return;
    await answer(p); await p.getByRole("button", { name: /^Next$/ }).click(); await p.waitForTimeout(150);
  }
}
const newCtx = async () => { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); return ctx; };
const watch = (p) => p.on("pageerror", (e) => errors.push(String(e)));

// ---- A1. offline Save & leave -> "Not saved yet" -> online -> Try again -> resume ----
{ const ctx = await newCtx(); const p = await ctx.newPage(); watch(p);
  await p.goto("http://localhost:5199/?start=/coach&lang=en&level=A1");
  await onboardIfNeeded(p);
  await p.evaluate(() => { window.__offline = true; });
  await p.getByRole("button", { name: /^Start$/ }).click();
  await p.getByRole("button", { name: /^Got it$/ }).click();
  await finishWord(p);                                                    // word done -> save before grammar fails
  await p.waitForTimeout(800);
  await p.getByRole("button", { name: "Back" }).click();
  await p.getByRole("button", { name: "Save & leave" }).click();
  await p.getByText("Not saved yet").first().waitFor({ timeout: 6000 }).catch(() => {});
  ok("A: offline Save & leave says 'Not saved yet' (it used to close and look saved)", await vis(p, "Not saved yet"));
  ok("A: ...stays in the session (no plan screen behind a failed save)", !(await vis(p, "Pick up where you left off")) && await p.getByRole("dialog").getByRole("button", { name: /^Try again$/ }).isVisible());
  await p.screenshot({ path: `${OUT}/audit-A-not-saved.png`, fullPage: true });
  await p.evaluate(() => { window.__offline = false; });
  await p.getByRole("dialog").getByRole("button", { name: /^Try again$/ }).click();
  await p.getByText("Pick up where you left off").first().waitFor({ timeout: 8000 }).catch(() => {});
  ok("A: back online, Try again saves and leaves -> 'Pick up where you left off'", await vis(p, "Pick up where you left off"));
  ok("A: the finished word reached the server WITH the session key", (await submits(p)).some((s) => s.game === "quiz" && s.session_key === "2026-10-08:today:0"));
  await ctx.close(); }

// ---- A2. offline -> Leave anyway -> persistent "not saved yet" banner -> Try again clears it ----
{ const ctx = await newCtx(); const p = await ctx.newPage(); watch(p);
  await p.goto("http://localhost:5199/?start=/coach&lang=en&level=A1");
  await onboardIfNeeded(p);
  await p.evaluate(() => { window.__offline = true; });
  await p.getByRole("button", { name: /^Start$/ }).click();
  await p.getByRole("button", { name: /^Got it$/ }).click();
  await finishWord(p);
  await p.waitForTimeout(800);
  await p.getByRole("button", { name: "Back" }).click();
  await p.getByRole("button", { name: "Save & leave" }).click();
  await p.getByRole("button", { name: "Leave anyway" }).click();
  await p.waitForTimeout(800);
  ok("A: Leave anyway -> plan with a persistent 'not saved yet' banner", await vis(p, "haven't saved yet"));
  await p.screenshot({ path: `${OUT}/audit-A-leave-anyway.png`, fullPage: true });
  await p.evaluate(() => { window.__offline = false; });
  await p.locator("[role=status] button").first().click();
  await p.waitForTimeout(2000);
  ok("A: back online, the banner's Try again sends the kept answers (same session key) and clears it", !(await vis(p, "haven't saved yet")) && (await submits(p)).some((s) => s.game === "quiz" && s.session_key === "2026-10-08:today:0"));
  await ctx.close(); }

// ---- B. leaving from inside a grammar round says it starts again ----
{ const ctx = await newCtx(); const p = await ctx.newPage(); watch(p);
  await p.goto("http://localhost:5199/?start=/coach&lang=en&level=A1");
  await onboardIfNeeded(p);
  await p.getByRole("button", { name: /^Start$/ }).click();
  await p.getByRole("button", { name: /^Got it$/ }).click();
  await finishWord(p);
  await p.locator("button:has(span:text-is('A'))").first().waitFor({ timeout: 8000 });
  await p.getByRole("button", { name: /^Exit$/ }).click();
  await p.waitForTimeout(200);
  ok("B: grammar Exit -> the sheet says this grammar round will start again", await p.getByTestId("leave-grammar-note").isVisible().catch(() => false));
  await p.getByRole("button", { name: "Back" }).click().catch(() => {});
  await p.getByRole("button", { name: "Keep practising" }).click().catch(() => {});
  await p.getByRole("button", { name: "Back" }).click();
  await p.waitForTimeout(200);
  ok("B: the header Back (not from grammar) has no grammar note", !(await p.getByTestId("leave-grammar-note").isVisible().catch(() => false)));
  await p.screenshot({ path: `${OUT}/audit-B-grammar-note.png`, fullPage: true });
  await ctx.close(); }

// ---- C. the REAL browser Back / Forward mid-word (BrowserRouter) ----
{ const ctx = await newCtx(); const p = await ctx.newPage(); watch(p);
  await p.goto("http://localhost:5199/?router=browser&lang=en&level=A1");   // "/" = home, first history entry
  await p.evaluate(() => window.__navigate("/coach"));                    // in-app link to the Coach
  await onboardIfNeeded(p);
  await p.getByRole("button", { name: /^Start$/ }).click();
  await p.getByRole("button", { name: /^Got it$/ }).click();
  await answer(p);                                                        // 1 question answered, nothing sent
  const before = (await submits(p)).length;
  await p.goBack();                                                       // the browser's own Back button
  await p.waitForTimeout(1500);
  const sent = (await submits(p)).slice(before);
  ok("C: real browser Back left the Coach (URL is home)", new URL(p.url()).pathname === "/", p.url());
  ok("C: the partial answer was saved on the way out, without Coach credit", before === 0 && sent.length === 1 && sent[0].game === "quiz" && sent[0].n === 1 && !sent[0].session_key, JSON.stringify(sent));
  await p.goForward();                                                    // and Forward back into the Coach
  await p.getByText("apple").first().waitFor({ timeout: 6000 }).catch(() => {});
  ok("C: browser Forward -> the half-done word is still in the plan (Start, nothing completed)", await vis(p, "apple") && await p.getByRole("button", { name: /^Start$/ }).isVisible().catch(() => false));
  await ctx.close(); }

// ---- D. close the tab mid-word, open a new tab: protected for 10 min, recovered after ----
{ const ctx = await newCtx();
  const URL = "http://localhost:5199/?start=/coach&lang=en&level=A1&persist=shared";
  const p1 = await ctx.newPage(); watch(p1);
  await p1.goto(URL);
  await onboardIfNeeded(p1);
  await p1.getByRole("button", { name: /^Start$/ }).click();
  await p1.getByRole("button", { name: /^Got it$/ }).click();
  await answer(p1);                                                       // 1 answer, kept on the device only
  const staged = await p1.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("virora.coach.answers")).length);
  await p1.close({ runBeforeUnload: true });                              // the tab is closed (no React unmount)
  const p2 = await ctx.newPage(); watch(p2);
  await p2.goto(URL);
  await p2.waitForTimeout(2500);
  const s2 = await p2.evaluate(() => { try { return JSON.parse(localStorage.getItem("__mockState") || "{}").submits || []; } catch { return []; } });
  ok("D: the closed tab's answer was kept on the device", staged === 1, String(staged));
  ok("D: a new tab within 10 min leaves it alone (the other tab might still be open): nothing sent yet", s2.filter((x) => x.game === "quiz").length === 0, JSON.stringify(s2));
  await p2.close();
  const p3 = await ctx.newPage(); watch(p3);
  await p3.clock.install({ time: Date.now() + 11 * 60 * 1000 });          // 11 minutes later
  await p3.goto(URL);
  await p3.waitForTimeout(3000);
  const s3 = await p3.evaluate(() => { try { return JSON.parse(localStorage.getItem("__mockState") || "{}").submits || []; } catch { return []; } });
  const q = s3.filter((x) => x.game === "quiz");
  ok("D: after 10 min the abandoned tab's answer is recovered and sent once, without Coach credit", q.length === 1 && q[0].items?.length === 1 && !q[0].coach?.session_key, JSON.stringify(q));
  ok("D: device copy cleared after the recovery", (await p3.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("virora.coach.answers")).map((k) => JSON.parse(localStorage.getItem(k))).filter((d) => Object.keys(d.pending || {}).length || (d.rounds || []).length).length)) === 0);
  await ctx.close(); }

ok("no page errors", errors.length === 0, errors.join(" | ").slice(0, 300));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
