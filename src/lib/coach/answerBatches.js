// Coach word answers -> server "quiz" rounds (VT-40, 14 Oct audit finding 1).
//
// progressApi accepts at most 50 items per round (MAX_ITEMS); a long Coach session
// queues far more (a VIP 25-minute plan can hold 120+ word answers). Rules:
//   * every answer is sent, in rounds of <= 50 items;
//   * all answers for one word go in ONE round (one round_id): FSRS rates a word from
//     its first coach round of the day, so a split word would be rated on part of it;
//   * finished words carry the Coach session_key, words left part-way don't (unchanged);
//   * a round whose save fails is kept WITH its round_id and resent by the next flush.
//     The server's claimRound dedupes a round that did land (lost response), so a
//     retry never doubles evidence.
// Pure, no React and no network, so the same code runs in the page and in the tests.

export const MAX_ROUND_ITEMS = 50;

/** [{ key, ev }] -> chunks of <= max entries, never splitting one key's entries (order kept). */
export function packByWord(entries, max = MAX_ROUND_ITEMS) {
  const groups = [];
  const byKey = new Map();
  for (const e of entries || []) {
    let g = byKey.get(e.key);
    if (!g) { g = []; byKey.set(e.key, g); groups.push(g); }
    g.push(e);
  }
  const chunks = [];
  let cur = [];
  for (const g of groups) {
    if (g.length > max) { // cannot happen today (<= 5 questions a word); never drop, split as a last resort
      if (cur.length) { chunks.push(cur); cur = []; }
      for (let i = 0; i < g.length; i += max) chunks.push(g.slice(i, i + max));
      continue;
    }
    if (cur.length + g.length > max) { chunks.push(cur); cur = []; }
    cur.push(...g);
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

/** The submitEvidence payloads for one flush. Each round gets its round_id here, once. */
export function roundsFor(entries, { completed, sessionKey, newRoundId, max = MAX_ROUND_ITEMS }) {
  const done = (p) => completed && completed.has(p.key);
  const finished = (entries || []).filter(done);
  const partial = (entries || []).filter((p) => !done(p));
  const round = (chunk, coach) => ({ game: "quiz", round_id: newRoundId(), items: chunk.map((p) => p.ev), ...(coach ? { coach } : {}) });
  return [
    ...packByWord(finished, max).map((c) => round(c, { session_key: sessionKey })),
    ...packByWord(partial, max).map((c) => round(c, null)),
  ];
}

/**
 * One sender per page load. submit(email, payload) resolves to the server's reply,
 * or null / throws on failure (progressClient.submitEvidence returns null).
 * flush() resolves true when nothing is left unsent for that email. Flushes run one
 * after another, so `await flush()` means every answer queued so far has been tried.
 * Unsent rounds outlive the Session component (Back, Done, Keep going) but not a reload.
 */
export function createAnswerSender(submit) {
  const unsent = []; // { email, payload }
  let chain = Promise.resolve();
  async function sendAll(email) {
    const mine = [];
    for (let i = 0; i < unsent.length;) {
      if (unsent[i].email === email) mine.push(...unsent.splice(i, 1)); else i++;
    }
    let ok = true;
    for (const r of mine) {
      let res = null;
      try { res = await submit(email, r.payload); } catch { res = null; }
      if (!res) { unsent.push(r); ok = false; }
    }
    return ok;
  }
  return {
    // rounds: ready-made payloads (a Coach grammar round, 15 Oct) queued as-is, with
    // their own round_id, so a failed grammar save is retried exactly like word rounds.
    flush({ email, entries = [], rounds = [], completed, sessionKey, newRoundId }) {
      if (!email) return Promise.resolve(false);
      for (const payload of rounds) unsent.push({ email, payload });
      if (entries.length) for (const payload of roundsFor(entries, { completed, sessionKey, newRoundId })) unsent.push({ email, payload });
      const run = chain.then(() => sendAll(email));
      chain = run.catch(() => {});
      return run;
    },
    unsentCount: (email) => unsent.filter((r) => !email || r.email === email).length,
  };
}

/**
 * End of a Coach session (14 Oct audit follow-up): every queued answer must be saved
 * BEFORE Done is shown, because Done is computed by the server from saved answers.
 * One automatic retry after `retryMs`. If answers are still unsaved, resolve "failed"
 * WITHOUT calling onDone: the page shows a save error with Try again instead of a
 * Done screen the server can't back up. The unsent rounds stay queued (createAnswerSender),
 * so Try again resends them with their original round_id.
 */
export async function finishWithSave({ flush, onDone, retryMs = 1500, wait = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  let saved = false;
  try { saved = await flush(); } catch { saved = false; }
  if (!saved) {
    await wait(retryMs);
    try { saved = await flush(); } catch { saved = false; }
  }
  if (!saved) return "failed";
  await onDone();
  return "done";
}
