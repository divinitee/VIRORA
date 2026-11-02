// Self-cancel for card plans (Tee, 2 Nov 2026: the Offer promises "cancel
// auto-renewal in Settings", and until now only an admin could cancel).
//
// Card plans are Dodo subscriptions, so the cancel happens in Dodo's own
// customer portal: Dodo stops charging the card and its webhook updates our
// row (dodoWebhook). We never cancel locally, because a local cancel would
// NOT stop Dodo charging (see isLiveCardSub in subscriptionCore.js).
// QR (manual) plans are one-off payments that never auto-renew, so there is
// nothing to cancel: Settings just says when they end.
//
// Pure helpers, shared by functions/dodoPortal and the tests.

export const DODO_API = {
  test: "https://test.dodopayments.com",
  live: "https://live.dodopayments.com",
};

// The caller's Dodo-billed subscription row, or null. Only rows the webhook
// created or updated carry provider "dodo" and a customer id; rows are looked
// up by the signed-in email, never by anything in the request.
export function cardSubscriptionFor(rows) {
  const card = (rows || []).filter((r) => r && r.provider === "dodo" && r.dodo_customer_id);
  if (!card.length) return null;
  const rank = (r) => (r.status === "active" ? 0 : r.status === "paused" ? 1 : 2);
  card.sort((a, b) => rank(a) - rank(b) || String(b.updated_date || "").localeCompare(String(a.updated_date || "")));
  return card[0];
}

export function portalSessionUrl(mode, customerId, returnUrl) {
  const base = DODO_API[mode === "live" ? "live" : "test"];
  const q = new URLSearchParams();
  if (returnUrl) q.set("return_url", returnUrl);
  const qs = q.toString();
  return `${base}/customers/${encodeURIComponent(customerId)}/customer-portal/session${qs ? `?${qs}` : ""}`;
}

// What Settings shows about billing for this subscription row.
//   card     Dodo card plan: renews on `date`, button opens the Dodo portal
//   ending   Dodo card plan already cancelled: access until `date`
//   qr       paid by QR / by hand: never renews, ends on `date`
//   null     free plan, trial, or nothing paid: no billing card
export function billingView(sub) {
  if (!sub || sub.status !== "active" || sub.is_trial) return null;
  if (!sub.plan || /free/i.test(sub.plan)) return null;
  const date = String(sub.expires_at || "").slice(0, 10) || null;
  if (sub.provider === "dodo") return { kind: sub.cancelled_at ? "ending" : "card", date, plan: sub.plan };
  return { kind: "qr", date, plan: sub.plan };
}

// dodoWebhook, subscription.updated: the portal's "cancel" usually means
// "cancel at the next billing date" (access continues until then). Mirror it
// on the row as cancelled_at, exactly like the admin panel's "cancel at
// period end", so Settings can show "ends on" and the expiry check ends it
// on time. Undoing it in the portal clears the mark. Never changes status.
// Returns a patch, or null when there's nothing to change.
export function scheduledCancelPatch(row, data, now = Date.now()) {
  if (!row || row.provider !== "dodo" || row.status !== "active") return null;
  const flag = data?.cancel_at_next_billing_date;
  if (flag === true && !row.cancelled_at) return { cancelled_at: new Date(now).toISOString().slice(0, 10) };
  if (flag === false && row.cancelled_at) return { cancelled_at: "" };
  return null;
}
