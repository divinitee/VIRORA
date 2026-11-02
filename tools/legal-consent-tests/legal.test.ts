// Legal Consent Architecture v1.0 — backend tests.
//
//   cd <app root> && deno test --allow-read tools/legal-consent-tests/
//
// Drives base44/shared/legalApiHandler.js and consentGuard.js with an
// in-memory Base44 (world.ts), a fake clock and fake secrets. Each test name
// starts with the §14 test-matrix row it proves.

import { assert, assertEquals, assertNotEquals } from 'jsr:@std/assert@1';
import {
  CODE, EVENT, canonicalize, deriveStatus, resolveMode, selectActiveRelease, sha256Hex,
  signPresentation, verifyPresentation, LegalError,
} from '../../base44/shared/legalCore.js';
import { checkConsent, consentDenial, consentFilter } from '../../base44/shared/consentGuard.js';
import { ALL_ACTIONS, SECRET, acceptAll, draftBody, makeWorld, publish } from './world.ts';

const rejectsWith = async (p: Promise<unknown>, code: string) => {
  try { await p; } catch (e) { assertEquals((e as LegalError).code, code); return; }
  throw new Error(`expected ${code}`);
};

// ------------------------------------------------------------------ core

Deno.test('hash: SHA-256 matches the standard vector', async () => {
  assertEquals(await sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

Deno.test('hash: UZ/RU/EN Unicode is stable and CRLF/CR normalise to LF only', async () => {
  const uz = "Ma'lumotlar — o‘quv ✓", ru = 'Согласие на обработку', en = 'Consent';
  for (const t of [uz, ru, en]) assertEquals(await sha256Hex(t), await sha256Hex(t));
  assertEquals(canonicalize('a\r\nb\rc\n'), 'a\nb\nc\n');
  assertEquals(await sha256Hex('a\r\nb'), await sha256Hex('a\nb'));
  // No Unicode normalisation: composed vs decomposed are different artifacts.
  assertNotEquals(await sha256Hex('ó'), await sha256Hex('ó'));
});

Deno.test('mode: unset/off = off, canary, anything else fails closed to enforce', () => {
  assertEquals(resolveMode(undefined), 'off');
  assertEquals(resolveMode(' OFF '), 'off');
  assertEquals(resolveMode('canary'), 'canary');
  assertEquals(resolveMode('enforce'), 'enforce');
  assertEquals(resolveMode('enfroce'), 'enforce');
});

Deno.test('release: future effective_at is not active; latest effective wins', () => {
  const now = Date.parse('2026-11-01T00:00:00Z');
  const r = (id: string, eff: string, status = 'published') => ({ id, release_id: id, status, effective_at: eff });
  assertEquals(selectActiveRelease([r('a', '2026-10-01T00:00:00Z'), r('b', '2026-12-01T00:00:00Z')], now)?.release_id, 'a');
  assertEquals(selectActiveRelease([r('a', '2026-10-01T00:00:00Z'), r('c', '2026-10-20T00:00:00Z')], now)?.release_id, 'c');
  assertEquals(selectActiveRelease([r('d', '2026-10-01T00:00:00Z', 'draft')], now), null);
});

Deno.test('presentation: binds user, release, locale and expiry; tamper rejected', async () => {
  const now = Date.parse('2026-11-01T00:00:00Z');
  const t = await signPresentation(SECRET, { userId: 'u1', releaseId: 'r1', locale: 'uz', now });
  await verifyPresentation(SECRET, t, { userId: 'u1', releaseId: 'r1', locale: 'uz', now });
  await rejectsWith(verifyPresentation(SECRET, t, { userId: 'u2', releaseId: 'r1', locale: 'uz', now }), CODE.INVALID_PRESENTATION);
  await rejectsWith(verifyPresentation(SECRET, t, { userId: 'u1', releaseId: 'r1', locale: 'ru', now }), CODE.INVALID_PRESENTATION);
  await rejectsWith(verifyPresentation(SECRET, t, { userId: 'u1', releaseId: 'r2', locale: 'uz', now }), CODE.LEGAL_VERSION_CHANGED);
  await rejectsWith(verifyPresentation(SECRET, t, { userId: 'u1', releaseId: 'r1', locale: 'uz', now: now + 31 * 60_000 }), CODE.INVALID_PRESENTATION);
  await rejectsWith(verifyPresentation(SECRET, t.slice(0, -2) + 'AA', { userId: 'u1', releaseId: 'r1', locale: 'uz', now }), CODE.INVALID_PRESENTATION);
  await rejectsWith(verifyPresentation('y'.repeat(40), t, { userId: 'u1', releaseId: 'r1', locale: 'uz', now }), CODE.INVALID_PRESENTATION);
});

// ------------------------------------------------------------------ status endpoint

Deno.test('matrix: mode off → not enforced, allowed (today’s behaviour)', async () => {
  const w = makeWorld({ LEGAL_CONSENT_MODE: undefined });
  const s = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([s.ok, s.enforced, s.allowed, s.mode], [true, false, true, 'off']);
});

Deno.test('matrix: enforced with no published release → LEGAL_POLICY_UNAVAILABLE, never allow', async () => {
  const w = makeWorld();
  await w.call('tee', 'adminCreateDraft', draftBody()); // draft only
  const s = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([s.status, s.code], [503, CODE.LEGAL_POLICY_UNAVAILABLE]);
});

Deno.test('matrix: status endpoint outage → CONSENT_CHECK_UNAVAILABLE (no cached allow)', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  w.failReads = true;
  const s = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([s.status, s.ok, s.code], [503, false, CODE.CONSENT_CHECK_UNAVAILABLE]);
});

Deno.test('matrix: unauthenticated status/record → 401', async () => {
  const w = makeWorld();
  await publish(w);
  assertEquals((await w.call(null, 'getConsentStatus', {})).status, 401);
  assertEquals((await w.call(null, 'recordConsent', {})).status, 401);
});

Deno.test('matrix: existing user with no ConsentRecord → required actions + presentation', async () => {
  const w = makeWorld();
  await publish(w);
  const s = await w.call('ana', 'getConsentStatus', { locale: 'ru' });
  assertEquals([s.ok, s.allowed, s.locale], [true, false, 'ru']);
  assertEquals(s.required_actions.map((a: any) => a.event_type), [EVENT.TERMS_ACCEPTED, EVENT.DP_GRANTED]);
  assertEquals(s.required_actions[0].label, 'Принимаю оферту');
  assert(s.presentation_id);
  assertEquals(s.documents.length, 3);
  assert(s.documents.every((d: any) => /^[0-9a-f]{64}$/.test(d.sha256) && d.locale === 'ru'));
});

Deno.test('matrix: presentation secret missing → status fails closed', async () => {
  const w = makeWorld({ LEGAL_PRESENTATION_SECRET: undefined });
  await publish(w);
  const s = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([s.status, s.code], [503, CODE.CONSENT_CHECK_UNAVAILABLE]);
});

// ------------------------------------------------------------------ recording

Deno.test('matrix: valid current choices → one server-written event per choice; unlock from fresh status', async () => {
  const w = makeWorld();
  await publish(w);
  const r = await acceptAll(w, 'ana');
  assertEquals([r.ok, r.allowed, r.records.length], [true, true, 2]);
  const rows = w.entities.ConsentRecord.rows;
  assertEquals(rows.length, 2);
  for (const row of rows) {
    assertEquals(row.subject_user_id, 'u_ana');
    assertEquals(row.release_id, 'r-1.3');
    assertEquals(row.occurred_at, '2026-11-01T10:00:00.000Z');
    assertEquals(row.auth_provider, 'google');
    assert(/^[0-9a-f]{64}$/.test(row.document_sha256));
  }
  assertEquals((await w.call('ana', 'getConsentStatus', { locale: 'uz' })).allowed, true);
});

Deno.test('matrix: terms accepted but required data-processing scope not → still gated; terms event stored separately', async () => {
  const w = makeWorld();
  await publish(w);
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  const r = await w.call('ana', 'recordConsent', {
    actions: [ALL_ACTIONS[0]], release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: 'key-terms-only',
  });
  assertEquals([r.ok, r.allowed], [true, false]);
  assertEquals(w.entities.ConsentRecord.rows.map((x: any) => x.event_type), [EVENT.TERMS_ACCEPTED]);
  const again = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals(again.required_actions.map((a: any) => a.event_type), [EVENT.DP_GRANTED]);
});

Deno.test('matrix: forged user_id / timestamp / version / hash in the body are ignored', async () => {
  const w = makeWorld();
  await publish(w);
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  await w.call('ana', 'recordConsent', {
    actions: ALL_ACTIONS.map((a) => ({ ...a, document_sha256: 'f'.repeat(64), document_version: '9.9' })),
    release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: 'key-forged-01',
    subject_user_id: 'u_bob', user_id: 'u_bob', occurred_at: '2020-01-01T00:00:00Z', recorded_at: '2020-01-01T00:00:00Z', auth_provider: 'forged',
  });
  for (const row of w.entities.ConsentRecord.rows) {
    assertEquals(row.subject_user_id, 'u_ana');
    assertEquals(row.document_version, '1.3');
    assertNotEquals(row.document_sha256, 'f'.repeat(64));
    assertEquals(row.occurred_at, '2026-11-01T10:00:00.000Z');
    assertEquals(row.auth_provider, 'google');
  }
});

Deno.test('matrix: another user’s presentation_id cannot be used', async () => {
  const w = makeWorld();
  await publish(w);
  const st = await w.call('bob', 'getConsentStatus', { locale: 'uz' });
  const r = await w.call('ana', 'recordConsent', {
    actions: ALL_ACTIONS, release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: 'key-steal-01',
  });
  assertEquals([r.status, r.code], [400, CODE.INVALID_PRESENTATION]);
  assertEquals(w.entities.ConsentRecord.rows.length, 0);
});

Deno.test('matrix: stale release_id / old presentation after a new release → LEGAL_VERSION_CHANGED, no unlock', async () => {
  const w = makeWorld();
  await publish(w, 'r-1.3');
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  w.advance(1000);
  // New release with changed offer text (new version).
  const body = draftBody('r-1.4');
  body.documents = body.documents.map((d: any) => ({ ...d, version: '1.4', canonical_content: d.canonical_content + ' v1.4' }));
  assert((await w.call('tee', 'adminCreateDraft', body)).ok);
  assert((await w.call('tee', 'adminPublishRelease', { release_id: 'r-1.4', approval_reference: 'LAWYER-2' })).ok);
  const r = await w.call('ana', 'recordConsent', {
    actions: ALL_ACTIONS, release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: 'key-stale-01',
  });
  assertEquals([r.status, r.code], [409, CODE.LEGAL_VERSION_CHANGED]);
  const r2 = await w.call('ana', 'recordConsent', {
    actions: ALL_ACTIONS, release_id: 'r-1.4', locale: 'uz', presentation_id: st.presentation_id, idempotency_key: 'key-stale-02',
  });
  assertEquals([r2.status, r2.code], [409, CODE.LEGAL_VERSION_CHANGED]);
  assertEquals(w.entities.ConsentRecord.rows.length, 0);
});

Deno.test('matrix: double-click / retry after commit → idempotent, no duplicate events', async () => {
  const w = makeWorld();
  await publish(w);
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  const req = { actions: ALL_ACTIONS, release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: 'key-retry-01' };
  const a = await w.call('ana', 'recordConsent', req);
  const b = await w.call('ana', 'recordConsent', req);
  assertEquals([a.allowed, b.allowed], [true, true]);
  assertEquals(w.entities.ConsentRecord.rows.length, 2);
});

Deno.test('recording: a partial first attempt is completed by the retry (crash between appends)', async () => {
  const w = makeWorld();
  await publish(w);
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  const base = { release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id, idempotency_key: 'key-partial-1' };
  await w.call('ana', 'recordConsent', { ...base, actions: [ALL_ACTIONS[0]] });
  const r = await w.call('ana', 'recordConsent', { ...base, actions: ALL_ACTIONS });
  assertEquals(r.allowed, true);
  assertEquals(w.entities.ConsentRecord.rows.length, 2);
});

Deno.test('recording: unaffirmed, unknown or duplicate actions are rejected', async () => {
  const w = makeWorld();
  await publish(w);
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  const base = { release_id: st.release.release_id, locale: 'uz', presentation_id: st.presentation_id };
  const bad = [
    [{ event_type: 'TERMS_ACCEPTED' }],
    [{ event_type: 'TERMS_ACCEPTED', affirmed: 'yes' }],
    [{ event_type: 'DATA_PROCESSING_CONSENT_GRANTED', purpose_scope_id: 'marketing', affirmed: true }],
    [ALL_ACTIONS[0], ALL_ACTIONS[0]],
    [],
  ];
  let i = 0;
  for (const actions of bad) {
    const r = await w.call('ana', 'recordConsent', { ...base, actions, idempotency_key: `key-bad-00${i++}` });
    assertEquals([r.status, r.code], [400, CODE.INVALID_REQUEST]);
  }
  assertEquals(w.entities.ConsentRecord.rows.length, 0);
});

// ------------------------------------------------------------------ policy change & withdrawal

Deno.test('matrix: policy changes while user is active → next status/guard call denies', async () => {
  const w = makeWorld();
  await publish(w, 'r-1.3');
  await acceptAll(w, 'ana');
  assertEquals((await checkConsent(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() })).allowed, true);
  w.advance(1000);
  const body = draftBody('r-1.4');
  body.documents = body.documents.map((d: any) => ({ ...d, version: '1.4', canonical_content: d.canonical_content + ' changed' }));
  await w.call('tee', 'adminCreateDraft', body);
  await w.call('tee', 'adminPublishRelease', { release_id: 'r-1.4', approval_reference: 'LAWYER-2' });
  const g = await checkConsent(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() });
  assertEquals([g.allowed, g.code], [false, CODE.CONSENT_REQUIRED]);
  const s = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals(s.allowed, false);
});

