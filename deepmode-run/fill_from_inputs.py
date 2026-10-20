"""Base44 AI helper: drafts/batch_NNN.draft.json -> outputs/batch_NNN.json.
Copies word_id / word_ids / cefr / corpus_definition from inputs/batch_NNN.json so ids are never hand-typed.
A draft map may set "rows": [i, ...] to pick which input rows it covers (default: all rows of its group).
Refuses to overwrite an existing output (tandem rule) unless --force is given (own file, fix rounds)."""
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__))
n = sys.argv[1]
out = os.path.join(here, "outputs", f"batch_{n}.json")
if os.path.exists(out) and "--force" not in sys.argv:
    sys.exit(f"{out} exists, skipping")
groups = {g["headword"]: g for g in json.load(open(os.path.join(here, "inputs", f"batch_{n}.json")))}
order = ["A1", "A2", "B1", "B2", "C1"]
maps = []
for d in json.load(open(os.path.join(here, "drafts", f"batch_{n}.draft.json"))):
    g = groups[d["headword"]]
    rows = [g["rows"][i] for i in d.pop("rows", range(len(g["rows"])))]
    m = {"headword": d.pop("headword"), "word_id": rows[0]["word_id"], "word_ids": [r["word_id"] for r in rows],
         "cefr": min((r["cefr"] for r in rows), key=order.index), "kind": d.pop("kind"),
         "sense_label": d.pop("sense_label"), "sense_pos": d.pop("sense_pos"),
         "corpus_definition": rows[0]["corpus_definition"]}
    m.update(d)
    maps.append(m)
json.dump(maps, open(out, "w"), ensure_ascii=False, indent=1)
print(f"wrote {len(maps)} maps to {out}")