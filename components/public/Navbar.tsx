"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import type { NavSettings } from "@/lib/settings";

const STATIC_NAV = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Services", href: "/services" },
      { label: "Loksewa Help", href: "/services/loksewa-form-filling" },
      { label: "DEMAT & Mero Share", href: "/services/demat-mero-share" },
      { label: "Documentation", href: "/services/documentation" },
      { label: "Academic Projects", href: "/services/academic-projects" },
      { label: "Web Development", href: "/services/web-development" },
    ],
  },
  { label: "Portfolio", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface Props {
  navSettings?: NavSettings;
}

export default function Navbar({ navSettings }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const niyuktaUrl = navSettings?.niyuktaUrl || "https://niyukta.com";
  const niyuktaLabel = navSettings?.niyuktaLabel || "Niyukta";
  const showNiyukta = navSettings?.showNiyuktaInNav !== false;
  const extraLinks = navSettings?.extraLinks || [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [pathname, mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.25s ease",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}>
        {scrolled && <div className="glass-header" style={{ position: "absolute", inset: 0, zIndex: -1 }} />}
        <div className="site-container" style={{ display: "flex", alignItems: "center", height: 64, gap: 24 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div className="brand-mark" style={{ width: 36, height: 36, borderRadius: 10 }}>
              <span style={{ fontWeight: 800, fontSize: 16, fontFamily: "var(--font-sans)", letterSpacing: "-1px" }}>C</span>
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", letterSpacing: "-0.03em" }}>Chandan Shah</div>
              <div style={{ fontSize: 10.5, color: "var(--ink-4)", fontWeight: 500 }}>Digital Services</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {STATIC_NAV.map((link) => (
              <div key={link.href} style={{ position: "relative" }}
                onMouseEnter={() => "children" in link && link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}>
                {"children" in link && link.children ? (
                  <button style={{
                    display: "flex", alignItems: "center", gap: 3, padding: "6px 10px",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
                    color: isActive(link.href) ? "var(--blue)" : "var(--ink-2)",
                    fontFamily: "var(--font-sans)", borderRadius: 8, transition: "color 0.15s",
                  }}>
                    {link.label} <ChevronDown size={13} style={{ opacity: 0.7 }} />
                  </button>
                ) : (
                  <Link href={link.href} style={{
                    display: "block", padding: "6px 10px", borderRadius: 8,
                    fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
                    color: isActive(link.href) ? "var(--blue)" : "var(--ink-2)",
                    textDecoration: "none", transition: "color 0.15s, background 0.15s",
                    background: isActive(link.href) ? "var(--blue-bg)" : "transparent",
                  }}>
                    {link.label}
                  </Link>
                )}

                {"children" in link && link.children && activeDropdown === link.label && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, marginTop: 8,
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 14, boxShadow: "var(--shadow-xl)",
                    padding: 6, minWidth: 200, zIndex: 200,
                    animation: "fadeUp 0.15s ease both",
                  }}>
                    {link.children.map((child) => (
                      <Link key={child.href} href={child.href} style={{
                        display: "block", padding: "9px 12px", borderRadius: 10,
                        fontSize: 13.5, fontWeight: 500, color: "var(--ink-2)",
                        textDecoration: "none", transition: "background 0.12s, color 0.12s",
                      }}
                        className="hover-bg hover-blue">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Extra links from admin */}
            {extraLinks.map(l => (
              l.external ? (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "var(--ink-2)", textDecoration: "none" }}>
                  {l.label} <ExternalLink size={12} />
                </a>
              ) : (
                <Link key={l.href} href={l.href}
                  style={{ display: "block", padding: "6px 10px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "var(--ink-2)", textDecoration: "none" }}>
                  {l.label}
                </Link>
              )
            ))}

            {/* Niyukta — from admin settings */}
            {showNiyukta && (
              <a href={niyuktaUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "var(--sky)", textDecoration: "none", transition: "background 0.15s" }}
                className="hover-bg">
                {niyuktaLabel} <ExternalLink size={12} />
              </a>
            )}
          </nav>

          {/* Right */}
          <div className="desktop-actions">
            <ThemeToggle compact />
            <Link href="/book" className="btn btn-secondary btn-sm">Book Service</Link>
            <Link href="/contact" className="btn btn-primary btn-sm">Contact</Link>
          </div>

          {/* Mobile toggle */}
          <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--ink-1)", borderRadius: 8 }}
            aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 90,
          background: "var(--bg-base)", paddingTop: 64, overflowY: "auto",
        }}>
          <div style={{ padding: "20px 20px" }}>
            {STATIC_NAV.map((link) => (
              <div key={link.href}>
                <Link href={link.href} style={{
                  display: "block", padding: "13px 4px",
                  fontSize: 18, fontFamily: "var(--font-serif)",
                  color: isActive(link.href) ? "var(--blue)" : "var(--ink-1)",
                  textDecoration: "none", borderBottom: "1px solid var(--border)",
                }}>
                  {link.label}
                </Link>
                {"children" in link && link.children && (
                  <div style={{ paddingLeft: 16 }}>
                    {link.children.slice(1).map(child => (
                      <Link key={child.href} href={child.href} style={{
                        display: "block", padding: "10px 4px", fontSize: 14,
                        color: "var(--ink-3)", textDecoration: "none",
                        borderBottom: "1px solid var(--border)",
                      }}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {showNiyukta && (
              <a href={niyuktaUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", padding: "13px 4px", fontSize: 18, fontFamily: "var(--font-serif)", color: "var(--sky)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>
                {niyuktaLabel} ↗
              </a>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <Link href="/book" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>Book Service</Link>
              <Link href="/contact" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>Contact</Link>
            </div>

            <div style={{ marginTop: 16 }}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
