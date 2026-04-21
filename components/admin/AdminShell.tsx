"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, Briefcase, Star, MessageSquare, Settings, FileText, LogOut, Menu, X, ExternalLink, BookOpen } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="admin-shell">
      <div
        className={`admin-sidebar-backdrop ${sidebarOpen ? "is-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`} aria-hidden={!sidebarOpen}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, minHeight: 56 }}>
          <div className="brand-mark" style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0 }}>
            <span style={{ fontWeight: 800, fontSize: 13 }}>C</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)", whiteSpace: "nowrap" }}>Admin Panel</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 6, borderRadius: 8 }}
            aria-label="Close admin menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          {NAV.map((item, i) => {
            if ("section" in item) {
              return <div key={i} className="admin-nav-section">{item.section}</div>;
            }
            return (
              <Link key={item.href} href={item.href!}
                className={`admin-nav-link ${isActive(item.href!) ? "active" : ""}`}
                style={{ justifyContent: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--bg-subtle)", borderRadius: 10 }}>
            {user.image && <img src={user.image} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: "var(--ink-4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="admin-nav-link"
            style={{ width: "100%", marginTop: 6, color: "var(--red)", justifyContent: "flex-start" }}>
            <LogOut size={15} style={{ flexShrink: 0 }} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button onClick={() => setSidebarOpen((current) => !current)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 6, borderRadius: 8 }} aria-label="Toggle admin menu">
            <Menu size={18} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
              <ExternalLink size={14} /> View Site
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-main-inner">
          {children}
        </main>
      </div>
    </div>
  );
}
