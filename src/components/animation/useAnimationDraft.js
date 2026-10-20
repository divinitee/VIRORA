import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAnimationSettings } from "@/components/animation/AnimationSettingsContext";
import { ANIMATION_DEFAULTS, normalizeAnimation } from "@/components/animation/animationConfig";
export default function useAnimationDraft() {
  const current = useAnimationSettings();
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { if (!current.loading && !current.error) setDraft((d) => d || { ...current.config }); }, [current.loading, current.error, current.config]);
  const change = (key, value) => { setDraft((d) => ({ ...d, [key]: value })); setMessage(""); setError(""); };
  const reset = () => { setDraft({ ...ANIMATION_DEFAULTS }); setMessage(""); setError(""); };
  const discard = () => { setDraft({ ...current.config }); setMessage(""); setError(""); };
  const apply = async () => {
    setBusy(true); setError(""); setMessage("");
    try {
      const config = normalizeAnimation(draft);
      const record = await base44.entities.AnimationSettings.create({ key: "brand-loader", config });
      await current.publish(record);
      setDraft(config); setMessage("Applied app-wide. All shared loading stars now use this design.");
    } catch (e) { setError(e.message || "Could not apply this animation. Please try again."); }
    finally { setBusy(false); }
  };
  return { ...current, draft, busy, message, saveError: error, change, reset, discard, apply,
    dirty: !!draft && (!current.record || JSON.stringify(draft) !== JSON.stringify(current.config)) };
}