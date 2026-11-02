// In-memory Base44 for the legal consent tests. Reuses the Admin Console mock
// entity (filter/list/get/create/update) and adds a call log so the
// append-only test can prove legal code never updates or deletes.
import { MockEntity } from '../admin-console-tests/mock_base44.ts';
import { createLegalApiHandler } from '../../base44/shared/legalApiHandler.js';

export const SECRET = 'x'.repeat(40);
export const USERS: Record<string, any> = {
  tee: { id: 'u_tee', email: 'tee@example.com', role: 'admin' },
  ana: { id: 'u_ana', email: 'ana@example.com', role: 'user', auth_provider: 'google' },
  bob: { id: 'u_bob', email: 'bob@example.com', role: 'user' },
};

export function makeWorld(secretOverrides: Record<string, string | undefined> = {}) {
  const calls: string[] = [];
  const entities: Record<string, any> = {};
  for (const n of ['LegalDocumentVersion', 'LegalPolicyRelease', 'ConsentRecord', 'User']) {
    const e = new MockEntity(n) as any;
    for (const m of ['create', 'update', 'delete', 'filter', 'list', 'get']) {
      const orig = e[m]?.bind(e);
      e[m] = async (...a: any[]) => {
        calls.push(`${n}.${m}`);
        if (world.failReads && (m === 'filter' || m === 'list')) throw new Error('db down');
        if (!orig) throw new Error(`${m} not supported`);
        return orig(...a);
      };
    }
    entities[n] = e;
  }
  const secrets: Record<string, string | undefined> = {
    LEGAL_PRESENTATION_SECRET: SECRET,
    LEGAL_PUBLISHER_USER_IDS: 'u_tee',
    LEGAL_CONSENT_MODE: 'enforce',
    ...secretOverrides,
  };
  let clock = Date.parse('2026-11-01T10:00:00Z');
  const world: any = {
    entities, calls, secrets, failReads: false,
    now: () => clock,
    advance: (ms: number) => { clock += ms; },
    getSecret: (n: string) => secrets[n],
  };
  const createClientFromRequest = (req: Request) => {
    const who = req.headers.get('x-user');
    return {
      auth: { me: async () => (who && USERS[who] ? { ...USERS[who] } : null) },
      asServiceRole: { entities },
    };
  };
  world.handler = createLegalApiHandler({ createClientFromRequest, getSecret: world.getSecret, now: world.now });
  world.call = async (who: string | null, action: string, body: Record<string, unknown> = {}) => {
    const res = await world.handler(new Request('https://x/legalApi', {
      method: 'POST', headers: who ? { 'x-user': who } : {}, body: JSON.stringify({ action, ...body }),
    }));
    return { status: res.status, ...(await res.json()) };
  };
  return world;
}

export const LABELS = {
  terms: { uz: 'Ofertani qabul qilaman', ru: 'Принимаю оферту', en: 'I accept the Offer' },
  dp: { uz: "Ma'lumotlarga rozilik", ru: 'Согласие на данные', en: 'I consent to processing' },
};

export function draftBody(releaseId = 'r-1.3', opts: { termsText?: string } = {}) {
  const documents = [];
  for (const l of ['uz', 'ru', 'en']) {
    documents.push({ document_type: 'public_offer', version: '1.3', locale: l, canonical_content: opts.termsText ?? `# Offer ${l}\r\nO‘zbek — тест ✓` });
    documents.push({ document_type: 'privacy_notice', version: '1.3', locale: l, canonical_content: `# Privacy ${l}` });
    documents.push({ document_type: 'data_processing_consent', version: '1.3', locale: l, canonical_content: `Consent ${l}` });
  }
  return {
    release_id: releaseId,
    documents,
    required_events_and_scopes: [
      { event_type: 'TERMS_ACCEPTED', document_type: 'public_offer', label_by_locale: LABELS.terms },
      { event_type: 'DATA_PROCESSING_CONSENT_GRANTED', purpose_scope_id: 'core_platform', document_type: 'data_processing_consent', label_by_locale: LABELS.dp },
    ],
  };
}

export async function publish(world: any, releaseId = 'r-1.3', extra: Record<string, unknown> = {}) {
  const d = await world.call('tee', 'adminCreateDraft', draftBody(releaseId));
  if (!d.ok) throw new Error('draft failed: ' + JSON.stringify(d));
  const p = await world.call('tee', 'adminPublishRelease', { release_id: releaseId, approval_reference: 'LAWYER-2026-11-xx', ...extra });
  if (!p.ok) throw new Error('publish failed: ' + JSON.stringify(p));
  return p;
}

export const ALL_ACTIONS = [
  { event_type: 'TERMS_ACCEPTED', affirmed: true },
  { event_type: 'DATA_PROCESSING_CONSENT_GRANTED', purpose_scope_id: 'core_platform', affirmed: true },
];

export async function acceptAll(world: any, who: string, key = 'key-' + who + '-0001', locale = 'uz') {
  const st = await world.call(who, 'getConsentStatus', { locale });
  return world.call(who, 'recordConsent', {
    actions: ALL_ACTIONS, release_id: st.release.release_id, locale, presentation_id: st.presentation_id, idempotency_key: key, origin_route: 'app-gate',
  });
}
