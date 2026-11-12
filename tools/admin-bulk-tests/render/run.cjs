// node tools/admin-bulk-tests/render/build.mjs && NODE_PATH=/tmp/rc/node_modules node tools/admin-bulk-tests/render/run.cjs
const { JSDOM } = require('jsdom');
const fs = require('fs');
const dom = new JSDOM('<!doctype html><div id="root"></div>', { runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window;
w.eval(fs.readFileSync('/tmp/bulk.js', 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const text = () => w.document.body.textContent;
const ok = (c, m) => { if (!c) { console.log('FAIL', m, '\n', text()); process.exit(1); } console.log('PASS', m); };
const btn = (s) => [...w.document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(s));
const click = (b) => b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
(async () => {
  w.__mount(); await sleep(100);
  ok(text().includes('2 selected'), 'bar shows the count');
  ok(btn('Nudge') && btn('Ban') && btn('Unban') && btn('Delete'), 'all four actions (Unban because one is banned)');
  click(btn('Delete')); await sleep(100);
  ok(text().includes('Are you sure? Delete 2 accounts for good?'), 'second "Are you sure" step');
  ok(text().includes('Test One') && text().includes('t2@x'), 'dialog names who is affected');
  ok(w.__calls.length === 0, 'nothing sent before confirming');
  click(btn('Cancel')); await sleep(100);
  ok(!text().includes('Are you sure') && w.__calls.length === 0, 'cancel sends nothing');
  click(btn('Delete')); await sleep(100);
  click(btn('Yes, delete 2')); await sleep(200);
  ok(JSON.stringify(w.__calls[0]) === JSON.stringify(['studentsBulk', { op: 'delete', confirm: 'delete', user_ids: ['t1', 't2'], note: '' }]), 'confirm sends op + confirm token + ids');
  ok(text().includes('Delete: 2 done') && w.__done, 'result summary');
  click(btn('Done')); await sleep(100);
  ok(!text().includes('selected'), 'selection cleared');
  console.log('all good'); process.exit(0);
})();
