// Live Teacher engine tests: the whole server flow against an in-memory
// database and a FAKE OpenAI (no network, no real key).
// Run: node --test tools/live-teacher-tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { startLesson, handleTool, endLesson, getProfileView } from '../../base44/shared/liveTeacherEngine.js';
import { mistakeKey } from '../../base44/shared/liveTeacherCore.js';

const PERMANENT = 'sk-test-PERMANENT-KEY-1234567890';
const env = { OPENAI_API_KEY: PERMANENT };
const T0 = Date.parse('2026-11-17T09:00:00Z');

// minimal in-memory stand-in for Base44 entities
function fakeDb() {
  let n = 0;
  const tables = {};
  const entity = (name) => {
    const rows = (tables[name] ||= []);
    return {
      rows,
      async create(data) { const row = { id: `${name}-${++n}`, created_date: new Date(T0 + n).toISOString(), ...structuredClone(data) }; rows.push(row); return structuredClone(row); },
      async get(id) { const r = rows.find((x) => x.id === id); if (!r) throw new Error('not found'); return structuredClone(r); },
      async filter(q = {}) { return structuredClone(rows.filter((r) => Object.entries(q).every(([k, v]) => r[k] === v))); },
      async update(id, patch) { const r = rows.find((x) => x.id === id); Object.assign(r, structuredClone(patch)); return structuredClone(r); },
    };
  };
  return { LiveTeacherProfile: entity('LiveTeacherProfile'), LiveTeacherLesson: entity('LiveTeacherLesson') };
}

function fakeOpenAI({ ok = true, status = 200, body = { value: 'ek_test_SHORTLIVED', expires_at: 1790000000 } } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return { ok, status, json: async () => body };
  };
  return { fetchImpl, calls };
}

const student = { id: 'u1', email: 'stu@example.com', full_name: 'Doniyor Pulatov', role: 'user' };
const igoes = { rule: 'grammar.subject_verb_agreement', variant: 'i_goes', wrong: 'I goes to school.', correct: 'I go to school.', explanation_uz: "'I' bilan 'go' ishlatiladi." };
const tool = (svc, lessonId, name, args, now, u = student) => handleTool({ svc, user: u, body: { lesson_id: lessonId, name, args: JSON.stringify(args) }, now });

test('start: not configured -> 503 and no OpenAI call', async () => {
  const { fetchImpl, calls } = fakeOpenAI();
  const r = await startLesson({ svc: fakeDb(), user: student, body: {}, env: {}, fetchImpl, now: T0 });
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'not_configured');
  assert.equal(calls.length, 0);
});

test('start: server mints a short-lived secret; the permanent key never reaches the browser', async () => {
  const svc = fakeDb();
  const { fetchImpl, calls } = fakeOpenAI();
  const r = await startLesson({ svc, user: student, body: { mode: 'strict', age_group: 'adult', lang: 'uz' }, env, fetchImpl, now: T0 });
  assert.equal(r.status, 200);
  assert.equal(r.body.client_secret, 'ek_test_SHORTLIVED');
  assert.equal(JSON.stringify(r.body).includes(PERMANENT), false, 'permanent key is absent from the response');
  // the OpenAI call used the permanent key server-side, with GA endpoint and a hashed identifier
  assert.equal(calls[0].url, 'https://api.openai.com/v1/realtime/client_secrets');
  assert.equal(calls[0].init.headers.Authorization, `Bearer ${PERMANENT}`);
  assert.match(calls[0].init.headers['OpenAI-Safety-Identifier'], /^[0-9a-f]{64}$/);
  assert.notEqual(calls[0].init.headers['OpenAI-Safety-Identifier'], student.id);
  const session = calls[0].body.session;
  assert.equal(session.type, 'realtime');
  assert.match(session.instructions, /MODE: STRICT/);
  assert.match(session.instructions, /FIRST LESSON/);
  assert.ok(session.tools.some((t) => t.name === 'log_mistake'));
  // lesson row + profile row created, bound to this student
  assert.equal(svc.LiveTeacherLesson.rows[0].user_email, student.email);
  assert.equal(svc.LiveTeacherLesson.rows[0].max_minutes, 15);
  assert.equal(svc.LiveTeacherProfile.rows.length, 1);
  assert.equal(r.body.lesson_id, svc.LiveTeacherLesson.rows[0].id);
});

