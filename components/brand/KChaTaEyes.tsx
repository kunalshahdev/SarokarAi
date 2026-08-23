interface KChaTaEyesProps {
  className?: string;
}

export default function KChaTaEyes({ className = "" }: KChaTaEyesProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g transform="rotate(-8 15 25)">
        <ellipse cx="15" cy="25" rx="8" ry="9.5" fill="#FFFFFF" />
        <circle cx="16" cy="27" r="4.2" fill="#1C1917" />
        <circle cx="14.4" cy="25.4" r="1.4" fill="#FFFFFF" />
      </g>
      <g transform="rotate(8 33 25)">
        <ellipse cx="33" cy="25" rx="8" ry="9.5" fill="#FFFFFF" />
        <circle cx="32" cy="27" r="4.2" fill="#1C1917" />
        <circle cx="30.4" cy="25.4" r="1.4" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
