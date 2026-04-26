import Script from "next/script";

interface Props {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: Props) {
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              anonymize_ip: true,
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
