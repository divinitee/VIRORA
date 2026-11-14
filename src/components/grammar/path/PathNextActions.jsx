import React from "react";
import { ArrowRight, Sparkles, Compass, Check, Target } from "lucide-react";
import { pathCopy, stopLabel } from "@/lib/learnerPath";

// "Once done" on the whiteboard (14 Nov 2026): what a student sees under the
// result of a path round. Three ways on, in this order:
//   1. the next stop on the path (only when this round passed the stop)
//   2. suggested practice: the Coach's practice for today
//   3. free roam: the Skill Hub, any game or topic
// A round that didn't pass shows the bar to reach instead of "next"; the result
// card's own "Again" button is the way to retry.
//
//   passed     this round finished the stop (8+ answers, 80%+)
//   nextStop   the stop Continue would open now (null = path finished)
//   onNext / onCoach / onFree  navigation, owned by the page
const ACCENT = "#3E9E92";

export default function PathNextActions({ lang, passed, nextStop, onNext, onCoach, onFree }) {
  const c = pathCopy(lang);
  return (
    <div className="mt-5 pt-4 border-t border-white/10" data-testid="path-next-actions">
      <p className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: passed ? ACCENT : "#D9B45B" }}>
        {passed ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
        {passed ? (nextStop ? c.passed : c.allDone) : c.notYet}
      </p>

      {passed && nextStop && (
        <button type="button" onClick={onNext} data-testid="path-next"
          className="mt-3 w-full h-12 px-4 rounded-2xl font-semibold text-[#04201d] flex items-center justify-center gap-2 select-none min-w-0 transition-transform active:scale-[0.99]"
          style={{ background: `linear-gradient(180deg, #4fb9ab, ${ACCENT})` }}>
          <span className="truncate">{c.next}: {stopLabel(nextStop, lang)}</span> <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      )}

      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mt-4 mb-1.5">{c.or}</p>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onCoach} data-testid="path-coach"
          className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2.5 text-left select-none min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><Sparkles className="w-4 h-4 shrink-0 text-violet-300" /> <span className="truncate">{c.suggested}</span></span>
        </button>
        <button type="button" onClick={onFree} data-testid="path-free"
          className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2.5 text-left select-none min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><Compass className="w-4 h-4 shrink-0 text-teal-300" /> <span className="truncate">{c.free}</span></span>
        </button>
      </div>
    </div>
  );
}
