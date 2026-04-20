import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models";
import { PROGRESS_STATUS_META } from "@/lib/message-tracking";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const trackingCode = String(body.trackingCode || "").trim().toUpperCase();
    const rawContactValue = String(body.contactValue || "").trim();
    const contactValue = rawContactValue.toLowerCase();
    const normalizedPhone = rawContactValue.replace(/[^0-9]/g, "");

    if (!trackingCode || !contactValue) {
      return NextResponse.json({ error: "Tracking code and phone/email are required." }, { status: 400 });
    }

    const message = await Message.findOne({ trackingCode }).lean() as any;

    const emailMatches = message?.email?.trim().toLowerCase() === contactValue;
    const phoneMatches = message?.phone?.replace(/[^0-9]/g, "") === normalizedPhone;

    if (!message || (!emailMatches && !phoneMatches)) {
      return NextResponse.json({ error: "No matching request was found." }, { status: 404 });
    }

    return NextResponse.json({
      trackingCode: message.trackingCode,
      requestType: message.requestType,
      service: message.service,
      subject: message.subject,
      progressStatus: message.progressStatus,
      progressLabel: PROGRESS_STATUS_META[message.progressStatus as keyof typeof PROGRESS_STATUS_META]?.label || "Received",
      progressDescription: PROGRESS_STATUS_META[message.progressStatus as keyof typeof PROGRESS_STATUS_META]?.description || "",
      adminNotes: message.adminNotes || "",
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    });
  } catch {
    return NextResponse.json({ error: "Failed to check request status." }, { status: 500 });
  }
}