test('start: OpenAI refuses -> 502; students never see OpenAI text, admins do; key shapes are redacted', async () => {
  const body = { error: { message: 'Bad key sk-proj-ABCDEFGH12345678 or unknown param session.reasoning' } };
  const bad = fakeOpenAI({ ok: false, status: 400, body });
  const s = await startLesson({ svc: fakeDb(), user: student, body: {}, env, fetchImpl: bad.fetchImpl, now: T0 });
  assert.equal(s.status, 502);
  assert.equal(s.body.code, 'openai_rejected');
  assert.equal('openai_message' in s.body, false);
  const a = await startLesson({ svc: fakeDb(), user: { ...student, role: 'admin' }, body: {}, env, fetchImpl: bad.fetchImpl, now: T0 });
  assert.match(a.body.openai_message, /unknown param/);
  assert.match(a.body.error, /^OpenAI said \(400\)/);
  assert.equal(s.body.error.includes('unknown param'), false, 'the student-facing message never carries OpenAI wording');
  assert.equal(a.body.openai_message.includes('sk-proj-ABCDEFGH12345678'), false);
  // network failure
  const down = await startLesson({ svc: fakeDb(), user: student, body: {}, env, fetchImpl: async () => { throw new Error('boom'); }, now: T0 });
  assert.equal(down.status, 502);
  assert.equal(down.body.code, 'openai_unreachable');
});

test('2. same mistake x3 through the server: new -> repeated(level 2) -> repeated(level 3, drill), persisted', async () => {
  const svc = fakeDb();
  const { fetchImpl } = fakeOpenAI();
  const { body: start } = await startLesson({ svc, user: student, body: { mode: 'strict' }, env, fetchImpl, now: T0 });
  const outs = [];
  for (let i = 0; i < 3; i++) outs.push((await tool(svc, start.lesson_id, 'log_mistake', igoes, T0 + 1000 * (i + 1))).body.output);
  assert.deepEqual(outs.map((o) => [o.status, o.level]), [['new', 1], ['repeated', 2], ['repeated', 3]]);
  assert.equal(outs[2].needs_drill, true);
  const lesson = svc.LiveTeacherLesson.rows[0];
  assert.equal(lesson.new_mistakes, 1);
  assert.equal(lesson.repeated_mistakes, 2);
  assert.equal(lesson.tool_calls, 3);
  assert.equal(svc.LiveTeacherProfile.rows[0].mistakes[mistakeKey('grammar.subject_verb_agreement', 'i_goes')].total_count, 3);
});

test('8. returning student: memory goes into the next prompt, and the old mistake starts at level 2', async () => {
  const svc = fakeDb();
  const { fetchImpl, calls } = fakeOpenAI();
  const first = (await startLesson({ svc, user: student, body: { mode: 'strict' }, env, fetchImpl, now: T0 })).body;
  await tool(svc, first.lesson_id, 'log_mistake', igoes, T0 + 1000);
  await tool(svc, first.lesson_id, 'set_level_estimate', { cefr: 'A2', confidence: 0.8 }, T0 + 2000);
  await tool(svc, first.lesson_id, 'log_pronunciation', { word: 'think', issue: 'th as s' }, T0 + 3000);
  const ended = await tool(svc, first.lesson_id, 'end_lesson', { summary: 'Present Simple basics.', strengths: ['good effort'], focus_next: ['he/she + s'] }, T0 + 60000);
  assert.equal(ended.body.recap.lesson_count, 1);
  assert.equal(ended.body.recap.new_mistakes, 1);
  assert.equal(ended.body.recap.cefr_level, 'A2');

  const second = (await startLesson({ svc, user: student, body: { mode: 'strict' }, env, fetchImpl, now: T0 + 86400000 })).body;
  const prompt = calls[1].body.session.instructions;
  assert.match(prompt, /Level estimate: A2/);
  assert.match(prompt, /rule=grammar\.subject_verb_agreement variant=i_goes/);
  assert.match(prompt, /Present Simple basics/);
  assert.match(prompt, /think/);
  const again = (await tool(svc, second.lesson_id, 'log_mistake', igoes, T0 + 86400000 + 5000)).body.output;
  assert.equal(again.status, 'repeated');
  assert.equal(again.level, 2);
  assert.equal(second.profile.cefr_level, 'A2');
});

