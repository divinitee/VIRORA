// Append before admission: every concurrent contender counts toward the budget.
// Accepted reservations are never removed/refunded, even if paid work fails.
// Denied contenders delete only their own row; contention can reject early,
// but cannot admit more work than the remaining allowance.
export class UsageLimitError extends Error {
  constructor(code, status = 429) { super(code); this.code = code; this.status = status; }
}

export const usageDate = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);

export async function reserveUsage(svc, user, { bucket, limit, baseline = 0, date = usageDate(), resourceId = '', now = Date.now() }) {
  const query = { user_email: user.email, bucket, date };
  const resource = { bucket, resource_id: resourceId, active: true, lease_until: { $gt: new Date(now).toISOString() } };
  if (resourceId && await svc.UsageReservation.count(resource)) throw new UsageLimitError('material_already_processing', 409);
  if (baseline + await svc.UsageReservation.count(query) >= limit) throw new UsageLimitError('daily_allowance_exhausted');
  const reservation = await svc.UsageReservation.create({
    user_id: user.id, user_email: user.email, bucket, date,
    resource_id: resourceId, active: !!resourceId,
    lease_until: new Date(now + 10 * 60 * 1000).toISOString(),
  });
  let admitted = false;
  try {
    // No expensive work may start until BOTH post-insert checks pass.
    if (baseline + await svc.UsageReservation.count(query) > limit) throw new UsageLimitError('daily_allowance_exhausted');
    if (resourceId && await svc.UsageReservation.count(resource) > 1) throw new UsageLimitError('material_already_processing', 409);
    admitted = true;
    return reservation;
  } finally {
    if (!admitted) await svc.UsageReservation.delete(reservation.id);
  }
}

export async function releaseUsageLease(svc, reservation) {
  if (reservation?.active) await svc.UsageReservation.update(reservation.id, { active: false });
}