Deno.test('release: a release scheduled for later does not gate anyone until effective_at', async () => {
  const w = makeWorld();
  await publish(w, 'r-1.3');
  await acceptAll(w, 'ana');
  const body = draftBody('r-1.4');
  body.documents = body.documents.map((d: any) => ({ ...d, version: '1.4', canonical_content: d.canonical_content + ' later' }));
  await w.call('tee', 'adminCreateDraft', body);
  await w.call('tee', 'adminPublishRelease', { release_id: 'r-1.4', approval_reference: 'LAWYER-2', effective_at: '2026-11-08T00:00:00Z' });
  assertEquals((await w.call('ana', 'getConsentStatus', {})).allowed, true);
  w.advance(8 * 24 * 3600_000);
  assertEquals((await w.call('ana', 'getConsentStatus', {})).allowed, false);
});

Deno.test('matrix: withdraw → new event, grant + terms stay, scope inactive', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  const list = await w.call('ana', 'listMyConsents');
  const grant = list.records.find((r: any) => r.event_type === EVENT.DP_GRANTED);
  assert(grant.active_grant);
  const wd = await w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-withdraw-1' });
  assert(wd.ok);
  const rows = w.entities.ConsentRecord.rows;
  assertEquals(rows.map((r: any) => r.event_type), [EVENT.TERMS_ACCEPTED, EVENT.DP_GRANTED, EVENT.DP_WITHDRAWN]);
  assertEquals(rows[2].related_record_id, grant.record_id);
  const s = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals(s.required_actions.map((a: any) => a.event_type), [EVENT.DP_GRANTED]);
  // Same key again: idempotent, no third withdrawal row.
  await w.call('ana', 'withdrawConsent', { related_record_id: grant.record_id, idempotency_key: 'key-withdraw-1' });
  assertEquals(rows.length, 3);
});

