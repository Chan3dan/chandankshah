"use client";
import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ChevronRight, CheckCircle2, ShieldCheck, FileText, TimerReset } from "lucide-react";
import toast from "react-hot-toast";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import { BUSINESS_DISCLAIMER, CONTACT_EXPECTATIONS, CONTACT_FAQS } from "@/lib/site-content";

interface Props {
  profile: ProfileSettings;
  social: SocialSettings;
  services: { _id: string; title: string }[];
}

export default function ContactClient({ profile, social, services }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, requestType: "contact" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed");
      setTrackingCode(data.trackingCode || "");
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
      <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "clamp(40px,8vw,56px) 0 clamp(36px,7vw,48px)" }}>
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
          <div className="content-sidebar">
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
                className="success-panel"
              >
                <div className="success-panel__icon">
                  <MessageCircle size={22} color="#fff" />
                </div>
                <div>
                  <div className="success-panel__title">Chat on WhatsApp</div>
                  <div className="success-panel__copy">Get a quick response</div>
                </div>
              </a>

              {/* Social links */}
              <div className="page-chip-row">
                {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none" }}>Facebook</a>}
                {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none" }}>Instagram</a>}
                {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none" }}>GitHub</a>}
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none" }}>LinkedIn</a>}
              </div>

              <div className="card-static" style={{ padding: 20 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400, marginBottom: 14 }}>Before you send your message</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {CONTACT_EXPECTATIONS.map((item, index) => {
                    const Icon = index === 0 ? FileText : index === 1 ? TimerReset : ShieldCheck;
                    return (
                      <div key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg-subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={15} color="var(--blue)" />
                        </div>
                        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7 }}>{item}</p>
                      </div>
                    );
                  })}
                </div>
                <p style={{ fontSize: 12.5, color: "var(--ink-4)", lineHeight: 1.7, margin: "14px 0 0" }}>
                  {BUSINESS_DISCLAIMER}
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="card-static" style={{ padding: "clamp(20px,4vw,36px)" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <CheckCircle2 size={56} color="var(--green)" style={{ margin: "0 auto 16px" }} />
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Message Sent!</h2>
                  <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>Thanks {form.name}! I&apos;ll get back to you within a few hours.</p>
                  {trackingCode && (
                    <div style={{ margin: "0 auto 20px", maxWidth: 360, padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
                      <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Tracking code</div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--ink-1)" }}>{trackingCode}</div>
                      <p style={{ fontSize: 12.5, color: "var(--ink-4)", margin: "8px 0 0" }}>
                        Use this on the track request page if you want to check progress later.
                      </p>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <Link href="/track" className="btn btn-primary">Track Request</Link>
                  </div>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", service: "", subject: "", message: "" }); }} className="btn btn-secondary">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Send a Message</h2>
                  <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
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
                  <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
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
                  <div className="info-card-grid" style={{ marginTop: 18 }}>
                    {services.slice(0, 3).map((service) => (
                      <a
                        key={service._id}
                        href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Hello Chandan, I need help with ${service.title}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ minHeight: 44, padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-subtle)", color: "var(--ink-2)", textDecoration: "none", fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}
                      >
                        Ask about {service.title}
                      </a>
                    ))}
                  </div>
                </form>
              )}
            </div>
          </div>

          <div style={{ marginTop: 36 }}>
            <div style={{ marginBottom: 18 }}>
              <p className="section-eyebrow">FAQ</p>
              <h2 className="section-title" style={{ marginBottom: 10 }}>Questions clients usually ask first</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CONTACT_FAQS.map((faq) => (
                <div key={faq.question} className="card-static" style={{ padding: "18px 20px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{faq.question}</h3>
                  <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
