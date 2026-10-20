import React from "react";
import "./BrandLoader.css";

const STAR_PATH =
  "M50 0 C56 34 66 44 100 50 C66 56 56 66 50 100 C44 66 34 56 0 50 C34 44 44 34 50 0 Z";

const STARS = [
  { x: 22, y: 0.84, width: 8, height: 10, delay: "0s" },
  { x: 78, y: 0.84, width: 8, height: 10, delay: "0s" },
  { x: 31, y: 0.60, width: 8, height: 10, delay: "0.26s" },
  { x: 69, y: 0.60, width: 8, height: 10, delay: "0.26s" },
  { x: 40, y: 0.36, width: 8, height: 11, delay: "0.52s" },
  { x: 60, y: 0.36, width: 8, height: 11, delay: "0.52s" },
  { x: 50, y: 0.12, width: 20, height: 24, delay: "0.78s", apex: true },
];

export default function BrandLoader({
  size = 56,
  width = size,
  height = size,
  label = "Loading",
  className = "",
}) {
  const viewBoxHeight = (100 * height) / width;

  return (
    <div
      className={`virora-star-loader ${className}`.trim()}
      style={{ width, height }}
      role="status"
      aria-label={label}
    >
      <svg viewBox={`0 0 100 ${viewBoxHeight}`} aria-hidden="true" focusable="false">
        {STARS.map((star, index) => {
          const centerY = star.y * viewBoxHeight;
          const transform = `translate(${star.x - star.width / 2} ${centerY - star.height / 2}) scale(${star.width / 100} ${star.height / 100})`;
          const starClass = star.apex
            ? "virora-star-loader__star virora-star-loader__star--apex"
            : "virora-star-loader__star";

          return (
            <g
              key={index}
              className={starClass}
              transform={transform}
              style={{ "--star-delay": star.delay }}
            >
              <path className="virora-star-loader__outline" d={STAR_PATH} />
              <g className="virora-star-loader__light">
                <path className="virora-star-loader__halo" d={STAR_PATH} pathLength="1" />
                <path className="virora-star-loader__glow" d={STAR_PATH} pathLength="1" />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}