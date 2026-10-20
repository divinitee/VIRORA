import React, { useMemo, useState } from "react";
import { ExternalLink, Copy, Check, X } from "lucide-react";
import { useAppLang } from "@/hooks/useAppLang";
import { detectInAppBrowser, chromeIntentUrl } from "@/lib/authHelpers";

// Shown only inside Telegram / Instagram / Facebook / TikTok webviews, which
// often forget the login between visits. Tells the student to open VIRORA in
// a real browser so they stay signed in. See src/lib/authHelpers.js.

const STR = {
  uz: {
    title: "{app} ichida ochdingiz", appWord: "ilova",
    body: "Bu yerda VIRORA har safar sizni hisobdan chiqarib yuborishi mumkin. Doimiy kirgan holda qolish uchun Chrome yoki Safari'da oching.",
    iosHow: "Pastki/yuqori burchakdagi ⋯ yoki ↗ belgisini bosing → «Safari'da ochish».",
    androidHow: "Yoki ⋮ belgisini bosing → «Brauzerda ochish».",
    openChrome: "Chrome'da ochish",
    copy: "Havolani nusxalash", copied: "Nusxalandi",
  },
  en: {
    title: "You opened this inside {app}", appWord: "an app",
    body: "In here VIRORA may log you out every time. Open it in Chrome or Safari to stay signed in.",
    iosHow: "Tap the ⋯ or ↗ icon in the corner → “Open in Safari”.",
    androidHow: "Or tap ⋮ → “Open in browser”.",
    openChrome: "Open in Chrome",
    copy: "Copy link", copied: "Copied",
  },
  ru: {
    title: "Вы открыли это внутри {app}", appWord: "приложения",
    body: "Здесь VIRORA может каждый раз выходить из аккаунта. Откройте в Chrome или Safari, чтобы оставаться в системе.",
    iosHow: "Нажмите ⋯ или ↗ в углу → «Открыть в Safari».",
    androidHow: "Или нажмите ⋮ → «Открыть в браузере».",
    openChrome: "Открыть в Chrome",
    copy: "Скопировать ссылку", copied: "Скопировано",
  },
};

// floating: a solid dark card pinned to the bottom of the screen, for pages
// (the landing) whose own theme classes don't match the app's.
export default function InAppBrowserNotice({ className = "", floating = false }) {
  const { lang } = useAppLang();
  const s = STR[lang] || STR.uz;
  const info = useMemo(() => detectInAppBrowser(), []);
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (!info || hidden) return null;

  const appName = info.app === "app" ? s.appWord : info.app;
  const url = window.location.origin + "/login";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tone = floating
    ? "fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md bg-slate-900 text-amber-100 shadow-2xl"
    : "relative bg-amber-500/10 text-amber-900 dark:text-amber-100";

  return (
    <div className={`rounded-2xl border border-amber-500/40 p-4 text-sm ${tone} ${className}`} role="alert">
      <button onClick={() => setHidden(true)} className="absolute right-2 top-2 p-1 opacity-60 hover:opacity-100" aria-label="Close">
        <X className="w-4 h-4" />
      </button>
      <p className="font-semibold pr-6">{s.title.replace("{app}", appName)}</p>
      <p className="mt-1 opacity-90">{s.body}</p>
      <p className="mt-2 text-xs opacity-80">{info.isIOS ? s.iosHow : s.androidHow}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {info.isAndroid && (
          <a href={chromeIntentUrl()} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 font-semibold text-black">
            <ExternalLink className="w-4 h-4" /> {s.openChrome}
          </a>
        )}
        <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/50 px-3 py-2 font-medium">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? s.copied : s.copy}
        </button>
      </div>
    </div>
  );
}
