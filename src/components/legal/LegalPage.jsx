import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getAppLang } from "@/hooks/useAppLang";
import { useAuth } from "@/lib/AuthContext";
import { getPublishedLegalPackage } from "@/lib/legal/legalClient";
import { CONSENT_GATE_ENABLED } from "@/lib/legal/consentConfig";

const LANGS = ["uz", "ru", "en"];
const TITLES = {
  public_offer: { uz: "Ommaviy oferta", ru: "Публичная оферта", en: "Public Offer" },
  privacy_notice: { uz: "Maxfiylik siyosati", ru: "Политика конфиденциальности", en: "Privacy Policy" },
};

// Public /terms and /privacy (Legal Consent Architecture §4.1). Shows the
// exact artifact of the ACTIVE published release from the server registry —
// the same bytes the consent gate hashes. While no release is published (or
// the registry is unreachable) it shows the pinned copy bundled with the app,
// labelled as such; that copy can be read but never accepted against.
export default function LegalPage({ docs, docType }) {
  const initial = LANGS.includes(getAppLang()) ? getAppLang() : "uz";
  const [lang, setLang] = useState(initial);
  // undefined = loading, null = show the bundled copy. With the consent
  // kill switch off the page renders exactly as before, with no server call.
  const [published, setPublished] = useState(CONSENT_GATE_ENABLED ? undefined : null);
  const { user } = useAuth();

  useEffect(() => {
    if (!CONSENT_GATE_ENABLED) return undefined;
    let alive = true;
    setPublished(undefined);
    getPublishedLegalPackage(lang)
      .then((pkg) => {
        const d = (pkg.documents || []).find((x) => x.document_type === docType);
        if (alive) setPublished(d ? { ...d, release: pkg.release } : null);
      })
      .catch(() => { if (alive) setPublished(null); });
    return () => { alive = false; };
  }, [lang, docType]);

  useEffect(() => {
    document.title = `${TITLES[docType]?.[lang] || "Legal"} — VIRORA`;
  }, [docType, lang]);

  const text = published ? published.canonical_content : docs[lang];
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to={user ? "/" : "/landing"} aria-label="Back" className="text-muted-foreground hover:text-foreground p-1.5"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex gap-1 rounded-full border border-border p-1" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <article className="premium-card p-6 md:p-8 select-text break-words text-sm leading-relaxed text-foreground/90 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1.5 [&_code]:text-xs [&_code]:text-brand">
          {published === undefined ? <Loader2 className="w-5 h-5 animate-spin" /> : <ReactMarkdown>{text}</ReactMarkdown>}
        </article>
        {published && (
          <p className="mt-3 text-xs text-muted-foreground break-all">
            {published.release.release_id} · v{published.version} · SHA-256 {published.sha256}
          </p>
        )}
      </div>
    </div>
  );
}
