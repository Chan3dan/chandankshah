import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/models";
import { requireAdmin } from "@/lib/admin-guard";
import slugify from "slugify";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(services);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await connectDB();
    const body = await req.json();
    const slug = slugify(body.title, { lower: true, strict: true });
    const count = await Service.countDocuments();
    const service = await Service.create({ ...body, slug, sortOrder: count });
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
