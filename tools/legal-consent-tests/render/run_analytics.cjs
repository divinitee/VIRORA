// Analytics follow VERIFIED consent only (GPT final decision, 2 Nov 2026).
//   ANALYTICS_SPY=1 BUNDLE_OUT=/tmp/consent-analytics.js node tools/legal-consent-tests/render/build.mjs
//   BUNDLE_OUT=/tmp/consent-analytics.js NODE_PATH=<jsdom dir> node tools/legal-consent-tests/render/run_analytics.cjs
// Uses the real ConsentProvider with the gate switched on (mocked config) and
// a spy in place of src/lib/analyticsConsent.js.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const bundle = fs.readFileSync(process.env.BUNDLE_OUT || '/tmp/consent-analytics.js', 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const check = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failures++; };
const RELEASE = { release_id: 'r-1.3', effective_at: '2026-11-01T00:00:00Z', locales: ['uz', 'ru', 'en'] };
const allowed = { ok: true, mode: 'enforce', enforced: true, allowed: true, release: RELEASE, locale: 'uz' };
const modeOff = { ok: true, mode: 'off', enforced: false, allowed: true };
const required = { ok: true, mode: 'enforce', enforced: true, allowed: false, release: RELEASE, locale: 'uz', presentation_id: 'p', documents: [], required_actions: [] };

function boot(setup) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://virora.space/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
  w.__scenario = { user: { id: 'u1', role: 'user' }, handlers: {} };
  setup(w.__scenario);
  w.eval(bundle);
  w.__mount(w.document.getElementById('root'));
  return w;
}
const enables = (w) => (w.__analytics || []).filter((e) => e[0] === 'enable');
const last = (w) => (w.__analytics || []).at(-1)?.[0];

(async () => {
  let w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => new Promise(() => {}); });
  await sleep(150);
  check(enables(w).length === 0, 'status not known yet: analytics never started');

  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => required; });
  await sleep(150);
  check(enables(w).length === 0 && last(w) === 'disable', 'consent required: no analytics, client disabled');

  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => modeOff; });
  await sleep(150);
  check(enables(w).length === 0 && last(w) === 'disable', 'consent mode off (enforced:false): app runs, but NOT treated as consent, no analytics');

  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => ({ __error: 1, status: 503, code: 'CONSENT_CHECK_UNAVAILABLE' }); });
  await sleep(150);
  check(enables(w).length === 0 && last(w) === 'disable', 'status unreadable: no analytics');

  let flip = 'allowed';
  w = boot((s) => { s.handlers['legalApi.getConsentStatus'] = () => (flip === 'allowed' ? allowed : flip === 'required' ? required : { __error: 1, status: 503, code: 'CONSENT_CHECK_UNAVAILABLE' }); });
  await sleep(150);
  check(enables(w).length === 1 && enables(w)[0][1] === 'u1' && last(w) === 'enable', 'verified consent (enforced + allowed): analytics start for that user');
  flip = 'required';
  await sleep(500);
  check(last(w) === 'disable', 'consent withdrawn / new release required: analytics stop at the next check');

  w = boot((s) => { s.user = null; s.handlers['legalApi.getConsentStatus'] = () => allowed; });
  await sleep(150);
  check(enables(w).length === 0, 'signed out: analytics never start');

  const my = fs.readFileSync(path.join(process.cwd(), 'src/pages/MyConsents.jsx'), 'utf8');
  // Order in the success path: commit → analytics off → app-wide re-check.
  // (Behaviour is proven end to end by run_withdraw.cjs.)
  const iW = my.indexOf('await withdrawConsent('), iCatch = my.indexOf('} catch', iW), iOff = my.indexOf('disableConsentedAnalytics();', iW), iRe = my.indexOf('consent.withdrawn()', iW);
  const failPath = my.slice(iCatch, my.indexOf('}', my.indexOf('return;', iCatch)));
  check(iW > 0 && iOff > iCatch && iRe > iOff && failPath.includes('return;') && !failPath.includes('disableConsentedAnalytics'),
    'withdrawal page stops analytics right after a successful withdrawal (and only then), before the app-wide re-check');

  console.log(failures ? `\n${failures} FAILED` : '\nALL PASS');
  process.exit(failures ? 1 : 0);
})();
