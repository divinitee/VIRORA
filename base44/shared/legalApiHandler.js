// legalApi — the only door to the legal release registry and consent evidence
// (Legal Consent Architecture v1.0, §4–§7, §11–§12).
//
// Logic lives here (not in functions/legalApi/entry.ts) so the tests in
// tools/legal-consent-tests drive it with an in-memory Base44 and fake secrets.
//
// Secrets:
//   LEGAL_PRESENTATION_SECRET      ≥ 32 random chars; signs presentation_id. Missing → status/record fail closed.
//   LEGAL_PUBLISHER_USER_IDS       comma-separated admin user ids allowed to create/publish releases.
//   LEGAL_CONSENT_MODE             off | canary | enforce   (see legalCore.resolveMode)
//   LEGAL_CONSENT_CANARY_USER_IDS  ids enforced while mode = canary.
//
// Entities (all RLS "never": the browser cannot read or write them directly,
// and App MCP entity access inherits that):
//   LegalDocumentVersion, LegalPolicyRelease, ConsentRecord
//
// Append-only: this file only ever calls .create() on those three entities.
// Consent writes run under a per-user lease lock (consentLock.js) so two
// simultaneous requests with the same idempotency key cannot both append.
// tools/legal-consent-tests/append_only.test.ts fails if an update/delete call
// appears anywhere in the legal code.

import {
  CODE, DOC_TYPES, EVENT, EVIDENCE_SCHEMA_VERSION, LOCALES, LegalError, ORIGIN_ROUTES,
  activeGrants, canonicalize, deriveStatus, docFor, documentId, isEnforcedFor, isIdempotencyKey, isLocale,
  parseIdList, pickLocale, requirementKey, selectActiveRelease, sha256Hex, signPresentation, validateActions,
  validateManifest, verifyPresentation,
} from './legalCore.js';
import { loadActiveRelease, loadRecords, readMode } from './consentGuard.js';
import { claimSelfTest, seedConsentLocks, withConsentLock } from './consentLock.js';

const iso = (ms) => new Date(ms).toISOString();
// Base44 validates writes against the entity .jsonc; a null in a "string"
// field can be rejected, so absent values are omitted rather than nulled.
const compact = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined));
const str = (v, max = 200) => String(v ?? '').slice(0, max);

// Which field carries the sign-in method depends on the platform's User
// record. Read it from the authenticated identity only; never from the body.
export function serverAuthProvider(me) {
  const v = me?.auth_provider ?? me?.provider ?? me?.login_provider ?? me?._auth_provider;
  return v ? str(v, 40).toLowerCase() : 'unknown';
}

function publicDoc(d) {
  return {
    document_id: d.document_id, document_type: d.document_type, version: d.version, locale: d.locale,
    sha256: d.sha256, content_format: d.content_format || 'markdown', canonical_content: d.canonical_content,
  };
}

async function loadDocs(svc, release, locale) {
  const refs = release.documents_by_locale?.[locale] || [];
  const out = [];
  for (const ref of refs) {
    const rows = await svc.LegalDocumentVersion.filter({ document_id: ref.document_id }, 'created_date', 5);
    const row = rows.find((r) => r.sha256 === ref.sha256);
    if (!row) throw new LegalError(CODE.LEGAL_POLICY_UNAVAILABLE, 503, `document ${ref.document_id} missing`);
    out.push(publicDoc(row));
  }
  return out;
}

function requiredActionsFor(release, locale, missing) {
  return missing.map((r) => {
    const d = docFor(release, locale, r.document_type);
    return {
      event_type: r.event_type, purpose_scope_id: r.purpose_scope_id || null, document_type: r.document_type,
      document_id: d?.document_id, version: d?.version, locale, sha256: d?.sha256,
      label: r.label_by_locale?.[locale] || '',
    };
  });
}

const releaseMeta = (r) => ({ release_id: r.release_id, effective_at: r.effective_at, locales: Object.keys(r.documents_by_locale || {}) });

// ---------------------------------------------------------------- actions

async function getPublishedLegalPackage(ctx, body) {
  const release = await loadActiveRelease(ctx.svc, ctx.now());
  const locale = pickLocale(release, body.locale);
  return { release: releaseMeta(release), locale, documents: await loadDocs(ctx.svc, release, locale) };
}

