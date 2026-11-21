# Build a variety spec that keeps every old why except the ones given (Claude, 21 Nov 2026).
#   python3 mkspec.py <out.json> '<{"c1":"...","b3":"..."}>'
import json, sys
out, a = sys.argv[1], sys.argv[2]
over = json.load(open(a[1:])) if a.startswith("@") else json.loads(a)
spec = {"why": {"choose": [""] * 20, "build": [""] * 20, "transform": [""] * 15}}
st = {"c": "choose", "b": "build", "t": "transform"}
for k, v in over.items():
    spec["why"][st[k[0]]][int(k[1:]) - 1] = v
json.dump(spec, open(out, "w"), ensure_ascii=False, indent=0)
print("spec", out, len(over))
