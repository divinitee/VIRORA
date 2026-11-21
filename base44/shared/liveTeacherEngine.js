// Live Teacher engine: the server-side steps of a lesson, with every outside
// dependency injected (`svc` = service-role entities, `env`, `fetchImpl`) so
// the whole flow is testable without Base44 or OpenAI
// (tools/live-teacher-tests/engine.test.mjs).
//
// base44/functions/liveTeacherApi/entry.ts is the thin glue: login, ban check,
// daily allowance, then one call into this file.
//
// Every function returns { status, body } (an HTTP status and a JSON body).
//
// SECURITY: the permanent OpenAI key is read from `env` HERE, on the server,
// and is used for exactly one call (minting a short-lived client secret). It is
// never returned, never logged. The browser only ever gets that short-lived
// secret, which can open a single Realtime session.

import {
  MAX_MINUTES, cleanMode, cleanAge, clean, normalizeProfile, emptyProfile,
  applyMistake, applyCorrectUse, applyLevelEstimate, applyPronunciation, applyVocabulary,
  finishLesson, memorySummary, publicProfileView, RULE_LABELS,
} from './liveTeacherCore.js';
import { buildInstructions, buildSessionConfig } from './liveTeacherPrompt.js';

const OPENAI_URL = 'https://api.openai.com/v1/realtime/client_secrets';
const MAX_TOOL_CALLS = 300; // per lesson; a runaway client cannot hammer the database
const GRACE_MIN = 5; // a lesson may run this long past its limit before tools are refused

const reply = (status, body) => ({ status, body });
const MAX_LESSON_MISTAKES = 30;

// VT-54.2: this lesson's own mistakes, newest last, one entry per mistake key.
export function lessonMistakes(lesson, profile, result) {
  const list = Array.isArray(lesson.mistakes) ? lesson.mistakes.filter((m) => m.key !== result.key) : [];
  const rec = profile.mistakes[result.key] || {};
  list.push({
    key: result.key, rule: rec.rule, variant: rec.variant,
    wrong: rec.wrong_example || '', correct: rec.correct_example || '', explanation_uz: rec.explanation_uz || '',
    status: result.status, count: result.total_count,
  });
  return list.slice(-MAX_LESSON_MISTAKES);
}
export const withLabels = (list) => (Array.isArray(list) ? list : []).map((m) => ({ ...m, label: RULE_LABELS[m.rule] || RULE_LABELS['other.general'] }));
const PROFILE_FIELDS = [
  'cefr_level', 'level_history', 'mode', 'age_group', 'mistakes', 'pronunciation', 'vocabulary',
  'test_results', 'progress', 'lesson_count', 'last_lesson_at', 'last_lesson_summary', 'last_focus',
];
const pick = (o) => Object.fromEntries(PROFILE_FIELDS.map((k) => [k, o[k]]));

export const isConfigured = (env) => !!env?.OPENAI_API_KEY;

export async function getOrCreateProfile(svc, email) {
  const rows = await svc.LiveTeacherProfile.filter({ user_email: email }, 'created_date', 1);
  if (rows?.length) return { row: rows[0], profile: normalizeProfile(rows[0]) };
  const row = await svc.LiveTeacherProfile.create(emptyProfile(email));
  return { row, profile: normalizeProfile(row) };
}

export const saveProfile = (svc, row, profile) => svc.LiveTeacherProfile.update(row.id, pick(profile));

// Never let an OpenAI error text carry a key-shaped string anywhere.
export const redact = (s) => String(s || '').replace(/(sk|ek)-[A-Za-z0-9_-]{8,}/g, '[redacted]').slice(0, 240);

