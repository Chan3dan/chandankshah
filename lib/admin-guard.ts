import { auth } from "./auth";
import { isAdminEmail } from "./auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return isAdminEmail(session?.user?.email);
}
