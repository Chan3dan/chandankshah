import { signIn, auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Login" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await auth();
  if (!error && isAdminEmail(session?.user?.email)) redirect("/admin");

  const msgs: Record<string, string> = {
    AccessDenied: "⛔ This Google account is not authorized. Check that ADMIN_EMAIL in Vercel matches your Gmail exactly (no spaces, lowercase).",
    OAuthCallback: "⚠️ Google sign-in failed. Add your Vercel URL to Authorized Redirect URIs in Google Console.",
    Configuration: "⚙️ Server config error. Check all env vars are set in Vercel.",
    Default: "⚠️ Sign-in error. Please try again.",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-subtle)", padding: "clamp(16px,4vw,24px)", fontFamily: "var(--font-sans)" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: "clamp(24px,5vw,44px)", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#2563eb,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>C</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, color: "var(--ink-1)", margin: "0 0 6px" }}>Admin Panel</h1>
            <p style={{ fontSize: 13, color: "var(--ink-4)", margin: 0 }}>Sign in with your authorized Google account</p>
          </div>

          {error && (
            <div style={{ padding: "14px 16px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 10, marginBottom: 20, fontSize: 13.5, color: "#dc2626", lineHeight: 1.55 }}>
              {msgs[error] ?? msgs.Default}
              {error === "AccessDenied" && (
                <ol style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 12, color: "#9a3412" }}>
                  <li>Vercel → Settings → Env Vars → ADMIN_EMAIL must be your exact Gmail</li>
                  <li>Google Console → add <code>https://your-domain.vercel.app/api/auth/callback/google</code></li>
                  <li>Redeploy after changing env vars</li>
                </ol>
              )}
            </div>
          )}

          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/admin" }); }}>
            <button type="submit" style={{ width: "100%", padding: "13px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 15, fontWeight: 600, color: "var(--ink-1)", cursor: "pointer", boxShadow: "var(--shadow-xs)", fontFamily: "var(--font-sans)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </form>

          <p style={{ fontSize: 12, color: "var(--ink-4)", textAlign: "center", marginTop: 18 }}>
            Only <strong>{process.env.ADMIN_EMAIL?.replace(/(.{2}).+(@.+)/, "$1…$2") || "authorized email"}</strong> can access this panel.
          </p>
        </div>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--ink-4)" }}>
          <a href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>← Back to site</a>
        </p>
      </div>
    </div>
  );
}
