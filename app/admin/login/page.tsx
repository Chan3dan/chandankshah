import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// NOTE: No <html>/<body> — root layout.tsx provides the document shell.
// The login page gets the ThemeProvider wrapper from the root layout automatically.

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user?.email === process.env.ADMIN_EMAIL) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    AccessDenied: "⛔ This Google account is not authorized to access the admin panel.",
    OAuthSignin: "⚠️ Could not start Google sign-in. Please try again.",
    OAuthCallback: "⚠️ Google sign-in failed. Please try again.",
    Default: "⚠️ Sign-in error. Please try again.",
  };
  const errorMsg = error ? (errorMessages[error] || errorMessages.Default) : null;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-subtle)", padding: 20,
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 20, padding: "clamp(28px,6vw,44px)",
          boxShadow: "var(--shadow-lg)",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>C</span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 400,
              color: "var(--ink-1)", marginBottom: 4, margin: "0 0 4px",
            }}>
              Admin Panel
            </h1>
            <p style={{ fontSize: 14, color: "var(--ink-4)", margin: 0 }}>
              Sign in with your authorized Google account
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div style={{
              padding: "12px 16px",
              background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 10, marginBottom: 20, fontSize: 14, color: "#dc2626", textAlign: "center",
            }}>
              {errorMsg}
            </div>
          )}

          {/* Google sign-in */}
          <form action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}>
            <button type="submit" style={{
              width: "100%", padding: "13px 20px",
              background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              fontSize: 15, fontWeight: 600, color: "var(--ink-1)", cursor: "pointer",
              boxShadow: "var(--shadow-xs)", fontFamily: "var(--font-sans)",
              transition: "box-shadow 0.15s",
            }}>
              {/* Google G logo */}
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p style={{ fontSize: 12, color: "var(--ink-4)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
            Only <strong style={{ color: "var(--ink-2)" }}>
              {process.env.ADMIN_EMAIL || "the authorized email"}
            </strong> can access this panel.
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--ink-4)" }}>
          <a href="/" style={{ color: "var(--ink-4)", textDecoration: "none" }}>← Back to site</a>
        </p>
      </div>
    </div>
  );
}
