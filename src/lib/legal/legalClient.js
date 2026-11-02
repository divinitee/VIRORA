import { base44 } from "@/api/base44Client";

// Thin client for base44/functions/legalApi. Errors come back as an Error
// with `.code` (CONSENT_REQUIRED, LEGAL_VERSION_CHANGED, …) and `.status`.
// A network failure has code "NETWORK" — the caller must treat it as
// "couldn't verify", never as allowed.
async function legalCall(action, payload = {}) {
  try {
    const res = await base44.functions.invoke("legalApi", { action, ...payload });
    const data = res?.data ?? res;
    if (!data || data.ok !== true) {
      const err = new Error(data?.message || data?.error || action);
      err.code = data?.code || "BAD_RESPONSE";
      throw err;
    }
    return data;
  } catch (e) {
    if (e?.code && !e.response) throw e;
    const body = e?.response?.data || e?.data;
    const err = new Error(body?.message || body?.error || e?.message || "Request failed");
    err.code = body?.code || (e?.response ? "BAD_RESPONSE" : "NETWORK");
    err.status = e?.response?.status || e?.status;
    throw err;
  }
}

export const getPublishedLegalPackage = (locale) => legalCall("getPublishedLegalPackage", { locale });
export const getConsentStatus = (locale) => legalCall("getConsentStatus", { locale });
export const recordConsent = (payload) => legalCall("recordConsent", payload);
export const withdrawConsent = (payload) => legalCall("withdrawConsent", payload);
export const listMyConsents = () => legalCall("listMyConsents");
export const adminListReleases = () => legalCall("adminListReleases");
export const adminCreateDraft = (payload) => legalCall("adminCreateDraft", payload);
export const adminPublishRelease = (payload) => legalCall("adminPublishRelease", payload);

// One key per submission attempt; reused on retry so a timed-out request
// that actually committed is not recorded twice.
export const newIdempotencyKey = () =>
  "ck_" + (globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random()}`).replace(/[^A-Za-z0-9]/g, "");
