// Spy for src/lib/analyticsConsent.js (render tests): records every call so
// the tests can prove analytics start only after VERIFIED consent and stop on
// any other state. Built in when ANALYTICS_SPY=1.
const log = (window.__analytics = window.__analytics || []);
let on = false;
export function enableConsentedAnalytics(user) { if (!user?.id) return null; log.push(["enable", user.id]); on = true; return {}; }
export function disableConsentedAnalytics() { log.push(["disable"]); on = false; }
export const isAnalyticsEnabled = () => on;
