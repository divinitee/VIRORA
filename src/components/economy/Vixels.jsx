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

// The metallic gold "V" coin. Drawn as SVG so it looks the same on every
// device (the bare circled-V glyph renders differently per font).
export function VixelIcon({ className = "w-4 h-4", title }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`vx-rim-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF4C2" />
          <stop offset="35%" stopColor="#F5C451" />
          <stop offset="65%" stopColor="#B7832A" />
          <stop offset="100%" stopColor="#FFE08A" />
        </linearGradient>
        <linearGradient id={`vx-face-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B1F6E" />
          <stop offset="100%" stopColor="#1C0F38" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill={`url(#vx-rim-${id})`} />
      <circle cx="12" cy="12" r="8.6" fill={`url(#vx-face-${id})`} />
      <path d="M7.6 7.4h2.3l2.1 6.2 2.1-6.2h2.3l-3.4 9.2h-2z" fill={`url(#vx-rim-${id})`} />
    </svg>
  );
}
