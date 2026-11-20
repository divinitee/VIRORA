// Live Teacher v2 engine (2026-11-20): the "text brain" lesson loop.
// Turn timings (ears/brain/voice) are returned to admins to find the slow part.
//
//   student audio -> EARS  ElevenLabs Scribe (speech-to-text, word for word)
//                 -> BRAIN OpenAI text model (reply + mistakes, one JSON answer)
//                 -> tracker (liveTeacherCore: new/repeated/relapse/mastered)
//                 -> MOUTH ElevenLabs voice of the chosen persona
//
// Every outside dependency is injected (`svc`, `env`, `fetchImpl`) like the v1
// engine, so this is testable without Base44, OpenAI or ElevenLabs.
// Keys (OPENAI_API_KEY, ELEVENLABS_API_KEY) are read from `env`, used for the
// outbound calls only, never returned and never logged.

import {
  clean, memorySummary, applyMistake, applyCorrectUse, applyLevelEstimate, applyVocabulary, publicProfileView,
} from './liveTeacherCore.js';
import {
  getOrCreateProfile, saveProfile, loadLesson, finalize, lessonMistakes, withLabels, redact, sha256Hex,
} from './liveTeacherEngine.js';
import {
  PERSONAS, cleanPersona, FILLERS, FILLER_TAG, brainSchema, buildBrainInstructions, buildTurnMessage, cleanBrainOutput,
  modelSupportsTags, stripAudioTags,
} from './liveTeacherBrain.js';

const reply = (status, body) => ({ status, body });
const MAX_TURNS = 200; // per lesson
const MAX_AUDIO_B64 = 4_000_000; // ~3 MB: far more than a 30-second WAV turn

// List prices (USD) used for the per-lesson cost estimate. Override nothing
// here to change billing: they only feed the estimate shown to the admin.
export const PRICES = {
  stt_per_hour: 0.20, // ElevenLabs Scribe v3
  tts_per_1k_chars: { eleven_v4_turbo: 0.04, eleven_v3_conversational: 0.04, eleven_v4: 0.08, eleven_v3: 0.08, eleven_flash_v2_5: 0.04 },
  brain_per_1m: {
    'gpt-5.6-terra': { in: 2, cached: 0.2, out: 12 },
    'gpt-5.6-sol': { in: 5, cached: 0.5, out: 30 },
    'gpt-5.6-luna': { in: 0.2, cached: 0.02, out: 1.2 },
  },
};

export function settings(env = {}) {
  return {
    brainModel: env.LIVE_TEACHER_BRAIN_MODEL || 'gpt-5.6-terra',
    // 'minimal' = fastest answers (the turn delay is mostly brain time). Falls back to 'low'.
    brainReasoning: env.LIVE_TEACHER_BRAIN_REASONING === undefined ? 'minimal' : env.LIVE_TEACHER_BRAIN_REASONING,
    ttsModel: env.LIVE_TEACHER_TTS_MODEL || 'eleven_v4_turbo',
    sttModel: env.LIVE_TEACHER_STT_MODEL || 'scribe_v3',
    audioTags: env.LIVE_TEACHER_AUDIO_TAGS !== '0',
  };
}
export const isVoiceConfigured = (env) => !!env?.OPENAI_API_KEY && !!env?.ELEVENLABS_API_KEY;

const round6 = (n) => Math.round(n * 1e6) / 1e6;
export function costOf({ sttSeconds = 0, brainModel, usage = null, ttsModel, ttsChars = 0 }) {
  const stt = (sttSeconds / 3600) * PRICES.stt_per_hour;
  const p = PRICES.brain_per_1m[brainModel] || PRICES.brain_per_1m['gpt-5.6-terra'];
  const inTok = usage?.prompt_tokens || 0;
  const cached = usage?.prompt_tokens_details?.cached_tokens || 0;
  const outTok = usage?.completion_tokens || 0;
  const brain = ((inTok - cached) * p.in + cached * p.cached + outTok * p.out) / 1e6;
  const tts = (ttsChars / 1000) * (PRICES.tts_per_1k_chars[ttsModel] ?? 0.08);
  return { stt: round6(stt), brain: round6(brain), tts: round6(tts), total: round6(stt + brain + tts), in_tokens: inTok, cached_tokens: cached, out_tokens: outTok };
}