async function getConsentStatus(ctx, body) {
  const me = ctx.requireUser();
  const { mode, canary } = readMode(ctx.getSecret);
  if (!isEnforcedFor(mode, me.id, canary)) return { mode, enforced: false, allowed: true };
  const now = ctx.now();
  let release, records;
  try {
    release = await loadActiveRelease(ctx.svc, now);
    records = await loadRecords(ctx.svc, me.id);
  } catch (e) {
    if (e instanceof LegalError) throw e;
    throw new LegalError(CODE.CONSENT_CHECK_UNAVAILABLE, 503, 'could not read consent status');
  }
  const status = deriveStatus(release, records);
  const locale = pickLocale(release, body.locale);
  const base = { mode, enforced: true, allowed: status.allowed, release: releaseMeta(release), locale };
  if (status.allowed) return base;
  return {
    ...base,
    required_actions: requiredActionsFor(release, locale, status.missing),
    documents: await loadDocs(ctx.svc, release, locale),
    presentation_id: await signPresentation(ctx.getSecret('LEGAL_PRESENTATION_SECRET'), { userId: me.id, releaseId: release.release_id, locale, now }),
  };
}

async function recordConsent(ctx, body) {
  const me = ctx.requireUser();
  const occurredAt = ctx.now();
  if (!isIdempotencyKey(body.idempotency_key)) throw new LegalError(CODE.INVALID_REQUEST, 400, 'idempotency_key');
  if (!isLocale(body.locale)) throw new LegalError(CODE.INVALID_REQUEST, 400, 'locale');
  const origin = ORIGIN_ROUTES.includes(body.origin_route) ? body.origin_route : 'app-gate';

  const release = await loadActiveRelease(ctx.svc, occurredAt);
  if (str(body.release_id, 100) !== release.release_id) throw new LegalError(CODE.LEGAL_VERSION_CHANGED, 409);
  await verifyPresentation(ctx.getSecret('LEGAL_PRESENTATION_SECRET'), body.presentation_id, {
    userId: me.id, releaseId: release.release_id, locale: body.locale, now: occurredAt,
  });
  const reqs = validateActions(release, body.actions);

  return withConsentLock(ctx.svc, me.id, (fence) => appendConsent(ctx, me, body, release, reqs, origin, occurredAt, fence), ctx.lockOpts);
}

async function appendConsent(ctx, me, body, release, reqs, origin, occurredAt, fence) {
  // Idempotency (under the user's write lock): a retry, sequential or
  // simultaneous, finds what the first attempt wrote and only appends what is
  // still missing.
  // Read from the caller's COMPLETE history (paged + count-checked), not a
  // separately capped query.
  const prior = (await loadRecords(ctx.svc, me.id)).filter((r) => r.idempotency_key === body.idempotency_key);
  if (prior.some((r) => r.release_id !== release.release_id)) throw new LegalError(CODE.INVALID_REQUEST, 400, 'idempotency_key reused');
  const done = new Set(prior.map((r) => requirementKey(r)));

  const created = [];
  for (const req of reqs) {
    if (done.has(requirementKey(req))) continue;
    const d = docFor(release, body.locale, req.document_type);
    if (!d) throw new LegalError(CODE.LEGAL_VERSION_CHANGED, 409, 'document missing for locale');
    fence(); // still safely the lock holder? otherwise abort before writing
    const row = await ctx.svc.ConsentRecord.create(compact({
      subject_user_id: String(me.id),
      event_type: req.event_type,
      purpose_scope_id: req.event_type === EVENT.TERMS_ACCEPTED ? null : req.purpose_scope_id,
      release_id: release.release_id,
      document_id: d.document_id,
      document_version: d.version,
      document_locale: body.locale,
      document_sha256: d.sha256,
      occurred_at: iso(occurredAt),
      recorded_at: iso(ctx.now()),
      auth_provider: serverAuthProvider(me),
      origin_route: origin,
      presentation_id: str(body.presentation_id, 1000),
      idempotency_key: body.idempotency_key,
      related_record_id: null,
      evidence_schema_version: EVIDENCE_SCHEMA_VERSION,
    }));
    created.push(row);
  }

  // Unlock is decided by a FRESH read of the event history, not by the fact
  // that the writes above returned.
  const status = deriveStatus(release, await loadRecords(ctx.svc, me.id));
  const records = [...prior, ...created].map((r) => ({ record_id: r.id, event_type: r.event_type, occurred_at: r.occurred_at, recorded_at: r.recorded_at }));
  return { allowed: status.allowed, records, release: releaseMeta(release) };
}

