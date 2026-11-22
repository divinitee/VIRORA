// Rewrites whys that name a slot value of their own item: the value becomes "…" (Claude, 21 Nov 2026).
// Merges the change into grammar-run/variety/<key>.json and prints the keys it touched.
//   node grammar-run/tools-claude/whyslot-fix.mjs <topic-key> [...]
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const SKIP = new Set(["one", "ten", "call", "pass", "book", "a holiday", "speak louder", "eat"]);
const SKIP_TOPICS = new Set(["verb-patterns.gerund-infinitive.avoid-gerund", "sentence-structure.relative-clauses.object-relative-omission", "sentence-structure.word-order.indirect-object-to"]);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
for (const k of process.argv.slice(2)) {
  if (SKIP_TOPICS.has(k)) continue;
  const m = await import(`${process.cwd()}/src/lib/grammarPractice/bank/${k}.js`);
  const f = `grammar-run/variety/${k}.json`;
  const spec = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : {};
  spec.why ||= { choose: Array(20).fill(""), build: Array(20).fill(""), transform: Array(15).fill("") };
  const n = { choose: 0, build: 0, transform: 0 }; let changed = 0;
  for (const it of m.default) {
    if (!(it.stage in n)) continue; const i = n[it.stage]++;
    let why = it.why || ""; const before = why;
    for (const vals of Object.values(it.slots || {})) for (const v of vals) {
      const w = String(v); if (w.length < 3 || SKIP.has(w.toLowerCase())) continue;
      why = why.replace(new RegExp(`(^|[^A-Za-z])${esc(w)}(?=[^A-Za-z]|$)`, "gi"), "$1…");
    }
    if (why !== before) { spec.why[it.stage][i] = why; changed++; console.log(`  ${it.stage[0]}${i + 1}: ${why}`); }
  }
  if (changed) { writeFileSync(f, JSON.stringify(spec)); console.log(`FIXED ${k} ${changed}`); }
}