function addUsage(prev, c, { sttSeconds = 0, ttsChars = 0 } = {}) {
  const u = prev && typeof prev === 'object' ? prev : {};
  return {
    cost_usd: round6((u.cost_usd || 0) + c.total),
    stt_usd: round6((u.stt_usd || 0) + c.stt),
    brain_usd: round6((u.brain_usd || 0) + c.brain),
    tts_usd: round6((u.tts_usd || 0) + c.tts),
    stt_seconds: Math.round(((u.stt_seconds || 0) + sttSeconds) * 10) / 10,
    tts_chars: (u.tts_chars || 0) + ttsChars,
    in_tokens: (u.in_tokens || 0) + c.in_tokens,
    cached_tokens: (u.cached_tokens || 0) + c.cached_tokens,
    out_tokens: (u.out_tokens || 0) + c.out_tokens,
    turns: (u.turns || 0) + 1,
  };
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function bytesToB64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

class ServiceError extends Error {
  constructor(code, message, status = 502) { super(message); this.code = code; this.status = status; }
}

// ------------------------------------------------------------------ voices
const voiceCache = new Map(); // persona -> voice id (per warm function instance)

export async function resolveVoice(env, persona, fetchImpl = fetch) {
  const P = PERSONAS[cleanPersona(persona)];
  const override = env[`LIVE_TEACHER_VOICE_${P.id.toUpperCase()}`];
  if (override) return override;
  if (voiceCache.has(P.id)) return voiceCache.get(P.id);
  // Search by the persona's first word first (fast, avoids paging), then the plain list.
  const first = P.voice.split(' ')[0];
  const list = [];
  for (const url of [
    `https://api.elevenlabs.io/v2/voices?page_size=100&search=${encodeURIComponent(first)}`,
    'https://api.elevenlabs.io/v2/voices?page_size=100&voice_type=personal',
    'https://api.elevenlabs.io/v2/voices?page_size=100',
  ]) {
    const res = await fetchImpl(url, { headers: { 'xi-api-key': env.ELEVENLABS_API_KEY } });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new ServiceError('voices_unavailable', `ElevenLabs voices: ${res.status} ${redact(data?.detail?.message || data?.detail)}`);
    for (const v of Array.isArray(data?.voices) ? data.voices : []) if (!list.some((x) => x.voice_id === v.voice_id)) list.push(v);
    const hit = pickVoice(list, P);
    if (hit) { voiceCache.set(P.id, hit.voice_id); return hit.voice_id; }
  }
  const seen = list.map((v) => v.name).filter(Boolean).slice(0, 12).join(', ') || 'none';
  throw new ServiceError('voice_not_found', `No ElevenLabs voice found for "${P.voice}". Voices this key can see: ${seen}. Rename your voice to "${P.voice}" (or save it to My Voices).`, 503);
}

// Names are matched loosely: "Vira", "vira_base", "Vira - teacher" all count as Vira,
// but anything with "nightingale" belongs to Vira Nightingale only.
export function pickVoice(list, P) {
  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z]+/g, ' ').trim();
  const want = norm(P.voice);
  const words = want.split(' ');
  const exact = list.find((v) => norm(v.name) === want);
  if (exact) return exact;
  return list.find((v) => {
    const n = norm(v.name).split(' ');
    if (!words.every((w) => n.includes(w))) return false;
    if (P.id === 'vira' && n.includes('nightingale')) return false;
    return true;
  }) || null;
}

// ------------------------------------------------------------------ ears
export async function transcribe(env, { bytes, mime }, fetchImpl = fetch) {
  const fd = new FormData();
  fd.append('model_id', settings(env).sttModel);
  fd.append('file', new Blob([bytes], { type: mime }), mime.includes('wav') ? 'turn.wav' : 'turn.webm');
  fd.append('tag_audio_events', 'true');
  const res = await fetchImpl('https://api.elevenlabs.io/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': env.ELEVENLABS_API_KEY }, body: fd });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ServiceError('stt_failed', `Speech-to-text: ${res.status} ${redact(data?.detail?.message || data?.detail)}`);
  return { text: clean(data?.text, 1500), language: data?.language_code || '' };
}

