// Coin / XP balance updates that never lose a reward (VT-48, Claude 2026-11-03).
//
// The problem: UserCoins is incremented with updateMany ($inc), and Base44
// allows 50 bulk updates per minute per caller. Every student's reward runs as
// the service role, so they all share ONE bucket. Before this, a 429 threw
// after the RewardEvent and receipt already existed; the client's retry was
// then treated as a duplicate, and the coins were lost for good.
//
// Now every new RewardEvent carries coins_state:
//   applying  this request owns it and is incrementing right now
//   applied   the balance includes it
//   pending   the increment failed; the next round (or the admin sweep) applies it
// Legacy rows have no coins_state and are never touched.
//
// Exactly-once: the normal path costs one bulk call, as before. A pending row
// is only re-applied after an atomic claim (updateMany on a single id plus the
// condition coins_state:'pending', checked at write time, then `updated`).
// If anything fails mid-way the row is left 'applying': never auto-applied
// again (no double credit) and visible to the admin sweep as stuck.
//
// Plain JS so node tests can import it.

const DELAYS_MS = [400, 1000, 2000];

export function isRateLimited(e) {
  const s = e?.status ?? e?.response?.status ?? e?.statusCode;
  if (s === 429) return true;
  return /\b429\b|rate.?limit|too many requests/i.test(String(e?.message || e || ''));
}

const realSleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Retries only rate-limit errors, with jitter. Other errors throw at once.
export async function withRetry(fn, { sleep = realSleep, delays = DELAYS_MS, random = Math.random } = {}) {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (!isRateLimited(e) || i >= delays.length) throw e;
      await sleep(Math.round(delays[i] * (0.75 + random() * 0.5)));
    }
  }
}

async function increment(svc, me, amount, correct, opts) {
  const coins = (await svc.UserCoins.filter({ user_id: me.id }, 'created_date', 1))?.[0];
  if (coins) {
    await withRetry(() => svc.UserCoins.updateMany({ id: coins.id }, { $inc: { coins: amount, total_correct: correct } }), opts);
  } else {
    await svc.UserCoins.create({
      user_id: me.id, email: me.email, user_name: me.display_name || me.full_name || me.email,
      classroom_code: me.classroom_code || '', coins: amount, total_correct: correct,
    });
  }
}

// Apply an event this request created with coins_state 'applying'.
// Returns 'applied' | 'pending' | 'stuck'. Never throws.
export async function applyOwnEvent(svc, me, ev, opts = {}) {
  try {
    await increment(svc, me, ev.amount || 0, ev.items_correct || 0, opts);
  } catch (e) {
    console.error('coins increment failed, left pending', e?.message || e);
    try { await svc.RewardEvent.update(ev.id, { coins_state: 'pending' }); return 'pending'; }
    catch (e2) { console.error('coins could not be marked pending (stuck applying)', ev.id, e2?.message); return 'stuck'; }
  }
  try { await svc.RewardEvent.update(ev.id, { coins_state: 'applied' }); return 'applied'; }
  catch (e) { console.error('coins applied but state not saved (stuck applying)', ev.id, e?.message); return 'stuck'; }
}

// Claim + apply this learner's pending events. Cheap when nothing is pending
// (one filter). Returns how many were applied.
export async function reconcilePending(svc, me, opts = {}) {
  const pending = (await svc.RewardEvent.filter({ user_email: me.email, coins_state: 'pending' }, 'created_date', 20)) || [];
  let applied = 0;
  for (const ev of pending) {
    let claim;
    try { claim = await svc.RewardEvent.updateMany({ id: ev.id, coins_state: 'pending' }, { $set: { coins_state: 'applying' } }); }
    catch (e) { console.error('pending claim failed, try next round', e?.message); break; }
    if (!claim?.updated) continue; // someone else got it
    if ((await applyOwnEvent(svc, me, ev, opts)) === 'applied') applied++;
  }
  return applied;
}
