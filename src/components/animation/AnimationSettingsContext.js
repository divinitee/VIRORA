import { createContext, useContext } from "react";
import { ANIMATION_DEFAULTS } from "@/components/animation/animationConfig";
export const AnimationSettingsContext = createContext({ config: ANIMATION_DEFAULTS });
export function useAnimationSettings() { return useContext(AnimationSettingsContext); }