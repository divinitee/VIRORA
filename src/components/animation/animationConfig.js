export const ANIMATION_DEFAULTS = {
  traceDuration: 1.4, pulseDuration: 3.2, intensity: 1, radiance: 13,
  softness: 6, stagger: 0.26, strokeWidth: 6, pulseMin: 0.42,
  outlineOpacity: 0.32, scale: 1, fadeDuration: 0.52,
  glowColor: "#f0e7d6", haloColor: "#9a63e0",
};
export const ANIMATION_CONTROLS = [
  { key: "traceDuration", label: "Glow draw duration", min: 0.3, max: 5, step: 0.1, unit: "s", group: "Timing" },
  { key: "pulseDuration", label: "Breathing duration", min: 0.8, max: 8, step: 0.1, unit: "s", group: "Timing" },
  { key: "stagger", label: "Delay between star rows", min: 0, max: 1, step: 0.02, unit: "s", group: "Timing" },
  { key: "fadeDuration", label: "Page reveal duration", min: 0.1, max: 2, step: 0.05, unit: "s", group: "Timing" },
  { key: "intensity", label: "Glow intensity", min: 0, max: 2, step: 0.05, unit: "×", group: "Light" },
  { key: "radiance", label: "Radiance / glow spread", min: 0, max: 30, step: 1, unit: "", group: "Light" },
  { key: "softness", label: "Halo softness", min: 0, max: 16, step: 0.5, unit: "", group: "Light" },
  { key: "pulseMin", label: "Minimum breathing brightness", min: 0.1, max: 1, step: 0.05, unit: "", group: "Light" },
  { key: "strokeWidth", label: "Star outline thickness", min: 2, max: 12, step: 0.5, unit: "", group: "Shape" },
  { key: "outlineOpacity", label: "Resting outline visibility", min: 0, max: 1, step: 0.05, unit: "", group: "Shape" },
  { key: "scale", label: "Loader size", min: 0.6, max: 1.8, step: 0.05, unit: "×", group: "Shape" },
];
export function normalizeAnimation(input = {}) {
  const result = { ...ANIMATION_DEFAULTS };
  for (const c of ANIMATION_CONTROLS) if (Number.isFinite(input[c.key])) result[c.key] = Math.min(c.max, Math.max(c.min, input[c.key]));
  for (const key of ["glowColor", "haloColor"]) if (/^#[\da-f]{6}$/i.test(input[key])) result[key] = input[key];
  return result;
}
export function animationStyle(c) {
  return {
    "--loader-trace": `${c.traceDuration}s`, "--loader-pulse": `${c.pulseDuration}s`,
    "--loader-intensity": c.intensity, "--loader-radiance": `${c.radiance}px`,
    "--loader-softness": `${c.softness}px`, "--loader-stroke": c.strokeWidth,
    "--loader-min": c.pulseMin, "--loader-outline": c.outlineOpacity,
    "--loader-core": c.glowColor, "--loader-halo": c.haloColor,
  };
}