import { createClientFromRequest } from 'npm:@base44/sdk@0.8.55';
import { banGuard } from '../../shared/banCore.ts';
import { reserveUsage, UsageLimitError } from '../../shared/usageGuard.js';
import { aiPlanFor } from '../../shared/aiQuota.js';
import { DAILY_SESSIONS } from '../../shared/liveTeacherCore.js';
import { startLesson, handleTool, endLesson, getProfileView, isConfigured } from '../../shared/liveTeacherEngine.js';
import { startVoiceLesson, voiceTurn, fillerClips, isVoiceConfigured, voiceTurnText, speakText, phoneTokens } from '../../shared/liveTeacherVoiceEngine.js';

// Hot-path v2 actions inside a lesson that already passed the ban check at
// v2_start: skipping the extra lookup saves a database round trip per turn.
const IN_LESSON = new Set(['v2_turn_text', 'v2_speak', 'v2_tokens', 'v2_fillers']);

// Live Teacher (AI English voice teacher). Thin glue: login, ban check, daily
// allowance, then the shared engine does the work.
//
//   action 'start'    mint a SHORT-LIVED OpenAI Realtime secret for the browser
//   action 'tool'     run one teacher tool call (log_mistake, ...) and return
//                     the server's decision (new/repeated, tone, directive)
//   action 'end'      close the lesson (idempotent)
//   action 'profile'  the student's own learning profile
//
// v2 "text brain" lessons (2026-11-20, shared/liveTeacherVoiceEngine.js):
//   action 'v2_start'    open a lesson with a persona (Vira, Velvet, ...): greeting text + voice
//   action 'v2_turn'     one student turn: audio -> Scribe -> brain -> tracker -> voice
//   action 'v2_fillers'  the persona's short "hmm" clips, played while the brain thinks
//   ('end' and 'profile' are shared with v1.)
//
// The permanent key is the app secret OPENAI_API_KEY (Base44 dashboard ->
// secrets). It stays in this function; the browser only gets the short-lived
// secret. See docs/live-teacher.md.

async function planId(sr: any, user: any): Promise<string> {
  if (user.role === 'admin') return 'vip';
  let subs = await sr.entities.StudentSubscription.filter({ phone: user.email }, '-created_date', 50);
  if (!subs.length) subs = await sr.entities.StudentSubscription.filter({ created_by_id: user.id }, '-created_date', 50);
  return aiPlanFor(subs, user, 'student').id;
}

export default async function (req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json().catch(() => ({}));
    if (!IN_LESSON.has(body.action)) {
      const banned = await banGuard(base44.asServiceRole.entities, user);
      if (banned) return banned;
    }
    const svc = base44.asServiceRole.entities;
    // Only the settings this feature needs; the rest of the environment stays out of reach.
    const env: Record<string, string | undefined> = {};
    for (const k of [
      'OPENAI_API_KEY', 'LIVE_TEACHER_MODEL', 'LIVE_TEACHER_VOICE', 'LIVE_TEACHER_REASONING', 'LIVE_TEACHER_TRANSCRIBE_MODEL',
      // v2
      'ELEVENLABS_API_KEY', 'LIVE_TEACHER_BRAIN_MODEL', 'LIVE_TEACHER_BRAIN_REASONING', 'LIVE_TEACHER_TTS_MODEL',
      'LIVE_TEACHER_STT_MODEL', 'LIVE_TEACHER_AUDIO_TAGS', 'LIVE_TEACHER_VOICE_VIRA', 'LIVE_TEACHER_VOICE_VIRA_NIGHTINGALE',
      'LIVE_TEACHER_VOICE_VELVET', 'LIVE_TEACHER_VOICE_VIOLET', 'LIVE_TEACHER_STT_LIVE_MODEL',
    ]) env[k] = Deno.env.get(k);
    const out = (r: { status: number; body: unknown }) => Response.json(r.body, { status: r.status });

    switch (body.action) {
      case 'start': {
        if (!isConfigured(env)) return out(await startLesson({ svc, user, body, env })); // 503, nothing reserved
        // Daily allowance BEFORE any paid work. Admins are unlimited.
        let reservation: any = null;
        if (user.role !== 'admin') {
          const plan = await planId(base44.asServiceRole, user);
          const limit = DAILY_SESSIONS[plan as keyof typeof DAILY_SESSIONS] ?? DAILY_SESSIONS.free;
          try {
            reservation = await reserveUsage(svc, user, { bucket: 'live_teacher_session', limit });
          } catch (error) {
            if (error instanceof UsageLimitError) {
              return Response.json({ ok: false, code: 'daily_allowance_exhausted', error: 'Daily Live Teacher lessons used up.', limit }, { status: 429 });
            }
            throw error;
          }
        }
        const result = await startLesson({ svc, user, body, env });
        // No voice session was opened, so nothing was spent: give the lesson back.
        if (result.status !== 200 && reservation) await svc.UsageReservation.delete(reservation.id);
        return out(result);
      }
      case 'v2_start': {
        if (!isVoiceConfigured(env)) return out(await startVoiceLesson({ svc, user, body, env })); // 503, nothing reserved
        let reservation: any = null;
        if (user.role !== 'admin') {
          const plan = await planId(base44.asServiceRole, user);
          const limit = DAILY_SESSIONS[plan as keyof typeof DAILY_SESSIONS] ?? DAILY_SESSIONS.free;
          try {
            reservation = await reserveUsage(svc, user, { bucket: 'live_teacher_session', limit });
          } catch (error) {
            if (error instanceof UsageLimitError) {
              return Response.json({ ok: false, code: 'daily_allowance_exhausted', error: 'Daily Live Teacher lessons used up.', limit }, { status: 429 });
            }
            throw error;
          }
        }
        const result = await startVoiceLesson({ svc, user, body, env });
        if (result.status !== 200 && reservation) await svc.UsageReservation.delete(reservation.id);
        return out(result);
      }
      case 'v2_turn': return out(await voiceTurn({ svc, user, body, env }));
      case 'v2_fillers': return out(await fillerClips({ user, body, env }));
      case 'v2_turn_text': return out(await voiceTurnText({ svc, user, body, env }));
      case 'v2_speak': return out(await speakText({ svc, user, body, env }));
      case 'v2_tokens': return out(await phoneTokens({ svc, user, body, env }));
      case 'tool': return out(await handleTool({ svc, user, body }));
      case 'end': return out(await endLesson({ svc, user, body }));
      case 'profile': return out(await getProfileView({ svc, user }));
      default: return Response.json({ ok: false, error: 'Unknown action', code: 'unknown_action' }, { status: 400 });
    }
  } catch (error) {
    console.error('liveTeacherApi failed', (error as any)?.message);
    return Response.json({ ok: false, error: 'Live Teacher had a problem. Try again.', code: 'server_error' }, { status: 500 });
  }
}
