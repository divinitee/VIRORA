// Account bans (Admin Console bulk 'Ban', 11 Nov 2026).
//
// A row in AccountBan (written only by adminApi.studentsBulk) makes every
// learner-facing function refuse the account: progressApi, coachApi,
// studentApi, aiApi, chatApi. Matched by email (lower-cased) or user id, so a
// deleted-then-re-registered account with the same email stays banned.
//
// Fails OPEN on a lookup error: a database hiccup must never lock every
// student out of the app. A ban is for abuse (trial farming, AI-credit burn),
// not a security boundary.

export const BANNED = { ok: false, error: 'account_banned', code: 'account_banned' };

export async function isBanned(svc: any, me: any): Promise<boolean> {
  try {
    const email = String(me?.email || '').trim().toLowerCase();
    if (!email && !me?.id) return false;
    if (email) {
      const byEmail = (await svc.AccountBan.filter({ email }, '-created_date', 1)) || [];
      if (byEmail.length) return true;
    }
    if (me?.id) {
      const byId = (await svc.AccountBan.filter({ user_id: me.id }, '-created_date', 1)) || [];
      if (byId.length) return true;
    }
    return false;
  } catch (e) {
    console.error('ban lookup failed (allowing)', (e as any)?.message);
    return false;
  }
}

/** A 403 Response for a banned caller, or null. Admins are never refused. */
export async function banGuard(svc: any, me: any): Promise<Response | null> {
  if (!me || me.role === 'admin') return null;
  return (await isBanned(svc, me)) ? Response.json(BANNED, { status: 403 }) : null;
}
