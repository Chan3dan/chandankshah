"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, Sparkles } from "lucide-react";
import ServiceIcon from "@/components/public/ServiceIcon";
import { SERVICES_PAGE_FAQS } from "@/lib/site-content";

type ServiceItem = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: string;
  badge?: string;
  color: string;
  features?: string[];
};

const BUNDLES = [
  {
    title: "Loksewa Form + Document Review",
    description: "For applicants who want both submission support and a second review of attached details before moving ahead.",
    features: ["Form filling support", "Document completeness review", "Submission readiness check"],
  },
  {
    title: "DEMAT + Mero Share + IPO Setup",
    description: "A smoother path for clients who want their account setup handled end-to-end instead of piecing each step together.",
    features: ["DEMAT guidance", "Mero Share onboarding", "IPO-ready support"],
  },
  {
    title: "Portfolio Website + Domain + Deployment",
    description: "Ideal for students, freelancers, and professionals who want a live personal site with less technical overhead.",
    features: ["Portfolio build", "Domain connection help", "Production deployment support"],
  },
];

export default function ServicesDirectoryClient({ services }: { services: ServiceItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(services.map((service) => service.category)))],
    [services],
  );

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory = activeCategory === "All" || service.category === activeCategory;
      const haystack = [
        service.title,
        service.description,
        service.category,
        ...(service.features || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, services]);

  const groupedServices = useMemo(() => {
    return categories
      .filter((category) => category !== "All")
      .map((category) => ({
        category,
        items: filteredServices.filter((service) => service.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, filteredServices]);

  return (
    <section className="section">
      <div className="site-container">
        <div className="card-static" style={{ padding: "clamp(20px,4vw,28px)", marginBottom: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, alignItems: "end" }}>
            <div>
              <p className="section-eyebrow" style={{ marginBottom: 10 }}>Find Services Faster</p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem,3vw,2.1rem)", fontWeight: 400, color: "var(--ink-1)", margin: 0 }}>
                Search by service, category, or task
              </h2>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border)", borderRadius: 14, padding: "0 14px", minHeight: 48, background: "var(--surface)" }}>
              <Search size={16} color="var(--ink-4)" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Loksewa, DEMAT, website, documents..."
                style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: 16, color: "var(--ink-1)", fontFamily: "var(--font-sans)" }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            {categories.map((category) => {
              const active = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  style={{
                    minHeight: 40,
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1px solid ${active ? "var(--blue)" : "var(--border)"}`,
                    background: active ? "var(--blue)" : "var(--surface)",
                    color: active ? "#fff" : "var(--ink-2)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-4)" }}>
            <p>No services listed yet.</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="card-static" style={{ padding: "clamp(26px,5vw,36px)", textAlign: "center", marginBottom: 32 }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", marginBottom: 10 }}>No services match this search</h3>
            <p style={{ margin: "0 auto 18px", maxWidth: 620, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7 }}>
              Try a broader keyword, switch category, or contact directly if you need something not shown here.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-secondary" onClick={() => { setQuery(""); setActiveCategory("All"); }}>
                Clear Filters
              </button>
              <Link href="/contact" className="btn btn-primary">
                Contact Me <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {groupedServices.map(({ category, items }) => (
              <div key={category} style={{ marginBottom: 56 }}>
                <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 20 }}>{category}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}>
                  {items.map((service) => (
                    <Link key={service._id} href={`/services/${service.slug}`} style={{ textDecoration: "none" }}>
                      <div className="card" style={{ padding: 26, height: "100%", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: service.color, opacity: 0.55, borderRadius: "20px 20px 0 0" }} />
                        {service.badge && (
                          <span style={{ position: "absolute", top: 14, right: 14, fontSize: 11, fontWeight: 700, padding: "2px 9px", background: `${service.color}18`, color: service.color, borderRadius: 99 }}>
                            {service.badge}
                          </span>
                        )}
                        <div style={{ width: 48, height: 48, borderRadius: 13, background: `${service.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                          <ServiceIcon service={service} color={service.color} />
                        </div>
                        <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--ink-1)", marginBottom: 6 }}>{service.title}</h3>
                        <p style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.65, marginBottom: 14 }}>{service.description}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                          {(service.features || []).slice(0, 3).map((feature) => (
                            <span key={feature} style={{ padding: "2px 8px", background: "var(--bg-muted)", borderRadius: 99, fontSize: 11, color: "var(--ink-4)" }}>
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: service.color }}>{service.price}</span>
                          <span style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                            Details <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <p className="section-eyebrow">Smart Bundles</p>
            <h2 className="section-title" style={{ marginBottom: 10 }}>Popular combinations that save time</h2>
            <p className="section-desc" style={{ maxWidth: 720 }}>
              Bundled help works well when one task naturally leads into another. These are positioned for faster completion and fewer back-and-forth steps.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {BUNDLES.map((bundle, index) => (
              <div key={bundle.title} className="card-static" style={{ padding: "24px 22px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--blue-bg)", border: "1px solid var(--blue-border)", borderRadius: 999, color: "var(--blue)", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>
                  <Sparkles size={12} />
                  Bundle {index + 1}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{bundle.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, marginBottom: 16 }}>{bundle.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                  {bundle.features.map((feature) => (
                    <div key={feature} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "var(--ink-2)" }}>
                      <CheckCircle2 size={15} color="var(--green)" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link href="/book" className="btn btn-secondary" style={{ justifyContent: "center", width: "100%" }}>
                  Ask About This Bundle <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 20, padding: "clamp(24px,5vw,36px) clamp(20px,5vw,40px)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24, marginTop: 24 }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--ink-1)", marginBottom: 4 }}>Don&apos;t see what you need?</h3>
            <p style={{ color: "var(--ink-3)", fontSize: 14 }}>Reach out — I handle many more services.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Contact Me <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ marginTop: 40 }}>
          <div style={{ marginBottom: 18 }}>
            <p className="section-eyebrow">FAQ</p>
            <h2 className="section-title" style={{ marginBottom: 10 }}>Common questions before booking</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SERVICES_PAGE_FAQS.map((faq) => (
              <div key={faq.question} className="card-static" style={{ padding: "18px 20px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-1)", marginBottom: 8 }}>{faq.question}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
