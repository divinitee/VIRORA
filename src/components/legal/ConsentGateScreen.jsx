import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, ScrollText, ShieldCheck, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { gateCopy } from "@/lib/legal/consentCopy";
import { newIdempotencyKey, recordConsent } from "@/lib/legal/legalClient";

const LOCALES = ["uz", "ru", "en"];
const reqKey = (a) => `${a.event_type}|${a.purpose_scope_id || ""}`;

// Blocking "Updated Terms and Privacy Notice" screen (Legal Consent
// Architecture §3.1, §8, §9). Not dismissible: the only ways out are a
// successful, server-recorded submission or signing out.
//
// Everything legal on this screen — documents, versions, checkbox labels —
// comes from the server's published release via `status`. The screen sends
// only the user's explicit choices + the server-issued presentation_id.
export default function ConsentGateScreen({ status, origin = "app-gate", onLocaleChange, onAccepted, onStale, onSignOut, embedded = false }) {
  const locale = status?.locale || "uz";
  const c = gateCopy(locale);
  const docs = status?.documents || [];
  const actions = status?.required_actions || [];

  const [openDoc, setOpenDoc] = useState(null);
  const [opened, setOpened] = useState(() => new Set());
  const [checked, setChecked] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const keyRef = useRef(null);

  // A new presentation (new release or locale) is a new submission: fresh
  // idempotency key, nothing pre-ticked, documents must be opened again.
  useEffect(() => {
    keyRef.current = newIdempotencyKey();
    setOpened(new Set());
    setChecked({});
    setOpenDoc(null);
  }, [status?.presentation_id]);

  const allOpened = docs.length > 0 && docs.every((d) => opened.has(d.document_id));
  const allChecked = actions.length > 0 && actions.every((a) => checked[reqKey(a)] === true);
  const canSubmit = allOpened && allChecked && !submitting && !!status?.presentation_id;

  const effective = useMemo(() => {
    const t = Date.parse(status?.release?.effective_at || "");
    return Number.isFinite(t) ? new Date(t).toLocaleDateString(locale === "en" ? "en-GB" : locale) : "";
  }, [status?.release?.effective_at, locale]);

  const toggleDoc = (id) => {
    setOpenDoc((cur) => (cur === id ? null : id));
    setOpened((prev) => new Set(prev).add(id));
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      await recordConsent({
        actions: actions.map((a) => ({ event_type: a.event_type, purpose_scope_id: a.purpose_scope_id || undefined, affirmed: checked[reqKey(a)] === true })),
        release_id: status.release.release_id,
        locale,
        presentation_id: status.presentation_id,
        idempotency_key: keyRef.current,
        origin_route: origin,
      });
      // Unlock is decided by the parent's FRESH status read, not by this write.
      await onAccepted?.();
    } catch (e) {
      if (e.code === "LEGAL_VERSION_CHANGED" || e.code === "INVALID_PRESENTATION") {
        setError(c.changed);
        onStale?.();
      } else {
        // Keep ticks and the same idempotency key: a retry after a timeout
        // that actually committed resolves server-side without duplicates.
        setError(c.saveFailed);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const shell = embedded ? "w-full" : "min-h-screen bg-background premium-mesh flex items-start sm:items-center justify-center px-4 py-8";
  return (
    <div className={shell} role="dialog" aria-modal={!embedded} aria-labelledby="consent-gate-title">
      <div className="w-full max-w-xl premium-card p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" aria-hidden />
            <div className="min-w-0">
              <h1 id="consent-gate-title" className="text-lg font-bold text-foreground leading-snug">{c.title}</h1>
              <p className="text-xs text-foreground/70 mt-1">
                {status?.release?.release_id}{effective ? ` · ${c.effective}: ${effective}` : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-1 rounded-full border border-border p-1 shrink-0" role="group" aria-label="Language">
            {LOCALES.filter((l) => (status?.release?.locales || LOCALES).includes(l)).map((l) => (
              <button key={l} type="button" aria-pressed={locale === l} disabled={submitting}
                onClick={() => l !== locale && onLocaleChange?.(l)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${locale === l ? "bg-primary text-primary-foreground" : "text-foreground/70"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-foreground/85">{c.intro}</p>

        <ul className="space-y-2">
          {docs.map((d) => {
            const isOpen = openDoc === d.document_id;
            return (
              <li key={d.document_id} className="rounded-xl border border-border">
                <button type="button" onClick={() => toggleDoc(d.document_id)} aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left">
                  <span className="flex items-center gap-2 min-w-0">
                    <ScrollText className="w-4 h-4 shrink-0 text-foreground/70" aria-hidden />
                    <span className="text-sm font-semibold text-foreground truncate">{c.docTypes[d.document_type] || d.document_type}</span>
                    <span className="text-xs text-foreground/60 shrink-0">{c.version} {d.version}</span>
                  </span>
                  <span className="text-xs font-semibold text-primary shrink-0 flex items-center gap-1">
                    {opened.has(d.document_id) && !isOpen && <Check className="w-3.5 h-3.5" aria-label={c.opened} />}
                    {isOpen ? c.hide : c.open}
                  </span>
                </button>
                {isOpen && (
                  <div className="max-h-72 overflow-y-auto overflow-x-hidden border-t border-border px-4 py-3 text-sm leading-relaxed text-foreground/90 select-text break-words [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1">
                    {d.content_format === "text" ? <p className="whitespace-pre-wrap">{d.canonical_content}</p> : <ReactMarkdown>{d.canonical_content}</ReactMarkdown>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="space-y-3">
          {actions.map((a) => {
            const id = `consent-${reqKey(a).replace(/[^a-z0-9]/gi, "-")}`;
            return (
              <label key={id} htmlFor={id} className={`flex items-start gap-3 text-sm leading-relaxed ${allOpened ? "text-foreground cursor-pointer" : "text-foreground/50"}`}>
                <Checkbox id={id} className="mt-0.5" disabled={!allOpened || submitting}
                  checked={checked[reqKey(a)] === true}
                  onCheckedChange={(v) => setChecked((p) => ({ ...p, [reqKey(a)]: v === true }))} />
                <span>{a.label}</span>
              </label>
            );
          })}
          {!allOpened && <p className="text-xs text-foreground/70">{c.openFirst}</p>}
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row gap-2">
          {onSignOut && (
            <Button type="button" variant="outline" className="h-11 sm:w-auto" onClick={onSignOut} disabled={submitting}>{c.signOut}</Button>
          )}
          <Button type="button" className="h-11 flex-1 font-semibold" onClick={submit} disabled={!canSubmit}>
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{c.saving}</> : c.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ConsentUnavailableScreen({ code, locale = "uz", onRetry, onSignOut, retrying }) {
  const c = gateCopy(locale);
  const policy = code === "LEGAL_POLICY_UNAVAILABLE";
  return (
    <div className="min-h-screen bg-background premium-mesh flex items-center justify-center px-4" role="alert">
      <div className="w-full max-w-md premium-card p-6 space-y-4 text-center">
        <h1 className="text-lg font-bold text-foreground">{policy ? c.policyTitle : c.unavailableTitle}</h1>
        <p className="text-sm text-foreground/80">{policy ? c.policyBody : c.unavailableBody}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {onSignOut && <Button type="button" variant="outline" onClick={onSignOut}>{c.signOut}</Button>}
          <Button type="button" onClick={onRetry} disabled={retrying}>
            {retrying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{c.checking}</> : c.retry}
          </Button>
        </div>
      </div>
    </div>
  );
}
