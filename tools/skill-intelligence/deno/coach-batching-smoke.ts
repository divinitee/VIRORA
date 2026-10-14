// VT-40, 14 Oct audit finding 1: a Coach session with MORE THAN 50 word answers.
// Drives the REAL coachApi + progressApi handlers (in-memory store, SDK stubbed via
// import_map.json) with the page's own question builder (src/lib/coach/wordCheck.js)
// and answer sender (src/lib/coach/answerBatches.js), item by item like Coach.jsx's
// Session: word answers queue up, grammar steps and the end flush them.
//   deno run -A --import-map=import_map.json coach-batching-smoke.ts
import progressApi from '../../../base44/functions/progressApi/entry.ts';
import coachApi from '../../../base44/functions/coachApi/entry.ts';
import { PRACTICE_KEYS } from '../../../base44/shared/grammarKeys.js';
import { buildWordQuestions, evidenceItem } from '../../../src/lib/coach/wordCheck.js';
import { createAnswerSender, MAX_ROUND_ITEMS } from '../../../src/lib/coach/answerBatches.js';

let pass = 0, fail = 0;
const ok = (n: string, c: boolean, x = '') => { c ? pass++ : fail++; console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}${!c && x ? ' -> ' + x : ''}`); };
const tables: Record<string, any[]> = {};
let seq = 0;
const match = (row: any, q: any): boolean => Object.entries(q || {}).every(([k, v]: [string, any]) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if ('$exists' in v) return (row[k] !== undefined && row[k] !== null) === v.$exists;
    if ('$in' in v) return v.$in.includes(row[k]);
    if ('$gt' in v) return row[k] > v.$gt;
    if ('$gte' in v) return row[k] >= v.$gte;
    if ('$lt' in v) return row[k] < v.$lt;
    if ('$lte' in v) return row[k] <= v.$lte;
    return false;
  }
  return row[k] === v;
});
function entity(name: string) {
  const t = (tables[name] ||= []);
  const sorter = (sort?: string) => (a: any, b: any) => { if (!sort) return 0; const d = sort.startsWith('-'); const k = d ? sort.slice(1) : sort; return (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * (d ? -1 : 1); };
  const mk = (o: any) => { const r = { id: `${name}-${++seq}`, created_date: new Date(Date.now() + seq).toISOString(), ...o }; t.push(r); return { ...r }; };
  const pickFields = (r: any, fields?: string[]) => (Array.isArray(fields) ? Object.fromEntries(['id', ...fields].map((f) => [f, r[f]])) : { ...r });
  return {
    async filter(q: any, sort?: string, limit = 50, skip = 0, fields?: string[]) { return t.filter((r) => match(r, q)).sort(sorter(sort)).slice(skip, skip + limit).map((r) => pickFields(r, fields)); },
    async count(q: any) { return t.filter((r) => match(r, q)).length; },
    async create(o: any) { return mk(o); },
    async bulkCreate(os: any[]) { return os.map(mk); },
    async update(id: string, o: any) { const r = t.find((x) => x.id === id); Object.assign(r, o); return { ...r }; },
    async delete(id: string) { const i = t.findIndex((x) => x.id === id); if (i >= 0) t.splice(i, 1); },
    async list(opts: any) { return opts?.distinct ? [...new Set(t.map((r) => r[opts.distinct]))] : t.map((r) => ({ ...r })); },
  };
}
const entities: any = new Proxy({}, { get: (target: any, name: string) => (target[name] ||= entity(name)) });
let me: any = null;
(globalThis as any).__base44Client = { auth: { me: async () => me }, asServiceRole: { entities } };
const post = (h: any) => async (body: any) => (await h(new Request('http://x', { method: 'POST', body: JSON.stringify(body) }))).json();
const P = post(progressApi), C = post(coachApi);

// A corpus big enough for a long VIP plan: 150 A2 words, each with uz + ru, a definition
// and an example sentence (so all five question types appear).
const letters = (i: number) => { let s = ''; let n = i + 26; while (n > 0) { s = String.fromCharCode(97 + (n % 26)) + s; n = Math.floor(n / 26); } return `zo${s}`; };
tables.VocabularyWord = Array.from({ length: 150 }, (_, i) => {
  const en = letters(i);
  return { id: `v${i + 1}`, english: en, uzbek: `soz ${en}`, russian: `слово ${i + 1}`, cefr: 'A2', def_a2: `a made-up thing number ${i + 1}`, example_en: `We saw the ${en} near the park.` };
});
tables.WordSense = [];
tables.WordAttempt = [];
tables.GrammarAttempt = [];
tables.User = [{ id: 'u1', email: 'vip1@x', cefr_level: 'A2' }, { id: 'u2', email: 'vip2@x', cefr_level: 'A2' }];
tables.StudentSubscription = [
  { id: 's1', phone: 'vip1@x', status: 'active', plan: 'VIP Plan', expires_at: '2027-01-31' },
  { id: 's2', phone: 'vip2@x', status: 'active', plan: 'VIP Plan', expires_at: '2027-01-31' },
];
const byId = new Map(tables.VocabularyWord.map((w) => [w.id, w]));
const grammarAnswers = (topic: string, n: number) => Object.entries(PRACTICE_KEYS[topic] || {})
  .filter(([k, v]) => k.startsWith('c') && !String(v).startsWith('§')).slice(0, n)
  .map(([k, v]) => ({ item_id: `gpr.${topic}.choose.${k.slice(1)}`, given: String(v).split('|')[0] }));
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
let rid = 0; const newRoundId = () => `round-${++rid}`;

/** Play one full Today's Practice the way Coach.jsx's Session does. */
async function playSession(email: string, submit: (email: string, payload: any) => Promise<any>) {
  me = { email, role: 'user' };
  await C({ action: 'saveProfile', goal_id: 'everyday', daily_minutes: 25 });
  const today = await C({ action: 'getToday' });
  const sk = today.session.session_key;
  const items = today.plan.items;
  const sender = createAnswerSender(submit);
  const pending: any[] = [];
  const completed = new Set<string>();
  const perWord = new Map<string, number>();
  const flush = () => sender.flush({ email, entries: pending.splice(0), completed, sessionKey: sk, newRoundId });
  let answers = 0, k = 0;
  for (const it of items) {
    if (it.item_type === 'word') {
      const w = byId.get(it.word_id);
      const qs = buildWordQuestions(w, tables.VocabularyWord, { depth: it.depth, lang: 'uz', rnd });
      for (const q of qs) {
        const wrong = ++k % 7 === 0; // some wrong answers too
        const given = wrong ? (q.type === 'spelling' ? 'zzzz' : q.options.find((o: string) => o !== q.correct)) : (q.type === 'spelling' ? ` ${String(q.correct).toUpperCase()} ` : q.correct);
        pending.push({ key: it.item_key, ev: evidenceItem(w, q, given) });
        answers++;
      }
      perWord.set(it.item_key, qs.length);
      completed.add(it.item_key);
    } else {
      await flush(); // Session flushes before a grammar step
      const topic = it.item_key.replace(/^grammar:/, '');
      await P({ action: 'submitEvidence', game: 'grammar_practice', round_id: `g-${email}-${topic}`, grammar_topic: topic, items: grammarAnswers(topic, 4), coach: { session_key: sk } });
    }
  }
  let finalOk = await flush(); // the end of the session
  if (!finalOk) finalOk = await flush(); // Coach.jsx retries once
  return { sk, items, answers, perWord, finalOk, sender };
}

function checkPersisted(label: string, email: string, run: any, sent: any[]) {
  const coachRounds = new Set(sent.filter((p) => p.coach?.session_key === run.sk).map((p) => p.round_id));
  const rows = tables.WordAttempt.filter((r) => r.user_email === email && coachRounds.has(r.round_id));
  const words = [...run.perWord.keys()];
  ok(`${label}: the plan really has > 50 word answers (${run.answers})`, run.answers > 50);
  ok(`${label}: every round sent had <= ${MAX_ROUND_ITEMS} answers`, sent.every((p) => p.items.length <= MAX_ROUND_ITEMS), sent.map((p) => p.items.length).join());
  ok(`${label}: ALL ${run.answers} answers persisted, none twice`, rows.length === run.answers, `${rows.length}`);
  const roundsPerWord = words.map((key) => new Set(rows.filter((r) => `word:${r.word_id}:0` === key).map((r) => r.round_id)).size);
  ok(`${label}: each word's answers sit in exactly one round_id`, roundsPerWord.every((n) => n === 1), roundsPerWord.join());
  const ev = (tables.ItemEvidence || []).filter((e) => e.user_email === email && e.session_key === run.sk && e.source === 'coach_session');
  ok(`${label}: every planned word has Coach evidence with all its questions`, words.every((key) => ev.filter((e) => e.item_key === key).length === 1 && ev.find((e) => e.item_key === key)?.items === run.perWord.get(key)));
  ok(`${label}: spelling typed in another case was graded right by the server`, rows.some((r) => r.correct === true));
}

