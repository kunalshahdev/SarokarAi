interface HimalayaRidgeProps {
  className?: string;
}

export default function HimalayaRidge({ className = "" }: HimalayaRidgeProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute bottom-0 left-0 w-full ${className}`}
    >
      <path
        d="M0 78 L120 34 L260 86 L420 22 L560 74 L720 40 L880 90 L1040 30 L1180 72 L1320 44 L1440 80 V120 H0 Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M0 96 L180 52 L340 100 L520 44 L700 94 L900 56 L1080 102 L1260 60 L1440 92 V120 H0 Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}
