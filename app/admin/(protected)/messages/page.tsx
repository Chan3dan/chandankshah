"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ChevronDown,
  ChevronUp,
  Mail,
  MailOpen,
  Phone,
  Search,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
  requestType: "contact" | "booking" | "resource";
  status: "new" | "read" | "replied" | "archived";
  progressStatus: "received" | "in_review" | "documents_needed" | "in_progress" | "completed" | "cancelled";
  trackingCode: string;
  adminNotes: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "badge-blue",
  read: "badge-neutral",
  replied: "badge-green",
  archived: "badge-neutral",
};

const PROGRESS_OPTIONS = [
  ["received", "Received"],
  ["in_review", "In Review"],
  ["documents_needed", "Documents Needed"],
  ["in_progress", "In Progress"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
];

const REQUEST_TYPE_OPTIONS = ["all", "contact", "booking", "resource"] as const;

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [requestTypeFilter, setRequestTypeFilter] = useState<string>("all");
  const [progressFilter, setProgressFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const response = await fetch("/api/messages");
    setMessages(await response.json());
    setLoading(false);
  };

  const setStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      toast.success(`Marked as ${status}`);
      load();
    } else {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const response = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (response.ok) {
      toast.success("Deleted");
      load();
    } else {
      toast.error("Failed");
    }
  };

  const updateProgress = async (id: string, progressStatus: string, adminNotes?: string) => {
    setSavingId(id);
    const body: Record<string, string> = { progressStatus };
    if (typeof adminNotes === "string") body.adminNotes = adminNotes;
    const response = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      toast.success("Progress updated");
      load();
    } else {
      toast.error("Failed");
    }
    setSavingId(null);
  };

  const counts = useMemo(() => ({
    all: messages.length,
    new: messages.filter((message) => message.status === "new").length,
    read: messages.filter((message) => message.status === "read").length,
    replied: messages.filter((message) => message.status === "replied").length,
    archived: messages.filter((message) => message.status === "archived").length,
    bookings: messages.filter((message) => message.requestType === "booking").length,
    resources: messages.filter((message) => message.requestType === "resource").length,
    documentsNeeded: messages.filter((message) => message.progressStatus === "documents_needed").length,
    inProgress: messages.filter((message) => message.progressStatus === "in_progress").length,
  }), [messages]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesStatus = statusFilter === "all" || message.status === statusFilter;
      const matchesRequestType = requestTypeFilter === "all" || message.requestType === requestTypeFilter;
      const matchesProgress = progressFilter === "all" || message.progressStatus === progressFilter;
      const matchesQuery =
        !normalizedQuery ||
        message.name.toLowerCase().includes(normalizedQuery) ||
        message.email.toLowerCase().includes(normalizedQuery) ||
        message.phone.toLowerCase().includes(normalizedQuery) ||
        message.trackingCode.toLowerCase().includes(normalizedQuery) ||
        message.service.toLowerCase().includes(normalizedQuery) ||
        message.subject.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesRequestType && matchesProgress && matchesQuery;
    });
  }, [messages, progressFilter, query, requestTypeFilter, statusFilter]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 4 }}>Messages</h1>
        <p style={{ color: "var(--ink-4)", fontSize: 13 }}>
          {counts.new > 0 ? `${counts.new} new message${counts.new > 1 ? "s" : ""} waiting for review.` : "All caught up for now."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total inbox", value: counts.all, note: "All request types" },
          { label: "Bookings", value: counts.bookings, note: "Service orders" },
          { label: "Resource leads", value: counts.resources, note: "Download follow-up" },
          { label: "Need documents", value: counts.documentsNeeded, note: "Pending client action" },
          { label: "In progress", value: counts.inProgress, note: "Active work" },
        ].map((card) => (
          <div key={card.label} className="card-static" style={{ padding: "18px 18px 16px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, color: "var(--ink-1)", lineHeight: 1, marginBottom: 6 }}>{card.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 2 }}>{card.label}</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{card.note}</div>
          </div>
        ))}
      </div>

      <div className="card-static" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 12 }} className="grid-2">
          <div style={{ gridColumn: "span 1" }}>
            <label className="form-label">Search inbox</label>
            <div style={{ position: "relative" }}>
              <Search size={15} color="var(--ink-4)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, phone, service, or tracking code"
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Inbox status</label>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {["all", "new", "read", "replied", "archived"].map((value) => (
                <option key={value} value={value}>
                  {value === "all" ? "All statuses" : value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Request type</label>
            <select className="input" value={requestTypeFilter} onChange={(e) => setRequestTypeFilter(e.target.value)}>
              {REQUEST_TYPE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value === "all" ? "All request types" : value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Progress status</label>
            <select className="input" value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)}>
              <option value="all">All progress states</option>
              {PROGRESS_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {(query || statusFilter !== "all" || requestTypeFilter !== "all" || progressFilter !== "all") && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            <p style={{ fontSize: 12.5, color: "var(--ink-4)", margin: 0 }}>
              Showing {filtered.length} of {messages.length} messages.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setRequestTypeFilter("all");
                setProgressFilter("all");
              }}
              className="btn btn-secondary btn-sm"
            >
              <X size={13} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>No messages match the current filters.</div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg._id}
              style={{
                background: msg.status === "new" ? "rgba(37,99,235,0.02)" : "var(--surface)",
                border: `1px solid ${msg.status === "new" ? "rgba(37,99,235,0.25)" : "var(--border)"}`,
                borderRadius: 14,
                padding: "18px 22px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: msg.status === "new" ? "var(--blue-bg)" : "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: msg.status === "new" ? "var(--blue)" : "var(--ink-3)", fontSize: 15, flexShrink: 0 }}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{msg.name}</span>
                      <span className={`badge ${STATUS_COLORS[msg.status]}`}>{msg.status}</span>
                      <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--ink-3)", textTransform: "capitalize" }}>
                        {msg.progressStatus.replace(/_/g, " ")}
                      </span>
                      <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--ink-4)", textTransform: "capitalize" }}>
                        {msg.requestType}
                      </span>
                      {msg.service && <span style={{ fontSize: 12, color: "var(--ink-4)" }}>· {msg.service}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 2, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}><Mail size={11} /> {msg.email}</span>
                      {msg.phone && <span style={{ fontSize: 12, color: "var(--ink-4)", display: "flex", alignItems: "center", gap: 3 }}><Phone size={11} /> {msg.phone}</span>}
                      <span style={{ fontSize: 12, color: "var(--ink-4)" }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setExpanded(expanded === msg._id ? null : msg._id)} className="btn btn-ghost btn-sm">
                    {expanded === msg._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded === msg._id ? "Collapse" : "Read"}
                  </button>
                  {msg.status !== "replied" && <button onClick={() => setStatus(msg._id, "replied")} className="btn btn-success btn-sm">✓ Replied</button>}
                  {msg.status === "new" && <button onClick={() => setStatus(msg._id, "read")} className="btn btn-secondary btn-sm"><MailOpen size={13} /></button>}
                  <button onClick={() => setStatus(msg._id, "archived")} style={{ padding: "6px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", color: "var(--ink-4)" }}><Archive size={13} /></button>
                  <button onClick={() => handleDelete(msg._id)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                </div>
              </div>

              {expanded === msg._id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  {msg.subject && <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 }}>Subject: {msg.subject}</p>}
                  <p style={{ fontSize: 13, color: "var(--ink-4)", marginBottom: 8 }}>
                    Tracking code: <strong style={{ color: "var(--ink-1)" }}>{msg.trackingCode}</strong>
                  </p>
                  <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.75, background: "var(--bg-subtle)", padding: "14px 16px", borderRadius: 10 }}>{msg.message}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }} className="grid-2">
                    <div>
                      <label className="form-label">Public progress</label>
                      <select
                        className="input"
                        value={msg.progressStatus}
                        onChange={(e) => updateProgress(msg._id, e.target.value, msg.adminNotes || "")}
                        disabled={savingId === msg._id}
                      >
                        {PROGRESS_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Internal/admin note</label>
                      <textarea
                        className="input"
                        defaultValue={msg.adminNotes || ""}
                        placeholder="Short update shown on the tracking page"
                        style={{ minHeight: 90 }}
                        onBlur={(e) => {
                          if (e.target.value !== (msg.adminNotes || "")) {
                            updateProgress(msg._id, msg.progressStatus, e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your enquiry"}`} className="btn btn-primary btn-sm">
                      <Mail size={13} /> Reply via Email
                    </a>
                    {msg.phone && <a href={`tel:${msg.phone}`} className="btn btn-secondary btn-sm"><Phone size={13} /> Call</a>}
                    {msg.phone && <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#16a34a", textDecoration: "none" }}>WhatsApp</a>}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
