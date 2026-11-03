// In-memory stand-in for npm:@base44/sdk, shared by the REAL teacherApi and
// studentApi entry files (see import_map.json). The caller is whoever
// globalThis.__me is at request time. Service role sees everything, exactly
// like production, so every isolation check here is the function's own code.
export const tables: Record<string, any[]> = {};
let seq = 0;

const match = (row: any, q: any): boolean => Object.entries(q || {}).every(([k, v]: [string, any]) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if ('$in' in v) return v.$in.includes(row[k]);
    if ('$gt' in v) return row[k] > v.$gt;
    if ('$gte' in v) return row[k] >= v.$gte;
    if ('$exists' in v) return (row[k] !== undefined && row[k] !== null) === v.$exists;
    return false;
  }
  return row[k] === v;
});

function entity(name: string) {
  const t = (tables[name] ||= []);
  const sorter = (sort?: string) => (a: any, b: any) => {
    if (!sort) return 0;
    const desc = sort.startsWith('-'); const k = desc ? sort.slice(1) : sort;
    return (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * (desc ? -1 : 1);
  };
  return {
    async filter(q: any, sort?: string, limit = 50) { return t.filter((r) => match(r, q)).sort(sorter(sort)).slice(0, limit).map((r) => ({ ...r })); },
    async get(id: string) { const r = t.find((x) => x.id === id); if (!r) throw new Error('not found'); return { ...r }; },
    async count(q: any) { return t.filter((r) => match(r, q)).length; },
    async create(o: any) {
      const r = { id: `${name}-${++seq}`, created_date: new Date(Date.now() + seq).toISOString(), created_by_id: (globalThis as any).__me?.id, ...o };
      t.push(r); return { ...r };
    },
    async bulkCreate(os: any[]) { return Promise.all(os.map((o) => this.create(o))); },
    async update(id: string, o: any) { const r = t.find((x) => x.id === id); if (!r) throw new Error('not found'); Object.assign(r, o); return { ...r }; },
    async delete(id: string) { const i = t.findIndex((x) => x.id === id); if (i >= 0) t.splice(i, 1); },
  };
}

const entities: any = new Proxy({}, { get: (target: any, name: string) => (target[name] ||= entity(name)) });

export function createClientFromRequest(_req: Request) {
  return {
    auth: { me: async () => { const me = (globalThis as any).__me; if (!me) throw new Error('no session'); return { ...me }; } },
    asServiceRole: { entities },
    entities,
  };
}
