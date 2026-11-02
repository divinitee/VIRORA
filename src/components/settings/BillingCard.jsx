import React, { useEffect, useState } from "react";
import { CreditCard, ExternalLink, Loader2, QrCode } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAppLang } from "@/hooks/useAppLang";
import { billingView } from "../../../base44/shared/billingPortal.js";

// Settings → "Subscription": lets a card subscriber cancel auto-renewal
// themselves (Tee, 2 Nov 2026; the Offer promises it). The cancel happens in
// Dodo's customer portal; QR plans never renew, so they only show the end date.
// Renders nothing for free plans, trials and unpaid accounts.
const COPY = {
  uz: {
    title: "Obuna",
    cardRenews: (d) => `Karta orqali to'lanadi. Keyingi to'lov: ${d}.`,
    cardEnding: (d) => `Avtomatik yangilanish bekor qilingan. Kirish ${d} gacha saqlanadi.`,
    qr: (d) => `QR orqali to'langan. Avtomatik yangilanmaydi${d ? ` — ${d} da tugaydi` : ""}.`,
    manage: "Obunani boshqarish yoki bekor qilish",
    manageEnding: "Obunani boshqarish",
    note: "Dodo to'lov sahifasi ochiladi. Bekor qilsangiz ham, to'langan davr oxirigacha kirish saqlanadi.",
    failed: "Sahifani ochib bo'lmadi. Keyinroq urinib ko'ring yoki support@virora.space ga yozing.",
  },
  ru: {
    title: "Подписка",
    cardRenews: (d) => `Оплата картой. Следующее списание: ${d}.`,
    cardEnding: (d) => `Автопродление отменено. Доступ сохраняется до ${d}.`,
    qr: (d) => `Оплачено через QR. Не продлевается автоматически${d ? ` — заканчивается ${d}` : ""}.`,
    manage: "Управлять подпиской или отменить",
    manageEnding: "Управлять подпиской",
    note: "Откроется страница оплаты Dodo. Если отменить, доступ сохранится до конца оплаченного периода.",
    failed: "Не удалось открыть страницу. Попробуйте позже или напишите на support@virora.space.",
  },
  en: {
    title: "Subscription",
    cardRenews: (d) => `Paid by card. Next payment: ${d}.`,
    cardEnding: (d) => `Auto-renewal is cancelled. You keep access until ${d}.`,
    qr: (d) => `Paid by QR. It doesn't renew automatically${d ? ` — it ends on ${d}` : ""}.`,
    manage: "Manage or cancel subscription",
    manageEnding: "Manage subscription",
    note: "Opens Dodo's billing page. If you cancel, you keep access until the end of the paid period.",
    failed: "Couldn't open the billing page. Try again later or write to support@virora.space.",
  },
};

const fmt = (d, lang) => {
  if (!d) return "—";
  const t = Date.parse(`${d}T12:00:00Z`);
  return Number.isFinite(t) ? new Date(t).toLocaleDateString(lang === "en" ? "en-GB" : lang) : d;
};

export default function BillingCard({ user }) {
  const { lang } = useAppLang();
  const c = COPY[lang] || COPY.uz;
  const [view, setView] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) return undefined;
    let alive = true;
    base44.entities.StudentSubscription.filter({ phone: user.email })
      .then((rows) => {
        if (!alive) return;
        const views = (rows || []).map(billingView).filter(Boolean);
        setView(views.find((v) => v.kind !== "qr") || views[0] || null);
      })
      .catch(() => { if (alive) setView(null); });
    return () => { alive = false; };
  }, [user?.email]);

  if (!view) return null;

  const openPortal = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await base44.functions.invoke("dodoPortal", {});
      const url = (res?.data ?? res)?.url;
      if (!url) throw new Error("no url");
      window.location.href = url;
    } catch {
      setError(c.failed);
      setBusy(false);
    }
  };

  const date = fmt(view.date, lang);
  const isCard = view.kind === "card" || view.kind === "ending";
  const Icon = isCard ? CreditCard : QrCode;
  return (
    <div className="bg-background rounded-2xl border border-border p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-4">{c.title}</p>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-foreground">{view.plan}</p>
          <p className="text-xs text-muted-foreground">
            {view.kind === "card" ? c.cardRenews(date) : view.kind === "ending" ? c.cardEnding(date) : c.qr(view.date ? date : null)}
          </p>
        </div>
      </div>
      {isCard && (
        <div className="mt-4 space-y-2">
          <button type="button" onClick={openPortal} disabled={busy}
            className="w-full h-11 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted/40 disabled:opacity-60 flex items-center justify-center gap-2">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" aria-hidden />}
            {view.kind === "ending" ? c.manageEnding : c.manage}
          </button>
          <p className="text-[11px] text-muted-foreground">{c.note}</p>
          {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}
