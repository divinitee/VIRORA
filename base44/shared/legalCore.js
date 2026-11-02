// Legal Consent Architecture v1.0 — pure core (no I/O).
//
// Shared by base44/functions/legalApi (via legalApiHandler.js), the
// consentGuard used by every protected function, and the browser.
// Spec: claude/vira/LEGAL-CONSENT-ARCH-V1 (GPT, 2026-11-01).
//
// What lives here: event/error vocabulary, hashing, active-release selection,
// status derivation from the append-only event history, and the signed
// presentation token. Nothing here reads or writes data, so every rule is
// unit-tested in tools/legal-consent-tests.

export const EVENT = Object.freeze({
  TERMS_ACCEPTED: 'TERMS_ACCEPTED',
  DP_GRANTED: 'DATA_PROCESSING_CONSENT_GRANTED',
  DP_WITHDRAWN: 'DATA_PROCESSING_CONSENT_WITHDRAWN',
});
export const ACCEPT_EVENTS = Object.freeze([EVENT.TERMS_ACCEPTED, EVENT.DP_GRANTED]);

export const DOC_TYPES = Object.freeze(['public_offer', 'privacy_notice', 'data_processing_consent']);
export const LOCALES = Object.freeze(['uz', 'ru', 'en']);
export const ORIGIN_ROUTES = Object.freeze(['register', 'login', 'oauth/consent', 'app-gate', 'privacy-settings']);
export const EVIDENCE_SCHEMA_VERSION = 1;
export const PRESENTATION_TTL_MS = 30 * 60 * 1000;

export const CODE = Object.freeze({
  CONSENT_REQUIRED: 'CONSENT_REQUIRED',
  CONSENT_CHECK_UNAVAILABLE: 'CONSENT_CHECK_UNAVAILABLE',
  LEGAL_POLICY_UNAVAILABLE: 'LEGAL_POLICY_UNAVAILABLE',
  LEGAL_VERSION_CHANGED: 'LEGAL_VERSION_CHANGED',
  INVALID_PRESENTATION: 'INVALID_PRESENTATION',
  INVALID_REQUEST: 'INVALID_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  LEGAL_WRITE_BUSY: 'LEGAL_WRITE_BUSY',
});

// Codes the browser treats as "show the gate / the can't-verify screen".
export const GATE_CODES = Object.freeze([
  CODE.CONSENT_REQUIRED, CODE.CONSENT_CHECK_UNAVAILABLE, CODE.LEGAL_POLICY_UNAVAILABLE, CODE.LEGAL_VERSION_CHANGED,
]);

export class LegalError extends Error {
  constructor(code, status = 400, message) {
    super(message || code);
    this.code = code;
    this.status = status;
  }
}

// ---------------------------------------------------------------- mode

// LEGAL_CONSENT_MODE secret:
//   unset / "off"  — rollout not started: no gating anywhere (today's behaviour).
//   "canary"       — enforced only for user ids in LEGAL_CONSENT_CANARY_USER_IDS.
//   "enforce"      — enforced for everyone.
// Any other value is a typo and fails CLOSED (treated as enforce).
export function resolveMode(raw) {
  const v = String(raw ?? '').trim().toLowerCase();
  if (v === '' || v === 'off') return 'off';
  if (v === 'canary') return 'canary';
  return 'enforce';
}

export const parseIdList = (raw) => String(raw ?? '').split(',').map((s) => s.trim()).filter(Boolean);

export function isEnforcedFor(mode, userId, canaryIds = []) {
  if (mode === 'off') return false;
  if (mode === 'canary') return !!userId && canaryIds.includes(String(userId));
  return true;
}

// ---------------------------------------------------------------- hashing

// Canonical payload = exact UTF-8 text with CRLF/CR normalised to LF. No
// Unicode normalisation: that would change the bytes counsel approved.
export const canonicalize = (text) => String(text ?? '').replace(/\r\n?/g, '\n');

const toHex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

export async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(canonicalize(text));
  return toHex(await globalThis.crypto.subtle.digest('SHA-256', bytes));
}

export const documentId = (type, version, locale) => `${type}:${version}:${locale}`;

// ---------------------------------------------------------------- releases

const ts = (v) => { const n = Date.parse(v); return Number.isFinite(n) ? n : NaN; };

// The active release is the published row with the latest effective_at that
// is not in the future. Publishing appends a new row; nothing is ever edited,
// so "switching the pointer" is atomic by construction.
export function selectActiveRelease(releases, now = Date.now()) {
  const live = (releases || []).filter((r) => r && r.status === 'published' && ts(r.effective_at) <= now);
  if (!live.length) return null;
  live.sort((a, b) => (ts(b.effective_at) - ts(a.effective_at))
    || (ts(b.published_at) - ts(a.published_at))
    || String(b.id || '').localeCompare(String(a.id || '')));
  return live[0];
}

