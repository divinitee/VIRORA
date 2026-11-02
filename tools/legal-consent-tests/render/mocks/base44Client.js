// Fake Base44 client: legalApi + any other function answered from
// window.__scenario.handlers; the REAL consent interceptor is installed on it.
import { installConsentInterceptor } from "@/lib/legal/consentInterceptor";

const calls = (window.__calls = []);
const s = (window.__scenario = window.__scenario || { user: null, handlers: {} });
export const base44 = installConsentInterceptor({
  functions: {
    async invoke(fn, payload) {
      calls.push({ fn, ...payload });
      const h = s.handlers[`${fn}.${payload?.action}`] || s.handlers[fn];
      const out = h ? await h(payload) : { __error: 1, status: 500, code: "NO_HANDLER" };
      if (out && out.__error) { const e = new Error(out.code); e.response = { status: out.status, data: { ok: false, code: out.code } }; throw e; }
      return { data: out };
    },
  },
  auth: { logout: (to) => { window.__loggedOut = to; } },
});
