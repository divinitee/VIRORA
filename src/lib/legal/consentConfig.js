// Legal Consent Architecture v1.0 — browser kill switch.
//
// false (default): the consent gate is dormant. The app behaves exactly as it
// did before; no status calls, global components render as before.
// true: every signed-in user is checked against the server before the app
// mounts, and fails CLOSED if the check can't complete.
//
// This switch only controls the browser UI. The real enforcement is the
// backend guard, driven by the LEGAL_CONSENT_MODE secret (off | canary |
// enforce). Rollout order (LEGAL-CONSENT-V1-HANDOFF.md):
//   1. publish a release   2. secret = canary   3. flip this to true
//   4. canary matrix passes + §15 signed off   5. secret = enforce
// It is NOT a "current version" constant: versions and hashes come only from
// the server's release registry.
export const CONSENT_GATE_ENABLED = false;

// Paths that must work for a signed-in user who has NOT consented:
// documents, auth flows, withdrawal, and the publisher console.
export const UNGATED_PATHS = [
  "/login", "/register", "/forgot-password", "/reset-password",
  "/terms", "/privacy", "/about", "/contact", "/landing", "/roadmap",
  "/legal/consents", "/admin/legal",
];
export const isUngatedPath = (pathname) => UNGATED_PATHS.includes(String(pathname || "").replace(/\/+$/, "") || "/");

export const RECHECK_INTERVAL_MS = 60_000;
export const CONSENT_EVENT = "virora:consent-gate";
