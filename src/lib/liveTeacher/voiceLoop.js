// Live Teacher v2 browser side (2026-11-20): microphone, voice activity
// detection (VAD), interruptions, and teacher audio playback.
//
// The mic is captured as raw PCM, downsampled to 16 kHz and packed as WAV per
// student turn. That keeps ~0.5 s of audio from BEFORE the voice was detected
// (so the first word is never cut) and needs no codec support.
//
// States:
//   listening  waiting for the student to talk
//   speaking   the student is talking (collecting audio)
//   waiting    a turn is with the server (mic ignored)
//   teacher    the teacher is talking (a LOUD voice = the student interrupts)
//   paused     nothing happens until resume()

const OUT_RATE = 16000;
const PREROLL_S = 0.5;
const START_MS = 160; // voice this long = the student started talking
const END_SILENCE_MS = 850; // quiet this long = the student finished (was 1100: felt slow in the first live test)
const MIN_TURN_MS = 350;
const MAX_TURN_S = 30;
const BARGE_MS = 300; // the student must talk this long over the teacher to interrupt
const BARGE_FACTOR = 2.2; // and this much louder than normal speech threshold
const AUTO_PAUSE_MS = 25000; // nobody talks this long after the teacher -> pause

export function encodeWav(samples, rate = OUT_RATE) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); w(8, 'WAVE');
  w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, samples.length * 2, true);
  let o = 44;
  for (let i = 0; i < samples.length; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: 'audio/wav' });
}

function downsample(input, inRate) {
  if (inRate === OUT_RATE) return Float32Array.from(input);
  const ratio = inRate / OUT_RATE;
  const out = new Float32Array(Math.floor(input.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j];
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

const concat = (chunks) => {
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Float32Array(total);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
};

export const blobToB64 = (blob) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1] || '');
  r.onerror = reject;
  r.readAsDataURL(blob);
});

/**
 * createVoiceLoop({ onUtterance, onBargeIn, onAutoPause, onState, onLevel })
 * onUtterance({ blob, durationS }) fires when the student finished a turn.
 */
export function createVoiceLoop({ onUtterance, onBargeIn, onAutoPause, onState, onLevel, onTurnStart, onTurnChunk, onTurnDiscard } = {}) {
  let ctx = null; let stream = null; let source = null; let proc = null;
  let state = 'paused';
  let pushToTalk = false;
  let floor = 0.01; let calibrating = 0;
  let preroll = []; let prerollLen = 0;
  let turn = []; let voicedMs = 0; let silenceMs = 0; let turnMs = 0;
  let loudMs = 0; let quietSinceMs = 0;

  const threshold = () => Math.min(0.08, Math.max(0.012, floor * 3));
  const set = (s) => { if (state !== s) { state = s; onState?.(s); } };

  function beginTurn() {
    turn = [...preroll]; voicedMs = 0; silenceMs = 0; turnMs = 0;
    set('speaking');
    // live ears: send the pre-roll first so the first word is not cut
    onTurnStart?.(concat(turn));
  }
  function finishTurn() {
    const ms = turnMs;
    const samples = concat(turn);
    turn = [];
    if (voicedMs < MIN_TURN_MS) { onTurnDiscard?.(); set('listening'); return; }
    set('waiting');
    onUtterance?.({ blob: encodeWav(samples), durationS: Math.round((samples.length / OUT_RATE) * 10) / 10, ms });
  }

  function onFrame(e) {
    const input = e.inputBuffer.getChannelData(0);
    let sum = 0;
    for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
    const rms = Math.sqrt(sum / input.length);
    const frameMs = (input.length / ctx.sampleRate) * 1000;
    const small = downsample(input, ctx.sampleRate);
    onLevel?.(rms, threshold());

    // keep the last PREROLL_S of audio
    preroll.push(small); prerollLen += small.length;
    while (prerollLen - preroll[0].length > PREROLL_S * OUT_RATE) prerollLen -= preroll.shift().length;

    if (calibrating > 0) { floor = floor * 0.8 + rms * 0.2; calibrating -= frameMs; return; }
    const thr = threshold();
    const voice = rms > thr;
    if (!voice && state !== 'speaking') floor = floor * 0.97 + rms * 0.03; // slowly follow the room

    switch (state) {
      case 'listening': {
        if (pushToTalk) return;
        if (voice) { loudMs += frameMs; if (loudMs >= START_MS) { loudMs = 0; beginTurn(); voicedMs = START_MS; } }
        else {
          loudMs = 0;
          quietSinceMs += frameMs;
          if (quietSinceMs >= AUTO_PAUSE_MS) { quietSinceMs = 0; set('paused'); onAutoPause?.(); }
        }
        if (voice) quietSinceMs = 0;
        break;
      }
      case 'teacher': {
        if (pushToTalk) return;
        if (rms > thr * BARGE_FACTOR) {
          loudMs += frameMs;
          if (loudMs >= BARGE_MS) { loudMs = 0; onBargeIn?.(); beginTurn(); voicedMs = BARGE_MS; }
        } else loudMs = Math.max(0, loudMs - frameMs);
        break;
      }
      case 'speaking': {
        turn.push(small); turnMs += frameMs;
        onTurnChunk?.(small);
        if (voice) { voicedMs += frameMs; silenceMs = 0; } else silenceMs += frameMs;
        if (!pushToTalk && (silenceMs >= END_SILENCE_MS || turnMs >= MAX_TURN_S * 1000)) finishTurn();
        else if (pushToTalk && turnMs >= MAX_TURN_S * 1000) finishTurn();
        break;
      }
      default: break; // waiting / paused: ignore the mic
    }
  }

  return {
    async start() {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      if (ctx.state === 'suspended') await ctx.resume();
      source = ctx.createMediaStreamSource(stream);
      proc = ctx.createScriptProcessor(2048, 1, 1);
      proc.onaudioprocess = onFrame;
      const mute = ctx.createGain(); mute.gain.value = 0; // processor must be connected to run; keep it silent
      source.connect(proc); proc.connect(mute); mute.connect(ctx.destination);
      calibrating = 600; // learn the room noise first
    },
    stop() {
      try { proc && (proc.onaudioprocess = null); source?.disconnect(); proc?.disconnect(); } catch { /* ignore */ }
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close().catch(() => {});
      ctx = null; stream = null; source = null; proc = null;
      set('paused');
    },
    get state() { return state; },
    listen() { loudMs = 0; quietSinceMs = 0; set('listening'); },
    teacherSpeaking() { loudMs = 0; set('teacher'); },
    waiting() { set('waiting'); },
    pause() { turn = []; set('paused'); },
    resume() { loudMs = 0; quietSinceMs = 0; set('listening'); },
    setPushToTalk(on) { pushToTalk = !!on; },
    // push-to-talk (noisy room): hold to talk
    pushStart() { if (state === 'listening' || state === 'teacher') { if (state === 'teacher') onBargeIn?.(); beginTurn(); } },
    pushEnd() { if (state === 'speaking') { voicedMs = Math.max(voicedMs, turnMs); finishTurn(); } },
  };
}

/** Play base64 audio. Returns { done: Promise, stop() }. */
export function playAudio(b64, mime = 'audio/mpeg') {
  if (!b64) return { done: Promise.resolve('empty'), stop() {} };
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
  const audio = new Audio(url);
  let finish;
  const done = new Promise((r) => { finish = r; });
  const end = (why) => { URL.revokeObjectURL(url); finish(why); };
  audio.onended = () => end('ended');
  audio.onerror = () => end('error');
  audio.play().catch(() => end('blocked'));
  return { done, stop() { audio.pause(); end('stopped'); } };
}
