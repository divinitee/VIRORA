import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { secrets } from 'base44:runtime';
import { consentFilter } from '../../shared/consentGuard.js';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Runs from the daily schedule (admin identity) or an admin; nobody else
    // may trigger a mass email.
    const caller = await base44.auth.me();
    if (!caller || caller.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all users (service role) — these are the people who installed/registered
    const users = await base44.asServiceRole.entities.User.list();

    // Legal consent (v1.0 §9): no reminder emails to anyone the consent
    // system says has not accepted the current release (when enforced).
    const mayContact = await consentFilter(base44.asServiceRole.entities, { getSecret: (n: string) => secrets.get(n) });

    let sent = 0;
    let skippedConsent = 0;
    for (const u of users) {
      if (!u.email) continue;
      if (!(await mayContact(u))) { skippedConsent++; continue; }
      // Skip users who disabled notifications
      if (u.notifications_enabled === false) continue;
      const name = u.full_name || u.email.split('@')[0];
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: u.email,
        subject: "📚 Bugun so'z o'rganishni unutmang!",
        body: `Assalomu alaykum, ${name}!\n\nBugungi kun uchun 10-15 daqiqa vaqt ajratib yangi so'zlarni o'rganing va test topshiring. Har kuni muntazam mashq — eng samarali usul! 🎯\n\nSo'zlar ro'yxati va o'yinlar sizni kutmoqda.\n\nHurmat bilan,\nVocabulary Master jamoasi`
      });
      sent++;
    }

    return Response.json({ success: true, sent, skippedConsent, total: users.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});