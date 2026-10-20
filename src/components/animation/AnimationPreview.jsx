import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw, Play, Pause } from "lucide-react";
import BrandLoader from "@/components/BrandLoader";
import { Button } from "@/components/ui/button";
export default function AnimationPreview({ config }) {
  const [revision, setRevision] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reveal, setReveal] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => { setReveal(false); }, [config]);
  return <section className="lg:sticky lg:top-24 space-y-4 self-start min-w-0" aria-label="Animation preview">
    <div className="rounded-2xl border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
        <span className="text-xs uppercase tracking-widest text-secondary-foreground">Live preview</span>
        <span className="text-xs text-primary">Draft · only visible here</span>
      </div>
      <div className="relative min-h-80 sm:min-h-96 flex items-center justify-center p-10" data-animation-preview style={{ "--loader-play": paused ? "paused" : "running" }}>
        {reveal && <motion.div initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : config.fadeDuration }} className="text-center space-y-2">
          <h3 className="text-2xl font-heading font-semibold text-foreground">Ready to learn</h3><p className="text-secondary-foreground text-sm">This is how your page appears.</p>
        </motion.div>}
        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" animate={{ opacity: reveal ? 0 : 1 }} transition={{ duration: reduced ? 0 : config.fadeDuration }}>
          <BrandLoader key={`${revision}-${JSON.stringify(config)}`} size={110} settings={config} label="Animation studio preview" />
        </motion.div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border p-4">
        <Button variant="outline" onClick={() => { setReveal(false); setRevision((n) => n + 1); }}><RotateCcw className="h-4 w-4 mr-2" />Replay</Button>
        <Button variant="outline" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}{paused ? "Resume" : "Pause"}</Button>
        <Button variant="outline" onClick={() => setReveal(true)} disabled={reveal}>Preview page reveal</Button>
      </div>
    </div>
    <p className="text-sm text-secondary-foreground leading-relaxed">Changes stay in this preview until you apply them. Radiance controls how far the light spreads; softness controls its blur.</p>
    {reduced && <p role="status" className="text-sm text-primary">Your device has reduced motion enabled. Animations respect this preference.</p>}
  </section>;
}