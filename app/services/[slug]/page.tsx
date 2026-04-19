import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, ChevronRight, MessageCircle } from "lucide-react";
import { ServiceSchema, BreadcrumbSchema } from "@/components/public/StructuredData";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const svc = await Service.findOne({ slug }).lean() as any;
  return { title: svc?.title || "Service", description: svc?.description };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const [svc, relatedRaw, profile, social, meta] = await Promise.all([
    Service.findOne({ slug, isActive: true }).lean() as Promise<any>,
    Service.find({ isActive: true, slug: { $ne: slug } }).limit(3).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string; siteUrl?: string }>,
  ]);
  if (!svc) notFound();
  const related = JSON.parse(JSON.stringify(relatedRaw));
  const BASE = (meta as any).siteUrl || "https://chandankshah.com.np";

  return (
    <>
      <ServiceSchema name={svc.title} description={svc.description} url={`${BASE}/services/${svc.slug}`} price={svc.price} provider={profile.fullName} />
      <BreadcrumbSchema items={[
        { name: "Home", url: BASE },
        { name: "Services", url: `${BASE}/services` },
        { name: svc.title, url: `${BASE}/services/${svc.slug}` },
      ]} />
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "52px 0 44px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: svc.color, opacity: 0.6 }} />
          <div className="site-container">
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 20, flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }} className="hover-blue">Home</Link>
              <ChevronRight size={13} />
              <Link href="/services" style={{ color: "var(--ink-4)", textDecoration: "none" }} className="hover-blue">Services</Link>
              <ChevronRight size={13} />
              <span style={{ color: "var(--ink-2)" }}>{svc.title}</span>
            </nav>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }} className="sidebar-layout">
              <div>
                {svc.badge && <span className="badge badge-blue" style={{ marginBottom: 14 }}>{svc.badge}</span>}
                <div style={{ fontSize: 36, marginBottom: 12 }}>{svc.icon}</div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "var(--ink-1)", marginBottom: 12, lineHeight: 1.1 }}>{svc.title}</h1>
                <p style={{ fontSize: 17, color: "var(--ink-3)", lineHeight: 1.75, maxWidth: 560 }}>{svc.description}</p>
              </div>

              {/* Booking card */}
              <div className="card-static" style={{ padding: 28 }}>
                <div style={{ fontSize: 22, fontFamily: "var(--font-serif)", fontWeight: 400, color: svc.color, marginBottom: 4 }}>{svc.price}</div>
                {svc.priceNote && <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 18 }}>{svc.priceNote}</p>}
                <Link href={`/book?service=${encodeURIComponent(svc.title)}`} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 10, display: "flex" }}>
                  Book This Service <ArrowRight size={15} />
                </Link>
                <a href={`https://wa.me/${profile.whatsapp}?text=Hello%20Chandan%2C%20I%20need%20help%20with%20${encodeURIComponent(svc.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  <MessageCircle size={15} /> WhatsApp Me
                </a>
                <div style={{ marginTop: 14, padding: "10px", background: "var(--bg-subtle)", borderRadius: 8, fontSize: 12, color: "var(--ink-4)", textAlign: "center" }}>
                  ⏰ {profile.availability}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "56px 0" }}>
          <div className="site-container">
            <div className="sidebar-layout">
              <div>
                {svc.longDescription && (
                  <div style={{ marginBottom: 36 }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 14 }}>About This Service</h2>
                    <div className="prose">{svc.longDescription}</div>
                  </div>
                )}
                {svc.features?.length > 0 && (
                  <div>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>What&apos;s Included</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                      {svc.features.map((f: string) => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, color: "var(--ink-2)" }}>
                          <CheckCircle2 size={15} color="var(--green)" style={{ flexShrink: 0 }} /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="card-static" style={{ padding: 22 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Details</h3>
                  {[
                    ["Category", svc.category],
                    ["Starting Price", svc.price],
                    ["Available", profile.availability],
                    ["Location", profile.location],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 13, color: "var(--ink-4)" }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{value}</span>
                    </div>
                  ))}
                </div>

                {related.length > 0 && (
                  <div className="card-static" style={{ padding: 22 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Other Services</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {related.map((r: any) => (
                        <Link key={r._id} href={`/services/${r.slug}`}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--bg-subtle)", borderRadius: 10, textDecoration: "none" }}
                          className="hover-bg">
                          <span style={{ fontSize: 18 }}>{r.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{r.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-static" style={{ padding: 22, background: "var(--blue-bg)", borderColor: "var(--blue-border)" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--blue)", marginBottom: 8 }}>💡 Ready to get started?</p>
                  <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 14, lineHeight: 1.6 }}>Book instantly or send a quick WhatsApp message.</p>
                  <Link href={`/book?service=${encodeURIComponent(svc.title)}`} className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                    Book Now <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp }} social={social} meta={meta} />
    </>
  );
}
