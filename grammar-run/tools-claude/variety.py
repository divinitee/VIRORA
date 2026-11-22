#!/usr/bin/env python3
# Variety pass helper (Claude, 21 Nov 2026, B1 course).
#   python3 grammar-run/tools-claude/variety.py <topic-key> <spec.json>
# spec = {"why": {"choose": [...20], "build": [...20], "transform": [...15]},
#         "slot": [["choose", 3, "word", "slotname", ["v1","v2","v3","v4"]], ...]}
# A slot entry with word "" adds the values to the existing slot "slotname" instead.
# Inserts a VARIETY block just before the topic's writeFileSync(out, ...). Whys are set by
# position in each stage ("" keeps the old one). A slot entry replaces the whole word
# "word" in that item's prompt / source / hint with {slotname} and adds the values.
import json, sys, re

key, spec_path = sys.argv[1], sys.argv[2]
spec = json.load(open(spec_path))
p = f"tools/grammar-practice/authored/{key}.mjs"
s = open(p).read()
if "const VARIETY = " in s:
    s = re.sub(r"// Variety pass \(Claude, 21 Nov 2026\)[\s\S]*?\n// end variety\n", "", s)
block = (
    "// Variety pass (Claude, 21 Nov 2026): one why per item that names this sentence's clue,\n"
    "// and extra slots on thin lines (B1 course).\n"
    "const VARIETY = " + json.dumps(spec, ensure_ascii=False, indent=1) + ";\n"
    "{\n"
    "  const byStage = (st) => items.filter((it) => it.stage === st);\n"
    "  for (const [st, list] of Object.entries(VARIETY.why || {})) {\n"
    "    if (list.length !== byStage(st).length) throw new Error(`VARIETY: ${st} has ${byStage(st).length} items, ${list.length} whys`);\n"
    "    byStage(st).forEach((it, i) => { if (list[i]) it.why = list[i]; });\n"
    "  }\n"
    "  for (const [st, n, word, name, vals] of VARIETY.slot || []) {\n"
    "    const it = byStage(st)[n - 1];\n"
    "    if (!word) { if (!it?.slots?.[name]) throw new Error(`VARIETY: no slot ${name} in ${st} ${n}`); it.slots[name] = [...new Set([...it.slots[name], ...vals])]; continue; }\n"
    "    const re = new RegExp(`(?<![\\\\w{])${word.replace(/[.*+?^${}()|[\\]\\\\]/g, \"\\\\$&\")}(?![\\\\w}])`, \"g\");\n"
    "    let hit = false;\n"
    "    for (const f of [\"prompt\", \"source\", \"hint\"]) if (it?.[f] && re.test(it[f])) { it[f] = it[f].replace(re, `{${name}}`); hit = true; re.lastIndex = 0; }\n"
    "    if (!hit) throw new Error(`VARIETY: \"${word}\" not found in ${st} ${n}`);\n"
    "    it.slots = { ...(it.slots || {}), [name]: vals };\n"
    "  }\n"
    "}\n"
    "// end variety\n"
)
m = re.search(r"^writeFileSync\(", s, re.M)
assert m, "no writeFileSync line"
s = s[: m.start()] + block + s[m.start():]
open(p, "w").write(s)
print("ok", key)
