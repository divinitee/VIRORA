// Inserts one PROGRESS row right after the last table row (keeps the table whole).
//   node grammar-run/add_row.mjs "| 90 | key | A2 | ... |"   [file, default grammar-run/PROGRESS.md]
import { readFileSync, writeFileSync } from "node:fs";
const row = process.argv[2]; const f = process.argv[3] || "grammar-run/PROGRESS.md";
const lines = readFileSync(f, "utf8").split("\n");
let last = -1; lines.forEach((l, i) => { if (/^\| *\d+ *\|/.test(l)) last = i; });
lines.splice(last + 1, 0, row); writeFileSync(f, lines.join("\n"));
console.log(`row added after line ${last + 1}`);
