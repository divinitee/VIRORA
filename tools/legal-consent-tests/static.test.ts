// Static checks (Legal Consent Architecture §6, §12, §14):
//   - the three legal entities deny every direct client operation (RLS never),
//   - no code anywhere updates or deletes them,
//   - every user-invoked backend function either calls the consent guard or is
//     listed below with the reason it is exempt.
//
//   deno test --allow-read tools/legal-consent-tests/

import { assert, assertEquals } from 'jsr:@std/assert@1';

const ROOT = new URL('../../', import.meta.url);
const read = (p: string) => Deno.readTextFileSync(new URL(p, ROOT));

function* walk(dir: string): Generator<string> {
  for (const e of Deno.readDirSync(new URL(dir, ROOT))) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory && e.name !== 'node_modules') yield* walk(p);
    else if (/\.(js|jsx|ts|tsx)$/.test(e.name)) yield p;
  }
}

Deno.test('schema: LegalDocumentVersion / LegalPolicyRelease / ConsentRecord / ConsentWriteLock are RLS never for create/read/update/delete', () => {
  for (const n of ['LegalDocumentVersion', 'LegalPolicyRelease', 'ConsentRecord', 'ConsentWriteLock']) {
    const e = JSON.parse(read(`base44/entities/${n}.jsonc`));
    for (const op of ['create', 'read', 'update', 'delete']) {
      assertEquals(e.rls?.[op]?.user_condition?.role, 'never', `${n}.${op}`);
    }
  }
});

Deno.test('append-only: no code updates or deletes legal/consent entities', () => {
  const bad: string[] = [];
  for (const dir of ['src', 'base44']) {
    for (const f of walk(dir)) {
      const s = read(f);
      if (/(ConsentRecord|LegalPolicyRelease|LegalDocumentVersion)\s*\.\s*(update|updateMany|upsert|delete|deleteMany|bulkUpdate)\s*\(/.test(s)) bad.push(f);
    }
  }
  assertEquals(bad, []);
  // The handler only ever calls .create on the three entities.
  const h = read('base44/shared/legalApiHandler.js');
  assert(!/\.(update|updateMany|upsert|delete|deleteMany|bulkUpdate)\(/.test(h), 'legalApiHandler must be create/read only');
});

Deno.test('write lock: only consentLock.js touches ConsentWriteLock, it never touches evidence, and the schema holds no user field', () => {
  const users: string[] = [];
  for (const dir of ['src', 'base44']) {
    for (const f of walk(dir)) if (/ConsentWriteLock\s*\./.test(read(f))) users.push(f);
  }
  assertEquals(users, ['base44/shared/consentLock.js']);
  const lock = read('base44/shared/consentLock.js');
  assert(!/(ConsentRecord|LegalPolicyRelease|LegalDocumentVersion)\s*\./.test(lock), 'lock module must not touch evidence entities');
  const props = Object.keys(JSON.parse(read('base44/entities/ConsentWriteLock.jsonc')).properties);
  assertEquals(props.sort(), ['holder', 'lease_until', 'shard', 'version']);
});

Deno.test('browser never touches legal entities directly', () => {
  const bad: string[] = [];
  for (const f of walk('src')) {
    if (/entities\.(ConsentRecord|LegalPolicyRelease|LegalDocumentVersion)\b/.test(read(f))) bad.push(f);
  }
  assertEquals(bad, []);
});

// Every function, and why it is or isn't consent-gated. A new function fails
// this test until someone decides which list it belongs in.
const GUARDED = [
  'aiApi', 'process-material', 'chatApi', 'coachApi', 'progressApi', 'studentApi', 'teacherApi',
  'qrPayApi', 'createDodoCheckout', 'dodoPortal',
];
const FILTERED = ['sendDailyReminder']; // bulk job: skips users without current consent
const EXEMPT: Record<string, string> = {
  legalApi: 'control plane: documents, status, consent and withdrawal must work for un-consented users',
  adminApi: 'operator console (admin + TOTP), not data-subject processing',
  taskboardApi: 'internal admin-only build log; no learner data',
  verifyDodoConfig: 'admin-only config check',
  exportQuizToSheets: 'admin-only export to the operator Google Sheet (Sheets is a processor: lawyer list)',
  expireSubscriptions: 'admin/schedule: contract-necessary subscription state change',
  sendExpirationReminders: 'admin/schedule: contract-necessary renewal notice to paying subscribers (lawyer to confirm)',
  notifyNewSubscription: 'admin/schedule: notifies the teacher, operator processing',
  dodoWebhook: 'payment provider webhook, no user session',
  telegramPayBot: 'admin Telegram bot webhook, no user session',
};

Deno.test('coverage: every backend function is guarded, filtered or explicitly exempt', () => {
  const fns = [...Deno.readDirSync(new URL('base44/functions', ROOT))].filter((e) => e.isDirectory).map((e) => e.name).sort();
  const known = new Set([...GUARDED, ...FILTERED, ...Object.keys(EXEMPT)]);
  assertEquals(fns.filter((f) => !known.has(f)), [], 'unclassified function(s) — add a consent decision');
  for (const f of GUARDED) {
    const src = [...Deno.readDirSync(new URL(`base44/functions/${f}`, ROOT))].map((e) => read(`base44/functions/${f}/${e.name}`)).join('\n');
    assert(/consentDenial\(/.test(src), `${f} must call consentDenial`);
  }
  for (const f of FILTERED) {
    assert(/consentFilter\(/.test(read(`base44/functions/${f}/entry.ts`)), `${f} must call consentFilter`);
  }
});

Deno.test('agents: no browser code calls Base44 agents (agents must also be disabled in the dashboard)', () => {
  // Agent configs have no "disabled" switch in the repo; disabling the
  // vocabulary_tutor agent (and its MCP exposure) is a manual Base44 step in
  // LEGAL-CONSENT-V1-HANDOFF.md. What the repo can prove: nothing calls one.
  for (const f of walk('src')) assert(!/base44\.agents\./.test(read(f)), `${f} calls agents directly`);
});
