# Legal consent tests (Legal Consent Architecture v1.0)

Run from the app root.

```bash
# backend core, legalApi handler, consent guard (§14 matrix rows are prefixed "matrix:")
deno test --allow-read tools/legal-consent-tests/legal.test.ts

# static: legal entities RLS never; nothing updates/deletes them; browser never
# touches them; EVERY backend function is guarded, filtered or explicitly
# exempt (a new function fails until someone classifies it); no browser agent calls
deno test --allow-read tools/legal-consent-tests/static.test.ts

# concurrency (GPT code audit 2 Nov): N simultaneous record/withdraw calls with
# the SAME idempotency key write exactly one row per action (ConsentWriteLock
# lease, claimed with Base44's single-id conditional updateMany); busy lock →
# LEGAL_WRITE_BUSY with nothing written; lock always released; readers collapse
# any duplicate that slips past an expired lease; a broken-lock control run
# proves the race is real
deno test --allow-read tools/legal-consent-tests/concurrency.test.ts

# manifest duplicates (GPT code audit 2 Nov): duplicate requirement, duplicate
# document type per locale, duplicate/mismatched document reference → refused
# at draft (nothing written), refused at publish, never served (503)
deno test --allow-read tools/legal-consent-tests/manifest.test.ts

# the REAL function entries with SDK + runtime mocked: guard runs before work,
# canary/off modes, legalApi wiring
deno test --allow-read --allow-net=registry.npmjs.org --node-modules-dir=none --no-check \
  --import-map=tools/legal-consent-tests/import_map.json tools/legal-consent-tests/entry_wiring.test.ts
```

## UI render check (jsdom; real ConsentProvider, consentGateView, ConsentGateScreen, interceptor)

```bash
mkdir -p /tmp/rc && (cd /tmp/rc && npm i jsdom@24)   # jsdom is not an app dependency

# kill switch ON (mocked): 30 checks — loader, outage screens, blocking gate,
# separate unchecked controls, failed write keeps gate + ticks, idempotent retry,
# unlock only after fresh status, CONSENT_REQUIRED → gate, periodic re-check,
# no cached allow, ungated paths, /oauth/consent resume, locale switch, sign-out
node tools/legal-consent-tests/render/build.mjs
NODE_PATH=/tmp/rc/node_modules node tools/legal-consent-tests/render/run.cjs

# kill switch OFF (shipped default): app unchanged, zero legalApi calls
GATE_OFF=1 BUNDLE_OUT=/tmp/consent-off.js node tools/legal-consent-tests/render/build.mjs
BUNDLE_OUT=/tmp/consent-off.js NODE_PATH=/tmp/rc/node_modules node tools/legal-consent-tests/render/run_off.cjs
```

## Analytics follow verified consent (2 Nov 2026 addendum)

```bash
# real ConsentProvider + a spy for src/lib/analyticsConsent.js: analytics start
# only on enforced+allowed, stop on required / unreadable / signed out / mode
# off, and the withdrawal page stops them at once
ANALYTICS_SPY=1 BUNDLE_OUT=/tmp/consent-analytics.js node tools/legal-consent-tests/render/build.mjs
BUNDLE_OUT=/tmp/consent-analytics.js NODE_PATH=/tmp/rc/node_modules node tools/legal-consent-tests/render/run_analytics.cjs
```

## Withdrawal lifecycle (GPT code audit, 2 Nov 2026)

```bash
# the REAL MyConsents page inside the REAL ConsentProvider: after a committed
# withdrawal, analytics stop, every cached query is dropped, a FRESH status
# read runs at once (periodic re-check stretched to 60 s to prove it) and the
# app moves to "required" (or "unavailable" if that read fails); a failed
# withdrawal changes nothing
ENTRY=entry_withdraw.jsx ANALYTICS_SPY=1 BUNDLE_OUT=/tmp/consent-withdraw.js node tools/legal-consent-tests/render/build.mjs
BUNDLE_OUT=/tmp/consent-withdraw.js NODE_PATH=/tmp/rc/node_modules node tools/legal-consent-tests/render/run_withdraw.cjs
# gate off (shipped default): only the cache drop + analytics stop apply
GATE_OFF=1 ENTRY=entry_withdraw.jsx ANALYTICS_SPY=1 BUNDLE_OUT=/tmp/consent-withdraw-off.js node tools/legal-consent-tests/render/build.mjs
GATE_OFF=1 BUNDLE_OUT=/tmp/consent-withdraw-off.js NODE_PATH=/tmp/rc/node_modules node tools/legal-consent-tests/render/run_withdraw.cjs
```

The live proofs (real Base44 RLS denies direct CRUD; MCP entity access off;
canary accounts) are manual — see LEGAL-CONSENT-V1-HANDOFF.md in the project.
