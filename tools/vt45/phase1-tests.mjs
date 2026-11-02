// node tools/vt45/phase1-tests.mjs   (from the app root)
// VT-45 phase 1: self-reported rounds count 0.6 on the skill bars and can't
// reach "high" confidence alone. Pure progressCore checks.
import {
  ATTESTED_WEIGHT, CONFIDENCE_HIGH_MIN, CONFIDENCE_MEDIUM_MIN, groupRounds, masteryOf, presentState,
  skillConfidence, stateFrom, confidenceFor, replayPeak,
} from "../../base44/shared/progressCore.js";
import { bestCheckAfter, checkFromReceipt, storedCheck, CROSSWORD_CHECK } from "../../base44/shared/homeworkCheck.js";

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

// Homework score checks (GPT semi-final audit: three states, no inference)
eq(checkFromReceipt({ verification: "server_graded" }), "server_verified", "receipt server_graded → server_verified");
eq(checkFromReceipt({ verification: "server_ai" }), "server_verified", "receipt server_ai → server_verified");
eq(checkFromReceipt({ verification: "client_attested" }), "self_checked", "receipt client_attested → self_checked");
eq(checkFromReceipt({}), "unknown", "receipt without verification → unknown (not guessed)");
eq(checkFromReceipt({ verification: "whatever" }), "unknown", "unrecognised verification → unknown");
eq(CROSSWORD_CHECK, "self_checked", "crossword (client says solved, no scored round) → self_checked");
eq(bestCheckAfter(null, 80, "self_checked"), "self_checked", "first submission: best takes this round's check");
eq(bestCheckAfter({ best_score_pct: 70, best_score_check: "server_verified" }, 90, "self_checked"), "self_checked", "new best replaces the check");
eq(bestCheckAfter({ best_score_pct: 90, best_score_check: "server_verified" }, 80, "self_checked"), "server_verified", "lower score keeps the best's check");
eq(bestCheckAfter({ best_score_pct: 90, best_score_check: "server_verified" }, 90, "self_checked"), "server_verified", "a tie keeps the original best's check");
eq(bestCheckAfter({ best_score_pct: 90 }, 50, "server_verified"), "unknown", "pre-VT-45 best stays unknown when not beaten");
eq(storedCheck(undefined, 75), "unknown", "teacher view: old submission → unknown, never guessed from the game");
eq(storedCheck("self_checked", 75), "self_checked", "teacher view: stored state shown as is");
eq(storedCheck("client_attested", 75), "unknown", "teacher view: a raw/unknown value is never mapped to a state");
eq(storedCheck(undefined, null), null, "teacher view: no score → no label");
const tApi = (await import("node:fs")).readFileSync("base44/functions/teacherApi/entry.ts", "utf8");
eq(/SERVER_GRADED_HOMEWORK|selfChecked\(/.test(tApi), false, "teacherApi: the game-type exclusion list is gone");

// Trust boundary (static): who can write the fields the confidence cap and
// the homework label rely on.
const fsx = await import("node:fs");
const rls = (e) => JSON.parse(fsx.readFileSync(`base44/entities/${e}.jsonc`, "utf8")).rls || {};
for (const e of ["SkillState", "RoundReceipt", "HomeworkSubmission", "WordAttempt", "GrammarAttempt", "AiGradedItem"]) {
  const r = rls(e);
  eq(["create", "update", "delete"].map((op) => r[op]?.user_condition?.role), ["admin", "admin", "admin"], `${e}: students can't create/update/delete (admin/service only)`);
}
const walk = (d) => fsx.readdirSync(d, { withFileTypes: true }).flatMap((x) => x.isDirectory() ? walk(`${d}/${x.name}`) : /\.(js|jsx|ts)$/.test(x.name) ? [`${d}/${x.name}`] : []);
const writers = (re) => [...walk("src"), ...walk("base44")].filter((f) => re.test(fsx.readFileSync(f, "utf8")));
eq(writers(/SkillState\.(create|update|bulkCreate|updateMany)\(/), ["base44/shared/progressEngine.ts"], "SkillState is written only by progressEngine (server)");
eq(writers(/RoundReceipt\.(create|update|bulkCreate|updateMany)\(/).sort(), ["base44/functions/progressApi/entry.ts", "base44/shared/progressEngine.ts"], "RoundReceipt (incl. verification) is written only by progressApi/progressEngine");
eq(writers(/HomeworkSubmission\.(create|update|bulkCreate|updateMany)\(/), ["base44/functions/studentApi/entry.ts"], "HomeworkSubmission is written only by studentApi (server)");

console.log(fails ? `\n${fails}/${n} FAILED` : `\nALL PASS (${n})`);
process.exit(fails ? 1 : 0);
