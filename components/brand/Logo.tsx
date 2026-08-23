import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <Image
        src="/images/sarokar.jpg"
        alt="Sarokar Logo"
        fill
        sizes="56px"
        className="rounded-[10px] object-cover"
        priority
      />
    </span>
  );
}
