import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Play, ArrowRight, Check, Star, Zap, Target, Loader2 } from "lucide-react";
import { coachApi, progressApi } from "@/lib/serverApi";
import { useAppLang } from "@/hooks/useAppLang";
import { COACH_NAMES, COACH_COLORS } from "@/lib/coach/coachCopy";

// Comeback Card (Comeback Revamp Phase 1, Claude 2026-11-10). The top of Home:
// one clear "do this now", a daily streak, and three daily missions that pay
// XP. Replaces the separate Coach card and Today's Mission card, so a student
// opening the app sees ONE thing to do instead of a wall of options.
//
// Everything is server-side (progressApi.getComeback / claimMission), on the
// same day log as the admin Comeback tracker: a day counts when the student
// finishes a round or a lesson answer, on Tashkent time.
//
// uz/ru copy are first drafts: need Tee's native check.

const COPY = {
  en: {
    streak: (n) => (n === 1 ? "1-day streak" : `${n}-day streak`),
    noStreak: "Start your streak",
    best: (n) => `Best ${n}`,
    todayDone: "Today's done. Your streak is safe. See you tomorrow!",
    keep: (n) => `Finish one practice today to keep your ${n}-day streak.`,
    start0: "Finish one practice today to start your streak.",
    cta: "Start today's practice",
    ctaMore: "Keep going",
    picked: (coach) => `${coach} picked it for you`,
    missions: "Daily missions",
    claim: (n) => `Claim +${n} XP`,
    claimed: (n) => `+${n} XP`,
    m: { show_up: "Finish one practice", correct_20: "Get 20 answers right", score_80: "Score 80% or more in one round" },
    claimFail: "Couldn't claim right now. Try again.",
    days: ["S", "M", "T", "W", "T", "F", "S"],
  },
  uz: {
    streak: (n) => `${n} kunlik streak`,
    noStreak: "Streakni boshlang",
    best: (n) => `Eng yaxshi: ${n}`,
    todayDone: "Bugungi mashg'ulot bajarildi. Streak saqlandi. Ertaga ko'rishguncha!",
    keep: (n) => `${n} kunlik streakni saqlash uchun bugun bitta mashqni bajaring.`,
    start0: "Streakni boshlash uchun bugun bitta mashqni bajaring.",
    cta: "Bugungi mashg'ulotni boshlash",
    ctaMore: "Davom etish",
    picked: (coach) => `${coach} siz uchun tanladi`,
    missions: "Kunlik vazifalar",
    claim: (n) => `+${n} XP olish`,
    claimed: (n) => `+${n} XP`,
    m: { show_up: "Bitta mashqni bajaring", correct_20: "20 ta to'g'ri javob bering", score_80: "Bitta raundda 80%+ natija" },
    claimFail: "Hozir olib bo'lmadi. Qaytadan urinib ko'ring.",
    days: ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"],
  },
  ru: {
    streak: (n) => `Серия: ${n} дн.`,
    noStreak: "Начните серию",
    best: (n) => `Рекорд: ${n}`,
    todayDone: "На сегодня всё. Серия сохранена. До завтра!",
    keep: (n) => `Выполните одну практику сегодня, чтобы сохранить серию в ${n} дн.`,
    start0: "Выполните одну практику сегодня, чтобы начать серию.",
    cta: "Начать практику на сегодня",
    ctaMore: "Продолжить",
    picked: (coach) => `${coach} подобрала её для вас`,
    missions: "Задания дня",
    claim: (n) => `Забрать +${n} XP`,
    claimed: (n) => `+${n} XP`,
    m: { show_up: "Выполните одну практику", correct_20: "Дайте 20 правильных ответов", score_80: "Наберите 80%+ в одном раунде" },
    claimFail: "Сейчас не получилось. Попробуйте ещё раз.",
    days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  },
};

const MISSION_ICONS = { show_up: Flame, correct_20: Zap, score_80: Target };

