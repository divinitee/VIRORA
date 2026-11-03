// VT-48 tests: node tools/coins-tests/coin-ledger-tests.mjs
// Coins are never lost to a rate limit and never applied twice.
import { applyOwnEvent, reconcilePending, withRetry, isRateLimited } from "../../base44/shared/coinLedger.js";

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : fail++; console.log(`  ${c ? "PASS" : "FAIL"}  ${n}`); };
const noSleep = { sleep: async () => {}, random: () => 0.5 };
const rl = () => Object.assign(new Error("Rate limit exceeded"), { status: 429 });

// Tiny in-memory Base44 with a switchable 429 on UserCoins.updateMany.
function world({ fail429 = 0, failPendingWrite = false } = {}) {
  const db = { UserCoins: [], RewardEvent: [] };
  let n = 0, left429 = fail429;
  const match = (row, q) => Object.entries(q).every(([k, v]) => row[k] === v);
  const handler = (name) => ({
    filter: async (q, _s, lim = 1e9) => db[name].filter((r) => match(r, q)).slice(0, lim),
    create: async (d) => { const r = { id: `${name}-${++n}`, created_date: new Date().toISOString(), ...d }; db[name].push(r); return r; },
    update: async (id, d) => {
      if (failPendingWrite && name === "RewardEvent" && d.coins_state === "pending") throw new Error("boom");
      const r = db[name].find((x) => x.id === id); Object.assign(r, d); return r;
    },
    updateMany: async (q, ops) => {
      if (name === "UserCoins" && left429 > 0) { left429--; throw rl(); }
      const rows = db[name].filter((r) => match(r, q));
      for (const r of rows) {
        for (const [k, v] of Object.entries(ops.$inc || {})) r[k] = (r[k] || 0) + v;
        Object.assign(r, ops.$set || {});
      }
      return { success: true, updated: rows.length, has_more: false };
    },
  });
  return { db, svc: { UserCoins: handler("UserCoins"), RewardEvent: handler("RewardEvent") } };
}
const me = { id: "u1", email: "s@x.uz", full_name: "S" };
const event = (w, amount, state = "applying") => w.svc.RewardEvent.create({ user_email: me.email, amount, items_correct: 1, coins_state: state });

console.log("Rate-limit detection");
ok("status 429", isRateLimited({ status: 429 }));
ok("message mentions rate limit", isRateLimited(new Error("entity_update_bulk rate limit exceeded")));
ok("other errors are not retried", !isRateLimited(new Error("validation failed")));

console.log("Retry");
{
  let calls = 0;
  const r = await withRetry(async () => { if (++calls < 3) throw rl(); return "ok"; }, noSleep);
  ok("succeeds on the 3rd try", r === "ok" && calls === 3);
  let c2 = 0;
  try { await withRetry(async () => { c2++; throw new Error("bad"); }, noSleep); } catch {}
  ok("non-429 error is not retried", c2 === 1);
}

console.log("Normal path");
{
  const w = world();
  await w.svc.UserCoins.create({ user_id: "u1", coins: 10, total_correct: 0 });
  const ev = await event(w, 5);
  ok("applied", (await applyOwnEvent(w.svc, me, ev, noSleep)) === "applied");
  ok("balance 15", w.db.UserCoins[0].coins === 15);
  ok("event marked applied", w.db.RewardEvent[0].coins_state === "applied");
}
{
  const w = world();
  const ev = await event(w, 7);
  await applyOwnEvent(w.svc, me, ev, noSleep);
  ok("first reward creates the balance row", w.db.UserCoins.length === 1 && w.db.UserCoins[0].coins === 7);
}

console.log("Short burst of 429s is absorbed by retry");
{
  const w = world({ fail429: 2 });
  await w.svc.UserCoins.create({ user_id: "u1", coins: 0 });
  const ev = await event(w, 5);
  ok("still applied", (await applyOwnEvent(w.svc, me, ev, noSleep)) === "applied" && w.db.UserCoins[0].coins === 5);
}

console.log("Long 429 → pending → applied on the next round, exactly once");
{
  const w = world({ fail429: 99 });
  await w.svc.UserCoins.create({ user_id: "u1", coins: 0 });
  const ev = await event(w, 5);
  ok("left pending, not lost", (await applyOwnEvent(w.svc, me, ev, noSleep)) === "pending" && w.db.RewardEvent[0].coins_state === "pending");
  ok("balance untouched so far", w.db.UserCoins[0].coins === 0);
  // limit clears
  const w2 = { ...w }; w2.svc.UserCoins.updateMany = world().svc.UserCoins.updateMany; // placeholder, replaced below
}
{
  const w = world({ fail429: 4 }); // exactly 1 + 3 retries fail → pending, then clears
  await w.svc.UserCoins.create({ user_id: "u1", coins: 0 });
  const ev = await event(w, 5);
  await applyOwnEvent(w.svc, me, ev, noSleep);
  ok("pending after the burst", w.db.RewardEvent[0].coins_state === "pending");
  const n = await reconcilePending(w.svc, me, noSleep);
  ok("next round applies it", n === 1 && w.db.UserCoins[0].coins === 5 && w.db.RewardEvent[0].coins_state === "applied");
  ok("second reconcile does nothing", (await reconcilePending(w.svc, me, noSleep)) === 0 && w.db.UserCoins[0].coins === 5);
}

console.log("Concurrent reconciles never double-credit");
{
  const w = world();
  await w.svc.UserCoins.create({ user_id: "u1", coins: 0 });
  await event(w, 5, "pending");
  const [a, b] = await Promise.all([reconcilePending(w.svc, me, noSleep), reconcilePending(w.svc, me, noSleep)]);
  ok("applied once in total", a + b === 1 && w.db.UserCoins[0].coins === 5);
}

console.log("Failure while marking pending → stuck, never auto re-applied");
{
  const w = world({ fail429: 99, failPendingWrite: true });
  await w.svc.UserCoins.create({ user_id: "u1", coins: 0 });
  const ev = await event(w, 5);
  ok("reports stuck", (await applyOwnEvent(w.svc, me, ev, noSleep)) === "stuck");
  ok("stays 'applying' (visible to admin sweep)", w.db.RewardEvent[0].coins_state === "applying");
  ok("reconcile ignores it", (await reconcilePending(w.svc, me, noSleep)) === 0);
}

console.log("Legacy rows are never touched");
{
  const w = world();
  await w.svc.UserCoins.create({ user_id: "u1", coins: 100 });
  await w.svc.RewardEvent.create({ user_email: me.email, amount: 50 }); // no coins_state
  ok("legacy row not applied", (await reconcilePending(w.svc, me, noSleep)) === 0 && w.db.UserCoins[0].coins === 100);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
