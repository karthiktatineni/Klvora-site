import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import GoogleAnalytics from "@/components/providers/GoogleAnalytics";
import Toast from "@/components/ui/Toast";
import ChatBot from "@/components/ai/ChatBot";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StickyToastRemover from "@/components/providers/StickyToastRemover";

const serif = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "700"],
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aura-fashion.vercel.app"),
  title: {
    default: "KLVORA — Premium Luxury Fashion | Ethereal Elegance",
    template: "%s | KLVORA Fashion Hub",
  },
  description:
    "Discover AURA's curated luxury fashion collections. Immersive 3D product experiences, architectural minimalism, and heritage craftsmanship. Shop premium bags, outerwear, jewelry & accessories.",
  keywords: [
    "luxury fashion", "premium clothing", "designer bags", "high-end accessories",
    "minimalist fashion", "editorial fashion", "luxury e-commerce", "AURA fashion",
    "designer outerwear", "artisan jewelry", "Italian leather", "silk scarves",
  ],
  authors: [{ name: "KLVORA Fashion Hub" }],
  creator: "KLVORA Fashion Hub",
  publisher: "KLVORA Fashion Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://klvora.in",
    siteName: "KLVORA Fashion Hub",
    title: "KLVORA — Premium Luxury Fashion",
    description: "Discover KLVORA's curated luxury fashion collections with immersive 3D experiences.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AURA — Premium Luxury Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KLVORA — Premium Luxury Fashion",
    description: "Discover KLVORA's curated luxury fashion collections with immersive 3D experiences.",
    images: ["/og-image.jpg"],
    creator: "@klvorafashion",
  },
  alternates: {
    canonical: "https://klvora.in",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "fashion",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1B2430" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data
function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KLVORA Fashion Hub",
    url: "https://klvora.in",
    logo: "https://klvora.in/logo.png",
    description: "Premium luxury fashion brand offering curated collections with immersive 3D experiences.",
    sameAs: [
      "https://instagram.com/klvorafashion",
      "https://twitter.com/klvorafashion",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-KLVORA",
      contactType: "customer service",
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KLVORA Fashion Hub",
    url: "https://klvora.in",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://klvora.in/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <JsonLd />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className={`${serif.variable} ${sans.variable} font-sans bg-background text-on-surface antialiased min-h-screen`}>
        <GoogleAnalytics />
        <StickyToastRemover />
        <Toast />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatBot />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
