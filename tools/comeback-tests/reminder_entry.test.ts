// The REAL sendDailyReminder entry with the SDK mocked.
//   deno test -A --no-check --import-map=tools/comeback-tests/import_map_reminder.json tools/comeback-tests/reminder_entry.test.ts
import { rw } from './mock_sdk_reminder.ts';
let handler: any = null;
(Deno as any).serve = (h: any) => { handler = h; return { shutdown() {}, finished: Promise.resolve() }; };
await import('../../base44/functions/sendDailyReminder/entry.ts');
const post = async (body: any = {}) => { const r = await handler(new Request('http://x', { method: 'POST', body: JSON.stringify(body) })); return { status: r.status, ...(await r.json()) }; };
const eq = (a: any, b: any, m: string) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`); };
const ago = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

Deno.test('students cannot trigger it', async () => {
  rw.me = { id: 's', email: 's@x', role: 'user' };
  eq((await post()).status, 403, 'forbidden');
});

Deno.test('dry run sends nothing; real run emails only the right students', async () => {
  rw.me = { id: 'a', email: 'admin@x', role: 'admin' };
  rw.entities.User.rows.push(
    { id: 'u1', email: 'risk@x', full_name: 'Aziz', role: 'user' },
    { id: 'u2', email: 'today@x', role: 'user' },
    { id: 'u3', email: 'lapsed@x', role: 'user' },
    { id: 'u4', email: 'teacher@x', role: 'user', teacher_status: 'approved' },
    { id: 'u5', email: 'never@x', role: 'user' },
  );
  rw.entities.RoundReceipt.rows.push(
    { user_email: 'risk@x', status: 'done', round_at: ago(1) },
    { user_email: 'today@x', status: 'done', round_at: ago(0) },
    { user_email: 'lapsed@x', status: 'done', round_at: ago(2) },
    { user_email: 'teacher@x', status: 'done', round_at: ago(1) },
  );
  const dry = await post({ dry_run: true });
  eq([dry.dry_run, dry.at_risk, dry.lapsed, rw.sent.length], [true, 1, 1, 0], 'dry run');
  const real = await post();
  eq([real.sent, real.failed], [2, 0], 'sent');
  eq(rw.sent.map((m) => m.to).sort(), ['lapsed@x', 'risk@x'], 'recipients');
});
