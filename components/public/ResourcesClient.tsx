"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Download,
  ExternalLink,
  FileText,
  Link2,
  Video,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Star,
  TrendingDown,
  FolderOpen,
  MessageCircle,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { ProfileSettings } from "@/lib/settings";

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: "pdf" | "link" | "doc" | "video";
  fileUrl: string;
  externalUrl: string;
  thumbnail: string;
  tags: string[];
  downloadCount: number;
  isFeatured: boolean;
  requiresEmail: boolean;
}

const TYPE_ICONS = {
  pdf: <FileText size={18} />,
  doc: <FileText size={18} />,
  link: <Link2 size={18} />,
  video: <Video size={18} />,
};

const TYPE_COLORS = {
  pdf: "#dc2626",
  doc: "#2563eb",
  link: "#059669",
  video: "#7c3aed",
};

const TYPE_LABELS = {
  pdf: "PDF",
  doc: "Document",
  link: "Link",
  video: "Video",
};

interface Props {
  resources: Resource[];
  profile: ProfileSettings;
}

export default function ResourcesClient({ resources, profile }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [leadLoading, setLeadLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    interestedCategory: "",
  });

  const categories = ["all", ...Array.from(new Set(resources.map((resource) => resource.category)))];
  const filtered = resources.filter((resource) => {
    const matchCat = activeCategory === "all" || resource.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      resource.title.toLowerCase().includes(q) ||
      resource.description.toLowerCase().includes(q) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(q));

    return matchCat && matchSearch;
  });

  const featured = filtered.filter((resource) => resource.isFeatured);
  const regular = filtered.filter((resource) => !resource.isFeatured);

  const openResource = (resource: Resource) => {
    fetch(`/api/resources/${resource._id}`, { method: "POST" }).catch(() => {});
    const url = resource.fileUrl || resource.externalUrl;
    if (url) window.open(url, "_blank", "noopener");
  };

  const handleDownload = (resource: Resource) => {
    setTrackingCode("");
    setLeadForm((prev) => ({
      ...prev,
      interestedCategory: resource.category || prev.interestedCategory,
    }));
    setSelectedResource(resource);
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;
    if (!leadForm.name.trim() || (!leadForm.email.trim() && !leadForm.phone.trim())) return;

    setLeadLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          service: leadForm.interestedCategory || selectedResource.category,
          subject: `Resource Download — ${selectedResource.title}`,
          message: `Requested resource: ${selectedResource.title}\nResource category: ${selectedResource.category}\nInterested service category: ${leadForm.interestedCategory || selectedResource.category}`,
          requestType: "resource",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not unlock resource.");
      setTrackingCode(data.trackingCode || "");
      openResource(selectedResource);
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <>
      <main style={{ paddingTop: 64 }}>
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "60px 0 48px", position: "relative", overflow: "hidden" }}>
          <div className="dot-pattern" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
          <div className="site-container" style={{ position: "relative" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 20 }}>
              <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={13} />
              <span>Resources</span>
            </nav>
            <div className="split-2">
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "var(--green-bg)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "var(--green)", marginBottom: 14 }}>
                  Free resources · Lead-ready follow-up
                </span>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.15, marginBottom: 12 }}>
                  Free Study Materials
                  <br />
                  &amp; Resources
                </h1>
                <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "var(--ink-3)", lineHeight: 1.75, maxWidth: 480 }}>
                  Loksewa syllabuses, DEMAT guides, practice questions, and digital service tutorials. Download free resources now and keep the door open for future help if you need it.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { icon: <BookOpen size={20} />, value: `${resources.length}+`, label: "Resources Available", color: "var(--blue)" },
                  { icon: <Download size={20} />, value: `${resources.reduce((total, resource) => total + resource.downloadCount, 0)}+`, label: "Total Downloads", color: "var(--green)" },
                  { icon: <Star size={20} />, value: `${categories.length - 1}`, label: "Categories", color: "var(--amber)" },
                  { icon: <TrendingDown size={20} />, value: "Free", label: "Always & Forever", color: "var(--purple)" },
                ].map((stat) => (
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
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 32 }}>
              <input
                className="input"
                placeholder="Search resources…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: 280, flex: 1 }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 99,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1.5px solid",
                      transition: "all 0.15s",
                      background: activeCategory === category ? "var(--blue)" : "var(--surface)",
                      borderColor: activeCategory === category ? "var(--blue)" : "var(--border)",
                      color: activeCategory === category ? "#fff" : "var(--ink-2)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {category === "all" ? "All" : category}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-4)" }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                  <FolderOpen size={42} />
                </div>
                <p style={{ fontSize: "clamp(14px,2vw,16px)" }}>{searchQuery ? `No results for "${searchQuery}"` : "No resources in this category yet."}</p>
              </div>
            ) : (
              <>
                {featured.length > 0 && (
                  <div style={{ marginBottom: 48 }}>
                    <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 20 }}>Featured Resources</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                      {featured.map((resource) => (
                        <ResourceCard key={resource._id} resource={resource} onDownload={handleDownload} featured />
                      ))}
                    </div>
                  </div>
                )}

                {regular.length > 0 && (
                  <div>
                    {featured.length > 0 && <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 20 }}>All Resources</h2>}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                      {regular.map((resource) => (
                        <ResourceCard key={resource._id} resource={resource} onDownload={handleDownload} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="dark-panel split-2" style={{ marginTop: 64, borderRadius: 24, padding: "48px 40px", gap: 32 }}>
              <div>
                <h3 className="dark-panel-title" style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 10 }}>
                  Need personalized help with Loksewa or DEMAT?
                </h3>
                <p className="dark-panel-copy" style={{ fontSize: 15 }}>
                  Free resources are useful on their own, but guided support helps when the process becomes time-sensitive or document-heavy.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
                <Link href="/book" className="light-on-dark-btn" style={{ whiteSpace: "nowrap" }}>
                  Book a Service <ArrowRight size={14} />
                </Link>
                <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {selectedResource && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 560, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, boxShadow: "var(--shadow-lg)", padding: "clamp(22px,4vw,30px)", position: "relative" }}>
            <button
              onClick={() => { setSelectedResource(null); setTrackingCode(""); }}
              style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-subtle)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={16} />
            </button>

            <div style={{ marginBottom: 18 }}>
              <p className="section-eyebrow" style={{ marginBottom: 8 }}>Resource access</p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, color: "var(--ink-1)", marginBottom: 8 }}>{selectedResource.title}</h2>
              <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>
                Share your details to open the resource and receive support later if you want help turning it into a real completed task.
              </p>
            </div>

            {trackingCode ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle2 size={28} color="var(--green)" />
                </div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, marginBottom: 8 }}>Resource unlocked</h3>
                <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 18 }}>
                  Your resource has been opened. Keep this tracking code if you want follow-up support or later need help with the related service.
                </p>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)", marginBottom: 18 }}>
                  <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Tracking code</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--ink-1)" }}>{trackingCode}</div>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/track" className="btn btn-primary">Track Request</Link>
                  <button className="btn btn-secondary" onClick={() => { setSelectedResource(null); setTrackingCode(""); }}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitLead}>
                <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full name *</label>
                    <input className="input" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Interested service category</label>
                    <select className="input" value={leadForm.interestedCategory} onChange={(e) => setLeadForm({ ...leadForm, interestedCategory: e.target.value })}>
                      <option value="">Select category…</option>
                      {categories.filter((category) => category !== "all").map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email</label>
                    <input className="input" type="email" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} placeholder="you@email.com" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone / WhatsApp</label>
                    <input className="input" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} placeholder="98XXXXXXXX" />
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--ink-4)", lineHeight: 1.7, marginBottom: 16 }}>
                  At least one contact method is required so follow-up help can happen if you need assistance with the related service.
                </p>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  disabled={leadLoading || !leadForm.name.trim() || (!leadForm.email.trim() && !leadForm.phone.trim())}
                >
                  {leadLoading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Unlocking…</> : <><Download size={15} /> Continue to resource</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ResourceCard({
  resource,
  onDownload,
  featured = false,
}: {
  resource: Resource;
  onDownload: (resource: Resource) => void;
  featured?: boolean;
}) {
  const color = TYPE_COLORS[resource.type];

  return (
    <div className="card" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 99, fontSize: 12, fontWeight: 700, color }}>
          {TYPE_ICONS[resource.type]} {TYPE_LABELS[resource.type]}
        </div>
        {resource.downloadCount > 0 && (
          <span style={{ fontSize: 11, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}>
            <Download size={11} /> {resource.downloadCount}
          </span>
        )}
      </div>

      <h3 style={{ fontWeight: 700, fontSize: featured ? 17 : 15, color: "var(--ink-1)", marginBottom: 8, lineHeight: 1.3 }}>{resource.title}</h3>
      <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 14, flex: 1 }}>{resource.description}</p>

      {resource.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
          {resource.tags.slice(0, 4).map((tag) => (
            <span key={tag} style={{ padding: "2px 8px", background: "var(--bg-muted)", borderRadius: 99, fontSize: 11, color: "var(--ink-4)" }}>{tag}</span>
          ))}
        </div>
      )}

      <button
        onClick={() => onDownload(resource)}
        style={{
          width: "100%",
          padding: "10px 16px",
          background: `${color}10`,
          border: `1.5px solid ${color}30`,
          borderRadius: 10,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: 14,
          fontWeight: 700,
          color,
          transition: "all 0.15s",
          fontFamily: "var(--font-sans)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${color}18`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = `${color}10`; }}
      >
        {resource.type === "link" || resource.type === "video" ? <><ExternalLink size={15} /> Open Resource</> : <><Download size={15} /> Download Free</>}
      </button>
    </div>
  );
}
