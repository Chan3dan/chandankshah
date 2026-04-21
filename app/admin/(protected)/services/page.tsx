"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

interface Service {
  _id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  longDescription: string;
  features: string[];
  price: string;
  priceNote: string;
  color: string;
  badge: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

const EMPTY: Omit<Service, "_id" | "slug" | "sortOrder"> = {
  title: "", icon: "🔧", description: "", longDescription: "",
  features: [], price: "", priceNote: "", color: "#2563eb",
  badge: "", category: "Government", isActive: true,
};

const CATEGORIES = ["Government", "Financial", "Academic", "Technical", "Digital", "Other"];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    const res = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Service created!"); setShowForm(false); setForm(EMPTY); load(); }
    else toast.error("Failed to create service");
    setSaving(false);
  };

  const handleUpdate = async (id: string, data: Partial<Service>) => {
    setSaving(true);
    const res = await fetch(`/api/services/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { toast.success("Updated!"); setEditing(null); load(); }
    else toast.error("Failed to update");
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); load(); }
    else toast.error("Failed to delete");
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, color: "var(--ink-1)", marginBottom: 2 }}>Services</h1>
          <p style={{ color: "var(--ink-4)", fontSize: 13 }}>{services.length} service{services.length !== 1 ? "s" : ""} listed</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }} className="btn btn-primary btn-sm">
          <Plus size={15} /> Add Service
        </button>
      </div>

      {/* Create / Edit form */}
      {(showForm || editing) && (
        <ServiceForm
          form={editing ? (services.find(s => s._id === editing) as any) : form}
          setForm={editing ? () => {} : setForm}
          onSave={editing ? (data: any) => handleUpdate(editing, data) : handleCreate}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          saving={saving}
          isEdit={!!editing}
          categories={CATEGORIES}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
        />
      )}

      {/* Table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>Loading…</div>
        ) : services.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <p style={{ color: "var(--ink-4)", marginBottom: 12 }}>No services yet.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Add First Service</button>
          </div>
        ) : (
          <>
          <div className="desktop-only admin-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(svc => (
                <tr key={svc._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${svc.color}14`, border: `1px solid ${svc.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{svc.icon}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink-1)" }}>{svc.title}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-4)" }}>/{svc.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{svc.category}</span></td>
                  <td style={{ fontWeight: 600, color: "var(--blue)", fontSize: 13 }}>{svc.price}</td>
                  <td>
                    <button onClick={() => handleUpdate(svc._id, { isActive: !svc.isActive })}
                      className={`badge ${svc.isActive ? "badge-green" : "badge-red"}`}
                      style={{ cursor: "pointer", border: "none" }}>
                      {svc.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setEditing(editing === svc._id ? null : svc._id)} className="btn btn-ghost btn-sm">
                        <Edit2 size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(svc._id, svc.title)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="mobile-only admin-mobile-list">
            {services.map((svc) => (
              <div key={svc._id} className="admin-mobile-card">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `${svc.color}14`, border: `1px solid ${svc.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{svc.icon}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 4 }}>{svc.title}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 10 }}>/{svc.slug}</div>
                    <div className="admin-mobile-meta">
                      <div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Category</div>
                        <span className="badge badge-neutral">{svc.category}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Price</div>
                        <div style={{ fontWeight: 700, color: "var(--blue)", fontSize: 14 }}>{svc.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-mobile-actions">
                  <button onClick={() => handleUpdate(svc._id, { isActive: !svc.isActive })} className={`badge ${svc.isActive ? "badge-green" : "badge-red"}`} style={{ cursor: "pointer", border: "none" }}>
                    {svc.isActive ? "Active" : "Hidden"}
                  </button>
                  <button onClick={() => setEditing(editing === svc._id ? null : svc._id)} className="btn btn-ghost btn-sm">
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(svc._id, svc.title)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}

function ServiceForm({ form, setForm, onSave, onCancel, saving, isEdit, categories, newFeature, setNewFeature }: any) {
  const [localForm, setLocal] = useState(form);
  const set = (k: string, v: any) => setLocal((p: any) => ({ ...p, [k]: v }));

  const addFeature = () => {
    if (!newFeature.trim()) return;
    set("features", [...(localForm.features || []), newFeature.trim()]);
    setNewFeature("");
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16 }}>{isEdit ? "Edit Service" : "New Service"}</h2>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-4)" }}><X size={18} /></button>
      </div>

      <div className="admin-form-grid-4" style={{ marginBottom: 14 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Title *</label>
          <input className="input" value={localForm.title} onChange={e => set("title", e.target.value)} placeholder="Service name" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Icon (emoji)</label>
          <input className="input" value={localForm.icon} onChange={e => set("icon", e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Category</label>
          <select className="input" value={localForm.category} onChange={e => set("category", e.target.value)}>
            {categories.map((c: string) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Accent Color</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="color" value={localForm.color} onChange={e => set("color", e.target.value)} style={{ width: 42, height: 42, borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", padding: 3, background: "var(--bg-subtle)" }} />
            <input className="input" value={localForm.color} onChange={e => set("color", e.target.value)} style={{ flex: 1 }} />
          </div>
        </div>
      </div>

      <div className="admin-form-grid-3" style={{ marginBottom: 14 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Starting Price</label>
          <input className="input" value={localForm.price} onChange={e => set("price", e.target.value)} placeholder="Rs. 500–800" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Price Note</label>
          <input className="input" value={localForm.priceNote} onChange={e => set("priceNote", e.target.value)} placeholder="*Depends on complexity" />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Badge (optional)</label>
          <input className="input" value={localForm.badge} onChange={e => set("badge", e.target.value)} placeholder="Most Popular" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Short Description *</label>
        <textarea className="input" value={localForm.description} onChange={e => set("description", e.target.value)} style={{ minHeight: 70 }} placeholder="Brief description shown on cards" />
      </div>
      <div className="form-group">
        <label className="form-label">Long Description (shown on detail page)</label>
        <textarea className="input" value={localForm.longDescription} onChange={e => set("longDescription", e.target.value)} style={{ minHeight: 100 }} placeholder="Detailed description…" />
      </div>

      {/* Features */}
      <div className="form-group">
        <label className="form-label">Features / What&apos;s Included</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {localForm.features?.map((f: string, i: number) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 13 }}>
              {f}
              <button onClick={() => set("features", localForm.features.filter((_: string, j: number) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input className="input" value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="Add a feature…" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} style={{ flex: 1 }} />
          <button onClick={addFeature} className="btn btn-secondary btn-sm">Add</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button onClick={() => onSave(localForm)} className="btn btn-primary" disabled={saving}>
          <Save size={15} /> {saving ? "Saving…" : isEdit ? "Update Service" : "Create Service"}
        </button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
