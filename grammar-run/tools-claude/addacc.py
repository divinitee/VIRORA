#!/usr/bin/env python3
# Adds extra accepted answers to an authored topic file (audit fixes).
#   python3 grammar-run/tools-claude/addacc.py <topic-key> '[["transform", "text in source or hint", ["answer 1", "answer 2"]], ...]'
# It inserts (or extends) an AUDIT_ACC block right after "const items = [...];".
# Only for typed string keys: array keys cannot take "acceptable" (the ingest gate refuses it).
import json, sys, re

key, rules = sys.argv[1], json.loads(sys.argv[2])
path = f"tools/grammar-practice/authored/{key}.mjs"
s = open(path).read()
marker = "const AUDIT_ACC = ["
if marker in s:
    i = s.index(marker) + len(marker)
    add = "".join("\n  " + json.dumps(r, ensure_ascii=False) + "," for r in rules)
    s = s[:i] + add + s[i:]
else:
    m = re.search(r"^const items = \[.*?\];\n", s, re.M)
    assert m, "no items line"
    block = (
        "// Audit 21 Nov (MED/LOW): extra right answers.\n"
        + marker
        + "".join("\n  " + json.dumps(r, ensure_ascii=False) + "," for r in rules)
        + "\n];\n"
        + "for (const [st, m, acc] of AUDIT_ACC) {\n"
        + "  const hit = items.filter((it) => it.stage === st && [it.prompt, it.source, it.hint].filter(Boolean).join(\" \").includes(m));\n"
        + "  if (!hit.length) throw new Error(`AUDIT_ACC: no ${st} item matches ${m}`);\n"
        + "  for (const it of hit) it.acceptable = [...new Set([...(it.acceptable || []), ...acc])];\n"
        + "}\n"
    )
    s = s[: m.end()] + block + s[m.end():]
open(path, "w").write(s)
print("ok", path)
