import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Pause, Play, PhoneOff, Loader2, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppLang } from "@/hooks/useAppLang";
import { useAuth } from "@/lib/AuthContext";
import { liveTeacherApi } from "@/lib/serverApi";
import { copyFor } from "@/lib/liveTeacher/copy";
import { createVoiceLoop, playAudio, blobToB64 } from "@/lib/liveTeacher/voiceLoop";
import { createLiveEars, streamVoice } from "@/lib/liveTeacher/liveStreams";
import { fillerMood } from "@/lib/liveTeacher/fillerMood";

// Live Teacher v2 (2026-11-20): "text brain" lessons.
//   you talk -> ElevenLabs Scribe writes it down -> the brain (OpenAI text
//   model) answers in character AND logs mistakes -> the persona's ElevenLabs
//   voice speaks. Server: base44/shared/liveTeacherVoiceEngine.js.
// v1 (/live-teacher, OpenAI realtime voice) is untouched so both can be compared.

const practiceModules = import.meta.glob("../lib/liveTeacher/practice.js", { eager: true });
const practiceFor = Object.values(practiceModules)[0]?.practiceFor || (() => []);
const safePractice = (rule, variant) => { try { return (practiceFor(rule, variant) || []).slice(0, 2); } catch { return []; } };

const PERSONAS = [
  { id: "vira", name: "Vira", blurb: "Calm, kind, friendly. 10 minutes." },
  { id: "vira_nightingale", name: "Vira Nightingale", blurb: "Elegant, soft, a little mysterious. 10 minutes." },
  { id: "velvet", name: "Velvet", blurb: "Pushy, teasing, funny. 15 minutes." },
  { id: "violet", name: "Violet", blurb: "The boss. Calm, intense, no excuses. 15 minutes." },
];
const STATE_TEXT = { listening: "Listening…", speaking: "You're talking…", waiting: "Thinking…", teacher: "Speaking…", paused: "Paused" };
const STATE_DOT = { listening: "bg-emerald-400", speaking: "bg-sky-400", waiting: "bg-amber-400", teacher: "bg-fuchsia-400", paused: "bg-white/40" };
const fmt = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;
let nextId = 1;

