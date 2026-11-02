import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { getAppLang } from "@/hooks/useAppLang";
import { listMyConsents, newIdempotencyKey, withdrawConsent } from "@/lib/legal/legalClient";
import { disableConsentedAnalytics } from "@/lib/analyticsConsent";
import { useConsent } from "@/lib/legal/ConsentContext";

// /legal/consents — consent receipts and withdrawal (Legal Consent
// Architecture §5, §7 withdrawConsent). Deliberately UNGATED: withdrawing
// must never require accepting the current terms first.
const COPY = {
  uz: {
    title: "Mening roziliklarim", signIn: "Ko'rish uchun hisobingizga kiring.", login: "Kirish",
    empty: "Hali hech qanday rozilik yozuvi yo'q.", withdraw: "Rozilikni qaytarib olish",
    confirm: "Bu rozilikni qaytarib olasizmi? Unga bog'liq funksiyalar to'xtatilishi mumkin.",
    withdrawn: "Rozilik qaytarib olindi.", failed: "Saqlab bo'lmadi. Qayta urinib ko'ring yoki support@virora.space ga yozing.",
    loadFailed: "Yozuvlarni yuklab bo'lmadi.", retry: "Qayta urinish",
    ev: { TERMS_ACCEPTED: "Oferta qabul qilindi", DATA_PROCESSING_CONSENT_GRANTED: "Ma'lumotlarga rozilik berildi", DATA_PROCESSING_CONSENT_WITHDRAWN: "Rozilik qaytarib olindi" },
  },
  ru: {
    title: "Мои согласия", signIn: "Войдите, чтобы увидеть свои согласия.", login: "Войти",
    empty: "Записей о согласии пока нет.", withdraw: "Отозвать согласие",
    confirm: "Отозвать это согласие? Зависящие от него функции могут перестать работать.",
    withdrawn: "Согласие отозвано.", failed: "Не удалось сохранить. Попробуйте снова или напишите на support@virora.space.",
    loadFailed: "Не удалось загрузить записи.", retry: "Повторить",
    ev: { TERMS_ACCEPTED: "Оферта принята", DATA_PROCESSING_CONSENT_GRANTED: "Согласие на данные дано", DATA_PROCESSING_CONSENT_WITHDRAWN: "Согласие отозвано" },
  },
  en: {
    title: "My consents", signIn: "Sign in to see your consents.", login: "Sign in",
    empty: "No consent records yet.", withdraw: "Withdraw consent",
    confirm: "Withdraw this consent? Features that depend on it may stop working.",
    withdrawn: "Consent withdrawn.", failed: "Couldn't save. Try again or write to support@virora.space.",
    loadFailed: "Couldn't load your records.", retry: "Retry",
    ev: { TERMS_ACCEPTED: "Offer accepted", DATA_PROCESSING_CONSENT_GRANTED: "Data processing consent given", DATA_PROCESSING_CONSENT_WITHDRAWN: "Consent withdrawn" },
  },
};

export default function MyConsents() {
  const { user, isLoadingAuth } = useAuth();
  const lang = ["uz", "ru", "en"].includes(getAppLang()) ? getAppLang() : "uz";
  const c = COPY[lang];
  const [records, setRecords] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState("");
  const keys = useRef({});
  const consent = useConsent();

  const load = useCallback(async () => {
    setError("");
    try { setRecords((await listMyConsents()).records || []); } catch { setError(c.loadFailed); }
  }, [c.loadFailed]);
  useEffect(() => { if (user?.id) load(); }, [user?.id, load]);

  const withdraw = async (r) => {
    if (!window.confirm(c.confirm)) return;
    setBusy(r.record_id);
    setNotice("");
    // Same key on retry for the same grant: a timed-out withdrawal that did
    // commit is not appended twice.
    keys.current[r.record_id] ||= newIdempotencyKey();
    try {
      await withdrawConsent({ related_record_id: r.record_id, idempotency_key: keys.current[r.record_id] });
    } catch {
      setNotice(c.failed);
      setBusy(null);
      return;
    }
    // Committed. Withdrawal stops analytics at once, not at the next consent
    // re-check; then the app-wide consent state is re-read straight away
    // (caches dropped, gate back up) instead of waiting up to 60 s.
    disableConsentedAnalytics();
    setNotice(c.withdrawn);
    try { await consent.withdrawn(); } catch { /* the provider already fails closed */ }
    await load();
    setBusy(null);
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Link to={user ? "/settings" : "/landing"} className="text-muted-foreground hover:text-foreground p-1.5" aria-label="Back"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">{c.title}</h1>
        </div>
        {isLoadingAuth ? <Loader2 className="w-5 h-5 animate-spin" /> : !user ? (
          <div className="premium-card p-5 space-y-3">
            <p className="text-sm">{c.signIn}</p>
            <Button asChild><Link to="/login?returnTo=%2Flegal%2Fconsents">{c.login}</Link></Button>
          </div>
        ) : (
          <div className="premium-card p-5 space-y-3">
            {notice && <p role="status" className="text-sm">{notice}</p>}
            {error && <div className="space-y-2"><p role="alert" className="text-sm text-destructive">{error}</p><Button variant="outline" onClick={load}>{c.retry}</Button></div>}
            {records === null && !error && <Loader2 className="w-5 h-5 animate-spin" />}
            {records?.length === 0 && <p className="text-sm text-foreground/80">{c.empty}</p>}
            <ul className="divide-y divide-border">
              {(records || []).slice().reverse().map((r) => (
                <li key={r.record_id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm">
                    <p className="font-semibold">{c.ev[r.event_type] || r.event_type}</p>
                    <p className="text-xs text-foreground/70 break-all">
                      {new Date(r.occurred_at).toLocaleString()} · {r.release_id} · v{r.document_version} · {String(r.document_locale || "").toUpperCase()}
                      {r.purpose_scope_id ? ` · ${r.purpose_scope_id}` : ""}
                    </p>
                  </div>
                  {r.active_grant && (
                    <Button variant="outline" size="sm" disabled={busy === r.record_id} onClick={() => withdraw(r)}>
                      {busy === r.record_id ? <Loader2 className="w-4 h-4 animate-spin" /> : c.withdraw}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
