"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, ExternalLink, Gauge, Layers3, ShieldCheck, Sparkles, X } from "lucide-react";

interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  tags?: string[];
  link?: string;
  githubLink?: string;
  featured?: boolean;
  role?: string;
  timeframe?: string;
  status?: string;
  platform?: string;
  focusAreas?: string[];
  outcomes?: string[];
}

export default function ProjectsPortfolioClient({ projects }: { projects: ProjectItem[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const featured = useMemo(() => projects.filter((project) => project.featured), [projects]);
  const rest = useMemo(() => projects.filter((project) => !project.featured), [projects]);
  const categories = useMemo(() => [...new Set(rest.map((project) => project.category))], [rest]);
  const liveProjects = useMemo(() => projects.filter((project) => project.link).length, [projects]);
  const stackCount = useMemo(() => [...new Set(projects.flatMap((project) => project.tags || []))].length, [projects]);

  return (
    <>
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
              { label: "Featured case studies", value: `${featured.length}`, icon: Sparkles },
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
                {featured.map((project) => (
                  <article key={project.slug} className="card" style={{ padding: 28, height: "100%", display: "grid", gap: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ padding: "4px 12px", background: "var(--blue-bg)", color: "var(--blue)", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{project.category}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {project.status && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{project.status}</span>}
                        {project.link && <ExternalLink size={15} color="var(--ink-4)" />}
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.12, marginBottom: 10 }}>{project.title}</h3>
                      <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.8, margin: 0 }}>{project.description}</p>
                    </div>
                    <div className="info-card-grid">
                      <div style={{ padding: "14px 16px", borderRadius: 16, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>Role</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{project.role || "Full project delivery"}</div>
                      </div>
                      <div style={{ padding: "14px 16px", borderRadius: 16, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>Timeframe</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{project.timeframe || "Ongoing"}</div>
                      </div>
                    </div>
                    {(project.outcomes || []).length > 0 && (
                      <div style={{ display: "grid", gap: 10 }}>
                        {(project.outcomes || []).slice(0, 3).map((outcome) => (
                          <div key={outcome} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", marginTop: 8, flexShrink: 0 }} />
                            {outcome}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {(project.tags || []).map((tag) => (
                        <span key={tag} style={{ padding: "4px 10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12, color: "var(--ink-4)", fontWeight: 600 }}>{tag}</span>
                      ))}
                    </div>
                    <div className="stack-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelectedProject(project)}>
                        Quick View <ArrowRight size={13} />
                      </button>
                      <Link href={`/projects/${project.slug}`} className="btn btn-secondary btn-sm">
                        Full Page
                      </Link>
                    </div>
                  </article>
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
                { title: "Clarity first", text: "Each build starts from structure, audience, and what a visitor actually needs to do on the page." },
                { title: "Responsive by default", text: "Layouts are planned for mobile and smaller screens instead of being corrected only at the end." },
                { title: "Production mindset", text: "Deployment, maintainability, SEO basics, and content updates are treated as part of delivery rather than afterthoughts." },
              ].map((item) => (
                <div key={item.title} className="card-static" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--ink-3)", margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {categories.map((category) => (
            <div key={category} style={{ marginBottom: 44 }}>
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 8 }}>{category}</p>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", margin: 0 }}>{category}</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {rest.filter((project) => project.category === category).map((project) => (
                  <article key={project.slug} className="card" style={{ padding: 24, height: "100%", display: "grid", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <span style={{ padding: "2px 8px", background: "var(--bg-muted)", color: "var(--ink-4)", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{project.category}</span>
                      {project.link && <ExternalLink size={13} color="var(--ink-4)" />}
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-1)", marginBottom: 6 }}>{project.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 12 }}>{project.description}</p>
                      {project.role && <p style={{ fontSize: 12.5, color: "var(--ink-4)", lineHeight: 1.6, marginBottom: 12 }}>Role: {project.role}</p>}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {(project.tags || []).slice(0, 4).map((tag) => (
                        <span key={tag} style={{ padding: "2px 8px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 11, color: "var(--ink-4)" }}>{tag}</span>
                      ))}
                    </div>
                    <div className="stack-actions" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelectedProject(project)}>
                        View Project
                      </button>
                      <Link href={`/projects/${project.slug}`} className="btn btn-ghost btn-sm">
                        Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-4)" }}>No projects yet.</div>
          )}
        </div>
      </section>

      {selectedProject && (
        <div className="responsive-modal-shell" onClick={() => setSelectedProject(null)}>
          <div
            className="responsive-modal-panel"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "var(--shadow-lg)", padding: "clamp(22px,4vw,30px)", position: "relative" }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
          >
            <button
              onClick={() => setSelectedProject(null)}
              style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-subtle)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              aria-label="Close project modal"
            >
              <X size={16} />
            </button>
            <div style={{ marginBottom: 18, paddingRight: 28 }}>
              <p className="section-eyebrow" style={{ marginBottom: 8 }}>Project Quick View</p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 400, color: "var(--ink-1)", marginBottom: 10 }}>{selectedProject.title}</h2>
              <p style={{ fontSize: 15, color: "var(--ink-3)", lineHeight: 1.8, margin: 0 }}>{selectedProject.description}</p>
            </div>
            <div className="info-card-grid" style={{ marginBottom: 20 }}>
              {selectedProject.role && <div className="card-subtle" style={{ padding: 16 }}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>Role</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{selectedProject.role}</div></div>}
              {selectedProject.timeframe && <div className="card-subtle" style={{ padding: 16 }}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>Timeframe</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{selectedProject.timeframe}</div></div>}
              {selectedProject.platform && <div className="card-subtle" style={{ padding: 16 }}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>Platform</div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>{selectedProject.platform}</div></div>}
              {selectedProject.status && <div className="card-subtle" style={{ padding: 16 }}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 6 }}>Status</div><div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>{selectedProject.status}</div></div>}
            </div>
            {selectedProject.longDescription && <div style={{ marginBottom: 20 }}><div className="prose" dangerouslySetInnerHTML={{ __html: selectedProject.longDescription.replace(/\n/g, "<br/>") }} /></div>}
            {(selectedProject.focusAreas || []).length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-1)", marginBottom: 10 }}>Focus areas</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(selectedProject.focusAreas || []).map((item) => (
                    <span key={item} style={{ padding: "6px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12.5, color: "var(--ink-2)", fontWeight: 600 }}>{item}</span>
                  ))}
                </div>
              </div>
            )}
            {(selectedProject.outcomes || []).length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-1)", marginBottom: 10 }}>Outcomes</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  {(selectedProject.outcomes || []).map((item) => (
                    <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)", marginTop: 8, flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(selectedProject.tags || []).length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-1)", marginBottom: 10 }}>Tech stack</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(selectedProject.tags || []).map((tag) => (
                    <span key={tag} style={{ padding: "4px 10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12, color: "var(--ink-4)", fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="stack-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href={`/projects/${selectedProject.slug}`} className="btn btn-primary">Open Full Page</Link>
              {selectedProject.link && <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Visit Live Site <ExternalLink size={14} /></a>}
              {selectedProject.githubLink && <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">GitHub</a>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
