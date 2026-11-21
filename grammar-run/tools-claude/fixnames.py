#!/usr/bin/env python3
# Adds a NAME-CLASH FIX block to an authored topic (A1-A2 clean-up, 21 Nov 2026).
#   python3 grammar-run/tools-claude/fixnames.py <topic-key> [...]
# After the items are built, any one-word capitalised slot filler that is also printed in
# the same item, or shared by two name slots in one item, is swapped for a listener-pool
# name that the item does not print and no other slot of the item uses.
import re, sys

BLOCK = '''// Name-clash fix (Claude, 21 Nov 2026): a name slot never repeats a person printed in the
// same item, and two name slots in one item never share a name.
{
  const POOL = ["Dilnoza", "Sardor", "Nodira", "Akmal", "Gulnora", "Jamshid", "Feruza", "Otabek", "Zarina", "Sherzod", "Malika", "Ulugbek"];
  const isName = (x) => /^[A-Z][a-z]+$/.test(String(x));
  for (const it of items) {
    if (!["choose", "build", "transform"].includes(it.stage) || !it.slots) continue;
    const printed = [it.prompt, it.source, it.hint, it.instr].filter(Boolean).join(" ").replace(/\\{[a-z0-9_]+\\}/gi, " ");
    const used = new Set(Object.values(it.slots).flat());
    const fresh = () => POOL.find((p) => !used.has(p) && !new RegExp(`\\\\b${p}\\\\b`).test(printed));
    const seen = new Set();
    for (const [k, vals] of Object.entries(it.slots)) {
      const nameSlot = vals.every(isName);
      it.slots[k] = vals.map((v) => {
        const clash = isName(v) && (new RegExp(`\\\\b${v}\\\\b`).test(printed) || (nameSlot && seen.has(v)));
        if (!clash) return v;
        const r = fresh(); used.add(r); return r;
      });
      if (nameSlot) it.slots[k].forEach((v) => seen.add(v));
    }
  }
}
'''

for key in sys.argv[1:]:
    p = f"tools/grammar-practice/authored/{key}.mjs"
    s = open(p).read()
    if "Name-clash fix (Claude, 21 Nov 2026)" in s:
        print("already", key); continue
    m = re.search(r"^const items = \[.*?\];\n", s, re.M)
    assert m, key
    s = s[: m.end()] + BLOCK + s[m.end():]
    open(p, "w").write(s)
    print("ok", key)
