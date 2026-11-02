// VT-45: how a homework score was checked, as the teacher sees it.
// GPT semi-final audit, 2 Nov 2026: three states, and NO inference for old
// submissions.
//
//   server_verified  the server graded every answer (RoundReceipt.verification
//                    server_graded or server_ai)
//   self_checked     the game reported its own answers (client_attested), or
//                    crossword, which has no scored round: the server credits
//                    100% because the client says it was solved
//   unknown          anything else: a receipt with no verification, or a
//                    submission written before VT-45 recorded this at all
//
// The state is copied onto the submission when it's written and never
// guessed afterwards from the game type.
export const HOMEWORK_CHECKS = ["server_verified", "self_checked", "unknown"];

export function checkFromReceipt(receipt) {
  const v = receipt?.verification;
  if (v === "server_graded" || v === "server_ai") return "server_verified";
  if (v === "client_attested") return "self_checked";
  return "unknown";
}

// Crossword: no RoundReceipt, the client reports "solved".
export const CROSSWORD_CHECK = "self_checked";

// The best score keeps the check of the round that set it. A new best (strictly
// higher) replaces it; otherwise the stored one stays, and a submission from
// before VT-45 stays "unknown".
export function bestCheckAfter(existing, pct, check) {
  if (!existing) return check;
  const prevBest = existing.best_score_pct;
  if (prevBest == null || pct > prevBest) return check;
  return HOMEWORK_CHECKS.includes(existing.best_score_check) ? existing.best_score_check : "unknown";
}

// What the teacher view shows for a stored submission (or none).
export function storedCheck(value, pct) {
  if (pct == null) return null;
  return HOMEWORK_CHECKS.includes(value) ? value : "unknown";
}