export async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(String(text));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------- start
export async function startLesson({ svc, user, body = {}, env, fetchImpl = fetch, now = Date.now() }) {
  if (!isConfigured(env)) {
    return reply(503, { ok: false, code: 'not_configured', error: 'Live Teacher is not set up yet.' });
  }
  const mode = cleanMode(body.mode);
  const ageGroup = cleanAge(body.age_group);
  const lang = ['uz', 'ru', 'en'].includes(body.lang) ? body.lang : 'uz';

  const { row, profile } = await getOrCreateProfile(svc, user.email);
  const instructions = buildInstructions({
    mode, ageGroup, uiLang: lang, studentName: user.full_name, memory: memorySummary(profile, { now }),
  });
  const session = buildSessionConfig({ instructions, env });

  let res;
  try {
    res = await fetchImpl(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        // Ties the session to a stable, anonymous per-student id (OpenAI abuse tooling).
        'OpenAI-Safety-Identifier': await sha256Hex(user.id || user.email),
      },
      body: JSON.stringify({ session }),
    });
  } catch (e) {
    console.error('live teacher: openai unreachable', redact(e?.message));
    return reply(502, { ok: false, code: 'openai_unreachable', error: 'The voice service is unreachable. Try again.' });
  }
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok) {
    const detail = redact(data?.error?.message);
    console.error('live teacher: openai refused', res.status, detail);
    // Only admins see OpenAI's own wording (it makes set-up quick to debug);
    // students always get the generic sentence.
    const admin = user.role === 'admin';
    return reply(502, {
      ok: false, code: 'openai_rejected',
      error: admin ? `OpenAI said (${res.status}): ${detail}` : 'The voice service refused the request.',
      ...(admin ? { openai_status: res.status, openai_message: detail } : {}),
    });
  }
  const secret = data?.value || data?.client_secret?.value;
  if (!secret) return reply(502, { ok: false, code: 'openai_bad_response', error: 'The voice service sent an unexpected answer.' });

  const lesson = await svc.LiveTeacherLesson.create({
    user_email: user.email,
    mode,
    age_group: ageGroup,
    status: 'started',
    started_at: new Date(now).toISOString(),
    model: session.model,
    max_minutes: MAX_MINUTES[mode],
    tool_calls: 0,
    mistakes_logged: 0,
    new_mistakes: 0,
    repeated_mistakes: 0,
    mastered_now: 0,
  });
  // Remember the student's last choices so the page can pre-select them.
  await saveProfile(svc, row, { ...profile, mode, age_group: ageGroup });

  return reply(200, {
    ok: true,
    client_secret: secret,
    expires_at: data?.expires_at || null,
    lesson_id: lesson.id,
    model: session.model,
    mode,
    age_group: ageGroup,
    max_minutes: MAX_MINUTES[mode],
    opening_prompt: 'Start the lesson now, following FIRST TURN in your instructions. Speak first.',
    profile: publicProfileView({ ...profile, mode, age_group: ageGroup }),
  });
}

