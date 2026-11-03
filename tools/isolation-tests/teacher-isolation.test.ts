// VT-1.1.1 / VT-1.1.1.2 proof: teacher T2 can never read or change teacher
// T1's classes, rosters or homework, and students only see their own homework.
// Runs the REAL teacherApi + studentApi handlers against an in-memory store.
//   deno test --allow-all --no-check --import-map=tools/isolation-tests/import_map.json tools/isolation-tests/teacher-isolation.test.ts
// Added by Claude, 2026-11-03.

import { assert, assertEquals } from 'jsr:@std/assert@1';
import { tables } from './mock_sdk.ts';

const handlers: Record<string, (req: Request) => Promise<Response>> = {};
let loading = '';
(Deno as any).serve = (h: any) => { handlers[loading] = h; return { shutdown() {}, finished: Promise.resolve() }; };
loading = 'teacherApi'; await import('../../base44/functions/teacherApi/entry.ts');
loading = 'studentApi'; await import('../../base44/functions/studentApi/entry.ts');

const T1 = { id: 'u_t1', email: 't1@x.uz', role: 'user', teacher_status: 'approved', display_name: 'Teacher One' };
const T2 = { id: 'u_t2', email: 't2@x.uz', role: 'user', teacher_status: 'approved', display_name: 'Teacher Two' };
const PENDING = { id: 'u_tp', email: 'tp@x.uz', role: 'user', teacher_status: 'pending' };
const S1 = { id: 'u_s1', email: 's1@x.uz', role: 'user', display_name: 'Student One' };
const S2 = { id: 'u_s2', email: 's2@x.uz', role: 'user', display_name: 'Student Two' };
tables.User = [T1, T2, PENDING, S1, S2].map((u) => ({ ...u }));

async function call(fn: string, me: any, body: any) {
  (globalThis as any).__me = me;
  const r = await handlers[fn](new Request('http://x', { method: 'POST', body: JSON.stringify(body) }));
  return { status: r.status, ...(await r.json()) };
}
const teacher = (me: any, action: string, b: any = {}) => call('teacherApi', me, { action, ...b });
const student = (me: any, action: string, b: any = {}) => call('studentApi', me, { action, ...b });

// --- world: T1 has class A with S1 and homework; T2 has class B with S2 ---
const gA = (await teacher(T1, 'createGroup', { label: 'T1 class' })).group;
const gB = (await teacher(T2, 'createGroup', { label: 'T2 class' })).group;
assert((await student(S1, 'joinClass', { code: gA.code })).ok);
assert((await student(S2, 'joinClass', { code: gB.code })).ok);
const hwA = (await teacher(T1, 'createAssignment', { group_id: gA.id, game: 'quiz', title: 'T1 homework' })).assignment;
const hwB = (await teacher(T2, 'createAssignment', { group_id: gB.id, game: 'quiz', title: 'T2 homework' })).assignment;
const subS1 = tables.StudentSubscription.find((s) => s.phone === S1.email);

Deno.test('setup is real: each teacher created a class and homework', () => {
  assert(gA?.id && gB?.id && hwA?.id && hwB?.id && subS1?.teacher_id === T1.id);
});

Deno.test('T2 overview shows only T2: no T1 class, student or homework', async () => {
  const o = await teacher(T2, 'overview');
  const blob = JSON.stringify(o);
  assertEquals(o.ok, true);
  assert(!blob.includes(gA.id) && !blob.includes(gA.code), 'T1 class leaked');
  assert(!blob.includes(S1.email), 'T1 student leaked');
  assert(!blob.includes(hwA.id), 'T1 homework leaked');
  assert(blob.includes(gB.id) && blob.includes(S2.email), 'T2 sees own data');
});

Deno.test('T2 cannot change T1 class', async () => {
  const r = await teacher(T2, 'updateGroup', { group_id: gA.id, label: 'hijacked', group_status: 'ended' });
  assertEquals([r.status, r.code], [404, 'group_not_found']);
  assertEquals(tables.TeacherReferral.find((g) => g.id === gA.id).label, 'T1 class');
});

Deno.test('T2 cannot remove T1 student from the roster', async () => {
  const r = await teacher(T2, 'setRoster', { subscription_id: subS1.id, removed: true });
  assertEquals([r.status, r.code], [404, 'student_not_found']);
  assertEquals(tables.StudentSubscription.find((s) => s.id === subS1.id).roster_status, 'active');
});

Deno.test('T2 cannot set homework on T1 class, or close T1 homework', async () => {
  const c = await teacher(T2, 'createAssignment', { group_id: gA.id, game: 'quiz' });
  assertEquals([c.status, c.code], [404, 'group_not_found']);
  const x = await teacher(T2, 'closeAssignment', { assignment_id: hwA.id });
  assertEquals([x.status, x.code], [404, 'assignment_not_found']);
  assertEquals(tables.HomeworkAssignment.find((a) => a.id === hwA.id).status, 'active');
});

Deno.test('T2 cannot read a T1 student\'s activity or progress', async () => {
  for (const action of ['studentActivity', 'studentProgress']) {
    const r = await teacher(T2, action, { email: S1.email });
    assertEquals([action, r.status, r.code], [action, 404, 'student_not_found']);
  }
});

Deno.test('T2 cannot target T1 students by email in its own homework', async () => {
  const r = await teacher(T2, 'createAssignment', { group_id: gB.id, game: 'quiz', target: 'students', student_emails: [S1.email] });
  assertEquals([r.status, r.code], [400, 'no_valid_students']);
});

Deno.test('students only see their own class homework', async () => {
  const l1 = await student(S1, 'listHomework');
  const l2 = await student(S2, 'listHomework');
  assertEquals(l1.assignments.map((a: any) => a.id), [hwA.id]);
  assertEquals(l2.assignments.map((a: any) => a.id), [hwB.id]);
});

Deno.test('a student cannot submit another class\'s homework', async () => {
  const r = await student(S2, 'submitHomework', { assignment_id: hwA.id });
  assertEquals([r.status, r.code], [403, 'not_assigned']);
});

Deno.test('pending teachers and students get no teacher actions', async () => {
  for (const me of [PENDING, S1]) {
    const r = await teacher(me, 'updateGroup', { group_id: gA.id, label: 'x' });
    assertEquals([r.status, r.code], [403, 'not_teacher']);
    const o = await teacher(me, 'overview');
    assert(!JSON.stringify(o).includes(gA.id), 'overview leaked to non-teacher');
  }
});

Deno.test('no session → 401 on both APIs', async () => {
  assertEquals((await call('teacherApi', null, { action: 'overview' })).status, 401);
  assertEquals((await call('studentApi', null, { action: 'listHomework' })).status, 401);
});

Deno.test('a teacher cannot join their own or another class as a student', async () => {
  const own = await student(T1, 'joinClass', { code: gA.code });
  const other = await student(T2, 'joinClass', { code: gA.code });
  assertEquals([own.code, other.code], ['teachers_cannot_join', 'teachers_cannot_join']);
});
