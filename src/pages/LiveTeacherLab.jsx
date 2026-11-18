import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, Square, Loader2, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { liveTeacherLab } from "@/lib/serverApi";

// Live Teacher LAB (admin only, 2026-11-18). A test bench for the "text brain"
// pipeline: student voice -> EARS (speech-to-text) -> brain (text) -> MOUTH
// (text-to-speech). Before building the real loop we check, on real audio:
//   1. Do the ears keep the student's grammar mistakes? ("He don't" must stay "He don't")
//   2. Do the voices handle English, Uzbek, Russian and mixed sentences?
//   3. How long until the first sound?
// Server: base44/functions/liveTeacherLab/entry.ts (keys stay on the server).

const EAR_TESTS = [
  { id: "t1", say: "I goes to school every day.", check: ["i goes"] },
  { id: "t2", say: "He don't like coffee.", check: ["he don't"] },
  { id: "t3", say: "I am student and I very like English.", check: ["am student", "very like"] },
  { id: "t4", say: "Yesterday I go to the market and buy some apples.", check: ["yesterday i go", "and buy"] },
  { id: "t5", say: "Teacher, qanday aytiladi… how to say “olma” in English?", check: ["qanday", "olma"], note: "Uzbek mixed in" },
  { id: "t6", say: "Подождите, I don't understand this word.", check: ["подожд|podozhd"], note: "Russian mixed in" },
  { id: "t7", say: "Say any sentence while someone talks or a video plays in the background.", check: [], note: "Background voices" },
  { id: "t8", say: "Free recording: say anything.", check: [] },
];

const SAMPLES = [
  { id: "en", label: "English (teacher)", text: "Nice try! We say \"He doesn't like coffee\", not \"He don't\". With he, she and it, we use doesn't. Can you say it again?" },
  { id: "uz", label: "Uzbek explanation", text: "Yaxshi urinish! «He», «she» va «it» bilan «doesn't» ishlatamiz. Keling, yana bir bor aytib koʻring." },
  { id: "mix_uz", label: "Mixed Uzbek + English", text: "Biz «I go» deymiz, «I goes» emas, chunki «I» bilan feʼlga -s qoʻshilmaydi. Now you try: I go to school every day." },
  { id: "ru", label: "Russian explanation", text: "Хорошая попытка! С he, she и it мы говорим doesn't. Попробуйте ещё раз: He doesn't like coffee." },
  { id: "filler", label: "Fillers (hmm)", text: "Hmm… Mhm. Okay, okay…" },
  { id: "velvet", label: "Velvet-style", text: "Oh come on, you know this one! It's \"I am a student\", not \"I am student\". Again, and this time with the article!" },
  { id: "violet", label: "Violet-style", text: "Stop. \"I very like\" is wrong. We say \"I really like\". Say it. Now." },
];

const EL_MODELS = [
  { id: "eleven_v4_turbo", label: "v4 Turbo · Uzbek ✓ · $0.04/1K chars · fastest" },
  { id: "eleven_v3_conversational", label: "v3 Conversational · Uzbek ✓ · $0.04/1K chars" },
  { id: "eleven_v4", label: "v4 · Uzbek ✓ · $0.08/1K chars · most expressive" },
  { id: "eleven_v3", label: "v3 · Uzbek ✓ · $0.08/1K chars" },
  { id: "eleven_flash_v2_5", label: "Flash v2.5 · NO Uzbek · $0.04/1K chars" },
];
const GEMINI_MODELS = [
  { id: "gemini-3.8-flash-tts", label: "Gemini 3.8 Flash TTS" },
  { id: "gemini-3.8-flash-lite-tts", label: "Gemini 3.8 Flash-Lite TTS (cheaper)" },
];
const GEMINI_VOICES = ["Kore", "Aoede", "Leda", "Zephyr", "Callirrhoe", "Autonoe", "Despina", "Erinome", "Laomedeia", "Achernar", "Gacrux", "Pulcherrima", "Vindemiatrix", "Sulafat", "Puck", "Charon", "Fenrir", "Orus"];

