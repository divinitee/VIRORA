// In-memory Base44 for the VT-45 progressApi tests. Supports the query
// operators progressApi / progressEngine use: equality, $in, $gt, $gte,
// $exists; sort; limit/skip; count; create/update/delete. Unknown entities are
// created on first use.
let seq = 0;
let clock = Date.parse('2026-11-02T08:00:00Z');
const nowIso = () => new Date(clock += 1000).toISOString();

export class Entity {
  rows: any[] = [];
  constructor(public name: string) {}
  match(row: any, q: any) {
    return Object.entries(q || {}).every(([k, v]: [string, any]) => {
      const x = row[k];
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        if ('$in' in v) return v.$in.includes(x);
        if ('$gt' in v) return x != null && x > v.$gt;
        if ('$gte' in v) return x != null && x >= v.$gte;
        if ('$exists' in v) return v.$exists ? x !== undefined && x !== null : x === undefined || x === null;
        if ('$ne' in v) return x !== v.$ne;
      }
      return x === v;
    });
  }
  async filter(q: any = {}, sort?: string, limit = 50, skip = 0) {
    let out = this.rows.filter((r) => this.match(r, q));
    if (sort) {
      const desc = sort.startsWith('-'); const f = desc ? sort.slice(1) : sort;
      out = [...out].sort((a, b) => String(a[f] ?? '').localeCompare(String(b[f] ?? '')) * (desc ? -1 : 1));
    }
    return structuredClone(out.slice(skip, skip + limit));
  }
  async list(sort?: string, limit = 50) { return this.filter({}, sort, limit); }
  async count(q: any = {}) { return this.rows.filter((r) => this.match(r, q)).length; }
  async get(id: string) { const r = this.rows.find((x) => x.id === id); if (!r) throw new Error('not found'); return structuredClone(r); }
  async create(d: any) { const t = nowIso(); const row = { ...structuredClone(d), id: `${this.name}_${++seq}`, created_date: t, updated_date: t }; this.rows.push(row); return structuredClone(row); }
  async bulkCreate(ds: any[]) { const out = []; for (const d of ds) out.push(await this.create(d)); return out; }
  async update(id: string, p: any) { const r = this.rows.find((x) => x.id === id); if (!r) throw new Error('not found'); Object.assign(r, structuredClone(p), { updated_date: nowIso() }); return structuredClone(r); }
  async updateMany(q: any, p: any) { const hit = this.rows.filter((r) => this.match(r, q)); for (const r of hit) Object.assign(r, structuredClone(p?.$set ?? p), { updated_date: nowIso() }); return { modified: hit.length }; }
  async delete(id: string) { this.rows = this.rows.filter((x) => x.id !== id); }
}

export const entities: Record<string, Entity> = new Proxy({}, { get: (t: any, n: string) => (t[n] ||= new Entity(n)) });
export const USERS: Record<string, any> = {
  ana: { id: 'u_ana', email: 'ana@example.com', role: 'user' },
  bob: { id: 'u_bob', email: 'bob@example.com', role: 'user' },
  tee: { id: 'u_tee', email: 'tee@example.com', role: 'admin' },
};
export const createClientFromRequest = (req: Request) => {
  const who = req.headers.get('x-user');
  return {
    auth: { me: async () => (who && USERS[who] ? { ...USERS[who] } : null) },
    asServiceRole: { entities, integrations: { Core: { InvokeLLM: async () => { throw new Error('no model in tests'); } } } },
  };
};
