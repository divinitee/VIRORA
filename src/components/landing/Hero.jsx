import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppLang } from "@/hooks/useAppLang";
import RoadmapBeacon from "@/components/landing/RoadmapBeacon";
import { LAUNCH_DATE } from "@/lib/appMeta";

const ease = [0.22, 1, 0.36, 1];

// Returning students kept tapping "Start for free" and registering a second
// account (Oct 2026: ~10 duplicate accounts in User). So the hero now offers
// "I have an account — Log in" as the second button, and a device that has
// been signed in before (flag set in AuthContext) sees Log in FIRST.
const RETURNING = {
  uz: { welcome: "Qaytganingizdan xursandmiz! Hisobingiz bor — shunchaki kiring.", have: "Hisobim bor — Kirish", newHere: "Yangi hisob ochish" },
  en: { welcome: "Welcome back! You already have an account — just log in.", have: "I have an account — Log in", newHere: "Create a new account" },
  ru: { welcome: "С возвращением! У вас уже есть аккаунт — просто войдите.", have: "У меня есть аккаунт — Войти", newHere: "Создать новый аккаунт" },
};

function isReturningDevice() {
  try { return localStorage.getItem("virora_has_account") === "1"; } catch { return false; }
}

export default function Hero() {
  const { t, lang } = useAppLang();
  const r = RETURNING[lang] || RETURNING.uz;
  const returning = isReturningDevice();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-50 via-slate-50 to-slate-50 landing-dark:from-slate-900 landing-dark:via-slate-950 landing-dark:to-slate-950" />
      <div className="absolute inset-0 -z-10 premium-mesh opacity-70" />
      <div className="absolute inset-0 -z-10 premium-grain" />
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-20 lg:pt-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700 landing-dark:text-blue-300 bg-sky-100 landing-dark:bg-blue-950/50 px-3 py-1.5 rounded-full cursor-default"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
            </span>
            VIRORA IS NOW LIVE
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.02 }}
            className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 landing-dark:text-slate-500"
          >
            <Sparkles className="w-3 h-3" /> First Public Release · {LAUNCH_DATE}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 landing-dark:text-slate-50 leading-[1.1]"
          >
            {t("landing.hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.12 }}
            className="mt-5 text-lg text-slate-500 landing-dark:text-slate-400 max-w-md"
          >
            {t("landing.hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {returning ? (
              <>
                <p className="w-full text-sm font-medium text-slate-600 landing-dark:text-slate-300">{r.welcome}</p>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/login">
                    <Button className="h-12 px-6 text-base">
                      <LogIn className="w-4 h-4 mr-2" /> {t("landing.nav.login")}
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register">
                    <Button variant="outline" className="h-12 px-6 text-base bg-white landing-dark:bg-slate-900 border-slate-200 landing-dark:border-slate-700 text-slate-700 landing-dark:text-slate-200 hover:bg-slate-50 landing-dark:hover:bg-slate-800">
                      {r.newHere}
                    </Button>
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register">
                    <Button className="h-12 px-6 text-base">
                      {t("landing.hero.cta_primary")} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/login">
                    <Button variant="outline" className="h-12 px-6 text-base bg-white landing-dark:bg-slate-900 border-slate-200 landing-dark:border-slate-700 text-slate-700 landing-dark:text-slate-200 hover:bg-slate-50 landing-dark:hover:bg-slate-800">
                      <LogIn className="w-4 h-4 mr-2" /> {r.have}
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          <p className="mt-4 text-xs text-slate-400 landing-dark:text-slate-500">{t("landing.hero.caption")}</p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 landing-dark:border-slate-700 bg-white/70 landing-dark:bg-slate-900/60 px-3 py-2 text-xs text-slate-500 landing-dark:text-slate-400">
            <span className="font-semibold text-slate-700 landing-dark:text-slate-200">LAUNCH DAY</span>
            <span>·</span>
            <span>September 14, 2026</span>
          </div>
        </div>

        <RoadmapBeacon />
      </div>
    </section>
  );
}