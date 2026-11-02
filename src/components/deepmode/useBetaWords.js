import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { BETA_IDS } from "./deepModeBeta";
import { toEngineWord } from "./deepModeAdapter";
import { SAMPLE_ORDER, SAMPLE_WORDS } from "./deepModeSamples";

const FALLBACK = SAMPLE_ORDER.map((k) => SAMPLE_WORDS[k]);

// Loads the beta word maps (one query) and their translations (one query).
// Falls back to the 3 hand-made samples if loading fails.
export function useBetaWords() {
  const [state, setState] = useState({ words: null, beta: false });
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await base44.entities.WordFamily.filter({ id: { $in: BETA_IDS } }, { limit: BETA_IDS.length });
        const list = rows.items || rows;
        const vocabIds = [...new Set(list.map((r) => r.word_id).filter(Boolean))];
        const vw = await base44.entities.VocabularyWord.filter({ id: { $in: vocabIds } }, { limit: vocabIds.length || 1 });
        const byId = Object.fromEntries((vw.items || vw).map((v) => [v.id, v]));
        const words = list.map((r) => toEngineWord(r, byId[r.word_id])).filter(Boolean)
          .sort((a, b) => a.word.localeCompare(b.word));
        if (alive) setState(words.length ? { words, beta: true } : { words: FALLBACK, beta: false });
      } catch (e) {
        console.error("Deep Mode beta load failed:", e);
        if (alive) setState({ words: FALLBACK, beta: false });
      }
    })();
    return () => { alive = false; };
  }, []);
  return state;
}