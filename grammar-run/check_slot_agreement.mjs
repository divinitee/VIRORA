// Flags slot fillers that mix singular and plural where the sentence uses it/is/was/this/a next to the slot.
// Heuristic: review every hit by hand; most are fine (news, series). Usage: node grammar-run/check_slot_agreement.mjs [topic.key]
import fs from "fs";
const only = process.argv[2]; const files = fs.readdirSync("content/grammar-practice").filter(f => f.endsWith(".json") && (!only || f === only + ".json"));
const plural = w => /^(glasses|jeans|shoes|boots|trainers|headphones|scissors|trousers|keys|gloves|documents|photos|letters|messages|parcels|books|chairs|cups|plates|tables|apples|apricots|grapes|cherries|melons|tomatoes|cucumbers|flowers|sweets|biscuits|vegetables|tickets|flights|hotels|notes|drawings|exercises|tasks|tests|series|news|fruit)$/.test(w) || (/s$/.test(w) && !/(ss|us|is|news|series|glass|bus|gas|chess|maths|physics|economics|class|dress)$/.test(w));
for (const f of files) {
  const items = JSON.parse(fs.readFileSync("content/grammar-practice/"+f,"utf8"));
  for (const it of items) {
    const txt = [it.prompt,it.source,it.hint].filter(Boolean).join(" || ");
    for (const [k,vals] of Object.entries(it.slots||{})) {
      const re = new RegExp(`\\{${k}\\}[^.|]{0,40}\\b(it|its|is|was)\\b|\\b(this|that|a|an) \\{${k}\\}`);
      if (!re.test(txt)) continue;
      const mixed = vals.some(plural) && vals.some(v=>!plural(v));
      if (mixed) console.log(f.replace(".json",""), "|", k+"="+vals.join("/"), "|", txt.slice(0,160));
    }
  }
}
