import { MetadataRoute } from "next";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const meta = await getSetting("meta") as { siteUrl?: string; maintenanceMode?: boolean };
  const BASE = (meta.siteUrl || "https://chandankshah.com.np").replace(/\/+$/, "");

  if (meta.maintenanceMode) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: `${BASE}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/admin/login"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
