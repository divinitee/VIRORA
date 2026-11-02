// VT-45 phase 1 — the REAL progressApi entry with an in-memory Base44.
// GPT semi-final audit (2 Nov) security checks:
//   - ungradable quiz items are rejected with OR without coach.session_key
//   - verification is decided by the server; the client can't set it
//   - only server-checked receipts count toward server_checked_rounds
//   - a resent round (same round_id) is counted once
//   - recompute and rebuild agree; an old row without the count is rebuilt
//
//   deno test --allow-read --allow-env --no-check --import-map=tools/vt45/deno/import_map.json tools/vt45/deno/progressApi.test.ts
import { ok as assert, deepStrictEqual as assertEquals } from 'node:assert';
import { entities } from './mock_sdk.ts';
import handler from '../../../base44/functions/progressApi/entry.ts';
import { COMPARABLE, deriveSkill, recomputeSkill, CONFIDENCE_HIGH_MIN } from '../../../base44/shared/progressEngine.ts';

const ANA = 'ana@example.com';
const words = [
  { id: 'w1', english: 'success', uzbek: 'muvaffaqiyat', russian: 'успех', level: 'B1' },
  { id: 'w2', english: 'decide', uzbek: 'qaror qilmoq', russian: 'решать', level: 'B1' },
];
entities.VocabularyWord.rows.push(...words);

let n = 0;
const rid = () => `round_${++n}`;
async function call(who: string, body: any) {
  const res = await handler(new Request('https://x/progressApi', { method: 'POST', headers: { 'x-user': who, 'content-type': 'application/json' }, body: JSON.stringify(body) }));
  return { status: res.status, ...(await res.json()) };
}
const submit = (body: any, who = 'ana') => call(who, { action: 'submitEvidence', ...body });
const receipts = (q: any = {}) => entities.RoundReceipt.rows.filter((r) => r.user_email === ANA && r.kind === 'evidence' && r.status === 'done' && Object.entries(q).every(([k, v]) => r[k] === v));

Deno.test('quiz items: an ungradable item is rejected WITHOUT a coach key (no bypass by omitting it)', async () => {
  const r = await submit({ game: 'quiz', round_id: rid(), items: [{ word_id: 'w1', correct: true }] });
  assertEquals([r.status, r.code], [400, 'ungradable_item']);
});

Deno.test('quiz items: an ungradable item is rejected WITH a coach key', async () => {
  const r = await submit({ game: 'quiz', round_id: rid(), coach: { session_key: '2026-11-02:core:1' }, items: [{ word_id: 'w1', type: 'made_up', given: 'success', correct: true }] });
  assertEquals([r.status, r.code], [400, 'ungradable_item']);
});

Deno.test('quiz items: gradable items are graded by the server, ignoring the client flag', async () => {
  const id = rid();
  const r = await submit({ game: 'quiz', round_id: id, items: [
    { word_id: 'w1', type: 'translation', given: 'success', correct: false },
    { word_id: 'w2', type: 'translation', given: 'wrong', correct: true },
  ] });
  assertEquals([r.status, r.verification], [200, 'server_graded']);
  const rec = receipts({ round_id: id })[0];
  assertEquals([rec.verification, rec.items_total, rec.items_credit], ['server_graded', 2, 1]);
});

Deno.test('self-report path: verification is set by the server; a client-sent "verification" is ignored', async () => {
  const id = rid();
  const r = await submit({ game: 'usage', round_id: id, verification: 'server_graded', items: [{ word: 'success', correct: true, verification: 'server_graded' }] });
  assertEquals([r.status, r.verification], [200, 'client_attested']);
  assertEquals(receipts({ round_id: id })[0].verification, 'client_attested');
  const ledger = entities.WordAttempt.rows.filter((x) => x.round_id === id);
  assert(ledger.length === 1 && ledger.every((x) => x.verification === 'client_attested'));
});

Deno.test('self-report path: a non-boolean "correct" is rejected', async () => {
  for (const bad of ['yes', 1, null, undefined]) {
    const r = await submit({ game: 'usage', round_id: rid(), items: [{ word: 'success', correct: bad }] });
    assertEquals([r.status, r.code], [400, 'bad_items']);
  }
});

Deno.test('Skill Hub quiz counts form stays self-reported (Phase 2 scope)', async () => {
  const id = rid();
  const r = await submit({ game: 'quiz', round_id: id, items_total: 5, items_correct: 5 });
  assertEquals([r.status, r.verification], [200, 'client_attested']);
});

