import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { installConsentInterceptor } from '@/lib/legal/consentInterceptor';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl,
  // No analytics before consent: see src/lib/analyticsConsent.js.
  analytics: { enabled: false }
});


// Legal Consent Architecture §10: CONSENT_REQUIRED from any function → gate re-check.
installConsentInterceptor(base44);
