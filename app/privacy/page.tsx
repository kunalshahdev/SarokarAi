import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Sarokar",
  description: "Privacy policy for Sarokar.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-xs text-muted-light mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          <div className="space-y-6 text-base text-muted leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">What we collect</h2>
              <p>
                We collect the messages you send to the AI assistant within a session. Sessions are stored only in your browser&apos;s sessionStorage and are cleared when you close the tab. We do not maintain a database of your conversations.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Rate limiting</h2>
              <p>
                To prevent abuse, we use your IP address for rate limiting. This data is stored temporarily in memory and is not persisted to any database.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Third-party AI providers</h2>
              <p>
                Your queries are processed by third-party AI providers (Google Gemini and others) subject to their own privacy policies. Do not include sensitive personal information such as your citizenship number, bank details, or passport number in your queries.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Cookies</h2>
              <p>
                We use a single session cookie for rate-limiting purposes. No advertising or tracking cookies are used.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
