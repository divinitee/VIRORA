// Manifest validation: duplicates (GPT code audit, 2 Nov 2026, P2).
//
//   deno test --allow-read tools/legal-consent-tests/manifest.test.ts
//
// A release with a duplicate requirement, a duplicate document type in a
// locale, or a duplicate / mismatched document reference must never be
// drafted, published or served. Drafting writes nothing when it refuses.

import { assert, assertEquals } from 'jsr:@std/assert@1';
import { CODE, EVENT, validateManifest } from '../../base44/shared/legalCore.js';
import { LABELS, draftBody, makeWorld, publish } from './world.ts';

const SHA = 'a'.repeat(64);
const ref = (type: string, l: string, v = '1.3') => ({ document_type: type, document_id: `${type}:${v}:${l}`, version: v, sha256: SHA });
function goodManifest() {
  const docs: Record<string, any[]> = {};
  for (const l of ['uz', 'ru', 'en']) docs[l] = [ref('public_offer', l), ref('privacy_notice', l), ref('data_processing_consent', l)];
  return {
    release_id: 'r-1.3', approval_reference: 'LAWYER-1', documents_by_locale: docs,
    required_events_and_scopes: [
      { event_type: EVENT.TERMS_ACCEPTED, document_type: 'public_offer', label_by_locale: LABELS.terms },
      { event_type: EVENT.DP_GRANTED, purpose_scope_id: 'core_platform', document_type: 'data_processing_consent', label_by_locale: LABELS.dp },
    ],
  };
}
const has = (problems: string[], s: string) => problems.some((p) => p.includes(s));

Deno.test('manifest: the reference manifest is valid (control)', () => {
  assertEquals(validateManifest(goodManifest()), []);
});

Deno.test('manifest: duplicate requirement (same event + scope) is rejected', () => {
  const m = goodManifest();
  m.required_events_and_scopes.push({ ...m.required_events_and_scopes[1] });
  assert(has(validateManifest(m), 'duplicate requirement DATA_PROCESSING_CONSENT_GRANTED|core_platform'));
  const t = goodManifest();
  t.required_events_and_scopes.push({ ...t.required_events_and_scopes[0] });
  assert(has(validateManifest(t), 'duplicate requirement TERMS_ACCEPTED|'));
});

Deno.test('manifest: the same event with DIFFERENT scopes is allowed (two grants are two requirements)', () => {
  const m = goodManifest();
  m.required_events_and_scopes.push({ event_type: EVENT.DP_GRANTED, purpose_scope_id: 'ai_feedback', document_type: 'data_processing_consent', label_by_locale: LABELS.dp });
  assertEquals(validateManifest(m), []);
});

Deno.test('manifest: duplicate document type within one locale is rejected', () => {
  const m = goodManifest();
  m.documents_by_locale.ru.push(ref('public_offer', 'ru', '1.4'));
  assert(has(validateManifest(m), 'ru duplicate document_type public_offer'));
});

Deno.test('manifest: duplicate or mismatched document references are rejected', () => {
  const m = goodManifest();
  m.documents_by_locale.ru[0] = { ...ref('public_offer', 'uz') }; // ru points at the uz artifact
  const p = validateManifest(m);
  assert(has(p, 'ru public_offer document_id public_offer:1.3:uz does not match'));
  assert(has(p, 'duplicate document reference public_offer:1.3:uz'));
  const v = goodManifest();
  v.documents_by_locale.en[1] = { ...ref('privacy_notice', 'en'), version: '9.9' }; // id says 1.3, version says 9.9
  assert(has(validateManifest(v), 'en privacy_notice document_id privacy_notice:1.3:en does not match'));
});

Deno.test('publisher: a draft with a duplicate requirement is refused and writes NOTHING', async () => {
  const w = makeWorld();
  const body = draftBody('r-dup-req');
  body.required_events_and_scopes.push({ ...body.required_events_and_scopes[1] });
  const r = await w.call('tee', 'adminCreateDraft', body);
  assertEquals([r.status, r.code], [400, CODE.INVALID_REQUEST]);
  assert(String(r.message).includes('duplicate requirement'));
  assertEquals(w.entities.LegalPolicyRelease.rows.length, 0);
  assertEquals(w.entities.LegalDocumentVersion.rows.length, 0, 'no orphan document rows');
});

Deno.test('publisher: a draft with the same document type twice in one locale is refused and writes NOTHING', async () => {
  const w = makeWorld();
  const body = draftBody('r-dup-doc');
  body.documents.push({ document_type: 'public_offer', version: '1.4', locale: 'uz', canonical_content: '# Another offer' });
  const r = await w.call('tee', 'adminCreateDraft', body);
  assertEquals([r.status, r.code], [400, CODE.INVALID_REQUEST]);
  assert(String(r.message).includes('uz duplicate document_type public_offer'));
  assertEquals(w.entities.LegalPolicyRelease.rows.length, 0);
  assertEquals(w.entities.LegalDocumentVersion.rows.length, 0);
});

Deno.test('publisher: the identical document listed twice is refused too (would be served ambiguously)', async () => {
  const w = makeWorld();
  const body = draftBody('r-dup-same');
  body.documents.push({ ...body.documents[0] });
  const r = await w.call('tee', 'adminCreateDraft', body);
  assertEquals(r.status, 400);
  assertEquals(w.entities.LegalDocumentVersion.rows.length, 0);
});

Deno.test('publisher: a stored draft carrying duplicates (bypassing draft checks) cannot be published', async () => {
  const w = makeWorld();
  const d = await w.call('tee', 'adminCreateDraft', draftBody('r-tamper'));
  assert(d.ok);
  const draft = w.entities.LegalPolicyRelease.rows.find((r: any) => r.status === 'draft');
  draft.required_events_and_scopes.push({ ...draft.required_events_and_scopes[0] });
  const p = await w.call('tee', 'adminPublishRelease', { release_id: 'r-tamper', approval_reference: 'LAWYER-2026-11-xx' });
  assertEquals([p.status, p.code], [400, CODE.INVALID_REQUEST]);
  assert(String(p.message).includes('duplicate requirement'));
  assertEquals(w.entities.LegalPolicyRelease.rows.filter((r: any) => r.status === 'published').length, 0);
});

Deno.test('fail closed: a published release that somehow carries duplicates is never served (503, consent blocked)', async () => {
  const w = makeWorld();
  await publish(w);
  const live = w.entities.LegalPolicyRelease.rows.find((r: any) => r.status === 'published');
  live.documents_by_locale.uz.push({ ...live.documents_by_locale.uz[0] });
  const st = await w.call('ana', 'getConsentStatus', { locale: 'uz' });
  assertEquals([st.status, st.code], [503, CODE.LEGAL_POLICY_UNAVAILABLE]);
  const pkg = await w.call(null, 'getPublishedLegalPackage', { locale: 'uz' });
  assertEquals(pkg.status, 503);
});
