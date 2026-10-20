// Helpers behind the Oct 2026 "students keep re-registering" fix.
//
// What the User table showed: ~10 students with two accounts each, typo'd
// domains (gamil.com) that can never receive the signup OTP, and raw English
// platform errors shown to A1 students. None of it was a session bug — the
// token persists fine in a normal browser. These three helpers attack the
// actual causes: typos, unreadable errors, and in-app browsers that drop
// localStorage (Telegram / Instagram / Facebook webviews).

// ---------------------------------------------------------------------------
// 1. Email typo suggestion — "Did you mean …@gmail.com?"
// ---------------------------------------------------------------------------

const KNOWN_DOMAINS = [
  "gmail.com", "mail.ru", "icloud.com", "yandex.ru", "yandex.com", "inbox.ru",
  "list.ru", "bk.ru", "yahoo.com", "outlook.com", "hotmail.com", "umail.uz",
];

// Explicit misspellings seen in the wild (and their usual cousins). Checked
// first so the common case never depends on the distance heuristic.
const COMMON_TYPOS = {
  "gamil.com": "gmail.com", "gmial.com": "gmail.com", "gmai.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.cm": "gmail.com", "gmail.con": "gmail.com",
  "gmail.ru": "gmail.com", "gmali.com": "gmail.com", "gmeil.com": "gmail.com",
  "gnail.com": "gmail.com", "g.mail.com": "gmail.com", "gmail.om": "gmail.com",
  "gmail.comm": "gmail.com", "gmaill.com": "gmail.com", "gmail": "gmail.com",
  "mail.r": "mail.ru", "mail.ry": "mail.ru", "mail.com.ru": "mail.ru",
  "iclod.com": "icloud.com", "icloud.co": "icloud.com", "icoud.com": "icloud.com",
  "yandex.r": "yandex.ru", "yandeks.ru": "yandex.ru",
};

function distance(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return d[m][n];
}

// Returns the corrected full address, or null when the email looks fine.
export function suggestEmailFix(raw) {
  const email = (raw || "").trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (KNOWN_DOMAINS.includes(domain)) return null;
  if (COMMON_TYPOS[domain]) return `${local}@${COMMON_TYPOS[domain]}`;
  let best = null, bestD = Infinity;
  for (const k of KNOWN_DOMAINS) {
    const dist = distance(domain, k);
    if (dist < bestD) { bestD = dist; best = k; }
  }
  // 1–2 edits away from a known domain is almost certainly a slip.
  return bestD > 0 && bestD <= 2 ? `${local}@${best}` : null;
}

// ---------------------------------------------------------------------------
// 2. Readable auth errors in the student's own language
// ---------------------------------------------------------------------------

const ERR = {
  uz: {
    exists: "Bu email bilan hisob allaqachon bor. Yangi hisob ochmang — «Kirish» sahifasidan kiring.",
    wrong: "Email yoki parol noto'g'ri. Parolni unutgan bo'lsangiz, «Parolni unutdingizmi?» ni bosing.",
    notVerified: "Email hali tasdiqlanmagan. Pochtangizdagi 6 xonali kodni kiriting.",
    badCode: "Kod noto'g'ri yoki eskirgan. «Qayta yuborish» ni bosing.",
    weakPassword: "Parol juda qisqa — kamida 8 ta belgi kiriting.",
    badEmail: "Email manzil noto'g'ri yozilgan. Tekshirib qayta urinib ko'ring.",
    tooMany: "Juda ko'p urinish. Bir daqiqa kutib, qayta urinib ko'ring.",
    network: "Internet aloqasi yo'q. Tarmoqni tekshirib, qayta urinib ko'ring.",
  },
  en: {
    exists: "An account with this email already exists. Don't make a new one — log in instead.",
    wrong: "Wrong email or password. Forgot it? Tap “Forgot your password?”.",
    notVerified: "This email isn't verified yet. Enter the 6-digit code from your inbox.",
    badCode: "That code is wrong or expired. Tap “Resend code”.",
    weakPassword: "Password is too short — use at least 8 characters.",
    badEmail: "That email address doesn't look right. Check it and try again.",
    tooMany: "Too many attempts. Wait a minute and try again.",
    network: "No internet connection. Check your network and try again.",
  },
  ru: {
    exists: "Аккаунт с этим email уже есть. Не создавайте новый — просто войдите.",
    wrong: "Неверный email или пароль. Забыли пароль? Нажмите «Забыли пароль?».",
    notVerified: "Email ещё не подтверждён. Введите 6-значный код из письма.",
    badCode: "Код неверный или устарел. Нажмите «Отправить снова».",
    weakPassword: "Пароль слишком короткий — минимум 8 символов.",
    badEmail: "Email написан с ошибкой. Проверьте и попробуйте снова.",
    tooMany: "Слишком много попыток. Подождите минуту и попробуйте снова.",
    network: "Нет интернета. Проверьте сеть и попробуйте снова.",
  },
};

// Platform error text isn't a stable contract, so this matches loosely on
// status + message and falls back to the caller's own generic string.
// context "otp" reads a generic 400/401 as a bad code, not a bad password.
export function friendlyAuthError(err, lang, fallback, context) {
  const s = ERR[lang] || ERR.uz;
  const status = err?.status ?? err?.response?.status;
  const msg = String(err?.message || err?.data?.message || err?.data?.detail || "").toLowerCase();

  if (!status && /network|failed to fetch|timeout|offline/.test(msg)) return s.network;
  if (status === 429 || /too many|rate limit/.test(msg)) return s.tooMany;
  if (status === 409 || /already (exists|registered|in use)|exists|taken/.test(msg)) return s.exists;
  if (/not verified|verify your email|unverified/.test(msg)) return s.notVerified;
  if (context === "otp") return s.badCode;
  if (/otp|code/.test(msg) && /invalid|expired|wrong|incorrect/.test(msg)) return s.badCode;
  if (/password/.test(msg) && /short|weak|at least|length|characters/.test(msg)) return s.weakPassword;
  if (/email/.test(msg) && /invalid|valid|format/.test(msg)) return s.badEmail;
  if (status === 401 || status === 403 || /invalid|incorrect|wrong|credentials|not found|no user/.test(msg)) return s.wrong;
  return fallback || err?.message || s.wrong;
}

// ---------------------------------------------------------------------------
// 3. In-app browser detection
// ---------------------------------------------------------------------------

// Telegram, Instagram, Facebook and TikTok open links in their own webview.
// Those webviews often keep no localStorage between visits, so the student is
// logged out every time they reopen the link — the most likely source of
// "it makes me register again". Telegram on Android usually uses Chrome
// Custom Tabs (shared storage, fine); its iOS webview and the others are not.
export function detectInAppBrowser() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  let app = null;
  if (/Instagram/i.test(ua)) app = "Instagram";
  else if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) app = "Facebook";
  else if (/Telegram/i.test(ua) || typeof window !== "undefined" && window.TelegramWebviewProxy) app = "Telegram";
  else if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) app = "TikTok";
  else if (/Line\//i.test(ua)) app = "LINE";
  // Generic Android WebView marker ("; wv)") catches the rest.
  else if (isAndroid && /; wv\)/.test(ua)) app = "app";
  if (!app) return null;
  return { app, isAndroid, isIOS };
}

// Android only: an intent:// link asks the OS to open this page in Chrome.
export function chromeIntentUrl() {
  const { host, pathname, search, hash } = window.location;
  return `intent://${host}${pathname}${search}${hash}#Intent;scheme=https;package=com.android.chrome;end`;
}