console.log('\n=== VIP 25-minute session, > 50 word answers, every save succeeds ===');
const sent1: any[] = [];
const run1 = await playSession('vip1@x', async (email, payload) => { sent1.push(payload); me = { email, role: 'user' }; const r = await P({ action: 'submitEvidence', ...payload }); return r?.ok || r?.duplicate ? r : null; });
ok('flush reported everything sent', run1.finalOk === true && run1.sender.unsentCount('vip1@x') === 0);
ok('more than one word round was needed', sent1.filter((p) => p.game === 'quiz').length >= 2, String(sent1.length));
checkPersisted('VIP 1', 'vip1@x', run1, sent1);
me = { email: 'vip1@x', role: 'user' };
const after1 = await C({ action: 'getToday' });
ok('server: session COMPLETE, nothing left in the plan', after1.session.session_key === run1.sk && after1.session.complete === true && after1.plan.items.length === 0, JSON.stringify(after1.session));
ok('server: Keep going is offered (VI: 2 a day, 0 used)', after1.continuation.available === true && after1.continuation.used === 0);

console.log('\n=== Same session with failed saves: one network failure, one lost response ===');
const sent2: any[] = [];
let quizCalls = 0;
const run2 = await playSession('vip2@x', async (email, payload) => {
  sent2.push(payload);
  quizCalls++;
  if (quizCalls === 1) return null;                     // network down: never reached the server
  me = { email, role: 'user' };
  const r = await P({ action: 'submitEvidence', ...payload });
  if (quizCalls === 2) return null;                     // saved, but the reply was lost
  return r?.ok || r?.duplicate ? r : null;
});
const firstTwo = sent2.slice(0, 2).map((p) => p.round_id);
ok('both failed rounds were resent with their ORIGINAL round_id', firstTwo.every((id) => sent2.filter((p) => p.round_id === id).length === 2), JSON.stringify(sent2.map((p) => p.round_id)));
ok('the lost-response retry was recognised as a duplicate (no double evidence)', tables.WordAttempt.filter((r) => r.round_id === firstTwo[1]).length === sent2.find((p) => p.round_id === firstTwo[1]).items.length);
ok('nothing left unsent after the retry', run2.finalOk === true && run2.sender.unsentCount('vip2@x') === 0);
checkPersisted('VIP 2', 'vip2@x', run2, sent2.filter((p, i, a) => a.findIndex((x) => x.round_id === p.round_id) === i));
me = { email: 'vip2@x', role: 'user' };
const after2 = await C({ action: 'getToday' });
ok('server: session COMPLETE after the retries', after2.session.complete === true && after2.plan.items.length === 0, JSON.stringify(after2.session));

console.log('\n=== Before the fix (regression proof): one round cut to 50 answers ===');
me = { email: 'vip1@x', role: 'user' };
const oldBad = await P({ action: 'submitEvidence', game: 'quiz', round_id: 'too-big', items: Array.from({ length: 51 }, () => ({ word: 'x', word_id: 'v1', type: 'translation', given: 'x' })) });
ok('the server rejects a 51-answer round (why the old client sliced, and dropped, answers)', !oldBad.ok, JSON.stringify(oldBad));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) Deno.exit(1);
