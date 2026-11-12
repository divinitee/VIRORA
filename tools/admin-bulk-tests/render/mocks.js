export const calls = [];
globalThis.__calls = calls;
export const consoleApi = async (action, payload) => { calls.push([action, payload]); return { op: payload.op, done: payload.user_ids.length, skipped: 0, failed: 0, results: payload.user_ids.map((id) => ({ user_id: id, email: id + '@x', ok: true, note: 'account deleted' })) }; };
export const errorText = (e) => String(e?.message || e);
