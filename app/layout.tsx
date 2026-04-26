import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chandankshah.com.np"),
  title: {
    default: "Chandan Kumar Shah — Digital Services & Portfolio",
    template: "%s | Chandan Shah",
  },
  description:
    "Independent digital services in Nepal for documentation, Loksewa support, DEMAT setup, portfolio websites, and practical online assistance.",
  keywords: ["Chandan Shah", "Loksewa", "DEMAT", "Nepal", "digital services", "documentation", "web development", "Niyukta"],
  alternates: {
    canonical: "https://chandankshah.com.np",
  },
  openGraph: {
    type: "website",
    url: "https://chandankshah.com.np",
    siteName: "Chandan Kumar Shah",
    title: "Chandan Kumar Shah — Digital Services & Portfolio",
    description: "Independent digital services in Nepal for documentation, Loksewa support, DEMAT setup, and web solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chandan Kumar Shah — Digital Services & Portfolio",
    description: "Independent digital services in Nepal for documentation, forms, finance setup, and web work.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
