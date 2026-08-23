"use client";

interface StickerProps {
  children: React.ReactNode;
  rotation?: number;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3.5 py-1.5 text-xs sm:text-sm",
  lg: "px-4.5 py-2 text-sm sm:text-base",
};

const variantClasses = {
  default:
    "bg-kct-card border border-kct-border text-foreground shadow-xs hover:border-amber-500/40 hover:text-amber-600",
  outline:
    "bg-transparent border border-foreground/20 text-foreground",
  filled:
    "bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-400 shadow-sm",
};

export default function Sticker({
  children,
  rotation = 0,
  variant = "default",
  size = "md",
  className = "",
  onClick,
}: StickerProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 font-bold tracking-tight
        rounded-xl select-none whitespace-nowrap
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${onClick ? "cursor-pointer transition-all duration-200 hover:scale-105 active:scale-[0.97] hover:shadow-md" : ""}
        ${className}
      `}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children}
    </Component>
  );
}