// A release is usable only if it is internally complete. A broken manifest
// denies access (LEGAL_POLICY_UNAVAILABLE) instead of letting anyone through.
export function validateManifest(release) {
  const problems = [];
  if (!release) return ['no release'];
  if (!release.release_id) problems.push('release_id missing');
  if (!release.approval_reference) problems.push('approval_reference missing');
  const docs = release.documents_by_locale || {};
  const locales = Object.keys(docs);
  if (!locales.length) problems.push('no locales');
  const reqs = Array.isArray(release.required_events_and_scopes) ? release.required_events_and_scopes : [];
  if (!reqs.length) problems.push('no required events');
  // Each requirement once: a duplicate would put the same action on the
  // consent screen twice, validateActions() would then refuse the submission
  // as a duplicate action, and nobody could ever complete consent.
  const reqKeys = new Set();
  for (const r of reqs) {
    const k = requirementKey(r || {});
    if (reqKeys.has(k)) problems.push(`duplicate requirement ${k}`);
    reqKeys.add(k);
  }
  for (const r of reqs) {
    if (!ACCEPT_EVENTS.includes(r.event_type)) problems.push(`bad event_type ${r.event_type}`);
    if (!DOC_TYPES.includes(r.document_type)) problems.push(`bad document_type ${r.document_type}`);
    if (r.event_type === EVENT.DP_GRANTED && !r.purpose_scope_id) problems.push('grant without purpose_scope_id');
    if (r.event_type === EVENT.TERMS_ACCEPTED && r.purpose_scope_id) problems.push('terms with purpose_scope_id');
  }
  for (const l of locales) {
    if (!LOCALES.includes(l)) problems.push(`unsupported locale ${l}`);
    const list = Array.isArray(docs[l]) ? docs[l] : [];
    for (const r of reqs) {
      if (!list.some((d) => d.document_type === r.document_type)) problems.push(`${l} missing ${r.document_type}`);
      const label = r.label_by_locale?.[l];
      if (!label) problems.push(`${l} missing label for ${r.event_type}`);
    }
    const types = new Set();
    for (const d of list) {
      if (!/^[0-9a-f]{64}$/.test(String(d.sha256 || ''))) problems.push(`${l} ${d.document_type} bad sha256`);
      if (!d.document_id || !d.version) problems.push(`${l} ${d.document_type} missing id/version`);
      // One document per type per locale: docFor() picks the first, so a
      // second one would be served or recorded ambiguously.
      if (types.has(d.document_type)) problems.push(`${l} duplicate document_type ${d.document_type}`);
      types.add(d.document_type);
      // The reference must name exactly the artifact it claims (type,
      // version and THIS locale), so evidence can't point at another
      // locale's text.
      if (d.document_id && d.version && d.document_id !== documentId(d.document_type, d.version, l)) {
        problems.push(`${l} ${d.document_type} document_id ${d.document_id} does not match type/version/locale`);
      }
    }
  }
  // Every document reference is unique across the whole release.
  const refIds = new Set();
  for (const l of locales) {
    for (const d of Array.isArray(docs[l]) ? docs[l] : []) {
      if (!d.document_id) continue;
      if (refIds.has(d.document_id)) problems.push(`duplicate document reference ${d.document_id}`);
      refIds.add(d.document_id);
    }
  }
  return problems;
}

export const docFor = (release, locale, type) =>
  (release?.documents_by_locale?.[locale] || []).find((d) => d.document_type === type) || null;

export const requirementKey = (r) => `${r.event_type}|${r.purpose_scope_id || ''}`;

// ---------------------------------------------------------------- status

const order = (a, b) => (ts(a.occurred_at) - ts(b.occurred_at))
  || (ts(a.recorded_at) - ts(b.recorded_at))
  || String(a.id || '').localeCompare(String(b.id || ''));

// Does `rec` accept exactly the artifact this release requires, in the locale
// the user saw it in? Version alone is not enough: the hash must match too.
function matchesRelease(rec, release, req) {
  const d = docFor(release, rec.document_locale, req.document_type);
  return !!d && rec.document_version === d.version && rec.document_sha256 === d.sha256 && rec.document_id === d.document_id;
}

// Status is derived ONLY from the active release and the user's event
// history. No profile flag or cached boolean takes part.
export function deriveStatus(release, records) {
  const reqs = release?.required_events_and_scopes || [];
  const sorted = [...(records || [])].sort(order);
  const satisfied = [];
  const missing = [];
  for (const req of reqs) {
    let ok = false;
    if (req.event_type === EVENT.TERMS_ACCEPTED) {
      ok = sorted.some((r) => r.event_type === EVENT.TERMS_ACCEPTED && matchesRelease(r, release, req));
    } else if (req.event_type === EVENT.DP_GRANTED) {
      // Latest event for this scope decides: a withdrawal after a grant wins.
      const scoped = sorted.filter((r) => r.purpose_scope_id === req.purpose_scope_id
        && (r.event_type === EVENT.DP_GRANTED || r.event_type === EVENT.DP_WITHDRAWN));
      const last = scoped[scoped.length - 1];
      ok = !!last && last.event_type === EVENT.DP_GRANTED && matchesRelease(last, release, req);
    }
    (ok ? satisfied : missing).push(req);
  }
  return { allowed: missing.length === 0, satisfied, missing };
}

