// Claude's check (wave C fixes): a slot filler that is also a person printed in the same item
// ("Olga isn't at the lesson … She might be ill, Olga."). Prints topic | stage#n | slot=value | text.
// Run: node grammar-run/tools-claude/name-clash.mjs <topic-key> [...]
import { readdirSync } from "node:fs";
const keys = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync("src/lib/grammarPractice/bank").map((f) => f.replace(/\.js$/, ""));
let n = 0;
for (const k of keys) {
  const m = await import(`${process.cwd()}/src/lib/grammarPractice/bank/${k}.js`);
  const cnt = {};
  for (const it of m.default) {
    cnt[it.stage] = (cnt[it.stage] || 0) + 1;
    const text = [it.prompt, it.source, it.hint, it.instr].filter(Boolean).join(" || ");
    const printed = text.replace(/\{[a-z0-9]+\}/gi, " ");
    for (const [slot, vals] of Object.entries(it.slots || {})) {
      for (const v of vals) {
        if (!/^[A-Z][a-z]+$/.test(v)) continue;
        if (new RegExp(`\\b${v}\\b`).test(printed)) { n++; console.log(`${k} | ${it.stage}#${cnt[it.stage]} | ${slot}=${v} | ${text.slice(0, 110)}`); }
      }
      // two name slots in one item that share a value
    }
    const nameSlots = Object.entries(it.slots || {}).filter(([, v]) => v.every((x) => /^[A-Z][a-z]+$/.test(x)));
    for (let a = 0; a < nameSlots.length; a++) for (let b = a + 1; b < nameSlots.length; b++) {
      const both = nameSlots[a][1].filter((x) => nameSlots[b][1].includes(x));
      if (both.length) { n++; console.log(`${k} | ${it.stage}#${cnt[it.stage]} | ${nameSlots[a][0]}&${nameSlots[b][0]} share ${both.join("/")} | ${text.slice(0, 90)}`); }
    }
  }
}
console.log("hits:", n);
