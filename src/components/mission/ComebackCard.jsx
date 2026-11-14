import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Play, ArrowRight, Check, Star, Zap, Target, Loader2, Gift, Sparkles, Compass } from "lucide-react";
import { pathCopy } from "@/lib/learnerPath";
import { coachApi, progressApi } from "@/lib/serverApi";
import { useAppLang } from "@/hooks/useAppLang";
import { COACH_NAMES, COACH_COLORS } from "@/lib/coach/coachCopy";
import { VixelIcon, vixelsFromXp, xpToNextVixel, XP_PER_VIXEL } from "@/components/economy/Vixels";

// Comeback Card (Comeback Revamp Phase 1, Claude 2026-11-10).
//
// variant "home"  (default) the top of Home: streak, ONE "do this now" button,
//                 three daily missions that pay XP, and what tomorrow earns.
// variant "after" the same card on the Coach's Done screen, without the
//                 button: the streak tick and "come back tomorrow for +N XP"
//                 land at the exact moment a practice ends, which is when the
//                 decision to return is made.
//
// One path (14 Nov 2026): when Home passes `primary`, the one button becomes
// the path's Continue (src/lib/learnerPath.js) and the Coach's practice moves
// to a smaller "Today's practice" button beside "Free roam". Without `primary`
// (path finished, or its load failed) the button is the Coach's, as before.
//   primary     { label, hint, onClick, loading } | null
//   onFreeRoam  () => void  (opens the Skill Hub tab)
//
// Everything is server-side (progressApi.getComeback / claimMission), on the
// same day log as the admin Comeback tracker: a day counts when the student
// finishes a round or a lesson answer, on Tashkent time.
//
// uz/ru copy are first drafts: need a native check.

const COPY = {
  en: {
    streak: (n) => (n === 1 ? "1-day streak" : `${n}-day streak`),
    noStreak: "Start your streak",
    best: (n) => `Best ${n}`,
    todayDone: "Today's done. Your streak is safe.",
    keep: (n) => `Finish one practice today to keep your ${n}-day streak.`,
    start0: "Finish one practice today to start your streak.",
    hookTomorrow: (r, d) => `Come back tomorrow: +${r} XP for a ${d}-day streak.`,
    hookToday: (r, d) => `Practise today: +${r} XP for a ${d}-day streak.`,
    hookLater: (n, r) => `${n} more days in a row: +${r} XP bonus.`,
    cta: "Start today's practice",
    ctaMore: "Keep going",
    picked: (coach) => `${coach} picked it for you`,
    missions: "Daily missions",
    claim: (n) => `Claim +${n} XP`,
    claimed: (n) => `+${n} XP`,
    m: { show_up: "Finish one practice", answer_20: "Answer 20 questions", correct_15: "Get 15 answers right" },
    bonus: (d) => `${d}-day streak bonus`,
    claimFail: "Couldn't claim right now. Try again.",
    days: ["S", "M", "T", "W", "T", "F", "S"],
    vxName: "Vixels",
    vxTap: "Show Vixels",
    vxNext: (n) => `${n} XP to your next Vixel`,
  },
  uz: {
    streak: (n) => `${n} kunlik streak`,
    noStreak: "Streakni boshlang",
    best: (n) => `Eng yaxshi: ${n}`,
    todayDone: "Bugungi mashg'ulot bajarildi. Streak saqlandi.",
    keep: (n) => `${n} kunlik streakni saqlash uchun bugun bitta mashqni bajaring.`,
    start0: "Streakni boshlash uchun bugun bitta mashqni bajaring.",
    hookTomorrow: (r, d) => `Ertaga qayting: ${d} kunlik streak uchun +${r} XP.`,
    hookToday: (r, d) => `Bugun mashq qiling: ${d} kunlik streak uchun +${r} XP.`,
    hookLater: (n, r) => `Yana ${n} kun ketma-ket: +${r} XP bonus.`,
    cta: "Bugungi mashg'ulotni boshlash",
    ctaMore: "Davom etish",
    picked: (coach) => `${coach} siz uchun tanladi`,
    missions: "Kunlik vazifalar",
    claim: (n) => `+${n} XP olish`,
    claimed: (n) => `+${n} XP`,
    m: { show_up: "Bitta mashqni bajaring", answer_20: "20 ta savolga javob bering", correct_15: "15 ta to'g'ri javob bering" },
    bonus: (d) => `${d} kunlik streak bonusi`,
    claimFail: "Hozir olib bo'lmadi. Qaytadan urinib ko'ring.",
    days: ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"],
    vxName: "Vixels",
    vxTap: "Vixellarni ko'rsatish",
    vxNext: (n) => `Keyingi Vixelgacha ${n} XP`,
  },
  ru: {
    streak: (n) => `Серия: ${n} дн.`,
    noStreak: "Начните серию",
    best: (n) => `Рекорд: ${n}`,
    todayDone: "На сегодня всё. Серия сохранена.",
    keep: (n) => `Выполните одну практику сегодня, чтобы сохранить серию в ${n} дн.`,
    start0: "Выполните одну практику сегодня, чтобы начать серию.",
    hookTomorrow: (r, d) => `Возвращайтесь завтра: +${r} XP за серию в ${d} дн.`,
    hookToday: (r, d) => `Позанимайтесь сегодня: +${r} XP за серию в ${d} дн.`,
    hookLater: (n, r) => `Ещё ${n} дн. подряд: бонус +${r} XP.`,
    cta: "Начать практику на сегодня",
    ctaMore: "Продолжить",
    picked: (coach) => `${coach} подобрала её для вас`,
    missions: "Задания дня",
    claim: (n) => `Забрать +${n} XP`,
    claimed: (n) => `+${n} XP`,
    m: { show_up: "Выполните одну практику", answer_20: "Ответьте на 20 вопросов", correct_15: "Дайте 15 правильных ответов" },
    bonus: (d) => `Бонус за серию в ${d} дн.`,
    claimFail: "Сейчас не получилось. Попробуйте ещё раз.",
    days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    vxName: "Vixels",
    vxTap: "Показать Vixels",
    vxNext: (n) => `До следующего Vixel: ${n} XP`,
  },
};