// Rows that share an idempotency key and describe the same requirement are
// ONE user action written twice (a concurrent retry that slipped past the
// write lock, e.g. after a lease expired). Keep the earliest; the rest are
// ignored by every reader, so a duplicate can never change status, receipts
// or which record a retry gets back. Rows are never deleted (append-only).
export function collapseDuplicates(records) {
  const seen = new Set();
  const out = [];
  for (const r of [...(records || [])].sort(order)) {
    const k = r.idempotency_key ? `${r.idempotency_key}|${r.event_type}|${r.purpose_scope_id || ''}` : null;
    if (k && seen.has(k)) continue;
    if (k) seen.add(k);
    out.push(r);
  }
  return out;
}

// Active (not withdrawn) grants, for the withdrawal screen.
export function activeGrants(records) {
  const sorted = [...(records || [])].sort(order);
  const byScope = new Map();
  for (const r of sorted) {
    if (r.event_type === EVENT.DP_GRANTED || r.event_type === EVENT.DP_WITHDRAWN) byScope.set(r.purpose_scope_id, r);
  }
  return [...byScope.values()].filter((r) => r.event_type === EVENT.DP_GRANTED);
}

// ---------------------------------------------------------------- input checks

export const isIdempotencyKey = (k) => typeof k === 'string' && /^[A-Za-z0-9_-]{8,100}$/.test(k);
export const isLocale = (l) => LOCALES.includes(l);
export const pickLocale = (release, wanted) => {
  const have = Object.keys(release?.documents_by_locale || {});
  if (have.includes(wanted)) return wanted;
  return have.includes('uz') ? 'uz' : have[0] || null;
};

// Each action must be an explicit affirmative choice that the active release
// actually asks for. Returns the matching requirement objects in order.
export function validateActions(release, actions) {
  if (!Array.isArray(actions) || actions.length === 0 || actions.length > 10) {
    throw new LegalError(CODE.INVALID_REQUEST, 400, 'actions must be a non-empty list');
  }
  const reqs = release?.required_events_and_scopes || [];
  const seen = new Set();
  return actions.map((a) => {
    if (!a || a.affirmed !== true) throw new LegalError(CODE.INVALID_REQUEST, 400, 'every action must be affirmed: true');
    const key = requirementKey({ event_type: a.event_type, purpose_scope_id: a.purpose_scope_id });
    if (seen.has(key)) throw new LegalError(CODE.INVALID_REQUEST, 400, 'duplicate action');
    seen.add(key);
    const req = reqs.find((r) => requirementKey(r) === key);
    if (!req) throw new LegalError(CODE.INVALID_REQUEST, 400, `action not in release: ${key}`);
    return req;
  });
}

// ---------------------------------------------------------------- presentation token

// presentation_id: short-lived, server-signed proof that THIS user was served
// THIS release in THIS locale. Stateless (HMAC), so it needs no extra table.
// It evidences that the documents were served, not that they were read.
const b64u = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

async function hmacKey(secret) {
  if (!secret || String(secret).length < 32) throw new LegalError(CODE.CONSENT_CHECK_UNAVAILABLE, 503, 'presentation secret missing');
  return globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

/** @param {string | undefined} secret @param {{ userId: string, releaseId: string, locale: string, now?: number, nonce?: string }} p */
export async function signPresentation(secret, { userId, releaseId, locale, now = Date.now(), nonce }) {
  const payload = { u: String(userId), r: String(releaseId), l: locale, e: now + PRESENTATION_TTL_MS, n: nonce || crypto.randomUUID() };
  const body = b64u(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(secret), new TextEncoder().encode(body)));
  return `${body}.${b64u(sig)}`;
}

export async function verifyPresentation(secret, token, { userId, releaseId, locale, now = Date.now() }) {
  const parts = String(token || '').split('.');
  if (parts.length !== 2) throw new LegalError(CODE.INVALID_PRESENTATION, 400);
  let ok = false;
  try {
    ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), unb64u(parts[1]), new TextEncoder().encode(parts[0]));
  } catch (e) {
    if (e instanceof LegalError) throw e;
    ok = false;
  }
  if (!ok) throw new LegalError(CODE.INVALID_PRESENTATION, 400);
  let p;
  try { p = JSON.parse(new TextDecoder().decode(unb64u(parts[0]))); } catch { throw new LegalError(CODE.INVALID_PRESENTATION, 400); }
  if (p.u !== String(userId) || p.l !== locale || !(p.e > now)) throw new LegalError(CODE.INVALID_PRESENTATION, 400);
  if (p.r !== String(releaseId)) throw new LegalError(CODE.LEGAL_VERSION_CHANGED, 409);
  return p;
}
