// VT-40 session recap (Tee, 30 Oct 2026): "you did this, you learnt this, you moved this
// much". Pure, so it is tested without a browser. Every number comes from something real:
//   - before: the SERVER's label for each item when THIS RUN started (getMap, fetched as
//             the run begins and only kept if it arrived before anything was submitted).
//             GPT audit 31 Oct: plan-time labels can predate the run (e.g. a learner who
//             left mid-word sent those answers, then resumed), so they are not used.
//   - after:  the label the SERVER gives the same item once the run's answers are
//             saved (getMap, called after the awaited submissions)
//   - answers: what the learner actually answered in this run (word questions as graded
//             by the same rule as the server; grammar rounds from PracticeRunner's summary)
//   - minutes: the server's spent_minutes for this session
// Nothing is estimated or invented: a missing map (getMap failed) just means no
// "moved up" section, never a guessed one.

export const RANK = { "New": 0, "Needs work": 1, "Practising": 2, "Strong": 3 };

/**
 * @param {object} p
 * @param {Array}  p.planItems  getToday plan items at the start of the run ({ item_key, item_type, word_id, label })
 * @param {object} p.words      item_key -> { right, total } for words answered in this run
 * @param {object} p.grammar    item_key -> { correct, total } for grammar rounds finished in this run
 * @param {object} [p.baseline] getMap result when the run STARTED, or null when it wasn't captured in time
 * @param {object} [p.map]      getMap result after the run ({ words:[], grammar:[] } with item_key + label), or null
 * @param {object} [p.session]  getToday session after the run ({ spent_minutes })
 * @param {object} [p.names]    word_id -> English headword (for display)
 */
const labelsOf = (m) => (m ? Object.fromEntries([...(m.words || []), ...(m.grammar || [])].map((i) => [i.item_key, i.label])) : null);

export function buildRecap({ planItems = [], words = {}, grammar = {}, baseline = null, map = null, session = null, names = {} } = {}) {
  const before = Object.fromEntries(planItems.map((i) => [i.item_key, i]));
  const start = labelsOf(baseline);
  // Progress needs BOTH ends measured by the server around this run; otherwise it is not claimed.
  const after = start ? labelsOf(map) : null;

  const wordKeys = Object.keys(words).filter((k) => words[k]?.total > 0);
  const grammarKeys = Object.keys(grammar).filter((k) => grammar[k]?.total > 0);
  const right = wordKeys.reduce((s, k) => s + words[k].right, 0) + grammarKeys.reduce((s, k) => s + grammar[k].correct, 0);
  const total = wordKeys.reduce((s, k) => s + words[k].total, 0) + grammarKeys.reduce((s, k) => s + grammar[k].total, 0);

  const nameOf = (key) => {
    const it = before[key];
    if (it?.item_type === "word") return names[it.word_id] || null;
    return key.startsWith("grammar:") ? key : null;
  };
  const moved = [], learned = [], again = [];
  for (const key of [...wordKeys, ...grammarKeys]) {
    const from = (start && start[key]) || "New"; // not on the map yet = never practised = New
    const to = after ? after[key] : undefined;
    const name = nameOf(key);
    if (!name) continue;
    const res = words[key] || grammar[key];
    const missed = words[key] ? res.right < res.total : res.correct / res.total < 0.6;
    let progressed = false;
    if (to && RANK[to] !== undefined) {
      if (from === "New" && RANK[to] >= RANK["Practising"]) { learned.push({ key, name, to }); progressed = true; }
      else if (from !== "New" && RANK[to] > RANK[from]) { moved.push({ key, name, from, to }); progressed = true; }
    }
    // One message per item: an item the server says improved is shown as progress, not also
    // as "worth another look" (that read as a contradiction on the 30 Oct screenshot).
    if (!progressed && (missed || to === "Needs work")) again.push({ key, name, kind: words[key] ? "word" : "grammar" });
  }
  return {
    words: wordKeys.length,
    grammar: grammarKeys.length,
    answers: total,
    accuracy: total ? Math.round((right / total) * 100) : null,
    minutes: Math.max(0, Math.round(Number(session?.spent_minutes) || 0)),
    moved,
    learned,
    again: again.slice(0, 6),
    hasMap: !!after,
  };
}
