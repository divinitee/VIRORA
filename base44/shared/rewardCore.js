// Reward inputs come exclusively from completed, server-verified evidence.
export async function verifiedReward(svc, email, game, roundId) {
  const receipts = await svc.RoundReceipt.filter({ user_email: email, round_id: roundId, game, kind: 'evidence', status: 'done' }, 'created_date', 1);
  const evidence = receipts?.[0];
  if (!evidence || !['server_graded', 'server_ai'].includes(evidence.verification)) return null;
  const query = { user_email: email, round_id: roundId, round_at: evidence.round_at };
  const ai = evidence.skill === 'creativity';
  const entity = ai ? 'AiGradedItem' : evidence.skill === 'grammar' ? 'GrammarAttempt' : 'WordAttempt';
  const rows = await svc[entity].filter(ai ? { ...query, task: 'sentence', counted: true } : { ...query, game, verification: evidence.verification }, 'created_date', 51);
  if (!rows?.length || rows.length > 50 || rows.length !== evidence.items_total) return null;
  const credit = ai ? Math.max(0, Math.min(100, Number(rows[0].score) || 0)) / 100 : rows.filter(r => r.correct === true).length;
  if (Math.abs(credit - evidence.items_credit) > 0.000001) return null;
  // No client-claimed streak or multiplier can increase a reward. Older item
  // ledgers lack reliable answer ordering, so they cannot prove a streak bonus.
  const amount = Math.round(10 * credit);
  return { items_total: rows.length, items_correct: credit, amount, base_xp: amount, streak_best: 0, hint_multiplier: 1, level: rows[0].level };
}