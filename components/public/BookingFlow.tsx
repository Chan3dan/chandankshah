"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Send, Loader2, MessageCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import TurnstileWidget from "./TurnstileWidget";
import type { ProfileSettings } from "@/lib/settings";
import ServiceIcon from "@/components/public/ServiceIcon";
import { BUSINESS_DISCLAIMER, PROCESS_STEPS } from "@/lib/site-content";

interface Service { _id: string; title: string; slug?: string; icon: string; description: string; price: string; color: string; category: string; }

interface Props {
  services: Service[];
  preselectedService?: string;
  profile: ProfileSettings;
}

const STEPS = ["Choose Service", "Your Details", "Review & Send"];

export default function BookingFlow({ services, preselectedService, profile }: Props) {
  const [step, setStep] = useState(preselectedService ? 1 : 0);
  const [selected, setSelected] = useState<Service | null>(
    services.find(s => s.slug === preselectedService || s.title === preselectedService) || null
  );
  const [form, setForm] = useState({
    name: "", email: "", phone: "", message: "",
    preferredDate: "", urgency: "normal",
  });
  const [cfToken, setCfToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const canProceed = () => {
    if (step === 0) return !!selected;
    if (step === 1) return form.name.trim().length > 1 && form.phone.trim().length > 7;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: selected?.title || "",
          subject: `Booking Request — ${selected?.title}`,
          message: `${form.message}\n\nPreferred Date: ${form.preferredDate || "Flexible"}\nUrgency: ${form.urgency}`,
          cfToken,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setDone(true);
      toast.success("Booking request sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <BookingSuccess name={form.name} service={selected?.title || ""} profile={profile} />;

  return (
    <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--bg-subtle)" }}>
      {/* Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "40px 0 32px" }}>
        <div className="site-container" style={{ maxWidth: 740 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 20 }}>
            <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={13} /><Link href="/services" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Services</Link>
            <ChevronRight size={13} /><span>Book</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 400, marginBottom: 8 }}>Book a Service</h1>
          <p style={{ color: "var(--ink-3)", fontSize: 15 }}>Complete the steps below — I'll get back to you within 2–4 hours.</p>

          {/* Step indicators */}
          <div style={{ display: "flex", gap: 0, marginTop: 28 }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, transition: "all 0.2s",
                    background: i < step ? "var(--green)" : i === step ? "var(--blue)" : "var(--bg-muted)",
                    color: i <= step ? "#fff" : "var(--ink-4)",
                  }}>
                    {i < step ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: i === step ? 700 : 500, color: i === step ? "var(--ink-1)" : "var(--ink-4)", whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < step ? "var(--green)" : "var(--bg-muted)", margin: "0 12px", minWidth: 24, transition: "background 0.3s" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="site-container" style={{ maxWidth: 740, padding: "40px 24px" }}>
        <div style={{ marginBottom: 24, padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
          <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "var(--ink-3)", margin: 0 }}>
            {BUSINESS_DISCLAIMER}
          </p>
        </div>

        {/* STEP 0 — Choose Service */}
        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Which service do you need?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {services.map(svc => (
                <button key={svc._id} onClick={() => setSelected(svc)} style={{
                  padding: "18px 20px", textAlign: "left", cursor: "pointer",
                  background: selected?._id === svc._id ? `${svc.color}10` : "var(--surface)",
                  border: `2px solid ${selected?._id === svc._id ? svc.color : "var(--border)"}`,
                  borderRadius: 14, transition: "all 0.15s", fontFamily: "var(--font-sans)",
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 10, background: `${svc.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ServiceIcon service={svc} color={svc.color} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)", marginBottom: 4 }}>{svc.title}</div>
                  <div style={{ fontSize: 13, color: svc.color, fontWeight: 700 }}>{svc.price}</div>
                  {selected?._id === svc._id && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4, color: svc.color, fontSize: 12, fontWeight: 700 }}>
                      <CheckCircle2 size={13} /> Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Your Details */}
        {step === 1 && selected && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: `${selected.color}10`, border: `1px solid ${selected.color}30`, borderRadius: 12, marginBottom: 28 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${selected.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ServiceIcon service={selected} color={selected.color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>{selected.title}</div>
                <div style={{ fontSize: 13, color: selected.color, fontWeight: 700 }}>{selected.price}</div>
              </div>
              <button onClick={() => setStep(0)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--ink-4)" }}>Change</button>
            </div>

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Your contact details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input className="input" placeholder="98XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input type="email" className="input" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label className="form-label">Preferred Date (optional)</label>
                  <input type="date" className="input" value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label className="form-label">Urgency</label>
                  <select className="input" value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })}>
                    <option value="normal">Normal (2–3 days)</option>
                    <option value="urgent">Urgent (same/next day)</option>
                    <option value="flexible">Flexible (within a week)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Additional Details</label>
                <textarea className="input" placeholder="Describe your specific requirements, documents you have, or anything else I should know…" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ minHeight: 100 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                {PROCESS_STEPS.map((stepItem, index) => (
                  <div key={stepItem.title} style={{ padding: "14px 14px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "var(--blue)", marginBottom: 10 }}>
                      {index + 1}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink-1)", marginBottom: 6 }}>{stepItem.title}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-4)", lineHeight: 1.6 }}>{stepItem.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Review */}
        {step === 2 && selected && (
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Review your booking</h2>
            <div className="card-static" style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${selected.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ServiceIcon service={selected} size={24} color={selected.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.title}</div>
                  <div style={{ fontSize: 14, color: selected.color, fontWeight: 700 }}>{selected.price}</div>
                </div>
              </div>
              {[
                ["Name", form.name],
                ["Phone", form.phone],
                ["Email", form.email || "—"],
                ["Preferred Date", form.preferredDate || "Flexible"],
                ["Urgency", { normal: "Normal (2–3 days)", urgent: "Urgent (same/next day)", flexible: "Flexible (within a week)" }[form.urgency] || form.urgency],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: 16, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 13, color: "var(--ink-4)", width: 120, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)" }}>{value}</span>
                </div>
              ))}
              {form.message && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--bg-subtle)", borderRadius: 10 }}>
                  <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 4 }}>Message</p>
                  <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>{form.message}</p>
                </div>
              )}
            </div>

            {/* Turnstile spam protection */}
            <TurnstileWidget onVerify={setCfToken} />

            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 10, fontSize: 13, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Mail size={15} color="var(--blue)" />
              I&apos;ll reply to <strong style={{ color: "var(--ink-1)" }}>{form.phone}</strong>{form.email ? ` / ${form.email}` : ""} within 2–4 hours.
            </div>
            <div style={{ marginTop: 12, padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink-1)", margin: "0 0 8px" }}>After you submit</p>
              <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>
                Your request is reviewed, any missing requirements are confirmed, and you receive the next step by WhatsApp, phone, or email. Complex requests may need a short follow-up before work begins.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn btn-secondary">
              <ArrowLeft size={15} /> Back
            </button>
          ) : (
            <Link href="/services" className="btn btn-secondary">
              <ArrowLeft size={15} /> All Services
            </Link>
          )}

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn btn-primary" disabled={!canProceed()}
              style={{ opacity: canProceed() ? 1 : 0.5 }}>
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={submit} className="btn btn-primary"
              disabled={submitting || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !cfToken)}
              style={{ opacity: submitting ? 0.7 : 1 }}>
              {submitting ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending…</> : <><Send size={15} /> Send Booking Request</>}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function BookingSuccess({ name, service, profile }: { name: string; service: string; profile: ProfileSettings }) {
  return (
    <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 520, width: "100%", padding: "0 20px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--green-bg)", border: "1px solid rgba(22,163,74,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle2 size={36} color="var(--green)" />
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 400, marginBottom: 12 }}>Booking Request Sent!</h1>
        <p style={{ color: "var(--ink-3)", fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
          Thanks <strong>{name}</strong>! Your request for <strong>{service}</strong> has been received. I'll get back to you within 2–4 hours.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "#25d366", color: "#fff", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>
            <MessageCircle size={16} />
            WhatsApp Me
          </a>
          <Link href="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
