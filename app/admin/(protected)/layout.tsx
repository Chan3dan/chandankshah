import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

// NOTE: No <html> or <body> here — the root layout.tsx already provides those.
// Adding them again causes the hydration mismatch error.

export const metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: "noindex, nofollow",
};

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login?error=AccessDenied");
  }

  return (
    <AdminShell
      user={{
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }}
    >
      {children}
    </AdminShell>
  );
}
