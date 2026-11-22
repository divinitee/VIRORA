// Lists banks whose stored `acceptable` lists differ from what ingest would now add
// (after the 21 Nov 2026 'd / two-part alternatives change). (Claude, 23 Nov 2026)
import { readdirSync } from "node:fs";
import { accepted, acceptedArray } from "../../tools/grammar-practice/accepted-variants.mjs";
const dir = "src/lib/grammarPractice/bank";
let n = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith(".js")).sort()) {
  const m = await import(`${process.cwd()}/${dir}/${f}`);
  let diff = 0;
  for (const it of m.default) {
    if (it.format === "mcq" || it.key === undefined) continue;
    const now = JSON.stringify(it.acceptable || null);
    const own = Array.isArray(it.key) ? (it.acceptable || []).filter(Array.isArray) : (it.acceptable || []);
    const want = Array.isArray(it.key) ? acceptedArray(it.key, own) : accepted(it.key, own);
    const a = new Set((want || []).map((x) => JSON.stringify(x))), b = new Set((it.acceptable || []).map((x) => JSON.stringify(x)));
    if ([...a].some((x) => !b.has(x))) diff++;
  }
  if (diff) { n++; console.log(f.replace(/\.js$/, ""), diff); }
}
console.log("topics:", n);
