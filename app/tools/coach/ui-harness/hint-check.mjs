// A1-A2 gap questions show the meaning under the sentence (VT-40, 15 Oct audit), in the
// learner's language, against the REAL Coach page with the mocked server.
//   node tools/coach/ui-harness/hint-check.mjs <screenshot-dir>
import { chromium } from "playwright";
const OUT = process.argv[2] || ".";
const results = []; const ok = (n, c, x = "") => { results.push([c, n]); console.log(`${c ? "PASS" : "FAIL"}  ${n}${!c && x ? " -> " + x : ""}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const errors = [];
const L = {
  en: { go: /Make my plan/, start: /Start/, got: /^Got it$/, next: /^Next$/, check: /^Check$/, gap: "Fill the gap", meaning: "(olma)" },
  ru: { go: /Составить план/, start: /Начать|Start/, got: /^Понятно$/, next: /^Дальше$/, check: /^Проверить$/, gap: "Заполните пропуск", meaning: "(яблоко)" },
};
for (const [lang, C] of Object.entries(L)) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://localhost:5199/?start=/coach&lang=${lang}`);
  await page.getByRole("button", { name: C.go }).click();
  await page.getByRole("button", { name: C.start }).click();
  await page.getByRole("button", { name: C.got }).click();
  let found = false;
  for (let k = 0; k < 6 && !found; k++) {
    if (await page.getByText(C.gap).first().isVisible().catch(() => false)) { found = true; break; }
    const input = page.locator(".premium-card input");
    if (await input.isVisible().catch(() => false)) { await input.fill("apple"); await page.getByRole("button", { name: C.check }).click(); }
    else await page.locator(".premium-card .grid button").first().click();
    await page.getByRole("button", { name: C.next }).click();
    await page.waitForTimeout(150);
  }
  await page.screenshot({ path: `${OUT}/hint-${lang}.png`, fullPage: true });
  const meaning = await page.getByTestId("gap-meaning").innerText().catch(() => "");
  ok(`${lang}: the A2 gap question shows the meaning under the sentence`, found && meaning === C.meaning, meaning);
  ok(`${lang}: the sentence still has the gap and 4 options`, (await page.getByText("_____").first().isVisible()) && (await page.locator(".premium-card .grid button").count()) === 4);
  await page.close();
}
ok("no page errors", errors.length === 0, errors.join(" | "));
await browser.close();
const failed = results.filter((r) => !r[0]).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
