import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resource } from "@/models";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query: Record<string, unknown> = { isActive: true };
    if (category && category !== "all") query.category = category;
    const resources = await Resource.find(query).sort({ isFeatured: -1, sortOrder: 1, createdAt: -1 });
    return NextResponse.json(resources);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const body = await req.json();
    const count = await Resource.countDocuments();
    const resource = await Resource.create({ ...body, sortOrder: count });
    return NextResponse.json(resource, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
