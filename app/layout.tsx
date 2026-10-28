import type { Metadata } from "next";
import PageTransitions from "@/components/page-transitions";
import { getSiteContent } from "@/lib/supabase-content";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  const settings = site?.settings;
  return {
    title: settings?.seo_title || "Supreme Computer | Printing, Website Design & Mobile Apps in Benin City",
    description: settings?.seo_description || "Supreme Computer in Akpata, Benin City offers printing, typing, scanning, computer training, website design and mobile app development. Call 08152404200.",
    keywords: ["Supreme Computer", "printing Benin City", "typing services Benin City", "scanning Akpata", "computer training Benin City", "website design Benin City", "mobile app development Benin City"],
    openGraph: {
      title: settings?.seo_title || "Supreme Computer — Every detail. Done right.",
      description: settings?.seo_description || "Printing, document services, website design and mobile app development in Benin City, Edo State.",
      type: "website",
      locale: "en_NG",
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteContent();
  const copy = site?.copy || {};
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased"><a className="skip-link" href="#main-content">Skip to content</a>{children}<PageTransitions copy={copy} /></body>
    </html>
  );
}