// ------------------------------------------------------------------ brain
export async function think(env, { instructions, message, safetyId }, fetchImpl = fetch) {
  const s = settings(env);
  const body = {
    model: s.brainModel,
    messages: [{ role: 'system', content: instructions }, { role: 'user', content: message }],
    response_format: { type: 'json_schema', json_schema: { name: 'teacher_turn', strict: true, schema: brainSchema() } },
    max_completion_tokens: 2000,
    ...(s.brainReasoning ? { reasoning_effort: s.brainReasoning } : {}),
    ...(safetyId ? { safety_identifier: safetyId } : {}),
  };
  const call = (b) => fetchImpl('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(b),
  });
  let res = await call(body);
  let data = await res.json().catch(() => null);
  // A model may not accept 'minimal' (or these optional fields): step down to
  // 'low', then drop the optional fields altogether.
  const refused = () => res.status === 400 && /reasoning|safety_identifier/i.test(String(data?.error?.message || ''));
  if (refused() && body.reasoning_effort && body.reasoning_effort !== 'low') {
    res = await call({ ...body, reasoning_effort: 'low' });
    data = await res.json().catch(() => null);
  }
  if (refused()) {
    const { reasoning_effort, safety_identifier, ...rest } = body;
    res = await call(rest);
    data = await res.json().catch(() => null);
  }
  if (!res.ok) throw new ServiceError('brain_failed', `Brain: ${res.status} ${redact(data?.error?.message)}`);
  const content = data?.choices?.[0]?.message?.content;
  let parsed = null;
  try { parsed = JSON.parse(content || '{}'); } catch { parsed = null; }
  if (!parsed) throw new ServiceError('brain_bad_json', 'Brain: unreadable answer');
  return { out: cleanBrainOutput(parsed), usage: data?.usage || null, model: data?.model || s.brainModel };
}

