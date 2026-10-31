import { createTransport } from "nodemailer";
import { z } from "zod";
import { isEnquiryConfigured, lookupServiceId, writePrivateRow, getAllCopy } from "@/lib/supabase-content";

const recipient = process.env.SMTP_TO_EMAIL || process.env.RESEND_TO_EMAIL || "computersupreme0@gmail.com";
const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "Supreme Computer <computersupreme0@gmail.com>";

const whatsappPhone = process.env.WHATSAPP_PHONE || "";
const whatsappApiKey = process.env.WHATSAPP_API_KEY || "";
const whatsappEnabled = (process.env.WHATSAPP_ENABLED || "false") === "true";

const transporter = createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: (process.env.SMTP_SECURE || "true") === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.union([z.string().trim().email().max(254), z.literal("")]),
  phone: z.string().trim().max(35),
  serviceId: z.union([z.string().regex(/^S\d{2}$/), z.literal("general")]),
  message: z.string().trim().min(10).max(1500),
  privacyAcknowledged: z.literal(true),
  website: z.string().max(200).optional(), // spam honeypot; never rendered to visitors
}).refine((data) => Boolean(data.email || data.phone), {
  message: "Please provide an email address or phone number.",
  path: ["email"],
});

const rateWindowMs = 15 * 60 * 1000;
const requests = new Map<string, { count: number; until: number }>();

function configured() {
  return isEnquiryConfigured;
}

async function sendWhatsApp(text: string): Promise<{ ok: boolean; error?: string }> {
  if (!whatsappEnabled || !whatsappPhone || !whatsappApiKey) return { ok: false, error: "not_configured" };
  const phone = whatsappPhone.replace(/\D/g, "");
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(whatsappApiKey)}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    const body = await response.text();
    if (response.ok && body.toLowerCase().includes("success")) return { ok: true };
    return { ok: false, error: body.slice(0, 200) || `http_${response.status}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network_error" };
  }
}

export async function GET() {
  return Response.json({ enabled: configured() }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request: Request) {
  const copy = await getAllCopy().catch(() => ({} as Record<string, string>));
  const apiText = (key: string, fallback: string) => copy[`api.${key}`] || fallback;

  if (!configured()) {
    return Response.json({ error: apiText("error_not_configured", "Online enquiries are being configured. Please contact us directly.") }, { status: 503 });
  }

  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > 10_000) return Response.json({ error: "Message too long." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Please check the enquiry fields." }, { status: 400 });
  }

  // Silently drop automated honeypot submissions.
  if (parsed.data.website) return Response.json({ accepted: true });

  // Best-effort edge-isolate throttle, plus the honeypot. A shared rate limiter
  // or bot challenge should be configured before broad public traffic.
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  const previous = requests.get(ip);
  if (previous && previous.until > now && previous.count >= 5) {
    return Response.json({ error: apiText("error_rate_limit", "Too many enquiries. Please try again later or call us.") }, { status: 429 });
  }
  if (requests.size > 2000) requests.clear();
  requests.set(ip, previous && previous.until > now
    ? { count: previous.count + 1, until: previous.until }
    : { count: 1, until: now + rateWindowMs });

  const data = parsed.data;
  let serviceId: string | null = null;
  try {
    if (data.serviceId !== "general") {
      serviceId = await lookupServiceId(data.serviceId);
      if (!serviceId) return Response.json({ error: "Please choose an available service." }, { status: 400 });
    }
  } catch {
    return Response.json({ error: apiText("error_service_unavailable", "We can't verify the selected service right now. Please try again.") }, { status: 503 });
  }

  let reference: string;
  try {
    const saved = await writePrivateRow<{ id: string }>("sc_contact_submissions", {
      service_id: serviceId, name: data.name, email: data.email || null,
      phone: data.phone || null, message: data.message, privacy_acknowledged: true,
    });
    reference = saved.id;
  } catch {
    return Response.json({ error: apiText("error_save_failed", "We couldn't save your enquiry. Please call or use WhatsApp instead.") }, { status: 503 });
  }

  const serviceName = data.serviceId === "general" ? "General enquiry" : `Service ${data.serviceId}`;
  const text = [
    apiText("email_body_header", "New Supreme Computer website enquiry"),
    `Reference: ${reference}`,
    `Service: ${serviceName}`,
    `Name: ${data.name}`,
    `Email: ${data.email || "Not provided"}`,
    `Phone: ${data.phone || "Not provided"}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  let emailed = false;
  let confirmation = false;
  let whatsappSent = false;
  let errorSummary: string | null = null;
  let whatsappError: string | null = null;
  const mailConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  // Owner notification — email
  if (mailConfigured) try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: recipient,
      subject: apiText("email_subject", "Supreme Computer enquiry") + ` — ${serviceName}`,
      text,
      ...(data.email ? { replyTo: data.email } : {}),
    });
    emailed = info.accepted.length > 0;

    // Sender confirmation
    if (data.email) {
      const confirmText = [
        apiText("confirm_body_header", "Thank you for contacting Supreme Computer."),
        "",
        `Reference: ${reference}`,
        `Service: ${serviceName}`,
        `Name: ${data.name}`,
        "",
        "We have received your enquiry and will be in touch shortly.",
        "",
        "Your message:",
        data.message,
      ].join("\n");
      await transporter.sendMail({
        from: fromEmail,
        to: data.email,
        subject: apiText("confirm_subject", "We received your enquiry") + ` — ${serviceName}`,
        text: confirmText,
      });
      confirmation = true;
    }
  } catch (err) {
    errorSummary = err instanceof Error ? err.message : "provider_error";
  }

  // Owner notification — WhatsApp via CallMeBot
  const whatsappText = [
    apiText("whatsapp_header", "*New Supreme Computer enquiry*"),
    `Ref: ${reference}`,
    `Service: ${serviceName}`,
    `Name: ${data.name}`,
    `Email: ${data.email || "Not provided"}`,
    `Phone: ${data.phone || "Not provided"}`,
    "",
    data.message.slice(0, 800),
  ].join("\n");
  const waResult = await sendWhatsApp(whatsappText);
  whatsappSent = waResult.ok;
  whatsappError = waResult.error || null;

  // Log delivery attempts. A saved enquiry is never lost just because delivery was unsuccessful.
  try {
    await writePrivateRow("sc_email_notifications", {
      contact_id: reference, provider: "gmail-smtp", status: !mailConfigured ? "pending" : emailed ? "sent" : "failed",
      provider_message_id: null, error_summary: errorSummary || (!mailConfigured ? "not_configured" : null),
      attempted_at: emailed || errorSummary ? new Date().toISOString() : null,
    });
  } catch {
    // The contact row is the durable source of truth.
  }
  try {
    await writePrivateRow("sc_email_notifications", {
      contact_id: reference, provider: "callmebot-whatsapp", status: whatsappSent ? "sent" : "failed",
      provider_message_id: null, error_summary: whatsappError,
      attempted_at: new Date().toISOString(),
    });
  } catch {
    // If the unique constraint on contact_id is still present, the second log may fail.
  }

  return Response.json({ accepted: true, reference, emailed, confirmation, whatsapp: whatsappSent }, { status: 201 });
}