Deno.test('withdrawal: cannot withdraw another user’s grant; works with no active release', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  const grantId = w.entities.ConsentRecord.rows.find((r: any) => r.event_type === EVENT.DP_GRANTED).id;
  const steal = await w.call('bob', 'withdrawConsent', { related_record_id: grantId, idempotency_key: 'key-steal-wd1' });
  assertEquals([steal.status, steal.code], [404, CODE.NOT_FOUND]);
  // Kill the active release: withdrawal must still work (ungated).
  w.entities.LegalPolicyRelease.rows.length = 0;
  const own = await w.call('ana', 'withdrawConsent', { related_record_id: grantId, idempotency_key: 'key-own-wd-01' });
  assert(own.ok);
});

// ------------------------------------------------------------------ registry / publisher

Deno.test('publisher: only allow-listed admins; approval reference and all 3 locales required', async () => {
  const w = makeWorld();
  assertEquals((await w.call('ana', 'adminCreateDraft', draftBody())).status, 403);
  const w2 = makeWorld({ LEGAL_PUBLISHER_USER_IDS: '' });
  assertEquals((await w2.call('tee', 'adminCreateDraft', draftBody())).status, 403);
  assert((await w.call('tee', 'adminCreateDraft', draftBody())).ok);
  const noRef = await w.call('tee', 'adminPublishRelease', { release_id: 'r-1.3', approval_reference: '' });
  assertEquals(noRef.status, 400);
  const partial = draftBody('r-uz-only');
  partial.documents = partial.documents.filter((d: any) => d.locale === 'uz');
  assert((await w.call('tee', 'adminCreateDraft', partial)).ok);
  const p = await w.call('tee', 'adminPublishRelease', { release_id: 'r-uz-only', approval_reference: 'LAWYER-1' });
  assertEquals(p.status, 400);
});

