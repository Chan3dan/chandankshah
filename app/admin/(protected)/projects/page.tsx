"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, Star } from "lucide-react";
import toast from "react-hot-toast";
import AdminModal from "@/components/admin/AdminModal";

interface Project {
  _id: string; title: string; slug: string; category: string;
  description: string; longDescription: string; tags: string[];
  link: string; githubLink: string; imageUrl: string;
  featured: boolean; isActive: boolean; sortOrder: number;
}

const EMPTY = { title: "", category: "Web App", description: "", longDescription: "", tags: [] as string[], link: "", githubLink: "", imageUrl: "", featured: false, isActive: true };

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); const r = await fetch("/api/projects"); setProjects(await r.json()); setLoading(false); };

  const handleCreate = async (form: typeof EMPTY) => {
    if (!form.title.trim()) return toast.error("Title required");
    setSaving(true);
    const r = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (r.ok) { toast.success("Project created!"); setShowForm(false); load(); } else toast.error("Failed");
    setSaving(false);
  };

  const handleUpdate = async (id: string, data: Partial<Project>) => {
    setSaving(true);
    const r = await fetch(`/api/projects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (r.ok) { toast.success("Updated!"); setEditing(null); load(); } else toast.error("Failed");
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const r = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Deleted"); load(); } else toast.error("Failed");
  };

  const editingProject = editing ? projects.find(p => p._id === editing) : null;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 2 }}>Projects</h1>
          <p style={{ color: "var(--ink-4)", fontSize: 13 }}>{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn btn-primary btn-sm"><Plus size={15} /> Add Project</button>
      </div>

      {(showForm || editingProject) && (
        <AdminModal
          title={editingProject ? "Edit project" : "Add project"}
          subtitle="Keep portfolio entries clean, structured, and ready for every screen size."
          onClose={() => { setShowForm(false); setEditing(null); }}
          width={960}
        >
          <ProjectForm
            initial={editingProject || EMPTY}
            onSave={editingProject ? (d: any) => handleUpdate(editingProject._id, d) : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            saving={saving}
            isEdit={!!editingProject}
          />
        </AdminModal>
      )}

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>Loading…</div> : projects.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <p style={{ color: "var(--ink-4)", marginBottom: 12 }}>No projects yet.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Add First Project</button>
          </div>
        ) : (
          <>
          <div className="desktop-only admin-table-scroll">
          <table className="data-table">
            <thead><tr><th>Project</th><th>Category</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{p.tags?.slice(0, 3).join(", ")}</div>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{p.category}</span></td>
                  <td>
                    <button onClick={() => handleUpdate(p._id, { featured: !p.featured })} style={{ background: "none", border: "none", cursor: "pointer" }}>
                      <Star size={16} fill={p.featured ? "var(--amber)" : "none"} color={p.featured ? "var(--amber)" : "var(--ink-4)"} />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(p._id, { isActive: !p.isActive })} className={`badge ${p.isActive ? "badge-green" : "badge-red"}`} style={{ cursor: "pointer", border: "none" }}>
                      {p.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setEditing(p._id); setShowForm(false); }} className="btn btn-ghost btn-sm"><Edit2 size={13} /> Edit</button>
                      <button onClick={() => handleDelete(p._id, p.title)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="mobile-only admin-mobile-list">
            {projects.map((p) => (
              <div key={p._id} className="admin-mobile-card">
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 10 }}>{p.tags?.slice(0, 3).join(", ")}</div>
                <div className="admin-mobile-meta">
                  <div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Category</div>
                    <span className="badge badge-blue">{p.category}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>Featured</div>
                    <Star size={16} fill={p.featured ? "var(--amber)" : "none"} color={p.featured ? "var(--amber)" : "var(--ink-4)"} />
                  </div>
                </div>
                <div className="admin-mobile-actions">
                  <button onClick={() => handleUpdate(p._id, { featured: !p.featured })} className="btn btn-ghost btn-sm">
                    <Star size={13} /> {p.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button onClick={() => handleUpdate(p._id, { isActive: !p.isActive })} className={`badge ${p.isActive ? "badge-green" : "badge-red"}`} style={{ cursor: "pointer", border: "none" }}>
                    {p.isActive ? "Active" : "Hidden"}
                  </button>
                  <button onClick={() => { setEditing(p._id); setShowForm(false); }} className="btn btn-ghost btn-sm"><Edit2 size={13} /> Edit</button>
                  <button onClick={() => handleDelete(p._id, p.title)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
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

function ProjectForm({ initial, onSave, onCancel, saving, isEdit }: any) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [newTag, setNewTag] = useState("");
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  useEffect(() => {
    setForm({ ...EMPTY, ...initial });
  }, [initial]);

  return (
    <div>
      <div className="admin-form-grid-2" style={{ marginBottom: 14 }}>
        <div><label className="form-label">Title *</label><input className="input" value={form.title} onChange={e => set("title", e.target.value)} /></div>
        <div><label className="form-label">Category</label><input className="input" value={form.category} onChange={e => set("category", e.target.value)} /></div>
      </div>
      <div className="form-group"><label className="form-label">Short Description *</label><textarea className="input" value={form.description} onChange={e => set("description", e.target.value)} style={{ minHeight: 70 }} /></div>
      <div className="form-group"><label className="form-label">Long Description</label><textarea className="input" value={form.longDescription} onChange={e => set("longDescription", e.target.value)} style={{ minHeight: 100 }} /></div>
      <div className="admin-form-grid-3" style={{ marginBottom: 14 }}>
        <div><label className="form-label">Live URL</label><input className="input" value={form.link} onChange={e => set("link", e.target.value)} placeholder="https://..." /></div>
        <div><label className="form-label">GitHub URL</label><input className="input" value={form.githubLink} onChange={e => set("githubLink", e.target.value)} placeholder="https://github.com/..." /></div>
        <div><label className="form-label">Cover Image URL</label><input className="input" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://..." /></div>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className="form-label">Tech Stack / Tags</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {form.tags?.map((t: string, i: number) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 13 }}>
              {t}<button onClick={() => set("tags", form.tags.filter((_: string, j: number) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", padding: 0 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Next.js, React…" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newTag.trim()) { set("tags", [...(form.tags || []), newTag.trim()]); setNewTag(""); } } }} style={{ flex: 1 }} />
          <button onClick={() => { if (newTag.trim()) { set("tags", [...(form.tags || []), newTag.trim()]); setNewTag(""); } }} className="btn btn-secondary btn-sm">Add</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <input type="checkbox" id="featured" checked={form.featured} onChange={e => set("featured", e.target.checked)} style={{ width: 16, height: 16 }} />
        <label htmlFor="featured" style={{ fontSize: 14, fontWeight: 600, cursor: "pointer" }}>⭐ Mark as Featured Project</label>
      </div>

      <div className="stack-actions">
        <button onClick={() => onSave(form)} className="btn btn-primary" disabled={saving}><Save size={15} /> {saving ? "Saving…" : isEdit ? "Update" : "Create"}</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
