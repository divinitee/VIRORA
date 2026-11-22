# Checks a variety spec before use: list sizes, short whys, duplicate whys (Claude, 21 Nov 2026).
import json, sys, collections
s = json.load(open(sys.argv[1])); w = s["why"]; bad = 0
for st, n in (("choose", 20), ("build", 20), ("transform", 15)):
    if len(w[st]) != n: print("SIZE", st, len(w[st])); bad = 1
allw = [x for st in ("choose", "build", "transform") for x in w[st] if x]
for st in ("choose", "build", "transform"):
    for i, x in enumerate(w[st]):
        if x and len(x.split()) < 4: print("SHORT", st, i + 1, x); bad = 1
for x, c in collections.Counter(allw).items():
    if c > 1: print("DUP", c, x); bad = 1
sys.exit(bad)
