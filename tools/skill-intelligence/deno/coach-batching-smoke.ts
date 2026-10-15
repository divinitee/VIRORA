// VT-40, 14 Oct audit finding 1: a Coach session with MORE THAN 50 word answers.
// Drives the REAL coachApi + progressApi handlers (in-memory store, SDK stubbed via
// import_map.json) with the page's own question builder (src/lib/coach/wordCheck.js)
// and answer sender (src/lib/coach/answerBatches.js), item by item like Coach.jsx's
// Session: word answers queue up, grammar steps and the end flush them.
//   deno run -A --import-map=import_map.json coach-batching-smoke.ts
import progressApi from '../../../base44/functions/progressApi/entry.ts';
import coachApi from '../../../base44/functions/coachApi/entry.ts';
import { PRACTICE_KEYS } from '../../../base44/shared/grammarKeys.js';
import { buildWordQuestions, evidenceItem, showsWordCard } from '../../../src/lib/coach/wordCheck.js';
import { ratingFor, replayFsrs } from '../../../base44/shared/coachCore.js';
import * as tsfsrs from 'npm:ts-fsrs@5.4.2';
import { createAnswerSender, finishWithSave, MAX_ROUND_ITEMS } from '../../../src/lib/coach/answerBatches.js';

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
// Game history (3 days ago) so the plan mixes depths: words played right -> reviews
// (practice: meaning, definition, context, spelling), words missed -> weak (remediation:
// all five types), the rest new (probe). Every question type is then exercised.
const old = new Date(Date.now() - 3 * 86400000).toISOString();
tables.WordAttempt = ['vip1@x', 'vip2@x', 'vip3@x', 'vip4@x', 'vip5@x', 'vip6@x'].flatMap((email) => [
  ...Array.from({ length: 24 }, (_, i) => ({ id: `h-${email}-${i}`, user_email: email, game: 'usage', word_id: `v${i + 1}`, word: tables.VocabularyWord[i].english, correct: i >= 4, round_id: `h-${email}`, round_at: old, verification: 'client_attested', mode: 'recognise' })),
  ...Array.from({ length: 4 }, (_, i) => ({ id: `h2-${email}-${i}`, user_email: email, game: 'usage', word_id: `v${i + 1}`, word: tables.VocabularyWord[i].english, correct: false, round_id: `h2-${email}`, round_at: old, verification: 'client_attested', mode: 'recognise' })),
]);
tables.GrammarAttempt = [];
tables.User = ['vip1@x', 'vip2@x', 'vip3@x', 'vip4@x', 'vip5@x', 'vip6@x'].map((email, i) => ({ id: `u${i + 1}`, email, cefr_level: 'A2' }));
tables.StudentSubscription = [
  { id: 's1', phone: 'vip1@x', status: 'active', plan: 'VIP Plan', expires_at: '2027-01-31' },
  { id: 's2', phone: 'vip2@x', status: 'active', plan: 'VIP Plan', expires_at: '2027-01-31' },
  { id: 's3', phone: 'vip3@x', status: 'active', plan: 'VIP Plan', expires_at: '2027-01-31' },
  { id: 's4', phone: 'vip4@x', status: 'active', plan: 'VIP Plan', expires_at: '2027-01-31' },
  { id: 's5', phone: 'vip5@x', status: 'active', plan: 'VIP Plan', expires_at: '2027-01-31' },
  { id: 's6', phone: 'vip6@x', status: 'active', plan: 'VIP Plan', expires_at: '2027-01-31' },
];
const byId = new Map(tables.VocabularyWord.map((w) => [w.id, w]));
const grammarAnswers = (topic: string, n: number) => Object.entries(PRACTICE_KEYS[topic] || {})
  .filter(([k, v]) => k.startsWith('c') && !String(v).startsWith('§')).slice(0, n)
  .map(([k, v]) => ({ item_id: `gpr.${topic}.choose.${k.slice(1)}`, given: String(v).split('|')[0] }));
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
let rid = 0; const newRoundId = () => `round-${++rid}`;

