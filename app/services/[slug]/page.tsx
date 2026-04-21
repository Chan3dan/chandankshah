import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models";
import { getSetting } from "@/lib/settings";
import Navbar from "@/components/public/NavbarServer";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, ChevronRight, MessageCircle, Clock3, Sparkles, ShieldCheck, FileText, TimerReset } from "lucide-react";
import { ServiceSchema, BreadcrumbSchema, FAQSchema } from "@/components/public/StructuredData";
import type { ProfileSettings, SocialSettings } from "@/lib/settings";
import ServiceIcon from "@/components/public/ServiceIcon";
import { BUSINESS_DISCLAIMER, OFFICIAL_PROCESS_NOTICE, buildServiceFaqs, isOfficialProcessService, PROCESS_STEPS } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const svc = await Service.findOne({ slug }).lean() as any;
  return { title: svc?.title || "Service", description: svc?.description };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const [svc, relatedRaw, profile, social, meta] = await Promise.all([
    Service.findOne({ slug, isActive: true }).lean() as Promise<any>,
    Service.find({ isActive: true, slug: { $ne: slug } }).limit(3).lean(),
    getSetting<ProfileSettings>("profile"),
    getSetting<SocialSettings>("social"),
    getSetting("meta") as Promise<{ siteName: string; siteTagline: string; siteUrl?: string }>,
  ]);
  if (!svc) notFound();
  const related = JSON.parse(JSON.stringify(relatedRaw));
  const BASE = (meta as any).siteUrl || "https://chandankshah.com.np";
  const faqs = buildServiceFaqs(svc);
  const showOfficialNotice = isOfficialProcessService(svc);
  const whatsappText = encodeURIComponent(
    `Hello Chandan, I need help with ${svc.title}. Please share the process, required documents, timeline, and pricing details.`,
  );
  const docsWhatsappText = encodeURIComponent(
    `Hello Chandan, before booking ${svc.title}, please tell me what documents or details I should prepare.`,
  );

  return (
    <>
      <ServiceSchema name={svc.title} description={svc.description} url={`${BASE}/services/${svc.slug}`} price={svc.price} provider={profile.fullName} />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: "Home", url: BASE },
        { name: "Services", url: `${BASE}/services` },
        { name: svc.title, url: `${BASE}/services/${svc.slug}` },
      ]} />
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        {/* Hero */}
        <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "clamp(40px,8vw,52px) 0 clamp(36px,7vw,44px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: svc.color, opacity: 0.6 }} />
          <div className="site-container">
            <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 20, flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }} className="hover-blue">Home</Link>
              <ChevronRight size={13} />
              <Link href="/services" style={{ color: "var(--ink-4)", textDecoration: "none" }} className="hover-blue">Services</Link>
              <ChevronRight size={13} />
              <span style={{ color: "var(--ink-2)" }}>{svc.title}</span>
            </nav>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "start" }} className="sidebar-layout">
              <div>
                {svc.badge && <span className="badge badge-blue" style={{ marginBottom: 14 }}>{svc.badge}</span>}
                <div style={{ width: 68, height: 68, borderRadius: 18, background: `${svc.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <ServiceIcon service={svc} size={30} color={svc.color} />
                </div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "var(--ink-1)", marginBottom: 12, lineHeight: 1.1 }}>{svc.title}</h1>
                <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "var(--ink-3)", lineHeight: 1.75, maxWidth: 560 }}>{svc.description}</p>
              </div>

              {/* Booking card */}
              <div className="card-static" style={{ padding: 28 }}>
                <div style={{ fontSize: 22, fontFamily: "var(--font-serif)", fontWeight: 400, color: svc.color, marginBottom: 4 }}>{svc.price}</div>
                {svc.priceNote && <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 18 }}>{svc.priceNote}</p>}
                <Link href={`/book?service=${encodeURIComponent(svc.title)}`} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 10, display: "flex" }}>
                  Book This Service <ArrowRight size={15} />
                </Link>
                <a href={`https://wa.me/${profile.whatsapp}?text=${whatsappText}`}
                  target="_blank" rel="noopener noreferrer"
                  className="success-panel"
                  style={{ justifyContent: "center", gap: 8, padding: "10px" }}>
                  <MessageCircle size={15} /> WhatsApp for Quick Help
                </a>
                <a
                  href={`https://wa.me/${profile.whatsapp}?text=${docsWhatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
                >
                  Ask What Documents Are Needed
                </a>
                <div style={{ marginTop: 14, padding: "10px", background: "var(--bg-subtle)", borderRadius: 8, fontSize: 12, color: "var(--ink-4)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Clock3 size={13} />
                  {profile.availability}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "clamp(40px,8vw,56px) 0" }}>
          <div className="site-container">
            <div className="sidebar-layout">
              <div>
                {svc.longDescription && (
                  <div style={{ marginBottom: 36 }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 14 }}>About This Service</h2>
                    <div className="prose">{svc.longDescription}</div>
                  </div>
                )}
                {svc.features?.length > 0 && (
                  <div>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>What&apos;s Included</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                      {svc.features.map((f: string) => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, color: "var(--ink-2)" }}>
                          <CheckCircle2 size={15} color="var(--green)" style={{ flexShrink: 0 }} /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 36 }}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>What to expect</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                    <div className="card-static" style={{ padding: 18 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--blue-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <FileText size={18} color="var(--blue)" />
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>Requirements reviewed first</h3>
                      <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>
                        You will know what details or documents are needed before the work moves forward.
                      </p>
                    </div>
                    <div className="card-static" style={{ padding: 18 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <TimerReset size={18} color="var(--green)" />
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>Timeline explained clearly</h3>
                      <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>
                        Turnaround depends on completeness, urgency, and third-party systems, but you get a practical estimate early.
                      </p>
                    </div>
                    <div className="card-static" style={{ padding: 18 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <ShieldCheck size={18} color="var(--amber)" />
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>Independent professional help</h3>
                      <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>
                        Assistance is provided independently with care and accuracy, while final approvals remain with the relevant institution.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>How this service works</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                    {PROCESS_STEPS.map((step, index) => (
                      <div key={step.title} className="card-static" style={{ padding: 18 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg-subtle)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontWeight: 800, color: svc.color }}>
                          {index + 1}
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{step.title}</h3>
                        <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>Frequently asked questions</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {faqs.map((faq) => (
                      <div key={faq.question} className="card-static" style={{ padding: "18px 20px" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{faq.question}</h3>
                        <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="card-static" style={{ padding: 22 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Details</h3>
                  {[
                    ["Category", svc.category],
                    ["Starting Price", svc.price],
                    ["Available", profile.availability],
                    ["Location", profile.location],
                  ].map(([label, value]) => (
                    <div key={label} className="detail-list-row" style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 13, color: "var(--ink-4)" }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{value}</span>
                    </div>
                  ))}
                </div>

                {related.length > 0 && (
                  <div className="card-static" style={{ padding: 22 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Other Services</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {related.map((r: any) => (
                        <Link key={r._id} href={`/services/${r.slug}`}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--bg-subtle)", borderRadius: 10, textDecoration: "none" }}
                          className="hover-bg">
                          <ServiceIcon service={r} size={18} color={r.color} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{r.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-static" style={{ padding: 22, background: "var(--blue-bg)", borderColor: "var(--blue-border)" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--blue)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={15} />
                    Ready to get started?
                  </p>
                  <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 14, lineHeight: 1.6 }}>
                    Book instantly, ask for required documents, or send a prefilled WhatsApp message for this exact service.
                  </p>
                  <Link href={`/book?service=${encodeURIComponent(svc.title)}`} className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                    Book Now <ArrowRight size={13} />
                  </Link>
                  <a
                    href={`https://wa.me/${profile.whatsapp}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ width: "100%", justifyContent: "center", display: "flex", marginTop: 10 }}
                  >
                    WhatsApp About {svc.title}
                  </a>
                  <a
                    href={`mailto:${profile.email}?subject=${encodeURIComponent(`Need help with ${svc.title}`)}&body=${encodeURIComponent(`Hello Chandan,\n\nI need help with ${svc.title}. Please share the process, required documents, timeline, and pricing details.\n`)}`}
                    className="btn btn-ghost btn-sm"
                    style={{ width: "100%", justifyContent: "center", display: "flex", marginTop: 10 }}
                  >
                    Email for a Written Quote
                  </a>
                </div>

                <div className="card-static" style={{ padding: 22 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Important notice</h3>
                  <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>
                    {BUSINESS_DISCLAIMER}
                  </p>
                  {showOfficialNotice && (
                    <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, margin: "10px 0 0" }}>
                      {OFFICIAL_PROCESS_NOTICE}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer profile={{ phone: profile.phone, email: profile.email, whatsapp: profile.whatsapp, location: profile.location }} social={social} meta={meta} />
    </>
  );
}
