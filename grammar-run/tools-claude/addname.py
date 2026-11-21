# Claude's authoring helper (wave C): for authored lines whose slots end with "x: [] }" and that have no
# {name}, append ", {name}" to every sentence string and replace x: [] with name: NAME. Quick fix only.
import sys, re
p = sys.argv[1]; s = open(p).read(); out = []; n = 0
for line in s.split("\n"):
    if ("x: [] }" in line or "x: [], y: [] }" in line) and "{name}" not in line and "______" in line:
        def fix(m):
            t = m.group(1)
            if " " in t and re.search(r"[.?!]$", t) and not t.startswith("Write ") and not t.startswith("Rewrite"):
                return '"' + t[:-1] + ", {name}" + t[-1] + '"'
            return m.group(0)
        line2 = re.sub(r'"((?:[^"\\]|\\.)*)"', fix, line)
        line2 = line2.replace("x: [], y: [] }", "name: NAME }").replace("x: [] }", "name: NAME }")
        if line2 != line: n += 1
        line = line2
    out.append(line)
open(p, "w").write("\n".join(out)); print("lines changed:", n)
