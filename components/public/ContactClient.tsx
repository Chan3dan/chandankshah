"use client";
import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ChevronRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";

interface Props {
  profile: ProfileSettings;
  social: SocialSettings;
  services: { _id: string; title: string }[];
}

export default function ContactClient({ profile, social, services }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      toast.success("Message sent! I'll reply soon.");
    } catch {
      toast.error("Something went wrong. Please try WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: <Phone size={18} />, label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, color: "#2563eb" },
    { icon: <Mail size={18} />, label: "Email", value: profile.email, href: `mailto:${profile.email}`, color: "#7c3aed" },
    { icon: <MapPin size={18} />, label: "Location", value: profile.location, href: undefined, color: "#059669" },
    { icon: <Clock size={18} />, label: "Availability", value: profile.availability, href: undefined, color: "#d97706" },
  ];

  return (
    <main style={{ paddingTop: 64 }}>
      {/* Header */}
      <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "56px 0 48px" }}>
        <div className="site-container">
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={13} />
            <span>Contact</span>
          </nav>
          <p className="section-eyebrow">Get In Touch</p>
          <h1 className="section-title" style={{ marginBottom: 12 }}>Contact Me</h1>
          <p className="section-desc">Have a question or need a service? Send me a message and I&apos;ll get back to you within a few hours.</p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 48, alignItems: "start" }}>
            {/* Left — contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {contactItems.map(item => (
                <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-xs)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${item.color}12`, border: `1px solid ${item.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--ink-4)", marginBottom: 2 }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)", textDecoration: "none" }}>{item.value}</a>
                    ) : (
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{item.value}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp */}
              <a href={`https://wa.me/${profile.whatsapp}?text=Hello%20Chandan%2C%20I%20need%20help%20with...`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, textDecoration: "none", transition: "background 0.15s" }}
                className="hover-bg-subtle"
                
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageCircle size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#15803d" }}>Chat on WhatsApp</div>
                  <div style={{ fontSize: 12, color: "#16a34a" }}>Get a quick response</div>
                </div>
              </a>

              {/* Social links */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none" }}>Facebook</a>}
                {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none" }}>Instagram</a>}
                {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none" }}>GitHub</a>}
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none" }}>LinkedIn</a>}
              </div>
            </div>

            {/* Right — Form */}
            <div className="card-static" style={{ padding: 36 }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <CheckCircle2 size={56} color="var(--green)" style={{ margin: "0 auto 16px" }} />
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Message Sent!</h2>
                  <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>Thanks {form.name}! I&apos;ll get back to you within a few hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", service: "", subject: "", message: "" }); }} className="btn btn-secondary">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Send a Message</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Full Name *</label>
                      <input required className="input" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Phone Number *</label>
                      <input required className="input" placeholder="98XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="input" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Service Needed *</label>
                      <select required className="input" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                        <option value="">Select a service…</option>
                        {services.map(s => <option key={s._id} value={s.title}>{s.title}</option>)}
                        <option value="Other">Other / Not Listed</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Subject</label>
                      <input className="input" placeholder="Brief subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea required className="input" placeholder="Describe your requirements in detail…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ minHeight: 120 }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "13px" }} disabled={loading}>
                    {loading ? (
                      <><span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Sending…</>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                  <p style={{ fontSize: 12, color: "var(--ink-4)", textAlign: "center", marginTop: 12 }}>
                    I typically reply within 2–4 hours during business hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
