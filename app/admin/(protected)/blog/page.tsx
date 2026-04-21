"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

interface Post { _id: string; title: string; slug: string; excerpt: string; content: string; coverImage: string; tags: string[]; category: string; isPublished: boolean; readTime: number; publishedAt: string; createdAt: string; }
const EMPTY = { title: "", excerpt: "", content: "", coverImage: "", tags: [] as string[], category: "General", isPublished: false };

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); const r = await fetch("/api/blog?all=1"); setPosts(await r.json()); setLoading(false); };

  const handleCreate = async (form: typeof EMPTY) => {
    if (!form.title.trim()) return toast.error("Title required");
    setSaving(true);
    const r = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (r.ok) { toast.success("Post created!"); setShowForm(false); load(); } else toast.error("Failed");
    setSaving(false);
  };

  const handleUpdate = async (id: string, data: any) => {
    setSaving(true);
    const r = await fetch(`/api/blog/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (r.ok) { toast.success("Updated!"); setEditing(null); load(); } else toast.error("Failed");
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const r = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Deleted"); load(); } else toast.error("Failed");
  };

  const editingPost = editing ? posts.find(p => p._id === editing) : null;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, marginBottom: 2 }}>Blog Posts</h1>
          <p style={{ color: "var(--ink-4)", fontSize: 13 }}>{posts.filter(p => p.isPublished).length} published · {posts.filter(p => !p.isPublished).length} drafts</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn btn-primary btn-sm"><Plus size={15} /> New Post</button>
      </div>

      {(showForm || editingPost) && (
        <BlogForm
          initial={editingPost || EMPTY}
          onSave={editingPost ? (d: any) => handleUpdate(editingPost._id, d) : handleCreate}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          saving={saving} isEdit={!!editingPost}
        />
      )}

      <div className="admin-section-card">
        {loading ? <div style={{ padding: 40, textAlign: "center", color: "var(--ink-4)" }}>Loading…</div>
          : posts.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center" }}>
              <p style={{ color: "var(--ink-4)", marginBottom: 12 }}>No posts yet. Start writing!</p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Write First Post</button>
            </div>
          ) : (
            <>
              <div className="desktop-only admin-table-scroll">
                <table className="data-table">
                  <thead><tr><th>Title</th><th>Category</th><th>Read Time</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {posts.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                          <div style={{ fontSize: 12, color: "var(--ink-4)" }}>/{p.slug}</div>
                        </td>
                        <td><span className="badge badge-neutral">{p.category}</span></td>
                        <td style={{ fontSize: 13, color: "var(--ink-4)" }}>{p.readTime} min</td>
                        <td>
                          <button onClick={() => handleUpdate(p._id, { isPublished: !p.isPublished })} className={`badge ${p.isPublished ? "badge-green" : "badge-amber"}`} style={{ cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: 5 }}>
                            {p.isPublished ? <><Eye size={11} /> Published</> : <><EyeOff size={11} /> Draft</>}
                          </button>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--ink-4)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => setEditing(editing === p._id ? null : p._id)} className="btn btn-ghost btn-sm"><Edit2 size={13} /> Edit</button>
                            <button onClick={() => handleDelete(p._id, p.title)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-only admin-mobile-list">
                {posts.map((post) => (
                  <div key={post._id} className="admin-mobile-card">
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>{post.title}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>/{post.slug}</div>
                    <div className="admin-mobile-meta">
                      <div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: 0.8 }}>Category</div>
                        <div style={{ marginTop: 6 }}><span className="badge badge-neutral">{post.category}</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: 0.8 }}>Read time</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)", marginTop: 6 }}>{post.readTime} min</div>
                      </div>
                    </div>
                    <div className="admin-mobile-actions">
                      <button onClick={() => handleUpdate(post._id, { isPublished: !post.isPublished })} className={`badge ${post.isPublished ? "badge-green" : "badge-amber"}`} style={{ cursor: "pointer", border: "none", display: "flex", alignItems: "center", gap: 5 }}>
                        {post.isPublished ? <><Eye size={11} /> Published</> : <><EyeOff size={11} /> Draft</>}
                      </button>
                      <button onClick={() => setEditing(editing === post._id ? null : post._id)} className="btn btn-ghost btn-sm"><Edit2 size={13} /> Edit</button>
                      <button onClick={() => handleDelete(post._id, post.title)} style={{ padding: "6px 10px", background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 8, cursor: "pointer", color: "var(--red)" }}><Trash2 size={13} /></button>
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

function BlogForm({ initial, onSave, onCancel, saving, isEdit }: any) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [newTag, setNewTag] = useState("");
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16 }}>{isEdit ? "Edit Post" : "New Post"}</h2>
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-4)" }}><X size={18} /></button>
      </div>

      <div className="admin-form-grid-2" style={{ marginBottom: 14 }}>
        <div><label className="form-label">Title *</label><input className="input" value={form.title} onChange={e => set("title", e.target.value)} /></div>
        <div><label className="form-label">Category</label><input className="input" value={form.category} onChange={e => set("category", e.target.value)} /></div>
      </div>
      <div className="form-group"><label className="form-label">Excerpt / Summary</label><textarea className="input" value={form.excerpt} onChange={e => set("excerpt", e.target.value)} style={{ minHeight: 60 }} placeholder="Brief summary shown on the blog listing…" /></div>
      <div className="form-group"><label className="form-label">Cover Image URL</label><input className="input" value={form.coverImage} onChange={e => set("coverImage", e.target.value)} placeholder="https://…" /></div>
      <div className="form-group">
        <label className="form-label">Content (HTML or plain text)</label>
        <textarea className="input" value={form.content} onChange={e => set("content", e.target.value)} style={{ minHeight: 280, fontFamily: "var(--font-mono)", fontSize: 13 }} placeholder="Write your article here. You can use HTML tags like <h2>, <p>, <ul>, <li>…" />
        <p className="form-hint">Supports HTML. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, etc.</p>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className="form-label">Tags</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {form.tags?.map((t: string, i: number) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 99, fontSize: 13 }}>
              {t}<button onClick={() => set("tags", form.tags.filter((_: string, j: number) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", padding: 0 }}>×</button>
            </span>
          ))}
        </div>
        <div className="stack-actions" style={{ gap: 8 }}>
          <input className="input" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add tag…" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newTag.trim()) { set("tags", [...(form.tags || []), newTag.trim()]); setNewTag(""); } } }} style={{ flex: 1 }} />
          <button onClick={() => { if (newTag.trim()) { set("tags", [...(form.tags || []), newTag.trim()]); setNewTag(""); } }} className="btn btn-secondary btn-sm">Add</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <input type="checkbox" id="pub" checked={form.isPublished} onChange={e => set("isPublished", e.target.checked)} style={{ width: 16, height: 16 }} />
        <label htmlFor="pub" style={{ fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Publish immediately</label>
      </div>

      <div className="stack-actions">
        <button onClick={() => onSave(form)} className="btn btn-primary" disabled={saving}><Save size={15} /> {saving ? "Saving…" : isEdit ? "Update Post" : "Create Post"}</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
}