Deno.test('a resent round (same round_id) is counted once', async () => {
  const id = rid();
  const body = { game: 'quiz', round_id: id, items: [{ word_id: 'w1', type: 'translation', given: 'success' }] };
  const a = await submit(body);
  const b = await submit(body);
  assertEquals([a.status, b.status, b.duplicate], [200, 200, true]);
  assertEquals(receipts({ round_id: id }).length, 1);
  assertEquals(entities.WordAttempt.rows.filter((x) => x.round_id === id).length, 1);
});

Deno.test('server_checked_rounds counts only server-checked receipts; self-reports alone never reach "high"', async () => {
  for (let i = 0; i < CONFIDENCE_HIGH_MIN + 2; i++) await submit({ game: 'usage', round_id: rid(), items: [{ word: 'decide', correct: true }] });
  const st = entities.SkillState.rows.find((s) => s.user_email === ANA && s.skill === 'vocabulary');
  const serverDone = receipts().filter((r) => r.skill === 'vocabulary' && (r.verification === 'server_graded' || r.verification === 'server_ai')).length;
  assertEquals(st.server_checked_rounds, serverDone);
  assert(st.verified_rounds >= CONFIDENCE_HIGH_MIN && st.server_checked_rounds < CONFIDENCE_HIGH_MIN);
  assertEquals(st.confidence, 'medium');
  const read = await call('ana', { action: 'getSkillState' });
  assertEquals(read.skills.find((s: any) => s.skill === 'vocabulary').confidence, 'medium');
});

Deno.test('server-checked rounds do reach "high"', async () => {
  for (let i = 0; i < CONFIDENCE_HIGH_MIN; i++) await submit({ game: 'quiz', round_id: rid(), items: [{ word_id: 'w2', type: 'translation', given: 'decide' }] });
  const st = entities.SkillState.rows.find((s) => s.user_email === ANA && s.skill === 'vocabulary');
  assert(st.server_checked_rounds >= CONFIDENCE_HIGH_MIN);
  assertEquals(st.confidence, 'high');
});

Deno.test('recompute (receipts) and rebuild (ledger) agree on every compared field', async () => {
  const now = Date.now();
  const stored = await recomputeSkill(entities, ANA, 'vocabulary', now);
  const derived: any = await deriveSkill(entities, ANA, 'vocabulary', now);
  const diff = COMPARABLE.filter((k) => k !== 'historical_peak' && (stored[k] ?? null) !== (derived[k] ?? null));
  assertEquals(diff, []);
});

Deno.test('an old SkillState row without server_checked_rounds is rebuilt on its next round', async () => {
  const st = entities.SkillState.rows.find((s) => s.user_email === ANA && s.skill === 'vocabulary');
  delete st.server_checked_rounds;
  st.confidence = 'high';
  await submit({ game: 'usage', round_id: rid(), items: [{ word: 'success', correct: true }] });
  const after = entities.SkillState.rows.find((s) => s.user_email === ANA && s.skill === 'vocabulary');
  const derived: any = await deriveSkill(entities, ANA, 'vocabulary', Date.now());
  assertEquals(after.server_checked_rounds, derived.server_checked_rounds);
});

Deno.test('a receipt with no verification counts as a round but never as server-checked', async () => {
  entities.RoundReceipt.rows.push({ id: 'legacy_r', receipt_key: `${ANA}|x|evidence`, user_email: ANA, round_id: 'x', kind: 'evidence', status: 'done', skill: 'spelling', items_total: 4, items_credit: 4, round_at: new Date().toISOString(), created_date: new Date().toISOString() });
  entities.SkillState.rows.push({ id: 'ss_sp', user_email: ANA, skill: 'spelling', verified_rounds: 0, server_checked_rounds: 0 });
  const s = await recomputeSkill(entities, ANA, 'spelling', Date.now());
  assertEquals([s.verified_rounds, s.server_checked_rounds], [1, 0]);
});

Deno.test("another learner's rounds never count for this learner", async () => {
  await submit({ game: 'quiz', round_id: rid(), items: [{ word_id: 'w1', type: 'translation', given: 'success' }] }, 'bob');
  const before = entities.SkillState.rows.find((s) => s.user_email === ANA && s.skill === 'vocabulary').server_checked_rounds;
  const s = await recomputeSkill(entities, ANA, 'vocabulary', Date.now());
  assertEquals(s.server_checked_rounds, before);
});