const MISSION_ICONS = { show_up: Flame, answer_20: Zap, correct_15: Target };

// The line under the week strip: what the next practice day is worth.
function hookLine(c, state) {
  const nb = state?.next_bonus;
  if (!nb) return null;
  if (nb.days_left === 1) return state.streak.today_done ? c.hookTomorrow(nb.reward, nb.day) : c.hookToday(nb.reward, nb.day);
  // days_left = practice days still needed (today counts if it isn't done yet).
  return c.hookLater(nb.days_left, nb.reward);
}

export default function ComebackCard({ onState, variant = "home", primary = null, onFreeRoam = null }) {
  const navigate = useNavigate();
  const { lang } = useAppLang();
  const c = COPY[lang] || COPY.en;
  const pc = pathCopy(lang);
  const [state, setState] = useState(null);
  const [failed, setFailed] = useState(false);
  const [persona, setPersona] = useState("vira");
  const [claiming, setClaiming] = useState(null);
  const [claimError, setClaimError] = useState(null);
  const [burst, setBurst] = useState(null);
  const [showVx, setShowVx] = useState(false);
  const isHome = variant === "home";

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

  // On the Done screen a failed load shows nothing: never block the recap.
  if (!isHome && (failed || !state)) return null;

  const color = COACH_COLORS[persona] || COACH_COLORS.vira;
  const streak = state?.streak?.current || 0;
  const todayDone = !!state?.streak?.today_done;
  const status = !state ? "" : todayDone ? c.todayDone : streak > 0 ? c.keep(streak) : c.start0;
  const hook = hookLine(c, state);
  // Streak bonuses first: they are the reward for coming back.
  const rows = state ? [
    ...state.bonuses.map((b) => ({ ...b, label: c.bonus(b.day), Icon: Gift, bonus: true })),
    ...state.missions.map((m) => ({ ...m, label: c.m[m.id] || m.id, Icon: MISSION_ICONS[m.id] || Zap })),
  ] : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative premium-card p-5 md:p-6 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${color}22, transparent 60%)` }}
      data-testid={`comeback-${variant}`}
    >
      {/* Streak + XP */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <motion.span
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${streak > 0 ? "bg-orange-500/20" : "bg-white/5"}`}
            initial={!isHome ? { scale: 0.6 } : false}
            animate={!isHome ? { scale: [0.6, 1.25, 1] } : streak > 0 && !todayDone ? { scale: [1, 1.07, 1] } : {}}
            transition={!isHome ? { duration: 0.7 } : { duration: 2.4, repeat: Infinity }}
          >
            <Flame className={`w-7 h-7 ${streak > 0 ? "text-orange-400" : "text-muted-foreground"}`} />
          </motion.span>
          <div className="min-w-0">
            <p className="text-xl font-bold text-foreground leading-tight">
              {!state ? " " : streak > 0 ? c.streak(streak) : c.noStreak}
            </p>
            {state?.streak?.best > 1 && <p className="text-[11px] text-muted-foreground">{c.best(state.streak.best)}</p>}
          </div>
        </div>
        {state && (
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <AnimatePresence initial={false}>
                {showVx && (
                  <motion.span
                    key="vx"
                    initial={{ opacity: 0, x: 10, scale: 0.85 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.85 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="neo-pill px-2.5 h-8 text-xs font-semibold text-amber-100 tabular-nums"
                    style={{ borderColor: "rgba(124,82,201,0.6)", background: "#140a2e" }}
                    data-testid="vixel-balance"
                  >
                    <VixelIcon className="w-4 h-4" title={c.vxName} /> {vixelsFromXp(state.xp).toLocaleString()}
                  </motion.span>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => setShowVx((v) => !v)}
                aria-expanded={showVx}
                aria-label={`${state.xp.toLocaleString()} XP. ${c.vxTap}`}
                className="neo-pill px-2.5 h-8 text-xs font-semibold text-amber-200 tabular-nums cursor-pointer transition-transform active:scale-95"
                data-testid="xp-chip"
              >
                <Star className="w-3.5 h-3.5 text-amber-300" /> {state.xp.toLocaleString()} XP
              </button>
            </div>
            <AnimatePresence initial={false}>
              {showVx && (
                <motion.p
                  key="vx-next"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-[10px] text-muted-foreground tabular-nums"
                  title={`${XP_PER_VIXEL} XP = 1 Vixel`}
                >
                  {c.vxNext(xpToNextVixel(state.xp))}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
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
      {hook && (
        <p data-testid="comeback-hook" className="mt-2 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/[0.08] px-3 py-2 text-sm font-semibold text-amber-200">
          <Gift className="w-4 h-4 shrink-0" /> {hook}
        </p>
      )}

      {/* The one thing to do */}
      {isHome && (
        <>
          <button
            data-tour="today-start"
            data-testid="home-primary"
            onClick={primary ? primary.onClick : () => navigate("/coach")}
            disabled={!!primary?.loading}
            className="hero-continue relative mt-4 w-full h-14 px-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 select-none overflow-hidden min-w-0 disabled:opacity-60"
            style={{ background: `linear-gradient(180deg, ${color}, ${color}bb)`, opacity: !primary && todayDone ? 0.85 : undefined }}
          >
            <Play className="w-5 h-5 shrink-0" /> <span className="truncate">{primary ? primary.label : todayDone ? c.ctaMore : c.cta}</span> <ArrowRight className="w-4 h-4 opacity-80 shrink-0" />
          </button>
          <p className="mt-1.5 text-center text-[11px] text-muted-foreground truncate">{primary ? primary.hint : c.picked(COACH_NAMES[persona] || "Vira")}</p>
          {primary && (
            <div className="mt-3" data-testid="path-alternatives">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{pc.or}</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-testid="home-coach"
                  onClick={() => navigate("/coach")}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2.5 text-left select-none min-w-0"
                >
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><Sparkles className="w-4 h-4 shrink-0" style={{ color }} /> <span className="truncate">{pc.suggested}</span></span>
                  <span className="block text-[11px] text-muted-foreground truncate">{pc.suggestedSub(COACH_NAMES[persona] || "Vira")}</span>
                </button>
                <button
                  type="button"
                  data-testid="home-free"
                  onClick={() => onFreeRoam?.()}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2.5 text-left select-none min-w-0"
                >
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><Compass className="w-4 h-4 shrink-0 text-teal-300" /> <span className="truncate">{pc.free}</span></span>
                  <span className="block text-[11px] text-muted-foreground truncate">{pc.freeSub}</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Daily missions + streak bonuses */}
      <div data-tour={isHome ? "missions" : undefined} className="mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{c.missions}</h3>
          {state && <span className="text-[10px] text-muted-foreground tabular-nums">{state.missions.filter((m) => m.done).length}/{state.missions.length}</span>}
        </div>
        <div className="space-y-2">
          {!state && !failed && [0, 1, 2].map((i) => <div key={i} className="h-14 rounded-2xl bg-white/[0.04] animate-pulse" />)}
          {rows.map((m) => {
            const pct = m.bonus ? 100 : Math.round((m.progress / m.target) * 100);
            return (
              <div key={m.id} className={`relative rounded-2xl border p-3 ${m.bonus ? "border-amber-400/50 bg-amber-400/[0.08]" : m.done ? "border-orange-400/40 bg-orange-500/[0.07]" : "border-white/10 bg-white/[0.03]"}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.bonus ? "bg-amber-400" : m.done ? "bg-orange-500/80" : "bg-white/5"}`}>
                    <m.Icon className={`w-4 h-4 ${m.bonus ? "text-black" : m.done ? "text-white" : "text-foreground"}`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{m.label}</p>
                    {!m.bonus && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div className="h-full rounded-full bg-orange-400" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{m.progress}/{m.target}</span>
                      </div>
                    )}
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
