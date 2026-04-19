import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await BlogPost.findOne({ $or: [{ _id: id }, { slug: id }] });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const words = (body.content || "").split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    if (body.isPublished && !body.publishedAt) body.publishedAt = new Date();
    const updated = await BlogPost.findByIdAndUpdate(id, { ...body, readTime }, { new: true });
    return NextResponse.json(updated);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const { id } = await params;
    await BlogPost.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
