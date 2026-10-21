import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useLoadingCycle from "@/components/loading/useLoadingCycle";
import BrandLoader from "@/components/BrandLoader";
import { useAnimationSettings } from "@/components/animation/AnimationSettingsContext";

export default function LoadingTransition({ loading, children, className = "", label = "Loading…", fallback }) {
  const { visible, reduced, onAnimationEnd, onAnimationIteration } = useLoadingCycle(loading);
  const { config } = useAnimationSettings();
  return (
    <div className={`relative ${className}`} aria-busy={visible} data-loading-transition data-loading-pending={loading}>
      {visible ? <div className="min-h-64" /> : (
        <motion.div key="content" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : config.fadeDuration, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </motion.div>
      )}
      <AnimatePresence>
        {visible && <motion.div key="loading" className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          onAnimationEnd={onAnimationEnd} onAnimationIteration={onAnimationIteration}
          initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : config.fadeDuration }}>
          {fallback || <BrandLoader size={72} label={label} />}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}