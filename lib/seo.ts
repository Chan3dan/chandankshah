import type { Metadata } from "next";

export const SITE_URL = "https://chandankshah.com.np";
export const SITE_NAME = "Chandan Kumar Shah";
export const SITE_TITLE = "Chandan Kumar Shah — Digital Services & Portfolio";
export const SITE_DESCRIPTION =
  "Independent digital services in Nepal for documentation, Loksewa support, DEMAT setup, portfolio websites, academic guidance, and practical online assistance for individuals and small businesses.";
export const GOOGLE_SITE_VERIFICATION = "9MZ8KN2iRj0j2c9wqDP-KeA9WVdnu_XHb8ZcpCAWEkc";

type OpenGraphType = "website" | "article";

interface BuildMetadataInput {
  title?: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: OpenGraphType;
  noIndex?: boolean;
  imagePath?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  noIndex = false,
  imagePath = "/opengraph-image",
  publishedTime,
  modifiedTime,
  tags = [],
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath);
  const fullTitle = title ? `${title} | Chandan Shah` : SITE_TITLE;

  return {
    title: title || SITE_TITLE,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Digital Services",
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
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
      type,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors: [SITE_NAME],
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}
