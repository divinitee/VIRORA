import { createClientFromRequest } from 'npm:@base44/sdk@0.8.55';
import { secrets } from 'base44:runtime';
import { reserveUsage, UsageLimitError } from '../../shared/usageGuard.js';
import { cardSubscriptionFor, portalSessionUrl } from '../../shared/billingPortal.js';

// Opens Dodo's customer portal for the CALLING user, where they can cancel
// auto-renewal (or update their card / download invoices). Returns { url }
// for the app to redirect to. The cancel itself happens at Dodo; dodoWebhook
// then updates the subscription row. See base44/shared/billingPortal.js.
//
// The customer is found from the signed-in account's own subscription row,
// never from the request body, so nobody can open another person's portal.
//
// Secrets: DODO_API_KEY (required here), DODO_MODE ("test" default | "live").

// Where the portal's back button returns to. Same host as createDodoCheckout.
const RETURN_URL = 'https://virora.base44.app/settings';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ ok: false, error: 'POST only' }, { status: 405 });
  try {
    const base44 = createClientFromRequest(req);
    let me: any = null;
    try { me = await base44.auth.me(); } catch { me = null; }
    if (!me?.email) return Response.json({ ok: false, error: 'not authenticated', code: 'unauthenticated' }, { status: 401 });

    const svc = base44.asServiceRole.entities;
    const rows = (await svc.StudentSubscription.filter({ phone: me.email })) || [];
    const sub = cardSubscriptionFor(rows);
    if (!sub) return Response.json({ ok: false, error: 'no card subscription', code: 'no_card_plan' }, { status: 404 });

    const apiKey = secrets.get('DODO_API_KEY');
    if (!apiKey) return Response.json({ ok: false, error: 'billing portal not configured', code: 'not_configured' }, { status: 503 });

    try {
      await reserveUsage(svc, { id: me.id || '', email: me.email }, { bucket: 'billing_portal', limit: 20 });
    } catch (e) {
      if (e instanceof UsageLimitError) return Response.json({ ok: false, error: 'too many requests today', code: 'rate_limited' }, { status: 429 });
      throw e;
    }

    const mode = (secrets.get('DODO_MODE') || 'test') === 'live' ? 'live' : 'test';
    const res = await fetch(portalSessionUrl(mode, sub.dodo_customer_id, RETURN_URL), {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const payload: any = await res.json().catch(() => ({}));
    if (!res.ok || !payload?.link) {
      console.error('Dodo portal session failed:', res.status, payload);
      return Response.json({ ok: false, error: 'portal unavailable', code: 'portal_failed' }, { status: 502 });
    }
    return Response.json({ ok: true, url: payload.link });
  } catch (error: any) {
    console.error('dodoPortal error:', error?.message || error);
    return Response.json({ ok: false, error: 'server error', code: 'server_error' }, { status: 500 });
  }
});
