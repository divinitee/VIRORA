// Same as src/lib/legal/consentConfig.js but with the kill switch ON and a
// short re-check interval, so the tests exercise the enabled gate.
export * from "../../../../src/lib/legal/consentConfig.js";
export const CONSENT_GATE_ENABLED = true;
// A test may stretch the interval (window.__recheckMs) to prove something
// happened immediately rather than at the next periodic re-check.
export const RECHECK_INTERVAL_MS = (typeof window !== "undefined" && window.__recheckMs) || 300;