// ---------------------------------------------------------------- tools
const parseArgs = (a) => {
  if (a && typeof a === 'object' && !Array.isArray(a)) return a;
  try {
    const v = JSON.parse(String(a || '{}'));
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch { return {}; }
};

export async function loadLesson(svc, user, id, now, { allowEnded = false } = {}) {
  let lesson = null;
  try { lesson = id ? await svc.LiveTeacherLesson.get(String(id)) : null; } catch { lesson = null; }
  if (!lesson || lesson.user_email !== user.email) return { error: reply(404, { ok: false, code: 'lesson_not_found', error: 'Lesson not found.' }) };
  if (lesson.status !== 'started' && !allowEnded) return { error: reply(409, { ok: false, code: 'lesson_ended', error: 'This lesson has ended.' }) };
  const age = now - Date.parse(lesson.started_at);
  if (lesson.status === 'started' && age > (lesson.max_minutes + GRACE_MIN) * 60000) {
    return { error: reply(410, { ok: false, code: 'lesson_expired', error: 'This lesson has run out of time.' }) };
  }
  return { lesson };
}

export async function finalize(svc, { lesson, row, profile, summary, strengths, focusNext, scores, now }) {
  const next = finishLesson(profile, { mode: lesson.mode, summary, focusNext, scores, now });
  await saveProfile(svc, row, next);
  const durationS = Math.max(0, Math.round((now - Date.parse(lesson.started_at)) / 1000));
  const recap = {
    summary: clean(summary, 400),
    strengths: (Array.isArray(strengths) ? strengths : []).map((s) => clean(s, 80)).filter(Boolean).slice(0, 3),
    focus_next: next.last_focus,
    new_mistakes: lesson.new_mistakes || 0,
    repeated_mistakes: lesson.repeated_mistakes || 0,
    mastered_now: lesson.mastered_now || 0,
    cefr_level: next.cefr_level || '',
    lesson_count: next.lesson_count,
    duration_s: durationS,
    scores: scores && lesson.mode === 'exam' ? next.test_results[next.test_results.length - 1] || null : null,
    mistakes: withLabels(lesson.mistakes),
  };
  await svc.LiveTeacherLesson.update(lesson.id, {
    status: 'ended', ended_at: new Date(now).toISOString(), duration_s: durationS,
    summary: recap.summary, strengths: recap.strengths, focus_next: recap.focus_next,
    level_at_end: recap.cefr_level,
    // only when there are exam scores: v2 keeps usage / plan / strikes in scores and must not lose them
    ...(recap.scores ? { scores: recap.scores } : {}),
  });
  return recap;
}

export async function handleTool({ svc, user, body = {}, now = Date.now() }) {
  const { lesson, error } = await loadLesson(svc, user, body.lesson_id, now);
  if (error) return error;
  if ((lesson.tool_calls || 0) >= MAX_TOOL_CALLS) return reply(429, { ok: false, code: 'too_many_tool_calls', error: 'Too many actions in one lesson.' });

  const { row, profile } = await getOrCreateProfile(svc, user.email);
  const args = parseArgs(body.args);
  const ctx = { lessonId: lesson.id, mode: lesson.mode, ageGroup: lesson.age_group, now };
  const counters = { tool_calls: (lesson.tool_calls || 0) + 1 };
  let next = profile;
  let output;

  switch (body.name) {
    case 'log_mistake': {
      const r = applyMistake(profile, args, ctx);
      next = r.profile; output = r.result;
      counters.mistakes_logged = (lesson.mistakes_logged || 0) + 1;
      if (r.result.status === 'new') counters.new_mistakes = (lesson.new_mistakes || 0) + 1;
      else counters.repeated_mistakes = (lesson.repeated_mistakes || 0) + 1;
      counters.mistakes = lessonMistakes(lesson, r.profile, r.result);
      break;
    }
    case 'log_correct_use': {
      const r = applyCorrectUse(profile, args, ctx);
      next = r.profile; output = r.result;
      if (r.result.status === 'mastered') counters.mastered_now = (lesson.mastered_now || 0) + 1;
      break;
    }
    case 'set_level_estimate': { const r = applyLevelEstimate(profile, args, ctx); next = r.profile; output = r.result; break; }
    case 'log_pronunciation': { const r = applyPronunciation(profile, args, ctx); next = r.profile; output = r.result; break; }
    case 'log_vocabulary': { const r = applyVocabulary(profile, args, ctx); next = r.profile; output = r.result; break; }
    case 'end_lesson': {
      const recap = await finalize(svc, {
        lesson: { ...lesson, ...counters }, row, profile,
        summary: args.summary, strengths: args.strengths, focusNext: args.focus_next, scores: args.scores, now,
      });
      return reply(200, {
        ok: true, recap,
        output: { ok: true, directive: 'Lesson saved. Say a short goodbye now (in exam mode, first give the spoken verdict). Do not start a new topic.' },
      });
    }
    default:
      // Unknown tool: answer politely so the model recovers instead of stalling.
      return reply(200, { ok: true, output: { ok: false, error: 'unknown_tool' } });
  }

  if (next !== profile) await saveProfile(svc, row, next);
  await svc.LiveTeacherLesson.update(lesson.id, counters);
  return reply(200, { ok: true, output, profile: publicProfileView(next) });
}

// ---------------------------------------------------------------- end
/** The student pressed End (or time ran out). Idempotent. */
export async function endLesson({ svc, user, body = {}, now = Date.now() }) {
  const { lesson, error } = await loadLesson(svc, user, body.lesson_id, now, { allowEnded: true });
  if (error) return error;
  if (lesson.status === 'ended') {
    return reply(200, {
      ok: true,
      recap: {
        summary: lesson.summary || '', strengths: lesson.strengths || [], focus_next: lesson.focus_next || [],
        new_mistakes: lesson.new_mistakes || 0, repeated_mistakes: lesson.repeated_mistakes || 0,
        mastered_now: lesson.mastered_now || 0, cefr_level: lesson.level_at_end || '', duration_s: lesson.duration_s || 0,
        scores: lesson.scores || null, mistakes: withLabels(lesson.mistakes),
      },
    });
  }
  const { row, profile } = await getOrCreateProfile(svc, user.email);
  // The teacher normally saves a summary through end_lesson. If the student
  // closed early, write a plain factual one.
  const fallback = `Lesson ended early. ${lesson.mistakes_logged || 0} mistake(s) were recorded.`;
  const recap = await finalize(svc, { lesson, row, profile, summary: fallback, strengths: [], focusNext: profile.last_focus, scores: null, now });
  return reply(200, { ok: true, recap });
}

// ---------------------------------------------------------------- profile
export async function getProfileView({ svc, user }) {
  const { profile } = await getOrCreateProfile(svc, user.email);
  const lessons = await svc.LiveTeacherLesson.filter({ user_email: user.email, status: 'ended' }, '-created_date', 5);
  return reply(200, {
    ok: true,
    profile: publicProfileView(profile),
    recent_lessons: (lessons || []).map((l) => ({
      started_at: l.started_at, mode: l.mode, duration_s: l.duration_s || 0, summary: l.summary || '',
      level_at_end: l.level_at_end || '',
    })),
    limits: { max_minutes: MAX_MINUTES },
  });
}
