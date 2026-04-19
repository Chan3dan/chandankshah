import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models";
import { requireAdmin } from "@/lib/admin-guard";
import { sendContactNotification, sendAutoReply } from "@/lib/email";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "";

    // Cloudflare Turnstile verification
    if (process.env.TURNSTILE_SECRET_KEY && body.cfToken) {
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: body.cfToken,
          remoteip: ip,
        }),
      });
      const result = await verify.json();
      if (!result.success) {
        return NextResponse.json({ error: "Spam check failed. Please try again." }, { status: 400 });
      }
    }

    // Strip cfToken from stored data
    const { cfToken: _cf, ...messageData } = body;
    const message = await Message.create({ ...messageData, ip });

    // Send emails (non-blocking — failures don't affect response)
    await Promise.all([
      sendContactNotification(messageData),
      sendAutoReply(messageData),
    ]);

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
