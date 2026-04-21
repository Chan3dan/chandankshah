"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, Star, Download } from "lucide-react";
import { useOptimisticCRUD } from "@/lib/useOptimisticCRUD";
import ImageUpload from "@/components/admin/ImageUpload";
import AdminModal from "@/components/admin/AdminModal";

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
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 2 }}>Resources</h1>
          <p style={{ color: "var(--ink-4)", fontSize: 13 }}>{items.length} resources · <a href="/resources" target="_blank" style={{ color: "var(--blue)" }}>View public page ↗</a></p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); }} className="btn btn-primary btn-sm">
          <Plus size={15} /> Add Resource
        </button>
      </div>

      {(showForm || (editingId && items.find(i => i._id === editingId))) && (
        <AdminModal
          title={editingId ? "Edit resource" : "Add resource"}
          subtitle="Keep downloads, links, thumbnails, and lead capture settings together in a focused editor."
          onClose={() => { setShowForm(false); setEditingId(null); }}
          width={980}
        >
          <ResourceForm
            initial={editingId && items.find(i => i._id === editingId) ? items.find(i => i._id === editingId)! : EMPTY}
            onSave={async (data: any) => {
              if (editingId) {
                await patchItem(editingId, data);
                setEditingId(null);
                return;
              }
              await createItem(data);
              setShowForm(false);
            }}
            onCancel={() => { setShowForm(false); setEditingId(null); }}
            saving={editingId ? saving === editingId : saving === "new"}
            isEdit={!!editingId}
          />
        </AdminModal>
      )}

      <div className="admin-section-card">
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>Loading…</div>
          : items.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <p style={{ color: "var(--ink-4)", marginBottom: 12 }}>No resources yet. Add your first free resource!</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Add First Resource</button>
            </div>
          ) : (
            <>
              <div className="desktop-only admin-table-scroll">
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
                            <button onClick={() => { setEditingId(r._id); setShowForm(false); }} className="btn btn-ghost btn-sm"><Edit2 size={13} /> Edit</button>
                            <button onClick={() => deleteItem(r._id, `Delete "${r.title}"?`)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }} disabled={deleting === r._id}>
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
                {items.map((resource) => (
                  <div key={resource._id} className="admin-mobile-card" style={{ opacity: deleting === resource._id ? 0.4 : 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>{resource.title}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>{resource.category}</div>
                    <div className="admin-mobile-meta">
                      <div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: 0.8 }}>Type</div>
                        <div style={{ marginTop: 6 }}><span className="badge badge-neutral" style={{ textTransform: "uppercase", fontSize: 11 }}>{resource.type}</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: 0.8 }}>Downloads</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)", marginTop: 6 }}>{resource.downloadCount}</div>
                      </div>
                    </div>
                    <div className="admin-mobile-actions">
                      <button onClick={() => toggleField(resource._id, "isActive", resource.isActive)} className={`badge ${resource.isActive ? "badge-green" : "badge-red"}`} style={{ cursor: "pointer", border: "none" }}>
                        {resource.isActive ? "Active" : "Hidden"}
                      </button>
                      <button onClick={() => toggleField(resource._id, "isFeatured", resource.isFeatured)} className="btn btn-ghost btn-sm">
                        <Star size={13} fill={resource.isFeatured ? "var(--amber)" : "none"} color={resource.isFeatured ? "var(--amber)" : "currentColor"} />
                        {resource.isFeatured ? "Featured" : "Feature"}
                      </button>
                      <button onClick={() => { setEditingId(resource._id); setShowForm(false); }} className="btn btn-ghost btn-sm"><Edit2 size={13} /> Edit</button>
                      <button onClick={() => deleteItem(resource._id, `Delete "${resource.title}"?`)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }} disabled={deleting === resource._id}>
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

function ResourceForm({ initial, onSave, onCancel, saving, isEdit = false }: any) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [newTag, setNewTag] = useState("");
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  useEffect(() => {
    setForm({ ...EMPTY, ...initial });
  }, [initial]);

  return (
      <div>
      <div className="admin-form-grid-3" style={{ marginBottom: 14 }}>
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
      <div className="admin-form-grid-2" style={{ marginBottom: 14 }}>
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
        <div className="stack-actions" style={{ gap: 8 }}>
          <input className="input" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add tag…" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newTag.trim()) { set("tags", [...(form.tags || []), newTag.trim()]); setNewTag(""); } } }} style={{ flex: 1 }} />
          <button onClick={() => { if (newTag.trim()) { set("tags", [...(form.tags || []), newTag.trim()]); setNewTag(""); } }} className="btn btn-secondary btn-sm">Add</button>
        </div>
      </div>
      <div className="stack-actions" style={{ gap: 20, marginBottom: 20 }}>
        {[["isFeatured", "⭐ Featured"], ["requiresEmail", "📧 Require Email to Download"]].map(([k, label]) => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)} style={{ width: 15, height: 15 }} />{label}
          </label>
        ))}
      </div>
      <div className="stack-actions">
        <button onClick={() => onSave(form)} className="btn btn-primary" disabled={saving}><Save size={15} />{saving ? " Saving…" : isEdit ? " Update" : " Create Resource"}</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
