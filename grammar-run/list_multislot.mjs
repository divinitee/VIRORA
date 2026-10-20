// Prints every item with 2+ slots and its fillers, one line each, so a human
// (or the next agent) can read the worst pairings before a topic ships.
// Rule 12 in HANDOFF.md. Usage: node grammar-run/list_multislot.mjs <topic.key> [...]
import fs from "fs";
for (const k of process.argv.slice(2)) {
  const items = JSON.parse(fs.readFileSync(`content/grammar-practice/${k}.json`, "utf8"));
  console.log("#### " + k);
  for (const it of items) {
    const s = it.slots || {};
    const ks = Object.keys(s);
    if (ks.length < 2) continue;
    const txt = [it.prompt, it.source, it.hint].filter(Boolean).join(" || ").replace(/\s+/g, " ").slice(0, 110);
    console.log(`${it.stage[0]}|${txt} :: ${ks.map((x) => x + "=" + s[x].join("/")).join(" ; ")}`);
  }
}
