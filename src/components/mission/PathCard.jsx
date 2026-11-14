import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Route, ArrowRight, BookOpen, PenLine, Check } from "lucide-react";
import { useAppLang } from "@/hooks/useAppLang";
import { pathCopy, stopLabel, unitName } from "@/lib/learnerPath";

// Home: where the student is on the ONE path (src/lib/learnerPath.js).
// It replaces the old "Free lesson" card: Lesson 1 is now simply the first
// stop on the path. This card does not carry the Continue button (the Comeback
// Card above it does, so Home keeps a single primary button); it shows the
// position and links to the whole path.
//
// state: from useLearnerPath (null while loading -> skeleton; hidden on failure).
export default function PathCard({ state, loading }) {
  const { lang } = useAppLang();
  const c = pathCopy(lang);

  if (loading) return <div className="h-[92px] rounded-2xl bg-white/[0.04] animate-pulse" aria-hidden="true" />;
  if (!state) return null;

  const { next, total, done, unit } = state;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const isLesson = next?.kind === "lesson";
  const where = !next ? null : isLesson ? c.lesson : `${c.unit(unit.index + 1)} · ${unitName(unit.id, lang)}`;
  const Icon = !next ? Check : isLesson ? BookOpen : PenLine;

  return (
    <Link to="/grammar?view=path" className="block group" data-testid="path-card">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative rounded-2xl border p-4 select-none overflow-hidden"
        style={{ borderColor: "rgba(45,212,191,0.35)", background: "linear-gradient(180deg, rgba(45,212,191,0.12), rgba(45,212,191,0.03))" }}
      >
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-teal-400/15 flex items-center justify-center flex-shrink-0">
            <Route className="w-5 h-5 text-teal-300" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300">{c.yourPath}{where ? ` · ${where}` : ""}</p>
            <p className="text-sm font-bold text-foreground leading-tight truncate flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 shrink-0 text-teal-300" />
              <span className="truncate">{next ? stopLabel(next, lang) : c.allDone}</span>
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-teal-300 flex-shrink-0">
            <span className="hidden sm:inline">{c.seeAll}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <span className="block h-full rounded-full bg-teal-400" style={{ width: `${pct}%` }} />
          </span>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap tabular-nums">{c.stops(done, total)}</span>
        </div>
      </motion.div>
    </Link>
  );
}
