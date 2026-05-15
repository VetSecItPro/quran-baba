// A rehal (رحل) — the carved wooden X-stand used to hold an open Qur'an for reading.
export function Rehal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* X-stand */}
      <line x1="14" y1="60" x2="36" y2="32" />
      <line x1="66" y1="60" x2="44" y2="32" />
      <line x1="14" y1="32" x2="36" y2="60" />
      <line x1="66" y1="32" x2="44" y2="60" />

      {/* base support */}
      <line x1="10" y1="60" x2="70" y2="60" strokeWidth="2" />

      {/* decorative knobs at the X joints */}
      <circle cx="40" cy="46" r="1.5" fill="currentColor" />

      {/* open book — left page */}
      <path d="M 40 12 L 12 24 L 12 32 L 40 22 Z" fill="currentColor" opacity="0.15" />
      <path d="M 40 12 L 12 24 L 12 32 L 40 22 Z" />

      {/* open book — right page */}
      <path d="M 40 12 L 68 24 L 68 32 L 40 22 Z" fill="currentColor" opacity="0.15" />
      <path d="M 40 12 L 68 24 L 68 32 L 40 22 Z" />

      {/* spine */}
      <line x1="40" y1="12" x2="40" y2="22" strokeWidth="1.6" />

      {/* suggestion of Arabic lines on each page */}
      <line x1="18" y1="26" x2="35" y2="20" opacity="0.45" strokeWidth="0.8" />
      <line x1="18" y1="28" x2="36" y2="22" opacity="0.35" strokeWidth="0.8" />
      <line x1="18" y1="30" x2="35" y2="24" opacity="0.45" strokeWidth="0.8" />

      <line x1="45" y1="20" x2="62" y2="26" opacity="0.45" strokeWidth="0.8" />
      <line x1="44" y1="22" x2="62" y2="28" opacity="0.35" strokeWidth="0.8" />
      <line x1="45" y1="24" x2="62" y2="30" opacity="0.45" strokeWidth="0.8" />

      {/* tassel (Qur'an ribbon bookmark) */}
      <line x1="40" y1="22" x2="40" y2="35" opacity="0.6" />
      <circle cx="40" cy="36" r="1" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
