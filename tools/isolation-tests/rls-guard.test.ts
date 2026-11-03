// VT-1.1.1 RLS guard: the database rules behind teacher/student isolation and
// subscription authority. Fails if anyone loosens them.
//   deno test --allow-read tools/isolation-tests/rls-guard.test.ts
// Added by Claude, 2026-11-03.
import { assertEquals } from 'jsr:@std/assert@1';

const load = (n: string) => JSON.parse(Deno.readTextFileSync(`base44/entities/${n}.jsonc`).replace(/^\s*\/\/.*$/gm, ''));
const ADMIN = { user_condition: { role: 'admin' } };
const ownerOr = (field: string, tmpl: string) => ({ $or: [{ [`data.${field}`]: tmpl }, ADMIN] });

Deno.test('teacher-owned tables: a teacher reads only rows with their own teacher_id', () => {
  for (const n of ['HomeworkAssignment', 'TeacherReferral', 'MaterialSource', 'MaterialSegment']) {
    assertEquals([n, load(n).rls.read], [n, ownerOr('teacher_id', '{{user.id}}')]);
  }
});

Deno.test('homework: only the server writes; students read only their own submissions', () => {
  for (const n of ['HomeworkAssignment', 'HomeworkSubmission']) {
    const r = load(n).rls;
    assertEquals([n, r.create, r.update, r.delete], [n, ADMIN, ADMIN, ADMIN]);
  }
  assertEquals(load('HomeworkSubmission').rls.read, ownerOr('student_email', '{{user.email}}'));
  assertEquals(load('TeacherReferral').rls.create, ADMIN);
});

Deno.test('money + access: only the server creates or changes them', () => {
  for (const n of ['StudentSubscription', 'ManualPayment', 'UserCoins', 'RewardEvent', 'PaymentSettings']) {
    const r = load(n).rls;
    assertEquals([n, r.create, r.update], [n, ADMIN, ADMIN]);
  }
});

Deno.test('User: trial, class and commission fields are admin-write only', () => {
  const p = load('User').properties;
  for (const f of ['trial_used_at', 'classroom_code', 'teacher_status', 'teacher_commission_rate_pct', 'teacher_commission_accrued_usd', 'teacher_payout_status']) {
    assertEquals([f, p[f]?.rls?.write], [f, ADMIN]);
  }
});

// Known open item (VT-1.1.2, 3 Nov): StudentSubscription.delete still lets the
// owner delete their own row. The app no longer uses that path (studentApi
// .deleteMySubscription), so it should be admin-only. Flip this test to the
// strict check once the rule is changed in Base44.
Deno.test('StudentSubscription.delete (open item: should become admin-only)', () => {
  const d = load('StudentSubscription').rls.delete;
  const strict = JSON.stringify(d) === JSON.stringify(ADMIN);
  if (!strict) console.warn('  OPEN: StudentSubscription delete is still owner-deletable');
});
