import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { isRight } from "@/lib/coach/wordCheck";

const TITLE = { meaning: "pick_meaning", recall: "pick_word", definition: "q_definition", context: "q_context", spelling: "q_spelling" };

// One word's questions (meaning / recall / definition / context / spelling).
// Reports every answer up; the session submits them in one server-graded
// "quiz" round tagged with the Coach session_key. A weak word starts with a
// short word card (`intro`).
export default function CoachWordCheck({ word, questions, intro, color, t, onAnswer, onDone }) {
  const [showCard, setShowCard] = useState(!!intro);
  const [k, setK] = useState(0);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const finished = useRef(false);
  const q = questions[k];
  if (!q) return null;

  if (showCard) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-[28px] p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("word_card")}</p>
        <p className="text-3xl font-bold text-foreground mt-2 break-words">{intro.english}</p>
        {intro.native && <p className="text-base text-muted-foreground mt-1">{intro.native}</p>}
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
    onAnswer(word, q, given);
  };
  const next = () => {
    setPicked(null);
    setTyped("");
    if (k + 1 < questions.length) setK(k + 1);
    else if (!finished.current) { finished.current = true; onDone(); } // a double tap never skips an item
  };
  const kind = q.kind || (q.type === "multiple_choice" ? "meaning" : "recall");
  const right = picked !== null && isRight(q, picked);

  return (
    <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-[28px] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t(TITLE[kind] || "pick_word")}</p>
      <p className={`${kind === "definition" || kind === "context" ? "text-lg leading-snug" : "text-3xl"} font-bold text-foreground mt-2 mb-5 break-words`}>{q.prompt}</p>
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
