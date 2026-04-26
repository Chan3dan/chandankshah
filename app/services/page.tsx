import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import { FAQSchema } from "@/components/public/StructuredData";
import { SERVICES_PAGE_FAQS } from "@/lib/site-content";
import ServicesDirectoryClient from "@/components/public/ServicesDirectoryClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  path: "/services",
  description:
    "Browse documentation help, Loksewa support, DEMAT and Mero Share setup, academic project help, and web development services available across Nepal.",
  keywords: ["Loksewa help Nepal", "DEMAT setup Nepal", "documentation services Nepal", "web development Nepal"],
});
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  await connectDB();
  const [services, profile, social, meta] = await Promise.all([
    Service.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
  ]);

  return (
    <>
      <FAQSchema faqs={SERVICES_PAGE_FAQS} />
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <section className="public-page-hero">
          <div className="site-container">
            <div className="public-page-head">
              <nav className="public-page-breadcrumbs">
                <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
                <ChevronRight size={13} />
                <span style={{ color: "var(--ink-2)" }}>Services</span>
              </nav>
              <div className="public-page-copy">
                <p className="section-eyebrow">What I Offer</p>
                <h1 className="section-title">Services</h1>
                <p className="section-desc">Professional help for government forms, financial services, documentation, and digital projects delivered with clear steps, honest pricing, and responsive support across Nepal.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <ServicesDirectoryClient services={JSON.parse(JSON.stringify(services))} />
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
