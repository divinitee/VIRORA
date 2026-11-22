// Variety report for the B1 course pass (Claude, 21 Nov 2026).
// Per topic: how many choose/build/transform items share their "why" with another item,
// how many lines have fewer than 2 slots, and how many slots have fewer than 4 values.
//   node grammar-run/tools-claude/variety.mjs <topic-key> [...]
import { readdirSync } from "node:fs";
const keys = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync("src/lib/grammarPractice/bank").map((f) => f.replace(/\.js$/, ""));
console.log("topic\tsharedWhy\tthinLines\tsmallSlots\tdet");
for (const k of keys) {
  const m = await import(`${process.cwd()}/src/lib/grammarPractice/bank/${k}.js`);
  const det = m.default.filter((it) => ["choose", "build", "transform"].includes(it.stage));
  const cnt = {};
  for (const it of det) cnt[it.why] = (cnt[it.why] || 0) + 1;
  const shared = det.filter((it) => cnt[it.why] > 1).length;
  const thin = det.filter((it) => Object.keys(it.slots || {}).length < 2).length;
  const small = det.reduce((a, it) => a + Object.values(it.slots || {}).filter((v) => v.length < 4).length, 0);
  console.log(`${k}\t${shared}\t${thin}\t${small}\t${det.length}`);
}
