// Gap questions and the meaning hint, against the REAL Coach page with the mocked server.
// 15 Oct: the meaning shows under the sentence in the learner's language.
// 5c (Tee, 26 Oct): only for A1 with the app in Uzbek/Russian. A1 with the app in ENGLISH
// gets no translation at all (the 15 Oct expectation of "(olma)" there was the leak 5c fixed).
//   node tools/coach/ui-harness/hint-check.mjs <screenshot-dir>
import { chromium } from "playwright";
const OUT = process.argv[2] || ".";
const results = []; const ok = (n, c, x = "") => { results.push([c, n]); console.log(`${c ? "PASS" : "FAIL"}  ${n}${!c && x ? " -> " + x : ""}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const errors = [];
const L = {
  en: { go: /Make my plan/, start: /Start/, got: /^Got it$/, next: /^Next$/, check: /^Check$/, gap: "Fill the gap", meaning: "" },
  uz: { go: /Rejamni tuz/, start: /Boshlash|Start/, got: /^Tushundim$/, next: /^Keyingisi$/, check: /^Tekshirish$/, gap: "Bo'sh joyni to'ldiring", meaning: "(olma)" },
  ru: { go: /Составить план/, start: /Начать|Start/, got: /^Понятно$/, next: /^Дальше$/, check: /^Проверить$/, gap: "Заполните пропуск", meaning: "(яблоко)" },
};
for (const [lang, C] of Object.entries(L)) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://localhost:5199/?start=/coach&lang=${lang}&level=A1`);
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
  ok(C.meaning ? `${lang}: A1 gap question shows the ${lang} meaning under the sentence` : `${lang}: A1 with the app in English: NO translation under the gap sentence`, found && meaning === C.meaning, JSON.stringify({ found, meaning }));
  ok(`${lang}: the sentence still has the gap and 4 options`, (await page.getByText("_____").first().isVisible()) && (await page.locator(".premium-card .grid button").count()) === 4);
  await page.close();
}
ok("no page errors", errors.length === 0, errors.join(" | "));
await browser.close();
const failed = results.filter((r) => !r[0]).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
