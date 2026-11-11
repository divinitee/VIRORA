import React from "react";

// VIRORA Economy — Vixels (V1 display slice, Claude 2026-11-11).
//
// Rate locked by Tee: 100 XP = 1 Vixel.
// V1 is display-only: Vixels are derived from lifetime XP, nothing is spent
// yet, so balance = floor(xp / 100). XP itself is never reduced.
// When the Vixel Market / streak freeze land, balance becomes
// earned (from XP) − spent (from a server-side ledger). Keep all of that
// math server-side; this file only formats what the server says.

export const XP_PER_VIXEL = 100;

export function vixelsFromXp(xp) {
  const n = Number(xp) || 0;
  return Math.max(0, Math.floor(n / XP_PER_VIXEL));
}

export function xpToNextVixel(xp) {
  const n = Math.max(0, Number(xp) || 0);
  return XP_PER_VIXEL - (n % XP_PER_VIXEL);
}

// The Vixel coin (design by Tee, 11 Nov): metallic gold V, metallic deep
// purple ring, midnight purple face. Drawn as SVG so it looks the same on
// every device (the bare circled-V glyph renders differently per font).
export function VixelIcon({ className = "w-4 h-4", title }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        {/* Metallic deep purple ring: light catch top-left, deep shade bottom-right */}
        <linearGradient id={`vx-ring-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B48CF2" />
          <stop offset="30%" stopColor="#6A3FB8" />
          <stop offset="60%" stopColor="#3A1C78" />
          <stop offset="85%" stopColor="#7C52C9" />
          <stop offset="100%" stopColor="#2A1157" />
        </linearGradient>
        {/* Midnight purple face */}
        <radialGradient id={`vx-face-${id}`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0%" stopColor="#24124A" />
          <stop offset="100%" stopColor="#0E0722" />
        </radialGradient>
        {/* Metallic gold V */}
        <linearGradient id={`vx-gold-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4C2" />
          <stop offset="40%" stopColor="#F5C451" />
          <stop offset="75%" stopColor="#B7832A" />
          <stop offset="100%" stopColor="#FFD970" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11.4" fill={`url(#vx-ring-${id})`} />
      <circle cx="12" cy="12" r="8.7" fill={`url(#vx-face-${id})`} />
      <circle cx="12" cy="12" r="8.7" fill="none" stroke="#0A0518" strokeOpacity="0.6" strokeWidth="0.5" />
      <path d="M7.4 7.2h2.4l2.2 6.4 2.2-6.4h2.4l-3.5 9.6h-2.2z" fill={`url(#vx-gold-${id})`} />
    </svg>
  );
}
