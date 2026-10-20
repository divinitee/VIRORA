import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
export default function AnimationStudioLink() {
  return <Link to="/animation-studio" className="flex items-center gap-3 bg-background rounded-2xl border border-border p-5 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring">
    <Sparkles className="h-5 w-5 text-primary shrink-0" /><div className="flex-1"><p className="font-semibold text-foreground">Animation Studio</p><p className="text-sm text-secondary-foreground mt-1">Design and apply the app-wide loading glow.</p></div><ArrowRight className="h-4 w-4 text-primary shrink-0" />
  </Link>;
}