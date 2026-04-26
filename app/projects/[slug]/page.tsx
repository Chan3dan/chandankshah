import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ChevronRight, ArrowLeft, ShieldCheck, Layers3, Gauge } from "lucide-react";
import { BreadcrumbSchema } from "@/components/public/StructuredData";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { mergePortfolioProjects, syncDefaultPortfolioProjects } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  await syncDefaultPortfolioProjects();
  const projectRaw = await Project.find({ isActive: true }).lean() as any[];
  const p = mergePortfolioProjects(JSON.parse(JSON.stringify(projectRaw))).find((item: any) => item.slug === slug);
  if (!p) {
    return buildMetadata({
      title: "Project",
      path: `/projects/${slug}`,
      description: "Explore project work by Chandan Kumar Shah.",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: p.title,
    path: `/projects/${slug}`,
    description: p.description || `Explore the ${p.title} project by Chandan Kumar Shah.`,
    imagePath: p.imageUrl || "/opengraph-image",
    keywords: [p.category, ...(p.tags || []), "portfolio Nepal", "web development project"].filter(Boolean),
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  await syncDefaultPortfolioProjects();
  const [projectRaw, relatedRaw, profile, social, meta] = await Promise.all([
    Project.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 }).lean() as Promise<any[]>,
    Project.find({ isActive: true, slug: { $ne: slug } }).limit(3).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string; siteUrl?: string }>,
  ]);
  const projects = mergePortfolioProjects(JSON.parse(JSON.stringify(projectRaw)));
  const p = projects.find((item: any) => item.slug === slug);
  if (!p) notFound();
  const related = projects.filter((item: any) => item.slug !== slug).slice(0, 3);
  const BASE = (meta as any).siteUrl || "https://chandankshah.com.np";

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: BASE },
        { name: "Portfolio", url: `${BASE}/projects` },
        { name: p.title, url: `${BASE}/projects/${p.slug}` },
      ]} />
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "clamp(40px,8vw,52px) 0 clamp(36px,7vw,44px)" }}>
          <div className="site-container">
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 20, flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }} className="hover-blue">Home</Link>
              <ChevronRight size={13} />
              <Link href="/projects" style={{ color: "var(--ink-4)", textDecoration: "none" }} className="hover-blue">Portfolio</Link>
              <ChevronRight size={13} />
              <span style={{ color: "var(--ink-2)" }}>{p.title}</span>
            </nav>
            <span style={{ padding: "3px 10px", background: "var(--blue-bg)", color: "var(--blue)", borderRadius: 99, fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 14 }}>{p.category}</span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "var(--ink-1)", marginBottom: 12, lineHeight: 1.1 }}>{p.title}</h1>
            <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "var(--ink-3)", maxWidth: 600, lineHeight: 1.75 }}>{p.description}</p>
            <div className="page-chip-row" style={{ marginTop: 18 }}>
              {p.role && <span style={{ padding: "8px 12px", borderRadius: 999, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13, color: "var(--ink-2)", fontWeight: 600 }}>Role: {p.role}</span>}
              {p.timeframe && <span style={{ padding: "8px 12px", borderRadius: 999, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 13, color: "var(--ink-2)", fontWeight: 600 }}>Timeframe: {p.timeframe}</span>}
              {p.status && <span style={{ padding: "8px 12px", borderRadius: 999, background: "var(--green-bg)", border: "1px solid rgba(22,163,74,0.2)", fontSize: 13, color: "var(--green)", fontWeight: 700 }}>{p.status}</span>}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <ExternalLink size={15} /> Visit Live Site
                </a>
              )}
              {p.githubLink && (
                <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  GitHub
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "clamp(40px,8vw,56px) 0" }}>
          <div className="site-container">
            <div className="sidebar-layout">
              <div>
                {p.imageUrl ? (
                  <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", marginBottom: 32 }}>
                    <img src={p.imageUrl} alt={p.title} style={{ width: "100%", display: "block" }} />
                  </div>
                ) : (
                  <div className="dark-panel" style={{ borderRadius: 20, padding: "32px 28px", marginBottom: 32 }}>
                    <div style={{ display: "grid", gap: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 1 }}>
                        <Layers3 size={15} color="var(--blue)" /> {p.platform || p.category}
                      </div>
                      <div className="dark-panel-title" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 400, lineHeight: 1.1 }}>{p.title}</div>
                      <p className="dark-panel-copy" style={{ margin: 0, maxWidth: 720, fontSize: 15, lineHeight: 1.8 }}>{p.description}</p>
                    </div>
                  </div>
                )}
                {(p.focusAreas || []).length > 0 && (
                  <div className="info-card-grid" style={{ marginBottom: 28 }}>
                    {p.focusAreas.map((item: string) => (
                      <div key={item} className="card-static" style={{ padding: 18 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--ink-2)", fontWeight: 600 }}>
                          <Gauge size={16} color="var(--blue)" />
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {p.longDescription ? (
                  <div className="prose" dangerouslySetInnerHTML={{ __html: p.longDescription.replace(/\n/g, "<br/>") }} />
                ) : (
                  <p style={{ color: "var(--ink-3)", fontSize: 15, lineHeight: 1.8 }}>{p.description}</p>
                )}
                {(p.outcomes || []).length > 0 && (
                  <div style={{ marginTop: 28 }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", marginBottom: 16 }}>Project outcomes</h2>
                    <div style={{ display: "grid", gap: 12 }}>
                      {p.outcomes.map((outcome: string) => (
                        <div key={outcome} className="card-static" style={{ padding: "16px 18px" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <ShieldCheck size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.75 }}>{outcome}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {(p.role || p.timeframe || p.platform || p.status) && (
                  <div className="card-static" style={{ padding: 22 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Project snapshot</h3>
                    <div style={{ display: "grid", gap: 10 }}>
                      {p.role && <div style={{ fontSize: 13.5, color: "var(--ink-2)" }}><strong>Role:</strong> {p.role}</div>}
                      {p.platform && <div style={{ fontSize: 13.5, color: "var(--ink-2)" }}><strong>Platform:</strong> {p.platform}</div>}
                      {p.timeframe && <div style={{ fontSize: 13.5, color: "var(--ink-2)" }}><strong>Timeframe:</strong> {p.timeframe}</div>}
                      {p.status && <div style={{ fontSize: 13.5, color: "var(--ink-2)" }}><strong>Status:</strong> {p.status}</div>}
                    </div>
                  </div>
                )}

                <div className="card-static" style={{ padding: 22 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Tech Stack</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {p.tags?.map((t: string) => (
                      <span key={t} style={{ padding: "4px 11px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 12, color: "var(--ink-3)", fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </div>

                <div className="card-static" style={{ padding: 22 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Links</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    ) : <span style={{ fontSize: 13, color: "var(--ink-4)" }}>No live demo</span>}
                    {p.githubLink && (
                      <a href={p.githubLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-2)", fontWeight: 600, textDecoration: "none" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {related.length > 0 && (
                  <div className="card-static" style={{ padding: 22 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>More Projects</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {related.map((r: any) => (
                        <Link key={r.slug} href={`/projects/${r.slug}`}
                          style={{ display: "block", padding: "9px 12px", background: "var(--bg-subtle)", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}
                          className="hover-bg">
                          {r.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/projects" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }} className="hover-blue">
                  <ArrowLeft size={14} /> Back to Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
