import { getSetting } from "@/lib/settings";
import { connectDB } from "@/lib/mongodb";
import { Service, Project, Testimonial } from "@/models";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import HomeClient from "@/components/public/HomeClient";
import { PersonSchema, LocalBusinessSchema, WebSiteSchema } from "@/components/public/StructuredData";
import type { HeroSettings, ProfileSettings, NiyuktaSettings, PricingSettings, SocialSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectDB();
  const [hero, profile, niyukta, pricing, social, meta, services, projects, testimonials] = await Promise.all([
    getSetting<HeroSettings>("hero"),
    getSetting<ProfileSettings>("profile"),
    getSetting<NiyuktaSettings>("niyukta"),
    getSetting<PricingSettings>("pricing"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string; siteUrl?: string; siteDescription?: string }>,
    Service.find({ isActive: true }).sort({ sortOrder: 1 }).limit(6).lean(),
    Project.find({ isActive: true, featured: true }).sort({ sortOrder: 1 }).limit(4).lean(),
    Testimonial.find({ isActive: true }).sort({ isFeatured: -1, createdAt: -1 }).limit(6).lean(),
  ]);

  const BASE = (meta as any).siteUrl || "https://chandankshah.com.np";

  return (
    <>
      {/* Structured data for SEO */}
      <PersonSchema
        name={profile.fullName}
        url={BASE}
        description={(meta as any).siteDescription}
        email={profile.email}
        telephone={profile.phone}
        location={profile.location}
        sameAs={[social.facebook, social.instagram, social.github, social.linkedin].filter(Boolean)}
      />
      <LocalBusinessSchema
        name={meta.siteName}
        url={BASE}
        description={(meta as any).siteDescription}
        telephone={profile.phone}
        email={profile.email}
        location={profile.location}
        services={(services as any[]).map(s => s.title)}
      />
      <WebSiteSchema
        name={meta.siteName}
        url={BASE}
        description={(meta as any).siteDescription}
      />

      <Navbar />
      <HomeClient
        hero={hero}
        profile={profile}
        niyukta={niyukta}
        pricing={pricing}
        services={JSON.parse(JSON.stringify(services))}
        projects={JSON.parse(JSON.stringify(projects))}
        testimonials={JSON.parse(JSON.stringify(testimonials))}
      />
      <Footer
        profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }}
        social={social}
        meta={meta}
      />
    </>
  );
}
