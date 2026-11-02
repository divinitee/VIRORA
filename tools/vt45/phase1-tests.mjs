// node tools/vt45/phase1-tests.mjs   (from the app root)
// VT-45 phase 1: self-reported rounds count 0.6 on the skill bars and can't
// reach "high" confidence alone. Pure progressCore checks.
import {
  ATTESTED_WEIGHT, CONFIDENCE_HIGH_MIN, CONFIDENCE_MEDIUM_MIN, groupRounds, masteryOf, presentState,
  skillConfidence, stateFrom, confidenceFor, replayPeak,
} from "../../base44/shared/progressCore.js";

let fails = 0, n = 0;
const eq = (got, want, msg) => {
  n++;
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}${ok ? "" : `  got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
  if (!ok) fails++;
};
const at = (i) => new Date(Date.UTC(2026, 10, 1, 0, i)).toISOString();
const round = (i, credit, total, kind) => ({ round_id: `r${i}`, at: at(i), credit, total, verified: true,
  attested: kind === "self", server: kind === "server" });

eq(ATTESTED_WEIGHT, 0.6, "weight is 0.6, same as the Coach");

// Mastery
eq(masteryOf([round(1, 10, 10, "self"), round(2, 10, 10, "self")]), 100, "all self-reported, all right: plain average kept (100)");
eq(masteryOf([round(1, 5, 10, "self")]), 50, "all self-reported: plain average kept (50)");
eq(masteryOf([round(1, 10, 10, "self"), round(2, 0, 10, "server")]), Math.round(100 * 6 / 16), "mixed: server round pulls harder (38, was 50)");
eq(masteryOf([round(1, 0, 10, "self"), round(2, 10, 10, "server")]), Math.round(100 * 10 / 16), "mixed the other way: 63 (was 50)");
eq(masteryOf([round(1, 7, 10, "server"), round(2, 3, 10, "server")]), 50, "all server-checked: unchanged");
eq(masteryOf([{ round_id: "l", at: at(0), credit: 4, total: 10, verified: false }]), 40, "legacy rounds unchanged (weight 1)");

// Confidence
eq(skillConfidence(CONFIDENCE_HIGH_MIN + 5, 0), "medium", "lots of self-reported rounds alone: capped at medium");
eq(skillConfidence(CONFIDENCE_HIGH_MIN, CONFIDENCE_HIGH_MIN), "high", "enough server-checked rounds: high");
eq(skillConfidence(CONFIDENCE_HIGH_MIN + 3, CONFIDENCE_HIGH_MIN - 1), "medium", "one short of the server-checked minimum: medium");
eq(skillConfidence(CONFIDENCE_HIGH_MIN + 3, undefined), "medium", "unknown server count (pre-VT-45 row): medium until recomputed");
eq(skillConfidence(CONFIDENCE_MEDIUM_MIN, 0), "medium", "medium needs no server proof");
eq(skillConfidence(CONFIDENCE_MEDIUM_MIN - 1, 0), "low", "low unchanged");
eq(confidenceFor(CONFIDENCE_HIGH_MIN), "high", "confidenceFor unchanged (leaf state still uses it)");

// stateFrom
const selfOnly = Array.from({ length: 12 }, (_, i) => round(i, 9, 10, "self"));
const s1 = stateFrom({ verified: selfOnly, legacy: [], verifiedCount: 12, legacyCount: 0 }, Date.parse(at(20)));
eq([s1.current_mastery, s1.confidence, s1.server_checked_rounds], [90, "medium", 0], "12 self-reported rounds at 90%: mastery 90, confidence medium");
const serverOnly = Array.from({ length: 12 }, (_, i) => round(i, 9, 10, "server"));
const s2 = stateFrom({ verified: serverOnly, legacy: [], verifiedCount: 12, legacyCount: 0 }, Date.parse(at(20)));
eq([s2.current_mastery, s2.confidence, s2.server_checked_rounds], [90, "high", 12], "12 server-checked rounds: high");
const s3 = stateFrom({ verified: serverOnly.slice(0, 10), legacy: [], verifiedCount: 40, serverCount: 30, legacyCount: 0 }, Date.parse(at(20)));
eq([s3.server_checked_rounds, s3.confidence], [30, "high"], "recompute path: full server count passed in wins over the window");
eq(presentState({ ...s1, verified_rounds: 12 }).confidence, "medium", "presentState re-derives the capped confidence");
eq(presentState({ verified_rounds: 12, current_mastery: 80 }).confidence, "medium", "presentState: old row without server count is capped");

// groupRounds (rebuild path) must agree with receipts (recompute path)
const rows = [
  { round_id: "a", round_at: at(1), correct: true, verification: "client_attested" },
  { round_id: "a", round_at: at(1), correct: false, verification: "client_attested" },
  { round_id: "b", round_at: at(2), correct: true, verification: "server_graded" },
];
const g = groupRounds(rows, (r) => (r.correct ? 1 : 0));
eq(g.map((r) => [r.round_id, r.total, r.credit, r.attested, r.server]), [["a", 2, 1, true, false], ["b", 1, 1, false, true]], "groupRounds flags self-reported and server-checked rounds");
const ai = groupRounds([{ round_id: "c", created_date: at(3), score: 80 }], () => 0.8, "server_ai");
eq([ai[0].attested, ai[0].server], [false, true], "AiGradedItem rows (no verification field) count as server_ai");
const rebuilt = stateFrom({ verified: g, legacy: [], verifiedCount: g.length, legacyCount: 0 }, Date.parse(at(20)));
const receipts = stateFrom({ verified: [round(1, 1, 2, "self"), round(2, 1, 1, "server")], legacy: [], verifiedCount: 2, serverCount: 1, legacyCount: 0 }, Date.parse(at(20)));
eq([rebuilt.current_mastery, rebuilt.server_checked_rounds], [receipts.current_mastery, receipts.server_checked_rounds], "rebuild and recompute agree");
eq(replayPeak(g, []) >= rebuilt.current_mastery, true, "peak replay uses the weighted mastery");

console.log(fails ? `\n${fails}/${n} FAILED` : `\nALL PASS (${n})`);
process.exit(fails ? 1 : 0);
