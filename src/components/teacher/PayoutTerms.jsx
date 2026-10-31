import React, { useState } from "react";
import { ChevronDown, ScrollText } from "lucide-react";

const ITEMS = [
  ["Operator", "Normatov Temur Ulug'bekovich (PINFL: 52407056180013)."],
  ["Commission & Attribution", "Calculated at the active Teacher Dashboard percentage on verified subscription payments made using the Teacher's unique referral code."],
  ["14-Day Verification Hold", "All commissions enter a 14-calendar-day verification hold from the transaction timestamp to cover gateway settlement and fraud checks before unlocking for withdrawal."],
  ["Fair Investigation & Clawback Rules", "Self-referrals and artificial sign-ups are prohibited. Flagged transactions are paused with in-app notice; the Teacher has 7 calendar days to submit evidence, and VIRORA issues a decision within 7 business days. Post-payout clawbacks apply solely to processor-verified fraud or chargebacks."],
  ["2026 Uzbekistan Tax Compliance (Decree No. UP-50)", "Teachers act as independent civil-law referrers and confirm registration as an Individual Entrepreneur (YaTT) or Self-Employed (O'zini o'zi band qilgan) under a valid 2026 activity code (such as Activity #36 Online Trainer/Consultant or #35 Internet Project Coordinator). Teachers are responsible for their own 1% turnover tax; applicable transfer or statutory fees are deducted prior to payout."],
];

export default function PayoutTerms() {
  const [open, setOpen] = useState(false);
  return (
    <section className="premium-card p-5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between font-bold">
        <span className="flex items-center gap-2"><ScrollText className="w-4 h-4" /> Payout Terms & Guidelines</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <dl className="mt-4 space-y-3 text-sm select-text">
          {ITEMS.map(([k, v]) => (
            <div key={k}><dt className="font-semibold">{k}</dt><dd className="text-muted-foreground">{v}</dd></div>
          ))}
        </dl>
      )}
    </section>
  );
}