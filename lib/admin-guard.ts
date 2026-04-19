import { auth } from "./auth";
import { NextResponse } from "next/server";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export async function requireAdmin() {
  const session = await auth();
  const sessionEmail = normalizeEmail(session?.user?.email);
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);

  if (!sessionEmail || !adminEmail || sessionEmail !== adminEmail) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return normalizeEmail(session?.user?.email) === normalizeEmail(process.env.ADMIN_EMAIL);
}
