// Kill switch OFF (the shipped default): the app must behave exactly as before.
//   GATE_OFF=1 BUNDLE_OUT=/tmp/consent-off.js node tools/legal-consent-tests/render/build.mjs
//   BUNDLE_OUT=/tmp/consent-off.js NODE_PATH=<jsdom dir> node tools/legal-consent-tests/render/run_off.cjs
const { JSDOM } = require('jsdom');
const fs = require('fs');
const bundle = fs.readFileSync(process.env.BUNDLE_OUT || '/tmp/consent-off.js', 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://virora.space/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.__scenario = { user: { id: 'u1', role: 'user' }, handlers: { 'legalApi.getConsentStatus': () => ({ ok: true, enforced: true, allowed: false }) } };
  w.eval(bundle);
  w.__mount(w.document.getElementById('root'));
  await sleep(300);
  const t = w.document.body.textContent;
  const ok = t.includes('ROUTE /') && t.includes('GLOBALS-MOUNTED') && w.__calls.length === 0;
  console.log((ok ? 'PASS' : 'FAIL') + ' kill switch off: app + global components render, zero legalApi calls');
  process.exit(ok ? 0 : 1);
})();