/** Play one full Today's Practice the way Coach.jsx's Session does. */
// grammarViaSender: the grammar round goes through the Coach queue (Coach.jsx saveGrammar,
// 15 Oct) instead of straight to the server; grammarSaves records each save's result.
async function playSession(email: string, submit: (email: string, payload: any) => Promise<any>, legacy = false, opts: any = {}) {
  const grammarSaves: boolean[] = [];
  me = { email, role: 'user' };
  await C({ action: 'saveProfile', goal_id: 'everyday', daily_minutes: 25 });
  const today = await C({ action: 'getToday' });
  const sk = today.session.session_key;
  const items = today.plan.items;
  const sender = createAnswerSender(submit);
  const pending: any[] = [];
  const completed = new Set<string>();
  const perWord = new Map<string, number>();
  // legacy = the pre-fix Coach.jsx flush: one round, cut to 50 answers.
  const flush = legacy
    ? async () => { const b = pending.splice(0).map((p) => p.ev); if (b.length) await submit(email, { game: 'quiz', round_id: newRoundId(), items: b.slice(0, 50), coach: { session_key: sk } }); return true; }
    : () => sender.flush({ email, entries: pending.splice(0), completed, sessionKey: sk, newRoundId });
  let answers = 0, k = 0, expectedCorrect = 0;
  for (const it of items) {
    if (it.item_type === 'word') {
      const w = byId.get(it.word_id);
      const qs = buildWordQuestions(w, tables.VocabularyWord, { depth: it.depth, lang: 'uz', rnd });
      const hint = showsWordCard(it.depth); // as Coach.jsx: a weak word opens with its word card
      for (const q of qs) {
        const wrong = ++k % 7 === 0 && !hint; // some wrong answers (weak words all right: proves the Good cap)
        const given = wrong ? (q.type === 'spelling' ? 'zzzz' : q.options.find((o: string) => o !== q.correct)) : (q.type === 'spelling' ? ` ${String(q.correct).toUpperCase()} ` : q.correct);
        pending.push({ key: it.item_key, ev: evidenceItem(w, q, given, hint ? { support: 'hint' } : undefined) });
        answers++;
        if (!wrong) expectedCorrect++;
      }
      perWord.set(it.item_key, qs.length);
      completed.add(it.item_key);
    } else {
      await flush(); // Session flushes before a grammar step
      const topic = it.item_key.replace(/^grammar:/, '');
      const gPayload = { game: 'grammar_practice', round_id: `g-${email}-${topic}`, grammar_topic: topic, items: grammarAnswers(topic, 4), coach: { session_key: sk } };
      if (opts.oldGrammarLost) { /* old path: the save failed (null) and the runner moved on */ }
      else if (opts.grammarViaSender) grammarSaves.push(await sender.flush({ email, rounds: [gPayload] }));
      else await P({ action: 'submitEvidence', ...gPayload });
    }
  }
  // The end of the session, exactly as Coach.jsx: Done only once every answer is saved
  // (one automatic retry; the wait is skipped in tests).
  const done = { shown: 0 };
  const result = await finishWithSave({ flush, onDone: () => { done.shown++; }, wait: async () => {} });
  return { sk, items, answers, perWord, finalOk: result === 'done', result, done, flush, sender, expectedCorrect, grammarSaves };
}

