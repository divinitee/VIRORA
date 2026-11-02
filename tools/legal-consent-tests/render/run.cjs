// NODE_PATH=<dir with jsdom> node tools/legal-consent-tests/render/run.cjs
// Render-level proof of the §14 UI rows with the real ConsentProvider,
// consentGateView, ConsentGateScreen and consent interceptor.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const bundle = fs.readFileSync(process.env.BUNDLE_OUT || '/tmp/consent-render-bundle.js', 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failures++; };

const RELEASE = { release_id: 'r-1.3', effective_at: '2026-11-01T00:00:00Z', locales: ['uz', 'ru', 'en'] };
const docs = (l) => ['public_offer', 'privacy_notice', 'data_processing_consent'].map((t) => ({
  document_id: `${t}:1.3:${l}`, document_type: t, version: '1.3', locale: l, sha256: 'a'.repeat(64), content_format: 'markdown', canonical_content: `# ${t} ${l}`,
}));
const required = (l) => ({
  ok: true, mode: 'enforce', enforced: true, allowed: false, release: RELEASE, locale: l, presentation_id: `pres-${l}`,
  documents: docs(l),
  required_actions: [
    { event_type: 'TERMS_ACCEPTED', purpose_scope_id: null, document_type: 'public_offer', label: `TERMS-LABEL-${l}` },
    { event_type: 'DATA_PROCESSING_CONSENT_GRANTED', purpose_scope_id: 'core', document_type: 'data_processing_consent', label: `DP-LABEL-${l}` },
  ],
});
const allowed = { ok: true, mode: 'enforce', enforced: true, allowed: true, release: RELEASE, locale: 'uz' };

function boot(setup, path = '/') {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://virora.space' + path, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
  w.__scenario = { user: { id: 'u1', role: 'user' }, handlers: {} };
  w.localStorage.setItem('app_lang', 'uz');
  setup(w.__scenario, w);
  w.eval(bundle);
  w.__mount(w.document.getElementById('root'));
  return w;
}
const text = (w) => w.document.body.textContent;
const button = (w, label) => [...w.document.querySelectorAll('button')].find((b) => b.textContent.trim().includes(label));
const click = (w, el) => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const boxes = (w) => [...w.document.querySelectorAll('button[role="checkbox"]')];
const records = (w) => w.__calls.filter((c) => c.fn === 'legalApi' && c.action === 'recordConsent');

