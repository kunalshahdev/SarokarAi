import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About — Sarokar",
  description: "About Sarokar — Nepal ko kaam, aba sajilo.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">About Sarokar</h1>
          <div className="prose text-muted space-y-4 text-base leading-relaxed">
            <p>
              Sarokar is an independent AI-powered information service built in Kathmandu for Nepalis at home and across the world.
            </p>
            <p>
              Our goal is simple: make everyday government processes, documents, and bureaucratic questions easier to understand — in English, Nepali, or Roman Nepali.
            </p>
            <p>
              We are not affiliated with the Government of Nepal. All guidance should be verified with official sources before acting on it.
            </p>
            <p className="pt-4 text-sm text-muted-light">
              For questions or feedback, use the chat assistant or reach out via the assistant interface.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