Deno.test('publisher: same version with different text is refused (artifacts are immutable)', async () => {
  const w = makeWorld();
  assert((await w.call('tee', 'adminCreateDraft', draftBody('r-a'))).ok);
  const r = await w.call('tee', 'adminCreateDraft', draftBody('r-b', { termsText: 'edited text' }));
  assertEquals(r.status, 409);
  // Same text, same version, new release → the stored artifact is reused.
  assert((await w.call('tee', 'adminCreateDraft', draftBody('r-c'))).ok);
  assertEquals(w.entities.LegalDocumentVersion.rows.length, 9);
});

Deno.test('publisher: publishing appends a new row; the draft row is unchanged; cannot publish twice', async () => {
  const w = makeWorld();
  await w.call('tee', 'adminCreateDraft', draftBody());
  const draftBefore = structuredClone(w.entities.LegalPolicyRelease.rows[0]);
  await w.call('tee', 'adminPublishRelease', { release_id: 'r-1.3', approval_reference: 'LAWYER-1' });
  assertEquals(w.entities.LegalPolicyRelease.rows[0], draftBefore);
  assertEquals(w.entities.LegalPolicyRelease.rows.map((r: any) => r.status), ['draft', 'published']);
  assertEquals((await w.call('tee', 'adminPublishRelease', { release_id: 'r-1.3', approval_reference: 'LAWYER-1' })).status, 409);
});

