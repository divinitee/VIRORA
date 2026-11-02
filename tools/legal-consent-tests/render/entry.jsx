import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { ConsentProvider, useConsent } from "@/lib/legal/ConsentContext";
import { consentGateView } from "@/lib/legal/consentGateView";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

// Mirrors AuthenticatedApp's consent handling using the SAME consentGateView.
function Shell() {
  const consent = useConsent();
  const { user } = useAuth();
  const location = useLocation();
  window.__navigate = useNavigate();
  const { block, globalsAllowed } = consentGateView({ consent, user, pathname: location.pathname, Loader: () => <p>LOADER</p> });
  if (block) return block;
  return (
    <div>
      <p>ROUTE {location.pathname}</p>
      {globalsAllowed && <p>GLOBALS-MOUNTED</p>}
      <button type="button" onClick={() => base44.functions.invoke("aiApi", { action: "gradeSentence" }).catch(() => {})}>CALL-AI</button>
    </div>
  );
}
window.__mount = (el) => createRoot(el).render(<BrowserRouter><ConsentProvider><Shell /></ConsentProvider></BrowserRouter>);
