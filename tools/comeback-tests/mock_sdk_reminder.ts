// Mock SDK for the REAL sendDailyReminder entry: entities + a recording SendEmail.
import { Ent } from './mock_sdk.ts';
export const rw: { entities: Record<string, Ent>; me: any; sent: any[] } = { entities: {}, me: null, sent: [] };
for (const n of ['User', 'RoundReceipt', 'AssessmentResult']) rw.entities[n] = new Ent(n);
export function createClientFromRequest(_req: Request) {
  return {
    auth: { me: async () => rw.me },
    asServiceRole: { entities: rw.entities, integrations: { Core: { SendEmail: async (m: any) => { rw.sent.push(m); } } } },
  };
}
