import { useLayoutEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Release only at the end of the apex's arrival or a complete breathing loop.
// These are real CSS boundaries, so stagger, pauses and timing changes stay aligned.
export default function useLoadingCycle(loading) {
  const reduced = useReducedMotion();
  const [held, setHeld] = useState(loading);
  useLayoutEffect(() => {
    if (loading) setHeld(true);
    else if (reduced) setHeld(false);
  }, [loading, reduced]);
  const onBoundary = (event) => {
    const target = event.target;
    if (!target.closest?.(".virora-star-loader__star--apex")) return;
    const arrival = event.animationName === "virora-star-trace" && target.classList.contains("virora-star-loader__glow");
    const loop = event.animationName === "virora-star-breathe" && target.classList.contains("virora-star-loader__light");
    if (!loading && (arrival || loop)) setHeld(false);
  };
  return { visible: loading || held, reduced, onAnimationEnd: onBoundary, onAnimationIteration: onBoundary };
}