// Teacher Panel revamp (2026-11-12): fixed weekly slot rule + class
// calendar fields (module, capacity, colour, emoji). Runs the REAL teacherApi
// handler against the in-memory store, like teacher-isolation.test.ts.
//   deno test --allow-all --no-check --import-map=tools/isolation-tests/import_map.json tools/isolation-tests/teacher-schedule.test.ts
// Added by Claude, 2026-11-12.

import { assert, assertEquals } from 'jsr:@std/assert@1';
import { tables } from './mock_sdk.ts';

const handlers: Record<string, (req: Request) => Promise<Response>> = {};
(Deno as any).serve = (h: any) => { handlers.teacherApi = h; return { shutdown() {}, finished: Promise.resolve() }; };
await import('../../base44/functions/teacherApi/entry.ts');

const T1 = { id: 'u_st1', email: 'st1@x.uz', role: 'user', teacher_status: 'approved', display_name: 'Sched One' };
const T2 = { id: 'u_st2', email: 'st2@x.uz', role: 'user', teacher_status: 'approved', display_name: 'Sched Two' };
tables.User = [...(tables.User || []), T1, T2].map((u) => ({ ...u }));

async function teacher(me: any, action: string, b: any = {}) {
  (globalThis as any).__me = me;
  const r = await handlers.teacherApi(new Request('http://x', { method: 'POST', body: JSON.stringify({ action, ...b }) }));
  return { status: r.status, ...(await r.json()) };
}

Deno.test('create: one fixed slot across several days, with calendar fields', async () => {
  const r = await teacher(T1, 'createGroup', {
    label: 'B1 MWF', level: 'B1', module: 'Module 3', max_capacity: 12,
    days: ['Mon', 'Wed', 'Fri'], start_time: '09:00', end_time: '10:30', color: 'emerald', icon: '🎯',
  });
  assertEquals(r.ok, true);
  const g = tables.TeacherReferral.find((x) => x.id === r.group.id);
  assertEquals([g.module, g.max_capacity, g.color, g.icon, g.start_time, g.end_time], ['Module 3', 12, 'emerald', '🎯', '09:00', '10:30']);
  assertEquals(g.days, ['Mon', 'Wed', 'Fri']);
});

Deno.test('create: days without a start time are refused', async () => {
  const r = await teacher(T1, 'createGroup', { label: 'x', days: ['Tue'] });
  assertEquals([r.status, r.code], [400, 'start_time_required']);
});

Deno.test('create: end before start is refused', async () => {
  const r = await teacher(T1, 'createGroup', { label: 'x', days: ['Tue'], start_time: '10:00', end_time: '09:00' });
  assertEquals([r.status, r.code], [400, 'bad_time_range']);
});

Deno.test('create: no schedule at all is still allowed (unscheduled class)', async () => {
  const r = await teacher(T1, 'createGroup', { label: 'Later' });
  assertEquals(r.ok, true);
});

Deno.test('create: bad capacity / colour are refused', async () => {
  assertEquals((await teacher(T1, 'createGroup', { label: 'x', max_capacity: 0 })).code, 'bad_capacity');
  assertEquals((await teacher(T1, 'createGroup', { label: 'x', max_capacity: 999 })).code, 'bad_capacity');
  assertEquals((await teacher(T1, 'createGroup', { label: 'x', color: 'neon' })).code, 'bad_color');
});

Deno.test('update: partial edit keeps the slot valid against stored values', async () => {
  const g = (await teacher(T1, 'createGroup', { label: 'Eve', days: ['Mon'], start_time: '18:00', end_time: '19:30' })).group;
  // Moving only the end time before the stored start must fail.
  const bad = await teacher(T1, 'updateGroup', { group_id: g.id, end_time: '17:00' });
  assertEquals([bad.status, bad.code], [400, 'bad_time_range']);
  // Clearing the start time while days remain must fail.
  const bad2 = await teacher(T1, 'updateGroup', { group_id: g.id, start_time: '' });
  assertEquals([bad2.status, bad2.code], [400, 'start_time_required']);
  // Appearance-only edit on a legacy-style row works and leaves the slot alone.
  const ok = await teacher(T1, 'updateGroup', { group_id: g.id, color: 'rose', icon: '🚀', module: 'Unit 5', max_capacity: '' });
  assertEquals(ok.ok, true);
  const row = tables.TeacherReferral.find((x) => x.id === g.id);
  assertEquals([row.color, row.icon, row.module, row.max_capacity, row.start_time], ['rose', '🚀', 'Unit 5', null, '18:00']);
});

Deno.test('overview returns the new fields and seat counts', async () => {
  const o = await teacher(T1, 'overview');
  const g = o.groups.find((x: any) => x.label === 'B1 MWF');
  assert(g, 'class present');
  assertEquals([g.module, g.max_capacity, g.color, g.icon, g.student_count], ['Module 3', 12, 'emerald', '🎯', 0]);
});

Deno.test('another teacher still cannot edit the class, including the new fields', async () => {
  const g = tables.TeacherReferral.find((x) => x.label === 'B1 MWF');
  const r = await teacher(T2, 'updateGroup', { group_id: g.id, color: 'amber', max_capacity: 1 });
  assertEquals([r.status, r.code], [404, 'group_not_found']);
  assertEquals(tables.TeacherReferral.find((x) => x.id === g.id).color, 'emerald');
});