export default function ComebackCard({ onState }) {
  const navigate = useNavigate();
  const { lang } = useAppLang();
  const c = COPY[lang] || COPY.en;
  const [state, setState] = useState(null);
  const [failed, setFailed] = useState(false);
  const [persona, setPersona] = useState("vira");
  const [claiming, setClaiming] = useState(null);
  const [claimError, setClaimError] = useState(null);
  const [burst, setBurst] = useState(null);

  const apply = useCallback((s) => { setState(s); onState?.(s); }, [onState]);

  useEffect(() => {
    progressApi("getComeback").then(apply).catch(() => setFailed(true));
    coachApi("whoami", {}).then((w) => w?.persona && setPersona(w.persona)).catch(() => {});
  }, [apply]);

  const claim = async (id) => {
    setClaiming(id); setClaimError(null);
    try {
      const res = await progressApi("claimMission", { mission_id: id });
      apply(res);
      if (res.amount > 0) { setBurst({ id, amount: res.amount }); setTimeout(() => setBurst(null), 1400); }
    } catch {
      setClaimError(id);
    } finally {
      setClaiming(null);
    }
  };

  const color = COACH_COLORS[persona] || COACH_COLORS.vira;
  const streak = state?.streak?.current || 0;
  const todayDone = !!state?.streak?.today_done;
  const status = !state ? "" : todayDone ? c.todayDone : streak > 0 ? c.keep(streak) : c.start0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative premium-card p-5 md:p-6 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${color}22, transparent 60%)` }}
    >
      {/* Streak + XP */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <motion.span
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${streak > 0 ? "bg-orange-500/20" : "bg-white/5"}`}
            animate={streak > 0 && !todayDone ? { scale: [1, 1.07, 1] } : {}}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <Flame className={`w-7 h-7 ${streak > 0 ? "text-orange-400" : "text-muted-foreground"}`} />
          </motion.span>
          <div className="min-w-0">
            <p className="text-xl font-bold text-foreground leading-tight">
              {!state ? " " : streak > 0 ? c.streak(streak) : c.noStreak}
            </p>
            {state?.streak?.best > 1 && <p className="text-[11px] text-muted-foreground">{c.best(state.streak.best)}</p>}
          </div>
        </div>
        {state && (
          <span className="neo-pill px-2.5 h-8 text-xs font-semibold text-amber-200 shrink-0 tabular-nums">
            <Star className="w-3.5 h-3.5 text-amber-300" /> {state.xp.toLocaleString()} XP
          </span>
        )}
      </div>

      {/* Last 7 days */}
      {state?.week && (
        <div className="mt-4 grid grid-cols-7 gap-1.5" aria-hidden="true">
          {state.week.map((d) => {
            const dt = new Date(d.day + "T00:00:00Z");
            const isToday = d.day === state.today;
            return (
              <div key={d.day} className="flex flex-col items-center gap-1">
                <span className={`text-[10px] ${isToday ? "text-foreground font-bold" : "text-muted-foreground"}`}>{c.days[dt.getUTCDay()]}</span>
                <span
                  className={`h-7 w-full max-w-[34px] rounded-lg flex items-center justify-center ${d.learned ? "bg-orange-500/80" : isToday ? "border border-dashed border-orange-400/60" : "bg-white/5"}`}
                >
                  {d.learned && <Check className="w-3.5 h-3.5 text-white" />}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {status && <p className="mt-3 text-sm text-muted-foreground">{status}</p>}
      {failed && !state && <p className="mt-3 text-sm text-muted-foreground">{c.start0}</p>}

      {/* The one thing to do */}
      <button
        data-tour="today-start"
        onClick={() => navigate("/coach")}
        className="hero-continue relative mt-4 w-full h-14 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 select-none overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${color}, ${color}bb)`, opacity: todayDone ? 0.85 : 1 }}
      >
        <Play className="w-5 h-5" /> {todayDone ? c.ctaMore : c.cta} <ArrowRight className="w-4 h-4 opacity-80" />
      </button>
      <p className="mt-1.5 text-center text-[11px] text-muted-foreground">{c.picked(COACH_NAMES[persona] || "Vira")}</p>

      {/* Daily missions */}
      <div data-tour="missions" className="mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{c.missions}</h3>
          {state && <span className="text-[10px] text-muted-foreground tabular-nums">{state.missions.filter((m) => m.done).length}/{state.missions.length}</span>}
        </div>
        <div className="space-y-2">
          {!state && !failed && [0, 1, 2].map((i) => <div key={i} className="h-14 rounded-2xl bg-white/[0.04] animate-pulse" />)}
          {state?.missions.map((m) => {
            const Icon = MISSION_ICONS[m.id] || Zap;
            const pct = Math.round((m.progress / m.target) * 100);
            return (
              <div key={m.id} className={`relative rounded-2xl border p-3 ${m.done ? "border-orange-400/40 bg-orange-500/[0.07]" : "border-white/10 bg-white/[0.03]"}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.done ? "bg-orange-500/80" : "bg-white/5"}`}>
                    <Icon className={`w-4 h-4 ${m.done ? "text-white" : "text-foreground"}`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{c.m[m.id] || m.id}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-orange-400" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                        {m.id === "score_80" ? `${m.progress}%` : `${m.progress}/${m.target}`}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 relative">
                    {m.claimed ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-orange-300"><Check className="w-3.5 h-3.5" /> {c.claimed(m.reward)}</span>
                    ) : m.done ? (
                      <button
                        onClick={() => claim(m.id)}
                        disabled={claiming === m.id}
                        className="h-8 px-3 rounded-xl bg-amber-400 text-black text-xs font-bold select-none disabled:opacity-60 flex items-center gap-1"
                      >
                        {claiming === m.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}{c.claim(m.reward)}
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground/70">{c.claimed(m.reward)}</span>
                    )}
                    <AnimatePresence>
                      {burst?.id === m.id && (
                        <motion.span
                          initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -26 }} exit={{ opacity: 0 }}
                          className="absolute right-0 -top-1 text-sm font-bold text-amber-300 pointer-events-none"
                        >
                          +{burst.amount} XP
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                {claimError === m.id && <p className="mt-1.5 text-[11px] text-rose-300">{c.claimFail}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