Deno.test('public package: no auth needed, exact artifact, no user records', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  const p = await w.call(null, 'getPublishedLegalPackage', { locale: 'en' });
  assertEquals([p.ok, p.locale, p.release.release_id], [true, 'en', 'r-1.3']);
  const offer = p.documents.find((d: any) => d.document_type === 'public_offer');
  assertEquals(offer.canonical_content, '# Offer en\nO‘zbek — тест ✓');
  assertEquals(offer.sha256, await sha256Hex(offer.canonical_content));
  assert(!JSON.stringify(p).includes('u_ana'));
});

// ------------------------------------------------------------------ guard

Deno.test('guard: off → allow; canary only gates listed ids; enforce gates everyone', async () => {
  const w = makeWorld({ LEGAL_CONSENT_MODE: 'off' });
  assertEquals((await checkConsent(w.entities, { id: 'u_bob' }, { getSecret: w.getSecret })).allowed, true);
  w.secrets.LEGAL_CONSENT_MODE = 'canary';
  w.secrets.LEGAL_CONSENT_CANARY_USER_IDS = 'u_ana';
  await publish(w);
  assertEquals((await checkConsent(w.entities, { id: 'u_bob' }, { getSecret: w.getSecret, now: w.now() })).allowed, true);
  assertEquals((await checkConsent(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() })).code, CODE.CONSENT_REQUIRED);
  w.secrets.LEGAL_CONSENT_MODE = 'enforce';
  assertEquals((await checkConsent(w.entities, { id: 'u_bob' }, { getSecret: w.getSecret, now: w.now() })).code, CODE.CONSENT_REQUIRED);
});