function RecapMistakes({ mistakes, c, lang, navigate }) {
  const list = Array.isArray(mistakes) ? mistakes : [];
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{c.recapMistakes}</h3>
      {!list.length ? <p className="text-sm text-muted-foreground">{c.recapNoMistakes}</p> : (
        <ul className="space-y-2">
          {list.map((m) => {
            const links = safePractice(m.rule, m.variant);
            return (
              <li key={m.key} className="rounded-xl border border-border p-3 text-sm space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{(m.label && (m.label[lang] || m.label.en)) || m.rule}</span>
                  <span className="text-[11px] rounded-full px-2 py-0.5 bg-white/10">{c.status[m.status] || m.status} · {m.count}×</span>
                </div>
                {m.wrong ? <p className="text-muted-foreground"><span className="line-through">{m.wrong}</span> → <span className="text-foreground">{m.correct}</span></p> : null}
                {m.explanation_uz ? <p className="text-xs text-muted-foreground">{m.explanation_uz}</p> : null}
                {links.length ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {links.map((l, i) => <Button key={l.topic} size="sm" variant="outline" className="h-8" onClick={() => navigate(l.href)}>{c.practise}{links.length > 1 ? ` ${i + 1}` : ""}</Button>)}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function LiveTeacherV2() {
  const navigate = useNavigate();
  const { lang } = useAppLang();
  const c = copyFor(lang);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [phase, setPhase] = useState("setup"); // setup | connecting | live | ending | recap
  const [persona, setPersona] = useState("vira");
  const [age, setAge] = useState("teen");
  const [noisy, setNoisy] = useState(false);
  const [loopState, setLoopState] = useState("paused");
  const [pausedReason, setPausedReason] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cost, setCost] = useState(0);
  const [recap, setRecap] = useState(null);
  const [personaName, setPersonaName] = useState("Vira");
  const [fillerNote, setFillerNote] = useState(""); // admins: which fast-path part fell back, and why
  const [timing, setTiming] = useState(""); // admins: where the waiting time went last turn
  const [partial, setPartial] = useState(""); // live caption while the student talks

  const loopRef = useRef(null);
  const lessonRef = useRef(null); // { id, deadline }
  const speechRef = useRef(null); // the teacher audio playing now: { stop() }
  const fillerRef = useRef(null); // the "hmm" playing now
  const fillerDoneRef = useRef(Promise.resolve());
  const holdTimerRef = useRef(null);
  const waitingRef = useRef(false);
  const fillersRef = useRef({}); // mood -> clips
  const recentRef = useRef({}); // mood -> last 3 clip indexes (no repeats)
  const historyRef = useRef([]); // what the server sees: [{ role, text, interrupted }]
  const phaseRef = useRef("setup");
  const handlerRef = useRef(null);
  const levelRef = useRef(null);
  const scrollRef = useRef(null);
  const endingRef = useRef(false);
  const earsRef = useRef(null); // live transcript (ElevenLabs Scribe Live)
  const playCtxRef = useRef(null); // plays the streamed voice
  const voiceInfoRef = useRef(null); // { voice_id, model }
  const streamFailsRef = useRef(0);
  const cutRef = useRef(0); // bumps on every interruption / pause: stale audio stops itself

  const note = (msg) => { if (msg) setFillerNote((n) => (n.includes(msg) ? n : `${n ? `${n} · ` : ""}${msg}`)); };
  const go = (p) => { phaseRef.current = p; setPhase(p); };
  const addTurn = (role, text, extra = {}) => {
    if (!text) return;
    const turn = { id: nextId++, role, text, ...extra };
    setTranscript((t) => [...t, turn]);
    historyRef.current = [...historyRef.current, { role, text, interrupted: false }].slice(-30);
  };

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [transcript, partial]);

  // countdown + hard stop one minute after the limit
  useEffect(() => {
    if (phase !== "live") return undefined;
    const t = setInterval(() => {
      const left = Math.round(((lessonRef.current?.deadline || 0) - Date.now()) / 1000);
      setSecondsLeft(left);
      if (left < -60) endLesson();
    }, 1000);
    return () => clearInterval(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // never leave the mic, the sockets or audio running
  useEffect(() => () => {
    stopAllAudio(); loopRef.current?.stop(); earsRef.current?.close(); playCtxRef.current?.close?.().catch?.(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function stopAllAudio() {
    speechRef.current?.stop(); speechRef.current = null;
    fillerRef.current?.stop(); fillerRef.current = null;
    clearTimeout(holdTimerRef.current);
  }

  // ---------------------------------------------------------- thinking sounds
  // Sorted by mood, saved on the phone after the first lesson (no credits, instant).
  const fillerKey = (p) => `lt-fillers:v3:${p}`;
  async function loadFillers(p) {
    let cache = {};
    try { cache = JSON.parse(localStorage.getItem(fillerKey(p)) || "{}") || {}; } catch { cache = {}; }
    fillersRef.current = cache;
    for (const mood of ["neutral", "empathy", "hold", "question", "positive"]) {
      if (Array.isArray(cache[mood]) && cache[mood].length) continue;
      try {
        const f = await liveTeacherApi("v2_fillers", { persona: p, mood });
        if (f?.clips?.length) {
          cache = { ...cache, [mood]: f.clips };
          fillersRef.current = cache;
          try { localStorage.setItem(fillerKey(p), JSON.stringify(cache)); } catch { /* storage full: keep in memory only */ }
        }
        if (f?.warning) note(`thinking sounds (${mood}): ${f.warning}`);
      } catch (e) { note(`thinking sounds (${mood}) failed: ${e.message}`); }
    }
  }
  function pickClip(mood) {
    const list = fillersRef.current[mood]?.length ? fillersRef.current[mood] : fillersRef.current.neutral;
    if (!list?.length) return null;
    const recent = recentRef.current[mood] || [];
    let options = list.map((_, i) => i).filter((i) => !recent.includes(i));
    if (!options.length) options = list.map((_, i) => i);
    const i = options[Math.floor(Math.random() * options.length)];
    recentRef.current[mood] = [...recent, i].slice(-3);
    return list[i];
  }
  function playClip(clip) {
    if (!clip) return;
    const p = playAudio(clip.audio_b64, clip.mime);
    fillerRef.current = p;
    fillerDoneRef.current = p.done;
  }
  function startThinking(mood) {
    fillerDoneRef.current = Promise.resolve();
    if (Math.random() < 0.92) playClip(pickClip(mood));
    clearTimeout(holdTimerRef.current);
    // still no answer after ~2.5 s: one "give me a second" so it never goes quiet
    holdTimerRef.current = setTimeout(async () => {
      await fillerDoneRef.current;
      if (waitingRef.current && phaseRef.current === "live") playClip(pickClip("hold"));
    }, 2600);
  }

  // ---------------------------------------------------------- teacher voice
  // Streamed straight from ElevenLabs to the phone; the server MP3 is the backup.
  async function speak(text, ttsToken, onFirstSound) {
    const cut = cutRef.current;
    loopRef.current?.teacherSpeaking();
    const info = voiceInfoRef.current;
    if (ttsToken && info && streamFailsRef.current < 2 && playCtxRef.current) {
      const s = streamVoice({ ctx: playCtxRef.current, token: ttsToken, voiceId: info.voice_id, model: info.model, text });
      speechRef.current = s;
      const ok = await s.ready;
      if (cut !== cutRef.current) { s.stop(); return "stopped"; }
      if (ok) {
        await fillerDoneRef.current; // let the "hmm" finish first
        if (cut !== cutRef.current) { s.stop(); return "stopped"; }
        s.player.release();
        onFirstSound?.();
        const why = await s.player.done;
        if (speechRef.current === s) speechRef.current = null;
        return why;
      }
      s.stop();
      streamFailsRef.current += 1;
      note(`voice stream failed (${s.error()}), using backup`);
    }
    try {
      const r = await liveTeacherApi("v2_speak", { lesson_id: lessonRef.current?.id, text });
      if (cut !== cutRef.current) return "stopped";
      await fillerDoneRef.current;
      if (cut !== cutRef.current) return "stopped";
      const p = playAudio(r.audio_b64, r.audio_mime);
      speechRef.current = p;
      onFirstSound?.();
      const why = await p.done;
      if (speechRef.current === p) speechRef.current = null;
      return why;
    } catch (e) {
      setError(e.message);
      return "error";
    }
  }

  function onBargeIn() {
    cutRef.current += 1;
    const wasTalking = !!speechRef.current;
    stopAllAudio();
    if (!wasTalking) return;
    // the brain should know it was cut off
    const h = historyRef.current;
    for (let i = h.length - 1; i >= 0; i--) if (h[i].role === "teacher") { h[i] = { ...h[i], interrupted: true }; break; }
  }

  function finishWithRecap(r) {
    cutRef.current += 1;
    stopAllAudio();
    loopRef.current?.stop();
    earsRef.current?.close();
    setRecap(r || null);
    go("recap");
  }

  // ---------------------------------------------------------- one student turn
  handlerRef.current = async ({ blob, durationS }) => {
    if (!lessonRef.current || phaseRef.current !== "live") return;
    setError("");
    const tEnd = performance.now();
    const ears = earsRef.current;
    // live ears: the transcript is (almost) ready the moment the student stops
    const text = ears?.ready ? await ears.commit(2500) : null;
    const earsMs = performance.now() - tEnd;
    setPartial("");
    if (text === null) { if (ears?.error) note(`live ears: ${ears.error}, using backup`); ears?.ensure(); }
    if (text !== null && !text.replace(/\([^)]*\)|\[[^\]]*\]/g, "").trim()) { loopRef.current?.listen(); return; } // only sounds

    startThinking(text ? fillerMood(text) : "neutral");
    waitingRef.current = true;
    const tSent = performance.now();
    let r;
    try {
      const base = { lesson_id: lessonRef.current.id, duration_s: durationS, history: historyRef.current.slice(-16), lang };
      r = text !== null
        ? await liveTeacherApi("v2_turn_text", { ...base, text }) // fast path: a few words of text
        : await liveTeacherApi("v2_turn", { ...base, audio_b64: await blobToB64(blob), mime: "audio/wav" }); // backup: upload the audio
    } catch (e) {
      waitingRef.current = false;
      stopAllAudio();
      setError(e.message || "Something went wrong. Say it again.");
      if (phaseRef.current === "live") loopRef.current?.listen();
      return;
    }
    waitingRef.current = false;
    clearTimeout(holdTimerRef.current);
    const serverMs = performance.now() - tSent;
    if (phaseRef.current !== "live") return;
    if (r.empty) { await fillerDoneRef.current; loopRef.current?.listen(); return; }

    if (typeof r.lesson_cost_usd === "number") setCost(r.lesson_cost_usd);
    addTurn("student", r.student_text, { away: r.addressed === false });
    addTurn("teacher", r.reply_text, { explanation: r.explanation_text });
    if (Array.isArray(r.mistakes)) setMistakes(r.mistakes);

    const sec = (ms) => `${(Math.max(0, ms) / 1000).toFixed(1)}s`;
    const report = () => {
      const now = performance.now();
      setTiming(`last turn: ears ${text !== null ? sec(earsMs) : "backup"} · server ${sec(serverMs)}${r.timings?.brain_ms ? ` (brain ${sec(r.timings.brain_ms)})` : ""} · voice start ${sec(now - tSent - serverMs)} · you stopped → she speaks ${sec(now - tEnd)}`);
    };
    let why;
    if (r.audio_b64) { // backup turn path: the server already made the MP3
      await fillerDoneRef.current;
      loopRef.current?.teacherSpeaking();
      const p = playAudio(r.audio_b64, r.audio_mime);
      speechRef.current = p;
      report();
      why = await p.done;
      if (speechRef.current === p) speechRef.current = null;
    } else {
      why = await speak(r.speak_text || r.reply_text, r.tts_token, report);
    }
    if (phaseRef.current !== "live") return;
    if (r.ended) { finishWithRecap({ ...r.recap, cost_usd: r.lesson_cost_usd }); return; }
    if (why === "stopped") return; // the student interrupted: the loop is already recording them
    if (r.addressed === false) { loopRef.current?.pause(); setPausedReason("away"); return; }
    loopRef.current?.listen();
  };

  async function startLesson() {
    setError(""); setTranscript([]); setMistakes([]); setCost(0); setRecap(null); setPartial(""); setFillerNote(""); setTiming("");
    historyRef.current = []; endingRef.current = false; streamFailsRef.current = 0; cutRef.current = 0;
    go("connecting");
    // made inside the tap, so the browser allows it to play sound
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      playCtxRef.current = new AC();
      playCtxRef.current.resume?.();
    } catch { playCtxRef.current = null; }
    const ears = createLiveEars({
      getToken: async () => {
        const t = await liveTeacherApi("v2_tokens", { lesson_id: lessonRef.current?.id, types: ["stt"] });
        return { token: t.stt_token, model: t.stt_live_model };
      },
      onPartial: (t) => setPartial(t),
      onStatus: (st, err) => { if (st === "error" && err) note(`live ears: ${err}`); },
    });
    earsRef.current = ears;
    const loop = createVoiceLoop({
      onUtterance: (u) => handlerRef.current?.(u),
      onBargeIn,
      onAutoPause: () => setPausedReason("idle"),
      onState: setLoopState,
      onLevel: (rms, thr) => { if (levelRef.current) levelRef.current.style.width = `${Math.min(100, (rms / (thr * 3)) * 100)}%`; },
      onTurnStart: (pre) => { if (ears.ready) ears.send(pre); else ears.ensure(); },
      onTurnChunk: (f) => ears.send(f),
      onTurnDiscard: () => { if (ears.ready) ears.commit(1500).then(() => setPartial("")); },
    });
    loopRef.current = loop;
    try {
      await loop.start();
      loop.setPushToTalk(noisy);
      const s = await liveTeacherApi("v2_start", { persona, age_group: age, lang });
      lessonRef.current = { id: s.lesson_id, deadline: Date.now() + (s.max_minutes || 10) * 60000 };
      voiceInfoRef.current = s.voice || null;
      if (s.stt_token) {
        ears.connect(s.stt_token, s.stt_live_model).then((ok) => { if (!ok) note(`live ears could not connect (${ears.error}), using backup`); });
      } else note("live ears pass missing, using backup");
      setSecondsLeft((s.max_minutes || 10) * 60);
      setPersonaName(s.persona_name || "Vira");
      if (typeof s.cost_usd === "number") setCost(s.cost_usd);
      go("live");
      addTurn("teacher", s.reply_text, { explanation: s.explanation_text });
      // thinking sounds load once the greeting is playing (not all at once)
      await speak(s.speak_text || s.reply_text, s.tts_token, () => { loadFillers(persona); });
      if (!Object.keys(fillersRef.current).length) loadFillers(persona);
      if (phaseRef.current === "live" && loop.state === "teacher") loop.listen();
    } catch (e) {
      ears.close();
      loop.stop();
      go("setup");
      setError(e?.name === "NotAllowedError" ? "Microphone access is blocked. Allow it in the browser and try again." : (e.message || "Could not start the lesson."));
    }
  }

  async function endLesson() {
    if (endingRef.current || !lessonRef.current) return;
    endingRef.current = true;
    go("ending");
    cutRef.current += 1;
    stopAllAudio();
    loopRef.current?.stop();
    earsRef.current?.close();
    try {
      const r = await liveTeacherApi("end", { lesson_id: lessonRef.current.id });
      finishWithRecap({ ...(r.recap || {}), cost_usd: cost });
    } catch (e) {
      setError(e.message);
      finishWithRecap({ summary: "", mistakes, cost_usd: cost });
    }
  }

  function pause() { cutRef.current += 1; stopAllAudio(); loopRef.current?.pause(); setPausedReason("manual"); }
  function resume() { setPausedReason(""); loopRef.current?.resume(); }

  // ------------------------------------------------------------ render
  if (phase === "recap") {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold">Lesson with {personaName}</h1>
        </div>
        {recap?.summary ? <p className="text-sm">{recap.summary}</p> : null}
        {recap?.strengths?.length ? <p className="text-sm text-emerald-300">✓ {recap.strengths.join(" · ")}</p> : null}
        {recap?.focus_next?.length ? <p className="text-sm text-muted-foreground">Next time: {recap.focus_next.join(" · ")}</p> : null}
        <RecapMistakes mistakes={recap?.mistakes || mistakes} c={c} lang={lang} navigate={navigate} />
        {isAdmin ? (
          <p className="text-xs text-muted-foreground">
            Admin: about ${Number(recap?.cost_usd ?? cost).toFixed(3)} for this lesson
            {recap?.duration_s ? ` · ${fmt(recap.duration_s)} long` : ""}
            {recap?.duration_s ? ` · ~$${((Number(recap?.cost_usd ?? cost) / Math.max(1, recap.duration_s)) * 60).toFixed(3)}/min` : ""}
          </p>
        ) : null}
        <div className="flex gap-2">
          <Button onClick={() => go("setup")}>New lesson</Button>
          <Button variant="outline" onClick={() => navigate("/")}>Home</Button>
        </div>
      </div>
    );
  }

  if (phase === "setup" || phase === "connecting") {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-xl font-bold">Live Teacher <span className="text-xs align-top rounded-full bg-white/10 px-2 py-0.5">v2 beta</span></h1>
            <p className="text-xs text-muted-foreground">Speak English with your teacher. Earphones work best.</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {PERSONAS.map((p) => (
            <button key={p.id} type="button" onClick={() => setPersona(p.id)}
              className={`rounded-xl border p-3 text-left transition ${persona === p.id ? "border-primary bg-primary/10" : "border-border hover:bg-white/5"}`}>
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.blurb}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">Age
            <select className="rounded-lg bg-background border border-border p-1.5" value={age} onChange={(e) => setAge(e.target.value)}>
              <option value="kid">Kid</option><option value="teen">Teen</option><option value="adult">Adult</option>
            </select>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={noisy} onChange={(e) => setNoisy(e.target.checked)} />
            Noisy room (hold a button to talk)
          </label>
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button size="lg" className="w-full" disabled={phase === "connecting"} onClick={startLesson}>
          {phase === "connecting" ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting…</> : <><Mic className="h-4 w-4 mr-2" />Start lesson</>}
        </Button>
      </div>
    );
  }

  // live / ending
  const paused = loopState === "paused";
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-3 h-[calc(100dvh-2rem)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${STATE_DOT[loopState] || "bg-white/40"}`} />
          <span className="text-sm font-medium">{personaName} · {STATE_TEXT[loopState] || ""}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {isAdmin ? <span>${cost.toFixed(3)}</span> : null}
          <span>{fmt(secondsLeft)}</span>
        </div>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden"><div ref={levelRef} className="h-full bg-emerald-400/70 transition-[width] duration-75" style={{ width: "0%" }} /></div>

      <motion.div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 rounded-xl border border-border p-3">
        {transcript.map((t) => (
          <div key={t.id} className={t.role === "teacher" ? "text-left" : "text-right"}>
            <div className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm ${t.role === "teacher" ? "bg-white/10" : t.away ? "bg-white/5 text-muted-foreground italic" : "bg-primary/20"}`}>
              {t.text}
              {t.explanation ? <p className="mt-1.5 pt-1.5 border-t border-white/10 text-xs text-muted-foreground">{t.explanation}</p> : null}
            </div>
          </div>
        ))}
        {partial && loopState === "speaking" ? (
          <div className="text-right"><div className="inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-primary/10 text-muted-foreground italic">{partial}</div></div>
        ) : null}
      </motion.div>

      {mistakes.length ? (
        <div className="flex flex-wrap gap-1.5">
          {mistakes.slice(-4).map((m) => (
            <span key={m.key} className="text-[11px] rounded-full px-2 py-0.5 bg-rose-500/15 text-rose-200">{m.wrong ? `${m.wrong} → ${m.correct}` : m.rule}</span>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {isAdmin && fillerNote ? <p className="text-xs text-amber-300">{fillerNote}</p> : null}
      {isAdmin && timing ? <p className="text-[11px] text-muted-foreground">{timing}</p> : null}
      {paused && pausedReason ? (
        <p className="text-sm text-muted-foreground text-center">
          {pausedReason === "away" ? "Paused. Someone needs you? Press Resume when you're back." : pausedReason === "idle" ? "Paused because it went quiet." : "Paused."}
        </p>
      ) : null}

      <div className="flex items-center justify-center gap-2">
        {noisy ? (
          <Button size="lg" className="flex-1 select-none" disabled={paused || phase !== "live"}
            onPointerDown={() => loopRef.current?.pushStart()} onPointerUp={() => loopRef.current?.pushEnd()} onPointerLeave={() => loopRef.current?.pushEnd()}>
            <Hand className="h-4 w-4 mr-2" />Hold to talk
          </Button>
        ) : null}
        {paused
          ? <Button variant="secondary" disabled={phase !== "live"} onClick={resume}><Play className="h-4 w-4 mr-1" />Resume</Button>
          : <Button variant="secondary" disabled={phase !== "live"} onClick={pause}><Pause className="h-4 w-4 mr-1" />Pause</Button>}
        <Button variant="destructive" disabled={phase !== "live"} onClick={endLesson}>
          {phase === "ending" ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <PhoneOff className="h-4 w-4 mr-1" />}End
        </Button>
      </div>
    </div>
  );
}
