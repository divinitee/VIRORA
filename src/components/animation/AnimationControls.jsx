import React from "react";
import AnimationControl from "@/components/animation/AnimationControl";
import { ANIMATION_CONTROLS } from "@/components/animation/animationConfig";
export default function AnimationControls({ config, onChange }) {
  return <div className="space-y-5">
    {["Timing", "Light", "Shape"].map((group) => <section key={group} className="rounded-2xl border border-border bg-card p-5 space-y-5">
      <h2 className="text-xs uppercase tracking-widest font-semibold text-secondary-foreground">{group}</h2>
      {ANIMATION_CONTROLS.filter((c) => c.group === group).map((c) => <AnimationControl key={c.key} control={c} value={config[c.key]} onChange={onChange} />)}
    </section>)}
    <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <h2 className="text-xs uppercase tracking-widest font-semibold text-secondary-foreground">Color</h2>
      {[["glowColor", "Star light"], ["haloColor", "Glow halo"]].map(([key, label]) => <label key={key} className="flex items-center justify-between gap-3 text-sm text-foreground">
        {label}<span className="flex items-center gap-3 text-secondary-foreground"><span className="tabular-nums uppercase">{config[key]}</span>
        <input aria-label={label} type="color" value={config[key]} onChange={(e) => onChange(key, e.target.value)} className="h-11 w-12 rounded-lg border border-border bg-background cursor-pointer" /></span>
      </label>)}
    </section>
  </div>;
}