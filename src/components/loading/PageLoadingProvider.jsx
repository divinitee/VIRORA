import React, { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useLoadingCycle from "@/components/loading/useLoadingCycle";
import { PageLoadingContext } from "@/components/loading/PageLoadingContext";
import { useAnimationSettings } from "@/components/animation/AnimationSettingsContext";

export default function PageLoadingProvider({ children }) {
  const [state, setState] = useState({ ids: [], content: null });
  const loading = state.ids.length > 0;
  const { visible, reduced, onAnimationEnd, onAnimationIteration } = useLoadingCycle(loading);
  const { config } = useAnimationSettings();
  const register = useCallback((content) => {
    const id = Symbol("page-load");
    setState((s) => ({ ids: [...s.ids, id], content: s.content || content }));
    return () => setState((s) => ({ ...s, ids: s.ids.filter((value) => value !== id) }));
  }, []);
  return (
    <PageLoadingContext.Provider value={register}>
      {children}
      <AnimatePresence onExitComplete={() => setState((s) => s.ids.length ? s : { ...s, content: null })}>
        {visible && (
          <motion.div key="page-loading" data-page-loading="true" data-loading-pending={loading}
            onAnimationEnd={onAnimationEnd} onAnimationIteration={onAnimationIteration}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center"
            initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : config.fadeDuration, ease: [0.22, 1, 0.36, 1] }}>
            {state.content}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLoadingContext.Provider>
  );
}