import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ExternalLink, ChevronRight, ArrowRight, ShieldCheck, Layers3, Gauge, Sparkles } from "lucide-react";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { mergePortfolioProjects, syncDefaultPortfolioProjects } from "@/lib/portfolio";

export const metadata = buildMetadata({
  title: "Portfolio & Projects",
  path: "/projects",
  description:
    "Explore web products, portfolio systems, and practical delivery projects built by Chandan Kumar Shah with attention to structure, responsiveness, and real-world usability.",
  keywords: ["portfolio Nepal developer", "projects Chandan Shah", "web development portfolio Nepal", "web application portfolio"],
});
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await connectDB();
  await syncDefaultPortfolioProjects();
  const [projectsRaw, profile, social, meta] = await Promise.all([
    Project.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string }>,
  ]);
  const projects = mergePortfolioProjects(JSON.parse(JSON.stringify(projectsRaw)));
  const featured = projects.filter((p: any) => p.featured);
  const rest = projects.filter((p: any) => !p.featured);
  const categories = [...new Set(rest.map((p: any) => p.category))] as string[];
  const liveProjects = projects.filter((p: any) => p.link).length;
  const featuredCount = featured.length;
  const stackCount = [...new Set(projects.flatMap((p: any) => p.tags || []))].length;

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
                <p className="section-desc">A practical portfolio of deployed web work, platform builds, and project delivery shaped around usability, structure, and real production constraints.</p>
              </div>
            </div>
            <div className="page-hero-stats" style={{ marginTop: 28 }}>
              {[
                { label: "Live projects", value: `${liveProjects}+`, icon: Gauge },
                { label: "Featured case studies", value: `${featuredCount}`, icon: Sparkles },
                { label: "Technologies represented", value: `${stackCount}+`, icon: Layers3 },
                { label: "Focus", value: "Usability", icon: ShieldCheck },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="card-static" style={{ padding: 18 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--blue-bg)", border: "1px solid var(--blue-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <Icon size={18} color="var(--blue)" />
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--ink-1)", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-4)", marginTop: 6 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-sm" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="site-container">
            <div className="page-chip-row">
              {[
                "Responsive interfaces",
                "SEO-aware delivery",
                "Content-managed builds",
                "PHP and MySQL foundations",
                "Next.js production workflows",
                "Clean public-facing UX",
              ].map((item) => (
                <span key={item} style={{ padding: "10px 14px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="site-container public-page-shell">
            {featured.length > 0 && (
              <div style={{ marginBottom: 56 }}>
                <div className="home-section-heading" style={{ marginBottom: 24 }}>
                  <div>
                    <p className="section-eyebrow">Featured Case Studies</p>
                    <h2 className="section-title">Selected work with real delivery value</h2>
                    <p className="section-desc home-section-lead" style={{ marginTop: 10 }}>
                      These projects best represent product thinking, implementation discipline, and the ability to ship work that feels credible beyond a classroom demo.
                    </p>
                  </div>
                </div>
                <div className="grid-auto-lg">
                  {featured.map((p: any) => (
                    <Link key={p.slug} href={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
                      <article className="card" style={{ padding: 28, height: "100%", display: "grid", gap: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <span style={{ padding: "4px 12px", background: "var(--blue-bg)", color: "var(--blue)", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{p.category}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {p.status && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{p.status}</span>}
                            {p.link && <ExternalLink size={15} color="var(--ink-4)" />}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.12, marginBottom: 10 }}>{p.title}</h3>
                          <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.8, margin: 0 }}>{p.description}</p>
                        </div>
                        <div className="info-card-grid">
                          <div style={{ padding: "14px 16px", borderRadius: 16, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>Role</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{p.role || "Full project delivery"}</div>
                          </div>
                          <div style={{ padding: "14px 16px", borderRadius: 16, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>Timeframe</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{p.timeframe || "Ongoing"}</div>
                          </div>
                        </div>
                        {(p.outcomes || []).length > 0 && (
                          <div style={{ display: "grid", gap: 10 }}>
                            {p.outcomes.slice(0, 3).map((outcome: string) => (
                              <div key={outcome} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", marginTop: 8, flexShrink: 0 }} />
                                {outcome}
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {(p.tags || []).map((t: string) => (
                            <span key={t} style={{ padding: "4px 10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12, color: "var(--ink-4)", fontWeight: 600 }}>{t}</span>
                          ))}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--blue)", display: "flex", alignItems: "center", gap: 5 }}>
                          Open Case Study <ArrowRight size={13} />
                        </span>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 48 }}>
              <div className="home-section-heading" style={{ marginBottom: 20 }}>
                <div>
                  <p className="section-eyebrow">Approach</p>
                  <h2 className="section-title">How projects are shaped for real use</h2>
                </div>
              </div>
              <div className="info-card-grid">
                {[
                  {
                    title: "Clarity first",
                    text: "Each build starts from structure, audience, and what a visitor actually needs to do on the page.",
                  },
                  {
                    title: "Responsive by default",
                    text: "Layouts are planned for mobile and smaller screens instead of being corrected only at the end.",
                  },
                  {
                    title: "Production mindset",
                    text: "Deployment, maintainability, SEO basics, and content updates are treated as part of delivery rather than afterthoughts.",
                  },
                ].map((item) => (
                  <div key={item.title} className="card-static" style={{ padding: 22 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--ink-3)", margin: 0 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {categories.map((cat) => (
              <div key={cat} style={{ marginBottom: 44 }}>
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 8 }}>{cat}</p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", margin: 0 }}>{cat}</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {rest.filter((p: any) => p.category === cat).map((p: any) => (
                    <Link key={p.slug} href={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
                      <div className="card" style={{ padding: 24, height: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <span style={{ padding: "2px 8px", background: "var(--bg-muted)", color: "var(--ink-4)", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{p.category}</span>
                          {p.link && <ExternalLink size={13} color="var(--ink-4)" />}
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-1)", marginBottom: 6 }}>{p.title}</h3>
                        <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 12 }}>{p.description}</p>
                        {p.role && <p style={{ fontSize: 12.5, color: "var(--ink-4)", lineHeight: 1.6, marginBottom: 12 }}>Role: {p.role}</p>}
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
