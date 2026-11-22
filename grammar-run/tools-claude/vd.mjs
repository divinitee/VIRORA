// Compact dump for the variety pass: stage+number | sentence | key | slots (name:count).
// Run: node grammar-run/tools-claude/vd.mjs <topic-key>
const k = process.argv[2];
const m = await import(`${process.cwd()}/src/lib/grammarPractice/bank/${k}.js`);
const sl = (it) => Object.entries(it.slots || {}).map(([a, b]) => `${a}:${b.length}`).join(",");
const n = {};
for (const it of m.default) {
  if (!["choose", "build", "transform"].includes(it.stage)) continue;
  n[it.stage] = (n[it.stage] || 0) + 1;
  const tag = `${it.stage[0]}${n[it.stage]}`;
  const key = it.stage === "choose" ? it.options[it.key] : JSON.stringify(it.key);
  const text = it.stage === "transform" ? `${it.source} => ${it.hint}` : it.prompt || it.source;
  console.log(`${tag}| ${text} | ${key} | ${sl(it)}`);
}
