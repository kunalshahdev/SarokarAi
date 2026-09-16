import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Use — Sarokar",
  description: "Terms of use for Sarokar.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">Terms of Use</h1>
          <p className="text-xs text-muted-light mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          <div className="space-y-6 text-base text-muted leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Information only</h2>
              <p>
                Sarokar provides general information about Nepali government processes and documents. It is not a legal service and does not constitute legal advice. Always verify information with official government sources before acting.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">No affiliation</h2>
              <p>
                Sarokar is an independent service. We are not affiliated with, endorsed by, or connected to the Government of Nepal or any government agency.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Accuracy</h2>
              <p>
                Government requirements change. While we aim to keep information up-to-date, we cannot guarantee that all guidance is current. Always double-check with official sources, especially for fees, office hours, and document requirements.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Acceptable use</h2>
              <p>
                Do not use Sarokar to submit automated requests, attempt to reverse-engineer our services, or submit personal data such as citizenship numbers, passport numbers, or financial details.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
