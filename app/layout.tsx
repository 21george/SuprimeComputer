import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supreme Computer | Printing, Website Design & Mobile Apps in Benin City",
  description: "Supreme Computer in Akpata, Benin City offers printing, typing, scanning, computer training, website design and mobile app development. Call 08152404200.",
  keywords: ["Supreme Computer", "printing Benin City", "typing services Benin City", "scanning Akpata", "computer training Benin City", "website design Benin City", "mobile app development Benin City"],
  openGraph: {
    title: "Supreme Computer — Every detail. Done right.",
    description: "Printing, document services, website design and mobile app development in Benin City, Edo State.",
    type: "website",
    locale: "en_NG",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><a className="skip-link" href="#main-content">Skip to content</a>{children}</body>
    </html>
  );
}
