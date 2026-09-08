import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl(process.env.NEXT_PUBLIC_SITE_URL)),
  title: {
    default: "BeforeSetup — the five minutes before you touch Setup",
    template: "%s · BeforeSetup",
  },
  description:
    "A field guide to the Salesforce platform: plain-English mental models, the recurring X-vs-Y decisions, common pitfalls, and the best resources — free, no sign-up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteHeader />
        <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
