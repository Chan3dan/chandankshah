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

export const metadata = { title: "Services" };
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
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "clamp(40px,8vw,56px) 0 clamp(36px,7vw,48px)" }}>
          <div className="site-container">
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 16 }}>
              <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={13} />
              <span style={{ color: "var(--ink-2)" }}>Services</span>
            </nav>
            <p className="section-eyebrow">What I Offer</p>
            <h1 className="section-title" style={{ marginBottom: 12 }}>Services</h1>
            <p className="section-desc">Professional help for government forms, financial services, documentation, and digital projects.</p>
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
