// Flags whys that name a word which is a slot value of the same item (Claude, 21 Nov 2026).
// Such a why can contradict the sentence the learner sees.
//   node grammar-run/tools-claude/whyslot.mjs <topic-key> [...]
for (const k of process.argv.slice(2)) {
  const m = await import(`${process.cwd()}/src/lib/grammarPractice/bank/${k}.js`);
  const n = { choose: 0, build: 0, transform: 0 };
  for (const it of m.default) {
    if (!(it.stage in n)) continue; n[it.stage]++;
    const why = (it.why || "").toLowerCase();
    for (const [s, vals] of Object.entries(it.slots || {})) {
      for (const v of vals) {
        const w = String(v).toLowerCase();
        if (w.length < 3) continue;
        if (new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`).test(why)) console.log(`${k} ${it.stage[0]}${n[it.stage]} {${s}}="${v}" in why: ${it.why}`);
      }
    }
  }
}
