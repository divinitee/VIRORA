// Minimal in-memory Base44 SDK for progressApi comeback tests.
let seq = 0;
const cmp = (row: any, k: string, v: any) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if ('$gte' in v) return String(row[k] ?? '') >= String(v.$gte);
    if ('$gt' in v) return String(row[k] ?? '') > String(v.$gt);
    if ('$in' in v) return v.$in.includes(row[k]);
    if ('$exists' in v) return (row[k] !== undefined) === v.$exists;
  }
  return row[k] === v;
};
export class Ent {
  rows: any[] = [];
  bulkCalls = 0;
  constructor(public name: string) {}
  match(r: any, q: any) { return Object.entries(q || {}).every(([k, v]) => cmp(r, k, v)); }
  async filter(q: any = {}, sort?: string, limit = 50, skip = 0) {
    let out = this.rows.filter((r) => this.match(r, q));
    if (sort) { const d = sort.startsWith('-'); const f = d ? sort.slice(1) : sort; out = [...out].sort((a, b) => String(a[f] ?? '').localeCompare(String(b[f] ?? '')) * (d ? -1 : 1)); }
    return structuredClone(out.slice(skip, skip + limit));
  }
  async create(d: any) { const row = { ...structuredClone(d), id: `${this.name}_${++seq}`, created_date: new Date(1_800_000_000_000 + seq).toISOString() }; this.rows.push(row); return structuredClone(row); }
  async update(id: string, p: any) { const r = this.rows.find((x) => x.id === id); Object.assign(r, structuredClone(p)); return structuredClone(r); }
  async delete(id: string) { this.rows = this.rows.filter((x) => x.id !== id); }
  async updateMany(q: any, u: any) {
    this.bulkCalls++;
    const hits = this.rows.filter((r) => this.match(r, q));
    for (const r of hits) {
      for (const [k, v] of Object.entries(u.$inc || {})) r[k] = (r[k] || 0) + (v as number);
      Object.assign(r, u.$set || {});
    }
    return { updated: hits.length };
  }
}
export const world: { entities: Record<string, Ent>; me: any } = { entities: {}, me: null };
for (const n of ['RoundReceipt', 'AssessmentResult', 'UserCoins', 'RewardEvent']) world.entities[n] = new Ent(n);
export function createClientFromRequest(_req: Request) {
  return { auth: { me: async () => { if (!world.me) throw new Error('401'); return { ...world.me }; } }, asServiceRole: { entities: world.entities } };
}
