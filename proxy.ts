// proxy.ts — Next.js 16 convention (replaces middleware.ts)
// Route protection is handled in the (protected) layout via auth()
// This proxy just passes all requests through — no redirect logic here
// to avoid any possibility of redirect loops.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Only run on admin paths — but we do NOT redirect here
  // The (protected)/layout.tsx handles auth checks server-side
  matcher: ["/admin/:path*"],
};
