// Browser side of the Live Teacher voice link (OpenAI Realtime API over WebRTC).
//
// SECURITY: the browser never sees the permanent OpenAI key. It receives a
// short-lived client secret minted by liveTeacherApi('start') and uses it for
// exactly one WebRTC session. The teacher's instructions and tools are fixed
// by the server inside that secret; the browser cannot change them.
//
// Flow: mic -> RTCPeerConnection -> OpenAI. The model's voice comes back on
// the audio track; JSON events (transcripts, tool calls) travel on the
// "oai-events" data channel. Tool calls are executed by OUR server
// (runTool -> liveTeacherApi('tool')), because the server owns the mistake
// counters; the result goes back to the model as function_call_output.
//
// Interruptions: the session uses server-side turn detection with
// interrupt_response, so when the student starts talking OpenAI stops the
// teacher's audio itself. We only mirror that in the UI.

const CALLS_URL = 'https://api.openai.com/v1/realtime/calls';

export class LiveError extends Error {
  constructor(code, message) { super(message || code); this.code = code; }
}

/**
 * @param {{ clientSecret: string, openingPrompt: string,
 *           onEvent: (e: object) => void,
 *           runTool: (call: {name: string, args: string, call_id: string}) => Promise<object> }} opts
 */
export function createRealtimeSession({ clientSecret, openingPrompt, onEvent, runTool }) {
  let pc = null;
  let dc = null;
  let stream = null;
  let audioEl = null;
  let closed = false;

  // tool-call bookkeeping: answer ALL tool calls of a response, then ask for ONE new response
  let chain = Promise.resolve();
  const seenCalls = new Set();
  let pending = 0;
  let hadCalls = false;
  let responseDone = false;
  let needsContinue = false;

  const seenTypes = new Set(); // debug: log each event type once (VT-54.1)
  const emit = (e) => { try { onEvent(e); } catch { /* UI errors must not break the link */ } };
  const send = (obj) => { if (dc && dc.readyState === 'open') dc.send(JSON.stringify(obj)); };

  function maybeContinue() {
    if (needsContinue && responseDone && pending === 0) {
      needsContinue = false;
      send({ type: 'response.create' });
    }
  }

  function handleCall(callId, name, args) {
    if (!callId || seenCalls.has(callId)) return;
    seenCalls.add(callId);
    hadCalls = true;
    pending += 1;
    chain = chain.then(async () => {
      let output;
      try {
        output = await runTool({ name, args, call_id: callId });
      } catch {
        output = { ok: false, error: 'tool_failed' };
      }
      send({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: callId, output: JSON.stringify(output ?? { ok: true }) } });
      pending -= 1;
      maybeContinue();
    });
  }

  function onMessage(raw) {
    let ev;
    try { ev = JSON.parse(raw); } catch { return; }
    switch (ev.type) {
      case 'input_audio_buffer.speech_started':
        emit({ type: 'state', state: 'listening' });
        emit({ type: 'student_speaking' });
        break;
      case 'input_audio_buffer.speech_stopped':
        emit({ type: 'state', state: 'thinking' });
        break;
      // two spellings across API versions
      case 'conversation.item.added':
      case 'conversation.item.created':
        if (ev.item?.role === 'user') emit({ type: 'user_item', id: ev.item.id });
        break;
      case 'conversation.item.input_audio_transcription.completed':
        emit({ type: 'user_transcript', id: ev.item_id, text: String(ev.transcript || '').trim() });
        break;
      case 'response.created':
        responseDone = false;
        hadCalls = false;
        emit({ type: 'state', state: 'thinking' });
        break;
      case 'response.output_audio_transcript.delta':
      case 'response.audio_transcript.delta':
        emit({ type: 'assistant_delta', id: ev.item_id, delta: ev.delta || '' });
        break;
      case 'response.output_audio_transcript.done':
      case 'response.audio_transcript.done':
        emit({ type: 'assistant_done', id: ev.item_id, text: ev.transcript || '' });
        break;
      case 'output_audio_buffer.started':
        emit({ type: 'state', state: 'speaking' });
        break;
      case 'output_audio_buffer.stopped':
      case 'output_audio_buffer.cleared':
        emit({ type: 'state', state: 'idle' });
        emit({ type: 'audio_stopped' });
        break;
      // VT-54.1 (2026-11-17): the first live lesson sent ZERO tool calls to the
      // server. Function calls are now taken from every place the GA API can
      // carry them, de-duplicated by call_id. arguments.done is only used when
      // it carries the name (it may not), so it can never claim a call_id first
      // with an empty name.
      case 'response.function_call_arguments.done':
        console.debug('[live-teacher] args.done', { call_id: ev.call_id, has_name: !!ev.name });
        if (ev.name) handleCall(ev.call_id, ev.name, ev.arguments);
        break;
      case 'response.output_item.done':
        if (ev.item?.type === 'function_call') handleCall(ev.item.call_id, ev.item.name, ev.item.arguments);
        break;
      case 'response.done':
        console.debug('[live-teacher] response.done', ev.response?.status, ev.response?.status_details || '');
        for (const o of ev.response?.output || []) {
          if (o?.type === 'function_call') handleCall(o.call_id, o.name, o.arguments);
        }
        responseDone = true;
        if (hadCalls) needsContinue = true;
        if (ev.response?.status === 'failed') {
          emit({ type: 'error', code: 'response_failed', message: ev.response?.status_details?.error?.message || 'response_failed' });
        }
        maybeContinue();
        break;
      case 'error':
        emit({ type: 'error', code: ev.error?.code || 'realtime_error', message: ev.error?.message || 'realtime_error' });
        break;
      default:
        break;
    }
    if (ev.type && !seenTypes.has(ev.type)) {
      seenTypes.add(ev.type);
      console.debug('[live-teacher] event', ev.type);
    }
  }

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') {
      throw new LiveError('unsupported', 'This browser cannot do voice.');
    }
    emit({ type: 'state', state: 'connecting' });
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch (e) {
      throw new LiveError(e?.name === 'NotFoundError' ? 'mic_missing' : 'mic_denied', e?.message);
    }

    pc = new RTCPeerConnection();
    audioEl = new Audio();
    audioEl.autoplay = true;
    audioEl.playsInline = true;
    pc.ontrack = (e) => { audioEl.srcObject = e.streams[0]; };
    pc.onconnectionstatechange = () => {
      if (closed) return;
      // 'disconnected' is often a brief network blip that heals by itself: only react to a real loss.
      if (['failed', 'closed'].includes(pc.connectionState)) {
        emit({ type: 'closed', reason: pc.connectionState });
      }
    };
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    dc = pc.createDataChannel('oai-events');
    dc.onmessage = (e) => onMessage(e.data);
    dc.onopen = () => {
      emit({ type: 'state', state: 'connected' });
      // The teacher speaks first. The opening goes in as a message, NOT as
      // response.instructions: that field REPLACES the session instructions for
      // the response, so the greeting would have run without the persona,
      // the memory and the tools.
      send({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: `[${openingPrompt}]` }] } });
      send({ type: 'response.create' });
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    let res;
    try {
      res = await fetch(CALLS_URL, {
        method: 'POST',
        body: offer.sdp,
        headers: { Authorization: `Bearer ${clientSecret}`, 'Content-Type': 'application/sdp' },
      });
    } catch {
      throw new LiveError('connect_failed', 'Could not reach the voice service.');
    }
    if (!res.ok) throw new LiveError(res.status === 401 ? 'secret_expired' : 'connect_failed', `Voice service answered ${res.status}.`);
    await pc.setRemoteDescription({ type: 'answer', sdp: await res.text() });
  }

  return {
    start,
    /** Ask the teacher to wrap up: she calls end_lesson, then says goodbye. */
    requestEnd() {
      send({
        type: 'conversation.item.create',
        item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: '[The student pressed the End button. Wrap up now: call end_lesson, then say a very short goodbye.]' }] },
      });
      send({ type: 'response.create' });
    },
    setMuted(muted) { stream?.getAudioTracks().forEach((t) => { t.enabled = !muted; }); },
    stop() {
      closed = true;
      try { dc?.close(); } catch { /* already closed */ }
      try { stream?.getTracks().forEach((t) => t.stop()); } catch { /* already stopped */ }
      try { pc?.close(); } catch { /* already closed */ }
      if (audioEl) { audioEl.srcObject = null; audioEl = null; }
      dc = null; pc = null; stream = null;
    },
  };
}
