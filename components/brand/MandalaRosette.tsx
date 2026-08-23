interface MandalaRosetteProps {
  className?: string;
}

export default function MandalaRosette({ className = "" }: MandalaRosetteProps) {
  const petals = Array.from({ length: 16 });
  const dots = Array.from({ length: 12 });

  return (
    <svg
      aria-hidden="true"
      viewBox="-100 -100 200 200"
      fill="none"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="1.2">
        <circle r="26" />
        <circle r="40" />
        <circle r="62" />
        {petals.map((_, i) => (
          <ellipse key={i} rx="11" ry="46" transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      {dots.map((_, i) => {
        const angle = (i * Math.PI * 2) / dots.length;
        return (
          <circle
            key={i}
            cx={Math.cos(angle) * 76}
            cy={Math.sin(angle) * 76}
            r="2"
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}
