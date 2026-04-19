import { connectDB } from "@/lib/mongodb";
import { Service, Project, Testimonial, Message, BlogPost, Resource } from "@/models";
import Link from "next/link";
import { Layers, Briefcase, Star, MessageSquare, BookOpen, TrendingUp, ArrowRight, BookMarked } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  await connectDB();
  const [serviceCount, projectCount, testimonialCount, messageCount, blogCount, resourceCount, newMessages] = await Promise.all([
    Service.countDocuments({ isActive: true }),
    Project.countDocuments({ isActive: true }),
    Testimonial.countDocuments({ isActive: true }),
    Message.countDocuments(),
    BlogPost.countDocuments({ isPublished: true }),
    Resource.countDocuments({ isActive: true }),
    Message.countDocuments({ status: "new" }),
  ]);

  const recentMessages = await Message.find().sort({ createdAt: -1 }).limit(6).lean();

  const stats = [
    { label: "Services", value: serviceCount, icon: "⚙️", href: "/admin/services", color: "#2563eb" },
    { label: "Projects", value: projectCount, icon: "💼", href: "/admin/projects", color: "#7c3aed" },
    { label: "Testimonials", value: testimonialCount, icon: "⭐", href: "/admin/testimonials", color: "#d97706" },
    { label: "Blog Posts", value: blogCount, icon: "📝", href: "/admin/blog", color: "#059669" },
    { label: "Resources", value: resourceCount, icon: "📚", href: "/admin/resources", color: "#0ea5e9" },
    { label: "New Messages", value: newMessages, icon: "📬", href: "/admin/messages", color: "#dc2626", highlight: newMessages > 0 },
    { label: "Total Messages", value: messageCount, icon: "💬", href: "/admin/messages", color: "#6366f1" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: "var(--ink-4)", fontSize: 14 }}>Welcome back! Here&apos;s your site overview.</p>
      </div>

      {/* Stats grid — pure CSS hover via class */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, marginBottom: 32 }}>
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div className="hover-lift" style={{
              background: stat.highlight ? `${stat.color}08` : "var(--surface)",
              border: `1px solid ${stat.highlight ? `${stat.color}30` : "var(--border)"}`,
              borderRadius: 14, padding: "20px 18px", cursor: "pointer",
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{stat.icon}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 400, color: stat.highlight ? stat.color : "var(--ink-1)", lineHeight: 1, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "var(--ink-4)", fontWeight: 500 }}>{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="grid-2">
        {/* Recent messages */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>Recent Messages</h2>
            <Link href="/admin/messages" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p style={{ color: "var(--ink-4)", fontSize: 14 }}>No messages yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentMessages.map((m: any) => (
                <Link key={m._id} href="/admin/messages" style={{
                  display: "flex", gap: 12, padding: "10px 12px", textDecoration: "none",
                  background: m.status === "new" ? "rgba(37,99,235,0.04)" : "var(--bg-subtle)",
                  borderRadius: 10,
                  border: m.status === "new" ? "1px solid rgba(37,99,235,0.12)" : "1px solid transparent",
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--blue-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--blue)", fontSize: 13, flexShrink: 0 }}>
                    {m.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--ink-1)" }}>{m.name}</span>
                      {m.status === "new" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue)", flexShrink: 0 }} />}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--ink-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                      {m.service || m.message?.slice(0, 45)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick links — CSS hover only */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 18 }}>Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              ["➕ Add New Service", "/admin/services"],
              ["📁 Add New Project", "/admin/projects"],
              ["✍️ Write Blog Post", "/admin/blog"],
              ["📚 Add Resource", "/admin/resources"],
              ["⭐ Add Testimonial", "/admin/testimonials"],
              ["⚙️ Update Settings", "/admin/settings"],
            ].map(([label, href]) => (
              <Link key={href} href={href}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-subtle)", borderRadius: 10, textDecoration: "none", fontSize: 14, color: "var(--ink-2)" }}
                className="hover-bg">
                {label} <ArrowRight size={13} color="var(--ink-4)" />
              </Link>
            ))}
            <a href="/" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-subtle)", borderRadius: 10, textDecoration: "none", fontSize: 14, color: "var(--ink-2)" }}
              className="hover-bg">
              🌐 View Live Site <ArrowRight size={13} color="var(--ink-4)" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
