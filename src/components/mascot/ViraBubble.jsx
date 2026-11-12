import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useAppLang } from "@/hooks/useAppLang";
import { viraFor } from "@/lib/mascot/vira";

// Vira mascot MVP: one pose + one line for a moment. Picks once per mount,
// so a re-render never swaps her mid-read. Dismissable for this page visit.
export default function ViraBubble({ moment, vars, className = "" }) {
  const { lang } = useAppLang();
  const [hidden, setHidden] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const varsKey = JSON.stringify(vars || {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pick = useMemo(() => (moment ? viraFor(moment, lang, vars || {}) : null), [moment, lang, varsKey]);
  if (!pick || hidden) return null;

  return (
    <motion.div
      data-testid="vira-bubble"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative flex items-end gap-2 ${className}`}
    >
      {imgOk && (
        <img
          src={pick.src}
          alt="Vira"
          width={66}
          height={88}
          onError={() => setImgOk(false)}
          className="w-[66px] h-[88px] object-contain object-bottom shrink-0 select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(167,139,250,0.25)]"
          draggable={false}
        />
      )}
      <div className="relative flex-1 min-w-0 mb-3 rounded-2xl rounded-bl-md border border-violet-300/25 bg-violet-400/[0.08] px-4 py-2.5 pr-8">
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
      </div>
    </motion.div>
  );
}
