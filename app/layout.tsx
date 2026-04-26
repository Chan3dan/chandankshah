import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GOOGLE_SITE_VERIFICATION, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/seo";
import { getSetting, type SiteMetaSettings } from "@/lib/settings";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Chandan Kumar Shah",
  title: {
    default: SITE_TITLE,
    template: "%s | Chandan Shah",
  },
  description: SITE_DESCRIPTION,
  keywords: ["Chandan Shah", "Loksewa", "DEMAT", "Nepal", "digital services", "documentation", "web development", "Niyukta"],
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  authors: [{ name: "Chandan Kumar Shah", url: SITE_URL }],
  creator: "Chandan Kumar Shah",
  publisher: "Chandan Kumar Shah",
  category: "Digital Services",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Chandan Kumar Shah",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/twitter-image`],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Chandan Shah",
    statusBarStyle: "default",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const meta = await getSetting<SiteMetaSettings>("meta");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cks-theme');var r=t==='dark'?'dark':t==='light'?'light':window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',r);document.documentElement.style.colorScheme=r;}catch(e){document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light';}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics measurementId={meta.googleAnalytics} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
