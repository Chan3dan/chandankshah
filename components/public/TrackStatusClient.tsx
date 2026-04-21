"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock3, FileSearch, Loader2, ShieldCheck } from "lucide-react";
import { PROGRESS_STATUS_META, type ProgressStatus } from "@/lib/message-tracking";
import { BUSINESS_DISCLAIMER } from "@/lib/site-content";

type TrackResult = {
  trackingCode: string;
  requestType: string;
  service?: string;
  subject?: string;
  progressStatus: ProgressStatus;
  progressLabel: string;
  progressDescription: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
};

const PROGRESS_ORDER: ProgressStatus[] = ["received", "in_review", "documents_needed", "in_progress", "completed"];

export default function TrackStatusClient() {
  const [trackingCode, setTrackingCode] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);

  const activeIndex = result ? PROGRESS_ORDER.indexOf(result.progressStatus) : -1;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingCode,
          contactValue,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to check request status.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unable to check request status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: 64 }}>
      <section style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "clamp(40px,8vw,56px) 0 clamp(36px,7vw,48px)" }}>
        <div className="site-container">
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-4)", marginBottom: 16 }}>
            <Link href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={13} />
            <span style={{ color: "var(--ink-2)" }}>Track Request</span>
          </nav>
          <p className="section-eyebrow">Request Tracking</p>
          <h1 className="section-title" style={{ marginBottom: 12 }}>Track your booking or enquiry</h1>
          <p className="section-desc" style={{ maxWidth: 720 }}>
            Enter the tracking code you received after contacting the site, plus the same phone number or email used in the request.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="content-sidebar">
            <div className="card-static" style={{ padding: "clamp(22px,4vw,34px)" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, marginBottom: 18 }}>Check status</h2>
              <form onSubmit={submit}>
                <div className="form-group">
                  <label className="form-label">Tracking code</label>
                  <input
                    className="input"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                    placeholder="CKS-XXXXXXXX"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone number or email</label>
                  <input
                    className="input"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder="98XXXXXXXX or you@example.com"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
                  {loading ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Checking…</> : <><FileSearch size={15} /> Check status</>}
                </button>
              </form>
              {error && (
                <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontSize: 13.5, lineHeight: 1.6 }}>
                  {error}
                </div>
              )}
            </div>

            <div className="card-list">
              <div className="card-static" style={{ padding: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>How to use this page</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    "Use the tracking code shown after your booking or enquiry was submitted.",
                    "Enter the same phone number or email used in that request.",
                    "If documents are needed, contact support with the same tracking code for faster help.",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-static" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <ShieldCheck size={15} color="var(--blue)" />
                  <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Important note</h3>
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>{BUSINESS_DISCLAIMER}</p>
              </div>
            </div>
          </div>

          {result && (
            <div className="card-static" style={{ marginTop: 24, padding: "clamp(22px,4vw,34px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-4)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>
                    Tracking code
                  </p>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, margin: 0 }}>{result.trackingCode}</h2>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-4)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>
                    Current status
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "var(--blue-bg)", borderRadius: 999, color: "var(--blue)", fontWeight: 700 }}>
                    <Clock3 size={15} />
                    {result.progressLabel}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 22 }}>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 4 }}>Request type</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)", textTransform: "capitalize" }}>{result.requestType}</div>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 4 }}>Service</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}>{result.service || result.subject || "General enquiry"}</div>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 4 }}>Last updated</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}>{new Date(result.updatedAt).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Progress</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                  {PROGRESS_ORDER.map((status, index) => {
                    const meta = PROGRESS_STATUS_META[status];
                    const complete = activeIndex >= index || result.progressStatus === "cancelled" && status === "received";
                    const current = result.progressStatus === status;
                    return (
                      <div
                        key={status}
                        style={{
                          padding: "16px 16px 14px",
                          borderRadius: 12,
                          border: `1px solid ${current ? "rgba(37,99,235,0.25)" : "var(--border)"}`,
                          background: current ? "rgba(37,99,235,0.05)" : complete ? "rgba(22,163,74,0.04)" : "var(--surface)",
                        }}
                      >
                        <div style={{ fontSize: 12, color: current ? "var(--blue)" : "var(--ink-4)", fontWeight: 700, marginBottom: 6 }}>
                          Step {index + 1}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)", marginBottom: 6 }}>{meta.label}</div>
                        <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.6 }}>{meta.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(result.adminNotes || result.progressDescription) && (
                <div style={{ padding: "16px 18px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-1)", marginBottom: 6 }}>Latest update</div>
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
                    {result.adminNotes || result.progressDescription}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
