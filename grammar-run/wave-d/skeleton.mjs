// Shared builder for wave D authored files (Claude, 23 Nov 2026). Every line carries its own why.
// CHOOSE  [options (right one first), why, prompt, slots]
// BUILD   [instr, key, acceptable, why, source, slots]
// TRANSFORM [instr, source, hint, key, why, slots, acceptable?]
// CREATE  [prompt, requiredElement, constraints]   EXPRESS [prompt, targetGrammar, lookFor]
import { writeFileSync } from "node:fs";
export const NAME = ["Dilnoza", "Sardor", "Nodira", "Akmal", "Gulnora", "Jamshid"];
const pick = (text, slots) => { const s = {}; for (const [n, f] of Object.entries(slots || {})) if (text.includes(`{${n}}`)) s[n] = f; return s; };
export function build(BASE, { CHOOSE, BUILD, TRANSFORM, CREATE, EXPRESS }) {
  const items = [
    ...CHOOSE.map(([o, why, prompt, slots], i) => {
      const options = o.map((_, j) => o[(j + i) % o.length]);
      return { ...BASE, stage: "choose", format: "mcq", prompt, options, key: options.indexOf(o[0]), why, slots: pick(prompt, slots) };
    }),
    ...BUILD.map(([instr, key, acceptable, why, source, slots]) => ({ ...BASE, stage: "build", format: "gap_fill", instr, source, key, ...(acceptable && acceptable.length ? { acceptable } : {}), why, slots: pick(source, slots) })),
    ...TRANSFORM.map(([instr, source, hint, key, why, slots, acceptable]) => ({ ...BASE, stage: "transform", format: "rewrite", instr, source, hint, key, ...(acceptable && acceptable.length ? { acceptable } : {}), why, slots: pick(source + hint, slots) })),
    ...CREATE.map(([prompt, requiredElement, constraints]) => ({ ...BASE, stage: "create", format: "constrained_sentence", prompt, requiredElement, constraints })),
    ...EXPRESS.map(([prompt, targetGrammar, lookFor]) => ({ ...BASE, stage: "express", format: "free_response", prompt, targetGrammar, lookFor })),
  ];
  const out = `content/grammar-practice/${BASE.domain}.${BASE.branch}.${BASE.topic}.json`;
  writeFileSync(out, JSON.stringify(items, null, 1) + "\n");
  console.log(`wrote ${items.length} items -> ${out}`);
}
