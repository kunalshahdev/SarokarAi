"use client";

import { useRouter } from "next/navigation";
import KChaTaHero from "@/components/kchata/KChaTaHero";
import TopicCategories from "@/components/kchata/TopicCategories";
import TrendingNow from "@/components/kchata/TrendingNow";
import ExplainThis from "@/components/kchata/ExplainThis";
import DailyDrop from "@/components/kchata/DailyDrop";
import AskAnything from "@/components/kchata/AskAnything";
import DebunkVerify from "@/components/kchata/DebunkVerify";
import PersonalizedFeed from "@/components/kchata/PersonalizedFeed";
import Footer from "@/components/layout/Footer";

export default function KChaTaContent() {
  const router = useRouter();

  return (
    <>
      <KChaTaHero />
      <TopicCategories onSelect={(cat) => router.push(`/k-cha-ta/chat?q=${encodeURIComponent(`Tell me about ${cat}`)}`)} />
      <TrendingNow />
      <ExplainThis />
      <DailyDrop />
      <AskAnything />
      <DebunkVerify />
      <PersonalizedFeed />
      <Footer />
    </>
  );
}
