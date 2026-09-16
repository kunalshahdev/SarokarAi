interface NepalFlagProps {
  className?: string;
}

export default function NepalFlag({ className = "" }: NepalFlagProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M5.5 2L16 9.2L10.2 11.7L19.5 20.8H5.5V2Z"
        fill="#DC143C"
        stroke="#003893"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8.6" cy="6.9" r="1.6" fill="#fff" />
      <circle cx="10" cy="6.4" r="1.3" fill="#DC143C" />
      <circle cx="8.9" cy="16.4" r="1.6" fill="#fff" />
    </svg>
  );
}
