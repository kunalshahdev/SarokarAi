"use client";

import { useId } from "react";

interface AankhijhyalPatternProps {
  className?: string;
  opacity?: number;
}

export default function AankhijhyalPattern({
  className = "",
  opacity = 0.07,
}: AankhijhyalPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    >
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M28 8l20 20-20 20-20-20z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="18"
            y="18"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="28" cy="28" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
