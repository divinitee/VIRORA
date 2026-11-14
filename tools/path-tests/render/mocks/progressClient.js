globalThis.__evidence = [];
export const submitEvidence = async (email, payload) => { globalThis.__evidence.push({ email, payload }); return { ok: true }; };