async function withdrawConsent(ctx, body) {
  const me = ctx.requireUser();
  if (!isIdempotencyKey(body.idempotency_key)) throw new LegalError(CODE.INVALID_REQUEST, 400, 'idempotency_key');
  return withConsentLock(ctx.svc, me.id, (fence) => appendWithdrawal(ctx, me, body, fence), ctx.lockOpts);
}

async function appendWithdrawal(ctx, me, body, fence) {
  const records = await loadRecords(ctx.svc, me.id);
  const already = records.find((r) => r.event_type === EVENT.DP_WITHDRAWN && r.idempotency_key === body.idempotency_key);
  if (already) return { withdrawn: { record_id: already.id, purpose_scope_id: already.purpose_scope_id, occurred_at: already.occurred_at } };

  // Only the caller's own, currently active grant can be withdrawn. Ownership
  // comes from loading by subject_user_id = caller, never from the body.
  const grant = activeGrants(records).find((r) => r.id === str(body.related_record_id, 100));
  if (!grant) throw new LegalError(CODE.NOT_FOUND, 404, 'no active grant with that id');
  const now = ctx.now();
  fence(); // still safely the lock holder? otherwise abort before writing
  const row = await ctx.svc.ConsentRecord.create(compact({
    subject_user_id: String(me.id),
    event_type: EVENT.DP_WITHDRAWN,
    purpose_scope_id: grant.purpose_scope_id,
    release_id: grant.release_id,
    document_id: grant.document_id,
    document_version: grant.document_version,
    document_locale: grant.document_locale,
    document_sha256: grant.document_sha256,
    occurred_at: iso(now),
    recorded_at: iso(ctx.now()),
    auth_provider: serverAuthProvider(me),
    origin_route: 'privacy-settings',
    presentation_id: null,
    idempotency_key: body.idempotency_key,
    related_record_id: grant.id,
    evidence_schema_version: EVIDENCE_SCHEMA_VERSION,
  }));
  return { withdrawn: { record_id: row.id, purpose_scope_id: row.purpose_scope_id, occurred_at: row.occurred_at } };
}

// Minimal receipts: what the user did and when. No other user's data, no
// presentation tokens, no internal ids beyond the record id needed to withdraw.
async function listMyConsents(ctx) {
  const me = ctx.requireUser();
  const records = await loadRecords(ctx.svc, me.id);
  const active = new Set(activeGrants(records).map((r) => r.id));
  return {
    records: records.map((r) => ({
      record_id: r.id, event_type: r.event_type, purpose_scope_id: r.purpose_scope_id || null,
      release_id: r.release_id, document_version: r.document_version, document_locale: r.document_locale,
      occurred_at: r.occurred_at, active_grant: active.has(r.id), related_record_id: r.related_record_id || null,
    })),
  };
}

// ---------------------------------------------------------------- publisher actions

function requirePublisher(ctx) {
  const me = ctx.requireUser();
  const allowed = parseIdList(ctx.getSecret('LEGAL_PUBLISHER_USER_IDS'));
  if (me.role !== 'admin' || !allowed.includes(String(me.id))) throw new LegalError(CODE.FORBIDDEN, 403, 'not a legal publisher');
  return me;
}

const RELEASE_ID = /^[a-z0-9][a-z0-9._-]{2,59}$/;
const VERSION = /^[0-9A-Za-z][0-9A-Za-z._-]{0,29}$/;

async function adminListReleases(ctx) {
  requirePublisher(ctx);
  const rows = await ctx.svc.LegalPolicyRelease.list('-created_date', 100);
  const active = selectActiveRelease(rows, ctx.now());
  return {
    active_release_id: active?.release_id || null,
    releases: rows.map((r) => ({
      id: r.id, release_id: r.release_id, status: r.status, effective_at: r.effective_at || null,
      published_at: r.published_at || null, approval_reference: r.approval_reference || null,
      documents_by_locale: r.documents_by_locale, required_events_and_scopes: r.required_events_and_scopes,
      problems: r.status === 'published' ? validateManifest(r) : [],
    })),
  };
}

