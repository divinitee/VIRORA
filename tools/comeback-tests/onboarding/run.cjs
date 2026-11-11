// node tools/comeback-tests/onboarding/build.mjs && NODE_PATH=/tmp/rc/node_modules node tools/comeback-tests/onboarding/run.cjs
const { JSDOM } = require('jsdom');
const fs = require('fs');
const dom = new JSDOM('<!doctype html><div id="root"></div>', { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://x.test/onboarding' });
const w = dom.window;
w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
w.eval(fs.readFileSync('/tmp/onb.js', 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const text = () => w.document.body.textContent;
const ok = (c, m) => { if (!c) { console.log('FAIL', m, '\n', text()); process.exit(1); } console.log('PASS', m); };
const btn = (s) => [...w.document.querySelectorAll('button')].find((b) => b.textContent.includes(s));
const click = (b) => b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
(async () => {
  w.__mount(); await sleep(500);
  ok(text().includes('What do you want first?'), 'one question screen');
  ok(!text().includes('Start free') && !text().includes('placement test now'), 'no plan pitch, no test as the default');
  ok(btn('Build my vocabulary') && btn('Fix my grammar basics') && btn('Everyday English'), 'three coach goals, English labels');
  click(btn('Continue')); await sleep(400);
  ok(text().includes("You're clicking through blindly"), 'blind click wakes them up');
  ok(!w.__calls.length && w.__path === '/onboarding', 'blind click saves nothing, goes nowhere');
  click(btn('Build my vocabulary')); await sleep(200);
  ok(!text().includes("clicking through blindly"), 'message clears once they pick');
  ok(btn('Start my first practice'), 'button now says what happens next');
  click(btn('Start my first practice')); await sleep(400);
  ok(JSON.stringify(w.__calls) === JSON.stringify([['plan'], ['coach', 'saveProfile', { goal_id: 'vocabulary', onboarded: true }]]), 'plan started, then coach goal saved');
  ok(w.__path === '/coach', 'straight into the first practice');
  console.log('all good'); process.exit(0);
})();
