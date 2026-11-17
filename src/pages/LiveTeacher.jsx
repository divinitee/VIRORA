import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, MicOff, PhoneOff, Loader2, GraduationCap, Flame, Smile, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppLang } from "@/hooks/useAppLang";
import { liveTeacherApi } from "@/lib/serverApi";
import { createRealtimeSession } from "@/lib/liveTeacher/realtimeClient";
import { copyFor } from "@/lib/liveTeacher/copy";

// VT-54.2: mistake -> grammar exercise links come from src/lib/liveTeacher/practice.js
// (built in lane B). Loaded through a glob so the page builds and works before
// that file exists: until then the recap simply shows no practice buttons.
const practiceModules = import.meta.glob("../lib/liveTeacher/practice.js", { eager: true });
const practiceFor = Object.values(practiceModules)[0]?.practiceFor || (() => []);
const safePractice = (rule, variant) => {
  try { return (practiceFor(rule, variant) || []).slice(0, 2); } catch { return []; }
};

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
                  <span className="text-[11px] rounded-full px-2 py-0.5 bg-white/10">{c.status[m.status] || m.status} \u00b7 {m.count}\u00d7</span>
                </div>
                {m.wrong ? <p className="text-muted-foreground"><span className="line-through">{m.wrong}</span> \u2192 <span className="text-foreground">{m.correct}</span></p> : null}
                {m.explanation_uz ? <p className="text-xs text-muted-foreground">{m.explanation_uz}</p> : null}
                {links.length ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {links.map((l) => (
                      <Button key={l.topic} size="sm" variant="outline" className="h-8" onClick={() => navigate(l.href)}>{c.practise}</Button>
                    ))}
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

// Live Teacher: a real-time VOICE lesson with the AI English teacher.
// Architecture and security notes: docs/live-teacher.md.
//   server  base44/functions/liveTeacherApi (mints the short-lived voice token,
//           owns the mistake counters and the student's memory)
//   voice   src/lib/liveTeacher/realtimeClient.js (WebRTC straight to OpenAI)

const MODE_ICON = { normal: Smile, strict: Flame, exam: GraduationCap };
const STATE_DOT = { listening: "bg-emerald-400", speaking: "bg-sky-400", thinking: "bg-amber-400", idle: "bg-white/40", connected: "bg-white/40", connecting: "bg-amber-400" };

const fmt = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;

function upsert(list, id, role, text) {
  if (!text) return list;
  const i = list.findIndex((m) => m.id === id);
  if (i === -1) return [...list, { id, role, text }];
  const next = list.slice();
  next[i] = { ...next[i], role, text };
  return next;
}

function Orb({ state }) {
  const active = state === "speaking" || state === "listening";
  return (
    <motion.div
      aria-hidden="true"
      className="mx-auto rounded-full"
      style={{
        width: 112, height: 112,
        background: "radial-gradient(circle at 30% 30%, #fff8, hsl(var(--primary)) 45%, #0006)",
        boxShadow: "0 0 40px hsl(var(--primary) / 0.45)",
      }}
      animate={{ scale: active ? [1, 1.12, 1] : [1, 1.04, 1] }}
      transition={{ duration: active ? 1.1 : 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function MistakeList({ mistakes, c, lang }) {
  const top = (mistakes || []).slice(0, 6);
  if (!top.length) return <p className="text-sm text-muted-foreground">{c.noMistakes}</p>;
  return (
    <ul className="space-y-2">
      {top.map((m) => {
        const status = m.status === "mastered" ? "mastered" : m.count > 1 ? "repeated" : "new";
        const tone = status === "mastered" ? "bg-emerald-500/15 text-emerald-300" : status === "repeated" ? "bg-rose-500/15 text-rose-300" : "bg-amber-500/15 text-amber-300";
        return (
          <li key={m.key} className="rounded-xl border border-border p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{(m.label && (m.label[lang] || m.label.en)) || m.rule}</span>
              <span className={`text-[11px] rounded-full px-2 py-0.5 ${tone}`}>{c.status[status]} · {m.count}× </span>
            </div>
            {m.wrong ? <p className="mt-1 text-muted-foreground"><span className="line-through">{m.wrong}</span> → <span className="text-foreground">{m.correct}</span></p> : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function LiveTeacher() {
  const navigate = useNavigate();
  const { lang } = useAppLang();
  const c = copyFor(lang);

  const [phase, setPhase] = useState("setup"); // setup | connecting | live | ending | recap
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("normal");
  const [age, setAge] = useState("teen");
  const [error, setError] = useState("");
  const [errorDetail, setErrorDetail] = useState(""); // admins only: OpenAI's own wording
  const [agentState, setAgentState] = useState("connecting");
  const [transcript, setTranscript] = useState([]);
  const [muted, setMuted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [recap, setRecap] = useState(null);

  const sessionRef = useRef(null);
  const lessonRef = useRef(null); // { id, deadline }
  const phaseRef = useRef("setup");
  const endedRef = useRef(false);
  const goodbyeRef = useRef(false);
  const fallbackRef = useRef(null);
  const scrollRef = useRef(null);

  const go = (p) => { phaseRef.current = p; setPhase(p); };

  // load the student's profile (level, mistakes) and last choices
  useEffect(() => {
    let alive = true;
    liveTeacherApi("profile")
      .then((r) => {
        if (!alive) return;
        setProfile(r.profile);
        if (r.profile?.mode) setMode(r.profile.mode);
        if (r.profile?.age_group) setAge(r.profile.age_group);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // leaving the page always closes the microphone and the voice link
  useEffect(() => () => {
    clearTimeout(fallbackRef.current);
    sessionRef.current?.stop();
  }, []);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [transcript]);

  const finish = useCallback(async () => {
    if (endedRef.current) return;
    endedRef.current = true;
    clearTimeout(fallbackRef.current);
    sessionRef.current?.stop();
    sessionRef.current = null;
    try {
      const r = await liveTeacherApi("end", { lesson_id: lessonRef.current?.id });
      setRecap(r.recap);
      // refresh level / counters for the next lesson
      liveTeacherApi("profile").then((p) => setProfile(p.profile)).catch(() => {});
    } catch {
      setRecap(null);
    }
    go("recap");
  }, []);

  const askToEnd = useCallback(() => {
    if (phaseRef.current !== "live") return;
    go("ending");
    sessionRef.current?.requestEnd();
    // if the teacher never answers, close the lesson ourselves
    clearTimeout(fallbackRef.current);
    fallbackRef.current = setTimeout(finish, 20000);
  }, [finish]);

  // lesson clock
  useEffect(() => {
    if (phase !== "live") return undefined;
    const tick = () => {
      const left = Math.round((lessonRef.current.deadline - Date.now()) / 1000);
      setSecondsLeft(left);
      if (left <= 0) askToEnd();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase, askToEnd]);

  const runTool = useCallback(async ({ name, args }) => {
    try {
      const r = await liveTeacherApi("tool", { lesson_id: lessonRef.current?.id, name, args });
      if (r.profile) setProfile(r.profile);
      if (name === "end_lesson") {
        // the teacher is saying goodbye: close once she stops talking (or after 15 s)
        goodbyeRef.current = true;
        clearTimeout(fallbackRef.current);
        fallbackRef.current = setTimeout(finish, 15000);
      }
      return r.output;
    } catch (e) {
      return { ok: false, error: e?.code || "tool_failed" };
    }
  }, [finish]);

  const onEvent = useCallback((e) => {
    switch (e.type) {
      case "state": setAgentState(e.state); break;
      case "user_transcript": setTranscript((t) => upsert(t, e.id, "user", e.text)); break;
      case "assistant_delta":
        setTranscript((t) => {
          const i = t.findIndex((m) => m.id === e.id);
          if (i === -1) return [...t, { id: e.id, role: "assistant", text: e.delta }];
          const next = t.slice();
          next[i] = { ...next[i], text: next[i].text + e.delta };
          return next;
        });
        break;
      case "assistant_done": setTranscript((t) => upsert(t, e.id, "assistant", e.text)); break;
      case "audio_stopped":
        if (goodbyeRef.current) { clearTimeout(fallbackRef.current); fallbackRef.current = setTimeout(finish, 800); }
        break;
      case "error":
        // the voice service reported a problem mid-lesson; keep going unless it is fatal
        if (e.code === "session_expired" || e.code === "response_failed") setError("generic");
        break;
      case "closed":
        if (phaseRef.current === "live" || phaseRef.current === "ending") { setError("closed"); finish(); }
        break;
      default: break;
    }
  }, [finish]);

  const start = async () => {
    setError("");
    setErrorDetail("");
    setTranscript([]);
    setRecap(null);
    endedRef.current = false;
    goodbyeRef.current = false;
    go("connecting");
    setAgentState("connecting");
    let session = null;
    try {
      const r = await liveTeacherApi("start", { mode, age_group: age, lang });
      lessonRef.current = { id: r.lesson_id, deadline: Date.now() + r.max_minutes * 60000 };
      setProfile(r.profile);
      session = createRealtimeSession({ clientSecret: r.client_secret, openingPrompt: r.opening_prompt, onEvent, runTool });
      sessionRef.current = session;
      await session.start();
      go("live");
    } catch (e) {
      session?.stop();
      sessionRef.current = null;
      lessonRef.current = null;
      setError(c.errors[e?.code] ? e.code : "generic");
      // the server only puts OpenAI's wording in the message for admins
      setErrorDetail(String(e?.message || "").startsWith("OpenAI said") ? e.message : "");
      go("setup");
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sessionRef.current?.setMuted(next);
  };

  const live = phase === "live" || phase === "ending";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <header className="flex items-center gap-2 px-3 py-3 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label={c.back} disabled={live}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-base font-bold leading-tight">{c.title}</h1>
          <p className="text-xs text-muted-foreground leading-tight">{c.subtitle}</p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-5 space-y-5">
        {error ? (
          <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm">
            {c.errors[error] || c.errors.generic}
            {errorDetail ? <p className="mt-1 text-xs text-muted-foreground break-words">{errorDetail}</p> : null}
          </div>
        ) : null}

        {(phase === "setup" || phase === "connecting") && (
          <>
            <section className="grid grid-cols-3 gap-2 text-center">
              {[
                [c.level, profile?.cefr_level || c.levelUnknown],
                [c.lessons, profile?.lesson_count ?? 0],
                [c.mastered, profile?.mastered ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border p-3">
                  <div className="text-lg font-bold">{value}</div>
                  <div className="text-[11px] text-muted-foreground">{label}</div>
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2">{c.mode}</h2>
              <div className="space-y-2">
                {["normal", "strict", "exam"].map((m) => {
                  const Icon = MODE_ICON[m];
                  const on = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      disabled={phase === "connecting"}
                      className={`w-full text-left rounded-xl border p-3 flex gap-3 items-start transition-colors ${on ? "border-primary bg-primary/10" : "border-border hover:border-foreground/30"}`}
                    >
                      <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                      <span>
                        <span className="block font-semibold">{c.modes[m].name}</span>
                        <span className="block text-sm text-muted-foreground">{c.modes[m].desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2">{c.age}</h2>
              <div className="flex gap-2">
                {["kid", "teen", "adult"].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAge(a)}
                    disabled={phase === "connecting"}
                    className={`flex-1 rounded-xl border py-2 text-sm font-medium ${age === a ? "border-primary bg-primary/10" : "border-border"}`}
                  >
                    {c.ages[a]}
                  </button>
                ))}
              </div>
            </section>

            {profile?.mistakes?.length ? (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-2">{c.mistakes}</h2>
                <MistakeList mistakes={profile.mistakes} c={c} lang={lang} />
              </section>
            ) : null}

            <Button className="w-full h-12 text-base font-semibold" onClick={start} disabled={phase === "connecting"}>
              {phase === "connecting" ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{c.connecting}</> : <><Mic className="w-4 h-4 mr-2" />{c.start}</>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">{c.privacy}</p>
          </>
        )}

        {live && (
          <>
            <div className="text-center space-y-3">
              <Orb state={agentState} />
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${STATE_DOT[agentState] || "bg-white/40"}`} />
                <span>{phase === "ending" ? c.ending : c.state[agentState] || ""}</span>
                <span className="text-muted-foreground flex items-center gap-1 ml-3"><Clock className="w-3.5 h-3.5" />{fmt(secondsLeft)}</span>
              </div>
              {secondsLeft > 0 && secondsLeft <= 60 ? <p className="text-xs text-amber-300">{c.oneMinute}</p> : null}
            </div>

            <div ref={scrollRef} className="rounded-xl border border-border p-3 h-56 overflow-y-auto space-y-2 text-sm" aria-live="polite">
              {transcript.map((m) => (
                <p key={m.id} className={m.role === "user" ? "text-right" : ""}>
                  <span className="text-[11px] text-muted-foreground mr-1">{m.role === "user" ? c.you : c.teacher}</span>
                  <span>{m.text}</span>
                </p>
              ))}
            </div>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2">{c.mistakes}</h2>
              <MistakeList mistakes={profile?.mistakes} c={c} lang={lang} />
            </section>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-12" onClick={toggleMute} disabled={phase === "ending"}>
                {muted ? <><MicOff className="w-4 h-4 mr-2" />{c.unmute}</> : <><Mic className="w-4 h-4 mr-2" />{c.mute}</>}
              </Button>
              <Button variant="destructive" className="flex-1 h-12" onClick={askToEnd} disabled={phase === "ending"}>
                {phase === "ending" ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{c.ending}</> : <><PhoneOff className="w-4 h-4 mr-2" />{c.end}</>}
              </Button>
            </div>
          </>
        )}

        {phase === "recap" && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold">{c.recapTitle}</h2>
            {recap?.summary ? <p className="text-sm">{recap.summary}</p> : null}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                [c.recapNew, recap?.new_mistakes ?? 0],
                [c.recapRepeated, recap?.repeated_mistakes ?? 0],
                [c.recapMastered, recap?.mastered_now ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border p-3">
                  <div className="text-lg font-bold">{value}</div>
                  <div className="text-[11px] text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            {recap?.cefr_level ? <p className="text-sm">{c.level}: <b>{recap.cefr_level}</b></p> : null}
            <RecapMistakes mistakes={recap?.mistakes} c={c} lang={lang} navigate={navigate} />
            {recap?.scores ? (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{c.recapScores}</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {Object.keys(c.scoreNames).map((k) => (
                    <li key={k} className="rounded-xl border border-border p-2 flex justify-between"><span>{c.scoreNames[k]}</span><b>{recap.scores[k] ?? "-"}</b></li>
                  ))}
                </ul>
              </div>
            ) : null}
            {recap?.focus_next?.length ? (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{c.recapFocus}</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">{recap.focus_next.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
            ) : null}
            <div className="flex gap-2">
              <Button className="flex-1 h-12" onClick={() => { go("setup"); setError(""); }}>{c.again}</Button>
              <Button variant="outline" className="flex-1 h-12" onClick={() => navigate("/")}>{c.home}</Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
