"use client";
import { useState, useEffect } from "react";
import { Save, User, Home, Globe, DollarSign, Sparkles, Settings, ChevronDown, ChevronUp, Plus, Trash2, Layout } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [open, setOpen] = useState<string>("hero");

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); const r = await fetch("/api/settings"); setSettings(await r.json()); setLoading(false); };

  const save = async (key: string, value: any) => {
    setSaving(key);
    const r = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
    if (r.ok) toast.success(`${key} settings saved!`); else toast.error("Failed to save");
    setSaving(null);
  };

  const set = (key: string, path: string, value: any) => {
    setSettings(prev => {
      const section = { ...(prev[key] || {}) };
      const parts = path.split(".");
      if (parts.length === 1) { section[path] = value; }
      else if (parts.length === 2) { section[parts[0]] = { ...(section[parts[0]] || {}), [parts[1]]: value }; }
      return { ...prev, [key]: section };
    });
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>Loading settings…</div>;

  const sections = [
    { key: "hero", label: "Hero Section", icon: <Home size={15} /> },
    { key: "profile", label: "Profile & About", icon: <User size={15} /> },
    { key: "niyukta", label: "Niyukta Promo", icon: <Sparkles size={15} /> },
    { key: "nav", label: "Navigation & Links", icon: <Layout size={15} /> },
    { key: "pricing", label: "Pricing Plans", icon: <DollarSign size={15} /> },
    { key: "social", label: "Social Media", icon: <Globe size={15} /> },
    { key: "meta", label: "Site Meta & SEO", icon: <Settings size={15} /> },
  ];

  const S = (key: string) => settings[key] || {};

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 4 }}>Settings</h1>
        <p style={{ color: "var(--ink-4)", fontSize: 13 }}>All changes are saved to MongoDB and reflected live on the site.</p>
      </div>

      {sections.map(sec => (
        <div key={sec.key} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, marginBottom: 12, overflow: "hidden" }}>
          {/* Accordion header */}
          <button onClick={() => setOpen(open === sec.key ? "" : sec.key)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--blue)" }}>{sec.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>{sec.label}</span>
            </div>
            {open === sec.key ? <ChevronUp size={16} color="var(--ink-4)" /> : <ChevronDown size={16} color="var(--ink-4)" />}
          </button>

          {open === sec.key && (
            <div style={{ borderTop: "1px solid var(--border)", padding: 24 }}>
              {/* ── HERO ── */}
              {sec.key === "hero" && (
                <div>
                  <div className="admin-form-grid-2" style={{ marginBottom: 14 }}>
                    <div><label className="form-label">Your Name</label><input className="input" value={S("hero").name || ""} onChange={e => set("hero", "name", e.target.value)} /></div>
                    <div><label className="form-label">Avatar Letter</label><input className="input" value={S("hero").avatarLetter || ""} onChange={e => set("hero", "avatarLetter", e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Subtitle (above name)</label><input className="input" value={S("hero").subtitle || ""} onChange={e => set("hero", "subtitle", e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Tagline (below name)</label><input className="input" value={S("hero").tagline || ""} onChange={e => set("hero", "tagline", e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Description Paragraph</label><textarea className="input" value={S("hero").description || ""} onChange={e => set("hero", "description", e.target.value)} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div><label className="form-label">Primary CTA Text</label><input className="input" value={S("hero").ctaPrimary || ""} onChange={e => set("hero", "ctaPrimary", e.target.value)} /></div>
                    <div><label className="form-label">Secondary CTA Text</label><input className="input" value={S("hero").ctaSecondary || ""} onChange={e => set("hero", "ctaSecondary", e.target.value)} /></div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Profile Badges</label>
                    {(S("hero").badges || []).map((b: string, i: number) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <input className="input" value={b} onChange={e => { const arr = [...(S("hero").badges || [])]; arr[i] = e.target.value; set("hero", "badges", arr); }} />
                        <button onClick={() => set("hero", "badges", (S("hero").badges || []).filter((_: string, j: number) => j !== i))} style={{ padding: "0 12px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <button onClick={() => set("hero", "badges", [...(S("hero").badges || []), "New Badge"])} className="btn btn-ghost btn-sm"><Plus size={13} /> Add Badge</button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stats</label>
                    <div className="admin-form-grid-2" style={{ gap: 8 }}>
                      {(S("hero").stats || []).map((s: any, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6 }}>
                          <input className="input" placeholder="Value" value={s.value} onChange={e => { const arr = [...(S("hero").stats || [])]; arr[i] = { ...s, value: e.target.value }; set("hero", "stats", arr); }} />
                          <input className="input" placeholder="Label" value={s.label} onChange={e => { const arr = [...(S("hero").stats || [])]; arr[i] = { ...s, label: e.target.value }; set("hero", "stats", arr); }} />
                          <button onClick={() => set("hero", "stats", (S("hero").stats || []).filter((_: any, j: number) => j !== i))} style={{ padding: "0 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => set("hero", "stats", [...(S("hero").stats || []), { value: "0", label: "New Stat" }])} className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}><Plus size={13} /> Add Stat</button>
                  </div>
                </div>
              )}

              {/* ── PROFILE ── */}
              {sec.key === "profile" && (
                <div>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="input" value={S("profile").fullName || ""} onChange={e => set("profile", "fullName", e.target.value)} /></div>
                  <div className="admin-form-grid-2" style={{ marginBottom: 14 }}>
                    <div><label className="form-label">Phone</label><input className="input" value={S("profile").phone || ""} onChange={e => set("profile", "phone", e.target.value)} /></div>
                    <div><label className="form-label">Email</label><input className="input" value={S("profile").email || ""} onChange={e => set("profile", "email", e.target.value)} /></div>
                    <div><label className="form-label">WhatsApp (with country code)</label><input className="input" value={S("profile").whatsapp || ""} onChange={e => set("profile", "whatsapp", e.target.value)} placeholder="977980000000" /></div>
                    <div><label className="form-label">Location</label><input className="input" value={S("profile").location || ""} onChange={e => set("profile", "location", e.target.value)} /></div>
                    <div><label className="form-label">Availability</label><input className="input" value={S("profile").availability || ""} onChange={e => set("profile", "availability", e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Bio Paragraph 1</label><textarea className="input" value={S("profile").bio1 || ""} onChange={e => set("profile", "bio1", e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Bio Paragraph 2</label><textarea className="input" value={S("profile").bio2 || ""} onChange={e => set("profile", "bio2", e.target.value)} /></div>
                  <div className="form-group">
                    <label className="form-label">Skills</label>
                    {(S("profile").skills || []).map((sk: any, i: number) => (
                      <div key={i} className="admin-form-grid-4" style={{ gap: 8, marginBottom: 8 }}>
                        <input className="input" placeholder="Skill name" value={sk.name} onChange={e => { const arr = [...(S("profile").skills || [])]; arr[i] = { ...sk, name: e.target.value }; set("profile", "skills", arr); }} />
                        <input className="input" placeholder="Category" value={sk.category} onChange={e => { const arr = [...(S("profile").skills || [])]; arr[i] = { ...sk, category: e.target.value }; set("profile", "skills", arr); }} />
                        <input type="number" className="input" min={0} max={100} value={sk.level} onChange={e => { const arr = [...(S("profile").skills || [])]; arr[i] = { ...sk, level: +e.target.value }; set("profile", "skills", arr); }} />
                        <button onClick={() => set("profile", "skills", (S("profile").skills || []).filter((_: any, j: number) => j !== i))} style={{ padding: "0 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <button onClick={() => set("profile", "skills", [...(S("profile").skills || []), { name: "", category: "General", level: 80 }])} className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}><Plus size={13} /> Add Skill</button>
                  </div>
                </div>
              )}

              {/* ── NIYUKTA ── */}
              {sec.key === "niyukta" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, padding: "12px 16px", background: "var(--bg-subtle)", borderRadius: 10 }}>
                    <input type="checkbox" id="show-niyukta" checked={S("niyukta").show ?? true} onChange={e => set("niyukta", "show", e.target.checked)} style={{ width: 16, height: 16 }} />
                    <label htmlFor="show-niyukta" style={{ fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Show Niyukta promo section on homepage</label>
                  </div>
                  <div className="admin-form-grid-2" style={{ marginBottom: 14 }}>
                    <div><label className="form-label">Badge Text</label><input className="input" value={S("niyukta").subheadline || ""} onChange={e => set("niyukta", "subheadline", e.target.value)} /></div>
                    <div><label className="form-label">Website URL</label><input className="input" value={S("niyukta").url || ""} onChange={e => set("niyukta", "url", e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Main Headline</label><input className="input" value={S("niyukta").headline || ""} onChange={e => set("niyukta", "headline", e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="input" value={S("niyukta").description || ""} onChange={e => set("niyukta", "description", e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">CTA Button Text</label><input className="input" value={S("niyukta").cta || ""} onChange={e => set("niyukta", "cta", e.target.value)} /></div>
                  <div className="form-group">
                    <label className="form-label">Feature List</label>
                    {(S("niyukta").features || []).map((f: string, i: number) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <input className="input" value={f} onChange={e => { const arr = [...(S("niyukta").features || [])]; arr[i] = e.target.value; set("niyukta", "features", arr); }} />
                        <button onClick={() => set("niyukta", "features", (S("niyukta").features || []).filter((_: string, j: number) => j !== i))} style={{ padding: "0 12px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <button onClick={() => set("niyukta", "features", [...(S("niyukta").features || []), "New Feature"])} className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}><Plus size={13} /> Add Feature</button>
                  </div>
                </div>
              )}

              {/* ── NAV ── */}
              {sec.key === "nav" && (
                <div>
                  <div className="admin-form-grid-2" style={{ marginBottom: 14 }}>
                    <div>
                      <label className="form-label">Niyukta URL</label>
                      <input className="input" value={S("nav").niyuktaUrl || ""} onChange={e => set("nav", "niyuktaUrl", e.target.value)} placeholder="https://niyukta.com" />
                      <p className="form-hint">The URL for the Niyukta link in the navbar.</p>
                    </div>
                    <div>
                      <label className="form-label">Niyukta Label</label>
                      <input className="input" value={S("nav").niyuktaLabel || ""} onChange={e => set("nav", "niyuktaLabel", e.target.value)} placeholder="Niyukta" />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "12px 16px", background: "var(--bg-subtle)", borderRadius: 10 }}>
                    <input type="checkbox" id="show-niyukta-nav" checked={S("nav").showNiyuktaInNav !== false} onChange={e => set("nav", "showNiyuktaInNav", e.target.checked)} style={{ width: 16, height: 16 }} />
                    <label htmlFor="show-niyukta-nav" style={{ fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Show Niyukta link in navbar</label>
                  </div>

                  <div>
                    <label className="form-label">Extra Nav Links (optional custom links)</label>
                    {(S("nav").extraLinks || []).map((l: { label: string; href: string; external: boolean }, i: number) => (
                      <div key={i} className="admin-form-grid-4" style={{ gap: 10, marginBottom: 10, alignItems: "center" }}>
                        <input className="input" placeholder="Label" value={l.label} onChange={e => { const arr = [...(S("nav").extraLinks || [])]; arr[i] = { ...l, label: e.target.value }; set("nav", "extraLinks", arr); }} />
                        <input className="input" placeholder="URL (https://...)" value={l.href} onChange={e => { const arr = [...(S("nav").extraLinks || [])]; arr[i] = { ...l, href: e.target.value }; set("nav", "extraLinks", arr); }} />
                        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                          <input type="checkbox" checked={l.external} onChange={e => { const arr = [...(S("nav").extraLinks || [])]; arr[i] = { ...l, external: e.target.checked }; set("nav", "extraLinks", arr); }} style={{ width: 14, height: 14 }} /> External ↗
                        </label>
                        <button onClick={() => set("nav", "extraLinks", (S("nav").extraLinks || []).filter((_: unknown, j: number) => j !== i))} style={{ padding: "0 12px", height: 42, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => set("nav", "extraLinks", [...(S("nav").extraLinks || []), { label: "", href: "", external: false }])} className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>
                      <Plus size={13} /> Add Custom Link
                    </button>
                  </div>
                </div>
              )}

              {/* ── SOCIAL ── */}
              {sec.key === "social" && (
                <div className="admin-form-grid-2">
                  {["facebook", "instagram", "github", "linkedin", "twitter", "youtube"].map(platform => (
                    <div key={platform}>
                      <label className="form-label" style={{ textTransform: "capitalize" }}>{platform}</label>
                      <input className="input" value={S("social")[platform] || ""} onChange={e => set("social", platform, e.target.value)} placeholder={`https://${platform}.com/...`} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── PRICING ── */}
              {sec.key === "pricing" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, padding: "12px 16px", background: "var(--bg-subtle)", borderRadius: 10 }}>
                    <input type="checkbox" id="show-pricing" checked={S("pricing").show ?? true} onChange={e => set("pricing", "show", e.target.checked)} style={{ width: 16, height: 16 }} />
                    <label htmlFor="show-pricing" style={{ fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Show pricing section on homepage</label>
                  </div>
                  <div className="admin-form-grid-2" style={{ marginBottom: 20 }}>
                    <div><label className="form-label">Section Heading</label><input className="input" value={S("pricing").heading || ""} onChange={e => set("pricing", "heading", e.target.value)} /></div>
                    <div><label className="form-label">Sub-heading</label><input className="input" value={S("pricing").subheading || ""} onChange={e => set("pricing", "subheading", e.target.value)} /></div>
                  </div>
                  {(S("pricing").plans || []).map((plan: any, i: number) => (
                    <div key={i} style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 14 }}>
                      <div className="admin-form-grid-4" style={{ marginBottom: 12 }}>
                        <div><label className="form-label">Plan Name</label><input className="input" value={plan.name} onChange={e => { const arr = [...(S("pricing").plans)]; arr[i] = { ...plan, name: e.target.value }; set("pricing", "plans", arr); }} /></div>
                        <div><label className="form-label">Price (NPR)</label><input className="input" value={plan.price} onChange={e => { const arr = [...(S("pricing").plans)]; arr[i] = { ...plan, price: e.target.value }; set("pricing", "plans", arr); }} /></div>
                        <div><label className="form-label">Period</label><input className="input" value={plan.period} onChange={e => { const arr = [...(S("pricing").plans)]; arr[i] = { ...plan, period: e.target.value }; set("pricing", "plans", arr); }} /></div>
                        <div><label className="form-label">CTA Text</label><input className="input" value={plan.cta} onChange={e => { const arr = [...(S("pricing").plans)]; arr[i] = { ...plan, cta: e.target.value }; set("pricing", "plans", arr); }} /></div>
                      </div>
                      <div className="form-group"><label className="form-label">Description</label><input className="input" value={plan.description} onChange={e => { const arr = [...(S("pricing").plans)]; arr[i] = { ...plan, description: e.target.value }; set("pricing", "plans", arr); }} /></div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="checkbox" checked={plan.highlighted} onChange={e => { const arr = [...(S("pricing").plans)]; arr[i] = { ...plan, highlighted: e.target.checked }; set("pricing", "plans", arr); }} style={{ width: 15, height: 15 }} />
                        <label style={{ fontSize: 13, fontWeight: 600 }}>Highlighted (most popular style)</label>
                        <button onClick={() => set("pricing", "plans", (S("pricing").plans).filter((_: any, j: number) => j !== i))} style={{ marginLeft: "auto", padding: "5px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)", fontSize: 12 }}>Remove Plan</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => set("pricing", "plans", [...(S("pricing").plans || []), { name: "New Plan", price: "0", period: "per service", description: "", features: [], highlighted: false, cta: "Get Started" }])} className="btn btn-ghost btn-sm"><Plus size={13} /> Add Plan</button>
                </div>
              )}

              {/* ── META ── */}
              {sec.key === "meta" && (
                <div>
                  <div className="admin-form-grid-2" style={{ marginBottom: 14 }}>
                    <div><label className="form-label">Site Name</label><input className="input" value={S("meta").siteName || ""} onChange={e => set("meta", "siteName", e.target.value)} /></div>
                    <div><label className="form-label">Site Tagline</label><input className="input" value={S("meta").siteTagline || ""} onChange={e => set("meta", "siteTagline", e.target.value)} /></div>
                    <div><label className="form-label">Site URL</label><input className="input" value={S("meta").siteUrl || ""} onChange={e => set("meta", "siteUrl", e.target.value)} /></div>
                    <div><label className="form-label">Google Analytics ID</label><input className="input" value={S("meta").googleAnalytics || ""} onChange={e => set("meta", "googleAnalytics", e.target.value)} placeholder="G-XXXXXXXXXX" /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Meta Description (SEO)</label><textarea className="input" value={S("meta").siteDescription || ""} onChange={e => set("meta", "siteDescription", e.target.value)} /></div>
                </div>
              )}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <button onClick={() => save(sec.key, S(sec.key))} className="btn btn-primary" disabled={saving === sec.key}>
                  <Save size={15} /> {saving === sec.key ? "Saving…" : `Save ${sec.label}`}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