// ------------------------------------------------------------------ mouth
export async function speak(env, { voiceId, text }, fetchImpl = fetch) {
  const s = settings(env);
  const spoken = s.audioTags && modelSupportsTags(s.ttsModel) ? text : stripAudioTags(text);
  if (!stripAudioTags(spoken)) return { audio_b64: '', chars: 0, mime: 'audio/mpeg' };
  const res = await fetchImpl(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text: spoken, model_id: s.ttsModel }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ServiceError('tts_failed', `Voice: ${res.status} ${redact(data?.detail?.message || data?.detail)}`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  return { audio_b64: bytesToB64(bytes), chars: spoken.length, mime: 'audio/mpeg' };
}

// ------------------------------------------------------------------ helpers
function errorReply(user, e) {
  const admin = user?.role === 'admin';
  const code = e?.code || 'server_error';
  console.error('live teacher v2:', code, redact(e?.message));
  const friendly = code === 'voice_not_found' ? 'The teacher voice is not set up yet.' : 'The teacher had a problem. Try again.';
  return reply(e?.status || 502, { ok: false, code, error: admin ? redact(e?.message) : friendly });
}

function cleanHistory(h) {
  return (Array.isArray(h) ? h : []).slice(-16).map((t) => ({
    role: t?.role === 'teacher' ? 'teacher' : 'student',
    text: clean(t?.text, 400),
    interrupted: !!t?.interrupted,
  })).filter((t) => t.text);
}

// Apply the brain's report to the student's profile + this lesson's counters.
function applyReport(profile, lesson, out, ctx) {
  let p = profile;
  let l = { ...lesson };
  const counters = {};
  if (!out.addressed_to_teacher) return { profile: p, lesson: l, counters };
  for (const m of out.mistakes) {
    const r = applyMistake(p, m, ctx);
    p = r.profile;
    counters.mistakes_logged = (l.mistakes_logged || 0) + 1;
    if (r.result.status === 'new') counters.new_mistakes = (l.new_mistakes || 0) + 1;
    else counters.repeated_mistakes = (l.repeated_mistakes || 0) + 1;
    counters.mistakes = lessonMistakes(l, p, r.result);
    l = { ...l, ...counters };
  }
  for (const c of out.correct_uses) {
    const r = applyCorrectUse(p, c, ctx);
    p = r.profile;
    if (r.result.status === 'mastered') { counters.mastered_now = (l.mastered_now || 0) + 1; l = { ...l, ...counters }; }
  }
  if (out.level_estimate) p = applyLevelEstimate(p, { cefr: out.level_estimate, confidence: 0.6 }, ctx).profile;
  for (const v of out.vocabulary) p = applyVocabulary(p, v, ctx).profile;
  return { profile: p, lesson: l, counters };
}

// ------------------------------------------------------------------ start
export async function startVoiceLesson({ svc, user, body = {}, env, fetchImpl = fetch, now = Date.now() }) {
  if (!isVoiceConfigured(env)) return reply(503, { ok: false, code: 'not_configured', error: 'Live Teacher v2 is not set up yet.' });
  const persona = cleanPersona(body.persona);
  const P = PERSONAS[persona];
  const ageGroup = ['kid', 'teen', 'adult'].includes(body.age_group) ? body.age_group : 'teen';
  const lang = ['uz', 'ru', 'en'].includes(body.lang) ? body.lang : 'uz';
  const s = settings(env);
  try {
    const voiceId = await resolveVoice(env, persona, fetchImpl);
    const { row, profile } = await getOrCreateProfile(svc, user.email);
    const instructions = buildBrainInstructions({ persona, ageGroup, uiLang: lang, studentName: user.full_name, memory: memorySummary(profile, { now }), audioTags: s.audioTags && modelSupportsTags(s.ttsModel) });
    const safetyId = await sha256Hex(user.id || user.email);
    const { out, usage } = await think(env, { instructions, message: buildTurnMessage({ persona, start: true }), safetyId }, fetchImpl);
    const voice = await speak(env, { voiceId, text: out.reply }, fetchImpl);
    const c = costOf({ brainModel: s.brainModel, usage, ttsModel: s.ttsModel, ttsChars: voice.chars });
    const lesson = await svc.LiveTeacherLesson.create({
      user_email: user.email, mode: P.mode, age_group: ageGroup, status: 'started',
      started_at: new Date(now).toISOString(),
      model: `v2:${persona}|${s.brainModel}|${s.ttsModel}`,
      max_minutes: P.minutes, tool_calls: 0, mistakes_logged: 0, new_mistakes: 0, repeated_mistakes: 0, mastered_now: 0,
      // v2 keeps its usage/cost estimate here (no schema change needed): scores.usage
      scores: { usage: addUsage(null, c, { ttsChars: voice.chars }) },
    });
    await saveProfile(svc, row, { ...profile, age_group: ageGroup });
    return reply(200, {
      ok: true, lesson_id: lesson.id, persona, persona_name: P.name, max_minutes: P.minutes,
      reply_text: stripAudioTags(out.reply), explanation_text: out.explanation_text,
      audio_b64: voice.audio_b64, audio_mime: voice.mime,
      cost_usd: c.total, profile: publicProfileView(profile),
    });
  } catch (e) {
    return errorReply(user, e);
  }
}

// ------------------------------------------------------------------ fillers
const fillerCache = new Map(); // voiceId|model -> clips (per warm instance)

export async function fillerClips({ user, body = {}, env, fetchImpl = fetch }) {
  if (!isVoiceConfigured(env)) return reply(503, { ok: false, code: 'not_configured', error: 'Not set up.' });
  const persona = cleanPersona(body.persona);
  try {
    const voiceId = await resolveVoice(env, persona, fetchImpl);
    const key = `${voiceId}|${settings(env).ttsModel}|v2`;
    if (fillerCache.has(key)) return reply(200, { ok: true, clips: fillerCache.get(key) });
    // Two at a time with one retry: ElevenLabs refuses too many parallel requests
    // (that silently killed every filler in the first live test, 2026-11-20).
    // One fixed mood tag per persona, so every "hmm" has the same feel as the
    // teacher (no more sad "mhm" followed by a cheerful answer).
    const one = async (text) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const v = await speak(env, { voiceId, text: `${FILLER_TAG[persona]} ${text}` }, fetchImpl);
          if (v.audio_b64) return { text, audio_b64: v.audio_b64, mime: v.mime };
        } catch (e) {
          if (attempt === 1) throw e;
          await new Promise((r) => setTimeout(r, 700));
        }
      }
      return null;
    };
    const clips = [];
    let lastError = '';
    const lines = FILLERS[persona];
    for (let i = 0; i < lines.length; i += 2) {
      const got = await Promise.allSettled(lines.slice(i, i + 2).map(one));
      for (const g of got) {
        if (g.status === 'fulfilled' && g.value) clips.push(g.value);
        else if (g.status === 'rejected') lastError = redact(g.reason?.message);
      }
    }
    if (clips.length === lines.length) fillerCache.set(key, clips); // cache only a full set
    if (!clips.length) throw new ServiceError('fillers_failed', `Fillers: ${lastError || 'no audio'}`);
    return reply(200, { ok: true, clips, ...(lastError && user?.role === 'admin' ? { warning: lastError } : {}) });
  } catch (e) {
    return errorReply(user, e);
  }
}