(async () => {
  // 1. status unresolved → loader only, nothing protected, no globals
  let w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => new Promise(() => {}); });
  await sleep(150);
  check(text(w).includes('LOADER') && !text(w).includes('ROUTE') && !text(w).includes('GLOBALS'), 'checking: loader only, no route, no global components');

  // 2. status endpoint fails → can't-verify screen, Retry + Sign out, no app
  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => ({ __error: 1, status: 503, code: 'CONSENT_CHECK_UNAVAILABLE' }); });
  await sleep(150);
  check(text(w).includes("Rozilik holatingizni tekshirib bo'lmadi") && !text(w).includes('ROUTE'), 'status outage: distinct "couldn\'t verify" screen, app blocked');
  check(!!button(w, 'Qayta urinish') && !!button(w, 'Chiqish'), 'status outage: Retry and Sign out offered');

  // 3. no published release → service-unavailable variant
  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => ({ __error: 1, status: 503, code: 'LEGAL_POLICY_UNAVAILABLE' }); });
  await sleep(150);
  check(text(w).includes('Xizmat vaqtincha mavjud emas') && !text(w).includes('ROUTE'), 'no active release: service-unavailable screen, app blocked');

  // 4. existing user without records → blocking gate; controls start unchecked & disabled
  let committed = false;
  w = boot((s) => {
    s.handlers['legalApi.getConsentStatus'] = () => (committed ? allowed : required('uz'));
    s.handlers['legalApi.recordConsent'] = () => ({ __error: 1, status: 500, code: 'X' });
  });
  await sleep(150);
  check(text(w).includes('Yangilangan shartlar') && !text(w).includes('ROUTE') && !text(w).includes('GLOBALS'), 'required: blocking gate before any app content or globals');
  check(boxes(w).length === 2 && boxes(w).every((b) => b.getAttribute('aria-checked') === 'false' && b.disabled), 'required: two separate unchecked controls, disabled until documents opened');
  check(text(w).includes('TERMS-LABEL-uz') && text(w).includes('DP-LABEL-uz'), 'labels come from the server release');
  const submit = () => button(w, 'Tasdiqlash va davom etish');
  check(submit().disabled, 'submit disabled before opening documents');
  for (const b of [...w.document.querySelectorAll('button[aria-expanded]')]) { click(w, b); await sleep(20); }
  await sleep(50);
  check(boxes(w).every((b) => !b.disabled), 'checkboxes enabled once every document was opened');
  click(w, boxes(w)[0]); await sleep(30);
  check(submit().disabled, 'terms only: submit still disabled (data-processing scope required)');
  click(w, boxes(w)[1]); await sleep(30);
  check(!submit().disabled, 'both ticked: submit enabled');

  // 5. failed write keeps the gate, keeps ticks, retry reuses the idempotency key
  click(w, submit()); await sleep(100);
  check(text(w).includes("Tanlovingizni saqlab bo'lmadi") && !text(w).includes('ROUTE'), 'write failure: gate stays, error shown');
  check(boxes(w).every((b) => b.getAttribute('aria-checked') === 'true'), 'write failure: ticks kept in memory');
  w.__scenario.handlers['legalApi.recordConsent'] = () => { committed = true; return { ok: true, allowed: true, records: [] }; };
  click(w, submit()); await sleep(200);
  const rec = records(w);
  check(rec.length === 2 && rec[0].idempotency_key === rec[1].idempotency_key, 'retry after failure reuses the same idempotency key');
  check(rec[1].presentation_id === 'pres-uz' && rec[1].release_id === 'r-1.3' && rec[1].locale === 'uz', 'submission carries server presentation, release and locale');
  check(rec[1].actions.every((a) => a.affirmed === true) && !('occurred_at' in rec[1]) && !('user_id' in rec[1]) && !('sha256' in rec[1]), 'payload: explicit choices only — no browser timestamp, user id or hash');
  check(text(w).includes('ROUTE /') && text(w).includes('GLOBALS-MOUNTED'), 'unlock only after a fresh status read says allowed; globals mount then');

  // 6. mid-session: a backend function answers CONSENT_REQUIRED → gate immediately
  let flip = false;
  w = boot((s) => {
    s.handlers['legalApi.getConsentStatus'] = () => (flip ? required('uz') : allowed);
    s.handlers.aiApi = () => ({ __error: 1, status: 403, code: 'CONSENT_REQUIRED' });
  });
  await sleep(150);
  check(text(w).includes('ROUTE /'), 'verified user sees the app');
  flip = true;
  click(w, button(w, 'CALL-AI')); await sleep(150);
  check(text(w).includes('Yangilangan shartlar') && !text(w).includes('ROUTE'), 'CONSENT_REQUIRED from aiApi → gate shown without reload');

  // 7. new release while active, no API call → caught by the periodic re-check
  flip = false;
  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => (flip ? required('uz') : allowed); });
  await sleep(150);
  flip = true;
  await sleep(500);
  check(text(w).includes('Yangilangan shartlar'), 'policy change detected by the periodic re-check');

  // 8. re-check fails twice while verified → blocks (no cached allow)
  let fail = false;
  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => (fail ? { __error: 1, status: 503, code: 'CONSENT_CHECK_UNAVAILABLE' } : allowed); });
  await sleep(150);
  fail = true;
  w.dispatchEvent(new w.Event('focus'));
  await sleep(2400);
  check(text(w).includes("tekshirib bo'lmadi") && !text(w).includes('ROUTE'), 're-check failure (after one quiet retry) blocks: no cached allow');

  // 9. ungated paths stay reachable for an un-consented user; globals stay off
  for (const p of ['/terms', '/privacy', '/legal/consents', '/admin/legal']) {
    w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => required('uz'); }, p);
    await sleep(120);
    check(text(w).includes(`ROUTE ${p}`) && !text(w).includes('GLOBALS'), `${p}: reachable without consent, no global components`);
  }
  // /oauth/consent is gated and records origin oauth/consent
  w = boot((s) => {
    s.handlers['legalApi.getConsentStatus'] = () => required('uz');
    s.handlers['legalApi.recordConsent'] = () => ({ ok: true, allowed: true, records: [] });
  }, '/oauth/consent?ctx=abc');
  await sleep(150);
  check(text(w).includes('Yangilangan shartlar') && !text(w).includes('ROUTE'), '/oauth/consent: gate before the MCP approve page');
  for (const b of [...w.document.querySelectorAll('button[aria-expanded]')]) { click(w, b); await sleep(20); }
  for (const b of boxes(w)) { click(w, b); await sleep(20); }
  click(w, button(w, 'Tasdiqlash')); await sleep(100);
  check(records(w)[0]?.origin_route === 'oauth/consent' && w.location.search === '?ctx=abc', '/oauth/consent: origin recorded, OAuth ctx preserved for resume');

  // 10. locale switch → new presentation in that locale, ticks reset
  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = (p) => required(p.locale); });
  await sleep(150);
  click(w, button(w, 'ru')); await sleep(150);
  check(text(w).includes('TERMS-LABEL-ru') && text(w).includes('Обновлённые условия'), 'locale switch loads the RU artifact and labels');

  // 11. signed out → no gate, no status call
  w = boot((s) => { s.user = null; s.handlers['legalApi.getConsentStatus'] = () => required('uz'); });
  await sleep(120);
  check(w.__calls.length === 0 && text(w).includes('ROUTE /') && !text(w).includes('GLOBALS'), 'signed out: no status call, no globals (route guard handles access)');

  // 12. sign-out from the gate
  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => required('uz'); });
  await sleep(120);
  click(w, button(w, 'Chiqish')); await sleep(30);
  check(String(w.__loggedOut || '').endsWith('/landing'), 'gate offers sign-out');

  console.log(failures ? `\n${failures} FAILED` : '\nALL PASS');
  process.exit(failures ? 1 : 0);
})();