function checkPersisted(label: string, email: string, run: any, sent: any[]) {
  const coachRounds = new Set(sent.filter((p) => p.coach?.session_key === run.sk).map((p) => p.round_id));
  const rows = tables.WordAttempt.filter((r) => r.user_email === email && coachRounds.has(r.round_id));
  const words = [...run.perWord.keys()];
  ok(`${label}: the plan really has > 50 word answers (${run.answers})`, run.answers > 50);
  const types = new Set(sent.flatMap((p) => (p.coach?.session_key === run.sk ? p.items.map((i: any) => i.type) : [])));
  ok(`${label}: all five question types were answered (${[...types].sort().join(', ')})`, ['multiple_choice', 'translation', 'definition', 'context', 'spelling'].every((t) => types.has(t)));
  ok(`${label}: the plan mixed new, practised and weak words (probe, practice, remediation)`, ['probe', 'practice', 'remediation'].every((d) => run.items.some((i: any) => i.item_type === 'word' && i.depth === d)), run.items.map((i: any) => i.depth).join());
  ok(`${label}: every round sent had <= ${MAX_ROUND_ITEMS} answers`, sent.every((p) => p.items.length <= MAX_ROUND_ITEMS), sent.map((p) => p.items.length).join());
  ok(`${label}: ALL ${run.answers} answers persisted, none twice`, rows.length === run.answers, `${rows.length}`);
  const roundsPerWord = words.map((key) => new Set(rows.filter((r) => `word:${r.word_id}:0` === key).map((r) => r.round_id)).size);
  ok(`${label}: each word's answers sit in exactly one round_id`, roundsPerWord.every((n) => n === 1), roundsPerWord.join());
  const ev = (tables.ItemEvidence || []).filter((e) => e.user_email === email && e.session_key === run.sk && e.source === 'coach_session');
  ok(`${label}: every planned word has Coach evidence with all its questions`, words.every((key) => ev.filter((e) => e.item_key === key).length === 1 && ev.find((e) => e.item_key === key)?.items === run.perWord.get(key)));
  ok(`${label}: server grading matches the intended answers on all 5 types (spelling typed in CAPS with spaces counts as right)`, rows.filter((r) => r.correct === true).length === run.expectedCorrect && rows.every((r) => r.verification === 'server_graded'), `${rows.filter((r) => r.correct === true).length}/${run.expectedCorrect}`);
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

console.log('\n=== Weak-word card = hint (14 Oct audit): weight x0.5, FSRS at most Good ===');
{
  const coachRounds = new Set(sent1.filter((p) => p.coach?.session_key === run1.sk).map((p) => p.round_id));
  const rows = tables.WordAttempt.filter((r) => r.user_email === 'vip1@x' && coachRounds.has(r.round_id));
  const ev = (tables.ItemEvidence || []).filter((e) => e.user_email === 'vip1@x' && e.session_key === run1.sk && e.source === 'coach_session' && e.item_type === 'word');
  const weak = run1.items.filter((i: any) => i.item_type === 'word' && i.depth === 'remediation').map((i: any) => i.item_key);
  const other = run1.items.filter((i: any) => i.item_type === 'word' && i.depth !== 'remediation').map((i: any) => i.item_key);
  const isWeakRow = (r: any) => weak.includes(`word:${r.word_id}:0`);
  ok(`the plan has weak words with a card (${weak.length}) and other words (${other.length})`, weak.length > 0 && other.length > 0);
  ok('every answer to a weak word is stored with support "hint"', rows.filter(isWeakRow).length > 0 && rows.filter(isWeakRow).every((r) => r.support === 'hint'));
  ok('no other answer is marked as hinted', rows.filter((r) => !isWeakRow(r)).every((r) => r.support !== 'hint'));
  const evOf = (k: string) => ev.find((e) => e.item_key === k);
  ok('weak words: Coach evidence counts every answer as hinted', weak.every((k) => evOf(k)?.hints_used === evOf(k)?.items && evOf(k)?.items === 5), JSON.stringify(weak.map((k) => [evOf(k)?.hints_used, evOf(k)?.items])));
  ok('weak words weigh half of the same answers without the card (0.3 vs 0.6: server-graded x recognise x hint)', weak.every((k) => evOf(k)?.weight === 0.3) && other.every((k) => evOf(k)?.weight === 0.6 && evOf(k)?.hints_used === 0), JSON.stringify([...weak, ...other.slice(0, 3)].map((k) => evOf(k)?.weight)));
  const allRight = (k: string) => evOf(k) && evOf(k).correct === evOf(k).items;
  const weakRating = weak.filter(allRight).map((k) => replayFsrs([evOf(k)], tsfsrs).transitions[0]?.rating);
  const freeRating = other.filter(allRight).map((k) => replayFsrs([evOf(k)], tsfsrs).transitions[0]?.rating);
  ok('a weak word answered 5/5 right after its card is rated Good, never Easy', weakRating.length > 0 && weakRating.every((r) => r === 'good'), weakRating.join());
  ok('...while a word answered all right WITHOUT a card is still rated Easy (only the card is capped)', freeRating.length > 0 && freeRating.every((r) => r === 'easy'), freeRating.join());
  const li = (k: string) => tables.LearnerItem.find((r) => r.user_email === 'vip1@x' && r.item_key === k);
  const wk = weak.find(allRight), fk = other.find(allRight);
  ok('stored schedule follows: the hinted 5/5 word is due sooner than an unhinted all-right word', li(wk)?.scheduled_days < li(fk)?.scheduled_days, JSON.stringify({ hinted: li(wk)?.scheduled_days, plain: li(fk)?.scheduled_days }));
  ok('a wrong answer after the card still counts as wrong (accuracy is not inflated)', ratingFor({ items: 5, correct: 2, hints_used: 5 }) === 'again');
}

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

console.log('\n=== Server unreachable at the end of the session: save error, never a false Done ===');
{
  const sent4: any[] = [];
  let offline = false;
  const submit4 = async (email: string, payload: any) => {
    if (offline) return null;                           // every save fails while "offline"
    sent4.push(payload); me = { email, role: 'user' };
    const r = await P({ action: 'submitEvidence', ...payload });
    return r?.ok || r?.duplicate ? r : null;
  };
  // 1) Today's Practice fully online (Done shown once), 2) a 'Keep going' session whose
  // end-of-session save hits a dead network, then Try again offline, then online.
  const run4 = await playSession('vip4@x', submit4);
  me = { email: 'vip4@x', role: 'user' };
  const k1 = await C({ action: 'startContinuation' });
  const csk = k1.session.session_key;
  const sender = createAnswerSender(submit4);
  const pending: any[] = [];
  const completed = new Set<string>();
  let n = 0;
  for (const it of k1.plan.items) {
    if (it.item_type !== 'word') continue;
    const w = byId.get(it.word_id);
    for (const q of buildWordQuestions(w, tables.VocabularyWord, { depth: it.depth, lang: 'uz', rnd })) { pending.push({ key: it.item_key, ev: evidenceItem(w, q, q.correct) }); n++; }
    completed.add(it.item_key);
  }
  for (const it of k1.plan.items.filter((i: any) => i.item_type === 'grammar')) {
    const topic = it.item_key.replace(/^grammar:/, '');
    await P({ action: 'submitEvidence', game: 'grammar_practice', round_id: `g4-${topic}`, grammar_topic: topic, items: grammarAnswers(topic, 4), coach: { session_key: csk } });
  }
  const flush = () => sender.flush({ email: 'vip4@x', entries: pending.splice(0), completed, sessionKey: csk, newRoundId });
  offline = true;
  const shown = { done: 0 };
  const waits: number[] = [];
  const r1 = await finishWithSave({ flush, onDone: () => { shown.done++; }, wait: async (ms: number) => { waits.push(ms); } });
  ok(`continuation with ${n} word answers, network down at the end: result "failed", Done NOT shown`, n > 0 && r1 === 'failed' && shown.done === 0, JSON.stringify({ r1, shown }));
  ok('it retried once automatically (after 1.5 s) before giving up', waits.length === 1 && waits[0] === 1500);
  ok('nothing was lost: the unsent rounds are still queued for Try again', sender.unsentCount('vip4@x') > 0 && pending.length === 0);
  me = { email: 'vip4@x', role: 'user' };
  const mid = await C({ action: 'getToday' });
  ok('server agrees it is NOT done: session incomplete, the unsaved words still in the plan (a Done screen here would have been false)', mid.session.session_key === csk && mid.session.complete === false && mid.plan.items.some((i: any) => i.item_type === 'word'), JSON.stringify(mid.session));
  const r2 = await finishWithSave({ flush, onDone: () => { shown.done++; }, wait: async () => {} });
  ok('still offline: Try again fails again, still no Done', r2 === 'failed' && shown.done === 0);
  offline = false;
  const r3 = await finishWithSave({ flush, onDone: () => { shown.done++; }, wait: async () => {} });
  ok('back online: Try again saves everything and shows Done exactly once', r3 === 'done' && shown.done === 1 && sender.unsentCount('vip4@x') === 0);
  const rows = tables.WordAttempt.filter((r) => r.user_email === 'vip4@x' && sent4.some((p) => p.round_id === r.round_id && p.coach?.session_key === csk));
  ok(`all ${n} answers stored exactly once after the retries`, rows.length === n, String(rows.length));
  me = { email: 'vip4@x', role: 'user' };
  const after = await C({ action: 'getToday' });
  ok('server: the continuation is complete once the retry succeeded', after.session.session_key === csk && after.session.complete === true, JSON.stringify(after.session));
  ok('the earlier, fully online session showed Done once', run4.result === 'done' && run4.done.shown === 1);
}

console.log('\n=== Grammar saves through the Coach queue: a failed grammar save is kept and retried (15 Oct) ===');
{
  // Network failure on the first grammar round, lost reply on the second; words save normally.
  const sent5: any[] = [];
  const gAttempts = new Map<string, number>();
  const run5 = await playSession('vip5@x', async (email, payload) => {
    sent5.push(payload);
    if (payload.game === 'grammar_practice') {
      const n = (gAttempts.get(payload.round_id) || 0) + 1;
      gAttempts.set(payload.round_id, n);
      const first = gAttempts.size === 1;
      if (n === 1 && first) return null;                // never reached the server
      me = { email, role: 'user' };
      const r = await P({ action: 'submitEvidence', ...payload });
      if (n === 1 && !first) return null;               // saved, reply lost
      return r?.ok || r?.duplicate ? r : null;
    }
    me = { email, role: 'user' };
    const r = await P({ action: 'submitEvidence', ...payload });
    return r?.ok || r?.duplicate ? r : null;
  }, false, { grammarViaSender: true });
  const gIds = [...gAttempts.keys()];
  ok(`the plan had grammar steps (${gIds.length}) and both first saves failed -> the session showed the unsaved banner`, gIds.length >= 2 && run5.grammarSaves.length >= 2 && run5.grammarSaves.slice(0, 2).every((x: boolean) => x === false), JSON.stringify(run5.grammarSaves));
  ok('each failed grammar round was resent later with its ORIGINAL round_id', gIds.every((id) => gAttempts.get(id)! >= 2), JSON.stringify([...gAttempts]));
  const gRows = (tables.GrammarAttempt || []).filter((r) => r.user_email === 'vip5@x');
  ok('grammar answers stored exactly once per round (the lost-reply resend was deduplicated)', gIds.every((id) => gRows.filter((r) => r.round_id === id).length === 4), JSON.stringify(gIds.map((id) => gRows.filter((r) => r.round_id === id).length)));
  const gEv = (tables.ItemEvidence || []).filter((e) => e.user_email === 'vip5@x' && e.session_key === run5.sk && e.source === 'coach_session' && e.item_type === 'grammar');
  ok('every planned grammar topic has Coach evidence', run5.items.filter((i: any) => i.item_type === 'grammar').every((i: any) => gEv.some((e) => e.item_key === i.item_key)));
  ok('Done shown once, only after everything saved', run5.result === 'done' && run5.done.shown === 1 && run5.sender.unsentCount('vip5@x') === 0);
  me = { email: 'vip5@x', role: 'user' };
  const after5 = await C({ action: 'getToday' });
  ok('server: session complete', after5.session.session_key === run5.sk && after5.session.complete === true, JSON.stringify(after5.session));
}
{
  // The OLD Coach path, for contrast: PracticeRunner awaited submitEvidence, got null on a
  // network failure, and moved on. Nothing queued the round, so nothing retried it.
  const run6 = await playSession('vip6@x', async (email, payload) => { me = { email, role: 'user' }; const r = await P({ action: 'submitEvidence', ...payload }); return r?.ok || r?.duplicate ? r : null; }, false, { oldGrammarLost: true });
  me = { email: 'vip6@x', role: 'user' };
  const after6 = await C({ action: 'getToday' });
  ok('old path: Done was shown although the grammar answers were lost, and the server says the session is NOT complete (this test catches the bug)', run6.done.shown === 1 && !(tables.GrammarAttempt || []).some((r) => r.user_email === 'vip6@x') && after6.session.complete === false, JSON.stringify(after6.session));
}

console.log('\n=== Before the fix (regression proof): the old one-round flush, cut to 50 ===');
const sent3: any[] = [];
const run3 = await playSession('vip3@x', async (email, payload) => { sent3.push(payload); me = { email, role: 'user' }; const r = await P({ action: 'submitEvidence', ...payload }); return r?.ok || r?.duplicate ? r : null; }, true);
const kept3 = tables.WordAttempt.filter((r) => r.user_email === 'vip3@x' && sent3.some((p) => p.round_id === r.round_id)).length;
me = { email: 'vip3@x', role: 'user' };
const after3 = await C({ action: 'getToday' });
ok(`old flush: answers silently lost (${kept3} of ${run3.answers} kept) and the session never completes (this test catches the bug)`, kept3 < run3.answers && after3.session.complete === false && after3.plan.items.length > 0, JSON.stringify({ kept3, s: after3.session }));
console.log('\n=== Before the fix (regression proof): one round cut to 50 answers ===');
me = { email: 'vip1@x', role: 'user' };
const oldBad = await P({ action: 'submitEvidence', game: 'quiz', round_id: 'too-big', items: Array.from({ length: 51 }, () => ({ word: 'x', word_id: 'v1', type: 'translation', given: 'x' })) });
ok('the server rejects a 51-answer round (why the old client sliced, and dropped, answers)', !oldBad.ok, JSON.stringify(oldBad));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) Deno.exit(1);