// ------------------------------------------------------------------ turn
export async function voiceTurn({ svc, user, body = {}, env, fetchImpl = fetch, now = Date.now() }) {
  if (!isVoiceConfigured(env)) return reply(503, { ok: false, code: 'not_configured', error: 'Not set up.' });
  const { lesson, error } = await loadLesson(svc, user, body.lesson_id, now);
  if (error) return error;
  if ((lesson.tool_calls || 0) >= MAX_TURNS) return reply(429, { ok: false, code: 'too_many_turns', error: 'This lesson is very long. Start a new one.' });
  const persona = cleanPersona(String(lesson.model || '').match(/^v2:([a-z_]+)/)?.[1] || body.persona);
  const P = PERSONAS[persona];
  const s = settings(env);

  const b64 = String(body.audio_b64 || '');
  if (!b64 || b64.length > MAX_AUDIO_B64) return reply(400, { ok: false, code: 'bad_audio', error: 'Audio missing or too long.' });
  const mime = String(body.mime || 'audio/wav').slice(0, 40);
  const sttSeconds = Math.max(0, Math.min(60, Number(body.duration_s) || 0));

  const t0 = Date.now();
  const timings = {};
  try {
    const heard = await transcribe(env, { bytes: b64ToBytes(b64), mime }, fetchImpl);
    timings.ears_ms = Date.now() - t0;
    // Scribe tags sounds as (laughter) or [mouse clicking] (sometimes in another
    // language, e.g. "[notification की आवाज़]"): a turn that is ONLY sounds is not speech.
    const words = heard.text.replace(/\([^)]*\)|\[[^\]]*\]/g, '').trim();
    if (words.length < 2) {
      // Nothing usable (silence, a cough). No brain call, no voice: just listen again.
      const c = costOf({ sttSeconds, brainModel: s.brainModel, ttsModel: s.ttsModel });
      await svc.LiveTeacherLesson.update(lesson.id, { scores: { usage: addUsage(lesson.scores?.usage, c, { sttSeconds }) } });
      return reply(200, { ok: true, empty: true, student_text: heard.text, cost_usd: c.total });
    }

    const { row, profile } = await getOrCreateProfile(svc, user.email);
    const minutesLeft = lesson.max_minutes - (now - Date.parse(lesson.started_at)) / 60000;
    const instructions = buildBrainInstructions({
      persona, ageGroup: lesson.age_group, uiLang: ['uz', 'ru', 'en'].includes(body.lang) ? body.lang : 'uz',
      studentName: user.full_name, memory: memorySummary(profile, { now }), audioTags: s.audioTags && modelSupportsTags(s.ttsModel),
    });
    const message = buildTurnMessage({ persona, history: cleanHistory(body.history), studentText: heard.text, lessonMistakes: lesson.mistakes, minutesLeft });
    const tBrain = Date.now();
    const { out, usage } = await think(env, { instructions, message, safetyId: await sha256Hex(user.id || user.email) }, fetchImpl);
    timings.brain_ms = Date.now() - tBrain;

    const ctx = { lessonId: lesson.id, mode: lesson.mode, ageGroup: lesson.age_group, now };
    const applied = applyReport(profile, lesson, out, ctx);
    if (applied.profile !== profile) await saveProfile(svc, row, applied.profile);

    const voiceId = await resolveVoice(env, persona, fetchImpl);
    const tVoice = Date.now();
    const voice = await speak(env, { voiceId, text: out.reply }, fetchImpl);
    timings.voice_ms = Date.now() - tVoice;
    const c = costOf({ sttSeconds, brainModel: s.brainModel, usage, ttsModel: s.ttsModel, ttsChars: voice.chars });
    const usageTotal = addUsage(lesson.scores?.usage, c, { sttSeconds, ttsChars: voice.chars });
    const updated = { ...applied.lesson, tool_calls: (lesson.tool_calls || 0) + 1, scores: { usage: usageTotal } };
    await svc.LiveTeacherLesson.update(lesson.id, { ...applied.counters, tool_calls: updated.tool_calls, scores: updated.scores });

    let recap = null;
    if (out.end_lesson) {
      const { row: row2, profile: p2 } = await getOrCreateProfile(svc, user.email);
      recap = await finalize(svc, { lesson: updated, row: row2, profile: p2, summary: out.summary, strengths: out.strengths, focusNext: out.focus_next, scores: null, now });
      recap = { ...recap, usage: usageTotal };
    }
    console.log('live teacher v2 turn', JSON.stringify({ lesson: lesson.id, persona, cost: c.total, lesson_cost: usageTotal.cost_usd, addressed: out.addressed_to_teacher, mistakes: out.mistakes.length }));

    return reply(200, {
      ok: true,
      student_text: heard.text,
      student_language: heard.language,
      addressed: out.addressed_to_teacher,
      reply_text: stripAudioTags(out.reply),
      explanation_text: out.explanation_text,
      audio_b64: voice.audio_b64, audio_mime: voice.mime,
      mistakes: withLabels(updated.mistakes),
      new_this_turn: out.addressed_to_teacher ? out.mistakes.length : 0,
      ended: !!recap, recap,
      cost_usd: c.total, lesson_cost_usd: usageTotal.cost_usd,
      persona_name: P.name,
      // where the waiting time goes (admins only)
      ...(user.role === 'admin' ? { timings: { ...timings, server_ms: Date.now() - t0 } } : {}),
    });
  } catch (e) {
    return errorReply(user, e);
  }
}