// "He don't" vs "He doesn't": compare lower-case, without apostrophes or punctuation.
const norm = (s) => String(s || "").toLowerCase().replace(/[’'ʼʻ`]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
const keeps = (text, needle) => needle.split("|").some((n) => norm(text).includes(norm(n)));

const blobToB64 = (blob) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(",")[1] || "");
  r.onerror = reject;
  r.readAsDataURL(blob);
});
const b64ToUrl = (b64, mime) => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
};
const pickMime = () => {
  if (typeof MediaRecorder === "undefined") return "";
  for (const m of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"]) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
};

function Pill({ ok, children }) {
  return <span className={`text-[11px] rounded-full px-2 py-0.5 ${ok ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>{children}</span>;
}

function EarRow({ test, recordingId, busyId, onRecord, onStop, result }) {
  const recording = recordingId === test.id;
  const busy = busyId === test.id;
  return (
    <li className="rounded-xl border border-border p-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{test.say}</p>
          {test.note ? <p className="text-xs text-muted-foreground">{test.note}</p> : null}
        </div>
        {recording ? (
          <Button size="sm" variant="destructive" onClick={onStop}><Square className="h-4 w-4 mr-1" />Stop</Button>
        ) : (
          <Button size="sm" variant="outline" disabled={!!recordingId || busy} onClick={() => onRecord(test.id)}>
            {busy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Mic className="h-4 w-4 mr-1" />}Record
          </Button>
        )}
      </div>
      {result?.error ? <p className="text-sm text-rose-300">{result.error}</p> : null}
      {(result?.results || []).map((r) => (
        <div key={r.provider} className="rounded-lg bg-white/5 p-2 text-sm space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{r.provider === "openai" ? "OpenAI" : "ElevenLabs Scribe"}</span>
            {r.model ? <span className="text-xs text-muted-foreground">{r.model}</span> : null}
            {r.ms != null ? <span className="text-xs text-muted-foreground">{r.ms} ms</span> : null}
            {r.language ? <span className="text-xs text-muted-foreground">lang: {r.language}</span> : null}
          </div>
          {r.ok ? <p>“{r.text}”</p> : <p className="text-rose-300">{r.error}</p>}
          {r.ok && test.check.length ? (
            <div className="flex flex-wrap gap-1.5">
              {test.check.map((n) => <Pill key={n} ok={keeps(r.text, n)}>{keeps(r.text, n) ? "kept" : "LOST"}: {n.split("|")[0]}</Pill>)}
            </div>
          ) : null}
        </div>
      ))}
    </li>
  );
}

export default function LiveTeacherLab() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  // ears
  const [recordingId, setRecordingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [earResults, setEarResults] = useState({});
  const recRef = useRef(null);

  // mouth
  const [provider, setProvider] = useState("elevenlabs");
  const [elModel, setElModel] = useState("eleven_v4_turbo");
  const [gModel, setGModel] = useState("gemini-3.8-flash-tts");
  const [voices, setVoices] = useState([]);
  const [elVoice, setElVoice] = useState("");
  const [gVoice, setGVoice] = useState("Kore");
  const [style, setStyle] = useState("warm, friendly English teacher");
  const [custom, setCustom] = useState("");
  const [speakingId, setSpeakingId] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    liveTeacherLab("status").then(setStatus).catch((e) => setError(e.message));
    liveTeacherLab("voices").then((r) => {
      const list = r.voices || [];
      setVoices(list);
      if (list.length) setElVoice(list[0].id);
    }).catch(() => {});
  }, []);

  async function startRecording(id) {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = pickMime();
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data?.size) chunks.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = rec.mimeType || mime || "audio/webm";
        const blob = new Blob(chunks, { type });
        setBusyId(id);
        try {
          const audio_b64 = await blobToB64(blob);
          const r = await liveTeacherLab("transcribe", { audio_b64, mime: type.split(";")[0] });
          setEarResults((prev) => ({ ...prev, [id]: r }));
        } catch (e) {
          setEarResults((prev) => ({ ...prev, [id]: { error: e.message } }));
        } finally {
          setBusyId(null);
        }
      };
      recRef.current = rec;
      rec.start();
      setRecordingId(id);
    } catch (e) {
      setError(`Microphone: ${e.message}`);
    }
  }
  function stopRecording() {
    recRef.current?.stop();
    recRef.current = null;
    setRecordingId(null);
  }

  async function speak(sample) {
    setError("");
    setSpeakingId(sample.id);
    try {
      const payload = provider === "elevenlabs"
        ? { provider, text: sample.text, model: elModel, voice: elVoice }
        : { provider, text: sample.text, model: gModel, voice: gVoice, style };
      const r = await liveTeacherLab("speak", payload);
      const url = b64ToUrl(r.audio_b64, r.mime);
      new Audio(url).play().catch(() => {});
      const voiceName = provider === "elevenlabs" ? (voices.find((v) => v.id === elVoice)?.name || elVoice) : gVoice;
      setHistory((h) => [{ key: Date.now(), label: sample.label, provider, model: r.model, voice: voiceName, first: r.first_audio_ms, total: r.total_ms, chars: r.chars, cost: r.est_cost_usd, url }, ...h].slice(0, 30));
    } catch (e) {
      setError(e.message);
    } finally {
      setSpeakingId(null);
    }
  }

  const keys = status?.keys || {};
  const samples = custom.trim() ? [...SAMPLES, { id: "custom", label: "Custom text", text: custom.trim() }] : SAMPLES;
  const canSpeak = provider === "elevenlabs" ? keys.elevenlabs && elVoice : keys.gemini;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-xl font-bold">Live Teacher Lab</h1>
          <p className="text-xs text-muted-foreground">Admin test bench: ears (speech → text) and mouth (text → speech).</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill ok={keys.openai}>OpenAI key {keys.openai ? "✓" : "missing"}</Pill>
        <Pill ok={keys.elevenlabs}>ElevenLabs key {keys.elevenlabs ? "✓" : "missing"}</Pill>
        <Pill ok={keys.gemini}>Gemini key {keys.gemini ? "✓" : "missing (optional)"}</Pill>
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider">1 · Ears: does the transcript keep the mistakes?</h2>
        <p className="text-sm text-muted-foreground">Press Record, read the sentence exactly as written (mistakes included), press Stop. Green “kept” = the brain will see the mistake. Red “LOST” = the transcriber fixed it.</p>
        <ul className="space-y-2">
          {EAR_TESTS.map((t) => (
            <EarRow key={t.id} test={t} recordingId={recordingId} busyId={busyId} onRecord={startRecording} onStop={stopRecording} result={earResults[t.id]} />
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider">2 · Mouth: how does each voice sound?</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-sm space-y-1">
            <span className="text-muted-foreground">Provider</span>
            <select className="w-full rounded-lg bg-background border border-border p-2" value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="elevenlabs">ElevenLabs</option>
              <option value="gemini">Google Gemini</option>
            </select>
          </label>
          {provider === "elevenlabs" ? (
            <>
              <label className="text-sm space-y-1">
                <span className="text-muted-foreground">Model</span>
                <select className="w-full rounded-lg bg-background border border-border p-2" value={elModel} onChange={(e) => setElModel(e.target.value)}>
                  {EL_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </label>
              <label className="text-sm space-y-1 sm:col-span-2">
                <span className="text-muted-foreground">Voice ({voices.length} available)</span>
                <select className="w-full rounded-lg bg-background border border-border p-2" value={elVoice} onChange={(e) => setElVoice(e.target.value)}>
                  {voices.map((v) => <option key={v.id} value={v.id}>{v.name}{v.labels ? ` · ${v.labels}` : ""}</option>)}
                </select>
              </label>
            </>
          ) : (
            <>
              <label className="text-sm space-y-1">
                <span className="text-muted-foreground">Model</span>
                <select className="w-full rounded-lg bg-background border border-border p-2" value={gModel} onChange={(e) => setGModel(e.target.value)}>
                  {GEMINI_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </label>
              <label className="text-sm space-y-1">
                <span className="text-muted-foreground">Voice</span>
                <select className="w-full rounded-lg bg-background border border-border p-2" value={gVoice} onChange={(e) => setGVoice(e.target.value)}>
                  {GEMINI_VOICES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
              <label className="text-sm space-y-1">
                <span className="text-muted-foreground">Style</span>
                <input className="w-full rounded-lg bg-background border border-border p-2" value={style} onChange={(e) => setStyle(e.target.value)} />
              </label>
            </>
          )}
        </div>

        <ul className="space-y-2">
          {samples.map((s) => (
            <li key={s.id} className="rounded-xl border border-border p-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm">{s.text}</p>
              </div>
              <Button size="sm" variant="outline" disabled={!canSpeak || !!speakingId} onClick={() => speak(s)}>
                {speakingId === s.id ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Volume2 className="h-4 w-4 mr-1" />}Speak
              </Button>
            </li>
          ))}
        </ul>
        <textarea className="w-full rounded-lg bg-background border border-border p-2 text-sm" rows={2} placeholder="Custom text to try (any language)…" value={custom} onChange={(e) => setCustom(e.target.value)} />

        {history.length ? (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tried so far</h3>
            <ul className="space-y-1.5">
              {history.map((h) => (
                <li key={h.key} className="rounded-lg bg-white/5 p-2 text-xs flex items-center justify-between gap-2">
                  <span>
                    <b>{h.label}</b> · {h.provider} {h.model} · {h.voice} · first sound {h.first} ms · total {h.total} ms · {h.chars} chars
                    {h.cost != null ? ` · ~$${h.cost.toFixed(4)}` : ""}
                  </span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => new Audio(h.url).play().catch(() => {})}><Play className="h-4 w-4" /></Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}