test('end is idempotent and does not double-count lessons', async () => {
  const svc = fakeDb();
  const { fetchImpl } = fakeOpenAI();
  const s = (await startLesson({ svc, user: student, body: {}, env, fetchImpl, now: T0 })).body;
  const a = await endLesson({ svc, user: student, body: { lesson_id: s.lesson_id }, now: T0 + 90000 });
  assert.equal(a.body.recap.duration_s, 90);
  const b = await endLesson({ svc, user: student, body: { lesson_id: s.lesson_id }, now: T0 + 99000 });
  assert.equal(b.status, 200);
  assert.equal(svc.LiveTeacherProfile.rows[0].lesson_count, 1);
  // tools are refused after the lesson ended
  assert.equal((await tool(svc, s.lesson_id, 'log_mistake', igoes, T0 + 100000)).status, 409);
});

test('exam mode: silent directive, scores saved at the end', async () => {
  const svc = fakeDb();
  const { fetchImpl, calls } = fakeOpenAI();
  const s = (await startLesson({ svc, user: student, body: { mode: 'exam' }, env, fetchImpl, now: T0 })).body;
  assert.match(calls[0].body.session.instructions, /MODE: EXAM/);
  assert.equal(s.max_minutes, 12);
  const m = (await tool(svc, s.lesson_id, 'log_mistake', igoes, T0 + 1000)).body.output;
  assert.equal(m.tone, 'examiner');
  assert.match(m.directive, /do NOT correct/i);
  const end = await tool(svc, s.lesson_id, 'end_lesson', { summary: 'Exam done.', scores: { grammar: 70, vocabulary: 65, fluency: 60, pronunciation: 75, cefr: 'B1' } }, T0 + 600000);
  assert.deepEqual([end.body.recap.scores.grammar, end.body.recap.scores.cefr], [70, 'B1']);
  assert.equal(svc.LiveTeacherProfile.rows[0].test_results.length, 1);
});

test('tools: a student cannot use someone else\'s lesson, an expired one, or flood the database', async () => {
  const svc = fakeDb();
  const { fetchImpl } = fakeOpenAI();
  const s = (await startLesson({ svc, user: student, body: {}, env, fetchImpl, now: T0 })).body;
  const other = { id: 'u2', email: 'other@example.com', role: 'user' };
  assert.equal((await tool(svc, s.lesson_id, 'log_mistake', igoes, T0 + 1000, other)).status, 404);
  assert.equal((await tool(svc, 'nope', 'log_mistake', igoes, T0 + 1000)).status, 404);
  // 15 min lesson + 5 min grace
  assert.equal((await tool(svc, s.lesson_id, 'log_mistake', igoes, T0 + 21 * 60000)).status, 410);
  svc.LiveTeacherLesson.rows[0].tool_calls = 300;
  assert.equal((await tool(svc, s.lesson_id, 'log_mistake', igoes, T0 + 1000)).status, 429);
  svc.LiveTeacherLesson.rows[0].tool_calls = 0;
  // an unknown tool name does not crash the model's turn
  const unknown = await tool(svc, s.lesson_id, 'delete_everything', {}, T0 + 1000);
  assert.equal(unknown.status, 200);
  assert.equal(unknown.body.output.ok, false);
  // garbage arguments are survivable
  const junk = await handleTool({ svc, user: student, body: { lesson_id: s.lesson_id, name: 'log_mistake', args: '{not json' }, now: T0 + 2000 });
  assert.equal(junk.status, 200);
  assert.equal(junk.body.output.status, 'new');
});

test('profile view: returns only the student\'s own data', async () => {
  const svc = fakeDb();
  const { fetchImpl } = fakeOpenAI();
  const s = (await startLesson({ svc, user: student, body: {}, env, fetchImpl, now: T0 })).body;
  await tool(svc, s.lesson_id, 'log_mistake', igoes, T0 + 1000);
  await endLesson({ svc, user: student, body: { lesson_id: s.lesson_id }, now: T0 + 5000 });
  const mine = await getProfileView({ svc, user: student });
  assert.equal(mine.body.profile.mistakes.length, 1);
  assert.equal(mine.body.recent_lessons.length, 1);
  const other = await getProfileView({ svc, user: { id: 'u2', email: 'other@example.com' } });
  assert.equal(other.body.profile.mistakes.length, 0);
  assert.equal(other.body.recent_lessons.length, 0);
});