// Draft = immutable snapshot of exact document bytes + requirements. Editing
// text means a NEW version and a NEW draft; nothing is changed in place.
async function adminCreateDraft(ctx, body) {
  const me = requirePublisher(ctx);
  const releaseId = str(body.release_id, 60);
  if (!RELEASE_ID.test(releaseId)) throw new LegalError(CODE.INVALID_REQUEST, 400, 'release_id');
  if ((await ctx.svc.LegalPolicyRelease.filter({ release_id: releaseId }, 'created_date', 1)).length) {
    throw new LegalError(CODE.INVALID_REQUEST, 409, 'release_id already used');
  }
  const docsIn = Array.isArray(body.documents) ? body.documents : [];
  if (!docsIn.length || docsIn.length > 30) throw new LegalError(CODE.INVALID_REQUEST, 400, 'documents');
  const reqs = Array.isArray(body.required_events_and_scopes) ? body.required_events_and_scopes : [];

  // Phase 1, no writes: hash every document and check it against what is
  // already stored. Nothing is written until the whole manifest validates, so
  // a rejected draft leaves no orphan document rows behind.
  const byLocale = {};
  const pending = [];
  const now = ctx.now();
  for (const d of docsIn) {
    if (!DOC_TYPES.includes(d.document_type) || !LOCALES.includes(d.locale) || !VERSION.test(String(d.version || ''))) {
      throw new LegalError(CODE.INVALID_REQUEST, 400, 'document type/locale/version');
    }
    const content = canonicalize(d.canonical_content);
    if (!content.trim() || content.length > 200_000) throw new LegalError(CODE.INVALID_REQUEST, 400, 'document content');
    const sha256 = await sha256Hex(content);
    const id = documentId(d.document_type, d.version, d.locale);
    const existing = await ctx.svc.LegalDocumentVersion.filter({ document_id: id }, 'created_date', 5);
    if (existing.some((x) => x.sha256 !== sha256)) {
      throw new LegalError(CODE.INVALID_REQUEST, 409, `${id} already exists with different text — use a new version`);
    }
    if (!existing.length) {
      pending.push(compact({
        document_id: id, document_type: d.document_type, version: String(d.version), locale: d.locale,
        content_format: d.content_format === 'text' ? 'text' : 'markdown', canonical_content: content, sha256,
        first_release_id: releaseId, created_at: iso(now), created_by: String(me.id),
      }));
    }
    (byLocale[d.locale] ||= []).push({ document_type: d.document_type, document_id: id, version: String(d.version), sha256 });
  }
  const draft = {
    release_id: releaseId, status: 'draft', documents_by_locale: byLocale,
    required_events_and_scopes: reqs.map((r) => ({
      event_type: r.event_type, purpose_scope_id: r.event_type === EVENT.TERMS_ACCEPTED ? undefined : str(r.purpose_scope_id, 60),
      document_type: r.document_type,
      label_by_locale: Object.fromEntries(LOCALES.filter((l) => r.label_by_locale?.[l]).map((l) => [l, str(r.label_by_locale[l], 2000)])),
    })),
    created_at: iso(now), created_by: String(me.id),
  };
  // Validate as if it were published (with a placeholder approval) so a
  // broken draft is caught now, not at publish time.
  const problems = validateManifest({ ...draft, approval_reference: 'pending' });
  if (problems.length) throw new LegalError(CODE.INVALID_REQUEST, 400, problems.join('; '));
  // Phase 2: write. Validation already rejected duplicate document ids, so
  // each pending artifact is written once.
  for (const doc of pending) await ctx.svc.LegalDocumentVersion.create(doc);
  // Consent write locks exist before any release (and so any consent) can.
  await seedConsentLocks(ctx.svc);
  const row = await ctx.svc.LegalPolicyRelease.create(compact(draft));
  return { draft: { id: row.id, release_id: releaseId, documents_by_locale: byLocale } };
}

