// assertRequiredConsent for backend functions (Legal Consent Architecture §7).
//
// Every user-invoked function that reads protected data, meters usage, sends
// data to an AI provider or performs a protected action calls consentDenial()
// right after authenticating the caller:
//
//   const denied = await consentDenial(base44.asServiceRole.entities, me, { getSecret: (n) => secrets.get(n) });
//   if (denied) return denied;
//
// Status comes live from the active release + the caller's ConsentRecord
// history on every call (no cache), so a newly published release blocks the
// very next protected request. Any read failure DENIES (fail closed).
//
// Admin-only/operator functions, webhooks and the legalApi itself do not call
// this: see LEGAL-CONSENT-V1-HANDOFF.md "Path inventory" for each decision.

import {
  CODE, LegalError, collapseDuplicates, deriveStatus, isEnforcedFor, parseIdList, resolveMode, selectActiveRelease, validateManifest,
} from './legalCore.js';

export const MODE_SECRET = 'LEGAL_CONSENT_MODE';
export const CANARY_SECRET = 'LEGAL_CONSENT_CANARY_USER_IDS';

export function readMode(getSecret) {
  const mode = resolveMode(getSecret ? getSecret(MODE_SECRET) : undefined);
  const canary = parseIdList(getSecret ? getSecret(CANARY_SECRET) : '');
  return { mode, canary };
}

export async function loadActiveRelease(svc, now = Date.now()) {
  const published = await svc.LegalPolicyRelease.filter({ status: 'published' }, '-effective_at', 100);
  const release = selectActiveRelease(published, now);
  if (!release) throw new LegalError(CODE.LEGAL_POLICY_UNAVAILABLE, 503, 'no active legal release');
  const problems = validateManifest(release);
  if (problems.length) {
    console.error('active legal release is invalid:', release.release_id, problems);
    throw new LegalError(CODE.LEGAL_POLICY_UNAVAILABLE, 503, 'active legal release is invalid');
  }
  return release;
}

// The caller's COMPLETE consent history (GPT re-review, 2 Nov 2026). A single
// capped read sorted oldest-first would drop the newest events — e.g. a
// withdrawal — once a user had more rows than the cap, and an older grant
// would then still look active. So:
//   - page through every row (oldest first, by server created_date),
//   - drop any row seen twice across a page boundary (same id),
//   - confirm the total with count(); a mismatch (rows appended or a page
//     boundary shifted mid-read) re-reads once, then fails closed,
//   - refuse to evaluate past RECORD_MAX rows (fail closed, never truncate).
// Every reader goes through here, so duplicate rows from a concurrent retry
// are also collapsed before status, receipts or withdrawal see them.
export const RECORD_PAGE = 500;
export const RECORD_MAX = 20_000;
// Early warning, long before RECORD_MAX locks anyone out (README "Operations").
export const RECORD_WARN = 5_000;

// Reads at most `max` rows; exactly `max` is allowed (GPT catch-up, 3 Nov
// 2026: the old loop refused a history of exactly `max`). After a full `max`,
// one extra row is probed: if it exists the history is over the cap and the
// read fails closed.
async function readAll(svc, query, page, max) {
  const byId = new Map();
  let skip = 0;
  while (skip < max) {
    const want = Math.min(page, max - skip);
    const rows = await svc.ConsentRecord.filter(query, 'created_date', want, skip);
    for (const r of rows) byId.set(r.id, r);
    if (rows.length < want) return [...byId.values()];
    skip += want;
  }
  const beyond = await svc.ConsentRecord.filter(query, 'created_date', 1, max);
  if (beyond.length) {
    console.error(JSON.stringify({ event: 'consent_history_over_max', subject_user_id: query.subject_user_id, max }));
    throw new LegalError(CODE.CONSENT_CHECK_UNAVAILABLE, 503, 'consent history too long to evaluate');
  }
  return [...byId.values()];
}

// Complete history plus its PHYSICAL row count (before duplicates collapse).
// Writers need the physical count to keep the stored history within the cap.
/** @param {any} svc @param {string|number} userId @param {{ page?: number, max?: number, warn?: number }} [opts] */
export async function loadHistory(svc, userId, { page = RECORD_PAGE, max = RECORD_MAX, warn = RECORD_WARN } = {}) {
  const query = { subject_user_id: String(userId) };
  for (let attempt = 0; attempt < 2; attempt++) {
    const rows = await readAll(svc, query, page, max);
    const total = typeof svc.ConsentRecord.count === 'function' ? await svc.ConsentRecord.count(query) : rows.length;
    if (rows.length === total) {
      if (total >= warn) console.warn(JSON.stringify({ event: 'consent_history_large', subject_user_id: query.subject_user_id, rows: total, max }));
      return { records: collapseDuplicates(rows), physical: total, max };
    }
  }
  throw new LegalError(CODE.CONSENT_CHECK_UNAVAILABLE, 503, 'consent history changed while reading');
}

