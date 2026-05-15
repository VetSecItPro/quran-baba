// A repeating Moroccan zellige band — 8-point star tessellation drawn as an SVG <pattern>
// then tiled across the width. Use as a top or bottom decorative strip.
export function ZelligeBand({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <pattern id="zellige-tile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          {/* outer 8-point star */}
          <path
            d="M 20 4 L 24 14 L 36 14 L 28 22 L 30 34 L 20 28 L 10 34 L 12 22 L 4 14 L 16 14 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.55"
          />
          {/* inner diamond */}
          <path
            d="M 20 11 L 27 20 L 20 29 L 13 20 Z"
            fill="currentColor"
            opacity="0.18"
          />
          {/* center dot */}
          <circle cx="20" cy="20" r="1.4" fill="currentColor" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige-tile)" />
    </svg>
  );
}
