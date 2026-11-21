import React, { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useAppLang } from "@/hooks/useAppLang";
import { viraFor } from "@/lib/mascot/vira";

// Vira mascot: one pose + one line for a moment. Picks once per mount, so a
// re-render never swaps her mid-read. Dismissable for this page visit.
//
// "Pop" (Tee's review 2026-11-17: more present, but a nudge, not a shout):
// the first time a moment shows on a given day, Vira first appears bigger,
// floating near the bottom of the screen, then after a few seconds (or a tap)
// glides back into her normal spot on the page. Once per moment per day;
// never with reduced motion.
const POP_MS = 4200;

function claimPop(moment) {
  try {
    const key = `vira_pop_${moment}`;
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(key) === today) return false;
    localStorage.setItem(key, today);
    return true;
  } catch {
    return false;
  }
}

export default function ViraBubble({ moment, vars, className = "", pop = true }) {
  const { lang } = useAppLang();
  const reduce = useReducedMotion();
  const layoutId = `vira-${useId()}`;
  const [hidden, setHidden] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const varsKey = JSON.stringify(vars || {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pick = useMemo(() => (moment ? viraFor(moment, lang, vars || {}) : null), [moment, lang, varsKey]);
  const [popped, setPopped] = useState(() => Boolean(pop && moment && !reduce && typeof document !== "undefined" && claimPop(moment)));

  useEffect(() => {
    if (!popped) return undefined;
    const t = setTimeout(() => setPopped(false), POP_MS);
    return () => clearTimeout(t);
  }, [popped]);

  if (!pick || hidden) return null;

  const pose = (w, h) =>
    imgOk && (
      <motion.img
        layout
        src={pick.src}
        alt="Vira"
        width={w}
        height={h}
        onError={() => setImgOk(false)}
        style={{ width: w, height: h }}
        className="object-contain object-bottom shrink-0 select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(167,139,250,0.25)]"
        draggable={false}
      />
    );

  if (popped) {
    return (
      <>
        {/* keeps her spot on the page so nothing jumps when she comes back */}
        <div className={`h-[88px] ${className}`} aria-hidden="true" />
        {createPortal(
          <div className="fixed inset-x-0 bottom-24 z-50 px-4 flex justify-center pointer-events-none">
            <motion.button
              type="button"
              layoutId={layoutId}
              data-testid="vira-pop"
              onClick={() => setPopped(false)}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="pointer-events-auto w-full max-w-md flex items-end gap-3 text-left rounded-[28px] border border-violet-300/25 bg-background/95 backdrop-blur px-3 pt-3 pb-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            >
              {pose(110, 146)}
              <motion.div layout="position" className="flex-1 min-w-0 mb-4 rounded-2xl rounded-bl-md border border-violet-300/25 bg-violet-400/[0.10] px-4 py-3">
                <p className="text-xs font-semibold text-violet-300/90 leading-none mb-1.5">Vira</p>
                <p className="text-[15px] text-foreground leading-snug">{pick.text}</p>
              </motion.div>
            </motion.button>
          </div>,
          document.body,
        )}
      </>
    );
  }

  return (
    <motion.div
      layoutId={layoutId}
      data-testid="vira-bubble"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, type: "spring", stiffness: 220, damping: 26 }}
      className={`relative flex items-end gap-2 ${className}`}
    >
      {pose(66, 88)}
      <motion.div layout="position" className="relative flex-1 min-w-0 mb-3 rounded-2xl rounded-bl-md border border-violet-300/25 bg-violet-400/[0.08] px-4 py-2.5 pr-8">
        <p className="text-[11px] font-semibold text-violet-300/90 leading-none mb-1">Vira</p>
        <p className="text-sm text-foreground leading-snug">{pick.text}</p>
        <button
          type="button"
          aria-label="Close"
          onClick={() => setHidden(true)}
          className="absolute top-1.5 right-1.5 p-1 rounded-lg text-muted-foreground/70 hover:text-foreground select-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
}
