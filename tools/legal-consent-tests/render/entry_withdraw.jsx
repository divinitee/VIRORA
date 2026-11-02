import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ConsentProvider, useConsent } from "@/lib/legal/ConsentContext";
import { consentGateView } from "@/lib/legal/consentGateView";
import { useAuth } from "@/lib/AuthContext";
import { queryClientInstance } from "@/lib/query-client";
import MyConsents from "@/pages/MyConsents";

// Withdrawal lifecycle (GPT code audit, 2 Nov 2026): the REAL MyConsents page
// inside the REAL ConsentProvider, with the same consentGateView App.jsx uses.
function Shell() {
  const consent = useConsent();
  const { user } = useAuth();
  const location = useLocation();
  window.__navigate = useNavigate();
  window.__consentState = consent.state;
  const { block } = consentGateView({ consent, user, pathname: location.pathname, Loader: () => <p>LOADER</p> });
  if (block) return block;
  return (
    <Routes>
      <Route path="/legal/consents" element={<MyConsents />} />
      <Route path="*" element={<p>PROTECTED {location.pathname}</p>} />
    </Routes>
  );
}
window.__qc = queryClientInstance;
window.__mount = (el) => createRoot(el).render(<BrowserRouter><ConsentProvider><Shell /></ConsentProvider></BrowserRouter>);
