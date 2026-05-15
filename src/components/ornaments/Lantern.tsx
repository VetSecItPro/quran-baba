export function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 56"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* hanging chain */}
      <line x1="16" y1="0" x2="16" y2="6" />
      <circle cx="16" cy="7" r="1" fill="currentColor" />

      {/* top cap (trapezoid + crown) */}
      <path d="M 10 8 L 22 8 L 20 11 L 12 11 Z" fill="currentColor" opacity="0.25" />
      <path d="M 10 8 L 22 8 L 20 11 L 12 11 Z" />
      <path d="M 13 11 L 19 11 L 19 13 L 13 13 Z" />

      {/* body (octagonal) */}
      <path d="M 8 14 L 24 14 L 27 22 L 27 34 L 24 42 L 8 42 L 5 34 L 5 22 Z" />

      {/* inner candle glow */}
      <circle cx="16" cy="28" r="3" fill="currentColor" opacity="0.5" />

      {/* fretwork cutouts */}
      <path d="M 12 22 L 16 18 L 20 22 L 16 26 Z" />
      <path d="M 12 34 L 16 30 L 20 34 L 16 38 Z" />
      <line x1="8" y1="28" x2="13" y2="28" />
      <line x1="19" y1="28" x2="24" y2="28" />

      {/* bottom finial + tassel */}
      <path d="M 11 42 L 21 42 L 19 45 L 13 45 Z" />
      <line x1="16" y1="45" x2="16" y2="52" />
      <path d="M 13 52 L 19 52 L 17 56 L 15 56 Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
