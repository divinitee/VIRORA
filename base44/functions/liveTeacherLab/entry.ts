import { createClientFromRequest } from 'npm:@base44/sdk@0.8.55';

// Live Teacher LAB (admin only). Test bench for the "text brain" pipeline
// (2026-11-18): before building the real loop we compare the EARS
// (speech-to-text) and the MOUTH (text-to-speech) providers on real audio.
//
//   status      which keys are set (booleans only, never the keys)
//   voices      ElevenLabs voice list (id, name, labels)
//   transcribe  { audio_b64, mime }  -> transcripts from OpenAI + ElevenLabs Scribe, with timings
//   speak       { provider, text, voice, model, style } -> audio (base64) + timings + cost estimate
//
// Keys live in Base44 secrets: OPENAI_API_KEY, ELEVENLABS_API_KEY, GEMINI_API_KEY.
// They are read here, used for one outbound call, and never returned or logged.

const redact = (s: unknown) =>
  String(s ?? '').replace(/(sk|ek|xi|sk_|AIza)[-_A-Za-z0-9]{8,}/g, '[redacted]').slice(0, 300);

const MAX_AUDIO_B64 = 8_000_000; // ~6 MB of audio; a test clip is ~100 KB
const MAX_TEXT = 1200;

// Uzbek learners make mistakes on purpose in these tests: the transcript must keep them.
const VERBATIM_PROMPT =
  'Transcribe exactly what the speaker says, word for word. The speaker is an English learner from Uzbekistan ' +
  'and makes grammar mistakes: keep every mistake exactly as spoken (for example "He don\'t like coffee", "I goes"). ' +
  'Do not correct grammar. Keep false starts and fillers. The speaker may switch to Uzbek or Russian: write those ' +
  'words in their own language.';

// ElevenLabs list price per 1K characters (pricing page, 2026-11-18).
const EL_PRICE_PER_1K: Record<string, number> = {
  eleven_v4: 0.08, eleven_v4_turbo: 0.04, eleven_v3: 0.08, eleven_v3_conversational: 0.04,
  eleven_multilingual_v2: 0.08, eleven_flash_v2_5: 0.04,
};
const EL_MODELS = Object.keys(EL_PRICE_PER_1K);
const GEMINI_MODELS = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];

function b64ToBytes(b64: string) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function bytesToB64(bytes: Uint8Array) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
const extFor = (mime: string) => (mime.includes('mp4') || mime.includes('m4a') ? 'm4a' : mime.includes('ogg') ? 'ogg' : mime.includes('wav') ? 'wav' : 'webm');
const ms = (t0: number) => Math.round(performance.now() - t0);

// ------------------------------------------------------------------ EARS
async function openaiTranscribe(key: string, bytes: Uint8Array, mime: string) {
  const t0 = performance.now();
  let lastErr = '';
  // gpt-transcribe is current; gpt-4o-transcribe is the fallback (deprecated Feb 2027).
  for (const model of ['gpt-transcribe', 'gpt-4o-transcribe']) {
    const fd = new FormData();
    fd.append('file', new Blob([bytes], { type: mime }), `clip.${extFor(mime)}`);
    fd.append('model', model);
    fd.append('prompt', VERBATIM_PROMPT);
    fd.append('response_format', 'json');
    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: fd,
    });
    const j: any = await r.json().catch(() => null);
    if (r.ok) return { ok: true, provider: 'openai', model, text: j?.text ?? '', ms: ms(t0) };
    lastErr = `${model}: ${r.status} ${redact(j?.error?.message)}`;
  }
  return { ok: false, provider: 'openai', error: lastErr, ms: ms(t0) };
}

async function elevenTranscribe(key: string, bytes: Uint8Array, mime: string) {
  const t0 = performance.now();
  let lastErr = '';
  for (const model of ['scribe_v3', 'scribe_v2']) {
    const fd = new FormData();
    fd.append('model_id', model);
    fd.append('file', new Blob([bytes], { type: mime }), `clip.${extFor(mime)}`);
    fd.append('tag_audio_events', 'true'); // shows (laughter), (background noise) etc.
    const r = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST', headers: { 'xi-api-key': key }, body: fd,
    });
    const j: any = await r.json().catch(() => null);
    if (r.ok) {
      return {
        ok: true, provider: 'elevenlabs', model, text: j?.text ?? '',
        language: j?.language_code || '', language_probability: j?.language_probability ?? null, ms: ms(t0),
      };
    }
    lastErr = `${model}: ${r.status} ${redact(j?.detail?.message || j?.detail || j?.message)}`;
  }
  return { ok: false, provider: 'elevenlabs', error: lastErr, ms: ms(t0) };
}

// ------------------------------------------------------------------ MOUTH
async function elevenSpeak(key: string, { text, voice, model }: { text: string; voice: string; model: string }) {
  const t0 = performance.now();
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}/stream?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: model }),
    },
  );
  if (!r.ok || !r.body) {
    const j: any = await r.json().catch(() => null);
    return { ok: false, error: `${r.status} ${redact(j?.detail?.message || j?.detail || j?.message)}`, ms: ms(t0) };
  }
  // Time to the first audio chunk = how long a student would wait before hearing her.
  const reader = r.body.getReader();
  const chunks: Uint8Array[] = [];
  let firstChunkMs: number | null = null;
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value?.length) {
      if (firstChunkMs === null) firstChunkMs = ms(t0);
      chunks.push(value);
      size += value.length;
    }
  }
  const all = new Uint8Array(size);
  let o = 0;
  for (const c of chunks) { all.set(c, o); o += c.length; }
  const price = EL_PRICE_PER_1K[model] ?? null;
  return {
    ok: true, mime: 'audio/mpeg', audio_b64: bytesToB64(all),
    first_audio_ms: firstChunkMs, total_ms: ms(t0),
    est_cost_usd: price === null ? null : Math.round((text.length / 1000) * price * 100000) / 100000,
  };
}

