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
 * Reload recovery (15 Oct). A per-device copy of everything not yet saved, in
 * localStorage under one key per account:
 *   rounds   payloads that were built (round_id fixed) but not yet confirmed saved
 *   pending  per browser tab: answers still waiting to become rounds
 *            ({ session_key, entries, completed, touched_at })
 * After a reload, recover() turns them back into rounds and sends them. A resent
 * round keeps its round_id, so a round that did land is deduplicated by the server.
 * Pending answers are claimed only by the SAME tab (sessionStorage tab id survives a
 * reload) or once abandoned for 10 minutes. When a tab's answers are taken that way,
 * a tombstone (claimed[tab] = n) tells that tab, if it is in fact still open, to drop
 * those first n answers from memory, so the same answers are never sent under two
 * round_ids. Anything older than 7 days is dropped. If storage is unavailable
 * (private mode, quota), everything still works in memory as before.
 */
export const STORE_PREFIX = "virora.coach.answers.v1:";
export const ABANDONED_MS = 10 * 60 * 1000;
export const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export function createAnswerStore(storage, { now = () => Date.now() } = {}) {
  const key = (email) => STORE_PREFIX + String(email || "").toLowerCase();
  const empty = () => ({ v: 1, rounds: [], pending: {}, claimed: {} });
  return {
    now,
    read(email) {
      try {
        const d = JSON.parse(storage?.getItem(key(email)) || "null");
        return d && d.v === 1 && Array.isArray(d.rounds) && d.pending && typeof d.pending === "object" ? { claimed: {}, ...d } : empty();
      } catch { return empty(); }
    },
    write(email, d) {
      try {
        if (!d.rounds.length && !Object.keys(d.pending).length && !Object.keys(d.claimed || {}).length) storage?.removeItem(key(email));
        else storage?.setItem(key(email), JSON.stringify(d));
        return true;
      } catch { return false; /* storage unavailable: memory only */ }
    },
  };
}

/**
 * One sender per page load. submit(email, payload) resolves to the server's reply,
 * or null / throws on failure (progressClient.submitEvidence returns null).
 * flush() resolves true when nothing is left unsent for that email. Flushes run one
 * after another, so `await flush()` means every answer queued so far has been tried.
 * Unsent rounds outlive the Session component (Back, Done, Keep going); with a
 * `store` they also outlive a reload (recover()).
 */
