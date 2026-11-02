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
  CODE, LegalError, deriveStatus, isEnforcedFor, parseIdList, resolveMode, selectActiveRelease, validateManifest,
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

export const loadRecords = (svc, userId) =>
  svc.ConsentRecord.filter({ subject_user_id: String(userId) }, 'occurred_at', 1000);

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
