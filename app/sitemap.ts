import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Service, Project, BlogPost } from "@/models";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const meta = await getSetting("meta") as { siteUrl?: string };
  const BASE = meta.siteUrl || "https://chandankshah.com.np";

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/book`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    await connectDB();

    // Service pages
    const services = await Service.find({ isActive: true }).select("slug updatedAt").lean() as any[];
    const serviceRoutes: MetadataRoute.Sitemap = services.map(s => ({
      url: `${BASE}/services/${s.slug}`,
      lastModified: s.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    // Project pages
    const projects = await Project.find({ isActive: true }).select("slug updatedAt").lean() as any[];
    const projectRoutes: MetadataRoute.Sitemap = projects.map(p => ({
      url: `${BASE}/projects/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // Blog pages
    const posts = await BlogPost.find({ isPublished: true }).select("slug updatedAt").lean() as any[];
    const blogRoutes: MetadataRoute.Sitemap = posts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
