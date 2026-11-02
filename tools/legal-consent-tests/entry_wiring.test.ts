// Loads the REAL function entries with the SDK and runtime mocked and proves
// the consent guard runs BEFORE any work, with the real secret names.
//
//   deno test --allow-read --allow-net=registry.npmjs.org --node-modules-dir=none --no-check --import-map=tools/legal-consent-tests/import_map.json tools/legal-consent-tests/entry_wiring.test.ts

import { assertEquals, assertNotEquals } from 'jsr:@std/assert@1';
import { store } from 'base44:runtime';
import { entities } from './mock_sdk_module.ts';

const handlers: Record<string, (req: Request) => Promise<Response>> = {};
let current = '';
(Deno as any).serve = (h: any) => { handlers[current] = h; return { shutdown() {}, finished: Promise.resolve() }; };
async function load(name: string) {
  current = name;
  const mod = await import(`../../base44/functions/${name}/entry.ts`);
  if (mod.default) handlers[name] = mod.default;
}
for (const f of ['legalApi', 'aiApi', 'studentApi', 'coachApi', 'progressApi', 'teacherApi', 'chatApi']) await load(f);

const post = (fn: string, who: string | null, body: Record<string, unknown>) => handlers[fn](new Request('http://x', {
  method: 'POST', headers: who ? { 'x-user': who, 'content-type': 'application/json' } : {}, body: JSON.stringify(body),
}));

Deno.test('wiring: enforce + no release → every guarded entry denies before work (503 LEGAL_POLICY_UNAVAILABLE)', async () => {
  store.LEGAL_CONSENT_MODE = 'enforce';
  for (const fn of ['aiApi', 'studentApi', 'coachApi', 'progressApi', 'teacherApi', 'chatApi']) {
    const r = await post(fn, 'ana', { action: 'gradeSentence', sentence: 'hi', room_id: 'x', text: 'y' });
    assertEquals([fn, r.status, (await r.json()).code], [fn, 503, 'LEGAL_POLICY_UNAVAILABLE']);
  }
  // Nothing metered, nothing written by the guarded functions.
  assertEquals(entities.ConsentRecord.rows.length, 0);
});

Deno.test('wiring: canary mode only gates the listed user', async () => {
  store.LEGAL_CONSENT_MODE = 'canary';
  store.LEGAL_CONSENT_CANARY_USER_IDS = 'u_ana';
  const ana = await post('studentApi', 'ana', { action: 'nope' });
  assertEquals((await ana.json()).code, 'LEGAL_POLICY_UNAVAILABLE');
  const bob = await post('studentApi', 'bob', { action: 'nope' });
  assertEquals((await bob.json()).code, 'unknown_action'); // passed the guard
});

Deno.test('wiring: mode off → guard is a no-op (production unchanged until rollout)', async () => {
  delete store.LEGAL_CONSENT_MODE;
  const r = await post('studentApi', 'ana', { action: 'nope' });
  assertEquals((await r.json()).code, 'unknown_action');
});

Deno.test('wiring: legalApi entry reads LEGAL_* secrets and stays reachable when gated', async () => {
  store.LEGAL_CONSENT_MODE = 'enforce';
  const pub = await post('legalApi', null, { action: 'getPublishedLegalPackage', locale: 'uz' });
  assertEquals([pub.status, (await pub.json()).code], [503, 'LEGAL_POLICY_UNAVAILABLE']);
  store.LEGAL_PUBLISHER_USER_IDS = 'u_tee';
  const list = await post('legalApi', 'tee', { action: 'adminListReleases' });
  assertEquals(list.status, 200);
  const notPub = await post('legalApi', 'ana', { action: 'adminListReleases' });
  assertNotEquals(notPub.status, 200);
});
