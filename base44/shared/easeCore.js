// Soft landing ("ease mode"), Comeback Revamp Phase 1, Claude 2026-11-10.
//
// Why: the students who quit were failing. Real rounds (Nov 2026): 4/12, 3/12,
// 5/12 at their own registered level, then they never came back. The planned
// calibration (levels.js CAL_*) needs 5 bad rounds before it reacts and was
// never wired; nobody who is failing stays for 5 rounds.
//
// What: after TWO low rounds in a row the Skill Hub quietly serves easier
// words and shorter rounds. After TWO good rounds in a row it returns to
// normal. Nothing is stored: the state is replayed from the learner's last
// rounds, so it can never drift from the evidence, and User.cefr_level is
// never changed (the skill tree and its locks stay exactly where they are).
//
// Plain JS so node/deno tests can import it.

export const EASE_LOW = 40;        // a round at or below this is "low" (matches CAL_DOWN_SCORE)
export const EASE_HIGH = 70;       // a round at or above this is "good"
export const EASE_MIN_ITEMS = 5;   // tiny rounds say nothing
export const EASE_WINDOW = 10;     // how many recent rounds are replayed

const isReward = (r) => r?.game === 'mission' || /^(mission|streak):/.test(String(r?.round_id || ''));

/** receipts: evidence RoundReceipts, NEWEST FIRST. Returns { on, lows, highs }. */
export function easeFrom(receipts = []) {
  const rounds = receipts
    .filter((r) => !isReward(r) && (!r.status || r.status === 'done') && Number(r.items_total) >= EASE_MIN_ITEMS)
    .slice(0, EASE_WINDOW)
    .reverse(); // oldest -> newest
  let on = false, lows = 0, highs = 0;
  for (const r of rounds) {
    const pct = (100 * (Number(r.items_credit) || 0)) / Number(r.items_total);
    if (pct <= EASE_LOW) { lows++; highs = 0; if (lows >= 2) on = true; }
    else if (pct >= EASE_HIGH) { highs++; lows = 0; if (highs >= 2) on = false; }
    else { lows = 0; highs = 0; }
  }
  return { on, lows, highs };
}
