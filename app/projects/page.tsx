import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ExternalLink, ChevronRight, ArrowRight } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

export const metadata = { title: "Portfolio & Projects" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await connectDB();
  const [projectsRaw, profile, social, meta] = await Promise.all([
    Project.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
  ]);
  const projects = JSON.parse(JSON.stringify(projectsRaw));
  const featured = projects.filter((p: any) => p.featured);
  const rest = projects.filter((p: any) => !p.featured);
  const categories = [...new Set(rest.map((p: any) => p.category))] as string[];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        <section className="public-page-hero">
          <div className="site-container">
            <div className="public-page-head">
              <nav className="public-page-breadcrumbs">
                <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
                <ChevronRight size={13} />
                <span style={{ color: "var(--ink-2)" }}>Portfolio</span>
              </nav>
              <div className="public-page-copy">
                <p className="section-eyebrow">My Work</p>
                <h1 className="section-title">Portfolio & Projects</h1>
                <p className="section-desc">Selected websites, platforms, and service delivery projects designed to work smoothly on real devices, not just large desktop screens.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="site-container public-page-shell">
            {featured.length > 0 && (
              <div style={{ marginBottom: 52 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 20 }}>Featured</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                  {featured.map((p: any) => (
                    <Link key={p._id} href={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
                      <div className="card" style={{ padding: 30, height: "100%" }}>
                        {p.imageUrl && (
                          <div style={{ height: 180, background: "var(--bg-subtle)", borderRadius: 12, marginBottom: 20, overflow: "hidden" }}>
                            <img src={p.imageUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <span style={{ padding: "3px 10px", background: "var(--blue-bg)", color: "var(--blue)", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{p.category}</span>
                          {p.link && <ExternalLink size={15} color="var(--ink-4)" />}
                        </div>
                        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--ink-1)", marginBottom: 8, lineHeight: 1.2 }}>{p.title}</h3>
                        <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                          {p.tags?.map((t: string) => (
                            <span key={t} style={{ padding: "2px 9px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 12, color: "var(--ink-4)" }}>{t}</span>
                          ))}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)", display: "flex", alignItems: "center", gap: 4 }}>
                          View Details <ArrowRight size={13} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {categories.map((cat) => (
              <div key={cat} style={{ marginBottom: 44 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 18 }}>{cat}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {rest.filter((p: any) => p.category === cat).map((p: any) => (
                    <Link key={p._id} href={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
                      <div className="card" style={{ padding: 24, height: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <span style={{ padding: "2px 8px", background: "var(--bg-muted)", color: "var(--ink-4)", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{p.category}</span>
                          {p.link && <ExternalLink size={13} color="var(--ink-4)" />}
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 6 }}>{p.title}</h3>
                        <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 12 }}>{p.description}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {p.tags?.slice(0, 4).map((t: string) => (
                            <span key={t} style={{ padding: "2px 8px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 11, color: "var(--ink-4)" }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-4)" }}>No projects yet.</div>
            )}
          </div>
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
