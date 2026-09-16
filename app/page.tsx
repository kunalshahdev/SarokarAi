import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/homepage/Hero";
import CategoryGrid from "@/components/homepage/CategoryGrid";
import RealQuestions from "@/components/homepage/RealQuestions";
import HowItWorks from "@/components/homepage/HowItWorks";
import LanguageSection from "@/components/homepage/LanguageSection";
import NepalSection from "@/components/homepage/NepalSection";
import TrustSection from "@/components/homepage/TrustSection";
import PopularServices from "@/components/homepage/PopularServices";
import FinalCTA from "@/components/homepage/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <CategoryGrid />
        <RealQuestions />
        <HowItWorks />
        <LanguageSection />
        <NepalSection />
        <TrustSection />
        <PopularServices />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
