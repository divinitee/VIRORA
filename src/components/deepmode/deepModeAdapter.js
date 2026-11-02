// WordFamily row (+ its VocabularyWord) -> the word shape deepModeEngine draws.
const SLOTS = ["noun", "verb", "adjective", "adverb"];

const AFFIX_MEANING = {
  "un-": "not", "re-": "again", "dis-": "not, opposite of", "im-": "not", "in-": "not", "il-": "not", "ir-": "not", "mis-": "wrongly", "pre-": "before",
  "-er": "person who", "-or": "person who", "-ness": "state or quality", "-ful": "full of", "-less": "without", "-ly": "in a … way",
  "-able": "can be", "-ible": "can be", "-ment": "action or result", "-ion": "act or result of", "-ation": "act or result of", "-tion": "act or result of",
  "-ity": "state or quality", "-ous": "having", "-ive": "tending to", "-al": "relating to", "-y": "having, like", "-ship": "state or relation", "-dom": "state of", "-hood": "time or state of", "-ize": "make", "-ise": "make", "-en": "make",
  "-ing": "action or thing", "-ty": "state or quality", "-ish": "a bit, like", "-ic": "relating to", "-ance": "action or state",
};

function slotForm(row, slot) {
  const f = (row.forms || []).find((x) => x.slot === slot);
  if (!f || f.status === "no_form" || !f.form) return null;
  if (f.status === "other_meaning") {
    return { w: f.form, def: "(other meaning) " + (f.definition || ""), ex: f.example || "", syn: [], ant: [] };
  }
  return {
    w: f.form, def: f.definition || "", ex: f.example || "",
    syn: (f.syn || []).map((s) => ({ w: s.to, s: s.strength ?? 0.6, note: s.note || "" })),
    ant: (f.ant || []).map((a) => ({ w: a.to, note: a.note || "" })),
  };
}

export function toEngineWord(row, vocabWord) {
  if (!row?.headword || !Array.isArray(row.forms)) return null;
  const forms = {};
  SLOTS.forEach((s) => { forms[s] = slotForm(row, s); });
  // The engine centres on forms[pos]; fall back to the first slot that exists.
  let pos = SLOTS.includes(row.sense_pos) && forms[row.sense_pos] ? row.sense_pos : SLOTS.find((s) => forms[s]);
  if (!pos) return null;
  const existing = new Set(row.forms.filter((f) => f.status === "existing").map((f) => f.form));
  const base = row.forms.find((f) => f.relation === "base");
  return {
    id: row.id,
    word: row.headword,
    level: row.cefr,
    pos,
    tr: { uz: vocabWord?.uzbek || "—", ru: vocabWord?.russian || "—" },
    meaning: base?.definition || forms[pos].def || vocabWord?.english || row.headword,
    forms,
    affixes: (row.affixes || []).filter((a) => a.affix && existing.has(a.in_form)).map((a) => ({
      a: a.affix, kind: a.affix.endsWith("-") ? "prefix" : "suffix", m: AFFIX_MEANING[a.affix] || "", also: a.also || [],
    })),
    context: row.context?.text || "",
    hl: row.context?.uses || [],
  };
}