async function geminiSpeak(key: string, { text, voice, model, style }: { text: string; voice: string; model: string; style?: string }) {
  const t0 = performance.now();
  const content: any = { type: 'text', text };
  if (style) content.annotations = [{ type: 'speech_metadata', style }];
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      input: [{ type: 'user_input', content: [content] }],
      response_format: { type: 'audio' },
      generation_config: { speech_config: [{ voice }] },
    }),
  });
  const j: any = await r.json().catch(() => null);
  if (!r.ok) return { ok: false, error: `${r.status} ${redact(j?.error?.message)}`, ms: ms(t0) };
  let audio = '';
  for (const step of j?.steps || []) {
    if (step?.type !== 'model_output') continue;
    for (const c of step?.content || []) if (c?.type === 'audio' && c?.data) audio = c.data;
  }
  if (!audio) return { ok: false, error: 'No audio in the answer.', ms: ms(t0) };
  // Unary call: the whole clip arrives at once, so first audio = total.
  return { ok: true, mime: 'audio/wav', audio_b64: audio, first_audio_ms: ms(t0), total_ms: ms(t0), est_cost_usd: null };
}

async function elevenVoices(key: string) {
  for (const url of ['https://api.elevenlabs.io/v2/voices?page_size=100', 'https://api.elevenlabs.io/v1/voices']) {
    const r = await fetch(url, { headers: { 'xi-api-key': key } });
    const j: any = await r.json().catch(() => null);
    if (r.ok && Array.isArray(j?.voices)) {
      return j.voices.map((v: any) => ({
        id: v.voice_id, name: v.name, category: v.category || '',
        labels: [v.labels?.gender, v.labels?.age, v.labels?.accent, v.labels?.descriptive || v.labels?.description].filter(Boolean).join(' · '),
      }));
    }
  }
  return [];
}

// ------------------------------------------------------------------ glue
export default async function (req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ ok: false, code: 'admin_only', error: 'Admins only.' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const keys = {
      openai: Deno.env.get('OPENAI_API_KEY') || '',
      eleven: Deno.env.get('ELEVENLABS_API_KEY') || '',
      gemini: Deno.env.get('GEMINI_API_KEY') || '',
    };

    switch (body.action) {
      case 'status':
        return Response.json({
          ok: true,
          keys: { openai: !!keys.openai, elevenlabs: !!keys.eleven, gemini: !!keys.gemini },
          models: { elevenlabs: EL_MODELS, gemini: GEMINI_MODELS },
        });

      case 'voices': {
        if (!keys.eleven) return Response.json({ ok: true, voices: [] });
        return Response.json({ ok: true, voices: await elevenVoices(keys.eleven) });
      }

      case 'transcribe': {
        const b64 = String(body.audio_b64 || '');
        const mime = String(body.mime || 'audio/webm').slice(0, 60);
        if (!b64 || b64.length > MAX_AUDIO_B64) return Response.json({ ok: false, code: 'bad_audio', error: 'Audio missing or too long.' }, { status: 400 });
        const bytes = b64ToBytes(b64);
        const jobs: Promise<any>[] = [];
        if (keys.openai) jobs.push(openaiTranscribe(keys.openai, bytes, mime).catch((e) => ({ ok: false, provider: 'openai', error: redact(e?.message) })));
        if (keys.eleven) jobs.push(elevenTranscribe(keys.eleven, bytes, mime).catch((e) => ({ ok: false, provider: 'elevenlabs', error: redact(e?.message) })));
        return Response.json({ ok: true, results: await Promise.all(jobs) });
      }

      case 'speak': {
        const text = String(body.text || '').trim().slice(0, MAX_TEXT);
        if (!text) return Response.json({ ok: false, code: 'no_text', error: 'No text.' }, { status: 400 });
        const provider = body.provider === 'gemini' ? 'gemini' : 'elevenlabs';
        if (provider === 'elevenlabs') {
          if (!keys.eleven) return Response.json({ ok: false, code: 'no_key', error: 'ELEVENLABS_API_KEY is not set.' }, { status: 503 });
          const model = EL_MODELS.includes(body.model) ? body.model : 'eleven_v4_turbo';
          const voice = String(body.voice || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 40);
          if (!voice) return Response.json({ ok: false, code: 'no_voice', error: 'Pick a voice.' }, { status: 400 });
          const r = await elevenSpeak(keys.eleven, { text, voice, model });
          return Response.json({ provider, model, voice, chars: text.length, ...r });
        }
        if (!keys.gemini) return Response.json({ ok: false, code: 'no_key', error: 'GEMINI_API_KEY is not set.' }, { status: 503 });
        const model = GEMINI_MODELS.includes(body.model) ? body.model : GEMINI_MODELS[0];
        const voice = String(body.voice || 'Kore').replace(/[^A-Za-z]/g, '').slice(0, 30) || 'Kore';
        const style = String(body.style || '').slice(0, 200);
        const r = await geminiSpeak(keys.gemini, { text, voice, model, style });
        return Response.json({ provider, model, voice, chars: text.length, ...r });
      }

      default:
        return Response.json({ ok: false, code: 'unknown_action', error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('liveTeacherLab failed', redact((error as any)?.message));
    return Response.json({ ok: false, code: 'server_error', error: 'Lab had a problem. Try again.' }, { status: 500 });
  }
}
