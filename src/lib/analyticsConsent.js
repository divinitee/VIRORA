import { createClient } from "@base44/sdk";
import { appParams } from "@/lib/app-params";

// Base44 analytics only for people who have consented (Tee, 2 Nov 2026,
// "analytics before consent" → option a).
//
// Before this change two trackers ran on every page load for every visitor,
// before any consent:
//   1. the Vite plugin's inline page-name logger (analyticsTracker), and
//   2. the SDK's own analytics: session id, page path, referrer, heartbeat.
// Both are now OFF by default (vite.config.js: analyticsTracker false;
// base44Client.js: analytics.enabled false).
//
// enableConsentedAnalytics() turns the SDK analytics back on for ONE signed-in
// user whose consent the server has verified. Its only caller should be the
// consent gate (ConsentContext, state "verified") once the legal-consent-v1
// branch is live. Until then nobody is tracked, and the Base44 dashboard
// shows no anonymous visitor counts. That trade-off was accepted.
//
// The SDK decides `analytics.enabled` when a client is created and can't be
// switched on later, so this creates a second, analytics-only client the
// first time it's called. Calling it again is a no-op.
let analyticsClient = null;

export function enableConsentedAnalytics(user, { create = createClient } = {}) {
  if (analyticsClient) return analyticsClient;
  if (!user?.id) return null; // never for anonymous visitors
  const { appId, token, functionsVersion, appBaseUrl } = appParams;
  analyticsClient = create({
    appId, token, functionsVersion, serverUrl: "", requiresAuth: false, appBaseUrl,
    analytics: { enabled: true },
  });
  return analyticsClient;
}

// Stop tracking (sign-out, consent withdrawn or no longer verified).
export function disableConsentedAnalytics() {
  try { analyticsClient?.cleanup?.(); } catch { /* best effort */ }
  analyticsClient = null;
}

export const isAnalyticsEnabled = () => analyticsClient !== null;
