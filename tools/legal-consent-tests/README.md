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

# lease expiry with two handlers really overlapping (GPT re-review 2 Nov):
# A is parked mid-request, the clock passes its lease, B runs for real, then A
# resumes → the stale-holder fence before every append makes A abort with
# LEGAL_WRITE_BUSY and write nothing; A never releases B's lock; 429 on claim
# backs off; the one residual window (an append in flight past the margin) is
# shown and collapsed by readers
deno test --allow-read tools/legal-consent-tests/lease.test.ts

# complete history (GPT re-review 2 Nov): withdrawal / re-grant after more than
# 1,000 rows is seen; count() mismatch re-reads then fails closed; past the
# hard max fails closed (never a truncated evaluation)
deno test --allow-read tools/legal-consent-tests/history.test.ts

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

## Removed on purpose: `TeacherCoPlanChat.jsx`, `VocabTutorChat.jsx`

Both components called `base44.agents.*` straight from the browser — an AI
path that bypasses every backend consent guard. Neither was mounted anywhere
(no imports). The Legal v1.3 audit (Q2) said "either delete those components
or disable the agent"; this branch deletes them and `static.test.ts`
("agents: no browser code calls Base44 agents") keeps it that way. The
`vocabulary_tutor` agent itself must also be disabled in the Base44 dashboard
before enforcement (tracked on the taskboard, VT-47).

## Base44 claim semantics (live, 2 Nov 2026)

The write lock relies on `updateMany({ id, <field>: v }, …)` being an atomic
conditional write. Documented in SDK 0.8.57 (`entities.types.d.ts`, "Claim a
record … Only one user can claim the task, even if several try at the same
time") and docs.base44.com (entity-schemas, "Concurrent updates": conditions
"are only checked again at the moment of the write when the query names a
single record's id"). Verified on this app with a temporary probe task
(VT-47.1): 6 rounds of 9–20 simultaneous conditional claims → exactly one
`updated: 1` per round; a naive read-then-write control lost 29 of 30
updates. Base44 also rate-limits bulk updates to 50 per 60 s per caller (a
service token is one caller), so the lock spends only 2 calls per write
(claim + release) and the fence is a local lease check.

## Operations (before and after enforcement)

### Canary self-test of the write lock (first step after deploy, mode still off)
`legalApi` → `{ action: "adminLockSelfTest" }` as a legal publisher. It runs 4
rounds of 9 simultaneous conditional claims on the REAL `ConsentWriteLock`
through the service role (reserved shard 1000; no user lock, no evidence
written) and returns per-round winners plus a verdict. `ATOMIC` requires EVERY
requested round to complete cleanly: no 429, no error, no failed round,
exactly one winner, everyone else `updated: 0`, `version_advanced_by: 1`, and
the stored holder is that winner's token. Anything else is `NOT_PROVEN` →
do not enable consent; if it was a rate limit, wait a minute and run it again.
Uses ≤ 40 of the 50-per-minute bulk-update budget; run it at a quiet moment.

### Shared rate limit → `LEGAL_WRITE_BUSY`
Base44 allows 50 bulk updates (updateMany / upsert / bulk) per 60 s per
caller, and the service token used by every backend function is ONE caller.
Consent writes spend 2 (claim + release) per accepted submission or
withdrawal; `progressApi` coin rewards spend 1 per rewarded round (VT-48).

- **Signal:** every refusal logs one JSON line
  `{"event":"legal_write_busy","reason":"rate_limited"|"contended"|"fenced"|"error",…}`
  (no user id). Read with `GET /api/apps/{app}/functions-mgmt/legalApi/logs`.
- **User impact:** the gate / My consents show "couldn't save, retry"; the
  ticks and the idempotency key are kept, so a retry is exact. Nothing is
  written without the lock, ever.
- **Watch:** more than 3 `rate_limited` lines in 10 minutes, or any during a
  release roll-out → check whether coin rewards are saturating the bucket.
- **Respond, in order:** (1) do not roll out a new legal release during peak
  practice hours — re-consent bursts are the main consent load; (2) VT-48:
  take coin rewards off the shared bucket (per-row `update()` with a
  read-check, or batch them); (3) ask Base44 for a higher bulk limit. There is
  deliberately no bypass that writes evidence without the lock.

### History size → retention
Consent evidence is append-only and kept for the account's lifetime plus the
statutory retention period the lawyer sets (§15 sign-off item); no archival or
deletion in v1. A user adds rows only by deliberate grant / withdraw actions.

- `consent_history_large` (≥ 5,000 rows for one user) logs a warning; that is
  months of continuous toggling, so treat it as abuse or a bug and contact the
  user.
- `consent_history_over_max` (more than 20,000; exactly 20,000 still reads) means everything consent-related fails
  closed for that user: status, receipts and withdrawal all answer 503, and
  every guarded function denies. No processing happens, which is the same
  effect a withdrawal would have, so nobody is processed without verifiable
  consent; the cost is that this user is locked out until ops acts.
  Response: raise `RECORD_MAX` after review (reads are paged and count-checked,
  so a higher cap is safe, only slower), or — if this ever becomes normal —
  v2 checkpointing (a server-signed status snapshot row that readers start
  from), which needs its own legal review because it changes how evidence is
  evaluated.

The live proofs (real Base44 RLS denies direct CRUD; MCP entity access off;
canary accounts) are manual — see LEGAL-CONSENT-V1-HANDOFF.md in the project.
