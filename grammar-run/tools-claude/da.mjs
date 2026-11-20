// Claude's audit dump (wave C): prints choose / build / transform items of one topic with their slots.
// Run: node grammar-run/tools-claude/da.mjs <topic-key>
const k = process.argv[2];
const m = await import(`${process.cwd()}/src/lib/grammarPractice/bank/${k}.js`);
const sl = (it) => Object.entries(it.slots || {}).map(([a, b]) => `${a}=${b.join("/")}`).join(" ; ");
for (const it of m.default) {
  if (it.stage === "choose") console.log("C|", it.prompt, "|", it.options.join(" / "), "| K:", it.options[it.key], "::", sl(it));
  else if (it.stage === "build") console.log("B|", it.source, "| K:", JSON.stringify(it.key), (it.acceptable || []).join(","), "::", sl(it));
  else if (it.stage === "transform") console.log("T|", it.instr, "|", it.source, "||", it.hint, "| K:", JSON.stringify(it.key), (it.acceptable || []).join(","), "::", sl(it));
}
