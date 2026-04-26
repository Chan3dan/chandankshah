"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ExternalLink, Star, Download, MapPin, Sparkles, ChevronRight, MessageCircle, ShieldCheck, Search, Orbit } from "lucide-react";
import type { HeroSettings, ProfileSettings, NiyuktaSettings, PricingSettings } from "@/lib/settings";
import ServiceIcon, { cleanBadgeLabel, profileHighlights } from "@/components/public/ServiceIcon";
import { BUSINESS_DISCLAIMER, OFFICIAL_PROCESS_NOTICE, PROCESS_STEPS, SERVICE_PROMISES } from "@/lib/site-content";
import bannerImage from "@/logo/banner.png";
import logoImage from "@/logo/logo.png";

interface Props {
  hero: HeroSettings;
  profile: ProfileSettings;
  niyukta: NiyuktaSettings;
  pricing: PricingSettings;
  services: any[];
  projects: any[];
  testimonials: any[];
}

export default function HomeClient({ hero, profile, niyukta, pricing, services, projects, testimonials }: Props) {
  return (
    <main className="home-main" style={{ paddingTop: 64 }}>
      <HeroSection hero={hero} profile={profile} />
      <QuickServiceFinder services={services} profile={profile} />
      <TrustSection />
      <ConversionSection />
      <ServicesSection services={services} />
      <ProcessSection />
      <NiyuktaSection niyukta={niyukta} />
      <ProjectsSection projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      {pricing.show && <PricingSection pricing={pricing} />}
      <CTASection profile={profile} />
    </main>
  );
}

const HERO_PILLARS = [
  { label: "What I do", text: "Documentation, forms, DEMAT help, and web services" },
  { label: "Who I help", text: "Individuals, students, job applicants, and small businesses" },
  { label: "Where I work", text: "Nepal-based remote support with direct follow-up" },
  { label: "Why trust me", text: "Clear communication, careful handling, and transparent steps" },
  { label: "How to contact", text: "WhatsApp, phone, email, or the booking form" },
];

const BOOKING_GUIDE = [
  {
    title: "Documents ready",
    text: "Keep citizenship, academic papers, screenshots, or account details ready before the first message when relevant.",
  },
  {
    title: "Clear deadline",
    text: "Mention your submission date, exam deadline, or target launch date early so the work can be prioritized properly.",
  },
  {
    title: "Preferred follow-up",
    text: "Say whether you prefer WhatsApp, call, or email so updates stay consistent and easy to track.",
  },
];

const POPULAR_BUNDLES = [
  "Loksewa Form + Document Review",
  "DEMAT + Mero Share + IPO Setup",
  "Portfolio Website + Domain + Deployment",
];

