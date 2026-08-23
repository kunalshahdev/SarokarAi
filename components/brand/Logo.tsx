export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="Sarokar logo"
    >
      <rect width="40" height="40" rx="10" fill="#B3262D" />
      <path
        d="M7.5 28.5 14 13.5 20 22.5 26 13.5 32.5 28.5Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="28.75" cy="10" r="2.25" fill="#FFFFFF" />
    </svg>
  );
}
