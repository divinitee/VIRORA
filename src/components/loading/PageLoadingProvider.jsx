import React, { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PageLoadingContext } from "@/components/loading/PageLoadingContext";

export default function PageLoadingProvider({ children }) {
  const [state, setState] = useState({ ids: [], content: null });
  const reduced = useReducedMotion();
  const register = useCallback((content) => {
    const id = Symbol("page-load");
    setState((s) => ({ ids: [...s.ids, id], content: s.ids.length ? s.content : content }));
    return () => setState((s) => ({ ...s, ids: s.ids.filter((value) => value !== id) }));
  }, []);
  const loading = state.ids.length > 0;
  return (
    <PageLoadingContext.Provider value={register}>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div key="page-loading" data-page-loading="true"
            className="fixed inset-0 z-50 bg-background pointer-events-none flex items-center justify-center"
            initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}>
            {state.content}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLoadingContext.Provider>
  );
}