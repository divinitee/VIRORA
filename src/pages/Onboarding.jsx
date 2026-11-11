import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowRight, Loader2, AlertTriangle, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { chooseFreePlan } from "@/lib/subscription";
import ProfileSetup from "@/components/onboarding/ProfileSetup";
import { needsProfileSetup } from "@/lib/profileStatus";
import { useAppLang } from "@/hooks/useAppLang";
import { coachApi } from "@/lib/serverApi";
import { coachT, goalLabel } from "@/lib/coach/coachCopy";

// Post-registration flow for students (Comeback Revamp, Tee 11 Nov 2026).
//
// Before: plan pitch -> "are you sure, free?" -> 3 outdated tutorial slides
// -> "Take the placement test now" -> Home -> app tour -> Coach setup. About a
// dozen screens before a single word, and people auto-click the blue button,
// so most landed in a placement test they never chose (friction on day one).
//
// Now: ONE screen, then the first practice.
//   - One question that matters: what do you want first? (it becomes the
//     Coach's goal, so the Coach's own setup screen is skipped).
//   - Tee's wake-up: the big blue button does nothing useful until an answer
//     is picked. Clicking it blindly shakes the card and says, in the
//     student's language, "you're clicking through blindly - signing up for
//     what? why?". Nobody is punished; they just have to look once.
//   - Then straight into the first practice. The app tour runs on Home
//     afterwards, once they have done something.
//   - The free plan / trial is started silently (no pitch before any value);
//     the placement test is a small optional link, never the default.
//
// uz/ru copy are drafts for a native check.

const COPY = {
  en: {
    kicker: "One question before you start",
    title: "What do you want first?",
    sub: "Your coach builds your first practice around this.",
    wake: "Hold on. You're clicking through blindly. Signing up to what? Why? Pick what you want first: it decides your very first practice.",
    blank: "Continue",
    go: "Start my first practice",
    test: "Not sure of your level? Take a 5-minute test instead",
    fail: "Couldn't save that. Check your connection and try again.",
  },
  uz: {
    kicker: "Boshlashdan oldin bitta savol",
    title: "Avval nimani xohlaysiz?",
    sub: "Murabbiyingiz birinchi mashg'ulotingizni shunga qarab tuzadi.",
    wake: "To'xtang. Siz ko'r-ko'rona bosib o'tyapsiz. Nimaga ro'yxatdan o'tyapsiz? Nima uchun? Avval nimani xohlashingizni tanlang: birinchi mashg'ulotingiz shunga bog'liq.",
    blank: "Davom etish",
    go: "Birinchi mashg'ulotni boshlash",
    test: "Darajangizni bilmaysizmi? Buning o'rniga 5 daqiqalik test topshiring",
    fail: "Saqlab bo'lmadi. Internetni tekshirib, qaytadan urinib ko'ring.",
  },
  ru: {
    kicker: "Один вопрос перед стартом",
    title: "Что вам нужно в первую очередь?",
    sub: "Ваш коуч построит первую практику вокруг этого.",
    wake: "Стоп. Вы кликаете не глядя. Регистрируетесь — на что? Зачем? Выберите, что вам нужно в первую очередь: от этого зависит ваша первая практика.",
    blank: "Продолжить",
    go: "Начать первую практику",
    test: "Не уверены в своём уровне? Пройдите 5-минутный тест",
    fail: "Не удалось сохранить. Проверьте интернет и попробуйте ещё раз.",
  },
};

// The Coach's goals (base44/shared/coachGraph.js GOALS). Labels come from coachCopy.
const GOAL_IDS = ["everyday", "vocabulary", "grammar_basics"];

function GoalStep({ onDone }) {
  const navigate = useNavigate();
  const { lang } = useAppLang();
  const c = COPY[lang] || COPY.en;
  const t = coachT(lang, "vira");
  const [goal, setGoal] = useState(null);
  const [woke, setWoke] = useState(false);
  const [shake, setShake] = useState(0);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const press = async () => {
    if (!goal) { setWoke(true); setShake((n) => n + 1); return; }
    setBusy(true); setFailed(false);
    try {
      await onDone(); // plan/trial first: the coach is resolved from the subscription
      await coachApi("saveProfile", { goal_id: goal, onboarded: true });
      navigate("/coach");
    } catch (e) {
      console.error("onboarding save failed", e);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full">
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -10, 10, -7, 7, -3, 0] } : {}}
        transition={{ duration: 0.45 }}
      >
        <Target className="w-10 h-10 text-blue-500 mb-4" />
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{c.kicker}</p>
        <h1 className="text-2xl font-bold text-foreground mt-1 mb-2">{c.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">{c.sub}</p>

        <div className="space-y-2.5" role="radiogroup" aria-label={c.title}>
          {GOAL_IDS.map((id) => {
            const on = goal === id;
            return (
              <button
                key={id}
                role="radio"
                aria-checked={on}
                onClick={() => { setGoal(id); setWoke(false); }}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 text-sm font-medium flex items-center gap-3 select-none transition-colors ${on ? "border-blue-500 bg-blue-500/10 text-foreground" : woke ? "border-amber-400/70 text-foreground" : "border-border text-foreground"}`}
              >
                <span className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${on ? "border-blue-500 bg-blue-500" : "border-muted-foreground/40"}`}>
                  {on && <Check className="w-3 h-3 text-white" />}
                </span>
                {goalLabel(t, { id })}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {woke && (
            <motion.p
              data-testid="wake-up"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex gap-2 rounded-xl border border-amber-400/50 bg-amber-400/10 px-3 py-2.5 text-sm font-medium text-amber-200"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {c.wake}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <button
        onClick={press}
        disabled={busy}
        className="mt-6 w-full h-14 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 text-white font-semibold shadow-lg flex items-center justify-center gap-2 select-none disabled:opacity-70"
      >
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        {goal ? c.go : c.blank} {!busy && <ArrowRight className="w-4 h-4" />}
      </button>
      {failed && <p className="mt-2 text-xs text-rose-300 text-center">{c.fail}</p>}

      <button
        onClick={async () => { await onDone(); navigate("/placement-test"); }}
        className="mt-4 text-xs text-muted-foreground hover:text-foreground underline select-none"
      >
        {c.test}
      </button>
    </div>
  );
}

export default function Onboarding() {
  // null = still checking. A Google signup reaches the app without ever having
  // seen the registration form, so the four profile questions run here first.
  const [setupUser, setSetupUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const me = await base44.auth.me().catch(() => null);
      if (cancelled) return;
      if (me && needsProfileSetup(me)) setSetupUser(me);
      setChecked(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // Free plan / trial, started silently. chooseFreePlan dedupes in flight.
  const startPlan = async () => {
    const me = await base44.auth.me().catch(() => null);
    if (me) await chooseFreePlan();
  };

  if (!checked) return <div className="min-h-screen bg-background" />;

  if (setupUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col py-8">
        <ProfileSetup user={setupUser} onDone={() => setSetupUser(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col py-8">
      <GoalStep onDone={startPlan} />
    </div>
  );
}
