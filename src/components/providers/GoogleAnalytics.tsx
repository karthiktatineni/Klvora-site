"use client";

import Script from "next/script";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", GA_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
