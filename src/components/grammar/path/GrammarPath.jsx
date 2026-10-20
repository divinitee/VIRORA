import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Lock, Play, RotateCcw, Sparkles, X, BookOpen } from "lucide-react";
import { UNITS, topicLabel } from "@/lib/grammarCourse";
import { STATUS, statusOf, nextTopic, unitProgress, reviewKeys } from "@/lib/grammarPathState";
import { PRACTICE_STAGES } from "@/lib/grammarPractice/stages";
import { PRACTICE_MANIFEST } from "@/lib/grammarPractice/manifest";
import { GRAMMAR_ACCENT as ACCENT } from "@/components/grammar/map/tierMeta";

// The guided Path (roadmap 05.2): one vertical rail of units, each unit a short
// ordered chain of topics. Soft recommendation only — the "Next" topic glows,
// nothing is locked. Spec: grammar course audit round 2 (Oct 2026).

const STR = {
  uz: {
    unit: "Bo'lim", next: "Keyingi", soon: "Tez orada", preview: "Qo'shimcha", review: "Takrorlash",
    status: { new: "Yangi", practising: "Mashq qilinmoqda", review: "Takrorlash", secure: "O'zlashtirildi" },
    secureOf: (a, b) => `${a}/${b} o'zlashtirildi`, playable: (n) => `${n} ta mavzu tayyor`,
    continue: "Davom etish", allDone: "Hozircha hammasi bajarildi!", learn: "O'rganish", learnSoon: "Tez orada",
    practice: "Mashq", stageOff: "Hozircha mavjud emas", reviewTitle: "Takrorlash kerak", close: "Yopish",
    noContent: "Bu mavzu uchun mashqlar tayyorlanmoqda.",
  },
  en: {
    unit: "Unit", next: "Next", soon: "Coming soon", preview: "Preview", review: "Review",
    status: { new: "New", practising: "Practising", review: "Review", secure: "Secure" },
    secureOf: (a, b) => `${a}/${b} secure`, playable: (n) => `${n} ready to play`,
    continue: "Continue", allDone: "All caught up for now!", learn: "Learn", learnSoon: "Coming soon",
    practice: "Practice", stageOff: "Not available yet", reviewTitle: "Due for review", close: "Close",
    noContent: "Practice for this topic is being written.",
  },
  ru: {
    unit: "Раздел", next: "Дальше", soon: "Скоро", preview: "Дополнительно", review: "Повторить",
    status: { new: "Новое", practising: "В процессе", review: "Повторить", secure: "Усвоено" },
    secureOf: (a, b) => `${a}/${b} усвоено`, playable: (n) => `Готово тем: ${n}`,
    continue: "Продолжить", allDone: "Пока всё пройдено!", learn: "Теория", learnSoon: "Скоро",
    practice: "Практика", stageOff: "Пока недоступно", reviewTitle: "Нужно повторить", close: "Закрыть",
    noContent: "Упражнения для этой темы готовятся.",
  },
};

const levelOf = (key) => PRACTICE_MANIFEST[key]?.level || null;

