import React from "react";
import ConsentGateScreen, { ConsentUnavailableScreen } from "@/components/legal/ConsentGateScreen";
import { isUngatedPath } from "@/lib/legal/consentConfig";

// What the app shell renders for the consent state (Legal Consent
// Architecture §8–§9). Pure function so App.jsx and the render tests use the
// exact same decision.
//
// block:          element to render INSTEAD of the route tree, or null.
// globalsAllowed: may ActivityTracker / HelpReporter / LaunchExperience mount?
export function consentGateView({ consent, user, pathname, Loader }) {
  if (!consent.enabled) return { block: null, globalsAllowed: true };
  const gated = !!user && !isUngatedPath(pathname);
  const globalsAllowed = !!user && consent.state === "verified";
  if (!gated) return { block: null, globalsAllowed };
  if (consent.state === "verified") return { block: null, globalsAllowed };
  if (consent.state === "required") {
    return {
      globalsAllowed: false,
      block: (
        <ConsentGateScreen status={consent.status} origin={pathname === "/oauth/consent" ? "oauth/consent" : "app-gate"}
          onLocaleChange={consent.setLocale} onAccepted={consent.accepted} onStale={consent.refresh} onSignOut={consent.signOut} />
      ),
    };
  }
  if (consent.state === "unavailable") {
    return {
      globalsAllowed: false,
      block: <ConsentUnavailableScreen code={consent.code} locale={consent.locale} onRetry={consent.retry} retrying={consent.retrying} onSignOut={consent.signOut} />,
    };
  }
  // checking / anonymous-while-user-loads: neutral loader, nothing protected.
  return { globalsAllowed: false, block: Loader ? <Loader /> : null };
}
