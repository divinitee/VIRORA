// VT-40 5d (30 Oct play-test): Back asks "Save and leave?", saving shows a spinner,
// the plan then reads "Pick up where you left off" + Continue; per-word question
// counter + progress bar; Enter moves on; grammar's mid-round Exit asks the same question.
// node tools/coach/ui-harness/leave-resume.mjs <screenshot-dir>   (mock app on :5199)
import { chromium } from "playwright";
const OUT = process.argv[2];
let pass = 0, fail = 0;
const ok = (n, c, x = "") => { c ? pass++ : fail++; console.log(`${c ? "PASS" : "FAIL"}  ${n}${!c && x ? " -> " + x : ""}`); };
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" }).catch(() => chromium.launch());
const errors = [];
const vis = (p, t) => p.getByText(t, { exact: false }).first().isVisible().catch(() => false);
const state = (p) => p.evaluate(() => window.__log || []);

async function open(lang = "en", level = "A1") {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://localhost:5199/?start=/coach&lang=${lang}&level=${level}`);
  await page.getByRole("button", { name: /Make my plan|Rejamni tuz|Составить план/ }).first().click();
  await page.locator("main, body").first().waitFor();
  return { ctx, page };
}
const barWidth = (p) => p.evaluate(() => { const b = document.querySelector(".h-1.rounded-full > div"); return b ? parseFloat(getComputedStyle(b).width) : -1; });
async function answer(p) {
  const input = p.locator(".premium-card input");
  if (await input.isVisible().catch(() => false)) { await input.fill("apple"); await p.getByRole("button", { name: /^Check$/ }).click(); }
  else await p.locator(".premium-card .grid button").first().click();
}

// ---- en: counter, bar, Enter, Back -> sheet -> Keep practising -> Save & leave -> resume ----
{ const { ctx, page } = await open("en");
  await page.getByRole("button", { name: /^Start$/ }).click();
  await page.getByRole("button", { name: /^Got it$/ }).click();          // weak word: card first
  const count0 = await page.getByTestId("word-q-count").textContent().catch(() => "");
  ok("per-word counter shows question 1 of this word (e.g. 1/3)", /^1\/\d$/.test((count0 || "").trim()), count0);
  const w0 = await barWidth(page);
  await answer(page);
  await page.waitForTimeout(400);
  const w1 = await barWidth(page);
  ok("progress bar moves after answering a question INSIDE a word (it used to wait for the whole word)", w1 > w0, `${w0} -> ${w1}`);
  await page.screenshot({ path: `${OUT}/5d-01-counter.png`, fullPage: true });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const count1 = await page.getByTestId("word-q-count").textContent().catch(() => "");
  ok("Enter after an answer moves to the next question", (count1 || "").trim().startsWith("2/"), count1);

  // finish this word so something is saved with the session
  for (let k = 0; k < 8; k++) {
    if (!(await page.getByTestId("word-q-count").isVisible().catch(() => false))) break;
    await answer(page); await page.getByRole("button", { name: /^Next$/ }).click(); await page.waitForTimeout(150);
  }
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForTimeout(200);
  ok("Back during a session opens 'Save and leave?' (no silent lag)", await vis(page, "Save and leave?"));
  await page.screenshot({ path: `${OUT}/5d-02-leave-sheet.png`, fullPage: true });
  const before = (await state(page)).filter((e) => e.kind === "submit:start").length;
  await page.getByRole("button", { name: "Keep practising" }).click();
  await page.waitForTimeout(200);
  ok("'Keep practising' closes the sheet and stays in the session, nothing sent", !(await vis(page, "Save and leave?")) && (await state(page)).filter((e) => e.kind === "submit:start").length === before);
  await page.getByRole("button", { name: "Back" }).click();
  // Record whether "Saving…" ever renders (it can be brief when nothing is left to send).
  await page.evaluate(() => { window.__sawSaving = false; const o = new MutationObserver(() => { if (document.body.innerText.includes("Saving…")) window.__sawSaving = true; }); o.observe(document.body, { subtree: true, childList: true, characterData: true }); });
  await page.getByRole("button", { name: "Save & leave" }).click();
  await page.waitForTimeout(100);
  await page.getByText("Pick up where you left off").first().waitFor({ timeout: 6000 }).catch(() => {});
  ok("Save & leave shows a saving state while it sends", await page.evaluate(() => window.__sawSaving));
  ok("plan then reads 'Pick up where you left off' with a Continue button", await vis(page, "Pick up where you left off") && await page.getByRole("button", { name: /^Continue$/ }).isVisible());
  ok("...and says what's done and what's left", await vis(page, "min done"));
  const L = await state(page);
  ok("the finished word was saved WITH the session key", L.some((e) => e.kind === "submit:start" && e.detail.game === "quiz" && e.detail.session_key === "2026-10-08:today:0"));
  await page.screenshot({ path: `${OUT}/5d-03-resume.png`, fullPage: true });

  // ---- grammar mid-round Exit asks the same question instead of skipping the topic ----
  await page.getByRole("button", { name: /^Continue$/ }).click();
  for (let k = 0; k < 40; k++) {
    await page.waitForTimeout(150);
    if (await page.locator("button:has(span:text-is('A'))").first().isVisible().catch(() => false)) break;
    if (await page.getByRole("button", { name: /^Got it$/ }).isVisible().catch(() => false)) { await page.getByRole("button", { name: /^Got it$/ }).click(); continue; }
    if (await page.getByTestId("word-q-count").isVisible().catch(() => false)) { await answer(page); await page.getByRole("button", { name: /^Next$/ }).click().catch(() => {}); }
  }
  const gExit = page.getByRole("button", { name: /^Exit$/ });
  ok("a grammar round is reached with an Exit button", await gExit.isVisible().catch(() => false));
  await gExit.click().catch(() => {});
  await page.waitForTimeout(200);
  ok("grammar Exit asks 'Save and leave?' (it used to silently skip to the next item)", await vis(page, "Save and leave?"));
  await page.getByRole("button", { name: "Keep practising" }).click();
  ok("...and Keep practising returns to the SAME grammar question", await page.locator("button:has(span:text-is('A'))").first().isVisible().catch(() => false));
  await ctx.close(); }

// ---- uz / ru copy ----
for (const [lang, title] of [["uz", "Saqlab chiqasizmi?"], ["ru", "Сохранить и выйти?"]]) {
  const { ctx, page } = await open(lang);
  await page.locator(".premium-card button").last().click().catch(() => {}); // Start (localised)
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForTimeout(200);
  ok(`${lang}: the leave sheet is localised`, await vis(page, title));
  await page.screenshot({ path: `${OUT}/5d-04-leave-${lang}.png`, fullPage: true });
  await ctx.close();
}
ok("no page errors", errors.length === 0, errors.join(" | ").slice(0, 300));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
