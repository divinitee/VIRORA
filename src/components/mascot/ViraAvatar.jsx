import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { viraPose } from "@/lib/mascot/vira";

// Vira in place of the Coach "orb" (Tee's review, 2026-11-17): a round
// portrait (head and shoulders) in the coach colour, breathing gently.
// Falls back to a plain colour disc if the image cannot load.
export default function ViraAvatar({ mood = "neutral", size = 56, color = "#a78bfa" }) {
  const reduce = useReducedMotion();
  const src = useMemo(() => viraPose(mood), [mood]);
  const [ok, setOk] = useState(true);
  return (
    <motion.div
      aria-hidden="true"
      data-testid="vira-avatar"
      className="relative rounded-full shrink-0 overflow-hidden"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 50% 35%, ${color}55, ${color}22 60%, #0000 100%)`,
        boxShadow: `0 0 0 2px ${color}88, 0 0 28px ${color}44`,
      }}
      animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
      transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {ok && (
        <img
          src={src}
          alt=""
          draggable={false}
          onError={() => setOk(false)}
          className="absolute left-1/2 top-0 max-w-none select-none pointer-events-none"
          style={{ width: size * 1.2, transform: "translateX(-50%) translateY(2%)" }}
        />
      )}
    </motion.div>
  );
}
