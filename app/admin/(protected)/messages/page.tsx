"use client";
import { useState, useEffect } from "react";
import { Trash2, Mail, MailOpen, Archive, Phone, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

interface Message { _id: string; name: string; email: string; phone: string; service: string; subject: string; message: string; status: "new" | "read" | "replied" | "archived"; createdAt: string; }

const STATUS_COLORS: Record<string, string> = { new: "badge-blue", read: "badge-neutral", replied: "badge-green", archived: "badge-neutral" };

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); const r = await fetch("/api/messages"); setMessages(await r.json()); setLoading(false); };

  const setStatus = async (id: string, status: string) => {
    const r = await fetch(`/api/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (r.ok) { toast.success(`Marked as ${status}`); load(); } else toast.error("Failed");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const r = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Deleted"); load(); } else toast.error("Failed");
  };

  const filtered = filter === "all" ? messages : messages.filter(m => m.status === filter);
  const counts = { all: messages.length, new: messages.filter(m => m.status === "new").length, read: messages.filter(m => m.status === "read").length, replied: messages.filter(m => m.status === "replied").length };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 4 }}>Messages</h1>
        <p style={{ color: "var(--ink-4)", fontSize: 13 }}>{counts.new > 0 ? `${counts.new} new message${counts.new > 1 ? "s" : ""}` : "All caught up!"}</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "new", "read", "replied", "archived"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1.5px solid", transition: "all 0.15s",
              background: filter === f ? "var(--blue)" : "var(--surface)",
              borderColor: filter === f ? "var(--blue)" : "var(--border)",
              color: filter === f ? "#fff" : "var(--ink-2)" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f !== "archived" ? `(${counts[f as keyof typeof counts] ?? 0})` : ""}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>Loading…</div>
          : filtered.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>No messages.</div>
          : filtered.map(msg => (
            <div key={msg._id} style={{ background: msg.status === "new" ? "rgba(37,99,235,0.02)" : "var(--surface)", border: `1px solid ${msg.status === "new" ? "rgba(37,99,235,0.25)" : "var(--border)"}`, borderRadius: 14, padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: msg.status === "new" ? "var(--blue-bg)" : "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: msg.status === "new" ? "var(--blue)" : "var(--ink-3)", fontSize: 15, flexShrink: 0 }}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{msg.name}</span>
                      <span className={`badge ${STATUS_COLORS[msg.status]}`}>{msg.status}</span>
                      {msg.service && <span style={{ fontSize: 12, color: "var(--ink-4)" }}>· {msg.service}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
                      <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}><Mail size={11} /> {msg.email}</span>
                      {msg.phone && <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}><Phone size={11} /> {msg.phone}</span>}
                      <span style={{ fontSize: 12, color: "var(--ink-4)" }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button onClick={() => setExpanded(expanded === msg._id ? null : msg._id)} className="btn btn-ghost btn-sm">
                    {expanded === msg._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded === msg._id ? "Collapse" : "Read"}
                  </button>
                  {msg.status !== "replied" && <button onClick={() => setStatus(msg._id, "replied")} className="btn btn-success btn-sm">✓ Replied</button>}
                  {msg.status === "new" && <button onClick={() => setStatus(msg._id, "read")} className="btn btn-secondary btn-sm"><MailOpen size={13} /></button>}
                  <button onClick={() => setStatus(msg._id, "archived")} style={{ padding: "6px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", color: "var(--ink-4)" }}><Archive size={13} /></button>
                  <button onClick={() => handleDelete(msg._id, )} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                </div>
              </div>

              {expanded === msg._id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  {msg.subject && <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 }}>Subject: {msg.subject}</p>}
                  <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.75, background: "var(--bg-subtle)", padding: "14px 16px", borderRadius: 10 }}>{msg.message}</p>
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your enquiry"}`} className="btn btn-primary btn-sm">
                      <Mail size={13} /> Reply via Email
                    </a>
                    {msg.phone && <a href={`tel:${msg.phone}`} className="btn btn-secondary btn-sm"><Phone size={13} /> Call</a>}
                    {msg.phone && <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#16a34a", textDecoration: "none" }}>WhatsApp</a>}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
