// node tools/privacy-tests/run.mjs   (from the app root, after `npm ci` + `npm run build`)
// Proves the 2 Nov 2026 privacy picks: no tracker before consent, consented
// analytics only for a signed-in user, and no request to Google Fonts.
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? "PASS" : "FAIL"} ${msg}`); if (!ok) fails++; };

// 1. Source switches
check(/analyticsTracker:\s*false/.test(fs.readFileSync("vite.config.js", "utf8")), "vite.config.js: plugin page logger off");
check(/analytics:\s*\{\s*enabled:\s*false\s*\}/.test(fs.readFileSync("src/api/base44Client.js", "utf8")), "base44Client.js: SDK analytics off");

// 2. Built app (needs `npm run build` first)
if (fs.existsSync("dist/index.html")) {
  const html = fs.readFileSync("dist/index.html", "utf8");
  check(!html.includes("log-user-in-app"), "dist/index.html: no inline page-view tracker");
  const files = fs.readdirSync("dist", { recursive: true }).map(String).filter((f) => /\.(js|css|html)$/.test(f));
  const google = files.filter((f) => /fonts\.(googleapis|gstatic)\.com/.test(fs.readFileSync(path.join("dist", f), "utf8")));
  check(google.length === 0, `dist: no Google Fonts URLs (${google.join(", ") || "none"})`);
  const woff = fs.readdirSync("dist/assets").filter((f) => f.endsWith(".woff2"));
  for (const fam of ["albert-sans", "barlow", "cormorant-garamond"]) check(woff.some((f) => f.startsWith(fam)), `dist: ${fam} served from our own domain`);
  check(woff.some((f) => f.startsWith("cormorant-garamond-cyrillic")), "dist: Cyrillic subset kept for Cormorant (Russian UI)");
} else {
  console.log("SKIP built checks: run `npm run build` first");
}

// 3. enableConsentedAnalytics behaviour (real module, SDK + app-params mocked)
const out = "/tmp/analytics-consent-test.mjs";
await build({
  stdin: { contents: `export * from "./src/lib/analyticsConsent.js";`, resolveDir: root, loader: "js" },
  bundle: true, format: "esm", platform: "node", outfile: out, logLevel: "error",
  plugins: [{ name: "mocks", setup(b) {
    b.onResolve({ filter: /^@\/lib\/app-params$/ }, () => ({ path: "app-params", namespace: "m" }));
    b.onResolve({ filter: /^@base44\/sdk$/ }, () => ({ path: "sdk", namespace: "m" }));
    b.onLoad({ filter: /.*/, namespace: "m" }, (a) => ({ contents: a.path === "sdk"
      ? "export const createClient = () => { throw new Error('real SDK must not be used in the test'); };"
      : "export const appParams = { appId: 'app1', token: 't', functionsVersion: 'v', appBaseUrl: 'https://virora.space' };" }));
  } }],
});
const m = await import(out);
const made = [];
const create = (cfg) => { made.push(cfg); return { cleanup() { made.push("cleanup"); } }; };
check(m.enableConsentedAnalytics(null, { create }) === null && made.length === 0, "anonymous visitor: no analytics client");
check(m.enableConsentedAnalytics({}, { create }) === null && made.length === 0, "user without id: no analytics client");
m.enableConsentedAnalytics({ id: "u1" }, { create });
m.enableConsentedAnalytics({ id: "u1" }, { create });
check(made.length === 1 && made[0].analytics?.enabled === true && made[0].appId === "app1", "consented user: one analytics client, enabled");
check(m.isAnalyticsEnabled(), "isAnalyticsEnabled true after enable");
m.disableConsentedAnalytics();
check(made.at(-1) === "cleanup" && !m.isAnalyticsEnabled(), "disable: client cleaned up, tracking stops");

console.log(fails ? `\n${fails} FAILED` : "\nALL PASS");
process.exit(fails ? 1 : 0);