function StatusDot({ status, isNext, playable }) {
  if (!playable) {
    return <span className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center"><Lock className="w-3.5 h-3.5 text-muted-foreground/50" /></span>;
  }
  if (status === STATUS.SECURE) {
    return <span className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: ACCENT }}><Check className="w-4 h-4 text-black" strokeWidth={3} /></span>;
  }
  if (status === STATUS.REVIEW) {
    return <span className="w-9 h-9 rounded-full border-2 border-amber-400 bg-amber-400/10 flex items-center justify-center"><RotateCcw className="w-3.5 h-3.5 text-amber-300" /></span>;
  }
  if (status === STATUS.PRACTISING) {
    // Partial ring: a half-filled conic border reads as "in progress" without colour alone.
    return (
      <span className="w-9 h-9 rounded-full p-[2px]" style={{ background: `conic-gradient(${ACCENT} 0 50%, rgba(255,255,255,0.15) 50% 100%)` }}>
        <span className="w-full h-full rounded-full bg-background flex items-center justify-center"><Play className="w-3.5 h-3.5" style={{ color: ACCENT }} /></span>
      </span>
    );
  }
  return (
    <span className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${isNext ? "" : "border-white/25"}`}
      style={isNext ? { borderColor: ACCENT, boxShadow: `0 0 0 4px ${ACCENT}22, 0 0 18px ${ACCENT}66` } : undefined}>
      <span className="w-2 h-2 rounded-full" style={{ background: isNext ? ACCENT : "rgba(255,255,255,0.35)" }} />
    </span>
  );
}

function TopicRow({ t, s, lang, status, isNext, playable, onOpen, last }) {
  return (
    <li className="relative flex gap-3">
      {!last && <span className="absolute left-[17px] top-10 bottom-[-8px] w-px bg-white/10" aria-hidden="true" />}
      <button type="button" onClick={() => onOpen(t.key)} className="relative flex items-center gap-3 w-full text-left py-1.5 group">
        <StatusDot status={status} isNext={isNext} playable={playable} />
        <span className="flex-1 min-w-0">
          <span className={`block text-[15px] font-semibold leading-snug ${playable ? "text-foreground" : "text-muted-foreground/70"}`}>
            {topicLabel(t.key, lang)}
          </span>
          <span className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
            {levelOf(t.key) && <span className="font-mono">{levelOf(t.key)}</span>}
            {!playable && <span>· {s.soon}</span>}
            {playable && status !== STATUS.NEW && <span>· {s.status[status]}</span>}
            {t.optional && <span className="rounded-full border border-white/15 px-1.5">{s.preview}</span>}
          </span>
        </span>
        {isNext && (
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black" style={{ background: ACCENT }}>{s.next}</span>
        )}
      </button>
    </li>
  );
}

function UnitCard({ unit, index, s, lang, statuses, available, next, open, onToggle, onOpenTopic, cardRef }) {
  const p = unitProgress(unit, statuses, available);
  const pct = p.total ? Math.round((p.secure / p.total) * 100) : 0;
  const isCurrent = next?.unitId === unit.id;
  return (
    <section ref={cardRef} className={`premium-card rounded-3xl border ${isCurrent ? "" : "border-white/10"}`}
      style={isCurrent ? { borderColor: `${ACCENT}66` } : undefined}>
      <button type="button" onClick={onToggle} className="w-full flex items-start gap-3 p-4 text-left">
        <span className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold"
          style={{ background: isCurrent ? ACCENT : "rgba(255,255,255,0.06)", color: isCurrent ? "#000" : undefined }}>
          {index + 1}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{s.unit} {index + 1}</span>
          <span className="block text-lg font-bold text-foreground leading-tight">{unit.name[lang] || unit.name.en}</span>
          <span className="block text-[13px] text-muted-foreground mt-0.5 leading-snug">{unit.canDo[lang] || unit.canDo.en}</span>
          <span className="flex items-center gap-2 mt-2">
            <span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: ACCENT }} />
            </span>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              {p.playable > 0 ? s.secureOf(p.secure, p.total) : s.soon}
            </span>
          </span>
        </span>
        <ChevronDown className={`w-5 h-5 mt-2 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <ul className="px-4 pb-4 space-y-1.5">
              {unit.topics.map((t, i) => (
                <TopicRow key={t.key} t={t} s={s} lang={lang}
                  status={statusOf(statuses, t.key)} isNext={next?.key === t.key}
                  playable={available.has(t.key)} onOpen={onOpenTopic} last={i === unit.topics.length - 1} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TopicSheet({ topicKey, s, lang, status, playable, onClose, onStart }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label={s.close} onClick={onClose} className="absolute inset-0 bg-black/60" />
      <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg rounded-t-3xl border border-white/10 bg-background p-5 pb-[calc(env(safe-area-inset-bottom)+20px)]">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{levelOf(topicKey) || ""} {playable ? `· ${s.status[status]}` : ""}</p>
            <h2 className="text-xl font-bold text-foreground leading-tight">{topicLabel(topicKey, lang)}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-muted-foreground" aria-label={s.close}><X className="w-5 h-5" /></button>
        </div>
        {!playable ? (
          <p className="text-sm text-muted-foreground">{s.noContent}</p>
        ) : (
          <>
            <button type="button" disabled className="w-full flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 mb-3 opacity-60">
              <BookOpen className="w-5 h-5" /> <span className="flex-1 text-left font-semibold">{s.learn}</span>
              <span className="text-xs text-muted-foreground">{s.learnSoon}</span>
            </button>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-2">{s.practice}</p>
            <div className="space-y-2">
              {PRACTICE_STAGES.map((st) => {
                const Icon = st.ai ? Lock : st.icon;
                return (
                  <button key={st.id} type="button" disabled={st.ai} onClick={() => onStart(topicKey, st.id)}
                    className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left min-h-[48px] ${st.ai ? "border-white/5 opacity-50" : "border-white/15 hover:bg-white/[0.05]"}`}>
                    <Icon className="w-5 h-5" style={st.ai ? undefined : { color: ACCENT }} />
                    <span className="flex-1">
                      <span className="block font-semibold text-foreground">{st.name}</span>
                      <span className="block text-xs text-muted-foreground">{st.ai ? s.stageOff : st.blurb}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Props:
 *   lang        "uz" | "en" | "ru"
 *   statuses    { [topicKey]: status } from grammarPathState.topicStatuses
 *   available   Set of topic keys that have a practice bank
 *   onStart     (topicKey, stageId) => void — opens a practice round
 *   openKey     topic whose sheet should be open (lets the page reopen it after a round)
 *   onOpenKey   (topicKey | null) => void
 */
export default function GrammarPath({ lang, statuses, available, onStart, openKey, onOpenKey }) {
  const s = STR[lang] || STR.uz;
  const next = useMemo(() => nextTopic(statuses, available), [statuses, available]);
  const reviews = useMemo(() => reviewKeys(statuses), [statuses]);
  const [openUnits, setOpenUnits] = useState(() => new Set(next ? [next.unitId] : [UNITS[0].id]));
  const [showReview, setShowReview] = useState(false);
  const currentRef = useRef(null);

  // Land on the current unit, not the top of a 13-unit list.
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, []);

  const toggle = (id) => setOpenUnits((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const continueNext = () => {
    if (!next) return;
    const st = statusOf(statuses, next.key) === STATUS.PRACTISING ? "build" : "choose";
    onStart(next.key, st);
  };

  return (
    <div className="max-w-lg mx-auto">
      {reviews.length > 0 && (
        <div className="mb-3">
          <button type="button" onClick={() => setShowReview((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
            <RotateCcw className="w-3.5 h-3.5" /> {s.review} {reviews.length}
          </button>
          {showReview && (
            <ul className="premium-card rounded-2xl border border-amber-400/20 mt-2 p-3 space-y-1">
              {reviews.map((k) => (
                <li key={k}><button type="button" onClick={() => onOpenKey(k)} className="text-sm text-foreground hover:underline">{topicLabel(k, lang)}</button></li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="space-y-3">
        {UNITS.map((u, i) => (
          <UnitCard key={u.id} unit={u} index={i} s={s} lang={lang}
            statuses={statuses} available={available} next={next}
            open={openUnits.has(u.id)} onToggle={() => toggle(u.id)} onOpenTopic={onOpenKey}
            cardRef={next?.unitId === u.id ? currentRef : undefined} />
        ))}
      </div>

      {/* One primary action, fixed above the safe area. */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-lg mx-auto">
          <button type="button" onClick={continueNext} disabled={!next}
            className="w-full h-14 rounded-2xl font-bold text-base text-black flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: ACCENT }}>
            {next ? (<><Sparkles className="w-5 h-5" /> {s.continue} · {topicLabel(next.key, lang)}</>) : s.allDone}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {openKey && (
          <TopicSheet topicKey={openKey} s={s} lang={lang} status={statusOf(statuses, openKey)}
            playable={available.has(openKey)} onClose={() => onOpenKey(null)}
            onStart={(k, st) => { onOpenKey(null); onStart(k, st); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
