export const calls = [];
globalThis.__calls = calls;
globalThis.__nav = [];
export const coachApi = async (action, payload) => { calls.push(['coach', action, payload]); return { ok: true }; };
export const progressApi = async () => ({});
export const studentApi = async () => ({});
export const chooseFreePlan = async () => { calls.push(['plan']); return {}; };
export const base44 = { auth: { me: async () => ({ id: 'u', email: 'n@x', role: 'user', cefr_level: 'A2' }) } };
export const needsProfileSetup = () => false;
export default function ProfileSetup() { return null; }
