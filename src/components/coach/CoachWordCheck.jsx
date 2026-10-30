import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { isRight } from "@/lib/coach/wordCheck";

const TITLE = { meaning: "pick_meaning", recall: "pick_word", definition: "q_definition", context: "q_context", spelling: "q_spelling" };

// A2 + uz/ru (VT-40 5c): the translation exists but stays hidden until the learner
// taps for it. A tap is support, so the answer that follows is tagged as hinted.
function TapTranslation({ text, label, onReveal, className = "" }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return open
    ? <p data-testid="tap-native" className={`text-sm text-muted-foreground break-words ${className}`}>({text})</p>
    : <button type="button" data-testid="tap-translate" onClick={() => { setOpen(true); onReveal?.(); }}
        className={`text-xs font-semibold underline underline-offset-4 text-muted-foreground hover:text-foreground select-none ${className}`}>{label}</button>;
}

// One word's questions (meaning / recall / definition / context / spelling).
// Reports every answer up; the session submits them in one server-graded
// "quiz" round tagged with the Coach session_key. A weak word starts with a
// short word card (`intro`).
export default function CoachWordCheck({ word, questions, intro, color, t, onAnswer, onDone, onProgress }) {
  const [showCard, setShowCard] = useState(!!intro);
  const [k, setK] = useState(0);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [tapped, setTapped] = useState(false);
  const finished = useRef(false);
  const q = questions[k];
  // 5d: report progress inside this word (answered questions / total) so the session bar moves.
  useEffect(() => { onProgress?.(k + (picked !== null ? 1 : 0), questions.length); }, [k, picked, questions.length]); // eslint-disable-line react-hooks/exhaustive-deps
  // 5d: Enter moves on after an answer (it already submits a typed answer). Ignores held-down repeats.
  useEffect(() => {
    if (picked === null || showCard) return undefined;
    const onKey = (e) => { if (e.key === "Enter" && !e.repeat) { e.preventDefault(); nextRef.current?.(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picked, showCard]);
  const nextRef = useRef(null);
  if (!q) return null;

  if (showCard) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-[28px] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("word_card")}</p>
        <p className="text-3xl font-bold text-foreground mt-2 break-words">{intro.english}</p>
        {intro.native && <p className="text-base text-muted-foreground mt-1">{intro.native}</p>}
        {intro.tapNative && <TapTranslation text={intro.tapNative} label={t("show_translation")} className="mt-1 block" />}
        {intro.definition && <p className="text-sm text-foreground mt-4">{intro.definition}</p>}
        {intro.example && <p className="text-sm text-muted-foreground italic mt-2">“{intro.example}”</p>}
        <button onClick={() => setShowCard(false)} className="mt-6 w-full h-12 rounded-2xl font-semibold text-white select-none" style={{ background: color }}>
          {t("got_it")}
        </button>
      </motion.div>
    );
  }

  const answer = (given) => {
    if (picked !== null) return;
    setPicked(given);
    onAnswer(word, q, given, { tapped });
  };
  const next = () => {
    if (picked === null) return;
    setPicked(null);
    setTyped("");
    setTapped(false);
    if (k + 1 < questions.length) setK(k + 1);
    else if (!finished.current) { finished.current = true; onDone(); } // a double tap never skips an item
  };
  nextRef.current = next;
  const kind = q.kind || (q.type === "multiple_choice" ? "meaning" : "recall");
  const right = picked !== null && isRight(q, picked);
  const title = q.type === "definition_choice" ? "pick_definition" : q.type === "spelling" && q.promptForm === "sentence" ? "q_spelling_sentence" : TITLE[kind] || "pick_word";
  const longPrompt = kind === "definition" || kind === "context" || (q.type === "spelling" && q.promptForm !== "translation");
  const below = q.meaning || q.tapNative;

  return (
    <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-[28px] p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t(title)}</p>
        {questions.length > 1 && <span data-testid="word-q-count" className="text-[11px] font-semibold text-muted-foreground tabular-nums shrink-0">{k + 1}/{questions.length}</span>}
      </div>
      <p className={`${longPrompt ? "text-lg leading-snug" : "text-3xl"} font-bold text-foreground mt-2 ${below ? "mb-1" : "mb-5"} break-words`}>{q.prompt}</p>
      {q.meaning && <p data-testid="gap-meaning" className="text-sm text-muted-foreground mb-5 break-words">({q.meaning})</p>}
      {!q.meaning && q.tapNative && <div className="mb-5"><TapTranslation key={k} text={q.tapNative} label={t("show_translation")} onReveal={() => setTapped(true)} /></div>}
      {q.type === "spelling" ? (
        <form onSubmit={(e) => { e.preventDefault(); if (typed.trim()) answer(typed); }} className="grid gap-2">
          <p className="text-sm font-mono tracking-widest text-muted-foreground">{q.hint}</p>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} disabled={picked !== null} autoFocus
            autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} aria-label={t("q_spelling")}
            className={`w-full px-4 py-3 rounded-2xl border bg-white/[0.04] text-foreground text-base outline-none ${
              picked === null ? "border-white/15 focus:border-white/40" : right ? "border-emerald-400/60" : "border-rose-400/60"}`} />
          {picked === null ? (
            <button type="submit" disabled={!typed.trim()} className="w-full h-12 rounded-2xl font-semibold text-white select-none disabled:opacity-40" style={{ background: color }}>
              {t("check")}
            </button>
          ) : (
            <p className={`text-sm flex items-center gap-2 ${right ? "text-emerald-400" : "text-rose-400"}`}>
              {right ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {right ? q.correct : `${t("answer")} ${q.correct}`}
            </p>
          )}
        </form>
      ) : (
        <div className="grid gap-2">
          {q.options.map((opt) => {
            const isOk = picked !== null && opt === q.correct;
            const isBad = picked === opt && opt !== q.correct;
            return (
              <button key={opt} onClick={() => answer(opt)} disabled={picked !== null}
                className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-medium transition-colors select-none flex items-center justify-between ${
                  isOk ? "border-emerald-400/60 bg-emerald-400/10" : isBad ? "border-rose-400/60 bg-rose-400/10" : "border-white/10 bg-white/[0.04] hover:border-white/25"}`}>
                <span className="text-foreground">{opt}</span>
                {isOk && <Check className="w-4 h-4 text-emerald-400" />}
                {isBad && <X className="w-4 h-4 text-rose-400" />}
              </button>
            );
          })}
        </div>
      )}
      {picked !== null && (
        <button onClick={next} className="mt-5 w-full h-12 rounded-2xl font-semibold text-white select-none" style={{ background: color }}>
          {t("next")}
        </button>
      )}
    </motion.div>
  );
}
