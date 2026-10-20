import React, { useState } from "react";
import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import InterestLearning from "@/components/landing/InterestLearning";
import LevelAssessment from "@/components/landing/LevelAssessment";
import LandingPricing from "@/components/landing/LandingPricing";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import InAppBrowserNotice from "@/components/InAppBrowserNotice";

export default function Landing() {
  const [dark, setDark] = useState(true);
  return (
    <div className={dark ? "landing-dark" : ""}>
      <div className="min-h-screen bg-slate-50 landing-dark:bg-slate-950 text-slate-900 landing-dark:text-slate-50 font-body">
        <LandingNav dark={dark} setDark={setDark} />
        <main>
          <Hero />
          <Problem />
          <HowItWorks />
          <InterestLearning />
          <LevelAssessment />
          <LandingPricing />
          <FinalCTA />
        </main>
        <LandingFooter />
        {/* Most students arrive from a Telegram/Instagram link — tell them
            to switch browsers before they sign up, not after they're lost. */}
        <InAppBrowserNotice floating />
      </div>
    </div>
  );
}