import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models";
import { requireAdmin } from "@/lib/admin-guard";
import slugify from "slugify";
import { syncDefaultPortfolioProjects } from "@/lib/portfolio";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await syncDefaultPortfolioProjects();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const query: Record<string, unknown> = { isActive: true };
    if (featured === "true") query.featured = true;
    const projects = await Project.find(query).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const body = await req.json();
    const slug = slugify(body.title, { lower: true, strict: true });
    const count = await Project.countDocuments();
    const project = await Project.create({ ...body, slug, sortOrder: count });
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
