import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "hello@chandankshah.com.np";
const TO = process.env.EMAIL_TO || "your@email.com";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

// ── Contact form notification to admin ──────────────────────────────────────
export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
}) {
  const resend = getResendClient();
  if (!resend) return; // Skip if not configured

  try {
    await resend.emails.send({
      from: `CKS Website <${FROM}>`,
      to: TO,
      replyTo: data.email || undefined,
      subject: `📬 New Enquiry: ${data.service || data.subject || "Contact Form"}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f5f4f1;font-family:'Segoe UI',system-ui,sans-serif;">
          <div style="max-width:560px;margin:32px auto;padding:0 16px;">
            <div style="background:#fff;border:1px solid #e4e2dc;border-radius:16px;overflow:hidden;">
              <!-- Header -->
              <div style="background:linear-gradient(135deg,#2563eb,#0ea5e9);padding:28px 32px;">
                <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">New Enquiry Received</h1>
                <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu", dateStyle: "full", timeStyle: "short" })} NST</p>
              </div>
              <!-- Body -->
              <div style="padding:28px 32px;">
                <table style="width:100%;border-collapse:collapse;">
                  ${[
                    ["Name", data.name],
                    ["Email", data.email],
                    ["Phone", data.phone || "—"],
                    ["Service", data.service || "—"],
                    ["Subject", data.subject || "—"],
                  ].map(([label, value]) => `
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:13px;color:#78716c;width:100px;vertical-align:top;">${label}</td>
                      <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:14px;color:#1c1917;font-weight:600;">${value}</td>
                    </tr>
                  `).join("")}
                </table>
                <div style="margin-top:20px;padding:16px;background:#f5f4f1;border-radius:10px;border-left:3px solid #2563eb;">
                  <p style="margin:0 0 6px;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
                  <p style="margin:0;font-size:15px;color:#1c1917;line-height:1.7;">${data.message.replace(/\n/g, "<br>")}</p>
                </div>
                <!-- CTA -->
                <div style="margin-top:24px;display:flex;gap:12px;">
                  ${data.email ? `<a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || data.service || "Your enquiry")}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Reply by Email</a>` : ""}
                  ${data.phone ? `<a href="https://wa.me/${data.phone.replace(/[^0-9]/g, "")}?text=Hello+${encodeURIComponent(data.name)}%2C+regarding+your+enquiry..." style="display:inline-block;padding:10px 20px;background:#25d366;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">WhatsApp</a>` : ""}
                  <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/messages" style="display:inline-block;padding:10px 20px;background:#f5f4f1;color:#1c1917;border:1px solid #e4e2dc;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">View in Admin</a>
                </div>
              </div>
              <div style="padding:16px 32px;background:#f5f4f1;border-top:1px solid #e4e2dc;font-size:12px;color:#a8a29e;text-align:center;">
                Sent from chandankshah.com.np — Admin Panel: /admin/messages
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("[Email] Failed to send contact notification:", err);
    // Don't throw — email failure shouldn't break form submission
  }
}

// ── Auto-reply to the person who submitted the form ─────────────────────────
export async function sendAutoReply(data: {
  name: string;
  email: string;
  service: string;
}) {
  const resend = getResendClient();
  if (!resend || !data.email) return;

  try {
    await resend.emails.send({
      from: `Chandan Kumar Shah <${FROM}>`,
      to: data.email,
      subject: `✅ Got your message — I'll reply shortly`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f5f4f1;font-family:'Segoe UI',system-ui,sans-serif;">
          <div style="max-width:520px;margin:32px auto;padding:0 16px;">
            <div style="background:#fff;border:1px solid #e4e2dc;border-radius:16px;overflow:hidden;">
              <div style="background:linear-gradient(135deg,#2563eb,#0ea5e9);padding:28px 32px;text-align:center;">
                <div style="width:52px;height:52px;background:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:12px;">✅</div>
                <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">Message Received!</h1>
              </div>
              <div style="padding:28px 32px;">
                <p style="font-size:16px;color:#1c1917;margin:0 0 14px;">Hi <strong>${data.name}</strong>,</p>
                <p style="font-size:15px;color:#44403c;line-height:1.7;margin:0 0 14px;">
                  Thanks for reaching out about <strong>${data.service || "your enquiry"}</strong>. I've received your message and will get back to you within <strong>2–4 hours</strong> during business hours (Mon–Sat, 9am–7pm NST).
                </p>
                <p style="font-size:15px;color:#44403c;line-height:1.7;margin:0 0 24px;">
                  If it's urgent, you can reach me directly on WhatsApp:
                </p>
                <div style="text-align:center;">
                  <a href="https://wa.me/${process.env.WHATSAPP_NUMBER || "977980000000"}" style="display:inline-block;padding:12px 28px;background:#25d366;color:#fff;border-radius:10px;text-decoration:none;font-size:15px;font-weight:700;">
                    💬 WhatsApp Me
                  </a>
                </div>
              </div>
              <div style="padding:16px 32px;background:#f5f4f1;border-top:1px solid #e4e2dc;font-size:12px;color:#a8a29e;text-align:center;">
                Chandan Kumar Shah · chandankshah.com.np
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("[Email] Failed to send auto-reply:", err);
  }
}
