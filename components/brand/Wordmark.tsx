import Logo from "./Logo";

export default function Wordmark({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "small" | "default" | "large";
}) {
  const sizes = {
    small: "text-lg",
    default: "text-xl",
    large: "text-3xl",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 font-bold tracking-tight ${sizes[size]} ${className}`}
    >
      <Logo
        className={
          size === "small" ? "h-6 w-6" : size === "large" ? "h-10 w-10" : "h-8 w-8"
        }
      />
      Sarokar
    </span>
  );
}
