// Accepted-answer variants that ingest adds to every typed key. Dev-only (lives
// outside src/). Split out of ingest.mjs on 21 Nov 2026 so the tests can check it.
//
// Contractions are a real second valid answer — "doesn't watch" and "does not
// watch" are both correct and a string matcher accepts only one. Expand them
// here rather than asking the author to remember every time.
export const CONTRACTIONS = [["doesn't", "does not"], ["don't", "do not"], ["isn't", "is not"], ["aren't", "are not"],
  // Added 2026-10-07 for topics beyond tenses/present. Unambiguous pairs only:
  // "'s" (is/has) is NOT expanded — list it by hand in the item's own
  // `acceptable` array, which is merged with these.
  ["didn't", "did not"], ["wasn't", "was not"], ["weren't", "were not"], ["hasn't", "has not"],
  ["haven't", "have not"], ["hadn't", "had not"], ["won't", "will not"], ["can't", "cannot"],
  ["couldn't", "could not"], ["shouldn't", "should not"], ["wouldn't", "would not"], ["mustn't", "must not"],
  ["needn't", "need not"], ["mightn't", "might not"], ["I'm", "I am"], ["you're", "you are"],
  ["we're", "we are"], ["they're", "they are"], ["I've", "I have"], ["you've", "you have"],
  ["we've", "we have"], ["they've", "they have"], ["I'll", "I will"], ["you'll", "you will"],
  ["he'll", "he will"], ["she'll", "she will"], ["it'll", "it will"], ["we'll", "we will"], ["they'll", "they will"]];

// 'd short forms (Tee, 21 Nov 2026: accept he'd, I'd …). Full form → short form
// only: "he'd" alone could be had or would, so a short key is never expanded.
// would + any word: "I would come" → "I'd come". had + a past participle only:
// "he had left" → "he'd left", but "he had a dog" stays (he'd a dog is not standard).
const IRREGULAR_PP = new Set(("been done gone seen eaten taken given written spoken broken chosen forgotten " +
  "driven ridden flown known grown thrown drawn worn sung swum drunk begun rung fallen woken hidden frozen " +
  "stolen shown sold told bought brought thought caught taught found left lost made paid sent spent built " +
  "felt kept met read slept heard held stood understood won put cut hit let set shut hurt cost become come " +
  "run sat got had lent meant fed led bent").split(" "));
const isParticiple = (w) => IRREGULAR_PP.has(w) || /^[a-z]{2,}ed$/.test(w);
export function shortD(text) {
  return text.replace(/\b(I|you|he|she|it|we|they) (had|would) ([a-z]+)/gi, (m, who, aux, next) =>
    aux.toLowerCase() === "would" || isParticiple(next.toLowerCase()) ? `${who}'d ${next}` : m);
}

/** Extra accepted answers for one typed string key (null when there are none). */
export function accepted(key, own = []) {
  if (typeof key !== "string") return null;
  const alts = new Set(own);
  for (const [short, long] of CONTRACTIONS) {
    if (key.includes(short)) alts.add(key.replace(short, long));
    if (key.includes(long)) alts.add(key.replace(long, short));
  }
  for (const k of [key, ...own]) alts.add(shortD(k));
  alts.delete(key);
  return alts.size ? [...alts] : null;
}

/**
 * Extra accepted answers for a multi-blank (array) key (Tee, 21 Nov 2026: allow
 * alternatives in two-part answers). `own` is the author's list of whole
 * alternative answers, each an array with one entry per blank. Every part also
 * gets its contraction / 'd variants. Capped so a key cannot explode.
 */
export function acceptedArray(key, own = []) {
  if (!Array.isArray(key)) return null;
  const CAP = 24;
  const seen = new Set([JSON.stringify(key)]);
  const out = [];
  for (const base of [key, ...own]) {
    const choices = base.map((part) => [part, ...(accepted(part) || [])]);
    let combos = [[]];
    for (const c of choices) combos = combos.flatMap((pre) => c.map((x) => [...pre, x])).slice(0, CAP);
    for (const c of combos) {
      const k = JSON.stringify(c);
      if (!seen.has(k)) { seen.add(k); out.push(c); }
    }
  }
  return out.length ? out.slice(0, CAP) : null;
}
