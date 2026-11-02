import { createClientFromRequest } from 'npm:@base44/sdk@0.8.55';
import { secrets } from 'base44:runtime';
import { createLegalApiHandler } from '../../shared/legalApiHandler.js';

// legalApi: legal release registry + server-written consent evidence
// (Legal Consent Architecture v1.0). All logic is in
// base44/shared/legalApiHandler.js; tests in tools/legal-consent-tests.
//
// Public:        getPublishedLegalPackage
// Signed-in:     getConsentStatus, recordConsent, withdrawConsent, listMyConsents
// Publisher:     adminListReleases, adminCreateDraft, adminPublishRelease
//
// This function is deliberately NOT consent-gated: it is the control plane
// a not-yet-consented user needs to see documents, consent or withdraw.

Deno.serve(createLegalApiHandler({
  createClientFromRequest,
  getSecret: (name: string) => secrets.get(name),
}));
