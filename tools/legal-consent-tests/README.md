# Legal consent tests (Legal Consent Architecture v1.0)

Run from the app root.

```bash
# backend core, legalApi handler, consent guard (§14 matrix rows are prefixed "matrix:")
deno test --allow-read tools/legal-consent-tests/legal.test.ts

# static: legal entities RLS never; nothing updates/deletes them; browser never
# touches them; EVERY backend function is guarded, filtered or explicitly
# exempt (a new function fails until someone classifies it); no browser agent calls
deno test --allow-read tools/legal-consent-tests/static.test.ts

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

The live proofs (real Base44 RLS denies direct CRUD; MCP entity access off;
canary accounts) are manual — see LEGAL-CONSENT-V1-HANDOFF.md in the project.