// Publishing appends a NEW row (status "published") copying the draft's
// manifest; the draft row is left as it was. Becomes active at effective_at.
async function adminPublishRelease(ctx, body) {
  const me = requirePublisher(ctx);
  const releaseId = str(body.release_id, 60);
  const approval = str(body.approval_reference, 500).trim();
  if (approval.length < 3) throw new LegalError(CODE.INVALID_REQUEST, 400, 'approval_reference required (lawyer sign-off reference)');
  const now = ctx.now();
  const effective = body.effective_at ? Date.parse(body.effective_at) : now;
  if (!Number.isFinite(effective)) throw new LegalError(CODE.INVALID_REQUEST, 400, 'effective_at');

  const rows = await ctx.svc.LegalPolicyRelease.filter({ release_id: releaseId }, 'created_date', 10);
  if (rows.some((r) => r.status === 'published')) throw new LegalError(CODE.INVALID_REQUEST, 409, 'already published');
  const draft = rows.find((r) => r.status === 'draft');
  if (!draft) throw new LegalError(CODE.NOT_FOUND, 404, 'draft not found');

  const missingLocales = LOCALES.filter((l) => !draft.documents_by_locale?.[l]);
  if (missingLocales.length) throw new LegalError(CODE.INVALID_REQUEST, 400, `missing locales: ${missingLocales.join(', ')}`);
  // Re-hash every stored artifact: what is published must be byte-identical
  // to what was drafted.
  for (const l of Object.keys(draft.documents_by_locale)) {
    for (const ref of draft.documents_by_locale[l]) {
      const docs = await ctx.svc.LegalDocumentVersion.filter({ document_id: ref.document_id }, 'created_date', 5);
      const doc = docs.find((x) => x.sha256 === ref.sha256);
      if (!doc || (await sha256Hex(doc.canonical_content)) !== ref.sha256) {
        throw new LegalError(CODE.INVALID_REQUEST, 409, `hash mismatch for ${ref.document_id}`);
      }
    }
  }
  const candidate = {
    release_id: releaseId, status: 'published', effective_at: iso(effective),
    documents_by_locale: draft.documents_by_locale, required_events_and_scopes: draft.required_events_and_scopes,
    created_at: iso(now), created_by: String(me.id),
    published_at: iso(now), published_by: String(me.id), approval_reference: approval,
  };
  const problems = validateManifest(candidate);
  if (problems.length) throw new LegalError(CODE.INVALID_REQUEST, 400, problems.join('; '));
  const row = await ctx.svc.LegalPolicyRelease.create(compact(candidate));
  return { published: { id: row.id, release_id: releaseId, effective_at: candidate.effective_at } };
}

// Canary check of the write lock on the REAL ConsentWriteLock via the service
// role (GPT second re-review). Publisher-only; touches only the reserved
// self-test shard row, never consent evidence.
async function adminLockSelfTest(ctx, body) {
  requirePublisher(ctx);
  const rounds = Math.min(4, Math.max(1, Number(body.rounds) || 4));
  const parallel = Math.min(9, Math.max(2, Number(body.parallel) || 9));
  return { self_test: await claimSelfTest(ctx.svc, { rounds, parallel }) };
}

// ---------------------------------------------------------------- router

const PUBLIC = { getPublishedLegalPackage };
const ACTIONS = {
  getConsentStatus, recordConsent, withdrawConsent, listMyConsents,
  adminListReleases, adminCreateDraft, adminPublishRelease, adminLockSelfTest,
};

export function createLegalApiHandler({ createClientFromRequest, getSecret, now = () => Date.now(), lockOpts = {} }) {
  return async (req) => {
    if (req.method !== 'POST') return Response.json({ ok: false, error: 'POST only', code: CODE.INVALID_REQUEST }, { status: 405 });
    try {
      const base44 = createClientFromRequest(req);
      const body = await req.json().catch(() => ({}));
      const action = String(body.action || '');
      const svc = base44.asServiceRole.entities;
      let me = null;
      if (!PUBLIC[action]) {
        try { me = await base44.auth.me(); } catch { me = null; }
      }
      const ctx = {
        svc, getSecret, now, lockOpts: { now, ...lockOpts },
        requireUser: () => {
          if (!me?.id) throw new LegalError(CODE.UNAUTHENTICATED, 401);
          return me;
        },
      };
      const fn = PUBLIC[action] || ACTIONS[action];
      if (!fn) return Response.json({ ok: false, error: 'unknown action', code: 'unknown_action' }, { status: 400 });
      const data = await fn(ctx, body);
      return Response.json({ ok: true, ...data });
    } catch (e) {
      if (e instanceof LegalError) {
        return Response.json({ ok: false, error: e.code, code: e.code, message: e.message !== e.code ? e.message : undefined }, { status: e.status });
      }
      console.error('legalApi error:', e?.message || e);
      // Unknown failures are status-read failures from the caller's view:
      // never an implicit allow.
      return Response.json({ ok: false, error: CODE.CONSENT_CHECK_UNAVAILABLE, code: CODE.CONSENT_CHECK_UNAVAILABLE }, { status: 503 });
    }
  };
}

