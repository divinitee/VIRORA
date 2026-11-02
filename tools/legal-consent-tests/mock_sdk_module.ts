// Stands in for npm:@base44/sdk inside the real entry.ts files (import_map.json).
import { MockEntity } from '../admin-console-tests/mock_base44.ts';
import { USERS } from './world.ts';

export const entities: Record<string, any> = new Proxy({}, {
  get(t: any, name: string) { return (t[name] ||= new MockEntity(name)); },
});
export const createClientFromRequest = (req: Request) => {
  const who = req.headers.get('x-user');
  return {
    auth: { me: async () => (who && USERS[who] ? { ...USERS[who] } : null) },
    asServiceRole: { entities, integrations: { Core: { InvokeLLM: async () => { throw new Error('MODEL CALLED'); } } } },
  };
};
