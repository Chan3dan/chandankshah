"use client";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const FOOTER_LINKS = {
  Services: [
    { label: "Loksewa Form Filling", href: "/services/loksewa-form-filling" },
    { label: "DEMAT & Mero Share", href: "/services/demat-mero-share" },
    { label: "Documentation", href: "/services/documentation" },
    { label: "Academic Projects", href: "/services/academic-projects" },
    { label: "Web Development", href: "/services/web-development" },
    { label: "All Services", href: "/services" },
  ],
  Explore: [
    { label: "Portfolio", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Free Resources", href: "/resources" },
    { label: "Book a Service", href: "/book" },
    { label: "Track Request", href: "/track" },
    { label: "About Me", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Products: [
    { label: "Niyukta ↗", href: "https://niyukta.com", external: true },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};

interface FooterProps {
  profile?: { phone?: string; email?: string; whatsapp?: string; location?: string };
  social?: { facebook?: string; instagram?: string; github?: string; linkedin?: string };
  meta?: { siteName?: string; siteTagline?: string };
}

export default function Footer({ profile, social, meta }: FooterProps) {
  return (
    <footer style={{ background: "var(--footer-bg)", color: "var(--footer-ink)", marginTop: 0 }}>
      <div className="site-container" style={{ padding: "clamp(48px,8vw,64px) 0 clamp(32px,6vw,48px)" }}>
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand-block">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div className="brand-mark" style={{ width: 34, height: 34, borderRadius: 9 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>C</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--footer-ink)" }}>{meta?.siteName || "Chandan Shah"}</div>
                <div style={{ fontSize: 11, color: "var(--footer-ink-soft)" }}>{meta?.siteTagline || "Digital Services"}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--footer-ink-muted)", marginBottom: 20 }}>
              Independent digital support for documentation, forms, DEMAT setup, and online services in Nepal.
            </p>
            <div style={{ padding: "12px 14px", border: "1px solid var(--footer-border)", borderRadius: 12, background: "var(--footer-surface)", marginBottom: 20 }}>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--footer-ink-soft)", margin: 0 }}>
                Professional assistance for digital processes, documentation, and online support.
                Official approval and final decisions remain with the relevant institution or authority.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} style={{ fontSize: 13, color: "var(--footer-ink-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }} className="link-hover-white">
                  <Phone size={14} />
                  {profile.phone}
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} style={{ fontSize: 13, color: "var(--footer-ink-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }} className="link-hover-white" aria-label="Send an email">
                  <Mail size={14} />
                  Send an email
                </a>
              )}
              {profile?.location && (
                <span style={{ fontSize: 13, color: "var(--footer-ink-muted)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={14} />
                  {profile.location}
                </span>
              )}
            </div>
            {/* Social */}
            <div className="footer-social-row">
              {[
                { url: social?.facebook, label: "f", color: "#3b82f6" },
                { url: social?.instagram, label: "ig", color: "#ec4899" },
                { url: social?.github, label: "gh", color: "#94a3b8" },
                { url: social?.linkedin, label: "in", color: "#0ea5e9" },
              ].filter(s => s.url).map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  style={{ width: 34, height: 34, borderRadius: 9, background: "var(--footer-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--footer-ink)", textDecoration: "none", transition: "background 0.15s, transform 0.15s", border: `1px solid ${s.color}25` }}
                  className="hover-lift">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="footer-link-column">
              <h4 style={{ color: "var(--footer-ink)", fontWeight: 700, fontSize: 13, letterSpacing: 0.5, marginBottom: 16 }}>{heading}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l) => (
                  ("external" in l && l.external) ? (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 13.5, color: "var(--footer-ink-muted)", textDecoration: "none", transition: "color 0.15s" }} className="link-hover-white">
                      {l.label}
                    </a>
                  ) : (
                    <Link key={l.href} href={l.href}
                      style={{ fontSize: 13.5, color: "var(--footer-ink-muted)", textDecoration: "none", transition: "color 0.15s" }} className="link-hover-white">
                      {l.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid var(--footer-border)", padding: "18px 0" }}>
        <div className="site-container footer-bottom">
          <p className="footer-bottom-copy" style={{ fontSize: 13, color: "var(--footer-ink-soft)" }}>© {new Date().getFullYear()} Chandan Kumar Shah. All rights reserved.</p>
          <p className="footer-bottom-copy" style={{ fontSize: 13, color: "var(--footer-ink-soft)", maxWidth: 680 }}>
            This is an independent digital services business and is not affiliated with, endorsed by, or acting on behalf of any government office or public authority.
          </p>
          <p className="footer-bottom-copy" style={{ fontSize: 13, color: "var(--footer-ink-soft)" }}>Built with Next.js · Hosted on Vercel</p>
        </div>
      </div>

      {/* WhatsApp float */}
      {profile?.whatsapp && (
        <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer"
          className="wa-btn wa-floating"
          style={{ width: 52, height: 52, borderRadius: "50%", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", textDecoration: "none" }}
          aria-label="Chat on WhatsApp">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </footer>
  );
}
