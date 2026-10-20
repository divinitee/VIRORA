import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import AnimationEditor from "@/components/animation/AnimationEditor";
export default function AnimationStudio() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return <p role="status" className="p-8">Loading…</p>;
  if (user?.role !== "admin") return <main className="min-h-screen p-8 text-foreground"><h1 className="text-xl font-semibold">Administrators only</h1><p className="mt-2 text-secondary-foreground">Only administrators can change the app-wide animation.</p><Link to="/settings" className="inline-block mt-6 text-primary">Back to settings</Link></main>;
  return <div className="min-h-screen bg-background text-foreground font-body">
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur safe-header pb-3">
      <div className="mx-auto max-w-6xl flex items-center gap-3">
        <Link aria-label="Back to settings" to="/settings" className="min-h-11 min-w-11 flex items-center justify-center rounded-xl hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="w-5 h-5" /></Link>
        <Sparkles className="w-5 h-5 text-primary" /><span className="font-semibold">Animation Studio</span>
        <span className="ml-auto text-xs uppercase tracking-widest text-secondary-foreground">Admin</span>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-7 sm:py-10">
      <h1 className="font-heading text-3xl sm:text-4xl font-semibold">Shape the glow.</h1>
      <p className="mt-2 mb-7 text-secondary-foreground max-w-xl">Fine-tune your loading stars, watch the result live, and apply your design across VIRORA.</p>
      <AnimationEditor />
    </main>
  </div>;
}