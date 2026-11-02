import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { getAppLang } from "@/hooks/useAppLang";
import { queryClientInstance } from "@/lib/query-client";
import { getConsentStatus } from "@/lib/legal/legalClient";
import { CONSENT_EVENT, CONSENT_GATE_ENABLED, RECHECK_INTERVAL_MS } from "@/lib/legal/consentConfig";
import { disableConsentedAnalytics, enableConsentedAnalytics } from "@/lib/analyticsConsent";

// Consent status for the signed-in user (Legal Consent Architecture §9–§11).
//
// state:
//   disabled     kill switch off (consentConfig.js) — app behaves as before
//   anonymous    nobody signed in
//   checking     status not known yet — render NOTHING protected
//   required     server says actions are missing — show the blocking gate
//   unavailable  status could not be read — block, offer Retry / Sign out
//   verified     a FRESH server response said allowed (or not enforced)
//
// There is no cached "allowed": every unlock comes from a server response,
// and any failed re-check blocks again (after one quiet retry, so a single
// dropped packet doesn't throw someone out of a lesson).
const ConsentContext = createContext(null);

const LOCALES = ["uz", "ru", "en"];
const pickLocale = () => (LOCALES.includes(getAppLang()) ? getAppLang() : "uz");

export function ConsentProvider({ children }) {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();
  const [state, setState] = useState(CONSENT_GATE_ENABLED ? "checking" : "disabled");
  const [status, setStatus] = useState(null);
  const [code, setCode] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const localeRef = useRef(pickLocale());
  const stateRef = useRef(state);
  const seq = useRef(0);
  const inFlight = useRef(false);
  stateRef.current = state;

  const check = useCallback(async ({ silent = false } = {}) => {
    if (!CONSENT_GATE_ENABLED) return;
    if (!user?.id) { setState("anonymous"); setStatus(null); disableConsentedAnalytics(); return; }
    // A quiet re-check never supersedes one already running, so a burst of
    // focus/route events can't keep postponing a failing check's verdict.
    if (silent && inFlight.current) return;
    const mine = ++seq.current;
    inFlight.current = true;
    if (!silent) setState("checking");
    const attempt = async (tries) => {
      try {
        return { res: await getConsentStatus(localeRef.current) };
      } catch (e) {
        if (tries > 0 && silent) {
          await new Promise((r) => setTimeout(r, 2000));
          return attempt(tries - 1);
        }
        return { err: e };
      }
    };
    const { res, err } = await attempt(1);
    if (mine !== seq.current) return; // a newer (non-quiet) check superseded this one
    inFlight.current = false;
    const was = stateRef.current;
    if (err) {
      setCode(err.code || "CONSENT_CHECK_UNAVAILABLE");
      setState("unavailable");
      disableConsentedAnalytics();
      if (was === "verified") queryClientInstance.clear();
      return;
    }
    if (res.allowed || res.enforced === false) {
      setStatus(null);
      setCode(null);
      setState("verified");
      // Analytics only after VERIFIED consent: enforced AND allowed. Mode off
      // (enforced:false) lets the app run but is not consent, so no tracking.
      if (res.enforced === true && res.allowed === true) enableConsentedAnalytics(user);
      else disableConsentedAnalytics();
      return;
    }
    // Required: drop consent-dependent cached data and stop protected UI.
    disableConsentedAnalytics();
    if (was === "verified") queryClientInstance.clear();
    setStatus(res);
    setState("required");
  }, [user?.id]);

  // Initial check whenever the signed-in identity changes.
  useEffect(() => {
    if (!CONSENT_GATE_ENABLED || isLoadingAuth) return;
    check();
  }, [check, isLoadingAuth]);

  // Re-checks: route change, tab return, reconnect, every 60 s, and the
  // moment any backend function answers CONSENT_REQUIRED.
  const quiet = useCallback(() => {
    if (stateRef.current === "verified") check({ silent: true });
  }, [check]);
  useEffect(() => { quiet(); }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!CONSENT_GATE_ENABLED) return undefined;
    const onVisible = () => { if (document.visibilityState === "visible") quiet(); };
    const onGateEvent = () => { if (stateRef.current !== "required") check({ silent: true }); };
    const timer = window.setInterval(quiet, RECHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", quiet);
    window.addEventListener("online", quiet);
    window.addEventListener(CONSENT_EVENT, onGateEvent);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", quiet);
      window.removeEventListener("online", quiet);
      window.removeEventListener(CONSENT_EVENT, onGateEvent);
    };
  }, [check, quiet]);

  const value = useMemo(() => ({
    enabled: CONSENT_GATE_ENABLED,
    state, status, code, retrying,
    // Fresh read after a successful submission: only this unlocks.
    accepted: () => check(),
    refresh: () => check(),
    retry: async () => { setRetrying(true); try { await check(); } finally { setRetrying(false); } },
    setLocale: (l) => { localeRef.current = l; return check(); },
    locale: localeRef.current,
    signOut: () => base44.auth.logout(`${window.location.origin}/landing`),
  }), [state, status, code, retrying, check]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const v = useContext(ConsentContext);
  if (!v) throw new Error("useConsent must be used within ConsentProvider");
  return v;
}