function QuickServiceFinder({ services, profile }: { services: any[]; profile: ProfileSettings }) {
  const [selectedSlug, setSelectedSlug] = useState<string>(services[0]?.slug || "");
  const selectedService = useMemo(
    () => services.find((service) => service.slug === selectedSlug) ?? services[0],
    [selectedSlug, services],
  );

  if (!selectedService) return null;

  const whatsappText = encodeURIComponent(
    `Hello Chandan, I need help with ${selectedService.title}. Please guide me with the next steps and required documents.`,
  );

  return (
    <section style={{ padding: "clamp(26px,6vw,44px) 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-subtle)" }}>
      <div className="site-container">
        <div className="card-static home-section-shell" style={{ padding: "clamp(20px,4vw,30px)" }}>
          <div className="home-finder-grid">
            <div>
              <span className="home-kicker" style={{ marginBottom: 12 }}>
                <Orbit size={13} />
                Quick Service Finder
              </span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.15, marginBottom: 10 }}>
                Reach the right service in one click
              </h2>
              <p style={{ fontSize: 14.5, color: "var(--ink-3)", lineHeight: 1.75, marginBottom: 18, maxWidth: 620 }}>
                Choose what you need and jump straight to the service page, booking form, or a prefilled WhatsApp message without searching manually.
              </p>

              <div style={{ position: "relative", marginBottom: 18 }}>
                <Search size={16} color="var(--ink-4)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <select
                  className="input home-finder-select"
                  value={selectedSlug}
                  onChange={(event) => setSelectedSlug(event.target.value)}
                  style={{ paddingLeft: 40, paddingRight: 18 }}
                >
                  {services.map((service) => (
                    <option key={service._id} value={service.slug}>
                      {service.title} · {service.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="home-finder-actions">
                <Link href={`/services/${selectedService.slug}`} className="btn btn-primary">
                  Open Service <ArrowRight size={14} />
                </Link>
                <Link href={`/book?service=${encodeURIComponent(selectedService.title)}`} className="btn btn-secondary">
                  Book This Service
                </Link>
                <a href={`https://wa.me/${profile.whatsapp}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  WhatsApp About This
                </a>
              </div>
            </div>

            <div className="card-subtle" style={{ padding: "18px 18px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: `${selectedService.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ServiceIcon service={selectedService} color={selectedService.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>{selectedService.title}</div>
                  <div style={{ fontSize: 13, color: selectedService.color, fontWeight: 700 }}>{selectedService.price}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 14 }}>{selectedService.description}</p>
              <div className="home-finder-list">
                {(selectedService.features || []).slice(0, 3).map((feature: string) => (
                  <div key={feature} className="home-finder-chip">
                    <CheckCircle2 size={14} color="var(--green)" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section style={{ padding: "clamp(28px,6vw,44px) 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
      <div className="site-container">
        <div style={{ marginBottom: 20 }}>
          <span className="home-kicker">
            <ShieldCheck size={13} />
            Why clients feel safe working with me
          </span>
        </div>
        <div className="home-trust-grid">
          {SERVICE_PROMISES.map((item) => (
            <div key={item.title} className="card-static" style={{ padding: "20px 20px 18px" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--blue-bg)", border: "1px solid var(--blue-border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <ShieldCheck size={18} color="var(--blue)" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: "clamp(14px,2vw,15px)", color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConversionSection() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="home-conversion-grid">
          <div className="card-static home-section-shell" style={{ padding: "clamp(22px,4vw,32px)" }}>
            <span className="home-kicker" style={{ marginBottom: 12 }}>Before You Book</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.7rem,3vw,2.3rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.2, marginBottom: 14 }}>
              What helps a request move faster
            </h2>
            <div className="info-card-grid" style={{ marginBottom: 18 }}>
              {BOOKING_GUIDE.map((item) => (
                <div key={item.title} style={{ padding: "16px 16px 14px", borderRadius: 14, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)" }}>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
                Most enquiries receive a first response in a few hours. Complex requests usually need a short review before a final timeline is confirmed.
              </p>
            </div>
          </div>

          <div className="card-static home-section-shell" style={{ padding: "clamp(22px,4vw,32px)" }}>
            <span className="home-kicker" style={{ marginBottom: 12 }}>Popular Bundles</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem,2.8vw,2.1rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.2, marginBottom: 14 }}>
              Combinations clients ask for most
            </h2>
            <div className="home-list-stack" style={{ marginBottom: 18 }}>
              {POPULAR_BUNDLES.map((bundle) => (
                <div key={bundle} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)", fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>
                  <CheckCircle2 size={15} color="var(--green)" />
                  {bundle}
                </div>
              ))}
            </div>
            <div className="stack-actions">
              <Link href="/services" className="btn btn-primary">
                Explore Services <ArrowRight size={14} />
              </Link>
              <Link href="/book" className="btn btn-secondary">
                Book a Bundle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HERO ── */
function HeroSection({ hero, profile }: { hero: HeroSettings; profile: ProfileSettings }) {
  return (
    <section className="home-hero-section" style={{ position: "relative", background: "var(--bg-base)" }}>
      <div className="site-container" style={{ position: "relative", padding: "clamp(20px,4vw,28px) 0 clamp(40px,8vw,64px)" }}>
        <div className="home-channel-shell">
          <div className="home-channel-banner">
            <Image
              src={bannerImage}
              alt={`${hero.name} banner`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="home-channel-head">
            <div className="home-channel-avatar">
              <Image
                src={logoImage}
                alt={`${hero.name} logo`}
                fill
                sizes="(max-width: 768px) 104px, 168px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="home-channel-copy">
              <div className="hero-badges-row" style={{ gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "var(--green-bg)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 99, fontSize: 12, fontWeight: 600, color: "var(--green)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
                  Available for Work
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 12, fontWeight: 500, color: "var(--ink-3)" }}>
                  <MapPin size={11} /> {profile.location}
                </span>
              </div>

              <div>
                <h1 className="home-hero-title" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem,5vw,4.1rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1.02, letterSpacing: "-0.03em", margin: "0 0 10px" }}>
                  {hero.name}
                </h1>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1rem,2.2vw,1.45rem)", fontWeight: 400, fontStyle: "italic", color: "var(--blue)", margin: "0 0 10px" }}>
                  {hero.tagline}
                </h2>
                <p style={{ fontSize: 14, color: "var(--ink-4)", margin: 0 }}>
                  {hero.subtitle}
                </p>
              </div>

              <p className="home-hero-description" style={{ fontSize: "clamp(14px,2vw,16px)", color: "var(--ink-3)", lineHeight: 1.8, margin: 0 }}>
                {hero.description}
              </p>

              <div className="hero-badges-row" style={{ gap: 8 }}>
                {hero.badges.map((badge, index) => (
                  <span key={index} style={{ padding: "6px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 13, fontWeight: 500, color: "var(--ink-2)", boxShadow: "var(--shadow-xs)" }}>
                    {cleanBadgeLabel(badge)}
                  </span>
                ))}
              </div>

              <div className="stack-actions">
                <Link href="/services" className="btn btn-primary btn-lg">{hero.ctaPrimary} <ArrowRight size={16} /></Link>
                <Link href="/projects" className="btn btn-secondary btn-lg">{hero.ctaSecondary}</Link>
                <a href={hero.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
                  <Download size={15} /> Resume
                </a>
              </div>
            </div>
          </div>

          <div className="home-hero-frame">
            <div className="home-hero-copy">
              <div className="home-pillars-grid" style={{ marginBottom: 28 }}>
                {HERO_PILLARS.map((item) => (
                  <div key={item.label} className="home-pillar-card">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-4)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 5 }}>{item.label}</div>
                    <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                ))}
              </div>

              <div className="home-hero-note" style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)", marginBottom: 28 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
                  {OFFICIAL_PROCESS_NOTICE}
                </p>
              </div>

              <div className="home-hero-stats">
                {hero.stats.map((stat, index) => (
                  <div key={index} className="home-stat-card">
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,2.3rem)", fontWeight: 400, color: "var(--ink-1)", lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-4)", marginTop: 6, fontWeight: 600 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-profile-panel">
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {profileHighlights.map(({ label, icon: Icon }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--bg-subtle)", borderRadius: 10, fontSize: 13.5, color: "var(--ink-2)", border: "1px solid var(--border)" }}>
                    <Icon size={16} color="var(--blue)" />
                    {label}
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Book a Consultation</Link>
              <p style={{ fontSize: 12.5, color: "var(--ink-4)", margin: "12px 0 0" }}>{profile.availability}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES ── */
function ServicesSection({ services }: { services: any[] }) {
  return (
    <section className="section" style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="home-section-heading" style={{ marginBottom: 52 }}>
          <div>
            <p className="section-eyebrow">What I Offer</p>
            <h2 className="section-title">Services</h2>
            <p className="section-desc home-section-lead">Affordable, reliable help for government forms, finance, and digital needs.</p>
          </div>
          <Link href="/services" className="btn btn-secondary">View All <ChevronRight size={15} /></Link>
        </div>
        <div className="grid-auto">
          {services.map((svc) => (
            <Link key={svc._id} href={`/services/${svc.slug}`} style={{ textDecoration: "none" }}>
              <div className="card home-service-card" style={{ padding: 26, height: "100%", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: svc.color, opacity: 0.6, borderRadius: "20px 20px 0 0" }} />
                {svc.badge && (
                  <span style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 700, padding: "2px 9px", background: `${svc.color}18`, color: svc.color, borderRadius: 99 }}>{svc.badge}</span>
                )}
                <div style={{ width: 48, height: 48, borderRadius: 13, background: `${svc.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <ServiceIcon service={svc} color={svc.color} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-1)", marginBottom: 6 }}>{svc.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 14 }}>{svc.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {svc.features?.slice(0, 3).map((f: string) => (
                    <span key={f} style={{ padding: "2px 9px", background: "var(--bg-muted)", borderRadius: 99, fontSize: 11, color: "var(--ink-4)" }}>{f}</span>
                  ))}
                </div>
                <div className="home-service-card__footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: svc.color }}>{svc.price}</span>
                  <span style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>View <ArrowRight size={13} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="home-process-grid">
          <div>
            <p className="section-eyebrow">How It Works</p>
            <h2 className="section-title" style={{ marginBottom: 12 }}>A cleaner process from first message to final delivery</h2>
            <p className="section-desc home-section-lead" style={{ marginBottom: 18 }}>
              Designed for clients who want help without confusion, hidden steps, or unnecessary back and forth.
            </p>
            <div style={{ padding: "14px 16px", border: "1px solid var(--border)", borderRadius: 14, background: "var(--bg-subtle)" }}>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--ink-3)", margin: 0 }}>
                {BUSINESS_DISCLAIMER}
              </p>
            </div>
          </div>

          <div className="info-card-grid">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="card-static" style={{ padding: "22px 20px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-bg)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, marginBottom: 14 }}>
                  {index + 1}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: "clamp(14px,2vw,15px)", color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── NIYUKTA ── */
function NiyuktaSection({ niyukta }: { niyukta: NiyuktaSettings }) {
  if (!niyukta.show) return null;
  return (
    <section style={{ padding: "clamp(52px,9vw,80px) 0" }}>
      <div className="site-container">
        <div className="niyukta-gradient" style={{ borderRadius: 28, padding: "clamp(32px,5vw,60px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: "min(54vw, 320px)", height: "min(54vw, 320px)", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div className="home-niyukta-grid" style={{ position: "relative" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(255,255,255,0.12)", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#bfdbfe", marginBottom: 16 }}>
                <Sparkles size={12} /> {niyukta.subheadline}
              </div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
                {niyukta.headline}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>{niyukta.description}</p>
              <div className="home-niyukta-stats">
                {niyukta.stats?.map((s) => (
                  <div key={s.label} style={{ padding: "14px 0", minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <a href={niyukta.url} target="_blank" rel="noopener noreferrer" className="niyukta-cta light-on-dark-btn"
                style={{ color: "#1d4ed8", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                {niyukta.cta} <ExternalLink size={15} />
              </a>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 18, padding: "clamp(20px,4vw,28px)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 18 }}>Platform Features</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {niyukta.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.07)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
                    <span style={{ color: "#e0f2fe", fontSize: 13.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PROJECTS ── */
function ProjectsSection({ projects }: { projects: any[] }) {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="home-section-heading" style={{ marginBottom: 48 }}>
          <div>
            <p className="section-eyebrow">My Work</p>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-desc home-section-lead" style={{ marginTop: 10 }}>
              Selected work across digital services, portfolio websites, and product-focused builds.
            </p>
          </div>
          <Link href="/projects" className="btn btn-secondary">All Projects <ChevronRight size={15} /></Link>
        </div>
        <div className="grid-auto-lg">
          {projects.map((p) => (
            <Link key={p._id} href={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: 28, height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <span style={{ padding: "3px 10px", background: "var(--blue-bg)", color: "var(--blue)", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{p.category}</span>
                  {p.link && <ExternalLink size={15} color="var(--ink-4)" />}
                </div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400, color: "var(--ink-1)", marginBottom: 8, lineHeight: 1.2 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 16 }}>{p.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags?.map((t: string) => (
                    <span key={t} style={{ padding: "2px 9px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 12, color: "var(--ink-4)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
function TestimonialsSection({ testimonials }: { testimonials: any[] }) {
  return (
    <section className="section" style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p className="section-eyebrow" style={{ justifyContent: "center" }}>Social Proof</p>
          <h2 className="section-title">What Clients Say</h2>
        </div>
        <div className="grid-auto">
          {testimonials.map((t) => (
            <div key={t._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="var(--amber)" color="var(--amber)" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.75, marginBottom: 18, fontStyle: "italic" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.avatarColor || "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 15, flexShrink: 0 }}>
                  {t.avatarInitial}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{t.role}{t.company ? `, ${t.company}` : ""}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PRICING ── */
function PricingSection({ pricing }: { pricing: PricingSettings }) {
  return (
    <section id="pricing" className="section section-anchor" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p className="section-eyebrow" style={{ justifyContent: "center" }}>Pricing</p>
          <h2 className="section-title">{pricing.heading}</h2>
          <p className="section-desc" style={{ margin: "12px auto 0", textAlign: "center" }}>{pricing.subheading}</p>
        </div>
        <div className="grid-auto" style={{ alignItems: "stretch" }}>
          {pricing.plans.map((plan) => (
            <div key={plan.name} style={{
              background: plan.highlighted ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : "var(--surface)",
              border: plan.highlighted ? "none" : "1px solid var(--border)",
              borderRadius: 20, padding: "clamp(24px,4vw,32px)", position: "relative",
              transform: "none",
              boxShadow: plan.highlighted ? "0 8px 40px rgba(37,99,235,0.22)" : "var(--shadow-sm)",
              height: "100%",
            }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "var(--amber)", color: "#fff", padding: "4px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={12} />
                  {plan.badge}
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 13, color: plan.highlighted ? "rgba(255,255,255,0.7)" : "var(--blue)", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: plan.highlighted ? "rgba(255,255,255,0.5)" : "var(--ink-4)" }}>Rs.</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 44, color: plan.highlighted ? "#fff" : "var(--ink-1)", lineHeight: 1 }}>{plan.price}</span>
              </div>
              <div style={{ fontSize: 12, color: plan.highlighted ? "rgba(255,255,255,0.45)" : "var(--ink-4)", marginBottom: 6 }}>{plan.period}</div>
              <p style={{ fontSize: 13, color: plan.highlighted ? "rgba(255,255,255,0.65)" : "var(--ink-3)", marginBottom: 22 }}>{plan.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: plan.highlighted ? "rgba(255,255,255,0.85)" : "var(--ink-2)" }}>
                    <CheckCircle2 size={15} color={plan.highlighted ? "#34d399" : "var(--green)"} style={{ flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/contact" style={{
                display: "block", textAlign: "center", padding: "12px", borderRadius: 10,
                fontWeight: 700, fontSize: 14, textDecoration: "none",
                background: plan.highlighted ? "#fff" : "var(--blue-bg)",
                color: plan.highlighted ? "#1d4ed8" : "var(--blue)",
                border: plan.highlighted ? "none" : "1.5px solid var(--blue-border)",
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTASection({ profile }: { profile: ProfileSettings }) {
  return (
    <section style={{ padding: "clamp(52px,9vw,80px) 0", borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="dark-panel cta-split home-cta-panel" style={{ borderRadius: 28, padding: "clamp(32px,5vw,56px)", gap: 32 }}>
          <div>
            <h2 className="dark-panel-title" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 400, marginBottom: 8, lineHeight: 1.2 }}>
              Ready to get started?
            </h2>
            <p className="dark-panel-copy" style={{ fontSize: "clamp(14px,2vw,16px)", marginBottom: 10 }}>Get in touch — I&apos;ll reply within a few hours with the next steps, document needs, and expected timing.</p>
            <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "rgba(255,255,255,0.68)", margin: 0, maxWidth: 560 }}>
              Independent digital service support for Nepal-based documentation, online processes, finance setup, and web work. Not an official government body.
            </p>
          </div>
          <div className="stack-actions">
            <Link href="/contact" className="light-on-dark-btn">
              Contact Me <ArrowRight size={15} />
            </Link>
            <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="whatsapp-btn">
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
