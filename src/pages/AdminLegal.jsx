import React, { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/AuthContext";
import { TERMS } from "@/lib/legal/terms";
import { PRIVACY } from "@/lib/legal/privacy";
import { adminCreateDraft, adminListReleases, adminPublishRelease } from "@/lib/legal/legalClient";

// /admin/legal — legal release registry console (Legal Consent Architecture
// §4, §13). The server allows only admins listed in LEGAL_PUBLISHER_USER_IDS;
// this page is just a form over legalApi's publisher actions.
//
// "Create draft" snapshots the bundled v1.3 text exactly as the site shows it
// today. Drafts are inert. Publishing makes a release ACTIVE at effective_at
// and must not happen until every §15 item is signed off.

// Exact sign-up checkbox / data-consent wording currently in
// src/components/legal/SignupConsent.jsx (plain text, links removed).
const BUNDLED = {
  termsLabel: {
    uz: "Men VIRORA Ommaviy Ofertasi shartlarini qabul qilaman va Maxfiylik Siyosati bilan tanishib chiqdim.",
    ru: "Я принимаю условия Публичной оферты VIRORA и подтверждаю ознакомление с Политикой конфиденциальности.",
    en: "I accept the VIRORA Public Offer and acknowledge the Privacy Policy.",
  },
  dataConsent: {
    uz: "Ta'lim jarayonini ta'minlash maqsadida shaxsiy va o'quv ma'lumotlarimning xalqaro bulutli serverlar (Base44) hamda sun'iy intellekt (AI) provayderlari orqali transchegaraviy qayta ishlanishiga rozilik bildiraman.",
    ru: "Я даю согласие на трансграничную передачу и обработку моих учетных и учебных данных на международных облачных серверах (Base44) и провайдерами ИИ в целях функционирования платформы.",
    en: "I consent to the cross-border transfer and processing of my account and learning data on international cloud servers (Base44) and AI providers for platform functionality.",
  },
};

function bundledDraft(releaseId, version, scopeId) {
  const documents = [];
  for (const l of ["uz", "ru", "en"]) {
    documents.push({ document_type: "public_offer", version, locale: l, content_format: "markdown", canonical_content: TERMS[l] });
    documents.push({ document_type: "privacy_notice", version, locale: l, content_format: "markdown", canonical_content: PRIVACY[l] });
    documents.push({ document_type: "data_processing_consent", version, locale: l, content_format: "text", canonical_content: BUNDLED.dataConsent[l] });
  }
  return {
    release_id: releaseId,
    documents,
    required_events_and_scopes: [
      { event_type: "TERMS_ACCEPTED", document_type: "public_offer", label_by_locale: BUNDLED.termsLabel },
      { event_type: "DATA_PROCESSING_CONSENT_GRANTED", purpose_scope_id: scopeId, document_type: "data_processing_consent", label_by_locale: BUNDLED.dataConsent },
    ],
  };
}

export default function AdminLegal() {
  const { user, isLoadingAuth } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({ release_id: "v1-3-draft-1", version: "1.3", scope: "core_platform_processing" });
  const [pub, setPub] = useState({ release_id: "", approval_reference: "", effective_at: "", confirmed: false });

  const load = useCallback(async () => {
    setError("");
    try { setData(await adminListReleases()); } catch (e) { setError(`${e.code}: ${e.message}`); }
  }, []);
  useEffect(() => { if (user?.role === "admin") load(); }, [user?.role, load]);

  if (isLoadingAuth) return null;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  const run = async (fn) => {
    setBusy(true); setError("");
    try { await fn(); await load(); } catch (e) { setError(`${e.code}: ${e.message}`); } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground p-1.5" aria-label="Back"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">Legal releases</h1>
        </div>
        {error && <p role="alert" className="text-sm text-destructive break-words">{error}</p>}

        <section className="premium-card p-5 space-y-2">
          <h2 className="font-semibold">Registry</h2>
          <p className="text-sm">Active release: <b>{data?.active_release_id || "none"}</b></p>
          {!data && !error && <Loader2 className="w-4 h-4 animate-spin" />}
          <ul className="text-xs space-y-2">
            {(data?.releases || []).map((r) => (
              <li key={r.id} className="border border-border rounded-lg p-2 break-words">
                <b>{r.release_id}</b> · {r.status} · effective {r.effective_at || "—"} · approval {r.approval_reference || "—"}
                <div className="text-foreground/70">
                  {Object.entries(r.documents_by_locale || {}).map(([l, docs]) => (
                    <div key={l}>{l}: {docs.map((d) => `${d.document_type} v${d.version} ${d.sha256.slice(0, 12)}…`).join(" · ")}</div>
                  ))}
                </div>
                {r.problems?.length > 0 && <div className="text-destructive">Invalid: {r.problems.join("; ")}</div>}
              </li>
            ))}
          </ul>
        </section>

        <section className="premium-card p-5 space-y-3">
          <h2 className="font-semibold">Create draft from the bundled text</h2>
          <p className="text-xs text-foreground/70">Snapshots src/lib/legal (Offer, Privacy) and the sign-up checkbox wording, all three languages, byte for byte. Changing any text later needs a new version and a new draft.</p>
          <div className="grid sm:grid-cols-3 gap-2">
            <Input aria-label="Release id" value={draft.release_id} onChange={(e) => setDraft({ ...draft, release_id: e.target.value })} />
            <Input aria-label="Version" value={draft.version} onChange={(e) => setDraft({ ...draft, version: e.target.value })} />
            <Input aria-label="Purpose scope id" value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value })} />
          </div>
          <Button disabled={busy} onClick={() => run(() => adminCreateDraft(bundledDraft(draft.release_id.trim(), draft.version.trim(), draft.scope.trim())))}>
            Create draft
          </Button>
        </section>

        <section className="premium-card p-5 space-y-3 border border-destructive/40">
          <h2 className="font-semibold">Publish (makes it ACTIVE)</h2>
          <p className="text-xs text-destructive">Blocked until every §15 lawyer decision is documented. Publishing gates every user once LEGAL_CONSENT_MODE is canary/enforce. It cannot be edited or undone; a fix is a new release.</p>
          <div className="grid sm:grid-cols-3 gap-2">
            <Input aria-label="Draft release id" placeholder="release id" value={pub.release_id} onChange={(e) => setPub({ ...pub, release_id: e.target.value })} />
            <Input aria-label="Approval reference" placeholder="lawyer sign-off ref" value={pub.approval_reference} onChange={(e) => setPub({ ...pub, approval_reference: e.target.value })} />
            <Input aria-label="Effective at" type="datetime-local" value={pub.effective_at} onChange={(e) => setPub({ ...pub, effective_at: e.target.value })} />
          </div>
          <label htmlFor="pub-confirm" className="flex items-start gap-2 text-sm">
            <Checkbox id="pub-confirm" checked={pub.confirmed} onCheckedChange={(v) => setPub({ ...pub, confirmed: v === true })} />
            <span>The approval reference records the lawyer's sign-off on every §15 item for this exact text.</span>
          </label>
          <Button variant="destructive" disabled={busy || !pub.confirmed || !pub.release_id || !pub.approval_reference}
            onClick={() => run(() => adminPublishRelease({
              release_id: pub.release_id.trim(), approval_reference: pub.approval_reference.trim(),
              effective_at: pub.effective_at ? new Date(pub.effective_at).toISOString() : undefined,
            }))}>
            Publish release
          </Button>
        </section>
      </div>
    </div>
  );
}
