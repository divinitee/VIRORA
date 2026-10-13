import React from "react";
import "./BrandLoader.css";

const STARS = [
  { x: 18, y: 64, width: 12, height: 17, delay: "0s" },
  { x: 62, y: 64, width: 12, height: 17, delay: "0s" },
  { x: 25, y: 47, width: 12, height: 17, delay: "0.16s" },
  { x: 55, y: 47, width: 12, height: 17, delay: "0.16s" },
  { x: 32, y: 30, width: 12, height: 17, delay: "0.32s" },
  { x: 48, y: 30, width: 12, height: 17, delay: "0.32s" },
  { x: 40, y: 13, width: 18, height: 25, delay: "0.48s", apex: true },
];

const STAR_PATH = "M50 0 L61 38 L100 38 L68 61 L80 100 L50 77 L20 100 L32 61 L0 38 L39 38 Z";

export default function BrandLoader({ size = 56, label = "Loading", className = "" }) {
  return (
    <div
      className={`virora-star-loader ${className}`.trim()}
      style={{ width: size, height: size }}
      role="status"
      aria-label={label}
    >
      <svg viewBox="0 0 80 76" aria-hidden="true" focusable="false">
        {STARS.map((star, index) => {
          const transform = `translate(${star.x - star.width / 2} ${star.y - star.height / 2}) scale(${star.width / 100} ${star.height / 100})`;
          const starClass = star.apex ? "virora-star-loader__star virora-star-loader__star--apex" : "virora-star-loader__star";
          return (
            <g
              key={index}
              className={starClass}
              transform={transform}
              style={{ "--star-delay": star.delay }}
            >
              <path className="virora-star-loader__halo" d={STAR_PATH} />
              <path className="virora-star-loader__outline" d={STAR_PATH} />
              <path className="virora-star-loader__glow" d={STAR_PATH} pathLength="1" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
