// Withdrawal lifecycle (GPT code audit, 2 Nov 2026, P1): after a successful
// withdrawal the app-wide consent state is re-read AT ONCE, protected query
// caches are dropped, analytics stop, and the gate is back up — without
// waiting for the periodic re-check (stretched to 60 s here to prove it).
//   ENTRY=entry_withdraw.jsx ANALYTICS_SPY=1 BUNDLE_OUT=/tmp/consent-withdraw.js node tools/legal-consent-tests/render/build.mjs
//   BUNDLE_OUT=/tmp/consent-withdraw.js NODE_PATH=<jsdom dir> node tools/legal-consent-tests/render/run_withdraw.cjs
// Gate OFF variant (shipped default): add GATE_OFF=1 to the build and run with GATE_OFF=1.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const bundle = fs.readFileSync(process.env.BUNDLE_OUT || '/tmp/consent-withdraw.js', 'utf8');
const OFF = !!process.env.GATE_OFF;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failures++; };
const RELEASE = { release_id: 'r-1.3', effective_at: '2026-11-01T00:00:00Z', locales: ['uz', 'ru', 'en'] };
const allowed = { ok: true, mode: 'enforce', enforced: true, allowed: true, release: RELEASE, locale: 'uz' };
const required = { ok: true, mode: 'enforce', enforced: true, allowed: false, release: RELEASE, locale: 'uz', presentation_id: 'p', documents: [], required_actions: [] };
const grant = { record_id: 'cr_1', event_type: 'DATA_PROCESSING_CONSENT_GRANTED', occurred_at: '2026-11-01T10:00:00Z', release_id: 'r-1.3', document_version: '1.3', document_locale: 'uz', purpose_scope_id: 'core_learning', active_grant: true };

function boot({ withdraw, statusAfter }) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://virora.space/legal/consents', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
  w.confirm = () => true;
  w.__recheckMs = 60000;
  const srv = { withdrawn: false };
  w.__scenario = { user: { id: 'u1', role: 'user' }, handlers: {
    'legalApi.getConsentStatus': () => (srv.withdrawn ? statusAfter() : allowed),
    'legalApi.listMyConsents': () => ({ ok: true, records: srv.withdrawn ? [{ ...grant, active_grant: false }, { record_id: 'cr_2', event_type: 'DATA_PROCESSING_CONSENT_WITHDRAWN', occurred_at: '2026-11-02T10:00:00Z', release_id: 'r-1.3', document_version: '1.3', document_locale: 'uz' }] : [grant] }),
    'legalApi.withdrawConsent': () => { const out = withdraw(); if (!out.__error) srv.withdrawn = true; return out; },
  } };
  w.eval(bundle);
  w.__mount(w.document.getElementById('root'));
  return w;
}
const statusCalls = (w) => w.__calls.filter((c) => c.fn === 'legalApi' && c.action === 'getConsentStatus').length;
const lastAnalytics = (w) => (w.__analytics || []).at(-1)?.[0];
const withdrawButton = (w) => [...w.document.querySelectorAll('li button')][0];
const click = (w, el) => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));

(async () => {
  // 1. Successful withdrawal.
  let w = boot({ withdraw: () => ({ ok: true, record_id: 'cr_2' }), statusAfter: () => required });
  await sleep(200);
  if (!OFF) check(w.__consentState === 'verified' && lastAnalytics(w) === 'enable', 'start: consent verified, analytics on');
  check(!!withdrawButton(w), 'start: MyConsents lists the active grant with a withdraw button');
  w.__qc.setQueryData(['protected', 'progress'], { xp: 120 });
  const before = statusCalls(w);
  click(w, withdrawButton(w));
  await sleep(150); // far below the 60 s periodic re-check
  const i = w.__calls.findIndex((c) => c.action === 'withdrawConsent');
  check(i >= 0, 'withdrawal sent to legalApi');
  check(lastAnalytics(w) === 'disable', 'analytics stopped immediately');
  check(w.__qc.getQueryData(['protected', 'progress']) === undefined, 'protected query cache cleared');
  if (OFF) {
    check(statusCalls(w) === 0, 'gate off: no consent status call, app otherwise unchanged');
    w.__navigate('/lesson'); await sleep(50);
    check(w.document.body.textContent.includes('PROTECTED /lesson'), 'gate off: app still renders (dormant)');
  } else {
    check(statusCalls(w) === before + 1 && w.__calls.slice(i + 1).some((c) => c.action === 'getConsentStatus'), 'fresh consent status read right after the withdrawal');
    check(w.__consentState === 'required', 'consent state moved to required at once');
    check(['Rozilik qaytarib olindi.', 'Согласие отозвано.', 'Consent withdrawn.'].some((t) => w.document.querySelector('[role=status]')?.textContent === t), 'MyConsents stays reachable (ungated) and confirms the withdrawal');
    check(!withdrawButton(w), 'records reloaded: no active grant left to withdraw');
    w.__navigate('/lesson'); await sleep(50);
    check(!w.document.body.textContent.includes('PROTECTED'), 'protected route now blocked by the gate');
  }

  if (!OFF) {
    // 2. Withdrawal fails: nothing changes, no false "withdrawn".
    w = boot({ withdraw: () => ({ __error: 1, status: 500, code: 'WRITE_FAILED' }), statusAfter: () => required });
    await sleep(200);
    w.__qc.setQueryData(['protected', 'progress'], { xp: 120 });
    const b2 = statusCalls(w);
    click(w, withdrawButton(w));
    await sleep(150);
    check(w.__consentState === 'verified' && statusCalls(w) === b2, 'failed withdrawal: consent state untouched, no refresh');
    check(w.__qc.getQueryData(['protected', 'progress'])?.xp === 120, 'failed withdrawal: caches kept');
    check(w.document.body.textContent.includes('support@virora.space') && !!withdrawButton(w), 'failed withdrawal: error shown, grant still withdrawable');

    // 3. Withdrawal commits but the fresh status read fails: fail closed.
    w = boot({ withdraw: () => ({ ok: true, record_id: 'cr_2' }), statusAfter: () => ({ __error: 1, status: 503, code: 'CONSENT_CHECK_UNAVAILABLE' }) });
    await sleep(200);
    w.__qc.setQueryData(['protected', 'progress'], { xp: 120 });
    click(w, withdrawButton(w));
    await sleep(150);
    check(w.__consentState === 'unavailable', 'status unreadable after withdrawal: blocked (unavailable), never left verified');
    check(w.__qc.getQueryData(['protected', 'progress']) === undefined && lastAnalytics(w) === 'disable', 'status unreadable after withdrawal: caches cleared, analytics off');
  }

  console.log(failures ? `FAILED ${failures}` : 'ALL PASS');
  process.exit(failures ? 1 : 0);
})();
