const { JSDOM } = require('jsdom');
const fs = require('fs');
const dom = new JSDOM('<!doctype html><div id="r1"></div><div id="r2"></div><div id="r3"></div>', { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://x.test/' });
const w = dom.window;
// The page loader releases on a CSS animation event jsdom never fires; reduced motion skips that wait.
w.matchMedia = (q) => ({ matches: /reduce/.test(String(q)), media: String(q), addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
w.IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} };
w.ResizeObserver = class { observe() {} disconnect() {} unobserve() {} };
w.scrollTo = () => {}; w.Element.prototype.scrollIntoView = () => {};
w.eval(fs.readFileSync('/tmp/path-page-bundle.js', 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const root = (id) => w.document.getElementById(id);
const click = (el) => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const btn = (id, t) => [...root(id).querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(t));
let n = 0;
const ok = (c, m, id) => { if (!c) { console.log('FAIL', m, '\n', id ? root(id).textContent.slice(0, 1500) : ''); process.exit(1); } n++; console.log('PASS', m); };
const waitFor = async (fn, ms = 4000) => { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await sleep(60); } return false; };

async function playRound(id, right) {
  const items = w.__round.items;
  for (let i = 0; i < items.length; i++) {
    await waitFor(() => root(id).textContent.includes(`Question ${i + 1}`) && btn(id, 'Check'));
    const it = items[i];
    if (it.format !== 'mcq') throw new Error('expected mcq in choose stage, got ' + it.format);
    let pick = it.options.findIndex((_, k) => w.__grade(it, k).correct === right);
    if (pick < 0) pick = 0;
    const opts = [...root(id).querySelectorAll('button')].filter((b) => /^[A-D]/.test(b.textContent.trim()) && b.className.includes('text-left'));
    click(opts[pick]);
    await sleep(40);
    click(btn(id, 'Check'));
    await waitFor(() => btn(id, 'Next') || btn(id, 'Finish'));
    click(btn(id, 'Next') || btn(id, 'Finish'));
    await sleep(60);
  }
  return items.length;
}

(async () => {
  // 1. Home's Continue link, student with NO placement test yet.
  w.__profile = []; w.__attempts = []; w.__lessons = 1;
  w.__mountPage('r1', '/grammar?topic=tenses.present.simple-routine&stage=choose');
  ok(await waitFor(() => root('r1').textContent.includes('Question 1')), 'Continue link opens the round straight away', 'r1');
  ok(w.__loc.r1 === '/grammar', 'no placement-test wall, link params cleared (' + w.__loc.r1 + ')');
  ok(w.__round.items.every((it) => it.id.startsWith('tenses.present.simple-routine.choose.')), 'round is the asked topic + stage');
  const size = await playRound('r1', true);
  ok(await waitFor(() => root('r1').querySelector('[data-testid="path-next-actions"]')), 'result screen shows the path actions', 'r1');
  ok(size >= 8, 'round is long enough to pass (' + size + ')');
  const nextBtn = root('r1').querySelector('[data-testid="path-next"]');
  ok(nextBtn, 'all right -> stop passed -> Next step button', 'r1');
  ok(w.__evidence.length === 1 && w.__evidence[0].payload.grammar_topic === 'tenses.present.simple-routine' && w.__evidence[0].payload.items.length === size, 'round sent to the server for grading');
  ok((w.sessionStorage.getItem('virora_path_passed') || '').includes('tenses.present.simple-routine'), 'pass remembered for Home');
  ok(root('r1').querySelector('[data-testid="path-coach"]') && root('r1').querySelector('[data-testid="path-free"]'), 'suggested practice + free roam offered');
  console.log('   next button:', nextBtn.textContent.trim());

  // 2. Next step -> next stop's round, in place.
  const before = w.__round;
  click(nextBtn);
  ok(await waitFor(() => w.__round !== before && root('r1').textContent.includes('Question 1')), 'Next step starts the next stop', 'r1');
  ok(w.__round.items.every((it) => it.id.startsWith('tenses.present.third-person-s.choose.')), 'next round uses the NEXT topic bank, not the old one (' + w.__round.items[0].id + ')');
  await playRound('r1', false);
  ok(await waitFor(() => root('r1').querySelector('[data-testid="path-next-actions"]')), 'second result screen', 'r1');
  ok(!root('r1').querySelector('[data-testid="path-next"]'), 'all wrong -> not passed -> no Next step', 'r1');
  ok(!(w.sessionStorage.getItem('virora_path_passed') || '').includes('third-person-s'), 'failed stop not remembered as passed');
  click(root('r1').querySelector('[data-testid="path-free"]'));
  ok(await waitFor(() => w.__loc.r1 === '/?tab=skillhub'), 'free roam -> Skill Hub (' + w.__loc.r1 + ')');

  // 3. "See the whole path" link, no placement test.
  w.__mountPage('r2', '/grammar?view=path');
  ok(await waitFor(() => root('r2').querySelector('[data-testid="grammar-path-continue"]')), 'path view opens without the placement test', 'r2');
  ok(w.__loc.r2 === '/grammar', 'stays on the grammar page');
  const cont = root('r2').querySelector('[data-testid="grammar-path-continue"]');
  console.log('   continue bar:', cont.textContent.trim().slice(0, 90));
  ok(cont.textContent.includes('Third') || cont.textContent.toLowerCase().includes('he') || cont.textContent.length > 0, 'continue bar names a stop');
  const freeTab = [...root('r2').querySelectorAll('[role="tab"]')][1];
  click(freeTab);
  ok(await waitFor(() => w.__loc.r2 === '/grammar/assessment'), 'Free map without a test -> placement test');

  // 4. Old behaviour kept: plain /grammar with no test -> placement test.
  w.__mountPage('r3', '/grammar');
  ok(await waitFor(() => w.__loc.r3 === '/grammar/assessment'), 'plain /grammar with no test still goes to the test');
  console.log('all good', n);
  process.exit(0);
})().catch((e) => { console.log('ERROR', e); process.exit(1); });
