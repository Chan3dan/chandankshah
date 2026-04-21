"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, Star } from "lucide-react";
import toast from "react-hot-toast";
import AdminModal from "@/components/admin/AdminModal";

interface Testimonial { _id: string; name: string; role: string; company: string; text: string; rating: number; avatarInitial: string; avatarColor: string; service: string; isActive: boolean; isFeatured: boolean; }
const EMPTY = { name: "", role: "", company: "", text: "", rating: 5, avatarInitial: "", avatarColor: "#2563eb", service: "", isActive: true, isFeatured: false };

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); const r = await fetch("/api/testimonials"); setItems(await r.json()); setLoading(false); };

  const handleCreate = async (form: typeof EMPTY) => {
    if (!form.name || !form.text) return toast.error("Name and review are required");
    setSaving(true);
    const avatarInitial = form.avatarInitial || form.name.charAt(0).toUpperCase();
    const r = await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, avatarInitial }) });
    if (r.ok) { toast.success("Added!"); setShowForm(false); load(); } else toast.error("Failed");
    setSaving(false);
  };

  const handleUpdate = async (id: string, data: Partial<Testimonial>) => {
    setSaving(true);
    const r = await fetch(`/api/testimonials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (r.ok) { toast.success("Updated!"); setEditing(null); load(); } else toast.error("Failed");
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const r = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Deleted"); load(); } else toast.error("Failed");
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 2 }}>Testimonials</h1>
          <p style={{ color: "var(--ink-4)", fontSize: 13 }}>{items.length} review{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn btn-primary btn-sm"><Plus size={15} /> Add Review</button>
      </div>

      {(showForm || editing) && (
        <AdminModal
          title={editing ? "Edit testimonial" : "Add testimonial"}
          subtitle="Edit reviews in a modal so the list stays stable and easy to scan on mobile."
          onClose={() => { setShowForm(false); setEditing(null); }}
          width={860}
        >
          <TestimonialForm
            initial={editing ? items.find(t => t._id === editing) || EMPTY : EMPTY}
            onSave={editing ? (d: any) => handleUpdate(editing, d) : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            saving={saving} isEdit={!!editing}
          />
        </AdminModal>
      )}

      <div className="admin-card-stack">
        {loading ? <div style={{ color: "var(--ink-4)", padding: 20 }}>Loading…</div> : items.map(t => (
          <div key={t._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, position: "relative" }}>
            {t.isFeatured && <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700, padding: "2px 8px", background: "rgba(217,119,6,0.12)", color: "var(--amber)", borderRadius: 99 }}>⭐ Featured</span>}
            <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={13} fill="var(--amber)" color="var(--amber)" />)}
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 14, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 13 }}>{t.avatarInitial}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{t.role}{t.company ? `, ${t.company}` : ""}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={() => { setEditing(t._id); setShowForm(false); }} className="btn btn-ghost btn-sm"><Edit2 size={12} /> Edit</button>
              <button onClick={() => handleUpdate(t._id, { isFeatured: !t.isFeatured })} className={`btn btn-sm ${t.isFeatured ? "btn-secondary" : "btn-ghost"}`}>{t.isFeatured ? "Unfeature" : "Feature"}</button>
              <button onClick={() => handleUpdate(t._id, { isActive: !t.isActive })} className={`badge ${t.isActive ? "badge-green" : "badge-red"}`} style={{ cursor: "pointer", border: "none", padding: "6px 12px" }}>{t.isActive ? "Active" : "Hidden"}</button>
              <button onClick={() => handleDelete(t._id, t.name)} style={{ marginLeft: "auto", padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialForm({ initial, onSave, onCancel, saving, isEdit }: any) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  useEffect(() => {
    setForm({ ...EMPTY, ...initial });
  }, [initial]);

  return (
      <div>
      <div className="admin-form-grid-3" style={{ marginBottom: 14 }}>
        <div><label className="form-label">Client Name *</label><input className="input" value={form.name} onChange={e => set("name", e.target.value)} /></div>
        <div><label className="form-label">Role / Title</label><input className="input" value={form.role} onChange={e => set("role", e.target.value)} /></div>
        <div><label className="form-label">Company</label><input className="input" value={form.company} onChange={e => set("company", e.target.value)} /></div>
      </div>
      <div className="form-group"><label className="form-label">Review Text *</label><textarea className="input" value={form.text} onChange={e => set("text", e.target.value)} style={{ minHeight: 80 }} /></div>
      <div className="admin-form-grid-4" style={{ marginBottom: 14 }}>
        <div><label className="form-label">Rating (1–5)</label><select className="input" value={form.rating} onChange={e => set("rating", +e.target.value)}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></div>
        <div><label className="form-label">Avatar Letter</label><input className="input" value={form.avatarInitial} onChange={e => set("avatarInitial", e.target.value)} placeholder="Auto from name" /></div>
        <div><label className="form-label">Avatar Color</label><input type="color" value={form.avatarColor} onChange={e => set("avatarColor", e.target.value)} style={{ height: 42, width: "100%", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", padding: 3 }} /></div>
        <div><label className="form-label">Service Used</label><input className="input" value={form.service} onChange={e => set("service", e.target.value)} placeholder="e.g. Loksewa" /></div>
      </div>
      <div className="stack-actions" style={{ gap: 16, marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <input type="checkbox" checked={form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} style={{ width: 15, height: 15 }} /> ⭐ Featured
        </label>
      </div>
      <div className="stack-actions">
        <button onClick={() => onSave(form)} className="btn btn-primary" disabled={saving}><Save size={15} /> {saving ? "Saving…" : isEdit ? "Update" : "Add Review"}</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
