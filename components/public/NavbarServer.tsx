import { getSetting } from "@/lib/settings";
import type { HeroSettings, NavSettings, ProfileSettings, SiteMetaSettings } from "@/lib/settings";
import NavbarClient from "./Navbar";

// Server component — fetches nav settings from DB, passes to client Navbar
export default async function NavbarServer() {
  const [nav, hero, profile, meta] = await Promise.all([
    getSetting<NavSettings>("nav").catch(() => ({
      niyuktaUrl: "https://niyukta.com",
      niyuktaLabel: "Niyukta",
      showNiyuktaInNav: true,
      extraLinks: [],
    })),
    getSetting<HeroSettings>("hero").catch(() => ({
      name: "Chandan Kumar Shah",
      tagline: "BCA Student & Digital Services Specialist",
      subtitle: "Turning complexity into clarity",
      description: "",
      bannerUrl: "",
      bannerPublicId: "",
      logoUrl: "",
      logoPublicId: "",
      ctaPrimary: "View Services",
      ctaSecondary: "My Portfolio",
      badges: [],
      stats: [],
      avatarLetter: "C",
      resumeUrl: "/resume.pdf",
    })),
    getSetting<ProfileSettings>("profile").catch(() => ({
      fullName: "Chandan Kumar Shah",
      bio1: "",
      bio2: "",
      location: "Nepal",
      availability: "",
      phone: "",
      email: "",
      whatsapp: "",
      skills: [],
      education: [],
      certifications: [],
      languages: [],
    })),
    getSetting<SiteMetaSettings>("meta").catch(() => ({
      siteName: "Chandan Kumar Shah",
      siteTagline: "Digital Services",
      siteDescription: "",
      siteUrl: "",
      ogImage: "",
      favicon: "",
      googleAnalytics: "",
      maintenanceMode: false,
    })),
  ]);

  return (
    <NavbarClient
      navSettings={nav}
      brand={{
        name: profile.fullName || hero.name || meta.siteName,
        tagline: meta.siteTagline || "Digital Services",
        logoUrl: hero.logoUrl,
        avatarLetter: hero.avatarLetter,
      }}
    />
  );
}