/** @param {any} svc @param {string|number} userId @param {{ page?: number, max?: number, warn?: number }} [opts] */
export async function loadRecords(svc, userId, opts = {}) {
  return (await loadHistory(svc, userId, opts)).records;
}

// Write preflight for CONSENT-GIVING appends (GPT review of f845916).
// Invariant kept by legalApi:  physical rows + active grants <= max.
//  - Giving consent (terms / grant) may append only if, afterwards, there is
//    still one free slot for every grant that would then be active. Otherwise
//    it is refused BEFORE the first write, with nothing written: no rows
//    persist behind a failed request, and a retry still reaches the
//    idempotency check because the history stays readable.
//  - Withdrawal is never blocked by the cap: under the invariant it always
//    fits (it adds one row and removes one active grant), so the cap can
//    never leave a user with a grant they cannot withdraw.
/** @param {{ physical: number, max: number }} history @param {number} adding @param {number} activeAfter @param {string|number} userId */
export function assertRoomFor(history, adding, activeAfter, userId) {
  if (adding > 0 && history.physical + adding + activeAfter > history.max) {
    console.error(JSON.stringify({ event: 'consent_history_over_max', subject_user_id: String(userId), max: history.max, rows: history.physical, adding, active_after: activeAfter }));
    throw new LegalError(CODE.CONSENT_CHECK_UNAVAILABLE, 503, 'consent history is at its limit; nothing was written');
  }
}

// Returns { enforced, allowed, code?, missing? }. Never throws.
/** @param {any} svc @param {any} user @param {{ getSecret?: (n: string) => string | undefined, now?: number }} [opts] */
export async function checkConsent(svc, user, { getSecret, now = Date.now() } = {}) {
  const { mode, canary } = readMode(getSecret);
  if (!user?.id) return { enforced: true, allowed: false, code: CODE.UNAUTHENTICATED };
  if (!isEnforcedFor(mode, user.id, canary)) return { enforced: false, allowed: true, mode };
  try {
    const release = await loadActiveRelease(svc, now);
    const status = deriveStatus(release, await loadRecords(svc, user.id));
    if (status.allowed) return { enforced: true, allowed: true, mode, release_id: release.release_id };
    return { enforced: true, allowed: false, mode, code: CODE.CONSENT_REQUIRED, missing: status.missing.map((r) => r.event_type) };
  } catch (e) {
    const code = e instanceof LegalError ? e.code : CODE.CONSENT_CHECK_UNAVAILABLE;
    if (!(e instanceof LegalError)) console.error('consent check failed:', e?.message || e);
    return { enforced: true, allowed: false, mode, code };
  }
}

const STATUS = {
  [CODE.CONSENT_REQUIRED]: 403,
  [CODE.UNAUTHENTICATED]: 401,
  [CODE.LEGAL_POLICY_UNAVAILABLE]: 503,
  [CODE.CONSENT_CHECK_UNAVAILABLE]: 503,
};

// null = proceed; otherwise a ready Response to return BEFORE any data access,
// metering, upload processing or model call. Same JSON shape the existing
// functions use ({ ok:false, error, code }) so serverApi.js parses it.
/** @param {any} svc @param {any} user @param {{ getSecret?: (n: string) => string | undefined, now?: number }} [opts] */
export async function consentDenial(svc, user, opts = {}) {
  const r = await checkConsent(svc, user, opts);
  if (r.allowed) return null;
  return Response.json({ ok: false, error: r.code, code: r.code }, { status: STATUS[r.code] || 403 });
}

// For background jobs that act on many users (e.g. the daily reminder email).
// Returns a predicate: true = this user may be processed. When the release
// can't be loaded and enforcement applies, nobody enforced is processed.
/** @param {any} svc @param {{ getSecret?: (n: string) => string | undefined, now?: number }} [opts] */
export async function consentFilter(svc, { getSecret, now = Date.now() } = {}) {
  const { mode, canary } = readMode(getSecret);
  if (mode === 'off') return () => true;
  let release = null;
  try { release = await loadActiveRelease(svc, now); } catch { release = null; }
  const cache = new Map();
  return async (user) => {
    if (!user?.id) return false;
    if (!isEnforcedFor(mode, user.id, canary)) return true;
    if (!release) return false;
    if (!cache.has(user.id)) {
      try { cache.set(user.id, deriveStatus(release, await loadRecords(svc, user.id)).allowed); } catch { cache.set(user.id, false); }
    }
    return cache.get(user.id);
  };
}
