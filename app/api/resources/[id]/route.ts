import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resource } from "@/models";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const updated = await Resource.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const { id } = await params;
    await Resource.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

// Increment download count — called when user downloads a resource
export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const resource = await Resource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true });
    if (!resource) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Redirect to actual file
    const url = resource.fileUrl || resource.externalUrl;
    if (url) return NextResponse.redirect(url);
    return NextResponse.json({ error: "No file URL" }, { status: 404 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
