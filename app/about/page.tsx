import { getSetting } from "@/lib/settings";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/models";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { GraduationCap, Award, ChevronRight, Star, Download, ArrowRight, Mail, MapPin, Phone, Clock3, Languages, Medal } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import { BUSINESS_DISCLAIMER, OFFICIAL_PROCESS_NOTICE } from "@/lib/site-content";

export const metadata = { title: "About Me" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await connectDB();
  const [profile, social, meta, testimonialsRaw] = await Promise.all([
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
    Testimonial.find({ isActive: true, isFeatured: true }).limit(3).lean(),
  ]);
  const testimonials = JSON.parse(JSON.stringify(testimonialsRaw));

  const skillsByCategory = profile.skills.reduce((acc, sk) => {
    if (!acc[sk.category]) acc[sk.category] = [];
    acc[sk.category].push(sk);
    return acc;
  }, {} as Record<string, typeof profile.skills>);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "72px 0 60px", position: "relative", overflow: "hidden" }}>
          <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div className="site-container" style={{ position: "relative" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 28 }}>
              <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={13} />
              <span>About</span>
            </nav>

            <div className="split-2" style={{ gap: 64 }}>
              <div>
                <p className="section-eyebrow">About Me</p>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.1, marginBottom: 16 }}>
                  {profile.fullName}
                </h1>
                <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "var(--ink-3)", lineHeight: 1.8, marginBottom: 16 }}>{profile.bio1}</p>
                <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "var(--ink-3)", lineHeight: 1.8, marginBottom: 32 }}>{profile.bio2}</p>
                <div style={{ padding: "16px 18px", borderRadius: 16, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)", marginBottom: 28 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>Independent service notice</h2>
                  <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7, margin: "0 0 8px" }}>{BUSINESS_DISCLAIMER}</p>
                  <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>{OFFICIAL_PROCESS_NOTICE}</p>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/contact" className="btn btn-primary">Contact Me <ArrowRight size={15} /></Link>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <Download size={15} /> Download CV
                  </a>
                </div>
              </div>

              <div className="card" style={{ padding: 32 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: 32, color: "#fff", margin: "0 auto 20px" }}>
                  {profile.fullName.charAt(0)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Location", value: profile.location, icon: MapPin },
                    { label: "Phone", value: profile.phone, icon: Phone },
                    { label: "Email", value: profile.email, icon: Mail },
                    { label: "Available", value: profile.availability, icon: Clock3 },
                    { label: "Languages", value: profile.languages?.join(", "), icon: Languages },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", gap: 12, padding: "10px 14px", background: "var(--bg-subtle)", borderRadius: 10, alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-4)", flexShrink: 0, width: 124 }}>
                        <item.icon size={14} />
                        {item.label}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="section">
          <div className="site-container">
            <p className="section-eyebrow">Expertise</p>
            <h2 className="section-title" style={{ marginBottom: 48 }}>Skills & Capabilities</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 32 }}>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category}>
                  <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 20 }}>{category}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {skills.map(sk => (
                      <div key={sk.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{sk.name}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--blue)" }}>{sk.level}%</span>
                        </div>
                        <div className="skill-bar-track">
                          <div className="skill-bar-fill" style={{ width: `${sk.level}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="section-sm" style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
          <div className="site-container">
            <div className="grid-2" style={{ gap: 48 }}>
              <div>
                <h2 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 24 }}>
                  <GraduationCap size={20} color="var(--blue)" /> Education
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {profile.education.map((e, i) => (
                    <div key={i} className="card-static" style={{ padding: 22 }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--blue-bg)", border: "1px solid var(--blue-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <GraduationCap size={18} color="var(--blue)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)", marginBottom: 3 }}>{e.degree}</div>
                          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{e.institution}</div>
                          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                            <span style={{ fontSize: 12, color: "var(--ink-4)" }}>{e.year}</span>
                            {e.grade && <span className="badge badge-green">{e.grade}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontFamily: "var(--font-serif)", fontWeight: 400, marginBottom: 24 }}>
                  <Award size={20} color="var(--blue)" /> Certifications
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {profile.certifications?.map((c, i) => (
                    <div key={i} className="card-static" style={{ padding: 22 }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Medal size={18} color="var(--amber)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)", marginBottom: 3 }}>{c.name}</div>
                          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{c.issuer}</div>
                          <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>{c.year}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="site-container">
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <p className="section-eyebrow" style={{ justifyContent: "center" }}>Reviews</p>
                <h2 className="section-title">What Clients Say</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {testimonials.map((t: any) => (
                  <div key={t._id} className="card" style={{ padding: 26 }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                      {Array.from({ length: t.rating }).map((_: unknown, i: number) => (
                        <Star key={i} size={14} fill="var(--amber)" color="var(--amber)" />
                      ))}
                    </div>
                    <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 16 }}>&ldquo;{t.text}&rdquo;</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.avatarColor || "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.avatarInitial}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
