import { endInstant, isPastEnd } from './subscriptionCore.js';
import { reserveUsage, usageDate, UsageLimitError } from './usageGuard.js';

const PLANS = [
  { id: 'free', name: 'free plan', limit: 3 },
  { id: 'learner', name: 'learner plan', limit: 25 },
  { id: 'vip', name: 'vip plan', limit: 300, displayUnlimited: true },
];

export function aiPlanFor(subscriptions, user, scope, now = Date.now()) {
  if (scope === 'teacher' && user.teacher_status === 'approved') return PLANS[2];
  return subscriptions.reduce((best, sub) => {
    if (sub.status !== 'active' || isPastEnd(sub, now) || (sub.expires_at && endInstant(sub) == null)) return best;
    const label = String(sub.plan || '').toLowerCase();
    const plan = PLANS.find(p => p.id === label || p.name === label) || PLANS[0];
    return plan.limit > best.limit ? plan : best;
  }, PLANS[0]);
}

export async function getAiStatus(sr, user, scope) {
  if (user.role === 'admin') return { allowed: true, limit: null, used: 0, remaining: null, unlimited: true };
  const date = usageDate();
  let subs = await sr.entities.StudentSubscription.filter({ phone: user.email }, '-created_date', 50);
  if (!subs.length) subs = await sr.entities.StudentSubscription.filter({ created_by_id: user.id }, '-created_date', 50);
  const plan = aiPlanFor(subs, user, scope);
  // AiUsageLog is the frozen pre-reservation baseline. New attempts live only
  // in UsageReservation, so they cannot be counted twice or overwritten.
  const [legacy, reserved] = await Promise.all([
    sr.entities.AiUsageLog.aggregate({ query: { user_email: user.email, date }, sum: ['count'] }),
    sr.entities.UsageReservation.count({ user_email: user.email, bucket: 'ai_turn', date }),
  ]);
  const legacyUsed = Math.max(0, Number(legacy.rows?.[0]?.sum_count) || 0);
  const used = legacyUsed + reserved;
  return { allowed: used < plan.limit, limit: plan.limit, used, remaining: Math.max(0, plan.limit - used), unlimited: !!plan.displayUnlimited, _legacyUsed: legacyUsed, _date: date };
}

export const publicAiStatus = ({ _legacyUsed, _date, ...status }) => status;

export async function reserveAiTurn(sr, user, scope, status) {
  if (user.role === 'admin') return status;
  try {
    await reserveUsage(sr.entities, user, { bucket: 'ai_turn', limit: status.limit, baseline: status._legacyUsed, date: status._date });
  } catch (error) {
    if (error instanceof UsageLimitError) return null;
    throw error;
  }
  return getAiStatus(sr, user, scope);
}