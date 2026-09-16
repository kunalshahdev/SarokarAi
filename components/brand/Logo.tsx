export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="Sarokar logo"
    >
      {/* White background square */}
      <rect width="44" height="44" rx="8" fill="white" />

      {/* Left mountain peak (navy) */}
      <polyline
        points="2,34 11,16 18,26"
        stroke="#1B2D5E"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right mountain peak (navy) */}
      <polyline
        points="26,26 33,16 42,34"
        stroke="#1B2D5E"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {/* Amber triangle outline (centered, tall) */}
      <polygon
        points="22,5 36,34 8,34"
        stroke="#F5A623"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Pagoda body — navy blue */}
      {/* Base tier */}
      <rect x="15" y="28" width="14" height="5" rx="0.5" fill="#1B2D5E" />
      {/* Mid tier */}
      <rect x="16.5" y="23.5" width="11" height="5" rx="0.5" fill="#1B2D5E" />
      {/* Top tier */}
      <rect x="18.5" y="19.5" width="7" height="4.5" rx="0.5" fill="#1B2D5E" />
      {/* Spire */}
      <line x1="22" y1="19.5" x2="22" y2="8.5" stroke="#1B2D5E" strokeWidth="1.5" strokeLinecap="round" />
      {/* Spire top cap */}
      <circle cx="22" cy="8" r="1" fill="#1B2D5E" />

      {/* Pagoda roof lines (amber accent) */}
      <line x1="14.5" y1="28" x2="29.5" y2="28" stroke="#F5A623" strokeWidth="0.8" />
      <line x1="15.5" y1="23.5" x2="28.5" y2="23.5" stroke="#F5A623" strokeWidth="0.8" />
      <line x1="17.5" y1="19.5" x2="26.5" y2="19.5" stroke="#F5A623" strokeWidth="0.8" />
    </svg>
  );
}
