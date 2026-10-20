import React from "react";
import { Button } from "@/components/ui/button";
import AnimationControls from "@/components/animation/AnimationControls";
import AnimationPreview from "@/components/animation/AnimationPreview";
import useAnimationDraft from "@/components/animation/useAnimationDraft";
export default function AnimationEditor() {
  const s = useAnimationDraft();
  if (s.loading || (!s.draft && !s.error)) return <p role="status" className="py-12 text-secondary-foreground">Loading animation settings…</p>;
  if (s.error) return <div role="alert" className="py-8 space-y-3"><p>Animation settings could not be loaded.</p><Button onClick={() => s.retry()}>Try again</Button></div>;
  return <div data-animation-editor data-applied-id={s.record?.id || ""}>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <p className="text-sm text-secondary-foreground">{s.dirty ? "Unapplied changes" : "Using your app-wide animation"}</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={s.discard} disabled={s.busy || !s.dirty}>Discard changes</Button>
        <Button variant="outline" onClick={s.reset} disabled={s.busy}>Reset to defaults</Button>
        <Button onClick={s.apply} disabled={s.busy || !s.dirty}>{s.busy ? "Applying…" : "Apply app-wide"}</Button>
      </div>
    </div>
    {s.message && <p role="status" className="mb-5 rounded-xl border border-primary/40 bg-primary/10 p-4 text-foreground">{s.message}</p>}
    {s.saveError && <p role="alert" className="mb-5 text-destructive">{s.saveError}</p>}
    <div className="grid gap-7 lg:grid-cols-2">
      <AnimationPreview config={s.draft} />
      <fieldset disabled={s.busy} className="min-w-0"><legend className="sr-only">Animation controls</legend><AnimationControls config={s.draft} onChange={s.change} /></fieldset>
    </div>
  </div>;
}