Deno.test('matrix: guard denies on DB outage / no release with a ready 503 Response', async () => {
  const w = makeWorld();
  let res = await consentDenial(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() });
  assertEquals([res?.status, (await res!.json()).code], [503, CODE.LEGAL_POLICY_UNAVAILABLE]);
  await publish(w);
  await acceptAll(w, 'ana');
  assertEquals(await consentDenial(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() }), null);
  w.failReads = true;
  res = await consentDenial(w.entities, { id: 'u_ana' }, { getSecret: w.getSecret, now: w.now() });
  assertEquals([res?.status, (await res!.json()).code], [503, CODE.CONSENT_CHECK_UNAVAILABLE]);
});

Deno.test('matrix: missing consent → guard Response 403 CONSENT_REQUIRED before any work', async () => {
  const w = makeWorld();
  await publish(w);
  const res = await consentDenial(w.entities, { id: 'u_bob' }, { getSecret: w.getSecret, now: w.now() });
  assertEquals([res?.status, (await res!.json()).code], [403, CODE.CONSENT_REQUIRED]);
});

Deno.test('guard: background job filter only passes consented users when enforced', async () => {
  const w = makeWorld();
  await publish(w);
  await acceptAll(w, 'ana');
  const ok = await consentFilter(w.entities, { getSecret: w.getSecret, now: w.now() });
  assertEquals([await ok({ id: 'u_ana' }), await ok({ id: 'u_bob' })], [true, false]);
  w.secrets.LEGAL_CONSENT_MODE = 'off';
  const all = await consentFilter(w.entities, { getSecret: w.getSecret, now: w.now() });
  assertEquals(await all({ id: 'u_bob' }), true);
});

Deno.test('deriveStatus: a later grant re-activates a withdrawn scope; hash mismatch never satisfies', () => {
  const release: any = {
    release_id: 'r', documents_by_locale: { uz: [
      { document_type: 'public_offer', document_id: 'public_offer:1:uz', version: '1', sha256: 'a'.repeat(64) },
      { document_type: 'data_processing_consent', document_id: 'data_processing_consent:1:uz', version: '1', sha256: 'b'.repeat(64) },
    ] },
    required_events_and_scopes: [
      { event_type: EVENT.TERMS_ACCEPTED, document_type: 'public_offer' },
      { event_type: EVENT.DP_GRANTED, purpose_scope_id: 's', document_type: 'data_processing_consent' },
    ],
  };
  const rec = (event_type: string, at: string, sha = event_type === EVENT.TERMS_ACCEPTED ? 'a' : 'b', doc = event_type === EVENT.TERMS_ACCEPTED ? 'public_offer' : 'data_processing_consent') => ({
    event_type, purpose_scope_id: event_type === EVENT.TERMS_ACCEPTED ? null : 's', occurred_at: at,
    document_id: `${doc}:1:uz`, document_version: '1', document_locale: 'uz', document_sha256: sha.repeat(64),
  });
  assertEquals(deriveStatus(release, [rec(EVENT.TERMS_ACCEPTED, '1'), rec(EVENT.DP_GRANTED, '2'), rec(EVENT.DP_WITHDRAWN, '3')]).allowed, false);
  assertEquals(deriveStatus(release, [rec(EVENT.TERMS_ACCEPTED, '1'), rec(EVENT.DP_WITHDRAWN, '2'), rec(EVENT.DP_GRANTED, '3')]).allowed, true);
  assertEquals(deriveStatus(release, [rec(EVENT.TERMS_ACCEPTED, '1', 'c'), rec(EVENT.DP_GRANTED, '2')]).allowed, false);
});
