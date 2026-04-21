import { connectDB } from "@/lib/mongodb";
import { Service, Project, Testimonial, Message, BlogPost, Resource } from "@/models";
import Link from "next/link";
import {
  Layers,
  Briefcase,
  Star,
  MessageSquare,
  ArrowRight,
  BookOpen,
  FileText,
  ShieldCheck,
  Inbox,
  Clock3,
  CheckCircle2,
  Archive,
  TrendingUp,
} from "lucide-react";

export const metadata = { title: "Dashboard" };

const cardStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 24,
} as const;

export default async function AdminDashboard() {
  await connectDB();

  const [
    serviceCount,
    projectCount,
    testimonialCount,
    messageCount,
    blogCount,
    resourceCount,
    newMessages,
    repliedMessages,
    archivedMessages,
    recentMessages,
    lastSevenDaysMessages,
    serviceInterest,
    bookingCount,
    resourceLeadCount,
    contactLeadCount,
    documentsNeededCount,
    inProgressCount,
    completedCount,
  ] = await Promise.all([
    Service.countDocuments({ isActive: true }),
    Project.countDocuments({ isActive: true }),
    Testimonial.countDocuments({ isActive: true }),
    Message.countDocuments(),
    BlogPost.countDocuments({ isPublished: true }),
    Resource.countDocuments({ isActive: true }),
    Message.countDocuments({ status: "new" }),
    Message.countDocuments({ status: "replied" }),
    Message.countDocuments({ status: "archived" }),
    Message.find().sort({ createdAt: -1 }).limit(6).lean(),
    Message.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    Message.aggregate([
      { $match: { service: { $exists: true, $ne: "" } } },
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]),
    Message.countDocuments({ requestType: "booking" }),
    Message.countDocuments({ requestType: "resource" }),
    Message.countDocuments({ requestType: "contact" }),
    Message.countDocuments({ progressStatus: "documents_needed" }),
    Message.countDocuments({ progressStatus: "in_progress" }),
    Message.countDocuments({ progressStatus: "completed" }),
  ]);

  const pendingMessages = Math.max(messageCount - repliedMessages - archivedMessages, 0);
  const responseRate = messageCount > 0 ? Math.round((repliedMessages / messageCount) * 100) : 0;

  const overviewStats = [
    {
      label: "New enquiries",
      value: newMessages,
      note: "Needs review",
      href: "/admin/messages",
      color: "#2563eb",
      icon: <Inbox size={18} />,
      highlight: newMessages > 0,
    },
    {
      label: "Weekly enquiries",
      value: lastSevenDaysMessages,
      note: "Last 7 days",
      href: "/admin/messages",
      color: "#7c3aed",
      icon: <TrendingUp size={18} />,
    },
    {
      label: "Reply rate",
      value: `${responseRate}%`,
      note: "Marked replied",
      href: "/admin/messages",
      color: "#16a34a",
      icon: <CheckCircle2 size={18} />,
    },
    {
      label: "Pending inbox",
      value: pendingMessages,
      note: "Not archived",
      href: "/admin/messages",
      color: "#d97706",
      icon: <Clock3 size={18} />,
    },
  ];

  const contentStats = [
    {
      label: "Services",
      value: serviceCount,
      href: "/admin/services",
      icon: <Layers size={18} />,
      color: "#2563eb",
    },
    {
      label: "Projects",
      value: projectCount,
      href: "/admin/projects",
      icon: <Briefcase size={18} />,
      color: "#7c3aed",
    },
    {
      label: "Blog posts",
      value: blogCount,
      href: "/admin/blog",
      icon: <BookOpen size={18} />,
      color: "#059669",
    },
    {
      label: "Resources",
      value: resourceCount,
      href: "/admin/resources",
      icon: <FileText size={18} />,
      color: "#0ea5e9",
    },
    {
      label: "Testimonials",
      value: testimonialCount,
      href: "/admin/testimonials",
      icon: <Star size={18} />,
      color: "#ea580c",
    },
  ];

  const inboxStats = [
    { label: "Total messages", value: messageCount, color: "var(--ink-1)" },
    { label: "Replied", value: repliedMessages, color: "#16a34a" },
    { label: "Archived", value: archivedMessages, color: "#64748b" },
    { label: "Need action", value: pendingMessages, color: "#2563eb" },
  ];

  const leadSourceStats = [
    { label: "Contact leads", value: contactLeadCount, note: "General enquiries", color: "#2563eb" },
    { label: "Bookings", value: bookingCount, note: "Paid service intent", color: "#16a34a" },
    { label: "Resource leads", value: resourceLeadCount, note: "Download follow-up", color: "#7c3aed" },
  ];

  const progressStats = [
    { label: "Documents needed", value: documentsNeededCount, note: "Waiting on client", color: "#d97706" },
    { label: "In progress", value: inProgressCount, note: "Active work", color: "#0ea5e9" },
    { label: "Completed", value: completedCount, note: "Closed successfully", color: "#16a34a" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400, color: "var(--ink-1)", marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--ink-4)", fontSize: 14 }}>
          A quick operational view of enquiries, published content, and what needs attention next.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 32 }}>
        {overviewStats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: "none" }}>
            <div
              className="hover-lift"
              style={{
                ...cardStyle,
                background: stat.highlight ? `${stat.color}0d` : "var(--surface)",
                borderColor: stat.highlight ? `${stat.color}40` : "var(--border)",
                padding: 20,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${stat.color}14`,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                {stat.icon}
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 400, color: "var(--ink-1)", lineHeight: 1, marginBottom: 6 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{stat.note}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }} className="grid-2">
        <div style={cardStyle}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 4 }}>Lead source breakdown</h2>
            <p style={{ fontSize: 12.5, color: "var(--ink-4)", margin: 0 }}>
              See where new business is coming from so the homepage and offers can be adjusted with confidence.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            {leadSourceStats.map((item) => (
              <div key={item.label} style={{ padding: "16px 16px 14px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: item.color, lineHeight: 1, marginBottom: 6 }}>{item.value}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 4 }}>Request progress status</h2>
            <p style={{ fontSize: 12.5, color: "var(--ink-4)", margin: 0 }}>
              A quick operations snapshot of what is blocked, active, or completed across client requests.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
            {progressStats.map((item) => (
              <div key={item.label} style={{ padding: "16px 16px 14px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: item.color, lineHeight: 1, marginBottom: 6 }}>{item.value}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "var(--ink-4)" }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, marginBottom: 24 }} className="grid-2">
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12 }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 4 }}>Inbox overview</h2>
              <p style={{ fontSize: 12.5, color: "var(--ink-4)", margin: 0 }}>
                Useful for seeing whether follow-up and reply workload is healthy.
              </p>
            </div>
            <Link href="/admin/messages" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Open inbox <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 18 }}>
            {inboxStats.map((item) => (
              <div key={item.label} style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: item.color, lineHeight: 1, marginBottom: 6 }}>{item.value}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-4)" }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--blue)" }}>
              <ShieldCheck size={15} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Admin guidance</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.7, margin: 0 }}>
              Aim to keep the pending inbox low and the reply rate high. New service demand trends below can help decide which offer to highlight on the public site next.
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 18 }}>Top requested services</h2>
          {serviceInterest.length === 0 ? (
            <p style={{ color: "var(--ink-4)", fontSize: 14, margin: 0 }}>No service-specific enquiries yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {serviceInterest.map((item: { _id: string; count: number }, index: number) => (
                <div key={item._id} style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg-subtle)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 4 }}>#{index + 1} most requested</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-1)" }}>{item._id}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--blue)", lineHeight: 1 }}>{item.count}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="grid-2">
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)" }}>Recent messages</h2>
            <Link href="/admin/messages" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p style={{ color: "var(--ink-4)", fontSize: 14 }}>No messages yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentMessages.map((message: any) => (
                <Link
                  key={message._id}
                  href="/admin/messages"
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 14px",
                    textDecoration: "none",
                    background: message.status === "new" ? "rgba(37,99,235,0.04)" : "var(--bg-subtle)",
                    borderRadius: 12,
                    border: message.status === "new" ? "1px solid rgba(37,99,235,0.14)" : "1px solid transparent",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "var(--blue)",
                      flexShrink: 0,
                    }}
                  >
                    {message.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink-1)" }}>{message.name}</span>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: message.status === "new" ? "var(--blue-bg)" : "var(--surface)",
                          color: message.status === "new" ? "var(--blue)" : "var(--ink-4)",
                          border: "1px solid var(--border)",
                          textTransform: "capitalize",
                        }}
                      >
                        {message.status}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--ink-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {message.service || message.subject || message.message}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontWeight: 700, fontSize: 15, color: "var(--ink-1)", marginBottom: 18 }}>Content library</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 18 }}>
            {contentStats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                style={{
                  textDecoration: "none",
                  padding: "16px 16px 14px",
                  borderRadius: 12,
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                }}
                className="hover-bg"
              >
                <div style={{ color: stat.color, marginBottom: 10 }}>{stat.icon}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--ink-1)", lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-4)" }}>{stat.label}</div>
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Manage services", href: "/admin/services", icon: <Layers size={14} /> },
              { label: "Review messages", href: "/admin/messages", icon: <MessageSquare size={14} /> },
              { label: "Update homepage settings", href: "/admin/settings", icon: <ShieldCheck size={14} /> },
              { label: "Archive resolved enquiries", href: "/admin/messages", icon: <Archive size={14} /> },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 14px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: "var(--ink-2)",
                  fontSize: 14,
                }}
                className="hover-bg"
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {action.icon}
                  {action.label}
                </span>
                <ArrowRight size={13} color="var(--ink-4)" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
