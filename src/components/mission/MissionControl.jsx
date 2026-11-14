import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAppLang } from "@/hooks/useAppLang";
import { DASH_STR, getGreetingKey } from "@/lib/dashboardData";
import HeroCard from "./HeroCard";
import PathCard from "./PathCard";
import { useLearnerPath } from "@/hooks/useLearnerPath";
import { pathCopy, stopHref, stopLabel, unitName } from "@/lib/learnerPath";
import ComebackCard from "./ComebackCard";
import ProgressSnapshot from "./ProgressSnapshot";
import RecentAchievement from "./RecentAchievement";
import QuickActions from "./QuickActions";
import { useSkillStateWithStatus } from "@/hooks/useSkillState";
import { resolveUserName } from "@/lib/profileName";
import ViraBubble from "@/components/mascot/ViraBubble";
import { homeMoment } from "@/lib/mascot/vira";

export const ACCENT = "#3b82f6";
export const ACCENT_GLOW = "rgba(59,130,246,0.5)";

const todayKey = () => new Date().toDateString();

function computeStreak(results) {
  if (!results?.length) return 0;
  const days = new Set(results.map((r) => new Date(r.created_date).toDateString()));
  let d = new Date();
  if (!days.has(d.toDateString())) {
    d.setDate(d.getDate() - 1);
    if (!days.has(d.toDateString())) return 0;
  }
  let streak = 0;
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// units/selectedUnit/selectedUnitName/onOpenUnitDrawer are still passed down
// from Home.jsx (the old unit-quiz system they describe still exists) but
// the dashboard no longer surfaces an entry point to it — Vocab Journey was
// removed as redundant, see project handoff doc.
export default function MissionControl({
  user,
  results,
  onNavigate,
  // Teacher-set homework (StudentHomework). Rendered first: it's the only
  // thing on this screen with a deadline someone else set.
  homeworkSlot = null,
}) {
  const { lang, t } = useAppLang();
  const navigate = useNavigate();
  const s = DASH_STR[lang] || DASH_STR.en;

  // The ONE path (14 Nov 2026, src/lib/learnerPath.js). Home's single primary
  // button is its Continue. If the path can't be read, or every ready stop is
  // done, `primary` stays null and the button is the Coach's, as before.
  const path = useLearnerPath(user?.email);
  const pc = pathCopy(lang);
  const nextStop = path.state?.next || null;
  const primary = path.loading
    ? { label: pc.cont, hint: pc.hint, onClick: () => {}, loading: true }
    : nextStop
      ? {
          label: pc.contTo(stopLabel(nextStop, lang)),
          hint: nextStop.kind === "lesson"
            ? `${pc.lesson} · ${pc.hint}`
            : `${pc.unit(path.state.unit.index + 1)} · ${unitName(nextStop.unitId, lang)}`,
          onClick: () => navigate(stopHref(nextStop)),
        }
      : null;
  const [xpRecord, setXpRecord] = useState(null);
  // Comeback Card state (server streak + XP). Once loaded it is the ONE source
  // for the streak shown anywhere on Home, so two different numbers never show.
  const [comeback, setComeback] = useState(null);

  useEffect(() => {
    if (!user) return;
    // UserCoins is the underlying storage entity for XP — kept unchanged
    // internally to avoid a data migration; the dashboard presents it
    // purely as XP.
    base44.entities.UserCoins
      .filter({ user_id: user.id })
      .then((r) => {
        if (r && r[0]) setXpRecord(r[0]);
      })
      .catch(() => {});
  }, [user]);

  // VT-6: server SkillState (current mastery), not the old lifetime peak.
  const { state: skillState, error: skillStateError } = useSkillStateWithStatus(user);
  const skillHubToday = skillState?.today || { playedToday: false, skillsToday: 0, bestToday: 0 };

  const data = useMemo(() => {
    const tk = todayKey();
    const today = (results || []).filter(
      (r) => new Date(r.created_date).toDateString() === tk
    );
    const wordsCorrectToday = today.reduce((a, r) => a + (r.score || 0), 0);
    const quizzesToday = today.length;
    const bestAccuracyToday = today.reduce((m, r) => {
      const tot = r.total_questions || 30;
      const acc = tot > 0 ? Math.round(((r.score || 0) / tot) * 100) : 0;
      return Math.max(m, acc);
    }, 0);
    const totalCorrect = (results || []).reduce((a, r) => a + (r.score || 0), 0);
    const totalQuizzes = (results || []).length;
    const streak = comeback ? comeback.streak.current : computeStreak(results);
    const xp = comeback ? comeback.xp : xpRecord?.coins || 0;
    return {
      wordsCorrectToday,
      quizzesToday,
      bestAccuracyToday,
      totalCorrect,
      totalQuizzes,
      streak,
      xp,
    };
  }, [results, xpRecord, comeback]);

  const greeting = s[getGreetingKey()];
  // The student's own display_name, falling back to a provider-supplied
  // full_name. An email-derived full_name (Base44's default when no name was
  // collected) is never shown as if it were a real name — see
  // src/lib/profileName.js.
  const realName = resolveUserName(user);
  const name = realName ? realName.split(" ")[0] : t("dashboard.defaultLearnerName");

  // Today's Mission is Skill Hub-sourced for now (lessons/other systems fold
  // in later): a round played, two different skills trained, and a strong
  // score, all read off SkillHubProgress's per-skill "updated today" rows.
  // Streak still comes from QuizResult (`results`) since that's the only
  // entity with real per-round day history — Skill Hub's own "quiz" game
  // writes there too, so it still tracks real activity, just not the full
  // Skill Hub picture yet.
  // Comeback Revamp (2026-11-10): Today's Mission moved into ComebackCard as
  // server-side daily missions that pay XP (progressApi.claimMission).
  void skillHubToday;

  // AI Coach card removed for now (see project handoff doc) — to be
  // rebuilt alongside the SRS system for reminders/active suggestions.

  const achievement = useMemo(() => {
    if (data.streak >= 30) return { title: t("dashboard.achUnbreakable"), desc: t("dashboard.achUnbreakableDesc"), tint: "#f59e0b", icon: "Flame" };
    if (data.streak >= 7) return { title: t("dashboard.achWeek"), desc: t("dashboard.achWeekDesc"), tint: "#22c55e", icon: "Flame" };
    if (data.totalCorrect >= 100) return { title: t("dashboard.achCenturion"), desc: t("dashboard.achCenturionDesc"), tint: "#a78bfa", icon: "Trophy" };
    if (data.totalQuizzes >= 1) return { title: t("dashboard.achFirst"), desc: t("dashboard.achFirstDesc"), tint: ACCENT, icon: "BookOpen" };
    return null;
  }, [data]);

  // The hero card is Skill Hub's own mastery, not the old unit-quiz system —
  // "continue" now always means "go practice in Skill Hub". The unit-based
  // vocab quiz still exists (that was this project's original focus before
  // Skill Hub/Learning Path took over) but the dashboard no longer links to
  // it at all — Vocab Journey (its old entry point here) was removed as
  // redundant.
  const onContinue = () => onNavigate?.("skillhub");

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-10 space-y-5">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{greeting},</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{name}</h1>
        {!realName && (
          <button
            onClick={() => onNavigate?.("settings")}
            className="mt-1 text-xs font-medium text-primary/80 hover:text-primary underline underline-offset-2 select-none"
          >
            {t("dashboard.setYourName")}
          </button>
        )}
      </div>

      {comeback && <ViraBubble moment={homeMoment(comeback)} vars={{ n: comeback.streak?.current || 0 }} />}
      <ComebackCard onState={setComeback} primary={primary} onFreeRoam={() => onNavigate?.("skillhub")} />
      {homeworkSlot}
      <PathCard state={path.state} loading={path.loading} />
      <HeroCard accent={ACCENT} accentGlow={ACCENT_GLOW} onContinue={onContinue} skillStates={skillState?.skills ?? null} skillStateError={skillStateError} />
      <ProgressSnapshot totalCorrect={data.totalCorrect} streak={data.streak} xp={data.xp} />
      <RecentAchievement achievement={achievement} />
      <QuickActions onNavigate={onNavigate} accent={ACCENT} />

    </div>
  );
}