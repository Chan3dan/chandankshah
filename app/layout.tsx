import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Chandan Kumar Shah — Digital Services & Portfolio",
    template: "%s | Chandan Shah",
  },
  description:
    "Professional digital services in Nepal — Loksewa, DEMAT, documentation, web development. BCA student.",
  keywords: ["Chandan Shah", "Loksewa", "DEMAT", "Nepal", "BCA", "Niyukta"],
  openGraph: {
    type: "website",
    url: "https://chandankshah.com.np",
    siteName: "Chandan Kumar Shah",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Inline script runs before React hydrates.
          Sets data-theme on <html> to prevent flash of wrong theme.
          suppressHydrationWarning on <html> above ignores the
          data-theme attribute mismatch between SSR and client.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cks-theme');var r=t==='dark'?'dark':t==='light'?'light':window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',r);}catch(e){}})();`,
          }}
        />
      </head>
      {/*
        suppressHydrationWarning on body prevents React warning when
        browser extensions or ThemeProvider modify body attributes.
      */}
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
