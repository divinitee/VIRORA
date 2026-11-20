// Live Teacher v2 fast path (2026-11-20 evening): the phone talks to
// ElevenLabs DIRECTLY with single-use passes minted by our server.
//
//   createLiveEars   streams the student's voice to Scribe Live while they talk,
//                    so the transcript is ready the moment they stop.
//   streamVoice      streams the teacher's voice (Text to Dialogue WebSocket,
//                    raw PCM) and plays it as it arrives.
//
// Both are best-effort: on any failure the page falls back to the server path
// (upload the WAV / ask the server for an MP3), so a lesson never breaks.

const f32ToPcm16B64 = (f32) => {
  const buf = new ArrayBuffer(f32.length * 2);
  const v = new DataView(buf);
  for (let i = 0; i < f32.length; i++) {
    const s = Math.max(-1, Math.min(1, f32[i]));
    v.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};

// ------------------------------------------------------------------ ears
export function createLiveEars({ getToken, onPartial, onStatus } = {}) {
  let ws = null;
  let open = false;
  let connecting = null;
  let model = 'scribe_v3_live';
  let pending = null; // { resolve, timer }
  let lastError = '';

  const status = (s) => onStatus?.(s, lastError);

  function connect(token, liveModel) {
    if (liveModel) model = liveModel;
    return new Promise((resolve) => {
      if (!token) { lastError = 'no pass'; status('down'); resolve(false); return; }
      const url = `wss://api.elevenlabs.io/v1/speech-to-text/realtime?model_id=${encodeURIComponent(model)}&token=${encodeURIComponent(token)}&audio_format=pcm_16000&commit_strategy=manual`;
      let settled = false;
      const done = (ok) => { if (!settled) { settled = true; resolve(ok); } };
      try { ws = new WebSocket(url); } catch (e) { lastError = e.message; status('down'); done(false); return; }
      const timer = setTimeout(() => { lastError = 'connect timeout'; done(false); }, 6000);
      ws.onopen = () => { open = true; clearTimeout(timer); status('up'); done(true); };
      ws.onmessage = (e) => {
        let m; try { m = JSON.parse(e.data); } catch { return; }
        const type = m.message_type;
        if (type === 'partial_transcript') onPartial?.(m.text || '');
        else if (type === 'committed_transcript') {
          if (pending) { clearTimeout(pending.timer); const p = pending; pending = null; p.resolve(m.text || ''); }
        } else if (m.error || /error|limit|exceeded|throttled/i.test(String(type || ''))) {
          lastError = String(m.error || type);
          status('error');
        }
      };
      ws.onerror = () => { lastError = lastError || 'socket error'; };
      ws.onclose = (ev) => {
        open = false; ws = null; clearTimeout(timer);
        if (ev?.reason) lastError = ev.reason;
        status('down');
        if (pending) { clearTimeout(pending.timer); const p = pending; pending = null; p.resolve(null); }
        done(false);
      };
    });
  }

  return {
    get ready() { return open; },
    get error() { return lastError; },
    connect,
    /** Make sure we are connected (fresh pass from the server if the old one is gone). */
    ensure() {
      if (open || connecting) return;
      connecting = (async () => {
        try { const t = await getToken?.(); if (t?.token) await connect(t.token, t.model); } finally { connecting = null; }
      })();
    },
    send(f32) {
      if (!open || !ws || !f32?.length) return;
      try { ws.send(JSON.stringify({ message_type: 'input_audio_chunk', audio_base_64: f32ToPcm16B64(f32), sample_rate: 16000 })); } catch { /* ignore */ }
    },
    /** The student finished: ask for the final transcript. null = failed (use the server path). */
    commit(timeoutMs = 2500) {
      if (!open || !ws) return Promise.resolve(null);
      return new Promise((resolve) => {
        if (pending) { clearTimeout(pending.timer); pending.resolve(null); }
        pending = { resolve, timer: setTimeout(() => { pending = null; lastError = 'no transcript in time'; resolve(null); }, timeoutMs) };
        try {
          // a few ms of silence carries the commit flag
          ws.send(JSON.stringify({ message_type: 'input_audio_chunk', audio_base_64: f32ToPcm16B64(new Float32Array(320)), commit: true, sample_rate: 16000 }));
        } catch { clearTimeout(pending.timer); pending = null; resolve(null); }
      });
    },
    close() { try { ws?.close(); } catch { /* ignore */ } ws = null; open = false; },
  };
}

// ------------------------------------------------------------------ voice
const PCM_RATE = 22050;

/** A tiny streaming player: schedules PCM chunks back to back on one AudioContext. */
export function createPcmPlayer(ctx, rate = PCM_RATE) {
  let next = 0;
  let held = true;
  let finished = false;
  let stopped = false;
  let carry = null; // odd byte left over between chunks
  const queue = [];
  const sources = new Set();
  let resolveDone;
  const done = new Promise((r) => { resolveDone = r; });
  const maybeDone = () => { if (finished && !held && !queue.length && !sources.size) resolveDone(stopped ? 'stopped' : 'ended'); };

  const decode = (b64) => {
    const bin = atob(b64);
    let bytes = new Uint8Array(bin.length + (carry !== null ? 1 : 0));
    let o = 0;
    if (carry !== null) { bytes[0] = carry; o = 1; carry = null; }
    for (let i = 0; i < bin.length; i++) bytes[o + i] = bin.charCodeAt(i);
    if (bytes.length % 2) { carry = bytes[bytes.length - 1]; bytes = bytes.subarray(0, bytes.length - 1); }
    const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.length);
    const out = new Float32Array(bytes.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = v.getInt16(i * 2, true) / 0x8000;
    return out;
  };
  const schedule = (f32) => {
    if (!f32.length) return;
    const buf = ctx.createBuffer(1, f32.length, rate);
    buf.copyToChannel(f32, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    const at = Math.max(next, ctx.currentTime + 0.04);
    src.start(at);
    next = at + buf.duration;
    sources.add(src);
    src.onended = () => { sources.delete(src); maybeDone(); };
  };

  return {
    done,
    push(b64) { if (stopped) return; const f = decode(b64); if (held) queue.push(f); else schedule(f); },
    /** Start playing (audio that arrived while a filler was playing waits until now). */
    release() { if (stopped) return; held = false; while (queue.length) schedule(queue.shift()); maybeDone(); },
    finish() { finished = true; maybeDone(); },
    stop() {
      stopped = true; held = false; queue.length = 0; finished = true;
      for (const s of sources) { try { s.stop(); } catch { /* ignore */ } }
      sources.clear();
      resolveDone('stopped');
    },
  };
}

/**
 * Stream one teacher reply. Returns { player, ready, error(), stop() }.
 * `ready` resolves true at the first audio chunk, false if streaming failed
 * before any audio (then use the server MP3 fallback).
 */
export function streamVoice({ ctx, token, voiceId, model, text, timeoutMs = 4000 }) {
  const player = createPcmPlayer(ctx);
  let ws = null;
  let got = false;
  let err = '';
  const ready = new Promise((resolve) => {
    const fail = (why) => { err = err || why; if (!got) resolve(false); };
    if (!token || !voiceId) { fail('no pass'); return; }
    const url = `wss://api.elevenlabs.io/v1/text-to-dialogue/stream-input?model_id=${encodeURIComponent(model)}&output_format=pcm_${PCM_RATE}&single_use_token=${encodeURIComponent(token)}`;
    try { ws = new WebSocket(url); } catch (e) { fail(e.message); return; }
    const timer = setTimeout(() => fail('no audio in time'), timeoutMs);
    ws.onopen = () => {
      try {
        ws.send(JSON.stringify({ voices: [voiceId] }));
        ws.send(JSON.stringify({ inputs: [{ text, voice_id: voiceId }] }));
        ws.send(JSON.stringify({ flush: true }));
        ws.send(JSON.stringify({ close_socket: true }));
      } catch (e) { fail(e.message); }
    };
    ws.onmessage = (e) => {
      let m; try { m = JSON.parse(e.data); } catch { return; }
      if (m.audio) {
        if (!got) { got = true; clearTimeout(timer); resolve(true); }
        player.push(m.audio);
      }
      if (m.is_final_audio_for_turn || m.is_final || m.isFinal) player.finish();
      if (m.error || m.message_type === 'error') fail(String(m.error || m.message || 'voice error'));
    };
    ws.onerror = () => fail('voice socket error');
    ws.onclose = (ev) => { clearTimeout(timer); player.finish(); if (!got) fail(`voice socket closed ${ev?.code || ''} ${ev?.reason || ''}`.trim()); };
  });
  return {
    player,
    ready,
    error: () => err,
    stop() { try { ws?.close(); } catch { /* ignore */ } player.stop(); },
  };
}

// ------------------------------------------------------------------ direct ears (2026-11-20 night)
// The live (streaming) transcriber heard natural, accented speech badly in
// the first test. This sends the finished turn straight from the phone to the
// accurate batch transcriber (Scribe v3) with a single-use pass: same
// accuracy as before, without the detour through our server.
export async function transcribeDirect({ blob, token, model = 'scribe_v3', timeoutMs = 7000 }) {
  if (!token || !blob) return { ok: false, error: 'no pass' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const fd = new FormData();
    fd.append('model_id', model);
    fd.append('file', blob, 'turn.wav');
    fd.append('tag_audio_events', 'true');
    const res = await fetch(`https://api.elevenlabs.io/v1/speech-to-text?token=${encodeURIComponent(token)}`, { method: 'POST', body: fd, signal: ctrl.signal });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: `${res.status} ${data?.detail?.status || data?.detail?.message || data?.detail || ''}`.trim() };
    return { ok: true, text: String(data?.text || '').trim(), language: data?.language_code || '' };
  } catch (e) {
    return { ok: false, error: e?.name === 'AbortError' ? 'timeout' : (e?.message || 'network') };
  } finally {
    clearTimeout(timer);
  }
}
