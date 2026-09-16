import Navbar from "@/components/layout/Navbar";
import KChaTaContent from "./KChaTaContent";
import Link from "next/link";

export const metadata = {
  title: "K Cha Ta? | Sarokar",
  description:
    "नेपालको internet ma k chaldai cha? Understand trends, verify claims, and ask anything about what's happening in Nepal.",
};

export default function KChaTaPage() {
  return (
    <div id="main-content" className="kct-theme min-h-screen bg-kct-surface text-foreground">
      {/* 3px amber identity border at very top */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] bg-[#F5A623]" />

      <Navbar />

      {/* "Part of Sarokar" badge shown below navbar */}
      <div className="fixed top-[calc(36px+64px)] left-0 right-0 z-[45] flex justify-center pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-[#F5A623]/30 bg-[#FFFBF0] dark:bg-[#1A1508] px-3 py-1 text-[11px] font-medium text-[#E8920D] shadow-sm transition-all hover:border-[#F5A623]/60 hover:shadow-md"
        >
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Part of Sarokar
        </Link>
      </div>

      <KChaTaContent />
    </div>
  );
}