export function createAnswerSender(submit, { store = null } = {}) {
  const unsent = []; // { email, payload, at }
  const inflight = []; // being sent right now: still persisted until confirmed
  let chain = Promise.resolve();
  const now = () => (store ? store.now() : Date.now());
  // The stored rounds are always exactly: in flight + unsent, for that account.
  function persistRounds(email, mutatePending) {
    if (!store) return;
    const d = store.read(email);
    d.rounds = [...inflight, ...unsent].filter((r) => r.email === email).map((r) => ({ payload: r.payload, at: r.at }));
    if (mutatePending) mutatePending(d.pending);
    store.write(email, d);
  }
  async function sendAll(email) {
    const mine = [];
    for (let i = 0; i < unsent.length;) {
      if (unsent[i].email === email) mine.push(...unsent.splice(i, 1)); else i++;
    }
    inflight.push(...mine);
    let ok = true;
    for (const r of mine) {
      let res = null;
      try { res = await submit(email, r.payload); } catch { res = null; }
      inflight.splice(inflight.indexOf(r), 1);
      if (!res) { unsent.push(r); ok = false; }
      persistRounds(email);
    }
    return ok;
  }
  const run = (email) => { const p = chain.then(() => sendAll(email)); chain = p.catch(() => {}); return p; };
  return {
    // rounds: ready-made payloads (a Coach grammar round, 15 Oct) queued as-is, with
    // their own round_id, so a failed grammar save is retried exactly like word rounds.
    // tabId: this tab's staged answers are replaced by the rounds built from them in
    // ONE storage write, so a reload can never see them twice or not at all.
    flush({ email, entries = [], rounds = [], completed, sessionKey, newRoundId, tabId }) {
      if (!email) return Promise.resolve(false);
      const at = now();
      for (const payload of rounds) unsent.push({ email, payload, at });
      const taken = tabId && store ? Number(store.read(email).claimed?.[tabId]?.n) || 0 : 0; // sent by another tab already
      const mine = taken ? entries.slice(taken) : entries;
      if (mine.length) for (const payload of roundsFor(mine, { completed, sessionKey, newRoundId })) unsent.push({ email, payload, at });
      if (store) {
        const d = store.read(email);
        d.rounds = [...inflight, ...unsent].filter((r) => r.email === email).map((r) => ({ payload: r.payload, at: r.at }));
        if (tabId) { delete d.pending[tabId]; delete d.claimed[tabId]; }
        store.write(email, d);
      }
      return run(email);
    },
    /** Keep this tab's not-yet-sent answers on the device (called after every answer). */
    // If another tab took this tab's answers (tombstone), they are dropped from `entries`
    // (the caller's in-memory array) first, so they are never sent twice.
    stage(email, tabId, { sessionKey, entries = [], completed = [] }) {
      if (!store || !email || !tabId) return;
      const d = store.read(email);
      const taken = Number(d.claimed?.[tabId]?.n) || 0;
      if (taken) { entries.splice(0, taken); delete d.claimed[tabId]; }
      if (entries.length) d.pending[tabId] = { session_key: sessionKey, entries, completed: [...completed], touched_at: now() };
      else delete d.pending[tabId];
      store.write(email, d);
    },
    /**
     * After a reload: requeue stored rounds (same round_id) and turn this tab's (or an
     * abandoned tab's) staged answers into rounds, then send. { found, ok }: found =
     * rounds that were waiting (stored or already queued), ok = all of them saved.
     */
    recover(email, { tabId, newRoundId }) {
      if (!store || !email) return Promise.resolve({ found: 0, ok: true });
      const d = store.read(email);
      const t = now();
      const known = new Set([...inflight, ...unsent].map((r) => r.payload?.round_id));
      let found = 0;
      for (const r of d.rounds) {
        if (!r?.payload?.round_id || known.has(r.payload.round_id) || t - (Number(r.at) || 0) > MAX_AGE_MS) continue;
        unsent.push({ email, payload: r.payload, at: Number(r.at) || t });
        known.add(r.payload.round_id);
        found++;
      }
      const claimed = [], tombstones = {};
      for (const [tid, p] of Object.entries(d.pending)) {
        const age = t - (Number(p?.touched_at) || 0);
        if (age > MAX_AGE_MS) { claimed.push(tid); continue; } // too old: dropped
        if (tid !== tabId && age < ABANDONED_MS) continue;       // another open tab's answers
        claimed.push(tid);
        if (tid !== tabId) tombstones[tid] = { n: (Number(d.claimed?.[tid]?.n) || 0) + (p.entries || []).length, at: t };
        for (const payload of roundsFor(p.entries || [], { completed: new Set(p.completed || []), sessionKey: p.session_key, newRoundId })) {
          unsent.push({ email, payload, at: t });
          found++;
        }
      }
      persistRounds(email, (pending) => { for (const tid of claimed) delete pending[tid]; });
      if (Object.keys(tombstones).length || Object.keys(d.claimed || {}).length) {
        const d2 = store.read(email);
        for (const [tid, v] of Object.entries(d2.claimed || {})) if (t - (Number(v?.at) || 0) > MAX_AGE_MS) delete d2.claimed[tid];
        Object.assign(d2.claimed, tombstones);
        store.write(email, d2);
      }
      // found = rounds waiting for this account, including ones already queued in this page
      // (a Try again after a failed recovery must still report them, so the plan reloads).
      found = [...inflight, ...unsent].filter((r) => r.email === email).length;
      if (!found) return Promise.resolve({ found: 0, ok: true });
      return run(email).then((ok) => ({ found, ok }));
    },
    unsentCount: (email) => [...inflight, ...unsent].filter((r) => !email || r.email === email).length,
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
