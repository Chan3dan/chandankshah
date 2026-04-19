"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, Briefcase, Star, MessageSquare, Settings, FileText, LogOut, Menu, X, ExternalLink, Bell, BookOpen } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { section: "Content" },
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={16} /> },
  { label: "Services", href: "/admin/services", icon: <Layers size={16} /> },
  { label: "Projects", href: "/admin/projects", icon: <Briefcase size={16} /> },
  { label: "Blog Posts", href: "/admin/blog", icon: <BookOpen size={16} /> },
  { label: "Resources", href: "/admin/resources", icon: <FileText size={16} /> },
  { label: "Testimonials", href: "/admin/testimonials", icon: <Star size={16} /> },
  { section: "Inbox" },
  { label: "Messages", href: "/admin/messages", icon: <MessageSquare size={16} /> },
  { section: "Configuration" },
  { label: "Settings", href: "/admin/settings", icon: <Settings size={16} /> },
];

export default function AdminShell({ children, user }: { children: React.ReactNode; user: { name?: string | null; email?: string | null; image?: string | null } }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const Sidebar = () => (
    <aside style={{
      width: sidebarOpen ? 220 : 60, background: "var(--surface)", borderRight: "1px solid var(--border)",
      height: "100vh", position: "sticky", top: 0, display: "flex", flexDirection: "column",
      transition: "width 0.2s ease", flexShrink: 0, overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "16px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, minHeight: 56 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>C</span>
        </div>
        {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)", whiteSpace: "nowrap" }}>Admin Panel</span>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        {NAV.map((item, i) => {
          if ("section" in item) {
            return sidebarOpen ? (
              <div key={i} className="admin-nav-section">{item.section}</div>
            ) : <div key={i} style={{ height: 8 }} />;
          }
          return (
            <Link key={item.href} href={item.href!}
              className={`admin-nav-link ${isActive(item.href!) ? "active" : ""}`}
              title={!sidebarOpen ? item.label : undefined}
              style={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
        {sidebarOpen ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--bg-subtle)", borderRadius: 10 }}>
            {user.image && <img src={user.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: "var(--ink-4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
            </div>
          </div>
        ) : (
          user.image && <img src={user.image} alt="" style={{ width: 32, height: 32, borderRadius: "50%", margin: "0 auto", display: "block" }} />
        )}
        <button onClick={() => signOut({ callbackUrl: "/" })}
          className="admin-nav-link"
          style={{ width: "100%", marginTop: 6, color: "var(--red)", justifyContent: sidebarOpen ? "flex-start" : "center" }}>
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {sidebarOpen && "Sign Out"}
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 6, borderRadius: 8 }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
              <ExternalLink size={14} /> View Site
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
