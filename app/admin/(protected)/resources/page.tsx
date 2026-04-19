"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Star, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useOptimisticCRUD } from "@/lib/useOptimisticCRUD";
import ImageUpload from "@/components/admin/ImageUpload";

interface Resource {
  _id: string; title: string; description: string; category: string;
  type: "pdf" | "link" | "doc" | "video"; fileUrl: string; externalUrl: string;
  thumbnail: string; tags: string[]; downloadCount: number;
  isActive: boolean; isFeatured: boolean; requiresEmail: boolean; sortOrder: number;
}

const EMPTY = { title: "", description: "", category: "Loksewa", type: "pdf" as const, fileUrl: "", externalUrl: "", thumbnail: "", tags: [] as string[], isActive: true, isFeatured: false, requiresEmail: false };
const CATEGORIES = ["Loksewa", "DEMAT & Finance", "Documentation", "Academic", "Web Dev", "General"];
const TYPES = ["pdf", "link", "doc", "video"] as const;

export default function AdminResources() {
  const [rawItems, setRawItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/resources");
    const data = await r.json();
    setRawItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const { items, toggleField, deleteItem, createItem, patchItem, saving, deleting } = useOptimisticCRUD<Resource>(rawItems, {
    apiBase: "/api/resources",
    onSuccess: () => load(),
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 2 }}>Resources</h1>
          <p style={{ color: "var(--ink-4)", fontSize: 13 }}>{items.length} resources · <a href="/resources" target="_blank" style={{ color: "var(--blue)" }}>View public page ↗</a></p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); }} className="btn btn-primary btn-sm">
          <Plus size={15} /> Add Resource
        </button>
      </div>

      {showForm && (
        <ResourceForm
          initial={EMPTY}
          onSave={async (data: any) => { await createItem(data); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
          saving={saving === "new"}
        />
      )}
      {editingId && items.find(i => i._id === editingId) && (
        <ResourceForm
          initial={items.find(i => i._id === editingId)!}
          onSave={async (data: any) => { await patchItem(editingId, data); setEditingId(null); }}
          onCancel={() => setEditingId(null)}
          saving={saving === editingId}
          isEdit
        />
      )}

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>Loading…</div>
          : items.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <p style={{ color: "var(--ink-4)", marginBottom: 12 }}>No resources yet. Add your first free resource!</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Add First Resource</button>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Resource</th><th>Type</th><th>Downloads</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map(r => (
                  <tr key={r._id} style={{ opacity: deleting === r._id ? 0.4 : 1, transition: "opacity 0.2s" }}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{r.category}</div>
                    </td>
                    <td><span className="badge badge-neutral" style={{ textTransform: "uppercase", fontSize: 11 }}>{r.type}</span></td>
                    <td style={{ fontSize: 13, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Download size={12} /> {r.downloadCount}
                    </td>
                    <td>
                      <button onClick={() => toggleField(r._id, "isFeatured", r.isFeatured)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <Star size={16} fill={r.isFeatured ? "var(--amber)" : "none"} color={r.isFeatured ? "var(--amber)" : "var(--ink-4)"} />
                      </button>
                    </td>
                    <td>
                      <button onClick={() => toggleField(r._id, "isActive", r.isActive)} className={`badge ${r.isActive ? "badge-green" : "badge-red"}`} style={{ cursor: "pointer", border: "none" }}>
                        {r.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditingId(editingId === r._id ? null : r._id)} className="btn btn-ghost btn-sm"><Edit2 size={13} /> Edit</button>
                        <button onClick={() => deleteItem(r._id, `Delete "${r.title}"?`)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }} disabled={deleting === r._id}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}

function ResourceForm({ initial, onSave, onCancel, saving, isEdit = false }: any) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [newTag, setNewTag] = useState("");
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16 }}>{isEdit ? "Edit Resource" : "New Resource"}</h2>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-4)" }}><X size={18} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div><label className="form-label">Title *</label><input className="input" value={form.title} onChange={e => set("title", e.target.value)} /></div>
        <div><label className="form-label">Category</label>
          <select className="input" value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="form-label">Type</label>
          <select className="input" value={form.type} onChange={e => set("type", e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group"><label className="form-label">Description</label><textarea className="input" value={form.description} onChange={e => set("description", e.target.value)} style={{ minHeight: 70 }} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div><label className="form-label">File URL (direct download)</label><input className="input" value={form.fileUrl} onChange={e => set("fileUrl", e.target.value)} placeholder="https://..." /></div>
        <div><label className="form-label">External URL (link / video)</label><input className="input" value={form.externalUrl} onChange={e => set("externalUrl", e.target.value)} placeholder="https://..." /></div>
      </div>
      <div className="form-group">
        <ImageUpload value={form.thumbnail} onChange={v => set("thumbnail", v)} folder="cks-resources" label="Thumbnail Image (optional)" aspectHint="16:9 recommended" />
      </div>
      <div className="form-group">
        <label className="form-label">Tags</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {form.tags?.map((t: string, i: number) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 13 }}>
              {t}<button onClick={() => set("tags", form.tags.filter((_: any, j: number) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", padding: 0 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add tag…" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newTag.trim()) { set("tags", [...(form.tags || []), newTag.trim()]); setNewTag(""); } } }} style={{ flex: 1 }} />
          <button onClick={() => { if (newTag.trim()) { set("tags", [...(form.tags || []), newTag.trim()]); setNewTag(""); } }} className="btn btn-secondary btn-sm">Add</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {[["isFeatured", "⭐ Featured"], ["requiresEmail", "📧 Require Email to Download"]].map(([k, label]) => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)} style={{ width: 15, height: 15 }} />{label}
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => onSave(form)} className="btn btn-primary" disabled={saving}><Save size={15} />{saving ? " Saving…" : isEdit ? " Update" : " Create Resource"}</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
