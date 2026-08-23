import Navbar from "@/components/layout/Navbar";
import KChaTaContent from "./KChaTaContent";

export const metadata = {
  title: "K Cha Ta? | Sarokar",
  description:
    "नेपालको internet ma k chaldai cha? Understand trends, verify claims, and ask anything about what's happening in Nepal.",
};

export default function KChaTaPage() {
  return (
    <div id="main-content" className="kct-theme min-h-screen bg-kct-surface text-foreground">
      <Navbar />
      <KChaTaContent />
    </div>
  );
}
