// Save-failure UI checks (VT-40, 15 Oct) against the REAL Coach page with the mocked
// server (serverApi.mock.js; window.__offline makes word saves fail):
//   1. mid-session save fails before a grammar step -> banner + Try again, session goes on
//   2. end-of-session save fails (after 1 automatic retry) -> save-error card, NO Done
//   3. Try again while still offline -> still the error card, no Done
//   4. back online -> Try again -> Done, every word answer saved exactly once
// Run in en, uz, ru; screenshots at a 390 px phone width.
//   node tools/coach/ui-harness/save-failure.mjs <screenshot-dir>
import { chromium } from "playwright";
const OUT = process.argv[2] || ".";
const BASE = "http://localhost:5199/";
const results = []; const ok = (n, c, x = "") => { results.push([c, n]); console.log(`${c ? "PASS" : "FAIL"}  ${n}${!c && x ? " -> " + x : ""}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const errors = [];
const COPY = {
  en: { go: /Make my plan/, start: /Start/, next: /^Next$/, check: /^Check$/, got: /^Got it$/, retry: "Try again", pending: "Some answers haven't saved yet", failed: "Your answers didn't save yet", done: /done|Nice work/i },
  uz: { go: /Rejamni tuz/, start: /Boshlash|Start/, next: /^Keyingisi$/, check: /^Tekshirish$/, got: /^Tushundim$/, retry: "Qayta urinish", pending: "Ba'zi javoblar hali saqlanmadi", failed: "Javoblaringiz hali saqlanmadi", done: /zo'r|bajarildi|tugadi/i },
  ru: { go: /Составить план/, start: /Начать|Start/, next: /^Дальше$/, check: /^Проверить$/, got: /^Понятно$/, retry: "Ещё раз", pending: "Часть ответов пока не сохранилась", failed: "Ответы пока не сохранились", done: /Отличн|готов|выполнен/i },
};
const vis = (p, t) => p.getByText(t, { exact: false }).first().isVisible().catch(() => false);

// Answers whatever word question is on screen until the word is done; returns answers given.
async function answerWord(p, L) {
  let n = 0;
  for (let k = 0; k < 12; k++) {
    if (await p.getByRole("button", { name: L.got }).isVisible().catch(() => false)) { await p.getByRole("button", { name: L.got }).click(); continue; }
    const input = p.locator(".premium-card input");
    if (await input.isVisible().catch(() => false)) {
      await input.fill("guess");
      await p.getByRole("button", { name: L.check }).click();
    } else {
      const opts = p.locator(".premium-card .grid button");
      if (!(await opts.count())) return n;
      await opts.first().click();
    }
    n++;
    const next = p.getByRole("button", { name: L.next });
    if (!(await next.isVisible().catch(() => false))) return n;
    await next.click();
    await p.waitForTimeout(150);
    if (!(await p.locator(".premium-card .grid button, .premium-card input").first().isVisible().catch(() => false))) return n;
  }
  return n;
}
async function finishGrammar(p) {
  for (let k = 0; k < 40; k++) {
    const opt = p.locator(".premium-card button").filter({ hasNotText: /^(Next|Keyingisi|Дальше|Check|Tekshirish|Проверить)$/ }).first();
    if (await p.getByText(/Item 3 of 3|Word check|So'z|Проверка слова/).first().isVisible().catch(() => false)) return;
    const btns = await p.locator("button").allInnerTexts();
    const cont = btns.find((b) => /Continue|Davom|Продолж|Finish|Next|Keyingisi|Дальше|Done|Tayyor|Готово/i.test(b));
    if (await opt.isVisible().catch(() => false)) await opt.click().catch(() => {});
    if (cont) await p.getByRole("button", { name: cont }).first().click().catch(() => {});
    await p.waitForTimeout(150);
    const items = await p.evaluate(() => (window.__state.done["2026-10-08:today:0"] || new Set()).size);
    if (items >= 2) return;
  }
}

for (const lang of ["en", "uz", "ru"]) {
  const L = COPY[lang];
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("pageerror", (e) => errors.push(`${lang}: ${e}`));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|React Router/.test(m.text())) errors.push(`${lang}: ${m.text().slice(0, 160)}`); });
  await page.goto(`${BASE}?start=/coach&lang=${lang}`);
  await page.getByRole("button", { name: L.go }).click();
  await page.getByRole("button", { name: L.start }).waitFor();
  await page.evaluate(() => { window.__offline = true; });
  await page.getByRole("button", { name: L.start }).click();

  // 1) word 1 (weak: card + questions) answered offline; the grammar step's save fails.
  const n1 = await answerWord(page, L);
  await page.getByText(L.pending).first().waitFor({ timeout: 4000 }).catch(() => {});
  await page.screenshot({ path: `${OUT}/${lang}-1-mid-session-banner.png`, fullPage: true });
  ok(`${lang}: mid-session save fails -> banner with Try again`, await vis(page, L.pending) && await page.getByRole("button", { name: L.retry }).isVisible(), String(n1));
  ok(`${lang}: ...and the session goes on (grammar step on screen)`, !(await page.locator(".premium-card input").isVisible().catch(() => false)));
  await page.getByRole("button", { name: L.retry }).click();
  await page.waitForTimeout(900);
  ok(`${lang}: Try again while offline -> banner stays`, await vis(page, L.pending));

  // 2) grammar, then word 2, then the end-of-session save fails twice.
  await finishGrammar(page);
  const n2 = await answerWord(page, L);
  await page.getByText(L.failed).first().waitFor({ timeout: 8000 }).catch(() => {});
  await page.screenshot({ path: `${OUT}/${lang}-2-save-error-card.png`, fullPage: true });
  const fails = await page.evaluate(() => window.__log.filter((e) => e.kind === "submit:fail").length);
  ok(`${lang}: end of session, saves fail -> error card, NOT Done`, await vis(page, L.failed) && !(await vis(page, L.done)), `answers ${n1}+${n2}, fails ${fails}`);
  ok(`${lang}: banner hidden behind the card (one message at a time)`, !(await vis(page, L.pending)));

  // 3) Try again offline -> still the card; the button is disabled while it works.
  const btn = page.getByRole("button", { name: L.retry });
  await btn.click();
  const disabledWhileTrying = await btn.isDisabled().catch(() => false);
  await page.waitForTimeout(2600);
  ok(`${lang}: Try again offline -> still the error card, no Done (button disabled while trying: ${disabledWhileTrying})`, await vis(page, L.failed) && !(await vis(page, L.done)));

  // 4) Back online -> Try again -> Done; every word answer saved exactly once.
  await page.evaluate(() => { window.__offline = false; });
  await page.getByRole("button", { name: L.retry }).click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/${lang}-3-after-recovery.png`, fullPage: true });
  const S = await page.evaluate(() => ({
    quiz: window.__state.submits.filter((b) => b.game === "quiz").map((b) => ({ id: b.round_id, n: b.items.length, key: b.coach?.session_key || null })),
    done: [...(window.__state.done["2026-10-08:today:0"] || [])],
  }));
  const ids = S.quiz.map((q) => q.id);
  const saved = S.quiz.reduce((s, q) => s + q.n, 0);
  ok(`${lang}: back online -> Done screen`, !(await vis(page, L.failed)) && (await vis(page, L.done) || await page.getByRole("button", { name: /Keep going|Davom|Продолж/ }).isVisible().catch(() => false)));
  ok(`${lang}: every word answer saved, each round once (${saved} answers in ${ids.length} rounds)`, saved === n1 + n2 && new Set(ids).size === ids.length && S.quiz.every((q) => q.key === "2026-10-08:today:0"), JSON.stringify(S.quiz));
  ok(`${lang}: server marks all 3 items done`, S.done.length === 3, S.done.join());
  await page.close();
}
ok("no page errors", errors.length === 0, errors.join(" | "));
await browser.close();
const failed = results.filter((r) => !r[0]).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
