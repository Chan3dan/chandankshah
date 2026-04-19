"use client";
import { useState } from "react";
import Link from "next/link";
import { Download, ExternalLink, FileText, Link2, Video, BookOpen, ChevronRight, ArrowRight, Star, TrendingDown } from "lucide-react";
import type { ProfileSettings } from "@/lib/settings";

interface Resource {
  _id: string; title: string; description: string; category: string;
  type: "pdf" | "link" | "doc" | "video"; fileUrl: string; externalUrl: string;
  thumbnail: string; tags: string[]; downloadCount: number;
  isFeatured: boolean; requiresEmail: boolean;
}

const TYPE_ICONS = {
  pdf: <FileText size={18} />,
  doc: <FileText size={18} />,
  link: <Link2 size={18} />,
  video: <Video size={18} />,
};
const TYPE_COLORS = { pdf: "#dc2626", doc: "#2563eb", link: "#059669", video: "#7c3aed" };
const TYPE_LABELS = { pdf: "PDF", doc: "Document", link: "Link", video: "Video" };

interface Props { resources: Resource[]; profile: ProfileSettings; }

export default function ResourcesClient({ resources, profile }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["all", ...Array.from(new Set(resources.map(r => r.category)))];
  const filtered = resources.filter(r => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });
  const featured = filtered.filter(r => r.isFeatured);
  const regular = filtered.filter(r => !r.isFeatured);

  const handleDownload = async (resource: Resource) => {
    // Increment counter in background
    fetch(`/api/resources/${resource._id}`, { method: "POST" }).catch(() => {});
    const url = resource.fileUrl || resource.externalUrl;
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <main style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "60px 0 48px", position: "relative", overflow: "hidden" }}>
        <div className="dot-pattern" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div className="site-container" style={{ position: "relative" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 20 }}>
            <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={13} /><span>Resources</span>
          </nav>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "var(--green-bg)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "var(--green)", marginBottom: 14 }}>
                100% Free · No login required
              </span>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.15, marginBottom: 12 }}>
                Free Study Materials<br />&amp; Resources
              </h1>
              <p style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.75, maxWidth: 480 }}>
                Loksewa syllabuses, DEMAT guides, practice questions, and digital service tutorials — all free to download.
              </p>
            </div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: <BookOpen size={20} />, value: `${resources.length}+`, label: "Resources Available", color: "var(--blue)" },
                { icon: <Download size={20} />, value: `${resources.reduce((a, r) => a + r.downloadCount, 0)}+`, label: "Total Downloads", color: "var(--green)" },
                { icon: <Star size={20} />, value: `${categories.length - 1}`, label: "Categories", color: "var(--amber)" },
                { icon: <TrendingDown size={20} />, value: "Free", label: "Always & Forever", color: "var(--purple)" },
              ].map(stat => (
                <div key={stat.label} className="card-static" style={{ padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${stat.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, flexShrink: 0 }}>
                    {stat.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--ink-1)", lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <input
              className="input"
              placeholder="Search resources…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ maxWidth: 280, flex: 1 }}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", border: "1.5px solid", transition: "all 0.15s",
                    background: activeCategory === cat ? "var(--blue)" : "var(--surface)",
                    borderColor: activeCategory === cat ? "var(--blue)" : "var(--border)",
                    color: activeCategory === cat ? "#fff" : "var(--ink-2)",
                    fontFamily: "var(--font-sans)",
                  }}>
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-4)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
              <p style={{ fontSize: 16 }}>{searchQuery ? `No results for "${searchQuery}"` : "No resources in this category yet."}</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured.length > 0 && (
                <div style={{ marginBottom: 48 }}>
                  <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 20 }}>⭐ Featured Resources</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                    {featured.map(r => <ResourceCard key={r._id} resource={r} onDownload={handleDownload} featured />)}
                  </div>
                </div>
              )}

              {/* All resources */}
              {regular.length > 0 && (
                <div>
                  {featured.length > 0 && <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 20 }}>All Resources</h2>}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {regular.map(r => <ResourceCard key={r._id} resource={r} onDownload={handleDownload} />)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <div style={{ marginTop: 64, background: "var(--ink-1)", borderRadius: 24, padding: "48px 40px", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, color: "#fff", marginBottom: 10 }}>
                Need personalized help with Loksewa or DEMAT?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>
                Free resources are a start — but professional guidance makes the difference.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              <Link href="/book" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "#fff", color: "var(--ink-1)", borderRadius: 10, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
                Book a Service <ArrowRight size={14} />
              </Link>
              <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 22px", background: "#25d366", color: "#fff", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ResourceCard({ resource: r, onDownload, featured = false }: { resource: Resource; onDownload: (r: Resource) => void; featured?: boolean }) {
  const color = TYPE_COLORS[r.type];
  return (
    <div className="card" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Type badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 99, fontSize: 12, fontWeight: 700, color }}>
          {TYPE_ICONS[r.type]} {TYPE_LABELS[r.type]}
        </div>
        {r.downloadCount > 0 && (
          <span style={{ fontSize: 11, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}>
            <Download size={11} /> {r.downloadCount}
          </span>
        )}
      </div>

      <h3 style={{ fontWeight: 700, fontSize: featured ? 17 : 15, color: "var(--ink-1)", marginBottom: 8, lineHeight: 1.3 }}>{r.title}</h3>
      <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 14, flex: 1 }}>{r.description}</p>

      {/* Tags */}
      {r.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
          {r.tags.slice(0, 4).map(t => (
            <span key={t} style={{ padding: "2px 8px", background: "var(--bg-muted)", borderRadius: 99, fontSize: 11, color: "var(--ink-4)" }}>{t}</span>
          ))}
        </div>
      )}

      {/* Download button */}
      <button onClick={() => onDownload(r)} style={{
        width: "100%", padding: "10px 16px", background: `${color}10`, border: `1.5px solid ${color}30`,
        borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, fontSize: 14, fontWeight: 700, color, transition: "all 0.15s", fontFamily: "var(--font-sans)",
      }}
        onMouseEnter={e => { (e.currentTarget.style.background = `${color}18`); }}
        onMouseLeave={e => { (e.currentTarget.style.background = `${color}10`); }}
      >
        {r.type === "link" || r.type === "video" ? <><ExternalLink size={15} /> Open Resource</> : <><Download size={15} /> Download Free</>}
      </button>
    </div>
  );
}
