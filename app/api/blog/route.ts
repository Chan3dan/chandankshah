import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { BlogPost } from "@/models";
import { requireAdmin } from "@/lib/admin-guard";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all"); // admin: show unpublished too
    const query = all ? {} : { isPublished: true };
    const posts = await BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 }).select("-content");
    return NextResponse.json(posts);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const body = await req.json();
    const slug = slugify(body.title, { lower: true, strict: true });
    // estimate read time
    const words = (body.content || "").split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    const post = await BlogPost.create({
      ...body, slug, readTime,
      publishedAt: body.isPublished ? new Date() : undefined,
    });
    return NextResponse.json(post, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
