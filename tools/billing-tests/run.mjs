// node tools/billing-tests/run.mjs   (from the app root)
// Self-cancel for card plans: who gets a portal, what Settings shows, and how
// a cancel scheduled in Dodo's portal is mirrored on the row.
import fs from "node:fs";
import { billingView, cardSubscriptionFor, customerOwnedBy, customerUrl, portalSessionUrl, scheduledCancelPatch } from "../../base44/shared/billingPortal.js";

let fails = 0, n = 0;
const eq = (got, want, msg) => {
  n++;
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}${ok ? "" : `  got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
  if (!ok) fails++;
};
const NOW = Date.parse("2026-11-02T08:00:00Z");

// Portal eligibility
eq(cardSubscriptionFor([]), null, "no rows: no portal");
eq(cardSubscriptionFor([{ provider: "manual", status: "active", plan: "Learner" }]), null, "QR / manual plan: no portal (nothing to cancel)");
eq(cardSubscriptionFor([{ provider: "dodo", status: "active" }]), null, "dodo row without a customer id: no portal");
eq(cardSubscriptionFor([
  { id: "old", provider: "dodo", dodo_customer_id: "cus_old", status: "cancelled", updated_date: "2026-10-30" },
  { id: "live", provider: "dodo", dodo_customer_id: "cus_live", status: "active", updated_date: "2026-10-01" },
])?.id, "live", "active card row preferred over an old cancelled one");

// Dodo URL
eq(portalSessionUrl("live", "cus_A/B", "https://virora.base44.app/settings"),
  "https://live.dodopayments.com/customers/cus_A%2FB/customer-portal/session?return_url=https%3A%2F%2Fvirora.base44.app%2Fsettings",
  "live portal URL, customer id escaped, return URL set");
eq(portalSessionUrl("whatever", "cus_1").startsWith("https://test.dodopayments.com/"), true, "anything but live → test host");

// Second ownership check: Dodo's customer record must carry the caller's email
eq(customerOwnedBy({ email: "Ana@Example.com " }, "ana@example.com"), true, "Dodo customer email matches the account (case/space-insensitive)");
eq(customerOwnedBy({ email: "bob@example.com" }, "ana@example.com"), false, "different email: portal refused");
eq(customerOwnedBy({}, "ana@example.com"), false, "no email on the customer: refused (fail closed)");
eq(customerOwnedBy(null, "ana@example.com"), false, "no customer record: refused");
eq(customerUrl("live", "cus_1"), "https://live.dodopayments.com/customers/cus_1", "customer lookup URL");

// Settings view
eq(billingView(null), null, "no row: no card");
eq(billingView({ status: "active", plan: "Free Plan" }), null, "free plan: no card");
eq(billingView({ status: "active", plan: "Learner", is_trial: true }), null, "trial: no card");
eq(billingView({ status: "inactive", plan: "Learner", provider: "dodo" }), null, "lapsed: no card");
eq(billingView({ status: "active", plan: "Learner", provider: "dodo", expires_at: "2026-12-01" }), { kind: "card", date: "2026-12-01", plan: "Learner" }, "card plan: renews on date, cancel button");
eq(billingView({ status: "active", plan: "VIP", provider: "dodo", cancelled_at: "2026-11-02", expires_at: "2026-12-01" }).kind, "ending", "cancelled card plan: shows the end date");
eq(billingView({ status: "active", plan: "Learner", provider: "manual", expires_at: "2026-11-30" }), { kind: "qr", date: "2026-11-30", plan: "Learner" }, "QR plan: no button, ends on date");

// Webhook mirroring (subscription.updated)
const live = { provider: "dodo", status: "active" };
eq(scheduledCancelPatch(live, { cancel_at_next_billing_date: true }, NOW), { cancelled_at: "2026-11-02" }, "portal cancel → cancelled_at today, status untouched");
eq(scheduledCancelPatch({ ...live, cancelled_at: "2026-11-01" }, { cancel_at_next_billing_date: true }, NOW), null, "already marked: no change");
eq(scheduledCancelPatch({ ...live, cancelled_at: "2026-11-01" }, { cancel_at_next_billing_date: false }, NOW), { cancelled_at: "" }, "cancel undone in portal → mark cleared");
eq(scheduledCancelPatch(live, {}, NOW), null, "other updates: no change");
eq(scheduledCancelPatch({ provider: "manual", status: "active" }, { cancel_at_next_billing_date: true }, NOW), null, "never touches a manual row");
eq(scheduledCancelPatch({ provider: "dodo", status: "cancelled" }, { cancel_at_next_billing_date: false }, NOW), null, "never touches a non-active row");

// Wiring (static)
const hook = fs.readFileSync("base44/functions/dodoWebhook/entry.ts", "utf8");
eq(/type === "subscription\.updated" \? \(scheduledCancelPatch\(row, data\)/.test(hook), true, "dodoWebhook mirrors subscription.updated");
const portal = fs.readFileSync("base44/functions/dodoPortal/entry.ts", "utf8");
eq(/filter\(\{ phone: me\.email \}\)/.test(portal) && !/body\.(customer|email|dodo)/.test(portal), true, "dodoPortal finds the customer from the session, not the body");
eq(/StudentSubscription\.(update|create|delete)/.test(portal), false, "dodoPortal never edits the row (Dodo's webhook does)");

const portalSrc = fs.readFileSync("base44/functions/dodoPortal/entry.ts", "utf8");
eq(portalSrc.indexOf("customerOwnedBy(") > 0 && portalSrc.indexOf("customerOwnedBy(") < portalSrc.indexOf("portalSessionUrl(mode"), true, "dodoPortal checks Dodo-side ownership BEFORE creating a portal session");
eq(/if \(!cust\.ok\)[\s\S]{0,200}status: 502/.test(portalSrc), true, "a failed customer lookup refuses the portal (fail closed)");

console.log(fails ? `\n${fails}/${n} FAILED` : `\nALL PASS (${n})`);
process.exit(fails ? 1 : 0);
