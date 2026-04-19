import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import ServiceIcon from "@/components/public/ServiceIcon";

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
  const categories = [...new Set((services as any[]).map((s) => s.category))];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "56px 0 48px" }}>
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
          <div className="site-container">
            {categories.map((cat) => {
              const catServices = (services as any[]).filter((s) => s.category === cat);
              return (
                <div key={cat} style={{ marginBottom: 56 }}>
                  <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 20 }}>{cat}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
                    {catServices.map((svc: any) => (
                      <Link key={svc._id} href={`/services/${svc.slug}`} style={{ textDecoration: "none" }}>
                        <div className="card" style={{ padding: 26, height: "100%", position: "relative", overflow: "hidden" }}>
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: svc.color, opacity: 0.55, borderRadius: "20px 20px 0 0" }} />
                          {svc.badge && <span style={{ position: "absolute", top: 14, right: 14, fontSize: 11, fontWeight: 700, padding: "2px 9px", background: `${svc.color}18`, color: svc.color, borderRadius: 99 }}>{svc.badge}</span>}
                          <div style={{ width: 48, height: 48, borderRadius: 13, background: `${svc.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                            <ServiceIcon service={svc} color={svc.color} />
                          </div>
                          <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-1)", marginBottom: 6 }}>{svc.title}</h3>
                          <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 14 }}>{svc.description}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: svc.color }}>{svc.price}</span>
                            <span style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>Details <ArrowRight size={13} /></span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {services.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-4)" }}>
                <p>No services listed yet.</p>
              </div>
            )}

            <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24, marginTop: 24 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--ink-1)", marginBottom: 4 }}>Don&apos;t see what you need?</h3>
                <p style={{ color: "var(--ink-3)", fontSize: 14 }}>Reach out — I handle many more services.</p>
              </div>
              <Link href="/contact" className="btn btn-primary">Contact Me <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
