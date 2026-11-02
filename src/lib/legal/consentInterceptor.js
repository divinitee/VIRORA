import { GATE_CODES } from "../../../base44/shared/legalCore.js";
import { CONSENT_EVENT } from "@/lib/legal/consentConfig";

// Legal Consent Architecture v1.0 §10: any backend function may answer
// CONSENT_REQUIRED (a new release went live, consent was withdrawn, …). Tell
// the consent gate so it re-checks and blocks now instead of at the next
// poll. legalApi is excluded: the gate calls it itself.
export function installConsentInterceptor(client) {
  const rawInvoke = client.functions.invoke.bind(client.functions);
  const signal = (fn, code) => {
    if (fn !== "legalApi" && GATE_CODES.includes(code) && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { fn, code } }));
    }
  };
  client.functions.invoke = async (fn, payload) => {
    try {
      const res = await rawInvoke(fn, payload);
      signal(fn, (res?.data ?? res)?.code);
      return res;
    } catch (e) {
      signal(fn, e?.response?.data?.code || e?.data?.code || e?.code);
      throw e;
    }
  };
  return client;
}
