// Same as src/lib/legal/consentConfig.js but with the kill switch ON and a
// short re-check interval, so the tests exercise the enabled gate.
export * from "../../../../src/lib/legal/consentConfig.js";
export const CONSENT_GATE_ENABLED = true;
export const RECHECK_INTERVAL_MS = 300;
