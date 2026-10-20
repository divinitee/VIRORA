import React from "react";
export default function AnimationControl({ control, value, onChange }) {
  const id = `animation-${control.key}`;
  return <div className="space-y-2">
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-sm text-foreground">{control.label}</label>
      <output htmlFor={id} className="text-sm tabular-nums text-secondary-foreground">{Number(value.toFixed(2))}{control.unit}</output>
    </div>
    <input id={id} type="range" min={control.min} max={control.max} step={control.step} value={value}
      onChange={(e) => onChange(control.key, Number(e.target.value))}
      className="w-full h-8 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg" />
  </div>;
}