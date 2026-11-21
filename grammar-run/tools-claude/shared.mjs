// Lists items whose why is shared with another item (Claude, 21 Nov 2026).
//   node grammar-run/tools-claude/shared.mjs <topic-key>
const k = process.argv[2];
const m = await import(`${process.cwd()}/src/lib/grammarPractice/bank/${k}.js`);
const det = m.default.filter((it) => ["choose", "build", "transform"].includes(it.stage));
const cnt = {}; for (const it of det) cnt[it.why] = (cnt[it.why] || 0) + 1;
const n = { choose: 0, build: 0, transform: 0 };
for (const it of det) { n[it.stage]++; if (cnt[it.why] > 1) console.log(`${it.stage[0]}${n[it.stage]}| ${it.why}`); }
