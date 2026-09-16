import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { Toaster } from "@/components/shared/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sarokar.app"),
  title: "Sarokar — Nepal ko kaam, aba sajilo.",
  description:
    "Government processes, documents, and everyday questions — figure out what you need, where to go, and what comes next.",
  keywords: [
    "Nepal",
    "government services",
    "PAN",
    "passport",
    "driving licence",
    "citizenship",
    "bluebook",
    "loksewa",
    "Nepal government",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Sarokar — Nepal ko kaam, aba sajilo.",
    description:
      "Government processes, documents, and everyday questions — figure out what you need, where to go, and what comes next.",
    type: "website",
    locale: "ne_NP",
    siteName: "Sarokar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarokar — Nepal ko kaam, aba sajilo.",
    description:
      "Government processes, documents, and everyday questions — figure out what you need, where to go, and what comes next.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sarokar",
  description:
    "AI-powered guide for Nepali government processes, documents, and everyday questions — for Nepalis at home and worldwide.",
  url: "https://sarokar.app",
  foundingLocation: {
    "@type": "Place",
    name: "Kathmandu, Nepal",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${notoDevanagari.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
                document.documentElement.classList.add('js');
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
